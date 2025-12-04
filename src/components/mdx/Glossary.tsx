"use client";

import { useState, useRef, useEffect } from "react";
import { GlossaryTerm, Locale } from "@/types/content";

export interface GlossaryProps {
  terms: GlossaryTerm[];
  locale?: Locale;
  inline?: boolean;
  className?: string;
}

export interface GlossaryTermProps {
  term: string;
  definition: {
    en: string;
    vi: string;
  };
  locale?: Locale;
  detailsUrl?: string;
}

export function GlossaryTermTooltip({
  term,
  definition,
  locale = "en",
  detailsUrl,
}: GlossaryTermProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const termRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && termRef.current && tooltipRef.current) {
      const termRect = termRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - termRect.bottom;
      const spaceAbove = termRect.top;

      // Position tooltip above if not enough space below
      if (
        spaceBelow < tooltipRect.height + 10 &&
        spaceAbove > tooltipRect.height + 10
      ) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isVisible]);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  const currentDefinition = definition[locale] || definition.en;
  const alternateLocale = locale === "en" ? "vi" : "en";
  const alternateDefinition = definition[alternateLocale];

  return (
    <span className="glossary-term-wrapper">
      <span
        ref={termRef}
        className="glossary-term"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="button"
        aria-label={`Definition of ${term}`}
      >
        {term}
      </span>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`glossary-tooltip ${position}`}
          role="tooltip"
        >
          <div className="glossary-tooltip-header">
            <strong>{term}</strong>
          </div>
          <div className="glossary-tooltip-content">
            <p className="glossary-definition">{currentDefinition}</p>
            {alternateDefinition && (
              <p className="glossary-alternate">
                <em>
                  {alternateLocale === "vi" ? "Tiếng Việt" : "English"}:{" "}
                  {alternateDefinition}
                </em>
              </p>
            )}
          </div>
          {detailsUrl && (
            <div className="glossary-tooltip-footer">
              <a href={detailsUrl} className="glossary-details-link">
                Learn more →
              </a>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .glossary-term-wrapper {
          position: relative;
          display: inline;
        }

        .glossary-term {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-style: dotted;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          cursor: help;
          font-weight: 500;
        }

        .glossary-term:hover,
        .glossary-term:focus {
          color: #1d4ed8;
          text-decoration-style: solid;
          outline: none;
        }

        .glossary-tooltip {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          max-width: 400px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 0;
          animation: fadeIn 0.2s ease-in-out;
        }

        .glossary-tooltip.bottom {
          top: calc(100% + 8px);
        }

        .glossary-tooltip.top {
          bottom: calc(100% + 8px);
        }

        .glossary-tooltip::before {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }

        .glossary-tooltip.bottom::before {
          top: -8px;
          border-bottom: 8px solid white;
        }

        .glossary-tooltip.top::before {
          bottom: -8px;
          border-top: 8px solid white;
        }

        .glossary-tooltip-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 8px 8px 0 0;
          font-size: 0.875rem;
        }

        .glossary-tooltip-content {
          padding: 1rem;
        }

        .glossary-definition {
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.5;
          color: #374151;
        }

        .glossary-alternate {
          margin: 0.75rem 0 0 0;
          font-size: 0.8125rem;
          line-height: 1.4;
          color: #6b7280;
          padding-top: 0.75rem;
          border-top: 1px solid #f3f4f6;
        }

        .glossary-tooltip-footer {
          padding: 0.5rem 1rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0 0 8px 8px;
        }

        .glossary-details-link {
          font-size: 0.8125rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }

        .glossary-details-link:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 640px) {
          .glossary-tooltip {
            max-width: calc(100vw - 2rem);
          }
        }
      `}</style>
    </span>
  );
}

export function Glossary({
  terms,
  locale = "en",
  inline = false,
  className = "",
}: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const filteredTerms = terms.filter((term) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      term.term.toLowerCase().includes(query) ||
      term.definition.en.toLowerCase().includes(query) ||
      term.definition.vi.toLowerCase().includes(query)
    );
  });

  const toggleTerm = (term: string) => {
    const newExpanded = new Set(expandedTerms);
    if (newExpanded.has(term)) {
      newExpanded.delete(term);
    } else {
      newExpanded.add(term);
    }
    setExpandedTerms(newExpanded);
  };

  if (inline) {
    return (
      <div className={`glossary-inline ${className}`}>
        {terms.map((term, index) => (
          <span key={index}>
            <GlossaryTermTooltip
              term={term.term}
              definition={term.definition}
              locale={locale}
            />
            {index < terms.length - 1 && ", "}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`glossary-container ${className}`}>
      <div className="glossary-header">
        <h3 className="glossary-title">
          {locale === "vi" ? "Thuật ngữ" : "Glossary"}
        </h3>
        <p className="glossary-subtitle">
          {locale === "vi"
            ? "Các thuật ngữ kỹ thuật được sử dụng trong nội dung này"
            : "Technical terms used in this content"}
        </p>
      </div>

      {terms.length > 5 && (
        <div className="glossary-search">
          <input
            type="text"
            placeholder={
              locale === "vi" ? "Tìm kiếm thuật ngữ..." : "Search terms..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glossary-search-input"
            aria-label={locale === "vi" ? "Tìm kiếm thuật ngữ" : "Search terms"}
          />
        </div>
      )}

      <div className="glossary-list">
        {filteredTerms.length === 0 ? (
          <div className="glossary-empty">
            {locale === "vi"
              ? "Không tìm thấy thuật ngữ nào"
              : "No terms found"}
          </div>
        ) : (
          filteredTerms.map((term, index) => {
            const isExpanded = expandedTerms.has(term.term);
            const currentDefinition =
              term.definition[locale] || term.definition.en;
            const alternateLocale = locale === "en" ? "vi" : "en";
            const alternateDefinition = term.definition[alternateLocale];

            return (
              <div key={index} className="glossary-item">
                <button
                  className="glossary-item-header"
                  onClick={() => toggleTerm(term.term)}
                  aria-expanded={isExpanded}
                >
                  <span className="glossary-item-term">{term.term}</span>
                  <span className="glossary-item-icon">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>

                {isExpanded && (
                  <div className="glossary-item-content">
                    <p className="glossary-item-definition">
                      {currentDefinition}
                    </p>
                    {alternateDefinition && (
                      <p className="glossary-item-alternate">
                        <strong>
                          {alternateLocale === "vi" ? "Tiếng Việt" : "English"}:
                        </strong>{" "}
                        {alternateDefinition}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .glossary-container {
          margin: 2rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #f9fafb;
          overflow: hidden;
        }

        .glossary-header {
          padding: 1.5rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .glossary-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .glossary-subtitle {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .glossary-search {
          padding: 1rem 1.5rem;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .glossary-search-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .glossary-search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .glossary-list {
          padding: 0.5rem;
        }

        .glossary-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          overflow: hidden;
        }

        .glossary-item:last-child {
          margin-bottom: 0;
        }

        .glossary-item-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: white;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s;
        }

        .glossary-item-header:hover {
          background: #f9fafb;
        }

        .glossary-item-term {
          font-weight: 600;
          color: #2563eb;
          font-size: 0.9375rem;
        }

        .glossary-item-icon {
          font-size: 1.25rem;
          color: #6b7280;
          font-weight: 300;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .glossary-item-content {
          padding: 0 1rem 1rem 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .glossary-item-definition {
          margin: 0.75rem 0 0 0;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
        }

        .glossary-item-alternate {
          margin: 0.75rem 0 0 0;
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #6b7280;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 4px;
          border-left: 3px solid #e5e7eb;
        }

        .glossary-empty {
          padding: 2rem;
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .glossary-inline {
          display: inline;
        }

        @media (max-width: 640px) {
          .glossary-header {
            padding: 1rem;
          }

          .glossary-search {
            padding: 0.75rem 1rem;
          }

          .glossary-item-header {
            padding: 0.625rem 0.75rem;
          }

          .glossary-item-content {
            padding: 0 0.75rem 0.75rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
