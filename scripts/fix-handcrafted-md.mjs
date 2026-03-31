#!/usr/bin/env node
/**
 * Fix hand-crafted LeetCode problem .md files:
 * 1. Replace {% raw %} with ```typescript fenced code blocks
 * 2. Replace {% endraw %} with closing ```
 * 3. Fix escaped JSDoc: /\*\* → /**, \*\/ → *\/
 * 4. Fix escaped markdown: \*\* → **, \_ → _
 * 5. Skip generated files (contain "throw new Error('Not implemented')")
 * 6. Skip company-wise directory
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const LEETCODE_DIR = join(process.cwd(), 'docs/leetcode');
const CATEGORIES = [
  'array', 'string', 'dp', 'tree-graph', 'backtracking',
  'linked-list', 'design', 'sorting-searching', 'math', 'others'
];

let fixed = 0;
let skipped = 0;
let errors = [];

for (const cat of CATEGORIES) {
  const dir = join(LEETCODE_DIR, cat, 'problems');
  let files;
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.md'));
  } catch {
    console.log(`  Skip ${cat} — no problems dir`);
    continue;
  }

  for (const file of files) {
    const path = join(dir, file);
    let content = readFileSync(path, 'utf-8');

    // Skip if no {% raw %} — nothing to fix
    if (!content.includes('{% raw %}')) {
      skipped++;
      continue;
    }

    // Skip generated files
    if (content.includes("throw new Error('Not implemented')")) {
      skipped++;
      continue;
    }

    const original = content;

    // 1. Replace {% raw %} with ```typescript
    content = content.replace(/\{%\s*raw\s*%\}/g, '```typescript');

    // 2. Replace {% endraw %} with ```
    content = content.replace(/\{%\s*endraw\s*%\}/g, '```');

    // 3. Fix escaped JSDoc comments (only inside code blocks)
    // These are the patterns: /\*\* → /**, \*/ → */
    content = content.replace(/\/\\\*\\\*/g, '/**');
    content = content.replace(/\\\*\//g, '*/');

    // 4. Fix standalone escaped asterisks in code (e.g., \* in comments)
    // Be careful: only fix \* that's inside code blocks, not markdown bold
    // We handle this by fixing within code fence regions
    const lines = content.split('\n');
    let inCodeBlock = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trimStart().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) {
        // Fix escaped asterisks in code: \* → * (but not \*\* which was already handled)
        lines[i] = lines[i].replace(/\\\*/g, '*');
        // Fix escaped underscores in code: \_ → _
        lines[i] = lines[i].replace(/\\_/g, '_');
      }
    }
    content = lines.join('\n');

    if (content !== original) {
      writeFileSync(path, content);
      fixed++;
      console.log(`  ✓ Fixed: ${cat}/problems/${file}`);
    } else {
      skipped++;
    }
  }
}

console.log(`\nDone: ${fixed} files fixed, ${skipped} skipped`);
if (errors.length) {
  console.log('Errors:', errors);
}
