'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton } from '../ui';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  snapPoints?: ('collapsed' | 'half' | 'full')[];
  initialSnap?: 'collapsed' | 'half' | 'full';
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  initialSnap = 'half'
}) => {
  const [snapState, setSnapState] = useState<'collapsed' | 'half' | 'full'>(initialSnap);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) setSnapState(initialSnap);
  }, [isOpen, initialSnap]);

  if (!isOpen) return null;

  const toggleSnap = () => {
    if (snapState === 'collapsed') setSnapState('half');
    else if (snapState === 'half') setSnapState('full');
    else setSnapState('half');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    setTouchStartY(null);

    // Swipe down threshold (>50px)
    if (deltaY > 50) {
      if (snapState === 'full') setSnapState('half');
      else if (snapState === 'half') setSnapState('collapsed');
      else onClose();
    }
    // Swipe up threshold (<-50px)
    else if (deltaY < -50) {
      if (snapState === 'collapsed') setSnapState('half');
      else if (snapState === 'half') setSnapState('full');
    }
  };

  const snapClasses = {
    collapsed: 'h-[140px]',
    half: 'h-[50vh]',
    full: 'h-[86vh]'
  };

  return (
    <div className="fixed inset-0 z-[var(--z-sheet)] lg:hidden flex flex-col justify-end pointer-events-none animate-in fade-in duration-[var(--duration-base)]">

      {/* Backdrop (Active only on half / full states) */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[var(--surface-overlay)] transition-opacity duration-[var(--duration-base)] ${
          snapState === 'collapsed' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      />

      {/* Bottom Sheet Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 w-full pointer-events-auto mobile-sheet-surface flex flex-col transition-all duration-[var(--duration-sheet)] ease-[var(--ease-decelerate)] ${snapClasses[snapState]} pb-[max(1rem,env(safe-area-inset-bottom))]`}
      >

        {/* Drag Handle Indicator Header */}
        <div
          onClick={toggleSnap}
          className="w-full py-2 flex flex-col items-center justify-center cursor-pointer select-none rounded-t-[var(--radius-xl)] touch-target"
        >
          <div className="w-10 h-1 bg-[var(--border-strong)] rounded-full mb-1" />
          <div className="flex items-center gap-1 text-micro text-[var(--ink-tertiary)]">
            <span>{snapState === 'full' ? 'Collapse' : snapState === 'collapsed' ? 'Expand Details' : 'Swipe for More'}</span>
            {snapState === 'full' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </div>

        {/* Optional Title Header */}
        {(title || subtitle) && (
          <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            <div>
              {title && <h3 className="text-heading">{title}</h3>}
              {subtitle && <p className="text-caption mt-0.5">{subtitle}</p>}
            </div>
            <IconButton icon={<X />} aria-label="Close" variant="secondary" size="sm" onClick={onClose} />
          </div>
        )}

        {/* Sheet Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {children}
        </div>

      </div>
    </div>
  );
};
