// src/components/WorkflowActions.tsx
'use client';

import { useState } from 'react';
import { EvaluationResult, ClinicalScenario } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { clsx } from 'clsx';

interface WorkflowActionsProps {
  result: EvaluationResult;
  scenario: ClinicalScenario;
  onCopyJustification?: (text: string) => void;
}

interface AuditLogEntry {
  timestamp: string;
  action: string;
  details?: string;
}

const OVERRIDE_REASONS = [
  'Clinical judgment - additional factors not captured',
  'Patient preference after informed discussion',
  'Urgent clinical need outweighs guidelines',
  'Prior imaging non-diagnostic',
  'Other (free text)',
] as const;

export function WorkflowActions({
  result,
  scenario,
  onCopyJustification,
}: WorkflowActionsProps) {
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState(false);
  const [showProceedOverride, setShowProceedOverride] = useState(false);
  const [selectedOverrideReason, setSelectedOverrideReason] = useState<string>('');
  const [customOverrideReason, setCustomOverrideReason] = useState('');
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [showAuditLog, setShowAuditLog] = useState(false);

  // Generate one-line recommendation for display
  const recommendationText = generateRecommendationText(result, scenario);
  
  // Determine appropriateness status
  const isAppropriate = result.trafficLight === 'green';
  const isMayBeAppropriate = result.trafficLight === 'yellow';
  const isNotAppropriate = result.trafficLight === 'red';

  const handleAcceptRecommendation = () => {
    if (!showAcceptConfirmation) {
      setShowAcceptConfirmation(true);
      return;
    }

    // Log acceptance
    const timestamp = new Date().toLocaleString();
    const newEntry: AuditLogEntry = {
      timestamp,
      action: 'Accepted recommendation',
      details: recommendationText,
    };
    setAuditLog(prev => [...prev, newEntry]);
    setShowAcceptConfirmation(false);
    setShowAuditLog(true);

    // In production, this would send to backend/EMR
    console.log('Recommendation accepted:', {
      timestamp,
      result,
      scenario,
    });
  };

  const handleProceedWithOverride = () => {
    if (!showProceedOverride) {
      setShowProceedOverride(true);
      return;
    }

    const overrideReason = selectedOverrideReason === 'Other (free text)'
      ? customOverrideReason
      : selectedOverrideReason;

    if (!overrideReason.trim()) {
      alert('Please select or enter an override reason.');
      return;
    }

    // Log override
    const timestamp = new Date().toLocaleString();
    const newEntry: AuditLogEntry = {
      timestamp,
      action: 'Proceeded with override',
      details: `Override reason: ${overrideReason}`,
    };
    setAuditLog(prev => [...prev, newEntry]);
    setShowProceedOverride(false);
    setSelectedOverrideReason('');
    setCustomOverrideReason('');
    setShowAuditLog(true);

    // In production, this would send to backend/EMR
    console.log('Proceeded with override:', {
      timestamp,
      result,
      scenario,
      overrideReason,
    });
  };

  const handleCopyJustification = () => {
    const justification = generateClinicalJustification(result, scenario);
    if (onCopyJustification) {
      onCopyJustification(justification);
    } else {
      navigator.clipboard.writeText(justification);
    }
    // Show brief feedback
    alert('Clinical justification copied to clipboard.');
  };

  const handleGenerateCDSSummary = () => {
    const summary = generateCDSConsultationSummary(result, scenario, auditLog);
    navigator.clipboard.writeText(summary);
    alert('CDS Consultation Summary copied to clipboard.');
  };

  return (
    <Card variant="bordered" className="transition-all duration-200 animate-in fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Clinical Workflow Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {/* Accept Recommendation */}
          {!showAcceptConfirmation ? (
            <Button
              onClick={handleAcceptRecommendation}
              variant="primary"
              size="lg"
              className="w-full min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={isAppropriate || isMayBeAppropriate ? 'Accept the imaging recommendation' : 'Cannot accept - imaging is not appropriate'}
              disabled={!isAppropriate && !isMayBeAppropriate}
            >
              ✓ Accept Recommendation
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                <p className="text-base text-blue-800 mb-2">
                  Confirm acceptance of recommendation:
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  {recommendationText}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAcceptRecommendation}
                  variant="primary"
                  size="md"
                  className="flex-1 min-h-[44px]"
                >
                  Confirm Accept
                </Button>
                <Button
                  onClick={() => setShowAcceptConfirmation(false)}
                  variant="outline"
                  size="md"
                  className="flex-1 min-h-[44px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Proceed with Original Order */}
          {!showProceedOverride ? (
            <Button
              onClick={handleProceedWithOverride}
              variant="outline"
              size="lg"
              className="w-full min-h-[44px] border-amber-300 text-amber-700 hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={isAppropriate ? 'Cannot override - imaging is already appropriate' : 'Proceed with original order despite recommendation'}
              disabled={isAppropriate}
            >
              Proceed with Original Order
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-base text-amber-800 mb-2 font-semibold">
                  Override Reason Required
                </p>
                <p className="text-sm text-amber-700 mb-3">
                  Please select or provide a reason for proceeding against the recommendation:
                </p>
                <select
                  value={selectedOverrideReason}
                  onChange={(e) => {
                    setSelectedOverrideReason(e.target.value);
                    if (e.target.value !== 'Other (free text)') {
                      setCustomOverrideReason('');
                    }
                  }}
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-base text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[44px] mb-2"
                >
                  <option value="">Select override reason...</option>
                  {OVERRIDE_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {selectedOverrideReason === 'Other (free text)' && (
                  <textarea
                    value={customOverrideReason}
                    onChange={(e) => setCustomOverrideReason(e.target.value)}
                    placeholder="Enter override reason..."
                    rows={2}
                    className="w-full rounded-md border border-amber-300 px-3 py-2 text-base text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[88px]"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleProceedWithOverride}
                  variant="outline"
                  size="md"
                  className="flex-1 min-h-[44px] border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Confirm Proceed
                </Button>
                <Button
                  onClick={() => {
                    setShowProceedOverride(false);
                    setSelectedOverrideReason('');
                    setCustomOverrideReason('');
                  }}
                  variant="outline"
                  size="md"
                  className="flex-1 min-h-[44px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Documentation Helpers */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 mt-2">
            Documentation Helpers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={handleCopyJustification}
              variant="outline"
              size="md"
              className="w-full min-h-[44px]"
            >
              📋 Copy Clinical Justification
            </Button>
            <Button
              onClick={handleGenerateCDSSummary}
              variant="outline"
              size="md"
              className="w-full min-h-[44px]"
            >
              📄 Generate CDS Consultation Summary
            </Button>
          </div>
        </div>

        {/* Audit Log */}
        {auditLog.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3 mt-2 gap-2">
              <h3 className="text-base font-semibold text-gray-900">
                Audit Log
              </h3>
              <button
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="text-sm text-blue-600 hover:text-blue-800 min-h-[44px] px-2 flex-shrink-0 whitespace-nowrap"
              >
                {showAuditLog ? 'Hide' : 'Show'}
              </button>
            </div>
            {showAuditLog && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2">
                {auditLog.map((entry, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 border-l-2 border-gray-300 pl-3"
                  >
                    <span className="font-mono text-xs text-gray-500">
                      [{entry.timestamp}]
                    </span>{' '}
                    <span className="font-medium">{entry.action}</span>
                    {entry.details && (
                      <div className="mt-1 text-gray-600 pl-4">
                        {entry.details}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
function generateRecommendationText(
  result: EvaluationResult,
  scenario: ClinicalScenario
): string {
  const { appropriatenessScore, trafficLight } = result;
  const modality = scenario.proposedImaging.modality;
  
  if (trafficLight === 'green') {
    return `${modality} is appropriate (Score: ${appropriatenessScore.value}/9)`;
  } else if (trafficLight === 'yellow') {
    return `${modality} may be appropriate (Score: ${appropriatenessScore.value}/9)`;
  } else {
    return `${modality} is not appropriate (Score: ${appropriatenessScore.value}/9)`;
  }
}

function generateClinicalJustification(
  result: EvaluationResult,
  scenario: ClinicalScenario
): string {
  const { appropriatenessScore, matchedCriteria, reasoning } = result;
  const { proposedImaging } = scenario;

  let text = `CLINICAL JUSTIFICATION FOR IMAGING ORDER\n`;
  text += `==========================================\n\n`;
  text += `Patient: ${scenario.age} year old ${scenario.sex}\n`;
  text += `Chief Complaint: ${scenario.chiefComplaint}\n`;
  text += `Duration: ${scenario.duration}\n\n`;
  text += `Proposed Imaging: ${proposedImaging.modality} - ${proposedImaging.bodyPart}\n`;
  text += `Clinical Indication: ${proposedImaging.indication}\n\n`;
  text += `ACR Appropriateness Score: ${appropriatenessScore.value}/9\n`;
  text += `Category: ${appropriatenessScore.category}\n\n`;
  text += `ACR Source: ${matchedCriteria.source}\n`;
  text += `Topic: ${matchedCriteria.topic}\n`;
  if (matchedCriteria.variant) {
    text += `Variant: ${matchedCriteria.variant}\n`;
  }
  text += `\nClinical Reasoning:\n`;
  reasoning.forEach((reason, idx) => {
    text += `${idx + 1}. ${reason}\n`;
  });
  text += `\nGenerated by ARKA Clinical Decision Support Tool\n`;
  text += `Based on ACR Appropriateness Criteria\n`;
  text += `Date: ${new Date().toLocaleString()}\n`;

  return text;
}

function generateCDSConsultationSummary(
  result: EvaluationResult,
  scenario: ClinicalScenario,
  auditLog: AuditLogEntry[]
): string {
  const { appropriatenessScore, matchedCriteria, trafficLight } = result;
  const { proposedImaging } = scenario;

  let summary = `CDS CONSULTATION SUMMARY\n`;
  summary += `======================\n\n`;
  summary += `Date/Time of Consultation: ${new Date().toLocaleString()}\n\n`;
  
  summary += `CLINICAL SCENARIO SUMMARY:\n`;
  summary += `- Patient: ${scenario.age} year old ${scenario.sex}\n`;
  summary += `- Chief Complaint: ${scenario.chiefComplaint}\n`;
  summary += `- Duration: ${scenario.duration}\n`;
  if (scenario.clinicalHistory) {
    summary += `- Clinical History: ${scenario.clinicalHistory}\n`;
  }
  summary += `- Proposed Imaging: ${proposedImaging.modality} - ${proposedImaging.bodyPart}\n`;
  summary += `- Clinical Indication: ${proposedImaging.indication}\n\n`;

  summary += `RECOMMENDATION RECEIVED:\n`;
  summary += `- Appropriateness Score: ${appropriatenessScore.value}/9\n`;
  summary += `- Category: ${appropriatenessScore.category}\n`;
  summary += `- Traffic Light: ${trafficLight.toUpperCase()}\n`;
  summary += `- ACR Source: ${matchedCriteria.source}\n`;
  summary += `- Topic: ${matchedCriteria.topic}\n`;
  if (matchedCriteria.variant) {
    summary += `- Variant: ${matchedCriteria.variant}\n`;
  }
  summary += `\n`;

  if (auditLog.length > 0) {
    summary += `ACTIONS TAKEN:\n`;
    auditLog.forEach((entry) => {
      summary += `- [${entry.timestamp}] ${entry.action}\n`;
      if (entry.details) {
        summary += `  ${entry.details}\n`;
      }
    });
    summary += `\n`;
  }

  summary += `Generated by ARKA Clinical Decision Support Tool\n`;
  summary += `Based on ACR Appropriateness Criteria\n`;

  return summary;
}

