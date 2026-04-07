import Proposals from '@/pages/Proposals';

interface ProposalsTabProps {
  rfpId?: string;
}

export function ProposalsTab({ rfpId }: ProposalsTabProps) {
  return <Proposals />;
}
