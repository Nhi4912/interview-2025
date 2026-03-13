# Web Performance - Comprehensive Theoretical Guide

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Understanding Performance from First Principles

[← Back to Bundle Optimization](./03-bundle-optimization.md) | [Next: Security →](../07-web-security/01-common-vulnerabilities.md)

---

## 📋 Table of Contents

1. [Performance Fundamentals](#performance-fundamentals)
2. [Performance Metrics Theory](#performance-metrics-theory)
3. [Critical Rendering Path](#critical-rendering-path)
4. [Network Performance](#network-performance)
5. [JavaScript Performance](#javascript-performance)
6. [Rendering Performance](#rendering-performance)
7. [Memory Performance](#memory-performance)
8. [Perceived Performance](#perceived-performance)
9. [Performance Budgets](#performance-budgets)
10. [Measurement & Monitoring](#measurement-monitoring)
11. [Interview Questions](#interview-questions)

---

## 🎯 Learning Objectives

Master web performance theory:
- Understand performance metrics deeply
- Learn optimization principles
- Comprehend browser rendering
- Master performance measurement
- Apply optimization strategies
- Design performant systems

---

## Performance Fundamentals

### What is Web Performance?

**English Definition:** Web performance refers to the speed at which web pages are downloaded, rendered, and become interactive, as well as how smoothly they respond to user interactions.

**Định nghĩa (Tiếng Việt):** Hiệu suất web đề cập đến tốc độ mà các trang web được tải xuống, hiển thị và trở nên tương tác, cũng như mức độ mượt mà khi phản hồi các tương tác của người dùng.

### Performance Mind Map

```
Web Performance
│
├── Loading Performance
│   ├── Network Latency
│   ├── Resource Size
│   ├── Critical Path
│   └── Caching Strategy
│
├── Rendering Performance
│   ├── Layout/Reflow
│   ├── Paint
│   ├── Composite
│   └── Frame Rate
│
├── JavaScript Performance
│   ├── Execution Time
│   ├── Parse/Compile
│   ├── Memory Usage
│   └── Event Loop
│
├── Perceived Performance
│   ├── First Contentful Paint
│   ├── Time to Interactive
│   ├── Visual Stability
│   └── User Experience
│
└── Optimization Strategies
    ├── Code Splitting
    ├── Lazy Loading
    ├── Compression
    ├── Caching
    └── Resource Hints
```

### Why Performance Matters

**Theoretical Foundation:**

**1. User Experience Impact**

**Theory:** Performance directly affects user satisfaction, engagement, and conversion rates.

**Research Findings:**
- 100ms delay → 1% drop in conversions (Amazon)
- 1 second delay → 11% fewer page views (BBC)
- 53% mobile users abandon sites taking >3s (Google)

**Psychological Factors:**
- **Attention Span:** Users expect instant responses
- **Cognitive Load:** Slow sites increase mental effort
- **Trust:** Performance signals quality and reliability
- **Frustration:** Delays cause negative emotions

**2. Business Impact**

**Theory:** Performance optimization has measurable business value.

**Economic Factors:**
- **Conversion Rate:** Faster sites convert better
- **Bounce Rate:** Slow sites lose visitors
- **SEO Ranking:** Google uses performance as ranking factor
- **Infrastructure Cost:** Efficient sites cost less to run

**3. Technical Constraints**

**Theory:** Performance is bounded by physical and technological limits.

**Constraints:**
- **Network Speed:** Bandwidth and latency limits
- **Device Capability:** CPU, memory, battery constraints
- **Browser Limitations:** Parsing, rendering capacity
- **Physics:** Speed of light limits latency

### Performance Principles

**1. Minimize Critical Resources**

**Theory:** Reduce the number of resources required for initial render.

**Critical Resources:**
- HTML document
- Blocking CSS
- Blocking JavaScript
- Critical images/fonts

**Optimization:**
- Inline critical CSS
- Defer non-critical JavaScript
- Lazy load below-fold content
- Use resource hints

**2. Minimize Critical Bytes**

**Theory:** Reduce the size of resources needed for initial render.

**Techniques:**
- Minification
- Compression (gzip, Brotli)
- Tree shaking
- Code splitting
- Image optimization

**3. Minimize Critical Path Length**

**Theory:** Reduce the number of round trips required to render.

**Round Trip Time (RTT):**
- DNS lookup
- TCP handshake
- TLS negotiation
- HTTP request/response

**Optimization:**
- HTTP/2 multiplexing
- Server push
- Preconnect
- CDN usage

---

## Performance Metrics Theory

### Core Web Vitals

**Definition:** Google's initiative to provide unified guidance for quality signals essential to delivering great user experience.

**Định nghĩa:** Sáng kiến của Google nhằm cung cấp hướng dẫn thống nhất cho các tín hiệu chất lượng cần thiết để mang lại trải nghiệm người dùng tuyệt vời.

**Three Core Metrics:**

**1. Largest Contentful Paint (LCP)**

**Theory:** Measures loading performance by tracking when the largest content element becomes visible.

**Theoretical Foundation:**
- Represents perceived load speed
- Focuses on main content
- User-centric metric

**What Counts:**
- `<img>` elements
- `<image>` inside `<svg>`
- `<video>` poster images
- Background images via CSS
- Block-level text elements

**Good Threshold:** ≤ 2.5 seconds

**Optimization Factors:**
- Server response time
- Resource load time
- Client-side rendering
- Render-blocking resources

**2. First Input Delay (FID)**

**Theory:** Measures interactivity by tracking the delay between user's first interaction and browser's response.

**Theoretical Foundation:**
- Represents responsiveness
- Captures real user experience
- Measures main thread availability

**What's Measured:**
- Click events
- Tap events
- Key presses
- Not scrolling or zooming

**Good Threshold:** ≤ 100 milliseconds

**Causes of Poor FID:**
- Long JavaScript tasks
- Heavy parsing/compilation
- Large bundle sizes
- Synchronous operations

**3. Cumulative Layout Shift (CLS)**

**Theory:** Measures visual stability by quantifying unexpected layout shifts during page lifetime.

**Theoretical Foundation:**
- Represents visual stability
- Prevents frustrating experiences
- Cumulative metric

**Calculation:**
```
CLS = Σ (Impact Fraction × Distance Fraction)
```

**Impact Fraction:** Percentage of viewport affected
**Distance Fraction:** Distance elements moved

**Good Threshold:** ≤ 0.1

**Common Causes:**
- Images without dimensions
- Ads/embeds/iframes without space
- Dynamically injected content
- Web fonts causing FOIT/FOUT

### Additional Performance Metrics

**1. First Contentful Paint (FCP)**

**Theory:** Measures when first content (text, image, canvas) is rendered.

**Significance:**
- First visual feedback
- Indicates page is loading
- User perceives progress

**Good Threshold:** ≤ 1.8 seconds

**2. Time to Interactive (TTI)**

**Theory:** Measures when page becomes fully interactive.

**Criteria:**
- Page has displayed useful content (FCP)
- Event handlers registered for visible elements
- Page responds to interactions within 50ms

**Good Threshold:** ≤ 3.8 seconds

**3. Total Blocking Time (TBT)**

**Theory:** Measures total time between FCP and TTI where main thread was blocked.

**Calculation:**
- Sum of blocking time for all long tasks
- Long task: >50ms
- Blocking time: Duration beyond 50ms

**Good Threshold:** ≤ 200 milliseconds

**4. Speed Index**

**Theory:** Measures how quickly content is visually displayed during page load.

**Calculation:**
- Based on visual progression
- Weighted by time
- Lower is better

**Good Threshold:** ≤ 3.4 seconds

### RAIL Performance Model

**Theory:** User-centric performance model that breaks down user experience into key actions.

**Định nghĩa:** Mô hình hiệu suất lấy người dùng làm trung tâm, chia nhỏ trải nghiệm người dùng thành các hành động chính.

**Four Aspects:**

**1. Response**

**Goal:** Process events in under 50ms

**Theory:** Users perceive delays >100ms as sluggish.

**Budget:**
- 50ms for processing
- 50ms buffer for browser work
- Total: 100ms perceived response

**2. Animation**

**Goal:** Produce frame in under 10ms

**Theory:** 60 FPS requires 16.67ms per frame.

**Budget:**
- 10ms for JavaScript
- 6ms for browser rendering
- Total: 16ms per frame

**3. Idle**

**Goal:** Maximize idle time

**Theory:** Use idle time for non-critical work.

**Strategy:**
- Break work into 50ms chunks
- Use requestIdleCallback
- Prioritize user interactions

**4. Load**

**Goal:** Deliver content in under 5 seconds

**Theory:** Users lose focus after 5 seconds.

**Targets:**
- First meaningful paint: <1s
- Time to interactive: <5s
- On slow 3G networks

---

## Critical Rendering Path

### Critical Rendering Path Theory

**Definition:** The sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels on screen.

**Định nghĩa:** Chuỗi các bước mà trình duyệt thực hiện để chuyển đổi HTML, CSS và JavaScript thành các pixel trên màn hình.

**Theoretical Model:**

The critical rendering path represents the minimum set of operations required to render initial view.

**Path Components:**

```
HTML → DOM
CSS → CSSOM
DOM + CSSOM → Render Tree
Render Tree → Layout
Layout → Paint
Paint → Composite
```

### DOM Construction Performance

**Theory:** DOM construction is incremental and can be optimized.

**Performance Characteristics:**

**Parsing Speed:**
- HTML parsing: ~1MB/s (varies by device)
- Incremental: Can start rendering before complete
- Streaming: Processes as bytes arrive

**Optimization Strategies:**

**1. Minimize HTML Size**
- Remove unnecessary markup
- Avoid deep nesting
- Use semantic HTML

**2. Optimize Parser Blocking**
- Defer non-critical scripts
- Use async for independent scripts
- Inline critical scripts

**3. Preload Critical Resources**
- `<link rel="preload">` for critical assets
- Prioritize above-fold content
- Use resource hints

### CSSOM Construction Performance

**Theory:** CSSOM construction blocks rendering until complete.

**Why Blocking:**
- CSS is render-blocking by design
- Prevents Flash of Unstyled Content (FOUC)
- Ensures consistent visual presentation

**Performance Impact:**

**CSS Size:**
- Larger CSS = longer parse time
- More rules = slower matching
- Complex selectors = slower computation

**Optimization Strategies:**

**1. Minimize CSS**
- Remove unused CSS
- Use CSS purging tools
- Split by media queries

**2. Optimize Delivery**
- Inline critical CSS
- Load non-critical CSS asynchronously
- Use media attributes

**3. Simplify Selectors**
- Avoid deep nesting
- Use classes over complex selectors
- Minimize specificity

### JavaScript Impact on CRP

**Theory:** JavaScript can block DOM construction and delay rendering.

**Blocking Behavior:**

**Parser Blocking:**
- Synchronous scripts block HTML parsing
- Must wait for script download and execution
- Delays DOM construction

**Render Blocking:**
- Scripts can modify CSSOM
- Must wait for CSSOM before executing
- Delays rendering

**Optimization Strategies:**

**1. Async Attribute**

**Theory:** Downloads script in parallel, executes when ready.

**Characteristics:**
- Doesn't block parsing
- Executes as soon as downloaded
- No execution order guarantee

**Use Case:** Independent scripts (analytics, ads)

**2. Defer Attribute**

**Theory:** Downloads script in parallel, executes after parsing.

**Characteristics:**
- Doesn't block parsing
- Executes in order
- Waits for DOM complete

**Use Case:** Scripts that need DOM

**3. Module Scripts**

**Theory:** `<script type="module">` defers by default.

**Characteristics:**
- Automatic defer behavior
- Supports ES modules
- Better for modern apps

### Render Tree Construction

**Theory:** Render tree combines DOM and CSSOM, containing only visible elements.

**Performance Considerations:**

**Tree Size:**
- Larger tree = more work
- Hidden elements excluded
- Pseudo-elements included

**Style Computation:**
- Cascade resolution
- Inheritance propagation
- Specificity calculation

**Optimization:**
- Minimize DOM depth
- Reduce CSS complexity
- Avoid forced synchronous layout

---

## Network Performance

### Network Performance Theory

**Definition:** Network performance encompasses latency, bandwidth, and protocol efficiency in delivering resources.

**Định nghĩa:** Hiệu suất mạng bao gồm độ trễ, băng thông và hiệu quả giao thức trong việc phân phối tài nguyên.

### Latency vs Bandwidth

**Latency Theory:**

**Definition:** Time delay between request and response.

**Components:**
- **Propagation Delay:** Physical distance / speed of light
- **Transmission Delay:** Packet size / bandwidth
- **Processing Delay:** Router/server processing
- **Queuing Delay:** Wait time in buffers

**Impact:**
- Affects initial connection
- Limits request/response cycles
- Cannot be eliminated (physics)
- Can be mitigated (CDN, caching)

**Bandwidth Theory:**

**Definition:** Maximum data transfer rate.

**Characteristics:**
- Measured in bits per second
- Affects large file transfers
- Less important for latency-bound operations
- Can be increased (better connection)

**Latency vs Bandwidth Trade-off:**

**Theory:** For web performance, latency often matters more than bandwidth.

**Reasoning:**
- Many small resources (HTML, CSS, JS)
- Each requires round trip
- Latency dominates small transfers
- Bandwidth matters for large files (images, videos)

### HTTP Protocol Performance

**HTTP/1.1 Limitations:**

**Theory:** HTTP/1.1 has fundamental performance limitations.

**Issues:**
- **Head-of-Line Blocking:** One request blocks others
- **No Multiplexing:** One request per connection
- **Redundant Headers:** Repeated on every request
- **No Server Push:** Server can't proactively send

**Workarounds:**
- Domain sharding (multiple domains)
- Resource concatenation (sprites, bundles)
- Inlining (data URIs)

**HTTP/2 Improvements:**

**Theory:** HTTP/2 addresses HTTP/1.1 limitations through multiplexing and compression.

**Features:**

**1. Multiplexing**
- Multiple requests over single connection
- Eliminates head-of-line blocking
- Reduces connection overhead

**2. Header Compression**
- HPACK compression algorithm
- Reduces header overhead
- Maintains header table

**3. Server Push**
- Server sends resources proactively
- Reduces round trips
- Requires careful configuration

**4. Stream Prioritization**
- Assign priority to requests
- Critical resources first
- Better resource utilization

**HTTP/3 (QUIC):**

**Theory:** HTTP/3 uses QUIC protocol over UDP to eliminate TCP limitations.

**Advantages:**
- No head-of-line blocking at transport layer
- Faster connection establishment (0-RTT)
- Better loss recovery
- Connection migration

### Caching Theory

**Definition:** Caching stores copies of resources closer to users to reduce latency and server load.

**Định nghĩa:** Caching lưu trữ các bản sao của tài nguyên gần người dùng hơn để giảm độ trễ và tải máy chủ.

**Cache Hierarchy:**

```
Browser Cache
  ↓
Service Worker Cache
  ↓
CDN Cache
  ↓
Reverse Proxy Cache
  ↓
Origin Server
```

**Cache-Control Directives:**

**Theory:** HTTP headers control caching behavior at each level.

**Directives:**

**1. max-age**
- Specifies cache lifetime in seconds
- Relative to response time
- Most common directive

**2. no-cache**
- Must revalidate before using cached copy
- Doesn't mean "don't cache"
- Ensures freshness

**3. no-store**
- Don't cache at all
- For sensitive data
- Privacy/security

**4. public vs private**
- public: Can be cached by any cache
- private: Only browser cache
- Affects CDN caching

**5. immutable**
- Resource never changes
- Skip revalidation
- Perfect for hashed assets

**Cache Validation:**

**Theory:** Determine if cached resource is still valid.

**Methods:**

**1. ETag**
- Hash/version of resource
- Server compares with If-None-Match
- Returns 304 if unchanged

**2. Last-Modified**
- Timestamp of last modification
- Server compares with If-Modified-Since
- Returns 304 if not modified

**Caching Strategies:**

**1. Cache-First**
- Check cache before network
- Fast but may serve stale
- Good for static assets

**2. Network-First**
- Try network, fallback to cache
- Fresh data preferred
- Good for dynamic content

**3. Stale-While-Revalidate**
- Serve cached, update in background
- Best of both worlds
- Requires service worker

---

## JavaScript Performance

### JavaScript Execution Performance

**Theory:** JavaScript execution performance depends on parsing, compilation, and runtime efficiency.

**Định nghĩa:** Hiệu suất thực thi JavaScript phụ thuộc vào phân tích cú pháp, biên dịch và hiệu quả thời gian chạy.

### Parse and Compile Cost

**Parsing Theory:**

**Definition:** Converting source code into Abstract Syntax Tree (AST).

**Cost Factors:**
- **Code Size:** Larger code = longer parse
- **Complexity:** Complex syntax = slower parse
- **Device:** Mobile devices 2-5x slower

**Parse Strategies:**

**1. Eager Parsing**
- Parse entire function immediately
- Build complete AST
- Ready for execution

**2. Lazy Parsing**
- Skip function bodies initially
- Parse when called
- May reparse later

**Optimization:**
- Minimize JavaScript size
- Code splitting
- Tree shaking
- Avoid large inline scripts

**Compilation Theory:**

**Definition:** Converting AST/bytecode into machine code.

**JIT Compilation:**
- Baseline compilation (fast, less optimized)
- Optimizing compilation (slow, highly optimized)
- Speculative optimization
- Deoptimization when needed

**Cost:**
- Compilation takes time
- Trade-off: compile time vs execution speed
- Hot code gets optimized
- Cold code stays interpreted

### Runtime Performance

**Long Tasks Theory:**

**Definition:** Tasks that block main thread for >50ms.

**Impact:**
- Delays user interactions
- Causes jank
- Poor FID score

**Causes:**
- Heavy computations
- Large DOM manipulations
- Synchronous operations
- Inefficient algorithms

**Solutions:**
- Break into smaller tasks
- Use Web Workers
- Defer non-critical work
- Optimize algorithms

**Event Loop Performance:**

**Theory:** Event loop efficiency affects responsiveness.

**Microtask Starvation:**
- Too many microtasks
- Blocks rendering
- Delays user input

**Solution:**
- Limit microtask chains
- Use setTimeout for deferral
- Monitor microtask queue

### Memory Performance

**Memory Leaks Theory:**

**Definition:** Memory that's no longer needed but not released.

**Common Causes:**

**1. Detached DOM Nodes**
- DOM removed but JavaScript references remain
- Prevents garbage collection
- Accumulates over time

**2. Event Listeners**
- Listeners not removed
- Keep objects alive
- Memory grows with interactions

**3. Closures**
- Unintended variable capture
- Large objects retained
- Scope chain references

**4. Global Variables**
- Never garbage collected
- Accumulate indefinitely
- Namespace pollution

**Detection:**
- Chrome DevTools Memory Profiler
- Heap snapshots
- Allocation timeline
- Memory monitoring

**Garbage Collection:**

**Theory:** Automatic memory management through garbage collection.

**GC Algorithms:**

**1. Mark and Sweep**
- Mark reachable objects
- Sweep unreachable objects
- Stop-the-world pauses

**2. Generational GC**
- Young generation (frequent, fast)
- Old generation (infrequent, slow)
- Most objects die young

**3. Incremental GC**
- Break GC into small steps
- Reduce pause times
- Better for interactive apps

**GC Impact:**
- Pauses JavaScript execution
- Can cause jank
- Unpredictable timing

**Optimization:**
- Minimize object creation
- Reuse objects (object pooling)
- Avoid memory leaks
- Monitor memory usage

---

## Rendering Performance

### 60 FPS Theory

**Definition:** Smooth animations require 60 frames per second, giving 16.67ms per frame.

**Định nghĩa:** Hoạt ảnh mượt mà yêu cầu 60 khung hình mỗi giây, tương đương 16.67ms mỗi khung hình.

**Frame Budget:**

```
16.67ms total
- ~6ms browser overhead
= ~10ms for JavaScript
```

**Exceeding Budget:**
- Dropped frames
- Janky animations
- Poor user experience

### Layout (Reflow) Performance

**Theory:** Layout calculates position and size of elements.

**Cost:**
- Expensive operation
- Affects entire subtree
- Synchronous (blocks rendering)

**Layout Triggers:**

**Geometric Properties:**
- width, height
- margin, padding, border
- position, top, left
- display

**Layout Thrashing:**

**Theory:** Interleaving reads and writes forces multiple layouts.

**Example Pattern:**
```
Read layout property (forces layout)
Write style (invalidates layout)
Read layout property (forces layout again)
Write style (invalidates layout again)
```

**Solution:**
- Batch reads together
- Batch writes together
- Use requestAnimationFrame

### Paint Performance

**Theory:** Paint fills in pixels for visual properties.

**Cost:**
- Moderate expense
- Affects painted area
- Can be optimized with layers

**Paint Triggers:**

**Visual Properties:**
- color, background
- border-radius
- box-shadow
- visibility

**Paint Complexity:**
- Simple properties (color) cheap
- Complex properties (shadows, gradients) expensive
- Large paint areas costly

**Optimization:**
- Minimize paint area
- Use simple properties
- Promote to layers for animations

### Composite Performance

**Theory:** Compositing combines layers into final image.

**Cost:**
- Cheapest operation
- GPU accelerated
- Doesn't affect layout or paint

**Composite-Only Properties:**
- transform
- opacity

**Layer Promotion:**

**Theory:** Certain properties promote elements to own layer.

**Benefits:**
- Isolated repainting
- GPU acceleration
- Smooth animations

**Cost:**
- Memory overhead
- Layer management
- Too many layers harmful

**Promotion Triggers:**
- 3D transforms
- will-change property
- video/canvas elements
- CSS filters

---

## Summary

### Key Performance Concepts

1. **Core Web Vitals**
   - LCP: Loading performance
   - FID: Interactivity
   - CLS: Visual stability

2. **Critical Rendering Path**
   - DOM/CSSOM construction
   - Render tree building
   - Layout and paint
   - Optimization strategies

3. **Network Performance**
   - Latency vs bandwidth
   - HTTP protocol evolution
   - Caching strategies
   - Resource optimization

4. **JavaScript Performance**
   - Parse and compile cost
   - Runtime efficiency
   - Memory management
   - Event loop optimization

5. **Rendering Performance**
   - 60 FPS target
   - Layout thrashing
   - Paint optimization
   - Composite layers

### Performance Principles

✅ **DO:**
- Measure before optimizing
- Focus on user-centric metrics
- Optimize critical path
- Use appropriate caching
- Monitor real user data

❌ **DON'T:**
- Premature optimization
- Ignore mobile performance
- Forget about perceived performance
- Neglect monitoring
- Optimize without measuring

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What are Core Web Vitals and why does Google use them as ranking signals? / Core Web Vitals là gì và tại sao Google dùng chúng làm tín hiệu xếp hạng? 🟡 Mid

**A:** Core Web Vitals are three user-centric metrics: Largest Contentful Paint (LCP) measures loading performance — good threshold is under 2.5 s. Interaction to Next Paint (INP) measures responsiveness to all interactions — good threshold is under 200 ms. Cumulative Layout Shift (CLS) measures visual stability — good score is under 0.1. Google uses them because they correlate directly with user experience quality and bounce rate: pages that load fast, respond quickly, and don't shift content retain users.

Vietnamese explanation: Core Web Vitals là ba chỉ số đo trải nghiệm người dùng thực sự — không phải lab benchmark. LCP đo tốc độ hiển thị nội dung lớn nhất (hero image, heading lớn). INP thay thế FID từ 2024, đo tổng thể độ phản hồi mọi tương tác trong suốt vòng đời trang. CLS đo sự ổn định bố cục — trang bị layout shift khi quảng cáo load muộn sẽ bị điểm CLS cao. Trade-off quan trọng: tối ưu LCP đôi khi mâu thuẫn với tối ưu INP nếu preload quá nhiều JavaScript.

---

### Q: Describe the critical rendering path and where bottlenecks typically occur. / Mô tả critical rendering path và các điểm thắt cổ chai thường gặp ở đâu? 🔴 Senior

**A:** The critical rendering path is the sequence the browser must complete before painting the first pixel: (1) Parse HTML → build DOM; (2) Encounter CSS → fetch and parse → build CSSOM; (3) Combine DOM + CSSOM → Render Tree; (4) Layout (reflow) — compute geometry; (5) Paint — fill pixels; (6) Composite — layer assembly on GPU. Bottlenecks: render-blocking CSS in `<head>` stalls CSSOM construction; render-blocking synchronous `<script>` without `defer`/`async` pauses HTML parsing; large unoptimised images delay LCP; JavaScript-triggered forced synchronous layout (layout thrashing) causes repeated reflow.

Vietnamese explanation: Điểm mấu chốt là CSSOM phải hoàn tất trước khi Render Tree được xây dựng — đây là lý do CSS luôn render-blocking theo mặc định. Chiến lược tối ưu: inline critical CSS cho above-the-fold, dùng `<link rel="preload">` cho font và LCP image, đặt script ở cuối body hoặc dùng `defer`. Layout thrashing xảy ra khi JavaScript đọc thuộc tính layout (offsetHeight, getBoundingClientRect) ngay sau khi thay đổi DOM — browser phải flush layout queue ngay lập tức, gây jank.

---

### Q: How do resource hints (`preload`, `prefetch`, `preconnect`) differ and when should each be used? / Các resource hint khác nhau thế nào và khi nào dùng từng loại? 🟡 Mid

**A:** `<link rel="preconnect">` — establishes the TCP connection + TLS handshake to an origin early, saving 100–500 ms on first request; use for third-party origins you will definitely fetch from (fonts.googleapis.com, CDN). `<link rel="preload">` — fetches a specific resource at high priority before the parser would normally discover it; use for LCP images, critical fonts, or above-the-fold scripts. `<link rel="prefetch">` — fetches a resource at low priority in idle time for likely future navigation; use for next-page assets. Misusing `preload` for non-critical resources wastes bandwidth and can hurt LCP by competing with critical resources.

Vietnamese explanation: Thứ tự ưu tiên: preconnect → preload → prefetch. Preconnect chỉ thiết lập kết nối, không tải file — phù hợp khi bạn biết origin nhưng chưa biết file cụ thể (ví dụ: font CDN). Preload tải file ngay với priority cao — nên dùng có chọn lọc vì browser có giới hạn băng thông. Prefetch có thể bị browser bỏ qua khi kết nối chậm. Một lỗi phổ biến là preload font nhưng thiếu attribute `crossorigin`, khiến browser tải font hai lần.

---

### Q: Explain lazy loading strategies for images and JavaScript modules, and their trade-offs. / Giải thích các chiến lược lazy loading cho ảnh và JavaScript module, cùng trade-off? 🟡 Mid

**A:** For images: the native `loading="lazy"` attribute defers off-screen images until they approach the viewport. For JavaScript: dynamic `import()` splits code into chunks loaded on demand. Intersection Observer API enables custom lazy loading with fine-grained control over thresholds and rootMargin. Trade-offs: lazy loading reduces initial page weight and improves LCP (fewer competing requests), but can cause layout shift if image dimensions are not reserved with `width`/`height` or `aspect-ratio`. JavaScript lazy loading adds a waterfall request on demand — pre-fetching on hover or route hover (`<Link prefetch>` in Next.js) mitigates perceived delay.

Vietnamese explanation: Với ảnh, `loading="lazy"` là giải pháp đơn giản nhất nhưng browser tự quyết định threshold (thường 1200–1500 px trước viewport) — không phù hợp để kiểm soát chính xác. Intersection Observer cho phép kiểm soát rootMargin để preload sớm hơn. Với JS, code-splitting theo route là mặc định trong Next.js/Vite, nhưng lazy loading component-level (React.lazy + Suspense) phù hợp cho modal, drawer, heavy chart. Trade-off quan trọng: lazy loading quá nhiều tạo nhiều waterfall request nhỏ — cần cân bằng giữa initial load và on-demand load.

---

### Q: What is a performance budget and how do you enforce it in a CI pipeline? / Performance budget là gì và làm thế nào để áp dụng trong CI pipeline? 🔴 Senior

**A:** A performance budget is a set of constraints on performance metrics (file sizes, lighthouse scores, Core Web Vitals) that a page must not exceed. Examples: total JavaScript bundle under 200 KB gzipped, LCP under 2.5 s on 4G, Lighthouse performance score above 85. Enforcement in CI: use tools like Lighthouse CI (`lhci autorun`) which runs Lighthouse against a deployed preview and fails the build if thresholds are violated; `bundlesize` or `size-limit` checks asset sizes at build time; webpack `performance.hints: 'error'` fails the build on oversized bundles. The budget is defined per route because landing pages and dashboards have different requirements.

Vietnamese explanation: Performance budget là cam kết kỹ thuật để tránh "performance regressions" do tích lũy dần. Không có budget, mỗi feature nhỏ thêm vài KB JS — sau 1 năm bundle tăng gấp đôi mà không ai chú ý. Trong CI, Lighthouse CI chạy sau deploy preview (Vercel, Netlify) và comment kết quả lên PR. Size-limit check ở bước build (trước deploy) để fail fast hơn. Trade-off: budget quá chặt làm chậm phát triển; budget quá lỏng mất tác dụng. Best practice: đặt budget theo p75 RUM data thực tế, không chỉ theo lab Lighthouse.

---

[← Back to Bundle Optimization](./03-bundle-optimization.md) | [Next: Security →](../07-web-security/01-common-vulnerabilities.md)
