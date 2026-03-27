# Next.js App Router Data Fetching / Lấy Dữ Liệu Trong Next.js App Router

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [App Router & Server Components](./01-app-router-server-components.md)
> **See also**: [Next.js Architecture](./03-nextjs-architecture.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Tiki's catalog team migrated their product pages from Pages Router to App Router. The marketing pages (product listings, category pages) served 80K+ requests/day — all publicly cacheable. The account/cart pages served 20K/day — all personalized, never cacheable.

Before migration: everything used `getServerSideProps` — even static marketing pages that changed once a week. Server was overwhelmed.

After migration:

- Marketing pages: `fetch(url, { next: { revalidate: 3600 } })` — served from CDN, 98% cache hit ratio
- Account pages: `fetch(url, { cache: 'no-store' })` — dynamic, always fresh
- Flash sales: `revalidateTag('flash-sale')` triggered by CMS webhook — updated within seconds of admin action

**The insight:** Data fetching strategy in Next.js is about classifying data by _freshness requirements + security sensitivity_, then choosing the right cache primitive for each class.

---

## What & Why / Cái Gì & Tại Sao

**English:** Next.js App Router data fetching is built on React Server Components + an extended `fetch()` with cache semantics. The key mental model: _location of data fetch = location of render_ — fetch in the component that needs the data, not a parent.

**Tiếng Việt:** Data fetching trong App Router xây dựng trên React Server Components + `fetch()` mở rộng với cache semantics. Mental model quan trọng: _fetch gần nơi cần dùng_ — không cần truyền data qua nhiều cấp component nữa.

---

## Core Concept 1: Cache Semantics & Request Deduplication / Ngữ Nghĩa Cache & Deduplication

> 🧠 **Memory Hook**: "Three modes: **force-cache** (frozen), **revalidate** (ISR — thaw on schedule), **no-store** (never frozen)"
>
> Each `fetch()` call in Next.js has an explicit cache contract, not implicit like Pages Router.

**Tại sao tồn tại? / Why does this exist?**

Server Components run on every request by default — without caching, every product page would hit the database 1000 times for the same catalog data.
→ Why can't we just cache at the CDN? Because the data needs to be mixed with per-user data before rendering — we need component-level cache control.
→ Why not cache everything? Because personalized data (cart, auth state) must never be shared across users.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

`fetch()` in Next.js is like a coffee machine with three settings:

- `force-cache`: "Make one batch in the morning, serve it all day" (static)
- `revalidate: 60`: "Make a new batch every 60 seconds if anyone orders" (ISR)
- `no-store`: "Fresh brew for every single customer" (dynamic)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Static: never re-fetch (equivalent to getStaticProps)
const res = await fetch("https://api.example.com/config", {
  cache: "force-cache",
});

// ISR: stale-while-revalidate on schedule
const res = await fetch("https://api.example.com/products", {
  next: { revalidate: 3600 }, // seconds
});

// Dynamic: always fresh (equivalent to getServerSideProps)
const res = await fetch("https://api.example.com/cart", {
  cache: "no-store",
});

// Tag-based: revalidate by event, not time
const res = await fetch("https://api.example.com/posts", {
  next: { tags: ["posts"] },
});
// Elsewhere: await revalidateTag('posts') // in Server Action or Route Handler

// Request deduplication — same URL in same render pass = one actual HTTP request
async function Header() {
  const user = await fetch("/api/me"); // request 1
  // ...
}
async function Sidebar() {
  const user = await fetch("/api/me"); // SAME request — deduplicated, uses memoized result
  // ...
}
```

```
NEXT.JS FETCH CACHE MODES:

  fetch(url, options)
       │
       ├── cache: 'force-cache'    → Data Store → serve cached forever
       │
       ├── next: { revalidate: N } → Data Store → serve cached
       │                              until N seconds → background refetch
       │                              (stale-while-revalidate)
       │
       ├── cache: 'no-store'       → Upstream API → fresh every request
       │
       └── next: { tags: [...] }   → Data Store → serve cached
                                     until revalidateTag() called
                                     (event-driven)

  Route-level override:
    export const dynamic = 'force-dynamic'  → all fetches = no-store
    export const revalidate = 60            → all fetches = revalidate: 60
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Opting a whole route into dynamic mode (overrides all fetch cache)
export const dynamic = "force-dynamic"; // in page.tsx or layout.tsx

// Cookies/headers/searchParams automatically make route dynamic
// (Next.js detects usage at build time)
import { cookies } from "next/headers";
export default async function Page() {
  const session = cookies().get("session"); // → route becomes dynamic automatically
}

// ISR: "stale" period — user gets old data until background regen completes
// For consistent reads (e.g., checkout), use no-store
// For marketing content, ISR is fine — milliseconds of stale is acceptable

// Pitfall: cache: 'force-cache' on personalized endpoint
const userProfile = await fetch("/api/me", { cache: "force-cache" });
// ❌ First user's profile served to all users from cache!
// ✅ Use no-store for any user-specific data
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                             | Đúng là                                         |
| --------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `cache: 'force-cache'` for personalized data  | Caches first user's data, serves to everyone            | Always `no-store` for user-specific data        |
| Using `no-store` everywhere                   | Defeats purpose of App Router caching, high server load | Classify data, use ISR for public content       |
| `revalidate: 0` to disable cache              | Equivalent to `no-store` but confusing intent           | Use `cache: 'no-store'` explicitly              |
| Forgetting that cookies() makes route dynamic | Entire route re-renders on every request                | OK for dynamic routes, avoid in static segments |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "Next.js data freshness", "when to cache", "ISR vs SSR"
- → Nhớ đến: classify data first (public stable vs personalized vs real-time), then pick cache mode
- → Mở đầu trả lời: "I classify the data by freshness requirement and security sensitivity first — static content gets `revalidate`, personalized data gets `no-store`, and event-driven content gets tag-based revalidation."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Server Components, App Router basics](./01-app-router-server-components.md)
- ➡️ Để hiểu: [On-demand revalidation, Server Actions](./03-nextjs-architecture.md)

