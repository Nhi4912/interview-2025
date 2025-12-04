"use client";

import { KnowledgeGraph } from "@/components/mdx/KnowledgeGraph";
import { buildGraphWithDepth } from "@/lib/content/graph-builder";
import { ContentIndex, Locale } from "@/types/content";
import { useState, useEffect } from "react";

export default function TestKnowledgeGraphWithContentPage() {
  const [graphData, setGraphData] = useState<{
    nodes: any[];
    edges: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, you would fetch the content index from the ContentService
    // For this demo, we'll create a mock content index
    const mockContentIndex: ContentIndex = {
      version: "1.0.0",
      locale: "en" as Locale,
      lastBuilt: new Date(),
      contents: {
        "js-basics": {
          metadata: {
            id: "js-basics",
            slug: "js-basics",
            title: { en: "JavaScript Basics", vi: "Cơ bản JavaScript" },
            description: {
              en: "Introduction to JavaScript",
              vi: "Giới thiệu JavaScript",
            },
            category: "javascript",
            difficulty: "beginner",
            estimatedTime: 30,
            prerequisites: [],
            relatedTopics: ["js-variables"],
            tags: ["basics", "fundamentals"],
            interviewCompanies: [],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
          path: "/content/en/javascript/js-basics.mdx",
          searchTokens: ["javascript", "basics"],
          relationships: {
            prerequisites: [],
            dependents: ["js-variables"],
            related: ["js-variables"],
          },
        },
        "js-variables": {
          metadata: {
            id: "js-variables",
            slug: "js-variables",
            title: { en: "Variables & Data Types", vi: "Biến và Kiểu Dữ Liệu" },
            description: { en: "Learn about variables", vi: "Học về biến" },
            category: "javascript",
            difficulty: "beginner",
            estimatedTime: 45,
            prerequisites: ["js-basics"],
            relatedTopics: ["js-functions"],
            tags: ["variables", "data-types"],
            interviewCompanies: [],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
          path: "/content/en/javascript/js-variables.mdx",
          searchTokens: ["variables", "data types"],
          relationships: {
            prerequisites: ["js-basics"],
            dependents: ["js-functions"],
            related: ["js-functions"],
          },
        },
        "js-functions": {
          metadata: {
            id: "js-functions",
            slug: "js-functions",
            title: { en: "Functions", vi: "Hàm" },
            description: { en: "Understanding functions", vi: "Hiểu về hàm" },
            category: "javascript",
            difficulty: "beginner",
            estimatedTime: 60,
            prerequisites: ["js-variables"],
            relatedTopics: ["js-scope", "js-closures"],
            tags: ["functions"],
            interviewCompanies: ["google", "meta"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: true,
          },
          path: "/content/en/javascript/js-functions.mdx",
          searchTokens: ["functions"],
          relationships: {
            prerequisites: ["js-variables"],
            dependents: ["js-scope", "js-closures"],
            related: ["js-scope", "js-closures"],
          },
        },
        "js-scope": {
          metadata: {
            id: "js-scope",
            slug: "js-scope",
            title: { en: "Scope & Hoisting", vi: "Phạm Vi và Hoisting" },
            description: { en: "Learn about scope", vi: "Học về phạm vi" },
            category: "javascript",
            difficulty: "intermediate",
            estimatedTime: 50,
            prerequisites: ["js-functions"],
            relatedTopics: ["js-closures"],
            tags: ["scope", "hoisting"],
            interviewCompanies: ["google", "meta", "amazon"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: true,
          },
          path: "/content/en/javascript/js-scope.mdx",
          searchTokens: ["scope", "hoisting"],
          relationships: {
            prerequisites: ["js-functions"],
            dependents: ["js-closures"],
            related: ["js-closures"],
          },
        },
        "js-closures": {
          metadata: {
            id: "js-closures",
            slug: "js-closures",
            title: { en: "Closures", vi: "Closures" },
            description: {
              en: "Understanding closures",
              vi: "Hiểu về closures",
            },
            category: "javascript",
            difficulty: "intermediate",
            estimatedTime: 60,
            prerequisites: ["js-functions", "js-scope"],
            relatedTopics: ["js-this", "js-prototypes"],
            tags: ["closures", "advanced"],
            interviewCompanies: ["google", "meta", "amazon"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: true,
          },
          path: "/content/en/javascript/js-closures.mdx",
          searchTokens: ["closures"],
          relationships: {
            prerequisites: ["js-functions", "js-scope"],
            dependents: [],
            related: ["js-this", "js-prototypes"],
          },
        },
        "js-this": {
          metadata: {
            id: "js-this",
            slug: "js-this",
            title: { en: "This Keyword", vi: "Từ Khóa This" },
            description: { en: "Understanding this", vi: "Hiểu về this" },
            category: "javascript",
            difficulty: "intermediate",
            estimatedTime: 45,
            prerequisites: ["js-functions"],
            relatedTopics: ["js-closures", "js-classes"],
            tags: ["this", "context"],
            interviewCompanies: ["google", "meta"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
          path: "/content/en/javascript/js-this.mdx",
          searchTokens: ["this", "keyword"],
          relationships: {
            prerequisites: ["js-functions"],
            dependents: ["js-classes"],
            related: ["js-closures", "js-classes"],
          },
        },
        "js-prototypes": {
          metadata: {
            id: "js-prototypes",
            slug: "js-prototypes",
            title: {
              en: "Prototypes & Inheritance",
              vi: "Prototypes và Kế Thừa",
            },
            description: { en: "Learn prototypes", vi: "Học về prototypes" },
            category: "javascript",
            difficulty: "advanced",
            estimatedTime: 70,
            prerequisites: ["js-functions"],
            relatedTopics: ["js-closures", "js-classes"],
            tags: ["prototypes", "inheritance", "oop"],
            interviewCompanies: ["google", "meta", "amazon"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: true,
          },
          path: "/content/en/javascript/js-prototypes.mdx",
          searchTokens: ["prototypes", "inheritance"],
          relationships: {
            prerequisites: ["js-functions"],
            dependents: ["js-classes"],
            related: ["js-closures", "js-classes"],
          },
        },
        "js-classes": {
          metadata: {
            id: "js-classes",
            slug: "js-classes",
            title: { en: "Classes", vi: "Lớp" },
            description: { en: "ES6 Classes", vi: "Lớp ES6" },
            category: "javascript",
            difficulty: "intermediate",
            estimatedTime: 55,
            prerequisites: ["js-prototypes", "js-this"],
            relatedTopics: [],
            tags: ["classes", "es6", "oop"],
            interviewCompanies: ["google", "meta"],
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            hasQuiz: true,
            hasCodeExamples: true,
            hasDiagrams: false,
          },
          path: "/content/en/javascript/js-classes.mdx",
          searchTokens: ["classes", "es6"],
          relationships: {
            prerequisites: ["js-prototypes", "js-this"],
            dependents: [],
            related: [],
          },
        },
      },
      categories: {
        javascript: [
          "js-basics",
          "js-variables",
          "js-functions",
          "js-scope",
          "js-closures",
          "js-this",
          "js-prototypes",
          "js-classes",
        ],
      },
      tags: {
        basics: ["js-basics"],
        functions: ["js-functions"],
        closures: ["js-closures"],
      },
    };

    try {
      // Build graph data using the helper function
      const data = buildGraphWithDepth("js-closures", mockContentIndex, 2);
      setGraphData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to build graph");
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Error</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!graphData) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>
        Knowledge Graph with Content Integration
      </h1>
      <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
        This example demonstrates how to build a knowledge graph from the
        ContentService using the buildGraphWithDepth helper function.
      </p>

      <KnowledgeGraph
        centerNodeId="js-closures"
        nodes={graphData.nodes}
        edges={graphData.edges}
        depth={2}
        locale="en"
        highlightPath={[
          "js-basics",
          "js-variables",
          "js-functions",
          "js-scope",
          "js-closures",
        ]}
        onNodeClick={(nodeId) => {
          console.log("Navigate to:", nodeId);
          alert(`Would navigate to: /learn/javascript/${nodeId}`);
        }}
      />

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Integration Details:</h2>
        <ul style={{ lineHeight: "1.8", color: "#374151" }}>
          <li>
            ✅ Graph built from ContentIndex using{" "}
            <code>buildGraphWithDepth()</code>
          </li>
          <li>✅ Nodes automatically populated from content metadata</li>
          <li>✅ Edges created from prerequisite and related relationships</li>
          <li>✅ Supports bilingual labels (en/vi)</li>
          <li>✅ Click nodes to navigate to content pages</li>
          <li>✅ Learning path highlighting</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#eff6ff",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>Usage in MDX:</h3>
        <pre
          style={{
            background: "#1f2937",
            color: "#f3f4f6",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`import { KnowledgeGraph } from '@/components/mdx/KnowledgeGraph';
import { buildGraphWithDepth } from '@/lib/content/graph-builder';
import { contentService } from '@/lib/content/ContentService';

// In your component or page
const contentIndex = await contentService.getContentIndex('en');
const { nodes, edges } = buildGraphWithDepth(
  'js-closures',
  contentIndex,
  2 // depth
);

<KnowledgeGraph
  centerNodeId="js-closures"
  nodes={nodes}
  edges={edges}
  depth={2}
  locale="en"
  onNodeClick={(nodeId) => router.push(\`/learn/\${nodeId}\`)}
/>`}
        </pre>
      </div>
    </div>
  );
}
