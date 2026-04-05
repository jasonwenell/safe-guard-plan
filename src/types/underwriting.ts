// AI Underwriting Engine Types

export type QuotabilityRecommendation = 'AUTO_QUOTE' | 'FAST_TRACK' | 'STANDARD' | 'CAUTION' | 'RECOMMEND_SKIP';
export type QuotePackageStatus = 'generated' | 'reviewing' | 'approved' | 'rejected';
export type RiskSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type ConfidenceColor = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface QuotabilityFactor {
  name: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  dataSource: string;
  explanation: string;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'UNKNOWN';
}

export interface ComparableGroup {
  groupName: string;
  sicCode: string;
  employeeCount: number;
  outcome: 'WON' | 'LOST' | 'DECLINED';
  finalRate: number;
  lossRatio: number;
  similarity: number;
}

export interface QuotabilityScore {
  overallScore: number;
  recommendation: QuotabilityRecommendation;
  factors: QuotabilityFactor[];
  estimatedWinProbability: number;
  estimatedProfitability: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEGATIVE';
  reasonSummary: string;
  comparableGroups: ComparableGroup[];
}

export interface RiskFlag {
  severity: RiskSeverity;
  category: string;
  title: string;
  description: string;
  dataSource: string;
  recommendation: string;
  rateImpact: number;
  confidence: number;
}

export interface LaserRecommendation {
  claimantId: string;
  shouldLaser: boolean;
  recommendedLaserAmount: number;
  rationale: string;
  impactOnGroupRate: number;
  confidence: number;
  diagnosis: string;
  totalIncurred: number;
  isOngoing: boolean;
}

export interface AttentionItem {
  priority: 1 | 2 | 3 | 4 | 5;
  category: 'RISK' | 'PRICING' | 'DATA_QUALITY' | 'COMPETITIVE' | 'COMPLIANCE';
  title: string;
  description: string;
  suggestedAction: string;
  impactIfIgnored: string;
}

export interface DecisionPoint {
  id: string;
  question: string;
  context: string;
  options: DecisionOption[];
  aiRecommendation: string;
  impactOfEachOption: Record<string, string>;
}

export interface DecisionOption {
  label: string;
  value: string;
  rateImpact: number;
}

export interface SensitivityPoint {
  value: string;
  rateImpact: number;
  premiumImpact: number;
  winProbabilityChange: number;
}

export interface SensitivityResult {
  variable: string;
  currentValue: string;
  alternativeValues: SensitivityPoint[];
}

export interface RateFactorDetail {
  factorName: string;
  factorValue: number;
  description: string;
  dataSource: string;
  impactOnRate: number;
  confidence: number;
}

export interface AIQuotedScenario {
  scenarioId: string;
  scenarioName: string;
  specificDeductible: number;
  contractBasis: string;
  manualRate: number;
  experienceRate: number | null;
  credibilityFactor: number;
  blendedRate: number;
  aiRecommendedRate: number;
  rateLow: number;
  rateMid: number;
  rateHigh: number;
  aiRecommendedPosition: 'LOW' | 'MID' | 'HIGH';
  positionRationale: string;
  totalAnnualPremium: number;
  confidence: number;
  winProbability: number;
  factorBreakdown: RateFactorDetail[];
}

export interface AIQuotePackage {
  rfpId: string;
  generatedAt: string;
  overallConfidence: number;
  recommendation: 'APPROVE' | 'REVIEW' | 'CAUTION' | 'DECLINE';
  quotabilityScore: QuotabilityScore;
  topAttentionItems: AttentionItem[];
  scenarios: AIQuotedScenario[];
  riskFlags: RiskFlag[];
  laserRecommendations: LaserRecommendation[];
  riskNarrative: string;
  comparableGroups: ComparableGroup[];
  sensitivityAnalysis: SensitivityResult[];
  decisionPoints: DecisionPoint[];
  dataSourcesUsed: string[];
  processingTimeMs: number;
  status: QuotePackageStatus;
}

export interface MagicButtonStep {
  step: number;
  name: string;
  duration: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  progress?: number;
}

export interface UWOverride {
  fieldName: string;
  aiRecommendedValue: string;
  uwFinalValue: string;
  direction: 'LOWER' | 'HIGHER' | 'SAME';
  magnitudePercent: number;
  uwNotes?: string;
}

export const QUOTABILITY_ROUTING = {
  AUTO_QUOTE: { label: 'Auto-Quote', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', min: 90 },
  FAST_TRACK: { label: 'Fast-Track', color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', min: 70 },
  STANDARD: { label: 'Standard Review', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', min: 50 },
  CAUTION: { label: 'Caution', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50', min: 30 },
  RECOMMEND_SKIP: { label: 'Recommend Skip', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', min: 0 },
} as const;

export function getRecommendation(score: number): QuotabilityRecommendation {
  if (score >= 90) return 'AUTO_QUOTE';
  if (score >= 70) return 'FAST_TRACK';
  if (score >= 50) return 'STANDARD';
  if (score >= 30) return 'CAUTION';
  return 'RECOMMEND_SKIP';
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreBg(score: number): string {
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  if (score >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}
