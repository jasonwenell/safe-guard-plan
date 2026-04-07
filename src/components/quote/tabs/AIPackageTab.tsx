import AIUnderwriting from '@/pages/AIUnderwriting';

interface AIPackageTabProps {
  rfpId?: string;
}

export function AIPackageTab({ rfpId }: AIPackageTabProps) {
  return <AIUnderwriting rfpId={rfpId} embedded />;
}
