import { RFP, RFPStatus, CensusReadyStatus, SetupTaskStatus, EmailInbox, Policy, DashboardStats, Carrier, TPA, Producer, CensusMember, Scenario, IntakeDocument, EmailDetail, ExtractedField, ClaimsExperienceMonth, LargeClaimant, PriorYearSummary, CaseCommunication, QuoteOutcome, BindingRecord } from '@/types/sleq';

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

// Extended email detail data
export const MOCK_EMAIL_DETAILS: EmailDetail[] = [
  {
    id: 'e1', fromAddress: 'jsmith@asrhealthbenefits.com', fromName: 'Jane Smith',
    subject: 'RFP - Midwest Manufacturing Corp - 7/1/2026 Effective',
    receivedAt: '2026-04-05T08:30:00Z', processingStatus: 'completed',
    tpaDetected: 'ASR', groupDetected: 'Midwest Manufacturing Corp',
    attachmentCount: 3, rfpId: 'rfp-001',
    toAddress: 'quotes@tpac.com',
    ccAddresses: ['underwriting@tpac.com'],
    bodyPreview: `Hi Team,\n\nPlease find attached the RFP for Midwest Manufacturing Corp with an effective date of 7/1/2026.\n\nGroup Details:\n- Group Name: Midwest Manufacturing Corp\n- SIC Code: 3559\n- Situs State: Minnesota\n- Eligible Employees: 285\n- Current Carrier: Blue Cross Blue Shield\n\nAttached documents:\n1. Census file (Excel)\n2. Summary of Benefits\n3. RFP Letter with quote specifications\n\nPlease let me know if you need any additional information.\n\nBest regards,\nJane Smith\nASR Health Benefits`,
    aiSummary: 'New business RFP from ASR Health Benefits for Midwest Manufacturing Corp, a 285-employee manufacturing company in Minnesota. Effective date 7/1/2026. Three documents attached: census, SoB, and RFP letter. Group currently with BCBS. SIC 3559 (Special Industry Machinery).',
    aiExtractedFields: [
      { fieldName: 'Group Name', value: 'Midwest Manufacturing Corp', confidence: 0.98, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'TPA', value: 'ASR Health Benefits', confidence: 0.99, sourceLocation: 'Sender Domain', accepted: true },
      { fieldName: 'Effective Date', value: '2026-07-01', confidence: 0.95, sourceLocation: 'Subject Line', accepted: true },
      { fieldName: 'SIC Code', value: '3559', confidence: 0.92, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'State', value: 'MN', confidence: 0.90, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'Employee Count', value: '285', confidence: 0.94, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'Current Carrier', value: 'Blue Cross Blue Shield', confidence: 0.88, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'Quote Type', value: 'New Business', confidence: 0.85, sourceLocation: 'Inferred', accepted: true },
    ],
    documents: [
      {
        id: 'doc-e1-1', fileName: 'Midwest_Mfg_Census_2026.xlsx', fileType: 'xlsx', fileSize: 245000,
        uploadedAt: '2026-04-05T08:30:00Z', uploadSource: 'email', emailId: 'e1', rfpId: 'rfp-001',
        documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.97,
        processingStatus: 'accepted', processingProgress: 100, pageCount: 3,
        extractedFields: [
          { fieldName: 'Total Rows', value: '285', confidence: 0.99, accepted: true },
          { fieldName: 'Columns Found', value: 'Name, DOB, Gender, ZIP, Relationship, Plan, Tier', confidence: 0.95, accepted: true },
          { fieldName: 'Coverage Tiers', value: 'EE, EE+SP, EE+CH, FAM', confidence: 0.92, accepted: true },
        ],
      },
      {
        id: 'doc-e1-2', fileName: 'Midwest_Mfg_SoB.pdf', fileType: 'pdf', fileSize: 1200000,
        uploadedAt: '2026-04-05T08:30:00Z', uploadSource: 'email', emailId: 'e1', rfpId: 'rfp-001',
        documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.94,
        processingStatus: 'accepted', processingProgress: 100, pageCount: 12,
        extractedFields: [
          { fieldName: 'Plan Types', value: 'Gold PPO, Silver HDHP', confidence: 0.91, accepted: true },
          { fieldName: 'Deductible (PPO)', value: '$500/$1,000', confidence: 0.88, accepted: true },
          { fieldName: 'Deductible (HDHP)', value: '$2,800/$5,600', confidence: 0.90, accepted: true },
          { fieldName: 'OOP Max (PPO)', value: '$4,000/$8,000', confidence: 0.87, accepted: true },
          { fieldName: 'Rx Coverage', value: '$10/$30/$50', confidence: 0.85, accepted: true },
        ],
      },
      {
        id: 'doc-e1-3', fileName: 'RFP_Letter_Midwest.pdf', fileType: 'pdf', fileSize: 89000,
        uploadedAt: '2026-04-05T08:30:00Z', uploadSource: 'email', emailId: 'e1', rfpId: 'rfp-001',
        documentType: 'rfp_letter', aiClassifiedType: 'rfp_letter', aiClassificationConfidence: 0.96,
        processingStatus: 'accepted', processingProgress: 100, pageCount: 2,
        extractedFields: [
          { fieldName: 'Specific Deductible Requested', value: '$50,000 / $75,000 / $100,000', confidence: 0.93, accepted: true },
          { fieldName: 'Contract Basis', value: '12/12 and 12/15', confidence: 0.90, accepted: true },
          { fieldName: 'Aggregate Requested', value: 'Yes', confidence: 0.88, accepted: true },
        ],
      },
    ],
    linkedRfpId: 'rfp-001',
    threadId: 'thread-001',
    threadCount: 1,
  },
  {
    id: 'e2', fromAddress: 'mike@jpfarley.com', fromName: 'Mike Johnson',
    subject: 'New Quote Request - Standard Printing Co - 10/1 eff',
    receivedAt: '2026-04-05T09:15:00Z', processingStatus: 'completed',
    tpaDetected: 'JPF', groupDetected: 'Standard Printing Co',
    attachmentCount: 2, rfpId: 'rfp-004',
    toAddress: 'quotes@tpac.com',
    bodyPreview: `Good morning,\n\nWe'd like to request a stop-loss quote for Standard Printing Co.\n\n- Group: Standard Printing Co\n- SIC: 2752 (Commercial Printing)\n- Location: Chicago, IL\n- Employees: 67\n- Effective: 10/1/2026\n\nCensus and Summary of Benefits attached.\n\nThanks,\nMike Johnson\nJP Farley Corporation`,
    aiSummary: 'New business quote request from JP Farley for Standard Printing Co, 67 employees in Illinois. Effective 10/1/2026. Census and SoB attached.',
    aiExtractedFields: [
      { fieldName: 'Group Name', value: 'Standard Printing Co', confidence: 0.97, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'TPA', value: 'JP Farley Corporation', confidence: 0.99, sourceLocation: 'Sender Domain', accepted: true },
      { fieldName: 'Effective Date', value: '2026-10-01', confidence: 0.93, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'SIC Code', value: '2752', confidence: 0.91, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'State', value: 'IL', confidence: 0.89, sourceLocation: 'Email Body', accepted: true },
      { fieldName: 'Employee Count', value: '67', confidence: 0.95, sourceLocation: 'Email Body', accepted: true },
    ],
    documents: [
      {
        id: 'doc-e2-1', fileName: 'StandardPrinting_Census.xlsx', fileType: 'xlsx', fileSize: 98000,
        uploadedAt: '2026-04-05T09:15:00Z', uploadSource: 'email', emailId: 'e2', rfpId: 'rfp-004',
        documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.95,
        processingStatus: 'accepted', processingProgress: 100, pageCount: 1,
        extractedFields: [
          { fieldName: 'Total Rows', value: '67', confidence: 0.99, accepted: true },
          { fieldName: 'Columns Found', value: 'Name, DOB, Gender, ZIP, Tier', confidence: 0.90, accepted: true },
        ],
      },
      {
        id: 'doc-e2-2', fileName: 'StandardPrinting_SoB.pdf', fileType: 'pdf', fileSize: 850000,
        uploadedAt: '2026-04-05T09:15:00Z', uploadSource: 'email', emailId: 'e2', rfpId: 'rfp-004',
        documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.92,
        processingStatus: 'review', processingProgress: 100, pageCount: 8,
        extractedFields: [
          { fieldName: 'Plan Type', value: 'PPO', confidence: 0.88, accepted: false },
          { fieldName: 'Deductible', value: '$750/$1,500', confidence: 0.82, accepted: false },
          { fieldName: 'OOP Max', value: '$5,000/$10,000', confidence: 0.79, accepted: false },
        ],
      },
    ],
    linkedRfpId: 'rfp-004',
    threadId: 'thread-002',
    threadCount: 1,
  },
  {
    id: 'e3', fromAddress: 'sarah@mhstpa.com', fromName: 'Sarah Davis',
    subject: 'Quote Needed ASAP - Rocky Mountain Resorts - Nov 1 Effective',
    receivedAt: '2026-04-05T10:00:00Z', processingStatus: 'pending',
    tpaDetected: 'MHS', groupDetected: 'Rocky Mountain Resorts Inc',
    attachmentCount: 4,
    toAddress: 'quotes@tpac.com',
    ccAddresses: ['urgent@tpac.com'],
    bodyPreview: `URGENT REQUEST\n\nWe need a rush quote for Rocky Mountain Resorts Inc.\n\n- Group: Rocky Mountain Resorts Inc\n- SIC: 7011 (Hotels & Motels)\n- Location: Denver, CO\n- Employees: 95\n- Effective: 11/1/2026\n\nAttached: Census, Summary of Benefits, Prior Year Experience, and Application.\n\nThis is a rush — group is currently in market with multiple carriers.\n\nSarah Davis\nManaged Health Services`,
    aiSummary: 'Rush quote request from MHS for Rocky Mountain Resorts, 95-employee hospitality group in Colorado. Multiple carriers in play. Four documents attached including census, SoB, experience data, and application.',
    aiExtractedFields: [
      { fieldName: 'Group Name', value: 'Rocky Mountain Resorts Inc', confidence: 0.96, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'TPA', value: 'Managed Health Services', confidence: 0.99, sourceLocation: 'Sender Signature', accepted: false },
      { fieldName: 'Effective Date', value: '2026-11-01', confidence: 0.94, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'SIC Code', value: '7011', confidence: 0.90, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'State', value: 'CO', confidence: 0.88, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'Employee Count', value: '95', confidence: 0.93, sourceLocation: 'Email Body', accepted: false },
      { fieldName: 'Rush', value: 'Yes', confidence: 0.92, sourceLocation: 'Subject + Body', accepted: false },
    ],
    documents: [
      {
        id: 'doc-e3-1', fileName: 'RockyMtn_Census_2026.xlsx', fileType: 'xlsx', fileSize: 156000,
        uploadedAt: '2026-04-05T10:00:00Z', uploadSource: 'email', emailId: 'e3',
        documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.93,
        processingStatus: 'queued', pageCount: 2,
      },
      {
        id: 'doc-e3-2', fileName: 'RockyMtn_Benefits_Summary.pdf', fileType: 'pdf', fileSize: 1100000,
        uploadedAt: '2026-04-05T10:00:00Z', uploadSource: 'email', emailId: 'e3',
        documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.91,
        processingStatus: 'queued', pageCount: 10,
      },
      {
        id: 'doc-e3-3', fileName: 'RockyMtn_Claims_Experience.pdf', fileType: 'pdf', fileSize: 2400000,
        uploadedAt: '2026-04-05T10:00:00Z', uploadSource: 'email', emailId: 'e3',
        documentType: 'experience', aiClassifiedType: 'experience', aiClassificationConfidence: 0.87,
        processingStatus: 'queued', pageCount: 24,
      },
      {
        id: 'doc-e3-4', fileName: 'RockyMtn_Application.pdf', fileType: 'pdf', fileSize: 320000,
        uploadedAt: '2026-04-05T10:00:00Z', uploadSource: 'email', emailId: 'e3',
        documentType: 'application', aiClassifiedType: 'application', aiClassificationConfidence: 0.89,
        processingStatus: 'queued', pageCount: 4,
      },
    ],
    threadId: 'thread-003',
    threadCount: 1,
  },
  {
    id: 'e4', fromAddress: 'tom@evergreentpa.com', fromName: 'Tom Wilson',
    subject: 'FW: Census & SoB - Valley Tech Solutions',
    receivedAt: '2026-04-05T10:45:00Z', processingStatus: 'pending',
    attachmentCount: 5,
    toAddress: 'quotes@tpac.com',
    bodyPreview: `FYI — forwarding docs for Valley Tech Solutions. See below for details.\n\n---------- Forwarded message ----------\nFrom: HR Department <hr@valleytech.com>\n\nHi Tom,\n\nHere are the requested documents for our stop-loss renewal:\n- Updated census\n- Current SoB (2 plan types)\n- Large claimant report\n- Enrollment summary\n- Prior carrier ID cards\n\nLet me know if you need anything else.\n\nRegards,\nValley Tech HR`,
    aiSummary: 'Forwarded renewal documents from Evergreen Health for Valley Tech Solutions. Five attachments including census, two-plan SoB, large claimant report, enrollment summary, and ID cards. TPA not yet detected from domain — likely Evergreen Health (EVE).',
    aiExtractedFields: [
      { fieldName: 'Group Name', value: 'Valley Tech Solutions', confidence: 0.91, sourceLocation: 'Subject + Body', accepted: false },
      { fieldName: 'TPA', value: 'Evergreen Health', confidence: 0.82, sourceLocation: 'Sender Domain', accepted: false },
      { fieldName: 'Quote Type', value: 'Renewal', confidence: 0.78, sourceLocation: 'Email Body', accepted: false },
    ],
    documents: [
      {
        id: 'doc-e4-1', fileName: 'ValleyTech_Census_Updated.xlsx', fileType: 'xlsx', fileSize: 178000,
        uploadedAt: '2026-04-05T10:45:00Z', uploadSource: 'email', emailId: 'e4',
        documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.94,
        processingStatus: 'queued', pageCount: 2,
      },
      {
        id: 'doc-e4-2', fileName: 'ValleyTech_SoB_PPO.pdf', fileType: 'pdf', fileSize: 920000,
        uploadedAt: '2026-04-05T10:45:00Z', uploadSource: 'email', emailId: 'e4',
        documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.90,
        processingStatus: 'queued', pageCount: 9,
      },
      {
        id: 'doc-e4-3', fileName: 'ValleyTech_SoB_HDHP.pdf', fileType: 'pdf', fileSize: 780000,
        uploadedAt: '2026-04-05T10:45:00Z', uploadSource: 'email', emailId: 'e4',
        documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.88,
        processingStatus: 'queued', pageCount: 7,
      },
      {
        id: 'doc-e4-4', fileName: 'ValleyTech_LargeClaimants.pdf', fileType: 'pdf', fileSize: 450000,
        uploadedAt: '2026-04-05T10:45:00Z', uploadSource: 'email', emailId: 'e4',
        documentType: 'experience', aiClassifiedType: 'experience', aiClassificationConfidence: 0.85,
        processingStatus: 'queued', pageCount: 5,
      },
      {
        id: 'doc-e4-5', fileName: 'ValleyTech_ID_Cards.pdf', fileType: 'pdf', fileSize: 2100000,
        uploadedAt: '2026-04-05T10:45:00Z', uploadSource: 'email', emailId: 'e4',
        documentType: 'id_cards', aiClassifiedType: 'id_cards', aiClassificationConfidence: 0.76,
        processingStatus: 'queued', pageCount: 15,
      },
    ],
    threadId: 'thread-004',
    threadCount: 1,
  },
  {
    id: 'e5', fromAddress: 'lisa@sbstpa.com', fromName: 'Lisa Chen',
    subject: 'Re: Quote Request - Mountain View Medical Group',
    receivedAt: '2026-04-05T11:30:00Z', processingStatus: 'processing',
    tpaDetected: 'SBS', attachmentCount: 2,
    toAddress: 'quotes@tpac.com',
    bodyPreview: `Following up on our earlier request. Here are the updated documents for Mountain View Medical Group.\n\nUpdated census reflects recent terminations.\n\nLisa Chen\nStrategic Benefit Solutions`,
    aiSummary: 'Follow-up from SBS with updated documents for Mountain View Medical Group. Updated census with recent termination changes. Part of ongoing thread.',
    aiExtractedFields: [
      { fieldName: 'Group Name', value: 'Mountain View Medical Group', confidence: 0.94, sourceLocation: 'Subject', accepted: false },
      { fieldName: 'TPA', value: 'Strategic Benefit Solutions', confidence: 0.98, sourceLocation: 'Sender', accepted: false },
    ],
    documents: [
      {
        id: 'doc-e5-1', fileName: 'MtnView_Census_v2.xlsx', fileType: 'xlsx', fileSize: 134000,
        uploadedAt: '2026-04-05T11:30:00Z', uploadSource: 'email', emailId: 'e5',
        documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.96,
        processingStatus: 'extracting', processingProgress: 62, pageCount: 2,
      },
      {
        id: 'doc-e5-2', fileName: 'MtnView_Experience_Report.pdf', fileType: 'pdf', fileSize: 1800000,
        uploadedAt: '2026-04-05T11:30:00Z', uploadSource: 'email', emailId: 'e5',
        documentType: 'experience', aiClassifiedType: 'experience', aiClassificationConfidence: 0.84,
        processingStatus: 'classifying', processingProgress: 30, pageCount: 18,
      },
    ],
    threadId: 'thread-005',
    threadCount: 3,
  },
  {
    id: 'e6', fromAddress: 'noreply@marketingco.com', fromName: 'Marketing Updates',
    subject: 'Your Weekly Newsletter',
    receivedAt: '2026-04-05T07:00:00Z', processingStatus: 'skipped',
    attachmentCount: 0,
    toAddress: 'quotes@tpac.com',
    bodyPreview: 'This email was automatically skipped — no RFP-related content detected.',
    aiSummary: 'Marketing newsletter. No RFP content. Auto-skipped.',
    documents: [],
    threadId: 'thread-006',
    threadCount: 1,
  },
];

