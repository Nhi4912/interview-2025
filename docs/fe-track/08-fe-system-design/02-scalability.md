# Frontend Scalability / Khả Năng Mở Rộng Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## FE System Design - Chapter 2 / Thiết Kế Hệ Thống FE - Chương 2

---

## Overview / Tổng Quan

- Khả năng mở rộng frontend không chỉ là hiệu năng runtime mà còn là khả năng mở rộng team, codebase, quy trình release, và vận hành.
- Đây là chủ đề trọng điểm cho phỏng vấn Mid/Senior khi hệ thống nhiều domain nghiệp vụ, nhiều squad, nhiều vùng địa lý.

```
Frontend Scalability — 5 Dimensions / 5 Chiều Mở Rộng

                  ┌─────────────────────────────────────┐
                  │         Frontend Application        │
                  └──────────────┬──────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    📈 Traffic              👥 Team                📦 Codebase
    CDN + SSR/SSG        Micro-frontends          Bundle splitting
    Virtual scroll        Monorepo               Tree shaking
    Lazy load          Code ownership           Build budgets
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
              🚀 Release                 🔭 Operations
           Feature flags              RUM monitoring
           Canary deploys            Error tracking
           Independent deploy         MTTR < 30min
```

## Related Reading / Tài Liệu Liên Quan

- [Architecture Patterns](./01-architecture-patterns.md)
- [Microservices Patterns](./06-microservices-patterns.md)
- [System Design Theory (Shared)](../../shared/02-system-design/system-design-theory.md)

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### Concept 1: What Frontend Scalability Really Means / Khả Năng Mở Rộng Frontend Thực Sự Là Gì

> 🧠 **Memory Hook**: Scalability is not "handle more traffic" — it's "let more teams ship faster without breaking each other."

**Why does this exist? / Tại sao tồn tại?**

- Why do large orgs hit frontend scaling problems? Because 20 engineers editing the same codebase = merge queues, shared deploy pipelines, one broken PR blocks everyone.
- Why can't runtime performance alone solve it? Because even a fast app becomes unshippable if 5 teams are blocked on one monorepo merge conflict.
- Why does organizational design affect technical design? Because Conway's Law — your architecture will mirror your team communication structure, so design them together.

```
[Frontend Scalability Dimensions]
         │
         ├── Traffic scale ──► CDN, lazy loading, virtual scrolling, SSR/SSG
         │
         ├── Team scale ──► micro-frontends, monorepo, code owners
         │
         ├── Codebase scale ──► bundle budgets, code splitting, build optimization
         │
         ├── Release scale ──► feature flags, canary, independent deploys
         │
         └── Operational scale ──► observability, RUM, MTTR
```

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                   | Tại sao sai                                  | Đúng là                                           |
| ----------------------------------------- | -------------------------------------------- | ------------------------------------------------- |
| Chỉ nghĩ scalability = performance        | Bỏ qua team velocity và release independence | Scalability = traffic + team + codebase + release |
| Scale quá sớm (micro-frontend cho 3 devs) | Tăng operational overhead không cần thiết    | Chọn kiến trúc phù hợp team size hiện tại         |
| Không đặt metric baseline                 | Không biết có scale được không               | Đo trước: LCP, lead time, bundle size, MTTR       |

**Interview Pattern:**

- Trigger: "How does your team handle growth?"
- Concept: Scalability has 5 dimensions: traffic, team, codebase, release, operations.
- Opening sentence: "When I think about frontend scalability, I separate it into five dimensions — traffic, team size, codebase growth, release velocity, and operational reliability — because each requires different solutions."

**Knowledge Chain:**

- Prereq: [Architecture Patterns](./01-architecture-patterns.md)
- Next: Micro-Frontend Architecture (Concept 2 below)

---

### Concept 2: Micro-Frontend Architecture / Kiến Trúc Micro-Frontend

> 🧠 **Memory Hook**: Micro-frontends = microservices for UI — each team owns its slice from code to deploy to production.

**Why does this exist? / Tại sao tồn tại?**

- Why not just use feature flags in a monolith? Because flags don't solve deploy coupling — team A's bug still blocks team B's release.
- Why is independent deployment the key metric? Because the ability to deploy without coordination is what enables true team autonomy.
- Why do micro-frontends add operational cost? Because you now have N build pipelines, N deploy targets, shared dependency version negotiation, and runtime composition challenges.

```
[Micro-Frontend Scaling Trade-off]

Team Autonomy (high)
        ^
        │  Module Federation ●
        │        ● iframes (max isolation)
        │  Single-SPA ●
        │        ● Web Components
        │  Modular Monolith ●
        │
        └──────────────────────────► Operational Complexity (high)
             low                              high

Decision rule: Move right only when deploy coupling hurts more than ops complexity.
```

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                   | Tại sao sai                                | Đúng là                                       |
| ----------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| Dùng micro-frontend vì "best practice"    | Tăng complexity không có ROI với team nhỏ  | Chỉ dùng khi ≥3 teams cần deploy độc lập      |
| Không có shared dependency policy         | Multiple React versions → runtime crash    | Singleton shared libs với version negotiation |
| Thiếu contract test giữa shell và remotes | Breaking change silently breaks production | Consumer-driven contract tests trong CI       |

**Interview Pattern:**

- Trigger: "When should you use micro-frontends?"
- Concept: Driven by team topology, not technology preference.
- Opening sentence: "Micro-frontends solve an organizational problem — deploy coupling — not a technical one. I'd only recommend them when multiple teams are blocked on each other's releases."

**Knowledge Chain:**

- Prereq: [Architecture Patterns - Module Federation](./01-architecture-patterns.md)
- Next: Monorepo & Design Systems (Concept 3 below)

---

### Concept 3: Monorepo & Design Systems at Scale / Monorepo & Hệ Thống Thiết Kế Ở Quy Mô Lớn

> 🧠 **Memory Hook**: Monorepo = one repo, many packages — atomic refactors across all teams, zero sync meetings.

**Why does this exist? / Tại sao tồn tại?**

- Why not separate repos for each team? Because cross-cutting changes (dependency upgrades, API changes) require coordinating N PRs across N repos.
- Why does a design system become a bottleneck? Because it centralizes decisions — if contributions are hard, teams fork or diverge, breaking consistency.
- Why does tooling matter more than structure? Because a monorepo without task graph + remote cache = unbearably slow CI that teams abandon.

```
[Monorepo Task Graph - Turborepo/Nx]

apps/checkout ──► packages/ui ──► packages/tokens
apps/marketing ──► packages/ui
apps/admin ──► packages/ui ──► packages/tokens

Build order: tokens → ui → apps (parallel)
Cache: if tokens unchanged, skip tokens + ui build
Affected: change tokens → rebuild tokens + ui + ALL apps
                  change checkout only → rebuild checkout only
```

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                   | Tại sao sai                        | Đúng là                                           |
| ----------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| Monorepo không có remote cache            | CI thời gian tăng theo số packages | Bật remote cache (Turborepo/Nx Cloud) ngay từ đầu |
| Design system không có contribution model | Teams patch local, diverge nhanh   | RFC nhẹ + release train + tiered ownership        |
| Version design tokens thủ công            | Drift giữa Figma và code           | Token pipeline tự động từ Figma → CSS vars        |

**Interview Pattern:**

- Trigger: "How do you manage shared UI across many teams?"
- Concept: Design system needs governance as much as good components.
- Opening sentence: "A design system lives or dies on its contribution model — technically it needs semantic versioning and visual regression tests, but organizationally it needs a lightweight RFC process so teams don't fork."

**Knowledge Chain:**

- Prereq: Micro-Frontend Architecture (Concept 2 above)
- Next: Performance at Scale (Concept 4 below)

---

### Concept 4: Performance at Scale — Virtual Scrolling, Lazy Loading, Code Splitting / Hiệu Năng Ở Quy Mô Lớn

> 🧠 **Memory Hook**: Never render what the user can't see, never load what the user won't use — virtual scrolling and code splitting are the same principle applied to DOM and bundles.

**Why does this exist? / Tại sao tồn tại?**

- Why does rendering 10,000 list items crash the browser? Because each DOM node costs memory and layout recalculation — 10k nodes = 10k layout objects in the render tree.
- Why can't lazy loading be applied everywhere? Because lazy-loaded routes have a waterfall: navigate → load JS → parse → render — adds latency for critical paths.
- Why does code splitting matter for team scalability? Because each team owning a lazy-loaded chunk means their code never blocks another team's initial load.

```
[Loading Strategy Decision Tree]

Is this content above the fold?
├── YES → eager load, SSR/SSG, preload critical resources
└── NO → Is it a route?
         ├── YES → route-based code splitting (React.lazy)
         └── NO → Is it a large list (>100 items)?
                  ├── YES → virtual scrolling (react-window)
                  └── NO → lazy load on interaction (import() on click/scroll)

CDN Layer:
  Static assets (JS, CSS, images) → serve from edge PoP
  HTML (SSR pages) → cache at edge with stale-while-revalidate
  Personalized HTML → bypass CDN cache or use edge compute
```

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                                   | Tại sao sai                         | Đúng là                                                  |
| --------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| Lazy load mọi thứ kể cả above-the-fold                    | Tăng waterfall cho critical content | Eager load critical path, lazy load the rest             |
| Virtual scroll với variable-height items không tính trước | Layout thrash vì remeasure liên tục | Dùng VariableSizeList hoặc AutoSizer + measurement cache |
| Code split quá nhiều chunk nhỏ                            | HTTP/2 overhead + nhiều round trips | Nhóm chunks theo route/feature domain                    |

