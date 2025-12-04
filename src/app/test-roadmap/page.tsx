"use client";

import { useEffect, useState } from "react";
import { LearningRoadmap } from "@/components/learning-paths";
import { LearningPath, PathProgress } from "@/types/learning-path";

export default function TestRoadmapPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<PathProgress | null>(null);
  const [locale, setLocale] = useState<"en" | "vi">("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the frontend-basics learning path
    fetch("/api/learning-paths/frontend-basics")
      .then((res) => res.json())
      .then((data) => {
        setLearningPath(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading learning path:", error);
        // Fallback to mock data
        loadMockData();
      });
  }, []);

  const loadMockData = () => {
    // Mock learning path data
    const mockPath: LearningPath = {
      id: "frontend-basics",
      title: {
        en: "Frontend Development Fundamentals",
        vi: "Kiến Thức Cơ Bản Phát Triển Frontend",
      },
      description: {
        en: "Master the fundamentals of frontend development including JavaScript, HTML, CSS, and basic React concepts. Perfect for beginners starting their frontend journey.",
        vi: "Nắm vững kiến thức cơ bản về phát triển frontend bao gồm JavaScript, HTML, CSS và các khái niệm React cơ bản. Hoàn hảo cho người mới bắt đầu hành trình frontend.",
      },
      targetRole: "frontend",
      estimatedDuration: 12,
      prerequisites: [],
      modules: [
        {
          id: "javascript-fundamentals",
          title: {
            en: "JavaScript Fundamentals",
            vi: "Kiến Thức Cơ Bản JavaScript",
          },
          order: 1,
          estimatedTime: 40,
          topics: [
            {
              contentId: "js-variables-data-types",
              order: 1,
              required: true,
            },
            {
              contentId: "js-scope-hoisting",
              order: 2,
              required: true,
            },
            {
              contentId: "js-closures",
              order: 3,
              required: true,
              quiz: "js-closures-quiz",
            },
            {
              contentId: "js-prototypes",
              order: 4,
              required: true,
            },
            {
              contentId: "js-this-keyword",
              order: 5,
              required: true,
            },
            {
              contentId: "js-event-loop",
              order: 6,
              required: true,
              practiceExercises: ["event-loop-ex-1", "event-loop-ex-2"],
            },
            {
              contentId: "js-es6-features",
              order: 7,
              required: true,
            },
          ],
        },
        {
          id: "html-css-basics",
          title: {
            en: "HTML & CSS Essentials",
            vi: "HTML & CSS Cơ Bản",
          },
          order: 2,
          estimatedTime: 25,
          topics: [
            {
              contentId: "html5-fundamentals",
              order: 1,
              required: true,
            },
            {
              contentId: "css-fundamentals",
              order: 2,
              required: true,
            },
            {
              contentId: "css-flexbox-grid",
              order: 3,
              required: true,
              quiz: "css-layout-quiz",
            },
            {
              contentId: "responsive-design",
              order: 4,
              required: true,
            },
          ],
        },
        {
          id: "react-basics",
          title: {
            en: "React Fundamentals",
            vi: "Kiến Thức Cơ Bản React",
          },
          order: 3,
          estimatedTime: 35,
          topics: [
            {
              contentId: "react-fundamentals",
              order: 1,
              required: true,
            },
            {
              contentId: "react-hooks-basics",
              order: 2,
              required: true,
              practiceExercises: ["hooks-ex-1", "hooks-ex-2", "hooks-ex-3"],
            },
            {
              contentId: "react-state-management",
              order: 3,
              required: true,
            },
            {
              contentId: "react-component-patterns",
              order: 4,
              required: false,
            },
          ],
        },
      ],
    };

    // Mock progress data - user has completed first module and is in second
    const mockProgress: PathProgress = {
      pathId: "frontend-basics",
      completedTopics: [
        "js-variables-data-types",
        "js-scope-hoisting",
        "js-closures",
        "js-prototypes",
        "js-this-keyword",
        "js-event-loop",
        "js-es6-features",
        "html5-fundamentals",
      ],
      currentTopic: "css-fundamentals",
      startedAt: new Date("2024-01-01"),
      lastAccessedAt: new Date(),
      completionPercentage: 53,
    };

    setLearningPath(mockPath);
    setProgress(mockProgress);
    setLoading(false);
  };

  const handleTopicClick = (contentId: string) => {
    console.log("Topic clicked:", contentId);
    alert(`Navigate to topic: ${contentId}`);
  };

  const toggleLocale = () => {
    setLocale((prev) => (prev === "en" ? "vi" : "en"));
  };

  const simulateProgress = () => {
    if (!progress || !learningPath) return;

    // Add one more completed topic
    const allTopics = learningPath.modules.flatMap((m) => m.topics);
    const nextTopic = allTopics.find(
      (t) => !progress.completedTopics.includes(t.contentId)
    );

    if (nextTopic) {
      const newCompleted = [...progress.completedTopics, progress.currentTopic];
      const newProgress: PathProgress = {
        ...progress,
        completedTopics: newCompleted,
        currentTopic: nextTopic.contentId,
        completionPercentage: Math.round(
          (newCompleted.length / allTopics.filter((t) => t.required).length) *
            100
        ),
        lastAccessedAt: new Date(),
      };
      setProgress(newProgress);
    }
  };

  const resetProgress = () => {
    setProgress({
      pathId: "frontend-basics",
      completedTopics: [],
      currentTopic: "js-variables-data-types",
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completionPercentage: 0,
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading learning roadmap...</p>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Failed to load learning path</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ flex: "1 1 100%", margin: "0 0 1rem 0" }}>
          Learning Roadmap Component Test
        </h1>
        <button
          onClick={toggleLocale}
          style={{
            padding: "0.5rem 1rem",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Switch to {locale === "en" ? "Vietnamese" : "English"}
        </button>
        <button
          onClick={simulateProgress}
          style={{
            padding: "0.5rem 1rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Complete Current Topic
        </button>
        <button
          onClick={resetProgress}
          style={{
            padding: "0.5rem 1rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Reset Progress
        </button>
      </div>

      <LearningRoadmap
        learningPath={learningPath}
        progress={progress || undefined}
        locale={locale}
        onTopicClick={handleTopicClick}
      />

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#f9fafb",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Component Features:</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li>✅ Visual timeline showing complete learning journey</li>
          <li>✅ Modules displayed with estimated time indicators</li>
          <li>✅ Topics organized within expandable modules</li>
          <li>
            ✅ Status indicators: completed (✓), current (●), upcoming (○)
          </li>
          <li>✅ Progress bars for overall path and individual modules</li>
          <li>✅ Bilingual support (English/Vietnamese)</li>
          <li>✅ Interactive: click modules to expand/collapse</li>
          <li>✅ Interactive: click topics to navigate</li>
          <li>✅ Visual badges for quizzes (📝) and practice exercises (💻)</li>
          <li>✅ Optional topics marked clearly</li>
          <li>✅ Responsive design for mobile, tablet, and desktop</li>
          <li>✅ Dark mode support</li>
        </ul>
      </div>
    </div>
  );
}
