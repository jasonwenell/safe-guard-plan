import { MOCK_POLICIES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Shield, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function PolicyAdmin() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_POLICIES.filter(p =>
    search === '' ||
    p.groupName.toLowerCase().includes(search.toLowerCase()) ||
    p.policyNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Policy Administration</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage active policies, premiums, and amendments</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Issue Policy</Button>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={Shield} label="Active Policies" value={MOCK_POLICIES.filter(p => p.status === 'ACTIVE').length} />
        <SummaryCard icon={DollarSign} label="Total Premium" value={`$${(MOCK_POLICIES.filter(p => p.status === 'ACTIVE').reduce((s, p) => s + (p.premiumAmount || 0), 0) / 1000000).toFixed(1)}M`} />
        <SummaryCard icon={Shield} label="Expiring (90 days)" value={2} />
        <SummaryCard icon={Shield} label="Expired" value={MOCK_POLICIES.filter(p => p.status === 'EXPIRED').length} />
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Policy #</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Group</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Carrier</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">TPA</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Effective</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Expiration</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Premium</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="py-2.5 px-4 font-mono text-xs font-medium text-primary">{p.policyNumber}</td>
                  <td className="py-2.5 px-4 font-medium text-foreground">{p.groupName}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{p.carrierName}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{p.tpaName}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{new Date(p.effectiveDate).toLocaleDateString()}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{new Date(p.expirationDate).toLocaleDateString()}</td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'ACTIVE' ? 'bg-success/15 text-success' : p.status === 'EXPIRED' ? 'bg-muted text-muted-foreground' : 'bg-destructive/15 text-destructive'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right text-xs font-medium">{p.premiumAmount ? `$${p.premiumAmount.toLocaleString()}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
