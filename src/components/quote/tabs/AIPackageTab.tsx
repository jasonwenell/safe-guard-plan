import AIUnderwriting from '@/pages/AIUnderwriting';

interface AIPackageTabProps {
  rfpId?: string;
}

export function AIPackageTab({ rfpId }: AIPackageTabProps) {
  // AIUnderwriting already reads rfpId from useParams, so we render it as-is
  // The route now provides the :id param which it reads
  return <AIUnderwriting />;
}
