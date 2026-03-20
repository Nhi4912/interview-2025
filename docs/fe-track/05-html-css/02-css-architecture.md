# CSS Architecture for Scalable Frontend Systems / Kiến Trúc CSS Cho Hệ Thống Frontend Mở Rộng

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

Bạn vừa join một startup đang scale từ 3 lên 15 frontend devs. Codebase có ~80 components, mỗi người viết CSS theo style riêng: một số dùng BEM, một số dùng utility classes tay, một số inline style. Button `.btn-primary` bị override 7 chỗ khác nhau. Dark mode chưa ai làm vì không biết bắt đầu từ đâu.

Tech lead giao bạn một việc: **design CSS architecture cho codebase mới**, migrate dần từ codebase cũ. Timeline: 3 tháng.

**Câu hỏi thực tế**: BEM, CSS Modules, hay Tailwind? Token hay variable? Cascade Layers hay không? Làm sao enforce convention cho team 15 người?

---

## What & Why / Cái Gì & Tại Sao

**CSS Architecture là gì?**
Là hệ thống quy tắc tổ chức CSS: naming convention, file structure, scope isolation, token strategy — để nhiều người cùng làm mà không conflict.

**Tại sao cần nó?**
- **Level 1 — Immediate pain**: Không có convention → mỗi dev viết style khác nhau → specificity war → `!important` chồng chất → không ai dám sửa CSS cũ vì sợ break.
- **Level 2 — Scale pain**: 15 devs, 80 components, 3 teams — không có scope isolation → style leak giữa components → visual regression hàng tuần → release chậm.
- **Level 3 — Product pain**: Product cần dark mode, white-label, accessible themes → không có design tokens → phải hard-code màu 200+ chỗ → mỗi brand request = 2-week sprint.

**Tóm lại**: CSS architecture là "governance layer" giữa design và implementation. Thiếu nó, cost-of-change tăng theo cấp số nhân với team size.

---

## Concept Map / Sơ Đồ Khái Niệm

```
CSS Architecture
├── Methodology (naming + structure)
│   ├── BEM → predictable naming, no cascade dependency
│   ├── OOCSS → separate structure from skin
│   ├── SMACSS → 5-layer categorization
│   ├── ITCSS → specificity pyramid (Generic→Elements→Objects→Components→Utilities)
│   └── Atomic/Utility-first → Tailwind, no custom CSS
│
├── Scope Isolation (prevent leaking)
│   ├── CSS Modules → build-time hash scoping
│   ├── CSS-in-JS → runtime scoping (Styled Components)
│   └── Cascade Layers (@layer) → manual specificity control
│
└── Token Strategy (design → code)
    ├── Design Tokens → semantic names (--color-brand-primary)
    ├── CSS Custom Properties → runtime theming
    └── Theme Switching → [data-theme="dark"] scope
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### Core Concept 1: CSS Methodology Trade-offs — BEM vs Atomic vs Hybrid

🧠 **Memory Hook**: BEM = blueprint (stable, verbose). Atomic = lego bricks (fast, repetitive). Hybrid = blueprint + lego for adjustments.

**Why does this exist? / Tại sao tồn tại?**
- **Level 1**: Dev viết `.card`, `.card-header`, `.card-body` không nhất quán → 10 devs = 10 naming styles → không ai biết class nào dùng được.
- **Level 2**: Cần convention có thể enforce bằng linter + review — naming phải mang ý nghĩa (component? modifier? state?).

**Visual — BEM vs Atomic spectrum**:
```
Verbose ←————————————————————————→ Terse
BEM                    SMACSS/OOCSS          Atomic/Tailwind
.card__header--active  .card.is-active       flex items-center gap-4

