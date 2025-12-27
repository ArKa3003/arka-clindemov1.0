// src/lib/evaluate-imaging.ts
// The core evaluation engine - matches clinical scenarios to ACR criteria
// Supports both standalone demo use and Epic CDS Hooks integration

import {
  ClinicalScenario,
  EvaluationResult,
  AppropriatenessScore,
  Alternative,
  Warning,
  EvidenceLink,
  ImagingModality,
  CDSHooksRequest,
  CDSHooksResponse,
  CDSHooksCard,
} from '@/types';
import {
  ACR_CRITERIA_DATABASE,
  findMatchingCriteria,
  getAlternatives,
} from './acr-criteria';

// ============================================================================
// DEMO PATH: Standalone Evaluation
// ============================================================================
// This is the main evaluation function for standalone use
// Used when the application is running independently (not integrated with Epic)

/**
 * Main evaluation function
 * This is the heart of ARKA
 * 
 * Takes a clinical scenario and returns a comprehensive evaluation result
 * including appropriateness score, reasoning, alternatives, and warnings.
 */
export function evaluateImaging(scenario: ClinicalScenario): EvaluationResult {
  // Step 1: Identify the clinical topic
  const topic = identifyTopic(scenario);

  // Step 2: Check for red flags
  const hasRedFlags = scenario.redFlags.some(rf => rf.present);

  // Step 3: Find matching ACR criteria
  const variant = determineVariant(scenario, hasRedFlags);
  const matchedCriteria = findMatchingCriteria(
    topic,
    variant,
    scenario.proposedImaging.modality
  );

  // Step 4: Calculate appropriateness score
  const appropriatenessScore = calculateScore(matchedCriteria, scenario);

  // Step 5: Determine traffic light
  const trafficLight = scoreToTrafficLight(appropriatenessScore.value);

  // Step 6: Generate reasoning
  const reasoning = generateReasoning(scenario, matchedCriteria, appropriatenessScore);

  // Step 7: Get alternatives
  const alternatives = generateAlternatives(topic, scenario, appropriatenessScore);

  // Step 8: Generate warnings
  const warnings = generateWarnings(scenario);

  // Step 9: Get evidence links
  const evidenceLinks = getEvidenceLinks(topic, matchedCriteria);

  return {
    appropriatenessScore,
    trafficLight,
    matchedCriteria: matchedCriteria || {
      id: 'no-match',
      topic,
      variant,
      procedure: scenario.proposedImaging.modality,
      rating: 5, // Default to "may be appropriate" if no match
      rrl: 'Unknown',
      source: 'No matching ACR criteria found',
      lastReviewed: 'N/A',
    },
    reasoning,
    alternatives,
    warnings,
    evidenceLinks,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Identify the clinical topic from the scenario
 */
function identifyTopic(scenario: ClinicalScenario): string {
  const complaint = scenario.chiefComplaint.toLowerCase();
  const bodyPart = scenario.proposedImaging.bodyPart.toLowerCase();

  // Map common complaints to ACR topics
  const topicMap: Record<string, string> = {
    'back pain': 'Low Back Pain',
    'lower back': 'Low Back Pain',
    'lumbar': 'Low Back Pain',
    'headache': 'Headache',
    'head pain': 'Headache',
    'migraine': 'Headache',
    'chest pain': 'Chest Pain',
    'shortness of breath': 'Suspected Pulmonary Embolism',
    'dyspnea': 'Suspected Pulmonary Embolism',
    'abdominal pain': 'Abdominal Pain',
    'stomach pain': 'Abdominal Pain',
    'right lower quadrant': 'Right Lower Quadrant Pain - Suspected Appendicitis',
    'appendicitis': 'Right Lower Quadrant Pain - Suspected Appendicitis',
    'knee pain': 'Acute Knee Injury',
    'knee injury': 'Acute Knee Injury',
    'knee trauma': 'Acute Knee Injury',
  };

  // Check for matches
  for (const [key, value] of Object.entries(topicMap)) {
    if (complaint.includes(key) || bodyPart.includes(key)) {
      return value;
    }
  }

  // Default fallback
  return scenario.chiefComplaint;
}

/**
 * Determine the clinical variant based on presentation
 */
function determineVariant(scenario: ClinicalScenario, hasRedFlags: boolean): string {
  const variants: string[] = [];

  // Check duration
  const durationWeeks = parseDuration(scenario.duration);
  if (durationWeeks < 6) {
    variants.push('acute');
  } else {
    variants.push('chronic');
  }

  // Check red flags
  if (hasRedFlags) {
    variants.push('with red flags');
  } else {
    variants.push('no red flags');
  }

  // Check age-specific variants
  if (scenario.age < 18) {
    variants.push('pediatric');
  }

  // Check for pregnancy (would be in symptoms or history)
  if (
    scenario.symptoms.some(s => s.toLowerCase().includes('pregnant')) ||
    scenario.clinicalHistory.toLowerCase().includes('pregnant')
  ) {
    variants.push('pregnancy');
  }

  return variants.join(', ');
}

/**
 * Parse duration string to weeks
 */
function parseDuration(duration: string): number {
  const lower = duration.toLowerCase();

  // Extract number
  const numMatch = lower.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 1;

  // Determine unit
  if (lower.includes('day')) return num / 7;
  if (lower.includes('week')) return num;
  if (lower.includes('month')) return num * 4;
  if (lower.includes('year')) return num * 52;

  return num; // Default to weeks
}

/**
 * Calculate appropriateness score
 */
function calculateScore(
  criteria: ReturnType<typeof findMatchingCriteria>,
  scenario: ClinicalScenario
): AppropriatenessScore {
  let score: number;

  if (criteria) {
    score = criteria.rating;

    // Adjust for prior imaging (reduce score if recent imaging exists)
    if (scenario.priorImaging && scenario.priorImaging.length > 0) {
      const recentImaging = scenario.priorImaging.find(p => p.daysAgo < 30);
      if (recentImaging) {
        score = Math.max(1, score - 2); // Reduce by 2, minimum 1
      }
    }

    // Adjust for red flags (increase score if red flags present)
    const hasRedFlags = scenario.redFlags.some(rf => rf.present);
    if (hasRedFlags && score < 7) {
      score = Math.min(9, score + 2); // Increase by 2, maximum 9
    }
  } else {
    // No matching criteria - default to middle
    score = 5;
  }

  // Determine category
  let category: AppropriatenessScore['category'];
  let description: string;

  if (score <= 3) {
    category = 'usually-not-appropriate';
    description =
      'Usually NOT Appropriate - The imaging is unlikely to improve patient outcomes.';
  } else if (score <= 6) {
    category = 'may-be-appropriate';
    description =
      'May Be Appropriate - Clinical judgment and patient-specific factors should guide the decision.';
  } else {
    category = 'usually-appropriate';
    description =
      'Usually Appropriate - The imaging is supported by evidence and likely to improve patient outcomes.';
  }

  return { value: score, category, description };
}

/**
 * Convert score to traffic light
 */
function scoreToTrafficLight(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 7) return 'green';
  if (score >= 4) return 'yellow';
  return 'red';
}

/**
 * Generate human-readable reasoning
 * THIS IS CRITICAL FOR NON-DEVICE CDS COMPLIANCE
 */
function generateReasoning(
  scenario: ClinicalScenario,
  criteria: ReturnType<typeof findMatchingCriteria>,
  score: AppropriatenessScore
): string[] {
  const reasons: string[] = [];

  // Explain the clinical presentation
  reasons.push(
    `Patient presents with ${scenario.chiefComplaint} for ${scenario.duration}.`
  );

  // Explain red flag status
  const redFlagsPresent = scenario.redFlags.filter(rf => rf.present);
  if (redFlagsPresent.length > 0) {
    reasons.push(
      `Red flags identified: ${redFlagsPresent.map(rf => rf.flag).join(', ')}.`
    );
  } else if (scenario.redFlags.length > 0) {
    reasons.push('No red flags identified based on clinical presentation.');
  }

  // Explain the ACR criteria match
  if (criteria) {
    reasons.push(
      `Matched to ACR Appropriateness Criteria: "${criteria.topic}" - "${criteria.variant}".`
    );
    reasons.push(`ACR rating for ${criteria.procedure}: ${criteria.rating}/9.`);
  } else {
    reasons.push(
      'No exact match found in ACR Appropriateness Criteria database. Score based on clinical principles.'
    );
  }

  // Explain prior imaging impact
  if (scenario.priorImaging && scenario.priorImaging.length > 0) {
    const recent = scenario.priorImaging.find(p => p.daysAgo < 30);
    if (recent) {
      reasons.push(
        `Recent ${recent.modality} of ${recent.bodyPart} performed ${recent.daysAgo} days ago may reduce need for additional imaging.`
      );
    }
  }

  // Final recommendation explanation
  reasons.push(score.description);

  return reasons;
}

/**
 * Generate alternative recommendations
 */
function generateAlternatives(
  topic: string,
  scenario: ClinicalScenario,
  currentScore: AppropriatenessScore
): Alternative[] {
  const allCriteria = getAlternatives(topic);

  return allCriteria
    .filter(
      c =>
        c.procedure.toLowerCase() !==
        scenario.proposedImaging.modality.toLowerCase()
    )
    .slice(0, 4) // Top 4 alternatives
    .map(c => ({
      procedure: c.procedure,
      rating: c.rating,
      reasoning: `ACR rates this ${c.rating}/9 for ${c.variant}`,
      costComparison: compareCost(c.procedure, scenario.proposedImaging.modality),
      radiationComparison: compareRadiation(c.rrl, scenario.proposedImaging.modality),
    }));
}

/**
 * Compare cost between procedures (simplified)
 */
function compareCost(alt: string, original: string): 'lower' | 'similar' | 'higher' {
  const costTier: Record<string, number> = {
    'no imaging': 0,
    'x-ray': 1,
    'ultrasound': 1,
    'ct': 2,
    'mri': 3,
    'pet': 4,
  };

  const getCostTier = (proc: string): number => {
    const lower = proc.toLowerCase();
    for (const [key, tier] of Object.entries(costTier)) {
      if (lower.includes(key)) return tier;
    }
    return 2;
  };

  const altTier = getCostTier(alt);
  const origTier = getCostTier(original);

  if (altTier < origTier) return 'lower';
  if (altTier > origTier) return 'higher';
  return 'similar';
}

/**
 * Compare radiation between procedures
 */
function compareRadiation(
  altRrl: string,
  original: string
): 'lower' | 'similar' | 'higher' | 'none' {
  if (altRrl === 'O') return 'none';

  const radiationTier: Record<string, number> = {
    O: 0,
    '☢': 1,
    '☢☢': 2,
    '☢☢☢': 3,
    '☢☢☢☢': 4,
    '☢☢☢☢☢': 5,
  };

  // Estimate original radiation
  const origLower = original.toLowerCase();
  let origTier = 2;

  if (
    origLower.includes('mri') ||
    origLower.includes('us') ||
    origLower.includes('ultrasound')
  ) {
    origTier = 0;
  } else if (origLower.includes('x-ray')) {
    origTier = 1;
  } else if (origLower.includes('ct')) {
    origTier = 3;
  } else if (origLower.includes('pet')) {
    origTier = 4;
  }

  const altTier = radiationTier[altRrl] || 2;

  if (altTier < origTier) return 'lower';
  if (altTier > origTier) return 'higher';
  return 'similar';
}

/**
 * Generate warnings
 */
function generateWarnings(scenario: ClinicalScenario): Warning[] {
  const warnings: Warning[] = [];

  // Check for recent prior imaging
  if (scenario.priorImaging) {
    const veryRecent = scenario.priorImaging.find(p => p.daysAgo < 14);
    const recent = scenario.priorImaging.find(
      p => p.daysAgo < 30 && p.daysAgo >= 14
    );

    if (veryRecent) {
      warnings.push({
        type: 'prior-imaging',
        message: `${veryRecent.modality} of ${veryRecent.bodyPart} performed ${veryRecent.daysAgo} days ago. Consider reviewing prior study before ordering new imaging.`,
        severity: 'warning',
      });
    } else if (recent) {
      warnings.push({
        type: 'prior-imaging',
        message: `${recent.modality} of ${recent.bodyPart} performed ${recent.daysAgo} days ago is available for review.`,
        severity: 'info',
      });
    }
  }

  // Check for critical red flags
  const criticalRedFlags = scenario.redFlags.filter(
    rf =>
      rf.present &&
      (rf.flag.toLowerCase().includes('cancer') ||
        rf.flag.toLowerCase().includes('neuro') ||
        rf.flag.toLowerCase().includes('trauma') ||
        rf.flag.toLowerCase().includes('fever'))
  );

  if (criticalRedFlags.length > 0) {
    warnings.push({
      type: 'red-flag',
      message: `Critical red flags present: ${criticalRedFlags.map(rf => rf.flag).join(', ')}. Urgent evaluation recommended.`,
      severity: 'critical',
    });
  }

  return warnings;
}

/**
 * Get evidence links for the topic
 */
function getEvidenceLinks(
  topic: string,
  criteria: ReturnType<typeof findMatchingCriteria>
): EvidenceLink[] {
  const links: EvidenceLink[] = [];

  // ACR Appropriateness Criteria link
  const topicSlug = topic
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  links.push({
    title: `ACR Appropriateness Criteria: ${topic}`,
    url: `https://acsearch.acr.org/list?q=${encodeURIComponent(topic)}`,
    type: 'acr-guideline',
  });

  // If we have matched criteria, add source
  if (criteria) {
    links.push({
      title: criteria.source,
      url: 'https://www.acr.org/Clinical-Resources/ACR-Appropriateness-Criteria',
      type: 'acr-guideline',
    });
  }

  return links;
}

// ============================================================================
// EPIC CDS HOOKS PATH: Integration with Epic
// ============================================================================
// These functions enable Epic CDS Hooks integration
// Epic calls our service when physicians place imaging orders, and we return
// CDS Hooks cards that display inline in Epic's ordering interface

/**
 * Extract clinical scenario from CDS Hooks request
 * 
 * This function parses Epic's CDS Hooks request format and converts it
 * to our internal ClinicalScenario format for evaluation.
 * 
 * In production, this would:
 * - Fetch patient demographics from Epic's FHIR server
 * - Parse order details from draftOrders
 * - Extract clinical context from Epic's clinical data
 * 
 * For demo purposes, we create a simplified scenario from available data.
 */
export function extractScenarioFromCDSHooks(
  request: CDSHooksRequest
): ClinicalScenario {
  // Extract patient ID from FHIR reference
  const patientId = request.context.patientId.replace('Patient/', '');

  // Parse draft orders to extract imaging information
  // In production, Epic's draftOrders structure would be more detailed
  const draftOrder = request.context.draftOrders?.[0] || {};

  // Extract imaging details from order
  // Note: In production, you'd parse Epic's order structure more carefully
  const modality = (draftOrder.modality || 'CT') as ImagingModality;
  const bodyPart = draftOrder.bodyPart || 'Unknown';
  const indication = draftOrder.indication || draftOrder.reason || 'Not specified';
  const urgency = draftOrder.urgency || 'routine';

  // For demo, we create a basic scenario
  // In production, you would:
  // - Fetch patient age/sex from FHIR Patient resource
  // - Fetch chief complaint from FHIR Encounter
  // - Fetch clinical history from FHIR Condition resources
  // - Check for prior imaging from FHIR ImagingStudy resources

  return {
    patientId,
    age: draftOrder.patientAge || 50, // Would come from FHIR in production
    sex: (draftOrder.patientSex || 'other') as 'male' | 'female' | 'other',
    chiefComplaint: indication,
    clinicalHistory: draftOrder.clinicalHistory || 'Not available',
    symptoms: draftOrder.symptoms || [],
    duration: draftOrder.duration || 'Unknown',
    redFlags: draftOrder.redFlags || [],
    proposedImaging: {
      modality,
      bodyPart,
      indication,
      urgency: urgency as 'stat' | 'urgent' | 'routine',
    },
    priorImaging: draftOrder.priorImaging || [],
  };
}

/**
 * Convert EvaluationResult to CDS Hooks cards
 * 
 * This function transforms our internal evaluation result into
 * CDS Hooks card format that Epic can display inline in the ordering interface.
 * 
 * Epic displays cards with:
 * - Summary: Brief text shown in card header
 * - Indicator: Visual indicator (info/warning/critical)
 * - Detail: Full explanation (expandable)
 * - Suggestions: Alternative orders (if applicable)
 */
export function convertResultToCDSCards(
  result: EvaluationResult
): CDSHooksCard[] {
  const cards: CDSHooksCard[] = [];

  // Main appropriateness card
  const indicator: 'info' | 'warning' | 'critical' =
    result.trafficLight === 'green'
      ? 'info'
      : result.trafficLight === 'yellow'
        ? 'warning'
        : 'critical';

  cards.push({
    summary: `Appropriateness Score: ${result.appropriatenessScore.value}/9 (${result.appropriatenessScore.category})`,
    indicator,
    source: {
      label: 'ARKA Imaging Advisor',
    },
    detail: result.reasoning.join('\n\n'),
  });

  // Warning cards
  result.warnings.forEach(warning => {
    if (warning.severity === 'critical' || warning.severity === 'warning') {
      cards.push({
        summary: warning.message,
        indicator: warning.severity === 'critical' ? 'critical' : 'warning',
        source: {
          label: 'ARKA Imaging Advisor',
        },
        detail: warning.message,
      });
    }
  });

  // Alternative suggestions
  if (result.alternatives.length > 0) {
    const suggestions = result.alternatives.map(alt => ({
      label: alt.procedure,
      uuid: `alt-${alt.procedure.replace(/\s+/g, '-').toLowerCase()}`,
      // Epic-specific suggestion structure would go here
      // In production, this would include proper order structure
    }));

    cards.push({
      summary: 'Alternative imaging options available',
      indicator: 'info',
      source: {
        label: 'ARKA Imaging Advisor',
      },
      detail: result.alternatives
        .map(
          a =>
            `${a.procedure} (Rating: ${a.rating}/9) - ${a.reasoning}`
        )
        .join('\n'),
      suggestions,
    });
  }

  return cards;
}

/**
 * Main Epic CDS Hooks evaluation function
 * 
 * This is the entry point for Epic CDS Hooks integration.
 * Epic calls this endpoint when a physician places an imaging order.
 * 
 * Flow:
 * 1. Receive CDS Hooks request from Epic
 * 2. Extract clinical scenario from request
 * 3. Evaluate using our core evaluation engine
 * 4. Convert result to CDS Hooks cards
 * 5. Return response to Epic for display
 * 
 * @param request - CDS Hooks request from Epic
 * @returns CDS Hooks response with cards for Epic to display
 */
export function evaluateImagingCDSHooks(
  request: CDSHooksRequest
): CDSHooksResponse {
  // Step 1: Extract clinical scenario from Epic's request
  const scenario = extractScenarioFromCDSHooks(request);

  // Step 2: Evaluate using our core evaluation engine
  const result = evaluateImaging(scenario);

  // Step 3: Convert result to CDS Hooks cards
  const cards = convertResultToCDSCards(result);

  // Step 4: Return CDS Hooks response
  return {
    cards,
  };
}

