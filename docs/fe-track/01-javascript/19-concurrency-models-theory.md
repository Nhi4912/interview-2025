# JavaScript Concurrency Models - Theory / Mô Hình Đồng Thời JavaScript - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Shopee product search:** User types in search box → main thread runs debounced search + renders autocomplete. Suddenly background task: processing 100,000 product entries for local filtering — locks the main thread for 2 seconds. UI freezes. Fix: offload filtering to a Web Worker. Worker receives the dataset, processes it on a separate thread, posts results back. Main thread stays responsive. Users see smooth autocomplete while background processing runs in parallel.

**Bài học:** JavaScript's single-threaded model is not a limitation for most apps. But compute-heavy tasks must be moved to Web Workers to avoid blocking the UI. Web Workers + SharedArrayBuffer enable true parallelism in JavaScript — understanding when and how to use them is a Senior-level skill.

## What & Why / Cái Gì & Tại Sao

**Scope:** Event Loop and async/await basics → xem [06-event-loop-async.md](./06-event-loop-async.md) and [09-async-comprehensive.md](./09-async-comprehensive.md) (both ✅). This file focuses on **Web Workers** (true parallelism), **SharedArrayBuffer + Atomics** (shared memory coordination), and **Async Iterators** (streaming data protocol).

**Analogy:** Web Workers là separate kitchen staff — họ làm việc song song với bếp chính (main thread). Communication qua `postMessage` như đặt đơn qua cửa sổ. SharedArrayBuffer là shared cutting board cả hai kitchen có thể dùng — Atomics là the lock preventing two chefs from cutting at the same time.

## Concept Map / Bản Đồ Khái Niệm

```
[JavaScript Concurrency]
        │
        ├── Single-threaded: Event Loop handles concurrency via microtasks + macrotasks
        │       (see 06-event-loop-async.md for deep dive)
        │
        ├── Web Workers — true parallelism (separate thread)
        │       ├── Dedicated Worker: one-to-one with page
        │       ├── Shared Worker: shared across tabs (same origin)
        │       ├── Service Worker: intercept network requests, offline caching
        │       ├── Communication: postMessage() / onmessage (structured clone)
        │       └── No DOM access in workers
        │
        ├── SharedArrayBuffer + Atomics — shared memory across threads
        │       ├── SharedArrayBuffer: raw memory shared between main thread and workers
        │       ├── Atomics.load/store: thread-safe reads/writes
        │       ├── Atomics.compareExchange: CAS (compare-and-swap)
        │       ├── Atomics.wait/notify: synchronization primitive
        │       └── Requires COOP/COEP headers (Spectre mitigation)
        │
        └── Async Iterators — streaming protocol
                Symbol.asyncIterator → [Symbol.asyncIterator]() returns async iterator
                for await...of: calls .next(), awaits Promise<{value, done}>
                Async generators: async function* — suspend with yield, async with await
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Web Workers — True Parallelism

**🧠 Memory Hook:** "**Web Worker = separate JS thread. postMessage = the only door. No DOM. No shared state by default.**"

**Why does this exist? / Tại sao tồn tại?**

- Why can't the main thread do heavy computation? Because the main thread handles rendering, user events, and JavaScript execution. A heavy computation blocks the rendering loop — users see frozen UI
- Why is `postMessage` the only communication channel? Because sharing memory between threads is dangerous (race conditions, data corruption). Structured Clone — the algorithm behind `postMessage` — serializes data to prevent sharing mutable references. (SharedArrayBuffer is the opt-in exception with explicit synchronization)
- Why are there 3 types of workers? Different use cases: Dedicated (private to one page), Shared (accessible from multiple tabs), Service (intercepts network — enables PWA offline)

**Visual — Web Worker Communication:**

```javascript
// main.js — main thread
const worker = new Worker("./worker.js");

// Send data to worker (structured clone — deep copy):
worker.postMessage({ type: "PROCESS", data: largeArray });

// Receive results:
worker.onmessage = (event) => {
  const { result } = event.data;
  renderResults(result); // ← back on main thread, can touch DOM
};

// worker.js — worker thread (no window, no document, no DOM)
self.onmessage = (event) => {
  if (event.data.type === "PROCESS") {
    const result = heavyComputation(event.data.data); // ← runs in parallel
    self.postMessage({ result });
  }
};

// Optimization: Transferable Objects (zero-copy transfer)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage({ buffer }, [buffer]); // transfer ownership — O(1) instead of O(n)
// ⚠️ After transfer: buffer is detached in main thread — can't use it
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Accessing DOM from worker | Workers run in a separate global scope with no DOM API — throws `ReferenceError` | Workers have no DOM access — return computed data, update DOM in main thread |
| Sending large objects via `postMessage` | Structured clone serializes and copies the entire object — expensive for large data | Use Transferable Objects (`ArrayBuffer`, `MessagePort`) for zero-copy transfer |
| Creating a worker for simple/fast tasks | Workers have ~5ms startup overhead — overhead exceeds benefit for fast tasks | Workers have startup cost (~5ms) — only worth it for tasks >10ms of computation |
| Forgetting error handling on worker | Uncaught worker errors don't propagate to the main thread automatically | Set `worker.onerror = (e) => { }` — errors won't propagate without a handler |

