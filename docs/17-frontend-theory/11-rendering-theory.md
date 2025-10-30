# Rendering Theory - Complete Guide
# Lý Thuyết Rendering - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: Browser Rendering Fundamentals
1. Critical Rendering Path
2. DOM Construction
3. CSSOM Construction
4. Render Tree Construction
5. Layout (Reflow)
6. Paint
7. Composite

### Part 2: React Rendering
8. React Rendering Process
9. Reconciliation Algorithm
10. Fiber Architecture
11. Render Phase vs Commit Phase
12. Concurrent Rendering

### Part 3: Rendering Optimization
13. Render Optimization Strategies
14. Memoization Techniques
15. Code Splitting
16. Lazy Loading
17. Virtualization

### Part 4: Advanced Concepts
18. Server-Side Rendering (SSR)
19. Static Site Generation (SSG)
20. Incremental Static Regeneration (ISR)
21. Streaming SSR
22. Progressive Hydration

---

## Part 1: Browser Rendering Fundamentals

### 1. Critical Rendering Path
### 1. Critical Rendering Path

**English:**

The Critical Rendering Path is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.

**CRP Steps:**

```
1. Process HTML → Build DOM
2. Process CSS → Build CSSOM
3. Combine DOM + CSSOM → Render Tree
4. Layout → Calculate positions
5. Paint → Draw pixels
6. Composite → Combine layers
```

**Theory: Why "Critical"?**

The path is "critical" because:
1. Blocks initial render
2. Affects Time to First Paint (TTFP)
3. Impacts user experience
4. Determines perceived performance
5. Must be optimized for fast loads

**CRP Metrics:**

**1. Time to First Byte (TTFB):**
- Server response time
- Network latency
- DNS lookup + TCP connection

**2. First Paint (FP):**
- When first pixel appears
- Indicates page is loading
- User sees something

**3. First Contentful Paint (FCP):**
- When first content appears
- Text, image, or canvas
- More meaningful than FP

**4. Largest Contentful Paint (LCP):**
- When largest content appears
- Main content visible
- Core Web Vital

**5. Time to Interactive (TTI):**
- When page is fully interactive
- JavaScript executed
- Event handlers attached

**Theory: CRP Optimization**

Optimize CRP by:
1. **Minimize critical resources**: Fewer files to download
2. **Minimize critical bytes**: Smaller file sizes
3. **Minimize critical path length**: Fewer round trips
4. **Prioritize critical resources**: Load important first
5. **Defer non-critical resources**: Load later

**Critical Resources:**

Resources that block rendering:
1. **HTML**: Always critical
2. **CSS**: Render-blocking by default
3. **JavaScript**: Parser-blocking by default
4. **Fonts**: Can block text rendering

**Non-Critical Resources:**

Resources that don't block rendering:
1. **Images**: Load asynchronously
2. **Async scripts**: Don't block parser
3. **Deferred scripts**: Execute after parse
4. **Lazy-loaded content**: Load on demand

**Theory: Render-Blocking Resources**

**CSS is render-blocking because:**
- Browser needs styles to render
- Prevents Flash of Unstyled Content (FOUC)
- Must download and parse before render

**JavaScript is parser-blocking because:**
- Can modify DOM
- Can modify CSSOM
- Must execute in order
- Blocks HTML parsing

**Optimization Strategies:**

**1. Inline Critical CSS:**
```html
<style>
  /* Critical above-the-fold CSS */
  .header { ... }
  .hero { ... }
</style>
```

**2. Async/Defer Scripts:**
```html
<!-- Async: Download in parallel, execute when ready -->
<script src="analytics.js" async></script>

<!-- Defer: Download in parallel, execute after parse -->
<script src="app.js" defer></script>
```

**3. Preload Critical Resources:**
```html
<link rel="preload" href="font.woff2" as="font">
<link rel="preload" href="hero.jpg" as="image">
```

**4. Resource Hints:**
```html
<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//api.example.com">

<!-- Preconnect -->
<link rel="preconnect" href="//cdn.example.com">

<!-- Prefetch -->
<link rel="prefetch" href="/next-page.html">
```

**Vietnamese:**

Critical Rendering Path là sequence của steps browser thực hiện để convert HTML, CSS, và JavaScript thành pixels trên màn hình.

**CRP Steps:**

```
1. Process HTML → Build DOM
2. Process CSS → Build CSSOM
3. Combine DOM + CSSOM → Render Tree
4. Layout → Calculate positions
5. Paint → Draw pixels
6. Composite → Combine layers
```

**Lý Thuyết: Tại Sao "Critical"?**

Path "critical" vì:
1. Blocks initial render
2. Affects Time to First Paint
3. Impacts user experience
4. Determines perceived performance
5. Phải optimize cho fast loads

