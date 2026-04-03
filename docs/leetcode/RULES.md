# LeetCode Documentation Format Specification

> **Purpose**: Standard rules for every problem file in `docs/leetcode/`
> **Version**: 2.0
> **Last updated**: 2026-04-02

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

> Mỗi file problem = **một buổi interview mini + hệ thống ghi nhớ dài hạn**
> Each file IS a mini interview session with built-in long-term retention — not a code dump.

**The flow must feel like a real interview + study system:**

```
┌─────────────────────────────────────────────────────────────────┐
│  INTERVIEW + RETENTION FLOW (v2.0 — 12 Sections)               │
│                                                                 │
│  1. "Tell me how you'd think about this..."  → Intuition       │
│  2. "How do you recognize this pattern?"     → Pattern Trigger  │
│  3. "Here's the problem..."                  → Description      │
│  4. "Walk me through your approach..."       → Interview Script │
│  5. "What would you clarify first?"          → Tips             │
│  6. "What mistakes do people make?"          → Common Mistakes  │
│  7. "Show me the code..."                    → Solutions        │
│  8. "What related problems use this pattern?"→ Related          │
│  9. "How confident are you?"                 → Self-Assessment  │
│                                                                 │
│  This is NOT: problem → 11 solutions → done                    │
│  This IS: understand → recognize → communicate → code → reflect│
└─────────────────────────────────────────────────────────────────┘
```

### Four Pillars

| Pillar          | What                             | Why                                                         |
| --------------- | -------------------------------- | ----------------------------------------------------------- |
| **Understand**  | Intuition + Visual               | Biết tại sao chọn approach này, không phải chỉ code         |
| **Recognize**   | Pattern Trigger + Interview Flow | Nhìn bài mới → tự biết dùng pattern nào trong 30 giây       |
| **Communicate** | Interview Script + Tips          | PV = communication, không chỉ coding                        |
| **Retain**      | SRS + Self-Assessment + Mistakes | Nhớ lâu, nhớ dai — không học xong quên sau 1 tuần           |

### Learning Science Integration

This template integrates 5 evidence-based methods from `LEARNING-METHODOLOGY.md`:

| Method | Where Applied | Retention Boost |
|--------|--------------|-----------------|
| **Spaced Repetition (SRS)** | Self-Assessment → review dates in YAML | +74% retention |
| **Active Recall** | Pattern Trigger → "see X, think Y" from memory | +50% retention |
| **Feynman Technique** | Intuition → Vietnamese analogy a non-coder understands | Deep understanding |
| **Dual Coding** | Visual → ASCII diagram + text explanation | +89% transfer |
| **Interleaving** | Related Problems → connect across categories | +76% transfer |

---

## 2. File Structure Rules

### 2.1 Naming Convention

```
{NN}-{kebab-case-title}.md
```

| Rule                            | Example                            | Bad                   |
| ------------------------------- | ---------------------------------- | --------------------- |
| 2-digit prefix, zero-padded     | `01-two-sum.md`                    | `1-two-sum.md`        |
| Kebab-case (lowercase, hyphens) | `15-longest-common-subsequence.md` | `15_LCS.md`           |
| Match LeetCode problem name     | `07-valid-parentheses.md`          | `07-bracket-check.md` |
| Sequential within category      | Next number in folder              | Random number         |

### 2.2 Folder Structure

