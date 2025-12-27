// src/components/PatientInput.tsx
'use client';

import { useState } from 'react';
import { ClinicalScenario, ImagingModality, RedFlag } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

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
  });

  const [redFlags, setRedFlags] = useState<RedFlag[]>(RED_FLAGS_OPTIONS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scenario: ClinicalScenario = {
      patientId: `SYNTH-${Date.now()}`,
      age: formData.age,
      sex: formData.sex,
      chiefComplaint: formData.chiefComplaint,
      clinicalHistory: formData.clinicalHistory,
      symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      duration: formData.duration,
      redFlags: redFlags,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Scenario Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                value={formData.sex}
                onChange={e =>
                  setFormData(prev => ({ ...prev, sex: e.target.value as any }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chief Complaint *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Lower back pain"
              value={formData.chiefComplaint}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  chiefComplaint: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration of Symptoms *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., 3 days, 2 weeks, 6 months"
              value={formData.duration}
              onChange={e =>
                setFormData(prev => ({ ...prev, duration: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Red Flags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Red Flags (check all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {redFlags.map((rf, index) => (
                <label
                  key={rf.flag}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={rf.present}
                    onChange={() => toggleRedFlag(index)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{rf.flag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Proposed Imaging */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Proposed Imaging Order
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {IMAGING_MODALITIES.map(mod => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="stat">STAT</option>
              </select>
            </div>
          </div>

          {/* Prior Imaging */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.hasPriorImaging}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    hasPriorImaging: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Prior imaging exists
              </span>
            </label>
            {formData.hasPriorImaging && (
              <div className="grid grid-cols-3 gap-4 pl-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {IMAGING_MODALITIES.map(mod => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Evaluate Appropriateness
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

