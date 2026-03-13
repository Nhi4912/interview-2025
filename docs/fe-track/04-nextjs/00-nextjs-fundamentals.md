# Next.js Fundamentals / Nền Tảng Next.js

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [App Router & Server Components](./01-app-router-server-components.md) | [Data Fetching](./02-data-fetching.md) | [Architecture](./03-nextjs-architecture.md)

---

## Tổng Quan / Overview

Next.js is a React meta-framework providing file-based routing, multiple rendering strategies (SSG/SSR/ISR/CSR), API routes, image/font optimization, middleware, and built-in deployment support. This file covers foundational concepts every frontend candidate must know.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What is Next.js and why use it over plain React? / Next.js là gì và tại sao dùng thay cho React thuần? 🟢 Junior

**A:** Next.js is a React framework built by Vercel that adds server-side rendering, static site generation, file-based routing, API routes, and built-in optimizations on top of React. Plain React (Create React App) is a client-side SPA — the browser downloads a JS bundle, then renders everything. Next.js lets you choose per-page whether content is rendered at build time, on each request, or on the client.

Vietnamese: React thuần chỉ là library UI, khi dùng CRA thì mọi thứ render ở client — SEO kém, thời gian load lâu vì phải tải hết JS rồi mới render. Next.js giải quyết bằng cách cho phép render ở server (SSR) hoặc build sẵn HTML (SSG). Ngoài ra còn có routing tự động theo cấu trúc file, API routes để viết backend nhỏ, và tối ưu image/font tự động. Đây là framework React phổ biến nhất cho production.

```tsx
// With Next.js App Router, a simple page is a Server Component by default
// app/page.tsx
export default function HomePage() {
  return <h1>Hello Next.js</h1>; // Rendered on server, zero JS sent to client
}
```

---

### Q: Explain file-based routing in Next.js App Router / Giải thích routing dựa trên file trong App Router 🟡 Mid

**A:** In the App Router (Next.js 13+), the `app/` directory uses a convention where folder structure maps directly to URL paths. Each route segment is a folder containing a `page.tsx` file. Dynamic segments use `[param]`, catch-all uses `[...slug]`, and optional catch-all uses `[[...slug]]`.

Vietnamese: Routing trong App Router dựa hoàn toàn vào cấu trúc thư mục. Mỗi folder trong `app/` tương ứng một segment trên URL. File `page.tsx` đánh dấu route đó là public (có thể truy cập). Không cần cấu hình router riêng như React Router. Dynamic route dùng `[param]` — ví dụ `app/blog/[slug]/page.tsx` sẽ match `/blog/any-slug`. Catch-all `[...slug]` match nhiều segment, optional catch-all `[[...slug]]` match cả route gốc.

```
app/
├── page.tsx                    → /
├── about/page.tsx              → /about
├── blog/
│   ├── page.tsx                → /blog
│   └── [slug]/page.tsx         → /blog/:slug
├── shop/[...categories]/page.tsx → /shop/a/b/c
└── [[...slug]]/page.tsx        → / (optional catch-all)
```

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article><h1>{post.title}</h1></article>;
}
```

---

### Q: What are SSG, SSR, ISR, and CSR? When do you use each? / SSG, SSR, ISR, CSR là gì? Khi nào dùng? 🔴 Senior

**A:** These are the four rendering strategies in Next.js:

- **SSG (Static Site Generation)**: Pages are generated at build time. Best for content that rarely changes (marketing pages, docs, blogs). Fastest TTFB because HTML is served from CDN.
- **SSR (Server-Side Rendering)**: Pages are generated on every request. Best for personalized or frequently changing content (dashboards, user profiles). Fresh data but slower TTFB than SSG.
- **ISR (Incremental Static Regeneration)**: Static pages that revalidate after a configurable time. Combines SSG speed with fresh content. Best for e-commerce product pages, content sites.
- **CSR (Client-Side Rendering)**: Rendered entirely in the browser via JavaScript. Best for private dashboards and non-SEO pages. Worst initial load but most interactive.

Vietnamese: Đây là 4 chiến lược render — mỗi cái có trade-off riêng:
- **SSG**: Build sẵn HTML lúc deploy. Nhanh nhất vì serve static file từ CDN. Dùng cho trang ít thay đổi (blog, docs, landing page).
- **SSR**: Mỗi request tạo HTML mới trên server. Dữ liệu luôn fresh nhưng TTFB chậm hơn. Dùng cho trang cá nhân hóa, real-time data.
- **ISR**: Kết hợp SSG + auto revalidate. Trang static nhưng tự cập nhật sau N giây. Dùng cho e-commerce, news site.
- **CSR**: Render hoàn toàn ở browser. SEO kém nhưng tương tác tốt. Dùng cho admin dashboard, trang không cần index.

```tsx
// SSG (default in App Router) — built at build time
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // default — cached forever until redeploy
  });
  return <PostList posts={await posts.json()} />;
}

