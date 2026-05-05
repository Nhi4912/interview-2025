# Responsive vs Adaptive Design / Responsive vs Adaptive Design

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Responsive Design](./03-responsive-design.md), [CSS Fundamentals](./00-css-fundamentals.md)
> **See also**: [Grid & Flexbox](./01-grid-flexbox.md) | [Modern CSS Features](./06-modern-css-features.md) | [CSS Architecture](./02-css-architecture.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: **"What's the difference between responsive and adaptive design? When would you choose one over the other?"**

Đây là câu hỏi nhiều candidates trả lời nhầm — hoặc nói "chúng giống nhau" hoặc mô tả responsive đúng nhưng mù tịt về adaptive. Thực tế trong sản phẩm lớn, cả hai đều tồn tại song song.

**Scenario cụ thể:**

Một e-commerce startup ở Đông Nam Á (target chính: Indonesia, Philippines) nhận ra 80% user truy cập qua mạng 3G trên Android tầm trung. Trang chủ hiện tại load hero image 2.4 MB — đẹp trên desktop, nhưng user mobile phải chờ 8 giây để thấy nội dung. Bounce rate mobile là 74%.

Team đang debate: "Nên làm responsive thôi hay cần adaptive riêng cho mobile?"

Câu trả lời phụ thuộc vào việc bạn hiểu rõ hai khái niệm này khác nhau ở đâu — và khi nào mỗi cái thực sự giải quyết vấn đề.

---

## What & Why / Cái Gì & Tại Sao

### Định nghĩa / Definitions

**Analogy / Liên Tưởng:**

- **Responsive** = Nước đổ vào bình — cùng một lượng nước, tự điều chỉnh theo hình dạng container. Một codebase, CSS tự co giãn.
- **Adaptive** = Đặt đồ ăn theo thực đơn khác nhau cho khách khác nhau — nhà bếp biết bạn là khách "mobile" hay "desktop" và đưa ra đĩa khác hoàn toàn.

---

**Responsive Web Design (RWD)**

Coined by **Ethan Marcotte** (2010) trong bài viết cùng tên trên A List Apart.

- **Một** codebase HTML/CSS duy nhất
- Layout **fluid** — co giãn liên tục theo viewport width
- Điều chỉnh qua **CSS**: media queries, fluid grids, flexible images
- Browser-side — server không biết gì về thiết bị
- URL duy nhất cho tất cả devices

```
Desktop 1440px  →  Tablet 768px  →  Mobile 375px
     ↑                  ↑               ↑
     └──── cùng HTML, CSS media queries điều chỉnh ────┘
```

---

**Adaptive Web Design (AWD)**

Coined by **Aaron Gustafson** (2011) trong cuốn _Adaptive Web Design: Crafting Rich Experiences with Progressive Enhancement_.

- **Nhiều** layout/template riêng biệt cho từng device class
- Layout **fixed per class** — chọn một layout và dùng nguyên từ đầu đến cuối
- Detection qua **UA sniffing** (server), **JS breakpoint detection**, hoặc **URL riêng** (m.example.com)
- Thường server-side — server chọn template phù hợp trước khi response
- Có thể có URL khác nhau cho mobile/desktop

```
Request → Server detects device → Send different HTML template
  mobile UA  →  mobile template (stripped HTML, mobile bundle)
  desktop UA →  desktop template (full HTML, full bundle)
```

---

**Sự nhầm lẫn phổ biến / The Common Confusion**

"Responsive" đã trở thành buzzword chỉ "site hoạt động được trên mobile". Nhiều người gọi site là "responsive" khi thực ra nó dùng kỹ thuật adaptive (JS swap component, user-agent detection, m.site riêng). Trong phỏng vấn, nên phân biệt rõ bằng mechanism, không chỉ bằng kết quả.

**Sự thật thực tế (2026):** Hầu hết "modern" sites là responsive về layout, nhưng vẫn dùng adaptive techniques cho assets: `next/image` chọn ảnh theo device class, container queries tạo adaptive-style component switching, React Server Components ship component tree khác nhau theo device. Hai khái niệm không loại trừ nhau.

---

## Part 1: Side-by-Side Comparison / So Sánh Chi Tiết

| Dimension                         | Responsive (RWD)                             | Adaptive (AWD)                                   |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| **Layout**                        | Fluid, single — co giãn liên tục             | Fixed per class — chọn 1 trong N layouts         |
| **Detection**                     | CSS media queries (browser-side)             | UA sniff / JS / server-side                      |
| **Number of codebases**           | Một                                          | Nhiều variants (thường 2–3)                      |
| **Performance — HTML/JS payload** | Cùng payload cho mọi thiết bị                | Có thể ship ít hơn cho mobile                    |
| **Performance — Images**          | Wasteful nếu không dùng srcset               | Server có thể chọn đúng ảnh ngay                 |
| **SEO**                           | Single URL — Google ưu tiên                  | Rủi ro duplicate content nếu dùng m.domain       |
| **Canonical URL**                 | Không cần canonical tag                      | Cần `rel="canonical"` pointing to desktop        |
| **Maintenance**                   | Một codebase, dễ maintain                    | N codebases, dễ diverge                          |
| **Edge cases**                    | Awkward "in-between" widths                  | Sharp jump giữa layouts (không có middle ground) |
| **Bandwidth**                     | Full payload — mobile nhận desktop JS/CSS    | Optimal — mobile nhận stripped-down bundle       |
| **UX flexibility**                | Khó tạo UX hoàn toàn khác cho mobile/desktop | Tự do thiết kế UX riêng hoàn toàn                |
| **Development speed**             | Nhanh hơn (một codebase)                     | Chậm hơn (phải build và test N variants)         |
| **2026 relevance**                | Default choice (90%+ sites)                  | Niche: perf-critical, m-dot legacy, POS apps     |

---

## Part 2: When Responsive Wins / Khi Nào Dùng Responsive

**Responsive là default choice cho hầu hết projects.**

### Dùng Responsive khi:

- **Content sites, blogs, marketing pages** — layout khác nhau theo viewport là đủ
- **SEO là ưu tiên** — single URL, không lo duplicate content penalty
- **Team nhỏ** — một codebase để maintain, một set test để chạy
- **Timeline ngắn** — không cần build và sync nhiều variants
- **UX không quá khác nhau** giữa mobile và desktop — cùng features, khác layout

### Code Examples — Mobile-First Media Queries

```css
/* Base: Mobile */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet: 2 columns */
@media (min-width: 48rem) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 4 columns */
@media (min-width: 64rem) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Code Example — Fluid Typography với clamp()

```css
:root {
  /* Fluid: scale from 1rem (mobile) to 1.25rem (desktop), no breakpoints */
  --text-base: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
  /* Fluid heading: 1.5rem → 3rem */
  --text-h1: clamp(1.5rem, 1rem + 2.5vw, 3rem);
}

body {
  font-size: var(--text-base);
}
h1 {
  font-size: var(--text-h1);
}
```

### Code Example — Container Queries (Responsive at Component Level)

```css
/* Mark the container */
.card-wrapper {
  container-type: inline-size;
}

/* Card responds to its OWN container width, not viewport */
@container (min-width: 30rem) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr; /* image | text side by side */
  }
}

