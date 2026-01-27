'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle, Database, Stethoscope, UserCircle, ArrowRight, Zap, ClipboardList } from 'lucide-react';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

export default function HowItWorksPage() {
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);

  useEffect(() => {
    document.title = 'How ARKA Works | ARKA';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <AppHeader />
      <main className="mx-auto max-w-4xl w-full flex-1 px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl mb-2" id="page-title">
          How ARKA Works
        </h1>

        <div className="mt-6 space-y-8">
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            ARKA (Imaging Intelligence Engine) helps healthcare providers decide when imaging is appropriate.
            You enter a clinical scenario; ARKA applies evidence-based rules and returns a score with a clear explanation.
            Below is the high-level flow and the FDA Non-Device CDS criteria ARKA satisfies.
          </p>

          {/* Visual workflow diagram: Data Input → AIIE Processing → Recommendation Output */}
          <section aria-labelledby="workflow-heading" className="space-y-4">
            <h2 id="workflow-heading" className="text-lg font-semibold text-gray-900 dark:text-white">Workflow</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
              <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                    <Database className="h-6 w-6 text-sky-600 dark:text-sky-400" aria-hidden />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Data Input</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                  Clinical scenario (complaint, duration, red flags, proposed imaging) is entered by the provider or pulled from the EHR.
                </p>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5 relative">
                <div className="absolute -left-2 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-gray-300 dark:text-gray-600">
                  <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-violet-600 dark:text-violet-400" aria-hidden />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">AIIE Processing</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                  AIIE applies weighted clinical factors from peer-reviewed literature to compute an appropriateness score (1–9) and explanation.
                </p>
              </div>
              <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5 relative">
                <div className="absolute -left-2 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-10 text-gray-300 dark:text-gray-600">
                  <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Recommendation Output</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                  You see a score, category (Usually Appropriate / May Be Appropriate / Usually Not Appropriate), and factor-level explanation.
                </p>
              </div>
            </div>
          </section>

          {/* FDA CDS criteria with icons */}
          <section aria-labelledby="criteria-heading" className="space-y-4">
            <h2 id="criteria-heading" className="text-lg font-semibold text-gray-900 dark:text-white">FDA Non-Device CDS Criteria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center shrink-0">
                  <Database className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Data Input Criterion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Clinical scenario and proposed imaging are the inputs; no hidden data drives the recommendation.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Medical Information Criterion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Recommendations are based on medical information (evidence, guidelines, clinical factors) you provide.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                  <UserCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">HCP Recommendations Criterion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Output is intended to support, not replace, healthcare professional decision-making.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-150 ease-out hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Independent Review Criterion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Users can independently verify the basis (literature, factor weights, explanation) for each recommendation.</p>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <p className="text-teal-800 dark:text-teal-200">
              AIIE uses a proprietary scoring methodology based on RAND/UCLA appropriateness methods
              and peer-reviewed literature. Every recommendation shows exactly WHY it was made.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">The AIIE Scoring Methodology</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Start with Baseline Score</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Every evaluation starts at 5.0 (neutral). This represents &quot;we don&apos;t know yet&quot; —
                    neither appropriate nor inappropriate until we assess the clinical factors.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Apply Weighted Clinical Factors</h3>
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
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Calculate Final Score (1-9)</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    All factor contributions sum to produce a final score, capped between 1 and 9.
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                      <strong>7-9</strong><br />Usually Appropriate
                    </div>
                    <div className="bg-amber-100 text-amber-800 p-2 rounded text-center">
                      <strong>4-6</strong><br />May Be Appropriate
                    </div>
                    <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                      <strong>1-3</strong><br />Usually Not Appropriate
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Show SHAP-Style Explanation</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Unlike black-box systems, AIIE shows exactly which factors contributed to the score
                    and by how much. This satisfies FDA Non-Device CDS Criterion 4 (independent review).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Example: Low Back Pain Evaluation</h2>
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

          <div>
            <h2 className="text-lg font-semibold mb-4">Evidence Basis</h2>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              FDA Non-Device CDS Compliance
            </h3>
            <p className="text-blue-800 text-sm mt-2">
              This transparent, explainable methodology satisfies all four FDA criteria for
              Non-Device Clinical Decision Support under the 21st Century Cures Act § 3060.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/evaluate"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 hover:shadow-md active:scale-[0.98] font-medium transition-all duration-150 ease-out min-h-[44px]"
          >
            Try Imaging Evaluation
          </Link>
        </div>
      </main>
      <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}
