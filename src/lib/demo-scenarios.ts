// src/lib/demo-scenarios.ts
// Pre-built demo scenarios for presentations
import { ClinicalScenario } from '@/types';

export const DEMO_SCENARIOS: Record<string, ClinicalScenario> = {
  // Scenario 1: Classic inappropriate imaging - uncomplicated low back pain
  'lbp-inappropriate': {
    patientId: 'DEMO-001',
    age: 45,
    sex: 'male',
    chiefComplaint: 'Lower back pain',
    clinicalHistory: 'Construction worker, no prior back issues',
    symptoms: ['pain', 'muscle spasm', 'difficulty bending'],
    duration: '3 days',
    redFlags: [
      { flag: 'History of cancer', present: false },
      { flag: 'Unexplained weight loss', present: false },
      { flag: 'Fever', present: false },
      { flag: 'Neurological deficit', present: false },
      { flag: 'Trauma', present: false },
      { flag: 'Age > 50 with new symptoms', present: false },
    ],
    proposedImaging: {
      modality: 'MRI',
      bodyPart: 'lumbar spine',
      indication: 'rule out disc herniation',
      urgency: 'routine',
    },
    priorImaging: [
      {
        modality: 'X-ray',
        bodyPart: 'lumbar spine',
        date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        daysAgo: 18,
      },
    ],
  },

  // Scenario 2: Appropriate imaging with red flags
  'lbp-with-red-flags': {
    patientId: 'DEMO-002',
    age: 62,
    sex: 'female',
    chiefComplaint: 'Lower back pain with leg weakness',
    clinicalHistory:
      'History of breast cancer 5 years ago, currently in remission',
    symptoms: [
      'back pain',
      'leg weakness',
      'numbness in left foot',
      'difficulty walking',
    ],
    duration: '2 weeks',
    redFlags: [
      { flag: 'History of cancer', present: true },
      { flag: 'Unexplained weight loss', present: false },
      { flag: 'Fever', present: false },
      { flag: 'Neurological deficit', present: true },
      { flag: 'Trauma', present: false },
      { flag: 'Age > 50 with new symptoms', present: true },
    ],
    proposedImaging: {
      modality: 'MRI with contrast',
      bodyPart: 'lumbar spine',
      indication: 'evaluate for metastatic disease vs disc herniation',
      urgency: 'urgent',
    },
  },

  // Scenario 3: Headache - inappropriate CT
  'headache-inappropriate': {
    patientId: 'DEMO-003',
    age: 35,
    sex: 'female',
    chiefComplaint: 'Chronic headaches',
    clinicalHistory:
      'Migraines since age 20, well-controlled with sumatriptan',
    symptoms: ['throbbing headache', 'photophobia', 'nausea'],
    duration: '10 years, current episode 2 days',
    redFlags: [
      { flag: 'Sudden onset severe headache', present: false },
      { flag: 'Neurological deficit', present: false },
      { flag: 'Fever', present: false },
      { flag: 'Change in headache pattern', present: false },
    ],
    proposedImaging: {
      modality: 'CT',
      bodyPart: 'head',
      indication: 'evaluate chronic headaches',
      urgency: 'routine',
    },
  },

  // Scenario 4: Thunderclap headache - appropriate urgent imaging
  'headache-thunderclap': {
    patientId: 'DEMO-004',
    age: 52,
    sex: 'male',
    chiefComplaint: 'Sudden severe headache',
    clinicalHistory: 'Hypertension, smoker',
    symptoms: [
      'worst headache of life',
      'sudden onset',
      'neck stiffness',
      'vomiting',
    ],
    duration: '2 hours',
    redFlags: [
      { flag: 'Sudden onset severe headache', present: true },
      { flag: 'Worst headache of life', present: true },
      { flag: 'Neck stiffness', present: true },
    ],
    proposedImaging: {
      modality: 'CT',
      bodyPart: 'head',
      indication: 'rule out subarachnoid hemorrhage',
      urgency: 'stat',
    },
  },

  // Scenario 5: Pediatric appendicitis - appropriate US
  'appendicitis-pediatric': {
    patientId: 'DEMO-005',
    age: 12,
    sex: 'male',
    chiefComplaint: 'Right lower quadrant abdominal pain',
    clinicalHistory: 'Previously healthy',
    symptoms: ['RLQ pain', 'nausea', 'low-grade fever', 'anorexia'],
    duration: '18 hours',
    redFlags: [{ flag: 'Fever', present: true }],
    proposedImaging: {
      modality: 'Ultrasound',
      bodyPart: 'abdomen',
      indication: 'evaluate for appendicitis',
      urgency: 'urgent',
    },
  },
};

export function getDemoScenario(
  key: string
): ClinicalScenario | undefined {
  return DEMO_SCENARIOS[key];
}

export function getAllDemoScenarios(): {
  key: string;
  title: string;
  description: string;
}[] {
  return [
    {
      key: 'lbp-inappropriate',
      title: 'Low Back Pain - Inappropriate MRI',
      description:
        '45yo male, 3 days of back pain, no red flags, MRI ordered → Should be conservative management',
    },
    {
      key: 'lbp-with-red-flags',
      title: 'Low Back Pain - Appropriate with Red Flags',
      description:
        '62yo female, back pain + neuro deficit + cancer history → MRI appropriate',
    },
    {
      key: 'headache-inappropriate',
      title: 'Chronic Headache - Inappropriate CT',
      description:
        '35yo with stable 10-year migraine history → CT not indicated',
    },
    {
      key: 'headache-thunderclap',
      title: 'Thunderclap Headache - Appropriate Urgent CT',
      description:
        '52yo with sudden severe headache → CT STAT appropriate',
    },
    {
      key: 'appendicitis-pediatric',
      title: 'Pediatric Appendicitis - Appropriate US',
      description:
        '12yo male with RLQ pain → Ultrasound first is appropriate',
    },
  ];
}

