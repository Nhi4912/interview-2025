# Next.js Fundamentals — App Router / Nền Tảng Next.js - App Router

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Server Components](./01-app-router-server-components.md) | [Data Fetching](./02-data-fetching.md)
> **See also**: [Architecture & Rendering Strategies](./03-nextjs-architecture.md) | [React Hooks](../03-react/03-hooks-deep-dive.md)

[← Back to Architecture](./03-nextjs-architecture.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**English:** Topcv.vn (job board) — Pages Router with CSR: Google bot couldn't index job listings because they were fetched client-side after JS load. SEO score low, organic traffic dropped 40%. After migration to App Router with Server Components: job data renders in HTML directly → Google indexes immediately → organic traffic +65% in 3 months.

**Tiếng Việt:** Topcv.vn (job board) — Pages Router với CSR: Google bot không index được listing vì fetch client-side sau khi JS load. SEO thấp, traffic organic giảm 40%. Sau khi migrate sang App Router: job data render trong HTML server-side → Google index ngay → traffic tăng 65% sau 3 tháng.

**Why this matters**: App Router's file conventions and Server Component defaults directly impact SEO, bundle size, and developer experience. Understanding when to use `"use client"` is the #1 architectural decision in every Next.js app.

---

## What & Why / Cái Gì & Tại Sao

**App Router** (Next.js 13+) is the modern routing system built on React Server Components. Key shifts from Pages Router:

- **Server Components by default** → less JavaScript shipped to browser, better SEO
- **File system = URL** → `app/blog/[slug]/page.tsx` generates `/blog/:slug`
- **Nested layouts** → `layout.tsx` persists state across child route navigations
- **Co-located special files** → `loading.tsx`, `error.tsx`, `not-found.tsx` are automatic Suspense/Error boundaries

**The mental model**: each folder in `app/` is a route segment. Files in that folder define behavior (page content, layout, loading state, error state, API endpoint).

---

## Core Concept 1: App Router File Conventions & Routing

> 🧠 **Memory Hook**: "**PLER + T + R** = Page, Layout, Error, (not-found) — the 5 files every route can have. Plus Template and Route for special cases."

**Tại sao tồn tại? / Why does this exist?**
Pages Router required separate patterns for layouts (custom `_app.js`, `_document.js`), loading states (manual), and error boundaries (class components).
→ Why is that a problem? Each pattern was different — developers had to learn 5 different systems to build one route.
→ Why is file-based routing better than explicit route configs? Convention over configuration — no routing boilerplate, IDE can navigate directly from file to URL.

### Layer 1: Special Files Reference

```
app/
├── layout.tsx      ← Shared UI — persists across child navigations (state preserved)
├── page.tsx        ← Route UI — renders for this specific URL
├── loading.tsx     ← Suspense fallback — shown while page.tsx is streaming
├── error.tsx       ← Error boundary — must be 'use client'
├── not-found.tsx   ← Shown when notFound() is called or no match
├── template.tsx    ← Like layout but re-creates on every navigation (analytics)
└── route.ts        ← API endpoint (GET, POST, PUT, DELETE handlers)
```

**layout vs template distinction:**

```tsx
// layout.tsx — state is PRESERVED on navigation
// Sidebar open/closed state persists when navigating between /dashboard/settings and /dashboard/analytics

// template.tsx — re-creates on every navigation
// Use for: page view analytics (useEffect fires on every nav), animation resets
"use client";
export default function Template({ children }) {
  useEffect(() => analytics.pageView(), []); // fires every navigation
  return <div>{children}</div>;
}
```

### Layer 2: Dynamic Routes

```
[slug]        → /blog/my-post           (single segment)
[...slug]     → /docs/react/hooks/api   (catch-all, requires ≥1 segment)
[[...slug]]   → /docs AND /docs/react   (optional catch-all, matches 0+ segments)
(group)       → URL unchanged, just for layout organization
@slot         → Parallel route (renders alongside main children)
```

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}

// Route groups: (marketing) doesn't affect URL
// app/(marketing)/about/page.tsx → /about
// app/(shop)/products/page.tsx   → /products
// Each group can have its own layout.tsx

