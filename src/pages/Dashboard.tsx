import { MOCK_DASHBOARD_STATS, MOCK_RFPS } from '@/data/mockData';
import { MOCK_TEAM } from '@/data/workflowMockData';
import { RFPStatus } from '@/types/sleq';
import { StepStatus, WORKFLOW_STEP_DEFS, WorkflowPhase, WorkflowInstance } from '@/types/workflow';
import { StatusBadge, RushBadge } from '@/components/shared/StatusBadges';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePersona } from '@/contexts/PersonaContext';
import {
  FileText, Clock, Zap, ClipboardList, Calculator, TrendingUp, Trophy, Timer,
  Mail, Upload, Users, Layers, ArrowRight, AlertTriangle, CheckCircle2, Sparkles, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const stats = MOCK_DASHBOARD_STATS;

// ─── To-Do Task Types ─────────────────────────────────────────
interface TodoTask {
  id: string;
  label: string;
  detail: string;
  priority: 'high' | 'medium' | 'low';
  route: string;
  caseNumber?: number;
  groupName?: string;
  isRush?: boolean;
  isOverdue?: boolean;
}

function getAssistantTodos(workflows: WorkflowInstance[]): TodoTask[] {
  const tasks: TodoTask[] = [];
  workflows.filter(wf => !['won','lost','declined'].includes(wf.lifecycleState)).forEach(wf => {
    const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === wf.currentStepId);
    const currentStep = wf.steps.find(s => s.stepId === wf.currentStepId);
    if (!currentDef || !currentStep) return;
    if (currentDef.phase !== WorkflowPhase.ASSISTANT_INTAKE) return;

    const stepTabMap: Record<string, string> = {
      STEP_01: 'intake', STEP_02: 'documents', STEP_03: 'intake',
      STEP_04: 'intake', STEP_05: 'intake', STEP_06: 'intake',
    };
    tasks.push({
      id: wf.id,
      label: `Step ${currentDef.sequenceNumber}: ${currentDef.shortName}`,
      detail: currentDef.name,
      priority: currentStep.slaStatus === 'overdue' ? 'high' : wf.isRush ? 'high' : 'medium',
      route: `/quote/${wf.rfpId}?tab=${stepTabMap[currentDef.id] || 'intake'}`,
      caseNumber: wf.caseNumber,
      groupName: wf.groupName,
      isRush: wf.isRush,
      isOverdue: currentStep.slaStatus === 'overdue',
    });
  });
  tasks.push({ id: 'email-1', label: 'Process new emails', detail: '4 unprocessed emails in inbox', priority: 'medium', route: '/email-intake' });
  tasks.push({ id: 'doc-1', label: 'Upload documents', detail: '2 cases awaiting document uploads', priority: 'low', route: '/rfps' });
  return tasks.sort((a, b) => (a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0));
}

function getAssociateTodos(workflows: WorkflowInstance[]): TodoTask[] {
  const tasks: TodoTask[] = [];
  workflows.filter(wf => !['won','lost','declined'].includes(wf.lifecycleState)).forEach(wf => {
    const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === wf.currentStepId);
    const currentStep = wf.steps.find(s => s.stepId === wf.currentStepId);
    if (!currentDef || !currentStep) return;
    if (currentDef.phase !== WorkflowPhase.ASSOCIATE_SETUP) return;

    const routeMap: Record<string, string> = {
      STEP_07: `/quote/${wf.rfpId}?tab=census`, STEP_08: `/quote/${wf.rfpId}?tab=benefits`,
      STEP_09: `/quote/${wf.rfpId}?tab=plan-stack`, STEP_10: `/quote/${wf.rfpId}?tab=plan-stack`,
      STEP_11: `/quote/${wf.rfpId}?tab=claims`, STEP_12: `/quote/${wf.rfpId}?tab=risk`,
    };
    tasks.push({
      id: wf.id,
      label: `Step ${currentDef.sequenceNumber}: ${currentDef.shortName}`,
      detail: currentDef.name,
      priority: currentStep.status === StepStatus.BLOCKED ? 'high' : currentStep.slaStatus === 'overdue' ? 'high' : 'medium',
      route: routeMap[currentDef.id] || `/rfps/${wf.rfpId}`,
      caseNumber: wf.caseNumber,
      groupName: wf.groupName,
      isRush: wf.isRush,
      isOverdue: currentStep.slaStatus === 'overdue',
    });
  });
  return tasks.sort((a, b) => (a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0));
}

