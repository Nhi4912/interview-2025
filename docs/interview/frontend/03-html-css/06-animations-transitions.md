# CSS Animations & Transitions - Motion Design

> Animations và transitions tạo UX tốt hơn. Hiểu performance implications là critical.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│               TRANSITIONS vs ANIMATIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   TRANSITIONS                      ANIMATIONS                    │
│   ┌─────────────────────┐         ┌─────────────────────┐       │
│   │ • From A → B only   │         │ • Multiple keyframes │       │
│   │ • Triggered by      │         │ • Auto-play or       │       │
│   │   state change      │         │   triggered          │       │
│   │ • Simpler syntax    │         │ • More control       │       │
│   │ • Interactive       │         │ • Looping            │       │
│   └─────────────────────┘         └─────────────────────┘       │
│                                                                   │
│   Use transitions for:   Use animations for:                     │
│   • Hover effects        • Loading spinners                      │
│   • Focus states         • Attention grabbers                    │
│   • Toggle states        • Complex sequences                     │
│   • Simple interactions  • Decorative motion                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 CSS Transitions

### Basic Syntax

```css
/* Longhand */
.button {
    transition-property: background-color, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
    transition-delay: 0s;
}

/* Shorthand */
.button {
    /* property duration timing-function delay */
    transition: background-color 0.3s ease-out,
                transform 0.2s ease-in-out 0.1s;
}

/* All properties */
.card {
    transition: all 0.3s ease;
}
```

### Common Patterns

```css
/* Hover effect */
.button {
    background: #007bff;
    transform: translateY(0);
    transition: background 0.2s, transform 0.2s;
}

.button:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

/* Focus ring */
.input {
    border: 2px solid #ddd;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Expand on hover */
.card {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

### Timing Functions

```css
/* Built-in functions */
.ease { transition-timing-function: ease; }          /* Default */
.ease-in { transition-timing-function: ease-in; }    /* Start slow */
.ease-out { transition-timing-function: ease-out; }  /* End slow */
.ease-in-out { transition-timing-function: ease-in-out; }
.linear { transition-timing-function: linear; }      /* Constant speed */

/* Custom cubic-bezier */
.custom {
    /* cubic-bezier(x1, y1, x2, y2) */
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Common custom curves */
:root {
    --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
    --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
    --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-in-out-back: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Steps for sprite animations */
.sprite {
    transition-timing-function: steps(6, end);
}
```

### Transition Events (JavaScript)

```javascript
const element = document.querySelector('.card');

element.addEventListener('transitionstart', (e) => {
    console.log('Started:', e.propertyName);
});

element.addEventListener('transitionend', (e) => {
    console.log('Ended:', e.propertyName);
    // Clean up or trigger next action
});

element.addEventListener('transitioncancel', (e) => {
    console.log('Cancelled:', e.propertyName);
});
```

---

## 🎬 CSS Animations

### Keyframes Syntax

```css
/* Define animation */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* With percentages */
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
}

/* Multiple steps */
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    25% {
        transform: scale(1.1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1);
        opacity: 1;
    }
    75% {
        transform: scale(1.05);
        opacity: 0.9;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
```

### Animation Properties

```css
.element {
    /* Longhand */
    animation-name: slideIn;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-iteration-count: 1;      /* or 'infinite' */
    animation-direction: normal;        /* or reverse, alternate, alternate-reverse */
    animation-fill-mode: forwards;      /* none, forwards, backwards, both */
    animation-play-state: running;      /* or 'paused' */

    /* Shorthand */
    /* name duration timing-function delay iteration direction fill-mode */
    animation: slideIn 0.5s ease-out 0s 1 normal forwards;

    /* Multiple animations */
    animation: slideIn 0.5s ease-out,
               fadeIn 0.3s ease-in;
}
```

### Common Animation Patterns

```css
/* Fade in */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

/* Slide and fade */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-up {
    animation: slideUp 0.4s ease-out forwards;
}

/* Loading spinner */
@keyframes spin {
    to { transform: rotate(360deg); }
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Pulse/heartbeat */
@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    10%, 30% { transform: scale(0.9); }
    20%, 40%, 60%, 80% { transform: scale(1.1); }
    50%, 70% { transform: scale(1.03); }
}

.heartbeat {
    animation: heartbeat 1.5s ease-in-out infinite;
}

/* Shake */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s ease-in-out;
}

/* Typing effect */
@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    50% { border-color: transparent; }
}

.typewriter {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid;
    animation: typing 3s steps(30) forwards,
               blink 0.5s step-end infinite;
}
```

### Animation Events (JavaScript)

```javascript
const element = document.querySelector('.animated');

element.addEventListener('animationstart', (e) => {
    console.log('Animation started:', e.animationName);
});

element.addEventListener('animationend', (e) => {
    console.log('Animation ended:', e.animationName);
    // Remove class or element
    element.classList.remove('animated');
});

element.addEventListener('animationiteration', (e) => {
    console.log('Animation iteration:', e.animationName);
});

// Control playback
element.style.animationPlayState = 'paused';
element.style.animationPlayState = 'running';
```

---

## ⚡ Performance Optimization

### Composite-Only Properties

```
┌─────────────────────────────────────────────────────────────────┐
│              ANIMATION PERFORMANCE TIERS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   🟢 BEST (Composite only - GPU accelerated)                    │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • transform: translate(), scale(), rotate()              │   │
│   │ • opacity                                                 │   │
│   │ • filter (some)                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   🟡 OK (Layout + Paint - more expensive)                       │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • background-color                                       │   │
│   │ • color                                                   │   │
│   │ • box-shadow                                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   🔴 AVOID (Triggers Layout - very expensive)                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • width, height                                          │   │
│   │ • margin, padding                                        │   │
│   │ • top, left, right, bottom                               │   │
│   │ • font-size                                              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Optimized Patterns

