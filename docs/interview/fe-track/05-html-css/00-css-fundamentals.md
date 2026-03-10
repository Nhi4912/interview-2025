# CSS Fundamentals
## CSS - Chapter 0

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Grid & Flexbox →](./01-grid-flexbox.md)

---

## Overview

CSS (Cascading Style Sheets) is the language used to style and layout web pages. This chapter covers fundamental CSS concepts essential for Big Tech interviews.

---

## Table of Contents

1. [CSS Basics](#css-basics)
2. [Selectors](#selectors)
3. [Specificity](#specificity)
4. [Box Model](#box-model)
5. [Display & Positioning](#display--positioning)
6. [Flexbox](#flexbox)
7. [Grid](#grid)
8. [Responsive Design](#responsive-design)
9. [CSS Variables](#css-variables)
10. [Animations & Transitions](#animations--transitions)
11. [Interview Questions](#interview-questions)

---

## CSS Basics

### Syntax

```css
/* Selector { property: value; } */
selector {
  property: value;
  another-property: another-value;
}

/* Example */
h1 {
  color: blue;
  font-size: 24px;
  margin-bottom: 16px;
}
```

### Ways to Add CSS

```html
<!-- 1. Inline CSS (highest specificity) -->
<h1 style="color: blue; font-size: 24px;">Title</h1>

<!-- 2. Internal CSS -->
<head>
  <style>
    h1 {
      color: blue;
      font-size: 24px;
    }
  </style>
</head>

<!-- 3. External CSS (recommended) -->
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

### CSS Comments

```css
/* Single line comment */

/*
  Multi-line
  comment
*/
```

---

## Selectors

### Basic Selectors

```css
/* Universal selector */
* {
  margin: 0;
  padding: 0;
}

/* Element selector */
p {
  color: black;
}

/* Class selector */
.button {
  background: blue;
}

/* ID selector */
#header {
  height: 60px;
}

/* Attribute selector */
input[type="text"] {
  border: 1px solid gray;
}

input[type="email"] {
  border: 1px solid blue;
}

/* Attribute contains */
a[href*="example"] {
  color: red;
}

/* Attribute starts with */
a[href^="https"] {
  color: green;
}

/* Attribute ends with */
a[href$=".pdf"] {
  color: orange;
}
```

### Combinators

```css
/* Descendant selector (space) */
div p {
  color: blue;
}

/* Child selector (>) */
div > p {
  color: red;
}

/* Adjacent sibling (+) */
h1 + p {
  margin-top: 0;
}

/* General sibling (~) */
h1 ~ p {
  color: gray;
}
```

### Pseudo-classes

```css
/* Link states */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }

/* Form states */
input:focus {
  border-color: blue;
  outline: 2px solid blue;
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input:checked {
  background: blue;
}

input:valid {
  border-color: green;
}

input:invalid {
  border-color: red;
}

/* Structural pseudo-classes */
li:first-child {
  font-weight: bold;
}

li:last-child {
  border-bottom: none;
}

li:nth-child(odd) {
  background: #f0f0f0;
}

li:nth-child(even) {
  background: white;
}

li:nth-child(3n) {
  /* Every 3rd element */
  color: blue;
}

/* Not selector */
li:not(:last-child) {
  margin-bottom: 8px;
}

/* Empty */
div:empty {
  display: none;
}
```

### Pseudo-elements

```css
/* Before and after */
.button::before {
  content: "→ ";
}

.button::after {
  content: " ←";
}

/* First letter */
p::first-letter {
  font-size: 2em;
  font-weight: bold;
}

/* First line */
p::first-line {
  font-weight: bold;
}

/* Selection */
::selection {
  background: yellow;
  color: black;
}

/* Placeholder */
input::placeholder {
  color: gray;
  opacity: 0.7;
}
```

---

## Specificity

### Specificity Hierarchy

```
Inline styles (1000)
  > IDs (100)
    > Classes, attributes, pseudo-classes (10)
      > Elements, pseudo-elements (1)
```

### Calculating Specificity

```css
/* Specificity: 0-0-0-1 (1) */
p {
  color: black;
}

/* Specificity: 0-0-1-0 (10) */
.text {
  color: blue;
}

/* Specificity: 0-1-0-0 (100) */
#header {
  color: red;
}

/* Specificity: 0-0-1-1 (11) */
p.text {
  color: green;
}

/* Specificity: 0-1-1-1 (111) */
#header p.text {
  color: purple;
}

/* Specificity: 1-0-0-0 (1000) */
<p style="color: orange;">Inline</p>

/* !important overrides everything (avoid if possible) */
p {
  color: yellow !important;
}
```

### Specificity Examples

```css
/* Which color wins? */

/* Specificity: 0-0-0-1 */
p { color: black; }

/* Specificity: 0-0-1-0 - WINS */
.text { color: blue; }

/* Specificity: 0-0-1-1 - WINS */
p.text { color: red; }

/* Specificity: 0-1-0-0 - WINS */
#content { color: green; }

/* Specificity: 0-1-1-1 - WINS */
#content p.text { color: purple; }
```

---

## Box Model

### Components

```
┌─────────────────────────────────┐
│         Margin (transparent)     │
│  ┌───────────────────────────┐  │
│  │    Border                 │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   Padding           │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   Content     │  │  │  │
│  │  │  │   (width x    │  │  │  │
│  │  │  │    height)    │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### Box Model Properties

```css
.box {
  /* Content */
  width: 200px;
  height: 100px;
  
  /* Padding (inside border) */
  padding: 20px;
  /* or */
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
  padding-left: 20px;
  /* or */
  padding: 10px 20px; /* vertical horizontal */
  padding: 10px 20px 15px; /* top horizontal bottom */
  padding: 10px 20px 15px 25px; /* top right bottom left */
  
  /* Border */
  border: 2px solid black;
  /* or */
  border-width: 2px;
  border-style: solid;
  border-color: black;
  
  /* Margin (outside border) */
  margin: 20px;
  /* Same syntax as padding */
  
  /* Total width = width + padding + border + margin */
  /* Total width = 200 + 40 + 4 + 40 = 284px */
}
```

### Box Sizing

```css
/* Default: content-box */
.box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* Total width = 200 + 40 + 4 = 244px */
}

/* Better: border-box */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  /* Total width = 200px (includes padding and border) */
}

/* Apply to all elements (recommended) */
* {
  box-sizing: border-box;
}

/* or */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

---

## Display & Positioning

### Display Property

```css
/* Block: Takes full width, starts on new line */
div, p, h1 {
  display: block;
}

/* Inline: Takes only necessary width, no line break */
span, a, strong {
  display: inline;
}

/* Inline-block: Inline but can have width/height */
.button {
  display: inline-block;
  width: 100px;
  height: 40px;
}

/* None: Removes from document flow */
.hidden {
  display: none;
}

/* Flex: Flexible box layout */
.container {
  display: flex;
}

/* Grid: Grid layout */
.container {
  display: grid;
}
```

### Position Property

```css
/* Static (default): Normal document flow */
.element {
  position: static;
}

/* Relative: Positioned relative to normal position */
.element {
  position: relative;
  top: 10px;
  left: 20px;
  /* Moves 10px down, 20px right from normal position */
}

/* Absolute: Positioned relative to nearest positioned ancestor */
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 0;
  right: 0;
  /* Positioned at top-right of parent */
}

/* Fixed: Positioned relative to viewport */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* Stays at top when scrolling */
}

/* Sticky: Switches between relative and fixed */
.nav {
  position: sticky;
  top: 0;
  /* Sticks to top when scrolling past it */
}
```

### Z-Index

```css
/* Controls stacking order (only works with positioned elements) */
.layer1 {
  position: relative;
  z-index: 1;
}

.layer2 {
  position: relative;
  z-index: 2; /* Appears above layer1 */
}

.layer3 {
  position: relative;
  z-index: 3; /* Appears above layer2 */
}

/* Negative z-index */
.background {
  position: relative;
  z-index: -1; /* Behind normal flow */
}
```

---

## Flexbox

### Flex Container

```css
.container {
  display: flex;
  
  /* Direction */
  flex-direction: row; /* default */
  flex-direction: row-reverse;
  flex-direction: column;
  flex-direction: column-reverse;
  
  /* Wrap */
  flex-wrap: nowrap; /* default */
  flex-wrap: wrap;
  flex-wrap: wrap-reverse;
  
  /* Shorthand */
  flex-flow: row wrap;
  
  /* Main axis alignment */
  justify-content: flex-start; /* default */
  justify-content: flex-end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
  
  /* Cross axis alignment */
  align-items: stretch; /* default */
  align-items: flex-start;
  align-items: flex-end;
  align-items: center;
  align-items: baseline;
  
  /* Multiple lines alignment */
  align-content: stretch; /* default */
  align-content: flex-start;
  align-content: flex-end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  
  /* Gap */
  gap: 16px;
  row-gap: 16px;
  column-gap: 16px;
}
```

### Flex Items

```css
.item {
  /* Order */
  order: 0; /* default */
  order: 1; /* Appears after order: 0 */
  order: -1; /* Appears before order: 0 */
  
  /* Grow */
  flex-grow: 0; /* default */
  flex-grow: 1; /* Takes available space */
  
  /* Shrink */
  flex-shrink: 1; /* default */
  flex-shrink: 0; /* Doesn't shrink */
  
  /* Base size */
  flex-basis: auto; /* default */
  flex-basis: 200px;
  flex-basis: 50%;
  
  /* Shorthand: grow shrink basis */
  flex: 0 1 auto; /* default */
  flex: 1; /* flex: 1 1 0 */
  flex: 1 200px; /* flex: 1 1 200px */
  
  /* Self alignment */
  align-self: auto; /* default */
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;
}
```

### Common Flexbox Patterns

```css
/* Center content */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Space between items */
.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Equal width columns */
.columns {
  display: flex;
}

.column {
  flex: 1;
}

/* Responsive layout */
.responsive {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.responsive-item {
  flex: 1 1 300px; /* Min width 300px */
}
```

---

## Grid

### Grid Container

```css
.container {
  display: grid;
  
  /* Define columns */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 1fr 1fr; /* Equal fractions */
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  /* Define rows */
  grid-template-rows: 100px 200px;
  grid-template-rows: repeat(3, 100px);
  
  /* Gap */
  gap: 16px;
  row-gap: 16px;
  column-gap: 16px;
  
  /* Alignment */
  justify-items: start;
  justify-items: end;
  justify-items: center;
  justify-items: stretch; /* default */
  
  align-items: start;
  align-items: end;
  align-items: center;
  align-items: stretch; /* default */
  
  /* Grid alignment */
  justify-content: start;
  justify-content: end;
  justify-content: center;
  justify-content: space-between;
  justify-content: space-around;
  justify-content: space-evenly;
  
  align-content: start;
  align-content: end;
  align-content: center;
  align-content: space-between;
  align-content: space-around;
  align-content: space-evenly;
}
```

### Grid Items

```css
.item {
  /* Column placement */
  grid-column-start: 1;
  grid-column-end: 3;
  /* Shorthand */
  grid-column: 1 / 3;
  grid-column: 1 / span 2;
  
  /* Row placement */
  grid-row-start: 1;
  grid-row-end: 3;
  /* Shorthand */
  grid-row: 1 / 3;
  grid-row: 1 / span 2;
  
  /* Area shorthand */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
  
  /* Self alignment */
  justify-self: start;
  justify-self: end;
  justify-self: center;
  justify-self: stretch;
  
  align-self: start;
  align-self: end;
  align-self: center;
  align-self: stretch;
}
```

### Grid Template Areas

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 60px 1fr 60px;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.main {
  grid-area: main;
}

.footer {
  grid-area: footer;
}
```

---

## Responsive Design

### Media Queries

```css
/* Mobile first approach */
.container {
  width: 100%;
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    width: 1200px;
  }
}

/* Orientation */
@media (orientation: portrait) {
  .container {
    flex-direction: column;
  }
}

@media (orientation: landscape) {
  .container {
    flex-direction: row;
  }
}

/* Print */
@media print {
  .no-print {
    display: none;
  }
}
```

### Responsive Units

```css
/* Relative to viewport */
.hero {
  width: 100vw; /* 100% of viewport width */
  height: 100vh; /* 100% of viewport height */
  font-size: 5vw; /* 5% of viewport width */
}

/* Relative to parent */
.child {
  width: 50%; /* 50% of parent width */
  padding: 5%; /* 5% of parent width */
}

/* Relative to font size */
.text {
  font-size: 16px;
  margin-bottom: 1em; /* 16px */
  padding: 0.5rem; /* 8px if root font-size is 16px */
}
```

---

## CSS Variables

### Defining Variables

```css
:root {
  /* Global variables */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.theme-dark {
  --primary-color: #0056b3;
  --background: #1a1a1a;
  --text-color: #ffffff;
}
```

### Using Variables

```css
.button {
  background: var(--primary-color);
  color: white;
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
}

/* Fallback value */
.element {
  color: var(--text-color, black);
}

/* Computed values */
.container {
  padding: calc(var(--spacing-unit) * 3);
  margin: calc(var(--spacing-unit) * 2);
}
```

### JavaScript Integration

```javascript
// Get variable
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
  .getPropertyValue('--primary-color');

// Set variable
root.style.setProperty('--primary-color', '#ff0000');

// Remove variable
root.style.removeProperty('--primary-color');
```

---

## Animations & Transitions

### Transitions

```css
.button {
  background: blue;
  color: white;
  padding: 10px 20px;
  
  /* Transition */
  transition: background 0.3s ease;
  /* or */
  transition-property: background;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  transition-delay: 0s;
}

.button:hover {
  background: darkblue;
}

/* Multiple properties */
.element {
  transition: background 0.3s ease,
              transform 0.3s ease,
              opacity 0.3s ease;
}

/* All properties */
.element {
  transition: all 0.3s ease;
}
```

### Animations

```css
/* Define keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* or */
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Apply animation */
.element {
  animation: fadeIn 1s ease;
  /* or */
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
}

/* Multiple animations */
.element {
  animation: fadeIn 1s ease, slideIn 0.5s ease;
}

/* Infinite animation */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## Interview Questions

### Q1: What is the CSS box model?

**Answer:**
The box model consists of:
1. **Content**: The actual content (width × height)
2. **Padding**: Space inside the border
3. **Border**: Border around padding
4. **Margin**: Space outside the border

Total width = width + padding + border + margin

Use `box-sizing: border-box` to include padding and border in width.

### Q2: What's the difference between display: none and visibility: hidden?

**Answer:**
- **display: none**: Removes element from document flow, no space taken
- **visibility: hidden**: Hides element but space is still taken

```css
.hidden-display {
  display: none; /* No space */
}

.hidden-visibility {
  visibility: hidden; /* Space remains */
}
```

### Q3: Explain CSS specificity.

**Answer:**
Specificity determines which CSS rule applies:
1. Inline styles (1000)
2. IDs (100)
3. Classes, attributes, pseudo-classes (10)
4. Elements, pseudo-elements (1)

`!important` overrides everything (avoid if possible).

### Q4: What's the difference between position: absolute and position: fixed?

**Answer:**
- **absolute**: Positioned relative to nearest positioned ancestor
- **fixed**: Positioned relative to viewport, stays in place when scrolling

### Q5: How do you center a div?

**Answer:**
```css
/* Flexbox (modern) */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grid */
.parent {
  display: grid;
  place-items: center;
}

/* Absolute positioning */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Margin auto (horizontal only) */
.child {
  width: 200px;
  margin: 0 auto;
}
```

---

## Key Takeaways

1. CSS uses selectors to target HTML elements
2. Specificity determines which styles apply
3. Box model includes content, padding, border, margin
4. Flexbox for one-dimensional layouts
5. Grid for two-dimensional layouts
6. Media queries for responsive design
7. CSS variables for maintainable code
8. Transitions and animations for interactivity

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Grid & Flexbox →](./01-grid-flexbox.md)
