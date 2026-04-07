import ClaimsExperience from '@/pages/ClaimsExperience';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface ClaimsTabProps {
  rfpId?: string;
}

export function ClaimsTab({ rfpId }: ClaimsTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_11']} />}
      <ClaimsExperience />
    </div>
  );
}
