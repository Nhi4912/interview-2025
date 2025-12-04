"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleContext";
import {
  formatLocaleDisplay,
  getLocaleFlag,
  getAlternateLocale,
} from "@/lib/i18n/locale-utils";
import { Locale } from "@/types/content";
import styles from "./LanguageSelector.module.css";

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, newLocale: Locale) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLocaleChange(newLocale);
    }
  };

  const alternateLocale = getAlternateLocale(locale);

  return (
    <div className={styles.languageSelector} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.flag}>{getLocaleFlag(locale)}</span>
        <span className={styles.label}>{formatLocaleDisplay(locale)}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <button
            className={`${styles.option} ${
              locale === "en" ? styles.active : ""
            }`}
            onClick={() => handleLocaleChange("en")}
            onKeyDown={(e) => handleKeyDown(e, "en")}
            role="menuitem"
            aria-current={locale === "en" ? "true" : "false"}
          >
            <span className={styles.flag}>{getLocaleFlag("en")}</span>
            <span className={styles.label}>{formatLocaleDisplay("en")}</span>
            {locale === "en" && (
              <svg
                className={styles.checkmark}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.5L6 12L2.5 8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            className={`${styles.option} ${
              locale === "vi" ? styles.active : ""
            }`}
            onClick={() => handleLocaleChange("vi")}
            onKeyDown={(e) => handleKeyDown(e, "vi")}
            role="menuitem"
            aria-current={locale === "vi" ? "true" : "false"}
          >
            <span className={styles.flag}>{getLocaleFlag("vi")}</span>
            <span className={styles.label}>{formatLocaleDisplay("vi")}</span>
            {locale === "vi" && (
              <svg
                className={styles.checkmark}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.5L6 12L2.5 8.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
