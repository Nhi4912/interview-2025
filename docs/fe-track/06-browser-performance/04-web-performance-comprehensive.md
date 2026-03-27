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

> 🧠 **Memory Hook**: Performance is not about making things fast — it's about making users feel things are fast; perception is the product, milliseconds are just the tool.

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Attention is finite:** Humans have a 100 ms perception threshold for "immediate" response and a 1 s threshold before concentration breaks. Every millisecond beyond these thresholds forces users to mentally context-switch. Performance optimization exists to keep users in flow — not as an engineering vanity metric.

**Why 2 — Mobile changed the baseline:** Desktop internet of 2005 had predictable CPU speed and fiber connections. The 2026 web is accessed mostly on mobile devices with 2–5× slower CPUs, intermittent 3G/4G connections, and battery constraints. Techniques that "worked fine" on desktop fail catastrophically on mobile — which is why performance principles had to be formalized.

**Why 3 — Economics are measurable:** Amazon's 100 ms → 1% conversion study, Google's search ranking penalty for slow pages, and bounce rate data all quantify what was previously intuition. Performance became an engineering discipline because it became a business KPI.

```
Performance Perception Thresholds
────────────────────────────────────────────
< 100ms   → Feels instant (user in flow)
100ms–1s  → Noticeable delay (acceptable)
1s–3s     → Concentration broken (frustration starts)
3s–10s    → 53% mobile users abandon (Google data)
> 10s     → User considers task failed
```

| Common Mistakes / Sai lầm                            | Tại sao sai                                                                                                  | Đúng là                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Optimizing on developer hardware only                | Dev MacBook is 4–8× faster than median user device                                                           | Test on real budget Android (or throttle CPU 4×, network to Fast 3G)           |
| Treating performance as a one-time task              | New features continuously add JS/CSS/images; regressions accumulate silently                                 | Set performance budgets enforced in CI to catch regressions per PR             |
| Focusing on raw load time rather than perceived load | A page that shows content at 1.5 s feels faster than one showing spinner until 2 s even with same total load | Optimize FCP and LCP (perceived start) before total load time                  |
| Ignoring network conditions outside the office       | Office WiFi is not representative of field users on 4G in rural areas                                        | Use Lighthouse's "Mobile" preset (simulated 4G, CPU throttle) for benchmarking |

**Interview Pattern:**

- Trigger: "Why does performance matter?" or "How do you approach a performance audit from scratch?"
- Concept: Perception thresholds, mobile-first baseline, metrics vs user experience
- Opening sentence: "Performance matters because slow pages directly lose users — 53% of mobile users abandon after 3 s — so I start every audit by measuring real user field data, not just lab scores, to understand where actual users are experiencing friction."

**Knowledge Chain:**

