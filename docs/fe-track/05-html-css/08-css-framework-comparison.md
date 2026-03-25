# CSS Framework & Styling Comparison / So Sánh Các Phương Pháp CSS

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [CSS Architecture](./02-css-architecture.md) | [Modern CSS Features](./06-modern-css-features.md)

---

## Overview / Tổng Quan

```
CSS STYLING APPROACHES IN 2024:

┌────────────────────────────────────────────────────────────┐
│  GLOBAL CSS          SCOPED                UTILITY         │
│  (old way)           ─────────────         ───────────     │
│  .button { }         CSS Modules           Tailwind CSS    │
│  Risk: collisions    .module.css           class="flex p-4"│
│  Easy to start       Zero runtime          Zero runtime    │
│                                                            │
│           COMPONENT-SCOPED WITH JS                         │
│           ─────────────────────────                        │
│           CSS-in-JS (styled-components, emotion)           │
│           Runtime: ✓  Dynamic: ✓  DX: excellent           │
└────────────────────────────────────────────────────────────┘
```

---

## 1. CSS Modules

> 🧠 **Memory Hook**: CSS Modules = scoped styles — the **compiler** renames `.button` to `.Button_button__abc123` at build time. Your source code stays readable; the browser gets collision-proof hashes. Zero runtime. Zero config beyond PostCSS.

**Tại sao tồn tại? / Why does this exist?**

Dự án lớn: hai dev cùng viết `.button { }` trong hai file khác nhau — một cái overrides cái kia mà không ai biết.
→ **Why?** CSS là global by nature — bất kỳ rule nào cũng có thể override rule khác dựa trên specificity.
→ **Why?** Không có build step nào tự động scope CSS trước khi CSS Modules ra đời, nên teams phải dùng BEM naming conventions thủ công — dễ sai, khó enforce.

### What it is / Cách Hoạt Động

```css
/* Button.module.css */
.button {
  padding: 8px 16px;
  border-radius: 4px;
  background: #3b82f6;
  color: white;
}

.button:hover {
  background: #2563eb;
}

.danger {
  background: #ef4444;
}
```

```tsx
import styles from './Button.module.css'

function Button({ danger, children }) {
  return (
    <button className={`${styles.button} ${danger ? styles.danger : ''}`}>
      {children}
    </button>
  )
}

// What gets rendered in DOM:
// <button class="Button_button__xyz Button_danger__abc">...</button>
//                         ↑ hash appended — collision-proof!
```

**Pros / Ưu điểm:**
- Zero runtime overhead — compiled to plain CSS
- Scoped by default — no class name collisions
- Full CSS power (pseudo-classes, animations, media queries)
- Works with SSR without config
- TypeScript support with typed CSS modules

**Cons / Nhược điểm:**
- Verbose for conditional classes (`clsx` library helps)
- No dynamic values based on props without CSS variables
- Separate `.module.css` file per component

**Best for**: Next.js projects, teams wanting minimal abstraction, performance-critical apps

**Luồng build / Build flow:**
```
Source:          Button.module.css → .button { padding: 8px 16px; }
                         ↓ PostCSS / webpack
Compiled:        .Button_button__abc123 { padding: 8px 16px; }
                         ↓ injected into <link> at build time
Browser:         class="Button_button__abc123"  ← no JS needed, no runtime
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng `:global(.someClass)` bừa bãi | Phá vỡ scoping, gây collision y như global CSS | Chỉ dùng `:global` cho third-party styles không thể tránh |
| Import module CSS vào nhiều components | Styles vẫn scoped — OK về collision, nhưng coupling ẩn | Mỗi component có module CSS riêng |
| Cố dùng `styles['button--active']` với dấu gạch đôi | Tên với `-` cần bracket notation, dễ gây typo | Dùng camelCase: `styles.buttonActive` |
| Quên `composes:` khi muốn extend style | Copy-paste CSS thay vì reuse | `composes: button from './base.module.css'` |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: CSS class name collisions, scoped styles, CSS-in-JS alternatives
- → Nhớ đến: CSS Modules — build-time hashing, zero runtime
- → Mở đầu trả lời: *"CSS Modules solves the global namespace problem by transforming class names to unique hashes at build time — no runtime cost, no collisions, works natively with SSR."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [CSS Architecture & BEM](./02-css-architecture.md) — để hiểu vấn đề global CSS đang giải quyết
- ➡️ Để hiểu tiếp: [Modern CSS Features](./06-modern-css-features.md) — CSS custom properties thay thế dynamic styling trong CSS Modules

---

## 2. Tailwind CSS (Utility-First)

> 🧠 **Memory Hook**: Tailwind = **utility-first** — thay vì đặt tên class rồi viết CSS, bạn compose trực tiếp từ atomic utilities. Không có file CSS riêng. JIT scan source → generate only what you use → output ~5-30KB.

**Tại sao tồn tại? / Why does this exist?**

Dev phải đặt tên class cho mọi thứ: `.wrapper`, `.inner-container`, `.button-group` — rồi nhảy qua file CSS để viết style, sau đó nhảy lại JSX để dùng.
→ **Why?** Context switching giữa HTML và CSS file chậm hơn và tạo ra "naming fatigue" — phần lớn class names không có semantic value thực sự.
→ **Why?** Các framework CSS truyền thống (Bootstrap) cung cấp components cố định, nhưng custom design system đòi hỏi override CSS liên tục — một dạng specificity war khác.

### What it is / Cách Hoạt Động

```tsx
// No CSS file needed — compose from atomic classes
function Button({ variant = 'primary', size = 'md', children }) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors'
  
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger:    'bg-red-600 text-white hover:bg-red-700',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </button>
  )
}
```

**How Tailwind works under the hood:**
```
Build time: scan all files for class names
  Found: "bg-blue-600", "text-white", "hover:bg-blue-700"
  Generate only the CSS for used classes
  Output: 5-30KB of CSS (vs unused 150KB+ of full Tailwind)

