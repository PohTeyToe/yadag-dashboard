export type VisaType = 'LMIA' | 'TRV' | 'Work Permit' | 'SAWP';

export type WorkerStatus = 'Active' | 'Pending' | 'Expiring';

export type DocumentStatus = 'Complete' | 'Pending' | 'Missing' | 'Expired';

export interface WorkerDocument {
  name: string;
  status: DocumentStatus;
  expiryDate?: string; // ISO date string
  uploadedDate?: string;
}

export interface Worker {
  id: string;
  name: string;
  countryOfOrigin: string;
  countryCode: string;
  farmId: string;
  visaType: VisaType;
  status: WorkerStatus;
  arrivalDate: string;
  documents: WorkerDocument[];
  phone?: string;
  email?: string;
  photoSeed: number; // For generating avatar placeholder
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  province: string;
  workerCapacity: number;
  cropType: string;
  manager: string;
}

export type FilterState = {
  farm: string;
  status: string;
  visaType: string;
  compliance: string;
  search: string;
};
