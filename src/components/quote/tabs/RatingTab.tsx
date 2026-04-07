import RatingEngine from '@/pages/RatingEngine';

interface RatingTabProps {
  rfpId?: string;
}

export function RatingTab({ rfpId }: RatingTabProps) {
  return <RatingEngine />;
}