**Interview Pattern:**

- Trigger: "How would you handle a product list with 50,000 items?"
- Concept: Windowing — render only visible viewport, recycle DOM nodes as user scrolls.
- Opening sentence: "I'd use virtual scrolling — only render the ~20 items visible in the viewport. The list container has a fixed height and we position items absolutely, so the browser thinks there are 50,000 items but only keeps ~20 DOM nodes alive."

**Knowledge Chain:**

- Prereq: [Browser rendering pipeline](../03-browser-rendering/01-rendering-pipeline.md)
- Next: State Management at Scale (Concept 5 below)

---

### Concept 5: State Management at Scale / Quản Lý State Ở Quy Mô Lớn

> 🧠 **Memory Hook**: One giant global store is a monolith — slice state by ownership: server state → TanStack Query, UI state → local, workflow state → Zustand/Redux slice.

**Why does this exist? / Tại sao tồn tại?**

- Why does a single Redux store become a problem at scale? Because every team adds to the same store → N teams create N reducers in one file → ownership unclear, selector performance degrades.
- Why separate server state from UI state? Because server state has different semantics: it has a remote source of truth, goes stale, needs background refresh — React Query handles this; Redux doesn't.
- Why does state architecture affect micro-frontends? Because sharing a global store across MFE boundaries creates hard coupling — each MFE should own its state, communicate via events.

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                              | Tại sao sai                                   | Đúng là                                   |
| ------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| Mọi API response vào Redux           | Redux không có caching/revalidation semantics | Dùng TanStack Query cho server state      |
| Global store shared qua MFE boundary | Tight coupling, phá vỡ độc lập deploy         | Custom events hoặc shared event bus       |
| Context cho high-frequency updates   | Re-render toàn tree khi state thay đổi        | Zustand/Jotai cho high-frequency UI state |

**Interview Pattern:**

- Trigger: "How do you structure state in a large React application?"
- Concept: Tiered state ownership — server, UI local, global workflow.
- Opening sentence: "I separate state into three layers: server state managed by TanStack Query with caching and revalidation, local UI state with useState/useReducer, and cross-component workflow state with a lightweight store like Zustand — each layer has clear ownership."

**Knowledge Chain:**

- Prereq: React component model
- Next: Build, CI & Feature Flags (Concept 6 below)

---

### Concept 6: Build, CI & Feature Flags / Build, CI & Feature Flags

> 🧠 **Memory Hook**: Affected-only CI = your build system knows your dependency graph, so it only tests what changed — like a smart diff that understands imports.

**Why does this exist? / Tại sao tồn tại?**

- Why does CI slow down as a monorepo grows? Because naive CI runs all tests on every commit — 500 packages × 30s tests = 4+ hours per PR.
- Why are feature flags architectural, not just operational? Because they decouple deploy from release — you can deploy unfinished code to production safely, enabling trunk-based development.
- Why do feature flags create tech debt if unmanaged? Because abandoned flags accumulate in code, and old flag conditions become impossible to reason about 6 months later.

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                           | Tại sao sai                           | Đúng là                                               |
| --------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| Chạy full CI cho mọi PR           | Thời gian CI tăng O(n) với số package | Affected-only pipeline với task graph                 |
| Feature flag không có expiry date | Codebase tích lũy dead code branches  | Mỗi flag có issue + cleanup deadline                  |
| Flag evaluation chỉ client-side   | Flicker khi user thấy A rồi B         | Hybrid: server-side assignment, client-side rendering |

**Interview Pattern:**

- Trigger: "How do you ship features to production safely?"
- Concept: Feature flags + canary deployment decouple deploy from release.
- Opening sentence: "I use feature flags to separate deployment from release — code ships to production behind a flag, we enable it for 1% of users, watch metrics, then progressively roll out. This means any engineer can deploy on Friday without fear."

**Knowledge Chain:**

- Prereq: Monorepo & CI tooling (Concept 3)
- Next: CDN & Edge Delivery (Concept 7 below)

---

### Concept 7: CDN & Edge Delivery for Frontend / CDN & Phân Phối Tại Edge

> 🧠 **Memory Hook**: CDN = move the file closer to the user's eyeballs — every 10ms of latency saved is a conversion rate improvement.

**Why does this exist? / Tại sao tồn tại?**

- Why can't the origin server handle all traffic? Because 100M users × 50 static files each = 5 billion requests — origin can't sustain this, and physical distance adds 100-300ms latency.
- Why does cache-busting via content hash matter? Because `main.abc123.js` means the CDN can cache forever (`Cache-Control: max-age=31536000, immutable`) — the hash changes only when content changes.
- Why is SSR at the edge different from SSR at origin? Because edge functions run in 30+ PoPs globally — a Vietnamese user gets HTML rendered in Singapore (50ms) vs a US origin (300ms).

```
[CDN Strategy for Frontend Assets]

User (Hanoi)
     │
     ▼
CDN Edge PoP (Singapore) ──► Cache HIT? ──► YES → serve in ~20ms
     │                                           (Cache-Control: immutable)
     │ Cache MISS
     ▼
Origin Server (US-East)  ──► render/fetch ──► ~280ms
     │
     └── static files: hash in filename → cache forever
         HTML pages: stale-while-revalidate → serve stale, refresh in BG
         API responses: short TTL or bypass CDN

Service Worker Layer (in browser):
     Precache shell → instant navigation after first load
     Background sync → queue mutations when offline
     Cache-first for images → reduce repeat loads
```

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                 | Tại sao sai                                   | Đúng là                                              |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| Cache HTML aggressively                 | Stale HTML với outdated JS hash references    | HTML: stale-while-revalidate hoặc no-cache           |
| Không dùng content-hash trong filenames | Không thể cache lâu vì không biết khi nào đổi | Webpack/Vite tự động thêm contenthash                |
| Service worker cache quá nhiều          | Stale assets phục vụ user lâu sau deploy      | Versioned cache key + cleanup old caches on activate |

**Interview Pattern:**

- Trigger: "How would you ensure fast load times globally?"
- Concept: CDN for static, edge compute for dynamic, service worker for repeat visits.
- Opening sentence: "The first layer is a global CDN serving all static assets with content-hashed filenames and immutable cache headers — that's free after the first visit. For HTML, I'd use stale-while-revalidate at the edge. For repeat visits, a service worker precaches the shell so navigation feels instant."

**Knowledge Chain:**

- Prereq: HTTP caching headers, service worker lifecycle
- Next: Internationalization at Scale (Concept 8 below)

---

### Concept 8: Internationalization at Scale / Quốc Tế Hóa Ở Quy Mô Lớn

> 🧠 **Memory Hook**: i18n at scale = translation pipeline, not translation files — automate extraction, review, and delivery so engineers never block on copy.

**Why does this exist? / Tại sao tồn tại?**

- Why do translation files drift in large teams? Because engineers add keys without notifying translators, keys get removed without removing translations, and no one owns the catalog.
- Why does pseudo-localization in CI help? Because it simulates 40% text expansion (English → German) and catches layout breakage before real translations arrive.
- Why load translations lazily per locale? Because shipping all 40 locale files to every user is wasteful — each file can be 100KB+.

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                           | Tại sao sai                                 | Đúng là                                         |
| --------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Hardcode strings in components    | Không thể dịch mà không sửa code            | Luôn dùng t('key') với translation hook         |
| Một file translation cho toàn app | Tất cả locales load cùng lúc, tốn bandwidth | Lazy load per-locale per-namespace              |
| Không có ownership theo domain    | Keys vô chủ, drift nhanh                    | Mỗi squad owns translation keys của domain mình |

**Interview Pattern:**

- Trigger: "How do you scale a product to 20 languages?"
- Concept: i18n pipeline with automated extraction and domain ownership.
- Opening sentence: "I'd set up a CI pipeline that extracts translation keys from source, syncs with a translation management system, and flags missing keys or unused keys in PRs — engineers ship features, translators work in parallel, and neither blocks the other."

**Knowledge Chain:**

- Prereq: CDN lazy loading per locale (Concept 7)
- Next: Governance & Observability (Concept 9 below)

---

### Concept 9: Governance & Observability at Scale / Quản Trị & Quan Sát Ở Quy Mô Lớn

> 🧠 **Memory Hook**: You can't govern what you can't measure — observability is the foundation that makes all governance decisions evidence-based, not opinion-based.

**Why does this exist? / Tại sao tồn tại?**

- Why do bundle budgets need automation? Because without automated PR checks, budgets are aspirational — the first time a team is in a rush, they exceed the budget and no one notices until it's 2× the limit.
- Why does frontend observability need RUM, not just synthetic? Because synthetic tests run from a fast datacenter; Real User Monitoring captures actual user devices, networks, and locations.
- Why correlate frontend traces to backend? Because a slow page could be caused by a slow API, a large JS bundle, or a CSS layout — without correlation, you can't diagnose across the stack.

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                                   | Tại sao sai                         | Đúng là                                     |
| ----------------------------------------- | ----------------------------------- | ------------------------------------------- |
| Chỉ đo Lighthouse score trong CI          | Synthetic, không phản ánh user thực | RUM với field data (CrUX, Datadog RUM)      |
| Bundle budget toàn app thay vì per-domain | Một team exceed không ai biết ai    | Per-domain budget + automated PR fail       |
| Không có correlation ID từ browser → API  | Không thể trace một slow request    | Inject trace ID từ edge vào HTML, propagate |

