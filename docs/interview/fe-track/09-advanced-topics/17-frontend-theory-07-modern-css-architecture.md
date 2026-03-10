# Modern CSS Architecture - Complete Guide
# Kiến Trúc CSS Hiện Đại - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: CSS Fundamentals
1. CSS Box Model Deep Dive
2. Specificity and Cascade
3. CSS Custom Properties (Variables)
4. CSS Functions

### Part 2: Layout Systems
5. Flexbox Mastery
6. CSS Grid Advanced
7. Multi-Column Layout
8. Responsive Design Patterns

### Part 3: Modern CSS Features
9. CSS Container Queries
10. CSS Layers (@layer)
11. CSS Nesting
12. CSS Subgrid

### Part 4: Architecture Patterns
13. BEM Methodology
14. CSS Modules
15. CSS-in-JS
16. Utility-First CSS (Tailwind)

### Part 5: Performance
17. CSS Performance Optimization
18. Critical CSS
19. CSS Loading Strategies

---

## Part 1: CSS Fundamentals

### 1. CSS Box Model Deep Dive
### 1. CSS Box Model Tìm Hiểu Sâu

**English:**

The box model is fundamental to understanding CSS layout.

**Box Model Components:**

```css
/*
┌─────────────────────────────────┐
│         Margin (transparent)     │
│  ┌───────────────────────────┐  │
│  │    Border                 │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   Padding           │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   Content     │  │  │  │
│  │  │  │               │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
*/

.box {
  /* Content */
  width: 200px;
  height: 100px;
  
  /* Padding */
  padding: 20px;
  
  /* Border */
  border: 5px solid black;
  
  /* Margin */
  margin: 10px;
}

/* Total width calculation:
   content-box (default):
   Total width = width + padding-left + padding-right + border-left + border-right
   = 200 + 20 + 20 + 5 + 5 = 250px
   
   border-box:
   Total width = width
   = 200px (padding and border included)
*/
```

**Box Sizing:**

```css
/* Default: content-box */
.content-box {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Actual width: 250px */
}

/* Better: border-box */
.border-box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* Actual width: 200px */
}

/* Global border-box (recommended) */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

**Margin Collapsing:**

```css
/* Vertical margins collapse */
.box1 {
  margin-bottom: 20px;
}

.box2 {
  margin-top: 30px;
}

/* Gap between boxes: 30px (not 50px!)
   Larger margin wins
*/

/* Prevent margin collapsing: */

/* 1. Add border/padding */
.parent {
  padding: 1px;
}

/* 2. Use flexbox/grid */
.parent {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Use gap instead of margins */
}

/* 3. Create BFC */
.parent {
  overflow: hidden;
}
```

**Vietnamese:**

Box model là nền tảng để hiểu CSS layout.

**Thành Phần Box Model:**

1. **Content**: Nội dung (text, images)
2. **Padding**: Khoảng cách bên trong
3. **Border**: Viền
4. **Margin**: Khoảng cách bên ngoài

**Box Sizing:**

- **content-box**: width/height chỉ tính content
- **border-box**: width/height bao gồm padding và border (khuyến nghị)

**Margin Collapsing:**

Margins dọc của adjacent elements collapse thành một margin duy nhất (margin lớn hơn thắng).

---

### 2. Specificity and Cascade
### 2. Specificity và Cascade

**English:**

Understanding specificity is crucial for managing CSS conflicts.

**Specificity Calculation:**

```css
/* Specificity: (inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements) */

/* (0, 0, 0, 1) */
p { color: black; }

/* (0, 0, 1, 0) */
.text { color: blue; }

/* (0, 0, 1, 1) */
p.text { color: green; }

/* (0, 1, 0, 0) */
#unique { color: red; }

/* (0, 1, 1, 1) */
#unique p.text { color: purple; }

/* (1, 0, 0, 0) */
<p style="color: orange;">Inline</p>

/* Infinity */
p { color: yellow !important; }
```

**Specificity Examples:**

```css
/* Specificity: (0, 0, 0, 1) */
div { color: black; }

/* Specificity: (0, 0, 1, 0) - WINS */
.container { color: blue; }

/* Specificity: (0, 0, 1, 1) - WINS */
div.container { color: green; }

/* Specificity: (0, 1, 0, 0) - WINS */
#main { color: red; }

/* Specificity: (0, 1, 1, 1) - WINS */
#main div.container { color: purple; }

/* Avoid !important */
/* Only use for utility classes or overriding third-party CSS */
.hidden {
  display: none !important;
}
```

**Cascade Order:**

```css
/* 1. Origin and Importance */
/* User agent (browser) < User < Author < Author !important < User !important */

/* 2. Specificity */
/* More specific selector wins */

/* 3. Source Order */
/* Later rules override earlier rules (same specificity) */

.button {
  background: blue; /* This is overridden */
}

