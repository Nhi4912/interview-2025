# Loading Optimization - Faster Initial Load

> Optimize loading để users see content nhanh hơn. Code splitting, lazy loading, và resource hints.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOADING OPTIMIZATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  CRITICAL PATH                           │   │
│   │                                                           │   │
│   │   HTML ──▶ CSS ──▶ JS ──▶ Render ──▶ Interactive        │   │
│   │    │       │       │                                     │   │
│   │    ▼       ▼       ▼                                     │   │
│   │   Parse   CSSOM   Execute                                │   │
│   │   DOM                                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   OPTIMIZATION STRATEGIES:                                       │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│   │   REDUCE    │ │   DEFER     │ │  PREFETCH   │               │
│   │             │ │             │ │             │               │
│   │ • Minify    │ │ • Lazy load │ │ • Preload   │               │
│   │ • Compress  │ │ • Code split│ │ • Prefetch  │               │
│   │ • Tree shake│ │ • async/defer│ │ • Preconnect│               │
│   └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✂️ Code Splitting

### Dynamic Imports

```javascript
// Static import (bundled together)
import { heavyFunction } from './heavy-module';

// Dynamic import (separate chunk, loaded on demand)
const loadHeavyModule = async () => {
    const module = await import('./heavy-module');
    module.heavyFunction();
};

// React lazy loading
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <HeavyComponent />
        </Suspense>
    );
}

// Route-based splitting (React Router)
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Suspense>
    );
}
```

### Next.js Code Splitting

```javascript
// Automatic code splitting per page
// Each page in /pages becomes separate chunk

// Dynamic import with next/dynamic
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('./Chart'), {
    loading: () => <p>Loading chart...</p>,
    ssr: false // Disable SSR for client-only components
});

// With named exports
const Modal = dynamic(() =>
    import('./components').then(mod => mod.Modal)
);

// Conditional loading
function ProductPage({ showReviews }) {
    const Reviews = dynamic(() => import('./Reviews'));

    return (
        <div>
            <ProductInfo />
            {showReviews && <Reviews />}
        </div>
    );
}
```

---

## 🦥 Lazy Loading

### Images

```javascript
// Native lazy loading
<img src="image.jpg" loading="lazy" alt="Description">

// Intersection Observer for more control
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Load 50px before entering viewport
    });

    images.forEach(img => observer.observe(img));
}

// React component
function LazyImage({ src, alt, ...props }) {
    const imgRef = useRef();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    imgRef.current.src = src;
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [src]);

    return (
        <img
            ref={imgRef}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            style={{ opacity: isLoaded ? 1 : 0 }}
            {...props}
        />
    );
}

// Next.js Image (handles lazy loading automatically)
import Image from 'next/image';

<Image
    src="/photo.jpg"
    alt="Photo"
    width={800}
    height={600}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
/>
```

### Components (Intersection Observer)

```javascript
// Lazy load component when visible
function LazySection({ children, fallback }) {
    const ref = useRef();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref}>
            {isVisible ? children : fallback}
        </div>
    );
}

// Usage
<LazySection fallback={<Skeleton />}>
    <HeavyComponent />
</LazySection>
```

---

## 🔗 Resource Hints

### Preload, Prefetch, Preconnect

```html
<!-- PRELOAD: Critical resources for current page -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero.jpg" as="image">
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>

<!-- PREFETCH: Resources for future navigation -->
<link rel="prefetch" href="/next-page.js">
<link rel="prefetch" href="/next-page-data.json">

<!-- PRECONNECT: Establish early connection to origin -->
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- DNS-PREFETCH: Resolve DNS early (fallback for preconnect) -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- MODULE PRELOAD: Preload ES modules -->
<link rel="modulepreload" href="/app.js">
```

### Priority Hints

```html
<!-- fetchpriority attribute -->
<img src="hero.jpg" fetchpriority="high" alt="Hero">
<img src="thumbnail.jpg" fetchpriority="low" alt="Thumbnail">

<script src="critical.js" fetchpriority="high"></script>
<script src="analytics.js" fetchpriority="low"></script>

<!-- Fetch API with priority -->
fetch('/api/data', { priority: 'high' });
fetch('/api/analytics', { priority: 'low' });
```

---

## 📜 Script Loading Strategies

