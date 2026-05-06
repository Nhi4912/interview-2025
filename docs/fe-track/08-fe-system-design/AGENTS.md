# AGENTS.md — 08-fe-system-design

## OVERVIEW

FE system design interview prep: design a Twitter feed, Google Docs editor, VinID super-app shell, real-time dashboard — problems answered with components/state/rendering, not distributed backends.

---

## WHERE TO LOOK

| Topic                                                                          | File                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| MVC/MVVM/Flux, Monolith → Modular Monolith → MFE spectrum                      | `01-architecture-patterns.md`              |
| Code-splitting, lazy loading, CDN, bundle strategy, team scaling               | `02-scalability.md`                        |
| HTTP cache, service worker cache, stale-while-revalidate, CDN                  | `03-caching.md`                            |
| Micro-frontends, Module Federation, shell app, shared deps                     | `04-microservices.md`                      |
| Client-side storage: localStorage, IndexedDB, offline-first design             | `05-database-design.md`                    |
| Advanced MFE patterns: cross-team contracts, routing ownership                 | `06-microservices-patterns.md`             |
| Error tracking, logging, RUM, Core Web Vitals observability                    | `07-frontend-quality-and-observability.md` |
| Design systems, design tokens, component library architecture                  | `09-design-systems.md`                     |
| Monorepos for FE: Nx, Turborepo, pnpm workspaces, Changesets                   | `10-monorepos-frontend.md`                 |
| A/B testing & experimentation platforms (LaunchDarkly, Optimizely, GrowthBook) | `11-ab-testing-experimentation.md`         |
| SemVer, lockfiles, peer deps, deprecation, Renovate/Dependabot                 | `12-semver-and-versioning.md`              |
| Package managers internals (npm/yarn/pnpm/bun, lockfile algos, hoisting)       | `13-package-managers-internals.md`         |
| File handling, OPFS, File System Access API, drag-drop, large uploads          | `14-file-handling-opfs.md`                 |
| Navigation index + study order                                                 | `README.md`                                |

---

## STUDY ORDER

1. **01 first** — architecture spectrum (Monolith → MFE) frames every other decision.
2. **02 → 03 → 05** — scalability, caching, storage form the "data lifecycle" axis.
3. **04 → 06** — MFE intro then advanced patterns; 06 assumes 04 is solid.
4. **07 last** — observability is the "ops layer" on top of everything else.

---

## LOCAL CONVENTIONS

Every concept block follows a 4-part micro-structure — preserve it when adding content:

```
🧠 Memory Hook  (one memorable phrase)
Why does this exist? (2-level "why" chain)
Definition  (precise, not fluffy)
Visual  (ASCII diagram or spectrum chart)
❌ Common Mistakes
```

Every file opens with:

- **Real-World Scenario** (VinID / Vietnamese product context where possible)
- **Concept Map** (ASCII tree of the topic space)

FE-SD answer skeleton for interview problems (inferred from content):

```
Requirements (FR + NFR + scale: DAU, payload size, latency SLA)
  → Component Architecture (component tree, ownership boundaries)
    → Data Flow (state shape, client cache, API contract)
      → Rendering Strategy (CSR / SSR / SSG / ISR / streaming)
        → Perf & Edge Cases (Core Web Vitals, offline, a11y, error states)
```

Difficulty tags `🟢 Junior / 🟡 Mid / 🔴 Senior` required on every file header.
Bilingual: EN headings, EN or VI body — keep both, VI is primary audience.

---

## CROSS-REFERENCES

| Content needed                                      | Go to                                                  |
| --------------------------------------------------- | ------------------------------------------------------ |
| React state management architecture                 | `../03-react/`                                         |
| Next.js RSC, SSR/SSG/ISR rendering strategies       | `../04-nextjs/`                                        |
| Core Web Vitals, paint metrics, bundle perf         | `../06-browser-performance/`                           |
| Auth/CSRF/CSP at the architecture level             | `../07-web-security/`                                  |
| Micro-frontend runtime (Module Federation details)  | `04-microservices.md` + `06-microservices-patterns.md` |
| Backend SD (distributed systems, APIs, data models) | `../../be-track/04-be-system-design/`                  |
| Visual system design map                            | `../mindmaps/mindmap-system-design.md`                 |

`04-microservices.md` owns MFE _concepts_; `06-microservices-patterns.md` owns _advanced cross-team patterns_. Don't duplicate.

---

## ANTI-PATTERNS

- **Don't answer FE-SD questions with backend architecture** — proposing Kafka or sharding for a feed design is off-scope; stay in component/state/rendering space.
- **Don't skip Requirements step** — FE-SD requires agreeing on DAU, device targets, offline needs, and latency SLA before touching architecture.
- **Don't skip accessibility** — a11y (keyboard nav, ARIA roles, color contrast) is a first-class FE-SD concern, not an afterthought.
- **Don't conflate rendering strategies** — CSR vs SSR vs streaming RSC each have different tradeoff profiles; state the chosen strategy and justify it.
- **Don't add deep distributed theory** (CAP, Raft, consensus) — that belongs in `../../be-track/04-be-system-design/04-distributed-patterns.md`.
- **Don't add new content without the 4-part micro-structure** (Memory Hook → Why → Definition → Visual → Mistakes); partial blocks break pattern.