---

## Core Concept 2: Parallel Fetching, Streaming & Error Handling / Fetch Song Song, Streaming & Xử Lý Lỗi

> 🧠 **Memory Hook**: "Waterfall = serial highway with traffic lights. Promise.all = parallel highway. Suspense = show the road while painting the rest."
>
> The goal: users see _something_ immediately, not a blank page waiting for the slowest query.

**Tại sao tồn tại? / Why does this exist?**

Sequential fetch creates "data waterfalls" — total wait time = sum of all queries. A page with 4 independent queries at 200ms each waits 800ms if sequential.
→ Why does this matter? Because TTFB (Time To First Byte) directly impacts Core Web Vitals and user experience.
→ Why not just fetch everything in parallel always? Sometimes queries ARE dependent (need user ID to fetch user data). Structure determines strategy.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Parallel fetching = ordering all dishes at once (they come when ready). Sequential = ordering starter, waiting for it, then ordering main. Streaming = the chef brings each dish immediately when it's ready, instead of waiting for the full order.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// ❌ Sequential waterfall — total time = 200ms + 150ms + 300ms = 650ms
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id); // 200ms
  const reviews = await getReviews(params.id); // 150ms — waits for product
  const related = await getRelatedProducts(params.id); // 300ms — waits for reviews
  return <div>...</div>;
}

// ✅ Parallel — total time = max(200ms, 150ms, 300ms) = 300ms
async function ProductPage({ params }: { params: { id: string } }) {
  const [product, reviews, related] = await Promise.all([
    getProduct(params.id),
    getReviews(params.id),
    getRelatedProducts(params.id),
  ]);
  return <div>...</div>;
}

// ✅ Streaming with Suspense — show fast parts immediately
async function ProductPage({ params }: { params: { id: string } }) {
  // Fast data — no Suspense
  const product = await getProduct(params.id); // 50ms
  return (
    <div>
      <ProductHeader product={product} /> {/* renders immediately */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} /> {/* streams when ready (~150ms) */}
      </Suspense>
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts productId={params.id} /> {/* streams when ready (~300ms) */}
      </Suspense>
    </div>
  );
}

// Reviews component fetches independently
async function Reviews({ productId }: { productId: string }) {
  const reviews = await getReviews(productId); // fetch happens here, not parent
  return <ReviewList reviews={reviews} />;
}
```

**Error handling — server components:**

```tsx
// error.tsx — segment-level error boundary (must be Client Component)
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
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

