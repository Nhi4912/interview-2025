# CSS Architecture Theory / Lý thuyết kiến trúc CSS

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [CSS Architecture Practice](./02-css-architecture.md) | [Modern CSS Features](./06-modern-css-features.md) | [CSS Fundamentals](./00-css-fundamentals.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Một team 8 người xây design system cho e-commerce platform. Sau 6 tháng, codebase CSS có vấn đề:
- Không ai dám sửa `.card` vì không biết sẽ break gì
- Dark mode bị implement 3 cách khác nhau bởi 3 dev
- Tailwind utilities và BEM classes trộn lẫn không theo quy tắc
- CI lint check pass nhưng production vẫn có specificity conflicts

Không có CSS architecture rõ ràng, mỗi dev ra quyết định riêng. Kết quả: **CSS spaghetti ở scale lớn**. Hiểu naming methodologies, specificity governance, và design tokens cho phép cả team đi cùng một hướng.

---

## What & Why / Cái Gì & Tại Sao

**CSS Architecture là gì?** CSS không có module system hoặc type system tích hợp sẵn. Mọi class đều global, mọi property đều có thể override nhau. Architecture là **tập hợp conventions** để make CSS scale: naming rules (ai đặt tên class thế nào), specificity rules (selector complexity tối đa là bao nhiêu), và token system (value nào là source of truth).

**Tại sao cần?** Một dev viết CSS không cần architecture. Mười dev viết CSS trong 2 năm không có conventions → `!important` wars, class name collisions, dark mode được implement 3 cách khác nhau. Architecture là **social contract** của CSS team.

**Ba tầng quan trọng nhất:**
1. **Naming** (BEM, utility-first): how classes communicate intent
2. **Specificity governance** (ITCSS, @layer, budget): who wins when styles conflict
3. **Design tokens**: single source of truth for values (colors, spacing, typography)

---

## Concept Map / Bản Đồ Khái Niệm

```
CSS Architecture
│
├── Naming Methodologies
│   ├── BEM (Block__Element--Modifier)
│   │   └── Goal: low specificity + self-documenting class names
│   ├── Utility-First (Tailwind)
│   │   └── Goal: no naming needed, compose visually in HTML
│   └── CUBE CSS (Composition + Utility + Block + Exception)
│       └── Goal: hybrid, CSS cascade is a feature not a bug
│
├── Specificity Governance
│   ├── ITCSS (Inverted Triangle)
│   │   └── Settings → Tools → Generic → Elements → Objects → Components → Utilities
│   ├── Specificity Budget
│   │   └── Rule: max 1 class deep, IDs only for JS hooks
│   └── @layer (modern enforcement)
│       └── Declare layer priority explicitly, tooling-enforced
│
└── Design Tokens
    ├── Primitive tokens (--color-blue-500: #3b82f6)
    ├── Semantic tokens (--color-primary: var(--color-blue-500))
    ├── Component tokens (--btn-bg: var(--color-primary))
    └── Theming (--color-primary changes per theme, components update automatically)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

### Core Concept 1: Naming Methodologies — BEM and Utility-First

> **Memory Hook**: "BEM đặt tên cho mọi thứ. Utility-first không đặt tên gì cả."

**Tại sao tồn tại:**
CSS classes mặc định là global. Không có naming rules → `button`, `card`, `header` clash nhau giữa các dev. BEM giải quyết bằng cách encode component structure vào class name. Utility-first giải quyết khác: không cần tên component vì mỗi class = 1 CSS property.

**BEM — Block, Element, Modifier:**
```css
/* Block: standalone component */
.card { }

/* Element: part of block, cannot exist alone */
.card__title { }
.card__image { }
.card__footer { }

/* Modifier: variation of block or element */
.card--featured { border: 2px solid gold; }
.card__title--large { font-size: 1.5rem; }
```

```html
<article class="card card--featured">
  <h2 class="card__title card__title--large">Title</h2>
  <img class="card__image" src="..." alt="...">
  <footer class="card__footer">...</footer>
</article>
```

**Utility-First:**
```html
<!-- No BEM class needed — compose styles directly in HTML -->
<article class="border-2 border-gold rounded-lg p-4 shadow-md">
  <h2 class="text-xl font-bold text-gray-900">Title</h2>
</article>
```

**Key trade-offs:**

| | BEM | Utility-First |
|---|---|---|
| HTML | Clean semantic classes | Cluttered with utility names |
| CSS | Requires writing & maintaining | Near-zero custom CSS |
| Reuse | Class-based component reuse | Component-level (JS component) |
| Specificity | Always 1 class (0-1-0) | Always 1 class (0-1-0) |
| Design changes | Edit CSS file | Edit HTML/template |

**Common Mistakes:**
- BEM elements nested inside elements: `.card__header__title` — wrong, should be `.card__title`
- BEM modifier without base class: `<div class="card--featured">` — missing `.card` base
- Utility-first for everything including complex interaction states → unmaintainable logic in HTML

**Interview Pattern:** "Tại sao dùng BEM?" → "Low specificity (single class), self-documenting structure, scales in teams."

**Knowledge Chain:** `BEM` → `specificity budget` → `@layer` (modern enforcement) → `CUBE CSS` (hybrid approach)

---

### Core Concept 2: Specificity Governance — ITCSS and Budget

> **Memory Hook**: "ITCSS là kim tự tháp ngược: càng xuống, càng specific, càng ít selector."

**Tại sao tồn tại:**
Cascade conflicts xảy ra khi không có quy tắc về specificity. "Selector nào thắng?" là câu hỏi hàng ngày trong team không có governance. ITCSS cho phép sắp xếp CSS theo specificity từ thấp đến cao — conflict được giải quyết theo layer, không theo selector games.

**ITCSS — 7 layers theo specificity tăng dần:**

```
Settings    ── Custom properties, design tokens (no CSS output)
Tools       ── Mixins, functions (preprocessor only)
Generic     ── Resets, normalize, box-sizing (* { margin: 0 })
Elements    ── Base HTML elements (h1 { }, a { }, p { })
Objects     ── Layout patterns, no visual style (.wrapper, .stack)
Components  ── UI components (.card, .btn, .nav)
Utilities   ── Overrides, single-purpose (.hidden, .mt-4)
```

```css
/* Generic: lowest specificity */
*, *::before, *::after { box-sizing: border-box; }

/* Elements: type selectors */
h1 { font-size: 2rem; line-height: 1.2; }
a  { color: var(--color-link); }

/* Objects: no visual style, layout only */
.o-stack { display: flex; flex-direction: column; }
.o-wrapper { max-width: 1200px; margin-inline: auto; }

/* Components: visual UI */
.c-card { border: 1px solid var(--border-color); border-radius: 0.5rem; }
.c-btn  { padding: 0.5rem 1rem; background: var(--color-primary); }

/* Utilities: highest specificity, override anything */
.u-hidden { display: none !important; }
.u-sr-only { position: absolute; width: 1px; ... }
```

**Specificity Budget:**
- Max 1 class deep: `.card` not `.sidebar .card`
- No IDs for styling (0-1-0 max)
- Utilities may use `!important` — they're intentional overrides
- With modern `@layer`: enforce programmatically, not by convention alone

**Common Mistakes:**
- Components in the wrong layer (utility in component layer → override intent lost)
- Deeply nested selectors in ITCSS objects (`.o-wrapper > .c-card .c-btn`) — defeats the purpose
- Using ITCSS in small projects — overhead not worth it for single-dev or small team

**Interview Pattern:** "Tại sao CSS codebase lớn gặp vấn đề specificity?" → ITCSS: layer-based specificity, each layer only overrides previous layers.

**Knowledge Chain:** `ITCSS` → `@layer` (modern ITCSS) → `specificity budget` → `Stylelint enforcement`

---

### Core Concept 3: Design Tokens — Single Source of Truth

> **Memory Hook**: "Token = tên có nghĩa cho một giá trị. Không ai nhớ `#3b82f6`, ai cũng hiểu `--color-primary`."

**Tại sao tồn tại:**
Hardcoded values (`color: #3b82f6`) scattered across CSS → thay đổi brand color cần grep + replace hàng trăm file. Design tokens tập trung hóa values vào CSS custom properties, tạo ra single source of truth. Khi token thay đổi, mọi component cập nhật tự động.

**Ba tầng token:**

```css
/* Layer 1: Primitive tokens — raw values, no semantic meaning */
:root {
  --blue-50:  #eff6ff;
  --blue-500: #3b82f6;
  --blue-900: #1e3a8a;
  --space-1:  0.25rem;
  --space-4:  1rem;
  --space-8:  2rem;
}

/* Layer 2: Semantic tokens — intent-based aliases */
:root {
  --color-primary:    var(--blue-500);
  --color-bg:         white;
  --color-text:       var(--gray-900);
  --color-border:     var(--gray-200);
  --spacing-component: var(--space-4);
}

/* Layer 3: Component tokens — per-component customization */
.btn {
  --btn-bg:       var(--color-primary);
  --btn-color:    white;
  --btn-padding:  var(--space-2) var(--space-4);
  background: var(--btn-bg);
  color: var(--btn-color);
  padding: var(--btn-padding);
}
```

**Theming with tokens:**
```css
/* Dark mode: only semantic tokens change, components update automatically */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:    var(--gray-900);
    --color-text:  var(--gray-100);
    --color-border: var(--gray-700);
    /* --color-primary stays the same */
  }
}

/* User-toggled theme */
[data-theme="dark"] {
  --color-bg:   var(--gray-900);
  --color-text: var(--gray-100);
}
```

**Common Mistakes:**
- Skipping the semantic layer → components reference primitive tokens directly (`var(--blue-500)`) → theming requires changing every component
- Overly granular tokens (`--btn-border-top-left-radius`) → token sprawl, hard to maintain
- Not scoping component tokens — they're meant to be overridden contextually

**Interview Pattern:** "Làm sao implement dark mode không break component styles?" → semantic tokens: component uses `--color-bg`, dark mode only changes semantic tokens, components update automatically.

**Knowledge Chain:** `design tokens` → `theming` → `CSS custom properties runtime power` → `token pipeline (Style Dictionary, Figma Tokens)` → design-dev handoff

---

## Q&A / Câu Hỏi Phỏng Vấn

### Q: What is BEM and why does it solve CSS naming problems? / BEM là gì và giải quyết vấn đề gì? 🟢 Junior

**A:** BEM (Block, Element, Modifier) is a naming convention that encodes component structure into class names. Block = standalone component (`.card`). Element = part of block (`.card__title`). Modifier = variation (`.card--featured`).

BEM solves two problems: (1) **global namespace collisions** — `.card__title` is unlikely to clash with anything outside the card component, (2) **specificity control** — every BEM class has specificity 0-1-0 (one class), making the cascade predictable.

Vietnamese: BEM encode cấu trúc component vào class name. Block = component độc lập, Element = thành phần của block (dùng `__`), Modifier = biến thể (dùng `--`). Giải quyết: (1) namespace collision — `.card__title` không clash với class nào ngoài card, (2) specificity = luôn 1 class = dễ predict.

```css
.card { } .card__title { } .card--featured { }
/* Never: .sidebar .card (specificity inflation) */
```

> 💡 **Interview Signal**: Nêu được "specificity stays at 1 class" là key — không chỉ "đặt tên dễ đọc". Nhiều dev chỉ biết BEM về naming, không biết mục đích specificity control.

---

### Q: What are design tokens and how do they differ from CSS variables? / Design tokens khác CSS variables thế nào? 🟢 Junior

**A:** Design tokens are **named, semantic values** that represent design decisions (color, spacing, typography). CSS custom properties are the implementation mechanism. Design tokens = the concept; CSS variables = how you implement them in CSS.

The distinction matters for architecture: raw custom properties (`--blue-500: #3b82f6`) are primitive tokens. Semantic tokens (`--color-primary: var(--blue-500)`) give intent. Component tokens (`--btn-bg: var(--color-primary)`) enable contextual overrides.

```css
/* Primitive: raw value */
:root { --blue-500: #3b82f6; }

/* Semantic: intent-based alias */
:root { --color-primary: var(--blue-500); }

/* Component uses semantic, not primitive */
.btn { background: var(--color-primary); }
/* Dark mode only changes --color-bg, --color-text, etc.
   .btn updates automatically */
```

Vietnamese: Design tokens = quyết định design có tên ngữ nghĩa. CSS variables = cách implement. Cần 3 tầng: primitive (giá trị thô), semantic (ý định: primary, bg, text), component (override theo ngữ cảnh). Tầng semantic là key cho theming: dark mode chỉ đổi semantic tokens, components tự cập nhật.

> 💡 **Interview Signal**: Phân biệt primitive vs semantic tokens là senior-level thinking. Junior biết CSS variables, senior biết tại sao cần 3 tầng.

---

### Q: What does CSS module scope mean and why does scoping matter? / CSS module scope là gì và tại sao quan trọng? 🟢 Junior

**A:** CSS has a global namespace by default — a class defined anywhere applies everywhere. "Module scope" means restricting styles so they only apply to their component.

Approaches: (1) **CSS Modules** (build-time): class names are hashed (`card__title_a3f2x`) — guaranteed unique, (2) **BEM** (convention): long unique names by convention, (3) **CSS-in-JS**: styles generated per component instance, (4) **Shadow DOM** (Web Components): native style encapsulation.

Vietnamese: CSS global namespace = class ở đâu apply ở đó — gây collision trong large codebases. Module scope giới hạn styles chỉ apply cho component. CSS Modules: build-time hash class names (`.card__title → .card__title_a3f2x`). BEM: convention-based uniqueness. CSS-in-JS: runtime scoping. Shadow DOM: native browser scoping.

> 💡 **Interview Signal**: Nêu được nhiều approaches và trade-off mỗi cái là mid-level thinking. Key insight: scoping giải quyết vấn đề gì (global namespace collision).

---

### Q: What is ITCSS and how does it manage specificity? / ITCSS quản lý specificity thế nào? 🟡 Mid

**A:** ITCSS (Inverted Triangle CSS) organizes styles into 7 layers ordered from lowest to highest specificity. Each layer should only add specificity, never go backwards. The "inverted triangle" = wide (many generic selectors) at top, narrow (few specific selectors) at bottom.

Layers in order: Settings (tokens, no CSS output) → Tools (mixins) → Generic (reset, `* {}`) → Elements (type selectors: `h1 {}`) → Objects (layout patterns, no visual style) → Components (UI) → Utilities (single-purpose overrides).

Vietnamese: ITCSS sắp xếp CSS theo specificity tăng dần — 7 layers. Generic reset ở đầu (specificity thấp nhất), utility overrides ở cuối (cao nhất). Rule: chỉ thêm specificity theo chiều xuống, không bao giờ ngược lại. Khi có conflict → layer thấp hơn luôn thua.

```css
/* Generic: * selector */
* { box-sizing: border-box; }
/* Elements: type selectors */
h1 { font-size: 2rem; }
/* Objects: layout, no color */
.o-stack { display: flex; flex-direction: column; }
/* Components: UI */
.c-card { background: white; border: 1px solid; }
/* Utilities: !important allowed here */
.u-hidden { display: none !important; }
```

> 💡 **Interview Signal**: Explain được tại sao Utilities layer dùng `!important` hợp lệ trong ITCSS ("intentional final override, at the bottom of the triangle") là senior thinking.

---

### Q: What are the trade-offs of utility-first CSS (Tailwind) vs BEM? / So sánh utility-first và BEM 🟡 Mid

**A:** Both achieve specificity 0-1-0 per class but solve the naming problem differently:

**Utility-first**: no naming required, compose visually in HTML. Pros: fast development, no CSS bloat (only used utilities are generated), consistent design system enforcement. Cons: HTML becomes cluttered, logic in templates not stylesheets, hard to express complex states.

**BEM**: semantic class names, CSS separated from HTML structure. Pros: readable HTML, easier to see component boundaries, better for complex interaction states. Cons: requires naming everything, CSS grows over time.

**Practical rule**: utility-first for product UIs (Tailwind shines here). BEM for design systems/component libraries where consumers need semantic hooks. Many modern projects combine both: Tailwind for layout/spacing, BEM-named semantic classes for complex components.

Vietnamese: Utility-first: không cần đặt tên, compose trong HTML, CSS bundle nhỏ (only used classes). Nhược: HTML cluttered, logic lẫn vào template. BEM: HTML sạch, component boundaries rõ, tốt cho design systems. Nhược: phải đặt tên mọi thứ, CSS tăng theo thời gian. Thực tế: nhiều team kết hợp cả hai.

> 💡 **Interview Signal**: Nêu được "depends on use case" + phân tích trade-off cụ thể là senior answer. Tránh "Tailwind tốt hơn BEM" hoặc ngược lại — không có đáp án tuyệt đối.

---

### Q: How do you implement dark mode with design tokens? / Implement dark mode với design tokens thế nào? 🟡 Mid

**A:** The cleanest approach uses semantic tokens as an indirection layer. Components reference semantic tokens (`--color-bg`, `--color-text`). Switching themes only changes the semantic tokens — all components update automatically without touching component CSS.

Two trigger mechanisms: (1) `@media (prefers-color-scheme: dark)` for OS-level preference, (2) `[data-theme="dark"]` attribute for user-controlled toggle.

```css
/* Semantic tokens — the only things that change between themes */
:root {
  --color-bg:     #ffffff;
  --color-text:   #111827;
  --color-border: #e5e7eb;
  --color-primary: #3b82f6; /* stays same across themes */
}

[data-theme="dark"] {
  --color-bg:     #111827;
  --color-text:   #f9fafb;
  --color-border: #374151;
}

/* Components only reference semantic tokens — no changes needed */
.card {
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

Vietnamese: Dark mode sạch nhất = semantic token layer. Components dùng `--color-bg` thay `white`. Theme switch chỉ đổi semantic tokens — tất cả components tự cập nhật. Trigger: `@media (prefers-color-scheme: dark)` cho OS preference, `[data-theme="dark"]` attribute cho user toggle. Tránh dùng primitive tokens trực tiếp trong components.

> 💡 **Interview Signal**: Phân biệt được "semantic tokens" vs "primitive tokens" trong context của dark mode là key insight. Nhiều dev implement dark mode bằng cách override từng component → không scale.

---

### Q: What is CSS-in-JS and when would you choose it over CSS files? / CSS-in-JS khi nào nên dùng? 🟡 Mid

**A:** CSS-in-JS writes styles as JavaScript expressions, co-located with components. Examples: styled-components, Emotion, vanilla-extract (compile-time). Benefits: automatic scoping (no global namespace), dead code elimination (styles removed with unused components), dynamic styles based on props without class logic.

Costs: (1) runtime overhead (styled-components/Emotion inject styles at runtime, adding JS parse + style injection cost), (2) serialization for SSR (styles must be extracted server-side), (3) developer tooling gaps (CSS features like `@layer` may not be supported).

Modern trend: compile-time CSS-in-JS (vanilla-extract, Linaria, StyleX) eliminates runtime cost by generating static CSS files at build time — best of both worlds.

Vietnamese: CSS-in-JS: viết styles trong JS, co-located với component. Ưu: scoping tự động, dead code elimination, dynamic styles theo props. Nhược: runtime overhead (styled-components inject CSS qua JS), SSR serialization phức tạp. Trend hiện tại: compile-time CSS-in-JS (vanilla-extract, StyleX) = zero runtime, output là static CSS.

> 💡 **Interview Signal**: Mention được "runtime vs compile-time CSS-in-JS" distinction là strong senior signal. Runtime cost của styled-components là reason nhiều team dịch chuyển sang Tailwind hoặc vanilla-extract.

---

### Q: What is CUBE CSS and how does it differ from BEM? / CUBE CSS khác BEM thế nào? 🔴 Senior

**A:** CUBE CSS (Composition, Utility, Block, Exception) is a methodology that treats the CSS cascade as a feature, not a problem. It deliberately allows styles to flow through the cascade, using different layers for different types of styling.

- **Composition**: layout primitives (`.stack`, `.cluster`, `.grid`) — structural, no visual style
- **Utility**: single-purpose classes for common design tokens (`.mt-4`, `.text-bold`)
- **Block**: semantic component classes (`.card`, `.btn`) — visual style
- **Exception**: data-attribute overrides for variations (`[data-variant="featured"]`)

BEM fights the cascade by making every selector maximally specific. CUBE CSS works with the cascade — global styles set sensible defaults, blocks refine them, utilities and exceptions are surgical overrides.

```css
/* Composition: layout primitive */
.stack { display: flex; flex-direction: column; gap: var(--space-4); }

/* Block: visual component */
.card { background: var(--color-bg); border: 1px solid var(--color-border); }

/* Exception: data-attribute variation */
.card[data-variant="featured"] { border-color: gold; }
/* vs BEM: .card--featured */
```

Vietnamese: CUBE CSS coi cascade là tính năng — để styles flow tự nhiên. Composition = layout primitives, Utility = design token shortcuts, Block = visual components, Exception = biến thể qua data attributes. Khác BEM: BEM chống cascade bằng specificity tối đa. CUBE CSS làm việc với cascade. Phù hợp hơn cho modern CSS với custom properties.

> 💡 **Interview Signal**: "BEM fights the cascade; CUBE CSS works with it" — câu này phân biệt senior hiểu cascade sâu với junior chỉ dùng naming convention.

---

### Q: What is a specificity budget and how do you enforce it? / Specificity budget là gì và enforce thế nào? 🔴 Senior

**A:** A specificity budget is a team agreement on the maximum acceptable specificity for different selector types. Example budget:

- Default elements: `0-0-1` (type selectors: `h1 {}`)
- Objects/layouts: `0-1-0` (single class: `.stack {}`)
- Components: `0-1-0` (single class: `.card {}`)
- States/variations: `0-2-0` max (`.card.is-featured {}`)
- Never: IDs for styling, `!important` outside utilities

**Enforcement methods:**
1. **Stylelint** (`stylelint-selector-max-specificity`): CI fails if selectors exceed budget
2. **`@layer`**: architecture-level enforcement — low-specificity layers cannot override high-specificity layers even with more specific selectors
3. **Code review checklist**: reviewers reject deeply nested selectors
4. **CSS linting rules**: `selector-max-compound-selectors: 2`, `selector-no-id`

Vietnamese: Specificity budget = thỏa thuận team về độ phức tạp tối đa của selectors. Enforce qua: Stylelint rules (CI fail nếu vượt budget), @layer (architectural enforcement), code review checklist. Mục đích: prevent specificity escalation — một dev thêm `.sidebar .card` → dev khác phải `.main .sidebar .card` → không có hồi kết.

> 💡 **Interview Signal**: Mention được "Stylelint enforcement in CI" và `@layer` là hai cơ chế enforce khác nhau. Biết cả tooling và architectural solutions là full picture.

---

### Q: How do you architect CSS for micro-frontends or large multi-team systems? / CSS architecture cho micro-frontends thế nào? 🔴 Senior

**A:** In micro-frontend architectures, each team owns their CSS. Main risks: (1) class name collisions across teams, (2) global CSS from one team bleeding into another, (3) design token inconsistency.

Strategies:
1. **CSS Modules or Shadow DOM**: hard scoping — no global leak possible
2. **Namespace prefix**: each team's classes prefixed (`team-a-card`, `team-b-card`)
3. **Shared design token contract**: all teams import the same token file (or package) for colors/spacing/typography — visual consistency without shared implementation
4. **`@layer` per team**: each micro-frontend's styles in a named layer, global layer has lowest priority
5. **Custom Elements / Web Components**: Shadow DOM provides native style encapsulation

```css
/* Shell app: establish layer order */
@layer shell, team-a, team-b, shared-utilities;

/* Team A's CSS lives in team-a layer */
@layer team-a {
  .card { ... } /* No collision risk */
}
```

Vietnamese: Micro-frontends: mỗi team sở hữu CSS riêng → nguy cơ collision, bleeding, token inconsistency. Giải pháp: CSS Modules/Shadow DOM (hard scoping), namespace prefix, shared token package (visual consistency không cần shared implementation), `@layer` per team. Key: design tokens là contract chung — implementation riêng.

> 💡 **Interview Signal**: "Shared design token contract" là insight quan trọng nhất trong micro-frontend context. Teams có thể implement khác nhau nhưng visual consistency maintained qua shared tokens.

---

### Q: How do you set up CSS linting and what rules matter most? / CSS linting setup và rules quan trọng nhất 🔴 Senior

**A:** Stylelint is the standard CSS linter. Key rules for architecture enforcement:

```js
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-max-id": 0,                     // no IDs for styling
    "selector-max-compound-selectors": 2,      // max 2 compound selectors
    "selector-max-specificity": "0,2,0",       // max 0-2-0
    "no-duplicate-selectors": true,            // no duplicate rules
    "custom-property-pattern": "^[a-z][a-z0-9-]*$", // consistent token naming
    "declaration-no-important": [true, {       // !important only in utilities
      "severity": "warning"
    }],
    "color-no-invalid-hex": true,
    "unit-allowed-list": ["rem", "em", "px", "vh", "vw", "%", "fr"]
  }
}
```

**PostCSS** for transformations: autoprefixer (vendor prefixes), `postcss-custom-media` (custom media queries), `postcss-import` (import resolution, dead code elimination).

Vietnamese: Stylelint = CSS linter. Rules quan trọng nhất: `selector-max-id: 0` (không dùng ID), `selector-max-specificity: "0,2,0"` (specificity budget), `no-duplicate-selectors`, `declaration-no-important`. Tích hợp vào CI: lint fail → block merge. PostCSS cho transformations: autoprefixer, custom media queries, import resolution.

> 💡 **Interview Signal**: Biết cụ thể Stylelint rules và tích hợp CI/CD là đủ impress. Mention `selector-max-specificity` và tie back to specificity budget = showing connected thinking.

---

### Q: How do you migrate a legacy CSS codebase to a modern architecture? / Migrate legacy CSS codebase thế nào? 🔴 Senior

**A:** Large CSS migrations must be incremental — big bang rewrites break production. Proven approach:

1. **Audit first**: identify specificity hot spots (`specificity-graph` tool), find duplicated colors/spacing (no tokens), measure CSS bundle size
2. **Establish token layer first**: extract all color/spacing values into tokens. No visual change — just CSS variables replacing hardcoded values. Safest first step.
3. **Add `@layer` wrapper**: wrap existing CSS in a compatibility layer. New components go in higher layers. Old code still works, new code wins.
4. **Migrate by component**: new components use new architecture, old components are refactored when touched. Never rewrite just to rewrite.
5. **Enforce via Stylelint**: add rules progressively — start with warnings, escalate to errors as team learns.
6. **Kill dead code**: use PurgeCSS (Tailwind's built-in) or coverage tools to find unused CSS — often 50-80% of legacy CSS is unused.

Vietnamese: Migration phải incremental, không big bang. Thứ tự: (1) audit specificity/token gaps, (2) extract tokens trước (visual không đổi), (3) wrap legacy CSS trong @layer compat layer, (4) migrate component by component khi cần touch, (5) enforce Stylelint từng bước, (6) kill dead code. Principle: mỗi bước phải có rollback nếu cần.

> 💡 **Interview Signal**: "Extract tokens first — no visual change, safest step" là engineering wisdom từ thực tế. Nêu được incremental strategy và "never rewrite just to rewrite" là senior judgment.

---

## Interview Q&A Summary / Tổng Kết

| Level | Question | Key Point |
|---|---|---|
| 🟢 | BEM | Specificity control + naming structure |
| 🟢 | Design tokens | 3 layers: primitive → semantic → component |
| 🟢 | CSS module scope | Global namespace problem, scoping approaches |
| 🟡 | ITCSS | 7 layers, specificity tăng dần, utilities dùng `!important` hợp lệ |
| 🟡 | Utility-first vs BEM | Trade-offs, không có absolute winner |
| 🟡 | Dark mode with tokens | Semantic token layer, only tokens change |
| 🟡 | CSS-in-JS | Runtime vs compile-time, scoping trade-offs |
| 🔴 | CUBE CSS | Works with cascade (not against it), data-attribute exceptions |
| 🔴 | Specificity budget | Team agreement + Stylelint enforcement + @layer |
| 🔴 | Micro-frontends | Shared token contract, namespacing, @layer per team |
| 🔴 | CSS linting | Stylelint rules, CI enforcement, PostCSS transforms |
| 🔴 | Legacy migration | Audit → tokens → @layer compat → component-by-component |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Nhanh

**Interviewer**: "How would you prevent specificity wars in a large team?"

**Strong answer**: "Three levels of defense. First, a naming convention like BEM ensures selectors stay at a single class (0-1-0). Second, a specificity budget enforced by Stylelint in CI — any selector exceeding the budget fails the build. Third, cascade layers with `@layer`: when imports from third-party libraries go into low-priority layers, your components always win regardless of selector specificity. The layers are the architectural enforcement; Stylelint is the mechanical enforcement."

---

**Interviewer**: "A designer wants to switch from light to dark mode. How do you architect the CSS so it requires the least code change?"

**Strong answer**: "Design token layers. Primitive tokens hold raw values — `--blue-500: #3b82f6`. Semantic tokens map primitives to intent — `--color-bg: white`, `--color-text: #111`. Components only reference semantic tokens. Dark mode just swaps the semantic tokens: `[data-theme='dark'] { --color-bg: #111; --color-text: #f9f; }`. Every component updates automatically — no component CSS changes at all. The key insight is the semantic indirection layer between components and actual values."

