# Core Web Vitals
## Performance Optimization - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Loading Performance →](./02-loading-performance.md)

---

## Overview

Core Web Vitals are Google's metrics for measuring user experience. Understanding and optimizing these metrics is crucial for modern web development and technical interviews at Big Tech companies.

---

## Table of Contents
1. [What are Core Web Vitals?](#what-are-core-web-vitals)
2. [Largest Contentful Paint (LCP)](#largest-contentful-paint-lcp)
3. [First Input Delay (FID) / Interaction to Next Paint (INP)](#first-input-delay-fid--interaction-to-next-paint-inp)
4. [Cumulative Layout Shift (CLS)](#cumulative-layout-shift-cls)
5. [Measuring Web Vitals](#measuring-web-vitals)
6. [Optimization Strategies](#optimization-strategies)
7. [Real-World Examples](#real-world-examples)
8. [Interview Questions](#interview-questions)

---

## What are Core Web Vitals?

### The Three Metrics

```
Core Web Vitals (2024-2025)
├── LCP (Largest Contentful Paint)
│   └── Loading Performance
│       Target: < 2.5 seconds
│
├── INP (Interaction to Next Paint)
│   └── Interactivity
│       Target: < 200 milliseconds
│
└── CLS (Cumulative Layout Shift)
    └── Visual Stability
        Target: < 0.1
```

### Why They Matter

```typescript
// Impact on business metrics
const webVitalsImpact = {
  LCP: {
    metric: 'Loading speed',
    impact: 'User engagement, bounce rate',
    example: '1s improvement = 8% conversion increase'
  },
  INP: {
    metric: 'Responsiveness',
    impact: 'User frustration, task completion',
    example: '100ms improvement = 1% conversion increase'
  },
  CLS: {
    metric: 'Visual stability',
    impact: 'User trust, accidental clicks',
    example: 'Reducing CLS = 20% fewer rage clicks'
  }
};
```

---

## Largest Contentful Paint (LCP)

### Definition

**LCP measures loading performance** - the time it takes for the largest content element to become visible in the viewport.

### Target Scores

```
Good:    < 2.5 seconds
Needs Improvement: 2.5 - 4.0 seconds
Poor:    > 4.0 seconds
```

### What Counts as LCP?

```typescript
// Elements that can be LCP
const lcpElements = [
  '<img>',
  '<image> inside <svg>',
  '<video> (poster image)',
  'Element with background image (CSS)',
  'Block-level element with text'
];

// Example: Identifying LCP element
// Usually the hero image or main heading
```

### Common LCP Issues

```typescript
// ❌ Problem 1: Large, unoptimized images
<img src="/hero.jpg" alt="Hero" /> // 5MB image

// ✅ Solution: Optimize and use Next.js Image
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Preload LCP image
  quality={85}
  placeholder="blur"
/>

// ❌ Problem 2: Render-blocking resources
<link rel="stylesheet" href="/styles.css" />
<script src="/analytics.js"></script>

// ✅ Solution: Defer non-critical resources
<link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'" />
<script src="/analytics.js" defer></script>

// ❌ Problem 3: Slow server response
// TTFB (Time to First Byte) > 600ms

// ✅ Solution: Use CDN, optimize backend, implement caching
```

### Optimizing LCP

```typescript
// 1. Preload critical resources
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="preload"
          href="/hero.jpg"
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href="/fonts/inter.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

// 2. Optimize images
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// 3. Use responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>

// 4. Implement resource hints
<link rel="dns-prefetch" href="https://api.example.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="prefetch" href="/next-page.html" />

// 5. Server-side rendering for critical content
// app/page.tsx
export default async function HomePage() {
  const hero = await getHeroContent(); // Server-side
  
  return (
    <section>
      <h1>{hero.title}</h1>
      <Image src={hero.image} alt={hero.alt} priority />
    </section>
  );
}
```

---

## First Input Delay (FID) / Interaction to Next Paint (INP)

### Definition

**INP (replacing FID in 2024)** measures responsiveness - the time from user interaction to visual response.

### Target Scores

```
Good:    < 200 milliseconds
Needs Improvement: 200 - 500 milliseconds
Poor:    > 500 milliseconds
```

### Common INP Issues

```typescript
// ❌ Problem 1: Long JavaScript tasks
function processLargeDataset() {
  const data = Array.from({ length: 100000 }, (_, i) => i);
  return data.map(x => x * 2).filter(x => x % 2 === 0); // Blocks main thread
}

// ✅ Solution 1: Break into smaller chunks
async function processLargeDatasetOptimized() {
  const data = Array.from({ length: 100000 }, (_, i) => i);
  const chunkSize = 1000;
  const results = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const processed = chunk.map(x => x * 2).filter(x => x % 2 === 0);
    results.push(...processed);
    
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}

// ✅ Solution 2: Use Web Workers
// worker.ts
self.onmessage = (e) => {
  const data = e.data;
  const result = data.map(x => x * 2).filter(x => x % 2 === 0);
  self.postMessage(result);
};

// main.ts
const worker = new Worker('/worker.js');
worker.postMessage(largeDataset);
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// ❌ Problem 2: Heavy event handlers
<button onClick={() => {
  // Expensive operation
  const result = complexCalculation();
  updateUI(result);
}}>
  Click me
</button>

// ✅ Solution: Debounce/throttle and optimize
import { useCallback } from 'react';
import { debounce } from 'lodash-es';

function Component() {
  const handleClick = useCallback(
    debounce(() => {
      // Expensive operation
      requestIdleCallback(() => {
        const result = complexCalculation();
        updateUI(result);
      });
    }, 100),
    []
  );
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Optimizing INP

```typescript
// 1. Code splitting
// app/dashboard/page.tsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./heavy-chart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  );
}

// 2. Optimize React re-renders
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item));
  }, [data]);
  
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return <div onClick={handleClick}>{/* Render */}</div>;
});

// 3. Use requestIdleCallback for non-urgent work
function scheduleNonUrgentWork(task) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task, { timeout: 2000 });
  } else {
    setTimeout(task, 1);
  }
}

