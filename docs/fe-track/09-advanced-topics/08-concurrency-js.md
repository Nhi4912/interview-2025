# Concurrency & Parallelism Theory
## Understanding Concurrent and Parallel Computing

**English:** Concurrency is about dealing with multiple tasks at once, while parallelism is about executing multiple tasks simultaneously. Both are essential for modern software performance.

**Tiếng Việt:** Đồng thời (concurrency) là về việc xử lý nhiều tác vụ cùng lúc, trong khi song song (parallelism) là về việc thực thi nhiều tác vụ đồng thời. Cả hai đều quan trọng cho hiệu suất phần mềm hiện đại.

## Table of Contents
1. [Concurrency vs Parallelism](#concurrency-vs-parallelism)
2. [Processes and Threads](#processes-and-threads)
3. [Synchronization Primitives](#synchronization-primitives)
4. [Race Conditions and Deadlocks](#race-conditions-and-deadlocks)
5. [Concurrency Models](#concurrency-models)
6. [JavaScript Concurrency](#javascript-concurrency)
7. [Web Workers](#web-workers)
8. [Async Patterns](#async-patterns)
9. [Performance Considerations](#performance-considerations)

## Concurrency vs Parallelism

### Definitions

**Concurrency:**
- Multiple tasks making progress
- May not execute simultaneously
- About structure and composition
- Single core can be concurrent

**Parallelism:**
- Multiple tasks executing simultaneously
- Requires multiple cores/processors
- About execution
- Subset of concurrency

### Visual Comparison

**Concurrency (Single Core):**
```
Time →
Task A: ████░░░░████░░░░████
Task B: ░░░░████░░░░████░░░░
Task C: ░░░░░░░░░░░░░░░░░░░░████

Tasks interleaved, not simultaneous
```

**Parallelism (Multi-Core):**
```
Time →
Core 1: ████████████████████
Core 2: ████████████████████
Core 3: ████████████████████

Tasks execute simultaneously
```

### Coffee Shop Analogy

**Concurrent (One Barista):**
```
1. Take order from Customer A
2. Start brewing coffee for A
3. Take order from Customer B (while A's coffee brews)
4. Start brewing coffee for B
5. Finish A's coffee
6. Finish B's coffee

One person, multiple tasks in progress
```

**Parallel (Multiple Baristas):**
```
Barista 1: Take order A → Brew A → Serve A
Barista 2: Take order B → Brew B → Serve B
Barista 3: Take order C → Brew C → Serve C

Multiple people, truly simultaneous work
```

## Processes and Threads

### Processes

**Definition:** Independent execution unit with own memory space

**Characteristics:**
- Separate address space
- Own resources (memory, file handles)
- Heavy context switching
- Inter-process communication (IPC) needed
- Crash isolation

**Example:**
```
Browser Process Architecture:
├── Main Process (UI, coordination)
├── Renderer Process 1 (Tab 1)
├── Renderer Process 2 (Tab 2)
├── GPU Process
└── Network Process

Each process isolated, crash in one doesn't affect others
```

### Threads

**Definition:** Lightweight execution unit within a process

**Characteristics:**
- Shared address space
- Shared resources
- Light context switching
- Direct memory access
- No crash isolation

**Example:**
```
Web Server Process:
├── Main Thread (accepts connections)
├── Worker Thread 1 (handles request 1)
├── Worker Thread 2 (handles request 2)
├── Worker Thread 3 (handles request 3)
└── Database Thread (manages DB connections)

All threads share process memory
```

### Process vs Thread

**Memory:**
```
Process A:
┌─────────────────┐
│  Code           │
│  Data           │
│  Heap           │
│  Stack Thread 1 │
│  Stack Thread 2 │
└─────────────────┘

Process B:
┌─────────────────┐
│  Code           │
│  Data           │
│  Heap           │
│  Stack Thread 1 │
└─────────────────┘

Separate memory spaces
```

**Comparison:**
```
Aspect          | Process        | Thread
----------------|----------------|----------------
Memory          | Separate       | Shared
Creation Cost   | High           | Low
Context Switch  | Slow           | Fast
Communication   | IPC (slow)     | Direct (fast)
Isolation       | Strong         | None
```

## Synchronization Primitives

### Mutex (Mutual Exclusion)

**Purpose:** Ensure only one thread accesses resource at a time

**Example:**
```javascript
// Conceptual (JavaScript doesn't have true mutexes)
class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }
  
  async lock() {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    
    // Wait in queue
    await new Promise(resolve => {
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
}

// Usage
const mutex = new Mutex();
let counter = 0;

async function increment() {
  await mutex.lock();
  try {
    counter++;  // Critical section
  } finally {
    mutex.unlock();
  }
}
```

### Semaphore

**Purpose:** Control access to resource pool

**Types:**
- **Binary Semaphore:** Like mutex (0 or 1)
- **Counting Semaphore:** Multiple resources (0 to N)

**Example:**
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
      return;
    }
    
    await new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  release() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.count--;
    }
  }
}

// Usage: Limit concurrent API calls
const apiSemaphore = new Semaphore(3);  // Max 3 concurrent

async function fetchData(url) {
  await apiSemaphore.acquire();
  try {
    const response = await fetch(url);
    return response.json();
  } finally {
    apiSemaphore.release();
  }
}
```

### Monitor

**Purpose:** High-level synchronization construct

**Characteristics:**
- Encapsulates shared data
- Automatic mutual exclusion
- Condition variables for waiting

**Example:**
```javascript
class BoundedBuffer {
  constructor(size) {
    this.buffer = [];
    this.size = size;
    this.mutex = new Mutex();
    this.notFull = new ConditionVariable();
    this.notEmpty = new ConditionVariable();
  }
  
  async put(item) {
    await this.mutex.lock();
    try {
      while (this.buffer.length >= this.size) {
        await this.notFull.wait(this.mutex);
      }
      this.buffer.push(item);
      this.notEmpty.signal();
    } finally {
      this.mutex.unlock();
    }
  }
  
  async get() {
    await this.mutex.lock();
    try {
      while (this.buffer.length === 0) {
        await this.notEmpty.wait(this.mutex);
      }
      const item = this.buffer.shift();
      this.notFull.signal();
      return item;
    } finally {
      this.mutex.unlock();
    }
  }
}
```

## Race Conditions and Deadlocks

### Race Conditions

**Definition:** Outcome depends on timing of uncontrollable events

**Example:**
```javascript
// Shared state
let balance = 100;

// Thread 1
function withdraw(amount) {
  if (balance >= amount) {      // Check
    // Context switch here!
    balance -= amount;           // Update
  }
}

// Thread 2
function withdraw(amount) {
  if (balance >= amount) {      // Check
    balance -= amount;           // Update
  }
}

// Execution:
// T1: Check (balance = 100, amount = 60) ✓
// T2: Check (balance = 100, amount = 60) ✓
// T1: Update (balance = 40)
// T2: Update (balance = 40)
// Result: balance = 40 (should be -20 or one should fail)
```

**Solution:**
```javascript
const mutex = new Mutex();

async function withdraw(amount) {
  await mutex.lock();
  try {
    if (balance >= amount) {
      balance -= amount;
    }
  } finally {
    mutex.unlock();
  }
}
```

### Deadlock

**Definition:** Two or more threads waiting for each other indefinitely

**Example:**
```javascript
// Thread 1
await mutexA.lock();
// ... some work ...
await mutexB.lock();  // Waits for Thread 2
// ... critical section ...
mutexB.unlock();
mutexA.unlock();

// Thread 2
await mutexB.lock();
// ... some work ...
await mutexA.lock();  // Waits for Thread 1
// ... critical section ...
mutexA.unlock();
mutexB.unlock();

// Deadlock!
// T1 holds A, waits for B
// T2 holds B, waits for A
```

**Visual:**
```
Thread 1: [Has A] ──→ Wants B ──→ [Thread 2 has B]
                                         ↓
Thread 2: [Has B] ←── Wants A ←── [Thread 1 has A]

Circular wait = Deadlock
```

### Deadlock Conditions (Coffman Conditions)

**All four must be true:**

1. **Mutual Exclusion:** Resource can't be shared
2. **Hold and Wait:** Thread holds resource while waiting for another
3. **No Preemption:** Resource can't be forcibly taken
4. **Circular Wait:** Circular chain of waiting threads

**Prevention:**

**Ordered Locking:**
```javascript
// Always acquire locks in same order
async function transfer(from, to, amount) {
  const first = from.id < to.id ? from : to;
  const second = from.id < to.id ? to : from;
  
  await first.lock();
  await second.lock();
  try {
    // Transfer logic
  } finally {
    second.unlock();
    first.unlock();
  }
}
```

**Timeout:**
```javascript
async function tryLock(mutex, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout);
  });
  
  try {
    await Promise.race([mutex.lock(), timeoutPromise]);
    return true;
  } catch {
    return false;
  }
}
```

### Livelock

**Definition:** Threads actively respond to each other but make no progress

**Example:**
```javascript
// Two people in hallway, both trying to be polite
// Person 1 moves left, Person 2 moves right
// Person 1 moves right, Person 2 moves left
// Repeat forever...

// Code example
async function politeThread1() {
  while (true) {
    if (resource.isHeldBy(thread2)) {
      await sleep(random());  // Back off
      continue;
    }
    await resource.acquire();
    break;
  }
}

async function politeThread2() {
  while (true) {
    if (resource.isHeldBy(thread1)) {
      await sleep(random());  // Back off
      continue;
    }
    await resource.acquire();
    break;
  }
}
```

**Solution:** Add randomization or priority

### Starvation

**Definition:** Thread never gets access to resource

**Example:**
```javascript
// High priority threads always run
// Low priority thread never gets CPU time

class PriorityQueue {
  constructor() {
    this.high = [];
    this.low = [];
  }
  
  enqueue(task, priority) {
    if (priority === 'high') {
      this.high.push(task);
    } else {
      this.low.push(task);
    }
  }
  
  dequeue() {
    // Always serve high priority first
    if (this.high.length > 0) {
      return this.high.shift();
    }
    return this.low.shift();  // May never execute!
  }
}
```

**Solution:** Aging or fair scheduling
```javascript
class FairQueue {
  constructor() {
    this.high = [];
    this.low = [];
    this.lowCounter = 0;
  }
  
  dequeue() {
    // Every 3 high priority, serve 1 low priority
    if (this.low.length > 0 && this.lowCounter >= 3) {
      this.lowCounter = 0;
      return this.low.shift();
    }
    
    if (this.high.length > 0) {
      this.lowCounter++;
      return this.high.shift();
    }
    
    return this.low.shift();
  }
}
```

## Concurrency Models

### Shared Memory

**Concept:** Threads share memory, use locks for synchronization

**Pros:**
- Fast communication
- Easy to share data
- Efficient for tightly coupled tasks

**Cons:**
- Race conditions
- Deadlocks
- Hard to reason about
- Difficult to debug

**Example:**
```javascript
// Shared counter
let counter = 0;
const mutex = new Mutex();

async function increment() {
  await mutex.lock();
  counter++;
  mutex.unlock();
}

// Multiple threads call increment()
```

### Message Passing

**Concept:** Threads communicate by sending messages, no shared state

**Pros:**
- No race conditions
- No deadlocks (if designed well)
- Easier to reason about
- Natural for distributed systems

**Cons:**
- Message overhead
- Copying data
- More complex for tightly coupled tasks

**Example:**
```javascript
// Actor model
class Actor {
  constructor() {
    this.mailbox = [];
    this.state = {};
  }
  
  async send(message) {
    this.mailbox.push(message);
    this.process();
  }
  
  async process() {
    while (this.mailbox.length > 0) {
      const message = this.mailbox.shift();
      await this.handleMessage(message);
    }
  }
  
  async handleMessage(message) {
    // Override in subclass
  }
}

class Counter extends Actor {
  constructor() {
    super();
    this.state.count = 0;
  }
  
  async handleMessage(message) {
    if (message.type === 'increment') {
      this.state.count++;
    } else if (message.type === 'get') {
      message.reply(this.state.count);
    }
  }
}
```

### Event Loop

**Concept:** Single thread processes events from queue

**Characteristics:**
- No parallelism (single thread)
- Concurrency through async operations
- No race conditions on single-threaded code
- Non-blocking I/O

**JavaScript Event Loop:**
```
┌───────────────────────────┐
│        Call Stack         │
└───────────────────────────┘
            ↑
            │
┌───────────────────────────┐
│      Microtask Queue      │ (Promises, queueMicrotask)
└───────────────────────────┘
            ↑
            │
┌───────────────────────────┐
│      Macrotask Queue      │ (setTimeout, setInterval, I/O)
└───────────────────────────┘
```

**Example:**
```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
// Explanation:
// 1. Synchronous: 1, 4
// 2. Microtasks: 3 (Promise)
// 3. Macrotasks: 2 (setTimeout)
```

### CSP (Communicating Sequential Processes)

**Concept:** Processes communicate through channels

**Example (Go-style):**
```javascript
// Conceptual JavaScript implementation
class Channel {
  constructor() {
    this.queue = [];
    this.receivers = [];
  }
  
  async send(value) {
    if (this.receivers.length > 0) {
      const receiver = this.receivers.shift();
      receiver(value);
    } else {
      await new Promise(resolve => {
        this.queue.push({ value, resolve });
      });
    }
  }
  
  async receive() {
    if (this.queue.length > 0) {
      const { value, resolve } = this.queue.shift();
      resolve();
      return value;
    } else {
      return new Promise(resolve => {
        this.receivers.push(resolve);
      });
    }
  }
}

// Usage
const channel = new Channel();

async function producer() {
  for (let i = 0; i < 10; i++) {
    await channel.send(i);
  }
}

async function consumer() {
  while (true) {
    const value = await channel.receive();
    console.log('Received:', value);
  }
}
```

## JavaScript Concurrency

### Single-Threaded Nature

**JavaScript is single-threaded but concurrent:**
```javascript
// This doesn't block
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// This runs immediately
console.log('Request sent');

// Output:
// "Request sent"
// (later) data from API
```

**How it works:**
```
1. fetch() initiates HTTP request (delegated to browser/Node.js)
2. JavaScript continues executing
3. When response arrives, callback added to task queue
4. Event loop picks up callback when call stack is empty
```

### Async/Await

**Syntactic sugar over Promises:**
```javascript
// Promise chain
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      return fetch(`/api/posts/${user.id}`);
    })
    .then(response => response.json())
    .then(posts => {
      return { user, posts };
    });
}

