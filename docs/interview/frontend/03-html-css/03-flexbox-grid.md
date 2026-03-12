# Flexbox & Grid - Modern CSS Layouts

> Flexbox và Grid là hai layout systems chính của modern CSS. Hiểu cả hai để chọn đúng tool.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLEXBOX vs GRID                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   FLEXBOX                         GRID                           │
│   ┌─────────────────────┐        ┌─────────────────────┐        │
│   │ One-dimensional     │        │ Two-dimensional     │        │
│   │ (row OR column)     │        │ (rows AND columns)  │        │
│   │                     │        │                     │        │
│   │ Content-first       │        │ Layout-first        │        │
│   │ (content decides)   │        │ (grid decides)      │        │
│   │                     │        │                     │        │
│   │ Use for:            │        │ Use for:            │        │
│   │ • Navigation        │        │ • Page layouts      │        │
│   │ • Card content      │        │ • Image galleries   │        │
│   │ • Centering         │        │ • Complex layouts   │        │
│   │ • Equal heights     │        │ • Dashboard grids   │        │
│   └─────────────────────┘        └─────────────────────┘        │
│                                                                   │
│   Can be combined! Grid for layout, Flexbox for components.     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Flexbox

### Container Properties

```css
.container {
    display: flex;

    /* Direction */
    flex-direction: row;           /* Default: left to right */
    flex-direction: row-reverse;   /* Right to left */
    flex-direction: column;        /* Top to bottom */
    flex-direction: column-reverse;

    /* Wrapping */
    flex-wrap: nowrap;    /* Default: single line */
    flex-wrap: wrap;      /* Wrap to new lines */
    flex-wrap: wrap-reverse;

    /* Shorthand */
    flex-flow: row wrap;

    /* Main axis alignment */
    justify-content: flex-start;   /* Default */
    justify-content: flex-end;
    justify-content: center;
    justify-content: space-between; /* Equal space between items */
    justify-content: space-around;  /* Equal space around items */
    justify-content: space-evenly;  /* Equal space everywhere */

    /* Cross axis alignment */
    align-items: stretch;    /* Default: fill container */
    align-items: flex-start;
    align-items: flex-end;
    align-items: center;
    align-items: baseline;   /* Align text baselines */

    /* Multi-line cross axis */
    align-content: flex-start;
    align-content: center;
    align-content: space-between;

    /* Gap between items */
    gap: 1rem;
    row-gap: 1rem;
    column-gap: 2rem;
}
```

### Item Properties

```css
.item {
    /* Flex shorthand: grow shrink basis */
    flex: 1;              /* flex: 1 1 0 */
    flex: 0 1 auto;       /* Default */
    flex: 1 0 200px;      /* Grow, don't shrink, start at 200px */

    /* Individual properties */
    flex-grow: 1;         /* How much to grow (ratio) */
    flex-shrink: 0;       /* Don't shrink */
    flex-basis: 200px;    /* Initial size */

    /* Self alignment */
    align-self: center;   /* Override align-items */

    /* Order */
    order: 1;             /* Default: 0, higher = later */
}
```

### Common Patterns

```css
/* Center everything */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Navigation bar */
.navbar {
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

/* Sticky footer */
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
.main {
    flex: 1;
}

/* Card with footer at bottom */
.card {
    display: flex;
    flex-direction: column;
}
.card-body {
    flex: 1;
}
```

### Flexbox Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLEXBOX AXES                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   flex-direction: row                                            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    main axis →                           │   │
│   │    ┌──────┐   ┌──────┐   ┌──────┐                       │   │
│   │ ↑  │ item │   │ item │   │ item │                       │   │
│   │ c  │  1   │   │  2   │   │  3   │                       │   │
│   │ r  └──────┘   └──────┘   └──────┘                       │   │
│   │ o                                                        │   │
│   │ s  justify-content: controls main axis                   │   │
│   │ s  align-items: controls cross axis                      │   │
│   │ ↓                                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   flex-direction: column                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │        ← cross axis →                                    │   │
│   │    ┌─────────────────────┐    ↑                         │   │
│   │    │       item 1        │    m                         │   │
│   │    └─────────────────────┘    a                         │   │
│   │    ┌─────────────────────┐    i                         │   │
│   │    │       item 2        │    n                         │   │
│   │    └─────────────────────┘                              │   │
│   │    ┌─────────────────────┐    a                         │   │
│   │    │       item 3        │    x                         │   │
│   │    └─────────────────────┘    i                         │   │
│   │                               s                         │   │
│   │                               ↓                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔲 CSS Grid

### Container Properties

