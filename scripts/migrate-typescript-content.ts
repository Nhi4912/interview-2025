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
  "01-typescript-basics.md": {
    id: "ts-basics",
    slug: "typescript-basics",
    difficulty: "beginner",
    estimatedTime: 50,
    prerequisites: ["js-basics"],
    tags: ["typescript", "types", "interfaces", "basics"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "02-advanced-types.md": {
    id: "ts-advanced-types",
    slug: "typescript-advanced-types",
    difficulty: "advanced",
    estimatedTime: 70,
    prerequisites: ["ts-basics"],
    tags: ["typescript", "advanced-types", "generics", "utility-types"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "03-generics-deep-dive.md": {
    id: "ts-generics",
    slug: "typescript-generics",
    difficulty: "intermediate",
    estimatedTime: 60,
    prerequisites: ["ts-basics"],
    tags: ["typescript", "generics", "type-parameters"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "05-react-typescript.md": {
    id: "ts-react",
    slug: "typescript-react",
    difficulty: "intermediate",
    estimatedTime: 65,
    prerequisites: ["ts-basics", "react-fundamentals"],
    tags: ["typescript", "react", "props", "hooks"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
};

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function generateVietnameseTitle(enTitle: string): string {
  const titleMap: Record<string, string> = {
    "TypeScript Basics": "Kiến thức cơ bản TypeScript",
    "Advanced Types": "Các kiểu nâng cao",
    Generics: "Generics trong TypeScript",
    React: "React với TypeScript",
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
    en: `Master ${title} in TypeScript, including type system, best practices, and interview preparation.`,
    vi: `Làm chủ ${title} trong TypeScript, bao gồm hệ thống kiểu, best practices và chuẩn bị phỏng vấn.`,
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
  const sourcePath = path.join("docs/02-typescript", sourceFile);

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
    prerequisites: ["ts-basics"],
    tags: ["typescript"],
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
    category: "typescript",
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
  const targetDir = "content/en/typescript";

  console.log("Starting TypeScript content migration...\n");

  const priorityFiles = [
    "01-typescript-basics.md",
    "02-advanced-types.md",
    "03-generics-deep-dive.md",
    "05-react-typescript.md",
  ];

  for (const file of priorityFiles) {
    await migrateFile(file, targetDir);
  }

  console.log("\n✓ Migration complete!");
  console.log(`\nMigrated ${priorityFiles.length} files to ${targetDir}`);
}

main().catch(console.error);
