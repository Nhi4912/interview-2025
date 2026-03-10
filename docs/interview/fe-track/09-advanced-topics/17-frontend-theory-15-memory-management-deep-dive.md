# Memory Management Deep Dive

## Table of Contents
- [Memory Fundamentals](#memory-fundamentals)
- [Garbage Collection](#garbage-collection)
- [Memory Leaks](#memory-leaks)
- [Memory Profiling](#memory-profiling)
- [Optimization Techniques](#optimization-techniques)
- [WeakMap and WeakSet](#weakmap-and-weakset)
- [Memory Allocation Patterns](#memory-allocation-patterns)
- [Browser Memory Model](#browser-memory-model)

## Memory Fundamentals

### JavaScript Memory Model

**Memory Regions**:
```
┌─────────────────────────────────┐
│         Call Stack              │  Function execution contexts
├─────────────────────────────────┤
│         Heap                    │  Objects, closures, functions
├─────────────────────────────────┤
│         Code Segment            │  Compiled code
└─────────────────────────────────┘
```

**Value Types**:
```javascript
// Primitive values (stored on stack)
let num = 42;              // Number
let str = "hello";         // String
let bool = true;           // Boolean
let nothing = null;        // Null
let undef = undefined;     // Undefined
let sym = Symbol('id');    // Symbol
let big = 123n;            // BigInt

// Reference values (stored on heap)
let obj = { x: 1 };        // Object
let arr = [1, 2, 3];       // Array
let fn = () => {};         // Function
```

**Memory Allocation**:
```javascript
// Stack allocation (automatic)
function calculate() {
  let x = 10;  // Allocated on stack
  let y = 20;  // Allocated on stack
  return x + y;
} // x and y automatically deallocated

// Heap allocation (manual/GC)
function createObject() {
  return { data: new Array(1000) }; // Allocated on heap
} // Object remains until GC collects it
```

### Memory Lifecycle

**Phases**:
```
1. Allocation: Memory is allocated for values
2. Usage: Program reads/writes to memory
3. Deallocation: Memory is freed (GC)
```

**Allocation Examples**:
```javascript
// Implicit allocation
let str = "hello";                    // String allocation
let obj = { x: 1 };                   // Object allocation
let arr = [1, 2, 3];                  // Array allocation

// Explicit allocation
let buffer = new ArrayBuffer(1024);   // Buffer allocation
let arr = new Array(1000);            // Array with size
let map = new Map();                  // Map allocation
```

## Garbage Collection

### Mark-and-Sweep Algorithm

**Concept**:
```
1. Mark Phase:
   - Start from roots (global, stack)
   - Mark all reachable objects
   
2. Sweep Phase:
   - Iterate through heap
   - Collect unmarked objects
```

**Implementation Concept**:
```javascript
class GarbageCollector {
  constructor() {
    this.heap = new Set();
    this.roots = new Set();
  }

  allocate(object) {
    this.heap.add(object);
    return object;
  }

  addRoot(object) {
    this.roots.add(object);
  }

  mark(object, marked = new Set()) {
    if (marked.has(object)) return;
    marked.add(object);

    // Mark referenced objects
    for (const key in object) {
      if (typeof object[key] === 'object' && object[key] !== null) {
        this.mark(object[key], marked);
      }
    }

    return marked;
  }

  sweep(marked) {
    const toDelete = [];
    
    for (const object of this.heap) {
      if (!marked.has(object)) {
        toDelete.push(object);
      }
    }

    toDelete.forEach(obj => this.heap.delete(obj));
    return toDelete.length;
  }

  collect() {
    // Mark phase
    const marked = new Set();
    for (const root of this.roots) {
      this.mark(root, marked);
    }

    // Sweep phase
    return this.sweep(marked);
  }
}
```

### Generational GC

**Concept**:
```
Young Generation (Minor GC):
- New objects allocated here
- Frequent, fast collections
- Most objects die young

Old Generation (Major GC):
- Long-lived objects promoted here
- Infrequent, slower collections
- Survivors from young generation
```

**V8 Generations**:
```
┌──────────────────────────────────┐
│   New Space (Young Generation)   │
│   ┌────────────┬────────────┐   │
│   │  From      │    To      │   │
│   │  Space     │   Space    │   │
│   └────────────┴────────────┘   │
├──────────────────────────────────┤
│   Old Space (Old Generation)     │
│   - Old Pointer Space            │
│   - Old Data Space               │
├──────────────────────────────────┤
│   Large Object Space             │
│   - Objects > 1MB                │
├──────────────────────────────────┤
│   Code Space                     │
│   - Compiled code                │
└──────────────────────────────────┘
```

### Reference Counting

**Concept**:
```javascript
// Simplified reference counting
class RefCounted {
  constructor(value) {
    this.value = value;
    this.refCount = 0;
  }

  addRef() {
    this.refCount++;
  }

  release() {
    this.refCount--;
    if (this.refCount === 0) {
      this.dispose();
    }
  }

  dispose() {
    console.log('Object disposed');
    // Clean up resources
  }
}

// Usage
let obj = new RefCounted({ data: 'test' });
obj.addRef();  // refCount = 1
obj.addRef();  // refCount = 2
obj.release(); // refCount = 1
obj.release(); // refCount = 0, disposed
```

**Circular Reference Problem**:
```javascript
// Reference counting fails with cycles
function createCycle() {
  const obj1 = { name: 'obj1' };
  const obj2 = { name: 'obj2' };
  
  obj1.ref = obj2;  // obj1 -> obj2
  obj2.ref = obj1;  // obj2 -> obj1
  
  // Both have refCount = 1
  // Neither can be collected with pure reference counting
}

// Mark-and-sweep handles this correctly
```

## Memory Leaks

### Common Leak Patterns

**1. Forgotten Timers**:
```javascript
// BAD: Timer keeps reference
class Component {
  constructor() {
    this.data = new Array(1000000);
    setInterval(() => {
      console.log(this.data.length);
    }, 1000);
  }
}

// GOOD: Clear timer
class Component {
  constructor() {
    this.data = new Array(1000000);
    this.timerId = setInterval(() => {
      console.log(this.data.length);
    }, 1000);
  }

  destroy() {
    clearInterval(this.timerId);
  }
}
```

**2. Event Listeners**:
```javascript
// BAD: Listener not removed
class Component {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    this.element.addEventListener('click', () => {
      console.log(this.data.length);
    });
  }
}

// GOOD: Remove listener
class Component {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    this.handler = () => console.log(this.data.length);
    this.element.addEventListener('click', this.handler);
  }

  destroy() {
    this.element.removeEventListener('click', this.handler);
  }
}
```

**3. Closures**:
```javascript
// BAD: Closure captures large object
function createHandler() {
  const largeData = new Array(1000000);
  
  return function handler() {
    console.log('Handler called');
    // largeData is captured even if not used
  };
}

// GOOD: Don't capture unnecessary data
function createHandler() {
  const largeData = new Array(1000000);
  const needed = largeData.length;
  
  return function handler() {
    console.log('Handler called', needed);
    // Only needed value is captured
  };
}
```

**4. Global Variables**:
```javascript
// BAD: Accidental global
function process() {
  data = new Array(1000000); // Forgot 'let/const'
  // data is now global and never collected
}

// GOOD: Use strict mode
'use strict';
function process() {
  const data = new Array(1000000);
  // data is local and will be collected
}
```

**5. Detached DOM Nodes**:
```javascript
// BAD: Keep reference to removed node
let detachedNodes = [];

function removeElement(element) {
  detachedNodes.push(element);
  element.remove();
  // Node is removed from DOM but still referenced
}

// GOOD: Don't keep references
function removeElement(element) {
  element.remove();
  // Node can be garbage collected
}
```

**6. Cache Without Limits**:
```javascript
// BAD: Unbounded cache
const cache = new Map();

function getData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = fetchData(key);
  cache.set(key, data); // Cache grows forever
  return data;
}

// GOOD: LRU cache with size limit
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    this.cache.set(key, value);
    
    // Remove oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

### Leak Detection

**Manual Detection**:
```javascript
class LeakDetector {
  constructor() {
    this.allocations = new Map();
    this.nextId = 0;
  }

  track(object, name) {
    const id = this.nextId++;
    this.allocations.set(id, {
      name,
      object: new WeakRef(object),
      timestamp: Date.now(),
      stack: new Error().stack
    });
    return id;
  }

  check() {
    const leaks = [];
    
    for (const [id, allocation] of this.allocations) {
      const object = allocation.object.deref();
      
      if (object !== undefined) {
        const age = Date.now() - allocation.timestamp;
        if (age > 60000) { // Alive for > 1 minute
          leaks.push({
            id,
            name: allocation.name,
            age,
            stack: allocation.stack
          });
        }
      } else {
        // Object was collected
        this.allocations.delete(id);
      }
    }
    
    return leaks;
  }
}

// Usage
const detector = new LeakDetector();

function createComponent() {
  const component = { data: new Array(1000) };
  detector.track(component, 'Component');
  return component;
}

// Check for leaks periodically
setInterval(() => {
  const leaks = detector.check();
  if (leaks.length > 0) {
    console.warn('Potential leaks:', leaks);
  }
}, 10000);
```

## Memory Profiling

### Heap Snapshots

**Taking Snapshots**:
```javascript
// In Chrome DevTools
// 1. Open DevTools > Memory tab
// 2. Select "Heap snapshot"
// 3. Click "Take snapshot"

// Programmatically (Node.js)
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot(filename) {
  const snapshot = v8.writeHeapSnapshot(filename);
  console.log('Snapshot written to', snapshot);
}

// Compare snapshots to find leaks
takeHeapSnapshot('before.heapsnapshot');
// ... perform operations
takeHeapSnapshot('after.heapsnapshot');
```

### Allocation Timeline

**Recording Allocations**:
```javascript
// Chrome DevTools: Memory > Allocation instrumentation on timeline

// Analyze allocation patterns
class AllocationTracker {
  constructor() {
    this.allocations = [];
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    this.startTime = performance.now();
  }

  disable() {
    this.enabled = false;
  }

  track(size, type) {
    if (!this.enabled) return;
    
    this.allocations.push({
      size,
      type,
      timestamp: performance.now() - this.startTime,
      stack: new Error().stack
    });
  }

  analyze() {
    const byType = new Map();
    
    for (const allocation of this.allocations) {
      const current = byType.get(allocation.type) || { count: 0, totalSize: 0 };
      current.count++;
      current.totalSize += allocation.size;
      byType.set(allocation.type, current);
    }
    
    return Array.from(byType.entries())
      .map(([type, stats]) => ({ type, ...stats }))
      .sort((a, b) => b.totalSize - a.totalSize);
  }
}
```

### Memory Usage Monitoring

```javascript
class MemoryMonitor {
  constructor(interval = 1000) {
    this.interval = interval;
    this.samples = [];
    this.monitoring = false;
  }

  start() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.timerId = setInterval(() => {
      if (performance.memory) {
        this.samples.push({
          timestamp: Date.now(),
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
        
        // Keep last 1000 samples
        if (this.samples.length > 1000) {
          this.samples.shift();
        }
      }
    }, this.interval);
  }

  stop() {
    if (!this.monitoring) return;
    
    this.monitoring = false;
    clearInterval(this.timerId);
  }

  getStats() {
    if (this.samples.length === 0) return null;
    
    const used = this.samples.map(s => s.usedJSHeapSize);
    const total = this.samples.map(s => s.totalJSHeapSize);
    
    return {
      current: this.samples[this.samples.length - 1],
      average: {
        used: used.reduce((a, b) => a + b) / used.length,
        total: total.reduce((a, b) => a + b) / total.length
      },
      peak: {
        used: Math.max(...used),
        total: Math.max(...total)
      },
      trend: this.calculateTrend(used)
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const recent = values.slice(-10);
    const older = values.slice(-20, -10);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    return recentAvg - olderAvg;
  }

  detectLeak() {
    const stats = this.getStats();
    if (!stats) return false;
    
    // Simple heuristic: memory growing consistently
    return stats.trend > 1000000; // 1MB growth
  }
}
```

## Optimization Techniques

### Object Pooling

```javascript
class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];
    
    // Pre-allocate objects
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.factory();
  }

  release(object) {
    this.reset(object);
    this.pool.push(object);
  }

  clear() {
    this.pool = [];
  }
}

// Usage
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0, z: 0 }),
  (v) => { v.x = 0; v.y = 0; v.z = 0; }
);

function calculate() {
  const v1 = vectorPool.acquire();
  const v2 = vectorPool.acquire();
  
  v1.x = 10;
  v1.y = 20;
  v2.x = 5;
  v2.y = 15;
  
  const result = { x: v1.x + v2.x, y: v1.y + v2.y };
  
  vectorPool.release(v1);
  vectorPool.release(v2);
  
  return result;
}
```

### Lazy Initialization

```javascript
class LazyValue {
  constructor(initializer) {
    this.initializer = initializer;
    this.initialized = false;
    this.value = undefined;
  }

  get() {
    if (!this.initialized) {
      this.value = this.initializer();
      this.initialized = true;
      this.initializer = null; // Allow GC
    }
    return this.value;
  }

  reset() {
    this.initialized = false;
    this.value = undefined;
  }
}

// Usage
const expensiveData = new LazyValue(() => {
  console.log('Computing expensive data...');
  return new Array(1000000).fill(0).map((_, i) => i * i);
});

// Data not computed yet
console.log('Before access');

// Data computed on first access
const data = expensiveData.get();

// Subsequent accesses use cached value
const data2 = expensiveData.get();
```

### String Interning

```javascript
class StringInterner {
  constructor() {
    this.pool = new Map();
  }

  intern(string) {
    if (this.pool.has(string)) {
      return this.pool.get(string);
    }
    
    this.pool.set(string, string);
    return string;
  }

  clear() {
    this.pool.clear();
  }

  size() {
    return this.pool.size;
  }
}

// Usage
const interner = new StringInterner();

// These will reference the same string object
const s1 = interner.intern('hello');
const s2 = interner.intern('hello');
const s3 = interner.intern('hello');

console.log(s1 === s2 === s3); // true
```

## WeakMap and WeakSet

### WeakMap Usage

```javascript
// Private data using WeakMap
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    privateData.set(this, { password });
  }

  checkPassword(password) {
    return privateData.get(this).password === password;
  }
}

// When user instance is GC'd, private data is too
let user = new User('Alice', 'secret123');
console.log(user.checkPassword('secret123')); // true
user = null; // privateData entry can be GC'd
```

### WeakSet Usage

```javascript
// Track object membership without preventing GC
const processedObjects = new WeakSet();

function processObject(obj) {
  if (processedObjects.has(obj)) {
    console.log('Already processed');
    return;
  }
  
  // Process object
  console.log('Processing', obj);
  processedObjects.add(obj);
}

// Usage
let obj = { data: 'test' };
processObject(obj); // Processing
processObject(obj); // Already processed
obj = null; // Entry in WeakSet can be GC'd
```

### WeakRef and FinalizationRegistry

```javascript
// WeakRef: Hold weak reference to object
class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return undefined;
    
    const value = ref.deref();
    if (value === undefined) {
      // Object was GC'd
      this.cache.delete(key);
    }
    return value;
  }
}

// FinalizationRegistry: Run cleanup when object is GC'd
const registry = new FinalizationRegistry((heldValue) => {
  console.log('Object was garbage collected:', heldValue);
});

class Resource {
  constructor(name) {
    this.name = name;
    registry.register(this, name);
  }
}

let resource = new Resource('MyResource');
resource = null; // Eventually logs: "Object was garbage collected: MyResource"
```

## Summary

Effective memory management in JavaScript requires understanding garbage collection, identifying and preventing memory leaks, and applying optimization techniques like object pooling and lazy initialization. Use profiling tools to monitor memory usage and WeakMap/WeakSet for memory-efficient data structures.
