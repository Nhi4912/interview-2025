# Modern CSS Features / Tính năng CSS hiện đại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Grid & Flexbox](./01-grid-flexbox.md) | [CSS Architecture Theory](./07-css-architecture-theory.md) | [CSS Fundamentals](./00-css-fundamentals.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What are CSS Container Queries and how do they differ from media queries? / Container Queries khác media queries thế nào? 🟡 Mid

**A:** Media queries respond to the **viewport** size. Container queries respond to the **parent container's** size. This is a fundamental shift for component-based design: a card component can adapt its layout based on where it is placed (sidebar vs main content) without knowing about the viewport.

To use container queries: (1) declare a containment context on the parent with `container-type: inline-size`, (2) query the container's size with `@container`.

Vietnamese: Media queries dựa vào viewport (toàn trang). Container queries dựa vào size của parent container. Ưu điểm lớn: component tự adapt theo context đặt vào, không cần biết viewport size. Ví dụ: card component trong sidebar sẽ hiện layout khác so với trong main content, tự động. Đây là bước tiến lớn cho component-based architecture.

```css
/* 1. Declare containment context */
.card-container {
  container-type: inline-size;
  container-name: card-wrapper; /* optional: name for targeting */
}

/* 2. Query the container */
@container card-wrapper (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 1rem;
  }
}

@container card-wrapper (min-width: 700px) {
  .card {
    grid-template-columns: 200px 1fr auto;
  }
}

/* Without name: queries nearest ancestor with container-type */
@container (max-width: 300px) {
  .card { flex-direction: column; }
}
```

---

### Q: How does native CSS nesting work? / CSS nesting native hoạt động ra sao? 🟡 Mid

**A:** Native CSS nesting (shipped in all major browsers since 2023) allows writing child selectors inside parent rules, similar to Sass/Less but without a preprocessor.

Rules: use `&` to reference the parent selector. For type selectors (like `p`, `h2`), you must use `&` explicitly (e.g., `& p {}`) or use the `@nest` at-rule. The `&` can appear anywhere in the selector, enabling modifiers, pseudo-classes, and parent selectors.

Vietnamese: CSS nesting cho phép viết child selectors bên trong parent rule, giống Sass nhưng native trong browser. Dùng `&` để tham chiếu parent selector. Với type selector (p, h2) phải dùng `& p` (có `&` ở trước). `&` có thể đặt bất kỳ đâu trong selector. Lưu ý: nesting quá sâu (3+ levels) vẫn gây vấn đề maintainability giống Sass.

```css
.card {
  padding: 1rem;
  border: 1px solid #ddd;

  /* Nested child selector */
  & .title {
    font-size: 1.25rem;
    font-weight: 700;
  }

  /* Pseudo-class */
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* Modifier (BEM-like) */
  &--featured {
    border-color: gold;
  }

  /* Media query */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  /* Parent context: .dark-theme .card */
  .dark-theme & {
    background: #333;
    color: #fff;
  }
}
```

---

### Q: What are Cascade Layers and how do they help manage specificity? / Cascade Layers giải quyết vấn đề specificity thế nào? 🔴 Senior

**A:** `@layer` introduces a new level in the cascade between origin and specificity. You declare layers in order, and **later layers have higher priority** regardless of selector specificity within each layer. Styles outside any layer (unlayered) always beat layered styles.

This solves the specificity wars problem: third-party CSS (reset, framework) can be placed in a low-priority layer, and your component styles always win without needing `!important` or higher-specificity selectors.

Vietnamese: `@layer` thêm một tầng mới trong cascade giữa origin và specificity. Layer sau có priority cao hơn, **bất kể specificity** của selectors bên trong. Style ngoài layer luôn thắng style trong layer. Giải quyết vấn đề specificity wars: đặt reset/framework CSS vào layer thấp, component styles luôn thắng mà không cần `!important`.

```css
/* Declare layer order (first = lowest priority) */
@layer reset, base, components, utilities;

/* Reset layer: lowest priority */
@layer reset {
  * { margin: 0; box-sizing: border-box; }
  /* Even #id selectors here lose to .class in higher layers */
}

/* Base layer */
@layer base {
  body { font-family: system-ui; line-height: 1.5; }
  a { color: var(--link-color); }
}

/* Components layer: higher than base */
@layer components {
  .btn { padding: 0.5rem 1rem; border-radius: 4px; }
  .card { border: 1px solid #ddd; }
}

/* Utilities: highest named layer */
@layer utilities {
  .hidden { display: none; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; }
}

/* Unlayered styles: always beat ALL layers */
.emergency-fix { color: red; }

/* Import third-party CSS into a layer */
@import url('tailwind.css') layer(framework);
```

---

