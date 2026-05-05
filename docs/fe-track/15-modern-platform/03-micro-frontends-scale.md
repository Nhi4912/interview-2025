# Micro-frontends @ Scale — Beyond the Module Federation Hello-World

> **Track**: Frontend → Modern Platform | **Difficulty**: 🟢 → 🔴
> [⬅ Back to TOC](../../00-table-of-contents.md) | **Prev**: [Real-time Collaboration](./02-realtime-collaboration-crdts.md) | **Next**: [Modern Platform Index](./README.md)

---

## 🌍 Real-World Scenario — Spotify's 600-Engineer Frontend

By 2023, **Spotify** had ~600 engineers shipping to spotify.com and the desktop app. A single React monorepo would mean: every PR triggers a 30-min CI run, every deploy retests the world, every team waits for the slowest team. They moved to **micro-frontends** powered by their internal "Backstage" + custom Module Federation setup. Result: Search team ships independently from Player team ships independently from Podcast team. **Lead time went from 6 days to 4 hours.**

Then **Zalando** (€10B fashion retailer) decomposed its checkout into 14 independent micro-frontends, each owned by a different team. **DAZN** (sports streaming) ships 30+ micro-frontends per market across 10 countries, each region team customizing without forking.

But the dark side is real. **DAZN's 2020 incident**: a bad shared dependency version in one micro-frontend cascaded a `ReactCurrentDispatcher` error site-wide, taking down match streams during a Champions League final. **Klarna's 2022 lesson**: 47 micro-frontends loading 47 React copies = 8MB shipped per page until they enforced singleton sharing.

In 2026, micro-frontends are no longer "should we?" but "how do we avoid the famous failure modes?"

> 🇻🇳 **Tóm tắt**: Spotify 600 engineer dùng micro-frontends → lead time 6 ngày → 4 giờ. Nhưng DAZN, Klarna đã mất tiền vì shared deps sai version. 2026: câu hỏi không còn là "có dùng không" mà là "tránh các bẫy nổi tiếng thế nào".

---

## A1. 🧠 Memory Hook — **"SHARDS"**

| Letter | Stands For             | One-line                                                   |
| ------ | ---------------------- | ---------------------------------------------------------- |
| **S**  | **Singleton sharing**  | React, design system, router MUST be singleton             |
| **H**  | **Host contract**      | Shell defines the API, remotes implement it                |
| **A**  | **Async boundaries**   | Lazy-load remotes; React Suspense + ErrorBoundary required |
| **R**  | **Runtime resolution** | Manifest-driven; deploy remote without redeploying shell   |
| **D**  | **Dependency hygiene** | Lock versions, dedupe, observe drift                       |
| **S**  | **Scope isolation**    | CSS, globals, eventBus — all need explicit boundaries      |

> 🇻🇳 **Catchphrase**: _"SHARDS — chia nhỏ thành mảnh, nhưng phải gắn keo đúng cách."_

---

## A2. 🎯 Why It Matters Now

1. **Team scaling is the #1 senior FE problem**: Conway's Law in action. Once you cross 50 FE engineers in one repo, build times and merge conflicts become the bottleneck. Micro-frontends are the proven escape hatch.
2. **Module Federation matured (2024)**: Webpack 5 native, Rspack 1.0, Vite Module Federation plugin (v2 in 2024) — finally production-ready across bundlers.
3. **Independent deployability** = compliance + resilience: Banking and gov can deploy security patches to one section without re-deploying everything. PCI scope shrinks.

> 🇻🇳 **Tóm tắt**: Khi >50 FE eng trong 1 repo → build chậm, conflict nhiều. Module Federation 2024 đã chín. Deploy độc lập = compliance + resilience tốt hơn.

---

## A3. Layer 1 — Beginner: What Is a Micro-frontend?

**Analogy**: A traditional SPA is a **single building** built by one architect. Micro-frontends are a **mall** — each store is built by a different team, but they share the same parking lot, plumbing, and storefront standards. Each store can renovate independently. The mall manager (the **shell**) provides the layout, navigation, lighting.

```
┌─────────────────────── SHELL APP ──────────────────────────┐
│                                                             │
│   [ Header (own MFE)            User: Nhi   Cart: 3 ]      │
│                                                             │
│   ┌──────────────┐  ┌─────────────────────────────────┐   │
│   │              │  │                                  │   │
│   │  Catalog     │  │   Product Detail                 │   │
│   │  MFE         │  │   MFE                            │   │
│   │  (Team A)    │  │   (Team B)                       │   │
│   │  React 18    │  │   React 19                       │   │
│   │              │  │                                  │   │
│   └──────────────┘  └─────────────────────────────────┘   │
│                                                             │
│   [ Footer (own MFE — Team C, Vue 3 — yes, mixed!) ]      │
└─────────────────────────────────────────────────────────────┘
   ↑              ↑              ↑              ↑
   Each MFE deployed independently to its own CDN URL.
   Shell loads them at runtime via manifest.
```

**Three integration approaches**:

| Approach                                              | How                            | When                                   |
| ----------------------------------------------------- | ------------------------------ | -------------------------------------- |
| **Build-time**                                        | npm packages, mono-repo        | Just modularizing code, not "true" MFE |
| **Server-side**                                       | SSR fragments (Tailor, Podium) | Edge stitching, low-JS sites           |
| **Run-time** (Module Federation, single-spa, iframes) | Browser loads remote bundles   | True independent deploy                |

True micro-frontends = **runtime integration**.

> 🇻🇳 **Ví dụ**: Mall (shell) chứa nhiều cửa hàng (MFE). Mỗi cửa hàng tự sửa, tự thay biển hiệu, không cần đóng cửa cả mall.

---

## A4. Layer 2 — Intermediate: 4 Core Concepts

