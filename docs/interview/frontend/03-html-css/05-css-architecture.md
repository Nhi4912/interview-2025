# CSS Architecture - Scalable Styling Patterns

> CSS Architecture quan trọng cho maintainability. Hiểu BEM, CSS Modules, CSS-in-JS để chọn đúng approach.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSS ARCHITECTURE OPTIONS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   METHODOLOGY        SCOPING           TOOLING                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ BEM          │  │ CSS Modules  │  │ PostCSS      │          │
│   │ OOCSS        │  │ Shadow DOM   │  │ Sass/Less    │          │
│   │ SMACSS       │  │ CSS-in-JS    │  │ Tailwind     │          │
│   │ ITCSS        │  │ Scoped CSS   │  │ Styled-comp  │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│   Goal: Maintainable, scalable, predictable CSS                 │
│   - Avoid specificity wars                                       │
│   - Prevent style leakage                                        │
│   - Enable component reusability                                 │
│   - Support team collaboration                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 BEM (Block Element Modifier)

### Naming Convention

```css
/* Block: Standalone component */
.card { }

/* Element: Part of a block (double underscore) */
.card__header { }
.card__body { }
.card__footer { }
.card__title { }
.card__image { }

/* Modifier: Variation of block/element (double hyphen) */
.card--featured { }
.card--compact { }
.card__title--large { }
.card__button--disabled { }
```

### BEM Example

```html
<article class="card card--featured">
    <header class="card__header">
        <img class="card__image" src="..." alt="...">
    </header>
    <div class="card__body">
        <h2 class="card__title card__title--large">Title</h2>
        <p class="card__text">Content...</p>
    </div>
    <footer class="card__footer">
        <button class="card__button">Read More</button>
        <button class="card__button card__button--disabled">Share</button>
    </footer>
</article>
```

```css
/* Block */
.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}

/* Block modifier */
.card--featured {
    border-color: gold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card--compact {
    padding: 0.5rem;
}

/* Elements */
.card__header {
    position: relative;
}

.card__image {
    width: 100%;
    height: auto;
    display: block;
}

.card__body {
    padding: 1rem;
}

.card__title {
    font-size: 1.25rem;
    margin: 0 0 0.5rem;
}

/* Element modifier */
.card__title--large {
    font-size: 1.5rem;
}

.card__text {
    color: #666;
    line-height: 1.6;
}

.card__footer {
    padding: 1rem;
    display: flex;
    gap: 0.5rem;
}

.card__button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.card__button--disabled {
    background: #ccc;
    cursor: not-allowed;
}
```

### BEM with Sass

```scss
.card {
    border: 1px solid #ddd;
    border-radius: 8px;

    &--featured {
        border-color: gold;
    }

    &--compact {
        padding: 0.5rem;
    }

    &__header {
        position: relative;
    }

    &__image {
        width: 100%;
    }

    &__body {
        padding: 1rem;
    }

    &__title {
        font-size: 1.25rem;

        &--large {
            font-size: 1.5rem;
        }
    }

    &__button {
        padding: 0.5rem 1rem;

        &--disabled {
            background: #ccc;
        }
    }
}
```

---

## 📁 CSS Modules

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSS MODULES WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. Write CSS                    2. Import in JS                │
│   ┌────────────────────┐         ┌────────────────────┐         │
│   │ Card.module.css    │         │ Card.jsx           │         │
│   │                    │    →    │                    │         │
│   │ .card { ... }      │         │ import styles      │         │
│   │ .title { ... }     │         │   from './Card.    │         │
│   │                    │         │   module.css'      │         │
│   └────────────────────┘         └────────────────────┘         │
│                                                                   │
│   3. Compiled Output (unique class names)                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ .Card_card__3xk2a { ... }                                │   │
│   │ .Card_title__7yz1b { ... }                               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   Benefits: Local scope, no conflicts, composition               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Usage

```css
/* Card.module.css */
.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
}

.title {
    font-size: 1.25rem;
    font-weight: bold;
}

.featured {
    border-color: gold;
}

.button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
}
```

