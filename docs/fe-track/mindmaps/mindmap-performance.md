# Performance Mind Map - Quick Reference


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Performance cho ôn tập nhanh.

---

## 🗺️ Performance Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PERFORMANCE OPTIMIZATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                         ┌─────────────────┐                                  │
│                         │   PERFORMANCE   │                                  │
│                         └────────┬────────┘                                  │
│                                  │                                           │
│        ┌────────────┬────────────┼────────────┬────────────┐                │
│        │            │            │            │            │                │
│   ┌────▼────┐ ┌─────▼────┐ ┌─────▼────┐ ┌────▼─────┐ ┌────▼────┐           │
│   │ LOADING │ │ RUNTIME  │ │ RENDER   │ │  BUNDLE  │ │ MONITOR │           │
│   │         │ │          │ │          │ │          │ │         │           │
│   │Code Split│ │Debounce  │ │Reflow    │ │Tree shake│ │Lighthouse│          │
│   │Lazy Load│ │Throttle  │ │Repaint   │ │Minify    │ │RUM      │           │
│   │Prefetch │ │Workers   │ │Composite │ │Compress  │ │Budgets  │           │
│   └─────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────┘           │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Core Web Vitals Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   METRIC    WHAT              GOOD      POOR     FIX              │
│   ──────────────────────────────────────────────────────────────  │
│                                                                   │
│   LCP       Largest content   ≤2.5s     >4s      • Preload hero  │
│             paint time                           • Optimize imgs │
│                                                  • SSR/SSG       │
│                                                                   │
│   INP       Interaction       ≤200ms    >500ms   • Break tasks   │
│             response                             • Web Workers   │
│                                                  • Debounce      │
│                                                                   │
│   CLS       Layout shift      ≤0.1      >0.25    • Set img size  │
│             score                                • Reserve space │
│                                                  • Avoid inject  │
│                                                                   │
│   MEASUREMENT:                                                   │
│   • Lab: Lighthouse, PageSpeed Insights                          │
│   • Field: CrUX, web-vitals library                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Loading Strategy Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOADING STRATEGY                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    Is it critical for initial view?             │
│                              │                                   │
│               ┌──────────────┴──────────────┐                    │
│               │                             │                    │
│              YES                           NO                    │
│               │                             │                    │
│               ▼                             ▼                    │
│        ┌──────────────┐            ┌──────────────┐             │
│        │ PRELOAD      │            │ Lazy load?   │             │
│        │ • Hero image │            │              │             │
│        │ • Critical   │            └──────┬───────┘             │
│        │   fonts      │                   │                      │
│        │ • Critical   │         ┌─────────┴─────────┐           │
│        │   CSS        │         │                   │           │
│        └──────────────┘        YES                 NO           │
│                                  │                   │           │
│                                  ▼                   ▼           │
│                          ┌────────────┐     ┌────────────┐      │
│                          │ LAZY LOAD  │     │ PREFETCH   │      │
│                          │ • Below    │     │ • Next page│      │
│                          │   fold     │     │ • Likely   │      │
│                          │ • Modal    │     │   routes   │      │
│                          │ • Route    │     │            │      │
│                          └────────────┘     └────────────┘      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   JavaScript ──▶ Style ──▶ Layout ──▶ Paint ──▶ Composite       │
│       │           │          │          │          │             │
│       ▼           ▼          ▼          ▼          ▼             │
│     High        Low        HIGH       Medium      LOW            │
│     Cost        Cost       COST       Cost        Cost           │
│                                                                   │
│   WHAT TRIGGERS:                                                 │
│   ─────────────────────────────────────────────────────────────  │
│                                                                   │
│   Layout (Reflow):                                               │
│   • width, height, margin, padding                               │
│   • position, top, left, right, bottom                          │
│   • font-size, line-height                                       │
│   • Reading: offsetWidth, offsetHeight, getBoundingClientRect   │
│                                                                   │
│   Paint only:                                                    │
│   • color, background-color                                      │
│   • box-shadow, border-radius                                    │
│   • visibility (not display)                                     │
│                                                                   │
│   Composite only (BEST for animation):                          │
│   • transform                                                    │
│   • opacity                                                      │
│                                                                   │
│   GOAL: Animate only composite properties for 60fps             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Bundle Optimization Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    BUNDLE OPTIMIZATION                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   REDUCE:                                                        │
│   □ Tree shaking enabled (production mode)                      │
│   □ Import specifically (not * or entire lib)                   │
│   □ Remove unused dependencies                                   │
│   □ Use lighter alternatives (date-fns vs moment)               │
│   □ Dead code elimination                                        │
│                                                                   │
│   SPLIT:                                                         │
│   □ Route-based code splitting                                  │
│   □ Vendor chunk separated                                      │
│   □ Heavy libs in own chunks                                    │
│   □ Dynamic import for modals, etc.                             │
│                                                                   │
│   COMPRESS:                                                      │
│   □ Minification (Terser)                                       │
│   □ Gzip compression                                            │
│   □ Brotli compression                                          │
│   □ Image optimization                                          │
│                                                                   │
│   CACHE:                                                         │
│   □ Content hashing in filenames                                │
│   □ Separate runtime chunk                                      │
│   □ Long cache for static assets                                │
│                                                                   │
│   ANALYZE:                                                       │
│   □ Bundle analyzer report                                      │
│   □ Size budgets in CI                                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Memory & Runtime

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY & RUNTIME                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   MEMORY LEAK SOURCES:                                           │
│   ─────────────────────                                          │
│   • Event listeners not removed                                  │
│   • Timers not cleared                                           │
│   • Closures holding references                                  │
│   • Detached DOM nodes                                           │
│   • Global variables                                             │
│                                                                   │
│   LONG TASK SOLUTIONS:                                           │
│   ──────────────────────                                         │
│   • Break into <50ms chunks                                      │
│   • Use requestIdleCallback                                      │
│   • Use scheduler.yield()                                        │
│   • Web Workers for heavy work                                   │
│                                                                   │
│   OPTIMIZATION PATTERNS:                                         │
│   ────────────────────────                                       │
│   Debounce:  Wait until activity stops (search input)           │
│   Throttle:  Limit frequency (scroll handler)                   │
│   RAF:       Sync with repaint (animations)                     │
│   Workers:   Off main thread (heavy computation)                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📈 Performance Budget Template

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE BUDGETS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   SIZE BUDGETS (gzipped):                                        │
│   ────────────────────────                                       │
│   Total JavaScript:     < 300 KB                                 │
│   Total CSS:            < 50 KB                                  │
│   Total images:         < 1 MB                                   │
│   Individual chunk:     < 100 KB                                 │
│                                                                   │
│   TIMING BUDGETS:                                                │
│   ───────────────                                                │
│   LCP:                  < 2.5s                                   │
│   INP:                  < 200ms                                  │
│   CLS:                  < 0.1                                    │
│   Time to Interactive:  < 5s                                     │
│   TTFB:                 < 800ms                                  │
│                                                                   │
│   QUANTITY BUDGETS:                                              │
│   ─────────────────                                              │
│   Total requests:       < 50                                     │
│   Third-party scripts:  < 5                                      │
│   Custom fonts:         < 3                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

