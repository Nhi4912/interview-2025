#!/usr/bin/env node
/**
 * Generate company-wise LeetCode problem markdown files.
 *
 * Reads CSV data from docs/interview-company-wise-problems/{Company}/5. All.csv
 * Outputs markdown files to docs/leetcode/company-wise/{company-slug}.md
 * Plus a master index.md and README.md
 *
 * Usage: node scripts/generate-company-problems.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE_DIR = join(ROOT, "docs/interview-company-wise-problems");
const OUTPUT_DIR = join(ROOT, "docs/leetcode/company-wise");
const PROBLEMS_DIR = join(OUTPUT_DIR, "problems");

// ---------------------------------------------------------------------------
// CSV Parsing (no external deps)
// ---------------------------------------------------------------------------

/**
 * Parse a CSV line handling quoted fields with commas inside.
 * e.g.  EASY,Two Sum,100.0,0.55,https://...,,"Array, Hash Table"
 */
function parseCSVLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSV(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Skip header: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
  return lines.slice(1).map((line) => {
    const [difficulty, title, frequency, acceptanceRate, link, topics] = parseCSVLine(line);
    return {
      difficulty: (difficulty || "").toUpperCase(),
      title: title || "",
      frequency: parseFloat(frequency) || 0,
      acceptanceRate: parseFloat(acceptanceRate) || 0,
      link: link || "",
      topics: topics
        ? topics
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
  });
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function difficultyEmoji(d) {
  switch (d) {
    case "EASY":
      return "🟢 Easy";
    case "MEDIUM":
      return "🟡 Medium";
    case "HARD":
      return "🔴 Hard";
    default:
      return d;
  }
}

function difficultySort(d) {
  switch (d) {
    case "EASY":
      return 0;
    case "MEDIUM":
      return 1;
    case "HARD":
      return 2;
    default:
      return 3;
  }
}

// ---------------------------------------------------------------------------
// Markdown generation
// ---------------------------------------------------------------------------

function generateCompanyMd(companyName, problems) {
  const slug = toSlug(companyName);
  const easy = problems.filter((p) => p.difficulty === "EASY").length;
  const medium = problems.filter((p) => p.difficulty === "MEDIUM").length;
  const hard = problems.filter((p) => p.difficulty === "HARD").length;

  // Sort by frequency descending
  const sorted = [...problems].sort((a, b) => b.frequency - a.frequency);

  // Top 3 topics by occurrence
  const topicCount = {};
  for (const p of problems) {
    for (const t of p.topics) {
      topicCount[t] = (topicCount[t] || 0) + 1;
    }
  }
  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);

  // Build problem table rows
  const rows = sorted
    .map((p, i) => {
      const acc = (p.acceptanceRate * 100).toFixed(1) + "%";
      const freq = p.frequency.toFixed(1);
      const topics = p.topics.slice(0, 3).join(", ") || "-";
      const titleLink = p.link ? `[${p.title}](${p.link})` : p.title;
      return `| ${i + 1} | ${titleLink} | ${difficultyEmoji(p.difficulty)} | ${freq} | ${acc} | ${topics} |`;
    })
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);

  return `---
layout: page
title: "${companyName} - LeetCode Problems"
company: "${companyName}"
total_problems: ${problems.length}
tags: [Company, ${companyName}, LeetCode, Interview Preparation]
---

# ${companyName} - LeetCode Problems

> **Total Problems**: ${problems.length} | **Top Topics**: ${topTopics.join(", ") || "N/A"}

## 📊 Difficulty Breakdown

| Difficulty | Count | Percentage |
|-----------|-------|------------|
| 🟢 Easy | ${easy} | ${problems.length ? ((easy / problems.length) * 100).toFixed(0) : 0}% |
| 🟡 Medium | ${medium} | ${problems.length ? ((medium / problems.length) * 100).toFixed(0) : 0}% |
| 🔴 Hard | ${hard} | ${problems.length ? ((hard / problems.length) * 100).toFixed(0) : 0}% |

## 📋 Problem List

> Sorted by interview frequency (highest first)

| # | Problem | Difficulty | Freq | Acceptance | Topics |
|---|---------|-----------|------|------------|--------|
${rows}

## 🏷️ Topic Distribution

${
  Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([topic, count]) => `- **${topic}**: ${count} problems`)
    .join("\n") || "No topic data available."
}

---

**Total Problems: ${problems.length}** | **Last Updated: ${today}**

[← Back to Company Index](./index.md) | [← Back to LeetCode Index](../index.md)
`;
}

