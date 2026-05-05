# React Server Components Production Patterns 2026

> **Track**: Frontend (2026 Trends) | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Back to:** [📚 Table of Contents](../00-table-of-contents.md) | [2026 Trends Index](./README.md)

---

## 🌍 Real-World Scenario

**Vercel customer story (Q4 2025): Sonos.com migration to Next.js 15 App Router.**

The pre-migration Pages Router site shipped **640 KB of JS** to render the product listing page (PLP). Time-to-Interactive (TTI) on a Moto G Power was **6.8s**. The team migrated to RSC + Server Actions + Partial Prerendering (PPR) over 5 months. Result:

- JS bundle on PLP route: **640 KB → 89 KB** (–86%)
- TTI on Moto G Power: **6.8s → 1.9s**
- Conversion lift: **+11.4%**

But it didn't happen by flipping a switch. The team made **three painful mistakes** in the first month: (1) accidentally turned every component into a Client Component by importing icons from a barrel file, (2) leaked database credentials into a Client Component because they used `process.env.DB_URL` in a shared util, (3) waterfall-fetched 14 sequential queries because they `await`ed inside nested Server Components without `Promise.all`. Three Sentry alerts at 3 AM later, the team built a checklist that we'll teach in this file.

> **Vietnamese reinforcement:** RSC không phải là "viết React như cũ nhưng nhanh hơn." Nó là một **mô hình tính toán mới** nơi component có thể chạy trên server (zero JS gửi xuống), chạy trên client (interactive), hoặc cả hai. Hiểu sai biên giới → leak secret, waterfall, hoặc bundle phình.

---

## 🧠 A1. Memory Hook (Mnemonic)

> **"RSC = Render-Stream-Cache. Server renders, network streams, edges cache."**

Three-layer mental model:

```
┌─────────────────────────────────────────────────┐
│  RENDER  → Server Components produce RSC payload │
│           (serialized React tree, NO JS bundle)  │
├─────────────────────────────────────────────────┤
│  STREAM  → React streams payload chunk-by-chunk  │
│           (Suspense boundaries = stream breaks)  │
├─────────────────────────────────────────────────┤
│  CACHE   → 'use cache' + revalidate + tags       │
│           (per-route, per-component, per-fetch)  │
└─────────────────────────────────────────────────┘
```

**Vietnamese:** Render trên server → Stream qua mạng → Cache ở edge. Ba lớp này quyết định performance của một app RSC. Bỏ qua bất kỳ lớp nào → app sẽ chậm hoặc đắt.

---

## 💡 A2. Why RSC Exists (2 Levels Deep)

**Level 1 — Why not just SSR?**

Traditional SSR (Pages Router, getServerSideProps) renders HTML on the server, **then** ships the entire component tree as JS to the client for hydration. This means:

- The user downloads the JSX of every component, even purely presentational ones.
- Hydration is all-or-nothing: until the JS loads + runs, the page is non-interactive.
- Data fetching libraries (SWR, React Query) re-fetch on the client, doubling work.

**Level 2 — Why not just static generation?**

Static generation (SSG / ISR) is great for marketing pages but breaks down for personalized content (cart, user profile, A/B tests). You either: (a) make everything dynamic and lose the speed, (b) hydrate after with client fetches and lose the SEO/perf, or (c) build millions of static pages.

**RSC's insight:** Split the component tree by **data dependency**, not by route. Components that need server-only data (DB, secrets, large libs) render on the server and ship as RSC payload (smaller than HTML, no hydration). Components that need interactivity (`onClick`, `useState`) ship as Client Components. The boundary is explicit: `'use client'`.

> **Vietnamese:** SSR cũ ship cả cây component xuống client → tốn bandwidth + hydration chậm. SSG không xử lý được nội dung cá nhân hóa. RSC giải quyết bằng cách **chia cây theo dependency**: phần cần DB/secret chạy server, phần cần `onClick` chạy client. Ranh giới rõ ràng = `'use client'`.

---

## 🎯 A3. Core Concept #1 — Server vs Client Component Boundary

### Layer 1: Simple Analogy

Think of RSC like a **restaurant kitchen vs dining room**:

- **Kitchen (Server Component):** Has access to the pantry (database), the secret recipes (API keys), heavy equipment (large npm packages). Customers never see it. Output: a finished dish.
- **Dining room (Client Component):** Where customers interact (click, type, hover). Has menus (UI state) and waiters (event handlers). No access to the pantry.
- **`'use client'` directive:** The swinging door between kitchen and dining room. Once you walk through, you can't go back to the pantry.

### Layer 2: How It Works (Technical)

```
┌──────────────────── Server (Node/Edge) ──────────────────┐
│                                                          │
│   page.tsx (Server Component, default)                   │
│      │                                                   │
│      ├── async fetch(DB)  ← OK, server-only              │
│      ├── <ServerHeader />  ← Server Component            │
│      └── <ClientCart />   ← marked 'use client'          │
│                  │                                       │
│                  ↓ serialized as RSC payload reference   │
└──────────────────┼───────────────────────────────────────┘
                   ↓ (network: streamed RSC payload)
┌──────────────────┼─── Client (Browser) ──────────────────┐
│                  ↓                                       │
│   React reconciles RSC payload → renders DOM             │
│   For ClientCart: downloads JS chunk → hydrates          │
│   ServerHeader: NO JS, just DOM nodes                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Key rules:**

1. **Server Components are async by default.** You can `await` directly.
2. **Server Components cannot use `useState`, `useEffect`, browser APIs, or event handlers.**
3. **Client Components cannot directly import Server Components**, but CAN receive them as `children` props (composition pattern).
4. **The `'use client'` directive is contagious downward**, not upward. Everything imported into a Client Component becomes part of the client bundle.

```tsx
// ✅ Server Component (default in App Router)
// app/products/page.tsx
import { db } from "@/lib/db";
import AddToCart from "./add-to-cart"; // Client Component

export default async function ProductsPage() {
  const products = await db.product.findMany(); // ← runs on server
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name}
          <AddToCart productId={p.id} /> {/* ← interactive */}
        </li>
      ))}
    </ul>
  );
}

