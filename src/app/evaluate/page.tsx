'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClinicalScenario, EvaluationResult } from '@/types';
import { evaluateImaging } from '@/lib/evaluate-imaging';
import { getDemoScenario, getAllDemoScenarios } from '@/lib/demo-scenarios';
import { PatientInput } from '@/components/PatientInput';
import { AppropriatenessScore } from '@/components/AppropriatenessScore';
import { AlternativesList } from '@/components/AlternativesList';
import { EvidencePanel } from '@/components/EvidencePanel';
import { PatientSafetySidebar } from '@/components/PatientSafetySidebar';
import {
  hasAcknowledgedFirstUse,
  FirstUseAcknowledgment,
  shouldSkipFirstUseAcknowledgment,
} from '@/components/fda/FirstUseAcknowledgment';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';
import { MethodologyBadge } from '@/components/fda/MethodologyBadge';
import { Shield, Lightbulb } from 'lucide-react';
import { HighContrastToggle } from '@/components/HighContrastToggle';
import { WorkflowActions } from '@/components/WorkflowActions';
import Link from 'next/link';
import SHAPExplanation from '@/components/results/SHAPExplanation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ResultsSkeleton } from '@/components/SkeletonLoader';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

function DemoScenarioSelector({
  onSelect,
}: {
  onSelect: (scenario: ClinicalScenario) => void;
}) {
  const scenarios = getAllDemoScenarios();

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Quick Demo Scenarios
      </h3>
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full min-w-0">
        {scenarios.map(({ key, title, description }) => (
          <button
            key={key}
            onClick={() => {
              const scenario = getDemoScenario(key);
              if (scenario) onSelect(scenario);
            }}
            className="text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors min-h-[44px] w-full touch-manipulation"
          >
            <h4 className="font-medium text-gray-900 mb-1 text-base min-w-0">{title}</h4>
            <p className="text-sm text-gray-600 min-w-0">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EvaluatePage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ClinicalScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);
  const [showFirstUseAck, setShowFirstUseAck] = useState(false);

  useEffect(() => {
    document.title = 'Imaging Appropriateness Evaluation | ARKA';
  }, []);

  useEffect(() => {
    if (shouldSkipFirstUseAcknowledgment() || hasAcknowledgedFirstUse()) return;
    setShowFirstUseAck(true);
  }, []);

  /** New Evaluation: stay on /evaluate, clear result (Page 2). */
  const handleNewEvaluation = useCallback(() => {
    setResult(null);
    setCurrentScenario(null);
  }, []);

  const handleEvaluate = async (scenario: ClinicalScenario) => {
    setIsLoading(true);
    setCurrentScenario(scenario);
    await new Promise((r) => setTimeout(r, 500));
    const evaluationResult = evaluateImaging(scenario);
    setResult(evaluationResult);
    setIsLoading(false);
  };

  // Push history when showing results so browser Back goes to form (Page 2)
  useEffect(() => {
    if (!result) return;
    const state = { view: 'results' as const };
    window.history.pushState(state, '', window.location.pathname + window.location.search);
    const onPopState = () => {
      setResult(null);
      setCurrentScenario(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [result]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <HighContrastToggle />
      {showFirstUseAck && (
        <FirstUseAcknowledgment
          onAcknowledge={() => setShowFirstUseAck(false)}
          isBlocking
        />
      )}
      <FDAComplianceModal
        isOpen={showFDAComplianceModal}
        onClose={() => setShowFDAComplianceModal(false)}
      />

      <AppHeader
        showNewEvaluation={!!result}
        onNewEvaluation={handleNewEvaluation}
        useHowItWorksModal={false}
      />

      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2.5 px-3 sm:px-4 antialiased overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 min-w-0">
          <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden />
          <span className="flex-1 min-w-0 text-center sm:text-left font-medium break-words fda-banner-text">
            FDA Non-Device CDS | 21st Century Cures Act § 3060 | For Healthcare Professionals Only
          </span>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:py-8 sm:px-6 lg:px-8" role="main">
        <ErrorBoundary>
          {isLoading ? (
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-base font-medium text-blue-900">Analyzing scenario...</p>
                </div>
              </div>
              <ResultsSkeleton />
            </div>
          ) : !result ? (
            <div className="mx-auto max-w-2xl animate-in fade-in">
              <section className="mb-6 sm:mb-8 text-center pt-2" aria-labelledby="evaluation-title">
                <h1 id="evaluation-title" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-2">
                  Imaging Appropriateness Evaluation
                </h1>
                <p className="text-base text-gray-600 px-2">
                  Enter the clinical scenario to receive evidence-based recommendations from ARKA Imaging Intelligence Engine (AIIE).
                </p>
              </section>
              <div className="mb-6 rounded-lg border-2 border-teal-700 bg-gradient-to-r from-cyan-50 to-teal-50 p-4 text-center">
                <p className="text-sm font-semibold text-teal-950">
                  FDA Non-Device CDS | 21st Century Cures Act § 3060 Compliant | For HCP Use Only
                </p>
                <button
                  type="button"
                  onClick={() => setShowFDAComplianceModal(true)}
                  className="mt-2 min-h-[44px] min-w-[44px] px-3 py-2 text-sm font-medium text-teal-800 underline hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded touch-manipulation"
                >
                  Learn more
                </button>
              </div>
              <DemoScenarioSelector onSelect={handleEvaluate} />
              <PatientInput onSubmit={handleEvaluate} isLoading={isLoading} />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in" role="region" aria-label="Evaluation results">
              <div className="rounded-lg bg-amber-50 border border-amber-300 p-4 sm:p-5" role="alert" aria-live="polite">
                <div className="flex items-start gap-3 sm:gap-4 flex-wrap">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm sm:text-base text-amber-900 font-medium min-w-0 flex-1 basis-full sm:basis-0 break-words leading-snug">
                    <strong className="font-semibold text-amber-900">Advisory Recommendation:</strong>{' '}
                    This recommendation is advisory. Clinical judgment should always prevail. Final imaging decisions remain the responsibility of the ordering healthcare provider.
                  </p>
                </div>
              </div>
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {currentScenario && (
                    <AppropriatenessScore
                      result={result}
                      scenario={currentScenario}
                      onCopyJustification={(text) => navigator.clipboard.writeText(text)}
                    />
                  )}
                  {result.shap && (
                    <SHAPExplanation
                      factors={result.shap.factors}
                      baselineScore={result.shap.baselineScore}
                      finalScore={result.shap.finalScore}
                    />
                  )}
                  {currentScenario && (
                    <AlternativesList
                      alternatives={result.alternatives}
                      currentProcedure={currentScenario.proposedImaging.modality || ''}
                      scenario={currentScenario}
                      onSwitchToAlternative={(alt) => {
                        if (currentScenario) {
                          const updated: ClinicalScenario = {
                            ...currentScenario,
                            proposedImaging: { ...currentScenario.proposedImaging, modality: alt.procedure as any },
                          };
                          handleEvaluate(updated);
                        }
                      }}
                    />
                  )}
                  {currentScenario && (
                    <WorkflowActions
                      result={result}
                      scenario={currentScenario}
                      onCopyJustification={(text) => navigator.clipboard.writeText(text)}
                    />
                  )}
                </div>
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                  {currentScenario && (
                    <PatientSafetySidebar scenario={currentScenario} result={result} />
                  )}
                  <EvidencePanel result={result} />
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" aria-hidden />
                      How This Score Was Calculated
                    </h4>
                    <p className="text-base text-gray-700 mt-2">
                      AIIE starts at baseline 5.0 and applies evidence-based factor weights from peer-reviewed
                      literature. Each factor&apos;s contribution is shown above. It&apos;s our proprietary methodology
                      using RAND/UCLA appropriateness methods.
                    </p>
                    <Link href="/how-it-works" className="text-teal-600 text-base mt-2 hover:text-teal-700 hover:underline inline-block font-medium">
                      Learn more about AIIE methodology →
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 print:mt-4">
                <MethodologyBadge />
              </div>
            </div>
          )}
        </ErrorBoundary>
      </main>

      <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
    </div>
  );
}
