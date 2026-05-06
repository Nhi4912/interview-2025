# SEO for Frontend Engineers / SEO cho Kỹ Sư Frontend

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) · [Next.js README](./README.md) · [SSG Landscape](./05-static-site-generators-landscape.md) · [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) · [Semantic HTML](../05-html-css/00-html5-fundamentals.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Your team just shipped a beautiful React SPA. Three months later, organic traffic is near zero. The content team is furious. What happened?"_

Hầu hết ứng viên Junior sẽ đứng yên, hoặc nói "maybe the keywords are wrong". Câu trả lời của Senior Engineer là ngay lập tức: **"Googlebot couldn't render it. CSR-only React SPAs are invisible to Google until the JS render queue processes them — which can take days to weeks. We need SSR or prerendering."**

Đây là vấn đề thực tế đã xảy ra nhiều lần:

- **Reddit** (2017): Toàn bộ site là CSR. Google indexing không hoàn chỉnh, search traffic stagnant. Reddit migrated sang SSR và organic traffic tăng đáng kể. Năm 2023, Reddit IPO filing đề cập SEO là core revenue driver.

- **Airbnb**: SSR architecture để đảm bảo listings indexed ngay khi crawl. ~35% of Airbnb traffic là organic search. Mất indexing = mất doanh thu trực tiếp.

- **Pinterest** (2015): Site là CSR SPA. Pinterest rebuild thành SSR/Progressive Web App, ghi nhận +50% in SEO traffic và +40% time spent. Case study này đã được Google dùng trong I/O presentations nhiều năm.

- **Shopify storefronts**: Storefront API + Hydrogen framework mặc định ship SSR HTML để mọi product page index ngay. Một Shopify merchant mất indexed products = mất sales ngay hôm đó.

**Hook cho interview**: "Why is your SPA invisible to Google?" — Câu trả lời nằm ở cách Googlebot renders JavaScript, và đó là toàn bộ nội dung file này.

---

## What FE Actually Owns vs Marketing/Content / FE Sở Hữu Gì vs Marketing

Đây là ranh giới quan trọng cần nắm rõ trước interview. Frontend engineers chịu trách nhiệm **kỹ thuật SEO layer** — không phải content strategy hay link building.

### FE Owns / FE Chịu Trách Nhiệm

| Concern                       | FE responsibility                                            |
| ----------------------------- | ------------------------------------------------------------ |
| **Render layer**              | SSR/SSG/CSR choice — HTML có sẵn khi Googlebot crawl không   |
| **Semantic HTML**             | Heading hierarchy, landmark roles, meaningful element choice |
| **Structured data**           | JSON-LD injection, Schema.org types, validation              |
| **Performance signals (CWV)** | LCP, INP, CLS — those are ranking signals now                |
| **URL structure**             | Clean paths, no hash routing for content, canonical setup    |
| **Meta tags**                 | `<title>`, `<meta description>`, OG, Twitter Card, robots    |
| **Crawl efficiency**          | sitemap.xml, robots.txt, internal link health                |
| **i18n correctness**          | hreflang attributes, URL structure per locale                |
| **Image optimization**        | alt text, lazy-loading placement (NOT above-the-fold)        |

### NOT FE's Job / Không Phải Việc Của FE

| Concern                  | Owner                      |
| ------------------------ | -------------------------- |
| Keyword research         | Marketing / SEO Specialist |
| Backlink building        | Marketing                  |
| Content quality & depth  | Content team               |
| Domain authority         | Org-level / Marketing      |
| Google Ads / paid search | Performance Marketing      |

> 🇻🇳 **Tóm tắt**: FE chịu trách nhiệm render layer, HTML semantics, structured data, Core Web Vitals, URL structure, và meta tags. KHÔNG chịu trách nhiệm keyword research hay backlinks. Biết ranh giới này là senior signal.

---

## Concept Map / Bản Đồ Khái Niệm

```
SEO PIPELINE FOR FRONTEND ENGINEERS (2026)
│
├── CRAWLABILITY (Can Googlebot reach the page?)
│   ├── robots.txt — allow/disallow paths
│   ├── sitemap.xml — hint at URL inventory
│   ├── Internal links — crawl graph navigation
│   └── HTTP status codes — 200/301/404/410/503
│
├── INDEXABILITY (Will Google store and understand it?)
│   ├── meta robots (noindex, nofollow)
│   ├── X-Robots-Tag (HTTP header variant)
│   ├── Canonical URL — which URL is the "real" one
│   ├── Duplicate content signals (query params, trailing slash)
│   └── JS render queue — is HTML available on first parse?
│
├── RENDERING (How does Googlebot see JS content?)
│   ├── SSG   → Full HTML at build time ✅ best for SEO
│   ├── ISR   → Full HTML, revalidated ✅ very good
│   ├── SSR   → Full HTML per request ✅ good (TTFB cost)
│   ├── Streaming SSR → HTML in chunks ✅ good (needs care)
│   ├── CSR   → Empty shell until JS runs ⚠️ risk
│   └── Dynamic Rendering → deprecated pattern ❌
│
├── RANKING SIGNALS (What signals affect position?)
│   ├── Core Web Vitals (Page Experience)
│   │   ├── LCP < 2.5s (Largest Contentful Paint)
│   │   ├── INP < 200ms (Interaction to Next Paint — replaced FID March 2024)
│   │   └── CLS < 0.1 (Cumulative Layout Shift)
│   ├── Relevance signals
│   │   ├── Title tag
│   │   ├── Heading hierarchy (H1→H2→H3)
│   │   ├── Semantic HTML (article, section, nav)
│   │   └── Structured data (Schema.org)
│   └── Authority signals (NOT FE's domain)
│       ├── Backlinks
│       └── Domain age / authority
│
└── AI SEARCH ERA (2026 addition)
    ├── Structured data → LLM extraction friendly
    ├── Clean HTML → AI Overviews source signal
    ├── llms.txt convention
    └── Answer engine optimization (AEO)
```

---

## Part 1: How Googlebot Renders JS in 2026 / Googlebot Render JS Như Thế Nào

### Two-Tier Rendering / Hai Tầng Rendering

Googlebot **không render JavaScript ngay lập tức** khi crawl. Google dùng mô hình hai tầng:

```
TIER 1 — Immediate crawl (HTML first pass):
  Googlebot fetches URL → receives HTTP response
  → Parses raw HTML (before any JS executes)
  → Indexes text visible in initial HTML
  → Follows href links found in initial HTML
  Timeline: within minutes of discovery

TIER 2 — JS render queue:
  Page added to render queue
  → Chrome 121+ headless renders the page
  → JS executes, React/Vue/Angular renders DOM
  → Googlebot re-indexes with final DOM content
  Timeline: hours to DAYS (Google processes billions of pages)
```

**Tại sao điều này quan trọng**: Nếu content của bạn chỉ xuất hiện sau khi JS chạy (CSR pattern), content đó có thể mất **nhiều ngày** để được index. Trong thời gian đó, page hiện ra với Google như một trang trống.

### Why CSR-Only Fails for SEO / Tại Sao CSR-Only Thất Bại

```
CSR (Create React App, Vite SPA) initial HTML:
─────────────────────────────────────────────────
<!DOCTYPE html>
<html>
  <head><title>App</title></head>
  <body>
    <div id="root"></div>        ← EMPTY
    <script src="/bundle.js"></script>
  </body>
</html>
─────────────────────────────────────────────────
What Googlebot's Tier 1 sees: a page with title "App" and no content.
What Google indexes immediately: nothing useful.
```

```
SSR/SSG initial HTML:
─────────────────────────────────────────────────
<!DOCTYPE html>
<html>
  <head>
    <title>iPhone 15 Pro Review — TechBlog</title>
    <meta name="description" content="Hands-on with Apple's..." />
  </head>
  <body>
    <h1>iPhone 15 Pro Review</h1>
    <p>After two weeks with the device...</p>
    <!-- Full article content in HTML -->
  </body>
</html>
─────────────────────────────────────────────────
What Googlebot's Tier 1 sees: full, meaningful content.
What Google indexes immediately: everything.
```

### Googlebot UA (2026) / User Agent

Googlebot sử dụng **Chrome 121+** (as of 2024, updated periodically). Hệ quả:

- Modern JS (ES2022+, optional chaining, nullish coalescing) được support
- CSS Grid, Flexbox được render
- Lazy loading với `loading="lazy"` được respect — images below-fold không load trong Tier 1
- Service Workers: Googlebot ignores them (fetches origin directly)
- **Mobile-first indexing**: Googlebot crawls mobile viewport by default. Responsive design là bắt buộc.

### Rendering Strategy Comparison (SEO Lens)

| Strategy              | HTML on first response   | JS dependency for content | Indexing speed      | Content freshness          | SEO Verdict   |
| --------------------- | ------------------------ | ------------------------- | ------------------- | -------------------------- | ------------- |
| **SSG**               | ✅ Full                  | ❌ None                   | ⚡ Immediate        | 🔄 Build-time only         | ✅ Best       |
| **ISR**               | ✅ Full                  | ❌ None                   | ⚡ Immediate        | 🔄 Revalidated on schedule | ✅ Excellent  |
| **SSR**               | ✅ Full                  | ❌ None                   | ⚡ Immediate        | ✅ Per-request fresh       | ✅ Good       |
| **Streaming SSR**     | ⚠️ Partial (shell first) | ❌ None (streams)         | ⚡ Mostly immediate | ✅ Per-request fresh       | ✅ Good\*     |
| **CSR**               | ❌ Empty shell           | ✅ Required               | 🐌 Days (queue)     | ✅ Runtime fresh           | ⚠️ Risk       |
| **Dynamic Rendering** | ✅ For bots only         | ❌ Bots skip JS           | ⚡ Immediate        | Depends                    | ❌ Deprecated |

_\*Streaming SSR: content above-the-fold should be in initial chunks; below-fold content in later chunks is OK for SEO._

_Dynamic Rendering (serve different HTML to bots vs users) was an acceptable workaround 2018-2021 but Google deprecated guidance in 2023. Avoid in greenfield projects._

> 🇻🇳 **Tóm tắt**: Googlebot render JS trong hàng đợi riêng, có thể mất nhiều ngày. SSG/ISR/SSR ship HTML ngay trong response đầu tiên → Googlebot index ngay. CSR-only = trang trắng với Tier 1 → risk không được index đúng hạn. Năm 2026, Googlebot dùng Chrome 121+ mobile-first.

---

## Part 2: Core Web Vitals as Ranking Signal / Core Web Vitals Là Tín Hiệu Xếp Hạng

Google chính thức dùng Core Web Vitals (CWV) trong thuật toán ranking từ **June 2021** (Page Experience Update). Đây không phải "nice to have" — đây là ranking signal.

### The Three Metrics (2026)

| Metric  | Full Name                 | Good threshold | Needs improvement | Poor    | What it measures                                 |
| ------- | ------------------------- | -------------- | ----------------- | ------- | ------------------------------------------------ |
| **LCP** | Largest Contentful Paint  | < 2.5s         | 2.5s – 4.0s       | > 4.0s  | How fast does the largest visible element load?  |
| **INP** | Interaction to Next Paint | < 200ms        | 200ms – 500ms     | > 500ms | How responsive is the page to user interactions? |
| **CLS** | Cumulative Layout Shift   | < 0.1          | 0.1 – 0.25        | > 0.25  | How stable is the layout? (no unexpected jumps)  |

**INP replaced FID (First Input Delay) in March 2024.** This is a high-signal interview fact.

- **FID** (old): Measured delay before the browser _starts_ handling first interaction. Easy to pass.
- **INP** (new): Measures the full duration of _all_ interactions throughout the page lifetime. Much harder. INP captures: click → visual update. FID only captured: click → first handler start.

### Why "Good URLs" Threshold Matters

Google does not apply Page Experience ranking boost to a URL until **75% of real-user visits** to that URL are in the "Good" bucket for all three CWV metrics. This means:

- Lab data (Lighthouse): useful for debugging, but NOT the data Google uses
- **Field data (Chrome User Experience Report / CrUX)**: what Google actually uses for ranking
- CrUX uses a **28-day rolling window** of real user data
- A URL needs consistent good performance across real users, not just your MacBook Pro

```
Implication for development:
- Fast on Lighthouse (lab) ≠ Good CWV ranking signal
- You need REAL USER monitoring (RUM) via web-vitals.js or similar
- A slow 3G user in Vietnam failing INP counts against your CrUX data
```

### CWV — Frontend Ownership

| CWV | Primary FE causes                              | FE fixes                                                   |
| --- | ---------------------------------------------- | ---------------------------------------------------------- |
| LCP | Unoptimized hero image, render-blocking JS/CSS | `<Image priority>` in Next.js, preload hints, SSR          |
| INP | Long tasks blocking main thread, heavy JS      | Code splitting, debounce, move work to Web Worker          |
| CLS | Images without dimensions, late-injected ads   | Always set `width`/`height`, `aspect-ratio` CSS, font swap |

> 🇻🇳 **Tóm tắt**: CWV là ranking signal từ 2021. INP thay FID từ tháng 3/2024 — đây là câu hỏi interview có tần suất cao. Google dùng CrUX data (28-day rolling, real users) chứ không phải Lighthouse. 75% user phải ở "Good" bucket thì URL mới hưởng page experience boost.

---

## Part 3: Semantic HTML & Accessibility = SEO / Semantic HTML và A11y

### The Bidirectional Relationship

```
Accessibility ←→ SEO: same underlying requirement — meaningful markup
      ↓                            ↓
Screen readers need               Googlebot needs
heading hierarchy                 heading hierarchy
to navigate                       to understand structure

Both need:
- Proper <h1> → <h2> → <h3> nesting (only ONE <h1> per page)
- Landmark roles: <header>, <nav>, <main>, <aside>, <footer>
- Descriptive alt text on images (screen reader reads it; Googlebot indexes it)
- Meaningful anchor text (<a href="/pricing">View pricing</a> not "click here")
- Skip links (accessibility) → clean document flow (SEO signal)
```

### Heading Hierarchy

```html
<!-- ✅ Correct — one H1, logical nesting -->
<h1>iPhone 15 Pro Review</h1>
<h2>Design and Build Quality</h2>
<h3>Titanium Frame</h3>
<h3>Camera Island Redesign</h3>
<h2>Performance</h2>
<h3>A17 Pro Benchmarks</h3>

<!-- ❌ Wrong — multiple H1, skipped levels -->
<h1>iPhone 15 Pro</h1>
<h1>Design</h1>
<!-- second H1 dilutes signal -->
<h4>Materials</h4>
<!-- skipped H2, H3 -->
```

### Alt Text for SEO

```html
<!-- ✅ Descriptive, keyword-aware alt -->
<img
  src="/iphone-15-pro-titanium.jpg"
  alt="iPhone 15 Pro in Natural Titanium colorway, side view"
/>

<!-- ❌ Empty alt (invisible to Googlebot) -->
<img src="/product.jpg" alt="" />

<!-- ❌ Keyword stuffing (penalized) -->
<img src="/p.jpg" alt="iPhone buy iPhone cheap iPhone 15 Pro discount" />
```

### Anchor Text

```html
<!-- ✅ Descriptive anchor text = SEO signal for linked page -->
<a href="/blog/core-web-vitals-guide">Learn how to improve Core Web Vitals</a>

<!-- ❌ Generic anchor text = no signal -->
<a href="/blog/core-web-vitals-guide">Click here</a>
<a href="/blog/core-web-vitals-guide">Read more</a>
```

> 🇻🇳 **Tóm tắt**: Semantic HTML phục vụ cả screen readers lẫn Googlebot. Dùng đúng heading hierarchy (một H1 duy nhất), landmark elements, alt text mô tả, anchor text có nghĩa. A11y và SEO không xung đột — chúng cùng yêu cầu markup có nghĩa.

---

## Part 4: Structured Data / Dữ Liệu Có Cấu Trúc

### What Is Structured Data / Là Gì

Structured data là cách nói với Googlebot: "đây là một **Product**, giá **$599**, rating **4.5 stars**" — thay vì để Google tự parse text và đoán. Format phổ biến nhất: **JSON-LD** + **Schema.org** vocabulary.

### Why JSON-LD Beats Microdata in 2026 / Tại Sao JSON-LD Tốt Hơn

| Aspect                    | JSON-LD                                           | Microdata                      |
| ------------------------- | ------------------------------------------------- | ------------------------------ |
| Placement                 | `<script type="application/ld+json">` in `<head>` | Inline HTML attributes         |
| HTML coupling             | ❌ None — completely decoupled                    | ✅ Tightly coupled to HTML     |
| Dynamic injection         | ✅ Easy — just update the JSON                    | ❌ Must change HTML structure  |
| Maintenance               | ✅ Single block to edit                           | ❌ Scattered across HTML       |
| Google preference         | ✅ Officially recommended                         | ⚠️ Supported but not preferred |
| React/Next.js integration | ✅ Trivial — inject as string                     | ❌ Messy with JSX              |

**Google explicitly recommends JSON-LD** in their developer documentation.

### Common Schema Types / Các Loại Schema Phổ Biến

**Article** — Blog posts, news:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "iPhone 15 Pro Review: Two Weeks With Titanium",
  "datePublished": "2024-09-25T08:00:00+07:00",
  "dateModified": "2024-09-26T10:00:00+07:00",
  "author": {
    "@type": "Person",
    "name": "Nguyen Van A",
    "url": "https://techblog.vn/author/nguyen-van-a"
  },
  "publisher": {
    "@type": "Organization",
    "name": "TechBlog VN",
    "logo": {
      "@type": "ImageObject",
      "url": "https://techblog.vn/logo.png"
    }
  },
  "image": "https://techblog.vn/images/iphone15pro-review.jpg",
  "description": "Hands-on review of the iPhone 15 Pro after two weeks of daily use."
}
```

**Product** — E-commerce:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "iPhone 15 Pro 256GB Natural Titanium",
  "image": ["https://example.com/iphone15pro.jpg"],
  "description": "Apple iPhone 15 Pro with A17 Pro chip",
  "brand": { "@type": "Brand", "name": "Apple" },
  "sku": "IPHONE15PRO-256-NTITANIUM",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/iphone-15-pro",
    "priceCurrency": "USD",
    "price": "999.00",
    "priceValidUntil": "2024-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1247"
  }
}
```

