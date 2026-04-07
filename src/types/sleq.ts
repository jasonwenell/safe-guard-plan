// SLEQ Platform Core Types

export enum UserRole {
  ADMIN = 'admin',
  UW_ASSISTANT = 'uw_assistant',
  UW_ASSOCIATE = 'uw_associate',
  UNDERWRITER = 'underwriter',
  LEAD_UNDERWRITER = 'lead_underwriter',
  IMPL_SPECIALIST = 'impl_specialist',
  RISK_ANALYST = 'risk_analyst',
  OPERATIONS_LEAD = 'operations_lead',
}

export enum RFPStatus {
  DRAFT = 'draft',
  INTAKE = 'intake',
  SETUP = 'setup',
  READY_FOR_UW = 'ready_for_uw',
  IN_UNDERWRITING = 'in_underwriting',
  QUOTED = 'quoted',
  PROPOSAL_SENT = 'proposal_sent',
  WON = 'won',
  LOST = 'lost',
  DECLINED = 'declined',
  REACTIVATED = 'reactivated',
}

export enum CensusReadyStatus {
  WAITING = 'waiting',
  MEMBER_CENSUS = 'member_census',
  EMPLOYEE_CENSUS = 'employee_census',
  EXPERIENCE = 'experience',
  APPS = 'apps',
  SENT_BACK = 'sent_back',
  READY = 'ready',
}

export enum SetupTaskStatus {
  NOT_STARTED = 'not_started',
  RECEIVED = 'received',
  ENTERED = 'entered',
  VERIFIED = 'verified',
}

export type DocumentType = 'census' | 'sob' | 'experience' | 'application' | 'rfp_letter' | 'id_cards' | 'unknown';
export type DocumentProcessingStatus = 'queued' | 'classifying' | 'extracting' | 'review' | 'accepted' | 'rejected' | 'error';

export interface IntakeDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadSource: 'email' | 'manual';
  emailId?: string;
  rfpId?: string;
  documentType: DocumentType;
  aiClassifiedType?: DocumentType;
  aiClassificationConfidence?: number;
  processingStatus: DocumentProcessingStatus;
  processingProgress?: number;
  extractedFields?: ExtractedField[];
  pageCount?: number;
  errors?: string[];
}

export interface ExtractedField {
  fieldName: string;
  value: string;
  confidence: number;
  sourceLocation?: string; // e.g. "Page 1, Row 3"
  accepted: boolean;
}

export interface EmailDetail extends EmailInbox {
  bodyPreview: string;
  bodyHtml?: string;
  toAddress: string;
  ccAddresses?: string[];
  documents: IntakeDocument[];
  aiSummary?: string;
  aiExtractedFields?: ExtractedField[];
  linkedRfpId?: string;
  threadId?: string;
  threadCount?: number;
}

export interface Carrier {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  quotableStates: string[];
  minLives?: number;
  maxLives?: number;
}

export interface TPA {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  defaultCarrierId?: string;
  defaultUWId?: string;
  renewalLeadMonths: number;
  requiresMemberCensus: boolean;
}

export interface Producer {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  isTPA: boolean;
  linkedTPAId?: string;
}

export interface RFP {
  id: string;
  caseNumber: number;
  groupName: string;
  groupId?: string;
  carrierId: string;
  carrierName: string;
  tpaId: string;
  tpaCode: string;
  tpaName: string;
  producerId: string;
  producerName: string;
  status: RFPStatus;
  type: 'NEW' | 'RENEWAL';
  isRush: boolean;
  isDuplicate: boolean;
  duplicateCaseNumber?: number;
  assignedUWId?: string;
  assignedUWName?: string;
  assignedAssociateId?: string;
  assignedAssociateName?: string;
  effectiveDate: string;
  receivedDate: string;
  requestDate: string;
  tpacDate: string;
  censusStatus: CensusReadyStatus;
  riskAssessmentStatus: SetupTaskStatus;
  sobStatus: SetupTaskStatus;
  ratingSystemStatus: SetupTaskStatus;
  setupComplete: boolean;
  sicCode: string;
  sicDescription?: string;
  employeeCount?: number;
  state?: string;
  aiConfidenceScore?: number;
  setupNotes?: string;
  isLocked: boolean;
  createdAt: string;
}

