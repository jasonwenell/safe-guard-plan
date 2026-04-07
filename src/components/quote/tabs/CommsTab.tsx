import CommunicationLog from '@/pages/CommunicationLog';

interface CommsTabProps {
  rfpId?: string;
}

export function CommsTab({ rfpId }: CommsTabProps) {
  return <CommunicationLog />;
}
