# Search UI Components

This directory contains the search UI components for the bilingual content platform. These components work together with the `SearchService` to provide a complete search experience with autocomplete, filtering, and pagination.

## Components

### SearchBar

A search input component with autocomplete suggestions.

**Features:**

- Real-time autocomplete suggestions
- Keyboard navigation (Arrow keys, Enter, Escape)
- Clear button
- Loading indicator
- Bilingual support (English/Vietnamese)
- Accessible (ARIA labels, keyboard navigation)

**Props:**

```typescript
interface SearchBarProps {
  locale?: Locale;
  placeholder?: string;
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  getSuggestions?: (partial: string) => Promise<string[]>;
  className?: string;
  autoFocus?: boolean;
}
```

**Example:**

```tsx
<SearchBar
  locale="en"
  onSearch={(query) => console.log("Search:", query)}
  getSuggestions={async (partial) => {
    return searchService.getSuggestions(partial, "en");
  }}
  autoFocus
/>
```

### SearchResults

Displays search results with highlighting and metadata.

**Features:**

- Query term highlighting in title, excerpt, and highlights
- Category and difficulty badges
- Tags display
- Relevance score
- Loading and empty states
- Click handling for navigation
- Bilingual support
- Accessible (keyboard navigation, ARIA roles)

**Props:**

```typescript
interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  locale?: Locale;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  isLoading?: boolean;
  totalResults?: number;
}
```

**Example:**

```tsx
<SearchResults
  results={searchResults}
  query="javascript closures"
  locale="en"
  onResultClick={(result) => {
    router.push(`/learn/${result.category}/${result.slug}`);
  }}
  isLoading={false}
  totalResults={42}
/>
```

### SearchFilters

Provides filtering options for search results with facet counts.

**Features:**

- Category filtering
- Difficulty level filtering
- Company filtering (interview focus)
- Tag filtering (popular tags)
- Content feature filters (has quiz, has diagrams)
- Expandable/collapsible interface
- Active filter count badge
- Clear all filters
- Facet counts (number of results per filter)
- Bilingual support
- Accessible (checkboxes, keyboard navigation)

**Props:**

```typescript
interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  facets?: {
    categories: Record<string, number>;
    difficulties: Record<string, number>;
    tags: Record<string, number>;
    companies: Record<string, number>;
  };
  locale?: Locale;
  className?: string;
}
```

**Example:**

```tsx
<SearchFilters
  filters={currentFilters}
  onFiltersChange={(newFilters) => setFilters(newFilters)}
  facets={facetedResults?.facets}
  locale="en"
/>
```

### SearchPagination

Pagination controls for search results.

**Features:**

- Page number buttons
- Previous/Next navigation
- Ellipsis for large page counts
- Current page indicator
- Results count display
- Disabled state for boundary pages
- Bilingual support
- Accessible (ARIA labels, keyboard navigation)

**Props:**

```typescript
interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  locale?: Locale;
  className?: string;
}
```

**Example:**

```tsx
<SearchPagination
  currentPage={1}
  totalPages={5}
  totalResults={42}
  resultsPerPage={10}
  onPageChange={(page) => setCurrentPage(page)}
  locale="en"
/>
```

## Complete Example

Here's a complete example of using all search components together:

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  SearchBar,
  SearchResults,
  SearchFilters,
  SearchPagination,
} from "@/components/search";
import { searchService } from "@/lib/search/SearchService";
import {
  SearchResult,
  SearchFilters as SearchFiltersType,
} from "@/types/search";
import { Locale } from "@/types/content";

const RESULTS_PER_PAGE = 10;

export default function SearchPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [facets, setFacets] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load search index
  useEffect(() => {
    const loadIndex = async () => {
      const response = await fetch(`/search-indices/${locale}.json`);
      const indexData = await response.json();
      await searchService.loadIndex(locale, indexData);
    };
    loadIndex();
  }, [locale]);

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchService.searchWithFacets(
          query,
          locale,
          filters
        );
        setResults(searchResults.results);
        setFacets(searchResults.facets);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, filters, locale]);

  // Pagination
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div>
      <SearchBar
        locale={locale}
        onSearch={setQuery}
        getSuggestions={(partial) =>
          searchService.getSuggestions(partial, locale)
        }
      />

      <div style={{ display: "flex", gap: "24px" }}>
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          facets={facets}
          locale={locale}
        />

        <div>
          <SearchResults
            results={paginatedResults}
            query={query}
            locale={locale}
            isLoading={isLoading}
            totalResults={results.length}
          />

          <SearchPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={results.length}
            resultsPerPage={RESULTS_PER_PAGE}
            onPageChange={setCurrentPage}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
```

## Styling

All components use CSS Modules for styling with the following features:

- **Responsive design**: Mobile-first approach with breakpoints
- **Dark mode support**: Automatic dark mode using `prefers-color-scheme`
- **Accessibility**: High contrast ratios, focus indicators
- **Animations**: Smooth transitions and loading states
- **Consistent design**: Follows the platform's design system

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance
- Alt text for icons

## Testing

To test the search components, visit `/test-search` in your browser. This page demonstrates all components working together with the search service.

## Requirements Covered

This implementation satisfies the following requirements from the spec:

- **7.1**: Full-text search across bilingual content
- **7.2**: Search with facets and filters
- **7.3**: Category, difficulty, and tag filtering
- **Pagination**: Search result pagination
- **Autocomplete**: Search suggestions
- **Highlighting**: Query term highlighting in results
- **Bilingual**: Vietnamese and English support
- **Accessibility**: WCAG 2.1 Level AA compliance
