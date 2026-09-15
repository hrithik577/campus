'use client';

import React from 'react';
import { cn } from '../../lib/cn';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
}

/**
 * Pill-style segmented control — layer toggles on the map, floor selector,
 * category filters. Replaces one-off flex-of-buttons patterns.
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
  fullWidth = false,
}) => (
  <div
    role="tablist"
    className={cn(
      'inline-flex items-center gap-0.5 p-1 bg-[var(--surface-muted)] rounded-[var(--radius-md)]',
      fullWidth && 'w-full',
      className
    )}
  >
    {options.map((opt) => {
      const active = opt.value === value;
      return (
        <button
          key={opt.value}
          role="tab"
          aria-selected={active}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex items-center justify-center gap-1.5 h-9 px-3 rounded-[var(--radius-sm)] text-[13px] font-semibold',
            'transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-ring',
            fullWidth && 'flex-1',
            active
              ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-xs)]'
              : 'text-[var(--ink-tertiary)] hover:text-[var(--ink-secondary)]'
          )}
        >
          {opt.icon && <span className="[&>svg]:w-4 [&>svg]:h-4">{opt.icon}</span>}
          {opt.label}
        </button>
      );
    })}
  </div>
);
