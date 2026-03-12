# Rendering Pipeline - Critical Rendering Path

> Hiểu rendering pipeline giúp optimize performance. Biết khi nào trigger layout/paint để tránh jank.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   RENDERING PIPELINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HTML ──▶ DOM ──▶ Render ──▶ Layout ──▶ Paint ──▶ Composite    │
│             │      Tree        │          │          │           │
│   CSS ──▶ CSSOM ──┘            │          │          │           │
│                                │          │          │           │
│                                ▼          ▼          ▼           │
│                            Position    Pixels     Layers         │
│                            & Size     & Colors    Combined       │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    CRITICAL PATH                         │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │                                                           │   │
│   │   Bytes → Characters → Tokens → Nodes → DOM/CSSOM        │   │
│   │                                                           │   │
│   │   Time to First Paint depends on:                         │   │
│   │   • HTML size                                             │   │
│   │   • CSS blocking resources                                │   │
│   │   • JavaScript blocking resources                         │   │
│   │                                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 DOM Construction

### HTML Parsing

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTML → DOM                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Raw Bytes                                                       │
│   3C 68 74 6D 6C 3E...                                           │
│        │                                                          │
│        ▼ (decode based on encoding)                              │
│   Characters                                                      │
│   <html><head><title>...                                         │
│        │                                                          │
│        ▼ (tokenization)                                          │
│   Tokens                                                          │
│   StartTag: html │ StartTag: head │ StartTag: title │ ...       │
│        │                                                          │
│        ▼ (tree construction)                                     │
│   Nodes                                                           │
│   HTMLHtmlElement → HTMLHeadElement → HTMLTitleElement           │
│        │                                                          │
│        ▼                                                          │
│   DOM Tree                                                        │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                      Document                             │  │
│   │                          │                                │  │
│   │                       <html>                              │  │
│   │                      ╱      ╲                             │  │
│   │                 <head>      <body>                        │  │
│   │                   │           │                           │  │
│   │               <title>      <div>                          │  │
│   │                   │        ╱    ╲                         │  │
│   │               "Hello"   <p>    <img>                      │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Incremental Parsing

```javascript
// Browser parses HTML incrementally
// Can start rendering before full HTML received

// Preload scanner runs ahead
// Finds resources to fetch early:
// <link>, <script src>, <img src>

// But parsing can be blocked by:

// 1. Synchronous scripts
<script src="app.js"></script>  // Blocks parsing!

// 2. Stylesheets before scripts
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>  // Waits for CSS!

// Solutions:
<script async src="app.js"></script>  // Parse continues
<script defer src="app.js"></script>  // Execute after parse
```

---

## 🎨 CSSOM Construction

