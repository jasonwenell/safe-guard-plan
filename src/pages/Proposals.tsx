import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Send, Eye, Layers, Sparkles, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { MOCK_SCENARIOS, MOCK_RFPS } from '@/data/mockData';

type GeneratedDoc = {
  id: string;
  name: string;
  date: string;
  format: string;
  size: string;
  rfpId: string;
  groupName: string;
  status: 'ready' | 'generating' | 'sent';
};

const INITIAL_DOCS: GeneratedDoc[] = [
  { id: 'd1', name: 'Midwest Manufacturing Corp — Full Proposal', date: '2026-04-04', format: 'PDF', size: '2.4 MB', rfpId: 'rfp-001', groupName: 'Midwest Manufacturing Corp', status: 'ready' },
  { id: 'd2', name: 'Midwest Manufacturing Corp — Rate Summary', date: '2026-04-04', format: 'XLSX', size: '156 KB', rfpId: 'rfp-001', groupName: 'Midwest Manufacturing Corp', status: 'sent' },
  { id: 'd3', name: 'Lakeside Healthcare System — Full Proposal', date: '2026-04-03', format: 'PDF', size: '3.1 MB', rfpId: 'rfp-003', groupName: 'Lakeside Healthcare System', status: 'ready' },
];

const TEMPLATE_OPTIONS = [
  { id: 'full', label: 'Full Proposal Package', desc: 'Cover letter, rate summary, plan comparison, terms & conditions' },
  { id: 'rate', label: 'Rate Summary Only', desc: 'Single-page rate card with scenario comparison' },
  { id: 'exec', label: 'Executive Summary', desc: 'One-page overview for C-suite decision makers' },
  { id: 'renewal', label: 'Renewal Comparison', desc: 'Current vs. renewal rate comparison with trend analysis' },
];

