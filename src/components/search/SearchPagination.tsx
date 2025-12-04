"use client";

import { Locale } from "@/types/content";
import styles from "./SearchPagination.module.css";

export interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
  locale?: Locale;
  className?: string;
}

export function SearchPagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
  locale = "en",
  className = "",
}: SearchPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.info}>
        <span className={styles.infoText}>
          {locale === "vi"
            ? `Hiển thị ${startResult}-${endResult} trong ${totalResults} kết quả`
            : `Showing ${startResult}-${endResult} of ${totalResults} results`}
        </span>
      </div>

      <nav className={styles.navigation} aria-label="Pagination">
        <button
          className={`${styles.button} ${styles.navButton}`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label={locale === "vi" ? "Trang trước" : "Previous page"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16L6 10L12 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.navButtonText}>
            {locale === "vi" ? "Trước" : "Previous"}
          </span>
        </button>

        <div className={styles.pages}>
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                className={`${styles.button} ${styles.pageButton} ${
                  page === currentPage ? styles.pageButtonActive : ""
                }`}
                onClick={() => handlePageClick(page)}
                aria-label={`${locale === "vi" ? "Trang" : "Page"} ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          className={`${styles.button} ${styles.navButton}`}
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label={locale === "vi" ? "Trang sau" : "Next page"}
        >
          <span className={styles.navButtonText}>
            {locale === "vi" ? "Sau" : "Next"}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 4L14 10L8 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}