// Async/await (same behavior, cleaner syntax)
async function fetchUserData(userId) {
  const userResponse = await fetch(`/api/users/${userId}`);
  const user = await userResponse.json();
  
  const postsResponse = await fetch(`/api/posts/${user.id}`);
  const posts = await postsResponse.json();
  
  return { user, posts };
}
```

**Error Handling:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('HTTP error');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}
```

### Concurrent Operations

**Sequential (slow):**
```javascript
async function fetchAll() {
  const user = await fetchUser();      // Wait
  const posts = await fetchPosts();    // Wait
  const comments = await fetchComments(); // Wait
  return { user, posts, comments };
}
// Total time: T1 + T2 + T3
```

**Concurrent (fast):**
```javascript
async function fetchAll() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}
// Total time: max(T1, T2, T3)
```

**Promise Combinators:**
```javascript
// Promise.all - Wait for all, fail if any fails
const results = await Promise.all([p1, p2, p3]);

// Promise.allSettled - Wait for all, never fails
const results = await Promise.allSettled([p1, p2, p3]);
// [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]

// Promise.race - First to complete
const result = await Promise.race([p1, p2, p3]);

// Promise.any - First to succeed
const result = await Promise.any([p1, p2, p3]);
```

## Web Workers

### Purpose

**Run JavaScript in background thread:**
- CPU-intensive tasks
- Don't block main thread
- No access to DOM
- Message passing communication