scheduleNonUrgentWork(() => {
  // Analytics, logging, etc.
  trackUserBehavior();
});

// 4. Virtualize long lists
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  );
}

// 5. Optimize third-party scripts
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lodash-es', 'date-fns'],
  },
};
```

---

## Cumulative Layout Shift (CLS)

### Definition

**CLS measures visual stability** - unexpected layout shifts during page load.

### Target Scores

```
Good:    < 0.1
Needs Improvement: 0.1 - 0.25
Poor:    > 0.25
```

### Common CLS Issues

```typescript
// ❌ Problem 1: Images without dimensions
<img src="/photo.jpg" alt="Photo" />

// ✅ Solution: Always specify dimensions
<img 
  src="/photo.jpg" 
  alt="Photo"
  width="800"
  height="600"
/>

// Or use Next.js Image with aspect ratio
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  style={{ width: '100%', height: 'auto' }}
/>

// ❌ Problem 2: Dynamic content insertion
function Banner() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);
  
  if (!show) return null;
  
  return <div className="banner">Important message!</div>;
}

// ✅ Solution: Reserve space
function Banner() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);
  
  return (
    <div className="banner-container" style={{ minHeight: '60px' }}>
      {show && <div className="banner">Important message!</div>}
    </div>
  );
}

// ❌ Problem 3: Web fonts causing FOIT/FOUT
@import url('https://fonts.googleapis.com/css2?family=Inter');

// ✅ Solution: Use font-display and preload
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}

// ❌ Problem 4: Ads and embeds without placeholders
<div id="ad-slot"></div>

// ✅ Solution: Reserve space with aspect ratio
<div 
  className="ad-container"
  style={{
    aspectRatio: '16/9',
    minHeight: '250px',
    background: '#f0f0f0'
  }}
>
  <div id="ad-slot"></div>
</div>
```

### Optimizing CLS

```typescript
// 1. Use CSS aspect-ratio
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 2. Skeleton screens
function ProductCard({ product }) {
  if (!product) {
    return (
      <div className="skeleton">
        <div className="skeleton-image" />
        <div className="skeleton-title" />
        <div className="skeleton-price" />
      </div>
    );
  }
  
  return (
    <div className="product-card">
      <Image src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

// 3. Avoid inserting content above existing content
// ❌ Bad
function Feed() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchPosts().then(newPosts => {
      setPosts([...newPosts, ...posts]); // Shifts content down
    });
  }, []);
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}

// ✅ Good
function Feed() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchPosts().then(newPosts => {
      setPosts([...posts, ...newPosts]); // Appends to bottom
    });
  }, []);
  
  return <div>{posts.map(post => <Post key={post.id} {...post} />)}</div>;
}

