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

function DemoScenarioSelector({
  onSelect,
}: {
  onSelect: (scenario: ClinicalScenario) => void;
}) {
  const scenarios = getAllDemoScenarios();

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Quick Demo Scenarios
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {scenarios.map(({ key, title, description }) => (
          <button
            key={key}
            onClick={() => {
              const scenario = getDemoScenario(key);
              if (scenario) {
                onSelect(scenario);
              }
            }}
            className="text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [currentScenario, setCurrentScenario] =
    useState<ClinicalScenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ARKA</h1>
                <p className="text-xs text-gray-500">
                  Advanced Radio-imaging Knowledge Architecture
                </p>
              </div>
            </div>
            {result && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← New Evaluation
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!result ? (
          // Input Form
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Imaging Appropriateness Evaluation
              </h2>
              <p className="mt-2 text-gray-600">
                Enter the clinical scenario to receive evidence-based
                recommendations aligned with ACR Appropriateness Criteria.
              </p>
            </div>
            <DemoScenarioSelector onSelect={handleEvaluate} />
            <PatientInput onSubmit={handleEvaluate} isLoading={isLoading} />
            {/* Non-Device CDS Notice */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Clinical Decision Support Tool:</strong> This system
                provides recommendations based on ACR Appropriateness Criteria
                to support clinical decision-making. Final imaging decisions
                remain at the discretion of the ordering healthcare provider.
              </p>
            </div>
          </div>
        ) : (
          // Results Display
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Score - Full width on mobile, 2 cols on desktop */}
            <div className="lg:col-span-2 space-y-6">
              <AppropriatenessScore result={result} />
              <AlternativesList
                alternatives={result.alternatives}
                currentProcedure={
                  currentScenario?.proposedImaging.modality || ''
                }
              />
            </div>
            {/* Sidebar - Evidence and Warnings */}
            <div className="lg:col-span-1">
              <EvidencePanel result={result} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            ARKA Clinical Decision Support • Based on ACR Appropriateness
            Criteria • For Healthcare Professional Use Only
          </p>
        </div>
      </footer>
    </div>
  );
}
