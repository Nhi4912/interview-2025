# AGENTS.md — 04-nextjs

## OVERVIEW

App Router era Next.js (v14+), RSC-first architecture; covers the primary interview surface for Grab/Axon/Employment Hero roles.

---

## WHERE TO LOOK

| Topic                                                                   | File                                  |
| ----------------------------------------------------------------------- | ------------------------------------- |
| App Router vs Pages Router fundamentals                                 | `00-nextjs-fundamentals.md`           |
| RSC vs Client Components, `'use client'` boundary, streaming            | `01-app-router-server-components.md`  |
| `fetch` / `cache` / `revalidate`, Server Actions, route handlers        | `02-data-fetching.md`                 |
| Folder structure, layouts, route groups, middleware                     | `03-nextjs-architecture.md`           |
| App Router deep-dive (rendering modes, Suspense, ISR/SSG/SSR tradeoffs) | `04-nextjs-fundamentals-appRouter.md` |
| Topic index & difficulty map                                            | `README.md`                           |

---

## LOCAL CONVENTIONS

- **Next.js 14+ assumed** throughout; v15 differences noted inline where relevant.
- **App Router is primary** — Pages Router content is secondary/migration context only.
- **TypeScript by default** — all examples typed; no plain-JS variants.
- Bilingual content (EN + VI) — AI should read both; answer in the user's language.

---

## CROSS-REFERENCES

- React fundamentals / hooks → `../03-react/`
- Browser performance, Core Web Vitals, LCP → `../06-browser-performance/`
- FE system design (BFF, CDN, edge) → `../08-fe-system-design/`
- General FE conventions (formatting, commit style, difficulty tiers) → `../AGENTS.md`

---

## ANTI-PATTERNS

- Don't present Pages Router patterns (`getServerSideProps`, `getStaticProps`) as primary answers — frame as legacy/migration path.
- Don't conflate Next.js API routes / Route Handlers with backend system design; they're thin BFF glue, not a substitute for `../08-fe-system-design/`.
- Don't add Client Component state patterns without noting the RSC boundary cost.
