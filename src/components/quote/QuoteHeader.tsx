import { useState } from 'react';
import { MOCK_RFPS } from '@/data/mockData';
import { MOCK_WORKFLOWS } from '@/data/workflowMockData';
import { StatusBadge, RushBadge, TypeBadge } from '@/components/shared/StatusBadges';
import { QuoteTracker } from '@/components/workflow/QuoteTracker';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuoteHeaderProps {
  rfpId: string;
}

export function QuoteHeader({ rfpId }: QuoteHeaderProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const rfp = MOCK_RFPS.find(r => r.id === rfpId);
  const workflow = MOCK_WORKFLOWS.find(w => w.rfpId === rfpId);

  if (!rfp) return null;

  return (
    <div className="space-y-2 border-b border-border pb-3 mb-1">
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

      {/* Condensed tracker: inline progress bar + toggle */}
      {workflow && (
        <div className="space-y-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-3 group hover:bg-muted/30 rounded-md px-2 py-1 -mx-2 transition-colors"
          >
            <Progress value={workflow.overallPercent} className="h-1.5 flex-1" />
            <span className="text-xs font-mono font-medium text-muted-foreground whitespace-nowrap">
              {workflow.overallPercent}%
            </span>
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            }
          </button>

          <div className={cn(
            'overflow-hidden transition-all duration-200',
            expanded ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'
          )}>
            <QuoteTracker workflow={workflow} mode="standard" />
          </div>
        </div>
      )}
    </div>
  );
}