"use client";

import React from "react";
import styles from "./TranslationProgress.module.css";

interface TranslationProgressProps {
  completeness: number; // 0-100
  locale: "en" | "vi";
  size?: "small" | "medium" | "large";
}

export function TranslationProgress({
  completeness,
  locale,
  size = "medium",
}: TranslationProgressProps) {
  if (locale === "en") {
    return null;
  }

  const getStatusColor = (
    percentage: number
  ): "complete" | "high" | "medium" | "low" => {
    if (percentage === 100) return "complete";
    if (percentage >= 75) return "high";
    if (percentage >= 50) return "medium";
    return "low";
  };

  const getStatusLabel = (percentage: number): string => {
    if (percentage === 100) return "Hoàn chỉnh";
    if (percentage >= 75) return "Gần hoàn chỉnh";
    if (percentage >= 50) return "Đang dịch";
    return "Chưa dịch";
  };

  const statusColor = getStatusColor(completeness);
  const statusLabel = getStatusLabel(completeness);

  return (
    <div className={`${styles.progress} ${styles[size]}`}>
      <div className={styles.header}>
        <span className={styles.label}>Tiến độ dịch</span>
        <span className={`${styles.status} ${styles[statusColor]}`}>
          {statusLabel}
        </span>
      </div>
      <div className={styles.barContainer}>
        <div
          className={`${styles.bar} ${styles[statusColor]}`}
          style={{ width: `${completeness}%` }}
          role="progressbar"
          aria-valuenow={completeness}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Translation progress: ${completeness}%`}
        />
      </div>
      <div className={styles.percentage}>{completeness}%</div>
    </div>
  );
}