// Parallel routes: @modal slot
// app/layout.tsx receives { children, modal } as separate slots
export default function Layout({ children, modal }) {
  return (
    <>
      <div>{children}</div>
      {modal}
    </>
  );
}
```

### Layer 3: Loading and Error Hierarchy

```
Suspense cascade: loading.tsx wraps page.tsx automatically
Error cascade:    error.tsx catches errors from page.tsx AND children layouts
                  root error.tsx = global error boundary (must also handle layout.tsx errors)

If segment has:   loading.tsx = automatic <Suspense> wrapping page.tsx
                  error.tsx   = automatic <ErrorBoundary> wrapping loading.tsx + page.tsx
```

```tsx
// error.tsx must be Client Component (needs onClick/retry state)
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Retry</button> {/* triggers re-render to retry */}
    </div>
  );
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                      | Tại sao sai                                                                 | Đúng là                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Adding `loading.tsx` but data fetch is in a Client Component | loading.tsx wraps the Suspense boundary for Server Component streaming only | For Client Component loading: use `useEffect` + state, or Suspense with `use()` hook             |
| Using `template.tsx` for every layout                        | Re-creates on every navigation → state lost, more expensive                 | Only use `template.tsx` when you specifically need re-creation (page analytics, animation reset) |
| `error.tsx` as Server Component                              | Needs `onClick={reset}` → must be interactive → must be Client Component    | Always add `'use client'` to `error.tsx` files                                                   |
| Forgetting `not-found.tsx` for dynamic routes                | Unmatched dynamic segments show React error instead of graceful 404         | Create `not-found.tsx` and call `notFound()` from the page when item is not found                |

**🎯 Interview Pattern:**

- Khi thấy: "How do you handle loading states in Next.js App Router?"
- → Nhớ: `loading.tsx` = automatic Suspense for Server Components; Server Component `async` data = streams through Suspense boundary
- → Mở đầu: "In App Router, creating a `loading.tsx` file next to a `page.tsx` automatically wraps the page in a Suspense boundary — the loading UI shows while the Server Component fetches data. For Client Components, I manage loading state with hooks."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React 19 — Suspense and streaming](../03-react/10-modern-react-features.md)
- ➡️ Để hiểu: [Data Fetching — parallel fetching with Suspense](./02-data-fetching.md)

---

## Core Concept 2: Server/Client Component Composition

> 🧠 **Memory Hook**: "Default = Server (no JS shipped). Add `'use client'` when you need: **HEEL** — **H**ooks, **E**vent handlers, **E**ffects, **L**ifecycle/browser APIs."

**Tại sao tồn tại? / Why does this exist?**
Before React Server Components, every component ran in the browser — meaning every library, template, and data transformation shipped as JavaScript.
→ Why is that a problem? A markdown blog post renderer (gray-matter, remark, rehype = ~100KB) ships to every visitor even though it runs once at build time.
→ Why doesn't Next.js just auto-detect? React can't statically determine which APIs will be called at runtime without explicit hints — the `'use client'` directive is that hint.

### Layer 1: The Decision Rule

```
Add 'use client' when component needs ANY of:
├── useState, useReducer, useContext
├── useEffect, useLayoutEffect, useRef
├── Custom hooks (that use the above)
├── onClick, onChange, onSubmit (any event handler)
├── window, document, navigator (browser APIs)
└── Third-party libraries that use the above internally
    (e.g., react-select, framer-motion, chart.js wrappers)

Keep as Server Component when:
├── Fetching data (async/await directly in component)
├── Accessing backend resources (DB, filesystem, env secrets)
├── Rendering static content (markdown, HTML from CMS)
└── Using server-only libraries (DB clients, PDF generators)
```

### Layer 2: Composition Patterns

