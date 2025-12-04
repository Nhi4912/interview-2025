#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

interface ContentMetadata {
  id: string;
  slug: string;
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedTime: number;
  prerequisites: string[];
  relatedTopics: string[];
  tags: string[];
  interviewCompanies: string[];
  lastUpdated: string;
  version: string;
  hasQuiz: boolean;
  hasCodeExamples: boolean;
  hasDiagrams: boolean;
}

const contentMapping: Record<string, Partial<ContentMetadata>> = {
  "01-data-structures.md": {
    id: "cs-data-structures",
    slug: "data-structures",
    difficulty: "intermediate",
    estimatedTime: 90,
    prerequisites: ["js-basics"],
    tags: ["data-structures", "arrays", "linked-lists", "trees", "graphs"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "02-algorithms.md": {
    id: "cs-algorithms",
    slug: "algorithms",
    difficulty: "intermediate",
    estimatedTime: 85,
    prerequisites: ["cs-data-structures"],
    tags: ["algorithms", "sorting", "searching", "complexity"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "03-complexity-analysis.md": {
    id: "cs-complexity-analysis",
    slug: "complexity-analysis",
    difficulty: "intermediate",
    estimatedTime: 60,
    prerequisites: ["cs-algorithms"],
    tags: ["big-o", "time-complexity", "space-complexity", "analysis"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "04-design-patterns.md": {
    id: "cs-design-patterns",
    slug: "design-patterns",
    difficulty: "advanced",
    estimatedTime: 95,
    prerequisites: ["js-advanced-concepts"],
    tags: ["design-patterns", "oop", "architecture", "patterns"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "05-graph-algorithms.md": {
    id: "cs-graph-algorithms",
    slug: "graph-algorithms",
    difficulty: "advanced",
    estimatedTime: 80,
    prerequisites: ["cs-data-structures", "cs-algorithms"],
    tags: ["graphs", "bfs", "dfs", "dijkstra", "algorithms"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
};

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function generateVietnameseTitle(enTitle: string): string {
  const titleMap: Record<string, string> = {
    "Data Structures": "Cấu trúc dữ liệu",
    Algorithms: "Thuật toán",
    "Complexity Analysis": "Phân tích độ phức tạp",
    "Design Patterns": "Các mẫu thiết kế",
    "Graph Algorithms": "Thuật toán đồ thị",
  };

  for (const [en, vi] of Object.entries(titleMap)) {
    if (enTitle.includes(en)) {
      return enTitle.replace(en, vi);
    }
  }

  return enTitle;
}

function generateDescription(title: string): { en: string; vi: string } {
  return {
    en: `Master ${title}, including theory, implementations, and interview preparation for top tech companies.`,
    vi: `Làm chủ ${title}, bao gồm lý thuyết, triển khai và chuẩn bị phỏng vấn cho các công ty công nghệ hàng đầu.`,
  };
}

function convertMarkdownToMDX(
  content: string,
  metadata: ContentMetadata
): string {
  content = content.replace(/\[← Previous:.*?\].*?\[Next:.*?→\]/gs, "");
  content = content.replace(/\[Back to Table of Contents\].*?\n/g, "");
  content = content.replace(/^---\n/gm, "");
  content = content.replace(/\n{3,}/g, "\n\n");

  const frontmatter = `---
id: ${metadata.id}
slug: ${metadata.slug}
title:
  en: "${metadata.title.en}"
  vi: "${metadata.title.vi}"
description:
  en: "${metadata.description.en}"
  vi: "${metadata.description.vi}"
category: ${metadata.category}
difficulty: ${metadata.difficulty}
estimatedTime: ${metadata.estimatedTime}
prerequisites: ${JSON.stringify(metadata.prerequisites)}
relatedTopics: ${JSON.stringify(metadata.relatedTopics)}
tags: ${JSON.stringify(metadata.tags)}
interviewCompanies: ${JSON.stringify(metadata.interviewCompanies)}
lastUpdated: "${metadata.lastUpdated}"
version: "${metadata.version}"
hasQuiz: ${metadata.hasQuiz}
hasCodeExamples: ${metadata.hasCodeExamples}
hasDiagrams: ${metadata.hasDiagrams}
---

import { CodeExample } from '@/components/mdx/CodeExample';
import { Diagram } from '@/components/mdx/Diagram';
import { Quiz } from '@/components/mdx/Quiz';
import { InteractiveDemo } from '@/components/mdx/InteractiveDemo';

`;

  return frontmatter + content.trim();
}

async function migrateFile(sourceFile: string, targetDir: string) {
  const fileName = path.basename(sourceFile);
  const sourcePath = path.join("docs/10-computer-science", sourceFile);

  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping ${fileName} - file not found`);
    return;
  }

  const content = fs.readFileSync(sourcePath, "utf-8");
  const title = extractTitle(content);

  const baseMetadata = contentMapping[fileName] || {
    id: fileName.replace(".md", ""),
    slug: fileName.replace(".md", ""),
    difficulty: "intermediate" as const,
    estimatedTime: 70,
    prerequisites: [],
    tags: ["computer-science"],
    interviewCompanies: [],
  };

  const metadata: ContentMetadata = {
    ...baseMetadata,
    id: baseMetadata.id!,
    slug: baseMetadata.slug!,
    title: {
      en: title,
      vi: generateVietnameseTitle(title),
    },
    description: generateDescription(title),
    category: "computer-science",
    difficulty: baseMetadata.difficulty!,
    estimatedTime: baseMetadata.estimatedTime!,
    prerequisites: baseMetadata.prerequisites!,
    relatedTopics: baseMetadata.relatedTopics || [],
    tags: baseMetadata.tags!,
    interviewCompanies: baseMetadata.interviewCompanies!,
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
    hasQuiz:
      content.includes("Interview Questions") || content.includes("Practice"),
    hasCodeExamples: content.includes("```"),
    hasDiagrams:
      content.includes("```mermaid") || content.includes("Visualization"),
  };

  const mdxContent = convertMarkdownToMDX(content, metadata);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, fileName.replace(".md", ".mdx"));
  fs.writeFileSync(targetFile, mdxContent);

  console.log(`✓ Migrated ${fileName} -> ${targetFile}`);
}

async function main() {
  const targetDir = "content/en/computer-science";

  console.log("Starting Computer Science content migration...\n");

  const priorityFiles = [
    "01-data-structures.md",
    "02-algorithms.md",
    "03-complexity-analysis.md",
    "04-design-patterns.md",
    "05-graph-algorithms.md",
  ];

  for (const file of priorityFiles) {
    await migrateFile(file, targetDir);
  }

  console.log("\n✓ Migration complete!");
  console.log(`\nMigrated ${priorityFiles.length} files to ${targetDir}`);
}

main().catch(console.error);
