# Next.js - Modern React Framework

> Next.js là framework React phổ biến nhất cho production apps. App Router và Server Components là must-know cho 2024-2025.

---

## Tổng Quan

Next.js extends React với:
- **Server-side rendering (SSR)**
- **Static site generation (SSG)**
- **API routes**
- **File-based routing**
- **React Server Components**

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-nextjs-fundamentals.md](./01-nextjs-fundamentals.md) | Pages vs App Router | ⭐⭐⭐⭐⭐ |
| [02-server-components.md](./02-server-components.md) | RSC Deep Dive | ⭐⭐⭐⭐⭐ |
| [03-rendering-strategies.md](./03-rendering-strategies.md) | SSR, SSG, ISR | ⭐⭐⭐⭐⭐ |
| [04-data-fetching.md](./04-data-fetching.md) | Server/Client Fetching | ⭐⭐⭐⭐ |
| [05-routing-layouts.md](./05-routing-layouts.md) | App Router Patterns | ⭐⭐⭐⭐ |
| [06-optimization.md](./06-optimization.md) | Image, Font, Bundle | ⭐⭐⭐⭐ |
| [mindmap-nextjs.md](./mindmap-nextjs.md) | Sơ Đồ Tổng Hợp | Review |

---

## App Router vs Pages Router

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PAGES ROUTER (Legacy)                             │
├─────────────────────────────────────────────────────────────────────┤
│  pages/                                                              │
│  ├── index.js           → /                                         │
│  ├── about.js           → /about                                    │
│  ├── blog/                                                           │
│  │   ├── index.js       → /blog                                     │
│  │   └── [slug].js      → /blog/:slug                               │
│  └── _app.js            → Layout wrapper                            │
│                                                                       │
│  • getServerSideProps, getStaticProps                                │
│  • All components are Client Components                              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    APP ROUTER (Next.js 13+)                          │
├─────────────────────────────────────────────────────────────────────┤
│  app/                                                                │
│  ├── layout.tsx         → Root layout                               │
│  ├── page.tsx           → /                                         │
│  ├── about/                                                          │
│  │   └── page.tsx       → /about                                    │
│  ├── blog/                                                           │
│  │   ├── page.tsx       → /blog                                     │
│  │   └── [slug]/                                                     │
│  │       └── page.tsx   → /blog/:slug                               │
│  └── api/               → API routes                                │
│                                                                       │
│  • React Server Components by default                                │
│  • 'use client' directive for Client Components                      │
│  • Layouts, Loading, Error states                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## React Server Components

### Server vs Client Components

```typescript
// Server Component (default) - NO 'use client'
// ✅ Can:
// - async/await directly
// - Access backend resources
// - Keep secrets server-side
// - Reduce client bundle

async function ProductList() {
    const products = await db.products.findMany(); // Direct DB access!

    return (
        <ul>
            {products.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
    );
}

// Client Component - HAS 'use client'
'use client';

// ✅ Can:
// - useState, useEffect
// - Event handlers
// - Browser APIs
// - Interactivity

import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### When to Use What

| Feature | Server Component | Client Component |
|---------|------------------|------------------|
| Fetch data | ✅ | ⚠️ useEffect |
| Access backend | ✅ | ❌ |
| Secrets/API keys | ✅ | ❌ |
| useState/useEffect | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Reduce bundle size | ✅ | ❌ |

---

## Rendering Strategies

### SSR (Server-Side Rendering)

```typescript
// app/products/page.tsx
async function ProductsPage() {
    // Fetched on EVERY request
    const products = await fetch('https://api.example.com/products', {
        cache: 'no-store' // Disable caching = SSR
    });

    return <ProductList products={products} />;
}
```

### SSG (Static Site Generation)

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map(post => ({ slug: post.slug }));
}

async function BlogPost({ params }) {
    // Generated at BUILD time
    const post = await getPost(params.slug);
    return <Article post={post} />;
}
```

### ISR (Incremental Static Regeneration)

```typescript
async function ProductPage() {
    const product = await fetch('https://api.example.com/product', {
        next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    return <ProductDetails product={product} />;
}
```

### Comparison

| Strategy | Build Time | Request Time | Use Case |
|----------|------------|--------------|----------|
| SSG | Generated | Served from CDN | Blog, docs |
| SSR | - | Generated each request | Personalized, real-time |
| ISR | Generated | Revalidated periodically | E-commerce, news |
| CSR | - | Generated in browser | Dashboards, apps |

---

## Data Fetching

### Server Components

```typescript
// Direct async/await
async function UserProfile({ userId }: { userId: string }) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    return <Profile user={user} />;
}
```

### Client Components

```typescript
'use client';

import useSWR from 'swr';

function UserProfile({ userId }: { userId: string }) {
    const { data, error, isLoading } = useSWR(
        `/api/users/${userId}`,
        fetcher
    );

    if (isLoading) return <Skeleton />;
    if (error) return <Error />;
    return <Profile user={data} />;
}
```

---

## File Conventions

```
app/
├── layout.tsx      # Shared layout (required at root)
├── page.tsx        # Route page
├── loading.tsx     # Loading UI (Suspense)
├── error.tsx       # Error UI (Error Boundary)
├── not-found.tsx   # 404 page
├── template.tsx    # Re-mounted layout
└── route.ts        # API endpoint
```

---

## Top Interview Questions

| Question | Difficulty |
|----------|------------|
| App Router vs Pages Router? | 🟡 |
| Server Components vs Client Components? | 🟡 |
| When to use 'use client'? | 🟢 |
| SSR vs SSG vs ISR? | 🟡 |
| How does data fetching work in RSC? | 🟡 |
| How to handle errors in Next.js? | 🟡 |
| Next.js Image optimization | 🟢 |

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Vercel Blog](https://vercel.com/blog)

---

> **Thời gian ước tính:** 1 tuần
