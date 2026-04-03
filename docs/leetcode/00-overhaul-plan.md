# LeetCode Interview System — Comprehensive Overhaul Plan

> **Created**: 2026-04-02
> **Status**: In Progress
> **Goal**: Master all interview LeetCode problems fluently in 6-9 months

---

## Context

The leetcode folder has ~2,275 problem files but only ~100 are hand-crafted quality. The current RULES.md template (v1.0, 8 sections) lacks critical elements for long-term retention: no SRS tracking, no interview simulation script, no self-assessment, no common mistakes section, no thinking process walkthrough. The user wants to master all interview leetcode problems fluently in 6-9 months, with proper scheduling, company targeting, motivation, and a Claude skill for automated generation.

---

## Gap Analysis — What's Missing

1. **No SRS integration** — LEARNING-METHODOLOGY.md describes spaced repetition but nothing in leetcode uses it
2. **No interview simulation script** — Tips say "what to clarify" but not "what to say out loud step-by-step"
3. **No self-assessment** — No confidence tracking, time tracking, or review log per problem
4. **No common mistakes section** — Despite skill-rules.md Rule 12 requiring it
5. **No pattern trigger** — "When you see X → think Y" is missing from individual problem files
6. **No master tracker** — Each category has index.md but no single view of ALL problems with status
7. **No study calendar** — 6-month plan exists but no daily Pomodoro schedule with SRS integration
8. **No motivation system** — No quotes, milestones, streak tracking
9. **No Claude skill for leetcode** — Skills exist for discovery/system-designer but not `/leetcode`
10. **`others/` is too broad** — Mixes stack, queue, greedy, misc
11. **~2,175 skeleton files are low-quality noise** — 100 hand-crafted vs 2,175 generated skeletons
12. **No company dashboard** — company-wise/ has 463 files but no summary "company X asks pattern Y"

---

## Plan — 4 Phases

### Phase 1: Template & Rules (Foundation)

#### 1A. Upgrade RULES.md to v2.0 — 12 sections ✅ DONE

**File**: `docs/leetcode/RULES.md`

Add 4 new sections to the existing 8-section template:

| #   | Section                 | Status       | Purpose                                                                                                                                                        |
| --- | ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | YAML Frontmatter        | **ENHANCED** | Added: `leetcode_number`, `pattern`, `frequency_tier`, `companies`, `target_time_minutes`, `status`, `confidence`, `srs_dates`, `last_reviewed`, `solve_count` |
| 2   | Bilingual Title         | Keep         | Unchanged                                                                                                                                                      |
| 3   | Metadata Line           | **ENHANCED** | Added target time, company badges                                                                                                                              |
| 4   | 🧠 Intuition / Tư Duy   | Keep         | Vietnamese analogy + pattern recognition + ASCII visual                                                                                                        |
| 5   | **🎯 Pattern Trigger**  | **NEW**      | "When you see X → Think Y → Template: `code snippet`" — quick-reference decision rule                                                                          |
| 6   | Problem Description     | Keep         | Concise statement + examples                                                                                                                                   |
| 7   | **🗣️ Interview Script** | **NEW**      | 5-step UMPIRE script: Understand (1-2min) → Plan (2-3min) → Code (5-7min) → Verify (1-2min) → Optimize (1min). Exact words to say out loud                     |
| 8   | 📝 Interview Tips       | Keep         | 4-6 bilingual bullets                                                                                                                                          |
| 9   | **❌ Common Mistakes**  | **NEW**      | Table: Mistake → Why Wrong → Fix (≥3 entries per problem)                                                                                                      |
| 10  | Solutions               | Keep         | 2-3 TypeScript, brute → optimal                                                                                                                                |
| 11  | 🔗 Related Problems     | Keep         | 3-5 links with pattern relationships                                                                                                                           |
| 12  | **📊 Self-Assessment**  | **NEW**      | Solved without hints? Time taken vs target? Confidence 1-5? Can explain to interviewer? Next SRS review date? Review log table                                 |

**Target file length**: 120-250 lines (up from 100-200)

