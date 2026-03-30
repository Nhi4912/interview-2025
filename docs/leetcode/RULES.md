# LeetCode Documentation Format Specification

> **Purpose**: Standard rules for every problem file in `docs/leetcode/`
> **Version**: 1.0
> **Last updated**: 2026-03-30

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [File Structure Rules](#2-file-structure-rules)
3. [Section-by-Section Specification](#3-section-by-section-specification)
4. [Content Quality Rules](#4-content-quality-rules)
5. [Visualization Requirements](#5-visualization-requirements)
6. [Migration Checklist (Old → New)](#6-migration-checklist-old--new)
7. [Format Template](#7-format-template)
8. [Anti-Patterns](#8-anti-patterns)

---

## 1. Philosophy

### Core Principle

> Mỗi file problem = **một buổi interview mini**
> Each file IS a mini interview session — not a code dump.

**The flow must feel like a real interview:**

```
┌─────────────────────────────────────────────────────────────┐
│  INTERVIEW FLOW                                             │
│                                                             │
│  1. "Tell me how you'd think about this..."  → Intuition   │
│  2. "Here's the problem..."                  → Description  │
│  3. "What would you clarify first?"          → Tips         │
│  4. "Walk me through your approach..."       → Solutions    │
│  5. "What related problems use this pattern?"→ Related      │
│                                                             │
│  This is NOT: problem → 11 solutions → done                │
└─────────────────────────────────────────────────────────────┘
```

### Three Pillars

| Pillar          | What                       | Why                                                         |
| --------------- | -------------------------- | ----------------------------------------------------------- |
| **Understand**  | Intuition + Visual         | Biết tại sao chọn approach này, không phải chỉ code         |
| **Communicate** | Interview Tips + Bilingual | PV = communication, không chỉ coding                        |
| **Connect**     | Related Problems + Pattern | Một pattern giải được 5-10 bài, không học từng bài riêng lẻ |

---

## 2. File Structure Rules

### 2.1 Naming Convention

```
{NN}-{kebab-case-title}.md
```

| Rule                            | Example                            | ❌ Bad                |
| ------------------------------- | ---------------------------------- | --------------------- |
| 2-digit prefix, zero-padded     | `01-two-sum.md`                    | `1-two-sum.md`        |
| Kebab-case (lowercase, hyphens) | `15-longest-common-subsequence.md` | `15_LCS.md`           |
| Match LeetCode problem name     | `07-valid-parentheses.md`          | `07-bracket-check.md` |
| Sequential within category      | Next number in folder              | Random number         |

### 2.2 Folder Structure

```
docs/leetcode/
├── RULES.md                    ← THIS FILE (format spec)
├── index.md                    ← Main index with category links
├── 00-study-guide.md           ← Interview tiers + study plan
├── 00-patterns-index.md        ← 12 patterns with problem maps
├── index.ts                    ← Solution exports (auto-generated)
│
├── array/problems/             ← Category folders
│   ├── 01-two-sum.md
│   ├── 02-...
│   └── ...
├── string/problems/
├── dp/problems/
├── tree-graph/problems/
├── backtracking/problems/
├── linked-list/problems/
├── design/problems/
├── sorting-searching/problems/
├── math/problems/
└── others/problems/
```

### 2.3 Category Assignment Rules

| Category            | When to use                                      | Signal keywords                                   |
| ------------------- | ------------------------------------------------ | ------------------------------------------------- |
| `array`             | Array manipulation, two pointers, sliding window | subarray, in-place, sorted array                  |
| `string`            | String processing, matching                      | substring, palindrome, anagram                    |
| `dp`                | Optimal substructure + overlapping subproblems   | min/max, count ways, true/false possible          |
| `tree-graph`        | Tree traversal, graph search                     | root, node, adjacency, connected                  |
| `backtracking`      | Generate all valid combinations                  | all permutations, all subsets, valid combinations |
| `linked-list`       | Linked list operations                           | ListNode, head, next pointer                      |
| `design`            | Data structure design, system design             | implement, design a class                         |
| `sorting-searching` | Sort algorithms, binary search                   | sorted, find target, kth element                  |
| `math`              | Mathematical formulas, number theory             | prime, gcd, bit manipulation                      |
| `others`            | Stack/queue, monotonic stack, greedy             | next greater, parentheses matching, greedy choice |

---

## 3. Section-by-Section Specification

Every problem file MUST contain these sections **in this exact order**:

```
┌──────────────────────────────────────────┐
│ 1. YAML Frontmatter                      │  ← metadata
│ 2. Title (bilingual)                     │  ← H1 heading
│ 3. Metadata Line                         │  ← track, difficulty, pattern, freq
│ 4. 🧠 Intuition / Tư Duy                │  ← WHY this approach
│ 5. Problem Description                   │  ← WHAT to solve
│ 6. 📝 Interview Tips                     │  ← HOW to communicate
│ 7. Solutions                             │  ← CODE (2-3 max)
│ 8. 🔗 Related Problems                   │  ← WHERE to go next
└──────────────────────────────────────────┘
```

### 3.1 YAML Frontmatter

```yaml
---
layout: page
title: "Two Sum"
difficulty: Easy # Easy | Medium | Hard
category: Array # Match folder name (capitalized)
tags: [Array, Hash Table] # LeetCode tags
leetcode_url: "https://leetcode.com/problems/two-sum/"
---
```

**Rules:**

- `difficulty`: Must be `Easy`, `Medium`, or `Hard` (LeetCode official)
- `category`: Capitalized version of folder name
- `tags`: Array of relevant LeetCode tags (2-5 tags)
- `leetcode_url`: Full URL to LeetCode problem page

### 3.2 Title (Bilingual)

```markdown
# Two Sum / Tổng Hai Số
```

**Rules:**

- H1 heading, exactly one per file
- Format: `# {English Title} / {Vietnamese Title}`
- Vietnamese title = natural translation, not literal word-by-word

### 3.3 Metadata Line

```markdown
> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews
> **See also**: [3Sum](./03-3sum.md) | [Two Sum II](./02-two-sum-ii.md)
```

**Rules:**

| Field      | Required | Values                                         |
| ---------- | -------- | ---------------------------------------------- |
| Track      | Yes      | `Shared` \| `Frontend` \| `Backend`            |
| Difficulty | Yes      | 🟢 Easy \| 🟡 Medium \| 🔴 Hard                |
| Pattern    | Yes      | Primary algorithm pattern name                 |
| Frequency  | Yes      | 🔥 Tier 1 \| ⭐ Tier 2 \| 📘 Tier 3            |
| See also   | Yes      | 1-3 links to related problems (relative paths) |

**Frequency tier rules:**

- 🔥 **Tier 1**: Top 25 must-know problems (>70% interview frequency)
- ⭐ **Tier 2**: Top 25 high-value problems (>40% frequency)
- 📘 **Tier 3**: Remaining problems (good to know)

### 3.4 🧠 Intuition / Tư Duy

This is the **most important section**. It answers: _"Tại sao approach này? Làm sao biết dùng pattern nào?"_

```markdown
## 🧠 Intuition / Tư Duy

**Analogy:** {Vietnamese analogy — real-life comparison, 2-3 sentences}

**Pattern Recognition:**

- Signal: {what in the problem triggers this pattern} → **{Pattern Name}**
- {Key insight 1}
- {Key insight 2}

**Visual — {description}:**
```

{ASCII diagram showing step-by-step execution}

```

```

**Sub-section rules:**

#### Analogy (REQUIRED)

- Written in **Vietnamese** (target audience is Vietnamese dev)
- Must be a **real-life analogy**, not just restating the problem
- 2-3 sentences max
- Connect the analogy to the algorithm choice

#### Pattern Recognition (REQUIRED)

- First bullet: `Signal: {keywords} → **{Pattern}**`
- 2-3 additional bullets explaining WHY this pattern fits
- Must help reader identify the pattern in NEW problems

#### Visual (REQUIRED)

- ASCII art diagram showing algorithm execution step-by-step
- Must show at least one complete example from Problem Description
- Use the notation style from the example below:

```
Example (Monotonic Stack):
  i=0: temp=73. Stack empty → push 0.        stack=[0]
  i=1: temp=74 > temps[0]=73 → pop 0         stack=[1]
  ...

Example (Two Pointers):
  [1, 2, 3, 4, 5, 6, 7]
   L                 R    sum=8 > target=7 → R--
   L              R       sum=7 = target ✅

Example (BFS level-order):
  Level 0:     [3]
  Level 1:   [9, 20]
  Level 2: [15, 7]
```

### 3.5 Problem Description

```markdown
## Problem Description

{Concise problem statement — 2-4 sentences}
```

Example 1: {input} → {output}
Example 2: {input} → {output}

```

Constraints:
- {constraint 1}
- {constraint 2}
```

**Rules:**

- Keep concise — interviewer already knows the problem
- Include 2-3 examples in code block format
- Include key constraints (array size, value range)
- Do NOT copy-paste the entire LeetCode description verbatim

### 3.6 📝 Interview Tips

```markdown
## 📝 Interview Tips

1. **Clarify**: {what to ask interviewer — EN / VI}
2. **Approach**: {how to explain your thinking — EN / VI}
3. **Optimize**: {optimization path brute → optimal — EN / VI}
4. **Edge cases**: {what to mention — EN / VI}
5. **Follow-up**: {common follow-up questions — EN / VI}
```

**Rules:**

- Exactly **4-6 bullets**, numbered
- Each bullet has a **bold label** + bilingual content
- Must include at least: Clarify, Approach, Edge cases
- Written as if coaching someone before a real interview
- Focus on **what to SAY**, not what to code

### 3.7 Solutions

```markdown
## Solutions

{% raw %}

/\*\*

- Solution 1: {Name} ({Brute Force / Sub-optimal / Optimal})
- Time: O(...), Space: O(...)
  \*/
  function solutionName(params: types): returnType {
  // implementation
  }

/\*\*

- Solution 2: {Name} (Optimal)
- Time: O(...), Space: O(...)
  \*/
  function solutionNameOptimal(params: types): returnType {
  // implementation
  }

// === Test Cases ===
console.log(solutionName(example1)); // expected output
console.log(solutionName(example2)); // expected output

{% endraw %}
```

**Rules:**

| Rule                  | Requirement                                       |
| --------------------- | ------------------------------------------------- |
| **Max solutions**     | **2-3 solutions** (brute force + 1-2 optimal)     |
| **Min solutions**     | 2 (always show brute + optimal progression)       |
| **JSDoc header**      | Every solution MUST have name, Time, Space        |
| **Language**          | TypeScript only                                   |
| **Wrapping**          | Must use `{% raw %}` / `{% endraw %}`             |
| **Test cases**        | 3-4 test cases with expected output in comments   |
| **Naming**            | Use descriptive function names, not `solution1`   |
| **Comments**          | Inline comments for non-obvious logic only        |
| **No test harness**   | No `testFunction()`, no `performanceComparison()` |
| **No class wrappers** | No `class SolutionGenerator` patterns             |
| **No exports**        | No `export { ... }` at bottom                     |

**Solution progression pattern:**

```
Solution 1: Brute Force   — O(n²) or worse  — "naive approach"
Solution 2: Optimized      — O(n log n)      — "better approach" (optional)
Solution 3: Optimal        — O(n) or O(log n) — "interview answer"
```

### 3.8 🔗 Related Problems

```markdown
## 🔗 Related Problems

- [{Problem Name}]({relative-path}) — {why it's related, 3-8 words}
- [{Problem Name}]({url-if-not-in-repo}) — {relationship}
```

**Rules:**

- 3-5 related problems
- Use **relative paths** for problems in this repo
- Use LeetCode URLs for problems NOT in this repo
- Each link must explain the relationship (same pattern, harder variant, prerequisite)
- Order: same pattern first, then variants, then prerequisites

---

## 4. Content Quality Rules

### 4.1 Language Rules

| Section                        | Language                                  |
| ------------------------------ | ----------------------------------------- |
| YAML frontmatter               | English                                   |
| Title                          | Bilingual (EN / VI)                       |
| Metadata line                  | English labels, Vietnamese frequency note |
| Intuition: Analogy             | **Vietnamese**                            |
| Intuition: Pattern Recognition | English (technical terms)                 |
| Intuition: Visual              | English (code-style)                      |
| Problem Description            | English                                   |
| Interview Tips                 | **Bilingual** (each bullet)               |
| Solutions                      | English (code + comments)                 |
| Related Problems               | English                                   |

### 4.2 Length Guidelines

| Section             | Target Length     |
| ------------------- | ----------------- |
| Entire file         | **100-200 lines** |
| Intuition           | 20-40 lines       |
| Problem Description | 10-15 lines       |
| Interview Tips      | 6-10 lines        |
| Solutions (total)   | 40-80 lines       |
| Related Problems    | 5-8 lines         |

### 4.3 The "Explain to Interview Partner" Test

Every section must pass this test:

> If I read this section aloud in a mock interview, would it sound natural and demonstrate understanding?

- ❌ "Use dynamic programming" → too vague
- ✅ "Nhận thấy bài này có optimal substructure: kết quả tại step i chỉ phụ thuộc vào step i-1 và i-2, giống dãy Fibonacci" → shows thinking

### 4.4 Complexity Notation

Always use standard Big-O with explanation:

```
Time: O(n log n) — sorting dominates
Space: O(n) — hash map stores at most n elements
```

NOT:

```
Time Complexity: O(n)
Space Complexity: O(1)
```

---

## 5. Visualization Requirements

### 5.1 When to Use Which Diagram Type

```
┌─────────────────────────────────────────────────────────────┐
│  VISUALIZATION DECISION TREE                                │
│                                                             │
│  Is it a data structure transformation?                     │
│  ├── YES → Step-by-step state diagram                       │
│  │         (show stack/queue/heap state at each step)        │
│  │                                                          │
│  Is it pointer movement?                                    │
│  ├── YES → Array with pointer markers                       │
│  │         [1, 2, 3, 4, 5]                                  │
│  │          L        R                                      │
│  │                                                          │
│  Is it a tree/graph?                                        │
│  ├── YES → ASCII tree structure                             │
│  │              3                                           │
│  │            /   \                                         │
│  │           9    20                                        │
│  │                                                          │
│  Is it DP?                                                  │
│  ├── YES → DP table with filled values                      │
│  │         dp[0]=1, dp[1]=1, dp[2]=2, dp[3]=3              │
│  │                                                          │
│  Is it a process/algorithm?                                 │
│  └── YES → Numbered step flow                               │
│            Step 1 → Step 2 → Step 3                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Diagram Style Guide

**Use ASCII art only** (no Mermaid, no images, no external tools).

**Array problems:**

```
nums = [2, 7, 11, 15], target = 9

Step 1: i=0, num=2, need=7
  map = {}  →  7 not found  →  map = {2:0}

Step 2: i=1, num=7, need=2
  map = {2:0}  →  2 found at index 0!  →  return [0, 1] ✅
```

**Tree problems:**

```
        3
       / \
      9   20
         /  \
        15    7

BFS order: [3] → [9, 20] → [15, 7]
Result: [[3], [9,20], [15,7]]
```

**Linked list problems:**

```
Before: 1 → 2 → 3 → 4 → 5 → null
After:  5 → 4 → 3 → 2 → 1 → null

Step 1: prev=null, curr=1
        null ← 1   2 → 3 → 4 → 5
Step 2: prev=1, curr=2
        null ← 1 ← 2   3 → 4 → 5
```

**DP problems:**

```
coins = [1, 2, 5], amount = 11

dp table:
amount:  0  1  2  3  4  5  6  7  8  9  10  11
dp:      0  1  1  2  2  1  2  2  3  3   2   3
         ↑          ↑     ↑
         base    dp[3]=   dp[5]=
         case    dp[1]+1  dp[0]+1
```

**Stack problems:**

```
stack = []   ← push/pop from right

i=0: char='(' → push    stack=['(']
i=1: char='{' → push    stack=['(', '{']
i=2: char='}' → matches stack=['(']
i=3: char=')' → matches stack=[]  → ✅ valid
```

### 5.3 Visualization Checklist

- [ ] Uses ASCII art only (renders in any markdown viewer)
- [ ] Shows at least one complete example from Problem Description
- [ ] Labels each step clearly
- [ ] Shows data structure state changes
- [ ] Uses arrows (→, ←, ↑, ↓) for relationships
- [ ] Uses checkmark (✅) for final answer
- [ ] Fits within 80 characters width

---

## 6. Migration Checklist (Old → New)

Use this checklist when converting old-format files to the new standard.

### What Changes

```
OLD FORMAT (134 files)              →  NEW FORMAT (standard)
─────────────────────────────────      ─────────────────────────────
English-only title                  →  Bilingual title (EN / VI)
Basic metadata (Track, Difficulty)  →  Full metadata (Pattern, Frequency, See also)
No intuition section                →  🧠 Intuition with Analogy + Visual
Minimal problem description         →  Structured description + examples
No interview tips                   →  📝 Interview Tips (4-6 bilingual bullets)
6-11 redundant solutions            →  2-3 focused solutions (brute → optimal)
testFunction() + performance code   →  3-4 inline test cases only
export { ... } at bottom            →  No exports
No related problems                 →  🔗 Related Problems (3-5 links)
~400-650 lines                      →  ~100-200 lines
```

### Step-by-Step Migration

```
For each old file:

1. ☐ Update YAML frontmatter (add missing fields)
2. ☐ Make title bilingual: "# English / Tiếng Việt"
3. ☐ Add full metadata line (Pattern, Frequency, See also)
4. ☐ Write 🧠 Intuition section:
   a. ☐ Vietnamese analogy (2-3 sentences)
   b. ☐ Pattern recognition bullets (Signal → Pattern)
   c. ☐ ASCII visual diagram (step-by-step)
5. ☐ Clean up Problem Description (concise + examples)
6. ☐ Write 📝 Interview Tips (4-6 bilingual bullets)
7. ☐ Reduce solutions to 2-3 max:
   a. ☐ Keep: brute force + optimal (+ 1 mid if useful)
   b. ☐ Remove: redundant variants, class wrappers, generators
   c. ☐ Remove: testFunction(), performanceComparison()
   d. ☐ Remove: export { ... }
   e. ☐ Add JSDoc with Time/Space to each solution
   f. ☐ Add 3-4 inline test cases
8. ☐ Write 🔗 Related Problems (3-5 links)
9. ☐ Verify total file length: 100-200 lines
10. ☐ Verify section order matches spec
```

### Priority Order for Migration

```
WAVE 1 — Tier 1 problems first (25 must-know)
  These are asked >70% of the time. Migrate these ASAP.

WAVE 2 — Tier 2 problems (25 high-value)
  These are asked >40% of the time.

WAVE 3 — Remaining problems
  Migrate as time permits.
```

---

## 7. Format Template

Copy this template for every new problem file:

```markdown
---
layout: page
title: "{Problem Title}"
difficulty: { Easy|Medium|Hard }
category: { Category }
tags: [{ Tag1 }, { Tag2 }]
leetcode_url: "https://leetcode.com/problems/{slug}/"
---

# {English Title} / {Vietnamese Title}

> **Track**: Shared | **Difficulty**: {🟢 Easy|🟡 Medium|🔴 Hard} | **Pattern**: {Pattern Name}
> **Frequency**: {🔥 Tier 1|⭐ Tier 2|📘 Tier 3} — {frequency note}
> **See also**: [{Related 1}]({path}) | [{Related 2}]({path})

---

## 🧠 Intuition / Tư Duy

**Analogy:** {Vietnamese analogy connecting real life to the algorithm, 2-3 sentences}

**Pattern Recognition:**

- Signal: "{keyword triggers}" → **{Pattern Name}**
- {Key insight about why this pattern works}
- {Key insight about the core mechanism}

**Visual — {diagram title}:**
```

{ASCII step-by-step diagram using one example}

```

---

## Problem Description

{Concise problem statement, 2-4 sentences}

```

Example 1: {input} → {output}
Example 2: {input} → {output}
Example 3: {input} → {output}

```

Constraints:
- {size constraint}
- {value constraint}

---

## 📝 Interview Tips

1. **Clarify**: {what to ask — EN / VI}
2. **Brute force**: {explain naive approach — EN / VI}
3. **Optimize**: {explain optimization path — EN / VI}
4. **Edge cases**: {mention edge cases — EN / VI}
5. **Follow-up**: {common follow-up questions — EN / VI}

---

## Solutions

{% raw %}

/**
 * Solution 1: {Name} (Brute Force)
 * Time: O(...) — {explanation}
 * Space: O(...) — {explanation}
 */
function solutionBrute(params: types): returnType {
  // implementation
}

/**
 * Solution 2: {Name} (Optimal)
 * Time: O(...) — {explanation}
 * Space: O(...) — {explanation}
 */
function solutionOptimal(params: types): returnType {
  // implementation
}

// === Test Cases ===
console.log(solutionOptimal(example1)); // expected
console.log(solutionOptimal(example2)); // expected
console.log(solutionOptimal(edge));     // expected

{% endraw %}

---

## 🔗 Related Problems

- [{Problem}]({path}) — {relationship}
- [{Problem}]({path}) — {relationship}
- [{Problem}]({url}) — {relationship}
```

---

## 8. Anti-Patterns

### ❌ DO NOT

| Anti-Pattern                                  | Why It's Bad                                     | ✅ Instead                              |
| --------------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| 11 solution variants                          | Noise — interviewer wants 2, not 11              | 2-3 solutions: brute → optimal          |
| `testFunction()` with console.log harness     | Bloat — not useful in interview                  | 3-4 inline `console.log` assertions     |
| `performanceComparison()`                     | Irrelevant for interview prep                    | Note complexity in JSDoc                |
| `export { ... }` at file bottom               | This is documentation, not a module              | Remove entirely                         |
| `class SubsetGenerator`                       | Over-engineering for interview                   | Simple functions                        |
| English-only content                          | Target audience is Vietnamese dev                | Bilingual throughout                    |
| No intuition section                          | Code without understanding = forgotten in 1 week | Always explain WHY                      |
| Copy-paste LeetCode description               | Too verbose, not interview-style                 | Concise 2-4 sentence summary            |
| `> **Difficulty**: 🟢 Junior → 🔴 Senior`     | Vague, non-standard                              | Use LeetCode official: Easy/Medium/Hard |
| Linking to `../../../00-table-of-contents.md` | Outdated reference                               | Link to specific related problems       |
| Random solution ordering                      | No learning progression                          | Always: brute → optimal                 |

### ❌ Solution Anti-Patterns

```typescript
// ❌ BAD: Solution named "Solution 6: Using Map" — redundant variant
function subsetsMap(nums: number[]): number[][] { ... }

// ❌ BAD: Solution named "Solution 9: Using Class" — over-engineered
class SubsetGenerator { ... }

// ❌ BAD: Solution named "Solution 10: Using Functional" — same algorithm, different style
function subsetsFunctional(nums: number[]): number[][] { ... }

// ✅ GOOD: Only 2-3 solutions with clear progression
function subsets_bruteForce(nums: number[]): number[][] { ... }    // O(2^n) recursive
function subsets_backtracking(nums: number[]): number[][] { ... }  // O(2^n) optimal
function subsets_bitwise(nums: number[]): number[][] { ... }       // O(2^n) alternative
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  LEETCODE FILE QUICK CHECKLIST                  │
│                                                 │
│  ☐ YAML frontmatter complete                    │
│  ☐ Bilingual title (EN / VI)                    │
│  ☐ Full metadata (Pattern + Frequency + See)    │
│  ☐ 🧠 Intuition has:                            │
│    ☐ Vietnamese analogy                         │
│    ☐ Pattern recognition signals                │
│    ☐ ASCII visual diagram                       │
│  ☐ Problem description is concise               │
│  ☐ 📝 4-6 bilingual interview tips              │
│  ☐ 2-3 solutions (brute → optimal)              │
│  ☐ Each solution has JSDoc Time/Space            │
│  ☐ 3-4 inline test cases                        │
│  ☐ 🔗 3-5 related problems with links           │
│  ☐ Total file: 100-200 lines                    │
│  ☐ No test harness, no exports, no class wrapper │
└─────────────────────────────────────────────────┘
```
