# Asynchronous JavaScript - Complete Guide
## From Callbacks to Async/Await

[← Back to ES6+ Features](./07-es6-features.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)

---

## 📋 Table of Contents

1. [Async Fundamentals](#async-fundamentals)
2. [Event Loop Deep Dive](#event-loop-deep-dive)
3. [Callbacks](#callbacks)
4. [Promises](#promises)
5. [Async/Await](#async-await)
6. [Error Handling](#error-handling)
7. [Concurrency Patterns](#concurrency-patterns)
8. [Performance Optimization](#performance-optimization)
9. [Real-World Patterns](#real-world-patterns)
10. [Interview Questions](#interview-questions)
11. [Practice Problems](#practice-problems)

---

## 🎯 Learning Objectives

Master asynchronous JavaScript:
- Understand the event loop and call stack
- Work with callbacks, promises, and async/await
- Handle errors in async code
- Implement concurrency patterns
- Optimize async performance
- Apply async patterns to real-world problems

---

## Async Fundamentals

### What is Asynchronous Programming?

**English Definition:** Asynchronous programming allows code to run without blocking the main thread, enabling multiple operations to progress concurrently.

**Định nghĩa (Tiếng Việt):** Lập trình bất đồng bộ cho phép code chạy mà không chặn luồng chính, cho phép nhiều thao tác tiến hành đồng thời.


### Synchronous vs Asynchronous

```javascript
// ========================================
// SYNCHRONOUS CODE
// ========================================

console.log('Start');

function syncOperation() {
  // Blocks execution for 2 seconds
  const start = Date.now();
  while (Date.now() - start < 2000) {
    // Blocking operation
  }
  return 'Done';
}

console.log(syncOperation()); // Waits 2 seconds
console.log('End');

/*
Output (with 2 second pause):
Start
Done
End
*/

// ========================================
// ASYNCHRONOUS CODE
// ========================================

console.log('Start');

function asyncOperation() {
  setTimeout(() => {
    console.log('Done');
  }, 2000);
}

asyncOperation(); // Doesn't block
console.log('End');

/*
Output (immediate):
Start
End
Done (after 2 seconds)
*/
```

### Async Mind Map

```
Asynchronous JavaScript
│
├── Execution Model
│   ├── Call Stack
│   ├── Web APIs
│   ├── Callback Queue
│   └── Event Loop
│
├── Async Patterns
│   ├── Callbacks
│   ├── Promises
│   ├── Async/Await
│   └── Generators
│
├── Use Cases
│   ├── API calls
│   ├── File operations
│   ├── Timers
│   ├── Event handlers
│   └── Database queries
│
├── Error Handling
│   ├── try/catch
│   ├── .catch()
│   ├── Error boundaries
│   └── Promise rejection
│
└── Patterns
    ├── Sequential
    ├── Parallel
    ├── Race
    └── Waterfall
```

---

## Event Loop Deep Dive

### JavaScript Runtime Components

```
┌─────────────────────────────────────────┐
│           JavaScript Runtime            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Call Stack  │    │   Web APIs   │  │
│  │              │    │              │  │
│  │  function3() │    │ setTimeout() │  │
│  │  function2() │    │   fetch()    │  │
│  │  function1() │    │ addEventListener│
│  └──────────────┘    └──────────────┘  │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Microtask    │    │  Callback    │  │
│  │   Queue      │    │   Queue      │  │
│  │              │    │              │  │
│  │ Promise.then │    │ setTimeout   │  │
│  │ queueMicro   │    │ setInterval  │  │
│  └──────────────┘    └──────────────┘  │
│                                         │
│         ↑                               │
│    Event Loop                           │
└─────────────────────────────────────────┘
```

### Event Loop Visualization

```javascript
// ========================================
// EVENT LOOP EXAMPLE
// ========================================

console.log('1: Sync');

setTimeout(() => {
  console.log('2: setTimeout (macro task)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise (micro task)');
});

console.log('4: Sync');

/*
Output:
1: Sync
4: Sync
3: Promise (micro task)
2: setTimeout (macro task)

Explanation:
1. Synchronous code runs first (1, 4)
2. Microtasks run next (Promise)
3. Macrotasks run last (setTimeout)
*/
```

### Call Stack Execution

```javascript
function first() {
  console.log('First function');
  second();
  console.log('First function end');
}

function second() {
  console.log('Second function');
  third();
  console.log('Second function end');
}

function third() {
  console.log('Third function');
}

first();

/*
Call Stack Timeline:

Step 1:
┌──────────┐
│ first()  │
└──────────┘

Step 2:
┌──────────┐
│ second() │
├──────────┤
│ first()  │
└──────────┘

Step 3:
┌──────────┐
│ third()  │
├──────────┤
│ second() │
├──────────┤
│ first()  │
└──────────┘

Step 4:
┌──────────┐
│ second() │
├──────────┤
│ first()  │
└──────────┘

Step 5:
┌──────────┐
│ first()  │
└──────────┘

Step 6:
(empty)

Output:
First function
Second function
Third function
Second function end
First function end
*/
```

### Microtasks vs Macrotasks

```javascript
// ========================================
// TASK PRIORITY
// ========================================

console.log('Script start');

// Macrotask
setTimeout(() => {
  console.log('setTimeout 1');
}, 0);

// Microtask
Promise.resolve()
  .then(() => {
    console.log('Promise 1');
  })
  .then(() => {
    console.log('Promise 2');
  });

// Macrotask
setTimeout(() => {
  console.log('setTimeout 2');
  
  // Microtask inside macrotask
  Promise.resolve().then(() => {
    console.log('Promise 3');
  });
}, 0);

// Microtask
Promise.resolve().then(() => {
  console.log('Promise 4');
});

console.log('Script end');

/*
Output:
Script start
Script end
Promise 1
Promise 4
Promise 2
setTimeout 1
setTimeout 2
Promise 3

Execution Order:
1. Synchronous code (Script start, Script end)
2. All microtasks (Promise 1, 4, 2)
3. First macrotask (setTimeout 1)
4. Microtasks from that macrotask (none)
5. Second macrotask (setTimeout 2)
6. Microtasks from that macrotask (Promise 3)
*/
```

### Event Loop Algorithm

```javascript
/*
Event Loop Algorithm:

while (true) {
  // 1. Execute all synchronous code
  executeCallStack();
  
  // 2. Execute all microtasks
  while (microtaskQueue.length > 0) {
    const microtask = microtaskQueue.shift();
    execute(microtask);
  }
  
  // 3. Execute one macrotask
  if (macrotaskQueue.length > 0) {
    const macrotask = macrotaskQueue.shift();
    execute(macrotask);
  }
  
  // 4. Render if needed (in browser)
  if (needsRender()) {
    render();
  }
  
  // 5. Repeat
}
*/

// Practical demonstration
function demonstrateEventLoop() {
  console.log('1');
  
  setTimeout(() => console.log('2'), 0);
  
  Promise.resolve().then(() => console.log('3'));
  
  queueMicrotask(() => console.log('4'));
  
  console.log('5');
}

demonstrateEventLoop();
// Output: 1, 5, 3, 4, 2
```

---

## Callbacks

### Basic Callbacks

```javascript
// ========================================
// SIMPLE CALLBACK
// ========================================

function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'John' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log('Data received:', data);
});

// ========================================
// ERROR-FIRST CALLBACK (NODE.JS STYLE)
// ========================================

function readFile(filename, callback) {
  setTimeout(() => {
    const error = null; // or new Error('File not found')
    const data = 'File contents';
    
    callback(error, data);
  }, 1000);
}

readFile('file.txt', (error, data) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Data:', data);
});
```

### Callback Hell (Pyramid of Doom)

```javascript
// ========================================
// CALLBACK HELL EXAMPLE
// ========================================

// Bad: Nested callbacks
function getUserData(userId) {
  getUser(userId, (error, user) => {
    if (error) {
      console.error(error);
      return;
    }
    
    getOrders(user.id, (error, orders) => {
      if (error) {
        console.error(error);
        return;
      }
      
      getOrderDetails(orders[0].id, (error, details) => {
        if (error) {
          console.error(error);
          return;
        }
        
        getPaymentInfo(details.paymentId, (error, payment) => {
          if (error) {
            console.error(error);
            return;
          }
          
          console.log('Payment:', payment);
        });
      });
    });
  });
}

// Problems:
// 1. Hard to read (nested structure)
// 2. Hard to maintain
// 3. Error handling repeated
// 4. Hard to add features
```

### Callback Patterns

```javascript
// ========================================
// PATTERN 1: NAMED FUNCTIONS
// ========================================

function handleUser(error, user) {
  if (error) return handleError(error);
  getOrders(user.id, handleOrders);
}

function handleOrders(error, orders) {
  if (error) return handleError(error);
  getOrderDetails(orders[0].id, handleDetails);
}

function handleDetails(error, details) {
  if (error) return handleError(error);
  console.log('Details:', details);
}

function handleError(error) {
  console.error('Error:', error);
}

getUser(userId, handleUser);

// ========================================
// PATTERN 2: CALLBACK WRAPPER
// ========================================

function asyncWrapper(fn) {
  return function(...args) {
    const callback = args.pop();
    
    fn(...args)
      .then(result => callback(null, result))
      .catch(error => callback(error));
  };
}

// ========================================
// PATTERN 3: PARALLEL CALLBACKS
// ========================================

function parallel(tasks, callback) {
  let completed = 0;
  const results = [];
  let hasError = false;
  
  tasks.forEach((task, index) => {
    task((error, result) => {
      if (hasError) return;
      
      if (error) {
        hasError = true;
        return callback(error);
      }
      
      results[index] = result;
      completed++;
      
      if (completed === tasks.length) {
        callback(null, results);
      }
    });
  });
}

// Usage
parallel([
  (cb) => setTimeout(() => cb(null, 'Task 1'), 1000),
  (cb) => setTimeout(() => cb(null, 'Task 2'), 500),
  (cb) => setTimeout(() => cb(null, 'Task 3'), 1500)
], (error, results) => {
  console.log(results); // ['Task 1', 'Task 2', 'Task 3']
});
```

---

## Promises

### Promise Basics

```javascript
// ========================================
// CREATING PROMISES
// ========================================

// Simple promise
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    
    if (success) {
      resolve('Success!');
    } else {
      reject(new Error('Failed!'));
    }
  }, 1000);
});

// Using promise
promise
  .then(result => {
    console.log(result); // 'Success!'
  })
  .catch(error => {
    console.error(error);
  });

// ========================================
// PROMISE STATES
// ========================================

/*
Promise States:
1. Pending: Initial state
2. Fulfilled: Operation completed successfully
3. Rejected: Operation failed

State Transitions:
Pending → Fulfilled (via resolve)
Pending → Rejected (via reject)

Once settled (fulfilled or rejected), state cannot change
*/

// ========================================
// PROMISE CHAINING
// ========================================

function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John' });
    }, 1000);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, userId, total: 100 }]);
    }, 1000);
  });
}

function fetchOrderDetails(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: orderId, items: ['Item 1', 'Item 2'] });
    }, 1000);
  });
}

// Chaining promises
fetchUser(1)
  .then(user => {
    console.log('User:', user);
    return fetchOrders(user.id);
  })
  .then(orders => {
    console.log('Orders:', orders);
    return fetchOrderDetails(orders[0].id);
  })
  .then(details => {
    console.log('Details:', details);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Promise Methods

```javascript
// ========================================
// PROMISE.ALL
// ========================================

// Waits for all promises to resolve
const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const promise3 = Promise.resolve(3);

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log(results); // [1, 2, 3]
  });

// If any promise rejects, Promise.all rejects
const failing = Promise.reject(new Error('Failed'));
Promise.all([promise1, failing, promise3])
  .then(results => {
    console.log(results); // Won't execute
  })
  .catch(error => {
    console.error(error); // Error: Failed
  });

// ========================================
// PROMISE.ALLSETTLED
// ========================================

// Waits for all promises to settle (resolve or reject)
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error('Failed')),
  Promise.resolve(3)
])
  .then(results => {
    console.log(results);
    /*
    [
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: Error: Failed },
      { status: 'fulfilled', value: 3 }
    ]
    */
  });

// ========================================
// PROMISE.RACE
// ========================================

// Returns first promise to settle
Promise.race([
  new Promise(resolve => setTimeout(() => resolve('slow'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 100))
])
  .then(result => {
    console.log(result); // 'fast'
  });

// ========================================
// PROMISE.ANY
// ========================================

// Returns first promise to fulfill
Promise.any([
  Promise.reject(new Error('Error 1')),
  new Promise(resolve => setTimeout(() => resolve('Success'), 100)),
  Promise.reject(new Error('Error 2'))
])
  .then(result => {
    console.log(result); // 'Success'
  });

// If all reject, returns AggregateError
Promise.any([
  Promise.reject(new Error('Error 1')),
  Promise.reject(new Error('Error 2'))
])
  .catch(error => {
    console.error(error); // AggregateError
  });
```

### Advanced Promise Patterns

```javascript
// ========================================
// PATTERN 1: PROMISE RETRY
// ========================================

function retry(fn, maxAttempts = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attempt() {
      attempts++;
      
      fn()
        .then(resolve)
        .catch(error => {
          if (attempts >= maxAttempts) {
            reject(error);
          } else {
            console.log(`Attempt ${attempts} failed, retrying...`);
            setTimeout(attempt, delay);
          }
        });
    }
    
    attempt();
  });
}

// Usage
retry(() => fetch('https://api.example.com/data'), 3, 1000)
  .then(response => console.log('Success:', response))
  .catch(error => console.error('All attempts failed:', error));

// ========================================
// PATTERN 2: PROMISE TIMEOUT
// ========================================

function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout after ${ms}ms`));
      }, ms);
    })
  ]);
}

// Usage
timeout(fetch('https://api.example.com/data'), 5000)
  .then(response => console.log('Success:', response))
  .catch(error => console.error('Error:', error));

// ========================================
// PATTERN 3: PROMISE QUEUE
// ========================================

class PromiseQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  add(promiseFactory) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseFactory, resolve, reject });
      this.run();
    });
  }
  
  run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { promiseFactory, resolve, reject } = this.queue.shift();
      this.running++;
      
      promiseFactory()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;
          this.run();
        });
    }
  }
}

// Usage
const queue = new PromiseQueue(2); // Max 2 concurrent

for (let i = 0; i < 10; i++) {
  queue.add(() => {
    console.log(`Starting task ${i}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Completed task ${i}`);
        resolve(i);
      }, 1000);
    });
  });
}

// ========================================
// PATTERN 4: PROMISE MEMOIZATION
// ========================================

function memoizePromise(fn) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Returning cached promise');
      return cache.get(key);
    }
    
    const promise = fn(...args);
    cache.set(key, promise);
    
    // Remove from cache if rejected
    promise.catch(() => {
      cache.delete(key);
    });
    
    return promise;
  };
}

// Usage
const fetchUser = memoizePromise((id) => {
  console.log(`Fetching user ${id}`);
  return fetch(`https://api.example.com/users/${id}`)
    .then(res => res.json());
});

fetchUser(1); // Fetches
fetchUser(1); // Returns cached promise
fetchUser(1); // Returns cached promise
```


---

## Async/Await

### Async/Await Basics

```javascript
// ========================================
// BASIC ASYNC/AWAIT
// ========================================

// Async function always returns a promise
async function fetchData() {
  return 'Data';
}

fetchData().then(data => console.log(data)); // 'Data'

// Await pauses execution until promise resolves
async function getData() {
  const data = await fetchData();
  console.log(data); // 'Data'
}

// ========================================
// CONVERTING PROMISES TO ASYNC/AWAIT
// ========================================

// With Promises
function getUserPromise(id) {
  return fetchUser(id)
    .then(user => {
      return fetchOrders(user.id);
    })
    .then(orders => {
      return fetchOrderDetails(orders[0].id);
    })
    .then(details => {
      return details;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// With Async/Await
async function getUserAsync(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    const details = await fetchOrderDetails(orders[0].id);
    return details;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// ========================================
// ASYNC/AWAIT IS SYNTACTIC SUGAR
// ========================================

// This async function:
async function example() {
  const result = await somePromise();
  return result;
}

// Is equivalent to:
function example() {
  return somePromise().then(result => {
    return result;
  });
}
```

### Error Handling with Async/Await

```javascript
// ========================================
// TRY/CATCH
// ========================================

async function fetchUserData(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    return { user, orders };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ========================================
// MULTIPLE TRY/CATCH BLOCKS
// ========================================

async function processData() {
  let user;
  let orders;
  
  // Try to fetch user
  try {
    user = await fetchUser(1);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    user = { id: 1, name: 'Default User' };
  }
  
  // Try to fetch orders
  try {
    orders = await fetchOrders(user.id);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    orders = [];
  }
  
  return { user, orders };
}

// ========================================
// FINALLY BLOCK
// ========================================

async function fetchWithLoading(url) {
  showLoadingSpinner();
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  } finally {
    hideLoadingSpinner(); // Always executes
  }
}

// ========================================
// WRAPPER FOR ERROR HANDLING
// ========================================

function asyncHandler(fn) {
  return async function(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async error:', error);
      throw error;
    }
  };
}

// Usage
const safeFunction = asyncHandler(async (id) => {
  const data = await fetchData(id);
  return data;
});
```

### Parallel Execution

```javascript
// ========================================
// SEQUENTIAL (SLOW)
// ========================================

async function sequential() {
  const user = await fetchUser(1);      // Wait 1s
  const posts = await fetchPosts(1);    // Wait 1s
  const comments = await fetchComments(1); // Wait 1s
  
  return { user, posts, comments };
  // Total: 3 seconds
}

// ========================================
// PARALLEL (FAST)
// ========================================

async function parallel() {
  // Start all requests simultaneously
  const [user, posts, comments] = await Promise.all([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  
  return { user, posts, comments };
  // Total: 1 second (longest request)
}

// ========================================
// MIXED: SEQUENTIAL + PARALLEL
// ========================================

async function mixed() {
  // First, get user (required for next steps)
  const user = await fetchUser(1);
  
  // Then, fetch posts and comments in parallel
  const [posts, comments] = await Promise.all([
    fetchPosts(user.id),
    fetchComments(user.id)
  ]);
  
  return { user, posts, comments };
}

// ========================================
// PARALLEL WITH INDIVIDUAL ERROR HANDLING
// ========================================

async function parallelWithErrors() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  
  const user = results[0].status === 'fulfilled' 
    ? results[0].value 
    : null;
    
  const posts = results[1].status === 'fulfilled' 
    ? results[1].value 
    : [];
    
  const comments = results[2].status === 'fulfilled' 
    ? results[2].value 
    : [];
  
  return { user, posts, comments };
}
```

### Advanced Async/Await Patterns

```javascript
// ========================================
// PATTERN 1: ASYNC IIFE
// ========================================

(async () => {
  const data = await fetchData();
  console.log(data);
})();

// ========================================
// PATTERN 2: ASYNC ARRAY METHODS
// ========================================

// Sequential processing
async function processSequential(items) {
  const results = [];
  
  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }
  
  return results;
}

// Parallel processing
async function processParallel(items) {
  const promises = items.map(item => processItem(item));
  return await Promise.all(promises);
}

// Parallel with concurrency limit
async function processWithLimit(items, limit) {
  const results = [];
  
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// ========================================
// PATTERN 3: ASYNC REDUCE
// ========================================

async function asyncReduce(array, asyncFn, initialValue) {
  let accumulator = initialValue;
  
  for (const item of array) {
    accumulator = await asyncFn(accumulator, item);
  }
  
  return accumulator;
}

// Usage
const numbers = [1, 2, 3, 4, 5];
const sum = await asyncReduce(
  numbers,
  async (acc, num) => {
    await delay(100);
    return acc + num;
  },
  0
);

// ========================================
// PATTERN 4: ASYNC RETRY WITH BACKOFF
// ========================================

async function retryWithBackoff(
  fn,
  maxRetries = 3,
  baseDelay = 1000,
  maxDelay = 10000
) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, 8s...
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Usage
const data = await retryWithBackoff(
  () => fetch('https://api.example.com/data'),
  3,
  1000
);

// ========================================
// PATTERN 5: ASYNC WATERFALL
// ========================================

async function waterfall(tasks) {
  let result;
  
  for (const task of tasks) {
    result = await task(result);
  }
  
  return result;
}

// Usage
const result = await waterfall([
  async () => {
    const user = await fetchUser(1);
    return user;
  },
  async (user) => {
    const orders = await fetchOrders(user.id);
    return { user, orders };
  },
  async (data) => {
    const details = await fetchOrderDetails(data.orders[0].id);
    return { ...data, details };
  }
]);
```

---

## Error Handling

### Comprehensive Error Handling

```javascript
// ========================================
// CUSTOM ERROR CLASSES
// ========================================

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

// ========================================
// ERROR HANDLING STRATEGIES
// ========================================

async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NetworkError(
        `HTTP error: ${response.statusText}`,
        response.status
      );
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
      
      if (error.statusCode === 404) {
        return null; // Resource not found
      } else if (error.statusCode >= 500) {
        throw error; // Server error, propagate
      }
    } else if (error instanceof SyntaxError) {
      console.error('Invalid JSON:', error);
      throw new ValidationError('Invalid response format', 'json');
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
}

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

class AsyncErrorHandler {
  constructor() {
    this.handlers = new Map();
  }
  
  register(errorType, handler) {
    this.handlers.set(errorType, handler);
  }
  
  async handle(error) {
    const handler = this.handlers.get(error.constructor);
    
    if (handler) {
      return await handler(error);
    }
    
    // Default handler
    console.error('Unhandled error:', error);
    throw error;
  }
  
  wrap(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        return await this.handle(error);
      }
    };
  }
}

// Usage
const errorHandler = new AsyncErrorHandler();

errorHandler.register(NetworkError, async (error) => {
  console.error('Network error:', error.message);
  // Log to monitoring service
  await logToMonitoring(error);
  return null;
});

errorHandler.register(ValidationError, async (error) => {
  console.error('Validation error:', error.message);
  return { error: error.message, field: error.field };
});

const safeFetch = errorHandler.wrap(fetchWithErrorHandling);
```

### Promise Error Patterns

```javascript
// ========================================
// PATTERN 1: CATCH AND CONTINUE
// ========================================

async function fetchMultipleWithFallback(urls) {
  const results = await Promise.all(
    urls.map(url => 
      fetch(url)
        .then(res => res.json())
        .catch(error => {
          console.error(`Failed to fetch ${url}:`, error);
          return null; // Continue with null
        })
    )
  );
  
  return results.filter(result => result !== null);
}

// ========================================
// PATTERN 2: FAIL FAST
// ========================================

async function fetchMultipleFailFast(urls) {
  // If any fails, all fail
  const responses = await Promise.all(
    urls.map(url => fetch(url))
  );
  
  return await Promise.all(
    responses.map(res => res.json())
  );
}

// ========================================
// PATTERN 3: PARTIAL SUCCESS
// ========================================

async function fetchMultiplePartial(urls) {
  const results = await Promise.allSettled(
    urls.map(url => fetch(url).then(res => res.json()))
  );
  
  return {
    successful: results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value),
    failed: results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason)
  };
}
```

---

## Concurrency Patterns

### Pattern 1: Rate Limiting

```javascript
// ========================================
// TOKEN BUCKET RATE LIMITER
// ========================================

class RateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.queue = [];
    
    // Refill tokens periodically
    setInterval(() => {
      this.tokens = Math.min(this.maxTokens, this.tokens + 1);
      this.processQueue();
    }, refillRate);
  }
  
  async execute(fn) {
    if (this.tokens > 0) {
      this.tokens--;
      return await fn();
    }
    
    // Wait in queue
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
    });
  }
  
  async processQueue() {
    while (this.tokens > 0 && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      this.tokens--;
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
  }
}

