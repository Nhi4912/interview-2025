#!/usr/bin/env ts-node
/**
 * Migration Validation Utility
 * 
 * Validates migrated content for:
 * - Metadata completeness
 * - Link integrity
 * - Content structure
 * - Bilingual consistency
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateContentMetadata, formatValidationErrors } from '../src/lib/content/metadata-validator';

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationReport {
  totalFiles: number;
  validFiles: number;
  invalidFiles: number;
  results: ValidationResult[];
  summary: {
    metadataErrors: number;
    linkErrors: number;
    structureErrors: number;
    bilingualErrors: number;
  };
}

const CONTENT_EN_DIR = path.join(process.cwd(), 'content', 'en');
const CONTENT_VI_DIR = path.join(process.cwd(), 'content', 'vi');
const VALIDATION_REPORT_FILE = path.join(process.cwd(), 'scripts', 'validation-report.json');

// Get all MDX files from a directory
function getAllMDXFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentDir: string) {
    if (!fs.existsSync(currentDir)) {
      return;
    }
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Validate metadata
function validateMetadata(filePath: string): { valid: boolean; errors: string[] } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    
    const result = validateContentMetadata(data);
    
    if (!result.valid) {
      return {
        valid: false,
        errors: formatValidationErrors(result).split('\n').filter(Boolean),
      };
    }
    
    return { valid: true, errors: [] };
  } catch (error) {
    return {
      valid: false,
      errors: [`Failed to parse frontmatter: ${error}`],
    };
  }
}

// Validate internal links
function validateLinks(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2];
      
      // Skip external links and anchors
      if (url.startsWith('http') || url.startsWith('#')) {
        continue;
      }
      
      // Check if file exists
      const linkPath = path.resolve(path.dirname(filePath), url);
      if (!fs.existsSync(linkPath)) {
        errors.push(`Broken link: ${url}`);
      }
    }
  } catch (error) {
    errors.push(`Failed to validate links: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Validate content structure
function validateStructure(filePath: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Check for title heading
    if (!body.match(/^#\s+.+$/m)) {
      warnings.push('Missing main title heading (# Title)');
    }
    
    // Check for empty content
    if (body.trim().length < 100) {
      errors.push('Content is too short (less than 100 characters)');
    }
    
    // Check for code examples if metadata says it has them
    if (data.hasCodeExamples && !body.includes('```')) {
      warnings.push('Metadata indicates code examples but none found');
    }
    
    // Check for diagrams if metadata says it has them
    if (data.hasDiagrams && !body.includes('```mermaid') && !body.match(/!\[.*?\]\(.*?\)/)) {
      warnings.push('Metadata indicates diagrams but none found');
    }
  } catch (error) {
    errors.push(`Failed to validate structure: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate bilingual consistency
function validateBilingual(enPath: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const viPath = enPath.replace('/content/en/', '/content/vi/');
    
    // Check if Vietnamese version exists
    if (!fs.existsSync(viPath)) {
      warnings.push('Vietnamese translation missing');
      return { valid: true, errors, warnings };
    }
    
    const enContent = fs.readFileSync(enPath, 'utf-8');
    const viContent = fs.readFileSync(viPath, 'utf-8');
    
    const enData = matter(enContent).data;
    const viData = matter(viContent).data;
    
    // Check if IDs match
    if (enData.id !== viData.id) {
      errors.push(`Content ID mismatch: EN=${enData.id}, VI=${viData.id}`);
    }
    
    // Check if Vietnamese title is provided
    if (!viData.title?.vi || viData.title.vi === enData.title.en) {
      warnings.push('Vietnamese title not translated');
    }
    
    // Check if Vietnamese description is provided
    if (!viData.description?.vi || viData.description.vi === enData.description.en) {
      warnings.push('Vietnamese description not translated');
    }
    
    // Check if content is translated (rough check)
    const enBody = matter(enContent).content;
    const viBody = matter(viContent).content;
    
    if (enBody === viBody) {
      warnings.push('Content appears to be untranslated');
    }
  } catch (error) {
    errors.push(`Failed to validate bilingual consistency: ${error}`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate a single file
function validateFile(filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate metadata
  const metadataResult = validateMetadata(filePath);
  if (!metadataResult.valid) {
    errors.push(...metadataResult.errors.map(e => `[Metadata] ${e}`));
  }
  
  // Validate links
  const linksResult = validateLinks(filePath);
  if (!linksResult.valid) {
    errors.push(...linksResult.errors.map(e => `[Links] ${e}`));
  }
  
  // Validate structure
  const structureResult = validateStructure(filePath);
  if (!structureResult.valid) {
    errors.push(...structureResult.errors.map(e => `[Structure] ${e}`));
  }
  warnings.push(...structureResult.warnings.map(w => `[Structure] ${w}`));
  
  // Validate bilingual consistency (only for English files)
  if (filePath.includes('/content/en/')) {
    const bilingualResult = validateBilingual(filePath);
    if (!bilingualResult.valid) {
      errors.push(...bilingualResult.errors.map(e => `[Bilingual] ${e}`));
    }
    warnings.push(...bilingualResult.warnings.map(w => `[Bilingual] ${w}`));
  }
  
  return {
    file: path.relative(process.cwd(), filePath),
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Main validation function
async function validate() {
  console.log('🔍 Starting migration validation...\n');
  
  // Get all MDX files
  const enFiles = getAllMDXFiles(CONTENT_EN_DIR);
  const viFiles = getAllMDXFiles(CONTENT_VI_DIR);
  
  console.log(`📄 Found ${enFiles.length} English files`);
  console.log(`📄 Found ${viFiles.length} Vietnamese files\n`);
  
  // Validate all files
  const results: ValidationResult[] = [];
  const allFiles = [...enFiles, ...viFiles];
  
  for (const file of allFiles) {
    const result = validateFile(file);
    results.push(result);
    
    if (!result.valid) {
      console.log(`✗ ${result.file}`);
      result.errors.forEach(error => console.log(`  - ${error}`));
    } else if (result.warnings.length > 0) {
      console.log(`⚠ ${result.file}`);
      result.warnings.forEach(warning => console.log(`  - ${warning}`));
    } else {
      console.log(`✓ ${result.file}`);
    }
  }
  
  // Generate summary
  const validFiles = results.filter(r => r.valid).length;
  const invalidFiles = results.filter(r => !r.valid).length;
  
  const metadataErrors = results.reduce((sum, r) => 
    sum + r.errors.filter(e => e.includes('[Metadata]')).length, 0
  );
  const linkErrors = results.reduce((sum, r) => 
    sum + r.errors.filter(e => e.includes('[Links]')).length, 0
  );
  const structureErrors = results.reduce((sum, r) => 
    sum + r.errors.filter(e => e.includes('[Structure]')).length, 0
  );
  const bilingualErrors = results.reduce((sum, r) => 
    sum + r.errors.filter(e => e.includes('[Bilingual]')).length, 0
  );
  
  const report: ValidationReport = {
    totalFiles: results.length,
    validFiles,
    invalidFiles,
    results: results.filter(r => !r.valid || r.warnings.length > 0),
    summary: {
      metadataErrors,
      linkErrors,
      structureErrors,
      bilingualErrors,
    },
  };
  
  // Save report
  fs.writeFileSync(VALIDATION_REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log('\n📊 Validation Summary:');
  console.log(`Total files: ${report.totalFiles}`);
  console.log(`Valid files: ${validFiles} (${Math.round(validFiles / report.totalFiles * 100)}%)`);
  console.log(`Invalid files: ${invalidFiles} (${Math.round(invalidFiles / report.totalFiles * 100)}%)`);
  console.log('\nError breakdown:');
  console.log(`  Metadata errors: ${metadataErrors}`);
  console.log(`  Link errors: ${linkErrors}`);
  console.log(`  Structure errors: ${structureErrors}`);
  console.log(`  Bilingual errors: ${bilingualErrors}`);
  
  console.log(`\n✓ Saved validation report to ${path.relative(process.cwd(), VALIDATION_REPORT_FILE)}\n`);
  
  if (invalidFiles > 0) {
    console.log('⚠️  Some files have validation errors. Please review the report.');
    process.exit(1);
  } else {
    console.log('✅ All files passed validation!');
  }
}

// Run validation
validate().catch(console.error);
