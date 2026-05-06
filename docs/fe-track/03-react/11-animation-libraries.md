# Animation Libraries — Hoạt Họa Trong React

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Hooks & State](./02-hooks-state.md), [React Performance](./07-react-performance.md), basic CSS knowledge
> **See also**: [Browser Performance & Core Web Vitals](../06-browser-performance/01-core-web-vitals.md) | [CSS Layout & Animation](../05-html-css/06-css-animations.md) | [Accessibility](../11-accessibility/01-wcag-aria.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"Our dashboard feels sluggish when items animate in. Users complain on mobile. How do you fix it without removing animations?"_

Hầu hết Junior sẽ trả lời: _"Add `transition: all 0.3s ease`."_ Đây là câu trả lời gây ra **layout thrashing** — `all` bao gồm `width`, `height`, `top`, `left`, tất cả đều kích hoạt layout recalculation mỗi frame.

Một Senior biết rằng **không phải mọi property đều được tạo ra bình đẳng**. Chỉ `transform` và `opacity` chạy trên **GPU compositor thread** — tách biệt hoàn toàn khỏi main thread JavaScript. Đây là sự khác biệt giữa 60fps mượt mà và 20fps giật cục.

Trong thực tế:

- **Linear** dùng Framer Motion (`motion/react`) cho micro-interactions — task cards spring vào vị trí khi kéo thả, tạo cảm giác vật lý tự nhiên
- **Stripe** dùng CSS transitions + GSAP cho checkout flow — từng bước thanh toán slide với easing chính xác, không một pixel nào bị layout shift
- **Vercel** dùng View Transitions API cho dashboard navigation — page transitions native-smooth mà không cần JavaScript animation library
- **Figma** dùng custom WebGL + CSS transforms cho canvas panning — 60fps kể cả khi có 10,000 objects
- **Airbnb** build Lottie cho iOS/Android; sau đó mang lên web — nhưng học được rằng Lottie JSON 500KB cho một loader đơn giản là waste, nên giờ chuyển loader sang CSS
- **Shopee** flash-sale countdown và confetti effects trên web VN — dùng kết hợp CSS animations (countdown) + canvas particles (confetti) để không block main thread trong traffic spike

Đây là lý do tại sao **animation knowledge là senior signal**: không phải biết cú pháp của một library, mà là biết _khi nào_ dùng library nào, và _tại sao_ một cách tiếp cận nhất định giữ được 60fps.

---

## Animation Technology Tree / Cây Công Nghệ Hoạt Họa

```
ANIMATION LANDSCAPE 2026
│
├── CSS-ONLY (zero JS overhead)
│   ├── transition          ← state changes, hover, focus
│   ├── @keyframes          ← looping, entry/exit sequences
│   └── animation shorthand ← combines keyframes + timing
│
├── WEB PLATFORM APIs (browser-native)
│   ├── Web Animations API (WAAPI)    ← JS control, CSS performance
│   ├── View Transitions API          ← page/section transitions (Chrome 111+)
│   └── Scroll-driven Animations      ← @scroll-timeline, CSS scroll()
│
├── PHYSICS-BASED JS LIBRARIES
│   ├── motion/react (fka Framer Motion) ← React-first, declarative, gestures
│   │   ├── motion.div, motion.span, motion.svg
│   │   ├── AnimatePresence (exit animations)
│   │   ├── useSpring, useMotionValue
│   │   ├── LayoutGroup + layout prop (FLIP)
│   │   └── MotionConfig (global reduced-motion)
│   │
│   └── React Spring   ← physics simulation, headless
│       ├── useSpring, useSprings, useTrail
│       └── useTransition (enter/leave)
│
├── IMPERATIVE / TIMELINE LIBRARIES
│   └── GSAP (GreenSock)
│       ├── gsap.to(), gsap.from(), gsap.fromTo()
│       ├── Timeline (tl.to().to().to())
│       ├── ScrollTrigger plugin
│       └── MorphSVG, MotionPath (Club plugins)
│
├── VECTOR / LOTTIE
│   ├── Lottie (lottie-web)           ← AE JSON animations
│   ├── @lottiefiles/dotlottie-react  ← new binary format, 30–80% smaller
│   └── SVGR + CSS                    ← convert simple Lottie to SVG + CSS
│
└── TECHNIQUES (cross-library)
    ├── FLIP (First, Last, Invert, Play)  ← layout animations without reflow
    ├── GPU Compositing                   ← transform + opacity only
    ├── will-change hint                  ← promote to compositor layer
    ├── prefers-reduced-motion            ← accessibility compliance
    └── Virtualization + animation        ← 1000+ items
```

---

## Comparison Matrix / Bảng So Sánh

| Library / Technique      | Bundle (gzip)     | Declarative      | Gesture     | Layout Animation | GPU Perf             | License          | Best For                       |
| ------------------------ | ----------------- | ---------------- | ----------- | ---------------- | -------------------- | ---------------- | ------------------------------ |
| **motion/react** (v11+)  | ~45KB tree-shaken | ✅ JSX props     | ✅ Built-in | ✅ FLIP built-in | ✅ transform/opacity | MIT              | React apps, gestures, layout   |
| **GSAP** (core)          | ~70KB             | ❌ Imperative    | ❌ Manual   | ❌ Manual FLIP   | ✅ transform         | Free tier + Club | Complex timelines, SVG, scroll |
| **React Spring**         | ~35KB             | ✅ Hooks         | ⚠️ Limited  | ⚠️ Manual        | ✅ transform         | MIT              | Physics feel, headless         |
| **Lottie (lottie-web)**  | ~60KB + JSON      | ❌ (JSON-driven) | ❌          | ❌               | ⚠️ Canvas/SVG        | MIT              | AE exports, illustrations      |
| **dotLottie**            | ~25KB + .lottie   | ❌               | ❌          | ❌               | ⚠️                   | MIT              | Smaller Lottie, lazy load      |
| **View Transitions API** | 0KB               | ✅ CSS           | ❌          | ⚠️ Limited       | ✅ Native            | N/A (browser)    | Page transitions, no-lib       |
| **CSS only**             | 0KB               | ✅               | ❌          | ❌ (no FLIP)     | ✅ if transform      | N/A              | Simple states, loaders         |
| **Web Animations API**   | 0KB               | ❌ Imperative    | ❌          | ❌               | ✅                   | N/A (browser)    | Native perf, controlled        |

> 💡 **Package rename (Nov 2024)**: `framer-motion` → `motion`. Import path changes from `framer-motion` to `motion/react`. Old package still works but is deprecated. Check your `package.json`!

---

## Part 1: CSS Animations vs JS Animations / CSS vs JS

### Tại Sao Phân Biệt Quan Trọng?

Browser render pipeline:

```
JavaScript → Style → Layout → Paint → Composite
                                        ↑
              CSS transform/opacity chỉ chạy ở đây
              — không đụng đến Layout/Paint steps
```

**Layout-triggering properties** (chậm — kích hoạt toàn bộ pipeline):
`width`, `height`, `top`, `left`, `margin`, `padding`, `border`, `font-size`

**Compositor-only properties** (nhanh — chỉ chạy ở Composite step):
`transform: translate/scale/rotate`, `opacity`

### CSS Transition vs CSS Animation

```css
/* CSS Transition — triggered by state change (hover, class toggle) */
.button {
  background: blue;
  transform: scale(1);
  transition:
    transform 200ms ease,
    background 200ms ease;
}
.button:hover {
  background: darkblue;
  transform: scale(1.05);
}

/* CSS Animation — runs automatically, keyframe-defined */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loader {
  animation: spin 1s linear infinite;
}
```

**Khi nào dùng CSS-only:**

- Simple hover/focus states
- Loaders, spinners (pure CSS spinner < 1KB vs Lottie 60KB+)
- Entry animations được control bởi class toggle
- Khi bundle size là critical (LCP page, above-the-fold)

**Khi nào CSS bị giới hạn:**

- Exit animations (element unmounts trước khi animation kết thúc)
- Gesture-driven animations (drag, swipe — cần JS values)
- Phức tạp sequence/timeline
- Layout animations (animating từ vị trí A → B khi DOM thay đổi)

---

## Part 2: motion/react (Framer Motion) / motion/react

> **Tên mới**: `motion` package (Nov 2024). Import: `import { motion, AnimatePresence } from "motion/react"`
> Nếu codebase dùng `framer-motion`, vẫn hoạt động nhưng nên migrate.

### motion.div Basics

```tsx
// motion/react — basic animated div
import { motion } from "motion/react";

function FadeInCard() {
  return (
    <motion.div
      // initial state (trước khi mount)
      initial={{ opacity: 0, y: 20 }}
      // animate to (sau khi mount)
      animate={{ opacity: 1, y: 0 }}
      // transition config
      transition={{ duration: 0.4, ease: "easeOut" }}
      // hover state
      whileHover={{ scale: 1.02 }}
      // tap/click state
      whileTap={{ scale: 0.98 }}
    >
      <p>Linear-style task card</p>
    </motion.div>
  );
}
```

### AnimatePresence — Exit Animations

Vấn đề: React unmount component ngay lập tức. `AnimatePresence` intercept việc unmount, để animation chạy xong trước.

```tsx
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

function Notification() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="notification"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          // exit chỉ chạy khi visible = false (unmount)
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.25 }}
        >
          <span>Saved ✅</span>
          <button onClick={() => setVisible(false)}>×</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Variants — Orchestrating Complex Animations

```tsx
import { motion } from "motion/react";

// Variants cho stagger effect (Shopee product list)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // mỗi child delay 50ms
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {products.map((p) => (
        <motion.li key={p.id} variants={itemVariants}>
          <ProductCard product={p} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## Part 3: Layout Animations & FLIP Technique

### FLIP — First, Last, Invert, Play

FLIP là kỹ thuật để animate layout changes (thay đổi vị trí DOM) mà **không trigger layout thrashing**.

```
Vấn đề: Muốn animate một item từ position A → position B
Naive approach: measure A, measure B, animate top/left → SLOW (layout every frame)

FLIP approach:
  F = First:   Record vị trí hiện tại (getBoundingClientRect) TRƯỚC khi DOM thay đổi
  L = Last:    Thay đổi DOM → record vị trí MỚI (Last)
  I = Invert:  Apply transform để "quay lại" vị trí F (element trông như chưa move)
  P = Play:    Animate transform về 0 → element trông như đang move từ F → L

Kết quả: Chỉ dùng transform (GPU), không bao giờ animate top/left
```

**motion/react làm FLIP tự động:**

```tsx
import { motion, LayoutGroup } from "motion/react";

// Ví dụ: Todo list — item reorder khi click "complete"
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, done: false, text: "Review PR" },
    { id: 2, done: false, text: "Deploy to staging" },
    { id: 3, done: false, text: "Write tests" },
  ]);

  const sorted = [...todos].sort((a, b) => Number(a.done) - Number(b.done));

  return (
    // LayoutGroup đảm bảo tất cả children aware của nhau khi layout thay đổi
    <LayoutGroup>
      <ul>
        {sorted.map((todo) => (
          <motion.li
            key={todo.id}
            // layout prop = bật FLIP tự động
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() =>
              setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)))
            }
          >
            {todo.text}
          </motion.li>
        ))}
      </ul>
    </LayoutGroup>
  );
}
```

### Manual FLIP (không dùng library)

```typescript
// Vanilla FLIP implementation — hiểu để trả lời interview
function flipAnimate(element: HTMLElement, callback: () => void) {
  // First: measure trước khi thay đổi
  const first = element.getBoundingClientRect();

  // Thực hiện DOM change
  callback();

  // Last: measure sau khi thay đổi
  const last = element.getBoundingClientRect();

  // Invert: tính delta và apply ngược lại bằng transform
  const deltaX = first.left - last.left;
  const deltaY = first.top - last.top;

  element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  element.style.transition = "none";

  // Force reflow để browser nhận biết initial state
  element.getBoundingClientRect();

  // Play: animate về transform: none
  element.style.transform = "";
  element.style.transition = "transform 400ms ease";
}
```

---

## Part 4: GSAP — When Imperative Wins

GSAP (GreenSock) là lựa chọn khi cần **timeline control** phức tạp — animation theo sequence, scroll-triggered, SVG morphing.

### GSAP Timelines vs Framer Motion Variants

```typescript
// GSAP Timeline — imperative nhưng powerful
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Stripe-style checkout step animation
function animateCheckoutStep(container: HTMLElement) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    },
  });

  tl.from(".step-icon", { scale: 0, duration: 0.3, ease: "back.out(1.7)" })
    .from(".step-title", { opacity: 0, y: 20, duration: 0.3 }, "-=0.1")
    .from(".step-fields", { opacity: 0, y: 10, stagger: 0.05 }, "-=0.1");
  // Các animation chạy tuần tự, có thể overlap với "-=0.1"
}
```

**Khi GSAP thắng Framer Motion:**

| Tình huống                           | Tại sao GSAP                             |
| ------------------------------------ | ---------------------------------------- |
| SVG path animation / morphing        | `MorphSVGPlugin`, `MotionPathPlugin`     |
| Complex scroll choreography          | `ScrollTrigger` — battle-tested, precise |
| Canvas + WebGL animation sync        | Imperative control khớp với canvas API   |
| Frame-accurate timeline (video sync) | `gsap.ticker`, seek/pause/reverse        |
| Non-React environments               | GSAP framework-agnostic hoàn toàn        |

**Khi Framer Motion thắng GSAP:**

| Tình huống                 | Tại sao motion/react              |
| -------------------------- | --------------------------------- |
| React component enter/exit | `AnimatePresence` built-in        |
| Gesture (drag, swipe, pan) | `useDragControls`, `drag` prop    |
| Layout reorder animation   | `layout` prop với FLIP tự động    |
| Shared layout transitions  | `layoutId` prop cross-component   |
| Smaller teams, faster dev  | Declarative JSX props dễ maintain |

```tsx
// motion/react — same scroll effect, declarative style
import { motion, useScroll, useTransform } from "motion/react";

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <motion.div style={{ y }}>
      <img src="/hero.jpg" alt="Hero" />
    </motion.div>
  );
}
```

---

## Part 5: Lottie & dotLottie

### Lottie — Khi Nào Dùng, Khi Nào Tránh

Lottie render Adobe After Effects animations trên web dưới dạng JSON. Airbnb tạo ra Lottie 2015 cho app mobile; hiện được dùng rộng rãi trên web.

```tsx
// @lottiefiles/dotlottie-react — new binary format
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// ✅ Đúng use case: brand illustration, onboarding
function OnboardingStep() {
  return (
    <DotLottieReact
      src="/animations/welcome.lottie" // .lottie binary — 30-80% nhỏ hơn .json
      loop
      autoplay
      style={{ width: 300, height: 300 }}
    />
  );
}
```

**✅ Khi Lottie hợp lý:**

- Brand illustrations phức tạp từ designer (AE export)
- Onboarding flows, empty states, success screens
- Animation quá phức tạp để code bằng CSS/JS
- Có designer biết After Effects

**❌ Khi Lottie là overkill:**

- Simple loading spinners → dùng CSS (< 1KB vs 60KB+ Lottie runtime)
- Icon animations → dùng CSS transitions hoặc SVG animation
- Khi performance là priority và Lottie JSON > 100KB
- Mobile users trên slow connection (Lottie decode tốn CPU)

**Lottie Performance Checklist:**

```
☐ .lottie binary format thay vì .json (30-80% nhỏ hơn)
☐ Lazy load animation file (chỉ load khi visible)
☐ Precompose layers trong AE để giảm số keyframes
☐ Giới hạn frame rate (24fps thay vì 60fps cho illustrations)
☐ Dùng renderer: "svg" (nhẹ) thay vì "canvas" nếu không cần pixel effects
```

---

## Part 6: View Transitions API

### Same-Document vs Cross-Document

**View Transitions API** là browser-native way để animate page transitions — không cần JavaScript animation library.

```typescript
// Same-document View Transition (Chrome 111+)
async function navigateWithTransition(url: string) {
  if (!document.startViewTransition) {
    // Fallback: navigate bình thường
    window.location.href = url;
    return;
  }

  // Browser snapshot state trước và sau
  const transition = document.startViewTransition(async () => {
    // Thay đổi DOM tại đây
    await updatePageContent(url);
  });

  await transition.finished;
}
```

```css
/* CSS kiểm soát transition animation */
@keyframes slide-in-from-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out-to-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* ::view-transition-old = snapshot trước đó */
::view-transition-old(root) {
  animation: slide-out-to-left 300ms ease-out;
}

/* ::view-transition-new = snapshot mới */
::view-transition-new(root) {
  animation: slide-in-from-right 300ms ease-out;
}

/* Named view transitions cho individual elements */
.hero-image {
  view-transition-name: hero-img; /* Animate independently */
}
```

### React 19 Integration

```tsx
// React 19 — useViewTransition hook
import { useCallback } from "react";
import { useRouter } from "next/navigation"; // Next.js 15

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(() => {
        router.push(href);
      });
    },
    [href, router],
  );

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
```

**Cross-document View Transitions (Chrome 126+):**

```html
<!-- Opt-in trong <head> — không cần JavaScript! -->
<meta name="view-transition" content="same-origin" />
```

```css
/* CSS đủ để animate giữa các trang khác nhau */
@view-transition {
  navigation: auto; /* Tự động apply transition khi navigate same-origin */
}
```

**Fallback strategy:**

```typescript
// Feature detection pattern
const supportsViewTransitions = "startViewTransition" in document;

// Progressive enhancement — animation là enhancement, không phải requirement
function PageTransition({ children }: { children: React.ReactNode }) {
  if (!supportsViewTransitions) {
    return <>{children}</>;
  }
  // Wrap với transition logic
  return <ViewTransitionWrapper>{children}</ViewTransitionWrapper>;
}
```

---

## Part 7: Performance — GPU Compositing & will-change

### Compositor Properties — Chỉ 2 Properties Này

```
Browser Rendering Pipeline:
JavaScript → Recalculate Styles → Layout → Paint → Composite
                                     ↑         ↑        ↑
                     top/left/width triggers  background  transform/opacity
                                              triggers     — ONLY THIS STEP
```

```css
/* ✅ GPU-accelerated — chỉ trigger Composite */
.card {
  transition:
    transform 300ms ease,
    opacity 300ms ease;
}
.card:hover {
  transform: translateY(-4px);
  opacity: 0.9;
}

/* ❌ Forces Layout + Paint every frame */
.card-bad {
  transition:
    top 300ms ease,
    width 300ms ease;
}
.card-bad:hover {
  top: -4px; /* triggers Layout */
  width: 110%; /* triggers Layout */
}
```

### will-change — Đúng và Sai Cách Dùng

`will-change` hint cho browser "promote" element lên GPU layer TRƯỚC khi animation bắt đầu. Giảm jank khi animation khởi động.

```css
/* ✅ Đúng: Chỉ apply khi cần, remove sau */
.menu {
  /* Default: không có will-change */
}
.menu.is-animating {
  will-change: transform; /* Add khi chuẩn bị animate */
}
/* Remove sau khi animation kết thúc qua JS */

/* ✅ Đúng cho hover (browser biết sắp animate) */
.button {
  transition: transform 200ms;
}
.button:hover {
  will-change: transform;
  transform: scale(1.05);
}

/* ❌ Sai: Permanent will-change = memory leak */
/* Mỗi will-change element tạo một GPU layer = ~2MB VRAM */
.every-card {
  will-change: transform; /* 1000 cards = 2GB VRAM — crash! */
}
```

```typescript
// ✅ Dynamic will-change via JS — add trước, remove sau
function animateCard(element: HTMLElement) {
  element.style.willChange = "transform";

  element
    .animate([{ transform: "scale(1)" }, { transform: "scale(1.05)" }], {
      duration: 200,
      fill: "forwards",
    })
    .addEventListener("finish", () => {
      element.style.willChange = "auto"; // Clean up!
    });
}
```

### Animating 1000+ Items — Virtualization + Animation

```tsx
// Pattern: Virtual list + intersection-based animation
// Dùng khi cần animate large lists (Zalo chat, Shopee product feed)
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

function AnimatedVirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5, // Render thêm 5 items ngoài viewport (không animate hidden ones)
  });

  return (
    <div ref={parentRef} style={{ height: "600px", overflow: "auto" }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <VirtualRow
            key={virtualItem.key}
            virtualItem={virtualItem}
            item={items[virtualItem.index]}
          />
        ))}
      </div>
    </div>
  );
}

// Chỉ animate khi row thực sự visible
function VirtualRow({ virtualItem, item }: { virtualItem: VirtualItem; item: Item }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        top: virtualItem.start,
        left: 0,
        right: 0,
        height: virtualItem.size,
      }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      {item.content}
    </motion.div>
  );
}
```

---

## Part 8: Reduced Motion Accessibility

### prefers-reduced-motion — Không Phải Tùy Chọn

Người dùng có **vestibular disorders** (rối loạn tiền đình), epilepsy, hoặc motion sensitivity có thể bị buồn nôn, đau đầu từ excessive animations. `prefers-reduced-motion: reduce` là OS-level setting.

**Luật pháp**: ADA (Americans with Disabilities Act), EU Accessibility Act (EAA) — enforced từ 2025, yêu cầu WCAG 2.2 compliance. WCAG 2.3.3 (AAA): cho phép disable non-essential animation.

```css
/* CSS: giảm animation khi user request */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ✅ Better: preserve functionality, remove decoration */
@media (prefers-reduced-motion: reduce) {
  .card-enter {
    /* Giữ opacity fade — không gây motion sickness */
    transition: opacity 100ms;
    /* Nhưng bỏ translate movement */
  }
  .card-enter.active {
    opacity: 1;
    /* Không có transform: translateY() */
  }
}
```

```tsx
// motion/react — MotionConfig để control globally
import { MotionConfig } from "motion/react";

function App() {
  return (
    // reducedMotion: "user" = tự động detect prefers-reduced-motion
    // reducedMotion: "always" = always reduce (test/preview mode)
    // reducedMotion: "never" = ignore user preference (chỉ dùng khi có lý do)
    <MotionConfig reducedMotion="user">
      <Router />
    </MotionConfig>
  );
}

// Hook để check trong component
import { useReducedMotion } from "motion/react";

function AnimatedHero() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      animate={{
        // Nếu reduced: chỉ fade, không slide
        opacity: 1,
        y: prefersReduced ? 0 : 0, // skip y movement
      }}
      initial={{
        opacity: 0,
        y: prefersReduced ? 0 : 20, // no y offset if reduced
      }}
    >
      <h1>Welcome</h1>
    </motion.div>
  );
}
```

```typescript
// Vanilla JS / non-motion projects
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function getAnimationConfig() {
  if (mediaQuery.matches) {
    return {
      duration: 0,
      easing: "linear",
    };
  }
  return {
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  };
}

// Listen for changes (user có thể toggle OS setting khi app đang chạy)
mediaQuery.addEventListener("change", () => {
  // Re-evaluate animation preferences
  updateAnimationSystem(getAnimationConfig());
});
```

---

## Part 9: Scroll-Driven Animations

### CSS Scroll-Driven (Chrome 115+)

```css
/* Không cần JavaScript! */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section {
  /* animation-timeline: view() = trigger khi element vào viewport */
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%; /* Animate trong 30% đầu của entry */
}

/* Progress bar tied to scroll position */
.progress-bar {
  transform-origin: left;
  animation: grow-width linear;
  animation-timeline: scroll(root); /* Linked to root scroll */
}

@keyframes grow-width {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

### motion/react Scroll Animations

```tsx
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

function ScrollRevealSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress của element này relative to viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // [khi nào start tracking, khi nào stop]
  });

  // Smooth spring-based scroll value (giảm jitter)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
  const y = useTransform(smoothProgress, [0, 0.3], [40, 0]);
  const scale = useTransform(smoothProgress, [0.7, 1], [1, 0.95]);

  return (
    <motion.div ref={ref} style={{ opacity, y, scale }}>
      <h2>Vercel-style scroll reveal</h2>
    </motion.div>
  );
}
```

---

## Part 10: Bundle Size Tradeoffs

### Quyết Định Cho B2C vs Internal Tool

```
Bundle Cost Analysis (gzipped estimates, 2025):

motion/react (tree-shaken, basic):  ~18KB  (motion.div + AnimatePresence)
motion/react (full):                ~45KB  (gestures + layout + scroll)
GSAP core:                          ~70KB
GSAP + ScrollTrigger:               ~95KB
React Spring:                       ~35KB
lottie-web:                         ~60KB  + JSON files
@lottiefiles/dotlottie-react:       ~25KB  + .lottie files
CSS-only:                            ~0KB
View Transitions (browser native):   ~0KB
```

**Decision framework:**

```
Is it a marketing/landing page (B2C, LCP critical)?
  → CSS-only if simple, View Transitions API if page transitions
  → Avoid mounting GSAP/motion on above-the-fold

Is it a SaaS dashboard or internal tool?
  → motion/react (tree-shaken) — OK, bundle cost spread across sessions
  → GSAP nếu cần complex timeline/scroll

Is it an Airbnb-style consumer app với rich illustrations?
  → dotLottie for illustrations + CSS for UI interactions
  → Lazy load Lottie runtime only on screens that need it

Is it a data visualization / charting heavy page?
  → Canvas-based animations (D3 + requestAnimationFrame)
  → GSAP for orchestration if needed

Is it E-commerce flash sale (Shopee, Lazada)?
  → CSS animations cho countdown (no JS blocking in heavy traffic)
  → Canvas particles cho confetti (không block main thread)
  → Lazy load heavy libs sau LCP
```

```tsx
// ✅ Pattern: Lazy load animation lib sau LCP
import { lazy, Suspense, useEffect, useState } from "react";

const HeavyAnimation = lazy(() =>
  import("./HeavyLottieSection").then((m) => ({ default: m.HeavyLottieSection })),
);

function ProductPage() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Chỉ load sau khi LCP đã xong
    const timer = setTimeout(() => setShowAnimation(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {/* LCP content — không có animation lib */}
      <HeroSection />
      <ProductDetails />

      {/* Animation section — lazy loaded */}
      {showAnimation && (
        <Suspense fallback={<div>Loading...</div>}>
          <HeavyAnimation />
        </Suspense>
      )}
    </main>
  );
}
```

---

## Part 11: Gesture-Driven Animations

```tsx
// Drag-to-dismiss pattern (Linear, Notion mobile)
import { motion, useMotionValue, useTransform, animate } from "motion/react";

function DismissableCard({ onDismiss }: { onDismiss: () => void }) {
  const x = useMotionValue(0);

  // Transform x position to opacity (fade khi swipe xa hơn)
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);

  function handleDragEnd() {
    const currentX = x.get();
    if (Math.abs(currentX) > 100) {
      // Swipe đủ xa → dismiss
      animate(x, currentX > 0 ? 500 : -500, {
        duration: 0.2,
        onComplete: onDismiss,
      });
    } else {
      // Không đủ xa → snap back
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  }

  return (
    <motion.div
      style={{ x, opacity, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }} // Elastic resistance
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      <p>Swipe to dismiss</p>
    </motion.div>
  );
}
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: CSS transition vs CSS animation vs JS animation — khi nào dùng cái nào?

**A:**

**CSS transition**: React to a **state change** — hover, focus, class toggle. Định nghĩa start state và end state, browser interpolate giữa chúng.

```css
.button {
  transform: scale(1);
  transition: transform 200ms ease;
}
.button:hover {
  transform: scale(1.05);
}
```

**CSS animation (`@keyframes`)**: Sequence định nghĩa sẵn chạy **tự động** — không cần trigger từ state change. Dùng cho loaders, looping animations, entry animations phức tạp.

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.indicator {
  animation: pulse 2s infinite;
}
```

**JS animation** (motion/react, GSAP, Web Animations API): Khi cần **runtime values** — drag position, scroll progress, physics-based easing; khi cần **exit animations** (CSS không thể animate unmounted elements); khi cần **complex orchestration** với sequence và dependencies.

**Rule of thumb**:

- Hover/focus/toggle state → CSS transition
- Looping, loading, decorative → CSS animation
- Gesture-driven, exit, layout, scroll-tracked → JS animation library

🇻🇳 **Tóm tắt**: CSS transition = react to state, CSS animation = tự chạy theo keyframe, JS animation = gesture/runtime/exit/orchestration. Luôn ưu tiên CSS trước để tiết kiệm bundle.

**💡 Interview Signal:**

- ✅ Strong: Biết exit animation là lý do chính cần JS; phân biệt được trigger mechanism; đề cập bundle cost
- ❌ Weak: "Dùng JS animation vì flexible hơn" — bỏ qua CSS capabilities và performance cost

---

### 🟢 Q2: Tại sao `transform` và `opacity` được GPU-accelerated?

**A:**

Browser render pipeline có 5 bước: **JavaScript → Style → Layout → Paint → Composite**

`top`, `left`, `width`, `height` khi thay đổi sẽ trigger lại từ bước **Layout** — browser phải recalculate vị trí của tất cả elements liên quan, rồi repaint, rồi composite. Nếu chạy 60fps, điều này xảy ra 60 lần/giây → jank.

`transform` và `opacity` **chỉ ảnh hưởng đến bước Composite**. Browser đã "promote" element lên GPU layer riêng biệt (như một Photoshop layer). GPU có thể translate, scale, rotate, và thay opacity của layer này **mà không cần CPU tính lại layout hay paint** — nhanh hơn nhiều bậc.

```
Animating top/left:    JS → Style → Layout → Paint → Composite (60x/s)
Animating transform:   JS →                         Composite  (60x/s, GPU only)
```

**Cụ thể hơn**: `transform: translate(0, -4px)` không thay đổi element's actual position trong document flow — chỉ di chuyển nó trên màn hình (GPU). Các element khác không biết và không reflow. `top: -4px` thực sự thay đổi layout position.

🇻🇳 **Tóm tắt**: `transform` và `opacity` chỉ cần GPU compositor, bỏ qua Layout + Paint. `top/left/width` kéo theo toàn bộ pipeline. Đây là lý do `transform: translateY(-4px)` không gây jank, còn `top: -4px` thì có.

**💡 Interview Signal:**

- ✅ Strong: Đề cập 5 bước pipeline, giải thích "GPU layer promotion", phân biệt document flow vs visual position
- ❌ Weak: "GPU là nhanh hơn" — không giải thích tại sao chỉ 2 properties được accelerated

---

### 🟡 Q3: motion.div và AnimatePresence hoạt động như thế nào? Khi nào cần AnimatePresence?

**A:**

`motion.div` là React component wrap một `div` với animation capabilities. Props `initial`, `animate`, `exit` định nghĩa 3 states của element.

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }} // Trạng thái khi mount
  animate={{ opacity: 1, y: 0 }} // Trạng thái đang chạy
  exit={{ opacity: 0, y: -20 }} // Trạng thái khi unmount
/>
```

**Vấn đề**: React unmount component **ngay lập tức** khi condition là false — không cho animation `exit` chạy.

`AnimatePresence` giải quyết bằng cách **intercept việc unmount**. Khi child của `AnimatePresence` nhận tín hiệu unmount:

1. `AnimatePresence` giữ element trong DOM
2. Chạy `exit` animation
3. Sau khi animation xong → mới thực sự unmount

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal" // key REQUIRED — để AnimatePresence track element
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Modal />
    </motion.div>
  )}