**BreadcrumbList** — Navigation context:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Phones", "item": "https://example.com/phones/" },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "iPhone 15 Pro",
      "item": "https://example.com/phones/iphone-15-pro"
    }
  ]
}
```

**FAQPage** — FAQ sections (rich result in SERPs):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does iPhone 15 Pro support USB-C?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, iPhone 15 Pro uses a USB-C port (USB 3.0 speeds), replacing Lightning."
      }
    }
  ]
}
```

### Validation / Kiểm Tra

Sau khi implement, validate tại:

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **Google Search Console** → Enhancements tab (real-world coverage + errors)

> 🇻🇳 **Tóm tắt**: Structured data (JSON-LD + Schema.org) nói với Google chính xác loại content là gì. JSON-LD được Google recommend vì decoupled khỏi HTML. Các types quan trọng: Article, Product, BreadcrumbList, FAQPage. Validate bằng Rich Results Test sau khi deploy.

---

## Part 5: Meta Tags & Social / Thẻ Meta và Mạng Xã Hội

### Core Meta Tags

```html
<head>
  <!-- Title: 50-60 characters. Most important on-page signal. -->
  <title>iPhone 15 Pro Review: Titanium, A17 Pro, USB-C Tested | TechBlog</title>

  <!-- Description: 150-160 characters. Not a ranking signal but affects CTR. -->
  <meta
    name="description"
    content="Two-week hands-on with iPhone 15 Pro: titanium build, A17 Pro performance benchmarks, USB-C speed test, and camera comparison vs 14 Pro."
  />

  <!-- Canonical: tells Google which URL is the "real" one -->
  <link rel="canonical" href="https://techblog.vn/reviews/iphone-15-pro" />

  <!-- Robots: page-level crawl/index instructions -->
  <meta name="robots" content="index, follow" />
  <!-- Or for non-indexed pages: -->
  <meta name="robots" content="noindex, nofollow" />
</head>
```

