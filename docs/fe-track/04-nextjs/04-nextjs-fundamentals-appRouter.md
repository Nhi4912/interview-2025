# Next.js Fundamentals / Nền Tảng Next.js - App Router vs Pages Router

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Topics**: Next.js, App Router, Pages Router, Server Components, Routing
> **See also**: [Server Components](./01-app-router-server-components.md) | [Data Fetching](./02-data-fetching.md) | [Architecture](./03-nextjs-architecture.md)

> Next.js là React framework phổ biến nhất. App Router với React Server Components là tương lai.

---

## 🎯 Overview

**Difficulty:** 🟢 Junior | 🟡 Mid | 🔴 Senior

Next.js extends React với server-side rendering, static site generation, file-based routing, API routes, và React Server Components. App Router (Next.js 13+) là version mới được recommend cho tất cả project mới.

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

## 📖 What - Định Nghĩa

**Next.js** là React meta-framework cung cấp:
- **File-based routing**: Folder structure = URL structure
- **Multiple rendering strategies**: SSG, SSR, ISR, Streaming
- **React Server Components**: Default trong App Router
- **API Routes / Route Handlers**: Backend endpoints trong cùng project
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

## 🤔 Why - Tại Sao Quan Trọng

1. **Industry standard**: Next.js là framework React #1 cho production apps
2. **Performance by default**: Server Components giảm JS bundle, built-in optimizations
3. **DX tốt**: File-based routing, hot reload, TypeScript support
4. **Flexible rendering**: Chọn đúng strategy cho từng use case (SSG, SSR, ISR)
5. **Full-stack**: Frontend + API routes trong cùng codebase

---

## 🔧 How - Cách Hoạt Động

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

## 🕐 When - Khi Nào Sử Dụng

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

### Q: Next.js là gì và tại sao nên dùng? / What is Next.js and why use it? 🟢 Junior

**A:** Next.js is a React meta-framework that adds server-side rendering (SSR), static site generation (SSG), file-based routing, API routes, and React Server Components on top of React. App Router (Next.js 13+) is the modern version with Server Components as default.

Vietnamese: Next.js là React framework phổ biến nhất, cung cấp SSR, SSG, routing dựa trên file-system, và API routes. App Router là version mới với Server Components mặc định — giảm JS bundle, cải thiện SEO và performance. Lý do dùng: industry standard, performance out-of-the-box, full-stack trong cùng codebase.

---

### Q: What is the difference between layout.tsx and page.tsx? / Sự khác biệt giữa layout.tsx và page.tsx? 🟢 Junior

**A:** `layout.tsx` defines shared UI that persists across navigations — its state is preserved when the user navigates between child routes. `page.tsx` defines the unique content for a specific route and re-renders on every navigation to that route.

Vietnamese: `layout.tsx` là shared UI, **không bị re-render** khi navigate giữa các route con (state được giữ nguyên). `page.tsx` là nội dung unique của từng route, render lại khi truy cập route đó. Dùng layout cho Header/Sidebar/Footer, dùng page cho content chính.

---

### Q: What is Middleware in Next.js and when do you use it? / Middleware trong Next.js là gì? 🟢 Junior

**A:** Middleware runs before every matched request at the Edge Runtime. It is placed at `middleware.ts` at the project root and is used for authentication checks, redirects, A/B testing, and request logging — all before the page renders.

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

Vietnamese: Middleware chạy trên Edge Runtime trước khi request đến page/API. Đặt ở `middleware.ts` root project. Dùng cho: auth guard (redirect nếu chưa login), A/B testing, geo-based redirects, logging. Chú ý: chạy trên Edge nên không dùng được Node.js APIs.

---

### Q: App Router vs Pages Router — what are the key differences? / So sánh App Router và Pages Router? 🟡 Mid

**A:** App Router (Next.js 13+) uses Server Components by default, supports nested layouts, streaming with Suspense, and co-location of files. Pages Router uses Client Components by default with `getServerSideProps`/`getStaticProps` for data fetching and flat routing. App Router is recommended for all new projects; Pages Router is still supported but considered legacy.

