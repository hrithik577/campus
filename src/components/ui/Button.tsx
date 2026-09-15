'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[var(--accent-700)] shadow-[var(--shadow-sm)] disabled:bg-[var(--ink-tertiary)]',
  secondary:
    'bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--surface-sunken)] active:bg-[var(--border)]',
  outline:
    'bg-transparent text-[var(--ink)] border border-[var(--border-strong)] hover:bg-[var(--surface-muted)] active:bg-[var(--surface-sunken)]',
  ghost:
    'bg-transparent text-[var(--ink-secondary)] hover:bg-[var(--surface-muted)] active:bg-[var(--surface-sunken)]',
  danger:
    'bg-[var(--danger)] text-white hover:brightness-95 active:brightness-90 shadow-[var(--shadow-sm)]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px] gap-1.5 rounded-[var(--radius-sm)]',
  md: 'h-11 px-4 text-[14px] gap-2 rounded-[var(--radius-md)]',
  lg: 'h-13 px-5 text-[15px] gap-2 rounded-[var(--radius-lg)]',
};

/**
 * Shared button primitive. Every clickable action in the product (nav CTAs,
 * sheet primary actions, admin controls) should route through this so
 * hover/active/disabled/loading states stay consistent everywhere.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold whitespace-nowrap select-none',
          'transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          'focus-ring disabled:cursor-not-allowed disabled:opacity-60',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/** Circular icon-only button — map controls, sheet dismiss, header actions. */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'icon' | 'iconPosition' | 'children' | 'fullWidth'> & {
    icon: React.ReactNode;
    'aria-label': string;
  }
>(({ variant = 'secondary', size = 'md', icon, className, disabled, loading, ...props }, ref) => {
  const dims: Record<ButtonSize, string> = {
    sm: 'w-9 h-9 rounded-[var(--radius-sm)]',
    md: 'w-11 h-11 rounded-[var(--radius-md)]',
    lg: 'w-13 h-13 rounded-[var(--radius-lg)]',
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center shrink-0 touch-target',
        'transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'focus-ring disabled:cursor-not-allowed disabled:opacity-60 active:scale-95',
        variantClasses[variant],
        dims[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <span className="[&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>
      )}
    </button>
  );
});
IconButton.displayName = 'IconButton';
