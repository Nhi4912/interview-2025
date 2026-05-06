# 06-BROWSER-PERFORMANCE — AGENT INDEX

**Generated:** 2026-05-05 | **Files:** 10

## OVERVIEW

Core Web Vitals (LCP/INP/CLS), browser rendering pipeline, Chrome DevTools profiling, bundle/image optimization, RUM vs lab metrics.

---

## WHERE TO LOOK

| Topic                                                    | File                                  |
| -------------------------------------------------------- | ------------------------------------- |
| LCP, INP, CLS, FCP, TTFB definitions + targets           | `01-core-web-vitals.md`               |
| React-specific perf (memoization, Suspense, code-split)  | `02-react-performance.md`             |
| Bundle splitting, tree-shaking, lazy loading             | `03-bundle-optimization.md`           |
| End-to-end perf narrative (metrics → pipeline → RUM)     | `04-web-performance-comprehensive.md` |
| Paint/layout/composite theory, style recalc, reflow      | `05-rendering-optimization-theory.md` |
| Testing strategy (perf budgets, Lighthouse CI)           | `06-frontend-testing-strategy.md`     |
| Webpack/Rollup/Vite analysis, chunk strategy             | `07-bundle-analysis-deep-dive.md`     |
| Visual regression testing (Chromatic, Percy, Playwright) | `08-visual-regression-testing.md`     |
| Code coverage strategy, metrics, thresholds              | `09-code-coverage-strategy.md`        |

---

## LOCAL CONVENTIONS

- **2026 metric set:** LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1 — these are the canonical three.
- **INP replaced FID** as a Core Web Vital in March 2024. FID is deprecated; do not quote FID thresholds in answers.
- Image optimization (format, lazy, `<picture>`, CDN) lives in `03-bundle-optimization.md`, not a separate file.
- Chrome DevTools profiling walkthroughs are embedded in `04-web-performance-comprehensive.md`.
- RUM (field data, CrUX) vs lab (Lighthouse, WebPageTest) distinction covered in `01-core-web-vitals.md`.

---

## CROSS-REFERENCES

- **CSS rendering / stacking context / repaint triggers** → `../05-html-css/`
- **React perf deep-dive** (reconciler, memo, useDeferredValue) → `../03-react/09-performance-optimization.md`
- **Network perf** (HTTP/2, caching, CDN, prefetch) → `../10-networking/`
- **Node.js / SSR perf** → `../../be-track/`

---

## ANTI-PATTERNS

- ❌ Don't conflate FID with INP — they measure different things (event delay vs full interaction latency).
- ❌ Don't quote pre-2024 Web Vitals targets (FID ≤ 100ms is retired).
- ❌ Don't put React-specific perf content here — `02-react-performance.md` exists as a bridge file; deep React content belongs in `03-react/`.
- ❌ Don't add a new file for a single metric — extend existing files; folder is intentionally compact at 8 files.
- ❌ Don't mix RUM and lab numbers in the same claim without labelling the source type.