function getUnderwriterTodos(workflows: WorkflowInstance[]): TodoTask[] {
  const tasks: TodoTask[] = [];
  workflows.filter(wf => !['won','lost','declined'].includes(wf.lifecycleState)).forEach(wf => {
    const currentDef = WORKFLOW_STEP_DEFS.find(d => d.id === wf.currentStepId);
    const currentStep = wf.steps.find(s => s.stepId === wf.currentStepId);
    if (!currentDef || !currentStep) return;
    if (currentDef.phase !== WorkflowPhase.UNDERWRITER_RATING) return;

    const routeMap: Record<string, string> = {
      STEP_13: `/quote/${wf.rfpId}?tab=ai-package`, STEP_14: `/quote/${wf.rfpId}?tab=plan-stack`,
      STEP_15: `/quote/${wf.rfpId}?tab=rating`, STEP_16: `/quote/${wf.rfpId}?tab=ai-package`,
      STEP_17: `/quote/${wf.rfpId}?tab=proposals`, STEP_18: `/quote/${wf.rfpId}?tab=binding`,
    };
    tasks.push({
      id: wf.id,
      label: `Step ${currentDef.sequenceNumber}: ${currentDef.shortName}`,
      detail: currentDef.name,
      priority: wf.isRush ? 'high' : currentStep.slaStatus === 'overdue' ? 'high' : 'medium',
      route: routeMap[currentDef.id] || `/underwriting/${wf.rfpId}`,
      caseNumber: wf.caseNumber,
      groupName: wf.groupName,
      isRush: wf.isRush,
      isOverdue: currentStep.slaStatus === 'overdue',
    });
  });
  // AI review items
  const aiSteps = workflows.flatMap(wf =>
    wf.steps.filter(s => s.aiCompleted && s.status === StepStatus.COMPLETE).length > 5
      ? [{ id: `ai-${wf.id}`, label: 'Review AI decisions', detail: `${wf.groupName} — multiple AI steps need sign-off`, priority: 'medium' as const, route: `/quote/${wf.rfpId}?tab=ai-package`, caseNumber: wf.caseNumber, groupName: wf.groupName }]
      : []
  );
  return [...tasks, ...aiSteps].sort((a, b) => (a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0));
}