**🎯 Interview Pattern:**

- **Trigger**: "UI freeze" / "heavy computation" / "main thread blocking" / "parallelism in JS"
- **Concept**: Web Worker = separate thread, postMessage for communication, no DOM access
- **Opening**: "When computation would block the main thread for more than ~16ms, I'd move it to a Web Worker. Workers run on a separate OS thread, so the main thread stays responsive. Communication is via `postMessage` — structured clone serializes data, or you can use Transferable Objects for zero-copy transfer of ArrayBuffers..."

**🔑 Knowledge Chain:**

- **Prereq**: Event Loop basics, ArrayBuffer
- **Enables**: Parallel image/video processing, client-side search, crypto in browser, Offscreen Canvas

---

### 2. SharedArrayBuffer + Atomics

**🧠 Memory Hook:** "**SharedArrayBuffer = shared whiteboard. Atomics = the rule: only one person writes at a time. Requires COOP/COEP headers.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need shared memory when we have postMessage? Because postMessage serializes (copies) data — sending a 50MB dataset between workers is a 50MB copy. SharedArrayBuffer shares a single backing memory — no copying, zero allocation
- Why do we need Atomics? Because if two workers read-modify-write the same memory location concurrently without coordination, you get race conditions. Atomics provides atomic operations: `compareExchange` (compare old value, set new only if match — basis of lock-free algorithms), `wait`/`notify` (sleeping/waking threads)
- Why was SharedArrayBuffer disabled by default after 2018? The Spectre CPU vulnerability — shared memory allows timing attacks. Re-enabled when browsers added Cross-Origin Isolation: `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` headers

**Visual — SharedArrayBuffer + Atomics:**

```javascript
// main.js:
const sharedBuffer = new SharedArrayBuffer(4); // 4 bytes = 1 Int32
const shared = new Int32Array(sharedBuffer);

const worker = new Worker("./worker.js");
worker.postMessage({ sharedBuffer }); // pass reference (not copy!)

// Wait for worker to be done (blocking in main thread — avoid in production!):
Atomics.wait(shared, 0, 0); // wait until shared[0] !== 0

// worker.js:
self.onmessage = (event) => {
  const shared = new Int32Array(event.data.sharedBuffer);
  // Both main thread and worker share the SAME memory

  // Atomic increment (thread-safe):
  Atomics.add(shared, 0, 1); // atomic: read-add-write as one operation

  // Wake up main thread:
  Atomics.notify(shared, 0, 1);
};

// Cross-Origin Isolation required — server headers:
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Non-atomic `shared[0]++` in worker | `++` is a read-modify-write — another thread can interleave between read and write (race condition) | Use `Atomics.add(shared, 0, 1)` for thread-safe increment |
| Forgetting COOP/COEP headers | Browser disables `SharedArrayBuffer` without cross-origin isolation — silently returns `undefined` | Set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` |
| Using `SharedArrayBuffer` for general JS object sharing | Only raw binary data can be shared — JS objects, functions, and references cannot cross thread boundaries | Only share raw typed integer/float data; pass complex structures via `postMessage` |
| `Atomics.wait` on main browser thread | `Atomics.wait` blocks the calling thread — forbidden on main thread (would freeze UI) | Use `Atomics.waitAsync` on main thread; `Atomics.wait` only in workers |

**🎯 Interview Pattern:**

- **Trigger**: "cross-worker communication" / "high-performance shared state" / "WASM + workers"
- **Concept**: SharedArrayBuffer = zero-copy shared memory; Atomics = thread-safe operations; COOP/COEP required
- **Opening**: "For passing large datasets between workers efficiently, SharedArrayBuffer shares a single backing memory — no serialization. Both threads view the same bytes. Atomics provides the synchronization: `compareExchange` for lock-free algorithms, `wait`/`notify` for sleeping/waking. There's a security requirement: Cross-Origin Isolation headers (COOP + COEP) must be set or SharedArrayBuffer is disabled..."

**🔑 Knowledge Chain:**

- **Prereq**: Web Workers (postMessage), ArrayBuffer/TypedArrays
- **Enables**: WebAssembly multi-threading, high-performance client-side computation, lock-free data structures

---

### 3. Async Iterators & `for await...of`

**🧠 Memory Hook:** "**Async iterator = iterator where `.next()` returns a Promise. `for await...of` is `for...of` that awaits each `.next()`.**"

**Why does this exist? / Tại sao tồn tại?**

- Why isn't regular `for...of` enough for async data? Because `for...of` calls `.next()` synchronously and expects `{value, done}` immediately. Async data sources (file reading, event streams, paginated APIs) need each value to be awaited before requesting the next
- Why is the pull-based model important? Async iterators are pull-based — the consumer controls the pace by awaiting each value. This is different from push-based (EventEmitter) where the producer controls the rate. Pull-based is composable and handles backpressure naturally
- Why does Node.js use async iterators for streams? Because `for await (const chunk of readableStream)` is far cleaner than `stream.on('data', ...) + stream.on('end', ...)` while maintaining the same backpressure semantics

**Visual — Async Iterator Protocol:**

