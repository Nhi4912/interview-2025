# Core Web Vitals - Google's Performance Metrics

> Core Web Vitals là Google's official metrics cho user experience. Directly ảnh hưởng SEO rankings.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS (2024)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │      LCP        │  │      INP        │  │      CLS        │ │
│   │   Loading       │  │ Interactivity   │  │   Stability     │ │
│   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│   │                 │  │                 │  │                 │ │
│   │ "How fast does  │  │ "How quickly    │  │ "How stable is  │ │
│   │  main content   │  │  does it        │  │  the layout?"   │ │
│   │  appear?"       │  │  respond?"      │  │                 │ │
│   │                 │  │                 │  │                 │ │
│   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤ │
│   │ Good:   ≤2.5s   │  │ Good:   ≤200ms  │  │ Good:   ≤0.1    │ │
│   │ Needs:  2.5-4s  │  │ Needs:  200-500 │  │ Needs:  0.1-0.25│ │
│   │ Poor:   >4s     │  │ Poor:   >500ms  │  │ Poor:   >0.25   │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                   │
│   Note: INP replaced FID (First Input Delay) in March 2024      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 LCP - Largest Contentful Paint

### What It Measures

```
┌─────────────────────────────────────────────────────────────────┐
│                    LCP - WHAT COUNTS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LCP ELEMENTS:                                                  │
│   • <img> elements                                               │
│   • <image> inside <svg>                                         │
│   • <video> poster images                                        │
│   • Background images via url()                                  │
│   • Block-level text elements                                    │
│                                                                   │
│   TIMELINE:                                                      │
│   ┌───────────────────────────────────────────────────────────┐  │
│   │ 0ms        500ms       1s         2s         2.5s    4s   │  │
│   │ │           │          │          │           │      │    │  │
│   │ ├──FCP──────┼──────────┼──────────┼───LCP─────┤      │    │  │
│   │ │           │          │          │           │      │    │  │
│   │ First       │          │          │         Good    Poor  │  │
│   │ Paint       │          │          │                       │  │
│   └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│   COMMON CAUSES OF SLOW LCP:                                     │
│   • Slow server response                                         │
│   • Render-blocking resources                                    │
│   • Slow resource load times                                     │
│   • Client-side rendering                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Optimizing LCP

```javascript
// 1. Preload critical resources
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high">
<link rel="preload" as="font" href="/font.woff2" type="font/woff2" crossorigin>

// 2. Optimize images
// Next.js Image component
import Image from 'next/image';

<Image
    src="/hero.jpg"
    alt="Hero"
    priority           // Preloads the image
    sizes="100vw"
    fill
/>

// 3. Server-side rendering
// pages/index.js (Next.js)
export async function getServerSideProps() {
    const data = await fetchData();
    return { props: { data } };
}

// 4. Optimize critical rendering path
// Inline critical CSS
<style>
    /* Critical above-the-fold styles */
    .hero { ... }
</style>
<link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

// 5. Use CDN for static assets
// Reduce TTFB (Time to First Byte)

// 6. Avoid lazy loading LCP image
// ❌ Don't lazy load hero image
<img src="hero.jpg" loading="lazy"> // Wrong for LCP element

// ✅ Load LCP image immediately
<img src="hero.jpg" fetchpriority="high">
```

---

## ⚡ INP - Interaction to Next Paint

### What It Measures

```
┌─────────────────────────────────────────────────────────────────┐
│                    INP - INTERACTION LATENCY                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   User clicks button                                             │
│        │                                                         │
│        ▼                                                         │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Input Delay │ Processing Time │ Presentation Delay │      │ │
│   │             │                 │                    │      │ │
│   │  (waiting   │  (event handler │  (render, paint,   │      │ │
│   │   for main  │   execution)    │   composite)       │      │ │
│   │   thread)   │                 │                    │      │ │
│   └─────────────┴─────────────────┴────────────────────┘      │ │
│   │◄──────────────── INP ────────────────────────────►│        │
│                                                                   │
│   INP = Worst interaction latency (excluding outliers)          │
│   Measured throughout entire page lifecycle                      │
│                                                                   │
│   INTERACTIONS THAT COUNT:                                       │
│   • Clicks (mouse, trackpad, touchscreen)                       │
│   • Taps (touchscreen)                                          │
│   • Key presses                                                  │
│                                                                   │
│   NOT COUNTED: Scrolling, hovering                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Optimizing INP

