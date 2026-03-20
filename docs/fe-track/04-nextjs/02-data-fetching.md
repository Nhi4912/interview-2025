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

**The insight:** Data fetching strategy in Next.js is about classifying data by *freshness requirements + security sensitivity*, then choosing the right cache primitive for each class.

---

## What & Why / Cái Gì & Tại Sao

**English:** Next.js App Router data fetching is built on React Server Components + an extended `fetch()` with cache semantics. The key mental model: *location of data fetch = location of render* — fetch in the component that needs the data, not a parent.

**Tiếng Việt:** Data fetching trong App Router xây dựng trên React Server Components + `fetch()` mở rộng với cache semantics. Mental model quan trọng: *fetch gần nơi cần dùng* — không cần truyền data qua nhiều cấp component nữa.

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
const res = await fetch('https://api.example.com/config', {
  cache: 'force-cache',
});

// ISR: stale-while-revalidate on schedule
const res = await fetch('https://api.example.com/products', {
  next: { revalidate: 3600 }, // seconds
});

// Dynamic: always fresh (equivalent to getServerSideProps)
const res = await fetch('https://api.example.com/cart', {
  cache: 'no-store',
});

// Tag-based: revalidate by event, not time
const res = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
});
// Elsewhere: await revalidateTag('posts') // in Server Action or Route Handler

// Request deduplication — same URL in same render pass = one actual HTTP request
async function Header() {
  const user = await fetch('/api/me'); // request 1
  // ...
}
async function Sidebar() {
  const user = await fetch('/api/me'); // SAME request — deduplicated, uses memoized result
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
export const dynamic = 'force-dynamic'; // in page.tsx or layout.tsx

// Cookies/headers/searchParams automatically make route dynamic
// (Next.js detects usage at build time)
import { cookies } from 'next/headers';
export default async function Page() {
  const session = cookies().get('session'); // → route becomes dynamic automatically
}

// ISR: "stale" period — user gets old data until background regen completes
// For consistent reads (e.g., checkout), use no-store
// For marketing content, ISR is fine — milliseconds of stale is acceptable

// Pitfall: cache: 'force-cache' on personalized endpoint
const userProfile = await fetch('/api/me', { cache: 'force-cache' });
// ❌ First user's profile served to all users from cache!
// ✅ Use no-store for any user-specific data
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `cache: 'force-cache'` for personalized data | Caches first user's data, serves to everyone | Always `no-store` for user-specific data |
| Using `no-store` everywhere | Defeats purpose of App Router caching, high server load | Classify data, use ISR for public content |
| `revalidate: 0` to disable cache | Equivalent to `no-store` but confusing intent | Use `cache: 'no-store'` explicitly |
| Forgetting that cookies() makes route dynamic | Entire route re-renders on every request | OK for dynamic routes, avoid in static segments |

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
> The goal: users see *something* immediately, not a blank page waiting for the slowest query.

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
  const product = await getProduct(params.id);     // 200ms
  const reviews = await getReviews(params.id);     // 150ms — waits for product
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
      <ProductHeader product={product} />  {/* renders immediately */}

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews productId={params.id} />  {/* streams when ready (~150ms) */}
      </Suspense>

      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts productId={params.id} />  {/* streams when ready (~300ms) */}
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
'use client';
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
import { notFound } from 'next/navigation';

async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound(); // renders not-found.tsx

  return <div>{product.name}</div>;
}