// ✅ Client Component
// app/products/add-to-cart.tsx
("use client");
import { useState } from "react";
export default function AddToCart({ productId }: { productId: string }) {
  const [adding, setAdding] = useState(false);
  return <button onClick={() => setAdding(true)}>Add</button>;
}
```

### Layer 3: Edge Cases & Gotchas

- **Barrel file trap:** Importing from `'lucide-react'` (barrel) into a Server Component then passing icons to a Client Component sometimes pulls the entire icon library into the client bundle. **Fix:** Import from specific subpaths (`'lucide-react/icons/check'`) or use Next.js `optimizePackageImports`.
- **`process.env` leak:** Any `process.env.X` referenced in a file that ends up in the client bundle is **inlined at build time**. Use `NEXT_PUBLIC_` prefix for client-safe vars; everything else stays server-only.
- **Async Client Components:** Not supported (yet). If you need to fetch from a Client Component, use Suspense + a Server Component wrapper, or use a hook like `use()` (React 19) with a promise passed as prop.
- **Context across boundary:** React Context only works within Client Components. To share data from server → client, pass as props.

> **Vietnamese:** Quy tắc vàng — `'use client'` lan từ trên xuống. File có `'use client'` + tất cả file nó import = client bundle. Server Component không có `useState`. Client Component không thể `import` Server Component (nhưng nhận được qua `children` prop).

---

## 🎯 A4. Core Concept #2 — Streaming with Suspense

### Layer 1: Simple Analogy

Imagine ordering a 5-course meal. Two options:

- **Option A (no streaming):** Wait until all 5 courses are ready, then waiter brings everything at once. You wait 30 minutes seeing nothing.
- **Option B (streaming):** Waiter brings each course as it's ready. Appetizer in 3 minutes, soup in 5 minutes, etc. You start eating immediately.

Suspense in RSC = Option B. Each `<Suspense>` boundary is a "course" that streams independently.

### Layer 2: How It Works (Technical)

```
Time  →
0ms   ┌─ Server starts rendering page.tsx
50ms  ├─ Sends: layout, header, navigation (no waits)
50ms  ├─ Hits <Suspense fallback={<Skeleton/>}>
      │     ├─ Sends fallback HTML immediately
      │     └─ Continues fetching ProductList in background
80ms  ├─ Sends: footer, sidebar
200ms ├─ ProductList query resolves
210ms └─ Sends: <script>$RC("S1", "...")</script> ← swap fallback for real content

Browser timeline:
0ms      [blank]
50-80ms  [header][nav][skeleton][sidebar][footer]   ← visible immediately
210ms    [header][nav][PRODUCTS][sidebar][footer]   ← progressively swapped
```

**Code pattern:**

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      <Header /> {/* renders immediately */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList /> {/* slow query, streams later */}
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews /> {/* independent slow query, streams in parallel */}
      </Suspense>
      <Footer /> {/* renders immediately */}
    </>
  );
}
```

**Critical:** Two sibling `<Suspense>` boundaries fetch in **parallel** (their data fetches kick off concurrently). But two sequential `await`s inside one component fetch serially. Always parallelize:

```tsx
// ❌ Waterfall: 200ms + 300ms = 500ms
async function Bad() {
  const user = await getUser(); // 200ms
  const posts = await getPosts(user.id); // 300ms (waits for user)
  return <UI user={user} posts={posts} />;
}

// ✅ Parallel: max(200ms, 300ms) = 300ms
async function Good() {
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(), // doesn't depend on user.id; restructure if it does
  ]);
  return <UI user={user} posts={posts} />;
}
```

### Layer 3: Edge Cases

- **`loading.tsx` vs `<Suspense>`:** `loading.tsx` is sugar for wrapping the entire route in `<Suspense>`. Use it for full-page loading; use explicit `<Suspense>` for granular streaming.
- **Streaming + SEO:** Googlebot now executes streamed responses correctly, but old crawlers may only see the fallback. For critical SEO content, render synchronously (no Suspense boundary).
- **Error boundaries:** `error.tsx` catches errors in its segment. A thrown error inside `<Suspense>` propagates up to the nearest error boundary, not the suspense fallback.
- **Streaming on Vercel Edge:** Works out-of-box. On Cloudflare Workers, requires `WritableStream` support (available in modern Workers).

> **Vietnamese:** Suspense = "chia trang thành nhiều phần độc lập, phần nào xong trước thì stream xuống browser trước." Hai Suspense anh em chạy song song. Hai `await` trong cùng component chạy nối tiếp (waterfall) — phải dùng `Promise.all`.

---

## 🎯 A5. Core Concept #3 — Server Actions

### Layer 1: Simple Analogy

Server Actions = **calling a server function as if it were local**, no API route boilerplate. Like having a hotline directly to the chef instead of writing a letter to the restaurant.

### Layer 2: How It Works (Technical)

```tsx
// app/products/actions.ts
"use server"; // ← marks the entire file as Server Actions

import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";

export async function addToCart(productId: string, qty: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  if (qty < 1 || qty > 10) throw new Error("Invalid qty");

  await db.cartItem.create({
    data: { userId: session.userId, productId, qty },
  });

  revalidateTag(`cart-${session.userId}`); // invalidate cached UI
  return { success: true };
}

// app/products/add-to-cart.tsx (Client Component)
("use client");
import { addToCart } from "./actions";
import { useTransition } from "react";

export default function AddToCart({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button disabled={pending} onClick={() => startTransition(() => addToCart(productId, 1))}>
      {pending ? "Adding…" : "Add to cart"}
    </button>
  );
}
```

**What happens under the hood:**

1. Build time: Next.js extracts `addToCart`, generates an HTTP endpoint (POST to a hashed path), and gives the client a reference (a thunk that POSTs).
2. Runtime: Click triggers the thunk → POST request → server runs the function → returns serialized result.
3. `revalidateTag` invalidates cache → next render fetches fresh data.

**Why this is huge:** No more `/api/cart/add` route file, no manual fetch/JSON.parse, no client-side validation duplication. Type safety end-to-end via TS.

### Layer 3: Edge Cases & Security

- **Auth is YOUR job.** Server Actions are just HTTP endpoints. Anyone can call them. **Always check session/permissions** at the top.
- **Input validation:** Use Zod or similar. Don't trust the client.
- **Rate limiting:** Wrap with rate limit middleware (e.g., Upstash Ratelimit) or use Vercel WAF.
- **Progressive enhancement:** Pass action to a `<form action={addToCart}>` to make it work without JS. The framework handles serialization of FormData.
- **Returning sensitive data:** Anything you `return` from a Server Action is sent to the client. Don't return DB models with hidden fields.

