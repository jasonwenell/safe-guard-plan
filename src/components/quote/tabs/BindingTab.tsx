import BindingWorkflow from '@/pages/BindingWorkflow';

interface BindingTabProps {
  rfpId?: string;
}

export function BindingTab({ rfpId }: BindingTabProps) {
  return <BindingWorkflow />;
}
