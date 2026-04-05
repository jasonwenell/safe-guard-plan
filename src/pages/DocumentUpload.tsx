import { useState, useCallback } from 'react';
import { MOCK_MANUAL_DOCUMENTS, MOCK_RFPS } from '@/data/mockData';
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/types/sleq';
import type { IntakeDocument } from '@/types/sleq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Upload, Search, FileText, FileSpreadsheet, Sparkles, Check, X, Eye,
  Clock, AlertTriangle, CheckCircle2, Loader2, FolderOpen
} from 'lucide-react';
import { useIntakeDocuments, useUploadDocument, useProcessDocument, useAcceptAllFields } from '@/hooks/useIntake';
import { toast } from 'sonner';

const docStatusConfig: Record<string, { color: string; icon: typeof Check }> = {
  queued: { color: 'bg-muted text-muted-foreground', icon: Clock },
  classifying: { color: 'bg-info/15 text-info border border-info/30', icon: Loader2 },
  extracting: { color: 'bg-primary/15 text-primary border border-primary/30', icon: Loader2 },
  review: { color: 'bg-warning/15 text-warning border border-warning/30', icon: AlertTriangle },
  accepted: { color: 'bg-success/15 text-success border border-success/30', icon: CheckCircle2 },
  rejected: { color: 'bg-destructive/15 text-destructive border border-destructive/30', icon: X },
  error: { color: 'bg-destructive/15 text-destructive border border-destructive/30', icon: AlertTriangle },
};

