# HTML/CSS Mind Map - Quick Reference

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức HTML/CSS cho interview.

---

## 🗺️ HTML/CSS Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HTML/CSS KNOWLEDGE MAP                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                              ┌─────────────┐                             │
│                              │  HTML/CSS   │                             │
│                              └──────┬──────┘                             │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │   STRUCTURE   │         │    STYLING    │         │    LAYOUT     │ │
│   │   (HTML)      │         │    (CSS)      │         │               │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • Semantic    │         │ • Box Model   │         │ • Flexbox     │ │
│   │ • Accessibility│        │ • Specificity │         │ • Grid        │ │
│   │ • Forms       │         │ • Cascade     │         │ • Positioning │ │
│   │ • Media       │         │ • Inheritance │         │ • Float       │ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                     │                                     │
│           ┌─────────────────────────┼─────────────────────────┐          │
│           │                         │                         │          │
│           ▼                         ▼                         ▼          │
│   ┌───────────────┐         ┌───────────────┐         ┌───────────────┐ │
│   │  RESPONSIVE   │         │  ARCHITECTURE │         │   ANIMATION   │ │
│   ├───────────────┤         ├───────────────┤         ├───────────────┤ │
│   │ • Mobile-first│         │ • BEM         │         │ • Transitions │ │
│   │ • Media Query │         │ • CSS Modules │         │ • Keyframes   │ │
│   │ • Fluid Design│         │ • CSS-in-JS   │         │ • Performance │ │
│   │ • Images      │         │ • Tailwind    │         │ • Motion      │ │
│   └───────────────┘         └───────────────┘         └───────────────┘ │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Box Model

```
┌─────────────────────────────────────────────────────────────────┐
│                          BOX MODEL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                       MARGIN                             │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │                     BORDER                       │   │   │
│   │   │   ┌─────────────────────────────────────────┐   │   │   │
│   │   │   │                PADDING                   │   │   │   │
│   │   │   │   ┌─────────────────────────────────┐   │   │   │   │
│   │   │   │   │           CONTENT               │   │   │   │   │
│   │   │   │   │        width × height           │   │   │   │   │
│   │   │   │   └─────────────────────────────────┘   │   │   │   │
│   │   │   └─────────────────────────────────────────┘   │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   box-sizing: content-box  │  width = content only               │
│   box-sizing: border-box   │  width = content + padding + border │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 CSS Specificity

```
┌─────────────────────────────────────────────────────────────────┐
│                      SPECIFICITY HIERARCHY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Highest ▲                                                       │
│           │                                                       │
│   ┌───────┴───────┐                                              │
│   │  !important   │  (1,0,0,0,0) - Avoid!                        │
│   ├───────────────┤                                              │
│   │ inline style  │  (0,1,0,0,0)                                 │
│   ├───────────────┤                                              │
│   │    #id        │  (0,0,1,0,0)                                 │
│   ├───────────────┤                                              │
│   │ .class        │  (0,0,0,1,0)                                 │
│   │ [attribute]   │                                              │
│   │ :pseudo-class │                                              │
│   ├───────────────┤                                              │
│   │   element     │  (0,0,0,0,1)                                 │
│   │ ::pseudo-el   │                                              │
│   ├───────────────┤                                              │
│   │      *        │  (0,0,0,0,0)                                 │
│   └───────────────┘                                              │
│           │                                                       │
│   Lowest  ▼                                                       │
│                                                                   │
│   Same specificity → Later rule wins                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Flexbox Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLEXBOX                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CONTAINER (Parent)                                             │
│   ─────────────────                                              │
│   display: flex                                                   │
│                                                                   │
│   flex-direction:    row │ row-reverse │ column │ column-reverse │
│   flex-wrap:         nowrap │ wrap │ wrap-reverse                │
│   justify-content:   flex-start │ flex-end │ center              │
│                      space-between │ space-around │ space-evenly │
│   align-items:       stretch │ flex-start │ flex-end │ center    │
│   align-content:     (same as justify-content, for wrapped)      │
│   gap:               10px │ 10px 20px                            │
│                                                                   │
│   ┌────────────────────────────────────────────────────────┐    │
│   │  justify-content (main axis →)                          │    │
│   │  ┌──────┐ ┌──────┐ ┌──────┐                            │    │
│   │  │  1   │ │  2   │ │  3   │  ← align-items (cross axis)│    │
│   │  └──────┘ └──────┘ └──────┘                            │    │
│   └────────────────────────────────────────────────────────┘    │
│                                                                   │
│   ITEMS (Children)                                               │
│   ────────────────                                               │
│   flex: 1               │ flex: 1 1 0 (grow shrink basis)        │
│   flex-grow: 1          │ Take available space                   │
│   flex-shrink: 0        │ Don't shrink                           │
│   flex-basis: 200px     │ Initial size                           │
│   align-self: center    │ Override align-items                   │
│   order: 1              │ Change order                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔲 Grid Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                           CSS GRID                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CONTAINER                                                       │
│   ─────────                                                       │
│   display: grid                                                   │
│                                                                   │
│   grid-template-columns: 200px 1fr 1fr                           │
│   grid-template-columns: repeat(3, 1fr)                          │
│   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))    │
│                                                                   │
│   grid-template-rows: 100px auto 100px                           │
│   gap: 1rem                                                       │
│                                                                   │
│   grid-template-areas:                                           │
│       "header header header"                                      │
│       "sidebar main main"                                         │
│       "footer footer footer"                                      │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  1      2        3        4                              │   │
│   │  ┌──────┬────────┬────────┐                             │   │
│   │ 1│header│ header │ header │                              │   │
│   │  ├──────┼────────┴────────┤                             │   │
│   │ 2│ side │      main       │                              │   │
│   │  ├──────┼─────────────────┤                             │   │
│   │ 3│footer│     footer      │                              │   │
│   │  └──────┴─────────────────┘                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ITEMS                                                           │
│   ─────                                                           │
│   grid-column: 1 / 3        │ Span columns 1-3                   │
│   grid-column: span 2       │ Span 2 columns                     │
│   grid-row: 1 / 3           │ Span rows 1-3                      │
│   grid-area: header         │ Place in named area                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

