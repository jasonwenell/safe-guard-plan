import { RiskFlag, LaserRecommendation, AttentionItem } from '@/types/underwriting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityConfig = {
  HIGH: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'High' },
  MEDIUM: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Medium' },
  LOW: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Low' },
  INFO: { icon: Info, color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-muted', label: 'Info' },
};

export function RiskFlagsPanel({ flags }: { flags: RiskFlag[] }) {
  const counts = {
    HIGH: flags.filter(f => f.severity === 'HIGH').length,
    MEDIUM: flags.filter(f => f.severity === 'MEDIUM').length,
    LOW: flags.filter(f => f.severity === 'LOW').length,
    INFO: flags.filter(f => f.severity === 'INFO').length,
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            Risk Flags
          </CardTitle>
          <div className="flex items-center gap-2 text-xs">
            {counts.HIGH > 0 && <span className="text-red-600 font-semibold">🔴 {counts.HIGH}</span>}
            {counts.MEDIUM > 0 && <span className="text-amber-600 font-semibold">🟡 {counts.MEDIUM}</span>}
            {counts.LOW > 0 && <span className="text-blue-600 font-semibold">🔵 {counts.LOW}</span>}
            {counts.INFO > 0 && <span className="text-muted-foreground font-semibold">ℹ️ {counts.INFO}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {flags.map((flag, i) => {
          const config = severityConfig[flag.severity];
          const Icon = config.icon;
          return (
            <div key={i} className={cn('rounded-lg border p-3 space-y-1.5', config.bg, config.border)}>
              <div className="flex items-start gap-2">
                <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{flag.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
                  <p className="text-xs mt-1">
                    <span className="font-medium text-foreground">Recommendation:</span>{' '}
                    <span className="text-muted-foreground">{flag.recommendation}</span>
                  </p>
                  {flag.rateImpact !== 0 && (
                    <p className="text-xs mt-0.5 text-muted-foreground">
                      Rate Impact: <span className={flag.rateImpact > 0 ? 'text-red-600' : 'text-emerald-600'}>
                        {flag.rateImpact > 0 ? '+' : ''}{flag.rateImpact.toFixed(2)} PEPM
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function LaserRecommendationsPanel({ lasers }: { lasers: LaserRecommendation[] }) {
  if (lasers.length === 0) return null;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-primary" />
          Laser Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {lasers.map((laser, i) => (
          <div key={i} className="rounded-lg border bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Claimant {laser.claimantId}</p>
                <p className="text-xs text-muted-foreground">{laser.diagnosis} · {laser.isOngoing ? 'Ongoing' : 'Resolved'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">${laser.totalIncurred.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Total Incurred</p>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md',
              laser.shouldLaser ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            )}>
              {laser.shouldLaser ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span className="font-medium">{laser.shouldLaser ? `Laser at $${laser.recommendedLaserAmount.toLocaleString()}` : 'No Laser Needed'}</span>
            </div>
            <p className="text-xs text-muted-foreground">{laser.rationale}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AttentionItemsPanel({ items }: { items: AttentionItem[] }) {
  const categoryIcons: Record<string, string> = {
    RISK: '🔴',
    PRICING: '🟡',
    DATA_QUALITY: '🟢',
    COMPETITIVE: '🔵',
    COMPLIANCE: '⚠️',
  };

  return (
    <Card className="border shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          ⚡ Top Attention Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-1 border rounded-lg bg-card p-3">
            <div className="flex items-start gap-2">
              <span className="text-sm">{categoryIcons[item.category] || '📋'}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{item.priority}. {item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                <p className="text-xs mt-1.5 text-primary font-medium">→ {item.suggestedAction}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
