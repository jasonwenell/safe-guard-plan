import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, PieChart, ArrowUp, ArrowDown } from 'lucide-react';

const uwData = [
  { name: 'Juice Montezon', active: 32, quoted: 18, won: 8, avgDays: 2.8 },
  { name: 'Steve Rogers', active: 28, quoted: 15, won: 6, avgDays: 3.1 },
  { name: 'Jeff Montezon', active: 24, quoted: 12, won: 5, avgDays: 3.5 },
  { name: 'Vicki Christiansen', active: 20, quoted: 10, won: 4, avgDays: 2.9 },
];

const tpaVolume = [
  { name: 'ASR', count: 42, pct: 33 },
  { name: 'IMS', count: 28, pct: 22 },
  { name: 'CCAE', count: 18, pct: 14 },
  { name: 'JPF', count: 15, pct: 12 },
  { name: 'MHS', count: 12, pct: 9 },
  { name: 'Other', count: 12, pct: 10 },
];

const monthlyVolume = [
  { month: 'Jan', newBiz: 45, renewal: 12 },
  { month: 'Feb', newBiz: 52, renewal: 15 },
  { month: 'Mar', newBiz: 68, renewal: 18 },
  { month: 'Apr', newBiz: 42, renewal: 22 },
];

const weeklyTrend = [
  { week: 'W1', intake: 18, quoted: 8, won: 2, declined: 3 },
  { week: 'W2', intake: 22, quoted: 11, won: 4, declined: 2 },
  { week: 'W3', intake: 15, quoted: 9, won: 3, declined: 1 },
  { week: 'W4', intake: 26, quoted: 14, won: 5, declined: 4 },
];

const sicBreakdown = [
  { sic: 'Manufacturing', count: 34, pct: 27, premium: 2.4 },
  { sic: 'Healthcare', count: 22, pct: 17, premium: 3.8 },
  { sic: 'Education', count: 18, pct: 14, premium: 1.2 },
  { sic: 'Agriculture', count: 15, pct: 12, premium: 0.9 },
  { sic: 'Hospitality', count: 12, pct: 9, premium: 0.6 },
  { sic: 'Transportation', count: 10, pct: 8, premium: 1.1 },
  { sic: 'Other', count: 16, pct: 13, premium: 1.5 },
];