</AnimatePresence>
```

**`key` prop là bắt buộc** khi conditional rendering — `AnimatePresence` dùng `key` để track element nào đang mount/unmount.

**`mode` prop của `AnimatePresence`:**

- `mode="sync"` (default): New element mount và old element unmount đồng thời
- `mode="wait"`: Old unmount xong mới mount new (cross-fade kiểu route transition)
- `mode="popLayout"`: Old element bị "pop" ra khỏi layout flow trước khi unmount

🇻🇳 **Tóm tắt**: `AnimatePresence` cần thiết khi muốn animate component khi unmount. React unmount ngay, `AnimatePresence` delay unmount để `exit` animation chạy xong. Luôn cần `key` prop trên direct children.

**💡 Interview Signal:**

- ✅ Strong: Giải thích đúng vấn đề (React unmount ngay lập tức), biết `key` requirement, biết `mode` options
- ❌ Weak: "AnimatePresence cho exit animation" — đúng nhưng không giải thích tại sao cần nó

---

### 🟡 Q4: FLIP technique là gì? motion/react implement nó như thế nào?

**A:**

**FLIP** (First, Last, Invert, Play) là kỹ thuật animate layout changes mà không trigger layout thrashing:

1. **First**: Record vị trí element **trước** khi DOM thay đổi (`getBoundingClientRect()`)
2. **Last**: Thay đổi DOM → record vị trí **sau** thay đổi
3. **Invert**: Apply `transform` để element trông như vẫn ở vị trí **First** (inverse delta)
4. **Play**: Animate `transform` về `identity (none)` → element trượt từ First → Last

Kết quả: Chỉ dùng `transform` (GPU), không bao giờ animate `top/left` — 60fps đảm bảo.

**motion/react implement FLIP tự động qua `layout` prop:**

```tsx
// Thêm layout prop = motion tự FLIP khi element's position thay đổi
<motion.div layout transition={{ type: "spring" }}>
  {content}
