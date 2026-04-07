import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, ArrowRight, AlertTriangle } from 'lucide-react';
import { MOCK_PRIOR_YEAR, MOCK_SCENARIOS } from '@/data/mockData';

export default function RenewalComparison() {
  const prior = MOCK_PRIOR_YEAR;
  const proposed = MOCK_SCENARIOS[1]; // Option B

  const rateChangeDrivers = [
    { driver: 'Medical trend', impact: '+7.8%', isLargest: true },
    { driver: 'Leveraged trend', impact: '+5.2%', isLargest: false },
    { driver: 'Aging workforce', impact: '+1.8%', isLargest: false },
    { driver: 'New high-cost claimant', impact: '+3.1%', isLargest: false },
    { driver: 'Favorable experience', impact: '-5.4%', isLargest: false },
  ];

  const rows = [
    { label: 'Enrollment', prior: `${prior.enrollmentAverage} EE`, current: '185 EE', change: '+2.8%', warn: false },
    { label: 'Specific Deductible', prior: `$${prior.specificDeductible.toLocaleString()}`, current: `$${proposed.specificDeductible.toLocaleString()}`, change: 'no change', warn: false },
    { label: 'Aggregate Corridor', prior: `${prior.aggregateCorridorPercent}%`, current: `${proposed.aggregateCorridorPercent}%`, change: 'no change', warn: false },
    { label: 'Contract Basis', prior: prior.contractBasis, current: proposed.contractBasis, change: 'no change', warn: false },
    { label: 'Specific Rate PMPM', prior: `$${prior.specificRatePMPM.toFixed(2)}`, current: `$${proposed.specificFinalRate?.toFixed(2)}`, change: `+${(((proposed.specificFinalRate! / prior.specificRatePMPM) - 1) * 100).toFixed(1)}%`, warn: true },
    { label: 'Aggregate Rate PMPM', prior: `$${prior.aggregateRatePMPM.toFixed(2)}`, current: `$${proposed.aggregateFinalRate?.toFixed(2)}`, change: `+${(((proposed.aggregateFinalRate! / prior.aggregateRatePMPM) - 1) * 100).toFixed(1)}%`, warn: true },
    { label: 'Composite PMPM', prior: `$${prior.compositeRatePMPM.toFixed(2)}`, current: `$${proposed.compositeFinalRate?.toFixed(2)}`, change: `+${(((proposed.compositeFinalRate! / prior.compositeRatePMPM) - 1) * 100).toFixed(1)}%`, warn: false },
    { label: 'Annual Premium', prior: `$${prior.totalAnnualPremium.toLocaleString()}`, current: `$${proposed.totalAnnualPremium?.toLocaleString()}`, change: `+${(((proposed.totalAnnualPremium! / prior.totalAnnualPremium) - 1) * 100).toFixed(1)}%`, warn: false },
    { label: 'Total Claims', prior: `$${prior.totalClaimsPaid.toLocaleString()}`, current: '(projected)', change: '', warn: false },
    { label: 'Loss Ratio', prior: `${(prior.lossRatio * 100).toFixed(0)}%`, current: '68% (projected)', change: '', warn: false },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Renewal Comparison</h1>
        <p className="text-sm text-muted-foreground mt-1">Great Plains Agriculture LLC — Renewing from Policy 2025-2026</p>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground w-[200px]"></th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Prior Year (2025-2026)</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Proposed Renewal (2026-2027)</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.label} className="border-b last:border-0">
                  <td className="py-2.5 px-4 text-xs font-medium text-muted-foreground">{r.label}</td>
                  <td className="py-2.5 px-4 text-xs text-right font-mono text-foreground">{r.prior}</td>
                  <td className="py-2.5 px-4 text-xs text-right font-mono font-medium text-foreground">{r.current}</td>
                  <td className="py-2.5 px-4 text-xs text-right">
                    {r.change && (
                      <span className={`font-medium ${r.warn ? 'text-warning' : r.change.startsWith('+') ? 'text-destructive' : r.change.startsWith('-') ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                        {r.change} {r.warn && <AlertTriangle className="w-3 h-3 inline ml-0.5" />}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Rate Change Drivers */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Rate Change Drivers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rateChangeDrivers.map(d => (
            <div key={d.driver} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                {d.impact.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5 text-destructive" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="text-foreground">{d.driver}</span>
                {d.isLargest && <Badge variant="outline" className="text-[10px]">Largest factor</Badge>}
              </div>
              <span className={`font-mono font-medium ${d.impact.startsWith('+') ? 'text-destructive' : 'text-emerald-600'}`}>{d.impact}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm p-2 rounded-md bg-primary/10 font-bold">
            <span className="text-foreground">Net Composite Rate Change</span>
            <span className="font-mono text-primary">+12.5%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
