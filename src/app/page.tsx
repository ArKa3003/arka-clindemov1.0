// src/app/page.tsx
'use client';

import { useState } from 'react';
import { ClinicalScenario, EvaluationResult } from '@/types';
import { evaluateImaging } from '@/lib/evaluate-imaging';
import { getDemoScenario, getAllDemoScenarios } from '@/lib/demo-scenarios';
import { PatientInput } from '@/components/PatientInput';
import { AppropriatenessScore } from '@/components/AppropriatenessScore';
import { AlternativesList } from '@/components/AlternativesList';
import { EvidencePanel } from '@/components/EvidencePanel';
import { PatientSafetySidebar } from '@/components/PatientSafetySidebar';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { ACRVersionBadge } from '@/components/ACRVersionBadge';
import { FontSizeToggle } from '@/components/FontSizeToggle';
import { HighContrastToggle } from '@/components/HighContrastToggle';
import { WorkflowActions } from '@/components/WorkflowActions';
import { IntegrationArchitecture } from '@/components/IntegrationArchitecture';
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

export default function Home() {
  const [currentView, setCurrentView] = useState<'splash' | 'demo'>('splash');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentScenario, setCurrentScenario] =
    useState<ClinicalScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      
      {/* Disclaimer Banner */}
      <DisclaimerBanner />
      
      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center flex-shrink-0">
                <img
                  src="/arka-logo.svg"
                  alt="ARKA Logo"
                  className="h-full w-full object-contain"
                  width="40"
                  height="40"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ARKA</h1>
                <p className="text-sm text-gray-500">
                  Advanced Radio-imaging Knowledge Architecture
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-4" role="navigation" aria-label="Main navigation">
              <button
                onClick={() => setShowIntegrationModal(true)}
                className="text-base text-gray-700 hover:text-gray-900 font-medium min-h-[44px] px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Learn how ARKA integrates with EHR systems"
              >
                How It Works
              </button>
              <a
                href="/feedback"
                className="text-base text-gray-700 hover:text-gray-900 font-medium min-h-[44px] px-3 py-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Provide feedback about ARKA"
              >
                Feedback
              </a>
              {result && (
                <button
                  onClick={handleReset}
                  className="text-base text-blue-600 hover:text-blue-700 min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Start a new evaluation"
                >
                  ← New Evaluation
                </button>
              )}
              <div className="hidden sm:block">
                <ACRVersionBadge showTooltip={true} variant="compact" />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="main">
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
              <section className="mb-8 text-center" aria-labelledby="evaluation-title">
                <h2 id="evaluation-title" className="text-3xl font-bold text-gray-900 mb-2">
                  Imaging Appropriateness Evaluation
                </h2>
                <p className="text-base text-gray-600">
                  Enter the clinical scenario to receive evidence-based
                  recommendations aligned with ACR Appropriateness Criteria.
                </p>
              </section>
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
              </div>
            </div>
          </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Main Disclaimer */}
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900 mb-2">
                Decision Support Only - Not Medical Advice
              </p>
              <p className="text-sm text-gray-600 max-w-3xl mx-auto">
                ARKA is a clinical decision support tool that provides recommendations based on ACR Appropriateness Criteria. 
                These recommendations are intended to assist healthcare providers in making informed decisions about medical imaging. 
                They do not constitute medical advice, diagnosis, or treatment recommendations. Healthcare providers must exercise 
                their professional judgment and consider individual patient circumstances when making final imaging decisions.
              </p>
            </div>
            
            {/* Links and Version Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-200">
              <ACRVersionBadge showTooltip={true} />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // In production, this would link to full disclaimer page
                  alert('Full disclaimer and terms of use would be displayed here.');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline min-h-[44px] flex items-center px-2 py-1"
              >
                Full Disclaimer & Terms of Use
              </a>
              <span className="text-sm text-gray-500">
                For Healthcare Professional Use Only
              </span>
            </div>
            
            {/* Copyright */}
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} ARKA Clinical Decision Support • Based on ACR Appropriateness Criteria
            </p>
          </div>
        </div>
      </footer>

      {/* Integration Architecture Modal */}
      <IntegrationArchitecture
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
      />
        </div>
      )}
    </div>
  );
}
