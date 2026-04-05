import { useState } from 'react';
import { MOCK_RFPS } from '@/data/mockData';
import { RFP, RFPStatus, STATUS_LABELS } from '@/types/sleq';
import { StatusBadge, RushBadge, DuplicateBadge, AIBadge, TypeBadge, CensusStatusPill, SetupStatusPill } from '@/components/shared/StatusBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function RFPQuoteLog() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filtered = MOCK_RFPS.filter(rfp => {
    const matchesSearch = search === '' || 
      rfp.groupName.toLowerCase().includes(search.toLowerCase()) ||
      rfp.caseNumber.toString().includes(search) ||
      rfp.tpaCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rfp.status === statusFilter;
    const matchesType = typeFilter === 'all' || rfp.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RFP Quote Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} cases</p>
        </div>
        <Link to="/rfps/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New RFP
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-3 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search group, case #, TPA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="RENEWAL">Renewal</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Filter className="w-3.5 h-3.5" /> My Queue
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground w-[70px]">Case #</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground w-[60px]">Type</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Group Name</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">TPA</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Producer</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Carrier</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Eff. Date</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Request</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">UW</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground" title="Census">C</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground" title="SoB">S</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground" title="Risk">R</th>
                  <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground" title="Rating">Rt</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rfp) => (
                  <tr
                    key={rfp.id}
                    className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${rfp.isRush ? 'border-l-[3px] border-l-destructive' : ''}`}
                  >
                    <td className="py-2.5 px-3 font-mono text-xs font-medium">{rfp.caseNumber}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={rfp.status} /></td>
                    <td className="py-2.5 px-3"><TypeBadge type={rfp.type} /></td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-medium text-foreground truncate max-w-[180px]">{rfp.groupName}</span>
                        {rfp.isRush && <RushBadge />}
                        {rfp.isDuplicate && <DuplicateBadge caseNumber={rfp.duplicateCaseNumber} />}
                        {rfp.aiConfidenceScore && <AIBadge confidence={rfp.aiConfidenceScore} />}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">{rfp.tpaCode}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs truncate max-w-[120px]">{rfp.producerName}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">{rfp.carrierName}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">{new Date(rfp.effectiveDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs">{new Date(rfp.requestDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-xs truncate max-w-[100px]">{rfp.assignedUWName || '—'}</td>
                    <td className="py-2.5 px-3 text-center"><CensusStatusPill status={rfp.censusStatus} /></td>
                    <td className="py-2.5 px-3 text-center"><SetupStatusPill status={rfp.sobStatus} /></td>
                    <td className="py-2.5 px-3 text-center"><SetupStatusPill status={rfp.riskAssessmentStatus} /></td>
                    <td className="py-2.5 px-3 text-center"><SetupStatusPill status={rfp.ratingSystemStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Bar */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
        <span>{MOCK_RFPS.filter(r => r.status !== RFPStatus.DECLINED && r.status !== RFPStatus.LOST && r.status !== RFPStatus.WON).length} Active</span>
        <span>•</span>
        <span>{MOCK_RFPS.filter(r => r.isRush).length} Rush</span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive" /> Not Started
          <span className="w-2 h-2 rounded-full bg-warning" /> In Progress
          <span className="w-2 h-2 rounded-full bg-success" /> Complete
        </span>
      </div>
    </div>
  );
}
