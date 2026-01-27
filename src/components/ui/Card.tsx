// src/components/ui/Card.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white transition-all duration-150 ease-out',
        'p-4 sm:p-6',
        'hover:shadow-md hover:-translate-y-0.5',
        variant === 'bordered' && 'border border-gray-200',
        variant === 'elevated' && 'shadow-lg',
        variant === 'default' && 'shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mb-4 sm:mb-6 border-b border-gray-100 pb-4 transition-colors duration-200', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

