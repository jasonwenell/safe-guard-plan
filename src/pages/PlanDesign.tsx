import { MOCK_SCENARIOS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Copy, Lock, Sparkles, Layers } from 'lucide-react';

export default function PlanDesign() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plan Design Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure plan scenarios and benefit designs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Sparkles className="w-4 h-4" /> Import from SoB</Button>
          <Button className="gap-2"><Plus className="w-4 h-4" /> New Scenario</Button>
        </div>
      </div>

      {/* Scenarios Tabs */}
      <Tabs defaultValue="s1">
        <div className="flex items-center gap-3 mb-4">
          <TabsList>
            {MOCK_SCENARIOS.map(s => (
              <TabsTrigger key={s.id} value={s.id} className="gap-1.5 text-xs">
                {s.isLocked && <Lock className="w-3 h-3" />}
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
            <Copy className="w-3.5 h-3.5" /> Clone
          </Button>
        </div>

        {MOCK_SCENARIOS.map(scenario => (
          <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contract Terms */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Contract Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Contract Basis</Label>
                      <Select defaultValue={scenario.contractBasis}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12/12">12/12</SelectItem>
                          <SelectItem value="12/15">12/15</SelectItem>
                          <SelectItem value="12/18">12/18</SelectItem>
                          <SelectItem value="15/12">15/12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Specific Deductible</Label>
                      <Input type="number" defaultValue={scenario.specificDeductible} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregate Deductible</Label>
                      <Input type="number" defaultValue={scenario.aggregateDeductible} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregate Corridor %</Label>
                      <Input placeholder="e.g. 125" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Specific TLO</Label>
                      <Select defaultValue="NONE">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="RUN_OUT">Run-Out</SelectItem>
                          <SelectItem value="RUN_IN">Run-In</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregate TLO</Label>
                      <Select defaultValue="NONE">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="RUN_OUT">Run-Out</SelectItem>
                          <SelectItem value="RUN_IN">Run-In</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Design */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Medical Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Deductible (IN)</Label>
                      <Input placeholder="$1,500" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Deductible (OON)</Label>
                      <Input placeholder="$3,000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">OOP Max (IN)</Label>
                      <Input placeholder="$5,000" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">OOP Max (OON)</Label>
                      <Input placeholder="$10,000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Coinsurance (IN)</Label>
                      <Input placeholder="80%" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Coinsurance (OON)</Label>
                      <Input placeholder="60%" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">ER Copay</Label>
                      <Input placeholder="$250" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Office Visit</Label>
                      <Input placeholder="$30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Specialist</Label>
                      <Input placeholder="$50" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rx Tiers */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Rx Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 1</Label>
                      <Input placeholder="$10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 2</Label>
                      <Input placeholder="$30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 3</Label>
                      <Input placeholder="$50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 4</Label>
                      <Input placeholder="20%" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Network</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Network Type</Label>
                      <Select defaultValue="PPO">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PPO">PPO</SelectItem>
                          <SelectItem value="HMO">HMO</SelectItem>
                          <SelectItem value="HDHP">HDHP</SelectItem>
                          <SelectItem value="EPO">EPO</SelectItem>
                          <SelectItem value="POS">POS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Network Name</Label>
                      <Input placeholder="e.g. Blue Cross Blue Shield" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Scenario Comparison */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Layers className="w-4 h-4" /> Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Metric</th>
                {MOCK_SCENARIOS.map(s => (
                  <th key={s.id} className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Contract Basis</td>
                {MOCK_SCENARIOS.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.contractBasis}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Specific Deductible</td>
                {MOCK_SCENARIOS.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">${s.specificDeductible.toLocaleString()}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Manual Rate</td>
                {MOCK_SCENARIOS.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.manualRate ? `$${s.manualRate.toFixed(2)}` : '—'}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Final Rate</td>
                {MOCK_SCENARIOS.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-bold text-primary">{s.finalRate ? `$${s.finalRate.toFixed(2)}` : '—'}</td>)}
              </tr>
              <tr>
                <td className="py-2 px-4 text-xs text-muted-foreground">UW Adjustment</td>
                {MOCK_SCENARIOS.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.uwAdjustmentFactor ? `${s.uwAdjustmentFactor}x` : '—'}</td>)}
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