> **Vietnamese:** Server Action = "gọi function server từ client như gọi local." Không cần viết API route. Nhưng vì nó là HTTP endpoint, **phải tự check auth và validate input**. Đừng nghĩ là "internal" — bất kỳ ai cũng gọi được.

---

## 🎯 A6. Core Concept #4 — Caching Layers (`use cache` + Revalidation)

### Layer 1: Simple Analogy

RSC caching is like a **multi-level fridge system** in a restaurant:

- **Walk-in freezer (full route cache):** Whole prepared meal, lasts hours. Used for static pages.
- **Reach-in fridge (data cache):** Individual ingredients, lasts hours-days, can be invalidated by tag.
- **Counter prep (request memoization):** Same ingredient grabbed twice in one order? Use the one you already have.

### Layer 2: How It Works (Technical — Next.js 15+)

```tsx
// 1. Per-fetch caching (data cache)
const data = await fetch(url, {
  next: { revalidate: 3600, tags: ["products"] },
});

// 2. Per-component caching (Next.js 15 'use cache')
("use cache");
async function ExpensiveAggregation({ category }: { category: string }) {
  const stats = await db.$queryRaw`SELECT ...`;
  return <Stats data={stats} />;
}

// 3. Per-route caching (route segment config)
export const revalidate = 60; // ISR-like
export const dynamic = "force-static";

// 4. Invalidation
import { revalidateTag, revalidatePath } from "next/cache";
revalidateTag("products"); // invalidate all fetches tagged 'products'
revalidatePath("/products/[id]"); // invalidate route
```

**Decision flow:**

```
                ┌─ Is it user-specific?
                │
        Yes ────┤────── No
        │       │
        │       └─ Does it change often?
        │              │
        │       Yes ───┤─── No
        │       │      │
   Skip cache,  │      └─ Use 'use cache' or
   or scope by  │         force-static + ISR
   user ID tag  │
                │
                └─ Use revalidate: 60 + tag-based invalidation
```

### Layer 3: Edge Cases

- **PPR (Partial Prerendering, Next.js 15):** Combines static + dynamic in one route. Static shell prerendered at build, dynamic holes streamed at request. Enable with `experimental.ppr = 'incremental'` + per-route opt-in.
- **Cache key includes search params** for GET fetches; verify your params are deterministic (no `Date.now()` in URL).
- **Cookies & headers force dynamic:** Reading `cookies()` or `headers()` makes the route dynamic. To stay static, isolate dynamic parts inside a Suspense boundary.
- **Cache stampede:** When cache expires, multiple requests hit the origin. Mitigate with stale-while-revalidate semantics (Next.js does this by default with ISR).

> **Vietnamese:** 4 lớp cache: route, component (`'use cache'`), fetch, và request memoization. Invalidation bằng `revalidateTag` (cho data) hoặc `revalidatePath` (cho route). PPR cho phép trộn static + dynamic trong cùng một trang — phần dynamic stream qua Suspense.

---

## ⚠️ A7. Common Mistakes Table

| Sai lầm                                                                              | Tại sao sai                                                                 | Đúng là                                                                |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Đặt `'use client'` ở file root layout                                                | Mất hoàn toàn lợi thế RSC, mọi thứ thành client bundle                      | Chỉ đặt `'use client'` ở leaf component cần interactive                |
| Import barrel file (`'lucide-react'`) trong Server Component, pass icon xuống Client | Cả thư viện icon bị bundle vào client                                       | Import subpath cụ thể, hoặc dùng `optimizePackageImports` config       |
| `process.env.DB_URL` trong file shared util                                          | Secret bị inline vào client bundle nếu file đó được Client Component import | Tách util thành `db.server.ts` (server-only) + `format.ts` (shared)    |
| Sequential `await` trong Server Component                                            | Waterfall, latency cộng dồn (200 + 300 + 400 = 900ms)                       | `Promise.all([fetch1, fetch2, fetch3])` → 400ms                        |
| Server Action không check auth                                                       | Bất kỳ ai POST endpoint đó cũng chạy được                                   | Check `auth()` ở dòng đầu mọi action, validate input bằng Zod          |
| Trả DB model trực tiếp từ Server Action                                              | Lộ field nội bộ (passwordHash, internalNotes)                               | Map sang DTO trước khi return                                          |
| Dùng `useEffect` để fetch trong Client Component dù có thể fetch server              | Tốn round-trip, mất SEO, loading state thủ công                             | Fetch ở Server Component cha, pass xuống qua props                     |
| Quên `revalidateTag` sau mutation                                                    | UI hiển thị data cũ vì cache không invalidate                               | Sau mỗi mutation: `revalidateTag('xxx')` hoặc `revalidatePath('/yyy')` |
| Đọc `cookies()` ở route layout                                                       | Route trở thành dynamic 100%, mất ISR                                       | Đọc cookies ở leaf component bọc trong `<Suspense>`                    |
| Server Action return Date object                                                     | Date không serialize được, lỗi runtime                                      | Return `date.toISOString()`, parse ở client                            |

---

## 🎯 A8. Interview Pattern (Trigger Keywords + Opening)

**Trigger keywords:** "RSC", "Server Component", "App Router", "streaming", "Suspense", "Server Action", "Next.js performance", "hydration cost", "PPR", "use cache".

**Opening (1-2 sentences for any RSC question):**

> "Tôi tiếp cận RSC qua 3 trục: **boundary** (server vs client = data dependency, không phải file), **streaming** (Suspense + parallel fetch), và **caching** (4 lớp: route/component/fetch/memo + tag invalidation). Khi có một feature mới, tôi quyết định mỗi component thuộc trục nào trước khi viết code."

---

## 🔑 A9. Knowledge Chain

**📚 Prerequisites:**

- [React 19 Fundamentals](../fe-track/03-react/01-react-fundamentals.md)
- [React Hooks Deep Dive](../fe-track/03-react/03-hooks-deep-dive.md)
- [Next.js App Router](../fe-track/04-nextjs/01-nextjs-app-router.md)
- [Browser Rendering & Performance](../fe-track/06-browser-performance/01-rendering-pipeline.md)

**➡️ Enables:**

