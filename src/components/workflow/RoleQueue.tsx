import { cn } from '@/lib/utils';
import { WorkflowInstance, StepStatus, WorkflowPhase, WORKFLOW_STEP_DEFS, PHASE_COLORS, PHASE_LABELS } from '@/types/workflow';
import { MOCK_TEAM } from '@/data/workflowMockData';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Sparkles, AlertTriangle, ArrowRight, Check, Clock, Eye, Play, Send, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Role = 'ASSISTANT' | 'ASSOCIATE' | 'UNDERWRITER';

interface RoleQueueProps {
  role: Role;
}

function getMyWorkflows(role: Role, workflows: WorkflowInstance[]): WorkflowInstance[] {
  return workflows.filter(wf => {
    if (['won', 'lost', 'declined'].includes(wf.lifecycleState)) return false;
    const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === wf.currentStepId);
    if (!currentDef) return false;
    // Show in queue if current step belongs to this role OR if any step owned by this role is in progress/blocked
    if (currentDef.ownerRole === role || currentDef.ownerRole === 'AI' || currentDef.ownerRole === 'SYSTEM') {
      if (role === 'ASSISTANT' && currentDef.phase === WorkflowPhase.ASSISTANT_INTAKE) return true;
      if (role === 'ASSOCIATE' && currentDef.phase === WorkflowPhase.ASSOCIATE_SETUP) return true;
      if (role === 'UNDERWRITER' && currentDef.phase === WorkflowPhase.UNDERWRITER_RATING) return true;
    }
    return false;
  }).sort((a, b) => {
    // Rush first, then overdue, then by percent
    if (a.isRush && !b.isRush) return -1;
    if (!a.isRush && b.isRush) return 1;
    const aOverdue = a.steps.some(s => s.slaStatus === 'overdue');
    const bOverdue = b.steps.some(s => s.slaStatus === 'overdue');
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return a.overallPercent - b.overallPercent;
  });
}

function getTeamForRole(role: Role) {
  return MOCK_TEAM.filter(m => m.role === role);
}

const ROLE_CONFIG: Record<Role, { label: string; icon: React.ReactNode; phaseColor: string; phaseLabel: string }> = {
  ASSISTANT: { label: 'Assistant Queue', icon: <User className="w-4 h-4" />, phaseColor: 'text-indigo-700', phaseLabel: 'Intake' },
  ASSOCIATE: { label: 'Associate Queue', icon: <User className="w-4 h-4" />, phaseColor: 'text-teal-700', phaseLabel: 'Setup' },
  UNDERWRITER: { label: 'Underwriter Queue', icon: <User className="w-4 h-4" />, phaseColor: 'text-amber-700', phaseLabel: 'Underwriting' },
};

