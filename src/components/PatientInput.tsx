// src/components/PatientInput.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { ClinicalScenario, ImagingModality, RedFlag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { clsx } from 'clsx';
import {
  validateAge,
  getAgeFlags,
  checkContradictions,
  detectPregnancy,
  normalizeChiefComplaint,
  getChiefComplaintSuggestions,
  ValidationError,
  ValidationWarnings,
} from '@/lib/validation';
import {
  parseDuration as parseDurationAdvanced,
  ParsedDuration,
  COMMON_DURATIONS,
} from '@/lib/duration-parser';

interface PatientInputProps {
  onSubmit: (scenario: ClinicalScenario) => void;
  isLoading?: boolean;
}

// Common red flags by clinical scenario
const RED_FLAGS_OPTIONS: RedFlag[] = [
  { flag: 'History of cancer', present: false },
  { flag: 'Unexplained weight loss', present: false },
  { flag: 'Fever', present: false },
  { flag: 'Neurological deficit', present: false },
  { flag: 'Trauma', present: false },
  { flag: 'Age > 50 with new symptoms', present: false },
  { flag: 'Progressive symptoms', present: false },
  { flag: 'Immunocompromised', present: false },
  { flag: 'IV drug use', present: false },
  { flag: 'Anticoagulation therapy', present: false },
];

const IMAGING_MODALITIES: ImagingModality[] = [
  'X-ray',
  'CT',
  'CT with contrast',
  'MRI',
  'MRI with contrast',
  'Ultrasound',
  'Nuclear Medicine',
  'PET-CT',
];