### CSS Parsing

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSS → CSSOM                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CSS                                                             │
│   body { font-size: 16px; }                                      │
│   .container { width: 100%; }                                    │
│   p { color: #333; }                                             │
│        │                                                          │
│        ▼ (tokenize & parse)                                      │
│   CSSOM Tree                                                      │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    StyleSheetList                         │  │
│   │                          │                                │  │
│   │                    CSSStyleSheet                          │  │
│   │                          │                                │  │
│   │                    CSSRuleList                            │  │
│   │                  ╱       │       ╲                        │  │
│   │           CSSRule    CSSRule    CSSRule                   │  │
│   │           body {}    .container{} p {}                    │  │
│   │              │           │          │                     │  │
│   │        font-size:16px width:100% color:#333              │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│   CSSOM is render-blocking!                                      │
│   Browser won't render until CSSOM is complete                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Style Calculation

```javascript
// Browser calculates computed styles for every element

// 1. Collect all matching rules
const matchingRules = [
    'body { font-size: 16px }',
    '.container { color: blue }',
    '#main .container { color: red }' // Higher specificity
];

// 2. Sort by specificity
// 3. Apply cascade rules
// 4. Resolve relative values

// Expensive operations:
// • Complex selectors
// • Many rules to check
// • Frequent style changes

// Optimize:
// • Keep selectors simple
// • Reduce total CSS
// • Minimize style changes
```

---

## 🌲 Render Tree

### Building Render Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                 DOM + CSSOM = RENDER TREE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   DOM Tree                CSSOM                Render Tree       │
│   ┌─────────┐         ┌─────────┐           ┌─────────────┐     │
│   │ <html>  │         │ Styles  │           │             │     │
│   │   │     │    +    │         │    =      │  <html>     │     │
│   │ <body>  │         │         │           │    │        │     │
│   │   │     │         │         │           │  <body>     │     │
│   │ <div>   │         │         │           │    │        │     │
│   │   │     │         │         │           │  <div>      │     │
│   │  <p>    │         │         │           │  {styles}   │     │
│   │  <span> │         │         │           │             │     │
│   └─────────┘         └─────────┘           └─────────────┘     │
│                                                                   │
│   NOT in Render Tree:                                            │
│   • <head>, <script>, <meta>                                     │
│   • Elements with display: none                                  │
│   • ::before, ::after (added to render tree)                     │
│                                                                   │
│   Note: visibility: hidden IS in render tree (takes space)      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Layout (Reflow)

### What Layout Calculates

```
┌─────────────────────────────────────────────────────────────────┐
│                         LAYOUT                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Input: Render Tree with styles                                 │
│   Output: Box model for every element                            │
│                                                                   │
│   Calculates:                                                     │
│   • Position (x, y coordinates)                                  │
│   • Size (width, height)                                         │
│   • Relationship between elements                                │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Viewport (1920 x 1080)                                  │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │ body (x:0, y:0, w:1920, h:2000)                  │    │   │
│   │  │ ┌────────────────────────────────────────────┐  │    │   │
│   │  │ │ header (x:0, y:0, w:1920, h:60)            │  │    │   │
│   │  │ └────────────────────────────────────────────┘  │    │   │
│   │  │ ┌────────────────────────────────────────────┐  │    │   │
│   │  │ │ main (x:0, y:60, w:1920, h:1800)           │  │    │   │
│   │  │ │ ┌──────────────┐ ┌──────────────────────┐ │  │    │   │
│   │  │ │ │sidebar      │ │content               │ │  │    │   │
│   │  │ │ │(x:0,w:300)  │ │(x:300, w:1620)       │ │  │    │   │
│   │  │ │ └──────────────┘ └──────────────────────┘ │  │    │   │
│   │  │ └────────────────────────────────────────────┘  │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### What Triggers Layout

```javascript
// Reading these properties triggers layout:
element.offsetWidth
element.offsetHeight
element.offsetTop
element.offsetLeft
element.clientWidth
element.clientHeight
element.scrollTop
element.scrollLeft
getComputedStyle(element)
element.getBoundingClientRect()

// Writing these properties triggers layout:
element.style.width = '100px';
element.style.height = '100px';
element.style.top = '10px';
element.style.left = '10px';
element.style.margin = '10px';
element.style.padding = '10px';
element.style.fontSize = '16px';

// Layout thrashing (bad pattern):
for (let i = 0; i < 100; i++) {
    element.style.width = element.offsetWidth + 10 + 'px';
    // Read → Write → Read → Write (forced synchronous layout)
}

// Batched reads and writes (good pattern):
const width = element.offsetWidth; // Read all first
for (let i = 0; i < 100; i++) {
    elements[i].style.width = width + 10 + 'px'; // Write all
}
```

---

## 🖌️ Paint

### Paint Records

```
┌─────────────────────────────────────────────────────────────────┐
│                          PAINT                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Layout gives positions → Paint creates draw commands           │
│                                                                   │
│   Paint Records (ordered list):                                  │
│   1. Draw background of <html>                                   │
│   2. Draw background of <body>                                   │
│   3. Draw text of <h1>                                           │
│   4. Draw border of <div>                                        │
│   5. Draw background of <button>                                 │
│   6. Draw text of <button>                                       │
│   ...                                                             │
│                                                                   │
│   Paint is expensive for:                                         │
│   • Complex shapes                                                │
│   • Shadows (box-shadow, text-shadow)                            │
│   • Filters (blur, etc.)                                         │
│   • Large areas                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### What Triggers Paint

```javascript
// Properties that trigger paint (but not layout):
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.borderColor = 'green';
element.style.boxShadow = '0 0 10px black';
element.style.visibility = 'hidden'; // Paint, no layout
element.style.outline = '1px solid red';
element.style.backgroundImage = 'url(...)';

// Properties that only trigger composite (best!):
element.style.transform = 'translateX(100px)';
element.style.opacity = '0.5';
```

---

## 🎭 Composite

### Layers & Compositing

```
┌─────────────────────────────────────────────────────────────────┐
│                       COMPOSITING                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Page is divided into layers                                    │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Layer 1: Main content                                    │   │
│   │ ┌─────────────────────────────────────────────────────┐ │   │
│   │ │                                                       │ │   │
│   │ │         Page content                                  │ │   │
│   │ │                                                       │ │   │
│   │ └─────────────────────────────────────────────────────┘ │   │
│   │ Layer 2: Fixed header                                    │   │
│   │ ┌─────────────────────────────────────────────────────┐ │   │
│   │ │ HEADER (position: fixed)                             │ │   │
│   │ └─────────────────────────────────────────────────────┘ │   │
│   │ Layer 3: Animated element                                │   │
│   │     ┌────────────┐                                       │   │
│   │     │ transform  │ (will-change: transform)              │   │
│   │     └────────────┘                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   Layers are composited (combined) by GPU                        │
│   Changing layer position/opacity = fast (no repaint)            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Creation Triggers

```css
/* Elements promoted to own layer: */

/* 3D transforms */
.layer { transform: translateZ(0); }
.layer { transform: translate3d(0, 0, 0); }

/* will-change hint */
.layer { will-change: transform; }
.layer { will-change: opacity; }

/* CSS animation/transition on transform/opacity */
.layer {
    animation: slide 1s;
}

/* Fixed/sticky positioning */
.layer { position: fixed; }
.layer { position: sticky; }

/* Canvas, video, WebGL */
<canvas>, <video>

/* Warning: Too many layers = memory overhead */
```

---

## ⚡ Performance Optimization

### The Pixel Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIXEL PIPELINE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   JS/CSS → Style → Layout → Paint → Composite                   │
│     │        │        │        │         │                       │
│     ▼        ▼        ▼        ▼         ▼                       │
│   Change   Recalc   Reflow   Repaint   Combine                   │
│   trigger  styles   geometry  pixels   layers                    │
│                                                                   │
│   Performance hierarchy:                                          │
│   ────────────────────                                           │
│   🟢 Best:  JS → Style → Composite                               │
│            (transform, opacity changes)                           │
│                                                                   │
│   🟡 OK:    JS → Style → Paint → Composite                       │
│            (color, background changes)                            │
│                                                                   │
│   🔴 Worst: JS → Style → Layout → Paint → Composite              │
│            (width, height, position changes)                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Optimization Techniques

```javascript
// 1. Avoid layout thrashing
// ❌ Bad
elements.forEach(el => {
    el.style.width = el.offsetWidth + 10 + 'px';
});

// ✅ Good
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
    el.style.width = widths[i] + 10 + 'px';
});

