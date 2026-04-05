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
  aggregateDeductible?: number;
  manualRate?: number;
  experienceRate?: number;
  finalRate?: number;
  uwAdjustmentFactor?: number;
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
