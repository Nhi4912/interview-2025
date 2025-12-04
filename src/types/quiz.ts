import { Locale } from './content';

export type QuestionType = 'multiple-choice' | 'code' | 'true-false';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: {
    en: string;
    vi: string;
  };
  options?: {
    en: string[];
    vi: string[];
  };
  correctAnswer: string | number;
  explanation: {
    en: string;
    vi: string;
  };
  code?: string; // For code-based questions
}

export interface QuizData {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizResult {
  questionId: string;
  userAnswer: string | number;
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface QuizCompletion {
  quizId: string;
  score: number;
  totalQuestions: number;
  results: QuizResult[];
  completedAt: Date;
}