Pros: readable, stable   balanced             fast, no CSS files
Cons: verbose, long HTML  moderate            HTML bloat, hard search
```

**Common Mistakes / Sai lầm thường gặp**:
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| BEM everywhere including utilities | BEM for components, utilities for adjustments |
| `div__span--modifier` (nesting DOM) | BEM reflects component structure, not DOM nesting |
| `.button--red`, `.button--blue` | `.button--primary`, `.button--danger` (semantic, not color) |
| Atomic CSS without design system | Atomic only works with token-constrained design system |

🎯 **Interview Pattern**:
- **Trigger**: "Which CSS methodology do you prefer?" / "How do you organize CSS?"
- **Concept**: BEM-Atomic-Hybrid trade-off based on team size and product stage
- **Opening**: "It depends on team size and design system maturity — I use BEM for components and utility layer for adjustments, because..."

🔑 **Knowledge Chain**:
- **Prereq**: CSS specificity, cascade rules
- **Enables**: CSS Modules integration, Tailwind config, linting setup

---

### Core Concept 2: CSS Scope Isolation — Modules, Cascade Layers, CSS-in-JS

🧠 **Memory Hook**: CSS Modules = build-time prison (hash). Cascade Layers = specificity firewall. CSS-in-JS = runtime jail (class generated per render).

**Why does this exist? / Tại sao tồn tại?**
- **Level 1**: Global CSS + multiple components → `.title` in `Card.css` overrides `.title` in `Modal.css` → style leak → visual regression every release.
- **Level 2**: Need isolation guarantees at either build-time (CSS Modules) or runtime (CSS-in-JS) — or manual layer discipline (Cascade Layers).

**Visual — isolation mechanisms**:
```css
/* CSS Modules — build-time hash */
/* Input: .card { } in Card.module.css */
/* Output: .card_abc123 { }  ← guaranteed unique */

/* Cascade Layers — manual specificity control */
@layer reset, base, components, utilities;
@layer components { .card { color: red; } }  /* lower specificity than utilities layer */
@layer utilities { .text-red { color: red; } } /* wins — even if lower in file */

/* Without layers: file order + specificity determines winner (unpredictable) */
/* With layers: layer order always determines winner (predictable) */
```

**Common Mistakes / Sai lầm thường gặp**:
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| CSS Modules + global class names in same element | Use `:global()` intentionally for third-party overrides |
| `@layer` without declaring order first | Always declare `@layer reset, base, components, utilities;` at top |
| CSS-in-JS for static styles | CSS-in-JS best for dynamic styles; use CSS Modules for static |
| Assume CSS Modules prevents all leaks | `:global()` and keyframe names still leak |

🎯 **Interview Pattern**:
- **Trigger**: "How do you prevent CSS style conflicts?" / "CSS Modules or CSS-in-JS?"
- **Concept**: Scope isolation trade-off — build-time vs runtime vs manual layer control
- **Opening**: "I prefer CSS Modules for component scope because it's zero-runtime and gives build-time guarantees, but Cascade Layers are the platform-native solution..."

🔑 **Knowledge Chain**:
- **Prereq**: CSS specificity algorithm, build tooling (webpack/vite)
- **Enables**: Design token theming, multi-team parallel development

---

### Core Concept 3: Design Tokens + CSS Custom Properties for Theming

🧠 **Memory Hook**: Token = "decision captured as name" (`--color-brand-primary`, not `#0066cc`). Variable = runtime slot. Token feeds variable.

**Why does this exist? / Tại sao tồn tại?**
- **Level 1**: Hard-coded `color: #0066cc` in 200 components → product wants dark mode → need to change 200 files → impossible to maintain.
- **Level 2**: Need a single source of truth for design decisions (color, spacing, typography) that can change at runtime — CSS Custom Properties enable this; design tokens name it semantically.

**Visual — token hierarchy**:
```css
/* Design Token Layer (semantic names) */
:root {
  --color-brand-primary: #0066cc;  /* primitive */
  --color-surface-bg: #ffffff;      /* semantic */
  --space-md: 16px;
}

/* Theme Override (runtime, zero JS) */
[data-theme="dark"] {
  --color-brand-primary: #4da6ff;
  --color-surface-bg: #1a1a2e;
}

/* Component consumes tokens, not primitives */
.button {
  background: var(--color-brand-primary);  /* ✅ themed */
  /* background: #0066cc;  ❌ hard-coded, unthemeable */
}
```

