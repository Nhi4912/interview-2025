# JAMstack Architecture / Kiến Trúc JAMstack

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Next.js Fundamentals](./00-nextjs-fundamentals.md), [Static Site Generators Landscape](./05-static-site-generators-landscape.md), basic CDN / HTTP caching concepts
> **See also**: [App Router & Server Components](./01-app-router-server-components.md) | [Next.js Architecture](./03-nextjs-architecture.md) | [FE System Design](../08-fe-system-design/) | [Static Site Generators Landscape](./05-static-site-generators-landscape.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"An e-commerce client has a WordPress monolith — 80K products, slow checkout, $30K/month hosting. How would you modernise the architecture?"_

Junior sẽ trả lời ngay: _"Rewrite in Next.js."_ Senior Engineer dừng lại: "What parts are slow? What changes frequently — product catalogue or checkout logic? Who writes content? Does the team have a CI/CD pipeline?" Và sau đó trình bày một kiến trúc có cấu trúc:

> "Tôi sẽ tách stack thành ba lớp: (1) **Presentation layer** — Next.js hoặc Astro pre-renders product pages dưới dạng HTML tĩnh, serve từ Cloudflare CDN, TTFB < 50ms. (2) **Content layer** — WordPress migrate sang headless, chỉ exposed qua REST/GraphQL API; content editors vẫn dùng quen thuộc. (3) **Commerce layer** — Shopify Hydrogen hoặc Stripe Checkout cho cart/payment, không một dòng transaction logic nào nằm trong frontend code. Build được trigger bằng webhook mỗi khi product thay đổi; ISR regenerate chỉ page đó, không rebuild toàn bộ 80K trang."

Đây là **JAMstack thinking** — không phải một framework, mà là một **architectural pattern**: pre-render markup, decouple frontend từ backend, serve từ CDN, enhance bằng JavaScript và APIs theo yêu cầu.

Biết JAMstack là Senior signal vì nó phản ánh khả năng thiết kế hệ thống, không chỉ biết dùng framework.

---

## What & Why / Cái Gì & Tại Sao

**JAMstack** = **J**avaScript + **A**PIs + **M**arkup — kiến trúc web trong đó:

- **Markup** được pre-render tại build time (không render tại request time)
- **APIs** xử lý mọi server-side logic qua HTTPS (headless CMS, auth, payments, search)
- **JavaScript** chạy trên client để hydrate, fetch APIs, thêm interactivity

Thuật ngữ được Mathias Biilmann (co-founder Netlify) đặt ra năm 2015, chính thức hoá tại JAMstack Conf 2018. Netlify, Vercel, và Cloudflare Pages đều build business model xung quanh pattern này.

```
Monolithic CMS (WordPress):
User Request → PHP Server → Database query → Template render → HTML → User
                 ↑ runs every request, single point of failure, scales vertically

JAMstack:
Build time: Source content → Framework → Pre-built HTML/JS/CSS assets → CDN
User Request → CDN Edge (nearby) → Pre-built HTML → User
Dynamic needs: Browser → Serverless API function → Response
                            ↑ stateless, scales horizontally, zero cold-start for CDN
```

**Tại sao JAMstack quan trọng?**

→ **Why?** CDN-cached HTML TTFB < 50ms vs WordPress PHP render 200–800ms.
→ **Why?** Không có origin server để hack — attack surface giảm đáng kể (no SQL injection, no server exploit).
→ **Why?** Horizontal scaling tự động qua CDN — không cần load balancer, không cần server provisioning.
→ **Why?** Developer experience tốt hơn: git push → build → deploy, không cần SSH vào server.

---

## Concept Map / Bản Đồ Khái Niệm

```
JAMSTACK ARCHITECTURE 2026
│
├── BUILD PIPELINE (happens once per deploy, not per request)
│   ├── Content Sources
│   │   ├── Headless CMS (Contentful, Sanity, Hygraph, Storyblok, Payload)
│   │   ├── Git-based content (Markdown files, MDX)
│   │   ├── E-commerce APIs (Shopify, Commerce.js)
│   │   └── Data APIs (REST / GraphQL / tRPC)
│   │
│   ├── Build Framework (SSG/Hybrid)
│   │   ├── Next.js (React, ISR, App Router)
│   │   ├── Astro (Islands, zero-JS default) ← see 05-static-site-generators
│   │   ├── SvelteKit, Nuxt 3, Eleventy, Hugo
│   │   └── Gatsby (legacy)
│   │
│   └── Output → Static Assets
│       ├── HTML files (pre-rendered pages)
│       ├── JS bundles (hydration / client interactions)
│       ├── CSS files
│       └── Optimised images / fonts
│
├── DISTRIBUTION LAYER (CDN)
│   ├── Vercel Edge Network (200+ PoPs)
│   ├── Netlify Edge (Deno-based edge functions)
│   ├── Cloudflare Pages + Workers
│   └── AWS CloudFront / Azure CDN (self-managed)
│
├── BROWSER
│   ├── Receives pre-rendered HTML (instant TTFB)
│   ├── Hydrates interactive components (React / Vue / Svelte islands)
│   └── Calls APIs for dynamic data (auth state, cart, search)
│
└── API LAYER (dynamic, stateless, serverless)
    ├── Auth → Auth0, Clerk, Supabase Auth, NextAuth.js
    ├── CMS APIs → Contentful GraphQL, Sanity GROQ, Hygraph
    ├── Commerce → Shopify Storefront API, Stripe Checkout, Snipcart
    ├── Search → Algolia, Meilisearch, Pagefind (static)
    ├── Forms → Netlify Forms, Formspree, custom serverless
    ├── Edge Functions → Vercel Edge, Cloudflare Workers
    └── BFF (Backend for Frontend) → aggregates multiple APIs
```

---

## Comparison Matrix / Bảng So Sánh Kiến Trúc

| Dimension                 | JAMstack (pure)               | Monolithic CMS (WordPress)   | Traditional SSR (Django/Rails) | Edge-first (Cloudflare Workers) |
| ------------------------- | ----------------------------- | ---------------------------- | ------------------------------ | ------------------------------- |
| **Render timing**         | Build time (pre-render)       | Request time (PHP render)    | Request time (server render)   | Request time at edge (< 5ms)    |
| **TTFB**                  | < 50ms (CDN cache)            | 200–800ms (origin server)    | 100–400ms (origin server)      | 10–60ms (edge PoP)              |
| **Scalability**           | Infinite (CDN edge)           | Vertical (bigger server)     | Horizontal (load balancer)     | Infinite (edge workers)         |
| **Dynamic content**       | Via APIs + hydration          | Server-rendered per request  | Server-rendered per request    | Streamed from edge              |
| **Personalisation**       | Hard (needs edge/API)         | Easy (session-based)         | Easy (session-based)           | Easy (edge KV store)            |
| **Auth complexity**       | High (stateless JWTs)         | Low (server sessions)        | Low (server sessions)          | Medium (edge tokens)            |
| **Attack surface**        | Minimal (no origin exposed)   | High (DB, PHP, admin panels) | Medium (origin exposed)        | Medium (edge functions)         |
| **Build pipeline**        | Required (CI/CD)              | Not needed                   | Optional                       | Required for Workers            |
| **Content freshness**     | Stale until rebuild / ISR     | Always fresh                 | Always fresh                   | Always fresh                    |
| **Hosting cost**          | Near-zero (CDN bandwidth)     | High (server + DB + infra)   | Medium (compute + DB)          | Low (per-request pricing)       |
| **CMS editor experience** | Via headless CMS UI           | Native (wp-admin)            | Custom admin or CMS plugin     | Via headless CMS                |
| **Real-time capability**  | Limited (WebSocket via API)   | Native (SSE, WebSocket)      | Native                         | Native (Durable Objects)        |
| **SEO**                   | Excellent (pre-rendered HTML) | Good (rendered HTML)         | Good (rendered HTML)           | Excellent (edge HTML)           |
| **Cold start**            | Zero (static CDN)             | Zero (persistent server)     | Zero (persistent server)       | < 1ms (V8 isolates, no cold)    |
| **Typical use case**      | Marketing, blog, e-commerce   | SMB websites, agencies       | Apps, SaaS, portals            | APIs, personalised edge pages   |

---

## Part 1: The JAM Components in Depth / Ba Thành Phần JAM

### Section 1.1: Markup — Pre-rendering Strategy / Chiến Lược Pre-render

**Pre-rendering** là trái tim của JAMstack. HTML được tạo ra **tại build time**, không tại request time.

```
RENDERING MODE SPECTRUM (JAMstack context):

SSG (Static Site Generation)
  → 100% pre-rendered, deployed to CDN
  → Best: marketing, blogs, docs, product catalogues
  → Limit: stale content until next build

ISR (Incremental Static Regeneration) — Next.js specific
  → Most pages pre-rendered, stale-while-revalidate per page
  → Best: large catalogues, news sites, content that changes infrequently
  → Limit: first request after revalidation window may hit origin

On-Demand Revalidation — Next.js 13+ / App Router
  → Specific paths invalidated via API call (webhook from CMS)
  → Best: editorial workflows where content update = instant re-render
  → Limit: requires webhook infrastructure, CMS integration

DPR (Distributed Persistent Rendering) — Netlify's concept
  → Pages rendered on first request, then cached persistently at CDN
  → Semantically: "build on demand, cache forever until invalidation"
  → Similar to ISR fallback but at infrastructure level

Hybrid (static + server-rendered pages in same app)
  → Next.js App Router: per-page or per-segment rendering mode
  → Some routes static (CDN), some dynamic (origin/edge)
  → Best: apps with mixed content (public static + authenticated dynamic)
```

**Điểm mấu chốt cho interview**: JAMstack không có nghĩa là "chỉ SSG". Modern JAMstack = **hybrid rendering** — chọn đúng rendering mode cho mỗi route.

---

### Section 1.2: APIs — The Decoupled Backend / Backend Phân Tách

Trong JAMstack, mọi server-side operation đều thông qua API. Không có server-side code trong presentation layer (ngoại trừ edge functions).

**API patterns trong JAMstack:**

```
REST APIs:
  → Most compatible, well-understood, stateless
  → Headless CMS: Contentful REST, Strapi REST
  → Payment: Stripe REST API

GraphQL APIs:
  → Single endpoint, client specifies data shape
  → Headless CMS: Contentful GraphQL, Hygraph (GraphQL-native), Hasura
  → Reduces over-fetching for complex content relationships

tRPC:
  → Type-safe RPC between Next.js Server Actions / Route Handlers and client
  → No schema definition needed — TypeScript types are the contract
  → Best for: full-stack Next.js where frontend and API share monorepo

BFF (Backend for Frontend) pattern:
  → Thin API layer owned by frontend team
  → Aggregates multiple APIs (CMS + auth + commerce) into one call
  → Implemented as: Next.js Route Handlers, Netlify Functions, Cloudflare Workers
  → Prevents: credential exposure, N+1 fetches, CORS issues from browser

Edge Functions:
  → JavaScript/Wasm running at CDN edge (Vercel Edge, Cloudflare Workers)
  → Use for: auth token validation, personalisation, A/B testing, redirects
  → Limit: no Node.js APIs, no filesystem, limited execution time
```

**Ví dụ BFF aggregating multiple sources:**

```typescript
// app/api/product/[slug]/route.ts — Next.js Route Handler as BFF
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  // Aggregate: CMS data + inventory + pricing in parallel
  const [product, inventory, pricing] = await Promise.all([
    fetch(`https://api.contentful.com/entries?fields.slug=${params.slug}`, {
      headers: { Authorization: `Bearer ${process.env.CONTENTFUL_TOKEN}` },
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    }).then((r) => r.json()),

    fetch(`${process.env.INVENTORY_API}/stock/${params.slug}`).then((r) => r.json()),

    fetch(`${process.env.PRICING_API}/price/${params.slug}`).then((r) => r.json()),
  ]);

  return NextResponse.json({
    title: product.items[0].fields.title,
    inStock: inventory.quantity > 0,
    price: pricing.amount,
  });
}
```

---

### Section 1.3: JavaScript — Progressive Enhancement / Tăng Cường Dần

JavaScript trong JAMstack là **progressive enhancement** — trang hoạt động không có JS (HTML pre-rendered), JS chỉ thêm interactivity.

```
JAMstack JS roles:
1. Hydration — attach event handlers to server-rendered HTML
2. API calls — fetch dynamic data (cart state, auth, search results)
3. Client-side routing — SPA navigation after initial load (optional)
4. Real-time updates — WebSocket or SSE connections to APIs
5. Forms — intercept submissions, POST to serverless functions