```
┌─────────────────────────────────────────────────────────────────┐
│                     RESPONSIVE DESIGN                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   MOBILE-FIRST BREAKPOINTS                                       │
│   ────────────────────────                                       │
│   Base styles (mobile)                                           │
│   @media (min-width: 640px)   │ sm  - Small devices              │
│   @media (min-width: 768px)   │ md  - Tablets                    │
│   @media (min-width: 1024px)  │ lg  - Laptops                    │
│   @media (min-width: 1280px)  │ xl  - Desktops                   │
│   @media (min-width: 1536px)  │ 2xl - Large screens              │
│                                                                   │
│   UNITS                                                           │
│   ─────                                                           │
│   rem    │ Root font-size relative (recommended)                 │
│   em     │ Parent font-size relative                             │
│   vw/vh  │ Viewport width/height                                 │
│   %      │ Parent percentage                                     │
│   ch     │ Character width (for max-width)                       │
│                                                                   │
│   FLUID TYPOGRAPHY                                               │
│   ────────────────                                               │
│   font-size: clamp(1rem, 5vw, 3rem);                             │
│   │          min   preferred  max                                │
│                                                                   │
│   IMAGES                                                          │
│   ──────                                                          │
│   <img srcset="small.jpg 400w, large.jpg 800w"                   │
│        sizes="(max-width: 600px) 100vw, 50vw">                   │
│                                                                   │
│   <picture>                                                       │
│     <source media="(min-width: 768px)" srcset="desktop.jpg">     │
│     <img src="mobile.jpg" alt="...">                             │
│   </picture>                                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ CSS Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CSS ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BEM (Block Element Modifier)                                   │
│   ────────────────────────────                                   │
│   .block { }                │ Component                          │
│   .block__element { }       │ Part of component                  │
│   .block--modifier { }      │ Variation                          │
│                                                                   │
│   Example:                                                        │
│   .card { }                                                       │
│   .card__title { }                                               │
│   .card__body { }                                                │
│   .card--featured { }                                            │
│   .card__title--large { }                                        │
│                                                                   │
│   CSS MODULES                                                     │
│   ───────────                                                     │
│   import styles from './Card.module.css'                         │
│   <div className={styles.card}>                                  │
│   → Generates: .Card_card__x7f3k                                 │
│                                                                   │
│   CSS-IN-JS (Styled Components)                                  │
│   ─────────────────────────────                                  │
│   const Card = styled.div`                                       │
│     padding: 1rem;                                               │
│     background: ${props => props.primary ? 'blue' : 'white'};    │
│   `                                                               │
│                                                                   │
│   TAILWIND                                                        │
│   ────────                                                        │
│   <div class="p-4 bg-white rounded-lg shadow-md">                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Animations

```
┌─────────────────────────────────────────────────────────────────┐
│                      CSS ANIMATIONS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   TRANSITIONS                                                     │
│   ───────────                                                     │
│   transition: property duration timing-function delay;           │
│   transition: all 0.3s ease-out;                                 │
│   transition: transform 0.2s, opacity 0.3s;                      │
│                                                                   │
│   TIMING FUNCTIONS                                               │
│   ────────────────                                               │
│   ease        │ Default, slow-fast-slow                          │
│   ease-in     │ Slow start                                       │
│   ease-out    │ Slow end                                         │
│   ease-in-out │ Slow start and end                               │
│   linear      │ Constant speed                                   │
│   cubic-bezier(x1, y1, x2, y2)                                   │
│                                                                   │
│   KEYFRAME ANIMATIONS                                            │
│   ───────────────────                                            │
│   @keyframes slidein {                                           │
│     from { transform: translateX(-100%); }                       │
│     to { transform: translateX(0); }                             │
│   }                                                               │
│                                                                   │
│   animation: name duration timing-function delay iteration       │
│              direction fill-mode;                                 │
│   animation: slidein 0.5s ease-out forwards;                     │
│   animation: spin 1s linear infinite;                            │
│                                                                   │
│   PERFORMANCE (GPU-accelerated)                                  │
│   ─────────────────────────────                                  │
│   ✅ transform (translate, scale, rotate)                        │
│   ✅ opacity                                                      │
│   ❌ width, height, margin, top/left (triggers layout)           │
│                                                                   │
│   will-change: transform; │ Hint browser (use sparingly)        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Semantic HTML

