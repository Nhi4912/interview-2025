# Runtime Performance - JavaScript Execution

> Optimize JavaScript runtime để app responsive. Memory management, Web Workers, và optimization patterns.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RUNTIME PERFORMANCE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    MAIN THREAD                           │   │
│   │                                                           │   │
│   │   JavaScript ──▶ Style ──▶ Layout ──▶ Paint ──▶ Composite│   │
│   │                                                           │   │
│   │   Long Task (>50ms) = Blocked UI = Bad UX               │   │
│   │                                                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   OPTIMIZATION GOALS:                                            │
│   • Keep tasks < 50ms                                            │
│   • Yield to browser regularly                                   │
│   • Move heavy work off main thread                             │
│   • Minimize memory allocations                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ JavaScript Optimization

### Avoid Long Tasks

```javascript
// ❌ Long task - blocks main thread
function processLargeArray(items) {
    items.forEach(item => {
        expensiveOperation(item);
    });
}

// ✅ Break into chunks using scheduler
async function processInChunks(items) {
    const CHUNK_SIZE = 100;

    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        chunk.forEach(expensiveOperation);

        // Yield to browser
        await scheduler.yield?.() ?? new Promise(r => setTimeout(r, 0));
    }
}

// ✅ Using requestIdleCallback
function processWhenIdle(items, callback) {
    let index = 0;

    function processChunk(deadline) {
        while (index < items.length && deadline.timeRemaining() > 0) {
            expensiveOperation(items[index]);
            index++;
        }

        if (index < items.length) {
            requestIdleCallback(processChunk);
        } else {
            callback();
        }
    }

    requestIdleCallback(processChunk);
}

// ✅ Using scheduler.postTask (modern)
async function processWithPriority(items) {
    const results = [];

    for (const item of items) {
        const result = await scheduler.postTask(
            () => expensiveOperation(item),
            { priority: 'background' }
        );
        results.push(result);
    }

    return results;
}
```

### Debouncing & Throttling

```javascript
// Debounce: Wait until activity stops
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Usage: Search input
const debouncedSearch = debounce((query) => {
    fetchResults(query);
}, 300);

input.addEventListener('input', (e) => debouncedSearch(e.target.value));

// Throttle: Limit frequency
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage: Scroll handler
const throttledScroll = throttle(() => {
    updateScrollPosition();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Throttle with requestAnimationFrame
function rafThrottle(fn) {
    let rafId = null;
    return function (...args) {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            fn.apply(this, args);
            rafId = null;
        });
    };
}
```

---

## 🔄 requestAnimationFrame

### Animation Loop

```javascript
// ❌ Using setInterval for animations
setInterval(() => {
    element.style.left = position++ + 'px';
}, 16);

// ✅ Using requestAnimationFrame
let position = 0;

function animate() {
    element.style.transform = `translateX(${position++}px)`;

    if (position < 500) {
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

// ✅ Time-based animation (smooth regardless of frame rate)
let start = null;
const duration = 1000; // 1 second

function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const eased = easeOutQuad(progress);
    element.style.transform = `translateX(${eased * 500}px)`;

    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}

function easeOutQuad(t) {
    return t * (2 - t);
}

requestAnimationFrame(animate);
```

### Batching DOM Reads/Writes

```javascript
// ❌ Causes layout thrashing
elements.forEach(el => {
    const height = el.offsetHeight; // Read (forces layout)
    el.style.height = height * 2 + 'px'; // Write (invalidates layout)
});

// ✅ Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads

elements.forEach((el, i) => {
    el.style.height = heights[i] * 2 + 'px'; // All writes
});

// ✅ Using requestAnimationFrame for batch updates
function batchUpdate(updates) {
    requestAnimationFrame(() => {
        updates.forEach(update => update());
    });
}

batchUpdate([
    () => element1.style.width = '100px',
    () => element2.style.height = '200px',
    () => element3.style.opacity = '0.5'
]);
```

---

## 👷 Web Workers

### Basic Worker

```javascript
// main.js
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({ type: 'process', data: largeDataSet });

// Receive results
worker.onmessage = (e) => {
    console.log('Result:', e.data);
    updateUI(e.data);
};

// Handle errors
worker.onerror = (e) => {
    console.error('Worker error:', e.message);
};

// Terminate worker when done
worker.terminate();

// worker.js
self.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === 'process') {
        // Heavy computation off main thread
        const result = heavyComputation(data);
        self.postMessage(result);
    }
};

function heavyComputation(data) {
    // Complex processing here
    return data.map(item => item * 2);
}
```

### Transferable Objects

```javascript
// For large arrays, use Transferable (zero-copy)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
const view = new Uint8Array(buffer);

// ❌ Copies entire buffer (slow)
worker.postMessage({ buffer: view });

// ✅ Transfers buffer ownership (instant)
worker.postMessage(buffer, [buffer]);
// Note: buffer is now unusable in main thread

// In worker
self.onmessage = (e) => {
    const buffer = e.data;
    // Process buffer
    const result = processBuffer(buffer);
    // Transfer back
    self.postMessage(result, [result.buffer]);
};
```

### Worker Pool

