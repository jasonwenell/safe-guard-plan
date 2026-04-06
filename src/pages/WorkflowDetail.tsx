import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKFLOWS } from '@/data/workflowMockData';
import { ExpandedTracker } from '@/components/workflow/ExpandedTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function WorkflowDetail() {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const workflow = MOCK_WORKFLOWS.find(w => w.rfpId === rfpId);

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Workflow not found</p>
        <Button variant="outline" onClick={() => navigate('/pipeline')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pipeline
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/pipeline')} className="gap-1">
        <ArrowLeft className="w-4 h-4" /> Pipeline
      </Button>
      <ExpandedTracker workflow={workflow} />
    </div>
  );
}
