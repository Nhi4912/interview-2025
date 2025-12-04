"use client";

import { useState } from "react";
import { Locale } from "@/types/content";

export type QuestionType = "multiple-choice" | "true-false" | "code";

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
  code?: string;
}

export interface QuizProps {
  id: string;
  questions: QuizQuestion[];
  locale?: Locale;
  passingScore?: number;
  onComplete?: (score: number, passed: boolean) => void;
}

export function Quiz({
  id,
  questions,
  locale = "en",
  passingScore = 70,
  onComplete,
}: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    (string | number | null)[]
  >(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const labels = {
    en: {
      question: "Question",
      of: "of",
      selectAnswer: "Select an answer",
      next: "Next",
      previous: "Previous",
      submit: "Submit Quiz",
      showExplanation: "Show Explanation",
      hideExplanation: "Hide Explanation",
      correct: "Correct",
      incorrect: "Incorrect",
      yourAnswer: "Your answer",
      correctAnswer: "Correct answer",
      score: "Your Score",
      passed: "Passed",
      failed: "Failed",
      retake: "Retake Quiz",
      true: "True",
      false: "False",
    },
    vi: {
      question: "Câu hỏi",
      of: "của",
      selectAnswer: "Chọn câu trả lời",
      next: "Tiếp",
      previous: "Trước",
      submit: "Nộp bài",
      showExplanation: "Xem giải thích",
      hideExplanation: "Ẩn giải thích",
      correct: "Đúng",
      incorrect: "Sai",
      yourAnswer: "Câu trả lời của bạn",
      correctAnswer: "Câu trả lời đúng",
      score: "Điểm của bạn",
      passed: "Đạt",
      failed: "Chưa đạt",
      retake: "Làm lại",
      true: "Đúng",
      false: "Sai",
    },
  };

  const t = labels[locale];

  const handleAnswerSelect = (answer: string | number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const score = calculateScore();
    const passed = score >= passingScore;
    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const isAnswerCorrect = (questionIndex: number) => {
    return (
      selectedAnswers[questionIndex] === questions[questionIndex].correctAnswer
    );
  };

  const allQuestionsAnswered = selectedAnswers.every(
    (answer) => answer !== null
  );

  if (showResults) {
    const score = calculateScore();
    const passed = score >= passingScore;

    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div
            className={`quiz-results-header ${passed ? "passed" : "failed"}`}
          >
            <div className="quiz-results-icon">{passed ? "✓" : "✗"}</div>
            <h3 className="quiz-results-title">
              {passed ? t.passed : t.failed}
            </h3>
            <div className="quiz-results-score">
              {t.score}: {score}%
            </div>
          </div>

          <div className="quiz-results-details">
            {questions.map((question, index) => {
              const isCorrect = isAnswerCorrect(index);
              const userAnswer = selectedAnswers[index];
              const correctAnswer = question.correctAnswer;

              return (
                <div key={question.id} className="quiz-result-item">
                  <div className="quiz-result-header">
                    <span
                      className={`quiz-result-status ${
                        isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      {isCorrect ? t.correct : t.incorrect}
                    </span>
                    <span className="quiz-result-question-number">
                      {t.question} {index + 1}
                    </span>
                  </div>

                  <div className="quiz-result-question">
                    {question.question[locale]}
                  </div>

                  {!isCorrect && (
                    <div className="quiz-result-answers">
                      <div className="quiz-result-answer incorrect">
                        <strong>{t.yourAnswer}:</strong>{" "}
                        {question.type === "true-false"
                          ? userAnswer === "true"
                            ? t.true
                            : t.false
                          : question.options?.[locale][userAnswer as number]}
                      </div>
                      <div className="quiz-result-answer correct">
                        <strong>{t.correctAnswer}:</strong>{" "}
                        {question.type === "true-false"
                          ? correctAnswer === "true"
                            ? t.true
                            : t.false
                          : question.options?.[locale][correctAnswer as number]}
                      </div>
                    </div>
                  )}

                  <div className="quiz-result-explanation">
                    {question.explanation[locale]}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRetake}
            className="quiz-button quiz-button-primary"
          >
            {t.retake}
          </button>
        </div>

        <style jsx>{`
          .quiz-container {
            margin: 2rem 0;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            background: white;
          }

          .quiz-results {
            padding: 2rem;
          }

          .quiz-results-header {
            text-align: center;
            padding: 2rem;
            border-radius: 8px;
            margin-bottom: 2rem;
          }

          .quiz-results-header.passed {
            background: #d1fae5;
            color: #065f46;
          }

          .quiz-results-header.failed {
            background: #fee2e2;
            color: #991b1b;
          }

          .quiz-results-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .quiz-results-title {
            margin: 0 0 0.5rem 0;
            font-size: 1.5rem;
            font-weight: 700;
          }

          .quiz-results-score {
            font-size: 2rem;
            font-weight: 700;
          }

          .quiz-results-details {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .quiz-result-item {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.5rem;
            background: #f9fafb;
          }

          .quiz-result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .quiz-result-status {
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
          }

          .quiz-result-status.correct {
            background: #d1fae5;
            color: #065f46;
          }

          .quiz-result-status.incorrect {
            background: #fee2e2;
            color: #991b1b;
          }

          .quiz-result-question-number {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 600;
          }

          .quiz-result-question {
            font-size: 1rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 1rem;
          }

          .quiz-result-answers {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .quiz-result-answer {
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.875rem;
          }

          .quiz-result-answer.correct {
            background: #d1fae5;
            color: #065f46;
          }

          .quiz-result-answer.incorrect {
            background: #fee2e2;
            color: #991b1b;
          }

          .quiz-result-explanation {
            padding: 1rem;
            background: white;
            border-left: 3px solid #3b82f6;
            border-radius: 4px;
            font-size: 0.875rem;
            line-height: 1.6;
            color: #374151;
          }

          .quiz-button {
            width: 100%;
            padding: 0.75rem 1.5rem;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.2s;
          }

          .quiz-button:hover {
            background: #f3f4f6;
          }

          .quiz-button-primary {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }

          .quiz-button-primary:hover {
            background: #2563eb;
          }

          .quiz-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          @media (max-width: 640px) {
            .quiz-results {
              padding: 1rem;
            }

            .quiz-results-header {
              padding: 1.5rem;
            }

            .quiz-result-item {
              padding: 1rem;
            }
          }
        `}</style>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          {t.question} {currentQuestion + 1} {t.of} {questions.length}
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="quiz-content">
        <div className="quiz-question">{question.question[locale]}</div>

        {question.code && (
          <pre className="quiz-code">
            <code>{question.code}</code>
          </pre>
        )}

        <div className="quiz-options">
          {question.type === "true-false" ? (
            <>
              <button
                className={`quiz-option ${
                  selectedAnswer === "true" ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect("true")}
              >
                {t.true}
              </button>
              <button
                className={`quiz-option ${
                  selectedAnswer === "false" ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect("false")}
              >
                {t.false}
              </button>
            </>
          ) : (
            question.options?.[locale].map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${
                  selectedAnswer === index ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="quiz-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="quiz-option-text">{option}</span>
              </button>
            ))
          )}
        </div>

        {selectedAnswer !== null && (
          <button
            className="quiz-explanation-toggle"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? t.hideExplanation : t.showExplanation}
          </button>
        )}

        {showExplanation && (
          <div className="quiz-explanation">{question.explanation[locale]}</div>
        )}
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="quiz-button"
        >
          {t.previous}
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className="quiz-button quiz-button-primary"
          >
            {t.submit}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="quiz-button quiz-button-primary"
          >
            {t.next}
          </button>
        )}
      </div>

      <style jsx>{`
        .quiz-container {
          margin: 2rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .quiz-header {
          padding: 1.5rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .quiz-progress {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .quiz-progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .quiz-progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .quiz-content {
          padding: 2rem;
        }

        .quiz-question {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .quiz-code {
          margin: 1.5rem 0;
          padding: 1rem;
          background: #1e1e1e;
          color: #d4d4d4;
          border-radius: 6px;
          overflow-x: auto;
          font-family: "Consolas", "Monaco", "Courier New", monospace;
          font-size: 0.875rem;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          font-size: 0.9375rem;
        }

        .quiz-option:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .quiz-option.selected {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .quiz-option-letter {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #6b7280;
          flex-shrink: 0;
        }

        .quiz-option.selected .quiz-option-letter {
          background: #3b82f6;
          color: white;
        }

        .quiz-option-text {
          flex: 1;
        }

        .quiz-explanation-toggle {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
          transition: all 0.2s;
        }

        .quiz-explanation-toggle:hover {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .quiz-explanation {
          margin-top: 1rem;
          padding: 1rem;
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 4px;
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
        }

        .quiz-navigation {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .quiz-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .quiz-button:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .quiz-button-primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .quiz-button-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .quiz-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .quiz-header,
          .quiz-content,
          .quiz-navigation {
            padding: 1rem;
          }

          .quiz-question {
            font-size: 1rem;
          }

          .quiz-option {
            padding: 0.75rem;
          }

          .quiz-option-letter {
            width: 1.75rem;
            height: 1.75rem;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
