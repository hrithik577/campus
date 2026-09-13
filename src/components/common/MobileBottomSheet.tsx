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

  useEffect(() => {
    if (isOpen) setSnapState(initialSnap);
  }, [isOpen, initialSnap]);

  if (!isOpen) return null;

  const toggleSnap = () => {
    if (snapState === 'half') setSnapState('full');
    else if (snapState === 'full') setSnapState('collapsed');
    else setSnapState('half');
  };

  const snapClasses = {
    collapsed: 'h-[120px]',
    half: 'h-[55vh]',
    full: 'h-[92vh]'
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" 
      />

      {/* Bottom Sheet Container */}
      <div className={`relative z-10 w-full mobile-sheet-surface flex flex-col transition-all duration-300 ease-out ${snapClasses[snapState]} pb-[max(1rem,env(safe-area-inset-bottom))]`}>
        
        {/* Drag Handle Indicator Header */}
        <div 
          onClick={toggleSnap}
          className="w-full py-2.5 flex flex-col items-center justify-center cursor-pointer select-none touch-target-48 active:bg-slate-100/50 rounded-t-3xl"
        >
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1" />
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span>{snapState === 'full' ? 'Tap to Collapse' : 'Tap to Expand'}</span>
            {snapState === 'full' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </div>
        </div>

        {/* Optional Title Header */}
        {(title || subtitle) && (
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              {title && <h3 className="font-extrabold text-slate-900 text-base leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center shrink-0 touch-target-48"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Sheet Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {children}
        </div>

      </div>
    </div>
  );
};
