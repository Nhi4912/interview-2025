import { Locale, ContentCategory } from "@/types/content";
import {
  SearchIndex,
  SearchDocument,
  SerializableSearchIndex,
} from "./SearchIndexBuilder";

/**
 * Search options for customizing search behavior
 */
export interface SearchOptions {
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  sortBy?: "relevance" | "difficulty" | "date";
}

/**
 * Filters for narrowing search results
 */
export interface SearchFilters {
  categories?: ContentCategory[];
  difficulty?: string[];
  tags?: string[];
  companies?: string[];
  hasQuiz?: boolean;
  hasDiagrams?: boolean;
}

/**
 * Individual search result with relevance scoring
 */
export interface SearchResult {
  contentId: string;
  title: string;
  excerpt: string;
  category: ContentCategory;
  difficulty: string;
  relevanceScore: number;
  highlights: string[];
  slug: string;
  tags: string[];
}

/**
 * Faceted search result with aggregated filter counts
 */
export interface FacetedSearchResult {
  results: SearchResult[];
  facets: {
    categories: Record<string, number>;
    difficulties: Record<string, number>;
    tags: Record<string, number>;
    companies: Record<string, number>;
  };
  totalResults: number;
}

/**
 * SearchService provides full-text search, faceted search, and autocomplete
 * functionality across bilingual content
 */
export class SearchService {
  private indices: Map<Locale, SearchIndex>;

  constructor() {
    this.indices = new Map();
  }

  /**
   * Load a search index for a specific locale
   */
  async loadIndex(
    locale: Locale,
    indexData: SerializableSearchIndex
  ): Promise<void> {
    const index: SearchIndex = {
      version: indexData.version,
      locale: indexData.locale,
      lastBuilt: indexData.lastBuilt,
      documents: indexData.documents,
      tokenMap: this.objectToSetMap(indexData.tokenMap),
      categoryMap: this.objectToArrayMap(indexData.categoryMap),
      tagMap: this.objectToArrayMap(indexData.tagMap),
      difficultyMap: this.objectToArrayMap(indexData.difficultyMap),
    };

    this.indices.set(locale, index);
  }

  /**
   * Full-text search across content
   *
   * @param query - Search query string
   * @param locale - Language to search in
   * @param options - Search options including filters, pagination, and sorting
   * @returns Array of search results with relevance scores
   */
  async search(
    query: string,
    locale: Locale,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const index = this.indices.get(locale);
    if (!index) {
      console.warn(`No search index loaded for locale: ${locale}`);
      return [];
    }

    // Tokenize query
    const queryTokens = this.tokenizeQuery(query);
    if (queryTokens.length === 0) {
      return [];
    }

    // Find matching documents using inverted index
    const documentScores = new Map<string, number>();

    for (const token of queryTokens) {
      const matchingDocIds = index.tokenMap.get(token);
      if (matchingDocIds) {
        for (const docId of matchingDocIds) {
          const currentScore = documentScores.get(docId) || 0;
          // TF-IDF inspired scoring: more matches = higher score
          // Rare tokens (fewer documents) get higher weight
          const tokenWeight = 1 / Math.log(matchingDocIds.size + 1);
          documentScores.set(docId, currentScore + tokenWeight);
        }
      }
    }

    // Get documents and apply filters
    let results: SearchResult[] = [];

    for (const [docId, score] of documentScores.entries()) {
      const doc = index.documents.find((d) => d.id === docId);
      if (!doc) continue;

      // Apply filters
      if (options.filters && !this.matchesFilters(doc, options.filters)) {
        continue;
      }

      // Calculate final relevance score with boosting
      const relevanceScore = this.calculateRelevanceScore(
        doc,
        query,
        queryTokens,
        score
      );

      // Generate highlights
      const highlights = this.generateHighlights(doc, queryTokens);

      results.push({
        contentId: doc.id,
        title: doc.title,
        excerpt: doc.content,
        category: doc.category,
        difficulty: doc.difficulty,
        relevanceScore,
        highlights,
        slug: doc.slug,
        tags: doc.tags,
      });
    }

    // Sort results
    results = this.sortResults(results, options.sortBy || "relevance");

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    results = results.slice(offset, offset + limit);

    return results;
  }