- [02 — LLM System Design](./02-llm-system-design.md) (RSC + AI streaming UI)
- [04 — Edge Computing](./04-edge-computing-serverless-2026.md) (RSC on edge runtimes)
- [10 — Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) (architecture trade-offs)

---

# Part B — Interview Q&A (Graded)

## 🟢 B1. What is the difference between a Server Component and a Client Component?

**💡 Interview Signal:**

- ✅ **Strong:** Mentions "data dependency boundary," gives concrete examples of what each can/can't do, mentions `'use client'` is downward-contagious.
- ❌ **Weak:** Says "Server Components run on server, Client Components run on browser" without nuance (technically wrong: Client Components also render on server during SSR).

**Answer (EN):**
A **Server Component** runs **only on the server** (build time or request time), produces an RSC payload (a serialized React tree, not HTML), and ships **zero JavaScript** to the client for itself. It can directly access databases, secrets, and large server-only libraries via `await`.

A **Client Component** runs on **both** the server (during initial SSR for the HTML) **and** the browser (for hydration and subsequent re-renders). It's marked with `'use client'` at the top of the file. It can use `useState`, `useEffect`, event handlers, and browser APIs.

The boundary is set by the `'use client'` directive. A Server Component can render a Client Component (passing serializable props), but a Client Component cannot directly import a Server Component — though it can receive one as a `children` prop (composition pattern).

**Key trap:** `'use client'` is **downward-contagious**. Every module imported by a Client Component becomes part of the client bundle.

**Vietnamese:** Server Component chạy **chỉ trên server**, không ship JS. Client Component chạy **cả server (initial SSR) và browser (hydration + re-render)**. `'use client'` đánh dấu boundary. Server Component có thể render Client Component (pass props), nhưng Client Component không import được Server Component (chỉ nhận qua `children`).

---

## 🟢 B2. When would you choose a Client Component over a Server Component?

**💡 Interview Signal:**

- ✅ **Strong:** Lists specific triggers (state, effects, event handlers, browser APIs, third-party client libs), and mentions composition pattern to keep boundary at the leaf.
- ❌ **Weak:** "When I need interactivity" without specifics.

**Answer (EN):**
Choose a Client Component when you need **any** of:

1. **State** (`useState`, `useReducer`)
2. **Effects** (`useEffect`, `useLayoutEffect`)
3. **Event handlers** (`onClick`, `onChange`, `onSubmit`)
4. **Browser APIs** (`window`, `localStorage`, `IntersectionObserver`)
5. **React Context** (providers must be Client Components)
6. **Third-party libs that depend on the above** (Framer Motion, React Hook Form, Mapbox)

**Critical practice:** Push `'use client'` as far down the tree as possible. Don't make the whole page a Client Component just because the "Add to Cart" button needs `onClick`. Keep the page Server, make `<AddToCart />` Client.

**Vietnamese:** Dùng Client Component khi cần state, effect, event handler, browser API, hoặc Context. Quy tắc: đẩy `'use client'` xuống lá càng sâu càng tốt. Đừng client-hóa cả trang chỉ vì một cái nút.

---

## 🟢 B3. How does streaming work with Suspense in RSC?

**💡 Interview Signal:**

- ✅ **Strong:** Explains streaming = HTTP chunked response, mentions parallel siblings, mentions waterfall-vs-`Promise.all`.
- ❌ **Weak:** "It shows a loading spinner."

**Answer (EN):**
React renders the tree top-down on the server. When it hits a `<Suspense fallback={...}>`, it sends the **fallback** down the wire immediately and continues rendering the suspended subtree in the background. When the suspended subtree resolves, React sends a small `<script>` that swaps the fallback for the real content **in place** — no client-side re-render, no re-mount.

The HTTP response stays open as a **chunked transfer**. Each Suspense boundary creates an independent chunk. Two sibling `<Suspense>` boundaries fetch their data in **parallel** (both kick off when the server hits them).

The pitfall: two sequential `await`s inside one component fetch **serially** (waterfall). Use `Promise.all`:

```tsx
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

**Vietnamese:** Server render xuống tree. Gặp Suspense → gửi fallback ngay, tiếp tục render phần bên trong background. Xong rồi gửi một script swap fallback → real content. HTTP giữ mở (chunked). Anh em Suspense chạy parallel; `await` nối tiếp = waterfall, dùng `Promise.all`.

---

## 🟡 B4. Explain Server Actions, including security considerations.

**💡 Interview Signal:**

- ✅ **Strong:** Describes how they compile to HTTP endpoints, mentions auth/validation/rate limiting as YOUR responsibility, mentions `useTransition` for pending state, mentions form action for progressive enhancement.
- ❌ **Weak:** "It's a function with `'use server'`." Doesn't mention security at all (red flag).

**Answer (EN):**
A Server Action is a function (or file) marked with `'use server'`. At build time, the framework extracts it and creates a hashed HTTP POST endpoint. The client gets a reference (a thunk). Calling the function from a Client Component sends a POST with serialized arguments; the server runs the function and returns the serialized result.

**Security is your job — they are public HTTP endpoints:**

1. **Auth check at the top:** `const session = await auth(); if (!session) throw new Error('Unauthorized')`.
2. **Validate input with Zod:** Don't trust client args.
3. **Rate limit:** Use Upstash Ratelimit, Vercel WAF, or middleware.
4. **CSRF:** Next.js validates Origin header automatically for Server Actions, but verify your config.
5. **Don't return sensitive fields:** Map DB models to DTOs.

**Pending state:** Use `useTransition` in the client:

```tsx
const [pending, startTransition] = useTransition()
startTransition(() => myAction(...))
```

**Progressive enhancement:** `<form action={myAction}>` works without JS — framework serializes FormData.

**Vietnamese:** Server Action = function có `'use server'`, compile thành HTTP endpoint ẩn. Client gọi qua POST. **Bảo mật là của bạn**: auth check đầu hàm, validate Zod, rate limit, không return field nhạy cảm. Pending state dùng `useTransition`. `<form action={...}>` cho progressive enhancement.

---

## 🟡 B5. What is Partial Prerendering (PPR) and when would you use it?

**💡 Interview Signal:**

- ✅ **Strong:** Explains static shell + dynamic holes via Suspense, gives a use case (e-commerce PLP with personalized cart icon), mentions opt-in config.
- ❌ **Weak:** "It's a Next.js feature for performance."

**Answer (EN):**
PPR (Partial Prerendering, stable in Next.js 15) lets a single route serve a **static shell** prerendered at build time **plus dynamic holes** streamed at request time. The dynamic parts are everything inside `<Suspense>` boundaries that read from `cookies()`, `headers()`, or `searchParams`.

**Use case:** An e-commerce product page where 95% of the page (product info, images, reviews, related items) is static across users, but the cart icon, "Recommended for You" section, and price (if personalized) are dynamic. Without PPR, the whole route is dynamic and you lose CDN caching. With PPR, the shell hits the CDN edge cache; the holes stream from origin in parallel with the cached shell.

**Config:**

```ts
// next.config.ts
export default {
  experimental: { ppr: "incremental" },
};

