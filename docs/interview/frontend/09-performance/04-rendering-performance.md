# Rendering Performance - Smooth Visual Updates

> Tối ưu rendering để đạt 60fps. Understand reflow, repaint, và compositor-only properties.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERING PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   JavaScript ──▶ Style ──▶ Layout ──▶ Paint ──▶ Composite       │
│       │           │          │          │          │             │
│       ▼           ▼          ▼          ▼          ▼             │
│   Run code    Calculate   Calculate   Fill in    Combine        │
│               styles      geometry    pixels     layers         │
│                                                                   │
│   COST:       Low        HIGH       Medium      LOW             │
│                                                                   │
│   WHAT TRIGGERS EACH:                                            │
│   ────────────────────                                           │
│   Layout:  width, height, margin, padding, position             │
│   Paint:   color, background, shadow, border-radius             │
│   Composite: transform, opacity                                  │
│                                                                   │
│   GOAL: Animate only composite properties for 60fps             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Reflow (Layout)

### What Triggers Reflow

```javascript
// ❌ These properties trigger layout recalculation
element.style.width = '100px';
element.style.height = '50px';
element.style.margin = '10px';
element.style.padding = '5px';
element.style.border = '1px solid';
element.style.top = '100px';
element.style.left = '50px';
element.style.fontSize = '16px';

// ❌ Reading layout properties forces sync reflow
const width = element.offsetWidth;
const height = element.offsetHeight;
const rect = element.getBoundingClientRect();
const computed = getComputedStyle(element);

// ❌ LAYOUT THRASHING - alternating read/write
elements.forEach(el => {
    const width = el.offsetWidth; // Read - force layout
    el.style.width = width + 10 + 'px'; // Write - invalidate layout
});

// ✅ FIXED - batch reads, then batch writes
const widths = elements.map(el => el.offsetWidth); // All reads

elements.forEach((el, i) => {
    el.style.width = widths[i] + 10 + 'px'; // All writes
});
```

### Avoiding Reflow

```javascript
// ✅ Use transform instead of top/left
// ❌ Triggers layout
element.style.top = '100px';
element.style.left = '50px';

// ✅ Only composite
element.style.transform = 'translate(50px, 100px)';

// ✅ Use CSS classes instead of inline styles
// ❌ Multiple style changes = multiple potential reflows
element.style.width = '100px';
element.style.height = '50px';
element.style.margin = '10px';

// ✅ Single reflow
element.classList.add('new-size');

// ✅ Use documentFragment for batch DOM updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);
});
list.appendChild(fragment); // Single reflow

// ✅ Hide element, modify, show
element.style.display = 'none';
// ... multiple modifications ...
element.style.display = 'block'; // Single reflow

// ✅ Use requestAnimationFrame
requestAnimationFrame(() => {
    // All DOM changes batched in one frame
    element.style.width = '100px';
    element.style.height = '50px';
});
```

---

## 🎨 Repaint

### What Triggers Repaint

```javascript
// These trigger repaint (but not layout)
element.style.color = 'red';
element.style.background = 'blue';
element.style.boxShadow = '0 0 10px black';
element.style.borderRadius = '5px';
element.style.visibility = 'hidden'; // Not display!
```

### Minimizing Repaints

```javascript
// ✅ Use opacity instead of visibility
// Both avoid layout, opacity is compositor-only
element.style.opacity = '0';

// ✅ Reduce paint area with will-change
// Warning: Use sparingly!
.animated-element {
    will-change: transform;
}

// ✅ Remove will-change when not needed
element.addEventListener('animationend', () => {
    element.style.willChange = 'auto';
});

// ✅ Use contain for isolation
.card {
    contain: layout paint;
    /* Changes inside don't affect outside */
}
```

---

## ✨ Compositor-Only Properties

### The Magic Two

```css
/* These ONLY properties animate on compositor thread */
/* = Smooth 60fps animations */

.smooth-animation {
    /* Transform - position, scale, rotate */
    transform: translateX(100px);
    transform: scale(1.5);
    transform: rotate(45deg);

    /* Opacity - transparency */
    opacity: 0.5;
}

/* Everything else touches main thread */
/* = Potential jank at 60fps */
```

### Animation Examples

```css
/* ❌ Janky - triggers layout */
@keyframes slide-bad {
    from { left: 0; }
    to { left: 100px; }
}

/* ✅ Smooth - compositor only */
@keyframes slide-good {
    from { transform: translateX(0); }
    to { transform: translateX(100px); }
}

/* ❌ Janky - triggers layout */
@keyframes grow-bad {
    from { width: 100px; height: 100px; }
    to { width: 200px; height: 200px; }
}

/* ✅ Smooth - compositor only */
@keyframes grow-good {
    from { transform: scale(1); }
    to { transform: scale(2); }
}

/* ❌ Janky - triggers repaint */
@keyframes fade-bad {
    from { visibility: visible; }
    to { visibility: hidden; }
}

/* ✅ Smooth - compositor only */
@keyframes fade-good {
    from { opacity: 1; }
    to { opacity: 0; }
}
```

---

## 📜 Virtual Scrolling

### Implementation

