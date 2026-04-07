import { useWorkflow } from '@/contexts/WorkflowContext';
import { WORKFLOW_STEP_DEFS, StepStatus, WorkflowPhase } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, ArrowRight, Sparkles, Play, Send, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'react-router-dom';
import { getDefaultTabForStep } from '@/config/tabConfig';

interface StepActionBannerProps {
  rfpId: string;
  /** Which workflow step IDs this tab handles */
  tabStepIds: string[];
}

export function StepActionBanner({ rfpId, tabStepIds }: StepActionBannerProps) {
  const { getWorkflow, completeAndAdvance, blockStep, unblockStep, handoff } = useWorkflow();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBlockInput, setShowBlockInput] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  const workflow = getWorkflow(rfpId);
  if (!workflow) return null;

  // Find the active step for this tab
  const activeStepId = tabStepIds.find(sid => sid === workflow.currentStepId);
  if (!activeStepId) {
    // Check if all tab steps are complete
    const allComplete = tabStepIds.every(sid => {
      const step = workflow.steps.find(s => s.stepId === sid);
      return step?.status === StepStatus.COMPLETE;
    });
    if (allComplete && tabStepIds.length > 0) {
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center gap-3 mb-4">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800">All steps for this section are complete.</p>
        </div>
      );
    }
    return null;
  }

  const stepDef = WORKFLOW_STEP_DEFS.find(d => d.id === activeStepId);
  const stepInstance = workflow.steps.find(s => s.stepId === activeStepId);
  if (!stepDef || !stepInstance) return null;

  const isBlocked = stepInstance.status === StepStatus.BLOCKED;
  const isOverdue = stepInstance.slaStatus === 'overdue';
  const isAi = stepDef.aiAutomatable;

  // Check if this is the last step in the phase (handoff point)
  const isLastInPhase =
    (stepDef.phase === WorkflowPhase.ASSISTANT_INTAKE && stepDef.sequenceNumber === 6) ||
    (stepDef.phase === WorkflowPhase.ASSOCIATE_SETUP && stepDef.sequenceNumber === 12);

  const handleComplete = () => {
    completeAndAdvance(workflow.id, activeStepId);
  };

  const handleBlock = () => {
    if (blockReason.trim()) {
      blockStep(workflow.id, activeStepId, blockReason.trim());
      setShowBlockInput(false);
      setBlockReason('');
    }
  };

  const handleUnblock = () => {
    unblockStep(workflow.id, activeStepId);
  };

  const handleHandoff = () => {
    if (stepDef.phase === WorkflowPhase.ASSISTANT_INTAKE) {
      handoff(workflow.id, 'associate');
    } else if (stepDef.phase === WorkflowPhase.ASSOCIATE_SETUP) {
      handoff(workflow.id, 'underwriter');
    }
  };

  return (
    <div className={cn(
      'rounded-lg px-4 py-3 mb-4 border',
      isBlocked ? 'bg-orange-50 border-orange-200' :
      isOverdue ? 'bg-destructive/5 border-destructive/30' :
      'bg-primary/5 border-primary/20'
    )}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <ArrowRight className={cn('w-4 h-4 shrink-0', isBlocked ? 'text-orange-600' : 'text-primary')} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">
                Step {stepDef.sequenceNumber}: {stepDef.shortName}
              </span>
              {isAi && <Sparkles className="w-3.5 h-3.5 text-purple-500" />}
              {isOverdue && (
                <Badge variant="destructive" className="text-[10px] h-5 animate-pulse">OVERDUE</Badge>
              )}
              {isBlocked && (
                <Badge variant="outline" className="text-[10px] h-5 border-orange-300 text-orange-700 bg-orange-100">BLOCKED</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{stepDef.description}</p>
            {isBlocked && stepInstance.blockedReason && (
              <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {stepInstance.blockedReason}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {stepDef.slaHours > 0 && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{stepDef.slaHours}h SLA
            </span>
          )}

          {isBlocked ? (
            <Button size="sm" variant="outline" className="text-xs h-7 gap-1 border-orange-200 text-orange-700 hover:bg-orange-50" onClick={handleUnblock}>
              <Play className="w-3 h-3" /> Unblock
            </Button>
          ) : (
            <>
              {!showBlockInput && (
                <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => setShowBlockInput(true)}>
                  <AlertTriangle className="w-3 h-3 mr-1" /> Block
                </Button>
              )}

              {isLastInPhase ? (
                <Button size="sm" className="text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleHandoff}>
                  <Send className="w-3 h-3" />
                  Handoff → {stepDef.phase === WorkflowPhase.ASSISTANT_INTAKE ? 'Associate' : 'UW'}
                </Button>
              ) : (
                <Button size="sm" className="text-xs h-7 gap-1" onClick={handleComplete}>
                  <Check className="w-3 h-3" /> Complete Step
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {showBlockInput && !isBlocked && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Input
            placeholder="Reason for blocking..."
            className="text-xs h-7 flex-1"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBlock()}
            autoFocus
          />
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleBlock}>Confirm Block</Button>
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => { setShowBlockInput(false); setBlockReason(''); }}>Cancel</Button>
        </div>
      )}
    </div>
  );
}