```javascript
// 1. Break up long tasks
// ❌ Blocking main thread
function processData(items) {
    items.forEach(item => {
        // Heavy processing for each item
        heavyComputation(item);
    });
}

// ✅ Yield to main thread
async function processData(items) {
    for (const item of items) {
        heavyComputation(item);

        // Yield every 50ms to allow browser to respond to input
        if (performance.now() - startTime > 50) {
            await scheduler.yield(); // or setTimeout(0)
            startTime = performance.now();
        }
    }
}

// 2. Use requestIdleCallback for non-urgent work
function processNonUrgent(tasks) {
    requestIdleCallback((deadline) => {
        while (deadline.timeRemaining() > 0 && tasks.length > 0) {
            const task = tasks.shift();
            task();
        }

        if (tasks.length > 0) {
            requestIdleCallback(processNonUrgent);
        }
    });
}

// 3. Debounce expensive handlers
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// 4. Use Web Workers for heavy computation
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataSet });
worker.onmessage = (e) => {
    updateUI(e.data.result);
};

// worker.js
self.onmessage = (e) => {
    const result = heavyComputation(e.data);
    self.postMessage({ result });
};

// 5. Optimize React rendering
import { useDeferredValue, useTransition } from 'react';

function SearchResults({ query }) {
    const deferredQuery = useDeferredValue(query);
    // Render with deferred value (non-blocking)
    return <Results query={deferredQuery} />;
}

function FilterList() {
    const [isPending, startTransition] = useTransition();

    const handleFilter = (value) => {
        startTransition(() => {
            // Low priority update
            setFilter(value);
        });
    };
}
```

---

## 📐 CLS - Cumulative Layout Shift

### What It Measures

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLS - LAYOUT STABILITY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BEFORE SHIFT:              AFTER SHIFT:                        │
│   ┌─────────────────────┐    ┌─────────────────────┐            │
│   │      Header         │    │      Header         │            │
│   ├─────────────────────┤    ├─────────────────────┤            │
│   │                     │    │   [Ad Loads Here]   │ ← Shift!   │
│   │   Article Text      │    ├─────────────────────┤            │
│   │                     │    │                     │            │
│   │   ← User reading    │    │   Article Text      │ ← Moved!   │
│   │      here           │    │                     │            │
│   │                     │    │                     │            │
│   └─────────────────────┘    └─────────────────────┘            │
│                                                                   │
│   CLS = Σ (impact fraction × distance fraction)                 │
│                                                                   │
│   Impact fraction:  % of viewport affected                       │
│   Distance fraction: How far elements moved / viewport height   │
│                                                                   │
│   COMMON CAUSES:                                                 │
│   • Images without dimensions                                    │
│   • Ads, embeds, iframes without size                           │
│   • Dynamically injected content                                │
│   • Web fonts causing FOIT/FOUT                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Optimizing CLS