```jsx
// Card.jsx
import styles from './Card.module.css';

function Card({ title, featured }) {
    return (
        <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.button}>Click</button>
        </article>
    );
}

// Or with classnames library
import cn from 'classnames';

function Card({ title, featured }) {
    return (
        <article className={cn(styles.card, { [styles.featured]: featured })}>
            <h2 className={styles.title}>{title}</h2>
        </article>
    );
}
```

### Composition

```css
/* base.module.css */
.button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

/* Card.module.css */
.primaryButton {
    composes: button from './base.module.css';
    background: #007bff;
    color: white;
}

.secondaryButton {
    composes: button from './base.module.css';
    background: transparent;
    border: 1px solid #007bff;
    color: #007bff;
}
```

### Global Styles

```css
/* Card.module.css */
.card {
    /* Local styles */
    padding: 1rem;
}

:global(.dark-theme) .card {
    background: #333;
    color: white;
}

.card :global(.icon) {
    /* Target global .icon inside local .card */
    width: 24px;
}
```

---

## 💅 CSS-in-JS

### Styled Components

```jsx
import styled from 'styled-components';

// Basic styled component
const Card = styled.article`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
`;

const Title = styled.h2`
    font-size: 1.25rem;
    font-weight: bold;
    color: ${props => props.color || '#333'};
`;

// With props
const Button = styled.button`
    padding: 0.5rem 1rem;
    background: ${props => props.primary ? '#007bff' : 'transparent'};
    color: ${props => props.primary ? 'white' : '#007bff'};
    border: ${props => props.primary ? 'none' : '1px solid #007bff'};
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

// Extending styles
const FeaturedCard = styled(Card)`
    border-color: gold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

// Usage
function App() {
    return (
        <Card>
            <Title color="blue">Hello</Title>
            <Button primary>Click Me</Button>
            <Button>Cancel</Button>
        </Card>
    );
}
```

### Emotion

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// Object styles
const cardStyles = css({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
});

// Template literal styles
const titleStyles = css`
    font-size: 1.25rem;
    font-weight: bold;
`;

// Styled component
const Button = styled.button`
    padding: 0.5rem 1rem;
    background: ${props => props.primary ? '#007bff' : 'transparent'};
`;

// Usage
function Card() {
    return (
        <article css={cardStyles}>
            <h2 css={titleStyles}>Title</h2>
            <Button primary>Click</Button>
        </article>
    );
}

// Composition
const combined = css`
    ${cardStyles};
    background: #f5f5f5;
`;
```

### Theming

```jsx
import { ThemeProvider } from 'styled-components';

const theme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
    },
    spacing: {
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
    },
    borderRadius: '8px',
};

const Button = styled.button`
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    background: ${props => props.theme.colors.primary};
    border-radius: ${props => props.theme.borderRadius};
`;

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Button>Themed Button</Button>
        </ThemeProvider>
    );
}
```

---

## 🌊 Tailwind CSS

### Utility-First Approach

```html
<!-- Traditional CSS -->
<button class="btn btn-primary btn-lg">Click Me</button>

<!-- Tailwind -->
<button class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 focus:outline-none focus:ring-2
               focus:ring-blue-400 focus:ring-offset-2">
    Click Me
</button>
```

### Component Extraction

```jsx
// Extract to component
function Button({ children, variant = 'primary', size = 'md' }) {
    const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2';

    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
            {children}
        </button>
    );
}
```

### @apply Directive

```css
/* styles.css */
@layer components {
    .btn {
        @apply px-4 py-2 font-semibold rounded-lg;
    }

    .btn-primary {
        @apply bg-blue-500 text-white hover:bg-blue-600;
    }

    .card {
        @apply border border-gray-200 rounded-lg p-4 shadow-sm;
    }
}

