# Modern CSS Features / Tính năng CSS hiện đại

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Grid & Flexbox Theory](./05-css-grid-flexbox-theory.md) | [CSS Architecture Theory](./07-css-architecture-theory.md) | [CSS Fundamentals](./00-css-fundamentals.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn xây một card component dùng chung cho sidebar (280px wide) và main content (800px wide). Designer muốn card trong sidebar hiện dọc, trong main hiện ngang — nhưng **không dùng class riêng, không dùng JS**. Bạn cũng đang tích hợp thư viện CSS bên thứ ba (reset + Tailwind), nhưng specificity wars khiến component styles bị override. Thêm nữa, typography cần scale mượt từ mobile đến desktop mà không cần 3 breakpoints.

Ba vấn đề, ba giải pháp hiện đại: **Container Queries** (card tự adapt theo context), **Cascade Layers** (taming specificity), **CSS Math Functions** (`clamp()` cho fluid typography). Tất cả native CSS, không cần build tool.

---

## What & Why / Cái Gì & Tại Sao

**Container Queries là gì?** Trước đây, media queries chỉ nhìn vào viewport. Nhưng component không quan tâm viewport — nó quan tâm container của nó rộng bao nhiêu. Container Queries cho phép component tự hỏi "tôi đang nằm trong không gian rộng hay hẹp?" và tự điều chỉnh. Đây là **responsive design ở level component, không phải page**.

**Cascade Layers là gì?** CSS cascade có nhiều yếu tố quyết định thứ tự: origin (browser/user/author), specificity, source order. `@layer` thêm một tầng mới giữa origin và specificity: **layer order**. Style trong layer sau luôn thắng layer trước — bất kể specificity. Style ngoài layer (unlayered) luôn thắng tất cả. Đây là công cụ để nói "reset/framework luôn thua component styles" mà không cần `!important`.

**CSS Math Functions là gì?** `clamp(min, preferred, max)` = "dùng giá trị preferred, nhưng không nhỏ hơn min và không lớn hơn max". Thay vì 3 media queries cho font-size, bạn có 1 công thức tự scale. `min()` và `max()` là building blocks: `min(90vw, 1200px)` = "90% viewport nhưng không vượt 1200px".

---

## Concept Map / Bản Đồ Khái Niệm

```
Modern CSS Features (2022-2025)
│
├── Responsive (không cần JS)
│   ├── Container Queries (@container, container-type)
│   │   └── Style Queries (@container style(...))
│   ├── CSS Math: clamp(), min(), max()
│   └── Media Queries (viewport — vẫn cần cho page-level)
│
├── Cascade Control
│   ├── @layer (layer order > specificity)
│   └── :where() / :is() (specificity management)
│
├── Selectors mới
│   ├── :has() — "parent selector", relational pseudo-class
│   └── :is(), :where(), :not() (compound selectors)
│
├── Layout mới
│   └── Subgrid (nested grid inherits parent tracks)
│
├── Internationalization
│   └── Logical Properties (inline/block vs left/right/top/bottom)
│
├── Color
│   └── oklch / oklab (perceptually uniform, wide gamut)
│
└── Animations (compositor-threaded, no JS)
    ├── Scroll-driven Animations (scroll() / view() timelines)
    ├── View Transitions API (animated DOM state changes)
    └── CSS Anchor Positioning (replace Popper.js)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### Core Concept 1: Container Queries — Component-Relative Responsive Design

> **Memory Hook**: "Media query hỏi viewport. Container query hỏi chính parent của mình."

**Tại sao tồn tại:**
Trước container queries, component phải biết về viewport để biết nó đang ở sidebar hay main content. Điều này vi phạm encapsulation: component không nên phụ thuộc vào context bên ngoài. Container queries tách rời component khỏi viewport — component chỉ cần biết "mình đang có bao nhiêu space".

**Layer 1 — Cơ bản:**

```css
/* Step 1: declare containment context on parent */
.sidebar {
  container-type: inline-size;
}
.main-content {
  container-type: inline-size;
}

/* Step 2: component queries its own container */
@container (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
/* Same .card, different layouts in sidebar vs main — no JS needed */
```

**Layer 2 — Named containers + Style Queries:**

```css
/* Named containers for clarity */
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 600px) {
  .card {
    /* applies only when inside card-grid container */
  }
}

/* Style queries: query custom property values */
@container style(--variant: featured) {
  .card {
    border: 2px solid gold;
  }
}
```

**Layer 3 — Gotcha: container-type không được inherit:**

```css
/* Vấn đề: @container queries nearest ancestor WITH container-type */
/* Nếu quên khai báo container-type → query không bao giờ trigger */

/* container-type: size = cả inline và block size */
/* container-type: inline-size = chỉ inline (thường là đủ) */
/* container-type: normal = style queries only, không size queries */
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                                | Đúng là                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Quên khai báo `container-type` trên parent            | `@container` tìm nearest ancestor có `container-type` — không có thì không bao giờ trigger | Khai báo `container-type: inline-size` trên parent element, không phải element cần query |
| Dùng `container-type: size` khi chỉ cần `inline-size` | `size` cần explicit height trên container — thường gây layout issues không mong muốn       | Dùng `container-type: inline-size` cho hầu hết responsive use cases                      |
| Đặt `container-type` trực tiếp trên element cần query | Element không thể query chính mình — chỉ query được ancestor container                     | Đặt `container-type` trên **parent** wrapper, viết `@container` query từ child           |

**Interview Pattern:** "Làm sao card hiện layout khác trong sidebar vs main mà không dùng JS?" → container queries + `container-type: inline-size` trên parent wrapper.

**Knowledge Chain:** `container queries` → Component Architecture (self-contained) → `@supports` (progressive enhancement) → browser compat strategy

---

### Core Concept 2: Cascade Layers — Taming Specificity Wars

> **Memory Hook**: "Layer order wins over specificity. Unlayered always wins all."

**Tại sao tồn tại:**
Khi tích hợp reset CSS + framework + component styles, specificity conflicts không thể đoán. Một class `.btn` của framework (specificity 0-1-0) đánh bại `.card .btn` của bạn? Không phải lúc nào cũng vậy. `@layer` cho phép khai báo rõ ràng: "framework style luôn thua component style" — không phụ thuộc vào selector games.

**Layer 1 — Cơ bản:**

```css
/* Declare layer order (first declared = lowest priority) */
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    box-sizing: border-box;
  }
  /* Even a high-specificity selector here loses to .class in `components` layer */
}

@layer components {
  .btn {
    padding: 0.5rem 1rem;
  }
}

/* Unlayered: always beats ALL named layers */
.override {
  color: red;
}
```

**Layer 2 — Importing third-party CSS into layers:**

```css
/* Put framework CSS in a low-priority layer */
@import url("normalize.css") layer(reset);
@import url("framework.css") layer(framework);

/* Your styles, in higher layer, always win */
@layer components {
  /* These beat any framework style, regardless of specificity */
}
```

**Layer 3 — Layer reversal pattern:**

```css
/* Advanced: reverse Tailwind's layer order */
@layer tailwind-utilities, tailwind-components, tailwind-base;
@import "tailwind.css";
/* Now base utilities have lowest priority — your styles win by default */
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                                           | Đúng là                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Nhầm rằng layer sau có **lower** priority        | Ngược lại — layer khai báo **sau** có priority **cao hơn**                            | Khai báo layer theo thứ tự thấp→cao: `@layer reset, base, components, utilities` |
| Đặt utility classes trong layer                  | Utility classes bị override bởi unlayered styles bất kể specificity cao hay thấp      | Đặt utilities unlayered hoặc trong layer cuối cùng để có priority cao nhất       |
| Khai báo layer order sau khi đã dùng `@layer {}` | Order được set bởi declaration `@layer` **đầu tiên** — khai báo sau không thể reorder | Luôn khai báo toàn bộ layer order ở đầu file trước bất kỳ `@layer {}` block nào  |

**Interview Pattern:** "Làm sao component styles luôn thắng framework styles?" → `@layer`: khai báo layer cho framework (thấp), component styles ở layer cao hơn hoặc unlayered.

**Knowledge Chain:** `@layer` → cascade algorithm understanding → specificity → `!important` (nuclear option vs layer elegance)

---

### Core Concept 3: CSS Math Functions — Fluid Responsive Without Breakpoints

> **Memory Hook**: "`clamp(min, preferred, max)` = 'tôi muốn preferred, nhưng giới hạn trong khoảng min–max.'"

**Tại sao tồn tại:**
Media queries tạo ra "jumps" — font đột ngột thay đổi tại breakpoint. Fluid responsive muốn values **thay đổi liên tục** theo viewport width. `clamp()` cho phép giá trị scale theo viewport nhưng không bao giờ ra ngoài bounds an toàn.

**Layer 1 — Cơ bản:**

```css
/* fluid typography: scale between 1rem (320px) and 2rem (1200px) */
h1 {
  font-size: clamp(1rem, 0.5rem + 2.5vw, 2rem);
}

/* Container max-width with viewport safety */
.container {
  width: min(90vw, 1200px); /* 90% of viewport, never > 1200px */
  margin-inline: auto;
}

/* Touch target minimum (WCAG) */
.btn {
  min-height: max(44px, 2.75rem);
}
```

**Layer 2 — Computing fluid values:**

Formula để tính linear fluid scale:

```
preferred = slope * 100vw + offset
slope = (maxValue - minValue) / (maxViewport - minViewport)

Ví dụ: 1rem at 320px → 2rem at 1200px
slope = (2 - 1) / (1200 - 320) = 1/880 ≈ 0.00114
offset = 1rem - 0.00114 * 320px ≈ 0.636rem
→ clamp(1rem, 0.636rem + 0.114vw, 2rem)
```

**Layer 3 — Nested và mixed units:**

```css
/* Can mix units freely */
.spacing {
  gap: clamp(1rem, 2vw + 0.5rem, 3rem);
  padding: max(env(safe-area-inset-top), 1rem); /* with safe area */
}

/* Can use inside Grid */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 30%, 400px), 1fr));
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                | Tại sao sai                                                                                                     | Đúng là                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `clamp()` argument order sai                           | `clamp(min, preferred, max)` — nếu min > max thì kết quả là undefined behavior                                  | Nhớ thứ tự: min ≤ preferred ≤ max; test ở viewport nhỏ nhất và lớn nhất      |
| Dùng `clamp()` mà không test trên small/large viewport | Preferred value có thể violate min/max bounds ở viewport ngoài khoảng tính                                      | Luôn verify `clamp()` tại viewport minimum và maximum để đảm bảo bounds đúng |
| Nhầm `min()` và `max()`                                | `min(a, b)` trả giá trị **nhỏ hơn** (dùng để cap maximum); `max(a, b)` trả giá trị **lớn hơn** (ensure minimum) | Nhớ: `min()` để giới hạn tối đa, `max()` để đảm bảo tối thiểu                |

