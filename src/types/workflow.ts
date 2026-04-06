// Workflow Types for the Quote Process Manager ("Pizza Tracker")

export enum WorkflowPhase {
  ASSISTANT_INTAKE = 'assistant_intake',
  ASSOCIATE_SETUP = 'associate_setup',
  UNDERWRITER_RATING = 'underwriter_rating',
}

export enum StepStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  AI_PROCESSING = 'ai_processing',
  NEEDS_REVIEW = 'needs_review',
  COMPLETE = 'complete',
  SKIPPED = 'skipped',
}

export type SLAStatus = 'on_track' | 'at_risk' | 'overdue' | 'critical';

export interface WorkflowStepDef {
  id: string;
  phase: WorkflowPhase;
  sequenceNumber: number;
  name: string;
  shortName: string;
  description: string;
  ownerRole: 'ASSISTANT' | 'ASSOCIATE' | 'UNDERWRITER' | 'AI' | 'SYSTEM';
  slaHours: number;
  slaPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  percentWeight: number;
  aiAutomatable: boolean;
  predecessors: string[];
}

export interface WorkflowStepInstance {
  stepId: string;
  status: StepStatus;
  assignedTo?: string;
  assignedName?: string;
  startedAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  slaDeadline?: string;
  slaStatus: SLAStatus;
  aiCompleted: boolean;
  aiConfidence?: number;
  blockedReason?: string;
  notes?: string;
}

export interface WorkflowInstance {
  id: string;
  rfpId: string;
  groupName: string;
  caseNumber: number;
  tpaCode: string;
  tpaName: string;
  producerName: string;
  employeeCount: number;
  effectiveDate: string;
  type: 'NEW' | 'RENEWAL';
  isRush: boolean;
  quotabilityScore?: number;
  currentPhase: WorkflowPhase;
  currentStepId: string;
  overallPercent: number;
  lifecycleState: string;
  steps: WorkflowStepInstance[];
  startedAt: string;
  estimatedCompletionAt?: string;
  assignedUW?: string;
  assignedAssociate?: string;
  assignedAssistant?: string;
}

export interface PipelineStats {
  intake: number;
  setup: number;
  underwriting: number;
  quoted: number;
  avgIntakeDays: number;
  avgSetupDays: number;
  avgUWDays: number;
  onTrackPercent: number;
  atRiskPercent: number;
  overduePercent: number;
  receivedThisWeek: number;
  quotedThisWeek: number;
  wonThisWeek: number;
  declinedThisWeek: number;
}

export interface BottleneckAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  affectedCount: number;
  stepName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'ASSISTANT' | 'ASSOCIATE' | 'UNDERWRITER';
  throughputPerDay: number;
  targetPerDay: number;
  onTarget: boolean;
  activeCount: number;
}

