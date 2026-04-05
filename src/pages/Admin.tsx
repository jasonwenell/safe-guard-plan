import { useState } from 'react';
import { MOCK_CARRIERS, MOCK_TPAS, MOCK_PRODUCERS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Settings, Users, Building, Shield, Hash, UserCog, AlertTriangle } from 'lucide-react';

export default function Admin() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Administration</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage reference data, users, and system configuration</p>
      </div>

      <Tabs defaultValue="tpas">
        <TabsList className="flex-wrap">
          <TabsTrigger value="tpas" className="gap-1.5"><Building className="w-3.5 h-3.5" /> TPAs</TabsTrigger>
          <TabsTrigger value="producers" className="gap-1.5"><Users className="w-3.5 h-3.5" /> Producers</TabsTrigger>
          <TabsTrigger value="carriers" className="gap-1.5"><Shield className="w-3.5 h-3.5" /> Carriers</TabsTrigger>
          <TabsTrigger value="sic" className="gap-1.5"><Hash className="w-3.5 h-3.5" /> SIC Codes</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><UserCog className="w-3.5 h-3.5" /> Users</TabsTrigger>
          <TabsTrigger value="rules" className="gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Prompt Rules</TabsTrigger>
          <TabsTrigger value="uw-config" className="gap-1.5"><Settings className="w-3.5 h-3.5" /> UW Assignment</TabsTrigger>
        </TabsList>

        {/* TPAs */}
        <TabsContent value="tpas" className="mt-6">
          <AdminTable
            title="TPA Management"
            addLabel="Add TPA"
            columns={['Code', 'Name', 'Active', 'Default Carrier', 'Renewal Lead', 'Member Census']}
            rows={MOCK_TPAS.map(t => [
              t.code,
              t.name,
              t.isActive ? '✓' : '✗',
              MOCK_CARRIERS.find(c => c.id === t.defaultCarrierId)?.name || '—',
              `${t.renewalLeadMonths} mo`,
              t.requiresMemberCensus ? 'Yes' : 'No',
            ])}
          />
        </TabsContent>

        {/* Producers */}
        <TabsContent value="producers" className="mt-6">
          <AdminTable
            title="Producer Management"
            addLabel="Add Producer"
            columns={['Code', 'Name', 'Active', 'Is TPA', 'Linked TPA']}
            rows={MOCK_PRODUCERS.map(p => [
              p.code,
              p.name,
              p.isActive ? '✓' : '✗',
              p.isTPA ? 'Yes' : 'No',
              MOCK_TPAS.find(t => t.id === p.linkedTPAId)?.name || '—',
            ])}
          />
        </TabsContent>

        {/* Carriers */}
        <TabsContent value="carriers" className="mt-6">
          <AdminTable
            title="Carrier Management"
            addLabel="Add Carrier"
            columns={['Code', 'Name', 'Active', 'Min Lives', 'Max Lives', 'Quotable States']}
            rows={MOCK_CARRIERS.map(c => [
              c.code,
              c.name,
              c.isActive ? '✓' : '✗',
              c.minLives?.toString() || '—',
              c.maxLives?.toString() || '—',
              `${c.quotableStates.length} states`,
            ])}
          />
        </TabsContent>

        {/* SIC Codes */}
        <TabsContent value="sic" className="mt-6">
          <AdminTable
            title="Allowed SIC Codes"
            addLabel="Add SIC Code"
            columns={['SIC Code', 'Description', 'Carrier', 'Active']}
            rows={[
              ['0100', 'Cash Grains', 'All', '✓'],
              ['1522', 'General Contractors - Residential', 'All', '✓'],
              ['2752', 'Commercial Printing, Lithographic', 'All', '✓'],
              ['3559', 'Special Industry Machinery', 'All', '✓'],
              ['4731', 'Freight Transportation Arrangement', 'All', '✓'],
              ['7011', 'Hotels & Motels', 'BHSI only', '✓'],
              ['8062', 'General Medical & Surgical Hospitals', 'All', '✓'],
              ['8211', 'Elementary & Secondary Schools', 'All', '✓'],
            ]}
          />
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-6">
          <AdminTable
            title="User Management"
            addLabel="Add User"
            columns={['Name', 'Email', 'Role', 'Active']}
            rows={[
              ['Traci Gamer', 'traci@tpac.com', 'UW Assistant', '✓'],
              ['Trevor Pakratz', 'trevor@tpac.com', 'UW Assistant', '✓'],
              ['Heidi Bouma', 'heidi@tpac.com', 'UW Associate', '✓'],
              ['Angie Vollhaber', 'angie@tpac.com', 'UW Associate', '✓'],
              ['Polly Brohaugh', 'polly@tpac.com', 'UW Associate', '✓'],
              ['Juice Montezon', 'juice@tpac.com', 'Lead Underwriter', '✓'],
              ['Steve Rogers', 'steve@tpac.com', 'Lead Underwriter', '✓'],
              ['Jeff Montezon', 'jeff@tpac.com', 'Lead Underwriter', '✓'],
              ['Vicki Christiansen', 'vicki@tpac.com', 'Lead Underwriter', '✓'],
              ['Caleb Sieben', 'caleb@tpac.com', 'Risk Analyst', '✓'],
              ['Ryan', 'ryan@tpac.com', 'Operations Lead', '✓'],
            ]}
          />
        </TabsContent>

        {/* Prompt Rules */}
        <TabsContent value="rules" className="mt-6">
          <AdminTable
            title="Process Exception / Prompt Rules"
            addLabel="Add Rule"
            columns={['TPA', 'Producer', 'Type', 'Action', 'Message', 'Active']}
            rows={[
              ['ASR', '—', 'EHRC', 'PROMPT', 'Is this an EHRC case? Special handling required.', '✓'],
              ['IMS', 'MARSH', 'MASP', 'WARN', 'MASP case — verify Medicare Advantage eligibility', '✓'],
              ['CCAE', '—', 'CUSTOM', 'PROMPT', 'Cub Cabbage requires 12/18 contract basis default', '✓'],
              ['—', '—', 'TERMINATED', 'DECLINE', 'Terminated relationship — auto-decline', '✓'],
            ]}
          />
        </TabsContent>

        {/* UW Assignment Config */}
        <TabsContent value="uw-config" className="mt-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">UW Assignment Configuration</CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add UW</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Juice Montezon', pct: 30, active: true },
                { name: 'Steve Rogers', pct: 30, active: true },
                { name: 'Jeff Montezon', pct: 25, active: true },
                { name: 'Vicki Christiansen', pct: 15, active: true },
              ].map(uw => (
                <div key={uw.name} className="flex items-center gap-4 bg-muted/50 rounded-lg px-4 py-3 border">
                  <span className="text-sm font-medium text-foreground flex-1">{uw.name}</span>
                  <div className="flex items-center gap-2 w-48">
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${uw.pct}%` }} />
                    </div>
                    <span className="text-xs font-mono font-medium w-8 text-right">{uw.pct}%</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uw.active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}>
                    {uw.active ? 'Active' : 'Inactive'}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center">Total: 100% — New business is distributed by these percentages</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminTable({ title, addLabel, columns, rows }: { title: string; addLabel: string; columns: string[]; rows: string[][] }) {
  const [search, setSearch] = useState('');
  const filtered = rows.filter(r => search === '' || r.some(cell => cell.toLowerCase().includes(search.toLowerCase())));

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <Button size="sm" className="gap-1.5 h-8"><Plus className="w-3.5 h-3.5" /> {addLabel}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map(c => (
                <th key={c} className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">{c}</th>
              ))}
              <th className="text-right py-2 px-4 text-xs font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                {row.map((cell, j) => (
                  <td key={j} className={`py-2 px-4 text-xs ${j === 0 ? 'font-mono font-medium text-foreground' : 'text-muted-foreground'} ${cell === '✓' ? 'text-success' : cell === '✗' ? 'text-destructive' : ''}`}>
                    {cell}
                  </td>
                ))}
                <td className="py-2 px-4 text-right">
                  <Button variant="ghost" size="sm" className="h-6 text-xs">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
