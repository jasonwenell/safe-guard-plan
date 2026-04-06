import { cn } from '@/lib/utils';
import { WorkflowInstance, StepStatus, WorkflowPhase, WORKFLOW_STEP_DEFS, PHASE_COLORS, PHASE_LABELS } from '@/types/workflow';
import { Sparkles, AlertTriangle, Check, Clock, User, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface ExpandedTrackerProps {
  workflow: WorkflowInstance;
}

export function ExpandedTracker({ workflow }: ExpandedTrackerProps) {
  const [expandedPhases, setExpandedPhases] = useState<WorkflowPhase[]>([
    WorkflowPhase.ASSISTANT_INTAKE,
    WorkflowPhase.ASSOCIATE_SETUP,
    WorkflowPhase.UNDERWRITER_RATING,
  ]);

  const phases = [WorkflowPhase.ASSISTANT_INTAKE, WorkflowPhase.ASSOCIATE_SETUP, WorkflowPhase.UNDERWRITER_RATING];
  const handoffPoints = [6, 12]; // After step 6 and 12

  const togglePhase = (phase: WorkflowPhase) => {
    setExpandedPhases(prev =>
      prev.includes(phase) ? prev.filter(p => p !== phase) : [...prev, phase]
    );
  };

  const qsColor = (workflow.quotabilityScore || 0) >= 85 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    (workflow.quotabilityScore || 0) >= 70 ? 'bg-blue-100 text-blue-700 border-blue-200' :
    (workflow.quotabilityScore || 0) >= 50 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{workflow.groupName}</h2>
            <p className="text-sm text-muted-foreground">
              Case #{workflow.caseNumber} · {workflow.tpaCode} · {workflow.producerName} · {workflow.employeeCount} lives
            </p>
          </div>
          <div className="flex items-center gap-2">
            {workflow.isRush && (
              <Badge variant="destructive" className="text-xs">⚡ RUSH</Badge>
            )}
            {workflow.quotabilityScore && (
              <span className={cn('text-xs font-mono font-bold px-2 py-1 rounded border', qsColor)}>
                QS: {workflow.quotabilityScore}
              </span>
            )}
            <Badge variant="outline" className="capitalize text-xs">{workflow.lifecycleState}</Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-mono font-bold text-foreground">{workflow.overallPercent}%</span>
          </div>
          <Progress value={workflow.overallPercent} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started: {new Date(workflow.startedAt).toLocaleDateString()}</span>
            {workflow.estimatedCompletionAt && (
              <span>Est. Completion: {new Date(workflow.estimatedCompletionAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {phases.map((phase, phaseIdx) => {
        const colors = PHASE_COLORS[phase];
        const phaseDefs = WORKFLOW_STEP_DEFS.filter(d => d.phase === phase);
        const phaseSteps = phaseDefs.map(def => {
          const idx = WORKFLOW_STEP_DEFS.findIndex(d => d.id === def.id);
          return workflow.steps[idx];
        });
        const allComplete = phaseSteps.every(s => s.status === StepStatus.COMPLETE);
        const anyActive = phaseSteps.some(s => [StepStatus.IN_PROGRESS, StepStatus.AI_PROCESSING, StepStatus.NEEDS_REVIEW, StepStatus.BLOCKED].includes(s.status));
        const isExpanded = expandedPhases.includes(phase);

        return (
          <div key={phase}>
            <div className={cn('border rounded-lg overflow-hidden', colors.border)}>
              {/* Phase header */}
              <button
                onClick={() => togglePhase(phase)}
                className={cn('w-full flex items-center justify-between p-3', colors.bg)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className={cn('text-sm font-bold uppercase tracking-wider', colors.text)}>
                    Phase {phaseIdx + 1}: {PHASE_LABELS[phase]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({phaseDefs[0].ownerRole === 'ASSISTANT' ? 'Assistant' : phaseDefs[0].ownerRole === 'ASSOCIATE' ? 'Associate' : 'Underwriter'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {allComplete && <span className="text-xs font-medium text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> COMPLETE</span>}
                  {anyActive && !allComplete && <span className="text-xs font-medium text-blue-600">⏳ IN PROGRESS</span>}
                  {!anyActive && !allComplete && <span className="text-xs font-medium text-muted-foreground">○ NOT STARTED</span>}
                  <span className="text-xs text-muted-foreground">
                    {phaseSteps.filter(s => s.status === StepStatus.COMPLETE).length}/{phaseSteps.length}
                  </span>
                </div>
              </button>

              {/* Steps */}
              {isExpanded && (
                <div className="p-3 space-y-1">
                  {phaseDefs.map((def, i) => {
                    const step = phaseSteps[i];
                    const isComplete = step.status === StepStatus.COMPLETE;
                    const isActive = [StepStatus.IN_PROGRESS, StepStatus.AI_PROCESSING, StepStatus.NEEDS_REVIEW].includes(step.status);
                    const isBlocked = step.status === StepStatus.BLOCKED;

                    return (
                      <div key={def.id} className={cn(
                        'flex items-start gap-3 p-3 rounded-md transition-colors',
                        isActive && 'bg-blue-50 border border-blue-100',
                        isBlocked && 'bg-orange-50 border border-orange-100',
                        isComplete && 'bg-muted/30'
                      )}>
                        {/* Status icon */}
                        <div className="mt-0.5 shrink-0">
                          {isComplete && step.aiCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : isComplete ? (
                            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', colors.dot)}>
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : isActive ? (
                            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center animate-pulse', colors.dot, 'opacity-80')}>
                              <Clock className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : isBlocked ? (
                            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-border bg-muted" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-sm font-medium', isComplete ? 'text-foreground' : isActive ? 'text-foreground' : 'text-muted-foreground')}>
                              {def.sequenceNumber}. {def.name}
                            </span>
                            {step.aiCompleted && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                                ✨ AI {Math.round((step.aiConfidence || 0) * 100)}%
                              </span>
                            )}
                            {step.slaStatus === 'overdue' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive animate-pulse">OVERDUE</span>
                            )}
                            {step.slaStatus === 'at_risk' && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-warning/15 text-warning">AT RISK</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            {step.assignedName && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {step.assignedName}
                              </span>
                            )}
                            {step.completedAt && (
                              <span>Completed {new Date(step.completedAt).toLocaleDateString()}</span>
                            )}
                            {step.durationMinutes != null && isComplete && (
                              <span>{step.durationMinutes < 60 ? `${step.durationMinutes} min` : `${Math.round(step.durationMinutes / 60 * 10) / 10}h`}</span>
                            )}
                            {!isComplete && !isActive && !isBlocked && def.slaHours > 0 && (
                              <span>SLA: {def.slaHours}h</span>
                            )}
                          </div>

                          {isBlocked && step.blockedReason && (
                            <p className="text-xs text-orange-600 mt-1">⚠ {step.blockedReason}</p>
                          )}
                          {step.notes && isComplete && (
                            <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Handoff indicator */}
            {handoffPoints.includes(phaseDefs[phaseDefs.length - 1].sequenceNumber) && phaseIdx < 2 && (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full border border-border">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Handoff → {phaseIdx === 0 ? 'Associate' : 'Underwriter'}
                  </span>
                  {allComplete && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
