'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, Lightbulb } from 'lucide-react';
import { DEMO_SCENARIOS } from '@/lib/aiie/demo-scenarios';
import SHAPExplanation from '@/components/results/SHAPExplanation';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';

function ResultsContent() {
  const searchParams = useSearchParams();
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);
  const scenarioId = searchParams.get('scenario') || 'lbp-inappropriate';
  
  // Get the pre-calculated AIIE result
  const scenario = DEMO_SCENARIOS[scenarioId];
  const result = scenario?.result;
  
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
        <header className="border-b bg-white shrink-0">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800 underline">← Back to AIIE</Link>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">Non-Device CDS</span>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4 py-8 flex-1">
          <div className="bg-white border rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Scenario not found</h2>
            <p className="text-gray-600 mb-4">No AIIE scenario found for &quot;{scenarioId}&quot;. Valid options: lbp-inappropriate, lbp-red-flags, headache-inappropriate, headache-appropriate.</p>
            <Link href="/" className="text-blue-600 hover:underline">Return to ARKA</Link>
          </div>
        </div>
        <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <header className="border-b bg-white shrink-0" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800 underline">← Back to AIIE</Link>
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">Non-Device CDS</span>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1">

      {/* Score Display */}
      <div className="bg-white border rounded-xl p-6">
        <div className="text-center">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
            result.category === 'appropriate' ? 'bg-green-500' :
            result.category === 'inappropriate' ? 'bg-red-500' : 'bg-amber-500'
          }`}>
            <div className="text-white">
              <div className="text-4xl font-bold">{result.score}</div>
              <div className="text-sm">/9</div>
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              result.category === 'appropriate' ? 'bg-green-100 text-green-800' :
              result.category === 'inappropriate' ? 'bg-red-100 text-red-800' : 
              'bg-amber-100 text-amber-800'
            }`}>
              {result.category === 'appropriate' ? 'USUALLY APPROPRIATE' :
               result.category === 'inappropriate' ? 'USUALLY NOT APPROPRIATE' :
               'MAY BE APPROPRIATE'}
            </span>
          </div>
          
          <p className="mt-4 text-gray-700">{result.recommendation}</p>
        </div>
      </div>

      {/* SHAP Explanation */}
      <div className="mt-6">
        <SHAPExplanation 
          factors={result.factors}
          baselineScore={result.baselineScore}
          finalScore={result.finalScore}
        />
      </div>

      {/* How This Score Was Calculated */}
      <div className="mt-4 bg-gray-50 border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          How This Score Was Calculated
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          AIIE starts at baseline {result.baselineScore} and applies evidence-based factor weights 
          from peer-reviewed literature. Each factor&apos;s contribution is shown above. 
          It&apos;s our proprietary methodology using RAND/UCLA appropriateness methods.
        </p>
      </div>

      {/* Alternatives */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Alternative Recommendations</h3>
        <p className="text-gray-600 text-sm mb-4">
          Based on <strong>AIIE evidence analysis</strong>, consider these alternatives:
        </p>
        
        <div className="space-y-3">
          {result.alternatives.map((alt, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{alt.procedure}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-sm ${
                  alt.score >= 7 ? 'bg-green-100 text-green-700' :
                  alt.score >= 4 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {alt.score}/9
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{alt.rationale}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                  Radiation: {alt.radiation}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {alt.costComparison}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Sources */}
      <div className="mt-6 bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Evidence Sources</h3>
        <p className="text-sm text-gray-500 mb-4">
          Peer-reviewed literature supporting this recommendation:
        </p>
        
        <div className="space-y-3">
          {result.evidenceSources.map((source, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{source.title}</p>
                <p className="text-xs text-gray-500 mt-1">{source.citation}</p>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  {source.type === 'peer-reviewed' ? 'Peer-Reviewed Study' : 
                   source.type === 'guideline' ? 'Clinical Guideline' : 'Systematic Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FDA Disclaimer & § 3060 */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t pt-6">
        <p>
          This recommendation is generated by AIIE using RAND/UCLA methodology and peer-reviewed evidence. 
          It qualifies as FDA Non-Device CDS under 21st Century Cures Act § 3060.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          AIIE v2.0 | FDA Non-Device CDS | 21st Century Cures Act § 3060 | Evidence Updated: January 2026 | For Healthcare Professional Use Only
        </p>
      </div>
      </div>
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse bg-gray-100 h-8 w-32 rounded mb-6" />
        <div className="animate-pulse bg-gray-100 h-64 rounded-xl" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