### A4.1. Module Federation Mechanics

```
TIME:                Build                   Run
                     ─────                   ───
SHELL ────────► webpack.config.js: ────►  index.html
                  remotes: {                  │
                    catalog: 'catalog@        ▼
                      https://cdn/cat/        loads remoteEntry.js
                      remoteEntry.js'         │
                  }                           │
                                              ▼
                                          gets manifest:
                                          { './ProductCard': fn }
                                              │
                                              ▼
                                          import('catalog/ProductCard')
                                              │
                                              ▼
                                          downloads chunk, executes

CATALOG REMOTE ─► webpack.config.js: ────►  remoteEntry.js  (the manifest)
                    exposes: {              + main.js + chunks
                      './ProductCard':
                        './src/Card.tsx'
                    },
                    shared: {
                      react: { singleton: true,
                               requiredVersion: '^18.0.0' }
                    }
```

Key insight: `remoteEntry.js` is the **manifest** — small file (~5KB), lists what the remote exposes. The shell loads this once, then on-demand fetches actual chunks.

**Shared dependencies** is the make-or-break feature. With `singleton: true`, the first-loaded version "wins" and others use it. Without it, you ship 5 copies of React.

### A4.2. The Singleton Problem (The #1 MFE Bug)

```
Bad config:
  shell:    react@18.2.0
  catalog:  react@18.2.0  (NOT singleton)
  search:   react@18.3.0  (NOT singleton)
  cart:     react@19.0.0  (NOT singleton)

Browser ends up with 4 React copies.
First call to useState() in catalog → uses catalog's React instance.
Then catalog component re-renders inside shell → uses shell's React instance.
→ "Invalid hook call" or "Hooks can only be called inside function components"
```

**Correct config (every MFE)**:

```js
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
    eager: true,            // include in initial chunk if shell uses it immediately
  },
  'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
  '@company/design-system': { singleton: true, requiredVersion: '^3.0.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
}
```

**Version conflict resolution**:

- All compatible (`^18.0.0`): highest wins.
- Incompatible (`^18.0.0` and `^19.0.0`): browser console warning + falls back to local copy. Disaster.
- Solution: **enforce monorepo-style version catalog** (Renovate bot bumps all MFEs together for major versions).

### A4.3. Cross-MFE Communication

Five patterns, ranked by coupling:

```
LOOSEST                                                     TIGHTEST
─────────                                                  ─────────
URL state ──► Custom Events ──► Shared Store ──► Direct ──► Shared
(query params)  (window event)   (Redux slice)    Imports    Component
                                                  (Module    Tree
                                                  Federation)
```

**1. URL state (best for nav)**: Cart MFE writes `?items=3` → other MFEs read on route change. No coupling.

**2. Custom Events (good for fire-and-forget)**:

```js
// Cart MFE
window.dispatchEvent(
  new CustomEvent("cart:added", {
    detail: { sku: "SKU-123", qty: 2 },
  }),
);

// Header MFE
window.addEventListener("cart:added", (e) => updateBadge(e.detail));
```

Namespace events with prefixes. Document the schema. Emit through a wrapper for type safety.

**3. Shared Pub/Sub Library**: Expose a tiny `eventBus` from the shell, all MFEs import as singleton. Better than raw `window` events because typed and traceable.

**4. Shared store (Redux/Zustand singleton)**: Heaviest coupling. Use sparingly — only for global state (current user, theme, locale). All MFEs must agree on store shape.

**5. Direct component imports**: Catalog MFE imports `<MiniCart>` from cart MFE via Module Federation. Tightest coupling but sometimes necessary.

**Anti-pattern**: Sharing React Context across MFEs. Context is tied to React instance; even with singleton React, context provider in shell may not reach context consumer in remote due to Suspense boundaries. Use props or shared store instead.

### A4.4. Routing in MFE Architectures

Two main patterns:

**A) Shell owns routing (single-spa style)**:

```
Shell: <Route path="/catalog/*"  element={<CatalogMFE />} />
       <Route path="/account/*"  element={<AccountMFE />} />
       <Route path="/cart/*"     element={<CartMFE />} />

Each MFE then owns its own internal routes:
  CatalogMFE: <Route path="/" />, <Route path="/:sku" />
```

Single React Router instance (singleton-shared). Best for SPAs.

**B) MFEs are independent islands (Astro / Qwik style)**:

```
URL change = full nav OR client transition via View Transitions API.
Each MFE is a discrete page; less shared state.
```

**Bookmark/deep-link support**: requires routing to be deterministic. Decide URL ownership early; document it.

> 🇻🇳 **Quy tắc**: Trong 1 SPA monolithic, shell sở hữu top-level routes; mỗi MFE sở hữu sub-routes riêng. Shared singleton router.

---

## A5. Layer 3 — Senior/Staff: 5 Hard Problems

### A5.1. CSS Isolation Strategies

When 14 teams ship CSS, conflicts are inevitable.

| Strategy                                   | Isolation                 | Cost                      | When                                      |
| ------------------------------------------ | ------------------------- | ------------------------- | ----------------------------------------- |
| **CSS Modules**                            | High (hashed class names) | Build-time only           | Default for new MFEs                      |
| **Shadow DOM wrapper**                     | Total                     | Runtime, reflow on render | Embedded widgets, untrusted content       |
| **CSS-in-JS (Emotion, styled-components)** | High                      | Runtime cost              | If your stack already uses it             |
| **Scoped layers (`@layer`)**               | Medium                    | None (native)             | Modern browsers, clean cascade            |
| **Tailwind with prefix**                   | Medium                    | None                      | Tailwind shops; per-MFE prefix `tw-mfeA-` |
| **iframe**                                 | Total                     | Heavy (no DOM share)      | Untrusted 3P content                      |