// Usage
const limiter = new RateLimiter(5, 1000); // 5 requests per second

for (let i = 0; i < 20; i++) {
  limiter.execute(() => {
    console.log(`Request ${i} at ${Date.now()}`);
    return fetch(`https://api.example.com/data/${i}`);
  });
}
```

### Pattern 2: Concurrent Pool

```javascript
// ========================================
// CONCURRENT EXECUTION POOL
// ========================================

class ConcurrentPool {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }
  
  async run(fn) {
    while (this.running >= this.maxConcurrent) {
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
  
  async runAll(tasks) {
    return await Promise.all(
      tasks.map(task => this.run(task))
    );
  }
}

// Usage
const pool = new ConcurrentPool(3); // Max 3 concurrent

const tasks = Array.from({ length: 10 }, (_, i) => 
  () => {
    console.log(`Starting task ${i}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Completed task ${i}`);
        resolve(i);
      }, 1000);
    });
  }
);

const results = await pool.runAll(tasks);
console.log('All tasks completed:', results);
```

### Pattern 3: Circuit Breaker

```javascript
// ========================================
// CIRCUIT BREAKER PATTERN
// ========================================

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failures++;
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.log(`Circuit breaker opened. Retry after ${this.timeout}ms`);
    }
  }
  
  getState() {
    return this.state;
  }
}

