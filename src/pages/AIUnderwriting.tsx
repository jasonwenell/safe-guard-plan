import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_RFPS } from '@/data/mockData';
import { MOCK_QUOTABILITY_SCORES, MOCK_AI_QUOTE_PACKAGE } from '@/data/underwritingMockData';
import { AIQuotePackage, getScoreColor, QUOTABILITY_ROUTING, getRecommendation } from '@/types/underwriting';
import { QuotabilityScoreCard, QuotabilityBadge } from '@/components/underwriting/QuotabilityScore';
import { MagicButton } from '@/components/underwriting/MagicButton';
import { RiskFlagsPanel, LaserRecommendationsPanel, AttentionItemsPanel } from '@/components/underwriting/RiskPanels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles, ArrowLeft, FileText, Brain, Shield, BarChart3, Lightbulb,
  CheckCircle2, XCircle, Save, TrendingUp, TrendingDown, Info, Target
} from 'lucide-react';

export default function AIUnderwriting() {
  const { rfpId } = useParams();
  const rfp = MOCK_RFPS.find(r => r.id === rfpId);
  const quotabilityScore = rfpId ? MOCK_QUOTABILITY_SCORES[rfpId] : undefined;
  const [quotePackage, setQuotePackage] = useState<AIQuotePackage | null>(
    rfpId === 'rfp-001' ? MOCK_AI_QUOTE_PACKAGE : null
  );
  const [uwNotes, setUwNotes] = useState('');
  const [selectedDecisions, setSelectedDecisions] = useState<Record<string, string>>({});

  // If no rfpId, show the queue view
  if (!rfpId || !rfp) {
    return <AIUnderwritingQueue />;
  }

  const handleQuoteComplete = () => {
    setQuotePackage(MOCK_AI_QUOTE_PACKAGE);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/underwriting">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">AI Underwriting Review</h1>
              {quotabilityScore && <QuotabilityBadge score={quotabilityScore.overallScore} showLabel />}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Case #{rfp.caseNumber} · {rfp.groupName} · {rfp.employeeCount} lives · SIC {rfp.sicCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!quotePackage && (
            <MagicButton
              rfpId={rfp.id}
              isReady={rfp.setupComplete || rfp.status !== 'draft'}
              missingItems={rfp.setupComplete ? [] : ['Complete census upload', 'Verify plan design']}
              onComplete={handleQuoteComplete}
            />
          )}
          {quotePackage && (
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-xs text-muted-foreground">Overall Confidence</p>
                <p className={`text-lg font-bold ${getScoreColor(quotePackage.overallConfidence)}`}>
                  {quotePackage.overallConfidence}%
                </p>
              </div>
              <Button variant="outline" className="gap-2"><XCircle className="w-4 h-4" /> Decline</Button>
              <Button variant="outline" className="gap-2"><Save className="w-4 h-4" /> Save Draft</Button>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="w-4 h-4" /> Approve & Generate</Button>
            </div>
          )}
        </div>
      </div>

      {/* Pre-quote: show quotability + magic button */}
      {!quotePackage && quotabilityScore && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuotabilityScoreCard data={quotabilityScore} />
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" /> Pre-Qualification Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <InfoRow label="Group" value={rfp.groupName} />
                <InfoRow label="SIC" value={`${rfp.sicCode} — ${rfp.sicDescription}`} />
                <InfoRow label="Lives" value={`${rfp.employeeCount}`} />
                <InfoRow label="State" value={rfp.state || '—'} />
                <InfoRow label="TPA" value={rfp.tpaName} />
                <InfoRow label="Producer" value={rfp.producerName} />
                <InfoRow label="Effective" value={new Date(rfp.effectiveDate).toLocaleDateString()} />
                <InfoRow label="Type" value={rfp.type} />
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Click <strong>"Generate AI Quote"</strong> to run the full underwriting pipeline. The AI will analyze census demographics, calculate manual and experience rates, assess risk factors, and produce a ready-to-review quote package.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Post-quote: full UW review dashboard */}
      {quotePackage && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="scenarios" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Scenarios</TabsTrigger>
            <TabsTrigger value="risk" className="gap-1.5"><Shield className="w-3.5 h-3.5" /> Risk & Lasers</TabsTrigger>
            <TabsTrigger value="explainability" className="gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> Why This Rate?</TabsTrigger>
            <TabsTrigger value="decisions" className="gap-1.5"><Target className="w-3.5 h-3.5" /> Decision Points</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AttentionItemsPanel items={quotePackage.topAttentionItems} />
                {/* Quick scenario summary */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Scenario Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Scenario</th>
                          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Manual</th>
                          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Experience</th>
                          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Blended</th>
                          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">AI Rec</th>
                          <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">Annual Premium</th>
                          <th className="text-center py-2.5 px-4 text-xs font-medium text-muted-foreground">Confidence</th>
                          <th className="text-center py-2.5 px-4 text-xs font-medium text-muted-foreground">Win %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotePackage.scenarios.map(s => (
                          <tr key={s.scenarioId} className="border-b last:border-0">
                            <td className="py-2.5 px-4 text-xs font-medium">{s.scenarioName}</td>
                            <td className="py-2.5 px-4 text-right text-xs">${s.manualRate.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-right text-xs">{s.experienceRate ? `$${s.experienceRate.toFixed(2)}` : '—'}</td>
                            <td className="py-2.5 px-4 text-right text-xs">${s.blendedRate.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-right text-xs font-bold text-primary">★ ${s.aiRecommendedRate.toFixed(2)}</td>
                            <td className="py-2.5 px-4 text-right text-xs">${s.totalAnnualPremium.toLocaleString()}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span className={`text-xs font-semibold ${getScoreColor(s.confidence)}`}>{s.confidence}%</span>
                            </td>
                            <td className="py-2.5 px-4 text-center text-xs">{Math.round(s.winProbability * 100)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <QuotabilityScoreCard data={quotePackage.quotabilityScore} compact />
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Processing Info</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1 text-muted-foreground">
                    <p>Generated: {new Date(quotePackage.generatedAt).toLocaleString()}</p>
                    <p>Processing Time: {(quotePackage.processingTimeMs / 1000).toFixed(1)}s</p>
                    <p className="font-medium text-foreground mt-2">Data Sources:</p>
                    {quotePackage.dataSourcesUsed.map((ds, i) => (
                      <p key={i} className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {ds}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SCENARIOS TAB */}
          <TabsContent value="scenarios" className="space-y-6">
            {quotePackage.scenarios.map(scenario => (
              <Card key={scenario.scenarioId} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{scenario.scenarioName}</CardTitle>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${getScoreColor(scenario.confidence)}`}>
                        Confidence: {scenario.confidence}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Win Prob: {Math.round(scenario.winProbability * 100)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rate summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <RateCard label="Manual Rate" value={scenario.manualRate} sub="PEPM" />
                    <RateCard label="Experience Rate" value={scenario.experienceRate} sub="PEPM" />
                    <RateCard label="Blended Rate" value={scenario.blendedRate} sub={`Z = ${scenario.credibilityFactor.toFixed(2)}`} />
                    <RateCard label="AI Recommended" value={scenario.aiRecommendedRate} sub="PEPM" highlight />
                  </div>

                  {/* Rate range bar */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Rate Range</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-16">${scenario.rateLow}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted relative">
                        <div
                          className="absolute h-full rounded-full bg-primary/30"
                          style={{
                            left: '0%',
                            right: '0%',
                          }}
                        />
                        <div
                          className="absolute w-3 h-3 rounded-full bg-primary border-2 border-white shadow top-1/2 -translate-y-1/2"
                          style={{
                            left: `${((scenario.aiRecommendedRate - scenario.rateLow) / (scenario.rateHigh - scenario.rateLow)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 text-right">${scenario.rateHigh}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground px-16">
                      <span>Aggressive</span>
                      <span>Conservative</span>
                    </div>
                  </div>

                  {/* UW editable final rate */}
                  <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border">
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">UW Final Rate</p>
                      <p className="text-muted-foreground">Override AI recommendation</p>
                    </div>
                    <Input
                      className="w-32 text-right font-mono font-bold"
                      defaultValue={scenario.aiRecommendedRate.toFixed(2)}
                    />
                    <div className="text-xs text-muted-foreground">
                      <p>Annual: <strong className="text-foreground">${scenario.totalAnnualPremium.toLocaleString()}</strong></p>
                    </div>
                  </div>

                  {/* Factor breakdown */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Factor Breakdown</p>
                    {scenario.factorBreakdown.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                        <div>
                          <span className="font-medium text-foreground">{f.factorName}</span>
                          <span className="text-muted-foreground ml-2">{f.description}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{f.factorValue.toFixed(2)}x</span>
                          <span className={`font-mono font-semibold w-20 text-right ${f.impactOnRate > 0 ? 'text-red-600' : f.impactOnRate < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                            {f.impactOnRate > 0 ? '+' : ''}{f.impactOnRate.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* RISK TAB */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskFlagsPanel flags={quotePackage.riskFlags} />
              <LaserRecommendationsPanel lasers={quotePackage.laserRecommendations} />
            </div>
          </TabsContent>

          {/* EXPLAINABILITY TAB */}
          <TabsContent value="explainability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> AI Risk Narrative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {quotePackage.riskNarrative}
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Sensitivity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quotePackage.sensitivityAnalysis.map((sa, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-xs font-semibold text-foreground">
                        {sa.variable} <span className="text-muted-foreground font-normal">(current: {sa.currentValue})</span>
                      </p>
                      {sa.alternativeValues.map((av, j) => (
                        <div key={j} className="flex items-center justify-between text-xs bg-muted/50 rounded px-3 py-1.5 border">
                          <span className="text-foreground font-medium">{av.value}</span>
                          <div className="flex items-center gap-4">
                            <span className={av.rateImpact > 0 ? 'text-red-600' : 'text-emerald-600'}>
                              {av.rateImpact > 0 ? '+' : ''}{av.rateImpact.toFixed(2)} PEPM
                            </span>
                            <span className={av.premiumImpact > 0 ? 'text-red-500' : 'text-emerald-500'}>
                              {av.premiumImpact > 0 ? '+' : ''}${Math.abs(av.premiumImpact).toLocaleString()}
                            </span>
                            <span className={av.winProbabilityChange > 0 ? 'text-emerald-600' : 'text-red-500'}>
                              {av.winProbabilityChange > 0 ? '+' : ''}{Math.round(av.winProbabilityChange * 100)}% win
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DECISION POINTS TAB */}
          <TabsContent value="decisions" className="space-y-6">
            <div className="space-y-4">
              {quotePackage.decisionPoints.map(dp => (
                <Card key={dp.id} className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">{dp.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{dp.context}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {dp.options.map(opt => {
                        const isAIRec = opt.value === dp.aiRecommendation;
                        const isSelected = selectedDecisions[dp.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => setSelectedDecisions(prev => ({ ...prev, [dp.id]: opt.value }))}
                            className={`text-left p-3 rounded-lg border-2 transition-all text-xs ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : isAIRec
                                  ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50'
                                  : 'border-muted hover:border-muted-foreground/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-foreground">{opt.label}</span>
                              {isAIRec && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">AI Rec</span>}
                            </div>
                            <p className="text-muted-foreground">{dp.impactOfEachOption[opt.value]}</p>
                            <p className={`mt-1 font-mono font-semibold ${opt.rateImpact > 0 ? 'text-red-600' : opt.rateImpact < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                              {opt.rateImpact === 0 ? 'No rate impact' : `${opt.rateImpact > 0 ? '+' : ''}$${opt.rateImpact.toFixed(2)} PEPM`}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* UW Notes */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">UW Notes & Rationale</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    rows={4}
                    placeholder="Add your underwriting notes, rationale for any adjustments, and approval comments..."
                    value={uwNotes}
                    onChange={(e) => setUwNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Sub-components
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

function RateCard({ label, value, sub, highlight }: { label: string; value: number | null; sub: string; highlight?: boolean }) {
  return (
    <div className={`text-center p-3 rounded-lg ${highlight ? 'bg-primary/10 border-2 border-primary/30' : 'bg-card border'}`}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`text-xl font-bold mt-1 ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value ? `$${value.toFixed(2)}` : '—'}
      </p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}

// Queue view
function AIUnderwritingQueue() {
  const rfpsWithScores = MOCK_RFPS.filter(r => MOCK_QUOTABILITY_SCORES[r.id]).map(r => ({
    ...r,
    quotabilityScore: MOCK_QUOTABILITY_SCORES[r.id],
  }));

  // Sort by score descending
  rfpsWithScores.sort((a, b) => b.quotabilityScore.overallScore - a.quotabilityScore.overallScore);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" /> AI Underwriting Engine
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          AI-scored RFP queue with quotability scores, magic button quoting, and UW review dashboard
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Auto-Quote', count: rfpsWithScores.filter(r => r.quotabilityScore.recommendation === 'AUTO_QUOTE').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Fast-Track', count: rfpsWithScores.filter(r => r.quotabilityScore.recommendation === 'FAST_TRACK').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Standard', count: rfpsWithScores.filter(r => r.quotabilityScore.recommendation === 'STANDARD').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Caution', count: rfpsWithScores.filter(r => r.quotabilityScore.recommendation === 'CAUTION').length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Skip', count: rfpsWithScores.filter(r => r.quotabilityScore.recommendation === 'RECOMMEND_SKIP').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <Card key={s.label} className="border shadow-sm">
            <CardContent className={`p-3 ${s.bg} rounded-lg`}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Queue table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">AI Scoring Queue — Prioritized by Quotability</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground w-[80px]">Score</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Routing</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground w-[70px]">Case #</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Group</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">SIC</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Lives</th>
                <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Win %</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Profit</th>
                <th className="text-right py-2.5 px-3 text-xs font-medium text-muted-foreground w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {rfpsWithScores.map(rfp => {
                const rec = rfp.quotabilityScore.recommendation;
                const routing = QUOTABILITY_ROUTING[rec];
                return (
                  <tr key={rfp.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <QuotabilityBadge score={rfp.quotabilityScore.overallScore} />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs font-semibold ${routing.textColor}`}>{routing.label}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-xs">{rfp.caseNumber}</td>
                    <td className="py-2.5 px-3 text-xs font-medium">{rfp.groupName}</td>
                    <td className="py-2.5 px-3 text-xs text-muted-foreground">{rfp.sicCode}</td>
                    <td className="py-2.5 px-3 text-center text-xs">{rfp.employeeCount}</td>
                    <td className="py-2.5 px-3 text-center text-xs">{Math.round(rfp.quotabilityScore.estimatedWinProbability * 100)}%</td>
                    <td className="py-2.5 px-3 text-xs">{rfp.quotabilityScore.estimatedProfitability}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Link to={`/underwriting/${rfp.id}`}>
                        <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                          <Sparkles className="w-3 h-3" /> Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
