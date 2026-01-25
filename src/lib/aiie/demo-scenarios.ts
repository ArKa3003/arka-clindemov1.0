import { AIIEInput, AIIEResult } from './scoring-engine';

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  input: AIIEInput;
  result: AIIEResult;
}

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  'lbp-inappropriate': {
    id: 'lbp-inappropriate',
    title: 'Low Back Pain - Usually Not Appropriate',
    description: '45yo male, 3 days of back pain, no red flags, MRI ordered',
    input: {
      age: 45,
      sex: 'male',
      chiefComplaint: 'Lower back pain',
      duration: '3 days',
      symptoms: ['pain', 'stiffness'],
      redFlags: {
        cancerHistory: false,
        neurologicalDeficit: false,
        fever: false,
        weightLoss: false,
        trauma: false,
        immunocompromised: false,
        ivDrugUse: false,
        osteoporosis: false,
        ageOver50: false,
        ageUnder18: false,
        progressiveSymptoms: false,
        bladderBowelDysfunction: false,
        suddenOnset: false
      },
      priorImaging: false,
      conservativeManagementTried: false,
      requestedModality: 'MRI',
      requestedProcedure: 'MRI Lumbar Spine'
    },
    result: {
      score: 2,
      category: 'inappropriate',
      confidence: 'high',
      baselineScore: 5.0,
      finalScore: 2,
      factors: [
        {
          name: 'Symptom Duration',
          value: '3 days',
          contribution: -2.0,
          direction: 'opposes',
          explanation: 'Acute low back pain (<6 weeks) typically resolves with conservative management. Early imaging does not improve outcomes.',
          evidenceCitation: 'Chou R, et al. Ann Intern Med. 2007;147(7):478-491'
        },
        {
          name: 'Conservative Management',
          value: 'Not attempted',
          contribution: -1.5,
          direction: 'opposes',
          explanation: 'Guidelines recommend 4-6 weeks of conservative management before imaging for uncomplicated low back pain.',
          evidenceCitation: 'Qaseem A, et al. Ann Intern Med. 2017;166(7):514-530'
        },
        {
          name: 'Red Flag Symptoms',
          value: 'None identified',
          contribution: -1.0,
          direction: 'opposes',
          explanation: 'Absence of red flags indicates low probability of serious underlying pathology.',
          evidenceCitation: 'Downie A, et al. CMAJ. 2013;185(18):E869-E876'
        },
        {
          name: 'Age',
          value: '45 years',
          contribution: 0,
          direction: 'neutral',
          explanation: 'Age under 50 without other risk factors.',
          evidenceCitation: 'Jarvik JG, Deyo RA. Ann Intern Med. 2002;137(7):586-597'
        }
      ],
      recommendation: 'Imaging is usually not appropriate at this time. Recommend 4-6 weeks of conservative management including NSAIDs, physical therapy, and activity modification.',
      alternatives: [
        {
          procedure: 'Conservative management (4-6 weeks)',
          score: 9,
          rationale: 'First-line treatment per clinical guidelines. 90% of acute LBP resolves within 6 weeks.',
          radiation: 'None',
          costComparison: 'Lowest cost'
        },
        {
          procedure: 'X-ray Lumbar Spine',
          score: 3,
          rationale: 'Lower radiation if imaging desired, but still not recommended without red flags.',
          radiation: 'Low (1.5 mSv)',
          costComparison: 'Lower cost'
        }
      ],
      evidenceSources: [
        {
          title: 'Noninvasive Treatments for Low Back Pain',
          citation: 'Qaseem A, et al. Ann Intern Med. 2017;166(7):514-530',
          type: 'guideline',
          year: 2017
        },
        {
          title: 'Red flags for vertebral fracture screening',
          citation: 'Downie A, et al. CMAJ. 2013;185(18):E869-E876',
          type: 'systematic-review',
          year: 2013
        }
      ]
    }
  },

  'lbp-red-flags': {
    id: 'lbp-red-flags',
    title: 'Low Back Pain - Usually Appropriate',
    description: '62yo female, back pain + neuro deficit + cancer history',
    input: {
      age: 62,
      sex: 'female',
      chiefComplaint: 'Lower back pain with leg weakness',
      duration: '2 weeks',
      symptoms: ['pain', 'weakness', 'numbness'],
      redFlags: {
        cancerHistory: true,
        neurologicalDeficit: true,
        fever: false,
        weightLoss: false,
        trauma: false,
        immunocompromised: false,
        ivDrugUse: false,
        osteoporosis: false,
        ageOver50: true,
        ageUnder18: false,
        progressiveSymptoms: true,
        bladderBowelDysfunction: false,
        suddenOnset: false
      },
      priorImaging: false,
      conservativeManagementTried: false,
      requestedModality: 'MRI',
      requestedProcedure: 'MRI Lumbar Spine with contrast'
    },
    result: {
      score: 9,
      category: 'appropriate',
      confidence: 'high',
      baselineScore: 5.0,
      finalScore: 9,
      factors: [
        {
          name: 'History of Cancer',
          value: 'Present',
          contribution: 3.0,
          direction: 'supports',
          explanation: 'History of cancer significantly increases pre-test probability of spinal metastases. Imaging appropriate to evaluate.',
          evidenceCitation: 'Deyo RA, Diehl AK. JAMA. 1988;259(8):1057-1062'
        },
        {
          name: 'Neurological Deficit',
          value: 'Leg weakness present',
          contribution: 2.5,
          direction: 'supports',
          explanation: 'New neurological symptoms require imaging to evaluate for cord compression or nerve root involvement.',
          evidenceCitation: 'Chou R, et al. Ann Intern Med. 2007;147(7):478-491'
        },
        {
          name: 'Age > 50',
          value: '62 years',
          contribution: 1.0,
          direction: 'supports',
          explanation: 'Age over 50 increases probability of vertebral fracture, malignancy, or other serious pathology.',
          evidenceCitation: 'Jarvik JG, Deyo RA. Ann Intern Med. 2002;137(7):586-597'
        },
        {
          name: 'Progressive Symptoms',
          value: 'Yes',
          contribution: 0.5,
          direction: 'supports',
          explanation: 'Progressive neurological symptoms warrant urgent evaluation.',
          evidenceCitation: 'ACP Clinical Guidelines 2017'
        }
      ],
      recommendation: 'Imaging is usually appropriate. MRI with contrast recommended to evaluate for metastatic disease and nerve root compression.',
      alternatives: [
        {
          procedure: 'MRI Lumbar Spine without contrast',
          score: 8,
          rationale: 'Adequate for evaluating disc pathology and cord compression. Contrast adds value for tumor evaluation.',
          radiation: 'None',
          costComparison: 'Slightly lower cost'
        },
        {
          procedure: 'CT Lumbar Spine',
          score: 7,
          rationale: 'Alternative if MRI contraindicated. Better for bony detail but less soft tissue resolution.',
          radiation: 'Medium (6 mSv)',
          costComparison: 'Similar cost'
        }
      ],
      evidenceSources: [
        {
          title: 'Cancer as a cause of back pain',
          citation: 'Deyo RA, Diehl AK. JAMA. 1988;259(8):1057-1062',
          type: 'peer-reviewed',
          year: 1988
        },
        {
          title: 'Imaging strategies for low back pain',
          citation: 'Chou R, et al. Lancet. 2009;373(9662):463-472',
          type: 'systematic-review',
          year: 2009
        }
      ]
    }
  },

  'headache-inappropriate': {
    id: 'headache-inappropriate',
    title: 'Chronic Headache - Usually Not Appropriate',
    description: '35yo with stable 10-year migraine history',
    input: {
      age: 35,
      sex: 'female',
      chiefComplaint: 'Chronic headache',
      duration: '10 years',
      symptoms: ['throbbing pain', 'photophobia', 'nausea'],
      redFlags: {
        cancerHistory: false,
        neurologicalDeficit: false,
        fever: false,
        weightLoss: false,
        trauma: false,
        immunocompromised: false,
        ivDrugUse: false,
        osteoporosis: false,
        ageOver50: false,
        ageUnder18: false,
        progressiveSymptoms: false,
        bladderBowelDysfunction: false,
        suddenOnset: false
      },
      priorImaging: true,
      priorImagingTimeframe: '5 years ago, normal',
      conservativeManagementTried: true,
      requestedModality: 'CT',
      requestedProcedure: 'CT Head'
    },
    result: {
      score: 2,
      category: 'inappropriate',
      confidence: 'high',
      baselineScore: 5.0,
      finalScore: 2,
      factors: [
        {
          name: 'Chronic Stable Pattern',
          value: '10 years, unchanged',
          contribution: -2.5,
          direction: 'opposes',
          explanation: 'Chronic, stable headache pattern without new features has very low yield (<1%) for imaging.',
          evidenceCitation: 'AAN Practice Guideline. Neurology. 2000;55(6):754-762'
        },
        {
          name: 'Prior Normal Imaging',
          value: 'Normal CT 5 years ago',
          contribution: -1.0,
          direction: 'opposes',
          explanation: 'Prior normal imaging further reduces probability of structural pathology.',
          evidenceCitation: 'Evans RW. Neurol Clin. 2009;27(2):393-415'
        },
        {
          name: 'Classic Migraine Features',
          value: 'Throbbing, photophobia, nausea',
          contribution: -0.5,
          direction: 'opposes',
          explanation: 'Presentation consistent with primary headache disorder (migraine).',
          evidenceCitation: 'IHS Classification ICHD-3'
        }
      ],
      recommendation: 'Imaging is usually not appropriate. This presentation is consistent with chronic migraine without concerning features.',
      alternatives: [
        {
          procedure: 'Clinical management',
          score: 9,
          rationale: 'Focus on migraine prevention and acute treatment optimization.',
          radiation: 'None',
          costComparison: 'Lowest cost'
        },
        {
          procedure: 'Neurology referral',
          score: 8,
          rationale: 'If symptoms are not well-controlled, specialist evaluation may be more appropriate than imaging.',
          radiation: 'None',
          costComparison: 'Lower cost than imaging'
        }
      ],
      evidenceSources: [
        {
          title: 'Evidence-based guidelines for neuroimaging',
          citation: 'American Academy of Neurology. Neurology. 2000;55:754-762',
          type: 'guideline',
          year: 2000
        }
      ]
    }
  },

  'headache-appropriate': {
    id: 'headache-appropriate',
    title: 'Thunderclap Headache - Usually Appropriate',
    description: '52yo with sudden severe headache',
    input: {
      age: 52,
      sex: 'male',
      chiefComplaint: 'Sudden severe headache',
      duration: '2 hours',
      symptoms: ['worst headache of life', 'sudden onset', 'neck stiffness'],
      redFlags: {
        cancerHistory: false,
        neurologicalDeficit: false,
        fever: false,
        weightLoss: false,
        trauma: false,
        immunocompromised: false,
        ivDrugUse: false,
        osteoporosis: false,
        ageOver50: true,
        ageUnder18: false,
        progressiveSymptoms: false,
        bladderBowelDysfunction: false,
        suddenOnset: true
      },
      priorImaging: false,
      conservativeManagementTried: false,
      requestedModality: 'CT',
      requestedProcedure: 'CT Head without contrast'
    },
    result: {
      score: 9,
      category: 'appropriate',
      confidence: 'high',
      baselineScore: 5.0,
      finalScore: 9,
      factors: [
        {
          name: 'Onset Pattern',
          value: 'Thunderclap - sudden onset',
          contribution: 4.0,
          direction: 'supports',
          explanation: 'Sudden severe headache ("worst headache of life") requires urgent imaging to rule out subarachnoid hemorrhage.',
          evidenceCitation: 'Perry JJ, et al. BMJ. 2011;343:d4277'
        },
        {
          name: 'Age > 50',
          value: '52 years',
          contribution: 1.5,
          direction: 'supports',
          explanation: 'Age over 50 increases probability of aneurysmal SAH and other vascular pathology.',
          evidenceCitation: 'Goldstein JN, et al. Headache. 2008;48(7):1026-1032'
        },
        {
          name: 'Neck Stiffness',
          value: 'Present',
          contribution: 1.0,
          direction: 'supports',
          explanation: 'Meningismus suggests possible subarachnoid blood or meningitis.',
          evidenceCitation: 'Edlow JA, Caplan LR. Stroke. 2000;31(6):1386-1393'
        }
      ],
      recommendation: 'Imaging is URGENTLY appropriate. CT Head should be performed immediately to evaluate for subarachnoid hemorrhage. If CT is negative, lumbar puncture should be considered.',
      alternatives: [
        {
          procedure: 'CT Angiography Head',
          score: 9,
          rationale: 'May be added to non-contrast CT to evaluate for aneurysm if SAH suspected.',
          radiation: 'Medium (2-4 mSv)',
          costComparison: 'Higher cost'
        },
        {
          procedure: 'MRI Brain',
          score: 7,
          rationale: 'Alternative if CT unavailable, but CT preferred for acute SAH detection.',
          radiation: 'None',
          costComparison: 'Higher cost, longer exam time'
        }
      ],
      evidenceSources: [
        {
          title: 'Ottawa SAH Rule',
          citation: 'Perry JJ, et al. BMJ. 2011;343:d4277',
          type: 'peer-reviewed',
          year: 2011
        },
        {
          title: 'How to diagnose SAH',
          citation: 'Edlow JA, Caplan LR. Stroke. 2000;31(6):1386-1393',
          type: 'peer-reviewed',
          year: 2000
        }
      ]
    }
  }
};
