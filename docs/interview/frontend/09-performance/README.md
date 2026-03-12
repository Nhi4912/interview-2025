# Performance Optimization - Tối Ưu Hiệu Suất

> Performance là critical cho user experience và business metrics. Module này cover Core Web Vitals và optimization strategies.

---

## Tổng Quan

Google sử dụng Core Web Vitals như ranking factors. Performance optimization không chỉ là nice-to-have - nó directly impacts SEO và conversion rates.

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-core-web-vitals.md](./01-core-web-vitals.md) | LCP, INP, CLS | ⭐⭐⭐⭐⭐ |
| [02-loading-optimization.md](./02-loading-optimization.md) | Lazy Loading, Code Splitting | ⭐⭐⭐⭐⭐ |
| [03-runtime-performance.md](./03-runtime-performance.md) | JS Optimization | ⭐⭐⭐⭐ |
| [04-rendering-performance.md](./04-rendering-performance.md) | Reflow, Repaint | ⭐⭐⭐⭐ |
| [05-bundle-optimization.md](./05-bundle-optimization.md) | Tree Shaking, Bundling | ⭐⭐⭐⭐ |
| [06-performance-monitoring.md](./06-performance-monitoring.md) | Lighthouse, RUM | ⭐⭐⭐⭐ |
| [mindmap-performance.md](./mindmap-performance.md) | Sơ Đồ Tổng Hợp | Review |

---

## Core Web Vitals (2024-2025)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CORE WEB VITALS                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │      LCP        │  │      INP        │  │      CLS        │      │
│  │                 │  │                 │  │                 │      │
│  │ Largest         │  │ Interaction     │  │ Cumulative      │      │
│  │ Contentful      │  │ to Next         │  │ Layout          │      │
│  │ Paint           │  │ Paint           │  │ Shift           │      │
│  │                 │  │                 │  │                 │      │
│  │ Loading         │  │ Interactivity   │  │ Visual          │      │
│  │                 │  │                 │  │ Stability       │      │
│  │                 │  │                 │  │                 │      │
│  │ Good: ≤2.5s     │  │ Good: ≤200ms    │  │ Good: ≤0.1      │      │
│  │ Poor: >4.0s     │  │ Poor: >500ms    │  │ Poor: >0.25     │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                       │
│  Note: INP replaced FID in March 2024                                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### LCP Optimization

```javascript
// Preload critical resources
<link rel="preload" href="hero-image.jpg" as="image">
<link rel="preload" href="critical.css" as="style">

// Priority hints
<img src="hero.jpg" fetchpriority="high">
<img src="below-fold.jpg" fetchpriority="low" loading="lazy">

// Optimize images
<img
    src="hero.jpg"
    srcset="hero-400.jpg 400w, hero-800.jpg 800w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Hero"
>
```

### INP Optimization

```javascript
// Break up long tasks
function processLargeArray(items) {
    const CHUNK_SIZE = 100;
    let index = 0;

    function processChunk() {
        const chunk = items.slice(index, index + CHUNK_SIZE);
        chunk.forEach(processItem);
        index += CHUNK_SIZE;

        if (index < items.length) {
            // Yield to main thread
            setTimeout(processChunk, 0);
        }
    }

    processChunk();
}

// Or use requestIdleCallback
function processInIdle(items) {
    requestIdleCallback((deadline) => {
        while (deadline.timeRemaining() > 0 && items.length) {
            processItem(items.shift());
        }
        if (items.length) {
            requestIdleCallback(processInIdle);
        }
    });
}
```

### CLS Optimization

```css
/* Always set dimensions */
img, video {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
}

/* Reserve space for dynamic content */
.ad-slot {
    min-height: 250px;
}

/* Avoid FOUT */
@font-face {
    font-family: 'MyFont';
    font-display: swap;
}
```

---

## Loading Optimization

### Code Splitting

```javascript
// Route-based splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </Suspense>
    );
}

// Component-based splitting
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
    const [showChart, setShowChart] = useState(false);

    return (
        <div>
            <button onClick={() => setShowChart(true)}>Show Chart</button>
            {showChart && (
                <Suspense fallback={<ChartSkeleton />}>
                    <HeavyChart />
                </Suspense>
            )}
        </div>
    );
}
```

### Image Optimization

```jsx
// Next.js Image
import Image from 'next/image';

<Image
    src="/hero.jpg"
    width={800}
    height={600}
    placeholder="blur"
    blurDataURL={blurDataUrl}
    priority // for LCP image
/>

// Native lazy loading
<img src="image.jpg" loading="lazy" alt="..." />
```

---

## Bundle Optimization

### Tree Shaking

```javascript
// ❌ Import entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Import only what you need
import debounce from 'lodash/debounce';
debounce(fn, 300);

// ✅ Or use lodash-es
import { debounce } from 'lodash-es';
```

### Analyze Bundle

```bash
# Webpack
npx webpack-bundle-analyzer stats.json

# Next.js
ANALYZE=true npm run build

# Vite
npx vite-bundle-visualizer
```

---

## Performance Checklist

### Loading
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Critical CSS inlined
- [ ] Fonts preloaded with font-display: swap
- [ ] Third-party scripts deferred

### Runtime
- [ ] Avoid layout thrashing
- [ ] Debounce/throttle expensive operations
- [ ] Use requestAnimationFrame for animations
- [ ] Virtualize long lists

### React Specific
- [ ] Use React.memo appropriately
- [ ] Optimize Context usage
- [ ] Use useCallback/useMemo when needed
- [ ] Implement proper keys for lists

### Monitoring
- [ ] Set up Core Web Vitals tracking
- [ ] Configure performance budgets
- [ ] Regular Lighthouse audits

---

## Top Interview Questions

| Question | Difficulty |
|----------|------------|
| Explain Core Web Vitals | 🟡 |
| How to optimize LCP? | 🟡 |
| What causes CLS? How to fix? | 🟡 |
| Code splitting strategies | 🟡 |
| How to optimize React app performance? | 🔴 |
| What is tree shaking? | 🟢 |

---

## Tools

- **Lighthouse** - Chrome DevTools
- **PageSpeed Insights** - Google tool
- **WebPageTest** - Real device testing
- **Bundle Analyzer** - Bundle visualization
- **Chrome DevTools Performance** - Runtime profiling

---

## Resources

- [web.dev/performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

> **Thời gian ước tính:** 1 tuần
