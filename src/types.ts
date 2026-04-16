export type VisaType = 'LMIA' | 'TRV' | 'Work Permit' | 'SAWP';

export type WorkerStatus = 'Active' | 'Pending' | 'Expiring' | 'Unassigned';

export type DocumentStatus = 'Complete' | 'Pending' | 'Missing' | 'Expired';

export type CropType =
  | 'Tomatoes'
  | 'Peppers'
  | 'Cucumbers'
  | 'Grapes'
  | 'Tender Fruit'
  | 'Blueberries'
  | 'Raspberries'
  | 'Lettuce'
  | 'Root Vegetables'
  | 'Apples';

export interface WorkerDocument {
  name: string;
  status: DocumentStatus;
  expiryDate?: string;
  uploadedDate?: string;
}

export interface PastAssignment {
  farmId: string;
  farmName: string;
  year: number;
  role: string;
}

export interface ActivityEvent {
  date: string;
  label: string;
  type: 'document' | 'contract' | 'visa' | 'assignment' | 'compliance';
}

export interface Worker {
  id: string;
  name: string;
  countryOfOrigin: string;
  countryCode: string;
  farmId: string | null;
  visaType: VisaType;
  status: WorkerStatus;
  arrivalDate: string;
  documents: WorkerDocument[];
  phone?: string;
  email?: string;
  photoSeed: number;
  yearsInAgriculture: number;
  cropExperience: CropType[];
  homeRegion: string;
  availableFrom: string;
  pastAssignments: PastAssignment[];
  activityLog: ActivityEvent[];
  complianceHistory: number[];
  languages: string[];
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  province: string;
  workerCapacity: number;
  cropType: string;
  primaryCrops: CropType[];
  manager: string;
  coordinates: [number, number];
  supervisors: string[];
  plantingWindow: string;
}

export type FilterState = {
  farm: string;
  status: string;
  visaType: string;
  compliance: string;
  search: string;
};

export interface MatchScoreBreakdown {
  skills: number;
  location: number;
  visa: number;
  availability: number;
  experience: number;
}

export interface MatchRecommendation {
  farmId: string;
  farmName: string;
  score: number;
  breakdown: MatchScoreBreakdown;
  rationale: string[];
}