**Common Mistakes / Sai lầm thường gặp**:
| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `--blue: #0066cc` (color-named token) | `--color-brand-primary: #0066cc` (semantic) |
| Override token inside component | Override token at theme scope (`[data-theme]`) |
| Use CSS variables for layout constants | CSS variables are runtime (good for theme); use Sass vars/constants for static layout |
| JS-driven theme with `className` toggle | CSS-driven with `data-theme` attribute — zero JS, instant |

🎯 **Interview Pattern**:
- **Trigger**: "How would you implement dark mode?" / "What are design tokens?"
- **Concept**: Token → CSS Custom Property → runtime theme switching via data attribute
- **Opening**: "Design tokens capture design decisions as semantic names — `--color-brand-primary` instead of `#0066cc` — so the component layer never knows about specific color values..."

🔑 **Knowledge Chain**:
- **Prereq**: CSS Custom Properties, cascade specificity
- **Enables**: Multi-brand theming, accessible high-contrast mode, design system integration

---

## Reference Theory / Lý Thuyết Tham Khảo

> (Existing content continues below)

## Overview

Trong các dự án FE thực tế, CSS thường hỏng không phải vì thiếu syntax, mà vì thiếu kiến trúc.
Tài liệu này tập trung vào cách tổ chức CSS theo tư duy hệ thống để team có thể mở rộng sản phẩm qua nhiều năm.

### Overview / Tổng Quan
- Mục tiêu: viết CSS có thể dự đoán, tái sử dụng, và bảo trì ở quy mô lớn.
- Trọng tâm: methodology (BEM, OOCSS, SMACSS, ITCSS, Atomic CSS), tổ chức file, naming, theming.
- Bối cảnh hiện đại: CSS Modules, utility-first (Tailwind), CSS-in-JS, design tokens.

### Explanation / Giải thích
Kiến trúc CSS là lớp "governance" giữa thiết kế và implementation.
Nếu không có governance, dự án sẽ rơi vào: specificity war, override chồng chéo, style leak, và performance regression.

### Example / Ví dụ
Một class như `.card` trong codebase nhỏ có thể ổn.
Nhưng ở codebase lớn, `.card` có thể bị ghi đè bởi `.dashboard .card`, `.theme-dark .card`, `#app .card`.
Từ đó xuất hiện chuỗi `!important`, làm tăng chi phí bảo trì theo cấp số nhân.

## Why CSS Architecture Matters / Vì Sao Kiến Trúc CSS Quan Trọng

### Overview / Tổng Quan
- Giảm rủi ro regressions khi thêm feature mới.
- Giúp onboarding nhanh cho dev mới.
- Tăng tính nhất quán UI giữa các team.
- Tối ưu bundle CSS và tốc độ render.

### Explanation / Giải thích
Ở hệ thống sản phẩm lớn, "chi phí thay đổi" quan trọng hơn tốc độ viết ban đầu.
Kiến trúc tốt không làm bạn viết CSS nhanh nhất hôm nay, nhưng giúp bạn thay đổi an toàn trong 6-18 tháng tới.

### Example / Ví dụ
Khi product cần dark mode + white-label cùng lúc, codebase có design tokens và layer rõ ràng sẽ implement nhanh hơn đáng kể so với codebase style rời rạc.

## Core Principles / Nguyên Tắc Nền Tảng

### Predictability
#### Overview / Tổng Quan
- Selector đơn giản, không phụ thuộc ngữ cảnh sâu.
- Tránh side effect toàn cục.

#### Explanation / Giải thích
Predictability nghĩa là đọc class name có thể đoán được behavior.
Nếu behavior phụ thuộc chain selector dài, code trở nên "khó suy luận".

#### Example / Ví dụ
Ưu tiên `.button--primary` hơn `.header .cta button`.

### Scalability
#### Overview / Tổng Quan
- CSS phải mở rộng theo số lượng component và số lượng contributor.