What JS does NOT do in JAMstack:
- Generate HTML on server for regular page requests
- Query database directly
- Manage server sessions
- Handle file uploads directly (delegate to S3/Cloudinary API)
```

---

## Part 2: Build Pipeline / Quy Trình Build

### Section 2.1: Source → Build → Deploy

```
FULL BUILD PIPELINE:

1. CONTENT CHANGE TRIGGER
   └── CMS editor saves content → webhook fires to build service
       OR: Developer git push → CI/CD pipeline triggers

2. BUILD PHASE
   ├── Framework pulls content from all sources (CMS APIs, local files, databases)
   ├── Runs SSG/ISR: renders HTML for each route
   ├── Bundles JavaScript (Webpack/Turbopack/Vite/esbuild)
   ├── Optimises images (next/image, @astrojs/image, sharp)
   ├── Generates sitemap, RSS, OG images
   └── Outputs: dist/ or .next/ directory of static assets

3. DEPLOY PHASE
   ├── Upload static assets to CDN (Vercel / Netlify / Cloudflare Pages)
   ├── Atomic deployment: new version live only after full upload
   ├── Old version kept for instant rollback
   └── Cache invalidation at CDN edges worldwide

4. RUNTIME (no persistent server)
   ├── Requests: CDN serves pre-built HTML from nearest PoP
   ├── Dynamic: Browser calls Serverless/Edge Functions
   └── Revalidation: ISR/on-demand regenerates specific pages, not full rebuild
```

### Section 2.2: Webhooks and On-Demand Revalidation / Webhook và Revalidation Theo Yêu Cầu

Đây là cơ chế cho phép JAMstack site cập nhật content mà không cần rebuild toàn bộ — câu hỏi senior quan trọng.

```
WEBHOOK FLOW (Content CMS → Next.js on-demand revalidation):

1. Editor publishes article in Contentful
2. Contentful sends POST webhook to:
   https://yoursite.com/api/revalidate?secret=WEBHOOK_SECRET
3. Next.js Route Handler receives webhook
4. Calls revalidatePath('/blog/new-article-slug')
5. Next.js marks that page's cache as stale
6. Next request to /blog/new-article-slug → re-renders, caches fresh HTML
7. Subsequent requests → CDN serves fresh HTML
```

```typescript
// app/api/revalidate/route.ts — On-demand revalidation endpoint
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, contentType } = body;

  if (contentType === "blogPost") {
    // Revalidate specific path
    revalidatePath(`/blog/${slug}`);
    // Also revalidate listing pages tagged with 'blog'
    revalidateTag("blog-list");
  } else if (contentType === "product") {
    revalidatePath(`/products/${slug}`);
    revalidateTag("products");
  }

  return NextResponse.json({ revalidated: true, slug });
}
```

**Incremental builds** (Netlify / Gatsby Cloud concept):

```
Traditional full rebuild:
  80K pages × 150ms each = 3.3 hours

Incremental build:
  Only changed pages re-rendered
  1 article update → 1 page rebuilt → 0.15 seconds
  Deploy delta, not full site
```

---

## Part 3: Headless CMS Landscape / Cảnh Quan Headless CMS

> **Note**: Đây là API layer — _choosing_ SSG/framework is covered in [05-static-site-generators-landscape.md](./05-static-site-generators-landscape.md). Phần này focus vào content modeling và CMS architecture.

Headless CMS cung cấp **content as a service** — UI cho editors, API cho developers.

| CMS         | Model         | API type       | Best for                                    | Vietnamese market presence |
| ----------- | ------------- | -------------- | ------------------------------------------- | -------------------------- |
| Contentful  | SaaS, hosted  | REST + GraphQL | Enterprise, multi-locale, high availability | Grab VN, large enterprises |
| Sanity      | SaaS + Studio | GROQ + REST    | Custom content models, real-time collab     | Agencies, startups         |
| Hygraph     | SaaS          | GraphQL-native | Complex content graphs, federation          | Mid-size companies         |
| Storyblok   | SaaS          | REST           | Visual editor, components in CMS            | Marketing-heavy teams      |
| Strapi      | Self-hosted   | REST + GraphQL | Full control, on-premise requirement        | VN companies, compliance   |
| Payload CMS | Self-hosted   | REST + GraphQL | Code-first schema, TypeScript-native        | Dev-heavy teams (new 2023) |
| Decap CMS   | Git-based     | Git commits    | Static sites, no CMS backend needed         | Simple blogs, docs         |
| Ghost       | Self-hosted   | REST           | Publication/blog-centric, built-in theme    | Media, newsletters         |

**Content modeling patterns:**

```
CONTENTFUL EXAMPLE — E-commerce product:

Content Type: Product
Fields:
  - title: Short text (required)
  - slug: Short text (unique, required) ← used as URL path
  - description: Rich text
  - price: Number
  - images: Media (multiple)
  - categories: References → [Category] (many-to-many)
  - metadata: JSON (SEO, OG image)

Next.js usage:
  // app/products/[slug]/page.tsx
  export async function generateStaticParams() {
    const products = await fetchAllProductSlugs(); // from Contentful
    return products.map(p => ({ slug: p.slug }));
  }

  export default async function ProductPage({ params }) {
    const product = await fetchProduct(params.slug);
    // ...
  }
