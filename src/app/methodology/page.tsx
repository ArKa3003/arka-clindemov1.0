'use client';

import { useState } from 'react';
import { FDA_COMPLIANCE, PROPRIETARY_FRAMEWORK } from '@/lib/constants/fda-compliance';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

export default function MethodologyPage() {
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <AppHeader />

      <main className="mx-auto max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
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
      <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}