**Interview Pattern:** "Fluid typography không cần media queries?" → `clamp(minSize, preferredScale, maxSize)`. Bonus: explain the formula.

**Knowledge Chain:** `clamp()` → `min()` / `max()` → CSS calc() → CSS custom properties (combine for dynamic fluid systems)

---

## Q&A / Câu Hỏi Phỏng Vấn

### Q: What do `min()`, `max()`, and `clamp()` do in CSS? / min(), max(), clamp() dùng để làm gì? 🟢 Junior

**A:** These CSS math functions enable responsive values without media queries:

- **`min(a, b)`**: returns the smaller value. Use for capping a maximum: `width: min(90vw, 1200px)` = "90% viewport, but never more than 1200px."
- **`max(a, b)`**: returns the larger value. Use for ensuring a minimum: `font-size: max(16px, 1vw)` = "1vw, but never less than 16px."
- **`clamp(min, preferred, max)`**: clamps `preferred` between `min` and `max`. Equivalent to `max(min, min(preferred, max))`. Example: `clamp(1rem, 4vw, 2rem)` scales with viewport but stays between 1rem and 2rem.

These functions accept mixed units and can nest `calc()` inside them.

Vietnamese: `min()` trả giá trị nhỏ hơn (dùng cap maximum), `max()` trả giá trị lớn hơn (dùng đảm bảo minimum), `clamp(min, preferred, max)` giữ preferred trong khoảng an toàn. Rất hữu ích cho fluid typography và responsive layout mà không cần media queries.

