# WCAG Fundamentals - Web Content Accessibility Guidelines

> WCAG là international standard cho web accessibility. Understand principles, levels, và key success criteria.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    WCAG 2.2 STRUCTURE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   4 PRINCIPLES (POUR)                                            │
│        │                                                         │
│        ├─▶ Perceivable (1.x)                                    │
│        ├─▶ Operable (2.x)                                       │
│        ├─▶ Understandable (3.x)                                 │
│        └─▶ Robust (4.x)                                         │
│                                                                   │
│   13 GUIDELINES                                                  │
│        │                                                         │
│        └─▶ Under each principle                                 │
│                                                                   │
│   78 SUCCESS CRITERIA                                            │
│        │                                                         │
│        └─▶ Testable requirements (A, AA, AAA)                   │
│                                                                   │
│   CONFORMANCE LEVELS:                                            │
│   Level A   ──▶ Must have (critical barriers)                   │
│   Level AA  ──▶ Should have (standard target)                   │
│   Level AAA ──▶ Nice to have (enhanced)                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 POUR Principles

### 1. Perceivable

```
Users must be able to perceive the information being presented.

GUIDELINES:
─────────────────────────────────────────────────────────────────
1.1 Text Alternatives
    • Alt text for images
    • Captions for audio
    • Text alternatives for non-text content

1.2 Time-based Media
    • Captions for video
    • Audio descriptions
    • Transcripts

1.3 Adaptable
    • Content can be presented in different ways
    • Meaningful sequence
    • Sensory characteristics

1.4 Distinguishable
    • Use of color (not sole means)
    • Contrast ratios
    • Resize text
    • Text spacing
```

```html
<!-- Text Alternatives Examples -->

<!-- ❌ Bad - No alt text -->
<img src="chart.png">

<!-- ❌ Bad - Redundant -->
<img src="logo.png" alt="Image of company logo">

<!-- ✅ Good - Descriptive -->
<img src="chart.png" alt="Bar chart showing Q3 sales increased 25%">

<!-- ✅ Good - Decorative (empty alt) -->
<img src="decorative-line.png" alt="">

<!-- ✅ Good - Complex image with extended description -->
<figure>
    <img src="infographic.png" alt="Infographic about climate change"
         aria-describedby="infographic-desc">
    <figcaption id="infographic-desc">
        Detailed description of the infographic...
    </figcaption>
</figure>
```

### 2. Operable

```
User interface components must be operable.

GUIDELINES:
─────────────────────────────────────────────────────────────────
2.1 Keyboard Accessible
    • All functionality available via keyboard
    • No keyboard traps
    • Character key shortcuts

2.2 Enough Time
    • Timing adjustable
    • Pause, stop, hide moving content

2.3 Seizures and Physical Reactions
    • No flashing content (>3 flashes/second)

2.4 Navigable
    • Skip links
    • Page titles
    • Focus order
    • Link purpose

2.5 Input Modalities
    • Pointer gestures have alternatives
    • Target size (44x44px minimum)
```

```html
<!-- Keyboard Accessible Examples -->

<!-- ❌ Bad - Click only -->
<div onclick="handleAction()">Click me</div>

<!-- ✅ Good - Keyboard accessible -->
<button onclick="handleAction()">Click me</button>

<!-- ✅ Good - Custom element made accessible -->
<div role="button"
     tabindex="0"
     onclick="handleAction()"
     onkeydown="handleKeydown(event)">
    Click me
</div>

<script>
function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleAction();
    }
}
</script>

<!-- Skip Link -->
<a href="#main-content" class="skip-link">
    Skip to main content
</a>

<style>
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background: #000;
    color: #fff;
    z-index: 100;
}
.skip-link:focus {
    top: 0;
}
</style>
```

### 3. Understandable

```
Information and operation must be understandable.

GUIDELINES:
─────────────────────────────────────────────────────────────────
3.1 Readable
    • Language of page
    • Language of parts
    • Unusual words

3.2 Predictable
    • On Focus (no unexpected changes)
    • On Input (no unexpected changes)
    • Consistent navigation
    • Consistent identification

3.3 Input Assistance
    • Error identification
    • Labels or instructions
    • Error suggestion
    • Error prevention (for legal, financial)
```