// Expected vs unexpected errors — Server Actions return Result types
async function createPost(data: FormData) {
  'use server';
  try {
    const post = await db.post.create({ data: parseFormData(data) });
    revalidateTag('posts');
    return { success: true, post };
  } catch (e) {
    // Don't throw — return error for UI handling
    return { success: false, error: 'Failed to create post' };
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
  'use server';
  await createPost(formData);
  revalidateTag('posts');      // invalidate cache
  redirect('/posts');          // redirect to fresh list
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `await` inside a loop: `for (const id of ids) await fetch(id)` | Serial — N × request time | `Promise.all(ids.map(id => fetch(id)))` |
| Wrapping everything in one huge Suspense | User sees blank page until all data ready | Multiple Suspense boundaries — one per independent slow section |
| Not handling `!res.ok` | Silent data errors — component renders undefined | Always check `if (!res.ok) throw new Error(...)` or `notFound()` |
| Using `error.tsx` for expected errors (404, validation) | Error page for user typos is poor UX | Use `notFound()` for 404, return error objects from Server Actions |

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
  'use server'; // runs on server
  const title = formData.get('title') as string;
  await db.post.create({ data: { title } });
  revalidateTag('posts');
  redirect('/posts');
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
'use server';
export async function createPost(prevState: unknown, formData: FormData) {
  const title = formData.get('title') as string;
  if (!title) return { error: 'Title required' };
  await db.post.create({ data: { title } });
  revalidateTag('posts');
  return { success: true };
}

// Client Component calling Server Action with useActionState
'use client';
import { useActionState } from 'react';
import { createPost } from './actions';

export function NewPostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}

// Route Handler — app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

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
  const sig = request.headers.get('stripe-signature');
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
'use client';
import { useOptimistic } from 'react';
import { toggleLike } from './actions';

function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, addOptimistic] = useOptimistic(
    post,
    (state, liked: boolean) => ({ ...state, liked, likes: state.likes + (liked ? 1 : -1) })
  );

  async function handleLike() {
    addOptimistic(!optimisticPost.liked); // instant UI update
    await toggleLike(post.id);            // server mutation (may fail)
    // if server fails, React reverts to the original `post` value
  }

  return (
    <button onClick={handleLike}>
      {optimisticPost.liked ? '❤️' : '🤍'} {optimisticPost.likes}
    </button>
  );
}

