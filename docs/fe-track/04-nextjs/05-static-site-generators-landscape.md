# Static Site Generators Landscape / Bản Đồ Static Site Generators

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Next.js Fundamentals](./00-nextjs-fundamentals.md), basic understanding of SSR vs SSG vs CSR
> **See also**: [Next.js Architecture](./03-nextjs-architecture.md) | [App Router & Server Components](./01-app-router-server-components.md) | [Web Components & Shadow DOM](../15-modern-platform/01-web-components-shadow-dom.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"We need a marketing site with a blog. The team knows React. Why might Next.js be the wrong choice?"_

Hầu hết ứng viên sẽ trả lời ngay: _"Use Next.js — team knows React, it's the safe default."_ Đây là câu trả lời của Junior. Một Senior Engineer sẽ dừng lại và hỏi: "How interactive is it? How many pages? Does the blog content update real-time or weekly?" Và sau đó kết luận: **Astro likely wins here.**

Lý do: marketing site + blog là **content-first**, không phải app-first. Trang này không cần authentication, không cần dashboards, không cần state management phức tạp. Next.js ship JavaScript cho mọi component theo mặc định — Astro ship **zero JavaScript** by default và chỉ hydrate chỗ nào thực sự cần.

Đây là lý do tại sao biết **SSG landscape** là senior signal: framework choice phản ánh khả năng phân tích use case, không phải chỉ biết dùng tool quen tay.

---

## What & Why / Cái Gì & Tại Sao

**SSG (Static Site Generation)** = pre-render toàn bộ HTML tại build time, serve từ CDN. Không có server runtime. User nhận HTML ngay lập tức.

```
Request flow (SSG):
User → CDN Edge → Pre-built HTML file → Browser renders
                     ↑ no server needed

Request flow (SSR):
User → Origin Server → Execute code → Generate HTML → Browser renders
                           ↑ runs every request
```

**Tại sao SSG lại quan trọng lại?**

→ **Why?** CDN-served HTML có TTFB < 50ms. SSR phải chạy code mỗi request, TTFB thường 200–800ms.
→ **Why?** Với content sites (blog, docs, marketing), data thay đổi chậm hoặc không đổi — không cần server runtime.
→ **Why?** Lighthouse score và Core Web Vitals tốt hơn tự nhiên khi không có JavaScript runtime blocking.

---

### The Two Eras of SSG / Hai Thế Hệ SSG

**Era 1 — 2014–2020: Framework-agnostic, content-only**

| Tool     | Language | Key Trait                       |
| -------- | -------- | ------------------------------- |
| Jekyll   | Ruby     | GitHub Pages default            |
| Hugo     | Go       | Fastest builds (~10s/10K pages) |
| Hexo     | Node.js  | Markdown blog engine            |
| Eleventy | Node.js  | Zero-opinion, any template lang |

Thế hệ này phục vụ **content thuần** — blog, docs. Không có component model, không có React/Vue.

**Era 2 — 2021+: Framework-aware, islands-capable**

| Tool      | Lang/Framework  | Key Trait                     |
| --------- | --------------- | ----------------------------- |
| Next.js   | React           | RSC, full-stack, safe default |
| Astro     | Multi-framework | Islands, zero-JS-by-default   |
| SvelteKit | Svelte          | Svelte equivalent of Next     |
| Nuxt 3    | Vue             | Vue equivalent of Next        |
| Qwik City | Qwik            | Resumability over hydration   |

**The KEY 2024+ shift: Islands Architecture**

Trước đây: framework ship toàn bộ JS bundle, hydrate toàn bộ page.
Hiện tại: ship HTML by default, **opt-in JS chỉ chỗ cần** — gọi là "islands".

Framework nào nắm rõ câu hỏi này trong interview: **"What is your JS delivery strategy?"**

---

## Concept Map / Bản Đồ Khái Niệm

```
SSG LANDSCAPE 2026
│
├── FRAMEWORK-FIRST (heavy JS by default)
│   ├── Next.js (React RSC)
│   ├── Nuxt 3 (Vue)
│   ├── SvelteKit (Svelte)
│   └── Remix (web-standards)
│
├── ISLANDS-FIRST (HTML by default, opt-in JS)
│   ├── Astro ← primary recommendation for content sites
│   ├── Qwik City (resumability)
│   └── Fresh / Deno Deploy (edge-native)
│
├── PURE STATIC (no JS framework)
│   ├── Eleventy (Node, multi-template)
│   ├── Hugo (Go, fastest)
│   └── Jekyll (Ruby, legacy)
│
└── DECLINING / LEGACY
    └── Gatsby (GraphQL data layer, replaced by RSC)
```

---

## Part 1: The Five Schools / Năm Trường Phái

### Section 1.1: Framework-First (Heavy JS by Default) / Trường Phái Framework-First

Nhóm này coi **JavaScript là trung tâm** — mọi page đều ship JS bundle. Server-side rendering là opt-in capability, không phải default behavior.

---

**Next.js** (React ecosystem)

- File-based routing (`app/` directory), RSC by default, full-stack capability
- **Khi nào là lựa chọn đúng**: SaaS apps, e-commerce với auth, dashboard, bất kỳ app cần server components + database queries trong component tree
- **Khi nào là overkill**: Marketing landing page, pure blog, docs site — ship unnecessary JS runtime

```
Next.js default output for a static page:
- HTML: ✅
- React runtime JS: ✅ (always)
- Hydration JS: ✅ (even for static content)
→ Baseline bundle: ~87KB gzipped (React + Next runtime)
```

---

**Nuxt 3** (Vue ecosystem)

- Vue tương đương của Next.js — file-based routing, SSR/SSG modes, Nitro server engine
- **Khi đúng**: Team đang dùng Vue, cần SSR + routing + data fetching trong một package
- **Khi overkill**: Same as Next.js — Vue-powered marketing site sẽ ship Vue runtime cho content tĩnh

---

**SvelteKit** (Svelte ecosystem)

- Svelte compiler → virtually no runtime → smaller bundles so thân thiện hơn Next/Nuxt với content sites
- `adapter-static` cho full static output; `adapter-node` cho server
- **Điểm mạnh thực sự**: Svelte compile away framework overhead — bundle size có thể nhỏ hơn React 40–60%
- **Khi đúng**: Team dùng Svelte, cần hybrid (some pages static, some SSR), ưu tiên bundle size

---

**Remix** (React, web-standards-first)

- Acquired by Shopify 2023; focus on web fundamentals (form submissions, native fetch, progressive enhancement)
- Không có SSG mode — mọi request đều server-rendered hoặc CSR
- **Khi đúng**: App cần progressive enhancement, form-heavy UX, web-platform-native behaviors
- **Khi sai**: Content sites — Remix luôn cần server (không pure static)

---

### Section 1.2: Islands Architecture (HTML-First) / Trường Phái Islands

Nhóm này **đảo ngược model**: ship HTML by default, JS chỉ được thêm vào **từng "island"** (component) khi cần thiết.

---

**Astro** ← primary recommendation cho content sites

Astro là framework quan trọng nhất để biết trong nhóm islands.

**Core concept**: Astro component (`.astro`) compile thành pure HTML. Không có JavaScript gửi đến browser trừ khi bạn dùng `client:*` directive.

```astro
---
// src/pages/index.astro
// This runs at BUILD TIME only — never sent to browser
const posts = await fetchBlogPosts();
---

<html>
  <body>
    <!-- Pure HTML — zero JS -->
    <h1>Blog</h1>
    {posts.map(p => <article>{p.title}</article>)}

    <!-- Island 1: interactive counter — only this component ships JS -->
    <Counter client:load />

    <!-- Island 2: newsletter form — lazy loaded when visible -->
    <NewsletterForm client:visible />
  </body>
</html>
```

**`client:*` directives — khi nào island hydrates:**

| Directive        | Khi nào hydrate                              | Dùng cho                        |
| ---------------- | -------------------------------------------- | ------------------------------- |
| `client:load`    | Ngay khi page load                           | Above-fold interactive elements |
| `client:idle`    | Sau khi browser rảnh (`requestIdleCallback`) | Non-critical widgets            |
| `client:visible` | Khi component vào viewport                   | Below-fold, newsletter forms    |
| `client:media`   | Khi media query match                        | Mobile-only interactions        |
| `client:only`    | Client-side only, skip SSR                   | Maps, charts với browser APIs   |

**Multi-framework**: Astro cho phép mix React + Vue + Svelte trong cùng một project — mỗi island là một framework riêng.

**Khi Astro thắng Next.js**: Marketing site, blog, docs, portfolio, landing pages — bất kỳ site content-heavy nào mà interactive elements là minority.

---

**Qwik / Qwik City** — Resumability over hydration

Qwik đặt ra câu hỏi: _"Tại sao phải hydrate (re-execute) code đã chạy trên server?"_

**Resumability model**: Serialize state và event handlers vào HTML attributes. Browser "resume" từ đúng trạng thái — không re-execute JavaScript.

```html
<!-- Qwik serializes state into HTML -->
<button on:click="./chunk-abc.js#Counter_onClick" q:obj="counter:0">Count: 0</button>
<!-- JS chunk chỉ download khi user THỰC SỰ click -->
```

**Hydration (React/Astro)**: Download JS → Execute → Attach event handlers → Ready
**Resumability (Qwik)**: HTML arrives with handlers serialized → User interacts → Download only that handler's chunk → Execute

**Khi Qwik wins**: Sites với rất nhiều interactive components nhưng cần TTI thấp nhất có thể (e-commerce product pages, news sites).

---

**Fresh** (Deno runtime, Preact islands)

- Islands architecture trên **Deno Deploy** (edge runtime)
- Zero build step — JIT compilation
- **Khi đúng**: Deno-native projects, edge-first deployments, khi team đã commit với Deno ecosystem
- **Giới hạn**: Ecosystem nhỏ hơn nhiều so với Node.js-based alternatives

---

### Section 1.3: Pure Static — No JS Framework / Pure Static

Nhóm này không có component model — chỉ template languages và markdown.

---

**Eleventy (11ty)**

- JavaScript-based nhưng **zero JavaScript gửi đến browser** theo default
- Template-agnostic: Nunjucks, Liquid, Handlebars, Pug, Markdown, WebC — chọn cái bạn thích
- Không có opinions về CSS, JS client, state management — bạn tự quyết
- Build speed: nhanh (~30s/10K pages)
- **Khi đúng**: Docs sites, blogs, marketing pages mà team muốn maximum control + zero-JS baseline. GitHub dùng Eleventy cho một số docs.
- **Khi sai**: App cần interactivity — Eleventy không có built-in component hydration

---

**Hugo**

- Written in Go → **fastest builds** trong ngành: ~10s cho 10,000 pages
- Template language là Go templates (learning curve nếu không quen)
- Strong content model: taxonomies, archetypes, shortcodes
- **Khi đúng**: Large documentation sites (Kubernetes docs, Cloudflare docs), sites với hàng chục nghìn pages, khi build speed là blocker
- **Khi sai**: Team là JS-only developers không muốn học Go templates

---

**Jekyll**

- Ruby-based, GitHub Pages default generator
- Ecosystem mature nhưng **không còn actively developed** theo nghĩa modern
- **Khi đúng**: Existing GitHub Pages sites, legacy maintenance, simple personal blogs
- **Khi sai**: Greenfield projects 2026 — chọn Eleventy hoặc Astro thay thế

---

### Section 1.4: Component-Frozen Static — Gatsby / Gatsby và Sự Suy Tàn

Gatsby là **lời cảnh báo lịch sử** quan trọng cho interviews.

**2018–2021**: Gatsby là Next.js rival chính. Điểm khác biệt:

- GraphQL data layer — mọi data source (CMS, APIs, files) đều query qua GraphQL
- Plugin ecosystem phong phú (`gatsby-plugin-*`)
- React component model với static output

**Tại sao Gatsby mất thị phần:**

1. **Build times**: 10K trang có thể mất 20–40 phút. Hugo làm cùng việc trong 10 giây.
2. **GraphQL complexity**: Team nhỏ không cần GraphQL cho blog. Configuration overhead cao.
3. **RSC ăn mất data layer story**: Next.js App Router cho phép fetch data trực tiếp trong Server Components — không cần GraphQL intermediary layer.
4. **Gatsby 5.0 không giải quyết vấn đề cốt lõi**: Partial Hydration tốt, nhưng quá muộn so với Astro's islands và Next's RSC.

**Khi nào vẫn gặp Gatsby:**

- Legacy projects 2019–2022 cần maintenance
- Câu hỏi phỏng vấn: "Gatsby hiện còn phù hợp không?" → "Cho greenfield 2026: không. Cho migration của existing Gatsby codebase: Astro là target phổ biến nhất."

---

### Section 1.5: Headless CMS-Coupled / Kết Hợp Headless CMS

CMS choice thường drive SSG choice — đây là điểm nhiều ứng viên bỏ qua.

| CMS                         | Natural pairing          | Lý do                                                                      |
| --------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| Contentful                  | Next.js + Vercel         | Both Vercel-ecosystem, ISR works well with Contentful webhooks             |
| Sanity                      | Astro hoặc Next          | Sanity Studio embeds anywhere; Astro cho content-heavy, Next cho app-heavy |
| Strapi                      | Next.js / Nuxt           | Self-hosted CMS → self-hosted Next/Nuxt natural fit                        |
| Decap CMS (fka Netlify CMS) | Hugo / Eleventy / Jekyll | Git-based CMS, pure static workflows                                       |
| Ghost                       | Nuxt / Astro             | Ghost API + Nuxt/Astro cho magazine-style sites                            |
| WordPress (headless)        | Next.js                  | WPGraphQL plugin + Next.js phổ biến nhất tại agencies VN                   |

**Interview insight**: Khi được hỏi "what SSG for a client project?", hỏi ngược lại "what CMS are they using?" trước. CMS ecosystem compatibility thường là tiebreaker.

---

## Part 2: Comparison Matrix / Bảng So Sánh

| Framework     | Language         | Default Output     | JS by default          | Best for                       | Build speed (10K pages) | Learning curve              | When NOT to use                    | Verdict 2026                    |
| ------------- | ---------------- | ------------------ | ---------------------- | ------------------------------ | ----------------------- | --------------------------- | ---------------------------------- | ------------------------------- |
| **Next.js**   | TypeScript/React | SSR + static       | ✅ Yes (React runtime) | SaaS, e-commerce, apps         | ~120s                   | Medium (RSC learning curve) | Pure content sites                 | ✅ Default for React apps       |
| **Astro**     | Multi-framework  | Static HTML        | ❌ Zero by default     | Marketing, blogs, docs         | ~60s                    | Low–Medium                  | Auth-heavy SaaS, real-time         | ✅ Best for content sites       |
| **SvelteKit** | Svelte           | Hybrid (SSR/SSG)   | ✅ Svelte (small)      | Svelte teams, hybrid sites     | ~80s                    | Low if know Svelte          | React-only teams                   | ✅ Best Svelte option           |
| **Nuxt 3**    | Vue              | Hybrid             | ✅ Vue runtime         | Vue teams, full-stack          | ~100s                   | Low if know Vue             | React-only teams                   | ✅ Best Vue option              |
| **Remix**     | React            | SSR only           | ✅ Yes                 | Progressive-enhancement apps   | N/A (no SSG)            | Medium                      | Static sites (no SSG mode)         | 🟡 Niche — web-platform purists |
| **Eleventy**  | Node.js          | Pure HTML          | ❌ Zero                | Docs, simple blogs             | ~30s                    | Low                         | Dynamic features                   | ✅ Best zero-JS content         |
| **Hugo**      | Go templates     | Pure HTML          | ❌ Zero                | Large docs, speed-critical     | ~10s                    | Medium (Go templates)       | JS teams uncomfortable with Go     | ✅ Speed king                   |
| **Gatsby**    | React/GraphQL    | Static             | ✅ Yes                 | Legacy projects only           | >5min (cold)            | High (GraphQL)              | Greenfield 2026                    | ❌ Avoid for new projects       |
| **Qwik City** | Qwik             | Static + resumable | ✅ Lazy                | TTI-critical interactive sites | ~70s                    | High                        | Teams unfamiliar with resumability | 🟡 Watch — promising but niche  |
| **Fresh**     | Deno/Preact      | Islands            | ❌ Minimal             | Deno-native, edge              | ~20s                    | Medium (Deno)               | Node.js teams, large ecosystems    | 🟡 Deno-only niche              |
| **Jekyll**    | Ruby             | Pure HTML          | ❌ Zero                | Existing GitHub Pages          | ~45s                    | Low                         | Greenfield 2026                    | ❌ Legacy only                  |

---

## Part 3: Decision Framework / Khung Quyết Định

Đây là bulleted decision tree — học thuộc, nói được fluently trong interview.

---

**"Is this a SaaS app with auth + dashboards?"**
→ **Next.js** (App Router) hoặc **Remix**

Lý do: Server Components, Route Handlers, middleware authentication, database queries in components. Auth-heavy apps cần server-side session validation per request — SSG không phù hợp cho protected routes.

Anti-pattern: Chọn Astro cho SaaS rồi phải hack around nó để implement auth flows.

---

**"Marketing site + blog, mostly content, team knows React?"**
→ **Astro** (với React islands nếu cần)

Lý do: Zero JS by default → faster Lighthouse scores. Astro hỗ trợ React components — team không cần học syntax mới, chỉ cần hiểu `client:*` directives. Content-first = islands model wins.

Anti-pattern: Dùng Next.js cho marketing site và ship 87KB React runtime cho trang HTML thuần tĩnh.

---

**"Pure documentation site, potentially thousands of pages?"**
→ **Eleventy** hoặc **Hugo**

Lý do: Docs là plaintext + minimal interaction. Hugo build 50K pages trong ~50 giây. Eleventy cho phép Markdown + Nunjucks templates với full control.

Chọn Eleventy nếu: team là JS developers, cần flexible templating.
Chọn Hugo nếu: site lớn (>5K pages), Go templates OK, speed là priority.

Anti-pattern: Dùng Next.js SSG cho 30K docs pages → build time 20+ phút, CI/CD bị chậm.

---

**"Team is already on Vue?"**
→ **Nuxt 3**

Lý do: Same mental model, same ecosystem, same tooling. Nuxt 3 với `nuxt generate` produces static output; Nitro handles SSR khi cần.

Anti-pattern: Force Vue team sang React để dùng Next.js — productivity loss không đáng.

---

**"Team is already on Svelte?"**
→ **SvelteKit** với `adapter-static`

Lý do: SvelteKit compile-time optimization → bundle nhỏ hơn React apps đáng kể. `adapter-static` cho pure static output.

---

**"Building for the edge with Deno?"**
→ **Fresh** (Deno Deploy)

Lý do: Fresh là framework được thiết kế cho Deno runtime và Deno Deploy edge network. Islands built-in, zero build step, JIT compilation.

Anti-pattern: Cố dùng Next.js trên Deno — compatibility issues, không tận dụng được Deno's edge advantages.

---

**"Need to maintain or migrate a legacy Gatsby site?"**
→ **Astro** là migration target phổ biến nhất

Lý do: Astro có similar component model (JSX-like syntax), supports React components, has better build performance. `@astrojs/react` cho phép reuse existing React components.

Migration path:

1. Identify Gatsby's GraphQL data sources → map to Astro's `getStaticPaths` + frontmatter
2. Port React components to Astro islands với `client:load` cho interactive parts
3. Replace Gatsby plugins với Astro integrations

---

**"Need a personal blog or GitHub Pages site quickly?"**
→ **Eleventy** hoặc giữ **Jekyll** nếu đã có

Lý do: Eleventy là Jekyll's JS-native successor. Zero config, Markdown-first, deploys anywhere.

---

## Part 4: Islands Architecture Deep Dive / Đi Sâu Vào Islands

### The Hydration Problem / Vấn Đề Hydration

Trước islands, React/Next.js hydration hoạt động như sau:

```
Server: Generate full page HTML
Browser:
  1. Download HTML → display (fast, visible)
  2. Download entire JS bundle (React + app code) — 200KB–1MB
  3. Execute JS → re-create virtual DOM
  4. Match virtual DOM to real DOM (hydration)
  5. Attach event listeners

Timeline: HTML visible at ~0.5s, interactive at ~3–5s on 3G
```

**Vấn đề**: Bước 2–4 là O(n) với size của component tree — thậm chí nếu chỉ 10% page là interactive, toàn bộ 100% vẫn phải hydrate.

### How Astro Islands Invert This / Astro Đảo Ngược Model

```
Server: Generate full page HTML (all Astro components = pure HTML)
Browser:
  1. Download HTML → display (fast, visible)
  2. For each `client:*` island:
     - Download only THAT component's JS chunk
     - Hydrate only that island

Timeline: HTML visible at ~0.3s
          Counter island interactive at ~0.6s (only 8KB downloaded)
          Everything else: ZERO JS, always interactive
```

### Code Comparison / So Sánh Code

**Astro: Hero + Interactive Counter**

```astro
---
// src/pages/landing.astro
// Runs at build time only — zero runtime cost
const features = ["Fast", "Free", "Open Source"];
---

<html lang="en">
<head><title>Product</title></head>
<body>
  <!-- Pure HTML — NO JavaScript shipped for these -->
  <section class="hero">
    <h1>Ship faster. Pay less.</h1>
    <p>Join 50,000 developers.</p>
    <ul>
      {features.map(f => <li>{f}</li>)}
    </ul>
  </section>

  <!-- Island: only this ships JS (~8KB React chunk) -->
  <Counter client:load initialCount={0} />

  <!-- Island: lazy — JS downloads only when scrolled into view -->
  <NewsletterForm client:visible />
</body>
</html>
```

```tsx
// src/components/Counter.tsx — normal React component
import { useState } from "react";

export function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

**Bundle output (Astro):**

- `landing.html`: 4KB static HTML
- `Counter.js` chunk: ~8KB (React + component) — only loads on this page
- **Total for non-interactive visitor: 4KB HTML. No JS.**

---

**Next.js App Router equivalent:**

```tsx
// app/page.tsx — Server Component (no JS shipped for THIS component)
import { Counter } from "@/components/Counter"; // Client Component

const features = ["Fast", "Free", "Open Source"];

export default function LandingPage() {
  return (
    <main>
      {/* This renders as HTML, no JS for the section itself */}
      <section>
        <h1>Ship faster. Pay less.</h1>
        <ul>
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      {/* Client Component — React runtime IS shipped for the whole page */}
      <Counter initialCount={0} />
    </main>
  );
}
```

```tsx
// components/Counter.tsx
"use client"; // marks entire module as client bundle
import { useState } from "react";

export function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

**Bundle output (Next.js):**

- HTML: rendered server-side ✅
- JS: **React runtime + RSC client runtime + Counter** — ~87KB minimum
- **Total for non-interactive visitor: 87KB+ JS regardless**

---

### RSC vs Islands — Khác Biệt Quan Trọng

Đây là câu hỏi Senior hay bị hỏi. Hai model **khác nhau về mặt kiến trúc**:

| Aspect              | Astro Islands                            | Next.js RSC                            |
| ------------------- | ---------------------------------------- | -------------------------------------- |
| Default JS          | Zero                                     | React runtime always shipped           |
| Client boundary     | Per-island `client:*` directive          | Per-component `'use client'`           |
| Server model        | Build-time OR server render              | React server tree rendered per request |
| Multi-framework     | ✅ Mix React + Vue + Svelte              | ❌ React only                          |
| Progressive loading | `client:idle`, `client:visible` built-in | Manual Suspense boundaries             |
| Use case            | Content sites, marketing                 | Apps, dashboards                       |

**RSC là câu trả lời của Next.js** cho hydration problem: Server Components không ship JS at all — nhưng React runtime vẫn cần thiết để client tree hoạt động. Islands architecture eliminates runtime need entirely cho static content.

### When Islands Matter Most / Khi Islands Thực Sự Quan Trọng

- **Lighthouse 100 scores**: Content site không có JS shipping → tự nhiên đạt 100/100 performance
- **3G users ở Indonesia, Việt Nam**: Mỗi KB JS tốn ~50ms extra parse/execute time trên mid-range phones
- **Core Web Vitals**: INP (Interaction to Next Paint) cải thiện khi JS bundle nhỏ hơn
- **SEO signals**: Google PageSpeed Insights penalize heavy JS on content pages

---

## Part 5: Build Performance / Hiệu Năng Build

Build time matter ở scale — đây là câu hỏi có data cụ thể.

### Why Hugo Is 100x Faster / Tại Sao Hugo Nhanh 100 Lần

```
Hugo (Go):
- Compiled binary — no startup overhead
- Parallel processing native to Go (goroutines)
- Template execution: ~1μs per page
- 10,000 pages: ~10 seconds

Gatsby (Node.js):
- JavaScript startup: ~2s cold start
- GraphQL data resolution: serial per page
- React SSR render: ~5ms per page
- 10,000 pages: 5–15 minutes cold cache

Why the gap? Go is compiled, parallel, low GC overhead.
Node.js is interpreted, mostly single-threaded for I/O, high GC.
```

### Real Build Time Numbers (2024 benchmarks)

| Framework | 1K pages | 5K pages | 10K pages | 50K pages |
| --------- | -------- | -------- | --------- | --------- |
| Hugo      | ~1s      | ~5s      | ~10s      | ~50s      |
| Eleventy  | ~5s      | ~15s     | ~30s      | ~2.5min   |
| Astro     | ~10s     | ~30s     | ~60s      | ~5min     |
| SvelteKit | ~15s     | ~40s     | ~80s      | ~7min     |
| Next.js   | ~20s     | ~60s     | ~120s     | ~10min    |
| Gatsby    | ~60s     | ~3min    | >5min     | >30min    |

_Numbers are approximate, vary by content complexity and machine specs._

### Incremental Builds / Build Tăng Dần

**Next.js ISR (Incremental Static Regeneration)**:

- Không rebuild toàn bộ site — chỉ regenerate page khi `revalidate` window expires
- Giải quyết build time problem cho content updates (không cần deploy mỗi lần post mới)

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  // Pre-build top 100 posts at deploy time
  const posts = await getTopPosts(100);
  return posts.map((p) => ({ slug: p.slug }));
}

