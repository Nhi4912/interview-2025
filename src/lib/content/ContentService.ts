import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  Content,
  ContentMetadata,
  ContentCategory,
  Difficulty,
  Locale,
  TOCItem,
  GlossaryTerm,
  ContentIndex,
} from '@/types/content';
import {
  parseFrontmatter,
  extractTableOfContents,
  extractGlossaryTerms,
  analyzeContent,
} from './mdx-parser';
import { validateContentFile } from './content-validator';

export class ContentService {
  private contentBasePath: string;
  private contentIndex: Map<Locale, ContentIndex>;

  constructor(basePath: string = 'content') {
    this.contentBasePath = basePath;
    this.contentIndex = new Map();
  }

  /**
   * Fetch content by slug and language
   * Falls back to English if Vietnamese translation is missing
   */
  async getContent(slug: string, locale: Locale): Promise<Content> {
    try {
      // Try to get content in requested locale
      const content = await this.loadContentFile(slug, locale);
      return content;
    } catch (error) {
      // Fallback to English if Vietnamese translation is missing
      if (locale === 'vi') {
        console.warn(`Vietnamese translation missing for ${slug}, falling back to English`);
        const englishContent = await this.loadContentFile(slug, 'en');
        return {
          ...englishContent,
          metadata: {
            ...englishContent.metadata,
            translationStatus: 'fallback',
          },
        };
      }
      throw error;
    }
  }

  /**
   * Get content by category and language
   */
  async getContentByCategory(
    category: ContentCategory,
    locale: Locale
  ): Promise<Content[]> {
    const index = await this.getOrBuildIndex(locale);
    const contentIds = index.categories[category] || [];
    
    const contents = await Promise.all(
      contentIds.map(async (id) => {
        const contentData = index.contents[id];
        if (!contentData) return null;
        
        try {
          return await this.getContent(contentData.metadata.slug, locale);
        } catch (error) {
          console.error(`Failed to load content ${id}:`, error);
          return null;
        }
      })
    );

    return contents.filter((c): c is Content => c !== null);
  }

  /**
   * Get content by difficulty level and language
   */
  async getContentByDifficulty(
    difficulty: Difficulty,
    locale: Locale
  ): Promise<Content[]> {
    const index = await this.getOrBuildIndex(locale);
    
    const contentIds = Object.keys(index.contents).filter(
      (id) => index.contents[id].metadata.difficulty === difficulty
    );

    const contents = await Promise.all(
      contentIds.map(async (id) => {
        const contentData = index.contents[id];
        try {
          return await this.getContent(contentData.metadata.slug, locale);
        } catch (error) {
          console.error(`Failed to load content ${id}:`, error);
          return null;
        }
      })
    );

    return contents.filter((c): c is Content => c !== null);
  }

  /**
   * Load content file from filesystem
   */
  private async loadContentFile(slug: string, locale: Locale): Promise<Content> {
    // Find the file by searching through category directories
    const contentPath = await this.findContentPath(slug, locale);
    
    if (!contentPath) {
      throw new Error(`Content not found: ${slug} (${locale})`);
    }

    const fileContent = fs.readFileSync(contentPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Parse metadata from frontmatter
    const metadata: ContentMetadata = {
      id: frontmatter.id || slug,
      slug,
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
      hasQuiz: frontmatter.hasQuiz || false,
      hasCodeExamples: frontmatter.hasCodeExamples || false,
      hasDiagrams: frontmatter.hasDiagrams || false,
    };

    // Extract table of contents from content
    const tableOfContents = this.extractTableOfContents(content);

    // Extract glossary terms (if present in frontmatter)
    const glossary: GlossaryTerm[] = frontmatter.glossary || [];

    return {
      metadata,
      content,
      tableOfContents,
      glossary,
    };
  }

  /**
   * Find content file path by slug
   */
  private async findContentPath(slug: string, locale: Locale): Promise<string | null> {
    const localeDir = path.join(process.cwd(), this.contentBasePath, locale);
    
    // Check if locale directory exists
    if (!fs.existsSync(localeDir)) {
      return null;
    }

    // Search through all category directories
    const categories = fs.readdirSync(localeDir, { withFileTypes: true })
      .filter((dirent: fs.Dirent) => dirent.isDirectory())
      .map((dirent: fs.Dirent) => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(localeDir, category);
      const files = this.getAllMdxFiles(categoryPath);
      
      for (const file of files) {
        const fileSlug = this.getSlugFromPath(file);
        if (fileSlug === slug) {
          return file;
        }
      }
    }

    return null;
  }

  /**
   * Get all MDX files recursively from a directory
   */
  private getAllMdxFiles(dir: string): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.getAllMdxFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extract slug from file path
   */
  private getSlugFromPath(filePath: string): string {
    const basename = path.basename(filePath, path.extname(filePath));
    return basename;
  }

  /**
   * Extract table of contents from markdown content
   */
  private extractTableOfContents(content: string): TOCItem[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = this.slugify(title);

      toc.push({
        id,
        title,
        level,
      });
    }

    return toc;
  }