### robots.txt vs meta robots vs X-Robots-Tag

| Mechanism       | Scope          | Where                 | Use case                                             |
| --------------- | -------------- | --------------------- | ---------------------------------------------------- |
| `robots.txt`    | Crawl disallow | Root of domain        | Prevent bots from fetching URLs (saves crawl budget) |
| `<meta robots>` | Index/follow   | `<head>` of HTML page | Prevent indexing of specific pages                   |
| `X-Robots-Tag`  | Index/follow   | HTTP response header  | Non-HTML files (PDFs, images); or server-level rules |

**Critical difference**: `robots.txt` disallow does NOT prevent indexing if other sites link to that URL. Use `noindex` meta tag to actually prevent indexing.

```
robots.txt — controls CRAWLING (can Googlebot fetch this URL?)
noindex    — controls INDEXING (should Google include this in search results?)
```

### hreflang for i18n / hreflang cho Đa Ngôn Ngữ

```html
<!-- On the English version (en) -->
<link rel="alternate" hreflang="en" href="https://example.com/en/product/" />
<link rel="alternate" hreflang="vi" href="https://example.com/vi/product/" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/product/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/product/" />
```

**x-default**: dùng khi không có ngôn ngữ phù hợp với user. Trỏ đến version mặc định (thường là English).

**Common hreflang bugs**:

- Chỉ khai báo một chiều (en page reference vi, nhưng vi page không reference en) → hreflang ignored
- Missing `x-default` → Google may show wrong locale in wrong region
- hreflang trong JS (not in static HTML) → race condition với Tier 1 crawl

### Open Graph (Social Sharing)

```html
<meta property="og:title" content="iPhone 15 Pro Review: Titanium, A17 Pro, USB-C Tested" />
<meta
  property="og:description"
  content="Two-week hands-on review with benchmarks and camera tests."
/>
<meta property="og:image" content="https://techblog.vn/og-images/iphone-15-pro-review.jpg" />
<meta property="og:url" content="https://techblog.vn/reviews/iphone-15-pro" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="TechBlog VN" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="iPhone 15 Pro Review" />
<meta name="twitter:description" content="Two-week hands-on review." />
<meta name="twitter:image" content="https://techblog.vn/og-images/iphone-15-pro-review.jpg" />
```

OG image dimensions: **1200×630px** recommended. Twitter large card: 1200×628px minimum.

> 🇻🇳 **Tóm tắt**: Title 50-60 ký tự, description 150-160 ký tự. robots.txt kiểm soát crawling; noindex meta kiểm soát indexing — chúng khác nhau. hreflang phải bidirectional. OG tags ảnh hưởng click-through từ social không phải ranking trực tiếp.

---

## Part 6: Next.js SEO Patterns / Patterns SEO trong Next.js

