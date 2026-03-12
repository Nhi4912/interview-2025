# Async Programming - Promises, Async/Await Deep Dive

> Async programming là heart của modern JavaScript. Hiểu sâu Promises và async/await = viết code non-blocking hiệu quả.

---

## Mục Lục

- [Overview](#-overview)
- [Callbacks](#-callbacks)
- [Promises](#-promises)
- [Async/Await](#-asyncawait)
- [Error Handling](#-error-handling)
- [Advanced Patterns](#-advanced-patterns)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

JavaScript là **single-threaded** nhưng có thể xử lý async operations nhờ Event Loop. Evolution của async code:

```
┌─────────────────────────────────────────────────────────────────┐
│              ASYNC PROGRAMMING EVOLUTION                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Callbacks (ES5)                                                │
│   ┌──────────────────────────────────────────┐                   │
│   │ doSomething(function(result) {           │                   │
│   │     doNext(result, function(result2) {   │                   │
│   │         doFinal(result2);                │                   │
│   │     });                                  │                   │
│   │ });                                      │                   │
│   └──────────────────────────────────────────┘                   │
│                         ↓                                        │
│   Promises (ES6)                                                 │
│   ┌──────────────────────────────────────────┐                   │
│   │ doSomething()                            │                   │
│   │     .then(result => doNext(result))      │                   │
│   │     .then(result2 => doFinal(result2))   │                   │
│   │     .catch(error => handle(error));      │                   │
│   └──────────────────────────────────────────┘                   │
│                         ↓                                        │
│   Async/Await (ES2017)                                           │
│   ┌──────────────────────────────────────────┐                   │
│   │ async function run() {                   │                   │
│   │     const result = await doSomething();  │                   │
│   │     const result2 = await doNext(result);│                   │
│   │     return doFinal(result2);             │                   │
│   │ }                                        │                   │
│   └──────────────────────────────────────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📞 Callbacks

### What - Callbacks là gì

Callback là function được truyền vào function khác và được gọi sau khi async operation hoàn thành.

```javascript
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: 'John' };
        callback(null, data); // Node.js convention: error-first
    }, 1000);
}

fetchData((error, data) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(data);
});
```

### Callback Hell

```javascript
// ❌ Pyramid of Doom
getUser(userId, function(error, user) {
    if (error) {
        handleError(error);
        return;
    }
    getOrders(user.id, function(error, orders) {
        if (error) {
            handleError(error);
            return;
        }
        getOrderDetails(orders[0].id, function(error, details) {
            if (error) {
                handleError(error);
                return;
            }
            getShippingInfo(details.shippingId, function(error, shipping) {
                if (error) {
                    handleError(error);
                    return;
                }
                // Finally do something...
                displayInfo(user, orders, details, shipping);
            });
        });
    });
});
```

Vấn đề:
- Hard to read and maintain
- Error handling lặp lại
- Inversion of control (trust issues)

---

## 🔵 Promises

### What - Promise là gì

Promise là object đại diện cho eventual completion (hoặc failure) của async operation.

### Promise States

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMISE STATES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                      ┌─────────────┐                             │
│                      │   PENDING   │                             │
│                      │   (initial) │                             │
│                      └──────┬──────┘                             │
│                             │                                     │
│            ┌────────────────┼────────────────┐                   │
│            │                │                │                   │
│            ▼                                 ▼                   │
│   ┌─────────────────┐               ┌─────────────────┐          │
│   │   FULFILLED     │               │    REJECTED     │          │
│   │   (resolved)    │               │    (error)      │          │
│   │                 │               │                 │          │
│   │  .then(value)   │               │  .catch(error)  │          │
│   └─────────────────┘               └─────────────────┘          │
│                                                                   │
│   ◄────────────── SETTLED (immutable) ──────────────►            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Creating Promises

```javascript
const promise = new Promise((resolve, reject) => {
    // Async operation
    const success = true;

    if (success) {
        resolve('Data loaded successfully');
    } else {
        reject(new Error('Failed to load data'));
    }
});

// Using the promise
promise
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

### Promise Chaining

```javascript
fetch('/api/user')
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json(); // Returns a Promise
    })
    .then(user => {
        console.log(user);
        return fetch(`/api/orders/${user.id}`);
    })
    .then(response => response.json())
    .then(orders => {
        console.log(orders);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        console.log('Cleanup');
    });
```

### Promise Static Methods

```javascript
// Promise.all - Tất cả phải resolve
const promises = [
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
];

Promise.all(promises)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([users, posts, comments]) => {
        console.log(users, posts, comments);
    })
    .catch(error => {
        // Nếu BẤT KỲ promise nào reject
        console.error(error);
    });

// Promise.allSettled - Đợi tất cả, không throw error
Promise.allSettled(promises)
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Success:', result.value);
            } else {
                console.log('Failed:', result.reason);
            }
        });
    });

// Promise.race - First to settle wins
Promise.race([
    fetch('/api/data'),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
    )
])
.then(response => response.json())
.catch(error => console.error(error));

// Promise.any - First to RESOLVE wins (ES2021)
Promise.any([
    fetch('https://server1.com/api'),
    fetch('https://server2.com/api'),
    fetch('https://server3.com/api')
])
.then(response => console.log('Fastest successful:', response))
.catch(error => console.log('All failed:', error));
```

### Comparison Table

| Method | Behavior | Use Case |
|--------|----------|----------|
| `Promise.all` | Rejects if any rejects | Parallel requests, all required |
| `Promise.allSettled` | Never rejects, returns all results | Parallel requests, partial OK |
| `Promise.race` | First to settle | Timeout, fastest response |
| `Promise.any` | First to resolve | Fallback servers |

---

## ⏳ Async/Await

### Syntax

```javascript
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
            throw new Error('User not found');
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw để caller handle
    }
}

// Usage
const user = await fetchUserData(1);
```

### Async Functions Always Return Promise

```javascript
async function getValue() {
    return 42; // Automatically wrapped in Promise
}

getValue().then(v => console.log(v)); // 42

// Equivalent to:
function getValue() {
    return Promise.resolve(42);
}
```

### Sequential vs Parallel

```javascript
// ❌ Sequential - SLOW (3 seconds total)
async function getDataSequential() {
    const users = await fetchUsers();      // 1s
    const posts = await fetchPosts();      // 1s
    const comments = await fetchComments(); // 1s
    return { users, posts, comments };
}

// ✅ Parallel - FAST (1 second total)
async function getDataParallel() {
    const [users, posts, comments] = await Promise.all([
        fetchUsers(),
        fetchPosts(),
        fetchComments()
    ]);
    return { users, posts, comments };
}
```

### Parallel Execution Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              SEQUENTIAL vs PARALLEL                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SEQUENTIAL:                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                  │
│  │ fetchUsers │──│ fetchPosts │──│fetchComments│                 │
│  └────────────┘  └────────────┘  └────────────┘                  │
│  |____1s____|    |____1s____|    |_____1s_____|                  │
│  |_________________3 seconds total________________|              │
│                                                                   │
│  PARALLEL (Promise.all):                                         │
│  ┌────────────┐                                                  │
│  │ fetchUsers │                                                  │
│  ├────────────┤                                                  │
│  │ fetchPosts │                                                  │
│  ├────────────┤                                                  │
│  │fetchComments│                                                 │
│  └────────────┘                                                  │
│  |____1s____|                                                    │
│  |_1 second total_|                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Loops with Async/Await

```javascript
const ids = [1, 2, 3, 4, 5];

// ❌ forEach doesn't wait
ids.forEach(async (id) => {
    const user = await fetchUser(id);
    console.log(user); // Executes in unpredictable order
});

// ✅ for...of - Sequential
for (const id of ids) {
    const user = await fetchUser(id);
    console.log(user); // One by one
}

// ✅ Promise.all + map - Parallel
const users = await Promise.all(
    ids.map(id => fetchUser(id))
);
console.log(users); // All at once
```

---

## ⚠️ Error Handling

### Try/Catch with Async/Await

```javascript
async function fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry ${i + 1}/${retries}`);
            await sleep(1000 * (i + 1)); // Exponential backoff
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Error Handling Patterns

