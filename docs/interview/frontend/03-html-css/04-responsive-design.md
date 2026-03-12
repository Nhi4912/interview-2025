# Responsive Design - Mobile-First Approach

> Responsive design là kỹ năng bắt buộc cho modern web. Mobile-first approach là best practice.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                 RESPONSIVE DESIGN APPROACH                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   MOBILE-FIRST                    DESKTOP-FIRST                  │
│   ┌─────────────────────┐        ┌─────────────────────┐        │
│   │ Start with mobile   │        │ Start with desktop  │        │
│   │ Add styles for      │        │ Override for        │        │
│   │ larger screens      │        │ smaller screens     │        │
│   │                     │        │                     │        │
│   │ min-width queries   │        │ max-width queries   │        │
│   │ (recommended)       │        │ (legacy approach)   │        │
│   └─────────────────────┘        └─────────────────────┘        │
│                                                                   │
│   Mobile-First Benefits:                                         │
│   • Forces focus on core content                                │
│   • Better performance on mobile                                │
│   • Progressive enhancement                                      │
│   • Aligns with mobile-majority traffic                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Media Queries

### Basic Syntax

```css
/* Mobile-first (min-width) - RECOMMENDED */
.container {
    width: 100%;
    padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        padding: 2rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 960px;
    }
}

/* Large desktop */
@media (min-width: 1280px) {
    .container {
        max-width: 1200px;
    }
}
```

### Common Breakpoints

```css
/* Standard breakpoints */
:root {
    --breakpoint-sm: 640px;   /* Small devices */
    --breakpoint-md: 768px;   /* Tablets */
    --breakpoint-lg: 1024px;  /* Laptops */
    --breakpoint-xl: 1280px;  /* Desktops */
    --breakpoint-2xl: 1536px; /* Large screens */
}

/* Tailwind-style breakpoints */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px */
```

### Media Query Features

```css
/* Width-based */
@media (min-width: 768px) { }
@media (max-width: 767px) { }
@media (min-width: 768px) and (max-width: 1023px) { }

/* Orientation */
@media (orientation: portrait) { }
@media (orientation: landscape) { }

/* Aspect ratio */
@media (aspect-ratio: 16/9) { }
@media (min-aspect-ratio: 1/1) { }

/* Display quality */
@media (min-resolution: 2dppx) { } /* Retina displays */
@media (-webkit-min-device-pixel-ratio: 2) { }

/* Hover capability */
@media (hover: hover) { } /* Has hover capability */
@media (hover: none) { }  /* Touch devices */

/* Pointer precision */
@media (pointer: fine) { }   /* Mouse */
@media (pointer: coarse) { } /* Touch */

/* Color scheme */
@media (prefers-color-scheme: dark) { }
@media (prefers-color-scheme: light) { }

/* Motion preferences */
@media (prefers-reduced-motion: reduce) { }

/* Combine multiple features */
@media (min-width: 768px) and (hover: hover) {
    /* Desktop with mouse */
}
```

---

## 📐 Responsive Units

### Viewport Units

```css
/* Viewport width/height */
.hero {
    width: 100vw;      /* 100% of viewport width */
    height: 100vh;     /* 100% of viewport height */
}

/* Min/max viewport */
.element {
    width: 50vmin;     /* 50% of smaller dimension */
    height: 50vmax;    /* 50% of larger dimension */
}

/* New viewport units (CSS Level 4) */
.header {
    height: 100dvh;    /* Dynamic viewport height */
    /* Accounts for mobile browser UI */
}

.sidebar {
    height: 100svh;    /* Small viewport height */
    /* Minimum viewport (browser UI visible) */
}

.fullscreen {
    height: 100lvh;    /* Large viewport height */
    /* Maximum viewport (browser UI hidden) */
}
```

### Relative Units

```css
/* em - relative to parent font-size */
.parent {
    font-size: 16px;
}
.child {
    font-size: 1.5em;   /* 24px */
    padding: 1em;       /* 24px (uses own font-size) */
}

/* rem - relative to root font-size */
html {
    font-size: 16px;
}
.element {
    font-size: 1.5rem;  /* 24px */
    padding: 1rem;      /* 16px (always root size) */
}

/* Percentage */
.child {
    width: 50%;         /* 50% of parent width */
}

/* ch - width of "0" character */
.readable {
    max-width: 65ch;    /* ~65 characters per line */
}
```

