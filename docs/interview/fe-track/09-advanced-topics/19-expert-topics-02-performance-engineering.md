# Performance Engineering

## Table of Contents
- [Performance Metrics](#performance-metrics)
- [Critical Rendering Path](#critical-rendering-path)
- [JavaScript Performance](#javascript-performance)
- [Memory Optimization](#memory-optimization)
- [Network Optimization](#network-optimization)
- [Rendering Performance](#rendering-performance)
- [Bundle Optimization](#bundle-optimization)
- [Performance Monitoring](#performance-monitoring)

## Performance Metrics

### Core Web Vitals

**Largest Contentful Paint (LCP)**:
```javascript
// Measure LCP
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  
  // Send to analytics
  sendToAnalytics({
    metric: 'LCP',
    value: lastEntry.renderTime || lastEntry.loadTime,
    element: lastEntry.element
  });
});

observer.observe({ entryTypes: ['largest-contentful-paint'] });

// Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s
```

**First Input Delay (FID)**:
```javascript
// Measure FID
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  
  entries.forEach(entry => {
    console.log('FID:', entry.processingStart - entry.startTime);
    
    sendToAnalytics({
      metric: 'FID',
      value: entry.processingStart - entry.startTime,
      eventType: entry.name
    });
  });
});

observer.observe({ entryTypes: ['first-input'] });

// Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms
```

**Cumulative Layout Shift (CLS)**:
```javascript
// Measure CLS
let clsScore = 0;

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsScore += entry.value;
      console.log('CLS:', clsScore);
      
      sendToAnalytics({
        metric: 'CLS',
        value: clsScore,
        sources: entry.sources
      });
    }
  }
});

observer.observe({ entryTypes: ['layout-shift'] });

// Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
```

### Custom Metrics

**Time to Interactive (TTI)**:
```javascript
function measureTTI() {
  return new Promise((resolve) => {
    let lastLongTask = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        if (entry.duration > 50) {
          lastLongTask = entry.startTime + entry.duration;
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    
    // Wait for 5 seconds of no long tasks
    const checkTTI = () => {
      const now = performance.now();
      
      if (now - lastLongTask > 5000) {
        observer.disconnect();
        resolve(lastLongTask);
      } else {
        requestIdleCallback(checkTTI);
      }
    };
    
    requestIdleCallback(checkTTI);
  });
}

// Usage
measureTTI().then(tti => {
  console.log('TTI:', tti);
  sendToAnalytics({ metric: 'TTI', value: tti });
});
```

**Custom User Timing**:
```javascript
class PerformanceTracker {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }

  mark(name) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    performance.mark(name);
  }

  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (!start) {
      throw new Error(`Start mark "${startMark}" not found`);
    }
    
    const duration = end - start;
    this.measures.set(name, duration);
    
    performance.measure(name, startMark, endMark);
    
    return duration;
  }

  getMeasure(name) {
    return this.measures.get(name);
  }

  getMarks() {
    return Array.from(this.marks.entries());
  }

  getMeasures() {
    return Array.from(this.measures.entries());
  }

  clear() {
    this.marks.clear();
    this.measures.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Usage
const tracker = new PerformanceTracker();

tracker.mark('api-start');
await fetchData();
tracker.mark('api-end');

const apiDuration = tracker.measure('api-call', 'api-start', 'api-end');
console.log('API call took:', apiDuration, 'ms');
```

## Critical Rendering Path

### Resource Prioritization

```javascript
class ResourcePrioritizer {
  constructor() {
    this.priorities = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
  }

  addResource(url, priority = 'medium', type = 'script') {
    this.priorities[priority].push({ url, type });
  }

  async loadAll() {
    // Load critical resources first
    await this.loadPriority('critical');
    
    // Then high priority
    await this.loadPriority('high');
    
    // Medium and low can load in parallel
    await Promise.all([
      this.loadPriority('medium'),
      this.loadPriority('low')
    ]);
  }

  async loadPriority(priority) {
    const resources = this.priorities[priority];
    
    return Promise.all(
      resources.map(resource => this.loadResource(resource))
    );
  }

  loadResource({ url, type }) {
    return new Promise((resolve, reject) => {
      let element;
      
      switch (type) {
        case 'script':
          element = document.createElement('script');
          element.src = url;
          element.async = true;
          break;
        
        case 'style':
          element = document.createElement('link');
          element.rel = 'stylesheet';
          element.href = url;
          break;
        
        case 'image':
          element = new Image();
          element.src = url;
          break;
        
        default:
          reject(new Error(`Unknown type: ${type}`));
          return;
      }
      
      element.onload = resolve;
      element.onerror = reject;
      
      if (type !== 'image') {
        document.head.appendChild(element);
      }
    });
  }
}

// Usage
const prioritizer = new ResourcePrioritizer();

prioritizer.addResource('/critical.css', 'critical', 'style');
prioritizer.addResource('/critical.js', 'critical', 'script');
prioritizer.addResource('/app.js', 'high', 'script');
prioritizer.addResource('/analytics.js', 'low', 'script');

await prioritizer.loadAll();
```

### Preloading Strategies

```javascript
class PreloadManager {
  constructor() {
    this.preloaded = new Set();
  }

  preload(url, as, options = {}) {
    if (this.preloaded.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    
    if (options.type) {
      link.type = options.type;
    }
    
    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }
    
    if (options.importance) {
      link.importance = options.importance;
    }
    
    document.head.appendChild(link);
    this.preloaded.add(url);
  }

  prefetch(url) {
    if (this.preloaded.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    document.head.appendChild(link);
    this.preloaded.add(url);
  }

  preconnect(origin) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
  }

  dnsPrefetch(origin) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    
    document.head.appendChild(link);
  }

  preloadCriticalAssets() {
    // Preload critical CSS
    this.preload('/critical.css', 'style');
    
    // Preload critical fonts
    this.preload('/fonts/main.woff2', 'font', {
      type: 'font/woff2',
      crossorigin: 'anonymous'
    });
    
    // Preload hero image
    this.preload('/images/hero.jpg', 'image', {
      importance: 'high'
    });
  }

  prefetchNextPage(url) {
    // Prefetch next page resources
    this.prefetch(`${url}/main.js`);
    this.prefetch(`${url}/styles.css`);
    
    // Preconnect to API
    this.preconnect('https://api.example.com');
  }
}

// Usage
const preloadManager = new PreloadManager();
preloadManager.preloadCriticalAssets();

// On hover over link
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    preloadManager.prefetchNextPage(link.href);
  }, { once: true });
});
```

## JavaScript Performance

### Code Splitting

```javascript
// Dynamic imports
class CodeSplitter {
  constructor() {
    this.modules = new Map();
    this.loading = new Map();
  }

  async load(moduleName, importFn) {
    // Return cached module
    if (this.modules.has(moduleName)) {
      return this.modules.get(moduleName);
    }

    // Return in-flight promise
    if (this.loading.has(moduleName)) {
      return this.loading.get(moduleName);
    }

    // Load module
    const promise = importFn()
      .then(module => {
        this.modules.set(moduleName, module);
        this.loading.delete(moduleName);
        return module;
      })
      .catch(error => {
        this.loading.delete(moduleName);
        throw error;
      });

    this.loading.set(moduleName, promise);
    return promise;
  }

  preload(moduleName, importFn) {
    // Start loading but don't wait
    this.load(moduleName, importFn).catch(console.error);
  }

  clear(moduleName) {
    this.modules.delete(moduleName);
    this.loading.delete(moduleName);
  }
}

// Usage
const splitter = new CodeSplitter();

// Load on demand
button.addEventListener('click', async () => {
  const module = await splitter.load(
    'heavy-feature',
    () => import('./heavy-feature.js')
  );
  
  module.initialize();
});

// Preload on hover
button.addEventListener('mouseenter', () => {
  splitter.preload(
    'heavy-feature',
    () => import('./heavy-feature.js')
  );
}, { once: true });
```

### Tree Shaking

```javascript
// Webpack configuration for tree shaking
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: true
  }
};

// Package.json
{
  "sideEffects": false,
  // or specify files with side effects
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// Write tree-shakeable code
// BAD: Default export
export default {
  method1() {},
  method2() {},
  method3() {}
};

// GOOD: Named exports
export function method1() {}
export function method2() {}
export function method3() {}

// Import only what you need
import { method1 } from './utils';
```

### Memoization

```javascript
function memoize(fn, options = {}) {
  const cache = new Map();
  const maxSize = options.maxSize || Infinity;
  const ttl = options.ttl || Infinity;

  return function(...args) {
    const key = JSON.stringify(args);
    
    // Check cache
    if (cache.has(key)) {
      const cached = cache.get(key);
      
      // Check TTL
      if (Date.now() - cached.timestamp < ttl) {
        return cached.value;
      }
      
      cache.delete(key);
    }

    // Compute value
    const value = fn.apply(this, args);
    
    // Store in cache
    cache.set(key, {
      value,
      timestamp: Date.now()
    });

    // Enforce max size (LRU)
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return value;
  };
}

// Usage
const expensiveCalculation = memoize((n) => {
  console.log('Computing...');
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += Math.sqrt(i);
  }
  return result;
}, { maxSize: 100, ttl: 60000 });

console.log(expensiveCalculation(1000000)); // Computing... (slow)
console.log(expensiveCalculation(1000000)); // (instant, from cache)
```

### Web Workers for Heavy Computation

```javascript
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.taskId = 0;
    
    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      this.workers.push({
        worker,
        busy: false,
        tasks: new Map()
      });
      
      worker.onmessage = (e) => this.handleMessage(i, e);
    }
  }

  handleMessage(workerIndex, event) {
    const workerInfo = this.workers[workerIndex];
    const { taskId, result, error } = event.data;
    
    const task = workerInfo.tasks.get(taskId);
    if (task) {
      workerInfo.tasks.delete(taskId);
      
      if (error) {
        task.reject(new Error(error));
      } else {
        task.resolve(result);
      }
      
      if (workerInfo.tasks.size === 0) {
        workerInfo.busy = false;
        this.processQueue();
      }
    }
  }

  async execute(data) {
    return new Promise((resolve, reject) => {
      const taskId = this.taskId++;
      
      this.queue.push({
        taskId,
        data,
        resolve,
        reject
      });
      
      this.processQueue();
    });
  }

  processQueue() {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;
    
    const task = this.queue.shift();
    availableWorker.busy = true;
    availableWorker.tasks.set(task.taskId, {
      resolve: task.resolve,
      reject: task.reject
    });
    
    availableWorker.worker.postMessage({
      taskId: task.taskId,
      data: task.data
    });
  }

  terminate() {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}

// Worker script (worker.js)
/*
self.onmessage = async function(e) {
  const { taskId, data } = e.data;
  
  try {
    // Heavy computation
    const result = performHeavyComputation(data);
    
    self.postMessage({ taskId, result });
  } catch (error) {
    self.postMessage({ taskId, error: error.message });
  }
};

function performHeavyComputation(data) {
  // CPU-intensive work
  let result = 0;
  for (let i = 0; i < data.iterations; i++) {
    result += Math.sqrt(i);
  }
  return result;
}
*/

// Usage
const pool = new WorkerPool('worker.js', 4);

const results = await Promise.all([
  pool.execute({ iterations: 1000000 }),
  pool.execute({ iterations: 2000000 }),
  pool.execute({ iterations: 3000000 })
]);

console.log('Results:', results);
```

I'll continue with more content:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/19-expert-topics/02-performance-engineering.md

## Me
mory Optimization

### Memory Leak Detection

```javascript
class MemoryLeakDetector {
  constructor() {
    this.snapshots = [];
    this.listeners = new WeakMap();
    this.timers = new Set();
  }

  takeSnapshot() {
    if (performance.memory) {
      this.snapshots.push({
        timestamp: Date.now(),
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      });
    }
  }

  startMonitoring(interval = 5000) {
    this.monitoringInterval = setInterval(() => {
      this.takeSnapshot();
      this.analyze();
    }, interval);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }

  analyze() {
    if (this.snapshots.length < 3) return;

    const recent = this.snapshots.slice(-10);
    const trend = this.calculateTrend(recent);

    if (trend > 1000000) { // 1MB growth per snapshot
      console.warn('Potential memory leak detected!');
      console.warn('Memory growth rate:', trend, 'bytes per snapshot');
      this.reportLeak(trend);
    }
  }

  calculateTrend(snapshots) {
    if (snapshots.length < 2) return 0;

    const values = snapshots.map(s => s.usedJSHeapSize);
    const n = values.length;
    
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  reportLeak(trend) {
    // Send to monitoring service
    console.log('Leak report:', {
      trend,
      snapshots: this.snapshots.slice(-5),
      timestamp: Date.now()
    });
  }

  trackEventListener(element, event, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }
    
    const elementListeners = this.listeners.get(element);
    if (!elementListeners.has(event)) {
      elementListeners.set(event, new Set());
    }
    
    elementListeners.get(event).add(handler);
  }

  trackTimer(id) {
    this.timers.add(id);
  }

  getReport() {
    return {
      snapshots: this.snapshots,
      trend: this.calculateTrend(this.snapshots),
      activeTimers: this.timers.size
    };
  }
}

// Usage
const detector = new MemoryLeakDetector();
detector.startMonitoring(5000);

// Track event listeners
const handler = () => console.log('clicked');
element.addEventListener('click', handler);
detector.trackEventListener(element, 'click', handler);

// Track timers
const timerId = setInterval(() => {}, 1000);
detector.trackTimer(timerId);
```

### Object Pooling for Memory Efficiency

```javascript
class AdvancedObjectPool {
  constructor(factory, reset, options = {}) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = options.maxSize || 100;
    this.minSize = options.minSize || 10;
    this.pool = [];
    this.inUse = new Set();
    this.stats = {
      created: 0,
      acquired: 0,
      released: 0,
      reused: 0
    };
    
    // Pre-allocate minimum objects
    for (let i = 0; i < this.minSize; i++) {
      this.pool.push(this.factory());
      this.stats.created++;
    }
  }

  acquire() {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
      this.stats.reused++;
    } else if (this.inUse.size < this.maxSize) {
      obj = this.factory();
      this.stats.created++;
    } else {
      throw new Error('Pool exhausted');
    }
    
    this.inUse.add(obj);
    this.stats.acquired++;
    return obj;
  }

  release(obj) {
    if (!this.inUse.has(obj)) {
      throw new Error('Object not from this pool');
    }
    
    this.inUse.delete(obj);
    this.reset(obj);
    
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
      this.stats.released++;
    }
  }

  drain() {
    this.pool = [];
    this.inUse.clear();
  }

  getStats() {
    return {
      ...this.stats,
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      reuseRate: this.stats.reused / this.stats.acquired
    };
  }
}

// Usage with DOM elements
const divPool = new AdvancedObjectPool(
  () => document.createElement('div'),
  (div) => {
    div.className = '';
    div.textContent = '';
    div.style.cssText = '';
  },
  { maxSize: 50, minSize: 10 }
);

// Acquire and use
const div = divPool.acquire();
div.textContent = 'Hello';
document.body.appendChild(div);

// Release when done
div.remove();
divPool.release(div);

console.log(divPool.getStats());
```

## Network Optimization

### Request Batching

```javascript
class RequestBatcher {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 10;
    this.batchDelay = options.batchDelay || 50;
    this.endpoint = options.endpoint;
    this.pending = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.pending.push({ request, resolve, reject });
      
      if (this.pending.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.pending.length === 0) return;

    const batch = this.pending.splice(0, this.batchSize);
    const requests = batch.map(b => b.request);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests })
      });

      const results = await response.json();

      batch.forEach((item, index) => {
        const result = results[index];
        if (result.error) {
          item.reject(new Error(result.error));
        } else {
          item.resolve(result.data);
        }
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }

    // Process remaining requests
    if (this.pending.length > 0) {
      this.flush();
    }
  }
}

// Usage
const batcher = new RequestBatcher({
  endpoint: '/api/batch',
  batchSize: 10,
  batchDelay: 50
});

// Multiple requests get batched
const results = await Promise.all([
  batcher.add({ type: 'getUser', id: 1 }),
  batcher.add({ type: 'getUser', id: 2 }),
  batcher.add({ type: 'getPost', id: 100 })
]);
```

### HTTP/2 Server Push Simulation

```javascript
class ResourcePusher {
  constructor() {
    this.pushed = new Set();
    this.dependencies = new Map();
  }

  registerDependencies(resource, deps) {
    this.dependencies.set(resource, deps);
  }

  async push(resource) {
    if (this.pushed.has(resource)) return;
    
    this.pushed.add(resource);
    
    // Get dependencies
    const deps = this.dependencies.get(resource) || [];
    
    // Push dependencies first
    await Promise.all(
      deps.map(dep => this.pushResource(dep))
    );
    
    // Push main resource
    await this.pushResource(resource);
  }

  async pushResource(url) {
    if (this.pushed.has(url)) return;
    
    this.pushed.add(url);
    
    // Use link preload
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = this.getResourceType(url);
    
    document.head.appendChild(link);
    
    // Actually fetch
    return fetch(url);
  }

  getResourceType(url) {
    const ext = url.split('.').pop();
    const types = {
      'js': 'script',
      'css': 'style',
      'woff': 'font',
      'woff2': 'font',
      'jpg': 'image',
      'png': 'image',
      'webp': 'image'
    };
    return types[ext] || 'fetch';
  }
}

// Usage
const pusher = new ResourcePusher();

// Register dependencies
pusher.registerDependencies('/app.js', [
  '/vendor.js',
  '/polyfills.js'
]);

pusher.registerDependencies('/app.css', [
  '/fonts/main.woff2'
]);

// Push resources with dependencies
await pusher.push('/app.js');
await pusher.push('/app.css');
```

### Adaptive Loading

```javascript
class AdaptiveLoader {
  constructor() {
    this.connection = navigator.connection || navigator.mozConnection;
    this.deviceMemory = navigator.deviceMemory || 4;
    this.hardwareConcurrency = navigator.hardwareConcurrency || 4;
  }

  getDeviceCapability() {
    const effectiveType = this.connection?.effectiveType || '4g';
    const saveData = this.connection?.saveData || false;
    
    if (saveData) return 'low';
    
    // Score based on multiple factors
    let score = 0;
    
    // Network
    if (effectiveType === '4g') score += 3;
    else if (effectiveType === '3g') score += 2;
    else score += 1;
    
    // Memory
    if (this.deviceMemory >= 8) score += 3;
    else if (this.deviceMemory >= 4) score += 2;
    else score += 1;
    
    // CPU
    if (this.hardwareConcurrency >= 8) score += 3;
    else if (this.hardwareConcurrency >= 4) score += 2;
    else score += 1;
    
    // Classify
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }

  async loadImage(src, options = {}) {
    const capability = this.getDeviceCapability();
    
    let actualSrc = src;
    
    switch (capability) {
      case 'low':
        actualSrc = options.lowQuality || src;
        break;
      case 'medium':
        actualSrc = options.mediumQuality || src;
        break;
      case 'high':
        actualSrc = options.highQuality || src;
        break;
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = actualSrc;
    });
  }

  async loadComponent(importFn, fallbackFn) {
    const capability = this.getDeviceCapability();
    
    if (capability === 'low' && fallbackFn) {
      return fallbackFn();
    }
    
    return importFn();
  }

  shouldLoadFeature(feature) {
    const capability = this.getDeviceCapability();
    
    const features = {
      animations: ['medium', 'high'],
      videoAutoplay: ['high'],
      highResImages: ['medium', 'high'],
      webWorkers: ['medium', 'high'],
      serviceWorker: ['medium', 'high']
    };
    
    return features[feature]?.includes(capability) ?? true;
  }
}

// Usage
const loader = new AdaptiveLoader();

// Load appropriate image quality
const img = await loader.loadImage('/hero.jpg', {
  lowQuality: '/hero-low.jpg',
  mediumQuality: '/hero-medium.jpg',
  highQuality: '/hero-high.jpg'
});

// Conditionally load features
if (loader.shouldLoadFeature('animations')) {
  await import('./animations.js');
}

// Load component based on capability
const Component = await loader.loadComponent(
  () => import('./RichComponent'),
  () => import('./SimpleComponent')
);
```

## Rendering Performance

### Virtual Scrolling

```javascript
class VirtualScroller {
  constructor(container, options = {}) {
    this.container = container;
    this.itemHeight = options.itemHeight || 50;
    this.buffer = options.buffer || 5;
    this.items = [];
    this.visibleItems = [];
    this.scrollTop = 0;
    
    this.setupContainer();
    this.attachListeners();
  }

  setupContainer() {
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';
    
    this.viewport = document.createElement('div');
    this.viewport.style.position = 'relative';
    this.container.appendChild(this.viewport);
  }

  attachListeners() {
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.render();
    });
  }

  setItems(items) {
    this.items = items;
    this.viewport.style.height = `${items.length * this.itemHeight}px`;
    this.render();
  }

  render() {
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.buffer
    );
    
    const endIndex = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.container.clientHeight) / this.itemHeight) + this.buffer
    );

    // Remove items outside visible range
    this.visibleItems.forEach(item => {
      if (item.index < startIndex || item.index >= endIndex) {
        item.element.remove();
      }
    });

    // Add items in visible range
    const newVisibleItems = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      let item = this.visibleItems.find(v => v.index === i);
      
      if (!item) {
        const element = this.createItemElement(this.items[i], i);
        this.viewport.appendChild(element);
        item = { index: i, element };
      }
      
      newVisibleItems.push(item);
    }
    
    this.visibleItems = newVisibleItems;
  }

  createItemElement(data, index) {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = `${index * this.itemHeight}px`;
    element.style.height = `${this.itemHeight}px`;
    element.style.width = '100%';
    element.textContent = data;
    return element;
  }
}

// Usage
const scroller = new VirtualScroller(
  document.getElementById('container'),
  { itemHeight: 50, buffer: 5 }
);

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
scroller.setItems(items);
```

### RAF Throttling

```javascript
class RAFThrottler {
  constructor() {
    this.rafId = null;
    this.lastArgs = null;
  }

  throttle(callback) {
    return (...args) => {
      this.lastArgs = args;
      
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          callback.apply(null, this.lastArgs);
          this.rafId = null;
          this.lastArgs = null;
        });
      }
    };
  }

  cancel() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.lastArgs = null;
    }
  }
}

// Usage
const throttler = new RAFThrottler();

const handleScroll = throttler.throttle((event) => {
  console.log('Scroll position:', window.scrollY);
  // Expensive DOM operations
});

window.addEventListener('scroll', handleScroll);
```

### Layout Thrashing Prevention

```javascript
class LayoutOptimizer {
  constructor() {
    this.readQueue = [];
    this.writeQueue = [];
    this.scheduled = false;
  }

  read(fn) {
    this.readQueue.push(fn);
    this.schedule();
  }

  write(fn) {
    this.writeQueue.push(fn);
    this.schedule();
  }

  schedule() {
    if (this.scheduled) return;
    
    this.scheduled = true;
    
    requestAnimationFrame(() => {
      // Batch all reads first
      this.readQueue.forEach(fn => fn());
      this.readQueue = [];
      
      // Then batch all writes
      this.writeQueue.forEach(fn => fn());
      this.writeQueue = [];
      
      this.scheduled = false;
    });
  }

  measure(element, property) {
    return new Promise(resolve => {
      this.read(() => {
        const value = element[property];
        resolve(value);
      });
    });
  }

  mutate(element, property, value) {
    return new Promise(resolve => {
      this.write(() => {
        element[property] = value;
        resolve();
      });
    });
  }
}

// Usage
const optimizer = new LayoutOptimizer();

// BAD: Causes layout thrashing
elements.forEach(el => {
  const height = el.offsetHeight; // Read
  el.style.width = height + 'px'; // Write
});

// GOOD: Batched reads and writes
elements.forEach(el => {
  optimizer.read(() => {
    const height = el.offsetHeight;
    
    optimizer.write(() => {
      el.style.width = height + 'px';
    });
  });
});
```

## Bundle Optimization

### Code Splitting Strategies

```javascript
// Route-based splitting
const routes = [
  {
    path: '/',
    component: () => import('./pages/Home')
  },
  {
    path: '/about',
    component: () => import('./pages/About')
  },
  {
    path: '/dashboard',
    component: () => import('./pages/Dashboard')
  }
];

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}

// Vendor splitting (webpack config)
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        common: {
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

### Dynamic Import Optimization

```javascript
class DynamicImportOptimizer {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.prefetched = new Set();
  }

  async import(modulePath) {
    // Return cached module
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath);
    }

    // Return in-flight promise
    if (this.loading.has(modulePath)) {
      return this.loading.get(modulePath);
    }

    // Import module
    const promise = import(modulePath)
      .then(module => {
        this.cache.set(modulePath, module);
        this.loading.delete(modulePath);
        return module;
      })
      .catch(error => {
        this.loading.delete(modulePath);
        throw error;
      });

    this.loading.set(modulePath, promise);
    return promise;
  }

  prefetch(modulePath) {
    if (this.prefetched.has(modulePath)) return;
    
    this.prefetched.add(modulePath);
    
    // Use link prefetch
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = modulePath;
    document.head.appendChild(link);
  }

  preload(modulePath) {
    // Use link preload for critical resources
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = modulePath;
    link.as = 'script';
    document.head.appendChild(link);
  }

  async importWithRetry(modulePath, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await this.import(modulePath);
      } catch (error) {
        if (i === retries - 1) throw error;
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }
}

// Usage
const optimizer = new DynamicImportOptimizer();

// Prefetch on hover
button.addEventListener('mouseenter', () => {
  optimizer.prefetch('./heavy-feature.js');
}, { once: true });

// Import on click
button.addEventListener('click', async () => {
  const module = await optimizer.import('./heavy-feature.js');
  module.initialize();
});
```

## Performance Monitoring

### Real User Monitoring (RUM)

```javascript
class RUMCollector {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.metrics = {};
    this.buffer = [];
    this.flushInterval = 30000; // 30 seconds
    
    this.collectMetrics();
    this.startFlushing();
  }

  collectMetrics() {
    // Navigation Timing
    if (performance.timing) {
      const timing = performance.timing;
      this.metrics.navigationTiming = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domComplete - timing.domLoading,
        load: timing.loadEventEnd - timing.loadEventStart
      };
    }

    // Resource Timing
    const resources = performance.getEntriesByType('resource');
    this.metrics.resources = resources.map(r => ({
      name: r.name,
      duration: r.duration,
      size: r.transferSize,
      type: r.initiatorType
    }));

    // Paint Timing
    const paintEntries = performance.getEntriesByType('paint');
    this.metrics.paint = {};
    paintEntries.forEach(entry => {
      this.metrics.paint[entry.name] = entry.startTime;
    });

    // Core Web Vitals
    this.collectWebVitals();
  }

  collectWebVitals() {
    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.addMetric('LCP', lastEntry.renderTime || lastEntry.loadTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.addMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS
    let clsScore = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
          this.addMetric('CLS', clsScore);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  addMetric(name, value, metadata = {}) {
    this.buffer.push({
      name,
      value,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }

  startFlushing() {
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  async flush() {
    if (this.buffer.length === 0) return;

    const data = this.buffer.splice(0);
    
    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.endpoint,
          JSON.stringify(data)
        );
      } else {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        });
      }
    } catch (error) {
      console.error('Failed to send metrics:', error);
      // Re-add to buffer
      this.buffer.unshift(...data);
    }
  }

  trackCustomMetric(name, value, metadata) {
    this.addMetric(name, value, metadata);
  }
}

// Usage
const rum = new RUMCollector('/api/metrics');

// Track custom metrics
rum.trackCustomMetric('api-call-duration', 234, {
  endpoint: '/api/users',
  method: 'GET'
});
```

## Summary

Performance engineering encompasses:
- **Metrics**: Core Web Vitals (LCP, FID, CLS), custom timing
- **Critical Rendering Path**: Resource prioritization, preloading
- **JavaScript**: Code splitting, memoization, Web Workers
- **Memory**: Leak detection, object pooling, efficient allocation
- **Network**: Request batching, adaptive loading, HTTP/2
- **Rendering**: Virtual scrolling, RAF throttling, layout optimization
- **Bundles**: Code splitting, tree shaking, dynamic imports
- **Monitoring**: RUM, synthetic monitoring, performance budgets

These techniques are essential for building fast, responsive web applications that provide excellent user experiences across all devices and network conditions.
