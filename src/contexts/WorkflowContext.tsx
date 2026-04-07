import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { WorkflowInstance, WorkflowStepInstance, StepStatus, WORKFLOW_STEP_DEFS, WorkflowPhase } from '@/types/workflow';
import { MOCK_WORKFLOWS } from '@/data/workflowMockData';
import { toast } from 'sonner';

interface CreateWorkflowInput {
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
}

interface WorkflowContextType {
  workflows: WorkflowInstance[];
  getWorkflow: (rfpId: string) => WorkflowInstance | undefined;
  createWorkflow: (input: CreateWorkflowInput) => WorkflowInstance;
  completeStep: (workflowId: string, stepId: string) => void;
  advanceToNextStep: (workflowId: string) => void;
  blockStep: (workflowId: string, stepId: string, reason: string) => void;
  unblockStep: (workflowId: string, stepId: string) => void;
  completeAndAdvance: (workflowId: string, stepId: string) => void;
  handoff: (workflowId: string, toPhase: 'associate' | 'underwriter') => void;
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be used within WorkflowProvider');
  return ctx;
}

function getNextStepId(currentStepId: string): string | null {
  const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === currentStepId);
  if (!currentDef) return null;
  const nextSeq = currentDef.sequenceNumber + 1;
  const nextDef = WORKFLOW_STEP_DEFS.find(d => d.sequenceNumber === nextSeq);
  return nextDef?.id || null;
}

function phaseFromStep(stepId: string): WorkflowPhase {
  const def = WORKFLOW_STEP_DEFS.find(d => d.id === stepId);
  if (!def) return WorkflowPhase.ASSISTANT_INTAKE;
  return def.phase;
}

function calcPercent(steps: WorkflowStepInstance[]): number {
  const weights = [8, 5, 3, 2, 2, 5, 12, 8, 8, 10, 7, 5, 3, 10, 8, 5, 5, 4];
  let total = 0;
  steps.forEach((s, i) => {
    if (s.status === StepStatus.COMPLETE) total += (weights[i] || 0);
  });
  return total;
}

