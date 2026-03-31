#!/usr/bin/env node
/**
 * Regenerate category index.md + README.md files with accurate problem counts.
 * Scans each category's problems/ directory, reads frontmatter for difficulty,
 * and generates a proper index following the existing template pattern.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const LEETCODE_DIR = join(process.cwd(), 'docs/leetcode');

const CATEGORIES = {
  'array': { name: 'Array', description: 'Two pointers, sliding window, intervals, matrix, prefix sum, hash map' },
  'string': { name: 'String', description: 'Pattern matching, palindrome, substring, anagram, sliding window' },
  'dp': { name: 'Dynamic Programming', description: 'Fibonacci, knapsack, LIS, LCS, grid DP, state machine' },
  'tree-graph': { name: 'Tree & Graph', description: 'DFS, BFS, BST, topological sort, shortest path, union-find' },
  'backtracking': { name: 'Backtracking', description: 'Subsets, permutations, combinations, constraint satisfaction' },
  'linked-list': { name: 'Linked List', description: 'Reversal, merge, cycle detection, two pointers' },
  'design': { name: 'Design', description: 'LRU Cache, data structure design, OOP design, system components' },
  'sorting-searching': { name: 'Sorting & Searching', description: 'Binary search, merge sort, quick select, partitioning' },
  'math': { name: 'Math', description: 'Number theory, bit manipulation, geometry, combinatorics' },
  'others': { name: 'Stack & Queue / Others', description: 'Valid parentheses, monotonic stack, queue patterns, miscellaneous' },
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return fm;
}

let totalAll = 0;
let totalEasy = 0, totalMedium = 0, totalHard = 0;
const categorySummaries = [];

for (const [slug, meta] of Object.entries(CATEGORIES)) {
  const dir = join(LEETCODE_DIR, slug, 'problems');
  if (!existsSync(dir)) {
    console.log(`Skip ${slug} — no problems dir`);
    continue;
  }

  const files = readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  const problems = [];

  for (const file of files) {
    const content = readFileSync(join(dir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = fm.title || (titleMatch ? titleMatch[1] : file.replace('.md', ''));
    const difficulty = fm.difficulty || 'Medium';
    const url = fm.leetcode_url || '';
    const isHandcrafted = !content.includes("throw new Error('Not implemented')");

    problems.push({ file, title, difficulty, url, isHandcrafted });
  }

  const easy = problems.filter(p => p.difficulty === 'Easy').length;
  const medium = problems.filter(p => p.difficulty === 'Medium').length;
  const hard = problems.filter(p => p.difficulty === 'Hard').length;
  const handcrafted = problems.filter(p => p.isHandcrafted).length;

  totalAll += problems.length;
  totalEasy += easy;
  totalMedium += medium;
  totalHard += hard;

  categorySummaries.push({
    slug, name: meta.name, total: problems.length,
    easy, medium, hard, handcrafted
  });

  // Build difficulty breakdown string
  const diffParts = [];
  if (easy) diffParts.push(`🟢 Easy: ${easy}`);
  if (medium) diffParts.push(`🟡 Medium: ${medium}`);
  if (hard) diffParts.push(`🔴 Hard: ${hard}`);

  // Build problem list (show first 30 hand-crafted, then summarize generated)
  const handcraftedProblems = problems.filter(p => p.isHandcrafted);
  const generatedProblems = problems.filter(p => !p.isHandcrafted);

  let problemList = '';

  if (handcraftedProblems.length > 0) {
    problemList += '### Hand-Crafted Solutions (Full)\n\n';
    for (const p of handcraftedProblems) {
      const emoji = p.difficulty === 'Easy' ? '🟢' : p.difficulty === 'Hard' ? '🔴' : '🟡';
      problemList += `- [${p.title}](problems/${p.file}) - **${emoji} ${p.difficulty}**`;
      if (p.url) problemList += ` - [LeetCode](${p.url})`;
      problemList += '\n';
    }
  }

  if (generatedProblems.length > 0) {
    problemList += `\n### Generated Skeletons (${generatedProblems.length} problems)\n\n`;
    problemList += `> These problems have been identified from company interview data. Each file contains the problem structure, metadata, and placeholder for solutions. Contribute by implementing solutions!\n\n`;

    // Group by difficulty
    for (const diff of ['Easy', 'Medium', 'Hard']) {
      const group = generatedProblems.filter(p => p.difficulty === diff);
      if (group.length === 0) continue;
      const emoji = diff === 'Easy' ? '🟢' : diff === 'Hard' ? '🔴' : '🟡';
      problemList += `<details>\n<summary>${emoji} ${diff} (${group.length} problems)</summary>\n\n`;
      for (const p of group) {
        problemList += `- [${p.title}](problems/${p.file})`;
        if (p.url) problemList += ` - [LeetCode](${p.url})`;
        problemList += '\n';
      }
      problemList += `\n</details>\n\n`;
    }
  }

  const today = new Date().toISOString().split('T')[0];

  const indexContent = `---
layout: page
title: "${meta.name} Problems"
category: ${meta.name}
description: "LeetCode ${meta.name} problems with TypeScript solutions"
total_problems: ${problems.length}
tags: [${meta.name}, LeetCode, Interview Preparation]
---

# ${meta.name} Problems

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../index.md) | [Patterns Index](../00-patterns-index.md) | [Study Guide](../00-study-guide.md)

## 📊 Overview

- **Total Problems**: ${problems.length} (${handcrafted} with full solutions, ${problems.length - handcrafted} skeletons)
- **Difficulty Range**: ${diffParts.join(' | ')}
- **Language**: TypeScript
- **Focus**: Technical interview preparation

## 📋 Problem List

${problemList}

## 🎯 Key Concepts

${meta.description.split(', ').map(c => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n')}

## 📚 Study Strategy

### Beginner Level
1. Start with 🟢 Easy problems — build pattern recognition
2. Focus on understanding the approach before optimizing
3. Write brute force first, then optimize

### Intermediate Level
1. Tackle 🟡 Medium problems — these are interview staples
2. Practice identifying patterns quickly
3. Aim for optimal time/space complexity

### Advanced Level
1. Master 🔴 Hard problems for senior-level interviews
2. Practice follow-up variations and edge cases
3. Focus on clean code and clear communication

## 🔗 Navigation

- [Back to LeetCode Index](../index.md)
- [All Categories](../index.md)
- [Patterns Index](../00-patterns-index.md)

---
**Total Problems: ${problems.length}** | **Last Updated: ${today}**
`;

  // Write both index.md and README.md
  writeFileSync(join(LEETCODE_DIR, slug, 'index.md'), indexContent);
  writeFileSync(join(LEETCODE_DIR, slug, 'README.md'), indexContent);
  console.log(`✓ ${slug}: ${problems.length} problems (${handcrafted} hand-crafted, ${problems.length - handcrafted} generated)`);
}

// Print summary
console.log(`\n=== Summary ===`);
console.log(`Total: ${totalAll} problems (🟢 ${totalEasy} Easy | 🟡 ${totalMedium} Medium | 🔴 ${totalHard} Hard)`);
for (const s of categorySummaries) {
  console.log(`  ${s.name}: ${s.total} (${s.handcrafted} crafted)`);
}
