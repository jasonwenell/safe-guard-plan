import { PersonaRole } from '@/contexts/PersonaContext';
import { StepStatus, WORKFLOW_STEP_DEFS, WorkflowInstance } from '@/types/workflow';
import {
  FileText, Upload, Users, ClipboardList, Layers, Activity,
  AlertTriangle, Zap, Calculator, FileOutput, Link2, MessageSquare,
  Trophy, TrendingUp, GitBranch
} from 'lucide-react';

export interface WorkspaceTab {
  id: string;
  label: string;
  icon: typeof FileText;
  roles: PersonaRole[];
  workflowSteps?: string[];
  showStatusIcon: boolean;
  showForNewQuote: boolean;
  showOnlyForRenewals?: boolean;
}

export const WORKSPACE_TABS: WorkspaceTab[] = [
  // Phase 1: Intake
  { id: 'intake', label: 'Intake', icon: FileText, roles: ['ASSISTANT', 'MASTER'], workflowSteps: ['STEP_01', 'STEP_03', 'STEP_04', 'STEP_05', 'STEP_06'], showStatusIcon: true, showForNewQuote: true },
  { id: 'documents', label: 'Documents', icon: Upload, roles: ['ASSISTANT', 'ASSOCIATE', 'UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_02'], showStatusIcon: true, showForNewQuote: true },
  // Phase 2: Setup
  { id: 'census', label: 'Census', icon: Users, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_07'], showStatusIcon: true, showForNewQuote: false },
  { id: 'plan-stack', label: 'Plan Stack', icon: Layers, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_08', 'STEP_09', 'STEP_10'], showStatusIcon: true, showForNewQuote: false },
  { id: 'claims', label: 'Claims', icon: Activity, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_11'], showStatusIcon: true, showForNewQuote: false },
  { id: 'risk', label: 'Risk', icon: AlertTriangle, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_12'], showStatusIcon: true, showForNewQuote: false },
  // Phase 3: Underwriting
  { id: 'ai-package', label: 'AI Package', icon: Zap, roles: ['UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_13', 'STEP_14', 'STEP_15', 'STEP_16'], showStatusIcon: true, showForNewQuote: false },
  { id: 'rating', label: 'Rating', icon: Calculator, roles: ['UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_15'], showStatusIcon: true, showForNewQuote: false },
  { id: 'proposals', label: 'Proposals', icon: FileOutput, roles: ['UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_17'], showStatusIcon: true, showForNewQuote: false },
  { id: 'binding', label: 'Binding', icon: Link2, roles: ['UNDERWRITER', 'MASTER'], workflowSteps: ['STEP_18'], showStatusIcon: true, showForNewQuote: false },
  { id: 'win-loss', label: 'Win/Loss', icon: Trophy, roles: ['UNDERWRITER', 'MASTER'], showStatusIcon: false, showForNewQuote: false },
  // Cross-role
  { id: 'comms', label: 'Comms', icon: MessageSquare, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], showStatusIcon: false, showForNewQuote: false },
  { id: 'renewal', label: 'Renewal', icon: TrendingUp, roles: ['ASSOCIATE', 'UNDERWRITER', 'MASTER'], showStatusIcon: false, showForNewQuote: false, showOnlyForRenewals: true },
  { id: 'workflow', label: 'Workflow', icon: GitBranch, roles: ['ASSISTANT', 'ASSOCIATE', 'UNDERWRITER', 'MASTER'], showStatusIcon: false, showForNewQuote: false },
];

export function getTabsForRole(role: PersonaRole, isNew: boolean, isRenewal: boolean): WorkspaceTab[] {
  return WORKSPACE_TABS.filter(tab => {
    if (!tab.roles.includes(role)) return false;
    if (isNew && !tab.showForNewQuote) return false;
    if (tab.showOnlyForRenewals && !isRenewal) return false;
    return true;
  });
}

export type TabStatusType = 'complete' | 'in_progress' | 'not_started' | 'blocked' | 'ai_review';

export function getTabStatus(tab: WorkspaceTab, workflow: WorkflowInstance | undefined): TabStatusType {
  if (!workflow || !tab.workflowSteps || tab.workflowSteps.length === 0) return 'not_started';

  const stepStatuses = tab.workflowSteps.map(stepId => {
    const step = workflow.steps.find(s => s.stepId === stepId);
    return step?.status || StepStatus.NOT_STARTED;
  });

  if (stepStatuses.every(s => s === StepStatus.COMPLETE)) return 'complete';
  if (stepStatuses.some(s => s === StepStatus.NEEDS_REVIEW)) return 'ai_review';
  if (stepStatuses.some(s => s === StepStatus.BLOCKED)) return 'blocked';
  if (stepStatuses.some(s => s === StepStatus.IN_PROGRESS || s === StepStatus.AI_PROCESSING)) return 'in_progress';
  return 'not_started';
}

export function getDefaultTab(role: PersonaRole, workflow: WorkflowInstance | undefined, isNew: boolean, isRenewal: boolean): string {
  const tabs = getTabsForRole(role, isNew, isRenewal);
  if (!workflow) return tabs[0]?.id || 'intake';

  const firstIncomplete = tabs.find(tab => {
    if (!tab.showStatusIcon || !tab.workflowSteps) return false;
    const status = getTabStatus(tab, workflow);
    return status !== 'complete';
  });
  return firstIncomplete?.id || tabs[0]?.id || 'intake';
}

export function getDefaultTabForStep(stepId: string): string {
  const map: Record<string, string> = {
    STEP_01: 'intake', STEP_02: 'documents', STEP_03: 'intake',
    STEP_04: 'intake', STEP_05: 'intake', STEP_06: 'intake',
    STEP_07: 'census', STEP_08: 'plan-stack', STEP_09: 'plan-stack',
    STEP_10: 'plan-stack', STEP_11: 'claims', STEP_12: 'risk',
    STEP_13: 'ai-package', STEP_14: 'plan-stack', STEP_15: 'rating',
    STEP_16: 'ai-package', STEP_17: 'proposals', STEP_18: 'binding',
  };
  return map[stepId] || 'intake';
}