```javascript
// 1. Always include size attributes on images
// ❌ Bad - causes layout shift
<img src="photo.jpg" alt="Photo">

// ✅ Good - reserves space
<img src="photo.jpg" alt="Photo" width="800" height="600">

// ✅ Next.js Image (handles automatically)
<Image src="photo.jpg" alt="Photo" width={800} height={600} />

// 2. Use aspect-ratio for responsive images
.image-container {
    aspect-ratio: 16 / 9;
    width: 100%;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

// 3. Reserve space for ads/embeds
.ad-container {
    min-height: 250px; /* Reserve space */
}

// 4. Avoid inserting content above existing content
// ❌ Bad - shifts content down
function addNotification() {
    const banner = document.createElement('div');
    document.body.prepend(banner); // Shifts everything down!
}

// ✅ Good - use fixed position or reserved space
.notification {
    position: fixed;
    top: 0;
}

// 5. Use transform for animations (doesn't cause layout)
// ❌ Causes layout shift
.element {
    animation: slideDown 0.3s;
}
@keyframes slideDown {
    from { top: -100px; }
    to { top: 0; }
}

// ✅ No layout shift
.element {
    animation: slideDown 0.3s;
}
@keyframes slideDown {
    from { transform: translateY(-100px); }
    to { transform: translateY(0); }
}

// 6. Preload fonts and use font-display
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>

@font-face {
    font-family: 'CustomFont';
    src: url('/font.woff2') format('woff2');
    font-display: optional; /* or 'swap' with fallback sizing */
}
```

---

## 📏 Measuring Core Web Vitals

### JavaScript API

```javascript
// Using web-vitals library
import { onLCP, onINP, onCLS } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);

// Send to analytics
function sendToAnalytics(metric) {
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        navigationType: metric.navigationType
    });

    // Use sendBeacon for reliability
    navigator.sendBeacon('/analytics', body);
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);

// PerformanceObserver (native API)
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(entry.name, entry.startTime, entry.duration);
    }
});

observer.observe({ type: 'largest-contentful-paint', buffered: true });
observer.observe({ type: 'layout-shift', buffered: true });
observer.observe({ type: 'first-input', buffered: true });
```

### Tools

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEASUREMENT TOOLS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LAB DATA (Simulated):                                          │
│   • Lighthouse (Chrome DevTools)                                │
│   • PageSpeed Insights                                          │
│   • WebPageTest                                                  │
│                                                                   │
│   FIELD DATA (Real Users):                                       │
│   • Chrome UX Report (CrUX)                                     │
│   • PageSpeed Insights (includes CrUX)                          │
│   • Search Console                                              │
│   • RUM tools (Datadog, New Relic)                              │
│                                                                   │
│   DEBUGGING:                                                     │
│   • Chrome DevTools Performance panel                           │
│   • Layout Shift Debugger extension                             │
│   • Lighthouse CI                                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What are Core Web Vitals?**

A: Google's metrics for user experience: LCP (loading), INP (interactivity), CLS (visual stability). They affect SEO rankings.

**Q: What is LCP?**

A: Largest Contentful Paint - time until the largest visible content element renders. Should be ≤2.5s for good score.

### 🟡 Mid-level

**Q: How do you fix poor CLS?**

A:
1. Add width/height to images and videos
2. Reserve space for ads/embeds
3. Avoid inserting content above existing content
4. Use transform for animations
5. Preload fonts with font-display: optional

**Q: Difference between FID and INP?**

A: FID measured only first interaction. INP measures ALL interactions throughout page lifecycle and reports the worst one. INP is more comprehensive and replaced FID in March 2024.

### 🔴 Senior

**Q: How do you optimize INP for a complex SPA?**

A:
```
1. Break up long tasks:
   - Use scheduler.yield() or setTimeout
   - Process in chunks (50ms max per task)

2. Optimize event handlers:
   - Debounce/throttle expensive handlers
   - Move heavy computation to Web Workers

3. React optimizations:
   - useTransition for low-priority updates
   - useDeferredValue for expensive renders
   - Virtualize long lists

4. Reduce JavaScript:
   - Code split aggressively
   - Remove unused code
   - Lazy load non-critical features

5. Monitor:
   - Track INP with web-vitals library
   - Analyze Long Tasks in DevTools
```

---

## 📚 Active Recall

1. [ ] Three Core Web Vitals và thresholds
2. [ ] LCP elements (what counts)
3. [ ] INP measurement (3 parts)
4. [ ] CLS causes và fixes
5. [ ] Lab vs Field data differences

---

> **Tiếp theo:** [02-loading-optimization.md](./02-loading-optimization.md) - Loading Optimization
