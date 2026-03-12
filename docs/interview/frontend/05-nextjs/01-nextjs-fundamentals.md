# Next.js Fundamentals - Pages vs App Router

> Next.js là React framework phổ biến nhất. App Router với React Server Components là tương lai.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS EVOLUTION                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PAGES ROUTER (Legacy)           APP ROUTER (Next.js 13+)       │
│   ┌─────────────────────┐        ┌─────────────────────┐        │
│   │ pages/              │        │ app/                │        │
│   │ ├── index.js        │        │ ├── layout.tsx      │        │
│   │ ├── about.js        │        │ ├── page.tsx        │        │
│   │ └── api/            │        │ ├── about/          │        │
│   │                     │        │ │   └── page.tsx    │        │
│   │ • getServerSideProps│        │ └── api/            │        │
│   │ • getStaticProps    │        │                     │        │
│   │ • Client Components │        │ • Server Components │        │
│   └─────────────────────┘        │ • Streaming         │        │
│                                  │ • Nested Layouts    │        │
│   Migration: Still supported     └─────────────────────┘        │
│   but App Router is recommended for new projects                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

### App Router

```
my-app/
├── app/
│   ├── layout.tsx         # Root layout (required)
│   ├── page.tsx           # Home page (/)
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error UI
│   ├── not-found.tsx      # 404 page
│   │
│   ├── about/
│   │   └── page.tsx       # /about
│   │
│   ├── blog/
│   │   ├── page.tsx       # /blog
│   │   └── [slug]/
│   │       └── page.tsx   # /blog/:slug
│   │
│   ├── dashboard/
│   │   ├── layout.tsx     # Nested layout
│   │   ├── page.tsx       # /dashboard
│   │   └── settings/
│   │       └── page.tsx   # /dashboard/settings
│   │
│   └── api/
│       └── users/
│           └── route.ts   # API route
│
├── components/
│   ├── Header.tsx
│   └── Footer.tsx
│
├── lib/
│   └── utils.ts
│
└── public/
    └── images/
```

### Special Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI, persists across navigations |
| `page.tsx` | Unique UI for a route |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error UI (Error boundary) |
| `not-found.tsx` | Not found UI |
| `template.tsx` | Re-rendered layout (unlike layout) |
| `route.ts` | API endpoint |

---

## 🛣️ Routing

### File-based Routing

```typescript
// app/page.tsx → /
export default function HomePage() {
    return <h1>Home</h1>;
}

// app/about/page.tsx → /about
export default function AboutPage() {
    return <h1>About</h1>;
}

// app/blog/[slug]/page.tsx → /blog/:slug
export default function BlogPost({ params }: { params: { slug: string } }) {
    return <h1>Post: {params.slug}</h1>;
}

// app/shop/[...categories]/page.tsx → /shop/a/b/c (catch-all)
export default function Shop({ params }: { params: { categories: string[] } }) {
    return <h1>Categories: {params.categories.join('/')}</h1>;
}

// app/[[...slug]]/page.tsx → optional catch-all (matches / too)
```

### Route Groups

```
app/
├── (marketing)/
│   ├── about/page.tsx      # /about
│   └── contact/page.tsx    # /contact
│
├── (shop)/
│   ├── products/page.tsx   # /products
│   └── cart/page.tsx       # /cart
│
└── layout.tsx              # Shared layout

# () doesn't affect URL, just for organization
```

### Parallel Routes

```
app/
├── @modal/
│   └── login/page.tsx
├── @sidebar/
│   └── page.tsx
├── layout.tsx
└── page.tsx

// layout.tsx
export default function Layout({
    children,
    modal,
    sidebar
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
    sidebar: React.ReactNode;
}) {
    return (
        <div>
            {sidebar}
            {children}
            {modal}
        </div>
    );
}
```

---

## 🧩 Layouts & Templates

### Root Layout

```typescript
// app/layout.tsx - Required
export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
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
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="content">{children}</div>
        </div>
    );
}

// Layouts persist - don't re-render on navigation
// State is preserved
```

### Templates

```typescript
// app/dashboard/template.tsx
// Unlike layouts, templates RE-RENDER on navigation

export default function Template({
    children
}: {
    children: React.ReactNode;
}) {
    // This runs on every navigation
    useEffect(() => {
        console.log('Page viewed');
    }, []);

    return <div>{children}</div>;
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
            <p>Loading...</p>
        </div>
    );
}

// Automatically wraps page in Suspense
```

### Error Handling

```typescript
// app/dashboard/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
```

### Not Found

```typescript
// app/not-found.tsx
export default function NotFound() {
    return (
        <div>
            <h2>Page Not Found</h2>
            <Link href="/">Go Home</Link>
        </div>
    );
}

// Trigger manually
import { notFound } from 'next/navigation';

async function getPost(slug: string) {
    const post = await fetchPost(slug);
    if (!post) notFound();
    return post;
}
```

---

## 🔗 Navigation

### Link Component

```typescript
import Link from 'next/link';

// Basic
<Link href="/about">About</Link>

// With query params
<Link href={{ pathname: '/search', query: { q: 'hello' } }}>
    Search
</Link>

// Replace instead of push
<Link href="/about" replace>About</Link>

// Prefetch (default: true)
<Link href="/about" prefetch={false}>About</Link>

// Active link styling
'use client';
import { usePathname } from 'next/navigation';

function NavLink({ href, children }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={isActive ? 'active' : ''}>
            {children}
        </Link>
    );
}
```

### Programmatic Navigation

```typescript
'use client';
import { useRouter } from 'next/navigation';

function LoginButton() {
    const router = useRouter();

    const handleLogin = async () => {
        await login();
        router.push('/dashboard');
        // router.replace('/dashboard'); // No back
        // router.refresh(); // Refresh current route
        // router.back(); // Go back
    };

    return <button onClick={handleLogin}>Login</button>;
}
```

---

## 🌐 API Routes

### Route Handlers

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const users = await getUsers();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user, { status: 201 });
}

// With dynamic params: app/api/users/[id]/route.ts
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUser(params.id);
    if (!user) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(user);
}
```

### Request Helpers

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // URL and search params
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // Headers
    const authHeader = request.headers.get('authorization');

    // Cookies
    const token = request.cookies.get('token');

    // Response with headers
    return NextResponse.json(
        { data: 'hello' },
        {
            status: 200,
            headers: {
                'Cache-Control': 'no-store'
            }
        }
    );
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Next.js là gì?**

A: React framework với SSR, SSG, file-based routing, API routes. App Router là version mới với Server Components.

**Q: layout.tsx vs page.tsx?**

A:
- layout.tsx: Shared UI, persists across navigations
- page.tsx: Unique content for each route

### 🟡 Mid-level

**Q: App Router vs Pages Router?**

A:
- App Router: Server Components default, nested layouts, streaming
- Pages Router: Client Components, getServerSideProps/getStaticProps
- App Router is recommended for new projects

**Q: Khi nào dùng loading.tsx?**

A: Auto Suspense boundary cho page. Shows while page content loads. Better UX than blocking.

### 🔴 Senior

**Q: Parallel routes use case?**

A: Render multiple pages simultaneously (modal over page, split views). Use @folder convention.

---

## 📚 Active Recall

1. [ ] Project structure của App Router
2. [ ] Special files: layout, page, loading, error
3. [ ] Dynamic routes: [slug], [...slug], [[...slug]]
4. [ ] Link vs useRouter
5. [ ] Route handlers vs API routes

---

> **Tiếp theo:** [02-server-components.md](./02-server-components.md) - React Server Components
