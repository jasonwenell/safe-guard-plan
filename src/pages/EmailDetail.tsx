import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_EMAIL_DETAILS, MOCK_RFPS } from '@/data/mockData';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/types/sleq';
import type { IntakeDocument, ExtractedField } from '@/types/sleq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Mail, Paperclip, Sparkles, Check, X, FileText,
  FileSpreadsheet, Eye, ExternalLink, Clock, AlertTriangle, CheckCircle2, Loader2
} from 'lucide-react';
import { useState } from 'react';

const docStatusConfig: Record<string, { color: string; icon: typeof Check }> = {
  queued: { color: 'bg-muted text-muted-foreground', icon: Clock },
  classifying: { color: 'bg-info/15 text-info border border-info/30', icon: Loader2 },
  extracting: { color: 'bg-primary/15 text-primary border border-primary/30', icon: Loader2 },
  review: { color: 'bg-warning/15 text-warning border border-warning/30', icon: AlertTriangle },
  accepted: { color: 'bg-success/15 text-success border border-success/30', icon: CheckCircle2 },
  rejected: { color: 'bg-destructive/15 text-destructive border border-destructive/30', icon: X },
  error: { color: 'bg-destructive/15 text-destructive border border-destructive/30', icon: AlertTriangle },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 90 ? 'bg-success' : pct >= 75 ? 'bg-warning' : 'bg-destructive';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">{pct}%</span>
    </div>
  );
}