Vietnamese: App Router là tương lai — Server Components mặc định giảm JS bundle đáng kể. Nested layouts giữ state khi navigate. Streaming cho phép hiển thị nội dung từng phần. Pages Router vẫn hoạt động tốt nhưng không có các tính năng mới. Khi phỏng vấn: nên chủ động đề cập trade-offs và migration path.

---

### Q: How do environment variables work in Next.js? / Biến môi trường trong Next.js hoạt động như thế nào? 🟡 Mid

**A:** Variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript and accessible in both Server and Client Components. Variables without this prefix are server-only and never exposed to the browser — safe for secrets like API keys and database credentials.

Vietnamese: `NEXT_PUBLIC_*` → expose ra client (embed vào JS bundle lúc build). Không có prefix → chỉ accessible trên server (Server Components, Route Handlers, middleware). Quy tắc: **không bao giờ** đặt secret vào `NEXT_PUBLIC_*`. Dùng `.env.local` cho development, platform env vars cho production.

---

### Q: Explain the Metadata API in Next.js / Metadata API trong Next.js hoạt động như thế nào? 🟡 Mid

**A:** Export a `metadata` object (static) or `generateMetadata` function (dynamic) from any `page.tsx` or `layout.tsx`. Next.js automatically generates the correct `<head>` tags for SEO, including title templates, OpenGraph, and Twitter cards.

Vietnamese: Metadata API thay thế cách dùng `<Head>` của Pages Router. Static metadata cho các trang không cần data, dynamic `generateMetadata` cho trang cần fetch data (ví dụ: blog post title từ DB). Hỗ trợ title template (`%s | My App`), OpenGraph image, robots, canonical URL — tất cả type-safe.

---

### Q: What are Server Actions in Next.js 14+? / Server Actions trong Next.js 14+ là gì? 🟡 Mid

**A:** Server Actions are async functions that run exclusively on the server and can be called directly from Client or Server Components — without writing a separate API route. Defined with the `'use server'` directive, they handle form submissions, mutations, and database writes securely. They are integrated with the Next.js cache and can call `revalidatePath` or `revalidateTag` to refresh stale data after a mutation.

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    // Direct DB access — no API route needed
    await db.post.create({ data: { title, content } });

    revalidatePath('/blog'); // Invalidate cached blog list
    redirect('/blog');       // Navigate after mutation
}

// app/new-post/page.tsx — Server Component using the action
import { createPost } from '../actions';

export default function NewPostPage() {
    return (
        <form action={createPost}>
            <input name="title" placeholder="Title" />
            <textarea name="content" placeholder="Content" />
            <button type="submit">Create Post</button>
        </form>
    );
}

// Client Component usage with useActionState
'use client';
import { useActionState } from 'react';
import { createPost } from '../actions';

