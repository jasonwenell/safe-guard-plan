import { RFP, RFPStatus, CensusReadyStatus, SetupTaskStatus, EmailInbox, Policy, DashboardStats, Carrier, TPA, Producer, CensusMember, Scenario } from '@/types/sleq';

export const MOCK_CARRIERS: Carrier[] = [
  { id: 'c1', code: 'PANAM', name: 'Pan American', isActive: true, quotableStates: ['AL','AZ','AR','CO','FL','GA','IL','IN','IA','KS','KY','LA','MI','MN','MS','MO','NE','NC','OH','OK','OR','PA','SC','TN','TX','UT','VA','WI'] },
  { id: 'c2', code: 'TMHCC', name: 'Tokio Marine HCC', isActive: true, quotableStates: ['AL','AZ','CA','CO','FL','GA','IL','IN','MI','MN','NC','OH','PA','TX','VA','WI'] },
  { id: 'c3', code: 'BHSI', name: 'Berkshire Hathaway Specialty Insurance', isActive: true, quotableStates: ['CA','CO','FL','GA','IL','MI','MN','NC','OH','PA','TX'], minLives: 25, maxLives: 125 },
  { id: 'c4', code: 'SLAIC', name: 'Stop Loss Insurance Company', isActive: true, quotableStates: ['AL','AZ','CO','FL','GA','IL','IN','IA','KS','MI','MN','MO','NE','NC','OH','OK','PA','SC','TN','TX','VA','WI'] },
];

export const MOCK_TPAS: TPA[] = [
  { id: 't1', code: 'ASR', name: 'ASR Health Benefits', isActive: true, defaultCarrierId: 'c1', renewalLeadMonths: 8, requiresMemberCensus: false },
  { id: 't2', code: 'IMS', name: 'Integrated Medical Solutions', isActive: true, renewalLeadMonths: 8, requiresMemberCensus: true },
  { id: 't3', code: 'CCAE', name: 'Cub Cabbage & Associates', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't4', code: 'JPF', name: 'JP Farley Corporation', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't5', code: 'MHS', name: 'Managed Health Services', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't6', code: 'EVE', name: 'Evergreen Health', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't7', code: 'PHPNI', name: 'PHP Network Inc', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't8', code: 'SBS', name: 'Strategic Benefit Solutions', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't9', code: 'ELI', name: 'Elite Benefits', isActive: false, renewalLeadMonths: 9, requiresMemberCensus: true },
  { id: 't10', code: 'WEL', name: 'Wellness Corp TPA', isActive: true, renewalLeadMonths: 9, requiresMemberCensus: true },
];

export const MOCK_PRODUCERS: Producer[] = [
  { id: 'p1', code: 'CCAE', name: 'Cub Cabbage & Associates', isActive: true, isTPA: true, linkedTPAId: 't3' },
  { id: 'p2', code: 'MARSH', name: 'Marsh & McLennan', isActive: true, isTPA: false },
  { id: 'p3', code: 'AON', name: 'Aon Risk Solutions', isActive: true, isTPA: false },
  { id: 'p4', code: 'WTW', name: 'Willis Towers Watson', isActive: true, isTPA: false },
  { id: 'p5', code: 'GALLAGHER', name: 'Arthur J. Gallagher', isActive: true, isTPA: false },
  { id: 'p6', code: 'HUB', name: 'Hub International', isActive: true, isTPA: false },
  { id: 'p7', code: 'LOCKTON', name: 'Lockton Companies', isActive: true, isTPA: false },
];

