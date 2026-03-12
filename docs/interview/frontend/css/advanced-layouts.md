---
layout: page
title: "Advanced CSS Layouts - Grid, Flexbox, and Modern Techniques"
description: "Master advanced CSS layout techniques including CSS Grid, Flexbox, Container Queries, and modern responsive design patterns"
category: "CSS"
tags: [css, layout, grid, flexbox, responsive, modern]
companies: [Google, Apple, Microsoft, Adobe, Figma]
---

# Advanced CSS Layouts - Grid, Flexbox, and Modern Techniques

## 🎯 CSS Grid Mastery

### **What is CSS Grid?**

**Definition:** CSS Grid Layout is a two-dimensional layout system that allows you to create complex layouts with rows and columns, providing precise control over element positioning.

**Why CSS Grid is Revolutionary:**

- **Two-Dimensional Control**: Unlike Flexbox (1D), Grid handles both rows and columns
- **Explicit Layout Definition**: Define exact grid structure with tracks and areas
- **Responsive by Design**: Built-in responsive capabilities with fr units and auto-fit
- **Alignment Control**: Powerful alignment options for both grid and grid items

**How CSS Grid Works:**

```mermaid
graph TB
    subgraph "CSS Grid Concepts"
        A[Grid Container] --> B[Grid Items]
        B --> C[Grid Lines]
        C --> D[Grid Tracks]
        D --> E[Grid Areas]

        F[Explicit Grid] --> G[Defined Rows/Columns]
        H[Implicit Grid] --> I[Auto-Generated Tracks]
    end

    subgraph "Grid Properties"
        J[Container Properties] --> K[grid-template-*]
        K --> L[grid-gap]
        L --> M[justify/align-*]

        N[Item Properties] --> O[grid-column/row]
        O --> P[grid-area]
        P --> Q[justify/align-self]
    end

    subgraph "Modern Features"
        R[Subgrid] --> S[Nested Grid Alignment]
        T[Container Queries] --> U[Responsive Components]
        V[CSS Functions] --> W[min(), max(), clamp()]
    end
```

**Deep Theory with Advanced Examples:**

```css
/* WHAT: Advanced Grid Layout System */
.advanced-grid-system {
  /* Modern grid with dynamic sizing */
  display: grid;
  grid-template-columns:
    [sidebar-start] minmax(250px, 1fr)
    [content-start] minmax(0, 4fr)
    [aside-start] minmax(200px, 1fr) [aside-end];

  grid-template-rows:
    [header-start] auto [header-end]
    [main-start] 1fr [main-end]
    [footer-start] auto [footer-end];

  /* Named grid areas for semantic layout */
  grid-template-areas:
    "sidebar header header"
    "sidebar content aside"
    "sidebar footer footer";

  /* Modern gap syntax */
  gap: clamp(1rem, 2vw, 2rem);

  /* Container size constraints */
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;

  /* Advanced alignment */
  align-content: start;
  justify-content: center;
}

/* WHY: Responsive grid items with intelligent sizing */
.grid-item {
  /* Smart positioning with fallbacks */
  grid-area: var(--grid-area, auto);

  /* Responsive padding using container queries */
  padding: clamp(1rem, 3cqi, 2rem);

  /* Modern alignment */
  display: grid;
  place-items: center;

  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Advanced responsive grid patterns */
.responsive-card-grid {
  display: grid;

  /* Auto-fit with intelligent sizing */
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));

  /* Dynamic gap based on available space */
  gap: clamp(1rem, 4vw, 3rem);

  /* Masonry-like behavior with subgrid */
  grid-auto-rows: masonry; /* Future feature */

  /* Fallback for current browsers */
  grid-auto-rows: auto;
}

/* HOW: Complex layout with nested grids */
.complex-layout {
  display: grid;
  grid-template-columns:
    [full-start] 1fr
    [content-start] min(65ch, 100%)
    [content-end] 1fr [full-end];

  /* All direct children span full width by default */
  > * {
    grid-column: content;
  }

  /* Full-width elements */
  .full-width {
    grid-column: full;
  }

  /* Breakout elements */
  .breakout {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: inherit;

    > * {
      grid-column: content;
    }
  }
}

/* Advanced grid with container queries */
.adaptive-grid {
  display: grid;
  container-type: inline-size;

  /* Base layout */
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Container query responsive behavior */
@container (min-width: 400px) {
  .adaptive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@container (min-width: 600px) {
  .adaptive-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

@container (min-width: 800px) {
  .adaptive-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2.5rem;
  }
}

/* Subgrid implementation (when supported) */
.subgrid-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.subgrid-item {
  display: grid;
  grid-column: span 2;

  /* Inherit parent grid columns */
  grid-template-columns: subgrid;
  gap: inherit;

  /* Align with parent grid */
  align-items: start;
}

/* Advanced grid animations */
.animated-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  /* Smooth layout transitions */
  transition: grid-template-columns 0.3s ease;
}

.animated-grid-item {
  /* Smooth item transitions */
  transition: grid-column 0.3s ease, grid-row 0.3s ease, transform 0.3s ease;

  /* Hover effects */
  &:hover {
    transform: translateY(-4px);
    z-index: 1;
  }
}

/* Grid with dynamic content sizing */
.dynamic-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: min-content;
  gap: 2rem;

  /* Align items to start for varying content heights */
  align-items: start;
}

.dynamic-content-item {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 300px;

  /* Internal grid for consistent alignment */
  .header {
    grid-row: 1;
  }
  .content {
    grid-row: 2;
  }
  .footer {
    grid-row: 3;
  }
}
```

