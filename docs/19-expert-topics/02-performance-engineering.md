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