```javascript
class WorkerPool {
    constructor(workerScript, poolSize = navigator.hardwareConcurrency) {
        this.workers = [];
        this.queue = [];
        this.activeWorkers = new Set();

        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker(workerScript);
            worker.onmessage = (e) => this.handleComplete(worker, e);
            this.workers.push(worker);
        }
    }

    handleComplete(worker, event) {
        this.activeWorkers.delete(worker);

        // Process next task in queue
        if (this.queue.length > 0) {
            const { data, resolve } = this.queue.shift();
            this.runTask(worker, data, resolve);
        }
    }

    runTask(worker, data, resolve) {
        this.activeWorkers.add(worker);
        worker.onmessage = (e) => {
            resolve(e.data);
            this.handleComplete(worker, e);
        };
        worker.postMessage(data);
    }

    process(data) {
        return new Promise((resolve) => {
            const availableWorker = this.workers.find(
                w => !this.activeWorkers.has(w)
            );

            if (availableWorker) {
                this.runTask(availableWorker, data, resolve);
            } else {
                this.queue.push({ data, resolve });
            }
        });
    }
}

// Usage
const pool = new WorkerPool('processor.js', 4);

async function processAll(items) {
    const results = await Promise.all(
        items.map(item => pool.process(item))
    );
    return results;
}
```

---

## 🧠 Memory Management

### Memory Leaks

```javascript
// ❌ LEAK: Event listener not removed
function setupButton() {
    const button = document.getElementById('btn');
    const heavyData = new Array(1000000).fill('data');

    button.addEventListener('click', () => {
        console.log(heavyData.length);
    });
}
// heavyData stays in memory as long as listener exists

// ✅ FIX: Remove listener when done
function setupButton() {
    const button = document.getElementById('btn');
    const heavyData = new Array(1000000).fill('data');

    const handler = () => {
        console.log(heavyData.length);
    };

    button.addEventListener('click', handler);

    // Cleanup function
    return () => {
        button.removeEventListener('click', handler);
    };
}

// ❌ LEAK: Detached DOM nodes
let detachedNode = document.createElement('div');
document.body.appendChild(detachedNode);
document.body.removeChild(detachedNode);
// detachedNode still in memory!

// ✅ FIX: Set to null
document.body.removeChild(detachedNode);
detachedNode = null;

// ❌ LEAK: Closures holding references
function createLeak() {
    const hugeArray = new Array(1000000);

    return function() {
        // hugeArray is retained even if not used
        return 'hello';
    };
}

// ✅ FIX: Don't capture unnecessary variables
function noLeak() {
    const hugeArray = new Array(1000000);
    const result = processArray(hugeArray);

    return function() {
        return result; // Only result is captured
    };
}

// React: Cleanup in useEffect
useEffect(() => {
    const subscription = eventEmitter.subscribe(handler);

    return () => {
        subscription.unsubscribe(); // Cleanup on unmount
    };
}, []);
```

### WeakMap/WeakSet for Caching

```javascript
// ❌ Map prevents garbage collection
const cache = new Map();

function processObject(obj) {
    if (cache.has(obj)) {
        return cache.get(obj);
    }
    const result = expensiveComputation(obj);
    cache.set(obj, result);
    return result;
}
// Objects in cache never get GC'd

// ✅ WeakMap allows garbage collection
const cache = new WeakMap();

function processObject(obj) {
    if (cache.has(obj)) {
        return cache.get(obj);
    }
    const result = expensiveComputation(obj);
    cache.set(obj, result);
    return result;
}
// When obj is no longer referenced elsewhere, it can be GC'd
```

---

## 📊 Performance Profiling

### DevTools Performance Panel

```javascript
// Mark performance timeline
performance.mark('start-operation');

// ... operation code ...

performance.mark('end-operation');
performance.measure('operation', 'start-operation', 'end-operation');

// Get measurements
const measures = performance.getEntriesByName('operation');
console.log('Duration:', measures[0].duration);

// Clear marks
performance.clearMarks();
performance.clearMeasures();

// Using console.time
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Profiling in code
if (process.env.NODE_ENV === 'development') {
    const start = performance.now();

    // ... code ...

    const duration = performance.now() - start;
    if (duration > 16) {
        console.warn(`Slow operation: ${duration.toFixed(2)}ms`);
    }
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: What is a long task?**

A: Task that blocks main thread for >50ms. Causes janky animations and unresponsive UI. Should break into smaller chunks using setTimeout, requestIdleCallback, or scheduler.yield().

**Q: Why use requestAnimationFrame?**

A: Synchronizes animations with browser's repaint cycle (60fps). More efficient than setInterval, pauses when tab not visible, provides smooth animations.

### 🟡 Mid-level

**Q: How do you prevent memory leaks?**

A:
1. Remove event listeners when component unmounts
2. Clear timers (clearTimeout, clearInterval)
3. Cancel subscriptions (RxJS, etc.)
4. Set DOM references to null
5. Use WeakMap/WeakSet for caches

**Q: Debounce vs throttle?**

A:
- **Debounce**: Wait until activity stops. Use for: search input, resize end
- **Throttle**: Limit frequency. Use for: scroll handler, mouse move

### 🔴 Senior

**Q: When to use Web Workers?**

A: Heavy computation that would block main thread:
- Image/video processing
- Data parsing (large JSON)
- Complex calculations
- Encryption/compression

Consider: Overhead of message passing, limited APIs in workers (no DOM).

**Q: How would you optimize a slow list rendering?**

A:
```
1. Virtualization: Only render visible items
2. Memoization: React.memo, useMemo
3. Batch updates: Use unstable_batchedUpdates
4. Lazy load: Load items as user scrolls
5. Web Worker: Process data off main thread
6. requestIdleCallback: Non-urgent updates
```

---

## 📚 Active Recall

1. [ ] Long task threshold (50ms)
2. [ ] requestAnimationFrame vs setInterval
3. [ ] Debounce vs throttle use cases
4. [ ] Common memory leak sources
5. [ ] Web Worker communication methods

---

> **Tiếp theo:** [04-rendering-performance.md](./04-rendering-performance.md) - Rendering Performance