export function PostForm() {
    const [state, formAction, isPending] = useActionState(createPost, null);
    return (
        <form action={formAction}>
            <input name="title" />
            <button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create'}
            </button>
            {state?.error && <p>{state.error}</p>}
        </form>
    );
}
```

Vietnamese: Server Actions là cơ chế mới cho phép gọi server-side logic trực tiếp từ component mà không cần tạo API route riêng. Ưu điểm: giảm boilerplate, tích hợp chặt với form HTML (progressive enhancement), tự động CSRF protection, và kết hợp trực tiếp với cache invalidation. Trade-off: business logic gắn với UI layer hơn — cần cân nhắc cho app lớn cần tách biệt rõ ràng.

---

### Q: ISR vs on-demand revalidation — when to use each? / ISR vs on-demand revalidation — khi nào dùng cái nào? 🔴 Senior

**A:** **Incremental Static Regeneration (ISR)** regenerates a static page in the background after a time-based interval (`revalidate` seconds). The first request after the interval triggers a background rebuild; the stale page is served until the rebuild completes (stale-while-revalidate). **On-demand revalidation** purges the cache immediately when triggered explicitly — via `revalidatePath()` or `revalidateTag()` in a Server Action or Route Handler — rather than waiting for a timer.

```
┌─────────────────────────────────────────────────────────────┐
│           ISR vs ON-DEMAND REVALIDATION                      │
├──────────────────────────┬──────────────────────────────────┤
│  ISR (time-based)        │  On-demand revalidation          │
├──────────────────────────┼──────────────────────────────────┤
│  revalidate: 60 seconds  │  revalidatePath('/blog')         │
│  Automatic, no trigger   │  Explicit trigger required       │
│  Stale data for ≤60s     │  Near-instant freshness          │
│  No external dependency  │  Needs webhook / Server Action   │
│  Good for: news, catalog │  Good for: CMS, e-commerce       │
└──────────────────────────┴──────────────────────────────────┘
```

```typescript
// ISR — time-based, set at the fetch or segment level
// app/blog/page.tsx
export const revalidate = 60; // Regenerate at most every 60 seconds

export default async function BlogPage() {
    const posts = await fetch('https://api.example.com/posts', {
        next: { revalidate: 60 }
    }).then(r => r.json());
    return <PostList posts={posts} />;
}

// On-demand — tag-based cache invalidation
// app/blog/[slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await fetch(`https://api.example.com/posts/${params.slug}`, {
        next: { tags: [`post-${params.slug}`, 'posts'] }
    }).then(r => r.json());
    return <Post post={post} />;
}

