import { LearningPath, PathProgress, UserProgress, Locale } from "@/types";
import { validateLearningPath } from "./schema";
import fs from "fs";
import path from "path";

/**
 * Service for managing learning paths and user progress
 */
export class LearningPathService {
  private pathsCache: Map<string, LearningPath> = new Map();
  private pathsDirectory: string;

  constructor(pathsDirectory?: string) {
    this.pathsDirectory =
      pathsDirectory ||
      path.join(process.cwd(), "src/lib/learning-paths/paths");
  }

  /**
   * Get a specific learning path by ID
   */
  async getLearningPath(pathId: string, locale: Locale): Promise<LearningPath> {
    // Check cache first
    if (this.pathsCache.has(pathId)) {
      return this.pathsCache.get(pathId)!;
    }

    // Load from file
    const filePath = path.join(this.pathsDirectory, `${pathId}.json`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Learning path not found: ${pathId}`);
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const pathData = JSON.parse(fileContent);

    if (!validateLearningPath(pathData)) {
      throw new Error(`Invalid learning path data: ${pathId}`);
    }

    // Cache the path
    this.pathsCache.set(pathId, pathData);
    return pathData;
  }

  /**
   * Get all available learning paths
   */
  async getAllPaths(locale: Locale): Promise<LearningPath[]> {
    const files = fs.readdirSync(this.pathsDirectory);
    const paths: LearningPath[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const pathId = file.replace(".json", "");
        try {
          const path = await this.getLearningPath(pathId, locale);
          paths.push(path);
        } catch (error) {
          console.error(`Error loading path ${pathId}:`, error);
        }
      }
    }

    return paths;
  }

  /**
   * Get recommended learning path based on user level
   */
  async getRecommendedPath(userLevel: string): Promise<LearningPath> {
    const allPaths = await this.getAllPaths("en");

    // Map user levels to target roles
    const levelToRole: Record<string, string> = {
      beginner: "frontend",
      intermediate: "fullstack",
      advanced: "senior",
      expert: "staff",
    };

    const targetRole = levelToRole[userLevel.toLowerCase()] || "frontend";

    // Find path matching the target role
    const recommendedPath = allPaths.find((p) => p.targetRole === targetRole);

    if (!recommendedPath) {
      // Fallback to first available path
      return allPaths[0];
    }

    return recommendedPath;
  }

  /**
   * Get the next topic for a user in a learning path
   */
  async getNextTopic(
    userId: string,
    pathId: string
  ): Promise<{ contentId: string; moduleId: string } | null> {
    const progress = this.getUserProgress(userId, pathId);
    const path = await this.getLearningPath(pathId, "en");

    // Find the first incomplete required topic
    for (const module of path.modules.sort((a, b) => a.order - b.order)) {
      for (const topic of module.topics.sort((a, b) => a.order - b.order)) {
        if (
          topic.required &&
          !progress.completedTopics.includes(topic.contentId)
        ) {
          return {
            contentId: topic.contentId,
            moduleId: module.id,
          };
        }
      }
    }

    return null; // All required topics completed
  }

  /**
   * Get user progress for a specific learning path
   */
  getUserProgress(userId: string, pathId: string): PathProgress {
    const storageKey = `learning_progress_${userId}`;

    if (typeof window === "undefined") {
      // Server-side: return empty progress
      return this.createEmptyProgress(pathId);
    }

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      return this.createEmptyProgress(pathId);
    }

    try {
      const userProgress: UserProgress = JSON.parse(stored);
      const pathProgress = userProgress.learningPaths[pathId];

      if (!pathProgress) {
        return this.createEmptyProgress(pathId);
      }

      // Convert date strings back to Date objects
      return {
        ...pathProgress,
        startedAt: new Date(pathProgress.startedAt),
        lastAccessedAt: new Date(pathProgress.lastAccessedAt),
      };
    } catch (error) {
      console.error("Error parsing progress:", error);
      return this.createEmptyProgress(pathId);
    }
  }

  /**
   * Update user progress for a content item
   */
  updateProgress(userId: string, contentId: string, completed: boolean): void {
    if (typeof window === "undefined") {
      return; // Cannot update on server-side
    }

    const storageKey = `learning_progress_${userId}`;
    let userProgress: UserProgress;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      userProgress = JSON.parse(stored);
    } else {
      userProgress = this.createEmptyUserProgress(userId);
    }

    // Update completed content
    if (completed) {
      userProgress.completedContent[contentId] = {
        completedAt: new Date(),
        timeSpent: 0, // Could be tracked separately
      };
    } else {
      delete userProgress.completedContent[contentId];
    }

    // Update all learning paths that contain this content
    this.updatePathProgress(userProgress, contentId, completed);

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(userProgress));
  }

  /**
   * Calculate completion percentage for a learning path
   */
  async getPathCompletion(userId: string, pathId: string): Promise<number> {
    const progress = this.getUserProgress(userId, pathId);
    const path = await this.getLearningPath(pathId, "en");

    // Count total required topics
    let totalRequired = 0;
    let completed = 0;

    for (const module of path.modules) {
      for (const topic of module.topics) {
        if (topic.required) {
          totalRequired++;
          if (progress.completedTopics.includes(topic.contentId)) {
            completed++;
          }
        }
      }
    }

    if (totalRequired === 0) {
      return 0;
    }

    return Math.round((completed / totalRequired) * 100);
  }

  /**
   * Create empty progress object
   */
  private createEmptyProgress(pathId: string): PathProgress {
    return {
      pathId,
      completedTopics: [],
      currentTopic: "",
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completionPercentage: 0,
    };
  }

  /**
   * Create empty user progress object
   */
  private createEmptyUserProgress(userId: string): UserProgress {
    return {
      userId,
      locale: "en",
      completedContent: {},
      bookmarks: [],
      notes: {},
      learningPaths: {},
      preferences: {
        defaultLocale: "en",
        theme: "light",
        codeTheme: "vs-dark",
      },
    };
  }

  /**
   * Update progress for all learning paths containing the content
   */
  private updatePathProgress(
    userProgress: UserProgress,
    contentId: string,
    completed: boolean
  ): void {
    for (const pathId in userProgress.learningPaths) {
      const pathProgress = userProgress.learningPaths[pathId];

      if (completed) {
        if (!pathProgress.completedTopics.includes(contentId)) {
          pathProgress.completedTopics.push(contentId);
        }
      } else {
        pathProgress.completedTopics = pathProgress.completedTopics.filter(
          (id) => id !== contentId
        );
      }

      pathProgress.lastAccessedAt = new Date();
    }
  }
}

// Export singleton instance
export const learningPathService = new LearningPathService();
