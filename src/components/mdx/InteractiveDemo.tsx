"use client";

import { useState, useEffect, useRef } from "react";
import { Locale } from "@/types/content";

export type DemoType =
  | "sorting"
  | "tree"
  | "graph"
  | "stack"
  | "queue"
  | "linked-list"
  | "hash-table"
  | "custom";

export interface InteractiveDemoProps {
  type: DemoType;
  title?: string;
  description?: string;
  locale?: Locale;
  initialData?: any;
  className?: string;
}

interface VisualizationStep {
  description: string;
  data: any;
  highlight?: number[];
}

export function InteractiveDemo({
  type,
  title,
  description,
  locale = "en",
  initialData,
  className = "",
}: InteractiveDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const labels = {
    en: {
      play: "Play",
      pause: "Pause",
      reset: "Reset",
      next: "Next",
      previous: "Previous",
      speed: "Speed",
      step: "Step",
      of: "of",
    },
    vi: {
      play: "Chạy",
      pause: "Tạm dừng",
      reset: "Đặt lại",
      next: "Tiếp",
      previous: "Trước",
      speed: "Tốc độ",
      step: "Bước",
      of: "của",
    },
  };

  const t = labels[locale];

  useEffect(() => {
    // Initialize visualization based on type
    initializeVisualization();
  }, [type, initialData]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const initializeVisualization = () => {
    switch (type) {
      case "sorting":
        initializeSorting();
        break;
      case "stack":
        initializeStack();
        break;
      case "queue":
        initializeQueue();
        break;
      case "tree":
        initializeTree();
        break;
      case "linked-list":
        initializeLinkedList();
        break;
      default:
        setSteps([{ description: "No visualization available", data: [] }]);
    }
  };

  const initializeSorting = () => {
    const arr = initialData || [64, 34, 25, 12, 22, 11, 90];
    const sortSteps: VisualizationStep[] = [];
    const data = [...arr];

    sortSteps.push({
      description: locale === "vi" ? "Mảng ban đầu" : "Initial array",
      data: [...data],
    });

    // Bubble sort visualization
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = 0; j < data.length - i - 1; j++) {
        sortSteps.push({
          description:
            locale === "vi"
              ? `So sánh ${data[j]} và ${data[j + 1]}`
              : `Comparing ${data[j]} and ${data[j + 1]}`,
          data: [...data],
          highlight: [j, j + 1],
        });

        if (data[j] > data[j + 1]) {
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
          sortSteps.push({
            description:
              locale === "vi"
                ? `Hoán đổi ${data[j + 1]} và ${data[j]}`
                : `Swapping ${data[j + 1]} and ${data[j]}`,
            data: [...data],
            highlight: [j, j + 1],
          });
        }
      }
    }

    sortSteps.push({
      description: locale === "vi" ? "Mảng đã sắp xếp" : "Sorted array",
      data: [...data],
    });

    setSteps(sortSteps);
  };

  const initializeStack = () => {
    const stackSteps: VisualizationStep[] = [];
    const stack: number[] = [];

    stackSteps.push({
      description: locale === "vi" ? "Stack rỗng" : "Empty stack",
      data: [...stack],
    });

    const operations = initialData || [10, 20, 30];
    operations.forEach((val: number) => {
      stack.push(val);
      stackSteps.push({
        description:
          locale === "vi" ? `Push ${val} vào stack` : `Push ${val} to stack`,
        data: [...stack],
        highlight: [stack.length - 1],
      });
    });

    while (stack.length > 0) {
      const val = stack.pop();
      stackSteps.push({
        description:
          locale === "vi" ? `Pop ${val} khỏi stack` : `Pop ${val} from stack`,
        data: [...stack],
      });
    }

    setSteps(stackSteps);
  };

  const initializeQueue = () => {
    const queueSteps: VisualizationStep[] = [];
    const queue: number[] = [];

    queueSteps.push({
      description: locale === "vi" ? "Queue rỗng" : "Empty queue",
      data: [...queue],
    });

    const operations = initialData || [10, 20, 30];
    operations.forEach((val: number) => {
      queue.push(val);
      queueSteps.push({
        description:
          locale === "vi"
            ? `Enqueue ${val} vào queue`
            : `Enqueue ${val} to queue`,
        data: [...queue],
        highlight: [queue.length - 1],
      });
    });

    while (queue.length > 0) {
      const val = queue.shift();
      queueSteps.push({
        description:
          locale === "vi"
            ? `Dequeue ${val} khỏi queue`
            : `Dequeue ${val} from queue`,
        data: [...queue],
      });
    }

    setSteps(queueSteps);
  };

  const initializeTree = () => {
    const treeSteps: VisualizationStep[] = [];
    const values = initialData || [50, 30, 70, 20, 40, 60, 80];

    treeSteps.push({
      description:
        locale === "vi"
          ? "Cây nhị phân tìm kiếm rỗng"
          : "Empty binary search tree",
      data: [],
    });

    const tree: any[] = [];
    values.forEach((val: number, index: number) => {
      tree.push(val);
      treeSteps.push({
        description:
          locale === "vi" ? `Chèn ${val} vào cây` : `Insert ${val} into tree`,
        data: [...tree],
        highlight: [index],
      });
    });

    setSteps(treeSteps);
  };

  const initializeLinkedList = () => {
    const listSteps: VisualizationStep[] = [];
    const list: number[] = [];

    listSteps.push({
      description:
        locale === "vi" ? "Danh sách liên kết rỗng" : "Empty linked list",
      data: [...list],
    });

    const values = initialData || [10, 20, 30, 40];
    values.forEach((val: number) => {
      list.push(val);
      listSteps.push({
        description:
          locale === "vi"
            ? `Thêm ${val} vào cuối danh sách`
            : `Append ${val} to list`,
        data: [...list],
        highlight: [list.length - 1],
      });
    });

    setSteps(listSteps);
  };

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderVisualization = () => {
    if (steps.length === 0) return null;

    const currentData = steps[currentStep]?.data || [];
    const highlight = steps[currentStep]?.highlight || [];

    switch (type) {
      case "sorting":
      case "stack":
      case "queue":
      case "linked-list":
        return renderArrayVisualization(currentData, highlight);
      case "tree":
        return renderTreeVisualization(currentData, highlight);
      default:
        return <div>Visualization not available</div>;
    }
  };

  const renderArrayVisualization = (data: number[], highlight: number[]) => {
    const maxValue = Math.max(...data, 1);

    return (
      <div className="visualization-array">
        {data.map((value, index) => (
          <div
            key={index}
            className={`array-item ${
              highlight.includes(index) ? "highlighted" : ""
            }`}
          >
            <div
              className="array-bar"
              style={{
                height: `${(value / maxValue) * 150}px`,
              }}
            >
              <span className="array-value">{value}</span>
            </div>
            <div className="array-index">{index}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderTreeVisualization = (data: number[], highlight: number[]) => {
    return (
      <div className="visualization-tree">
        <div className="tree-nodes">
          {data.map((value, index) => (
            <div
              key={index}
              className={`tree-node ${
                highlight.includes(index) ? "highlighted" : ""
              }`}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`interactive-demo ${className}`}>
      {(title || description) && (
        <div className="demo-header">
          {title && <h3 className="demo-title">{title}</h3>}
          {description && <p className="demo-description">{description}</p>}
        </div>
      )}

      <div className="demo-visualization">{renderVisualization()}</div>

      {steps.length > 0 && (
        <div className="demo-description-box">
          <div className="demo-step-info">
            {t.step} {currentStep + 1} {t.of} {steps.length}
          </div>
          <div className="demo-step-description">
            {steps[currentStep]?.description}
          </div>
        </div>
      )}

      <div className="demo-controls">
        <div className="demo-controls-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="demo-button"
            aria-label={t.previous}
          >
            ◀
          </button>
          <button
            onClick={handlePlayPause}
            className="demo-button demo-button-primary"
            aria-label={isPlaying ? t.pause : t.play}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1}
            className="demo-button"
            aria-label={t.next}
          >
            ▶
          </button>
          <button
            onClick={handleReset}
            className="demo-button"
            aria-label={t.reset}
          >
            ↻
          </button>
        </div>

        <div className="demo-speed-control">
          <label htmlFor="speed-slider" className="demo-speed-label">
            {t.speed}:
          </label>
          <input
            id="speed-slider"
            type="range"
            min="200"
            max="2000"
            step="200"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="demo-speed-slider"
          />
          <span className="demo-speed-value">{(speed / 1000).toFixed(1)}s</span>
        </div>
      </div>

      <style jsx>{`
        .interactive-demo {
          margin: 2rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }

        .demo-header {
          padding: 1.5rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .demo-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .demo-description {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .demo-visualization {
          padding: 2rem;
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
        }

        .visualization-array {
          display: flex;
          gap: 0.5rem;
          align-items: flex-end;
          justify-content: center;
          flex-wrap: wrap;
        }

        .array-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .array-bar {
          width: 50px;
          background: #3b82f6;
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 0.5rem;
          transition: all 0.3s ease;
          min-height: 40px;
        }

        .array-item.highlighted .array-bar {
          background: #ef4444;
          transform: scale(1.05);
        }

        .array-value {
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .array-index {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .visualization-tree {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .tree-nodes {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          max-width: 600px;
        }

        .tree-node {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .tree-node.highlighted {
          background: #ef4444;
          transform: scale(1.2);
        }

        .demo-description-box {
          padding: 1rem 1.5rem;
          background: #eff6ff;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .demo-step-info {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .demo-step-description {
          font-size: 0.9375rem;
          color: #1e40af;
          font-weight: 500;
        }

        .demo-controls {
          padding: 1.5rem;
          background: white;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .demo-controls-buttons {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }

        .demo-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
          min-width: 44px;
        }

        .demo-button:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .demo-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .demo-button-primary {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .demo-button-primary:hover:not(:disabled) {
          background: #2563eb;
          border-color: #2563eb;
        }

        .demo-speed-control {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
        }

        .demo-speed-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .demo-speed-slider {
          width: 150px;
          height: 6px;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          background: #e5e7eb;
        }

        .demo-speed-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .demo-speed-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }

        .demo-speed-value {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 600;
          min-width: 3rem;
        }

        @media (max-width: 640px) {
          .demo-header {
            padding: 1rem;
          }

          .demo-visualization {
            padding: 1.5rem 1rem;
            min-height: 200px;
          }

          .array-bar {
            width: 40px;
          }

          .tree-node {
            width: 40px;
            height: 40px;
            font-size: 0.75rem;
          }

          .demo-controls {
            padding: 1rem;
          }

          .demo-controls-buttons {
            flex-wrap: wrap;
          }

          .demo-speed-control {
            flex-direction: column;
            gap: 0.5rem;
          }

          .demo-speed-slider {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