### App Router: `metadata` API

Next.js App Router có built-in metadata API thay thế việc manual inject `<head>` tags.

**Static metadata:**

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | TechBlog VN",
  description: "Learn about TechBlog VN, Vietnam's leading tech review publication.",
  openGraph: {
    title: "About Us | TechBlog VN",
    description: "Vietnam's leading tech review publication.",
    images: [{ url: "/og-images/about.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://techblog.vn/about",
  },
};

export default function AboutPage() {
  return <main>...</main>;
}
```

**Dynamic metadata with `generateMetadata`:**

```tsx
// app/products/[slug]/page.tsx
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch product data — this runs on the SERVER, not client
  const product = await fetch(`https://api.example.com/products/${params.slug}`, {
    next: { revalidate: 3600 },
  }).then((r) => r.json());

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — ${product.brand} | Shop`,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    alternates: {
      canonical: `https://shop.example.com/products/${params.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await fetch(`https://api.example.com/products/${params.slug}`).then((r) =>
    r.json(),
  );
  return <main>{/* product content */}</main>;
}
```

**Key insight**: `generateMetadata` runs on the server during SSR/SSG — the resulting `<title>` and `<meta>` tags are in the initial HTML. No JavaScript needed on the client to render them. Googlebot Tier 1 sees them immediately.

### JSON-LD Injection in Next.js App Router

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.name },
    image: post.coverImage,
    description: post.excerpt,
  };

  return (
    <>
      {/* JSON-LD is in the HTML — Googlebot Tier 1 reads it */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <h1>{post.title}</h1>
        {/* ... */}
      </article>
    </>
  );
}
```

### Dynamic OG Images with `next/og`

```tsx
// app/og/route.tsx  (or app/blog/[slug]/opengraph-image.tsx)
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "TechBlog VN";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#0f172a",
        width: "100%",
        height: "100%",
        padding: "60px",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 24 }}>TechBlog VN</p>
      <h1 style={{ color: "#f1f5f9", fontSize: 64, fontWeight: 700, marginTop: 24 }}>{title}</h1>
    </div>,
    { width: 1200, height: 630 },
  );
}
```

```tsx
// Reference from metadata:
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    openGraph: {
      images: [`/og?title=${encodeURIComponent(post.title)}`],
    },
  };
}
```

### sitemap.ts

```tsx
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const products = await getAllProducts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://example.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...postPages];
}
```

This generates `/sitemap.xml` at build time (or on-demand for SSR), with proper `Content-Type: application/xml`.

### robots.ts

```tsx
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/images/",
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### RSC vs Client Components for SEO Content

```tsx
// ✅ SEO content in Server Component (no 'use client')
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  // This fetch runs on server — content is in initial HTML
  const post = await getPost(params.slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p> {/* ← In HTML, Googlebot Tier 1 reads this */}
      <LikeButton postId={post.id} /> {/* Client Component — interactive only */}
    </article>
  );
}
```

```tsx
// ❌ SEO content in Client Component — not visible to Tier 1
"use client";
import { useEffect, useState } from "react";

export default function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then(setPost);
  }, [slug]);

  if (!post) return <div>Loading...</div>; // ← What Googlebot sees in Tier 1

  return (
    <article>
      <h1>{post.title}</h1>
    </article>
  ); // Never seen in Tier 1
}
```

**Rule**: Keep SEO-critical content (title, main text, product info) in Server Components or `generateMetadata`. Interactive-only features (likes, comments, cart) → Client Components.

> 🇻🇳 **Tóm tắt**: Next.js App Router có `metadata` export và `generateMetadata()` function. `generateMetadata` chạy trên server → tags có trong initial HTML → Googlebot Tier 1 đọc được. JSON-LD inject qua `<script type="application/ld+json">`. `sitemap.ts` và `robots.ts` generate files tự động. Content SEO-critical phải ở Server Components.

---

## Part 7: AI Search Era (2026) / Kỷ Nguyên Tìm Kiếm AI

### What's Actually Happening / Điều Gì Đang Thực Sự Xảy Ra

Tính đến 2025-2026, có ba thay đổi thực chất cần biết — không hype, chỉ practical impact:

**1. Google AI Overviews (SGE)**

Google AI Overviews hiển thị AI-generated summary ở đầu SERP cho nhiều query. Điều này có nghĩa:

- Organic click-through rates cho informational queries đang giảm
- Pages được trích dẫn trong AI Overviews nhận **visibility** nhưng không nhất thiết nhận clicks
- Structured data + clean HTML tăng khả năng được trích dẫn trong AI Overviews

**2. LLM Crawlers (Perplexity, ChatGPT, Bing Copilot)**

Các LLM-powered search engines có crawlers riêng (PerplexityBot, GPTBot, OAI-SearchBot). Chúng:

- Ưu tiên pages với **clean HTML** (ít noise, rõ ràng cấu trúc)
- Đọc structured data để hiểu entity relationships
- Tôn trọng `robots.txt` — bạn có thể block GPTBot nếu muốn

```
# robots.txt — block GPTBot nếu không muốn content bị dùng cho LLM training
User-agent: GPTBot
Disallow: /

# Allow Perplexity (search traffic source)
User-agent: PerplexityBot
Allow: /
```

**3. llms.txt Convention**

Một convention không chính thức (chưa phải standard) đang nổi lên: `/llms.txt` — plain text file giải thích site structure cho LLMs, tương tự như `robots.txt` nhưng cho AI agents.

```
# llms.txt (đặt ở root domain)
# Hướng dẫn cho AI assistants về site này

> TechBlog VN: Vietnamese tech review publication

## What this site is
Tech reviews, tutorials, and news for Vietnamese developers and consumers.

## Key sections
- /reviews/ - Product reviews (phones, laptops, accessories)
- /tutorials/ - How-to guides for developers
- /news/ - Vietnamese tech industry news

## Important: Content language
Primary language: Vietnamese. English summaries at bottom of each article.
```

**Practical impact**: llms.txt adoption là low risk / moderate upside cho sites với complex structure. Không phải ranking factor — chỉ là documentation cho AI agents.

### Answer Engine Optimization (AEO)

Content strategy shift: thay vì chỉ target keywords, cần target **questions with direct answers** — vì AI search engines extract and display answers directly.

Frontend implications:

- FAQPage schema → tăng chance được trích trong AI Overviews
- Concise, clearly-structured HTML answers (not buried in paragraph prose)
- `<article>` với rõ ràng `<h1>` question → `<p>` answer structure

> 🇻🇳 **Tóm tắt**: AI Overviews đang giảm CTR cho informational queries. Structured data + clean HTML tăng khả năng được trích dẫn. GPTBot và PerplexityBot có thể block/allow riêng trong robots.txt. llms.txt là convention mới, không phải standard — low risk để adopt. AEO = target questions with direct, clearly-structured answers.

---

## Part 8: Common SEO Bugs in SPAs / Lỗi SEO Phổ Biến trong SPA

### Bug 1: Client-Side Router Not Updating `<title>`

```tsx
// ❌ Bug — title never changes after first render
// React SPA with react-router
export default function ProductPage() {
  return (
    <div>
      <h1>Product Name</h1>
      {/* No document.title update, no <title> change */}
    </div>
  );
}
```

```tsx
// ✅ Fix — Next.js App Router (title in metadata, server-rendered)
export const metadata: Metadata = { title: "Product Name | Shop" };

// Or for legacy SPAs with react-router: react-helmet or react-helmet-async
import { Helmet } from "react-helmet-async";
export default function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name} | Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <h1>{product.name}</h1>
    </>
  );
}
```

### Bug 2: Missing Meta on Dynamic Routes

```tsx
// ❌ Bug — same static metadata for all products
// app/products/[slug]/page.tsx — NO generateMetadata
export const metadata: Metadata = {
  title: "Product | Shop", // same title for all /products/* routes
};
```

```tsx
// ✅ Fix — dynamic metadata per route
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} — ${product.brand} | Shop`,
    description: product.description.slice(0, 155),
  };
}
```

