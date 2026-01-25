'use client';

import { X, FileText, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function HowItWorksModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">How AIIE Works</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Differentiator */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-teal-800">
              AIIE uses a proprietary scoring methodology based on RAND/UCLA appropriateness methods 
              and peer-reviewed literature. Every recommendation shows exactly WHY it was made.
            </p>
          </div>

          {/* Methodology Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-4">The AIIE Scoring Methodology</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Start with Baseline Score</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Every evaluation starts at 5.0 (neutral). This represents "we don't know yet" - 
                    neither appropriate nor inappropriate until we assess the clinical factors.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Apply Weighted Clinical Factors</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Each clinical factor (red flags, duration, age, prior workup) has an evidence-based 
                    weight derived from peer-reviewed literature. Factors either increase (+) or 
                    decrease (-) the appropriateness score.
                  </p>
                  <div className="mt-2 bg-gray-50 p-3 rounded text-sm font-mono">
                    Example: Cancer history → +3.0 points (Deyo & Diehl, JAMA 1988)
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Calculate Final Score (1-9)</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    All factor contributions sum to produce a final score, capped between 1 and 9.
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                      <strong>7-9</strong><br/>Usually Appropriate
                    </div>
                    <div className="bg-amber-100 text-amber-800 p-2 rounded text-center">
                      <strong>4-6</strong><br/>May Be Appropriate
                    </div>
                    <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                      <strong>1-3</strong><br/>Usually Not Appropriate
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Show SHAP-Style Explanation</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Unlike black-box systems, AIIE shows exactly which factors contributed to the score 
                    and by how much. This satisfies FDA Non-Device CDS Criterion 4 (independent review).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Example */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Example: Low Back Pain Evaluation</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Baseline Score</span>
                <span className="font-mono">5.0</span>
              </div>
              
              <div className="flex justify-between items-center text-red-600">
                <span>Duration &lt;6 weeks</span>
                <span className="font-mono">-2.0</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span>No conservative management tried</span>
                <span className="font-mono">-1.5</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span>No red flags</span>
                <span className="font-mono">-1.0</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t font-semibold">
                <span>Final Score</span>
                <span className="font-mono text-red-600">2 / 9 (Usually Not Appropriate)</span>
              </div>
            </div>
          </div>

          {/* Evidence Basis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Evidence Basis</h3>
            <p className="text-gray-600 text-sm mb-3">
              Factor weights are derived from peer-reviewed literature:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <span>Chou R, et al. <em>Annals of Internal Medicine</em> 2007 - Diagnostic imaging for low back pain</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <span>Deyo RA, Diehl AK. <em>JAMA</em> 1988 - Cancer as a cause of back pain</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <span>Perry JJ, et al. <em>BMJ</em> 2011 - Ottawa SAH Rule</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                <span>AAN Practice Guidelines - Neuroimaging in headache</span>
              </li>
            </ul>
          </div>

          {/* FDA Compliance */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              FDA Non-Device CDS Compliance
            </h4>
            <p className="text-blue-800 text-sm mt-2">
              This transparent, explainable methodology satisfies all four FDA criteria for 
              Non-Device Clinical Decision Support under the 21st Century Cures Act § 3060.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 font-medium"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
