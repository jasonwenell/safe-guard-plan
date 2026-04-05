import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, Loader2, AlertTriangle, Zap } from 'lucide-react';
import { MAGIC_BUTTON_STEPS } from '@/data/underwritingMockData';
import { cn } from '@/lib/utils';

interface MagicButtonProps {
  rfpId: string;
  isReady: boolean;
  missingItems?: string[];
  onComplete: () => void;
}

export function MagicButton({ rfpId, isReady, missingItems = [], onComplete }: MagicButtonProps) {
  const [state, setState] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'running' | 'complete')[]>(
    MAGIC_BUTTON_STEPS.map(() => 'pending')
  );

  const runPipeline = useCallback(() => {
    setState('running');
    setCurrentStep(0);
    setStepStatuses(MAGIC_BUTTON_STEPS.map(() => 'pending'));

    const totalSteps = MAGIC_BUTTON_STEPS.length;
    let step = 0;

    const interval = setInterval(() => {
      setStepStatuses(prev => {
        const next = [...prev];
        if (step > 0) next[step - 1] = 'complete';
        if (step < totalSteps) next[step] = 'running';
        return next;
      });
      setCurrentStep(step);

      if (step >= totalSteps) {
        clearInterval(interval);
        setStepStatuses(prev => prev.map(() => 'complete'));
        setState('complete');
        setTimeout(onComplete, 500);
      }
      step++;
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (state === 'complete') {
    return (
      <Button
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
        size="lg"
      >
        <CheckCircle2 className="w-5 h-5" />
        AI Quote Ready — Review
      </Button>
    );
  }

  if (state === 'running') {
    const progress = Math.round(((currentStep) / MAGIC_BUTTON_STEPS.length) * 100);
    return (
      <div className="space-y-3 w-full max-w-md">
        <Button disabled size="lg" className="gap-2 w-full">
          <Loader2 className="w-5 h-5 animate-spin" />
          Analyzing... {progress}%
        </Button>
        <div className="space-y-1.5 bg-card border rounded-lg p-3">
          {MAGIC_BUTTON_STEPS.map((s, i) => (
            <div key={s.step} className={cn(
              "flex items-center gap-2 text-xs py-0.5 transition-all",
              stepStatuses[i] === 'complete' && 'text-emerald-600',
              stepStatuses[i] === 'running' && 'text-primary font-medium',
              stepStatuses[i] === 'pending' && 'text-muted-foreground'
            )}>
              {stepStatuses[i] === 'complete' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {stepStatuses[i] === 'running' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {stepStatuses[i] === 'pending' && <div className="w-3.5 h-3.5 rounded-full border border-muted-foreground/30" />}
              <span>{s.name}</span>
              <span className="ml-auto text-muted-foreground">{s.duration}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="space-y-2">
        <Button disabled size="lg" variant="outline" className="gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Incomplete Data — Review
        </Button>
        {missingItems.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p className="font-medium">Complete these items to generate an AI quote:</p>
            {missingItems.map((item, i) => (
              <p key={i}>☐ {item}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={runPipeline}
      size="lg"
      className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
    >
      <Sparkles className="w-5 h-5" />
      Generate AI Quote
    </Button>
  );
}
