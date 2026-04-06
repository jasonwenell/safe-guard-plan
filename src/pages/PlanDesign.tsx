import { useState } from 'react';
import { MOCK_SCENARIOS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Copy, Lock, Sparkles, Layers, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Scenario {
  id: string;
  name: string;
  isLocked: boolean;
  contractBasis: string;
  specificDeductible: number;
  aggregateDeductible: number;
  aggregateCorridor: string;
  specificTLO: string;
  aggregateTLO: string;
  networkType: string;
  networkName: string;
  deductibleIn: string;
  deductibleOon: string;
  oopMaxIn: string;
  oopMaxOon: string;
  coinsuranceIn: string;
  coinsuranceOon: string;
  erCopay: string;
  officeVisit: string;
  specialist: string;
  rxTier1: string;
  rxTier2: string;
  rxTier3: string;
  rxTier4: string;
  manualRate?: number;
  finalRate?: number;
  uwAdjustmentFactor?: number;
}

function seedFromMock(s: (typeof MOCK_SCENARIOS)[0]): Scenario {
  return {
    id: s.id,
    name: s.name,
    isLocked: s.isLocked,
    contractBasis: s.contractBasis,
    specificDeductible: s.specificDeductible,
    aggregateDeductible: s.aggregateDeductible,
    aggregateCorridor: '',
    specificTLO: 'NONE',
    aggregateTLO: 'NONE',
    networkType: 'PPO',
    networkName: '',
    deductibleIn: '',
    deductibleOon: '',
    oopMaxIn: '',
    oopMaxOon: '',
    coinsuranceIn: '',
    coinsuranceOon: '',
    erCopay: '',
    officeVisit: '',
    specialist: '',
    rxTier1: '',
    rxTier2: '',
    rxTier3: '',
    rxTier4: '',
    manualRate: s.manualRate,
    finalRate: s.finalRate,
    uwAdjustmentFactor: s.uwAdjustmentFactor,
  };
}

export default function PlanDesign() {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => MOCK_SCENARIOS.map(seedFromMock));
  const [activeTab, setActiveTab] = useState(scenarios[0]?.id || '');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const updateScenario = (id: string, patch: Partial<Scenario>) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = `s${Date.now()}`;
    const scenario: Scenario = {
      id, name: newName.trim(), isLocked: false,
      contractBasis: '12/12', specificDeductible: 150000, aggregateDeductible: 0,
      aggregateCorridor: '125', specificTLO: 'NONE', aggregateTLO: 'NONE',
      networkType: 'PPO', networkName: '', deductibleIn: '', deductibleOon: '',
      oopMaxIn: '', oopMaxOon: '', coinsuranceIn: '', coinsuranceOon: '',
      erCopay: '', officeVisit: '', specialist: '',
      rxTier1: '', rxTier2: '', rxTier3: '', rxTier4: '',
    };
    setScenarios(prev => [...prev, scenario]);
    setActiveTab(id);
    setNewName('');
    setShowNewDialog(false);
    toast.success(`Scenario "${scenario.name}" created`);
  };

  const handleClone = () => {
    const source = scenarios.find(s => s.id === activeTab);
    if (!source) return;
    const id = `s${Date.now()}`;
    const clone: Scenario = { ...source, id, name: `${source.name} (Copy)`, isLocked: false };
    setScenarios(prev => [...prev, clone]);
    setActiveTab(id);
    toast.success(`Cloned "${source.name}"`);
  };

  const handleDelete = (id: string) => {
    const target = scenarios.find(s => s.id === id);
    if (!target || target.isLocked) return;
    setScenarios(prev => prev.filter(s => s.id !== id));
    if (activeTab === id) setActiveTab(scenarios[0]?.id || '');
    toast.success(`Deleted "${target.name}"`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plan Design Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configure plan scenarios and benefit designs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Sparkles className="w-4 h-4" /> Import from SoB</Button>
          <Button className="gap-2" onClick={() => setShowNewDialog(true)}><Plus className="w-4 h-4" /> New Scenario</Button>
        </div>
      </div>

      {/* New Scenario Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Scenario</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Scenario Name</Label>
              <Input
                placeholder="e.g. High Deductible Option"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create Scenario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scenarios Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center gap-3 mb-4">
          <TabsList>
            {scenarios.map(s => (
              <TabsTrigger key={s.id} value={s.id} className="gap-1.5 text-xs">
                {s.isLocked && <Lock className="w-3 h-3" />}
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground" onClick={handleClone}>
            <Copy className="w-3.5 h-3.5" /> Clone
          </Button>
          {(() => {
            const current = scenarios.find(s => s.id === activeTab);
            return current && !current.isLocked ? (
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-destructive" onClick={() => handleDelete(activeTab)}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
            ) : null;
          })()}
        </div>

        {scenarios.map(scenario => (
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
                      <Select value={scenario.contractBasis} onValueChange={v => updateScenario(scenario.id, { contractBasis: v })}>
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
                      <Input type="number" value={scenario.specificDeductible} onChange={e => updateScenario(scenario.id, { specificDeductible: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregate Deductible</Label>
                      <Input type="number" value={scenario.aggregateDeductible} onChange={e => updateScenario(scenario.id, { aggregateDeductible: Number(e.target.value) })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Aggregate Corridor %</Label>
                      <Input placeholder="e.g. 125" value={scenario.aggregateCorridor} onChange={e => updateScenario(scenario.id, { aggregateCorridor: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Specific TLO</Label>
                      <Select value={scenario.specificTLO} onValueChange={v => updateScenario(scenario.id, { specificTLO: v })}>
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
                      <Select value={scenario.aggregateTLO} onValueChange={v => updateScenario(scenario.id, { aggregateTLO: v })}>
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

              {/* Medical Benefits */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Medical Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Deductible (IN)</Label>
                      <Input placeholder="$1,500" value={scenario.deductibleIn} onChange={e => updateScenario(scenario.id, { deductibleIn: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Deductible (OON)</Label>
                      <Input placeholder="$3,000" value={scenario.deductibleOon} onChange={e => updateScenario(scenario.id, { deductibleOon: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">OOP Max (IN)</Label>
                      <Input placeholder="$5,000" value={scenario.oopMaxIn} onChange={e => updateScenario(scenario.id, { oopMaxIn: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">OOP Max (OON)</Label>
                      <Input placeholder="$10,000" value={scenario.oopMaxOon} onChange={e => updateScenario(scenario.id, { oopMaxOon: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Coinsurance (IN)</Label>
                      <Input placeholder="80%" value={scenario.coinsuranceIn} onChange={e => updateScenario(scenario.id, { coinsuranceIn: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Coinsurance (OON)</Label>
                      <Input placeholder="60%" value={scenario.coinsuranceOon} onChange={e => updateScenario(scenario.id, { coinsuranceOon: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">ER Copay</Label>
                      <Input placeholder="$250" value={scenario.erCopay} onChange={e => updateScenario(scenario.id, { erCopay: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Office Visit</Label>
                      <Input placeholder="$30" value={scenario.officeVisit} onChange={e => updateScenario(scenario.id, { officeVisit: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Specialist</Label>
                      <Input placeholder="$50" value={scenario.specialist} onChange={e => updateScenario(scenario.id, { specialist: e.target.value })} />
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
                      <Input placeholder="$10" value={scenario.rxTier1} onChange={e => updateScenario(scenario.id, { rxTier1: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 2</Label>
                      <Input placeholder="$30" value={scenario.rxTier2} onChange={e => updateScenario(scenario.id, { rxTier2: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 3</Label>
                      <Input placeholder="$50" value={scenario.rxTier3} onChange={e => updateScenario(scenario.id, { rxTier3: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Tier 4</Label>
                      <Input placeholder="20%" value={scenario.rxTier4} onChange={e => updateScenario(scenario.id, { rxTier4: e.target.value })} />
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
                      <Select value={scenario.networkType} onValueChange={v => updateScenario(scenario.id, { networkType: v })}>
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
                      <Input placeholder="e.g. Blue Cross Blue Shield" value={scenario.networkName} onChange={e => updateScenario(scenario.id, { networkName: e.target.value })} />
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
                {scenarios.map(s => (
                  <th key={s.id} className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Contract Basis</td>
                {scenarios.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.contractBasis}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Specific Deductible</td>
                {scenarios.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">${s.specificDeductible.toLocaleString()}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Manual Rate</td>
                {scenarios.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.manualRate ? `$${s.manualRate.toFixed(2)}` : '—'}</td>)}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 text-xs text-muted-foreground">Final Rate</td>
                {scenarios.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-bold text-primary">{s.finalRate ? `$${s.finalRate.toFixed(2)}` : '—'}</td>)}
              </tr>
              <tr>
                <td className="py-2 px-4 text-xs text-muted-foreground">UW Adjustment</td>
                {scenarios.map(s => <td key={s.id} className="py-2 px-4 text-right text-xs font-medium">{s.uwAdjustmentFactor ? `${s.uwAdjustmentFactor}x` : '—'}</td>)}
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
