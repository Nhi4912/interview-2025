# Rendering Optimization - Theoretical Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Core Web Vitals](./01-core-web-vitals.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Batdongsan.com.vn (real estate):** User scroll qua danh sách bất động sản — scroll jerky, không smooth. Chrome DevTools Performance tab: mỗi scroll event trigger `layout` (reflow) vì code đọc `element.offsetHeight` trong animation loop. Fix: đọc layout properties trước (read phase), sau đó thực hiện DOM mutations (write phase). Kết quả: scroll từ 20 FPS lên 60 FPS.

**Bài học:** Browser rendering pipeline không phải magic. Biết khi nào code trigger reflow vs repaint vs composite quyết định hiệu năng UI ở 60 FPS hay không.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Browser rendering giống quy trình in ấn: JavaScript viết nội dung → Style tính màu sắc → Layout đo kích thước và vị trí → Paint tô màu → Composite ghép các lớp. Forcing browser làm lại Layout giữa chừng (reflow) như yêu cầu in lại toàn bộ tài liệu mỗi khi thay một từ.

**Why 60 FPS matters:** Mỗi frame có 16.67ms (1000ms/60). Layout + Paint chiếm nhiều thời gian nhất. Mục tiêu: giữ JavaScript < 10ms mỗi frame để browser còn thời gian render.

## Concept Map / Bản Đồ Khái Niệm

```
[Pixel Pipeline (browser rendering)]
        │
        JS → Style → Layout → Paint → Composite
        │
        Optimization: skip expensive stages
        │
        ├── Skip Layout + Paint: only transform/opacity → GPU Composite only
        ├── Skip Layout: change color → repaint only (no reflow)
        └── Trigger Layout: change width/height/position → full pipeline (slow)
        │
[Layout thrashing (forced reflow)]
        Read offsetHeight → Write style → Read offsetHeight → Write style...
        ↑ Interleaving reads and writes forces multiple layout calculations
        Fix: batch reads first, then batch writes (FastDOM pattern)
```

---

## Understanding Browser Rendering Performance

**English:** Rendering optimization focuses on minimizing the work browsers must do to display and update web pages, ensuring smooth 60 FPS performance and responsive user interfaces.

**Tiếng Việt:** Tối ưu hóa rendering tập trung vào việc giảm thiểu công việc mà trình duyệt phải làm để hiển thị và cập nhật trang web, đảm bảo hiệu suất 60 FPS mượt mà và giao diện người dùng phản hồi nhanh.

## Rendering Pipeline Theory

### Pixel Pipeline

**Five Stages:**

1. **JavaScript:** Trigger visual changes
2. **Style:** Calculate styles
3. **Layout:** Calculate geometry
4. **Paint:** Fill in pixels
5. **Composite:** Draw layers to screen

**Stage Costs:**

**JavaScript:** Variable (depends on code)
**Style:** ~0.5ms per 1000 elements
**Layout:** ~1-2ms per 1000 elements
**Paint:** ~2-3ms per 1000 elements
**Composite:** ~0.5-1ms

**Total Budget:** 16.67ms for 60 FPS

### Layout (Reflow) Theory

**Definition:** Layout calculates the position and size of elements on the page.

**When Layout Occurs:**

**Geometric Changes:**
- width, height, padding, margin, border
- position, top, left, right, bottom
- display, float, clear
- font-size, line-height
- text-align, vertical-align

**Layout Scope:**

**Global Layout:** Affects entire document
**Incremental Layout:** Affects subtree only
**Dirty Bit System:** Marks changed elements

**Layout Thrashing:**

**Theory:** Interleaving reads and writes forces multiple synchronous layouts.

**Problem Pattern:**
```
Read layout property → Forces layout
Write style → Invalidates layout
Read layout property → Forces layout again
Write style → Invalidates layout again
```

**Cost:** Each forced layout is expensive (1-2ms)

**Solution:** Batch reads together, then batch writes

**Layout Boundaries:**

Certain properties create layout boundaries:
- overflow: hidden/scroll/auto
- position: absolute/fixed
- transform (creates layer)
- contain: layout

**Benefits:**
- Limit layout scope
- Improve performance
- Enable parallel work

### Paint Theory

**Definition:** Paint fills in pixels for visual properties.

**Paint Triggers:**

**Visual Properties:**
- color, background-color
- border-color, border-radius
- box-shadow, text-shadow
- visibility, opacity
- background-image

**Paint Complexity:**

**Simple Properties:** Fast
- Solid colors
- Simple borders

**Complex Properties:** Slow
- Gradients
- Shadows
- Filters
- Blend modes

**Paint Area:**