```css
h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
} /* fluid typography */
.container {
  width: min(90vw, 1200px);
  margin-inline: auto;
}
.btn {
  min-height: max(44px, 2.75rem);
} /* WCAG touch target */
```

> 💡 **Interview Signal**: Hay bị nhầm: `min()` dùng để **cap maximum** (vì nó trả giá trị nhỏ hơn, và một arg là giá trị cố định = limit). Giải thích đúng intuition này là điểm cộng.

---

### Q: What is `@supports` and why use it? / `@supports` là gì và dùng khi nào? 🟢 Junior

**A:** `@supports` is a feature query that checks if a browser supports a specific CSS property/value before applying styles. It enables progressive enhancement: write a baseline that works everywhere, then layer modern features for capable browsers.

CSS already ignores unknown properties (silent degradation), so `@supports` is only needed when: (1) you need a **completely different layout** for browsers with/without a feature, or (2) grouping multiple related properties that must all apply together.

```css
/* Fallback: works everywhere */
.card {
  display: flex;
  flex-direction: column;
}

/* Progressive enhancement: container queries when supported */
@supports (container-type: inline-size) {
  .wrapper {
    container-type: inline-size;
  }
  @container (min-width: 500px) {
    .card {
      flex-direction: row;
    }
  }
}

/* Color fallback (no @supports needed — CSS ignores unknown values) */
.accent {
  color: hsl(250, 80%, 55%);
} /* fallback */
.accent {
  color: oklch(55% 0.25 270);
} /* overrides if supported */
```