// Usage
const breaker = new CircuitBreaker(3, 5000);

async function makeRequest() {
  try {
    return await breaker.execute(() => 
      fetch('https://api.example.com/data')
    );
  } catch (error) {
    console.error('Request failed:', error.message);
    return null;
  }
}
```

### Pattern 4: Debounce and Throttle (Async)

```javascript
// ========================================
// ASYNC DEBOUNCE
// ========================================

function debounceAsync(fn, delay) {
  let timeoutId;
  let pendingPromise;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
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
          }
        }, delay);
      });
    }
    
    return pendingPromise;
  };
}

// Usage
const debouncedSearch = debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return await response.json();
}, 300);

// ========================================
// ASYNC THROTTLE
// ========================================

function throttleAsync(fn, limit) {
  let inThrottle;
  let lastResult;
  
  return async function(...args) {
    if (!inThrottle) {
      inThrottle = true;
      
      try {
        lastResult = await fn(...args);
      } finally {
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    }
    
    return lastResult;
  };
}

// Usage
const throttledFetch = throttleAsync(async (url) => {
  const response = await fetch(url);
  return await response.json();
}, 1000);
```

---

## Performance Optimization

### Optimization Techniques

```javascript
// ========================================
// TECHNIQUE 1: LAZY LOADING
// ========================================

class LazyLoader {
  constructor() {
    this.cache = new Map();
  }
  
  async load(key, loader) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const promise = loader();
    this.cache.set(key, promise);
    
    try {
      const result = await promise;
      this.cache.set(key, result);
      return result;
    } catch (error) {
      this.cache.delete(key);
      throw error;
    }
  }
}

