import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload, CheckCircle, FileText, Archive, Trash2, Eye, ArrowLeft,
  Search, AlertTriangle, BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import {
  MOCK_MANUALS, MOCK_AGE_GENDER_FACTORS, MOCK_AREA_FACTORS, MOCK_INDUSTRY_FACTORS,
  MOCK_BASE_RATES, MOCK_PLAN_RELATIVITY, MOCK_TREND_FACTORS, MOCK_LEVERAGED_TREND,
  MOCK_CONTRACT_ADJUSTMENTS, MOCK_EXPENSE_LOADS, FACTOR_TABLE_NAMES,
  type RatingManual,
} from '@/data/ratingManualMockData';
import { MOCK_CARRIERS } from '@/data/mockData';

const STATUS_CONFIG = {
  active: { label: 'Active', icon: '🟢', variant: 'default' as const, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  draft: { label: 'Draft', icon: '📝', variant: 'secondary' as const, className: 'bg-amber-100 text-amber-800 border-amber-200' },
  archived: { label: 'Archived', icon: '📦', variant: 'outline' as const, className: 'bg-muted text-muted-foreground' },
};

export default function RatingManualManager() {
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [viewingManual, setViewingManual] = useState<RatingManual | null>(null);
  const [viewingTable, setViewingTable] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const filteredManuals = carrierFilter === 'all'
    ? MOCK_MANUALS
    : MOCK_MANUALS.filter(m => m.carrierId === carrierFilter);

  const carrierGroups = MOCK_CARRIERS.filter(c =>
    filteredManuals.some(m => m.carrierId === c.id)
  );

  if (viewingManual && viewingTable) {
    return (
      <TableViewer
        manual={viewingManual}
        tableName={viewingTable}
        search={tableSearch}
        onSearchChange={setTableSearch}
        onBack={() => setViewingTable(null)}
      />
    );
  }

  if (viewingManual) {
    return (
      <ManualDetail
        manual={viewingManual}
        onBack={() => setViewingManual(null)}
        onViewTable={(t) => { setViewingTable(t); setTableSearch(''); }}
      />
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rating Manuals</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage carrier rating manuals, factor tables, and versioning</p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Upload className="w-4 h-4" /> Upload New Manual</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Upload Rating Manual</DialogTitle></DialogHeader>
            <UploadForm onClose={() => setUploadOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Carrier Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Carrier:</span>
        <Button size="sm" variant={carrierFilter === 'all' ? 'default' : 'outline'} onClick={() => setCarrierFilter('all')}>All</Button>
        {MOCK_CARRIERS.map(c => (
          <Button key={c.id} size="sm" variant={carrierFilter === c.id ? 'default' : 'outline'} onClick={() => setCarrierFilter(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>

      {/* Manual List by Carrier */}
      <div className="space-y-5">
        {carrierGroups.map(carrier => {
          const manuals = filteredManuals.filter(m => m.carrierId === carrier.id)
            .sort((a, b) => b.versionNumber - a.versionNumber);
          return (
            <Card key={carrier.id} className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  {carrier.name}
                  <Badge variant="outline" className="ml-2 text-xs">{manuals.length} version{manuals.length !== 1 ? 's' : ''}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {manuals.map(manual => {
                  const sc = STATUS_CONFIG[manual.status];
                  const totalRows = Object.values(manual.tableCounts).reduce((a, b) => a + b, 0);
                  return (
                    <div key={manual.id} className="border rounded-lg p-4 space-y-2 hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{sc.icon}</span>
                            <Badge className={sc.className}>{sc.label}</Badge>
                            <span className="text-sm font-semibold text-foreground">v{manual.versionNumber}</span>
                            <span className="text-sm text-muted-foreground">— "{manual.versionLabel}"</span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p>Effective: {format(new Date(manual.effectiveDate), 'MMM d, yyyy')}</p>
                            <p>Uploaded by {manual.uploadedBy} on {format(new Date(manual.uploadedAt), 'MMM d, yyyy')}</p>
                            {manual.activatedAt && <p>Activated by {manual.activatedBy} on {format(new Date(manual.activatedAt), 'MMM d, yyyy')}</p>}
                            <p>{FACTOR_TABLE_NAMES.length} tables | {totalRows.toLocaleString()} total rows</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => setViewingManual(manual)}>
                            <Eye className="w-3 h-3" /> View Tables
                          </Button>
                          {manual.status === 'draft' && (
                            <>
                              <Button size="sm" className="gap-1 text-xs h-7"><CheckCircle className="w-3 h-3" /> Activate</Button>
                              <Button size="sm" variant="destructive" className="gap-1 text-xs h-7"><Trash2 className="w-3 h-3" /></Button>
                            </>
                          )}
                          {manual.status === 'active' && (
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-7"><Archive className="w-3 h-3" /> Archive</Button>
                          )}
                        </div>
                      </div>
                      {manual.notes && (
                        <p className="text-xs text-muted-foreground border-t pt-2 mt-2">{manual.notes}</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function UploadForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Carrier</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="Select carrier..." /></SelectTrigger>
          <SelectContent>
            {MOCK_CARRIERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Version Label</Label>
        <Input placeholder="e.g., 2026 Q3 Trend Update" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Effective Date</Label>
        <Input type="date" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Notes / Changelog</Label>
        <Textarea rows={2} placeholder="Describe what changed..." />
      </div>
      <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">Drop Excel file here or click to browse</p>
        <p className="text-[10px] text-muted-foreground">Expected sheets: Base Rates, Age-Gender, Area Factors, Plan Relativity, Industry Factors, Trend, Leveraged Trend, Contract Adj, Expense Loads</p>
        <Button variant="outline" size="sm" className="gap-1 text-xs"><FileText className="w-3 h-3" /> Download Template</Button>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button className="gap-1"><Upload className="w-4 h-4" /> Upload</Button>
      </div>
    </div>
  );
}

function ManualDetail({ manual, onBack, onViewTable }: { manual: RatingManual; onBack: () => void; onViewTable: (t: string) => void }) {
  const sc = STATUS_CONFIG[manual.status];
  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1400px]">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{manual.carrierName} v{manual.versionNumber}</h1>
            <Badge className={sc.className}>{sc.label}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{manual.versionLabel} — Effective {format(new Date(manual.effectiveDate), 'MMM d, yyyy')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {FACTOR_TABLE_NAMES.map(t => (
          <Card
            key={t.key}
            className="border shadow-sm cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            onClick={() => onViewTable(t.key)}
          >
            <CardContent className="p-4 text-center space-y-1">
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="text-2xl font-bold text-primary">{manual.tableCounts[t.key as keyof typeof manual.tableCounts].toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">rows</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {manual.notes && (
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notes / Changelog</p>
            <p className="text-sm text-foreground">{manual.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TableViewer({ manual, tableName, search, onSearchChange, onBack }: {
  manual: RatingManual; tableName: string; search: string; onSearchChange: (s: string) => void; onBack: () => void;
}) {
  const tableLabel = FACTOR_TABLE_NAMES.find(t => t.key === tableName)?.label || tableName;

  return (
    <div className="p-6 lg:p-8 space-y-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">{manual.carrierName} v{manual.versionNumber} — {tableLabel}</h1>
            <p className="text-xs text-muted-foreground">
              {STATUS_CONFIG[manual.status].icon} {STATUS_CONFIG[manual.status].label} | Effective {format(new Date(manual.effectiveDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input className="pl-8 h-8 w-48 text-xs" placeholder="Search..." value={search} onChange={e => onSearchChange(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8">Export CSV</Button>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {tableName === 'ageGender' && <AgeGenderTable search={search} />}
          {tableName === 'areaFactors' && <AreaFactorsTable search={search} />}
          {tableName === 'industryFactors' && <IndustryFactorsTable search={search} />}
          {tableName === 'baseRates' && <BaseRatesTable />}
          {tableName === 'planRelativity' && <PlanRelativityTable />}
          {tableName === 'trendFactors' && <TrendFactorsTable />}
          {tableName === 'leveragedTrend' && <LeveragedTrendTable />}
          {tableName === 'contractAdjustments' && <ContractAdjTable />}
          {tableName === 'expenseLoads' && <ExpenseLoadsTable />}
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Individual Table Components ----

function AgeGenderTable({ search }: { search: string }) {
  const data = MOCK_AGE_GENDER_FACTORS.filter(r =>
    !search || r.age.toString().includes(search)
  );
  return (
    <div className="max-h-[500px] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
          <tr className="border-b">
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Age</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Male Factor</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Female Factor</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.age} className="border-b last:border-0 hover:bg-muted/30">
              <td className="py-1.5 px-4 text-xs font-medium">{r.age}</td>
              <td className="py-1.5 px-4 text-right text-xs font-mono">{r.maleFactor.toFixed(4)}</td>
              <td className="py-1.5 px-4 text-right text-xs font-mono">{r.femaleFactor.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground p-3 border-t">Showing {data.length} of {MOCK_AGE_GENDER_FACTORS.length} rows</p>
    </div>
  );
}

function AreaFactorsTable({ search }: { search: string }) {
  const s = search.toLowerCase();
  const data = MOCK_AREA_FACTORS.filter(r =>
    !s || r.zipPrefix.includes(s) || r.state.toLowerCase().includes(s) || r.metroArea.toLowerCase().includes(s)
  );
  return (
    <div className="max-h-[500px] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
          <tr className="border-b">
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">ZIP Prefix</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">State</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Metro Area</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Factor</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.zipPrefix} className="border-b last:border-0 hover:bg-muted/30">
              <td className="py-1.5 px-4 text-xs font-mono font-medium">{r.zipPrefix}</td>
              <td className="py-1.5 px-4 text-xs">{r.state}</td>
              <td className="py-1.5 px-4 text-xs">{r.metroArea}</td>
              <td className="py-1.5 px-4 text-right text-xs font-mono">{r.factor.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground p-3 border-t">Showing {data.length} of {MOCK_AREA_FACTORS.length} rows</p>
    </div>
  );
}

function IndustryFactorsTable({ search }: { search: string }) {
  const s = search.toLowerCase();
  const data = MOCK_INDUSTRY_FACTORS.filter(r =>
    !s || r.sicCode.includes(s) || r.sicDescription.toLowerCase().includes(s)
  );
  const tierColors: Record<string, string> = {
    LOW: 'bg-emerald-100 text-emerald-800',
    MODERATE: 'bg-blue-100 text-blue-800',
    ELEVATED: 'bg-amber-100 text-amber-800',
    HIGH: 'bg-red-100 text-red-800',
  };
  return (
    <div className="max-h-[500px] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/80 backdrop-blur">
          <tr className="border-b">
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">SIC Code</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Description</th>
            <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Risk Tier</th>
            <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Factor</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r.sicCode} className="border-b last:border-0 hover:bg-muted/30">
              <td className="py-1.5 px-4 text-xs font-mono font-medium">{r.sicCode}</td>
              <td className="py-1.5 px-4 text-xs">{r.sicDescription}</td>
              <td className="py-1.5 px-4 text-xs"><Badge className={`text-[10px] ${tierColors[r.riskTier]}`}>{r.riskTier}</Badge></td>
              <td className="py-1.5 px-4 text-right text-xs font-mono">{r.factor.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground p-3 border-t">Showing {data.length} of {MOCK_INDUSTRY_FACTORS.length} rows</p>
    </div>
  );
}

function BaseRatesTable() {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b bg-muted/50">
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Type</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Group Size</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Deductible Range</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Base Rate PMPM</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Description</th>
      </tr></thead>
      <tbody>
        {MOCK_BASE_RATES.map((r, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
            <td className="py-1.5 px-4 text-xs font-medium capitalize">{r.rateType}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono">{r.groupSizeMin ?? '—'}–{r.groupSizeMax ?? '∞'}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono">${(r.dedMin ?? 0).toLocaleString()}–${(r.dedMax ?? 0).toLocaleString()}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono font-bold text-primary">${r.baseRatePmpm.toFixed(2)}</td>
            <td className="py-1.5 px-4 text-xs text-muted-foreground">{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PlanRelativityTable() {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b bg-muted/50">
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Plan Category</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Deductible Range</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Factor</th>
      </tr></thead>
      <tbody>
        {MOCK_PLAN_RELATIVITY.map((r, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
            <td className="py-1.5 px-4 text-xs font-medium">{r.planCategory}</td>
            <td className="py-1.5 px-4 text-xs">{r.dedRangeLabel}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono">{r.factor.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TrendFactorsTable() {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b bg-muted/50">
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Type</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Annual Rate</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Period</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Notes</th>
      </tr></thead>
      <tbody>
        {MOCK_TREND_FACTORS.map((r, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
            <td className="py-1.5 px-4 text-xs font-medium capitalize">{r.trendType}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono font-bold text-primary">{(r.annualTrendRate * 100).toFixed(1)}%</td>
            <td className="py-1.5 px-4 text-xs">{format(new Date(r.effectiveFrom), 'MMM yyyy')} – {format(new Date(r.effectiveTo), 'MMM yyyy')}</td>
            <td className="py-1.5 px-4 text-xs text-muted-foreground">{r.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LeveragedTrendTable() {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b bg-muted/50">
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Deductible Range</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Group Size Band</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Factor</th>
      </tr></thead>
      <tbody>
        {MOCK_LEVERAGED_TREND.map((r, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
            <td className="py-1.5 px-4 text-xs font-mono">${r.dedMin.toLocaleString()}–${r.dedMax.toLocaleString()}</td>
            <td className="py-1.5 px-4 text-xs">{r.groupSizeBand}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono">{r.factor.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ContractAdjTable() {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b bg-muted/50">
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Contract Basis</th>
        <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Factor</th>
        <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Description</th>
      </tr></thead>
      <tbody>
        {MOCK_CONTRACT_ADJUSTMENTS.map((r, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
            <td className="py-1.5 px-4 text-xs font-mono font-medium">{r.contractBasis}</td>
            <td className="py-1.5 px-4 text-right text-xs font-mono">{r.factor.toFixed(4)}</td>
            <td className="py-1.5 px-4 text-xs text-muted-foreground">{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ExpenseLoadsTable() {
  const total = MOCK_EXPENSE_LOADS.reduce((s, l) => s + l.rate, 0);
  return (
    <>
      <table className="w-full text-sm">
        <thead><tr className="border-b bg-muted/50">
          <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Load Type</th>
          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Rate</th>
          <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Description</th>
        </tr></thead>
        <tbody>
          {MOCK_EXPENSE_LOADS.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
              <td className="py-1.5 px-4 text-xs font-medium capitalize">{r.loadType.replace('_', ' ')}</td>
              <td className="py-1.5 px-4 text-right text-xs font-mono">{(r.rate * 100).toFixed(1)}%</td>
              <td className="py-1.5 px-4 text-xs text-muted-foreground">{r.description}</td>
            </tr>
          ))}
          <tr className="bg-muted/50 font-bold">
            <td className="py-2 px-4 text-xs">Total Load</td>
            <td className="py-2 px-4 text-right text-xs font-mono text-primary">{(total * 100).toFixed(1)}%</td>
            <td className="py-2 px-4 text-xs text-muted-foreground">Combined expense & profit</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