// not-found.tsx — 404 boundary
// Triggered by: notFound() in any Server Component
import { notFound } from "next/navigation";

async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound(); // renders not-found.tsx

  return <div>{product.name}</div>;
}

// Expected vs unexpected errors — Server Actions return Result types
async function createPost(data: FormData) {
  "use server";
  try {
    const post = await db.post.create({ data: parseFormData(data) });
    revalidateTag("posts");
    return { success: true, post };
  } catch (e) {
    // Don't throw — return error for UI handling
    return { success: false, error: "Failed to create post" };
  }
}
```

```
STREAMING TIMELINE:

  Request arrives
       │
       ├── [0ms]   Shell HTML sent (layout, static parts)
       ├── [50ms]  ProductHeader streamed (fast query done)
       ├── [150ms] Reviews streamed (medium query done)
       └── [300ms] Related products streamed (slowest query done)

  vs No Streaming:
       │
       └── [300ms] Everything sent at once (waited for slowest)

  With Suspense: user sees skeleton → content appears progressively
  Without:       user sees loading spinner → full page appears
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Dependent data: can't parallelize fully, but can start early
async function UserDashboard({ userId }: { userId: string }) {
  const user = await getUser(userId); // must come first

  // But once we have user, fetch everything else in parallel
  const [orders, preferences, notifications] = await Promise.all([
    getOrders(user.id),
    getPreferences(user.id),
    getNotifications(user.id),
  ]);
  // ...
}

// Sequential is sometimes intentional: read-after-write consistency
// After creating a post, re-fetch the list to get the updated state
async function createAndRedirect(formData: FormData) {
  "use server";
  await createPost(formData);
  revalidateTag("posts"); // invalidate cache
  redirect("/posts"); // redirect to fresh list
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                        | Tại sao sai                                      | Đúng là                                                            |
| -------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `await` inside a loop: `for (const id of ids) await fetch(id)` | Serial — N × request time                        | `Promise.all(ids.map(id => fetch(id)))`                            |
| Wrapping everything in one huge Suspense                       | User sees blank page until all data ready        | Multiple Suspense boundaries — one per independent slow section    |
| Not handling `!res.ok`                                         | Silent data errors — component renders undefined | Always check `if (!res.ok) throw new Error(...)` or `notFound()`   |
| Using `error.tsx` for expected errors (404, validation)        | Error page for user typos is poor UX             | Use `notFound()` for 404, return error objects from Server Actions |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "slow page load", "data waterfall", "streaming"
- → Nhớ đến: identify independent queries → parallelize with Promise.all → stream slow parts with Suspense
- → Mở đầu trả lời: "I'd first identify which data fetches are independent vs dependent. Independent ones run in parallel with Promise.all; slow independent sections get their own Suspense boundary so the fast parts stream first."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [React Suspense, async Server Components](./01-app-router-server-components.md)
- ➡️ Để hiểu: [Performance optimization, Core Web Vitals](../06-browser-performance/01-core-web-vitals.md)

---

## Core Concept 3: Mutation Patterns — Server Actions & Route Handlers / Pattern Mutation

> 🧠 **Memory Hook**: "Server Actions = API route that lives next to the component that calls it. Route Handler = standalone API endpoint."
>
> Server Actions collapse the client→server boundary: no `fetch('/api/...')`, just a function call.

**Tại sao tồn tại? / Why does this exist?**

Traditional mutations: write component → write API route → write fetch call → handle loading/error states separately. That's 4 layers of boilerplate for "save this form to the database."
→ Why do we need Route Handlers at all? For webhooks, third-party integrations, or when you need an actual HTTP endpoint (not just a function call).
→ Why not just use Server Actions for everything? Server Actions are tied to the Next.js runtime — Route Handlers can be deployed as standalone REST/GraphQL endpoints.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Server Actions = calling a co-worker directly — "Hey, save this." Fast, direct, no email thread.
Route Handlers = sending an official request form through the system — necessary for external parties, but more overhead for internal use.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```tsx
// Server Action — defined with 'use server'
// Option 1: inline in Server Component
async function submitForm(formData: FormData) {
  "use server"; // runs on server
  const title = formData.get("title") as string;
  await db.post.create({ data: { title } });
  revalidateTag("posts");
  redirect("/posts");
}

export default function NewPostPage() {
  return (
    <form action={submitForm}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}

// Option 2: separate 'use server' file (import from Client Components)
// actions.ts
("use server");
export async function createPost(prevState: unknown, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title) return { error: "Title required" };
  await db.post.create({ data: { title } });
  revalidateTag("posts");
  return { success: true };
}

// Client Component calling Server Action with useActionState
("use client");
import { useActionState } from "react";
import { createPost } from "./actions";

export function NewPostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>{isPending ? "Creating..." : "Create Post"}</button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}

// Route Handler — app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const posts = await db.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}

// Use Route Handlers for: webhooks, external API integrations, file uploads
export async function POST(request: NextRequest) {
  // Webhook from Stripe — must be raw body
  const sig = request.headers.get("stripe-signature");
  const body = await request.text(); // raw for signature verification
  const event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_SECRET!);
  // handle event...
  return NextResponse.json({ received: true });
}
```

```
SERVER ACTION vs ROUTE HANDLER:

                    Server Action       Route Handler
  ──────────────────────────────────────────────────────
  Calling method      Function call      HTTP fetch
  Client Component?   ✅ (with import)   ✅ (fetch)
  Server Component?   ✅ (inline form)   Only via fetch
  External services?  ❌ (Next.js only)  ✅ (HTTP endpoint)
  Webhook receiver?   ❌                 ✅
  Progressive enhance ✅ (form fallback) ❌
  Return value        State/redirect     HTTP response
  Best for            Forms, mutations   External APIs, webhooks
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```tsx
// Optimistic updates with Server Actions
"use client";
import { useOptimistic } from "react";
import { toggleLike } from "./actions";

function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, addOptimistic] = useOptimistic(post, (state, liked: boolean) => ({
    ...state,
    liked,
    likes: state.likes + (liked ? 1 : -1),
  }));

  async function handleLike() {
    addOptimistic(!optimisticPost.liked); // instant UI update
    await toggleLike(post.id); // server mutation (may fail)
    // if server fails, React reverts to the original `post` value
  }

  return (
    <button onClick={handleLike}>
      {optimisticPost.liked ? "❤️" : "🤍"} {optimisticPost.likes}
    </button>
  );
}

