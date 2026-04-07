import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save } from 'lucide-react';
import { StepActionBanner } from '@/components/workflow/StepActionBanner';

interface RiskTabProps {
  rfpId?: string;
}

export function RiskTab({ rfpId }: RiskTabProps) {
  return (
    <div className="space-y-6">
      {rfpId && <StepActionBanner rfpId={rfpId} tabStepIds={['STEP_12']} />}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" /> Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">High Claimant Count</Label>
              <Input type="number" defaultValue="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ongoing Treatments</Label>
              <Input type="number" defaultValue="0" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Transplant Risk', 'Cancer Risk', 'Maternity Risk'].map(label => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs">{label}</Label>
                <Input type="number" defaultValue="0" placeholder="Count" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Rx Specialty Drug Exposure</Label>
            <Input type="number" defaultValue="0" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">UW Notes & Risk Narrative</Label>
            <Textarea rows={4} placeholder="Describe risk factors, concerns, and underwriting notes..." />
          </div>
          <Button className="gap-1.5"><Save className="w-4 h-4" /> Save Risk Assessment</Button>
        </CardContent>
      </Card>
    </div>
  );
}