// Usage
const loader = new LazyLoader();

async function getUser(id) {
  return await loader.load(`user-${id}`, () => 
    fetch(`/api/users/${id}`).then(r => r.json())
  );
}

// ========================================
// TECHNIQUE 2: PREFETCHING
// ========================================

class Prefetcher {
  constructor() {
    this.cache = new Map();
  }
  
  prefetch(key, loader) {
    if (!this.cache.has(key)) {
      this.cache.set(key, loader());
    }
  }
  
  async get(key, loader) {
    if (this.cache.has(key)) {
      return await this.cache.get(key);
    }
    
    const promise = loader();
    this.cache.set(key, promise);
    return await promise;
  }
}

// Usage
const prefetcher = new Prefetcher();

// Prefetch data before it's needed
prefetcher.prefetch('user-1', () => fetchUser(1));
prefetcher.prefetch('posts-1', () => fetchPosts(1));

// Later, get the data (already loading or loaded)
const user = await prefetcher.get('user-1', () => fetchUser(1));
const posts = await prefetcher.get('posts-1', () => fetchPosts(1));

// ========================================
// TECHNIQUE 3: BATCH REQUESTS
// ========================================

class RequestBatcher {
  constructor(batchFn, delay = 10) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timeoutId = null;
  }
  
  request(id) {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, resolve, reject });
      
      if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.flush();
        }, this.delay);
      }
    });
  }
  
  async flush() {
    const batch = this.queue.splice(0);
    this.timeoutId = null;
    
    if (batch.length === 0) return;
    
    try {
      const ids = batch.map(item => item.id);
      const results = await this.batchFn(ids);
      
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}

// Usage
const userBatcher = new RequestBatcher(async (ids) => {
  const response = await fetch('/api/users/batch', {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
  return await response.json();
});

// Multiple requests batched into one
const user1 = userBatcher.request(1);
const user2 = userBatcher.request(2);
const user3 = userBatcher.request(3);

const [u1, u2, u3] = await Promise.all([user1, user2, user3]);
// Only one HTTP request made!
```

### Caching Strategies

```javascript
// ========================================
// LRU CACHE FOR ASYNC OPERATIONS
// ========================================

class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add to end
    this.cache.set(key, value);
    
    // Remove oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// Usage with async functions
const cache = new LRUCache(50);

async function fetchWithCache(url) {
  if (cache.has(url)) {
    console.log('Cache hit:', url);
    return cache.get(url);
  }
  
  console.log('Cache miss:', url);
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, data);
  return data;
}
```


---

## Real-World Patterns

### Pattern 1: API Client with Retry and Cache

```javascript
// ========================================
// PRODUCTION-READY API CLIENT
// ========================================

class APIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.maxRetries = options.maxRetries || 3;
    this.timeout = options.timeout || 5000;
    this.cacheTTL = options.cacheTTL || 60000;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);
    
    // Check cache
    if (options.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    // Make request with retry
    const data = await this.retryRequest(url, options);
    
    // Cache result
    if (options.cache !== false) {
      this.setCache(cacheKey, data);
    }
    
    return data;
  }
  
  async retryRequest(url, options, attempt = 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      if (attempt < this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retry attempt ${attempt} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(url, options, attempt + 1);
      }
      
      throw error;
    }
  }
  
  getCacheKey(url, options) {
    return `${url}-${JSON.stringify(options)}`;
  }
  
  getFromCache(key) {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }
    
    this.cache.delete(key);
    return null;
  }
  
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clearCache() {
    this.cache.clear();
  }
  
  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Usage
