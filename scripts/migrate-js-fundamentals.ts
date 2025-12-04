#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

interface ContentMetadata {
  id: string;
  slug: string;
  title: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
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

// Mapping of files to their metadata
const contentMapping: Record<string, Partial<ContentMetadata>> = {
  "00-javascript-basics.md": {
    id: "js-basics",
    slug: "javascript-basics",
    difficulty: "beginner",
    estimatedTime: 30,
    prerequisites: [],
    tags: ["javascript", "basics", "fundamentals"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "01-variables-data-types.md": {
    id: "js-variables-data-types",
    slug: "javascript-variables-data-types",
    difficulty: "beginner",
    estimatedTime: 40,
    prerequisites: ["js-basics"],
    tags: ["javascript", "variables", "data-types", "primitives"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "02-scope-hoisting.md": {
    id: "js-scope-hoisting",
    slug: "javascript-scope-hoisting",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: ["js-variables-data-types"],
    tags: ["javascript", "scope", "hoisting", "var", "let", "const"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "03-closures.md": {
    id: "js-closures",
    slug: "javascript-closures",
    difficulty: "intermediate",
    estimatedTime: 50,
    prerequisites: ["js-scope-hoisting", "js-functions-basics"],
    tags: ["javascript", "closures", "scope", "functions", "lexical-scope"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "04-prototypes-inheritance.md": {
    id: "js-prototypes-inheritance",
    slug: "javascript-prototypes-inheritance",
    difficulty: "intermediate",
    estimatedTime: 60,
    prerequisites: ["js-closures"],
    tags: ["javascript", "prototypes", "inheritance", "oop"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "05-this-keyword.md": {
    id: "js-this-keyword",
    slug: "javascript-this-keyword",
    difficulty: "intermediate",
    estimatedTime: 45,
    prerequisites: ["js-prototypes-inheritance"],
    tags: ["javascript", "this", "context", "binding"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "06-event-loop-async.md": {
    id: "js-event-loop-async",
    slug: "javascript-event-loop-async",
    difficulty: "advanced",
    estimatedTime: 60,
    prerequisites: ["js-closures"],
    tags: ["javascript", "event-loop", "async", "promises", "callbacks"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "07-es6-features.md": {
    id: "js-es6-features",
    slug: "javascript-es6-features",
    difficulty: "intermediate",
    estimatedTime: 55,
    prerequisites: ["js-closures"],
    tags: ["javascript", "es6", "arrow-functions", "destructuring", "spread"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "08-advanced-concepts.md": {
    id: "js-advanced-concepts",
    slug: "javascript-advanced-concepts",
    difficulty: "advanced",
    estimatedTime: 70,
    prerequisites: ["js-event-loop-async", "js-prototypes-inheritance"],
    tags: ["javascript", "advanced", "patterns"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
};

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function generateVietnameseTitle(enTitle: string): string {
  // Simple mapping - in production, this would use proper translation
  const titleMap: Record<string, string> = {
    Closures: "Closures trong JavaScript",
    "JavaScript Fundamentals": "Kiến thức cơ bản JavaScript",
    Scope: "Phạm vi (Scope)",
    Hoisting: "Hoisting",
    Prototypes: "Prototypes",
    Inheritance: "Kế thừa",
    "Event Loop": "Vòng lặp sự kiện",
    Async: "Bất đồng bộ",
  };

  return titleMap[enTitle] || enTitle;
}

function generateDescription(title: string): { en: string; vi: string } {
  return {
    en: `Learn about ${title} in JavaScript, including core concepts, practical examples, and interview preparation.`,
    vi: `Tìm hiểu về ${title} trong JavaScript, bao gồm các khái niệm cốt lõi, ví dụ thực tế và chuẩn bị phỏng vấn.`,
  };
}

function convertMarkdownToMDX(
  content: string,
  metadata: ContentMetadata
): string {
  // Remove old navigation links
  content = content.replace(/\[← Previous:.*?\].*?\[Next:.*?→\]/gs, "");
  content = content.replace(/\[Back to Table of Contents\].*?\n/g, "");

  // Remove horizontal rules at the top
  content = content.replace(/^---\n/gm, "");

  // Clean up extra newlines
  content = content.replace(/\n{3,}/g, "\n\n");

  // Generate frontmatter
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

`;

  return frontmatter + content.trim();
}

async function migrateFile(sourceFile: string, targetDir: string) {
  const fileName = path.basename(sourceFile);
  const sourcePath = path.join("docs/01-javascript-fundamentals", sourceFile);

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
    estimatedTime: 45,
    prerequisites: [],
    tags: ["javascript"],
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
    category: "javascript",
    difficulty: baseMetadata.difficulty!,
    estimatedTime: baseMetadata.estimatedTime!,
    prerequisites: baseMetadata.prerequisites!,
    relatedTopics: baseMetadata.relatedTopics || [],
    tags: baseMetadata.tags!,
    interviewCompanies: baseMetadata.interviewCompanies!,
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
    hasQuiz:
      content.includes("Interview Questions") ||
      content.includes("Practice Problems"),
    hasCodeExamples: content.includes("```"),
    hasDiagrams:
      content.includes("```mermaid") || content.includes("Visualization"),
  };

  const mdxContent = convertMarkdownToMDX(content, metadata);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, fileName.replace(".md", ".mdx"));
  fs.writeFileSync(targetFile, mdxContent);

  console.log(`✓ Migrated ${fileName} -> ${targetFile}`);
}

async function main() {
  const targetDir = "content/en/javascript";

  console.log("Starting JavaScript fundamentals migration...\n");

  // Migrate priority files first
  const priorityFiles = [
    "00-javascript-basics.md",
    "01-variables-data-types.md",
    "02-scope-hoisting.md",
    "03-closures.md",
    "04-prototypes-inheritance.md",
    "05-this-keyword.md",
    "06-event-loop-async.md",
    "07-es6-features.md",
  ];

  for (const file of priorityFiles) {
    await migrateFile(file, targetDir);
  }

  console.log("\n✓ Migration complete!");
  console.log(`\nMigrated ${priorityFiles.length} files to ${targetDir}`);
}

main().catch(console.error);