Vietnamese: `@supports` kiểm tra browser có support feature không trước khi apply styles. Dùng khi cần **layout hoàn toàn khác** với/không với feature đó. Nếu chỉ thêm property mới, không cần `@supports` — CSS tự bỏ qua property không hiểu.

> 💡 **Interview Signal**: Điểm hay nhất: CSS silent degradation có nghĩa là nhiều khi không cần `@supports`. Biết **khi nào cần** và **khi nào không** là engineering judgment của senior.

---

### Q: What are CSS Container Queries and how do they differ from media queries? / Container Queries khác media queries thế nào? 🟡 Mid

**A:** Media queries respond to the **viewport** size. Container queries respond to the **parent container's** size. This is a fundamental shift for component-based design: a card component can adapt its layout based on where it is placed (narrow sidebar vs wide main content) without knowing about the viewport.

To use container queries: (1) declare a containment context on the parent with `container-type: inline-size`, (2) query the container's size with `@container`.

Vietnamese: Media queries dựa vào viewport (toàn trang). Container queries dựa vào size của parent container. Component tự adapt theo context đặt vào, không cần biết viewport size. Card trong sidebar sẽ hiện layout khác so với trong main content, tự động. Đây là bước tiến lớn cho component-based architecture.

```css
/* 1. Declare containment context on parent */
.card-container {
  container-type: inline-size;
  container-name: card-wrapper;
}

/* 2. Query the container */
@container card-wrapper (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 150px 1fr;
  }
}
```

> 💡 **Interview Signal**: "Media query = viewport, container query = parent container" — nói được 1 câu này là đủ open. Bonus: nêu use case cụ thể (card trong sidebar vs main).

---

### Q: How does native CSS nesting work? / CSS nesting native hoạt động ra sao? 🟡 Mid

**A:** Native CSS nesting (shipped in all major browsers since 2023) allows writing child selectors inside parent rules, similar to Sass/Less but without a preprocessor.

Rules: use `&` to reference the parent selector. For type selectors (like `p`, `h2`), use `& p` (must have `&`). The `&` can appear anywhere in the selector, enabling parent-context targeting.

```css
.card {
  padding: 1rem;

  & .title {
    font-size: 1.25rem;
  } /* .card .title */
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  &--featured {
    border-color: gold;
  } /* .card--featured */

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  .dark-theme & {
    background: #333;
    color: #fff;
  } /* .dark-theme .card */
}
```

Vietnamese: CSS nesting native trong browser từ 2023 — không cần Sass. `&` = tham chiếu parent selector. Type selector (p, h2) phải dùng `& p`. `&` có thể đặt bất kỳ đâu trong selector. Lưu ý: nesting quá sâu (3+ levels) vẫn gây vấn đề maintainability.

> 💡 **Interview Signal**: Phân biệt được "type selector cần `&` prefix" và "`.dark-theme &` là parent context" là điểm cộng. Nhiều dev quen Sass không biết sự khác biệt nhỏ này.

---

### Q: What are Cascade Layers and how do they help manage specificity? / Cascade Layers giải quyết vấn đề specificity thế nào? 🔴 Senior

**A:** `@layer` introduces a new level in the cascade between origin and specificity. You declare layers in order, and **later layers have higher priority** regardless of selector specificity within each layer. Styles outside any layer (unlayered) always beat layered styles.

This solves specificity wars: third-party CSS (reset, framework) goes in low-priority layers, and your component styles always win without needing `!important` or high-specificity selectors.

