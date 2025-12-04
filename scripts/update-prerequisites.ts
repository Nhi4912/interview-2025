#!/usr/bin/env ts-node
/**
 * Prerequisites and Related Topics Updater
 *
 * Analyzes content relationships and updates prerequisites and relatedTopics
 * in metadata based on content analysis and cross-references.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface ContentMetadata {
  id: string;
  slug: string;
  title: { en: string; vi: string };
  category: string;
  difficulty: string;
  prerequisites: string[];
  relatedTopics: string[];
  tags: string[];
  [key: string]: any;
}

interface ContentInfo {
  path: string;
  metadata: ContentMetadata;
  content: string;
  references: string[]; // Content IDs mentioned in the content
}

const CONTENT_EN_DIR = path.join(process.cwd(), "content", "en");
const MAPPING_FILE = path.join(
  process.cwd(),
  "scripts",
  "migration-mapping.json"
);

// Get all MDX files
function getAllMDXFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

// Load content info
function loadContentInfo(filePath: string): ContentInfo | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return {
      path: filePath,
      metadata: data as ContentMetadata,
      content: body,
      references: [],
    };
  } catch (error) {
    console.error(`Failed to load ${filePath}:`, error);
    return null;
  }
}

// Find content references in text
function findContentReferences(
  content: string,
  allContentIds: string[]
): string[] {
  const references = new Set<string>();
  const lowerContent = content.toLowerCase();

  for (const contentId of allContentIds) {
    // Extract key terms from content ID
    const terms = contentId.split("-").filter((t) => t.length > 3);

    // Check if terms appear in content
    if (terms.some((term) => lowerContent.includes(term))) {
      references.add(contentId);
    }
  }

  return Array.from(references);
}

// Infer prerequisites based on difficulty and references
function inferPrerequisites(
  contentInfo: ContentInfo,
  allContent: Map<string, ContentInfo>
): string[] {
  const prerequisites = new Set<string>();
  const { metadata, references } = contentInfo;

  // Add existing prerequisites
  metadata.prerequisites?.forEach((p) => prerequisites.add(p));

  // Find referenced content with lower difficulty
  const difficultyOrder = ["beginner", "intermediate", "advanced", "expert"];
  const currentDifficultyIndex = difficultyOrder.indexOf(metadata.difficulty);

  for (const refId of references) {
    const refContent = allContent.get(refId);
    if (!refContent || refId === metadata.id) continue;

    const refDifficultyIndex = difficultyOrder.indexOf(
      refContent.metadata.difficulty
    );

    // If referenced content is easier and in same category, it's likely a prerequisite
    if (
      refDifficultyIndex < currentDifficultyIndex &&
      refContent.metadata.category === metadata.category
    ) {
      prerequisites.add(refId);
    }
  }

  // Limit to 5 most relevant prerequisites
  return Array.from(prerequisites).slice(0, 5);
}

// Infer related topics based on references and tags
function inferRelatedTopics(
  contentInfo: ContentInfo,
  allContent: Map<string, ContentInfo>
): string[] {
  const relatedTopics = new Set<string>();
  const { metadata, references } = contentInfo;

  // Add existing related topics
  metadata.relatedTopics?.forEach((t) => relatedTopics.add(t));

  // Find content with similar tags
  const myTags = new Set(metadata.tags || []);

  for (const [id, content] of allContent.entries()) {
    if (id === metadata.id) continue;

    const theirTags = new Set(content.metadata.tags || []);
    const commonTags = Array.from(myTags).filter((t) => theirTags.has(t));

    // If 2+ common tags, consider it related
    if (commonTags.length >= 2) {
      relatedTopics.add(id);
    }
  }

  // Add referenced content that's not a prerequisite
  for (const refId of references) {
    if (!metadata.prerequisites?.includes(refId)) {
      relatedTopics.add(refId);
    }
  }

  // Remove prerequisites from related topics
  metadata.prerequisites?.forEach((p) => relatedTopics.delete(p));

  // Limit to 8 most relevant related topics
  return Array.from(relatedTopics).slice(0, 8);
}

// Update metadata in file
function updateMetadata(filePath: string, updates: Partial<ContentMetadata>) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    // Merge updates
    const newData = { ...data, ...updates };

    // Reconstruct frontmatter
    const frontmatter = `---
id: ${newData.id || ""}
slug: ${newData.slug || ""}
title:
  en: "${newData.title?.en?.replace(/"/g, '\\"') || ""}"
  vi: "${newData.title?.vi?.replace(/"/g, '\\"') || ""}"
description:
  en: "${newData.description?.en?.replace(/"/g, '\\"') || ""}"
  vi: "${newData.description?.vi?.replace(/"/g, '\\"') || ""}"
category: ${newData.category || ""}
difficulty: ${newData.difficulty || ""}
estimatedTime: ${newData.estimatedTime || 0}
prerequisites: ${JSON.stringify(newData.prerequisites || [])}
relatedTopics: ${JSON.stringify(newData.relatedTopics || [])}
tags: ${JSON.stringify(newData.tags || [])}
interviewCompanies: ${JSON.stringify(newData.interviewCompanies || [])}
lastUpdated: "${newData.lastUpdated || ""}"
version: "${newData.version || ""}"
hasQuiz: ${newData.hasQuiz || false}
hasCodeExamples: ${newData.hasCodeExamples || false}
hasDiagrams: ${newData.hasDiagrams}
---

`;

    const newContent = frontmatter + body;
    fs.writeFileSync(filePath, newContent, "utf-8");

    // Update Vietnamese version too
    const viPath = filePath.replace("/content/en/", "/content/vi/");
    if (fs.existsSync(viPath)) {
      fs.writeFileSync(viPath, newContent, "utf-8");
    }

    return true;
  } catch (error) {
    console.error(`Failed to update ${filePath}:`, error);
    return false;
  }
}

// Main update function
async function updatePrerequisites() {
  console.log("🔗 Updating prerequisites and related topics...\n");

  // Load all content
  const files = getAllMDXFiles(CONTENT_EN_DIR);
  console.log(`📄 Found ${files.length} files\n`);

  const allContent = new Map<string, ContentInfo>();
  const allContentIds: string[] = [];

  for (const file of files) {
    const info = loadContentInfo(file);
    if (info) {
      allContent.set(info.metadata.id, info);
      allContentIds.push(info.metadata.id);
    }
  }

  console.log(`✓ Loaded ${allContent.size} content files\n`);

  // Find references in each content
  console.log("🔍 Analyzing content references...\n");
  for (const [id, info] of allContent.entries()) {
    info.references = findContentReferences(info.content, allContentIds);
  }

  // Update prerequisites and related topics
  console.log("📝 Updating metadata...\n");
  let updated = 0;

  for (const [id, info] of allContent.entries()) {
    const prerequisites = inferPrerequisites(info, allContent);
    const relatedTopics = inferRelatedTopics(info, allContent);

    const hasChanges =
      JSON.stringify(prerequisites) !==
        JSON.stringify(info.metadata.prerequisites) ||
      JSON.stringify(relatedTopics) !==
        JSON.stringify(info.metadata.relatedTopics);

    if (hasChanges) {
      const success = updateMetadata(info.path, {
        prerequisites,
        relatedTopics,
      });

      if (success) {
        console.log(`✓ Updated: ${path.relative(process.cwd(), info.path)}`);
        console.log(`  Prerequisites: ${prerequisites.length}`);
        console.log(`  Related topics: ${relatedTopics.length}`);
        updated++;
      }
    }
  }

  console.log(`\n✅ Updated ${updated} files\n`);
}

// Run update
updatePrerequisites().catch(console.error);