// ─── Shared Components ─────────────────────────────────────────
function TodoList({ tasks, navigate }: { tasks: TodoTask[]; navigate: (path: string) => void }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
        <p className="font-medium">All caught up!</p>
        <p className="text-sm">No pending tasks right now</p>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      {tasks.map(task => (
        <div
          key={task.id}
          className={cn(
            'flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors hover:shadow-sm',
            task.priority === 'high' ? 'bg-destructive/5 border border-destructive/20 hover:bg-destructive/10' : 'bg-muted/30 border border-border hover:bg-muted/50'
          )}
          onClick={() => navigate(task.route)}
        >
          <div className={cn(
            'w-2 h-2 rounded-full shrink-0',
            task.priority === 'high' ? 'bg-destructive' : task.priority === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
          )} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {task.groupName ? `${task.groupName} #${task.caseNumber}` : task.label}
              </span>
              {task.isRush && <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-destructive/15 text-destructive">⚡ RUSH</span>}
              {task.isOverdue && <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-destructive/15 text-destructive animate-pulse">OVERDUE</span>}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {task.groupName ? `${task.label} — ${task.detail}` : task.detail}
            </p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ─── Role Dashboards ─────────────────────────────────────────
function AssistantDashboard() {
  const navigate = useNavigate();
  const todos = getAssistantTodos();
  const myWorkflows = MOCK_WORKFLOWS.filter(wf => wf.assignedAssistant === 'Traci Gamer' && !['won','lost','declined'].includes(wf.lifecycleState));

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assistant Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Traci — here's your intake queue</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/email-intake')}>
          <CardContent className="p-4">
            <Mail className="w-5 h-5 text-info mb-1" />
            <p className="text-2xl font-bold">4</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Unread Emails</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <Upload className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">6</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Docs to Process</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <FileText className="w-5 h-5 text-warning mb-1" />
            <p className="text-2xl font-bold">{myWorkflows.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">My Active RFPs</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/pipeline')}>
          <CardContent className="p-4">
            <Clock className="w-5 h-5 text-destructive mb-1" />
            <p className="text-2xl font-bold">{todos.filter(t => t.priority === 'high').length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Urgent Items</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">My To-Do List ({todos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList tasks={todos} navigate={navigate} />
        </CardContent>
      </Card>
    </div>
  );
}

function AssociateDashboard() {
  const navigate = useNavigate();
  const todos = getAssociateTodos();
  const myWorkflows = MOCK_WORKFLOWS.filter(wf => wf.assignedAssociate === 'Heidi Bouma' && !['won','lost','declined'].includes(wf.lifecycleState));
  const blocked = myWorkflows.filter(wf => {
    const s = wf.steps.find(st => st.stepId === wf.currentStepId);
    return s?.status === StepStatus.BLOCKED;
  });

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Associate Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Heidi — here's your setup queue</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <Users className="w-5 h-5 text-teal-600 mb-1" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Census Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <Layers className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{myWorkflows.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Active Setups</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all border-orange-200" onClick={() => navigate('/pipeline')}>
          <CardContent className="p-4">
            <AlertTriangle className="w-5 h-5 text-orange-500 mb-1" />
            <p className="text-2xl font-bold text-orange-600">{blocked.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Blocked</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/pipeline')}>
          <CardContent className="p-4">
            <Sparkles className="w-5 h-5 text-purple-500 mb-1" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Suggestions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">My To-Do List ({todos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList tasks={todos} navigate={navigate} />
        </CardContent>
      </Card>
    </div>
  );
}

function UnderwriterDashboard() {
  const navigate = useNavigate();
  const todos = getUnderwriterTodos();
  const myWorkflows = MOCK_WORKFLOWS.filter(wf =>
    wf.assignedUW === 'Juice Montezon' && !['won','lost','declined'].includes(wf.lifecycleState)
  );

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Underwriter Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back, Juice — here's your underwriting queue</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <Zap className="w-5 h-5 text-amber-500 mb-1" />
            <p className="text-2xl font-bold">{myWorkflows.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">In My Queue</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <Calculator className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-bold">2</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ready to Rate</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/rfps')}>
          <CardContent className="p-4">
            <FileText className="w-5 h-5 text-emerald-500 mb-1" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Proposals Due</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/analytics')}>
          <CardContent className="p-4">
            <TrendingUp className="w-5 h-5 text-info mb-1" />
            <p className="text-2xl font-bold">82%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">My To-Do List ({todos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoList tasks={todos} navigate={navigate} />
        </CardContent>
      </Card>

      {/* Quick action buttons for UW */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-1.5" onClick={() => navigate('/rfps')}>
          <Zap className="w-4 h-4" /> Open Quotes
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={() => navigate('/factor-lookup')}>
          <Calculator className="w-4 h-4" /> Factor Lookup
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={() => navigate('/analytics')}>
          <TrendingUp className="w-4 h-4" /> Analytics
        </Button>
      </div>
    </div>
  );
}

function MasterDashboard() {
  const navigate = useNavigate();
  const statCards = [
    { label: 'Active RFPs', value: stats.totalActiveRFPs, icon: FileText, color: 'text-primary', path: '/rfps' },
    { label: 'Due Today', value: stats.dueToday, icon: Clock, color: 'text-warning', path: '/rfps' },
    { label: 'Rush Cases', value: stats.rushCases, icon: Zap, color: 'text-destructive', path: '/rfps' },
    { label: 'Pending Setup', value: stats.pendingSetup, icon: ClipboardList, color: 'text-info', path: '/rfps' },
    { label: 'In Underwriting', value: stats.inUnderwriting, icon: Calculator, color: 'text-primary', path: '/rfps' },
    { label: 'Quoted (Month)', value: stats.quotedThisMonth, icon: TrendingUp, color: 'text-status-quoted', path: '/rfps' },
    { label: 'Won (Month)', value: stats.wonThisMonth, icon: Trophy, color: 'text-success', path: '/policies' },
    { label: 'Avg Days to Quote', value: stats.avgDaysToQuote, icon: Timer, color: 'text-muted-foreground', path: '/analytics' },
  ];

  const recentRFPs = MOCK_RFPS.slice(0, 6);
  const statusDistribution = [
    { status: 'Intake', count: 18, pct: 14 },
    { status: 'Setup', count: 42, pct: 33 },
    { status: 'Ready for UW', count: 12, pct: 9 },
    { status: 'In Underwriting', count: 28, pct: 22 },
    { status: 'Quoted', count: 15, pct: 12 },
    { status: 'Proposal Sent', count: 12, pct: 10 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">SLEQ Platform overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border shadow-sm cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" onClick={() => navigate(s.path)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 border shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Pipeline Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {statusDistribution.map((s) => (
              <div key={s.status} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.status}</span>
                  <span className="font-medium text-foreground">{s.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Recent RFPs</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Case #</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Group</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">TPA</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Eff. Date</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">UW</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRFPs.map((rfp) => (
                    <tr key={rfp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/quote/${rfp.id}`)}>
                      <td className="py-2.5 px-4 font-mono text-xs">{rfp.caseNumber}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground truncate max-w-[200px]">{rfp.groupName}</span>
                          {rfp.isRush && <RushBadge />}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-muted-foreground">{rfp.tpaCode}</td>
                      <td className="py-2.5 px-4"><StatusBadge status={rfp.status} /></td>
                      <td className="py-2.5 px-4 text-muted-foreground">{new Date(rfp.effectiveDate).toLocaleDateString()}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{rfp.assignedUWName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team overview for Master */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {MOCK_TEAM.map(member => (
              <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground shrink-0">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground">{member.role === 'ASSISTANT' ? 'Asst' : member.role === 'ASSOCIATE' ? 'Assoc' : 'UW'}</p>
                  <p className={cn('text-[10px] font-medium', member.onTarget ? 'text-emerald-600' : 'text-warning')}>
                    {member.throughputPerDay}/{member.targetPerDay} per day {member.onTarget ? '✅' : '⚠'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Dashboard Export ─────────────────────────────────────
export default function Dashboard() {
  const { role } = usePersona();

  switch (role) {
    case 'ASSISTANT': return <AssistantDashboard />;
    case 'ASSOCIATE': return <AssociateDashboard />;
    case 'UNDERWRITER': return <UnderwriterDashboard />;
    case 'MASTER': return <MasterDashboard />;
  }
}
