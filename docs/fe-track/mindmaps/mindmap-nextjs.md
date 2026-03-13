# Next.js Mind Map - Quick Reference

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Next.js App Router cho interview.

---

## 🗺️ Next.js Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS KNOWLEDGE MAP                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                              ┌─────────────┐                             │
│                              │   NEXT.JS   │                             │
│                              │  APP ROUTER │                             │
│                              └──────┬──────┘                             │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │    ROUTING    │         │  RENDERING    │         │     DATA      │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • File-based  │         │ • SSG         │         │ • Server Fetch│ │
│   │ • Dynamic     │         │ • SSR         │         │ • Server Act  │ │
│   │ • Parallel    │         │ • ISR         │         │ • Client Fetch│ │
│   │ • Intercepting│         │ • Streaming   │         │ • Route Handle│ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │   COMPONENTS  │         │  OPTIMIZATION │         │    CACHING    │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • Server Comp │         │ • next/image  │         │ • Data Cache  │ │
│   │ • Client Comp │         │ • next/font   │         │ • Route Cache │ │
│   │ • Layouts     │         │ • next/script │         │ • Request Mem │ │
│   │ • Loading/Err │         │ • Code Split  │         │ • Revalidation│ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 App Router File Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP ROUTER STRUCTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   app/                                                           │
│   │                                                               │
│   ├── layout.tsx      ─────▶  Root layout (required)            │
│   ├── page.tsx        ─────▶  / route                           │
│   ├── loading.tsx     ─────▶  Loading UI (Suspense)             │
│   ├── error.tsx       ─────▶  Error boundary                    │
│   ├── not-found.tsx   ─────▶  404 page                          │
│   ├── template.tsx    ─────▶  Re-render layout                  │
│   │                                                               │
│   ├── about/                                                      │
│   │   └── page.tsx    ─────▶  /about                            │
│   │                                                               │
│   ├── blog/                                                       │
│   │   ├── page.tsx    ─────▶  /blog                             │
│   │   └── [slug]/                                                │
│   │       └── page.tsx ────▶  /blog/:slug                       │
│   │                                                               │
│   ├── [...catchAll]/  ─────▶  Catch-all /a/b/c                  │
│   ├── [[...optional]] ─────▶  Optional catch-all                │
│   │                                                               │
│   ├── (marketing)/    ─────▶  Route group (no URL)              │
│   │   └── pricing/                                               │
│   │                                                               │
│   ├── @modal/         ─────▶  Parallel route                    │
│   │   └── login/                                                  │
│   │                                                               │
│   └── api/                                                        │
│       └── users/                                                  │
│           └── route.ts ────▶  API endpoint                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Server vs Client Components

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVER vs CLIENT COMPONENTS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SERVER (Default)                 CLIENT ('use client')        │
│   ┌─────────────────────┐         ┌─────────────────────┐       │
│   │ ✅ async/await      │         │ ✅ useState          │       │
│   │ ✅ Direct DB access │         │ ✅ useEffect         │       │
│   │ ✅ Backend resources│         │ ✅ Event handlers    │       │
│   │ ✅ Secrets safe     │         │ ✅ Browser APIs      │       │
│   │ ✅ No JS bundle     │         │ ✅ Third-party libs  │       │
│   │                     │         │ ✅ Custom hooks      │       │
│   │ ❌ No hooks         │         │                     │       │
│   │ ❌ No event handlers│         │ ❌ No async component│       │
│   │ ❌ No browser APIs  │         │ ❌ No backend access │       │
│   └─────────────────────┘         └─────────────────────┘       │
│                                                                   │
│   COMPOSITION RULES:                                             │
│   • Server can import Client ✅                                  │
│   • Client can render Server as children ✅                      │
│   • Client cannot import Server ❌                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Rendering Strategies

