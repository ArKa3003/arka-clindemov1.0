'use client';

import { useState, useCallback } from 'react';
import { FDA_COMPLIANCE } from '@/lib/constants/fda-compliance';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'aiie-fda-first-use-acknowledged';
const DONT_SHOW_KEY = 'aiie-fda-first-use-dont-show';

interface FirstUseAcknowledgmentProps {
  onAcknowledge: () => void;
  isBlocking?: boolean;
}

export function FirstUseAcknowledgment({
  onAcknowledge,
  isBlocking = true,
}: FirstUseAcknowledgmentProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleAcknowledge = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
        if (dontShowAgain) {
          localStorage.setItem(DONT_SHOW_KEY, 'true');
        }
      } catch {
        // ignore
      }
    }
    onAcknowledge();
  }, [dontShowAgain, onAcknowledge]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-slate-900/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-use-ack-title"
      aria-describedby="first-use-ack-desc"
      onClick={isBlocking ? (e) => e.stopPropagation() : undefined}
    >
      <div
        className="relative my-8 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-4">
          <h2
            id="first-use-ack-title"
            className="text-xl font-bold text-gray-900"
          >
            Important: FDA Regulatory Classification
          </h2>
          <p id="first-use-ack-desc" className="mt-1 text-sm text-gray-700">
            ARKA Imaging Intelligence Engine (AIIE) qualifies as Non-Device CDS under the 21st
            Century Cures Act § 3060. Please review before using clinical features.
          </p>
        </div>

        {/* Four criteria condensed */}
        <div className="space-y-2 px-6 py-5">
          {Object.entries(FDA_COMPLIANCE.CRITERIA).map(([key, c]) => (
            <div
              key={key}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3"
            >
              <span
                className="mt-0.5 shrink-0 text-emerald-600"
                aria-hidden
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <span className="font-medium text-gray-900">{c.title}</span>
                <p className="text-sm text-gray-600">{c.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Do not show again */}
        <div className="px-6 pb-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              aria-label="Do not show this notice again on future visits"
            />
            <span className="text-sm text-gray-600">Do not show again on future visits</span>
          </label>
        </div>

        {/* CTA */}
        <div className="border-t border-gray-200 bg-slate-50 px-6 py-5">
          <Button
            onClick={handleAcknowledge}
            variant="primary"
            size="lg"
            className="w-full min-h-[52px] text-base font-semibold"
          >
            I ACKNOWLEDGE: This Tool Supports But Does Not Replace Clinical Judgment
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Check if user has already acknowledged (for first visit gating). */
export function hasAcknowledgedFirstUse(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Check if user chose "do not show again". */
export function shouldSkipFirstUseAcknowledgment(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DONT_SHOW_KEY) === 'true';
  } catch {
    return false;
  }
}
