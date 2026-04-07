import RenewalComparison from '@/pages/RenewalComparison';

interface RenewalTabProps {
  rfpId?: string;
}

export function RenewalTab({ rfpId }: RenewalTabProps) {
  return <RenewalComparison />;
}