### Bug 3: Duplicate Content from Query Params

```
/products?sort=price&page=1    ← same content as /products
/products?sort=name&page=1     ← same content
/products?utm_source=email     ← same content

Without canonical: Google sees 50 "duplicate" product listing pages.
```

```tsx
// ✅ Fix — canonical pointing to clean URL
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://example.com/products`, // canonical strips query params
    },
  };
}
```

### Bug 4: Infinite Scroll Without Pagination URLs

```
❌ Infinite scroll SPA:
  /products  → shows products 1-20 → user scrolls → loads 21-40 → no URL change

Googlebot sees: only products 1-20. Products 21+ are invisible.

✅ Fix options:
  Option A: Paginated URLs with rel="next"
    /products?page=1  →  /products?page=2  →  /products?page=3
    (with canonical for page 1 = /products)

  Option B: Load more button (not infinite scroll) with URL update
    /products#page-2  (hash doesn't work — see Anti-Patterns)

  Option C: Static pages for important content + infinite scroll for "nice to have" extra
```

### Bug 5: JS-Rendered Canonicals (Race Condition)

```tsx
// ❌ Bug — canonical set via client-side JS
"use client";
import { useEffect } from "react";

export default function ProductPage({ product }) {
  useEffect(() => {
    // This runs AFTER JS executes — Googlebot Tier 1 never sees it
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `https://example.com/products/${product.slug}`;
    document.head.appendChild(link);
  }, [product.slug]);
  // ...
}
```

```tsx
// ✅ Fix — canonical in generateMetadata (server-rendered)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://example.com/products/${params.slug}`,
    },
  };
}
```

### Bug 6: Hash Routing

```
❌ Hash routing for content:
  https://myapp.com/#/products/iphone-15
  https://myapp.com/#/blog/my-post

Google treats everything after # as fragment — not a separate URL.
All hash routes are the same URL to Google: https://myapp.com/

✅ Fix: Use real path routing
  https://myapp.com/products/iphone-15
  https://myapp.com/blog/my-post
```

> 🇻🇳 **Tóm tắt**: 6 bugs phổ biến: (1) title không update theo route, (2) metadata giống nhau cho mọi dynamic page, (3) duplicate content từ query params không có canonical, (4) infinite scroll không có pagination URLs, (5) canonical/meta tag render bằng JS (race condition với Tier 1), (6) hash routing cho content pages.

---

## Part 9: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What is SSR and why does it help SEO? / SSR là gì và tại sao giúp SEO?

**A:**

SSR (Server-Side Rendering) means the server executes your JavaScript framework code and returns a **complete HTML document** in the HTTP response — before the browser runs any JavaScript.

For SEO, SSR matters because Googlebot operates in two tiers. In Tier 1, Googlebot parses the raw HTML response immediately. If that HTML is empty (CSR pattern), Googlebot indexes nothing useful until the JS render queue processes the page — which can take days.

With SSR, the full page content (title, headings, body text, structured data) is present in the initial HTML. Googlebot Tier 1 indexes it immediately, giving the page its best chance of ranking.

Concrete: a product page with price, description, and reviews in SSR HTML → indexed today. The same page as a CSR SPA → Googlebot sees a `<div id="root"></div>` for potentially days.

Vietnamese: SSR = server chạy framework code và trả về HTML đầy đủ trong response. Googlebot hoạt động hai tầng: Tier 1 parse HTML ngay lập tức, Tier 2 (JS render queue) có thể mất nhiều ngày. SSR = content trong HTML từ đầu → Tier 1 index ngay. CSR = HTML trống → phải chờ Tier 2.

**💡 Interview Signal:**

- ✅ Strong: Explains two-tier rendering model, gives concrete timeline comparison (days vs immediate), mentions mobile-first indexing
- ❌ Weak: "SSR is faster" — speed and indexing speed are different concerns; conflating them shows shallow understanding

---

### 🟢 Q2: What's the difference between robots.txt and meta robots? / robots.txt vs meta robots khác nhau thế nào?

**A:**

They control different things:

- **robots.txt** controls **crawling** — whether Googlebot is allowed to _fetch_ a URL. Placed at the root of the domain (`/robots.txt`).
- **`<meta name="robots" content="noindex">`** controls **indexing** — whether Google should include that page in search results.

Critical distinction: `robots.txt` disallow does NOT prevent indexing if other sites link to that URL. Google can infer the page exists from backlinks and may index it without ever fetching it. To actually remove a page from search results, you need `noindex`.

`X-Robots-Tag` is the HTTP header version of the meta robots tag — useful for PDFs, images, or server-level rules.

Vietnamese: robots.txt kiểm soát crawling (Googlebot có được fetch URL không). Meta robots noindex kiểm soát indexing (Google có include page trong search results không). Chúng KHÔNG thay thế nhau. Một page bị disallow trong robots.txt vẫn có thể được index nếu có backlinks trỏ vào. Muốn thực sự remove khỏi index → dùng noindex.

**💡 Interview Signal:**

- ✅ Strong: Explicitly states the "disallow doesn't prevent indexing" distinction, mentions X-Robots-Tag for non-HTML resources
- ❌ Weak: "robots.txt blocks Google from indexing" — common misconception; shows the candidate hasn't tested this distinction in practice

---

### 🟡 Q3: Explain how Googlebot renders a React SPA. Why does it take so long? / Googlebot render React SPA như thế nào?

**A:**

Googlebot uses a two-tier rendering model:

**Tier 1 (immediate)**: Googlebot fetches the URL, parses the raw HTML response. For a React SPA, this HTML typically contains only `<div id="root"></div>` and a `<script>` tag. Googlebot extracts whatever text and links are present — for a CSR SPA, almost nothing useful.

**Tier 2 (queued)**: The URL is added to Google's JavaScript render queue. A Chrome 121+ headless instance eventually processes it, executes the React code, renders the DOM, and re-indexes the fully-rendered content.

**Why it takes days**: Google processes billions of URLs. The render queue is a separate pipeline from the crawl queue, with lower priority and higher resource cost (full Chrome rendering vs simple HTML parsing). A new or low-authority site might wait days for Tier 2 processing.

**Why it matters**: During that wait, the page either ranks for nothing (no initial HTML content) or ranks poorly. Time-sensitive content (product launches, news articles) cannot afford this delay.

Vietnamese: Googlebot dùng mô hình 2 tầng. Tier 1: fetch HTML ngay lập tức → SPA trả về `<div id="root"></div>` → không có gì để index. Tier 2: URL vào hàng đợi render JS → Chrome 121+ headless render đầy đủ → re-index. Tại sao mất vài ngày? Google xử lý hàng tỷ URL, render queue tốn nhiều resource hơn HTML parse. Sites mới/low-authority đợi lâu hơn. Content time-sensitive (launch ngày hôm nay) không thể chờ Tier 2.

**💡 Interview Signal:**

- ✅ Strong: Describes both tiers with the Chrome 121+ detail, explains queue prioritization logic, mentions impact on time-sensitive content
- ❌ Weak: "Google can't render JavaScript" — outdated since 2015; shows lack of up-to-date knowledge

---

### 🟡 Q4: What are Core Web Vitals and which one replaced FID? / Core Web Vitals là gì và metric nào thay thế FID?

**A:**

Core Web Vitals are Google's three user-experience metrics that act as ranking signals since June 2021:

- **LCP (Largest Contentful Paint)** — How fast does the main content load? Good: < 2.5s
- **INP (Interaction to Next Paint)** — How responsive is the page to user interactions? Good: < 200ms
- **CLS (Cumulative Layout Shift)** — How stable is the layout? Good: < 0.1

**INP replaced FID (First Input Delay) in March 2024.** FID only measured the delay before the browser started handling the first interaction. INP measures the full duration of all interactions throughout the page's lifetime — the time from user input (tap/click/key) to the next visual update. INP is significantly harder to pass because it catches long-running JavaScript tasks that block the main thread during any user interaction, not just the first one.

Google uses **field data from CrUX** (Chrome User Experience Report) — real user measurements with a 28-day rolling window — not lab data from Lighthouse. A URL needs 75% of visits in the "Good" bucket to benefit from the Page Experience ranking boost.

Vietnamese: CWV gồm LCP (< 2.5s), INP (< 200ms), CLS (< 0.1). INP thay FID từ tháng 3/2024. FID chỉ đo delay trước khi xử lý interaction đầu tiên. INP đo toàn bộ thời gian từ input đến visual update, cho mọi interaction trong suốt vòng đời page — khó hơn nhiều. Google dùng CrUX (field data thực, rolling 28 ngày) không phải Lighthouse.

**💡 Interview Signal:**

- ✅ Strong: States the March 2024 replacement date, explains WHY INP is harder than FID (all interactions vs first only), mentions CrUX vs lab data distinction
- ❌ Weak: Still mentions FID as a current metric, or confuses LCP with FCP (First Contentful Paint)

---

### 🟡 Q5: What is a canonical URL and when do you set one? / Canonical URL là gì và khi nào set?

**A:**

A canonical URL (`<link rel="canonical" href="...">`) tells Google which URL is the authoritative version of a page when multiple URLs serve the same or very similar content.

**When to set canonical:**

1. **Paginated content**: `/products?page=1` → canonical = `/products`
2. **UTM parameters**: `/blog/post?utm_source=email` → canonical = `/blog/post`
3. **Sort/filter variants**: `/products?sort=price&color=red` → canonical = `/products`
4. **www vs non-www**: ensure canonical consistently uses one form
5. **HTTP vs HTTPS duplicates**: canonical should always point to HTTPS version
6. **Syndicated content**: if your article is republished elsewhere, the publisher sets canonical to your original URL

**Critical rule**: canonical must be in the **server-rendered HTML**, not injected by JavaScript. If the canonical tag is added by client-side code (`useEffect`, dynamic import), Googlebot Tier 1 never sees it. This creates a race condition where Google may choose the wrong canonical.

Vietnamese: Canonical URL báo với Google đâu là URL chính thức khi có nhiều URL trỏ đến cùng nội dung. Set khi: query params (utm, sort, filter), pagination, www vs non-www, HTTP vs HTTPS. Quan trọng nhất: canonical phải trong server-rendered HTML, KHÔNG set bằng JS client-side (race condition với Tier 1 crawl).

**💡 Interview Signal:**

- ✅ Strong: Lists concrete scenarios (UTM params, pagination, sort params), specifically warns about JS-rendered canonical race condition
- ❌ Weak: "Set canonical to avoid duplicates" without knowing the JS injection problem — misses the most common implementation bug

---

### 🟡 Q6: JSON-LD vs microdata — which and why in 2026? / JSON-LD vs microdata — chọn cái nào năm 2026?

**A:**

**JSON-LD in 2026, without question.** Three reasons:

1. **Decoupled from HTML structure**: JSON-LD lives in a `<script type="application/ld+json">` tag. You can add, update, or remove structured data without touching the HTML markup. Microdata requires adding `itemscope`, `itemtype`, and `itemprop` attributes to every relevant HTML element.

2. **Dynamic generation is trivial**: In React/Next.js, you serialize a JavaScript object to a JSON string. With microdata, you'd need to conditionally render HTML attributes across multiple components — a maintenance nightmare.

3. **Google officially recommends it**: Google's developer documentation explicitly states JSON-LD is the preferred format. Microdata is supported but not recommended.

**Practical example**:

```html
<!-- JSON-LD: structured data is isolated -->
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "Product", "name": "iPhone 15 Pro", "price": "999" }
</script>
<h1>iPhone 15 Pro</h1>
<p>$999</p>