// Security: Server Actions must validate input
export async function deletePost(postId: string) {
  "use server";
  const session = await getServerSession();
  if (!session) throw new Error("Unauthorized");

  const post = await db.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== session.user.id) throw new Error("Forbidden");

  await db.post.delete({ where: { id: postId } });
  revalidateTag("posts");
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                  | Đúng là                                             |
| -------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| No auth check in Server Action               | Server Actions are callable by anyone with JS                | Always validate session + authorization             |
| `throw` for expected errors (validation)     | Causes error boundary to trigger                             | Return `{ error: 'message' }` for expected failures |
| Calling `revalidatePath('/')` for everything | Invalidates entire cache for small mutation                  | Use targeted `revalidateTag('posts')`               |
| Using Server Action for external webhook     | External services call HTTP endpoints, not Next.js functions | Use Route Handler for incoming webhooks             |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "form submission in Next.js", "avoid API boilerplate", "mutation + cache update"
- → Nhớ đến: Server Action = function call, useActionState for pending/error state, revalidateTag for targeted cache update
- → Mở đầu trả lời: "I'd use a Server Action here — it runs on the server, has direct database access, and I can call `revalidateTag` to update just the affected cache entries after the mutation."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Server Actions, 'use server' directive](./01-app-router-server-components.md)
- ➡️ Để hiểu: [Full-stack Next.js architecture patterns](./03-nextjs-architecture.md)

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                  | Difficulty | Core Concept      | Key Signal                                                                 |
| --- | -------------------------------------------------------- | ---------- | ----------------- | -------------------------------------------------------------------------- |
| 1   | Sự khác biệt giữa force-cache, revalidate, và no-store?  | 🟢         | Cache semantics   | Data classification rule: public stable vs periodic vs personalized        |
| 2   | generateStaticParams hoạt động thế nào và khi nào dùng?  | 🟢         | Static generation | dynamicParams option, behavior for paths NOT in the returned list          |
| 3   | Cách tránh data waterfalls trong Server Components?      | 🟡         | Parallel fetching | Promise.all vs Suspense streaming with timing numbers                      |
| 4   | Khi nào chọn Route Handler thay vì Server Action?        | 🟡         | Mutation patterns | External webhooks = Route Handler; progressive enhancement = Server Action |
| 5   | Design data fetching cho e-commerce product detail page? | 🔴         | Architecture      | Separate cache boundaries per data type, auth isolation to preserve ISR    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How does Next.js App Router data fetching differ from Pages Router, and when would you use each cache mode?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "App Router moves data fetching from page-level functions into individual Server Components — you fetch data right where you render it, eliminating prop drilling."
2. "The fetch API is extended with cache modes: `force-cache` for static, `revalidate` for ISR, and `no-store` for dynamic — each fetch call has its own cache contract."
3. "I classify data by freshness requirement: public stable content gets ISR, personalized data gets no-store, and event-driven content uses tag-based revalidation."
4. "This matters because it lets a single page have mixed cache strategies — the product info is CDN-cached while the user's price tier is always fresh, without a page-level compromise."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                    |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Viết 3 cache modes của `fetch` trong Next.js App Router từ trí nhớ: option syntax, behavior, và khi nào dùng mỗi cái.                      |
| 2   | 🎨 Visual      | Vẽ timeline streaming: request đến → shell HTML → ReviewsSkeleton → ReviewsContent. Mỗi bước xảy ra khi nào? Lợi ích so với blocking SSR?  |
| 3   | 🛠️ Application | Trang order history cần: header (static logo), user info (dynamic per user), order list (cached 5 phút). Viết fetch strategy cho mỗi phần. |
| 4   | 🐛 Debug       | Product page dùng `force-cache` nhưng user thấy cart data của user khác. Nguyên nhân là gì? Fix như thế nào?                               |
| 5   | 🎓 Teach       | Giải thích `revalidate: 60` bằng 1 câu analogy — không dùng thuật ngữ kỹ thuật như "cache" hay "revalidate".                               |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `force-cache` (default, cache mãi). `no-store` (không cache, fetch mỗi request). `{ next: { revalidate: N } }` (cache N giây rồi regenerate). Tags: `{ next: { tags: ['product'] } }`. |
| 2   | Request → HTML shell (layout, headers) gửi ngay → Suspense boundaries stream khi resolved: skeleton placeholder → real content. User thấy layout ngay, không đợi slowest data.         |
| 3   | Header: static import hoặc `force-cache`. User info: `{ cache: 'no-store' }` với user cookie. Orders: `{ next: { revalidate: 300 } }` (5 min).                                         |
| 4   | `force-cache` chia sẻ cache cross-user — user-specific data KHÔNG được cache ở server level. Fix: `{ cache: 'no-store' }` cho user data, hoặc dùng cookies làm cache key.              |
| 5   | Tờ báo: được in lúc 6am (cache), bạn đọc tới 7am thì nhận bản mới (revalidate). Bạn luôn đọc báo cũ nhất trong vòng 1 giờ — không bao giờ đợi báo in xong mới đọc.                     |

> 🎯 **Feynman Prompt:** Giải thích sự khác biệt giữa Server Actions và Route Handlers như đang giải thích cho một developer mới biết Next.js.
> 🔁 **Spaced Repetition reminder:** Review lại file này sau 3 ngày, rồi 7 ngày, rồi 14 ngày.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [App Router & Server Components](./01-app-router-server-components.md) — Server Components enable server-side data fetching
- [Next.js Architecture](./03-nextjs-architecture.md) — caching architecture behind ISR and revalidation
- [App Router Fundamentals](./04-nextjs-fundamentals-appRouter.md) — Suspense boundaries and streaming context
- [Next.js Fundamentals](./00-nextjs-fundamentals.md) — foundational fetch patterns and cache modes

### Khác track (Cross-track)
- [React Fundamentals](../03-react/01-react-fundamentals.md) — React Suspense model underpinning streaming
- [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — caching strategies directly improve LCP
- [React Performance](../06-browser-performance/02-react-performance.md) — avoiding waterfalls and unnecessary re-fetches