// Revalidate each post every 1 hour
// New posts not in generateStaticParams: generated on first request (ISR fallback)
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(`/api/posts/${params.slug}`, {
    next: { revalidate: 3600 },
  });
  // ...
}
```

**Astro hybrid output**:

```js
// astro.config.mjs
export default defineConfig({
  output: "hybrid", // Most pages static, some server-rendered
  adapter: vercel(),
});
```

```astro
---
// This page: server-rendered (no static)
export const prerender = false;
const user = await getUser(Astro.cookies.get('session').value);
---
<h1>Hello {user.name}</h1>
```

### At What Scale Does Each Break?

| Framework | When build time becomes a CI/CD problem |
| --------- | --------------------------------------- |
| Hugo      | ~100K+ pages (>8 minutes)               |
| Eleventy  | ~20K+ pages (>5 minutes)                |
| Astro     | ~10K+ pages (>5 minutes)                |
| Next.js   | ~5K+ pages (ISR recommended instead)    |
| Gatsby    | ~2K+ pages (avoid for large sites)      |

**Recommendation at scale**: Use ISR (Next.js) or on-demand revalidation (Astro server mode) instead of full rebuilds. Reserve full static generation for sites where content changes infrequently.

---

## Part 6: Migrating Between SSGs / Di Chuyển Giữa SSG

### Gatsby → Astro (Most Common 2024+) / Phổ Biến Nhất

Đây là migration path được hỏi nhiều trong interviews 2024–2026.

**Tại sao migrate**:

- Build times: 20-minute Gatsby builds → 2-minute Astro builds
- Bundle size: Gatsby ships React runtime + GraphQL client → Astro ships zero JS by default
- Maintenance: Gatsby plugin ecosystem đang stagnating

**Migration steps**:

```
1. Content layer migration:
   Gatsby: gatsby-source-filesystem + GraphQL queries
   Astro:  getCollection() + frontmatter + content collections