**Common combo**: CSS Modules per MFE + Tailwind with `prefix: 'mfe-cat-'` to namespace utilities. Design system tokens via CSS custom properties on `:root`, inherited everywhere.

**The shared design system rule**: One version, singleton-shared. Visual regression testing across MFEs (Chromatic, Percy) is mandatory at >5 MFEs.

### A5.2. Versioning & Independent Deploy Strategy

**Atomic shell+remote deploys (anti-pattern)**: Defeats the purpose. Just use a monorepo.

**Truly independent deploys requires**:

1. **Backward-compatible contract**: Shell defines `interface MFEContract`; remote implements. Breaking changes = new major version of contract; shell loads vN AND vN+1 side-by-side until all remotes migrate.

2. **Manifest-based runtime config**:

```json
// Production manifest, served from /manifest.json
{
  "catalog": "https://cdn.com/catalog/v3.4.7/remoteEntry.js",
  "search": "https://cdn.com/search/v2.1.0/remoteEntry.js",
  "cart": "https://cdn.com/cart/v5.0.2/remoteEntry.js"
}
```

Deploy a remote = upload to CDN + update manifest. Zero shell change.

3. **Canary in the manifest**:

```json
{
  "catalog": {
    "stable": "https://cdn.com/catalog/v3.4.7/remoteEntry.js",
    "canary": "https://cdn.com/catalog/v3.5.0-rc1/remoteEntry.js",
    "rollout": 0.05
  }
}
```

5% of users get canary; gradual ramp.

4. **Contract tests in CI**: Each remote runs a test that mounts itself in a "fake shell" with the contract; pre-merge gate.

### A5.3. Performance Budget Per Team

```
Total page budget:           300KB JS gzipped, p95 LCP <2.5s

Allocation:
  Shell + design system:      80KB  (heaviest, paid once)
  React + ReactDOM (shared):  45KB
  Each above-the-fold MFE:    40KB (catalog, header)
  Each below-the-fold MFE:    20KB (footer, recommendations — lazy)
```

**Enforce in CI**:

```yaml
# .github/workflows/perf.yml
- run: bundlesize check
  with:
    files:
      - { path: "dist/main.js", maxSize: "40KB gzipped" }
```

**Monitoring**: Each MFE reports its own Real User Monitoring (RUM). Shell aggregates. SLO breach by one team = blocked deploy.

### A5.4. Security & Supply Chain

Each MFE is a separate npm dependency tree → larger attack surface.

**Mitigations**:

- **Subresource Integrity (SRI)**: `<script src="..." integrity="sha384-..."` on every remoteEntry. Prevents CDN tampering.
- **CSP per MFE**: Tight CSP on shell; allowlist remote origins explicitly.
- **Sandbox untrusted remotes** in iframe (e.g., third-party plugin marketplace).
- **Centralized dep scanning**: Snyk / Dependabot per repo + aggregated policy at platform level.
- **Signed manifests**: Manifest served with cryptographic signature; shell verifies before loading remotes (prevents manifest-poisoning).

War story: **British Airways' 2018 Magecart attack** loaded malicious JS via a third-party widget. SRI + tight CSP would have prevented it.

### A5.5. The "Shouldn't Have Done This" Signs

| Sign                                                 | Meaning                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| You have <30 frontend engineers                      | Probably overhead > benefit. Use a monorepo.                 |
| MFEs share a database directly                       | You decomposed UI but not domain. Real cost stays.           |
| Every change touches 3+ MFEs                         | Wrong slice boundary; you split horizontally not vertically. |
| You need a "release train" to coordinate MFE deploys | You lost independent deployability.                          |
| MFE bundle sizes growing 10%/month                   | Shared deps drift; design system not singleton.              |
| Cross-MFE imports proliferating                      | You're building a monolith with extra steps.                 |

**Decision matrix**:

```
                  Many teams?    Many domains?   Compliance need?
                  (>50 FE)       (>5 distinct)   (PCI/HIPAA)
Monorepo            ❌              ❌              ❌            → STAY MONOREPO
Modular monorepo    ✅              ❌              ❌            → Nx/Turborepo
Micro-frontends     ✅              ✅              ✅            → Module Federation
```

---

## A6. ⚠️ Common Mistakes (Top 10 Pitfalls)

| ❌ Sai lầm                               | 🤔 Tại sao sai                                | ✅ Đúng là                                                |
| ---------------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Không config `singleton: true` cho React | 5 React copies → "Invalid hook call"          | Singleton + requiredVersion cho mọi peer                  |
| Share React Context xuyên MFE            | Provider/consumer ở khác instance → undefined | Shared store hoặc props                                   |
| Build-time integration gọi là MFE        | Chỉ là npm packages                           | True MFE = runtime integration                            |
| Không có ErrorBoundary quanh remote      | 1 MFE crash = cả site trắng                   | `<ErrorBoundary><Suspense>...</Suspense></ErrorBoundary>` |
| Hard-code remote URLs trong shell        | Mỗi deploy phải đổi shell                     | Manifest-driven runtime config                            |
| MFEs share database cùng lúc             | UI tách nhưng data coupling còn → tệ hơn      | BFF pattern: mỗi MFE có own API                           |
| Mix React major versions tự do           | 18 vs 19 incompatible                         | Monorepo version catalog                                  |
| CSS global, không scope                  | 1 team đổi `.button` → cả site đổ             | CSS Modules / Shadow / namespace prefix                   |
| Cross-MFE import bừa                     | Coupling tightening âm thầm                   | Document allowed imports + lint rule                      |
| MFE cho team <30 người                   | Overhead > benefit                            | Stay monorepo, dùng Nx/Turborepo                          |

---

## A7. 🎤 Interview Pattern

**Strong signals**:

- Phân biệt **build-time vs run-time integration** (true MFE = runtime)
- Đề cập **singleton dependency problem** ngay khi nói Module Federation
- Hiểu **Conway's Law** + tổ chức quyết định kiến trúc
- Biết khi nào KHÔNG dùng MFE (signs trong A5.5)
- Có quan điểm về **CSS isolation** + **cross-MFE communication patterns**

**Role types**: Staff FE, FE Architect, Platform Engineer, anyone touching multi-team frontend org.

**Industries**: E-commerce (Zalando, Shopify), banking (HSBC, ING), media (DAZN, Spotify), enterprise SaaS, gov (UK gov.uk uses similar pattern).

---

## A8. 🔗 Knowledge Chain

**Prerequisites**: Webpack/Vite/Rspack, JS modules, React/Vue, CI/CD, dependency management.

**Unlocks**: Platform engineering, design system distribution, multi-team scaling, Backstage-style developer portals.

**Cross-track**:

- → [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) — alternative MFE contract
- → [FE System Design — Architecture Patterns](../08-fe-system-design/01-architecture-patterns.md)
- → [BE: API Design](../../be-track/02-backend-knowledge/01-api-design.md) — BFF for MFE
- → [2026: Platform Engineering & DX](../../2026-trends/12-platform-engineering-dx.md)

---

# B. Interview Questions — 10 Graded

---

## B1. 🟢 What is a micro-frontend? (L1)

**Answer (60 sec)**: A frontend architecture pattern where a single web app is composed of **multiple, independently-deployable frontend applications** owned by different teams. The user sees one UI; behind the scenes each section comes from a different bundle, possibly different framework, definitely different deploy pipeline. The motivation is **team autonomy** — Spotify's Search team ships independently from Player team. The integration happens at runtime via Module Federation, single-spa, or iframes. Build-time integration (npm packages) doesn't count as true MFE.

> 💡 **Interview Signal**: ✅ Strong = mentions team autonomy + runtime integration + counter-example (build-time doesn't count). ❌ Weak = "splitting React app into folders."

---

## B2. 🟢 Module Federation: shell vs remote? (L1)

**Answer**: A **shell** (also "host") is the application that loads other apps. A **remote** is an application that exposes modules for shells to consume. Configuration:

```js
// Shell: webpack.config.js
new ModuleFederationPlugin({
  name: "shell",
  remotes: { catalog: "catalog@https://.../remoteEntry.js" },
});

// Remote: webpack.config.js
new ModuleFederationPlugin({
  name: "catalog",
  filename: "remoteEntry.js",
  exposes: { "./ProductCard": "./src/Card.tsx" },
  shared: { react: { singleton: true } },
});
```

Shells consume `import('catalog/ProductCard')`. The browser fetches `remoteEntry.js` (manifest), then on-demand loads chunks. A single app can be both shell AND remote (bidirectional).

> 💡 **Interview Signal**: ✅ Strong = code config + bidirectional possibility. ❌ Weak = vague terminology.

---

## B3. 🟢 Why is `singleton: true` in shared deps so important? (L2)

**Answer**: Without it, each MFE bundles its own copy of React (or design-system, router, etc.). At runtime you get multiple React instances. **React's hooks state lives in module-level closures** — they only work when components and hooks share the _same React instance_. Two instances → "Invalid hook call: Hooks can only be called inside the body of a function component" or worse, silent bugs where state appears to "reset" mysteriously.

`singleton: true` tells Module Federation: "only ever load ONE version of this module across all MFEs." First-loaded wins (must satisfy `requiredVersion`); others use the shared instance. Mandatory for React, ReactDOM, react-router, design system, any state library.

Side benefit: bundle size. Loading React once (45KB) instead of 5× (225KB).

> 💡 **Interview Signal**: ✅ Strong = explains why hooks break + size benefit. ❌ Weak = "for performance."

---

## B4. 🟡 Compare Module Federation vs single-spa vs iframes. (L3)

**Answer**:

| Aspect                       | Module Federation               | single-spa                           | iframes                               |
| ---------------------------- | ------------------------------- | ------------------------------------ | ------------------------------------- |
| **Integration model**        | Module-level imports at runtime | Lifecycle-based (mount/unmount apps) | Page-level isolation                  |
| **DOM sharing**              | Yes (shared DOM tree)           | Yes                                  | No (iframe sandbox)                   |
| **Style isolation**          | Manual (CSS Modules/Shadow)     | Manual                               | Native (full sandbox)                 |
| **Framework mixing**         | Yes (React+Vue+Svelte)          | Yes (best at this)                   | Yes (totally isolated)                |
| **Shared deps optimization** | Native, sophisticated           | Manual                               | None (each iframe full bundle)        |
| **Routing**                  | Shared single router            | App-per-route                        | URL only                              |
| **Memory cost**              | Low                             | Low                                  | High (separate JS context per iframe) |
| **Security boundary**        | Shared origin                   | Shared origin                        | True (cross-origin available)         |
| **Best for**                 | New SPAs, shared design system  | Migrating legacy / mixing frameworks | Untrusted 3P content                  |

**Recommendation by 2026**: Module Federation for greenfield. single-spa if you're stuck with 3 different framework migrations. iframes for embedded payment/marketplace plugins where sandboxing matters more than DX.

> 💡 **Interview Signal**: ✅ Strong = comparative table + use-case-driven recommendation. ❌ Weak = picks one as "the best."

---

## B5. 🟡 How do MFEs communicate? Walk through 3 patterns with trade-offs. (L3)

**Answer**:

**Pattern 1: URL state (loosest coupling)**

```js
// Cart MFE
navigate(`/checkout?items=${cartIds.join(",")}`);
// Checkout MFE reads from URL on mount.
```

Pros: zero runtime coupling, bookmarkable, time-travels with browser back/forward. Cons: URL gets noisy, only string data.

**Pattern 2: Custom events via shared eventBus (medium coupling)**

```js
// shared/eventBus.ts (singleton-shared)
class EventBus extends EventTarget {}
export const eventBus = new EventBus();

// Cart MFE
eventBus.dispatchEvent(new CustomEvent("cart:added", { detail: { sku, qty } }));

// Header MFE
eventBus.addEventListener("cart:added", (e) => updateBadge(e.detail));
```

Pros: typed (with TS), traceable (intercept in dev), namespaced. Cons: implicit contract — must document events.

**Pattern 3: Shared store (tightest coupling)**

```js
// shared/store.ts (singleton)
export const useGlobalStore = create((set) => ({ user: null, theme: "light" }));

// Any MFE
const user = useGlobalStore((s) => s.user);
```

Pros: reactive, ergonomic. Cons: every MFE depends on store schema; breaking change = coordinated deploy.

**Anti-pattern**: React Context across MFEs. Even with singleton React, Suspense boundaries can break Provider/Consumer linkage. Use shared store instead.

> 💡 **Interview Signal**: ✅ Strong = ranks by coupling + concrete code + anti-pattern. ❌ Weak = "use Redux."

---

## B6. 🟡 Your MFE bundle sizes grew from 30KB to 80KB each in 6 months. Diagnose. (L4)

**Answer**: Likely "shared deps drift." Investigation:

1. **Run `webpack-bundle-analyzer` per MFE**. Look for duplicates of common libs (React, lodash, design system).

2. **Check shared config**: Are libs marked `singleton: true`? Is `requiredVersion` consistent across MFEs?

   ```bash
   grep -A 5 "shared:" mfe-*/webpack.config.js
   ```

3. **Check actual loaded versions in browser** (DevTools console):

   ```js
   Array.from(document.scripts).filter((s) => s.src.includes("react"));
   ```

   If you see multiple React URLs → singleton not working.

4. **Common root causes**:
   - **a)** Team added `react` to `dependencies` (not `peerDependencies`) → bundled.
   - **b)** Design system bumped to v4 in some MFEs, v3 in others → both versions loaded.
   - **c)** New MFE skipped the shared template; missed singleton config.
   - **d)** Tree-shaking broke (named imports vs deep imports) — `import _ from 'lodash'` vs `import map from 'lodash/map'`.
   - **e)** Polyfills added per MFE (core-js, regenerator) — should be in shell only.