```javascript
// The protocol:
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let page = 1;
    return {
      async next() {
        const data = await fetch(`/api/items?page=${page++}`);
        const items = await data.json();
        if (items.length === 0) return { done: true, value: undefined };
        return { done: false, value: items };
      },
    };
  },
};

// Consumer:
for await (const page of asyncIterable) {
  console.log("Got page:", page);
  // Awaits each fetch before requesting next page — natural backpressure
}

// Async generator (simplest way to create async iterable):
async function* paginate(url) {
  let page = 1;
  while (true) {
    const res = await fetch(`${url}?page=${page++}`);
    const items = await res.json();
    if (items.length === 0) return;
    yield items; // ← pauses here, resumes when consumer awaits .next()
  }
}

for await (const items of paginate("/api/products")) {
  processItems(items);
}

// Node.js streams as async iterators:
const fs = require("fs");
const stream = fs.createReadStream("large-file.csv");
for await (const chunk of stream) {
  processChunk(chunk); // backpressure handled automatically
}
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `for...of` on async iterable (not `for await`) | Without `await`, each iteration yields a `Promise` object — not the resolved value | Use `for await...of` — awaits each `.next()` call before proceeding |
| Forgetting to handle early termination in `for await` | Breaking from `for await` calls `.return()` on the iterator — resources may not be cleaned up | Handle cleanup in `finally` block inside the async generator |
| `await` inside regular `for...of` (not `for await...of`) | Awaits each iteration sequentially but doesn't properly use the async iterator protocol | Use `for await...of` to correctly consume async iterables |
| Creating async iterables manually (verbose) | Manual `[Symbol.asyncIterator]` implementation is error-prone and verbose | Use `async function*` generator — cleanest syntax |

**🎯 Interview Pattern:**

- **Trigger**: "paginated API" / "streaming data" / "consume async data source" / "Node.js streams"
- **Concept**: Async iterator protocol; `for await...of`; async generators
- **Opening**: "Async iterators extend the iterator protocol to async data sources. `for await...of` awaits each `.next()` call before pulling the next item — pull-based with natural backpressure. The easiest way to create them is `async function*` generators. Node.js streams implement `[Symbol.asyncIterator]`, so you can `for await...of` them directly..."

**🔑 Knowledge Chain:**

- **Prereq**: Regular iterators (`Symbol.iterator`), async/await, generators
- **Enables**: Paginated API consumers, stream processing, real-time data feeds, reactive programming patterns

---

## Reference Theory / Tài Liệu Tham Khảo

## Event Loop / Vòng Lặp Sự Kiện

### Event Loop Architecture / Kiến Trúc Event Loop

**English:** JavaScript uses a single-threaded event loop for concurrency, handling asynchronous operations without blocking.

**Tiếng Việt:** JavaScript sử dụng event loop đơn luồng cho đồng thời, xử lý các thao tác bất đồng bộ mà không chặn.

```typescript
// Event loop simulation
// Mô phỏng event loop

/**
 * Event Loop Components:
 * 1. Call Stack - Execution context stack
 * 2. Task Queue (Macrotask) - setTimeout, setInterval, I/O
 * 3. Microtask Queue - Promises, queueMicrotask
 * 4. Web APIs - Browser APIs (setTimeout, fetch, etc.)
 * 5. Render Queue - requestAnimationFrame
 */

interface Task {
  id: number;
  callback: () => void;
  type: "macro" | "micro" | "render";
  priority: number;
}

class EventLoopSimulator {
  private callStack: (() => void)[] = [];
  private macrotaskQueue: Task[] = [];
  private microtaskQueue: Task[] = [];
  private renderQueue: Task[] = [];
  private taskIdCounter = 0;
  private isRunning = false;

  // Schedule macrotask (setTimeout, setInterval)
  // Lập lịch macrotask
  scheduleMacrotask(callback: () => void, delay: number = 0): number {
    const taskId = this.taskIdCounter++;

    setTimeout(() => {
      this.macrotaskQueue.push({
        id: taskId,
        callback,
        type: "macro",
        priority: 0,
      });
    }, delay);

    return taskId;
  }

  // Schedule microtask (Promise, queueMicrotask)
  // Lập lịch microtask
  scheduleMicrotask(callback: () => void): void {
    this.microtaskQueue.push({
      id: this.taskIdCounter++,
      callback,
      type: "micro",
      priority: 1,
    });
  }

  // Schedule render task (requestAnimationFrame)
  // Lập lịch render task
  scheduleRenderTask(callback: () => void): number {
    const taskId = this.taskIdCounter++;

    this.renderQueue.push({
      id: taskId,
      callback,
      type: "render",
      priority: 2,
    });

    return taskId;
  }

  // Execute one iteration of event loop
  // Thực thi một vòng lặp của event loop
  tick(): void {
    // 1. Execute all microtasks
    while (this.microtaskQueue.length > 0) {
      const task = this.microtaskQueue.shift()!;
      this.executeTask(task);
    }

    // 2. Execute one macrotask
    if (this.macrotaskQueue.length > 0) {
      const task = this.macrotaskQueue.shift()!;
      this.executeTask(task);

      // Execute microtasks after macrotask
      while (this.microtaskQueue.length > 0) {
        const microTask = this.microtaskQueue.shift()!;
        this.executeTask(microTask);
      }
    }

    // 3. Execute render tasks (if time permits)
    if (this.renderQueue.length > 0) {
      const task = this.renderQueue.shift()!;
      this.executeTask(task);
    }
  }

