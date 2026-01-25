// src/app/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { RecommendationDisclaimer } from '@/components/fda/RecommendationDisclaimer';
import { MethodologyBadge } from '@/components/fda/MethodologyBadge';
import Link from 'next/link';
import { Shield, Lightbulb } from 'lucide-react';
import { FontSizeToggle } from '@/components/FontSizeToggle';
import { HighContrastToggle } from '@/components/HighContrastToggle';
import { WorkflowActions } from '@/components/WorkflowActions';
import HowItWorksModal from '@/components/HowItWorksModal';
import SHAPExplanation from '@/components/results/SHAPExplanation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ResultsSkeleton } from '@/components/SkeletonLoader';
import { SplashScreen } from '@/components/SplashScreen';

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
      {/* Horizontal scroll on mobile, grid on larger screens */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
        <div className="flex sm:grid sm:grid-cols-2 gap-3 min-w-max sm:min-w-0">
          {scenarios.map(({ key, title, description }) => (
            <button
              key={key}
              onClick={() => {
                const scenario = getDemoScenario(key);
                if (scenario) {
                  onSelect(scenario);
                }
              }}
              className="text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100 transition-colors min-w-[280px] sm:min-w-0 min-h-[44px] flex-shrink-0 sm:flex-shrink"
            >
              <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<'splash' | 'demo'>('splash');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentScenario, setCurrentScenario] =
    useState<ClinicalScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);
  const [showFirstUseAck, setShowFirstUseAck] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // First-use FDA acknowledgment: when entering demo, show if not yet acknowledged
  useEffect(() => {
    if (currentView !== 'demo') return;
    if (shouldSkipFirstUseAcknowledgment() || hasAcknowledgedFirstUse()) return;
    setShowFirstUseAck(true);
  }, [currentView]);

  // Check if we should return to splash screen (e.g., from feedback page)
  useEffect(() => {
    if (searchParams?.get('returnToSplash') === 'true') {
      setCurrentView('splash');
      // Clean up URL parameter
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const handleEvaluate = async (scenario: ClinicalScenario) => {
    setIsLoading(true);
    setCurrentScenario(scenario);

    // Simulate API call delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    // Evaluate the imaging order
    const evaluationResult = evaluateImaging(scenario);
    setResult(evaluationResult);
    setIsLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setCurrentScenario(null);
    // Return to splash screen
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('splash');
      setIsTransitioning(false);
    }, 500);
  };

  const handleSplashContinue = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('demo');
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Splash Screen */}
      {currentView === 'splash' && (
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 500ms ease-in-out',
            pointerEvents: isTransitioning ? 'none' : 'auto',
          }}
        >
          <SplashScreen onContinue={handleSplashContinue} />
        </div>
      )}

      {/* Main Demo Content */}
      {currentView === 'demo' && (
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 500ms ease-in-out',
            pointerEvents: isTransitioning ? 'none' : 'auto',
          }}
        >
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Accessibility Toggles */}
      <FontSizeToggle />
      <HighContrastToggle />
      
      {/* First-use FDA acknowledgment modal (blocks until acknowledged) */}
      {showFirstUseAck && (
        <FirstUseAcknowledgment
          onAcknowledge={() => setShowFirstUseAck(false)}
          isBlocking
        />
      )}

      {/* FDA Compliance Modal (from banner or footer link) */}
      <FDAComplianceModal
        isOpen={showFDAComplianceModal}
        onClose={() => setShowFDAComplianceModal(false)}
      />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40" role="banner">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ARKA</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">ARKA</div>
              <div className="text-xs text-gray-500">Imaging Intelligence Engine</div>
            </div>
            <span className="hidden md:inline-flex px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
              Non-Device CDS
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <button onClick={() => setShowHowItWorks(true)} className="text-gray-600 hover:text-gray-900 text-sm">
              How It Works
            </button>
            <Link href="/feedback" className="text-gray-600 hover:text-gray-900 text-sm">
              Feedback
            </Link>
            {result && (
              <button onClick={handleReset} className="text-blue-600 hover:text-blue-700 text-sm" aria-label="Start a new evaluation">
                ← New Evaluation
              </button>
            )}
          </nav>
          <div className="text-sm text-gray-500">AIIE v2.0 | Jan 2026</div>
        </div>
      </header>

      {/* FDA Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>FDA Non-Device CDS | 21st Century Cures Act § 3060 | For Healthcare Professionals Only</span>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8" role="main">
        <ErrorBoundary>
          {isLoading ? (
            // Loading State
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <p className="text-base font-medium text-blue-900">
                    Analyzing scenario...
                  </p>
                </div>
              </div>
              <ResultsSkeleton />
            </div>
          ) : !result ? (
            // Input Form
            <div className="mx-auto max-w-2xl animate-in fade-in">
              <section className="mb-6 sm:mb-8 text-center pt-2" aria-labelledby="evaluation-title">
                <h2 id="evaluation-title" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-2">
                  Imaging Appropriateness Evaluation
                </h2>
                <p className="text-base text-gray-600 px-2">
                  Enter the clinical scenario to receive evidence-based
                  recommendations from ARKA Imaging Intelligence Engine (AIIE).
                </p>
              </section>
              {/* Prominent FDA Non-Device CDS section */}
              <div className="mb-6 rounded-lg border-2 border-teal-600 bg-gradient-to-r from-cyan-50 to-teal-50 p-4 text-center">
                <p className="text-sm font-semibold text-teal-900">
                  FDA Non-Device CDS | 21st Century Cures Act § 3060 Compliant | For HCP Use Only
                </p>
                <button
                  type="button"
                  onClick={() => setShowFDAComplianceModal(true)}
                  className="mt-2 text-sm font-medium text-teal-700 underline hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded"
                >
                  Learn more
                </button>
              </div>
              <DemoScenarioSelector onSelect={handleEvaluate} />
              <PatientInput onSubmit={handleEvaluate} isLoading={isLoading} />
            </div>
          ) : (
            // Results Display
            <div className="space-y-6 animate-in fade-in" role="region" aria-label="Evaluation results">
            {/* Advisory Note */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4" role="alert" aria-live="polite">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-base text-amber-800">
                  <strong className="font-semibold">Advisory Recommendation:</strong> This recommendation is advisory. 
                  Clinical judgment should always prevail. Final imaging decisions remain the responsibility of the ordering healthcare provider.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
              {/* Main Content - Full width on mobile, 2 cols on desktop */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {currentScenario && (
                  <AppropriatenessScore
                    result={result}
                    scenario={currentScenario}
                    onCopyJustification={(text) => {
                      navigator.clipboard.writeText(text);
                      // Could add toast notification here
                    }}
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
                    currentProcedure={
                      currentScenario.proposedImaging.modality || ''
                    }
                    scenario={currentScenario}
                    onSwitchToAlternative={(alt) => {
                      // Update scenario with alternative procedure
                      if (currentScenario) {
                        const updatedScenario: ClinicalScenario = {
                          ...currentScenario,
                          proposedImaging: {
                            ...currentScenario.proposedImaging,
                            modality: alt.procedure as any,
                          },
                        };
                        handleEvaluate(updatedScenario);
                      }
                    }}
                  />
                )}
                {currentScenario && (
                  <WorkflowActions
                    result={result}
                    scenario={currentScenario}
                    onCopyJustification={(text) => {
                      navigator.clipboard.writeText(text);
                    }}
                  />
                )}
              </div>
              {/* Sidebar - Patient Safety and Evidence */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                {currentScenario && (
                  <PatientSafetySidebar
                    scenario={currentScenario}
                    result={result}
                  />
                )}
                <EvidencePanel result={result} />
                {/* How This Score Was Calculated - mini-explanation */}
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    How This Score Was Calculated
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    AIIE starts at baseline 5.0 and applies evidence-based factor weights from peer-reviewed 
                    literature. Each factor&apos;s contribution is shown above. It&apos;s our proprietary methodology 
                    using RAND/UCLA appropriateness methods.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowHowItWorks(true)}
                    className="text-teal-600 text-sm mt-2 hover:underline"
                  >
                    Learn more about AIIE methodology →
                  </button>
                </div>
              </div>
            </div>
            {/* Results footer: methodology and version */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 print:mt-4">
              <MethodologyBadge />
            </div>
          </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="font-semibold text-gray-900">Decision Support Only – Not Medical Advice</p>
          <p className="text-sm text-gray-600 mt-2">
            ARKA AIIE provides evidence-based imaging appropriateness recommendations using the RAND/UCLA 
            methodology and peer-reviewed literature. These recommendations support clinical decision-making 
            but do not constitute medical advice. Healthcare providers maintain full authority over imaging decisions.
          </p>
        </div>
        {/* Version & FDA */}
        <div className="border-t py-4 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <span>AIIE v2.0 | RAND/UCLA + GRADE Methodology | Evidence: January 2026</span>
            <span>FDA Non-Device CDS | 21st Century Cures Act § 3060</span>
            <button type="button" onClick={() => setShowFDAComplianceModal(true)} className="text-teal-700 hover:underline">FDA Compliance & Full Disclaimer</button>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t py-3">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
            © 2026 ARKA Health Technologies | For Healthcare Professional Use Only
          </div>
        </div>
      </footer>

      {/* How AIIE Works (Methodology) Modal */}
      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <HomeContent />
    </Suspense>
  );
}