export const MOCK_RFPS: RFP[] = [
  {
    id: 'rfp-001', caseNumber: 24001, groupName: 'Midwest Manufacturing Corp', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't1', tpaCode: 'ASR', tpaName: 'ASR Health Benefits', producerId: 'p2', producerName: 'Marsh & McLennan',
    status: RFPStatus.SETUP, type: 'NEW', isRush: true, isDuplicate: false,
    assignedUWId: 'u3', assignedUWName: 'Juice Montezon', assignedAssociateId: 'u5', assignedAssociateName: 'Heidi Bouma',
    effectiveDate: '2026-07-01', receivedDate: '2026-04-01', requestDate: '2026-04-08', tpacDate: '2026-04-08',
    censusStatus: CensusReadyStatus.MEMBER_CENSUS, riskAssessmentStatus: SetupTaskStatus.RECEIVED,
    sobStatus: SetupTaskStatus.ENTERED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '3559', sicDescription: 'Special Industry Machinery', employeeCount: 285, state: 'MN',
    aiConfidenceScore: 0.92, isLocked: false, createdAt: '2026-04-01T09:30:00Z',
  },
  {
    id: 'rfp-002', caseNumber: 24002, groupName: 'Great Plains Agriculture LLC', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't2', tpaCode: 'IMS', tpaName: 'Integrated Medical Solutions', producerId: 'p3', producerName: 'Aon Risk Solutions',
    status: RFPStatus.IN_UNDERWRITING, type: 'RENEWAL', isRush: false, isDuplicate: false,
    assignedUWId: 'u4', assignedUWName: 'Steve Rogers', assignedAssociateId: 'u6', assignedAssociateName: 'Angie Vollhaber',
    effectiveDate: '2026-08-01', receivedDate: '2026-03-28', requestDate: '2026-04-04', tpacDate: '2026-04-04',
    censusStatus: CensusReadyStatus.READY, riskAssessmentStatus: SetupTaskStatus.VERIFIED,
    sobStatus: SetupTaskStatus.VERIFIED, ratingSystemStatus: SetupTaskStatus.ENTERED,
    setupComplete: true, sicCode: '0100', sicDescription: 'Cash Grains', employeeCount: 142, state: 'ND',
    isLocked: false, createdAt: '2026-03-28T14:15:00Z',
  },
  {
    id: 'rfp-003', caseNumber: 24003, groupName: 'Lakeside Healthcare System', carrierId: 'c2', carrierName: 'Tokio Marine HCC',
    tpaId: 't3', tpaCode: 'CCAE', tpaName: 'Cub Cabbage & Associates', producerId: 'p1', producerName: 'Cub Cabbage & Associates',
    status: RFPStatus.QUOTED, type: 'NEW', isRush: false, isDuplicate: true, duplicateCaseNumber: 24010,
    assignedUWId: 'u3', assignedUWName: 'Juice Montezon',
    effectiveDate: '2026-09-01', receivedDate: '2026-03-15', requestDate: '2026-03-22', tpacDate: '2026-03-22',
    censusStatus: CensusReadyStatus.READY, riskAssessmentStatus: SetupTaskStatus.VERIFIED,
    sobStatus: SetupTaskStatus.VERIFIED, ratingSystemStatus: SetupTaskStatus.VERIFIED,
    setupComplete: true, sicCode: '8062', sicDescription: 'General Medical & Surgical Hospitals', employeeCount: 1250, state: 'WI',
    isLocked: false, createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'rfp-004', caseNumber: 24004, groupName: 'Standard Printing Co', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't4', tpaCode: 'JPF', tpaName: 'JP Farley Corporation', producerId: 'p5', producerName: 'Arthur J. Gallagher',
    status: RFPStatus.INTAKE, type: 'NEW', isRush: false, isDuplicate: false,
    assignedAssociateId: 'u1', assignedAssociateName: 'Traci Gamer',
    effectiveDate: '2026-10-01', receivedDate: '2026-04-03', requestDate: '2026-04-10', tpacDate: '2026-04-10',
    censusStatus: CensusReadyStatus.WAITING, riskAssessmentStatus: SetupTaskStatus.NOT_STARTED,
    sobStatus: SetupTaskStatus.NOT_STARTED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '2752', sicDescription: 'Commercial Printing, Lithographic', employeeCount: 67, state: 'IL',
    aiConfidenceScore: 0.78, isLocked: false, createdAt: '2026-04-03T08:45:00Z',
  },
  {
    id: 'rfp-005', caseNumber: 24005, groupName: 'Rocky Mountain Resorts Inc', carrierId: 'c3', carrierName: 'BHSI',
    tpaId: 't5', tpaCode: 'MHS', tpaName: 'Managed Health Services', producerId: 'p4', producerName: 'Willis Towers Watson',
    status: RFPStatus.DRAFT, type: 'NEW', isRush: false, isDuplicate: false,
    effectiveDate: '2026-11-01', receivedDate: '2026-04-05', requestDate: '2026-04-12', tpacDate: '2026-04-12',
    censusStatus: CensusReadyStatus.WAITING, riskAssessmentStatus: SetupTaskStatus.NOT_STARTED,
    sobStatus: SetupTaskStatus.NOT_STARTED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '7011', sicDescription: 'Hotels & Motels', employeeCount: 95, state: 'CO',
    aiConfidenceScore: 0.65, isLocked: false, createdAt: '2026-04-05T11:20:00Z',
  },
  {
    id: 'rfp-006', caseNumber: 24006, groupName: 'Heartland School District #47', carrierId: 'c4', carrierName: 'SLAIC',
    tpaId: 't6', tpaCode: 'EVE', tpaName: 'Evergreen Health', producerId: 'p6', producerName: 'Hub International',
    status: RFPStatus.PROPOSAL_SENT, type: 'RENEWAL', isRush: false, isDuplicate: false,
    assignedUWId: 'u4', assignedUWName: 'Steve Rogers', assignedAssociateId: 'u7', assignedAssociateName: 'Polly Brohaugh',
    effectiveDate: '2026-07-01', receivedDate: '2026-03-01', requestDate: '2026-03-08', tpacDate: '2026-03-08',
    censusStatus: CensusReadyStatus.READY, riskAssessmentStatus: SetupTaskStatus.VERIFIED,
    sobStatus: SetupTaskStatus.VERIFIED, ratingSystemStatus: SetupTaskStatus.VERIFIED,
    setupComplete: true, sicCode: '8211', sicDescription: 'Elementary & Secondary Schools', employeeCount: 310, state: 'IA',
    isLocked: false, createdAt: '2026-03-01T07:30:00Z',
  },
  {
    id: 'rfp-007', caseNumber: 24007, groupName: 'Pacific Coast Logistics', carrierId: 'c2', carrierName: 'Tokio Marine HCC',
    tpaId: 't7', tpaCode: 'PHPNI', tpaName: 'PHP Network Inc', producerId: 'p7', producerName: 'Lockton Companies',
    status: RFPStatus.WON, type: 'NEW', isRush: false, isDuplicate: false,
    assignedUWId: 'u3', assignedUWName: 'Juice Montezon',
    effectiveDate: '2026-06-01', receivedDate: '2026-02-15', requestDate: '2026-02-22', tpacDate: '2026-02-22',
    censusStatus: CensusReadyStatus.READY, riskAssessmentStatus: SetupTaskStatus.VERIFIED,
    sobStatus: SetupTaskStatus.VERIFIED, ratingSystemStatus: SetupTaskStatus.VERIFIED,
    setupComplete: true, sicCode: '4731', sicDescription: 'Freight Transportation Arrangement', employeeCount: 520, state: 'CA',
    isLocked: true, createdAt: '2026-02-15T13:00:00Z',
  },
  {
    id: 'rfp-008', caseNumber: 24008, groupName: 'Appalachian Energy Services', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't8', tpaCode: 'SBS', tpaName: 'Strategic Benefit Solutions', producerId: 'p2', producerName: 'Marsh & McLennan',
    status: RFPStatus.DECLINED, type: 'NEW', isRush: false, isDuplicate: false,
    effectiveDate: '2026-08-01', receivedDate: '2026-03-20', requestDate: '2026-03-27', tpacDate: '2026-03-27',
    censusStatus: CensusReadyStatus.WAITING, riskAssessmentStatus: SetupTaskStatus.NOT_STARTED,
    sobStatus: SetupTaskStatus.NOT_STARTED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '1311', sicDescription: 'Crude Petroleum & Natural Gas', employeeCount: 45, state: 'WV',
    isLocked: false, createdAt: '2026-03-20T16:45:00Z',
  },
  {
    id: 'rfp-009', caseNumber: 24009, groupName: 'Northern Lakes Construction', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't1', tpaCode: 'ASR', tpaName: 'ASR Health Benefits', producerId: 'p3', producerName: 'Aon Risk Solutions',
    status: RFPStatus.SETUP, type: 'NEW', isRush: false, isDuplicate: false,
    assignedUWId: 'u4', assignedUWName: 'Steve Rogers', assignedAssociateId: 'u5', assignedAssociateName: 'Heidi Bouma',
    effectiveDate: '2026-09-01', receivedDate: '2026-04-02', requestDate: '2026-04-09', tpacDate: '2026-04-09',
    censusStatus: CensusReadyStatus.EMPLOYEE_CENSUS, riskAssessmentStatus: SetupTaskStatus.NOT_STARTED,
    sobStatus: SetupTaskStatus.RECEIVED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '1522', sicDescription: 'General Contractors - Residential', employeeCount: 78, state: 'MN',
    isLocked: false, createdAt: '2026-04-02T10:15:00Z',
  },
  {
    id: 'rfp-010', caseNumber: 24010, groupName: 'Lakeside Healthcare System', carrierId: 'c1', carrierName: 'Pan American',
    tpaId: 't10', tpaCode: 'WEL', tpaName: 'Wellness Corp TPA', producerId: 'p4', producerName: 'Willis Towers Watson',
    status: RFPStatus.SETUP, type: 'NEW', isRush: false, isDuplicate: true, duplicateCaseNumber: 24003,
    assignedUWId: 'u4', assignedUWName: 'Steve Rogers', assignedAssociateId: 'u6', assignedAssociateName: 'Angie Vollhaber',
    effectiveDate: '2026-09-01', receivedDate: '2026-03-18', requestDate: '2026-03-25', tpacDate: '2026-03-25',
    censusStatus: CensusReadyStatus.MEMBER_CENSUS, riskAssessmentStatus: SetupTaskStatus.RECEIVED,
    sobStatus: SetupTaskStatus.ENTERED, ratingSystemStatus: SetupTaskStatus.NOT_STARTED,
    setupComplete: false, sicCode: '8062', sicDescription: 'General Medical & Surgical Hospitals', employeeCount: 1250, state: 'WI',
    isLocked: false, createdAt: '2026-03-18T09:00:00Z',
  },
];

