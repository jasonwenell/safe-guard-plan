import Proposals from '@/pages/Proposals';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface ProposalsTabProps {
  rfpId?: string;
}

export function ProposalsTab({ rfpId }: ProposalsTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_17']} />}
      <Proposals />
    </div>
  );
}
