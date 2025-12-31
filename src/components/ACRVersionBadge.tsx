// src/components/ACRVersionBadge.tsx
'use client';

import { useState } from 'react';
import { 
  ACR_DATABASE_VERSION, 
  LAST_CRITERIA_UPDATE, 
  CRITERIA_SOURCE_URL,
  getLastUpdatedDisplay 
} from '@/lib/acr-criteria';
import { clsx } from 'clsx';

interface ACRVersionBadgeProps {
  showTooltip?: boolean;
  variant?: 'default' | 'compact';
}

export function ACRVersionBadge({ 
  showTooltip = true, 
  variant = 'default' 
}: ACRVersionBadgeProps = {}) {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const lastUpdated = getLastUpdatedDisplay();

  return (
    <div className="relative inline-flex items-center">
      <div 
        className={clsx(
          'inline-flex items-center gap-2 rounded-md bg-gray-100 border border-gray-300',
          variant === 'compact' ? 'px-2 py-1' : 'px-3 py-1.5',
          showTooltip && 'cursor-help'
        )}
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        onFocus={() => showTooltip && setShowTooltipState(true)}
        onBlur={() => setShowTooltipState(false)}
      >
        <span className={clsx('font-medium text-gray-700', variant === 'compact' ? 'text-xs' : 'text-sm')}>
          {variant === 'compact' ? (
            <>ACR v{ACR_DATABASE_VERSION}</>
          ) : (
            <>ACR Criteria Database: v{ACR_DATABASE_VERSION}</>
          )}
        </span>
        <span className={clsx('font-semibold text-gray-900', variant === 'compact' ? 'text-xs' : 'text-sm')}>
          | Last Updated: {lastUpdated}
        </span>
        {showTooltip && (
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Information about ACR database updates"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50"
          role="tooltip"
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
          <p className="font-semibold mb-1">ACR Database Update Policy</p>
          <p className="text-gray-300">
            ARKA's criteria database is reviewed quarterly and updated within 30 days of new ACR publications.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Source: <a href={CRITERIA_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              acsearch.acr.org
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