export const MOCK_EMAILS: EmailInbox[] = [
  { id: 'e1', fromAddress: 'jsmith@asrhealthbenefits.com', fromName: 'Jane Smith', subject: 'RFP - Midwest Manufacturing Corp - 7/1/2026 Effective', receivedAt: '2026-04-05T08:30:00Z', processingStatus: 'completed', tpaDetected: 'ASR', groupDetected: 'Midwest Manufacturing Corp', attachmentCount: 3, rfpId: 'rfp-001' },
  { id: 'e2', fromAddress: 'mike@jpfarley.com', fromName: 'Mike Johnson', subject: 'New Quote Request - Standard Printing Co - 10/1 eff', receivedAt: '2026-04-05T09:15:00Z', processingStatus: 'completed', tpaDetected: 'JPF', groupDetected: 'Standard Printing Co', attachmentCount: 2, rfpId: 'rfp-004' },
  { id: 'e3', fromAddress: 'sarah@mhstpa.com', fromName: 'Sarah Davis', subject: 'Quote Needed ASAP - Rocky Mountain Resorts - Nov 1 Effective', receivedAt: '2026-04-05T10:00:00Z', processingStatus: 'pending', tpaDetected: 'MHS', groupDetected: 'Rocky Mountain Resorts Inc', attachmentCount: 4 },
  { id: 'e4', fromAddress: 'tom@evergreentpa.com', fromName: 'Tom Wilson', subject: 'FW: Census & SoB - Valley Tech Solutions', receivedAt: '2026-04-05T10:45:00Z', processingStatus: 'pending', attachmentCount: 5 },
  { id: 'e5', fromAddress: 'lisa@sbstpa.com', fromName: 'Lisa Chen', subject: 'Re: Quote Request - Mountain View Medical Group', receivedAt: '2026-04-05T11:30:00Z', processingStatus: 'processing', tpaDetected: 'SBS', attachmentCount: 2 },
  { id: 'e6', fromAddress: 'noreply@marketingco.com', fromName: 'Marketing Updates', subject: 'Your Weekly Newsletter', receivedAt: '2026-04-05T07:00:00Z', processingStatus: 'skipped', attachmentCount: 0 },
];

