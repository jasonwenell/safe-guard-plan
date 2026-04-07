import PlanDesign from '@/pages/PlanDesign';

interface BenefitsTabProps {
  rfpId?: string;
}

export function BenefitsTab({ rfpId }: BenefitsTabProps) {
  // Shows the SoB/Plan Design page scoped to this quote
  return <PlanDesign />;
}