#### 1B. Create Claude Skill `/leetcode` — PENDING

**File**: `.claude/skill-rules.md` — append new skill

```
### `/leetcode`
Trigger: create/improve/review a LeetCode problem file
Process:
1. Check if problem exists (search by number/name)
2. Determine category + pattern
3. Generate using 12-section v2.0 template
4. Verify: bilingual, ASCII visual, 2-3 solutions, interview script, common mistakes
5. Update YAML frontmatter
Quality gates:
- Vietnamese analogy must be real-life
- Interview Script must have 5 UMPIRE steps
- Common Mistakes ≥ 3 entries
- Pattern Trigger = one-line "see X → think Y"
- File 120-250 lines, max 3 solutions, no test harness/class wrappers/exports
```

Also add `/leetcode-review` skill for SRS review queue.

---

### Phase 2: Structure & Tracking

#### 2A. Folder Structure Changes — PENDING

| Action     | What                                     | Why                                                              |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------- |
| **RENAME** | `others/` → `stack-queue/`               | Descriptive name for 90%+ of content                             |
| **CREATE** | `heap/` category                         | Distinct interview pattern (Top K, Find Median)                  |
| **CREATE** | `greedy/` category                       | Tested separately from DP                                        |
| **CREATE** | `bit-manipulation/` category             | Distinct from math                                               |
| **MOVE**   | Misplaced problems to correct categories | Some greedy problems in dp/, heap problems in sorting-searching/ |
| **REMOVE** | `system-design/` from leetcode           | Only 1 file, belongs in fe-track system design                   |

#### 2B. Master Tracker — PENDING

**File**: `docs/leetcode/00-master-tracker.md` — NEW

Contents:

- Progress overview table (category × solved/review/unsolved with ASCII progress bars)
- Tier 1 (25 problems) full tracking table: Problem | Category | Pattern | Status | Confidence | Last Review | Next Review
- Tier 2 (25 problems) same format
- Tier 3 (selected ~150 problems) same format
- Today's SRS Review Queue section
- Total target: ~200 curated problems (not 2,275)

#### 2C. Skeleton Pruning Strategy — PENDING

- **Keep**: ~200 problems (Tier 1-2 + top company-frequency problems)
- **Archive**: Move remaining ~2,000 skeletons to `docs/leetcode/_archive/`
- **Rationale**: 200 problems × 2/day = 100 days. With SRS review cycles, fits 6-9 month plan. Quality >> quantity.

#### 2D. Update all category `index.md` files — DONE ✅

Each index.md should list only the curated problems with: difficulty, pattern, status tracking, target time.

---

### Phase 3: Study System & Company Analysis

#### 3A. Daily Study Calendar — PENDING

**File**: `docs/leetcode/00-daily-study-calendar.md` — NEW

**Daily routine (2-3 hours, Pomodoro-based)**:

- Morning block (60 min): 🍅 Solve new problem without hints (25min) → 🍅 Study solution + write interview script + fill self-assessment (25min)
- Evening block (60 min): 🍅 SRS review queue (25min) → 🍅 Second new problem OR hard review (25min)

**Weekly interleaving** (2 mixed patterns/day):

- Mon: Hash Map + DP
- Tue: Two Pointers + Tree
- Wed: Sliding Window + Graph
- Thu: Stack + Backtracking
- Fri: Binary Search + Design
- Sat: Mock interview (45 min) + weak areas
- Sun: REST or light review

**9-month milestones**:

| Month | Focus             | Problems       | Goal                          |
| ----- | ----------------- | -------------- | ----------------------------- |
| 1     | Tier 1 Foundation | 25             | All Easy <15min               |
| 2     | Tier 2 Core       | +25            | 70% Medium <25min             |
| 3     | Deep patterns     | +30            | Pattern recognition automatic |
| 4     | Company prep      | +20            | Company-specific readiness    |
| 5     | Hard problems     | +15            | Can attempt Hard              |
| 6     | Speed + review    | +10, heavy SRS | Medium <20min                 |
| 7     | Mock interviews   | Weekly mocks   | Pass consistently             |
| 8     | Target company    | Company drills | Ready for loops               |
| 9     | Peak + maintain   | SRS only       | Interview ready               |