  /**
   * Convert text to slug format
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Get or build content index for fast lookups
   */
  private async getOrBuildIndex(locale: Locale): Promise<ContentIndex> {
    if (this.contentIndex.has(locale)) {
      return this.contentIndex.get(locale)!;
    }

    const index = await this.buildContentIndex(locale);
    this.contentIndex.set(locale, index);
    return index;
  }

  /**
   * Build content index structure for fast lookups
   */
  private async buildContentIndex(locale: Locale): Promise<ContentIndex> {
    const index: ContentIndex = {
      version: '1.0.0',
      locale,
      lastBuilt: new Date(),
      contents: {},
      categories: {},
      tags: {},
    };

    const localeDir = path.join(process.cwd(), this.contentBasePath, locale);
    
    if (!fs.existsSync(localeDir)) {
      return index;
    }

    const allFiles = this.getAllMdxFiles(localeDir);

    for (const filePath of allFiles) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter } = matter(fileContent);
        
        const slug = this.getSlugFromPath(filePath);
        const id = frontmatter.id || slug;

        const metadata: ContentMetadata = {
          id,
          slug,
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
          hasQuiz: frontmatter.hasQuiz || false,
          hasCodeExamples: frontmatter.hasCodeExamples || false,
          hasDiagrams: frontmatter.hasDiagrams || false,
        };

        // Add to contents
        index.contents[id] = {
          metadata,
          path: filePath,
          searchTokens: this.extractSearchTokens(metadata),
          relationships: {
            prerequisites: metadata.prerequisites,
            dependents: [],
            related: metadata.relatedTopics,
          },
        };

        // Add to category index
        if (!index.categories[metadata.category]) {
          index.categories[metadata.category] = [];
        }
        index.categories[metadata.category].push(id);