@layer utilities {
    .text-shadow {
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f9ff',
                    500: '#0ea5e9',
                    900: '#0c4a6e',
                },
            },
            spacing: {
                '72': '18rem',
                '84': '21rem',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
};
```

---

## 🏗️ CSS Architecture Patterns

### ITCSS (Inverted Triangle CSS)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ITCSS LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│        Specificity →                                             │
│        Explicitness →                                            │
│        Reach ←                                                   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  1. SETTINGS  - Variables, config (no CSS output)       │   │
│   ├─────────────────────────────────────────────────────┬───┤   │
│   │  2. TOOLS     - Mixins, functions (no CSS output)   │   │   │
│   ├─────────────────────────────────────────────────┬───┴───┤   │
│   │  3. GENERIC   - Reset, normalize                │       │   │
│   ├─────────────────────────────────────────────┬───┴───────┤   │
│   │  4. ELEMENTS  - Bare HTML elements          │           │   │
│   ├─────────────────────────────────────────┬───┴───────────┤   │
│   │  5. OBJECTS   - Layout patterns         │               │   │
│   ├─────────────────────────────────────┬───┴───────────────┤   │
│   │  6. COMPONENTS - UI components      │                   │   │
│   ├─────────────────────────────────┬───┴───────────────────┤   │
│   │  7. UTILITIES  - Helpers, overrides                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

```scss
// main.scss - Import order matters!

// 1. Settings
@import 'settings/variables';
@import 'settings/colors';
@import 'settings/typography';

// 2. Tools
@import 'tools/mixins';
@import 'tools/functions';

// 3. Generic
@import 'generic/normalize';
@import 'generic/reset';
@import 'generic/box-sizing';

// 4. Elements
@import 'elements/headings';
@import 'elements/links';
@import 'elements/forms';

// 5. Objects
@import 'objects/container';
@import 'objects/grid';
@import 'objects/media';

// 6. Components
@import 'components/button';
@import 'components/card';
@import 'components/navbar';

// 7. Utilities
@import 'utilities/spacing';
@import 'utilities/visibility';
@import 'utilities/text';
```

---

## 🔄 Comparison

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| BEM | Simple, no tooling | Verbose class names | Teams, large projects |
| CSS Modules | Local scope, simple | Build step required | React/Vue apps |
| Styled Components | Dynamic, colocated | Runtime cost, learning curve | React apps |
| Tailwind | Fast, consistent | Large HTML, learning curve | Rapid development |

### When to Use What

```
Small project, no framework    → Vanilla CSS + BEM
React/Vue with existing CSS   → CSS Modules
React with heavy theming      → Styled Components
Rapid prototyping            → Tailwind
Large team, design system    → ITCSS + BEM or Tailwind
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: BEM là gì?**

A: Block Element Modifier - naming convention cho CSS. Block là component độc lập, Element là thành phần của block (double underscore), Modifier là variation (double hyphen). Ví dụ: `.card__title--large`.

**Q: CSS Modules hoạt động như thế nào?**

A: CSS Modules tự động scope class names bằng cách generate unique names at build time. Import CSS file as module, use object properties as class names.

### 🟡 Mid-level

**Q: So sánh CSS-in-JS vs CSS Modules**

A:
- CSS Modules: Local scope, simpler, no runtime cost, less dynamic
- CSS-in-JS: Dynamic styling với props, colocated với component, runtime cost, easier theming

**Q: Tailwind pros/cons?**

A:
- Pros: Fast development, consistent design, small production CSS, no naming decisions
- Cons: Long class strings, learning curve, harder to customize complex styles, can lead to inconsistency

### 🔴 Senior

**Q: Design scalable CSS architecture**

A: Apply ITCSS principles:
1. Settings layer (variables)
2. Generic layer (reset/normalize)
3. Elements layer (base HTML)
4. Objects layer (layout patterns)
5. Components layer (UI components)
6. Utilities layer (helpers)

Combine with BEM for naming, CSS Modules for scoping.

---

## 📚 Active Recall

1. [ ] Explain BEM naming: Block, Element, Modifier
2. [ ] How does CSS Modules generate unique class names?
3. [ ] ITCSS layers in order
4. [ ] Styled Components theming pattern
5. [ ] When to use @apply in Tailwind

---

> **Tiếp theo:** [06-animations-transitions.md](./06-animations-transitions.md) - CSS Animations
