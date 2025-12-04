import { ContentMetadata, ContentCategory, Difficulty, Locale } from '@/types/content';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate content metadata completeness and correctness
 */
export function validateMetadata(
  metadata: Partial<ContentMetadata>,
  locale: Locale
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!metadata.id) {
    errors.push({
      field: 'id',
      message: 'Content ID is required',
      severity: 'error',
    });
  }

  if (!metadata.slug) {
    errors.push({
      field: 'slug',
      message: 'Content slug is required',
      severity: 'error',
    });
  }

  // Title validation
  if (!metadata.title) {
    errors.push({
      field: 'title',
      message: 'Title is required',
      severity: 'error',
    });
  } else {
    if (!metadata.title.en || metadata.title.en.trim() === '') {
      errors.push({
        field: 'title.en',
        message: 'English title is required',
        severity: 'error',
      });
    }

    if (!metadata.title.vi || metadata.title.vi.trim() === '') {
      warnings.push({
        field: 'title.vi',
        message: 'Vietnamese title is missing',
        severity: 'warning',
      });
    }
  }

  // Description validation
  if (!metadata.description) {
    warnings.push({
      field: 'description',
      message: 'Description is recommended',
      severity: 'warning',
    });
  } else {
    if (!metadata.description.en || metadata.description.en.trim() === '') {
      warnings.push({
        field: 'description.en',
        message: 'English description is recommended',
        severity: 'warning',
      });
    }

    if (!metadata.description.vi || metadata.description.vi.trim() === '') {
      warnings.push({
        field: 'description.vi',
        message: 'Vietnamese description is missing',
        severity: 'warning',
      });
    }
  }

  // Category validation
  if (!metadata.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      severity: 'error',
    });
  } else if (!isValidCategory(metadata.category)) {
    errors.push({
      field: 'category',
      message: `Invalid category: ${metadata.category}`,
      severity: 'error',
    });
  }

  // Difficulty validation
  if (!metadata.difficulty) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty level is required',
      severity: 'error',
    });
  } else if (!isValidDifficulty(metadata.difficulty)) {
    errors.push({
      field: 'difficulty',
      message: `Invalid difficulty: ${metadata.difficulty}`,
      severity: 'error',
    });
  }

  // Estimated time validation
  if (metadata.estimatedTime !== undefined) {
    if (metadata.estimatedTime <= 0) {
      errors.push({
        field: 'estimatedTime',
        message: 'Estimated time must be greater than 0',
        severity: 'error',
      });
    }
    if (metadata.estimatedTime > 480) {
      warnings.push({
        field: 'estimatedTime',
        message: 'Estimated time seems unusually long (>8 hours)',
        severity: 'warning',
      });
    }
  } else {
    warnings.push({
      field: 'estimatedTime',
      message: 'Estimated time is recommended',
      severity: 'warning',
    });
  }

  // Prerequisites validation
  if (metadata.prerequisites && !Array.isArray(metadata.prerequisites)) {
    errors.push({
      field: 'prerequisites',
      message: 'Prerequisites must be an array',
      severity: 'error',
    });
  }

  // Related topics validation
  if (metadata.relatedTopics && !Array.isArray(metadata.relatedTopics)) {
    errors.push({
      field: 'relatedTopics',
      message: 'Related topics must be an array',
      severity: 'error',
    });
  }

  // Tags validation
  if (!metadata.tags || metadata.tags.length === 0) {
    warnings.push({
      field: 'tags',
      message: 'Tags are recommended for better discoverability',
      severity: 'warning',
    });
  } else if (!Array.isArray(metadata.tags)) {
    errors.push({
      field: 'tags',
      message: 'Tags must be an array',
      severity: 'error',
    });
  }

  // Version validation
  if (metadata.version && !isValidVersion(metadata.version)) {
    warnings.push({
      field: 'version',
      message: 'Version should follow semantic versioning (e.g., 1.0.0)',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate content structure and quality
 */
export function validateContent(content: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check minimum content length
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 50) {
    warnings.push({
      field: 'content',
      message: 'Content seems too short (less than 50 words)',
      severity: 'warning',
    });
  }

  // Check for headings
  const hasHeadings = /^#{1,6}\s+.+$/m.test(content);
  if (!hasHeadings) {
    warnings.push({
      field: 'content',
      message: 'Content should include section headings',
      severity: 'warning',
    });
  }

  // Check for unclosed code blocks
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push({
      field: 'content',
      message: 'Unclosed code block detected',
      severity: 'error',
    });
  }

  // Check for broken links
  const linkRegex = /\[([^\]]+)\]\(([^)]*)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    if (!url || url.trim() === '') {
      errors.push({
        field: 'content',
        message: `Broken link found: [${match[1]}]()`,
        severity: 'error',
      });
    }
  }

  // Check for unclosed MDX components
  const componentOpenRegex = /<([A-Z][A-Za-z0-9]*)[^>]*>/g;
  const componentCloseRegex = /<\/([A-Z][A-Za-z0-9]*)>/g;
  
  const openTags: string[] = [];
  const closeTags: string[] = [];
  
  while ((match = componentOpenRegex.exec(content)) !== null) {
    // Skip self-closing tags
    if (!match[0].endsWith('/>')) {
      openTags.push(match[1]);
    }
  }
  
  while ((match = componentCloseRegex.exec(content)) !== null) {
    closeTags.push(match[1]);
  }
  
  // Simple check: count should match
  if (openTags.length !== closeTags.length) {
    warnings.push({
      field: 'content',
      message: 'Possible unclosed MDX component detected',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate complete content file (metadata + content)
 */
export function validateContentFile(
  metadata: Partial<ContentMetadata>,
  content: string,
  locale: Locale
): ValidationResult {
  const metadataValidation = validateMetadata(metadata, locale);
  const contentValidation = validateContent(content);

  return {
    isValid: metadataValidation.isValid && contentValidation.isValid,
    errors: [...metadataValidation.errors, ...contentValidation.errors],
    warnings: [...metadataValidation.warnings, ...contentValidation.warnings],
  };
}

/**
 * Check if category is valid
 */
function isValidCategory(category: string): category is ContentCategory {
  const validCategories: ContentCategory[] = [
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'css',
    'html',
    'web-apis',
    'computer-science',
    'algorithms',
    'system-design',
    'security',
    'performance',
    'testing',
    'tools',
  ];
  return validCategories.includes(category as ContentCategory);
}

/**
 * Check if difficulty is valid
 */
function isValidDifficulty(difficulty: string): difficulty is Difficulty {
  const validDifficulties: Difficulty[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  return validDifficulties.includes(difficulty as Difficulty);
}

/**
 * Check if version follows semantic versioning
 */
function isValidVersion(version: string): boolean {
  const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  return semverRegex.test(version);
}

/**
 * Generate validation report as formatted string
 */
export function formatValidationReport(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.isValid) {
    lines.push('✓ Validation passed');
  } else {
    lines.push('✗ Validation failed');
  }

  if (result.errors.length > 0) {
    lines.push('\nErrors:');
    result.errors.forEach((error) => {
      lines.push(`  - [${error.field}] ${error.message}`);
    });
  }

  if (result.warnings.length > 0) {
    lines.push('\nWarnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  - [${warning.field}] ${warning.message}`);
    });
  }

  return lines.join('\n');
}
