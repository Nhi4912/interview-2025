# 01-JAVASCRIPT — AGENT CONTEXT

**Generated:** 2026-05-06 | **Files:** 28 | **Lines:** ~30k

## OVERVIEW

Phase 1 anchor — JS fundamentals (Junior) through advanced theory (Senior). Highest interview ROI: ~80% of FE Qs trace here.

---

## WHERE TO LOOK

| Topic                                    | File(s)                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Closures                                 | `04-closures.md` → `10-advanced-concepts.md` (GC, memory leak)       |
| Event loop / async                       | `07-event-loop-async.md` + `09-async-comprehensive.md`               |
| Prototypes / inheritance                 | `06-prototypes-inheritance.md` → `10-prototypes-inheritance-deep.md` |
| `this` keyword                           | `05-this-keyword.md` + `16-execution-context-theory.md` (5 rules)    |
| Scope / hoisting / TDZ                   | `03-scope-hoisting.md`                                               |
| ES6+ features                            | `08-es6-features.md` → `11-es6-features-deep.md`                     |
| Async patterns (Promise/RxJS)            | `09-async-comprehensive.md`                                          |
| Functional programming                   | `11-functional-programming.md`                                       |
| Memory management / WeakMap              | `15-memory-management-advanced.md`                                   |
| V8 internals / JIT / shapes              | `21-engine-internals-theory.md`                                      |
| Metaprogramming (Proxy/Reflect)          | `18-metaprogramming-theory.md`                                       |
| Execution context deep dive              | `16-execution-context-theory.md`                                     |
| Concurrency models                       | `19-concurrency-models-theory.md`                                    |
| Module systems (ESM/CJS/UMD)             | `20-module-systems-theory.md`                                        |
| Modern JS (2022–2025)                    | `22-modern-javascript-features.md`                                   |
| Regex for frontend (validation, ReDoS)   | `23-regex-for-frontend.md`                                           |
| Polyfills, transpilation, browserslist   | `24-polyfills-and-transpilation.md`                                  |
| Date/time, Temporal API, timezones, i18n | `25-date-time-deep.md`                                               |
| Type system theory                       | `14-javascript-type-system-theory.md`                                |
| Advanced patterns (decorator, mixin)     | `17-advanced-patterns-theory.md`                                     |

---

## STUDY ORDER

### Duplicate-file pattern (intentional)

Numbered pairs exist: a **base file** (interview-depth) + a **deep/comprehensive file** (L5/senior).

- `07-event-loop-async.md` vs `09-async-comprehensive.md` — start with 07
- `06-prototypes-inheritance.md` vs `10-prototypes-inheritance-deep.md` — start with 06
- `08-es6-features.md` vs `11-es6-features-deep.md` — start with 08
- `09-execution-context.md` vs `16-execution-context-theory.md` — start with 09
  Do **not** merge pairs. Base = interview Q&A. Deep = senior system knowledge.

### Critical (Junior must-know — highest interview frequency)

`01-javascript-basics.md` → `02-variables-types.md` → `03-scope-hoisting.md` → `04-closures.md` → `05-this-keyword.md` → `07-event-loop-async.md` → `08-es6-features.md`

### High (Mid-level — frequent in system-design round openers)

`06-prototypes-inheritance.md` → `09-async-comprehensive.md` → `09-execution-context.md` → `10-advanced-concepts.md` → `11-functional-programming.md` → `15-memory-management-advanced.md`

### Medium (Senior depth — asked in L5/Staff rounds)

`10-prototypes-inheritance-deep.md` → `11-es6-features-deep.md` → `16-execution-context-theory.md` → `17-advanced-patterns-theory.md` → `18-metaprogramming-theory.md` → `19-concurrency-models-theory.md` → `20-module-systems-theory.md`

### Low (Specialist / principal-level or breadth signals)

`13-javascript-basics-theory.md` → `14-javascript-type-system-theory.md` → `21-engine-internals-theory.md` → `22-modern-javascript-features.md`

---

## LOCAL CONVENTIONS

- **`-theory.md` suffix** → senior-only deep dive (V8 JIT, GC, hidden classes, concurrency models). Not expected at Junior/Mid.
- **`-deep.md` / `-comprehensive.md` suffix** → expanded version of a base topic; covers edge cases, production gotchas, L5 competencies header.
- **`L5 Competencies:` header line** — present in deep/theory files only; maps to interview rubric dimensions (Technical Mastery, Debugging Mastery, Performance Optimization).
- **`Prerequisites:` header line** — explicit dependency chain per file; follow it when introducing new files.
- **Company anecdotes are canonical** — Lazada closure memory leak, Tiki `var`-in-loop, Shopee `Promise.all`, Shopee WeakMap. Do not swap or genericize them; interviewers recognize named scenarios.

---

## ANTI-PATTERNS

- ❌ Don't merge duplicate pairs (`-deep` / `-comprehensive` files intentionally coexist with base)
- ❌ Don't put TypeScript here — TS belongs in `../02-typescript/`
- ❌ Don't add `09-advanced-topics/`-style senior content here — this folder is Phase 1; senior V8/GC already covered by `21-engine-internals-theory.md`
- ❌ Don't skip the `-theory.md` files for Senior role prep — they map directly to L5 rubric
- ❌ Don't reorder file numbers — cross-links (Prerequisites, See also) use exact `NN-name.md`