```css
/* Declare layer order (first = lowest priority) */
@layer reset, base, components, utilities;

@layer reset {
  * {
    margin: 0;
    box-sizing: border-box;
  }
  /* Even #id selectors here lose to .class in `components` layer */
}

@layer components {
  .btn {
    padding: 0.5rem 1rem;
  }
}

/* Unlayered: always beats ALL named layers */
.emergency-fix {
  color: red;
}

/* Import third-party into layer */
@import url("tailwind.css") layer(framework);
```

Vietnamese: `@layer` thêm tầng mới trong cascade — layer sau có priority cao hơn, **bất kể specificity**. Style ngoài layer luôn thắng. Giải quyết specificity wars: đặt reset/framework CSS vào layer thấp, component styles luôn thắng mà không cần `!important`.

> 💡 **Interview Signal**: "Later layers win. Unlayered styles always win all layers." — nếu nhớ 2 rules này là pass. Bonus: explain `@import url(...) layer(...)` để wrap third-party libraries.

---

### Q: How does the `:has()` selector work and what can you build with it? / :has() selector hoạt động thế nào? 🟡 Mid

**A:** `:has()` is a relational pseudo-class that selects an element based on its **descendants or siblings**. It is often called the "parent selector" because it lets you style a parent based on its children — something CSS couldn't do before.

`:has()` accepts any valid selector list. It can use combinators (`+`, `~`) to check siblings.

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
.card:not(:has(img)) {
  display: flex;
  flex-direction: column;
}

/* Page-level: prevent scroll when modal open */
body:has(.modal.open) {
  overflow: hidden;
}

/* Style label when adjacent input is focused */
label:has(+ input:focus) {
  color: blue;
  font-weight: bold;
}
```

Vietnamese: `:has()` cho phép style element dựa trên children/siblings — điều CSS trước đây không thể làm. Rất powerful nhưng cần cẩn thận performance trên DOM lớn (browser phải check descendants mỗi lần re-render).

> 💡 **Interview Signal**: Use case `body:has(.modal.open) { overflow: hidden }` là ví dụ hay nhất để show — thay thế JS toggleClass trên body. Mention performance concern cho DOM lớn là dấu hiệu senior.

---

### Q: What is CSS Subgrid and what problems does it solve? / Subgrid giải quyết vấn đề gì? 🟡 Mid

**A:** Subgrid allows a nested grid item to inherit its parent grid's track lines for one or both axes. Without subgrid, nested grids create independent track sizing, breaking alignment between siblings.

Classic problem: a row of cards where each card has title, description, footer. Without subgrid, title height varies per card, so descriptions start at different vertical positions. With subgrid, all titles align because they share the parent's row tracks.

```css
.card-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* title | body | footer */
  gap: 1rem;
}

.card {
  grid-row: span 3;
  display: grid;
  grid-template-rows: subgrid; /* inherit parent's row tracks */
  padding: 1rem;
}
/* All titles align, all bodies align, all footers align */
```

Vietnamese: Subgrid cho nested grid thừa kế track lines từ parent. Vấn đề kinh điển: row cards mỗi card có title/content/footer khác chiều cao — không subgrid thì layout lệch nhau. Subgrid fix: tất cả align vì dùng chung parent tracks.

> 💡 **Interview Signal**: Card row alignment là ví dụ chuẩn. Nếu explain được "nested grids have independent tracks, subgrid inherits parent tracks" là clear.

---

### Q: What are CSS logical properties and why use them? / Logical properties là gì và tại sao nên dùng? 🟡 Mid

**A:** Logical properties replace physical direction properties (left, right, top, bottom) with flow-relative ones. `margin-inline-start` replaces `margin-left` in LTR and auto-becomes `margin-right` in RTL. `block-start` replaces `top`.

| Physical         | Logical                       | Axis                          |
| ---------------- | ----------------------------- | ----------------------------- |
| `left` / `right` | `inline-start` / `inline-end` | Inline (text direction)       |
| `top` / `bottom` | `block-start` / `block-end`   | Block (perpendicular to text) |
| `width`          | `inline-size`                 |                               |
| `height`         | `block-size`                  |                               |

Benefits: one CSS file works correctly for both LTR (English) and RTL (Arabic, Hebrew) without overrides. Also correct for vertical writing modes (CJK).

```css
.card {
  margin-inline-start: 1rem; /* margin-left in LTR, margin-right in RTL */
  padding-block-start: 0.5rem; /* padding-top */
  border-inline-end: 1px solid; /* border-right in LTR, border-left in RTL */
  inline-size: 300px; /* width */
}
```

Vietnamese: Logical properties thay thế hướng vật lý bằng hướng luận lý. `inline-start` = `left` trong LTR, tự thành `right` trong RTL. Ưu điểm: 1 file CSS cho cả LTR và RTL. Nên dùng cho mọi project mới, đặc biệt i18n.

> 💡 **Interview Signal**: Nếu interviewer hỏi về i18n support trong CSS, đây là câu trả lời đúng. "Logical properties work correctly in RTL without any overrides."

---

### Q: How do modern CSS color functions work (oklch, oklab)? / CSS color functions hiện đại 🟡 Mid

**A:** Traditional formats (RGB, HSL) have perceptual non-uniformity: equal numeric changes in lightness produce visually unequal results for different hues. `oklch` and `oklab` are **perceptually uniform** — equal numeric changes produce equal visual changes.

**`oklch(L C H)`**: L = lightness (0–1), C = chroma (0–0.4, saturation), H = hue angle (0–360). Hue and lightness are independent, making programmatic color palettes predictable.

```css
:root {
  --blue-500: oklch(55% 0.2 240);
  --blue-light: oklch(80% 0.1 240); /* same hue, just lighter + less saturated */
  --blue-dark: oklch(30% 0.15 240);
}

