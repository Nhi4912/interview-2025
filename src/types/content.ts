export type Locale = "en" | "vi";

export type ContentCategory =
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "css"
  | "html"
  | "web-apis"
  | "computer-science"
  | "algorithms"
  | "system-design"
  | "security"
  | "performance"
  | "testing"
  | "tools";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type InterviewCompany =
  | "google"
  | "meta"
  | "amazon"
  | "microsoft"
  | "grab";

export interface ContentMetadata {
  id: string;
  slug: string;
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  category: ContentCategory;
  difficulty: Difficulty;
  estimatedTime: number; // minutes
  prerequisites: string[]; // Array of content IDs
  relatedTopics: string[];
  tags: string[];
  interviewCompanies: InterviewCompany[];
  lastUpdated: string;
  version: string;
  hasQuiz: boolean;
  hasCodeExamples: boolean;
  hasDiagrams: boolean;
  translationStatus?: "complete" | "fallback";
}

export interface TOCItem {
  id: string;
  title: string;
  level: number;
  children?: TOCItem[];
}

export interface GlossaryTerm {
  term: string;
  definition: {
    en: string;
    vi: string;
  };
}

export interface Content {
  metadata: ContentMetadata;
  content: string; // MDX content
  tableOfContents: TOCItem[];
  glossary: GlossaryTerm[];
}

export interface ContentIndex {
  version: string;
  locale: Locale;
  lastBuilt: Date;
  contents: {
    [contentId: string]: {
      metadata: ContentMetadata;
      path: string;
      searchTokens: string[];
      relationships: {
        prerequisites: string[];
        dependents: string[];
        related: string[];
      };
    };
  };
  categories: {
    [category: string]: string[]; // Array of content IDs
  };
  tags: {
    [tag: string]: string[]; // Array of content IDs
  };
}