/* Same card in a narrow sidebar stays stacked, even if viewport is wide */
```

Container queries là "adaptive behavior" at component level — component tự switch layout không cần biết viewport. Đây là hybrid pattern phổ biến nhất trong 2026.

---

## Part 3: When Adaptive Wins / Khi Nào Dùng Adaptive

**Adaptive thắng trong các trường hợp performance-critical hoặc UX hoàn toàn khác nhau.**

### Dùng Adaptive khi:

- **Mobile bandwidth là critical** — user 3G, payload cần tối thiểu hóa tuyệt đối
- **UX hoàn toàn khác** giữa device classes — POS tablet vs admin desktop không chỉ khác layout mà khác toàn bộ interaction model
- **Touch vs mouse** khác biệt cơ bản — ví dụ drag-to-resize trên desktop, swipe-to-dismiss trên mobile
- **Legacy m.example.com** sites — đã tồn tại, cost of migration cao hơn cost of maintenance
- **B2B apps** với desktop-only features mà không cần ship code đó xuống mobile

### Code Example — Server-Side UA Detection

```typescript
// Next.js middleware: detect device class, serve different bundle
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const isMobile = /iPhone|Android|Mobile/i.test(ua);

  const url = req.nextUrl.clone();

  if (isMobile && !url.pathname.startsWith("/m/")) {
    // Rewrite internally — URL stays the same for SEO
    url.pathname = `/m${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
```

⚠️ **Lưu ý:** UA sniffing không hoàn hảo — tablets và foldables có thể bị misclassify. Luôn cần fallback. Google crawls as mobile Googlebot by default (2020+) — nên đảm bảo mobile version không bị block.

### Code Example — next/image với sizes (Adaptive Assets trong Responsive Layout)

```tsx
// Adaptive images INSIDE a responsive layout — best of both worlds
import Image from "next/image";

export function HeroBanner() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      width={1920}
      height={1080}
      // Tell browser how wide the image renders at each breakpoint
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      // Next.js auto-generates srcset for each device pixel ratio + size
      priority // fetchpriority="high" — LCP element
    />
  );
}
```

`sizes` là adaptive technique — browser và server cộng tác để ship đúng ảnh cho đúng device. Không phải pure responsive (fluid) cũng không phải pure adaptive (server-side) — đây là hybrid.

### Code Example — Different React Component Trees per Device

```tsx
// React Server Component: ship different JSX tree per device
// No JS hydration cost for the "wrong" platform
// app/dashboard/page.tsx
import { headers } from "next/headers";
import { MobileDashboard } from "./MobileDashboard";
import { DesktopDashboard } from "./DesktopDashboard";

export default function DashboardPage() {
  const headersList = headers();
  const ua = headersList.get("user-agent") ?? "";
  const isMobile = /iPhone|Android|Mobile/i.test(ua);

  // Only the matching component's JS ships to client
  return isMobile ? <MobileDashboard /> : <DesktopDashboard />;
}
```

Đây là "adaptive component tree" — mobile users không download DesktopDashboard JS bundle, desktop users không download MobileDashboard. Payload reduction mà không cần m.domain.

---

## Part 4: The Hybrid Reality / Thực Tế Kết Hợp

**Best practice 2026: Responsive layout + Adaptive assets + Container-query components.**

Modern production sites thường là hybrid:

| Layer                   | Approach                                                      |
| ----------------------- | ------------------------------------------------------------- |
| **Page layout**         | Responsive (CSS media queries, fluid grid)                    |
| **Images**              | Adaptive (srcset + sizes, next/image)                         |
| **Component layout**    | Container queries (adaptive-style, CSS-only)                  |
| **Heavy widgets**       | Adaptive (don't ship interactive map to mobile if not needed) |
| **Typography**          | Responsive fluid (`clamp()`)                                  |
| **Component JS bundle** | Adaptive via RSC (different tree per device class)            |

### Pattern 1: Responsive Layout + Adaptive Images

```html
<!-- Responsive: CSS controls layout -->
<section class="hero">
  <!-- Adaptive: srcset + sizes pick the right image -->
  <picture>
    <!-- Art direction: portrait crop on mobile -->
    <source
      media="(max-width: 767px)"
      srcset="/hero-portrait-400.avif 400w, /hero-portrait-800.avif 800w"
      type="image/avif"
    />
    <!-- Resolution switching: landscape on desktop -->
    <source srcset="/hero-1200.avif 1200w, /hero-1920.avif 1920w" sizes="100vw" type="image/avif" />
    <img
      src="/hero-1200.jpg"
      alt="E-commerce hero"
      width="1920"
      height="1080"
      fetchpriority="high"
    />
  </picture>
</section>
```

### Pattern 2: Container Queries — Adaptive Component Behavior, CSS Only

```css
/* No JS, no UA detection — pure CSS adaptive */
.sidebar {
  container-type: inline-size;
}
.main {
  container-type: inline-size;
}

/* ProductCard renders differently in sidebar vs main — same component */
@container (min-width: 20rem) {
  .product-card {
    /* compact: vertical stack */
    flex-direction: column;
  }
}

@container (min-width: 35rem) {
  .product-card {
    /* expanded: horizontal with image left */
    flex-direction: row;
    gap: 1.5rem;
  }
}
```

### Pattern 3: React Server Components — Adaptive Bundles

```tsx
// app/product/[id]/page.tsx
import { getUserAgent } from "@/lib/ua";
import { MobileProductPage } from "./MobileProductPage"; // ~12kb JS
import { DesktopProductPage } from "./DesktopProductPage"; // ~45kb JS

// Server renders only one; client only downloads that one's JS
export default async function ProductPage({ params }: { params: { id: string } }) {
  const ua = getUserAgent();
  const Product = ua.isMobile ? MobileProductPage : DesktopProductPage;
  const data = await fetchProduct(params.id);
  return <Product data={data} />;
}
```

---

## Part 5: Mobile-First vs Desktop-First / Mobile-First vs Desktop-First

### Tại sao Mobile-First thắng / Why Mobile-First Won

1. **Progressive enhancement** — bắt đầu từ minimum viable, thêm khi có thêm khả năng (screen space, bandwidth, input precision)
2. **CSS cascade tự nhiên** — `min-width` queries thêm styles, không override. Clean và ít bugs
3. **Content prioritization** — buộc bạn quyết định điều gì _thực sự_ cần thiết trên mobile
4. **Google mobile-first indexing** (2020) — Googlebot crawl bằng mobile viewport mặc định

### Mobile-First vs Desktop-First — Side by Side

```css
/* ===== MOBILE-FIRST (min-width) ===== */
/* Base = mobile — smallest, simplest */
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Tablet: enhance */
@media (min-width: 48rem) {
  .nav {
    flex-direction: row;
    gap: 1rem;
  }
}

/* Desktop: enhance further */
@media (min-width: 64rem) {
  .nav {
    gap: 2rem;
    /* add desktop-only features */
    align-items: center;
  }
}
```

```css
/* ===== DESKTOP-FIRST (max-width) ===== */
/* Base = desktop — feature-rich starting point */
.nav {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: center;
}

/* Tablet: start removing */
@media (max-width: 64rem) {
  .nav {
    gap: 1rem;
  }
}

/* Mobile: remove more, override more */
@media (max-width: 48rem) {
  .nav {
    flex-direction: column; /* override desktop */
    gap: 0.5rem;
    /* must now explicitly undo align-items, etc. */
  }
}
```

**Vấn đề với Desktop-First:** CSS overrides tích lũy. Sau 6 tháng, mobile breakpoint có 30 `unset`/`initial`/`none` declarations — đây là tech debt có thể tránh được.

### The `min-width` vs `max-width` Cascade Trap

```css
/* TRAP: mixing min-width and max-width on same element */
.hero {
  font-size: 3rem; /* base (desktop-first?) */
}
@media (max-width: 64rem) {
  .hero {
    font-size: 2rem;
  } /* tablet override */
}
@media (min-width: 48rem) {
  .hero {
    font-size: 2.5rem;
  } /* 😱 this overrides the max-width rule at 48-64rem */
}
/* At 55rem viewport: which wins? The min-width rule — it comes last in source */
/* This is a specificity/source-order bug waiting to happen */

/* FIX: pick ONE strategy, be consistent */
/* Mobile-first: use ONLY min-width */
.hero {
  font-size: 1.5rem;
}
@media (min-width: 48rem) {
  .hero {
    font-size: 2rem;
  }
}
@media (min-width: 64rem) {
  .hero {
    font-size: 3rem;
  }
}
```

---

## Part 6: Breakpoint Strategy / Chiến Lược Breakpoint

### Device-Based Breakpoints — Tại Sao Đã Lỗi Thời

```css
/* ❌ Anti-pattern: hardcode device names */
@media (max-width: 320px) {
  /* "iPhone SE" */
}
@media (max-width: 375px) {
  /* "iPhone 12" */
}
@media (max-width: 768px) {
  /* "iPad portrait" */
}
@media (max-width: 1024px) {
  /* "iPad landscape" */
}
@media (max-width: 1440px) {
  /* "Laptop" */
}
```

**Vấn đề:** Devices thay đổi mỗi năm. Galaxy Fold 7 và Pixel 9 và iPhone 17 — mỗi cái pixel width khác nhau. Chase theo device names = vĩnh viễn đuổi theo thị trường.

### Content-Based Breakpoints — Modern Best Practice

```css
/* ✅ Best practice: set breakpoints where content breaks */
/* Find them by: resize browser slowly, where does layout "break"? */

/* Example: card grid breaks at ~40rem (content-driven, not device-driven) */
.card-grid {
  grid-template-columns: 1fr; /* 1 col: works for any narrow viewport */
}

@media (min-width: 40rem) {
  /* Content breakpoint: 2 cols fit nicely */
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 64rem) {
  /* Content breakpoint: 4 cols with whitespace */
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Queries Change the Game / Container Queries Thay Đổi Cuộc Chơi

Container queries xóa bỏ hoàn toàn viewport-based breakpoints cho components:

```css
/* Component never needs to know the viewport */
/* It only needs to know its own available space */
.card-container {
  container-type: inline-size;
}

/* Breakpoint based on container, not global viewport */
@container (min-width: 30rem) {
  .card {
    flex-direction: row;
  }
}

/* Same card can go in: sidebar (narrow), modal (medium), main content (wide) */
/* Each context triggers its own breakpoint independently */
```

### Framework Breakpoint Defaults

| Framework                | Breakpoints                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| **Tailwind CSS**         | `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px` |
| **Bootstrap 5**          | `sm: 576px`, `md: 768px`, `lg: 992px`, `xl: 1200px`, `xxl: 1400px`  |
| **Material UI**          | `xs: 0`, `sm: 600px`, `md: 900px`, `lg: 1200px`, `xl: 1536px`       |
| **Custom (recommended)** | Content-driven — set at 40rem, 64rem, 80rem (adjust per project)    |

**Lưu ý:** Tailwind, Bootstrap, MUI đều dùng device-inspired pixel values — không content-driven. Hãy hiểu giới hạn này và override khi cần.

---

## Part 7: Performance Implications / Ảnh Hưởng Performance

### LCP Impact — Wrong Image Size

LCP (Largest Contentful Paint) thường là hero image. Load sai size = LCP fail.

```html
<!-- ❌ BAD: Desktop 2.4MB image sent to all devices -->
<img src="/hero-desktop.jpg" alt="Hero" />

<!-- ✅ GOOD: Adaptive images via srcset + sizes -->
<img
  src="/hero-800.jpg"
  srcset="/hero-400.jpg 400w, /hero-800.jpg 800w, /hero-1600.jpg 1600w"
  sizes="
    (max-width: 767px) 100vw,
    (max-width: 1199px) 80vw,
    1200px
  "
  alt="Hero"
  fetchpriority="high"
  width="1600"
  height="900"
/>
```

Kết quả thực tế: Hero image từ 2.4MB (desktop) → ~180KB (mobile 400w) = **92% bandwidth reduction** cho mobile users.

### Hydration Cost Differences

```
Responsive layout:
  Client downloads ALL JS regardless of viewport
  → Could include desktop-only interactive components
  → Mobile pays for JS it never uses

Adaptive layout (RSC):
  Server sends different component tree
  → Mobile only downloads MobileDashboard.js (~12kb)
  → Desktop only downloads DesktopDashboard.js (~45kb)
  → Better Time to Interactive (TTI) for both
```

### loading="lazy" + fetchpriority="high" và Breakpoints

```html
<!-- Hero image: ABOVE the fold → fetchpriority="high", NO lazy -->
<img src="/hero.jpg" fetchpriority="high" alt="Hero" width="1200" height="630" />
<!-- NEVER use loading="lazy" on the LCP element -->

<!-- Below-fold images: lazy load -->
<img src="/product-1.jpg" loading="lazy" alt="Product" width="400" height="400" />
```

⚠️ **Trap:** `loading="lazy"` trên LCP image làm LCP tệ hơn — browser delay load image cho đến khi nó gần viewport. Trên mobile với màn nhỏ hơn, "above the fold" khác desktop — luôn test LCP trên mobile viewport thật.

### CLS Prevention với aspect-ratio

```css
/* ❌ BAD: image without dimensions → CLS */
img {
  width: 100%;
}

/* ✅ GOOD: reserve space before image loads */
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* reserve space matching actual dimensions */
}

/* For images with different ratios per breakpoint */
.hero-image {
  aspect-ratio: 1 / 1; /* square on mobile */
}

@media (min-width: 48rem) {
  .hero-image {
    aspect-ratio: 16 / 9; /* widescreen on desktop */
  }
}
```

CLS (Cumulative Layout Shift) score của Google bị penalty nặng khi images không có reserved space. `aspect-ratio` + `width/height` attributes trên `<img>` là combo cần thiết.

---

## Part 8: Common Pitfalls / Sai Lầm Phổ Biến

### 1. `display: none` ≠ Không Load

```css
/* ❌ TRAP: content hidden but still downloaded */
.desktop-only {
  display: none; /* mobile doesn't SEE it, but downloads ALL its assets */
}

@media (min-width: 64rem) {
  .desktop-only {
    display: block;
  }
}
```

Nếu `.desktop-only` chứa `<img>` 500KB, mobile user vẫn download 500KB. Fix: dùng `loading="lazy"` cho images, hoặc không render element trên server khi mobile (RSC), hoặc dynamic import với `ssr: false`.

### 2. `width: 100%` trên Images Không Có `max-width`

```css
/* ❌ Image stretches beyond its natural size on large screens */
img {
  width: 100%;
}

/* ✅ Constrain to natural size, flexible below that */
img {
  width: 100%;
  max-width: 100%; /* never exceed natural width */
  height: auto; /* maintain aspect ratio */
}
```

### 3. Missing `<meta viewport>` Tag

```html
<!-- ❌ Missing: mobile browser renders at desktop width, scales down → tiny text -->

<!-- ✅ Required on EVERY page -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- ❌ NEVER do this — disables user zoom, WCAG 1.4.4 violation -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
```

### 4. Hover-Only Interactions trên Touch Devices

```css
/* ❌ TRAP: critical info only visible on hover */
.tooltip {
  display: none;
}
.button:hover .tooltip {
  display: block; /* Touch users can never see this */
}

/* ✅ FIX: accessible tooltip that works on focus (keyboard + touch) */
.tooltip {
  display: none;
}
.button:hover .tooltip,
.button:focus .tooltip,
.button:focus-within .tooltip {
  display: block;
}
```

Trên touch device, `:hover` thường trigger khi tap, nhưng không reliable. Luôn pair với `:focus` hoặc dùng `pointer: coarse` media query để switch pattern hoàn toàn.

### 5. Input Font Size < 16px trên iOS — Zoom Bug

```css
/* ❌ iOS Safari auto-zooms page when input font < 16px */
input {
  font-size: 14px; /* triggers iOS zoom on focus */
}

/* ✅ FIX: always >= 16px for inputs */
input,
select,
textarea {
  font-size: 16px; /* prevents iOS auto-zoom */
  font-size: 1rem; /* scales with user preferences */
}

/* If design requires visual 14px, use transform to scale down visually */
/* without affecting the DOM font-size iOS reads */
input {
  font-size: 16px;
  transform: scale(0.875); /* visual 14px, DOM 16px */
  transform-origin: left center;
}
```

### 6. Adaptive Sites Blocking Googlebot

```
Since 2020: Googlebot crawls as mobile user agent by default
(Googlebot Smartphone, not Googlebot Desktop)

Adaptive sites that:
- Serve stripped HTML to mobile UA
- Block mobile crawlers from reaching full content
- Have different URLs without canonical tags

→ Risk: Google indexes mobile-optimized (possibly reduced) version
→ Fix: ensure mobile version has full content OR set canonical correctly
```

```html
<!-- m.example.com pages MUST have canonical pointing to desktop URL -->
<link rel="canonical" href="https://example.com/product/123" />
<!-- Desktop page should have alternate pointing to mobile URL -->
<link
  rel="alternate"
  media="only screen and (max-width: 640px)"
  href="https://m.example.com/product/123"
/>
```

---

## Part 9: Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What's the difference between responsive and adaptive design? / Sự khác biệt giữa responsive và adaptive design? 🟡 Mid

**A:** Responsive design uses a **single** HTML/CSS codebase that fluidly adjusts layout via CSS (media queries, fluid grids, flexible images). The same HTML is delivered to all devices; the browser adapts it. Coined by Ethan Marcotte in 2010.

Adaptive design uses **multiple** distinct layouts or templates — the server (or JS) detects the device class and delivers a different, pre-designed experience. The server knows whether you're on mobile or desktop before it sends anything.

Key mechanism difference: responsive = CSS-side, browser decides. Adaptive = detection-side, server (or JS) decides.

In practice, most modern sites are responsive for layout but use adaptive techniques for assets (srcset, next/image) and sometimes for JS bundles (React Server Components shipping different trees per device class).

Vietnamese: Responsive = một codebase HTML, CSS tự co giãn (media queries, fluid grid). Browser quyết định layout. Adaptive = nhiều template riêng biệt, server (hoặc JS) detect device class rồi deliver đúng version. Mechanism khác nhau: responsive là CSS-side, adaptive là detection-side. Thực tế 2026: hầu hết sites responsive cho layout nhưng adaptive cho assets và JS bundles.

**💡 Interview Signal:**

- ✅ Strong: Explains mechanism (CSS vs detection), names Ethan Marcotte, mentions that they're not mutually exclusive and modern sites often combine them
- ❌ Weak: "Responsive adjusts to screen size, adaptive has different layouts" (correct but doesn't explain the detection mechanism or why they're different architecturally)

---

### Q: When would you choose adaptive over responsive? / Khi nào chọn adaptive thay vì responsive? 🔴 Senior

**A:** Adaptive makes sense in three scenarios:

**1. Bandwidth-critical mobile users**: If the majority of your users are on 3G in markets like Indonesia or Vietnam, and you need to radically reduce payload — not just images but HTML structure and JS bundle — adaptive lets you ship a minimal mobile app while desktop gets the full experience. Responsive layout can't reduce JS payload unless combined with dynamic imports.

**2. Fundamentally different UX**: A point-of-sale system on a tablet (swipe workflows, barcode scanning, full-screen modes) and an admin dashboard on desktop are so different that designing one fluid layout between them produces a poor experience on both. Two separate apps make more sense.

**3. Legacy constraints**: An existing m.example.com site with years of SEO signals, partnerships, and integrations is expensive to migrate. Maintaining it is cheaper than a full rebuild.

In 2026, most "adaptive" use cases are better served by: RSC for adaptive JS bundles, `next/image` for adaptive images, and container queries for adaptive component layouts — all without the maintenance burden of separate codebases.

Vietnamese: Chọn adaptive khi: (1) mobile bandwidth thực sự critical — cần giảm cả JS bundle, không chỉ images; (2) UX hoàn toàn khác nhau giữa device classes — POS tablet vs admin desktop; (3) legacy m.domain với SEO signals cao, migration cost quá lớn. Năm 2026, phần lớn use cases adaptive được giải quyết tốt hơn bằng RSC + next/image + container queries.

**💡 Interview Signal:**

- ✅ Strong: Names specific scenarios with business context (3G markets, POS systems), knows adaptive's downside (maintenance cost), and proposes modern hybrid alternatives (RSC, next/image)
- ❌ Weak: "When you need different layouts for different devices" (that's also responsive — misses the payload and UX-fundamentally-different distinction)

---

### Q: How do container queries change responsive design? / Container queries thay đổi responsive design như thế nào? 🔴 Senior

**A:** Container queries shift the question from "how wide is the **viewport**?" to "how wide is **my container**?" This is significant for component-driven architecture.

With media queries, a card component in a 300px sidebar and a 900px main area receive the same CSS breakpoints — because both are in the same viewport. The card can't know its own available space.

Container queries solve this: mark the parent as a container, then query its width. The same card component now adapts correctly whether placed in a narrow sidebar, a modal, or a wide main area — without any prop or class changes.

This blurs the line between responsive (viewport-driven) and adaptive (context-driven) at the component level. Components behave adaptively without any JS detection or server involvement.

```css
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 30rem) {
  .card {
    flex-direction: row;
  } /* side-by-side only when space exists */
}
```

Practical impact: component libraries can ship truly portable components that adapt to any layout context. No more "small card" and "large card" variants — one component, CSS handles it.

Vietnamese: Container queries: "my box bao nhiêu?" thay vì "viewport bao nhiêu?". Card trong sidebar 300px và main 900px sẽ xử lý khác nhau dù cùng viewport. Component thực sự portable. Đây là adaptive behavior ở component level, CSS-only, không cần JS hay server detection. Xóa bỏ nhu cầu tạo nhiều variant component cho kích thước khác nhau.

**💡 Interview Signal:**

- ✅ Strong: Explains the viewport vs container problem with a concrete example (sidebar vs main), mentions `container-type: inline-size` syntax, connects container queries to "adaptive at component level without JS"
- ❌ Weak: "Container queries respond to container size instead of viewport" (definition only — the signal is explaining the component portability problem this solves)

---

### Q: Mobile-first vs desktop-first — pros and cons? / Mobile-first vs desktop-first — ưu và nhược điểm? 🟡 Mid

**A:**

**Mobile-first (`min-width` queries):**

- Pros: Additive CSS — you only add styles for larger screens, never subtract. Forces content prioritization — what's essential on mobile? Cleaner CSS over time, no accumulation of override rules. Aligns with Google's mobile-first indexing.
- Cons: Context-switch if designers work desktop-first. Some complex desktop interactions are awkward to layer in progressively.

**Desktop-first (`max-width` queries):**

- Pros: Natural fit when product is primarily enterprise desktop (trading platforms, admin dashboards, CAD tools). Matches designer workflow if mockups are desktop-first.
- Cons: CSS debt accumulates — mobile breakpoints override many desktop properties. `max-width` queries are subtractive (harder to maintain). Easy to "hide" desktop features on mobile instead of redesigning them.

**Recommendation:** Mobile-first as default. Desktop-first only if >70% of your users are desktop and the app is desktop-native in interaction model.

Vietnamese: Mobile-first (`min-width`): CSS cộng dồn, buộc ưu tiên content, clean code dài hạn. Desktop-first (`max-width`): phù hợp app enterprise desktop, nhưng tạo CSS debt — override tích lũy, dễ hide thay vì redesign. Khuyến nghị: mobile-first là default; desktop-first chỉ khi app thực sự là desktop-native.

**💡 Interview Signal:**

- ✅ Strong: Uses "additive vs subtractive" framing, mentions the content prioritization forcing function, and names legitimate desktop-first use cases (enterprise apps) rather than dismissing it entirely
- ❌ Weak: "Mobile-first is better because most users are on mobile" (misses the CSS cascade argument — the real technical reason)

---

### Q: How do you choose breakpoints? / Cách chọn breakpoints? 🟡 Mid

**A:** The modern answer: **let the content decide, not the device list.**

Wrong approach: `320px` (iPhone SE), `768px` (iPad), `1024px` (iPad landscape), `1440px` (laptop). These chase a device market that changes yearly.

Right approach: Start with the most constrained layout (mobile), then slowly widen the browser viewport. When the layout starts to look awkward or breaks — that's your breakpoint. You're setting a breakpoint at `40rem` because that's when the card text line becomes too long to read, not because some device is 640px wide.

In practice, most content-driven sites need only 2–3 breakpoints. Start with `40rem` (roughly tablet) and `64rem` (roughly desktop) until content proves you need more.

**Container queries remove the need for viewport breakpoints inside components** — each component sets its own size thresholds. Viewport breakpoints then only handle macro layout (sidebar appears, max-width kicks in).

Vietnamese: Content-based breakpoints: mở rộng browser từ mobile, thấy layout "vỡ" ở đâu thì đặt breakpoint ở đó — không phải chase theo device names. Hầu hết sites chỉ cần 2–3 breakpoints: ~40rem và ~64rem là đủ để bắt đầu. Container queries xóa bỏ viewport breakpoints cho components — mỗi component tự định nghĩa ngưỡng của mình.

**💡 Interview Signal:**

- ✅ Strong: Frames it as "where does content break?" not "what devices exist?", mentions that 2–3 breakpoints is usually enough, and brings in container queries as making viewport breakpoints less relevant for component-level design
- ❌ Weak: Recites `320/768/1024/1440` values (shows memorized device sizes, not understanding)

---

### Q: How do you serve different images to mobile vs desktop? / Cách serve ảnh khác nhau cho mobile và desktop? 🟡 Mid

**A:** Three techniques, each for a different problem:

**1. `srcset` + `sizes` (resolution switching)** — same image, different sizes. Browser chooses. Best for performance optimization of the same content.

```html
<img
  src="/photo-800.jpg"
  srcset="/photo-400.jpg 400w, /photo-800.jpg 800w, /photo-1600.jpg 1600w"
  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 80vw, 1200px"
  alt="Product photo"
