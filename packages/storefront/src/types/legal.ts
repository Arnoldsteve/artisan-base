// REFACTOR: Comprehensive legal content types for type safety and maintainability

export interface LegalSection {
  id: string;
  title: string;
  content: string;
  subsections?: LegalSubsection[];
}

export interface LegalSubsection {
  id: string;
  title: string;
  content: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  sections: LegalSection[];
  summary?: string;
  contactInfo: LegalContactInfo;
}

export interface LegalContactInfo {
  email: string;
  phone?: string;
  address?: string;
  website: string;
}

export interface LegalSearchResult {
  documentId: string;
  documentTitle: string;
  sectionId: string;
  sectionTitle: string;
  matchedText: string;
  relevance: number;
}

export interface LegalNavigation {
  currentPage: string;
  pages: {
    id: string;
    title: string;
    path: string;
    description: string;
  }[];
}

export type LegalDocumentType = "privacy" | "terms" | "cookies";

export interface LegalContentCache {
  documents: Map<LegalDocumentType, LegalDocument>;
  lastUpdated: Map<LegalDocumentType, number>;
  searchIndex: Map<string, LegalSearchResult[]>;
}
