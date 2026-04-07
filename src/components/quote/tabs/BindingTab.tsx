import BindingWorkflow from '@/pages/BindingWorkflow';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface BindingTabProps {
  rfpId?: string;
}

export function BindingTab({ rfpId }: BindingTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_18']} />}
      <BindingWorkflow />
    </div>
  );
}