**Interview Pattern:**

- Trigger: "How do you maintain performance as the app grows?"
- Concept: Budget enforcement + RUM + distributed tracing.
- Opening sentence: "I enforce bundle budgets per domain as a CI gate, track Core Web Vitals via RUM broken down by squad's pages, and inject correlation IDs so I can trace a slow user experience from the browser all the way to the backend service."

**Knowledge Chain:**

- Prereq: Web Vitals, browser performance APIs
- Next: Senior Architecture Patterns (Concept 10 below)

---

### Concept 10: Senior Architecture Patterns — API Contracts, Rollout, Ownership / Mẫu Kiến Trúc Senior

> 🧠 **Memory Hook**: Senior architecture is about preventing surprises at scale — schema-first APIs, progressive rollouts, and explicit ownership maps mean no one is surprised when things change or break.

**Why does this exist? / Tại sao tồn tại?**

- Why do API contracts break at scale? Because without schema-first contracts (OpenAPI/GraphQL), teams assume API shape — one BE change silently breaks 3 FE teams.
- Why does progressive rollout reduce risk more than feature flags alone? Because even with flags, infrastructure changes (new CDN rules, new auth flows) need traffic-based canary to catch issues before they hit 100% of users.
- Why does ownership modeling matter architecturally? Because "shared" modules with no owner rot — bugs go unfixed, dependencies go un-upgraded, and eventually the module becomes a liability.

**Common Mistakes / Sai Lầm Phổ Biến:**

| Sai lầm                          | Tại sao sai                                  | Đúng là                                                      |
| -------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Breaking API changes without RFC | Silently breaks downstream FE consumers      | Schema-first + deprecation window (90 days) + announcement   |
| "Everyone owns" shared modules   | No one fixes bugs, upgrades dependencies     | Map ownership to business capability, enforce via CODEOWNERS |
| Big-bang architecture migration  | High risk, hard to rollback, team exhaustion | Strangler pattern: carve-out one domain at a time            |

**Interview Pattern:**

- Trigger: "How do you manage breaking changes in a large system?"
- Concept: Schema-first contracts + deprecation policy + communication channels.
- Opening sentence: "I treat API contracts like public APIs — schema-first with OpenAPI or GraphQL, a formal RFC process for breaking changes, a 90-day deprecation window, and an announcement channel. This means no surprise breakages."

**Knowledge Chain:**

