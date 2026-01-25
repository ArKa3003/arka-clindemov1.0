// src/types/index.ts
// These types define the data structures for our entire application
// This file supports both our internal format and Epic CDS Hooks/SMART on FHIR integration

/**
 * Represents a patient's clinical scenario
 * This is the INPUT to our system
 */
export interface ClinicalScenario {
  // Patient demographics
  patientId: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  
  // Clinical presentation
  chiefComplaint: string; // Main reason for visit
  clinicalHistory: string; // Relevant medical history
  symptoms: string[]; // List of symptoms
  duration: string; // How long symptoms present
  
  // Red flags (important warning signs)
  redFlags: RedFlag[];
  
  // Patient Safety Factors
  pregnancyStatus?: 'not-pregnant' | 'pregnant' | 'unknown' | 'not-applicable';
  contrastAllergy?: {
    hasAllergy: boolean;
    allergyType?: 'iodinated' | 'gadolinium' | 'both' | 'unknown';
  };
  renalFunction?: {
    egfr?: number; // eGFR value in mL/min/1.73m²
    hasImpairment?: boolean; // Known renal impairment checkbox
  };
  medications?: {
    onAnticoagulation?: boolean; // Affects procedure timing
    onMetformin?: boolean; // Affects contrast timing
  };
  
  // What the physician wants to order
  proposedImaging: ProposedImaging;
  
  // Optional: prior imaging
  priorImaging?: PriorImaging[];
}

/**
 * Red flags that might indicate serious conditions
 * These affect appropriateness scoring
 */
export interface RedFlag {
  flag: string;
  present: boolean;
}

/**
 * The imaging study being ordered
 */
export interface ProposedImaging {
  modality: ImagingModality;
  bodyPart: string;
  indication: string; // Why the physician wants this
  urgency: 'stat' | 'urgent' | 'routine';
}

/**
 * Imaging modalities we support
 */
export type ImagingModality =
  | 'X-ray'
  | 'CT'
  | 'CT with contrast'
  | 'MRI'
  | 'MRI with contrast'
  | 'Ultrasound'
  | 'Nuclear Medicine'
  | 'PET-CT';

/**
 * Prior imaging information
 */
export interface PriorImaging {
  modality: ImagingModality;
  bodyPart: string;
  date: string;
  daysAgo: number;
  findings?: string;
}

/**
 * The OUTPUT of our evaluation
 */
export interface EvaluationResult {
  // Overall appropriateness (1-9 scale)
  appropriatenessScore: AppropriatenessScore;
  
  // Traffic light for quick visualization
  trafficLight: 'green' | 'yellow' | 'red';
  
  // Matched imaging criteria / AIIE evidence basis
  matchedCriteria: ImagingCriteria;
  
  // Why we gave this score
  reasoning: string[];
  
  // Alternative recommendations
  alternatives: Alternative[];
  
  // Warnings (like prior imaging exists)
  warnings: Warning[];
  
  // Evidence links
  evidenceLinks: EvidenceLink[];
  
  // Confidence level in the recommendation
  confidenceLevel: 'High' | 'Medium' | 'Low';
  
  // Coverage status indicating match quality
  coverageStatus: 'DIRECT_MATCH' | 'SIMILAR_MATCH' | 'GENERAL_GUIDANCE' | 'INSUFFICIENT_DATA';
  
  // Timestamp
  evaluatedAt: string;

  // Optional SHAP-style explanation (AIIE transparent scoring)
  shap?: {
    factors: { name: string; value: string; contribution: number; direction: 'supports' | 'opposes' | 'neutral'; explanation: string; evidenceCitation: string }[];
    baselineScore: number;
    finalScore: number;
  };
}

/**
 * 1-9 scale:
 * 1-3: Usually NOT appropriate
 * 4-6: May be appropriate
 * 7-9: Usually appropriate
 */
export interface AppropriatenessScore {
  value: number; // 1-9
  category: 'usually-not-appropriate' | 'may-be-appropriate' | 'usually-appropriate';
  description: string;
}

/**
 * Imaging criteria / AIIE evidence basis for a recommendation
 */
export interface ImagingCriteria {
  id: string;
  topic: string;
  variant: string;
  procedure: string;
  rating: number; // 1-9
  rrl: string; // Relative Radiation Level
  source: string;
  lastReviewed: string;
}

/**
 * Match result with quality information (used by evaluation layer)
 */
export interface MatchResult {
  criteria: ImagingCriteria | null;
  matchQuality: 'exact' | 'similar' | 'general' | 'none';
  similarityScore?: number;
  closestMatch?: ImagingCriteria;
}

/**
 * Alternative imaging recommendations
 */
export interface Alternative {
  procedure: string;
  rating: number;
  reasoning: string;
  costComparison: 'lower' | 'similar' | 'higher';
  radiationComparison: 'lower' | 'similar' | 'higher' | 'none';
}

/**
 * Warnings to display
 */
