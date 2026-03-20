# Responsive Design for Modern Web / Thiết Kế Responsive Cho Web Hiện Đại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build một trang web đẹp trên laptop. Designer hài lòng. Nhưng 60% users của bạn dùng điện thoại — và trên mobile, text nhỏ xíu, buttons không thể tap được, và horizontal scroll xuất hiện.

**Vấn đề thực tế:**
- 60% web traffic là mobile (Google Analytics data)
- Google dùng mobile-first indexing — site không responsive = SEO kém
- Thiết kế "desktop first" rồi thu nhỏ khó hơn nhiều so với "mobile first" rồi mở rộng

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Nước trong bình:**
Responsive design giống như nước: cùng nội dung, nhưng tự điều chỉnh theo hình dạng container (screen size). Một cột trên mobile, ba cột trên desktop — cùng một HTML, CSS khác nhau.

**Mobile-first vs Desktop-first:**

| Approach | Cách làm | Khi nào |
|----------|----------|---------|
| **Mobile-first** | Viết CSS cho mobile trước, dùng `min-width` media query để thêm desktop style | Recommended — progressive enhancement |
| **Desktop-first** | Viết CSS cho desktop trước, dùng `max-width` để override cho mobile | Legacy approach — graceful degradation |

**Core tools:**
- **Media Queries:** `@media (min-width: 768px)` — apply CSS tại breakpoints
- **Flexible units:** `%`, `vw`, `vh`, `rem`, `em` thay vì `px` cố định
- **CSS Grid `auto-fit`:** `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` — tự động responsive không cần media query
- **Viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1">` — bắt buộc cho mobile

---

## Concept Map / Bản Đồ Khái Niệm

```
      [CSS Fundamentals + Flexbox/Grid]
              │
              ▼
     [RESPONSIVE DESIGN]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[Viewport] [Media]  [Fluid]
meta tag   Queries  Units
           min/max  rem/em
           width    vw/vh/%
           prefers- clamp()
           -scheme
    │
    ▼
[Mobile-first workflow]
Base CSS (mobile) → tablet breakpoint → desktop breakpoint
    │
    ▼
[Advanced Responsive]
Container queries | CSS Grid auto-fit | Fluid typography
clamp(min, preferred, max) | aspect-ratio | fit-content
```

---

## Overview

Responsive design không chỉ là media query.
Đó là chiến lược phân phối trải nghiệm nhất quán trên nhiều kích thước màn hình, density, input mode và điều kiện mạng.

### Overview / Tổng Quan
- Chủ đề chính: media queries, mobile-first, fluid typography, responsive images, container queries, patterns.
- Mục tiêu phỏng vấn: hiểu nguyên lý, trade-off và chiến lược testing.
- Tỷ lệ nội dung: ưu tiên theory, thêm code minh hoạ ngắn, thực dụng.

### Explanation / Giải thích
Thiết kế responsive tốt cần cân bằng giữa readability, performance, accessibility và khả năng maintain của codebase.
Các quyết định không chỉ theo viewport width mà còn theo nội dung, context và user intent.

### Example / Ví dụ
Một dashboard có thể hiển thị 4 cột trên desktop, 2 cột trên tablet và 1 cột trên mobile.
Nhưng nếu bảng dữ liệu dài, responsive tốt còn cần pattern như priority+ hoặc horizontal scroll có chủ đích.

## Media Queries / Truy Vấn Media

### Overview / Tổng Quan
Media query cho phép áp style theo đặc tính thiết bị/viewport.

### Explanation / Giải thích
Thường dùng:
- `min-width` (mobile-first)
- `max-width` (desktop-first)
- `prefers-color-scheme`, `prefers-reduced-motion`
- `hover`, `pointer`

### Example / Ví dụ
```css
.card-list { grid-template-columns: 1fr; }

@media (min-width: 48rem) {
  .card-list { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 64rem) {
  .card-list { grid-template-columns: repeat(3, 1fr); }
}
```

## Mobile-First vs Desktop-First

### Overview / Tổng Quan
Mobile-first bắt đầu từ layout nhỏ nhất rồi tăng dần.
Desktop-first bắt đầu từ layout lớn rồi thu gọn.

