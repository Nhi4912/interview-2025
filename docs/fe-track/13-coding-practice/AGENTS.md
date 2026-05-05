# AGENTS.md — 13-coding-practice

## OVERVIEW

Live-coding interview drills (runnable code + tradeoffs); not theory docs.

---

## STRUCTURE

```
13-coding-practice/
├── 00-problem-solving-meta-guide.md   ← START HERE — UNPACK method + time mgmt
├── 01–19-*.md                         ← Common-component drills (mixed archetypes)
├── debounce-throttle.md               ← Duplicates exist (legacy); prefer numbered files
├── performance-optimization.md
├── css-*.md
├── missing-answers.md / summary.md    ← Index / gap tracker
│
├── 01-javascript-challenges/          ← Pure JS: debounce, event-emitter, Promise, array methods
├── 02-dom-manipulation/               ← DOM API: events, delegation, element creation
├── 03-react-components/               ← React: hooks, patterns, component design
├── 04-algorithm-problems/             ← Algo: leetcode-style applied to FE contexts
└── 05-system-design-exercises/        ← FE system design (NOT backend infra)
```

---

## WHERE TO LOOK

| Archetype        | Top-level files                                                                                                                                                                                             | Subdir                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| JS utilities     | `02-debounce-throttle.md`, `05-state-management.md`, `13-undo-redo.md`, `16-typescript-challenges.md`                                                                                                       | `01-javascript-challenges/` (debounce, event-emitter, Promise, array-methods) |
| DOM manipulation | `11-drag-and-drop.md`, `19-web-apis-advanced.md`                                                                                                                                                            | `02-dom-manipulation/`                                                        |
| React components | `03-react-form-validation.md`, `06-autocomplete.md`, `08-modal-dialog.md`, `09-file-uploader.md`, `10-notification-system.md`, `14-custom-hook.md`, `15-error-boundary.md`, `17-advanced-react-patterns.md` | `03-react-components/`                                                        |
| Algorithms       | `04-virtual-scrolling.md`, `07-infinite-scroll.md`, `performance-optimization.md`                                                                                                                           | `04-algorithm-problems/`                                                      |
| FE system design | `01-dynamic-table.md`, `12-dashboard-layout.md`, `18-webgl-canvas-challenges.md`                                                                                                                            | `05-system-design-exercises/`                                                 |

---

## STUDY ORDER

1. `00-problem-solving-meta-guide.md` — read once before any drill; internalize UNPACK
2. `01-javascript-challenges/` — fundamentals (debounce → Promise → array methods → event-emitter)
3. `02-debounce-throttle.md` → `06-autocomplete.md` → `07-infinite-scroll.md` — high-frequency interview topics
4. `03-react-form-validation.md` → `08-modal-dialog.md` → `14-custom-hook.md` → `17-advanced-react-patterns.md`
5. `11-drag-and-drop.md`, `04-virtual-scrolling.md` — mid-senior component challenges
6. `04-algorithm-problems/` + `05-system-design-exercises/` — for senior/staff rounds

---

## LOCAL CONVENTIONS

Each problem doc follows this fixed structure:

```
Problem statement (Requirements list)
→ Constraints / edge cases
→ Naive solution (with complexity)
→ Optimized solution (runnable code)
→ Tradeoffs
→ Common follow-ups (e.g. "Now add cache / abort / ARIA")
```

- **Runnable code only** — no pseudocode, no placeholder snippets
- Bilingual (EN/VI) throughout; skip Vietnamese sections when reading fast
- Each doc is self-contained; follow-ups link to related files
- Interview Q&A table at bottom: question | level (🟢🟡🔴) | key point

---

## CROSS-REFERENCES

| Need                                       | Go to                               |
| ------------------------------------------ | ----------------------------------- |
| JS/TS theory (closures, prototypes, async) | `../01-javascript/`                 |
| React patterns deep-dive                   | `../03-react/`                      |
| FE system design framework                 | `../08-fe-system-design/`           |
| Algorithm theory (sliding window, DP, BFS) | `../09-advanced-topics/algorithms/` |
| Accessibility / ARIA specs                 | `../14-accessibility/`              |
| Behavioral + communication patterns        | `../../shared/09-behavioral/`       |

---

## ANTI-PATTERNS

- ❌ Don't add theory-only content here — drills only, theory lives in sibling dirs
- ❌ Don't add backend system design (databases, microservices, infra) — use `../12-system-design/`
- ❌ Don't skip `00-problem-solving-meta-guide.md` — UNPACK + time budgeting is prerequisite
- ❌ Don't merge problem statement + solution into one wall of text — keep sections explicit
- ❌ Don't commit pseudocode or stub functions as solutions — all code must be runnable
- ❌ Don't create numbered files without adding them to `missing-answers.md` / `summary.md`