// Manually uploaded documents (not from email)
export const MOCK_MANUAL_DOCUMENTS: IntakeDocument[] = [
  {
    id: 'doc-m1', fileName: 'Sunbelt_Retail_Census_2026.xlsx', fileType: 'xlsx', fileSize: 312000,
    uploadedAt: '2026-04-04T14:20:00Z', uploadSource: 'manual', rfpId: 'rfp-005',
    documentType: 'census', aiClassifiedType: 'census', aiClassificationConfidence: 0.96,
    processingStatus: 'accepted', processingProgress: 100, pageCount: 4,
    extractedFields: [
      { fieldName: 'Total Rows', value: '95', confidence: 0.99, accepted: true },
      { fieldName: 'Columns Found', value: 'Name, DOB, Gender, ZIP, Relationship, Plan', confidence: 0.94, accepted: true },
      { fieldName: 'Plans Detected', value: 'PPO, HDHP', confidence: 0.89, accepted: true },
    ],
  },
  {
    id: 'doc-m2', fileName: 'Sunbelt_SoB_AllPlans.pdf', fileType: 'pdf', fileSize: 1450000,
    uploadedAt: '2026-04-04T14:22:00Z', uploadSource: 'manual', rfpId: 'rfp-005',
    documentType: 'sob', aiClassifiedType: 'sob', aiClassificationConfidence: 0.93,
    processingStatus: 'review', processingProgress: 100, pageCount: 14,
    extractedFields: [
      { fieldName: 'Plan Count', value: '2', confidence: 0.91, accepted: false },
      { fieldName: 'PPO Deductible', value: '$1,000/$2,000', confidence: 0.86, accepted: false },
      { fieldName: 'HDHP Deductible', value: '$3,000/$6,000', confidence: 0.84, accepted: false },
      { fieldName: 'Coinsurance', value: '80/20 PPO, 100% after ded HDHP', confidence: 0.78, accepted: false },
    ],
  },
  {
    id: 'doc-m3', fileName: 'NorthernLakes_Experience_2024.pdf', fileType: 'pdf', fileSize: 3200000,
    uploadedAt: '2026-04-03T09:10:00Z', uploadSource: 'manual', rfpId: 'rfp-009',
    documentType: 'experience', aiClassifiedType: 'experience', aiClassificationConfidence: 0.88,
    processingStatus: 'accepted', processingProgress: 100, pageCount: 28,
    extractedFields: [
      { fieldName: 'Reporting Period', value: '01/2024 - 12/2024', confidence: 0.95, accepted: true },
      { fieldName: 'Total Paid Claims', value: '$1,245,678', confidence: 0.91, accepted: true },
      { fieldName: 'Large Claimants (>$50K)', value: '3', confidence: 0.88, accepted: true },
      { fieldName: 'Largest Claim', value: '$287,450', confidence: 0.90, accepted: true },
    ],
  },
  {
    id: 'doc-m4', fileName: 'GenericDoc_Scan.pdf', fileType: 'pdf', fileSize: 780000,
    uploadedAt: '2026-04-05T11:00:00Z', uploadSource: 'manual',
    documentType: 'unknown', aiClassifiedType: 'unknown', aiClassificationConfidence: 0.42,
    processingStatus: 'error', pageCount: 6,
    errors: ['Unable to classify document type. Low confidence score (42%). Manual review required.', 'OCR quality below threshold on pages 3-5.'],
  },
  {
    id: 'doc-m5', fileName: 'HeartlandSD_Application_Renewal.pdf', fileType: 'pdf', fileSize: 520000,
    uploadedAt: '2026-04-02T16:30:00Z', uploadSource: 'manual', rfpId: 'rfp-006',
    documentType: 'application', aiClassifiedType: 'application', aiClassificationConfidence: 0.91,
    processingStatus: 'accepted', processingProgress: 100, pageCount: 6,
    extractedFields: [
      { fieldName: 'Group Name', value: 'Heartland School District #47', confidence: 0.97, accepted: true },
      { fieldName: 'Effective Date', value: '07/01/2026', confidence: 0.94, accepted: true },
      { fieldName: 'Contract Type', value: 'Specific + Aggregate', confidence: 0.89, accepted: true },
      { fieldName: 'Requested Deductible', value: '$75,000', confidence: 0.86, accepted: true },
    ],
  },
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
  {
    id: 's1', rfpId: 'rfp-001', name: 'Option A - $50K Specific', sequenceNumber: 1, isLocked: false,
    contractBasis: '12/12', specificDeductible: 50000,
    aggregateCorridorPercent: 125, expectedClaimsPEPM: 450, aggregateAttachmentPoint: 1248750, minimumAggregateDeductible: 1123875,
    specificManualRate: 142.50, specificFinalRate: 142.50, specificAnnualPremium: 487350,
    aggregateManualRate: 38.50, aggregateFinalRate: 38.50, aggregateAnnualPremium: 131670,
    compositeFinalRate: 181.00, totalAnnualPremium: 619020,
    manualRate: 142.50, finalRate: 181.00, uwAdjustmentFactor: 1.0,
    noNewLasers: false,
  },
  {
    id: 's2', rfpId: 'rfp-001', name: 'Option B - $75K Specific', sequenceNumber: 2, isLocked: false,
    contractBasis: '12/12', specificDeductible: 75000,
    aggregateCorridorPercent: 125, expectedClaimsPEPM: 450, aggregateAttachmentPoint: 1248750, minimumAggregateDeductible: 1123875,
    specificManualRate: 118.75, specificExperienceRate: 112.00, specificFinalRate: 112.81, specificAnnualPremium: 385811,
    aggregateManualRate: 34.20, aggregateFinalRate: 34.20, aggregateAnnualPremium: 116964,
    compositeFinalRate: 147.01, totalAnnualPremium: 502775,
    manualRate: 118.75, experienceRate: 112.00, finalRate: 147.01, uwAdjustmentFactor: 0.95,
    rateCapPercent: 15, rateCapPremiumAdder: 4.80,
    noNewLasers: true, noNewLaserPremiumAdder: 3.20,
  },
  {
    id: 's3', rfpId: 'rfp-001', name: 'Option C - $100K Specific', sequenceNumber: 3, isLocked: false,
    contractBasis: '12/15', specificDeductible: 100000,
    aggregateCorridorPercent: 125, expectedClaimsPEPM: 450, aggregateAttachmentPoint: 1248750, minimumAggregateDeductible: 1123875,
    specificManualRate: 96.20, specificExperienceRate: 88.40, specificFinalRate: 91.30, specificAnnualPremium: 312246,
    aggregateManualRate: 30.50, aggregateFinalRate: 30.50, aggregateAnnualPremium: 104310,
    compositeFinalRate: 121.80, totalAnnualPremium: 416556,
    manualRate: 96.20, experienceRate: 88.40, finalRate: 121.80, uwAdjustmentFactor: 0.95,
    aggregatingSpecificDeductible: 50000, asdPremiumReduction: 8.40,
    noNewLasers: false,
  },
];