```

**Content preview workflow** — câu hỏi senior quan trọng:

```
PREVIEW MODE (Next.js Draft Mode):

Problem: Editor makes changes in CMS → wants to see them BEFORE publishing
         But site is pre-rendered from published content only

Solution: Draft Mode
  1. CMS Preview button hits /api/draft?secret=TOKEN&slug=/products/widget
  2. Route Handler validates secret, calls draftMode().enable()
  3. Sets a cookie: __prerender_bypass
  4. Redirects to /products/widget
  5. Next.js detects draft cookie → bypasses ISR cache → fetches DRAFT content
  6. Editor sees live preview of unpublished content

// app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  draftMode().enable();
  redirect(slug ?? '/');
}
```

---

## Part 4: Dynamic Capabilities / Khả Năng Động

### Section 4.1: Authentication in JAMstack / Xác Thực Trong JAMstack

Auth là điểm khó nhất của JAMstack — không có server session, phải dùng tokens.

```
JAMSTACK AUTH FLOW (JWT-based):

1. User clicks "Login" → redirected to Auth Provider (Auth0, Clerk)
2. Auth Provider authenticates → returns JWT token
3. Browser stores token (httpOnly cookie recommended, NOT localStorage)
4. Browser includes token in API calls: Authorization: Bearer <token>
5. Serverless function / Edge Function validates JWT
6. Returns protected data or 401

PROVIDERS COMPARISON:
  Auth0:   Enterprise-grade, high customisation, expensive at scale
  Clerk:   Next.js-native, easy setup, pre-built UI components
  Supabase Auth: Open source, integrates with Supabase DB, PostgreSQL RLS
  NextAuth.js (Auth.js): Framework-native, 40+ providers, self-hosted
  Firebase Auth: Google ecosystem, generous free tier
```

```typescript
// middleware.ts — Edge-based auth guard (Next.js)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Protect /dashboard/* routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Pass user info to page via header
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub as string);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

---

### Section 4.2: E-commerce on JAMstack / Thương Mại Điện Tử Trên JAMstack

E-commerce là use case phổ biến nhất và phức tạp nhất của JAMstack.

```
E-COMMERCE ARCHITECTURE LAYERS:

Presentation (pre-rendered):
  → Product listing pages (SSG + ISR)
  → Product detail pages (SSG + on-demand revalidation)
  → Category / collection pages (SSG + ISR)

Dynamic (client-side + serverless):
  → Cart state (localStorage / Zustand / server session)
  → Inventory check (real-time API call on PDP)
  → Checkout (Stripe Checkout redirect / embedded)
  → Order confirmation (serverless function + email)
  → User account / order history (protected by auth)

PLATFORM OPTIONS:
  Shopify Hydrogen:  React-based, Shopify Storefront API, Vercel/O2 hosting
  Commerce.js:       Headless-first, agnostic frontend, powerful APIs
  Snipcart:          Drop-in JS widget, minimal backend, works with any SSG
  Stripe Checkout:   Direct integration, hosted payment page, simplest flow
  Medusa.js:         Open-source Shopify alternative, self-hosted
```

```typescript
// Example: Snipcart product (works with any HTML/SSG)
// app/products/[slug]/page.tsx

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  return (
    <main>
      <h1>{product.title}</h1>
      <p>${product.price}</p>

      {/* Snipcart add-to-cart button — zero custom backend needed */}
      <button
        className="snipcart-add-item"
        data-item-id={product.id}
        data-item-price={product.price}
        data-item-url={`/products/${product.slug}`}
        data-item-name={product.title}
        data-item-image={product.image}
      >
        Add to Cart
      </button>
    </main>
  );
}
```

---

### Section 4.3: Search / Tìm Kiếm

Search là capability thường cần integration bên ngoài trong JAMstack.

```
SEARCH OPTIONS:

Algolia:
  → Hosted search-as-a-service, sub-10ms search
  → Instant search UI components (InstantSearch.js)
  → Index products/content at build time via integration
  → Cost: free tier → expensive at scale
  → Best: e-commerce, large content sites

Meilisearch:
  → Open source, self-hosted or Cloud version
  → Typo-tolerant, fast, simple API
  → Best: teams wanting Algolia-like DX without vendor lock-in

Pagefind:
  → Static search library — RUNS ENTIRELY IN BROWSER
  → No server, no external service, no API key
  → Index generated at build time, served as static files
  → Best: documentation sites, blogs (< 50K pages)
  → How: pagefind CLI scans dist/ → creates search index as WASM + JSON shards

// Pagefind integration (Hugo, Astro, Eleventy)
// Step 1: npx pagefind --site dist/ (runs after build)
// Step 2: Add to page:
<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
  new PagefindUI({ element: "#search" });
</script>
```

---

### Section 4.4: Forms / Biểu Mẫu

Forms là thách thức JAMstack kinh điển — HTML `<form action="/submit">` cần server.

```
FORM OPTIONS:

Netlify Forms:
  → Add data-netlify="true" to <form> → Netlify intercepts at CDN level
  → Zero backend code, spam filtering built-in
  → Limit: Netlify-only, limited custom logic

Formspree:
  → POST to formspree.io endpoint — they handle storage + email
  → Works with any hosting (not Netlify-specific)

Custom serverless (recommended for production):
  → POST to Next.js Route Handler / Cloudflare Worker
  → Full control: validate, store to DB, send email (Resend/SendGrid)
  → Integrate with CRM (HubSpot, Salesforce)

// Custom form handler — Next.js Route Handler
// app/api/contact/route.ts
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = ContactSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 });
  }

  await resend.emails.send({
    from: 'contact@yourdomain.com',
    to: 'team@yourdomain.com',
    subject: `New contact from ${result.data.name}`,
    text: result.data.message,
  });

  return Response.json({ success: true });
}
```

---

## Part 5: Hosting Platforms / Nền Tảng Hosting

Ba platform chính cho JAMstack — mỗi cái có DX trade-offs khác nhau:

| Feature                         | Vercel                              | Netlify                             | Cloudflare Pages                     |
| ------------------------------- | ----------------------------------- | ----------------------------------- | ------------------------------------ |
| **Primary audience**            | Next.js teams                       | Framework-agnostic JAMstack         | Cloudflare ecosystem users           |
| **CDN PoPs**                    | 100+                                | 100+                                | 200+ (largest network)               |
| **Edge runtime**                | Vercel Edge Functions (V8)          | Netlify Edge Functions (Deno)       | Cloudflare Workers (V8)              |
| **Next.js support**             | Native, first-class                 | Via @netlify/next adapter           | Via next-on-pages adapter            |
| **ISR support**                 | Native                              | Via On-Demand Builders              | Via Workers KV cache                 |
| **Build speed**                 | Fast (Turbopack)                    | Parallel builds                     | Fast (Wrangler)                      |
| **Free tier limits**            | 100GB bandwidth, limited serverless | 100GB bandwidth, 125K serverless/mo | Unlimited bandwidth, 100K Worker/day |
| **KV / DB offering**            | Vercel KV, Postgres, Blob           | Netlify Blobs (2024)                | KV, D1 (SQLite), R2 (S3-compat)      |
| **Analytics**                   | Web Analytics (real-time)           | Analytics add-on                    | Cloudflare Analytics (free)          |
| **Preview deployments**         | Every PR/branch                     | Every PR/branch                     | Every PR/branch                      |
| **Custom domains / SSL**        | Auto SSL (Let's Encrypt)            | Auto SSL                            | Auto SSL + Cloudflare proxy          |
| **DX for non-Next apps**        | Good (but Next-optimised)           | Excellent (framework-agnostic)      | Good (Workers-centric)               |
| **Pricing at scale**            | Expensive for high traffic          | Mid-range                           | Most cost-effective for high traffic |
| **Vietnamese company adoption** | Grab, Tiki, early-stage startups    | Agencies, indie devs                | Growing: Zalo infra, cost-conscious  |

---

## Part 6: MACH / Composable Architecture / Kiến Trúc MACH

Modern JAMstack đã **evolved** thành **MACH architecture** — buzzword quan trọng ở enterprise level:

```
MACH = Microservices + API-first + Cloud-native + Headless

Microservices:
  → Each capability is a separate, independently deployable service
  → CMS is separate from auth is separate from commerce is separate from search
  → No monolithic coupling

API-first:
  → Every service exposes an API (REST, GraphQL, gRPC)
  → Frontend consumption is first-class, not an afterthought
  → Any frontend (web, mobile, kiosk, voice) can consume same APIs

Cloud-native:
  → Services run on managed cloud infrastructure (AWS, GCP, Azure)
  → Auto-scaling, serverless functions, managed databases
  → No ops team managing servers manually

Headless:
  → Presentation layer (frontend) is completely decoupled
  → Same APIs serve web, iOS, Android, smart TV
  → Frontend teams deploy independently from backend teams
```

**JAMstack vs MACH — relationship:**

```
JAMstack (2015) → Pattern focused on frontend delivery
  → Pre-rendered HTML + APIs + JavaScript

MACH (2019+) → Enterprise framework for entire architecture
  → Encompasses backend, infrastructure, AND frontend delivery
  → JAMstack is the "frontend execution" of MACH's Headless principle

Composable Commerce (2022+) → Specific to retail/e-commerce MACH
  → Best-of-breed: Commercetools (commerce) + Contentful (CMS) +
     Algolia (search) + Auth0 (auth) + Stripe (payments)
  → Each vendor replaceable independently — no platform lock-in
```

---

## Part 7: Evolution Timeline / Lịch Sử Tiến Hoá

```
JAMstack EVOLUTION:

2015 — Term coined by Mathias Biilmann (Netlify)
  → Static HTML + JavaScript + CDN deployment
  → Jekyll, Hugo, Hexo — pure static generators

2017 — Gatsby popularises JAMstack for React developers
  → GraphQL data layer, React component model
  → "Everything fetched at build time" dogma

2019 — Netlify introduces On-Demand Builders
  → Pages built on first request, cached persistently
  → Solves "cannot pre-build 1M pages" problem
  → Pre-cursor to ISR

2020 — Next.js 9.5: ISR (Incremental Static Regeneration)
  → Stale-while-revalidate at page level
  → JAMstack can now handle content that updates frequently

2021 — Astro, SvelteKit bring Islands Architecture
  → Zero-JS-by-default, opt-in hydration
  → JAMstack for content sites gets much lighter

2022 — Next.js App Router beta; Edge Runtime; Composable/MACH adoption grows
  → Server Components blur SSR/SSG boundary
  → Edge rendering: sub-10ms from anywhere

2023–2024 — On-demand revalidation matures; Vercel/Cloudflare compete on edge
  → Distributed Persistent Rendering (DPR) at industry scale
  → Partial Prerendering (PPR) in Next.js 14+: static shell + dynamic streaming

2025–2026 — Hybrid is the norm; "JAMstack" as term fades, composable architecture grows
  → Most Next.js apps use hybrid rendering: static + ISR + edge + server
  → React Server Components + Suspense streaming = server-JAMstack hybrid
  → AI-generated content APIs integrate with headless CMS workflows
```

**Partial Prerendering (PPR) — the frontier:**

```typescript
// Next.js 14+ PPR: static shell streams, dynamic parts load async
// next.config.js
const nextConfig = {
  experimental: { ppr: true },
};

// app/product/[slug]/page.tsx
import { Suspense } from "react";
import { ProductDetails } from "./ProductDetails"; // static
import { InventoryBadge } from "./InventoryBadge"; // dynamic
import { CartButton } from "./CartButton"; // dynamic

export default function ProductPage({ params }) {
  return (
    // Static shell pre-rendered, served from CDN immediately
    <div>
      <ProductDetails slug={params.slug} />

      {/* Dynamic parts stream in — don't block initial HTML */}
      <Suspense fallback={<span>Checking stock...</span>}>
        <InventoryBadge slug={params.slug} />
      </Suspense>

      <Suspense fallback={<button disabled>Loading...</button>}>
        <CartButton slug={params.slug} />
      </Suspense>
    </div>
  );
}
```

---

## Part 8: Limitations and When NOT to Use JAMstack / Giới Hạn và Khi Nào Không Dùng

Đây là **senior signal** — biết trade-offs là quan trọng hơn biết advantages.

```
WHEN JAMSTACK STRUGGLES:

1. REAL-TIME APPLICATIONS
   → Chat apps, collaborative editors, live dashboards
   → Pre-rendering doesn't help when data changes every second
   → Better: WebSocket-native servers (Elixir/Phoenix, Node.js Socket.io)
   → Hybrid: JAMstack shell + WebSocket for live data (viable but complex)

2. HEAVY PERSONALISATION
   → Homepage that is 100% different per user (ad targeting, recommendations)
   → Pre-rendered HTML is the same for all → must be replaced entirely on client
   → Workaround: Edge rendering (Vercel Edge, Cloudflare Workers) can personalise at CDN
   → Workaround cost: loses CDN caching benefit for personalised routes

3. COMPLEX AUTH FLOWS / MULTI-TENANT SAAS
   → Apps where every page requires auth check, dynamic permissions
   → Every request needs server-side JWT validation
   → JAMstack can do it (middleware + edge functions) but adds complexity
   → Often better: traditional SSR with session management (Next.js RSC + server)

4. LARGE CATALOGUE WITH FREQUENT UPDATES
   → 500K product SKUs updated hourly → cannot pre-build all pages
   → ISR helps but adds latency on first request per product per region
   → Better: SSR with aggressive CDN caching + cache-control headers

5. COMPLEX FORM WORKFLOWS
   → Multi-step wizards with server-side state, file uploads, progress
   → More natural in SSR with server sessions than in stateless serverless
   → JAMstack solution exists (S3 for files, KV for state) but is complex

6. VERY HIGH WRITE THROUGHPUT
   → Apps where users submit data constantly (social media, forums)
   → Serverless functions have cold start latency, concurrency limits
   → Better: persistent server with connection pooling (Node.js, Go)
```

---

## Part 9: Performance Benefits / Lợi Ích Hiệu Năng

```
PERFORMANCE NUMBERS (typical real-world):

Monolithic WordPress (unoptimised):
  TTFB: 400–800ms (PHP + MySQL round trip)
  LCP: 3–6s (depends on hosting)
  Lighthouse Performance: 40–70

Same site on JAMstack (Vercel CDN):
  TTFB: 20–50ms (CDN edge serves pre-built HTML)
  LCP: 1–2s (LCP image optimised via next/image)
  Lighthouse Performance: 90–100

WHY CDN TTFB IS SO FAST:
  1. No compute — pure file serving from RAM/SSD cache
  2. Geographically distributed — user hits PoP < 50ms away
  3. HTTP/3 + QUIC on modern CDNs — 0-RTT connection reuse
  4. Pre-compressed assets (Brotli) — smaller transfer size

SECURITY SURFACE REDUCTION:
  Monolith: exposed PHP runtime, MySQL port, wp-admin panel,
            server SSH, OS vulnerabilities, plugin exploits

  JAMstack: CDN serves files only — no executable code at edge
            APIs are serverless: no persistent process to exploit
            Secrets stay in build environment, not in served code
            Result: attack surface reduced by ~80%

SCALABILITY:
  WordPress viral traffic: needs auto-scaling, load balancer, DB caching
  JAMstack viral traffic: CDN handles it — same cost whether 100 or 1M req/min
```

---

## Part 10: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: What does JAM stand for and who coined the term? / JAM là viết tắt của gì và ai đặt ra thuật ngữ này?

**A:**

JAM stands for **JavaScript, APIs, and Markup**.

- **JavaScript** — handles dynamic functionality in the browser (event handlers, fetching API data, interactivity)
- **APIs** — all server-side logic is abstracted into reusable APIs accessed over HTTPS (headless CMS, auth services, payment processors)
- **Markup** — HTML pre-rendered at build time, not generated per request

The term was coined by **Mathias Biilmann**, CEO and co-founder of Netlify, around 2015–2016. It was formally presented at various conferences and gained mainstream adoption following the JAMstack Conf events (starting 2018). The core insight was that a new category of web architecture had emerged — distinct from traditional LAMP stacks, different from server-rendered SPA backends — that needed a name and a community.

The original manifesto at jamstack.org defined best practices: serve over CDN, atomic deploys, instant cache invalidation, everything in version control.

> 🇻🇳 **Tóm tắt**: JAM = **J**avaScript + **A**PIs + **M**arkup. Được Mathias Biilmann (CEO Netlify) đặt ra khoảng 2015–2016. JavaScript xử lý interactivity trên browser; APIs xử lý mọi server-side logic (CMS, auth, payment); Markup là HTML được pre-render tại build time, không phải request time. Serve từ CDN thay vì origin server là nguyên tắc cốt lõi.

**💡 Interview Signal:**

- ✅ Strong: Names Mathias Biilmann + Netlify as origin, explains all three letters with concrete examples, connects to CDN-first delivery principle
- ❌ Weak: "JAM is JavaScript, API, and Markup" without explaining WHY or who coined it — shows surface-level knowledge only

---

### 🟢 Q2: What are the core performance benefits of JAMstack over a WordPress monolith? / Lợi ích hiệu năng cốt lõi của JAMstack so với WordPress monolith là gì?

**A:**

Three compounding performance advantages:

**1. TTFB (Time to First Byte) from CDN vs origin server.**
A JAMstack site serves pre-built HTML from the CDN edge node nearest to the user. Typical TTFB: 20–50ms. WordPress must execute PHP, query MySQL, render a template, and return HTML — typical TTFB: 200–800ms. The entire PHP + DB round trip is eliminated for every page view.

**2. No cold starts on page load.**
CDN file serving has zero compute overhead — the file is already built. WordPress plugins, PHP opcache warm-up, and database connection pooling all add latency that varies unpredictably under load.

**3. Infinite horizontal scalability.**
Traffic spikes on a WordPress site require auto-scaling servers, load balancers, and database read replicas. A JAMstack site under the same traffic spike: the CDN handles it transparently — the same bandwidth cost per request regardless of concurrent users. A blog post going viral on JAMstack is a non-event; on WordPress it can take down the server.

Bonus: smaller attack surface (no PHP runtime exposed, no database port accessible) improves both security and availability.

> 🇻🇳 **Tóm tắt**: Ba lợi ích chính: (1) **TTFB từ CDN** — 20–50ms vs WordPress 200–800ms vì không cần PHP render + DB query. (2) **Zero cold start** — file tĩnh trên CDN không có overhead compute. (3) **Scale vô hạn** — CDN xử lý traffic spike tự động, WordPress cần auto-scaling server + load balancer. Bonus: attack surface nhỏ hơn đáng kể.

**💡 Interview Signal:**

- ✅ Strong: Gives concrete TTFB numbers, explains the scalability story (CDN handles spikes automatically), mentions security surface reduction
- ❌ Weak: "It's faster because it's static" — too vague, shows no understanding of WHY or the mechanism

---

### 🟡 Q3: How does Incremental Static Regeneration (ISR) solve JAMstack's "stale content" problem? / ISR giải quyết vấn đề "nội dung cũ" của JAMstack như thế nào?

**A:**

The core JAMstack limitation: pre-rendered HTML is **frozen at build time**. Update an article → nothing changes on the site until next full rebuild. For a blog that deploys once a day, this is fine. For a news site publishing 50 articles/hour, rebuilding the entire site for each article is impractical.

**ISR (Incremental Static Regeneration)** — introduced in Next.js 9.5 — solves this with a **stale-while-revalidate** model at the page level:

```typescript
// app/news/[slug]/page.tsx
async function NewsPage({ params }) {
  const article = await fetch(`/api/articles/${params.slug}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  // ...
}
```

Behaviour:

1. First request: page is not in cache → render and cache (becomes "static")
2. Subsequent requests within 60s: serve cached HTML (CDN-fast)
3. After 60s: next request serves stale HTML immediately, triggers background re-render
4. After background re-render completes: new requests get fresh HTML

**On-demand revalidation** (Next.js 13+) is the superior model for editorial workflows:

```typescript
// CMS webhook → call this endpoint
revalidatePath("/news/breaking-story-slug"); // instant, no polling needed
```

The key insight: ISR makes JAMstack viable for content that changes frequently — it is **not a compromise**, it is a first-class feature of the architecture. You get CDN speed 99% of the time, with content freshness controlled per-route.

> 🇻🇳 **Tóm tắt**: Vấn đề: HTML pre-render bị "đóng băng" tại build time. ISR giải quyết bằng **stale-while-revalidate**: sau khoảng thời gian revalidate, request tiếp theo nhận HTML cũ ngay lập tức (CDN-fast) đồng thời trigger render lại ở background. Request tiếp theo nhận HTML mới. On-demand revalidation (Next.js 13+) tốt hơn: CMS webhook gọi `revalidatePath()` → page được invalidate ngay lập tức, không cần polling theo interval.

**💡 Interview Signal:**

- ✅ Strong: Explains stale-while-revalidate behavior precisely (stale served + background rerender), distinguishes time-based ISR from on-demand revalidation, knows `revalidatePath` / `revalidateTag` API
- ❌ Weak: "ISR rebuilds the page every X seconds" — incorrect; it only rebuilds when a request comes in after the revalidation window, not on a timer

---

### 🟡 Q4: What is the BFF (Backend for Frontend) pattern and why is it important in JAMstack? / BFF pattern là gì và tại sao quan trọng trong JAMstack?

**A:**

In JAMstack, the browser directly calls multiple APIs — headless CMS, auth service, payment provider, inventory API. Without coordination, this creates several problems:

1. **N+1 fetch problem** — product page makes 4 separate API calls (CMS, inventory, pricing, reviews) → waterfalls, multiple round trips
2. **CORS exposure** — API keys and endpoints exposed in browser network tab
3. **Over-fetching** — CMS returns 50 fields, frontend needs 5
4. **Coupling** — if CMS provider changes, every frontend component must update

**BFF pattern** introduces a thin server-side aggregation layer owned by the frontend team:

```
Without BFF:
Browser → Contentful API (auth key in browser)
Browser → Inventory API
Browser → Pricing API
Browser → Reviews API
(4 round trips, exposed API keys, waterfalls)

