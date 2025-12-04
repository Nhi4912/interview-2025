import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Locale, ContentMetadata, ContentCategory } from "@/types/content";

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
 * SearchIndexBuilder processes content files and builds searchable indices
 */
export class SearchIndexBuilder {
  private contentBasePath: string;
  private stopWords: Set<string>;

  constructor(basePath: string = "content") {
    this.contentBasePath = basePath;
    this.stopWords = this.initializeStopWords();
  }

  /**
   * Build search index for a specific locale
   */
  async buildIndex(locale: Locale): Promise<SearchIndex> {
    const localeDir = path.join(process.cwd(), this.contentBasePath, locale);

    if (!fs.existsSync(localeDir)) {
      console.warn(`Content directory not found: ${localeDir}`);
      return this.createEmptyIndex(locale);
    }

    const documents: SearchDocument[] = [];
    const allFiles = this.getAllContentFiles(localeDir);

    console.log(
      `Building search index for ${locale}: found ${allFiles.length} files`
    );

    for (const filePath of allFiles) {
      try {
        const document = await this.processFile(filePath, locale);
        if (document) {
          documents.push(document);
        }
      } catch (error) {
        console.error(`Failed to process file ${filePath}:`, error);
      }
    }

    // Build inverted indices
    const tokenMap = new Map<string, Set<string>>();
    const categoryMap = new Map<string, string[]>();
    const tagMap = new Map<string, string[]>();
    const difficultyMap = new Map<string, string[]>();

    for (const doc of documents) {
      // Build token map (inverted index)
      for (const token of doc.tokens) {
        if (!tokenMap.has(token)) {
          tokenMap.set(token, new Set());
        }
        tokenMap.get(token)!.add(doc.id);
      }

      // Build category map
      if (!categoryMap.has(doc.category)) {
        categoryMap.set(doc.category, []);
      }
      categoryMap.get(doc.category)!.push(doc.id);

      // Build tag map
      for (const tag of doc.tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(doc.id);
      }

      // Build difficulty map
      if (!difficultyMap.has(doc.difficulty)) {
        difficultyMap.set(doc.difficulty, []);
      }
      difficultyMap.get(doc.difficulty)!.push(doc.id);
    }

    console.log(
      `Index built: ${documents.length} documents, ${tokenMap.size} unique tokens`
    );

    return {
      version: "1.0.0",
      locale,
      lastBuilt: new Date().toISOString(),
      documents,
      tokenMap,
      categoryMap,
      tagMap,
      difficultyMap,
    };
  }

  /**
   * Process a single content file and extract searchable data
   */
  private async processFile(
    filePath: string,
    locale: Locale
  ): Promise<SearchDocument | null> {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    // Skip files without proper metadata
    if (!frontmatter.id && !frontmatter.title) {
      console.warn(`Skipping file without metadata: ${filePath}`);
      return null;
    }

    const slug = this.getSlugFromPath(filePath);
    const id = frontmatter.id || slug;

    const metadata: ContentMetadata = {
      id,
      slug,
      title: frontmatter.title || { en: "", vi: "" },
      description: frontmatter.description || { en: "", vi: "" },
      category: frontmatter.category || "javascript",
      difficulty: frontmatter.difficulty || "beginner",
      estimatedTime: frontmatter.estimatedTime || 30,
      prerequisites: frontmatter.prerequisites || [],
      relatedTopics: frontmatter.relatedTopics || [],
      tags: frontmatter.tags || [],
      interviewCompanies: frontmatter.interviewCompanies || [],
      lastUpdated: frontmatter.lastUpdated || new Date().toISOString(),
      version: frontmatter.version || "1.0.0",
      hasQuiz: frontmatter.hasQuiz || false,
      hasCodeExamples: frontmatter.hasCodeExamples || false,
      hasDiagrams: frontmatter.hasDiagrams || false,
    };

    // Extract title and description for the current locale
    const title =
      typeof metadata.title === "object"
        ? metadata.title[locale] || metadata.title.en
        : metadata.title;

    const description =
      typeof metadata.description === "object"
        ? metadata.description[locale] || metadata.description.en
        : metadata.description;

    // Clean content (remove MDX imports, code blocks, etc.)
    const cleanedContent = this.cleanContent(content);

    // Extract searchable tokens
    const tokens = this.extractTokens(
      title,
      description,
      cleanedContent,
      metadata.tags
    );

    return {
      id,
      slug,
      title,
      description,
      content: cleanedContent.substring(0, 500), // Store excerpt for search results
      category: metadata.category,
      difficulty: metadata.difficulty,
      tags: metadata.tags,
      tokens,
      metadata,
    };
  }