### async vs defer

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPT LOADING                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   NORMAL: <script src="script.js"></script>                     │
│   ──────────────────────────────────────────────────────────    │
│   HTML:  ████████████░░░░░░░░░░░░████████████████████           │
│   JS:                ███████████                    (blocking)  │
│                      fetch  exec                                │
│                                                                   │
│   ASYNC: <script async src="script.js"></script>                │
│   ──────────────────────────────────────────────────────────    │
│   HTML:  ████████████████████░░░░████████████████████           │
│   JS:         ███████████████                                   │
│               fetch    exec (as soon as ready)                  │
│                                                                   │
│   DEFER: <script defer src="script.js"></script>                │
│   ──────────────────────────────────────────────────────────    │
│   HTML:  ████████████████████████████████████████████           │
│   JS:         ██████████████████████████████████                │
│               fetch              exec (after HTML)              │
│                                                                   │
│   USE CASES:                                                     │
│   • async: Independent scripts (analytics, ads)                 │
│   • defer: Scripts that need DOM (most app scripts)            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```html
<!-- Analytics (async - doesn't need DOM, run whenever ready) -->
<script async src="https://analytics.com/script.js"></script>

<!-- App bundle (defer - needs DOM, run in order) -->
<script defer src="/vendor.js"></script>
<script defer src="/app.js"></script>

<!-- Inline critical JS -->
<script>
    // Minimal inline code for critical functionality
    document.documentElement.classList.remove('no-js');
</script>
```

---

## 🖼️ Image Optimization

### Modern Formats

```html
<!-- Picture element with fallbacks -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description">
</picture>

<!-- Responsive images -->
<img
    src="image-800.jpg"
    srcset="
        image-400.jpg 400w,
        image-800.jpg 800w,
        image-1200.jpg 1200w
    "
    sizes="(max-width: 600px) 100vw, 800px"
    alt="Responsive image"
>

<!-- Next.js automatic optimization -->
<Image
    src="/photo.jpg"
    alt="Photo"
    width={800}
    height={600}
    // Automatically: WebP/AVIF, responsive, lazy loading
/>
```

### Image Compression Guidelines

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMAGE OPTIMIZATION                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FORMAT SELECTION:                                              │
│   AVIF > WebP > JPEG/PNG                                        │
│                                                                   │
│   USE CASE           FORMAT       QUALITY                        │
│   ────────────────────────────────────────                       │
│   Photos             AVIF/WebP    75-85%                         │
│   Graphics/logos     WebP/PNG     90%+                           │
│   Icons              SVG          N/A                            │
│   Animations         WebP/GIF     Optimize frames                │
│                                                                   │
│   SIZE GUIDELINES:                                               │
│   • Hero images: <200KB                                         │
│   • Thumbnails: <50KB                                           │
│   • Icons: <10KB (or use SVG)                                   │
│                                                                   │
│   TOOLS:                                                         │
│   • Squoosh (squoosh.app)                                       │
│   • ImageOptim (Mac)                                            │
│   • Sharp (Node.js)                                             │
│   • next/image (Next.js)                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Font Optimization

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>

<style>
@font-face {
    font-family: 'MainFont';
    src: url('/fonts/main.woff2') format('woff2');
    font-display: swap; /* or optional */
    /* Subset to Latin characters */
    unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

/* Use system fonts for body (fast) */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom font only for headings */
h1, h2, h3 {
    font-family: 'MainFont', sans-serif;
}
</style>

<!-- Next.js font optimization -->
// next.config.js - Google Fonts
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is lazy loading?**

A: Loading resources only when needed (when entering viewport or on user action). Reduces initial page load time. Examples: images with `loading="lazy"`, React.lazy() for components.

**Q: Difference between preload and prefetch?**

A:
- **Preload**: High priority, for current page (fonts, hero image)
- **Prefetch**: Low priority, for future navigation (next page's JS)

### 🟡 Mid-level

**Q: async vs defer scripts?**

A:
- **async**: Download parallel to HTML parsing, execute immediately when ready. Order not guaranteed. Use for independent scripts (analytics).
- **defer**: Download parallel, execute after HTML parsed. Order preserved. Use for app scripts that need DOM.

**Q: How do you implement route-based code splitting?**

A: Use React.lazy() with Suspense for each route:
```jsx
const Page = lazy(() => import('./Page'));
<Route path="/page" element={<Suspense><Page /></Suspense>} />
```
Each route becomes separate chunk, loaded only when navigating there.

### 🔴 Senior

**Q: Design loading strategy for e-commerce homepage**

A:
```
1. Critical Path:
   - Inline critical CSS
   - Preload hero image with fetchpriority="high"
   - Preconnect to API/CDN origins

2. Above the fold:
   - Server-render header + hero + first products
   - No lazy loading for visible content

3. Below the fold:
   - Lazy load images with Intersection Observer
   - Code split product carousel, reviews

4. Fonts:
   - Preload primary font
   - font-display: optional for stability
   - System fonts fallback

5. Scripts:
   - defer for main bundle
   - async for analytics
   - Dynamic import for modals, chat widget

6. Prefetch:
   - Product detail pages on hover
   - Cart page after add-to-cart
```

---

## 📚 Active Recall

1. [ ] Code splitting techniques (3 methods)
2. [ ] Resource hints (4 types)
3. [ ] async vs defer behavior
4. [ ] Image format priority (AVIF > WebP > JPEG)
5. [ ] font-display values

---

> **Tiếp theo:** [03-runtime-performance.md](./03-runtime-performance.md) - Runtime Performance
