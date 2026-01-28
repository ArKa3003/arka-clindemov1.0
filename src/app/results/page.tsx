'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Lightbulb } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/aiie/demo-scenarios';
import SHAPExplanation from '@/components/results/SHAPExplanation';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);
  const scenarioId = searchParams.get('scenario') || 'lbp-inappropriate';

  const scenario = DEMO_SCENARIOS[scenarioId];
  const result = scenario?.result;

  useEffect(() => {
    document.title = 'Evaluation Results | ARKA';
  }, []);

  // Ensure browser Back from Results goes to /evaluate (Page 2), not splash
  useEffect(() => {
    const fromEvaluate = typeof document !== 'undefined' && document.referrer?.includes('/evaluate');
    if (fromEvaluate) return;
    try {
      window.history.replaceState({}, '', '/evaluate');
      window.history.pushState({}, '', window.location.pathname + window.location.search);
    } catch {
      /* ignore */
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
        <AppHeader />
        <main className="max-w-6xl mx-auto flex-1 w-full min-w-0 px-4 sm:px-6 py-6 sm:py-8" id="main-content" role="main">
          <div className="bg-white border rounded-xl p-4 sm:p-8 text-center w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Scenario not found</h2>
            <p className="text-gray-600 mb-4">No AIIE scenario found for &quot;{scenarioId}&quot;. Valid options: lbp-inappropriate, lbp-red-flags, headache-inappropriate, headache-appropriate.</p>
            <Link href="/evaluate" className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-blue-600 hover:underline rounded-lg hover:bg-blue-50 touch-manipulation">Return to Evaluation</Link>
          </div>
        </main>
        <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
        <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <AppHeader showNewEvaluation onNewEvaluation={() => router.push('/evaluate')} />
      <main className="max-w-6xl mx-auto flex-1 w-full min-w-0 px-4 sm:px-6 py-6 sm:py-8" id="main-content" role="main">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">Evaluation Results</h1>

      {/* Score Display — verdict prominent, full-width on mobile */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full transition-all duration-150 ease-out hover:shadow-md">
        <div className="text-center">
          <div className={`w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full flex items-center justify-center ${
            result.category === 'appropriate' ? 'bg-green-500' :
            result.category === 'inappropriate' ? 'bg-red-500' : 'bg-amber-500'
          }`}>
            <div className="text-white">
              <div className="text-3xl sm:text-4xl font-bold">{result.score}</div>
              <div className="text-xs sm:text-sm font-semibold opacity-95">/9</div>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4">
            <span className={`px-3 py-1.5 rounded-full text-sm sm:text-base font-medium min-w-0 ${
              result.category === 'appropriate' ? 'bg-green-100 text-green-800' :
              result.category === 'inappropriate' ? 'bg-red-100 text-red-800' : 
              'bg-amber-100 text-amber-800'
            }`}>
              {result.category === 'appropriate' ? 'USUALLY APPROPRIATE' :
               result.category === 'inappropriate' ? 'USUALLY NOT APPROPRIATE' :
               'MAY BE APPROPRIATE'}
            </span>
          </div>
          
          <p className="mt-4 text-sm sm:text-base text-gray-800 min-w-0 break-words results-min-text">{result.recommendation}</p>
        </div>
      </div>

      {/* SHAP Explanation — full-width on mobile */}
      <div className="mt-4 sm:mt-6 w-full">
        <SHAPExplanation 
          factors={result.factors}
          baselineScore={result.baselineScore}
          finalScore={result.finalScore}
        />
      </div>

      {/* How This Score Was Calculated — full-width, min 14px text */}
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-lg p-4 w-full">
        <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm sm:text-base results-min-text">
          <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0" />
          How This Score Was Calculated
        </h4>
        <p className="text-sm sm:text-base text-gray-700 mt-2 min-w-0 break-words results-min-text">
          AIIE starts at baseline {result.baselineScore} and applies evidence-based factor weights 
          from peer-reviewed literature. Each factor&apos;s contribution is shown above. 
          It&apos;s our proprietary methodology using RAND/UCLA appropriateness methods.
        </p>
        <Link href="/how-it-works" className="text-teal-600 text-sm sm:text-base mt-2 hover:text-teal-700 hover:underline inline-block font-medium min-h-[44px] flex items-center">
          Learn more about AIIE methodology →
        </Link>
      </div>

      {/* Alternatives — stack on mobile, full-width */}
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Alternative Recommendations</h3>
        <p className="text-sm sm:text-base text-gray-700 mb-4 min-w-0">
          Based on <strong className="text-gray-900">AIIE evidence analysis</strong>, consider these alternatives:
        </p>
        
        <div className="space-y-4">
          {result.alternatives.map((alt, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white w-full min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base min-w-0 break-words">{alt.procedure}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-sm font-medium flex-shrink-0 ${
                  alt.score >= 7 ? 'bg-green-100 text-green-800' :
                  alt.score >= 4 ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {alt.score}/9
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-700 mt-2 min-w-0 break-words results-min-text">{alt.rationale}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-sm px-2 py-1 bg-blue-50 text-blue-800 rounded font-medium">
                  Radiation: {alt.radiation}
                </span>
                <span className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded font-medium">
                  {alt.costComparison}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Sources — stack on mobile, full-width, min 14px */}
      <div className="mt-4 sm:mt-6 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 w-full">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Evidence Sources</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 min-w-0">
          Peer-reviewed literature supporting this recommendation:
        </p>
        
        <div className="space-y-3">
          {result.evidenceSources.map((source, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full min-w-0">
              <FileText className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900 break-words results-min-text">{source.title}</p>
                <p className="text-sm text-gray-600 mt-1 break-words">{source.citation}</p>
                <span className="inline-block mt-1 text-sm px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                  {source.type === 'peer-reviewed' ? 'Peer-Reviewed Study' : 
                   source.type === 'guideline' ? 'Clinical Guideline' : 'Systematic Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FDA Disclaimer & § 3060 */}
      <div className="mt-6 text-center border-t border-gray-200 pt-6 w-full">
        <p className="text-sm sm:text-base text-gray-800 min-w-0 break-words results-min-text">
          This recommendation is generated by AIIE using RAND/UCLA methodology and peer-reviewed evidence. 
          It qualifies as FDA Non-Device CDS under 21st Century Cures Act § 3060.
        </p>
        <p className="mt-1 text-xs sm:text-sm text-gray-700 break-words fda-banner-text">
          AIIE v2.0 | FDA Non-Device CDS | 21st Century Cures Act § 3060 | Evidence Updated: January 2026 | For Healthcare Professional Use Only
        </p>
      </div>
      </main>
      <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-gray-50 animate-in fade-in duration-300">
        <div className="h-14 shrink-0 bg-white border-b border-gray-200" />
        <main className="max-w-6xl mx-auto flex-1 w-full px-4 py-8">
          <div className="animate-pulse bg-gray-200 h-8 w-48 rounded mb-6" />
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-40 rounded-xl" />
            <div className="animate-pulse bg-gray-200 h-32 rounded-xl" />
            <div className="animate-pulse bg-gray-200 h-24 rounded-xl" />
          </div>
        </main>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