const api = new APIClient('https://api.example.com', {
  maxRetries: 3,
  timeout: 5000,
  cacheTTL: 60000
});

const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
```

### Pattern 2: Data Fetching with Loading States

```javascript
// ========================================
// ASYNC STATE MANAGER
// ========================================

class AsyncStateManager {
  constructor() {
    this.state = {
      data: null,
      loading: false,
      error: null
    };
    this.listeners = [];
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  async execute(asyncFn) {
    this.state = {
      data: null,
      loading: true,
      error: null
    };
    this.notify();
    
    try {
      const data = await asyncFn();
      this.state = {
        data,
        loading: false,
        error: null
      };
    } catch (error) {
      this.state = {
        data: null,
        loading: false,
        error
      };
    }
    
    this.notify();
    return this.state;
  }
  
  getState() {
    return this.state;
  }
}

// Usage
const userState = new AsyncStateManager();

userState.subscribe((state) => {
  if (state.loading) {
    console.log('Loading...');
  } else if (state.error) {
    console.error('Error:', state.error);
  } else {
    console.log('Data:', state.data);
  }
});

await userState.execute(() => fetchUser(1));
```

### Pattern 3: Polling with Exponential Backoff

```javascript
// ========================================
// SMART POLLING
// ========================================

class Poller {
  constructor(fn, options = {}) {
    this.fn = fn;
    this.interval = options.interval || 1000;
    this.maxInterval = options.maxInterval || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 1.5;
    this.shouldStop = options.shouldStop || (() => false);
    this.onSuccess = options.onSuccess || (() => {});
    this.onError = options.onError || (() => {});
    
    this.currentInterval = this.interval;
    this.isPolling = false;
    this.timeoutId = null;
  }
  
