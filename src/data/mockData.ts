import type {
  Worker,
  Farm,
  WorkerDocument,
  MatchRecommendation,
  ActivityEvent,
} from '../types';

export const farms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Westcan Greenhouses',
    location: 'Leamington, ON',
    province: 'Ontario',
    workerCapacity: 45,
    cropType: 'Tomatoes & Peppers',
    primaryCrops: ['Tomatoes', 'Peppers'],
    manager: 'David Chen',
    coordinates: [42.0537, -82.5988],
    supervisors: ['David Chen', 'Anita Gill', 'Marco Riviera'],
    plantingWindow: 'May - October',
  },
  {
    id: 'farm-2',
    name: 'Ontario Harvest Farms',
    location: 'Niagara-on-the-Lake, ON',
    province: 'Ontario',
    workerCapacity: 60,
    cropType: 'Tender Fruit & Grapes',
    primaryCrops: ['Tender Fruit', 'Grapes'],
    manager: 'Sarah Mitchell',
    coordinates: [43.2557, -79.0715],
    supervisors: ['Sarah Mitchell', 'Tom Van Dyke'],
    plantingWindow: 'April - September',
  },
  {
    id: 'farm-3',
    name: 'Fraser Valley Berries',
    location: 'Abbotsford, BC',
    province: 'British Columbia',
    workerCapacity: 35,
    cropType: 'Blueberries & Raspberries',
    primaryCrops: ['Blueberries', 'Raspberries'],
    manager: 'James Park',
    coordinates: [49.0504, -122.3045],
    supervisors: ['James Park', 'Priya Singh'],
    plantingWindow: 'June - August',
  },
  {
    id: 'farm-4',
    name: 'Prairie Sun Agriculture',
    location: 'Bradford, ON',
    province: 'Ontario',
    workerCapacity: 50,
    cropType: 'Root Vegetables & Lettuce',
    primaryCrops: ['Root Vegetables', 'Lettuce'],
    manager: 'Maria Santos',
    coordinates: [44.1142, -79.5663],
    supervisors: ['Maria Santos', 'Jeff McKinnon'],
    plantingWindow: 'May - October',
  },
];

function createDocuments(
  overrides: Partial<Record<string, { status: WorkerDocument['status']; expiryDate?: string; uploadedDate?: string }>>
): WorkerDocument[] {
  const docNames = ['Passport', 'Work Permit', 'LMIA Approval', 'Employment Contract', 'Medical Exam'];
  return docNames.map((name) => {
    const key = name.toLowerCase().replace(/\s+/g, '_');
    const override = overrides[key];
    if (override) {
      return { name, ...override };
    }
    return {
      name,
      status: 'Complete' as const,
      uploadedDate: '2026-01-15',
    };
  });
}

function baseHistory(avg: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 6; i++) {
    const jitter = (Math.sin(i * 1.3 + avg) + 1) * 5;
    out.push(Math.max(30, Math.min(100, Math.round(avg - 8 + jitter + i * 1.5))));
  }
  return out;
}

function baseActivity(name: string): ActivityEvent[] {
  return [
    { date: '2026-04-02', label: 'Passport photo page uploaded', type: 'document' },
    { date: '2026-03-28', label: `Employment contract signed by ${name.split(' ')[0]}`, type: 'contract' },
    { date: '2026-02-15', label: 'TRV approved by IRCC', type: 'visa' },
    { date: '2026-01-20', label: 'LMIA confirmation received', type: 'visa' },
    { date: '2025-12-10', label: 'Onboarding packet mailed to consulate', type: 'document' },
  ];
}