```javascript
// For large lists (1000+ items)
function VirtualList({ items, itemHeight, containerHeight }) {
    const [scrollTop, setScrollTop] = useState(0);

    // Calculate visible range
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    );

    // Only render visible items
    const visibleItems = items.slice(startIndex, endIndex);

    return (
        <div
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={(e) => setScrollTop(e.target.scrollTop)}
        >
            <div style={{ height: items.length * itemHeight, position: 'relative' }}>
                {visibleItems.map((item, i) => (
                    <div
                        key={startIndex + i}
                        style={{
                            position: 'absolute',
                            top: (startIndex + i) * itemHeight,
                            height: itemHeight
                        }}
                    >
                        {item.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Using react-window (recommended library)
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
    return (
        <FixedSizeList
            height={400}
            width="100%"
            itemCount={items.length}
            itemSize={50}
        >
            {({ index, style }) => (
                <div style={style}>
                    {items[index].content}
                </div>
            )}
        </FixedSizeList>
    );
}
```

---

## 🔧 CSS Containment

```css
/* contain property - isolate element */

/* Layout containment */
.component {
    contain: layout;
    /* Internal layout changes don't affect siblings */
}

/* Paint containment */
.component {
    contain: paint;
    /* Creates new stacking context */
    /* Children clipped to bounds */
}

/* Size containment */
.component {
    contain: size;
    /* Size independent of children */
    /* Must set explicit dimensions */
}

/* Strict containment */
.component {
    contain: strict;
    /* = size layout paint */
}

/* Content containment (most common) */
.component {
    contain: content;
    /* = layout paint */
    /* Good default for components */
}

/* content-visibility for off-screen content */
.below-fold {
    content-visibility: auto;
    contain-intrinsic-size: 500px;
    /* Skips rendering if off-screen */
}
```

---

## ⚛️ React Rendering Optimization

### Memoization

```jsx
// React.memo - skip re-render if props unchanged
const ExpensiveComponent = React.memo(({ data }) => {
    return <div>{/* expensive render */}</div>;
});

// With custom comparison
const Component = React.memo(
    ({ item }) => <div>{item.name}</div>,
    (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);

// useMemo - cache expensive calculations
function DataGrid({ data, filter }) {
    const filteredData = useMemo(() => {
        return data.filter(item => item.category === filter);
    }, [data, filter]);

    return <Grid data={filteredData} />;
}

// useCallback - cache function references
function Parent() {
    const [count, setCount] = useState(0);

    // ❌ Creates new function every render
    const handleClick = () => setCount(c => c + 1);

    // ✅ Same function reference
    const handleClick = useCallback(() => {
        setCount(c => c + 1);
    }, []);

    return <Child onClick={handleClick} />;
}
```

### Key Best Practices

```jsx
// ❌ Bad key - causes unnecessary re-renders
{items.map((item, index) => (
    <Item key={index} data={item} />
))}

// ✅ Good key - stable identifier
{items.map(item => (
    <Item key={item.id} data={item} />
))}

// Moving state down
// ❌ Parent re-renders children unnecessarily
function Parent() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <Counter count={count} setCount={setCount} />
            <ExpensiveChild /> {/* Re-renders on every count change! */}
        </div>
    );
}

// ✅ Isolate state to component that needs it
function Parent() {
    return (
        <div>
            <Counter /> {/* State inside */}
            <ExpensiveChild /> {/* Doesn't re-render */}
        </div>
    );
}

function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is reflow?**

A: Browser recalculating positions and sizes of elements. Triggered by changing layout properties (width, height, margin). Expensive - avoid frequent reflows.

**Q: Which CSS properties are safe to animate?**

A: Transform and opacity - they only affect compositor layer, don't trigger layout or paint. Enables smooth 60fps animations.

### 🟡 Mid-level

**Q: What is layout thrashing?**

A: Alternating DOM reads and writes causes multiple forced synchronous layouts. Fix by batching all reads first, then all writes.

```javascript
// Bad: read-write-read-write
elements.forEach(el => {
    const h = el.offsetHeight; // Force layout
    el.style.height = h + 10 + 'px'; // Invalidate
});

// Good: read-read-write-write
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
    el.style.height = heights[i] + 10 + 'px';
});
```

**Q: How does virtual scrolling work?**

A: Only renders visible items plus buffer. Calculates which items are visible based on scroll position. Uses absolute positioning or transform. Dramatically reduces DOM nodes for long lists.

### 🔴 Senior

**Q: Optimize animation-heavy page for 60fps**

A:
```
1. Audit current performance:
   - DevTools Performance panel
   - Identify long tasks, forced reflows

2. Animation optimization:
   - Use only transform and opacity
   - Use will-change sparingly
   - Prefer CSS animations over JS

3. Layout optimization:
   - Batch DOM reads/writes
   - Use requestAnimationFrame
   - Avoid forced synchronous layout

4. Paint optimization:
   - Promote to compositor layer
   - Use contain: layout paint
   - Reduce paint areas

5. React optimization:
   - Virtualize long lists
   - Memoize expensive components
   - Use concurrent features
```

---

## 📚 Active Recall

1. [ ] Rendering pipeline (5 stages)
2. [ ] Compositor-only properties (2)
3. [ ] Layout thrashing cause và fix
4. [ ] will-change usage và warnings
5. [ ] Virtual scrolling principle

---

> **Tiếp theo:** [05-bundle-optimization.md](./05-bundle-optimization.md) - Bundle Optimization