#### Explanation / Giải thích
Scalability không chỉ là thêm dòng code; đó là kiểm soát độ phức tạp khi nhiều team cùng sửa.

#### Example / Ví dụ
Tách `tokens`, `components`, `utilities` giúp tránh mọi thứ dồn vào `global.css`.

### Reusability
#### Overview / Tổng Quan
- Tách structure và skin.
- Tái dùng pattern thay vì copy-paste class.

#### Explanation / Giải thích
Reuse tốt giảm duplication, đảm bảo consistency và giảm lỗi visual drift.

#### Example / Ví dụ
`.media` object có thể dùng cho comment, notification, profile list.

### Low Specificity
#### Overview / Tổng Quan
- Giữ specificity thấp để override có chủ đích.

#### Explanation / Giải thích
Specificity cao tạo lock-in: muốn thay đổi phải viết selector cao hơn hoặc dùng `!important`.

#### Example / Ví dụ
Dùng class selector thay vì id selector cho style UI.

## BEM Methodology / Phương Pháp BEM

### Overview / Tổng Quan
BEM (Block, Element, Modifier) là methodology phổ biến nhất để đặt tên class theo cấu trúc component.

### Explanation / Giải thích
- **Block**: thực thể độc lập (`.card`, `.button`, `.navbar`)
- **Element**: phần tử thuộc block (`.card__title`, `.card__body`)
- **Modifier**: biến thể (`.card--featured`, `.button--danger`)

BEM giảm mơ hồ và giúp đọc HTML như đọc API của component.

### Example / Ví dụ
```html
<article class="card card--featured">
  <h3 class="card__title">Senior Frontend Interview</h3>
  <p class="card__description">Systematic prep with theory and drills.</p>
  <button class="card__action button button--primary">Start</button>
</article>
```

```css
.card {}
.card__title {}
.card__description {}
.card--featured {}
.button {}
.button--primary {}
```

### BEM Interview Angle
- Ưu điểm: rõ ràng, scalable, team-friendly.
- Nhược điểm: class name dài, HTML "nặng class".
- Khi dùng: design system, multi-team app, codebase dài hạn.

## OOCSS / Object-Oriented CSS

### Overview / Tổng Quan
OOCSS nhấn mạnh hai nguyên tắc:
1) Tách structure khỏi skin.
2) Tách container khỏi content.

### Explanation / Giải thích
OOCSS xem style như object tái sử dụng.
Bạn định nghĩa object một lần, dùng ở nhiều nơi với skin khác nhau.

### Example / Ví dụ
```css
.media { display: flex; gap: 0.75rem; }
.media__figure { flex: 0 0 auto; }
.media__body { flex: 1; }
.skin-elevated { box-shadow: 0 2px 12px rgb(0 0 0 / 0.08); border-radius: 12px; }
```

```html
<div class="media skin-elevated">
  <img class="media__figure" src="/avatar.png" alt="avatar" />
  <div class="media__body">Interview tips...</div>
</div>
```

## SMACSS / Scalable and Modular Architecture for CSS

### Overview / Tổng Quan
SMACSS phân loại rule theo vai trò để quản lý lớn dễ hơn:
- Base
- Layout
- Module
- State
- Theme

### Explanation / Giải thích
Điểm mạnh của SMACSS là phân lớp tư duy và giảm "style lẫn vai trò".
Base cho reset/typography, Layout cho bố cục lớn, Module cho component, State cho trạng thái, Theme cho brand/theme.

### Example / Ví dụ
```css
/* Base */
html, body { margin: 0; }

/* Layout */
.l-shell { max-width: 1200px; margin-inline: auto; }

/* Module */
.card { border: 1px solid var(--color-border); }

/* State */
.is-loading { opacity: 0.6; pointer-events: none; }

/* Theme */
.theme-dark { --color-border: #2f3542; }
```

## ITCSS / Inverted Triangle CSS

### Overview / Tổng Quan
ITCSS tổ chức CSS từ generic đến cụ thể theo mô hình tam giác ngược:
- Settings
- Tools
- Generic
- Elements
- Objects
- Components
- Utilities

