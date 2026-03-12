# Next.js Optimization - Performance Best Practices

> Next.js có nhiều built-in optimizations. Hiểu và áp dụng đúng để maximize performance.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   NEXT.JS OPTIMIZATIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   IMAGES            FONTS             SCRIPTS                    │
│   ┌────────────┐   ┌────────────┐    ┌────────────┐             │
│   │ next/image │   │ next/font  │    │ next/script│             │
│   │ • Lazy load│   │ • Self-host│    │ • Strategy │             │
│   │ • Resize   │   │ • No CLS   │    │ • Priority │             │
│   │ • WebP/AVIF│   │ • Preload  │    │ • Worker   │             │
│   └────────────┘   └────────────┘    └────────────┘             │
│                                                                   │
│   BUNDLING          CACHING          RENDERING                   │
│   ┌────────────┐   ┌────────────┐    ┌────────────┐             │
│   │ Code split │   │ Static     │    │ RSC        │             │
│   │ Tree shake │   │ ISR        │    │ Streaming  │             │
│   │ Dynamic    │   │ Route cache│    │ PPR        │             │
│   └────────────┘   └────────────┘    └────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🖼️ Image Optimization

### next/image Component

```typescript
import Image from 'next/image';

// Local image (auto-optimized)
import heroImage from '@/public/hero.jpg';

export function Hero() {
    return (
        <Image
            src={heroImage}
            alt="Hero image"
            placeholder="blur" // Auto blur placeholder
            priority // Preload for LCP
        />
    );
}

// Remote image
export function Avatar({ user }) {
    return (
        <Image
            src={user.avatarUrl}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full"
        />
    );
}
```

### Image Properties

```typescript
<Image
    src="/hero.jpg"
    alt="Description"

    // Sizing
    width={800}
    height={600}
    // OR
    fill // Fill parent container

    // Layout
    sizes="(max-width: 768px) 100vw, 50vw"

    // Loading
    loading="lazy" // Default
    priority // Eager load for LCP images

    // Placeholder
    placeholder="blur"
    blurDataURL="data:image/..." // For remote images

    // Quality
    quality={75} // 1-100, default 75

    // Styling
    className="rounded"
    style={{ objectFit: 'cover' }}
/>
```

### Remote Image Configuration

```javascript
// next.config.js
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.example.com',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
            },
        ],
        // Custom image formats
        formats: ['image/avif', 'image/webp'],
        // Device sizes for srcset
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        // Image sizes for smaller images
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
};
```

### Responsive Images

```typescript
// Fill container
<div className="relative h-64 w-full">
    <Image
        src="/banner.jpg"
        alt="Banner"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
    />
</div>

// Responsive with sizes
<Image
    src="/product.jpg"
    alt="Product"
    width={800}
    height={600}
    sizes="(max-width: 640px) 100vw,
           (max-width: 1024px) 50vw,
           33vw"
/>
```

---

## 🔤 Font Optimization

### Google Fonts

```typescript
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
```

### CSS Variables

```css
/* globals.css */
:root {
    --font-inter: 'Inter', sans-serif;
    --font-roboto-mono: 'Roboto Mono', monospace;
}

body {
    font-family: var(--font-inter);
}

code {
    font-family: var(--font-roboto-mono);
}
```

### Local Fonts

```typescript
import localFont from 'next/font/local';

const myFont = localFont({
    src: [
        {
            path: './fonts/MyFont-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './fonts/MyFont-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    display: 'swap',
});
```

### Benefits

```
┌─────────────────────────────────────────────────────────────────┐
│                   FONT OPTIMIZATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Without next/font:                                             │
│   1. Browser requests page                                        │
│   2. CSS loads                                                    │
│   3. Font file requested from Google                             │
│   4. Font downloads                                               │
│   5. Layout shift when font applies (CLS!)                       │
│                                                                   │
│   With next/font:                                                 │
│   1. Fonts self-hosted (no external requests)                    │
│   2. CSS font-display: swap applied                              │
│   3. Size-adjust calculated to prevent CLS                       │
│   4. Preloaded in <head>                                         │
│   → Zero CLS, faster load                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📜 Script Optimization

### next/script Strategies

```typescript
import Script from 'next/script';

// After interactive (default) - for non-critical scripts
<Script
    src="https://example.com/analytics.js"
    strategy="afterInteractive"
/>

// Lazy load - for low priority scripts
<Script
    src="https://example.com/chat-widget.js"
    strategy="lazyOnload"
/>

// Before interactive - for critical scripts
<Script
    src="https://example.com/critical.js"
    strategy="beforeInteractive"
/>

// Worker - run in web worker (experimental)
<Script
    src="https://example.com/heavy-script.js"
    strategy="worker"
/>
```

### Inline Scripts

```typescript
// Inline script
<Script id="show-banner">
    {`document.getElementById('banner').classList.remove('hidden')`}
</Script>

// With event handlers
<Script
    src="https://example.com/widget.js"
    onLoad={() => {
        console.log('Script loaded');
    }}
    onError={(e) => {
        console.error('Script error', e);
    }}
/>
```

### Analytics Example

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}

                {/* Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${process.env.GA_ID}');
                    `}
                </Script>
            </body>
        </html>
    );
}
```

---

## 📦 Code Splitting

### Automatic Code Splitting

```typescript
// Each page is automatically code-split
// app/page.tsx → separate chunk
// app/about/page.tsx → separate chunk
// app/blog/page.tsx → separate chunk
```

### Dynamic Imports

```typescript
import dynamic from 'next/dynamic';

// Component lazy loading
const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
    loading: () => <Skeleton />,
});

