# HTML & CSS - Frontend Fundamentals

> HTML và CSS là nền tảng của mọi web application. Hiểu sâu giúp build UI tốt hơn và debug hiệu quả.

---

## Tổng Quan

HTML và CSS có vẻ đơn giản nhưng có nhiều concepts quan trọng cho interviews:
- **Semantic HTML** - Accessibility, SEO
- **CSS Box Model** - Layout fundamentals
- **Flexbox & Grid** - Modern layouts
- **Responsive Design** - Mobile-first
- **CSS Architecture** - Scalable styles

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-semantic-html.md](./01-semantic-html.md) | Semantic Elements, A11y | ⭐⭐⭐⭐ |
| [02-css-fundamentals.md](./02-css-fundamentals.md) | Box Model, Specificity | ⭐⭐⭐⭐⭐ |
| [03-flexbox-grid.md](./03-flexbox-grid.md) | Modern Layouts | ⭐⭐⭐⭐⭐ |
| [04-responsive-design.md](./04-responsive-design.md) | Media Queries, Mobile-first | ⭐⭐⭐⭐ |
| [05-css-architecture.md](./05-css-architecture.md) | BEM, CSS Modules, CSS-in-JS | ⭐⭐⭐⭐ |
| [06-animations-transitions.md](./06-animations-transitions.md) | CSS Animations | ⭐⭐⭐ |
| [mindmap-html-css.md](./mindmap-html-css.md) | Sơ Đồ Tổng Hợp | Review |

---

## Quick Reference

### HTML5 Semantic Elements

```html
<header>    <!-- Page/section header -->
<nav>       <!-- Navigation links -->
<main>      <!-- Main content (unique) -->
<article>   <!-- Self-contained content -->
<section>   <!-- Thematic grouping -->
<aside>     <!-- Sidebar content -->
<footer>    <!-- Page/section footer -->
<figure>    <!-- Image with caption -->
<figcaption>
<time>      <!-- Date/time -->
<mark>      <!-- Highlighted text -->
```

### CSS Box Model

```
┌─────────────────────────────────────────┐
│              MARGIN                      │
│   ┌─────────────────────────────────┐   │
│   │           BORDER                │   │
│   │   ┌─────────────────────────┐   │   │
│   │   │        PADDING          │   │   │
│   │   │   ┌─────────────────┐   │   │   │
│   │   │   │    CONTENT      │   │   │   │
│   │   │   │   width/height  │   │   │   │
│   │   │   └─────────────────┘   │   │   │
│   │   └─────────────────────────┘   │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

box-sizing: content-box (default)
box-sizing: border-box (recommended)
```

### Flexbox Cheatsheet

```css
/* Container */
.container {
    display: flex;
    flex-direction: row | column;
    justify-content: flex-start | center | space-between;
    align-items: stretch | center | flex-start;
    flex-wrap: nowrap | wrap;
    gap: 1rem;
}

/* Items */
.item {
    flex: 1;              /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
    flex-grow: 1;         /* How much to grow */
    flex-shrink: 0;       /* Don't shrink */
    flex-basis: 200px;    /* Initial size */
    align-self: center;   /* Override align-items */
}
```

### Grid Cheatsheet

```css
/* Container */
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
}

/* Items */
.item {
    grid-column: 1 / 3;       /* Span columns 1-2 */
    grid-row: 1 / 2;          /* Span row 1 */
    grid-area: header;        /* Named area */
}

/* Common patterns */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

### CSS Specificity

```
Specificity Order (Low → High):

1. Element/pseudo-element     (0,0,0,1)  → p, ::before
2. Class/attribute/pseudo     (0,0,1,0)  → .class, [type], :hover
3. ID                         (0,1,0,0)  → #id
4. Inline style               (1,0,0,0)  → style=""
5. !important                 (∞)        → overrides all

Examples:
p                    → 0,0,0,1
.class               → 0,0,1,0
p.class              → 0,0,1,1
#id                  → 0,1,0,0
#id .class p         → 0,1,1,1
```

### Responsive Breakpoints

```css
/* Mobile-first approach */
/* Mobile: default styles */

/* Tablet */
@media (min-width: 768px) {
    /* Tablet styles */
}

/* Desktop */
@media (min-width: 1024px) {
    /* Desktop styles */
}

/* Large desktop */
@media (min-width: 1280px) {
    /* Large screen styles */
}
```

---

## Top Interview Questions

### HTML

| Question | Difficulty |
|----------|------------|
| Semantic HTML là gì? Tại sao quan trọng? | 🟢 |
| `<div>` vs `<section>` vs `<article>`? | 🟢 |
| DOM là gì? | 🟡 |
| data-* attributes dùng để làm gì? | 🟡 |
| Accessibility best practices? | 🟡 |

### CSS

| Question | Difficulty |
|----------|------------|
| Box model là gì? content-box vs border-box? | 🟢 |
| CSS specificity hoạt động như thế nào? | 🟡 |
| Flexbox vs Grid - khi nào dùng gì? | 🟡 |
| Position: relative vs absolute vs fixed? | 🟡 |
| BEM methodology là gì? | 🟡 |
| CSS-in-JS pros and cons? | 🔴 |

---

## Resources

- [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs - CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS Tricks - Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Tricks - Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web.dev - Learn CSS](https://web.dev/learn/css/)

---

> **Thời gian ước tính:** 1 tuần