// 4. Use transform for animations (doesn't trigger layout)
// ❌ Bad - triggers layout
.element {
  transition: top 0.3s;
}
.element:hover {
  top: -10px;
}

// ✅ Good - uses compositor
.element {
  transition: transform 0.3s;
}
.element:hover {
  transform: translateY(-10px);
}
```

---

## Measuring Web Vitals

### Browser DevTools

```javascript
// Chrome DevTools Performance tab
// 1. Open DevTools (F12)
// 2. Go to Performance tab
// 3. Click Record
// 4. Interact with page
// 5. Stop recording
// 6. Analyze metrics in timeline
```

### Web Vitals Library

```typescript
// Install
// npm install web-vitals

// app/components/web-vitals.tsx
'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onINP } from 'web-vitals';

export function WebVitals() {
  useEffect(() => {
    onCLS(console.log);
    onFID(console.log);
    onLCP(console.log);
    onINP(console.log);
  }, []);

  return null;
}

// Send to analytics
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
```

### Lighthouse

```bash
# CLI
npm install -g lighthouse
lighthouse https://example.com --view

# Programmatic
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse(url, options);
  
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  
  await chrome.kill();
}

runLighthouse('https://example.com');
```

### Real User Monitoring (RUM)

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
```

---

## Optimization Strategies

### Priority Matrix

```typescript
const optimizationPriority = {
  high: [
    'Optimize LCP image',
    'Reduce JavaScript bundle size',
    'Implement code splitting',
    'Add image dimensions',
    'Preload critical resources'
  ],
  medium: [
    'Optimize fonts',
    'Defer non-critical JavaScript',
    'Implement lazy loading',
    'Add resource hints',
    'Optimize third-party scripts'
  ],
  low: [
    'Minify CSS',
    'Compress images further',
    'Remove unused CSS',
    'Optimize animations',
    'Add service worker'
  ]
};
```

### Performance Budget

```javascript
// next.config.js
module.exports = {
  // Set performance budgets
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        maxAssetSize: 244000, // 244 KB
        maxEntrypointSize: 244000,
        hints: 'warning',
      };
    }
    return config;
  },
};
```

---

## Real-World Examples

### E-commerce Product Page

```typescript
// Optimized product page
import Image from 'next/image';
import { Suspense } from 'react';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  
  return (
    <div className="product-page">
      {/* LCP element - prioritized */}
      <div className="product-image">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">${product.price}</p>
        
        {/* Lazy load reviews */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <Reviews productId={product.id} />
        </Suspense>
        
        {/* Lazy load recommendations */}
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations productId={product.id} />
        </Suspense>
      </div>
    </div>
  );
}
```

---

## Interview Questions

### Q1: What are Core Web Vitals and why do they matter?

**Answer:**
Core Web Vitals are Google's metrics for user experience:
- **LCP**: Loading performance (< 2.5s)
- **INP**: Interactivity (< 200ms)
- **CLS**: Visual stability (< 0.1)

They matter because they directly impact user experience, SEO rankings, and business metrics.

### Q2: How would you optimize LCP?

**Answer:**
1. Optimize and preload LCP image
2. Use Next.js Image component
3. Implement CDN
4. Reduce server response time
5. Eliminate render-blocking resources
6. Use resource hints (preconnect, dns-prefetch)

### Q3: What causes layout shifts and how do you prevent them?

**Answer:**
Causes:
- Images without dimensions
- Dynamic content insertion
- Web fonts (FOIT/FOUT)
- Ads without reserved space

Prevention:
- Always specify image dimensions
- Reserve space for dynamic content
- Use font-display: swap
- Use aspect-ratio CSS property

### Q4: How do you measure Web Vitals?

**Answer:**
- Chrome DevTools Performance tab
- Lighthouse (lab data)
- web-vitals library (field data)
- Real User Monitoring (RUM)
- Google Search Console

---

## Summary

- Core Web Vitals measure loading, interactivity, and visual stability
- LCP < 2.5s, INP < 200ms, CLS < 0.1
- Optimize images, JavaScript, and layout stability
- Measure with DevTools, Lighthouse, and RUM
- Performance directly impacts user experience and business metrics

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Loading Performance →](./02-loading-performance.md)
