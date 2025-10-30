# Web Performance Optimization - Complete Guide
# Tối Ưu Hiệu Suất Web - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: Performance Metrics
1. Core Web Vitals (LCP, FID, CLS)
2. RAIL Performance Model
3. Performance APIs
4. Measuring Performance

### Part 2: Loading Performance
5. Critical Rendering Path
6. Resource Prioritization
7. Code Splitting Strategies
8. Lazy Loading Techniques
9. Preloading and Prefetching

### Part 3: Runtime Performance
10. JavaScript Performance
11. Rendering Performance
12. Memory Management
13. Network Optimization

### Part 4: Advanced Optimization
14. Service Workers
15. HTTP/2 and HTTP/3
16. CDN Strategies
17. Image Optimization
18. Caching Strategies

---

## Part 1: Performance Metrics

### 1. Core Web Vitals (LCP, FID, CLS)
### 1. Core Web Vitals

**English:**

Core Web Vitals are Google's metrics for measuring user experience.

**Largest Contentful Paint (LCP):**

```javascript
// Measures loading performance
// Good: < 2.5s
// Needs Improvement: 2.5s - 4s
// Poor: > 4s

// Measuring LCP
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
}).observe({ entryTypes: ['largest-contentful-paint'] });

// Improving LCP:
// 1. Optimize server response time
// 2. Eliminate render-blocking resources
// 3. Optimize images
// 4. Use CDN
// 5. Cache assets

// Example: Image optimization
<img
  src="hero.jpg"
  srcset="hero-320w.jpg 320w,
          hero-640w.jpg 640w,
          hero-1280w.jpg 1280w"
  sizes="(max-width: 320px) 280px,
         (max-width: 640px) 600px,
         1200px"
  loading="eager"
  fetchpriority="high"
  alt="Hero image"
/>
```

**First Input Delay (FID):**

```javascript
// Measures interactivity
// Good: < 100ms
// Needs Improvement: 100ms - 300ms
// Poor: > 300ms

// Measuring FID
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  
  entries.forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime);
  });
}).observe({ entryTypes: ['first-input'] });

// Improving FID:
// 1. Reduce JavaScript execution time
// 2. Break up long tasks
// 3. Use web workers
// 4. Optimize event handlers
// 5. Code splitting

// Example: Breaking up long tasks
async function processLargeArray(array) {
  const chunkSize = 100;
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    
    // Process chunk
    processChunk(chunk);
    
    // Yield to browser
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
```

**Cumulative Layout Shift (CLS):**

```javascript
// Measures visual stability
// Good: < 0.1
// Needs Improvement: 0.1 - 0.25
// Poor: > 0.25

// Measuring CLS
let clsScore = 0;

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
      console.log('CLS:', clsScore);
    }
  }
}).observe({ entryTypes: ['layout-shift'] });

// Improving CLS:
// 1. Set dimensions for images/videos
// 2. Reserve space for ads
// 3. Avoid inserting content above existing content
// 4. Use transform animations instead of layout properties

// ❌ Bad: No dimensions
<img src="image.jpg" alt="Image" />

// ✅ Good: With dimensions
<img 
  src="image.jpg" 
  width="800" 
  height="600" 
  alt="Image" 
/>

// ✅ Better: Aspect ratio
<img 
  src="image.jpg" 
  style="aspect-ratio: 16/9; width: 100%;" 
  alt="Image" 
/>
```

**Vietnamese:**

Core Web Vitals là metrics của Google để đo trải nghiệm người dùng.

**LCP (Largest Contentful Paint):**
- Đo hiệu suất loading
- Tốt: < 2.5s
- Cần cải thiện: 2.5s - 4s
- Kém: > 4s

**FID (First Input Delay):**
- Đo tính tương tác
- Tốt: < 100ms
- Cần cải thiện: 100ms - 300ms
- Kém: > 300ms

**CLS (Cumulative Layout Shift):**
- Đo độ ổn định visual
- Tốt: < 0.1
- Cần cải thiện: 0.1 - 0.25
- Kém: > 0.25

---

### 2. RAIL Performance Model
### 2. Mô Hình Hiệu Suất RAIL

**English:**

RAIL is a user-centric performance model focusing on Response, Animation, Idle, and Load.

**Response (< 100ms):**

```javascript
// User input should feel instant
// Process events in < 100ms

// ❌ Bad: Blocking operation
button.addEventListener('click', () => {
  // Heavy computation blocks UI
  const result = heavyComputation();
  updateUI(result);
});

// ✅ Good: Non-blocking
button.addEventListener('click', async () => {
  // Show loading state
  showLoading();
  
  // Defer heavy work
  const result = await new Promise(resolve => {
    setTimeout(() => {
      resolve(heavyComputation());
    }, 0);
  });
  
  hideLoading();
  updateUI(result);
});

// ✅ Better: Web Worker
const worker = new Worker('worker.js');

button.addEventListener('click', () => {
  showLoading();
  
  worker.postMessage({ type: 'COMPUTE' });
  
  worker.onmessage = (e) => {
    hideLoading();
    updateUI(e.data);
  };
});
```

**Animation (60fps = 16ms per frame):**

```javascript
// Animations should run at 60fps
// Each frame has ~16ms budget

// ❌ Bad: Layout thrashing
function animateBad() {
  elements.forEach(el => {
    const height = el.offsetHeight; // Read
    el.style.height = height + 10 + 'px'; // Write
    // Causes reflow for each element!
  });
}

// ✅ Good: Batch reads and writes
function animateGood() {
  // Batch reads
  const heights = elements.map(el => el.offsetHeight);
  
  // Batch writes
  elements.forEach((el, i) => {
    el.style.height = heights[i] + 10 + 'px';
  });
}

// ✅ Best: Use transform (GPU accelerated)
function animateBest() {
  elements.forEach(el => {
    el.style.transform = 'translateY(10px)';
    // No reflow, GPU accelerated
  });
}

// RequestAnimationFrame for smooth animations
function animate() {
  // Animation logic
  updatePosition();
  
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

**Idle (50ms chunks):**

```javascript
// Use idle time for non-critical work
// Break work into 50ms chunks

