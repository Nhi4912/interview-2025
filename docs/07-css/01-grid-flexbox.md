# CSS Grid & Flexbox
## Modern CSS - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Modern CSS Features →](./02-modern-css-features.md)

---

## Overview

CSS Grid and Flexbox are the two most powerful layout systems in modern CSS. Understanding when and how to use each is essential for frontend interviews at Big Tech companies.

---

## Table of Contents
1. [Flexbox Fundamentals](#flexbox-fundamentals)
2. [Flexbox Patterns](#flexbox-patterns)
3. [CSS Grid Fundamentals](#css-grid-fundamentals)
4. [Grid Patterns](#grid-patterns)
5. [Grid vs Flexbox](#grid-vs-flexbox)
6. [Responsive Layouts](#responsive-layouts)
7. [Real-World Examples](#real-world-examples)
8. [Interview Questions](#interview-questions)

---

## Flexbox Fundamentals

### Basic Concepts

```css
/* Flexbox is one-dimensional (row OR column) */
.container {
  display: flex; /* or inline-flex */
}

/* Main axis vs Cross axis
   flex-direction: row → Main: horizontal, Cross: vertical
   flex-direction: column → Main: vertical, Cross: horizontal
*/
```

### Container Properties

```css
.flex-container {
  display: flex;
  
  /* Direction */
  flex-direction: row | row-reverse | column | column-reverse;
  
  /* Wrapping */
  flex-wrap: nowrap | wrap | wrap-reverse;
  
  /* Shorthand for direction + wrap */
  flex-flow: row wrap;
  
  /* Main axis alignment */
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
  
  /* Cross axis alignment */
  align-items: stretch | flex-start | flex-end | center | baseline;
  
  /* Multi-line cross axis alignment */
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
  
  /* Gap between items */
  gap: 1rem; /* or row-gap and column-gap */
}
```

### Item Properties

```css
.flex-item {
  /* Growth factor */
  flex-grow: 0; /* default, don't grow */
  flex-grow: 1; /* grow to fill space */
  
  /* Shrink factor */
  flex-shrink: 1; /* default, can shrink */
  flex-shrink: 0; /* don't shrink */
  
  /* Base size */
  flex-basis: auto; /* default */
  flex-basis: 200px; /* specific size */
  flex-basis: 0; /* ignore content size */
  
  /* Shorthand: grow shrink basis */
  flex: 0 1 auto; /* default */
  flex: 1; /* same as 1 1 0 */
  flex: auto; /* same as 1 1 auto */
  flex: none; /* same as 0 0 auto */
  
  /* Override container's align-items */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
  
  /* Order */
  order: 0; /* default */
  order: -1; /* move to start */
  order: 1; /* move to end */
}
```

---

## Flexbox Patterns

### 1. Center Everything

```css
/* Perfect centering */
.center-container {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center; /* vertical */
  min-height: 100vh;
}
```

```html
<div class="center-container">
  <div class="content">Perfectly centered!</div>
</div>
```

### 2. Navigation Bar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #333;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-actions {
  display: flex;
  gap: 1rem;
}
```

```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
  <div class="nav-actions">
    <button>Login</button>
    <button>Sign Up</button>
  </div>
</nav>
```

### 3. Card Layout

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  flex: 1 1 300px; /* grow, shrink, min 300px */
  max-width: 400px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
```

### 4. Holy Grail Layout

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem;
  background: #333;
  color: white;
}

.main-content {
  display: flex;
  flex: 1; /* Take remaining space */
}

.sidebar {
  flex: 0 0 250px; /* Don't grow/shrink, 250px wide */
  background: #f5f5f5;
  padding: 1rem;
}

.content {
  flex: 1; /* Take remaining space */
  padding: 2rem;
}

.aside {
  flex: 0 0 200px;
  background: #f5f5f5;
  padding: 1rem;
}

.footer {
  padding: 1rem;
  background: #333;
  color: white;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar,
  .aside {
    flex: 0 0 auto;
    width: 100%;
  }
}
```

### 5. Equal Height Columns

```css
.columns {
  display: flex;
  gap: 2rem;
}

.column {
  flex: 1;
  padding: 1.5rem;
  background: #f5f5f5;
  /* All columns automatically same height! */
}
```

### 6. Sticky Footer

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* Push footer to bottom */
}

.footer {
  padding: 2rem;
  background: #333;
  color: white;
}
```

---

## CSS Grid Fundamentals

### Basic Concepts

```css
/* Grid is two-dimensional (rows AND columns) */
.container {
  display: grid; /* or inline-grid */
}
```

### Container Properties

```css
.grid-container {
  display: grid;
  
  /* Define columns */
  grid-template-columns: 200px 1fr 200px; /* 3 columns */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive */
  
  /* Define rows */
  grid-template-rows: 100px auto 100px;
  grid-template-rows: repeat(3, 1fr);
  
  /* Named grid areas */
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  
  /* Gap between cells */
  gap: 1rem; /* or row-gap and column-gap */
  column-gap: 2rem;
  row-gap: 1rem;
  
  /* Alignment */
  justify-items: start | end | center | stretch; /* horizontal */
  align-items: start | end | center | stretch; /* vertical */
  justify-content: start | end | center | stretch | space-between | space-around | space-evenly;
  align-content: start | end | center | stretch | space-between | space-around | space-evenly;
  
  /* Implicit grid (auto-generated rows/columns) */
  grid-auto-rows: 100px;
  grid-auto-columns: 1fr;
  grid-auto-flow: row | column | dense;
}
```

### Item Properties

```css
.grid-item {
  /* Column placement */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-column: 1 / 3; /* shorthand */
  grid-column: 1 / span 2; /* span 2 columns */
  
  /* Row placement */
  grid-row-start: 1;
  grid-row-end: 3;
  grid-row: 1 / 3; /* shorthand */
  grid-row: 1 / span 2; /* span 2 rows */
  
  /* Named area */
  grid-area: header;
  
  /* Alignment */
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

---

## Grid Patterns

### 1. Basic Grid Layout

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
```

```html
<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

### 2. Responsive Grid (Auto-fit)

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Items automatically wrap to new rows
   when container is too narrow */
```

### 3. Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "sidebar header header"
    "sidebar main aside"
    "sidebar footer footer";
  gap: 1rem;
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header { grid-area: header; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive */
@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "aside"
      "footer";
  }
  
  .sidebar {
    display: none;
  }
}
```

### 4. Magazine Layout

```css
.magazine {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 200px;
  gap: 1rem;
}

.featured {
  grid-column: span 4;
  grid-row: span 2;
}

.secondary {
  grid-column: span 2;
}

.tertiary {
  grid-column: span 2;
}
```

```html
<div class="magazine">
  <article class="featured">Featured Article</article>
  <article class="secondary">Article 2</article>
  <article class="secondary">Article 3</article>
  <article class="tertiary">Article 4</article>
  <article class="tertiary">Article 5</article>
  <article class="tertiary">Article 6</article>
</div>
```

### 5. Image Gallery

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Span random sizes */
.gallery-item:nth-child(3n) {
  grid-column: span 2;
  grid-row: span 2;
}
```

### 6. Form Layout

```css
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1; /* Span all columns */
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
```

```html
<form class="form-grid">
  <div class="form-field">
    <label>First Name</label>
    <input type="text" />
  </div>
  <div class="form-field">
    <label>Last Name</label>
    <input type="text" />
  </div>
  <div class="form-field full-width">
    <label>Email</label>
    <input type="email" />
  </div>
  <div class="form-field full-width">
    <label>Message</label>
    <textarea></textarea>
  </div>
  <button class="full-width">Submit</button>
</form>
```

---

## Grid vs Flexbox

### When to Use Flexbox

```css
/* ✅ Use Flexbox for: */

/* 1. One-dimensional layouts */
.navbar {
  display: flex;
  justify-content: space-between;
}

/* 2. Content-driven layouts */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 3. Centering */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4. Equal spacing */
.button-group {
  display: flex;
  gap: 1rem;
}

/* 5. Dynamic content */
.menu {
  display: flex;
  /* Items size based on content */
}
```

### When to Use Grid

```css
/* ✅ Use Grid for: */

/* 1. Two-dimensional layouts */
.page-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr 50px;
}

/* 2. Fixed layouts */
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* 3. Overlapping elements */
.card {
  display: grid;
  grid-template-areas: "content";
}

.card-image,
.card-overlay {
  grid-area: content;
}

/* 4. Responsive grids */
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* 5. Complex alignments */
.complex-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.item-a { grid-column: 1 / 5; }
.item-b { grid-column: 5 / 9; }
.item-c { grid-column: 9 / 13; }
```

### Combining Both

```css
/* Grid for overall layout, Flexbox for components */
.page {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

---

## Responsive Layouts

### Mobile-First Approach

```css
/* Base styles (mobile) */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2rem;
  }
  
  .item {
    flex: 1 1 calc(50% - 1rem);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .container {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

### Container Queries (Modern)

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* When container is > 400px */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

/* When container is > 600px */
@container card (min-width: 600px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

---

## Real-World Examples

### E-commerce Product Grid

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex: 1;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.product-actions button {
  flex: 1;
}
```

### Blog Layout

```css
.blog-layout {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.blog-header {
  grid-column: 1 / -1;
  padding: 2rem;
  background: #f9fafb;
}

.blog-content {
  grid-column: 2;
  padding: 3rem 2rem;
}

.blog-sidebar {
  grid-column: 3;
  padding: 3rem 2rem;
}

.blog-footer {
  grid-column: 1 / -1;
  padding: 2rem;
  background: #111827;
  color: white;
}

@media (max-width: 1024px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
  
  .blog-content,
  .blog-sidebar {
    grid-column: 1;
  }
}
```

---

## Interview Questions

### Q1: What's the difference between Flexbox and Grid?

**Answer:**
- **Flexbox**: One-dimensional (row OR column), content-driven, best for components
- **Grid**: Two-dimensional (rows AND columns), layout-driven, best for page layouts

### Q2: How do you center an element with Flexbox?

**Answer:**
```css
.container {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center; /* vertical */
}
```

### Q3: What does `flex: 1` mean?

**Answer:**
`flex: 1` is shorthand for `flex: 1 1 0`, meaning:
- `flex-grow: 1` (can grow)
- `flex-shrink: 1` (can shrink)
- `flex-basis: 0` (start from 0, ignore content size)

### Q4: How do you create a responsive grid without media queries?

**Answer:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

---

## Summary

- Flexbox for one-dimensional layouts (rows or columns)
- Grid for two-dimensional layouts (rows and columns)
- Use `auto-fit` and `minmax()` for responsive grids
- Combine both for complex layouts
- Mobile-first approach for responsive design
- Container queries for component-level responsiveness

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Modern CSS Features →](./02-modern-css-features.md)
