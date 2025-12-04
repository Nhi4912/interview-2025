"use client";

import { SearchResult } from "@/types/search";
import { Locale } from "@/types/content";
import styles from "./SearchResults.module.css";

export interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  locale?: Locale;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
  isLoading?: boolean;
  totalResults?: number;
}

export function SearchResults({
  results,
  query,
  locale = "en",
  onResultClick,
  className = "",
  isLoading = false,
  totalResults,
}: SearchResultsProps) {
  const highlightText = (text: string, query: string): JSX.Element => {
    if (!query.trim()) {
      return <>{text}</>;
    }

    const queryTokens = query
      .toLowerCase()
      .split(/[\s\-_.,;:!?()[\]{}'"<>\/\\]+/)
      .filter((token) => token.length > 0);

    let highlightedText = text;
    const matches: Array<{ start: number; end: number }> = [];

    // Find all matches
    queryTokens.forEach((token) => {
      const regex = new RegExp(token, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    });

    if (matches.length === 0) {
      return <>{text}</>;
    }

    // Sort and merge overlapping matches
    matches.sort((a, b) => a.start - b.start);
    const mergedMatches: Array<{ start: number; end: number }> = [];
    let current = matches[0];

    for (let i = 1; i < matches.length; i++) {
      if (matches[i].start <= current.end) {
        current.end = Math.max(current.end, matches[i].end);
      } else {
        mergedMatches.push(current);
        current = matches[i];
      }
    }
    mergedMatches.push(current);

    // Build highlighted JSX
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    mergedMatches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, match.start)}
          </span>
        );
      }
      // Add highlighted match
      parts.push(
        <mark key={`mark-${index}`} className={styles.highlight}>
          {text.substring(match.start, match.end)}
        </mark>
      );
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return styles.difficultyBeginner;
      case "intermediate":
        return styles.difficultyIntermediate;
      case "advanced":
        return styles.difficultyAdvanced;
      case "expert":
        return styles.difficultyExpert;
      default:
        return "";
    }
  };

  const getCategoryLabel = (category: string): string => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}>
            <svg
              className={styles.spinner}
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset="50"
              />
            </svg>
          </div>
          <p className={styles.loadingText}>
            {locale === "vi" ? "Đang tìm kiếm..." : "Searching..."}
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="28"
                cy="28"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M42 42L56 56"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>
            {locale === "vi" ? "Không tìm thấy kết quả" : "No results found"}
          </h3>
          <p className={styles.emptyDescription}>
            {locale === "vi"
              ? `Không tìm thấy kết quả cho "${query}". Hãy thử tìm kiếm với từ khóa khác.`
              : `No results found for "${query}". Try searching with different keywords.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {totalResults !== undefined && (
        <div className={styles.header}>
          <p className={styles.resultCount}>
            {locale === "vi"
              ? `Tìm thấy ${totalResults} kết quả`
              : `Found ${totalResults} result${totalResults !== 1 ? "s" : ""}`}
          </p>
        </div>
      )}

      <div className={styles.results}>
        {results.map((result, index) => (
          <article
            key={`${result.contentId}-${index}`}
            className={styles.result}
            onClick={() => onResultClick?.(result)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onResultClick?.(result);
              }
            }}
          >
            <div className={styles.resultHeader}>
              <h3 className={styles.resultTitle}>
                {highlightText(result.title, query)}
              </h3>
              <div className={styles.resultMeta}>
                <span className={styles.category}>
                  {getCategoryLabel(result.category)}
                </span>
                <span
                  className={`${styles.difficulty} ${getDifficultyColor(
                    result.difficulty
                  )}`}
                >
                  {result.difficulty}
                </span>
              </div>
            </div>

            {result.excerpt && (
              <p className={styles.excerpt}>
                {highlightText(result.excerpt, query)}
              </p>
            )}

            {result.highlights && result.highlights.length > 0 && (
              <div className={styles.highlights}>
                {result.highlights.slice(0, 2).map((highlight, idx) => (
                  <div key={idx} className={styles.highlightItem}>
                    {highlightText(highlight, query)}
                  </div>
                ))}
              </div>
            )}

            {result.tags && result.tags.length > 0 && (
              <div className={styles.tags}>
                {result.tags.slice(0, 5).map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.resultFooter}>
              <span className={styles.slug}>{result.slug}</span>
              <span className={styles.relevance}>
                {Math.round(result.relevanceScore * 100)}% match
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
