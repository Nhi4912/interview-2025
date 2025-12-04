"use client";

import { useState } from "react";
import { SearchFilters as SearchFiltersType } from "@/types/search";
import { ContentCategory, Difficulty, Locale } from "@/types/content";
import styles from "./SearchFilters.module.css";

export interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  facets?: {
    categories: Record<string, number>;
    difficulties: Record<string, number>;
    tags: Record<string, number>;
    companies: Record<string, number>;
  };
  locale?: Locale;
  className?: string;
}

const CATEGORIES: ContentCategory[] = [
  "javascript",
  "typescript",
  "react",
  "nextjs",
  "css",
  "html",
  "web-apis",
  "computer-science",
  "algorithms",
  "system-design",
  "security",
  "performance",
  "testing",
  "tools",
];

const DIFFICULTIES: Difficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

const COMPANIES = ["google", "meta", "amazon", "microsoft", "grab"];

export function SearchFilters({
  filters,
  onFiltersChange,
  facets,
  locale = "en",
  className = "",
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryLabel = (category: string): string => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCompanyLabel = (company: string): string => {
    const labels: Record<string, string> = {
      google: "Google",
      meta: "Meta",
      amazon: "Amazon",
      microsoft: "Microsoft",
      grab: "Grab",
    };
    return labels[company] || company;
  };

  const toggleCategory = (category: ContentCategory) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, categories: updated });
  };

  const toggleDifficulty = (difficulty: Difficulty) => {
    const current = filters.difficulty || [];
    const updated = current.includes(difficulty)
      ? current.filter((d) => d !== difficulty)
      : [...current, difficulty];
    onFiltersChange({ ...filters, difficulty: updated });
  };

  const toggleCompany = (company: string) => {
    const current = filters.companies || [];
    const updated = current.includes(company)
      ? current.filter((c) => c !== company)
      : [...current, company];
    onFiltersChange({ ...filters, companies: updated });
  };

  const toggleTag = (tag: string) => {
    const current = filters.tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onFiltersChange({ ...filters, tags: updated });
  };

  const toggleHasQuiz = () => {
    onFiltersChange({
      ...filters,
      hasQuiz: filters.hasQuiz === undefined ? true : !filters.hasQuiz,
    });
  };

  const toggleHasDiagrams = () => {
    onFiltersChange({
      ...filters,
      hasDiagrams:
        filters.hasDiagrams === undefined ? true : !filters.hasDiagrams,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.difficulty?.length) count += filters.difficulty.length;
    if (filters.companies?.length) count += filters.companies.length;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.hasQuiz) count += 1;
    if (filters.hasDiagrams) count += 1;
    return count;
  };

  const activeCount = getActiveFilterCount();
  const topTags = facets?.tags
    ? Object.entries(facets.tags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    : [];

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className={styles.toggleIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h16M2 10h16M2 16h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className={styles.toggleText}>
            {locale === "vi" ? "Bộ lọc" : "Filters"}
          </span>
          {activeCount > 0 && (
            <span className={styles.badge}>{activeCount}</span>
          )}
        </button>
        {activeCount > 0 && (
          <button className={styles.clearButton} onClick={clearFilters}>
            {locale === "vi" ? "Xóa tất cả" : "Clear all"}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.content}>
          {/* Categories */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {locale === "vi" ? "Danh mục" : "Categories"}
            </h3>
            <div className={styles.checkboxGroup}>
              {CATEGORIES.map((category) => {
                const count = facets?.categories[category];
                const isChecked = filters.categories?.includes(category);
                return (
                  <label
                    key={category}
                    className={`${styles.checkbox} ${
                      isChecked ? styles.checkboxChecked : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(category)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>
                      {getCategoryLabel(category)}
                    </span>
                    {count !== undefined && (
                      <span className={styles.count}>({count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {locale === "vi" ? "Độ khó" : "Difficulty"}
            </h3>
            <div className={styles.checkboxGroup}>
              {DIFFICULTIES.map((difficulty) => {
                const count = facets?.difficulties[difficulty];
                const isChecked = filters.difficulty?.includes(difficulty);
                return (
                  <label
                    key={difficulty}
                    className={`${styles.checkbox} ${
                      isChecked ? styles.checkboxChecked : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDifficulty(difficulty)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                    {count !== undefined && (
                      <span className={styles.count}>({count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Companies */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {locale === "vi" ? "Công ty" : "Companies"}
            </h3>
            <div className={styles.checkboxGroup}>
              {COMPANIES.map((company) => {
                const count = facets?.companies[company];
                const isChecked = filters.companies?.includes(company);
                return (
                  <label
                    key={company}
                    className={`${styles.checkbox} ${
                      isChecked ? styles.checkboxChecked : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCompany(company)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>
                      {getCompanyLabel(company)}
                    </span>
                    {count !== undefined && (
                      <span className={styles.count}>({count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {topTags.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                {locale === "vi" ? "Thẻ phổ biến" : "Popular Tags"}
              </h3>
              <div className={styles.tagGroup}>
                {topTags.map(([tag, count]) => {
                  const isChecked = filters.tags?.includes(tag);
                  return (
                    <button
                      key={tag}
                      className={`${styles.tagButton} ${
                        isChecked ? styles.tagButtonActive : ""
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      <span className={styles.tagCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content Features */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              {locale === "vi" ? "Tính năng" : "Features"}
            </h3>
            <div className={styles.checkboxGroup}>
              <label
                className={`${styles.checkbox} ${
                  filters.hasQuiz ? styles.checkboxChecked : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.hasQuiz || false}
                  onChange={toggleHasQuiz}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxLabel}>
                  {locale === "vi" ? "Có bài kiểm tra" : "Has Quiz"}
                </span>
              </label>
              <label
                className={`${styles.checkbox} ${
                  filters.hasDiagrams ? styles.checkboxChecked : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.hasDiagrams || false}
                  onChange={toggleHasDiagrams}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxLabel}>
                  {locale === "vi" ? "Có sơ đồ" : "Has Diagrams"}
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