5. **Fix**: Add lint rule preventing direct deps that should be shared. Add CI check:
   ```bash
   bundlesize --maxSize 40kb dist/*.js
   ```
   Add quarterly "shared deps audit" — Renovate bot bumps all MFEs together.

> 💡 **Interview Signal**: ✅ Strong = systematic investigation + code commands + multiple root causes. ❌ Weak = "minify more."

---

## B7. 🟡 Should a 12-engineer team adopt micro-frontends? (L4)

**Answer**: **Almost certainly no.** Calculate honestly:

**Cost of MFE for a small team**:

- Setup: 4-6 weeks of platform work for shell, manifest, CI/CD, contract tests.
- Per-MFE overhead: separate repo, CI, deploy, monitoring, on-call.
- Cognitive load: every engineer must understand Module Federation, shared deps, contract versioning.
- Performance: extra round-trips for remote loading.

**Benefit only realized when**:

- Teams genuinely conflict on the same code daily.
- Build times exceed 15+ minutes.
- Deploy cadences differ (e.g., billing must deploy weekly, marketing daily).
- Compliance forces isolation (PCI, HIPAA).

**For 12 engineers in one product**: A modular **monorepo** (Nx, Turborepo, Lerna) gives you 80% of the team-autonomy benefit at 10% of the operational cost. Use:

- Nx/Turborepo for incremental builds (only changed packages rebuild).
- Module boundaries with `dependency-cruiser` or Nx tags.
- Shared CI cache (Vercel Remote Cache, Nx Cloud).

**Reconsider MFE when**:

- You hit ≥30 FE engineers, OR
- Two teams want different release cadences, OR
- Compliance scope reduction is worth >$200K/year.

Be willing to say "no" to trendy patterns.

> 💡 **Interview Signal**: ✅ Strong = quantifies cost + recommends modular monorepo + clear reconsideration triggers. ❌ Weak = "always adopt MFE for scale."

---

## B8. 🔴 Design: A 14-team e-commerce checkout micro-frontend architecture. (L5)

**Answer (5 min structured)**:

**Constraints**:

- 14 teams: catalog, search, recommendations, cart, payment, shipping, tax, fraud, account, header, footer, banners, A/B framework, analytics.
- 50 markets, 30 currencies, 20 payment methods.
- Cart→checkout conversion is sacred: any new bug here costs ~$50K/hr.
- p95 LCP <2.5s globally.

**Architecture**:

```
                   ┌──────────────────────────────────┐
                   │       SHELL APP (Team 0)         │
                   │   - routes, auth, manifest        │
                   │   - design system singleton       │
                   │   - error boundaries              │
                   │   - RUM aggregation               │
                   │   - feature flag client           │
                   └──────────────────────────────────┘
                       │           │           │
            ┌──────────┘           │           └──────────┐
            ▼                      ▼                       ▼
   ┌────────────────┐   ┌────────────────┐    ┌────────────────┐
   │  Header MFE    │   │  Cart MFE      │    │  Payment MFE   │
   │  (Team 1)      │   │  (Team 4)      │    │  (Team 5)      │
   │  React 19      │   │  React 19      │    │  React 19      │
   │                │   │                │    │  iframe-isolated│
   │                │   │                │    │  for PCI       │
   └────────────────┘   └────────────────┘    └────────────────┘
            │                      │                       │
            └──────────────────────┼───────────────────────┘
                                   ▼
                        ┌──────────────────────┐
                        │   BFF per MFE        │
                        │   (Cloudflare Worker)│
                        └──────────────────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   Backend services   │
                        │   (catalog-svc, ...) │
                        └──────────────────────┘
```