  start() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.currentInterval = this.interval;
    this.poll();
  }
  
  stop() {
    this.isPolling = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
  
  async poll() {
    if (!this.isPolling) return;
    
    try {
      const result = await this.fn();
      this.onSuccess(result);
      
      if (this.shouldStop(result)) {
        this.stop();
        return;
      }
      
      // Reset interval on success
      this.currentInterval = this.interval;
      
    } catch (error) {
      this.onError(error);
      
      // Increase interval on error (exponential backoff)
      this.currentInterval = Math.min(
        this.currentInterval * this.backoffMultiplier,
        this.maxInterval
      );
    }
    
    // Schedule next poll
    this.timeoutId = setTimeout(() => this.poll(), this.currentInterval);
  }
}

// Usage: Poll job status until complete
const poller = new Poller(
  () => fetch('/api/job/123').then(r => r.json()),
  {
    interval: 1000,
    maxInterval: 30000,
    shouldStop: (result) => result.status === 'complete',
    onSuccess: (result) => console.log('Job status:', result.status),
    onError: (error) => console.error('Poll error:', error)
  }
);

poller.start();

// Stop polling when done
// poller.stop();
```

### Pattern 4: WebSocket with Reconnection

```javascript
// ========================================
// RESILIENT WEBSOCKET
// ========================================

class ResilientWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.maxReconnectAttempts = options.maxReconnectAttempts || Infinity;
    this.reconnectInterval = options.reconnectInterval || 1000;
    this.maxReconnectInterval = options.maxReconnectInterval || 30000;
    
