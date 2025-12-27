// src/lib/acr-criteria.ts
// This contains the ACR Appropriateness Criteria
// Source: American College of Radiology (acr.org)
import { ACRCriteria } from '@/types';

/**
 * ACR Appropriateness Criteria Database
 * 
 * IMPORTANT: This is a simplified subset for demo purposes.
 * In production, you would have the complete ACR database.
 * 
 * Rating Scale:
 * 1-3: Usually NOT appropriate
 * 4-6: May be appropriate
 * 7-9: Usually appropriate
 * 
 * RRL (Relative Radiation Level):
 * O = None
 * ☢ = Minimal (<0.1 mSv)
 * ☢☢ = Low (0.1-1 mSv)
 * ☢☢☢ = Medium (1-10 mSv)
 * ☢☢☢☢ = High (10-30 mSv)
 * ☢☢☢☢☢ = Very High (>30 mSv)
 */
export const ACR_CRITERIA_DATABASE: ACRCriteria[] = [
  // ===================
  // LOW BACK PAIN
  // ===================
  {
    id: 'lbp-uncomplicated-xray',
    topic: 'Low Back Pain',
    variant: 'Uncomplicated low back pain, no red flags, < 6 weeks duration',
    procedure: 'X-ray lumbar spine',
    rating: 2,
    rrl: '☢☢',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-uncomplicated-ct',
    topic: 'Low Back Pain',
    variant: 'Uncomplicated low back pain, no red flags, < 6 weeks duration',
    procedure: 'CT lumbar spine without contrast',
    rating: 2,
    rrl: '☢☢☢',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-uncomplicated-mri',
    topic: 'Low Back Pain',
    variant: 'Uncomplicated low back pain, no red flags, < 6 weeks duration',
    procedure: 'MRI lumbar spine without contrast',
    rating: 2,
    rrl: 'O',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-uncomplicated-none',
    topic: 'Low Back Pain',
    variant: 'Uncomplicated low back pain, no red flags, < 6 weeks duration',
    procedure: 'No imaging (conservative management)',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-neuro-deficit-mri',
    topic: 'Low Back Pain',
    variant: 'Low back pain with new neurological deficit',
    procedure: 'MRI lumbar spine without contrast',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-neuro-deficit-ct',
    topic: 'Low Back Pain',
    variant: 'Low back pain with new neurological deficit',
    procedure: 'CT lumbar spine without contrast',
    rating: 7,
    rrl: '☢☢☢',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'lbp-cancer-history-mri',
    topic: 'Low Back Pain',
    variant: 'Low back pain with history of cancer',
    procedure: 'MRI lumbar spine with and without contrast',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Low Back Pain (2021)',
    lastReviewed: '2021'
  },
  // ===================
  // HEADACHE
  // ===================
  {
    id: 'headache-chronic-no-flags-none',
    topic: 'Headache',
    variant: 'Chronic headache, no red flags, stable pattern',
    procedure: 'No imaging',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'headache-chronic-no-flags-ct',
    topic: 'Headache',
    variant: 'Chronic headache, no red flags, stable pattern',
    procedure: 'CT head without contrast',
    rating: 3,
    rrl: '☢☢☢',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'headache-chronic-no-flags-mri',
    topic: 'Headache',
    variant: 'Chronic headache, no red flags, stable pattern',
    procedure: 'MRI head without contrast',
    rating: 4,
    rrl: 'O',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'headache-thunderclap-cta',
    topic: 'Headache',
    variant: 'Sudden severe headache (thunderclap), worst headache of life',
    procedure: 'CT head without contrast AND CTA head',
    rating: 9,
    rrl: '☢☢☢☢',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'headache-thunderclap-ct',
    topic: 'Headache',
    variant: 'Sudden severe headache (thunderclap), worst headache of life',
    procedure: 'CT head without contrast',
    rating: 9,
    rrl: '☢☢☢',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'headache-new-neuro-mri',
    topic: 'Headache',
    variant: 'New headache with neurological symptoms',
    procedure: 'MRI head with and without contrast',
    rating: 8,
    rrl: 'O',
    source: 'ACR AC: Headache (2019)',
    lastReviewed: '2019'
  },
  // ===================
  // CHEST PAIN - PULMONARY EMBOLISM
  // ===================
  {
    id: 'pe-high-prob-cta',
    topic: 'Suspected Pulmonary Embolism',
    variant: 'High clinical probability (Wells >6)',
    procedure: 'CT pulmonary angiography (CTPA)',
    rating: 9,
    rrl: '☢☢☢',
    source: 'ACR AC: Acute Chest Pain - Suspected PE (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'pe-low-prob-ddimer',
    topic: 'Suspected Pulmonary Embolism',
    variant: 'Low clinical probability (Wells ≤4)',
    procedure: 'D-dimer first, imaging only if positive',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Acute Chest Pain - Suspected PE (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'pe-low-prob-cta-first',
    topic: 'Suspected Pulmonary Embolism',
    variant: 'Low clinical probability (Wells ≤4)',
    procedure: 'CT pulmonary angiography without D-dimer',
    rating: 4,
    rrl: '☢☢☢',
    source: 'ACR AC: Acute Chest Pain - Suspected PE (2021)',
    lastReviewed: '2021'
  },
  {
    id: 'pe-pregnancy-us',
    topic: 'Suspected Pulmonary Embolism',
    variant: 'Pregnancy, suspected PE',
    procedure: 'Lower extremity Doppler US first',
    rating: 8,
    rrl: 'O',
    source: 'ACR AC: Acute Chest Pain - Suspected PE (2021)',
    lastReviewed: '2021'
  },
  // ===================
  // ABDOMINAL PAIN - RIGHT LOWER QUADRANT
  // ===================
  {
    id: 'rlq-adult-ct',
    topic: 'Right Lower Quadrant Pain - Suspected Appendicitis',
    variant: 'Adult with classic presentation',
    procedure: 'CT abdomen and pelvis with contrast',
    rating: 9,
    rrl: '☢☢☢',
    source: 'ACR AC: Right Lower Quadrant Pain (2022)',
    lastReviewed: '2022'
  },
  {
    id: 'rlq-adult-us',
    topic: 'Right Lower Quadrant Pain - Suspected Appendicitis',
    variant: 'Adult with classic presentation',
    procedure: 'US abdomen (graded compression)',
    rating: 6,
    rrl: 'O',
    source: 'ACR AC: Right Lower Quadrant Pain (2022)',
    lastReviewed: '2022'
  },
  {
    id: 'rlq-child-us',
    topic: 'Right Lower Quadrant Pain - Suspected Appendicitis',
    variant: 'Pediatric patient',
    procedure: 'US abdomen (graded compression)',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Right Lower Quadrant Pain (2022)',
    lastReviewed: '2022'
  },
  {
    id: 'rlq-child-ct',
    topic: 'Right Lower Quadrant Pain - Suspected Appendicitis',
    variant: 'Pediatric patient',
    procedure: 'CT abdomen and pelvis',
    rating: 6,
    rrl: '☢☢☢',
    source: 'ACR AC: Right Lower Quadrant Pain (2022)',
    lastReviewed: '2022'
  },
  {
    id: 'rlq-pregnant-mri',
    topic: 'Right Lower Quadrant Pain - Suspected Appendicitis',
    variant: 'Pregnant patient, US inconclusive',
    procedure: 'MRI abdomen without contrast',
    rating: 8,
    rrl: 'O',
    source: 'ACR AC: Right Lower Quadrant Pain (2022)',
    lastReviewed: '2022'
  },
  // ===================
  // KNEE INJURY
  // ===================
  {
    id: 'knee-trauma-ottawa-neg',
    topic: 'Acute Knee Injury',
    variant: 'Trauma, Ottawa Knee Rules negative',
    procedure: 'No imaging',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Acute Trauma to the Knee (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'knee-trauma-ottawa-pos-xray',
    topic: 'Acute Knee Injury',
    variant: 'Trauma, Ottawa Knee Rules positive',
    procedure: 'X-ray knee',
    rating: 9,
    rrl: '☢',
    source: 'ACR AC: Acute Trauma to the Knee (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'knee-trauma-soft-tissue-mri',
    topic: 'Acute Knee Injury',
    variant: 'Suspected internal derangement (ligament/meniscus)',
    procedure: 'MRI knee without contrast',
    rating: 9,
    rrl: 'O',
    source: 'ACR AC: Acute Trauma to the Knee (2019)',
    lastReviewed: '2019'
  },
  {
    id: 'knee-chronic-pain-xray',
    topic: 'Chronic Knee Pain',
    variant: 'Chronic pain, osteoarthritis suspected',
    procedure: 'X-ray knee (weight-bearing)',
    rating: 9,
    rrl: '☢',
    source: 'ACR AC: Chronic Knee Pain (2018)',
    lastReviewed: '2018'
  },
  {
    id: 'knee-chronic-pain-mri-first',
    topic: 'Chronic Knee Pain',
    variant: 'Chronic pain, no prior imaging',
    procedure: 'MRI knee without contrast',
    rating: 4,
    rrl: 'O',
    source: 'ACR AC: Chronic Knee Pain (2018)',
    lastReviewed: '2018'
  },
];

/**
 * Get criteria by topic
 */
export function getCriteriaByTopic(topic: string): ACRCriteria[] {
  return ACR_CRITERIA_DATABASE.filter(c =>
    c.topic.toLowerCase().includes(topic.toLowerCase())
  );
}

/**
 * Get criteria by procedure
 */
export function getCriteriaByProcedure(procedure: string): ACRCriteria[] {
  return ACR_CRITERIA_DATABASE.filter(c =>
    c.procedure.toLowerCase().includes(procedure.toLowerCase())
  );
}

/**
 * Find best matching criteria for a clinical scenario
 */
export function findMatchingCriteria(
  topic: string,
  variant: string,
  procedure: string
): ACRCriteria | null {
  // First, try exact match
  const exactMatch = ACR_CRITERIA_DATABASE.find(c =>
    c.topic.toLowerCase() === topic.toLowerCase() &&
    c.procedure.toLowerCase().includes(procedure.toLowerCase())
  );
  if (exactMatch) return exactMatch;

  // Then try partial match on topic
  const topicMatches = getCriteriaByTopic(topic);
  if (topicMatches.length > 0) {
    // Find the one closest to the procedure
    const procedureMatch = topicMatches.find(c =>
      c.procedure.toLowerCase().includes(procedure.toLowerCase())
    );
    return procedureMatch || topicMatches[0];
  }
  return null;
}

/**
 * Get all alternatives for a given topic/variant
 */
export function getAlternatives(topic: string): ACRCriteria[] {
  return ACR_CRITERIA_DATABASE
    .filter(c => c.topic.toLowerCase().includes(topic.toLowerCase()))
    .sort((a, b) => b.rating - a.rating);
}