### Basic Usage

**Main Thread:**
```javascript
// Create worker
const worker = new Worker('worker.js');

// Send message
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });

// Receive message
worker.onmessage = (event) => {
  console.log('Result:', event.data);
};

// Handle errors
worker.onerror = (error) => {
  console.error('Worker error:', error);
};

// Terminate worker
worker.terminate();
```

**Worker Thread (worker.js):**
```javascript
// Receive message
self.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'calculate') {
    // CPU-intensive calculation
    const result = data.reduce((sum, n) => sum + n, 0);
    
    // Send result back
    self.postMessage(result);
  }
};
```

### Shared Workers

**Shared across multiple tabs/windows:**
```javascript
// Main thread
const worker = new SharedWorker('shared-worker.js');

worker.port.onmessage = (event) => {
  console.log('Received:', event.data);
};

worker.port.postMessage('Hello from tab');

// Shared worker
self.onconnect = (event) => {
  const port = event.ports[0];
  
  port.onmessage = (event) => {
    console.log('Received:', event.data);
    port.postMessage('Hello from worker');
  };
};
```

### Transferable Objects

**Transfer ownership instead of copying:**
```javascript
// Create large array buffer
const buffer = new ArrayBuffer(1024 * 1024 * 10); // 10MB

// Transfer (fast, no copy)
worker.postMessage({ buffer }, [buffer]);
// buffer is now unusable in main thread

// vs. Clone (slow, copies data)
worker.postMessage({ buffer });
// buffer still usable but data was copied
```

