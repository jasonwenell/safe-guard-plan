import CensusProcessing from '@/pages/CensusProcessing';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface CensusTabProps {
  rfpId?: string;
}

export function CensusTab({ rfpId }: CensusTabProps) {
  return (
    <div>
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_07']} />}
      <CensusProcessing />
    </div>
  );
}