**CRP Metrics:**

1. **TTFB**: Server response time
2. **FP**: First pixel appears
3. **FCP**: First content appears
4. **LCP**: Largest content appears
5. **TTI**: Page fully interactive

**Optimize CRP:**

1. Minimize critical resources
2. Minimize critical bytes
3. Minimize critical path length
4. Prioritize critical resources
5. Defer non-critical resources

**Critical Resources:**

Resources block rendering:
1. HTML (always critical)
2. CSS (render-blocking)
3. JavaScript (parser-blocking)
4. Fonts (có thể block text)

---

### 2. DOM Construction
### 2. Xây Dựng DOM

**English:**

The Document Object Model (DOM) is a tree representation of the HTML document. Understanding DOM construction is key to optimization.

**DOM Construction Process:**

**Step 1: Bytes to Characters**
```
HTML bytes → Character encoding → Characters
```

**Step 2: Characters to Tokens**
```
Characters → Tokenization → Tokens
<html>, <head>, <body>, etc.
```

**Step 3: Tokens to Nodes**
```
Tokens → Node creation → DOM Nodes
HTMLElement, TextNode, etc.
```

**Step 4: Nodes to DOM Tree**
```
Nodes → Tree construction → DOM Tree
Parent-child relationships
```

**Theory: Incremental Processing**

DOM construction is incremental:
1. Browser doesn't wait for entire HTML
2. Processes chunks as they arrive
3. Can start rendering early
4. Progressive rendering

**Benefits:**
- Faster perceived performance
- Better user experience
- Efficient resource usage

**DOM Tree Structure:**

```
Document
  └─ html
      ├─ head
      │   ├─ title
      │   └─ meta
      └─ body
          ├─ header
          │   └─ h1
          └─ main
              ├─ p
              └─ div
```

**Theory: Tree Properties**

DOM tree has:
1. **Root**: Document node
2. **Parent-child relationships**: Hierarchy
3. **Siblings**: Same level nodes
4. **Depth**: Nesting level
5. **Breadth**: Number of children

**Node Types:**

1. **Element nodes**: HTML elements
2. **Text nodes**: Text content
3. **Comment nodes**: HTML comments
4. **Document node**: Root
5. **DocumentType node**: DOCTYPE
6. **DocumentFragment**: Lightweight container

**Theory: Node Relationships**

Each node has:
- **parentNode**: Parent element
- **childNodes**: Array of children
- **firstChild**: First child
- **lastChild**: Last child
- **nextSibling**: Next sibling
- **previousSibling**: Previous sibling

**DOM Construction Performance:**

**Factors affecting speed:**
1. **Document size**: Larger = slower
2. **Nesting depth**: Deeper = slower
3. **Number of nodes**: More = slower
4. **Script execution**: Blocks construction

**Optimization:**

1. **Minimize DOM size**: Fewer nodes
2. **Reduce nesting**: Flatter structure
3. **Avoid deep trees**: Limit depth
4. **Defer scripts**: Don't block construction

**Theory: Parser-Blocking Scripts**

When parser encounters `<script>`:
1. Stops HTML parsing
2. Downloads script (if external)
3. Executes script
4. Resumes parsing

**Why blocking?**
- Scripts can modify DOM
- Must execute in order
- Can't parse ahead safely

**Solutions:**
- Use `async` attribute
- Use `defer` attribute
- Place scripts at end of body
- Use module scripts

**DOM APIs:**

**Query APIs:**
```javascript
document.getElementById()
document.querySelector()
document.querySelectorAll()
document.getElementsByClassName()
document.getElementsByTagName()
```

**Manipulation APIs:**
```javascript
createElement()
appendChild()
removeChild()
replaceChild()
insertBefore()
```

**Theory: Live vs Static Collections**

**Live Collections:**
- Update automatically
- getElementsByClassName
- getElementsByTagName
- childNodes

**Static Collections:**
- Snapshot at query time
- querySelectorAll
- Don't update automatically

**Vietnamese:**

Document Object Model (DOM) là tree representation của HTML document. Hiểu DOM construction là key cho optimization.

**DOM Construction Process:**

**Bước 1: Bytes to Characters**
```
HTML bytes → Character encoding → Characters
```

**Bước 2: Characters to Tokens**
```
Characters → Tokenization → Tokens
```

**Bước 3: Tokens to Nodes**
```
Tokens → Node creation → DOM Nodes
```

**Bước 4: Nodes to DOM Tree**
```
Nodes → Tree construction → DOM Tree
```

**Lý Thuyết: Incremental Processing**

DOM construction là incremental:
1. Browser không chờ entire HTML
2. Processes chunks khi arrive
3. Có thể start rendering sớm
4. Progressive rendering