// route opt-in
export const experimental_ppr = true;
```

**When NOT to use:** Fully dynamic routes (admin dashboards), or routes where the dynamic part is tiny — overhead not worth it.

**Vietnamese:** PPR = static shell prerender lúc build + dynamic hole stream lúc request (qua Suspense đọc cookies/headers). Dùng cho trang có phần lớn static + một vài chỗ cá nhân hóa (e-commerce PLP). Shell cache CDN, hole stream parallel. Không dùng cho dashboard 100% dynamic.

---

## 🟡 B6. How do you avoid waterfall data fetching in RSC?

**💡 Interview Signal:**

- ✅ **Strong:** Identifies 3 patterns (parallel `Promise.all`, parallel sibling Suspense, preload pattern), mentions React 19 `use()` hook with promise.
- ❌ **Weak:** Only mentions `Promise.all`.

**Answer (EN):**
Three patterns:

1. **`Promise.all` for independent fetches in same component:**

```tsx
const [user, posts, ads] = await Promise.all([getUser(), getPosts(), getAds()]);
```

2. **Sibling Suspense boundaries** for independent slow sections — they fetch in parallel because each renders in its own task:

```tsx
<Suspense><Reviews /></Suspense>
<Suspense><Recommendations /></Suspense>
```

3. **Preload pattern** for fetches needed by descendants. Kick off the fetch eagerly without awaiting:

```tsx
// preload.ts
export function preload(id: string) {
  void getProduct(id);
}

// page.tsx
preload(id); // start fetch immediately
const user = await getUser(); // do other work
return <ProductDetail id={id} />; // by now, getProduct is hot in cache
```

4. **React 19 `use()` hook** to pass a promise as prop and unwrap in child:

```tsx
// parent (Server)
const productPromise = getProduct(id);
return <Child promise={productPromise} />;

// child (Client)
("use client");
import { use } from "react";
function Child({ promise }) {
  const product = use(promise); // suspends until resolved
  return <div>{product.name}</div>;
}
```

**Vietnamese:** 4 pattern: `Promise.all` cho fetch độc lập cùng component, sibling Suspense cho phần độc lập, preload pattern (kick off fetch sớm), và React 19 `use()` hook (pass promise → unwrap ở con).

---

## 🟡 B7. How does caching work in Next.js App Router (post v15)?

**💡 Interview Signal:**

- ✅ **Strong:** Names 4 layers (request memo, data cache, full route cache, router cache), explains opt-in vs opt-out changes in v15, mentions `'use cache'` and tag invalidation.
- ❌ **Weak:** "It uses ISR." (oversimplified)

**Answer (EN):**
Next.js 15 inverted the caching default — fetches are **uncached by default** (vs cached by default in 14). The 4 layers:

1. **Request Memoization** (auto): Same fetch in same render = one network call. React-level, can't disable.
2. **Data Cache** (opt-in): `fetch(url, { next: { revalidate: 60, tags: ['products'] } })`. Persistent across requests, invalidate via `revalidateTag`.
3. **Full Route Cache** (opt-in): Route prerendered at build (`force-static`) or with `revalidate = 60`. Served from CDN edge.
4. **Router Cache** (client-side, ephemeral): Browser-side cache of RSC payloads for back/forward. Configurable via `staleTimes`.

**`'use cache'` directive (v15):** Mark any function/component as cacheable:

```tsx
'use cache'
async function getProduct(id: string) { ... }
```

**Invalidation:**

- `revalidateTag('products')` — invalidate all fetches with this tag.
- `revalidatePath('/products/[id]', 'page')` — invalidate route.

**Best practice:** Tag your fetches by the entity they represent (`product-${id}`, `user-${userId}`); call `revalidateTag` after every mutation.

**Vietnamese:** v15 đảo default: fetch không cache mặc định nữa. 4 lớp: request memo (auto), data cache (opt-in qua `next.tags`), full route cache (opt-in qua `revalidate`/`force-static`), router cache (client-side ephemeral). `'use cache'` directive cho component cacheable. Invalidate bằng `revalidateTag`/`revalidatePath`.

---

## 🔴 B8. Design the architecture for an e-commerce product detail page that needs SEO, personalization, sub-2s LCP globally, and supports 10K req/s during flash sales. (Bloom L5 — Synthesis)

**💡 Interview Signal:**

- ✅ **Strong:** Layered approach: static shell + PPR holes, cache topology (CDN + Redis), invalidation strategy, fallback for cache stampede, monitoring plan, capacity numbers.
- ❌ **Weak:** "Use Next.js with caching."

**Answer (EN):**

**Architecture:**

```
┌────────────── Cloudflare CDN (global PoPs) ─────────────┐
│  Static shell (PPR) cached by URL+locale                │
│  Edge cache TTL: 1 hour, sWR: 24 hours                  │
└───────────────────────┬─────────────────────────────────┘
                        │ (miss/stale)
                        ↓
┌───────────── Vercel Edge Network (RSC origin) ──────────┐
│  Next.js 15 + PPR + use cache                           │
│  - Static shell: product info, images, reviews          │
│  - Dynamic holes (Suspense):                            │
│      ├─ <CartIcon /> (cookies → user cart count)        │
│      ├─ <PersonalizedRecs /> (user ID → ML inference)   │
│      └─ <PriceBadge /> (geo + A/B test)                 │
└───────────────┬─────────────────────────┬───────────────┘
                │ (data cache)             │ (server actions)
                ↓                         ↓