### Core Concepts

```
Q: What are Core Web Vitals?
A: LCP (loading ≤2.5s), INP (interactivity ≤200ms), CLS (stability ≤0.1)

Q: How to improve LCP?
A: Preload hero image, optimize images, SSR/SSG, reduce TTFB

Q: How to reduce CLS?
A: Set image dimensions, reserve space for dynamic content, avoid inserting above

Q: Composite-only properties?
A: transform and opacity - animate without layout/paint

Q: Tree shaking?
A: Remove unused code from bundle. Requires ES modules, production mode
```

### Optimization Patterns

```
Q: Debounce vs throttle?
A: Debounce waits for activity to stop, throttle limits frequency

Q: When to use Web Workers?
A: Heavy computation (parsing, encryption, image processing)

Q: Code splitting strategies?
A: Route-based, vendor separation, dynamic import for heavy components

Q: How to detect memory leaks?
A: Chrome DevTools Memory panel, heap snapshots, timeline allocation
```

---

## ✅ Performance Checklist

```
LOADING
□ Code split by route
□ Lazy load below fold
□ Preload critical resources
□ Optimize images (WebP, sizing)
□ Async/defer scripts
□ Inline critical CSS

RUNTIME
□ Debounce/throttle handlers
□ requestAnimationFrame for animations
□ Break long tasks
□ Clean up listeners/timers

RENDERING
□ Use transform/opacity for animations
□ Avoid layout thrashing
□ Virtual scroll for long lists
□ CSS containment

BUNDLE
□ Tree shaking
□ Minification
□ Compression (Brotli + Gzip)
□ Content hashing

MONITORING
□ Lighthouse CI
□ Core Web Vitals tracking
□ Performance budgets
□ RUM data collection
```

---

> **Module hoàn thành!** Quay lại [README.md](./mindmap-foundations.md) để xem tổng quan module.