### Worker Patterns

**Task Queue:**
```javascript
class WorkerPool {
  constructor(workerScript, poolSize) {
    this.workers = [];
    this.taskQueue = [];
    this.availableWorkers = [];
    
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (event) => this.handleResult(worker, event);
      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }
  
  async execute(task) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ task, resolve, reject });
      this.processQueue();
    });
  }
  
  processQueue() {
    while (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const { task, resolve, reject } = this.taskQueue.shift();
      const worker = this.availableWorkers.shift();
      
      worker.currentTask = { resolve, reject };
      worker.postMessage(task);
    }
  }
  
  handleResult(worker, event) {
    const { resolve } = worker.currentTask;
    resolve(event.data);
    
    this.availableWorkers.push(worker);
    this.processQueue();
  }
  
  terminate() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// Usage
const pool = new WorkerPool('worker.js', 4);

async function processData(items) {
  const results = await Promise.all(
    items.map(item => pool.execute({ type: 'process', data: item }))
  );
  return results;
}
```

## Async Patterns

### Callback Pattern

**Traditional async pattern:**
```javascript
function fetchData(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(null, JSON.parse(xhr.responseText));
    } else {
      callback(new Error('HTTP error'));
    }
  };
  xhr.onerror = () => callback(new Error('Network error'));
  xhr.send();
}

// Usage (callback hell)
fetchData('/api/user', (err, user) => {
  if (err) return console.error(err);
  
  fetchData(`/api/posts/${user.id}`, (err, posts) => {
    if (err) return console.error(err);
    
    fetchData(`/api/comments/${posts[0].id}`, (err, comments) => {
      if (err) return console.error(err);
      console.log(comments);
    });
  });
});
```

