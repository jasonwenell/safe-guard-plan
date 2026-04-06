import { WorkflowInstance, WorkflowStepInstance, WorkflowPhase, StepStatus, PipelineStats, BottleneckAlert, TeamMember } from '@/types/workflow';

function makeSteps(completedUpTo: number, currentStep: number, opts?: {
  aiSteps?: number[];
  blockedStep?: number;
  overdueStep?: number;
}): WorkflowStepInstance[] {
  const steps: WorkflowStepInstance[] = [];
  for (let i = 1; i <= 18; i++) {
    const stepId = `STEP_${String(i).padStart(2, '0')}`;
    let status: StepStatus = StepStatus.NOT_STARTED;
    let slaStatus: 'on_track' | 'at_risk' | 'overdue' | 'critical' = 'on_track';
    let aiCompleted = false;

    if (i <= completedUpTo) {
      status = StepStatus.COMPLETE;
      aiCompleted = opts?.aiSteps?.includes(i) ?? false;
    } else if (i === currentStep) {
      if (opts?.blockedStep === i) {
        status = StepStatus.BLOCKED;
      } else {
        status = StepStatus.IN_PROGRESS;
      }
      if (opts?.overdueStep === i) slaStatus = 'overdue';
    }

    steps.push({
      stepId,
      status,
      slaStatus,
      aiCompleted,
      aiConfidence: aiCompleted ? 0.85 + Math.random() * 0.12 : undefined,
      assignedName: i <= 6 ? 'Traci Gamer' : i <= 12 ? 'Heidi Bouma' : 'Juice Montezon',
      startedAt: i <= completedUpTo || i === currentStep ? '2026-04-03T09:00:00Z' : undefined,
      completedAt: i <= completedUpTo ? '2026-04-04T14:00:00Z' : undefined,
      durationMinutes: i <= completedUpTo ? Math.floor(Math.random() * 120) + 10 : undefined,
      notes: aiCompleted ? `AI auto-completed with ${Math.round((0.85 + Math.random() * 0.12) * 100)}% confidence` : undefined,
    });
  }
  return steps;
}

function calcPercent(steps: WorkflowStepInstance[]): number {
  const weights = [8, 5, 3, 2, 2, 5, 12, 8, 8, 10, 7, 5, 3, 10, 8, 5, 5, 4];
  let total = 0;
  steps.forEach((s, i) => {
    if (s.status === StepStatus.COMPLETE) total += weights[i];
  });
  return total;
}

function currentPhaseFromStep(step: number): WorkflowPhase {
  if (step <= 6) return WorkflowPhase.ASSISTANT_INTAKE;
  if (step <= 12) return WorkflowPhase.ASSOCIATE_SETUP;
  return WorkflowPhase.UNDERWRITER_RATING;
}

