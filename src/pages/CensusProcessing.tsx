import { MOCK_CENSUS_MEMBERS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Users, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const summaryStats = {
  totalEmployees: 185,
  totalMembers: 285,
  avgAge: 38.4,
  malePercent: 52,
  femalePercent: 48,
  tiers: { EE: 95, 'EE+SP': 48, 'EE+CH': 22, FAM: 20 },
  plans: { 'Gold PPO': 112, 'Silver HDHP': 73 },
  cobraCount: 3,
  retireeCount: 0,
};

export default function CensusProcessing() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Census Processing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Upload, map, and validate census files with AI assistance</p>
      </div>

      {/* Upload Zone */}
      <Card className="border shadow-sm">
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Upload Census File</p>
            <p className="text-xs text-muted-foreground mt-1">XLSX, CSV, TSV, or PDF — AI will auto-map columns</p>
            <Button variant="outline" className="mt-4 gap-2"><Upload className="w-4 h-4" /> Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Column Mapping Preview */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">AI Column Mapping</CardTitle>
            <span className="text-xs px-2 py-0.5 bg-ai-bg text-amber-700 rounded border border-amber-200">✨ 9/9 columns mapped • 94% confidence</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {[
              { source: 'Employee Name', target: 'Full Name → First/Last', confidence: 95 },
              { source: 'DOB', target: 'Date of Birth', confidence: 98 },
              { source: 'Sex', target: 'Gender', confidence: 97 },
              { source: 'Zip', target: 'Zip Code', confidence: 99 },
              { source: 'Rel', target: 'Relationship', confidence: 92 },
              { source: 'Status', target: 'Status', confidence: 96 },
              { source: 'Plan', target: 'Plan Name', confidence: 88 },
              { source: 'Tier', target: 'Coverage Tier', confidence: 90 },
              { source: 'Hire Date', target: 'Hire Date', confidence: 94 },
            ].map((col) => (
              <div key={col.source} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2 border">
                <div>
                  <span className="text-muted-foreground">{col.source}</span>
                  <span className="mx-2">→</span>
                  <span className="font-medium text-foreground">{col.target}</span>
                </div>
                <span className={`font-mono ${col.confidence >= 90 ? 'text-success' : 'text-warning'}`}>{col.confidence}%</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="gap-2"><CheckCircle2 className="w-4 h-4" /> Confirm & Import</Button>
            <Button variant="outline">Adjust Mappings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Census Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> Census Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Total Employees" value={summaryStats.totalEmployees} />
              <StatItem label="Total Members" value={summaryStats.totalMembers} />
              <StatItem label="Average Age" value={summaryStats.avgAge} />
              <StatItem label="Gender Split" value={`${summaryStats.malePercent}% M / ${summaryStats.femalePercent}% F`} />
              <StatItem label="COBRA" value={summaryStats.cobraCount} />
              <StatItem label="Retiree" value={summaryStats.retireeCount} />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Coverage Tiers</p>
              {Object.entries(summaryStats.tiers).map(([tier, count]) => (
                <div key={tier} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs w-12 text-muted-foreground">{tier}</span>
                  <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                    <div className="h-full bg-primary/70 rounded" style={{ width: `${(count / summaryStats.totalEmployees) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Plan Enrollment</p>
              {Object.entries(summaryStats.plans).map(([plan, count]) => (
                <div key={plan} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs w-24 text-muted-foreground truncate">{plan}</span>
                  <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                    <div className="h-full bg-info/70 rounded" style={{ width: `${(count / summaryStats.totalEmployees) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Validation Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <ValidationItem type="warning" message="2 members have DOB resulting in age > 65 — verify retiree status" />
            <ValidationItem type="warning" message="1 member has ZIP code with only 4 digits — needs correction" />
            <ValidationItem type="info" message="3 duplicate name+DOB combinations detected — may be legitimate dependents" />
            <ValidationItem type="success" message="All required fields present for 282 of 285 members" />
            <ValidationItem type="success" message="Gender values normalized successfully" />
          </div>
        </CardContent>
      </Card>

      {/* Census Data Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Census Members</CardTitle>
            <span className="text-xs text-muted-foreground">{MOCK_CENSUS_MEMBERS.length} of 285 shown</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">DOB</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Gender</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">ZIP</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Relationship</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Plan</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Tier</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">AI</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CENSUS_MEMBERS.map((m) => (
                  <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-3 font-medium text-foreground">{m.lastName}, {m.firstName}</td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">{new Date(m.dateOfBirth).toLocaleDateString()}</td>
                    <td className="py-2 px-3 text-center text-muted-foreground">{m.gender}</td>
                    <td className="py-2 px-3 text-muted-foreground font-mono text-xs">{m.zipCode}</td>
                    <td className="py-2 px-3 text-muted-foreground text-xs">{m.relationship}</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${m.status === 'ACTIVE' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>{m.status}</span>
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{m.planName || '—'}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{m.coverageTier || '—'}</td>
                    <td className="py-2 px-3 text-center">
                      {m.aiMapped && <span className="text-xs text-amber-600" title={`${Math.round((m.aiConfidence || 0) * 100)}%`}>✨</span>}
                    </td>
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

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-muted/50 rounded-md px-3 py-2 border">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function ValidationItem({ type, message }: { type: 'success' | 'warning' | 'info'; message: string }) {
  const colors = {
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    info: 'text-info bg-info/10 border-info/20',
  };
  const icons = { success: '✓', warning: '⚠', info: 'ℹ' };
  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-md border text-xs ${colors[type]}`}>
      <span className="font-bold mt-px">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