/>
```

**2. `<picture>` + `<source media>` (art direction)** — different crops/compositions per breakpoint. Browser must follow.

```html
<picture>
  <source media="(max-width: 767px)" srcset="/hero-portrait.avif" type="image/avif" />
  <source srcset="/hero-landscape.avif" type="image/avif" />
  <img src="/hero-landscape.jpg" alt="Hero" width="1920" height="1080" />
</picture>
```

**3. Server-side (adaptive)** — server detects UA and returns different image URL in HTML. Can use `next/image` with `sizes` prop (framework handles srcset generation) or CDN image transformation (Cloudinary, imgix).

Key distinction: `srcset` is a **hint** (browser may use cached larger image). `<picture>` is a **directive** (browser must follow). Server-side is deterministic but requires UA detection accuracy.

Vietnamese: Ba cách: (1) `srcset` + `sizes` — cùng ảnh khác size, browser tự chọn (hint, có thể ignore). (2) `<picture>` + `<source media>` — ảnh khác nhau hoàn toàn theo breakpoint, browser phải follow (directive). (3) Server-side — server detect UA, return đúng URL ngay. `srcset` = hint, `<picture>` = directive — đây là distinction quan trọng.

**💡 Interview Signal:**

- ✅ Strong: Distinguishes "hint" (srcset, browser can use cache) vs "directive" (`<picture>`, browser must follow), names all three techniques and their use cases, mentions CDN image services
- ❌ Weak: "Use srcset for different image sizes" (only knows technique 1, misses art direction and the hint vs directive distinction)

---

### Q: What is the iOS 16px input zoom issue? / Vấn đề iOS tự zoom khi input font < 16px? 🟢 Junior

**A:** iOS Safari automatically zooms the entire page when a user taps an `<input>`, `<select>`, or `<textarea>` that has a `font-size` smaller than **16px**. This is an iOS-specific behavior designed to make small text readable. But it creates a poor UX — the page zooms in, the user fills in the form, then has to zoom back out.

The fix: ensure all form inputs have `font-size: 16px` (or `1rem`) or larger.

```css
/* ✅ Prevent iOS auto-zoom on form inputs */
input,
select,
textarea {
  font-size: 16px; /* never below 16px on touch UI */
  font-size: max(16px, 1rem); /* respects user preferences, never below 16px */
}
```

If the design specifies visually smaller inputs (e.g., 14px), you can use `transform: scale()` to visually shrink them without changing the DOM font-size that iOS reads:

```css
input {
  font-size: 16px;
  transform: scale(0.875); /* visual: ~14px */
  transform-origin: left center;
}
```

Vietnamese: iOS Safari tự zoom trang khi input/select/textarea có `font-size` < 16px — để user đọc được text nhỏ. UX xấu: trang zoom in khi focus, phải zoom out sau khi điền. Fix: đảm bảo mọi form element có `font-size >= 16px`. Nếu design cần text nhỏ hơn, dùng `transform: scale()` để scale visual mà không thay đổi DOM font-size.

**💡 Interview Signal:**

- ✅ Strong: Knows the 16px threshold specifically, explains WHY iOS does this (trying to make small text readable), provides the `transform: scale()` workaround for design-specified smaller inputs
- ❌ Weak: "iOS zooms in on small inputs" (states the symptom without the threshold or the fix)

---

### Q: How does Google crawl a responsive vs adaptive site? / Google crawl responsive vs adaptive site như thế nào? 🔴 Senior

**A:** Since **2020, Google uses mobile-first indexing** — Googlebot Smartphone is the primary crawler. What this means practically:

**Responsive sites:**

- Googlebot receives the same HTML as all users (one URL)
- No canonical tag needed — single URL is authoritative
- Content is indexed from the mobile viewport render
- No risk of content mismatch between desktop and mobile index

**Adaptive sites — risks and requirements:**

- If server detects Googlebot's UA and serves different HTML, Google may index the mobile-stripped version
- If important content is only in the desktop template, it may not be indexed
- `m.example.com` sites MUST have `<link rel="canonical" href="https://example.com/page">` on every mobile page AND `<link rel="alternate" media="..." href="https://m.example.com/page">` on every desktop page
- If adaptive site blocks Googlebot Smartphone (misclassifying as "should get desktop"), Google may index the wrong version

**Best practice for adaptive:**

```html
<!-- On m.example.com/product/123 -->
<link rel="canonical" href="https://example.com/product/123" />

