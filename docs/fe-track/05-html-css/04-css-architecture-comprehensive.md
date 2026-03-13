# CSS Architecture - Comprehensive Theoretical Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## From Fundamentals to Advanced Patterns

[← Back to Responsive Design](./03-responsive-design.md) | [Next: Performance →](../06-browser-performance/04-web-performance-comprehensive.md)

---

## 📋 Table of Contents

1. [CSS Architecture Fundamentals](#css-architecture-fundamentals)
2. [Cascade and Specificity Theory](#cascade-and-specificity-theory)
3. [Box Model Deep Dive](#box-model-deep-dive)
4. [Layout Systems Theory](#layout-systems-theory)
5. [CSS Methodologies](#css-methodologies)
6. [Component Architecture](#component-architecture)
7. [CSS-in-JS Theory](#css-in-js-theory)
8. [Performance Considerations](#performance-considerations)
9. [Maintainability Patterns](#maintainability-patterns)
10. [Interview Questions](#interview-questions)

---

## 🎯 Learning Objectives

Master CSS architecture:
- Understand cascade and specificity deeply
- Learn layout system principles
- Apply CSS methodologies
- Design scalable architectures
- Optimize CSS performance
- Build maintainable systems

---

## CSS Architecture Fundamentals

### What is CSS Architecture?

**English Definition:** CSS architecture is the systematic organization and structuring of CSS code to create maintainable, scalable, and performant stylesheets.

**Định nghĩa (Tiếng Việt):** Kiến trúc CSS là việc tổ chức và cấu trúc có hệ thống mã CSS để tạo ra các stylesheet dễ bảo trì, có khả năng mở rộng và hiệu suất cao.

### CSS Architecture Mind Map

```
CSS Architecture
│
├── Core Concepts
│   ├── Cascade
│   ├── Specificity
│   ├── Inheritance
│   └── Box Model
│
├── Layout Systems
│   ├── Normal Flow
│   ├── Flexbox
│   ├── Grid
│   └── Positioning
│
├── Methodologies
│   ├── BEM
│   ├── OOCSS
│   ├── SMACSS
│   ├── ITCSS
│   └── Atomic CSS
│
├── Modern Approaches
│   ├── CSS Modules
│   ├── CSS-in-JS
│   ├── Utility-First
│   └── Component-Scoped
│
└── Best Practices
    ├── Naming Conventions
    ├── File Organization
    ├── Scalability
    ├── Performance
    └── Maintainability
```

### CSS Architecture Principles

**1. Predictability**

**Theory:** CSS should behave consistently and predictably across the application.

**Characteristics:**
- Consistent naming conventions
- Clear selector patterns
- Minimal side effects
- Explicit dependencies

**Anti-patterns:**
- Overly specific selectors
- !important overuse
- Global styles affecting components
- Unclear inheritance chains

**2. Reusability**

**Theory:** CSS components should be reusable across different contexts.

**Approaches:**
- Component-based design
- Utility classes
- Mixins and functions
- Design tokens

**Benefits:**
- Reduced code duplication
- Consistent design system
- Faster development
- Easier maintenance

**3. Maintainability**

**Theory:** CSS should be easy to understand, modify, and extend.

**Factors:**
- Clear organization
- Self-documenting code
- Modular structure
- Version control friendly

**Practices:**
- Meaningful class names
- Logical file structure
- Documentation
- Code reviews

**4. Scalability**

**Theory:** CSS architecture should handle growth without degradation.

**Considerations:**
- File size management
- Selector performance
- Build process optimization
- Team collaboration

---

## Cascade and Specificity Theory

### The Cascade

**Definition:** The cascade is the algorithm that determines which CSS rules apply when multiple rules target the same element.

**Định nghĩa:** Cascade là thuật toán xác định quy tắc CSS nào được áp dụng khi nhiều quy tắc nhắm đến cùng một phần tử.

### Cascade Algorithm

**Theory:** The cascade resolves conflicts through a multi-step process.

**Cascade Layers (in order):**

**1. Origin and Importance**

**Origin Priority (lowest to highest):**
1. User agent styles (browser defaults)
2. User styles (user preferences)
3. Author styles (website CSS)
4. Author !important
5. User !important
6. User agent !important

**Theory:** !important reverses the cascade order, giving users ultimate control.

**2. Specificity**

**Definition:** Specificity determines which rule wins when multiple rules have same origin and importance.

**Specificity Calculation:**

**Four-part value: (a, b, c, d)**
- **a:** Inline styles (1 or 0)
- **b:** ID selectors count
- **c:** Class, attribute, pseudo-class count
- **d:** Element, pseudo-element count

**Examples:**
```
style=""                    → (1, 0, 0, 0)
#header                     → (0, 1, 0, 0)
.nav .item                  → (0, 0, 2, 0)
div p                       → (0, 0, 0, 2)
#header .nav .item          → (0, 1, 2, 0)
```

**Comparison:**
- Compare left to right
- First non-equal value wins
- (0, 1, 0, 0) beats (0, 0, 10, 0)

**3. Source Order**

**Theory:** When origin, importance, and specificity are equal, last rule wins.

**Implications:**
- Order matters in stylesheets
- Later imports override earlier
- Cascade-dependent patterns

### Specificity Management

**Theory:** Managing specificity is crucial for maintainable CSS.

**Strategies:**

**1. Keep Specificity Low**

**Reasoning:**
- Easier to override
- More flexible
- Less !important needed
- Better maintainability

**Approach:**
- Use single classes
- Avoid ID selectors
- Minimize nesting
- Avoid tag selectors

**2. Specificity Graph**

**Theory:** Specificity should increase gradually through stylesheet.

**Ideal Pattern:**
```
Base styles (low specificity)
  ↓
Component styles (medium specificity)
  ↓
Utility/override styles (high specificity)
```

**Anti-pattern:**
- Specificity spikes
- Specificity wars
- !important proliferation

**3. Specificity Isolation**

**Theory:** Isolate components to prevent specificity conflicts.

**Techniques:**
- CSS Modules
- Shadow DOM
- Unique prefixes
- Scoped styles

### Inheritance Theory

**Definition:** Inheritance is the mechanism by which certain CSS properties pass from parent to child elements.

**Định nghĩa:** Inheritance là cơ chế mà một số thuộc tính CSS được truyền từ phần tử cha sang phần tử con.

**Inherited Properties:**

**Typography:**
- font-family, font-size, font-weight
- line-height, letter-spacing
- text-align, text-transform
- color

**Lists:**
- list-style-type, list-style-position

**Visibility:**
- visibility (but not display)
- cursor

**Non-Inherited Properties:**

**Box Model:**
- margin, padding, border
- width, height

**Positioning:**
- position, top, left
- float, clear

**Display:**
- display
- overflow

**Background:**
- background-color, background-image

**Controlling Inheritance:**

**Keywords:**
- `inherit`: Force inheritance
- `initial`: Reset to initial value
- `unset`: Inherit if inheritable, else initial
- `revert`: Revert to user agent style

---

## Box Model Deep Dive

### Box Model Theory

**Definition:** The box model describes how elements are rendered as rectangular boxes with content, padding, border, and margin.

**Định nghĩa:** Box model mô tả cách các phần tử được hiển thị dưới dạng các hộp chữ nhật với nội dung, padding, border và margin.

### Box Model Components

**Structure:**
```
┌─────────────────────────────────┐
│         Margin (transparent)     │
│  ┌───────────────────────────┐  │
│  │    Border                 │  │
│  │  ┌─────────────────────┐ │  │
│  │  │   Padding           │ │  │
│  │  │  ┌───────────────┐ │ │  │
│  │  │  │   Content     │ │ │  │
│  │  │  └───────────────┘ │ │  │
│  │  └─────────────────────┘ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**1. Content Box**

**Theory:** The innermost box containing actual content (text, images, etc.).

**Dimensions:**
- Controlled by width/height
- Contains inline/block content
- Can overflow

**2. Padding Box**

**Theory:** Space between content and border, inherits background.

**Characteristics:**
- Transparent to content
- Inherits background-color/image
- Affects clickable area
- Part of element's visual size

**3. Border Box**

**Theory:** Line surrounding padding, can have color, width, style.

**Properties:**
- border-width
- border-style
- border-color
- border-radius (affects visual shape)

**4. Margin Box**

**Theory:** Space outside border, separates elements.

**Characteristics:**
- Always transparent
- Doesn't inherit background
- Can be negative
- Collapses in certain situations

### Box Sizing Theory

**Definition:** Box-sizing determines how width/height are calculated.

**Định nghĩa:** Box-sizing xác định cách width/height được tính toán.

**Two Models:**

**1. content-box (default)**

**Calculation:**
```
Total Width = width + padding-left + padding-right + border-left + border-right
Total Height = height + padding-top + padding-bottom + border-top + border-bottom
```

**Characteristics:**
- Width/height apply to content only
- Padding/border add to dimensions
- Traditional CSS behavior
- Harder to calculate

**2. border-box**

**Calculation:**
```
Total Width = width (includes padding and border)
Total Height = height (includes padding and border)
```

**Characteristics:**
- Width/height include padding and border
- Content box shrinks to fit
- More intuitive
- Recommended for modern CSS

**Best Practice:**
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Margin Collapse Theory

**Definition:** Vertical margins between adjacent elements collapse into a single margin.

**Định nghĩa:** Margin dọc giữa các phần tử liền kề sẽ gộp lại thành một margin duy nhất.

**Collapse Rules:**

**1. Adjacent Siblings**

**Theory:** Vertical margins between siblings collapse.

**Result:** Larger margin wins

**2. Parent-Child**

**Theory:** Parent's top margin collapses with first child's top margin.

**Conditions:**
- No border/padding separating them
- No content between them
- Both in normal flow

**3. Empty Elements**

**Theory:** Element's top and bottom margins collapse with each other.

**Conditions:**
- No height, padding, or border
- No content

**Preventing Collapse:**

**Techniques:**
- Add border/padding
- Use flexbox/grid (no collapse)
- Create BFC (Block Formatting Context)
- Use overflow: hidden
- Position: absolute/fixed

---

## Layout Systems Theory

### Normal Flow

**Definition:** The default layout algorithm where elements are laid out in the order they appear in HTML.

**Định nghĩa:** Thuật toán bố cục mặc định nơi các phần tử được sắp xếp theo thứ tự chúng xuất hiện trong HTML.

**Block Formatting Context (BFC):**

**Theory:** BFC is an isolated layout environment where elements follow specific rules.

**BFC Creation:**
- Root element (html)
- Float elements
- Absolutely positioned elements
- Inline-blocks
- overflow: not visible
- display: flow-root
- Flex/grid items

**BFC Behavior:**
- Contains floats
- Prevents margin collapse
- Excludes external floats
- Independent layout

### Flexbox Theory

**Definition:** Flexbox is a one-dimensional layout system for distributing space and aligning items.

**Định nghĩa:** Flexbox là hệ thống bố cục một chiều để phân phối không gian và căn chỉnh các mục.

**Theoretical Model:**

**Main Axis vs Cross Axis:**
- Main axis: Primary direction (row or column)
- Cross axis: Perpendicular to main axis
- Direction controlled by flex-direction

**Flex Container Properties:**

**1. flex-direction**
- Defines main axis direction
- row, row-reverse, column, column-reverse

**2. justify-content**
- Aligns items along main axis
- flex-start, flex-end, center, space-between, space-around, space-evenly

**3. align-items**
- Aligns items along cross axis
- stretch, flex-start, flex-end, center, baseline

**4. flex-wrap**
- Controls wrapping behavior
- nowrap, wrap, wrap-reverse

**Flex Item Properties:**

**1. flex-grow**
- Ability to grow
- Unitless proportion
- Default: 0 (don't grow)

**2. flex-shrink**
- Ability to shrink
- Unitless proportion
- Default: 1 (can shrink)

**3. flex-basis**
- Initial size before growing/shrinking
- Default: auto
- Can be length or percentage

**Flex Algorithm:**

**Theory:** Flexbox distributes space through multi-step algorithm.

**Steps:**
1. Determine flex container size
2. Calculate flex basis for items
3. Distribute free space (flex-grow)
4. Shrink if needed (flex-shrink)
5. Align items (justify-content, align-items)

### Grid Theory

**Definition:** Grid is a two-dimensional layout system for creating complex layouts with rows and columns.

**Định nghĩa:** Grid là hệ thống bố cục hai chiều để tạo các bố cục phức tạp với hàng và cột.

**Theoretical Model:**

**Grid Container:**
- Defines grid structure
- Contains grid items
- Establishes grid context

**Grid Lines:**
- Dividing lines creating grid structure
- Numbered from 1
- Can be named

**Grid Tracks:**
- Space between two grid lines
- Rows or columns
- Sized with various units

**Grid Cells:**
- Intersection of row and column
- Smallest unit of grid

**Grid Areas:**
- Rectangular area spanning multiple cells
- Can be named
- Used for placement

**Grid Properties:**

**Container Properties:**

**1. grid-template-columns/rows**
- Defines track sizes
- Can use fr units (fractional)
- repeat() function
- minmax() function

**2. gap (grid-gap)**
- Space between tracks
- Replaces margin for spacing

**3. grid-template-areas**
- Named grid areas
- Visual layout definition

**Item Properties:**

**1. grid-column/row**
- Placement on grid
- Start and end lines
- Span keyword

**2. grid-area**
- Shorthand for placement
- Or reference to named area

**Grid Algorithm:**

**Theory:** Grid sizing algorithm is complex, handling various constraints.

**Track Sizing:**
1. Resolve fixed sizes
2. Resolve flexible sizes (fr)
3. Distribute remaining space
4. Handle min/max constraints

**Auto-placement:**
- Fills unplaced items
- Row or column direction
- Dense packing option

---

## CSS Methodologies

### BEM (Block Element Modifier)

**Definition:** BEM is a naming convention that creates clear relationships between CSS and HTML.

**Định nghĩa:** BEM là quy ước đặt tên tạo ra mối quan hệ rõ ràng giữa CSS và HTML.

**Theory:**

**Structure:**
- **Block:** Standalone component
- **Element:** Part of block
- **Modifier:** Variation of block/element

**Naming Pattern:**
```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

**Principles:**

**1. Independence**
- Blocks are independent
- Can be reused anywhere
- No dependencies on context

**2. Flat Specificity**
- All selectors have same specificity
- No nesting in selectors
- Easy to override

**3. Self-documenting**
- Names describe purpose
- Structure visible in HTML
- Clear relationships

**Benefits:**
- Predictable specificity
- Reusable components
- Clear structure
- Team-friendly

**Drawbacks:**
- Verbose class names
- Requires discipline
- Learning curve

### OOCSS (Object-Oriented CSS)

**Theory:** OOCSS separates structure from skin and container from content.

**Principles:**

**1. Separate Structure from Skin**

**Structure:** Layout properties
- width, height
- margin, padding
- position, display

**Skin:** Visual properties
- color, background
- border, shadow
- typography

**Benefit:** Reuse visual styles across different structures

**2. Separate Container from Content**

**Theory:** Content should look same regardless of container.

**Anti-pattern:**
```css
.sidebar h3 { /* Depends on container */ }
```

**Better:**
```css
.heading-tertiary { /* Independent */ }
```

### SMACSS (Scalable and Modular Architecture for CSS)

**Theory:** SMACSS categorizes CSS rules into five types.

**Categories:**

**1. Base**
- Element defaults
- No classes
- Normalize/reset

**2. Layout**
- Major page sections
- Grid systems
- Prefix: l-

**3. Module**
- Reusable components
- Most of CSS
- No prefix

**4. State**
- Describes states
- Prefix: is-
- Often with JavaScript

**5. Theme**
- Visual variations
- Color schemes
- Typography scales

### ITCSS (Inverted Triangle CSS)

**Theory:** ITCSS organizes CSS by specificity, from generic to specific.

**Layers (low to high specificity):**

**1. Settings**
- Variables
- Config
- No output

**2. Tools**
- Mixins
- Functions
- No output

**3. Generic**
- Resets
- Normalize
- Box-sizing

**4. Elements**
- Bare HTML elements
- No classes

**5. Objects**
- Layout patterns
- OOCSS
- No cosmetics

**6. Components**
- UI components
- Most specific
- Complete styling

**7. Utilities**
- Helpers
- Overrides
- !important allowed

**Benefits:**
- Manages specificity
- Reduces conflicts
- Scalable structure
- Clear organization

---

## Summary

### Key Theoretical Concepts

1. **Cascade and Specificity**
   - Origin and importance
   - Specificity calculation
   - Inheritance rules
   - Conflict resolution

2. **Box Model**
   - Content, padding, border, margin
   - Box-sizing models
   - Margin collapse
   - BFC behavior

3. **Layout Systems**
   - Normal flow
   - Flexbox (one-dimensional)
   - Grid (two-dimensional)
   - Positioning schemes

4. **CSS Methodologies**
   - BEM: Component naming
   - OOCSS: Separation of concerns
   - SMACSS: Categorization
   - ITCSS: Specificity management

5. **Architecture Principles**
   - Predictability
   - Reusability
   - Maintainability
   - Scalability

### Best Practices

✅ **DO:**
- Keep specificity low and consistent
- Use meaningful class names
- Organize by methodology
- Document complex patterns
- Consider maintainability

❌ **DON'T:**
- Overuse !important
- Create specificity wars
- Nest selectors deeply
- Use ID selectors for styling
- Ignore cascade implications

---

[← Back to Responsive Design](./03-responsive-design.md) | [Next: Performance →](../06-browser-performance/04-web-performance-comprehensive.md)