- Prerequisite: None — this is the entry point for all web performance topics
- Next: [Performance Metrics Theory](#performance-metrics-theory) — translates these principles into measurable numbers (LCP, INP, CLS)

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

> 🧠 **Memory Hook**: LCP = "Did it load?", INP = "Does it respond?", CLS = "Did it jump?" — three user frustrations, three numbers, three thresholds to memorize (2.5 s / 200 ms / 0.1).

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Lab metrics lied:** Traditional metrics like "page load" (DOMContentLoaded, `window.onload`) measure technical events that don't align with user perception. A page can fire `onload` while still showing a spinner. Google needed metrics that correlate with real user frustration, not browser events.

**Why 2 — Different users, different devices:** A metric measured on a developer's MacBook on fiber WiFi is meaningless for a user on a mid-range Android phone on a 4G network in Vietnam. Core Web Vitals are collected from real user field data (CrUX dataset) at the p75 percentile — meaning 75% of real visits meet the threshold.

**Why 3 — SEO accountability:** Before Core Web Vitals became a ranking signal (2021), there was no business pressure to fix performance beyond developer preference. Tying metrics to search ranking created an economic incentive: poor performance = lower ranking = less organic traffic = lost revenue. This is why product teams now fund performance work.

```
Core Web Vitals at a Glance
────────────────────────────────────────────────────────
Metric   | What it measures       | Good    | Poor
─────────┼────────────────────────┼─────────┼──────────
LCP      | Loading (largest el.)  | ≤ 2.5 s | > 4.0 s
INP      | Responsiveness (all)   | ≤ 200ms | > 500ms
CLS      | Visual stability       | ≤ 0.1   | > 0.25
─────────┼────────────────────────┼─────────┼──────────
FID*     | First input delay      | ≤ 100ms | > 300ms
         | (*replaced by INP 2024)
FCP      | First contentful paint | ≤ 1.8 s | > 3.0 s
TTI      | Time to interactive    | ≤ 3.8 s | > 7.3 s
TBT      | Total blocking time    | ≤ 200ms | > 600ms
```

| Common Mistakes / Sai lầm                                       | Tại sao sai                                                                           | Đúng là                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Optimizing only for Lighthouse lab score                        | Lab score uses simulated conditions; real users (CrUX p75) may still have poor scores | Check Chrome UX Report (CrUX) in Search Console for field data                      |
| Treating FID as current best practice                           | FID was replaced by INP in March 2024                                                 | Use INP (Interaction to Next Paint) — measures all interactions, not just the first |
| Ignoring TTI as "not a CWV"                                     | TTI directly affects INP — a page with high TBT will have poor INP                    | Reduce TBT (long tasks) to improve both TTI and INP                                 |
| Optimizing LCP image without checking render-blocking resources | Preloading LCP image won't help if CSS is still blocking paint                        | Fix render-blocking resources first, then optimize LCP asset                        |

**Interview Pattern:**

- Trigger: "What are the Core Web Vitals?" or "Our Google Search Console shows 'Poor' URLs — where do you start?"
- Concept: LCP/INP/CLS metrics, thresholds, field vs lab data
- Opening sentence: "Core Web Vitals are three field metrics — LCP for loading, INP for responsiveness, CLS for visual stability — measured at p75 from real user data; I'd start with whichever shows the most 'Poor' URLs in Search Console."

**Knowledge Chain:**

- Prerequisite: [Performance Fundamentals](#performance-fundamentals) — establishes that user perception drives metric design
- Next: [Critical Rendering Path](#critical-rendering-path) — LCP and TTI are direct outputs of CRP efficiency

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

> 🧠 **Memory Hook**: HTML builds the DOM, CSS builds the CSSOM — the browser refuses to paint a single pixel until both are ready, which is why a missing stylesheet can blank your entire page.

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Consistency over speed:** CSS is render-blocking by design. If the browser painted with partial styles (as bytes arrived), users would see a Flash of Unstyled Content (FOUC) — raw HTML text with default browser styles, then a jarring re-render when the stylesheet arrives. The blocking behavior trades speed for visual consistency.

**Why 2 — JavaScript can rewrite everything:** A `<script>` tag in `<head>` halts HTML parsing because the script might call `document.write()` — which rewrites the page. The browser cannot know what the script will do until it runs. `defer` and `async` exist to opt out of this conservative behavior when you know your script is safe.

**Why 3 — Render tree depends on both:** The Render Tree is built by combining DOM nodes with their computed CSSOM styles. You cannot start this combination until both inputs are fully available. This dependency chain — DOM + CSSOM → Render Tree → Layout → Paint → Composite — is why every blocking resource on the critical path directly delays First Contentful Paint.

| Common Mistakes / Sai lầm                                   | Tại sao sai                                                                 | Đúng là                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Placing `<script src="app.js">` in `<head>` without `defer` | Blocks HTML parsing; DOM not available when script runs                     | Use `defer` for scripts that need the DOM; `async` for independent scripts  |
| Loading the entire CSS bundle for above-the-fold render     | Delays CSSOM construction with styles that aren't needed yet                | Inline critical CSS (< 14 KB) in `<style>` tag; async-load the rest         |
| Not specifying `width`/`height` on LCP images               | Browser doesn't know image dimensions until downloaded; causes layout shift | Set explicit `width` + `height` attributes or `aspect-ratio` in CSS         |
| Assuming `async` maintains script execution order           | Scripts with `async` execute in download-completion order, not DOM order    | Use `defer` when script order matters; `async` only for independent scripts |

**Interview Pattern:**

- Trigger: "Walk me through what happens when a browser loads a page" or "Why is our FCP at 3.5 s?"
- Concept: CRP sequence, render-blocking, async/defer
- Opening sentence: "The browser can't render the first pixel until both the DOM and CSSOM are complete — so I'd start by identifying every render-blocking stylesheet and script on the critical path."

**Knowledge Chain:**

- Prerequisite: [Network Performance](#network-performance) — resources arrive via the network before the CRP can begin
- Next: [Performance Metrics Theory](#performance-metrics-theory) — LCP and TTI are direct measurements of CRP completion speed

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

> 🧠 **Memory Hook**: Latency is the speed of light problem — you can't fix physics, but you can reduce round trips; bandwidth is the pipe-width problem — you can fix it with compression and CDNs.

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Latency dominates small resources:** A web page loads dozens of small files (HTML, CSS, JS chunks, fonts, icons). Each requires at least one round-trip. Even at 100 Mbps bandwidth, a 50 ms RTT to a distant server means 10 small resources take 500 ms in serial. Bandwidth improvements barely help; reducing round-trips (HTTP/2 multiplexing, CDN edge nodes) is the real lever.

**Why 2 — Caching is free performance:** An asset already in the browser cache takes 0 ms to fetch. Every cache miss that could have been a hit is wasted user time and server cost. Cache strategy design (immutable hashed assets vs. short-lived HTML) is the highest ROI optimization for returning users.

**Why 3 — Protocols matter:** HTTP/1.1 processes one request at a time per connection (head-of-line blocking). HTTP/2 multiplexes hundreds of streams over one TCP connection. HTTP/3 (QUIC) removes TCP's own head-of-line blocking. Each protocol generation exists specifically to overcome the limitations of the previous one.

| Common Mistakes / Sai lầm                          | Tại sao sai                                                                                                                     | Đúng là                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Caching HTML with long `max-age`                   | Users see stale pages after deployments                                                                                         | HTML: `no-cache` (revalidate every time); hashed JS/CSS: `max-age=31536000, immutable` |
| Using `preconnect` for every third-party origin    | Too many early connections waste TCP sockets and CPU for TLS handshakes                                                         | Limit `preconnect` to 2–3 critical origins used above the fold                         |
| Domain sharding in HTTP/2                          | Was a workaround for HTTP/1.1's per-connection limit; in HTTP/2 it defeats multiplexing by splitting streams across connections | Consolidate origins in HTTP/2; remove domain sharding                                  |
| Serving images from origin when a CDN is available | Every user hits the same single origin regardless of geography                                                                  | Use a CDN with edge PoPs to cut propagation delay by 50–200 ms for distant users       |

**Interview Pattern:**

- Trigger: "How would you improve TTFB for users in Southeast Asia?" or "Explain your caching strategy for a deployed app."
- Concept: Latency vs bandwidth, caching hierarchy, HTTP/2 multiplexing
- Opening sentence: "For distant users, latency is the constraint — not bandwidth — so the highest-impact fix is a CDN with edge nodes close to them, combined with aggressive long-term caching of immutable assets."

**Knowledge Chain:**

- Prerequisite: [Performance Fundamentals](#performance-fundamentals) — establishes the three principles (minimize critical resources, bytes, path length) that network optimization implements
- Next: [Critical Rendering Path](#critical-rendering-path) — network delivery of HTML/CSS/JS feeds directly into the rendering pipeline

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

> 🧠 **Memory Hook**: JavaScript is the only resource that both blocks the parser AND runs on the main thread — so every byte you send has a double cost: download time + execution time.

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Single-threaded execution:** Browsers run JavaScript on a single main thread shared with layout, paint, and user event handling. One long JS task blocks everything else. This is not a design flaw — it's the foundation of the browser's security model (no shared mutable state between contexts).

**Why 2 — Parse/compile cost is invisible:** Developers measure network transfer but forget that every JavaScript byte must be parsed into an AST, compiled to bytecode, and potentially JIT-compiled to machine code before it runs. On a mid-range Android device this can be 3–5× slower than a developer's MacBook — a 300 KB JS bundle that "feels fast" in dev may block the main thread for 2 s on a budget phone.

**Why 3 — Memory is finite and GC is disruptive:** V8's garbage collector is incremental but can still cause micro-pauses. Applications that constantly allocate objects (creating new arrays/objects in render loops, unbounded event listeners) force frequent GC cycles, causing dropped frames and unpredictable jank.

```
JS Cost Breakdown (per byte of JavaScript)
─────────────────────────────────────────────
[Download] → [Parse] → [Compile] → [Execute]
   ~50%          ~15%      ~15%       ~20%
(network)   (CPU, blocks main thread if synchronous)

Compare: 100 KB JSON ≠ 100 KB JS
  JSON: downloaded + parsed as data
  JS:   downloaded + parsed + compiled + executed
```

| Common Mistakes / Sai lầm                                 | Tại sao sai                                              | Đúng là                                                               |
| --------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Sending one large 500 KB JS bundle                        | Parse + compile blocks main thread for 3–5 s on mobile   | Code-split by route; target <150 KB per initial chunk (gzipped)       |
| Measuring JS performance only on dev machine              | Macs are 4–8× faster than budget Android at JS execution | Profile on a real mid-range device or use CPU 4× throttle in DevTools |
| Creating objects inside `requestAnimationFrame` callbacks | Increases GC pressure, causes frame drops                | Pre-allocate objects outside the animation loop (object pooling)      |
| Using synchronous `XMLHttpRequest`                        | Blocks the entire main thread until network responds     | Use `fetch` (Promise-based, non-blocking)                             |

**Interview Pattern:**

- Trigger: "Why is our page slow even though the bundle is only 400 KB?" or "What is TTI and how do you improve it?"
- Concept: Parse/compile cost, main thread blocking, long tasks
- Opening sentence: "JavaScript has a hidden cost beyond file size — every byte must be parsed and compiled before execution, which blocks the main thread; on mobile devices this is 3–5× slower than desktop."

**Knowledge Chain:**

- Prerequisite: [Critical Rendering Path](#critical-rendering-path) — explains why main thread blocking delays TTI
- Next: [Rendering Performance](#rendering-performance) — long JS tasks cause frame drops, directly linking JS execution to animation smoothness

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

> 🧠 **Memory Hook**: The browser pipeline is Layout → Paint → Composite — and you want every animation to skip the first two steps entirely.

### Why does this exist? / Tại sao phần này tồn tại?

**Why 1 — Physics of screens:** Monitors refresh at 60 Hz, meaning each frame gets exactly 16.67 ms. Miss that window and a frame is dropped — the user sees a stutter (jank). This hard deadline exists because of hardware, not software choice.

**Why 2 — The cost hierarchy:** Not all CSS changes are equal. Changing `width` triggers Layout → Paint → Composite (most expensive). Changing `background-color` skips Layout, triggering only Paint → Composite. Changing `transform` or `opacity` skips both, running only on the GPU. Understanding this hierarchy is the entire basis of animation optimization.

**Why 3 — Layer model:** The browser separates the page into composited layers (like Photoshop layers) and hands them to the GPU. Operations that stay within a single layer (transform, opacity) never touch the CPU pipeline again after initial promotion — they are effectively free to animate. This is why `translateX` is faster than `left` for moving elements.

| Common Mistakes / Sai lầm                                               | Tại sao sai                                                    | Đúng là                                                                          |
| ----------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Animating `left`/`top` instead of `transform`                           | Triggers Layout + Paint on every frame                         | Use `transform: translateX()` — composite only                                   |
| Adding `will-change: transform` to every element                        | Creates excessive GPU layers, uses more VRAM than saved        | Apply `will-change` only to elements about to animate                            |
| Reading `offsetHeight` inside an animation loop                         | Forces synchronous layout (layout thrashing) every frame       | Read layout properties outside the animation loop or use `requestAnimationFrame` |
| Using `opacity: 0` + `display: none` together for hide/show transitions | `display: none` removes from render tree, cannot be composited | Animate `opacity` alone, toggle `visibility` if needed                           |

**Interview Pattern:**

- Trigger: "How would you optimize a slow scroll animation?" or "Why is our CSS animation janky?"
- Concept: Frame budget, layout thrashing, composite-only properties
- Opening sentence: "Smooth animation requires every frame to complete within 16 ms — I'd first check whether the animation triggers Layout or Paint, because only transform and opacity run entirely on the GPU."

**Knowledge Chain:**

- Prerequisite: [Critical Rendering Path](#critical-rendering-path) — must understand Layout and Paint steps before optimizing them
- Next: [Memory Performance](#memory-performance) — excessive layer promotion wastes GPU memory, connecting rendering to memory management

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

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Correctly states all three metrics with thresholds, knows INP replaced FID in 2024, explains the LCP vs INP trade-off when preloading JS, mentions the metrics are field (RUM) data not just lab scores.
- ❌ Weak: Lists FID instead of INP (outdated since March 2024), cannot state the thresholds, or treats CWV as just "Google's ranking thing" without explaining what each measures for the user.

---

### Q: Describe the critical rendering path and where bottlenecks typically occur. / Mô tả critical rendering path và các điểm thắt cổ chai thường gặp ở đâu? 🔴 Senior

**A:** The critical rendering path is the sequence the browser must complete before painting the first pixel: (1) Parse HTML → build DOM; (2) Encounter CSS → fetch and parse → build CSSOM; (3) Combine DOM + CSSOM → Render Tree; (4) Layout (reflow) — compute geometry; (5) Paint — fill pixels; (6) Composite — layer assembly on GPU. Bottlenecks: render-blocking CSS in `<head>` stalls CSSOM construction; render-blocking synchronous `<script>` without `defer`/`async` pauses HTML parsing; large unoptimised images delay LCP; JavaScript-triggered forced synchronous layout (layout thrashing) causes repeated reflow.

Vietnamese explanation: Điểm mấu chốt là CSSOM phải hoàn tất trước khi Render Tree được xây dựng — đây là lý do CSS luôn render-blocking theo mặc định. Chiến lược tối ưu: inline critical CSS cho above-the-fold, dùng `<link rel="preload">` cho font và LCP image, đặt script ở cuối body hoặc dùng `defer`. Layout thrashing xảy ra khi JavaScript đọc thuộc tính layout (offsetHeight, getBoundingClientRect) ngay sau khi thay đổi DOM — browser phải flush layout queue ngay lập tức, gây jank.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Names all six CRP steps in order, explains why CSS is render-blocking (CSSOM must be complete before Render Tree), identifies layout thrashing as a distinct bottleneck, and gives concrete remediation (inline critical CSS, defer scripts, preload LCP image).
- ❌ Weak: Lists steps without explaining why CSS blocks rendering; confuses `async` and `defer`; cannot explain what layout thrashing is or how to detect it.

---

### Q: How do resource hints (`preload`, `prefetch`, `preconnect`) differ and when should each be used? / Các resource hint khác nhau thế nào và khi nào dùng từng loại? 🟡 Mid

**A:** `<link rel="preconnect">` — establishes the TCP connection + TLS handshake to an origin early, saving 100–500 ms on first request; use for third-party origins you will definitely fetch from (fonts.googleapis.com, CDN). `<link rel="preload">` — fetches a specific resource at high priority before the parser would normally discover it; use for LCP images, critical fonts, or above-the-fold scripts. `<link rel="prefetch">` — fetches a resource at low priority in idle time for likely future navigation; use for next-page assets. Misusing `preload` for non-critical resources wastes bandwidth and can hurt LCP by competing with critical resources.

Vietnamese explanation: Thứ tự ưu tiên: preconnect → preload → prefetch. Preconnect chỉ thiết lập kết nối, không tải file — phù hợp khi bạn biết origin nhưng chưa biết file cụ thể (ví dụ: font CDN). Preload tải file ngay với priority cao — nên dùng có chọn lọc vì browser có giới hạn băng thông. Prefetch có thể bị browser bỏ qua khi kết nối chậm. Một lỗi phổ biến là preload font nhưng thiếu attribute `crossorigin`, khiến browser tải font hai lần.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Correctly explains all three hints, uses a concrete timing example (100–500 ms saved with preconnect), flags the `crossorigin` font pitfall, mentions that over-preloading hurts LCP by competing for bandwidth.
- ❌ Weak: Conflates preload and prefetch ("both load resources in advance"), cannot explain when `preconnect` is useful, or doesn't mention the font double-fetch bug.

---

### Q: Explain lazy loading strategies for images and JavaScript modules, and their trade-offs. / Giải thích các chiến lược lazy loading cho ảnh và JavaScript module, cùng trade-off? 🟡 Mid

**A:** For images: the native `loading="lazy"` attribute defers off-screen images until they approach the viewport. For JavaScript: dynamic `import()` splits code into chunks loaded on demand. Intersection Observer API enables custom lazy loading with fine-grained control over thresholds and rootMargin. Trade-offs: lazy loading reduces initial page weight and improves LCP (fewer competing requests), but can cause layout shift if image dimensions are not reserved with `width`/`height` or `aspect-ratio`. JavaScript lazy loading adds a waterfall request on demand — pre-fetching on hover or route hover (`<Link prefetch>` in Next.js) mitigates perceived delay.

Vietnamese explanation: Với ảnh, `loading="lazy"` là giải pháp đơn giản nhất nhưng browser tự quyết định threshold (thường 1200–1500 px trước viewport) — không phù hợp để kiểm soát chính xác. Intersection Observer cho phép kiểm soát rootMargin để preload sớm hơn. Với JS, code-splitting theo route là mặc định trong Next.js/Vite, nhưng lazy loading component-level (React.lazy + Suspense) phù hợp cho modal, drawer, heavy chart. Trade-off quan trọng: lazy loading quá nhiều tạo nhiều waterfall request nhỏ — cần cân bằng giữa initial load và on-demand load.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Distinguishes native `loading="lazy"` from Intersection Observer, mentions reserving image dimensions to prevent CLS, covers both image and JS lazy loading, names the waterfall trade-off.
- ❌ Weak: Only mentions `loading="lazy"` without discussing CLS or the JS code-splitting angle; treats lazy loading as universally good without acknowledging the on-demand request waterfall.

---

### Q: What is a performance budget and how do you enforce it in a CI pipeline? / Performance budget là gì và làm thế nào để áp dụng trong CI pipeline? 🔴 Senior

**A:** A performance budget is a set of constraints on performance metrics (file sizes, lighthouse scores, Core Web Vitals) that a page must not exceed. Examples: total JavaScript bundle under 200 KB gzipped, LCP under 2.5 s on 4G, Lighthouse performance score above 85. Enforcement in CI: use tools like Lighthouse CI (`lhci autorun`) which runs Lighthouse against a deployed preview and fails the build if thresholds are violated; `bundlesize` or `size-limit` checks asset sizes at build time; webpack `performance.hints: 'error'` fails the build on oversized bundles. The budget is defined per route because landing pages and dashboards have different requirements.

Vietnamese explanation: Performance budget là cam kết kỹ thuật để tránh "performance regressions" do tích lũy dần. Không có budget, mỗi feature nhỏ thêm vài KB JS — sau 1 năm bundle tăng gấp đôi mà không ai chú ý. Trong CI, Lighthouse CI chạy sau deploy preview (Vercel, Netlify) và comment kết quả lên PR. Size-limit check ở bước build (trước deploy) để fail fast hơn. Trade-off: budget quá chặt làm chậm phát triển; budget quá lỏng mất tác dụng. Best practice: đặt budget theo p75 RUM data thực tế, không chỉ theo lab Lighthouse.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**

- ✅ Strong: Names specific tools (Lighthouse CI, size-limit), distinguishes build-time checks (bundle size) from deploy-time checks (Lighthouse), mentions per-route budgets and p75 RUM vs lab data.
- ❌ Weak: Says "just use Lighthouse" without explaining CI integration, or defines budget without explaining how to enforce it automatically.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                        | Difficulty | Core Concept                         | Key Signal                                                                                     |
| --- | -------------------------------------------------------------- | ---------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| 1   | Core Web Vitals là gì? Tại sao Google dùng làm ranking signal? | 🟡 Mid     | CWV metrics & SEO impact             | All 3 metrics with thresholds; INP replaced FID in 2024; explain user experience connection    |
| 2   | Mô tả critical rendering path và bottlenecks thường gặp        | 🔴 Senior  | Critical Rendering Path theory       | Name all 6 CRP steps in order; CSS is render-blocking (CSSOM required); parser-blocking JS     |
| 3   | `preload`, `prefetch`, `preconnect` khác nhau thế nào?         | 🟡 Mid     | Resource hints prioritization        | Concrete timing example (100–500ms); explain priority vs timing difference for each            |
| 4   | Lazy loading strategies cho images và JS modules               | 🟡 Mid     | Lazy loading trade-offs              | Native `loading="lazy"` vs Intersection Observer; mention render-blocking avoidance            |
| 5   | Performance budget là gì? Enforce trong CI thế nào?            | 🔴 Senior  | Performance budgets & CI enforcement | Name specific tools (Lighthouse CI, size-limit); build-time check vs runtime check distinction |

---

## ⚡ Cold Call Simulation

**Question:** "In 30 seconds — what is LCP and how would you fix a poor LCP score?"

**Step 1 — Define (5 s):** LCP measures when the largest visible content element — typically a hero image or main heading — is fully rendered. Good threshold: under 2.5 seconds.

**Step 2 — Root cause (10 s):** Poor LCP usually comes from one of four places: slow server response (TTFB), render-blocking CSS or JS that delays paint, a large unoptimized image that takes too long to download, or client-side rendering where the LCP element only appears after JavaScript executes.

**Step 3 — Fix (10 s):** Use `<link rel="preload" as="image">` for the LCP image so the browser discovers it before the parser reaches it. Serve it in WebP/AVIF at the correct responsive size. Inline critical CSS to eliminate the render-blocking stylesheet. For SSR/SSG apps, ensure the LCP element is in the initial HTML — not injected by JS.

**Step 4 — Verify (5 s):** Measure with Chrome DevTools → Performance tab, mark the LCP candidate, then confirm with Lighthouse and real-user CrUX data before and after deploy.

---

## Study Cases / Tình Huống Thực Tế Sâu

### Case 1: Pinterest — Eliminating Render-Blocking Resources for LCP

**Tình huống:** Pinterest's mobile web had an LCP of ~4.2 s on median devices. The engineering team diagnosed that a 300 KB synchronous CSS bundle and two analytics scripts in `<head>` were blocking first paint. The LCP element — the first pin image — could not be painted until those resources finished downloading and executing.

**Quyết định:** The team split CSS into a critical inline stylesheet (above-the-fold styles, ~14 KB) loaded via `<style>` in `<head>`, and a non-critical bundle loaded asynchronously using `media="print" onload="this.media='all'"`. Both analytics scripts were moved to `defer`. The hero pin image was given `<link rel="preload" as="image" fetchpriority="high">`.

**Kết quả:** LCP dropped from 4.2 s to 1.9 s (54% improvement). Time to Interactive improved by 1.1 s because the main thread was no longer blocked by synchronous script execution during page load. Bounce rate on mobile dropped 17%.

**Bài học:**

- Render-blocking resources are the highest-leverage LCP optimization — fix them before image compression.
- Splitting CSS into critical/non-critical requires knowing exactly which styles are above the fold — use Chrome Coverage tab to identify unused CSS.
- `fetchpriority="high"` on the LCP image signals the browser to prioritize it over other images discovered at the same time.
- Always validate with RUM (Real User Monitoring), not just lab Lighthouse, because device distribution matters at scale.

---

### Case 2: Tiki / Lazada-style E-commerce — Fixing CLS from Late-Loading Ads and Fonts

**Tình huống:** A Southeast Asian e-commerce platform (common pattern at Tiki, Shopee, Lazada) had a CLS score of 0.38 — well above the 0.1 threshold. Users experienced visible layout jumps after initial render: product images shifted down when banner ads loaded, and text reflowed when web fonts swapped in (FOUT). Google Search Console reported this as a "Poor" CLS affecting ~60% of mobile sessions.

**Quyết định:**

1. **Images without dimensions:** All `<img>` tags for product cards and banners were given explicit `width` and `height` attributes. CSS `aspect-ratio` was added as a fallback to reserve space before the image loads.
2. **Ads:** Ad slots were given a minimum reserved height via CSS before the ad network injected content, eliminating the jump when ads arrived 2–3 s after page load.
3. **Fonts:** `font-display: optional` was chosen for body text (prevents FOUT entirely by using system font if web font is not cached), and `font-display: swap` was replaced for headings only, with `<link rel="preload">` to minimize the swap window.
4. **Dynamic content:** A sticky promotional banner injected above the fold was moved below the fold or replaced with a reserved slot in the initial HTML.

**Kết quả:** CLS dropped from 0.38 to 0.07. The "Poor" label in Search Console resolved within 28 days (Google's data collection window). Organic search traffic from mobile increased 9% over the following quarter.

**Bài học:**

- CLS is cumulative — every small shift adds up. Audit with Chrome DevTools → Performance → Experience lane to see all layout shifts and their contributors.
- `font-display: optional` is the most aggressive CLS fix for fonts but may show the fallback font on first visit. Acceptable for body text, potentially jarring for display fonts.
- Ad slots are the hardest CLS source to control because ad networks control the injected content size. Minimum-height reserved containers are the practical solution.
- Google's CrUX data lags 28 days — set expectations with stakeholders that CLS fixes are not immediately visible in Search Console.

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                      |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Kể tên 3 Core Web Vitals, ngưỡng "Good" của mỗi cái, và cái mỗi metric đo lường là gì — từ trí nhớ.                                                          |
| 2   | 🎨 Visual      | Vẽ Critical Rendering Path từ HTML bytes đến composite pixels. Ở bước nào render-blocking CSS làm stall pipeline?                                            |
| 3   | 🛠️ Application | LCP của team bạn là 3.8s trong field data. Trình bày diagnostic process: dùng tool gì, kiểm tra resource nào trước, 3 fix bạn sẽ test?                       |
| 4   | 🐛 Debug       | Trang có CLS = 0.22 nhưng bạn không thấy layout shift khi test thủ công. Nêu 3 nguyên nhân dễ bỏ sót trong dev testing nhưng xuất hiện trong real-user data. |
| 5   | 🎓 Teach       | Giải thích `preload` vs `prefetch` vs `preconnect` cho junior developer — 2 câu cho mỗi cái, kèm ví dụ cụ thể.                                               |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | LCP ≤2.5s (Largest Contentful Paint — tốc độ tải nội dung chính); INP ≤200ms (Interaction to Next Paint — độ phản hồi interaction); CLS ≤0.1 (Cumulative Layout Shift — độ ổn định visual).                                               |
| 2   | HTML bytes → Parse HTML → DOM; CSS bytes → Parse CSS → CSSOM; DOM + CSSOM → **Render Tree** (CSS block ở đây) → Layout → Paint → Composite. Render-blocking CSS stall ở bước tạo Render Tree.                                             |
| 3   | Tools: Chrome DevTools + PageSpeed Insights + WebPageTest. Kiểm tra: TTFB (server), LCP resource (ảnh/text), resource size/format (WebP?), render-blocking CSS/fonts. Top 3 fixes: preload LCP image, compress/resize, TTFB optimization. |
| 4   | (1) Web fonts FOIT/FOUT — text invisible rồi xuất hiện đẩy layout; (2) Third-party ads/embeds inject content muộn (không có trong dev); (3) Lazy-loaded images bên trên fold không có reserved space.                                     |
| 5   | `preload` = "tải resource này NGAY cho trang hiện tại" (hero image); `prefetch` = "tải trước cho trang tiếp theo khi idle" (next page JS); `preconnect` = "mở kết nối TCP+TLS sớm đến domain bên thứ 3" (fonts.googleapis.com).           |

> 🎯 **Feynman Prompt:** Giải thích Core Web Vitals cho product manager chưa từng nghe — dùng 1 analogy, không dùng jargon, kết nối mỗi metric với 1 frustration thực tế của người dùng.

🔁 **Spaced Repetition: 3 ngày → 7 ngày → 14 ngày**

- Lần 1 (sau 3 ngày): Tự trả lời 5 câu retrieval trên — không nhìn tài liệu.
- Lần 2 (sau 7 ngày): Làm bài Cold Call Simulation thành tiếng, tính giờ 30 giây.
- Lần 3 (sau 14 ngày): Giải thích toàn bộ Critical Rendering Path cho người khác từ một tờ giấy trắng.

---

[← Back to Bundle Optimization](./03-bundle-optimization.md) | [Next: Security →](../07-web-security/01-common-vulnerabilities.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Core Web Vitals](./01-core-web-vitals.md) — LCP, INP, CLS metrics this guide optimizes holistically
- [React Performance](./02-react-performance.md) — React-layer optimizations within the broader performance stack
- [Bundle Optimization](./03-bundle-optimization.md) — JS/CSS bundle strategies covered in the network layer section
- [Rendering Optimization Theory](./05-rendering-optimization-theory.md) — Critical Rendering Path theory underlying all optimizations

### Khác track (Cross-track)
- [Data Fetching](../04-nextjs/02-data-fetching.md) — Next.js caching and ISR as application-level performance strategy
- [Next.js Architecture](../04-nextjs/03-nextjs-architecture.md) — rendering mode selection as the first performance decision
- [React Performance Optimization](../03-react/09-performance-optimization.md) — component-level profiling complementing browser-level metrics