Larger paint areas cost more:
- Full-screen repaints expensive
- Minimize paint regions
- Use layer promotion strategically

**Paint Layers:**

**Theory:** Browser divides page into layers for efficient painting.

**Layer Creation Triggers:**
- 3D transforms (translateZ, rotate3d)
- will-change property
- video, canvas, iframe elements
- CSS filters
- Opacity animations
- Position: fixed

**Layer Benefits:**
- Isolated repainting
- GPU acceleration
- Smooth animations
- Parallel processing

**Layer Costs:**
- Memory overhead (texture storage)
- Layer management overhead
- Compositing cost
- Too many layers harmful

### Composite Theory

**Definition:** Compositing combines painted layers into final image.

**Compositor Thread:**

**Theory:** Separate thread handles compositing, independent of main thread.

**Benefits:**
- Animations don't block JavaScript
- Smooth scrolling
- Parallel processing
- GPU acceleration

**Composite-Only Properties:**

Only two properties can be composited without layout/paint:
- **transform:** All transform functions
- **opacity:** Transparency changes

**Why These Properties:**
- Don't affect document flow
- Don't change element geometry
- Can be handled by GPU
- Compositor thread only

**Animation Performance:**

**60 FPS Requirement:**
- 16.67ms per frame
- ~10ms for JavaScript
- ~6ms for rendering

**Achieving 60 FPS:**
- Use transform/opacity only
- Avoid layout/paint during animation
- Promote to layer with will-change
- Use requestAnimationFrame

## Optimization Strategies

### CSS Containment

**Theory:** Limit scope of browser's layout, style, and paint work.

**Contain Property:**

**contain: layout**
- Element's internal layout isolated
- Changes don't affect outside
- Enables parallel layout

**contain: paint**
- Element's descendants don't paint outside
- Enables paint optimization
- Clips overflow

**contain: size**
- Element's size independent of children
- Enables size optimization
- Requires explicit dimensions

**contain: style**
- Style changes don't escape
- Counters and quotes scoped

**contain: strict**
- Equivalent to: layout paint size style
- Maximum optimization
- Strictest containment

**contain: content**
- Equivalent to: layout paint style
- Common use case
- Balances optimization and flexibility

**Benefits:**
- Faster rendering
- Predictable performance
- Better for dynamic content
- Enables browser optimizations

### Content-Visibility

**Theory:** Control whether element's contents are rendered.

**Values:**

**visible:** Normal rendering (default)
**hidden:** Skip rendering, maintain layout space
**auto:** Browser decides based on visibility

**content-visibility: auto:**

**Behavior:**
- Skip rendering for off-screen content
- Render when near viewport
- Massive performance improvement
- Automatic optimization

**Use Cases:**
- Long lists
- Infinite scroll
- Large documents
- Complex layouts

**Considerations:**
- Layout shifts possible
- Use contain-intrinsic-size
- Affects accessibility
- Browser support

### Will-Change Property

**Theory:** Hint to browser about upcoming changes.

**Purpose:**
- Prepare optimizations in advance
- Create layers proactively
- Improve animation performance

**Values:**
- auto: No hint
- scroll-position: Scrolling expected
- contents: Content will change
- Specific properties: transform, opacity, etc.

**Best Practices:**

**Do:**
- Use sparingly
- Apply before animation
- Remove after animation
- Target specific properties

**Don't:**
- Apply to many elements
- Leave on permanently
- Use as premature optimization
- Apply to root elements

**Memory Impact:**

Each will-change creates layer:
- Texture memory allocated
- GPU resources used
- Can exhaust memory
- Monitor usage

## Virtual Scrolling Theory

### Concept

**Definition:** Render only visible items in large lists, recycling DOM elements.

**Theoretical Foundation:**

**Problem:** Rendering 10,000 items creates 10,000 DOM nodes
**Solution:** Render only ~20 visible items, reuse nodes

**Benefits:**
- Constant DOM size
- O(1) rendering time
- Smooth scrolling
- Lower memory usage

**Challenges:**
- Complex implementation
- Variable item heights
- Scroll position calculation
- Accessibility concerns

### Implementation Theory

**Core Algorithm:**

1. **Calculate Visible Range:**
   - Scroll position
   - Viewport height
   - Item height
   - Determine visible indices

2. **Render Visible Items:**
   - Create/reuse DOM nodes
   - Position absolutely
   - Update content

3. **Handle Scrolling:**
   - Update visible range
   - Recycle nodes
   - Maintain scroll position

**Windowing:**

**Fixed Height:**
- Simple calculation
- Fast performance
- Limited flexibility

**Variable Height:**
- Measure each item
- Cache measurements
- More complex
- Better UX