```
┌─────────────────────────────────────────────────────────────────┐
│                   RENDERING STRATEGIES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│   │     SSG     │  │     SSR     │  │     ISR     │             │
│   │   Static    │  │   Dynamic   │  │   Hybrid    │             │
│   └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│          │                │                │                     │
│   Build Time        Request Time     Build + Revalidate         │
│          │                │                │                     │
│   cache:            cache:           next: {                     │
│   'force-cache'     'no-store'         revalidate: 60           │
│                                      }                           │
│                                                                   │
│   When to use:                                                   │
│   ─────────────                                                  │
│   SSG: Marketing, blogs, docs (content rarely changes)          │
│   SSR: Dashboards, personalized, real-time data                 │
│   ISR: Products, articles (changes sometimes)                   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    STREAMING                             │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │                                                           │   │
│   │   <Suspense fallback={<Loading />}>                      │   │
│   │       <SlowComponent />  ← Streams when ready            │   │
│   │   </Suspense>                                             │   │
│   │                                                           │   │
│   │   Benefits: Better TTFB, progressive rendering           │   │
│   │                                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Fetching

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA FETCHING PATTERNS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SERVER COMPONENT                                               │
│   ────────────────                                               │
│   async function Page() {                                        │
│       const data = await fetch(url, {                            │
│           cache: 'force-cache',  // Static                       │
│           // cache: 'no-store',  // Dynamic                      │
│           // next: { revalidate: 60 }, // ISR                    │
│           // next: { tags: ['posts'] }, // Tag-based             │
│       });                                                         │
│       return <Content data={data} />;                            │
│   }                                                               │
│                                                                   │
│   SERVER ACTIONS                                                 │
│   ──────────────                                                 │
│   async function submitForm(formData: FormData) {                │
│       'use server';                                               │
│       await db.create({ ... });                                  │
│       revalidatePath('/posts');                                  │
│   }                                                               │
│                                                                   │
│   CLIENT                                                         │
│   ──────                                                         │
│   • SWR / React Query for caching                                │
│   • useEffect for simple cases                                   │
│   • Real-time updates (polling, WebSocket)                       │
│                                                                   │
│   ROUTE HANDLERS                                                 │
│   ──────────────                                                 │
│   // app/api/users/route.ts                                      │
│   export async function GET() { return NextResponse.json(...) }  │
│   export async function POST(req) { ... }                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Routing Patterns

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROUTING PATTERNS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   DYNAMIC ROUTES                                                 │
│   ──────────────                                                 │
│   [slug]          → /blog/hello     params.slug = "hello"       │
│   [id]/[slug]     → /1/hello        params = { id, slug }       │
│   [...slug]       → /a/b/c          params.slug = ["a","b","c"] │
│   [[...slug]]     → / or /a/b/c     optional catch-all          │
│                                                                   │
│   ROUTE GROUPS                                                   │
│   ────────────                                                   │
│   (marketing)/about  → /about (no /marketing in URL)            │
│   (app)/dashboard    → /dashboard                                │
│   Purpose: Organization, different layouts                       │
│                                                                   │
│   PARALLEL ROUTES                                                │
│   ───────────────                                                │
│   @modal/login      → Render alongside main content             │
│   @sidebar/page     → Independent loading/error                  │
│                                                                   │
│   Layout receives: { children, modal, sidebar }                  │
│                                                                   │
│   INTERCEPTING ROUTES                                            │
│   ───────────────────                                            │
│   (.)photo/[id]     → Same level intercept                      │
│   (..)photo/[id]    → One level up                              │
│   (...)photo/[id]   → From root                                 │
│                                                                   │
│   Use case: Modal over feed, preserve URL                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS OPTIMIZATION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   IMAGES (next/image)                                            │
│   ───────────────────                                            │
│   <Image                                                          │
│       src="/hero.jpg"                                            │
│       alt="..."                                                   │
│       width={800}                                                 │
│       height={600}                                                │
│       priority        // LCP images                              │
│       placeholder="blur"                                          │
│       sizes="(max-width: 768px) 100vw, 50vw"                     │
│   />                                                              │
│   Benefits: Lazy load, WebP/AVIF, responsive, no CLS             │
│                                                                   │
│   FONTS (next/font)                                              │
│   ─────────────────                                              │
│   import { Inter } from 'next/font/google';                      │
│   const inter = Inter({ subsets: ['latin'] });                   │
│   Benefits: Self-hosted, no CLS, preloaded                       │
│                                                                   │
│   SCRIPTS (next/script)                                          │
│   ─────────────────────                                          │
│   strategy: beforeInteractive | afterInteractive | lazyOnload    │
│                                                                   │
│   CODE SPLITTING                                                 │
│   ──────────────                                                 │
│   • Automatic per route                                          │
│   • dynamic(() => import(...))                                   │
│   • dynamic(..., { ssr: false }) for client-only                 │
│                                                                   │
│   CACHING LAYERS                                                 │
│   ──────────────                                                 │
│   1. Request Memoization (same render)                           │
│   2. Data Cache (fetch results)                                  │
│   3. Router Cache (client navigation)                            │
│   4. Full Route Cache (static pages)                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Layout & Loading

```
┌─────────────────────────────────────────────────────────────────┐
│                   LAYOUT HIERARCHY                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Root Layout (app/layout.tsx)                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ <html>                                                   │   │
│   │   <body>                                                 │   │
│   │     <Header />                                           │   │
│   │     ┌───────────────────────────────────────────────┐   │   │
│   │     │ Nested Layout (app/dashboard/layout.tsx)       │   │   │
│   │     │ ┌───────────────────────────────────────────┐ │   │   │
│   │     │ │ <Sidebar />                               │ │   │   │
│   │     │ │ ┌───────────────────────────────────────┐ │ │   │   │
│   │     │ │ │ Page Content (page.tsx)               │ │ │   │   │
│   │     │ │ │                                       │ │ │   │   │
│   │     │ │ └───────────────────────────────────────┘ │ │   │   │
│   │     │ └───────────────────────────────────────────┘ │   │   │
│   │     └───────────────────────────────────────────────┘   │   │
│   │     <Footer />                                           │   │
│   │   </body>                                                │   │
│   │ </html>                                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   LOADING STATES                                                 │
│   ──────────────                                                 │
│   loading.tsx → Wraps page in <Suspense>                        │
│   error.tsx   → Wraps page in <ErrorBoundary>                   │
│                                                                   │
│   <ErrorBoundary fallback={<Error />}>                          │
│       <Suspense fallback={<Loading />}>                          │
│           <Page />                                               │
│       </Suspense>                                                 │
│   </ErrorBoundary>                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Interview Quick Answers