With BFF:
Browser → /api/product/[slug] (BFF — Next.js Route Handler)
               ↓ parallel fetches (server-to-server, fast)
       Contentful API | Inventory API | Pricing API | Reviews API
               ↓ aggregates
            { title, inStock, price, reviewCount }
(1 round trip, secrets server-side, minimal payload)
```

In JAMstack specifically, the BFF is typically implemented as:

- Next.js Route Handlers (`app/api/*/route.ts`)
- Netlify/Vercel serverless functions
- Cloudflare Workers

The BFF acts as the stable contract between frontend and the ever-changing API landscape behind it.

> 🇻🇳 **Tóm tắt**: BFF (Backend for Frontend) là thin API layer do frontend team sở hữu, đứng giữa browser và multiple backend APIs. Thay vì browser gọi 4 APIs riêng (với key bị expose), browser gọi 1 BFF endpoint → BFF fetch song song từ tất cả services → trả về dữ liệu đã được aggregate. Lợi ích: API keys ẩn server-side, giảm round trips, giảm coupling. Trong Next.js: implement bằng Route Handlers.

**💡 Interview Signal:**

- ✅ Strong: Names the N+1 / waterfall problem, security benefit (secrets server-side), explains it as frontend-team-owned layer, gives concrete implementation (Route Handlers / serverless)
- ❌ Weak: "BFF is an API gateway" — confuses with infrastructure-level API gateway (Kong, AWS API GW); BFF is a thin app-layer concern, not infrastructure

---

### 🟡 Q5: How would you implement authentication in a JAMstack app? What are the trade-offs? / Implement authentication trong JAMstack app như thế nào? Trade-offs là gì?

**A:**

JAMstack auth is **stateless by nature** — no persistent server session. The approach is JWT-based with a dedicated auth provider:

**Recommended flow with Clerk or Auth0:**

```typescript
// 1. User logs in → auth provider returns JWT
// 2. Store JWT in httpOnly cookie (NOT localStorage — XSS risk)
// 3. Edge middleware validates JWT on every protected request

// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/products/(.*)", "/blog/(.*)"],
  // All other routes require auth
});
```

**Trade-offs compared to session-based SSR auth:**

| Aspect                | JAMstack (JWT / auth provider)          | Traditional SSR (server sessions)     |
| --------------------- | --------------------------------------- | ------------------------------------- |
| Scalability           | Stateless → scales horizontally         | Session store needed (Redis) at scale |
| Revocation            | Hard — JWT valid until expiry           | Easy — delete session from store      |
| Cold start            | Edge validation < 1ms                   | Session store network round trip      |
| Implementation effort | High (token management, refresh flows)  | Low (framework-native sessions)       |
| Multi-device logout   | Requires token blacklist infrastructure | Delete all sessions trivially         |
| Vendor cost           | Auth0/Clerk adds $$ at scale            | Self-managed, free                    |

**When JAMstack auth struggles:**

- Instant token revocation (e.g., "logout all devices" is complex)
- Very complex RBAC with fine-grained server-side permission checks
- Apps where every page is personalised per-user → loses CDN caching benefit

**For these cases**: hybrid — use Next.js App Router with proper server sessions via `next-auth` and a database adapter.

> 🇻🇳 **Tóm tắt**: JAMstack auth = stateless JWT, thường dùng provider (Clerk, Auth0, Supabase Auth). Flow: login → JWT trong httpOnly cookie → middleware Edge validates JWT → serve protected content. Trade-off: JWT khó revoke ngay lập tức (phải đợi hết expiry), khó multi-device logout. Session-based SSR dễ revoke hơn nhưng cần session store (Redis). Với apps phức tạp → NextAuth + database adapter + Next.js server là pragmatic hơn.

**💡 Interview Signal:**

- ✅ Strong: Knows to use httpOnly cookie (not localStorage), explains JWT revocation problem, mentions edge middleware, gives trade-off table, recommends hybrid for complex cases
- ❌ Weak: "Store JWT in localStorage" — security anti-pattern; or "JAMstack can't do auth" — wrong, it can, just differently

---

### 🟡 Q6: What is the headless CMS content preview workflow for editors? / Content preview workflow cho editors trong headless CMS là gì?

**A:**

This is a critical UX problem in JAMstack: editors update content in the CMS, but the site shows old pre-rendered HTML. Editors need to preview changes **before publishing**.

**Next.js Draft Mode solution:**

```typescript
// Step 1: CMS preview button calls:
// https://yoursite.com/api/draft?secret=PREVIEW_SECRET&slug=/blog/new-post

// Step 2: app/api/draft/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("secret") !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  draftMode().enable(); // Sets __prerender_bypass cookie
  redirect(searchParams.get("slug") ?? "/");
}

// Step 3: In the page component, check draftMode
// app/blog/[slug]/page.tsx
import { draftMode } from "next/headers";

export default async function BlogPost({ params }) {
  const { isEnabled } = draftMode();

  // Fetch draft OR published content based on mode
  const post = await fetchPost(params.slug, {
    preview: isEnabled, // Contentful/Sanity support preview flag
  });

  return (
    <article>
      {isEnabled && <DraftBanner />} {/* Visual indicator for editors */}
      <h1>{post.title}</h1>
      {/* ... */}
    </article>
  );
}
```

**Full workflow:**

1. Editor makes changes in Contentful/Sanity (saves as draft, not published)
2. Clicks "Preview" button in CMS — configured URL hits `/api/draft?secret=...&slug=...`
3. Next.js sets `__prerender_bypass` cookie
4. Redirects to the actual page
5. Page fetches **draft** content from CMS (bypasses ISR cache)
6. Editor sees live preview with a "DRAFT" banner
7. Editor publishes → CMS fires webhook → `revalidatePath()` → production updates

**Headless CMS preview banner (good practice):**
Always show a visible indicator that this is a preview — editors have accidentally shared preview URLs with customers in the past.

> 🇻🇳 **Tóm tắt**: Vấn đề: editors update CMS nhưng site vẫn hiện HTML cũ. Giải pháp: **Next.js Draft Mode** — CMS "Preview" button gọi endpoint đặc biệt, endpoint set cookie `__prerender_bypass`, redirect đến page. Page detect cookie → fetch DRAFT content từ CMS (bypass ISR cache). Editor thấy preview đúng content. Sau khi publish: webhook → `revalidatePath()` → production cập nhật. Luôn show "DRAFT" banner để editors biết đang xem bản nháp.

**💡 Interview Signal:**

- ✅ Strong: Knows Draft Mode (not legacy "preview mode"), explains the cookie bypass mechanism, describes the full editorial workflow from edit to publish, mentions showing a draft banner
- ❌ Weak: "Just add `?preview=true` to URL" — no security, no mechanism; or "editors have to wait for rebuild" — shows unfamiliarity with preview workflows

---

### 🔴 Q7: How has JAMstack evolved into composable / MACH architecture, and what is the significance? / JAMstack đã tiến hoá thành composable/MACH architecture như thế nào?

**A:**

JAMstack started as a **frontend delivery pattern** (2015) — pre-render HTML, serve from CDN. Over time, the industry recognised that the same philosophy (decouple, API-first, best-of-breed) should apply to the **entire stack**, not just the frontend.

**MACH architecture** (Microservices + API-first + Cloud-native + Headless) formalises this at enterprise scale:

```
JAMstack (2015) — Frontend lens:
  → Pre-rendered HTML + APIs (any APIs)
  → Solved: frontend performance, hosting cost, DX

