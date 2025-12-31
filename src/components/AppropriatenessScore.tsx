// src/components/AppropriatenessScore.tsx
'use client';

import { useState } from 'react';
import { EvaluationResult, ClinicalScenario } from '@/types';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { clsx } from 'clsx';
import { AppropriatenessIndicator } from './AppropriatenessIndicator';

interface AppropriatenessScoreProps {
  result: EvaluationResult;
  scenario: ClinicalScenario;
  onCopyJustification?: (text: string) => void;
}

export function AppropriatenessScore({ result, scenario, onCopyJustification }: AppropriatenessScoreProps) {
  const { appropriatenessScore, trafficLight, matchedCriteria, reasoning, confidenceLevel, coverageStatus, evidenceLinks } =
    result;
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);

  // Generate one-line recommendation
  const oneLineRecommendation = generateOneLineRecommendation(
    appropriatenessScore,
    scenario,
    matchedCriteria
  );

  // Extract key clinical factors (first 3-4 from reasoning)
  const keyFactors = extractKeyFactors(reasoning, scenario);

  // Generate clinical justification text for copying
  const clinicalJustification = generateClinicalJustification(
    result,
    scenario,
    oneLineRecommendation,
    keyFactors
  );

  const handleCopyJustification = () => {
    if (onCopyJustification) {
      onCopyJustification(clinicalJustification);
    } else {
      navigator.clipboard.writeText(clinicalJustification);
      // Could add a toast notification here
    }
  };

  // Get ACR source link
  const acrLink = evidenceLinks.find(link => link.type === 'acr-guideline')?.url || 
    `https://acsearch.acr.org/list?q=${encodeURIComponent(matchedCriteria.topic)}`;

  return (
    <div role="region" aria-labelledby="appropriateness-result-title">
      <Card variant="elevated" className="overflow-hidden transition-all duration-300 animate-in fade-in">
      {/* TOP SECTION: Large Traffic Light + One-Line Recommendation */}
      <div
        className={clsx(
          'p-4 sm:p-6 md:p-8',
          'border-l-4',
          'transition-colors duration-200',
          trafficLight === 'green' && 'bg-teal-50 border-teal-500',
          trafficLight === 'yellow' && 'bg-yellow-50 border-yellow-500',
          trafficLight === 'red' && 'bg-red-50 border-red-600'
        )}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
          {/* Traffic Light Indicator - Always at top on mobile */}
          <div className="flex-shrink-0">
            <AppropriatenessIndicator
              trafficLight={trafficLight}
              score={appropriatenessScore.value}
            />
          </div>
          
          {/* One-Line Recommendation */}
          <div className="flex-1 text-center w-full">
            <h2 id="appropriateness-result-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 px-2">
              {oneLineRecommendation}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <CoverageStatusBadge status={coverageStatus} />
              <ConfidenceLevelBadge level={confidenceLevel} />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 transition-all duration-200">
        {/* MIDDLE SECTION: ACR Source Citation + Key Clinical Factors */}
        <div className="space-y-4">
          {/* ACR Source Citation */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">ACR Source Citation</h3>
            {coverageStatus !== 'INSUFFICIENT_DATA' ? (
              <>
                <p className="text-base text-gray-700 mb-2">
                  <strong>Topic:</strong> {matchedCriteria.topic}
                  {matchedCriteria.variant && ` - ${matchedCriteria.variant}`}
                </p>
                <p className="text-base text-gray-700 mb-2">
                  <strong>Based on:</strong> {matchedCriteria.source}
                  {matchedCriteria.lastReviewed && matchedCriteria.lastReviewed !== 'N/A' && (
                    <span className="text-gray-600">
                      {' '}(Revised {matchedCriteria.lastReviewed})
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600 mb-3 italic">
                  ACR Appropriateness Criteria document reference
                </p>
                <a
                  href={acrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>View ACR Guidelines</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </>
            ) : (
              <p className="text-base text-amber-800">
                No matching ACR criteria found. Consult ACR Appropriateness Criteria directly or seek expert radiology consultation.
              </p>
            )}
          </div>

          {/* Key Clinical Factors */}
          {keyFactors.length > 0 && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Key Clinical Factors</h3>
              <ul className="space-y-2">
                {keyFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-base text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Detailed Reasoning (Collapsible) */}
        <div className="border-t border-gray-200 pt-4 sm:pt-6">
          <button
            onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
            className="flex items-center justify-between w-full mb-4 text-left p-3 -m-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={isReasoningExpanded}
            aria-controls="detailed-reasoning"
            aria-label={isReasoningExpanded ? 'Collapse detailed clinical reasoning' : 'Expand detailed clinical reasoning'}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isReasoningExpanded ? 'Hide' : 'Show'} Detailed Clinical Reasoning
            </h3>
            <svg
              className={clsx(
                'w-6 h-6 text-gray-500 transition-transform flex-shrink-0',
                isReasoningExpanded && 'transform rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isReasoningExpanded && (
            <div className="space-y-3">
              <ul className="space-y-2">
                {reasoning.map((reason, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-base text-gray-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                    {reason}
                  </li>
                ))}
              </ul>
              
              {/* Copy Clinical Justification Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleCopyJustification}
                  variant="outline"
                  className="w-full min-h-[44px]"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Clinical Justification to Clipboard
                </Button>
              </div>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
    );
  }

// Helper function to generate one-line recommendation
function generateOneLineRecommendation(
  score: EvaluationResult['appropriatenessScore'],
  scenario: ClinicalScenario,
  criteria: EvaluationResult['matchedCriteria']
): string {
  if (score.value === 0) {
    return 'Insufficient data to provide appropriateness rating';
  }

  if (score.category === 'usually-appropriate') {
    return `Imaging appropriate - proceed with ${scenario.proposedImaging.modality}`;
  } else if (score.category === 'usually-not-appropriate') {
    // Suggest alternatives
    const alternatives = scenario.proposedImaging.modality === 'MRI' ? 'X-ray or CT' :
      scenario.proposedImaging.modality === 'CT' ? 'X-ray' :
      'alternative imaging';
    return `Consider ${alternatives} before ${scenario.proposedImaging.modality}`;
  } else {
    return `May be appropriate - consider clinical context for ${scenario.proposedImaging.modality}`;
  }
}

// Helper function to extract key clinical factors
function extractKeyFactors(
  reasoning: string[],
  scenario: ClinicalScenario
): string[] {
  const factors: string[] = [];
  
  // Extract key points (limit to 3-4)
  const keyPatterns = [
    /red flags? identified/i,
    /no red flags/i,
    /prior imaging/i,
    /recent .* performed/i,
    /ACR rating/i,
    /direct match/i,
    /similar case/i,
  ];

  for (const reason of reasoning) {
    if (factors.length >= 4) break;
    
    // Check if this reason contains a key pattern
    const isKeyFactor = keyPatterns.some(pattern => pattern.test(reason));
    
    if (isKeyFactor && !factors.includes(reason)) {
      factors.push(reason);
    }
  }

  // If we don't have enough, add the first few reasons
  if (factors.length < 3) {
    for (const reason of reasoning) {
      if (factors.length >= 4) break;
      if (!factors.includes(reason)) {
        factors.push(reason);
      }
    }
  }

  return factors.slice(0, 4);
}

// Helper function to generate clinical justification text
function generateClinicalJustification(
  result: EvaluationResult,
  scenario: ClinicalScenario,
  recommendation: string,
  keyFactors: string[]
): string {
  let text = `CLINICAL JUSTIFICATION FOR IMAGING ORDER\n`;
  text += `==========================================\n\n`;
  text += `Patient: ${scenario.age} year old ${scenario.sex}\n`;
  text += `Chief Complaint: ${scenario.chiefComplaint}\n`;
  text += `Duration: ${scenario.duration}\n`;
  text += `Proposed Imaging: ${scenario.proposedImaging.modality} - ${scenario.proposedImaging.bodyPart}\n\n`;
  text += `RECOMMENDATION: ${recommendation}\n\n`;
  text += `ACR Appropriateness Score: ${result.appropriatenessScore.value}/9\n`;
  text += `Confidence Level: ${result.confidenceLevel}\n`;
  text += `Coverage Status: ${result.coverageStatus}\n\n`;
  text += `KEY CLINICAL FACTORS:\n`;
  keyFactors.forEach((factor, idx) => {
    text += `${idx + 1}. ${factor}\n`;
  });
  text += `\nACR Source: ${result.matchedCriteria.source}\n`;
  text += `Topic: ${result.matchedCriteria.topic}\n`;
  if (result.matchedCriteria.variant) {
    text += `Variant: ${result.matchedCriteria.variant}\n`;
  }
  text += `\nGenerated by ARKA Clinical Decision Support Tool\n`;
  text += `Based on ACR Appropriateness Criteria\n`;
  return text;
}


// Coverage Status Badge Component
function CoverageStatusBadge({
  status,
}: {
  status: 'DIRECT_MATCH' | 'SIMILAR_MATCH' | 'GENERAL_GUIDANCE' | 'INSUFFICIENT_DATA';
}) {
  const statusConfig = {
    DIRECT_MATCH: {
      label: 'Direct Match',
      className: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: '✓',
    },
    SIMILAR_MATCH: {
      label: 'Similar Case',
      className: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '≈',
    },
    GENERAL_GUIDANCE: {
      label: 'General Guidance',
      className: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: '~',
    },
    INSUFFICIENT_DATA: {
      label: 'Insufficient Data',
      className: 'bg-red-100 text-red-800 border-red-300',
      icon: '✗',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-medium',
        config.className
      )}
      role="status"
      aria-label={config.label}
    >
      <span className="mr-1" aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}

// Confidence Level Badge Component
function ConfidenceLevelBadge({
  level,
}: {
  level: 'High' | 'Medium' | 'Low';
}) {
  const levelConfig = {
    High: {
      label: 'High Confidence',
      className: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: '✓',
    },
    Medium: {
      label: 'Medium Confidence',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      icon: '◐',
    },
    Low: {
      label: 'Low Confidence',
      className: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: '?',
    },
  };

  const config = levelConfig[level];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-medium',
        config.className
      )}
      role="status"
      aria-label={config.label}
    >
      <span className="mr-1" aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}

