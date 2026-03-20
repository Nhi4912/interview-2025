# Next.js Architecture & Rendering Strategies / Kiến Trúc & Chiến Lược Render Next.js

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Next.js App Router & RSC](./01-app-router-server-components.md) | [Data Fetching](./02-data-fetching.md)
> **See also**: [App Router Fundamentals](./04-nextjs-fundamentals-appRouter.md) | [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md)

[← Back to Data Fetching](./02-data-fetching.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-nextjs-fundamentals-appRouter.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**English:** VnExpress.net (10M page views/day) migration from Pages Router SSR to App Router. Before: every article request rendered on server → 200ms TTFB, 40 EC2 instances. After: news articles on ISR (revalidate: 60s) served from Cloudflare CDN edge → TTFB 30ms, 8 EC2 instances. The key insight: not "use the fastest thing everywhere" but "match rendering strategy to data freshness requirements per page type."

**Tiếng Việt:** VnExpress.net migrate từ Pages Router SSR sang App Router. Trước: mỗi request render trên server, 200ms TTFB, 40 EC2. Sau: bài viết dùng ISR (revalidate: 60s), CDN edge → TTFB 30ms, 8 EC2. Bài học: không có "one size fits all" — chọn rendering strategy phù hợp với tần suất thay đổi dữ liệu.

---

## What & Why / Cái Gì & Tại Sao

**What**: Next.js rendering strategy = the decision of **where** and **when** HTML is generated — at build time (SSG/ISR), at request time on server (SSR), or in the browser (CSR). Each strategy has a different trade-off between freshness, performance, and server cost.

**Why it matters**: Choosing SSR for a blog post that changes once a day means paying server cost for every single visit. Choosing SSG for a user dashboard with real-time data means showing stale content. The wrong choice is either wasteful or incorrect.

**The decision heuristic:**

```
How fresh does the data need to be?
        │
        ├── Days/weeks (static content) ──────────── SSG
        │
        ├── Minutes/hours (semi-fresh) ─────────── ISR (revalidate: N)
        │
        ├── Per-request (always fresh, not personalized) ── SSR / Server Component
        │
        └── Per-user (authenticated, personalized) ──── CSR or SSR with auth
```

---

## Core Concept 1: Rendering Strategy Decision Framework

> 🧠 **Memory Hook**: "**S**SG = **S**tatic forever. **I**SR = **I**ntermittent refresh. **S**SR = **S**erver every time. **C**SR = **C**lient always. Order by performance: SSG > ISR > SSR > CSR."

**Tại sao tồn tại? / Why does this exist?**
The web has always had a tension between static (fast, cacheable) and dynamic (fresh, personalized) content.
→ Why can't everything be static? User-specific content (cart, profile, notifications) cannot be pre-generated.
→ Why can't everything be server-rendered? Each SSR request adds 50-300ms latency and server cost — serving 10M static pages from CDN costs ~0.

### Layer 1: The Four Strategies

```
Strategy  │ HTML generated  │ When             │ Best for
──────────┼─────────────────┼──────────────────┼──────────────────────────
SSG       │ Build time       │ Once             │ Marketing, blog, docs
ISR       │ Build + revalidate│ After N seconds  │ News, catalog, e-commerce
SSR       │ Server           │ Every request     │ Personalized, real-time
CSR       │ Browser          │ After JS loads    │ Private dashboards, SaaS app
```

### Layer 2: Pages Router vs App Router Syntax

**SSG (Pages Router):**
```tsx
// getStaticProps runs at build time, returns props
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts }, revalidate: 60 };  // revalidate: 60 → ISR
}

// Dynamic routes: tell Next.js which slugs to pre-generate
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: 'blocking'  // generate unknown slugs on demand, then cache
  };
}
```

**SSG/ISR (App Router):**
```tsx
// Server Component with fetch cache config = ISR/SSG
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }  // ISR: regenerate at most every 60s
    // cache: 'force-cache'   // SSG: never revalidate (default in App Router)
    // cache: 'no-store'      // SSR: never cache
  }).then(r => r.json());

  return <PostList posts={posts} />;
}
```

**SSR (Pages Router):**
```tsx
// Runs on server per request — has access to cookies, headers
export async function getServerSideProps(context) {
  const { req } = context;
  const user = await validateToken(req.cookies.token);
  const data = await fetchUserData(user.id);
  return { props: { data } };
}
```

**CSR (any router):**
```tsx
'use client';
function Dashboard() {
  const { data, loading } = useSWR('/api/user', fetcher);
  if (loading) return <Skeleton />;
  return <DashboardUI data={data} />;
}
```

### Layer 3: Fallback Strategy in getStaticPaths

```
fallback: false     → 404 for unknown paths (only pre-generated paths valid)
fallback: true      → show fallback UI immediately, generate in background (fast UX)
fallback: 'blocking'→ wait for generation on server, no fallback UI (simpler, SEO-safe)
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using SSR for content that changes once/day | Every request hits server + database unnecessarily | Use ISR (`revalidate: 86400`) — serve from CDN, regenerate daily |
| Using SSG for user-specific content | Build-time generation doesn't know which user is viewing | Use CSR or SSR with authentication |
| `getServerSideProps` with no auth check | Server-side code runs but doesn't mean it's secure | Always validate session/token in `getServerSideProps` or middleware |
| Using CSR for SEO-critical pages | Google bot sees empty HTML until JS runs | Use SSG, ISR, or SSR for any page you want indexed |

**🎯 Interview Pattern:**
- Khi thấy: "What rendering strategy would you choose for [page type]?"
- → Nhớ: Data freshness requirement → strategy. Then mention the trade-offs.
- → Mở đầu: "I'd start with the data freshness question: how often does this page's data change and does it need to be personalized? A product catalog changes hourly → ISR. A user order history is personalized → SSR or CSR. A marketing page never changes → SSG."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Data Fetching — cache modes in App Router](./02-data-fetching.md)
- ➡️ Để hiểu: [Core Web Vitals — how rendering strategy affects LCP/TTFB](../06-browser-performance/01-core-web-vitals.md)

---

## Core Concept 2: Next.js Performance Optimization

> 🧠 **Memory Hook**: "Next.js built-ins are free performance wins: `next/image` for zero-config WebP + lazy loading, `next/font` for zero layout shift fonts, `next/script` for controlled third-party loading."

**Tại sao tồn tại? / Why does this exist?**
Images are the #1 cause of poor LCP (Largest Contentful Paint). Fonts cause layout shift. Third-party scripts (analytics, ads) block rendering.
→ Why do developers consistently get these wrong? Browser defaults require manual optimization; Next.js components enforce best practices automatically.
→ Why not just use `<img>` and `<link rel="preload">`? Manual optimization requires knowing responsive breakpoints, WebP support detection, CDN URL generation — each component automates all of this.

### Layer 1: next/image — LCP Optimization

```tsx
import Image from 'next/image';

// ✅ next/image provides:
// - Automatic WebP/AVIF conversion
// - Responsive srcset generation
// - Lazy loading by default
// - Intrinsic size prevents layout shift (required width/height)
// - Blur placeholder while loading

<Image
  src="/hero.jpg"
  alt="Product hero"
  width={1200}
  height={630}
  priority              // LCP image: preload, don't lazy load
  placeholder="blur"    // show blurred version while loading
  blurDataURL="data:..." // base64 tiny preview
  sizes="(max-width: 768px) 100vw, 50vw"  // responsive hint
/>

// For remote images: add domain to next.config.js
// images: { domains: ['cdn.shopee.vn'] }
```

**`priority` flag**: use on above-the-fold images (hero, logo). Adds `<link rel="preload">` and disables lazy loading. LCP score improves significantly.

### Layer 2: next/font — CLS Prevention

```tsx
import { Inter, Noto_Sans } from 'next/font/google';

// Font is downloaded at build time, served from same origin (no CORS, faster)
// CSS size-adjust prevents layout shift during font swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### Layer 3: next/script — Third-Party Control

```tsx
import Script from 'next/script';

// strategy="beforeInteractive" — critical (polyfills) — blocks render
// strategy="afterInteractive"  — analytics, ads — loads after hydration (default)
// strategy="lazyOnload"        — low-priority (chat widget) — loads during idle time
// strategy="worker"            — offload to web worker (experimental)

<Script
  src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"
  strategy="afterInteractive"
/>
```

**Middleware for edge optimization:**
```tsx
// middleware.ts — runs on Cloudflare/Vercel edge, NOT in Node.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // A/B testing: set cookie to deterministically assign variant
  const variant = Math.random() > 0.5 ? 'a' : 'b';
  const response = NextResponse.next();
  response.cookies.set('ab-variant', variant);
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*'],
};
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `<img>` instead of `next/image` for LCP images | No WebP, no responsive srcset, no preload optimization | Use `<Image priority />` for above-fold images; check Lighthouse LCP score |
| Importing Google Fonts with `<link>` in HTML | Causes FOUT (flash of unstyled text) and extra network round-trip | Use `next/font/google` — builds font into bundle, zero-FOUT |
| Using middleware for heavy computation | Middleware runs on edge with limited runtime (no Node.js APIs, 128MB limit) | Middleware only for routing logic (auth redirects, geo, A/B flags) — heavy work goes in API routes |

**🎯 Interview Pattern:**
- Khi thấy: "How would you optimize LCP for a Next.js e-commerce product page?"
- → Nhớ: `next/image priority` + correct `sizes` + fetch from fast CDN
- → Mở đầu: "I'd check what the LCP element is with Lighthouse — typically the hero image. Then use `<Image priority>` to preload it, add correct `sizes` for responsive images, and ensure the image is served from a CDN close to the user."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Core Web Vitals — LCP, CLS metrics](../06-browser-performance/01-core-web-vitals.md)
- ➡️ Để hiểu: [Bundle Optimization — code splitting strategy](../06-browser-performance/03-bundle-optimization.md)

---

## Core Concept 3: SEO Architecture & Metadata

> 🧠 **Memory Hook**: "App Router SEO = export `metadata` (static) or `generateMetadata` (dynamic) from `page.tsx`. Never use `<head>` tags directly."

**Tại sao tồn tại? / Why does this exist?**
Search engine bots parse HTML `<head>` for title, description, Open Graph, and structured data. Missing or duplicate tags hurt ranking.
→ Why can't you just add `<head>` tags in components? Nested `<head>` tags conflict; React doesn't deduplicate them reliably. Next.js Metadata API centralizes and deduplicates.
→ Why do dynamic pages need `generateMetadata`? A product page's title is `"Nike Air Max - Size 42 | VN"` — the title comes from database data, not build-time constants.

### Layer 1: Metadata API

```tsx
// Static metadata (known at build time)
// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About Us | VnExpress',
  description: 'Learn about VnExpress — Vietnam\'s largest online newspaper',
  openGraph: {
    title: 'About Us | VnExpress',
    description: 'Vietnam\'s largest online newspaper',
    images: [{ url: '/og-about.jpg', width: 1200, height: 630 }],
  },
};

