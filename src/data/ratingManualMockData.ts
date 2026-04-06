// Rating Manual Mock Data

export interface RatingManual {
  id: string;
  carrierId: string;
  carrierName: string;
  versionNumber: number;
  versionLabel: string;
  status: 'draft' | 'active' | 'archived';
  notes: string;
  effectiveDate: string;
  expirationDate?: string;
  sourceFileName?: string;
  uploadedBy: string;
  uploadedAt: string;
  activatedBy?: string;
  activatedAt?: string;
  archivedAt?: string;
  tableCounts: {
    baseRates: number;
    ageGender: number;
    areaFactors: number;
    planRelativity: number;
    industryFactors: number;
    trendFactors: number;
    leveragedTrend: number;
    contractAdjustments: number;
    expenseLoads: number;
  };
}

export interface AgeGenderFactor {
  age: number;
  maleFactor: number;
  femaleFactor: number;
}

export interface AreaFactor {
  zipPrefix: string;
  state: string;
  metroArea: string;
  factor: number;
}

export interface IndustryFactor {
  sicCode: string;
  sicDescription: string;
  riskTier: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  factor: number;
}

export interface BaseRate {
  rateType: string;
  groupSizeMin: number | null;
  groupSizeMax: number | null;
  dedMin: number | null;
  dedMax: number | null;
  baseRatePmpm: number;
  description: string;
}

export interface PlanRelativity {
  planCategory: string;
  dedRangeLabel: string;
  dedMin: number;
  dedMax: number;
  factor: number;
}

export interface TrendFactor {
  trendType: string;
  annualTrendRate: number;
  effectiveFrom: string;
  effectiveTo: string;
  notes: string;
}

export interface LeveragedTrend {
  dedMin: number;
  dedMax: number;
  groupSizeBand: string;
  factor: number;
}

export interface ContractAdjustment {
  contractBasis: string;
  factor: number;
  description: string;
}

export interface ExpenseLoad {
  loadType: string;
  rate: number;
  description: string;
}

// ---- MANUALS ----
export const MOCK_MANUALS: RatingManual[] = [
  {
    id: 'rm-001', carrierId: 'c1', carrierName: 'Pan American', versionNumber: 7,
    versionLabel: '2026 Annual Update', status: 'active',
    notes: 'Full annual refresh. Trend updated to 7.8%, area factors refreshed for all states.',
    effectiveDate: '2026-01-01', uploadedBy: 'Caleb Sieben', uploadedAt: '2025-12-15T10:00:00Z',
    activatedBy: 'Caleb Sieben', activatedAt: '2026-01-02T08:00:00Z',
    tableCounts: { baseRates: 6, ageGender: 131, areaFactors: 892, planRelativity: 8, industryFactors: 284, trendFactors: 2, leveragedTrend: 20, contractAdjustments: 5, expenseLoads: 6 },
  },
  {
    id: 'rm-002', carrierId: 'c1', carrierName: 'Pan American', versionNumber: 8,
    versionLabel: '2026 Q3 Trend Update', status: 'draft',
    notes: 'Updated trend to 7.8%, refreshed NJ/NY area factors.',
    effectiveDate: '2026-07-01', uploadedBy: 'Caleb Sieben', uploadedAt: '2026-04-01T09:00:00Z',
    tableCounts: { baseRates: 6, ageGender: 131, areaFactors: 892, planRelativity: 8, industryFactors: 284, trendFactors: 2, leveragedTrend: 20, contractAdjustments: 5, expenseLoads: 6 },
  },
  {
    id: 'rm-003', carrierId: 'c1', carrierName: 'Pan American', versionNumber: 6,
    versionLabel: '2025 Annual', status: 'archived',
    notes: 'Previous annual manual.',
    effectiveDate: '2025-01-01', expirationDate: '2025-12-31',
    uploadedBy: 'Caleb Sieben', uploadedAt: '2024-12-10T10:00:00Z',
    activatedBy: 'Caleb Sieben', activatedAt: '2025-01-02T08:00:00Z', archivedAt: '2026-01-02T08:00:00Z',
    tableCounts: { baseRates: 6, ageGender: 131, areaFactors: 880, planRelativity: 8, industryFactors: 278, trendFactors: 2, leveragedTrend: 20, contractAdjustments: 5, expenseLoads: 6 },
  },
  {
    id: 'rm-004', carrierId: 'c2', carrierName: 'Tokio Marine HCC', versionNumber: 2,
    versionLabel: '2026 Initial', status: 'active',
    notes: 'Initial TMHCC manual for 2026.',
    effectiveDate: '2026-01-01', uploadedBy: 'Caleb Sieben', uploadedAt: '2025-12-20T10:00:00Z',
    activatedBy: 'Caleb Sieben', activatedAt: '2026-01-05T08:00:00Z',
    tableCounts: { baseRates: 4, ageGender: 131, areaFactors: 640, planRelativity: 6, industryFactors: 260, trendFactors: 2, leveragedTrend: 16, contractAdjustments: 4, expenseLoads: 5 },
  },
  {
    id: 'rm-005', carrierId: 'c3', carrierName: 'BHSI', versionNumber: 1,
    versionLabel: '2026 Launch', status: 'active',
    notes: 'First BHSI manual.',
    effectiveDate: '2026-01-01', uploadedBy: 'Caleb Sieben', uploadedAt: '2025-12-22T10:00:00Z',
    activatedBy: 'Caleb Sieben', activatedAt: '2026-01-03T08:00:00Z',
    tableCounts: { baseRates: 3, ageGender: 131, areaFactors: 420, planRelativity: 5, industryFactors: 200, trendFactors: 2, leveragedTrend: 12, contractAdjustments: 4, expenseLoads: 5 },
  },
  {
    id: 'rm-006', carrierId: 'c4', carrierName: 'SLAIC', versionNumber: 3,
    versionLabel: '2026 Annual', status: 'active',
    notes: 'Annual refresh for SLAIC.',
    effectiveDate: '2026-01-01', uploadedBy: 'Caleb Sieben', uploadedAt: '2025-12-18T10:00:00Z',
    activatedBy: 'Caleb Sieben', activatedAt: '2026-01-04T08:00:00Z',
    tableCounts: { baseRates: 5, ageGender: 131, areaFactors: 780, planRelativity: 7, industryFactors: 270, trendFactors: 2, leveragedTrend: 20, contractAdjustments: 5, expenseLoads: 6 },
  },
];