### Explanation / Giải thích
- Mobile-first thường dẫn tới CSS gọn hơn và progressive enhancement tốt.
- Desktop-first có thể phù hợp khi sản phẩm chủ yếu enterprise desktop.
- Trong phỏng vấn, cần nhấn mạnh "context-driven", không tuyệt đối hoá.

### Example / Ví dụ
Mobile-first giúp tránh override ngược phức tạp vì base style đã tối giản.

## Fluid Typography / Chữ Linh Hoạt

### Overview / Tổng Quan
Typography linh hoạt giúp văn bản cân bằng giữa thiết bị nhỏ và lớn.

### Explanation / Giải thích
Sử dụng `clamp(min, preferred, max)` để scale mượt thay vì nhảy bậc cứng.

### Example / Ví dụ
```css
:root {
  --step-0: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
  --step-1: clamp(1.25rem, 1.1rem + 0.8vw, 1.8rem);
}

h1 { font-size: var(--step-1); }
p { font-size: var(--step-0); }
```

## Responsive Images (srcset, picture)

### Overview / Tổng Quan
Ảnh responsive giảm tải mạng và tăng chất lượng hiển thị theo thiết bị.

### Explanation / Giải thích
- `srcset` + `sizes`: trình duyệt chọn ảnh phù hợp.
- `<picture>`: thay source theo breakpoint/format.
- Kết hợp lazy loading và dimension rõ để giảm CLS.

### Example / Ví dụ
```html
<picture>
  <source media="(min-width: 64rem)" srcset="/hero-large.avif" type="image/avif" />
  <source media="(min-width: 40rem)" srcset="/hero-medium.webp" type="image/webp" />
  <img src="/hero-small.jpg" alt="Interview roadmap" width="1200" height="630" loading="lazy" />
</picture>
```

## Viewport Units and Modern Units

### Overview / Tổng Quan
Viewport units mới (`svh`, `lvh`, `dvh`) giải quyết vấn đề thanh địa chỉ mobile.

### Explanation / Giải thích
- `vh` truyền thống có thể gây layout jump trên mobile browser.
- `dvh` phản ánh viewport động hiện tại.
- Dùng fallback phù hợp để tương thích trình duyệt.

### Example / Ví dụ
```css
.fullscreen {
  min-height: 100vh;
  min-height: 100dvh;
}
```

## Container Queries

### Overview / Tổng Quan
Container queries cho phép component tự responsive theo kích thước container, không phụ thuộc viewport toàn cục.

### Explanation / Giải thích
Đây là bước tiến lớn cho component-driven architecture.
Component có thể tái sử dụng ở sidebar, main content, modal mà vẫn thích nghi tốt.

### Example / Ví dụ
```css
.card-grid-wrapper { container-type: inline-size; }

@container (min-width: 36rem) {
  .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

## Responsive Layouts with Flexbox and Grid

### Overview / Tổng Quan
Flexbox mạnh cho layout một chiều; Grid mạnh cho layout hai chiều.

### Explanation / Giải thích
Trong responsive:
- Flexbox tốt cho nav, action group, alignment động.
- Grid tốt cho dashboard, gallery, card system.
- Kết hợp cả hai thường là lựa chọn tốt nhất.

### Example / Ví dụ
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 64rem) {
  .layout {
    grid-template-columns: 16rem 1fr;
  }
}
```

## Breakpoint Strategy

### Overview / Tổng Quan
Breakpoint nên dựa trên content breakpoints thay vì tên thiết bị cứng.

### Explanation / Giải thích
Đặt breakpoint tại điểm UI "vỡ".
Đừng chase theo danh sách device đang bán trên thị trường.

### Example / Ví dụ
- `40rem`: card từ 1 cột lên 2 cột.
- `64rem`: thêm sidebar cố định.
- `80rem`: tăng whitespace và max-width.

## Responsive Patterns (Off-canvas, Priority+)

### Off-canvas
#### Overview / Tổng Quan
Ẩn navigation phụ ngoài màn hình nhỏ và mở bằng toggle.

#### Explanation / Giải thích
Phù hợp mobile khi không gian hạn chế.
Cần keyboard navigation và focus management tốt.

#### Example / Ví dụ
Menu filter e-commerce trượt từ trái vào trên mobile.

### Priority+
#### Overview / Tổng Quan
Giữ action quan trọng hiển thị, đẩy action phụ vào menu overflow.