<!-- Microdata: structured data spread across HTML -->
<div itemscope itemtype="https://schema.org/Product">
  <h1 itemprop="name">iPhone 15 Pro</h1>
  <p itemprop="price">$999</p>
</div>
```

Vietnamese: Dùng JSON-LD năm 2026 vì: (1) Hoàn toàn tách khỏi HTML — thay đổi không cần sửa markup. (2) Dễ generate động từ JS object. (3) Google chính thức recommend. Microdata được support nhưng yêu cầu scatter attributes khắp HTML — không maintainable với React component model.

**💡 Interview Signal:**

- ✅ Strong: Gives all three reasons, shows awareness of React/component-model implications, mentions Google's official stance
- ❌ Weak: "I'd use JSON-LD because it's easier" — correct conclusion but lacks technical justification

---

### 🔴 Q7: You ship a Next.js App Router app. Where do you put `metadata` for a dynamic product page? / Đặt metadata ở đâu cho dynamic product page trong Next.js App Router?

**A:**

Export `generateMetadata` as an async function from the page's `page.tsx` file. It receives the same `params` and `searchParams` as the page component, runs on the server, and returns a typed `Metadata` object.

```tsx
// app/products/[slug]/page.tsx
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false }, // noindex for 404-equivalent pages
    };
  }

  return {
    title: `${product.name} — ${product.brand} | Shop`,
    description: product.shortDescription.slice(0, 155),
    openGraph: {
      title: product.name,
      images: [{ url: product.coverImage, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://shop.example.com/products/${params.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.slug);
  // ...
}
```

**Key implementation details**:

- `generateMetadata` runs on the **server** — the `<title>` and `<meta>` tags are in the initial HTML, visible to Googlebot Tier 1
- Next.js **deduplicates fetch calls** — if `getProduct` is called in both `generateMetadata` and the page component with the same URL and same cache config, it uses the same cached response
- For `notFound()` pages, return `{ title: "Not Found", robots: { index: false } }` to prevent soft 404 indexing
- Layout metadata is **merged** with page metadata — more specific (page) overrides less specific (layout)

Vietnamese: Export `generateMetadata` async function từ `page.tsx` của route đó. Function nhận `params`, chạy trên server, return typed `Metadata` object. Kết quả được inject vào `<head>` của HTML trả về — Googlebot Tier 1 đọc được ngay. Next.js dedup fetch calls giữa `generateMetadata` và page component. Cho not-found pages: set `robots: { index: false }` để tránh soft 404 được index.

**💡 Interview Signal:**

- ✅ Strong: Knows `generateMetadata` (not just static `metadata` export), explains it runs server-side, mentions fetch deduplication, handles the `notFound()` case with `robots: { index: false }`
- ❌ Weak: "Use `<Head>` component" — that's Pages Router (`next/head`); shows confusion between App Router and Pages Router APIs

---

### 🔴 Q8: Single-page app with hash routing — what's the SEO problem and fix? / SPA dùng hash routing — vấn đề SEO là gì?

**A:**

**The problem**: The URL fragment (everything after `#`) is never sent to the server and is ignored by Googlebot as an identifier. `https://myapp.com/#/products/iphone-15` and `https://myapp.com/#/about` are the **same URL** to Google — `https://myapp.com/`. All hash-routed "pages" collapse to one URL.

Consequences:

- You cannot have individual pages indexed — Google sees only one page
- Each "page" cannot have unique title, description, or canonical
- Backlinks to hash routes don't benefit individual "pages" in Google's model
- Structured data per "page" is impossible to associate correctly

**The fix**: Migrate to real path-based routing.

| Before (hash)           | After (path)          |
| ----------------------- | --------------------- |
| `/#/products/iphone-15` | `/products/iphone-15` |
| `/#/blog/seo-guide`     | `/blog/seo-guide`     |
| `/#/about`              | `/about`              |

For an existing React SPA using React Router with hash history:

```tsx
// ❌ Hash history (BrowserRouter with hash mode, or HashRouter)
import { HashRouter } from "react-router-dom";
<HashRouter>...</HashRouter>;

// ✅ Browser history (real paths)
import { BrowserRouter } from "react-router-dom";
<BrowserRouter>...</BrowserRouter>;
```

Migration requires:

1. Switch router to BrowserRouter
2. Configure server to serve `index.html` for all paths (SPA fallback)
3. Add SSR or prerendering for SEO-critical pages
4. Set up 301 redirects from old hash URLs if they were ever indexed

Vietnamese: Hash routing là thảm họa SEO vì `#` và mọi thứ sau nó bị browser giữ lại, không gửi lên server, và Google coi tất cả hash routes là cùng một URL. `/app/#/products/x` = `/app/#/about` = `/app/` với Googlebot. Fix: migrate sang path-based routing (BrowserRouter), configure server để serve index.html cho mọi path, và add prerender/SSR cho trang SEO quan trọng.

**💡 Interview Signal:**

- ✅ Strong: Explains the fragment/server mechanics (# never sent to server), shows HashRouter → BrowserRouter migration, mentions server-side SPA fallback requirement, addresses redirect strategy for existing URLs
- ❌ Weak: "Hash routing is bad, use React Router" — vague, doesn't explain WHY or the server fallback requirement

---

### 🔴 Q9: Client says "we have great content but rank poorly" — your debugging order? / Client nói "có content tốt nhưng rank kém" — debug theo thứ tự nào?

**A:**

Systematic debug order — check each layer before assuming the next:

**Step 1: Are pages indexed at all?**

```
Google: site:example.com/products
→ If 0 results: indexing problem
→ If results but no ranks: relevance/authority problem
```

**Step 2: Can Googlebot crawl and render?**

- Check `robots.txt` — any accidental `Disallow: /`?
- Check `<meta name="robots">` — any accidental `noindex`?
- Check `X-Robots-Tag` in response headers
- Test with Google Search Console → URL Inspection tool → "Test Live URL"
- Check if content is SSR'd or CSR'd — view page source (not DevTools Elements) for text

**Step 3: Is the HTML meaningful on first response?**

```bash
curl -s https://example.com/products/iphone-15 | grep -i "<title>\|<h1>\|<meta name=\"description\""
# If these return empty or generic: SSR/SSG is the problem
```

**Step 4: Core Web Vitals status**

- Google Search Console → Core Web Vitals report
- CrUX data for the domain
- If failing CWV: page experience signal is hurting ranking

**Step 5: Structured data errors**

- Google Search Console → Enhancements → check for invalid markup
- Google Rich Results Test on key pages

**Step 6: Technical SEO audit**

- Duplicate content / missing canonicals (Screaming Frog or similar)
- Broken internal links
- Missing hreflang if i18n site
- Sitemap coverage vs actual indexed pages

**Step 7: Content-level (hand off to SEO specialist)**

- Title/heading alignment with target keywords
- Content depth vs top-ranking competitors
- At this point: content and authority concerns, not FE concerns

Vietnamese: Debug theo 7 bước: (1) Kiểm tra trang có được index chưa với `site:`. (2) Crawl/render — robots.txt, noindex meta, GSC URL inspection. (3) HTML có meaningful không khi curl — SSR vs CSR check. (4) CWV status trong GSC. (5) Structured data errors. (6) Technical audit (duplicate, canonical, hreflang). (7) Content-level — hand off sang SEO specialist. Đây là thứ tự loại trừ từ technical layer sang content layer.

**💡 Interview Signal:**

- ✅ Strong: Starts with "are pages indexed?" before anything else, includes the `curl` source check for SSR detection, distinguishes FE concerns from SEO specialist concerns in step 7
- ❌ Weak: Immediately jumps to "check their keywords" — skips technical layers, shows no systematic approach

---

### 🔴 Q10: How do you handle SEO for an i18n site (en/vi/ja)? / Xử lý SEO cho i18n site như thế nào?

**A:**

Three technical concerns for i18n SEO:

**1. URL structure** — Google needs separate URLs per locale. Three acceptable patterns:

| Pattern      | Example           | Notes                                  |
| ------------ | ----------------- | -------------------------------------- |
| Subdomain    | `vi.example.com`  | Strong locale signal; harder CDN setup |
| Subdirectory | `example.com/vi/` | Recommended — shares domain authority  |
| ccTLD        | `example.vn`      | Strongest geo-targeting; expensive     |

Avoid: query param locale (`example.com?lang=vi`) — Google treats as duplicate of `example.com`.

**2. hreflang attributes** — Must be bidirectional (every locale references all other locales):

```html
<!-- On the Vietnamese page: /vi/products/iphone-15 -->
<link rel="alternate" hreflang="en" href="https://example.com/en/products/iphone-15" />
<link rel="alternate" hreflang="vi" href="https://example.com/vi/products/iphone-15" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/products/iphone-15" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/products/iphone-15" />
```

Bidirectional rule: if en references vi, then vi must also reference en. Unidirectional hreflang = ignored by Google.

**3. Next.js i18n implementation:**

```tsx
// app/[locale]/products/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug, params.locale);
  const locales = ["en", "vi", "ja"];

  return {
    title: product.localizedName,
    description: product.localizedDescription,
    alternates: {
      canonical: `https://example.com/${params.locale}/products/${params.slug}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `https://example.com/${loc}/products/${params.slug}`]),
      ),
    },
  };
}
```

**Common i18n SEO bugs**:

- hreflang only declared in one direction → Google ignores it
- Locale detection via JS (redirect client-side) → Googlebot gets default locale for all URLs
- Same sitemap for all locales → provide locale-specific sitemaps or sitemapindex
- Machine-translated content without human review → thin content penalty risk

Vietnamese: i18n SEO có 3 concerns kỹ thuật: (1) URL structure — dùng subdirectory `/vi/` là recommended (share domain authority). Tránh query param locale. (2) hreflang bidirectional — mọi locale phải reference tất cả locales khác. Unidirectional → Google ignore. (3) Next.js: dùng `alternates.languages` trong `generateMetadata`. Bug phổ biến: hreflang một chiều, JS-based locale redirect (Googlebot thấy default locale cho mọi URL).

**💡 Interview Signal:**

- ✅ Strong: Explains bidirectional hreflang requirement, warns against query param locale and JS-redirect locale detection, shows Next.js implementation with `alternates.languages`
- ❌ Weak: "Use hreflang tags" without knowing the bidirectional requirement — the most common failure mode in real implementations

---

## Anti-Patterns / Các Lỗi Sai Cần Tránh

### Anti-Pattern 1: SPA with No SSR/Prerender → Ghost in Google

```
❌ What happens:
  Create React App / Vite SPA → ships <div id="root"></div>
  Googlebot Tier 1: sees empty page → indexes nothing useful
  Tier 2 queue: may take days; for low-authority sites, may deprioritize indefinitely

