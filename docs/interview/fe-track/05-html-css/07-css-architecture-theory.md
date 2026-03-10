# CSS Architecture - Advanced Theory / Kiến Trúc CSS - Lý Thuyết Nâng Cao

## Table of Contents / Mục Lục

1. [CSS Architecture Principles](#css-architecture-principles)
2. [Cascade and Specificity](#cascade-and-specificity)
3. [CSS Methodologies](#css-methodologies)
4. [CSS-in-JS Theory](#css-in-js-theory)
5. [CSS Performance](#css-performance)
6. [Modern CSS Features](#modern-css-features)
7. [Interview Questions](#interview-questions)

---

## CSS Architecture Principles / Nguyên Tắc Kiến Trúc CSS

### Scalable CSS Design / Thiết Kế CSS Có Thể Mở Rộng

**English:** Well-architected CSS is predictable, reusable, maintainable, and scalable.

**Tiếng Việt:** CSS được kiến trúc tốt là có thể dự đoán, tái sử dụng, bảo trì và mở rộng.

#### Core Principles / Nguyên Tắc Cốt Lõi

**1. Predictability / Khả Năng Dự Đoán**

**Definition**: Rules behave as expected

**Characteristics:**
- Consistent naming
- Clear hierarchy
- Explicit dependencies
- No side effects
- Deterministic output

**Problems to Avoid:**
- Global scope pollution
- Unexpected cascading
- Specificity wars
- Order-dependent styles
- Magic numbers

**Solutions:**
- Scoped styles
- Component-based architecture
- Naming conventions
- Explicit specificity
- Documentation

**2. Reusability / Khả Năng Tái Sử Dụng**

**Definition**: Styles can be reused across components

**Characteristics:**
- Modular design
- Composition over inheritance
- Utility classes
- Mixins/functions
- Design tokens

**Benefits:**
- Less code duplication
- Consistent design
- Faster development
- Easier maintenance
- Smaller bundle size

**Techniques:**
- Utility-first CSS
- Component libraries
- Design systems
- CSS variables
- Preprocessor mixins

**3. Maintainability / Khả Năng Bảo Trì**

**Definition**: Easy to update and modify

**Characteristics:**
- Clear structure
- Self-documenting code
- Logical organization
- Minimal dependencies
- Version control friendly

**Best Practices:**
- Consistent formatting
- Meaningful names
- Comments for complex logic
- Modular architecture
- Regular refactoring

**4. Scalability / Khả Năng Mở Rộng**

**Definition**: Grows without performance degradation

**Characteristics:**
- Performance-conscious
- Efficient selectors
- Minimal specificity
- Lazy loading
- Critical CSS

**Considerations:**
- File size
- Selector performance
- Render performance
- Build time
- Developer experience

---

## Cascade and Specificity / Tầng và Độ Cụ Thể

### The Cascade / Tầng

**English:** The cascade is the algorithm that determines which CSS rules apply when multiple rules target the same element.

**Tiếng Việt:** Tầng là thuật toán xác định quy tắc CSS nào áp dụng khi nhiều quy tắc nhắm đến cùng một element.

#### Cascade Layers / Các Tầng Cascade

**Order of Precedence (Lowest to Highest):**

**1. User Agent Styles**
- Browser default styles
- Lowest priority
- Can be overridden
- Varies by browser

**2. User Styles**
- User-defined styles
- Accessibility preferences
- Browser extensions
- Higher than user agent

**3. Author Styles**
- Developer-written styles
- Normal declarations
- Most common
- Higher than user

**4. Author !important**
- Important declarations
- Override normal styles
- Use sparingly
- Higher than normal author

**5. User !important**
- User important declarations
- Accessibility override
- Higher than author important

**6. User Agent !important**
- Browser important declarations
- Highest priority
- Rarely used

#### Specificity Calculation / Tính Toán Độ Cụ Thể

**Specificity Components (A, B, C, D):**

**A: Inline Styles**
- `style` attribute
- Value: 1000
- Highest specificity
- Avoid when possible

**B: IDs**
- `#id` selector
- Value: 100 per ID
- High specificity
- Use sparingly

**C: Classes, Attributes, Pseudo-classes**
- `.class` selector
- `[attribute]` selector
- `:hover`, `:nth-child()`, etc.
- Value: 10 per selector
- Recommended level

**D: Elements, Pseudo-elements**
- `div`, `p`, `span`
- `::before`, `::after`
- Value: 1 per selector
- Lowest specificity

**Examples:**

```css
/* Specificity: (0, 0, 0, 1) = 1 */
p { color: black; }

/* Specificity: (0, 0, 1, 0) = 10 */
.text { color: blue; }

/* Specificity: (0, 0, 1, 1) = 11 */
p.text { color: green; }

/* Specificity: (0, 1, 0, 0) = 100 */
#main { color: red; }

/* Specificity: (0, 1, 1, 1) = 111 */
#main p.text { color: purple; }

/* Specificity: (1, 0, 0, 0) = 1000 */
<p style="color: orange;">
```

**Special Cases:**

**Universal Selector (*):**
- Specificity: (0, 0, 0, 0)
- No specificity
- Doesn't affect calculation

**:not(), :is(), :where():**
- `:not()` and `:is()`: Use highest specificity of arguments
- `:where()`: Always (0, 0, 0, 0)
- Useful for specificity control

**!important:**
- Overrides specificity
- Creates separate cascade layer
- Avoid except for utilities
- Hard to override

#### Specificity Best Practices / Thực Hành Tốt Nhất Độ Cụ Thể

**1. Keep Specificity Low**
- Use classes primarily
- Avoid IDs for styling
- Minimize nesting
- Flat selectors better

**2. Avoid !important**
- Last resort only
- Utility classes exception
- Creates maintenance issues
- Hard to override

**3. Use Consistent Patterns**
- Single class selectors
- BEM methodology
- Utility classes
- Component-scoped styles

**4. Leverage :where()**
- Zero specificity
- Easy to override
- Good for base styles
- Modern browsers only

---

## CSS Methodologies / Phương Pháp CSS

### Popular CSS Methodologies / Phương Pháp CSS Phổ Biến

**English:** CSS methodologies provide systematic approaches to writing maintainable CSS.

**Tiếng Việt:** Các phương pháp CSS cung cấp cách tiếp cận có hệ thống để viết CSS có thể bảo trì.

#### BEM (Block Element Modifier) / BEM

**Philosophy**: Component-based naming convention

**Structure:**
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

**Principles:**

**Block:**
- Standalone entity
- Meaningful name
- Can be nested
- Reusable component

**Element:**
- Part of block
- No standalone meaning
- Tied to block
- Double underscore separator

**Modifier:**
- Variation of block/element
- Changes appearance/behavior
- Double dash separator
- Boolean or key-value

**Examples:**
```css
/* Block */
.card {}

/* Elements */
.card__header {}
.card__body {}
.card__footer {}

/* Modifiers */
.card--featured {}
.card--large {}
.card__header--dark {}
```

**Advantages:**
- Clear naming
- Low specificity
- Self-documenting
- No nesting issues
- Easy to understand

**Disadvantages:**
- Verbose names
- Repetitive
- Learning curve
- Strict rules

#### OOCSS (Object-Oriented CSS) / OOCSS

**Philosophy**: Separate structure from skin, container from content

**Principles:**

**1. Separate Structure from Skin**
- Structure: Layout, positioning
- Skin: Visual appearance
- Reusable patterns
- Mix and match

**Example:**
```css
/* Structure */
.box {
  padding: 20px;
  margin: 10px;
}

/* Skin */
.box-primary {
  background: blue;
  color: white;
}

.box-secondary {
  background: gray;
  color: black;
}
```

**2. Separate Container from Content**
- Content independent of container
- Location-independent styles
- Portable components
- No descendant selectors

**Example:**
```css
/* Bad: Location-dependent */
.sidebar h3 {
  font-size: 18px;
}

/* Good: Location-independent */
.heading-small {
  font-size: 18px;
}
```

**Advantages:**
- Highly reusable
- Smaller CSS
- Consistent design
- Performance benefits

**Disadvantages:**
- Many classes in HTML
- Less semantic
- Requires discipline
- Learning curve

#### SMACSS (Scalable and Modular Architecture for CSS) / SMACSS

**Philosophy**: Categorize CSS rules

**Categories:**

**1. Base Rules**
- Element defaults
- No classes/IDs
- Normalize/reset
- Typography base

**2. Layout Rules**
- Major sections
- Grid systems
- Page structure
- Prefix: `l-` or `layout-`

**3. Module Rules**
- Reusable components
- Most CSS here
- Self-contained
- No element selectors

**4. State Rules**
- Dynamic states
- JavaScript hooks
- Prefix: `is-` or `has-`
- Override other styles

**5. Theme Rules**
- Visual variations
- Color schemes
- Typography variations
- Optional layer

**Advantages:**
- Clear organization
- Scalable structure
- Easy to navigate
- Flexible approach

**Disadvantages:**
- Requires planning
- Team agreement needed
- Not prescriptive
- Learning curve

#### Utility-First CSS / CSS Ưu Tiên Tiện Ích

**Philosophy**: Compose designs from utility classes

**Characteristics:**
- Single-purpose classes
- Inline-style-like
- Highly composable
- Minimal custom CSS

**Example (Tailwind CSS):**
```html
<div class="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold">Title</h2>
  <button class="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Click
  </button>
</div>
```

**Advantages:**
- Fast development
- Consistent design
- Small CSS bundle (with purging)
- No naming decisions
- Easy to change

**Disadvantages:**
- Verbose HTML
- Learning curve
- Less semantic
- Requires build step
- Team buy-in needed

---

## CSS-in-JS Theory / Lý Thuyết CSS-in-JS

### CSS-in-JS Approaches / Cách Tiếp Cận CSS-in-JS

**English:** CSS-in-JS moves styling logic into JavaScript, enabling dynamic styles and component encapsulation.

**Tiếng Việt:** CSS-in-JS chuyển logic styling vào JavaScript, cho phép styles động và đóng gói component.

#### Runtime CSS-in-JS / CSS-in-JS Runtime

**Characteristics:**
- Styles generated at runtime
- Dynamic styling
- Full JavaScript power
- Component-scoped
- Theme support

**Popular Libraries:**
- Styled Components
- Emotion
- JSS
- Radium

**Advantages:**

**1. Component Encapsulation:**
- Scoped styles
- No global conflicts
- Colocation
- Easy to delete

**2. Dynamic Styling:**
- Props-based styles
- Conditional styling
- Theme switching
- Runtime calculations

**3. Developer Experience:**
- TypeScript support
- Auto-completion
- Linting
- Dead code elimination

**Disadvantages:**

**1. Performance:**
- Runtime overhead
- Larger bundle
- Style injection cost
- Re-render implications

**2. Complexity:**
- Learning curve
- Build configuration
- SSR challenges
- Debugging harder

**3. Tooling:**
- DevTools support
- Source maps
- Hot reloading
- Testing complexity

#### Zero-Runtime CSS-in-JS / CSS-in-JS Không Runtime

**Characteristics:**
- Styles extracted at build time
- No runtime cost
- Static CSS output
- Type safety
- Component-scoped

**Popular Libraries:**
- Linaria
- Vanilla Extract
- Compiled
- Astroturf

**Advantages:**

**1. Performance:**
- No runtime overhead
- Standard CSS output
- Smaller bundle
- Better caching

**2. Best of Both:**
- Type safety
- Colocation
- Scoped styles
- CSS performance

**3. Compatibility:**
- Works with any framework
- Standard CSS
- Easy migration
- Better DevTools

**Disadvantages:**

**1. Limitations:**
- Less dynamic
- Build-time only
- Limited runtime features
- More constraints

**2. Tooling:**
- Build configuration
- Babel/webpack setup
- Learning curve
- Ecosystem smaller

---

## CSS Performance / Hiệu Suất CSS

### CSS Performance Optimization / Tối Ưu Hiệu Suất CSS

**English:** CSS performance impacts both load time and runtime rendering performance.

**Tiếng Việt:** Hiệu suất CSS ảnh hưởng cả thời gian tải và hiệu suất render runtime.

#### Selector Performance / Hiệu Suất Selector

**Selector Matching:**
- Right to left matching
- Key selector most important
- Descendant selectors expensive
- Specificity affects performance

**Performance Ranking (Fast to Slow):**

**1. ID Selectors (Fastest)**
```css
#header { }
```
- Hash table lookup
- O(1) complexity
- Avoid for styling

**2. Class Selectors**
```css
.button { }
```
- Hash table lookup
- O(1) complexity
- Recommended

**3. Tag Selectors**
```css
div { }
```
- Linear search
- O(n) complexity
- Use sparingly

**4. Universal Selector**
```css
* { }
```
- Matches everything
- O(n) complexity
- Expensive

**5. Attribute Selectors**
```css
[type="text"] { }
```
- Linear search
- O(n) complexity
- Moderate cost

**6. Pseudo-classes/elements**
```css
:hover { }
::before { }
```
- Varies by type
- Some expensive
- Use judiciously

**Expensive Patterns:**

**Deep Descendant Selectors:**
```css
/* Bad: Checks every ancestor */
.container .sidebar .menu .item { }

/* Good: Single class */
.menu-item { }
```

**Universal Descendant:**
```css
/* Bad: Matches everything */
.container * { }

/* Good: Specific selector */
.container > .child { }
```

**Multiple Attribute Selectors:**
```css
/* Bad: Multiple checks */
[type="text"][required][disabled] { }

/* Good: Single class */
.input-disabled { }
```

#### Critical CSS / CSS Quan Trọng

**Concept**: Inline above-fold CSS

**Benefits:**
- Faster first paint
- Eliminates render-blocking
- Better perceived performance
- Improved Core Web Vitals

**Implementation:**

**1. Identify Critical CSS:**
- Above-fold styles
- Layout styles
- Typography
- Critical components

**2. Inline Critical CSS:**
```html
<head>
  <style>
    /* Critical CSS here */
    .header { ... }
    .hero { ... }
  </style>
</head>
```

**3. Defer Non-Critical:**
```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

**Tools:**
- Critical (npm package)
- Penthouse
- Critters (webpack plugin)
- Manual extraction

**Best Practices:**
- Keep under 14KB
- Automate extraction
- Update with design changes
- Test on real devices

#### CSS Containment / Giới Hạn CSS

**Purpose**: Isolate rendering work

**Properties:**

**layout:**
- Isolate layout calculations
- No external effects
- Better performance

**paint:**
- Isolate painting
- Clipping boundary
- GPU optimization

**size:**
- Fixed size
- No content measurement
- Fastest

**style:**
- Isolate style calculations
- Counters and quotes
- Limited use

**Example:**
```css
.card {
  contain: layout paint;
}

.sidebar {
  contain: layout style paint;
}
```

**Benefits:**
- Faster rendering
- Better scrolling
- Reduced reflows
- GPU optimization

---

## Modern CSS Features / Tính Năng CSS Hiện Đại

### Advanced CSS Capabilities / Khả Năng CSS Nâng Cao

**English:** Modern CSS provides powerful features that reduce the need for JavaScript and improve performance.

**Tiếng Việt:** CSS hiện đại cung cấp các tính năng mạnh mẽ giảm nhu cầu JavaScript và cải thiện hiệu suất.

#### CSS Custom Properties (Variables) / Thuộc Tính Tùy Chỉnh CSS

**Characteristics:**
- Runtime variables
- Cascade and inherit
- JavaScript accessible
- Scoped to elements
- Dynamic updates

**Advantages over Preprocessor Variables:**
- Runtime changes
- Cascade support
- Inheritance
- JavaScript integration
- No compilation needed

**Use Cases:**

**1. Theming:**
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

[data-theme="dark"] {
  --primary-color: #0056b3;
  --secondary-color: #495057;
}

.button {
  background: var(--primary-color);
}
```

**2. Responsive Design:**
```css
:root {
  --spacing: 16px;
}

@media (min-width: 768px) {
  :root {
    --spacing: 24px;
  }
}

.container {
  padding: var(--spacing);
}
```

**3. Component State:**
```css
.slider {
  --value: 50;
  --min: 0;
  --max: 100;
  
  width: calc((var(--value) - var(--min)) / (var(--max) - var(--min)) * 100%);
}
```

#### CSS Grid and Flexbox / CSS Grid và Flexbox

**When to Use Each:**

**Flexbox:**
- One-dimensional layouts
- Content-driven sizing
- Alignment control
- Navigation menus
- Card layouts

**Grid:**
- Two-dimensional layouts
- Layout-driven sizing
- Precise positioning
- Page layouts
- Complex grids

**Modern Patterns:**

**Intrinsic Sizing:**
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

**Subgrid:**
```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-columns: subgrid;
}
```

#### Container Queries / Truy Vấn Container

**Concept**: Style based on container size, not viewport

**Syntax:**
```css
.container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-title {
    font-size: 2rem;
  }
}
```

**Advantages:**
- True component responsiveness
- Reusable components
- Better encapsulation
- Context-aware styling

**Use Cases:**
- Component libraries
- Responsive components
- Sidebar layouts
- Card grids

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Explain CSS specificity and cascade

**English Answer:**

**Specificity** determines which rule applies when multiple rules target same element.

**Calculation (A, B, C, D):**
- A: Inline styles (1000)
- B: IDs (100)
- C: Classes, attributes, pseudo-classes (10)
- D: Elements, pseudo-elements (1)

**Examples:**
- `p` = (0,0,0,1) = 1
- `.class` = (0,0,1,0) = 10
- `#id` = (0,1,0,0) = 100
- `style=""` = (1,0,0,0) = 1000

**Cascade Order:**
1. User agent styles
2. User styles
3. Author styles
4. Author !important
5. User !important
6. User agent !important

**Best Practices:**
- Keep specificity low
- Use classes primarily
- Avoid IDs for styling
- Minimize !important
- Use :where() for zero specificity

**Tiếng Việt:**

Specificity xác định rule nào áp dụng. Tính toán: inline (1000), IDs (100), classes (10), elements (1). Cascade order: user agent → user → author → important. Best practices: low specificity, use classes, avoid IDs.

### Q2: Compare CSS methodologies (BEM, OOCSS, Utility-first)

**English Answer:**

**BEM (Block Element Modifier):**
- Component-based naming
- `.block__element--modifier`
- Low specificity
- Self-documenting
- Verbose but clear

**OOCSS (Object-Oriented CSS):**
- Separate structure from skin
- Separate container from content
- Highly reusable
- Many classes
- Composition-focused

**Utility-First (Tailwind):**
- Single-purpose classes
- Compose in HTML
- Fast development
- Small CSS (with purging)
- Verbose HTML

**When to Use:**
- **BEM**: Large teams, complex projects
- **OOCSS**: Design systems, reusability focus
- **Utility-First**: Rapid development, prototyping

**Tiếng Việt:**

BEM: component-based, `.block__element--modifier`, low specificity. OOCSS: separate structure/skin, highly reusable. Utility-First: single-purpose classes, fast development, small CSS.

### Q3: Explain CSS-in-JS trade-offs

**English Answer:**

**Runtime CSS-in-JS (Styled Components, Emotion):**

**Advantages:**
- Component encapsulation
- Dynamic styling
- Props-based styles
- Theme support
- TypeScript integration

**Disadvantages:**
- Runtime overhead
- Larger bundle
- Style injection cost
- SSR complexity

**Zero-Runtime CSS-in-JS (Vanilla Extract, Linaria):**

**Advantages:**
- No runtime cost
- Standard CSS output
- Type safety
- Better performance

**Disadvantages:**
- Less dynamic
- Build-time only
- More constraints
- Smaller ecosystem

**When to Use:**
- **Runtime**: Highly dynamic UIs, theme switching
- **Zero-Runtime**: Performance-critical, static styles

**Tiếng Việt:**

Runtime CSS-in-JS: dynamic, component-scoped, runtime overhead. Zero-Runtime: no runtime cost, static CSS, better performance. Trade-offs: flexibility vs performance.

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **Architecture**: Predictable, reusable, maintainable, scalable
2. **Cascade**: Specificity calculation, cascade layers, best practices
3. **Methodologies**: BEM, OOCSS, SMACSS, Utility-first
4. **CSS-in-JS**: Runtime vs zero-runtime, trade-offs
5. **Performance**: Selector performance, critical CSS, containment
6. **Modern Features**: Custom properties, Grid/Flexbox, Container queries

**Best Practices:**
- Keep specificity low
- Use consistent methodology
- Optimize for performance
- Leverage modern features
- Consider CSS-in-JS trade-offs
- Measure and monitor

---

[← Previous: Modern CSS Features](./06-modern-css-features.md) | [Back to Table of Contents](../00-table-of-contents.md)