export const MOCK_WORKFLOWS: WorkflowInstance[] = [
  (() => {
    const steps = makeSteps(9, 10, { aiSteps: [1, 2, 3, 4, 5, 7, 8] });
    return {
      id: 'wf-001', rfpId: 'rfp-001', groupName: 'Midwest Manufacturing Corp', caseNumber: 24001,
      tpaCode: 'ASR', tpaName: 'ASR Health Benefits', producerName: 'Marsh & McLennan',
      employeeCount: 285, effectiveDate: '2026-07-01', type: 'NEW' as const, isRush: true,
      quotabilityScore: 78, currentPhase: WorkflowPhase.ASSOCIATE_SETUP,
      currentStepId: 'STEP_10', overallPercent: calcPercent(steps), lifecycleState: 'setup',
      steps, startedAt: '2026-04-01T09:30:00Z', estimatedCompletionAt: '2026-04-10T17:00:00Z',
      assignedUW: 'Juice Montezon', assignedAssociate: 'Heidi Bouma', assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(12, 13, { aiSteps: [1, 2, 3, 4, 5, 7, 8, 9, 11] });
    return {
      id: 'wf-002', rfpId: 'rfp-002', groupName: 'Great Plains Agriculture LLC', caseNumber: 24002,
      tpaCode: 'IMS', tpaName: 'Integrated Medical Solutions', producerName: 'Aon Risk Solutions',
      employeeCount: 142, effectiveDate: '2026-08-01', type: 'RENEWAL' as const, isRush: false,
      quotabilityScore: 85, currentPhase: WorkflowPhase.UNDERWRITER_RATING,
      currentStepId: 'STEP_13', overallPercent: calcPercent(steps), lifecycleState: 'underwriting',
      steps, startedAt: '2026-03-28T14:15:00Z', estimatedCompletionAt: '2026-04-08T17:00:00Z',
      assignedUW: 'Steve Rogers', assignedAssociate: 'Angie Vollhaber', assignedAssistant: 'Trevor Smith',
    };
  })(),
  (() => {
    const steps = makeSteps(17, 18, { aiSteps: [1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 17] });
    return {
      id: 'wf-003', rfpId: 'rfp-003', groupName: 'Lakeside Healthcare System', caseNumber: 24003,
      tpaCode: 'CCAE', tpaName: 'Cub Cabbage & Associates', producerName: 'Cub Cabbage & Associates',
      employeeCount: 1250, effectiveDate: '2026-09-01', type: 'NEW' as const, isRush: false,
      quotabilityScore: 92, currentPhase: WorkflowPhase.UNDERWRITER_RATING,
      currentStepId: 'STEP_18', overallPercent: calcPercent(steps), lifecycleState: 'quoted',
      steps, startedAt: '2026-03-15T10:00:00Z',
      assignedUW: 'Juice Montezon', assignedAssociate: 'Heidi Bouma', assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(2, 3, { aiSteps: [1, 2] });
    return {
      id: 'wf-004', rfpId: 'rfp-004', groupName: 'Standard Printing Co', caseNumber: 24004,
      tpaCode: 'JPF', tpaName: 'JP Farley Corporation', producerName: 'Arthur J. Gallagher',
      employeeCount: 67, effectiveDate: '2026-10-01', type: 'NEW' as const, isRush: false,
      quotabilityScore: 72, currentPhase: WorkflowPhase.ASSISTANT_INTAKE,
      currentStepId: 'STEP_03', overallPercent: calcPercent(steps), lifecycleState: 'intake',
      steps, startedAt: '2026-04-03T08:45:00Z', estimatedCompletionAt: '2026-04-15T17:00:00Z',
      assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(0, 1, {});
    return {
      id: 'wf-005', rfpId: 'rfp-005', groupName: 'Rocky Mountain Resorts Inc', caseNumber: 24005,
      tpaCode: 'MHS', tpaName: 'Managed Health Services', producerName: 'Willis Towers Watson',
      employeeCount: 95, effectiveDate: '2026-11-01', type: 'NEW' as const, isRush: false,
      quotabilityScore: 65, currentPhase: WorkflowPhase.ASSISTANT_INTAKE,
      currentStepId: 'STEP_01', overallPercent: 0, lifecycleState: 'received',
      steps, startedAt: '2026-04-05T11:20:00Z',
      assignedAssistant: 'Trevor Smith',
    };
  })(),
  (() => {
    const steps = makeSteps(18, 18, { aiSteps: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17] });
    steps.forEach(s => { s.status = StepStatus.COMPLETE; });
    return {
      id: 'wf-006', rfpId: 'rfp-006', groupName: 'Heartland School District #47', caseNumber: 24006,
      tpaCode: 'EVE', tpaName: 'Evergreen Health', producerName: 'Hub International',
      employeeCount: 310, effectiveDate: '2026-07-01', type: 'RENEWAL' as const, isRush: false,
      quotabilityScore: 88, currentPhase: WorkflowPhase.UNDERWRITER_RATING,
      currentStepId: 'STEP_18', overallPercent: 100, lifecycleState: 'won',
      steps, startedAt: '2026-03-01T07:30:00Z',
      assignedUW: 'Steve Rogers', assignedAssociate: 'Polly Brohaugh', assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(6, 7, { aiSteps: [1, 2, 3, 4, 5], blockedStep: 7 });
    steps[6].blockedReason = 'Waiting on census from TPA (requested Apr 2)';
    return {
      id: 'wf-007', rfpId: 'rfp-009', groupName: 'Northern Lakes Construction', caseNumber: 24009,
      tpaCode: 'ASR', tpaName: 'ASR Health Benefits', producerName: 'Aon Risk Solutions',
      employeeCount: 78, effectiveDate: '2026-09-01', type: 'NEW' as const, isRush: false,
      quotabilityScore: 68, currentPhase: WorkflowPhase.ASSOCIATE_SETUP,
      currentStepId: 'STEP_07', overallPercent: calcPercent(steps), lifecycleState: 'setup',
      steps, startedAt: '2026-04-02T10:15:00Z',
      assignedUW: 'Steve Rogers', assignedAssociate: 'Heidi Bouma', assignedAssistant: 'Trevor Smith',
    };
  })(),
  (() => {
    const steps = makeSteps(5, 6, { aiSteps: [1, 2, 3, 4, 5], overdueStep: 6 });
    return {
      id: 'wf-008', rfpId: 'rfp-010', groupName: 'Sunrise Foods International', caseNumber: 24011,
      tpaCode: 'WEL', tpaName: 'Wellness Corp TPA', producerName: 'Willis Towers Watson',
      employeeCount: 210, effectiveDate: '2026-09-01', type: 'NEW' as const, isRush: false,
      quotabilityScore: 74, currentPhase: WorkflowPhase.ASSISTANT_INTAKE,
      currentStepId: 'STEP_06', overallPercent: calcPercent(steps), lifecycleState: 'intake',
      steps, startedAt: '2026-04-01T09:00:00Z',
      assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(15, 16, { aiSteps: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15] });
    return {
      id: 'wf-009', rfpId: 'rfp-new-1', groupName: 'Valley Medical Group', caseNumber: 24012,
      tpaCode: 'JPF', tpaName: 'JP Farley Corporation', producerName: 'Lockton Companies',
      employeeCount: 52, effectiveDate: '2026-08-01', type: 'NEW' as const, isRush: true,
      quotabilityScore: 91, currentPhase: WorkflowPhase.UNDERWRITER_RATING,
      currentStepId: 'STEP_16', overallPercent: calcPercent(steps), lifecycleState: 'underwriting',
      steps, startedAt: '2026-03-25T08:00:00Z', estimatedCompletionAt: '2026-04-07T17:00:00Z',
      assignedUW: 'Juice Montezon', assignedAssociate: 'Angie Vollhaber', assignedAssistant: 'Traci Gamer',
    };
  })(),
  (() => {
    const steps = makeSteps(6, 8, { aiSteps: [1, 2, 3, 4, 5, 7] });
    steps[6].status = StepStatus.COMPLETE; // step 7 done
    return {
      id: 'wf-010', rfpId: 'rfp-new-2', groupName: 'Bright Health Corp', caseNumber: 24013,
      tpaCode: 'IMS', tpaName: 'Integrated Medical Solutions', producerName: 'Marsh & McLennan',
      employeeCount: 320, effectiveDate: '2026-10-01', type: 'RENEWAL' as const, isRush: false,
      quotabilityScore: 81, currentPhase: WorkflowPhase.ASSOCIATE_SETUP,
      currentStepId: 'STEP_08', overallPercent: calcPercent(steps), lifecycleState: 'setup',
      steps, startedAt: '2026-04-01T14:00:00Z',
      assignedUW: 'Jeff Williams', assignedAssociate: 'Polly Brohaugh', assignedAssistant: 'Trevor Smith',
    };
  })(),
];

export const MOCK_PIPELINE_STATS: PipelineStats = {
  intake: 14,
  setup: 38,
  underwriting: 22,
  quoted: 45,
  avgIntakeDays: 0.4,
  avgSetupDays: 1.8,
  avgUWDays: 1.2,
  onTrackPercent: 87,
  atRiskPercent: 9,
  overduePercent: 4,
  receivedThisWeek: 42,
  quotedThisWeek: 35,
  wonThisWeek: 8,
  declinedThisWeek: 3,
};

export const MOCK_BOTTLENECKS: BottleneckAlert[] = [
  { id: 'b1', severity: 'high', message: 'Census Processing averaging 5.2h (SLA: 4h)', affectedCount: 6, stepName: 'Census Processing' },
  { id: 'b2', severity: 'medium', message: "Steve's UW queue: 8 quotes (avg 1.5 days waiting)", affectedCount: 8 },
  { id: 'b3', severity: 'medium', message: '3 quotes blocked > 48h waiting on TPA documents', affectedCount: 3 },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Traci Gamer', role: 'ASSISTANT', throughputPerDay: 8, targetPerDay: 8, onTarget: true, activeCount: 6 },
  { id: 'tm2', name: 'Trevor Smith', role: 'ASSISTANT', throughputPerDay: 7, targetPerDay: 8, onTarget: true, activeCount: 5 },
  { id: 'tm3', name: 'Heidi Bouma', role: 'ASSOCIATE', throughputPerDay: 5, targetPerDay: 6, onTarget: false, activeCount: 8 },
  { id: 'tm4', name: 'Angie Vollhaber', role: 'ASSOCIATE', throughputPerDay: 6, targetPerDay: 6, onTarget: true, activeCount: 7 },
  { id: 'tm5', name: 'Polly Brohaugh', role: 'ASSOCIATE', throughputPerDay: 6, targetPerDay: 6, onTarget: true, activeCount: 5 },
  { id: 'tm6', name: 'Juice Montezon', role: 'UNDERWRITER', throughputPerDay: 4, targetPerDay: 4, onTarget: true, activeCount: 6 },
  { id: 'tm7', name: 'Steve Rogers', role: 'UNDERWRITER', throughputPerDay: 3, targetPerDay: 4, onTarget: false, activeCount: 8 },
  { id: 'tm8', name: 'Jeff Williams', role: 'UNDERWRITER', throughputPerDay: 4, targetPerDay: 4, onTarget: true, activeCount: 4 },
];

export const MOCK_AI_IMPACT = {
  stepsCompletedThisWeek: 142,
  percentOfAllSteps: 67,
  avgConfidence: 84,
  uwOverrides: 12,
  overridePercent: 8.5,
  estimatedHoursSaved: 340,
};
