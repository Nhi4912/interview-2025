# Search Index System

This directory contains the search indexing system for the bilingual content platform.

## Overview

The search index builder processes all content files (MDX/MD) and creates optimized search indices for fast full-text search across both English and Vietnamese content.

## Features

- **Bilingual Support**: Separate indices for English (`en`) and Vietnamese (`vi`) content
- **Token-based Indexing**: Extracts and indexes searchable tokens from content
- **Inverted Index**: Fast lookups using token-to-document mapping
- **Faceted Search Support**: Pre-built indices for categories, tags, and difficulty levels
- **Stop Word Filtering**: Removes common words to improve search quality
- **Content Cleaning**: Strips MDX syntax, code blocks, and special characters
- **Serialization**: JSON-based storage for fast loading

## Architecture

### SearchIndexBuilder

The main class responsible for building search indices.

```typescript
import { searchIndexBuilder } from "@/lib/search";

// Build index for a specific locale
const index = await searchIndexBuilder.buildIndex("en");

// Build and save all indices
await searchIndexBuilder.buildAllIndices("public/search-indices");
```

### Index Structure

```typescript
interface SearchIndex {
  version: string;
  locale: Locale;
  lastBuilt: string;
  documents: SearchDocument[];
  tokenMap: Map<string, Set<string>>; // token -> document IDs
  categoryMap: Map<string, string[]>; // category -> document IDs
  tagMap: Map<string, string[]>; // tag -> document IDs
  difficultyMap: Map<string, string[]>; // difficulty -> document IDs
}
```

### SearchDocument

Each document in the index contains:

```typescript
interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string; // Excerpt (first 500 chars)
  category: ContentCategory;
  difficulty: string;
  tags: string[];
  tokens: string[]; // Searchable tokens
  metadata: ContentMetadata; // Full metadata
}
```

## Usage

### Building Indices

#### Via npm script (recommended):

```bash
npm run build:search-index
```

#### Programmatically:

```typescript
import { searchIndexBuilder } from "@/lib/search";

// Build all indices
await searchIndexBuilder.buildAllIndices();

// Build specific locale
const enIndex = await searchIndexBuilder.buildIndex("en");
const viIndex = await searchIndexBuilder.buildIndex("vi");

// Save to custom location
await searchIndexBuilder.saveIndex(enIndex, "custom/path/en.json");
```

### Loading Indices

```typescript
import { searchIndexBuilder } from "@/lib/search";

// Load from file
const index = await searchIndexBuilder.loadIndex(
  "public/search-indices/en.json"
);

if (index) {
  console.log(`Loaded ${index.documents.length} documents`);
}
```

### Serialization

Indices are automatically serialized to JSON format for storage:

```typescript
// Serialize for storage
const serialized = searchIndexBuilder.serializeIndex(index);
fs.writeFileSync("index.json", JSON.stringify(serialized));

// Deserialize from storage
const loaded = JSON.parse(fs.readFileSync("index.json", "utf-8"));
const index = searchIndexBuilder.deserializeIndex(loaded);
```

## Token Extraction

The indexer extracts tokens from:

1. **Title**: Content title in the current locale
2. **Description**: Content description in the current locale
3. **Content**: Cleaned markdown/MDX content (first 500 chars)
4. **Tags**: All tags associated with the content

### Token Processing

1. Convert to lowercase
2. Split by non-word characters
3. Filter out:
   - Tokens shorter than 3 characters
   - Stop words (common English and Vietnamese words)
   - Duplicates

### Stop Words

Common words excluded from indexing:

- **English**: the, be, to, of, and, a, in, that, have, etc.
- **Vietnamese**: và, của, có, trong, là, được, cho, với, để, các, etc.

## Content Cleaning

Before indexing, content is cleaned to remove:

- MDX import statements
- Code blocks (```and`)
- HTML/JSX tags
- Markdown links (keeps text)
- Markdown images
- Markdown headers (#)
- Special characters (\*, \_, ~, `)

## Index Files

Built indices are stored in `public/search-indices/`:

```
public/
└── search-indices/
    ├── en.json    # English search index
    └── vi.json    # Vietnamese search index
```

## Performance

- **Build Time**: ~1-2 seconds per 100 documents
- **Index Size**: ~50-100KB per 100 documents (compressed)
- **Load Time**: <50ms for typical index sizes

## Integration with Next.js

### Build-time Generation

Add to `package.json`:

```json
{
  "scripts": {
    "build": "npm run build:search-index && next build"
  }
}
```

### Runtime Loading

```typescript
// In a Next.js API route or server component
import { searchIndexBuilder } from "@/lib/search";

export async function GET() {
  const index = await searchIndexBuilder.loadIndex(
    "public/search-indices/en.json"
  );

  return Response.json({
    documentCount: index?.documents.length || 0,
    tokenCount: index?.tokenMap.size || 0,
  });
}
```

## Future Enhancements

- [ ] Incremental index updates (only rebuild changed files)
- [ ] Fuzzy search support
- [ ] Phrase search support
- [ ] Search result ranking/scoring
- [ ] Search analytics and query logging
- [ ] Compressed index format for faster loading
- [ ] Web Worker support for client-side search

## Related Files

- `src/lib/search/SearchIndexBuilder.ts` - Main index builder
- `src/types/search.ts` - TypeScript type definitions
- `scripts/build-search-index.ts` - Build script
- `src/lib/content/ContentService.ts` - Content service (uses indices)

## Requirements

This implementation satisfies requirements:

- **7.1**: Full-text search across bilingual content
- **7.2**: Search with language indicators and filtering
- **8.2**: Content validation and index building