Composable/MACH (2019+) — Full-stack lens:
  → Every capability is a replaceable, best-of-breed service
  → Commerce: Commercetools (not Shopify monolith)
  → CMS: Contentful or Hygraph (not WordPress)
  → Auth: Auth0 or Clerk (not custom code)
  → Search: Algolia (not Elasticsearch self-managed)
  → Payments: Stripe (not PayPal's monolithic SDK)
  → Each vendor has SLAs, specialises in their domain
  → Frontend consumes all via APIs

MACH Alliance (industry body):
  → Founded 2020 by commercetools, Contentful, EPAM, Valtech
  → Certifies vendor compliance with MACH principles
  → Enterprise buyers use MACH certification as procurement criteria
```

**Why this matters in 2026:**

Enterprise clients (retail, media, banking) increasingly issue RFPs specifying "MACH-compliant architecture." Frontend engineers at consultancies (Accenture, Deloitte Digital, EPAM) must speak MACH fluently. For product companies, composable thinking prevents architectural debt — avoiding "we can't replace our CMS because it's tightly coupled to checkout."

**The trade-off of composable:**
More vendors → more integration complexity, more potential failure points, higher cognitive overhead. For small teams, a "good-enough" monolith may outperform composable's operational overhead.

> 🇻🇳 **Tóm tắt**: JAMstack (2015) = pattern cho frontend delivery. MACH (2019+) = framework enterprise cho entire stack: Microservices (mỗi capability là service riêng), API-first (mọi service exposed qua API), Cloud-native (infrastructure managed), Headless (presentation decoupled). JAMstack là cách "frontend delivery" trong MACH. Composable commerce = best-of-breed: Commercetools + Contentful + Algolia + Stripe — mỗi cái replaceable independently. Ý nghĩa: enterprise RFPs ngày càng require MACH-compliant. Trade-off: nhiều vendor = nhiều integration complexity.

**💡 Interview Signal:**

- ✅ Strong: Positions JAMstack as frontend execution within MACH, explains MACH acronym with examples for each letter, names MACH Alliance, articulates the trade-off (complexity of composable), can give real vendor examples
- ❌ Weak: "MACH is just JAMstack with a new name" — misses the backend/infrastructure scope; MACH is architectural philosophy across the entire product

---

### 🔴 Q8: When would you NOT recommend JAMstack to a client? Give concrete scenarios. / Khi nào bạn KHÔNG khuyên dùng JAMstack? Đưa ra tình huống cụ thể.

**A:**

JAMstack is not universally optimal. These are genuine cases where JAMstack creates more problems than it solves:

**Scenario 1: Real-time collaboration tools**
A document editor (Notion, Figma) or live chat requires persistent WebSocket connections, operational transforms, CRDT-based state sync. Pre-rendering is irrelevant — every user session is unique and live. Stack: Elixir/Phoenix (Channels), Node.js (Socket.io), or Cloudflare Durable Objects.

**Scenario 2: 100% personalised pages**
A news homepage that is completely unique per user (ML-driven personalisation, different hero article, ad targeting). Every route is dynamic by definition — there is no "pre-rendered" version to serve. JAMstack would devolve into full client-side rendering with a blank HTML shell (poor LCP, SEO-hostile).

**Scenario 3: Heavy multi-step forms with server-state**
Government portals or multi-step application wizards (mortgage applications, tax filing) with server-side validation at each step, file upload + virus scanning, complex conditional logic. Server sessions are far simpler than managing this state across JWT-authenticated serverless calls.

**Scenario 4: High-frequency write-heavy apps**
A social media feed where users post 100K times per minute. Serverless functions face concurrency limits, cold starts under burst traffic, and connection pool starvation to databases. A persistent Node.js or Go server with connection pooling handles this better.

**Scenario 5: Strict regulatory / data residency requirements**
Certain healthcare or finance applications require data to never leave a specific country/cloud. CDN edges are globally distributed by design — routing content to the "nearest" edge may violate data residency. Dedicated private cloud or on-premise server is the only compliant option.

**The senior answer formula**: JAMstack is optimal when **read:write ratio is high**, content is mostly public (no per-user HTML), and the app doesn't require real-time bidirectional data. When any of these break, evaluate hybrid or traditional SSR.

> 🇻🇳 **Tóm tắt**: JAMstack KHÔNG phù hợp cho: (1) **Real-time collaboration** (chat, editors) — cần persistent WebSocket, không pre-render. (2) **100% personalised pages** — không có gì để pre-render, sẽ thành client-side shell rỗng. (3) **Complex form workflows** với server-state phức tạp — session-based SSR dễ hơn. (4) **High-frequency write-heavy apps** (social media) — serverless có concurrency limits. (5) **Strict data residency** — CDN edges phân tán toàn cầu, có thể vi phạm compliance. Formula: JAMstack tốt khi read:write ratio cao, content mostly public, không cần real-time bidirectional data.

**💡 Interview Signal:**

- ✅ Strong: Gives 3+ concrete scenarios with reasoning, doesn't say "JAMstack is always wrong" but quantifies the conditions, offers alternatives for each anti-fit
- ❌ Weak: "JAMstack is not good for dynamic sites" — too vague; all modern JAMstack supports dynamic content via ISR and APIs

---

### 🔴 Q9: Walk me through the full build and deploy pipeline for a large e-commerce site using JAMstack, including how a product price change triggers a site update. / Describe toàn bộ pipeline build và deploy cho large e-commerce JAMstack site.

**A:**

This is a system design question — structure the answer as a pipeline:

**Steady state (no changes):**

```
User request for /products/widget-pro
→ Cloudflare CDN edge (Frankfurt, 12ms from user)
→ Serves pre-built widget-pro.html from cache
→ Browser receives HTML in < 50ms, LCP image lazy-loaded
→ React hydrates cart button (only interactive element)
→ Cart state fetched from Shopify Storefront API (clientside)
```

**Price change event (product price updates in Shopify):**

```
1. TRIGGER
   Shopify price update → fires webhook to:
   POST https://site.com/api/revalidate
   Body: { "type": "product", "slug": "widget-pro", "price": 49.99 }

2. NEXT.JS ROUTE HANDLER (SERVERLESS)
   Validates HMAC signature from Shopify
   Calls: revalidatePath('/products/widget-pro')
   Calls: revalidateTag('product-listing-pages')
   Returns: { revalidated: true }

3. CACHE INVALIDATION
   Next.js marks widget-pro page as stale in ISR cache
   Marks all pages tagged 'product-listing-pages' as stale

4. FIRST REQUEST AFTER INVALIDATION
   Next request to /products/widget-pro
   → ISR cache miss → Server renders fresh HTML
   → Fetches updated price from Shopify Storefront API
   → New HTML cached at CDN edge worldwide
   → All subsequent requests: CDN-served fresh HTML

5. CONTENT PREVIEW (if needed for editorial review)
   Shopify draft product → editor clicks Preview
   → /api/draft?secret=TOKEN&slug=/products/widget-pro-v2
   → Draft mode cookie set → draft Shopify data rendered
   → Editor sees new layout before product goes live
```

**At scale (500K products):**

- Do NOT pre-render all 500K pages at build time (8-hour build is unacceptable)
- Instead: `generateStaticParams` pre-builds **top 1,000 products** (by traffic)
- ISR fallback for remaining 499K: first request triggers render, cached afterwards
- On-demand revalidation per product via Shopify webhook
- Result: top products served from CDN (zero latency), long-tail served via ISR (first request only slightly slower)

> 🇻🇳 **Tóm tắt**: Pipeline: (1) User hit CDN → pre-built HTML < 50ms. (2) Shopify price update → webhook → `/api/revalidate` → `revalidatePath()` → ISR cache invalidated. (3) Next request triggers fresh render → CDN caches mới. Ở scale 500K products: không pre-build tất cả — `generateStaticParams` chỉ build 1K top pages, còn lại dùng ISR fallback. Preview: Draft Mode + Shopify draft products.

**💡 Interview Signal:**

- ✅ Strong: Walks through the full event chain (Shopify webhook → revalidatePath → CDN cache miss → re-render → CDN cache), handles the scale problem (not pre-building 500K pages), mentions HMAC webhook validation, addresses preview workflow
- ❌ Weak: "Trigger a full rebuild on every price change" — 500K-product rebuild for one price update is impractical; shows unfamiliarity with ISR/on-demand revalidation

---

### 🔴 Q10: What is Partial Prerendering (PPR) and how does it evolve the JAMstack model? / PPR là gì và nó tiến hoá JAMstack model như thế nào?

**A:**

**Partial Prerendering (PPR)** — introduced experimentally in Next.js 14, targeting stable in Next.js 15+ — is the synthesis of static and dynamic rendering at the **component level within a single page**.

Traditional JAMstack forced a binary choice per page:

- **Static (CDN)**: entire page pre-rendered — great performance, stale content risk
- **Dynamic (server/serverless)**: entire page rendered per-request — fresh content, higher TTFB

PPR eliminates this page-level binary:

```
PPR MODEL:

Single page request for /products/widget-pro:

CDN LAYER (instant, static):
  → Serves a pre-rendered HTML "shell" immediately
  → Shell contains: header, product image, title, description, breadcrumbs
  → These parts are STATIC — same for all users, cached forever

STREAMING LAYER (dynamic, concurrent):
  → While shell is already rendering in browser:
  → Dynamic slots stream in via HTTP streaming (chunked transfer)
  → <Suspense> boundaries mark these dynamic regions

  Dynamic region 1: InventoryBadge — "In stock (12 remaining)"
    fetches real-time inventory from warehouse API
  Dynamic region 2: PriceDisplay — personalised price (logged-in vs guest)
    fetches user-specific pricing from commerce API
  Dynamic region 3: CartButton — cart state
    fetches cart from Shopify

Timeline:
  0ms:    CDN edge serves static shell HTML
  50ms:   Browser renders visible product content (LCP achieved)
  200ms:  Dynamic inventory/price streams in
  300ms:  Cart button becomes interactive
```

```typescript
// next.config.js
export default { experimental: { ppr: true } };

// app/products/[slug]/page.tsx
import { Suspense } from "react";

// This entire page has a static outer shell + dynamic inner streams
export default async function ProductPage({ params }) {
  // Static: runs at build time → pre-rendered in shell
  const product = await getProductStatic(params.slug);

  return (
    <div>
      {/* Static shell — in CDN cache */}
      <ProductHero product={product} />

      {/* Dynamic slot — streams after static shell is sent */}
      <Suspense fallback={<PriceSkeleton />}>
        <PersonalisedPrice slug={params.slug} />
      </Suspense>

      <Suspense fallback={<StockSkeleton />}>
        <RealTimeStock slug={params.slug} />
      </Suspense>
    </div>
  );
}
```

**Why PPR matters architecturally**: It removes the "all-or-nothing" rendering decision at the page level. E-commerce product pages can have CDN-fast static shells (achieving LCP < 1s) while streaming in personalised pricing and real-time inventory without sacrificing performance. This is the convergence point of JAMstack (static/CDN) and SSR (dynamic/fresh) in a single unified model.

> 🇻🇳 **Tóm tắt**: PPR (Partial Prerendering, Next.js 14+) loại bỏ lựa chọn nhị phân "static page vs dynamic page". Thay vào đó: **static shell** của page được pre-render và serve từ CDN ngay lập tức; các **dynamic slots** (Suspense boundaries) stream vào sau thông qua HTTP streaming. Kết quả: LCP đạt từ static shell (CDN-fast), fresh data (inventory, price cá nhân hoá) stream vào mà không làm chậm initial render. Đây là điểm hội tụ của JAMstack và SSR — không còn là "either/or".

**💡 Interview Signal:**

- ✅ Strong: Explains the static shell + dynamic streaming model clearly, knows it's experimental in Next.js 14 (targeting stable 15+), explains the Suspense boundary mechanism, connects it to the JAMstack evolution story
- ❌ Weak: "PPR is just ISR with Suspense" — misses the fundamental innovation (within-page granularity, static + dynamic simultaneously on same request)

---

## Anti-Patterns / Những Lỗi Thường Gặp

### Anti-Pattern 1: Full Rebuild on Every Content Change

**Symptom**: CMS webhook triggers full `next build` for entire 50K-page site on every article update.

**Why it's wrong**: 50K-page rebuild may take 15–30 minutes. Editorial team cannot publish urgent news. CI/CD queue backs up.

**Fix**: Use `revalidatePath()` / `revalidateTag()` for on-demand revalidation of only changed pages. Reserve full builds for dependency updates or code changes.

---

### Anti-Pattern 2: Storing JWT in localStorage

**Symptom**: `localStorage.setItem('token', jwt)` after login.

**Why it's wrong**: Any XSS attack on your site can read localStorage and steal the JWT. Modern XSS attacks via third-party scripts (ad networks, analytics) are a real vector.

**Fix**: Store JWT in `httpOnly; Secure; SameSite=Lax` cookie — inaccessible to JavaScript, sent automatically by browser on same-origin requests.

---

### Anti-Pattern 3: Using JAMstack for a Real-Time App

**Symptom**: Building a live auction platform on JAMstack — polling every 2 seconds to simulate real-time bid updates.

**Why it's wrong**: Polling is expensive (many redundant requests), has latency proportional to poll interval, scales poorly. Pre-rendered HTML is irrelevant when data changes every second.

**Fix**: Use WebSocket or Server-Sent Events for real-time data. Keep the static shell (layout, navigation) as JAMstack, but real-time data regions use persistent connections via a proper WebSocket service (Pusher, Ably, Supabase Realtime).

---

### Anti-Pattern 4: Pre-rendering Every Page of a Million-Product Catalogue

**Symptom**: `generateStaticParams` returns all 1,000,000 product IDs — build takes 18 hours, CI hangs.

**Why it's wrong**: Long-tail products rarely receive traffic. The cost of pre-building rarely-visited pages is enormous; the benefit (CDN cache for a page no one visits) is near-zero.

**Fix**: Pre-build only top N pages (e.g., `LIMIT 5000 ORDER BY traffic DESC`). Use ISR with fallback for the rest — first-request latency is acceptable for low-traffic products.

---

### Anti-Pattern 5: Putting API Keys in Client-Side Code

**Symptom**: `fetch('https://api.contentful.com/...?access_token=XXXX')` called from a React component (not a Server Component or Route Handler).

**Why it's wrong**: API key visible in browser DevTools Network tab. Anyone can scrape your content, bypass rate limits, or hit your CMS API directly.

**Fix**: Move all CMS/third-party API calls to Server Components, Route Handlers, or serverless functions. Only public CDN-delivered assets (images, fonts) should be fetched client-side without auth.

---

### Anti-Pattern 6: Ignoring CDN Cache Invalidation Strategy

**Symptom**: Team updates product prices in CMS, but customers still see old prices for hours.

**Why it's wrong**: Without a webhook-driven invalidation strategy, ISR has a time-based window (could be 1 hour). Price mistakes or inventory going out-of-stock stay live until the next revalidation window.

**Fix**: Implement on-demand revalidation via CMS webhooks for time-sensitive content (prices, inventory, published/unpublished state). Use time-based revalidation only for non-urgent content (blog posts, static marketing copy).

---

### Anti-Pattern 7: Over-composing for Small Projects

**Symptom**: 3-person startup uses 7 different SaaS vendors (Contentful + Auth0 + Algolia + Shopify + Stitch + Segment + LaunchDarkly) for a product with 200 users.

**Why it's wrong**: Integration overhead (5 vendor contracts, 7 SDKs, 7 failure surfaces, 7 billing accounts) overwhelms a small team. Debugging becomes: "Is this a Contentful webhook failure, an Auth0 token expiry, or an Algolia index sync issue?"

**Fix**: For small products, monolithic simplicity wins. A well-structured Next.js app with a single Postgres database (Supabase), a single auth solution (NextAuth), and a simpler search (Postgres full-text or Pagefind) is dramatically easier to operate. Compose only when the complexity is justified by scale or team size.

---

## Memory Hook / Ghi Nhớ

**🧠 JAMstack mnemonic — "JAM jars preserve things well":**

```
J = JavaScript (enhances, runs in browser — the lid that seals)
A = APIs (all dynamic logic lives here — ingredients inside)
M = Markup (pre-rendered HTML — the glass jar, solid structure)

"Jars preserve because the structure (M) is solid,
 the content (A) is fresh when opened,
 and you only open the lid (J) when needed."
```

**Evolution mnemonic — "SHIP gets FASTER":**

```
Static HTML → ISR → Partial prerendering
S = Static (2015–2019, pure JAMstack)
H = Hybrid (2020–2022, static + ISR + dynamic)
I = Incremental (ISR, on-demand revalidation)
P = Partial (PPR, static shell + dynamic streams)

Hosting evolution: Netlify → Vercel → Edge
F = Files (CDN)
A = APIs (serverless functions)
S = Streaming (edge, PPR)
T = TypeScript-first (full-stack type safety)
E = Edge (compute at CDN PoP)
R = Real-time (WebSocket layer where needed)
```

**MACH — "MAC computers are Headless" (forced, but sticks):**

```
M = Microservices
A = API-first
C = Cloud-native
H = Headless
```

---

## Q&A Summary Table / Bảng Tóm Tắt Q&A

| #   | Question (EN)                                | Difficulty | Key Concept                                  | One-Line Answer                                                |
| --- | -------------------------------------------- | ---------- | -------------------------------------------- | -------------------------------------------------------------- |
| 1   | What does JAM stand for, who coined it?      | 🟢         | Origin story                                 | JavaScript + APIs + Markup; Mathias Biilmann / Netlify, 2015   |
| 2   | Core perf benefits vs WordPress monolith?    | 🟢         | TTFB, scalability, security                  | CDN TTFB < 50ms, infinite scale, zero attack surface exposed   |
| 3   | How does ISR solve stale content?            | 🟡         | ISR, on-demand revalidation                  | Stale-while-revalidate per page; webhook → revalidatePath      |
| 4   | What is BFF and why important in JAMstack?   | 🟡         | BFF pattern, API aggregation                 | Server-side aggregation layer; hides keys, reduces round trips |
| 5   | How to implement auth? Trade-offs?           | 🟡         | JWT, auth providers, edge middleware         | JWT in httpOnly cookie; stateless but harder to revoke         |
| 6   | Headless CMS preview workflow for editors?   | 🟡         | Draft Mode, webhooks, editorial UX           | Draft Mode cookie → bypass ISR → fetch draft CMS content       |
| 7   | JAMstack → MACH composable evolution?        | 🔴         | MACH, composable commerce, architecture      | JAMstack = frontend delivery; MACH = entire stack philosophy   |
| 8   | When NOT to use JAMstack?                    | 🔴         | Trade-offs, anti-fit scenarios               | Real-time, 100% personalised, high-write, data residency       |
| 9   | Full pipeline for e-commerce price change?   | 🔴         | Webhooks, ISR, build pipeline, scale         | Webhook → revalidatePath → CDN miss → re-render → cache        |
| 10  | What is PPR and how does it evolve JAMstack? | 🔴         | Partial Prerendering, static+dynamic unified | Static shell from CDN; dynamic slots stream via Suspense       |

---

## Cold Call / Câu Hỏi Nhanh

Interviewer bắn nhanh — trả lời trong 15 giây mỗi câu:

**Q: "Name three headless CMS options and when you'd choose each."**
→ Contentful (enterprise, multi-locale, high availability), Sanity (custom content models, real-time collab), Strapi (self-hosted, on-premise requirement, full control).

**Q: "What's the difference between ISR and on-demand revalidation?"**
→ ISR: time-based, stale-while-revalidate per interval. On-demand: CMS webhook calls `revalidatePath()` immediately — no polling, instant freshness.

**Q: "Why would you use Pagefind instead of Algolia?"**
→ Pagefind is fully static — index generated at build time, served as WASM files, zero external service, zero cost, works offline. Algolia is hosted search-as-a-service — faster, more features, but paid and requires external network call.

**Q: "What is DPR (Distributed Persistent Rendering)?"**
→ Netlify's term: pages built on first request, then cached persistently at CDN edge. Similar to ISR fallback — build-on-demand model for pages not pre-built at deploy time.

**Q: "You have 2 million product pages. How do you handle JAMstack builds?"**
→ Pre-build only top 10K–50K by traffic volume. Use ISR fallback for the rest — first request triggers render, CDN caches. On-demand revalidation for price/inventory changes via webhook.

**Q: "What's the difference between Vercel and Netlify for JAMstack?"**
→ Vercel: Next.js-first, ISR native, best DX for React/Next teams. Netlify: framework-agnostic, better for non-Next sites, On-Demand Builders equivalent to ISR. Cloudflare Pages: largest CDN network, most cost-effective at scale, Workers ecosystem.

**Q: "Why store auth tokens in httpOnly cookies instead of localStorage?"**
→ localStorage is readable by any JavaScript on the page, including XSS-injected scripts and third-party analytics. httpOnly cookies are inaccessible to JavaScript — only sent by browser on HTTP requests.

**Q: "What does MACH stand for?"**
→ Microservices, API-first, Cloud-native, Headless.

**Q: "What is the JAMstack security advantage?"**
→ No origin server exposed (CDN serves files only), no persistent server process to exploit, no database port accessible from internet, API secrets stay in build environment / serverless functions, not served to browser.

**Q: "When does composable architecture hurt more than help?"**
→ Small teams / early-stage products: too many vendors = too many integration points, billing accounts, debugging surfaces. Monolithic simplicity wins until scale justifies composition.

---

## Self-Check Checklist / Tự Kiểm Tra

Trả lời được những câu này trôi chảy = bạn đã sẵn sàng cho JAMstack questions ở Mid/Senior level:

**Foundations (🟢 Junior)**

- [ ] Can you spell out JAM and explain each letter with a concrete example?
- [ ] Can you name the origin of JAMstack (who, when, company)?
- [ ] Can you explain why CDN-served HTML has lower TTFB than PHP-rendered HTML?
- [ ] Can you name 3 JAMstack hosting platforms and one differentiator for each?
- [ ] Can you name 3 headless CMS options and when you'd choose each?

**Core Mechanics (🟡 Mid)**

- [ ] Can you explain ISR's stale-while-revalidate behaviour accurately (not "rebuilds every X seconds")?
- [ ] Can you implement an on-demand revalidation Route Handler from memory?
- [ ] Can you explain the BFF pattern and why it improves security in JAMstack?
- [ ] Can you describe the JAMstack auth flow (JWT → httpOnly cookie → edge middleware)?
- [ ] Can you walk through the content preview workflow for a CMS editor using Next.js Draft Mode?
- [ ] Can you explain why `localStorage` is wrong for JWT storage?
- [ ] Can you describe at least 3 e-commerce architecture options on JAMstack?
- [ ] Can you explain the difference between Pagefind and Algolia and when to use each?

**Advanced (🔴 Senior)**

- [ ] Can you articulate MACH architecture and how it relates to JAMstack?
- [ ] Can you give 4 concrete scenarios where JAMstack is the wrong choice, with reasons?
- [ ] Can you walk through a full pipeline for 500K-product e-commerce with webhook-driven revalidation?
- [ ] Can you explain Partial Prerendering (PPR) and how it unifies static + dynamic rendering?
- [ ] Can you compare JAMstack vs Edge-first architectures (Cloudflare Workers) with trade-offs?
- [ ] Can you explain the composable over-engineering anti-pattern and when to avoid it?
- [ ] Can you describe content preview workflow end-to-end (draft mode, banner, publish → invalidate)?

---

_See also: [05-static-site-generators-landscape.md](./05-static-site-generators-landscape.md) for SSG framework comparison — this file covers the architectural pattern; that file covers tool selection._
