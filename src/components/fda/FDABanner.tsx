'use client';

import { Shield } from 'lucide-react';

interface FDABannerProps {
  onOpenComplianceModal?: () => void;
}

export function FDABanner({ onOpenComplianceModal }: FDABannerProps) {
  return (
    <div
      className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2.5 px-3 sm:px-4 sticky top-0 z-40 shrink-0 antialiased overflow-hidden"
      role="banner"
      aria-label="FDA regulatory compliance notice"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-2 min-w-0">
        <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden />
        <span className="flex-1 min-w-0 text-center sm:text-left font-medium break-words fda-banner-text">
          FDA Non-Device CDS | 21st Century Cures Act § 3060 | For Healthcare Professionals Only
        </span>
        {onOpenComplianceModal && (
          <button
            type="button"
            onClick={onOpenComplianceModal}
            className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full border border-white/40 hover:bg-white/20"
            aria-label="View full FDA compliance"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