### Q: How does the :has() selector work and what can you build with it? / :has() selector hoạt động thế nào? 🟡 Mid

**A:** `:has()` is a relational pseudo-class that selects an element based on its **descendants or siblings**. It is sometimes called the "parent selector" because it lets you style a parent based on its children -- something CSS could never do before.

`:has()` accepts any valid selector list as its argument. It checks if the element has any matching descendants (or siblings with `+`/`~` combinators).

Vietnamese: `:has()` cho phép style element dựa trên children/siblings -- điều CSS trước đây không thể làm. Gọi là "parent selector" vì có thể style parent dựa trên child. Ví dụ: form group có input invalid thì border đỏ, card có image thì layout khác. Rất powerful nhưng cần cẩn thận performance trên DOM lớn.

```css
/* Style form group when it contains invalid input */
.form-group:has(:invalid) {
  border-left: 3px solid red;
}

/* Card with image gets horizontal layout */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Card without image stays vertical */
.card:not(:has(img)) {
  display: flex;
  flex-direction: column;
}

/* Style label when its adjacent input is focused */
label:has(+ input:focus) {
  color: blue;
  font-weight: bold;
}

/* Page-level styling based on content */
body:has(.modal.open) {
  overflow: hidden; /* Prevent scroll when modal is open */
}

/* Select previous sibling (!) -- :has() with ~ combinator */
.item:has(~ .item:hover) {
  opacity: 0.5; /* Dim items before the hovered one */
}
```

---

### Q: What is CSS Subgrid and what problems does it solve? / Subgrid giải quyết vấn đề gì? 🟡 Mid

**A:** Subgrid allows a nested grid item to inherit its parent grid's track lines for one or both axes. Without subgrid, nested grids create independent track sizing, breaking alignment between siblings.

Classic problem: a row of cards where each card has a title, description, and footer. Without subgrid, the title height varies per card, making descriptions start at different positions. With subgrid, all titles align horizontally because they share the parent's row tracks.

Vietnamese: Subgrid cho nested grid thừa kế track lines từ parent grid. Vấn đề kinh điển: row cards mỗi card có title/content/footer -- không subgrid thì title height khác nhau, nội dung bắt đầu ở vị trí khác nhau giữa cards. Subgrid fix: tất cả title align ngang vì dùng chung parent row tracks.

```css
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Define shared row structure */
  grid-template-rows: auto 1fr auto; /* title | body | footer */
  gap: 1rem;
}

.card {
  grid-row: span 3;
  display: grid;
  grid-template-rows: subgrid; /* Inherit parent's row tracks */
  gap: 0.5rem;
  border: 1px solid #ddd;
  padding: 1rem;
}

/* All card titles now align, all bodies align, all footers align */
.card-title  { font-weight: 700; }
.card-body   { /* stretches in the 1fr row */ }
.card-footer { font-size: 0.875rem; color: #666; }
```

---

### Q: What are CSS logical properties and why use them? / Logical properties là gì và tại sao nên dùng? 🟡 Mid

**A:** Logical properties replace physical direction properties (left, right, top, bottom) with flow-relative ones. `margin-inline-start` replaces `margin-left` in LTR (and auto-becomes `margin-right` in RTL). `block-start` replaces `top`.

| Physical | Logical | Axis |
|---|---|---|
| `left` / `right` | `inline-start` / `inline-end` | Inline (text direction) |
| `top` / `bottom` | `block-start` / `block-end` | Block (perpendicular to text) |
| `width` | `inline-size` | |
| `height` | `block-size` | |

Benefits: one CSS file works correctly for LTR (English) and RTL (Arabic, Hebrew) without overrides. Also correct for vertical writing modes (CJK vertical text).

Vietnamese: Logical properties thay thế hướng vật lý (left/right/top/bottom) bằng hướng luận lý (inline-start/end, block-start/end). `inline-start` = `left` trong LTR, tự động thành `right` trong RTL. Ưu điểm: 1 file CSS hoạt động đúng cho cả LTR (English) và RTL (Arabic) mà không cần override. Nên dùng cho mọi project mới.

```css
/* Instead of physical properties */
.card {
  /* Physical (old way) */
  margin-left: 1rem;
  padding-top: 0.5rem;
  border-right: 1px solid #ddd;
  width: 300px;

  /* Logical (modern way) -- works in RTL automatically */
  margin-inline-start: 1rem;
  padding-block-start: 0.5rem;
  border-inline-end: 1px solid #ddd;
  inline-size: 300px;
}

/* Shorthand logical properties */
.box {
  margin-inline: 1rem 2rem;  /* start: 1rem, end: 2rem */
  padding-block: 0.5rem;     /* top and bottom: 0.5rem */
  inset-inline: 0;           /* left: 0, right: 0 */
}
```

