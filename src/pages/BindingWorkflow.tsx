import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Loader2, FileText, Send, ArrowRight } from 'lucide-react';
import { MOCK_BINDING } from '@/data/mockData';

const STEP_ICONS: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  in_progress: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
  pending: <Circle className="w-4 h-4 text-muted-foreground" />,
};

export default function BindingWorkflow() {
  const b = MOCK_BINDING;
  const completedCount = b.steps.filter(s => s.status === 'complete').length;
  const progress = Math.round((completedCount / b.steps.length) * 100);

  return (
    <div className="p-6 lg:p-8 space-y-5 max-w-[1000px]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🎉</span>
          <h1 className="text-2xl font-bold text-foreground">Quote Won — Pacific Coast Logistics</h1>
        </div>
        <p className="text-sm text-muted-foreground">Case #24007 • Binding workflow in progress</p>
      </div>

      {/* Summary */}
      <Card className="border shadow-sm border-emerald-200 bg-emerald-50/30">
        <CardContent className="p-4 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Accepted Scenario</p>
              <p className="font-medium text-foreground">{b.acceptedScenarioName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Accepted By</p>
              <p className="font-medium text-foreground">{b.acceptedByName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Acceptance Date</p>
              <p className="font-medium text-foreground">{new Date(b.acceptedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Method</p>
              <p className="font-medium text-foreground capitalize">{b.acceptanceMethod}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <span className="text-muted-foreground">Rate:</span>
            <span className="font-bold text-primary">$245.00 Specific + $38.50 Aggregate = $283.50 PMPM</span>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Binding Progress</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {b.steps.map((step, i) => (
          <Card key={step.id} className={`border shadow-sm ${step.status === 'in_progress' ? 'border-primary/40 bg-primary/5' : ''}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {STEP_ICONS[step.status]}
                <div>
                  <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>{step.name}</p>
                  <p className="text-[10px] text-muted-foreground">{step.ownerRole} {step.completedAt ? `• Completed ${new Date(step.completedAt).toLocaleDateString()}` : ''}</p>
                </div>
              </div>
              {step.status === 'in_progress' && step.id === 'STEP_18C' && (
                <Button size="sm" className="gap-1 text-xs"><ArrowRight className="w-3 h-3" /> Create Policy</Button>
              )}
              {step.status === 'in_progress' && step.id === 'STEP_18B' && (
                <Button size="sm" className="gap-1 text-xs"><FileText className="w-3 h-3" /> Generate Binder Letter</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
