'use client';

import Link from 'next/link';

interface AppFooterProps {
  /** When provided, shows "FDA Compliance & Full Disclaimer" button that calls this on click */
  onOpenFDAComplianceModal?: () => void;
}

const VERSION = 'AIIE v2.0 | Jan 2026';
const FDA_LINE =
  'FDA Non-Device CDS | 21st Century Cures Act § 3060 Compliant | For HCP Use Only';

export function AppFooter({ onOpenFDAComplianceModal }: AppFooterProps) {
  return (
    <footer
      className="mt-auto shrink-0 border-t bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Version + FDA line */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{VERSION}</span>
          <span className="hidden sm:inline" aria-hidden="true">|</span>
          <span className="text-center">{FDA_LINE}</span>
        </div>
        {/* FAQ, Privacy, Terms + optional FDA Compliance */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          <Link
            href="/how-it-works#faq"
            className="text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
          >
            Terms of Service
          </Link>
          {onOpenFDAComplianceModal && (
            <>
              <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={onOpenFDAComplianceModal}
                className="text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
              >
                FDA Compliance & Full Disclaimer
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
