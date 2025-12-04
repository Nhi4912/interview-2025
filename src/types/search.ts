import { ContentMetadata, ContentCategory, Locale } from "./content";

/**
 * Represents a searchable document in the index
 */
export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: ContentCategory;
  difficulty: string;
  tags: string[];
  tokens: string[];
  metadata: ContentMetadata;
}

/**
 * Search index structure optimized for fast lookups
 */
export interface SearchIndex {
  version: string;
  locale: Locale;
  lastBuilt: string;
  documents: SearchDocument[];
  tokenMap: Map<string, Set<string>>; // token -> document IDs
  categoryMap: Map<string, string[]>; // category -> document IDs
  tagMap: Map<string, string[]>; // tag -> document IDs
  difficultyMap: Map<string, string[]>; // difficulty -> document IDs
}

/**
 * Serializable version of SearchIndex for JSON storage
 */
export interface SerializableSearchIndex {
  version: string;
  locale: Locale;
  lastBuilt: string;
  documents: SearchDocument[];
  tokenMap: Record<string, string[]>;
  categoryMap: Record<string, string[]>;
  tagMap: Record<string, string[]>;
  difficultyMap: Record<string, string[]>;
}

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
