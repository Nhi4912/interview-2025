# AGENTS.md — 09-advanced-topics

## OVERVIEW

Senior-only deep-dive map (~75 files, 10 subdirs). Not a Phase replacement — assumes Phases 1–3 complete.
Entry point for V8 internals, compiler theory, distributed FE, security architecture, and algorithm depth.

---

## STRUCTURE

| Subdir                | Files | Purpose                                                    |
| --------------------- | ----- | ---------------------------------------------------------- |
| `algorithms/`         | 5     | DS + algorithm patterns; graph and tree traversal          |
| `accessibility/`      | 2     | WCAG principles and ARIA deep patterns                     |
| `advanced-theory/`    | 15    | Compiler design, vDOM reconciliation, concurrency patterns |
| `browser-internals/`  | 13    | Browser pipeline, memory, fetch, WebSockets, JS engine     |
| `design-patterns/`    | 1     | TypeScript design pattern reference                        |
| `expert-topics/`      | 4     | Distributed FE, perf engineering, security, testing        |
| `frontend-theory/`    | 17    | JS semantics, rendering theory, React/TS/CSS deep dives    |
| `interview-practice/` | 8     | JS/React challenges, system design rounds, behavioral      |
| `tools-ecosystem/`    | 8     | Build tools, bundlers, package managers, testing tooling   |
| `visual-learning/`    | 3     | Concept maps and algorithm visualizations                  |

---

## WHERE TO LOOK

| Interview Topic            | Go To                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| V8 internals / JIT         | `frontend-theory/17-frontend-theory-05-javascript-engine-internals.md`                                              |
| GC / memory tuning         | `browser-internals/06-memory-management-js.md` + `frontend-theory/…-15-memory-management-deep-dive.md`              |
| Browser rendering pipeline | `browser-internals/06-browser-architecture-theory.md` + `frontend-theory/…-02-browser-rendering-theory.md`          |
| Compiler / AST / parser    | `browser-internals/07-compiler-theory-js.md` → `advanced-theory/18-advanced-theory-01-compiler-design-frontend.md`  |
| vDOM / reconciliation      | `advanced-theory/18-advanced-theory-02-virtual-dom-reconciliation.md`                                               |
| Design patterns (TS)       | `design-patterns/03-design-patterns-ts.md` + `advanced-theory/…-06-design-patterns-advanced.md`                     |
| Algorithms / DS            | `algorithms/01-data-structures-js.md` → `02` → `04` → `05`                                                          |
| Accessibility deep         | `accessibility/14-accessibility-01-wcag-guidelines.md` + `…-02-aria-comprehensive.md`                               |
| Distributed / micro-FE     | `expert-topics/19-expert-topics-01-distributed-frontend-systems.md`                                                 |
| Security architecture      | `expert-topics/19-expert-topics-03-security-architecture.md`                                                        |
| Event loop / workers       | `browser-internals/08-concurrency-js.md` + `frontend-theory/…-16-web-workers-concurrency.md`                        |
| HTTP/2–3 / networking      | `advanced-theory/15-advanced-topics-01-http-protocols-theory.md` + `frontend-theory/…-12-http-networking-theory.md` |
| State machines / FSM       | `advanced-theory/15-advanced-topics-07-state-machines-theory.md`                                                    |
| FE system design rounds    | `interview-practice/11-interview-practice-06-frontend-system-design.md`                                             |

---

## STUDY ORDER

Per README dependency graph:

```
Level 1 → algorithms/ then browser-internals/ (00 → 04 → 08-web-performance-theory)
Level 2 → design-patterns/ → frontend-theory/ state + concurrency → tools-ecosystem/
Level 3 → advanced-theory/ compiler + vDOM → expert-topics/ distributed + security
Drill     → interview-practice/ (11-01 through 11-06 in order, last)
```

`16-theoretical-foundations-*` stubs: open for context, then follow redirect to `docs/shared/`.

---

## LOCAL CONVENTIONS

- Files prefixed by section number (`15-`, `17-`, `18-`, `19-`); number = reading tier, not priority rank.
- `browser-internals/` has dual numbering (e.g. `06-browser-architecture-theory` and `06-memory-management-js`); both are independent, not duplicates.
- `frontend-theory/17-frontend-theory-09-*` has two files (patterns vs. theory); read both — different angles.
- `visual-learning/` is supplementary; use after reading the corresponding theory file, not before.
- This subdir is self-contained; do not import its files into Phase 1–3 folders.

---

## CROSS-REFERENCES

This is the deep-dive layer — do not duplicate content owned by:

| Upstream Source                   | This dir adds                                               |
| --------------------------------- | ----------------------------------------------------------- |
| `01-javascript/` — JS basics      | Engine internals, JIT, GC, AST pipeline                     |
| `03-react/` — React fundamentals  | Reconciliation algorithm, advanced hooks theory, FRP        |
| `05-html-css/` — CSS basics       | `frontend-theory/…-07-modern-css-architecture.md`           |
| `11-accessibility/` — a11y basics | WCAG deep + ARIA pitfalls in `accessibility/`               |
| `docs/shared/01-cs-fundamentals/` | Frontend-specific applications only; theory lives in shared |

---

## ANTI-PATTERNS

- ❌ Adding intro-level material (closures, React hooks 101, CSS selectors) — belongs in Phases 1–3.
- ❌ Adding company-specific interview guides or recruiter tips — use `interview-practice/` for technique only.
- ❌ Routing "advanced" content here that logically extends a Phase topic (e.g. advanced CSS Grid) — extend the Phase folder instead.
- ❌ Duplicating theory from `docs/shared/` — create a stub with a redirect link.
- ❌ Skipping Level 1–2 and jumping directly to `expert-topics/` — dependencies are real; `distributed-frontend-systems` assumes networking + state machine fluency.