#### Explanation / Giải thích
Pattern này giúp top bar không quá tải ở màn hình nhỏ.

#### Example / Ví dụ
Nav có `Home`, `Practice`, `Mock` hiển thị cố định; mục phụ vào "More".

## Responsive Testing Strategy

### Overview / Tổng Quan
Testing responsive gồm manual + automation + visual regression.

### Explanation / Giải thích
- Kiểm thử trên breakpoint chính và "in-between".
- Test orientation change.
- Test zoom 200% cho accessibility.
- Test trên network chậm để đánh giá perceived performance.

### Example / Ví dụ
Checklist smoke test:
1. Không có text bị cắt.
2. Không có nút quá nhỏ.
3. Không có horizontal scroll không chủ đích.
4. Tất cả modal/menu vẫn usable bằng keyboard.

## Accessibility in Responsive Design

### Overview / Tổng Quan
Responsive đúng phải bao gồm accessibility.

### Explanation / Giải thích
- Touch target đủ lớn (khoảng 44x44 CSS px).
- Không khoá user zoom.
- Layout phải giữ thứ tự logic cho screen reader.
- Tôn trọng `prefers-reduced-motion`.

### Example / Ví dụ
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

## Related References / Tài Liệu Liên Quan
- [Grid & Flexbox Fundamentals](./01-grid-flexbox.md)
- [Modern CSS Features](./06-modern-css-features.md)

## Core Concepts Overview / Tổng Quan Khái Niệm

### 1. Mobile-First Strategy

> 🧠 **Memory Hook**: "Mobile-first = write the small version first, then EXPAND. Desktop-first = write the big version first, then SHRINK. Shrinking is harder — you end up hiding content, not redesigning."

```
Mobile-first (min-width):        Desktop-first (max-width):
Base CSS = mobile                Base CSS = desktop
  ↓ add styles as screen grows     ↓ override styles as screen shrinks
@media (min-width: 48rem) {}     @media (max-width: 48rem) {}
@media (min-width: 64rem) {}     @media (max-width: 64rem) {}
Progressive ENHANCEMENT          Graceful DEGRADATION
```

**Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Breakpoints by device names (iPhone, iPad) | Devices change constantly | Set breakpoints where content breaks |
| `display: none` to hide content on mobile | Content still loaded, just hidden — performance cost | Don't ship the content if mobile doesn't need it |
| Locking zoom with `user-scalable=no` | Prevents accessibility users from zooming | Never disable zoom — it's an accessibility requirement |

**🎯 Interview Pattern:**
- Khi thấy: "Why is your site slow on mobile?" or "How would you redesign this for mobile?"
- → Think: Mobile-first audit: what content is essential? what loads but stays hidden?
- → Answer opens with: "I'd start with a content audit — decide what's essential on mobile, then use mobile-first CSS with `min-width` media queries to progressively enhance for larger screens."

---

### 2. Fluid Layout (No Media Queries)

> 🧠 **Memory Hook**: "clamp(min, preferred, max) = 'at least min, at most max, ideally preferred'. Three numbers, no media queries."

```css
/* Fluid typography — scales between 1rem and 1.5rem */
font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);

/* Fluid spacing */
padding: clamp(1rem, 3vw, 3rem);

/* Responsive grid — no breakpoints needed */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

**Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using `vh` for full-height elements on mobile | Browser chrome (address bar) isn't included in `vh` → layout jumps | Use `dvh` (dynamic viewport height) |
| Fixed `px` breakpoints (768px, 1024px) | Maps to specific devices, not content needs | Use `rem`-based breakpoints (48rem, 64rem) that respect font size |

---

### 3. Container Queries vs Media Queries

> 🧠 **Memory Hook**: "Media query = 'how wide is the WINDOW?' Container query = 'how wide is MY BOX?' Component doesn't care about the window."

```
Media query problem:
  Card component in sidebar (300px wide) → needs 1-column layout
  Same card in main (800px wide) → could use 2-column layout
  But @media(min-width: 600px) applies to BOTH the same way! ❌

Container query solution:
  .card-wrapper { container-type: inline-size; }
  @container (min-width: 400px) { .card { /* 2-column */ } }
  → Each card responds to its OWN container width ✅
