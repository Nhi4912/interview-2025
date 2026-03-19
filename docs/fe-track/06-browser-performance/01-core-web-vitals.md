# Core Web Vitals / Chỉ Số Web Cốt Lõi

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [HTML5 Fundamentals](../05-html-css/00-html5-fundamentals.md)
> **See also**: [React Performance](./02-react-performance.md) | [Bundle Optimization](./03-bundle-optimization.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Case study thực tế:**
- Pinterest giảm perceived load time 40% → search traffic +15%, sign-up conversion +15%
- Shopify store: LCP giảm 1s → conversion rate +7%
- Amazon: mỗi 100ms latency = mất 1% revenue

Từ 2021, **Core Web Vitals là Google Search ranking factor** — site chậm mất cả SEO lẫn users.

**3 metrics Google đo:**
- **LCP** (Largest Contentful Paint): bao lâu content chính xuất hiện? (target: ≤ 2.5s)
- **CLS** (Cumulative Layout Shift): layout có nhảy lung tung không? (target: ≤ 0.1)
- **INP** (Interaction to Next Paint): bao lâu sau click mới có response? (target: ≤ 200ms)

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Vào quán cà phê:**
- **LCP** = bao lâu đến khi menu được đưa ra (content chính hiển thị)
- **CLS** = bàn ghế có bị di chuyển khi bạn sắp ngồi không (layout shift)
- **INP** = bao lâu sau khi gọi món mới được ghi nhận (responsiveness)

| Metric | Good | Needs Improvement | Poor | What it measures |
|--------|------|------------------|------|-----------------|
| **LCP** | ≤ 2.5s | 2.5–4s | > 4s | Loading speed of largest content |
| **INP** | ≤ 200ms | 200–500ms | > 500ms | Responsiveness to all interactions |
| **CLS** | ≤ 0.1 | 0.1–0.25 | > 0.25 | Visual stability (layout shifts) |

---

## Concept Map / Bản Đồ Khái Niệm

```
[Browser Rendering Pipeline]
Parse HTML → CSSOM → Layout → Paint → Composite
                │
                ▼
     [CORE WEB VITALS] ← bạn đang ở đây
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
  [LCP]       [INP]       [CLS]
  Loading   Interaction   Visual
  Speed     Responsiveness Stability
    │           │           │
    └───────────┴───────────┘
                │
    [Diagnostic metrics]
    TTFB → LCP, TBT → INP
                │
    [Tools]
    Lighthouse | PageSpeed Insights
    web-vitals.js | Chrome DevTools
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. LCP — Largest Contentful Paint

> 🧠 **Memory Hook:** "LCP = **L**oading speed of the **C**ritical **P**iece. The biggest thing above the fold. Target: 2.5s. Main suspect: hero image without preload."

**Tại sao tồn tại? / Why does this exist?**
Old metrics (DOMContentLoaded, onload) fired before meaningful content appeared. LCP tracks when the user actually *sees* the main content.
→ Tại sao "largest element"? → Research shows the largest visible element correlates best with perceived page load
→ Tại sao 2.5s? → Google data: pages under 2.5s have significantly higher conversion vs above

#### What elements count as LCP candidates?
- `<img>` elements (including `<picture>` sources)
- `<video>` poster images
- Elements with `background-image: url()`
- Block-level text elements

#### Common LCP Root Causes & Fixes

| Root Cause | Impact | Fix |
|------------|--------|-----|
| Slow TTFB (> 600ms) | Delays everything | CDN, server optimization, edge caching |
| LCP image not preloaded | Discovered late in waterfall | `<link rel="preload" as="image" fetchpriority="high">` |
| Render-blocking CSS/JS | Blocks first paint | Inline critical CSS, defer non-critical JS |
| Unoptimized image format | Large transfer size | WebP (−35% vs JPEG), AVIF (−50%) |
| Client-side rendering | HTML shell only | SSR / static generation (Next.js) |

```html
<!-- Optimal LCP image setup -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">
<img src="/hero.webp" fetchpriority="high" alt="Hero" width="1200" height="630">

<!-- Next.js: priority prop handles preload + fetchpriority automatically -->
<Image src="/hero.jpg" alt="hero" width={1280} height={720} priority />
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `loading="lazy"` trên LCP image | Lazy loading = browser discovers it LATER = worse LCP | Only lazy-load below-the-fold images |
| Không set `width`/`height` trên LCP image | Browser can't reserve space → layout shift (CLS impact) | Always set dimensions |
| Dùng CSS background-image cho hero | CSS images not preload-scannable (discovered late) | Use `<img>` tag for LCP element |

**🎯 Interview Pattern:**
- Khi thấy: "Page LCP là 4s. Bạn debug như thế nào?"
- → Algorithm: (1) Check TTFB với DevTools Network tab, (2) Run Lighthouse để identify LCP element, (3) Check if it's preloaded, (4) Check image format/size
- → Mở đầu: "Tôi sẽ bắt đầu từ TTFB — nếu server phản hồi chậm, mọi thứ đều chậm. Sau đó identify LCP element qua Lighthouse và check xem nó có được preloaded với fetchpriority không..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: Browser rendering pipeline (Parse → CSSOM → Layout → Paint)
- ➡️ Để hiểu: Image optimization, CDN setup, SSR/SSG tradeoffs

---

### 2. INP — Interaction to Next Paint

> 🧠 **Memory Hook:** "INP = **I**s the page **N**ot **P**aralyzed when I click? Measures ALL interactions (not just first). Culprit: Long Tasks >50ms on main thread."

**Tại sao tồn tại? / Why does this exist?**
FID (predecessor) only measured the FIRST interaction's input delay — easy to fake: defer all JS until after first interaction. Pages felt laggy after initial load but passed FID.
→ INP captures all interactions throughout the session → honest measure of real responsiveness
→ Target 200ms because research shows users feel input is "immediate" under 200ms

#### INP Breakdown

```
User interaction → 3 phases:
┌─────────────────────────────────────────────┐
│  INPUT DELAY    │  PROCESSING  │   PRESENTATION   │
│  (event queued  │  (JS runs,   │  (next frame     │
│  waiting for    │  handlers    │  painted to       │
│  main thread)   │  execute)    │  screen)          │
└─────────────────────────────────────────────┘
        ↑                ↑               ↑
   Reduce: yield    Reduce: offload  Reduce: avoid
   to main thread   to Worker        forced layout

INP = input delay + processing time + presentation delay
```

#### Common INP Root Causes & Fixes

| Root Cause | Fix |
|------------|-----|
| Long tasks >50ms blocking main thread | `scheduler.yield()`, `setTimeout(fn, 0)` to chunk work |
| Heavy event handlers | Debounce, move to Web Worker |
| Expensive React renders on click | `useTransition()` to defer non-urgent updates |
| Large DOM (>1500 nodes) | Virtualize lists, remove hidden nodes |
| Layout thrashing in handlers | Batch DOM reads before writes |

```javascript
// Break up long task with scheduler.yield
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);
    if (i % 50 === 0) await scheduler.yield(); // yield every 50 items
  }
}

// React: defer expensive state update
const [isPending, startTransition] = useTransition();
function handleClick() {
  startTransition(() => setResults(heavyFilter(data))); // won't block click response
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Nghĩ INP = FID (first interaction only) | INP đo TẤT CẢ interactions trong session | FID was replaced by INP in March 2024 |
| Debounce search input để fix INP | Debounce giúp reduce work, nhưng initial click vẫn lag nếu handler nặng | Yield main thread trước khi process |
| `useMemo` cho mọi thứ để fix INP | Memoization có overhead; thường không phải bottleneck | Profile với DevTools Profiler trước khi optimize |

**🎯 Interview Pattern:**
- Khi thấy: "INP page kém — click có cảm giác lag. Debug như thế nào?"
- → Algorithm: (1) Performance tab → record interaction → look for Long Tasks, (2) PerformanceObserver để measure specific interactions, (3) Identify: main thread heavy? render heavy? layout thrashing?
- → Mở đầu: "Tôi sẽ dùng Chrome DevTools Performance tab, record interaction, tìm 'Long Tasks' màu đỏ. Long task >50ms = main thread blocked = INP tăng..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: Event Loop, main thread blocking
- ➡️ Để hiểu: Web Workers, React useTransition, scheduler API

---

### 3. CLS — Cumulative Layout Shift

> 🧠 **Memory Hook:** "CLS = **C**ontent **L**eaping **S**ideways. Formula: `impact fraction × distance fraction`. Root cause 1: images without dimensions. Root cause 2: late-injected content above fold."

**Tại sao tồn tại? / Why does this exist?**
Users clicking links, buttons, forms would suddenly find their target moved because an image loaded above it. Very frustrating UX — Google calls it "accidental click due to layout shift."

#### CLS Formula & Common Causes

```
Each layout shift event:
  CLS contribution = impact fraction × distance fraction

  impact fraction = % of viewport affected by shifted elements
  distance fraction = max distance any element moved / viewport height

  Example: Image loads, pushes button down 100px on 600px viewport
  impact fraction = 0.5 (button occupied 50% of viewport)
  distance fraction = 0.166 (100/600)
  contribution = 0.083

  Multiple shifts accumulate → total CLS score
```

| Root Cause | Fix |
|------------|-----|
| Images without `width`/`height` | Always set dimensions or `aspect-ratio` CSS |
| Late-loaded ads/embeds | Reserve space with `min-height` on container |
| Content injected above existing | Inject into pre-reserved slot, not prepend |
| Web fonts (FOUT/FOIT) | `font-display: optional` or preload critical fonts |
| Animations using `top`/`left` | Use `transform: translate()` — no layout shift |

```css
/* Always set dimensions OR aspect-ratio */
img { aspect-ratio: 16 / 9; width: 100%; }

/* Reserve ad slot space BEFORE ad loads */
.ad-slot { min-height: 250px; width: 300px; }

/* Safe animation — transform doesn't cause layout shift */
.slide-in { transform: translateX(-100%); transition: transform 0.3s; }
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `font-display: swap` để fix CLS | Swap = flash of unstyled text + potential layout shift | `font-display: optional` (skip if not ready) or preload critical fonts |
| `position: absolute` để avoid CLS | Absolutely positioned elements can still cause CLS | Use `transform` for animations |
| Inject notification banner với `prepend` | Pushes content down → layout shift | Use fixed/sticky positioning or pre-reserved slot |

**🎯 Interview Pattern:**
- Khi thấy: "CLS score 0.3 (poor). Debug và fix?"
- → Algorithm: (1) PerformanceObserver với type `layout-shift` → xem `.sources` để biết element nào, (2) Common suspects: images, fonts, ads, (3) Fix dimensions, reserve space
- → Mở đầu: "PerformanceObserver với `layout-shift` type sẽ cho biết element nào gây shift. Thường là ảnh thiếu dimensions hoặc content inject above fold..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: Browser layout/paint pipeline, CSS positioning
- ➡️ Để hiểu: Font loading strategies, CSS containment

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: Core Web Vitals là gì? Tại sao quan trọng? 🟢 Junior

**A:** Core Web Vitals are three Google-defined metrics measuring real user experience: LCP (loading speed ≤2.5s), INP (responsiveness ≤200ms), CLS (visual stability ≤0.1). They matter because: (1) Google Search ranking signal since 2021, (2) correlate with user engagement and conversion rates, (3) actionable engineering goals with clear thresholds.

Là 3 chỉ số đo trải nghiệm thực tế: LCP (speed), INP (responsiveness), CLS (stability). Quan trọng vì: ranking factor Google, tương quan conversion rate, và có ngưỡng cụ thể để optimize.

**💡 Interview Signal:**
- ✅ Strong: Biết INP thay FID từ 3/2024, giải thích tại sao mỗi metric được Google chọn (correlation với user behavior), liên kết đến business impact
- ❌ Weak: Chỉ list 3 tên và thresholds — không explain tại sao

---

### Q2: Page LCP = 4s. Walk me through debugging. 🟡 Mid

**A:**
1. **DevTools Network → TTFB**: If >600ms → server/CDN issue (fix first — affects everything)
2. **Lighthouse**: Identifies the exact LCP element, lists specific opportunities
3. **Check LCP element**: Is it an `<img>`? Is `loading="lazy"` set? (bad for LCP!) Is it preloaded?
4. **Render-blocking resources**: Look at waterfall for CSS/JS blocking first paint
5. **Image format/size**: Is it WebP? Properly sized for viewport (not desktop image on mobile)?

**Quá trình debug thực tế**: TTFB → LCP element identification → preload/fetchpriority → image format → render blocking.

**💡 Interview Signal:**
- ✅ Strong: Systematic từ TTFB → resource loading → rendering, biết Lighthouse shows exact LCP element, mention `fetchpriority="high"` vs just `preload`
- ❌ Weak: "Dùng WebP và CDN" — đúng nhưng không có debugging process

---

### Q3: Tại sao INP thay thế FID? 🟡 Mid

**A:** FID only measured the first interaction's **input delay** (time before JS even starts processing) and missed processing + rendering time. Pages could have fast FID but terrible INP — all subsequent clicks feel laggy. INP measures **all interactions** throughout the session (p98) and includes the full processing + paint cycle, making it a far better proxy for perceived responsiveness.

FID chỉ đo input delay của interaction đầu tiên — dễ "qua mặt" bằng defer JS. Sau đó trang có thể lag nặng. INP đo TẤT CẢ interactions (p98), bao gồm cả processing + paint time.

**💡 Interview Signal:**
- ✅ Strong: Giải thích "p98" (98th percentile), biết FID chỉ đo input delay (không đo processing+paint), explain tại sao FID dễ fake
- ❌ Weak: "INP đo nhiều hơn FID" — vague

---

### Q4: CLS = 0.3 (poor). Identify và fix. 🟡 Mid

**A:**
1. **DevTools Performance tab**: Record page load, look for "Layout Shift" events
2. **Attribution API**:
```javascript
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      console.log('Shift sources:', entry.sources); // which elements shifted
    }
  }
}).observe({ type: 'layout-shift', buffered: true });
```
3. **Common suspects**: Images without dimensions, fonts (FOUT), ads/embeds
4. **Fixes**: Set image `width`/`height`, `font-display: optional`, reserve ad slots

**💡 Interview Signal:**
- ✅ Strong: Biết `hadRecentInput` filter (exclude user-initiated shifts), biết `.sources` API, explain CLS formula (impact × distance), distinguish `font-display: swap` (can cause shift) vs `optional` (safer)
- ❌ Weak: "Set image dimensions" — knows one fix, misses attribution debugging

---

### Q5: Measure Core Web Vitals in production — thiết lập Real User Monitoring 🔴 Senior

**A:**

```javascript
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, rating, id, navigationType }) {
  // Include: metric name, value (ms or score), rating (good/ni/poor),
  // id (dedup), navigationType (navigate/reload/back_forward)
  fetch('/analytics', {
    method: 'POST',
    keepalive: true, // survives page unload
    body: JSON.stringify({
      metric: name,
      value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS as integer
      rating,
      url: location.href,
      userAgent: navigator.userAgent,
    }),
  });
}

// Report all Core Web Vitals + diagnostic metrics
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
onFCP(sendToAnalytics); // diagnostic for LCP
onTTFB(sendToAnalytics); // diagnostic for LCP
```

**Production considerations:**
- `keepalive: true` ensures analytics survives page close (beacon pattern)
- CLS: multiply by 1000 and store as integer (easier to aggregate)
- Sample at 10-20% for high-traffic sites (reduce backend load)
- Segment by device type (mobile usually worse), connection speed, URL path

**💡 Interview Signal:**
- ✅ Strong: `keepalive` for page-unload safety, CLS integer encoding, sampling strategy, segmentation recommendations, mention CrUX (Chrome User Experience Report) as alternative data source
- ❌ Weak: Just show `onLCP(console.log)` — no production considerations

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Giải thích Core Web Vitals và cách bạn đã cải thiện chúng trong project thực tế."**

**30 giây đầu — mở đầu lý tưởng:**
1. "Core Web Vitals là 3 metric của Google đo UX thực tế: LCP (loading speed), INP (responsiveness), CLS (visual stability) — và là ranking factor từ 2021."
2. "LCP target 2.5s — tôi fix bằng cách thêm `fetchpriority='high'` và preload cho hero image, chuyển sang WebP format."
3. "CLS target 0.1 — tôi fix bằng cách set `width`/`height` cho tất cả images và reserve ad slots với `min-height`."
4. "INP target 200ms — tôi dùng React `useTransition` để defer expensive state updates sau click, và `scheduler.yield()` để break long tasks."

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — không nhìn lại!**

- [ ] **Retrieval**: Liệt kê 3 Core Web Vitals, target threshold, và main cause cho mỗi cái từ trí nhớ.
- [ ] **Visual**: Vẽ INP breakdown: 3 phases (input delay, processing, presentation) và cách fix mỗi phase.
- [ ] **Application**: Image gallery với 20 ảnh, không có width/height. Metrics nào bị ảnh hưởng? Fix như thế nào?
- [ ] **Debug**: Lighthouse report: LCP = 4.2s, LCP element = `<img class="hero">`. Bạn trace 5 bước debug gì?
- [ ] **Teach**: Giải thích CLS cho PM — tại sao layout shift là bad UX và ảnh hưởng gì đến conversion?

💬 **Feynman Prompt:** Giải thích tại sao INP thay thế FID — tại sao FID "dễ đánh lừa" và INP "thật hơn" — dùng ví dụ quán cà phê mà không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.
