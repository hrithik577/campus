'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end pointer-events-none animate-in fade-in duration-200">
      
      {/* Backdrop (Active only on half / full states) */}
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-slate-950/30 backdrop-blur-xs transition-opacity duration-200 ${
          snapState === 'collapsed' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`} 
      />

      {/* Bottom Sheet Container */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 w-full pointer-events-auto bg-white/98 backdrop-blur-xl border-t border-slate-200/90 rounded-t-3xl shadow-2xl flex flex-col transition-all duration-300 ease-out ${snapClasses[snapState]} pb-[max(1rem,env(safe-area-inset-bottom))]`}
      >
        
        {/* Drag Handle Indicator Header */}
        <div 
          onClick={toggleSnap}
          className="w-full py-2 flex flex-col items-center justify-center cursor-pointer select-none rounded-t-3xl touch-target-48"
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full mb-1" />
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{snapState === 'full' ? 'Collapse' : snapState === 'collapsed' ? 'Expand Details' : 'Swipe for More'}</span>
            {snapState === 'full' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </div>

        {/* Optional Title Header */}
        {(title || subtitle) && (
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              {title && <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{title}</h3>}
              {subtitle && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
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