// Gap 4: Claims Experience Mock Data
export const MOCK_CLAIMS_EXPERIENCE: ClaimsExperienceMonth[] = [
  { id: 'ce1', rfpId: 'rfp-002', periodStart: '2025-07-01', periodEnd: '2025-07-31', enrollmentCount: 182, memberCount: 305, medicalClaimsPaid: 52400, pharmacyClaimsPaid: 18200, totalClaimsPaid: 70600, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce2', rfpId: 'rfp-002', periodStart: '2025-08-01', periodEnd: '2025-08-31', enrollmentCount: 185, memberCount: 310, medicalClaimsPaid: 48100, pharmacyClaimsPaid: 16800, totalClaimsPaid: 64900, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce3', rfpId: 'rfp-002', periodStart: '2025-09-01', periodEnd: '2025-09-30', enrollmentCount: 185, memberCount: 312, medicalClaimsPaid: 95200, pharmacyClaimsPaid: 17500, totalClaimsPaid: 112700, largeClaimsCount: 1, largeClaimsTotal: 62400, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce4', rfpId: 'rfp-002', periodStart: '2025-10-01', periodEnd: '2025-10-31', enrollmentCount: 184, memberCount: 308, medicalClaimsPaid: 61500, pharmacyClaimsPaid: 19800, totalClaimsPaid: 81300, largeClaimsCount: 1, largeClaimsTotal: 28100, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce5', rfpId: 'rfp-002', periodStart: '2025-11-01', periodEnd: '2025-11-30', enrollmentCount: 186, memberCount: 315, medicalClaimsPaid: 58700, pharmacyClaimsPaid: 21200, totalClaimsPaid: 79900, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce6', rfpId: 'rfp-002', periodStart: '2025-12-01', periodEnd: '2025-12-31', enrollmentCount: 185, memberCount: 312, medicalClaimsPaid: 72400, pharmacyClaimsPaid: 18900, totalClaimsPaid: 91300, largeClaimsCount: 1, largeClaimsTotal: 35200, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce7', rfpId: 'rfp-002', periodStart: '2026-01-01', periodEnd: '2026-01-31', enrollmentCount: 188, memberCount: 318, medicalClaimsPaid: 55300, pharmacyClaimsPaid: 17600, totalClaimsPaid: 72900, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce8', rfpId: 'rfp-002', periodStart: '2026-02-01', periodEnd: '2026-02-28', enrollmentCount: 187, memberCount: 316, medicalClaimsPaid: 49800, pharmacyClaimsPaid: 16400, totalClaimsPaid: 66200, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce9', rfpId: 'rfp-002', periodStart: '2026-03-01', periodEnd: '2026-03-31', enrollmentCount: 185, memberCount: 312, medicalClaimsPaid: 63100, pharmacyClaimsPaid: 19400, totalClaimsPaid: 82500, largeClaimsCount: 1, largeClaimsTotal: 22800, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce10', rfpId: 'rfp-002', periodStart: '2026-04-01', periodEnd: '2026-04-30', enrollmentCount: 186, memberCount: 314, medicalClaimsPaid: 51200, pharmacyClaimsPaid: 18100, totalClaimsPaid: 69300, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce11', rfpId: 'rfp-002', periodStart: '2026-05-01', periodEnd: '2026-05-31', enrollmentCount: 187, memberCount: 316, medicalClaimsPaid: 57800, pharmacyClaimsPaid: 20100, totalClaimsPaid: 77900, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
  { id: 'ce12', rfpId: 'rfp-002', periodStart: '2026-06-01', periodEnd: '2026-06-30', enrollmentCount: 188, memberCount: 318, medicalClaimsPaid: 55300, pharmacyClaimsPaid: 19100, totalClaimsPaid: 74400, largeClaimsCount: 0, largeClaimsTotal: 0, isComplete: true, source: 'AI_EXTRACTED' },
];

export const MOCK_LARGE_CLAIMANTS: LargeClaimant[] = [
  { id: 'lc1', rfpId: 'rfp-002', claimantReference: 'Claimant A', age: 52, gender: 'F', relationship: 'EMPLOYEE', diagnosisCategory: 'Oncology', diagnosisDetail: 'Stage 3 breast cancer, active chemotherapy', totalPaidToDate: 180200, amountAboveSpecific: 105200, treatmentStatus: 'ACTIVE', trendDirection: 'INCREASING', expectedFutureCost: 220000, isLasered: false, source: 'AI_EXTRACTED' },
  { id: 'lc2', rfpId: 'rfp-002', claimantReference: 'Claimant B', age: 34, gender: 'M', relationship: 'SPOUSE', diagnosisCategory: 'Neonatal', diagnosisDetail: 'Premature birth NICU stay — 42 days', totalPaidToDate: 92400, amountAboveSpecific: 17400, treatmentStatus: 'COMPLETED', trendDirection: 'DECREASING', isLasered: false, source: 'AI_EXTRACTED' },
  { id: 'lc3', rfpId: 'rfp-002', claimantReference: 'Claimant C', age: 61, gender: 'F', relationship: 'EMPLOYEE', diagnosisCategory: 'Cardiac', diagnosisDetail: 'Triple bypass recovery, cardiac rehab', totalPaidToDate: 67800, amountAboveSpecific: 0, treatmentStatus: 'ONGOING_CHRONIC', trendDirection: 'STABLE', expectedFutureCost: 45000, isLasered: false, source: 'AI_EXTRACTED' },
];

export const MOCK_PRIOR_YEAR: PriorYearSummary = {
  id: 'py1', rfpId: 'rfp-002', policyYear: '2025-2026',
  specificDeductible: 75000, aggregateCorridorPercent: 125, contractBasis: '12/12',
  specificRatePMPM: 218.00, aggregateRatePMPM: 34.00, compositeRatePMPM: 252.00,
  totalAnnualPremium: 922320, totalClaimsPaid: 874200, lossRatio: 0.62,
  memberMonths: 3660, largeClaimantCount: 2, enrollmentAverage: 180,
  carrierName: 'Pan American', tpaName: 'Integrated Medical Solutions',
};

// Gap 9: Communications
export const MOCK_COMMUNICATIONS: CaseCommunication[] = [
  { id: 'comm1', rfpId: 'rfp-001', commType: 'AUTO', direction: 'INBOUND', contactName: 'Jane Smith', contactEmail: 'jsmith@asrhealthbenefits.com', subject: 'RFP received via email', body: 'RFP received via email to quotes@tpac.com with 3 attachments.', isAutoGenerated: true, createdAt: '2026-04-01T09:30:00Z' },
  { id: 'comm2', rfpId: 'rfp-001', commType: 'PHONE_CALL', direction: 'OUTBOUND', contactName: 'Jane Smith', subject: 'Census confirmation call', body: 'Called to confirm census is for correct group. Jane confirmed — correct file.', linkedStepId: 'STEP_07', isAutoGenerated: false, createdAt: '2026-04-03T14:00:00Z' },
  { id: 'comm3', rfpId: 'rfp-001', commType: 'EMAIL_SENT', direction: 'OUTBOUND', contactName: 'Jane Smith', contactEmail: 'jsmith@asrhealthbenefits.com', subject: 'Proposal: Midwest Mfg Stop-Loss Proposal', body: 'Please find attached the stop-loss proposal for Midwest Manufacturing Corp.', attachments: ['ACME_Proposal_2026.pdf'], linkedStepId: 'STEP_17', isAutoGenerated: false, createdAt: '2026-04-05T10:00:00Z' },
  { id: 'comm4', rfpId: 'rfp-001', commType: 'FOLLOW_UP', direction: 'OUTBOUND', contactName: 'Jane Smith', contactEmail: 'jsmith@asrhealthbenefits.com', subject: 'Follow-up: Proposal sent Apr 5', body: 'Following up on proposal sent April 5. Checking on decision timeline.', isAutoGenerated: false, createdAt: '2026-04-10T09:00:00Z' },
];

// Gap 10: Outcome
export const MOCK_OUTCOMES: QuoteOutcome[] = [
  { id: 'out1', rfpId: 'rfp-007', outcome: 'WON', outcomeDate: '2026-03-15', acceptedScenarioId: 's2', decisiveFactors: ['Price', 'Terms', 'Relationship'], competitorsQuoted: ['HM Insurance', 'Voya'], notes: 'Strong relationship with Lockton sealed the deal.' },
  { id: 'out2', rfpId: 'rfp-008', outcome: 'DECLINED', outcomeDate: '2026-04-01', lostReason: 'Coverage Scope', notes: 'Group too small and high-risk SIC code. Outside appetite.' },
];

// Gap 3: Binding
export const MOCK_BINDING: BindingRecord = {
  id: 'bind1', rfpId: 'rfp-007', acceptedScenarioId: 's2', acceptedScenarioName: 'Option B - $75K Specific',
  acceptedDate: '2026-03-15', acceptedByName: 'Tom Wilson (PHP Network Inc)', acceptedByEmail: 'tom@phpnetwork.com',
  acceptanceMethod: 'email', bindingStatus: 'policy_setup',
  steps: [
    { id: 'STEP_18A', name: 'Quote Acceptance Received', status: 'complete', ownerRole: 'UNDERWRITER', completedAt: '2026-03-15' },
    { id: 'STEP_18B', name: 'Terms Confirmation & Binder Letter', status: 'complete', ownerRole: 'UNDERWRITER', completedAt: '2026-03-18' },
    { id: 'STEP_18C', name: 'Policy Setup', status: 'in_progress', ownerRole: 'ASSOCIATE' },
    { id: 'STEP_18D', name: 'Implementation Handoff', status: 'pending', ownerRole: 'SYSTEM' },
    { id: 'STEP_18E', name: 'Policy Document Issuance', status: 'pending', ownerRole: 'ASSOCIATE' },
  ],
};