┌──────── Upstash Redis (read-through) ──┐  ┌── Postgres (writes) ──┐
│ product:{id} → 5min TTL                │  │ + Read replicas (3)   │
│ reviews:{id}:p1 → 1hr TTL              │  │ Connection pooling    │
│ recs:{userId} → 10min TTL              │  └────────────────────────┘
└────────────────────────────────────────┘
```

**Cache strategy:**

- **L1 (Edge):** Cloudflare CDN, HTML+RSC payload of static shell, key = URL + Accept-Language. TTL 1 hour, `stale-while-revalidate: 86400`.
- **L2 (Origin):** Next.js `'use cache'` on `getProduct()`, tagged `product-${id}`. Invalidate on admin mutation.
- **L3 (Redis):** Hot data (product, reviews) read-through cache. Reduces Postgres load 95%+.
- **L4 (Postgres):** Writes go here; reads only on cache miss.

**Personalization:**

- `<CartIcon>` and `<PriceBadge>` inside `<Suspense>` — these are dynamic holes. Stream from origin in ~50ms (Redis hit).
- ML recs precomputed nightly per user, cached in Redis with 10min TTL for online updates.

**Flash sale (10K req/s):**

- 99% requests hit CDN edge → ~10K req/s but distributed across 300 PoPs = ~33 req/s per PoP. Trivial.
- 1% misses go to origin → 100 req/s. Vercel Edge auto-scales.
- Postgres protected by Redis + read replicas. Writes (add to cart) hit master, rate-limited per user.

**Cache stampede prevention:**

- Use Vercel's built-in stale-while-revalidate (returns stale, revalidates in background).
- Lock-based fetch in Redis if needed (single fetcher per key).

**Invalidation on inventory change:**

```ts
// admin updates stock
await db.product.update(...)
revalidateTag(`product-${id}`)  // invalidates Next.js data cache
await redis.del(`product:${id}`) // invalidates Redis
// CDN invalidation via Cloudflare API
await cf.purgeTag(`product-${id}`)
```

**Monitoring:**

- LCP via Vercel Web Analytics (real user) + Lighthouse CI (synthetic).
- Cache hit ratio per layer (target: CDN >90%, Redis >85%, data cache >70%).
- p99 origin response time, alert if >500ms.

**Vietnamese:** 4 lớp cache (CDN edge → origin Next.js → Redis → Postgres). Static shell + PPR cho SEO + speed. Personalization qua Suspense holes (CartIcon, Recs). Flash sale: 99% trúng edge, 1% xuống origin có Redis bảo vệ Postgres. Invalidation: `revalidateTag` + Redis del + Cloudflare purge tag. Monitor cache hit ratio mỗi lớp.

---

## 🔴 B9. Compare RSC vs traditional SSR (Next.js Pages Router) vs SPA (CRA + REST API). When would you choose each in 2026? (Bloom L4-L5 — Analysis + Evaluation)

**💡 Interview Signal:**

- ✅ **Strong:** Multi-axis comparison (bundle size, TTI, SEO, dev complexity, hosting), concrete decision rubric, mentions migration cost.
- ❌ **Weak:** "RSC is always better."

**Answer (EN):**

**Comparison matrix:**

| Axis                        | RSC (App Router)                        | SSR (Pages Router)                    | SPA (CRA + REST)                          |
| --------------------------- | --------------------------------------- | ------------------------------------- | ----------------------------------------- |
| **Initial JS bundle**       | Smallest (only Client Components ship)  | Medium (whole tree hydrates)          | Largest (entire app)                      |
| **TTI on slow devices**     | Fastest                                 | Medium                                | Slowest                                   |
| **SEO**                     | Excellent (HTML + streaming)            | Excellent (HTML)                      | Poor (client-rendered)                    |
| **Data fetching DX**        | Direct `await` in components            | `getServerSideProps`/`getStaticProps` | Client fetch (SWR/React Query)            |
| **Server cost**             | Higher (RSC payload generation per req) | High (HTML render per req)            | Low (static + API calls)                  |
| **CDN cacheable**           | Yes (with PPR/ISR)                      | Yes (ISR)                             | Yes (HTML), but data is API               |
| **Real-time interactivity** | Need Client Components for it           | Native                                | Native                                    |
| **Dev complexity**          | High (boundary thinking)                | Medium                                | Low                                       |
| **Migration from legacy**   | Hard from SPA                           | Medium from SPA                       | N/A                                       |
| **Hosting**                 | Vercel/Cloudflare/Node                  | Same                                  | Static (S3/Cloudflare Pages) + API server |

**Decision rubric (2026):**

**Choose RSC (Next.js 15+ App Router) when:**

- Building a new content-heavy + interactive app (e-commerce, SaaS dashboard, AI app).
- Performance budget is tight (mobile, emerging markets).
- Team has senior FE + can invest in mental model.
- Want best SEO + best perf + low client JS.
- AI/streaming features (LLM responses stream naturally with RSC).

**Choose SSR Pages Router when:**

- Migrating a mature Next.js app that doesn't justify rewrite cost.
- Need a stable, well-documented framework with tons of community examples.
- Team unfamiliar with RSC and timeline doesn't allow learning curve.
- Heavy reliance on libraries that don't support RSC yet (rare in 2026).

**Choose SPA (Vite + React) when:**

- Internal tool / admin dashboard with no SEO need.
- Highly interactive (Figma-like, real-time collab, IDE).
- Backend already exists (Go/Java microservices) and FE just consumes APIs.
- Want simplest hosting model (static + API).
- Small team, low complexity tolerance.

**Migration cost reality:** SPA → RSC is the most painful (need to rethink data flow, adopt Server Actions, refactor providers). Pages Router → App Router is medium (incremental migration possible). SSR → SPA is easy but a regression.

**Vietnamese:** RSC = bundle nhỏ nhất, TTI nhanh nhất, nhưng dev complexity cao. SSR Pages Router = ổn định, dễ tài liệu hóa, nhưng bundle lớn hơn. SPA = đơn giản nhất, không SEO, không stream. Chọn RSC cho app content+interactive mới, performance gắt; SSR cho legacy migration; SPA cho admin tool / IDE-like / có sẵn backend.

---

## 🔴 B10. Design a real-time collaborative editor (Notion-like) using RSC. What goes server, what goes client, how do you handle real-time sync? (Bloom L6 — Creation)

**💡 Interview Signal:**

- ✅ **Strong:** Recognizes RSC is wrong tool for the _editor canvas_ (push to client), but right tool for _page shell, history, comments_. Designs hybrid architecture. Mentions CRDT, WebSocket/SSE, Server Actions for non-realtime mutations.
- ❌ **Weak:** "Use RSC for everything." (RSC is request-response, not push.)

**Answer (EN):**

**Critical insight:** RSC is **request-response model**, not push-based. A real-time collaborative canvas (cursor positions, character-by-character edits) needs WebSocket / WebRTC / SSE. So we use **hybrid architecture**.

```
┌────────────── App Router (RSC) ──────────────┐
│ Server Components:                           │
│   - Page shell (sidebar, breadcrumbs)        │
│   - Permission check (auth)                  │
│   - Initial document load (snapshot)         │
│   - Document history (Suspense + paginate)   │
│   - Comments thread (Suspense)               │
│   - SEO metadata                             │
│                                              │
│ Server Actions:                              │
│   - Create/delete page                       │
│   - Change permissions                       │
│   - Invite collaborator                      │
│   - Add comment (non-realtime)               │
└──────────────────┬───────────────────────────┘
                   │
                   ↓ initial RSC payload + snapshot