```tsx
// ✅ Donut pattern: Server Component wraps Client Component
// Server shell fetches data + renders static HTML
// Client "hole" handles interactivity

// app/product/[id]/page.tsx (Server Component)
async function ProductPage({ params }) {
  const product = await db.products.findById(params.id); // Server: direct DB

  return (
    <div>
      <h1>{product.name}</h1> {/* Server-rendered HTML */}
      <p>${product.price}</p>
      <AddToCartButton productId={params.id} /> {/* Client Component island */}
    </div>
  );
}

// components/AddToCartButton.tsx
("use client");
function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addToCart(productId);
        setAdded(true);
      }}
    >
      {added ? "✓ Added" : "Add to Cart"}
    </button>
  );
}
```

**Server Actions — mutations without API routes:**

```tsx
// app/actions.ts
"use server"; // marks functions as Server Actions

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.post.create({ data: { title } });
  revalidatePath("/blog"); // purge cache immediately
  redirect("/blog");
}

// Server Component: native form, works without JS (progressive enhancement)
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button>Create</button>
    </form>
  );
}

// Client Component: with pending state
("use client");
export function PostFormWithPending() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>{isPending ? "Creating..." : "Create"}</button>
    </form>
  );
}
```

### Layer 3: Environment Variables

```
Variable type           Accessible in              Rule
────────────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL     Server + Client Components  Bundled into JS at build time
DATABASE_URL            Server only (SC, SA, Middleware)  Never sent to browser
JWT_SECRET              Server only                 ← NEVER add NEXT_PUBLIC_ prefix
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                                   | Tại sao sai                                                                    | Đúng là                                                                             |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `'use client'` at root layout or high-level pages                         | Turns entire subtree into Client Components — defeats Server Component benefit | Only mark leaf interactive components as `'use client'`                             |
| Importing a `'use client'` component from a Server Component with `async` | Allowed, but if the CC is heavy (chart lib), consider lazy loading             | Use `dynamic(() => import(...), { ssr: false })` for heavy CC that doesn't need SSR |
| Forgetting that `'use client'` infects imports                            | All modules imported from a `'use client'` file become client modules          | Keep server-only code (DB, secrets) in separate files not imported from CC          |
| Using `process.env.NEXT_PUBLIC_SECRET` for sensitive values               | Bundled into JS — visible in browser source                                    | Remove `NEXT_PUBLIC_` prefix; access in Server Component or Server Action           |

**🎯 Interview Pattern:**

- Khi thấy: "Why is 'use client' needed? Can you just use hooks everywhere?"
- → Nhớ: Server Components run in a different environment (no browser APIs, no React state) — 'use client' signals the bundler to include the file in the browser bundle
- → Mở đầu: "Server Components run on the server where `window`, `useState`, and event handlers don't exist. `'use client'` is a bundler directive — it tells Next.js to include that file and its imports in the client JavaScript bundle."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Server Components — architecture](./01-app-router-server-components.md)
- ➡️ Để hiểu: [Architecture & Rendering Strategies — rendering decision framework](./03-nextjs-architecture.md)

---

## Core Concept 3: Middleware, Navigation & Advanced Routing

> 🧠 **Memory Hook**: "Middleware runs at the **edge** (not Node.js) — instant, no cold start. Think of it as the bouncer: checks credentials before the door, redirects before any page renders."

**Tại sao tồn tại? / Why does this exist?**
Authentication redirects used to happen after the page rendered — the user saw a flash of protected content before being redirected.
→ Why is edge middleware better? It runs at Cloudflare/Vercel edge nodes (~30ms from user), checks auth before any response is sent.
→ Why can't you just check auth in getServerSideProps/Server Component? You can, but that means the server starts rendering the page before realizing the user isn't authenticated — wasted work and possible security risk.

### Layer 1: Middleware Patterns

```tsx
// middleware.ts — runs on Vercel/Cloudflare edge, not Node.js
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pattern 1: Auth guard
  const token = request.cookies.get("token");
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
  }

  // Pattern 2: Geo-based redirect
  const country = request.geo?.country;
  if (country === "VN" && !pathname.startsWith("/vn")) {
    return NextResponse.redirect(new URL(`/vn${pathname}`, request.url));
  }

  // Pattern 3: A/B testing (set cookie, read in component)
  const response = NextResponse.next();
  if (!request.cookies.has("variant")) {
    response.cookies.set("variant", Math.random() > 0.5 ? "a" : "b");
  }
  return response;
}

