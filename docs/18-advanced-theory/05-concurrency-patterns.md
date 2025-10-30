# Concurrency Patterns in JavaScript

## Table of Contents
- [Concurrency Fundamentals](#concurrency-fundamentals)
- [Promise Patterns](#promise-patterns)
- [Async Iterators](#async-iterators)
- [Worker Threads](#worker-threads)
- [Shared Memory](#shared-memory)
- [Lock-Free Algorithms](#lock-free-algorithms)
- [Actor Model](#actor-model)
- [CSP (Communicating Sequential Processes)](#csp)

## Concurrency Fundamentals

### Concurrency vs Parallelism

**Definitions**:
```
Concurrency: Multiple tasks making progress (interleaved)
Parallelism: Multiple tasks executing simultaneously (parallel)

JavaScript:
- Single-threaded event loop (concurrent)
- Web Workers for parallelism
- SharedArrayBuffer for shared memory
```

**Event Loop Model**:
```javascript
// Event loop phases
const eventLoop = {
  phases: [
    'timers',           // setTimeout, setInterval
    'pending callbacks', // I/O callbacks
    'idle, prepare',    // Internal use
    'poll',             // Retrieve new I/O events
    'check',            // setImmediate
    'close callbacks'   // socket.on('close')
  ]
};

// Microtask queue (higher priority)
const microtasks = [
  'Promise callbacks',
  'queueMicrotask',
  'MutationObserver',
  'process.nextTick' // Node.js only
];
```

### Concurrency Primitives

**Semaphore**:
```javascript
class Semaphore {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.count < this.max) {
      this.count++;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release() {
    this.count--;
    
    if (this.queue.length > 0) {
      this.count++;
      const resolve = this.queue.shift();
      resolve();
    }
  }

  async use(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

// Usage
const semaphore = new Semaphore(3);

async function limitedConcurrency(id) {
  await semaphore.acquire();
  try {
    console.log(`Task ${id} running`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Task ${id} done`);
  } finally {
    semaphore.release();
  }
}

// Run 10 tasks with max 3 concurrent
Promise.all(
  Array.from({ length: 10 }, (_, i) => limitedConcurrency(i))
);
```

**Mutex (Mutual Exclusion)**:
```javascript
class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  async lock() {
    if (!this.locked) {
      this.locked = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  unlock() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }

  async runExclusive(fn) {
    await this.lock();
    try {
      return await fn();
    } finally {
      this.unlock();
    }
  }
}

// Usage
const mutex = new Mutex();
let sharedResource = 0;

async function incrementShared() {
  await mutex.runExclusive(async () => {
    const temp = sharedResource;
    await new Promise(resolve => setTimeout(resolve, 10));
    sharedResource = temp + 1;
  });
}

// Safe concurrent increments
await Promise.all([
  incrementShared(),
  incrementShared(),
  incrementShared()
]);
console.log(sharedResource); // 3
```

**Barrier**:
```javascript
class Barrier {
  constructor(count) {
    this.count = count;
    this.waiting = 0;
    this.promise = null;
    this.resolve = null;
  }

  async wait() {
    this.waiting++;

    if (this.waiting === this.count) {
      // Last one to arrive
      this.waiting = 0;
      if (this.resolve) {
        this.resolve();
      }
      this.promise = null;
      this.resolve = null;
      return Promise.resolve();
    }

    if (!this.promise) {
      this.promise = new Promise(resolve => {
        this.resolve = resolve;
      });
    }

    return this.promise;
  }
}

// Usage
const barrier = new Barrier(3);

async function worker(id) {
  console.log(`Worker ${id} phase 1`);
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  
  await barrier.wait(); // Synchronization point
  
  console.log(`Worker ${id} phase 2`);
}

Promise.all([worker(1), worker(2), worker(3)]);
```

## Promise Patterns

### Promise Pool

**Concurrent Execution with Limit**:
```javascript
class PromisePool {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(fn) {
    while (this.running >= this.concurrency) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }

  async all(tasks) {
    return Promise.all(tasks.map(task => this.add(task)));
  }

  async map(items, fn) {
    return this.all(items.map(item => () => fn(item)));
  }
}

// Usage
const pool = new PromisePool(3);

const urls = Array.from({ length: 10 }, (_, i) => `url-${i}`);

const results = await pool.map(urls, async url => {
  const response = await fetch(url);
  return response.json();
});
```

### Promise Retry

**Retry with Exponential Backoff**:
```javascript
async function retry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        onRetry(error, attempt, waitTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

// Usage
const result = await retry(
  () => fetch('https://api.example.com/data'),
  {
    retries: 5,
    delay: 1000,
    backoff: 2,
    onRetry: (error, attempt, delay) => {
      console.log(`Retry ${attempt + 1} after ${delay}ms`);
    }
  }
);
```

### Promise Timeout

**Add Timeout to Promise**:
```javascript
function timeout(promise, ms, message = 'Operation timed out') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    })
  ]);
}

// With cleanup
function timeoutWithCleanup(promise, ms, cleanup) {
  let timeoutId;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (cleanup) cleanup();
      reject(new Error('Operation timed out'));
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise
  ]);
}