**Key decisions**:

1. **Module Federation** with bundler standardization on **Rspack** (5× faster builds than Webpack 5).

2. **Manifest-driven runtime**: `/manifest.json` per environment + per market. Markets can adopt new MFE versions independently.

3. **Singleton shareds**: react, react-dom, design-system, router, eventBus, observability SDK.

4. **Payment isolated in iframe** (PCI scope shrinkage): payment fields collected in iframe served from `payments.example.com`. Tokenized; main page never sees PAN. Saves 6 figures in PCI audit.

5. **Cross-MFE communication**:
   - URL state for nav.
   - eventBus for `cart:updated`, `address:changed`.
   - Shared Zustand store ONLY for `currentUser`, `locale`, `currency`, `featureFlags`.
   - NO direct component imports between MFEs (lint rule enforces).

6. **CSS strategy**: Tailwind with per-MFE prefix + design-system tokens via CSS custom properties on `:root`. Visual regression in CI per MFE (Chromatic).

7. **Per-MFE perf budget**:
   - Shell + design system: 100KB
   - Cart, header, payment (above-the-fold): 50KB each
   - Footer, recommendations (lazy): 25KB each
   - Total p95 below 350KB.

8. **Observability**: Each MFE emits its own RUM with `mfe.name` + `mfe.version` tag. Dashboards split by MFE. SLO breach = automated rollback via canary + manifest revert.

9. **Deploy pipeline**:
   - Each MFE: PR → contract tests → preview env → canary 5% → 50% → 100%.
   - Manifest update is the "deploy"; CDN is immutable per version (`cdn/cart/v5.4.7/`).
   - Rollback = manifest update only. Mean rollback time <2 min.

10. **A/B framework**: Shell loads experiment config; MFEs read flags from shared store. Variant code path either inside MFE or as separate MFE version (manifest A vs B).

**Trade-offs**:

- ❌ Coordination overhead at major React/design-system upgrades. Mitigate: quarterly "version sync week" + Renovate bot.
- ❌ Shared eventBus = implicit coupling. Mitigate: TS schema in shared package; runtime validation in dev.
- ❌ Higher initial build complexity. Mitigate: shell platform team owns templates + Backstage-style scaffolds.

**Counterintuitive insight**: **Don't decompose by page; decompose by domain.** "Checkout page MFE" is wrong — it includes cart, payment, shipping which are different teams. Make `Cart MFE`, `Payment MFE`, `Shipping MFE` and let each render anywhere they're needed (cart page, mini-cart, checkout step).

**Exit criteria**: 14 teams shipping daily, p95 LCP <2.5s globally, 0 cross-team release-train events/month, rollback time <2 min, PCI scope reduced to payments MFE only.

> 💡 **Interview Signal**: ✅ Strong = isolated payment for PCI + manifest-driven + counterintuitive domain-vs-page decomposition + concrete budgets. ❌ Weak = "split by routes."

---

## B9. 🔴 Diagnose: Production incident — one MFE deploys, every page shows blank. (L5)

**Answer**: Triage in this order (each takes <5 min):

1. **Verify**: Is it actually that MFE? Check `/manifest.json` — what version is live? Diff with previous.

2. **Rollback first, investigate second**: Update manifest to previous version. Mean Time to Recover should be <2 min. **Don't debug in prod**.

3. **Common root causes**:
   - **a) Singleton broke**: New MFE bundled React (forgot singleton) → multiple instances → "Invalid hook call" cascade. Check Sentry for hook errors.
   - **b) Missing ErrorBoundary in shell**: One MFE crashed in lifecycle, took down shell render. Should NEVER happen — every MFE wrapped in `<ErrorBoundary>`. Audit shell.
   - **c) Bad remoteEntry.js URL**: 404 on remote → import promise rejects → unhandled rejection at top level → React unmounts.
   - **d) Shared dep version conflict**: New MFE shipped `react@19.1` against shell's `react@18.2` → `requiredVersion` mismatch warning + fallback to local copy → above singleton problem.
   - **e) CORS or CSP block**: New CDN URL not in CSP allowlist. Browser console: "Refused to load script."
   - **f) Eager loading of remote in shell init**: Sync resolution failed, blocked main thread.

4. **Forensic toolkit**:

   ```js
   // In browser console of failing page
   Object.keys(__webpack_require__.S).forEach((scope) => {
     console.log(scope, Object.keys(__webpack_require__.S[scope]));
   });
   // Shows shared dep versions actually loaded
   ```

   ```bash
   # Server-side: was the manifest update atomic?
   curl -I https://cdn/manifest.json   # check Last-Modified
   ```

5. **Long-term fix**:
   - Mandatory `ErrorBoundary` + Suspense fallback per remote in shell.
   - CI: contract test mounts each remote in fake shell with current manifest before deploy.
   - Canary at 1% before 100% rollout.
   - Add `mfe.version` to RUM error tags so we attribute crashes to specific MFE versions.

**War story**: A real DAZN incident (2020): one MFE upgraded React; lost singleton during Module Federation migration; took site down during Champions League final. Fixed by enforcing version catalog + canary by default for any shared dep change.

> 💡 **Interview Signal**: ✅ Strong = rollback first + 6 root causes + forensic commands + war story. ❌ Weak = "check the logs."

---

## B10. 🔴 Pitch to leadership: Migrate our 4-year-old React monolith to micro-frontends. (L6)