export interface EmailInbox {
  id: string;
  fromAddress: string;
  fromName: string;
  subject: string;
  receivedAt: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  tpaDetected?: string;
  groupDetected?: string;
  attachmentCount: number;
  rfpId?: string;
}

export interface CensusMember {
  id: string;
  rfpId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  zipCode: string;
  relationship: 'EMPLOYEE' | 'SPOUSE' | 'CHILD' | 'DOMESTIC_PARTNER';
  status: 'ACTIVE' | 'COBRA' | 'RETIREE';
  planName?: string;
  coverageTier?: string;
  aiMapped: boolean;
  aiConfidence?: number;
}

export interface Scenario {
  id: string;
  rfpId: string;
  name: string;
  sequenceNumber: number;
  isLocked: boolean;
  contractBasis: string;
  specificDeductible: number;

  // Aggregate (Gap 1 — calculated)
  aggregateCorridorPercent?: number;
  expectedClaimsPEPM?: number;
  aggregateAttachmentPoint?: number;
  minimumAggregateDeductible?: number;

  // Legacy compat
  aggregateDeductible?: number;

  // Specific rating (Gap 2)
  specificManualRate?: number;
  specificExperienceRate?: number;
  specificFinalRate?: number;
  specificAnnualPremium?: number;

  // Aggregate rating (Gap 2)
  aggregateManualRate?: number;
  aggregateExperienceRate?: number;
  aggregateFinalRate?: number;
  aggregateAnnualPremium?: number;

  // Composite
  compositeFinalRate?: number;
  totalAnnualPremium?: number;

  // Legacy single-rate compat
  manualRate?: number;
  experienceRate?: number;
  finalRate?: number;
  uwAdjustmentFactor?: number;

  // Product options (Gap 6)
  rateCapPercent?: number;
  rateCapPremiumAdder?: number;
  noNewLasers?: boolean;
  noNewLaserPremiumAdder?: number;

  // ASD (Gap 7)
  aggregatingSpecificDeductible?: number;
  asdPremiumReduction?: number;
}

// Gap 4: Claims Experience
export interface ClaimsExperienceMonth {
  id: string;
  rfpId: string;
  periodStart: string;
  periodEnd: string;
  enrollmentCount: number;
  memberCount: number;
  medicalClaimsPaid: number;
  pharmacyClaimsPaid: number;
  totalClaimsPaid: number;
  largeClaimsCount: number;
  largeClaimsTotal: number;
  isComplete: boolean;
  source: 'MANUAL_ENTRY' | 'AI_EXTRACTED' | 'TPA_DATA_FEED' | 'IMPORTED_FILE';
}

export interface LargeClaimant {
  id: string;
  rfpId: string;
  claimantReference: string;
  age?: number;
  gender?: string;
  relationship: string;
  diagnosisCategory: string;
  diagnosisDetail?: string;
  totalPaidToDate: number;
  amountAboveSpecific: number;
  treatmentStatus: 'ACTIVE' | 'COMPLETED' | 'ONGOING_CHRONIC' | 'PENDING' | 'UNKNOWN';
  trendDirection: 'INCREASING' | 'STABLE' | 'DECREASING' | 'UNKNOWN';
  expectedFutureCost?: number;
  isLasered: boolean;
  priorLaserAmount?: number;
  source: 'MANUAL_ENTRY' | 'AI_EXTRACTED' | 'TPA_DATA_FEED';
}

export interface PriorYearSummary {
  id: string;
  rfpId: string;
  policyYear: string;
  specificDeductible: number;
  aggregateCorridorPercent: number;
  contractBasis: string;
  specificRatePMPM: number;
  aggregateRatePMPM: number;
  compositeRatePMPM: number;
  totalAnnualPremium: number;
  totalClaimsPaid: number;
  lossRatio: number;
  memberMonths: number;
  largeClaimantCount: number;
  enrollmentAverage: number;
  carrierName: string;
  tpaName: string;
}

