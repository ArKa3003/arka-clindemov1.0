// src/components/ui/Badge.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        // Variants with icons for colorblind accessibility
        variant === 'default' && 'bg-gray-100 text-gray-800',
        variant === 'success' && 'bg-teal-100 text-teal-800 border border-teal-300',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800 border border-yellow-300',
        variant === 'error' && 'bg-red-100 text-red-800 border border-red-300',
        variant === 'info' && 'bg-blue-100 text-blue-800 border border-blue-300',
        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-sm',
        size === 'md' && 'px-3 py-1 text-base'
      )}
      role="status"
      aria-label={
        variant === 'success' ? 'Success' :
        variant === 'warning' ? 'Warning' :
        variant === 'error' ? 'Error' :
        variant === 'info' ? 'Information' :
        'Default'
      }
    >
      {/* Add icon prefix for colorblind users */}
      {variant === 'success' && <span className="mr-1" aria-hidden="true">✓</span>}
      {variant === 'warning' && <span className="mr-1" aria-hidden="true">⚠</span>}
      {variant === 'error' && <span className="mr-1" aria-hidden="true">✗</span>}
      {variant === 'info' && <span className="mr-1" aria-hidden="true">ℹ</span>}
      {children}
    </span>
  );
}

