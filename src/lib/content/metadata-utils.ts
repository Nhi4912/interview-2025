import { ContentMetadata, Locale, ContentCategory, Difficulty } from '@/types/content';
import { validateContentMetadata, ValidationResult } from './metadata-validator';

/**
 * Extracts metadata from MDX frontmatter
 */
export function extractMetadataFromFrontmatter(frontmatter: any): ContentMetadata {
  return {
    id: frontmatter.id || '',
    slug: frontmatter.slug || '',
    title: frontmatter.title || { en: '', vi: '' },
    description: frontmatter.description || { en: '', vi: '' },
    category: frontmatter.category || 'javascript',
    difficulty: frontmatter.difficulty || 'beginner',
    estimatedTime: frontmatter.estimatedTime || 30,
    prerequisites: frontmatter.prerequisites || [],
    relatedTopics: frontmatter.relatedTopics || [],
    tags: frontmatter.tags || [],
    interviewCompanies: frontmatter.interviewCompanies || [],
    lastUpdated: frontmatter.lastUpdated || new Date().toISOString(),
    version: frontmatter.version || '1.0.0',
    hasQuiz: frontmatter.hasQuiz ?? false,
    hasCodeExamples: frontmatter.hasCodeExamples ?? false,
    hasDiagrams: frontmatter.hasDiagrams ?? false,
  };
}

/**
 * Generates a content ID from category and slug
 */
export function generateContentId(category: ContentCategory, slug: string): string {
  return `${category}-${slug}`;
}

/**
 * Generates a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Gets the localized title from metadata
 */
export function getLocalizedTitle(metadata: ContentMetadata, locale: Locale): string {
  return metadata.title[locale] || metadata.title.en;
}

/**
 * Gets the localized description from metadata
 */
export function getLocalizedDescription(metadata: ContentMetadata, locale: Locale): string {
  return metadata.description[locale] || metadata.description.en;
}

/**
 * Checks if a translation is complete for a given locale
 */
export function isTranslationComplete(metadata: ContentMetadata, locale: Locale): boolean {
  if (locale === 'en') return true;
  
  return !!(
    metadata.title[locale] &&
    metadata.description[locale] &&
    metadata.title[locale].trim() !== '' &&
    metadata.description[locale].trim() !== ''
  );
}

/**
 * Gets the content file path for a given locale
 */
export function getContentPath(
  category: ContentCategory,
  slug: string,
  locale: Locale
): string {
  return `content/${locale}/${category}/${slug}.mdx`;
}

/**
 * Parses a content path to extract category, slug, and locale
 */
export function parseContentPath(path: string): {
  category: ContentCategory | null;
  slug: string | null;
  locale: Locale | null;
} {
  const match = path.match(/content\/(en|vi)\/([^/]+)\/([^/]+)\.mdx$/);
  
  if (!match) {
    return { category: null, slug: null, locale: null };
  }
  
  return {
    locale: match[1] as Locale,
    category: match[2] as ContentCategory,
    slug: match[3],
  };
}

/**
 * Filters metadata by category
 */
export function filterByCategory(
  metadataList: ContentMetadata[],
  category: ContentCategory
): ContentMetadata[] {
  return metadataList.filter((metadata) => metadata.category === category);
}

/**
 * Filters metadata by difficulty
 */
export function filterByDifficulty(
  metadataList: ContentMetadata[],
  difficulty: Difficulty
): ContentMetadata[] {
  return metadataList.filter((metadata) => metadata.difficulty === difficulty);
}

/**
 * Filters metadata by tags
 */
export function filterByTags(
  metadataList: ContentMetadata[],
  tags: string[]
): ContentMetadata[] {
  return metadataList.filter((metadata) =>
    tags.some((tag) => metadata.tags.includes(tag))
  );
}

/**
 * Filters metadata by interview companies
 */
export function filterByCompanies(
  metadataList: ContentMetadata[],
  companies: string[]
): ContentMetadata[] {
  return metadataList.filter((metadata) =>
    companies.some((company) => metadata.interviewCompanies.includes(company as any))
  );
}

/**
 * Sorts metadata by difficulty (beginner to expert)
 */
export function sortByDifficulty(metadataList: ContentMetadata[]): ContentMetadata[] {
  const difficultyOrder: { [key in Difficulty]: number } = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };
  
  return [...metadataList].sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
  );
}

/**
 * Sorts metadata by estimated time
 */
export function sortByEstimatedTime(metadataList: ContentMetadata[]): ContentMetadata[] {
  return [...metadataList].sort((a, b) => a.estimatedTime - b.estimatedTime);
}

/**
 * Sorts metadata by last updated date (newest first)
 */
export function sortByLastUpdated(metadataList: ContentMetadata[]): ContentMetadata[] {
  return [...metadataList].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
}

/**
 * Gets all unique tags from a list of metadata
 */
export function getAllTags(metadataList: ContentMetadata[]): string[] {
  const tagSet = new Set<string>();
  metadataList.forEach((metadata) => {
    metadata.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Gets all unique categories from a list of metadata
 */
export function getAllCategories(metadataList: ContentMetadata[]): ContentCategory[] {
  const categorySet = new Set<ContentCategory>();
  metadataList.forEach((metadata) => {
    categorySet.add(metadata.category);
  });
  return Array.from(categorySet).sort();
}

/**
 * Validates and sanitizes metadata
 */
export function validateAndSanitizeMetadata(
  metadata: any
): { metadata: ContentMetadata | null; validation: ValidationResult } {
  const validation = validateContentMetadata(metadata);
  
  if (!validation.valid) {
    return { metadata: null, validation };
  }
  
  return { metadata: metadata as ContentMetadata, validation };
}

/**
 * Merges partial metadata updates with existing metadata
 */
export function mergeMetadata(
  existing: ContentMetadata,
  updates: Partial<ContentMetadata>
): ContentMetadata {
  return {
    ...existing,
    ...updates,
    title: updates.title ? { ...existing.title, ...updates.title } : existing.title,
    description: updates.description
      ? { ...existing.description, ...updates.description }
      : existing.description,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Calculates the total estimated time for a list of content
 */
export function calculateTotalTime(metadataList: ContentMetadata[]): number {
  return metadataList.reduce((total, metadata) => total + metadata.estimatedTime, 0);
}

/**
 * Groups metadata by category
 */
export function groupByCategory(
  metadataList: ContentMetadata[]
): Record<ContentCategory, ContentMetadata[]> {
  const grouped: Partial<Record<ContentCategory, ContentMetadata[]>> = {};
  
  metadataList.forEach((metadata) => {
    if (!grouped[metadata.category]) {
      grouped[metadata.category] = [];
    }
    grouped[metadata.category]!.push(metadata);
  });
  
  return grouped as Record<ContentCategory, ContentMetadata[]>;
}

/**
 * Groups metadata by difficulty
 */
export function groupByDifficulty(
  metadataList: ContentMetadata[]
): Record<Difficulty, ContentMetadata[]> {
  const grouped: Partial<Record<Difficulty, ContentMetadata[]>> = {};
  
  metadataList.forEach((metadata) => {
    if (!grouped[metadata.difficulty]) {
      grouped[metadata.difficulty] = [];
    }
    grouped[metadata.difficulty]!.push(metadata);
  });
  
  return grouped as Record<Difficulty, ContentMetadata[]>;
}
