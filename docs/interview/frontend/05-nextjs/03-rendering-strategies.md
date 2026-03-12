# Rendering Strategies - SSR, SSG, ISR

> Hiểu rendering strategies là key để optimize Next.js app. Chọn đúng strategy cho từng use case.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING STRATEGIES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STATIC (Build Time)              DYNAMIC (Request Time)        │
│   ┌─────────────────────┐         ┌─────────────────────┐       │
│   │ SSG                 │         │ SSR                 │       │
│   │ Static Site Gen     │         │ Server-Side Render  │       │
│   │ ────────────────    │         │ ────────────────    │       │
│   │ • Built at build    │         │ • Built per request │       │
│   │ • Cached on CDN     │         │ • Always fresh      │       │
│   │ • Fastest delivery  │         │ • Personalized      │       │
│   │ • Good for static   │         │ • Good for dynamic  │       │
│   └─────────────────────┘         └─────────────────────┘       │
│                                                                   │
│   HYBRID                                                         │
│   ┌─────────────────────┐         ┌─────────────────────┐       │
│   │ ISR                 │         │ Streaming SSR       │       │
│   │ Incremental Static  │         │ ────────────────    │       │
│   │ ────────────────    │         │ • Progressive HTML  │       │
│   │ • Static + revalidate│        │ • Suspense boundaries│      │
│   │ • Best of both      │         │ • Better TTFB       │       │
│   │ • Background update │         │ • Parallel fetching │       │
│   └─────────────────────┘         └─────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Static Site Generation (SSG)

### Basic SSG

```typescript
// app/blog/page.tsx - Static by default
// Data fetched at BUILD time

async function BlogPage() {
    // This runs at build time
    const posts = await fetch('https://api.example.com/posts', {
        cache: 'force-cache' // Default - cache forever
    }).then(res => res.json());

    return (
        <div>
            <h1>Blog Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default BlogPage;
```

### Dynamic Routes with SSG

```typescript
// app/blog/[slug]/page.tsx

// Generate static pages at build time
export async function generateStaticParams() {
    const posts = await fetch('https://api.example.com/posts').then(r => r.json());

    return posts.map(post => ({
        slug: post.slug,
    }));
}

// Each page is generated at build time
async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await fetch(
        `https://api.example.com/posts/${params.slug}`,
        { cache: 'force-cache' }
    ).then(r => r.json());

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </article>
    );
}

export default BlogPost;
```

### When to Use SSG

```
✅ Good for:
• Marketing pages
• Blog posts
• Documentation
• Product listings
• Portfolio sites

❌ Not good for:
• User dashboards
• Real-time data
• Personalized content
• Frequently updated data
```

---

## 🔄 Server-Side Rendering (SSR)

### Basic SSR

```typescript
// app/dashboard/page.tsx
// Opt out of caching - render fresh every request

async function DashboardPage() {
    // This runs on EVERY request
    const data = await fetch('https://api.example.com/user-data', {
        cache: 'no-store' // Always fetch fresh
    }).then(res => res.json());

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {data.user.name}</p>
            <p>Balance: ${data.balance}</p>
        </div>
    );
}

export default DashboardPage;
```

### Force Dynamic Rendering

```typescript
// app/dashboard/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Other options: 'auto' (default), 'force-static', 'error'

// Or use dynamic functions
import { headers, cookies } from 'next/headers';

async function DashboardPage() {
    // Using headers/cookies automatically makes it dynamic
    const headersList = headers();
    const cookieStore = cookies();

    const token = cookieStore.get('auth-token');
    const userAgent = headersList.get('user-agent');

    const data = await fetchUserData(token);

    return <Dashboard data={data} />;
}
```

### SSR with Personalization

```typescript
// app/feed/page.tsx
import { cookies } from 'next/headers';