### clamp() for Fluid Typography

```css
/* clamp(min, preferred, max) */
h1 {
    /* Min 1.5rem, preferred 5vw, max 3rem */
    font-size: clamp(1.5rem, 5vw, 3rem);
}

p {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
}

.container {
    /* Fluid width with min/max */
    width: clamp(320px, 90%, 1200px);
}

/* Fluid spacing */
.section {
    padding: clamp(1rem, 5vw, 4rem);
}
```

---

## 🖼️ Responsive Images

### srcset and sizes

```html
<!-- Resolution switching -->
<img
    src="image-800.jpg"
    srcset="image-400.jpg 400w,
            image-800.jpg 800w,
            image-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw,
           (max-width: 900px) 50vw,
           33vw"
    alt="Description"
>

<!-- Pixel density -->
<img
    src="logo.png"
    srcset="logo.png 1x,
            logo@2x.png 2x,
            logo@3x.png 3x"
    alt="Logo"
>
```

### Picture Element

```html
<!-- Art direction -->
<picture>
    <source
        media="(min-width: 1024px)"
        srcset="hero-desktop.jpg"
    >
    <source
        media="(min-width: 768px)"
        srcset="hero-tablet.jpg"
    >
    <img src="hero-mobile.jpg" alt="Hero image">
</picture>

<!-- Format selection -->
<picture>
    <source type="image/avif" srcset="image.avif">
    <source type="image/webp" srcset="image.webp">
    <img src="image.jpg" alt="Description">
</picture>

<!-- Combined -->
<picture>
    <source
        media="(min-width: 1024px)"
        type="image/webp"
        srcset="hero-desktop.webp"
    >
    <source
        media="(min-width: 1024px)"
        srcset="hero-desktop.jpg"
    >
    <source
        type="image/webp"
        srcset="hero-mobile.webp"
    >
    <img src="hero-mobile.jpg" alt="Hero">
</picture>
```

### CSS Background Images

```css
/* Responsive background */
.hero {
    background-image: url('hero-mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('hero-tablet.jpg');
    }
}

@media (min-width: 1024px) {
    .hero {
        background-image: url('hero-desktop.jpg');
    }
}

/* Retina displays */
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 2dppx) {
    .logo {
        background-image: url('logo@2x.png');
        background-size: 100px 50px;
    }
}

/* image-set() */
.hero {
    background-image: image-set(
        url('hero.webp') type('image/webp'),
        url('hero.jpg') type('image/jpeg')
    );
}
```

---

## 📊 Responsive Layout Patterns

### Fluid Container

```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 0 2rem;
    }
}
```

### Responsive Grid

```css
/* Auto-fit grid */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

/* Explicit breakpoint grid */
.grid-explicit {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) {
    .grid-explicit {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}

@media (min-width: 1024px) {
    .grid-explicit {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }
}
```

### Stack → Sidebar

```css
.layout {
    display: flex;
    flex-direction: column;
}

.main { flex: 1; }
.sidebar { order: -1; } /* Sidebar first on mobile */

@media (min-width: 768px) {
    .layout {
        flex-direction: row;
    }

    .sidebar {
        width: 250px;
        order: 0; /* Reset order */
    }
}
```

### Responsive Navigation

```css
/* Mobile nav */
.nav {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
}

.nav.open {
    display: flex;
}

.nav-toggle {
    display: block;
}

/* Desktop nav */
@media (min-width: 768px) {
    .nav {
        display: flex;
        position: static;
        flex-direction: row;
        padding: 0;
        background: transparent;
    }

    .nav-toggle {
        display: none;
    }
}
```

---

## 🎨 Responsive Typography

### Fluid Type Scale

