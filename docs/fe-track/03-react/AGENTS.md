# AGENTS.md — 03-react/

## OVERVIEW

Primary React interview track: 11 files covering fundamentals through React 19, hooks, patterns, state management, performance, and testing.

---

## WHERE TO LOOK

| Topic                                                         | File                             |
| ------------------------------------------------------------- | -------------------------------- |
| Core hooks (useState, useEffect, useReducer, useRef)          | `03-hooks-deep-dive.md`          |
| All hooks + useTransition, useDeferredValue                   | `07-hooks-comprehensive.md`      |
| React 19 APIs (use, useFormStatus, useOptimistic, Actions)    | `02-react-19-features.md`        |
| RSC / Server Components, Suspense                             | `10-modern-react-features.md`    |
| Compound, render props, HOC, custom hooks patterns            | `04-advanced-patterns.md`        |
| Advanced patterns with complexity scores                      | `08-react-patterns-advanced.md`  |
| State management (Zustand, Jotai, React Query)                | `05-state-management.md`         |
| Performance (memo/useMemo/useCallback, colocation, profiling) | `09-performance-optimization.md` |
| Testing (RTL, mocking, async)                                 | `06-testing.md`                  |
| Fundamentals (JSX, reconciliation, Fiber, render/commit)      | `01-react-fundamentals.md`       |

---

## DUPLICATE PATTERN

Two hook files and two pattern files exist intentionally — they target different levels:

- **`03-hooks-deep-dive`** — Junior→Senior; internals (linked list on fiber), common bugs (stale closure, infinite loop), core 6 hooks only
- **`07-hooks-comprehensive`** — Mid→Senior; wider surface (useTransition, useDeferredValue, useId, custom hook design); prerequisite for `09-performance-optimization`

- **`04-advanced-patterns`** — foundational patterns (HOC, render props, compound components) with learning-path framing
- **`08-react-patterns-advanced`** — same patterns with complexity scores, edge cases, and anti-pattern callouts; adds Context optimization, state machines

When adding content: **depth on a core hook → `03`; new hook or concurrent feature → `07`; pattern introduction → `04`; pattern trade-offs / gotchas → `08`**.

---

## LOCAL CONVENTIONS

- React 18 baseline; React 19 additions clearly labelled in `02-react-19-features` and `10-modern-react-features`
- Code samples in TypeScript preferred; JS used only for brevity in short snippets
- Files are bilingual (EN + VI) — keep both when editing
- Difficulty tags: 🟢 Junior / 🟡 Mid / 🔴 Senior — add to new sections

---

## CROSS-REFERENCES

| Related topic                                 | Location                                             |
| --------------------------------------------- | ---------------------------------------------------- |
| Next.js App Router, RSC in production         | `docs/fe-track/04-nextjs/`                           |
| React + TypeScript generics, component typing | `docs/fe-track/02-typescript/05-react-typescript.md` |
| Core Web Vitals, browser perf metrics         | `docs/fe-track/06-browser-performance/`              |

---

## ANTI-PATTERNS

- ❌ Do not add Next.js-specific content (routing, `use server`, middleware) — belongs in `04-nextjs/`
- ❌ Do not add state libraries that wrap non-React primitives (Redux Toolkit counts; MobX does not fit here without justification)
- ❌ Do not duplicate Fiber/reconciliation internals already in `01-react-fundamentals`
- ❌ Do not add browser/DOM performance content (Lighthouse, LCP, CLS) — belongs in `06-browser-performance/`
- ❌ `React.memo` is documented as **last resort** in `09`; don't frame it as default optimization advice elsewhere