```javascript
// Pattern 1: Wrapper function
function to(promise) {
    return promise
        .then(data => [null, data])
        .catch(error => [error, null]);
}

// Usage
async function getData() {
    const [error, data] = await to(fetchUser(1));
    if (error) {
        console.error('Failed:', error);
        return;
    }
    console.log('Success:', data);
}

// Pattern 2: Catch at each step
async function processOrder(orderId) {
    const order = await fetchOrder(orderId)
        .catch(e => ({ error: 'Order not found' }));

    if (order.error) return order;

    const payment = await processPayment(order)
        .catch(e => ({ error: 'Payment failed' }));

    if (payment.error) return payment;

    return { success: true, order, payment };
}
```

### Unhandled Promise Rejections

```javascript
// Global handler
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default logging
});

// Node.js
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

---

## 🚀 Advanced Patterns

### 1. Cancellable Promises with AbortController

```javascript
async function fetchWithAbort(url, signal) {
    const response = await fetch(url, { signal });
    return response.json();
}

// Usage
const controller = new AbortController();

fetchWithAbort('/api/data', controller.signal)
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Request cancelled');
        }
    });

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

### 2. Promise Pool (Concurrency Control)

```javascript
async function promisePool(tasks, concurrency) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = Promise.resolve().then(() => task());
        results.push(promise);

        const e = promise.then(() => executing.delete(e));
        executing.add(e);

        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }

    return Promise.all(results);
}

// Usage: Max 3 concurrent requests
const urls = [/* 100 URLs */];
const tasks = urls.map(url => () => fetch(url));
const results = await promisePool(tasks, 3);
```