// Gap 3: Binding
export interface BindingRecord {
  id: string;
  rfpId: string;
  acceptedScenarioId: string;
  acceptedScenarioName: string;
  acceptedDate: string;
  acceptedByName: string;
  acceptedByEmail: string;
  acceptanceMethod: string;
  modifications?: string;
  bindingStatus: 'accepted' | 'binder_sent' | 'policy_setup' | 'impl_handoff' | 'policy_issued' | 'complete';
  steps: BindingStep[];
}

export interface BindingStep {
  id: string;
  name: string;
  status: 'complete' | 'in_progress' | 'pending';
  ownerRole: string;
  completedAt?: string;
}

// Gap 9: Communications
export interface CaseCommunication {
  id: string;
  rfpId: string;
  commType: 'EMAIL_SENT' | 'EMAIL_RECEIVED' | 'PHONE_CALL' | 'NOTE' | 'DOCUMENT_REQUEST' | 'FOLLOW_UP' | 'STATUS_UPDATE' | 'AUTO';
  direction: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
  contactName?: string;
  contactEmail?: string;
  subject: string;
  body: string;
  attachments?: string[];
  linkedStepId?: string;
  isAutoGenerated: boolean;
  createdAt: string;
}

// Gap 10: Win-Loss
export interface QuoteOutcome {
  id: string;
  rfpId: string;
  outcome: 'WON' | 'LOST' | 'DECLINED' | 'EXPIRED';
  outcomeDate: string;
  acceptedScenarioId?: string;
  decisiveFactors?: string[];
  lostReason?: string;
  winningCarrier?: string;
  winningRate?: number;
  rateDifferencePercent?: number;
  couldWeHaveWon?: boolean;
  retryNextYear?: boolean;
  competitorsQuoted?: string[];
  notes?: string;
}

export interface Policy {
  id: string;
  policyNumber: string;
  groupName: string;
  carrierId: string;
  carrierName: string;
  tpaName: string;
  producerName: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  premiumAmount?: number;
}

export interface DashboardStats {
  totalActiveRFPs: number;
  dueToday: number;
  rushCases: number;
  pendingSetup: number;
  inUnderwriting: number;
  quotedThisMonth: number;
  wonThisMonth: number;
  avgDaysToQuote: number;
}

export const STATUS_LABELS: Record<RFPStatus, string> = {
  [RFPStatus.DRAFT]: 'Draft',
  [RFPStatus.INTAKE]: 'Intake',
  [RFPStatus.SETUP]: 'Setup',
  [RFPStatus.READY_FOR_UW]: 'Ready for UW',
  [RFPStatus.IN_UNDERWRITING]: 'In Underwriting',
  [RFPStatus.QUOTED]: 'Quoted',
  [RFPStatus.PROPOSAL_SENT]: 'Proposal Sent',
  [RFPStatus.WON]: 'Won',
  [RFPStatus.LOST]: 'Lost',
  [RFPStatus.DECLINED]: 'Declined',
  [RFPStatus.REACTIVATED]: 'Reactivated',
};

export const CENSUS_STATUS_LABELS: Record<CensusReadyStatus, string> = {
  [CensusReadyStatus.WAITING]: 'Waiting',
  [CensusReadyStatus.MEMBER_CENSUS]: 'Member Census',
  [CensusReadyStatus.EMPLOYEE_CENSUS]: 'Employee Census',
  [CensusReadyStatus.EXPERIENCE]: 'Experience',
  [CensusReadyStatus.APPS]: 'Apps',
  [CensusReadyStatus.SENT_BACK]: 'Sent Back',
  [CensusReadyStatus.READY]: 'Ready',
};

export const SETUP_STATUS_LABELS: Record<SetupTaskStatus, string> = {
  [SetupTaskStatus.NOT_STARTED]: 'Not Started',
  [SetupTaskStatus.RECEIVED]: 'Received',
  [SetupTaskStatus.ENTERED]: 'Entered',
  [SetupTaskStatus.VERIFIED]: 'Verified',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  census: 'Census',
  sob: 'Summary of Benefits',
  experience: 'Experience/Claims',
  application: 'Application',
  rfp_letter: 'RFP Letter',
  id_cards: 'ID Cards',
  unknown: 'Unknown',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentProcessingStatus, string> = {
  queued: 'Queued',
  classifying: 'Classifying',
  extracting: 'Extracting',
  review: 'Needs Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  error: 'Error',
};