  private executeTask(task: Task): void {
    console.log(`Executing ${task.type}task ${task.id}`);
    this.callStack.push(task.callback);

    try {
      task.callback();
    } catch (error) {
      console.error(`Error in task ${task.id}:`, error);
    } finally {
      this.callStack.pop();
    }
  }

  // Run event loop
  // Chạy event loop
  run(): void {
    this.isRunning = true;

    const loop = () => {
      if (!this.isRunning) return;

      this.tick();

      // Continue if there are pending tasks
      if (this.hasPendingTasks()) {
        setImmediate(loop);
      }
    };

    loop();
  }

  stop(): void {
    this.isRunning = false;
  }

  private hasPendingTasks(): boolean {
    return (
      this.macrotaskQueue.length > 0 ||
      this.microtaskQueue.length > 0 ||
      this.renderQueue.length > 0
    );
  }

  getStats(): EventLoopStats {
    return {
      callStackSize: this.callStack.length,
      macrotasks: this.macrotaskQueue.length,
      microtasks: this.microtaskQueue.length,
      renderTasks: this.renderQueue.length,
    };
  }
}

interface EventLoopStats {
  callStackSize: number;
  macrotasks: number;
  microtasks: number;
  renderTasks: number;
}

// Example: Task execution order
// Ví dụ: Thứ tự thực thi task
function demonstrateEventLoop() {
  console.log("1: Synchronous");

  setTimeout(() => {
    console.log("2: Macrotask (setTimeout)");
  }, 0);

  Promise.resolve().then(() => {
    console.log("3: Microtask (Promise)");
  });

  queueMicrotask(() => {
    console.log("4: Microtask (queueMicrotask)");
  });

  console.log("5: Synchronous");

  // Output order:
  // 1: Synchronous
  // 5: Synchronous
  // 3: Microtask (Promise)
  // 4: Microtask (queueMicrotask)
  // 2: Macrotask (setTimeout)
}
```

---

## Async Patterns / Patterns Bất Đồng Bộ

### Advanced Async Patterns / Patterns Bất Đồng Bộ Nâng Cao

**English:** JavaScript provides multiple patterns for handling asynchronous operations.

**Tiếng Việt:** JavaScript cung cấp nhiều patterns để xử lý các thao tác bất đồng bộ.

```typescript
// Advanced async patterns
// Patterns bất đồng bộ nâng cao

// 1. Promise Pool - Limit concurrent promises
// 1. Promise Pool - Giới hạn promises đồng thời
class PromisePool {
  private queue: (() => Promise<any>)[] = [];
  private running = 0;

  constructor(private concurrency: number) {}

  async add<T>(task: () => Promise<T>): Promise<T> {
    while (this.running >= this.concurrency) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.running++;

    try {
      return await task();
    } finally {
      this.running--;
    }
  }

  async addAll<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(tasks.map((task) => this.add(task)));
  }
}

// Usage
async function fetchWithPool() {
  const pool = new PromisePool(3); // Max 3 concurrent requests

  const urls = Array.from({ length: 10 }, (_, i) => `https://api.example.com/item/${i}`);

  const results = await pool.addAll(urls.map((url) => () => fetch(url).then((r) => r.json())));

  return results;
}

// 2. Retry with exponential backoff
// 2. Retry với exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError!;
}

// 3. Timeout wrapper
// 3. Wrapper timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);
}

// 4. Debounce async
// 4. Debounce bất đồng bộ
function debounceAsync<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<any> | null = null;

  return ((...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
            timeoutId = null;
          }
        }, delay);
      });
    }

    return pendingPromise;
  }) as T;
}

// 5. Throttle async
// 5. Throttle bất đồng bộ
function throttleAsync<T extends (...args: any[]) => Promise<any>>(fn: T, limit: number): T {
  let lastRun = 0;
  let pendingPromise: Promise<any> | null = null;

  return ((...args: any[]) => {
    const now = Date.now();

    if (now - lastRun >= limit) {
      lastRun = now;
      return fn(...args);
    }

    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        setTimeout(
          async () => {
            lastRun = Date.now();
            try {
              const result = await fn(...args);
              resolve(result);
            } catch (error) {
              reject(error);
            } finally {
              pendingPromise = null;
            }
          },
          limit - (now - lastRun),
        );
      });
    }

    return pendingPromise;
  }) as T;
}

// 6. Sequential execution
// 6. Thực thi tuần tự
async function sequential<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}

