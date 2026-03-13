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

---

## 2. Tailwind CSS (Utility-First)

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

---

## 3. CSS-in-JS (styled-components / emotion)

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

### Q: How does Tailwind avoid shipping unused CSS? 🟢 Junior

**A:** Tailwind scans all your source files (via `content` config) for class names, then generates ONLY the CSS for classes actually found. Production output is typically 5-30KB. Without this purging, the full Tailwind is ~3MB.

### Q: CSS Modules vs global CSS — what's the core difference? 🟢 Junior

**A:** CSS Modules transforms class names to unique hashes at build time: `.button` → `.Button_button__abc123`. This makes styles locally scoped — impossible to accidentally override another component's styles. Global CSS has no such protection.

---

**See also**: [CSS Architecture](./02-css-architecture.md) | [Modern CSS Features](./06-modern-css-features.md)