```

**🔑 Knowledge Chain:**
- 📚 Cần biết: [CSS Grid & Flexbox](./01-grid-flexbox.md) — layout building blocks
- ➡️ Để hiểu: [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — responsive images affect CLS/LCP

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: Why is mobile-first CSS recommended? / Tại sao CSS mobile-first được khuyến nghị? 🟢 Junior

**A:** Mobile-first CSS uses `min-width` media queries. The base CSS styles the smallest viewport (mobile), then additional layers add styles as the screen grows. This approach has three advantages: (1) forces you to prioritize content — if it's not needed on mobile, it probably doesn't need to be loaded at all; (2) produces simpler CSS — you add styles for larger screens rather than overriding desktop styles for mobile; (3) aligns with browser behavior — browsers download all CSS, but mobile-first means mobile devices parse less style override work.

Vietnamese: Mobile-first dùng `min-width` media query. Base CSS là mobile, mở rộng khi màn hình lớn hơn. Ưu điểm: ép buộc ưu tiên content (nếu không cần ở mobile, có thể không cần load), CSS gọn hơn (thêm styles thay vì override), và Google mobile-first indexing ưu tiên mobile version. Nhược điểm thực tế: nhiều dự án enterprise vẫn dùng desktop-first vì workflow của designer.

```css
/* Mobile-first: base is mobile */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 column on mobile */
  gap: 1rem;
}

/* Tablet: enhance */
@media (min-width: 48rem) { /* 768px */
  .card-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: enhance further */
@media (min-width: 64rem) { /* 1024px */
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
```

**💡 Interview Signal:**
- ✅ Strong: Explains CSS specificity stays clean (additive, not subtractive), mentions the content prioritization forcing function, and knows `min-width` = mobile-first while `max-width` = desktop-first
- ❌ Weak: "Mobile-first is best practice" (states the rule without explaining why the additive approach is better than the subtractive approach)

---

### Q: What is the difference between `srcset` and `<picture>`? / Sự khác biệt giữa srcset và picture? 🟢 Junior

**A:** Both handle responsive images but for different purposes:

- **`srcset` on `<img>`** is for **resolution switching** — serving the same image at different sizes. The browser chooses based on screen density and the `sizes` attribute. It's just a hint — the browser may use a cached larger image.
- **`<picture>` with `<source>`** is for **art direction** — serving different images at different breakpoints (not just different sizes). The browser follows the rules exactly (not a hint). Use it when you need a cropped portrait on mobile and landscape on desktop, or different formats (AVIF on modern browsers, JPEG fallback).

Vietnamese: `srcset` = gợi ý cho browser về độ phân giải — cùng ảnh, size khác nhau, browser quyết định. `<picture>` = art direction — ảnh khác nhau hoàn toàn theo breakpoint hoặc format, browser phải follow. Dùng `srcset` cho responsive size, dùng `<picture>` khi cần crop khác nhau hay AVIF/WebP fallback.

```html
<!-- srcset: resolution switching (browser chooses) -->
<img src="photo-800.jpg"
     srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
     sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
     alt="Product photo" loading="lazy" />

<!-- picture: art direction (browser must follow) -->
<picture>
  <source media="(max-width: 600px)" srcset="hero-portrait.avif" type="image/avif" />
  <source media="(max-width: 600px)" srcset="hero-portrait.webp" type="image/webp" />
  <source srcset="hero-landscape.avif" type="image/avif" />
  <img src="hero-landscape.jpg" alt="Hero image" width="1200" height="630" />
</picture>
```

**💡 Interview Signal:**
- ✅ Strong: Distinguishes "hint" (srcset, browser can ignore) vs "directive" (`<picture>`, browser must follow), explains `sizes` attribute tells browser how wide the image will render at each breakpoint, knows AVIF > WebP > JPEG for compression
- ❌ Weak: "srcset provides multiple image sizes, picture lets you switch images" (correct but misses the critical detail: srcset is a hint, picture is a directive — this distinction matters for correctness)

---

### Q: How do container queries differ from media queries? / Container queries khác media queries như thế nào? 🟡 Mid

**A:** Media queries respond to the **viewport** width. Container queries respond to the **element's container** width. This distinction matters for reusable components.

Problem with media queries for components: a card component in a 300px sidebar looks different than the same card in an 800px main content area — but `@media (min-width: 600px)` applies the same to both because it only knows viewport width, not the card's actual available space.

Container queries solve this: the card responds to its own container. The same component adapts correctly whether it's in a narrow sidebar or a wide main area, making it truly portable.

Vietnamese: Media query = cửa sổ trình duyệt bao nhiêu? Container query = box chứa component bao nhiêu? Component card trong sidebar 300px và trong main 800px sẽ khác nhau với container query, nhưng giống nhau với media query. Container query giúp component thực sự tái sử dụng được.

```css
/* Step 1: Mark the container */
.card-wrapper {
  container-type: inline-size;
  container-name: card; /* optional named container */
}

/* Step 2: Query the container, not the viewport */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr; /* image + text side by side */
  }
}