// 7. Parallel execution with limit
// 7. Thực thi song song với giới hạn
async function parallelLimit<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const [index, task] of tasks.entries()) {
    const promise = task().then((result) => {
      results[index] = result;
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1,
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// 8. Race with timeout
// 8. Race với timeout
async function raceWithTimeout<T>(promises: Promise<T>[], timeout: number): Promise<T> {
  return Promise.race([
    ...promises,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
  ]);
}

// 9. Async queue
// 9. Hàng đợi bất đồng bộ
class AsyncQueue<T> {
  private queue: T[] = [];
  private waiting: ((value: T) => void)[] = [];

  enqueue(item: T): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve(item);
    } else {
      this.queue.push(item);
    }
  }

  async dequeue(): Promise<T> {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  size(): number {
    return this.queue.length;
  }
}

// 10. Async semaphore
// 10. Semaphore bất đồng bộ
class AsyncSemaphore {
  private permits: number;
  private waiting: (() => void)[] = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve();
    } else {
      this.permits++;
    }
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}
```

---

## Web Workers / Web Workers

### Multi-Threading with Workers / Đa Luồng với Workers

**English:** Web Workers enable true parallel execution in JavaScript by running scripts in background threads.

**Tiếng Việt:** Web Workers cho phép thực thi song song thực sự trong JavaScript bằng cách chạy scripts trong các luồng nền.

```typescript
// Web Worker implementation
// Triển khai Web Worker

// Main thread
// Luồng chính
class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: WorkerTask[] = [];
  private availableWorkers: Set<number> = new Set();

  constructor(
    private workerScript: string,
    private poolSize: number,
  ) {
    this.initializeWorkers();
  }

  private initializeWorkers(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerScript);
      this.workers.push(worker);
      this.availableWorkers.add(i);

      worker.onmessage = (event) => {
        this.handleWorkerMessage(i, event.data);
      };

      worker.onerror = (error) => {
        console.error(`Worker ${i} error:`, error);
      };
    }
  }

  async execute<T>(data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask = {
        data,
        resolve,
        reject,
      };

      if (this.availableWorkers.size > 0) {
        this.assignTask(task);
      } else {
        this.taskQueue.push(task);
      }
    });
  }

  private assignTask(task: WorkerTask): void {
    const workerId = Array.from(this.availableWorkers)[0];
    this.availableWorkers.delete(workerId);

    const worker = this.workers[workerId];
    worker.postMessage(task.data);

    // Store task for this worker
    (worker as any).__currentTask = task;
  }

  private handleWorkerMessage(workerId: number, result: any): void {
    const worker = this.workers[workerId];
    const task = (worker as any).__currentTask as WorkerTask;

    if (task) {
      if (result.error) {
        task.reject(new Error(result.error));
      } else {
        task.resolve(result.data);
      }

      delete (worker as any).__currentTask;
    }

    // Mark worker as available
    this.availableWorkers.add(workerId);

    // Assign next task if available
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift()!;
      this.assignTask(nextTask);
    }
  }

  terminate(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.availableWorkers.clear();
    this.taskQueue = [];
  }
}

interface WorkerTask {
  data: any;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}

// Worker script (worker.js)
// Script worker
/*
self.onmessage = function(event) {
  const data = event.data;
  
  try {
    // Perform heavy computation
    const result = performComputation(data);
    
    self.postMessage({ data: result });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

function performComputation(data) {
  // Heavy computation here
  return data;
}
*/

// Usage example
async function useWorkerPool() {
  const pool = new WorkerPool("worker.js", 4);

  const tasks = Array.from({ length: 100 }, (_, i) => i);

  const results = await Promise.all(tasks.map((task) => pool.execute(task)));

  console.log("All tasks completed:", results);

  pool.terminate();
}

// Shared Worker for cross-tab communication
// Shared Worker cho giao tiếp giữa các tab
class SharedWorkerManager {
  private worker: SharedWorker;
  private port: MessagePort;

  constructor(scriptURL: string) {
    this.worker = new SharedWorker(scriptURL);
    this.port = this.worker.port;
    this.port.start();
  }

  send(message: any): void {
    this.port.postMessage(message);
  }

  onMessage(callback: (data: any) => void): void {
    this.port.onmessage = (event) => {
      callback(event.data);
    };
  }

  close(): void {
    this.port.close();
  }
}
```

---

## Shared Memory / Bộ Nhớ Chia Sẻ

### SharedArrayBuffer and Atomics / SharedArrayBuffer và Atomics

**English:** SharedArrayBuffer allows sharing memory between workers for high-performance parallel computing.

**Tiếng Việt:** SharedArrayBuffer cho phép chia sẻ bộ nhớ giữa các workers cho tính toán song song hiệu suất cao.

```typescript
// Shared memory implementation
// Triển khai bộ nhớ chia sẻ

class SharedMemoryManager {
  private buffer: SharedArrayBuffer;
  private view: Int32Array;

  constructor(size: number) {
    this.buffer = new SharedArrayBuffer(size * Int32Array.BYTES_PER_ELEMENT);
    this.view = new Int32Array(this.buffer);
  }

  // Atomic operations
  // Thao tác atomic

  atomicAdd(index: number, value: number): number {
    return Atomics.add(this.view, index, value);
  }

  atomicSub(index: number, value: number): number {
    return Atomics.sub(this.view, index, value);
  }

  atomicLoad(index: number): number {
    return Atomics.load(this.view, index);
  }

  atomicStore(index: number, value: number): number {
    return Atomics.store(this.view, index, value);
  }

