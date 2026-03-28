# CSS-in-JS Comparison — Choosing the Right Styling Approach / So Sánh CSS-in-JS

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **L5 Competencies**: Technical Mastery (20pts)
> **Prerequisites**: [CSS Fundamentals](./00-css-fundamentals.md) | [CSS Architecture](./02-css-architecture.md)
> **See also**: [Bundle Analysis](../06-browser-performance/07-bundle-analysis-deep-dive.md) | [React Performance](../06-browser-performance/02-react-performance.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Team frontend đang chọn styling solution cho project mới (Next.js 14, Server Components). Một dev đề xuất styled-components ("dùng quen rồi"), dev khác muốn Tailwind ("nhanh hơn"), tech lead muốn CSS Modules ("đơn giản nhất"). Không ai có data — chỉ có opinions. Cuối cùng chọn styled-components → 6 tháng sau phát hiện: (1) không compatible với Server Components, (2) runtime CSS injection gây CLS, (3) bundle thêm 15KB cho mỗi page.

**Bài học:** Styling decision là **architectural decision** — ảnh hưởng performance, DX, SSR compatibility, và migration cost. L5 engineer cần biết trade-offs của từng approach, không chỉ "cái nào quen."

---

## What & Why / Cái Gì & Tại Sao

**CSS-in-JS là gì (Feynman)?** Thay vì viết CSS trong file `.css` riêng, bạn viết CSS **bên trong JavaScript**. Như viết thư (CSS) trực tiếp trong email (JS) thay vì đính kèm file riêng. Ưu điểm: styles gắn chặt với component, có thể dùng logic JS. Nhược điểm: browser phải chạy JS trước khi có CSS → chậm hơn.

**Tại sao là architectural decision?** Styling solution ảnh hưởng: bundle size (runtime vs zero-runtime), SSR/RSC compatibility, developer experience, performance (runtime cost), và migration effort nếu đổi ý sau.

---

## Core Concepts / Khái Niệm Cốt Lõi

### Concept 1: Styling Approaches Spectrum

🪝 **Memory Hook:** CSS approaches như **spectrum từ truyền thống đến hiện đại** — Global CSS (newspaper) → CSS Modules (filing cabinet) → Utility-first (LEGO blocks) → Runtime CSS-in-JS (magic paint) → Zero-runtime CSS-in-JS (pre-mixed paint).

**The Spectrum:**

```
Zero Runtime Cost ◄───────────────────────────────► Full Runtime Cost

Global CSS    CSS Modules    Tailwind    vanilla-extract    Panda CSS    styled-components
  .css files    .module.css    className    compile-time       compile     runtime CSS-in-JS
  BEM naming    scoped auto    utility      type-safe          type-safe   JS → CSS at runtime
                               classes      zero-runtime       zero-RT     runtime overhead
```

**Comparison Matrix:**

```
                    │ CSS     │ CSS      │ Tailwind │ vanilla- │ styled-  │ Emotion  │
                    │ Modules │ (plain)  │ CSS      │ extract  │ components│          │
────────────────────┼─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
Runtime cost        │ None    │ None     │ None     │ None     │ ~12KB    │ ~11KB    │
RSC compatible      │ ✅       │ ✅        │ ✅        │ ✅        │ ❌        │ ❌        │
SSR streaming       │ ✅       │ ✅        │ ✅        │ ✅        │ ⚠️ hacky  │ ⚠️ hacky  │
TypeScript support  │ ⚠️       │ ❌        │ ⚠️ (tw)   │ ✅ native │ ✅ props  │ ✅ props  │
Dynamic styles      │ CSS vars│ CSS vars │ cn()     │ variants │ ✅ full JS│ ✅ full JS│
Colocation          │ ⚠️ file  │ ❌ global │ ✅ inline │ ✅ .css.ts│ ✅ inline │ ✅ inline │
Learning curve      │ Low     │ Low      │ Medium   │ Medium   │ Low      │ Low      │
Bundle impact       │ Small   │ Small    │ Small*   │ Small    │ 12-15KB  │ 11-13KB  │
Ecosystem 2025      │ Growing │ Stable   │ Growing  │ Growing  │ Declining│ Stable   │
────────────────────┴─────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
* Tailwind: small if properly purged, can be large if not
```

---

### Concept 2: Runtime vs Zero-Runtime CSS-in-JS

🪝 **Memory Hook:** Runtime CSS-in-JS như **paint mixer at the store** — bạn đến cửa hàng, chọn màu, máy pha ngay tại chỗ (browser runtime). Zero-runtime = **paint pre-mixed at factory** — bạn nhận lon paint đã pha sẵn (build time), dùng ngay không cần máy.

**How Runtime CSS-in-JS Works:**

```
styled-components / Emotion flow:

1. JS loads in browser
2. Component renders
3. CSS-in-JS library evaluates template literals
4. Generates CSS string
5. Injects <style> tag into DOM
6. Browser parses new CSS
7. Re-layout/re-paint

Steps 3-6 happen ON EVERY RENDER for dynamic styles
→ Performance cost: 2-5ms per component on mid-range mobile
→ CLS risk: content renders before styles are injected
```

**How Zero-Runtime CSS-in-JS Works:**

```
vanilla-extract / Panda CSS flow:

1. Build time: compiler extracts CSS from .css.ts files
2. Generates static .css files (like CSS Modules)
3. Browser loads CSS via <link> tag (cached, parallel)
4. No JS needed for styles

→ Zero runtime cost
→ No CLS from style injection
→ Works with RSC and streaming SSR
```

**Code Comparison:**

```javascript
// 1. CSS Modules — simple, zero runtime
// Button.module.css
// .primary { background: blue; color: white; padding: 8px 16px; }
// .large { font-size: 18px; padding: 12px 24px; }
import styles from './Button.module.css';
function Button({ variant, size }) {
  return <button className={`${styles[variant]} ${styles[size]}`}>Click</button>;
}

// 2. Tailwind CSS — utility-first, zero runtime
function Button({ variant, size }) {
  return (
    <button className={cn(
      'px-4 py-2 rounded',
      variant === 'primary' && 'bg-blue-600 text-white',
      size === 'large' && 'text-lg px-6 py-3'
    )}>Click</button>
  );
}

// 3. vanilla-extract — type-safe, zero runtime
// Button.css.ts
import { style, styleVariants } from '@vanilla-extract/css';
export const base = style({ padding: '8px 16px', borderRadius: 4 });
export const variant = styleVariants({
  primary: { background: 'blue', color: 'white' },
  secondary: { background: 'gray', color: 'black' },
});

// 4. styled-components — runtime CSS-in-JS (⚠️ declining)
const StyledButton = styled.button<{ $primary?: boolean }>`
  padding: ${p => p.$primary ? '12px 24px' : '8px 16px'};
  background: ${p => p.$primary ? 'blue' : 'gray'};
  color: white;
`;
```

---

### Concept 3: Decision Framework — Choosing for Your Project

🪝 **Memory Hook:** Chọn styling solution như **chọn xe** — solo commuter (nhỏ, tiết kiệm = CSS Modules), family SUV (versatile = Tailwind), sports car (powerful nhưng tốn xăng = styled-components). Chọn theo nhu cầu, không theo trend.

**Decision Tree:**

```
Start Here
│
├── Using React Server Components / Next.js App Router?
│   ├── YES → ❌ Eliminate runtime CSS-in-JS (styled-components, Emotion)
│   │         → Choose: CSS Modules, Tailwind, vanilla-extract, Panda CSS
│   └── NO → All options available (but consider migration path)
│
├── Team size?
│   ├── Small (1-3 devs) → CSS Modules or Tailwind (low overhead)
│   ├── Medium (4-10) → Tailwind or vanilla-extract (consistency at scale)
│   └── Large (10+) → vanilla-extract or Tailwind (type safety + design tokens)
│
├── Design system?
│   ├── Building from scratch → vanilla-extract (tokens + variants + types)
│   ├── Using component library (MUI, etc.) → Library's built-in system
│   └── Rapid prototyping → Tailwind (fastest iteration)
│
└── Performance critical?
    ├── YES (e-commerce, media) → Zero-runtime only
    └── NO (internal tools, dashboards) → Any approach works
```

**Migration Paths (2025 landscape):**

```
styled-components → (declining, no RSC support)
  Migrate to: Tailwind (fastest), vanilla-extract (closest DX), CSS Modules (simplest)

Emotion → (stable but no RSC server support)
  Migrate to: Panda CSS (similar DX, zero-runtime), vanilla-extract

SASS/SCSS → (stable, works everywhere)
  Migrate to: CSS Modules + SASS (keep SASS, add scoping), or Tailwind

CSS Modules → (growing, recommended for most projects)
  No migration needed — simplest, most future-proof

Tailwind → (growing rapidly, strong ecosystem)
  No migration needed — works with RSC, SSR, streaming
```

| Sai lầm | Tại sao sai | Đúng là |
|---------|-------------|---------|
| Choose by popularity | "styled-components is popular" — but declining and no RSC | Choose by project requirements + future compatibility |
| Ignore runtime cost | "12KB runtime is small" — but EVERY page pays the cost | Zero-runtime is free. Runtime is a tax on every page load |
| Mix multiple solutions | "Use Tailwind + styled-components + CSS Modules" | One primary solution + design system tokens |
| Don't consider migration | "We'll switch later" — migration is 10x harder than initial choice | Future-proof: prefer zero-runtime, RSC-compatible solutions |

---

## Q&A Section — Interview Questions

### Q: What are the main categories of CSS styling approaches in React? / Các loại CSS styling trong React? 🟢 Junior

**A:** Four main categories: (1) Global CSS / SASS — traditional `.css` files. (2) CSS Modules — scoped per component with `.module.css`. (3) Utility-first — Tailwind CSS with utility classes. (4) CSS-in-JS — runtime (styled-components, Emotion) or zero-runtime (vanilla-extract, Panda CSS).

"Trend 2025: movement toward zero-runtime solutions vì React Server Components không support runtime CSS-in-JS."

**💡 Interview Signal:**
- ✅ Strong: Names categories with examples, mentions runtime vs zero-runtime distinction
- ❌ Weak: Only knows one approach or can't explain trade-offs

---

### Q: Why are runtime CSS-in-JS libraries (styled-components, Emotion) problematic with React Server Components? / Tại sao runtime CSS-in-JS có vấn đề với RSC? 🟡 Mid

**A:** Server Components run on the server and send HTML to the client — they don't have access to browser APIs or React context. Runtime CSS-in-JS libraries need JavaScript execution in the browser to: (1) evaluate template literals, (2) generate CSS strings, and (3) inject `<style>` tags into the DOM. This fundamentally conflicts with Server Components which don't run client-side JS.

Additionally, runtime CSS-in-JS causes: CLS (content renders before styles inject), extra JS bundle (11-15KB runtime), and double-rendering cost on SSR (server generates CSS → client re-hydrates → re-generates CSS).

**💡 Interview Signal:**
- ✅ Strong: Explains the fundamental incompatibility (server vs client execution), mentions CLS and bundle cost
- ❌ Weak: "It just doesn't work" without explaining the mechanism

---

### Q: You're architecting a new design system for a company with 8 frontend teams. How do you choose and implement a styling approach? / Chọn styling approach cho design system cho 8 teams? 🔴 Senior

**A:** Decision framework:

1. **Requirements gathering**: RSC support needed? (Yes → eliminate runtime). Performance-critical? (e-commerce → zero-runtime). TypeScript? (Yes → need type-safe tokens).

2. **Recommendation: vanilla-extract + design tokens** for this scale because: (a) Zero-runtime — no performance cost. (b) Type-safe — TypeScript-native tokens and variants. (c) Build-time extraction — works with RSC and streaming SSR. (d) Design token system — shared across all 8 teams via npm package. (e) Sprinkles API — utility-first like Tailwind but type-safe.

3. **Implementation**: Design token package (`@company/tokens`) with colors, spacing, typography. Component library uses vanilla-extract. Teams consume tokens + components. Migration from styled-components via codemods for common patterns.

4. **Governance**: Lint rules against inline styles. Bundle budget per team. Token usage audit quarterly.

**💡 Interview Signal:**
- ✅ Strong: Considers scale (8 teams), future-proofing (RSC), governance, migration strategy
- ❌ Weak: "I'd use Tailwind because it's popular" without considering team scale or design system needs

🔗 **Follow-up Chain:**
1. → "How would you handle the migration from styled-components to your chosen solution across 8 teams?"
2. → "One team strongly prefers Tailwind. How do you maintain consistency while respecting team autonomy?"
3. → "How do you measure the success of a design system? What metrics would you track?"

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này lại trước khi làm.**

- [ ] **Retrieval**: Vẽ spectrum từ zero-runtime → full runtime, liệt kê ≥5 solutions đúng vị trí.
- [ ] **Visual**: Vẽ comparison matrix 6 cột (CSS Modules, Tailwind, vanilla-extract, Panda, styled-components, Emotion) × 5 criteria (runtime cost, RSC, TypeScript, dynamic styles, bundle).
- [ ] **Application**: Project hiện tại dùng styling gì? Nếu migrate sang RSC, có cần đổi không? Đổi sang gì?
- [ ] **Debug**: Tại sao styled-components gây CLS mà CSS Modules không? Giải thích cơ chế injection.
- [ ] **Teach**: Giải thích cho designer tại sao "CSS written in JavaScript" có thể chậm hơn CSS bình thường.

💬 **Feynman Prompt:** Giải thích runtime vs zero-runtime CSS-in-JS bằng analogy nấu ăn — tại sao "nấu sẵn" (zero-runtime) nhanh hơn "nấu tại bàn" (runtime)?

🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Connections / Liên Kết

- ⬅️ **Built on**: [CSS Fundamentals](./00-css-fundamentals.md) — core CSS knowledge
- ⬅️ **Built on**: [CSS Architecture](./02-css-architecture.md) — BEM, OOCSS, naming conventions
- ➡️ **Enables**: [Bundle Analysis](../06-browser-performance/07-bundle-analysis-deep-dive.md) — styling impacts bundle size
- 🔗 **Applied in**: [React Performance](../06-browser-performance/02-react-performance.md) — runtime CSS-in-JS affects render performance
- 🔗 **Related**: [CSS Framework Comparison](./08-css-framework-comparison.md) — broader framework comparison
