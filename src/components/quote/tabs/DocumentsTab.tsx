import DocumentUpload from '@/pages/DocumentUpload';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface DocumentsTabProps {
  rfpId?: string;
}

export function DocumentsTab({ rfpId }: DocumentsTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_02']} />}
      <DocumentUpload />
    </div>
  );
}
