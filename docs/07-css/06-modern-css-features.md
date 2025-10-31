# Modern CSS Features
## CSS - Chapter 6

[← Previous: CSS Architecture](./05-css-architecture.md) | [Back to Table of Contents](../00-table-of-contents.md)

---

## Overview

Modern CSS has evolved significantly with powerful new features that enable better layouts, animations, and responsive designs. This chapter covers cutting-edge CSS features for 2025-2026.

---

## Table of Contents

1. [Container Queries](#container-queries)
2. [CSS Nesting](#css-nesting)
3. [CSS Layers](#css-layers)
4. [Subgrid](#subgrid)
5. [CSS Functions](#css-functions)
6. [:has() Selector](#has-selector)
7. [Scroll-Driven Animations](#scroll-driven-animations)
8. [View Transitions](#view-transitions)
9. [Color Functions](#color-functions)
10. [Interview Questions](#interview-questions)

---

## Container Queries

### Basic Container Queries

```css
/* Define container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Query the container */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

### Container Query Units

```css
.container {
  container-type: inline-size;
}

.child {
  /* Container query units */
  width: 50cqw; /* 50% of container width */
  height: 50cqh; /* 50% of container height */
  font-size: 5cqi; /* 5% of container inline size */
  padding: 2cqb; /* 2% of container block size */
  margin: 1cqmin; /* 1% of smaller container dimension */
  gap: 2cqmax; /* 2% of larger container dimension */
}
```

### Practical Example

```css
/* Responsive card without media queries */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.card {
  container-type: inline-size;
  container-name: card;
}

/* Small card */
.card-content {
  display: flex;
  flex-direction: column;
}

/* Medium card */
@container card (min-width: 400px) {
  .card-content {
    flex-direction: row;
    gap: 1rem;
  }
  
  .card-image {
    width: 40%;
  }
}

/* Large card */
@container card (min-width: 600px) {
  .card-title {
    font-size: 2rem;
  }
  
  .card-description {
    font-size: 1.125rem;
  }
}
```

---

## CSS Nesting

### Native Nesting

```css
/* Old way */
.card { }
.card .title { }
.card .title:hover { }
.card .description { }

/* New way - Native nesting */
.card {
  background: white;
  padding: 1rem;
  
  .title {
    font-size: 1.5rem;
    color: #333;
    
    &:hover {
      color: #007bff;
    }
  }
  
  .description {
    color: #666;
    margin-top: 0.5rem;
  }
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
}
```

### Nesting with Combinators

```css
.parent {
  color: black;
  
  /* Direct child */
  & > .child {
    color: blue;
  }
  
  /* Adjacent sibling */
  & + .sibling {
    margin-top: 1rem;
  }
  
  /* General sibling */
  & ~ .sibling {
    opacity: 0.8;
  }
}
```

### Nesting Media Queries

```css
.component {
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
  
  .title {
    font-size: 1.5rem;
    
    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }
}
```

---

## CSS Layers

### Defining Layers

```css
/* Define layer order */
@layer reset, base, components, utilities;

/* Reset layer */
@layer reset {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}

/* Base layer */
@layer base {
  body {
    font-family: system-ui;
    line-height: 1.5;
  }
  
  h1 {
    font-size: 2rem;
  }
}

/* Components layer */
@layer components {
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
  }
}

/* Utilities layer */
@layer utilities {
  .text-center {
    text-align: center;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
}
```

### Layer Benefits

```css
/* Layers provide predictable specificity */

/* Even though this comes later, it has lower priority */
@layer base {
  .button {
    background: blue; /* Won't override components layer */
  }
}

@layer components {
  .button {
    background: red; /* This wins */
  }
}

/* Unlayered styles have highest priority */
.button {
  background: green; /* This wins over all layers */
}
```

### Importing with Layers

```css
/* Import into specific layer */
@import url('reset.css') layer(reset);
@import url('components.css') layer(components);

/* Anonymous layer */
@layer {
  .special {
    color: purple;
  }
}
```

---

## Subgrid

### Basic Subgrid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-item {
  display: grid;
  /* Inherit parent's column tracks */
  grid-template-columns: subgrid;
  gap: 0.5rem;
}
```

### Practical Example

```css
/* Card grid with aligned content */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.card {
  display: grid;
  /* Align with parent grid rows */
  grid-template-rows: subgrid;
  grid-row: span 3;
}

.card-header {
  /* Aligns with first row */
}

.card-body {
  /* Aligns with second row */
}

.card-footer {
  /* Aligns with third row */
}
```

---

## CSS Functions

### clamp()

```css
/* Responsive font size */
.title {
  /* min, preferred, max */
  font-size: clamp(1.5rem, 5vw, 3rem);
}

/* Responsive spacing */
.container {
  padding: clamp(1rem, 5%, 3rem);
  width: clamp(300px, 90%, 1200px);
}
```

### min() and max()

```css
/* Width: smaller of 500px or 100% */
.element {
  width: min(500px, 100%);
}

/* Width: larger of 300px or 50% */
.element {
  width: max(300px, 50%);
}

/* Combine with calc */
.element {
  width: min(500px, calc(100% - 2rem));
}
```

### calc()

```css
/* Complex calculations */
.element {
  width: calc(100% - 2rem);
  height: calc(100vh - 60px);
  padding: calc(1rem + 2px);
  
  /* With CSS variables */
  margin: calc(var(--spacing) * 2);
  
  /* Nested calc */
  font-size: calc(1rem + calc(2vw - 1px));
}
```

### Custom Properties with calc()

```css
:root {
  --base-size: 16px;
  --scale: 1.5;
}

.heading {
  font-size: calc(var(--base-size) * var(--scale));
}

.subheading {
  font-size: calc(var(--base-size) * var(--scale) * 0.8);
}
```

---

## :has() Selector

### Parent Selector

```css
/* Style parent based on child */
.card:has(.featured) {
  border: 2px solid gold;
  background: #fffef0;
}

/* Style form based on invalid input */
form:has(input:invalid) {
  border-color: red;
}

/* Style container based on empty state */
.list:has(:empty) {
  display: none;
}
```

### Sibling Selector

```css
/* Style element if it has specific sibling */
.item:has(+ .item-active) {
  border-bottom: none;
}

/* Style based on following sibling */
h2:has(+ p) {
  margin-bottom: 0.5rem;
}
```

### Complex Queries

```css
/* Card with image */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Card without image */
.card:not(:has(img)) {
  padding: 2rem;
}

/* Form with checked checkbox */
form:has(input[type="checkbox"]:checked) {
  background: #e8f5e9;
}

/* List with more than 5 items */
ul:has(li:nth-child(6)) {
  columns: 2;
}
```

### Practical Examples

```css
/* Accordion */
.accordion-item:has(.accordion-content:target) {
  background: #f5f5f5;
}

/* Navigation with active link */
nav:has(a.active) {
  border-bottom: 2px solid blue;
}

/* Table row with selected checkbox */
tr:has(input:checked) {
  background: #e3f2fd;
}
```

---

## Scroll-Driven Animations

### Scroll Timeline

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fade-in linear;
  animation-timeline: scroll();
  animation-range: entry 0% cover 50%;
}
```

### View Timeline

```css
@keyframes scale-up {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

.card {
  animation: scale-up linear;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

### Scroll-Linked Animations

```css
/* Progress bar */
.progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: blue;
  
  animation: grow-progress linear;
  animation-timeline: scroll(root);
}

@keyframes grow-progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
```

---

## View Transitions

### Basic View Transition

```css
/* Enable view transitions */
@view-transition {
  navigation: auto;
}

/* Customize transition */
::view-transition-old(root) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(root) {
  animation: fade-in 0.3s ease-in;
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
```

### Named Transitions

```css
/* Name specific elements */
.hero {
  view-transition-name: hero;
}

.title {
  view-transition-name: title;
}

/* Customize named transitions */
::view-transition-old(hero) {
  animation: slide-out-left 0.3s ease-out;
}

::view-transition-new(hero) {
  animation: slide-in-right 0.3s ease-in;
}
```

### JavaScript API

```javascript
// Trigger view transition
document.startViewTransition(() => {
  // Update DOM
  document.body.classList.toggle('dark-mode');
});

// With async updates
document.startViewTransition(async () => {
  await updateContent();
});
```

---

## Color Functions

### color-mix()

```css
.element {
  /* Mix two colors */
  background: color-mix(in srgb, blue 50%, red);
  
  /* Create tints */
  background: color-mix(in srgb, blue 80%, white);
  
  /* Create shades */
  background: color-mix(in srgb, blue 80%, black);
}
```

### oklch() and oklab()

```css
.element {
  /* Better perceptual color space */
  color: oklch(60% 0.15 180);
  /* lightness, chroma, hue */
  
  background: oklab(60% -0.1 0.1);
  /* lightness, a, b */
}
```

### Relative Colors

```css
:root {
  --primary: #007bff;
}

.element {
  /* Lighten color */
  background: oklch(from var(--primary) calc(l + 0.2) c h);
  
  /* Adjust opacity */
  color: rgb(from var(--primary) r g b / 0.5);
  
  /* Rotate hue */
  border-color: hsl(from var(--primary) calc(h + 180) s l);
}
```

---

## Additional Modern Features

### Logical Properties

```css
/* Instead of left/right, use start/end */
.element {
  /* Old way */
  margin-left: 1rem;
  padding-right: 2rem;
  border-left: 1px solid black;
  
  /* New way (RTL-friendly) */
  margin-inline-start: 1rem;
  padding-inline-end: 2rem;
  border-inline-start: 1px solid black;
  
  /* Block direction */
  margin-block-start: 1rem; /* margin-top */
  margin-block-end: 1rem; /* margin-bottom */
  
  /* Shorthand */
  margin-inline: 1rem 2rem; /* start end */
  margin-block: 1rem 2rem; /* start end */
}
```

### aspect-ratio

```css
.video-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.square {
  aspect-ratio: 1;
  width: 200px;
}

.portrait {
  aspect-ratio: 3 / 4;
}
```

### gap for Flexbox

```css
.flex-container {
  display: flex;
  gap: 1rem; /* Works in flexbox now! */
  row-gap: 1rem;
  column-gap: 2rem;
}
```

### accent-color

```css
/* Style form controls */
input[type="checkbox"],
input[type="radio"],
input[type="range"] {
  accent-color: #007bff;
}
```

---

## Interview Questions

### Q1: What are container queries and why are they useful?

**Answer:**
Container queries allow styling based on a container's size rather than viewport size. Benefits:
- True component-based responsive design
- Components adapt to their container, not viewport
- Better for reusable components
- Works with any container size

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
  }
}
```

### Q2: How does the :has() selector work?

**Answer:**
`:has()` is a "parent selector" that styles an element based on its descendants or siblings:

```css
/* Style parent if it has specific child */
.card:has(.featured) {
  border: 2px solid gold;
}

/* Style based on form state */
form:has(input:invalid) {
  border-color: red;
}
```

### Q3: What's the difference between clamp(), min(), and max()?

**Answer:**
- **clamp(min, preferred, max)**: Value between min and max
- **min(val1, val2)**: Smaller of two values
- **max(val1, val2)**: Larger of two values

```css
/* Responsive font size */
font-size: clamp(1rem, 5vw, 3rem);

/* Responsive width */
width: min(500px, 100%);
```

### Q4: What are CSS layers and why use them?

**Answer:**
CSS layers provide explicit control over cascade order:
- Predictable specificity
- Better organization
- Easier to override
- Framework integration

```css
@layer reset, base, components, utilities;

@layer components {
  .button { background: blue; }
}
```

### Q5: How do view transitions work?

**Answer:**
View transitions provide smooth animations between page states:

```javascript
document.startViewTransition(() => {
  // Update DOM
  updateContent();
});
```

CSS can customize the transition:
```css
::view-transition-old(root) {
  animation: fade-out 0.3s;
}
```

---

## Browser Support Considerations

```css
/* Feature detection */
@supports (container-type: inline-size) {
  .card-container {
    container-type: inline-size;
  }
}

/* Fallback */
@supports not (container-type: inline-size) {
  @media (min-width: 400px) {
    .card {
      display: grid;
    }
  }
}

/* Progressive enhancement */
.element {
  /* Fallback */
  font-size: 1.5rem;
  
  /* Modern browsers */
  font-size: clamp(1rem, 5vw, 3rem);
}
```

---

## Key Takeaways

1. **Container Queries**: Component-based responsive design
2. **CSS Nesting**: Cleaner, more maintainable code
3. **CSS Layers**: Explicit cascade control
4. **Subgrid**: Better grid alignment
5. **:has()**: Parent and sibling selection
6. **Scroll Animations**: Scroll-linked effects
7. **View Transitions**: Smooth page transitions
8. **Modern Functions**: clamp(), color-mix(), etc.
9. **Logical Properties**: RTL-friendly layouts
10. **Progressive Enhancement**: Use with fallbacks

---

[← Previous: CSS Architecture](./05-css-architecture.md) | [Back to Table of Contents](../00-table-of-contents.md)