  /**
   * Faceted search with aggregated filter counts
   *
   * @param query - Search query string
   * @param locale - Language to search in
   * @param facets - Facet configuration
   * @returns Search results with facet counts
   */
  async searchWithFacets(
    query: string,
    locale: Locale,
    facets: SearchFilters = {}
  ): Promise<FacetedSearchResult> {
    const index = this.indices.get(locale);
    if (!index) {
      console.warn(`No search index loaded for locale: ${locale}`);
      return this.emptyFacetedResult();
    }

    // Perform base search without filters to get all matching documents
    const allResults = await this.search(query, locale, { limit: 1000 });

    // Apply filters to get final results
    const filteredResults = allResults.filter((result) => {
      const doc = index.documents.find((d) => d.id === result.contentId);
      return doc ? this.matchesFilters(doc, facets) : false;
    });

    // Build facet counts from all matching results (before filtering)
    const facetCounts = {
      categories: {} as Record<string, number>,
      difficulties: {} as Record<string, number>,
      tags: {} as Record<string, number>,
      companies: {} as Record<string, number>,
    };

    for (const result of allResults) {
      const doc = index.documents.find((d) => d.id === result.contentId);
      if (!doc) continue;

      // Count categories
      facetCounts.categories[doc.category] =
        (facetCounts.categories[doc.category] || 0) + 1;

      // Count difficulties
      facetCounts.difficulties[doc.difficulty] =
        (facetCounts.difficulties[doc.difficulty] || 0) + 1;

      // Count tags
      for (const tag of doc.tags) {
        facetCounts.tags[tag] = (facetCounts.tags[tag] || 0) + 1;
      }

      // Count companies
      for (const company of doc.metadata.interviewCompanies || []) {
        facetCounts.companies[company] =
          (facetCounts.companies[company] || 0) + 1;
      }
    }

    return {
      results: filteredResults,
      facets: facetCounts,
      totalResults: filteredResults.length,
    };
  }

  /**
   * Get autocomplete suggestions based on partial query
   *
   * @param partial - Partial search query
   * @param locale - Language to search in
   * @returns Array of suggested search terms
   */
  async getSuggestions(partial: string, locale: Locale): Promise<string[]> {
    const index = this.indices.get(locale);
    if (!index || partial.length < 2) {
      return [];
    }

    const normalizedPartial = partial.toLowerCase().trim();
    const suggestions = new Set<string>();

    // Find tokens that start with the partial query
    for (const token of index.tokenMap.keys()) {
      if (token.startsWith(normalizedPartial)) {
        suggestions.add(token);
      }
    }

    // Also check document titles for phrase suggestions
    for (const doc of index.documents) {
      const titleLower = doc.title.toLowerCase();
      if (titleLower.includes(normalizedPartial)) {
        // Extract the matching phrase
        const words = doc.title.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
          const phrase = words
            .slice(i, Math.min(i + 3, words.length))
            .join(" ");
          if (phrase.toLowerCase().includes(normalizedPartial)) {
            suggestions.add(phrase);
          }
        }
      }
    }

