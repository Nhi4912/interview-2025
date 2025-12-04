import { ContentMetadata, ContentCategory, Difficulty, InterviewCompany, Locale } from '@/types/content';

/**
 * Validation result for content metadata
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
}

/**
 * Valid content categories
 */
const VALID_CATEGORIES: ContentCategory[] = [
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

/**
 * Valid difficulty levels
 */
const VALID_DIFFICULTIES: Difficulty[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
];

/**
 * Valid interview companies
 */
const VALID_COMPANIES: InterviewCompany[] = [
  'google',
  'meta',
  'amazon',
  'microsoft',
  'grab',
];

/**
 * Validates content metadata against the schema
 */
export function validateContentMetadata(metadata: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields validation
  if (!metadata.id || typeof metadata.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'ID is required and must be a string',
      value: metadata.id,
    });
  }

  if (!metadata.slug || typeof metadata.slug !== 'string') {
    errors.push({
      field: 'slug',
      message: 'Slug is required and must be a string',
      value: metadata.slug,
    });
  }

  // Title validation
  if (!metadata.title || typeof metadata.title !== 'object') {
    errors.push({
      field: 'title',
      message: 'Title is required and must be an object with en and vi properties',
      value: metadata.title,
    });
  } else {
    if (!metadata.title.en || typeof metadata.title.en !== 'string') {
      errors.push({
        field: 'title.en',
        message: 'English title is required and must be a string',
        value: metadata.title.en,
      });
    }
    if (!metadata.title.vi || typeof metadata.title.vi !== 'string') {
      warnings.push({
        field: 'title.vi',
        message: 'Vietnamese title is missing or invalid',
        value: metadata.title.vi,
      });
    }
  }

  // Description validation
  if (!metadata.description || typeof metadata.description !== 'object') {
    errors.push({
      field: 'description',
      message: 'Description is required and must be an object with en and vi properties',
      value: metadata.description,
    });
  } else {
    if (!metadata.description.en || typeof metadata.description.en !== 'string') {
      errors.push({
        field: 'description.en',
        message: 'English description is required and must be a string',
        value: metadata.description.en,
      });
    }
    if (!metadata.description.vi || typeof metadata.description.vi !== 'string') {
      warnings.push({
        field: 'description.vi',
        message: 'Vietnamese description is missing or invalid',
        value: metadata.description.vi,
      });
    }
  }

  // Category validation
  if (!metadata.category) {
    errors.push({
      field: 'category',
      message: 'Category is required',
      value: metadata.category,
    });
  } else if (!VALID_CATEGORIES.includes(metadata.category)) {
    errors.push({
      field: 'category',
      message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      value: metadata.category,
    });
  }

  // Difficulty validation
  if (!metadata.difficulty) {
    errors.push({
      field: 'difficulty',
      message: 'Difficulty is required',
      value: metadata.difficulty,
    });
  } else if (!VALID_DIFFICULTIES.includes(metadata.difficulty)) {
    errors.push({
      field: 'difficulty',
      message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
      value: metadata.difficulty,
    });
  }

  // Estimated time validation
  if (metadata.estimatedTime === undefined || metadata.estimatedTime === null) {
    errors.push({
      field: 'estimatedTime',
      message: 'Estimated time is required',
      value: metadata.estimatedTime,
    });
  } else if (typeof metadata.estimatedTime !== 'number' || metadata.estimatedTime <= 0) {
    errors.push({
      field: 'estimatedTime',
      message: 'Estimated time must be a positive number (in minutes)',
      value: metadata.estimatedTime,
    });
  }

  // Prerequisites validation
  if (!Array.isArray(metadata.prerequisites)) {
    errors.push({
      field: 'prerequisites',
      message: 'Prerequisites must be an array',
      value: metadata.prerequisites,
    });
  } else {
    metadata.prerequisites.forEach((prereq: any, index: number) => {
      if (typeof prereq !== 'string') {
        errors.push({
          field: `prerequisites[${index}]`,
          message: 'Each prerequisite must be a string (content ID)',
          value: prereq,
        });
      }
    });
  }

  // Related topics validation
  if (!Array.isArray(metadata.relatedTopics)) {
    errors.push({
      field: 'relatedTopics',
      message: 'Related topics must be an array',
      value: metadata.relatedTopics,
    });
  } else {
    metadata.relatedTopics.forEach((topic: any, index: number) => {
      if (typeof topic !== 'string') {
        errors.push({
          field: `relatedTopics[${index}]`,
          message: 'Each related topic must be a string (content ID)',
          value: topic,
        });
      }
    });
  }

  // Tags validation
  if (!Array.isArray(metadata.tags)) {
    errors.push({
      field: 'tags',
      message: 'Tags must be an array',
      value: metadata.tags,
    });
  } else {
    metadata.tags.forEach((tag: any, index: number) => {
      if (typeof tag !== 'string') {
        errors.push({
          field: `tags[${index}]`,
          message: 'Each tag must be a string',
          value: tag,
        });
      }
    });
  }

  // Interview companies validation
  if (!Array.isArray(metadata.interviewCompanies)) {
    errors.push({
      field: 'interviewCompanies',
      message: 'Interview companies must be an array',
      value: metadata.interviewCompanies,
    });
  } else {
    metadata.interviewCompanies.forEach((company: any, index: number) => {
      if (!VALID_COMPANIES.includes(company)) {
        errors.push({
          field: `interviewCompanies[${index}]`,
          message: `Invalid company. Must be one of: ${VALID_COMPANIES.join(', ')}`,
          value: company,
        });
      }
    });
  }

  // Last updated validation
  if (!metadata.lastUpdated || typeof metadata.lastUpdated !== 'string') {
    errors.push({
      field: 'lastUpdated',
      message: 'Last updated is required and must be a string (ISO date)',
      value: metadata.lastUpdated,
    });
  } else {
    const date = new Date(metadata.lastUpdated);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'lastUpdated',
        message: 'Last updated must be a valid ISO date string',
        value: metadata.lastUpdated,
      });
    }
  }

  // Version validation
  if (!metadata.version || typeof metadata.version !== 'string') {
    errors.push({
      field: 'version',
      message: 'Version is required and must be a string',
      value: metadata.version,
    });
  }

  // Boolean flags validation
  if (typeof metadata.hasQuiz !== 'boolean') {
    errors.push({
      field: 'hasQuiz',
      message: 'hasQuiz must be a boolean',
      value: metadata.hasQuiz,
    });
  }

  if (typeof metadata.hasCodeExamples !== 'boolean') {
    errors.push({
      field: 'hasCodeExamples',
      message: 'hasCodeExamples must be a boolean',
      value: metadata.hasCodeExamples,
    });
  }

  if (typeof metadata.hasDiagrams !== 'boolean') {
    errors.push({
      field: 'hasDiagrams',
      message: 'hasDiagrams must be a boolean',
      value: metadata.hasDiagrams,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a partial metadata object (useful for updates)
 */
export function validatePartialMetadata(metadata: Partial<ContentMetadata>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Only validate fields that are present
  if (metadata.category !== undefined && !VALID_CATEGORIES.includes(metadata.category)) {
    errors.push({
      field: 'category',
      message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      value: metadata.category,
    });
  }

  if (metadata.difficulty !== undefined && !VALID_DIFFICULTIES.includes(metadata.difficulty)) {
    errors.push({
      field: 'difficulty',
      message: `Invalid difficulty. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
      value: metadata.difficulty,
    });
  }

  if (metadata.estimatedTime !== undefined && (typeof metadata.estimatedTime !== 'number' || metadata.estimatedTime <= 0)) {
    errors.push({
      field: 'estimatedTime',
      message: 'Estimated time must be a positive number (in minutes)',
      value: metadata.estimatedTime,
    });
  }

  if (metadata.interviewCompanies !== undefined) {
    metadata.interviewCompanies.forEach((company, index) => {
      if (!VALID_COMPANIES.includes(company)) {
        errors.push({
          field: `interviewCompanies[${index}]`,
          message: `Invalid company. Must be one of: ${VALID_COMPANIES.join(', ')}`,
          value: company,
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Creates a default metadata template
 */
export function createDefaultMetadata(overrides: Partial<ContentMetadata> = {}): ContentMetadata {
  return {
    id: overrides.id || '',
    slug: overrides.slug || '',
    title: overrides.title || { en: '', vi: '' },
    description: overrides.description || { en: '', vi: '' },
    category: overrides.category || 'javascript',
    difficulty: overrides.difficulty || 'beginner',
    estimatedTime: overrides.estimatedTime || 30,
    prerequisites: overrides.prerequisites || [],
    relatedTopics: overrides.relatedTopics || [],
    tags: overrides.tags || [],
    interviewCompanies: overrides.interviewCompanies || [],
    lastUpdated: overrides.lastUpdated || new Date().toISOString(),
    version: overrides.version || '1.0.0',
    hasQuiz: overrides.hasQuiz ?? false,
    hasCodeExamples: overrides.hasCodeExamples ?? false,
    hasDiagrams: overrides.hasDiagrams ?? false,
  };
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  const lines: string[] = [];

  if (result.errors.length > 0) {
    lines.push('Validation Errors:');
    result.errors.forEach((error) => {
      lines.push(`  - ${error.field}: ${error.message}`);
      if (error.value !== undefined) {
        lines.push(`    Current value: ${JSON.stringify(error.value)}`);
      }
    });
  }

  if (result.warnings.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push('Warnings:');
    result.warnings.forEach((warning) => {
      lines.push(`  - ${warning.field}: ${warning.message}`);
      if (warning.value !== undefined) {
        lines.push(`    Current value: ${JSON.stringify(warning.value)}`);
      }
    });
  }

  return lines.join('\n');
}