┌────────────── Client Components ─────────────┐
│   - <Editor /> (Tiptap/Lexical/ProseMirror)  │
│   - <PresenceLayer /> (other users' cursors) │
│   - <CommentSidebar /> (live comment thread) │
└──────────────────┬───────────────────────────┘
                   │
                   ↓ WebSocket connection
┌────────────── Realtime Layer ────────────────┐
│   Hocuspocus / Liveblocks / Yjs server       │
│   - Y.Doc CRDT per document                  │
│   - Awareness protocol (cursors, selection)  │
│   - Persists to Postgres every N ops or      │
│     on disconnect                            │
└──────────────────────────────────────────────┘
```

**Data flow:**

1. **Initial load:** User navigates to `/doc/123`.
   - RSC renders shell + permission check + initial snapshot (server fetches Y.Doc snapshot from DB).
   - Streams down with `<Suspense>` for comments and history.

2. **Editor mounts (Client Component):**
   - Receives initial Y.Doc snapshot as prop.
   - Opens WebSocket to Hocuspocus → loads same doc.
   - User types → CRDT op → broadcast to all connected clients.

3. **Presence:**
   - Awareness protocol over same WebSocket.
   - Other users' cursors render via `<PresenceLayer>`.

4. **Non-realtime mutations** (rename document, change permissions):
   - Server Action: `await renameDocument(id, name)`.
   - `revalidateTag('doc-list')` to update sidebar across tabs.

5. **Optimistic updates for non-realtime:**
   - `useOptimistic` (React 19) for instant UI feedback.

**Auth:**

- Server Component checks permission on initial render (returns 403 page if denied).
- WebSocket connection authenticated via signed token (server signs in initial render, passes to client, client sends in WS handshake).
- Hocuspocus validates token before allowing doc access.

**Persistence:**

- Y.Doc state persisted to Postgres BLOB every 30s or on last-user-disconnect.
- Snapshot for fast initial load (compressed Y.js update).
- Append-only ops log for audit/history.

**Why this hybrid is correct:**

- RSC excels at the **shell, auth, initial load, SEO, history list** — all request-response.
- Real-time editing needs **bi-directional push** which RSC doesn't do (and shouldn't try to).
- Server Actions handle **non-realtime mutations** (rename, share) cleanly.
- The team doesn't reinvent CRDT — uses Yjs.

**Vietnamese:** RSC là request-response, không push. Editor real-time cần WebSocket. Kiến trúc hybrid: RSC cho shell, auth, initial load, history, comments, SEO. Client Component (Tiptap/Lexical) + Yjs CRDT + Hocuspocus WebSocket cho editor canvas + presence. Server Actions cho mutation không realtime (rename, share). Auth: Server Component check permission, sign WS token. Persist Y.Doc snapshot mỗi 30s vào Postgres BLOB.

---

# Part C — Study Cases & Self-Assessment

## 📊 C1. Overview / Tổng Quan

This file covered React Server Components production patterns for 2026: the **Render-Stream-Cache** mental model, Server vs Client boundary discipline, Suspense streaming, Server Actions with security, and the 4-layer caching system. The big win is **shipping less JavaScript while keeping interactivity** — but only if you respect the boundary, parallelize fetches, and invalidate caches correctly.

**Vietnamese:** File này dạy 4 trục của RSC sản phẩm: boundary (server vs client), streaming (Suspense + parallel), Server Actions (function as endpoint, but YOU secure it), và caching (4 lớp + tag invalidation). Mục tiêu cuối: ship ít JS hơn nhưng vẫn giữ được tương tác — với điều kiện hiểu đúng từng trục.

---

## 📋 C2. Interview Q&A Summary Table

| #   | Question                          | Difficulty | Core Concept   | Key Signal                                                    |
| --- | --------------------------------- | ---------- | -------------- | ------------------------------------------------------------- |
| B1  | Server vs Client Component        | 🟢         | Boundary       | Mentions data dependency + downward contagion                 |
| B2  | When to use Client Component      | 🟢         | Boundary       | Lists 6 specific triggers, push-down principle                |
| B3  | How streaming with Suspense works | 🟢         | Streaming      | Mentions chunked transfer + parallel siblings                 |
| B4  | Server Actions + security         | 🟡         | Server Actions | Auth/validate/rate limit explicitly                           |
| B5  | Partial Prerendering (PPR)        | 🟡         | Caching        | Static shell + dynamic holes via Suspense                     |
| B6  | Avoiding waterfalls               | 🟡         | Streaming      | 4 patterns: `Promise.all`, sibling Suspense, preload, `use()` |
| B7  | Caching layers in App Router      | 🟡         | Caching        | Names 4 layers, v15 default flip                              |
| B8  | E-commerce PDP architecture       | 🔴         | Synthesis      | 4-layer cache + PPR + flash sale capacity                     |
| B9  | RSC vs SSR vs SPA decision        | 🔴         | Evaluation     | Multi-axis matrix + decision rubric                           |
| B10 | Real-time editor architecture     | 🔴         | Creation       | Hybrid: RSC for shell + WebSocket+Yjs for canvas              |

---

## ⚡ C3. Cold Call Simulation

**Interviewer:** "Walk me through what happens, frame-by-frame, when a user navigates to a Next.js 15 App Router page that uses RSC, Suspense, and Server Actions. I want to understand the wire."

**You (30-second answer):**

> "Browser sends GET. Server runs the route's Server Component tree top-down, awaiting data fetches inline. As soon as it has the layout shell, it streams HTML in chunks via chunked transfer encoding. When it hits a `<Suspense>`, it sends the fallback HTML immediately and continues rendering the suspended subtree concurrently. When that resolves, it sends an inline `<script>$RC(...)$` that swaps the fallback in place. Meanwhile, Client Components ship as separate JS chunks loaded via `<script>` tags; React hydrates them on the browser by attaching event handlers. If the user clicks a button bound to a Server Action, the client POSTs to a hashed endpoint with serialized args; the server runs the action, optionally calls `revalidateTag`, and returns the new state which React reconciles."

**Follow-up:** _"Where does the RSC payload come in vs HTML?"_

> "RSC payload is a separate format — a serialized React tree, not HTML. On initial navigation, the server sends both: HTML for first paint + RSC payload (in the same response stream, in special script tags) so React can reconcile and own the tree. On subsequent client-side navigations (Link click), only the RSC payload is fetched — no full HTML re-render."

---

## 📝 C4. Self-Check Retrieval (Close the doc)

After 24 hours, close this file and answer these 5 from memory:

1. **🧠 Retrieval:** What does the mnemonic RSC stand for in our 3-layer model?
2. **👁️ Visual:** Sketch the timeline of a streamed page with 2 sibling `<Suspense>` boundaries. Where does the fallback appear? When does the swap happen?
3. **🔧 Application:** You see a Server Component file with `import { db } from '@/lib/db'`. Someone wants to add `'use client'` to make a button interactive. What goes wrong, and how do you fix it without breaking either feature?
4. **🐛 Debug:** Your Server Action `addComment(text)` works in dev but on prod, every other user sees random comments mixed in. What's the bug?
5. **🎓 Teach:** Explain to a junior why `await getUser(); await getPosts(user.id);` is sometimes a waterfall and sometimes not.

> **Self-grading:** 5/5 = ready for senior interview. 3-4/5 = re-read sections. <3/5 = redo whole file in 2 days.

**Hints (Vietnamese):**

1. R-S-C: Render, Stream, Cache.
2. 2 fallback xuất hiện ngay cùng lúc với layout. Mỗi cái swap độc lập khi data của nó xong (parallel).
3. `'use client'` lan xuống → `db` import bị bundle vào client → leak credential. Fix: tách button thành file riêng có `'use client'`, giữ Server Component chính import `db`.
4. Thiếu auth check ở đầu Server Action → endpoint public → không kiểm tra session → comment lưu nhầm user. Hoặc cache key không scope theo user.
5. Nó là waterfall **khi** `getPosts` cần `user.id` (data dependency thật). Không phải waterfall **khi** ID có sẵn từ params và không cần đợi `getUser` — lúc đó `Promise.all` được.

---

## 💬 C5. Feynman Prompt

> "Explain RSC to a backend engineer who has never written React, in 3 minutes, without using the words 'component' or 'hydration.' Use only the concepts of HTTP responses, server-rendered templates, and JS bundles."

If you can do this, you understand it. Try it now (out loud, or to a colleague).

**Vietnamese prompt:** "Giải thích RSC cho một backend engineer chưa từng viết React, trong 3 phút, không dùng từ 'component' hay 'hydration'. Chỉ dùng khái niệm HTTP response, server template, và JS bundle."

---

## 🔁 C6. Spaced Repetition Schedule

| Day               | Action                                                            | Time    |
| ----------------- | ----------------------------------------------------------------- | ------- |
| **Day 1 (today)** | Read all sections, do one practice page                           | 90 min  |
| **Day 3**         | Re-do Self-Check (C4), redo any failed answers                    | 30 min  |
| **Day 7**         | Build a mini Next.js 15 app: PLP + PDP + cart with Server Actions | 4 hours |
| **Day 14**        | Mock interview: ask a friend B8 + B9 + B10                        | 1 hour  |
| **Day 30**        | Re-read Common Mistakes table + quiz yourself on table contents   | 20 min  |
| **Quarterly**     | Re-skim file, add new patterns from your real production work     | 30 min  |

---

## 🔗 C7. Connections

**Same track (FE):**

- [React Fundamentals](../fe-track/03-react/01-react-fundamentals.md)
- [React 19 & Concurrent Features](../fe-track/03-react/09-react-19.md)
- [Next.js App Router](../fe-track/04-nextjs/01-nextjs-app-router.md)
- [FE System Design](../fe-track/08-fe-system-design/01-fe-system-design-overview.md)
- [Browser Performance](../fe-track/06-browser-performance/01-rendering-pipeline.md)

**Cross-track:**

- [02 — LLM System Design](./02-llm-system-design.md) (RSC streams LLM responses naturally)
- [04 — Edge Computing](./04-edge-computing-serverless-2026.md) (running RSC on edge runtimes)
- [10 — Senior Engineer in AI Era](./10-senior-engineer-ai-era.md) (architecture decisions with AI)
- [BE System Design — Caching](../be-track/04-be-system-design/03-caching-strategies.md) (server-side cache patterns)
- [Web Performance](../shared/05-software-engineering/04-performance.md)

---

> **Final thought:** RSC is not "React, but faster." It's **a new computational model** where you decide, per component, where it runs. Junior devs put `'use client'` everywhere out of habit. Senior devs treat the boundary as an architecture decision — and reap the perf wins. In 2026, this is table-stakes for Next.js interviews at Vercel, Shopify, Sonos, and any company building consumer-grade web apps.

> **Vietnamese:** RSC không phải "React nhưng nhanh hơn." Nó là **mô hình tính toán mới**, nơi bạn quyết định từng component chạy ở đâu. Junior đặt `'use client'` khắp nơi vì quen tay. Senior coi boundary là **quyết định kiến trúc** — và gặt hái performance. 2026, đây là tiêu chuẩn cho phỏng vấn Next.js tại Vercel, Shopify, và mọi công ty làm web tiêu dùng nghiêm túc.
