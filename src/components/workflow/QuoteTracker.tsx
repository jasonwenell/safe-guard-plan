import { cn } from '@/lib/utils';
import { WorkflowInstance, WorkflowStepInstance, StepStatus, WorkflowPhase, WORKFLOW_STEP_DEFS, PHASE_COLORS, PHASE_LABELS } from '@/types/workflow';
import { Sparkles, AlertTriangle, Ban, Clock, User, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface QuoteTrackerProps {
  workflow: WorkflowInstance;
  mode: 'compact' | 'standard' | 'expanded';
  onViewDetail?: () => void;
}

function StepDot({ step, def }: { step: WorkflowStepInstance; def: typeof WORKFLOW_STEP_DEFS[0] }) {
  const phase = def.phase;
  const colors = PHASE_COLORS[phase];

  let dotClass = 'bg-muted border-2 border-border'; // not started
  let icon = null;
  let pulse = false;

  if (step.status === StepStatus.COMPLETE) {
    dotClass = step.aiCompleted ? 'bg-purple-500 border-2 border-purple-300' : `${colors.dot} border-2 border-transparent`;
    if (step.aiCompleted) icon = <Sparkles className="w-2.5 h-2.5 text-white" />;
  } else if (step.status === StepStatus.IN_PROGRESS) {
    dotClass = `${colors.dot} border-2 border-transparent opacity-80`;
    pulse = true;
  } else if (step.status === StepStatus.BLOCKED) {
    dotClass = 'bg-orange-500 border-2 border-orange-300';
    icon = <AlertTriangle className="w-2.5 h-2.5 text-white" />;
  } else if (step.status === StepStatus.SKIPPED) {
    dotClass = 'bg-muted border-2 border-border';
    icon = <Ban className="w-2.5 h-2.5 text-muted-foreground" />;
  } else if (step.status === StepStatus.AI_PROCESSING || step.status === StepStatus.NEEDS_REVIEW) {
    dotClass = 'bg-purple-400 border-2 border-purple-200';
    pulse = true;
    icon = <Sparkles className="w-2.5 h-2.5 text-white" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all',
          dotClass,
          pulse && 'animate-pulse'
        )}>
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs max-w-[200px]">
        <p className="font-medium">{def.name}</p>
        <p className="text-muted-foreground capitalize">{step.status.replace(/_/g, ' ')}</p>
        {step.aiCompleted && <p className="text-purple-600">✨ AI completed ({Math.round((step.aiConfidence || 0) * 100)}%)</p>}
        {step.blockedReason && <p className="text-orange-600">{step.blockedReason}</p>}
      </TooltipContent>
    </Tooltip>
  );
}

function CompactTracker({ workflow }: { workflow: WorkflowInstance }) {
  const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === workflow.currentStepId);
  const currentStep = workflow.steps.find(s => s.stepId === workflow.currentStepId);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {workflow.steps.map((step, i) => {
          const def = WORKFLOW_STEP_DEFS[i];
          const isPhaseStart = i === 0 || def.phase !== WORKFLOW_STEP_DEFS[i - 1].phase;
          return (
            <div key={step.stepId} className={cn('flex items-center', isPhaseStart && i > 0 && 'ml-1')}>
              <StepDot step={step} def={def} />
              {i < 17 && <div className={cn(
                'w-1.5 h-0.5',
                step.status === StepStatus.COMPLETE ? PHASE_COLORS[def.phase].dot : 'bg-border'
              )} />}
            </div>
          );
        })}
      </div>
      <span className="text-xs font-mono font-medium text-muted-foreground ml-1">{workflow.overallPercent}%</span>
      {currentStep && currentDef && (
        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
          {currentStep.assignedName} → {currentDef.shortName}
        </span>
      )}
    </div>
  );
}

