# LEETCODE PRACTICE

**Generated:** 2026-05-05 | ~2,300 problem files, ~100 hand-crafted, RULES.md v2.0 (12 sections)

## OVERVIEW

DSA practice corpus for FAANG/top-VN interviews. Mix of **~100 hand-crafted v2.0-quality** files and **~2,175 auto-generated skeletons**. The `00-*` study guides are the real entry points — do NOT try to "solve all 2,300".

Goal per `00-overhaul-plan.md`: master ~30-40 core problems fluently in 6-9 months using SRS + interview simulation.

## STRUCTURE

```
leetcode/
├── RULES.md                       # MANDATORY format spec for every problem file (v2.0, 12 sections)
├── README.md                      # Human-facing index
├── 00-quick-start.md              # Day-1 onboarding
├── 00-study-guide.md              # ⭐ START HERE — Tier 1/2/3 frequency rankings
├── 00-overhaul-plan.md            # Why this folder exists, gap analysis, 4-phase plan
├── 00-patterns-index.md           # Pattern → problems lookup
├── 00-master-tracker.md           # SRS-tracked problem status
├── 00-study-calendar.md           # Daily Pomodoro + SRS schedule
├── 00-motivation-system.md        # Streaks, milestones, quotes
├── 00-table-of-contents.md        # Full index
├── mindmap-patterns.md            # ASCII mindmap of all patterns
├── company-wise/                  # 463 companies — see subdir AGENTS.md
│   ├── target-companies/          # 6 enriched (google, microsoft, grab, axon, employment-hero, zalo-vng)
│   └── other-companies/           # 459 auto-generated lists
├── _archive/                      # ⚠️ DEPRECATED v1.0 files — reference only, do NOT extend
├── array/      stack-queue/   linked-list/   tree-graph/   dp/
├── string/     backtracking/  design/        sorting-searching/
├── math/       misc/          javascript/    sql/   system-design/
└── (each category has its own README.md + problems/ subdir)
```

## WHERE TO LOOK

| Intent                            | Path                                            |
| --------------------------------- | ----------------------------------------------- |
| First time here                   | `00-quick-start.md` → `00-study-guide.md`       |
| What to solve TODAY               | `00-study-calendar.md` + `00-master-tracker.md` |
| "I see X — what pattern?"         | `00-patterns-index.md` or `mindmap-patterns.md` |
| Writing a NEW problem file        | `RULES.md` (12-section template, MANDATORY)     |
| Targeting Google/Grab/etc.        | `company-wise/target-companies/<name>.md`       |
| Why folder is structured this way | `00-overhaul-plan.md`                           |
| Specific category (e.g., DP)      | `dp/README.md` → `dp/problems/NN-name.md`       |

## CONVENTIONS (LEETCODE-SPECIFIC)

- **RULES.md v2.0 is law for new files** — 12 sections in fixed order: Intuition → Pattern Trigger → Description → Interview Script → Tips → Common Mistakes → Solutions → Complexity → Variants → Self-Assessment → SRS Block → Cross-refs.
- **Bilingual EN/VI** in problem files — Intuition section is usually VI-first.
- **Filenames** — `problems/NN-kebab-name.md`. `NN` = position in category curriculum, NOT LeetCode problem number.
- **Hand-crafted vs skeleton** — hand-crafted files have full 12 sections + interview script. Skeletons have stub sections; don't treat them as authoritative.
- **Pattern Trigger format** — exactly: `**When you see X → think Y**`. Greppable.
- **Difficulty markers** in problem header: 🟢 Easy / 🟡 Medium / 🔴 Hard.
- **SRS Block** at bottom: `Last reviewed: YYYY-MM-DD | Next: YYYY-MM-DD | Confidence: 1-5`.

## ANTI-PATTERNS

- ❌ Don't add files to `_archive/` — it's frozen v1.0 content.
- ❌ Don't auto-generate more skeletons — the gap is QUALITY (hand-crafted v2.0), not quantity.
- ❌ Don't use the v1.0 8-section template — must be v2.0 12-section.
- ❌ Don't skip Common Mistakes / Self-Assessment sections — explicitly required by RULES.md (was the #1 gap).
- ❌ Don't link to LeetCode by number alone — always include problem name (numbers shift).
- ❌ Don't put non-DSA content here — system design has its own subdir but most goes to `../shared/02-system-design/`.
- ❌ Don't renumber `NN-` prefixes within a category — breaks `00-master-tracker.md` and study calendar.
- ❌ Don't promote `others/` content — it's being phased out (see overhaul plan §1).

## UNIQUE STYLES

- **Interview Script section** — verbatim words to say out loud, structured as: clarify → approach → walk-through → optimize → test. Unique to this folder.
- **Pattern Trigger one-liners** — designed for grep/AI recall under pressure.
- **Tier 1/2/3 frequency rankings** in `00-study-guide.md` based on real 2025-2026 interview reports — NOT LeetCode official tags.
- **🧠 Memory Hook** callouts borrowed from main docs style.
- **Pomodoro-aware schedule** — `00-study-calendar.md` assumes 25min focused blocks, not "do N problems".

## NOTES

- ~2,275 of 2,337 files are low-quality skeletons. Treat `00-study-guide.md` Tier 1+2 list (~80 problems) as the real corpus.
- See `../AGENTS.md` for repo-wide conventions.
- Generation pipeline: spec'd in `../specs/knowledge-generation-process.md`.
- Each category subdir has its own `README.md` — those serve as per-category index. AGENTS.md exists only at this root for now.