// Generate age-gender factors (ages 0-65, M+F)
function generateAgeGenderFactors(): AgeGenderFactor[] {
  const factors: AgeGenderFactor[] = [];
  for (let age = 0; age <= 65; age++) {
    let mBase: number, fBase: number;
    if (age <= 1) { mBase = 0.32; fBase = 0.32; }
    else if (age <= 14) { mBase = 0.18 + age * 0.01; fBase = 0.18 + age * 0.012; }
    else if (age <= 24) { mBase = 0.30 + (age - 14) * 0.018; fBase = 0.35 + (age - 14) * 0.025; }
    else if (age <= 34) { mBase = 0.48 + (age - 24) * 0.012; fBase = 0.62 + (age - 24) * 0.025; }
    else if (age <= 44) { mBase = 0.60 + (age - 34) * 0.018; fBase = 0.87 + (age - 34) * 0.008; }
    else if (age <= 54) { mBase = 0.78 + (age - 44) * 0.035; fBase = 0.95 + (age - 44) * 0.012; }
    else if (age <= 64) { mBase = 1.13 + (age - 54) * 0.065; fBase = 1.07 + (age - 54) * 0.048; }
    else { mBase = 1.92; fBase = 1.65; }
    factors.push({
      age,
      maleFactor: Math.round(mBase * 10000) / 10000,
      femaleFactor: Math.round(fBase * 10000) / 10000,
    });
  }
  return factors;
}

export const MOCK_AGE_GENDER_FACTORS = generateAgeGenderFactors();

