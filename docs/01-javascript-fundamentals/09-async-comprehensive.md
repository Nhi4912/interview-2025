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