</motion.div>
```

Bên dưới, motion:

1. Record `getBoundingClientRect()` trước mỗi render
2. Sau render: so sánh với vị trí cũ
3. Nếu khác: apply inverse transform (Invert step)
4. Animate transform về 0 (Play step)

**`layoutId`** cho phép animate element **giữa 2 component khác nhau** — Vercel's "shared element transition":

```tsx
// Card thumbnail trong list
<motion.img layoutId={`photo-${id}`} src={url} />

// Full-size photo trong modal — motion animate FLIP between these two!
<motion.img layoutId={`photo-${id}`} src={url} style={{ width: "100%" }} />
```

🇻🇳 **Tóm tắt**: FLIP = tính toán vị trí trước và sau, "giả vờ" element chưa move bằng transform, rồi animate về 0. Toàn bộ chỉ dùng transform → GPU. motion/react tự làm FLIP khi dùng `layout` prop.

**💡 Interview Signal:**

- ✅ Strong: Giải thích được 4 bước F-L-I-P, biết tại sao GPU-only, biết `layoutId` cho shared transitions
- ❌ Weak: "layout prop tự animate" — không giải thích cơ chế FLIP bên dưới

---

### 🟡 Q5: GSAP timelines vs Framer Motion variants — khi nào imperative wins?

**A:**

**Framer Motion variants** là declarative — bạn định nghĩa states, motion tính toán transitions. Dễ read, dễ maintain, tích hợp React re-render tự nhiên.

**GSAP timelines** là imperative — bạn orchestrate từng animation theo sequence với precise timing control. Cồng kềnh hơn nhưng mạnh hơn cho complex cases.

**Imperative (GSAP) thắng khi:**

1. **Frame-accurate timing**: `tl.to(el, {x: 100}, 2.5)` — chính xác đến millisecond. Cần sync với audio/video.

2. **Complex SVG animation**: MorphSVGPlugin, MotionPathPlugin — không có equivalent trong motion.

3. **Scroll choreography phức tạp**: GSAP ScrollTrigger có pinning, scrubbing, snap points — mature và battle-tested hơn motion's scroll utilities.

4. **Non-React environment**: GSAP framework-agnostic, chạy trong Vue, Angular, vanilla JS.

5. **Reverse / seek / playhead control**: `tl.seek(2.5)`, `tl.reverse()`, `tl.timeScale(0.5)` — imperative control không có trong declarative model.

```typescript
// GSAP — complex scroll-pinned sequence (Stripe-style landing)
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".feature-section",
    pin: true, // Pin section khi scroll qua
    scrub: 1, // Tie animation progress to scroll (1s lag)
    snap: 1 / (steps - 1), // Snap to each step
  },
});
tl.from(".step-1", { opacity: 0, x: -100 })
  .from(".step-2", { opacity: 0, y: 50 }, "+=0.2")
  .from(".step-3", { opacity: 0, scale: 0.5 }, "+=0.2");
