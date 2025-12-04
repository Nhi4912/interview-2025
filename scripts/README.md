# Content Migration Utilities

This directory contains utilities for migrating existing markdown content from `docs/` to the new bilingual MDX structure in `content/en/` and `content/vi/`.

## Scripts

### 1. migrate-content.ts

Converts existing `docs/*.md` files to MDX format with proper metadata.

**Features:**
- Converts markdown to MDX with frontmatter metadata
- Generates content IDs and slugs
- Infers metadata (difficulty, tags, companies, etc.)
- Creates parallel English and Vietnamese structures
- Updates internal links
- Validates link integrity

**Usage:**
```bash
npm run migrate:content
```

**Output:**
- Migrated MDX files in `content/en/` and `content/vi/`
- `migration-mapping.json` - Maps old paths to new paths and content IDs
- `link-validation-report.json` - Reports on link validation

### 2. validate-migration.ts

Validates migrated content for completeness and correctness.

**Features:**
- Validates metadata schema compliance
- Checks internal link integrity
- Validates content structure
- Checks bilingual consistency
- Generates detailed validation report

**Usage:**
```bash
npm run migrate:validate
```

**Output:**
- Console output with validation results
- `validation-report.json` - Detailed validation report

### 3. update-prerequisites.ts

Analyzes content relationships and updates prerequisites and related topics.

**Features:**
- Analyzes content references
- Infers prerequisites based on difficulty and references
- Infers related topics based on tags and references
- Updates metadata in both English and Vietnamese files

**Usage:**
```bash
npm run migrate:update-prerequisites
```

## Migration Workflow

Follow these steps to migrate content:

### Step 1: Run Migration

```bash
npm run migrate:content
```

This will:
1. Convert all markdown files to MDX
2. Generate metadata for each file
3. Create English and Vietnamese versions
4. Update internal links
5. Generate migration mapping

### Step 2: Validate Migration

```bash
npm run migrate:validate
```

This will:
1. Validate all metadata
2. Check link integrity
3. Validate content structure
4. Check bilingual consistency
5. Generate validation report

### Step 3: Update Prerequisites

```bash
npm run migrate:update-prerequisites
```

This will:
1. Analyze content relationships
2. Infer prerequisites
3. Infer related topics
4. Update metadata

### Step 4: Manual Review

1. Review `migration-mapping.json` for content ID mappings
2. Review `link-validation-report.json` for broken links
3. Review `validation-report.json` for validation issues
4. Manually fix any issues identified

### Step 5: Translate Vietnamese Content

1. Review files in `content/vi/`
2. Translate titles, descriptions, and content
3. Keep technical terms consistent with glossary
4. Validate translations

## Generated Files

### migration-mapping.json

Maps old file paths to new paths and content IDs:

```json
[
  {
    "oldPath": "docs/01-javascript-fundamentals/03-closures.md",
    "newPath": "content/en/javascript/closures.mdx",
    "contentId": "javascript-closures",
    "metadata": { ... }
  }
]
```

### link-validation-report.json

Reports on link validation:

```json
{
  "totalFiles": 150,
  "validLinks": 450,
  "brokenLinks": 12,
  "broken": [
    {
      "file": "content/en/javascript/closures.mdx",
      "line": 0,
      "oldLink": "../react/hooks.md",
      "newLink": "../react/hooks.mdx"
    }
  ]
}
```

### validation-report.json

Detailed validation report:

```json
{
  "totalFiles": 300,
  "validFiles": 285,
  "invalidFiles": 15,
  "results": [
    {
      "file": "content/en/javascript/closures.mdx",
      "valid": false,
      "errors": ["[Metadata] Missing required field: category"],
      "warnings": ["[Structure] Missing main title heading"]
    }
  ],
  "summary": {
    "metadataErrors": 5,
    "linkErrors": 8,
    "structureErrors": 2,
    "bilingualErrors": 10
  }
}
```

## Metadata Schema

Each MDX file should have the following frontmatter:

```yaml
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
```

## Category Mapping

The migration script maps docs folders to content categories:

| Docs Folder | Content Category |
|-------------|------------------|
| 01-javascript-fundamentals | javascript |
| 02-typescript | typescript |
| 03-react | react |
| 04-nextjs | nextjs |
| 05-security | security |
| 06-html | html |
| 06-web-apis | web-apis |
| 07-css | css |
| 08-performance | performance |
| 09-system-design | system-design |
| 10-computer-science | computer-science |
| 11-interview-practice | interview-prep |
| 12-visual-learning | lessons |
| 13-tools-ecosystem | tools |
| 14-accessibility | html-css |
| 15-advanced-topics | browser |
| 16-theoretical-foundations | computer-science |
| 17-frontend-theory | javascript |
| 18-advanced-theory | algorithms |
| 19-expert-topics | system-design |

## Difficulty Inference

The migration script infers difficulty based on:

- File name patterns (basic, fundamental, advanced, expert, theory)
- File numbering (00-01 = beginner, higher = advanced)
- Content analysis (keywords like "advanced", "complex")

## Troubleshooting

### Issue: Broken Links

**Solution:** Review `link-validation-report.json` and manually fix broken links in the migrated files.

### Issue: Missing Metadata

**Solution:** Review `validation-report.json` and add missing metadata fields.

### Issue: Incorrect Category

**Solution:** Manually update the category in the frontmatter and re-run validation.

### Issue: Duplicate Content IDs

**Solution:** Manually update content IDs to ensure uniqueness.

## Manual Tasks After Migration

1. **Translate Vietnamese Content**
   - Translate titles and descriptions
   - Translate main content
   - Keep technical terms consistent

2. **Review Prerequisites**
   - Verify inferred prerequisites are correct
   - Add missing prerequisites
   - Remove incorrect prerequisites

3. **Review Related Topics**
   - Verify inferred related topics are correct
   - Add missing related topics
   - Remove incorrect related topics

4. **Fix Broken Links**
   - Update links to point to new MDX files
   - Update anchor links if headings changed
   - Remove links to non-existent content

5. **Add Interactive Components**
   - Add `<CodeExample>` components for code blocks
   - Add `<Quiz>` components for practice problems
   - Add `<Diagram>` components for visualizations

6. **Enhance Content**
   - Add missing diagrams
   - Add code examples
   - Add quizzes and practice problems
   - Add glossary terms

## Next Steps

After migration is complete:

1. Update the content service to use the new structure
2. Update the search index builder
3. Update the learning path configurations
4. Test the content rendering
5. Deploy the updated content

## Notes

- The migration creates Vietnamese placeholders (copies of English content)
- Manual translation is required for Vietnamese content
- Prerequisites and related topics are inferred and may need manual review
- Link validation may report false positives for external links
- Always backup the original `docs/` directory before migration