export const MOCK_POLICIES: Policy[] = [
  { id: 'pol-001', policyNumber: 'PA-2025-4721', groupName: 'Pacific Coast Logistics', carrierId: 'c2', carrierName: 'Tokio Marine HCC', tpaName: 'PHP Network Inc', producerName: 'Lockton Companies', effectiveDate: '2025-06-01', expirationDate: '2026-06-01', status: 'ACTIVE', premiumAmount: 892400 },
  { id: 'pol-002', policyNumber: 'PA-2025-4650', groupName: 'Heartland School District #47', carrierId: 'c4', carrierName: 'SLAIC', tpaName: 'Evergreen Health', producerName: 'Hub International', effectiveDate: '2025-07-01', expirationDate: '2026-07-01', status: 'ACTIVE', premiumAmount: 445000 },
  { id: 'pol-003', policyNumber: 'PA-2025-4580', groupName: 'Great Plains Agriculture LLC', carrierId: 'c1', carrierName: 'Pan American', tpaName: 'Integrated Medical Solutions', producerName: 'Aon Risk Solutions', effectiveDate: '2025-08-01', expirationDate: '2026-08-01', status: 'ACTIVE', premiumAmount: 267800 },
  { id: 'pol-004', policyNumber: 'PA-2024-4102', groupName: 'Northern Iron Works', carrierId: 'c1', carrierName: 'Pan American', tpaName: 'ASR Health Benefits', producerName: 'Marsh & McLennan', effectiveDate: '2024-10-01', expirationDate: '2025-10-01', status: 'EXPIRED', premiumAmount: 189000 },
  { id: 'pol-005', policyNumber: 'PA-2025-4715', groupName: 'Sunbelt Retail Group', carrierId: 'c3', carrierName: 'BHSI', tpaName: 'Cub Cabbage & Associates', producerName: 'Willis Towers Watson', effectiveDate: '2025-05-01', expirationDate: '2026-05-01', status: 'ACTIVE', premiumAmount: 156300 },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalActiveRFPs: 127,
  dueToday: 14,
  rushCases: 3,
  pendingSetup: 42,
  inUnderwriting: 28,
  quotedThisMonth: 67,
  wonThisMonth: 12,
  avgDaysToQuote: 3.2,
};