**Answer (4 min structured)**:

> "We need to cut deploy time from 8 hours to <1 hour and unblock our 70-engineer FE org. I propose a phased migration to micro-frontends over 12 months, starting with the highest-pain seams."

**Why now ($ + metrics)**:

- We have **70 FE engineers**, **5 product teams**, **1 monorepo**. Current state: 18-min CI, 8-hour deploy train, 4 release engineers full-time.
- Per measurement, **34% of dev time** is wasted on merge conflicts, "waiting for CI", "blocked by other team's deploy". Conservatively, **$2.4M/year** in lost productivity.
- 2 acquisitions blocked because target teams refuse to merge into our monolith.
- New product line (B2B portal) needs to ship without affecting B2C deploys; currently impossible.

**Why MFE specifically (vs other options)**:

| Option                           | Time   | $ Year 1  | Outcome                                |
| -------------------------------- | ------ | --------- | -------------------------------------- |
| Better CI (caching, parallelism) | 1Q     | $50K      | Solves CI time, not coupling           |
| Modular monorepo (Nx/Turborepo)  | 2Q     | $200K     | Solves builds, not independent deploy  |
| **Micro-frontends (phased)**     | **4Q** | **$1.2M** | **Solves all 3, unlocks acquisitions** |
| Big bang rewrite                 | 6Q     | $4M+      | High risk, market timing miss          |

**Phased plan**:

**Q1 — Platform (cost: $300K)**:

- Stand up shell app + Module Federation infra (Rspack-based).
- Pull out design system as singleton-shared package.
- Build manifest-driven CDN deployment.
- Backstage scaffolds for new MFE generation (10-min setup).

**Q2 — First seam (cost: $200K)**:

- Extract 1 leaf page (e.g., User Settings) as pilot MFE. Low risk, 1 team.
- Validate perf, observability, rollback workflow.
- Capture lessons; refine templates.

**Q3 — Pain seams (cost: $400K)**:

- Extract 3 highest-conflict areas: Catalog, Cart, Account.
- Each owned by 1 team. Independent deploy enabled.
- Old monolith routes proxy to new MFEs gradually.

**Q4 — Tail + sunset (cost: $300K)**:

- Extract remaining 4 sections.
- Sunset monolith repo. Decommission release train role.
- Acquisition team (Acme Corp) onboards as new MFE without merge.

**Risks + mitigations**:

- ❌ Singleton dep drift. Mitigate: Renovate bot + version catalog + CI bundle-size gate.
- ❌ Performance regression. Mitigate: per-MFE budget + RUM aggregation + canary rollouts.
- ❌ Team unfamiliarity. Mitigate: 2-week onboarding workshop + paired programming on first migration.
- ❌ Acquisitions deliver low-quality MFEs. Mitigate: contract tests + perf budget + design system enforcement.

**Counterintuitive insight**: **The migration is the real value, not the destination.** Decomposing forces clean module boundaries we've avoided for 4 years. Even if we revert to monolith later (we won't), the cleanup itself is worth $1M.

**Exit criteria**:

- Q4: deploy time <1 hour for any team independently.
- Q4: 0 cross-team release-train events/month.
- Year 2: unblock 2 acquisitions, ship B2B portal in parallel.
- Quantified: $2.4M/yr productivity unlock + ~$1.5M acquisition value = **5× ROI by year 2**.

> 💡 **Interview Signal**: ✅ Strong = quantified pain + phased plan with $ + acquisition angle + counterintuitive "migration IS the value" + ROI math. ❌ Weak = "MFE is modern best practice."

---

# C. Memorization Pack

## C1. 📇 Topic Card

```
┌────────────────────────────────────────────────────┐
│  MICRO-FRONTENDS @ SCALE                           │
│                                                     │
│  Mnemonic:  S-H-A-R-D-S                             │
│  • Singleton sharing  (React, design system)        │
│  • Host contract      (shell ↔ remote interface)    │
│  • Async boundaries   (Suspense + ErrorBoundary)    │
│  • Runtime resolution (manifest-driven)             │
│  • Dependency hygiene (version catalog)             │
│  • Scope isolation    (CSS, eventBus, globals)      │
│                                                     │
│  Big idea: Conway's Law solved.                     │
│  Used by: Spotify, Zalando, DAZN, Klarna, gov.uk   │
│                                                     │
│  Choose: Module Federation (greenfield),            │
│          single-spa (legacy mix), iframes (PCI)     │
└────────────────────────────────────────────────────┘
```

## C2. 📊 Q&A Summary Table

| #   | Question                      | Difficulty | Bloom      | Key Phrase                     |
| --- | ----------------------------- | ---------- | ---------- | ------------------------------ |
| B1  | What is a micro-frontend?     | 🟢 L1      | Remember   | runtime integration            |
| B2  | Shell vs Remote (Module Fed)  | 🟢 L1      | Understand | manifest + exposes             |
| B3  | Why singleton: true matters   | 🟢 L2      | Understand | hook instance binding          |
| B4  | MF vs single-spa vs iframe    | 🟡 L3      | Evaluate   | use-case driven                |
| B5  | 3 communication patterns      | 🟡 L3      | Apply      | URL → events → store           |
| B6  | Bundle size grew, diagnose    | 🟡 L4      | Analyze    | shared deps drift              |
| B7  | Should 12-eng team adopt MFE? | 🟡 L4      | Evaluate   | almost no, monorepo first      |
| B8  | Design 14-team checkout MFE   | 🔴 L5      | Create     | domain decomp + payment iframe |
| B9  | One MFE deploy blanks site    | 🔴 L5      | Analyze    | rollback first, 6 causes       |
| B10 | Pitch monolith→MFE migration  | 🔴 L6      | Evaluate   | $2.4M unlock + acquisitions    |