// Security: Server Actions must validate input
export async function deletePost(postId: string) {
  'use server';
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const post = await db.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== session.user.id) throw new Error('Forbidden');

  await db.post.delete({ where: { id: postId } });
  revalidateTag('posts');
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| No auth check in Server Action | Server Actions are callable by anyone with JS | Always validate session + authorization |
| `throw` for expected errors (validation) | Causes error boundary to trigger | Return `{ error: 'message' }` for expected failures |
| Calling `revalidatePath('/')` for everything | Invalidates entire cache for small mutation | Use targeted `revalidateTag('posts')` |
| Using Server Action for external webhook | External services call HTTP endpoints, not Next.js functions | Use Route Handler for incoming webhooks |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "form submission in Next.js", "avoid API boilerplate", "mutation + cache update"
- → Nhớ đến: Server Action = function call, useActionState for pending/error state, revalidateTag for targeted cache update
- → Mở đầu trả lời: "I'd use a Server Action here — it runs on the server, has direct database access, and I can call `revalidateTag` to update just the affected cache entries after the mutation."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Server Actions, 'use server' directive](./01-app-router-server-components.md)
- ➡️ Để hiểu: [Full-stack Next.js architecture patterns](./03-nextjs-architecture.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What's the difference between `cache: 'force-cache'`, `next: { revalidate }`, and `cache: 'no-store'`? 🟢 Junior

**A:** These are Next.js's three cache modes for server-side data fetching:

- `force-cache`: Fetch once, serve forever from cache. Use for: truly static data (site config, rarely-changing content).
- `next: { revalidate: N }`: ISR — serve from cache, but background-refresh after N seconds if someone requests it. Use for: public content that changes occasionally (blog posts, product catalog).
- `no-store`: Never cache — fresh fetch every request. Use for: personalized data (user profile, cart, auth state).

```tsx
// Choose based on data type:
const siteConfig = await fetch('/api/config', { cache: 'force-cache' }); // static forever
const products = await fetch('/api/products', { next: { revalidate: 3600 } }); // hourly
const cart = await fetch('/api/cart', { cache: 'no-store' }); // always fresh
```

**Giải thích:** Quy tắc phân loại: dữ liệu công khai và ổn định → `force-cache`, công khai nhưng thay đổi định kỳ → `revalidate`, cá nhân hoá hoặc nhạy cảm → `no-store`.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Gives a real data classification rule (public stable vs periodic vs personalized), mentions the security risk of caching personalized data
- ❌ Weak: Only knows "no-store = dynamic" without explaining the tradeoffs or when to choose each

---

### Q: How does `generateStaticParams` work and when would you use it? 🟢 Junior

**A:** `generateStaticParams` pre-generates the list of dynamic route params at build time, so Next.js can statically render those pages.

```tsx
// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await fetch('/api/products/all').then(r => r.json());
  return products.map((p: Product) => ({ id: p.id }));
  // Returns: [{ id: '1' }, { id: '2' }, ...{ id: '10000' }]
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductView product={product} />;
}
```

Use it when: you have a known set of paths (or can enumerate them) and want them pre-rendered for speed. Combine with `revalidate` for ISR — pages are rebuilt on-demand after the schedule expires.

For paths NOT in `generateStaticParams`: by default Next.js renders them dynamically on first request. Set `export const dynamicParams = false` to 404 them instead.

**Giải thích:** Tương tự `getStaticPaths` trong Pages Router nhưng đơn giản hơn. Với 10K sản phẩm, có thể chỉ pre-render top 100 (nhất), còn lại render on-demand và cache sau đó.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Mentions the `dynamicParams` option, explains what happens for paths NOT in the list, shows the return shape correctly
- ❌ Weak: Only knows the function signature without explaining the "what about paths not returned" edge case

---

### Q: Explain how to avoid data waterfalls in React Server Components. 🟡 Mid

**A:** Waterfalls happen when each `await` blocks the next. The fix: identify which fetches are independent, then run them in parallel.

```tsx
// ❌ Waterfall: 3 independent fetches run serially = 650ms total
async function Dashboard({ userId }: { userId: string }) {
  const user = await getUser(userId);       // 200ms
  const orders = await getOrders(userId);   // 250ms — waits for user
  const analytics = await getAnalytics(userId); // 200ms — waits for orders
  return <div>...</div>;
}

// ✅ Parallel: 3 independent fetches run together = 250ms total
async function Dashboard({ userId }: { userId: string }) {
  const [user, orders, analytics] = await Promise.all([
    getUser(userId),
    getOrders(userId),
    getAnalytics(userId),
  ]);
  return <div>...</div>;
}

// ✅ Streaming: show fast parts immediately, stream slow parts
async function Dashboard({ userId }: { userId: string }) {
  const user = await getUser(userId); // 50ms — fast, render immediately
  return (
    <>
      <UserHeader user={user} />
      <Suspense fallback={<OrdersSkeleton />}>
        <Orders userId={userId} />     {/* streams at ~250ms */}
      </Suspense>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics userId={userId} />  {/* streams at ~200ms */}
      </Suspense>
    </>
  );
}
```

**Giải thích:** Rule of thumb: dùng `Promise.all` khi tất cả data cần có trước khi render. Dùng Suspense khi muốn stream — tách components tách biệt và để Next.js stream từng phần khi sẵn sàng.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Distinguishes Promise.all (parallel, wait for all) vs Suspense streaming (progressive), gives timing numbers to show impact
- ❌ Weak: Only mentions "use Promise.all" without explaining when streaming is better

---

### Q: When would you choose a Route Handler over a Server Action, and vice versa? 🟡 Mid

**A:** The decision tree:

**Use Server Action when:**
- Mutation from a form or button click in your own Next.js app
- You want progressive enhancement (form works without JS)
- The mutation and its cache invalidation are tightly coupled
- No external service needs to call this endpoint

**Use Route Handler when:**
- External service needs to call this endpoint (webhooks from Stripe, GitHub, Slack)
- You need a standard REST/GraphQL API for mobile apps or third-party consumers
- File upload endpoint (needs raw body parsing)
- You need custom HTTP headers or status codes in response

```tsx
// Server Action: form mutation in your app
export async function updateProfile(formData: FormData) {
  'use server';
  await db.user.update({ where: { id: session.userId }, data: parseForm(formData) });
  revalidateTag('profile');
  redirect('/profile');
}

// Route Handler: Stripe webhook (must be HTTP endpoint)
// app/api/webhooks/stripe/route.ts
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text(); // raw body for signature verification
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_SECRET!);
  // handle event, update database...
  return NextResponse.json({ received: true });
}
```

**Giải thích:** Server Actions là "internal RPC" — perfect cho mutations trong app. Route Handlers là "external HTTP API" — cần khi thế giới bên ngoài cần gọi vào. Đừng dùng Route Handler cho form submission nếu không có lý do cụ thể — Server Action ít boilerplate hơn nhiều.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Names "external service webhooks" as the clear Route Handler use case, mentions progressive enhancement for Server Actions, gives webhook example
- ❌ Weak: "Route Handlers are for APIs" — too vague, doesn't explain when Server Actions are better

---

### Q: Design the data fetching architecture for an e-commerce product detail page that serves both anonymous and logged-in users. 🔴 Senior

**A:** The challenge: anonymous users get cached pages (fast CDN), logged-in users need personalized data (dynamic). We need both at different granularities.

```
Architecture decision:

  /products/[id]/page.tsx
  ├── Static shell (generateStaticParams + ISR revalidate: 3600)
  │   ├── Product info, images, description → cached
  │   └── Price, availability → ISR (changes occasionally)
  │
  ├── Client boundary for personalized sections
  │   ├── <Suspense fallback={...}>
  │   │   └── <PersonalizedPrice /> → client component, SWR
  │   ├── <Suspense fallback={...}>
  │   │   └── <CartButton userId={...} /> → reads from client state
  │   └── <Suspense fallback={...}>
  │       └── <RecentlyViewed /> → localStorage + client
```

```tsx
// Main page — static product data
export async function generateStaticParams() {
  return getTopProducts(1000).then(ps => ps.map(p => ({ id: p.id })));
}
export const revalidate = 3600; // product info changes rarely

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id); // cached, fast
  if (!product) notFound();

  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />

      {/* Personalized price: uses server component but no-store */}
      <Suspense fallback={<PriceSkeleton />}>
        <DynamicPrice productId={product.id} />
      </Suspense>

      {/* Cart interaction: client component */}
      <Suspense fallback={<AddToCartSkeleton />}>
        <AddToCartButton productId={product.id} />
      </Suspense>

      {/* Related products: cached */}
      <Suspense fallback={<RelatedSkeleton />}>
        <RelatedProducts category={product.category} />
      </Suspense>
    </div>
  );
}

// Dynamic price — personalized, always fresh
async function DynamicPrice({ productId }: { productId: string }) {
  const pricing = await fetch(`/api/pricing/${productId}`, {
    cache: 'no-store',
    headers: { Cookie: cookies().toString() }, // include session for B2B pricing
  });
  const { price, discount } = await pricing.json();
  return <PriceDisplay price={price} discount={discount} />;
}

// Related products — cached separately from main product
async function RelatedProducts({ category }: { category: string }) {
  const related = await fetch(`/api/products?category=${category}&limit=4`, {
    next: { revalidate: 7200 }, // cached 2 hours — changes rarely
  });
  return <ProductGrid products={await related.json()} />;
}
```

Key architecture decisions:
1. **Separate cache boundaries**: product info (ISR 1hr) vs pricing (no-store) vs related (ISR 2hr)
2. **Suspense per independent section**: streams progressively, fast product info appears first
3. **No auth in page.tsx**: auth state lives in dedicated `DynamicPrice` component to preserve ISR for the page shell
4. **Edge: flash sale pricing** — use `revalidateTag('pricing')` triggered by admin CMS action

**Giải thích:** Không một strategy nào phù hợp toàn bộ page. Phân tách page thành "product data" (stable, cacheable) và "user-specific data" (dynamic). ISR phục vụ 95% traffic từ CDN; chỉ personalized sections mới hit server on every request.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Identifies different cache strategies per data type, uses multiple Suspense boundaries, explains auth isolation to preserve ISR, considers flash sale scenario
- ❌ Weak: "Put everything in getServerSideProps" — misses caching opportunity, doesn't distinguish stable vs personalized data

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How does Next.js App Router data fetching differ from Pages Router, and when would you use each cache mode?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "App Router moves data fetching from page-level functions into individual Server Components — you fetch data right where you render it, eliminating prop drilling."
2. "The fetch API is extended with cache modes: `force-cache` for static, `revalidate` for ISR, and `no-store` for dynamic — each fetch call has its own cache contract."
3. "I classify data by freshness requirement: public stable content gets ISR, personalized data gets no-store, and event-driven content uses tag-based revalidation."
4. "This matters because it lets a single page have mixed cache strategies — the product info is CDN-cached while the user's price tier is always fresh, without a page-level compromise."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết 3 cache modes của fetch trong Next.js App Router từ trí nhớ — không nhìn lại.
- [ ] **Visual**: Vẽ timeline streaming: request đến → shell HTML → ReviewsSkeleton → ReviewsContent. Bao nhiêu ms mỗi bước?
- [ ] **Application**: Trang order history cần: header (static logo), user info (dynamic), order list (cached 5 min). Bạn fetch như thế nào?
- [ ] **Debug**: Product page dùng `force-cache` nhưng user sees other user's cart data. Nguyên nhân là gì? Fix như thế nào?
- [ ] **Teach**: Giải thích ISR (`revalidate: 60`) bằng 1 câu analogy — không dùng thuật ngữ kỹ thuật.

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa Server Actions và Route Handlers như đang giải thích cho một developer mới biết Next.js.

🔁 **Spaced Repetition reminder:** Review lại file này sau 3 ngày, rồi 7 ngày, rồi 14 ngày.