```

**motion/react thắng khi:**

- React component lifecycle integration (enter/exit)
- Gesture-driven animations (drag, pan)
- Layout animations (FLIP tự động)
- Team familiar với React paradigm

🇻🇳 **Tóm tắt**: GSAP wins ở SVG morphing, scroll pinning/scrubbing, frame-accurate timeline, non-React context. motion/react wins ở React integration, gestures, layout animation, exit animations. Không có "better" — có "right tool for job".

**💡 Interview Signal:**

- ✅ Strong: Cho ví dụ cụ thể mỗi bên thắng, biết ScrollTrigger capabilities, biết GSAP license model (Club plugins paid)
- ❌ Weak: "GSAP more powerful" — không phân biệt được khi nào complexity là justified

---

### 🟡 Q6: Lottie performance — khi nào dùng, khi nào convert sang CSS/SVG?

**A:**

**Khi Lottie là lựa chọn đúng:**

- Designer xuất từ After Effects — animation phức tạp không thể code tay (character animation, particle effects, brand illustrations)
- Onboarding flows, empty states, success screens
- Animation cần thay đổi mà không cần code (designer update AE → re-export)

**Khi KHÔNG dùng Lottie:**

1. **Simple loaders**: CSS spinner = 0.3KB. Lottie runtime = 60KB + JSON. Không justify.

2. **Icon animations** (checkmark, hamburger toggle): CSS animation hoặc SVG animation đủ.

3. **Performance-critical paths**: Lottie parse JSON và render SVG/Canvas — tốn CPU, đặc biệt trên mobile. `lottie-web` runtime ~60KB gzip trước khi load animation JSON.

4. **Large JSON files (> 100KB)**: Điều này xảy ra khi AE animation có nhiều layers, images embed. Nên precompose layers, giảm frame rate, hoặc convert sang video.

**dotLottie vs lottie-web:**

```
lottie-web: JSON format — verbose, 100–500KB files
dotLottie: Binary .lottie format — 30–80% nhỏ hơn, lazy loadable
```

**Convert Lottie → CSS/SVG khi:**

- Animation là một vài shapes chuyển động đơn giản
- Cần accessibility (screen reader descriptions)
- Need zero dependency (email templates, AMP pages)

```tsx
// ✅ Lazy load Lottie chỉ khi cần
const LottiePlayer = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({
    default: m.DotLottieReact,
  })),
);