## 🔄 Flexbox Advanced Patterns

### **What is Advanced Flexbox?**

**Definition:** Beyond basic flex layouts, advanced Flexbox involves complex alignment, dynamic sizing, and sophisticated responsive patterns for one-dimensional layouts.

**Why Advanced Flexbox Matters:**

- **Perfect Alignment**: Precise control over item alignment and distribution
- **Dynamic Sizing**: Intelligent space distribution with flex-grow, flex-shrink, flex-basis
- **Responsive Behavior**: Natural responsive behavior without media queries
- **Component Layouts**: Perfect for component-level layouts and UI patterns

**How Advanced Flexbox Works:**

```mermaid
graph TB
    subgraph "Flexbox Advanced Concepts"
        A[Flex Container] --> B[Main Axis]
        A --> C[Cross Axis]
        B --> D[justify-content]
        C --> E[align-items]

        F[Flex Items] --> G[flex-grow]
        F --> H[flex-shrink]
        F --> I[flex-basis]

        J[Advanced Properties] --> K[align-self]
        J --> L[order]
        J --> M[flex shorthand]
    end

    subgraph "Layout Patterns"
        N[Holy Grail] --> O[Header/Footer/Sidebar]
        P[Card Layouts] --> Q[Equal Height Cards]
        R[Navigation] --> S[Responsive Menus]
        T[Forms] --> U[Flexible Form Layouts]
    end

    subgraph "Modern Features"
        V[Gap Property] --> W[Consistent Spacing]
        X[Container Queries] --> Y[Component Responsive]
        Z[Logical Properties] --> AA[Writing Mode Support]
    end
```

**Deep Theory with Advanced Examples:**