// No SSR (client-only component)
const ClientOnlyChart = dynamic(
    () => import('@/components/Chart'),
    { ssr: false }
);

// Named export
const Modal = dynamic(
    () => import('@/components/Modal').then(mod => mod.Modal)
);

export default function Page() {
    return (
        <div>
            <HeavyComponent />
            <ClientOnlyChart data={data} />
        </div>
    );
}
```

### Route-based Splitting

```typescript
// Automatic parallel route loading
// app/@modal/login/page.tsx loads separately

// Conditional component loading
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/AdminPanel'));

export default function Dashboard({ user }) {
    return (
        <div>
            <DashboardContent />
            {user.isAdmin && <AdminPanel />}
        </div>
    );
}
```

---

## 🔄 Caching

### Cache Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS CACHING LAYERS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Request     Router      Data        Full Route                 │
│   Memoization Cache       Cache       Cache                      │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│   │ Duration│ │ Duration│ │ Duration│ │ Duration│               │
│   │ Request │ │ Session │ │ Persist │ │ Persist │               │
│   │         │ │         │ │         │ │ (static)│               │
│   │ Same    │ │ Client  │ │ Server  │ │ Build   │               │
│   │ render  │ │ nav     │ │ + CDN   │ │ time    │               │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                   │
│   cache()     Automatic   fetch()     Static/ISR                 │
│                           options                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Request Memoization

```typescript
// lib/data.ts
import { cache } from 'react';

// Memoize expensive computation per request
export const getUser = cache(async (id: string) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
});

// Multiple components can call getUser(id)
// Only one actual fetch per request
```

### Data Cache Control

```typescript
// Cache forever (default)
fetch(url);
fetch(url, { cache: 'force-cache' });

// No cache
fetch(url, { cache: 'no-store' });

// Revalidate time-based
fetch(url, { next: { revalidate: 3600 } });

// Tag-based revalidation
fetch(url, { next: { tags: ['products'] } });

// Revalidate
import { revalidateTag, revalidatePath } from 'next/cache';
revalidateTag('products');
revalidatePath('/products');
```

### Route Segment Config

```typescript
// app/products/page.tsx

// Dynamic mode
export const dynamic = 'auto'; // default
export const dynamic = 'force-dynamic'; // always dynamic
export const dynamic = 'force-static'; // always static
export const dynamic = 'error'; // error if dynamic

// Revalidation
export const revalidate = 3600; // seconds
export const revalidate = false; // never (static)
export const revalidate = 0; // always revalidate

// Runtime
export const runtime = 'nodejs'; // default
export const runtime = 'edge'; // edge runtime
```

---

## ⚡ Partial Prerendering (PPR)

```typescript
// next.config.js
module.exports = {
    experimental: {
        ppr: true,
    },
};

// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
    return (
        <main>
            {/* Static shell - pre-rendered */}
            <Header />
            <StaticContent />

            {/* Dynamic parts - streamed */}
            <Suspense fallback={<CartSkeleton />}>
                <Cart /> {/* Uses cookies - dynamic */}
            </Suspense>

            <Suspense fallback={<RecommendationsSkeleton />}>
                <Recommendations /> {/* Personalized - dynamic */}
            </Suspense>

            {/* Static footer */}
            <Footer />
        </main>
    );
}

// Static shell served immediately from CDN
// Dynamic parts stream in as ready
```

---

## 🔍 Metadata Optimization

### Static Metadata

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        template: '%s | My App',
        default: 'My App',
    },
    description: 'My awesome application',
    keywords: ['Next.js', 'React', 'JavaScript'],
    authors: [{ name: 'Author' }],
    openGraph: {
        title: 'My App',
        description: 'My awesome application',
        url: 'https://example.com',
        siteName: 'My App',
        images: [
            {
                url: 'https://example.com/og.png',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'My App',
        description: 'My awesome application',
        images: ['https://example.com/og.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};
```

### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPost(params.slug);

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}
```

---

## 📊 Bundle Analysis

```bash
# Install analyzer
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    // config
});

# Run analysis
ANALYZE=true npm run build
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: next/image benefits?**

A:
- Automatic lazy loading
- Responsive images with srcset
- Automatic format conversion (WebP/AVIF)
- Prevents CLS with size placeholder
- On-demand optimization

**Q: Script strategy options?**

A:
- `beforeInteractive`: Load before page interactive (critical)
- `afterInteractive`: Load after hydration (default)
- `lazyOnload`: Load during idle time (low priority)
- `worker`: Run in web worker (experimental)

### 🟡 Mid-level

**Q: next/font benefits vs manual loading?**

A:
- Self-hosted (no external requests)
- Zero layout shift (size-adjust)
- Automatic subsetting
- Preloaded in head
- CSS variable support

**Q: Explain Next.js caching layers**

A:
1. Request Memoization: Same request in render
2. Data Cache: fetch() results on server
3. Router Cache: Client-side route cache
4. Full Route Cache: Static HTML at build

### 🔴 Senior

**Q: Design optimization strategy for e-commerce**

A:
1. Images: priority for hero/LCP, lazy others, responsive sizes
2. Fonts: next/font for brand fonts, system for body
3. Code split: dynamic import heavy components
4. Caching: ISR for products, SSR for cart
5. PPR: static shell, stream personalized content
6. Edge: deploy to edge for global performance

---

## 📚 Active Recall

1. [ ] Image component priority prop purpose
2. [ ] 4 Script loading strategies
3. [ ] Font optimization prevents what issue?
4. [ ] Dynamic import ssr: false use case
5. [ ] 4 Next.js caching layers

---

> **Tiếp theo:** [mindmap-nextjs.md](./mindmap-nextjs.md) - Next.js Mind Map
