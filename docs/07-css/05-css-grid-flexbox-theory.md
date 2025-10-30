# CSS Grid & Flexbox Theory
## Mastering Modern CSS Layout Systems

**English:** CSS Grid and Flexbox are powerful layout systems that provide flexible, responsive ways to arrange elements on web pages, revolutionizing how we build layouts compared to traditional methods.

**Tiếng Việt:** CSS Grid và Flexbox là các hệ thống bố cục mạnh mẽ cung cấp cách linh hoạt và responsive để sắp xếp các phần tử trên trang web, cách mạng hóa cách chúng ta xây dựng bố cục so với các phương pháp truyền thống.

## Table of Contents
1. [Layout Fundamentals](#layout-fundamentals)
2. [Flexbox Deep Dive](#flexbox-deep-dive)
3. [CSS Grid Deep Dive](#css-grid-deep-dive)
4. [Grid vs Flexbox](#grid-vs-flexbox)
5. [Responsive Layouts](#responsive-layouts)
6. [Common Patterns](#common-patterns)
7. [Performance](#performance)
8. [Browser Support](#browser-support)
9. [Best Practices](#best-practices)
10. [Advanced Techniques](#advanced-techniques)

## Layout Fundamentals

### Traditional Layout Methods

**Float-Based Layout:**
```css
/* Old way - problematic */
.container {
  width: 100%;
}

.column {
  float: left;
  width: 33.33%;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

**Problems:**
```
❌ Requires clearfix hacks
❌ Hard to vertically center
❌ Difficult equal heights
❌ Source order dependency
❌ Complex calculations
```

**Modern Layout:**
```css
/* Flexbox */
.container {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
}

/* Grid */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

**Benefits:**
```
✅ No hacks needed
✅ Easy alignment
✅ Automatic equal heights
✅ Flexible ordering
✅ Intuitive syntax
```

## Flexbox Deep Dive

### Flex Container Properties

**display: flex**
```css
.container {
  display: flex; /* or inline-flex */
}
```

**flex-direction:**
```css
.container {
  /* Main axis direction */
  flex-direction: row; /* default, left to right */
  flex-direction: row-reverse; /* right to left */
  flex-direction: column; /* top to bottom */
  flex-direction: column-reverse; /* bottom to top */
}
```

**Visual:**
```
row:
[1] [2] [3] →

row-reverse:
← [3] [2] [1]

column:
[1]
[2]
[3]
↓

column-reverse:
↑
[3]
[2]
[1]
```

**flex-wrap:**
```css
.container {
  flex-wrap: nowrap; /* default, single line */
  flex-wrap: wrap; /* multi-line, top to bottom */
  flex-wrap: wrap-reverse; /* multi-line, bottom to top */
}
```

**flex-flow (shorthand):**
```css
.container {
  /* flex-direction flex-wrap */
  flex-flow: row wrap;
  flex-flow: column nowrap;
}
```

**justify-content (main axis):**
```css
.container {
  justify-content: flex-start; /* default, start of container */
  justify-content: flex-end; /* end of container */
  justify-content: center; /* center of container */
  justify-content: space-between; /* equal space between items */
  justify-content: space-around; /* equal space around items */
  justify-content: space-evenly; /* equal space between and around */
}
```

**Visual:**
```
flex-start:
[1][2][3]         

flex-end:
         [1][2][3]

center:
    [1][2][3]     

space-between:
[1]    [2]    [3]

space-around:
  [1]  [2]  [3]  

space-evenly:
 [1]  [2]  [3]
```

**align-items (cross axis):**
```css
.container {
  align-items: stretch; /* default, fill container */
  align-items: flex-start; /* start of cross axis */
  align-items: flex-end; /* end of cross axis */
  align-items: center; /* center of cross axis */
  align-items: baseline; /* align baselines */
}
```

**align-content (multi-line):**
```css
.container {
  flex-wrap: wrap;
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: stretch; /* default */
}
```

**gap:**
```css
.container {
  gap: 20px; /* row-gap and column-gap */
  row-gap: 20px;
  column-gap: 30px;
}
```

### Flex Item Properties

**order:**
```css
.item {
  order: 0; /* default */
  order: 1; /* move to end */
  order: -1; /* move to start */
}
```

**Example:**
```html
<div class="container">
  <div class="item" style="order: 2">1</div>
  <div class="item" style="order: 1">2</div>
  <div class="item" style="order: 3">3</div>
</div>
<!-- Visual order: 2, 1, 3 -->
```

**flex-grow:**
```css
.item {
  flex-grow: 0; /* default, don't grow */
  flex-grow: 1; /* grow to fill space */
  flex-grow: 2; /* grow twice as much */
}
```

**Example:**
```css
.container {
  display: flex;
  width: 600px;
}

.item-1 {
  flex-grow: 1; /* gets 200px */
}

.item-2 {
  flex-grow: 2; /* gets 400px */
}

/* Total grow: 3, Available space: 600px */
/* item-1: 600 * (1/3) = 200px */
/* item-2: 600 * (2/3) = 400px */
```

**flex-shrink:**
```css
.item {
  flex-shrink: 1; /* default, can shrink */
  flex-shrink: 0; /* don't shrink */
  flex-shrink: 2; /* shrink twice as much */
}
```

**flex-basis:**
```css
.item {
  flex-basis: auto; /* default, based on content */
  flex-basis: 200px; /* initial size */
  flex-basis: 50%; /* percentage of container */
  flex-basis: 0; /* ignore content size */
}
```

**flex (shorthand):**
```css
.item {
  /* flex-grow flex-shrink flex-basis */
  flex: 0 1 auto; /* default */
  flex: 1; /* flex: 1 1 0 */
  flex: 2; /* flex: 2 1 0 */
  flex: 200px; /* flex: 1 1 200px */
  flex: none; /* flex: 0 0 auto */
}
```

**Common Patterns:**
```css
/* Equal width columns */
.item {
  flex: 1;
}

/* Fixed width sidebar, flexible content */
.sidebar {
  flex: 0 0 250px;
}

.content {
  flex: 1;
}

/* Don't grow or shrink */
.item {
  flex: none;
}
```

**align-self:**
```css
.item {
  align-self: auto; /* default, inherit from container */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: baseline;
  align-self: stretch;
}
```

### Flexbox Examples

**Horizontal Centering:**
```css
.container {
  display: flex;
  justify-content: center;
}
```

**Vertical Centering:**
```css
.container {
  display: flex;
  align-items: center;
}
```

**Perfect Centering:**
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

**Navigation Bar:**
```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
```

**Card Layout:**
```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  flex: 1 1 300px; /* grow, shrink, min 300px */
  display: flex;
  flex-direction: column;
}

.card-content {
  flex: 1; /* fill available space */
}

.card-footer {
  margin-top: auto; /* push to bottom */
}
```

## CSS Grid Deep Dive

### Grid Container Properties

**display: grid**
```css
.container {
  display: grid; /* or inline-grid */
}
```

**grid-template-columns:**
```css
.container {
  /* Fixed widths */
  grid-template-columns: 200px 200px 200px;
  
  /* Flexible units (fr) */
  grid-template-columns: 1fr 2fr 1fr;
  
  /* repeat() */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  
  /* Mixed */
  grid-template-columns: 200px 1fr 2fr;
  
  /* Named lines */
  grid-template-columns: [start] 1fr [middle] 2fr [end];
}
```

**grid-template-rows:**
```css
.container {
  grid-template-rows: 100px 200px 100px;
  grid-template-rows: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto; /* header, content, footer */
}
```

**grid-template-areas:**
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.footer {
  grid-area: footer;
}
```

**gap:**
```css
.container {
  gap: 20px; /* row-gap and column-gap */
  row-gap: 20px;
  column-gap: 30px;
  
  /* Old syntax (still supported) */
  grid-gap: 20px;
  grid-row-gap: 20px;
  grid-column-gap: 30px;
}
```

**justify-items (horizontal alignment):**
```css
.container {
  justify-items: stretch; /* default, fill cell */
  justify-items: start; /* align to start */
  justify-items: end; /* align to end */
  justify-items: center; /* center in cell */
}
```

**align-items (vertical alignment):**
```css
.container {
  align-items: stretch; /* default */
  align-items: start;
  align-items: end;
  align-items: center;
}
```

**place-items (shorthand):**
```css
.container {
  /* align-items justify-items */
  place-items: center center;
  place-items: start end;
}
```

**justify-content (grid alignment):**
```css
.container {
  justify-content: start;
  justify-content: end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
}
```

**align-content:**
```css
.container {
  align-content: start;
  align-content: end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: space-evenly;
}
```

**grid-auto-columns / grid-auto-rows:**
```css
.container {
  grid-auto-columns: 100px;
  grid-auto-rows: 100px;
  grid-auto-rows: minmax(100px, auto);
}
```

**grid-auto-flow:**
```css
.container {
  grid-auto-flow: row; /* default, fill rows */
  grid-auto-flow: column; /* fill columns */
  grid-auto-flow: dense; /* fill gaps */
  grid-auto-flow: row dense;
}
```

### Grid Item Properties

**grid-column:**
```css
.item {
  /* Start / End */
  grid-column: 1 / 3; /* span columns 1-2 */
  grid-column: 1 / span 2; /* start at 1, span 2 */
  grid-column: 1 / -1; /* start to end */
  
  /* Longhand */
  grid-column-start: 1;
  grid-column-end: 3;
}
```

**grid-row:**
```css
.item {
  grid-row: 1 / 3;
  grid-row: 1 / span 2;
  grid-row: 1 / -1;
  
  /* Longhand */
  grid-row-start: 1;
  grid-row-end: 3;
}
```

**grid-area:**
```css
.item {
  /* Named area */
  grid-area: header;
  
  /* Shorthand: row-start / column-start / row-end / column-end */
  grid-area: 1 / 1 / 3 / 3;
}
```

**justify-self:**
```css
.item {
  justify-self: stretch; /* default */
  justify-self: start;
  justify-self: end;
  justify-self: center;
}
```

**align-self:**
```css
.item {
  align-self: stretch;
  align-self: start;
  align-self: end;
  align-self: center;
}
```

**place-self:**
```css
.item {
  /* align-self justify-self */
  place-self: center center;
  place-self: start end;
}
```

### Grid Functions

**repeat():**
```css
.container {
  /* repeat(count, size) */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(3, 100px);
  grid-template-columns: repeat(2, 1fr 2fr); /* 1fr 2fr 1fr 2fr */
}
```

**minmax():**
```css
.container {
  /* minmax(min, max) */
  grid-template-columns: minmax(200px, 1fr);
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  grid-template-rows: minmax(100px, auto);
}
```

**auto-fit vs auto-fill:**
```css
/* auto-fill: creates as many tracks as fit */
.container {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* auto-fit: collapses empty tracks */
.container {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

**Visual Difference:**
```
auto-fill (3 items, space for 5):
[1] [2] [3] [ ] [ ]

auto-fit (3 items, space for 5):
[  1  ] [  2  ] [  3  ]
```

**fit-content():**
```css
.container {
  grid-template-columns: fit-content(300px) 1fr;
}
```

### Grid Examples

**Basic Grid:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

**Responsive Grid:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

**Holy Grail Layout:**
```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.content { grid-area: content; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

**Masonry-like Layout:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 10px;
}

.item {
  grid-row-end: span var(--row-span);
}
```

**Overlapping Items:**
```css
.container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 100px);
}

.item-1 {
  grid-area: 1 / 1 / 3 / 3;
  z-index: 1;
}

.item-2 {
  grid-area: 2 / 2 / 4 / 4;
  z-index: 2;
}
```

## Grid vs Flexbox

### When to Use Flexbox

**One-Dimensional Layouts:**
```css
/* Navigation bar */
.nav {
  display: flex;
  justify-content: space-between;
}

/* Button group */
.buttons {
  display: flex;
  gap: 10px;
}

/* Vertical list */
.list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
```

**Content-Driven:**
```
Use when:
- Layout based on content size
- Items should wrap naturally
- One-dimensional alignment
- Dynamic number of items
```

### When to Use Grid

**Two-Dimensional Layouts:**
```css
/* Page layout */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}

/* Photo gallery */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Dashboard */
.dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
```

**Layout-Driven:**
```
Use when:
- Complex two-dimensional layouts
- Precise placement needed
- Overlapping elements
- Fixed grid structure
```

### Combining Both

**Grid for Layout, Flex for Components:**
```css
/* Grid for page structure */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
}

/* Flex for navigation */
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Flex for card content */
.card {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  flex: 1;
}
```

## Responsive Layouts

### Flexbox Responsive

**Wrapping:**
```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 1 300px; /* min-width 300px */
}
```

**Media Queries:**
```css
.container {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

### Grid Responsive

**Auto-Fit:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

**Media Queries:**
```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Responsive Areas:**
```css
.container {
  display: grid;
  grid-template-areas:
    "header"
    "nav"
    "content"
    "aside"
    "footer";
}

@media (min-width: 768px) {
  .container {
    grid-template-areas:
      "header header"
      "nav content"
      "aside aside"
      "footer footer";
    grid-template-columns: 200px 1fr;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-areas:
      "header header header"
      "nav content aside"
      "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
  }
}
```

## Common Patterns

### Sticky Footer

**Flexbox:**
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

**Grid:**
```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### Equal Height Columns

**Flexbox:**
```css
.container {
  display: flex;
}

.column {
  flex: 1;
}
```

**Grid:**
```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

### Centering

**Flexbox:**
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

**Grid:**
```css
.container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

### Sidebar Layout

**Flexbox:**
```css
.container {
  display: flex;
}

.sidebar {
  flex: 0 0 250px;
}

.content {
  flex: 1;
}
```

**Grid:**
```css
.container {
  display: grid;
  grid-template-columns: 250px 1fr;
}
```

## Performance

### Layout Thrashing

**Bad:**
```javascript
// Causes multiple reflows
elements.forEach(el => {
  el.style.width = el.offsetWidth + 10 + 'px';
});
```

**Good:**
```javascript
// Batch reads, then writes
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});
```

### Will-Change

```css
.animated-item {
  will-change: transform;
}

/* Remove after animation */
.animated-item.done {
  will-change: auto;
}
```

### Contain

```css
.card {
  contain: layout style paint;
}
```

## Best Practices

### Semantic HTML

```html
<!-- Good -->
<nav class="nav">
  <ul class="nav-list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Bad -->
<div class="nav">
  <div class="nav-list">
    <div><a href="/">Home</a></div>
  </div>
</div>
```

### Accessibility

```css
/* Maintain focus order */
.container {
  display: flex;
}

.item {
  order: 2; /* Visual order */
}

/* Ensure keyboard navigation follows visual order */
```

### Progressive Enhancement

```css
/* Fallback for older browsers */
.container {
  display: block;
}

.item {
  float: left;
  width: 33.33%;
}

/* Modern browsers */
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  
  .item {
    float: none;
    width: auto;
  }
}
```

## Interview Questions

**Q: When should you use Flexbox vs Grid?**

A: Use Flexbox for one-dimensional layouts (rows or columns), content-driven sizing, and when items should wrap naturally. Use Grid for two-dimensional layouts, precise placement, overlapping elements, and layout-driven designs. Often combine both: Grid for page structure, Flexbox for components.

**Q: Explain flex: 1 vs flex: 1 1 0 vs flex: 1 1 auto.**

A: `flex: 1` is shorthand for `flex: 1 1 0` (grow, shrink, 0 basis - ignores content size, equal distribution). `flex: 1 1 auto` uses content size as basis, then distributes remaining space. Use `flex: 1` for equal-width columns, `flex: 1 1 auto` when content size matters.

**Q: What's the difference between auto-fit and auto-fill in Grid?**

A: Both create responsive columns. `auto-fill` creates as many tracks as fit, keeping empty tracks. `auto-fit` collapses empty tracks, expanding items to fill space. Use `auto-fill` to maintain grid structure, `auto-fit` to expand items when fewer than max columns.

**Q: How do you create a responsive grid without media queries?**

A: Use `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))`. This creates columns that are minimum 250px, maximum 1fr, automatically wrapping to new rows when space is insufficient. Fully responsive without breakpoints.

**Q: Explain the difference between justify-content and align-items in Flexbox.**

A: `justify-content` aligns items along main axis (horizontal in row, vertical in column). `align-items` aligns along cross axis (vertical in row, horizontal in column). Main axis follows flex-direction, cross axis is perpendicular.

---

[← Back to Module Systems](./06-module-systems-theory.md) | [Next: DOM Theory →](./08-dom-manipulation-theory.md)
