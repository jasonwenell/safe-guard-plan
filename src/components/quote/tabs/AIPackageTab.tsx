import AIUnderwriting from '@/pages/AIUnderwriting';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface AIPackageTabProps {
  rfpId?: string;
}

export function AIPackageTab({ rfpId }: AIPackageTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_13', 'STEP_14', 'STEP_15', 'STEP_16']} />}
      <AIUnderwriting rfpId={rfpId} embedded />
    </div>
  );
}