**Overscan:**

Render extra items above/below viewport:
- Prevents blank areas during fast scroll
- Trade-off: performance vs UX
- Typical: 2-5 extra items

## React Rendering Optimization

### Reconciliation Theory

**Definition:** Process of comparing virtual DOM trees to determine minimal changes.

**Algorithm:**

**Diffing Heuristics:**

1. **Different Types:** Replace entire subtree
2. **Same Type:** Update props only
3. **Keys:** Identify elements across renders

**Complexity:**

- Naive algorithm: O(n³)
- React's algorithm: O(n)
- Heuristics enable linear time

**Key Importance:**

**Theory:** Keys help React identify which items changed.

**Without Keys:**
- React compares by position
- May reuse wrong elements
- Causes bugs and performance issues

**With Keys:**
- React tracks elements by key
- Correct element reuse
- Minimal DOM operations

**Key Requirements:**
- Stable across renders
- Unique among siblings
- Not array index (for dynamic lists)

### React Fiber Architecture

**Theory:** Reimplementation of React's core algorithm enabling incremental rendering.

**Goals:**

1. **Pause Work:** Split work into chunks
2. **Prioritize:** Assign priority to updates
3. **Reuse Work:** Cache completed work
4. **Abort Work:** Discard obsolete work

**Fiber Structure:**

Each fiber represents:
- Component instance
- Work to be done
- Relationships (parent, child, sibling)
- State and props

**Phases:**

**Render Phase:** (Interruptible)
- Build fiber tree
- Calculate changes
- Can be paused/resumed

**Commit Phase:** (Synchronous)
- Apply changes to DOM
- Run effects
- Cannot be interrupted

**Priority Levels:**

1. Immediate: User input
2. User-blocking: Hover, scroll
3. Normal: Data fetching
4. Low: Analytics
5. Idle: Background work

### Concurrent Rendering

**Theory:** Render multiple versions of UI simultaneously.

**Concepts:**

**Time Slicing:**
- Break rendering into chunks
- Yield to browser between chunks
- Maintain responsiveness

**Suspense:**
- Declarative loading states
- Coordinate async operations
- Prevent waterfalls

**Transitions:**
- Mark updates as non-urgent
- Keep UI responsive
- Show previous state during update

**Benefits:**
- Better perceived performance
- Smoother interactions
- Prioritized updates
- Improved UX

## Interview Questions

**Q: What causes layout thrashing?**

A: Interleaving layout reads and style writes forces multiple synchronous layouts. Each read forces layout calculation, write invalidates it. Solution: batch all reads, then all writes.

**Q: Which CSS properties trigger layout/paint/composite?**

A: Layout: width, height, margin, padding, position. Paint: color, background, border-radius, shadow. Composite only: transform, opacity. Use transform/opacity for animations.

**Q: Explain virtual scrolling.**

A: Technique rendering only visible items in large lists by recycling DOM elements. Maintains constant DOM size regardless of list length. Provides O(1) rendering time and smooth scrolling.

**Q: What is React Fiber?**

A: Reimplementation of React's reconciliation algorithm enabling incremental rendering. Allows pausing work, prioritizing updates, reusing work, and aborting obsolete work. Foundation for concurrent features.

**Q: How does content-visibility improve performance?**

A: content-visibility: auto skips rendering off-screen content. Browser only renders when element near viewport. Massive performance improvement for long pages with minimal code changes.

---

[← Back to Web Performance](./04-web-performance-comprehensive.md) | [Next: Bundle Optimization →](./03-bundle-optimization.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I name the 5 stages of the pixel pipeline and which CSS properties trigger each?
- [ ] Can I explain layout thrashing and the FastDOM pattern to fix it?
- [ ] Can I explain why `transform` and `opacity` are the only properties safe for 60 FPS animations?
- [ ] Can I use Chrome DevTools Performance → Layers panel to identify composited layers?
- [ ] Can I explain `will-change: transform` — what it does and when to remove it?
- 💬 **Feynman Prompt:** Giải thích tại sao `position: fixed` trên một element làm chậm scroll — và tại sao dùng `transform: translateZ(0)` "fix" được điều đó (hint: composite layer)?

## Connections / Liên Kết

- ⬅️ **Built on**: [Core Web Vitals](./01-core-web-vitals.md) — CLS and INP are directly affected by rendering performance
- ⬅️ **Built on**: [React Performance](./02-react-performance.md) — React's virtual DOM avoids unnecessary browser layout
- 🔗 **Applied in**: [CSS Fundamentals](../05-html-css/00-css-fundamentals.md) — CSS property choices affect rendering pipeline