function StandardTracker({ workflow, onViewDetail }: { workflow: WorkflowInstance; onViewDetail?: () => void }) {
  const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === workflow.currentStepId);
  const currentStep = workflow.steps.find(s => s.stepId === workflow.currentStepId);
  const phases = [WorkflowPhase.ASSISTANT_INTAKE, WorkflowPhase.ASSOCIATE_SETUP, WorkflowPhase.UNDERWRITER_RATING];

  const qsColor = (workflow.quotabilityScore || 0) >= 85 ? 'text-emerald-600' :
    (workflow.quotabilityScore || 0) >= 70 ? 'text-blue-600' :
    (workflow.quotabilityScore || 0) >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer" onClick={onViewDetail}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-foreground">{workflow.groupName}</span>
          <span className="text-xs text-muted-foreground">#{workflow.caseNumber}</span>
          {workflow.isRush && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">⚡ RUSH</span>
          )}
        </div>
        {workflow.quotabilityScore && (
          <span className={cn('text-xs font-mono font-bold', qsColor)}>QS: {workflow.quotabilityScore}</span>
        )}
      </div>

      <div className="text-xs text-muted-foreground flex gap-3">
        <span>{workflow.tpaCode}</span>
        <span>{workflow.employeeCount} lives</span>
        <span>Eff: {new Date(workflow.effectiveDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
        <span className={workflow.type === 'RENEWAL' ? 'text-info' : ''}>{workflow.type}</span>
      </div>

      {/* Phase tracker */}
      <div className="flex gap-1">
        {phases.map(phase => {
          const phaseSteps = workflow.steps.filter((_, i) => WORKFLOW_STEP_DEFS[i].phase === phase);
          const phaseDefs = WORKFLOW_STEP_DEFS.filter(d => d.phase === phase);
          const colors = PHASE_COLORS[phase];
          const allComplete = phaseSteps.every(s => s.status === StepStatus.COMPLETE);
          const anyActive = phaseSteps.some(s => [StepStatus.IN_PROGRESS, StepStatus.AI_PROCESSING, StepStatus.NEEDS_REVIEW, StepStatus.BLOCKED].includes(s.status));

          return (
            <div key={phase} className={cn('flex-1 rounded-md p-2 border', colors.border, colors.bg)}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', colors.text)}>{PHASE_LABELS[phase]}</span>
                {allComplete && <span className="text-[10px] text-emerald-600 font-medium">✅</span>}
                {anyActive && !allComplete && <span className="text-[10px] font-medium">⏳</span>}
              </div>
              <div className="flex items-center gap-0.5">
                {phaseSteps.map((step, i) => (
                  <div key={step.stepId} className="flex items-center">
                    <StepDot step={step} def={phaseDefs[i]} />
                    {i < phaseSteps.length - 1 && <div className={cn(
                      'w-1 h-0.5',
                      step.status === StepStatus.COMPLETE ? colors.dot : 'bg-border'
                    )} />}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <Progress value={workflow.overallPercent} className="h-2" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{workflow.overallPercent}% Complete</span>
          {workflow.estimatedCompletionAt && (
            <span className="text-muted-foreground">Est: {new Date(workflow.estimatedCompletionAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Current status */}
      {currentDef && currentStep && (
        <div className="flex items-center gap-4 text-xs bg-muted/50 rounded-md p-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-foreground font-medium">Step {currentDef.sequenceNumber}: {currentDef.shortName}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{currentStep.assignedName}</span>
          </div>
          {currentStep.status === StepStatus.BLOCKED && (
            <span className="text-orange-600 font-medium">⚠ Blocked</span>
          )}
          {currentStep.slaStatus === 'overdue' && (
            <span className="text-destructive font-medium animate-pulse">🔴 Overdue</span>
          )}
          <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto" />
        </div>
      )}
    </div>
  );
}

export function QuoteTracker({ workflow, mode, onViewDetail }: QuoteTrackerProps) {
  if (mode === 'compact') return <CompactTracker workflow={workflow} />;
  return <StandardTracker workflow={workflow} onViewDetail={onViewDetail} />;
}
