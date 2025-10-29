# App Router & Server Components
## Next.js 16 - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Data Fetching & Caching →](./02-data-fetching-caching.md)

---

## Overview

Next.js 16's App Router represents a paradigm shift in how we build React applications, with Server Components as the default, streaming, and improved data fetching patterns.

---

## Table of Contents
1. [App Router Basics](#app-router-basics)
2. [Server Components vs Client Components](#server-components-vs-client-components)
3. [File Conventions](#file-conventions)
4. [Layouts and Templates](#layouts-and-templates)
5. [Loading and Error States](#loading-and-error-states)
6. [Streaming and Suspense](#streaming-and-suspense)
7. [Route Groups](#route-groups)
8. [Parallel Routes](#parallel-routes)
9. [Intercepting Routes](#intercepting-routes)
10. [Interview Questions](#interview-questions)

---

## App Router Basics

### Directory Structure

```
app/
├── layout.tsx          # Root layout (required)
├── page.tsx           # Home page (/)
├── loading.tsx        # Loading UI
├── error.tsx          # Error UI
├── not-found.tsx      # 404 page
├── global-error.tsx   # Global error boundary
├── template.tsx       # Re-rendered layout
├── about/
│   └── page.tsx       # /about
├── blog/
│   ├── layout.tsx     # Blog layout
│   ├── page.tsx       # /blog
│   └── [slug]/
│       └── page.tsx   # /blog/[slug]
└── dashboard/
    ├── layout.tsx
    ├── page.tsx       # /dashboard
    ├── settings/
    │   └── page.tsx   # /dashboard/settings
    └── analytics/
        └── page.tsx   # /dashboard/analytics
```

### Basic Page Component

```typescript
// app/page.tsx - Server Component by default
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Next.js 16</h1>
      <p>This is a Server Component</p>
    </main>
  );
}

// With TypeScript props
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div>
      <h1>Slug: {params.slug}</h1>
      <p>Search: {JSON.stringify(searchParams)}</p>
    </div>
  );
}
```

---

## Server Components vs Client Components

### Server Components (Default)

```typescript
// app/posts/page.tsx - Server Component
// No 'use client' directive = Server Component

async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // ISR
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post: Post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}

// Benefits:
// ✅ Direct database access
// ✅ Secure API keys
// ✅ Zero JavaScript to client
// ✅ Automatic code splitting
// ✅ Better SEO
```

### Client Components

```typescript
// app/components/counter.tsx - Client Component
'use client'; // Required directive

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

// Use when you need:
// ✅ useState, useEffect, other hooks
// ✅ Event listeners (onClick, onChange)
// ✅ Browser APIs (localStorage, window)
// ✅ Custom hooks
// ✅ Class components
```

### Composition Pattern

```typescript
// app/page.tsx - Server Component
import { Counter } from './components/counter'; // Client Component
import { PostList } from './components/post-list'; // Server Component

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main>
      {/* Server Component */}
      <PostList posts={posts} />
      
      {/* Client Component */}
      <Counter />
    </main>
  );
}

// Best Practice: Keep Client Components as leaves
// Server Component
//   ├── Server Component
//   │   └── Client Component (leaf)
//   └── Client Component (leaf)
```

### Passing Props Between Server and Client

```typescript
// ✅ Can pass serializable props from Server to Client
// app/page.tsx - Server Component
import { ClientComponent } from './client-component';

export default async function Page() {
  const data = await fetchData();
  
  return (
    <ClientComponent 
      data={data}  // ✅ Serializable data
      count={42}   // ✅ Primitives
    />
  );
}

// app/client-component.tsx
'use client';

interface Props {
  data: SerializableData;
  count: number;
}

export function ClientComponent({ data, count }: Props) {
  return <div>{data.title}</div>;
}

// ❌ Cannot pass non-serializable props
// Functions, class instances, etc.
```

---

## File Conventions

### layout.tsx - Shared UI

```typescript
// app/layout.tsx - Root Layout (Required)
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'My App',
  description: 'Created with Next.js 16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>{/* Navigation */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* Footer */}</footer>
      </body>
    </html>
  );
}

// Nested layout
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>{/* Sidebar */}</aside>
      <div className="content">{children}</div>
    </div>
  );
}
```

### page.tsx - Route UI

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await getPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await getPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### loading.tsx - Loading UI

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  );
}

// Automatically wraps page in Suspense boundary
// <Suspense fallback={<Loading />}>
//   <Page />
// </Suspense>
```

### error.tsx - Error Boundary

```typescript
// app/dashboard/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="error">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}

// global-error.tsx - Catches errors in root layout
// app/global-error.tsx
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

### not-found.tsx - 404 Page

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}

// Trigger programmatically
// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound(); // Renders not-found.tsx
  }
  
  return <article>{post.title}</article>;
}
```

---

## Layouts and Templates

### Layout vs Template

```typescript
// layout.tsx - Persists across navigations, maintains state
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar /> {/* State persists */}
      {children}
    </div>
  );
}

// template.tsx - Re-renders on navigation, resets state
// app/dashboard/template.tsx
export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AnimatedWrapper> {/* Re-animates on each navigation */}
        {children}
      </AnimatedWrapper>
    </div>
  );
}

// Hierarchy: layout → template → page
```

### Multiple Layouts

```typescript
// app/layout.tsx - Root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - Dashboard layout
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/dashboard/settings/layout.tsx - Settings layout
export default function SettingsLayout({ children }) {
  return (
    <div className="settings">
      <SettingsSidebar />
      <div>{children}</div>
    </div>
  );
}

// Renders: RootLayout → DashboardLayout → SettingsLayout → Page
```

---

## Loading and Error States

### Granular Loading States

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from './revenue-chart';
import { UserStats } from './user-stats';
import { RecentOrders } from './recent-orders';

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Each component can have its own loading state */}
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}

// Components fetch their own data
// app/dashboard/revenue-chart.tsx
async function getRevenue() {
  const res = await fetch('https://api.example.com/revenue');
  return res.json();
}

export async function RevenueChart() {
  const revenue = await getRevenue();
  
  return <Chart data={revenue} />;
}
```

### Error Boundaries at Different Levels

```typescript
// app/dashboard/error.tsx - Catches errors in dashboard
'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>Dashboard Error</h2>
      <button onClick={reset}>Retry</button>
    </div>
  );
}

// app/dashboard/settings/error.tsx - Catches errors in settings
'use client';

export default function SettingsError({ error, reset }) {
  return (
    <div>
      <h2>Settings Error</h2>
      <button onClick={reset}>Retry</button>
    </div>
  );
}

// Errors bubble up to nearest error boundary
```

---

## Streaming and Suspense

### Progressive Rendering

```typescript
// app/page.tsx
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div>
      {/* Renders immediately */}
      <Header />

      {/* Streams in when ready */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />
      </Suspense>

      {/* Streams in independently */}
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments />
      </Suspense>

      {/* Renders immediately */}
      <Footer />
    </div>
  );
}

// Server Component that takes time
async function Posts() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const posts = await getPosts();
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Streaming with loading.tsx

```typescript
// Automatic Suspense boundary
// app/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />;
}

