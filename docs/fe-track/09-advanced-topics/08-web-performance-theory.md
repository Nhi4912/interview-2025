# Web Performance - Advanced Theory / Hiệu Suất Web - Lý Thuyết Nâng Cao


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Performance Metrics](#performance-metrics)
2. [Critical Rendering Path](#critical-rendering-path)
3. [JavaScript Performance](#javascript-performance)
4. [Image Optimization](#image-optimization)
5. [Performance Budgets](#performance-budgets)
6. [Measuring Performance](#measuring-performance)
7. [Interview Questions](#interview-questions)

---

## Performance Metrics / Metrics Hiệu Suất

### Core Web Vitals / Core Web Vitals

**English:** Core Web Vitals are Google's standardized metrics for measuring user experience on the web.

**Tiếng Việt:** Core Web Vitals là các metrics chuẩn hóa của Google để đo lường trải nghiệm người dùng trên web.

#### Largest Contentful Paint (LCP) / Vẽ Nội Dung Lớn Nhất

**Definition**: Time until largest content element is rendered

**What It Measures:**
- Loading performance
- Perceived load speed
- When main content visible

**Target Values:**
- **Good**: ≤ 2.5 seconds
- **Needs Improvement**: 2.5 - 4.0 seconds
- **Poor**: > 4.0 seconds

**Elements Considered:**
- `<img>` elements
- `<image>` inside `<svg>`
- `<video>` elements
- Background images via CSS
- Block-level text elements

**Common Issues:**
- Slow server response
- Render-blocking resources
- Slow resource load times
- Client-side rendering

**Optimization Strategies:**

**1. Server Response Time:**
- Optimize backend
- Use CDN
- Cache aggressively
- Reduce database queries

**2. Render-Blocking Resources:**
- Defer non-critical CSS
- Inline critical CSS
- Defer JavaScript
- Use async/defer attributes

**3. Resource Load Time:**
- Compress images
- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Optimize fonts

**4. Client-Side Rendering:**
- Use server-side rendering (SSR)
- Implement static generation
- Progressive enhancement
- Reduce JavaScript

#### First Input Delay (FID) / Độ Trễ Đầu Vào Đầu Tiên

**Definition**: Time from first interaction to browser response

**What It Measures:**
- Interactivity
- Responsiveness
- Main thread availability

**Target Values:**
- **Good**: ≤ 100 milliseconds
- **Needs Improvement**: 100 - 300 milliseconds
- **Poor**: > 300 milliseconds

**Interactions Measured:**
- Clicks
- Taps
- Key presses

**Not Measured:**
- Scrolling
- Zooming
- Continuous interactions

**Common Causes:**
- Long-running JavaScript
- Large JavaScript bundles
- Heavy parsing/compilation
- Main thread blocked

**Optimization Strategies:**

**1. Reduce JavaScript Execution:**
- Code splitting
- Remove unused code
- Defer non-critical JavaScript
- Use Web Workers

**2. Break Up Long Tasks:**
- Tasks > 50ms block main thread
- Split into smaller chunks
- Use `requestIdleCallback`
- Yield to browser

**3. Optimize Third-Party Scripts:**
- Load asynchronously
- Use facade pattern
- Defer until interaction
- Remove unnecessary scripts

**4. Reduce Main Thread Work:**
- Minimize DOM manipulation
- Optimize event handlers
- Debounce/throttle events
- Use passive event listeners

#### Cumulative Layout Shift (CLS) / Dịch Chuyển Bố Cục Tích Lũy

**Definition**: Sum of all unexpected layout shifts

**What It Measures:**
- Visual stability
- Layout shifts during page lifetime
- User experience disruption

**Target Values:**
- **Good**: ≤ 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

**Calculation:**
```
CLS = Impact Fraction × Distance Fraction
```

**Impact Fraction**: Percentage of viewport affected
**Distance Fraction**: Distance moved relative to viewport

**Common Causes:**
- Images without dimensions
- Ads/embeds/iframes without dimensions
- Dynamically injected content
- Web fonts causing FOIT/FOUT
- Actions waiting for network response

**Optimization Strategies:**

**1. Always Include Size Attributes:**
```html
<img src="image.jpg" width="640" height="480" alt="...">
```
- Reserve space
- Prevent layout shift
- Use aspect-ratio CSS

**2. Reserve Space for Ads/Embeds:**
```css
.ad-container {
  min-height: 250px;
}
```
- Fixed dimensions
- Placeholder elements
- Skeleton screens

**3. Avoid Inserting Content Above Existing:**
- Insert below fold
- Use overlays
- Animate smoothly
- User-initiated only

**4. Optimize Font Loading:**
```css
@font-face {
  font-display: optional;
}
```
- Use `font-display: optional`
- Preload critical fonts
- Use system fonts
- Subset fonts

---

## Critical Rendering Path / Đường Dẫn Render Quan Trọng

### Optimizing the Critical Path / Tối Ưu Đường Dẫn Quan Trọng

**English:** The critical rendering path is the sequence of steps to render initial content.

**Tiếng Việt:** Đường dẫn render quan trọng là chuỗi các bước để render nội dung ban đầu.

#### Critical Path Analysis / Phân Tích Đường Dẫn Quan Trọng

**Critical Resources:**
- Resources that block initial render
- HTML document
- Critical CSS
- Synchronous JavaScript
- Fonts (if render-blocking)

**Critical Path Length:**
- Number of round trips required
- Longer path = slower render
- Minimize dependencies
- Parallelize when possible

**Critical Bytes:**
- Total bytes of critical resources
- Affects download time
- Minimize size
- Compress aggressively

**Optimization Goals:**
1. Minimize critical resources
2. Minimize critical bytes
3. Minimize critical path length

#### CSS Optimization / Tối Ưu CSS

**CSS Blocks Rendering:**
- Browser waits for CSSOM
- Cannot render without styles
- All CSS is render-blocking by default

**Optimization Techniques:**

**1. Inline Critical CSS:**
```html
<style>
  /* Critical above-fold styles */
  .header { ... }
  .hero { ... }
</style>
```
- Eliminates round trip
- Faster first render
- Keep small (<14KB)

**2. Defer Non-Critical CSS:**
```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```
- Load asynchronously
- Apply after initial render
- Improves perceived performance

**3. Media Queries:**
```html
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="mobile.css" media="(max-width: 600px)">
```
- Conditional loading
- Reduces blocking CSS
- Better performance

**4. Remove Unused CSS:**
- Use PurgeCSS
- Tree-shake CSS
- Critical CSS extraction
- Smaller file size

#### JavaScript Optimization / Tối Ưu JavaScript

**JavaScript Blocks Parsing:**
- Parser stops at `<script>`
- Downloads and executes
- Blocks DOM construction
- Delays render

**Loading Strategies:**

**1. Defer Non-Critical:**
```html
<script defer src="script.js"></script>
```
- Downloads in parallel
- Executes after parsing
- Maintains order
- Best for most scripts

**2. Async for Independent:**
```html
<script async src="analytics.js"></script>
```
- Downloads in parallel
- Executes when ready
- No order guarantee
- Good for analytics

**3. Module Scripts:**
```html
<script type="module" src="app.js"></script>
```
- Deferred by default
- Can use async
- Modern browsers
- Better dependency management

**4. Code Splitting:**
- Split by route
- Split by component
- Dynamic imports
- Load on demand

**5. Tree Shaking:**
- Remove unused code
- ES modules required
- Smaller bundles
- Faster load

---

## JavaScript Performance / Hiệu Suất JavaScript

### Execution Performance / Hiệu Suất Thực Thi

**English:** JavaScript execution performance impacts interactivity and responsiveness.

**Tiếng Việt:** Hiệu suất thực thi JavaScript ảnh hưởng đến tính tương tác và khả năng phản hồi.

#### Long Tasks / Tác Vụ Dài

**Definition**: Tasks that block main thread > 50ms

**Impact:**
- Delays user interactions
- Poor FID score
- Janky animations
- Unresponsive UI

**Detection:**
```javascript
// Long Task API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task detected:', entry.duration);
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

**Mitigation Strategies:**

**1. Break Up Tasks:**
```javascript
// Bad: Long synchronous task
function processLargeArray(items) {
  items.forEach(item => heavyProcessing(item));
}

// Good: Break into chunks
async function processLargeArray(items) {
  for (let i = 0; i < items.length; i++) {
    heavyProcessing(items[i]);
    
    // Yield to browser every 50 items
    if (i % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

**2. Use Web Workers:**
```javascript
// Offload to worker thread
const worker = new Worker('processor.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

**3. RequestIdleCallback:**
```javascript
// Run during idle time
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    processTask(task);
  }
});
```

**4. Debounce/Throttle:**
```javascript
// Limit execution frequency
const debouncedHandler = debounce(expensiveOperation, 300);
const throttledHandler = throttle(expensiveOperation, 100);
```

#### Memory Management / Quản Lý Bộ Nhớ

**Memory Leaks:**

**Common Causes:**
1. **Global Variables**: Unintentional globals
2. **Forgotten Timers**: setInterval not cleared
3. **Event Listeners**: Not removed
4. **Closures**: Capturing large objects
5. **Detached DOM**: References to removed nodes

**Prevention:**

**1. Clean Up Resources:**
```javascript
class Component {
  constructor() {
    this.timerId = setInterval(this.update, 1000);
    this.handleClick = this.handleClick.bind(this);
    element.addEventListener('click', this.handleClick);
  }
  
  destroy() {
    clearInterval(this.timerId);
    element.removeEventListener('click', this.handleClick);
  }
}
```

**2. Use WeakMap/WeakSet:**
```javascript
// Allows garbage collection
const cache = new WeakMap();
cache.set(object, data);
// When object is GC'd, cache entry is too
```

**3. Avoid Circular References:**
```javascript
// Bad
obj1.ref = obj2;
obj2.ref = obj1;

// Good: Break cycle when done
obj1.ref = null;
obj2.ref = null;
```

#### Parsing and Compilation / Phân Tích và Biên Dịch

**JavaScript Costs:**
1. **Download**: Network time
2. **Parse**: Create AST
3. **Compile**: Generate bytecode
4. **Execute**: Run code

**Parse Time:**
- Proportional to code size
- Blocks main thread
- Delays interactivity
- Significant on mobile

**Optimization:**

**1. Reduce Bundle Size:**
- Code splitting
- Tree shaking
- Remove unused code
- Lazy loading

**2. Use Modern Syntax:**
- Smaller transpiled code
- Better optimization
- Native features faster
- Target modern browsers

**3. Avoid Large Dependencies:**
- Check bundle size
- Use lighter alternatives
- Import only needed parts
- Consider native APIs

---

## Image Optimization / Tối Ưu Hình Ảnh

### Image Performance / Hiệu Suất Hình Ảnh

**English:** Images often account for most page weight and significantly impact performance.

**Tiếng Việt:** Hình ảnh thường chiếm phần lớn trọng lượng trang và ảnh hưởng đáng kể đến hiệu suất.

#### Image Formats / Định Dạng Hình Ảnh

**Format Comparison:**

**JPEG:**
- Lossy compression
- Good for photos
- No transparency
- Wide support
- 60-80% quality optimal

**PNG:**
- Lossless compression
- Transparency support
- Good for graphics
- Larger file size
- Use PNG-8 when possible

**WebP:**
- Modern format
- Better compression than JPEG/PNG
- Transparency support
- 25-35% smaller
- Good browser support

**AVIF:**
- Newest format
- Best compression
- 50% smaller than JPEG
- Excellent quality
- Growing support

**SVG:**
- Vector format
- Infinitely scalable
- Small file size
- Good for icons/logos
- Can be animated

**Format Selection:**
- **Photos**: AVIF > WebP > JPEG
- **Graphics**: WebP > PNG
- **Icons**: SVG > PNG
- **Animations**: WebP > GIF

#### Responsive Images / Hình Ảnh Responsive

**srcset Attribute:**
```html
<img src="small.jpg"
     srcset="small.jpg 480w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 480px,
            (max-width: 1000px) 800px,
            1200px"
     alt="Description">
```

**Benefits:**
- Appropriate size for device
- Saves bandwidth
- Faster loading
- Better user experience

**Picture Element:**
```html
<picture>
  <source type="image/avif" srcset="image.avif">
  <source type="image/webp" srcset="image.webp">
  <img src="image.jpg" alt="Description">
</picture>
```

**Benefits:**
- Format fallbacks
- Art direction
- Different crops
- Better control

#### Lazy Loading / Tải Lười

**Native Lazy Loading:**
```html
<img src="image.jpg" loading="lazy" alt="Description">
```

**Benefits:**
- Defers off-screen images
- Saves bandwidth
- Faster initial load
- Better performance

**When to Use:**
- Below-fold images
- Long pages
- Image galleries
- Not for above-fold

**Intersection Observer:**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

**More Control:**
- Custom thresholds
- Root margin
- Multiple observers
- Better UX

---

## Performance Budgets / Ngân Sách Hiệu Suất

### Setting Performance Budgets / Thiết Lập Ngân Sách Hiệu Suất

**English:** Performance budgets set limits on metrics to maintain good performance.

**Tiếng Việt:** Ngân sách hiệu suất đặt giới hạn trên các metrics để duy trì hiệu suất tốt.

#### Types of Budgets / Các Loại Ngân Sách

**1. Metric-Based:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTI < 3.8s

**2. Quantity-Based:**
- Max 50 requests
- Max 10 JavaScript files
- Max 20 images
- Max 5 fonts

**3. Size-Based:**
- Total page < 1MB
- JavaScript < 300KB
- CSS < 50KB
- Images < 500KB

**4. Time-Based:**
- Load time < 3s
- Time to interactive < 5s
- First paint < 1s

#### Implementing Budgets / Triển Khai Ngân Sách

**1. Measure Baseline:**
- Current performance
- Identify bottlenecks
- Set realistic goals
- Track over time

**2. Set Targets:**
- Based on user needs
- Competitive analysis
- Industry benchmarks
- Business goals

**3. Monitor Continuously:**
- Automated testing
- CI/CD integration
- Real user monitoring
- Synthetic monitoring

**4. Enforce Budgets:**
- Fail builds if exceeded
- Alert team
- Block deployments
- Review exceptions

**Tools:**
- Lighthouse CI
- WebPageTest
- SpeedCurve
- Calibre

---

## Measuring Performance / Đo Lường Hiệu Suất

### Performance Measurement / Đo Lường Hiệu Suất

**English:** Accurate measurement is essential for understanding and improving performance.

**Tiếng Việt:** Đo lường chính xác là cần thiết để hiểu và cải thiện hiệu suất.

#### Lab vs Field Data / Dữ Liệu Lab vs Thực Tế

**Lab Data (Synthetic):**

**Characteristics:**
- Controlled environment
- Consistent conditions
- Reproducible results
- Specific device/network

**Tools:**
- Lighthouse
- WebPageTest
- Chrome DevTools
- PageSpeed Insights

**Advantages:**
- Debugging friendly
- Consistent
- Pre-release testing
- Detailed metrics

**Limitations:**
- Not real users
- Single configuration
- May not reflect reality
- Missing context

**Field Data (RUM - Real User Monitoring):**

**Characteristics:**
- Real users
- Varied conditions
- Actual devices/networks
- Geographic distribution

**Tools:**
- Chrome User Experience Report
- Google Analytics
- Custom RUM solutions
- Performance API

**Advantages:**
- Real user experience
- Varied conditions
- Actual impact
- Business metrics

**Limitations:**
- Less control
- Harder to debug
- Privacy concerns
- Sampling needed

**Best Approach: Use Both**
- Lab for development
- Field for validation
- Continuous monitoring
- Iterate based on data

#### Performance APIs / APIs Hiệu Suất

**Navigation Timing:**
```javascript
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DNS:', perfData.domainLookupEnd - perfData.domainLookupStart);
console.log('TCP:', perfData.connectEnd - perfData.connectStart);
console.log('TTFB:', perfData.responseStart - perfData.requestStart);
console.log('DOM:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
```

**Resource Timing:**
```javascript
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(resource.name, resource.duration);
});
```

**User Timing:**
```javascript
// Mark points in time
performance.mark('start-task');
// ... do work ...
performance.mark('end-task');

// Measure duration
performance.measure('task-duration', 'start-task', 'end-task');

// Get measurements
const measures = performance.getEntriesByType('measure');
```

**Paint Timing:**
```javascript
const paintEntries = performance.getEntriesByType('paint');
paintEntries.forEach(entry => {
  console.log(entry.name, entry.startTime);
});
// first-paint, first-contentful-paint
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: Explain Core Web Vitals

**English Answer:**

**Core Web Vitals** are Google's standardized metrics for user experience.

**Three Metrics:**

**1. LCP (Largest Contentful Paint):**
- Measures loading performance
- Time to largest content element
- Target: ≤ 2.5s
- Optimize: server response, render-blocking, resource load

**2. FID (First Input Delay):**
- Measures interactivity
- Time from interaction to response
- Target: ≤ 100ms
- Optimize: reduce JavaScript, break up long tasks

**3. CLS (Cumulative Layout Shift):**
- Measures visual stability
- Sum of unexpected layout shifts
- Target: ≤ 0.1
- Optimize: size attributes, reserve space, avoid dynamic content

**Why Important:**
- User experience
- SEO ranking factor
- Business metrics
- Industry standard

**Tiếng Việt:**

Core Web Vitals: LCP (loading, ≤2.5s), FID (interactivity, ≤100ms), CLS (stability, ≤0.1). Quan trọng cho UX, SEO, business metrics.

### Q2: How to optimize critical rendering path?

**English Answer:**

**Critical Rendering Path** is the sequence to render initial content.

**Optimization Strategies:**

**1. Minimize Critical Resources:**
- Inline critical CSS
- Defer non-critical CSS
- Async/defer JavaScript
- Remove unused code

**2. Minimize Critical Bytes:**
- Compress resources
- Minify code
- Optimize images
- Remove unused code

**3. Minimize Critical Path Length:**
- Reduce dependencies
- Parallelize downloads
- Use CDN
- Preload critical resources

**Specific Techniques:**
- Inline above-fold CSS
- Defer below-fold CSS
- Defer JavaScript
- Optimize fonts
- Lazy load images

**Tiếng Việt:**

Tối ưu critical rendering path: minimize critical resources (inline CSS, defer JS), minimize bytes (compress, minify), minimize path length (reduce dependencies, parallelize).

### Q3: Explain image optimization techniques

**English Answer:**

**Image Optimization** is crucial for performance.

**Techniques:**

**1. Choose Right Format:**
- Photos: AVIF > WebP > JPEG
- Graphics: WebP > PNG
- Icons: SVG > PNG
- Use modern formats with fallbacks

**2. Responsive Images:**
- srcset for different sizes
- sizes attribute for layout
- Picture element for art direction
- Serve appropriate size

**3. Lazy Loading:**
- Native loading="lazy"
- Intersection Observer
- Below-fold images only
- Saves bandwidth

**4. Compression:**
- Optimize quality (60-80% for JPEG)
- Use tools (ImageOptim, Squoosh)
- Automate in build process
- Balance quality vs size

**5. Dimensions:**
- Always specify width/height
- Prevents layout shift
- Use aspect-ratio CSS
- Reserve space

**Tiếng Việt:**

Tối ưu hình ảnh: chọn format đúng (AVIF, WebP), responsive images (srcset, sizes), lazy loading, compression (60-80% quality), specify dimensions (prevent CLS).

---

## Summary / Tóm Tắt

**Key Concepts:**

1. **Core Web Vitals**: LCP, FID, CLS - standardized UX metrics
2. **Critical Path**: Minimize resources, bytes, path length
3. **JavaScript**: Break up long tasks, code splitting, tree shaking
4. **Images**: Modern formats, responsive, lazy loading, compression
5. **Budgets**: Set limits, monitor, enforce
6. **Measurement**: Lab + Field data, Performance APIs

**Best Practices:**
- Measure first
- Set performance budgets
- Optimize critical path
- Reduce JavaScript
- Optimize images
- Monitor continuously
- Iterate based on data

---

[← Previous: Browser Networking](./07-browser-networking-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
