import CensusProcessing from '@/pages/CensusProcessing';

interface CensusTabProps {
  rfpId?: string;
}

export function CensusTab({ rfpId }: CensusTabProps) {
  return <CensusProcessing />;
}