export const workers: Worker[] = [
  {
    id: 'w-001',
    name: 'Carlos Hernandez',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-1',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-02-15',
    photoSeed: 1,
    yearsInAgriculture: 7,
    cropExperience: ['Tomatoes', 'Peppers'],
    homeRegion: 'Jalisco, Mexico',
    availableFrom: '2026-02-01',
    pastAssignments: [
      { farmId: 'farm-1', farmName: 'Westcan Greenhouses', year: 2024, role: 'Greenhouse technician' },
      { farmId: 'farm-1', farmName: 'Westcan Greenhouses', year: 2023, role: 'Greenhouse technician' },
    ],
    activityLog: baseActivity('Carlos Hernandez'),
    complianceHistory: baseHistory(94),
    languages: ['Spanish', 'English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-002',
    name: 'Miguel Angel Torres',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-1',
    visaType: 'SAWP',
    status: 'Expiring',
    arrivalDate: '2026-01-20',
    photoSeed: 2,
    yearsInAgriculture: 9,
    cropExperience: ['Tomatoes', 'Cucumbers'],
    homeRegion: 'Michoacán, Mexico',
    availableFrom: '2026-01-01',
    pastAssignments: [
      { farmId: 'farm-1', farmName: 'Westcan Greenhouses', year: 2024, role: 'Crew lead' },
    ],
    activityLog: baseActivity('Miguel Angel Torres'),
    complianceHistory: baseHistory(72),
    languages: ['Spanish'],
    documents: createDocuments({
      work_permit: { status: 'Pending', expiryDate: '2026-04-28' },
      medical_exam: { status: 'Complete', expiryDate: '2026-05-01', uploadedDate: '2025-05-01' },
    }),
  },
  {
    id: 'w-003',
    name: 'Dwight Campbell',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-1',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-01',
    photoSeed: 3,
    yearsInAgriculture: 5,
    cropExperience: ['Tomatoes', 'Peppers'],
    homeRegion: 'St. Elizabeth, Jamaica',
    availableFrom: '2026-02-20',
    pastAssignments: [{ farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2024, role: 'Field hand' }],
    activityLog: baseActivity('Dwight Campbell'),
    complianceHistory: baseHistory(88),
    languages: ['English'],
    documents: createDocuments({
      lmia_approval: { status: 'Complete', expiryDate: '2026-12-31', uploadedDate: '2026-01-10' },
    }),
  },
  {
    id: 'w-004',
    name: 'Jose Luis Ramirez',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-1',
    visaType: 'LMIA',
    status: 'Active',
    arrivalDate: '2026-02-28',
    photoSeed: 4,
    yearsInAgriculture: 4,
    cropExperience: ['Peppers', 'Tomatoes'],
    homeRegion: 'Guanajuato, Mexico',
    availableFrom: '2026-02-15',
    pastAssignments: [],
    activityLog: baseActivity('Jose Luis Ramirez'),
    complianceHistory: baseHistory(90),
    languages: ['Spanish', 'English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-005',
    name: 'Winston Brown',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-2',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-05',
    photoSeed: 5,
    yearsInAgriculture: 11,
    cropExperience: ['Tender Fruit', 'Grapes', 'Apples'],
    homeRegion: 'Clarendon, Jamaica',
    availableFrom: '2026-02-25',
    pastAssignments: [
      { farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2024, role: 'Orchard lead' },
      { farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2023, role: 'Pruner' },
    ],
    activityLog: baseActivity('Winston Brown'),
    complianceHistory: baseHistory(96),
    languages: ['English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-006',
    name: 'Roberto Garcia Mendez',
    countryOfOrigin: 'Guatemala',
    countryCode: 'GT',
    farmId: 'farm-2',
    visaType: 'Work Permit',
    status: 'Pending',
    arrivalDate: '2026-04-20',
    photoSeed: 6,
    yearsInAgriculture: 3,
    cropExperience: ['Grapes'],
    homeRegion: 'Quetzaltenango, Guatemala',
    availableFrom: '2026-04-15',
    pastAssignments: [],
    activityLog: baseActivity('Roberto Garcia Mendez'),
    complianceHistory: baseHistory(55),
    languages: ['Spanish'],
    documents: createDocuments({
      passport: { status: 'Complete', uploadedDate: '2026-03-01' },
      work_permit: { status: 'Pending' },
      lmia_approval: { status: 'Pending' },
      employment_contract: { status: 'Complete', uploadedDate: '2026-03-15' },
      medical_exam: { status: 'Missing' },
    }),
  },
  {
    id: 'w-007',
    name: 'Alejandro Vasquez',
    countryOfOrigin: 'Guatemala',
    countryCode: 'GT',
    farmId: 'farm-2',
    visaType: 'Work Permit',
    status: 'Active',
    arrivalDate: '2026-02-10',
    photoSeed: 7,
    yearsInAgriculture: 6,
    cropExperience: ['Tender Fruit', 'Grapes'],
    homeRegion: 'Huehuetenango, Guatemala',
    availableFrom: '2026-01-30',
    pastAssignments: [{ farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2024, role: 'Field hand' }],
    activityLog: baseActivity('Alejandro Vasquez'),
    complianceHistory: baseHistory(85),
    languages: ['Spanish'],
    documents: createDocuments({
      medical_exam: { status: 'Complete', expiryDate: '2026-05-15', uploadedDate: '2025-05-15' },
    }),
  },
  {
    id: 'w-008',
    name: 'Omar Reyes Pineda',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-2',
    visaType: 'SAWP',
    status: 'Expiring',
    arrivalDate: '2026-01-10',
    photoSeed: 8,
    yearsInAgriculture: 8,
    cropExperience: ['Grapes', 'Tender Fruit'],
    homeRegion: 'Oaxaca, Mexico',
    availableFrom: '2026-01-01',
    pastAssignments: [{ farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2024, role: 'Vineyard worker' }],
    activityLog: baseActivity('Omar Reyes Pineda'),
    complianceHistory: baseHistory(68),
    languages: ['Spanish'],
    documents: createDocuments({
      work_permit: { status: 'Pending', expiryDate: '2026-04-22' },
      passport: { status: 'Complete', expiryDate: '2026-06-15', uploadedDate: '2024-06-15' },
    }),
  },
  {
    id: 'w-009',
    name: 'Devon Williams',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-2',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-12',
    photoSeed: 9,
    yearsInAgriculture: 4,
    cropExperience: ['Tender Fruit', 'Apples'],
    homeRegion: 'Manchester, Jamaica',
    availableFrom: '2026-03-01',
    pastAssignments: [],
    activityLog: baseActivity('Devon Williams'),
    complianceHistory: baseHistory(92),
    languages: ['English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-010',
    name: 'Fernando Lopez Cruz',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-3',
    visaType: 'LMIA',
    status: 'Active',
    arrivalDate: '2026-02-20',
    photoSeed: 10,
    yearsInAgriculture: 6,
    cropExperience: ['Blueberries', 'Raspberries'],
    homeRegion: 'Puebla, Mexico',
    availableFrom: '2026-02-10',
    pastAssignments: [{ farmId: 'farm-3', farmName: 'Fraser Valley Berries', year: 2024, role: 'Picker' }],
    activityLog: baseActivity('Fernando Lopez Cruz'),
    complianceHistory: baseHistory(91),
    languages: ['Spanish'],
    documents: createDocuments({}),
  },
  {
    id: 'w-011',
    name: 'Marvin Grant',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-3',
    visaType: 'SAWP',
    status: 'Expiring',
    arrivalDate: '2026-01-05',
    photoSeed: 11,
    yearsInAgriculture: 10,
    cropExperience: ['Blueberries', 'Raspberries', 'Apples'],
    homeRegion: 'St. Ann, Jamaica',
    availableFrom: '2026-01-01',
    pastAssignments: [
      { farmId: 'farm-3', farmName: 'Fraser Valley Berries', year: 2024, role: 'Crew lead' },
      { farmId: 'farm-3', farmName: 'Fraser Valley Berries', year: 2023, role: 'Picker' },
    ],
    activityLog: baseActivity('Marvin Grant'),
    complianceHistory: baseHistory(65),
    languages: ['English'],
    documents: createDocuments({
      work_permit: { status: 'Pending', expiryDate: '2026-04-18' },
      lmia_approval: { status: 'Complete', expiryDate: '2026-05-10', uploadedDate: '2025-11-10' },
      medical_exam: { status: 'Expired', expiryDate: '2026-04-01', uploadedDate: '2025-04-01' },
    }),
  },
  {
    id: 'w-012',
    name: 'Pedro Jimenez Soto',
    countryOfOrigin: 'Guatemala',
    countryCode: 'GT',
    farmId: 'farm-3',
    visaType: 'TRV',
    status: 'Pending',
    arrivalDate: '2026-05-01',
    photoSeed: 12,
    yearsInAgriculture: 2,
    cropExperience: ['Blueberries'],
    homeRegion: 'San Marcos, Guatemala',
    availableFrom: '2026-04-25',
    pastAssignments: [],
    activityLog: baseActivity('Pedro Jimenez Soto'),
    complianceHistory: baseHistory(45),
    languages: ['Spanish'],
    documents: createDocuments({
      passport: { status: 'Complete', uploadedDate: '2026-03-20' },
      work_permit: { status: 'Missing' },
      lmia_approval: { status: 'Missing' },
      employment_contract: { status: 'Pending' },
      medical_exam: { status: 'Missing' },
    }),
  },
  {
    id: 'w-013',
    name: 'Ricardo Morales',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-3',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-08',
    photoSeed: 13,
    yearsInAgriculture: 5,
    cropExperience: ['Blueberries', 'Raspberries'],
    homeRegion: 'Veracruz, Mexico',
    availableFrom: '2026-03-01',
    pastAssignments: [],
    activityLog: baseActivity('Ricardo Morales'),
    complianceHistory: baseHistory(87),
    languages: ['Spanish'],
    documents: createDocuments({
      passport: { status: 'Complete', expiryDate: '2028-09-15', uploadedDate: '2023-09-15' },
    }),
  },
  {
    id: 'w-014',
    name: 'Juan Carlos Perez',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-4',
    visaType: 'LMIA',
    status: 'Active',
    arrivalDate: '2026-02-25',
    photoSeed: 14,
    yearsInAgriculture: 6,
    cropExperience: ['Lettuce', 'Root Vegetables'],
    homeRegion: 'Sinaloa, Mexico',
    availableFrom: '2026-02-15',
    pastAssignments: [{ farmId: 'farm-4', farmName: 'Prairie Sun Agriculture', year: 2024, role: 'Field hand' }],
    activityLog: baseActivity('Juan Carlos Perez'),
    complianceHistory: baseHistory(89),
    languages: ['Spanish'],
    documents: createDocuments({}),
  },
  {
    id: 'w-015',
    name: 'Andre Thompson',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-4',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-15',
    photoSeed: 15,
    yearsInAgriculture: 3,
    cropExperience: ['Lettuce'],
    homeRegion: 'Trelawny, Jamaica',
    availableFrom: '2026-03-05',
    pastAssignments: [],
    activityLog: baseActivity('Andre Thompson'),
    complianceHistory: baseHistory(90),
    languages: ['English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-016',
    name: 'Luis Eduardo Castillo',
    countryOfOrigin: 'Guatemala',
    countryCode: 'GT',
    farmId: 'farm-4',
    visaType: 'Work Permit',
    status: 'Expiring',
    arrivalDate: '2026-01-25',
    photoSeed: 16,
    yearsInAgriculture: 7,
    cropExperience: ['Root Vegetables', 'Lettuce'],
    homeRegion: 'Alta Verapaz, Guatemala',
    availableFrom: '2026-01-15',
    pastAssignments: [{ farmId: 'farm-4', farmName: 'Prairie Sun Agriculture', year: 2024, role: 'Field hand' }],
    activityLog: baseActivity('Luis Eduardo Castillo'),
    complianceHistory: baseHistory(70),
    languages: ['Spanish'],
    documents: createDocuments({
      work_permit: { status: 'Pending', expiryDate: '2026-04-25' },
      employment_contract: { status: 'Complete', expiryDate: '2026-05-20', uploadedDate: '2025-11-20' },
    }),
  },
  {
    id: 'w-017',
    name: 'Enrique Dominguez',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: 'farm-4',
    visaType: 'SAWP',
    status: 'Active',
    arrivalDate: '2026-03-01',
    photoSeed: 17,
    yearsInAgriculture: 5,
    cropExperience: ['Lettuce', 'Root Vegetables'],
    homeRegion: 'Chiapas, Mexico',
    availableFrom: '2026-02-20',
    pastAssignments: [],
    activityLog: baseActivity('Enrique Dominguez'),
    complianceHistory: baseHistory(86),
    languages: ['Spanish'],
    documents: createDocuments({
      medical_exam: { status: 'Complete', expiryDate: '2026-06-01', uploadedDate: '2025-06-01' },
    }),
  },
  {
    id: 'w-018',
    name: 'Rohan Stewart',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: 'farm-4',
    visaType: 'SAWP',
    status: 'Pending',
    arrivalDate: '2026-04-25',
    photoSeed: 18,
    yearsInAgriculture: 4,
    cropExperience: ['Lettuce', 'Root Vegetables'],
    homeRegion: 'Kingston, Jamaica',
    availableFrom: '2026-04-20',
    pastAssignments: [],
    activityLog: baseActivity('Rohan Stewart'),
    complianceHistory: baseHistory(80),
    languages: ['English'],
    documents: createDocuments({
      passport: { status: 'Complete', uploadedDate: '2026-03-10' },
      work_permit: { status: 'Pending' },
      lmia_approval: { status: 'Complete', uploadedDate: '2026-03-05' },
      employment_contract: { status: 'Pending' },
      medical_exam: { status: 'Complete', uploadedDate: '2026-03-12' },
    }),
  },
  // Unassigned workers for AI match panel
  {
    id: 'w-101',
    name: 'Santiago Delgado',
    countryOfOrigin: 'Mexico',
    countryCode: 'MX',
    farmId: null,
    visaType: 'SAWP',
    status: 'Unassigned',
    arrivalDate: '2026-05-02',
    photoSeed: 101,
    yearsInAgriculture: 8,
    cropExperience: ['Tomatoes', 'Peppers', 'Cucumbers'],
    homeRegion: 'Jalisco, Mexico',
    availableFrom: '2026-04-25',
    pastAssignments: [
      { farmId: 'farm-1', farmName: 'Westcan Greenhouses', year: 2024, role: 'Greenhouse technician' },
      { farmId: 'farm-1', farmName: 'Westcan Greenhouses', year: 2023, role: 'Greenhouse technician' },
    ],
    activityLog: baseActivity('Santiago Delgado'),
    complianceHistory: baseHistory(93),
    languages: ['Spanish', 'English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-102',
    name: 'Kemar Bailey',
    countryOfOrigin: 'Jamaica',
    countryCode: 'JM',
    farmId: null,
    visaType: 'SAWP',
    status: 'Unassigned',
    arrivalDate: '2026-05-05',
    photoSeed: 102,
    yearsInAgriculture: 9,
    cropExperience: ['Blueberries', 'Raspberries', 'Apples'],
    homeRegion: 'St. Mary, Jamaica',
    availableFrom: '2026-04-28',
    pastAssignments: [
      { farmId: 'farm-3', farmName: 'Fraser Valley Berries', year: 2024, role: 'Crew lead' },
    ],
    activityLog: baseActivity('Kemar Bailey'),
    complianceHistory: baseHistory(95),
    languages: ['English'],
    documents: createDocuments({}),
  },
  {
    id: 'w-103',
    name: 'Rodrigo Mejia',
    countryOfOrigin: 'Guatemala',
    countryCode: 'GT',
    farmId: null,
    visaType: 'Work Permit',
    status: 'Unassigned',
    arrivalDate: '2026-05-10',
    photoSeed: 103,
    yearsInAgriculture: 5,
    cropExperience: ['Tender Fruit', 'Grapes'],
    homeRegion: 'Quiché, Guatemala',
    availableFrom: '2026-05-01',
    pastAssignments: [
      { farmId: 'farm-2', farmName: 'Ontario Harvest Farms', year: 2024, role: 'Field hand' },
    ],
    activityLog: baseActivity('Rodrigo Mejia'),
    complianceHistory: baseHistory(82),
    languages: ['Spanish'],
    documents: createDocuments({
      work_permit: { status: 'Pending' },
      lmia_approval: { status: 'Complete', uploadedDate: '2026-03-20' },
    }),
  },
  {
    id: 'w-104',
    name: 'Ashon Reid',
    countryOfOrigin: 'Trinidad and Tobago',
    countryCode: 'TT',
    farmId: null,
    visaType: 'SAWP',
    status: 'Unassigned',
    arrivalDate: '2026-05-12',
    photoSeed: 104,
    yearsInAgriculture: 6,
    cropExperience: ['Root Vegetables', 'Lettuce'],
    homeRegion: 'Princes Town, Trinidad',
    availableFrom: '2026-05-01',
    pastAssignments: [
      { farmId: 'farm-4', farmName: 'Prairie Sun Agriculture', year: 2024, role: 'Field hand' },
    ],
    activityLog: baseActivity('Ashon Reid'),
    complianceHistory: baseHistory(88),
    languages: ['English'],
    documents: createDocuments({}),
  },
];

export function getWorkersForFarm(farmId: string): Worker[] {
  return workers.filter((w) => w.farmId === farmId);
}

export function getAssignedWorkers(): Worker[] {
  return workers.filter((w) => w.farmId !== null);
}

export function getUnassignedWorkers(): Worker[] {
  return workers.filter((w) => w.farmId === null);
}

export function getComplianceScore(worker: Worker): number {
  const total = worker.documents.length;
  const complete = worker.documents.filter((d) => d.status === 'Complete').length;
  return Math.round((complete / total) * 100);
}

export function getFarmComplianceScore(farmId: string): number {
  const farmWorkers = getWorkersForFarm(farmId);
  if (farmWorkers.length === 0) return 100;
  const totalScore = farmWorkers.reduce((sum, w) => sum + getComplianceScore(w), 0);
  return Math.round(totalScore / farmWorkers.length);
}

export function getExpiringDocuments(): Array<{
  worker: Worker;
  document: WorkerDocument;
  daysUntilExpiry: number;
}> {
  const today = new Date('2026-04-15');
  const results: Array<{
    worker: Worker;
    document: WorkerDocument;
    daysUntilExpiry: number;
  }> = [];

  workers.forEach((worker) => {
    worker.documents.forEach((doc) => {
      if (doc.expiryDate) {
        const expiry = new Date(doc.expiryDate);
        const diffMs = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 90) {
          results.push({
            worker,
            document: doc,
            daysUntilExpiry: diffDays,
          });
        }
      }
    });
  });

  return results.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
}

export function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    MX: '\u{1F1F2}\u{1F1FD}',
    JM: '\u{1F1EF}\u{1F1F2}',
    GT: '\u{1F1EC}\u{1F1F9}',
    TT: '\u{1F1F9}\u{1F1F9}',
  };
  return flags[code] || '';
}

// AI match scoring. Deterministic, rule-based for demo realism.
export function calculateMatch(worker: Worker, farm: Farm): MatchRecommendation {
  // Skills: percentage of farm's primary crops worker has experience in.
  const matchedCrops = farm.primaryCrops.filter((c) => worker.cropExperience.includes(c));
  const skills = Math.round(
    (matchedCrops.length / farm.primaryCrops.length) * 80 +
      Math.min(worker.cropExperience.length, 4) * 5
  );

  // Location: closer provinces score higher. Simple heuristic based on farm province.
  const farmInOntario = farm.province === 'Ontario';
  const workerFromAmericas = ['MX', 'GT', 'JM', 'TT'].includes(worker.countryCode);
  const location = workerFromAmericas ? (farmInOntario ? 85 : 78) : 70;

  // Visa compatibility: SAWP best for seasonal, LMIA year-round, Work Permit flexible.
  const visa =
    worker.visaType === 'SAWP' ? 96 : worker.visaType === 'LMIA' ? 92 : worker.visaType === 'Work Permit' ? 88 : 75;

  // Availability: does worker's availableFrom date align with farm's planting window?
  const availDate = new Date(worker.availableFrom);
  const month = availDate.getMonth();
  const farmStartMonth = farm.plantingWindow.toLowerCase().startsWith('april')
    ? 3
    : farm.plantingWindow.toLowerCase().startsWith('may')
    ? 4
    : farm.plantingWindow.toLowerCase().startsWith('june')
    ? 5
    : 4;
  const monthDiff = Math.abs(month - farmStartMonth);
  const availability = Math.max(60, 100 - monthDiff * 12);

  // Experience: years weighted
  const experience = Math.min(100, 60 + worker.yearsInAgriculture * 4);

  // Weighted composite score
  const score = Math.round(
    skills * 0.35 + location * 0.15 + visa * 0.15 + availability * 0.15 + experience * 0.2
  );

  // Rationale generation
  const rationale: string[] = [];
  if (matchedCrops.length > 0) {
    rationale.push(
      `${worker.yearsInAgriculture} years ${matchedCrops.join(' and ').toLowerCase()} experience matches ${farm.name.replace(/s$/, '')}'s primary crop.`
    );
  } else {
    rationale.push(
      `${worker.yearsInAgriculture} years agriculture experience, transferable to ${farm.primaryCrops[0].toLowerCase()}.`
    );
  }
  if (worker.visaType === 'SAWP') {
    rationale.push(`SAWP-ready. Arrival ${new Date(worker.availableFrom).toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })} aligns with ${farm.plantingWindow.split(' - ')[0].toLowerCase()} planting window.`);
  } else {
    rationale.push(`${worker.visaType} valid through season. Documents tracked in Yadag compliance queue.`);
  }
  const priorAssignmentsAtFarm = worker.pastAssignments.filter((a) => a.farmId === farm.id);
  if (priorAssignmentsAtFarm.length > 0) {
    rationale.push(
      `Returned ${priorAssignmentsAtFarm.length} prior season${priorAssignmentsAtFarm.length > 1 ? 's' : ''}. Familiar with ${farm.supervisors.slice(0, 2).join(' and ')}.`
    );
  } else {
    const supervisorsShared = farm.supervisors.slice(0, 1);
    rationale.push(`Fresh placement. Onboarding buddy suggested: ${supervisorsShared[0]}.`);
  }

  return {
    farmId: farm.id,
    farmName: farm.name,
    score: Math.max(40, Math.min(99, score)),
    breakdown: {
      skills: Math.max(40, Math.min(99, skills)),
      location,
      visa,
      availability,
      experience,
    },
    rationale,
  };
}

export function getMatchRecommendations(worker: Worker, topN = 3): MatchRecommendation[] {
  return farms
    .map((f) => calculateMatch(worker, f))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

export function getFarmById(id: string | null): Farm | undefined {
  if (!id) return undefined;
  return farms.find((f) => f.id === id);
}
