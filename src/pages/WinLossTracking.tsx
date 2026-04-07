import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BarChart3, TrendingDown, AlertTriangle, PieChart } from 'lucide-react';
import { MOCK_OUTCOMES } from '@/data/mockData';

const LOSS_REASONS = ['Price', 'Terms', 'Carrier Preference', 'TPA Preference', 'Broker Decision', 'Coverage Scope', 'Relationship', 'Unknown', 'Other'];
const DECISIVE_FACTORS = ['Price', 'Terms', 'Relationship', 'Service', 'Carrier Preference', 'Other'];

export default function WinLossTracking() {
  const [showRecord, setShowRecord] = useState(false);
  const [outcomeType, setOutcomeType] = useState('LOST');

  // Mock analytics
  const analytics = {
    totalQuoted: 127,
    won: 42,
    lost: 38,
    declined: 12,
    expired: 8,
    pending: 27,
    winRate: 52.5,
    avgRateDiff: 8.2,
    topLossReason: 'Price',
    topCompetitor: 'Sun Life',
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Win-Loss Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">Competitive tracking and outcome analysis</p>
        </div>
        <Button className="gap-2" onClick={() => setShowRecord(true)}>Record Outcome</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Win Rate', value: `${analytics.winRate}%`, color: 'text-emerald-600' },
          { label: 'Won', value: analytics.won, color: 'text-emerald-600' },
          { label: 'Lost', value: analytics.lost, color: 'text-destructive' },
          { label: 'Declined', value: analytics.declined, color: 'text-muted-foreground' },
          { label: 'Expired', value: analytics.expired, color: 'text-warning' },
        ].map(s => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><PieChart className="w-4 h-4" /> Loss Reason Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { reason: 'Price', pct: 42, count: 16 },
              { reason: 'Carrier Preference', pct: 18, count: 7 },
              { reason: 'Terms', pct: 13, count: 5 },
              { reason: 'Relationship', pct: 11, count: 4 },
              { reason: 'Coverage Scope', pct: 8, count: 3 },
              { reason: 'Other', pct: 8, count: 3 },
            ].map(r => (
              <div key={r.reason} className="flex items-center gap-3">
                <span className="text-xs w-32 text-muted-foreground">{r.reason}</span>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs font-mono w-12 text-right">{r.pct}%</span>
                <span className="text-xs text-muted-foreground w-8 text-right">({r.count})</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Top Competitors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { carrier: 'Sun Life', losses: 8, avgDiff: '+9.2%' },
              { carrier: 'HM Insurance', losses: 6, avgDiff: '+6.8%' },
              { carrier: 'Voya', losses: 5, avgDiff: '+11.4%' },
              { carrier: 'Symetra', losses: 4, avgDiff: '+4.2%' },
              { carrier: 'IHC Group', losses: 3, avgDiff: '+7.5%' },
            ].map(c => (
              <div key={c.carrier} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.carrier}</p>
                  <p className="text-xs text-muted-foreground">{c.losses} losses</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-destructive">{c.avgDiff}</p>
                  <p className="text-[10px] text-muted-foreground">avg rate diff</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="border shadow-sm border-amber-200 bg-amber-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800">Key Insight</p>
              <p className="text-xs text-amber-700">Price-driven losses average +8.2% above competitor rates. Groups in the 51-100 EE range show the lowest win rate (38%) — consider adjusting pricing for this segment.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Outcomes */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Recent Outcomes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {['Case', 'Outcome', 'Date', 'Reason / Factors', 'Competitor', 'Notes'].map(h => (
                  <th key={h} className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_OUTCOMES.map(o => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-2 px-4 text-xs font-medium">{o.rfpId}</td>
                  <td className="py-2 px-4"><Badge className={o.outcome === 'WON' ? 'bg-emerald-100 text-emerald-800' : o.outcome === 'LOST' ? 'bg-destructive/15 text-destructive' : 'bg-muted text-muted-foreground'}>{o.outcome}</Badge></td>
                  <td className="py-2 px-4 text-xs">{new Date(o.outcomeDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 text-xs">{o.decisiveFactors?.join(', ') || o.lostReason || '—'}</td>
                  <td className="py-2 px-4 text-xs">{o.winningCarrier || '—'}</td>
                  <td className="py-2 px-4 text-xs text-muted-foreground truncate max-w-[200px]">{o.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Record Outcome Dialog */}
      <Dialog open={showRecord} onOpenChange={setShowRecord}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Quote Outcome</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Outcome</Label>
              <Select value={outcomeType} onValueChange={setOutcomeType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['WON', 'LOST', 'DECLINED', 'EXPIRED'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {outcomeType === 'LOST' && (
              <>
                <div className="space-y-1">
                  <Label className="text-xs">Primary Reason</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
                    <SelectContent>{LOSS_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label className="text-xs">Winning Carrier</Label><Input placeholder="e.g., Sun Life" /></div>
                  <div className="space-y-1"><Label className="text-xs">Winning Rate (PMPM)</Label><Input placeholder="$0.00" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="retry" /><Label htmlFor="retry" className="text-xs">Flag for re-targeting at next renewal</Label>
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Textarea rows={2} placeholder="Additional context..." />
            </div>
          </div>
          <DialogFooter><Button onClick={() => setShowRecord(false)}>Save Outcome</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