const DOC_TYPE_LABELS: Record<string, string> = {
  census: 'Census', sob: 'Summary of Benefits', experience: 'Experience/Claims',
  application: 'Application', rfp_letter: 'RFP Letter', id_cards: 'ID Cards', unknown: 'Unknown',
};
const DOC_STATUS_LABELS: Record<string, string> = {
  queued: 'Queued', classifying: 'Classifying', extracting: 'Extracting',
  review: 'Needs Review', accepted: 'Accepted', rejected: 'Rejected', error: 'Error',
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

export default function DocumentUpload() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: dbDocs, isLoading: isLoadingDb } = useIntakeDocuments();
  const uploadMutation = useUploadDocument();
  const processMutation = useProcessDocument();
  const acceptAllMutation = useAcceptAllFields();

  // Merge mock data as fallback with real DB docs
  const allDocs = dbDocs && dbDocs.length > 0
    ? dbDocs.map(d => ({
        ...d,
        extractedFields: (d as any).extracted_fields || [],
      }))
    : MOCK_MANUAL_DOCUMENTS.map(d => ({
        ...d,
        extractedFields: d.extractedFields || [],
      }));

  const filtered = allDocs.filter((d: any) => {
    const matchSearch = search === '' || d.file_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.processing_status === statusFilter;
    const matchType = typeFilter === 'all' || (d.ai_classified_type || d.document_type) === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const selectedDoc = selectedDocId ? allDocs.find((d: any) => d.id === selectedDocId) : null;

  const handleFileDrop = useCallback(async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const doc = await uploadMutation.mutateAsync(file);
        toast.success(`Uploaded ${file.name}`);
        // Auto-process
        processMutation.mutate({ documentId: doc.id, action: 'process' }, {
          onSuccess: () => toast.success(`AI processed ${file.name}`),
          onError: (e) => toast.error(`Processing failed: ${e.message}`),
        });
      } catch (e: any) {
        toast.error(`Upload failed: ${e.message}`);
      }
    }
  }, [uploadMutation, processMutation]);

  const stats = {
    total: allDocs.length,
    accepted: allDocs.filter((d: any) => d.processing_status === 'accepted').length,
    review: allDocs.filter((d: any) => d.processing_status === 'review').length,
    error: allDocs.filter((d: any) => d.processing_status === 'error').length,
    processing: allDocs.filter((d: any) => ['queued', 'classifying', 'extracting'].includes(d.processing_status)).length,
  };

  return (
    <div className="p-6 space-y-4 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Upload</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Upload and process documents with AI classification & extraction</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Accepted', value: stats.accepted, color: 'text-success' },
          { label: 'Needs Review', value: stats.review, color: 'text-warning' },
          { label: 'Errors', value: stats.error, color: 'text-destructive' },
          { label: 'Processing', value: stats.processing, color: 'text-info' },
        ].map(s => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Zone */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileDrop(e.dataTransfer.files); }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, XLSX, CSV, DOCX, MSG — up to 50MB each</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              AI will automatically classify and extract key data
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <label>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.xlsx,.csv,.docx,.msg,.xls"
                  onChange={(e) => handleFileDrop(e.target.files)}
                />
                <Button className="gap-2 pointer-events-none" tabIndex={-1}>
                  <Upload className="w-4 h-4" /> Upload Files
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Document List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Filters */}
          <Card className="border shadow-sm">
            <CardContent className="p-3 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="classifying">Classifying</SelectItem>
                  <SelectItem value="extracting">Extracting</SelectItem>
                  <SelectItem value="review">Needs Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="census">Census</SelectItem>
                  <SelectItem value="sob">Summary of Benefits</SelectItem>
                  <SelectItem value="experience">Experience/Claims</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="rfp_letter">RFP Letter</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Document Cards */}
          <div className="space-y-2">
            {isLoadingDb && (
              <Card className="border shadow-sm">
                <CardContent className="p-8 text-center text-muted-foreground text-sm">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading documents...
                </CardContent>
              </Card>
            )}
            {filtered.map((doc: any) => {
              const status = doc.processing_status || 'queued';
              const sc = docStatusConfig[status] || docStatusConfig.queued;
              const Icon = sc.icon;
              const fileType = doc.file_type || doc.fileType;
              const FileIcon = fileType === 'xlsx' || fileType === 'csv' ? FileSpreadsheet : FileText;
              const isProcessing = status === 'classifying' || status === 'extracting';
              const docType = doc.ai_classified_type || doc.aiClassifiedType || doc.document_type || doc.documentType;
              const fileName = doc.file_name || doc.fileName;
              const fileSize = doc.file_size || doc.fileSize;
              const progress = doc.processing_progress || doc.processingProgress;
              const fields = doc.extractedFields || doc.extracted_fields || [];

              return (
                <Card
                  key={doc.id}
                  className={`border shadow-sm cursor-pointer transition-all hover:border-primary/30 ${selectedDocId === doc.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                  onClick={() => setSelectedDocId(doc.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sc.color}`}>
                            <Icon className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                            {DOC_STATUS_LABELS[status] || status}
                          </span>
                          {docType && docType !== 'unknown' && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-ai-bg text-amber-700 rounded border border-amber-200 text-[10px]">
                              ✨ {DOC_TYPE_LABELS[docType] || docType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span>{formatFileSize(fileSize)}</span>
                          <span>{(fileType || '').toUpperCase()}</span>
                          {doc.page_count && <span>{doc.page_count} pages</span>}
                        </div>
                        {isProcessing && progress != null && (
                          <Progress value={progress} className="h-1 mt-2" />
                        )}
                        {doc.errors && doc.errors.length > 0 && (
                          <p className="text-[10px] text-destructive mt-1 truncate">{doc.errors[0]}</p>
                        )}
                      </div>
                      {fields.length > 0 && (
                        <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
                          {fields.length} fields
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {!isLoadingDb && filtered.length === 0 && (
              <Card className="border shadow-sm">
                <CardContent className="p-8 text-center text-muted-foreground text-sm">
                  No documents found. Upload files to get started.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="space-y-4">
          {selectedDoc ? (() => {
            const doc = selectedDoc as any;
            const status = doc.processing_status || doc.processingStatus || 'queued';
            const sc = docStatusConfig[status] || docStatusConfig.queued;
            const StatusIcon = sc.icon;
            const fileType = doc.file_type || doc.fileType;
            const docType = doc.ai_classified_type || doc.aiClassifiedType || doc.document_type || doc.documentType;
            const confidence = doc.ai_classification_confidence || doc.aiClassificationConfidence;
            const fileName = doc.file_name || doc.fileName;
            const fileSize = doc.file_size || doc.fileSize;
            const fields = doc.extractedFields || doc.extracted_fields || [];

            return (
              <Card className="border shadow-sm sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Document Details</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDocId(null)}><X className="w-4 h-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {fileType === 'xlsx' || fileType === 'csv' ? (
                      <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                    ) : (
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{fileName}</p>
                      <p className="text-[10px] text-muted-foreground">{formatFileSize(fileSize)} • {(fileType || '').toUpperCase()}</p>
                    </div>
                  </div>

                  {docType && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Classification
                        </p>
                        <div className="flex items-center justify-between bg-ai-bg rounded px-3 py-2 border border-amber-200">
                          <span className="text-xs font-medium text-amber-800">{DOC_TYPE_LABELS[docType] || docType}</span>
                          {confidence && <ConfidenceBar confidence={confidence} />}
                        </div>
                      </div>
                    </>
                  )}

                  {fields.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-foreground">Extracted Data ({fields.length})</p>
                          {status === 'review' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] gap-1"
                              onClick={() => acceptAllMutation.mutate(doc.id)}
                              disabled={acceptAllMutation.isPending}
                            >
                              <Check className="w-3 h-3" /> Accept All
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                          {fields.map((f: any, i: number) => (
                            <div
                              key={f.id || i}
                              className={`rounded px-2 py-1.5 text-xs transition-colors ${
                                f.accepted
                                  ? 'bg-success/5 border border-success/20'
                                  : 'bg-amber-50 border border-amber-300 ring-1 ring-amber-200/60 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {f.accepted ? (
                                    <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                                  ) : (
                                    <span className="relative flex h-3 w-3 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                      <Sparkles className="relative w-3 h-3 text-amber-600" />
                                    </span>
                                  )}
                                  <span className={f.accepted ? 'text-muted-foreground' : 'text-amber-800 font-medium'}>
                                    {f.field_name || f.fieldName}
                                  </span>
                                  {!f.accepted && (
                                    <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 rounded px-1 py-0.5 leading-none">
                                      Review
                                    </span>
                                  )}
                                </div>
                                <ConfidenceBar confidence={f.confidence} />
                              </div>
                              <p className={`font-medium mt-0.5 ml-5 ${f.accepted ? 'text-foreground' : 'text-amber-900'}`}>{f.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {doc.errors && doc.errors.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs font-medium text-destructive mb-2">Errors</p>
                        {doc.errors.map((e: string, i: number) => (
                          <p key={i} className="text-xs text-destructive/80 bg-destructive/10 rounded px-2 py-1.5 mb-1">{e}</p>
                        ))}
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex flex-col gap-2">
                    {(status === 'queued' || status === 'error') && (
                      <Button
                        size="sm"
                        className="w-full gap-1 text-xs"
                        onClick={() => processMutation.mutate({ documentId: doc.id })}
                        disabled={processMutation.isPending}
                      >
                        {processMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {status === 'error' ? 'Retry Processing' : 'Process with AI'}
                      </Button>
                    )}
                    {status === 'review' && (
                      <Button
                        size="sm"
                        className="w-full gap-1 text-xs"
                        onClick={() => acceptAllMutation.mutate(doc.id)}
                        disabled={acceptAllMutation.isPending}
                      >
                        <Check className="w-3 h-3" /> Accept All Fields
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })() : (
            <Card className="border shadow-sm">
              <CardContent className="p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a document to view details</p>
                <p className="text-xs text-muted-foreground mt-1">AI classification and extracted data will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