<!-- On example.com/product/123 -->
<link
  rel="alternate"
  media="only screen and (max-width: 640px)"
  href="https://m.example.com/product/123"
/>
```

Vietnamese: Từ 2020, Google dùng mobile-first indexing — Googlebot Smartphone là crawler chính. Responsive: một URL, không rủi ro, Google index mobile render. Adaptive: rủi ro nếu mobile version thiếu content hay block Googlebot. m.domain phải có canonical + alternate tags đúng. Nếu adaptive site không set đúng, Google index phiên bản sai hoặc thấy duplicate content.

**💡 Interview Signal:**

- ✅ Strong: Knows the 2020 mobile-first indexing switch, explains canonical + alternate tag requirements for m.domain, warns about Googlebot misclassification risk
- ❌ Weak: "Responsive is better for SEO because it's one URL" (correct but doesn't explain the mobile-first indexing mechanism or the canonical/alternate requirements for adaptive)

---

### Q: Walk me through making a data table responsive / Cách làm data table responsive? 🟡 Mid

**A:** Data tables are one of the hardest responsive challenges. No single solution fits all — choose by content and user needs:

**Option 1: Horizontal scroll (simplest, most faithful to data)**

```css
.table-wrapper {
  overflow-x: auto; /* scroll if table is wider than container */
  -webkit-overflow-scrolling: touch; /* momentum scrolling on iOS */
}

