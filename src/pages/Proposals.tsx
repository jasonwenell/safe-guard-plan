import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send, Eye, Layers } from 'lucide-react';
import { MOCK_SCENARIOS } from '@/data/mockData';

export default function Proposals() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proposal Generation</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Generate and manage branded proposal documents</p>
        </div>
        <Button className="gap-2"><FileText className="w-4 h-4" /> Generate Proposal</Button>
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
                { label: 'Aggregate Deductible', values: MOCK_SCENARIOS.map(s => s.aggregateDeductible ? `$${s.aggregateDeductible.toLocaleString()}` : '—') },
                { label: 'Monthly Rate (PEPM)', values: MOCK_SCENARIOS.map(s => s.finalRate ? `$${s.finalRate.toFixed(2)}` : '—') },
                { label: 'Annual Premium (est.)', values: MOCK_SCENARIOS.map(s => s.finalRate ? `$${(s.finalRate * 285 * 12).toLocaleString()}` : '—') },
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
          {[
            { name: 'Midwest Manufacturing Corp — Full Proposal', date: '2026-04-04', format: 'PDF', size: '2.4 MB' },
            { name: 'Midwest Manufacturing Corp — Rate Summary', date: '2026-04-04', format: 'XLSX', size: '156 KB' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.format} • {doc.size} • Generated {doc.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5"><Eye className="w-3.5 h-3.5" /> Preview</Button>
                <Button variant="ghost" size="sm" className="gap-1.5"><Download className="w-3.5 h-3.5" /> Download</Button>
                <Button variant="outline" size="sm" className="gap-1.5"><Send className="w-3.5 h-3.5" /> Send</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