```css
/* ❌ Bad - animating width triggers layout */
.bad {
    width: 100px;
    transition: width 0.3s;
}
.bad:hover {
    width: 200px;
}

/* ✅ Good - use transform instead */
.good {
    transform: scaleX(1);
    transform-origin: left;
    transition: transform 0.3s;
}
.good:hover {
    transform: scaleX(2);
}

/* ❌ Bad - animating left triggers layout */
.slider-bad {
    position: absolute;
    left: 0;
    transition: left 0.3s;
}
.slider-bad.active {
    left: 100px;
}

/* ✅ Good - use translate */
.slider-good {
    transform: translateX(0);
    transition: transform 0.3s;
}
.slider-good.active {
    transform: translateX(100px);
}
```

### Force GPU Acceleration

```css
/* Promote to GPU layer */
.accelerated {
    /* Modern way */
    will-change: transform, opacity;

    /* Fallback hack */
    transform: translateZ(0);
    /* or */
    backface-visibility: hidden;
}

/* Use sparingly - creates new layer = memory */
/* Remove when not animating */
.element {
    will-change: auto; /* Reset after animation */
}
```

### Reduced Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Or provide alternative */
.card {
    transition: transform 0.3s, box-shadow 0.3s;
}

@media (prefers-reduced-motion: reduce) {
    .card {
        transition: none;
    }

    .card:hover {
        /* Subtle indication without motion */
        outline: 2px solid #007bff;
    }
}
```

---

## 🎭 Advanced Techniques

### Staggered Animations

```css
/* Using animation-delay */
.list-item {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0.1s; }
.list-item:nth-child(2) { animation-delay: 0.2s; }
.list-item:nth-child(3) { animation-delay: 0.3s; }
.list-item:nth-child(4) { animation-delay: 0.4s; }

/* Using custom properties */
.list-item {
    animation-delay: calc(var(--index) * 0.1s);
}
```

```html
<ul>
    <li class="list-item" style="--index: 0">Item 1</li>
    <li class="list-item" style="--index: 1">Item 2</li>
    <li class="list-item" style="--index: 2">Item 3</li>
</ul>
```

### Path Animations

```css
/* Motion along path */
.element {
    offset-path: path('M 10,80 Q 95,10 180,80');
    offset-distance: 0%;
    animation: followPath 3s ease-in-out infinite;
}

@keyframes followPath {
    to { offset-distance: 100%; }
}

/* SVG animation */
.draw-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: draw 2s ease-out forwards;
}

@keyframes draw {
    to { stroke-dashoffset: 0; }
}
```

### Scroll-Triggered Animations

```css
/* Using scroll-timeline (CSS Scroll-driven Animations) */
@keyframes reveal {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.scroll-reveal {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 40%;
}

/* Traditional with Intersection Observer (JS) */
.fade-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s, transform 0.6s;
}

.fade-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}
```

```javascript
// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
});
```

---

## 🛠️ Animation Libraries

### Framer Motion (React)

```jsx
import { motion, AnimatePresence } from 'framer-motion';

function Card({ isVisible }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    Card Content
                </motion.div>
            )}
        </AnimatePresence>
    );
}
```

### GSAP

```javascript
import gsap from 'gsap';

// Basic tween
gsap.to('.box', {
    x: 100,
    opacity: 0.5,
    duration: 1,
    ease: 'power2.out'
});

// Timeline
const tl = gsap.timeline();
tl.from('.header', { y: -100, opacity: 0, duration: 0.5 })
  .from('.content', { y: 50, opacity: 0, duration: 0.5 })
  .from('.footer', { y: 100, opacity: 0, duration: 0.5 });
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Transition vs Animation?**

A:
- Transition: A → B only, triggered by state change (hover, class)
- Animation: Multiple keyframes, auto-play or triggered, can loop

**Q: List animatable properties tốt cho performance?**

A: `transform` và `opacity` - chỉ trigger composite, GPU accelerated. Tránh animate width, height, margin, top/left.

### 🟡 Mid-level

**Q: will-change dùng khi nào?**

A: Hint browser element sẽ animate. Apply trước animation, remove sau. Overuse creates memory overhead (mỗi element = new layer).

**Q: Giải thích animation-fill-mode**

A:
- `none`: Default, reset to original state
- `forwards`: Keep final keyframe state
- `backwards`: Apply first keyframe during delay
- `both`: Apply both forwards and backwards

### 🔴 Senior

**Q: Optimize animation-heavy page**

A:
1. Use transform/opacity only
2. Promote to GPU với will-change (sparingly)
3. Reduce animated elements on screen
4. Use Intersection Observer for scroll animations
5. Respect prefers-reduced-motion
6. Profile with DevTools Performance tab

---

## 📚 Active Recall

1. [ ] Transition shorthand syntax
2. [ ] 4 keyframe animation properties
3. [ ] Which properties trigger layout?
4. [ ] prefers-reduced-motion media query
5. [ ] will-change usage và caveats

---

> **Tiếp theo:** [mindmap-html-css.md](./mindmap-html-css.md) - HTML/CSS Mind Map
