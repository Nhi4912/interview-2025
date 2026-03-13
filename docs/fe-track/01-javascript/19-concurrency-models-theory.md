# JavaScript Concurrency Models - Theory / Mô Hình Đồng Thời JavaScript - Lý Thuyết


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Event Loop](#event-loop)
2. [Async Patterns](#async-patterns)
3. [Web Workers](#web-workers)
4. [Shared Memory](#shared-memory)
5. [Async Iterators](#async-iterators)
6. [Interview Questions](#interview-questions)

---

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
  type: 'macro' | 'micro' | 'render';
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
        type: 'macro',
        priority: 0
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
      type: 'micro',
      priority: 1
    });
  }
  
  // Schedule render task (requestAnimationFrame)
  // Lập lịch render task
  scheduleRenderTask(callback: () => void): number {
    const taskId = this.taskIdCounter++;
    
    this.renderQueue.push({
      id: taskId,
      callback,
      type: 'render',
      priority: 2
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
      renderTasks: this.renderQueue.length
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
  console.log('1: Synchronous');
  
  setTimeout(() => {
    console.log('2: Macrotask (setTimeout)');
  }, 0);
  
  Promise.resolve().then(() => {
    console.log('3: Microtask (Promise)');
  });
  
  queueMicrotask(() => {
    console.log('4: Microtask (queueMicrotask)');
  });
  
  console.log('5: Synchronous');
  
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
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    this.running++;
    
    try {
      return await task();
    } finally {
      this.running--;
    }
  }
  
  async addAll<T>(tasks: (() => Promise<T>)[]): Promise<T[]> {
    return Promise.all(tasks.map(task => this.add(task)));
  }
}

// Usage
async function fetchWithPool() {
  const pool = new PromisePool(3); // Max 3 concurrent requests
  
  const urls = Array.from({ length: 10 }, (_, i) => `https://api.example.com/item/${i}`);
  
  const results = await pool.addAll(
    urls.map(url => () => fetch(url).then(r => r.json()))
  );
  
  return results;
}

// 2. Retry with exponential backoff
// 2. Retry với exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
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
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
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
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

// 4. Debounce async
// 4. Debounce bất đồng bộ
function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number
): T {
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
function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limit: number
): T {
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
        setTimeout(async () => {
          lastRun = Date.now();
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            pendingPromise = null;
          }
        }, limit - (now - lastRun));
      });
    }
    
    return pendingPromise;
  }) as T;
}

// 6. Sequential execution
// 6. Thực thi tuần tự
async function sequential<T>(
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];
  
  for (const task of tasks) {
    results.push(await task());
  }
  
  return results;
}

// 7. Parallel execution with limit
// 7. Thực thi song song với giới hạn
async function parallelLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (const [index, task] of tasks.entries()) {
    const promise = task().then(result => {
      results[index] = result;
    });
    
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }
  
  await Promise.all(executing);
  return results;
}

// 8. Race with timeout
// 8. Race với timeout
async function raceWithTimeout<T>(
  promises: Promise<T>[],
  timeout: number
): Promise<T> {
  return Promise.race([
    ...promises,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
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
    
    return new Promise(resolve => {
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
    
    return new Promise(resolve => {
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
    private poolSize: number
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
        reject
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
    this.workers.forEach(worker => worker.terminate());
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
  const pool = new WorkerPool('worker.js', 4);
  
  const tasks = Array.from({ length: 100 }, (_, i) => i);
  
  const results = await Promise.all(
    tasks.map(task => pool.execute(task))
  );
  
  console.log('All tasks completed:', results);
  
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
  
  wait(index: number, value: number, timeout?: number): 'ok' | 'not-equal' | 'timed-out' {
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
    private index: number
  ) {}
  
  lock(): void {
    const view = new Int32Array(this.buffer);
    
    while (true) {
      const oldValue = Atomics.compareExchange(
        view,
        this.index,
        SharedLock.UNLOCKED,
        SharedLock.LOCKED
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
    private delay: number = 100
  ) {}
  
  async *[Symbol.asyncIterator]() {
    for (let i = this.start; i <= this.end; i++) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
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
    await new Promise(resolve => setTimeout(resolve, 100));
    yield i++;
  }
}

// Async iterator helpers
class AsyncIteratorHelpers {
  static async *map<T, U>(
    iterable: AsyncIterable<T>,
    fn: (value: T) => U | Promise<U>
  ): AsyncIterableIterator<U> {
    for await (const value of iterable) {
      yield await fn(value);
    }
  }
  
  static async *filter<T>(
    iterable: AsyncIterable<T>,
    predicate: (value: T) => boolean | Promise<boolean>
  ): AsyncIterableIterator<T> {
    for await (const value of iterable) {
      if (await predicate(value)) {
        yield value;
      }
    }
  }
  
  static async *take<T>(
    iterable: AsyncIterable<T>,
    count: number
  ): AsyncIterableIterator<T> {
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

### 🟡 [Mid] Q1: Explain the JavaScript event loop

**English Answer:**

**Event Loop** manages asynchronous operations:

**Components:**
1. **Call Stack**: Execution contexts
2. **Task Queue (Macrotask)**: setTimeout, setInterval, I/O
3. **Microtask Queue**: Promises, queueMicrotask
4. **Web APIs**: Browser APIs

**Execution Order:**
1. Execute synchronous code
2. Execute all microtasks
3. Execute one macrotask
4. Execute all microtasks again
5. Render (if needed)
6. Repeat

**Example:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

**Tiếng Việt:**

Event loop quản lý thao tác bất đồng bộ. Thứ tự: sync code → microtasks → macrotask → microtasks → render.

### 🟡 [Mid] Q2: What are Web Workers and when to use them?

**English Answer:**

**Web Workers** run scripts in background threads.

**Types:**
1. **Dedicated Worker**: One-to-one with page
2. **Shared Worker**: Shared across tabs
3. **Service Worker**: For offline/caching

**Use Cases:**
- Heavy computations
- Image/video processing
- Data parsing
- Cryptography
- Background sync

**Limitations:**
- No DOM access
- No window object
- Communication via messages
- Separate global scope

**Tiếng Việt:**

Web Workers chạy scripts trong luồng nền. Dùng cho tính toán nặng, xử lý ảnh/video, parsing dữ liệu, cryptography.

### 🔴 [Senior] Q3: Explain SharedArrayBuffer and Atomics

**English Answer:**

**SharedArrayBuffer** shares memory between workers.

**Atomics** provide atomic operations:
- `Atomics.add/sub` - Arithmetic
- `Atomics.load/store` - Access
- `Atomics.compareExchange` - Compare and swap
- `Atomics.wait/notify` - Synchronization

**Use Cases:**
- High-performance computing
- Parallel algorithms
- Shared state between workers
- Lock-free data structures

**Security:** Disabled by default due to Spectre vulnerability. Requires COOP/COEP headers.

**Tiếng Việt:**

SharedArrayBuffer chia sẻ bộ nhớ giữa workers. Atomics cung cấp thao tác atomic. Dùng cho tính toán hiệu suất cao, thuật toán song song.

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Event loop manages async operations
2. Microtasks execute before macrotasks
3. Web Workers enable parallel execution
4. SharedArrayBuffer shares memory
5. Atomics provide thread-safe operations
6. Async iterators for async data
7. Various async patterns for control flow

---

[← Previous: Metaprogramming](./18-metaprogramming-theory.md) | [Next: Module Systems →](./20-module-systems-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