// Sample area factors
export const MOCK_AREA_FACTORS: AreaFactor[] = [
  { zipPrefix: '100', state: 'NY', metroArea: 'New York City', factor: 1.3500 },
  { zipPrefix: '101', state: 'NY', metroArea: 'New York City', factor: 1.3500 },
  { zipPrefix: '070', state: 'NJ', metroArea: 'Newark', factor: 1.2200 },
  { zipPrefix: '071', state: 'NJ', metroArea: 'Newark', factor: 1.2100 },
  { zipPrefix: '191', state: 'PA', metroArea: 'Philadelphia', factor: 1.1800 },
  { zipPrefix: '021', state: 'MA', metroArea: 'Boston', factor: 1.2800 },
  { zipPrefix: '331', state: 'FL', metroArea: 'Miami', factor: 1.1500 },
  { zipPrefix: '600', state: 'IL', metroArea: 'Chicago', factor: 1.0800 },
  { zipPrefix: '601', state: 'IL', metroArea: 'Chicago Suburbs', factor: 1.0500 },
  { zipPrefix: '481', state: 'MI', metroArea: 'Detroit', factor: 1.0200 },
  { zipPrefix: '554', state: 'MN', metroArea: 'Minneapolis', factor: 0.9500 },
  { zipPrefix: '555', state: 'MN', metroArea: 'Minneapolis', factor: 0.9500 },
  { zipPrefix: '556', state: 'MN', metroArea: 'Duluth', factor: 0.8800 },
  { zipPrefix: '430', state: 'OH', metroArea: 'Columbus', factor: 0.9200 },
  { zipPrefix: '441', state: 'OH', metroArea: 'Cleveland', factor: 0.9800 },
  { zipPrefix: '750', state: 'TX', metroArea: 'Dallas', factor: 0.9400 },
  { zipPrefix: '770', state: 'TX', metroArea: 'Houston', factor: 0.9600 },
  { zipPrefix: '841', state: 'UT', metroArea: 'Salt Lake City', factor: 0.8200 },
  { zipPrefix: '900', state: 'CA', metroArea: 'Los Angeles', factor: 1.2500 },
  { zipPrefix: '941', state: 'CA', metroArea: 'San Francisco', factor: 1.3200 },
  { zipPrefix: '981', state: 'WA', metroArea: 'Seattle', factor: 1.1200 },
  { zipPrefix: '802', state: 'CO', metroArea: 'Denver', factor: 0.9800 },
  { zipPrefix: '303', state: 'GA', metroArea: 'Atlanta', factor: 1.0000 },
  { zipPrefix: '530', state: 'WI', metroArea: 'Milwaukee', factor: 0.9100 },
  { zipPrefix: '537', state: 'WI', metroArea: 'Madison', factor: 0.9300 },
  { zipPrefix: '581', state: 'ND', metroArea: 'Fargo', factor: 0.7800 },
  { zipPrefix: '571', state: 'SD', metroArea: 'Sioux Falls', factor: 0.7600 },
  { zipPrefix: '503', state: 'IA', metroArea: 'Des Moines', factor: 0.8500 },
  { zipPrefix: '680', state: 'NE', metroArea: 'Omaha', factor: 0.8700 },
  { zipPrefix: '641', state: 'MO', metroArea: 'Kansas City', factor: 0.9100 },
];

// Industry factors
export const MOCK_INDUSTRY_FACTORS: IndustryFactor[] = [
  { sicCode: '0100', sicDescription: 'Cash Grains', riskTier: 'LOW', factor: 0.8800 },
  { sicCode: '1311', sicDescription: 'Crude Petroleum & Natural Gas', riskTier: 'HIGH', factor: 1.2500 },
  { sicCode: '1522', sicDescription: 'General Contractors - Residential', riskTier: 'ELEVATED', factor: 1.1200 },
  { sicCode: '2752', sicDescription: 'Commercial Printing, Lithographic', riskTier: 'MODERATE', factor: 1.0000 },
  { sicCode: '3559', sicDescription: 'Special Industry Machinery', riskTier: 'MODERATE', factor: 1.0200 },
  { sicCode: '4731', sicDescription: 'Freight Transportation Arrangement', riskTier: 'MODERATE', factor: 1.0100 },
  { sicCode: '5411', sicDescription: 'Grocery Stores', riskTier: 'LOW', factor: 0.9200 },
  { sicCode: '5812', sicDescription: 'Eating Places', riskTier: 'LOW', factor: 0.9000 },
  { sicCode: '6021', sicDescription: 'National Commercial Banks', riskTier: 'LOW', factor: 0.8800 },
  { sicCode: '7011', sicDescription: 'Hotels & Motels', riskTier: 'MODERATE', factor: 1.0000 },
  { sicCode: '7371', sicDescription: 'Computer Services', riskTier: 'LOW', factor: 0.8500 },
  { sicCode: '8011', sicDescription: 'Offices of Physicians', riskTier: 'LOW', factor: 0.9200 },
  { sicCode: '8062', sicDescription: 'General Medical & Surgical Hospitals', riskTier: 'ELEVATED', factor: 1.1500 },
  { sicCode: '8211', sicDescription: 'Elementary & Secondary Schools', riskTier: 'LOW', factor: 0.9000 },
  { sicCode: '8711', sicDescription: 'Engineering Services', riskTier: 'LOW', factor: 0.8800 },
  { sicCode: '9111', sicDescription: 'Executive Offices', riskTier: 'LOW', factor: 0.8600 },
  { sicCode: '3599', sicDescription: 'Industrial Machinery NEC', riskTier: 'ELEVATED', factor: 1.0800 },
  { sicCode: '2099', sicDescription: 'Food Preparations NEC', riskTier: 'MODERATE', factor: 0.9800 },
  { sicCode: '4911', sicDescription: 'Electric Services', riskTier: 'MODERATE', factor: 1.0500 },
  { sicCode: '5065', sicDescription: 'Electronic Parts & Equipment', riskTier: 'LOW', factor: 0.9100 },
];

