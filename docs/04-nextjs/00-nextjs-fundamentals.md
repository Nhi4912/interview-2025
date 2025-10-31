# Next.js Fundamentals
## Next.js - Chapter 0

[Back to Table of Contents](../00-table-of-contents.md) | [Next: App Router & Server Components →](./01-app-router-server-components.md)

---

## Overview

Next.js is a React framework for building full-stack web applications. This chapter covers the fundamental concepts you need to master for Big Tech interviews.

---

## Table of Contents

1. [What is Next.js?](#what-is-nextjs)
2. [Pages vs App Router](#pages-vs-app-router)
3. [Routing Basics](#routing-basics)
4. [Rendering Strategies](#rendering-strategies)
5. [Data Fetching](#data-fetching)
6. [API Routes](#api-routes)
7. [Image Optimization](#image-optimization)
8. [Font Optimization](#font-optimization)
9. [Metadata and SEO](#metadata-and-seo)
10. [Environment Variables](#environment-variables)
11. [Interview Questions](#interview-questions)

---

## What is Next.js?

### Core Features

**Definition:** Next.js is a React framework that provides infrastructure and optimizations for production-ready applications.

**Key Features:**
- **Hybrid Rendering**: SSR, SSG, ISR, CSR
- **File-based Routing**: Automatic routing from file structure
- **API Routes**: Backend endpoints in same project
- **Built-in Optimizations**: Images, fonts, scripts
- **TypeScript Support**: First-class TypeScript support
- **Fast Refresh**: Instant feedback during development

### Why Next.js?

```typescript
// Traditional React (CRA)
// - Client-side only
// - Manual routing setup
// - No built-in SSR
// - Manual optimization
// - Separate backend needed

// Next.js
// - Multiple rendering strategies
// - Automatic routing
// - Built-in SSR/SSG
// - Automatic optimizations
// - API routes included
```

### Next.js vs React

| Feature | React | Next.js |
|---------|-------|---------|
| Routing | Manual (React Router) | File-based |
| Rendering | CSR only | SSR, SSG, ISR, CSR |
| SEO | Poor (CSR) | Excellent (SSR/SSG) |
| Performance | Manual optimization | Automatic |
| Backend | Separate | API Routes |
| Image Optimization | Manual | Built-in |

---

## Pages vs App Router

### Pages Router (Legacy)

```typescript
// pages/index.tsx
export default function Home() {
  return <h1>Home Page</h1>;
}

// pages/about.tsx
export default function About() {
  return <h1>About Page</h1>;
}

// pages/blog/[slug].tsx
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// pages/_app.tsx - Custom App
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// pages/_document.tsx - Custom Document
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### App Router (Modern)

```typescript
// app/page.tsx
export default function Home() {
  return <h1>Home Page</h1>;
}

// app/about/page.tsx
export default function About() {
  return <h1>About Page</h1>;
}

// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// app/layout.tsx - Root Layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Migration Considerations

```typescript
// Pages Router → App Router

// ✅ Advantages of App Router:
// - Server Components by default
// - Improved data fetching
// - Better layouts
// - Streaming and Suspense
// - Parallel routes
// - Intercepting routes

// ⚠️ Breaking Changes:
// - Different file structure
// - New data fetching methods
// - Client Components need 'use client'
// - Different API route structure
```

---

## Routing Basics

### File-Based Routing

```typescript
// Directory structure → Routes

app/
├── page.tsx                    → /
├── about/
│   └── page.tsx               → /about
├── blog/
│   ├── page.tsx               → /blog
│   └── [slug]/
│       └── page.tsx           → /blog/:slug
├── products/
│   └── [category]/
│       └── [id]/
│           └── page.tsx       → /products/:category/:id
└── dashboard/
    ├── page.tsx               → /dashboard
    ├── settings/
    │   └── page.tsx           → /dashboard/settings
    └── [...slug]/
        └── page.tsx           → /dashboard/* (catch-all)
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogPost({ params, searchParams }: PageProps) {
  return (
    <div>
      <h1>Post: {params.slug}</h1>
      <p>Query: {JSON.stringify(searchParams)}</p>
    </div>
  );
}

// /blog/hello-world → params.slug = "hello-world"
// /blog/hello-world?ref=twitter → searchParams.ref = "twitter"
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  return <div>Path: {params.slug.join('/')}</div>;
}

// /docs/a → params.slug = ["a"]
// /docs/a/b → params.slug = ["a", "b"]
// /docs/a/b/c → params.slug = ["a", "b", "c"]

// Optional catch-all: [[...slug]]
// app/docs/[[...slug]]/page.tsx
// /docs → params.slug = undefined
// /docs/a → params.slug = ["a"]
```

### Navigation

```typescript
// Link Component
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/hello-world">Blog Post</Link>
      
      {/* With query params */}
      <Link href={{ pathname: '/blog', query: { page: 1 } }}>
        Blog
      </Link>
      
      {/* Prefetch disabled */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page
      </Link>
    </nav>
  );
}

// Programmatic Navigation
'use client';

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();
  
  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
    // router.replace('/dashboard'); // No history entry
    // router.back(); // Go back
    // router.forward(); // Go forward
    // router.refresh(); // Refresh current route
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

---

## Rendering Strategies

### Static Site Generation (SSG)

```typescript
// Generated at build time
// app/blog/[slug]/page.tsx

// Generate static params
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Fetch data at build time
export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

// Benefits:
// ✅ Fast page loads
// ✅ Good for SEO
// ✅ Can be cached on CDN
// ✅ Low server load

// Use cases:
// - Blog posts
// - Documentation
// - Marketing pages
// - Product pages
```

### Server-Side Rendering (SSR)

```typescript
// Generated on each request
// app/dashboard/page.tsx

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetched on each request
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // Disable caching
  });
  
  return <div>{/* Dashboard content */}</div>;
}

// Benefits:
// ✅ Always fresh data
// ✅ Good for SEO
// ✅ Personalized content

// Use cases:
// - User dashboards
// - Real-time data
// - Personalized pages
// - Authentication-required pages
```

### Incremental Static Regeneration (ISR)

```typescript
// Regenerate static pages after deployment
// app/blog/[slug]/page.tsx

export default async function BlogPost({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

// Benefits:
// ✅ Static performance
// ✅ Fresh content
// ✅ No rebuild needed

// Use cases:
// - Blog with frequent updates
// - E-commerce product pages
// - News sites
```

### Client-Side Rendering (CSR)

```typescript
// Rendered in browser
'use client';

import { useState, useEffect } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  if (!data) return <div>Loading...</div>;
  
  return <div>{data.content}</div>;
}

// Benefits:
// ✅ Interactive
// ✅ No server load
// ✅ Rich user experience

// Use cases:
// - Interactive widgets
// - Real-time updates
// - User-specific content
```

---

## Data Fetching

### Server Components (Recommended)

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Parallel Data Fetching

```typescript
// Fetch multiple data sources in parallel
export default async function Page() {
  // Parallel fetching
  const [posts, users, comments] = await Promise.all([
    getPosts(),
    getUsers(),
    getComments()
  ]);
  
  return (
    <div>
      <Posts data={posts} />
      <Users data={users} />
      <Comments data={comments} />
    </div>
  );
}
```

### Sequential Data Fetching

```typescript
// Fetch data sequentially when needed
export default async function Page({ params }) {
  // First fetch
  const user = await getUser(params.id);
  
  // Second fetch depends on first
  const posts = await getUserPosts(user.id);
  
  return (
    <div>
      <UserProfile user={user} />
      <UserPosts posts={posts} />
    </div>
  );
}
```

### Caching Strategies

```typescript
// No caching (SSR)
fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Revalidate after time (ISR)
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1 hour
});

// Cache forever (SSG)
fetch('https://api.example.com/data', {
  cache: 'force-cache'
});

// Revalidate on demand
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific path
revalidatePath('/blog/post-1');

// Revalidate by tag
fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] }
});
revalidateTag('posts');
```

---

## API Routes

### Basic API Route

```typescript
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  return Response.json({ 
    message: 'Created',
    data: body 
  }, { status: 201 });
}

// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id);
  
  if (!user) {
    return Response.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  return Response.json(user);
}
```

### Request and Response

```typescript
// app/api/search/route.ts
export async function GET(request: Request) {
  // Get URL and search params
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  // Get headers
  const authorization = request.headers.get('authorization');
  
  // Search
  const results = await search(query);
  
  // Return with custom headers
  return Response.json(results, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Custom-Header': 'value'
    }
  });
}

