import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, Plus, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { MOCK_CLAIMS_EXPERIENCE, MOCK_LARGE_CLAIMANTS, MOCK_PRIOR_YEAR } from '@/data/mockData';
import type { LargeClaimant } from '@/types/sleq';

const TREATMENT_COLORS: Record<string, string> = {
  ACTIVE: 'bg-destructive/15 text-destructive',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  ONGOING_CHRONIC: 'bg-amber-100 text-amber-800',
  PENDING: 'bg-blue-100 text-blue-800',
  UNKNOWN: 'bg-muted text-muted-foreground',
};

const TREND_ICONS: Record<string, React.ReactNode> = {
  INCREASING: <TrendingUp className="w-3 h-3 text-destructive" />,
  STABLE: <Minus className="w-3 h-3 text-muted-foreground" />,
  DECREASING: <TrendingDown className="w-3 h-3 text-emerald-600" />,
  UNKNOWN: <Minus className="w-3 h-3 text-muted-foreground" />,
};

export default function ClaimsExperience() {
  const [showAddClaimant, setShowAddClaimant] = useState(false);
  const data = MOCK_CLAIMS_EXPERIENCE;
  const claimants = MOCK_LARGE_CLAIMANTS;
  const prior = MOCK_PRIOR_YEAR;

  const totalClaims = data.reduce((s, m) => s + m.totalClaimsPaid, 0);
  const totalMedical = data.reduce((s, m) => s + m.medicalClaimsPaid, 0);
  const totalRx = data.reduce((s, m) => s + m.pharmacyClaimsPaid, 0);
  const avgEnroll = Math.round(data.reduce((s, m) => s + m.enrollmentCount, 0) / data.length);
  const avgPMPM = Math.round(totalClaims / data.reduce((s, m) => s + m.memberCount, 0));

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Claims Experience</h1>
          <p className="text-sm text-muted-foreground mt-1">Great Plains Agriculture LLC — Renewal (RFP-002)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" /> Upload Report</Button>
          <Button className="gap-2"><Sparkles className="w-4 h-4" /> AI Extract</Button>
        </div>
      </div>

      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="prior">Prior Year Summary</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Claims</TabsTrigger>
          <TabsTrigger value="claimants">Large Claimants ({claimants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="prior" className="mt-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Policy Year', value: prior.policyYear },
              { label: 'Carrier', value: prior.carrierName },
              { label: 'Specific Deductible', value: `$${prior.specificDeductible.toLocaleString()}` },
              { label: 'Loss Ratio', value: `${(prior.lossRatio * 100).toFixed(0)}%` },
            ].map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Composite Rate PMPM', `$${prior.compositeRatePMPM.toFixed(2)}`],
                    ['Total Annual Premium', `$${prior.totalAnnualPremium.toLocaleString()}`],
                    ['Total Claims Paid', `$${prior.totalClaimsPaid.toLocaleString()}`],
                    ['Large Claimants', prior.largeClaimantCount.toString()],
                    ['Avg Enrollment', prior.enrollmentAverage.toString()],
                    ['Member Months', prior.memberMonths.toLocaleString()],
                    ['Contract Basis', prior.contractBasis],
                    ['Aggregate Corridor', `${prior.aggregateCorridorPercent}%`],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b last:border-0">
                      <td className="py-2 px-4 text-xs text-muted-foreground">{k}</td>
                      <td className="py-2 px-4 text-xs font-medium text-foreground text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-5 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Claims', value: `$${totalClaims.toLocaleString()}` },
              { label: 'Medical', value: `$${totalMedical.toLocaleString()}` },
              { label: 'Pharmacy', value: `$${totalRx.toLocaleString()}` },
              { label: 'Avg PMPM', value: `$${avgPMPM}` },
            ].map(s => (
              <Card key={s.label} className="border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-primary mt-1">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b">
                      {['Month', 'Enroll', 'Members', 'Medical', 'Rx', 'Total', 'PMPM', 'Large'].map(h => (
                        <th key={h} className="py-2.5 px-3 text-xs font-medium text-muted-foreground text-right first:text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(m => {
                      const pmpm = Math.round(m.totalClaimsPaid / m.memberCount);
                      const isSpike = pmpm > avgPMPM * 1.3;
                      return (
                        <tr key={m.id} className={`border-b last:border-0 ${isSpike ? 'bg-warning/5' : ''}`}>
                          <td className="py-1.5 px-3 text-xs font-medium">{new Date(m.periodStart).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</td>
                          <td className="py-1.5 px-3 text-xs text-right">{m.enrollmentCount}</td>
                          <td className="py-1.5 px-3 text-xs text-right">{m.memberCount}</td>
                          <td className="py-1.5 px-3 text-xs text-right font-mono">${m.medicalClaimsPaid.toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-xs text-right font-mono">${m.pharmacyClaimsPaid.toLocaleString()}</td>
                          <td className="py-1.5 px-3 text-xs text-right font-mono font-medium">${m.totalClaimsPaid.toLocaleString()}</td>
                          <td className={`py-1.5 px-3 text-xs text-right font-mono ${isSpike ? 'text-warning font-bold' : ''}`}>${pmpm}</td>
                          <td className="py-1.5 px-3 text-xs text-right">{m.largeClaimsCount > 0 ? <Badge variant="outline" className="text-[10px]">{m.largeClaimsCount}</Badge> : '—'}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-muted/50 font-bold">
                      <td className="py-2 px-3 text-xs">TOTAL</td>
                      <td className="py-2 px-3 text-xs text-right">avg {avgEnroll}</td>
                      <td className="py-2 px-3 text-xs text-right">—</td>
                      <td className="py-2 px-3 text-xs text-right font-mono">${totalMedical.toLocaleString()}</td>
                      <td className="py-2 px-3 text-xs text-right font-mono">${totalRx.toLocaleString()}</td>
                      <td className="py-2 px-3 text-xs text-right font-mono text-primary">${totalClaims.toLocaleString()}</td>
                      <td className="py-2 px-3 text-xs text-right font-mono">${avgPMPM}</td>
                      <td className="py-2 px-3 text-xs text-right">{data.reduce((s, m) => s + m.largeClaimsCount, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {data.some(m => Math.round(m.totalClaimsPaid / m.memberCount) > avgPMPM * 1.3) && (
            <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Shock Claim Detected</p>
                <p className="text-xs text-amber-700 mt-0.5">Sep 25 spike ($112,700) driven by Claimant A oncology admission. AI suggests treating as shock claim for experience rating adjustment.</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="claimants" className="mt-5 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={() => setShowAddClaimant(true)}><Plus className="w-3 h-3" /> Add Claimant</Button>
          </div>
          <div className="space-y-3">
            {claimants.map(c => (
              <Card key={c.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{c.claimantReference}</span>
                        <Badge className={TREATMENT_COLORS[c.treatmentStatus]}>{c.treatmentStatus.replace('_', ' ')}</Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">{TREND_ICONS[c.trendDirection]} {c.trendDirection}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.gender === 'F' ? 'Female' : 'Male'}, age {c.age} • {c.relationship} • {c.diagnosisCategory}</p>
                      {c.diagnosisDetail && <p className="text-xs text-muted-foreground italic">{c.diagnosisDetail}</p>}
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-lg font-bold text-foreground">${c.totalPaidToDate.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Paid to date</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t">
                    <div><p className="text-[10px] text-muted-foreground">Above Specific</p><p className="text-xs font-mono font-medium">${c.amountAboveSpecific.toLocaleString()}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Expected Future</p><p className="text-xs font-mono font-medium">{c.expectedFutureCost ? `$${c.expectedFutureCost.toLocaleString()}` : '—'}</p></div>
                    <div><p className="text-[10px] text-muted-foreground">Lasered</p><p className="text-xs font-medium">{c.isLasered ? `Yes — $${c.priorLaserAmount?.toLocaleString()}` : 'No'}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="gap-2"><CheckCircle2 className="w-4 h-4" /> Mark Experience Data Complete</Button>
      </div>

      <Dialog open={showAddClaimant} onOpenChange={setShowAddClaimant}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Large Claimant</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><Label className="text-xs">Reference</Label><Input placeholder="Claimant D" /></div>
              <div className="space-y-1"><Label className="text-xs">Age</Label><Input type="number" /></div>
              <div className="space-y-1"><Label className="text-xs">Gender</Label><Input placeholder="M/F" /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Diagnosis Category</Label><Input placeholder="e.g., Oncology" /></div>
              <div className="space-y-1"><Label className="text-xs">Total Paid</Label><Input type="number" placeholder="$0" /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setShowAddClaimant(false)}>Add Claimant</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
