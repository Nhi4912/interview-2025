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
  "01-architecture-patterns.md": {
    id: "sd-architecture-patterns",
    slug: "architecture-patterns",
    difficulty: "advanced",
    estimatedTime: 90,
    prerequisites: ["cs-design-patterns"],
    tags: ["system-design", "architecture", "patterns", "scalability"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "02-scalability.md": {
    id: "sd-scalability",
    slug: "scalability",
    difficulty: "advanced",
    estimatedTime: 85,
    prerequisites: ["sd-architecture-patterns"],
    tags: ["system-design", "scalability", "load-balancing", "distributed"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "03-caching.md": {
    id: "sd-caching",
    slug: "caching",
    difficulty: "intermediate",
    estimatedTime: 70,
    prerequisites: ["sd-architecture-patterns"],
    tags: ["system-design", "caching", "performance", "redis"],
    interviewCompanies: ["google", "meta", "amazon"],
  },
  "04-microservices.md": {
    id: "sd-microservices",
    slug: "microservices",
    difficulty: "advanced",
    estimatedTime: 95,
    prerequisites: ["sd-architecture-patterns"],
    tags: ["system-design", "microservices", "distributed", "architecture"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
  "05-database-design.md": {
    id: "sd-database-design",
    slug: "database-design",
    difficulty: "intermediate",
    estimatedTime: 80,
    prerequisites: ["cs-data-structures"],
    tags: ["system-design", "database", "sql", "nosql", "design"],
    interviewCompanies: ["google", "meta", "amazon", "microsoft"],
  },
};

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

function generateVietnameseTitle(enTitle: string): string {
  const titleMap: Record<string, string> = {
    "Architecture Patterns": "Các mẫu kiến trúc",
    Scalability: "Khả năng mở rộng",
    Caching: "Caching (Bộ nhớ đệm)",
    Microservices: "Microservices",
    "Database Design": "Thiết kế cơ sở dữ liệu",
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
    en: `Master ${title} for system design interviews, including real-world examples and best practices for top tech companies.`,
    vi: `Làm chủ ${title} cho phỏng vấn thiết kế hệ thống, bao gồm ví dụ thực tế và best practices cho các công ty công nghệ hàng đầu.`,
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
  const sourcePath = path.join("docs/09-system-design", sourceFile);

  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping ${fileName} - file not found`);
    return;
  }

  const content = fs.readFileSync(sourcePath, "utf-8");
  const title = extractTitle(content);

  const baseMetadata = contentMapping[fileName] || {
    id: fileName.replace(".md", ""),
    slug: fileName.replace(".md", ""),
    difficulty: "advanced" as const,
    estimatedTime: 80,
    prerequisites: [],
    tags: ["system-design"],
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
    category: "system-design",
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
      content.includes("```mermaid") ||
      content.includes("Visualization") ||
      content.includes("Architecture"),
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
  const targetDir = "content/en/system-design";

  console.log("Starting System Design content migration...\n");

  const priorityFiles = [
    "01-architecture-patterns.md",
    "02-scalability.md",
    "03-caching.md",
    "04-microservices.md",
    "05-database-design.md",
  ];

  for (const file of priorityFiles) {
    await migrateFile(file, targetDir);
  }

  console.log("\n✓ Migration complete!");
  console.log(`\nMigrated ${priorityFiles.length} files to ${targetDir}`);
}

main().catch(console.error);