// Matcher: only run on matched routes (avoid running on _next, api, public)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

**Edge Runtime constraints**: no Node.js APIs (`fs`, `crypto`, `Buffer`), limited to Web APIs. No cold start (always warm). Max 128MB memory. Ideal for: routing, auth token validation, request modification — not for: DB queries, heavy computation.

### Layer 2: Navigation — Link vs useRouter

```tsx
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Declarative navigation — preferred
<Link href="/about">About</Link>
<Link href="/blog/post-1" prefetch={false}>Post 1</Link>  // disable prefetch for non-critical
<Link href={`/user/${id}`} replace>Profile</Link>          // replace history entry

// Programmatic navigation — use when navigation is a side effect of an action
'use client';
function LoginButton() {
  const router = useRouter();

  async function handleLogin() {
    await login();
    router.push('/dashboard');     // add to history
    // router.replace('/dashboard'); // replace current entry (no back button)
    // router.refresh();             // re-fetch server data for current route
    // router.prefetch('/dashboard'); // manually prefetch
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

### Layer 3: Parallel Routes & Intercepting Routes

**Parallel routes** — render multiple pages simultaneously in one layout:

```tsx
// app/layout.tsx receives @modal and children as separate slots
export default function Layout({ children, modal }) {
  return (
    <div>
      {children}
      {modal} {/* modal renders alongside main content, independent loading */}
    </div>
  );
}
// app/@modal/default.tsx — render nothing when no modal is active
export default function Default() {
  return null;
}
// app/@modal/photo/[id]/page.tsx — renders in @modal slot when /photo/123 is visited
```

**Intercepting routes** — show a route in a different context:

```
(.)    — same level     → /photo/[id] intercepts /photo/[id]
(..)   — one level up   → (feed)/(..)photo/[id] intercepts /photo/[id]
(...)  — from root      → any level
```

Instagram pattern: browsing feed → click photo → modal opens (intercepting), URL changes to `/photo/123` → share link opens full page (not intercepted).

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                      | Đúng là                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Using `useRouter` from `next/router` in App Router | `next/router` is Pages Router — throws error in App Router       | Use `useRouter`, `usePathname`, `useSearchParams` from `next/navigation`                     |
| Middleware that reads from database                | Edge Runtime has no Node.js — DB clients won't work              | Validate JWT token in middleware (CPU-only), then full auth check in Server Component/Action |
| Forgetting `matcher` in middleware config          | Middleware runs on EVERY request including static assets, images | Always configure `matcher` to exclude `_next/static`, `_next/image`, `favicon.ico`           |

**🎯 Interview Pattern:**

- Khi thấy: "How would you implement auth protection in Next.js App Router?"
- → Nhớ: Middleware (JWT validation at edge for redirects) + Server Component auth check (for data access) — two layers
- → Mở đầu: "I'd use two layers: middleware for redirect-based auth guards at the edge — validates the JWT token and redirects to `/login` for protected routes — and a Server Component auth check for API/database access authorization."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Data Fetching — Server Actions and cache invalidation](./02-data-fetching.md)
- ➡️ Để hiểu: [Web Security — auth patterns and JWT](../../shared/07-web-security/02-authentication.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is Next.js and why use it? / Next.js là gì và tại sao nên dùng? 🟢 Junior

**A:** Next.js is a React meta-framework that adds server-side rendering, static site generation, file-based routing, API routes, and React Server Components on top of React. App Router (Next.js 13+) is the modern version with Server Components as default.

Vietnamese: Next.js là React framework phổ biến nhất, cung cấp SSR, SSG, routing dựa trên file-system, và API routes. App Router là version mới với Server Components mặc định — giảm JS bundle, cải thiện SEO và performance.

**💡 Interview Signal:**

- ✅ Strong: Mentions Server Components default as a key differentiator (not just "SSR framework"), names App Router vs Pages Router distinction
- ❌ Weak: "It's a React framework with routing" (too vague — doesn't distinguish what Next.js adds vs plain React Router)

---

### Q: What is the difference between layout.tsx and page.tsx? 🟢 Junior

**A:** `layout.tsx` defines shared UI that **persists** across navigations — its state is preserved when navigating between child routes (sidebar stays open, scroll position maintained). `page.tsx` defines the unique content for a specific route and re-renders on every navigation to that route.

A route must have a `page.tsx` to be publicly accessible. `layout.tsx` is optional but the root `app/layout.tsx` is required by Next.js.

Vietnamese: `layout.tsx` = shared UI, không bị re-render khi navigate giữa route con (state giữ nguyên). `page.tsx` = nội dung unique của từng route, render lại khi truy cập. Dùng layout cho Header/Sidebar/Footer. State preservation là điểm quan trọng nhất.

**💡 Interview Signal:**

- ✅ Strong: Mentions state preservation across navigations (not just "shared UI"), mentions root layout requirement
- ❌ Weak: "layout.tsx wraps the page" (correct but misses the state persistence detail that makes layouts powerful)

---

### Q: What is Middleware in Next.js and when do you use it? 🟢 Junior

**A:** Middleware runs before every matched request at the Edge Runtime — before any page renders. Placed at `middleware.ts` at the project root, it intercepts requests for: authentication checks, redirects, A/B testing, geolocation routing, and request/response header modification.

Key constraint: runs on Edge Runtime (not Node.js) — no `fs`, no database clients, no Buffer. Only Web APIs and JWT validation (CPU-only crypto).

```tsx
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: "/dashboard/:path*" };
```

Vietnamese: Middleware chạy trên Edge Runtime trước khi request đến page/API. Dùng cho: auth redirect, A/B testing, geo-based routing. Chú ý: Edge Runtime không có Node.js APIs — không query DB trong middleware.

**💡 Interview Signal:**

- ✅ Strong: Mentions Edge Runtime constraint (no Node.js), gives specific use cases, shows the `matcher` config
- ❌ Weak: "Middleware checks auth before the page" (correct but doesn't mention Edge constraint which is the key architectural detail)

---

### Q: App Router vs Pages Router — what are the key differences? 🟡 Mid

**A:**

|                        | App Router                        | Pages Router                           |
| ---------------------- | --------------------------------- | -------------------------------------- |
| Default component type | Server Component                  | Client Component                       |
| Layouts                | Nested layouts, state preserved   | `_app.js`, always re-renders           |
| Data fetching          | `async/await` in Server Component | `getServerSideProps`, `getStaticProps` |
| Loading states         | `loading.tsx` automatic Suspense  | Manual state management                |
| Streaming              | Built-in with Suspense            | Not supported                          |
| Status                 | Future, new features              | Legacy, still maintained               |

**Migration**: both can coexist in the same project. `app/` routes use App Router; `pages/` routes use Pages Router. Migrate incrementally.

Vietnamese: App Router = Server Components default, nested layouts state-preserved, streaming via Suspense, data fetching với async/await. Pages Router = Client Components default, `getServerSideProps` pattern, flat layouts. App Router là future của Next.js.

**💡 Interview Signal:**

- ✅ Strong: Compares by default component type AND data fetching pattern AND layout persistence — all three matter for architecture decisions
- ❌ Weak: "App Router has Server Components and Pages Router doesn't" (partially correct but misses the layout, data fetching, and streaming differences)

---

### Q: How do environment variables work in Next.js? 🟡 Mid

**A:** Variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript — accessible in both Server and Client Components, visible in browser source code. Variables **without** this prefix are server-only — never exposed to the browser — safe for API keys, database credentials, JWT secrets.

```
NEXT_PUBLIC_API_URL=https://api.example.com   ← bundled into JS, public
DATABASE_URL=postgres://...                    ← server only, private
JWT_SECRET=super-secret                        ← server only, NEVER add NEXT_PUBLIC_
```

Vietnamese: `NEXT_PUBLIC_*` → embed vào JS bundle lúc build (public). Không có prefix → chỉ trên server (Server Components, Route Handlers, middleware). Quy tắc: **không bao giờ** đặt secret vào `NEXT_PUBLIC_*`. Dùng `.env.local` dev, platform env vars production.

**💡 Interview Signal:**

- ✅ Strong: Explains the build-time bundling mechanism for NEXT*PUBLIC*, gives example of what should NOT have the prefix (JWT_SECRET), mentions .env.local
- ❌ Weak: "NEXT*PUBLIC* is for client-side variables" (correct but doesn't explain the security risk of putting secrets there)

---

### Q: What is the Metadata API in Next.js? 🟡 Mid

**A:** Export a `metadata` object (static) or `generateMetadata` async function (dynamic) from `page.tsx` or `layout.tsx`. Next.js generates the correct `<head>` tags — title, description, OpenGraph, Twitter cards, canonical URLs — deduplicating and merging across nested layouts.

```tsx
// Static
export const metadata: Metadata = {
  title: "About | My Site",
  description: "Learn about us",
};

