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
  "01-react-fundamentals.md": {
    id: "react-fundamentals",
    slug: "react-fundamentals",
    difficulty: "beginner",
    estimatedTime: 60,
    prerequisites: ["js-basics", "js-es6-features"],
    tags: ["react", "components", "jsx", "props", "state"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "02-react-19-features.md": {
    id: "react-19-features",
    slug: "react-19-features",
    difficulty: "advanced",
    estimatedTime: 45,
    prerequisites: ["react-fundamentals"],
    tags: ["react", "react-19", "server-components", "actions"],
    interviewCompanies: ["meta", "vercel"],
  },
  "03-hooks-deep-dive.md": {
    id: "react-hooks-deep-dive",
    slug: "react-hooks-deep-dive",
    difficulty: "intermediate",
    estimatedTime: 70,
    prerequisites: ["react-fundamentals"],
    tags: ["react", "hooks", "useState", "useEffect", "useContext"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "04-advanced-patterns.md": {
    id: "react-advanced-patterns",
    slug: "react-advanced-patterns",
    difficulty: "advanced",
    estimatedTime: 80,
    prerequisites: ["react-hooks-deep-dive"],
    tags: ["react", "patterns", "hoc", "render-props", "compound-components"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "05-state-management.md": {
    id: "react-state-management",
    slug: "react-state-management",
    difficulty: "intermediate",
    estimatedTime: 65,
    prerequisites: ["react-hooks-deep-dive"],
    tags: ["react", "state", "redux", "context", "zustand"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "09-performance-optimization.md": {
    id: "react-performance-optimization",
    slug: "react-performance-optimization",
    difficulty: "advanced",
    estimatedTime: 75,
    prerequisites: ["react-hooks-deep-dive"],
    tags: ["react", "performance", "memoization", "optimization"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
};

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function generateVietnameseTitle(enTitle: string): string {
  const titleMap: Record<string, string> = {
    "React Fundamentals": "Kiến thức cơ bản React",
    Hooks: "Hooks trong React",
    "State Management": "Quản lý State",
    Performance: "Tối ưu hiệu suất",
    "Advanced Patterns": "Các mẫu nâng cao",
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
    en: `Master ${title} in React, including core concepts, best practices, and interview preparation.`,
    vi: `Làm chủ ${title} trong React, bao gồm các khái niệm cốt lõi, best practices và chuẩn bị phỏng vấn.`,
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
  const sourcePath = path.join("docs/03-react", sourceFile);

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
    estimatedTime: 60,
    prerequisites: ["react-fundamentals"],
    tags: ["react"],
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
    category: "react",
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
  const targetDir = "content/en/react";

  console.log("Starting React content migration...\n");

  const priorityFiles = [
    "01-react-fundamentals.md",
    "03-hooks-deep-dive.md",
    "04-advanced-patterns.md",
    "05-state-management.md",
    "09-performance-optimization.md",
  ];

  for (const file of priorityFiles) {
    await migrateFile(file, targetDir);
  }

  console.log("\n✓ Migration complete!");
  console.log(`\nMigrated ${priorityFiles.length} files to ${targetDir}`);
}

main().catch(console.error);