function SuccessScreen() {
  return (
    <Suspense fallback={<div className="spinner-css" />}>
      <LottiePlayer src="/success.lottie" autoplay loop={false} />
    </Suspense>
  );
}
```

🇻🇳 **Tóm tắt**: Lottie đúng cho AE exports phức tạp mà không thể code tay. Sai cho loaders, icon animations, performance-critical paths. Luôn dùng dotLottie binary thay JSON, và lazy load runtime.

**💡 Interview Signal:**

- ✅ Strong: Biết file size numbers (60KB runtime, 30-80% saving với dotLottie), biết khi nào convert sang CSS, đề xuất lazy loading
- ❌ Weak: "Lottie cho animations đẹp" — không có reasoning về performance tradeoffs

---

### 🔴 Q7: prefers-reduced-motion — implementation, MotionConfig, và accessibility law?

**A:**

`prefers-reduced-motion: reduce` là CSS media query phản ánh user's OS-level setting. Người dùng với **vestibular disorders** (rối loạn tiền đình), epilepsy, motion sensitivity — animations có thể gây buồn nôn, chóng mặt, thậm chí seizures.

**Legal context:**

- **ADA (Americans with Disabilities Act)**: Web accessibility là yêu cầu pháp lý cho US businesses. Domino's v. Robles (2019) xác nhận ADA apply to websites.
- **EU Accessibility Act (EAA)**: Enforced từ June 2025, yêu cầu WCAG 2.1 AA cho commercial products trong EU.
- **WCAG 2.3.3 (AAA)**: "Animation from Interactions" — cho phép users tắt animation không essential.
- **WCAG 2.3.1 (AA)**: "Three Flashes" — nội dung không được flash > 3 lần/giây.

**Implementation layers:**

```tsx
// Layer 1: MotionConfig global — motion/react
// Đặt ở root app, tự động apply cho tất cả motion components
function App() {
  return (
    <MotionConfig reducedMotion="user">
      {" "}
      {/* Auto-detect OS setting */}
      <AppContent />
    </MotionConfig>
  );
}