// Usage
try {
  const result = await timeout(
    fetch('https://api.example.com/slow'),
    5000
  );
} catch (error) {
  console.error('Request timed out');
}
```

### Promise Debounce

**Debounce Async Operations**:
```javascript
function debounceAsync(fn, delay) {
  let timeoutId;
  let latestResolve;
  let latestReject;

  return function(...args) {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn.apply(this, args);
          latestResolve(result);
        } catch (error) {
          latestReject(error);
        }
      }, delay);
    });
  };
}

// Usage
const debouncedSearch = debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);

// Multiple calls, only last one executes
debouncedSearch('a');
debouncedSearch('ab');
const results = await debouncedSearch('abc'); // Only this executes
```

### Promise Throttle

**Throttle Async Operations**:
```javascript
function throttleAsync(fn, delay) {
  let lastCall = 0;
  let timeoutId;
  let pendingPromise = null;

  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    pendingPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        lastCall = Date.now();
        pendingPromise = null;
        
        try {
          const result = await fn.apply(this, args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay - timeSinceLastCall);
    });

    return pendingPromise;
  };
}

// Usage
const throttledUpdate = throttleAsync(async (data) => {
  await fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}, 1000);
```

## Async Iterators

### Async Iterator Implementation

```javascript
class AsyncRange {
  constructor(start, end, delay = 100) {
    this.start = start;
    this.end = end;
    this.delay = delay;
  }

  async *[Symbol.asyncIterator]() {
    for (let i = this.start; i <= this.end; i++) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
      yield i;
    }
  }
}