export default function Proposals() {
  const [docs, setDocs] = useState<GeneratedDoc[]>(INITIAL_DOCS);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedRfp, setSelectedRfp] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['full']);
  const [generating, setGenerating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<GeneratedDoc | null>(null);

  const quotedRfps = MOCK_RFPS.filter(r => ['QUOTED', 'PROPOSAL_SENT', 'WON', 'IN_UNDERWRITING'].includes(r.status));

  const handleGenerate = () => {
    if (!selectedRfp || selectedTemplates.length === 0) return;
    setGenerating(true);
    const rfp = MOCK_RFPS.find(r => r.id === selectedRfp)!;
    const newDocs: GeneratedDoc[] = selectedTemplates.map((t, i) => {
      const tpl = TEMPLATE_OPTIONS.find(o => o.id === t)!;
      return {
        id: `d-gen-${Date.now()}-${i}`,
        name: `${rfp.groupName} — ${tpl.label}`,
        date: new Date().toISOString().split('T')[0],
        format: t === 'rate' ? 'XLSX' : 'PDF',
        size: t === 'rate' ? '148 KB' : `${(Math.random() * 2 + 1.5).toFixed(1)} MB`,
        rfpId: rfp.id,
        groupName: rfp.groupName,
        status: 'generating' as const,
      };
    });
    setDocs(prev => [...newDocs, ...prev]);
    setShowGenerate(false);

    setTimeout(() => {
      setDocs(prev => prev.map(d => newDocs.find(n => n.id === d.id) ? { ...d, status: 'ready' as const } : d));
      setGenerating(false);
    }, 2500);
  };

  const handleSend = (docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'sent' } : d));
  };

  const statusIcon = (status: GeneratedDoc['status']) => {
    if (status === 'generating') return <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />;
    if (status === 'sent') return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
    return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proposal Generation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate and manage branded proposal documents</p>
        </div>
        <Button className="gap-2" onClick={() => setShowGenerate(true)}>
          <Sparkles className="w-4 h-4" /> Generate Proposal
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Generated', value: docs.length },
          { label: 'Pending Review', value: docs.filter(d => d.status === 'ready').length },
          { label: 'Sent to Client', value: docs.filter(d => d.status === 'sent').length },
          { label: 'Generating', value: docs.filter(d => d.status === 'generating').length },
        ].map(s => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quote Comparison */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><Layers className="w-4 h-4" /> Quote Comparison — Midwest Manufacturing Corp</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Feature</th>
                {MOCK_SCENARIOS.map(s => (
                  <th key={s.id} className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {[
                { label: 'Contract Basis', values: MOCK_SCENARIOS.map(s => s.contractBasis) },
                { label: 'Specific Deductible', values: MOCK_SCENARIOS.map(s => `$${s.specificDeductible.toLocaleString()}`) },
                { label: 'Specific Rate (PEPM)', values: MOCK_SCENARIOS.map(s => s.specificFinalRate ? `$${s.specificFinalRate.toFixed(2)}` : '—') },
                { label: 'Aggregate Rate (PEPM)', values: MOCK_SCENARIOS.map(s => s.aggregateFinalRate ? `$${s.aggregateFinalRate.toFixed(2)}` : '—') },
                { label: 'Composite Rate (PEPM)', values: MOCK_SCENARIOS.map(s => s.compositeFinalRate ? `$${s.compositeFinalRate.toFixed(2)}` : '—') },
                { label: 'Total Annual Premium', values: MOCK_SCENARIOS.map(s => s.totalAnnualPremium ? `$${s.totalAnnualPremium.toLocaleString()}` : '—') },
                { label: 'Rate Cap', values: MOCK_SCENARIOS.map(s => s.rateCapPercent ? `${s.rateCapPercent}% (+$${s.rateCapPremiumAdder?.toFixed(2)})` : '—') },
                { label: 'No New Lasers', values: MOCK_SCENARIOS.map(s => s.noNewLasers ? `Yes (+$${s.noNewLaserPremiumAdder?.toFixed(2)})` : 'No') },
                { label: 'ASD', values: MOCK_SCENARIOS.map(s => s.aggregatingSpecificDeductible ? `$${s.aggregatingSpecificDeductible.toLocaleString()} (-$${s.asdPremiumReduction?.toFixed(2)})` : '—') },
                { label: 'UW Adjustment', values: MOCK_SCENARIOS.map(s => `${s.uwAdjustmentFactor}x`) },
              ].map(row => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-2.5 px-4 text-muted-foreground">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className={`py-2.5 px-4 text-center font-medium ${row.label === 'Monthly Rate (PEPM)' ? 'text-primary font-bold' : 'text-foreground'}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Generated Proposals */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Generated Proposals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    {statusIcon(doc.status)}
                    {doc.status === 'sent' && <Badge variant="outline" className="text-[10px] border-success/40 text-success">Sent</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{doc.format} • {doc.size} • Generated {doc.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setPreviewDoc(doc)} disabled={doc.status === 'generating'}>
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5" disabled={doc.status === 'generating'}>
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleSend(doc.id)} disabled={doc.status !== 'ready'}>
                  <Send className="w-3.5 h-3.5" /> Send
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Generate Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Select Case</label>
              <Select value={selectedRfp} onValueChange={setSelectedRfp}>
                <SelectTrigger><SelectValue placeholder="Choose a quoted RFP..." /></SelectTrigger>
                <SelectContent className="z-[200]" position="popper" sideOffset={4}>
                  {quotedRfps.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      #{r.caseNumber} — {r.groupName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Document Templates</label>
              <div className="space-y-2">
                {TEMPLATE_OPTIONS.map(t => (
                  <label key={t.id} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={selectedTemplates.includes(t.id)}
                      onCheckedChange={(checked) => {
                        setSelectedTemplates(prev => checked ? [...prev, t.id] : prev.filter(x => x !== t.id));
                      }}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerate(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!selectedRfp || selectedTemplates.length === 0} className="gap-2">
              <Sparkles className="w-4 h-4" /> Generate {selectedTemplates.length} Document{selectedTemplates.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          {previewDoc && (
            <div className="space-y-6 py-4">
              <div className="border rounded-lg p-6 bg-background">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-bold text-foreground">Stop-Loss Insurance Proposal</h2>
                  <p className="text-sm text-muted-foreground mt-1">{previewDoc.groupName}</p>
                  <p className="text-xs text-muted-foreground">Prepared {previewDoc.date}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Group Name</p>
                    <p className="font-medium text-foreground">{previewDoc.groupName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Effective Date</p>
                    <p className="font-medium text-foreground">07/01/2026</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Enrolled Lives</p>
                    <p className="font-medium text-foreground">285</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Industry</p>
                    <p className="font-medium text-foreground">Special Industry Machinery (SIC 3559)</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Rate Summary</h3>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-muted-foreground">Scenario</th>
                        <th className="text-right py-2 text-muted-foreground">Spec. Ded.</th>
                        <th className="text-right py-2 text-muted-foreground">PEPM Rate</th>
                        <th className="text-right py-2 text-muted-foreground">Annual Est.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SCENARIOS.map(s => (
                        <tr key={s.id} className="border-b last:border-0">
                          <td className="py-2 font-medium text-foreground">{s.name}</td>
                          <td className="py-2 text-right text-foreground">${s.specificDeductible.toLocaleString()}</td>
                          <td className="py-2 text-right font-bold text-primary">{s.finalRate ? `$${s.finalRate.toFixed(2)}` : '—'}</td>
                          <td className="py-2 text-right text-foreground">{s.finalRate ? `$${(s.finalRate * 285 * 12).toLocaleString()}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center italic">This is a mock preview. In production, the full branded PDF would render here.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
