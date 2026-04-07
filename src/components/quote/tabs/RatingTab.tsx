import RatingEngine from '@/pages/RatingEngine';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface RatingTabProps {
  rfpId?: string;
}

export function RatingTab({ rfpId }: RatingTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_15']} />}
      <RatingEngine />
    </div>
  );
}