// Layer 2: Component-level — useReducedMotion hook
import { useReducedMotion } from "motion/react";

function AnimatedCard() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Nếu reduced: chỉ fade (opacity change OK), không slide (motion gây nôn)
      transition={{ duration: shouldReduce ? 0.1 : 0.4 }}
    />
  );
}

// Layer 3: CSS fallback — luôn có, ngay cả khi JS fail
// styles/globals.css
```

```css
@media (prefers-reduced-motion: reduce) {
  /* Safe: opacity/color transitions OK — không có spatial movement */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Exception: loading spinners dùng opacity thay vì rotation */
  .spinner {
    animation: pulse 1s infinite !important; /* opacity pulse OK */
  }
}
```

**Quy tắc quan trọng**: Không phải disable tất cả animation — **disable spatial movement**. Opacity transitions (fade in/out) ít ảnh hưởng đến vestibular disorders. `transform: translate`, `rotate`, `scale` là những gì cần reduce/remove.

🇻🇳 **Tóm tắt**: `prefers-reduced-motion` là OS setting cho người bị rối loạn tiền đình, động kinh. ADA + EAA 2025 yêu cầu compliance. motion/react: `<MotionConfig reducedMotion="user">` ở root. CSS: `@media (prefers-reduced-motion: reduce)` fallback. Quan trọng: fade (opacity) OK, spatial movement (translate/rotate/scale) mới cần disable.

**💡 Interview Signal:**

- ✅ Strong: Biết pháp lý (ADA, EAA 2025), phân biệt opacity OK vs spatial movement không OK, implement cả 3 layers (MotionConfig + hook + CSS), biết `useReducedMotion`
- ❌ Weak: "Add media query để disable animation" — thiếu legal context, thiếu opacity vs spatial distinction

---

### 🔴 Q8: View Transitions API — same-document vs cross-document, React 19, fallback strategy?

**A:**

**View Transitions API** cho phép browser animate giữa DOM states bằng cách snapshot trạng thái trước và sau.

**Same-document** (JavaScript-driven):

```typescript
// Chrome 111+
document.startViewTransition(() => {
  // Bất kỳ DOM change nào xảy ra ở đây được animated
  updateDOM();
});
// Browser: snapshot old → run callback → snapshot new → animate between
```

**Cross-document** (CSS opt-in, không cần JS):

```html
<meta name="view-transition" content="same-origin" />
```

```css
@view-transition {
  navigation: auto;
}
/* Chrome 126+ — animate giữa page navigations tự động */
```

**`view-transition-name`** cho named element transitions (giống `layoutId` của motion):

```css
.thumbnail {
  view-transition-name: hero-image;
}
/* Cùng tên trên trang tiếp theo → browser animate element đó independently */
```

**React 19 integration:**
React 19 expose `startTransition` tích hợp với View Transitions trong experimental builds. Practical pattern hiện tại:

```tsx
function useViewTransition() {
  return useCallback((callback: () => void) => {
    if (!document.startViewTransition) {
      callback(); // Fallback: no transition
      return;
    }
    document.startViewTransition(callback);
  }, []);
}

// Dùng trong router
function NavigationLink({ href }: { href: string }) {
  const startViewTransition = useViewTransition();
  const router = useRouter();

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startViewTransition(() => router.push(href));
      }}
    />
  );
}
```

**Fallback strategy (Progressive Enhancement):**

```typescript
// Tier 1: No View Transitions support → Navigate normally (all browsers)
// Tier 2: View Transitions → Smooth animation (Chrome 111+)
// Tier 3: View Transitions + named elements → Per-element animation (Chrome 126+)

function navigate(url: string) {
  if (!document.startViewTransition) {
    // Tier 1: Plain navigation
    window.location.href = url;
    return;
  }
  // Tier 2+: Animated
  document.startViewTransition(() => updateApp(url));
}
```

**Limitations (2025):**

- Firefox: Chưa support (in development)
- Safari: Chưa support
- Không support animating elements khi `overflow: hidden` trên ancestor
- Cross-document: cần same-origin, Chrome 126+

🇻🇳 **Tóm tắt**: View Transitions: same-document dùng `document.startViewTransition()`, cross-document dùng CSS meta tag. `view-transition-name` cho element-level transitions. Luôn implement progressive enhancement — transition là enhancement, không phải requirement. Firefox/Safari chưa support → không thể dùng làm primary solution cho B2C apps.

**💡 Interview Signal:**

- ✅ Strong: Biết browser support limitation, phân biệt same vs cross document, triển khai progressive enhancement đúng cách, biết `view-transition-name` cho element transitions
- ❌ Weak: "View Transitions replace animation libraries" — không biết browser support gaps và limitations

---

### 🔴 Q9: Animating 1000+ items — virtualization + animation, will-change pitfalls, memory cost?

**A:**

**Vấn đề với 1000+ animated items:**

1. **DOM size**: 1000 DOM nodes = large layout tree → layout recalculations chậm
2. **will-change abuse**: Nếu apply `will-change: transform` cho 1000 items → 1000 GPU layers → ~2GB VRAM usage → browser crash trên mobile
3. **JavaScript overhead**: Animating 1000 motion.div independently = 1000 JS animation instances

**Solution architecture:**

```tsx
// Bước 1: Virtualize — chỉ render visible items (thường 10-20)
import { useVirtualizer } from "@tanstack/react-virtual";

// Bước 2: Animate chỉ newly-visible items (intersection)
import { useInView } from "motion/react";

// Bước 3: will-change dynamically — chỉ khi đang animate
function AnimatedVirtualItem({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{
        // will-change chỉ apply khi đang animate
        willChange: isAnimating ? "transform" : "auto",
      }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      onAnimationStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
    >
      {item.content}
    </motion.div>
  );
}
```

**will-change memory cost:**

```
Each will-change element = separate GPU texture layer
Texture size ≈ width × height × 4 bytes (RGBA)
100×100px element: 100 × 100 × 4 = 40KB VRAM
1000 items 100×100px: 40MB VRAM — manageable
1000 items full-width (360px × 72px): 1000 × 360 × 72 × 4 = ~103MB VRAM — problematic on mobile