### 3. Debounced Async Function

```javascript
function debounceAsync(fn, delay) {
    let timeoutId;
    let pendingPromise = null;

    return function(...args) {
        return new Promise((resolve, reject) => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
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
```

### 4. Retry with Exponential Backoff

```javascript
async function retryWithBackoff(
    fn,
    maxRetries = 5,
    baseDelay = 1000,
    maxDelay = 30000
) {
    let retries = 0;

    while (true) {
        try {
            return await fn();
        } catch (error) {
            retries++;

            if (retries >= maxRetries) {
                throw error;
            }

            const delay = Math.min(
                baseDelay * Math.pow(2, retries - 1) + Math.random() * 1000,
                maxDelay
            );

            console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`);
            await new Promise(r => setTimeout(r, delay));
        }
    }
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Promise.all vs Promise.allSettled?**

A:
- `Promise.all`: Reject ngay khi bất kỳ promise nào reject
- `Promise.allSettled`: Đợi tất cả hoàn thành, trả về array với status và value/reason

**Q: Tại sao dùng async/await thay vì .then()?**

A: Async/await:
- Code dễ đọc hơn (synchronous style)
- Dễ debug (stack traces rõ ràng)
- Dễ handle errors với try/catch
- Dễ dùng với loops và conditionals

### 🟡 Mid-level

**Q: Giải thích output:**

```javascript
async function test() {
    console.log(1);
    await Promise.resolve();
    console.log(2);
}

console.log(3);
test();
console.log(4);
```

A: Output: 3, 1, 4, 2

Giải thích:
1. `console.log(3)` - sync
2. Call `test()`, `console.log(1)` - sync trong async function
3. `await` - pause execution, đưa phần còn lại vào microtask queue
4. `console.log(4)` - sync
5. Microtask chạy: `console.log(2)`

**Q: Implement Promise.all từ scratch**

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
```

### 🔴 Senior

**Q: Implement Promise với timeout**

```javascript
function withTimeout(promise, ms, errorMessage = 'Timeout') {
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(errorMessage));
        }, ms);
    });

    return Promise.race([promise, timeoutPromise])
        .finally(() => clearTimeout(timeoutId));
}

// Usage
const result = await withTimeout(
    fetch('/api/data'),
    5000,
    'Request timed out'
);
```

**Q: Làm sao để cancel một ongoing fetch request?**

A: Sử dụng AbortController:

```javascript
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .catch(e => {
        if (e.name === 'AbortError') {
            console.log('Fetch cancelled');
        }
    });

// Cancel request
controller.abort();
```

---

## 📚 Active Recall

1. [ ] So sánh 3 cách xử lý async: Callbacks, Promises, Async/Await
2. [ ] Viết Promise.all từ scratch
3. [ ] Khi nào dùng Promise.race vs Promise.any?
4. [ ] Implement retry function với exponential backoff
5. [ ] Giải thích tại sao forEach không work với async/await

---

> **Tiếp theo:** [07-memory-management.md](./07-memory-management.md) - Memory Management & Garbage Collection