```css
.container {
    display: grid;

    /* Define columns */
    grid-template-columns: 200px 200px 200px;
    grid-template-columns: 1fr 2fr 1fr;        /* Fractional units */
    grid-template-columns: repeat(3, 1fr);     /* Repeat */
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive */

    /* Define rows */
    grid-template-rows: 100px auto 100px;

    /* Shorthand */
    grid-template: 100px auto / repeat(3, 1fr);

    /* Named lines */
    grid-template-columns: [start] 1fr [middle] 2fr [end];

    /* Named areas */
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";

    /* Gap */
    gap: 1rem;
    row-gap: 1rem;
    column-gap: 2rem;

    /* Alignment */
    justify-items: stretch;   /* Horizontal within cell */
    align-items: stretch;     /* Vertical within cell */
    place-items: center;      /* Both */

    justify-content: center;  /* Whole grid horizontal */
    align-content: center;    /* Whole grid vertical */

    /* Auto rows/columns */
    grid-auto-rows: 100px;    /* Size of implicit rows */
    grid-auto-columns: 1fr;
    grid-auto-flow: row;      /* How auto items are placed */
}
```

### Item Properties

```css
.item {
    /* Placement by line numbers */
    grid-column-start: 1;
    grid-column-end: 3;
    grid-column: 1 / 3;       /* Shorthand */
    grid-column: 1 / span 2;  /* Span 2 columns */

    grid-row: 1 / 3;

    /* Named area */
    grid-area: header;

    /* Self alignment */
    justify-self: center;
    align-self: center;
    place-self: center;
}
```

### Common Patterns

```css
/* Holy Grail Layout */
.page {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav    main   aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Auto-fit responsive grid */
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

/* Masonry-like (CSS Grid Level 3) */
.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-auto-rows: 10px;
}
.item {
    grid-row-end: span var(--row-span);
}

/* Card grid with consistent heights */
.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
.card {
    display: grid;
    grid-template-rows: auto 1fr auto;
}
```

### Grid Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      CSS GRID ANATOMY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Line numbers:  1        2        3        4                    │
│                  │        │        │        │                    │
│              ────┼────────┼────────┼────────┼────                │
│           1  ────│ Cell   │ Cell   │ Cell   │                    │
│              ────│ (1,1)  │ (1,2)  │ (1,3)  │                    │
│              ────┼────────┼────────┼────────┼────                │
│           2  ────│ Cell   │  Item spanning  │                    │
│              ────│ (2,1)  │  grid-column:   │                    │
│              ────│        │  2 / 4          │                    │
│              ────┼────────┼────────┼────────┼────                │
│           3  ────│ Cell   │ Cell   │ Cell   │                    │
│              ────│ (3,1)  │ (3,2)  │ (3,3)  │                    │
│              ────┼────────┼────────┼────────┼────                │
│                  │        │        │        │                    │
│                                                                   │
│   ← Column Track →  gap   ← Column Track →                       │
│                                                                   │
│   Row Track = space between two horizontal lines                 │
│   Column Track = space between two vertical lines                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Flexbox vs Grid

### When to Use What

| Use Flexbox When | Use Grid When |
|-----------------|---------------|
| One-dimensional layout | Two-dimensional layout |
| Content determines size | Layout determines size |
| Unknown number of items | Known grid structure |
| Need items to wrap naturally | Need precise placement |
| Simple alignment | Complex overlapping |

### Combining Both

```css
/* Grid for page layout */
.page {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
}

/* Flexbox for navigation inside grid */
.nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Flexbox for card content inside grid */
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.card {
    display: flex;
    flex-direction: column;
}

.card-body {
    flex: 1;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Flexbox dùng để làm gì?**

A: One-dimensional layouts (row hoặc column). Content-driven - items decide their size.

**Q: Grid dùng để làm gì?**

A: Two-dimensional layouts (rows và columns). Layout-driven - grid defines structure.

### 🟡 Mid-level

**Q: flex: 1 nghĩa là gì?**

A: Shorthand cho `flex-grow: 1; flex-shrink: 1; flex-basis: 0`. Item sẽ grow để fill available space, có thể shrink, starting from 0.

**Q: grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))?**

A: Tạo responsive grid với columns tối thiểu 200px, tối đa 1fr. auto-fit = fit nhiều columns nhất có thể.

### 🔴 Senior

**Q: auto-fit vs auto-fill?**

A:
- auto-fill: Creates as many tracks as fit, even if empty
- auto-fit: Collapses empty tracks, stretches content

**Q: Design responsive card grid**

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.card {
    display: flex;
    flex-direction: column;
}

.card-body {
    flex: 1;
}
```

---

## 📚 Active Recall

1. [ ] List 5 justify-content values
2. [ ] Explain flex: 1 0 auto
3. [ ] Create Holy Grail layout với Grid
4. [ ] When flex vs grid?
5. [ ] auto-fit vs auto-fill?

---

> **Tiếp theo:** [04-responsive-design.md](./04-responsive-design.md) - Responsive Design