→ Rule: will-change cho ≤ 20 elements đồng thời max
```

**Alternative cho large lists**: CSS-only animation với `@keyframes` — browser quản lý compositing tốt hơn JS-driven, không cần will-change hint:

```css
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-item {
  animation: slide-in 200ms ease-out forwards;
  /* Browser tự optimize compositing, không leak GPU memory */
}
```

**Canvas-based approach cho extreme scale** (Shopee-style particle effects):

```typescript
// Canvas render tất cả animation — chỉ 1 DOM element, tất cả GPU-managed
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const particles: Particle[] = createParticles(500);

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        updateParticle(p);
        drawParticle(ctx, p);
      });
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} />;
}
```

🇻🇳 **Tóm tắt**: 1000+ items → không thể animate tất cả cùng lúc. Giải pháp: (1) Virtualize (10-20 items visible), (2) Animate chỉ newly-visible items via IntersectionObserver, (3) will-change dynamic (add/remove theo animation lifecycle). will-change permanent cho 1000 items = ~100MB VRAM leak. Extreme scale → Canvas.

**💡 Interview Signal:**

- ✅ Strong: Biết will-change memory cost (GPU texture per element), biết 2GB VRAM issue, đề xuất virtualization + intersection, biết Canvas alternative cho extreme cases
- ❌ Weak: "Dùng will-change để tăng performance" — không biết permanent will-change là memory leak

---

### 🔴 Q10: Bundle cost tradeoff — GSAP vs motion/react vs CSS-only cho B2C app vs internal tool?

**A:**

**Context matters more than library features.** Câu hỏi đúng: _"Who are the users, on what devices, on what network, and how often do they load this page?"_

**B2C App (Grab, Shopee, Zalo VN — mobile-first):**

```
Typical user: Tier-2 Vietnam city, 4G (10-15 Mbps), mid-range Android
LCP budget: 2.5s maximum
JS parse/execute: ~5ms per 1KB on mid-range phone

Motion/react (tree-shaken, basic): ~18KB → ~90ms parse
GSAP core: ~70KB → ~350ms parse
Lottie-web: ~60KB → ~300ms parse

Decision: CSS-only for UI micro-interactions (0KB)
         motion/react ONLY for critical interactive features, lazy loaded after LCP
         GSAP: only if ScrollTrigger animations are brand-critical, code-split per section
         Lottie: dotLottie lazy loaded, only for hero illustrations
```

**Internal Tool (Dashboard, Admin Panel):**

```
Typical user: Company laptop, broadband, Chrome, cached after first load
LCP budget: 4s acceptable (authenticated users, expected wait)
Session: Multi-hour usage, bundle amortized across many interactions

Decision: motion/react full (45KB) — OK, pays off in UX polish
         GSAP if complex data viz animations needed
         Rich Lottie animations for empty states OK (preloaded)
```

**Decision matrix:**

```typescript
// Runtime decision — adapt based on connection
function getAnimationStrategy() {
  const connection = (navigator as NavigatorWithConnection).connection;

  if (connection?.effectiveType === "2g" || connection?.saveData) {
    return "css-only"; // Respect data-saver mode
  }
  if (connection?.effectiveType === "3g") {
    return "motion-minimal"; // Fade only, no physics
  }
  return "motion-full"; // Full animations
}
```

**Practical recommendation for Grab/Zalo interview:**

1. LCP-critical path: CSS-only (transitions, keyframes) — 0KB
2. Below-the-fold interactive: lazy-import `motion/react` after LCP
3. Code-split animation lib per route — không load GSAP trên trang không cần
4. Use `prefers-reduced-motion` + `save-data` to skip animations entirely on poor connections

🇻🇳 **Tóm tắt**: B2C mobile VN = CSS-only above-the-fold, lazy load motion/react sau LCP, không bao giờ GSAP on landing page. Internal tool = OK để ship motion/react full vì users on broadband + long sessions. Luôn code-split animation libs theo route. Respect `save-data` header để skip animations trên slow connections.

**💡 Interview Signal:**

- ✅ Strong: Biết parse cost trên mid-range Android, phân biệt B2C vs internal budget, đề cập `navigator.connection.saveData`, biết lazy loading pattern sau LCP
- ❌ Weak: "GSAP có nhiều features hơn nên dùng GSAP" — bỏ qua bundle cost và user context

---

## Anti-Patterns / Những Lỗi Cần Tránh

---

### ❌ Anti-Pattern 1: Animating `top`/`left`/`width`/`height`

**Vấn đề**: Triggers Layout + Paint mỗi frame → jank, high CPU, battery drain.

```css
/* ❌ Sai — layout thrashing mỗi frame */
.card {
  transition:
    top 300ms,
    width 300ms;
}
.card:hover {
  top: -4px;
  width: 110%;
}

/* ✅ Đúng — chỉ compositor */
.card {
  transition:
    transform 300ms,
    box-shadow 300ms;
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}
```

**Test**: Chrome DevTools → Performance tab → record animation → tìm "Recalculate Style" và "Layout" events. Nếu xuất hiện mỗi frame → bạn đang animating wrong properties.

---

### ❌ Anti-Pattern 2: Permanent `will-change`

**Vấn đề**: Mỗi `will-change` element = GPU texture layer. Hàng trăm elements = VRAM exhaustion. Mobile browser crash hoặc bật hardware acceleration limit.

```css
/* ❌ Sai — permanent will-change cho list items */
.product-card {
  will-change: transform; /* 100 cards = 100 GPU layers */
}

/* ✅ Đúng — dynamic will-change */
.product-card:hover {
  will-change: transform; /* Chỉ khi hover — tối đa vài items đồng thời */
}
/* Hoặc via JS — add trước animate, remove sau onComplete */
```

**Quy tắc**: `will-change` chỉ cho ≤ 10–20 elements visible simultaneously. Luôn remove sau animation.

---

### ❌ Anti-Pattern 3: Ignoring `prefers-reduced-motion`

**Vấn đề**: Vestibular disorders, epilepsy — motion-heavy animations có thể gây physical harm. ADA và EU EAA 2025 yêu cầu compliance.

```tsx
/* ❌ Sai — animate mà không check */
function Hero() {
  return (
    <motion.div animate={{ x: [0, 100, 0], rotate: [0, 360, 0] }}>
      {/* Spinning + moving = vomit-inducing cho vestibular disorders */}
    </motion.div>
  );
}

/* ✅ Đúng — check và adapt */
function Hero() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      animate={
        reduceMotion
          ? { opacity: 1 } // Chỉ fade — an toàn
          : { x: [0, 100, 0], rotate: [0, 360, 0] }
      }
    />
  );
}
/* Cộng: MotionConfig reducedMotion="user" ở root */
```

---

### ❌ Anti-Pattern 4: Lottie cho Simple Loaders

**Vấn đề**: `lottie-web` runtime = ~60KB gzip. Simple spinner animation = không đáng để ship 60KB.

```tsx
/* ❌ Sai — Lottie cho spinner */
import Lottie from "lottie-react";
import spinnerData from "./spinner.json"; // + 60KB runtime + 20KB JSON

function LoadingSpinner() {
  return <Lottie animationData={spinnerData} />;
}