export interface Warning {
  type: 'prior-imaging' | 'red-flag' | 'contraindication' | 'cost' | 'pregnancy' | 'contrast-allergy' | 'renal-function' | 'medication';
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

/**
 * Links to evidence
 */
export interface EvidenceLink {
  title: string;
  url: string;
  type: 'guideline' | 'study' | 'recommendation';
}

// ============================================================================
// Epic CDS Hooks Compatibility Types
// ============================================================================
// These types enable integration with Epic's CDS Hooks framework
// CDS Hooks allows our system to be called as a service when physicians
// place imaging orders in Epic, providing real-time appropriateness feedback

/**
 * CDS Hooks Request structure
 * This is what Epic sends to our service when an imaging order is placed
 * 
 * Integration Strategy:
 * - Epic calls our CDS Hook endpoint with this structure
 * - We convert it to our internal ClinicalScenario format
 * - Process the evaluation and return CDSHooksResponse
 */
export interface CDSHooksRequest {
  hook: string; // e.g., "order-select" or "order-sign"
  hookInstance: string; // Unique instance ID for this hook call
  context: {
    userId: string; // FHIR Practitioner reference (e.g., "Practitioner/123")
    patientId: string; // FHIR Patient reference (e.g., "Patient/456")
    selections?: string[]; // Selected order IDs
    draftOrders?: any; // Draft order details from Epic
  };
}

/**
 * CDS Hooks Card structure
 * This is what we return to Epic to display in the physician's workflow
 * 
 * Integration Strategy:
 * - Convert our EvaluationResult to one or more CDSHooksCard objects
 * - Epic displays these cards inline in the ordering interface
 * - Cards can include warnings, suggestions, and links to evidence
 */
export interface CDSHooksCard {
  summary: string; // Brief summary (e.g., "Appropriateness Score: 7/9")
  indicator: 'info' | 'warning' | 'critical'; // Visual indicator
  source: {
    label: string; // e.g., "ARKA Imaging Advisor"
  };
  detail?: string; // Detailed explanation
  suggestions?: any[]; // Alternative order suggestions
}

/**
 * CDS Hooks Response structure
 * This is what we return to Epic
 */
export interface CDSHooksResponse {
  cards: CDSHooksCard[];
}

// ============================================================================
// FHIR Resource References
// ============================================================================
// These types support SMART on FHIR integration, allowing us to reference
// and potentially fetch patient data from Epic's FHIR server

/**
 * FHIR Resource Reference
 * Format: "ResourceType/id" (e.g., "Patient/123", "Practitioner/456")
 */
export type FHIRReference = string;

/**
 * Extended ClinicalScenario with FHIR references
 * Used when we have access to Epic's FHIR server
 */
export interface ClinicalScenarioWithFHIR extends ClinicalScenario {
  patientReference?: FHIRReference; // "Patient/123"
  practitionerReference?: FHIRReference; // "Practitioner/456"
  encounterReference?: FHIRReference; // "Encounter/789"
}

/**
 * FHIR ImagingStudy reference
 * Used to reference prior imaging studies in Epic
 */
export interface FHIRImagingStudyReference {
  reference: FHIRReference; // "ImagingStudy/123"
  display?: string; // Human-readable description
}

// ============================================================================
// Conversion Utilities
// ============================================================================
// Helper functions to convert between our internal format and Epic formats

/**
 * Converts a CDS Hooks request to our internal ClinicalScenario format
 * 
 * @param request - The CDS Hooks request from Epic
 * @returns A ClinicalScenario object ready for evaluation
 */
export function convertCDSHooksToClinicalScenario(
  request: CDSHooksRequest
): Partial<ClinicalScenario> {
  // Extract patient and practitioner IDs from FHIR references
  const patientId = request.context.patientId.replace('Patient/', '');
  const userId = request.context.userId.replace('Practitioner/', '');
  
  // Parse draft orders to extract imaging information
  // This is a simplified conversion - in production, you'd parse Epic's order structure
  const draftOrder = request.context.draftOrders?.[0];
  
  return {
    patientId,
    // Note: age, sex, and other demographics would need to be fetched from FHIR
    // or included in the CDS Hooks context if Epic provides them
    proposedImaging: draftOrder ? {
      modality: draftOrder.modality as ImagingModality,
      bodyPart: draftOrder.bodyPart || '',
      indication: draftOrder.indication || '',
      urgency: draftOrder.urgency || 'routine',
    } : undefined as any,
  };
}

/**
 * Converts our EvaluationResult to CDS Hooks Card format
 * 
 * @param result - Our evaluation result
 * @returns An array of CDS Hooks cards for Epic to display
 */
export function convertEvaluationResultToCDSHooks(
  result: EvaluationResult
): CDSHooksCard[] {
  const cards: CDSHooksCard[] = [];
  
  // Main appropriateness card
  const indicator: 'info' | 'warning' | 'critical' = 
    result.trafficLight === 'green' ? 'info' :
    result.trafficLight === 'yellow' ? 'warning' : 'critical';
  
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
      uuid: `alt-${alt.procedure}`,
      // Epic-specific suggestion structure would go here
    }));
    
    cards.push({
      summary: 'Alternative imaging options available',
      indicator: 'info',
      source: {
        label: 'ARKA Imaging Advisor',
      },
      detail: result.alternatives.map(a => `${a.procedure} (Rating: ${a.rating}/9)`).join('\n'),
      suggestions,
    });
  }
  
  return cards;
}

/**
 * Creates a CDS Hooks response from an EvaluationResult
 * 
 * @param result - Our evaluation result
 * @returns A CDS Hooks response ready to send to Epic
 */
export function createCDSHooksResponse(
  result: EvaluationResult
): CDSHooksResponse {
  return {
    cards: convertEvaluationResultToCDSHooks(result),
  };
}

