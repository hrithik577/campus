import React from 'react';
import { cn } from '../../lib/cn';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  padded?: boolean;
}

/**
 * Shared surface container — desktop contextual panels, admin cards, list
 * items. Keeps radius/border/shadow consistent instead of each screen
 * inventing its own card treatment.
 */
export const Panel: React.FC<PanelProps> = ({ elevated = false, padded = true, className, children, ...props }) => (
  <div
    className={cn(
      'bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)]',
      elevated ? 'shadow-[var(--shadow-md)]' : 'shadow-[var(--shadow-xs)]',
      padded && 'p-4',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const PanelHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className }) => (
  <div className={cn('flex items-start justify-between gap-3 mb-3', className)}>
    <div>
      <h3 className="text-heading">{title}</h3>
      {subtitle && <p className="text-caption mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);
