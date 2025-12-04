import matter from 'gray-matter';
import { ContentMetadata, TOCItem, GlossaryTerm, Locale } from '@/types/content';

/**
 * Parse MDX frontmatter and extract metadata
 */
export function parseFrontmatter(fileContent: string): {
  metadata: Partial<ContentMetadata>;
  content: string;
} {
  const { data: frontmatter, content } = matter(fileContent);

  const metadata: Partial<ContentMetadata> = {
    id: frontmatter.id,
    slug: frontmatter.slug,
    title: frontmatter.title,
    description: frontmatter.description,
    category: frontmatter.category,
    difficulty: frontmatter.difficulty,
    estimatedTime: frontmatter.estimatedTime,
    prerequisites: frontmatter.prerequisites || [],
    relatedTopics: frontmatter.relatedTopics || [],
    tags: frontmatter.tags || [],
    interviewCompanies: frontmatter.interviewCompanies || [],
    lastUpdated: frontmatter.lastUpdated,
    version: frontmatter.version || '1.0.0',
    hasQuiz: frontmatter.hasQuiz || false,
    hasCodeExamples: frontmatter.hasCodeExamples || false,
    hasDiagrams: frontmatter.hasDiagrams || false,
  };

  return { metadata, content };
}

/**
 * Extract table of contents from MDX content
 */
export function extractTableOfContents(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  const stack: { item: TOCItem; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2]
      .trim()
      // Remove MDX component syntax from headings
      .replace(/\{.*?\}/g, '')
      // Remove markdown links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    const id = slugify(title);

    const tocItem: TOCItem = {
      id,
      title,
      level,
      children: [],
    };

    // Build hierarchical structure
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Top-level heading
      toc.push(tocItem);
    } else {
      // Nested heading
      const parent = stack[stack.length - 1].item;
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(tocItem);
    }

    stack.push({ item: tocItem, level });
  }

  return toc;
}

/**
 * Extract glossary terms from MDX content
 * Looks for glossary definitions in the format:
 * - **Term**: Definition
 * - Or in frontmatter glossary array
 */
export function extractGlossaryTerms(
  content: string,
  frontmatterGlossary?: any[]
): GlossaryTerm[] {
  const terms: GlossaryTerm[] = [];

  // First, add terms from frontmatter if provided
  if (frontmatterGlossary && Array.isArray(frontmatterGlossary)) {
    terms.push(...frontmatterGlossary);
  }

  // Extract inline glossary terms from content
  // Pattern: **Term** (Vietnamese): Definition
  const glossaryPattern = /\*\*([^*]+)\*\*\s*(?:\(([^)]+)\))?\s*:\s*(.+?)(?=\n|$)/g;
  let match;

  while ((match = glossaryPattern.exec(content)) !== null) {
    const term = match[1].trim();
    const translation = match[2]?.trim();
    const definition = match[3].trim();

    // Try to determine if this is English or Vietnamese based on content
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
      definition
    );

    terms.push({
      term,
      definition: {
        en: isVietnamese ? (translation || term) : definition,
        vi: isVietnamese ? definition : (translation || definition),
      },
    });
  }

  return terms;
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract code blocks from content
 */
export function extractCodeBlocks(content: string): Array<{
  language: string;
  code: string;
  meta?: string;
}> {
  const codeBlockRegex = /```(\w+)(?:\s+([^\n]*))?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string; meta?: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1],
      code: match[3].trim(),
      meta: match[2]?.trim(),
    });
  }

  return blocks;
}

/**
 * Check if content has specific features
 */
export function analyzeContent(content: string): {
  hasCodeExamples: boolean;
  hasDiagrams: boolean;
  hasQuiz: boolean;
  hasMath: boolean;
  hasTables: boolean;
} {
  return {
    hasCodeExamples: /```[\s\S]*?```/.test(content),
    hasDiagrams: /```mermaid[\s\S]*?```/.test(content) || /<Diagram/.test(content),
    hasQuiz: /<Quiz/.test(content),
    hasMath: /\$\$[\s\S]*?\$\$|\$[^$]+\$/.test(content),
    hasTables: /\|[\s\S]*?\|/.test(content),
  };
}

/**
 * Extract internal links from content
 */
export function extractInternalLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    // Only include relative links (internal links)
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('#')) {
      links.push(url);
    }
  }

  return links;
}

/**
 * Count words in content (excluding code blocks and frontmatter)
 */
export function countWords(content: string): number {
  // Remove code blocks
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  const withoutInlineCode = withoutCode.replace(/`[^`]+`/g, '');
  // Remove markdown syntax
  const plainText = withoutInlineCode
    .replace(/[#*_~`\[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  
  // Count words
  const words = plainText.split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Estimate reading time in minutes
 */
export function estimateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(content);
  const codeBlocks = extractCodeBlocks(content);
  
  // Add extra time for code blocks (assume 30 seconds per block)
  const codeBlockTime = codeBlocks.length * 0.5;
  
  const readingTime = Math.ceil(wordCount / wordsPerMinute + codeBlockTime);
  return Math.max(1, readingTime); // Minimum 1 minute
}
