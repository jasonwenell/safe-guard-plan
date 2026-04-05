import { MOCK_POLICIES } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const renewals = MOCK_POLICIES.filter(p => p.status === 'ACTIVE').map(p => ({
  ...p,
  renewalDueDate: new Date(new Date(p.expirationDate).getTime() - 9 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  renewalStatus: Math.random() > 0.5 ? 'pending' : Math.random() > 0.5 ? 'in_progress' : 'created',
  daysUntilExpiry: Math.ceil((new Date(p.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
}));

export default function Renewals() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Renewal Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Auto-create and track policy renewals at 8-9 month lead time</p>
        </div>
        <Button variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> Check for Renewals</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/15 flex items-center justify-center"><Clock className="w-5 h-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{renewals.filter(r => r.renewalStatus === 'pending').length}</p>
              <p className="text-xs text-muted-foreground">Pending Renewals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/15 flex items-center justify-center"><RefreshCw className="w-5 h-5 text-info" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{renewals.filter(r => r.renewalStatus === 'in_progress').length}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">{renewals.filter(r => r.renewalStatus === 'created').length}</p>
              <p className="text-xs text-muted-foreground">RFP Created</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewals Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Upcoming Renewals</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Policy #</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Group</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">TPA</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Expiration</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Days Left</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Renewal Due</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map(r => (
                <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/30 ${r.daysUntilExpiry < 90 ? 'border-l-2 border-l-warning' : ''}`}>
                  <td className="py-2.5 px-4 font-mono text-xs">{r.policyNumber}</td>
                  <td className="py-2.5 px-4 font-medium text-foreground">{r.groupName}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{r.tpaName}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{new Date(r.expirationDate).toLocaleDateString()}</td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs font-medium ${r.daysUntilExpiry < 60 ? 'text-destructive' : r.daysUntilExpiry < 120 ? 'text-warning' : 'text-muted-foreground'}`}>
                      {r.daysUntilExpiry}d
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground">{r.renewalDueDate}</td>
                  <td className="py-2.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.renewalStatus === 'created' ? 'bg-success/15 text-success' :
                      r.renewalStatus === 'in_progress' ? 'bg-info/15 text-info' :
                      'bg-warning/15 text-warning'
                    }`}>
                      {r.renewalStatus === 'created' ? 'RFP Created' : r.renewalStatus === 'in_progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {r.renewalStatus === 'pending' && (
                      <Button size="sm" className="h-7 text-xs">Create Renewal RFP</Button>
                    )}
                    {r.renewalStatus !== 'pending' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
