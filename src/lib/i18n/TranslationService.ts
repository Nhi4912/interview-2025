import { Locale, ContentMetadata } from "@/types/content";

export interface TranslationStatus {
  contentId: string;
  locale: Locale;
  isComplete: boolean;
  completeness: number; // 0-100 percentage
  missingFields: string[];
  lastUpdated: string;
}

export interface TranslationStats {
  totalContent: number;
  translatedContent: number;
  completionPercentage: number;
  byCategory: {
    [category: string]: {
      total: number;
      translated: number;
      percentage: number;
    };
  };
  byDifficulty: {
    [difficulty: string]: {
      total: number;
      translated: number;
      percentage: number;
    };
  };
}

export class TranslationService {
  /**
   * Check if content has complete translation for a locale
   */
  static isTranslationComplete(
    metadata: ContentMetadata,
    locale: Locale
  ): boolean {
    if (locale === "en") {
      // English is the source language, always complete
      return true;
    }

    // Check if Vietnamese translations exist and are not empty
    const hasTitle = !!(
      metadata.title.vi && metadata.title.vi.trim().length > 0
    );
    const hasDescription = !!(
      metadata.description.vi && metadata.description.vi.trim().length > 0
    );

    return hasTitle && hasDescription;
  }

  /**
   * Calculate translation completeness percentage
   */
  static getTranslationCompleteness(
    metadata: ContentMetadata,
    locale: Locale
  ): number {
    if (locale === "en") {
      return 100;
    }

    let completedFields = 0;
    let totalFields = 0;

    // Check title
    totalFields++;
    if (metadata.title.vi && metadata.title.vi.trim().length > 0) {
      completedFields++;
    }

    // Check description
    totalFields++;
    if (metadata.description.vi && metadata.description.vi.trim().length > 0) {
      completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  }

  /**
   * Get missing translation fields
   */
  static getMissingFields(metadata: ContentMetadata, locale: Locale): string[] {
    if (locale === "en") {
      return [];
    }

    const missing: string[] = [];

    if (!metadata.title.vi || metadata.title.vi.trim().length === 0) {
      missing.push("title");
    }

    if (
      !metadata.description.vi ||
      metadata.description.vi.trim().length === 0
    ) {
      missing.push("description");
    }

    return missing;
  }

  /**
   * Get translation status for a content piece
   */
  static getTranslationStatus(
    metadata: ContentMetadata,
    locale: Locale
  ): TranslationStatus {
    return {
      contentId: metadata.id,
      locale,
      isComplete: this.isTranslationComplete(metadata, locale),
      completeness: this.getTranslationCompleteness(metadata, locale),
      missingFields: this.getMissingFields(metadata, locale),
      lastUpdated: metadata.lastUpdated,
    };
  }

  /**
   * Calculate translation statistics for a collection of content
   */
  static calculateTranslationStats(
    allMetadata: ContentMetadata[],
    locale: Locale
  ): TranslationStats {
    if (locale === "en") {
      // English is source language, everything is "translated"
      return {
        totalContent: allMetadata.length,
        translatedContent: allMetadata.length,
        completionPercentage: 100,
        byCategory: {},
        byDifficulty: {},
      };
    }

    const translatedContent = allMetadata.filter((m) =>
      this.isTranslationComplete(m, locale)
    );

    // Calculate by category
    const byCategory: TranslationStats["byCategory"] = {};
    const categoryGroups = allMetadata.reduce((acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m);
      return acc;
    }, {} as { [key: string]: ContentMetadata[] });

    Object.entries(categoryGroups).forEach(([category, items]) => {
      const translated = items.filter((m) =>
        this.isTranslationComplete(m, locale)
      );
      byCategory[category] = {
        total: items.length,
        translated: translated.length,
        percentage: Math.round((translated.length / items.length) * 100),
      };
    });

    // Calculate by difficulty
    const byDifficulty: TranslationStats["byDifficulty"] = {};
    const difficultyGroups = allMetadata.reduce((acc, m) => {
      if (!acc[m.difficulty]) acc[m.difficulty] = [];
      acc[m.difficulty].push(m);
      return acc;
    }, {} as { [key: string]: ContentMetadata[] });

    Object.entries(difficultyGroups).forEach(([difficulty, items]) => {
      const translated = items.filter((m) =>
        this.isTranslationComplete(m, locale)
      );
      byDifficulty[difficulty] = {
        total: items.length,
        translated: translated.length,
        percentage: Math.round((translated.length / items.length) * 100),
      };
    });

    return {
      totalContent: allMetadata.length,
      translatedContent: translatedContent.length,
      completionPercentage: Math.round(
        (translatedContent.length / allMetadata.length) * 100
      ),
      byCategory,
      byDifficulty,
    };
  }

  /**
   * Determine if fallback content should be shown
   */
  static shouldShowFallback(
    metadata: ContentMetadata,
    locale: Locale
  ): boolean {
    return locale === "vi" && !this.isTranslationComplete(metadata, locale);
  }
}