### Explanation / Giải thích
Các layer ở trên có phạm vi ảnh hưởng rộng và specificity thấp.
Các layer dưới cụ thể hơn, ảnh hưởng hẹp hơn.
Mục tiêu là kiểm soát cascade theo kiến trúc thay vì ngẫu nhiên.

### Example / Ví dụ
Một dự án có thể map thành:
- `styles/settings/tokens.css`
- `styles/generic/reset.css`
- `styles/objects/stack.css`
- `styles/components/button.css`
- `styles/utilities/text.css`

## Atomic CSS / Utility-First Thinking

### Overview / Tổng Quan
Atomic CSS định nghĩa class nhỏ, một trách nhiệm (single-purpose), ví dụ `.mt-4`, `.text-sm`, `.flex`.

### Explanation / Giải thích
Ưu điểm:
- tốc độ build UI nhanh,
- consistency cao,
- tránh naming đau đầu.
Nhược điểm:
- HTML dài,
- cần kỷ luật design token,
- có thể khó đọc với người mới.

### Example / Ví dụ
```html
<button class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Apply
</button>
```

## CSS-in-JS vs CSS Modules

### CSS Modules
#### Overview / Tổng Quan
CSS Modules tạo scope cục bộ cho class, tránh xung đột global.

#### Explanation / Giải thích
Trong hệ Next.js/React, CSS Modules là lựa chọn cân bằng giữa performance và maintainability.
Class vẫn là CSS thật, tooling đơn giản, SSR thân thiện.

#### Example / Ví dụ
```tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.root}>Apply</button>
}
```

### CSS-in-JS
#### Overview / Tổng Quan
CSS-in-JS đặt style trong JavaScript/TypeScript để tận dụng dynamic styling và component co-location.

#### Explanation / Giải thích
Ưu điểm: dynamic theme dễ, logic và style gần nhau.
Trade-off: runtime overhead (tuỳ thư viện), SSR complexity, bundle implications.

#### Example / Ví dụ
```tsx
const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
}
```

### Khi nào chọn gì?
- Team ưu tiên simplicity + SSR ổn định: CSS Modules.
- Team cần theming động phức tạp ở runtime: cân nhắc CSS-in-JS.
- Team muốn tốc độ lắp ghép UI cao: utility-first/Tailwind.

## Tailwind Utility-First Approach

### Overview / Tổng Quan
Tailwind hiện thực Atomic CSS ở mức framework + design token system.

### Explanation / Giải thích
Tailwind không chỉ là utility class; nó còn cung cấp scale thống nhất cho spacing, color, typography.
Điểm quan trọng trong phỏng vấn: utility-first không loại bỏ kiến trúc, mà chuyển kiến trúc vào config/token/convention.

### Example / Ví dụ
```html
<section class="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
  <h2 class="text-xl font-semibold md:text-2xl">Interview Plan</h2>
  <p class="mt-2 text-sm text-slate-600">Theory first, then drills.</p>
</section>
```

## Naming Conventions / Quy Ước Đặt Tên

### Overview / Tổng Quan
Naming là hợp đồng giao tiếp giữa dev với dev.

### Explanation / Giải thích
Nguyên tắc tốt:
- Ưu tiên semantic theo vai trò (`card`, `banner`, `hero`) thay vì visual (`blue-box`).
- Trạng thái dùng prefix nhất quán (`is-`, `has-`).
- Utility dùng pattern ngắn, có hệ (`u-text-center`, `u-mt-16`).

### Example / Ví dụ
- Tốt: `.profile-card__avatar`, `.is-active`
- Không tốt: `.leftBlueBig`, `.x1`, `.tmp2`

## File Organization / Tổ Chức File

### Overview / Tổng Quan
Cấu trúc file nên phản ánh architecture.

### Explanation / Giải thích
Ví dụ cấu trúc có chủ đích:
- `styles/tokens/`
- `styles/base/`
- `styles/objects/`
- `styles/components/`
- `styles/utilities/`