**Benefits:**
- Faster perceived performance
- Better user experience
- Efficient resource usage

**Node Types:**

1. Element nodes
2. Text nodes
3. Comment nodes
4. Document node
5. DocumentType node
6. DocumentFragment

**Performance:**

**Factors affecting speed:**
1. Document size
2. Nesting depth
3. Number of nodes
4. Script execution

**Optimization:**
1. Minimize DOM size
2. Reduce nesting
3. Avoid deep trees
4. Defer scripts

---

### 3. CSSOM Construction
### 3. Xây Dựng CSSOM

**English:**

The CSS Object Model (CSSOM) is a tree representation of CSS styles. It's similar to DOM but for styles.

**CSSOM Construction Process:**

**Step 1: Bytes to Characters**
```
CSS bytes → Character encoding → Characters
```

**Step 2: Characters to Tokens**
```
Characters → Tokenization → Tokens
Selectors, properties, values
```

**Step 3: Tokens to Nodes**
```
Tokens → Node creation → Style rules
```

**Step 4: Nodes to CSSOM Tree**
```
Nodes → Tree construction → CSSOM Tree
Cascading and inheritance
```

**Theory: CSSOM is Render-Blocking**

CSSOM blocks rendering because:
1. Browser needs styles to render correctly
2. Prevents Flash of Unstyled Content (FOUC)
3. Must be complete before render tree
4. CSS is render-blocking by default

**CSSOM Tree Structure:**

```
body
  ├─ font-size: 16px
  ├─ color: black
  └─ div
      ├─ font-size: 16px (inherited)
      ├─ color: black (inherited)
      └─ margin: 20px (own)
```

**Theory: Cascade and Inheritance**

CSSOM implements:
1. **Cascade**: Rule priority
2. **Inheritance**: Parent to child
3. **Specificity**: Selector weight
4. **Computed values**: Final values

**Cascade Order:**

```
1. User agent styles (browser defaults)
2. User styles (user preferences)
3. Author styles (your CSS)
4. Author !important
5. User !important
```

**Specificity Calculation:**

```
(inline, IDs, classes, elements)

Examples:
p                    → (0, 0, 0, 1)
.class               → (0, 0, 1, 0)
#id                  → (0, 1, 0, 0)
style=""             → (1, 0, 0, 0)
```

**Theory: Computed Styles**

Browser computes final styles:
1. Apply cascade
2. Apply inheritance
3. Resolve relative values
4. Apply defaults
5. Create computed style

**CSSOM Performance:**

**Factors affecting speed:**
1. **CSS size**: Larger = slower
2. **Selector complexity**: Complex = slower
3. **Number of rules**: More = slower
4. **Media queries**: Conditional processing

**Optimization:**

1. **Minimize CSS**: Remove unused
2. **Simplify selectors**: Avoid complex
3. **Reduce rules**: Combine similar
4. **Critical CSS**: Inline above-fold
5. **Defer non-critical**: Load later

**Theory: CSS Parsing**

CSS parsing is:
- Fast (simpler than HTML)
- Render-blocking
- Can't be incremental (needs complete rules)
- Cached by browser

**CSS Loading Strategies:**

**1. Inline Critical CSS:**
```html
<style>
  /* Critical styles */
</style>
```

**2. Async CSS Loading:**
```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

**3. Media Queries:**
```html
<link rel="stylesheet" href="print.css" media="print">
<!-- Not render-blocking for screen -->
```

**4. Conditional Loading:**
```javascript
if (condition) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'optional.css';
  document.head.appendChild(link);
}
```

**Vietnamese:**

CSS Object Model (CSSOM) là tree representation của CSS styles. Nó tương tự DOM nhưng cho styles.

**CSSOM Construction Process:**

**Bước 1: Bytes to Characters**
**Bước 2: Characters to Tokens**
**Bước 3: Tokens to Nodes**
**Bước 4: Nodes to CSSOM Tree**

**Lý Thuyết: CSSOM is Render-Blocking**

CSSOM blocks rendering vì:
1. Browser cần styles để render correctly
2. Prevents FOUC
3. Phải complete trước render tree
4. CSS render-blocking by default

**Cascade và Inheritance:**

CSSOM implements:
1. **Cascade**: Rule priority
2. **Inheritance**: Parent to child
3. **Specificity**: Selector weight
4. **Computed values**: Final values

**Performance:**

**Factors affecting speed:**
1. CSS size
2. Selector complexity
3. Number of rules
4. Media queries

**Optimization:**
1. Minimize CSS
2. Simplify selectors
3. Reduce rules
4. Critical CSS inline
5. Defer non-critical