// SSR — fetched on every request
export default async function DashboardPage() {
  const data = await fetch('https://api.example.com/me', {
    cache: 'no-store' // no caching, always fresh
  });
  return <Dashboard data={await data.json()} />;
}

// ISR — static but revalidates every 60 seconds
export default async function ProductPage() {
  const product = await fetch('https://api.example.com/product/1', {
    next: { revalidate: 60 }
  });
  return <Product data={await product.json()} />;
}
```

---

### Q: How does data fetching work in Next.js App Router? / Data fetching hoạt động thế nào trong App Router? 🟢 Junior

**A:** In the App Router, Server Components can directly `await` async operations including `fetch()` calls. Next.js extends the native `fetch` API with caching and revalidation options. You fetch data directly in the component that needs it — no need for `getServerSideProps` or `getStaticProps` like in Pages Router.

Vietnamese: Trong App Router, component mặc định là Server Component nên có thể `await fetch()` trực tiếp ngay trong component. Next.js mở rộng `fetch` với tuỳ chọn cache (`force-cache`, `no-store`) và revalidation (`next: { revalidate: N }`). Dữ liệu được fetch ngay tại component cần dùng, không cần truyền qua props từ page-level function. Next.js tự động deduplicate các request trùng URL trong cùng một render pass.

```tsx
// app/users/page.tsx — fetch directly in Server Component
export default async function UsersPage() {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // revalidate every hour
  });

  if (!res.ok) throw new Error('Failed to fetch users');

  const users = await res.json();
  return (
    <ul>
      {users.map((user: { id: number; name: string }) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

### Q: What are API Routes (Route Handlers) in Next.js? / API Routes là gì trong Next.js? 🟡 Mid

**A:** Route Handlers (App Router) let you create API endpoints inside your Next.js project using `route.ts` files. They export functions named after HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`). They run on the server and can access databases, external APIs, and secrets directly. They use the Web standard `Request`/`Response` API.

Vietnamese: Route Handlers cho phép tạo API endpoint ngay trong project Next.js mà không cần backend riêng. Đặt file `route.ts` trong thư mục `app/api/`. Export function theo tên HTTP method. Chạy trên server nên truy cập được database, secret keys. Dùng Web API chuẩn (`Request`/`Response`), khác với Pages Router dùng `req`/`res` của Node.js. Thường dùng cho: form submission, webhook handler, proxy API bên ngoài, hoặc authentication endpoint.

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts — dynamic route handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}
```

---

### Q: How does next/image optimize images? / next/image tối ưu ảnh như thế nào? 🔴 Senior

**A:** The `next/image` component provides automatic image optimization: on-demand resizing and format conversion (WebP/AVIF), lazy loading by default, blur placeholder support, responsive `srcSet` generation, and preventing Cumulative Layout Shift (CLS) by requiring width/height or using `fill`. Images are optimized at request time and cached on the edge, not at build time — so adding thousands of images doesn't slow deployment.

Vietnamese: `next/image` tối ưu ảnh tự động theo nhiều cách:
- **Resize theo demand**: Server tạo ảnh đúng kích thước device cần, không gửi ảnh 4K cho mobile.
- **Format tự động**: Convert sang WebP/AVIF nếu browser hỗ trợ, giảm 30-50% kích thước.
- **Lazy loading mặc định**: Ảnh ngoài viewport không load cho đến khi scroll gần đến.
- **Chống CLS**: Bắt buộc khai báo width/height hoặc dùng `fill`, browser biết trước kích thước để dành chỗ.
- **Cache ở edge**: Ảnh đã optimize được cache, request sau không cần xử lý lại.
- **Priority loading**: Ảnh LCP (ảnh lớn nhất trên viewport đầu) nên set `priority` để preload.

```tsx
import Image from 'next/image';

// Static import — automatically provides width, height, blurDataURL
import heroImg from '@/public/hero.jpg';

export default function Hero() {
  return (
    <div>
      {/* Static import — best for known images */}
      <Image src={heroImg} alt="Hero" priority placeholder="blur" />

      {/* Remote image — must specify dimensions */}
      <Image
        src="https://cdn.example.com/photo.jpg"
        alt="Photo"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Fill mode — image fills parent container */}
      <div style={{ position: 'relative', width: '100%', height: 400 }}>
        <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
      </div>
    </div>
  );
}
```

---

### Q: How does next/font work and why is it important? / next/font hoạt động thế nào? 🟢 Junior

**A:** `next/font` automatically self-hosts Google Fonts (or custom fonts) at build time — no requests to Google servers at runtime. It uses CSS `size-adjust` to eliminate layout shift (CLS) during font loading. Fonts are downloaded at build time, included in the deployment, and served from the same domain as your app.

Vietnamese: `next/font` tải font lúc build và tự host, không gọi đến Google CDN lúc runtime. Điều này giúp:
- **Privacy**: Không gửi request đến Google khi user truy cập.
- **Performance**: Font serve từ cùng domain, không cần DNS lookup thêm.
- **Không CLS**: Dùng CSS `size-adjust` để fallback font có cùng kích thước, không bị nhảy layout khi font load xong.
- **Zero config**: Chỉ cần import và dùng.

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',    // show fallback immediately, swap when loaded
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

### Q: How does the Metadata API work in Next.js? / Metadata API trong Next.js hoạt động thế nào? 🟡 Mid

**A:** Next.js provides two ways to define metadata for SEO: a static `metadata` object or a dynamic `generateMetadata` function exported from `page.tsx` or `layout.tsx`. Metadata is merged and deduplicated — child pages override parent layouts. It generates `<head>` tags including title, description, Open Graph, Twitter cards, canonical URL, and more.

Vietnamese: Metadata API thay thế việc dùng `<Head>` component thủ công. Có 2 cách:
- **Static**: Export `metadata` object — dùng khi metadata cố định.
- **Dynamic**: Export `generateMetadata` function — dùng khi metadata phụ thuộc params (ví dụ tên bài blog).
Metadata merge từ layout cha xuống page con, page con override layout cha. Next.js tự deduplicate tags. Hỗ trợ title template (ví dụ "Page Name | My Site"), Open Graph images, robots meta, và sitemap.

```tsx
// app/layout.tsx — Static metadata with template
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My Site',    // %s replaced by child page title
    default: 'My Site',
  },
  description: 'My awesome site',
  openGraph: { siteName: 'My Site', locale: 'en_US' },
};

// app/blog/[slug]/page.tsx — Dynamic metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,             // becomes "Post Title | My Site"
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.ogImage }],
    },
  };
}
```

---

### Q: How do environment variables work in Next.js? / Biến môi trường hoạt động thế nào trong Next.js? 🔴 Senior

**A:** Next.js supports `.env`, `.env.local`, `.env.development`, `.env.production` files. By default, env vars are only available on the server (Server Components, Route Handlers, middleware). To expose a variable to the browser, you must prefix it with `NEXT_PUBLIC_`. This is a critical security boundary — without the prefix, secrets like API keys, database URLs, and tokens stay server-side only.

Vietnamese: Biến môi trường trong Next.js có phân tầng rõ ràng:
- `.env` → base, tất cả environment
- `.env.local` → override local, **không** commit vào git
- `.env.development` / `.env.production` → theo environment

Quy tắc bảo mật quan trọng:
- **Không có prefix `NEXT_PUBLIC_`**: Chỉ truy cập được ở server (Server Components, Route Handlers, middleware). Dùng cho database URL, API secrets, JWT secret.
- **Có prefix `NEXT_PUBLIC_`**: Được inline vào JS bundle gửi xuống browser. Dùng cho public API URL, analytics ID, feature flags public. **Tuyệt đối KHÔNG đặt secret với prefix này.**

```bash
# .env.local (gitignored)
DATABASE_URL=postgresql://...      # Server only — safe
JWT_SECRET=my-super-secret          # Server only — safe
NEXT_PUBLIC_API_URL=https://api.example.com  # Exposed to browser
NEXT_PUBLIC_GA_ID=G-XXXXXXX       # Exposed to browser — OK for analytics
```

```tsx
// Server Component — can access ALL env vars
async function ServerPage() {
  const dbUrl = process.env.DATABASE_URL; // works
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // also works
  return <div>...</div>;
}

// Client Component — only NEXT_PUBLIC_ vars
'use client';
function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // works (inlined at build)
  const dbUrl = process.env.DATABASE_URL; // undefined — not exposed
  return <div>{apiUrl}</div>;
}
```

---

### Q: What is Next.js middleware and how does it work? / Middleware trong Next.js là gì? 🟡 Mid

**A:** Middleware is a function that runs before a request is completed, defined in a single `middleware.ts` file at the project root. It runs on the Edge Runtime (not Node.js), making it fast but limited — no Node.js APIs, no filesystem access. Common uses: authentication checks, redirects, A/B testing, geolocation-based routing, request/response header modification.

Vietnamese: Middleware chạy **trước** khi request đến bất kỳ route nào. Đặt file `middleware.ts` ở root project (cùng cấp `app/`). Chạy trên Edge Runtime — rất nhanh (< 1ms latency) nhưng giới hạn:
- Không dùng được Node.js API (fs, path, crypto full...).
- Chỉ dùng Web API chuẩn.
- Phù hợp cho: check auth token, redirect theo locale, set header, A/B testing.

Dùng `matcher` để chỉ định route nào middleware áp dụng. Không set matcher = chạy cho mọi route (kể cả static files).

```tsx
// middleware.ts (project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  // Redirect unauthenticated users
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());

  // Geolocation-based redirect
  const country = request.geo?.country;
  if (country === 'VN' && !request.nextUrl.pathname.startsWith('/vi')) {
    return NextResponse.redirect(new URL('/vi' + request.nextUrl.pathname, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // all except static
  ],
};
```

---

### Q: How do you deploy a Next.js application? / Cách deploy ứng dụng Next.js? 🟡 Mid

**A:** Next.js supports multiple deployment targets:

1. **Vercel** (recommended): Zero-config, automatic CI/CD, edge network, preview deployments. Best DX but vendor lock-in.
2. **Self-hosted Node.js**: `next build && next start` runs a Node.js server. Full feature support including ISR, middleware, image optimization.
3. **Docker**: Containerize with multi-stage build for minimal image size. Good for Kubernetes/ECS deployments.
4. **Static export**: `output: 'export'` in `next.config.js` generates pure static HTML. No server features (no SSR, no API routes, no middleware). Deployable to any static host (S3, Nginx, GitHub Pages).

Vietnamese: Có nhiều cách deploy Next.js, tuỳ vào nhu cầu:
- **Vercel**: Đơn giản nhất, zero config, hỗ trợ đầy đủ tính năng. Nhưng bị vendor lock-in và giá cao khi scale.
- **Self-host Node.js**: Tự chạy server, cần quản lý infra nhưng linh hoạt hoàn toàn. Cần chú ý caching layer (Redis/CDN).
- **Docker**: Đóng gói thành container, dùng multi-stage build để giảm image size. Phù hợp K8s.
- **Static export**: Export HTML tĩnh, mất hết tính năng server (SSR, API routes, middleware). Chỉ phù hợp static site thuần.

```dockerfile
# Dockerfile — Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```js
// next.config.js — for standalone output (smaller Docker image)
module.exports = {
  output: 'standalone',
};
```

---

### Q: What are common Next.js interview pitfalls? / Những lỗi phỏng vấn phổ biến về Next.js? 🔴 Senior

**A:** Common mistakes candidates make in Next.js interviews:

1. **Confusing Pages Router vs App Router**: Using `getServerSideProps` syntax when discussing App Router, or not knowing that App Router defaults to Server Components.
2. **Not understanding the `'use client'` boundary**: Thinking `'use client'` makes only that component client-side, when actually it makes the entire import subtree client-side.
3. **Ignoring caching semantics**: Not knowing that `fetch()` in App Router caches by default (`force-cache`), leading to stale data bugs.
4. **Saying "SSR is always better for SEO"**: SSG is equally good for SEO and faster. SSR is only needed when content is personalized or frequently updated.
5. **Not mentioning trade-offs**: Every rendering strategy has costs — SSR increases server load, SSG increases build time, ISR has stale windows, CSR has poor SEO.
6. **Forgetting streaming**: Not mentioning React Suspense + streaming SSR as a strategy to improve TTFB while still having dynamic content.

Vietnamese: Những lỗi ứng viên hay mắc:
1. **Nhầm Pages Router vs App Router**: Nói `getServerSideProps` khi đang thảo luận App Router. Cần biết rõ mình đang nói version nào.
2. **Hiểu sai `'use client'`**: `'use client'` không chỉ ảnh hưởng component đó mà cả subtree import bên dưới. Server Component vẫn có thể pass JSX xuống Client Component qua `children`.
3. **Không hiểu caching**: Trong App Router, `fetch()` mặc định cache (`force-cache`). Nhiều người debug mãi không hiểu sao data không update — vì chưa set `no-store` hoặc `revalidate`.
4. **Nói SSR luôn tốt cho SEO**: SSG cũng tốt cho SEO và nhanh hơn. Chỉ cần SSR khi data cá nhân hoá.
5. **Không nói trade-off**: Luôn đề cập cost khi chọn strategy — SSR tăng server cost, SSG tăng build time, ISR có stale window.
6. **Quên streaming**: Streaming SSR với Suspense giúp gửi shell HTML ngay, data chậm stream sau — cải thiện TTFB đáng kể.

---

## Quick Recap

| Topic | Key Point | Điểm then chốt |
|-------|-----------|-----------------|
| Next.js | React framework with SSR/SSG/ISR + routing | Framework React với đa chiến lược render |
| Routing | File-based in `app/` directory | Cấu trúc file = URL path |
| Rendering | SSG (build) / SSR (request) / ISR (timed) / CSR (browser) | Chọn đúng strategy cho use case |
| Data Fetching | `fetch()` in Server Components with cache options | Fetch trực tiếp trong Server Component |
| API Routes | `route.ts` with HTTP method exports | Endpoint backend trong cùng project |
| Image | `next/image` auto-optimizes size, format, loading | Tối ưu tự động, chống CLS |
| Font | `next/font` self-hosts at build time | Tự host, không CLS, không request Google |
| Metadata | Static `metadata` or dynamic `generateMetadata` | SEO tự động, merge cha-con |
| Env Vars | `NEXT_PUBLIC_` = browser, otherwise server only | Prefix quyết định bảo mật |
| Middleware | Edge Runtime, runs before every matched request | Nhanh, dùng cho auth/redirect |
| Deployment | Vercel / Node.js / Docker / Static export | Tuỳ nhu cầu, Vercel đơn giản nhất |