```css
/* WHAT: Advanced Flexbox Patterns */
.advanced-flex-container {
  display: flex;

  /* Modern gap instead of margins */
  gap: clamp(1rem, 3vw, 2rem);

  /* Flexible direction with logical properties */
  flex-direction: var(--flex-direction, row);
  flex-wrap: var(--flex-wrap, wrap);

  /* Advanced alignment */
  justify-content: var(--justify-content, space-between);
  align-items: var(--align-items, stretch);
  align-content: var(--align-content, stretch);

  /* Container constraints */
  min-height: var(--min-height, auto);
  max-width: var(--max-width, none);
}

/* WHY: Intelligent flex item sizing */
.flex-item {
  /* Smart flex basis with content-based sizing */
  flex: var(--flex-grow, 1) var(--flex-shrink, 1) var(--flex-basis, auto);

  /* Minimum and maximum constraints */
  min-width: var(--min-width, 0);
  max-width: var(--max-width, none);

  /* Self-alignment override */
  align-self: var(--align-self, auto);

  /* Order for responsive reordering */
  order: var(--order, 0);

  /* Prevent flex items from shrinking below content */
  min-width: 0; /* Important for text overflow */
}

/* Advanced card layout with equal heights */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;

  /* Ensure cards stretch to equal height */
  align-items: stretch;
}

.card {
  /* Flexible width with minimum size */
  flex: 1 1 min(300px, 100%);

  /* Internal flex layout for card structure */
  display: flex;
  flex-direction: column;

  /* Card styling */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  /* Smooth transitions */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.card-header {
  /* Fixed header size */
  flex: 0 0 auto;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-content {
  /* Flexible content area */
  flex: 1 1 auto;
  padding: 1.5rem;

  /* Handle overflow gracefully */
  overflow: hidden;
}

.card-footer {
  /* Fixed footer size */
  flex: 0 0 auto;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

/* HOW: Responsive navigation with flexbox */
.responsive-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Responsive behavior */
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-brand {
  /* Brand never shrinks */
  flex: 0 0 auto;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-menu {
  /* Menu grows to fill space */
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  gap: 2rem;

  /* Responsive collapse */
  @media (max-width: 768px) {
    flex-basis: 100%;
    justify-content: flex-start;
    flex-direction: column;
    gap: 1rem;
  }
}

.nav-actions {
  /* Actions stay on the right */
  flex: 0 0 auto;
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Advanced form layout with flexbox */
.advanced-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  /* Responsive stacking */
  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.form-group {
  /* Flexible form groups */
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  /* Specific sizing for different input types */
  &.form-group--small {
    flex: 0 0 120px;
  }

  &.form-group--medium {
    flex: 0 0 200px;
  }

  &.form-group--large {
    flex: 2 1 auto;
  }
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 1rem;

  /* Smooth focus transition */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
}

/* Complex layout: Holy Grail with flexbox */
.holy-grail-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail-header {
  flex: 0 0 auto;
  background: #333;
  color: white;
  padding: 1rem 2rem;
}

.holy-grail-main {
  flex: 1 1 auto;
  display: flex;

  /* Responsive stacking */
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.holy-grail-sidebar {
  flex: 0 0 250px;
  background: #f8f9fa;
  padding: 2rem 1rem;

  /* Order for mobile */
  @media (max-width: 768px) {
    order: 2;
    flex: 0 0 auto;
  }
}

.holy-grail-content {
  flex: 1 1 auto;
  padding: 2rem;

  /* Prevent content overflow */
  min-width: 0;

  @media (max-width: 768px) {
    order: 1;
  }
}

.holy-grail-aside {
  flex: 0 0 200px;
  background: #e9ecef;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    order: 3;
    flex: 0 0 auto;
  }
}

.holy-grail-footer {
  flex: 0 0 auto;
  background: #333;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}

/* Advanced flexbox utilities */
.flex-utilities {
  /* Direction utilities */
  &.flex-row {
    flex-direction: row;
  }
  &.flex-row-reverse {
    flex-direction: row-reverse;
  }
  &.flex-col {
    flex-direction: column;
  }
  &.flex-col-reverse {
    flex-direction: column-reverse;
  }

  /* Wrap utilities */
  &.flex-wrap {
    flex-wrap: wrap;
  }
  &.flex-nowrap {
    flex-wrap: nowrap;
  }
  &.flex-wrap-reverse {
    flex-wrap: wrap-reverse;
  }

  /* Justify content utilities */
  &.justify-start {
    justify-content: flex-start;
  }
  &.justify-end {
    justify-content: flex-end;
  }
  &.justify-center {
    justify-content: center;
  }
  &.justify-between {
    justify-content: space-between;
  }
  &.justify-around {
    justify-content: space-around;
  }
  &.justify-evenly {
    justify-content: space-evenly;
  }

  /* Align items utilities */
  &.items-start {
    align-items: flex-start;
  }
  &.items-end {
    align-items: flex-end;
  }
  &.items-center {
    align-items: center;
  }
  &.items-baseline {
    align-items: baseline;
  }
  &.items-stretch {
    align-items: stretch;
  }

  /* Flex item utilities */
  &.flex-1 {
    flex: 1 1 0%;
  }
  &.flex-auto {
    flex: 1 1 auto;
  }
  &.flex-initial {
    flex: 0 1 auto;
  }
  &.flex-none {
    flex: none;
  }

  /* Grow and shrink utilities */
  &.grow {
    flex-grow: 1;
  }
  &.grow-0 {
    flex-grow: 0;
  }
  &.shrink {
    flex-shrink: 1;
  }
  &.shrink-0 {
    flex-shrink: 0;
  }
}
```

## 🏗️ Container Queries Revolution

### **What are Container Queries?**

**Definition:** Container queries allow you to apply styles based on the size of a containing element rather than the viewport, enabling true component-based responsive design.

**Why Container Queries are Game-Changing:**