/* Media query would be wrong here: */
/* @media (min-width: 400px) applies when viewport ≥ 400px, */
/* regardless of whether the card's container is 200px or 800px */
```

**💡 Interview Signal:**
- ✅ Strong: Explains the concrete problem (same component in sidebar vs main area) that media queries can't solve, knows `container-type: inline-size` syntax, mentions wide browser support since 2023
- ❌ Weak: "Container queries respond to the container size" (definition only — the signal is explaining WHY this matters: component portability and the failure mode of media queries for reusable components)

---

### Q: How does `clamp()` work for fluid typography? / clamp() dùng cho fluid typography như thế nào? 🟡 Mid

**A:** `clamp(min, preferred, max)` sets a value that scales fluidly but is bounded. For typography: `clamp(1rem, 0.9rem + 0.5vw, 1.5rem)` means "font size is 0.9rem + 0.5% of viewport width, but never less than 1rem or more than 1.5rem." This eliminates the need for font-size media queries.

The `preferred` value should be a viewport-relative expression. The formula `0.9rem + 0.5vw` means: at a 320px viewport, font = 0.9 + (320×0.005) = 0.9 + 1.6 = roughly 14.5px; at 1440px viewport, font = 0.9×16 + (1440×0.005) = 14.4 + 7.2 = 21.6px → clamped to 1.5rem = 24px.

Vietnamese: `clamp(min, preferred, max)`: giá trị scale theo viewport nhưng bị giới hạn. Preferred thường là `rem + vw` combination. Ưu điểm: không cần media query cho font-size, scale mượt thay vì nhảy bậc. Dùng CSS custom properties để tạo type scale có thể tái sử dụng.

```css
:root {
  /* Type scale using clamp */
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.2vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.4vw, 1.25rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.6vw, 1.5rem);
  --text-xl:   clamp(1.25rem,  1rem    + 1vw,   2rem);
  --text-2xl:  clamp(1.5rem,   1rem    + 2vw,   3rem);
}

body  { font-size: var(--text-base); }
h1    { font-size: var(--text-2xl); }
h2    { font-size: var(--text-xl); }
small { font-size: var(--text-sm); }

/* Fluid spacing */
.section { padding: clamp(2rem, 5vw, 6rem); }
```

**💡 Interview Signal:**
- ✅ Strong: Explains the three-argument structure with why each bound matters (min prevents too-small on small screens, max prevents too-large on huge screens), uses CSS custom properties for a systematic type scale, and extends `clamp()` to spacing
- ❌ Weak: "clamp takes three values: min, preferred, max" (knows the syntax but doesn't show the formula for calculating viewport-relative preferred value or the practical elimination of font-size media queries)

---

### Q: What are `dvh`, `svh`, `lvh` and when do you use them? / Các đơn vị viewport height mới và khi nào dùng? 🟡 Mid

**A:** Traditional `vh` (viewport height) is calculated when the page loads and does not account for dynamic browser UI like the address bar on mobile. When the address bar shows/hides as you scroll, `100vh` elements jump in size. Modern units fix this:

- **`svh` (small viewport height)**: the viewport height when browser UI is fully visible (minimum available space). Use for elements that should never be hidden by UI chrome.
- **`lvh` (large viewport height)**: the viewport height when browser UI is fully retracted (maximum available space). Use when you want to fill the screen when fully scrolled.
- **`dvh` (dynamic viewport height)**: updates in real-time as browser UI shows/hides. Use for elements that should always fill the visible viewport (e.g., modals, sticky headers with content below).

Vietnamese: `vh` truyền thống không update khi address bar mobile show/hide → layout jump. `svh` = khi UI đang hiện (nhỏ nhất, an toàn nhất). `lvh` = khi UI đã ẩn (lớn nhất). `dvh` = dynamic, cập nhật theo thời gian thực. Dùng `dvh` cho modal/fullscreen overlay, `svh` cho full-height page sections.

```css
/* Old: jumps when mobile address bar hides */
.hero { min-height: 100vh; }