async function FeedPage() {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    // Personalized feed - must be SSR
    const feed = await fetch(
        `https://api.example.com/feed/${userId}`,
        { cache: 'no-store' }
    ).then(r => r.json());

    return (
        <div>
            {feed.posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
```

### When to Use SSR

```
✅ Good for:
• User dashboards
• Real-time data
• Personalized pages
• Auth-dependent content
• Frequently changing data

❌ Consider alternatives for:
• Content that doesn't change
• High traffic pages (ISR better)
• Simple static content (SSG better)
```

---

## ⚡ Incremental Static Regeneration (ISR)

### Basic ISR

```typescript
// app/products/page.tsx

async function ProductsPage() {
    const products = await fetch('https://api.example.com/products', {
        next: { revalidate: 60 } // Revalidate every 60 seconds
    }).then(res => res.json());

    return (
        <div>
            <h1>Products</h1>
            <ProductGrid products={products} />
        </div>
    );
}

export default ProductsPage;
```

### Page-level Revalidation

```typescript
// app/blog/[slug]/page.tsx

// Revalidate all instances of this page every hour
export const revalidate = 3600; // seconds

async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await fetch(`https://api.example.com/posts/${params.slug}`);
    return <Article post={post} />;
}
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const { secret, path, tag } = await request.json();

    // Verify secret
    if (secret !== process.env.REVALIDATION_SECRET) {
        return Response.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate by path
    if (path) {
        revalidatePath(path);
        return Response.json({ revalidated: true, path });
    }

    // Revalidate by tag
    if (tag) {
        revalidateTag(tag);
        return Response.json({ revalidated: true, tag });
    }

    return Response.json({ error: 'No path or tag provided' }, { status: 400 });
}
```

### Tag-based Revalidation

```typescript
// Fetch with tags
async function getProducts() {
    const res = await fetch('https://api.example.com/products', {
        next: { tags: ['products'] }
    });
    return res.json();
}

async function getProduct(id: string) {
    const res = await fetch(`https://api.example.com/products/${id}`, {
        next: { tags: ['products', `product-${id}`] }
    });
    return res.json();
}

// Revalidate specific product
revalidateTag(`product-${id}`);

// Revalidate all products
revalidateTag('products');
```

### ISR Behavior

```
┌─────────────────────────────────────────────────────────────────┐
│                    ISR TIMELINE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Build Time          Request 1          Request 2               │
│       │                   │                   │                  │
│       ▼                   ▼                   ▼                  │
│   ┌───────┐           ┌───────┐           ┌───────┐             │
│   │ Build │           │ Serve │           │ Serve │             │
│   │ Page  │──────────▶│ Cache │──────────▶│ Cache │             │
│   └───────┘           └───────┘           └───────┘             │
│                                                                   │
│   revalidate = 60s                                               │
│   ────────────────────────────────────────────────────           │
│                                                                   │
│   t=0      t=30s      t=60s      t=61s     t=90s                │
│   │        │          │          │         │                     │
│   │        │          │          │         │                     │
│   Build    Serve      Serve      Trigger   Serve new             │
│            cached     cached     rebuild   cached                │
│                       (stale)    (background)                    │
│                                                                   │
│   "Stale-while-revalidate" pattern:                             │
│   1. Serve stale content immediately                             │
│   2. Rebuild in background                                       │
│   3. Next request gets fresh content                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌊 Streaming SSR

### Suspense Boundaries

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';

async function DashboardPage() {
    return (
        <div>
            <h1>Dashboard</h1>

            {/* Critical content first */}
            <UserInfo />

            {/* Stream these sections as ready */}
            <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats />
            </Suspense>

            <Suspense fallback={<ChartSkeleton />}>
                <RevenueChart />
            </Suspense>

            <Suspense fallback={<TableSkeleton />}>
                <RecentOrders />
            </Suspense>
        </div>
    );
}

// Each component fetches its own data
async function DashboardStats() {
    const stats = await fetch('...', { cache: 'no-store' });
    return <StatsDisplay data={stats} />;
}

async function RevenueChart() {
    const revenue = await fetch('...', { cache: 'no-store' });
    return <Chart data={revenue} />;
}
```

### loading.tsx for Route Segments

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
    return (
        <div className="loading-container">
            <Skeleton className="header" />
            <Skeleton className="content" />
        </div>
    );
}

// This automatically wraps page.tsx in Suspense
// Equivalent to:
// <Suspense fallback={<Loading />}>
//     <DashboardPage />
// </Suspense>
```

### Parallel Data Fetching

```typescript
// ✅ Parallel - Fast
async function Dashboard() {
    // Start all fetches at once
    const userPromise = getUser();
    const ordersPromise = getOrders();
    const statsPromise = getStats();

    // Wait for all
    const [user, orders, stats] = await Promise.all([
        userPromise,
        ordersPromise,
        statsPromise
    ]);

    return <DashboardView user={user} orders={orders} stats={stats} />;
}

// ❌ Sequential - Slow
async function Dashboard() {
    const user = await getUser();      // Wait...
    const orders = await getOrders();  // Then wait...
    const stats = await getStats();    // Then wait...

    return <DashboardView user={user} orders={orders} stats={stats} />;
}
```

---

## 🔀 Mixing Strategies

### Per-Component Strategy

```typescript
// app/page.tsx

async function HomePage() {
    return (
        <div>
            {/* Static - cached forever */}
            <Header />

            {/* ISR - revalidate hourly */}
            <Suspense fallback={<ProductsSkeleton />}>
                <FeaturedProducts />
            </Suspense>

            {/* Dynamic - personalized */}
            <Suspense fallback={<RecommendationsSkeleton />}>
                <PersonalRecommendations />
            </Suspense>

            {/* Static */}
            <Footer />
        </div>
    );
}

// Static component
function Header() {
    return <header>...</header>;
}

// ISR component
async function FeaturedProducts() {
    const products = await fetch('https://api.example.com/featured', {
        next: { revalidate: 3600 }
    }).then(r => r.json());

    return <ProductGrid products={products} />;
}

// Dynamic component
async function PersonalRecommendations() {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    const recommendations = await fetch(
        `https://api.example.com/recommendations/${userId}`,
        { cache: 'no-store' }
    ).then(r => r.json());

    return <ProductGrid products={recommendations} />;
}
```

---

## 📊 Comparison

| Strategy | Build Time | Request Time | Caching | Use Case |
|----------|------------|--------------|---------|----------|
| SSG | ✅ Pre-built | ❌ None | CDN | Static content |
| SSR | ❌ None | ✅ Every request | No cache | Personalized |
| ISR | ✅ Pre-built | ✅ Background | CDN + Revalidate | Semi-static |
| Streaming | ✅ Partial | ✅ Progressive | Varies | Complex pages |

### Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│              WHICH RENDERING STRATEGY?                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Is content personalized/auth-dependent?                        │
│   │                                                               │
│   ├── Yes ──▶ SSR (cache: 'no-store')                           │
│   │                                                               │
│   └── No                                                          │
│       │                                                           │
│       └── Does content change frequently?                         │
│           │                                                       │
│           ├── Never/Rarely ──▶ SSG (cache: 'force-cache')       │
│           │                                                       │
│           ├── Sometimes ──▶ ISR (next: { revalidate: N })       │
│           │                                                       │
│           └── Very often ──▶ SSR                                 │
│                                                                   │
│   Multiple sections with different requirements?                 │
│   ──▶ Use Suspense + mix strategies per component                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: SSG vs SSR?**

A:
- SSG: Pre-built at build time, served from CDN. Fast, good for static content.
- SSR: Built on each request. Fresh data, good for personalized content.

**Q: Khi nào dùng ISR?**

A: Khi data changes occasionally nhưng không cần real-time. Combines SSG speed with ability to update. Good for blogs, product pages.

### 🟡 Mid-level

**Q: cache: 'no-store' vs revalidate: 0?**

A:
- `cache: 'no-store'`: No caching, always fresh
- `revalidate: 0`: Similar effect but may still use cache infrastructure

Both result in dynamic rendering, but `no-store` is more explicit about not caching.

**Q: Explain on-demand revalidation**

A: Trigger rebuild of specific pages/data when source changes (CMS webhook). Use `revalidatePath()` or `revalidateTag()` in API route. More efficient than time-based revalidation.

### 🔴 Senior

**Q: Design caching strategy for e-commerce**

A:
- Product listings: ISR with 1-hour revalidate + tag-based revalidation on update
- Product detail: ISR with tags for price updates
- Cart/Checkout: SSR (personalized)
- Search results: SSR with short cache
- Homepage: Mix of SSG (hero) + ISR (featured products)

Use Suspense boundaries to stream non-critical content.

---

## 📚 Active Recall

1. [ ] 4 rendering strategies trong Next.js
2. [ ] cache: 'force-cache' vs 'no-store'
3. [ ] generateStaticParams purpose
4. [ ] On-demand revalidation vs time-based
5. [ ] Suspense role trong streaming

---

> **Tiếp theo:** [04-data-fetching.md](./04-data-fetching.md) - Data Fetching Patterns
