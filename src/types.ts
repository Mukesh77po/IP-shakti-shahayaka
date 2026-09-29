export type ActiveTab = 'home' | 'assessment' | 'patents' | 'cost' | 'knowledge' | 'ask';

export type Jurisdiction = 'India' | 'International' | 'Both';
export type AppLanguage = 'en' | 'hi' | 'kn';

export interface IngredientItem {
  id: string;
  name: string;
  sourceLocation: 'India' | 'Outside India' | 'Unknown';
}

export interface AssessmentData {
  jurisdiction: Jurisdiction;
  language: AppLanguage;
  productName: string;
  productDescription: string;
  productType: string;
  ingredients: IngredientItem[];
  intendedUse: string;
  claims: string;
  isClassicalText: 'Yes' | 'No' | 'Unsure';
  isOrgDeveloped: 'Yes' | 'No' | 'Unsure';
  isTraditionallyKnown: 'Yes' | 'No' | 'Unsure';
  businessGoals: string[];
  usesBiologicalResources: 'Yes' | 'No' | 'Unknown';
  commercialUse: 'Yes' | 'No' | 'Unknown';
}

export interface PatentRecord {
  id: string;
  title: string;
  applicationNumber: string;
  applicant: string;
  similarity: number;
  note: string;
  ingredients: string;
  status: string;
  publicationDate: string;
  jurisdiction?: Jurisdiction;
  category?: string;
  citedStatute?: string;
  officialSource?: string;
}

export interface LegalStatute {
  id: string;
  title: string;
  sections: string;
  authority: string;
  lastVerified: string;
  badge: string;
  summary: string;
  link: string;
  gazetteReference?: string;
  keyProvisions?: string[];
  pdfSourceDoc?: string;
}

export interface TkdlCase {
  id: string;
  caseNumber: string;
  jurisdiction: string;
  ingredients: string;
  use: string;
  ruling: string;
  confidence: number;
  officialLink?: string;
}

export interface CodeFile {
  path: string;
  name: string;
  category: 'core' | 'rag' | 'api' | 'services' | 'config' | 'app';
  description: string;
  language: string;
  content: string;
}

export interface AskResponse {
  classification: {
    product_type: string;
    jurisdiction?: string;
    category?: string;
  };
  answer: string;
  reasoning?: string;
  next_steps: string[];
  confidence: string;
  sources: Array<{
    title: string;
    organization: string;
    page: string | number;
    url?: string;
  }>;
  disclaimer?: string;
}

export interface HealthResponse {
  status: string;
  service?: string;
  rag_index_ready?: boolean;
  indexed_documents_count?: number;
  total_chunks_indexed?: number;
  chroma_collection?: string;
  gemini_api_configured?: boolean;
  version?: string;
  [key: string]: any;
}
