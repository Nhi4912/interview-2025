# Bilingual Content Structure

This directory contains all learning content for the frontend interview preparation platform in both English and Vietnamese.

## Directory Structure

```
content/
├── en/                          # English content
│   ├── javascript/              # JavaScript fundamentals and advanced topics
│   ├── typescript/              # TypeScript content
│   ├── react/                   # React framework content
│   ├── nextjs/                  # Next.js framework content
│   ├── css/                     # CSS and styling
│   ├── html/                    # HTML content
│   ├── web-apis/                # Browser and Web APIs
│   ├── computer-science/        # CS fundamentals
│   ├── algorithms/              # Algorithm content
│   ├── system-design/           # System design topics
│   ├── security/                # Web security
│   ├── performance/             # Performance optimization
│   ├── testing/                 # Testing strategies
│   ├── tools/                   # Development tools
│   ├── interview-prep/          # Interview preparation
│   ├── learning-paths/          # Structured learning paths
│   └── lessons/                 # Individual lessons
├── vi/                          # Vietnamese content (mirrors en/)
│   └── [same structure as en/]
└── shared/                      # Language-agnostic assets
    ├── code-examples/           # Shared code examples
    ├── diagrams/                # Shared diagrams and images
    └── visualizations/          # Shared visualization assets
```

## Content Organization

### Language Directories (en/ and vi/)

Each language directory contains the same category structure to ensure parallel content organization. Content files are written in MDX format (Markdown with JSX components).

### Shared Directory

The `shared/` directory contains assets that are language-agnostic:
- **code-examples/**: Runnable code snippets that work in both languages
- **diagrams/**: Visual diagrams (Mermaid, images) that don't require translation
- **visualizations/**: Interactive visualizations and animations

## Content File Format

Each content file should be in MDX format with frontmatter metadata:

```mdx
---
id: unique-content-id
slug: url-friendly-slug
title:
  en: "English Title"
  vi: "Vietnamese Title"
description:
  en: "English description"
  vi: "Vietnamese description"
category: javascript
difficulty: intermediate
estimatedTime: 45
prerequisites: ["prerequisite-id-1", "prerequisite-id-2"]
relatedTopics: ["related-topic-id-1"]
tags: ["tag1", "tag2"]
interviewCompanies: ["google", "meta"]
lastUpdated: "2024-01-01T00:00:00.000Z"
version: "1.0.0"
hasQuiz: true
hasCodeExamples: true
hasDiagrams: true
---

# Content goes here
```

## Metadata Fields

- **id**: Unique identifier for the content
- **slug**: URL-friendly identifier
- **title**: Bilingual title object
- **description**: Bilingual description object
- **category**: Content category (see valid categories below)
- **difficulty**: beginner | intermediate | advanced | expert
- **estimatedTime**: Reading time in minutes
- **prerequisites**: Array of content IDs that should be completed first
- **relatedTopics**: Array of related content IDs
- **tags**: Array of searchable tags
- **interviewCompanies**: Companies where this topic is relevant
- **lastUpdated**: ISO date string
- **version**: Semantic version
- **hasQuiz**: Boolean indicating if content includes a quiz
- **hasCodeExamples**: Boolean indicating if content includes code examples
- **hasDiagrams**: Boolean indicating if content includes diagrams

## Valid Categories

- javascript
- typescript
- react
- nextjs
- css
- html
- web-apis
- computer-science
- algorithms
- system-design
- security
- performance
- testing
- tools

## Valid Interview Companies

- google
- meta
- amazon
- microsoft
- grab

## Content Guidelines

1. **Parallel Structure**: Maintain identical directory and file structure across en/ and vi/
2. **Metadata Consistency**: Ensure metadata is complete and accurate
3. **Translation Status**: If Vietnamese translation is incomplete, the system will fall back to English
4. **Shared Assets**: Use the shared/ directory for language-agnostic content
5. **Prerequisites**: Always specify prerequisites to enable proper learning path navigation
6. **Related Topics**: Link related content to improve discoverability

## Adding New Content

1. Create the MDX file in the appropriate category directory under `en/`
2. Add complete frontmatter metadata
3. Write the content in English
4. Create the corresponding file in `vi/` with Vietnamese translation
5. Validate metadata using the validation utilities
6. Test that all links and references work correctly

## Validation

Use the metadata validation utilities to ensure content meets schema requirements:

```typescript
import { validateContentMetadata } from '@/lib/content/metadata-validator';

const result = validateContentMetadata(metadata);
if (!result.valid) {
  console.error(formatValidationErrors(result));
}
```
