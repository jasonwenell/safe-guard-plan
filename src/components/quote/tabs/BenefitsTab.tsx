import PlanDesign from '@/pages/PlanDesign';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface BenefitsTabProps {
  rfpId?: string;
}

export function BenefitsTab({ rfpId }: BenefitsTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_08']} />}
      <PlanDesign />
    </div>
  );
}
