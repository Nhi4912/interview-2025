# CSS Fundamentals / Nền tảng CSS

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [HTML5 Fundamentals](./00-html5-fundamentals.md) | [Grid & Flexbox](./01-grid-flexbox.md) | [Modern CSS Features](./06-modern-css-features.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How does the CSS cascade work? / CSS cascade hoạt động như thế nào? 🟢 Junior

**A:** The cascade is the algorithm that determines which CSS declarations win when multiple rules target the same element. It resolves conflicts using this priority order (highest to lowest):

1. **Origin & Importance**: `!important` user-agent > `!important` user > `!important` author > CSS animations > author > user > user-agent
2. **Specificity**: inline styles > ID selectors > class/attribute/pseudo-class selectors > type/pseudo-element selectors
3. **Source order**: last declaration wins if specificity is equal

With `@layer` (Cascade Layers), there is now a new dimension: unlayered styles beat layered styles, and layer order determines priority among layered styles.

Vietnamese: Cascade là thuật toán quyết định rule CSS nào thắng khi nhiều rule nhắm cùng element. Thứ tự ưu tiên: Origin (user-agent < user < author), rồi Specificity (inline > ID > class > type), rồi Source Order (rule sau thắng). `!important` đảo ngược thứ tự origin. Với `@layer`, style ngoài layer thắng style trong layer.

```css
/* Specificity: 0-0-1 (one type selector) */
p { color: blue; }

/* Specificity: 0-1-0 (one class selector) - WINS over type */
.text { color: green; }

/* Specificity: 1-0-0 (one ID selector) - WINS over class */
#intro { color: red; }

/* !important overrides everything (avoid in production) */
p { color: purple !important; }
```

---

### Q: How is CSS specificity calculated? / Cách tính specificity trong CSS? 🟡 Mid

**A:** Specificity is represented as a tuple `(A, B, C)` where:
- **A** = number of ID selectors
- **B** = number of class selectors, attribute selectors, and pseudo-classes
- **C** = number of type selectors and pseudo-elements

Inline styles have specificity `(1, 0, 0, 0)` which beats any selector. `!important` is not part of specificity -- it affects the cascade origin step instead. The universal selector `*`, combinators (`>`, `+`, `~`, ` `), and `:where()` contribute zero specificity. `:is()` and `:not()` take the specificity of their most specific argument.

Vietnamese: Specificity tính bằng tuple (A, B, C): A = số ID selector, B = số class/attribute/pseudo-class, C = số type/pseudo-element. So sánh từ trái sang phải. Inline style thắng mọi selector. `:where()` có specificity 0 (hữu ích cho reset/defaults). `:is()` lấy specificity của argument cao nhất.

```css
/* Specificity examples: (A, B, C) */

*                          /* (0, 0, 0) */
p                          /* (0, 0, 1) */
p::before                  /* (0, 0, 2) */
.card                      /* (0, 1, 0) */
p.card                     /* (0, 1, 1) */
#main                      /* (1, 0, 0) */
#main .card p              /* (1, 1, 1) */
#main .card .title         /* (1, 2, 0) -- wins over (1,1,1) */

:where(.card)              /* (0, 0, 0) -- zero specificity! */
:is(.card, #main)          /* (1, 0, 0) -- takes highest argument */
:not(.card)                /* (0, 1, 0) -- specificity of argument */
```

---

### Q: Explain the CSS box model and box-sizing / Giải thích box model và box-sizing 🟢 Junior

**A:** Every element in CSS generates a rectangular box with four areas (inside out): **content**, **padding**, **border**, **margin**.

The default `box-sizing: content-box` means `width`/`height` only set the content area size. Padding and border are added on top, making the total rendered size larger than specified. This is counter-intuitive: `width: 200px` with `padding: 20px` and `border: 1px` renders as 242px wide.

`box-sizing: border-box` makes `width`/`height` include padding and border, so `width: 200px` always renders as 200px. This is the universal best practice:

Vietnamese: Box model có 4 lớp: content, padding, border, margin. Mặc định (`content-box`), width/height chỉ tính content -- thêm padding/border sẽ làm element lớn hơn width đã set. Dùng `border-box` thì width/height bao gồm cả padding và border, dễ tính toán hơn nhiều. Best practice: luôn set `box-sizing: border-box` cho toàn bộ trang.

```css
/* Universal best practice -- apply to all elements */
*, *::before, *::after {
  box-sizing: border-box;
}

/* content-box (default): total width = 200 + 20*2 + 1*2 = 242px */
.box-content {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 1px solid black;
}

/* border-box: total width = 200px (content shrinks to 158px) */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 1px solid black;
}
```

```
┌─────── margin ────────┐
│ ┌──── border ───────┐ │
│ │ ┌── padding ────┐ │ │
│ │ │   content     │ │ │
│ │ │   area        │ │ │
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└───────────────────────┘
```

---

### Q: Explain the CSS display property / Giải thích property display 🟢 Junior

**A:** The `display` property defines how an element participates in layout. It has two aspects: **outer display type** (how the element participates in its parent's layout -- `block` or `inline`) and **inner display type** (how children are laid out -- `flow`, `flex`, `grid`, `table`).

Key values:
- `block` -- takes full width, starts on new line (`<div>`, `<p>`, `<h1>`)
- `inline` -- flows within text, width/height have no effect, vertical margin/padding do not push other elements (`<span>`, `<a>`, `<strong>`)
- `inline-block` -- inline flow but respects width/height and all margin/padding
- `flex` -- block-level flex container
- `inline-flex` -- inline-level flex container
- `grid` -- block-level grid container
- `none` -- removed from layout entirely (not rendered, not accessible)
- `contents` -- element box disappears, children promoted to parent

Vietnamese: `display` quyết định cách element tham gia layout. `block`: chiếm full width, xuống dòng mới. `inline`: chảy theo text, không set được width/height. `inline-block`: chảy theo text nhưng set được kích thước. `flex`/`grid`: tạo flex/grid container. `none`: xóa khỏi layout hoàn toàn (cả visual lẫn accessibility). `contents`: bỏ box của element, children được promote lên parent.

---

### Q: Compare all CSS position values / So sánh tất cả giá trị position 🟡 Mid

**A:** CSS `position` controls how an element is placed and what its containing block is:

- **`static`** (default) -- normal flow. `top`/`right`/`bottom`/`left` have no effect.
- **`relative`** -- normal flow, but offset by `top`/`left` etc. from its normal position. Creates a containing block for absolutely-positioned descendants. Does not affect other elements' positions.
- **`absolute`** -- removed from flow. Positioned relative to nearest positioned ancestor (any position except `static`). If none found, uses the initial containing block (viewport).
- **`fixed`** -- removed from flow. Positioned relative to the viewport. Stays in place on scroll. **Caveat**: `transform`, `filter`, or `will-change` on any ancestor creates a new containing block, breaking the viewport positioning.
- **`sticky`** -- hybrid of relative and fixed. Acts relative in flow until it hits a scroll threshold (set via `top`/`left`), then acts fixed within its scrolling container. Requires the parent to have sufficient height to scroll.

Vietnamese: `static`: vị trí mặc định trong flow. `relative`: vẫn trong flow nhưng offset bằng top/left, tạo containing block cho absolute children. `absolute`: thoát flow, vị trí dựa vào ancestor có position (không phải static). `fixed`: thoát flow, vị trí dựa vào viewport -- **chú ý**: transform/filter trên ancestor sẽ phá vỡ behavior này. `sticky`: relative bình thường cho đến khi scroll tới threshold thì thành fixed trong scrolling container.

```css
/* Sticky header example */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
}

/* Modal overlay: fixed to viewport */
.modal-overlay {
  position: fixed;
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  background: rgba(0, 0, 0, 0.5);
}

/* Tooltip: absolute relative to parent */
.tooltip-wrapper {
  position: relative; /* containing block */
}
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
```

---

### Q: How does CSS typography work? Font loading and performance / Typography trong CSS và tối ưu font loading 🔴 Senior

**A:** CSS typography covers font selection, sizing, line height, and font loading performance.

**Font stack**: Always include fallback fonts. Use `font-display` in `@font-face` to control rendering behavior: `swap` (show fallback immediately, swap when loaded -- good for body text), `optional` (use if cached, skip if slow -- good for non-critical fonts), `fallback` (short block period then fallback).

**Performance**: Subset fonts to reduce file size (e.g., latin-only subset). Use `woff2` format (best compression). Preload critical fonts with `<link rel="preload">`. Avoid layout shift (CLS) by matching fallback font metrics with `size-adjust`, `ascent-override`, `descent-override`.

Vietnamese: Typography quan trọng cho cả UX lẫn performance. Font loading dùng `font-display`: `swap` hiện fallback rồi thay khi load xong (tránh invisible text), `optional` chỉ dùng nếu cached (performance tốt nhất). Dùng `woff2` (nén tốt nhất), subset font (chỉ lấy ký tự cần), preload font quan trọng. Giảm layout shift bằng `size-adjust` trên fallback font.

```css
/* Font face with performance optimization */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* Latin subset */
}

/* Fallback font metrics matching to prevent CLS */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: 'Inter', 'Inter Fallback', system-ui, -apple-system, sans-serif;
  font-size: 1rem;        /* 16px base */
  line-height: 1.5;       /* 24px -- good for readability */
  letter-spacing: -0.01em; /* slight tightening for Inter */
}

h1 {
  font-size: clamp(1.75rem, 1rem + 2vw, 3rem); /* fluid typography */
  line-height: 1.2;
  font-weight: 700;
}
```

---

### Q: What CSS color formats exist and when to use each? / Các format màu trong CSS 🟢 Junior

**A:** CSS supports multiple color formats:

- **Named colors**: `red`, `blue`, `transparent` -- 147 named colors. Good for prototyping.
- **Hex**: `#ff0000`, `#f00` (shorthand), `#ff000080` (with alpha). Most common in codebases.
- **RGB/RGBA**: `rgb(255, 0, 0)`, `rgb(255 0 0 / 50%)`. Familiar for developers.
- **HSL/HSLA**: `hsl(0, 100%, 50%)`, `hsl(0 100% 50% / 50%)`. Best for creating color variations -- adjust lightness for shades/tints, saturation for vibrancy.
- **Modern**: `oklch()`, `oklab()` -- perceptually uniform color spaces. Better for gradients and programmatic color manipulation. Wide gamut support (P3 displays).
- **`currentColor`**: inherits the current `color` value. Useful for SVG icons and borders that should match text color.

Vietnamese: CSS có nhiều format màu: hex (#ff0000) phổ biến nhất, HSL dễ tạo variations (thay đổi lightness cho shade/tint), oklch/oklab là format hiện đại cho gradient đẹp hơn và hỗ trợ wide gamut (màn P3). `currentColor` kế thừa color hiện tại -- hữu ích cho icon SVG và border muốn theo màu text.

```css
:root {
  /* Design tokens using HSL for easy variation */
  --primary-h: 220;
  --primary-s: 90%;
  --primary: hsl(var(--primary-h), var(--primary-s), 50%);
  --primary-light: hsl(var(--primary-h), var(--primary-s), 70%);
  --primary-dark: hsl(var(--primary-h), var(--primary-s), 30%);

  /* Modern: oklch for perceptually uniform colors */
  --accent: oklch(65% 0.25 150);
}

/* currentColor inherits from color property */
.icon-button {
  color: var(--primary);
  border: 2px solid currentColor;
  /* SVG icon inside inherits color via fill: currentColor */
}
```

---

### Q: Compare CSS units: px, em, rem, %, vw/vh / So sánh các đơn vị CSS 🟡 Mid

**A:** CSS units fall into two categories:

**Absolute**: `px` (1/96th of an inch on screen). Predictable but does not scale with user preferences.

**Relative**:
- `em` -- relative to the element's own font-size (or parent's font-size for the `font-size` property itself). Compounds when nested.
- `rem` -- relative to the root (`<html>`) font-size. Predictable, no compounding. Best for font sizes and spacing.
- `%` -- relative to parent's corresponding property (width for width, font-size for font-size).
- `vw`/`vh` -- 1% of viewport width/height. Caution: `vh` does not account for mobile browser chrome (address bar). Use `dvh` (dynamic viewport height) instead.
- `ch` -- width of the "0" character. Useful for setting max line width (`max-width: 65ch`).

**Best practices**: Use `rem` for font-sizes (respects user browser settings), `px` for borders/shadows, relative units for layout widths, `dvh`/`svh` instead of `vh` on mobile.

Vietnamese: `px` tuyệt đối, không scale theo user preference. `rem` tương đối root font-size, không compound -- tốt nhất cho font-size và spacing. `em` tương đối element's own font-size, bị compound khi nested. `vw/vh` tương đối viewport. `vh` có vấn đề trên mobile (address bar), dùng `dvh` thay thế. Best practice: `rem` cho font-size (tôn trọng browser settings), `px` cho border/shadow.

```css
html { font-size: 16px; } /* 1rem = 16px */

body { font-size: 1rem; }     /* 16px */
h1   { font-size: 2rem; }     /* 32px -- always relative to root */
.small { font-size: 0.875rem; } /* 14px */

/* em compounding problem */
.parent { font-size: 1.2em; }   /* 19.2px (16 * 1.2) */
.parent .child { font-size: 1.2em; } /* 23.04px (19.2 * 1.2) -- compounds! */

/* Responsive layout without media queries */
.container {
  width: min(90vw, 1200px);
  margin-inline: auto;
  padding: clamp(1rem, 3vw, 3rem);
}

/* Optimal reading width */
.prose { max-width: 65ch; }
```

---

### Q: Explain CSS selectors: types, combinators, and performance / Selectors: loại, combinator, và performance 🔴 Senior

**A:** CSS selectors from simple to complex:

**Simple**: type (`p`), class (`.card`), ID (`#main`), universal (`*`), attribute (`[type="text"]`).

**Combinators**: descendant (` `), child (`>`), adjacent sibling (`+`), general sibling (`~`).

**Pseudo-classes**: state (`:hover`, `:focus`, `:active`), structural (`:first-child`, `:nth-child(2n)`), functional (`:is()`, `:where()`, `:not()`, `:has()`).

**Performance**: Browsers match selectors right-to-left. The rightmost part (key selector) is evaluated first. `.nav ul li a` checks every `<a>` on the page, then walks up to check ancestors. In practice, selector performance is rarely a bottleneck in modern browsers, but avoid deeply nested selectors for maintainability. `:has()` can be expensive if overused on large DOMs because it is a "parent selector" requiring upward tree traversal.

Vietnamese: Selectors browser match từ phải sang trái -- rightmost selector kiểm tra trước. Trong thực tế, performance selector hiếm khi là bottleneck trên browser hiện đại, nhưng nên giữ selector đơn giản (max 3 levels) cho maintainability. `:has()` là parent selector, có thể tốn performance trên DOM lớn.

```css
/* Type: low specificity, good for resets */
p { margin-bottom: 1em; }

/* Class: preferred for components */
.card { border: 1px solid #ddd; }

/* Combinator: child selector (direct children only) */
.nav > li { display: inline-block; }

/* Structural pseudo-class */
tr:nth-child(even) { background: #f5f5f5; }

/* Functional pseudo-class */
:is(h1, h2, h3) { font-weight: 700; }
:where(.reset, .base) p { margin: 0; } /* zero specificity */

/* Parent selector (modern, use with care) */
.form-group:has(:invalid) {
  border-color: red;
}
```

---

### Q: What are pseudo-classes vs pseudo-elements? / Phân biệt pseudo-class và pseudo-element 🟢 Junior

**A:** **Pseudo-classes** (single colon `:`) select elements in a particular **state**: `:hover`, `:focus`, `:first-child`, `:nth-child()`, `:checked`, `:disabled`, `:focus-visible`. They do not create new elements.

**Pseudo-elements** (double colon `::`) create **virtual elements** that do not exist in the DOM: `::before`, `::after`, `::first-line`, `::first-letter`, `::placeholder`, `::selection`, `::marker`. They require the `content` property for `::before`/`::after`.

Vietnamese: Pseudo-class (`:`) chọn element theo trạng thái (hover, focus, first-child) -- không tạo element mới. Pseudo-element (`::`) tạo element ảo không có trong DOM (before, after, first-line). `::before`/`::after` bắt buộc có `content` property. Lưu ý: `::before/::after` không hoạt động trên `<img>`, `<input>`, `<br>` vì chúng là void elements.

```css
/* Pseudo-classes: element state */
a:hover { color: blue; }
a:focus-visible { outline: 2px solid blue; } /* keyboard focus only */
input:checked + label { font-weight: bold; }
li:first-child { margin-top: 0; }

/* Pseudo-elements: virtual elements */
.required::after {
  content: ' *';
  color: red;
}

blockquote::before {
  content: '\201C'; /* opening curly quote */
  font-size: 3em;
  color: #ccc;
}

::selection {
  background: #b3d4fc;
  color: #000;
}

/* Style list markers */
li::marker {
  color: var(--primary);
  font-weight: bold;
}
```

---

### Q: How does CSS inheritance work? Which properties inherit? / CSS inheritance hoạt động ra sao? 🟡 Mid

**A:** Inheritance is the mechanism where child elements receive computed values from their parent. Not all properties inherit by default.

**Inherited properties** (text-related): `color`, `font-*`, `line-height`, `letter-spacing`, `word-spacing`, `text-align`, `text-indent`, `text-transform`, `white-space`, `direction`, `visibility`, `cursor`, `list-style-*`.

**Non-inherited properties** (box-related): `margin`, `padding`, `border`, `width`, `height`, `display`, `position`, `background`, `overflow`, `z-index`, `opacity`, `transform`.

You can force inheritance with `inherit`, prevent it with `initial`, or use the cascade default with `unset` (`inherit` if the property normally inherits, `initial` otherwise). `revert` restores the browser default.

Vietnamese: Inheritance là cơ chế child nhận giá trị computed từ parent. Các property liên quan text thường inherit (color, font, line-height, text-align...). Các property liên quan box thường không inherit (margin, padding, border, width, background...). Dùng `inherit` để ép kế thừa, `initial` để reset về giá trị spec default, `unset` để reset thông minh (inherit nếu normally inherits, initial nếu không), `revert` để về browser default.

```css
body {
  color: #333;            /* inherits to all text elements */
  font-family: Inter, sans-serif; /* inherits to all elements */
  line-height: 1.5;       /* inherits */
}

/* Children automatically get body's color, font, line-height */
/* But NOT margin, padding, border, background */

.reset-all {
  all: unset; /* resets ALL properties to inherited or initial */
}

/* Force inheritance where it doesn't normally happen */
.inherit-background {
  background: inherit; /* background doesn't normally inherit */
}
```
