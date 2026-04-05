import { RFPStatus, CensusReadyStatus, SetupTaskStatus, STATUS_LABELS, CENSUS_STATUS_LABELS, SETUP_STATUS_LABELS } from '@/types/sleq';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const statusColorMap: Record<RFPStatus, string> = {
  [RFPStatus.DRAFT]: 'bg-muted text-muted-foreground',
  [RFPStatus.INTAKE]: 'bg-info/15 text-info border border-info/30',
  [RFPStatus.SETUP]: 'bg-warning/15 text-warning border border-warning/30',
  [RFPStatus.READY_FOR_UW]: 'bg-success/15 text-success border border-success/30',
  [RFPStatus.IN_UNDERWRITING]: 'bg-primary/15 text-primary border border-primary/30',
  [RFPStatus.QUOTED]: 'bg-purple-100 text-purple-700 border border-purple-200',
  [RFPStatus.PROPOSAL_SENT]: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  [RFPStatus.WON]: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  [RFPStatus.LOST]: 'bg-destructive/15 text-destructive border border-destructive/30',
  [RFPStatus.DECLINED]: 'bg-muted text-muted-foreground border border-border',
  [RFPStatus.REACTIVATED]: 'bg-amber-100 text-amber-700 border border-amber-200',
};

export function StatusBadge({ status }: { status: RFPStatus }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", statusColorMap[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const censusColorMap: Record<CensusReadyStatus, string> = {
  [CensusReadyStatus.WAITING]: 'bg-destructive',
  [CensusReadyStatus.MEMBER_CENSUS]: 'bg-warning',
  [CensusReadyStatus.EMPLOYEE_CENSUS]: 'bg-warning',
  [CensusReadyStatus.EXPERIENCE]: 'bg-warning',
  [CensusReadyStatus.APPS]: 'bg-warning',
  [CensusReadyStatus.SENT_BACK]: 'bg-destructive',
  [CensusReadyStatus.READY]: 'bg-success',
};

export function CensusStatusPill({ status }: { status: CensusReadyStatus }) {
  return (
    <span className={cn("w-2.5 h-2.5 rounded-full inline-block", censusColorMap[status])} title={CENSUS_STATUS_LABELS[status]} />
  );
}

const setupColorMap: Record<SetupTaskStatus, string> = {
  [SetupTaskStatus.NOT_STARTED]: 'bg-destructive',
  [SetupTaskStatus.RECEIVED]: 'bg-warning',
  [SetupTaskStatus.ENTERED]: 'bg-info',
  [SetupTaskStatus.VERIFIED]: 'bg-success',
};

export function SetupStatusPill({ status }: { status: SetupTaskStatus }) {
  return (
    <span className={cn("w-2.5 h-2.5 rounded-full inline-block", setupColorMap[status])} title={SETUP_STATUS_LABELS[status]} />
  );
}

export function RushBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/15 text-destructive border border-destructive/30">
      ⚡ RUSH
    </span>
  );
}

export function DuplicateBadge({ caseNumber }: { caseNumber?: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
      🔗 {caseNumber ? `#${caseNumber}` : 'DUP'}
    </span>
  );
}

export function AIBadge({ confidence }: { confidence?: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-ai-bg text-amber-700 border border-amber-200" title={confidence ? `AI Confidence: ${Math.round(confidence * 100)}%` : 'AI Populated'}>
      ✨ AI {confidence ? `${Math.round(confidence * 100)}%` : ''}
    </span>
  );
}

export function TypeBadge({ type }: { type: 'NEW' | 'RENEWAL' }) {
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
      type === 'RENEWAL' ? 'bg-info/15 text-info border border-info/30' : 'bg-muted text-muted-foreground'
    )}>
      {type}
    </span>
  );
}
