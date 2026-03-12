# Content Migration Plan: interview-main → docs/interview

> **For Claude:** Use skill({ name: "executing-plans" }) to implement this plan task-by-task.

**Goal:** Complete the consolidation of `interview-main/` into `docs/interview/` with all content properly merged, formatted, and navigable.

**Architecture:**

- Phase 1.5: Import remaining exclusive content (Coding Practice)
- Phase 2: Merge overlaps where interview-main content wins
- Phase 3: Merge overlaps where docs content wins
- Phase 4: Format enhancement for all tracks
- Phase 5: Navigation and study roadmap
- Phase 6: Cleanup and verification

**Tech Stack:** Markdown, MDX, Frontmatter

---

## Must-Haves

**Goal:** Unified interview preparation platform with all content properly organized, merged, and navigable.

### Observable Truths

1. All exclusive content from interview-main imported to docs/interview
2. Overlapping topics resolved with clear winner (interview-main or docs)
3. All content follows consistent format (What/Why/How/When + bilingual)
4. Master navigation and study plan accessible
5. No broken links or duplicate content

### Required Artifacts

| Artifact                 | Provides                 | Path                                      |
| ------------------------ | ------------------------ | ----------------------------------------- |
| MERGE-LOG.md             | Merge decisions tracking | `docs/interview/MERGE-LOG.md`             |
| 00-6-month-study-plan.md | Study roadmap            | `docs/interview/00-6-month-study-plan.md` |
| Master TOC               | Unified navigation       | `docs/interview/00-table-of-contents.md`  |

---

## Phase 1.5: Import Coding Practice + Mindmaps (IN PROGRESS)

### Task 1: Import Coding Practice problems

**Files:**

- Create: `docs/interview/fe-track/13-coding-practice/` (from `interview-main/src/content/frontend/coding-problems/`)

**Step 1: Copy coding problems directory**

```bash
# Copy 29 files from interview-main to docs
cp -r interview-main/src/content/frontend/coding-problems/* docs/interview/fe-track/13-coding-practice/
```

**Step 2: Verify files copied**

Run: `ls docs/interview/fe-track/13-coding-practice/ | wc -l`
Expected: ~29 files

**Step 3: Update MERGE-LOG.md**

Edit: `docs/interview/MERGE-LOG.md` - Change Phase 1.5 status to ✅

---

### Task 2: Verify Mindmaps import

**Files:**

- Check: `docs/interview/fe-track/mindmaps/`

**Step 1: Count mindmap files**

Run: `ls docs/interview/fe-track/mindmaps/*.md | wc -l`
Expected: ~12 files

**Step 2: Verify bilingual format**

Check first mindmap for EN headings + VI explanations

---

## Phase 2: Merge Overlaps — interview-main Wins

### Task 3: Merge TypeScript content

**Files:**

- Base: `docs/interview/fe-track/modules/02-typescript.md`
- Merge from: `interview-main/src/content/frontend/react-js-ts/typescript.md`

**Step 1: Compare content**

Read both files, identify unique content from interview-main

**Step 2: Merge TypeScript**

Add missing sections from interview-main to docs version

**Step 3: Update frontmatter**

Ensure difficulty tags preserved

---

### Task 4: Merge Next.js content

**Files:**

- Base: `docs/interview/fe-track/modules/05-nextjs-fullstack.md`
- Merge from: `interview-main/src/content/frontend/` (Next.js related)

---

### Task 5: Merge Browser content

**Files:**

- Base: `docs/interview/fe-track/` (browser modules)
- Merge from: `interview-main/src/content/frontend/web-fundamentals/`

---

### Task 6: Merge Performance content

**Files:**

- Base: `docs/interview/fe-track/modules/07-performance.md`
- Merge from: `interview-main/src/content/frontend/performance/`

---

### Task 7: Merge Security content

**Files:**

- Base: `docs/interview/fe-track/modules/08-security.md`
- Merge from: `interview-main/src/content/frontend/web-fundamentals/security.md`

---

### Task 8: Merge FE System Design

**Files:**