    this.ws = null;
    this.reconnectAttempts = 0;
    this.messageQueue = [];
    this.listeners = {
      open: [],
      message: [],
      error: [],
      close: []
    };
    
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = (event) => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Send queued messages
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        this.ws.send(message);
      }
      
      this.emit('open', event);
    };
    
    this.ws.onmessage = (event) => {
      this.emit('message', event);
    };
    
    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      this.emit('error', event);
    };
    
    this.ws.onclose = (event) => {
      console.log('WebSocket closed');
      this.emit('close', event);
      this.reconnect();
    };
  }
  
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectInterval
    );
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(data);
    }
  }
  
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  close() {
    this.maxReconnectAttempts = 0; // Prevent reconnection
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const ws = new ResilientWebSocket('wss://api.example.com/ws');

ws.on('open', () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));
});

ws.on('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
});

ws.on('error', (error) => {
  console.error('Error:', error);
});
```

### Pattern 5: Async Queue with Priority

```javascript
// ========================================
// PRIORITY QUEUE
// ========================================

class PriorityQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  add(fn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.run();
    });
  }
  
  async run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      this.running++;
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.running--;
        this.run();
      }
    }
  }
  
  clear() {
    this.queue = [];
  }
  
  size() {
    return this.queue.length;
  }
}

// Usage
const queue = new PriorityQueue(2);

// High priority tasks
queue.add(() => fetchCriticalData(), 10);
queue.add(() => fetchImportantData(), 10);

// Normal priority tasks
queue.add(() => fetchNormalData(), 5);
queue.add(() => fetchNormalData(), 5);

// Low priority tasks
queue.add(() => fetchOptionalData(), 1);
queue.add(() => fetchOptionalData(), 1);
```

---

## Interview Questions

### Q1: Explain the Event Loop

**Answer:**

The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

**Components:**
1. **Call Stack:** Executes synchronous code
2. **Web APIs:** Handle async operations (setTimeout, fetch, etc.)
3. **Callback Queue (Macrotask Queue):** Holds callbacks from Web APIs
4. **Microtask Queue:** Holds Promise callbacks and queueMicrotask
5. **Event Loop:** Coordinates execution

**Execution Order:**
1. Execute all synchronous code (call stack)
2. Execute all microtasks (Promise.then, queueMicrotask)
3. Execute one macrotask (setTimeout, setInterval)
4. Repeat

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
```

### Q2: What's the difference between Promises and Async/Await?

**Answer:**

**Promises:**
- Explicit promise chaining with `.then()`
- Error handling with `.catch()`
- Can be more verbose

```javascript
fetchUser(1)
  .then(user => fetchOrders(user.id))
  .then(orders => console.log(orders))
  .catch(error => console.error(error));
```

**Async/Await:**
- Syntactic sugar over promises
- Looks like synchronous code
- Error handling with try/catch
- More readable

```javascript
async function getOrders() {
  try {
    const user = await fetchUser(1);
    const orders = await fetchOrders(user.id);
    console.log(orders);
  } catch (error) {
    console.error(error);
  }
}
```

**Key Points:**
- Async/await is built on promises
- Async functions always return promises
- Await can only be used in async functions
- Both handle asynchronous operations

### Q3: How do you handle multiple async operations?

**Answer:**

**Sequential (one after another):**
```javascript
async function sequential() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  return { user, posts };
}
```

**Parallel (simultaneously):**
```javascript
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(1),
    fetchPosts(1)
  ]);
  return { user, posts };
}
```

**Race (first to complete):**
```javascript
async function race() {
  const result = await Promise.race([
    fetchFromServer1(),
    fetchFromServer2()
  ]);
  return result;
}
```