| Topic | Question | Quick Answer |
|-------|----------|--------------|
| Routing | Dynamic params? | `[slug]` folder, access via `params.slug` |
| Routing | Route groups? | `(name)` - organize without affecting URL |
| Rendering | SSG vs SSR? | SSG: build time, cached; SSR: per request |
| Rendering | ISR? | Static + revalidate: `{ next: { revalidate: 60 } }` |
| Components | Server vs Client? | Server: default, async; Client: 'use client', hooks |
| Data | Server Actions? | 'use server' - form mutations without API |
| Caching | Revalidate? | `revalidatePath()` or `revalidateTag()` |
| Images | priority prop? | Preload for LCP images, disable lazy load |
| Fonts | Benefits? | Self-hosted, no CLS, automatic subset |

---

## 🎯 Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              NEXT.JS DECISION MAKING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Need interactivity (hooks, events)?                            │
│   ├── Yes → 'use client' component                              │
│   └── No  → Keep as Server Component                            │
│                                                                   │
│   Is data personalized/auth-dependent?                           │
│   ├── Yes → cache: 'no-store' (SSR)                             │
│   └── No  → Does it change?                                     │
│             ├── Never    → cache: 'force-cache' (SSG)           │
│             ├── Sometimes → next: { revalidate: N } (ISR)       │
│             └── Always   → cache: 'no-store'                    │
│                                                                   │
│   Need mutation?                                                 │
│   ├── Simple form → Server Action                               │
│   ├── Complex API → Route Handler                               │
│   └── Real-time   → Client fetch (SWR/React Query)              │
│                                                                   │
│   Multiple sections with different requirements?                 │
│   └── Use Suspense + mix strategies per component                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

> **Quay lại:** [README.md](./mindmap-foundations.md) - Next.js Overview