function QueueItem({ workflow, role }: { workflow: WorkflowInstance; role: Role }) {
  const navigate = useNavigate();
  const { completeAndAdvance, unblockStep, handoff } = useWorkflow();
  const [acting, setActing] = useState(false);
  const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === workflow.currentStepId);
  const currentStep = workflow.steps.find(s => s.stepId === workflow.currentStepId);
  if (!currentDef || !currentStep) return null;

  const isBlocked = currentStep.status === StepStatus.BLOCKED;
  const isOverdue = currentStep.slaStatus === 'overdue';
  const isAiStep = currentDef.aiAutomatable;
  const isLastStepInPhase = (role === 'ASSISTANT' && currentDef.sequenceNumber === 6) ||
    (role === 'ASSOCIATE' && currentDef.sequenceNumber === 12);

  const handleComplete = () => {
    setActing(true);
    setTimeout(() => {
      completeAndAdvance(workflow.id, workflow.currentStepId);
      setActing(false);
    }, 400);
  };

  const handleUnblock = () => {
    unblockStep(workflow.id, workflow.currentStepId);
  };

  const handleHandoff = () => {
    setActing(true);
    setTimeout(() => {
      handoff(workflow.id, role === 'ASSISTANT' ? 'associate' : 'underwriter');
      setActing(false);
    }, 400);
  };

  const qsColor = (workflow.quotabilityScore || 0) >= 85 ? 'text-emerald-600' :
    (workflow.quotabilityScore || 0) >= 70 ? 'text-blue-600' :
    (workflow.quotabilityScore || 0) >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className={cn(
      'bg-card border rounded-lg p-4 space-y-3 transition-all',
      isOverdue && 'border-destructive/50 bg-destructive/5',
      isBlocked && 'border-orange-300 bg-orange-50/50',
      !isOverdue && !isBlocked && 'border-border hover:shadow-md'
    )}>
      {/* Header row — quote name prominent */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base text-foreground">{workflow.groupName}</span>
          <span className="text-sm text-muted-foreground font-mono">#{workflow.caseNumber}</span>
          {workflow.isRush && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive border border-destructive/30">⚡ RUSH</span>
          )}
          {isOverdue && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-destructive/15 text-destructive animate-pulse">🔴 OVERDUE</span>
          )}
          {isBlocked && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200">⚠ BLOCKED</span>
          )}
        </div>
        {workflow.quotabilityScore && (
          <span className={cn('text-xs font-mono font-bold', qsColor)}>QS: {workflow.quotabilityScore}</span>
        )}
      </div>

      {/* Next action — secondary styling */}
      <div className="bg-muted/50 rounded-md px-2.5 py-2 flex items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1">
          <ArrowRight className="w-3 h-3 text-primary shrink-0" />
          <span className="text-xs text-muted-foreground">Next:</span>
          <span className="text-xs font-medium text-foreground">{currentDef.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">(Step {currentDef.sequenceNumber})</span>
          {isAiStep && <Sparkles className="w-3 h-3 text-purple-500" />}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{currentDef.slaHours ? `~${currentDef.slaHours}h` : '~1h'}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <User className="w-3 h-3" />
          <span>{currentStep.assignedName || 'Unassigned'}</span>
        </div>
      </div>

      {isBlocked && currentStep.blockedReason && (
        <p className="text-xs text-orange-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {currentStep.blockedReason}
        </p>
      )}

      {/* Progress */}
      <div className="space-y-1">
        <Progress value={workflow.overallPercent} className="h-1.5" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{workflow.overallPercent}% complete</span>
          {workflow.estimatedCompletionAt && (
            <span>Est: {new Date(workflow.estimatedCompletionAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => navigate(`/quote/${workflow.rfpId}?tab=workflow`)}>
          <Eye className="w-3 h-3" /> View Detail
        </Button>

        {isAiStep && !isBlocked && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 gap-1 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={handleComplete}
            disabled={acting}
          >
            <Sparkles className="w-3 h-3" /> AI Review & Complete
          </Button>
        )}

        {isLastStepInPhase && (
          <Button
            size="sm"
            className="text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleHandoff}
            disabled={acting}
          >
            <Send className="w-3 h-3" /> Handoff → {role === 'ASSISTANT' ? 'Associate' : 'UW'}
          </Button>
        )}

        {!isLastStepInPhase && !isBlocked && !isAiStep && (
          <Button
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={handleComplete}
            disabled={acting}
          >
            <Check className="w-3 h-3" /> Complete Step
          </Button>
        )}

        {isBlocked && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 gap-1 border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={handleUnblock}
            disabled={acting}
          >
            <Play className="w-3 h-3" /> Unblock
          </Button>
        )}

        {role === 'UNDERWRITER' && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 gap-1"
            onClick={() => navigate(`/quote/${workflow.rfpId}?tab=ai-package`)}
          >
            <Zap className="w-3 h-3" /> Open UW
          </Button>
        )}
      </div>
    </div>
  );
}

export function RoleQueue({ role }: RoleQueueProps) {
  const config = ROLE_CONFIG[role];
  const { workflows: allWorkflows } = useWorkflow();
  const workflows = getMyWorkflows(role, allWorkflows);
  const team = getTeamForRole(role);

  const blocked = workflows.filter(wf => {
    const step = wf.steps.find(s => s.stepId === wf.currentStepId);
    return step?.status === StepStatus.BLOCKED;
  }).length;
  const overdue = workflows.filter(wf => {
    const step = wf.steps.find(s => s.stepId === wf.currentStepId);
    return step?.slaStatus === 'overdue';
  }).length;
  const rush = workflows.filter(wf => wf.isRush).length;

  return (
    <div className="space-y-4">
      {/* Queue summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{workflows.length}</p>
            <p className="text-xs text-muted-foreground">In Queue</p>
          </CardContent>
        </Card>
        <Card className={rush > 0 ? 'border-destructive/30' : ''}>
          <CardContent className="p-3 text-center">
            <p className={cn('text-2xl font-bold', rush > 0 ? 'text-destructive' : 'text-foreground')}>{rush}</p>
            <p className="text-xs text-muted-foreground">Rush</p>
          </CardContent>
        </Card>
        <Card className={overdue > 0 ? 'border-destructive/30' : ''}>
          <CardContent className="p-3 text-center">
            <p className={cn('text-2xl font-bold', overdue > 0 ? 'text-destructive' : 'text-foreground')}>{overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card className={blocked > 0 ? 'border-orange-200' : ''}>
          <CardContent className="p-3 text-center">
            <p className={cn('text-2xl font-bold', blocked > 0 ? 'text-orange-600' : 'text-foreground')}>{blocked}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Team members */}
      <div className="flex items-center gap-3 flex-wrap">
        {team.map(member => (
          <div key={member.id} className="flex items-center gap-2 bg-muted/40 rounded-full px-3 py-1.5 border border-border">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-foreground">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-xs font-medium text-foreground">{member.name}</span>
            <span className={cn('text-[10px] font-mono', member.onTarget ? 'text-emerald-600' : 'text-warning')}>
              {member.activeCount} active
            </span>
          </div>
        ))}
      </div>

      {/* Queue items */}
      {workflows.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
          <p className="font-medium">Queue is clear!</p>
          <p className="text-sm">No active items in the {config.phaseLabel} queue</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {workflows.map(wf => (
            <QueueItem key={wf.id} workflow={wf} role={role} />
          ))}
        </div>
      )}
    </div>
  );
}
