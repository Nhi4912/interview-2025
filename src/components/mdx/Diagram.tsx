"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import styles from "./Diagram.module.css";

export interface DiagramProps {
  children: string;
  type?: "mermaid" | "flowchart" | "sequence" | "architecture";
  title?: string;
  caption?: string;
  className?: string;
}

export function Diagram({
  children,
  type = "mermaid",
  title,
  caption,
  className = "",
}: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [svgContent, setSvgContent] = useState<string>("");
  const diagramId = useRef(
    `mermaid-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!children || !containerRef.current) return;

      setIsLoading(true);
      setError("");

      try {
        // Clean the diagram content
        const diagramContent = children.trim();

        // Validate that content is not empty
        if (!diagramContent) {
          throw new Error("Diagram content is empty");
        }

        // Render the diagram
        const { svg } = await mermaid.render(diagramId.current, diagramContent);
        setSvgContent(svg);
        setIsLoading(false);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(
          err instanceof Error
            ? `Invalid diagram syntax: ${err.message}`
            : "Failed to render diagram"
        );
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [children]);

  return (
    <div className={`${styles.container} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.wrapper}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Rendering diagram...</span>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <div className={styles.errorContent}>
              <div className={styles.errorTitle}>Diagram Rendering Error</div>
              <div className={styles.errorMessage}>{error}</div>
              <details className={styles.errorDetails}>
                <summary>View diagram source</summary>
                <pre className={styles.errorSource}>{children}</pre>
              </details>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div
            ref={containerRef}
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {caption && !error && <div className={styles.caption}>{caption}</div>}
    </div>
  );
}
