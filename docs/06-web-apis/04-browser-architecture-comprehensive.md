# Browser Architecture & Web Platform - Theoretical Guide
## Understanding How Browsers Work

[← Back to WebSockets](./03-websockets.md) | [Next: Performance →](../08-performance/01-web-performance.md)

---

## 📋 Table of Contents

1. [Browser Architecture Fundamentals](#browser-architecture-fundamentals)
2. [Rendering Engine Theory](#rendering-engine-theory)
3. [JavaScript Engine Deep Dive](#javascript-engine-deep-dive)
4. [Event Loop Architecture](#event-loop-architecture)
5. [Memory Management](#memory-management)
6. [Network Layer](#network-layer)
7. [Security Model](#security-model)
8. [Web Platform APIs](#web-platform-apis)
9. [Performance Optimization Theory](#performance-optimization-theory)
10. [Interview Questions](#interview-questions)

---

## 🎯 Learning Objectives

Master browser internals:
- Understand browser architecture
- Learn rendering pipeline
- Comprehend JavaScript execution
- Master event loop mechanics
- Understand security boundaries
- Optimize web performance

---

## Browser Architecture Fundamentals

### What is a Browser?

**English Definition:** A web browser is a software application that retrieves, presents, and traverses information resources on the World Wide Web, interpreting HTML, CSS, and JavaScript to render interactive web pages.

**Định nghĩa (Tiếng Việt):** Trình duyệt web là ứng dụng phần mềm truy xuất, trình bày và điều hướng các tài nguyên thông tin trên World Wide Web, thông dịch HTML, CSS và JavaScript để hiển thị các trang web tương tác.

### Browser Architecture Mind Map

```
Browser Architecture
│
├── Multi-Process Architecture
│   ├── Browser Process (Main)
│   ├── Renderer Process (per tab)
│   ├── GPU Process
│   ├── Network Process
│   └── Plugin Process
│
├── Rendering Engine
│   ├── HTML Parser
│   ├── CSS Parser
│   ├── Layout Engine
│   ├── Paint Engine
│   └── Compositor
│
├── JavaScript Engine
│   ├── Parser
│   ├── Interpreter
│   ├── Compiler (JIT)
│   ├── Garbage Collector
│   └── Optimization Pipeline
│
├── Event System
│   ├── Event Loop
│   ├── Task Queue
│   ├── Microtask Queue
│   └── Animation Frame Callbacks
│
└── Platform APIs
    ├── DOM APIs
    ├── Storage APIs
    ├── Network APIs
    ├── Graphics APIs
    └── Device APIs
```

### Multi-Process Architecture Theory

**Historical Context:**

**Single-Process Era:**
- All tabs in one process
- One tab crash = entire browser crash
- Security vulnerabilities affect all tabs
- Memory leaks accumulate

**Multi-Process Evolution:**

**Theory:** Modern browsers use multi-process architecture to improve stability, security, and performance through process isolation.

**Process Types:**

**1. Browser Process (Main Process)**

**Responsibilities:**
- UI rendering (address bar, bookmarks, etc.)
- Network requests coordination
- File system access
- Process management
- Security policy enforcement

**Characteristics:**
- Single instance
- Privileged access
- Coordinates other processes
- Manages browser state

**2. Renderer Process**

**Responsibilities:**
- HTML/CSS parsing
- JavaScript execution
- Layout calculation
- Painting
- Compositing

**Characteristics:**
- One per tab (or site)
- Sandboxed environment
- Limited system access
- Isolated from other tabs

**3. GPU Process**

**Responsibilities:**
- Graphics rendering
- Hardware acceleration
- Texture management
- Shader compilation

**Characteristics:**
- Single instance
- Direct GPU access
- Handles all graphics operations
- Shared across tabs

**4. Network Process**

**Responsibilities:**
- HTTP/HTTPS requests
- DNS resolution
- Socket management
- Cache management

**Characteristics:**
- Isolated from renderers
- Handles all network I/O
- Implements security policies
- Manages cookies and storage

**5. Plugin Process**

**Responsibilities:**
- Third-party plugin execution
- Flash, PDF viewers, etc.
- Isolated plugin environment

**Characteristics:**
- Per-plugin instance
- Heavily sandboxed
- Deprecated in modern browsers

### Site Isolation Theory

**Definition:** Site isolation ensures that pages from different websites run in separate processes, preventing cross-site information leaks.

**Security Boundaries:**

**Same-Origin Policy:**
- Protocol + Domain + Port must match
- Prevents cross-origin access
- Foundation of web security

**Site Isolation Enhancement:**
- Process-level isolation
- Protects against Spectre/Meltdown
- Prevents cross-site data leaks
- Performance trade-off (more processes)

**Implementation:**

**Process Allocation:**
- Each site gets dedicated process
- Cross-site iframes in separate processes
- Shared resources (images, scripts) handled carefully

**Communication:**
- Inter-process communication (IPC)
- Message passing between processes
- Serialization overhead

**Memory Implications:**
- More processes = more memory
- Trade-off: security vs resource usage
- Optimizations for low-memory devices

---

## Rendering Engine Theory

### Critical Rendering Path

**Definition:** The sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on the screen.

**Theoretical Model:**

The rendering pipeline consists of several stages, each with specific responsibilities and performance characteristics.

**Pipeline Stages:**

```
HTML → DOM Construction
CSS → CSSOM Construction
DOM + CSSOM → Render Tree
Render Tree → Layout
Layout → Paint
Paint → Composite
```

### DOM Construction Theory

**Definition:** The Document Object Model (DOM) is a tree-like representation of the HTML document structure.

**Parsing Process:**

**1. Tokenization**

**Theory:** HTML parser converts character stream into tokens (tags, attributes, text).

**Token Types:**
- Start tags: `<div>`
- End tags: `</div>`
- Self-closing tags: `<img />`
- Text content
- Comments

**State Machine:**
- Parser maintains state
- Transitions based on characters
- Handles malformed HTML
- Error recovery built-in

**2. Tree Construction**

**Theory:** Tokens are converted into DOM nodes and assembled into a tree structure.

**Node Types:**
- Element nodes
- Text nodes
- Comment nodes
- Document node (root)

**Tree Building:**
- Stack-based algorithm
- Maintains open elements
- Handles nesting
- Creates parent-child relationships

**3. Parser Blocking**

**Theory:** Certain resources block HTML parsing, affecting page load performance.

**Blocking Resources:**

**Synchronous Scripts:**
- Block parsing until executed
- Can modify DOM
- Should be deferred or async

**Stylesheets:**
- Block script execution
- Don't block HTML parsing
- Prevent FOUC (Flash of Unstyled Content)

**Optimization Strategies:**
- Async/defer attributes
- Inline critical CSS
- Preload/prefetch resources
- Resource hints

### CSSOM Construction Theory

**Definition:** The CSS Object Model (CSSOM) represents all CSS rules and their relationships.

**Parsing Process:**

**1. CSS Parsing**

**Theory:** CSS parser converts CSS text into structured rules.

**Parsing Steps:**
- Tokenization
- Rule parsing
- Selector parsing
- Property parsing
- Value computation

**2. Cascade Algorithm**

**Theory:** Determines which CSS rules apply to each element based on specificity, importance, and source order.

**Cascade Layers:**
1. User agent styles (browser defaults)
2. User styles (user preferences)
3. Author styles (website CSS)
4. Inline styles
5. !important declarations

**Specificity Calculation:**
- Inline styles: 1,0,0,0
- IDs: 0,1,0,0
- Classes/attributes/pseudo-classes: 0,0,1,0
- Elements/pseudo-elements: 0,0,0,1

**3. Inheritance**

**Theory:** Some CSS properties inherit from parent to child elements.

**Inherited Properties:**
- Typography (font-family, font-size, color)
- Text properties (text-align, line-height)
- Visibility

**Non-Inherited Properties:**
- Box model (margin, padding, border)
- Positioning (position, top, left)
- Display properties

### Render Tree Construction

**Definition:** The render tree combines DOM and CSSOM, containing only visible elements with computed styles.

**Construction Process:**

**1. Tree Traversal**

**Theory:** Browser traverses DOM tree, attaching computed styles from CSSOM.

**Filtering:**
- Skip hidden elements (display: none)
- Skip head, script, meta tags
- Include pseudo-elements
- Handle visibility: hidden (included but invisible)

**2. Style Computation**

**Theory:** Resolve all CSS values to absolute values.

**Resolution Steps:**
- Apply cascade
- Resolve relative units (em, %, vh)
- Compute inherited values
- Apply default values
- Handle shorthand properties

**3. Render Object Creation**

**Theory:** Create render objects (render tree nodes) for each visible element.

**Render Object Types:**
- Block boxes
- Inline boxes
- Text runs
- Replaced elements (img, video)

### Layout (Reflow) Theory

**Definition:** Layout calculates the exact position and size of each element on the page.

**Layout Algorithm:**

**1. Box Model Calculation**

**Theory:** Compute dimensions based on content, padding, border, and margin.

**Box Sizing:**
- content-box: width/height = content only
- border-box: width/height = content + padding + border

**Calculation Order:**
1. Compute width (parent to child)
2. Compute height (child to parent)
3. Position children
4. Calculate overflow

**2. Positioning Schemes**

**Normal Flow:**
- Block elements stack vertically
- Inline elements flow horizontally
- Respects document order

**Float:**
- Remove from normal flow
- Shift to side
- Text wraps around

**Absolute Positioning:**
- Remove from normal flow
- Position relative to ancestor
- Doesn't affect other elements

**Fixed Positioning:**
- Position relative to viewport
- Stays in place on scroll
- Creates new stacking context

**3. Layout Optimization**

**Theory:** Layout is expensive; browsers optimize to minimize recalculations.

**Optimization Techniques:**
- Incremental layout (only changed subtrees)
- Dirty bit system (mark changed elements)
- Layout batching (combine multiple changes)
- Layout thrashing prevention

**Layout Thrashing:**
- Reading layout properties forces synchronous layout
- Interleaving reads and writes causes multiple layouts
- Solution: Batch reads, then batch writes

### Paint Theory

**Definition:** Paint converts render tree into actual pixels, filling in colors, images, borders, shadows, etc.

**Paint Layers:**

**Theory:** Browser divides page into layers for efficient painting and compositing.

**Layer Creation Triggers:**
- 3D transforms
- Video/canvas elements
- CSS filters
- Opacity animations
- Will-change property
- Overflow: scroll

**Paint Order:**

**Stacking Context:**
- Background and borders
- Negative z-index children
- Block-level boxes
- Floats
- Inline boxes
- Positioned elements (z-index: 0)
- Positive z-index children

**Paint Optimization:**

**Damage Tracking:**
- Track which areas changed
- Only repaint damaged regions
- Minimize paint area

**Paint Complexity:**
- Simple properties (color) cheap
- Complex properties (shadows, gradients) expensive
- Avoid paint during animations

### Compositing Theory

**Definition:** Compositing combines painted layers into final image displayed on screen.

**Compositor Thread:**

**Theory:** Separate thread handles compositing, enabling smooth animations independent of main thread.

**Benefits:**
- Animations don't block JavaScript
- Smooth scrolling
- Parallel processing
- GPU acceleration

**Composite Layers:**

**Layer Promotion:**
- Certain properties promote elements to own layer
- Enables GPU acceleration
- Trade-off: memory vs performance

**Promotion Triggers:**
- 3D transforms (translateZ, rotate3d)
- Will-change property
- Video/canvas elements
- CSS filters
- Opacity animations

**Transform and Opacity:**
- Only properties that can be composited
- Don't trigger layout or paint
- Handled entirely by compositor
- Smoothest animations

---

## JavaScript Engine Deep Dive

### JavaScript Engine Architecture

**Definition:** JavaScript engine executes JavaScript code, handling parsing, compilation, optimization, and garbage collection.

**Major Engines:**
- V8 (Chrome, Node.js)
- SpiderMonkey (Firefox)
- JavaScriptCore (Safari)
- Chakra (Edge Legacy)

### Execution Pipeline Theory

**Pipeline Stages:**

```
Source Code
  ↓
Parser → AST (Abstract Syntax Tree)
  ↓
Interpreter → Bytecode
  ↓
Profiler → Hot Code Detection
  ↓
Optimizing Compiler → Machine Code
  ↓
Execution
```

**1. Parsing**

**Theory:** Convert source code into Abstract Syntax Tree (AST).

**Parsing Strategies:**

**Eager Parsing:**
- Parse entire function immediately
- Build complete AST
- Slower initial parse
- Ready for execution

**Lazy Parsing:**
- Skip function bodies initially
- Parse only when called
- Faster initial load
- May reparse later

**Preparser:**
- Quick syntax check
- Detect errors early
- Minimal AST construction
- Optimize for common cases

**2. Bytecode Generation**

**Theory:** Convert AST into platform-independent bytecode.

**Bytecode Characteristics:**
- Compact representation
- Platform-independent
- Faster than interpreting AST
- Baseline for optimization

**Ignition (V8's Interpreter):**
- Generates bytecode from AST
- Executes bytecode directly
- Collects profiling data
- Feeds optimizer

**3. Just-In-Time (JIT) Compilation**

**Theory:** Compile hot code paths to optimized machine code during execution.

**Tiered Compilation:**

**Baseline Compiler:**
- Quick compilation
- Moderate optimization
- Low compilation cost
- Handles most code

**Optimizing Compiler:**
- Aggressive optimization
- Speculative compilation
- High compilation cost
- Handles hot code only

**Optimization Techniques:**

**Inline Caching:**
- Cache property access locations
- Avoid repeated lookups
- Assumes object shape stable
- Deoptimize if shape changes

**Hidden Classes:**
- Track object structure
- Enable inline caching
- Optimize property access
- Maintain shape consistency

**Speculative Optimization:**
- Assume types based on profiling
- Generate optimized code
- Insert type checks
- Deoptimize if assumptions violated

**Function Inlining:**
- Replace function calls with function body
- Eliminate call overhead
- Enable further optimizations
- Trade-off: code size vs speed

**4. Deoptimization**

**Theory:** When optimized code's assumptions are violated, fall back to less optimized code.

**Deoptimization Triggers:**
- Type changes
- Hidden class changes
- Unexpected values
- Polymorphic call sites

**Bailout Process:**
- Detect assumption violation
- Restore interpreter state
- Continue in interpreter/baseline
- May reoptimize later

### Optimization Killers

**Theory:** Certain code patterns prevent optimization, causing performance degradation.

**Common Killers:**

**1. Dynamic Property Access**
```
obj[dynamicKey] // Prevents inline caching
```

**2. Polymorphic Functions**
```
function add(a, b) {
  return a + b; // Called with different types
}
```

**3. Arguments Object**
```
function fn() {
  return arguments; // Prevents optimization
}
```

**4. Try-Catch**
```
try {
  // Code here harder to optimize
} catch (e) {}
```

**5. With Statement**
```
with (obj) {
  // Prevents scope optimization
}
```

**6. Eval**
```
eval(code); // Prevents many optimizations
```

---

## Event Loop Architecture

### Event Loop Theory

**Definition:** The event loop is the mechanism that coordinates execution of code, collection of events, and execution of queued sub-tasks.

**Theoretical Model:**

The event loop implements a run-to-completion model where each task runs completely before the next task begins.

**Event Loop Algorithm:**

```
while (true) {
  // 1. Execute oldest task from task queue
  task = taskQueue.dequeue()
  execute(task)
  
  // 2. Execute all microtasks
  while (microtaskQueue.notEmpty()) {
    microtask = microtaskQueue.dequeue()
    execute(microtask)
  }
  
  // 3. Render if needed
  if (needsRender()) {
    render()
  }
  
  // 4. Wait for next task
  if (taskQueue.isEmpty()) {
    wait()
  }
}
```

### Task Queues Theory

**Macrotask Queue (Task Queue):**

**Definition:** Queue of tasks from various sources, executed one per event loop iteration.

**Task Sources:**
- setTimeout/setInterval
- I/O operations
- UI events (click, scroll)
- postMessage
- MessageChannel

**Characteristics:**
- One task per loop iteration
- Can schedule microtasks
- Lower priority than microtasks

**Microtask Queue:**

**Definition:** Queue of microtasks executed after current task and before rendering.

**Microtask Sources:**
- Promise callbacks (.then, .catch, .finally)
- queueMicrotask()
- MutationObserver
- Process.nextTick (Node.js)

**Characteristics:**
- All microtasks executed per iteration
- Higher priority than tasks
- Can starve rendering

**Priority Order:**

```
1. Current executing code (run to completion)
2. All microtasks (until queue empty)
3. One macrotask
4. Rendering (if needed)
5. Repeat
```

### Rendering Pipeline Integration

**Theory:** Browser rendering is integrated with event loop, occurring at specific points.

**Rendering Timing:**

**RequestAnimationFrame:**
- Scheduled before paint
- Runs once per frame
- Synchronized with display refresh
- Ideal for animations

**Rendering Steps:**
1. Execute all microtasks
2. Run requestAnimationFrame callbacks
3. Perform layout if needed
4. Paint if needed
5. Composite layers

**Frame Budget:**
- 60 FPS = 16.67ms per frame
- JavaScript execution budget: ~10-12ms
- Remaining time for rendering
- Exceeding budget causes dropped frames

---

## Summary

### Key Theoretical Concepts

1. **Browser Architecture**
   - Multi-process isolation
   - Site isolation security
   - Process communication
   - Resource management

2. **Rendering Pipeline**
   - DOM/CSSOM construction
   - Render tree building
   - Layout calculation
   - Paint and composite

3. **JavaScript Engine**
   - Parsing strategies
   - JIT compilation
   - Optimization techniques
   - Deoptimization handling

4. **Event Loop**
   - Task queue management
   - Microtask priority
   - Rendering integration
   - Performance implications

### Performance Principles

✅ **DO:**
- Minimize layout thrashing
- Batch DOM operations
- Use transform/opacity for animations
- Understand event loop timing
- Optimize critical rendering path

❌ **DON'T:**
- Block main thread
- Cause layout/paint during animations
- Create optimization killers
- Starve event loop with microtasks
- Ignore browser architecture

---

[← Back to WebSockets](./03-websockets.md) | [Next: Performance →](../08-performance/01-web-performance.md)