    // Sort by relevance (shorter suggestions first, then alphabetically)
    return Array.from(suggestions)
      .sort((a, b) => {
        if (a.length !== b.length) {
          return a.length - b.length;
        }
        return a.localeCompare(b);
      })
      .slice(0, 10); // Limit to 10 suggestions
  }

  /**
   * Tokenize search query
   */
  private tokenizeQuery(query: string): string[] {
    return query
      .toLowerCase()
      .split(/[\s\-_.,;:!?()[\]{}'"<>\/\\]+/)
      .filter((token) => token.length > 2);
  }

  /**
   * Check if document matches all filters
   */
  private matchesFilters(doc: SearchDocument, filters: SearchFilters): boolean {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(doc.category)) {
        return false;
      }
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0) {
      if (!filters.difficulty.includes(doc.difficulty)) {
        return false;
      }
    }

    // Tags filter (document must have at least one matching tag)
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => doc.tags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Companies filter
    if (filters.companies && filters.companies.length > 0) {
      const hasMatchingCompany = filters.companies.some((company) =>
        doc.metadata.interviewCompanies?.includes(company as any)
      );
      if (!hasMatchingCompany) {
        return false;
      }
    }

    // Quiz filter
    if (filters.hasQuiz !== undefined) {
      if (doc.metadata.hasQuiz !== filters.hasQuiz) {
        return false;
      }
    }

    // Diagrams filter
    if (filters.hasDiagrams !== undefined) {
      if (doc.metadata.hasDiagrams !== filters.hasDiagrams) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate relevance score with various boosting factors
   */
  private calculateRelevanceScore(
    doc: SearchDocument,
    query: string,
    queryTokens: string[],
    baseScore: number
  ): number {
    let score = baseScore;

    const queryLower = query.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    const descriptionLower = doc.description.toLowerCase();

    // Boost for exact phrase match in title (highest priority)
    if (titleLower.includes(queryLower)) {
      score *= 3.0;
    }

    // Boost for exact phrase match in description
    if (descriptionLower.includes(queryLower)) {
      score *= 2.0;
    }

    // Boost for title token matches
    const titleTokens = this.tokenizeQuery(doc.title);
    const titleMatchCount = queryTokens.filter((qt) =>
      titleTokens.includes(qt)
    ).length;
    score += titleMatchCount * 1.5;

    // Boost for tag matches
    const tagMatchCount = queryTokens.filter((qt) =>
      doc.tags.some((tag) => tag.toLowerCase().includes(qt))
    ).length;
    score += tagMatchCount * 1.2;

    // Boost for category match
    if (doc.category.toLowerCase().includes(queryLower)) {
      score *= 1.5;
    }

    // Slight boost for content with quizzes and diagrams (more comprehensive)
    if (doc.metadata.hasQuiz) {
      score *= 1.1;
    }
    if (doc.metadata.hasDiagrams) {
      score *= 1.1;
    }

    return score;
  }

  /**
   * Generate highlighted text snippets showing query matches
   */
  private generateHighlights(
    doc: SearchDocument,
    queryTokens: string[]
  ): string[] {
    const highlights: string[] = [];

    // Check title
    const titleLower = doc.title.toLowerCase();
    for (const token of queryTokens) {
      if (titleLower.includes(token)) {
        highlights.push(doc.title);
        break;
      }
    }

    // Check description
    const descriptionLower = doc.description.toLowerCase();
    for (const token of queryTokens) {
      if (descriptionLower.includes(token)) {
        highlights.push(doc.description);
        break;
      }
    }

    // Check content excerpt
    const contentLower = doc.content.toLowerCase();
    for (const token of queryTokens) {
      const index = contentLower.indexOf(token);
      if (index !== -1) {
        // Extract context around the match
        const start = Math.max(0, index - 50);
        const end = Math.min(doc.content.length, index + token.length + 50);
        let snippet = doc.content.substring(start, end);

        // Add ellipsis if truncated
        if (start > 0) snippet = "..." + snippet;
        if (end < doc.content.length) snippet = snippet + "...";

        highlights.push(snippet);
        break;
      }
    }

    return highlights.slice(0, 3); // Limit to 3 highlights
  }

  /**
   * Sort search results based on specified criteria
   */
  private sortResults(
    results: SearchResult[],
    sortBy: "relevance" | "difficulty" | "date"
  ): SearchResult[] {
    switch (sortBy) {
      case "relevance":
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      case "difficulty":
        const difficultyOrder = [
          "beginner",
          "intermediate",
          "advanced",
          "expert",
        ];
        return results.sort((a, b) => {
          const aIndex = difficultyOrder.indexOf(a.difficulty);
          const bIndex = difficultyOrder.indexOf(b.difficulty);
          return aIndex - bIndex;
        });

      case "date":
        // Sort by date would require lastUpdated field in SearchResult
        // For now, maintain relevance order
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);

      default:
        return results;
    }
  }

  /**
   * Create empty faceted result
   */
  private emptyFacetedResult(): FacetedSearchResult {
    return {
      results: [],
      facets: {
        categories: {},
        difficulties: {},
        tags: {},
        companies: {},
      },
      totalResults: 0,
    };
  }

  /**
   * Convert plain object to Map<string, Set<string>>
   */
  private objectToSetMap(
    obj: Record<string, string[]>
  ): Map<string, Set<string>> {
    const map = new Map<string, Set<string>>();
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, new Set(value));
    }
    return map;
  }

  /**
   * Convert plain object to Map<string, string[]>
   */
  private objectToArrayMap(
    obj: Record<string, string[]>
  ): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const [key, value] of Object.entries(obj)) {
      map.set(key, value);
    }
    return map;
  }

  /**
   * Get statistics about loaded indices
   */
  getIndexStats(locale: Locale): {
    documentCount: number;
    tokenCount: number;
    categoryCount: number;
    tagCount: number;
  } | null {
    const index = this.indices.get(locale);
    if (!index) {
      return null;
    }

    return {
      documentCount: index.documents.length,
      tokenCount: index.tokenMap.size,
      categoryCount: index.categoryMap.size,
      tagCount: index.tagMap.size,
    };
  }
}

// Export singleton instance
export const searchService = new SearchService();
