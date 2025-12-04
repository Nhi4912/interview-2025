"use client";

import React from "react";
import { TranslationStats } from "@/lib/i18n/TranslationService";
import styles from "./TranslationDashboard.module.css";

interface TranslationDashboardProps {
  stats: TranslationStats;
  locale: "en" | "vi";
}

export function TranslationDashboard({
  stats,
  locale,
}: TranslationDashboardProps) {
  if (locale === "en") {
    return null;
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return styles.complete;
    if (percentage >= 75) return styles.high;
    if (percentage >= 50) return styles.medium;
    return styles.low;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tiến độ dịch nội dung</h2>
        <p className={styles.subtitle}>
          Theo dõi tiến độ dịch sang tiếng Việt của toàn bộ nội dung
        </p>
      </div>

      {/* Overall Progress */}
      <div className={styles.overallCard}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Tổng quan</h3>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.totalContent}</div>
            <div className={styles.statLabel}>Tổng số bài</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{stats.translatedContent}</div>
            <div className={styles.statLabel}>Đã dịch</div>
          </div>
          <div className={styles.stat}>
            <div
              className={`${styles.statValue} ${getProgressColor(
                stats.completionPercentage
              )}`}
            >
              {stats.completionPercentage}%
            </div>
            <div className={styles.statLabel}>Hoàn thành</div>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${getProgressColor(
              stats.completionPercentage
            )}`}
            style={{ width: `${stats.completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={stats.completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* By Category */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Theo danh mục</h3>
        <div className={styles.categoryGrid}>
          {Object.entries(stats.byCategory).map(([category, data]) => (
            <div key={category} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{category}</span>
                <span
                  className={`${styles.categoryPercentage} ${getProgressColor(
                    data.percentage
                  )}`}
                >
                  {data.percentage}%
                </span>
              </div>
              <div className={styles.categoryStats}>
                <span className={styles.categoryCount}>
                  {data.translated} / {data.total}
                </span>
              </div>
              <div className={styles.categoryBar}>
                <div
                  className={`${styles.categoryFill} ${getProgressColor(
                    data.percentage
                  )}`}
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Difficulty */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Theo độ khó</h3>
        <div className={styles.difficultyGrid}>
          {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
            <div key={difficulty} className={styles.difficultyCard}>
              <div className={styles.difficultyHeader}>
                <span className={styles.difficultyName}>{difficulty}</span>
                <span
                  className={`${styles.difficultyPercentage} ${getProgressColor(
                    data.percentage
                  )}`}
                >
                  {data.percentage}%
                </span>
              </div>
              <div className={styles.difficultyStats}>
                <span className={styles.difficultyCount}>
                  {data.translated} / {data.total}
                </span>
              </div>
              <div className={styles.difficultyBar}>
                <div
                  className={`${styles.difficultyFill} ${getProgressColor(
                    data.percentage
                  )}`}
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