2. Data layer:
   Gatsby: const data = useStaticQuery(graphql`query { ... }`)
   Astro:  const posts = await getCollection('blog')  // no GraphQL

3. Component model:
   Gatsby: React components with React runtime always present
   Astro:  .astro components (server) + React islands (client:*) for interactive parts

4. Routing:
   Gatsby: src/pages/blog/{post.slug}.tsx with createPages API
   Astro:  src/pages/blog/[slug].astro with getStaticPaths()

5. Image optimization:
   Gatsby: gatsby-plugin-image
   Astro:  @astrojs/image or native <Image /> component

6. CSS:
   Usually 1:1 — CSS Modules and Tailwind work same way in both
```

**Common gotchas**:

- Gatsby's `gatsby-browser.js` and `gatsby-ssr.js` hooks → Astro layouts
- `wrapRootElement` for context providers → Astro `<Layout>` component
- Gatsby's `Link` component → Astro's `<a>` (no client-side routing by default, add `@astrojs/prefetch`)
- GraphQL data → switch mindset to file-system content collections

---

### Next.js Pages Router → App Router (Within-Framework)

```
Pages Router:                    App Router:
pages/blog/[slug].tsx    →      app/blog/[slug]/page.tsx
getStaticProps()         →      async Server Component + fetch()
getStaticPaths()         →      generateStaticParams()
getServerSideProps()     →      async Server Component (no cache)
useRouter() for params   →      params prop or useParams() hook
_app.tsx layout          →      app/layout.tsx
_document.tsx            →      app/layout.tsx (html, body tags)
```

---

### Jekyll → Eleventy / Ruby → JS

```
Jekyll:                          Eleventy:
_posts/*.md              →      src/posts/*.md (configurable)
_layouts/post.html       →      _includes/post.njk (Nunjucks)
_config.yml              →      .eleventy.js (JS config)
Liquid templates         →      Nunjucks (or Liquid — both supported)
{{ site.baseurl }}       →      {{ metadata.url }} (custom global data)
{% for post in site.posts %} →  {% for post in collections.posts %}
```

**Jekyll → Eleventy gotchas**:

- Eleventy has no "categories" concept — use tags instead
- Date handling differs: Eleventy defaults to file creation date, Jekyll uses filename date
- YAML front matter: compatible, but Eleventy requires explicit `date` field

---

## Part 7: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟡 Q1: When would you choose Astro over Next.js? / Khi nào chọn Astro thay vì Next.js?

**A:**

Choose Astro when the site is **content-first, not app-first**: marketing sites, blogs, documentation, landing pages, portfolios.

The decisive criterion: **what percentage of your page needs JavaScript?** If < 20% of your UI is interactive, Astro's zero-JS-by-default model wins — it ships pure HTML and hydrates only declared islands. Next.js always ships the React runtime (~87KB gzipped) regardless of interactivity level.

Secondary signals favoring Astro: Lighthouse 100 is a requirement, users on slow mobile connections (Southeast Asia 3G), multi-framework team (Astro allows React + Vue + Svelte islands in same project).

Vietnamese: Chọn Astro khi site là **content-first**: marketing, blog, docs, portfolio. Tiêu chí quyết định: "Bao nhiêu % UI cần JavaScript?" Nếu < 20% là interactive — Astro thắng. Next.js luôn ship React runtime 87KB dù trang hoàn toàn tĩnh. Astro ship zero JS by default, chỉ hydrate islands được khai báo tường minh.

Câu trả lời không nên: "Chọn Astro khi không cần SSR" — sai, Astro hỗ trợ SSR mode (`output: 'server'`). Vấn đề là JS delivery strategy, không phải server vs static.

**💡 Interview Signal:**

- ✅ Strong: Leads with "what % of page needs JS?" + mentions 87KB React runtime baseline cost + knows Astro has SSR mode too
- ❌ Weak: "Astro for static, Next.js for dynamic" — oversimplification that ignores Astro's server mode

---

### 🟡 Q2: What is islands architecture? / Islands architecture là gì?

**A:**

Islands architecture is a rendering model where the server generates **mostly static HTML**, and interactive UI components ("islands") are hydrated **independently** and **on-demand**, rather than hydrating the entire page.

The term was coined by Jason Miller (creator of Preact) in 2020. Astro popularized it as a production-ready model.

Mechanically:

1. Server renders full HTML including interactive component placeholders
2. Each island is annotated with a hydration strategy (`client:load`, `client:idle`, `client:visible`)
3. Browser downloads ONLY the JS needed for each island — not a global bundle
4. Islands hydrate independently — one island loading doesn't block others

This contrasts with traditional React hydration where the entire page tree must be downloaded and executed before any interaction is possible.

Vietnamese: Islands architecture là mô hình render trong đó server tạo **HTML tĩnh** cho hầu hết trang, và chỉ các component interactive ("islands") được hydrate **độc lập theo yêu cầu**. Không có global JS bundle — chỉ download JS cho từng island được khai báo. Astro là framework phổ biến nhất triển khai mô hình này.

```astro
<!-- Concrete example of islands -->
<Header />                        <!-- Pure HTML — zero JS -->
<HeroSection />                   <!-- Pure HTML — zero JS -->
<Counter client:load />           <!-- Island: JS loads immediately -->
<VideoPlayer client:visible />    <!-- Island: JS loads when scrolled in -->
<Footer />                        <!-- Pure HTML — zero JS -->
```

**💡 Interview Signal:**

- ✅ Strong: Explains the contrast with traditional full-page hydration, can name Jason Miller, knows `client:*` directive variants and when to use each
- ❌ Weak: "Islands are like components" — misses the key point about selective hydration and JS isolation

---

### 🔴 Q3: Why is Gatsby losing market share? / Tại sao Gatsby mất thị phần?

**A:**

Gatsby is losing for three compounding reasons:

**1. Build performance doesn't scale.** Gatsby's Node.js-based build with GraphQL resolution is O(n) slow. 10K pages: 5–15 minutes. Hugo does the same in 10 seconds. When CI builds take 20 minutes, developer experience degrades significantly.

**2. GraphQL data layer became unnecessary complexity.** Gatsby's GraphQL unification layer was innovative in 2018 — it unified CMS APIs, local files, and databases into one query interface. But Next.js App Router's Server Components let you fetch from any source directly in a component — no GraphQL needed, no plugin to configure, no schema to understand.

**3. Islands/RSC ate the hydration story.** Gatsby never solved the "shipping too much JS" problem. Astro's zero-JS-by-default and Next.js's Server Components both addressed this more elegantly. Gatsby's Partial Hydration (v5) came too late and with too much migration friction.

**Bottom line for interviews**: Gatsby is not wrong — it's overtaken. For new projects in 2026, Astro handles content sites better, Next.js handles app sites better. Gatsby occupies no unique niche.

Vietnamese: Gatsby mất thị phần vì 3 lý do: (1) Build time không scale — 10K pages mất 5–15 phút (Hugo: 10 giây). (2) GraphQL data layer không còn cần thiết — Next.js App Router cho fetch trực tiếp trong Server Components. (3) Không giải quyết được JS bundle problem — Astro và RSC làm tốt hơn. Gatsby không sai về mặt kỹ thuật — chỉ là bị vượt qua. Greenfield 2026 không nên chọn Gatsby.

**💡 Interview Signal:**

- ✅ Strong: Gives all three reasons with specifics, knows the RSC ate the data-layer story, mentions build time numbers
- ❌ Weak: "Gatsby is slow" — correct but needs depth on WHY (GraphQL resolution, Node.js overhead vs Go/Rust)

---

### 🔴 Q4: Astro vs Next.js for a marketing site — which and why? / Astro vs Next.js cho marketing site?

**A:**

**Astro wins for a marketing site.** Here's the structured argument:

**The case for Astro:**

- Zero JavaScript shipped by default → Lighthouse Performance score starts at ~100
- Marketing sites are content-first: hero section, features grid, testimonials, CTA — none of these need JavaScript
- Interactive elements (newsletter form, FAQ accordion, video player) can be React islands with `client:load` or `client:visible` — so team doesn't need to learn new syntax
- Build output is pure HTML files — deploy to any CDN (Cloudflare Pages, Netlify, Vercel) with no cold-start latency

**The case for Next.js:**

- Team already has Next.js expertise and reusable components
- Marketing site needs to become a full app over time (adds auth, dashboard, user accounts)
- Server-side A/B testing via middleware is required
- Personalized content per-user on landing page

**Decision rule**: If the marketing site will **stay a marketing site**, choose Astro. If there's a roadmap item saying "add user accounts in Q2", choose Next.js and accept the JS bundle overhead.

Vietnamese: **Astro thắng cho marketing site thuần**. Zero JS by default → Lighthouse tốt tự nhiên. Team biết React vẫn dùng được React islands trong Astro. Chỉ chọn Next.js nếu site có roadmap mở rộng thành app (auth, dashboard) — khi đó tradeoff JS runtime là hợp lý.

**💡 Interview Signal:**

- ✅ Strong: Makes the argument conditional (stays marketing vs grows into app), quantifies the JS cost (~87KB React runtime), shows awareness of Astro's React integration
- ❌ Weak: "Use Next.js because team knows React" — ignores the JS delivery cost and doesn't ask clarifying questions about roadmap

---

### 🟡 Q5: How does Astro's `client:visible` work? / `client:visible` hoạt động thế nào?

**A:**

`client:visible` uses the **Intersection Observer API** to delay hydration until the component scrolls into the viewport.

```astro
<NewsletterForm client:visible />
```

Astro generates:

1. The component's HTML (rendered server-side, immediately visible)
2. A placeholder marker in the DOM
3. A tiny observer script that watches the placeholder

When the component enters the viewport:

1. Intersection Observer fires
2. Astro fetches the component's JS chunk
3. Hydrates the component

**Why this matters**: A newsletter form at the bottom of a long page — 70% of users never scroll there. Without `client:visible`, you download and execute the JS for all bottom-of-page components on every page load, even if the user bounces. `client:visible` makes it pay-as-you-scroll.

Vietnamese: `client:visible` dùng Intersection Observer API để delay hydration cho đến khi component scroll vào viewport. Component vẫn render HTML ngay (không bị ẩn) — chỉ là JavaScript chưa load. Khi scroll đến: Observer fires → download JS chunk → hydrate. Phù hợp cho: newsletter form, comments section, bất kỳ interactive element nào ở below-the-fold.

**💡 Interview Signal:**

- ✅ Strong: Knows it uses Intersection Observer (not just "lazy loads"), explains the HTML is already present (not hidden), gives concrete use case
- ❌ Weak: "It loads when you scroll to it" — technically correct but misses the mechanism and the HTML-first rendering detail

---

### 🔴 Q6: Hydration vs resumability — Qwik's pitch? / Hydration vs resumability?

**A:**

**Hydration** (React, Vue, Svelte): Server renders HTML → Browser downloads JS → Browser **re-executes** all component code to build virtual DOM → Matches to real DOM → Attaches event handlers. Problem: all this work re-does what the server already did.

**Resumability** (Qwik): Instead of re-executing, Qwik **serializes** the application state and event handler references into HTML attributes at render time. Browser can "resume" from exactly where the server left off — without downloading or executing JavaScript upfront.

```html
<!-- Qwik's serialized state in HTML -->
<button on:click="./chunk-abc123.js#Counter_onClick_handler" q:obj="{'count': 0}">Count: 0</button>
<!-- JavaScript for this handler downloads ONLY when user clicks -->
```

**The practical difference**:

- Hydration: TTI (Time to Interactive) ∝ total JS bundle size
- Resumability: TTI ≈ 0, JS downloads lazily per-interaction

**Qwik's tradeoff**: The serialization model requires components to follow Qwik's programming model (`$` suffix functions, `useSignal` instead of `useState`). High performance upside, high migration cost.

Vietnamese: Hydration = browser re-execute lại toàn bộ code server đã chạy để attach event handlers. Resumability (Qwik) = server serialize state vào HTML attributes, browser "tiếp tục" từ đúng điểm đó — không download JS trước, chỉ download chunk khi user thực sự interact. TTI gần như bằng 0. Đánh đổi: Qwik có programming model riêng (khó migrate codebase React hiện có).

**💡 Interview Signal:**

- ✅ Strong: Explains WHY hydration is wasteful (re-executing server work), describes the serialization mechanism, names the tradeoff (programming model lock-in)
- ❌ Weak: "Qwik is lazy loading" — misses the fundamental model difference (serialization vs execution)

---

### 🟡 Q7: Why is Hugo faster than Node.js-based SSGs? / Tại sao Hugo nhanh hơn?

**A:**

Three technical reasons:

**1. Compiled binary vs interpreted runtime.** Hugo is a compiled Go binary — no startup time, no JIT warm-up. Node.js-based SSGs (Gatsby, Eleventy, Astro) start a Node.js process, require resolving dependencies, and JIT-compile JavaScript before doing any work.

**2. Go's native concurrency.** Hugo uses goroutines to render pages in parallel with very low overhead. Node.js is fundamentally single-threaded for CPU work — parallelism requires child processes or worker threads, which have higher overhead.

**3. No JavaScript rendering overhead.** Hugo uses Go templates for HTML — no virtual DOM, no component model, no React SSR. Just string templates compiled to binary operations. Gatsby/Next must execute React's `renderToString` for every page.

```
Hugo build 10K pages:
  Start binary: ~0ms
  Parallel template execution: ~10s total
  Memory: ~50MB

Gatsby build 10K pages:
  Node.js startup: 2s
  GraphQL data resolution: serial, ~100ms/page = 17min
  React SSR: ~5ms/page = 50s
  Memory: 2–4GB
```

Vietnamese: Hugo nhanh hơn vì: (1) Binary được compile sẵn — không có startup overhead. (2) Go goroutines cho phép render parallel thực sự — Node.js single-threaded. (3) Go templates không có virtual DOM hay React SSR overhead. Kết quả: 10K pages trong ~10 giây so với Gatsby 5–15 phút.

**💡 Interview Signal:**

- ✅ Strong: Mentions all three factors (compiled binary, goroutines, no vDOM), gives approximate numbers
- ❌ Weak: "Go is faster than JavaScript" — true but needs mechanism

---

### 🔴 Q8: How do RSC compare to islands? / RSC so với islands khác nhau thế nào?

**A:**

Both React Server Components (RSC) and islands architecture solve the "too much JavaScript" problem — but from different angles:

**Islands (Astro model):**

- Default: zero JavaScript
- Opt-in: `client:*` directive per component
- Framework-agnostic: React island can sit next to Vue island
- Server model: build-time (or runtime with `output: 'server'`)
- Best for: content sites where JS is the exception

**React Server Components (Next.js model):**

- Default: Server Component (no JS shipped for that component)
- Opt-in JS: `'use client'` directive — marks module and all its imports as client bundle
- React runtime: **always shipped** — RSC client runtime is needed to reconcile server/client trees
- Server model: per-request server rendering
- Best for: apps where some UI is server-only (data-fetching components) but others need interactivity

**Key difference**: In Astro, a page with zero `client:*` islands ships zero JavaScript. In Next.js, even a page with only Server Components ships the React/RSC client runtime (~30–87KB). RSC reduces JS, but doesn't eliminate it.

**Convergence**: Both models agree on the principle — render on server where possible, ship JS only where needed. Implementation differs.

Vietnamese: Islands (Astro): mặc định zero JS, opt-in bằng `client:*` directive. RSC (Next.js): Server Components không ship JS cho component đó, nhưng **React runtime vẫn luôn được ship**. Astro page không có island = 0KB JS. Next.js page chỉ có Server Components = vẫn ~30–87KB (RSC client runtime). Cả hai đều giảm JS, nhưng Astro có thể loại bỏ hoàn toàn; Next.js giảm nhưng không về 0.

**💡 Interview Signal:**

- ✅ Strong: Knows RSC still ships React client runtime, explains the `'use client'` infection behavior vs Astro's opt-in islands, identifies the framework-agnostic advantage of islands
- ❌ Weak: "RSC = no JS like islands" — confuses the model; RSC reduces JS, doesn't eliminate it

---

### 🔴 Q9: How would you migrate a 5-year-old Gatsby site to Astro? / Migrate Gatsby sang Astro thế nào?

**A:**

A structured migration approach:

**Phase 1: Audit (1–2 days)**

- Map all GraphQL queries → identify data sources (filesystem, CMS, APIs)
- Identify interactive components → these become Astro islands
- Check Gatsby plugins → find Astro equivalents (`@astrojs/image`, `@astrojs/sitemap`, etc.)
- Estimate pages and content volume

**Phase 2: Content Migration (per data source)**

```
Gatsby GraphQL → Astro Content Collections

// Gatsby:
export const query = graphql`
  query BlogPost($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter { title, date, tags }
      html
    }
  }
`
// Astro:
const { slug } = Astro.params;
const post = await getEntry('blog', slug);
const { Content } = await post.render();
```

**Phase 3: Component Migration**

```tsx
// Gatsby React component (becomes Astro island or static)
// If interactive → keep as React, use client:load
// If static render → convert to .astro component

// Static component: Convert to .astro
// <StaticCard title={...} /> → becomes a .astro component
// Interactive component: Keep React, add client:* directive
// <InteractiveWidget /> → <InteractiveWidget client:load />
```

**Phase 4: Routing Migration**

```
Gatsby createPages:     →    Astro src/pages/[slug].astro
gatsby-node.js exports  →    getStaticPaths() in .astro file
gatsby-browser.js       →    Astro layouts + scripts
```

**Phase 5: Validation**

- Build both sites locally, compare HTML output
- Run Lighthouse on 5 representative pages
- Check all internal links (`astro check` catches broken imports)
- Validate RSS feeds, sitemap, og:image tags

**Common gotchas:**

- Gatsby's `<StaticImage>` with aspect ratio detection → Astro requires explicit `width`/`height`
- Gatsby's global CSS via `gatsby-browser.js` → import in Astro layout
- Gatsby's `Link` component → Astro uses native `<a>` (add `@astrojs/prefetch` for SPA-like feel)
- Gatsby theme/plugin composition has no direct equivalent in Astro

Vietnamese: Migration 5 bước: (1) Audit — map GraphQL queries, identify interactive components. (2) Content migration — Gatsby GraphQL → Astro Content Collections. (3) Component migration — static components → .astro, interactive → React islands với `client:*`. (4) Routing — `gatsby-node.js` createPages → `getStaticPaths()`. (5) Validation — Lighthouse, link checker, RSS/sitemap.

**💡 Interview Signal:**

- ✅ Strong: Phases the migration, knows about Content Collections as Gatsby GraphQL replacement, identifies the `gatsby-browser.js` → Astro layout mapping, mentions `@astrojs/prefetch` for Link equivalent
- ❌ Weak: "Replace files one by one" — no structure, misses content layer as biggest challenge

---

### 🟡 Q10: When is plain Eleventy the right choice? / Khi nào dùng Eleventy?

**A:**

Eleventy (11ty) is the right choice when you want **maximum simplicity + zero JavaScript output + full template flexibility** — and you don't need a component model.

**Ideal Eleventy scenarios:**

1. **Documentation sites** where content is Markdown + minimal HTML structure. Eleventy's `addPassthroughCopy()` and `addFilter()` APIs give you exactly as much power as needed.

2. **Email templates** or sites that must work without JavaScript entirely — Eleventy outputs plain HTML with no framework dependency.

3. **Teams coming from Jekyll** who want to move to Node.js ecosystem without adopting React/Vue/Svelte.

4. **Consultancies building client microsites** — Eleventy's zero-opinion approach means you can bring any CSS methodology and any JS setup without fighting the framework.

5. **Performance-critical content** where even Astro's islands model is more than needed — Eleventy ships exactly the HTML you write, nothing more.

**When NOT to use Eleventy:**

- You need component-level interactivity → use Astro (with islands) instead
- Team is React-heavy → Astro or Next.js is more natural
- You need TypeScript-first config → Astro or Next.js

Vietnamese: Eleventy đúng khi cần: **maximum simplicity + zero JS output + template flexibility**. Phù hợp cho: documentation sites, email templates, sites phải hoạt động không có JS, teams chuyển từ Jekyll sang Node.js, microsites cần maximum control. Không phù hợp khi cần component interactivity — dùng Astro. Không phù hợp cho React-heavy teams — dùng Astro hoặc Next.js.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete scenarios (docs, email templates, Jekyll migration), knows when Astro wins over Eleventy (interactivity), mentions the template-agnostic advantage
- ❌ Weak: "Eleventy for simple sites" — correct but generic; the distinguishing point is zero-JS guarantee and template language flexibility

---

## Part 8: Anti-Patterns / Sai Lầm Phổ Biến

---

### ❌ Anti-Pattern 1: Defaulting to Next.js for Static Marketing Sites

**Vấn đề**: Dev chọn Next.js cho marketing site vì "team knows React".

**Tại sao sai**: Next.js luôn ship React runtime (~87KB gzipped) ngay cả khi không có interactive component nào. Marketing site với hero + features grid + CTA không cần JavaScript — nhưng Next.js ship nó vô điều kiện.

**Hậu quả**: Lighthouse Performance score thấp hơn cần thiết, JavaScript parse time cao trên mobile, Core Web Vitals kém.

**Đúng là**: Astro cho content sites. Nếu cần React components (vì team đã có), dùng Astro với `@astrojs/react` — React islands chỉ ship khi cần.

---

### ❌ Anti-Pattern 2: Choosing Gatsby for Greenfield in 2026

**Vấn đề**: Nghe "Gatsby là React static site generator" và chọn nó cho project mới.

**Tại sao sai**: Gatsby's GraphQL data layer là unnecessary complexity cho 90% use cases. Build times không scale. Plugin ecosystem stagnating. Cả Astro và Next.js đã vượt qua Gatsby ở mọi dimension quan trọng.

**Đúng là**: Astro cho content sites, Next.js cho app sites.

---

### ❌ Anti-Pattern 3: Picking SSG by GitHub Stars

**Vấn đề**: Chọn framework vì "nhiều star nhất trên GitHub".

**Tại sao sai**: GitHub stars reflect ecosystem size và history, không phải fit cho specific use case. Next.js có 120K+ stars nhưng là wrong tool cho pure static docs site. Hugo có "chỉ" 70K stars nhưng xây large docs sites tốt hơn bất kỳ Node-based tool nào.

**Đúng là**: Framework decision = use case analysis first. Ask: content-first hay app-first? Cần bao nhiêu JavaScript? Ai trong team maintain? Build time có là constraint không?

---

### ❌ Anti-Pattern 4: Ignoring CMS Coupling When Choosing SSG

**Vấn đề**: Chọn SSG xong mới hỏi client "bạn dùng CMS gì?" và phát hiện mismatch.

**Tại sao sai**: CMS choice often dictates the best SSG. WordPress headless với WPGraphQL → Next.js là natural. Sanity với structured content → Astro hoặc Next tùy app vs content ratio. Decap CMS (git-based) → Hugo hoặc Eleventy là natural fit.

**Đúng là**: Ask about CMS FIRST. If CMS is undecided, SSG choice can influence CMS recommendation.

---

### ❌ Anti-Pattern 5: Picking Astro for a SaaS App with Auth-Heavy Dashboards

**Vấn đề**: Thấy Astro tốt cho performance nên dùng cho toàn bộ SaaS product.

**Tại sao sai**: Astro is content-first. Auth flows, protected routes, per-user dashboards, real-time data updates — tất cả những thứ này đều awkward với Astro's model. Astro có `output: 'server'` nhưng ecosystem, middleware, session management tools đều kém hơn Next.js cho app use cases.

**Đúng là**: SaaS với auth + dashboard → Next.js (App Router). Có thể dùng Astro cho marketing/docs subdomain (`/docs`, `/blog`) riêng và Next.js cho app (`/app`).

---

## 🧠 Memory Hook / Ghi Nhớ

> **"Content-first? Astro. App-first? Next. Pure docs? Hugo. Team on Vue? Nuxt. Team on Svelte? SvelteKit. Greenfield with Gatsby? No."**

---

## Quick Recap

| Situation                        | Recommendation       | Key Reason                            |
| -------------------------------- | -------------------- | ------------------------------------- |
| Marketing site, team knows React | **Astro**            | Zero JS by default, React islands OK  |
| SaaS app with auth + dashboard   | **Next.js**          | Full-stack, RSC, middleware auth      |
| Pure documentation, 10K+ pages   | **Hugo**             | Speed: 10K pages in ~10 seconds       |
| Vue team, full-stack needs       | **Nuxt 3**           | Vue-native, same power as Next        |
| Svelte team, hybrid needs        | **SvelteKit**        | Smallest bundles, native Svelte DX    |
| Docs + minimal JS, JS team       | **Eleventy**         | Zero JS guarantee, flexible templates |
| Legacy Gatsby site               | **Migrate to Astro** | Better build time + bundle size       |
| Maximum performance, TTI = 0     | **Qwik City**        | Resumability, no hydration cost       |
| Greenfield 2026, content         | ❌ Not Gatsby        | Build time + ecosystem stagnation     |

---

## 📋 Interview Q&A Summary / Tóm Tắt

| #   | Question                             | Difficulty | Core Concept         | Key Signal                                                  |
| --- | ------------------------------------ | ---------- | -------------------- | ----------------------------------------------------------- |
| 1   | When choose Astro over Next.js?      | 🟡         | JS delivery strategy | "What % of page needs JS?" + 87KB baseline                  |
| 2   | What is islands architecture?        | 🟡         | Selective hydration  | Intersection Observer + per-island JS chunks                |
| 3   | Why is Gatsby losing share?          | 🔴         | Ecosystem trends     | Build time + GraphQL complexity + RSC ate data layer        |
| 4   | Astro vs Next.js for marketing site? | 🔴         | Framework selection  | Conditional on roadmap: stays content vs grows to app       |
| 5   | How does `client:visible` work?      | 🟡         | Islands hydration    | Intersection Observer + HTML-first rendering                |
| 6   | Hydration vs resumability?           | 🔴         | Qwik model           | Serialize state into HTML vs re-execute                     |
| 7   | Why is Hugo faster?                  | 🟡         | Build performance    | Compiled binary + goroutines + no vDOM                      |
| 8   | RSC vs islands?                      | 🔴         | JS delivery model    | RSC reduces JS; islands can eliminate it                    |
| 9   | Migrate Gatsby to Astro?             | 🔴         | Migration strategy   | 5 phases: audit → content → components → routing → validate |
| 10  | When is Eleventy the right choice?   | 🟡         | Tool selection       | Zero JS guarantee + template-agnostic + Jekyll migration    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks: **"We're building a company website: 5 marketing pages, a blog with 200 posts, and a contact form. The team knows React. What do you recommend and why?"**

**Ideal 30-second opening:**

1. "I'd choose Astro over Next.js for this."
2. "Marketing pages and a blog are content-first — zero interactivity except the contact form. Astro ships zero JavaScript by default; Next.js ships the React runtime (~87KB) regardless."
3. "The contact form can be an Astro island: `<ContactForm client:visible />` — React component, only hydrated when scrolled into view."
4. "Practical benefit: Lighthouse Performance score starts near 100. Build time for 200 posts: under 1 minute. Deploy as static files to any CDN."
5. "The only reason I'd switch to Next.js: if there's a roadmap item to add user accounts or a personalized dashboard. If it stays a marketing site + blog, Astro wins."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                          |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | List 5 SSG frameworks và 1 ideal use case cho mỗi cái từ trí nhớ                                                                 |
| 2   | 🎨 Visual      | Vẽ request lifecycle của Astro islands: build time → HTML → `client:visible` trigger → JS chunk download → hydrate               |
| 3   | 🛠️ Application | Client muốn documentation site cho thư viện open-source, 3,000 pages Markdown, team là Go developers. Bạn recommend gì? Tại sao? |
| 4   | 🐛 Debug       | Gatsby site mất 25 phút để build CI. Hai giải pháp không cần migrate framework? Một giải pháp nếu OK migrate?                    |
| 5   | 🎓 Teach       | Giải thích islands architecture cho PM: tại sao marketing site với Astro load nhanh hơn marketing site với Next.js?              |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Next.js: SaaS/apps. Astro: content/marketing. Hugo: large docs/speed. Eleventy: zero-JS docs. Nuxt: Vue. SvelteKit: Svelte. Gatsby: legacy only.                                                                                                                                                                       |
| 2   | Build → static HTML with island markers → browser loads page → IntersectionObserver watches island placeholder → enters viewport → fetch JS chunk → hydrate only that component                                                                                                                                        |
| 3   | Hugo — Go-based team, fastest builds, Go templates are natural fit. 3K pages: ~3 seconds. Alternative: Eleventy if they prefer JS templating.                                                                                                                                                                          |
| 4   | Without migrate: (1) Enable Gatsby Cloud incremental builds. (2) Limit `gatsby-node.js` page creation to top pages, use fallback for rest. Migrate: Astro → same React components as islands, content collections replace GraphQL, build time: ~2min.                                                                  |
| 5   | Next.js sends a box of LEGO instructions (JavaScript) with every page — browser must assemble the toy before you can play. Astro sends the already-assembled toy (HTML) — no instructions needed. Interactive parts (the spinning wheels) come with their own mini-manual that downloads only when you reach for them. |

> 🎯 **Feynman Prompt:** Giải thích cho developer mới tại sao islands architecture giải quyết được vấn đề mà SSR thông thường không giải quyết được.
> 🔁 **Spaced Repetition reminder:** Review file này lại sau 3 ngày, sau đó 7 ngày, sau đó 14 ngày.

---

## Connections / Liên Kết

- ⬅️ **Context**: [Next.js Fundamentals](./00-nextjs-fundamentals.md) — hiểu SSG/SSR/ISR trước khi compare với alternatives
- ⬅️ **Architecture context**: [Next.js Architecture](./03-nextjs-architecture.md) — folder structure và routing để understand migration paths
- ➡️ **Performance implications**: [Browser Performance & Core Web Vitals](../06-browser-performance/) — islands architecture và LCP/INP/CLS impact
- ➡️ **Modern platform**: [Web Components & Shadow DOM](../15-modern-platform/01-web-components-shadow-dom.md) — edge cases khi islands meet Web Components
- 🔗 **CMS coupling**: [FE System Design](../08-fe-system-design/) — headless CMS architecture in FE system design context