export const MOCK_CENSUS_MEMBERS: CensusMember[] = [
  { id: 'cm1', rfpId: 'rfp-001', firstName: 'John', lastName: 'Anderson', dateOfBirth: '1985-03-15', gender: 'M', zipCode: '55401', relationship: 'EMPLOYEE', status: 'ACTIVE', planName: 'Gold PPO', coverageTier: 'FAM', aiMapped: true, aiConfidence: 0.95 },
  { id: 'cm2', rfpId: 'rfp-001', firstName: 'Sarah', lastName: 'Anderson', dateOfBirth: '1987-07-22', gender: 'F', zipCode: '55401', relationship: 'SPOUSE', status: 'ACTIVE', planName: 'Gold PPO', coverageTier: 'FAM', aiMapped: true, aiConfidence: 0.95 },
  { id: 'cm3', rfpId: 'rfp-001', firstName: 'Maria', lastName: 'Garcia', dateOfBirth: '1990-11-08', gender: 'F', zipCode: '55402', relationship: 'EMPLOYEE', status: 'ACTIVE', planName: 'Silver HDHP', coverageTier: 'EE', aiMapped: true, aiConfidence: 0.88 },
  { id: 'cm4', rfpId: 'rfp-001', firstName: 'Robert', lastName: 'Chen', dateOfBirth: '1972-01-30', gender: 'M', zipCode: '55403', relationship: 'EMPLOYEE', status: 'ACTIVE', planName: 'Gold PPO', coverageTier: 'EE+SP', aiMapped: true, aiConfidence: 0.92 },
  { id: 'cm5', rfpId: 'rfp-001', firstName: 'Emily', lastName: 'Williams', dateOfBirth: '1995-06-14', gender: 'F', zipCode: '55404', relationship: 'EMPLOYEE', status: 'COBRA', planName: 'Silver HDHP', coverageTier: 'EE', aiMapped: true, aiConfidence: 0.78 },
];

export const MOCK_SCENARIOS: Scenario[] = [
  { id: 's1', rfpId: 'rfp-001', name: 'Option A - $50K Specific', sequenceNumber: 1, isLocked: false, contractBasis: '12/12', specificDeductible: 50000, aggregateDeductible: 250000, manualRate: 142.50, finalRate: 142.50, uwAdjustmentFactor: 1.0 },
  { id: 's2', rfpId: 'rfp-001', name: 'Option B - $75K Specific', sequenceNumber: 2, isLocked: false, contractBasis: '12/12', specificDeductible: 75000, aggregateDeductible: 300000, manualRate: 118.75, finalRate: 112.81, uwAdjustmentFactor: 0.95 },
  { id: 's3', rfpId: 'rfp-001', name: 'Option C - $100K Specific', sequenceNumber: 3, isLocked: false, contractBasis: '12/15', specificDeductible: 100000, aggregateDeductible: 350000, manualRate: 96.20, experienceRate: 88.40, finalRate: 91.30, uwAdjustmentFactor: 0.95 },
];
