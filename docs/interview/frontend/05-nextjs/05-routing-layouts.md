# Routing & Layouts - App Router Patterns

> App Router giới thiệu file-based routing với nested layouts. Hiểu patterns để build complex applications.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP ROUTER STRUCTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   app/                                                           │
│   ├── layout.tsx          ← Root Layout (required)              │
│   ├── page.tsx            ← / (Home)                            │
│   ├── loading.tsx         ← Loading UI                          │
│   ├── error.tsx           ← Error UI                            │
│   ├── not-found.tsx       ← 404 UI                              │
│   │                                                               │
│   ├── about/                                                      │
│   │   └── page.tsx        ← /about                              │
│   │                                                               │
│   ├── blog/                                                       │
│   │   ├── layout.tsx      ← Nested layout                       │
│   │   ├── page.tsx        ← /blog                               │
│   │   └── [slug]/                                                │
│   │       └── page.tsx    ← /blog/:slug                         │
│   │                                                               │
│   ├── (marketing)/        ← Route Group (no URL)                │
│   │   ├── pricing/                                               │
│   │   └── features/                                              │
│   │                                                               │
│   └── @modal/             ← Parallel Route                      │
│       └── login/                                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Conventions

### Special Files

| File | Purpose | Server/Client |
|------|---------|--------------|
| `layout.tsx` | Shared UI wrapper | Server (default) |
| `page.tsx` | Unique route content | Server (default) |
| `loading.tsx` | Loading state | Server |
| `error.tsx` | Error boundary | Client (required) |
| `not-found.tsx` | 404 page | Server |
| `template.tsx` | Re-render on navigation | Server |
| `route.ts` | API endpoint | Server |
| `default.tsx` | Parallel route fallback | Server |

### Component Hierarchy

```typescript
// How files compose in the DOM
<Layout>           {/* layout.tsx */}
    <Template>     {/* template.tsx (optional) */}
        <ErrorBoundary fallback={<Error />}>  {/* error.tsx */}
            <Suspense fallback={<Loading />}> {/* loading.tsx */}
                <Page />  {/* page.tsx */}
            </Suspense>
        </ErrorBoundary>
    </Template>
</Layout>
```

---

## 🧩 Layouts

### Root Layout

```typescript
// app/layout.tsx - Required
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'My App',
    description: 'My awesome application',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
```

### Nested Layouts

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="dashboard-content">
                {children}
            </div>
        </div>
    );
}

// Layout persists across navigations
// State is preserved (sidebar open, scroll position, etc.)
```

### Multiple Root Layouts

```typescript
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
    return (
        <html>
            <body>
                <MarketingHeader />
                {children}
                <MarketingFooter />
            </body>
        </html>
    );
}

// app/(app)/layout.tsx
export default function AppLayout({ children }) {
    return (
        <html>
            <body>
                <AppSidebar />
                {children}
            </body>
        </html>
    );
}

// Different layouts for marketing vs app sections
```

### Templates vs Layouts

```typescript
// app/dashboard/template.tsx
// Re-creates on every navigation (unlike layout)

'use client';

import { useEffect } from 'react';

export default function Template({ children }) {
    useEffect(() => {
        // Runs on every navigation
        analytics.track('page_view');
    }, []);

    return <div>{children}</div>;
}

// Use template when you need:
// - Animation on route change
// - useEffect on every navigation
// - Reset state between pages
```

---

## 🛣️ Dynamic Routes

### Basic Dynamic Route

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({
    params,
}: {
    params: { slug: string };
}) {
    return <h1>Post: {params.slug}</h1>;
}

// /blog/hello-world → params.slug = "hello-world"
```

### Multiple Dynamic Segments