---

### Q: How do modern CSS color functions work (oklch, oklab)? / CSS color functions hiện đại 🟡 Mid

**A:** Traditional color formats (RGB, HSL) have perceptual non-uniformity: changing lightness by the same amount produces visually different results for different hues. `oklch` and `oklab` are **perceptually uniform** -- equal numeric changes produce equal visual changes.

**`oklch(L C H)`**: L = lightness (0-1), C = chroma (0-0.4, saturation), H = hue angle (0-360). This is the most practical modern format because hue and lightness are independent.

Benefits: (1) programmatic color palettes with consistent perceived lightness, (2) better gradients without gray dead zones, (3) access to wide-gamut colors (P3 displays).

Vietnamese: `oklch` là format màu mới, perceptually uniform -- thay đổi lightness/chroma/hue bằng nhau cho kết quả visual bằng nhau (không như HSL bị lệch). L = lightness, C = chroma (saturation), H = hue angle. Ưu điểm: tạo palette consistent, gradient không bị muddy, hỗ trợ wide gamut (màn P3). Đang trở thành best practice cho design systems.

```css
:root {
  /* oklch color palette with consistent lightness */
  --blue-50:  oklch(95% 0.05 240);
  --blue-100: oklch(90% 0.08 240);
  --blue-500: oklch(55% 0.20 240);
  --blue-900: oklch(25% 0.10 240);

  /* Easy to create variations: just change one axis */
  --primary: oklch(55% 0.20 240);        /* blue */
  --primary-light: oklch(80% 0.10 240);  /* lighter, less saturated */
  --primary-dark: oklch(30% 0.15 240);   /* darker */
}

/* Gradient without gray dead zone */
.gradient-good {
  /* oklch interpolation avoids muddy middle */
  background: linear-gradient(in oklch, oklch(60% 0.25 30), oklch(60% 0.25 270));
}

/* Wide gamut color with fallback */
.vibrant {
  color: hsl(250, 100%, 50%); /* sRGB fallback */
  color: oklch(50% 0.35 270); /* wide gamut if supported */
}
```

---

### Q: How do clamp(), min(), and max() work in CSS? / clamp(), min(), max() hoạt động thế nào? 🟢 Junior

**A:** These CSS math functions enable responsive values without media queries:

- **`min(a, b)`**: returns the smaller value. Use for capping maximum: `width: min(90vw, 1200px)` means "90% viewport width, but never more than 1200px."
- **`max(a, b)`**: returns the larger value. Use for ensuring minimum: `font-size: max(16px, 1vw)` means "1vw, but never less than 16px."
- **`clamp(min, preferred, max)`**: `clamp(16px, 4vw, 32px)` means "use 4vw, but clamp between 16px and 32px." Equivalent to `max(16px, min(4vw, 32px))`.

These functions accept mixed units and can nest `calc()` inside them.

Vietnamese: `min()` trả giá trị nhỏ hơn (dùng cap maximum), `max()` trả giá trị lớn hơn (dùng đảm bảo minimum), `clamp(min, preferred, max)` giới hạn giá trị trong khoảng. Rất hữu ích cho fluid typography và responsive layout mà không cần media queries. Có thể mix units (px + vw + rem).

```css
/* Fluid typography: scales with viewport, bounded by min/max */
h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
  /* At 320px viewport: ~1.5rem (min) */
  /* At 1200px viewport: ~3rem (max) */
  /* Between: scales fluidly */
}

/* Responsive container without media queries */
.container {
  width: min(90vw, 1200px);
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 3rem);
}

/* Responsive spacing */
.section {
  padding-block: clamp(2rem, 5vh, 6rem);
}

/* Ensure minimum touch target size */
.button {
  min-height: max(44px, 2.75rem); /* at least 44px (WCAG touch target) */
}
```

---

### Q: What are CSS Scroll-driven Animations? / Scroll-driven Animations là gì? 🔴 Senior

**A:** Scroll-driven animations tie animation progress to scroll position instead of time. Previously this required JavaScript (Intersection Observer + requestAnimationFrame). Now CSS can do it natively with two timeline types:

- **`scroll()`**: links animation to scroll position of a scroll container. Progress 0% at top, 100% at bottom.
- **`view()`**: links animation to an element's visibility within a scroll container (like Intersection Observer). Progress 0% when entering, 100% when leaving.

Benefits: runs on the compositor thread (smooth 60fps), no JavaScript needed, declarative syntax.

Vietnamese: Scroll-driven animations gắn animation progress vào vị trí scroll thay vì thời gian. `scroll()` theo scroll position của container. `view()` theo visibility của element trong viewport (giống Intersection Observer). Ưu điểm: chạy trên compositor thread (60fps mượt), không cần JavaScript. Thay thế nhiều thư viện scroll animation.