- **Component-Level Responsiveness**: Components adapt to their container, not the viewport
- **Reusable Components**: Same component works in different contexts
- **Intrinsic Design**: Components are self-aware of their space
- **Better Encapsulation**: Responsive behavior is contained within components

**How Container Queries Work:**

```mermaid
graph TB
    subgraph "Container Query Concepts"
        A[Container Element] --> B[container-type]
        B --> C[inline-size]
        B --> D[block-size]
        B --> E[size]

        F[Query Conditions] --> G[min-width]
        F --> H[max-width]
        F --> I[aspect-ratio]
        F --> J[orientation]
    end

    subgraph "Query Types"
        K[Size Queries] --> L[Width/Height Based]
        M[Style Queries] --> N[CSS Property Based]
        O[State Queries] --> P[Element State Based]
    end

    subgraph "Use Cases"
        Q[Card Components] --> R[Adaptive Layouts]
        S[Sidebar Widgets] --> T[Context-Aware Design]
        U[Media Objects] --> V[Flexible Presentations]
    end
```

**Deep Theory with Advanced Examples:**

```css
/* WHAT: Container query setup and basic usage */
.container-query-demo {
  /* Enable container queries */
  container-type: inline-size;
  container-name: demo-container;

  /* Base styles */
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
}

/* Container query syntax */
@container demo-container (min-width: 400px) {
  .container-query-demo {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@container demo-container (min-width: 600px) {
  .container-query-demo {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* WHY: Adaptive card component */
.adaptive-card {
  container-type: inline-size;
  container-name: card;

  /* Base mobile-first design */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  /* Default vertical layout */
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.card-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Container queries for card adaptation */
@container card (min-width: 400px) {
  .adaptive-card {
    /* Switch to horizontal layout */
    flex-direction: row;
    align-items: stretch;
  }

  .card-image {
    width: 150px;
    height: auto;
    flex-shrink: 0;
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}

@container card (min-width: 600px) {
  .adaptive-card {
    /* Enhanced large layout */
    padding: 0.5rem;
  }

  .card-image {
    width: 200px;
    border-radius: 4px;
  }

  .card-body {
    padding: 2rem;
  }

  .card-title {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  .card-description {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .card-actions {
    gap: 1rem;
  }
}

/* HOW: Advanced container query patterns */
.responsive-sidebar {
  container-type: inline-size;
  container-name: sidebar;

  /* Base styles */
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.sidebar-widget {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.widget-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.widget-content {
  /* Base content styles */
  font-size: 0.875rem;
  color: #666;
}

/* Sidebar adaptations based on width */
@container sidebar (min-width: 200px) {
  .widget-title {
    font-size: 1.125rem;
  }

  .widget-content {
    font-size: 1rem;
  }
}

@container sidebar (min-width: 300px) {
  .responsive-sidebar {
    padding: 1.5rem;
  }

  .sidebar-widget {
    padding: 1rem;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .widget-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
}

/* Complex layout with multiple container queries */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;

  /* Enable container queries for the entire dashboard */
  container-type: inline-size;
  container-name: dashboard;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.dashboard-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.dashboard-sidebar {
  container-type: inline-size;
  container-name: dashboard-sidebar;
}

.dashboard-content {
  container-type: inline-size;
  container-name: dashboard-content;
}

/* Dashboard responsive behavior */
@container dashboard (min-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .dashboard-header {
    grid-column: 1 / -1;
    text-align: left;
    padding: 2rem 3rem;
  }

  .dashboard-main {
    grid-column: 1 / -1;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }
}

@container dashboard (min-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: 300px 1fr 250px;
    gap: 3rem;
    padding: 3rem;
  }

  .dashboard-main {
    grid-template-columns: 300px 1fr 250px;
    gap: 3rem;
  }
}

/* Content area adaptations */
@container dashboard-content (min-width: 400px) {
  .content-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@container dashboard-content (min-width: 600px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@container dashboard-content (min-width: 800px) {
  .content-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

/* Advanced container query with aspect ratio */
.media-container {
  container-type: size;
  container-name: media;

  /* Base styles */
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

/* Aspect ratio based queries */
@container media (aspect-ratio > 16/9) {
  .media-overlay {
    /* Wide aspect ratio - show overlay by default */
    transform: translateY(0);
  }
}

@container media (aspect-ratio < 4/3) {
  .media-overlay {
    /* Tall aspect ratio - different positioning */
    position: static;
    background: rgba(0, 0, 0, 0.8);
    transform: none;
  }
}

/* Container query with orientation */
@container media (orientation: landscape) {
  .media-content {
    object-position: center center;
  }

  .media-overlay {
    padding: 1rem 2rem;
  }
}

@container media (orientation: portrait) {
  .media-content {
    object-position: center top;
  }

  .media-overlay {
    padding: 2rem 1rem;
  }
}

/* Utility classes for container queries */
.container-inline {
  container-type: inline-size;
}

.container-block {
  container-type: block-size;
}

.container-size {
  container-type: size;
}

/* Named containers for specific targeting */
.container-card {
  container-type: inline-size;
  container-name: card;
}

.container-sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.container-main {
  container-type: inline-size;
  container-name: main;
}

/* Fallback support for browsers without container queries */
@supports not (container-type: inline-size) {
  /* Provide media query fallbacks */
  @media (min-width: 400px) {
    .adaptive-card {
      flex-direction: row;
    }

    .card-image {
      width: 150px;
      height: auto;
    }
  }

  @media (min-width: 768px) {
    .dashboard-main {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }
  }
}
```

