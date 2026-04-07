import DocumentUpload from '@/pages/DocumentUpload';

interface DocumentsTabProps {
  rfpId?: string;
}

export function DocumentsTab({ rfpId }: DocumentsTabProps) {
  // Renders existing DocumentUpload page content, scoped context available via rfpId
  return <DocumentUpload />;
}