---

**Interviewer**: "Your team inherited a legacy CSS codebase with massive specificity issues. What's your migration plan?"

**Strong answer**: "First, audit — specificity-graph to visualize hot spots, CSS coverage to find dead code. Then extract tokens without changing visuals: replace hardcoded `#3b82f6` with `var(--color-primary)` — zero visual change, immediate value. Next, wrap legacy CSS in an `@layer legacy` at low priority so new components in higher layers automatically win. Then migrate component by component when we naturally touch them, not all at once. Enforce new rules via Stylelint starting as warnings, escalating to errors. The key principle: every step must be reversible."

---

## Self-Check / Tự Kiểm Tra

1. Không nhìn notes: tại sao BEM selectors ở level `0-1-0` quan trọng cho maintainability?
2. Giải thích 3 tầng design tokens và tại sao cần tầng semantic ở giữa.
3. ITCSS: layer nào được phép dùng `!important`? Tại sao?
4. Sự khác biệt giữa BEM và CUBE CSS trong cách xử lý cascade là gì?
5. Nêu 3 bước đầu tiên khi migrate legacy CSS codebase, theo thứ tự ưu tiên.

---

## Connections / Liên Kết

- **Prerequisite**: [CSS Fundamentals](./00-css-fundamentals.md) — cascade, specificity, custom properties
- **Prerequisite**: [Modern CSS Features](./06-modern-css-features.md) — `@layer`, container queries
- **Practice**: [CSS Architecture Practice](./02-css-architecture.md) — hands-on BEM + tokens
- **Next**: [CSS Framework Comparison](./08-css-framework-comparison.md) — Tailwind vs CSS Modules vs styled-components
