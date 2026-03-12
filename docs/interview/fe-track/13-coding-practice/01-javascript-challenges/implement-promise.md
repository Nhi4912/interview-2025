# Implement Promise

> Implement Promise class from scratch - câu hỏi khó nhất trong JavaScript challenges.

**Difficulty**: 🔴 Hard
**Time**: 45-60 minutes
**Companies**: All Big Tech

---

## 📋 Problem Statement

Implement a `MyPromise` class that follows the Promise/A+ specification:
1. Three states: pending, fulfilled, rejected
2. `then` method with chaining
3. `catch` method
4. `finally` method
5. Static methods: `resolve`, `reject`, `all`, `race`, `allSettled`, `any`

---

## 💡 Solution

### Basic Promise Implementation

```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      // Handle if value is a promise
      if (value instanceof MyPromise) {
        value.then(resolve, reject);
        return;
      }

      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // Default handlers for chaining
    onFulfilled = typeof onFulfilled === 'function'
      ? onFulfilled
      : value => value;
    onRejected = typeof onRejected === 'function'
      ? onRejected
      : reason => { throw reason };

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.state === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.state === REJECTED) {
        rejectedMicrotask();
      } else {
        // PENDING - queue callbacks
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });

    return promise2;
  }

  resolvePromise(promise2, x, resolve, reject) {
    // Cannot resolve to itself
    if (promise2 === x) {
      reject(new TypeError('Chaining cycle detected'));
      return;
    }

    // If x is a Promise
    if (x instanceof MyPromise) {
      x.then(resolve, reject);
      return;
    }

    // If x is an object or function (thenable)
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false;

      try {
        const then = x.then;

        if (typeof then === 'function') {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    );
  }
}
```

### Static Methods

```javascript
// Promise.resolve
MyPromise.resolve = function(value) {
  if (value instanceof MyPromise) {
    return value;
  }
  return new MyPromise(resolve => resolve(value));
};

// Promise.reject
MyPromise.reject = function(reason) {
  return new MyPromise((_, reject) => reject(reason));
};

// Promise.all
MyPromise.all = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be iterable'));
    }

    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = value;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        },
        reason => {
          reject(reason);
        }
      );
    });
  });
};

// Promise.race
MyPromise.race = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be iterable'));
    }

    promises.forEach(promise => {
      MyPromise.resolve(promise).then(resolve, reject);
    });
  });
};

// Promise.allSettled
MyPromise.allSettled = function(promises) {
  return new MyPromise((resolve) => {
    if (!Array.isArray(promises)) {
      return resolve([]);
    }

    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          results[index] = { status: 'fulfilled', value };
          completed++;
          if (completed === total) {
            resolve(results);
          }
        },
        reason => {
          results[index] = { status: 'rejected', reason };
          completed++;
          if (completed === total) {
            resolve(results);
          }
        }
      );
    });
  });
};

// Promise.any
MyPromise.any = function(promises) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be iterable'));
    }

    const errors = [];
    let rejected = 0;
    const total = promises.length;

    if (total === 0) {
      return reject(new AggregateError([], 'All promises were rejected'));
    }

    promises.forEach((promise, index) => {
      MyPromise.resolve(promise).then(
        value => {
          resolve(value);
        },
        reason => {
          errors[index] = reason;
          rejected++;
          if (rejected === total) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
};
```

---

## 📊 State Machine Diagram

```
                    ┌─────────────────┐
                    │                 │
         ┌──────────│    PENDING      │──────────┐
         │          │                 │          │
         │          └─────────────────┘          │
         │                                       │
    resolve(value)                          reject(reason)
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│                 │                    │                 │
│   FULFILLED     │                    │    REJECTED     │
│   value = ...   │                    │   reason = ...  │
│                 │                    │                 │
└─────────────────┘                    └─────────────────┘

Note: State transitions are ONE-WAY and IRREVERSIBLE
```

---

## 🔄 Promise Chaining Flow