- Base: `docs/interview/fe-track/` (system design modules)
- Merge from: `interview-main/src/content/theory/frontend-system-design.md`

---

## Phase 3: Merge Overlaps — docs Wins

### Task 9: Merge JavaScript (docs wins)

**Files:**

- Base: `docs/interview/fe-track/` (JS modules)
- Enrich with: `interview-main/src/content/frontend/fundamentals/javascript-*.md`

---

### Task 10: Merge React (docs wins)

**Files:**

- Base: `docs/interview/fe-track/modules/04-react-ecosystem.md`
- Enrich with: `interview-main/src/content/frontend/react*/`

---

### Task 11: Merge HTML/CSS (docs wins)

**Files:**

- Base: `docs/interview/fe-track/modules/06-css-visual-design.md`
- Enrich with: `interview-main/src/content/frontend/html-css/`

---

### Task 12: Merge Company Guides

**Files:**

- Base: `docs/interview/fe-track/` (company guides)
- Enrich with: `interview-main/src/content/frontend/interview-strategy/company-specific-patterns.md`

---

## Phase 4: Format Enhancement

### Task 13: Enhance shared/ content

**Files:**

- Modify: `docs/interview/shared/**/*.md`

**Step 1: Check file count**

Run: `ls docs/interview/shared/*.md | wc -l`
Expected: ~39 files

**Step 2: Add bilingual format to each**

Ensure EN headings + VI explanations

---

### Task 14: Enhance be-track/ content

**Files:**

- Modify: `docs/interview/be-track/**/*.md`

**Step 1: Check file count**

Run: `ls docs/interview/be-track/**/*.md | wc -l`
Expected: ~27 files

---

### Task 15: Enhance advanced-topics/

**Files:**

- Modify: `docs/interview/fe-track/09-advanced-topics/**/*.md`

---

## Phase 5: Navigation & Roadmap

### Task 16: Create 6-month study plan

**Files:**

- Create: `docs/interview/00-6-month-study-plan.md`

**Step 1: Structure the plan**

- Month 1-2: Fundamentals (JS, HTML/CSS)
- Month 3: React + TypeScript
- Month 4: Browser, Performance, Security
- Month 5: System Design, Next.js
- Month 6: LeetCode, Behavioral, Review

---

### Task 17: Update Master TOC

**Files:**

- Modify: `docs/interview/00-table-of-contents.md`

---

## Phase 6: Cleanup

### Task 18: Remove duplicates

**Files:**

- Audit all directories

**Step 1: Find potential duplicates**

```bash
# Find files with similar names in different locations
find docs/interview -name "*.md" | xargs -I{} basename {} | sort | uniq -d
```

---

### Task 19: Verify all cross-references

**Step 1: Check for broken links**

```bash
# Check for [text](path) patterns that might be broken
grep -r "\[.*\](" docs/interview --include="*.md" | head -50
```

---

### Task 20: Final file count audit

**Step 1: Count total files**

Run: `find docs/interview -name "*.md" | wc -l`
Expected: Should be reasonable (~200-300)

---

## Dependency Graph

### Task Dependencies

Task 1 (Coding Practice import) → Task 3-8 (Phase 2)
Task 2 (Mindmaps verify) → Task 3-8
Tasks 3-8 (Phase 2) → Tasks 9-12 (Phase 3)
Tasks 9-12 (Phase 3) → Tasks 13-15 (Phase 4)
Tasks 13-15 (Phase 4) → Tasks 16-17 (Phase 5)
Tasks 16-17 (Phase 5) → Tasks 18-20 (Phase 6)

### Wave Execution

Wave 1: Tasks 1-2 (Phase 1.5 - in progress)
Wave 2: Tasks 3-8 (Phase 2 - interview-main wins)
Wave 3: Tasks 9-12 (Phase 3 - docs wins)
Wave 4: Tasks 13-15 (Phase 4 - format enhancement)
Wave 5: Tasks 16-17 (Phase 5 - navigation)
Wave 6: Tasks 18-20 (Phase 6 - cleanup)
