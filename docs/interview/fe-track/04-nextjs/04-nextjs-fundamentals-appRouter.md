# Next.js Fundamentals - Pages vs App Router - Nền Tảng Next.js

> Next.js la React framework pho bien nhat. App Router voi React Server Components la tuong lai.

---

## 🎯 Overview

**Difficulty:** 🟢 Junior | 🟡 Mid | 🔴 Senior

Next.js extends React voi server-side rendering, static site generation, file-based routing, API routes, va React Server Components. App Router (Next.js 13+) la version moi duoc recommend cho tat ca project moi.

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

## 📖 What - Dinh Nghia

**Next.js** la React meta-framework cung cap:
- **File-based routing**: Folder structure = URL structure
- **Multiple rendering strategies**: SSG, SSR, ISR, Streaming
- **React Server Components**: Default trong App Router
- **API Routes / Route Handlers**: Backend endpoints trong cung project
- **Built-in optimizations**: Image, Font, Script, Code splitting

### Project Structure (App Router)

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
├── lib/
└── public/
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

## 🤔 Why - Tai Sao Quan Trong

1. **Industry standard**: Next.js la framework React #1 cho production apps
2. **Performance by default**: Server Components giam JS bundle, built-in optimizations
3. **DX tot**: File-based routing, hot reload, TypeScript support
4. **Flexible rendering**: Chon dung strategy cho tung use case (SSG, SSR, ISR)
5. **Full-stack**: Frontend + API routes trong cung codebase

---

## 🔧 How - Cach Hoat Dong

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

```typescript
// app/layout.tsx
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

### Layouts & Templates

```typescript
// app/layout.tsx - Required, persists across navigations
export default function RootLayout({ children }: { children: React.ReactNode }) {
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

// app/dashboard/template.tsx - Re-renders on every navigation
'use client';
export default function Template({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        console.log('Page viewed'); // Runs on every nav
    }, []);
    return <div>{children}</div>;
}
```

### Loading & Error States

```typescript
// app/dashboard/loading.tsx - Auto Suspense boundary
export default function Loading() {
    return <div className="loading"><Spinner /><p>Loading...</p></div>;
}

// app/dashboard/error.tsx - Must be Client Component
'use client';
export default function Error({
    error, reset
}: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => { console.error(error); }, [error]);
    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={reset}>Try again</button>
        </div>
    );
}
```

### Navigation

```typescript
import Link from 'next/link';

// Declarative
<Link href="/about">About</Link>
<Link href="/about" prefetch={false}>About</Link>

// Programmatic
'use client';
import { useRouter } from 'next/navigation';

function LoginButton() {
    const router = useRouter();
    const handleLogin = async () => {
        await login();
        router.push('/dashboard');
        // router.replace('/dashboard'); // No back
        // router.refresh(); // Refresh current route
    };
    return <button onClick={handleLogin}>Login</button>;
}
```

### API Routes (Route Handlers)

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
```

---

## 🕐 When - Khi Nao Su Dung

| Scenario | Recommendation |
|----------|---------------|
| New project | App Router (always) |
| Existing Pages Router | Migrate incrementally |
| Static marketing site | SSG with App Router |
| Dynamic dashboard | SSR with App Router |
| API backend | Route Handlers |
| SEO-critical | SSG or SSR (not CSR) |

---

## 💡 Interview Questions

### 🟢 Junior

**Q: Next.js la gi?**
A: React framework voi SSR, SSG, file-based routing, API routes. App Router la version moi voi Server Components.

**Q: layout.tsx vs page.tsx?**
A: layout.tsx la shared UI, persist across navigations (state preserved). page.tsx la unique content cho tung route.

**Q: Middleware trong Next.js la gi?**
A: Middleware chay truoc moi request, dung cho authentication, redirects, logging. Dat o `middleware.ts` o root project. Chay on Edge Runtime.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*'
};
```

### 🟡 Mid-level

**Q: App Router vs Pages Router?**
A:
- App Router: Server Components default, nested layouts, streaming, colocation
- Pages Router: Client Components, getServerSideProps/getStaticProps, flat routing
- App Router is recommended for new projects, Pages Router still supported

**Q: Environment Variables trong Next.js?**
A: Prefix `NEXT_PUBLIC_` de expose ra client. Khong co prefix chi accessible on server. Secrets safe trong Server Components va Route Handlers.

**Q: Metadata API trong Next.js?**
A: Export `metadata` object hoac `generateMetadata` function tu page/layout. Auto generates `<head>` tags for SEO. Supports title templates, OpenGraph, Twitter cards.

### 🔴 Senior

**Q: Parallel routes use case?**
A: Render multiple pages simultaneously (modal over page, split views). Use @folder convention. Each slot has independent loading/error states.

**Q: Design route structure cho SaaS app?**
A:
```
app/
├── (marketing)/        → Public pages, simple layout
├── (auth)/             → Login/register, minimal layout
├── (app)/              → Authenticated app
│   ├── layout.tsx      → With sidebar + auth check
│   ├── @modal/         → Parallel route for modals
│   ├── dashboard/
│   └── [workspace]/    → Dynamic workspace
```

**Q: Interview Pitfalls khi noi ve Next.js?**
A: Nhung loi thuong gap:
- Confuse Pages Router vs App Router syntax
- Khong biet khi nao dung 'use client' vs default Server Component
- Khong phan biet cache strategies (force-cache, no-store, revalidate)
- Quen mention trade-offs khi chon rendering strategy

---

## 📋 Active Recall Questions

1. [ ] Project structure cua App Router
2. [ ] Special files: layout, page, loading, error, template
3. [ ] Dynamic routes: [slug], [...slug], [[...slug]]
4. [ ] Link vs useRouter
5. [ ] Route handlers vs API routes
6. [ ] Middleware use cases va config
7. [ ] Environment variables: NEXT_PUBLIC_ prefix rules
8. [ ] Metadata API: static vs dynamic

---

## 🔗 Cross-References

- [Server Components](./05-server-components.md) - RSC Deep Dive
- [Rendering Strategies](./06-rendering-strategies.md) - SSR, SSG, ISR
- [Data Fetching](./07-data-fetching.md) - Server & Client Patterns
- [Routing & Layouts](./08-routing-layouts.md) - App Router Patterns
- [Optimization](./09-optimization.md) - Performance Best Practices
- [Existing: Fundamentals](./00-nextjs-fundamentals.md) - Q&A Reference
- [Existing: Architecture](./03-nextjs-architecture.md) - Architecture Patterns

---

> **Tiep theo:** [05-server-components.md](./05-server-components.md) - React Server Components