### Promise Pattern

**Modern async pattern:**
```javascript
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('HTTP error'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send();
  });
}

// Usage (flat chain)
fetchData('/api/user')
  .then(user => fetchData(`/api/posts/${user.id}`))
  .then(posts => fetchData(`/api/comments/${posts[0].id}`))
  .then(comments => console.log(comments))
  .catch(error => console.error(error));
```

### Observable Pattern

**Stream of values over time:**
```javascript
class Observable {
  constructor(subscribe) {
    this.subscribe = subscribe;
  }
  
  static fromEvent(element, event) {
    return new Observable(observer => {
      const handler = (e) => observer.next(e);
      element.addEventListener(event, handler);
      
      return () => element.removeEventListener(event, handler);
    });
  }
  
  map(fn) {
    return new Observable(observer => {
      return this.subscribe({
        next: value => observer.next(fn(value)),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }
  
  filter(fn) {
    return new Observable(observer => {
      return this.subscribe({
        next: value => fn(value) && observer.next(value),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }
}

// Usage
const clicks = Observable.fromEvent(button, 'click');
const doubleClicks = clicks
  .map(e => e.timeStamp)
  .filter((time, prev) => time - prev < 300);

doubleClicks.subscribe({
  next: time => console.log('Double click at', time)
});
```

### Generator Pattern

**Pausable functions:**
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Usage
const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3

// Async generators
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    if (data.length === 0) break;
    
    yield data;
    page++;
  }
}

// Usage
for await (const page of fetchPages('/api/items')) {
  console.log('Page:', page);
}
```

### Async Iterator Pattern

**Iterate over async data:**
```javascript
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.resolvers = [];
    this.done = false;
  }
  
  push(value) {
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value, done: false });
    } else {
      this.queue.push(value);
    }
  }
  
  close() {
    this.done = true;
    this.resolvers.forEach(resolve => {
      resolve({ done: true });
    });
    this.resolvers = [];
  }
  
  [Symbol.asyncIterator]() {
    return {
      next: () => {
        if (this.queue.length > 0) {
          return Promise.resolve({
            value: this.queue.shift(),
            done: false
          });
        }
        
        if (this.done) {
          return Promise.resolve({ done: true });
        }
        
        return new Promise(resolve => {
          this.resolvers.push(resolve);
        });
      }
    };
  }
}

// Usage
const queue = new AsyncQueue();

// Producer
setInterval(() => {
  queue.push(Date.now());
}, 1000);

// Consumer
(async () => {
  for await (const timestamp of queue) {
    console.log('Received:', timestamp);
  }
})();
```

## Performance Considerations

### Amdahl's Law

**Theoretical speedup with parallelization:**
```
Speedup = 1 / ((1 - P) + P/N)

Where:
- P = Portion that can be parallelized
- N = Number of processors
```

**Example:**
```
Program: 75% parallelizable, 25% sequential