  atomicExchange(index: number, value: number): number {
    return Atomics.exchange(this.view, index, value);
  }

  atomicCompareExchange(index: number, expected: number, replacement: number): number {
    return Atomics.compareExchange(this.view, index, expected, replacement);
  }

  // Wait/notify for synchronization
  // Wait/notify cho đồng bộ hóa

  wait(index: number, value: number, timeout?: number): "ok" | "not-equal" | "timed-out" {
    return Atomics.wait(this.view, index, value, timeout);
  }

  notify(index: number, count: number = 1): number {
    return Atomics.notify(this.view, index, count);
  }

  getBuffer(): SharedArrayBuffer {
    return this.buffer;
  }
}

// Lock implementation using shared memory
// Triển khai lock sử dụng bộ nhớ chia sẻ
class SharedLock {
  private static UNLOCKED = 0;
  private static LOCKED = 1;

  constructor(
    private buffer: SharedArrayBuffer,
    private index: number,
  ) {}

  lock(): void {
    const view = new Int32Array(this.buffer);

    while (true) {
      const oldValue = Atomics.compareExchange(
        view,
        this.index,
        SharedLock.UNLOCKED,
        SharedLock.LOCKED,
      );

      if (oldValue === SharedLock.UNLOCKED) {
        return; // Lock acquired
      }

      // Wait for unlock
      Atomics.wait(view, this.index, SharedLock.LOCKED);
    }
  }

  unlock(): void {
    const view = new Int32Array(this.buffer);
    Atomics.store(view, this.index, SharedLock.UNLOCKED);
    Atomics.notify(view, this.index, 1);
  }

  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    this.lock();
    try {
      return await fn();
    } finally {
      this.unlock();
    }
  }
}
```

---

## Async Iterators / Iterators Bất Đồng Bộ

### Async Iteration Protocol / Giao Thức Iteration Bất Đồng Bộ

**English:** Async iterators allow iterating over asynchronous data sources.

**Tiếng Việt:** Async iterators cho phép lặp qua các nguồn dữ liệu bất đồng bộ.

```typescript
// Async iterator implementation
// Triển khai async iterator

class AsyncRange {
  constructor(
    private start: number,
    private end: number,
    private delay: number = 100,
  ) {}

  async *[Symbol.asyncIterator]() {
    for (let i = this.start; i <= this.end; i++) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
      yield i;
    }
  }
}

// Usage
async function useAsyncRange() {
  const range = new AsyncRange(1, 5, 100);

  for await (const num of range) {
    console.log(num); // 1, 2, 3, 4, 5 (with delays)
  }
}

// Async generator
async function* asyncGenerator() {
  let i = 0;
  while (i < 5) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    yield i++;
  }
}

// Async iterator helpers
class AsyncIteratorHelpers {
  static async *map<T, U>(
    iterable: AsyncIterable<T>,
    fn: (value: T) => U | Promise<U>,
  ): AsyncIterableIterator<U> {
    for await (const value of iterable) {
      yield await fn(value);
    }
  }

  static async *filter<T>(
    iterable: AsyncIterable<T>,
    predicate: (value: T) => boolean | Promise<boolean>,
  ): AsyncIterableIterator<T> {
    for await (const value of iterable) {
      if (await predicate(value)) {
        yield value;
      }
    }
  }

  static async *take<T>(iterable: AsyncIterable<T>, count: number): AsyncIterableIterator<T> {
    let i = 0;
    for await (const value of iterable) {
      if (i++ >= count) break;
      yield value;
    }
  }

  static async toArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const value of iterable) {
      result.push(value);
    }
    return result;
  }
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: When should you use a Web Worker? What are its constraints? / Khi nào nên dùng Web Worker? Các giới hạn là gì?

**A:** Use a Web Worker when a computation would block the main thread for more than ~16ms (one frame at 60fps). Web Workers run on a separate OS thread — the main thread stays responsive for rendering and user events.

**Constraints:**

- No DOM access — workers can't read or write `document` / `window`. Return computed data, let the main thread update the UI.
- Communication only via `postMessage` — data is serialized (structured clone). Use Transferable Objects (`ArrayBuffer`, `MessagePort`) for zero-copy O(1) transfer of large binary data.
- Worker startup cost is ~5ms — not worth it for sub-millisecond tasks.
- Dedicated workers are 1:1 with a page. Shared workers are shared across same-origin tabs. Service workers intercept network requests (PWA offline).

**Tiếng Việt:** Dùng Web Worker khi computation >16ms để tránh block main thread. Worker không có DOM access — chỉ truyền dữ liệu qua `postMessage`. Với binary data lớn, dùng Transferable Objects để transfer ownership O(1) thay vì copy O(n).

💡 **Interview Signal:**

- ✅ Strong: Mentions the 16ms frame budget threshold; explains structured clone vs Transferable distinction; mentions worker startup cost trade-off
- ❌ Weak: "Web Workers run code in background" — true but missing when/why to use them and the DOM/communication constraints

---

### 🟡 [Mid] Q2: Why does `for await...of` exist? How does the async iterator protocol work? / Tại sao `for await...of` tồn tại? Giao thức async iterator hoạt động như thế nào?