## C3. 🎙 Cold-Call (30-second pitch)

> "Micro-frontends are run-time-integrated frontend apps owned by separate teams. Mnemonic **SHARDS**: **S**ingleton sharing for React/design-system, **H**ost contract between shell and remote, **A**sync boundaries (Suspense + ErrorBoundary), **R**untime manifest-driven resolution, **D**ependency hygiene via version catalog, **S**cope isolation for CSS and globals. The killer use case is teams >30 with diverging deploy cadences — Spotify, Zalando, DAZN. Tooling-wise: Module Federation for greenfield, single-spa for legacy mixed-framework, iframes when PCI/sandboxing matters. The classic failures: singleton broken (5 React copies, hooks crash), missing ErrorBoundary (one MFE takes down site), and decomposing by page instead of domain. For <30 engineers, use a modular monorepo first — MFE overhead exceeds benefit."

## C4. ✅ Self-Check Quiz (5 items)

1. Why does build-time integration not count as true MFE? → _No independent runtime deploy; just npm modularization._
2. What happens if `singleton: true` is missing on React? → _Multiple instances, hooks crash with "Invalid hook call."_
3. What's the loosest cross-MFE communication pattern? → _URL state._
4. When should you NOT adopt MFE? → _When team <30, no compliance need, no diverging deploy cadences._
5. How do you achieve true independent deploy? → _Manifest-driven runtime config; deploy = upload + manifest update._

## C5. 🧒 Feynman Test (~250 words, VI)

Hãy tưởng tượng một trung tâm thương mại lớn. Nếu một công ty xây toàn bộ và mở từng cửa hàng, mỗi lần một cửa hàng muốn sửa biển hiệu phải chờ toàn bộ trung tâm đóng cửa, sửa, mở lại. Đó là **monolithic frontend** — một codebase, một deploy, mọi team chờ nhau.

**Micro-frontends** là cách làm khác: trung tâm thương mại chỉ cung cấp khung nhà, ánh sáng, hệ thống nước (đó là **shell app**). Mỗi cửa hàng (mỗi MFE) do một team riêng xây và sửa độc lập. Khi cửa hàng A muốn đổi biển, chỉ cần đổi cửa hàng A — các cửa hàng khác không bị ảnh hưởng. Trình duyệt khi load trang sẽ tải shell trước, rồi tải từng cửa hàng theo yêu cầu (qua "Module Federation").

Lợi ích: Spotify có 600 engineer mà vẫn ship code 4 giờ/lần thay vì 6 ngày/lần. Mỗi team tự deploy, tự release.

Nhược điểm: phức tạp. Nếu hai cửa hàng đều mang theo "phòng nghỉ React" của mình → trùng lặp 5 lần, browser crash. Phải có quy tắc: "phòng nghỉ React chỉ có một, mọi cửa hàng dùng chung" — đó là **singleton sharing**.

Khi nào dùng? Chỉ khi có >30 engineer, nhiều team với deploy cadence khác nhau, hoặc compliance (PCI cho payment) bắt buộc cô lập. Team nhỏ <30 người dùng monorepo (Nx, Turborepo) là đủ — đừng theo trend mà vác overhead vào người. Senior FE 2026 phải biết khi nào không dùng MFE cũng quan trọng như biết cách dùng.

## C6. 📅 Spaced Repetition Schedule

| Day           | Action                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| **Day 1**     | Read full file. Set up minimal Module Federation demo (1 shell + 1 remote). |
| **Day 3**     | Recall SHARDS. Add singleton config + verify in DevTools.                   |
| **Day 7**     | Add cross-MFE eventBus + ErrorBoundary. Simulate remote crash.              |
| **Day 14**    | Whiteboard B8 (14-team checkout) in 25 min.                                 |
| **Day 30**    | Read Cam Jackson's Martin Fowler MFE article + Zalando blog. Teach a peer.  |
| **Quarterly** | Re-read; check Module Federation 2.0 (Rspack, native federation).           |

## C7. 🗺 Connections Map

**Same track (FE)**:

- [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) — alternative MFE contract
- [Real-time Collaboration / CRDTs](./02-realtime-collaboration-crdts.md) — sync state across MFEs
- [FE System Design — Architecture](../08-fe-system-design/01-architecture-patterns.md)
- [Build Tools](../09-advanced-topics/) — Webpack, Vite, Rspack
- [Design Systems](../05-html-css/04-architecture.md)

**Cross-track**:

- [BE: API Design (BFF for MFE)](../../be-track/02-backend-knowledge/01-api-design.md)
- [BE: Microservices](../../be-track/02-backend-knowledge/02-microservices.md) — Conway's Law parallel
- [Shared: System Design Theory](../../shared/02-system-design/01-system-design-theory.md)
- [2026: Platform Engineering](../../2026-trends/12-platform-engineering-dx.md) — Backstage, scaffolds
- [2026: Edge Computing](../../2026-trends/04-edge-computing-serverless-2026.md) — manifest at edge

**Further reading**:

- [Cam Jackson — micro-frontends (martinfowler.com)](https://martinfowler.com/articles/micro-frontends.html)
- [Module Federation docs](https://module-federation.io/)
- [single-spa](https://single-spa.js.org/)
- [DAZN — Tech Blog on MFE](https://medium.com/dazn-tech)
- [Zalando — Project Mosaic](https://www.mosaic9.org/)
- [Spotify — Backstage](https://backstage.io/)
- [Klarna — micro-frontends lessons](https://engineering.klarna.com/)

---

[⬅ Back to TOC](../../00-table-of-contents.md) | **Prev**: [Real-time Collaboration / CRDTs](./02-realtime-collaboration-crdts.md) | **Next**: [Modern Platform Index →](./README.md)
