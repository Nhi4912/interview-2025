import { GlossaryTerm, Locale } from "@/types/content";

export interface GlossaryEntry extends GlossaryTerm {
  id: string;
  category?: string;
  relatedTerms?: string[];
  examples?: {
    en: string;
    vi: string;
  }[];
}

export interface GlossaryDatabase {
  version: string;
  lastUpdated: string;
  terms: {
    [termId: string]: GlossaryEntry;
  };
  index: {
    byCategory: {
      [category: string]: string[]; // term IDs
    };
    byInitial: {
      [letter: string]: string[]; // term IDs
    };
  };
}

export class GlossaryService {
  private static glossaryData: GlossaryDatabase | null = null;

  /**
   * Initialize glossary database
   */
  static async initialize(data: GlossaryDatabase): Promise<void> {
    this.glossaryData = data;
  }

  /**
   * Get a glossary term by ID
   */
  static getTerm(termId: string): GlossaryEntry | null {
    if (!this.glossaryData) {
      return null;
    }
    return this.glossaryData.terms[termId] || null;
  }

  /**
   * Search for a term by its English or Vietnamese name
   */
  static findTerm(
    searchTerm: string,
    locale: Locale = "en"
  ): GlossaryEntry | null {
    if (!this.glossaryData) {
      return null;
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();

    for (const entry of Object.values(this.glossaryData.terms)) {
      const termToMatch = locale === "en" ? entry.term : entry.term;
      if (termToMatch.toLowerCase() === normalizedSearch) {
        return entry;
      }
    }

    return null;
  }

  /**
   * Get all terms in a category
   */
  static getTermsByCategory(category: string): GlossaryEntry[] {
    if (!this.glossaryData || !this.glossaryData.index.byCategory[category]) {
      return [];
    }

    const termIds = this.glossaryData.index.byCategory[category];
    return termIds
      .map((id) => this.glossaryData!.terms[id])
      .filter((term): term is GlossaryEntry => term !== undefined);
  }

  /**
   * Get all terms starting with a letter
   */
  static getTermsByInitial(letter: string): GlossaryEntry[] {
    if (!this.glossaryData || !this.glossaryData.index.byInitial[letter]) {
      return [];
    }

    const termIds = this.glossaryData.index.byInitial[letter];
    return termIds
      .map((id) => this.glossaryData!.terms[id])
      .filter((term): term is GlossaryEntry => term !== undefined);
  }

  /**
   * Get all terms
   */
  static getAllTerms(): GlossaryEntry[] {
    if (!this.glossaryData) {
      return [];
    }

    return Object.values(this.glossaryData.terms);
  }

  /**
   * Search terms by partial match
   */
  static searchTerms(query: string, locale: Locale = "en"): GlossaryEntry[] {
    if (!this.glossaryData || !query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    return Object.values(this.glossaryData.terms).filter((entry) => {
      const termMatch = entry.term.toLowerCase().includes(normalizedQuery);
      const definitionMatch = entry.definition[locale]
        .toLowerCase()
        .includes(normalizedQuery);

      return termMatch || definitionMatch;
    });
  }

  /**
   * Get related terms for a given term
   */
  static getRelatedTerms(termId: string): GlossaryEntry[] {
    const term = this.getTerm(termId);
    if (!term || !term.relatedTerms) {
      return [];
    }

    return term.relatedTerms
      .map((id) => this.getTerm(id))
      .filter((t): t is GlossaryEntry => t !== null);
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    if (!this.glossaryData) {
      return [];
    }

    return Object.keys(this.glossaryData.index.byCategory);
  }

  /**
   * Format term for display with locale
   */
  static formatTerm(entry: GlossaryEntry, locale: Locale): string {
    if (locale === "vi") {
      return `${entry.term} (${entry.definition.vi})`;
    }
    return `${entry.term} (${entry.definition.en})`;
  }

  /**
   * Extract glossary terms from content
   */
  static extractTermsFromContent(content: string): string[] {
    if (!this.glossaryData) {
      return [];
    }

    const foundTerms: string[] = [];
    const contentLower = content.toLowerCase();

    for (const entry of Object.values(this.glossaryData.terms)) {
      if (contentLower.includes(entry.term.toLowerCase())) {
        foundTerms.push(entry.id);
      }
    }

    return foundTerms;
  }
}
