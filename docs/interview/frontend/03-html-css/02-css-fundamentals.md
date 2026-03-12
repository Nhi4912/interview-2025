# CSS Fundamentals - Box Model & Specificity

> Box Model và Specificity là core concepts của CSS. Hiểu sâu để debug layout issues hiệu quả.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSS FUNDAMENTALS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. BOX MODEL         │ How elements take up space             │
│   2. SPECIFICITY       │ Which styles win                       │
│   3. CASCADE           │ How styles combine                     │
│   4. INHERITANCE       │ Which properties inherit               │
│   5. POSITIONING       │ How elements are placed                │
│   6. DISPLAY           │ Block, inline, flex, grid              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Box Model

### The Four Areas

```
┌─────────────────────────────────────────────────────────────────┐
│                         MARGIN                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                       BORDER                             │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │                    PADDING                       │   │   │
│   │   │   ┌─────────────────────────────────────────┐   │   │   │
│   │   │   │              CONTENT                     │   │   │   │
│   │   │   │                                          │   │   │   │
│   │   │   │     width × height                       │   │   │   │
│   │   │   │                                          │   │   │   │
│   │   │   └─────────────────────────────────────────┘   │   │   │
│   │   │                                                  │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### box-sizing

```css
/* content-box (default) */
.box-content {
    box-sizing: content-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width: 200 + 20*2 + 5*2 = 250px */
}

/* border-box (recommended) */
.box-border {
    box-sizing: border-box;
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* Total width: 200px (content shrinks to fit) */
}

/* Universal reset */
*, *::before, *::after {
    box-sizing: border-box;
}
```

### Margin Collapsing

```css
/* Vertical margins collapse */
.box1 {
    margin-bottom: 30px;
}
.box2 {
    margin-top: 20px;
}
/* Result: 30px gap (larger wins), not 50px */

/* Margins DON'T collapse when: */
/* 1. Horizontal margins */
/* 2. Flexbox/Grid items */
/* 3. Elements with overflow: hidden/auto */
/* 4. Floated elements */
/* 5. Absolutely positioned elements */
```

---

## 🎯 Specificity

### Specificity Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPECIFICITY FORMULA                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   (Inline, IDs, Classes, Elements)                               │
│                                                                   │
│   Selector                          Specificity                  │
│   ─────────────────────────────────────────────────             │
│   p                                  (0, 0, 0, 1)                │
│   .class                             (0, 0, 1, 0)                │
│   #id                                (0, 1, 0, 0)                │
│   style=""                           (1, 0, 0, 0)                │
│                                                                   │
│   p.class                            (0, 0, 1, 1)                │
│   #id .class p                       (0, 1, 1, 1)                │
│   #id #id2 .class p                  (0, 2, 1, 1)                │
│                                                                   │
│   Comparison: Compare left to right                              │
│   (0,1,0,0) > (0,0,99,99) because ID > any classes              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Specificity Examples

```css
/* (0,0,0,1) - Element */
p { color: black; }

/* (0,0,1,0) - Class */
.text { color: blue; }

/* (0,0,1,1) - Class + Element */
p.text { color: green; }

/* (0,1,0,0) - ID */
#main { color: red; }

/* (0,1,1,1) - ID + Class + Element */
#main p.text { color: purple; }

/* Winner: purple (highest specificity) */
```

### Specificity Tips

```css
/* ❌ Avoid !important */
.button { color: red !important; } /* Hard to override */

/* ❌ Avoid inline styles */
<div style="color: red;"> /* Very high specificity */

/* ✅ Keep specificity low and flat */
.card { }
.card-title { }
.card-body { }

/* ✅ Use classes, not IDs for styling */
.header { } /* Better */
#header { } /* Harder to override */
```

---

## 🌊 Cascade

### Cascade Order (Low → High Priority)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CASCADE ORDER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. User agent styles (browser defaults)                        │
│                    ↓                                              │
│   2. User styles (user preferences)                              │
│                    ↓                                              │
│   3. Author styles (your CSS)                                    │
│      a. External stylesheets                                     │
│      b. <style> in <head>                                        │
│      c. Inline styles                                            │
│                    ↓                                              │
│   4. Author !important                                           │
│                    ↓                                              │
│   5. User !important                                             │
│                    ↓                                              │
│   6. User agent !important                                       │
│                                                                   │
│   Same origin: Later declarations win                            │
│   Same specificity: Later in file wins                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧬 Inheritance

### Inherited Properties

```css
/* These inherit by default: */
color
font-family
font-size
font-weight
line-height
text-align
visibility
cursor

/* These DON'T inherit: */
margin
padding
border
background
width
height
position
display
```

### Controlling Inheritance

```css
.parent {
    color: blue;
    border: 1px solid red;
}