// Dynamic metadata (from params/data)
// app/news/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await fetchArticle(params.slug);

  return {
    title: `${article.title} | VnExpress`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      images: [{ url: article.coverImage }],
    },
    alternates: {
      canonical: `https://vnexpress.net/news/${params.slug}`,
    },
  };
}
```

### Layer 2: Structured Data (JSON-LD)

```tsx
// Improves rich snippets in Google Search results
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    author: { '@type': 'Person', name: article.author },
    datePublished: article.publishedAt,
    image: article.coverImage,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article>{/* content */}</article>
    </>
  );
}
```

### Layer 3: Sitemap & Robots

```tsx
// app/sitemap.ts — Auto-generates /sitemap.xml
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    { url: 'https://example.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...posts.map(post => ({
      url: `https://example.com/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}

// app/robots.ts — Auto-generates /robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/private/' },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using `<Head>` (Pages Router) in App Router | Pages Router `Head` component doesn't work in App Router | Use `export const metadata` or `generateMetadata` from `page.tsx` |
| Same `title` on every page | Google penalizes duplicate titles; confuses users in tabs | Dynamic `generateMetadata` per page; use title template: `{ template: '%s | Site Name' }` |
| Forgetting `canonical` for paginated/filtered pages | Duplicate content penalty when `?page=2` and `/` show similar content | Always set `alternates.canonical` on pages with query-string variants |

**🎯 Interview Pattern:**
- Khi thấy: "How would you improve the SEO of a Next.js news site?"
- → Nhớ: Dynamic metadata + structured data + sitemap + canonical URLs + ISR for fresh content
- → Mở đầu: "I'd check four areas: metadata (dynamic `generateMetadata` per article with OpenGraph), structured data (JSON-LD for NewsArticle schema), sitemap.ts for auto-generated sitemap, and rendering strategy — articles should use ISR so Google sees fresh HTML, not stale SSG."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [App Router Server Components — RSC HTML output](./01-app-router-server-components.md)
- ➡️ Để hiểu: [Core Web Vitals — how page speed affects SEO ranking](../06-browser-performance/01-core-web-vitals.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When would you choose SSG, ISR, SSR, and CSR for a real Next.js project? Give examples. 🟡 Mid

**A:** The decision criterion is data freshness vs server cost:

- **SSG** (`cache: 'force-cache'` or `getStaticProps` without `revalidate`): content never changes at runtime. Examples: marketing homepage, privacy policy, documentation.

- **ISR** (`revalidate: N`): content changes periodically but doesn't need to be fresh per-request. Examples: news articles (revalidate: 60), product catalog (revalidate: 3600), blog posts (revalidate: 86400).

- **SSR** (`cache: 'no-store'` or `getServerSideProps`): content must be fresh AND/OR personalized per user. Examples: search results (query in URL), personalized recommendations, pages that read cookies/headers.

- **CSR** (client fetch with SWR/React Query): content is private to the authenticated user, SEO doesn't matter, real-time updates needed. Examples: user dashboard, notification feed, chat.

In a real e-commerce app: homepage SSG, product pages ISR, search SSR, cart CSR.

Tiếng Việt: SSG cho content tĩnh, ISR cho content thay đổi theo giờ/ngày, SSR cho content cần fresh mỗi request hoặc personalized, CSR cho content private không cần SEO. E-commerce: homepage SSG, product ISR, search SSR, cart CSR.

**💡 Interview Signal:**
- ✅ Strong: Uses data freshness as the criterion, gives concrete examples from production scenarios, mentions the e-commerce breakdown
- ❌ Weak: "SSR is slower than SSG" (correct but doesn't address when to choose each)

---

### Q: What is the difference between `getStaticProps` and a Server Component that fetches data? 🟡 Mid

**A:** Both run on the server and can access databases/APIs without shipping code to the client. The key differences:

1. **Execution model**: `getStaticProps` is a function exported from a Pages Router page, runs at build time (or ISR revalidation). A Server Component's `async` function body runs on every request (or is cached by Next.js fetch cache).

2. **Cache control**: `getStaticProps` cache is controlled by the `revalidate` return value. Server Component cache is controlled per-`fetch` call (`next: { revalidate: N }` or `cache: 'force-cache'`).

3. **Granularity**: `getStaticProps` applies to the entire page. Server Component cache is per-fetch call — different fetches in the same page component can have different cache strategies.

4. **Streaming**: `getStaticProps` must complete before HTML is sent. Server Components support streaming with `<Suspense>` — slow data can stream in later without blocking the shell.

Tiếng Việt: Cả hai chạy trên server và không ship code xuống client. Khác biệt: `getStaticProps` áp dụng cho cả page, cache control qua `revalidate`. Server Component cache per-fetch call, hỗ trợ streaming với Suspense. App Router linh hoạt hơn vì mỗi fetch có thể có cache strategy riêng.

**💡 Interview Signal:**
- ✅ Strong: Mentions per-fetch granularity, streaming advantage, and the execution model difference
- ❌ Weak: "getStaticProps is for Pages Router, Server Components are for App Router" (syntactically correct but doesn't explain the conceptual differences)

---

### Q: How do you optimize a Next.js page that has poor LCP? Walk through your approach. 🔴 Senior

**A:**

**Step 1 — Measure**: run Lighthouse or PageSpeed Insights to identify the LCP element (usually a hero image or large text block) and the current LCP time.

**Step 2 — Image optimization** (if LCP is an image):
- Replace `<img>` with `<Image priority>` — this adds `<link rel="preload">`, generates WebP, creates responsive srcset
- Add `sizes` attribute matching the CSS layout (`sizes="(max-width: 768px) 100vw, 50vw"`)
- Ensure image is served from a CDN close to the user

**Step 3 — Rendering strategy**: if the page is SSR, switch to ISR or SSG if the LCP content isn't personalized — CDN-served static HTML loads faster than SSR response.

**Step 4 — Fonts**: replace `<link href="fonts.googleapis.com">` with `next/font/google` — eliminates FOUT (flash of unstyled text) and extra DNS lookup.

**Step 5 — Third-party scripts**: audit `<script>` tags, move non-critical ones to `strategy="afterInteractive"` or `"lazyOnload"` using `next/script`.

Tiếng Việt: Bước 1: đo LCP element bằng Lighthouse. Bước 2: nếu LCP là ảnh → `<Image priority>` + đúng `sizes`. Bước 3: kiểm tra rendering strategy — static HTML từ CDN luôn nhanh hơn SSR. Bước 4: font → `next/font`. Bước 5: third-party script → `next/script` với đúng strategy.

**💡 Interview Signal:**
- ✅ Strong: Follows measure → identify element → specific tooling for each cause; mentions rendering strategy impact on TTFB
- ❌ Weak: "Use next/image" (correct but doesn't explain the full diagnostic + multi-factor approach)

---

### Q: What does `fallback: 'blocking'` vs `fallback: true` do in `getStaticPaths`? 🟡 Mid

**A:** Both generate pages on-demand for paths not pre-generated at build time. The difference is what the user sees during generation:

- **`fallback: true`**: immediately renders a "fallback" UI (you check `router.isFallback` to show a skeleton) while Next.js generates the page in the background. Faster perceived experience but requires handling the fallback state in the component.

- **`fallback: 'blocking'`**: the server waits for the page to be generated before responding. The user sees nothing (their request hangs) until generation completes, then the full page is sent. No special fallback handling needed in the component, but the user waits.

- **`fallback: false`**: any path not pre-generated returns 404. Use for finite datasets where all paths are known at build time.

**When to use**: `'blocking'` is safer for SEO (Google doesn't see an incomplete page). `true` is better for UX (immediate visual feedback).

Tiếng Việt: `fallback: true` → render skeleton ngay, generate background (cần xử lý `router.isFallback`). `'blocking'` → user chờ server generate xong, không cần xử lý fallback UI. `false` → 404 cho path không tồn tại. Dùng `'blocking'` cho SEO-critical pages, `true` cho UX-critical pages.

**💡 Interview Signal:**
- ✅ Strong: Explains the user experience difference, mentions the SEO/UX trade-off, notes `router.isFallback` for `true`
- ❌ Weak: "blocking waits, true shows fallback" (correct but doesn't explain when to choose which)

---

### Q: How would you architect the rendering strategy for a Shopee-like e-commerce site? 🔴 Senior

**A:** Map each page type to the right strategy based on freshness requirements and personalization:

```
Page Type           Strategy    Reason
────────────────────────────────────────────────────────────────
Homepage            SSG/ISR     Marketing content, updates daily
Category listing    ISR (1h)    Products change, not per-request
Product detail      ISR (5m)    Price/stock changes, SEO critical
Search results      SSR         Query-dependent, no caching
Cart/Checkout       CSR         Auth-only, real-time stock check
User profile        CSR         Private, personalized
Order history       SSR         Auth-required, server-side session
Flash sale page     SSR + CDN   Countdown timer, real-time inventory
```

**Global patterns:**
- Middleware handles auth redirect (runs at edge, sub-1ms)
- Next.js Image component for all product images (WebP + responsive)
- `generateMetadata` per product page (title, OG image) for SEO
- On-demand revalidation via webhook from Shopee's product management system — when a product updates, `revalidateTag('product-123')` immediately purges the ISR cache

Tiếng Việt: Map từng loại page: homepage ISR (daily), category ISR (hourly), product ISR (5 phút), search SSR (query-dependent), cart/profile CSR (auth-only). Middleware ở edge cho auth redirect. On-demand revalidation qua webhook khi product data thay đổi.

**💡 Interview Signal:**
- ✅ Strong: Differentiates every page type with a reason, mentions middleware at edge, on-demand revalidation for CMS integration
- ❌ Weak: "Use SSR for dynamic pages and SSG for static pages" (too generic — a senior is expected to enumerate specific page types)

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"VnExpress.net has 10 million page views/day. Their current Pages Router SSR setup has 200ms TTFB. How would you architect this?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "I'd start by categorizing page types: breaking news changes frequently but is the same for all users → ISR is perfect. User profile/reading history is personalized → SSR or CSR."
2. "For news articles: migrate to App Router with `revalidate: 60` — fetch HTML cached at CDN edge, TTFB drops from 200ms (server) to ~30ms (edge)."
3. "For SEO: each article gets dynamic `generateMetadata` with title and OpenGraph, plus JSON-LD structured data for NewsArticle schema — improves Google rich snippets."
4. "For performance: `<Image priority>` on hero images, `next/font` for Vietnamese fonts, and middleware at edge for auth redirects — all zero server overhead."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết ra 4 rendering strategies (SSG/ISR/SSR/CSR) với ví dụ 1 page type thực tế cho mỗi loại — không nhìn lại.
- [ ] **Visual**: Vẽ lại decision tree "data freshness → strategy" từ trí nhớ.
- [ ] **Application**: Lazada muốn page product detail có SEO tốt và inventory fresh. Bạn chọn strategy nào? Giải thích revalidation strategy.
- [ ] **Debug**: `getStaticPaths` với `fallback: false` nhưng users gặp 404 cho các product page hợp lệ mới được thêm vào DB sau khi deploy. Nguyên nhân? Fix thế nào?
- [ ] **Teach**: Giải thích ISR cho backend developer Go: "Nó hoạt động như cache với TTL, nhưng có gì khác so với Redis cache thông thường?"

💬 **Feynman Prompt:** "Giải thích sự khác biệt giữa SSG và ISR bằng ví dụ 'cuốn sách in' vs 'tờ báo in mỗi ngày' — không dùng từ 'static', 'revalidate', hay 'cache'."

🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Back to Data Fetching](./02-data-fetching.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-nextjs-fundamentals-appRouter.md)