// Base rates
export const MOCK_BASE_RATES: BaseRate[] = [
  { rateType: 'specific', groupSizeMin: 25, groupSizeMax: 50, dedMin: 25000, dedMax: 50000, baseRatePmpm: 385.00, description: 'Small group, low deductible' },
  { rateType: 'specific', groupSizeMin: 25, groupSizeMax: 50, dedMin: 50001, dedMax: 100000, baseRatePmpm: 320.00, description: 'Small group, mid deductible' },
  { rateType: 'specific', groupSizeMin: 51, groupSizeMax: 250, dedMin: 25000, dedMax: 50000, baseRatePmpm: 365.00, description: 'Mid group, low deductible' },
  { rateType: 'specific', groupSizeMin: 51, groupSizeMax: 250, dedMin: 50001, dedMax: 100000, baseRatePmpm: 298.00, description: 'Mid group, mid deductible' },
  { rateType: 'specific', groupSizeMin: 251, groupSizeMax: null, dedMin: 50001, dedMax: 100000, baseRatePmpm: 275.00, description: 'Large group, mid deductible' },
  { rateType: 'specific', groupSizeMin: 251, groupSizeMax: null, dedMin: 100001, dedMax: 250000, baseRatePmpm: 210.00, description: 'Large group, high deductible' },
];

// Plan relativity
export const MOCK_PLAN_RELATIVITY: PlanRelativity[] = [
  { planCategory: 'Rich PPO', dedRangeLabel: '$0-$500', dedMin: 0, dedMax: 500, factor: 1.1500 },
  { planCategory: 'Standard PPO', dedRangeLabel: '$501-$1,500', dedMin: 501, dedMax: 1500, factor: 1.0000 },
  { planCategory: 'High Ded PPO', dedRangeLabel: '$1,501-$3,000', dedMin: 1501, dedMax: 3000, factor: 0.8800 },
  { planCategory: 'HDHP', dedRangeLabel: '$3,001+', dedMin: 3001, dedMax: 10000, factor: 0.7800 },
  { planCategory: 'HMO Rich', dedRangeLabel: '$0-$500', dedMin: 0, dedMax: 500, factor: 1.0800 },
  { planCategory: 'HMO Standard', dedRangeLabel: '$501-$1,500', dedMin: 501, dedMax: 1500, factor: 0.9500 },
  { planCategory: 'EPO', dedRangeLabel: '$500-$2,000', dedMin: 500, dedMax: 2000, factor: 0.9200 },
  { planCategory: 'HDHP $3K+', dedRangeLabel: '$3,001-$7,000', dedMin: 3001, dedMax: 7000, factor: 0.4200 },
];

// Trend factors
export const MOCK_TREND_FACTORS: TrendFactor[] = [
  { trendType: 'medical', annualTrendRate: 0.0780, effectiveFrom: '2026-01-01', effectiveTo: '2026-12-31', notes: 'Reflects post-pandemic normalization' },
  { trendType: 'pharmacy', annualTrendRate: 0.0920, effectiveFrom: '2026-01-01', effectiveTo: '2026-12-31', notes: 'GLP-1 drug cost pressure' },
];

