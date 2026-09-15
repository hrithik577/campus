import React from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--surface-muted)] text-[var(--ink-secondary)]',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent-ink)] border border-[var(--accent-border)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-border)]',
  info: 'bg-[var(--info-soft)] text-[var(--info)] border border-[var(--info-border)]',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

/** Small status/category pill — building status, ticket priority, category tag. */
export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', icon, className, children, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-sm)]',
      'text-micro',
      toneClasses[tone],
      className
    )}
    {...props}
  >
    {icon && <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>}
    {children}
  </span>
);

const dotToneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--ink-tertiary)]',
  accent: 'bg-[var(--accent)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  danger: 'bg-[var(--danger)]',
  info: 'bg-[var(--info)]',
};

/** Live status indicator dot — optionally pulsing for "active now" states. */
export const StatusDot: React.FC<{ tone?: BadgeTone; pulse?: boolean; className?: string }> = ({
  tone = 'success',
  pulse = false,
  className,
}) => (
  <span className={cn('relative inline-flex w-2 h-2', className)}>
    {pulse && (
      <span
        className={cn('absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping', dotToneClasses[tone])}
      />
    )}
    <span className={cn('relative inline-flex rounded-full w-2 h-2', dotToneClasses[tone])} />
  </span>
);