export async function POST(request: Request) {
  // Get JSON body
  const body = await request.json();
  
  // Get form data
  const formData = await request.formData();
  const name = formData.get('name');
  
  // Process and return
  const result = await processData(body);
  
  return Response.json(result);
}
```

### Middleware

```typescript
// middleware.ts (root level)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'value');
  
  return response;
}

// Configure which paths to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
};
```

---

## Image Optimization

### Next.js Image Component

```typescript
import Image from 'next/image';

export default function Gallery() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/hero.jpg"
        alt="Hero image"
        width={800}
        height={600}
        priority // Load immediately
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Remote image"
        width={800}
        height={600}
        loading="lazy" // Lazy load
      />
      
      {/* Fill container */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Responsive */}
      <Image
        src="/responsive.jpg"
        alt="Responsive image"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Configure remote images
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};
```

### Image Optimization Benefits

```typescript
// Automatic optimizations:
// ✅ Resize images for different devices
// ✅ Convert to modern formats (WebP, AVIF)
// ✅ Lazy load images
// ✅ Prevent layout shift
// ✅ Serve from CDN
// ✅ On-demand optimization
```

---

## Font Optimization

### Google Fonts

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

// Use in CSS
// .code {
//   font-family: var(--font-roboto-mono);
// }
```

### Local Fonts

