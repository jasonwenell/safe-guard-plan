import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, TrendingUp, MapPin, Users, Factory, FileText, Calculator } from 'lucide-react';
import {
  MOCK_MANUALS, MOCK_AGE_GENDER_FACTORS, MOCK_AREA_FACTORS, MOCK_INDUSTRY_FACTORS,
  MOCK_PLAN_RELATIVITY, MOCK_LEVERAGED_TREND, MOCK_CONTRACT_ADJUSTMENTS, MOCK_TREND_FACTORS,
} from '@/data/ratingManualMockData';
import { MOCK_CARRIERS } from '@/data/mockData';

export default function FactorLookup() {
  const [carrierId, setCarrierId] = useState('c1');
  const [ageInput, setAgeInput] = useState('52');
  const [genderInput, setGenderInput] = useState('F');
  const [zipInput, setZipInput] = useState('070');
  const [sicInput, setSicInput] = useState('8011');
  const [dedInput, setDedInput] = useState('75000');
  const [groupSizeInput, setGroupSizeInput] = useState('185');
  const [contractInput, setContractInput] = useState('12/15');

  const activeManual = MOCK_MANUALS.find(m => m.carrierId === carrierId && m.status === 'active');
  const carrier = MOCK_CARRIERS.find(c => c.id === carrierId);

  // Lookups
  const age = parseInt(ageInput) || 0;
  const agFactor = MOCK_AGE_GENDER_FACTORS.find(f => f.age === Math.min(age, 65));
  const agResult = agFactor ? (genderInput === 'M' ? agFactor.maleFactor : agFactor.femaleFactor) : null;

  const areaResult = MOCK_AREA_FACTORS.find(f => f.zipPrefix === zipInput);
  const indResult = MOCK_INDUSTRY_FACTORS.find(f => f.sicCode === sicInput);

  const ded = parseInt(dedInput) || 0;
  const gs = parseInt(groupSizeInput) || 0;
  const gsb = gs <= 50 ? '25-50' : gs <= 100 ? '51-100' : gs <= 250 ? '101-250' : '251+';
  const levResult = MOCK_LEVERAGED_TREND.find(f => ded >= f.dedMin && ded <= f.dedMax && f.groupSizeBand === gsb);

  const contractResult = MOCK_CONTRACT_ADJUSTMENTS.find(f => f.contractBasis === contractInput);

  const tierColors: Record<string, string> = {
    LOW: 'bg-emerald-100 text-emerald-800',
    MODERATE: 'bg-blue-100 text-blue-800',
    ELEVATED: 'bg-amber-100 text-amber-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factor Lookup</h1>
          <p className="text-sm text-muted-foreground mt-1">Look up any factor from the active rating manual</p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Carrier:</Label>
          <Select value={carrierId} onValueChange={setCarrierId}>
            <SelectTrigger className="w-48 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CARRIERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeManual && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manual: <strong className="text-foreground">{carrier?.name} v{activeManual.versionNumber}</strong></span>
          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">Active</Badge>
          <span>— {activeManual.versionLabel}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Age-Gender */}
        <LookupCard
          icon={<Users className="w-4 h-4" />}
          title="Age-Gender Factor"
          result={agResult !== null ? agResult.toFixed(4) : '—'}
          resultLabel={`Age ${ageInput}, ${genderInput === 'M' ? 'Male' : 'Female'}`}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Age</Label>
              <Input className="h-8 text-xs" value={ageInput} onChange={e => setAgeInput(e.target.value)} type="number" min={0} max={65} />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Gender</Label>
              <Select value={genderInput} onValueChange={setGenderInput}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </LookupCard>

        {/* Area */}
        <LookupCard
          icon={<MapPin className="w-4 h-4" />}
          title="Area Factor"
          result={areaResult ? areaResult.factor.toFixed(4) : '—'}
          resultLabel={areaResult ? `${areaResult.state} / ${areaResult.metroArea}` : 'ZIP not found'}
        >
          <div className="space-y-1">
            <Label className="text-[10px]">ZIP Prefix (3 digits)</Label>
            <Input className="h-8 text-xs font-mono" value={zipInput} onChange={e => setZipInput(e.target.value)} maxLength={3} />
          </div>
        </LookupCard>

        {/* Industry */}
        <LookupCard
          icon={<Factory className="w-4 h-4" />}
          title="Industry Factor"
          result={indResult ? indResult.factor.toFixed(4) : '—'}
          resultLabel={indResult ? indResult.sicDescription : 'SIC not found'}
          extra={indResult && <Badge className={`text-[10px] ${tierColors[indResult.riskTier]}`}>{indResult.riskTier}</Badge>}
        >
          <div className="space-y-1">
            <Label className="text-[10px]">SIC Code</Label>
            <Input className="h-8 text-xs font-mono" value={sicInput} onChange={e => setSicInput(e.target.value)} />
          </div>
        </LookupCard>

        {/* Plan Relativity - static display */}
        <LookupCard
          icon={<FileText className="w-4 h-4" />}
          title="Plan Relativity"
          result=""
          resultLabel=""
        >
          <div className="space-y-1">
            {MOCK_PLAN_RELATIVITY.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-0.5">
                <span>{p.planCategory} <span className="text-muted-foreground">({p.dedRangeLabel})</span></span>
                <span className="font-mono font-medium">{p.factor.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </LookupCard>

        {/* Leveraged Trend */}
        <LookupCard
          icon={<TrendingUp className="w-4 h-4" />}
          title="Leveraged Trend"
          result={levResult ? levResult.factor.toFixed(4) : '—'}
          resultLabel={levResult ? `${((levResult.factor - 1) * 100).toFixed(1)}% leveraged on ${(MOCK_TREND_FACTORS[0]?.annualTrendRate * 100).toFixed(1)}% medical` : 'No match'}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px]">Specific Deductible ($)</Label>
              <Input className="h-8 text-xs font-mono" value={dedInput} onChange={e => setDedInput(e.target.value)} type="number" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px]">Group Size</Label>
              <Input className="h-8 text-xs font-mono" value={groupSizeInput} onChange={e => setGroupSizeInput(e.target.value)} type="number" />
            </div>
          </div>
        </LookupCard>

        {/* Contract Adjustment */}
        <LookupCard
          icon={<Calculator className="w-4 h-4" />}
          title="Contract Adjustment"
          result={contractResult ? contractResult.factor.toFixed(4) : '—'}
          resultLabel={contractResult?.description || 'Not found'}
        >
          <div className="space-y-1">
            <Label className="text-[10px]">Contract Basis</Label>
            <Select value={contractInput} onValueChange={setContractInput}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['12/12', '12/15', '12/18', '15/12', '24/12'].map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </LookupCard>
      </div>
    </div>
  );
}

function LookupCard({ icon, title, result, resultLabel, extra, children }: {
  icon: React.ReactNode; title: string; result: string; resultLabel: string;
  extra?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
        {result && (
          <div className="bg-primary/5 border border-primary/20 rounded-md p-3 text-center">
            <p className="text-2xl font-bold text-primary font-mono">{result}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{resultLabel}</p>
            {extra && <div className="mt-1">{extra}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