/* Gradient without muddy gray zone */
.gradient {
  background: linear-gradient(in oklch, oklch(60% 0.25 30), oklch(60% 0.25 270));
}

/* Wide gamut with sRGB fallback */
.accent {
  color: hsl(250, 100%, 50%);
} /* fallback */
.accent {
  color: oklch(50% 0.35 270);
} /* wide gamut if supported */
```

Vietnamese: `oklch` là format màu perceptually uniform — thay đổi lightness/chroma/hue bằng nhau cho kết quả visual bằng nhau (HSL bị lệch). L = lightness, C = chroma, H = hue. Ưu điểm: palette consistent, gradient không muddy, hỗ trợ P3 wide gamut.

> 💡 **Interview Signal**: "HSL is not perceptually uniform — oklch is" là câu key. Nếu explain được tại sao oklch gradients không bị muddy (consistent lightness across hues) là senior level.

---

### Q: What are CSS Scroll-driven Animations? / Scroll-driven Animations là gì? 🔴 Senior

**A:** Scroll-driven animations tie animation progress to scroll position instead of time. Previously this required JavaScript (Intersection Observer + requestAnimationFrame). CSS now handles it natively with two timeline types:

- **`scroll()`**: links animation to scroll position of a scroll container. Progress 0% at top, 100% at bottom.
- **`view()`**: links animation to an element's visibility within a scroll container (like Intersection Observer). Progress 0% when entering, 100% when leaving.

Benefits: runs on the compositor thread (smooth 60fps), no JavaScript needed, declarative.

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
  animation-timeline: scroll();
}
@keyframes scaleProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Fade-in as element scrolls into view */
.reveal {
  animation: fadeIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Vietnamese: Scroll-driven animations gắn animation progress vào scroll position thay vì thời gian. `scroll()` theo scroll position. `view()` theo visibility trong viewport (thay thế Intersection Observer). Chạy trên compositor thread — không block main thread, 60fps mượt.

> 💡 **Interview Signal**: "Compositor thread" là keyword quan trọng — show bạn hiểu performance implications. Không chỉ "thay thế JS" mà còn "performant hơn vì không cần main thread".

---

### Q: What is the View Transition API? / View Transition API là gì? 🔴 Senior

**A:** The View Transition API creates animated transitions between DOM states (same-page) or page navigations (cross-document). The browser takes a screenshot of the old state, updates the DOM, then animates between the two using CSS animations on pseudo-elements.

For same-page transitions: wrap DOM mutations in `document.startViewTransition()`. For cross-document (MPA): use `@view-transition` CSS at-rule.

```css
/* Named element for matched transition */
.product-image {
  view-transition-name: product-hero;
}

