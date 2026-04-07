import { MOCK_RFPS } from '@/data/mockData';
import { MOCK_WORKFLOWS } from '@/data/workflowMockData';
import { StatusBadge, RushBadge, TypeBadge } from '@/components/shared/StatusBadges';
import { QuoteTracker } from '@/components/workflow/QuoteTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuoteHeaderProps {
  rfpId: string;
}

export function QuoteHeader({ rfpId }: QuoteHeaderProps) {
  const navigate = useNavigate();
  const rfp = MOCK_RFPS.find(r => r.id === rfpId);
  const workflow = MOCK_WORKFLOWS.find(w => w.rfpId === rfpId);

  if (!rfp) return null;

  return (
    <div className="space-y-3 border-b border-border pb-4 mb-1">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-mono text-xs text-muted-foreground">#{rfp.caseNumber}</span>
          <h1 className="text-lg font-bold text-foreground truncate">{rfp.groupName}</h1>
          <StatusBadge status={rfp.status} />
          <TypeBadge type={rfp.type} />
          {rfp.isRush && <RushBadge />}
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
          <span>{rfp.tpaCode}</span>
          <span>{rfp.employeeCount} lives</span>
          <span>Eff: {new Date(rfp.effectiveDate).toLocaleDateString()}</span>
          {rfp.assignedUWName && <span>UW: {rfp.assignedUWName}</span>}
        </div>
      </div>

      {/* Pizza Tracker */}
      {workflow && (
        <QuoteTracker workflow={workflow} mode="standard" />
      )}
    </div>
  );
}