#### 3B. Company Dashboard — PENDING

**File**: `docs/leetcode/00-company-dashboard.md` — NEW

- Pattern heatmap matrix: Pattern × Company (Google, Microsoft, Grab, Axon, EH, Zalo)
- Per-company: top patterns, difficulty skew, must-solve list, prep time estimate
- Cross-link to existing company guides in `docs/shared/07-company-guides/`
- Data source: existing `company-wise/` files + `interview-company-wise-problems/` CSVs

#### 3C. Company-wise Restructure — PENDING

- Create `company-wise/target-companies/` with 6 enhanced files (Google, Microsoft, Grab, Axon, EH, Zalo)
- Move remaining 459 generated company files to `company-wise/other-companies/`
- Add `company-wise/00-company-pattern-matrix.md` summary

---

### Phase 4: Motivation & Market

#### 4A. Motivation System — PENDING

**File**: `docs/leetcode/00-motivation.md` — NEW

- Daily quotes (EN + VI, rotating)
- Milestone rewards table with checkboxes
- Streak tracker
- Progress visualization (ASCII chart)
- Mindset section: growth mindset principles for interview prep

#### 4B. Market Research — PENDING

**File**: `docs/00-interview-market-overview.md` — MODIFY (already exists)

Add sections:

- Vietnam market salary ranges for L5 FE by company
- Remote vs in-office compensation
- 2026 hiring trends
- FE vs Full-stack demand
- AI impact on interview process

---

## Implementation Order

| Priority | Task                                                | Files                                      | Status     |
| -------- | --------------------------------------------------- | ------------------------------------------ | ---------- |
| **P0**   | Upgrade RULES.md to v2.0 template                   | `docs/leetcode/RULES.md`                   | ✅ Done    |
| **P0**   | Add `/leetcode` + `/leetcode-review` skills         | `.claude/skill-rules.md`                   | ✅ Done    |
| **P0**   | Create master tracker                               | `docs/leetcode/00-master-tracker.md`       | ✅ Done    |
| **P1**   | Rename `others/` → `stack-queue/`                   | folder rename + update refs                | ✅ Done    |
| **P1**   | Create company dashboard                            | `docs/leetcode/00-company-dashboard.md`    | ✅ Done    |
| **P1**   | Create daily study calendar                         | `docs/leetcode/00-daily-study-calendar.md` | ✅ Done    |
| **P1**   | Create motivation file                              | `docs/leetcode/00-motivation.md`           | ✅ Done    |
| **P1**   | Upgrade 25 Tier 1 problems to v2.0                  | 25 problem files                           | ✅ Done    |
| **P2**   | Create heap/, greedy/, bit-manipulation/ categories | new folders + move problems                | ✅ Done    |
| **P2**   | Prune skeletons (archive ~2,000)                    | mass move to `_archive/`                   | ✅ Done    |
| **P2**   | Upgrade 25 Tier 2 problems to v2.0                  | 25 problem files                           | ✅ Done    |
| **P2**   | Update market overview with salary/trends           | `docs/00-interview-market-overview.md`     | ⏳ Pending |
| **P3**   | Restructure company-wise/ folder                    | target-companies/ + other-companies/       | ⏳ Pending |
| **P3**   | Update all category index.md files                  | 12 index files updated/created             | ✅ Done    |

---

## Verification

1. **Template**: Pick a Tier 1 problem (e.g., Two Sum), apply v2.0 template, verify all 12 sections present and 120-250 lines
2. **Skill**: Run `/leetcode` on a new problem, verify output matches v2.0 spec
3. **Tracker**: Verify master tracker correctly lists all Tier 1+2 problems with status fields
4. **Calendar**: Review daily schedule against LEARNING-METHODOLOGY.md principles (SRS intervals, interleaving, Pomodoro)
5. **Company**: Verify dashboard cross-references match actual company-wise data
6. **Structure**: Verify no broken links after folder renames