✅ Fix: SSR (Next.js/Nuxt), SSG (Astro/Next), or prerendering (react-snap as last resort)
```

Site đẹp, content tốt, traffic organic = 0. Senior engineers gọi đây là "the ghost problem" — site tồn tại với users nhưng invisible với Google.

### Anti-Pattern 2: Hash-Based Routing for Content Pages

```
❌ https://myapp.com/#/blog/seo-guide
   https://myapp.com/#/products/iphone-15
→ Both are the same URL to Google: https://myapp.com/
→ Cannot be individually indexed, linked to, or ranked

✅ Use real paths: /blog/seo-guide, /products/iphone-15
  Configure server: serve index.html for all paths (SPA fallback)
```

### Anti-Pattern 3: Same `<title>` on Every Route

```
❌ Every page returns:
  <title>MyShop | Best Online Store</title>

Consequences:
  - Google sees 500 "duplicate" pages with identical titles
  - Pagerank diluted across all pages
  - Users can't distinguish pages in SERPs
  - GSC flags title duplication as a warning

✅ Dynamic, unique title per route via generateMetadata or react-helmet
```

### Anti-Pattern 4: Lazy-Loading Above-the-Fold Images (Kills LCP)

```html
<!-- ❌ Bug: hero image is the LCP element, but loading="lazy" defers it -->
<img src="/hero.jpg" alt="Hero" loading="lazy" />

