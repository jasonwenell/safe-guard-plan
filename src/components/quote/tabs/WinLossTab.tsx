import WinLossTracking from '@/pages/WinLossTracking';

interface WinLossTabProps {
  rfpId?: string;
}

export function WinLossTab({ rfpId }: WinLossTabProps) {
  return <WinLossTracking />;
}