```
promise.then(f1).then(f2).catch(errorHandler)

                ┌─────────────────────────────────────┐
                │                                     │
                ▼                                     │
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Promise │──▶│  then   │──▶│  then   │──▶│  catch  │
│  (p1)   │   │  (f1)   │   │  (f2)   │   │(handler)│
└─────────┘   └─────────┘   └─────────┘   └─────────┘
    │              │              │              │
    │              │              │              │
    ▼              ▼              ▼              ▼
 value1 ───▶   value2 ───▶   value3 ───▶   result
                  │              │              ▲
                  │              │              │
                  └──────────────┴──────────────┘
                         (if error)
```

---

## 🧪 Test Cases

```javascript
// Basic resolve
const p1 = new MyPromise((resolve) => {
  setTimeout(() => resolve('Hello'), 100);
});
p1.then(value => console.log(value)); // 'Hello'

// Basic reject
const p2 = new MyPromise((_, reject) => {
  reject('Error!');
});
p2.catch(err => console.log(err)); // 'Error!'

// Chaining
MyPromise.resolve(1)
  .then(x => x + 1)
  .then(x => x * 2)
  .then(console.log); // 4

// Promise.all
MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.resolve(2),
  MyPromise.resolve(3)
]).then(console.log); // [1, 2, 3]

// Promise.race
MyPromise.race([
  new MyPromise(r => setTimeout(() => r('slow'), 100)),
  new MyPromise(r => setTimeout(() => r('fast'), 50))
]).then(console.log); // 'fast'

// Promise.allSettled
MyPromise.allSettled([
  MyPromise.resolve(1),
  MyPromise.reject('error'),
  MyPromise.resolve(3)
]).then(console.log);
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]

// Thenable handling
const thenable = {
  then(resolve) {
    resolve('thenable value');
  }
};
MyPromise.resolve(thenable).then(console.log); // 'thenable value'

// Error propagation
MyPromise.resolve(1)
  .then(() => { throw new Error('oops'); })
  .then(() => console.log('never called'))
  .catch(err => console.log(err.message)); // 'oops'

// finally
MyPromise.resolve('done')
  .finally(() => console.log('cleanup'))
  .then(console.log); // 'cleanup' then 'done'
```

---

## ⚠️ Key Implementation Details

### 1. Microtask Queue
```javascript
// Use queueMicrotask to ensure async behavior
queueMicrotask(() => {
  // This runs after current synchronous code
});

// Alternative: setTimeout(fn, 0) but not spec-compliant
// Promise callbacks should run as microtasks, not macrotasks
```

### 2. Resolution Procedure
```javascript
// The resolvePromise function handles:
// 1. Self-resolution (throw TypeError)
// 2. Promise values (chain)
// 3. Thenable objects (duck typing)
// 4. Regular values (resolve directly)
```

### 3. Called Flag
```javascript
// Prevent multiple resolve/reject calls
let called = false;
then.call(
  x,
  y => {
    if (called) return;
    called = true;
    // ...
  },
  r => {
    if (called) return;
    called = true;
    // ...
  }
);
```

---

## 📊 Static Methods Comparison

```
┌───────────────┬─────────────────────────────────────────────────────┐
│ Method        │ Behavior                                            │
├───────────────┼─────────────────────────────────────────────────────┤
│ Promise.all   │ Resolves when ALL resolve, rejects on FIRST reject │
│ Promise.race  │ Resolves/rejects with FIRST to settle              │
│ Promise.allSettled │ Always resolves with ALL results (success/fail) │
│ Promise.any   │ Resolves with FIRST success, rejects if ALL fail   │
└───────────────┴─────────────────────────────────────────────────────┘
```

---

## ❓ Follow-up Questions

1. **Why use microtask queue?**
   - Ensures async behavior per spec
   - Runs before next macrotask
   - Maintains consistent timing

2. **What's a thenable?**
   - Any object with a `then` method
   - Allows interop with non-native Promises
   - Promise/A+ compatibility

3. **Why check `called` flag?**
   - Thenables might call resolve/reject multiple times
   - Only first call should take effect

4. **How does finally work?**
   - Doesn't receive value
   - Passes through value/reason
   - Callback result is awaited

---

> **Tiếp theo:** [Event Emitter](./event-emitter.md) | **Quay lại:** [JavaScript Challenges](./README.md)
