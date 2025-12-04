"use client";

import React from "react";
import { useLocale } from "@/lib/i18n";
import styles from "./TranslationNotice.module.css";

interface TranslationNoticeProps {
  contentTitle: string;
  missingFields?: string[];
}

export function TranslationNotice({
  contentTitle,
  missingFields = [],
}: TranslationNoticeProps) {
  const { locale, setLocale } = useLocale();

  if (locale === "en") {
    return null;
  }

  const handleSwitchToEnglish = () => {
    setLocale("en");
  };

  return (
    <div className={styles.notice} role="alert" aria-live="polite">
      <div className={styles.icon}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 6V10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 14H10.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Bản dịch chưa hoàn chỉnh</h3>
        <p className={styles.message}>
          Nội dung này chưa được dịch hoàn toàn sang tiếng Việt. Bạn đang xem
          phiên bản tiếng Anh.
          {missingFields.length > 0 && (
            <span className={styles.details}>
              {" "}
              Các phần chưa dịch: {missingFields.join(", ")}.
            </span>
          )}
        </p>
        <button
          className={styles.button}
          onClick={handleSwitchToEnglish}
          aria-label="Switch to English version"
        >
          Chuyển sang tiếng Anh
        </button>
      </div>
    </div>
  );
}
