# Browser Rendering Theory
## Theoretical Foundations of Web Rendering

**English:** Browser rendering theory explores the mathematical models, algorithms, and architectural principles underlying how browsers transform HTML, CSS, and JavaScript into pixels on screen, optimizing for performance and user experience.

**Tiếng Việt:** Lý thuyết kết xuất trình duyệt khám phá các mô hình toán học, thuật toán và nguyên tắc kiến trúc làm nền tảng cho cách trình duyệt chuyển đổi HTML, CSS và JavaScript thành pixel trên màn hình, tối ưu hóa cho hiệu suất và trải nghiệm người dùng.

## Table of Contents
1. [Rendering Pipeline Theory](#rendering-pipeline-theory)
2. [DOM and CSSOM Theory](#dom-and-cssom-theory)
3. [Layout Algorithms](#layout-algorithms)
4. [Paint and Composite Theory](#paint-and-composite-theory)
5. [Reflow and Repaint Theory](#reflow-and-repaint-theory)
6. [Graphics Rendering](#graphics-rendering)
7. [Animation Theory](#animation-theory)
8. [Performance Models](#performance-models)
9. [Rendering Optimization](#rendering-optimization)
10. [Future Rendering Models](#future-rendering-models)

## Rendering Pipeline Theory

### Critical Rendering Path

**Pipeline Stages:**
1. **Parse HTML** → DOM Tree
2. **Parse CSS** → CSSOM Tree
3. **Combine** → Render Tree
4. **Layout** → Geometry
5. **Paint** → Pixels
6. **Composite** → Final Image

**Dependency Graph:**
```
HTML → DOM ─┐
            ├→ Render Tree → Layout → Paint → Composite
CSS → CSSOM ─┘
```

**Blocking Resources:**
- CSS blocks rendering
- JavaScript blocks parsing (unless async/defer)
- Images don't block rendering

**Critical Path Length:**
Number of round trips to render above-the-fold content.

**Critical Bytes:**
Total bytes needed for critical resources.

### Parse Theory

**HTML Parsing:**
- Tokenization: HTML → Tokens
- Tree construction: Tokens → DOM
- Incremental: Process as bytes arrive

**Tokenizer State Machine:**
States for different contexts (data, tag open, attribute, etc.)

**Tree Builder:**
Maintains stack of open elements.

**Error Recovery:**
HTML5 specifies error handling.

**CSS Parsing:**
- Tokenization: CSS → Tokens
- Parsing: Tokens → Rules
- CSSOM construction

**CSS Grammar:**
Context-free grammar for CSS syntax.

**Selector Parsing:**
Right-to-left for efficiency.

### Render Tree Construction

**Render Object:**
Node in render tree corresponding to visual element.

**Mapping:**
- DOM node → Render object (if visible)
- display: none → No render object
- Pseudo-elements → Render objects

**Attachment:**
Process of creating render objects from DOM.

**Style Resolution:**
Compute final styles for each element.

**Cascade Algorithm:**
1. Collect rules
2. Sort by specificity
3. Apply in order
4. Resolve conflicts

## DOM and CSSOM Theory

### DOM Theory

**Tree Structure:**
- Nodes: Elements, text, comments
- Edges: Parent-child relationships
- Root: Document node

**Node Types:**
- Element: HTML elements
- Text: Text content
- Comment: Comments
- Document: Root
- DocumentFragment: Lightweight container

**Tree Operations:**
- Traversal: DFS, BFS
- Mutation: Insert, remove, replace
- Query: getElementById, querySelector

**Complexity:**
- Traversal: O(n)
- Query by ID: O(1) with hash map
- Query by selector: O(n) worst case

### CSSOM Theory

**Style Rules:**
Selector + Declaration block

**Specificity:**
(a, b, c, d) where:
- a: Inline styles
- b: ID selectors
- c: Class, attribute, pseudo-class
- d: Element, pseudo-element

**Comparison:**
Lexicographic order.

**Inheritance:**
Some properties inherit from parent.

**Computed Values:**
Resolve relative units to absolute.

**Used Values:**
Final values after layout.

### Shadow DOM

**Encapsulation:**
Isolate DOM subtree.

**Shadow Root:**
Root of shadow tree.

**Shadow Host:**
Element hosting shadow tree.

**Composition:**
Merge shadow and light DOM.

**Slot Mechanism:**
Distribute light DOM into shadow DOM.

**Style Scoping:**
Styles don't leak in/out.

## Layout Algorithms

### Box Model Theory

**Box Components:**
- Content: Actual content
- Padding: Space around content
- Border: Border around padding
- Margin: Space outside border

**Box Sizing:**
- content-box: Width/height apply to content
- border-box: Width/height include padding and border

**Containing Block:**
Rectangle defining coordinate system.

**Formatting Context:**
Independent layout environment.

### Flow Layout

**Normal Flow:**
Default layout algorithm.

**Block Formatting Context:**
- Blocks stack vertically
- Margins collapse
- Floats contained

**Inline Formatting Context:**
- Inlines flow horizontally
- Line breaking
- Vertical alignment

**Float Theory:**
- Remove from normal flow
- Shift to side
- Text wraps around

**Clear:**
Move below floats.

### Flexbox Theory

**Flex Container:**
Element with display: flex.

**Flex Items:**
Children of flex container.

**Main Axis:**
Primary direction (row or column).

**Cross Axis:**
Perpendicular to main axis.

**Flex Algorithm:**
1. Determine flex base size
2. Resolve flexible lengths
3. Distribute free space
4. Align items

**Flex Grow/Shrink:**
- Grow: Distribute positive free space
- Shrink: Distribute negative free space

**Flex Basis:**
Initial size before distribution.

**Mathematical Model:**
```
final_size = flex_basis + (free_space × flex_grow / sum_flex_grow)
```

### Grid Layout

**Grid Container:**
Element with display: grid.

**Grid Items:**
Children of grid container.

**Grid Tracks:**
Rows and columns.

**Grid Lines:**
Boundaries between tracks.

**Grid Areas:**
Rectangular regions.

**Track Sizing Algorithm:**
1. Initialize track sizes
2. Resolve intrinsic sizes
3. Maximize tracks
4. Expand flexible tracks

**fr Unit:**
Fraction of available space.

**Auto-Placement:**
Algorithm for placing items not explicitly positioned.

### Absolute Positioning

**Positioned Element:**
position: absolute, relative, fixed, sticky.

**Containing Block:**
Nearest positioned ancestor.

**Offset Properties:**
top, right, bottom, left.

**Centering:**
```
position: absolute;
top: 50%; left: 50%;
transform: translate(-50%, -50%);
```

**Stacking Context:**
3D ordering of elements.

**z-index:**
Order within stacking context.

## Paint and Composite Theory

### Paint Theory

**Paint Order:**
1. Background
2. Border
3. Content
4. Outline

**Stacking Order:**
1. Background/borders of root
2. Negative z-index stacking contexts
3. Block-level descendants in flow
4. Floats
5. Inline descendants
6. z-index: 0 stacking contexts
7. Positive z-index stacking contexts

**Paint Invalidation:**
Determine what needs repainting.

**Damage Rectangles:**
Regions that need repainting.

**Dirty Bit Propagation:**
Mark ancestors as needing paint.

### Layer Theory

**Compositing Layer:**
Separate surface for painting.

**Layer Promotion:**
Criteria for creating layer:
- 3D transforms
- Video/canvas
- Filters
- Opacity animations
- will-change

**Layer Tree:**
Hierarchy of compositing layers.

**Benefits:**
- Isolate repaints
- GPU acceleration
- Smooth animations

**Costs:**
- Memory overhead
- Texture uploads

### Rasterization

**Rasterization:**
Convert vector graphics to pixels.

**Scanline Algorithm:**
Process one scanline at a time.

**Anti-Aliasing:**
Smooth edges by blending colors.

**Subpixel Rendering:**
Use RGB subpixels for sharper text.

**GPU Rasterization:**
Use GPU for rasterization.

**Tiling:**
Divide into tiles for parallel processing.

### Compositing

**Compositor Thread:**
Separate thread for compositing.

**Layer Transforms:**
Apply transforms to layers.

**Blending:**
Combine layers with opacity.

**Clipping:**
Restrict drawing to region.

**Masking:**
Use alpha channel for transparency.

**Compositing Algorithm:**
Back-to-front or front-to-back.

## Reflow and Repaint Theory

### Reflow Theory

**Reflow (Layout):**
Recalculate positions and sizes.

**Triggers:**
- DOM mutations
- Style changes affecting layout
- Window resize
- Font loading

**Scope:**
- Global: Entire document
- Local: Subtree

**Incremental Reflow:**
Only reflow affected subtree.

**Dirty Bit System:**
Mark nodes needing reflow.

**Reflow Propagation:**
- Width changes propagate up
- Height changes propagate down

**Complexity:**
O(n) in number of nodes (worst case).

### Repaint Theory

**Repaint:**
Redraw pixels without layout change.

**Triggers:**
- Color changes
- Background changes
- Visibility changes

**Cheaper than Reflow:**
No geometry calculation.

**Paint Invalidation:**
Determine repaint regions.

**Damage Tracking:**
Track changed regions.

### Optimization Strategies

**Batch DOM Changes:**
Minimize reflow/repaint cycles.

**Read-Write Separation:**
Batch reads, then writes.

**Layout Thrashing:**
Interleaved reads and writes cause multiple reflows.

**Example:**
```
// Bad: Layout thrashing
for (let el of elements) {
  const height = el.offsetHeight; // Read (reflow)
  el.style.height = height + 10 + 'px'; // Write
}

// Good: Batch
const heights = elements.map(el => el.offsetHeight); // Batch reads
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + 'px'; // Batch writes
});
```

**DocumentFragment:**
Build DOM off-document, then attach.

**CSS Containment:**
Limit reflow scope with contain property.

## Graphics Rendering

### 2D Graphics

**Canvas API:**
Immediate mode rendering.

**Drawing Operations:**
- Paths: moveTo, lineTo, arc
- Fills: fillRect, fill
- Strokes: strokeRect, stroke
- Text: fillText, strokeText

**Transformations:**
- Translate: Move origin
- Rotate: Rotate coordinate system
- Scale: Scale coordinate system
- Transform matrix: General transformation

**Compositing:**
globalCompositeOperation for blending.

**Performance:**
- Batch operations
- Use layers
- Avoid state changes

### 3D Graphics (WebGL)

**Graphics Pipeline:**
1. Vertex Shader: Transform vertices
2. Rasterization: Generate fragments
3. Fragment Shader: Color fragments
4. Blending: Combine with framebuffer

**Vertex Shader:**
```glsl
attribute vec3 position;
uniform mat4 modelViewProjection;

void main() {
  gl_Position = modelViewProjection * vec4(position, 1.0);
}
```

**Fragment Shader:**
```glsl
precision mediump float;
uniform vec4 color;

void main() {
  gl_FragColor = color;
}
```

**Buffers:**
- Vertex Buffer: Vertex data
- Index Buffer: Triangle indices
- Framebuffer: Render target

**Textures:**
Images mapped to geometry.

**Shaders:**
Programs running on GPU.

### SVG Rendering

**Vector Graphics:**
Resolution-independent.

**DOM-Based:**
SVG elements in DOM.

**Rendering:**
- Parse SVG
- Build render tree
- Rasterize paths

**Performance:**
- Complex paths expensive
- Many elements slow
- Use CSS transforms for animation

## Animation Theory

### Frame Rate Theory

**Frame Rate:**
Frames per second (fps).

**60 fps Target:**
16.67ms per frame.

**Frame Budget:**
Time available for each frame.

**Jank:**
Dropped frames causing stuttering.

**Vsync:**
Synchronize with display refresh.

### requestAnimationFrame

**Timing:**
Callback before next repaint.

**Benefits:**
- Synchronized with display
- Paused when tab inactive
- Batched with other animations

**Usage:**
```
function animate() {
  // Update state
  // Render
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

**Timestamp:**
High-resolution timestamp passed to callback.

### CSS Animations

**Keyframes:**
Define animation states.

**Interpolation:**
Compute intermediate values.

**Timing Functions:**
- linear: Constant speed
- ease: Slow start/end
- cubic-bezier: Custom curve

**Animation Properties:**
- duration: Length
- delay: Start delay
- iteration-count: Repetitions
- direction: Forward/reverse
- fill-mode: Before/after behavior

**Compositing:**
Animations on compositor thread.

**Transform and Opacity:**
Cheap to animate (compositor-only).

### Web Animations API

**Programmatic Control:**
JavaScript API for animations.

**Animation Object:**
Represents animation.

**KeyframeEffect:**
Defines animation effect.

**Timeline:**
Controls animation progress.

**Playback Control:**
play, pause, reverse, cancel.

**Synchronization:**
Coordinate multiple animations.

## Performance Models

### RAIL Model

**Response:**
Process events in < 100ms.

**Animation:**
Produce frame in < 16ms.

**Idle:**
Maximize idle time.

**Load:**
Deliver content in < 1s.

**User Perception:**
- 0-16ms: Instant
- 16-100ms: Slight delay
- 100-1000ms: Task focus
- 1000ms+: Context switch
- 10000ms+: Abandon

### Performance Metrics

**First Paint (FP):**
First pixel rendered.

**First Contentful Paint (FCP):**
First content rendered.

**Largest Contentful Paint (LCP):**
Largest content element rendered.

**Time to Interactive (TTI):**
Page fully interactive.

**First Input Delay (FID):**
Time to process first input.

**Cumulative Layout Shift (CLS):**
Visual stability metric.

**Speed Index:**
How quickly content is visually displayed.

### Critical Path Optimization

**Minimize Critical Resources:**
Reduce number of blocking resources.

**Minimize Critical Bytes:**
Reduce size of critical resources.

**Minimize Critical Path Length:**
Reduce round trips.

**Techniques:**
- Inline critical CSS
- Defer non-critical CSS
- Async/defer JavaScript
- Preload key resources
- HTTP/2 server push

## Rendering Optimization

### Layer Optimization

**Promote to Layer:**
```css
will-change: transform;
transform: translateZ(0);
```

**Benefits:**
- Isolate repaints
- GPU acceleration

**Costs:**
- Memory
- Texture uploads

**Guidelines:**
- Promote sparingly
- Remove after animation

### Paint Optimization

**Reduce Paint Area:**
Minimize repaint regions.

**Simplify Paint Complexity:**
- Avoid expensive properties (box-shadow, gradients)
- Use simpler effects

**Paint Flashing:**
Visualize paint regions.

**Paint Profiling:**
Measure paint time.

### Composite Optimization

**Compositor-Only Properties:**
- transform
- opacity

**Avoid Layout:**
Don't trigger reflow.

**Avoid Paint:**
Don't trigger repaint.

**Layer Squashing:**
Combine layers to reduce memory.

### JavaScript Optimization

**Minimize Main Thread Work:**
- Offload to workers
- Use requestIdleCallback
- Break up long tasks

**Avoid Layout Thrashing:**
Batch DOM reads and writes.

**Debounce/Throttle:**
Limit event handler frequency.

**Virtual Scrolling:**
Render only visible items.

## Future Rendering Models

### Houdini

**CSS Typed OM:**
Typed JavaScript API for CSS.

**Paint API:**
Custom paint functions.

**Layout API:**
Custom layout algorithms.

**Animation Worklet:**
High-performance animations.

**Benefits:**
- Extensibility
- Performance
- Polyfills

### WebGPU

**Next-Gen Graphics API:**
Successor to WebGL.

**Compute Shaders:**
General-purpose GPU computation.

**Modern GPU Features:**
- Compute pipelines
- Better performance
- Lower overhead

**Use Cases:**
- 3D graphics
- Machine learning
- Scientific computing

### Concurrent Rendering

**React Fiber:**
Incremental rendering.

**Time Slicing:**
Break rendering into chunks.

**Suspense:**
Coordinate async rendering.

**Priority:**
Prioritize important updates.

**Benefits:**
- Responsive UI
- Smooth animations
- Better UX

## Interview Questions

**Q: Explain the critical rendering path and how to optimize it.**

A: Critical rendering path is the sequence of steps browsers take to render: Parse HTML → DOM, Parse CSS → CSSOM, Combine → Render Tree, Layout → Geometry, Paint → Pixels, Composite → Screen. Optimization: (1) Minimize critical resources - inline critical CSS, defer non-critical, (2) Minimize critical bytes - compress, minify, (3) Minimize critical path length - reduce round trips, use HTTP/2. CSS blocks rendering, JavaScript blocks parsing. Async/defer JavaScript, preload key resources.

**Q: What causes reflow and repaint, and how do they differ?**

A: Reflow (layout) recalculates positions/sizes when geometry changes (DOM mutations, style changes affecting layout, window resize). Repaint redraws pixels when visual properties change without layout (color, background, visibility). Reflow is more expensive - requires geometry calculation and triggers repaint. Repaint is cheaper - just redraw. Optimization: batch DOM changes, separate reads/writes to avoid layout thrashing, use CSS containment to limit scope.

**Q: Explain compositing layers and when to use them.**

A: Compositing layers are separate surfaces for painting, promoted for 3D transforms, video/canvas, filters, opacity animations, will-change. Benefits: isolate repaints, GPU acceleration, smooth animations. Costs: memory overhead, texture uploads. Use for animated elements, but sparingly - too many layers hurt performance. Remove will-change after animation. Compositor thread handles transforms/opacity without main thread, enabling 60fps animations.

**Q: How does flexbox layout algorithm work?**

A: Flexbox algorithm: (1) Determine flex base size (flex-basis or content size), (2) Resolve flexible lengths - calculate free space, (3) Distribute free space using flex-grow (positive) or flex-shrink (negative), (4) Align items on cross axis. Formula: final_size = flex_basis + (free_space × flex_grow / sum_flex_grow). Main axis is primary direction (row/column), cross axis is perpendicular. Flex container establishes flex formatting context.

**Q: Explain the difference between Canvas and SVG rendering.**

A: Canvas is immediate mode - draw commands execute immediately, no retained scene graph. Good for many objects, pixel manipulation, games. SVG is retained mode - DOM-based vector graphics, resolution-independent. Good for interactive graphics, accessibility, fewer objects. Canvas: faster for many objects, manual redraw needed. SVG: slower for many objects, automatic redraw, DOM manipulation. Canvas uses rasterization, SVG uses vector paths. Choose based on use case.

---

[← Back to JavaScript Language Theory](./01-javascript-language-theory.md) | [Next: CSS Theory →](./03-css-theory.md)
