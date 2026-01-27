'use client';

import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FieldErrorProps {
  id: string;
  message: string;
  className?: string;
}

/** Inline error below an input. Use id for aria-describedby on the input. */
export function FieldError({ id, message, className }: FieldErrorProps) {
  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={clsx(
        'form-field-error mt-1 flex items-start gap-1.5 text-[13px] leading-snug',
        className
      )}
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#dc2626]"
        aria-hidden
      />
      <span>{message}</span>
    </div>
  );
}
