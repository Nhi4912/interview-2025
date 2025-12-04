"use client";

import { useEffect, useState } from "react";
import {
  LearningPath,
  LearningModule,
  LearningTopic,
  PathProgress,
} from "@/types/learning-path";
import { Locale } from "@/types/content";
import styles from "./LearningRoadmap.module.css";

export interface LearningRoadmapProps {
  learningPath: LearningPath;
  progress?: PathProgress;
  locale?: Locale;
  onTopicClick?: (contentId: string) => void;
  className?: string;
}

type TopicStatus = "completed" | "current" | "upcoming" | "locked";

interface TopicWithStatus extends LearningTopic {
  status: TopicStatus;
  moduleId: string;
  moduleTitle: string;
}

export function LearningRoadmap({
  learningPath,
  progress,
  locale = "en",
  onTopicClick,
  className = "",
}: LearningRoadmapProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [topicsWithStatus, setTopicsWithStatus] = useState<TopicWithStatus[]>(
    []
  );

  useEffect(() => {
    // Calculate status for each topic
    const completedTopics = new Set(progress?.completedTopics || []);
    const currentTopicId = progress?.currentTopic || "";

    const allTopics: TopicWithStatus[] = [];
    let foundCurrent = false;

    learningPath.modules
      .sort((a, b) => a.order - b.order)
      .forEach((module) => {
        module.topics
          .sort((a, b) => a.order - b.order)
          .forEach((topic) => {
            let status: TopicStatus;

            if (completedTopics.has(topic.contentId)) {
              status = "completed";
            } else if (
              topic.contentId === currentTopicId ||
              (!foundCurrent && !completedTopics.has(topic.contentId))
            ) {
              status = "current";
              foundCurrent = true;
            } else if (foundCurrent) {
              status = "upcoming";
            } else {
              status = "upcoming";
            }

            allTopics.push({
              ...topic,
              status,
              moduleId: module.id,
              moduleTitle: module.title[locale],
            });
          });
      });

    setTopicsWithStatus(allTopics);

    // Auto-expand module with current topic
    const currentModule = learningPath.modules.find((m) =>
      m.topics.some((t) => t.contentId === currentTopicId)
    );
    if (currentModule) {
      setExpandedModules(new Set([currentModule.id]));
    }
  }, [learningPath, progress, locale]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const getModuleProgress = (module: LearningModule): number => {
    if (!progress) return 0;

    const completedTopics = new Set(progress.completedTopics);
    const requiredTopics = module.topics.filter((t) => t.required);
    const completedRequired = requiredTopics.filter((t) =>
      completedTopics.has(t.contentId)
    ).length;

    return requiredTopics.length > 0
      ? Math.round((completedRequired / requiredTopics.length) * 100)
      : 0;
  };

  const getModuleStatus = (
    module: LearningModule
  ): "completed" | "in-progress" | "upcoming" => {
    const moduleProgress = getModuleProgress(module);
    if (moduleProgress === 100) return "completed";
    if (moduleProgress > 0) return "in-progress";
    return "upcoming";
  };

  const formatDuration = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours}h`;
  };

  const formatWeeks = (weeks: number): string => {
    if (weeks === 1) return "1 week";
    return `${weeks} weeks`;
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{learningPath.title[locale]}</h2>
          <p className={styles.description}>
            {learningPath.description[locale]}
          </p>
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>📅</span>
              <span>{formatWeeks(learningPath.estimatedDuration)}</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>📚</span>
              <span>{learningPath.modules.length} modules</span>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon}>🎯</span>
              <span className={styles.targetRole}>
                {learningPath.targetRole}
              </span>
            </div>
            {progress && (
              <div className={styles.metadataItem}>
                <span className={styles.metadataIcon}>✓</span>
                <span>{progress.completionPercentage}% complete</span>
              </div>
            )}
          </div>
        </div>
        {progress && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {learningPath.modules
          .sort((a, b) => a.order - b.order)
          .map((module, moduleIndex) => {
            const moduleStatus = getModuleStatus(module);
            const moduleProgress = getModuleProgress(module);
            const isExpanded = expandedModules.has(module.id);
            const isLastModule =
              moduleIndex === learningPath.modules.length - 1;

            return (
              <div key={module.id} className={styles.moduleContainer}>
                {/* Timeline connector */}
                {!isLastModule && (
                  <div
                    className={`${styles.connector} ${
                      styles[`connector-${moduleStatus}`]
                    }`}
                  />
                )}

                {/* Module card */}
                <div
                  className={`${styles.module} ${
                    styles[`module-${moduleStatus}`]
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <div className={styles.moduleHeader}>
                    <div className={styles.moduleIcon}>
                      {moduleStatus === "completed" && "✓"}
                      {moduleStatus === "in-progress" && "▶"}
                      {moduleStatus === "upcoming" && moduleIndex + 1}
                    </div>
                    <div className={styles.moduleInfo}>
                      <h3 className={styles.moduleTitle}>
                        {module.title[locale]}
                      </h3>
                      <div className={styles.moduleStats}>
                        <span className={styles.moduleStat}>
                          ⏱ {formatDuration(module.estimatedTime)}
                        </span>
                        <span className={styles.moduleStat}>
                          📝 {module.topics.length} topics
                        </span>
                        {progress && (
                          <span className={styles.moduleStat}>
                            {moduleProgress}% complete
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.moduleToggle}>
                      <span
                        className={
                          isExpanded
                            ? styles.toggleExpanded
                            : styles.toggleCollapsed
                        }
                      >
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    </div>
                  </div>

                  {/* Module progress bar */}
                  {progress && moduleProgress > 0 && (
                    <div className={styles.moduleProgressBar}>
                      <div
                        className={styles.moduleProgressFill}
                        style={{ width: `${moduleProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Topics list */}
                  {isExpanded && (
                    <div className={styles.topicsList}>
                      {module.topics
                        .sort((a, b) => a.order - b.order)
                        .map((topic) => {
                          const topicWithStatus = topicsWithStatus.find(
                            (t) =>
                              t.contentId === topic.contentId &&
                              t.moduleId === module.id
                          );
                          const topicStatus =
                            topicWithStatus?.status || "upcoming";

                          return (
                            <div
                              key={topic.contentId}
                              className={`${styles.topic} ${
                                styles[`topic-${topicStatus}`]
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onTopicClick) {
                                  onTopicClick(topic.contentId);
                                }
                              }}
                            >
                              <div className={styles.topicIcon}>
                                {topicStatus === "completed" && (
                                  <span className={styles.topicIconCompleted}>
                                    ✓
                                  </span>
                                )}
                                {topicStatus === "current" && (
                                  <span className={styles.topicIconCurrent}>
                                    ●
                                  </span>
                                )}
                                {topicStatus === "upcoming" && (
                                  <span className={styles.topicIconUpcoming}>
                                    ○
                                  </span>
                                )}
                                {topicStatus === "locked" && (
                                  <span className={styles.topicIconLocked}>
                                    🔒
                                  </span>
                                )}
                              </div>
                              <div className={styles.topicContent}>
                                <span className={styles.topicId}>
                                  {topic.contentId}
                                </span>
                                {!topic.required && (
                                  <span className={styles.topicOptional}>
                                    Optional
                                  </span>
                                )}
                              </div>
                              {topic.quiz && (
                                <span
                                  className={styles.topicBadge}
                                  title="Has quiz"
                                >
                                  📝
                                </span>
                              )}
                              {topic.practiceExercises &&
                                topic.practiceExercises.length > 0 && (
                                  <span
                                    className={styles.topicBadge}
                                    title="Has practice exercises"
                                  >
                                    💻
                                  </span>
                                )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Status Legend:</div>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.legendIconCompleted}>✓</span>
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIconCurrent}>●</span>
            <span>Current</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendIconUpcoming}>○</span>
            <span>Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