// Dynamic (async, receives route params)
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  return {
    title: `${post.title} | Blog`,
    openGraph: { images: [post.coverImage] },
  };
}
```

Vietnamese: Metadata API thay thế `<Head>` của Pages Router. Static cho pages không cần data, dynamic `generateMetadata` cho pages cần fetch (blog post title từ DB). Hỗ trợ title template (`%s | Site Name`), OpenGraph, robots, canonical — tất cả type-safe.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes static vs dynamic metadata, mentions the deduplication/merging behavior across nested layouts, notes type safety
- ❌ Weak: "Export metadata from page.tsx" (correct but misses generateMetadata for dynamic cases and the layout cascade behavior)

---

### Q: What are Server Actions in Next.js 14+? 🟡 Mid

**A:** Server Actions are async functions marked `'use server'` that run exclusively on the server and can be called directly from Client or Server Components — without writing a separate API route. They handle mutations (form submissions, database writes) and are integrated with Next.js cache via `revalidatePath`/`revalidateTag`.

Key advantages over API routes: no fetch boilerplate, automatic CSRF protection, progressive enhancement (work without JS for native forms), and built-in `useActionState` for pending/error state.

```tsx
"use server";
export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: formData.get("title") } });
  revalidatePath("/blog");
  redirect("/blog");
}
```

Vietnamese: Server Actions = async functions chạy trên server, gọi được từ component không cần API route riêng. Ưu điểm: ít boilerplate, CSRF protection tự động, progressive enhancement. Trade-off: business logic gắn với UI layer hơn — với app lớn cần tách biệt rõ ràng thì vẫn cần cân nhắc.

**💡 Interview Signal:**

- ✅ Strong: Mentions CSRF protection, progressive enhancement, cache integration with revalidatePath, and the trade-off for large apps
- ❌ Weak: "Server Actions run on the server without an API route" (correct but misses the security/cache/UX benefits that justify using them)

---

### Q: ISR vs on-demand revalidation — when to use each? 🔴 Senior

**A:** **ISR** (`revalidate: N`) — background regeneration after a time interval. First request after interval triggers rebuild; stale page served until complete (stale-while-revalidate). **On-demand** (`revalidatePath`/`revalidateTag`) — immediate cache purge triggered explicitly by a Server Action or Route Handler.

```
ISR: revalidate: 60      On-demand: revalidateTag('post-123')
├── Automatic             ├── Requires webhook/trigger
├── Stale ≤60s            ├── Near-instant freshness
├── No infra needed       ├── Needs webhook + secret rotation
└── Good for: news,       └── Good for: CMS, e-commerce
    product catalog           price changes
