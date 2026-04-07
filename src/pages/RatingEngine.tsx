import { MOCK_SCENARIOS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, AlertTriangle, Sliders } from 'lucide-react';

export default function RatingEngine() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Underwriting & Rating Engine</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Calculate manual and experience-based rates, assess risk factors</p>
      </div>

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual" className="gap-1.5"><Calculator className="w-3.5 h-3.5" /> Manual Rating</TabsTrigger>
          <TabsTrigger value="experience" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Experience Rating</TabsTrigger>
          <TabsTrigger value="risk" className="gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Risk Assessment</TabsTrigger>
          <TabsTrigger value="comparison" className="gap-1.5"><Sliders className="w-3.5 h-3.5" /> Rate Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Rating Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">SIC Risk Factor</Label>
                    <Input defaultValue="1.15" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Area Factor</Label>
                    <Input defaultValue="0.98" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Demographic Factor</Label>
                    <Input defaultValue="1.02" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Plan Design Factor</Label>
                    <Input defaultValue="1.08" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">UW Adjustment Factor</Label>
                  <Input defaultValue="1.00" />
                  <p className="text-[10px] text-muted-foreground">Justification required for adjustments &gt; 10%</p>
                </div>
                <Button className="w-full gap-2"><Calculator className="w-4 h-4" /> Calculate Rate</Button>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Rate Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_SCENARIOS.map(s => (
                  <div key={s.id} className="bg-muted/50 rounded-lg p-4 border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.contractBasis}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <RateBox label="Specific Rate" value={s.specificFinalRate ? `$${s.specificFinalRate.toFixed(2)}` : '—'} sub="Per Member/Mo" />
                      <RateBox label="Aggregate Rate" value={s.aggregateFinalRate ? `$${s.aggregateFinalRate.toFixed(2)}` : '—'} sub="Per Member/Mo" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <RateBox label="Composite Rate" value={s.compositeFinalRate ? `$${s.compositeFinalRate.toFixed(2)}` : '—'} sub="Per Member/Mo" highlight />
                      <RateBox label="Total Annual" value={s.totalAnnualPremium ? `$${s.totalAnnualPremium.toLocaleString()}` : '—'} sub="Premium" highlight />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t">
                      <span>UW Adj: {s.uwAdjustmentFactor}x</span>
                      {s.rateCapPercent && <span>Rate Cap: {s.rateCapPercent}%</span>}
                      {s.noNewLasers && <span className="text-primary">NNL ✓</span>}
                      {s.aggregatingSpecificDeductible && <span>ASD: ${s.aggregatingSpecificDeductible.toLocaleString()}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Experience Rating</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Claims-history-based rating for renewals and groups with experience data.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Claims Period (months)</Label>
                  <Input defaultValue="12" type="number" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Total Paid Claims</Label>
                  <Input placeholder="$0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Large Claims (&gt;$50K)</Label>
                  <Input placeholder="$0.00" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Trend Factor</Label>
                  <Input defaultValue="1.08" />
                </div>
              </div>
              <Button className="gap-2"><TrendingUp className="w-4 h-4" /> Calculate Experience Rate</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">High Claimant Count</Label>
                  <Input type="number" defaultValue="0" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Ongoing Treatments</Label>
                  <Input type="number" defaultValue="0" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['Transplant Risk', 'Cancer Risk', 'Maternity Risk'].map(label => (
                  <div key={label} className="space-y-1.5">
                    <Label className="text-xs">{label}</Label>
                    <Input type="number" defaultValue="0" placeholder="Count" />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Rx Specialty Drug Exposure</Label>
                <Input type="number" defaultValue="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">UW Notes & Risk Narrative</Label>
                <Textarea rows={4} placeholder="Describe risk factors, concerns, and underwriting notes..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Rate Comparison Across Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Scenario</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Manual</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Experience</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Final</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Annual (est.)</th>
                    <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">UW Adj</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SCENARIOS.map(s => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2.5 px-4 font-medium text-foreground text-xs">{s.name}</td>
                      <td className="py-2.5 px-4 text-right text-xs">{s.manualRate ? `$${s.manualRate.toFixed(2)}` : '—'}</td>
                      <td className="py-2.5 px-4 text-right text-xs">{s.experienceRate ? `$${s.experienceRate.toFixed(2)}` : '—'}</td>
                      <td className="py-2.5 px-4 text-right text-xs font-bold text-primary">{s.finalRate ? `$${s.finalRate.toFixed(2)}` : '—'}</td>
                      <td className="py-2.5 px-4 text-right text-xs">{s.finalRate ? `$${(s.finalRate * 285 * 12).toLocaleString()}` : '—'}</td>
                      <td className="py-2.5 px-4 text-right text-xs">{s.uwAdjustmentFactor}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RateBox({ label, value, sub, highlight }: { label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`text-center p-2 rounded-md ${highlight ? 'bg-primary/10 border border-primary/30' : 'bg-card border'}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      <p className="text-[9px] text-muted-foreground">{sub}</p>
    </div>
  );
}
