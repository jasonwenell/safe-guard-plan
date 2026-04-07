import { MOCK_WORKFLOWS } from '@/data/workflowMockData';
import { ExpandedTracker } from '@/components/workflow/ExpandedTracker';

interface WorkflowTabProps {
  rfpId?: string;
}

export function WorkflowTab({ rfpId }: WorkflowTabProps) {
  const workflow = MOCK_WORKFLOWS.find(w => w.rfpId === rfpId);

  if (!workflow) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No workflow data available for this quote.</p>
      </div>
    );
  }

  return <ExpandedTracker workflow={workflow} />;
}
