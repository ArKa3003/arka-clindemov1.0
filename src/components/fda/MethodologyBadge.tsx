'use client';

import Link from 'next/link';
import { FDA_COMPLIANCE } from '@/lib/constants/fda-compliance';

export function MethodologyBadge() {
  const { aiie, methodology, evidenceUpdate } = FDA_COMPLIANCE.VERSION;

  return (
    <div
      className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
      role="complementary"
      aria-label="AIIE methodology and evidence version"
    >
      <span className="font-semibold text-gray-900">AIIE v{aiie}</span>
      <span className="text-gray-400" aria-hidden>|</span>
      <span>{methodology}</span>
      <span className="text-gray-400" aria-hidden>|</span>
      <span>Evidence: {evidenceUpdate}</span>
      <Link
        href="/methodology"
        className="ml-1 font-medium text-teal-700 underline hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded"
      >
        Methodology
      </Link>
    </div>
  );
}
