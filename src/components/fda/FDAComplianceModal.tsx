'use client';

import { useState } from 'react';
import { FDA_COMPLIANCE, PROPRIETARY_FRAMEWORK } from '@/lib/constants/fda-compliance';
import { Button } from '@/components/ui/Button';

interface FDAComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FDAComplianceModal({ isOpen, onClose }: FDAComplianceModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fda-compliance-modal-title"
      aria-describedby="fda-compliance-modal-description"
    >
      <div
        className="relative my-8 w-full max-w-2xl rounded-xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-slate-50 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="fda-compliance-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                FDA Non-Device CDS Regulatory Notice
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {PROPRIETARY_FRAMEWORK.name} (AIIE) • 21st Century Cures Act § 3060
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close regulatory notice"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body - medical documentation style */}
        <div
          id="fda-compliance-modal-description"
          className="max-h-[60vh] overflow-y-auto px-6 py-5"
        >
          <div className="space-y-5 text-gray-800">
            {/* Full disclaimer */}
            <section className="whitespace-pre-line rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm leading-relaxed">
              {FDA_COMPLIANCE.FULL_DISCLAIMER}
            </section>

            {/* Four criteria checklist */}
            <section>
              <h3 className="mb-3 text-base font-semibold text-gray-900">
                Four Mandatory Criteria — Compliance Status
              </h3>
              <ul className="space-y-2">
                {Object.entries(FDA_COMPLIANCE.CRITERIA).map(([key, c]) => (
                  <li
                    key={key}
                    className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50/80 p-3"
                  >
                    <span
                      className="mt-0.5 shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white"
                      aria-hidden
                    >
                      {c.status}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900">{c.title}</span>
                      <p className="text-sm text-gray-600">{c.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Exclusions */}
            <section>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                What This Tool Does NOT Do
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                {FDA_COMPLIANCE.EXCLUSIONS.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </section>

            {/* Version block */}
            <section className="rounded-lg border border-gray-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                Version & Evidence
              </h3>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">AIIE Version</dt>
                  <dd className="font-medium text-gray-900">{FDA_COMPLIANCE.VERSION.aiie}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Methodology</dt>
                  <dd className="font-medium text-gray-900">{FDA_COMPLIANCE.VERSION.methodology}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Evidence Update</dt>
                  <dd className="font-medium text-gray-900">{FDA_COMPLIANCE.VERSION.evidenceUpdate}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">FDA Guidance</dt>
                  <dd className="font-medium text-gray-900">{FDA_COMPLIANCE.VERSION.fdaGuidanceRef}</dd>
                </div>
              </dl>
            </section>

            {/* Acknowledge checkbox for user awareness */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-blue-50/50 p-4">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-describedby="ack-desc"
              />
              <span id="ack-desc" className="text-sm font-medium text-gray-800">
                I understand this is decision support only. It supports but does not replace my
                clinical judgment. The final decision rests with me as the qualified healthcare
                provider.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-slate-50 px-6 py-4">
          <div className="flex justify-end">
            <Button onClick={onClose} variant="primary" size="md" className="min-h-[44px]">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
