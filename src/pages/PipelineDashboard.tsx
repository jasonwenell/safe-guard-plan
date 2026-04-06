import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuoteTracker } from '@/components/workflow/QuoteTracker';
import { RoleQueue } from '@/components/workflow/RoleQueue';
import { MOCK_WORKFLOWS, MOCK_PIPELINE_STATS, MOCK_BOTTLENECKS, MOCK_TEAM, MOCK_AI_IMPACT } from '@/data/workflowMockData';
import { ArrowRight, AlertTriangle, Sparkles, Users, TrendingUp, Clock, CheckCircle2, XCircle, UserCheck, Briefcase, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '@/contexts/PersonaContext';

export default function PipelineDashboard() {
  const navigate = useNavigate();
  const { role } = usePersona();
  const stats = MOCK_PIPELINE_STATS;
  const aiImpact = MOCK_AI_IMPACT;

  // Sort workflows: overdue first, then by percent descending
  const activeWorkflows = MOCK_WORKFLOWS
    .filter(w => !['won', 'lost', 'declined'].includes(w.lifecycleState))
    .sort((a, b) => {
      const aOverdue = a.steps.some(s => s.slaStatus === 'overdue');
      const bOverdue = b.steps.some(s => s.slaStatus === 'overdue');
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return b.overallPercent - a.overallPercent;
    });

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pipeline Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time view of all active quotes across the workflow</p>
      </div>

      <Tabs defaultValue={role === 'MASTER' ? 'overview' : role === 'ASSISTANT' ? 'assistant' : role === 'ASSOCIATE' ? 'associate' : 'underwriter'} className="space-y-5">
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Overview</TabsTrigger>
          {(role === 'MASTER' || role === 'ASSISTANT') && (
            <TabsTrigger value="assistant" className="gap-1.5"><UserCheck className="w-3.5 h-3.5" /> Assistant Queue</TabsTrigger>
          )}
          {(role === 'MASTER' || role === 'ASSOCIATE') && (
            <TabsTrigger value="associate" className="gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Associate Queue</TabsTrigger>
          )}
          {(role === 'MASTER' || role === 'UNDERWRITER') && (
            <TabsTrigger value="underwriter" className="gap-1.5"><Shield className="w-3.5 h-3.5" /> UW Queue</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-5">
          {/* Pipeline Funnel */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Intake', count: stats.intake, avg: `${stats.avgIntakeDays}d avg`, color: 'bg-indigo-500', borderColor: 'border-indigo-200', bgColor: 'bg-indigo-50' },
              { label: 'Setup', count: stats.setup, avg: `${stats.avgSetupDays}d avg`, color: 'bg-teal-500', borderColor: 'border-teal-200', bgColor: 'bg-teal-50' },
              { label: 'Underwriting', count: stats.underwriting, avg: `${stats.avgUWDays}d avg`, color: 'bg-amber-500', borderColor: 'border-amber-200', bgColor: 'bg-amber-50' },
              { label: 'Quoted', count: stats.quoted, avg: 'awaiting', color: 'bg-purple-500', borderColor: 'border-purple-200', bgColor: 'bg-purple-50' },
            ].map((stage, i) => (
              <Card key={stage.label} className={cn('border', stage.borderColor)}>
                <CardContent className={cn('p-4', stage.bgColor)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stage.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stage.count}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {stage.avg}
                      </p>
                    </div>
                    <div className={cn('w-3 h-12 rounded-full', stage.color)} />
                  </div>
                  {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block" />}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Stats + Health */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">This Week</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-info" />
                    <div>
                      <p className="text-xl font-bold">{stats.receivedThisWeek}</p>
                      <p className="text-[10px] text-muted-foreground">Received</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-xl font-bold">{stats.quotedThisWeek}</p>
                      <p className="text-[10px] text-muted-foreground">Quoted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-xl font-bold">{stats.wonThisWeek}</p>
                      <p className="text-[10px] text-muted-foreground">Won</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xl font-bold">{stats.declinedThisWeek}</p>
                      <p className="text-[10px] text-muted-foreground">Declined</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">SLA Health</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">On Track</span>
                    <span className="text-sm font-bold text-emerald-600">{stats.onTrackPercent}%</span>
                  </div>
                  <Progress value={stats.onTrackPercent} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="text-warning">At Risk: {stats.atRiskPercent}%</span>
                    <span className="text-destructive">Overdue: {stats.overduePercent}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/30">
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-3 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Impact
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steps completed</span>
                    <span className="font-bold">{aiImpact.stepsCompletedThisWeek} ({aiImpact.percentOfAllSteps}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg confidence</span>
                    <span className="font-bold">{aiImpact.avgConfidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UW overrides</span>
                    <span className="font-bold">{aiImpact.uwOverrides} ({aiImpact.overridePercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hours saved</span>
                    <span className="font-bold text-purple-700">{aiImpact.estimatedHoursSaved}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottlenecks */}
          {MOCK_BOTTLENECKS.length > 0 && (
            <Card className="border-warning/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Bottlenecks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {MOCK_BOTTLENECKS.map(b => (
                  <div key={b.id} className={cn(
                    'flex items-center gap-3 p-2 rounded-md text-sm',
                    b.severity === 'high' ? 'bg-destructive/10' : 'bg-warning/10'
                  )}>
                    <span className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      b.severity === 'high' ? 'bg-destructive' : 'bg-warning'
                    )} />
                    <span className="flex-1 text-foreground">{b.message}</span>
                    <Badge variant="outline" className="text-xs">{b.affectedCount} quotes</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Team Throughput */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> Team Throughput
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Active Quotes */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Active Quotes ({activeWorkflows.length})</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeWorkflows.map(wf => (
                <QuoteTracker
                  key={wf.id}
                  workflow={wf}
                  mode="standard"
                  onViewDetail={() => navigate(`/workflow/${wf.rfpId}`)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {(role === 'MASTER' || role === 'ASSISTANT') && (
          <TabsContent value="assistant">
            <RoleQueue role="ASSISTANT" />
          </TabsContent>
        )}

        {(role === 'MASTER' || role === 'ASSOCIATE') && (
          <TabsContent value="associate">
            <RoleQueue role="ASSOCIATE" />
          </TabsContent>
        )}

        {(role === 'MASTER' || role === 'UNDERWRITER') && (
          <TabsContent value="underwriter">
            <RoleQueue role="UNDERWRITER" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