        // Add to tag index
        for (const tag of metadata.tags) {
          if (!index.tags[tag]) {
            index.tags[tag] = [];
          }
          index.tags[tag].push(id);
        }
      } catch (error) {
        console.error(`Failed to index file ${filePath}:`, error);
      }
    }

    return index;
  }

  /**
   * Extract search tokens from metadata
   */
  private extractSearchTokens(metadata: ContentMetadata): string[] {
    const tokens: string[] = [];
    
    tokens.push(metadata.slug);
    tokens.push(metadata.title.en.toLowerCase());
    tokens.push(metadata.title.vi.toLowerCase());
    tokens.push(metadata.description.en.toLowerCase());
    tokens.push(metadata.description.vi.toLowerCase());
    tokens.push(...metadata.tags.map(t => t.toLowerCase()));
    
    return tokens;
  }

  /**
   * Get content metadata by slug
   */
  async getContentMetadata(slug: string): Promise<ContentMetadata> {
    // Try to find in English index first
    const enIndex = await this.getOrBuildIndex('en');
    
    // Search through all contents to find matching slug
    for (const [id, contentData] of Object.entries(enIndex.contents)) {
      if (contentData.metadata.slug === slug) {
        return contentData.metadata;
      }
    }

    throw new Error(`Metadata not found for slug: ${slug}`);
  }

  /**
   * Get all content metadata for a specific locale
   */
  async getAllMetadata(locale: Locale): Promise<ContentMetadata[]> {
    const index = await this.getOrBuildIndex(locale);
    
    return Object.values(index.contents).map(contentData => contentData.metadata);
  }

  /**
   * Get the content index for a locale (exposed for advanced use cases)
   */
  async getContentIndex(locale: Locale): Promise<ContentIndex> {
    return this.getOrBuildIndex(locale);
  }

  /**
   * Rebuild the content index for a locale
   */
  async rebuildIndex(locale: Locale): Promise<void> {
    this.contentIndex.delete(locale);
    await this.getOrBuildIndex(locale);
  }

  /**
   * Get next content in sequence
   * If learningPathId is provided, follows the learning path order
   * Otherwise, returns next content in the same category
   */
  async getNextContent(
    currentId: string,
    locale: Locale,
    learningPathId?: string
  ): Promise<Content | null> {
    if (learningPathId) {
      // TODO: Implement learning path-based navigation when LearningPathService is available
      // For now, fall back to category-based navigation
      return this.getNextInCategory(currentId, locale);
    }

    return this.getNextInCategory(currentId, locale);
  }

  /**
   * Get previous content in sequence
   * If learningPathId is provided, follows the learning path order
   * Otherwise, returns previous content in the same category
   */
  async getPreviousContent(
    currentId: string,
    locale: Locale,
    learningPathId?: string
  ): Promise<Content | null> {
    if (learningPathId) {
      // TODO: Implement learning path-based navigation when LearningPathService is available
      // For now, fall back to category-based navigation
      return this.getPreviousInCategory(currentId, locale);
    }

    return this.getPreviousInCategory(currentId, locale);
  }

  /**
   * Get related content based on tags, category, and prerequisites
   */
  async getRelatedContent(contentId: string, locale: Locale): Promise<Content[]> {
    const index = await this.getOrBuildIndex(locale);
    const currentContent = index.contents[contentId];

    if (!currentContent) {
      return [];
    }

    const relatedIds = new Set<string>();
    const metadata = currentContent.metadata;

    // Add explicitly related topics
    metadata.relatedTopics.forEach(id => relatedIds.add(id));

    // Add content with shared tags
    for (const tag of metadata.tags) {
      const taggedContent = index.tags[tag] || [];
      taggedContent.forEach(id => {
        if (id !== contentId) {
          relatedIds.add(id);
        }
      });
    }

    // Add content in same category with similar difficulty
    const categoryContent = index.categories[metadata.category] || [];
    for (const id of categoryContent) {
      if (id !== contentId) {
        const otherContent = index.contents[id];
        if (otherContent && otherContent.metadata.difficulty === metadata.difficulty) {
          relatedIds.add(id);
        }
      }
    }

    // Limit to top 10 related items
    const limitedIds = Array.from(relatedIds).slice(0, 10);

    // Load the actual content
    const relatedContent = await Promise.all(
      limitedIds.map(async (id) => {
        const contentData = index.contents[id];
        if (!contentData) return null;

        try {
          const content = await this.getContent(contentData.metadata.slug, locale);
          return content;
        } catch (error) {
          console.error(`Failed to load related content ${id}:`, error);
          return null;
        }
      })
    );

    return relatedContent.filter((c): c is Content => c !== null);
  }

  /**
   * Get next content in the same category
   */
  private async getNextInCategory(currentId: string, locale: Locale): Promise<Content | null> {
    const index = await this.getOrBuildIndex(locale);
    const currentContent = index.contents[currentId];

    if (!currentContent) {
      return null;
    }

    const category = currentContent.metadata.category;
    const categoryContent = index.categories[category] || [];
    
    const currentIndex = categoryContent.indexOf(currentId);
    if (currentIndex === -1 || currentIndex === categoryContent.length - 1) {
      return null;
    }

    const nextId = categoryContent[currentIndex + 1];
    const nextContentData = index.contents[nextId];

    if (!nextContentData) {
      return null;
    }

    try {
      return await this.getContent(nextContentData.metadata.slug, locale);
    } catch (error) {
      console.error(`Failed to load next content ${nextId}:`, error);
      return null;
    }
  }

  /**
   * Get previous content in the same category
   */
  private async getPreviousInCategory(
    currentId: string,
    locale: Locale
  ): Promise<Content | null> {
    const index = await this.getOrBuildIndex(locale);
    const currentContent = index.contents[currentId];

    if (!currentContent) {
      return null;
    }

    const category = currentContent.metadata.category;
    const categoryContent = index.categories[category] || [];
    
    const currentIndex = categoryContent.indexOf(currentId);
    if (currentIndex <= 0) {
      return null;
    }

    const previousId = categoryContent[currentIndex - 1];
    const previousContentData = index.contents[previousId];

    if (!previousContentData) {
      return null;
    }

    try {
      return await this.getContent(previousContentData.metadata.slug, locale);
    } catch (error) {
      console.error(`Failed to load previous content ${previousId}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const contentService = new ContentService();
