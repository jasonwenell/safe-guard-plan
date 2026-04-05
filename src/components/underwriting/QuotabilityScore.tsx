import { QuotabilityScore, QUOTABILITY_ROUTING, getScoreColor, getScoreBg, getRecommendation } from '@/types/underwriting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus, HelpCircle, Target, BarChart3, Users } from 'lucide-react';

// Compact badge for RFP list views
export function QuotabilityBadge({ score, showLabel = false }: { score: number; showLabel?: boolean }) {
  const rec = getRecommendation(score);
  const routing = QUOTABILITY_ROUTING[rec];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold cursor-default ${routing.bgLight} ${routing.textColor}`}>
          <div className={`w-2 h-2 rounded-full ${routing.color}`} />
          <span>{score}</span>
          {showLabel && <span className="font-medium">{routing.label}</span>}
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[250px]">
        <p className="font-semibold">{routing.label}</p>
        <p className="text-xs mt-1">Quotability Score: {score}/100</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Full quotability score card
export function QuotabilityScoreCard({ data, compact = false }: { data: QuotabilityScore; compact?: boolean }) {
  const routing = QUOTABILITY_ROUTING[data.recommendation];

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Quotability Score
          </CardTitle>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${routing.bgLight} ${routing.textColor}`}>
            {routing.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                className="stroke-muted"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                className={getScoreColor(data.overallScore).replace('text-', 'stroke-')}
                strokeWidth="3"
                strokeDasharray={`${data.overallScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(data.overallScore)}`}>{data.overallScore}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{data.reasonSummary}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Win Prob: <strong className="text-foreground">{Math.round(data.estimatedWinProbability * 100)}%</strong></span>
              <span>Profitability: <strong className="text-foreground">{data.estimatedProfitability}</strong></span>
            </div>
          </div>
        </div>

        {/* Factor breakdown */}
        {!compact && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Factor Breakdown</p>
            {data.factors.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground font-medium">{f.name}</span>
                    <TrendIcon trend={f.trend} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getScoreColor(f.rawScore)}`}>{f.rawScore}</span>
                    <span className="text-muted-foreground">({Math.round(f.weight * 100)}%)</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getScoreBg(f.rawScore)}`}
                    style={{ width: `${f.rawScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparable groups */}
        {!compact && data.comparableGroups.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Comparable Groups (24 months)
            </p>
            {data.comparableGroups.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-muted/50 rounded-md px-3 py-2 border">
                <div>
                  <span className="font-medium text-foreground">{g.groupName}</span>
                  <span className="text-muted-foreground ml-2">SIC {g.sicCode} · {g.employeeCount} lives</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${g.outcome === 'WON' ? 'text-emerald-600' : g.outcome === 'LOST' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {g.outcome}
                  </span>
                  {g.finalRate > 0 && <span className="text-muted-foreground">${g.finalRate.toFixed(2)}</span>}
                  {g.lossRatio > 0 && <span className="text-muted-foreground">{Math.round(g.lossRatio * 100)}% LR</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  switch (trend) {
    case 'IMPROVING': return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    case 'DECLINING': return <TrendingDown className="w-3 h-3 text-red-500" />;
    case 'STABLE': return <Minus className="w-3 h-3 text-muted-foreground" />;
    default: return <HelpCircle className="w-3 h-3 text-muted-foreground" />;
  }
}