```css
/* Progress bar tied to page scroll */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: blue;
  transform-origin: left;
  animation: scaleProgress linear;
  animation-timeline: scroll(); /* tied to root scroller */
}

@keyframes scaleProgress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

/* Fade-in elements as they scroll into view */
.reveal {
  animation: fadeIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

### Q: What is the View Transition API? / View Transition API là gì? 🔴 Senior

**A:** The View Transition API creates animated transitions between DOM states (same-page) or between page navigations (cross-document). The browser takes a screenshot of the old state, updates the DOM to the new state, then animates between the two using CSS animations.

For same-page transitions: wrap DOM mutations in `document.startViewTransition()`. For cross-document (MPA): use `@view-transition` at-rule and `view-transition-name` CSS property.

Vietnamese: View Transition API tạo animation giữa 2 trạng thái DOM hoặc 2 trang. Browser chụp ảnh trạng thái cũ, update DOM sang trạng thái mới, rồi animate giữa 2 ảnh bằng CSS. Cho SPA: dùng `document.startViewTransition()`. Cho MPA: dùng `@view-transition` CSS. Thay thế các thư viện page transition phức tạp.

```css
/* Default crossfade transition (automatic) */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* Named transition for specific element */
.product-image {
  view-transition-name: product-hero;
}

/* Customize the named transition */
::view-transition-old(product-hero),
::view-transition-new(product-hero) {
  animation-duration: 0.5s;
}

/* Cross-document transitions (MPA) */
@view-transition {
  navigation: auto;
}
```

```js
// Same-page transition
document.startViewTransition(() => {
  // DOM mutation happens here
  container.innerHTML = newContent;
});
```

---

### Q: How does CSS Anchor Positioning work? / CSS Anchor Positioning hoạt động thế nào? 🔴 Senior

**A:** CSS Anchor Positioning connects a positioned element (tooltip, popover, dropdown) to an "anchor" element without JavaScript positioning logic. The positioned element automatically stays connected to its anchor, handling viewport edge collisions with `position-try` fallbacks.

This replaces JavaScript positioning libraries (Popper.js, Floating UI) for many use cases.

Vietnamese: Anchor Positioning cho phép gắn positioned element (tooltip, popover) vào anchor element bằng CSS thuần. Tự động xử lý edge collisions với `position-try` fallbacks. Thay thế Popper.js/Floating UI cho nhiều trường hợp. Browser support còn hạn chế (Chrome 125+) nhưng là tương lai của popover/tooltip positioning.

```css
/* Define an anchor */
.trigger {
  anchor-name: --tooltip-anchor;
}

/* Position element relative to anchor */
.tooltip {
  position: fixed;
  position-anchor: --tooltip-anchor;

  /* Position at top-center of anchor */
  inset-area: top;
  /* Or use anchor() function for precise positioning */
  bottom: anchor(top);
  left: anchor(center);
  transform: translateX(-50%);

  /* Fallback positions if it overflows viewport */
  position-try:
    flip-block,   /* try flipping to bottom */
    flip-inline;  /* try flipping horizontally */
}
```

---

### Q: What is progressive enhancement for modern CSS? / Progressive enhancement cho CSS hiện đại 🔴 Senior

**A:** Progressive enhancement means building a baseline experience that works everywhere, then layering on modern features for capable browsers. For CSS, this uses `@supports` queries and natural fallback behavior.

Strategy: (1) write fallback CSS first (works without new features), (2) use `@supports` to add modern features, (3) test in older browsers to ensure graceful degradation.

Vietnamese: Progressive enhancement: xây baseline hoạt động mọi nơi, rồi thêm tính năng hiện đại cho browser hỗ trợ. Dùng `@supports` kiểm tra feature support. CSS tự bỏ qua property không hiểu, nên viết fallback trước rồi override -- không cần `@supports` cho mọi thứ.

```css
/* Fallback layout works without container queries */
.card {
  display: flex;
  flex-direction: column;
}

/* Progressive enhancement with @supports */
@supports (container-type: inline-size) {
  .card-wrapper {
    container-type: inline-size;
  }
  @container (min-width: 400px) {
    .card {
      flex-direction: row;
    }
  }
}

/* Color fallback for wide gamut */
.accent {
  background: hsl(250, 80%, 55%);        /* sRGB fallback */
  background: oklch(55% 0.25 270);       /* wide gamut, ignored if unsupported */
}

/* Subgrid with fallback */
.grid-item {
  display: grid;
  grid-template-rows: auto 1fr auto;     /* fallback: own tracks */
}
@supports (grid-template-rows: subgrid) {
  .grid-item {
    grid-template-rows: subgrid;          /* inherit parent tracks */
  }
}
```
