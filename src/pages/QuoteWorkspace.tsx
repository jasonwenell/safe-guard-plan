import { useParams, useSearchParams } from 'react-router-dom';
import { usePersona } from '@/contexts/PersonaContext';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { MOCK_RFPS } from '@/data/mockData';
import { getTabsForRole, getTabStatus, getDefaultTab, type TabStatusType } from '@/config/tabConfig';
import { QuoteHeader } from '@/components/quote/QuoteHeader';
import { QuoteFooterActions } from '@/components/quote/QuoteFooterActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CheckCircle2, Loader2, AlertTriangle, Sparkles, Circle } from 'lucide-react';

// Tab content components
import { IntakeTab } from '@/components/quote/tabs/IntakeTab';
import { DocumentsTab } from '@/components/quote/tabs/DocumentsTab';
import { CensusTab } from '@/components/quote/tabs/CensusTab';
// BenefitsTab removed — functionality merged into PlanStackTab
import { PlanStackTab } from '@/components/quote/tabs/PlanStackTab';
import { ClaimsTab } from '@/components/quote/tabs/ClaimsTab';
import { RiskTab } from '@/components/quote/tabs/RiskTab';
import { AIPackageTab } from '@/components/quote/tabs/AIPackageTab';
import { RatingTab } from '@/components/quote/tabs/RatingTab';
import { ProposalsTab } from '@/components/quote/tabs/ProposalsTab';
import { BindingTab } from '@/components/quote/tabs/BindingTab';
import { CommsTab } from '@/components/quote/tabs/CommsTab';
import { WinLossTab } from '@/components/quote/tabs/WinLossTab';
import { RenewalTab } from '@/components/quote/tabs/RenewalTab';
import { WorkflowTab } from '@/components/quote/tabs/WorkflowTab';

const STATUS_ICONS: Record<TabStatusType, React.ReactNode> = {
  complete: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
  in_progress: <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />,
  not_started: <Circle className="w-3.5 h-3.5 text-muted-foreground" />,
  blocked: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
  ai_review: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
};

const TAB_COMPONENTS: Record<string, React.ComponentType<{ rfpId?: string }>> = {
  intake: IntakeTab,
  documents: DocumentsTab,
  census: CensusTab,
  benefits: BenefitsTab,
  'plan-stack': PlanStackTab,
  claims: ClaimsTab,
  risk: RiskTab,
  'ai-package': AIPackageTab,
  rating: RatingTab,
  proposals: ProposalsTab,
  binding: BindingTab,
  comms: CommsTab,
  'win-loss': WinLossTab,
  renewal: RenewalTab,
  workflow: WorkflowTab,
};

export default function QuoteWorkspace() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = usePersona();

  const { getWorkflow } = useWorkflow();

  const rfp = id ? MOCK_RFPS.find(r => r.id === id) : null;
  const workflow = id ? getWorkflow(id) : undefined;
  const isNew = !rfp;
  const isRenewal = rfp?.type === 'RENEWAL';

  const tabs = getTabsForRole(role, isNew, isRenewal);
  const urlTab = searchParams.get('tab');
  const defaultTab = urlTab || getDefaultTab(role, workflow, isNew, isRenewal);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-[1600px]">
      {/* Sticky Header with quote info + pizza tracker */}
      {id && <QuoteHeader rfpId={id} />}
      {isNew && (
        <div className="border-b border-border pb-4 mb-1">
          <h1 className="text-lg font-bold text-foreground">New Quote</h1>
          <p className="text-sm text-muted-foreground">Create a new quote request</p>
        </div>
      )}

      {/* Role-filtered tabs with status icons */}
      <Tabs value={defaultTab} onValueChange={handleTabChange} className="flex-1 flex flex-col mt-3">
        <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {tabs.map(tab => {
            const status = tab.showStatusIcon ? getTabStatus(tab, workflow) : 'not_started';
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="gap-1.5 text-xs data-[state=active]:shadow-sm"
              >
                {tab.showStatusIcon && workflow && STATUS_ICONS[status]}
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab content */}
        <div className="flex-1 mt-4">
          {tabs.map(tab => {
            const TabComponent = TAB_COMPONENTS[tab.id];
            if (!TabComponent) return null;
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <TabComponent rfpId={id} />
              </TabsContent>
            );
          })}
        </div>
      </Tabs>

      {/* Footer actions */}
      <QuoteFooterActions role={role} workflow={workflow} />
    </div>
  );
}
