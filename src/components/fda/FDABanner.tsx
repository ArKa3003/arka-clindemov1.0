'use client';

import { Shield } from 'lucide-react';

interface FDABannerProps {
  onOpenComplianceModal?: () => void;
}

export function FDABanner({ onOpenComplianceModal }: FDABannerProps) {
  return (
    <div
      className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 sticky top-0 z-40 shrink-0"
      role="banner"
      aria-label="FDA regulatory compliance notice"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <Shield className="h-4 w-4 flex-shrink-0" />
        <span>FDA Non-Device CDS | 21st Century Cures Act § 3060 | For Healthcare Professionals Only</span>
        {onOpenComplianceModal && (
          <button
            type="button"
            onClick={onOpenComplianceModal}
            className="ml-2 p-1 rounded-full border border-white/40 hover:bg-white/20"
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