Với Next.js App Router và CSS Modules, có thể kết hợp:
- global layer cho tokens/base/utilities
- module file theo component

### Example / Ví dụ
```text
src/
  components/
    Button/
      Button.tsx
      Button.module.css
  styles/
    tokens.css
    globals.css
    utilities.css
```

## Scalable CSS Strategies / Chiến Lược Mở Rộng CSS

### Overview / Tổng Quan
Không có methodology "best" cho mọi dự án; có chiến lược phối hợp.

### Explanation / Giải thích
Một chiến lược thực dụng cho team FE:
1. Dùng design tokens làm nền.
2. Dùng CSS Modules cho component scope.
3. Dùng utility có kiểm soát cho spacing/layout nhanh.
4. Dùng naming convention nhất quán cho state/variant.
5. Giới hạn specificity và cấm deep selector không cần thiết.

### Example / Ví dụ
Trong component phức tạp, áp dụng:
- semantic class cho structure,
- utility class cho micro-adjustment,
- token variable cho theme.

## Theming Patterns / Mẫu Thiết Kế Theme

### Overview / Tổng Quan
Theming là khả năng đổi visual system (dark mode, brand mode, high-contrast) mà không viết lại component.

### Explanation / Giải thích
Pattern phổ biến:
- CSS variables cho token (`--color-bg`, `--color-text`).
- Theme scope bằng attribute/class (`[data-theme='dark']`).
- Component consume token, không hard-code màu.

### Example / Ví dụ
```css
:root {
  --color-bg: #ffffff;
  --color-text: #0f172a;
}

[data-theme='dark'] {
  --color-bg: #0b1020;
  --color-text: #e2e8f0;
}

.page {
  background: var(--color-bg);
  color: var(--color-text);
}
```

## Anti-Patterns / Mùi Hôi Thường Gặp

### Overview / Tổng Quan
- Lạm dụng `!important`
- Selector chain quá sâu
- Global reset phá third-party UI
- Copy-paste style thay vì abstraction
- Không có token system

### Explanation / Giải thích
Các anti-pattern này làm tốc độ thêm feature ban đầu có vẻ nhanh, nhưng tạo "nợ CSS" lớn.

### Example / Ví dụ
Selector như `#app .left-pane .menu ul li a span` là tín hiệu kiến trúc yếu.

## Interview Strategy / Chiến Lược Trả Lời Phỏng Vấn

### Overview / Tổng Quan
Nhà tuyển dụng muốn thấy tư duy trade-off, không chỉ định nghĩa.

### Explanation / Giải thích
Khi trả lời câu hỏi CSS architecture:
1. Nêu context (team size, scale, product stage).
2. Đưa lựa chọn và lý do.
3. Nêu risk + mitigation.
4. Cho ví dụ migration thực tế.

### Example / Ví dụ
"Team 6 người, app B2B nhiều màn hình. Em chọn CSS Modules + token + utility layer. Vì cần tránh global collision, đảm bảo theme consistency, và giữ runtime nhẹ."

## Related References / Tài Liệu Liên Quan
- [Architecture Styles](../../shared/05-software-engineering/02-architecture-styles.md)
- [CSS Architecture Comprehensive](./04-css-architecture-comprehensive.md)
- [CSS Architecture Theory](./07-css-architecture-theory.md)

---

## Interview Q&A

### Q1: What is BEM and what problem does it solve? / BEM là gì và nó giải quyết vấn đề gì? 🟢 Junior

**A:** BEM (Block-Element-Modifier) is a CSS naming convention: `.block__element--modifier`. It solves **naming collision and readability** at scale by making class names self-documenting and independent of DOM nesting.

```css
/* BEM naming — readable, no cascade dependency */
.card { }                         /* Block */
.card__header { }                 /* Element */
.card__header--featured { }       /* Modifier */
.card--dark { }                   /* Block modifier */

/* ❌ Without BEM — context-dependent, fragile */
.card .header { }                 /* Breaks if DOM structure changes */
.card .header.featured { }        /* Specificity conflict risk */
```