function generateIndexMd(companies) {
  // companies: Array<{ name, slug, problems, easy, medium, hard, topTopic }>
  const totalProblems = new Set();
  for (const c of companies) {
    for (const p of c.problems) {
      totalProblems.add(p.link);
    }
  }

  const sorted = [...companies].sort((a, b) => a.name.localeCompare(b.name));

  const today = new Date().toISOString().slice(0, 10);

  // Company size tiers
  const tier1 = sorted.filter((c) => c.count >= 80);
  const tier2 = sorted.filter((c) => c.count >= 30 && c.count < 80);
  const tier3 = sorted.filter((c) => c.count < 30);

  function companyRow(c) {
    return `| [${c.name}](problems/${c.slug}.md) | ${c.count} | ${c.easy} | ${c.medium} | ${c.hard} | ${c.topTopic || "-"} |`;
  }

  const tableHeader = `| Company | Problems | Easy | Medium | Hard | Top Topic |
|---------|---------|------|--------|------|-----------|`;

  return `---
layout: page
title: "Company-Wise LeetCode Problems"
description: "LeetCode problems organized by company interview frequency"
total_companies: ${companies.length}
total_unique_problems: ${totalProblems.size}
tags: [Company, LeetCode, Interview Preparation]
---

# Company-Wise LeetCode Problems

> **Total Companies**: ${companies.length} | **Unique Problems**: ${totalProblems.size}
> **Source**: Interview frequency data sorted by how often each problem appears

## 📊 Overview

- **${tier1.length}** companies with 80+ problems (major tech)
- **${tier2.length}** companies with 30-79 problems (mid-size / active hiring)
- **${tier3.length}** companies with <30 problems (smaller / niche)

## 🔥 Top Companies (80+ problems)

${tableHeader}
${tier1.map(companyRow).join("\n")}

## 🏢 Active Companies (30-79 problems)

${tableHeader}
${tier2.map(companyRow).join("\n")}

## 📋 All Other Companies (<30 problems)

<details>
<summary>Click to expand (${tier3.length} companies)</summary>

${tableHeader}
${tier3.map(companyRow).join("\n")}

</details>

---

**Total Companies: ${companies.length}** | **Unique Problems: ${totalProblems.size}** | **Last Updated: ${today}**

[← Back to LeetCode Index](../index.md)
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // Ensure output dirs exist
  mkdirSync(PROBLEMS_DIR, { recursive: true });

  const companyDirs = readdirSync(SOURCE_DIR).filter((d) => {
    const csvPath = join(SOURCE_DIR, d, "5. All.csv");
    return existsSync(csvPath);
  });

  console.log(`Found ${companyDirs.length} companies with "5. All.csv"`);

  const companySummaries = [];

  for (const companyDir of companyDirs) {
    const csvPath = join(SOURCE_DIR, companyDir, "5. All.csv");
    const csvText = readFileSync(csvPath, "utf-8");
    const problems = parseCSV(csvText);

    if (problems.length === 0) {
      console.warn(`  SKIP: ${companyDir} (no problems)`);
      continue;
    }

    const slug = toSlug(companyDir);
    const md = generateCompanyMd(companyDir, problems);
    const outPath = join(PROBLEMS_DIR, `${slug}.md`);
    writeFileSync(outPath, md, "utf-8");

    // Gather stats for index
    const easy = problems.filter((p) => p.difficulty === "EASY").length;
    const medium = problems.filter((p) => p.difficulty === "MEDIUM").length;
    const hard = problems.filter((p) => p.difficulty === "HARD").length;

    const topicCount = {};
    for (const p of problems) {
      for (const t of p.topics) {
        topicCount[t] = (topicCount[t] || 0) + 1;
      }
    }
    const topTopic = Object.entries(topicCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";

    companySummaries.push({
      name: companyDir,
      slug,
      count: problems.length,
      easy,
      medium,
      hard,
      topTopic,
      problems,
    });
  }

  // Sort by problem count descending for summary
  companySummaries.sort((a, b) => b.count - a.count);

  console.log(`\nGenerated ${companySummaries.length} company files`);
  console.log(`Top 10 by problem count:`);
  for (const c of companySummaries.slice(0, 10)) {
    console.log(`  ${c.name}: ${c.count} (E:${c.easy} M:${c.medium} H:${c.hard})`);
  }

  // Generate index
  const indexMd = generateIndexMd(companySummaries);
  writeFileSync(join(OUTPUT_DIR, "index.md"), indexMd, "utf-8");
  writeFileSync(join(OUTPUT_DIR, "README.md"), indexMd, "utf-8");

  console.log(`\nIndex written to ${OUTPUT_DIR}/index.md`);
  console.log("Done!");
}

main();