// Usage
for await (const num of new AsyncRange(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5 (with delays)
}
```

### Async Iterator Utilities

```javascript
class AsyncIteratorUtils {
  static async *map(iterable, fn) {
    for await (const item of iterable) {
      yield await fn(item);
    }
  }

  static async *filter(iterable, predicate) {
    for await (const item of iterable) {
      if (await predicate(item)) {
        yield item;
      }
    }
  }

  static async *take(iterable, n) {
    let count = 0;
    for await (const item of iterable) {
      if (count >= n) break;
      yield item;
      count++;
    }
  }

  static async *skip(iterable, n) {
    let count = 0;
    for await (const item of iterable) {
      if (count >= n) {
        yield item;
      }
      count++;
    }
  }

  static async *concat(...iterables) {
    for (const iterable of iterables) {
      for await (const item of iterable) {
        yield item;
      }
    }
  }

  static async *zip(...iterables) {
    const iterators = iterables.map(it => it[Symbol.asyncIterator]());
    
    while (true) {
      const results = await Promise.all(
        iterators.map(it => it.next())
      );
      
      if (results.some(r => r.done)) break;
      
      yield results.map(r => r.value);
    }
  }

  static async reduce(iterable, reducer, initial) {
    let accumulator = initial;
    
    for await (const item of iterable) {
      accumulator = await reducer(accumulator, item);
    }
    
    return accumulator;
  }

  static async toArray(iterable) {
    const result = [];
    for await (const item of iterable) {
      result.push(item);
    }
    return result;
  }
}

// Usage
const range = new AsyncRange(1, 10);

const doubled = AsyncIteratorUtils.map(range, x => x * 2);
const evens = AsyncIteratorUtils.filter(doubled, x => x % 4 === 0);
const first3 = AsyncIteratorUtils.take(evens, 3);

const result = await AsyncIteratorUtils.toArray(first3);
console.log(result); // [4, 8, 12]
```

### Async Generator Pipeline

```javascript
class AsyncPipeline {
  constructor(source) {
    this.source = source;
  }

  map(fn) {
    const source = this.source;
    return new AsyncPipeline(async function*() {
      for await (const item of source) {
        yield await fn(item);
      }
    }());
  }

  filter(predicate) {
    const source = this.source;
    return new AsyncPipeline(async function*() {
      for await (const item of source) {
        if (await predicate(item)) {
          yield item;
        }
      }
    }());
  }

  take(n) {
    const source = this.source;
    return new AsyncPipeline(async function*() {
      let count = 0;
      for await (const item of source) {
        if (count >= n) break;
        yield item;
        count++;
      }
    }());
  }

  flatMap(fn) {
    const source = this.source;
    return new AsyncPipeline(async function*() {
      for await (const item of source) {
        const result = await fn(item);
        for await (const subItem of result) {
          yield subItem;
        }
      }
    }());
  }

  async reduce(reducer, initial) {
    let accumulator = initial;
    for await (const item of this.source) {
      accumulator = await reducer(accumulator, item);
    }
    return accumulator;
  }

  async toArray() {
    const result = [];
    for await (const item of this.source) {
      result.push(item);
    }
    return result;
  }

  async forEach(fn) {
    for await (const item of this.source) {
      await fn(item);
    }
  }

  [Symbol.asyncIterator]() {
    return this.source[Symbol.asyncIterator]();
  }
}

// Usage
const pipeline = new AsyncPipeline(new AsyncRange(1, 20))
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(5);

const result = await pipeline.toArray();
console.log(result); // [4, 16, 36, 64, 100]
```

## Worker Threads

### Web Worker Wrapper

```javascript
class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
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
      worker.onerror = (e) => this.handleError(i, e);
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

  handleError(workerIndex, error) {
    const workerInfo = this.workers[workerIndex];
    
    for (const [taskId, task] of workerInfo.tasks) {
      task.reject(error);
    }
    
    workerInfo.tasks.clear();
    workerInfo.busy = false;
    
    // Restart worker
    workerInfo.worker.terminate();
    workerInfo.worker = new Worker(this.workerScript);
    workerInfo.worker.onmessage = (e) => this.handleMessage(workerIndex, e);
    workerInfo.worker.onerror = (e) => this.handleError(workerIndex, e);
    
    this.processQueue();
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
    for (const workerInfo of this.workers) {
      workerInfo.worker.terminate();
    }
    this.workers = [];
    this.queue = [];
  }
}