// Using requestIdleCallback
function processQueue() {
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && queue.length > 0) {
      const task = queue.shift();
      processTask(task);
    }
    
    if (queue.length > 0) {
      processQueue(); // Continue in next idle period
    }
  });
}

// Example: Lazy loading analytics
requestIdleCallback(() => {
  loadAnalytics();
});

// Example: Prefetching
requestIdleCallback(() => {
  prefetchNextPage();
});
```

**Load (< 5s):**

```javascript
// Page should be interactive in < 5s

// Critical rendering path optimization
// 1. Minimize critical resources
// 2. Minimize critical bytes
// 3. Minimize critical path length

// Example: Async/defer scripts
// ❌ Bad: Blocking script
<script src="app.js"></script>

// ✅ Good: Async (independent scripts)
<script src="analytics.js" async></script>

// ✅ Good: Defer (order matters)
<script src="app.js" defer></script>

// Example: Critical CSS
<style>
  /* Critical above-the-fold CSS */
  .header { /* ... */ }
  .hero { /* ... */ }
</style>

<link rel="preload" href="full.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="full.css"></noscript>
```

**Vietnamese:**

RAIL là mô hình hiệu suất tập trung vào người dùng: Response, Animation, Idle, Load.

**Response (< 100ms):**
- Input của user phải cảm thấy tức thì
- Xử lý events trong < 100ms

**Animation (60fps = 16ms/frame):**
- Animations chạy ở 60fps
- Mỗi frame có ~16ms budget

**Idle (50ms chunks):**
- Dùng idle time cho công việc không quan trọng
- Chia công việc thành chunks 50ms

**Load (< 5s):**
- Trang phải interactive trong < 5s
- Tối ưu critical rendering path

---

### 3. Performance APIs
### 3. Performance APIs

**English:**

Browser provides powerful APIs for measuring and optimizing performance.

**Performance.now():**

```javascript
// High-resolution timestamp
const start = performance.now();

// Some operation
doSomething();

const end = performance.now();
console.log(`Operation took ${end - start}ms`);

// More accurate than Date.now()
// Microsecond precision
// Monotonic (doesn't go backwards)
```

**Performance Observer:**

```javascript
// Observe performance entries
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});

// Observe specific entry types
observer.observe({ 
  entryTypes: ['measure', 'navigation', 'resource'] 
});

// Mark and measure
performance.mark('start-task');
doTask();
performance.mark('end-task');

performance.measure('task-duration', 'start-task', 'end-task');
```

**Navigation Timing:**

```javascript
// Page load timing
const perfData = performance.getEntriesByType('navigation')[0];

console.log('DNS lookup:', perfData.domainLookupEnd - perfData.domainLookupStart);
console.log('TCP connection:', perfData.connectEnd - perfData.connectStart);
console.log('Request time:', perfData.responseStart - perfData.requestStart);
console.log('Response time:', perfData.responseEnd - perfData.responseStart);
console.log('DOM processing:', perfData.domComplete - perfData.domLoading);
console.log('Load complete:', perfData.loadEventEnd - perfData.loadEventStart);

// Total page load time
console.log('Total:', perfData.loadEventEnd - perfData.fetchStart);
```

**Resource Timing:**

```javascript
// Individual resource timing
const resources = performance.getEntriesByType('resource');

resources.forEach(resource => {
  console.log(resource.name);
  console.log('Duration:', resource.duration);
  console.log('Size:', resource.transferSize);
  console.log('Type:', resource.initiatorType);
});

// Find slow resources
const slowResources = resources.filter(r => r.duration > 1000);
console.log('Slow resources:', slowResources);

// Group by type
const byType = resources.reduce((acc, r) => {
  acc[r.initiatorType] = acc[r.initiatorType] || [];
  acc[r.initiatorType].push(r);
  return acc;
}, {});

console.log('Scripts:', byType.script?.length);
console.log('Stylesheets:', byType.link?.length);
console.log('Images:', byType.img?.length);
```

**User Timing:**

```javascript
// Custom performance marks
class PerformanceTracker {
  constructor() {
    this.marks = new Map();
  }
  
  start(name) {
    performance.mark(`${name}-start`);
    this.marks.set(name, performance.now());
  }
  
  end(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const duration = performance.now() - this.marks.get(name);
    console.log(`${name}: ${duration}ms`);
    
    return duration;
  }
  
  getMetrics() {
    return performance.getEntriesByType('measure');
  }
}

// Usage
const tracker = new PerformanceTracker();

tracker.start('data-fetch');
await fetchData();
tracker.end('data-fetch');

tracker.start('render');
renderComponent();
tracker.end('render');

console.log('All metrics:', tracker.getMetrics());
```

**Vietnamese:**

Browser cung cấp APIs mạnh mẽ để đo và tối ưu hiệu suất.

**Performance APIs:**

1. **performance.now()**: Timestamp độ phân giải cao
2. **PerformanceObserver**: Quan sát performance entries
3. **Navigation Timing**: Timing load trang
4. **Resource Timing**: Timing từng resource
5. **User Timing**: Custom performance marks

**Sử Dụng:**

```javascript
// Đo thời gian operation
const start = performance.now();
doSomething();
const duration = performance.now() - start;

// Mark và measure
performance.mark('start');
doTask();
performance.mark('end');
performance.measure('task', 'start', 'end');
```