const conversionFunnel = [
  { stage: 'Intake', count: 127, pct: 100 },
  { stage: 'Setup Complete', count: 98, pct: 77 },
  { stage: 'Underwritten', count: 72, pct: 57 },
  { stage: 'Quoted', count: 54, pct: 43 },
  { stage: 'Proposal Sent', count: 38, pct: 30 },
  { stage: 'Won', count: 23, pct: 18 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics & Reporting</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Pipeline, volume, and performance analytics</p>
      </div>

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Pipeline</TabsTrigger>
          <TabsTrigger value="uw" className="gap-1.5"><Users className="w-3.5 h-3.5" /> UW Assignment</TabsTrigger>
          <TabsTrigger value="volume" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Volume</TabsTrigger>
          <TabsTrigger value="tpa" className="gap-1.5"><PieChart className="w-3.5 h-3.5" /> TPA Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Active', value: '127', change: '+12%', up: true },
              { label: 'Win Rate', value: '18%', change: '+2.3pp', up: true },
              { label: 'Avg Days to Quote', value: '3.2', change: '-0.4d', up: true },
              { label: 'DTQ Rate', value: '12%', change: '-1.1pp', up: true },
            ].map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  <div className={`flex items-center justify-center gap-1 mt-1 text-[11px] font-medium ${s.up ? 'text-success' : 'text-destructive'}`}>
                    {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {s.change} vs last month
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conversion Funnel */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversionFunnel.map((f, i) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <span className="text-xs w-28 font-medium text-foreground">{f.stage}</span>
                  <div className="flex-1 h-7 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full rounded flex items-center pl-2.5 transition-all"
                      style={{
                        width: `${f.pct}%`,
                        backgroundColor: `hsl(var(--primary) / ${1 - i * 0.12})`,
                      }}
                    >
                      <span className="text-[11px] text-primary-foreground font-semibold">{f.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{f.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Monthly Quote Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-6 h-48">
                {monthlyVolume.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex gap-1 items-end flex-1 w-full">
                      <div className="flex-1 bg-primary/70 rounded-t" style={{ height: `${(m.newBiz / 70) * 100}%` }} title={`New: ${m.newBiz}`} />
                      <div className="flex-1 bg-info/70 rounded-t" style={{ height: `${(m.renewal / 70) * 100}%` }} title={`Renewal: ${m.renewal}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary/70" /> New Business</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-info/70" /> Renewals</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uw" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">UW Assignment Report</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Underwriter</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Active</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Quoted</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Won</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Win %</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Avg Days</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Workload</th>
                  </tr>
                </thead>
                <tbody>
                  {uwData.map(uw => (
                    <tr key={uw.name} className="border-b last:border-0">
                      <td className="py-2.5 px-4 font-medium text-foreground">{uw.name}</td>
                      <td className="py-2.5 px-4 text-right">{uw.active}</td>
                      <td className="py-2.5 px-4 text-right">{uw.quoted}</td>
                      <td className="py-2.5 px-4 text-right font-medium text-success">{uw.won}</td>
                      <td className="py-2.5 px-4 text-right">{uw.quoted > 0 ? Math.round((uw.won / uw.quoted) * 100) : 0}%</td>
                      <td className="py-2.5 px-4 text-right">{uw.avgDays}</td>
                      <td className="py-2.5 px-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden w-24">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(uw.active / 35) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume" className="space-y-6 mt-6">
          {/* Weekly Trend */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Weekly Activity Trend (April 2026)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Week</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Intake</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Quoted</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Won</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Declined</th>
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyTrend.map(w => {
                    const total = w.intake + w.quoted + w.won + w.declined;
                    return (
                      <tr key={w.week} className="border-b last:border-0">
                        <td className="py-2.5 px-4 font-medium text-foreground">{w.week}</td>
                        <td className="py-2.5 px-4 text-right">{w.intake}</td>
                        <td className="py-2.5 px-4 text-right text-primary font-medium">{w.quoted}</td>
                        <td className="py-2.5 px-4 text-right text-success font-medium">{w.won}</td>
                        <td className="py-2.5 px-4 text-right text-destructive">{w.declined}</td>
                        <td className="py-2.5 px-4">
                          <div className="flex h-4 w-40 rounded overflow-hidden">
                            <div className="bg-muted-foreground/30 h-full" style={{ width: `${(w.intake / total) * 100}%` }} />
                            <div className="bg-primary/70 h-full" style={{ width: `${(w.quoted / total) * 100}%` }} />
                            <div className="bg-success/70 h-full" style={{ width: `${(w.won / total) * 100}%` }} />
                            <div className="bg-destructive/70 h-full" style={{ width: `${(w.declined / total) * 100}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* SIC Industry Breakdown */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quote Volume by Industry (SIC)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sicBreakdown.map(s => (
                <div key={s.sic} className="flex items-center gap-3">
                  <span className="text-xs w-28 font-medium text-foreground">{s.sic}</span>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                    <div className="h-full bg-primary/60 rounded flex items-center pl-2" style={{ width: `${s.pct}%` }}>
                      <span className="text-[10px] text-primary-foreground font-medium">{s.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">${s.premium}M premium</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conversion Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Time to Quote', value: '3.2 days', sub: 'Down from 4.1 last quarter' },
              { label: 'Quote-to-Bind Ratio', value: '42%', sub: '54 of 127 quoted' },
              { label: 'Avg Premium Size', value: '$148K', sub: 'Annual estimated premium' },
              { label: 'Renewal Retention', value: '87%', sub: '38 of 44 renewed' },
            ].map(m => (
              <Card key={m.label} className="border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">{m.label}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{m.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tpa" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quote Volume by TPA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tpaVolume.map(t => (
                <div key={t.name} className="flex items-center gap-3">
                  <span className="text-xs w-12 font-medium text-foreground">{t.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                    <div className="h-full bg-primary/70 rounded flex items-center pl-2" style={{ width: `${t.pct}%` }}>
                      <span className="text-[10px] text-primary-foreground font-medium">{t.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{t.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