## 🎨 Modern Layout Techniques

### **What are Modern Layout Techniques?**

**Definition:** Cutting-edge CSS layout methods that combine Grid, Flexbox, Container Queries, and new CSS features for sophisticated, responsive designs.

**Why Modern Techniques Matter:**

- **Intrinsic Design**: Layouts that adapt naturally to content and context
- **Component-First**: Reusable, self-contained layout components
- **Performance**: Efficient layouts with minimal JavaScript
- **Accessibility**: Better semantic structure and screen reader support

**How Modern Layouts Work:**

```mermaid
graph TB
    subgraph "Modern Layout Stack"
        A[CSS Grid] --> B[2D Layout System]
        C[Flexbox] --> D[1D Layout System]
        E[Container Queries] --> F[Component Responsive]
        G[CSS Functions] --> H[Dynamic Calculations]

        I[Logical Properties] --> J[Writing Mode Support]
        K[Custom Properties] --> L[Dynamic Theming]
        M[CSS Layers] --> N[Style Organization]
    end

    subgraph "Layout Patterns"
        O[Intrinsic Web Design] --> P[Content-Driven Layouts]
        Q[Component Systems] --> R[Reusable Patterns]
        S[Progressive Enhancement] --> T[Graceful Degradation]
    end

    subgraph "Future Features"
        U[Subgrid] --> V[Nested Grid Alignment]
        W[Masonry] --> X[Pinterest-style Layouts]
        Y[Anchor Positioning] --> Z[Tooltip Positioning]
    end
```

**Deep Theory with Advanced Examples:**

