# Core Web Vitals / Chỉ Số Web Cốt Lõi

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [HTML5 Fundamentals](../05-html-css/00-html5-fundamentals.md)
> **See also**: [React Performance](./02-react-performance.md) | [Bundle Optimization](./03-bundle-optimization.md) | [Web Performance Comprehensive](./04-web-performance-comprehensive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Pinterest giảm perceived load time 40% → search traffic tăng 15%, sign-up conversion tăng 15%.

Từ 2021, **Core Web Vitals là Google ranking factor**. Site chậm = mất SEO + mất users.

**3 metrics Google đo:**
- **LCP** (Largest Contentful Paint): bao lâu content chính xuất hiện? (target: ≤ 2.5s)
- **CLS** (Cumulative Layout Shift): layout có nhảy lung tung không? (target: ≤ 0.1)
- **INP** (Interaction to Next Paint): bao lâu sau click mới có response? (target: ≤ 200ms)

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Vào quán cà phê:**
- **LCP** = bao lâu đến khi menu được đưa ra (content chính hiển thị)
- **CLS** = bàn ghế có bị di chuyển khi bạn sắp ngồi không (layout shift)
- **INP** = bao lâu sau khi gọi món mới được ghi nhận (responsiveness)

| Metric | Good | Poor | Common cause | Fix |
|--------|------|------|-------------|-----|
| LCP | ≤ 2.5s | > 4s | Large image, render-blocking CSS | WebP, preload, inline critical CSS |
| CLS | ≤ 0.1 | > 0.25 | Images without dimensions, late ads | Always set `width`/`height` |
| INP | ≤ 200ms | > 500ms | Heavy JS on main thread | Code split, Web Workers, debounce |

---

## Concept Map / Bản Đồ Khái Niệm

```
      [Browser Rendering Pipeline]
      (Parse HTML → CSSOM → Layout → Paint)
              │
              ▼
     [CORE WEB VITALS]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  [LCP]     [CLS]    [INP]
  Largest   Layout   Interaction
  Content   Shift    Next Paint
  Paint
    │
    ▼
[Measurement Tools]
Lighthouse | PageSpeed Insights | Chrome DevTools | web-vitals.js
    │
    ▼
[Optimization Strategies]
Critical CSS | Image optimization | Code splitting
Preload hints | CDN | Service Worker caching
```

---

## Overview / Tổng Quan

Core Web Vitals là bộ ba chỉ số do Google định nghĩa để đo lường trải nghiệm người dùng thực tế trên web. Đây là tín hiệu xếp hạng của Google Search từ 2021.

**The three Core Web Vitals:**
| Metric | Measures | Good | Needs Improvement | Poor |
|--------|----------|------|------------------|------|
| **LCP** — Largest Contentful Paint | Loading speed | < 2.5s | 2.5s – 4s | > 4s |
| **INP** — Interaction to Next Paint | Responsiveness | < 200ms | 200 – 500ms | > 500ms |
| **CLS** — Cumulative Layout Shift | Visual stability | < 0.1 | 0.1 – 0.25 | > 0.25 |

> **Note**: INP replaced FID (First Input Delay) as an official Core Web Vital in March 2024.

---

## 1. LCP — Largest Contentful Paint

### What is LCP? / LCP là gì?

**Definition**: LCP measures how long it takes for the **largest content element** in the viewport to become visible. This is typically a hero image, h1 heading, or large text block.

**Định nghĩa**: LCP đo thời gian để phần tử nội dung lớn nhất trong viewport hiển thị được cho người dùng. Thường là ảnh hero, heading h1, hoặc khối văn bản lớn.

### What elements are candidates for LCP?
- `<img>` elements
- `<image>` inside `<svg>`
- `<video>` elements (poster image)
- Elements with `background-image: url()`
- Block-level elements containing text nodes

### Why LCP is slow — Root Causes / Nguyên nhân LCP chậm

| Root Cause | Description | Vietnamese |
|------------|-------------|------------|
| Slow server response (TTFB) | Server takes too long to respond | Server phản hồi quá chậm |
| Render-blocking resources | JS/CSS blocking the main thread | JS/CSS chặn main thread |
| Slow resource load time | Image not optimized, no CDN | Ảnh chưa tối ưu, thiếu CDN |
| Client-side rendering | HTML shell needs hydration | Nội dung render ở client |

### Q: How do you optimize LCP? 🟡 Mid

**1. Optimize the LCP image / Tối ưu ảnh LCP:**
```html
<!-- Preload the LCP image -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Use fetchpriority on the img tag -->
<img src="/hero.webp" fetchpriority="high" alt="Hero" width="1200" height="630">
```

**2. Use Next.js Image with priority:**
```tsx
import Image from 'next/image'

// `priority` adds preload + fetchpriority="high"
export function Hero() {
  return <Image src="/hero.jpg" alt="hero" width={1280} height={720} priority />
}
```

**3. Reduce TTFB / Giảm TTFB:**
- Use CDN (CloudFront, Cloudflare) for static assets
- Enable HTTP/2 or HTTP/3
- Use edge caching for SSR responses
- Optimize server-side queries (avoid N+1, add DB indexes)

**4. Eliminate render-blocking resources:**
```html
<!-- Defer non-critical JS -->
<script src="analytics.js" defer></script>
<!-- Inline critical CSS, load rest async -->
<style>/* critical above-fold CSS here */</style>
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

**5. Use modern image formats:**
- WebP: 25–35% smaller than JPEG
- AVIF: 50% smaller than JPEG (less browser support)
- Always set `width` and `height` to prevent layout shift

---

## 2. INP — Interaction to Next Paint

### What is INP? / INP là gì?

**Definition**: INP measures the **latency of all click, tap, and keyboard interactions** throughout a page visit. It reports the worst interaction (or near-worst for pages with many interactions).

**Định nghĩa**: INP đo độ trễ của **tất cả các tương tác** (click, tap, keyboard) trong suốt phiên truy cập. Nó báo cáo tương tác chậm nhất (hoặc gần chậm nhất).

> INP > FID vì: FID chỉ đo tương tác **đầu tiên**, INP đo **tất cả** tương tác.

### Why INP is slow / Nguyên nhân INP kém

| Root Cause | Fix |
|------------|-----|
| Long tasks on main thread (>50ms) | Break up with `setTimeout`, `scheduler.yield()` |
| Heavy event handlers | Debounce, move work off main thread |
| Excessive re-renders (React) | `useMemo`, `useCallback`, `memo()` |
| Large DOM (>1500 nodes) | Virtualize lists, remove hidden nodes |
| Synchronous layout/style recalcs | Avoid reading layout properties after writes |

### Q: How to debug and fix INP? 🟢 Junior → 🔴 Senior

**Debug in Chrome DevTools:**
1. Record a Performance trace
2. Look for "Long Tasks" (red bar, >50ms)
3. Check "Interactions" in the timeline
4. Use `PerformanceObserver` to measure INP:

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'event') {
      console.log(`INP candidate: ${entry.duration}ms`, entry.name);
    }
  }
});
observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
```

**Fix with `scheduler.yield()` (break up long tasks):**
```javascript
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    // Yield to browser every 50 items to avoid blocking input
    if (i % 50 === 0) await scheduler.yield();
  }
}
```

**Fix with Web Worker (move heavy computation off main thread):**
```javascript
// main.js
const worker = new Worker('compute.js');
worker.postMessage({ data: largeDataset });
worker.onmessage = (e) => updateUI(e.data);

// compute.js — runs in separate thread
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

---

## 3. CLS — Cumulative Layout Shift

### What is CLS? / CLS là gì?

**Definition**: CLS measures **unexpected layout shifts** — how much page content moves visually during the page lifecycle. Calculated as: `impact fraction × distance fraction` for each shift.

**Định nghĩa**: CLS đo tổng các **dịch chuyển bố cục không mong đợi** trong suốt vòng đời trang. Công thức: `impact fraction × distance fraction` cho mỗi lần dịch chuyển.

**Common causes / Nguyên nhân phổ biến:**
- Images/videos without explicit `width` and `height`
- Ads, embeds, iframes with unknown dimensions
- Dynamic content injected above existing content
- Web fonts causing FOIT/FOUT (Flash of Invisible/Unstyled Text)

### Q: How to fix CLS? 🟢 Junior → 🔴 Senior

**1. Always set image dimensions:**
```html
<!-- BAD: browser doesn't know height until image loads -->
<img src="photo.jpg" alt="photo">

<!-- GOOD: browser reserves space immediately -->
<img src="photo.jpg" alt="photo" width="800" height="600">
```

**2. Use CSS aspect-ratio or padding trick:**
```css
/* Modern: CSS aspect-ratio */
.image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* Legacy: padding-bottom trick */
.image-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
.image-container img {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

**3. Reserve space for ads/embeds:**
```css
.ad-slot {
  min-height: 250px; /* reserve before ad loads */
  width: 300px;
}
```

**4. Avoid inserting content above existing content:**
```javascript
// BAD: inserts banner above content → layout shift
document.body.insertBefore(banner, document.body.firstChild);

// GOOD: use a pre-reserved slot
document.querySelector('.banner-slot').appendChild(banner);
```

**5. Optimize web fonts:**
```css
/* Use font-display: optional or swap to avoid FOIT */
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  font-display: optional; /* don't shift — skip if not ready */
}
```

---

## 4. Measuring Core Web Vitals / Đo Lường Core Web Vitals

### Tools / Công cụ

| Tool | Use Case | Data Type |
|------|----------|-----------|
| **Chrome DevTools → Lighthouse** | Local testing | Lab data |
| **PageSpeed Insights** | URL analysis, real-world data | Lab + Field |
| **Search Console → Core Web Vitals** | Site-wide CWV report | Field (CrUX) |
| **web-vitals JS library** | In-app RUM monitoring | Field |
| **Chrome User Experience Report (CrUX)** | Real user data by origin | Field |

### web-vitals library in production:
```javascript
import { onLCP, onINP, onCLS } from 'web-vitals';

// Send to your analytics
function sendToAnalytics({ name, value, rating }) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ metric: name, value, rating }),
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

---

## 5. Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are Core Web Vitals and why do they matter? 🟢 Junior

**A:** Core Web Vitals are three Google-defined metrics measuring real user experience:
- **LCP** (< 2.5s): How fast main content loads
- **INP** (< 200ms): How responsive the page is to interactions
- **CLS** (< 0.1): How stable the layout is

They matter because: (1) they're a Google Search ranking signal, (2) they correlate with user engagement/conversion, (3) they provide actionable engineering goals.

**Tại sao quan trọng**: Đây là tín hiệu xếp hạng Google Search, tương quan với tỷ lệ bounce và conversion rate. Cải thiện CWV đo được trực tiếp trên business metrics.

---

### Q: A page has poor LCP (4s). Walk me through your debugging process. 🟡 Mid

**A:**
1. **Open DevTools → Network tab**: Check TTFB. If > 600ms → server/CDN issue.
2. **Run Lighthouse**: Check "Opportunities" for specific recommendations.
3. **Identify the LCP element**: Lighthouse shows which element is LCP.
4. **Check if it's an image**: Is it in the initial HTML? Lazy-loaded (bad)? Missing preload?
5. **Check render-blocking resources**: Look for render-blocking CSS/JS in the waterfall.
6. **Check image format/size**: Is it WebP? Properly sized for viewport?

**Quá trình debug thực tế**: Bắt đầu từ TTFB → resource load → render blocking. Dùng Lighthouse để xác định phần tử LCP cụ thể, sau đó optimize preload/fetchpriority.

---

### Q: What's the difference between FID and INP? Why did Google switch? 🟡 Mid

**A:**
- **FID**: Only measured the **first interaction** delay, only the input processing delay (not paint time)
- **INP**: Measures **all interactions** throughout the session, includes processing + rendering time

Google switched because FID was too easy to game (fast first click doesn't mean fast experience) and didn't capture the full rendering cost of interactions. INP is a much better proxy for "does this page feel responsive."

**Tại sao đổi**: FID chỉ đo tương tác đầu tiên, dễ "đánh lừa" bằng cách defer JS. INP đo toàn bộ session, bao gồm cả thời gian render sau khi xử lý — phản ánh trải nghiệm thật hơn nhiều.

---

### Q: Your CLS score is 0.3 (poor). How do you identify and fix it? 🟢 Junior → 🔴 Senior

**A:**
1. **DevTools → Performance tab**: Record a load, look for "Layout Shift" events
2. **Use CLS attribution API**:
```javascript
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Layout shift sources:', entry.sources);
      // .sources shows which elements shifted
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```
3. **Common fixes**: Set image dimensions, reserve ad slots, don't inject content above fold, use `font-display: optional`

**Debug thực tế**: Dùng PerformanceObserver với type `layout-shift` để xem element nào gây shift. Thường là ảnh thiếu dimensions hoặc font chưa load.

---

## 6. Beyond Core Web Vitals / Chỉ Số Khác Liên Quan

| Metric | Description | Good Threshold |
|--------|-------------|----------------|
| **TTFB** — Time to First Byte | Server response speed | < 800ms |
| **FCP** — First Contentful Paint | First pixel rendered | < 1.8s |
| **TTI** — Time to Interactive | Page fully interactive | < 3.8s |
| **TBT** — Total Blocking Time | Time JS blocks main thread | < 200ms |
| **Speed Index** | How quickly visually populated | < 3.4s |

> Note: TTFB and FCP are **diagnostic metrics** (not CWV) but crucial for understanding LCP root causes.

**Mối quan hệ**: TTFB kém → LCP kém. TBT cao → INP kém. Không có dimensions → CLS kém.

---

**See also**: [React Performance](./02-react-performance.md) | [Bundle Optimization](./03-bundle-optimization.md) | [Rendering Optimization Theory](./05-rendering-optimization-theory.md)

---

## 7. INP — Interaction to Next Paint (2024) / Chỉ Số INP Thay Thế FID

### Q: What is INP and why did it replace FID? / INP là gì và tại sao thay FID? 🟡 Mid

**A:** INP (Interaction to Next Paint) measures the worst-case latency of all user interactions during a page visit. FID only measured the first interaction's input delay, missing slow clicks/taps that happened later. INP is a better measure of overall responsiveness.

Vietnamese: FID chỉ đo input delay của interaction đầu tiên (khi JS đang parse). Sau đó FID không đo gì nữa — trang có thể lag nặng khi user click nhiều. INP đo tất cả interactions (click, tap, key) trong suốt session, lấy giá trị xấu nhất (p98). Ngưỡng: INP < 200ms = Good, < 500ms = Needs Improvement, > 500ms = Poor. Thay thế FID trong Core Web Vitals từ tháng 3/2024.

**Optimization cho INP:**
```
Root causes & fixes:
1. Long JS tasks (>50ms) blocking main thread
   → Break with scheduler.yield() or setTimeout(0)
   → Move to Web Worker
   → Code splitting (load less JS)

2. Expensive render after interaction  
   → useTransition() to defer non-urgent updates
   → Debounce/throttle event handlers
   → Virtualize long lists (react-window)

3. Layout thrashing in event handler
   → Batch DOM reads before writes
   → Use requestAnimationFrame for visual updates
```

Vietnamese: INP cao nhất thường do: (1) Heavy JS on main thread — profiler sẽ thấy "Long Tasks" màu đỏ trong Performance tab. (2) Expensive React re-renders sau click — dùng `useTransition` để defer update, tránh block visual feedback. (3) Layout thrashing trong handler — đọc `offsetHeight` rồi set style, browser phải recalculate layout synchronously.


---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích LCP, CLS, và INP bằng ví dụ cụ thể từ trang web thực không?
- [ ] Tôi có thể giải thích tại sao CLS tăng khi dùng Google Fonts và cách fix bằng `font-display: swap` không?
- [ ] Tôi có thể dùng Chrome DevTools Performance tab để identify LCP element không?
- [ ] Tôi có thể giải thích critical rendering path và cách optimize nó không?
- [ ] Tôi có thể giải thích tại sao Next.js `<Image>` component tốt hơn `<img>` cho Core Web Vitals không?

💬 **Feynman Prompt:** Giải thích Core Web Vitals cho CEO đang hỏi "tại sao phải invest vào performance?" Thuyết phục bằng số liệu từ Pinterest, Amazon, và Google Search ranking impact.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [HTML5 Fundamentals](../05-html-css/00-html5-fundamentals.md) | [CSS Fundamentals](../05-html-css/00-css-fundamentals.md) — CLS liên quan đến CSS và HTML image attributes
- ➡️ **Enables:** [React Performance](./02-react-performance.md) | [Bundle Optimization](./03-bundle-optimization.md)
- 🔗 **Tools:** Lighthouse | PageSpeed Insights | Chrome UX Report | web-vitals npm package
