// src/components/PatientSafetySidebar.tsx
'use client';

import { ClinicalScenario, EvaluationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { clsx } from 'clsx';

interface PatientSafetySidebarProps {
  scenario: ClinicalScenario;
  result: EvaluationResult;
}

export function PatientSafetySidebar({
  scenario,
  result,
}: PatientSafetySidebarProps) {
  // Extract safety alerts
  const safetyAlerts = extractSafetyAlerts(scenario, result);
  const hasPriorImaging = scenario.priorImaging && scenario.priorImaging.length > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Patient Safety Alerts */}
      {safetyAlerts.length > 0 && (
        <Card variant="bordered" className="transition-all duration-200 animate-in fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Patient Safety Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {safetyAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={clsx(
                    'p-3 rounded-lg border transition-all duration-200',
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-300'
                      : alert.severity === 'warning'
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-blue-50 border-blue-200'
                  )}
                  role={alert.severity === 'critical' ? 'alert' : 'status'}
                  aria-live={alert.severity === 'critical' ? 'assertive' : 'polite'}
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant={
                        alert.severity === 'critical'
                          ? 'error'
                          : alert.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                      size="sm"
                      aria-label={`${alert.severity} ${alert.type}`}
                    >
                      {alert.type}
                    </Badge>
                    <p
                      className={clsx(
                        'text-base flex-1 font-medium',
                        alert.severity === 'critical'
                          ? 'text-red-800'
                          : alert.severity === 'warning'
                            ? 'text-amber-900'
                            : 'text-gray-800'
                      )}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prior Imaging Summary */}
      {hasPriorImaging && (
        <Card variant="bordered" className="transition-all duration-200 animate-in fade-in bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Prior Imaging Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {scenario.priorImaging!.map((prior, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:shadow-sm hover:border-gray-300"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {prior.modality} - {prior.bodyPart}
                      </p>
                      <p className="text-sm text-gray-600">
                        {prior.daysAgo} days ago ({prior.date})
                      </p>
                    </div>
                    {prior.daysAgo < 30 && (
                      <Badge variant="warning" size="sm">
                        Recent
                      </Badge>
                    )}
                  </div>
                  {prior.findings && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Findings:</strong> {prior.findings}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Safety Factors Summary */}
      {(scenario.pregnancyStatus ||
        scenario.contrastAllergy ||
        scenario.renalFunction ||
        scenario.medications) && (
        <Card variant="bordered" className="transition-all duration-200 animate-in fade-in bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Patient Safety Factors</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 text-base">
              {/* Pregnancy Status */}
              {scenario.pregnancyStatus && scenario.pregnancyStatus !== 'not-applicable' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pregnancy Status:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {scenario.pregnancyStatus.replace('-', ' ')}
                  </span>
                </div>
              )}

              {/* Contrast Allergy */}
              {scenario.contrastAllergy?.hasAllergy && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contrast Allergy:</span>
                  <span className="font-medium text-red-700">
                    {scenario.contrastAllergy.allergyType
                      ? scenario.contrastAllergy.allergyType === 'both'
                        ? 'Iodinated & Gadolinium'
                        : scenario.contrastAllergy.allergyType.charAt(0).toUpperCase() +
                          scenario.contrastAllergy.allergyType.slice(1)
                      : 'Unknown type'}
                  </span>
                </div>
              )}

              {/* Renal Function */}
              {scenario.renalFunction && (
                <div className="space-y-1">
                  {scenario.renalFunction.egfr !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">eGFR:</span>
                      <span
                        className={clsx(
                          'font-medium',
                          scenario.renalFunction.egfr < 30
                            ? 'text-red-700'
                            : scenario.renalFunction.egfr < 60
                              ? 'text-yellow-700'
                              : 'text-gray-900'
                        )}
                      >
                        {scenario.renalFunction.egfr} mL/min/1.73m²
                      </span>
                    </div>
                  )}
                  {scenario.renalFunction.hasImpairment && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Renal Impairment:</span>
                      <span className="font-medium text-red-700">Yes</span>
                    </div>
                  )}
                </div>
              )}

              {/* Medications */}
              {scenario.medications && (
                <div className="space-y-1">
                  {scenario.medications.onAnticoagulation && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Anticoagulation:</span>
                      <span className="font-medium text-amber-700">Yes</span>
                    </div>
                  )}
                  {scenario.medications.onMetformin && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Metformin:</span>
                      <span className="font-medium text-amber-700">Yes</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Demographics Summary */}
      <Card variant="bordered" className="transition-all duration-200 animate-in fade-in bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Patient Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-2 text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium text-gray-900">{scenario.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sex:</span>
              <span className="font-medium text-gray-900 capitalize">{scenario.sex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chief Complaint:</span>
              <span className="font-medium text-gray-900 text-right max-w-[60%]">
                {scenario.chiefComplaint}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">{scenario.duration}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SafetyAlert {
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
}

function extractSafetyAlerts(
  scenario: ClinicalScenario,
  result: EvaluationResult
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];

  // Check pregnancy status (from new field)
  if (scenario.pregnancyStatus === 'pregnant') {
    const hasRadiation = scenario.proposedImaging.modality.includes('CT') ||
      scenario.proposedImaging.modality.includes('X-ray') ||
      scenario.proposedImaging.modality.includes('Nuclear') ||
      scenario.proposedImaging.modality.includes('PET');

    if (hasRadiation) {
      alerts.push({
        type: 'Pregnancy',
        message: 'Patient is pregnant. Avoid radiation exposure. Consider alternative imaging modalities (MRI, Ultrasound).',
        severity: 'critical',
      });
    }
  } else if (scenario.pregnancyStatus === 'unknown' && 
             scenario.sex !== 'male' &&
             scenario.age >= 12 && 
             scenario.age <= 50) {
    const hasRadiation = scenario.proposedImaging.modality.includes('CT') ||
      scenario.proposedImaging.modality.includes('X-ray') ||
      scenario.proposedImaging.modality.includes('Nuclear') ||
      scenario.proposedImaging.modality.includes('PET');
    
    if (hasRadiation) {
      alerts.push({
        type: 'Pregnancy Status',
        message: 'Pregnancy status unknown. Please verify before ordering radiation-based imaging.',
        severity: 'warning',
      });
    }
  }

  // Check for contrast allergy (from new field)
  if (scenario.contrastAllergy?.hasAllergy) {
    const needsContrast = scenario.proposedImaging.modality.includes('contrast') ||
      scenario.proposedImaging.modality.includes('CT with contrast') ||
      scenario.proposedImaging.modality.includes('MRI with contrast');
    
    if (needsContrast) {
      const allergyType = scenario.contrastAllergy.allergyType || 'unknown';
      alerts.push({
        type: 'Contrast Allergy',
        message: `Patient has ${allergyType === 'both' ? 'iodinated and gadolinium' : allergyType} contrast allergy. Avoid contrast-enhanced studies. Consider non-contrast alternatives.`,
        severity: 'critical',
      });
    }
  }

  // Check for renal function (from new field)
  if (scenario.renalFunction) {
    const needsContrast = scenario.proposedImaging.modality.includes('contrast') ||
      scenario.proposedImaging.modality.includes('CT with contrast') ||
      scenario.proposedImaging.modality.includes('MRI with contrast');
    
    if (needsContrast) {
      const egfr = scenario.renalFunction.egfr;
      const hasImpairment = scenario.renalFunction.hasImpairment;

      if ((egfr !== undefined && egfr < 30) || hasImpairment) {
        alerts.push({
          type: 'Renal Function',
          message: 'eGFR < 30 or known renal impairment. Risk of contrast-induced nephropathy. Consider non-contrast alternatives or consult nephrology.',
          severity: 'warning',
        });
      } else if (egfr !== undefined && egfr >= 30 && egfr < 60) {
        alerts.push({
          type: 'Renal Function',
          message: `Moderate renal impairment (eGFR: ${egfr} mL/min/1.73m²). Monitor renal function after contrast administration.`,
          severity: 'info',
        });
      }
    }
  }

  // Check medications
  if (scenario.medications?.onMetformin) {
    const needsContrast = scenario.proposedImaging.modality.includes('contrast') ||
      scenario.proposedImaging.modality.includes('CT with contrast') ||
      scenario.proposedImaging.modality.includes('MRI with contrast');
    
    if (needsContrast) {
      alerts.push({
        type: 'Medication',
        message: 'Patient on metformin. Consider holding metformin 48 hours before and after contrast administration.',
        severity: 'info',
      });
    }
  }

  if (scenario.medications?.onAnticoagulation) {
    alerts.push({
      type: 'Medication',
      message: 'Patient on anticoagulation. May affect procedure timing and bleeding risk.',
      severity: 'info',
    });
  }

  // Add warnings from evaluation result
  result.warnings.forEach(warning => {
    if (warning.severity === 'critical' || warning.severity === 'warning') {
      alerts.push({
        type: warning.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        message: warning.message,
        severity: warning.severity,
      });
    }
  });

  return alerts;
}