// Equivalent to:
// <Suspense fallback={<Loading />}>
//   <Dashboard />
// </Suspense>
```

---

## Route Groups

### Organizing Routes

```typescript
// Route groups don't affect URL structure
// Use (folder) syntax

app/
├── (marketing)/
│   ├── layout.tsx      # Marketing layout
│   ├── page.tsx        # / (home)
│   ├── about/
│   │   └── page.tsx    # /about
│   └── contact/
│       └── page.tsx    # /contact
├── (shop)/
│   ├── layout.tsx      # Shop layout
│   ├── products/
│   │   └── page.tsx    # /products
│   └── cart/
│       └── page.tsx    # /cart
└── (dashboard)/
    ├── layout.tsx      # Dashboard layout
    ├── analytics/
    │   └── page.tsx    # /analytics
    └── settings/
        └── page.tsx    # /settings

// Different layouts for different sections
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <div>
      <MarketingNav />
      {children}
    </div>
  );
}

// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardSidebar />
      {children}
    </div>
  );
}
```

### Multiple Root Layouts

```typescript
// app/(marketing)/layout.tsx
export default function MarketingLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MarketingHeader />
        {children}
      </body>
    </html>
  );
}

// app/(app)/layout.tsx
export default function AppLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
```

---

## Parallel Routes

### Named Slots

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
      <div className="grid grid-cols-2">
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    </div>
  );
}

// Directory structure:
// app/dashboard/
// ├── layout.tsx
// ├── page.tsx           # children
// ├── @analytics/
// │   └── page.tsx       # analytics slot
// └── @team/
//     └── page.tsx       # team slot

// app/dashboard/@analytics/page.tsx
export default function AnalyticsSlot() {
  return <AnalyticsPanel />;
}

// app/dashboard/@team/page.tsx
export default function TeamSlot() {
  return <TeamPanel />;
}
```

### Conditional Rendering

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  user,
  admin,
}: {
  children: React.ReactNode;
  user: React.ReactNode;
  admin: React.ReactNode;
}) {
  const isAdmin = checkAdmin();
  
  return (
    <div>
      {children}
      {isAdmin ? admin : user}
    </div>
  );
}
```

---

## Intercepting Routes

### Modal Overlays

```typescript
// Show modal on same page, full page on refresh
// app/photos/[id]/page.tsx - Full page
export default function PhotoPage({ params }) {
  return (
    <div>
      <Image src={`/photos/${params.id}`} />
    </div>
  );
}

// app/(..)photos/[id]/page.tsx - Intercepted (modal)
import { Modal } from '@/components/modal';

export default function PhotoModal({ params }) {
  return (
    <Modal>
      <Image src={`/photos/${params.id}`} />
    </Modal>
  );
}

// Intercepting conventions:
// (.) - same level
// (..) - one level up
// (..)(..) - two levels up
// (...) - from root
```

---

## Interview Questions

### Q1: What's the difference between Server and Client Components?

**Answer:**
- **Server Components**: Run on server, can access backend directly, zero JS to client
- **Client Components**: Run on client, can use hooks and browser APIs, need 'use client'

### Q2: When should you use Client Components?

**Answer:**
When you need:
- State (useState, useReducer)
- Effects (useEffect)
- Event listeners
- Browser APIs
- Custom hooks

### Q3: How does streaming work in Next.js?

**Answer:**
Streaming sends HTML in chunks as it's generated. Use Suspense boundaries to stream different parts independently, improving perceived performance.

### Q4: What's the purpose of route groups?

**Answer:**
Route groups `(folder)` organize routes without affecting URLs, allowing different layouts for different sections while maintaining clean URLs.

---

## Summary

- App Router uses Server Components by default
- File conventions: layout, page, loading, error, not-found
- Streaming with Suspense for progressive rendering
- Route groups for organization
- Parallel routes for complex layouts
- Intercepting routes for modals

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Data Fetching & Caching →](./02-data-fetching-caching.md)