```html
<!-- Understandable Examples -->

<!-- Language -->
<html lang="en">
<p>This is English text.</p>
<p lang="vi">Đây là tiếng Việt.</p>

<!-- Form with Error Handling -->
<form>
    <label for="email">Email (required)</label>
    <input type="email" id="email"
           aria-describedby="email-error"
           aria-invalid="true">
    <span id="email-error" role="alert">
        Please enter a valid email address
    </span>
</form>

<!-- Consistent Navigation -->
<!-- Keep navigation in same order on all pages -->
<nav>
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
</nav>
```

### 4. Robust

```
Content must be robust enough for assistive technologies.

GUIDELINES:
─────────────────────────────────────────────────────────────────
4.1 Compatible
    • Parsing (valid HTML)
    • Name, Role, Value (for custom components)
    • Status messages (announce dynamically)
```

```html
<!-- Robust Examples -->

<!-- ❌ Bad - Invalid HTML -->
<div id="header">
    <div id="header">  <!-- Duplicate ID -->
</div>

<!-- ✅ Good - Valid HTML -->
<header id="header">
    <nav id="main-nav">
    </nav>
</header>

<!-- Custom component with proper semantics -->
<div role="slider"
     aria-valuenow="50"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Volume"
     tabindex="0">
</div>

<!-- Status message for screen readers -->
<div role="status" aria-live="polite">
    3 items added to cart
</div>
```

---

## 📊 Key Success Criteria (Level AA)

### Color Contrast

```css
/* Minimum contrast ratios */

/* Normal text (<24px or <19px bold): 4.5:1 */
.normal-text {
    color: #595959; /* On white: 4.6:1 ✅ */
    color: #767676; /* On white: 4.5:1 ✅ (minimum) */
    color: #888888; /* On white: 3.5:1 ❌ */
}

/* Large text (≥24px or ≥19px bold): 3:1 */
.large-text {
    font-size: 24px;
    color: #949494; /* On white: 3:1 ✅ */
}

/* Non-text (icons, borders): 3:1 */
.icon {
    color: #949494; /* 3:1 minimum ✅ */
}

/* Tools: WebAIM Contrast Checker, Stark */
```

### Focus Visible

```css
/* Default focus - don't remove! */
:focus {
    outline: 2px solid blue;
    outline-offset: 2px;
}

/* Custom focus that meets requirements */
:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
    border-radius: 2px;
}

/* High contrast focus */
button:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 3px;
    box-shadow: 0 0 0 6px white, 0 0 0 9px currentColor;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What does WCAG stand for?**

A: Web Content Accessibility Guidelines - international standard for making web content accessible to people with disabilities.

**Q: What is the difference between Level A and AA?**

A: Level A is minimum accessibility (critical barriers). Level AA is standard target (recommended for most websites). AA includes all A criteria plus additional requirements like color contrast.

### 🟡 Mid-level

**Q: What are the POUR principles?**

A:
- **Perceivable**: Content can be perceived (alt text, captions)
- **Operable**: Interface is operable (keyboard, focus)
- **Understandable**: Content is understandable (language, errors)
- **Robust**: Works with assistive technologies

**Q: What is the required color contrast ratio?**

A: 4.5:1 for normal text, 3:1 for large text (24px+ or 19px+ bold), 3:1 for non-text elements.

### 🔴 Senior

**Q: How would you implement WCAG AA compliance in existing project?**

A:
```
1. Audit:
   - Run automated tools (axe, Lighthouse)
   - Manual testing with screen reader
   - Keyboard navigation test

2. Prioritize:
   - Fix Level A issues first
   - Then Level AA issues
   - Focus on high-impact pages

3. Common fixes:
   - Add alt text to images
   - Ensure color contrast
   - Add form labels
   - Fix heading hierarchy
   - Add skip links

4. Prevention:
   - ESLint plugin for JSX a11y
   - Component library with built-in a11y
   - Automated testing in CI
```

---

## 📚 Active Recall

1. [ ] POUR principles (4)
2. [ ] Conformance levels và targets
3. [ ] Color contrast ratios
4. [ ] Key success criteria for forms
5. [ ] Common Level A violations

---

> **Tiếp theo:** [02-aria-attributes.md](./02-aria-attributes.md) - ARIA Attributes