```typescript
// app/shop/[category]/[product]/page.tsx
export default function ProductPage({
    params,
}: {
    params: { category: string; product: string };
}) {
    return (
        <div>
            <p>Category: {params.category}</p>
            <p>Product: {params.product}</p>
        </div>
    );
}

// /shop/electronics/phone → { category: "electronics", product: "phone" }
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c

export default function DocsPage({
    params,
}: {
    params: { slug: string[] };
}) {
    return <p>Slug: {params.slug.join('/')}</p>;
}

// /docs/react/hooks/usestate → slug = ["react", "hooks", "usestate"]
```

### Optional Catch-All

```typescript
// app/[[...slug]]/page.tsx
// Also matches: / (root)

export default function Page({
    params,
}: {
    params: { slug?: string[] };
}) {
    if (!params.slug) {
        return <Home />;
    }
    return <DynamicPage path={params.slug} />;
}
```

### Generate Static Params

```typescript
// app/blog/[slug]/page.tsx

// Generate static pages at build time
export async function generateStaticParams() {
    const posts = await getPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// Dynamic params not in generateStaticParams
export const dynamicParams = true; // true: generate on demand
                                   // false: return 404

export default async function BlogPost({ params }) {
    const post = await getPost(params.slug);
    return <Article post={post} />;
}
```

---

## 🔀 Route Groups

### Organization Without URL Impact

```
app/
├── (marketing)/
│   ├── layout.tsx      ← Marketing layout
│   ├── about/
│   │   └── page.tsx    ← /about (not /marketing/about)
│   ├── pricing/
│   │   └── page.tsx    ← /pricing
│   └── contact/
│       └── page.tsx    ← /contact
│
├── (shop)/
│   ├── layout.tsx      ← Shop layout
│   ├── products/
│   │   └── page.tsx    ← /products
│   └── cart/
│       └── page.tsx    ← /cart
│
└── (dashboard)/
    ├── layout.tsx      ← Dashboard layout (with auth)
    └── settings/
        └── page.tsx    ← /settings
```

### Multiple Layouts per Route

```typescript
// app/(auth)/layout.tsx - Minimal layout for auth pages
export default function AuthLayout({ children }) {
    return (
        <div className="auth-container">
            {children}
        </div>
    );
}

// app/(auth)/login/page.tsx → /login
// app/(auth)/register/page.tsx → /register
```

---

## 🔲 Parallel Routes

### Definition

```
app/
├── layout.tsx
├── page.tsx
├── @modal/
│   ├── default.tsx
│   └── login/
│       └── page.tsx
└── @sidebar/
    ├── default.tsx
    └── page.tsx
```

### Layout with Parallel Routes

```typescript
// app/layout.tsx
export default function Layout({
    children,
    modal,
    sidebar,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    sidebar: React.ReactNode;
}) {
    return (
        <div className="layout">
            <div className="sidebar">{sidebar}</div>
            <div className="main">{children}</div>
            {modal}
        </div>
    );
}
```

### Modal Pattern

```typescript
// app/@modal/login/page.tsx
export default function LoginModal() {
    return (
        <Modal>
            <LoginForm />
        </Modal>
    );
}

// app/@modal/default.tsx
// Fallback when modal shouldn't show
export default function Default() {
    return null;
}
```

### Conditional Rendering

```typescript
// app/layout.tsx
import { auth } from '@/lib/auth';

export default async function Layout({ children, analytics, user }) {
    const session = await auth();

    return (
        <>
            {children}
            {session ? user : null}
            {session?.role === 'admin' ? analytics : null}
        </>
    );
}
```

---

## 🔄 Intercepting Routes

### Soft Navigation Pattern

```
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx      ← Direct navigation: /photo/123
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx  ← Intercepted: modal over feed
```

### Convention

```
(.)   → Same level
(..)  → One level up
(..)(..) → Two levels up
(...) → From root
```

### Instagram-like Photo Modal