BEM giải quyết 3 vấn đề cốt lõi: (1) **predictability** — đọc class name biết ngay context; (2) **no cascade dependency** — không cần nesting selector; (3) **teamwork** — mọi người dùng cùng convention, review dễ hơn.

**Trade-off**: HTML verbose hơn. Ở team lớn, BEM + linter tốt hơn tự do naming. Ở project nhỏ với utility-first framework như Tailwind, BEM overhead không đáng.

💡 **Interview Signal**:
- ✅ Strong: "BEM makes CSS predictable by encoding component structure in class names, eliminating cascade dependency — I can move `.card__header` anywhere in the DOM and it still works."
- ❌ Weak: "BEM is a naming convention for CSS" (definition without trade-off understanding)

---

### Q2: CSS Modules vs CSS-in-JS — when to use each? / CSS Modules vs CSS-in-JS — khi nào dùng cái nào? 🟡 Mid

**A:** CSS Modules provides **build-time scope** (zero runtime cost); CSS-in-JS provides **runtime scope with dynamic styling**. Choose based on whether styles need to react to JavaScript state.

```tsx
// CSS Modules — static styles, build-time hash
// Button.module.css → .button_abc123 { }
import styles from './Button.module.css'
<button className={styles.button}>Click</button>

// CSS-in-JS (Styled Components) — dynamic styles
// ✅ Good when styles depend on props/state
const Button = styled.button<{ $variant: 'primary' | 'danger' }>`
  background: ${p => p.$variant === 'primary' ? 'blue' : 'red'};
`

// Rule: if style depends on JS value at runtime → CSS-in-JS
// Rule: if style is static/semi-static → CSS Modules (faster, SSR-friendly)
```

**Decision matrix**:
| Factor | CSS Modules | CSS-in-JS |
|--------|------------|-----------|
| Runtime cost | None | ~5-15KB + style recalc |
| Dynamic styles | Via CSS vars only | Native |
| SSR | Simple | Needs hydration (RSC issues) |
| Co-location | Separate `.module.css` | Same file |

CSS Modules + CSS custom properties thường là sweet spot cho production: static performance với dynamic theming qua tokens.

💡 **Interview Signal**:
- ✅ Strong: "CSS Modules for static component styles, CSS-in-JS only when styles must react to JS state — CSS Modules is zero-runtime and SSR-friendly which matters for Next.js."
- ❌ Weak: "CSS-in-JS is better because it's co-located" (ignores SSR complexity and runtime cost)

---

### Q3: How do you implement dark mode with design tokens? / Làm thế nào implement dark mode với design tokens? 🟡 Mid

**A:** Use **semantic CSS custom properties** (tokens) scoped to theme attributes. Components consume tokens, never raw colors — theme switch is a single attribute change.

```css
/* Token definitions — semantic, not color-named */
:root {
  --color-surface-bg: #ffffff;
  --color-surface-text: #1a1a1a;
  --color-brand-primary: #0066cc;
  --space-md: 16px;
}

/* Dark theme override */
[data-theme="dark"] {
  --color-surface-bg: #1a1a2e;
  --color-surface-text: #e8e8f0;
  --color-brand-primary: #4da6ff;
}

/* Component uses tokens only */
.card {
  background: var(--color-surface-bg);    /* ✅ auto-themed */
  color: var(--color-surface-text);
  /* background: #ffffff; ❌ unthemeable */
}
```

```javascript
// Theme switch: single DOM attribute, zero JS style calculation
document.documentElement.setAttribute('data-theme', 'dark')
// CSS cascade handles everything — no JS loop over components
```

**Why `data-theme` over class toggle?**: `data-theme` is more semantic, can be scoped to subtree (`<div data-theme="dark">`), and works with CSS `:has()` for complex conditional theming.

