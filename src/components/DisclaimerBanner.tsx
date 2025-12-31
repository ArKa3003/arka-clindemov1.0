// src/components/DisclaimerBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export function DisclaimerBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  // Check if user has seen the disclaimer before (using localStorage)
  useEffect(() => {
    const seen = localStorage.getItem('arka-disclaimer-seen');
    if (seen === 'true') {
      setIsCollapsed(true);
      setHasSeen(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsCollapsed(true);
    localStorage.setItem('arka-disclaimer-seen', 'true');
    setHasSeen(true);
  };

  if (isCollapsed && hasSeen) {
    return (
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-between w-full text-left text-sm text-blue-700 hover:text-blue-900"
          >
            <span className="font-medium">Clinical Decision Support Tool - Click to view full disclaimer</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-b-2 border-blue-300">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-blue-900 mb-1">
              CLINICAL DECISION SUPPORT TOOL
            </p>
            <p className="text-base text-blue-800">
              This system provides recommendations based on ACR Appropriateness Criteria to assist clinical decision-making. 
              <strong className="font-semibold"> It does not constitute medical advice.</strong> Final imaging decisions remain 
              the responsibility of the ordering healthcare provider.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-600 hover:text-blue-800"
            aria-label="Dismiss disclaimer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

