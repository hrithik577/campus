'use client';

import React from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  inputSize?: 'md' | 'lg';
}

const sizeClasses = {
  md: 'h-11 text-[14px]',
  lg: 'h-13 text-[15px]',
};

/** Shared text input — search fields, report forms, admin filters. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leadingIcon, trailingIcon, inputSize = 'md', className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute left-3.5 text-[var(--ink-tertiary)] pointer-events-none [&>svg]:w-[18px] [&>svg]:h-[18px]">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]',
            'text-[var(--ink)] placeholder:text-[var(--ink-tertiary)]',
            'transition-colors duration-[var(--duration-fast)]',
            'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none',
            sizeClasses[inputSize],
            leadingIcon ? 'pl-10' : 'pl-3.5',
            trailingIcon ? 'pr-10' : 'pr-3.5',
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute right-3.5 text-[var(--ink-tertiary)] [&>svg]:w-[18px] [&>svg]:h-[18px]">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/** Label + input + helper/error text, stacked with consistent spacing. */
export const Field: React.FC<{
  label?: string;
  htmlFor?: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, htmlFor, error, helper, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <label htmlFor={htmlFor} className="text-caption font-semibold text-[var(--ink-secondary)]">
        {label}
      </label>
    )}
    {children}
    {error ? (
      <span className="text-caption text-[var(--danger)]">{error}</span>
    ) : helper ? (
      <span className="text-caption">{helper}</span>
    ) : null}
  </div>
);