**All Settled (wait for all, regardless of success/failure):**
```javascript
async function allSettled() {
  const results = await Promise.allSettled([
    fetchUser(1),
    fetchPosts(1),
    fetchComments(1)
  ]);
  return results;
}
```

### Q4: What is callback hell and how do you avoid it?

**Answer:**

**Callback Hell (Pyramid of Doom):**
```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d);
      });
    });
  });
});
```

**Solutions:**

**1. Named Functions:**
```javascript
function handleA(a) {
  getMoreData(a, handleB);
}
function handleB(b) {
  getMoreData(b, handleC);
}
// ...
```

**2. Promises:**
```javascript
getData()
  .then(a => getMoreData(a))
  .then(b => getMoreData(b))
  .then(c => getMoreData(c))
  .then(d => console.log(d));
```

**3. Async/Await:**
```javascript
async function process() {
  const a = await getData();
  const b = await getMoreData(a);
  const c = await getMoreData(b);
  const d = await getMoreData(c);
  console.log(d);
}
```

### Q5: Explain microtasks vs macrotasks

**Answer:**

**Microtasks:**
- Promise callbacks (`.then`, `.catch`, `.finally`)
- `queueMicrotask()`
- `MutationObserver`
- Higher priority
- Execute before next macrotask

**Macrotasks:**
- `setTimeout`
- `setInterval`
- `setImmediate` (Node.js)
- I/O operations
- UI rendering
- Lower priority

**Execution Order:**
```javascript
console.log('1'); // Sync

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

queueMicrotask(() => console.log('4')); // Microtask

console.log('5'); // Sync

// Output: 1, 5, 3, 4, 2
```

**Event Loop Cycle:**
1. Execute all synchronous code
2. Execute ALL microtasks
3. Execute ONE macrotask
4. Execute ALL microtasks (from that macrotask)
5. Repeat

### Q6: How do you handle errors in async code?

**Answer:**

**With Promises:**
```javascript
fetchData()
  .then(data => processData(data))
  .catch(error => console.error(error))
  .finally(() => cleanup());
```

**With Async/Await:**
```javascript
async function getData() {
  try {
    const data = await fetchData();
    return processData(data);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    cleanup();
  }
}
```

**Global Error Handler:**
```javascript
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

**Wrapper Function:**
```javascript
function asyncHandler(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async error:', error);
      throw error;
    }
  };
}
```

---

## Practice Problems

### Problem 1: Implement Promise.all

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve(results);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test
promiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3]
```

### Problem 2: Implement Async Retry

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Test
retry(() => {
  if (Math.random() < 0.7) {
    throw new Error('Random failure');
  }
  return 'Success!';
}, 5, 1000)
  .then(console.log)
  .catch(console.error);
```

### Problem 3: Implement Debounce (Async)

```javascript
function debounceAsync(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

// Test
const debouncedFetch = debounceAsync(async (query) => {
  console.log('Fetching:', query);
  return `Results for ${query}`;
}, 300);

debouncedFetch('test1');
debouncedFetch('test2');
debouncedFetch('test3').then(console.log); // Only this executes
```

### Problem 4: Implement Parallel Limit

```javascript
async function parallelLimit(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const [index, task] of tasks.entries()) {
    const promise = Promise.resolve().then(() => task());
    results[index] = promise;
    
    if (limit <= tasks.length) {
      const e = promise.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  
  return Promise.all(results);
}

// Test
const tasks = Array.from({ length: 10 }, (_, i) => 
  () => new Promise(resolve => {
    setTimeout(() => {
      console.log(`Task ${i} completed`);
      resolve(i);
    }, 1000);
  })
);

parallelLimit(tasks, 3).then(console.log);
```

### Problem 5: Implement Async Map

```javascript
async function asyncMap(array, asyncFn) {
  const results = [];
  
  for (const item of array) {
    const result = await asyncFn(item);
    results.push(result);
  }
  
  return results;
}

// Parallel version
async function asyncMapParallel(array, asyncFn) {
  return Promise.all(array.map(asyncFn));
}

// Test
const numbers = [1, 2, 3, 4, 5];

asyncMap(numbers, async (n) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return n * 2;
}).then(console.log); // [2, 4, 6, 8, 10]
```

---

## Summary

### Key Takeaways

1. **Event Loop**
   - Single-threaded but non-blocking
   - Microtasks execute before macrotasks
   - Understanding execution order is crucial

2. **Async Patterns**
   - Callbacks → Promises → Async/Await
   - Each solves callback hell problem
   - Async/await is most readable

3. **Error Handling**
   - Always handle errors in async code
   - Use try/catch with async/await
   - Use .catch() with promises
   - Consider global error handlers

4. **Concurrency**
   - Sequential vs parallel execution
   - Promise.all for parallel operations
   - Rate limiting and throttling
   - Circuit breakers for resilience

5. **Performance**
   - Cache async results
   - Batch requests when possible
   - Use lazy loading
   - Implement proper retry logic

### Best Practices

✅ **DO:**
- Use async/await for readability
- Handle all promise rejections
- Implement proper error handling
- Use Promise.all for parallel operations
- Cache expensive async operations
- Implement retry logic with backoff
- Use timeout for long operations

❌ **DON'T:**
- Forget to handle errors
- Use async/await in loops without consideration
- Create callback hell
- Ignore unhandled promise rejections
- Make unnecessary sequential calls
- Forget to clean up timers/listeners

---

[← Back to ES6+ Features](./07-es6-features.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)