```typescript
// app/feed/page.tsx
import Link from 'next/link';

export default function Feed() {
    return (
        <div className="grid">
            {photos.map(photo => (
                <Link key={photo.id} href={`/photo/${photo.id}`}>
                    <Image src={photo.thumbnail} alt="" />
                </Link>
            ))}
        </div>
    );
}

// app/@modal/(.)photo/[id]/page.tsx
// Intercepted route - shows as modal
export default function PhotoModal({ params }) {
    return (
        <Modal>
            <Photo id={params.id} />
        </Modal>
    );
}

// app/photo/[id]/page.tsx
// Direct navigation - full page
export default function PhotoPage({ params }) {
    return <Photo id={params.id} />;
}
```

---

## ⚡ Loading & Error States

### Loading UI

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
    return (
        <div className="loading">
            <Spinner />
            <p>Loading dashboard...</p>
        </div>
    );
}

// Automatically wraps page in Suspense
```

### Error Handling

```typescript
// app/dashboard/error.tsx
'use client'; // Must be client component

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to service
        console.error(error);
    }, [error]);

    return (
        <div className="error">
            <h2>Something went wrong!</h2>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
```

### Not Found

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
    );
}

// Trigger programmatically
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
    const post = await db.post.findUnique({ where: { slug } });
    if (!post) notFound();
    return post;
}
```

---

## 🧭 Navigation

### Link Component

```typescript
import Link from 'next/link';

// Basic
<Link href="/about">About</Link>

// Dynamic route
<Link href={`/blog/${post.slug}`}>Read More</Link>

// Object syntax
<Link
    href={{
        pathname: '/search',
        query: { q: 'hello', page: 1 },
    }}
>
    Search
</Link>

// Replace instead of push
<Link href="/about" replace>About</Link>

// Disable prefetch
<Link href="/about" prefetch={false}>About</Link>

// Scroll to top (default: true)
<Link href="/about" scroll={false}>About</Link>
```

### Programmatic Navigation

```typescript
'use client';

import { useRouter } from 'next/navigation';

function LoginButton() {
    const router = useRouter();

    async function handleLogin() {
        await login();
        router.push('/dashboard');
        // router.replace('/dashboard'); // No back button
        // router.refresh(); // Refresh server components
        // router.back(); // Go back
        // router.forward(); // Go forward
    }

    return <button onClick={handleLogin}>Login</button>;
}
```

### Active Link

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={isActive ? 'active' : ''}
        >
            {children}
        </Link>
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: layout.tsx vs template.tsx?**

A:
- Layout: Persists across navigations, preserves state
- Template: Re-renders on every navigation, resets state

**Q: Route Groups purpose?**

A: Organize routes without affecting URL structure. Use () to group related routes or apply different layouts to route segments.

### 🟡 Mid-level

**Q: Explain intercepting routes**

A: Allow "intercepting" a route to show different UI while preserving URL. Example: Click photo → show modal (intercepted), share URL → full page (direct). Use (.) notation for relative matching.

**Q: Parallel routes use cases?**

A:
- Modals over content
- Split views (dashboard panels)
- Conditional rendering based on auth
- Independent loading/error states

### 🔴 Senior

**Q: Design complex route structure for SaaS app**

A:
```
app/
├── (marketing)/        → Public pages
│   ├── layout.tsx
│   └── pricing/
├── (auth)/             → Auth pages (minimal layout)
│   ├── layout.tsx
│   ├── login/
│   └── register/
├── (app)/              → Authenticated app
│   ├── layout.tsx      → With sidebar, auth check
│   ├── @modal/         → Parallel route for modals
│   ├── dashboard/
│   └── [workspace]/    → Dynamic workspace
│       ├── layout.tsx  → Workspace context
│       └── settings/
```

---

## 📚 Active Recall

1. [ ] 7 special files trong App Router
2. [ ] Catch-all vs Optional catch-all syntax
3. [ ] Parallel routes naming convention (@)
4. [ ] Intercepting routes syntax (.)
5. [ ] Layout vs Template differences

---

> **Tiếp theo:** [06-optimization.md](./06-optimization.md) - Next.js Optimization
