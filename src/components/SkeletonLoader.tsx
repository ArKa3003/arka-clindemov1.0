// src/components/SkeletonLoader.tsx
'use client';

import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'badge';
  width?: string;
  height?: string;
}

export function SkeletonLoader({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  if (variant === 'card') {
    return (
      <div className={clsx('p-6 space-y-4', className)}>
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
      </div>
    );
  }
  
  if (variant === 'circle') {
    return (
      <div
        className={clsx(
          baseClasses,
          'rounded-full',
          width || 'w-16',
          height || 'h-16',
          className
        )}
      />
    );
  }
  
  if (variant === 'badge') {
    return (
      <div className={clsx(baseClasses, 'h-6 w-20', className)} />
    );
  }
  
  return (
    <div
      className={clsx(
        baseClasses,
        'h-4',
        width || 'w-full',
        height,
        className
      )}
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Traffic Light Skeleton */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
        <SkeletonLoader variant="circle" width="w-32" height="h-32" />
        <SkeletonLoader width="w-64" height="h-8" />
        <div className="flex gap-2">
          <SkeletonLoader variant="badge" />
          <SkeletonLoader variant="badge" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-4">
        <SkeletonLoader variant="card" />
        <SkeletonLoader variant="card" />
      </div>
    </div>
  );
}

