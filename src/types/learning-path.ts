import { Locale } from './content';

export type TargetRole = 'frontend' | 'fullstack' | 'senior' | 'staff';

export interface LearningPath {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  targetRole: TargetRole;
  estimatedDuration: number; // weeks
  modules: LearningModule[];
  prerequisites: string[];
}

export interface LearningModule {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  order: number;
  topics: LearningTopic[];
  estimatedTime: number; // hours
}

export interface LearningTopic {
  contentId: string;
  order: number;
  required: boolean;
  practiceExercises?: string[];
  quiz?: string;
}

export interface PathProgress {
  pathId: string;
  completedTopics: string[];
  currentTopic: string;
  startedAt: Date;
  lastAccessedAt: Date;
  completionPercentage: number;
}

export interface UserProgress {
  userId: string;
  locale: Locale;
  completedContent: {
    [contentId: string]: {
      completedAt: Date;
      timeSpent: number; // minutes
      quizScore?: number;
    };
  };
  bookmarks: string[]; // Content IDs
  notes: {
    [contentId: string]: string;
  };
  learningPaths: {
    [pathId: string]: PathProgress;
  };
  preferences: {
    defaultLocale: Locale;
    theme: 'light' | 'dark';
    codeTheme: string;
  };
}