.button {
  background: red; /* This wins */
}
```

**Best Practices:**

```css
/* ❌ Bad: High specificity */
#header nav ul li a.active {
  color: red;
}

/* ✅ Good: Low specificity */
.nav-link--active {
  color: red;
}

/* ❌ Bad: !important everywhere */
.text {
  color: blue !important;
}

/* ✅ Good: Increase specificity instead */
.container .text {
  color: blue;
}

/* ❌ Bad: Overly specific */
div.container > ul.list > li.item > a.link {
  color: blue;
}

/* ✅ Good: Use classes */
.list-link {
  color: blue;
}
```

**Vietnamese:**

Hiểu specificity rất quan trọng để quản lý conflicts trong CSS.

**Tính Specificity:**

```
(inline, IDs, classes, elements)

Ví dụ:
p                    → (0, 0, 0, 1)
.class               → (0, 0, 1, 0)
#id                  → (0, 1, 0, 0)
style=""             → (1, 0, 0, 0)
!important           → Infinity
```

**Cascade Order:**

1. **Origin**: User agent < User < Author
2. **Specificity**: Selector cụ thể hơn thắng
3. **Source Order**: Rule sau ghi đè rule trước

**Best Practices:**

- Giữ specificity thấp
- Tránh !important
- Dùng classes thay vì IDs
- Tránh nested selectors sâu

---

### 3. CSS Custom Properties (Variables)
### 3. CSS Custom Properties (Biến)

**English:**

CSS variables enable dynamic, maintainable stylesheets.

**Basic Usage:**

```css
:root {
  /* Define variables */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.button {
  /* Use variables */
  background-color: var(--primary-color);
  font-size: var(--font-size-base);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}

/* Fallback values */
.text {
  color: var(--text-color, black); /* Falls back to black */
}
```

**Theming:**

```css
/* Light theme (default) */
:root {
  --bg-primary: white;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
}

/* Dark theme */
[data-theme="dark"] {
  --bg-primary: #212529;
  --bg-secondary: #343a40;
  --text-primary: #f8f9fa;
  --text-secondary: #adb5bd;
}

/* Components use variables */
.card {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.card-subtitle {
  color: var(--text-secondary);
}
```

**JavaScript Integration:**

```javascript
// Get variable value
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
  .getPropertyValue('--primary-color');

console.log(primaryColor); // "#007bff"

// Set variable value
root.style.setProperty('--primary-color', '#ff0000');

// Toggle theme
function toggleTheme() {
  const currentTheme = root.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
}

// Dynamic color generation
function setThemeColor(hue) {
  root.style.setProperty('--primary-hue', hue);
  root.style.setProperty('--primary-color', `hsl(${hue}, 70%, 50%)`);
  root.style.setProperty('--primary-light', `hsl(${hue}, 70%, 70%)`);
  root.style.setProperty('--primary-dark', `hsl(${hue}, 70%, 30%)`);
}
```

**Advanced Patterns:**

```css
/* Responsive variables */
:root {
  --container-width: 1200px;
  --gutter: 16px;
}

@media (max-width: 768px) {
  :root {
    --container-width: 100%;
    --gutter: 8px;
  }
}

/* Component-scoped variables */
.card {
  --card-padding: 20px;
  --card-bg: white;
  
  padding: var(--card-padding);
  background: var(--card-bg);
}

.card--large {
  --card-padding: 40px;
}

/* Calculated variables */
:root {
  --base-size: 16px;
  --scale-ratio: 1.25;
  
  --size-xs: calc(var(--base-size) / var(--scale-ratio) / var(--scale-ratio));
  --size-sm: calc(var(--base-size) / var(--scale-ratio));
  --size-md: var(--base-size);
  --size-lg: calc(var(--base-size) * var(--scale-ratio));
  --size-xl: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio));
}

/* Color system */
:root {
  --primary-h: 210;
  --primary-s: 100%;
  --primary-l: 50%;
  
  --primary: hsl(var(--primary-h), var(--primary-s), var(--primary-l));
  --primary-light: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) + 20%));
  --primary-dark: hsl(var(--primary-h), var(--primary-s), calc(var(--primary-l) - 20%));
}
```

**Vietnamese:**

CSS variables cho phép tạo stylesheets động và dễ maintain.

**Sử Dụng Cơ Bản:**

```css
/* Định nghĩa */
:root {
  --primary-color: #007bff;
}

/* Sử dụng */
.button {
  background: var(--primary-color);
}

/* Fallback */
.text {
  color: var(--text-color, black);
}
```

**Lợi Ích:**

1. **Theming**: Dễ dàng đổi theme
2. **Maintainability**: Thay đổi một chỗ, áp dụng toàn bộ
3. **Dynamic**: Có thể thay đổi bằng JavaScript
4. **Scoped**: Có thể scope theo component

**Patterns:**

- Responsive variables
- Component-scoped variables
- Calculated variables
- Color systems