JIT (Just-In-Time) mode (default since v3):
  Generates CSS on-demand as you write classes
  Any value: bg-[#customColor], p-[17px], grid-cols-[1fr_2fr_1fr]
```

**Pros / Ưu điểm:**
- Extremely fast to build UI (no context switching between files)
- Zero unused CSS in production (PurgeCSS/JIT)
- Consistent design system built-in (spacing, colors scale)
- No naming fatigue (.wrapper? .container? .inner?)
- Responsive and dark mode built-in: `md:text-lg dark:bg-gray-800`

**Cons / Nhược điểm:**
- "Classname soup" — components can have 20+ classes
- Learning curve (must memorize class names)
- Hard to read complex conditional styling
- Custom design system requires significant config

**Best for**: Rapid prototyping, design-system-less projects, full-stack developers who want speed

**Luồng JIT / JIT scan flow:**
```
Source files (JSX/TSX/HTML):
  "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2"
          ↓  Tailwind CLI scans content[] at build time
  Extracts only used class names
          ↓  Generates atomic CSS
  .bg-blue-600 { background-color: #2563eb; }
  .text-white  { color: #fff; }
  ...
          ↓  Output CSS file (~5-30KB in prod, ~3MB if no purge)
  Browser reads static .css file — zero JS, zero runtime
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Build dynamic class names bằng string concat: `'bg-' + color + '-600'` | JIT scanner không thể detect partial class names ở static scan | Dùng full class names trong object map: `{ blue: 'bg-blue-600', red: 'bg-red-600' }` |
| Dùng `@apply` quá nhiều trong CSS file | Tạo lại vấn đề "naming fatigue" mà Tailwind giải quyết | Dùng `@apply` chỉ cho base element styles (headings, links) |
| Không config `content` đúng path | Classes dùng trong file không được scan → bị purge khỏi prod | Config `content: ['./src/**/*.{js,ts,jsx,tsx}']` đầy đủ |
| Nhầm lẫn `space-x-4` vs `gap-4` | `space-x-4` dùng margin trên children, `gap-4` dùng trên flex/grid container | Hiểu context: `gap-4` cho flex/grid, `space-x-4` cho non-flex lists |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: bundle size, CSS performance, utility-first vs semantic CSS
- → Nhớ đến: Tailwind JIT — static scan, zero runtime, atomic output
- → Mở đầu trả lời: *"Tailwind uses a static scanner at build time to extract only the classes you actually use, so production output is typically 5-30KB regardless of how many utilities exist in the full library."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [CSS Architecture](./02-css-architecture.md) — hiểu tại sao naming conventions (BEM) là pain point Tailwind giải quyết
- ➡️ Để hiểu tiếp: [Browser Performance](../06-performance/01-browser-rendering.md) — Tailwind's zero-runtime benefit maps directly to rendering performance

---

## 3. CSS-in-JS (styled-components / emotion)

> 🧠 **Memory Hook**: CSS-in-JS = **styles as JS objects/template literals** — runtime generates class names and injects `<style>` tags. Full JS power for dynamic styles. But: runtime cost + RSC incompatible. Zero-runtime variants (Vanilla Extract, StyleX) keep the DX, drop the runtime.

**Tại sao tồn tại? / Why does this exist?**

Component-based UI (React) muốn styles sống cùng component — nhưng CSS Modules vẫn là file riêng, và không thể dùng props JS để compute styles trực tiếp.
→ **Why?** Khi design system cần render styles khác nhau dựa trên props (`<Button danger size="lg">`), CSS Modules đòi hỏi CSS custom properties hoặc thêm class names — không type-safe và verbose.
→ **Why?** Các large design system (Airbnb, Meta) cần theming, dark mode, responsive tất cả driven by JS state — CSS-in-JS cho phép ThemeProvider inject theme values trực tiếp vào styled components.

### What it is / Cách Hoạt Động

```tsx
// styled-components
import styled from 'styled-components'

const Button = styled.button<{ danger?: boolean; size?: 'sm' | 'md' | 'lg' }>`
  padding: ${({ size }) => ({ sm: '6px 12px', md: '8px 16px', lg: '12px 24px' }[size || 'md'])};
  background: ${({ danger }) => danger ? '#ef4444' : '#3b82f6'};
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: ${({ danger }) => danger ? '#dc2626' : '#2563eb'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

// Usage: fully typed, props-driven styles
<Button danger size="lg">Delete</Button>
```

**How CSS-in-JS works:**
```
Runtime (traditional styled-components):
1. JavaScript generates class name (hash) at runtime
2. Injects <style> tag into <head> with actual CSS
3. React renders component with generated class name

Server-Side (SSR):
- Collects all styles during render
- Injects as <style> in HTML — no flash of unstyled content
- Requires setup: ServerStyleSheet (styled-components) or Emotion cache

Zero-runtime CSS-in-JS (new trend):
- Vanilla Extract, Linaria, StyleX (Meta)
- Compile-time extraction → output plain CSS files
- No runtime overhead, keeps DX of CSS-in-JS
```

**Pros / Ưu điểm:**
- Full CSS power + full JS power in one place
- Dynamic styles based on any prop or state
- Co-located with component (great for design systems)
- TypeScript prop types for styles
- Theming with ThemeProvider

**Cons / Nhược điểm:**
- **Runtime overhead** — style injection at JS execution time
- Larger bundle (styled-components = ~12KB gzipped)
- SSR complexity
- Can cause CLS (flash) if SSR not configured properly
- **React Server Components incompatible** — RSC can't run client JS at render time

**Luồng runtime injection / Runtime injection flow:**
```
React renders <Button danger size="lg">
        ↓  styled-components executes template literal with props
  Computes: background = '#ef4444', padding = '12px 24px'
        ↓  generates unique hash: "sc-abc123"
  Checks: is "sc-abc123" already in <head>? NO
        ↓  injects <style> tag:
  .sc-abc123 { background: #ef4444; padding: 12px 24px; }
        ↓  renders: <button class="sc-abc123">

  SSR path: ServerStyleSheet collects all rules → embeds in HTML
  RSC path: ❌ NO JS runtime on server → hash generation never runs
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng styled-components trong Next.js App Router mà không có `'use client'` | RSC không chạy JS ở client-time → styled-components không generate được class names | Mark component là `'use client'` hoặc chuyển sang CSS Modules |
| Tạo styled component bên trong render function | Mỗi render tạo ra new component reference → React unmount/remount → perf hit | Khai báo styled components ở module scope, ngoài component function |
| Quên `ServerStyleSheet` cho SSR | HTML gửi về browser chưa có styles → CLS / flash of unstyled content | Setup `ServerStyleSheet` trong `_document.tsx` (Pages Router) |
| Dùng CSS-in-JS vì "dễ" mà không đánh giá bundle size | +12-30KB runtime, tăng TTI | Eval trade-off: nếu không cần runtime dynamic styles → CSS Modules đủ |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: RSC compatibility, runtime CSS, SSR styling issues
- → Nhớ đến: CSS-in-JS runtime model — JS generates class names at execution time
- → Mở đầu trả lời: *"CSS-in-JS like styled-components works by executing JavaScript at render time to generate class names and inject style tags — which is why it's incompatible with React Server Components that have no client JS runtime."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [React Server Components](../03-react/08-rsc-server-actions.md) — để hiểu tại sao RSC không chạy được runtime CSS-in-JS
- ➡️ Để hiểu tiếp: [CSS Architecture](./02-css-architecture.md) — zero-runtime alternatives (Vanilla Extract, StyleX) là tương lai của CSS-in-JS

---

## 4. Head-to-Head Comparison / So Sánh Trực Tiếp

### Same button, different approaches:

```
CSS Modules:
className={clsx(styles.button, { [styles.danger]: danger })}

Tailwind:
className={`px-4 py-2 rounded ${danger ? 'bg-red-600' : 'bg-blue-600'} text-white`}

styled-components:
<Button danger={danger}>

All produce the same DOM button. Trade-offs are DX and build tooling.
```

### Performance Comparison

| | CSS Modules | Tailwind | CSS-in-JS |
|--|------------|---------|-----------|
| **Runtime cost** | 0 | 0 | Medium |
| **Bundle size** | Small | Small (after purge) | +12-30KB |
| **SSR** | Works natively | Works natively | Requires setup |
| **RSC compatible** | Yes | Yes | **No** (runtime) |
| **Dynamic styles** | Via CSS vars | Via arbitrary values | Native (props) |
| **Build setup** | PostCSS | Tailwind CLI/PostCSS | Babel plugin |

### Developer Experience

| | CSS Modules | Tailwind | CSS-in-JS |
|--|------------|---------|-----------|
| **Learning curve** | Low | Medium | Medium |
| **Design iteration speed** | Medium | Fast | Slow-medium |
| **Naming things** | Required | Not needed | Recommended |
| **Colocation** | Separate file | Same file | Same file |
| **Refactoring** | Easy | Easy | Easy |

---

## 5. Decision Guide / Hướng Dẫn Chọn

```
Are you building with React Server Components (Next.js 13+ App Router)?
  YES → CSS Modules or Tailwind (CSS-in-JS won't work with RSC)
  NO  → any option works

Do you have a fixed design system/brand guidelines?
  YES → CSS Modules or CSS-in-JS (more control)
  NO  → Tailwind (built-in scale is good starting point)

Does your team prefer writing CSS in JS or separate files?
  Same file → CSS-in-JS or Tailwind
  Separate files → CSS Modules

Do you need runtime dynamic styles (user-controlled themes)?
  YES → CSS-in-JS or CSS custom properties + CSS Modules
  NO  → Tailwind or CSS Modules

Team size and consistency?
  Large team → CSS Modules (enforces structure) or Tailwind (consistent scale)
  Small team → any, personal preference matters more

Performance is critical?
  → CSS Modules or Tailwind (zero runtime)
```

### Recommendation Matrix

| Project Type | Recommended | Why |
|-------------|-------------|-----|
| Next.js App Router | CSS Modules + Tailwind | RSC compatible, zero runtime |
| Design System library | CSS Modules or Vanilla Extract | Publishable, no runtime dep |
| Dashboard/SaaS with heavy theming | CSS-in-JS (emotion) | Runtime theming |
| Startup / rapid prototype | Tailwind | Speed, no naming decisions |
| Large team / Enterprise | CSS Modules | Predictable, scoped, familiar |

---

## 6. Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why can't you use styled-components with React Server Components? 🟡 Mid

**A:** styled-components generates class names at JavaScript runtime by executing the styled template literals. RSC renders on the server WITHOUT sending JS to the client — there's no runtime, so no class name generation. The solution is CSS Modules or Tailwind (build-time CSS), or zero-runtime CSS-in-JS like Vanilla Extract.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explains the specific mechanism — "styled-components executes template literals at JS runtime to compute class names; RSC has no client JS runtime, so that execution never happens." Mentions zero-runtime alternatives like Vanilla Extract or StyleX.
- ❌ Weak: "styled-components doesn't work with Server Components" — correct but gives no mechanism and no solution path.

### Q: How does Tailwind avoid shipping unused CSS? 🟢 Junior

**A:** Tailwind scans all your source files (via `content` config) for class names, then generates ONLY the CSS for classes actually found. Production output is typically 5-30KB. Without this purging, the full Tailwind is ~3MB.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Names the `content` config, mentions static scanning (not runtime), gives the size comparison (5-30KB vs ~3MB), and knows the gotcha — dynamic class name construction like `'bg-' + color + '-600'` defeats the scanner.
- ❌ Weak: "Tailwind removes unused styles" — too vague; doesn't explain how the scanner works or that it's static.

### Q: CSS Modules vs global CSS — what's the core difference? 🟢 Junior

**A:** CSS Modules transforms class names to unique hashes at build time: `.button` → `.Button_button__abc123`. This makes styles locally scoped — impossible to accidentally override another component's styles. Global CSS has no such protection.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explains the build-time hash transformation with a concrete example (`.button` → `.Button_button__abc123`), mentions zero runtime overhead, and notes that TypeScript typed CSS modules are possible for autocomplete.
- ❌ Weak: "CSS Modules are scoped" — missing the mechanism (hash at build time) and the trade-off context (vs BEM naming conventions as the manual alternative).

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Airbnb — CSS-in-JS to Restyle (2019-2022)

**Tình huống**: Airbnb's design system "DLS" used CSS-in-JS (emotion) heavily across their web apps. As they scaled to millions of users and introduced SSR, they encountered increasing runtime overhead — emotion was serializing styles on every render, contributing to slow TTI on mobile devices.

**Quyết định**: Airbnb started migrating parts of their stack toward CSS Modules and static CSS where dynamic theming wasn't needed. The goal was to remove runtime style serialization from the critical rendering path.

**Kết quả**: Static CSS extraction cut style-related JS execution from the critical path. Pages with pure presentational components saw measurable TTI improvements on low-end Android devices.

**Bài học**: CSS-in-JS DX is excellent, but runtime cost compounds at scale. The decision to use it should be intentional — "do we actually need runtime dynamic styles, or are we just using it for DX?"

### Case 2: Meta — StyleX (2023, open-sourced)

**Tình huống**: Meta's Facebook and Instagram codebases used various CSS approaches at massive scale (thousands of components, hundreds of engineers). They needed: atomic CSS for cache efficiency, type-safe styles, zero runtime cost, and collision-proof scoping — no single existing solution satisfied all four.

**Quyết định**: Meta built StyleX internally and open-sourced it in December 2023. StyleX compiles style definitions to atomic CSS class names at build time (like Tailwind atoms) but with full type-safety and colocation (like CSS-in-JS), with zero runtime.

**Kết quả**: At Meta's scale, atomic CSS means that adding a new component rarely adds new CSS bytes to the bundle — most atomic classes already exist. Facebook's CSS bundle stopped growing linearly with component count.

**Bài học**: At large-company scale, the right axis for choosing a CSS approach is **atomic reuse + zero runtime + type safety** — not just "DX feels good." StyleX shows where the industry is heading: zero-runtime CSS-in-JS with compile-time atomization.

### Case 3: Vercel / Next.js — Tailwind as Default (2022-present)

**Tình huống**: When Next.js 13 introduced the App Router with React Server Components, the team needed to update their official starter templates and `create-next-app`. The previous default (no styling opinion) left teams making the CSS-in-JS choice, then hitting RSC incompatibility.

**Quyết định**: Vercel made Tailwind CSS the default in `create-next-app --tailwind` and the App Router docs. They also invested heavily in CSS Modules examples and documentation. CSS-in-JS is explicitly not recommended for App Router without `'use client'` wrappers.

**Kết quả**: The Next.js community effectively bifurcated: Tailwind for new App Router projects, CSS-in-JS only in Pages Router or behind `'use client'`. This accelerated Tailwind adoption across the React ecosystem significantly.

**Bài học**: Framework decisions (RSC) can obsolete styling choices (runtime CSS-in-JS) overnight. Always evaluate CSS approach in the context of your rendering architecture, not just DX preference.

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"We're starting a new Next.js 14 App Router project. Which CSS approach would you recommend and why?"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**
1. **Scope + define**: "App Router uses React Server Components by default, which rules out runtime CSS-in-JS like styled-components — they require client-side JS that RSC doesn't have."
2. **Core mechanism**: "I'd recommend CSS Modules as the primary approach, with Tailwind for utility classes — both are build-time solutions with zero runtime overhead, fully compatible with RSC."
3. **Concrete example**: "CSS Modules handles component-scoped styles like `Button.module.css`, while Tailwind handles spacing, typography, and responsive layout directly in JSX — no context switching."
4. **Trade-off**: "If the project needs runtime theming (user-controlled color schemes), I'd add CSS custom properties via CSS Modules rather than pulling in a runtime CSS-in-JS library, to keep the bundle lean."

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết ra 3 điểm khác biệt giữa CSS Modules, Tailwind, và CSS-in-JS từ trí nhớ — không nhìn lại.
- [ ] **Visual**: Vẽ sơ đồ build-time flow của CSS Modules và Tailwind, so sánh với runtime injection của styled-components.
- [ ] **Application**: Dự án Next.js App Router với custom dark mode theming — bạn chọn CSS approach nào? Tại sao? CSS Modules + CSS variables hay CSS-in-JS?
- [ ] **Debug**: `className={`bg-${color}-600`}` — Tailwind không apply style trong production. Nguyên nhân? Fix?
- [ ] **Teach**: Giải thích CSS Modules cho người không biết lập trình bằng 1 câu.

💬 **Feynman Prompt:** Explain the difference between CSS Modules and Tailwind to someone who only knows that "CSS makes websites look good." Use a cooking analogy.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

**See also**: [CSS Architecture](./02-css-architecture.md) | [Modern CSS Features](./06-modern-css-features.md)