// app/api/revalidate/route.ts — called by a CMS webhook
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { slug, secret } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    revalidateTag(`post-${slug}`); // Purge only the changed post
    // revalidatePath('/blog');    // Or purge the whole blog listing

    return NextResponse.json({ revalidated: true });
}
```

Vietnamese: ISR phù hợp khi nội dung thay đổi theo lịch trình đều đặn và chấp nhận được dữ liệu cũ trong vài phút (catalog sản phẩm, bài báo). On-demand revalidation phù hợp khi cần freshness ngay lập tức sau khi content editor publish bài (CMS-driven sites, e-commerce price changes). Trong thực tế, nhiều app dùng **kết hợp cả hai**: ISR như fallback (`revalidate: 3600`) + on-demand webhook từ CMS để invalidate ngay khi có thay đổi. Senior trade-off cần nhắc: on-demand yêu cầu infrastructure (webhook, secret rotation), ISR đơn giản hơn nhưng chấp nhận stale window.

---

### Q: What are parallel routes and when do you use them? / Parallel routes là gì và khi nào dùng? 🔴 Senior

**A:** Parallel routes render multiple independent pages simultaneously within the same layout using the `@folder` convention. Each slot has its own independent loading, error, and not-found states. Common use cases: modal overlays that maintain the background page URL, split-view dashboards, and tab-based navigation where each tab can stream independently.

Vietnamese: Parallel routes dùng `@folder` convention — layout nhận các slot như props. Mỗi slot có loading/error state riêng. Ví dụ điển hình: modal intercepting route (URL thay đổi nhưng background page vẫn hiển thị), analytics dashboard với 4 widget stream độc lập. Cần phân biệt với Intercepting Routes (`(.)folder`) — parallel routes render cùng lúc, intercepting routes thay thế route trong context cụ thể.

---

### Q: How would you design the route structure for a SaaS application? / Thiết kế cấu trúc route cho SaaS app như thế nào? 🔴 Senior

**A:** Use route groups to separate concerns with different layouts, protect authenticated routes at the layout level, and use parallel routes for modals and overlays.

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

Vietnamese: Route groups `()` cho phép áp dụng layout khác nhau cho các phần của app mà không ảnh hưởng URL. Auth check trong `(app)/layout.tsx` bảo vệ toàn bộ authenticated section. `@modal` slot dùng parallel routes + intercepting routes cho UX như Instagram (click ảnh → modal, nhưng URL thay đổi, share link vẫn mở full page). Đây là câu hỏi architecture — interviewer muốn thấy bạn nghĩ đến: auth flow, code splitting, layout sharing, và URL design.

---

### Q: Common Next.js interview pitfalls to avoid / Những lỗi phổ biến khi phỏng vấn về Next.js? 🔴 Senior

**A:** The most common mistakes: confusing Pages Router and App Router syntax in the same answer, not knowing when to use `'use client'` vs default Server Component, failing to differentiate cache strategies (`force-cache`, `no-store`, `revalidate`), and not mentioning trade-offs when choosing a rendering strategy.

Vietnamese: Lỗi hay gặp nhất khi phỏng vấn: trộn lẫn `getServerSideProps` (Pages Router) với `async/await` trong Server Component (App Router). Không giải thích được tại sao cần `'use client'` (hooks, event handlers, browser APIs). Không nhắc trade-offs: SSG nhanh nhưng stale, SSR fresh nhưng TTFB cao hơn, ISR là middle ground. Senior interviewer expect bạn tự đưa ra trade-offs mà không cần được hỏi.

---

## 📋 Active Recall Questions

1. [ ] Project structure của App Router
2. [ ] Special files: layout, page, loading, error, template
3. [ ] Dynamic routes: [slug], [...slug], [[...slug]]
4. [ ] Link vs useRouter
5. [ ] Route handlers vs API routes
6. [ ] Middleware use cases và config
7. [ ] Environment variables: NEXT_PUBLIC_ prefix rules
8. [ ] Metadata API: static vs dynamic
9. [ ] Server Actions: 'use server', form integration, cache invalidation
10. [ ] ISR vs on-demand revalidation: trade-offs và khi nào dùng cái nào

---

## 📊 Interview Q&A Summary

| Question | Level | Key Point |
|----------|-------|-----------|
| Next.js là gì? | 🟢 Junior | React meta-framework: SSR, SSG, file-based routing, Server Components |
| layout.tsx vs page.tsx | 🟢 Junior | layout persists (state preserved), page re-renders on navigation |
| Middleware | 🟢 Junior | Runs on Edge before request; used for auth, redirects, logging |
| App Router vs Pages Router | 🟡 Mid | Server Components default, nested layouts, streaming vs legacy getServerSideProps |
| Environment variables | 🟡 Mid | `NEXT_PUBLIC_*` = client-exposed; no prefix = server-only secrets |
| Metadata API | 🟡 Mid | Export `metadata` or `generateMetadata`; auto `<head>` tags for SEO |
| Server Actions | 🟡 Mid | `'use server'` async functions; no API route needed; integrate with cache invalidation |
| ISR vs on-demand revalidation | 🔴 Senior | ISR = time-based stale-while-revalidate; on-demand = immediate purge via webhook |
| Parallel routes | 🔴 Senior | `@folder` slots; independent loading/error states; modals + split views |
| SaaS route architecture | 🔴 Senior | Route groups `()` for layouts; auth check in layout; `@modal` parallel route |
| Interview pitfalls | 🔴 Senior | Don't mix router syntax; always mention trade-offs; explain 'use client' rationale |

---

## 🔗 Cross-References

- [Server Components](./01-app-router-server-components.md) - RSC Deep Dive
- [Rendering Strategies](./03-nextjs-architecture.md) - SSR, SSG, ISR
- [Data Fetching](./02-data-fetching.md) - Server & Client Patterns
- [Routing & Layouts](./01-app-router-server-components.md) - App Router Patterns
- [Optimization](./03-nextjs-architecture.md) - Performance Best Practices
- [Existing: Fundamentals](./00-nextjs-fundamentals.md) - Q&A Reference
- [Existing: Architecture](./03-nextjs-architecture.md) - Architecture Patterns

---

> **Tiếp theo:** [05-server-components.md](./01-app-router-server-components.md) - React Server Components