```css
:root {
    /* Base size */
    --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);

    /* Type scale */
    --font-size-sm: clamp(0.875rem, 0.85rem + 0.15vw, 0.95rem);
    --font-size-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
    --font-size-xl: clamp(1.25rem, 1rem + 1vw, 1.5rem);
    --font-size-2xl: clamp(1.5rem, 1rem + 2vw, 2rem);
    --font-size-3xl: clamp(2rem, 1rem + 3vw, 3rem);
    --font-size-4xl: clamp(2.5rem, 1rem + 5vw, 4rem);
}

body {
    font-size: var(--font-size-base);
    line-height: 1.6;
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
```

### Responsive Line Length

```css
.prose {
    max-width: 65ch; /* Optimal line length */
}

/* Tighter on mobile */
@media (max-width: 640px) {
    .prose {
        max-width: 100%;
    }
}
```

---

## 📱 Touch-Friendly Design

### Touch Targets

```css
/* Minimum touch target size: 44x44px (WCAG) */
.button,
.link,
.interactive {
    min-height: 44px;
    min-width: 44px;
    padding: 0.75rem 1rem;
}

/* Spacing between touch targets */
.nav-item {
    margin: 0.5rem 0;
}

/* Touch-specific styles */
@media (pointer: coarse) {
    .button {
        padding: 1rem 1.5rem;
    }

    .dropdown-item {
        padding: 1rem;
    }
}
```

### Hover States

```css
/* Only apply hover on devices that support it */
@media (hover: hover) {
    .button:hover {
        background-color: var(--color-primary-dark);
    }

    .link:hover {
        text-decoration: underline;
    }
}

/* Active state for touch */
.button:active {
    background-color: var(--color-primary-dark);
}
```

---

## 🔧 Container Queries

```css
/* Modern container queries */
.card-container {
    container-type: inline-size;
    container-name: card;
}

.card {
    display: flex;
    flex-direction: column;
}

/* Query container width instead of viewport */
@container card (min-width: 400px) {
    .card {
        flex-direction: row;
    }

    .card-image {
        width: 40%;
    }
}

/* Shorthand */
.container {
    container: card / inline-size;
}

/* Container query units */
.card-title {
    font-size: clamp(1rem, 5cqw, 1.5rem); /* cqw = container query width */
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Mobile-first là gì?**

A: Thiết kế và code cho mobile trước, sau đó thêm styles cho màn hình lớn hơn bằng min-width media queries. Benefits: focus on core content, better performance, progressive enhancement.

**Q: Khi nào dùng em vs rem?**

A:
- `rem`: Relative to root font-size, consistent across components. Dùng cho font-size, spacing, layout.
- `em`: Relative to parent font-size. Dùng khi muốn scale theo context (padding của button scale với font-size).

### 🟡 Mid-level

**Q: clamp() hoạt động như thế nào?**

A: `clamp(min, preferred, max)` - returns preferred value clamped between min and max. Ví dụ: `font-size: clamp(1rem, 5vw, 3rem)` - min 1rem, preferred 5vw, max 3rem. Creates fluid typography without media queries.

**Q: srcset vs picture?**

A:
- `srcset`: Resolution switching - same image, different sizes. Browser chooses.
- `picture`: Art direction - different images for different contexts. Developer controls.

### 🔴 Senior

**Q: Container queries vs media queries?**

A:
- Media queries: Based on viewport size
- Container queries: Based on parent container size

Container queries better for component-based design - component responds to its container, not viewport. More reusable, works in any layout context.

**Q: Design fluid typography system**

```css
:root {
    --fluid-min-width: 320;
    --fluid-max-width: 1200;

    /* Fluid scale generator */
    --fluid-screen: 100vw;
    --fluid-bp: calc(
        (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
        (var(--fluid-max-width) - var(--fluid-min-width))
    );
}

/* Apply to each size */
--step-0: clamp(1rem, calc(0.875rem + 0.5vw), 1.125rem);
```

---

## 📚 Active Recall

1. [ ] List 5 common breakpoints
2. [ ] Difference between vw, vh, vmin, vmax
3. [ ] When to use picture vs srcset
4. [ ] Container queries syntax
5. [ ] Touch target minimum size (WCAG)

---

> **Tiếp theo:** [05-css-architecture.md](./05-css-architecture.md) - CSS Architecture Patterns