**A:** Regular `for...of` calls `.next()` synchronously and expects `{value, done}` immediately. That breaks for async data sources (paginated APIs, file streams) where each item needs to be awaited before requesting the next.

**Protocol:** An async iterable must implement `[Symbol.asyncIterator]()` returning an object with `async next()` → `Promise<{value, done}>`.

`for await...of` sugar:

1. Calls `[Symbol.asyncIterator]()` to get the iterator
2. Calls `.next()`, **awaits** the returned Promise
3. Extracts `{value, done}`, runs loop body with `value`
4. Repeats until `done: true`
5. On `break`/`return`, calls `.return()` on iterator — generator `finally` blocks run for cleanup

**Easiest creation:** `async function*` generator — combine `await` (pause for async I/O) and `yield` (pause and emit a value).

```javascript
async function* paginate(url) {
  let page = 1;
  while (true) {
    const items = await fetch(`${url}?page=${page++}`).then((r) => r.json());
    if (items.length === 0) return;
    yield items; // ← emits one page at a time; consumer controls pace
  }
}

for await (const page of paginate("/api/products")) {
  renderPage(page); // natural backpressure — next fetch waits until consumer is ready
}
```

**Tiếng Việt:** `for await...of` là `for...of` nhưng await mỗi `.next()`. Protocol: `[Symbol.asyncIterator]()` trả về object có `async next()`. Cách đơn giản nhất: `async function*` generator kết hợp `await` (chờ I/O) và `yield` (phát giá trị). Khi `break`, `.return()` được gọi — generator `finally` cleanup chạy đúng.

💡 **Interview Signal:**

- ✅ Strong: Explains pull-based vs push-based; mentions backpressure; knows `.return()` is called on break for cleanup; compares to EventEmitter (push)
- ❌ Weak: "for await is like for...of but for Promises" — misses the protocol, pull model, and backpressure

---

### 🔴 [Senior] Q3: Why do we need Atomics when we have `postMessage`? Explain `Atomics.compareExchange`. / Tại sao cần Atomics khi đã có `postMessage`?

**A:** `postMessage` serializes (deep-copies) data. Sending 50MB between workers costs 50MB of allocation and copying. `SharedArrayBuffer` shares a single backing memory — both threads view the same bytes, zero copying.

But sharing memory creates **race conditions**: if two workers do `shared[0]++` (read-modify-write) concurrently, one increment is lost — they both read the same old value, compute +1, write back the same result.

**Atomics** provides operations that are guaranteed indivisible:

- `Atomics.add(view, i, 1)` — atomic increment, never races
- `Atomics.compareExchange(view, i, expected, replacement)` — **CAS**: read the value, compare it to `expected`; if they match, write `replacement`; return the old value. The entire operation is atomic. Used to build mutexes, lock-free queues, spinlocks.

**Security requirement:** SharedArrayBuffer was disabled after Spectre (2018) because shared memory enables timing attacks — attackers could measure memory access patterns. Re-enabled with Cross-Origin Isolation: servers must send `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` headers. `Atomics.wait` is also blocked on the main browser thread (blocking would freeze UI) — use `Atomics.waitAsync` instead.

**Tiếng Việt:** `postMessage` copy data — tốn kém cho dataset lớn. `SharedArrayBuffer` chia sẻ bộ nhớ gốc không copy. Nhưng cần Atomics để tránh race condition. `compareExchange` là CAS (compare-and-swap): đọc → so sánh expected → nếu khớp thì ghi replacement — toàn bộ là một thao tác nguyên tử. SharedArrayBuffer cần COOP/COEP headers (Spectre mitigation). `Atomics.wait` bị block trên main thread — dùng `Atomics.waitAsync`.

💡 **Interview Signal:**

- ✅ Strong: Explains why postMessage is insufficient for large data (copy cost); describes the race condition without Atomics; explains CAS semantics of `compareExchange`; mentions Spectre and COOP/COEP requirement
- ❌ Weak: "SharedArrayBuffer lets workers share memory, Atomics makes it thread-safe" — correct but surface level; interviewer will ask _how_ and _why_

---

### 🔴 [Senior] Q4: Design a client-side image processing pipeline using Web Workers. How do you avoid copying large buffers? / Thiết kế pipeline xử lý ảnh phía client với Web Workers.

**A:** Image processing is CPU-intensive (filters, color transforms, WASM codecs). Doing it on the main thread causes UI jank.

**Design:**

```javascript
// main.js
async function processImage(imageFile) {
  const worker = new Worker("./image-worker.js");

  // Get raw pixels via OffscreenCanvas or ImageBitmap
  const bitmap = await createImageBitmap(imageFile);
  // Transfer ImageBitmap — zero-copy, ownership moves to worker
  worker.postMessage({ type: "PROCESS", bitmap }, [bitmap]);
  // ⚠️ bitmap is now detached on main thread

  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      // Worker returns processed ArrayBuffer — transfer back
      const processedBuffer = e.data.buffer;
      resolve(processedBuffer);
      worker.terminate();
    };
  });
}

// image-worker.js
self.onmessage = async (e) => {
  const { bitmap } = e.data;
  const offscreen = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = offscreen.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

  // Heavy processing — e.g., grayscale
  const pixels = imageData.data; // Uint8ClampedArray
  for (let i = 0; i < pixels.length; i += 4) {
    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;
  }

  const processed = imageData.data.buffer;
  self.postMessage({ buffer: processed }, [processed]); // transfer back
};
```

