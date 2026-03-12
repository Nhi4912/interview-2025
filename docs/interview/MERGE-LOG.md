# Merge Log: interview-main → docs/interview

> Tracks every merge decision during the consolidation of `interview-main/` into `docs/interview/`.
> Started: 2026-03-12

## Merge Rules
1. **interview-main** = base format & knowledge standard (What/Why/How/When + diagrams)
2. **docs** = base for bilingual Q&A structure + difficulty tags
3. Gold standard = best of both (see plan file)
4. NO knowledge lost from either source

## Status Legend
- ✅ Complete
- 🔄 In Progress
- ⏳ Pending
- ⚠️ Needs Review

---

## Phase 0: Preparation
| Item | Status | Notes |
|------|--------|-------|
| MERGE-LOG.md | ✅ | This file |
| 00-table-of-contents.md skeleton | ✅ | Master navigation |

## Phase 1: Exclusive Content Import
| Source | Target | Status | Files | Notes |
|--------|--------|--------|-------|-------|
| interview-main/leetcode/ | docs/interview/leetcode/ | ⏳ | ~149 | LeetCode problems + TS solutions |
| i-main/frontend/07-networking/ | fe-track/10-networking/ | ⏳ | ~8 | HTTP, REST, GraphQL, WebSockets |
| i-main/frontend/10-accessibility/ | fe-track/11-accessibility/ | ⏳ | ~7 | WCAG, ARIA, keyboard nav |
| i-main/frontend/13-behavioral/ | fe-track/12-behavioral/ | ⏳ | ~6 | STAR method, leadership |
| i-main/frontend/12-coding-practice/ | fe-track/13-coding-practice/ | ⏳ | ~29 | DOM, React, algorithm challenges |

## Phase 2: Overlap Merge — interview-main Wins
| Category | Base | Enriched With | Status | Result Files |
|----------|------|---------------|--------|-------------|
| TypeScript | 8 i-main | 7 docs | ⏳ | ~10 |
| Next.js | 8 i-main | 4 docs | ⏳ | ~8 |
| Browser | 8 i-main | 5 docs | ⏳ | ~8 |
| Performance | 8 i-main | 5 docs | ⏳ | ~8 |
| Security | 6 i-main | 3 docs | ⏳ | ~6 |
| FE System Design | 17 i-main | 6 docs | ⏳ | ~10 |

## Phase 3: Overlap Merge — docs Wins
| Category | Base | Enriched With | Status | Result Files |
|----------|------|---------------|--------|-------------|
| JavaScript | 22 docs | 11 i-main | ⏳ | ~25 |
| React | 10 docs | 9 i-main | ⏳ | ~12 |
| HTML/CSS | 9 docs | 8 i-main | ⏳ | ~10 |
| Company Guides | docs shared + fe | 7 i-main | ⏳ | ~8 |

## Phase 4: Format Enhancement
| Target | Files | Status |
|--------|-------|--------|
| shared/ | 39 | ⏳ |
| be-track/ | 27 | ⏳ |
| fe-track/09-advanced-topics/ | 86 | ⏳ |
| Mindmaps + theory-and-visuals | 12 | ⏳ |

## Phase 5: Navigation & Roadmap
| Item | Status |
|------|--------|
| 00-6-month-study-plan.md | ⏳ |
| Master TOC rewrite | ⏳ |
| All roadmap updates | ⏳ |

## Phase 6: Cleanup
| Item | Status |
|------|--------|
| Remove superseded duplicates | ⏳ |
| Verify all cross-references | ⏳ |
| Final file count audit | ⏳ |
