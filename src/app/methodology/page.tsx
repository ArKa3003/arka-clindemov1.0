'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FDA_COMPLIANCE, PROPRIETARY_FRAMEWORK } from '@/lib/constants/fda-compliance';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';

export default function MethodologyPage() {
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <header className="border-b bg-white shrink-0">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-teal-700 hover:text-teal-800 underline"
            >
              ← Back to AIIE
            </Link>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
              Non-Device CDS
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Methodology: {PROPRIETARY_FRAMEWORK.name}
        </h1>
        <p className="mt-2 text-gray-600">{PROPRIETARY_FRAMEWORK.tagline}</p>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">RAND/UCLA Appropriateness Method</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              AIIE applies the RAND/UCLA Appropriateness Method to structure clinical scenarios and
              score imaging appropriateness. Expert panels rate indications on a 1–9 scale. Scores
              are aggregated and classified as Usually Appropriate (7–9), May Be Appropriate (4–6),
              or Usually Not Appropriate (1–3), consistent with established evidence-based
              methodology.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">GRADE Framework</h2>
            <p className="mt-2 text-gray-700 leading-relaxed">
              Evidence underlying recommendations is assessed using the GRADE (Grading of
              Recommendations, Assessment, Development and Evaluations) framework. Quality of
              evidence and strength of recommendations are evaluated to support transparent,
              independently verifiable clinical guidance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">Version & Evidence</h2>
            <dl className="mt-2 grid gap-2 text-gray-700 sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">AIIE Version</dt>
                <dd className="font-medium">{FDA_COMPLIANCE.VERSION.aiie}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Methodology</dt>
                <dd className="font-medium">{FDA_COMPLIANCE.VERSION.methodology}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Evidence Update</dt>
                <dd className="font-medium">{FDA_COMPLIANCE.VERSION.evidenceUpdate}</dd>
              </div>
              <div>
                <dt className="text-gray-500">FDA Guidance</dt>
                <dd className="font-medium">{FDA_COMPLIANCE.VERSION.fdaGuidanceRef}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Regulatory Notice</h2>
            <p className="mt-2 text-sm text-gray-700">
              {PROPRIETARY_FRAMEWORK.name} qualifies as Non-Device Clinical Decision Support under
              FDA guidance (21st Century Cures Act § 3060). This tool supports but does not replace
              clinical judgment. The final decision rests with the qualified healthcare provider.
            </p>
          </section>
        </div>
      </main>
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="font-semibold text-gray-900">Decision Support Only – Not Medical Advice</p>
          <p className="text-sm text-gray-600 mt-2">AIIE uses RAND/UCLA methodology and peer-reviewed evidence. These do not constitute medical advice.</p>
        </div>
        <div className="border-t py-4 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-gray-600">
            <span>AIIE v2.0 | FDA Non-Device CDS | 21st Century Cures Act § 3060</span>
            <button type="button" onClick={() => setShowFDAComplianceModal(true)} className="text-teal-700 hover:underline">FDA Compliance & Full Disclaimer</button>
          </div>
        </div>
        <div className="border-t py-3 text-center text-xs text-gray-500">© 2026 ARKA Health Technologies | For Healthcare Professional Use Only</div>
      </footer>
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}