```typescript
// app/layout.tsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/my-font.woff2',
  display: 'swap',
  variable: '--font-my-font',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Metadata and SEO

### Static Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'My awesome Next.js app',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'John Doe' }],
  openGraph: {
    title: 'My App',
    description: 'My awesome Next.js app',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'My awesome Next.js app',
    images: ['/twitter-image.jpg'],
  },
};
```

### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}
```

---

## Environment Variables

### Configuration

```bash
# .env.local (not committed)
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=secret_key

# .env (committed, defaults)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_NAME=My App
```

### Usage

```typescript
// Server-side (Server Components, API Routes)
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// Client-side (must be prefixed with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const siteName = process.env.NEXT_PUBLIC_SITE_NAME;

// Type-safe environment variables
// env.ts
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  API_KEY: process.env.API_KEY!,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
};
```

---

## Interview Questions

### Q1: What are the main rendering strategies in Next.js?

**Answer:**
1. **SSG (Static Site Generation)**: Pre-rendered at build time
2. **SSR (Server-Side Rendering)**: Rendered on each request
3. **ISR (Incremental Static Regeneration)**: Static with periodic updates
4. **CSR (Client-Side Rendering)**: Rendered in browser

### Q2: When should you use SSG vs SSR?

**Answer:**
**SSG:**
- Content doesn't change often
- Can be pre-rendered
- Examples: Blog, docs, marketing pages

**SSR:**
- Content changes frequently
- Personalized content
- Examples: Dashboards, user profiles

### Q3: How does Next.js optimize images?

**Answer:**
- Automatic resizing for different devices
- Modern format conversion (WebP, AVIF)
- Lazy loading
- Prevents layout shift
- On-demand optimization
- CDN delivery

### Q4: What's the difference between Pages and App Router?

**Answer:**
**Pages Router:**
- File-based routing in `pages/`
- `getServerSideProps`, `getStaticProps`
- `_app.tsx`, `_document.tsx`

**App Router:**
- File-based routing in `app/`
- Server Components by default
- Layouts, loading, error states
- Streaming and Suspense

### Q5: How do you handle authentication in Next.js?

**Answer:**
1. **Middleware**: Check auth before rendering
2. **Server Components**: Verify on server
3. **API Routes**: Protect endpoints
4. **Client Components**: Handle login/logout

```typescript
// middleware.ts
export function middleware(request) {
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.redirect('/login');
  }
}
```

---

## Key Takeaways

1. Next.js provides multiple rendering strategies
2. File-based routing simplifies navigation
3. Server Components are default in App Router
4. Built-in optimizations for images and fonts
5. API Routes enable full-stack development
6. Metadata API improves SEO
7. Environment variables for configuration
8. Middleware for request interception

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: App Router & Server Components →](./01-app-router-server-components.md)
