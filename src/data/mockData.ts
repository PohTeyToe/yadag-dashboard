import type { Worker, Farm, WorkerDocument } from '../types';

export const farms: Farm[] = [
  {
    id: 'farm-1',
    name: 'Westcan Greenhouses',
    location: 'Leamington, ON',
    province: 'Ontario',
    workerCapacity: 45,
    cropType: 'Tomatoes & Peppers',
    manager: 'David Chen',
  },
  {
    id: 'farm-2',
    name: 'Ontario Harvest Farms',
    location: 'Niagara-on-the-Lake, ON',
    province: 'Ontario',
    workerCapacity: 60,
    cropType: 'Tender Fruit & Grapes',
    manager: 'Sarah Mitchell',
  },
  {
    id: 'farm-3',
    name: 'Fraser Valley Berries',
    location: 'Abbotsford, BC',
    province: 'British Columbia',
    workerCapacity: 35,
    cropType: 'Blueberries & Raspberries',
    manager: 'James Park',
  },
  {
    id: 'farm-4',
    name: 'Prairie Sun Agriculture',
    location: 'Bradford, ON',
    province: 'Ontario',
    workerCapacity: 50,
    cropType: 'Root Vegetables & Lettuce',
    manager: 'Maria Santos',
  },
];

function createDocuments(overrides: Partial<Record<string, { status: WorkerDocument['status']; expiryDate?: string; uploadedDate?: string }>>): WorkerDocument[] {
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
    documents: createDocuments({
      passport: { status: 'Complete', uploadedDate: '2026-03-10' },
      work_permit: { status: 'Pending' },
      lmia_approval: { status: 'Complete', uploadedDate: '2026-03-05' },
      employment_contract: { status: 'Pending' },
      medical_exam: { status: 'Complete', uploadedDate: '2026-03-12' },
    }),
  },
];

// Helper functions
export function getWorkersForFarm(farmId: string): Worker[] {
  return workers.filter((w) => w.farmId === farmId);
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
  };
  return flags[code] || '';
}
