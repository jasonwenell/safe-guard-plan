import { useWorkflow } from '@/contexts/WorkflowContext';
import { ExpandedTracker } from '@/components/workflow/ExpandedTracker';

interface WorkflowTabProps {
  rfpId?: string;
}

export function WorkflowTab({ rfpId }: WorkflowTabProps) {
  const { getWorkflow } = useWorkflow();
  const workflow = rfpId ? getWorkflow(rfpId) : undefined;

  if (!workflow) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No workflow data available for this quote.</p>
      </div>
    );
  }

  return <ExpandedTracker workflow={workflow} />;
}
