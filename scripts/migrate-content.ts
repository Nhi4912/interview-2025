#!/usr/bin/env ts-node
/**
 * Content Migration Utility
 * 
 * Converts existing docs/*.md files to MDX format with proper metadata
 * and creates the bilingual content structure.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ContentMetadata {
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
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number;
  prerequisites: string[];
  relatedTopics: string[];
  tags: string[];
  interviewCompanies: string[];
  lastUpdated: string;
  version: string;
  hasQuiz: boolean;
  hasCodeExamples: boolean;
  hasDiagrams: boolean;
}

interface MigrationMapping {
  oldPath: string;
  newPath: string;
  contentId: string;
  metadata: ContentMetadata;
}

interface LinkReference {
  file: string;
  line: number;
  oldLink: string;
  newLink: string;
}

const DOCS_DIR = path.join(process.cwd(), 'docs');
const CONTENT_EN_DIR = path.join(process.cwd(), 'content', 'en');
const CONTENT_VI_DIR = path.join(process.cwd(), 'content', 'vi');
const MAPPING_FILE = path.join(process.cwd(), 'scripts', 'migration-mapping.json');
const LINK_REPORT_FILE = path.join(process.cwd(), 'scripts', 'link-validation-report.json');

// Category mapping from docs folder structure to content categories
const CATEGORY_MAPPING: Record<string, string> = {
  '01-javascript-fundamentals': 'javascript',
  '02-typescript': 'typescript',
  '03-react': 'react',
  '04-nextjs': 'nextjs',
  '05-security': 'security',
  '06-html': 'html',
  '06-web-apis': 'web-apis',
  '07-css': 'css',
  '08-performance': 'performance',
  '09-system-design': 'system-design',
  '10-computer-science': 'computer-science',
  '11-interview-practice': 'interview-prep',
  '12-visual-learning': 'lessons',
  '13-tools-ecosystem': 'tools',
  '14-accessibility': 'html-css',
  '15-advanced-topics': 'browser',
  '16-theoretical-foundations': 'computer-science',
  '17-frontend-theory': 'javascript',
  '18-advanced-theory': 'algorithms',
  '19-expert-topics': 'system-design',
};

// Difficulty inference based on file name patterns
function inferDifficulty(filePath: string, content: string): ContentMetadata['difficulty'] {
  const fileName = path.basename(filePath, '.md').toLowerCase();
  const contentLower = content.toLowerCase();
  
  if (fileName.includes('basic') || fileName.includes('fundamental') || fileName.startsWith('00-') || fileName.startsWith('01-')) {
    return 'beginner';
  }
  if (fileName.includes('advanced') || fileName.includes('deep') || fileName.includes('comprehensive')) {
    return 'advanced';
  }
  if (fileName.includes('expert') || fileName.includes('theory') || fileName.includes('internals')) {
    return 'expert';
  }
  if (contentLower.includes('advanced') || contentLower.includes('complex')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

// Extract title from markdown content
function extractTitle(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^#\s+(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return 'Untitled';
}

// Generate content ID from file path
function generateContentId(filePath: string, category: string): string {
  const fileName = path.basename(filePath, '.md');
  const cleanName = fileName
    .replace(/^\d+-/, '') // Remove leading numbers
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  
  return `${category}-${cleanName}`;
}

// Generate slug from content ID
function generateSlug(contentId: string): string {
  return contentId;
}

// Estimate reading time based on word count
function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(5, Math.ceil(words / wordsPerMinute));
}

// Detect if content has code examples
function hasCodeExamples(content: string): boolean {
  return /```[\s\S]*?```/.test(content);
}

// Detect if content has diagrams or mentions mermaid
function hasDiagrams(content: string): boolean {
  return content.includes('```mermaid') || 
         content.includes('diagram') || 
         content.includes('visualization') ||
         /!\[.*?\]\(.*?\.(png|jpg|svg)\)/.test(content);
}

// Detect if content has quiz or practice problems
function hasQuiz(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return lowerContent.includes('practice problem') ||
         lowerContent.includes('quiz') ||
         lowerContent.includes('exercise') ||
         lowerContent.includes('## practice');
}

// Extract tags from content
function extractTags(content: string, title: string): string[] {
  const tags = new Set<string>();
  const lowerContent = content.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  // Common technical terms
  const commonTerms = [
    'closure', 'scope', 'hoisting', 'prototype', 'async', 'promise',
    'react', 'hooks', 'component', 'state', 'props', 'typescript',
    'type', 'interface', 'generic', 'css', 'flexbox', 'grid',
    'performance', 'optimization', 'security', 'algorithm', 'data-structure'
  ];
  
  for (const term of commonTerms) {
    if (lowerContent.includes(term) || lowerTitle.includes(term)) {
      tags.add(term);
    }
  }
  
  return Array.from(tags).slice(0, 8); // Limit to 8 tags
}

// Infer interview companies based on content
function inferInterviewCompanies(content: string): string[] {
  const companies = new Set<string>();
  const lowerContent = content.toLowerCase();
  
  const companyKeywords: Record<string, string[]> = {
    google: ['google', 'faang'],
    meta: ['meta', 'facebook', 'faang'],
    amazon: ['amazon', 'faang'],
    microsoft: ['microsoft'],
    grab: ['grab', 'sea', 'southeast asia'],
  };
  
  for (const [company, keywords] of Object.entries(companyKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      companies.add(company);
    }
  }
  
  // Default to common interview companies if none detected
  if (companies.size === 0) {
    return ['google', 'meta', 'amazon'];
  }
  
  return Array.from(companies);
}

// Generate metadata for a markdown file
function generateMetadata(filePath: string, content: string): ContentMetadata {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const dirName = relativePath.split(path.sep)[0];
  const category = CATEGORY_MAPPING[dirName] || 'lessons';
  
  const title = extractTitle(content);
  const contentId = generateContentId(filePath, category);
  const slug = generateSlug(contentId);
  
  return {
    id: contentId,
    slug,
    title: {
      en: title,
      vi: title, // Will need manual translation
    },
    description: {
      en: `Learn about ${title.toLowerCase()} in depth.`,
      vi: `Tìm hiểu về ${title.toLowerCase()} một cách chi tiết.`,
    },
    category,
    difficulty: inferDifficulty(filePath, content),
    estimatedTime: estimateReadingTime(content),
    prerequisites: [],
    relatedTopics: [],
    tags: extractTags(content, title),
    interviewCompanies: inferInterviewCompanies(content),
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    hasQuiz: hasQuiz(content),
    hasCodeExamples: hasCodeExamples(content),
    hasDiagrams: hasDiagrams(content),
  };
}

// Convert markdown to MDX format with frontmatter
function convertToMDX(content: string, metadata: ContentMetadata): string {
  // Remove existing frontmatter if any
  const parsed = matter(content);
  const cleanContent = parsed.content;
  
  // Create frontmatter
  const frontmatter = `---
id: ${metadata.id}
slug: ${metadata.slug}
title:
  en: "${metadata.title.en.replace(/"/g, '\\"')}"
  vi: "${metadata.title.vi.replace(/"/g, '\\"')}"
description:
  en: "${metadata.description.en.replace(/"/g, '\\"')}"
  vi: "${metadata.description.vi.replace(/"/g, '\\"')}"
category: ${metadata.category}
difficulty: ${metadata.difficulty}
estimatedTime: ${metadata.estimatedTime}
prerequisites: ${JSON.stringify(metadata.prerequisites)}
relatedTopics: ${JSON.stringify(metadata.relatedTopics)}
tags: ${JSON.stringify(metadata.tags)}
interviewCompanies: ${JSON.stringify(metadata.interviewCompanies)}
lastUpdated: "${metadata.lastUpdated}"
version: "${metadata.version}"
hasQuiz: ${metadata.hasQuiz}
hasCodeExamples: ${metadata.hasCodeExamples}
hasDiagrams: ${metadata.hasDiagrams}
---

`;
  
  return frontmatter + cleanContent;
}

// Get all markdown files from docs directory
function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Skip meta files
        if (!entry.name.match(/^(README|INDEX|SUMMARY|TABLE)/i)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Determine target path for migrated content
function getTargetPath(sourcePath: string, metadata: ContentMetadata): string {
  const category = metadata.category;
  const fileName = `${metadata.slug}.mdx`;
  
  return path.join(CONTENT_EN_DIR, category, fileName);
}

// Create directory if it doesn't exist
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Find all internal links in content
function findInternalLinks(content: string): string[] {
  const links: string[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    // Only internal links (relative paths)
    if (!url.startsWith('http') && !url.startsWith('#')) {
      links.push(url);
    }
  }
  
  return links;
}

// Migrate a single file
function migrateFile(sourcePath: string, mappings: MigrationMapping[]): MigrationMapping | null {
  try {
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const metadata = generateMetadata(sourcePath, content);
    const mdxContent = convertToMDX(content, metadata);
    const targetPath = getTargetPath(sourcePath, metadata);
    
    // Ensure target directory exists
    ensureDir(path.dirname(targetPath));
    
    // Write MDX file
    fs.writeFileSync(targetPath, mdxContent, 'utf-8');
    
    // Create Vietnamese placeholder (copy of English for now)
    const viTargetPath = targetPath.replace('/content/en/', '/content/vi/');
    ensureDir(path.dirname(viTargetPath));
    fs.writeFileSync(viTargetPath, mdxContent, 'utf-8');
    
    console.log(`✓ Migrated: ${path.relative(process.cwd(), sourcePath)} -> ${path.relative(process.cwd(), targetPath)}`);
    
    return {
      oldPath: sourcePath,
      newPath: targetPath,
      contentId: metadata.id,
      metadata,
    };
  } catch (error) {
    console.error(`✗ Failed to migrate ${sourcePath}:`, error);
    return null;
  }
}

// Update internal links in migrated content
function updateLinks(mappings: MigrationMapping[]): LinkReference[] {
  const linkReferences: LinkReference[] = [];
  const pathMap = new Map<string, string>();
  
  // Build path mapping
  for (const mapping of mappings) {
    pathMap.set(mapping.oldPath, mapping.newPath);
    pathMap.set(path.basename(mapping.oldPath), mapping.newPath);
  }
  
  // Update links in each migrated file
  for (const mapping of mappings) {
    try {
      let content = fs.readFileSync(mapping.newPath, 'utf-8');
      const links = findInternalLinks(content);
      let modified = false;
      
      for (const link of links) {
        const linkPath = path.resolve(path.dirname(mapping.oldPath), link);
        const newPath = pathMap.get(linkPath);
        
        if (newPath) {
          const relativePath = path.relative(path.dirname(mapping.newPath), newPath);
          const oldLink = link;
          const newLink = relativePath;
          
          content = content.replace(
            new RegExp(`\\[([^\\]]+)\\]\\(${link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'),
            `[$1](${newLink})`
          );
          
          linkReferences.push({
            file: mapping.newPath,
            line: 0, // Would need line-by-line parsing for exact line
            oldLink,
            newLink,
          });
          
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(mapping.newPath, content, 'utf-8');
        console.log(`✓ Updated links in: ${path.relative(process.cwd(), mapping.newPath)}`);
      }
    } catch (error) {
      console.error(`✗ Failed to update links in ${mapping.newPath}:`, error);
    }
  }
  
  return linkReferences;
}

// Validate all links in migrated content
function validateLinks(mappings: MigrationMapping[]): { valid: LinkReference[]; broken: LinkReference[] } {
  const valid: LinkReference[] = [];
  const broken: LinkReference[] = [];
  
  for (const mapping of mappings) {
    try {
      const content = fs.readFileSync(mapping.newPath, 'utf-8');
      const links = findInternalLinks(content);
      
      for (const link of links) {
        const linkPath = path.resolve(path.dirname(mapping.newPath), link);
        
        if (fs.existsSync(linkPath)) {
          valid.push({
            file: mapping.newPath,
            line: 0,
            oldLink: link,
            newLink: link,
          });
        } else {
          broken.push({
            file: mapping.newPath,
            line: 0,
            oldLink: link,
            newLink: link,
          });
        }
      }
    } catch (error) {
      console.error(`✗ Failed to validate links in ${mapping.newPath}:`, error);
    }
  }
  
  return { valid, broken };
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting content migration...\n');
  
  // Get all markdown files
  const markdownFiles = getAllMarkdownFiles(DOCS_DIR);
  console.log(`📄 Found ${markdownFiles.length} markdown files to migrate\n`);
  
  // Migrate all files
  const mappings: MigrationMapping[] = [];
  for (const file of markdownFiles) {
    const mapping = migrateFile(file, mappings);
    if (mapping) {
      mappings.push(mapping);
    }
  }
  
  console.log(`\n✓ Migrated ${mappings.length} files\n`);
  
  // Save migration mapping
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappings, null, 2), 'utf-8');
  console.log(`✓ Saved migration mapping to ${path.relative(process.cwd(), MAPPING_FILE)}\n`);
  
  // Update internal links
  console.log('🔗 Updating internal links...\n');
  const linkUpdates = updateLinks(mappings);
  console.log(`✓ Updated ${linkUpdates.length} links\n`);
  
  // Validate links
  console.log('🔍 Validating links...\n');
  const { valid, broken } = validateLinks(mappings);
  console.log(`✓ Valid links: ${valid.length}`);
  console.log(`✗ Broken links: ${broken.length}\n`);
  
  // Save link validation report
  const report = {
    totalFiles: mappings.length,
    validLinks: valid.length,
    brokenLinks: broken.length,
    broken,
  };
  fs.writeFileSync(LINK_REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✓ Saved link validation report to ${path.relative(process.cwd(), LINK_REPORT_FILE)}\n`);
  
  console.log('✅ Migration complete!\n');
  console.log('Next steps:');
  console.log('1. Review migration-mapping.json for content ID mappings');
  console.log('2. Review link-validation-report.json for broken links');
  console.log('3. Manually translate Vietnamese content in content/vi/');
  console.log('4. Update prerequisites and relatedTopics in metadata');
}

// Run migration
migrate().catch(console.error);