export function PatientInput({ onSubmit, isLoading }: PatientInputProps) {
  const [formData, setFormData] = useState({
    age: 45,
    sex: 'male' as const,
    chiefComplaint: '',
    clinicalHistory: '',
    symptoms: '',
    duration: '',
    imagingModality: 'MRI' as ImagingModality,
    bodyPart: '',
    indication: '',
    urgency: 'routine' as const,
    hasPriorImaging: false,
    priorImagingModality: 'X-ray' as ImagingModality,
    priorImagingBodyPart: '',
    priorImagingDays: 30,
    // Patient Safety Factors
    pregnancyStatus: undefined as 'not-pregnant' | 'pregnant' | 'unknown' | 'not-applicable' | undefined,
    hasContrastAllergy: false,
    contrastAllergyType: undefined as 'iodinated' | 'gadolinium' | 'both' | 'unknown' | undefined,
    egfr: undefined as number | undefined,
    hasRenalImpairment: false,
    onAnticoagulation: false,
    onMetformin: false,
  });

  const [redFlags, setRedFlags] = useState<RedFlag[]>(RED_FLAGS_OPTIONS);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationWarnings>({});
  const [chiefComplaintSuggestions, setChiefComplaintSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [normalizedComplaint, setNormalizedComplaint] = useState<string | null>(null);
  const [parsedDuration, setParsedDuration] = useState<ParsedDuration | null>(null);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for critical errors
    const criticalErrors = validationErrors.filter(e => e.severity === 'error');
    if (criticalErrors.length > 0) {
      return; // Don't submit if there are critical errors
    }

    // Use normalized chief complaint if available
    const finalChiefComplaint = normalizedComplaint || formData.chiefComplaint;

    // Determine pregnancy status based on sex
    let pregnancyStatus: 'not-pregnant' | 'pregnant' | 'unknown' | 'not-applicable' | undefined = formData.pregnancyStatus;
    if (!pregnancyStatus) {
      if (formData.sex === 'male') {
        pregnancyStatus = 'not-applicable';
      } else {
        pregnancyStatus = 'unknown';
      }
    }

    const scenario: ClinicalScenario = {
      patientId: `SYNTH-${Date.now()}`,
      age: formData.age,
      sex: formData.sex,
      chiefComplaint: finalChiefComplaint,
      clinicalHistory: formData.clinicalHistory,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      duration: formData.duration,
      redFlags: redFlags,
      // Patient Safety Factors
      pregnancyStatus,
      contrastAllergy: formData.hasContrastAllergy
        ? {
            hasAllergy: true,
            allergyType: formData.contrastAllergyType,
          }
        : undefined,
      renalFunction:
        formData.egfr !== undefined || formData.hasRenalImpairment
          ? {
              egfr: formData.egfr,
              hasImpairment: formData.hasRenalImpairment,
            }
          : undefined,
      medications:
        formData.onAnticoagulation || formData.onMetformin
          ? {
              onAnticoagulation: formData.onAnticoagulation,
              onMetformin: formData.onMetformin,
            }
          : undefined,
      proposedImaging: {
        modality: formData.imagingModality,
        bodyPart: formData.bodyPart,
        indication: formData.indication,
        urgency: formData.urgency,
      },
      priorImaging: formData.hasPriorImaging
        ? [
            {
              modality: formData.priorImagingModality,
              bodyPart: formData.priorImagingBodyPart || formData.bodyPart,
              date: new Date(
                Date.now() - formData.priorImagingDays * 24 * 60 * 60 * 1000
              ).toISOString(),
              daysAgo: formData.priorImagingDays,
            },
          ]
        : undefined,
    };
    onSubmit(scenario);
  };

  const toggleRedFlag = (index: number) => {
    setRedFlags(prev =>
      prev.map((rf, i) => (i === index ? { ...rf, present: !rf.present } : rf))
    );
  };

  // Validation effect
  useEffect(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarnings = {};

    // Age validation
    const ageErrors = validateAge(formData.age);
    errors.push(...ageErrors);
    Object.assign(warnings, getAgeFlags(formData.age));

    // Chief complaint normalization
    if (formData.chiefComplaint) {
      const normalized = normalizeChiefComplaint(formData.chiefComplaint);
      if (normalized && normalized !== formData.chiefComplaint) {
        warnings.chiefComplaintNormalized = normalized;
      }
    }

    // Contradiction detection
    const isPregnant = detectPregnancy(formData.symptoms, formData.clinicalHistory);
    const contradictions = checkContradictions(
      formData.clinicalHistory,
      formData.symptoms,
      formData.duration,
      redFlags,
      isPregnant,
      formData.imagingModality
    );
    Object.assign(warnings, contradictions);

    setValidationErrors(errors);
    setValidationWarnings(warnings);
  }, [formData, redFlags]);

  // Chief complaint autocomplete
  useEffect(() => {
    if (formData.chiefComplaint.length >= 2) {
      const suggestions = getChiefComplaintSuggestions(formData.chiefComplaint);
      setChiefComplaintSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.chiefComplaint]);

  // Parse duration when it changes
  useEffect(() => {
    if (formData.duration) {
      const parsed = parseDurationAdvanced(formData.duration);
      setParsedDuration(parsed);
      // Show dropdown if parsing confidence is low
      setShowDurationDropdown(parsed.confidence === 'low' && parsed.value === 0);
    } else {
      setParsedDuration(null);
      setShowDurationDropdown(false);
    }
  }, [formData.duration]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        durationDropdownRef.current &&
        !durationDropdownRef.current.contains(event.target as Node) &&
        durationInputRef.current &&
        !durationInputRef.current.contains(event.target as Node)
      ) {
        setShowDurationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectDuration = (duration: typeof COMMON_DURATIONS[0]) => {
    setFormData(prev => ({ ...prev, duration: duration.value }));
    setShowDurationDropdown(false);
  };

  const handleChiefComplaintChange = (value: string) => {
    setFormData(prev => ({ ...prev, chiefComplaint: value }));
    const normalized = normalizeChiefComplaint(value);
    setNormalizedComplaint(normalized);
  };

  const selectSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, chiefComplaint: suggestion }));
    setShowSuggestions(false);
    const normalized = normalizeChiefComplaint(suggestion);
    setNormalizedComplaint(normalized);
  };

  return (
    <Card className="transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-xl">Clinical Scenario Input</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age-input" className="block text-base font-medium text-gray-700 mb-1">
                Age
                {validationWarnings.pediatricFlag && (
                  <span className="ml-2 text-sm text-blue-600 font-normal">(Pediatric)</span>
                )}
                {validationWarnings.geriatricFlag && (
                  <span className="ml-2 text-sm text-amber-600 font-normal">(Geriatric)</span>
                )}
              </label>
              <input
                id="age-input"
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    age: parseInt(e.target.value) || 0,
                  }))
                }
                aria-describedby={validationErrors.some(e => e.field === 'age') ? 'age-error' : undefined}
                aria-invalid={validationErrors.some(e => e.field === 'age' && e.severity === 'error')}
                className={clsx(
                  "w-full rounded-md border px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 min-h-[44px]",
                  validationErrors.some(e => e.field === 'age' && e.severity === 'error')
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : validationErrors.some(e => e.field === 'age' && e.severity === 'warning')
                      ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                )}
              />
              {validationErrors.filter(e => e.field === 'age').length > 0 && (
                <div id="age-error" role="alert" aria-live="polite" className="mt-1">
                  {validationErrors.filter(e => e.field === 'age').map((error, idx) => (
                    <p key={idx} className={clsx(
                      "text-sm",
                      error.severity === 'error' ? 'text-red-600 font-medium' : 'text-yellow-600'
                    )}>
                      {error.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                value={formData.sex}
                onChange={e =>
                  setFormData(prev => ({ ...prev, sex: e.target.value as any }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="relative">
            <label htmlFor="chief-complaint-input" className="block text-sm font-medium text-gray-700 mb-1">
              Chief Complaint *
            </label>
            <input
              id="chief-complaint-input"
              ref={inputRef}
              type="text"
              required
              placeholder="e.g., Lower back pain, LBP, HA"
              value={formData.chiefComplaint}
              onChange={e => handleChiefComplaintChange(e.target.value)}
              onFocus={() => {
                if (chiefComplaintSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              aria-describedby={normalizedComplaint && normalizedComplaint !== formData.chiefComplaint ? 'normalized-complaint' : undefined}
              aria-invalid={validationErrors.some(e => e.field === 'chiefComplaint')}
              className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 min-h-[44px]"
            />
            {normalizedComplaint && normalizedComplaint !== formData.chiefComplaint && (
              <p className="mt-1 text-sm text-blue-600">
                ℹ️ Interpreting "{formData.chiefComplaint}" as "{normalizedComplaint}"
              </p>
            )}
            {showSuggestions && chiefComplaintSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto"
              >
                {chiefComplaintSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-3 py-3 sm:py-2 hover:bg-blue-50 text-base text-gray-700 min-h-[44px]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration of Symptoms *
            </label>
            <input
              ref={durationInputRef}
              type="text"
              required
              placeholder="e.g., 3 days, on and off for 3 months, chronic"
              value={formData.duration}
              onChange={e =>
                setFormData(prev => ({ ...prev, duration: e.target.value }))
              }
              onFocus={() => {
                if (parsedDuration?.confidence === 'low' && parsedDuration.value === 0) {
                  setShowDurationDropdown(true);
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
            {parsedDuration && parsedDuration.interpretation && (
              <p className={clsx(
                "mt-1 text-xs",
                parsedDuration.confidence === 'high' 
                  ? 'text-blue-600' 
                  : parsedDuration.confidence === 'medium'
                    ? 'text-amber-600'
                    : 'text-gray-500'
              )}>
                ℹ️ Parsed as: {parsedDuration.interpretation}
              </p>
            )}
            {showDurationDropdown && (
              <div
                ref={durationDropdownRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <div className="p-2 text-sm font-semibold text-gray-500 border-b">
                  Select common duration:
                </div>
                {COMMON_DURATIONS.map((duration, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDuration(duration)}
                  className="w-full text-left px-3 py-3 sm:py-2 hover:bg-blue-50 text-sm text-gray-700 min-h-[44px]"
                >
                    {duration.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clinical History */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinical History
            </label>
            <textarea
              placeholder="Relevant medical history, comorbidities, etc."
              value={formData.clinicalHistory}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  clinicalHistory: e.target.value,
                }))
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[88px] sm:min-h-0"
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., pain, numbness, weakness"
              value={formData.symptoms}
              onChange={e =>
                setFormData(prev => ({ ...prev, symptoms: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </div>

          {/* Validation Warnings */}
          {validationWarnings.contradictoryInputs && validationWarnings.contradictoryInputs.length > 0 && (
            <div className="rounded-lg bg-yellow-50 border border-yellow-300 p-4">
              <h4 className="text-base font-semibold text-yellow-900 mb-2">
                ⚠️ Contradictory Input Detected
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationWarnings.contradictoryInputs.map((msg, idx) => (
                  <li key={idx} className="text-base text-yellow-800">{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {validationWarnings.pregnancyRadiationWarning && (
            <div className="rounded-lg bg-red-50 border-2 border-red-400 p-4">
              <h4 className="text-base font-bold text-red-900 mb-2">
                🚨 CRITICAL WARNING
              </h4>
              <p className="text-base text-red-800 font-medium">
                {validationWarnings.pregnancyRadiationWarning}
              </p>
            </div>
          )}

          {/* Red Flags */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Red Flags (check all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {redFlags.map((rf, index) => (
                <label
                  key={rf.flag}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 min-h-[44px]"
                >
                  <input
                    type="checkbox"
                    checked={rf.present}
                    onChange={() => toggleRedFlag(index)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-base text-gray-700">{rf.flag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Patient Safety Factors */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-xl text-gray-900 mb-4">
              Patient Safety Factors
            </h3>
            
            {/* Pregnancy Status */}
            {formData.sex !== 'male' && (
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Pregnancy Status *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['not-pregnant', 'pregnant', 'unknown'] as const).map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 cursor-pointer p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 min-h-[44px]"
                    >
                      <input
                        type="radio"
                        name="pregnancyStatus"
                        value={status}
                        checked={formData.pregnancyStatus === status}
                        onChange={() =>
                          setFormData(prev => ({ ...prev, pregnancyStatus: status }))
                        }
                        className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-base text-gray-700 capitalize">
                        {status.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.pregnancyStatus === 'pregnant' &&
                  (formData.imagingModality.includes('CT') ||
                    formData.imagingModality.includes('X-ray') ||
                    formData.imagingModality.includes('Nuclear') ||
                    formData.imagingModality.includes('PET')) && (
                    <div className="mt-2 rounded-lg bg-red-50 border-2 border-red-400 p-3">
                      <p className="text-base text-red-800 font-semibold">
                        🚨 CRITICAL: Patient is pregnant. Radiation exposure should be avoided. Consider MRI or Ultrasound alternatives.
                      </p>
                    </div>
                  )}
                {formData.pregnancyStatus === 'unknown' &&
                  formData.age >= 12 &&
                  formData.age <= 50 &&
                  (formData.imagingModality.includes('CT') ||
                    formData.imagingModality.includes('X-ray') ||
                    formData.imagingModality.includes('Nuclear') ||
                    formData.imagingModality.includes('PET')) && (
                    <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-300 p-3">
                      <p className="text-base text-yellow-800">
                        ⚠️ Pregnancy status unknown. Please verify before ordering radiation-based imaging.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* Contrast Considerations */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer mb-3 min-h-[44px] p-2 rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.hasContrastAllergy}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      hasContrastAllergy: e.target.checked,
                      contrastAllergyType: e.target.checked ? prev.contrastAllergyType : undefined,
                    }))
                  }
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                />
                <span className="text-base font-medium text-gray-700">
                  Known contrast allergy
                </span>
              </label>
              {formData.hasContrastAllergy && (
                <div className="ml-7 mb-3">
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    Allergy Type *
                  </label>
                  <select
                    value={formData.contrastAllergyType || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        contrastAllergyType: e.target.value as any,
                      }))
                    }
                    required={formData.hasContrastAllergy}
                    className="w-full rounded-md border border-gray-300 px-3 py-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  >
                    <option value="">Select allergy type</option>
                    <option value="iodinated">Iodinated contrast</option>
                    <option value="gadolinium">Gadolinium contrast</option>
                    <option value="both">Both</option>
                    <option value="unknown">Unknown type</option>
                  </select>
                  {(formData.imagingModality.includes('contrast') ||
                    formData.imagingModality.includes('CT with contrast') ||
                    formData.imagingModality.includes('MRI with contrast')) && (
                    <div className="mt-2 rounded-lg bg-red-50 border-2 border-red-400 p-3">
                      <p className="text-base text-red-800 font-semibold">
                        🚨 CRITICAL: Patient has contrast allergy. Avoid contrast-enhanced studies. Consider non-contrast alternatives.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Renal Function */}
            <div className="mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Renal Function (for contrast decisions)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    eGFR (mL/min/1.73m²) <span className="text-sm font-normal text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    placeholder="e.g., 45"
                    value={formData.egfr || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        egfr: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-3 text-base text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px] p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.hasRenalImpairment}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        hasRenalImpairment: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-base text-gray-700">
                    Known renal impairment
                  </span>
                </label>
                {((formData.egfr !== undefined && formData.egfr < 30) ||
                  formData.hasRenalImpairment) &&
                  (formData.imagingModality.includes('contrast') ||
                    formData.imagingModality.includes('CT with contrast') ||
                    formData.imagingModality.includes('MRI with contrast')) && (
                    <div className="rounded-lg bg-yellow-50 border-2 border-yellow-400 p-3">
                      <p className="text-base text-yellow-800 font-semibold">
                        ⚠️ WARNING: eGFR {'<'} 30 or known renal impairment. Risk of contrast-induced nephropathy. Consider non-contrast alternatives or consult nephrology.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Relevant Medications */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-3">
                Relevant Medications
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px] p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.onAnticoagulation}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        onAnticoagulation: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-base text-gray-700">
                    On anticoagulation (affects procedure timing)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px] p-2 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.onMetformin}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        onMetformin: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-base text-gray-700">
                    On metformin (affects contrast timing)
                  </span>
                </label>
                {formData.onMetformin &&
                  (formData.imagingModality.includes('contrast') ||
                    formData.imagingModality.includes('CT with contrast') ||
                    formData.imagingModality.includes('MRI with contrast')) && (
                    <div className="ml-7 mt-2 rounded-lg bg-blue-50 border border-blue-300 p-3">
                      <p className="text-base text-blue-800">
                        ℹ️ Patient on metformin. Consider holding metformin 48 hours before and after contrast administration to reduce risk of lactic acidosis.
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Proposed Imaging */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Proposed Imaging Order
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Imaging Modality *
                </label>
                <select
                  value={formData.imagingModality}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      imagingModality: e.target.value as ImagingModality,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                >
                  {IMAGING_MODALITIES.map(mod => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Body Part *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., lumbar spine, head, knee"
                  value={formData.bodyPart}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, bodyPart: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-1">
                Clinical Indication *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., rule out herniated disc"
                value={formData.indication}
                onChange={e =>
                  setFormData(prev => ({ ...prev, indication: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              />
            </div>
            <div className="mt-4">
              <label className="block text-base font-medium text-gray-700 mb-1">
                Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    urgency: e.target.value as any,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>
          </div>

          {/* Prior Imaging */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[44px]">
              <input
                type="checkbox"
                checked={formData.hasPriorImaging}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    hasPriorImaging: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
              />
              <span className="text-base font-medium text-gray-700">
                Prior imaging exists
              </span>
            </label>
            {formData.hasPriorImaging && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-0 sm:pl-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Modality
                  </label>
                  <select
                    value={formData.priorImagingModality}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        priorImagingModality: e.target.value as ImagingModality,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  >
                    {IMAGING_MODALITIES.map(mod => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Body Part
                  </label>
                  <input
                    type="text"
                    placeholder="Same as above"
                    value={formData.priorImagingBodyPart}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        priorImagingBodyPart: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1">
                    Days Ago
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priorImagingDays}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        priorImagingDays: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-3 sm:py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {validationErrors.some(e => e.severity === 'error') && (
              <div className="mb-3 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Please fix the errors above before submitting.
                </p>
              </div>
            )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                disabled={validationErrors.some(e => e.severity === 'error') || isLoading}
                className="w-full min-h-[44px] transition-all duration-200"
              >
                {isLoading ? 'Analyzing...' : 'Evaluate Appropriateness'}
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

