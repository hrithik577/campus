'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { IconButton } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

/** Centered desktop modal / dialog. Mobile flows should prefer a bottom sheet instead. */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-[var(--surface-overlay)] transition-opacity duration-[var(--duration-base)]"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]',
          'border border-[var(--border)] flex flex-col max-h-[85vh]',
          maxWidth
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-3 p-5 border-b border-[var(--border-subtle)] shrink-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-title">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-caption mt-1">{subtitle}</p>}
            </div>
            <IconButton icon={<X />} aria-label="Close dialog" variant="ghost" size="sm" onClick={onClose} />
          </div>
        )}
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};