// 2. Use transform instead of top/left
// ❌ Bad
element.style.left = x + 'px';
element.style.top = y + 'px';

// ✅ Good
element.style.transform = `translate(${x}px, ${y}px)`;

// 3. Use opacity for visibility
// ❌ Bad (triggers paint)
element.style.visibility = 'hidden';

// ✅ Good (compositor only)
element.style.opacity = '0';

// 4. will-change for animations
.animated {
    will-change: transform;
}
// Remove after animation!
element.addEventListener('animationend', () => {
    element.style.willChange = 'auto';
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Critical rendering path là gì?**

A: Sequence browser follows to render page: HTML → DOM, CSS → CSSOM, combine → Render Tree, Layout → Paint → Composite.

**Q: Tại sao CSS là render-blocking?**

A: Browser cần CSSOM để build Render Tree. Không thể render cho đến khi có đầy đủ styles.

### 🟡 Mid-level

**Q: Layout thrashing là gì?**

A: Liên tục read → write → read → write DOM properties, forcing synchronous layout mỗi lần. Solution: Batch reads first, then writes.

**Q: Sự khác biệt giữa repaint và reflow?**

A:
- Reflow (Layout): Geometry changes - width, height, position. Most expensive.
- Repaint: Visual changes without geometry - color, background. Less expensive.

### 🔴 Senior

**Q: Optimize animation performance**

A:
1. Use transform/opacity only (compositor-only)
2. Promote to layer with will-change
3. Reduce layer count (memory)
4. Avoid layout during animation
5. Use CSS animations over JS when possible
6. RequestAnimationFrame for JS animations

---

## 📚 Active Recall

1. [ ] 5 stages of rendering pipeline
2. [ ] What triggers layout?
3. [ ] What triggers paint only?
4. [ ] What is compositor-only?
5. [ ] How to avoid layout thrashing?

---

> **Tiếp theo:** [03-javascript-engine.md](./03-javascript-engine.md) - JavaScript Engine
