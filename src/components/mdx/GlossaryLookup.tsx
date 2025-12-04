"use client";

import React, { useState, useEffect } from "react";
import { GlossaryService, GlossaryEntry } from "@/lib/i18n/GlossaryService";
import { useLocale } from "@/lib/i18n";
import { GlossaryTermTooltip } from "./Glossary";
import styles from "./GlossaryLookup.module.css";

interface GlossaryLookupProps {
  termIds?: string[]; // Specific term IDs to display
  category?: string; // Filter by category
  searchable?: boolean;
  className?: string;
}

export function GlossaryLookup({
  termIds,
  category,
  searchable = true,
  className = "",
}: GlossaryLookupProps) {
  const { locale } = useLocale();
  const [terms, setTerms] = useState<GlossaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category || "all"
  );
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load terms based on props
    let loadedTerms: GlossaryEntry[];

    if (termIds && termIds.length > 0) {
      loadedTerms = termIds
        .map((id) => GlossaryService.getTerm(id))
        .filter((term): term is GlossaryEntry => term !== null);
    } else if (category) {
      loadedTerms = GlossaryService.getTermsByCategory(category);
    } else {
      loadedTerms = GlossaryService.getAllTerms();
    }

    setTerms(loadedTerms);

    // Load categories
    const allCategories = GlossaryService.getCategories();
    setCategories(allCategories);
  }, [termIds, category]);

  const filteredTerms = terms.filter((term) => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTerm = term.term.toLowerCase().includes(query);
      const matchesDefinition =
        term.definition[locale].toLowerCase().includes(query) ||
        term.definition.en.toLowerCase().includes(query);

      if (!matchesTerm && !matchesDefinition) {
        return false;
      }
    }

    // Filter by category
    if (selectedCategory !== "all" && term.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // Group terms by initial letter
  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const initial = term.term[0].toUpperCase();
    if (!acc[initial]) {
      acc[initial] = [];
    }
    acc[initial].push(term);
    return acc;
  }, {} as { [key: string]: GlossaryEntry[] });

  const sortedInitials = Object.keys(groupedTerms).sort();

  return (
    <div className={`${styles.glossaryLookup} ${className}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {locale === "vi" ? "Từ điển thuật ngữ" : "Glossary"}
        </h2>
        <p className={styles.subtitle}>
          {locale === "vi"
            ? "Tra cứu các thuật ngữ kỹ thuật với định nghĩa song ngữ"
            : "Look up technical terms with bilingual definitions"}
        </p>
      </div>

      {searchable && (
        <div className={styles.controls}>
          <input
            type="text"
            placeholder={
              locale === "vi" ? "Tìm kiếm thuật ngữ..." : "Search terms..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label={locale === "vi" ? "Tìm kiếm thuật ngữ" : "Search terms"}
          />

          {!category && categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
              aria-label={locale === "vi" ? "Chọn danh mục" : "Select category"}
            >
              <option value="all">
                {locale === "vi" ? "Tất cả danh mục" : "All categories"}
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {filteredTerms.length === 0 ? (
        <div className={styles.empty}>
          {locale === "vi" ? "Không tìm thấy thuật ngữ nào" : "No terms found"}
        </div>
      ) : (
        <div className={styles.termsList}>
          {sortedInitials.map((initial) => (
            <div key={initial} className={styles.group}>
              <h3 className={styles.groupTitle}>{initial}</h3>
              <div className={styles.groupTerms}>
                {groupedTerms[initial].map((term) => (
                  <div key={term.id} className={styles.termCard}>
                    <div className={styles.termHeader}>
                      <h4 className={styles.termName}>{term.term}</h4>
                      {term.category && (
                        <span className={styles.termCategory}>
                          {term.category}
                        </span>
                      )}
                    </div>
                    <p className={styles.termDefinition}>
                      {term.definition[locale]}
                    </p>
                    {locale === "vi" && term.definition.en && (
                      <p className={styles.termAlternate}>
                        <strong>English:</strong> {term.definition.en}
                      </p>
                    )}
                    {locale === "en" && term.definition.vi && (
                      <p className={styles.termAlternate}>
                        <strong>Tiếng Việt:</strong> {term.definition.vi}
                      </p>
                    )}
                    {term.examples && term.examples.length > 0 && (
                      <div className={styles.examples}>
                        <strong className={styles.examplesTitle}>
                          {locale === "vi" ? "Ví dụ:" : "Examples:"}
                        </strong>
                        {term.examples.map((example, idx) => (
                          <code key={idx} className={styles.exampleCode}>
                            {example[locale]}
                          </code>
                        ))}
                      </div>
                    )}
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div className={styles.related}>
                        <strong className={styles.relatedTitle}>
                          {locale === "vi" ? "Liên quan:" : "Related:"}
                        </strong>
                        <div className={styles.relatedTerms}>
                          {term.relatedTerms.map((relatedId) => {
                            const relatedTerm =
                              GlossaryService.getTerm(relatedId);
                            return relatedTerm ? (
                              <span
                                key={relatedId}
                                className={styles.relatedTerm}
                              >
                                <GlossaryTermTooltip
                                  term={relatedTerm.term}
                                  definition={relatedTerm.definition}
                                  locale={locale}
                                />
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