```
docs/leetcode/
├── RULES.md                    ← THIS FILE (format spec v2.0)
├── index.md                    ← Main index with category links
├── 00-study-guide.md           ← Interview tiers + study plan
├── 00-patterns-index.md        ← 12 patterns with problem maps
├── 00-master-tracker.md        ← All problems tracking + SRS queue
├── 00-daily-study-calendar.md  ← 6-9 month study schedule
├── 00-company-dashboard.md     ← Company × pattern heatmap
├── 00-motivation.md            ← Quotes, milestones, streaks
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
├── stack-queue/problems/       ← (renamed from others/)
├── heap/problems/              ← Top K, Median patterns
├── greedy/problems/            ← Greedy choice patterns
├── bit-manipulation/problems/  ← Bit tricks
└── company-wise/               ← Company problem mapping
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
| `math`              | Mathematical formulas, number theory             | prime, gcd, modular arithmetic                    |
| `stack-queue`       | Stack/queue patterns, monotonic stack            | next greater, parentheses matching, FIFO/LIFO     |
| `heap`              | Priority queue, top-K, median                    | kth largest, merge k sorted, median stream        |
| `greedy`            | Local optimal → global optimal                   | greedy choice, interval scheduling, minimum cost  |
| `bit-manipulation`  | Bitwise operations, XOR tricks                   | single number, power of two, bit count            |

---

## 3. Section-by-Section Specification

Every problem file MUST contain these 12 sections **in this exact order**:

```
┌──────────────────────────────────────────────┐
│  1. YAML Frontmatter                         │  ← metadata + SRS tracking
│  2. Title (bilingual)                        │  ← H1 heading
│  3. Metadata Line                            │  ← track, difficulty, pattern, freq, time
│  4. 🧠 Intuition / Tư Duy                   │  ← WHY this approach
│  5. 🎯 Pattern Trigger / Nhận Dạng          │  ← WHEN to use (quick-ref)
│  6. Problem Description                      │  ← WHAT to solve
│  7. 🗣️ Interview Script / Kịch Bản PV       │  ← WHAT TO SAY (5-step UMPIRE)
│  8. 📝 Interview Tips                        │  ← HOW to communicate
│  9. ❌ Common Mistakes / Sai Lầm            │  ← WHAT TO AVOID
│  10. Solutions                               │  ← CODE (2-3 max)
│  11. 🔗 Related Problems                     │  ← WHERE to go next
│  12. 📊 Self-Assessment / Tự Đánh Giá       │  ← TRACK your progress
└──────────────────────────────────────────────┘
```

### 3.1 YAML Frontmatter

```yaml
---
layout: page
title: "Two Sum"
difficulty: Easy              # Easy | Medium | Hard
category: Array               # Match folder name (capitalized)
tags: [Array, Hash Table]     # LeetCode tags (2-5)
leetcode_url: "https://leetcode.com/problems/two-sum/"
leetcode_number: 1            # LeetCode problem number
pattern: "Hash Map"           # Primary algorithm pattern
frequency_tier: 1             # 1 | 2 | 3
companies: [Google, Amazon, Meta, Microsoft]  # Known asking companies
target_time_minutes: 10       # Target solve time (Easy: 10, Medium: 20, Hard: 35)
# === SRS Tracking (filled by learner) ===
status: "unsolved"            # unsolved | in-progress | solved | needs-review
confidence: null              # 1-5 after solving
solve_count: 0                # Times solved
last_reviewed: null           # YYYY-MM-DD
srs_dates: []                 # Next review dates: [+1d, +3d, +7d, +14d, +30d]
---
```

**Rules:**

- `difficulty`: Must be `Easy`, `Medium`, or `Hard` (LeetCode official)
- `category`: Capitalized version of folder name
- `tags`: Array of relevant LeetCode tags (2-5 tags)
- `leetcode_url`: Full URL to LeetCode problem page
- `leetcode_number`: Official LeetCode problem number
- `pattern`: Primary algorithm pattern (must match patterns-index)
- `frequency_tier`: 1 (must-know), 2 (high-value), 3 (good-to-know)
- `companies`: Array of companies known to ask this problem
- `target_time_minutes`: Easy=10, Medium=20, Hard=35 (adjust if problem is unusually complex)
- `status`: Learner fills this as they progress
- `confidence`: 1=forgot, 2=struggled, 3=solved with hints, 4=solved clean, 5=can teach it
- `srs_dates`: Auto-calculated after first solve: [+1d, +3d, +7d, +14d, +30d]

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
> **Frequency**: 🔥 Tier 1 — Gặp >90% interviews | **Target**: ⏱️ 10 min
> **Companies**: Google, Amazon, Meta, Microsoft
> **See also**: [3Sum](./03-3sum.md) | [Two Sum II](./02-two-sum-ii.md)
```

