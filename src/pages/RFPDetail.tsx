import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_RFPS, MOCK_CARRIERS, MOCK_TPAS, MOCK_PRODUCERS } from '@/data/mockData';
import { StatusBadge, RushBadge, TypeBadge } from '@/components/shared/StatusBadges';
import { STATUS_LABELS } from '@/types/sleq';

// AI-highlighted input wrapper
const aiHighlight = "ring-2 ring-amber-300 border-amber-400 bg-amber-50/60";
const aiAccepted = "ring-1 ring-green-300 border-green-300 bg-green-50/40";

function AiFieldLabel({ label, required, aiPopulated, accepted }: { label: string; required?: boolean; aiPopulated?: boolean; accepted?: boolean }) {
  return (
    <Label className="text-xs flex items-center gap-1.5">
      {label}{required && ' *'}
      {aiPopulated && !accepted && (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded px-1 py-0.5">
          <Sparkles className="w-3 h-3" /> AI
        </span>
      )}
      {aiPopulated && accepted && (
        <CheckCircle2 className="w-3 h-3 text-green-600" />
      )}
    </Label>
  );
}

export default function RFPDetail() {
  const { id } = useParams<{ id: string }>();
  const rfp = id ? MOCK_RFPS.find(r => r.id === id) : null;
  const isNew = !rfp;

  const [isRush, setIsRush] = useState(rfp?.isRush ?? false);

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      <div className="flex items-center gap-3">
        <Link to="/rfps">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isNew ? 'New RFP' : `Case ${rfp.caseNumber}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNew ? 'Create a new quote request' : (
              <span className="flex items-center gap-2">
                {rfp.groupName}
                <StatusBadge status={rfp.status} />
                <TypeBadge type={rfp.type} />
                {rfp.isRush && <RushBadge />}
              </span>
            )}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Upload Documents
          </Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" /> Save RFP
          </Button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-ai-bg border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">
            {isNew
              ? 'AI auto-populated 0 fields from 0 documents. Upload documents to extract data automatically.'
              : `AI auto-populated fields from intake. Review highlighted values below.`}
          </p>
        </div>
        <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">Accept All</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Information */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Group Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Group Name *</Label>
              <Input defaultValue={rfp?.groupName ?? ''} placeholder="Enter group name (fuzzy search active)" />
              <p className="text-[10px] text-muted-foreground">No # or / characters. Typing triggers duplicate/renewal detection.</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">DBA Name</Label>
              <Input placeholder="Doing Business As (optional)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">SIC Code *</Label>
                <Input defaultValue={rfp?.sicCode ?? ''} placeholder="e.g. 3559" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">SIC Description</Label>
                <Input readOnly defaultValue={rfp?.sicDescription ?? ''} placeholder="Auto-populated" className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Situs ZIP *</Label>
                <Input defaultValue={''} placeholder="55401" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">State</Label>
                <Input readOnly defaultValue={rfp?.state ?? ''} placeholder="Auto" className="bg-muted/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Employees</Label>
                <Input type="number" defaultValue={rfp?.employeeCount ?? ''} placeholder="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TPA / Producer / Carrier */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">TPA / Producer / Carrier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">TPA *</Label>
              <Select defaultValue={rfp?.tpaId ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Type to search TPA..." /></SelectTrigger>
                <SelectContent>
                  {MOCK_TPAS.filter(t => t.isActive).map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.code} — {t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Producer *</Label>
              <Select defaultValue={rfp?.producerId ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Type to search Producer..." /></SelectTrigger>
                <SelectContent>
                  {MOCK_PRODUCERS.filter(p => p.isActive).map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Carrier *</Label>
              <Select defaultValue={rfp?.carrierId ?? 'c1'}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_CARRIERS.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Contact</Label>
              <Input defaultValue={rfp?.producerName ?? ''} placeholder="Contact name" />
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Dates & Case Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Effective Date *</Label>
                <Input type="date" defaultValue={rfp?.effectiveDate ?? ''} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Received Date</Label>
                <Input type="date" defaultValue={rfp?.requestDate ?? new Date().toISOString().split('T')[0]} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Request Date</Label>
                <Input type="date" defaultValue={rfp?.requestDate ?? ''} readOnly className="bg-muted/50" placeholder="Auto-calculated" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">TPAC Date</Label>
                <Input type="date" readOnly className="bg-muted/50" placeholder="5 biz days" />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Type *</Label>
                <Select defaultValue={rfp?.type ?? 'NEW'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New Business</SelectItem>
                    <SelectItem value="RENEWAL">Renewal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Switch checked={isRush} onCheckedChange={setIsRush} />
                <Label className="text-xs font-medium">Rush Case</Label>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Assigned Underwriter</Label>
              <Select defaultValue={rfp?.assignedUWId ?? undefined}>
                <SelectTrigger><SelectValue placeholder="Select UW by TPA..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="u3">Juice Montezon</SelectItem>
                  <SelectItem value="u4">Steve Rogers</SelectItem>
                  <SelectItem value="u8">Jeff Montezon</SelectItem>
                  <SelectItem value="u9">Vicki Christiansen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Setup Status */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Setup Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Census Status</Label>
                <Select defaultValue={rfp?.censusStatus ?? 'waiting'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="member_census">Member Census</SelectItem>
                    <SelectItem value="employee_census">Employee Census</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="apps">Apps</SelectItem>
                    <SelectItem value="sent_back">Sent Back</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Risk Assessment</Label>
                <Select defaultValue={rfp?.riskAssessmentStatus ?? 'not_started'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="entered">Entered</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Summary of Benefits</Label>
                <Select defaultValue={rfp?.sobStatus ?? 'not_started'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="entered">Entered</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Rating System</Label>
                <Select defaultValue={rfp?.ratingSystemStatus ?? 'not_started'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="entered">Entered</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label className="text-xs">Setup Notes</Label>
              <Textarea defaultValue={rfp?.setupNotes ?? ''} placeholder="Notes about setup progress, missing items, etc." rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Upload Zone */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, XLSX, CSV, DOCX, MSG — up to 50MB each</p>
            <p className="text-xs text-muted-foreground mt-0.5">AI will classify and extract data from each document</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