- Prereq: All previous concepts
- Next: [Microservices Patterns](./06-microservices-patterns.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What does frontend scalability mean beyond traffic growth?

**Tổng Quan:**

- Bao gồm scale người dùng, team, miền nghiệp vụ, tốc độ release, độ tin cậy vận hành và chi phí thay đổi.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu ít nhất 3 chiều: traffic, team velocity, release independence — và link với metric cụ thể (lead time, LCP, bundle budget).
- ❌ Weak: Chỉ nói "scalability = handle more users" mà không đề cập đến team scaling hay release velocity.

---

### 🟢 [Junior] Q2. How to identify scalability bottlenecks in frontend organizations?

**Tổng Quan:**

- Đánh giá theo 4 lớp: kiến trúc code, build pipeline, runtime performance, và governance giữa các team.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Dùng framework 4-layer (code architecture, build pipeline, runtime, governance) và nêu ví dụ cụ thể cho từng layer.
- ❌ Weak: Chỉ nhắc đến performance profiling mà bỏ qua build time, team coupling, hay governance gaps.

---

### 🟢 [Junior] Q3. When should a team consider micro-frontends?

**Tổng Quan:**

- Khi domain lớn, release độc lập là bắt buộc, team tự chủ cao và monolith frontend gây tắc nghẽn phối hợp.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đặt điều kiện rõ ràng (≥3 teams, independent deploy required, monolith causing merge conflicts) trước khi recommend MFE.
- ❌ Weak: Recommend micro-frontends vì "best practice" hoặc "modern" mà không đánh giá trade-off với team nhỏ.

---

### 🟢 [Junior] Q4. Module Federation core concepts?

**Tổng Quan:**

- Host tải remote modules runtime, chia sẻ dependency versioned để giảm duplicate và cho phép deploy độc lập.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```js
// webpack module federation (host)
new ModuleFederationPlugin({
  name: "host",
  remotes: { billing: "billing@https://cdn.example.com/billing/remoteEntry.js" },
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
  },
});
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích host/remote/shared triad và tại sao `singleton: true` là bắt buộc với React (multiple React instances = broken hooks).
- ❌ Weak: Mô tả config syntax mà không giải thích tại sao singleton và version negotiation quan trọng.

---

### 🟢 [Junior] Q5. Single-SPA use cases and trade-offs?

**Tổng Quan:**

- Tốt cho orchestrate đa framework nhưng tăng complexity lifecycle, routing, style isolation và observability.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu trường hợp dùng hợp lý (legacy migration, multi-framework org) và rủi ro cụ thể (lifecycle management, CSS bleeding, bundle size).
- ❌ Weak: Chỉ mô tả Single-SPA là "micro-frontend framework" mà không nêu khi nào nên tránh.

---

### 🟢 [Junior] Q6. Web Components as micro-frontend boundary?

**Tổng Quan:**

- Chuẩn web giúp interoperability cao, nhưng DX/state sharing/theming có thể khó hơn React-native boundary.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt ưu điểm (framework-agnostic, browser-native isolation via Shadow DOM) vs nhược điểm (SSR khó, theming phức tạp, DX kém hơn React ecosystem).
- ❌ Weak: Chỉ nói "Web Components là chuẩn web nên tốt" mà không đánh giá DX và SSR trade-offs.

---

### 🟢 [Junior] Q7. How to choose between monolith FE and micro-frontends?

**Tổng Quan:**

- Dựa trên coupling nghiệp vụ, cadence release, maturity platform team và chi phí vận hành bổ sung.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Dùng decision framework: team size, deploy independence requirement, operational maturity — đưa ra recommendation có điều kiện thay vì absolute.
- ❌ Weak: Nói "micro-frontends always better for large apps" bỏ qua operational overhead và maturity requirement.

---

### 🟢 [Junior] Q8. Monorepo benefits for large frontend codebases?

**Tổng Quan:**

- Tăng tái sử dụng package, chuẩn hóa tooling, atomic refactor và visibility dependency toàn cục.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3 lợi ích khác nhau: atomic cross-package refactors, unified tooling/linting, single dependency graph — và trade-off (CI phải được cấu hình để affected-only).
- ❌ Weak: Chỉ nói "easier to share code" mà không đề cập đến CI implications hay dependency graph tooling.

---

### 🟢 [Junior] Q9. Turborepo vs Nx in practice?

**Tổng Quan:**

- Cả hai hỗ trợ task graph + cache; Nx mạnh về plugin/project graph governance, Turborepo đơn giản và nhẹ hơn.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"], "outputs": [] }
  }
}
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: So sánh theo use case — Turborepo for simpler setups needing fast cache, Nx for enterprise needing plugin ecosystem and project graph enforcement — không chỉ list features.
- ❌ Weak: Chỉ nói "Nx có nhiều tính năng hơn" mà không giải thích khi nào complexity của Nx là justified.

---

### 🟢 [Junior] Q10. How to design scalable component library?

**Tổng Quan:**

- Phải có API ổn định, semantic versioning, test visual/regression, accessibility và performance budget cho component.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đề cập đến API stability (semver), visual regression tests (Chromatic/Percy), bundle size budget per component, và a11y automated tests.
- ❌ Weak: Chỉ nói "document with Storybook" mà không đề cập đến breaking change management hay performance budgets.

---

### 🟢 [Junior] Q11. Design system architecture for multi-product organizations?

**Tổng Quan:**

- Tách token -> primitive -> composite -> product overrides để cân bằng consistency và flexibility.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả 4-layer: design tokens (brand) → primitive components → composite components → product-specific overrides — và giải thích tại sao mỗi layer cần tách biệt.
- ❌ Weak: Chỉ nói "dùng Figma và component library" mà không giải thích cấu trúc token-to-component hierarchy.

---

### 🟢 [Junior] Q12. How to avoid design system becoming bottleneck?

**Tổng Quan:**

- Thiết lập contribution model, RFC nhẹ, release train rõ ràng và ownership phân lớp component.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu contribution model cụ thể (RFC → PR → review → release) và tại sao tiered ownership (platform core vs product-specific) giảm bottleneck.
- ❌ Weak: Chỉ nói "tài liệu tốt hơn" mà không giải thích governance model ngăn chặn single-team bottleneck.

---

### 🟡 [Mid] Q13. Performance at scale: virtualization fundamentals?

**Tổng Quan:**

- Chỉ render vùng nhìn thấy (windowing) cho list lớn để giảm DOM node và main-thread workload.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```tsx
import { FixedSizeList } from "react-window";
export function VirtualizedList({ items }: { items: string[] }) {
  return (
    <FixedSizeList height={400} width={600} itemCount={items.length} itemSize={36}>
      {({ index, style }) => <div style={style}>{items[index]}</div>}
    </FixedSizeList>
  );
}
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích cơ chế windowing (fixed container height + absolute positioning + recycle off-screen nodes) và khi nào dùng VariableSizeList vs FixedSizeList.
- ❌ Weak: Chỉ nói "dùng react-window" mà không giải thích tại sao DOM nodes cần được giới hạn.

---

### 🟡 [Mid] Q14. Pagination vs infinite scroll trade-offs?

**Tổng Quan:**

- Pagination dễ SEO/navigation; infinite scroll tăng engagement nhưng khó footer access/state restore.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: So sánh theo use case (SEO content → pagination, feed/social → infinite scroll) và nêu technical challenges của infinite scroll (URL state, back-button restore, memory growth).
- ❌ Weak: Nói "infinite scroll is better UX" mà không xét SEO, accessibility, state restoration concerns.

---

### 🟡 [Mid] Q15. How to architect state management at scale?

**Tổng Quan:**

- Phân tầng state: server state, UI state cục bộ, global workflow state; tránh single store phình to.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt rõ 3 tầng (server state → TanStack Query, UI local → useState, global workflow → Zustand slice) và giải thích tại sao mỗi tầng cần tool khác nhau.
- ❌ Weak: Đề xuất "dùng Redux cho mọi thứ" hoặc "không cần Redux nữa, chỉ dùng Context" mà không giải thích trade-offs.

---

### 🟡 [Mid] Q16. When to use React Query/TanStack Query in large apps?

**Tổng Quan:**

- Phù hợp quản lý server state, caching, dedupe request, background revalidation theo domain data.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích vì sao TanStack Query giải quyết problems mà Redux không thiết kế để giải quyết (stale-while-revalidate, request deduplication, background refetch, optimistic updates).
- ❌ Weak: Nói "TanStack Query thay thế Redux" — đây là category error, chúng giải quyết different problems.

---

### 🟡 [Mid] Q17. How to enforce boundaries between frontend domains?

**Tổng Quan:**

- Dùng package boundary rules, lint constraints, code owners và contract tests giữa domain modules.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu kỹ thuật cụ thể: ESLint `import/no-restricted-paths`, Nx module boundary rules, CODEOWNERS cho enforcement, và contract tests để verify interfaces.
- ❌ Weak: Chỉ nói "follow folder conventions" mà không có tooling để enforce — conventions break under deadline pressure.

---

### 🟡 [Mid] Q18. Build system optimization for large codebases?

**Tổng Quan:**

- Bật incremental build, remote cache, task graph parallelism, và giảm type-check scope bằng project references.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả optimization stack: remote cache (hit rate >80% target), incremental TypeScript via project references, SWC/esbuild instead of babel, và affected-only test runs.
- ❌ Weak: Chỉ nói "dùng Vite thay Webpack" mà không giải thích broader build graph optimization strategy.

---

### 🟡 [Mid] Q19. How to scale CI for hundreds of frontend packages?

**Tổng Quan:**

- Chạy affected-only pipeline, test selection thông minh, shard jobs và cache artifacts.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3 strategies cùng nhau: affected-only via task graph, remote cache for unchanged packages, test sharding for parallelism — và nêu metric (CI time target <10 min for PRs).
- ❌ Weak: Chỉ nói "parallelize tests" mà không đề cập đến dependency graph awareness hay remote caching.

---

### 🟡 [Mid] Q20. Feature flags architecture in frontend?

**Tổng Quan:**

- Flag evaluation client/server hybrid, targeting rules, kill switch và lifecycle cleanup để tránh tech debt.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```ts
type FeatureFlags = { newCheckout: boolean; quickFilter: boolean };
export function isEnabled(flags: FeatureFlags, key: keyof FeatureFlags): boolean {
  return Boolean(flags[key]);
}
```

- Code chỉ là minh honduran; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đề cập hybrid evaluation (server assigns cohort to prevent flicker, client reads), flag lifecycle (creation → gradual rollout → 100% → cleanup), và tech debt prevention (flag expiry tracking).
- ❌ Weak: Chỉ mô tả `if (flag)` pattern mà không giải thích server/client evaluation split hay cleanup lifecycle.

---

### 🟡 [Mid] Q21. A/B testing infrastructure considerations?

**Tổng Quan:**

- Randomization ổn định, exposure logging chuẩn, guardrail metrics, và tránh flicker do late experiment assignment.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 4 yêu cầu: stable user assignment (avoid re-randomization), exposure logging at assignment point, guardrail metrics (not just success metric), và flicker prevention (SSR-side assignment).
- ❌ Weak: Chỉ nói "random 50/50 split" mà không đề cập đến sticky sessions, exposure logging, hay statistical validity.

---

### 🟡 [Mid] Q22. How CDN strategy supports frontend scalability?

**Tổng Quan:**

- Offload static delivery toàn cầu, giảm origin load, tối ưu TTFB với edge caching và image optimization.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Phân biệt caching strategy cho static assets (immutable + contenthash), HTML (stale-while-revalidate), và API (short TTL or bypass) — mỗi loại có cache header khác nhau có lý do rõ ràng.
- ❌ Weak: Chỉ nói "cache everything on CDN" mà không phân biệt static vs dynamic content caching strategies.

---

### 🟡 [Mid] Q23. Edge computing use cases for frontend delivery?

**Tổng Quan:**

- Personalization nhẹ, geo-routing, auth pre-check, header manipulation gần user để giảm latency.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```ts
// Edge middleware pseudo-code
export default async function middleware(request: Request) {
  const country = request.headers.get("cf-ipcountry") ?? "US";
  const variant = country === "VN" ? "asia-endpoint" : "global-endpoint";
  return fetch(new URL(`/config?variant=${variant}`, request.url));
}
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu use cases cụ thể với justification: geo-routing (redirect to nearest origin), auth pre-check (reject unauthenticated before origin), A/B assignment at edge (no flicker), và image optimization.
- ❌ Weak: Nói "edge = faster" mà không giải thích use cases cụ thể hay trade-off (edge functions có cold start, limited runtime).

---

### 🟡 [Mid] Q24. How to design i18n at scale for many locales?

**Tổng Quan:**

- Chuẩn hóa key naming, translation pipeline, fallback policy và pseudo-localization trong CI.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả full pipeline: key extraction from source → TMS sync → translator workflow → CI validation → lazy-load per locale bundle — và giải thích fallback chain (locale → language → default).
- ❌ Weak: Chỉ đề xuất "dùng i18next" mà không giải thích translation workflow hay how to prevent key drift.

---

### 🟡 [Mid] Q25. How to prevent translation drift in large teams?

**Tổng Quan:**

- Version hóa message catalog, review workflow với linguist, và ownership theo domain.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3 controls: automated key extraction CI check (fail PR if keys missing in source), domain ownership (team A owns checkout.\* keys), và staleness detection (unused keys flagged weekly).
- ❌ Weak: Chỉ nói "review translations in PR" mà không giải thích automated detection hay ownership model.

---

### 🟡 [Mid] Q26. How to keep bundles controlled across many teams?

**Tổng Quan:**

- Mỗi domain có budget riêng, PR size check, shared dependency policy và dashboard minh bạch.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu enforcement mechanism: bundlesize check as CI gate per domain, size diff report on every PR, shared dependency allow-list để ngăn duplicate libraries, và weekly bundle size dashboard.
- ❌ Weak: Chỉ nói "code review bundle size" mà không có automated enforcement — manual review không scale.

---

### 🟡 [Mid] Q27. How to manage shared dependencies safely in micro-frontends?

**Tổng Quan:**

- Định nghĩa compatibility matrix và fallback version để tránh runtime conflict giữa remotes.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Giải thích Module Federation shared config (singleton + requiredVersion + strictVersion), tại sao React phải là singleton, và upgrade strategy (compatibility matrix với test matrix).
- ❌ Weak: Chỉ nói "pin to same version" mà không giải thích runtime negotiation mechanism hay upgrade coordination.

---

### 🟡 [Mid] Q28. What is platform team responsibility in scalable frontend?

**Tổng Quan:**

- Cung cấp golden path: tooling, templates, CI standards, observability, security guardrails.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả platform team theo "enabling team" (Team Topologies model): không block product teams, cung cấp self-service tools, và đo success bằng developer satisfaction + time-to-first-deploy.
- ❌ Weak: Mô tả platform team như "gatekeepers" — đây là anti-pattern tạo bottleneck.

---

### 🟡 [Mid] Q29. How to introduce architecture changes incrementally?

**Tổng Quan:**

- Adopt strangler pattern: carve-out dần domain, đo kết quả, rollback plan rõ ràng.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả strangler fig pattern cụ thể: identify leaf domain → extract first → measure → extract next — với clear rollback criteria (nếu lead time tăng sau 4 weeks, rollback).
- ❌ Weak: Đề xuất "big-bang rewrite" hoặc không có rollback plan — đây là red flags trong bất kỳ senior interview nào.

---

### 🟡 [Mid] Q30. How to structure frontend observability at scale?

**Tổng Quan:**

- Thu thập RUM, logs, traces theo user journey; correlation ID từ edge -> browser -> API.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả 3 layers: RUM (Core Web Vitals, error rates per page/squad), structured logging (user journey events), distributed tracing (correlation ID browser → edge → API) — và ownership (squad owns dashboards for their pages).
- ❌ Weak: Chỉ nhắc Sentry for errors mà không đề cập đến performance observability hay trace correlation.

---

### 🔴 [Senior] Q31. How to govern API contracts with many frontend teams?

**Tổng Quan:**

- Dùng schema-first (OpenAPI/GraphQL contracts), mocking chuẩn và breaking-change policy nghiêm ngặt.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```yaml
breaking-change-policy:
  require-rfc: true
  deprecation-window-days: 90
  communication-channel: "#fe-platform-announcements"
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu schema-first workflow (OpenAPI/GraphQL schema checked in, contract tests in CI, consumer-driven contracts via Pact) và tại sao 90-day deprecation window là minimum cho large orgs.
- ❌ Weak: Nói "communicate changes in Slack" — informal communication không scale và không auditable.

---

### 🔴 [Senior] Q32. How to handle dependency upgrades in monorepo?

**Tổng Quan:**

- Automate update batches, canary testing, codemods và ownership rõ để giảm upgrade freeze.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả automated Dependabot/Renovate config với batching by category, codemods for breaking changes, canary testing against key apps before merging, và clear ownership for approving upgrades.
- ❌ Weak: Chỉ nói "upgrade regularly" mà không có automation strategy cho monorepo scale.

---

### 🔴 [Senior] Q33. How to scale frontend security practices?

**Tổng Quan:**

- Security linting, dependency scanning, CSP baseline, threat modeling theo release milestones.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu layered approach: automated (eslint-plugin-security + npm audit in CI), platform-level (CSP header via platform team), và process-level (threat modeling checklist for new features handling user data).
- ❌ Weak: Chỉ nói "npm audit" mà không đề cập đến CSP, security linting, hay threat modeling.

---

### 🔴 [Senior] Q34. How to avoid CSS conflicts in micro-frontends?

**Tổng Quan:**

- Dùng design tokens + scoped styles + naming convention hoặc shadow DOM cho isolation.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: So sánh 3 isolation strategies: CSS Modules/BEM (convention-based, leaks), CSS-in-JS (runtime, some isolation), Shadow DOM (strong isolation but SSR/theming hard) — và recommend based on context.
- ❌ Weak: Chỉ nói "dùng BEM naming" mà không giải thích tại sao naming convention alone không đủ và khi nào cần Shadow DOM.

---

### 🔴 [Senior] Q35. How to design rollout strategies for risky frontend changes?

**Tổng Quan:**

- Canary theo cohort, feature flag progressive rollout, rollback one-click và synthetic checks.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

```txt
Rollout Plan:
1) Internal users 5%
2) Public users 10%
3) Public users 50%
4) Public users 100%
```

- Code chỉ là minh họa; trọng tâm là nguyên tắc thiết kế và vận hành lâu dài.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả full rollout plan với: cohort definition (internal → beta → 1% → 10% → 100%), automated rollback triggers (error rate spike, conversion drop), và synthetic monitoring at each stage.
- ❌ Weak: Chỉ nói "deploy slowly" mà không có automated rollback triggers hay monitoring strategy per stage.

---

### 🔴 [Senior] Q36. How to keep UX consistent across independent squads?

**Tổng Quan:**

- Design system governance + UX council + shared quality bar cho accessibility/performance/content.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Đề xuất multi-layer approach: design tokens enforce visual consistency, design system enforces component behavior, UX council handles cross-squad pattern decisions, shared a11y/perf quality bar enforced in CI.
- ❌ Weak: Chỉ nói "dùng design system" mà không giải thích governance model hoặc cách xử lý khi squads diverge.

---

### 🔴 [Senior] Q37. How to manage runtime configuration in global deployments?

**Tổng Quan:**

- Config từ edge/env endpoint, cache hợp lý, versioned schema và fallback an toàn.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả config delivery strategy: env-specific config endpoint at edge, short-TTL cache (5min) with stale-while-revalidate, versioned schema for backward compat, và safe defaults for all config keys.
- ❌ Weak: Chỉ nói "dùng environment variables" mà không giải thích runtime config updates hay schema versioning.

---

### 🔴 [Senior] Q38. How to scale accessibility in big frontend organizations?

**Tổng Quan:**

- A11y checklist in PR, automated axe tests, training định kỳ và accountable ownership.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu 3-layer approach: automated (axe-core in CI catches ~30% of issues), manual review checklist for new UI patterns, và periodic screen-reader testing with disabled users — với squad-level ownership.
- ❌ Weak: Chỉ nói "add axe tests" mà không đề cập đến manual testing, ownership, hay training — automated tools chỉ catch 30% of a11y issues.

---

### 🔴 [Senior] Q39. How to model ownership for scalable FE architecture?

**Tổng Quan:**

- Map ownership theo business capability, tránh shared mutable modules không rõ chủ sở hữu.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Dùng CODEOWNERS to enforce ownership in code review, map packages to business capabilities (not org chart — org changes, capabilities don't), và audit "ownerless" code periodically.
- ❌ Weak: Chỉ nói "mỗi team own feature folder" mà không giải thích shared modules handling hay enforcement mechanism.

---

### 🔴 [Senior] Q40. How to answer senior scalability interview questions?

**Tổng Quan:**

- Trình bày theo framework: context -> constraints -> options -> decision -> migration -> metrics.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Sử dụng framework 6 bước có kỷ luật: context (team size, current pain) → constraints (budget, timeline, risk tolerance) → options (với trade-offs) → decision (với justification) → migration (strangler fig) → success metrics.
- ❌ Weak: Nhảy thẳng vào technical solution mà không clarify context và constraints — senior engineers always clarify before solving.

---

### 🔴 [Senior] Q41. What are warning signs of over-engineering scalability?

**Tổng Quan:**

- Áp dụng micro-frontends quá sớm, nhiều abstraction không giá trị, tăng lead time mà không cải thiện outcome.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu concrete red flags: lead time tăng sau migration (không giảm), engineers spend more time on infra than features, complexity inversely proportional to team size — và cách reverse: YAGNI principle applied to architecture.
- ❌ Weak: Chỉ nói "don't over-engineer" mà không đưa ra specific signals hay reversal strategy.

---

### 🔴 [Senior] Q42. How to create a long-term scalability roadmap?

**Tổng Quan:**

- Xác định baseline, ưu tiên bottleneck lớn nhất, đặt milestone đo lường và cơ chế governance bền vững.
  **Giải thích:**
- Trả lời tốt cần kết nối giữa technical design và organizational design (team boundaries, ownership, release model).
- Luôn nêu metric xác thực hiệu quả: lead time, change failure rate, LCP/INP, bundle budget, MTTR.
  **Ví dụ:**
- Ví dụ thực tế nên mô tả migration theo từng giai đoạn thay vì "big-bang rewrite".

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Mô tả roadmap structure: baseline measurement → identify top 3 bottlenecks by impact → quarterly milestones với measurable outcomes → governance cadence (monthly architecture review) — không chỉ list of technologies.
- ❌ Weak: Đề xuất technology list (GraphQL, MFE, monorepo) mà không link to business outcomes hay measurement strategy.

---

## Scalability Checklist / Checklist Mở Rộng

- Có architecture decision record (ADR) cho các quyết định lớn.
- Có chuẩn package boundary + ownership + code owners.
- Có CI affected builds + cache + release guardrails.
- Có performance/security/accessibility budgets theo domain.
- Có roadmap migration và sunset plan cho kỹ thuật cũ.

## Cross References / Điều Hướng Kiến Thức

- [Architecture Patterns](./01-architecture-patterns.md)
- [Microservices Patterns](./06-microservices-patterns.md)
- [System Design Theory (Shared)](../../shared/02-system-design/system-design-theory.md)

## Advanced Drill Q&A / Bộ Câu Hỏi Nâng Cao

### 🟡 [Mid] Extra Q1. How to scale documentation for large frontend platforms?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nêu docs-as-code (MDX in monorepo, auto-generated API docs), ownership (squad owns docs for their domain), và discoverability (search + tagging) — không chỉ "viết README tốt hơn".
- ❌ Weak: Chỉ nói "better documentation" mà không giải thích ownership, tooling, hay maintenance strategy.

---

### 🟡 [Mid] Extra Q2. How to design architecture review process without slowing teams?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Tiered review model: lightweight RFC for local decisions, async review for cross-team changes, synchronous review only for org-wide architectural shifts — với SLA per tier.
- ❌ Weak: "Mọi architectural decision cần approval committee" — đây là bottleneck pattern.

---

### 🟡 [Mid] Extra Q3. How to standardize error handling across micro-frontends?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Shared error boundary component from platform team + error event bus (remote emits, shell catches) + correlation ID for cross-MFE debugging + standardized error schema.
- ❌ Weak: Nói "mỗi MFE handle errors riêng" mà không có cross-MFE error propagation hay correlation.

---

### 🟡 [Mid] Extra Q4. How to scale frontend testing strategy (unit/integration/e2e)?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Testing pyramid at scale — unit tests fast and many, integration tests per domain (MSW mocking), e2e tests limited to critical user journeys, visual regression for design system, contract tests between MFEs.
- ❌ Weak: Chỉ nói "tăng test coverage" mà không phân tầng theo speed/confidence trade-off.

---

### 🟡 [Mid] Extra Q5. How to make performance ownership visible per squad?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Tag RUM events với squad identifier → per-squad Core Web Vitals dashboard → weekly performance review trong squad ceremonies → automated alert khi squad's pages regress.
- ❌ Weak: Shared performance dashboard không có squad breakdown — không ai cảm thấy accountable.

---

### 🟡 [Mid] Extra Q6. How to govern npm package publishing in monorepo?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Automated changesets workflow (changeset PR → version bump → CI publish), private registry for internal packages, semver enforcement via CI check, và CODEOWNERS requiring platform review for shared packages.
- ❌ Weak: Manual versioning và publish — không reproducible và error-prone at scale.

---

### 🟡 [Mid] Extra Q7. How to prevent circular dependencies at scale?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Nx/Eslint module boundary rules enforce DAG structure, `import/no-cycle` eslint rule in CI, periodic `madge` dependency graph visualization, và shared types package to break dependency cycles.
- ❌ Weak: Chỉ nói "code review" mà không có automated detection — circular deps sneak in under deadline pressure.

---

### 🟡 [Mid] Extra Q8. How to scale frontend onboarding for new engineers?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Golden path tooling (one-command setup), curated learning path per role, buddy pairing system, và "first PR in day 3" metric để đo onboarding effectiveness.
- ❌ Weak: Chỉ nói "viết README" mà không có structured onboarding với measurable outcomes.

---

### 🟡 [Mid] Extra Q9. How to run design system migrations safely?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Codemods for automated refactoring, parallel publish (v1 + v2 both available during migration), visual regression tests gate per domain, và squad adoption tracking dashboard.
- ❌ Weak: Nói "mọi team migrate cùng lúc" — không feasible với 20 squads và đây là all-or-nothing risk.

---

### 🟡 [Mid] Extra Q10. How to coordinate cross-team release calendars?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Independent deployment eliminates calendar coordination — if squads can deploy independently via MFE or feature flags, release calendar is per-squad. Only shared infrastructure changes need coordination.
- ❌ Weak: Elaborate release train scheduling — this solves coordination symptom, not the underlying coupling problem.

---

### 🟡 [Mid] Extra Q11. How to scale experimentation governance ethically?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Ethics review for experiments affecting vulnerable users, guardrail metrics that auto-stop harmful experiments, transparency report, và consent mechanisms for sensitive data collection.
- ❌ Weak: Chỉ nói "statistical significance" mà không đề cập đến ethical guardrails hay potential harms.

---

### 🔴 [Senior] Extra Q12. How to scale personalization without hurting cache hit ratio?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Separation of cacheable shell from personalized data: CDN caches HTML shell + static assets (100% hit rate), personalization data fetched client-side or via edge compute — so cache hit ratio stays high.
- ❌ Weak: Chỉ nói "bypass CDN for personalized content" — đây là correct but incomplete, không giải thích shell/data separation strategy.

---

### 🔴 [Senior] Extra Q13. How to architect search-heavy frontend experiences at scale?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Debounce + cancellation, optimistic pre-fetch on hover, URL-synced search state for shareability, virtual scrolling for results, và query result caching with stale-while-revalidate.
- ❌ Weak: Chỉ đề cập debounce mà không nói đến URL state, request cancellation, hay results caching.

---

### 🔴 [Senior] Extra Q14. How to scale realtime features (notifications, collaboration)?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: WebSocket for collaboration (low latency, bidirectional), SSE for notifications (simpler, one-way), reconnection with exponential backoff, và offline queue for mutations during disconnection.
- ❌ Weak: "Dùng WebSocket cho mọi thứ realtime" — SSE đơn giản hơn và đủ cho notifications.

---

### 🔴 [Senior] Extra Q15. How to manage websocket connection limits in browser fleets?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Shared WebSocket connection via BroadcastChannel (one WS per origin, share across tabs), connection pooling, và graceful degradation to polling when WS unavailable.
- ❌ Weak: Không biết browser limit (6 connections per origin HTTP/1.1, practically unlimited HTTP/2) hay không đề cập tab multiplexing.

---

### 🔴 [Senior] Extra Q16. How to scale offline sync conflict handling in frontend?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: CRDTs for automatic conflict resolution (Google Docs approach), last-write-wins for simple cases, user-facing conflict UI for high-stakes data (user explicitly resolves), và service worker background sync queue.
- ❌ Weak: Chỉ nói "last write wins" mà không phân tích khi nào cần user resolution hay CRDTs.

---

### 🔴 [Senior] Extra Q17. How to model frontend domain events for analytics consistency?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Schema-first event taxonomy (Snowplow/Segment schema registry), typed event dispatch từ components, validation in dev mode, và per-squad event ownership để tránh naming drift.
- ❌ Weak: Chỉ nói "fire analytics events in components" mà không có schema governance hay type safety.

---

### 🔴 [Senior] Extra Q18. How to keep type safety across many shared packages?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: TypeScript project references for incremental type-check, strict mode enabled globally, shared types package as single source of truth, và branded types để ngăn primitive obsession across domain boundaries.
- ❌ Weak: Chỉ nói "enable TypeScript" mà không đề cập đến project references cho performance hay strict mode governance.

---

### 🔴 [Senior] Extra Q19. How to scale content platforms with MDX-like pipelines?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: SSG for static content (pre-render at build → CDN cache), ISR for semi-dynamic (revalidate on demand), MDX component registry with version control, và content preview workflow for authors.
- ❌ Weak: Chỉ đề xuất CMS tool mà không giải thích rendering strategy (SSG vs ISR vs SSR) và CDN implications.

---

### 🔴 [Senior] Extra Q20. How to plan deprecation lifecycle for frontend APIs/components?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: 4-phase lifecycle: announce (with migration guide) → warn (runtime console warning + lint rule) → error (lint error) → remove — với codemod provided at each step và sunset date in changelog.
- ❌ Weak: Chỉ xóa API và update docs — không có migration tooling hay phased deprecation.

---

### 🔴 [Senior] Extra Q21. How to avoid platform lock-in in frontend infrastructure?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Adapter pattern for platform-specific APIs (CDN, analytics, feature flags) — swap provider without touching application code; evaluate lock-in cost explicitly: migration cost vs vendor benefits.
- ❌ Weak: Chỉ nói "dùng open source" mà không giải thích adapter pattern hay how to evaluate lock-in risk systematically.

---

### 🔴 [Senior] Extra Q22. How to measure ROI of scalability investments?

**Tổng Quan:**

- Đây là câu hỏi mở rộng để kiểm tra tư duy thiết kế, bảo mật, vận hành ở cấp độ hệ thống frontend lớn.
  **Giải thích:**
- Khi trả lời, cần gắn với context thực tế (quy mô người dùng, ràng buộc tổ chức, năng lực vận hành).
- Luôn trình bày trade-off giữa tốc độ phát triển, độ an toàn, độ phức tạp kỹ thuật và trải nghiệm người dùng.
  **Ví dụ:**
- Nêu một rollout plan 2-4 giai đoạn, metric đánh giá thành công, và điều kiện rollback rõ ràng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Before/after metrics for each investment: lead time (deployment coupling → MFE), CI time (full build → affected), incident rate (poor observability → RUM + alerting) — nêu cụ thể bao nhiêu % improvement.
- ❌ Weak: Chỉ nói "cải thiện developer experience" mà không có concrete before/after measurements.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                       | Difficulty | Core Concept                         | Key Signal                                                                                              |
| --- | ------------------------------------------------------------- | ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | Frontend scalability nghĩa là gì ngoài traffic growth?        | 🟢 Junior  | Scalability dimensions               | ≥3 dimensions: traffic, team velocity, release independence — and how they differ                       |
| 2   | Identify scalability bottlenecks trong frontend organizations | 🟢 Junior  | Bottleneck diagnosis framework       | 4-layer framework: code architecture, build pipeline, runtime, governance                               |
| 3   | Khi nào nên cân nhắc micro-frontends?                         | 🟢 Junior  | MFE decision criteria                | ≥3 teams + independent deploy required + monolith causing pain                                          |
| 4   | Module Federation core concepts                               | 🟢 Junior  | Module Federation fundamentals       | Host/remote/shared triad; `singleton: true` is mandatory for React                                      |
| 5   | Single-SPA use cases and trade-offs                           | 🟢 Junior  | Single-SPA patterns                  | Use for: legacy migration, multi-framework org; know lifecycle overhead cost                            |
| 6   | Web Components as micro-frontend boundary                     | 🟢 Junior  | Web Components for MFE               | Framework-agnostic + Shadow DOM isolation; DX/SSR trade-offs                                            |
| 7   | Chọn giữa monolith FE và micro-frontends thế nào?             | 🟢 Junior  | MFE vs monolith decision             | Decision framework: team size + deploy independence + operational maturity                              |
| 8   | Monorepo benefits cho large frontend codebases                | 🟢 Junior  | Monorepo advantages                  | 3 distinct benefits: atomic refactors, unified tooling, shared visibility                               |
| 9   | Turborepo vs Nx in practice                                   | 🟢 Junior  | Build orchestration tools            | Turborepo for simpler setups; Nx for plugin ecosystem and graph analysis                                |
| 10  | Design scalable component library                             | 🟢 Junior  | Component library architecture       | API stability (semver), visual regression tests, documentation as first-class                           |
| 11  | Design system architecture for multi-product organizations    | 🟢 Junior  | Design system layers                 | 4-layer: tokens → primitive → composite → product overrides                                             |
| 12  | Avoid design system becoming bottleneck                       | 🟢 Junior  | Design system governance             | Contribution model RFC → PR → review → release; RFC must be lightweight                                 |
| 13  | Performance at scale: virtualization fundamentals             | 🟡 Mid     | Virtual scrolling / windowing        | Windowing mechanism: fixed container + absolute positioning + DOM node recycling                        |
| 14  | Pagination vs infinite scroll trade-offs                      | 🟡 Mid     | Data loading UX patterns             | SEO content → pagination; feed/social → infinite scroll; use case drives choice                         |
| 15  | Architect state management at scale                           | 🟡 Mid     | Layered state architecture           | 3 layers: server state (TanStack Query), UI local (useState), global workflow (Zustand)                 |
| 16  | When to use React Query/TanStack Query in large apps          | 🟡 Mid     | Server state management              | TanStack Query solves: cache, dedupe, background sync — Redux doesn't handle server state               |
| 17  | Enforce boundaries between frontend domains                   | 🟡 Mid     | Domain boundary enforcement          | ESLint `import/no-restricted-paths`, Nx module boundary rules, CODEOWNERS                               |
| 18  | Build system optimization for large codebases                 | 🟡 Mid     | Build optimization strategies        | Remote cache hit rate >80% target; incremental builds; affected-only task graph                         |
| 19  | Scale CI for hundreds of frontend packages                    | 🟡 Mid     | CI scalability at monorepo scale     | 3 strategies together: affected-only, remote cache, parallel execution                                  |
| 20  | Feature flags architecture in frontend                        | 🟡 Mid     | Feature flag system design           | Hybrid evaluation: server assigns cohort (no flicker), client evaluates locally                         |
| 21  | A/B testing infrastructure considerations                     | 🟡 Mid     | A/B testing at scale                 | 4 requirements: stable assignment, exposure logging, guardrail metrics, statistical rigor               |
| 22  | CDN strategy supports frontend scalability                    | 🟡 Mid     | CDN delivery strategy                | Static assets: immutable + contenthash; dynamic: stale-while-revalidate                                 |
| 23  | Edge computing use cases for frontend delivery                | 🟡 Mid     | Edge computing patterns              | Geo-routing, auth pre-check, header manipulation; latency benefit quantified                            |
| 24  | Design i18n at scale for many locales                         | 🟡 Mid     | Internationalization architecture    | Full pipeline: key extraction → TMS sync → translator review → version control                          |
| 25  | Prevent translation drift in large teams                      | 🟡 Mid     | Translation consistency              | 3 controls: CI key extraction check, unused key detection, mandatory linguist review                    |
| 26  | Keep bundles controlled across many teams                     | 🟡 Mid     | Bundle budget governance             | CI gate per domain; size regression blocking PR merge                                                   |
| 27  | Manage shared dependencies safely in micro-frontends          | 🟡 Mid     | Shared dependency management         | Module Federation `shared` config: singleton + requiredVersion + fallback                               |
| 28  | Platform team responsibility in scalable frontend             | 🟡 Mid     | Platform team (enabling team)        | "Enabling team" model: self-service tools; success = developer satisfaction + deploy time               |
| 29  | Introduce architecture changes incrementally                  | 🟡 Mid     | Strangler fig migration              | Identify leaf domain → extract → measure → continue; rollback criterion = 20% lead time improvement     |
| 30  | Structure frontend observability at scale                     | 🟡 Mid     | Frontend observability layers        | 3 layers: RUM (per page/squad), structured logging (user journey), distributed tracing (correlation ID) |
| 31  | Govern API contracts with many frontend teams                 | 🔴 Senior  | API contract governance              | Schema-first + contract tests in CI + consumer-driven (Pact) + 90-day deprecation window                |
| 32  | Handle dependency upgrades in monorepo                        | 🔴 Senior  | Monorepo upgrade automation          | Dependabot/Renovate + batching by category + codemods + canary testing                                  |
| 33  | Scale frontend security practices                             | 🔴 Senior  | Layered security at scale            | 3 layers: automated (eslint-plugin-security), platform (CSP), process (threat modeling)                 |
| 34  | Avoid CSS conflicts in micro-frontends                        | 🔴 Senior  | CSS isolation strategies             | 3 strategies with trade-offs: CSS Modules/BEM (leaks), CSS-in-JS (partial), Shadow DOM (strong)         |
| 35  | Design rollout strategies for risky frontend changes          | 🔴 Senior  | Progressive rollout design           | Cohort definition + automated rollback triggers (error rate spike) + synthetic monitoring               |
| 36  | Keep UX consistent across independent squads                  | 🔴 Senior  | Cross-squad UX consistency           | Multi-layer: tokens (visual) → design system (behavior) → UX council → shared a11y/perf bar             |
| 37  | Manage runtime configuration in global deployments            | 🔴 Senior  | Runtime config delivery              | Edge config endpoint + short-TTL cache (5min SWR) + versioned schema + safe defaults                    |
| 38  | Scale accessibility in big frontend organizations             | 🔴 Senior  | A11y governance at scale             | 3-layer: automated axe (~30%), manual checklist, periodic screen-reader testing                         |
| 39  | Model ownership for scalable FE architecture                  | 🔴 Senior  | Ownership modeling                   | CODEOWNERS + map to business capabilities (not org chart) + audit ownerless code                        |
| 40  | How to answer senior scalability interview questions?         | 🔴 Senior  | Scalability interview framework      | 6-step framework: context → constraints → options → decision → migration → metrics                      |
| 41  | Warning signs of over-engineering scalability                 | 🔴 Senior  | Over-engineering detection           | Red flags: lead time increases after migration; engineers spend more on infra than features             |
| 42  | Create a long-term scalability roadmap                        | 🔴 Senior  | Scalability roadmap structure        | Baseline → top 3 bottlenecks by impact → quarterly milestones → governance cadence                      |
| E1  | Scale documentation for large frontend platforms              | 🟡 Mid     | Docs-as-code architecture            | MDX in monorepo + auto-generated API docs + squad ownership + search/tagging                            |
| E2  | Design architecture review process without slowing teams      | 🟡 Mid     | Tiered review model                  | Lightweight RFC (local) → async review (cross-team) → sync only (org-wide); SLA per tier                |
| E3  | Standardize error handling across micro-frontends             | 🟡 Mid     | Cross-MFE error propagation          | Shared error boundary + error event bus + correlation ID + standardized error schema                    |
| E4  | Scale frontend testing strategy (unit/integration/e2e)        | 🟡 Mid     | Testing pyramid at scale             | Unit (many/fast) → integration (per domain/MSW) → e2e (critical journeys only)                          |
| E5  | Make performance ownership visible per squad                  | 🟡 Mid     | Per-squad performance accountability | Tag RUM with squad ID → per-squad CWV dashboard → automated regression alerts                           |
| E6  | Govern npm package publishing in monorepo                     | 🟡 Mid     | Package publishing governance        | Automated changesets workflow + private registry + semver CI enforcement                                |
| E7  | Prevent circular dependencies at scale                        | 🟡 Mid     | Dependency graph hygiene             | Nx/ESLint module boundary rules (DAG) + `import/no-cycle` in CI + periodic `madge` graph                |
| E8  | Scale frontend onboarding for new engineers                   | 🟡 Mid     | Developer onboarding at scale        | Golden path tooling + learning path + buddy pairing + "first PR in day 3" metric                        |
| E9  | Run design system migrations safely                           | 🟡 Mid     | Design system migration strategy     | Codemods + parallel v1+v2 publish + visual regression gates + adoption tracking                         |
| E10 | Coordinate cross-team release calendars                       | 🟡 Mid     | Release coordination at scale        | Independent deployment eliminates calendar coordination — solve coupling, not scheduling                |
| E11 | Scale experimentation governance ethically                    | 🟡 Mid     | Ethical A/B testing governance       | Ethics review + guardrail metrics (auto-stop) + transparency report + consent for PII                   |
| E12 | Scale personalization without hurting cache hit ratio         | 🔴 Senior  | Personalization vs caching           | Cacheable HTML shell (CDN 100%) + personalization fetched client-side or at edge                        |
| E13 | Architect search-heavy frontend experiences at scale          | 🔴 Senior  | Search UX architecture               | Debounce + cancellation + URL-synced state + virtual scroll + stale-while-revalidate cache              |
| E14 | Scale realtime features (notifications, collaboration)        | 🔴 Senior  | Realtime at scale                    | WebSocket for collaboration (bidirectional); SSE for notifications (simpler, one-way)                   |
| E15 | Manage websocket connection limits in browser fleets          | 🔴 Senior  | WebSocket tab multiplexing           | Shared WS via BroadcastChannel (one per origin); graceful degradation to polling                        |
| E16 | Scale offline sync conflict handling in frontend              | 🔴 Senior  | Offline conflict resolution          | CRDTs (auto), last-write-wins (simple), user resolution UI (high-stakes); SW background sync            |
| E17 | Model frontend domain events for analytics consistency        | 🔴 Senior  | Analytics event governance           | Schema-first (Snowplow/Segment registry) + typed dispatch + validation in dev mode                      |
| E18 | Keep type safety across many shared packages                  | 🔴 Senior  | TypeScript at monorepo scale         | Project references + strict mode global + shared types package + branded types                          |
| E19 | Scale content platforms with MDX-like pipelines               | 🔴 Senior  | Content platform architecture        | SSG for static (CDN) + ISR for semi-dynamic (revalidate on demand) + preview workflow                   |
| E20 | Plan deprecation lifecycle for frontend APIs/components       | 🔴 Senior  | API deprecation lifecycle            | 4-phase: announce → warn (lint) → error (lint) → remove; codemods at each step                          |
| E21 | Avoid platform lock-in in frontend infrastructure             | 🔴 Senior  | Adapter pattern for vendors          | Adapter pattern for platform APIs; evaluate lock-in cost explicitly vs vendor benefits                  |
| E22 | Measure ROI of scalability investments                        | 🔴 Senior  | Scalability ROI measurement          | Before/after metrics per investment: lead time %, CI time %, incident rate %                            |

---

## ⚡ Cold Call Simulation

**Hardest Question: Q29 — How to introduce architecture changes incrementally in a 20-team frontend organization?**

**Step 1 — Clarify context (5 sec):**
"Before I answer — are we talking about a pure technical migration, or also a people/process problem? At 20 teams, it's usually both."

**Step 2 — Frame the principle (10 sec):**
"The core principle is the Strangler Fig pattern — you never do a big-bang rewrite. You identify the smallest leaf domain that can be extracted independently, extract it, measure the result, then decide whether to continue."

**Step 3 — Give the concrete steps (10 sec):**
"Concretely: (1) pick checkout or auth as the first domain to extract, (2) deploy it as a micro-frontend with feature flag, (3) measure lead time and change failure rate for that squad after 4 weeks, (4) if metrics improve, extract the next domain — if not, rollback and investigate why."

**Step 4 — Show senior thinking (5 sec):**
"The key decision point is: what is your rollback condition? I'd set it as 'if lead time does not decrease by 20% after 6 weeks, we stop the migration and reassess.' Without a rollback criterion, migrations become religion, not engineering."

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Facebook FE at Scale — News Feed Virtualization

**Tình huống:**
Facebook News Feed có vài tỷ posts cần render cho hàng trăm triệu user đồng thời. Mỗi post là một phức tạp component (media, reactions, comments, ads). Render toàn bộ feed là impossible — browser crash trước khi user scroll.

**Quyết định:**
Facebook xây dựng custom virtualization system (không dùng react-window) vì feed có variable-height items và complex interaction patterns. Họ dùng "windowing with overscan" — render 5 items trước và sau viewport, recycle DOM nodes khi scroll ra ngoài — kết hợp với progressive hydration (server render HTML shell, hydrate interactions lazily).

Ngoài ra: code splitting theo feature (reactions, video player, stories) làm separate chunks — user không download reactions code cho tài khoản không dùng reactions.

**Kết quả:**

- Feed scroll performance: 60fps maintained trên mid-range Android devices
- Initial JS payload giảm ~40% qua code splitting
- DOM node count cố định ~50 nodes bất kể feed dài bao nhiêu

**Bài học:**

- Generic libraries (react-window) tốt cho 80% cases, nhưng complex product needs custom virtualization
- Code splitting phải align với user behavior patterns, không chỉ route-based
- Virtual scrolling + code splitting cùng nhau giải quyết cả memory và bandwidth scalability

---

### Case 2: Shopee Flash Sale FE — Traffic Spike Strategy

**Tình huống:**
Shopee Flash Sale 12/12 — 10x traffic spike trong 30 giây đầu khi sale bắt đầu. Product listing page cần load nhanh cho hàng triệu user đồng thời. CDN origin bị overload trong năm đầu, page load time tăng từ 2s lên 15s khi sale bắt đầu.

**Quyết định:**
Three-layer strategy:

1. **CDN pre-warming**: Static assets (JS, CSS, images) pre-loaded tới edge PoPs 30 phút trước sale. Content-hashed filenames → `Cache-Control: max-age=31536000, immutable`. CDN hit rate → 99.8% during sale.

2. **SSG for product pages**: Product listing rendered at build time (SSG), published to CDN. No origin HTML requests during sale. ISR (Incremental Static Regeneration) cập nhật inventory every 30 seconds.

3. **Service Worker pre-cache**: On app install, SW pre-fetches critical sale page shell. Returning users get instant navigation (cache-first for shell, network-first for inventory data).

**Kết quả:**

- Origin traffic giảm 95% (CDN xử lý gần hết)
- Page load time during sale: 1.2s (down từ 15s)
- Zero origin overload incidents năm tiếp theo

**Bài học:**

- CDN strategy + SSG + Service Worker là 3 layers phải hoạt động cùng nhau
- Pre-warm CDN trước traffic spike — CDN không auto-populate
- Separate cacheable content (product listing HTML) from non-cacheable (inventory count, user cart)

---

### Case 3: Netflix CDN Strategy — Personalization vs Cache Hit Rate

**Tình huống:**
Netflix phục vụ 200M+ users với highly personalized homepage (different content rows per user based on watch history). Naive approach: bypass CDN for all homepage HTML → 200M requests/day hitting origin servers → unsustainable.

**Quyết định:**
Shell/data separation architecture:

1. **CDN caches HTML shell**: Same empty shell HTML served to all users from CDN edge. No personalization in HTML. Cache hit rate: ~95%.

2. **Client fetches personalization**: After shell loads, JavaScript fires API calls to personalization service. Data is user-specific, not cached at CDN.

3. **Edge compute for light personalization**: Cloudflare Worker at edge reads user cookie → injects `X-User-Tier` header → origin uses tier to select content strategy (not full personalization, just content category hints).

4. **Service Worker for repeat visits**: SW caches shell + critical CSS + React bundle → subsequent visits load from SW cache in <100ms.

**Kết quả:**

- CDN cache hit rate: 95% (vs 5% with full HTML personalization)
- Homepage load time: 800ms p50 globally (vs 2.4s with origin-only)
- Origin capacity requirement: reduced 10x

**Bài học:**

- Personalization và cacheability are not mutually exclusive — separate cacheable structure from dynamic data
- Service workers complement CDN: CDN handles first visit, SW handles repeat visits
- SSR at edge (edge compute) is the bridge between full CDN caching and full personalization

---

## Self-Check / Tự Kiểm Tra ⚡

**Đóng tài liệu lại. Trả lời từ trí nhớ.**

### 5 Retrieval Prompts

**1. Retrieval — Nhớ lại:**
Kể tên 5 dimensions của frontend scalability (không mở tài liệu). Dimension nào thường bị bỏ qua nhất khi interviewees trả lời?

**2. Visual — Hình dung:**
Vẽ lại ASCII diagram của CDN strategy: user request → CDN edge → cache hit/miss → origin. Thêm service worker layer và ghi chú cache policy cho mỗi asset type.

**3. Application — Áp dụng:**
Bạn join một công ty có 10 frontend teams và monolith SPA đang gây deploy coupling. Nêu 3 bước đầu tiên bạn làm — với metric cụ thể để quyết định tiếp theo.

**4. Debug — Chẩn đoán:**
Sau khi migrate sang micro-frontends, lead time tăng từ 2 ngày lên 5 ngày. List 3 nguyên nhân có thể và cách diagnose từng nguyên nhân.

**5. Teach — Giải thích:**
Giải thích cho một junior engineer tại sao "một global Redux store cho toàn app" là scalability anti-pattern, và đề xuất giải pháp thay thế bằng ngôn ngữ đơn giản nhất có thể.

---

### Feynman Prompt

"Giải thích frontend scalability cho một product manager không có background kỹ thuật. Dùng analogy từ cuộc sống thực. Thời gian: 2 phút. Không dùng từ kỹ thuật nào."

_(Gợi ý: nghĩ về analogy tòa nhà văn phòng, hệ thống phân phối hàng hóa, hoặc chuỗi nhà hàng franchise.)_

---

🔁 **Spaced Repetition: 3 ngày → 7 ngày → 14 ngày**

- **3 ngày:** Ôn lại 5 Retrieval Prompts. Focus vào Concepts 4 (virtual scrolling) và 7 (CDN) vì đây là hai topic phỏng vấn hỏi nhiều nhất.
- **7 ngày:** Cold Call Simulation không nhìn tài liệu. Sau đó đọc lại Study Cases và viết ra 1 điều bạn quên.
- **14 ngày:** Giải thích toàn bộ file cho một người khác (rubber duck hoặc peer). Kiểm tra xem bạn có thể nêu trade-off cho mỗi decision trong Cases không.

---

[Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Architecture Patterns](./01-architecture-patterns.md) — micro-frontends, module federation làm nền tảng scale
- [Caching](./03-caching.md) — CDN, service worker, memory cache strategies cho scalability
- [Microservices Patterns](./06-microservices-patterns.md) — BFF và API Gateway pattern khi scale team/service
- [Database Design](./05-database-design.md) — data layer scalability và query optimization

### Khác track (Cross-track)
- [System Design Theory](../../shared/02-system-design/system-design-theory.md) — horizontal vs vertical scaling, CAP theorem
- [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md) — backend scalability patterns và load balancing
- [Web Performance Comprehensive](../06-browser-performance/04-web-performance-comprehensive.md) — frontend performance tối ưu song song với scalability