/* Customize default crossfade */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* Cross-document (MPA) */
@view-transition {
  navigation: auto;
}
```

```js
document.startViewTransition(() => {
  container.innerHTML = newContent; // DOM update happens here
});
```

Vietnamese: View Transition API: browser chụp ảnh trạng thái cũ, update DOM, rồi animate giữa 2 ảnh. SPA: `document.startViewTransition()`. MPA: `@view-transition { navigation: auto }`. Thay thế thư viện page transition. Named transitions (`view-transition-name`) cho phép animate specific elements (kiểu "shared element transition").

> 💡 **Interview Signal**: "Shared element transition" (như card expand → detail page) với `view-transition-name` là use case khiến interviewer ấn tượng. Đây là tính năng trực tiếp cạnh tranh với React/Framer Motion transitions.

---

### Q: How does CSS Anchor Positioning work? / CSS Anchor Positioning hoạt động thế nào? 🔴 Senior

**A:** CSS Anchor Positioning connects a positioned element (tooltip, popover, dropdown) to an "anchor" element without JavaScript positioning logic. The positioned element stays connected to its anchor, with `position-try` fallbacks for viewport edge handling.

This replaces JavaScript positioning libraries (Popper.js, Floating UI) for many use cases.

```css
.trigger {
  anchor-name: --tooltip-anchor;
}

.tooltip {
  position: fixed;
  position-anchor: --tooltip-anchor;
  bottom: anchor(top); /* place below the anchor's top edge */
  left: anchor(center);
  transform: translateX(-50%);
  position-try: flip-block, flip-inline; /* fallback positions */
}
```

Vietnamese: Anchor Positioning: gắn positioned element (tooltip, popover) vào anchor element bằng CSS thuần. Tự xử lý edge collisions với `position-try` fallbacks. Thay thế Popper.js/Floating UI cho nhiều trường hợp. Browser support còn đang mở rộng (Chrome 125+, Firefox đang implement).

> 💡 **Interview Signal**: Mention "replaces Popper.js/Floating UI" + "viewport overflow handling via position-try" là key points. Nếu mention browser support còn limited → progressive enhancement strategy = bonus.

---

### Q: What is progressive enhancement for modern CSS? / Progressive enhancement cho CSS hiện đại 🔴 Senior

**A:** Progressive enhancement means building a baseline experience that works everywhere, then layering on modern features for capable browsers. For CSS, this uses `@supports` queries and natural fallback behavior.

Strategy: (1) write fallback CSS first (works without new features), (2) use `@supports` to add modern features, (3) test in older browsers to ensure graceful degradation. CSS already ignores unknown properties, so `@supports` is only needed when you need different layout paths.

```css
/* Fallback layout */
.card {
  display: flex;
  flex-direction: column;
}

/* Progressive: container queries */
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

/* Color: no @supports needed — CSS ignores unknown */
.accent {
  color: hsl(250, 80%, 55%);
} /* sRGB */
.accent {
  color: oklch(55% 0.25 270);
} /* wide gamut — overrides if supported */

