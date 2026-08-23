export type ProductCategory = 
  | 'Motors & Drives'
  | 'Bearings & Bushings'
  | 'Pumps & Hydraulics'
  | 'Pneumatic Actuators'
  | 'Industrial Sensors'
  | 'Valves & Regulators'
  | 'Gears & Transmissions'
  | 'Electrical & Automation';

export interface ProductSpec {
  name: string;
  value: string;
  unit?: string;
  isAiInferred?: boolean;
  confidence?: number;
}

export interface ProductItem {
  id: string;
  sku: string;
  rawName: string;
  cleanName: string;
  category: ProductCategory;
  manufacturer: string;
  supplier: string;
  price: number;
  currency: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Made to Order' | 'Lead Time 2-3 Wks';
  rawDescription: string;
  aiDescription: string;
  specs: Record<string, string | number>;
  normalizedSpecs: ProductSpec[];
  applications: string[];
  certifications: string[];
  dataQualityScore: number; // 0 - 100
  completenessScore: number; // 0 - 100
  aiConfidence: number; // 0 - 100
  missingFields: string[];
  potentialDuplicates: string[]; // SKU IDs
  similarProducts: string[]; // SKU IDs
  imageUrl?: string;
  isVerified?: boolean;
  sourceDatasetId?: string;
}

export interface DuplicateGroup {
  id: string;
  masterProduct: ProductItem;
  duplicateItems: {
    product: ProductItem;
    similarityScore: number;
    matchedFields: string[];
    conflictFields: string[];
    reason: string;
  }[];
  resolutionStatus: 'unresolved' | 'merged' | 'ignored';
}

export interface DataQualityReport {
  overallScore: number;
  completeness: number;
  consistency: number;
  duplicateRisk: number;
  attributeCoverage: number;
  validity: number;
  totalRecords: number;
  cleanRecords: number;
  flaggedRecords: number;
  duplicateGroupsCount: number;
  categoryBreakdown: { category: ProductCategory; count: number; avgQuality: number }[];
  missingFieldStats: { field: string; count: number; percentage: number }[];
  manufacturerStats: { name: string; count: number; avgPrice: number }[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  filename: string;
  fileSize: string;
  uploadedAt: string;
  recordCount: number;
  qualityReport: DataQualityReport;
  products: ProductItem[];
  duplicateGroups: DuplicateGroup[];
  status: 'ready' | 'processing' | 'error';
}

export interface RecommendationResult {
  id: string;
  requirementQuery: string;
  bestMatch: ProductItem;
  matchScore: number;
  confidence: number;
  reason: string;
  tradeOffs: string[];
  recommendedOperatingEnvelope: string;
  directAlternatives: {
    product: ProductItem;
    whyConsider: string;
    tradeOff: string;
    priceDeltaPercentage: number;
  }[];
  lifecycleCostRating: 'Low' | 'Moderate' | 'High-Performance';
}

export interface ComparisonAnalysis {
  productIds: string[];
  products: ProductItem[];
  aiVerdict: string;
  bestOverall: ProductItem;
  bestForEfficiency: ProductItem;
  bestForExtremeEnvironments: ProductItem;
  bestValue: ProductItem;
  prosAndCons: Record<string, { pros: string[]; cons: string[]; suitability: string }>;
  specDifferences: {
    specKey: string;
    label: string;
    values: Record<string, string | number>;
    unit?: string;
    isKeyDifferentiator?: boolean;
  }[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  productCards?: ProductItem[];
  codeOrData?: string;
  audioGenerated?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role:
    | 'Lead Mechanical Engineer'
    | 'Chief Engineer'
    | 'Procurement & Sourcing Lead'
    | 'Procurement Specialist'
    | 'Reliability Engineer'
    | 'Master Data Architect'
    | 'Systems Integrator'
    | 'Catalog Operations Admin'
    | 'Plant Director';
  company: string;
  token?: string;
  isAuthenticated: boolean;
  savedProductIds: string[];
}
