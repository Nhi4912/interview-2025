import { LearningPath, LearningModule, LearningTopic } from '@/types';

/**
 * JSON Schema for learning path validation
 */
export const learningPathSchema = {
  type: 'object',
  required: ['id', 'title', 'description', 'targetRole', 'estimatedDuration', 'modules'],
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Unique identifier for the learning path (kebab-case)'
    },
    title: {
      type: 'object',
      required: ['en', 'vi'],
      properties: {
        en: { type: 'string', minLength: 1 },
        vi: { type: 'string', minLength: 1 }
      }
    },
    description: {
      type: 'object',
      required: ['en', 'vi'],
      properties: {
        en: { type: 'string', minLength: 1 },
        vi: { type: 'string', minLength: 1 }
      }
    },
    targetRole: {
      type: 'string',
      enum: ['frontend', 'fullstack', 'senior', 'staff']
    },
    estimatedDuration: {
      type: 'number',
      minimum: 1,
      description: 'Estimated duration in weeks'
    },
    modules: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['id', 'title', 'order', 'topics', 'estimatedTime'],
        properties: {
          id: { type: 'string', pattern: '^[a-z0-9-]+$' },
          title: {
            type: 'object',
            required: ['en', 'vi'],
            properties: {
              en: { type: 'string', minLength: 1 },
              vi: { type: 'string', minLength: 1 }
            }
          },
          order: { type: 'number', minimum: 1 },
          topics: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['contentId', 'order', 'required'],
              properties: {
                contentId: { type: 'string', minLength: 1 },
                order: { type: 'number', minimum: 1 },
                required: { type: 'boolean' },
                practiceExercises: {
                  type: 'array',
                  items: { type: 'string' }
                },
                quiz: { type: 'string' }
              }
            }
          },
          estimatedTime: {
            type: 'number',
            minimum: 0.5,
            description: 'Estimated time in hours'
          }
        }
      }
    },
    prerequisites: {
      type: 'array',
      items: { type: 'string' },
      default: []
    }
  }
} as const;

/**
 * Validates a learning path object against the schema
 */
export function validateLearningPath(data: unknown): data is LearningPath {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const path = data as Partial<LearningPath>;

  // Check required fields
  if (!path.id || !path.title || !path.description || !path.targetRole || 
      !path.estimatedDuration || !path.modules) {
    return false;
  }

  // Validate title and description have both languages
  if (!path.title.en || !path.title.vi || !path.description.en || !path.description.vi) {
    return false;
  }

  // Validate targetRole
  const validRoles = ['frontend', 'fullstack', 'senior', 'staff'];
  if (!validRoles.includes(path.targetRole)) {
    return false;
  }

  // Validate modules
  if (!Array.isArray(path.modules) || path.modules.length === 0) {
    return false;
  }

  for (const module of path.modules) {
    if (!validateModule(module)) {
      return false;
    }
  }

  return true;
}

function validateModule(module: unknown): module is LearningModule {
  if (!module || typeof module !== 'object') {
    return false;
  }

  const mod = module as Partial<LearningModule>;

  if (!mod.id || !mod.title || typeof mod.order !== 'number' || 
      !mod.topics || typeof mod.estimatedTime !== 'number') {
    return false;
  }

  if (!mod.title.en || !mod.title.vi) {
    return false;
  }

  if (!Array.isArray(mod.topics) || mod.topics.length === 0) {
    return false;
  }

  for (const topic of mod.topics) {
    if (!validateTopic(topic)) {
      return false;
    }
  }

  return true;
}

function validateTopic(topic: unknown): topic is LearningTopic {
  if (!topic || typeof topic !== 'object') {
    return false;
  }

  const t = topic as Partial<LearningTopic>;

  if (!t.contentId || typeof t.order !== 'number' || typeof t.required !== 'boolean') {
    return false;
  }

  return true;
}