```css
/* WHAT: Intrinsic web design principles */
.intrinsic-layout {
  /* Use CSS Grid for overall structure */
  display: grid;

  /* Flexible grid with content-based sizing */
  grid-template-columns:
    minmax(1rem, 1fr)
    minmax(0, 65ch)
    minmax(1rem, 1fr);

  /* Dynamic row sizing */
  grid-auto-rows: min-content;

  /* Consistent spacing */
  gap: clamp(1rem, 4vw, 3rem);

  /* Full viewport height */
  min-height: 100vh;

  /* All children go to center column by default */
  > * {
    grid-column: 2;
  }

  /* Full-width elements */
  .full-width {
    grid-column: 1 / -1;
  }

  /* Breakout elements */
  .breakout {
    grid-column: 1 / -1;
    display: inherit;
    grid-template-columns: inherit;
    gap: inherit;

    > * {
      grid-column: 2;
    }
  }
}

/* WHY: Component-based layout system */
.layout-component {
  /* Enable container queries */
  container-type: inline-size;

  /* CSS custom properties for configuration */
  --gap: 1rem;
  --padding: 1rem;
  --border-radius: 8px;
  --background: white;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* Base component styles */
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: var(--padding);

  /* Flexible internal layout */
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

/* Component variations using CSS custom properties */
.layout-component--card {
  --padding: 1.5rem;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.layout-component--minimal {
  --background: transparent;
  --shadow: none;
  --border-radius: 0;
}

.layout-component--compact {
  --gap: 0.5rem;
  --padding: 0.75rem;
}

/* HOW: Advanced responsive patterns */
.responsive-masonry {
  /* CSS Grid masonry (future feature) */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: masonry; /* Future */
  gap: 2rem;

  /* Fallback for current browsers */
  @supports not (grid-template-rows: masonry) {
    /* Use flexbox with column layout */
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: stretch;
    max-height: 100vh; /* Adjust as needed */
  }
}

.masonry-item {
  /* Prevent breaking across columns */
  break-inside: avoid;
  page-break-inside: avoid;

  /* Base item styles */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;

  /* Smooth transitions */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

/* Advanced grid with dynamic areas */
.dynamic-grid {
  display: grid;

  /* Flexible grid template */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: 1rem;

  /* Dynamic grid areas using CSS custom properties */
  grid-template-areas: var(--grid-areas, none);
}

.grid-item {
  /* Dynamic positioning */
  grid-area: var(--grid-area, auto);
  grid-column: var(--grid-column, auto);
  grid-row: var(--grid-row, auto);

  /* Flexible internal layout */
  display: grid;
  place-items: center;

  /* Visual styling */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

/* Specific item configurations */
.grid-item--large {
  --grid-column: span 2;
  --grid-row: span 2;
}

.grid-item--wide {
  --grid-column: span 2;
}

.grid-item--tall {
  --grid-row: span 2;
}

/* Responsive typography with container queries */
.responsive-typography {
  container-type: inline-size;
  container-name: typography;

  /* Base typography */
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #333;
}

.responsive-heading {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;

  /* Fluid typography */
  font-size: clamp(1.5rem, 4cqi, 3rem);
}

.responsive-text {
  font-size: clamp(1rem, 2.5cqi, 1.25rem);
  margin-bottom: 1.5rem;
}

/* Container-based typography scaling */
@container typography (min-width: 400px) {
  .responsive-heading {
    font-size: clamp(2rem, 5cqi, 4rem);
    margin-bottom: 1.5rem;
  }

  .responsive-text {
    font-size: clamp(1.125rem, 3cqi, 1.5rem);
    margin-bottom: 2rem;
  }
}

@container typography (min-width: 600px) {
  .responsive-heading {
    font-size: clamp(2.5rem, 6cqi, 5rem);
    margin-bottom: 2rem;
  }

  .responsive-text {
    font-size: clamp(1.25rem, 3.5cqi, 1.75rem);
    margin-bottom: 2.5rem;
  }
}

/* Advanced form layouts */
.modern-form {
  container-type: inline-size;
  container-name: form;

  /* Base form styles */
  display: grid;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.form-section {
  display: grid;
  gap: 1rem;
}

.form-row {
  display: grid;
  gap: 1rem;

  /* Default single column */
  grid-template-columns: 1fr;
}

/* Form responsive behavior */
@container form (min-width: 400px) {
  .form-row {
    /* Two columns for medium forms */
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row--single {
    grid-template-columns: 1fr;
  }

  .form-row--thirds {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container form (min-width: 600px) {
  .modern-form {
    padding: 3rem;
    gap: 2rem;
  }

  .form-section {
    gap: 1.5rem;
  }

  .form-row {
    gap: 1.5rem;
  }
}

/* Input styling with modern features */
.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;

  /* Modern focus styles */
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &:invalid {
    border-color: #dc3545;
  }

  &:valid {
    border-color: #28a745;
  }
}

/* Utility classes for modern layouts */
.layout-utilities {
  /* Container query utilities */
  &.container-inline {
    container-type: inline-size;
  }
  &.container-block {
    container-type: block-size;
  }
  &.container-size {
    container-type: size;
  }

  /* Grid utilities */
  &.grid {
    display: grid;
  }
  &.grid-auto {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  &.grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  &.grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &.grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Flex utilities */
  &.flex {
    display: flex;
  }
  &.flex-col {
    flex-direction: column;
  }
  &.flex-wrap {
    flex-wrap: wrap;
  }

  /* Gap utilities */
  &.gap-1 {
    gap: 0.25rem;
  }
  &.gap-2 {
    gap: 0.5rem;
  }
  &.gap-4 {
    gap: 1rem;
  }
  &.gap-8 {
    gap: 2rem;
  }

  /* Responsive gap with clamp */
  &.gap-responsive {
    gap: clamp(1rem, 4vw, 3rem);
  }
}

/* Future-proof layouts with CSS layers */
@layer base, components, utilities;

@layer base {
  /* Base layout styles */
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
  }
}

@layer components {
  /* Component-specific layout styles */
  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
  }
}

@layer utilities {
  /* Utility classes with highest specificity */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
```

This comprehensive guide covers advanced CSS layout techniques with deep theoretical understanding and practical implementations for modern web development.