**Rules:**

| Field      | Required | Values                                          |
| ---------- | -------- | ----------------------------------------------- |
| Track      | Yes      | `Shared` \| `Frontend` \| `Backend`             |
| Difficulty | Yes      | 🟢 Easy \| 🟡 Medium \| 🔴 Hard                 |
| Pattern    | Yes      | Primary algorithm pattern name                  |
| Frequency  | Yes      | 🔥 Tier 1 \| ⭐ Tier 2 \| 📘 Tier 3             |
| Target     | Yes      | ⏱️ {minutes} min                                |
| Companies  | Yes      | Top 3-5 companies that ask this problem          |
| See also   | Yes      | 1-3 links to related problems (relative paths)  |

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
- See [Section 5: Visualization Requirements](#5-visualization-requirements)

### 3.5 🎯 Pattern Trigger / Nhận Dạng (NEW in v2.0)

Quick-reference decision rule. Distinct from Intuition — this is a **one-glance cheat sheet** for pattern recognition during active recall.

```markdown
## 🎯 Pattern Trigger / Nhận Dạng

| Trigger | Response |
|---------|----------|
| **When you see** | "find two numbers", "complement", "pair that sums to" |
| **Think** | Hash Map — store complement, check on each iteration |
| **Template** | `map.set(target - nums[i], i)` → check `map.has(nums[i])` |
| **Time target** | ⏱️ 10 min (Easy) |

> 💡 **Memory hook / Móc nhớ:** "HashMap = sổ wish list — ghi những gì cần tìm, khi gặp thì match!"
```

**Rules:**

- **When you see**: 2-3 keyword triggers from problem statements
- **Think**: Pattern name + one-sentence mechanism
- **Template**: Core code snippet (1-2 lines max)
- **Time target**: Expected solve time by difficulty
- **Memory hook**: One memorable sentence in Vietnamese — mnemonic, metaphor, or killer phrase
- Total section: **5-8 lines** (must be scannable in 10 seconds)

### 3.6 Problem Description

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

### 3.7 🗣️ Interview Script / Kịch Bản Phỏng Vấn (NEW in v2.0)

This is the **highest-impact new section**. It scripts exactly what to say in a real interview, following the UMPIRE method (Understand, Match, Plan, Implement, Review, Evaluate).

```markdown
## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)
> "Let me make sure I understand. We have {input description}.
> We need to find {output description}.
> Clarification: {key question}? → {expected answer}"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)
> "My first thought is {brute force} — that's O({complexity}).
> But I notice {key insight that triggers pattern}.
> I'll use {pattern name} because {reason}.
> This gives O({time}) time, O({space}) space."

### Step 3 — Implement / Viết Code (5-7 min)
> "I'll {high-level implementation description}.
> {Key implementation detail 1}.
> {Key implementation detail 2}."

### Step 4 — Review / Kiểm Tra (1-2 min)
> "Let me trace through: {example}.
> {Step-by-step trace showing correctness}.
> → Result: {expected output}. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)
> "Time: O({time}) — {why}. Space: O({space}) — {why}.
> Edge cases: {list 2-3}.
> Could optimize further by {if applicable, else 'this is optimal'}."
```

**Rules:**

- Each step has a **bold label**, **time estimate**, and **quoted speech**
- Quoted speech = exact words you'd say to an interviewer
- Step 2 MUST show the thinking progression: brute force → recognize pattern → choose approach
- Step 4 MUST trace through a specific example
- Step 5 MUST mention time/space complexity and edge cases
- Written in **English** (interview language) with Vietnamese step labels
- Total: **15-25 lines**

### 3.8 📝 Interview Tips

```markdown
## 📝 Interview Tips

1. **Clarify**: {what to ask interviewer — EN / VI}
2. **Brute force**: {explain naive approach — EN / VI}
3. **Optimize**: {optimization path — EN / VI}
4. **Edge cases**: {what to mention — EN / VI}
5. **Follow-up**: {common follow-up questions — EN / VI}
```

**Rules:**

- Exactly **4-6 bullets**, numbered
- Each bullet has a **bold label** + bilingual content
- Must include at least: Clarify, Approach, Edge cases
- Written as if coaching someone before a real interview
- Focus on **what to SAY**, not what to code

### 3.9 ❌ Common Mistakes / Sai Lầm Thường Gặp (NEW in v2.0)

```markdown
## ❌ Common Mistakes / Sai Lầm Thường Gặp

| # | Mistake / Sai lầm | Why Wrong / Tại sao sai | Fix / Cách sửa |
|---|-------------------|------------------------|----------------|
| 1 | {common mistake} | {explanation} | {correct approach} |
| 2 | {common mistake} | {explanation} | {correct approach} |
| 3 | {common mistake} | {explanation} | {correct approach} |
```

**Rules:**

- **Minimum 3 entries** per problem
- Must be **specific to this problem**, not generic advice
- Include at least one:
  - Logic error (e.g., off-by-one, wrong boundary)
  - Approach error (e.g., wrong pattern choice)
  - Interview error (e.g., coding before explaining)
- Bilingual: English mistake name, Vietnamese explanation welcome
- Highest-ROI content — interviewers look for candidates who know pitfalls

### 3.10 Solutions

````markdown
## Solutions

```typescript
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
```
````

**Rules:**

| Rule                  | Requirement                                       |
| --------------------- | ------------------------------------------------- |
| **Max solutions**     | **2-3 solutions** (brute force + 1-2 optimal)     |
| **Min solutions**     | 2 (always show brute + optimal progression)       |
| **JSDoc header**      | Every solution MUST have name, Time, Space        |
| **Language**          | TypeScript only                                   |
| **Wrapping**          | Use fenced ` ```typescript ` code blocks          |
| **Test cases**        | 3-4 test cases with expected output in comments   |
| **Naming**            | Use descriptive function names, not `solution1`   |
| **Comments**          | Inline comments for non-obvious logic only        |
| **No test harness**   | No `testFunction()`, no `performanceComparison()` |
| **No class wrappers** | No `class SolutionGenerator` patterns             |
| **No exports**        | No `export { ... }` at bottom                     |

**Solution progression pattern:**

```
Solution 1: Brute Force — O(n²) or worse — "naive approach"
Solution 2: Optimized — O(n log n) — "better approach" (optional)
Solution 3: Optimal — O(n) or O(log n) — "interview answer"
```

### 3.11 🔗 Related Problems

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

### 3.12 📊 Self-Assessment / Tự Đánh Giá (NEW in v2.0)

```markdown
## 📊 Self-Assessment / Tự Đánh Giá

After solving, fill in honestly / Sau khi giải xong, tự đánh giá:

| Metric / Tiêu chí | Result / Kết quả |
|-------------------|------------------|
| Solved without hints? / Giải không cần gợi ý? | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian | ___ min (target: {target_time} min) |
| Confidence (1-5) / Độ tự tin | ☐1 ☐2 ☐3 ☐4 ☐5 |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No |

**SRS Schedule / Lịch ôn tập:**
- After first solve: review in 1 day → 3 days → 7 days → 14 days → 30 days
- Update `srs_dates` in YAML frontmatter after each review

**Review Log / Nhật ký ôn tập:**

| Date | Confidence | Time | Notes |
|------|-----------|------|-------|
| | | | |
```

**Rules:**

- This section is filled by the **learner**, not the content creator
- Must include: solved-without-hints, time-taken, confidence, can-explain
- SRS schedule follows the intervals from LEARNING-METHODOLOGY.md
- Review log tracks improvement over time
- Confidence scale: 1=forgot completely, 2=struggled, 3=needed hints, 4=solved clean, 5=can teach

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
| Pattern Trigger                | English + Vietnamese memory hook          |
| Problem Description            | English                                   |
| Interview Script               | **English** (interview language)          |
| Interview Tips                 | **Bilingual** (each bullet)               |
| Common Mistakes                | **Bilingual** (table headers + content)   |
| Solutions                      | English (code + comments)                 |
| Related Problems               | English                                   |
| Self-Assessment                | **Bilingual** (labels + instructions)     |

### 4.2 Length Guidelines

| Section             | Target Length     |
| ------------------- | ----------------- |
| **Entire file**     | **120-250 lines** |
| Intuition           | 20-40 lines       |
| Pattern Trigger     | 5-8 lines         |
| Problem Description | 10-15 lines       |
| Interview Script    | 15-25 lines       |
| Interview Tips      | 6-10 lines        |
| Common Mistakes     | 5-8 lines         |
| Solutions (total)   | 40-80 lines       |
| Related Problems    | 5-8 lines         |
| Self-Assessment     | 10-15 lines       |

### 4.3 The "Explain to Interview Partner" Test

Every section must pass this test:

> If I read this section aloud in a mock interview, would it sound natural and demonstrate understanding?

- "Use dynamic programming" → too vague
- "Nhận thấy bài này có optimal substructure: kết quả tại step i chỉ phụ thuộc vào step i-1 và i-2, giống dãy Fibonacci" → shows thinking

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

### 4.5 Confidence Scale Reference

| Score | Meaning | Vietnamese | Action |
|-------|---------|------------|--------|
| 1 | Forgot completely — couldn't start | Quên hoàn toàn | Review immediately, re-study intuition |
| 2 | Remembered vaguely — wrong approach | Nhớ mơ hồ, sai hướng | Review in 1 day |
| 3 | Solved with hints or took too long | Cần gợi ý hoặc quá lâu | Review in 3 days |
| 4 | Solved clean within target time | Giải được gọn trong thời gian | Review in 7 days |
| 5 | Can teach it — instant pattern recognition | Có thể dạy lại | Review in 14-30 days |

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

Use this checklist when converting old-format files to the v2.0 standard.

### What Changes (v1.0 → v2.0)

```
v1.0 FORMAT (8 sections)             →  v2.0 FORMAT (12 sections)
─────────────────────────────────       ─────────────────────────────
Basic YAML (6 fields)               →  Enhanced YAML (16 fields + SRS)
No pattern trigger                  →  🎯 Pattern Trigger (quick-ref)
No interview script                 →  🗣️ Interview Script (5-step UMPIRE)
No common mistakes                  →  ❌ Common Mistakes (≥3 entries)
No self-assessment                  →  📊 Self-Assessment (SRS tracking)
No company data                     →  Companies in YAML + metadata
No target time                      →  ⏱️ Target time per difficulty
~100-200 lines                      →  ~120-250 lines
```

### Step-by-Step Migration (v1.0 → v2.0)

```
For each file:

1.  ☐ Update YAML frontmatter (add: leetcode_number, pattern, frequency_tier,
      companies, target_time_minutes, status, confidence, solve_count,
      last_reviewed, srs_dates)
2.  ☐ Verify bilingual title
3.  ☐ Update metadata line (add: Target time, Companies)
4.  ☐ Verify 🧠 Intuition section (analogy + pattern + visual)
5.  ☐ ADD 🎯 Pattern Trigger section (after Intuition):
      - When you see / Think / Template / Time target / Memory hook
6.  ☐ Verify Problem Description
7.  ☐ ADD 🗣️ Interview Script section (after Problem Description):
      - 5 steps: Understand → Match & Plan → Implement → Review → Evaluate
8.  ☐ Verify 📝 Interview Tips (4-6 bilingual bullets)
9.  ☐ ADD ❌ Common Mistakes section (after Interview Tips):
      - Minimum 3 entries: logic error, approach error, interview error
10. ☐ Verify Solutions (2-3 max, JSDoc, test cases)
11. ☐ Verify 🔗 Related Problems (3-5 links)
12. ☐ ADD 📊 Self-Assessment section (at end):
      - Metrics table + SRS schedule + review log
13. ☐ Verify total file length: 120-250 lines
14. ☐ Verify all 12 sections present in correct order
```

### Migration from Old Format (pre-v1.0)

```
OLD FORMAT (134 files)              →  v2.0 FORMAT (standard)
─────────────────────────────────      ─────────────────────────────
English-only title                  →  Bilingual title (EN / VI)
Basic metadata (Track, Difficulty)  →  Full metadata (16 YAML fields)
No intuition section                →  🧠 Intuition with Analogy + Visual
No pattern trigger                  →  🎯 Pattern Trigger
Minimal problem description         →  Structured description + examples
No interview script                 →  🗣️ Interview Script (UMPIRE)
No interview tips                   →  📝 Interview Tips (bilingual)
No common mistakes                  →  ❌ Common Mistakes (≥3)
6-11 redundant solutions            →  2-3 focused solutions (brute → optimal)
testFunction() + performance code   →  3-4 inline test cases only
export { ... } at bottom            →  No exports
No related problems                 →  🔗 Related Problems (3-5 links)
No self-assessment                  →  📊 Self-Assessment (SRS)
~400-650 lines                      →  ~120-250 lines
```

### Priority Order for Migration

```
WAVE 1 — Tier 1 problems first (25 must-know)
  These are asked >70% of the time. Migrate these ASAP.

WAVE 2 — Tier 2 problems (25 high-value)
  These are asked >40% of the time.

WAVE 3 — Remaining curated problems (~150)
  Migrate as time permits.
```

---

## 7. Format Template

Copy this template for every new problem file:

````markdown
---
layout: page
title: "{Problem Title}"
difficulty: {Easy|Medium|Hard}
category: {Category}
tags: [{Tag1}, {Tag2}]
leetcode_url: "https://leetcode.com/problems/{slug}/"
leetcode_number: {number}
pattern: "{Pattern Name}"
frequency_tier: {1|2|3}
companies: [{Company1}, {Company2}]
target_time_minutes: {10|20|35}
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# {English Title} / {Vietnamese Title}

> **Track**: Shared | **Difficulty**: {🟢 Easy|🟡 Medium|🔴 Hard} | **Pattern**: {Pattern Name}
> **Frequency**: {🔥 Tier 1|⭐ Tier 2|📘 Tier 3} — {frequency note}
> **Target**: ⏱️ {minutes} min | **Companies**: {Company1}, {Company2}
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

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger | Response |
|---------|----------|
| **When you see** | "{keyword triggers from problem statement}" |
| **Think** | {Pattern Name} — {one-sentence mechanism} |
| **Template** | `{core code snippet, 1-2 lines}` |
| **Time target** | ⏱️ {minutes} min ({difficulty}) |

> 💡 **Memory hook / Móc nhớ:** "{memorable Vietnamese sentence — mnemonic or metaphor}"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)
> "Let me make sure I understand. We have {input description}.
> We need to find {output description}.
> Clarification: {key question}? → {expected answer}"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)
> "My first thought is {brute force approach} — that's O({complexity}).
> But I notice {key insight that triggers pattern}.
> I'll use {pattern name} because {reason}.
> This gives O({time}) time, O({space}) space. Should I go ahead?"

### Step 3 — Implement / Viết Code (5-7 min)
> "I'll {step 1 of implementation}.
> {step 2}.
> {step 3}."

### Step 4 — Review / Kiểm Tra (1-2 min)
> "Let me trace through: {specific example}.
> {Step-by-step trace}.
> → Result: {output}. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)
> "Time: O({time}) — {why}. Space: O({space}) — {why}.
> Edge cases: {list 2-3 edge cases}.
> {Can optimize further / This is optimal because...}."

---

## 📝 Interview Tips

1. **Clarify**: {what to ask — EN / VI}
2. **Brute force**: {explain naive approach — EN / VI}
3. **Optimize**: {explain optimization path — EN / VI}
4. **Edge cases**: {mention edge cases — EN / VI}
5. **Follow-up**: {common follow-up questions — EN / VI}

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| # | Mistake / Sai lầm | Why Wrong / Tại sao sai | Fix / Cách sửa |
|---|-------------------|------------------------|----------------|
| 1 | {logic error} | {explanation} | {correct approach} |
| 2 | {approach error} | {explanation} | {correct approach} |
| 3 | {interview error} | {explanation} | {correct approach} |

---

## Solutions

```typescript
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
```

---

## 🔗 Related Problems

- [{Problem}]({path}) — {relationship}
- [{Problem}]({path}) — {relationship}
- [{Problem}]({url}) — {relationship}

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí | Result / Kết quả |
|-------------------|------------------|
| Solved without hints? / Giải không cần gợi ý? | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian | ___ min (target: {target_time} min) |
| Confidence (1-5) / Độ tự tin | ☐1 ☐2 ☐3 ☐4 ☐5 |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
|------|-----------|------|-------|
| | | | |
````

---

## 8. Anti-Patterns

### DO NOT

| Anti-Pattern                                  | Why It's Bad                                     | Instead                                 |
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
| Random solution ordering                      | No learning progression                          | Always: brute → optimal                 |
| No pattern trigger section                    | Can't quickly recall pattern during review       | Always include 🎯 Pattern Trigger       |
| No interview script                           | Knows code but can't communicate it              | Always include 🗣️ Interview Script      |
| No self-assessment tracking                   | Learn once, forget forever                       | Always include 📊 Self-Assessment       |
| Generic common mistakes                       | "Don't forget edge cases" is useless             | Problem-specific mistakes only          |

### Solution Anti-Patterns

```typescript
// BAD: Solution named "Solution 6: Using Map" — redundant variant
function subsetsMap(nums: number[]): number[][] { ... }

// BAD: Solution named "Solution 9: Using Class" — over-engineered
class SubsetGenerator { ... }

// BAD: Solution named "Solution 10: Using Functional" — same algorithm, different style
function subsetsFunctional(nums: number[]): number[][] { ... }

// GOOD: Only 2-3 solutions with clear progression
function subsets_bruteForce(nums: number[]): number[][] { ... }    // O(2^n) recursive
function subsets_backtracking(nums: number[]): number[][] { ... }  // O(2^n) optimal
function subsets_bitwise(nums: number[]): number[][] { ... }       // O(2^n) alternative
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│  LEETCODE FILE v2.0 QUICK CHECKLIST                 │
│                                                     │
│  ☐ YAML frontmatter complete (16 fields)            │
│  ☐ Bilingual title (EN / VI)                        │
│  ☐ Full metadata (Pattern + Freq + Time + Companies)│
│  ☐ 🧠 Intuition has:                                │
│    ☐ Vietnamese analogy                             │
│    ☐ Pattern recognition signals                    │
│    ☐ ASCII visual diagram                           │
│  ☐ 🎯 Pattern Trigger (see → think → template)      │
│    ☐ Memory hook in Vietnamese                      │
│  ☐ Problem description is concise                   │
│  ☐ 🗣️ Interview Script (5-step UMPIRE)              │
│    ☐ Shows brute → optimal thinking                 │
│    ☐ Traces through specific example                │
│  ☐ 📝 4-6 bilingual interview tips                  │
│  ☐ ❌ Common Mistakes (≥3 specific entries)          │
│  ☐ 2-3 solutions (brute → optimal)                  │
│    ☐ Each solution has JSDoc Time/Space             │
│    ☐ 3-4 inline test cases                          │
│  ☐ 🔗 3-5 related problems with links               │
│  ☐ 📊 Self-Assessment (metrics + SRS + review log)  │
│  ☐ Total file: 120-250 lines                        │
│  ☐ No test harness, exports, or class wrappers      │
└─────────────────────────────────────────────────────┘
```