// Worker script (worker.js)
/*
self.onmessage = async function(e) {
  const { taskId, data } = e.data;
  
  try {
    // Perform heavy computation
    const result = await heavyComputation(data);
    
    self.postMessage({ taskId, result });
  } catch (error) {
    self.postMessage({ taskId, error: error.message });
  }
};

async function heavyComputation(data) {
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

const tasks = Array.from({ length: 10 }, (_, i) => ({
  iterations: 1000000 * (i + 1)
}));

const results = await Promise.all(
  tasks.map(task => pool.execute(task))
);

pool.terminate();
```

### Transferable Objects

```javascript
class TransferableWorker {
  constructor(workerScript) {
    this.worker = new Worker(workerScript);
    this.taskId = 0;
    this.tasks = new Map();
    
    this.worker.onmessage = (e) => {
      const { taskId, result, error } = e.data;
      const task = this.tasks.get(taskId);
      
      if (task) {
        this.tasks.delete(taskId);
        
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(result);
        }
      }
    };
  }

  async execute(data, transferables = []) {
    return new Promise((resolve, reject) => {
      const taskId = this.taskId++;
      
      this.tasks.set(taskId, { resolve, reject });
      
      this.worker.postMessage(
        { taskId, data },
        transferables
      );
    });
  }

  terminate() {
    this.worker.terminate();
  }
}

// Usage with ArrayBuffer
const worker = new TransferableWorker('image-processor.js');

const imageData = new Uint8Array(1920 * 1080 * 4);
// ... fill imageData

// Transfer ownership to worker (zero-copy)
const result = await worker.execute(
  { imageData: imageData.buffer },
  [imageData.buffer]
);

// imageData.buffer is now detached (length = 0)
console.log(imageData.buffer.byteLength); // 0
```

## Shared Memory

### SharedArrayBuffer and Atomics

```javascript
// Main thread
class SharedCounter {
  constructor() {
    this.buffer = new SharedArrayBuffer(4);
    this.view = new Int32Array(this.buffer);
  }

  increment() {
    return Atomics.add(this.view, 0, 1);
  }

  decrement() {
    return Atomics.sub(this.view, 0, 1);
  }

  get value() {
    return Atomics.load(this.view, 0);
  }

  set value(val) {
    Atomics.store(this.view, 0, val);
  }

  compareExchange(expected, replacement) {
    return Atomics.compareExchange(this.view, 0, expected, replacement);
  }

  wait(value, timeout) {
    return Atomics.wait(this.view, 0, value, timeout);
  }

  notify(count = 1) {
    return Atomics.notify(this.view, 0, count);
  }

  getBuffer() {
    return this.buffer;
  }
}

// Usage
const counter = new SharedCounter();

const worker1 = new Worker('counter-worker.js');
const worker2 = new Worker('counter-worker.js');

worker1.postMessage({ buffer: counter.getBuffer() });
worker2.postMessage({ buffer: counter.getBuffer() });

// Workers increment concurrently
setTimeout(() => {
  console.log('Final count:', counter.value);
}, 1000);
```

### Lock-Free Queue

```javascript
class LockFreeQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.buffer = new SharedArrayBuffer((capacity + 2) * 4);
    this.view = new Int32Array(this.buffer);
    
    // view[0] = head index
    // view[1] = tail index
    // view[2..capacity+1] = data
    
    Atomics.store(this.view, 0, 0); // head
    Atomics.store(this.view, 1, 0); // tail
  }

  enqueue(value) {
    while (true) {
      const tail = Atomics.load(this.view, 1);
      const head = Atomics.load(this.view, 0);
      const next = (tail + 1) % this.capacity;
      
      if (next === head) {
        return false; // Queue full
      }
      
      if (Atomics.compareExchange(this.view, 1, tail, next) === tail) {
        Atomics.store(this.view, tail + 2, value);
        return true;
      }
    }
  }

  dequeue() {
    while (true) {
      const head = Atomics.load(this.view, 0);
      const tail = Atomics.load(this.view, 1);
      
      if (head === tail) {
        return null; // Queue empty
      }
      
      const value = Atomics.load(this.view, head + 2);
      const next = (head + 1) % this.capacity;
      
      if (Atomics.compareExchange(this.view, 0, head, next) === head) {
        return value;
      }
    }
  }

  get size() {
    const head = Atomics.load(this.view, 0);
    const tail = Atomics.load(this.view, 1);
    return (tail - head + this.capacity) % this.capacity;
  }

  getBuffer() {
    return this.buffer;
  }
}
```

I'll continue with more content:

<function_calls>
<invoke name="fsAppend">
<parameter name="path">docs/18-advanced-theory/05-concurrency-patterns.md

## Loc
k-Free Algorithms

### Lock-Free Stack

```javascript
class LockFreeStack {
  constructor() {
    this.buffer = new SharedArrayBuffer(1000 * 8); // 1000 slots
    this.view = new BigInt64Array(this.buffer);
    
    // view[0] = top index (high 32 bits) + version (low 32 bits)
    // view[1..999] = data
    
    Atomics.store(this.view, 0, 0n);
  }

  push(value) {
    while (true) {
      const topAndVersion = Atomics.load(this.view, 0);
      const top = Number(topAndVersion >> 32n);
      const version = Number(topAndVersion & 0xFFFFFFFFn);
      
      if (top >= 999) {
        return false; // Stack full
      }
      
      const newTop = top + 1;
      const newVersion = version + 1;
      const newTopAndVersion = (BigInt(newTop) << 32n) | BigInt(newVersion);
      
      if (Atomics.compareExchange(this.view, 0, topAndVersion, newTopAndVersion) === topAndVersion) {
        Atomics.store(this.view, newTop, BigInt(value));
        return true;
      }
    }
  }

  pop() {
    while (true) {
      const topAndVersion = Atomics.load(this.view, 0);
      const top = Number(topAndVersion >> 32n);
      const version = Number(topAndVersion & 0xFFFFFFFFn);
      
      if (top === 0) {
        return null; // Stack empty
      }
      
      const value = Number(Atomics.load(this.view, top));
      const newTop = top - 1;
      const newVersion = version + 1;
      const newTopAndVersion = (BigInt(newTop) << 32n) | BigInt(newVersion);
      
      if (Atomics.compareExchange(this.view, 0, topAndVersion, newTopAndVersion) === topAndVersion) {
        return value;
      }
    }
  }

  get size() {
    const topAndVersion = Atomics.load(this.view, 0);
    return Number(topAndVersion >> 32n);
  }

  getBuffer() {
    return this.buffer;
  }
}
```

### Compare-And-Swap Loop

```javascript
class CASCounter {
  constructor() {
    this.buffer = new SharedArrayBuffer(4);
    this.view = new Int32Array(this.buffer);
  }

  increment() {
    while (true) {
      const current = Atomics.load(this.view, 0);
      const next = current + 1;
      
      if (Atomics.compareExchange(this.view, 0, current, next) === current) {
        return next;
      }
      // CAS failed, retry
    }
  }

  add(value) {
    while (true) {
      const current = Atomics.load(this.view, 0);
      const next = current + value;
      
      if (Atomics.compareExchange(this.view, 0, current, next) === current) {
        return next;
      }
    }
  }

  getAndSet(value) {
    while (true) {
      const current = Atomics.load(this.view, 0);
      
      if (Atomics.compareExchange(this.view, 0, current, value) === current) {
        return current;
      }
    }
  }
}
```

## Actor Model

### Actor Implementation

```javascript
class Actor {
  constructor(behavior) {
    this.behavior = behavior;
    this.mailbox = [];
    this.processing = false;
    this.state = {};
  }

  send(message) {
    this.mailbox.push(message);
    this.process();
  }

  async process() {
    if (this.processing || this.mailbox.length === 0) {
      return;
    }

    this.processing = true;

    while (this.mailbox.length > 0) {
      const message = this.mailbox.shift();
      
      try {
        const newBehavior = await this.behavior(this.state, message);
        
        if (newBehavior) {
          this.behavior = newBehavior;
        }
      } catch (error) {
        console.error('Actor error:', error);
      }
    }

    this.processing = false;
  }

  become(newBehavior) {
    this.behavior = newBehavior;
  }
}

class ActorSystem {
  constructor() {
    this.actors = new Map();
  }

  spawn(name, behavior) {
    const actor = new Actor(behavior);
    this.actors.set(name, actor);
    return actor;
  }

  send(name, message) {
    const actor = this.actors.get(name);
    if (actor) {
      actor.send(message);
    }
  }

  kill(name) {
    this.actors.delete(name);
  }
}

// Usage
const system = new ActorSystem();

// Counter actor
const counter = system.spawn('counter', (state, message) => {
  if (!state.count) state.count = 0;
  
  switch (message.type) {
    case 'increment':
      state.count++;
      console.log('Count:', state.count);
      break;
    
    case 'decrement':
      state.count--;
      console.log('Count:', state.count);
      break;
    
    case 'get':
      message.reply(state.count);
      break;
  }
});

counter.send({ type: 'increment' });
counter.send({ type: 'increment' });
counter.send({ type: 'get', reply: (count) => console.log('Current:', count) });
```

### Supervisor Pattern

```javascript
class SupervisedActor extends Actor {
  constructor(behavior, supervisor) {
    super(behavior);
    this.supervisor = supervisor;
    this.restartCount = 0;
    this.maxRestarts = 3;
  }

  async process() {
    if (this.processing || this.mailbox.length === 0) {
      return;
    }

    this.processing = true;

    while (this.mailbox.length > 0) {
      const message = this.mailbox.shift();
      
      try {
        const newBehavior = await this.behavior(this.state, message);
        
        if (newBehavior) {
          this.behavior = newBehavior;
        }
        
        this.restartCount = 0; // Reset on success
      } catch (error) {
        console.error('Actor error:', error);
        
        if (this.supervisor) {
          this.supervisor.handleFailure(this, error);
        }
      }
    }

    this.processing = false;
  }

  restart() {
    this.restartCount++;
    
    if (this.restartCount > this.maxRestarts) {
      console.error('Max restarts exceeded, stopping actor');
      return false;
    }
    
    this.state = {};
    this.mailbox = [];
    this.processing = false;
    return true;
  }
}

class Supervisor {
  constructor(strategy = 'one-for-one') {
    this.strategy = strategy;
    this.children = new Map();
  }

  supervise(name, actor) {
    this.children.set(name, actor);
  }

  handleFailure(actor, error) {
    console.log('Handling failure:', error.message);
    
    switch (this.strategy) {
      case 'one-for-one':
        // Restart only failed actor
        if (!actor.restart()) {
          this.removeChild(actor);
        }
        break;
      
      case 'one-for-all':
        // Restart all actors
        for (const child of this.children.values()) {
          if (!child.restart()) {
            this.removeChild(child);
          }
        }
        break;
      
      case 'rest-for-one':
        // Restart failed actor and all started after it
        let found = false;
        for (const child of this.children.values()) {
          if (child === actor) found = true;
          if (found && !child.restart()) {
            this.removeChild(child);
          }
        }
        break;
    }
  }

  removeChild(actor) {
    for (const [name, child] of this.children) {
      if (child === actor) {
        this.children.delete(name);
        break;
      }
    }
  }
}
```

## CSP (Communicating Sequential Processes)

### Channel Implementation

```javascript
class Channel {
  constructor(bufferSize = 0) {
    this.bufferSize = bufferSize;
    this.buffer = [];
    this.senders = [];
    this.receivers = [];
    this.closed = false;
  }

  async send(value) {
    if (this.closed) {
      throw new Error('Cannot send on closed channel');
    }

    // If there's a waiting receiver, send directly
    if (this.receivers.length > 0) {
      const receiver = this.receivers.shift();
      receiver.resolve(value);
      return;
    }

    // If buffer has space, add to buffer
    if (this.buffer.length < this.bufferSize) {
      this.buffer.push(value);
      return;
    }

    // Otherwise, wait for receiver
    return new Promise((resolve, reject) => {
      this.senders.push({ value, resolve, reject });
    });
  }

  async receive() {
    if (this.closed && this.buffer.length === 0) {
      return { value: undefined, done: true };
    }

    // If buffer has values, return from buffer
    if (this.buffer.length > 0) {
      const value = this.buffer.shift();
      
      // If there's a waiting sender, move to buffer
      if (this.senders.length > 0) {
        const sender = this.senders.shift();
        this.buffer.push(sender.value);
        sender.resolve();
      }
      
      return { value, done: false };
    }

    // If there's a waiting sender, receive directly
    if (this.senders.length > 0) {
      const sender = this.senders.shift();
      sender.resolve();
      return { value: sender.value, done: false };
    }

    // Otherwise, wait for sender
    return new Promise((resolve) => {
      this.receivers.push({
        resolve: (value) => resolve({ value, done: false })
      });
    });
  }

  close() {
    this.closed = true;
    
    // Reject all waiting senders
    for (const sender of this.senders) {
      sender.reject(new Error('Channel closed'));
    }
    this.senders = [];
    
    // Resolve all waiting receivers with done
    for (const receiver of this.receivers) {
      receiver.resolve({ value: undefined, done: true });
    }
    this.receivers = [];
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      const { value, done } = await this.receive();
      if (done) break;
      yield value;
    }
  }
}

// Usage
const channel = new Channel(2);

// Producer
async function producer() {
  for (let i = 0; i < 10; i++) {
    await channel.send(i);
    console.log('Sent:', i);
  }
  channel.close();
}

// Consumer
async function consumer() {
  for await (const value of channel) {
    console.log('Received:', value);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

Promise.all([producer(), consumer()]);
```

### Select Pattern

```javascript
class Select {
  static async select(...cases) {
    return new Promise((resolve) => {
      let resolved = false;
      const cleanup = [];

      for (const [index, caseItem] of cases.entries()) {
        if (caseItem.type === 'send') {
          const promise = caseItem.channel.send(caseItem.value);
          
          promise.then(() => {
            if (!resolved) {
              resolved = true;
              cleanup.forEach(fn => fn());
              resolve({ index, type: 'send' });
            }
          });
          
          cleanup.push(() => {
            // Cancel send if possible
          });
        } else if (caseItem.type === 'receive') {
          const promise = caseItem.channel.receive();
          
          promise.then(({ value, done }) => {
            if (!resolved) {
              resolved = true;
              cleanup.forEach(fn => fn());
              resolve({ index, type: 'receive', value, done });
            }
          });
          
          cleanup.push(() => {
            // Cancel receive if possible
          });
        } else if (caseItem.type === 'default') {
          if (!resolved) {
            resolved = true;
            cleanup.forEach(fn => fn());
            resolve({ index, type: 'default' });
          }
        }
      }
    });
  }
}

// Usage
const ch1 = new Channel();
const ch2 = new Channel();

async function selectExample() {
  const result = await Select.select(
    { type: 'receive', channel: ch1 },
    { type: 'receive', channel: ch2 },
    { type: 'default' }
  );

  switch (result.index) {
    case 0:
      console.log('Received from ch1:', result.value);
      break;
    case 1:
      console.log('Received from ch2:', result.value);
      break;
    case 2:
      console.log('No channel ready');
      break;
  }
}
```

### Pipeline Pattern

```javascript
async function pipeline(...stages) {
  const channels = stages.map(() => new Channel(10));
  
  // Start all stages
  const workers = stages.map((stage, i) => {
    const input = i === 0 ? null : channels[i - 1];
    const output = channels[i];
    
    return async () => {
      if (input) {
        for await (const value of input) {
          const result = await stage(value);
          if (result !== undefined) {
            await output.send(result);
          }
        }
      } else {
        // First stage generates values
        await stage(output);
      }
      output.close();
    };
  });

  // Run all workers
  await Promise.all(workers.map(w => w()));
  
  return channels[channels.length - 1];
}

// Usage
const result = await pipeline(
  // Stage 1: Generate numbers
  async (output) => {
    for (let i = 1; i <= 10; i++) {
      await output.send(i);
    }
  },
  
  // Stage 2: Square numbers
  async (value) => {
    return value * value;
  },
  
  // Stage 3: Filter even numbers
  async (value) => {
    return value % 2 === 0 ? value : undefined;
  }
);

// Consume results
for await (const value of result) {
  console.log(value); // 4, 16, 36, 64, 100
}
```

### Fan-Out/Fan-In Pattern

```javascript
async function fanOut(input, workers) {
  const outputs = workers.map(() => new Channel(10));
  
  // Distribute work
  (async () => {
    let index = 0;
    for await (const value of input) {
      await outputs[index % workers.length].send(value);
      index++;
    }
    outputs.forEach(ch => ch.close());
  })();
  
  return outputs;
}

async function fanIn(...inputs) {
  const output = new Channel(10);
  let activeInputs = inputs.length;
  
  for (const input of inputs) {
    (async () => {
      for await (const value of input) {
        await output.send(value);
      }
      activeInputs--;
      if (activeInputs === 0) {
        output.close();
      }
    })();
  }
  
  return output;
}

// Usage
const input = new Channel(10);

// Generate work
(async () => {
  for (let i = 1; i <= 100; i++) {
    await input.send(i);
  }
  input.close();
})();

// Fan out to 4 workers
const workerChannels = await fanOut(input, [
  async (value) => value * 2,
  async (value) => value * 2,
  async (value) => value * 2,
  async (value) => value * 2
]);

// Process in parallel
const processedChannels = workerChannels.map(ch => {
  const output = new Channel(10);
  (async () => {
    for await (const value of ch) {
      await output.send(value * value);
    }
    output.close();
  })();
  return output;
});

// Fan in results
const results = await fanIn(...processedChannels);

// Collect results
const allResults = [];
for await (const value of results) {
  allResults.push(value);
}

console.log('Processed', allResults.length, 'items');
```

## Advanced Patterns

### Rate Limiter

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return Promise.resolve();
    }
    
    // Wait until oldest request expires
    const oldestRequest = this.requests[0];
    const waitTime = this.timeWindow - (now - oldestRequest);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    return this.acquire();
  }

  async execute(fn) {
    await this.acquire();
    return fn();
  }
}

// Token bucket rate limiter
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
    this.queue = [];
  }

  refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / 1000) * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async acquire(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return Promise.resolve();
    }
    
    return new Promise(resolve => {
      this.queue.push({ tokens, resolve });
      this.processQueue();
    });
  }

  processQueue() {
    if (this.queue.length === 0) return;
    
    this.refill();
    
    while (this.queue.length > 0 && this.tokens >= this.queue[0].tokens) {
      const { tokens, resolve } = this.queue.shift();
      this.tokens -= tokens;
      resolve();
    }
    
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }
}

// Usage
const limiter = new TokenBucket(10, 2); // 10 tokens, refill 2/sec

async function makeRequest(id) {
  await limiter.acquire();
  console.log(`Request ${id} executing`);
  // Make actual request
}

// Burst of 20 requests
Promise.all(
  Array.from({ length: 20 }, (_, i) => makeRequest(i))
);
```

### Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 2;
    this.timeout = options.timeout || 60000;
    this.resetTimeout = options.resetTimeout || 30000;
    
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      
      this.state = 'HALF_OPEN';
      this.successes = 0;
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.timeout)
        )
      ]);
      
      return this.onSuccess(result);
    } catch (error) {
      return this.onFailure(error);
    }
  }

  onSuccess(result) {
    this.failures = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successes++;
      
      if (this.successes >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successes = 0;
      }
    }
    
    return result;
  }

  onFailure(error) {
    this.failures++;
    
    if (this.state === 'HALF_OPEN' || 
        this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
    
    throw error;
  }

  getState() {
    return this.state;
  }

  reset() {
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
  }
}

// Usage
const breaker = new CircuitBreaker({
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 5000,
  resetTimeout: 10000
});

async function unreliableService() {
  return breaker.execute(async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
  });
}
```

## Summary

Concurrency patterns in JavaScript enable efficient handling of asynchronous operations:
- **Primitives**: Semaphores, mutexes, barriers for coordination
- **Promise Patterns**: Pooling, retry, timeout, debounce, throttle
- **Async Iterators**: Lazy evaluation and streaming data
- **Worker Threads**: True parallelism for CPU-intensive tasks
- **Shared Memory**: Lock-free algorithms with Atomics
- **Actor Model**: Message-passing concurrency
- **CSP**: Channel-based communication
- **Advanced Patterns**: Rate limiting, circuit breakers

These patterns are essential for building scalable, responsive applications that handle concurrent operations efficiently.