table {
  min-width: 40rem; /* don't let table collapse below readable width */
  width: 100%;
}
```

Best for: financial data, spreadsheet-like tables where all columns must be visible simultaneously.

**Option 2: Card layout — stack rows vertically on mobile**

```css
@media (max-width: 40rem) {
  /* Table becomes a list of "cards" */
  thead {
    display: none;
  } /* hide header row */

  tr {
    display: block;
    border: 1px solid var(--border);
    margin-bottom: 1rem;
    padding: 0.5rem;
  }

  td {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-light);
  }

  /* Show column name inline using data-label attribute */
  td::before {
    content: attr(data-label);
    font-weight: 600;
  }
}
```

```html
<tr>
  <td data-label="Name">Alice</td>
  <td data-label="Role">Engineer</td>
  <td data-label="Team">Platform</td>
</tr>
```

Best for: user lists, product catalogs where rows are independent records.

**Option 3: Priority+ — hide less-important columns, add "expand" toggle**
Show only critical columns on mobile; let user expand to see more. Best for complex analytics tables where all data isn't needed at once.

Vietnamese: 3 pattern cho responsive table: (1) Horizontal scroll — đơn giản nhất, giữ cấu trúc table, dùng `overflow-x: auto`. Tốt cho financial data. (2) Card layout — mỗi row thành card, dùng `data-label` + `::before` để hiện tên cột. Tốt cho user/product list. (3) Priority+ — hide cột không quan trọng, cho expand. Chọn pattern theo nội dung và cách user đọc data.

**💡 Interview Signal:**

- ✅ Strong: Knows multiple patterns and when to use each (not one-size-fits-all), shows the `data-label` + `::before` technique for card layout, mentions momentum scrolling on iOS
- ❌ Weak: "Use overflow-x: auto" (only knows option 1 — misses that card layout or priority+ may be better for the table's content type)

---

### Q: What's wrong with using `display: none` for mobile-hidden elements? / Vấn đề với `display: none` cho mobile? 🟡 Mid

**A:** `display: none` hides the element visually but **does not prevent it from being downloaded**. This creates three problems:

**1. Bandwidth waste**: A desktop hero image or carousel hidden on mobile with `display: none` still downloads — mobile users on 3G pay for assets they never see.

```css
/* ❌ Image still downloads on mobile */
.desktop-carousel {
  display: none;
}
@media (min-width: 64rem) {
  .desktop-carousel {
    display: block;
  }
}
```

**2. JS execution**: If a hidden element has inline scripts or JavaScript loads due to it being in the DOM, that code still runs — impacting Time to Interactive on mobile.

**3. Accessibility exposure**: Screen readers can still find elements with `display: none`... in older implementations they could. Today `display: none` does hide from AT correctly, but the pattern encourages other hides (`visibility: hidden`, `opacity: 0`) that don't.

**Fixes by scenario:**

```tsx
// Fix 1: Don't render server-side for mobile (RSC)
const isMobile = ua.includes('Mobile')
return !isMobile && <DesktopCarousel />

