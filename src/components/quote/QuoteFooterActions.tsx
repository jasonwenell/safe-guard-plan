import { Button } from '@/components/ui/button';
import { PersonaRole } from '@/contexts/PersonaContext';
import { WorkflowInstance, WorkflowPhase, WORKFLOW_STEP_DEFS, StepStatus } from '@/types/workflow';
import { Save, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteFooterActionsProps {
  role: PersonaRole;
  workflow?: WorkflowInstance;
}

export function QuoteFooterActions({ role, workflow }: QuoteFooterActionsProps) {
  const intakeComplete = workflow?.steps
    .filter(s => WORKFLOW_STEP_DEFS.find(d => d.id === s.stepId)?.phase === WorkflowPhase.ASSISTANT_INTAKE)
    .every(s => s.status === StepStatus.COMPLETE) ?? false;

  const setupComplete = workflow?.steps
    .filter(s => WORKFLOW_STEP_DEFS.find(d => d.id === s.stepId)?.phase === WorkflowPhase.ASSOCIATE_SETUP)
    .every(s => s.status === StepStatus.COMPLETE) ?? false;

  return (
    <div className="sticky bottom-0 bg-background border-t border-border py-3 flex items-center gap-3 mt-4">
      <Button variant="outline" className="gap-1.5" onClick={() => toast.success('Draft saved')}>
        <Save className="w-4 h-4" /> Save
      </Button>

      {role === 'ASSISTANT' && (
        <Button
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          disabled={!intakeComplete}
          onClick={() => toast.success('Handed off to Associate')}
        >
          <Send className="w-4 h-4" /> Hand Off to Associate →
        </Button>
      )}

      {role === 'ASSOCIATE' && (
        <Button
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
          disabled={!setupComplete}
          onClick={() => toast.success('Handed off to Underwriter')}
        >
          <Send className="w-4 h-4" /> Hand Off to Underwriter →
        </Button>
      )}

      {role === 'UNDERWRITER' && (
        <>
          <Button
            variant="outline"
            className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => toast.success('AI Package generation started')}
          >
            <Sparkles className="w-4 h-4" /> Generate AI Package
          </Button>
          <Button
            className="gap-1.5"
            onClick={() => toast.success('Proposal approved and sent')}
          >
            <CheckCircle2 className="w-4 h-4" /> Approve & Send Proposal
          </Button>
        </>
      )}

      {role === 'MASTER' && (
        <span className="text-xs text-muted-foreground ml-2">Admin view — all actions available</span>
      )}
    </div>
  );
}