  /**
   * Extract and tokenize searchable text
   */
  private extractTokens(
    title: string,
    description: string,
    content: string,
    tags: string[]
  ): string[] {
    const allText = `${title} ${description} ${content} ${tags.join(" ")}`;

    // Tokenize: split by non-word characters, lowercase, filter
    const tokens = allText
      .toLowerCase()
      .split(/[\s\-_.,;:!?()[\]{}'"<>\/\\]+/)
      .filter((token) => {
        // Filter out empty strings, stop words, and very short tokens
        return token.length > 2 && !this.stopWords.has(token);
      })
      .filter((token, index, self) => {
        // Remove duplicates
        return self.indexOf(token) === index;
      });

    return tokens;
  }

  /**
   * Clean content by removing MDX syntax, code blocks, and special characters
   */
  private cleanContent(content: string): string {
    let cleaned = content;

    // Remove MDX imports
    cleaned = cleaned.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "");

    // Remove code blocks
    cleaned = cleaned.replace(/```[\s\S]*?```/g, "");
    cleaned = cleaned.replace(/`[^`]+`/g, "");

    // Remove HTML/JSX tags
    cleaned = cleaned.replace(/<[^>]+>/g, " ");

    // Remove markdown links but keep text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // Remove markdown images
    cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

    // Remove markdown headers
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, "");

    // Remove special characters but keep spaces
    cleaned = cleaned.replace(/[*_~`]/g, "");

