import PlanDesign from '@/pages/PlanDesign';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface PlanStackTabProps {
  rfpId?: string;
}

export function PlanStackTab({ rfpId }: PlanStackTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_08', 'STEP_09', 'STEP_10']} />}
      <PlanDesign />
    </div>
  );
}