function lifecycleFromPhase(phase: WorkflowPhase, allComplete: boolean): string {
  if (allComplete) return 'won';
  switch (phase) {
    case WorkflowPhase.ASSISTANT_INTAKE: return 'intake';
    case WorkflowPhase.ASSOCIATE_SETUP: return 'setup';
    case WorkflowPhase.UNDERWRITER_RATING: return 'underwriting';
  }
}

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>(() =>
    JSON.parse(JSON.stringify(MOCK_WORKFLOWS)) // deep clone
  );

  const getWorkflow = useCallback((rfpId: string) => {
    return workflows.find(w => w.rfpId === rfpId);
  }, [workflows]);

  const createWorkflow = useCallback((input: CreateWorkflowInput): WorkflowInstance => {
    const wfId = `wf-${Date.now()}`;
    const steps: WorkflowStepInstance[] = WORKFLOW_STEP_DEFS.map((def, i) => ({
      stepId: def.id,
      status: i === 0 ? StepStatus.IN_PROGRESS : StepStatus.NOT_STARTED,
      slaStatus: 'on_track' as const,
      aiCompleted: false,
      startedAt: i === 0 ? new Date().toISOString() : undefined,
    }));

    const wf: WorkflowInstance = {
      id: wfId,
      rfpId: input.rfpId,
      groupName: input.groupName,
      caseNumber: input.caseNumber,
      tpaCode: input.tpaCode,
      tpaName: input.tpaName,
      producerName: input.producerName,
      employeeCount: input.employeeCount,
      effectiveDate: input.effectiveDate,
      type: input.type,
      isRush: input.isRush,
      currentPhase: WorkflowPhase.ASSISTANT_INTAKE,
      currentStepId: 'STEP_01',
      overallPercent: 0,
      lifecycleState: 'intake',
      steps,
      startedAt: new Date().toISOString(),
    };

    setWorkflows(prev => [wf, ...prev]);
    return wf;
  }, []);

  const updateWorkflow = useCallback((workflowId: string, updater: (wf: WorkflowInstance) => WorkflowInstance) => {
    setWorkflows(prev => prev.map(wf => wf.id === workflowId ? updater({ ...wf, steps: wf.steps.map(s => ({ ...s })) }) : wf));
  }, []);

  const completeStep = useCallback((workflowId: string, stepId: string) => {
    updateWorkflow(workflowId, (wf) => {
      const stepIdx = wf.steps.findIndex(s => s.stepId === stepId);
      if (stepIdx >= 0) {
        wf.steps[stepIdx].status = StepStatus.COMPLETE;
        wf.steps[stepIdx].completedAt = new Date().toISOString();
        wf.steps[stepIdx].slaStatus = 'on_track';
      }
      wf.overallPercent = calcPercent(wf.steps);
      return wf;
    });
  }, [updateWorkflow]);

  const advanceToNextStep = useCallback((workflowId: string) => {
    updateWorkflow(workflowId, (wf) => {
      const nextId = getNextStepId(wf.currentStepId);
      if (nextId) {
        wf.currentStepId = nextId;
        wf.currentPhase = phaseFromStep(nextId);
        wf.lifecycleState = lifecycleFromPhase(phaseFromStep(nextId), false);
        const nextStep = wf.steps.find(s => s.stepId === nextId);
        if (nextStep && nextStep.status === StepStatus.NOT_STARTED) {
          nextStep.status = StepStatus.IN_PROGRESS;
          nextStep.startedAt = new Date().toISOString();
        }
      } else {
        // All steps done
        wf.lifecycleState = 'quoted';
      }
      return wf;
    });
  }, [updateWorkflow]);

  const completeAndAdvance = useCallback((workflowId: string, stepId: string) => {
    updateWorkflow(workflowId, (wf) => {
      // Complete the step
      const stepIdx = wf.steps.findIndex(s => s.stepId === stepId);
      if (stepIdx >= 0) {
        wf.steps[stepIdx].status = StepStatus.COMPLETE;
        wf.steps[stepIdx].completedAt = new Date().toISOString();
        wf.steps[stepIdx].slaStatus = 'on_track';
      }
      wf.overallPercent = calcPercent(wf.steps);

      // Advance
      const nextId = getNextStepId(wf.currentStepId);
      if (nextId) {
        wf.currentStepId = nextId;
        wf.currentPhase = phaseFromStep(nextId);
        wf.lifecycleState = lifecycleFromPhase(phaseFromStep(nextId), false);
        const nextStep = wf.steps.find(s => s.stepId === nextId);
        if (nextStep && nextStep.status === StepStatus.NOT_STARTED) {
          nextStep.status = StepStatus.IN_PROGRESS;
          nextStep.startedAt = new Date().toISOString();
        }
      } else {
        wf.lifecycleState = 'quoted';
      }
      return wf;
    });
    const wf = workflows.find(w => w.id === workflowId);
    const stepDef = WORKFLOW_STEP_DEFS.find(d => d.id === stepId);
    toast.success(`Step "${stepDef?.shortName}" completed for ${wf?.groupName || 'quote'}`);
  }, [updateWorkflow, workflows]);

  const blockStep = useCallback((workflowId: string, stepId: string, reason: string) => {
    updateWorkflow(workflowId, (wf) => {
      const step = wf.steps.find(s => s.stepId === stepId);
      if (step) {
        step.status = StepStatus.BLOCKED;
        step.blockedReason = reason;
      }
      return wf;
    });
    toast.warning('Step marked as blocked');
  }, [updateWorkflow]);

  const unblockStep = useCallback((workflowId: string, stepId: string) => {
    updateWorkflow(workflowId, (wf) => {
      const step = wf.steps.find(s => s.stepId === stepId);
      if (step) {
        step.status = StepStatus.IN_PROGRESS;
        step.blockedReason = undefined;
        step.slaStatus = 'on_track';
      }
      return wf;
    });
    toast.success('Step unblocked');
  }, [updateWorkflow]);

  const handoff = useCallback((workflowId: string, toPhase: 'associate' | 'underwriter') => {
    updateWorkflow(workflowId, (wf) => {
      // Complete all remaining steps in the current phase
      const currentPhaseDef = toPhase === 'associate' ? WorkflowPhase.ASSISTANT_INTAKE : WorkflowPhase.ASSOCIATE_SETUP;
      WORKFLOW_STEP_DEFS.filter(d => d.phase === currentPhaseDef).forEach(def => {
        const step = wf.steps.find(s => s.stepId === def.id);
        if (step && step.status !== StepStatus.COMPLETE) {
          step.status = StepStatus.COMPLETE;
          step.completedAt = new Date().toISOString();
        }
      });

      // Advance to first step of next phase
      const nextPhase = toPhase === 'associate' ? WorkflowPhase.ASSOCIATE_SETUP : WorkflowPhase.UNDERWRITER_RATING;
      const firstNextStep = WORKFLOW_STEP_DEFS.find(d => d.phase === nextPhase);
      if (firstNextStep) {
        wf.currentStepId = firstNextStep.id;
        wf.currentPhase = nextPhase;
        wf.lifecycleState = lifecycleFromPhase(nextPhase, false);
        const step = wf.steps.find(s => s.stepId === firstNextStep.id);
        if (step && step.status === StepStatus.NOT_STARTED) {
          step.status = StepStatus.IN_PROGRESS;
          step.startedAt = new Date().toISOString();
        }
      }
      wf.overallPercent = calcPercent(wf.steps);
      return wf;
    });
    toast.success(`Handed off to ${toPhase === 'associate' ? 'Associate' : 'Underwriter'}`);
  }, [updateWorkflow]);

  return (
    <WorkflowContext.Provider value={{
      workflows,
      getWorkflow,
      createWorkflow,
      completeStep,
      advanceToNextStep,
      blockStep,
      unblockStep,
      completeAndAdvance,
      handoff,
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}
