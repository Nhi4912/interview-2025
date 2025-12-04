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
  FacetedSearchResult,
} from "@/types/search";
import { Locale } from "@/types/content";
import styles from "./page.module.css";

const RESULTS_PER_PAGE = 10;

export default function TestSearchPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [facetedResults, setFacetedResults] =
    useState<FacetedSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexLoaded, setIndexLoaded] = useState(false);

  // Load search index on mount
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch(`/search-indices/${locale}.json`);
        if (response.ok) {
          const indexData = await response.json();
          await searchService.loadIndex(locale, indexData);
          setIndexLoaded(true);
        } else {
          console.error("Failed to load search index");
        }
      } catch (error) {
        console.error("Error loading search index:", error);
      }
    };

    loadIndex();
  }, [locale]);

  // Perform search when query or filters change
  useEffect(() => {
    const performSearch = async () => {
      if (!indexLoaded || !query.trim()) {
        setSearchResults([]);
        setFacetedResults(null);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchService.searchWithFacets(
          query,
          locale,
          filters
        );
        setFacetedResults(results);
        setSearchResults(results.results);
        setCurrentPage(1); // Reset to first page on new search
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setFacetedResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters, locale, indexLoaded]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
  };

  const getSuggestions = async (partial: string): Promise<string[]> => {
    if (!indexLoaded) return [];
    return searchService.getSuggestions(partial, locale);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log("Result clicked:", result);
    // Navigate to content page
    // router.push(`/learn/${result.category}/${result.slug}`);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Paginate results
  const totalResults = searchResults.length;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {locale === "vi" ? "Tìm kiếm nội dung" : "Search Content"}
        </h1>
        <p className={styles.description}>
          {locale === "vi"
            ? "Tìm kiếm trong hàng trăm bài học về JavaScript, React, TypeScript và nhiều hơn nữa"
            : "Search through hundreds of lessons on JavaScript, React, TypeScript, and more"}
        </p>

        <div className={styles.languageToggle}>
          <button
            className={`${styles.langButton} ${
              locale === "en" ? styles.langButtonActive : ""
            }`}
            onClick={() => setLocale("en")}
          >
            English
          </button>
          <button
            className={`${styles.langButton} ${
              locale === "vi" ? styles.langButtonActive : ""
            }`}
            onClick={() => setLocale("vi")}
          >
            Tiếng Việt
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <SearchBar
          locale={locale}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          getSuggestions={getSuggestions}
          autoFocus
        />
      </div>

      {!indexLoaded && (
        <div className={styles.indexLoading}>
          <p>
            {locale === "vi"
              ? "Đang tải chỉ mục tìm kiếm..."
              : "Loading search index..."}
          </p>
        </div>
      )}

      {indexLoaded && query && (
        <div className={styles.content}>
          <aside className={styles.sidebar}>
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              facets={facetedResults?.facets}
              locale={locale}
            />
          </aside>

          <main className={styles.main}>
            <SearchResults
              results={paginatedResults}
              query={query}
              locale={locale}
              onResultClick={handleResultClick}
              isLoading={isLoading}
              totalResults={totalResults}
            />

            {totalResults > 0 && (
              <SearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={totalResults}
                resultsPerPage={RESULTS_PER_PAGE}
                onPageChange={handlePageChange}
                locale={locale}
              />
            )}
          </main>
        </div>
      )}

      {indexLoaded && !query && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="35"
                cy="35"
                r="25"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M52 52L70 70"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>
            {locale === "vi" ? "Bắt đầu tìm kiếm" : "Start searching"}
          </h2>
          <p className={styles.emptyDescription}>
            {locale === "vi"
              ? "Nhập từ khóa để tìm kiếm nội dung học tập"
              : "Enter keywords to search for learning content"}
          </p>
        </div>
      )}
    </div>
  );
}
