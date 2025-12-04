"use client";

import {
  KnowledgeGraph,
  GraphNode,
  GraphEdge,
} from "@/components/mdx/KnowledgeGraph";
import { useState } from "react";

export default function TestKnowledgeGraphPage() {
  const [selectedDepth, setSelectedDepth] = useState(2);

  // Sample data representing JavaScript learning topics
  const sampleNodes: GraphNode[] = [
    {
      id: "js-basics",
      label: "JavaScript Basics",
      category: "javascript",
      difficulty: "beginner",
      completed: true,
    },
    {
      id: "js-variables",
      label: "Variables & Data Types",
      category: "javascript",
      difficulty: "beginner",
      completed: true,
    },
    {
      id: "js-functions",
      label: "Functions",
      category: "javascript",
      difficulty: "beginner",
      completed: true,
    },
    {
      id: "js-scope",
      label: "Scope & Hoisting",
      category: "javascript",
      difficulty: "intermediate",
      completed: true,
    },
    {
      id: "js-closures",
      label: "Closures",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
    {
      id: "js-prototypes",
      label: "Prototypes & Inheritance",
      category: "javascript",
      difficulty: "advanced",
      completed: false,
    },
    {
      id: "js-async",
      label: "Async Programming",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
    {
      id: "js-promises",
      label: "Promises",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
    {
      id: "js-async-await",
      label: "Async/Await",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
    {
      id: "js-event-loop",
      label: "Event Loop",
      category: "javascript",
      difficulty: "advanced",
      completed: false,
    },
    {
      id: "js-this",
      label: "This Keyword",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
    {
      id: "js-classes",
      label: "Classes",
      category: "javascript",
      difficulty: "intermediate",
      completed: false,
    },
  ];

  const sampleEdges: GraphEdge[] = [
    // Prerequisites for closures
    { from: "js-basics", to: "js-variables", type: "next-in-path" },
    { from: "js-variables", to: "js-functions", type: "next-in-path" },
    { from: "js-functions", to: "js-scope", type: "next-in-path" },
    { from: "js-scope", to: "js-closures", type: "next-in-path" },

    // Closures prerequisites
    { from: "js-functions", to: "js-closures", type: "prerequisite" },
    { from: "js-scope", to: "js-closures", type: "prerequisite" },

    // Related topics to closures
    { from: "js-closures", to: "js-this", type: "related" },
    { from: "js-closures", to: "js-prototypes", type: "related" },

    // Async programming path
    { from: "js-functions", to: "js-async", type: "prerequisite" },
    { from: "js-async", to: "js-promises", type: "next-in-path" },
    { from: "js-promises", to: "js-async-await", type: "next-in-path" },
    { from: "js-async-await", to: "js-event-loop", type: "related" },

    // Prototypes and classes
    { from: "js-functions", to: "js-prototypes", type: "prerequisite" },
    { from: "js-prototypes", to: "js-classes", type: "next-in-path" },
    { from: "js-this", to: "js-classes", type: "prerequisite" },
  ];

  const learningPathHighlight = [
    "js-basics",
    "js-variables",
    "js-functions",
    "js-scope",
    "js-closures",
  ];

  const handleNodeClick = (nodeId: string) => {
    console.log("Node clicked:", nodeId);
    alert(`Navigating to: ${sampleNodes.find((n) => n.id === nodeId)?.label}`);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>
        Knowledge Graph Visualization Test
      </h1>
      <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
        Interactive visualization of JavaScript learning topics showing
        prerequisites, related topics, and learning path progression.
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="depth-select" style={{ marginRight: "1rem" }}>
          Graph Depth:
        </label>
        <select
          id="depth-select"
          value={selectedDepth}
          onChange={(e) => setSelectedDepth(Number(e.target.value))}
          style={{
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
          }}
        >
          <option value={1}>1 level</option>
          <option value={2}>2 levels</option>
          <option value={3}>3 levels</option>
          <option value={4}>All levels</option>
        </select>
      </div>

      <KnowledgeGraph
        centerNodeId="js-closures"
        nodes={sampleNodes}
        edges={sampleEdges}
        depth={selectedDepth}
        locale="en"
        highlightPath={learningPathHighlight}
        onNodeClick={handleNodeClick}
      />

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Features Demonstrated:</h2>
        <ul style={{ lineHeight: "1.8", color: "#374151" }}>
          <li>✅ Interactive D3.js force-directed graph</li>
          <li>✅ Zoom and pan functionality</li>
          <li>✅ Drag nodes to reposition</li>
          <li>✅ Color-coded by difficulty level</li>
          <li>
            ✅ Different edge types (prerequisite, related, learning path)
          </li>
          <li>✅ Highlight learning path progression</li>
          <li>✅ Show completed topics with checkmarks</li>
          <li>✅ Click nodes to navigate</li>
          <li>✅ Adjustable depth filtering</li>
          <li>✅ Responsive design</li>
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
        <h3 style={{ marginBottom: "0.5rem" }}>Legend:</h3>
        <ul style={{ lineHeight: "1.8", color: "#1e40af" }}>
          <li>
            <strong>Blue center node:</strong> Current topic (js-closures)
          </li>
          <li>
            <strong>Green nodes:</strong> Completed topics
          </li>
          <li>
            <strong>Green highlighted:</strong> Topics in learning path
          </li>
          <li>
            <strong>Red arrows:</strong> Prerequisites
          </li>
          <li>
            <strong>Purple arrows:</strong> Related topics
          </li>
          <li>
            <strong>Green arrows:</strong> Learning path sequence
          </li>
        </ul>
      </div>
    </div>
  );
}