.child {
    color: inherit;     /* Explicitly inherit */
    border: inherit;    /* Force border to inherit */
}

.reset {
    all: initial;       /* Reset all properties to initial */
    all: unset;         /* Reset to inherited or initial */
    all: revert;        /* Reset to user agent styles */
}
```

---

## 📍 Positioning

### Position Values

```css
/* Static (default) */
.static {
    position: static;
    /* Normal document flow */
    /* top/right/bottom/left have no effect */
}

/* Relative */
.relative {
    position: relative;
    top: 10px;
    left: 20px;
    /* Offset from normal position */
    /* Still takes up original space */
}

/* Absolute */
.absolute {
    position: absolute;
    top: 0;
    right: 0;
    /* Positioned relative to nearest positioned ancestor */
    /* Removed from document flow */
}

/* Fixed */
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    /* Positioned relative to viewport */
    /* Stays in place during scroll */
}

/* Sticky */
.sticky {
    position: sticky;
    top: 0;
    /* Relative until scroll threshold, then fixed */
    /* Requires top/bottom/left/right to work */
}
```

### Stacking Context (z-index)

```css
.container {
    position: relative;
    z-index: 1;
    /* Creates new stacking context */
}

.overlay {
    position: absolute;
    z-index: 100;
    /* Only compared within same stacking context */
}

/* New stacking context created by: */
/* - position: relative/absolute/fixed with z-index */
/* - opacity < 1 */
/* - transform, filter, perspective */
/* - isolation: isolate */
```

---

## 🎭 Display

### Display Values

```css
/* Block */
display: block;
/* Full width, new line, respects width/height */

/* Inline */
display: inline;
/* Only as wide as content, no new line */
/* Ignores width/height, vertical margin/padding */

/* Inline-block */
display: inline-block;
/* Inline flow, but respects width/height */

/* None */
display: none;
/* Removed from layout completely */

/* Flex */
display: flex;
/* Flexbox container */

/* Grid */
display: grid;
/* Grid container */
```

### Block vs Inline Elements

```
Block elements:           Inline elements:
<div>                     <span>
<p>                       <a>
<h1>-<h6>                 <strong>
<ul>, <ol>, <li>          <em>
<section>                 <img>
<article>                 <input>
<header>                  <button>
<footer>                  <label>
```

---

## 📏 Units

### Absolute vs Relative

```css
/* Absolute units */
px      /* Pixels */
pt      /* Points (print) */
cm, mm  /* Centimeters, millimeters */

/* Relative units */
em      /* Relative to parent font-size */
rem     /* Relative to root font-size */
%       /* Percentage of parent */
vw, vh  /* Viewport width/height */
vmin, vmax  /* Smaller/larger of vw/vh */

/* Modern units */
ch      /* Width of "0" character */
ex      /* Height of "x" character */
```

### When to Use What

```css
/* Font sizes: rem (consistent scaling) */
html { font-size: 16px; }
h1 { font-size: 2rem; }    /* 32px */
p { font-size: 1rem; }     /* 16px */

/* Spacing: rem or em */
.card { padding: 1rem; }
.button { padding: 0.5em 1em; }

/* Widths: %, vw, or max-width with px */
.container { max-width: 1200px; width: 90%; }
.hero { height: 100vh; }

/* Borders, shadows: px */
.card { border: 1px solid #ccc; }
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Box model là gì?**

A: Box model gồm 4 areas: content, padding, border, margin. `box-sizing: border-box` tính width/height bao gồm padding và border.

**Q: block vs inline?**

A:
- Block: Full width, new line, respects dimensions
- Inline: Content width, no new line, ignores vertical dimensions

### 🟡 Mid-level

**Q: Specificity hoạt động như thế nào?**

A: (Inline, IDs, Classes, Elements). Compare left-to-right. Higher number wins. Same specificity → later declaration wins.

**Q: Margin collapsing là gì?**

A: Vertical margins of adjacent elements collapse to larger value. Doesn't happen in flex/grid, or with padding/border between.

### 🔴 Senior

**Q: Stacking context là gì?**

A: Isolated layer for z-index comparison. Created by: positioned elements with z-index, opacity < 1, transforms, filters. Children can't escape parent's stacking context.

---

## 📚 Active Recall

1. [ ] Draw box model diagram
2. [ ] Calculate specificity of complex selector
3. [ ] List 5 properties that inherit
4. [ ] Explain position values
5. [ ] When margins collapse?

---

> **Tiếp theo:** [03-flexbox-grid.md](./03-flexbox-grid.md) - Flexbox & Grid Layouts
