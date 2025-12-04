"use client";

import React, { useEffect } from "react";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { TranslationNotice } from "@/components/content/TranslationNotice";
import { TranslationProgress } from "@/components/content/TranslationProgress";
import { TranslationDashboard } from "@/components/content/TranslationDashboard";
import { GlossaryLookup } from "@/components/mdx/GlossaryLookup";
import { useLocale, TranslationService, initializeGlossary } from "@/lib/i18n";
import { ContentMetadata } from "@/types/content";

export default function TestBilingualPage() {
  const { locale } = useLocale();

  useEffect(() => {
    // Initialize glossary on mount
    initializeGlossary();
  }, []);

  // Sample content metadata for testing
  const sampleMetadata: ContentMetadata = {
    id: "js-closures",
    slug: "javascript/closures",
    title: {
      en: "Understanding Closures in JavaScript",
      vi: "Hiểu về Closures trong JavaScript",
    },
    description: {
      en: "Learn about closures, one of the most powerful features in JavaScript",
      vi: "Tìm hiểu về closures, một trong những tính năng mạnh mẽ nhất trong JavaScript",
    },
    category: "javascript",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: ["js-scope", "js-functions"],
    relatedTopics: ["js-hoisting", "js-execution-context"],
    tags: ["closures", "scope", "functions"],
    interviewCompanies: ["google", "meta", "amazon"],
    lastUpdated: "2024-01-01",
    version: "1.0.0",
    hasQuiz: true,
    hasCodeExamples: true,
    hasDiagrams: true,
  };

  const incompleteMetadata: ContentMetadata = {
    ...sampleMetadata,
    id: "js-advanced",
    title: {
      en: "Advanced JavaScript Concepts",
      vi: "", // Missing Vietnamese translation
    },
    description: {
      en: "Deep dive into advanced JavaScript topics",
      vi: "", // Missing Vietnamese translation
    },
  };

  // Sample translation stats
  const sampleStats = TranslationService.calculateTranslationStats(
    [sampleMetadata, incompleteMetadata],
    locale
  );

  const translationStatus = TranslationService.getTranslationStatus(
    incompleteMetadata,
    locale
  );

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Bilingual Content Management Test</h1>
        <LanguageSelector />
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2>1. Language Selector</h2>
        <p>
          {locale === "en"
            ? "Use the language selector above to switch between English and Vietnamese. Your preference will be saved in local storage."
            : "Sử dụng bộ chọn ngôn ngữ ở trên để chuyển đổi giữa tiếng Anh và tiếng Việt. Tùy chọn của bạn sẽ được lưu trong local storage."}
        </p>
        <p>
          <strong>
            {locale === "en" ? "Current locale:" : "Ngôn ngữ hiện tại:"}
          </strong>{" "}
          {locale}
        </p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>2. Translation Notice</h2>
        <p>
          {locale === "en"
            ? "This component appears when viewing content in Vietnamese that has incomplete translations:"
            : "Component này xuất hiện khi xem nội dung tiếng Việt chưa được dịch hoàn chỉnh:"}
        </p>
        <TranslationNotice
          contentTitle={incompleteMetadata.title.en}
          missingFields={translationStatus.missingFields}
        />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>3. Translation Progress Indicator</h2>
        <p>
          {locale === "en"
            ? "Shows the translation completeness for individual content pieces:"
            : "Hiển thị mức độ hoàn thiện bản dịch cho từng nội dung:"}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <h4>Complete Translation (100%)</h4>
            <TranslationProgress completeness={100} locale={locale} />
          </div>
          <div>
            <h4>High Progress (80%)</h4>
            <TranslationProgress completeness={80} locale={locale} />
          </div>
          <div>
            <h4>Medium Progress (50%)</h4>
            <TranslationProgress completeness={50} locale={locale} />
          </div>
          <div>
            <h4>Low Progress (25%)</h4>
            <TranslationProgress completeness={25} locale={locale} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>4. Translation Dashboard</h2>
        <p>
          {locale === "en"
            ? "Overview of translation progress across all content:"
            : "Tổng quan về tiến độ dịch trên toàn bộ nội dung:"}
        </p>
        <TranslationDashboard stats={sampleStats} locale={locale} />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>5. Bilingual Glossary System</h2>
        <p>
          {locale === "en"
            ? "Search and browse technical terms with bilingual definitions:"
            : "Tìm kiếm và duyệt các thuật ngữ kỹ thuật với định nghĩa song ngữ:"}
        </p>
        <GlossaryLookup searchable={true} />
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>6. Category-Filtered Glossary</h2>
        <p>
          {locale === "en"
            ? "View glossary terms filtered by category (JavaScript):"
            : "Xem thuật ngữ được lọc theo danh mục (JavaScript):"}
        </p>
        <GlossaryLookup category="javascript" searchable={false} />
      </section>
    </div>
  );
}