```
┌─────────────────────────────────────────────────────────────────┐
│                      SEMANTIC HTML                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   STRUCTURE                                                       │
│   ─────────                                                       │
│   <header>     │ Page/section header                             │
│   <nav>        │ Navigation                                      │
│   <main>       │ Main content (one per page)                     │
│   <article>    │ Self-contained content                          │
│   <section>    │ Thematic grouping                               │
│   <aside>      │ Sidebar/tangential content                      │
│   <footer>     │ Page/section footer                             │
│                                                                   │
│   TEXT                                                            │
│   ────                                                            │
│   <h1>-<h6>    │ Headings (hierarchy matters)                    │
│   <p>          │ Paragraph                                       │
│   <strong>     │ Strong importance                               │
│   <em>         │ Stress emphasis                                 │
│   <mark>       │ Highlighted text                                │
│   <code>       │ Inline code                                     │
│   <blockquote> │ Block quotation                                 │
│   <time>       │ Date/time (datetime attribute)                  │
│                                                                   │
│   MEDIA                                                           │
│   ─────                                                           │
│   <figure>     │ Self-contained content                          │
│   <figcaption> │ Figure caption                                  │
│   <picture>    │ Art direction images                            │
│   <img alt=""> │ Always include alt text                         │
│                                                                   │
│   FORMS                                                           │
│   ─────                                                           │
│   <form>       │ Form container                                  │
│   <fieldset>   │ Group related inputs                            │
│   <legend>     │ Fieldset caption                                │
│   <label>      │ Input label (for="id")                          │
│   <input>      │ Form input                                      │
│   <button>     │ Interactive button                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ♿ Accessibility Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                      ACCESSIBILITY                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   LANDMARKS                                                       │
│   ─────────                                                       │
│   <header> = role="banner"                                       │
│   <nav> = role="navigation"                                      │
│   <main> = role="main"                                           │
│   <aside> = role="complementary"                                 │
│   <footer> = role="contentinfo"                                  │
│                                                                   │
│   ARIA ATTRIBUTES                                                │
│   ───────────────                                                │
│   aria-label="..."        │ Label for screen readers             │
│   aria-labelledby="id"    │ Reference visible label              │
│   aria-describedby="id"   │ Reference description                │
│   aria-hidden="true"      │ Hide from screen readers             │
│   aria-expanded="false"   │ Expandable state                     │
│   aria-live="polite"      │ Announce changes                     │
│                                                                   │
│   FOCUS                                                           │
│   ─────                                                           │
│   :focus { outline: 2px solid blue; }                            │
│   :focus-visible { }      │ Keyboard focus only                  │
│   tabindex="0"            │ Make focusable                       │
│   tabindex="-1"           │ Programmatic focus only              │
│                                                                   │
│   COLOR CONTRAST                                                  │
│   ──────────────                                                  │
│   Normal text: 4.5:1 ratio (AA)                                  │
│   Large text: 3:1 ratio (AA)                                     │
│   Enhanced: 7:1 / 4.5:1 (AAA)                                    │
│                                                                   │
│   REDUCED MOTION                                                  │
│   ──────────────                                                  │
│   @media (prefers-reduced-motion: reduce) {                      │
│     * { animation: none !important; }                            │
│   }                                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Interview Quick Answers

| Topic | Question | Quick Answer |
|-------|----------|--------------|
| Box Model | content-box vs border-box? | content-box: width = content only; border-box: width includes padding + border |
| Specificity | ID vs Class? | ID (0,1,0,0) > Class (0,0,1,0). Avoid IDs for styling |
| Flexbox | justify-content vs align-items? | justify = main axis, align = cross axis |
| Grid | fr unit? | Fraction of available space |
| Responsive | Mobile-first? | Base styles for mobile, add with min-width |
| BEM | Double underscore vs hyphen? | __ = element, -- = modifier |
| Animation | Performance? | Use transform/opacity only (GPU) |
| Accessibility | aria-label vs aria-labelledby? | label = inline text, labelledby = reference ID |

---

> **Quay lại:** [README.md](./mindmap-foundations.md) - HTML/CSS Overview