// Leveraged trend
export const MOCK_LEVERAGED_TREND: LeveragedTrend[] = [
  { dedMin: 25000, dedMax: 50000, groupSizeBand: '25-50', factor: 1.1800 },
  { dedMin: 25000, dedMax: 50000, groupSizeBand: '51-100', factor: 1.1600 },
  { dedMin: 25000, dedMax: 50000, groupSizeBand: '101-250', factor: 1.1500 },
  { dedMin: 25000, dedMax: 50000, groupSizeBand: '251+', factor: 1.1400 },
  { dedMin: 50001, dedMax: 75000, groupSizeBand: '25-50', factor: 1.1600 },
  { dedMin: 50001, dedMax: 75000, groupSizeBand: '51-100', factor: 1.1400 },
  { dedMin: 50001, dedMax: 75000, groupSizeBand: '101-250', factor: 1.1300 },
  { dedMin: 50001, dedMax: 75000, groupSizeBand: '251+', factor: 1.1200 },
  { dedMin: 75001, dedMax: 100000, groupSizeBand: '25-50', factor: 1.1400 },
  { dedMin: 75001, dedMax: 100000, groupSizeBand: '51-100', factor: 1.1200 },
  { dedMin: 75001, dedMax: 100000, groupSizeBand: '101-250', factor: 1.1100 },
  { dedMin: 75001, dedMax: 100000, groupSizeBand: '251+', factor: 1.1000 },
  { dedMin: 100001, dedMax: 150000, groupSizeBand: '25-50', factor: 1.1200 },
  { dedMin: 100001, dedMax: 150000, groupSizeBand: '51-100', factor: 1.1000 },
  { dedMin: 100001, dedMax: 150000, groupSizeBand: '101-250', factor: 1.0900 },
  { dedMin: 100001, dedMax: 150000, groupSizeBand: '251+', factor: 1.0800 },
  { dedMin: 150001, dedMax: 250000, groupSizeBand: '25-50', factor: 1.1000 },
  { dedMin: 150001, dedMax: 250000, groupSizeBand: '51-100', factor: 1.0800 },
  { dedMin: 150001, dedMax: 250000, groupSizeBand: '101-250', factor: 1.0700 },
  { dedMin: 150001, dedMax: 250000, groupSizeBand: '251+', factor: 1.0600 },
];

// Contract adjustments
export const MOCK_CONTRACT_ADJUSTMENTS: ContractAdjustment[] = [
  { contractBasis: '12/12', factor: 1.0000, description: 'Standard annual contract' },
  { contractBasis: '12/15', factor: 1.0800, description: '12-month policy / 15-month run-out' },
  { contractBasis: '12/18', factor: 1.1200, description: '12-month policy / 18-month run-out' },
  { contractBasis: '15/12', factor: 1.1000, description: '15-month policy / 12-month run-out' },
  { contractBasis: '24/12', factor: 1.1800, description: '24-month policy / 12-month run-out' },
];

// Expense loads
export const MOCK_EXPENSE_LOADS: ExpenseLoad[] = [
  { loadType: 'commission', rate: 0.0900, description: 'Producer commission' },
  { loadType: 'admin', rate: 0.0450, description: 'Administrative expense' },
  { loadType: 'premium_tax', rate: 0.0200, description: 'State premium tax (avg)' },
  { loadType: 'profit', rate: 0.0500, description: 'Carrier profit margin' },
  { loadType: 'contingency', rate: 0.0300, description: 'Contingency reserve' },
  { loadType: 'reinsurance', rate: 0.0500, description: 'Reinsurance cost' },
];

export const FACTOR_TABLE_NAMES = [
  { key: 'baseRates', label: 'Base Rates' },
  { key: 'ageGender', label: 'Age-Gender Factors' },
  { key: 'areaFactors', label: 'Area Factors' },
  { key: 'planRelativity', label: 'Plan Relativity' },
  { key: 'industryFactors', label: 'Industry Factors' },
  { key: 'trendFactors', label: 'Trend Factors' },
  { key: 'leveragedTrend', label: 'Leveraged Trend' },
  { key: 'contractAdjustments', label: 'Contract Adjustments' },
  { key: 'expenseLoads', label: 'Expense Loads' },
] as const;