// 18 step definitions
export const WORKFLOW_STEP_DEFS: WorkflowStepDef[] = [
  // Phase 1: Assistant Intake
  { id: 'STEP_01', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 1, name: 'RFP Receipt & Logging', shortName: 'Receipt', description: 'Receive RFP, create quote log record, enter group details.', ownerRole: 'ASSISTANT', slaHours: 4, slaPriority: 'HIGH', percentWeight: 8, aiAutomatable: true, predecessors: [] },
  { id: 'STEP_02', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 2, name: 'Document Collection & Classification', shortName: 'Docs', description: 'Upload and classify all received documents.', ownerRole: 'ASSISTANT', slaHours: 4, slaPriority: 'HIGH', percentWeight: 5, aiAutomatable: true, predecessors: ['STEP_01'] },
  { id: 'STEP_03', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 3, name: 'Validation & DTQ Check', shortName: 'DTQ', description: 'Validate SIC, state, TPA-Producer rules.', ownerRole: 'SYSTEM', slaHours: 0, slaPriority: 'CRITICAL', percentWeight: 3, aiAutomatable: true, predecessors: ['STEP_01'] },
  { id: 'STEP_04', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 4, name: 'Duplicate & Renewal Detection', shortName: 'Dup Check', description: 'Fuzzy name matching for duplicates and renewals.', ownerRole: 'SYSTEM', slaHours: 0, slaPriority: 'HIGH', percentWeight: 2, aiAutomatable: true, predecessors: ['STEP_01'] },
  { id: 'STEP_05', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 5, name: 'Quotability Scoring', shortName: 'QS', description: 'Calculate Quotability Score (0-100).', ownerRole: 'AI', slaHours: 0, slaPriority: 'HIGH', percentWeight: 2, aiAutomatable: true, predecessors: ['STEP_01', 'STEP_03'] },
  { id: 'STEP_06', phase: WorkflowPhase.ASSISTANT_INTAKE, sequenceNumber: 6, name: 'UW Assignment & Case Setup', shortName: 'Assign', description: 'Assign underwriter, associate, create case folder.', ownerRole: 'ASSISTANT', slaHours: 2, slaPriority: 'HIGH', percentWeight: 5, aiAutomatable: false, predecessors: ['STEP_05'] },
  // Phase 2: Associate Setup
  { id: 'STEP_07', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 7, name: 'Census Processing', shortName: 'Census', description: 'Upload, map columns, validate census data.', ownerRole: 'ASSOCIATE', slaHours: 8, slaPriority: 'HIGH', percentWeight: 12, aiAutomatable: true, predecessors: ['STEP_06'] },
  { id: 'STEP_08', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 8, name: 'Schedule of Benefits Entry', shortName: 'SoB', description: 'Enter deductibles, OOP, copays, Rx tiers.', ownerRole: 'ASSOCIATE', slaHours: 4, slaPriority: 'HIGH', percentWeight: 8, aiAutomatable: true, predecessors: ['STEP_06'] },
  { id: 'STEP_09', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 9, name: 'Plan Stack — Terms & Contract', shortName: 'Terms', description: 'Enter contract basis, deductibles, TLOs.', ownerRole: 'ASSOCIATE', slaHours: 4, slaPriority: 'MEDIUM', percentWeight: 8, aiAutomatable: true, predecessors: ['STEP_08'] },
  { id: 'STEP_10', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 10, name: 'Plan Stack — Plan Designs', shortName: 'Plans', description: 'Build per-plan design records, map from census.', ownerRole: 'ASSOCIATE', slaHours: 8, slaPriority: 'MEDIUM', percentWeight: 10, aiAutomatable: true, predecessors: ['STEP_08', 'STEP_09'] },
  { id: 'STEP_11', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 11, name: 'Current Rates & Experience Data', shortName: 'Rates', description: 'Enter current/expiring rates, claims experience.', ownerRole: 'ASSOCIATE', slaHours: 4, slaPriority: 'MEDIUM', percentWeight: 7, aiAutomatable: true, predecessors: ['STEP_06'] },
  { id: 'STEP_12', phase: WorkflowPhase.ASSOCIATE_SETUP, sequenceNumber: 12, name: 'Risk Assessment & Large Claimants', shortName: 'Risk', description: 'Enter high-cost claimant info, risk notes.', ownerRole: 'ASSOCIATE', slaHours: 4, slaPriority: 'MEDIUM', percentWeight: 5, aiAutomatable: false, predecessors: ['STEP_07'] },
  // Phase 3: Underwriter Rating
  { id: 'STEP_13', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 13, name: 'UW Queue Management & Triage', shortName: 'Triage', description: 'Review queue, decide processing order.', ownerRole: 'UNDERWRITER', slaHours: 4, slaPriority: 'HIGH', percentWeight: 3, aiAutomatable: true, predecessors: ['STEP_07', 'STEP_08', 'STEP_09', 'STEP_10'] },
  { id: 'STEP_14', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 14, name: 'Plan Stack Building & Blending', shortName: 'Build', description: 'Build final plan stack, blend plans, create scenarios.', ownerRole: 'UNDERWRITER', slaHours: 8, slaPriority: 'HIGH', percentWeight: 10, aiAutomatable: true, predecessors: ['STEP_13'] },
  { id: 'STEP_15', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 15, name: 'Rate Calculation & Comparison', shortName: 'Rate', description: 'Calculate manual/experience rates, credibility blending.', ownerRole: 'UNDERWRITER', slaHours: 4, slaPriority: 'HIGH', percentWeight: 8, aiAutomatable: true, predecessors: ['STEP_14'] },
  { id: 'STEP_16', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 16, name: 'Claims Experience & Contingencies', shortName: 'Claims', description: 'Deep-dive claims, lasers, risk mitigation.', ownerRole: 'UNDERWRITER', slaHours: 4, slaPriority: 'HIGH', percentWeight: 5, aiAutomatable: true, predecessors: ['STEP_11', 'STEP_12', 'STEP_15'] },
  { id: 'STEP_17', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 17, name: 'Quote Generation & Proposal', shortName: 'Quote', description: 'Generate formal quote with scenarios, rates, terms.', ownerRole: 'UNDERWRITER', slaHours: 4, slaPriority: 'HIGH', percentWeight: 5, aiAutomatable: true, predecessors: ['STEP_15', 'STEP_16'] },
  { id: 'STEP_18', phase: WorkflowPhase.UNDERWRITER_RATING, sequenceNumber: 18, name: 'Sold Quote & Policy Binding', shortName: 'Bind', description: 'Confirm binding, issue binder, record outcome.', ownerRole: 'UNDERWRITER', slaHours: 0, slaPriority: 'MEDIUM', percentWeight: 4, aiAutomatable: false, predecessors: ['STEP_17'] },
];

export const PHASE_LABELS: Record<WorkflowPhase, string> = {
  [WorkflowPhase.ASSISTANT_INTAKE]: 'Intake',
  [WorkflowPhase.ASSOCIATE_SETUP]: 'Setup',
  [WorkflowPhase.UNDERWRITER_RATING]: 'Underwriting',
};

export const PHASE_COLORS: Record<WorkflowPhase, { bg: string; text: string; border: string; dot: string }> = {
  [WorkflowPhase.ASSISTANT_INTAKE]: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  [WorkflowPhase.ASSOCIATE_SETUP]: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
  [WorkflowPhase.UNDERWRITER_RATING]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
};