**Key decisions:**

- Transfer `ImageBitmap` (Transferable) → zero-copy from main to worker
- Use `OffscreenCanvas` in worker for canvas API without main thread
- Transfer result `ArrayBuffer` back — zero-copy again
- Worker pool pattern for batch processing (4 workers = 4 CPU cores utilized)
- For WASM-based processing: load `.wasm` in worker via `WebAssembly.instantiateStreaming`

**Tiếng Việt:** Pipeline: `createImageBitmap` trên main thread → transfer (zero-copy) sang worker → xử lý pixel trên worker (CPU không block UI) → transfer ArrayBuffer kết quả về main thread. Dùng `OffscreenCanvas` trong worker để vẽ canvas. Worker pool để xử lý batch song song với N CPU cores.

💡 **Interview Signal:**

- ✅ Strong: Uses Transferable Objects (not postMessage copy) for both directions; mentions OffscreenCanvas; discusses worker pooling for batch; connects to WASM for codec use cases
- ❌ Weak: "Create a worker and postMessage the image data" — misses zero-copy transfer and the OffscreenCanvas pattern; will cause O(n) copy on large images

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                          | Key Insight                                                                                          |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Q1  | Web Workers — when/constraints | >16ms threshold; no DOM; postMessage serializes; Transferable = zero-copy                            |
| Q2  | Async iterators — protocol     | `[Symbol.asyncIterator]` + `async next()`; `for await` awaits each next(); pull-based backpressure   |
| Q3  | SharedArrayBuffer + Atomics    | postMessage copies; SAB shares; CAS (`compareExchange`) for lock-free algorithms; COOP/COEP required |
| Q4  | Image processing pipeline      | ImageBitmap Transferable + OffscreenCanvas + worker pool = zero-copy parallel processing             |

---

## ⚡ Cold Call Simulation

**Q: "A user reports that scrolling freezes when processing a CSV file with 500,000 rows in the browser. How do you fix this?"**

**30-second answer:**
"The CSV parsing is blocking the main thread — each row processed synchronously keeps the thread busy, so scroll events can't fire. The fix is a Web Worker: pass the raw CSV text to the worker via `postMessage`, let the worker parse all rows, then `postMessage` the results back. The main thread never blocks. If the CSV is very large (>10MB), use a Transferable `ArrayBuffer` for zero-copy transfer instead of string copying. In the worker, I'd also chunk the processing with `yield`-based streaming if possible — parse and return rows in batches so the main thread can render progressively."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**

1. What are the 3 types of Web Workers and their use cases?
2. Why does `postMessage` not use Transferable Objects by default?
3. What is the async iterator protocol — what method/symbol does an object need?
4. Why was SharedArrayBuffer disabled in 2018? What headers re-enable it?
5. What does `Atomics.compareExchange(view, i, expected, replacement)` do atomically?

**Visual:**

- Draw the Web Worker communication model: main thread ↔ postMessage ↔ worker. Where does DOM live? Where does heavy computation go?
- Draw the async iterator pull model: consumer calls `.next()` → awaits → gets value → calls `.next()` again. How is this different from EventEmitter?

**Application:**

- When would you use a SharedArrayBuffer instead of postMessage for worker communication?
- Your app processes 1000 images. Design a solution that doesn't freeze the UI and uses CPU cores efficiently.

**Debug:**

- `SharedArrayBuffer` returns `undefined` in your code. What's the likely cause?
- `Atomics.wait` throws an error on the main thread. Why? What's the fix?

**Teach:**

- Explain async iterators to a junior developer using the "room service" analogy: you call room service (`.next()`), wait for them to bring the food (await Promise), eat it, then call again — you control the pace.

> 🎯 **Feynman Prompt:** Giải thích cho PM: tại sao trang web bị "đơ" khi xử lý file lớn — JavaScript single-thread hoạt động như thế nào, và Web Workers giải quyết vấn đề đó ra sao mà không cần "chia sẻ bộ nhớ" rủi ro?

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: Transferable Objects pattern, CAS/compareExchange semantics, async iterator protocol.

---

## Connections / Liên Kết

- **Prereqs**: [06-event-loop-async.md](./06-event-loop-async.md) (Event Loop deep dive), [09-async-comprehensive.md](./09-async-comprehensive.md) (async/await, generators)
- **See also**: [15-memory-management-advanced.md](./15-memory-management-advanced.md) (GC and ArrayBuffer memory model), [20-module-systems-theory.md](./20-module-systems-theory.md)
- **FE performance**: Web Workers connect to [06-browser-performance/05-rendering-optimization-theory.md](../06-browser-performance/05-rendering-optimization-theory.md) — Workers are the solution to long JS tasks that block the pixel pipeline

---

[← Previous: Metaprogramming](./18-metaprogramming-theory.md) | [Next: Module Systems →](./20-module-systems-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