<!-- ✅ Fix: above-the-fold images should be eager (or omit loading attr) -->
<img src="/hero.jpg" alt="Hero" loading="eager" />

<!-- ✅ In Next.js: use priority prop for LCP image -->
<image src="/hero.jpg" alt="Hero" priority width="{1200}" height="{600}" />
```

`loading="lazy"` causes browsers (and Googlebot) to skip the image until it enters the viewport. For above-the-fold content, this delays LCP significantly — directly hurting CWV rankings.

### Anti-Pattern 5: JS-Rendered Canonical / Meta Tags (Race Condition)

```tsx
// ❌ Canonical added by client-side JS
useEffect(() => {
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
}, [canonicalUrl]);

// Problem: Googlebot Tier 1 crawls the raw HTML BEFORE JS executes.
// The canonical is absent in Tier 1. Google may choose a wrong canonical.
// This is especially dangerous for paginated content and filter URLs.

// ✅ Fix: canonical in generateMetadata (server-rendered) or static metadata export
export const metadata: Metadata = {
  alternates: { canonical: "https://example.com/products" },
};
```

### Anti-Pattern 6: Hiding Content with `display:none` Thinking It Won't Index

```html
<!-- ❌ Common misconception -->
<div style="display:none">
  Secret content, duplicate content, or content you want to hide from users
</div>
<!-- Google MAY index this content. It's in the HTML. -->
<!-- Google does apply a discount to hidden content, but does not guarantee ignoring it. -->

<!-- If you genuinely want content excluded from indexing: -->
<!-- Option A: Don't put it in HTML -->
<!-- Option B: Serve it behind authentication (Google can't crawl authed content) -->
<!-- Option C: noindex the entire page if the hidden content causes duplicate issues -->
```

**Related misconception**: `visibility:hidden` and `opacity:0` are also visible to Googlebot. Only content behind authentication or returned in response only after authenticated API calls is reliably not indexed.

---

## Memory Hook / Mnemonic

**🧠 "CRISP-A" — The 6 layers of frontend SEO:**

```
C — Crawlability    (robots.txt, sitemap, status codes)
R — Rendering       (SSR/SSG/ISR not CSR for content)
I — Indexability    (noindex, canonical, no duplicate content)
S — Structured data (JSON-LD, Schema.org, Rich Results)
P — Performance     (LCP < 2.5s, INP < 200ms, CLS < 0.1)
A — Accessibility   (semantic HTML, headings, alt text, anchor text)
```

Nhớ CRISP-A theo thứ tự — đó cũng là thứ tự debug khi site rank kém.

**Bonus mnemonics:**

- **"INP replaced FID March 2024"** → _"In New Performance, FID is Dead (March '24)"_
- **"CrUX not Lighthouse"** → _"Google watches Real Users, not your Mac"_
- **"Canonical must be server-rendered"** → _"If JS renders it, Google misses it"_
- **"hreflang must be bidirectional"** → _"Every locale talks to every other locale"_

---

## Q&A Summary Table / Bảng Tổng Hợp Q&A

| #   | Difficulty | Question                             | Key answer point                                                             |
| --- | ---------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| Q1  | 🟢         | What is SSR and why SEO?             | Two-tier rendering; SSR → Tier 1 indexes immediately                         |
| Q2  | 🟢         | robots.txt vs meta robots?           | robots.txt = crawl control; noindex = index control; disallow ≠ noindex      |
| Q3  | 🟡         | How Googlebot renders React SPA?     | Two tiers; Tier 2 queue = days; Chrome 121+ mobile-first                     |
| Q4  | 🟡         | CWV and what replaced FID?           | LCP/INP/CLS; INP replaced FID March 2024; CrUX 28-day rolling                |
| Q5  | 🟡         | What is canonical and when?          | "Real" URL for duplicates; must be server-rendered, not JS injected          |
| Q6  | 🟡         | JSON-LD vs microdata 2026?           | JSON-LD: decoupled, dynamic, Google recommended                              |
| Q7  | 🔴         | Next.js App Router dynamic metadata? | `generateMetadata()` → server-rendered → Tier 1 readable                     |
| Q8  | 🔴         | Hash routing SEO problem?            | Fragment never sent to server; all hash routes = same URL to Google          |
| Q9  | 🔴         | Debug "good content, poor rank"?     | 7 steps: index? → crawl? → HTML? → CWV → structured data → audit → content   |
| Q10 | 🔴         | i18n SEO (en/vi/ja)?                 | Subdirectory URLs; bidirectional hreflang; `alternates.languages` in Next.js |

---

## Cold Call Simulation / Thực Hành Phỏng Vấn Lạnh

Interviewer nói: _"Tell me about a time you improved SEO on a project you worked on."_

**Strong answer structure** (STAR + technical depth):

> "On [project], we had a React SPA that was getting almost no organic traffic despite having good product content. I investigated using Google Search Console's URL Inspection tool and found that most product pages were either not indexed or indexed with empty content — classic Tier 1 CSR problem.
>
> I proposed migrating the product listing and detail pages to SSR using Next.js. The challenge was that the team had built the entire catalog as client-side data fetching. We first added `generateStaticParams` to pre-render the top 500 products at build time (SSG), and for the long tail, we used SSR with 1-hour revalidation (ISR pattern).
>
> Simultaneously, I added product JSON-LD structured data for each page — price, availability, ratings — and ensured the title/description were dynamic via `generateMetadata`.
>
> Within 6 weeks of deploy, Google Search Console showed indexed page count went from ~50 to ~2,300 for that catalog section. Organic impressions increased 4x over the following 2 months.
>
> The lesson: for e-commerce or any content-critical product, SSR/SSG is table stakes — not an optimization."

**Nếu không có kinh nghiệm thực tế**: Frame it as a hypothetical debugging session you'd run, showing you know the CRISP-A methodology.

---

## Self-Check / Tự Kiểm Tra

Trả lời được những câu sau trước khi phỏng vấn:

- [ ] Explain two-tier Googlebot rendering without prompting
- [ ] State INP threshold (< 200ms) and that it replaced FID in March 2024
- [ ] Describe the difference between robots.txt disallow and meta noindex
- [ ] Write a `generateMetadata` function for a dynamic Next.js route from memory
- [ ] Write a Product JSON-LD schema from memory (at least name, price, availability)
- [ ] Explain why canonical must be server-rendered (not JS-injected)
- [ ] State the hreflang bidirectional rule and what `x-default` is for
- [ ] Debug path: site ranks poorly → what do you check first? (CRISP-A order)
- [ ] Explain why hash routing is an SEO problem and the exact mechanism
- [ ] Explain what CrUX is and why it matters more than Lighthouse for ranking

---

_Bilingual: tất cả khái niệm kỹ thuật có giải thích tiếng Việt trong `🇻🇳 Tóm tắt` blocks. Câu hỏi phỏng vấn có phần Vietnamese explanation trong body answer._