💡 **Interview Signal**:
- ✅ Strong: "Semantic tokens mean the component never knows about specific color values — dark mode is just overriding token values at the root scope, zero component changes needed."
- ❌ Weak: "Add a `.dark` class to body and write `.dark .card { background: #1a1a2e }`" (hardcodes colors in each component, doesn't scale)

---

### Q4: How do you enforce CSS architecture in a 15-person team? / Làm thế nào enforce CSS architecture trong team 15 người? 🔴 Senior

**A:** Enforcement requires **automated tooling** + **process gates** + **token constraints** — convention documents alone fail at scale.

```json
// stylelint.config.js — enforce BEM + token usage
{
  "rules": {
    "selector-class-pattern": "^[a-z][a-z0-9]*(__[a-z][a-z0-9]*)?(--[a-z][a-z0-9]*)?$",
    "custom-property-pattern": "^(color|space|font|size|radius)-",
    "declaration-property-value-disallowed-list": {
      "color": ["#[0-9a-fA-F]+", "rgb\\("],  // enforce token usage
      "background-color": ["#[0-9a-fA-F]+", "rgb\\("]
    }
  }
}
```

**Enforcement layers**:
1. **Linting** (automated): `stylelint` BEM pattern + disallow raw color values (must use tokens)
2. **PR template**: CSS review checklist — specificity, token usage, no `!important` without comment
3. **Token as constraint**: Design system exports tokens → devs *can't* hardcode colors because tokens are the only documented values
4. **Visual regression CI**: Chromatic/Percy on PR — catches unintended style changes before merge
5. **Architectural decision record (ADR)**: Document why BEM+Modules over alternatives → new devs understand rather than fight the system

**Common failure mode**: Convention document → devs ignore → entropy. Fix: make the correct path the path of least resistance (linter + token system make wrong approach harder than right approach).

💡 **Interview Signal**:
- ✅ Strong: "Make the correct approach the path of least resistance — linting enforces naming, design tokens make hardcoding harder than using tokens, and visual regression CI catches drift automatically."
- ❌ Weak: "Write a style guide document" (documents without enforcement fail at team scale)

---

## Q&A Summary / Tóm Tắt

| Question | Core Insight |
|----------|-------------|
| What is BEM? | Naming convention → no cascade dependency, predictable, teamwork-friendly |
| CSS Modules vs CSS-in-JS | Modules = build-time scope (zero cost); CSS-in-JS = runtime dynamic styling |
| Dark mode with tokens | Semantic tokens → theme = attribute change, zero component edits |
| Enforce at team scale | Linting + token constraints + visual regression CI — automation beats documentation |

---

## ⚡ Cold Call Simulation

**Q: "You have 30 seconds — what is CSS architecture and why does it matter?"**

> "CSS architecture is the system of conventions for naming, structuring, and scoping CSS so a team can scale without specificity conflicts. Without it, you get specificity wars, `!important` everywhere, and style leaks between components. The core tools are: a naming convention like BEM, scope isolation via CSS Modules or Cascade Layers, and design tokens for theming. The goal is making CSS predictable and safe to change — at 15 devs, that means automated enforcement via linting, not just documentation."

---

## Retrieval Self-Check / Kiểm Tra Ghi Nhớ

> Close this document. Answer from memory:

**Retrieval**:
1. What are the 3 problems BEM solves?
2. What is the key difference between CSS Modules and CSS-in-JS scope isolation?
3. What does a semantic design token look like vs a color-named one?
4. Name 3 layers of CSS architecture enforcement for a team.

**Visual**: Sketch the token hierarchy — primitive → semantic → component consumption.

**Application**: You're migrating a legacy codebase with 200 global CSS files. What's your migration strategy using Cascade Layers?

**Debug**: A dark mode implementation requires updating 50 component files for every new theme. What went wrong in the architecture and how do you fix it?

**Teach**: Explain design tokens and CSS custom properties to a junior dev who knows basic CSS.

---

🔁 **Spaced Repetition**: Review in 3 days → 7 days → 14 days.
Focus on: BEM trade-offs, CSS Modules vs CSS-in-JS decision matrix, token hierarchy, team enforcement strategy.