```

Best practice: **combine both** — ISR as fallback (`revalidate: 3600`) + on-demand webhook for immediate invalidation when content changes.

Vietnamese: ISR = time-based stale-while-revalidate, đơn giản nhưng chấp nhận stale window. On-demand = invalidate ngay lập tức, cần webhook infrastructure. Thực tế: dùng kết hợp — ISR là safety net, on-demand từ CMS webhook.

**💡 Interview Signal:**

- ✅ Strong: Explains the stale-while-revalidate behavior, names the infrastructure requirement for on-demand, suggests combining both
- ❌ Weak: "ISR is time-based, on-demand is immediate" (correct but doesn't explain the stale-while-revalidate semantics or the infra trade-off)

---

### Q: What are parallel routes and when do you use them? 🔴 Senior

**A:** Parallel routes render multiple independent pages simultaneously within the same layout using the `@folder` convention. Each slot (`@modal`, `@sidebar`) has its own independent loading, error, and not-found states.

**Use cases**: modal overlays that maintain background URL, analytics dashboards with independent-loading widgets, split-view layouts where each panel streams separately.

**With intercepting routes** (`(.)`, `(..)`): Instagram pattern — browsing `/feed`, click photo → URL changes to `/photo/123`, but background stays visible (intercepted). Sharing `/photo/123` opens the full photo page (no interception).

Vietnamese: Parallel routes dùng `@folder` — layout nhận các slot như props. Mỗi slot độc lập về loading/error. Kết hợp với intercepting routes (`(.)folder`) cho UX modal kiểu Instagram: URL thay đổi, background vẫn hiển thị, share link mở full page.

**💡 Interview Signal:**

- ✅ Strong: Explains independent loading states, gives the Instagram intercepting+parallel route pattern as a concrete example
- ❌ Weak: "Parallel routes render multiple things in one layout" (correct but doesn't explain the independent state or the intercepting route combination)

---

### Q: What are the common Next.js interview pitfalls to avoid? 🔴 Senior

**A:** Three major ones:

1. **Mixing router APIs**: `useRouter` from `next/router` (Pages) vs `next/navigation` (App) — they have different methods. `useRouter().push` in App Router → use `next/navigation`.

2. **`'use client'` scope confusion**: `'use client'` marks a module boundary, not just one component. All modules imported from it become client-side. Putting `'use client'` too high up in the tree defeats Server Components.

3. **Not mentioning trade-offs unprompted**: when asked "which rendering strategy", the answer without trade-offs signals shallow understanding. Always add: "SSG is fastest but stale; SSR is always fresh but higher TTFB; ISR is the middle ground."

Vietnamese: Ba lỗi hay gặp: (1) trộn API Pages Router / App Router. (2) không hiểu `'use client'` là module boundary, không phải chỉ annotation. (3) trả lời câu hỏi architecture mà không tự nêu trade-offs — interviewer senior expect điều này.

**💡 Interview Signal:**

- ✅ Strong: Specifically names `next/router` vs `next/navigation` API confusion, explains `'use client'` as module boundary (not annotation), emphasizes spontaneous trade-off discussion
- ❌ Weak: "Know your APIs" (too generic — doesn't identify the specific pitfalls)

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                 | Difficulty | Core Concept       | Key Signal                                                                     |
| --- | ------------------------------------------------------- | ---------- | ------------------ | ------------------------------------------------------------------------------ |
| 1   | Next.js là gì và tại sao nên dùng?                      | 🟢         | Next.js overview   | Server Components as key differentiator, App vs Pages Router distinction       |
| 2   | Sự khác biệt giữa layout.tsx và page.tsx?               | 🟢         | File conventions   | State preservation across navigations (not just "shared UI")                   |
| 3   | Middleware trong Next.js là gì và khi nào dùng?         | 🟢         | Middleware         | Edge Runtime constraint (no Node.js), matcher config, concrete use cases       |
| 4   | App Router vs Pages Router — các điểm khác biệt chính?  | 🟡         | Router comparison  | Default component type AND data fetching AND layout persistence AND streaming  |
| 5   | Biến môi trường hoạt động thế nào trong Next.js?        | 🟡         | Env variables      | Build-time bundling for NEXT*PUBLIC*, security risk of secrets with prefix     |
| 6   | Metadata API trong Next.js là gì?                       | 🟡         | SEO / Metadata     | Static vs dynamic generateMetadata, deduplication and merging across layouts   |
| 7   | Server Actions trong Next.js 14+ là gì?                 | 🟡         | Server Actions     | CSRF protection, progressive enhancement, cache integration, trade-offs        |
| 8   | ISR vs on-demand revalidation — khi nào dùng từng loại? | 🔴         | Cache invalidation | Stale-while-revalidate semantics, infra requirement, combining both strategies |
| 9   | Parallel routes là gì và khi nào dùng?                  | 🔴         | Advanced routing   | Independent loading states, Instagram intercepting+parallel route pattern      |
| 10  | Những lỗi phỏng vấn phổ biến cần tránh?                 | 🔴         | Interview pitfalls | next/router vs next/navigation, 'use client' as module boundary, trade-offs    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"A colleague adds 'use client' to app/layout.tsx to use a theme Context. What's wrong with this and how would you fix it?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "The problem: `'use client'` on `layout.tsx` turns the root layout and everything it imports into Client Components — every page in the entire app becomes a Client Component, losing all Server Component benefits."
2. "The fix is the Provider extraction pattern: create a `ThemeProvider.tsx` Client Component that only wraps the Context Provider, then import it in the Server Component layout."
3. "The layout stays a Server Component — it renders the static shell. Only `ThemeProvider` is a Client Component island."
4. "This way, all page-level components default to Server Components, keeping the JS bundle small, while the theme context is available throughout the tree."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                   |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết ra 6 special files của App Router (`PLER + T + R`) và mục đích của mỗi file — không nhìn lại.                                        |
| 2   | 🎨 Visual      | Sketch file tree cho SaaS app với: (marketing) pages, (app) authenticated pages, @modal parallel route — và cho biết URL của mỗi route.   |
| 3   | 🛠️ Application | Component cần dùng `framer-motion` cho animation. Server hay Client Component? Làm thế nào để giữ parent là Server Component?             |
| 4   | 🐛 Debug       | `useRouter` từ `next/router` bị lỗi trong App Router page. Fix thế nào? Sự khác biệt giữa `useRouter()` trong Pages Router vs App Router? |
| 5   | 🎓 Teach       | Giải thích sự khác biệt giữa `layout.tsx` và `template.tsx` cho developer mới — tại sao cần hai? Khi nào dùng `template.tsx`?             |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | P=`page.tsx`, L=`layout.tsx`, E=`error.tsx`, R=`route.ts` (API), T=`template.tsx` (re-mount on nav), R=`loading.tsx` (Suspense). Plus: `not-found.tsx`, `middleware.ts`.                |
| 2   | `app/(marketing)/page.tsx` → `/`. `app/(app)/dashboard/page.tsx` → `/dashboard`. `app/@modal/(.)photo/[id]/page.tsx` → parallel route, renders alongside current page.                  |
| 3   | Client Component (cần browser APIs/DOM). Pattern: `AnimatedWrapper` là `'use client'`, nhận `children` prop. Parent Server Component passes Server-rendered content as children.        |
| 4   | App Router: import từ `next/navigation` không phải `next/router`. `useRouter` từ `next/navigation` có API khác: không có `query` object, dùng `useSearchParams()` thay thế.             |
| 5   | `layout.tsx`: persist across navigation, state preserved. `template.tsx`: re-mount on every navigation, fresh state. Dùng `template` khi cần CSS transitions hay fresh state mỗi route. |

> 🎯 **Feynman Prompt:** "Giải thích tại sao `'use client'` trên `layout.tsx` là vấn đề — dùng ví dụ 'một đèn đỏ trên đường cao tốc' mà không dùng thuật ngữ kỹ thuật."
> 🔁 **Spaced Repetition reminder:** Ôn lại file này sau **3 ngày**, **7 ngày**, và **14 ngày**.

[← Back to Architecture](./03-nextjs-architecture.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [App Router & Server Components](./01-app-router-server-components.md) — Server/Client Component rules inside these route files
- [Data Fetching](./02-data-fetching.md) — how pages and layouts fetch data with App Router
- [Next.js Architecture](./03-nextjs-architecture.md) — rendering strategies powering each route segment
- [Next.js Fundamentals](./00-nextjs-fundamentals.md) — pre-App Router concepts for comparison

### Khác track (Cross-track)
- [React Fundamentals](../03-react/01-react-fundamentals.md) — React component model underlying App Router conventions
- [Hooks Deep Dive](../03-react/03-hooks-deep-dive.md) — hooks used within Client Components in App Router
- [React Performance](../06-browser-performance/02-react-performance.md) — layout/template re-mount and performance trade-offs
