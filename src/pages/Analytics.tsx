import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, PieChart } from 'lucide-react';

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
              { label: 'Total Active', value: 127 },
              { label: 'Win Rate', value: '18%' },
              { label: 'Avg Days to Quote', value: 3.2 },
              { label: 'DTQ Rate', value: '12%' },
            ].map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

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

        <TabsContent value="volume" className="mt-6">
          <Card className="border shadow-sm p-8 text-center text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Volume Analytics</p>
            <p className="text-sm mt-1">Detailed volume trends, conversion rates, and seasonal patterns will be displayed here.</p>
          </Card>
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
