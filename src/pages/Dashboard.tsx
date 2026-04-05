import { MOCK_DASHBOARD_STATS, MOCK_RFPS } from '@/data/mockData';
import { RFPStatus } from '@/types/sleq';
import { StatusBadge, RushBadge } from '@/components/shared/StatusBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText, Clock, Zap, ClipboardList, Calculator, TrendingUp, Trophy, Timer
} from 'lucide-react';

const stats = MOCK_DASHBOARD_STATS;

const statCards = [
  { label: 'Active RFPs', value: stats.totalActiveRFPs, icon: FileText, color: 'text-primary' },
  { label: 'Due Today', value: stats.dueToday, icon: Clock, color: 'text-warning' },
  { label: 'Rush Cases', value: stats.rushCases, icon: Zap, color: 'text-destructive' },
  { label: 'Pending Setup', value: stats.pendingSetup, icon: ClipboardList, color: 'text-info' },
  { label: 'In Underwriting', value: stats.inUnderwriting, icon: Calculator, color: 'text-primary' },
  { label: 'Quoted (Month)', value: stats.quotedThisMonth, icon: TrendingUp, color: 'text-status-quoted' },
  { label: 'Won (Month)', value: stats.wonThisMonth, icon: Trophy, color: 'text-success' },
  { label: 'Avg Days to Quote', value: stats.avgDaysToQuote, icon: Timer, color: 'text-muted-foreground' },
];

const recentRFPs = MOCK_RFPS.slice(0, 6);

const statusDistribution = [
  { status: 'Intake', count: 18, pct: 14 },
  { status: 'Setup', count: 42, pct: 33 },
  { status: 'Ready for UW', count: 12, pct: 9 },
  { status: 'In Underwriting', count: 28, pct: 22 },
  { status: 'Quoted', count: 15, pct: 12 },
  { status: 'Proposal Sent', count: 12, pct: 10 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">SLEQ Platform overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <Card className="lg:col-span-1 border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statusDistribution.map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.status}</span>
                  <span className="font-medium text-foreground">{s.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent RFPs */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent RFPs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Case #</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Group</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">TPA</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Eff. Date</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">UW</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRFPs.map((rfp) => (
                    <tr key={rfp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-xs">{rfp.caseNumber}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground truncate max-w-[200px]">{rfp.groupName}</span>
                          {rfp.isRush && <RushBadge />}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">{rfp.tpaCode}</td>
                      <td className="py-2.5 px-4"><StatusBadge status={rfp.status} /></td>
                      <td className="py-2.5 px-4 text-muted-foreground">{new Date(rfp.effectiveDate).toLocaleDateString()}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{rfp.assignedUWName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Queue Preview */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">My Setup Queue</CardTitle>
            <span className="text-xs text-muted-foreground">5 items pending</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Case #</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Group</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">TPA</th>
                  <th className="text-center py-2 px-4 text-xs font-medium text-muted-foreground">Census</th>
                  <th className="text-center py-2 px-4 text-xs font-medium text-muted-foreground">SoB</th>
                  <th className="text-center py-2 px-4 text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="text-center py-2 px-4 text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Due</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RFPS.filter(r => !r.setupComplete && r.status !== RFPStatus.DECLINED && r.status !== RFPStatus.WON).slice(0, 5).map((rfp) => (
                  <tr key={rfp.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${rfp.isRush ? 'border-l-2 border-l-destructive' : ''}`}>
                    <td className="py-2.5 px-4 font-mono text-xs">{rfp.caseNumber}</td>
                    <td className="py-2.5 px-4 font-medium text-foreground">{rfp.groupName}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{rfp.tpaCode}</td>
                    <td className="py-2.5 px-4 text-center">
                      <SetupDot status={rfp.censusStatus === 'ready' ? 'done' : rfp.censusStatus === 'waiting' ? 'none' : 'partial'} />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <SetupDot status={rfp.sobStatus === 'verified' ? 'done' : rfp.sobStatus === 'not_started' ? 'none' : 'partial'} />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <SetupDot status={rfp.riskAssessmentStatus === 'verified' ? 'done' : rfp.riskAssessmentStatus === 'not_started' ? 'none' : 'partial'} />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <SetupDot status={rfp.ratingSystemStatus === 'verified' ? 'done' : rfp.ratingSystemStatus === 'not_started' ? 'none' : 'partial'} />
                    </td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground">{new Date(rfp.requestDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SetupDot({ status }: { status: 'none' | 'partial' | 'done' }) {
  const colors = {
    none: 'bg-destructive',
    partial: 'bg-warning',
    done: 'bg-success',
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />;
}