function DocumentCard({ doc, onSelect }: { doc: IntakeDocument; onSelect: () => void }) {
  const sc = docStatusConfig[doc.processingStatus] || docStatusConfig.queued;
  const Icon = sc.icon;
  const FileIcon = doc.fileType === 'xlsx' || doc.fileType === 'csv' ? FileSpreadsheet : FileText;
  const isProcessing = doc.processingStatus === 'classifying' || doc.processingStatus === 'extracting';

  return (
    <div
      onClick={onSelect}
      className="border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <FileIcon className="w-4.5 h-4.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">{doc.fileName}</p>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.color}`}>
              <Icon className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
              {DOCUMENT_STATUS_LABELS[doc.processingStatus]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
            <span>{formatFileSize(doc.fileSize)}</span>
            {doc.pageCount && <span>{doc.pageCount} pages</span>}
            {doc.aiClassifiedType && (
              <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-ai-bg text-amber-700 rounded border border-amber-200">
                ✨ {DOCUMENT_TYPE_LABELS[doc.aiClassifiedType]}
                {doc.aiClassificationConfidence && ` ${Math.round(doc.aiClassificationConfidence * 100)}%`}
              </span>
            )}
          </div>
          {isProcessing && doc.processingProgress != null && (
            <Progress value={doc.processingProgress} className="h-1 mt-2" />
          )}
          {doc.extractedFields && doc.extractedFields.length > 0 && (
            <div className="mt-2 text-[10px] text-muted-foreground">
              {doc.extractedFields.length} fields extracted
            </div>
          )}
        </div>
        <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
      </div>
    </div>
  );
}

function DocumentDetailPanel({ doc, onClose }: { doc: IntakeDocument; onClose: () => void }) {
  const FileIcon = doc.fileType === 'xlsx' || doc.fileType === 'csv' ? FileSpreadsheet : FileText;
  const sc = docStatusConfig[doc.processingStatus] || docStatusConfig.queued;
  const StatusIcon = sc.icon;

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileIcon className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold truncate">{doc.fileName}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-muted-foreground">File Size</p>
            <p className="font-medium text-foreground">{formatFileSize(doc.fileSize)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium text-foreground">{doc.pageCount ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.color}`}>
              <StatusIcon className="w-3 h-3" />
              {DOCUMENT_STATUS_LABELS[doc.processingStatus]}
            </span>
          </div>
          <div>
            <p className="text-muted-foreground">Source</p>
            <p className="font-medium text-foreground capitalize">{doc.uploadSource}</p>
          </div>
        </div>

        {/* AI Classification */}
        {doc.aiClassifiedType && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Classification
              </p>
              <div className="flex items-center justify-between bg-ai-bg rounded px-3 py-2 border border-amber-200">
                <span className="text-xs font-medium text-amber-800">{DOCUMENT_TYPE_LABELS[doc.aiClassifiedType]}</span>
                {doc.aiClassificationConfidence && <ConfidenceBar confidence={doc.aiClassificationConfidence} />}
              </div>
            </div>
          </>
        )}

        {/* Extracted Fields */}
        {doc.extractedFields && doc.extractedFields.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Extracted Data</p>
              <div className="space-y-1.5">
                {doc.extractedFields.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded px-2 py-1.5 bg-muted/50 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {f.accepted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                      )}
                      <span className="text-muted-foreground">{f.fieldName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{f.value}</span>
                      <ConfidenceBar confidence={f.confidence} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Errors */}
        {doc.errors && doc.errors.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-xs font-medium text-destructive mb-2">Errors</p>
              {doc.errors.map((e, i) => (
                <p key={i} className="text-xs text-destructive/80 bg-destructive/10 rounded px-2 py-1.5 mb-1">{e}</p>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <Separator />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-1 text-xs"><Eye className="w-3 h-3" /> Preview</Button>
          {doc.processingStatus === 'review' && (
            <Button size="sm" className="flex-1 gap-1 text-xs"><Check className="w-3 h-3" /> Accept All</Button>
          )}
          {doc.processingStatus === 'queued' && (
            <Button size="sm" className="flex-1 gap-1 text-xs"><Sparkles className="w-3 h-3" /> Process Now</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmailDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const email = MOCK_EMAIL_DETAILS.find(e => e.id === id);
  const [selectedDoc, setSelectedDoc] = useState<IntakeDocument | null>(null);

  if (!email) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Email not found.</p>
        <Link to="/email-intake"><Button variant="link" className="px-0">← Back to Inbox</Button></Link>
      </div>
    );
  }

  const linkedRfp = email.linkedRfpId ? MOCK_RFPS.find(r => r.id === email.linkedRfpId) : null;

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/email-intake">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-foreground truncate">{email.subject}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            From: {email.fromName} &lt;{email.fromAddress}&gt; • {new Date(email.receivedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {email.processingStatus === 'pending' && (
            <Button className="gap-2 text-sm">
              <Sparkles className="w-4 h-4" /> Process with AI
            </Button>
          )}
          {email.processingStatus === 'completed' && !email.rfpId && (
            <Button className="gap-2 text-sm" onClick={() => navigate('/rfps/new')}>
              <ExternalLink className="w-4 h-4" /> Create RFP
            </Button>
          )}
          {linkedRfp && (
            <Button variant="outline" className="gap-2 text-sm" onClick={() => navigate(`/rfps/${linkedRfp.id}`)}>
              <Eye className="w-4 h-4" /> View Case #{linkedRfp.caseNumber}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Email Content + AI Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Summary */}
          {email.aiSummary && (
            <div className="bg-ai-bg border border-amber-200 rounded-lg px-4 py-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-1">AI Summary</p>
                  <p className="text-sm text-amber-900">{email.aiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email Body */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Email Content</CardTitle>
                {email.threadCount && email.threadCount > 1 && (
                  <Badge variant="secondary" className="text-[10px]">{email.threadCount} messages in thread</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {email.bodyPreview}
              </div>
            </CardContent>
          </Card>

          {/* AI Extracted Fields */}
          {email.aiExtractedFields && email.aiExtractedFields.length > 0 && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <CardTitle className="text-sm font-semibold">AI-Extracted Fields</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{email.aiExtractedFields.length} fields</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Check className="w-3 h-3" /> Accept All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {email.aiExtractedFields.map((f, i) => (
                    <div key={i} className={`flex items-center justify-between rounded px-3 py-2 text-xs ${f.accepted ? 'bg-success/5 border border-success/20' : 'bg-muted/50'}`}>
                      <div className="flex items-center gap-2">
                        {f.accepted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        )}
                        <span className="text-muted-foreground w-32">{f.fieldName}</span>
                        <span className="font-medium text-foreground">{f.value}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {f.sourceLocation && (
                          <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{f.sourceLocation}</span>
                        )}
                        <ConfidenceBar confidence={f.confidence} />
                        {!f.accepted && (
                          <div className="flex gap-0.5">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Check className="w-3 h-3 text-success" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><X className="w-3 h-3 text-destructive" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Documents Panel */}
        <div className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">Attachments ({email.documents.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {email.documents.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No attachments</p>
              ) : (
                email.documents.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} onSelect={() => setSelectedDoc(doc)} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Document Detail */}
          {selectedDoc && (
            <DocumentDetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