/* Modern: always fills the current visible viewport */
.hero {
  min-height: 100vh;    /* fallback for older browsers */
  min-height: 100dvh;   /* dynamic — updates with browser UI */
}

/* Sticky sidebar that fits the visible window */
.sidebar {
  height: 100svh;   /* safe minimum — never clips under address bar */
  position: sticky;
  top: 0;
}
```

**💡 Interview Signal:**
- ✅ Strong: Explains the jumping bug with `vh` on mobile (address bar show/hide), distinguishes all three new units with their specific use cases, and provides the `100vh` fallback + `100dvh` override pattern for browser compatibility
- ❌ Weak: "Use dvh instead of vh on mobile" (correct but doesn't explain WHY vh is broken or when each of the three new units is appropriate)

---

### Q: What are common responsive anti-patterns? / Các anti-pattern phổ biến trong responsive design? 🔴 Senior

**A:** The most impactful responsive anti-patterns:

1. **Hiding content with `display: none`**: The content is still downloaded. On mobile with 3G, you're wasting bandwidth on content users never see. Solution: use lazy loading, code splitting, or simply don't render the content server-side for mobile.

2. **Fixed height on containers**: `height: 300px` causes overflow on small screens. Use `min-height` instead, or let the container grow with content.

3. **Using `user-scalable=no` or `maximum-scale=1`**: Disables zoom for accessibility users (people with low vision). Always allow zoom. This is a WCAG 1.4.4 violation.

4. **Desktop-first with complex overrides**: Leads to CSS like `@media (max-width: 768px) { /* reset 20 desktop properties */ }`. Mobile-first avoids this by building up rather than tearing down.

5. **Images without `width` and `height` attributes**: Browser doesn't know image dimensions before load → Cumulative Layout Shift (CLS) → poor Core Web Vitals score.

6. **Tap targets smaller than 44×44px**: WCAG 2.5.8 requires minimum 24×24px target size (44×44 recommended). Buttons and links that are too small fail on touch devices.

Vietnamese: Anti-patterns phổ biến:
1. `display: none` ≠ không load — vẫn tốn bandwidth
2. Height cố định → overflow ở màn nhỏ, dùng `min-height`
3. `user-scalable=no` → vi phạm WCAG, ảnh hưởng người mắt kém
4. Desktop-first với many overrides → CSS phức tạp, khó maintain
5. Ảnh không có width/height → CLS score xấu
6. Touch target nhỏ hơn 44px → fail WCAG, khó tap trên mobile

**💡 Interview Signal:**
- ✅ Strong: Specifically calls out `display: none` performance trap (still downloads), WCAG violation of disabling zoom, and images without dimensions as a CLS cause — these are the traps junior developers walk into
- ❌ Weak: "Make sure buttons are big enough on mobile and test at different screen sizes" (too generic — senior answer names specific violations with technical mechanisms)

---

### Q: How do you approach a responsive design audit for a production site? / Cách audit responsive design cho production site? 🔴 Senior

**A:** A systematic responsive audit covers five layers:

1. **Viewport foundation**: Is the viewport meta tag present and correct? Are `vh` units replaced with `dvh`? Is zoom enabled?
2. **Layout integrity**: Check every breakpoint — no horizontal scroll, no text overflow, no fixed heights causing content clipping. Use Chrome DevTools responsive mode and test real devices.
3. **Images**: Do all images have `width`/`height` attributes? Are responsive images using `srcset`/`<picture>`? Is there a `fetchpriority="high"` on the LCP image?
4. **Typography**: Are font sizes using `rem` (respects user browser preferences)? Is fluid typography (`clamp()`) or breakpoint-based type scale used?
5. **Accessibility**: Touch targets ≥ 44px? `prefers-reduced-motion` respected? Color contrast passes at all viewport sizes? Screen reader order matches visual order?

Tools: Lighthouse (CLS/LCP/a11y), Chrome Accessibility Inspector, BrowserStack for real device testing.

Vietnamese: Audit responsive có 5 tầng: viewport meta tag, layout integrity ở mọi breakpoint, responsive images (srcset + fetchpriority), typography với rem/clamp, và accessibility (touch target, motion, contrast). Tool: Lighthouse, Chrome DevTools device emulation, BrowserStack cho real devices.

**💡 Interview Signal:**
- ✅ Strong: Structures the audit systematically (not "check all breakpoints"), specifically mentions CLS from missing image dimensions and fetchpriority for LCP, connects responsive to accessibility (touch targets, prefers-reduced-motion, tab order)
- ❌ Weak: "I'd test on different screen sizes and fix anything that looks broken" (no systematic approach — senior answers have a methodology, not just "look at things")

---

## Quick Recap

| Topic | Key Point | Điểm then chốt |
|-------|-----------|-----------------|
| Mobile-first | `min-width` queries, additive CSS | Thêm style, không override |
| Breakpoints | Content-based, not device names | Đặt khi content bị "vỡ" |
| Fluid typography | `clamp(min, preferred+vw, max)` | Scale mượt, không media query |
| Container queries | Respond to container, not viewport | Component portable mọi layout |
| `dvh` | Dynamic viewport height (fixes `vh` mobile bug) | Dùng cho fullscreen elements |
| `srcset` | Resolution switching (hint to browser) | Browser có thể ignore |
| `<picture>` | Art direction (directive to browser) | Browser phải follow |
| Anti-patterns | `display:none` waste bandwidth; `user-scalable=no` WCAG violation | Không hide content, không lock zoom |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Our mobile bounce rate is 70%. The same page on desktop is 25%. How do you diagnose and fix this?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "I'd start with data: Lighthouse mobile audit for Core Web Vitals — specifically LCP (is content loading fast?), CLS (is layout jumping?), and TBT/FID (is the main thread blocked?)"
2. "Then a visual audit at 320px — check for horizontal scroll (overflow), text overflow, buttons too small to tap (< 44px), and images without width/height causing layout shift."
3. "Then check network: are we loading desktop assets on mobile? `display: none` hides elements but doesn't prevent download — if the desktop hero image is 2MB, mobile users wait for it anyway."
4. "Fix priority: images first (srcset + compression), then render-blocking scripts (defer), then layout fixes (dvh, min-height), then consider mobile-specific UX decisions like off-canvas nav."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết từ trí nhớ CSS cho mobile-first card grid với 3 breakpoints — `grid-template-columns` cho mỗi breakpoint — không nhìn lại.
- [ ] **Visual**: Vẽ diagram cho `clamp(1rem, 0.9rem + 0.5vw, 1.5rem)` — giá trị tại 320px viewport và tại 1440px viewport là bao nhiêu?
- [ ] **Application**: Component card hiển thị đúng ở viewport 800px nhưng sai ở sidebar 300px dù cùng viewport. Cách fix?
- [ ] **Debug**: `position: fixed` modal không full height trên mobile iPhone, bị cắt bởi address bar. Nguyên nhân? Fix?
- [ ] **Teach**: Giải thích `container queries` cho một backend developer chưa biết CSS hiện đại — tại sao media queries không đủ cho component có thể tái sử dụng?

💬 **Feynman Prompt:** Giải thích "mobile-first design" cho một backend developer. Tại sao bắt đầu từ màn hình nhỏ nhất lại dễ hơn là bắt đầu từ desktop rồi thu nhỏ?

🔁 **Spaced Repetition reminder:** Review file này lại sau 3 ngày, sau đó 7 ngày, sau đó 14 ngày.

---

## Summary / Tóm Tắt

Responsive design chất lượng cao là sự kết hợp của layout, content strategy, performance và accessibility.
Trong phỏng vấn, hãy thể hiện bạn biết chọn pattern theo context thay vì áp dụng công thức cứng.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [CSS Fundamentals](./00-css-fundamentals.md) | [Grid & Flexbox](./01-grid-flexbox.md) — responsive design builds on layout tools
- ➡️ **Enables:** [Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) — CLS và LCP bị ảnh hưởng bởi responsive images và layout
- 🔗 **Tools:** Tailwind CSS breakpoints | Bootstrap grid | CSS Container Queries (modern)