With 4 cores:
Speedup = 1 / ((1 - 0.75) + 0.75/4)
        = 1 / (0.25 + 0.1875)
        = 1 / 0.4375
        = 2.29x

With infinite cores:
Speedup = 1 / (1 - 0.75)
        = 1 / 0.25
        = 4x (maximum possible)
```

**Implications:**
- Sequential portion limits speedup
- Adding more cores has diminishing returns
- Focus on reducing sequential portion

### Task Granularity

**Coarse-Grained (Large Tasks):**
```javascript
// Process entire array in one worker
worker.postMessage({
  type: 'processAll',
  data: largeArray
});

// Pros: Low overhead
// Cons: Poor load balancing, long tasks
```

**Fine-Grained (Small Tasks):**
```javascript
// Process each item separately
for (const item of largeArray) {
  worker.postMessage({
    type: 'processOne',
    data: item
  });
}

// Pros: Good load balancing
// Cons: High overhead, many messages
```

**Optimal (Chunked):**
```javascript
// Process in chunks
const chunkSize = Math.ceil(largeArray.length / workerCount);
for (let i = 0; i < largeArray.length; i += chunkSize) {
  const chunk = largeArray.slice(i, i + chunkSize);
  worker.postMessage({
    type: 'processChunk',
    data: chunk
  });
}

// Pros: Balance between overhead and load balancing
```

### Context Switching

**Cost of switching between tasks:**
```
Context Switch Overhead:
1. Save current state (registers, stack pointer)
2. Load new state
3. Flush CPU caches
4. TLB flush

Time: ~1-10 microseconds per switch
```

**Minimize Context Switches:**
```javascript
// Bad: Many small async operations
for (let i = 0; i < 1000; i++) {
  await processItem(i);  // Context switch each iteration
}

// Good: Batch operations
const batch = [];
for (let i = 0; i < 1000; i++) {
  batch.push(processItem(i));
  
  if (batch.length === 100) {
    await Promise.all(batch);
    batch.length = 0;
  }
}
if (batch.length > 0) {
  await Promise.all(batch);
}
```

### Memory Overhead

**Thread/Worker Memory:**
```
Each thread/worker has:
- Stack (typically 1-8 MB)
- Thread-local storage
- Control structures

Example:
1000 threads × 2 MB stack = 2 GB memory
```

**Optimization:**
```javascript
// Bad: Create worker per task
async function processTasks(tasks) {
  const results = await Promise.all(
    tasks.map(task => {
      const worker = new Worker('worker.js');
      return new Promise(resolve => {
        worker.onmessage = (e) => {
          resolve(e.data);
          worker.terminate();
        };
        worker.postMessage(task);
      });
    })
  );
  return results;
}

// Good: Reuse worker pool
const pool = new WorkerPool('worker.js', 4);
async function processTasks(tasks) {
  const results = await Promise.all(
    tasks.map(task => pool.execute(task))
  );
  return results;
}
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

**Q: What's the difference between concurrency and parallelism?**

A: Concurrency is about dealing with multiple tasks at once (structure), while parallelism is about executing multiple tasks simultaneously (execution). Concurrency can exist on a single core through time-slicing, but parallelism requires multiple cores. JavaScript is concurrent (event loop) but not parallel (single-threaded), except with Web Workers.

**Q: Explain the JavaScript event loop.**

A: The event loop continuously checks the call stack and task queues. When the call stack is empty, it processes microtasks (Promises) first, then macrotasks (setTimeout, I/O). This enables non-blocking async operations on a single thread.

**Q: What causes a deadlock and how do you prevent it?**

A: Deadlock occurs when threads wait for each other in a cycle. Four conditions must be met: mutual exclusion, hold and wait, no preemption, and circular wait. Prevention strategies include ordered locking (always acquire locks in same order), timeouts, and deadlock detection with recovery.

**Q: When should you use Web Workers?**

A: Use Web Workers for CPU-intensive tasks that would block the main thread (image processing, data parsing, complex calculations). Don't use for I/O operations (already non-blocking) or DOM manipulation (workers can't access DOM). Consider the overhead of message passing.

**Q: Explain race conditions and how to prevent them.**

A: Race conditions occur when outcome depends on timing of uncontrollable events, typically when multiple threads access shared state without synchronization. Prevention: use locks/mutexes for mutual exclusion, atomic operations, or avoid shared state entirely (message passing, immutable data).

---

[← Back to Compiler Theory](./10-compiler-theory.md) | [Next: Design Patterns →](./04-design-patterns.md)