    // Normalize whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
  }

  /**
   * Get all content files recursively from a directory
   */
  private getAllContentFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.getAllContentFiles(fullPath));
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))
      ) {
        // Skip metadata files
        if (
          !entry.name.includes("metadata.") &&
          !entry.name.includes("example")
        ) {
          files.push(fullPath);
        }
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
   * Create an empty index structure
   */
  private createEmptyIndex(locale: Locale): SearchIndex {
    return {
      version: "1.0.0",
      locale,
      lastBuilt: new Date().toISOString(),
      documents: [],
      tokenMap: new Map(),
      categoryMap: new Map(),
      tagMap: new Map(),
      difficultyMap: new Map(),
    };
  }

  /**
   * Initialize common stop words to exclude from indexing
   */
  private initializeStopWords(): Set<string> {
    // Common English stop words
    const englishStopWords = [
      "the",
      "be",
      "to",
      "of",
      "and",
      "a",
      "in",
      "that",
      "have",
      "i",
      "it",
      "for",
      "not",
      "on",
      "with",
      "he",
      "as",
      "you",
      "do",
      "at",
      "this",
      "but",
      "his",
      "by",
      "from",
      "they",
      "we",
      "say",
      "her",
      "she",
      "or",
      "an",
      "will",
      "my",
      "one",
      "all",
      "would",
      "there",
      "their",
      "what",
      "so",
      "up",
      "out",
      "if",
      "about",
      "who",
      "get",
      "which",
      "go",
      "me",
      "when",
      "make",
      "can",
      "like",
      "time",
      "no",
      "just",
      "him",
      "know",
      "take",
      "people",
      "into",
      "year",
      "your",
      "good",
      "some",
      "could",
      "them",
      "see",
      "other",
      "than",
      "then",
      "now",
      "look",
      "only",
      "come",
      "its",
      "over",
      "think",
      "also",
      "back",
      "after",
      "use",
      "two",
      "how",
      "our",
      "work",
      "first",
      "well",
      "way",
      "even",
      "new",
      "want",
      "because",
      "any",
      "these",
      "give",
      "day",
      "most",
      "us",
      "is",
      "was",
      "are",
      "been",
      "has",
      "had",
      "were",
      "said",
      "did",
      "having",
      "may",
      "should",
      "does",
      "being",
    ];

    // Common Vietnamese stop words
    const vietnameseStopWords = [
      "và",
      "của",
      "có",
      "trong",
      "là",
      "được",
      "cho",
      "với",
      "để",
      "các",
      "một",
      "này",
      "những",
      "đã",
      "sẽ",
      "không",
      "từ",
      "như",
      "khi",
      "về",
      "hay",
      "hoặc",
      "nhưng",
      "vì",
      "nếu",
      "thì",
      "đó",
      "đây",
      "cũng",
      "rất",
      "nhiều",
      "nên",
      "phải",
      "còn",
      "đến",
      "theo",
      "bởi",
      "tại",
      "trên",
      "dưới",
    ];

    return new Set([...englishStopWords, ...vietnameseStopWords]);
  }

  /**
   * Serialize index to JSON-compatible format
   */
  serializeIndex(index: SearchIndex): SerializableSearchIndex {
    return {
      version: index.version,
      locale: index.locale,
      lastBuilt: index.lastBuilt,
      documents: index.documents,
      tokenMap: this.setMapToObject(index.tokenMap),
      categoryMap: this.arrayMapToObject(index.categoryMap),
      tagMap: this.arrayMapToObject(index.tagMap),
      difficultyMap: this.arrayMapToObject(index.difficultyMap),
    };
  }

  /**
   * Deserialize index from JSON format
   */
  deserializeIndex(serialized: SerializableSearchIndex): SearchIndex {
    return {
      version: serialized.version,
      locale: serialized.locale,
      lastBuilt: serialized.lastBuilt,
      documents: serialized.documents,
      tokenMap: this.objectToSetMap(serialized.tokenMap),
      categoryMap: this.objectToArrayMap(serialized.categoryMap),
      tagMap: this.objectToArrayMap(serialized.tagMap),
      difficultyMap: this.objectToArrayMap(serialized.difficultyMap),
    };
  }

  /**
   * Convert Map<string, Set<string>> to plain object for serialization
   */
  private setMapToObject(
    map: Map<string, Set<string>>
  ): Record<string, string[]> {
    const obj: Record<string, string[]> = {};
    for (const [key, value] of map.entries()) {
      obj[key] = Array.from(value);
    }
    return obj;
  }

  /**
   * Convert Map<string, string[]> to plain object for serialization
   */
  private arrayMapToObject(
    map: Map<string, string[]>
  ): Record<string, string[]> {
    const obj: Record<string, string[]> = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  /**
   * Convert plain object to Map<string, Set<string>> for deserialization
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
   * Convert plain object to Map<string, string[]> for deserialization
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
   * Save index to file
   */
  async saveIndex(index: SearchIndex, outputPath: string): Promise<void> {
    const serialized = this.serializeIndex(index);
    const dir = path.dirname(outputPath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(serialized, null, 2), "utf-8");
    console.log(`Search index saved to ${outputPath}`);
  }

  /**
   * Load index from file
   */
  async loadIndex(inputPath: string): Promise<SearchIndex | null> {
    if (!fs.existsSync(inputPath)) {
      console.warn(`Index file not found: ${inputPath}`);
      return null;
    }

    try {
      const fileContent = fs.readFileSync(inputPath, "utf-8");
      const serialized: SerializableSearchIndex = JSON.parse(fileContent);
      return this.deserializeIndex(serialized);
    } catch (error) {
      console.error(`Failed to load index from ${inputPath}:`, error);
      return null;
    }
  }

  /**
   * Build and save indices for both locales
   */
  async buildAllIndices(
    outputDir: string = "public/search-indices"
  ): Promise<void> {
    const locales: Locale[] = ["en", "vi"];

    for (const locale of locales) {
      console.log(`\nBuilding search index for ${locale}...`);
      const index = await this.buildIndex(locale);
      const outputPath = path.join(process.cwd(), outputDir, `${locale}.json`);
      await this.saveIndex(index, outputPath);
    }

    console.log("\nAll search indices built successfully!");
  }
}

// Export singleton instance
export const searchIndexBuilder = new SearchIndexBuilder();
