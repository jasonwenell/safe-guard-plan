import { MOCK_EMAILS } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Mail, Paperclip, Check, X, Loader2, SkipForward, Eye } from 'lucide-react';
import { useState } from 'react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/15 text-warning border border-warning/30', icon: Mail },
  processing: { label: 'Processing', color: 'bg-info/15 text-info border border-info/30', icon: Loader2 },
  completed: { label: 'Ready', color: 'bg-success/15 text-success border border-success/30', icon: Check },
  failed: { label: 'Failed', color: 'bg-destructive/15 text-destructive border border-destructive/30', icon: X },
  skipped: { label: 'Skipped', color: 'bg-muted text-muted-foreground border border-border', icon: SkipForward },
};

export default function EmailIntake() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_EMAILS.filter(e =>
    search === '' ||
    e.subject.toLowerCase().includes(search.toLowerCase()) ||
    e.fromName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Email Intake</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-powered inbox monitoring — quotes@tpac.com</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Inbox
        </Button>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search emails..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground w-[100px]">Status</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">From</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">TPA (AI)</th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Group (AI)</th>
                <th className="text-center py-2.5 px-4 text-xs font-medium text-muted-foreground w-[40px]"><Paperclip className="w-3.5 h-3.5 mx-auto" /></th>
                <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Received</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((email) => {
                const sc = statusConfig[email.processingStatus];
                const Icon = sc.icon;
                return (
                  <tr key={email.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${sc.color}`}>
                        <Icon className={`w-3 h-3 ${email.processingStatus === 'processing' ? 'animate-spin' : ''}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <div>
                        <p className="font-medium text-foreground text-xs">{email.fromName}</p>
                        <p className="text-[10px] text-muted-foreground">{email.fromAddress}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-foreground text-xs truncate max-w-[300px]">{email.subject}</td>
                    <td className="py-2.5 px-4">
                      {email.tpaDetected ? (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-ai-bg text-amber-700 rounded border border-amber-200">
                          ✨ {email.tpaDetected}
                        </span>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-2.5 px-4 text-xs text-foreground truncate max-w-[180px]">{email.groupDetected || '—'}</td>
                    <td className="py-2.5 px-4 text-center text-xs text-muted-foreground">{email.attachmentCount || '—'}</td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground">{new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {email.processingStatus === 'completed' && !email.rfpId && (
                          <Button size="sm" variant="default" className="h-7 text-xs">Create RFP</Button>
                        )}
                        {email.processingStatus === 'completed' && email.rfpId && (
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Eye className="w-3 h-3" /> View RFP</Button>
                        )}
                        {email.processingStatus === 'pending' && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">Process</Button>
                        )}
                        {email.processingStatus !== 'skipped' && (
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground">Skip</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