/* Subgrid with fallback */
.grid-item {
  grid-template-rows: auto 1fr auto;
} /* own tracks */
@supports (grid-template-rows: subgrid) {
  .grid-item {
    grid-template-rows: subgrid;
  } /* inherit if supported */
}
```

Vietnamese: Progressive enhancement: baseline hoạt động mọi nơi, thêm modern features cho browser hỗ trợ. CSS tự bỏ qua property không hiểu — chỉ dùng `@supports` khi cần layout path khác nhau hoàn toàn. Không over-engineer với `@supports` cho mọi thứ.

> 💡 **Interview Signal**: "CSS already silently ignores unknown properties" — nhiều dev không biết điều này và wrap everything in `@supports`. Biết khi nào không cần `@supports` là engineering maturity.

---

## Interview Q&A Summary / Tổng Kết

| Level | Question                      | Key Point                                            |
| ----- | ----------------------------- | ---------------------------------------------------- |
| 🟢    | `clamp()` / `min()` / `max()` | Fluid responsive, cap/ensure bounds                  |
| 🟢    | `@supports`                   | Feature query, progressive enhancement               |
| 🟡    | Container Queries             | Component-relative responsive, `container-type`      |
| 🟡    | CSS nesting                   | `&` reference, type selector needs `&`, since 2023   |
| 🟡    | `:has()`                      | Parent selector, relational, perf on large DOM       |
| 🟡    | Subgrid                       | Inherit parent track lines, card alignment use case  |
| 🟡    | Logical properties            | Flow-relative, LTR/RTL without overrides             |
| 🟡    | oklch / oklab                 | Perceptually uniform, wide gamut, no muddy gradients |
| 🔴    | Cascade Layers                | Layer order > specificity, unlayered always wins     |
| 🔴    | Scroll-driven Animations      | `scroll()` / `view()` timelines, compositor thread   |
| 🔴    | View Transitions API          | Old screenshot → DOM update → animate                |
| 🔴    | Anchor Positioning            | Replace Popper.js, `position-try` fallbacks          |
| 🔴    | Progressive enhancement       | CSS silent degradation, `@supports` when needed      |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Nhanh

**Interviewer**: "How would you make a card component responsive based on its container width, not the viewport?"

**Strong answer**: "Container Queries. I'd add `container-type: inline-size` to the parent wrapper of the card, which establishes a containment context. Then inside `@container (min-width: 500px)`, I can give the card a grid layout. The card has no idea about the viewport — it just responds to whatever space its parent gives it. Same card component works differently in a narrow sidebar and a wide main area."

---

**Interviewer**: "Your component styles keep getting overridden by Tailwind utilities. How do you fix this without using `!important`?"

**Strong answer**: "Cascade Layers. I'd import Tailwind into a named layer — `@import 'tailwind.css' layer(utilities)` — and declare my component styles either in a higher-priority layer or as unlayered styles. Since unlayered styles always beat any named layer regardless of specificity, my component styles will win without needing `!important` or more specific selectors."

---

**Interviewer**: "How would you implement fluid typography that scales between 320px and 1200px viewport?"

**Strong answer**: "`clamp()`. I'd write `font-size: clamp(1rem, 0.5rem + 2.5vw, 2rem)`. The minimum is 1rem, the maximum is 2rem, and between those viewport widths it scales linearly with `0.5rem + 2.5vw`. I can derive the exact formula using slope = (maxValue - minValue) / (maxViewport - minViewport). The result is fluid scaling with no breakpoints and guaranteed bounds."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                            |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Giải thích sự khác nhau giữa media query và container query trong 2 câu. `@layer reset, base, components` — layer nào priority cao nhất và style nào thắng tất cả? |
| 2   | 🎨 Visual      | Vẽ cascade layer priority diagram: `@layer reset, base, components, utilities` với style không nằm trong @layer nào — chú thích thứ tự ưu tiên.                    |
| 3   | 🛠️ Application | Component card cần hiện border khi nó chứa `<button>` bên trong. Viết CSS thuần (không JavaScript) để làm điều này.                                                |
| 4   | 🐛 Debug       | Dark mode color palette trông đẹp trên sRGB monitor nhưng màu tối/xỉn trên P3 display. Chuyển sang `oklch` giúp gì?                                                |
| 5   | 🎓 Teach       | Giải thích Container Queries cho backend developer — tại sao media queries không đủ cho component có thể tái sử dụng ở nhiều context?                              |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Media query: respond theo viewport width (global); Container query: respond theo kích thước container cha (local). `@layer`: layer khai báo **sau** có priority cao hơn → `components` thắng `base`; style **không nằm trong @layer nào** thắng tất cả @layer. |
| 2   | Thứ tự ưu tiên (thấp→cao): `@layer reset` → `@layer base` → `@layer components` → `@layer utilities` → **unlayered styles** (không có @layer).                                                                                                                 |
| 3   | `:has(button) { border: 1px solid blue; }` — `:has()` là "parent/ancestor selector" đầu tiên của CSS, cho phép select element dựa trên con của nó.                                                                                                             |
| 4   | `oklch` dùng perceptual uniformity — cùng `L` (lightness) value thực sự trông cùng brightness trên mọi màu. `hsl`: yellow L=50% trông sáng hơn nhiều so với blue L=50% → palette không đồng đều trên wide gamut P3.                                            |
| 5   | Media query = "nếu màn hình rộng 800px". Component sidebar (300px) và main content (900px) trên cùng viewport 1200px → media query không phân biệt được. Container query respond theo container cha → component reusable ở mọi nơi.                            |

> 🎯 **Feynman Prompt:** Giải thích `@layer` cascade layers cho junior developer — tại sao chúng ta cần "bản đồ ưu tiên" này thay vì chỉ dựa vào specificity như trước?

---

## Connections / Liên Kết

- **Prerequisite**: [Grid & Flexbox Theory](./05-css-grid-flexbox-theory.md) — layout systems cần hiểu trước
- **Prerequisite**: [CSS Fundamentals](./00-css-fundamentals.md) — cascade, specificity
- **Next**: [CSS Architecture Theory](./07-css-architecture-theory.md) — how modern features fit into large-scale CSS
- **Related**: [CSS Architecture](./02-css-architecture.md) — BEM, design tokens, cascade layers in practice