// Fix 2: Lazy load the component (only loads when visible)
const DesktopCarousel = dynamic(() => import('./DesktopCarousel'), {
  ssr: false,
})

// Fix 3: Native lazy loading for images
<img src="/desktop-hero.jpg" loading="lazy" alt="..." />
// loading="lazy" actually defers download (unlike display:none)
```

Vietnamese: `display: none` ẩn về visual nhưng không ngăn download. Ba vấn đề: (1) Lãng phí bandwidth — mobile vẫn download assets; (2) JS vẫn execute cho element ẩn; (3) Dễ nhầm với các cách hide khác không ẩn với AT. Fix: không render server-side cho mobile (RSC), dynamic import, hoặc `loading="lazy"` cho images (thực sự defer download).

**💡 Interview Signal:**

- ✅ Strong: Explains the download-still-happens mechanism clearly, distinguishes `display: none` (doesn't prevent download) from `loading="lazy"` (actually defers download), provides RSC and dynamic import as proper fixes
- ❌ Weak: "display:none hides content so users don't see it but it's still in the DOM" (states the mechanism but doesn't connect it to performance or propose fixes)

---

## Memory Hook / Mẹo Nhớ

> 🧠 **Responsive = nước tự đổ đầy bình (CSS tự co giãn, một codebase, browser quyết định). Adaptive = bồi bàn mang đĩa khác cho khách khác (server detect rồi serve version phù hợp). Thực tế 2026: layout responsive, assets và bundles adaptive.**

---

## Quick Recap / Tóm Tắt Nhanh

| Topic               | Key Point                                     | Điểm Then Chốt                               |
| ------------------- | --------------------------------------------- | -------------------------------------------- |
| Responsive          | Fluid single codebase, CSS media queries      | Một HTML, browser tự điều chỉnh              |
| Adaptive            | Multiple layouts, server/JS detection         | Server biết device trước khi respond         |
| When RWD            | 90%+ sites, SEO, small teams                  | Default choice                               |
| When AWD            | 3G-critical, fundamentally diff UX, POS       | Niche — 2026 mostly replaced by hybrid       |
| Mobile-first        | `min-width`, additive CSS                     | Cộng style, không override                   |
| Content breakpoints | Break where content breaks, not by device     | Content quyết định, không phải tên thiết bị  |
| Container queries   | Component responds to own container width     | Adaptive at component level, CSS-only        |
| display:none trap   | Hides visually; assets still download         | Không ngăn bandwidth — dùng lazy/RSC thay    |
| iOS 16px            | Input `font-size` < 16px triggers iOS zoom    | Luôn >= 16px cho form inputs                 |
| Adaptive + SEO      | Need canonical + alternate tags               | m.domain thiếu canonical = duplicate content |
| LCP image           | `fetchpriority="high"`, no `loading="lazy"`   | LCP element không lazy load                  |
| CLS prevention      | `width` + `height` + `aspect-ratio` on images | Reserve space trước khi ảnh load             |

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Responsive Design](./03-responsive-design.md) — fluid layout, media queries, mobile-first patterns
- ⬅️ **Built on:** [CSS Fundamentals](./00-css-fundamentals.md) — cascade, specificity, box model
- ➡️ **Enables:** [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — LCP and CLS directly affected by image strategy and layout shift prevention
- 🔗 **Related:** [Modern CSS Features](./06-modern-css-features.md) — container queries, `clamp()`, `dvh`
- 🔗 **Related:** [Grid & Flexbox](./01-grid-flexbox.md) — layout building blocks used in responsive patterns

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu Hỏi                              | Difficulty | Core Concept        | Key Signal                                         |
| --- | ------------------------------------ | ---------- | ------------------- | -------------------------------------------------- |
| 1   | Responsive vs adaptive?              | 🟡         | Definition          | Mechanism: CSS-side vs detection-side              |
| 2   | When choose adaptive?                | 🔴         | Trade-offs          | 3G bandwidth, fundamentally-diff UX, legacy        |
| 3   | Container queries change responsive? | 🔴         | Container queries   | Viewport vs container; component portability       |
| 4   | Mobile-first vs desktop-first?       | 🟡         | CSS cascade         | Additive (min-width) vs subtractive (max-width)    |
| 5   | How choose breakpoints?              | 🟡         | Breakpoint strategy | Content-based, not device-based                    |
| 6   | Different images for mobile/desktop? | 🟡         | Responsive images   | srcset = hint; picture = directive                 |
| 7   | iOS 16px input zoom?                 | 🟢         | Mobile UX           | font-size < 16px triggers iOS auto-zoom            |
| 8   | Google crawl responsive vs adaptive? | 🔴         | SEO                 | Mobile-first indexing 2020; canonical for m.domain |
| 9   | Make data table responsive?          | 🟡         | Responsive patterns | 3 patterns — choose by content type                |
| 10  | display:none for mobile?             | 🟡         | Performance         | Hides visually, assets still download              |

---

🔁 **Spaced Repetition reminder:** Review sau 3 ngày, 7 ngày, 14 ngày.