/* ✅ Đúng — CSS spinner = 0KB runtime */
function LoadingSpinner() {
  return (
    <div
      aria-label="Loading"
      role="status"
      style={{
        width: 24,
        height: 24,
        border: "3px solid #e5e7eb",
        borderTopColor: "#6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
/* @keyframes spin { to { transform: rotate(360deg) } } */
```

---

### ❌ Anti-Pattern 5: Mounting Heavy Animation Libs on Landing Page (LCP Regression)

**Vấn đề**: Import `framer-motion` / `gsap` ở top-level của landing page component → included trong initial bundle → blocks LCP.

```tsx
/* ❌ Sai — eager import ở landing page */
import { motion } from "motion/react"; // ~45KB vào initial bundle
import { gsap } from "gsap"; // ~70KB vào initial bundle

export default function LandingPage() {
  return <motion.div>...</motion.div>;
}

/* ✅ Đúng — lazy load sau LCP */
import { lazy, Suspense, useEffect, useState } from "react";

const AnimatedSection = lazy(() => import("./AnimatedSection"));

export default function LandingPage() {
  const [lcpDone, setLcpDone] = useState(false);

  useEffect(() => {
    // Load animations sau khi LCP đã complete
    const observer = new PerformanceObserver(() => setLcpDone(true));
    observer.observe({ type: "largest-contentful-paint", buffered: true });
    // Fallback timeout
    const t = setTimeout(() => setLcpDone(true), 2000);
    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <main>
      {/* LCP content — zero animation libs */}
      <h1>Welcome to Grab</h1>
      <img src="/hero.jpg" alt="Hero" fetchPriority="high" />

      {/* Animated content — lazy loaded sau LCP */}
      {lcpDone && (
        <Suspense fallback={null}>
          <AnimatedSection />
        </Suspense>
      )}
    </main>
  );
}
```

---

### ❌ Anti-Pattern 6: AnimatePresence without `key` prop

**Vấn đề**: Không có `key`, AnimatePresence không thể track element nào mount/unmount → exit animation không chạy.

```tsx
/* ❌ Sai — thiếu key */
<AnimatePresence>
  {isOpen && <motion.div exit={{ opacity: 0 }}>Modal</motion.div>}
</AnimatePresence>
// Exit animation KHÔNG chạy vì AnimatePresence không track được element

/* ✅ Đúng — key required */
<AnimatePresence>
  {isOpen && (
    <motion.div key="modal" exit={{ opacity: 0 }}>Modal</motion.div>
  )}
</AnimatePresence>
```

---

### ❌ Anti-Pattern 7: Animating All 1000 List Items Simultaneously

**Vấn đề**: 1000 `motion.div` với `initial` + `animate` = 1000 JS animation instances, 1000 GPU layers nếu dùng will-change.

```tsx
/* ❌ Sai — animate tất cả cùng lúc */
{
  products.map((p) => (
    <motion.div
      key={p.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ willChange: "transform" }} // 1000 GPU layers!
    >
      <ProductCard product={p} />
    </motion.div>
  ));
}

/* ✅ Đúng — virtualize + animate only visible */
// Dùng @tanstack/react-virtual + useInView per virtual row
// Chỉ 10-20 items trong DOM + animated tại một thời điểm
```

---

## 🧠 Memory Hook

> **"Transform và opacity — GPU lane riêng. Top và left — phải đứng xếp hàng."**
>
> GPU-accelerated = **T**ransform + **O**pacity → "TO GO" (nhanh).
> Avoid = **T**op, **L**eft, **W**idth, **H**eight → "TLWH = Too Laggy, Will Hurt".
>
> **FLIP** = Đo trước → Thay DOM → Bù bằng transform → Play về 0.
>
> **AnimatePresence** = React unmount ngay, AnimatePresence trì hoãn để exit animation chạy xong.
>
> **will-change**: Dùng như gia vị — quá nhiều = memory overdose. Dynamic add/remove, không permanent.
>
> **prefers-reduced-motion**: Fade (opacity) OK → không gây nôn. Move/rotate/scale → disable khi reduced.

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Question                          | Key Answer                                                                                      | Level |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------- | ----- |
| Q1  | CSS transition vs animation vs JS | State change→transition; auto-run→keyframes; gesture/exit/layout→JS                             | 🟢    |
| Q2  | transform/opacity GPU-accelerated | Chỉ trigger Composite step, skip Layout+Paint                                                   | 🟢    |
| Q3  | motion.div + AnimatePresence      | AnimatePresence delay unmount cho exit animation; key prop required                             | 🟡    |
| Q4  | FLIP technique                    | F=Record, L=Change DOM, I=Apply inverse transform, P=Animate to 0                               | 🟡    |
| Q5  | GSAP vs motion/react              | GSAP wins: SVG morph, scroll pin, timeline seek. motion wins: React lifecycle, gestures, layout | 🟡    |
| Q6  | Lottie performance                | CSS for simple loaders; Lottie for complex AE exports; dotLottie binary format                  | 🟡    |
| Q7  | prefers-reduced-motion            | ADA+EAA legal; MotionConfig+"user"; fade OK, spatial movement disable                           | 🔴    |
| Q8  | View Transitions API              | Same-doc=JS startViewTransition; Cross-doc=CSS meta; Progressive enhancement always             | 🔴    |
| Q9  | 1000+ items animation             | Virtualize+IntersectionObserver; dynamic will-change; Canvas for extreme scale                  | 🔴    |
| Q10 | Bundle cost tradeoff              | B2C: CSS above-fold, lazy motion after LCP; Internal: motion full OK                            | 🔴    |

---

## Cold Call / Câu Hỏi Bất Ngờ

Interviewer có thể hỏi không báo trước — đây là các prompts thường gặp:

---

**1.** _"Draw me the browser rendering pipeline and tell me where animations should live."_

> Vẽ: `JS → Style → Layout → Paint → Composite`. Chỉ vào Composite: "This is where transform and opacity live — GPU thread, doesn't touch Layout or Paint. Everything else is expensive."

---

**2.** _"Our marketing page has a Framer Motion hero section and LCP is 4.2s on mobile. What do you do?"_

> "Đầu tiên tôi sẽ check DevTools Network — xem motion/react có trong critical bundle không. Nếu có: code-split `AnimatedHero` ra lazy component, chỉ load sau LCP. Thay thế entry animation bằng CSS keyframe (0KB) trước, rồi lazy upgrade với motion sau. Target: motion không được block LCP."

---

**3.** _"A designer wants the product cards to animate when reordered. How do you implement it?"_

> "FLIP technique. motion/react: thêm `layout` prop vào `motion.li`, bọc trong `LayoutGroup`. Khi order thay đổi, motion tự calculate FLIP transforms — chỉ dùng CSS transform (GPU), không animate top/left. Transition type: spring cho cảm giác vật lý tự nhiên."

---

**4.** _"User with epilepsy reports your site is causing issues. What do you do immediately and long-term?"_

> "Ngay lập tức: add `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; } }` để disable tất cả animation cho OS reduced-motion users. Long-term: (1) Audit toàn bộ animation — remove flash, strobe, rapid motion. (2) Add `MotionConfig reducedMotion='user'` ở React root. (3) Test với OS reduced-motion ON. (4) WCAG 2.3.1 compliance check — không có content flash > 3x/giây. ADA legal risk nếu không fix."

---

**5.** _"We're using Framer Motion in our package.json. Is that correct for 2025?"_

> "`framer-motion` package vẫn hoạt động nhưng deprecated kể từ November 2024. Package mới là `motion`, import từ `motion/react`. API backward-compatible — migration là replace `from 'framer-motion'` thành `from 'motion/react'`. Nên migrate để nhận được tree-shaking improvements và future features từ Motion team."

---

## Self-Check / Kiểm Tra Bản Thân

Sau khi đọc xong, tự trả lời các câu hỏi này trong 30 giây không nhìn tài liệu:

- [ ] Kể tên 2 CSS properties là compositor-only (GPU-accelerated)?
- [ ] FLIP viết tắt của gì? 4 bước?
- [ ] Tại sao `AnimatePresence` cần `key` prop?
- [ ] `will-change` permanent cho 1000 items gây ra vấn đề gì cụ thể?
- [ ] Sự khác biệt giữa `motion/react` và `framer-motion`?
- [ ] Khi nào GSAP tốt hơn motion/react?
- [ ] Vestibular disorders + `prefers-reduced-motion` — fade animation có OK không?
- [ ] View Transitions API: cần progressive enhancement vì sao?
- [ ] B2C mobile VN: có nên ship GSAP trên landing page không? Tại sao?
- [ ] dotLottie vs lottie-web — sự khác biệt?

**Scoring**: 8–10/10 = Senior-ready | 5–7/10 = Review Q7–Q10 | < 5/10 = Re-read Parts 3, 7, 8

---

> 💡 **Final Advice / Lời Khuyên Cuối**
>
> Với Zalo, Grab VN, Shopee: **performance trên mid-range Android là topic họ care nhất**. Câu trả lời luôn nên bắt đầu từ user's device và connection, không phải từ feature của library.
>
> Với Axon, Microsoft, Google: Expect **accessibility depth** — `prefers-reduced-motion`, ARIA live regions cho animation announcements, keyboard-controllable animations.
>
> Với Employment Hero: **React ecosystem fluency** — biết motion/react rename, biết khi nào CSS đủ, biết bundle impact.
