# JavaScript Advanced Fundamentals / Nền tảng JavaScript Nâng cao

## Overview / Tổng quan

**English:** Deep understanding of JavaScript fundamentals is crucial for frontend interviews. This guide covers advanced concepts that separate junior from senior developers, including memory management, closures, prototypes, and performance optimization.

**Tiếng Việt:** Hiểu biết sâu về nền tảng JavaScript là rất quan trọng cho các cuộc phỏng vấn frontend. Hướng dẫn này bao gồm các khái niệm nâng cao phân biệt giữa lập trình viên junior và senior, bao gồm quản lý bộ nhớ, closure, prototype và tối ưu hiệu suất.

---

## Memory Management & Garbage Collection / Quản lý Bộ nhớ & Thu góp rác

### **Understanding Memory Lifecycle / Hiểu chu trình Bộ nhớ**

**English Concepts:**
- **Memory Allocation**: How JavaScript allocates memory for variables and objects
- **Memory Usage**: Monitoring and optimizing memory consumption patterns
- **Garbage Collection**: Automatic cleanup of unused memory references
- **Memory Leaks**: Common causes and prevention strategies

**Khái niệm (Tiếng Việt):**
- **Cấp phát bộ nhớ**: Cách JavaScript cấp phát bộ nhớ cho biến và đối tượng
- **Sử dụng bộ nhớ**: Giám sát và tối ưu mô hình tiêu thụ bộ nhớ
- **Thu góp rác**: Tự động dọn dẹp các tham chiếu bộ nhớ không sử dụng
- **Rò rỉ bộ nhớ**: Nguyên nhân phổ biến và chiến lược phòng chống

```javascript
// Memory allocation patterns and optimization / Mô hình cấp phát bộ nhớ và tối ưu hóa
class MemoryOptimizedDataStructure {
  constructor() {
    // Use typed arrays for better memory efficiency / Sử dụng typed arrays để hiệu quả bộ nhớ hơn
    this.buffer = new ArrayBuffer(1024);
    this.view = new Int32Array(this.buffer);
    this.stringPool = new Map(); // String interning / String interning
    this.objectPool = []; // Object pooling / Object pooling
    this.weakRefs = new WeakMap(); // Prevent memory leaks / Ngăn rò rỉ bộ nhớ
  }

  // Object pooling to reduce garbage collection pressure / Object pooling để giảm áp lực thu góp rác
  createObject(data) {
    let obj = this.objectPool.pop();
    if (!obj) {
      obj = { id: null, data: null, timestamp: null };
    }
    
    obj.id = data.id;
    obj.data = data.data;
    obj.timestamp = Date.now();
    
    return obj;
  }

  recycleObject(obj) {
    // Clear references before pooling / Xóa references trước khi pooling
    obj.id = null;
    obj.data = null;
    obj.timestamp = null;
    
    this.objectPool.push(obj);
  }

  // String interning to reduce memory usage / String interning để giảm sử dụng bộ nhớ
  internString(str) {
    if (this.stringPool.has(str)) {
      return this.stringPool.get(str);
    }
    
    this.stringPool.set(str, str);
    return str;
  }

  // WeakMap usage to prevent memory leaks / Sử dụng WeakMap để ngăn rò rỉ bộ nhớ
  associateMetadata(obj, metadata) {
    this.weakRefs.set(obj, metadata);
    // When obj is garbage collected, metadata is automatically removed
    // Khi obj bị thu góp rác, metadata sẽ tự động bị loại bỏ
  }
}

// Demonstrating memory leaks and how to prevent them / Miêu tả rò rỉ bộ nhớ và cách phòng chống
class MemoryLeakExamples {
  constructor() {
    this.listeners = new Set();
    this.timers = new Set();
    this.observers = new Set();
  }

  // ❌ Memory leak: Forgotten event listener / Rò rỉ bộ nhớ: Quên event listener
  addEventListenerBad() {
    const button = document.getElementById('myButton');
    button.addEventListener('click', this.handleClick.bind(this));
    // Listener never removed, creates memory leak / Listener không bao giờ bị xóa, gây rò rỉ bộ nhớ
  }

  // ✅ Proper cleanup / Dọn dẹp đúng cách
  addEventListenerGood() {
    const button = document.getElementById('myButton');
    const boundHandler = this.handleClick.bind(this);
    
    button.addEventListener('click', boundHandler);
    this.listeners.add({ element: button, event: 'click', handler: boundHandler });
  }

  // ❌ Memory leak: Forgotten timer / Rò rỉ bộ nhớ: Quên timer
  startTimerBad() {
    setInterval(() => {
      console.log('Timer running...');
    }, 1000);
    // Timer never cleared / Timer không bao giờ bị xóa
  }

  // ✅ Proper timer management / Quản lý timer đúng cách
  startTimerGood() {
    const timerId = setInterval(() => {
      console.log('Timer running...');
    }, 1000);
    
    this.timers.add(timerId);
  }

  // ❌ Memory leak: Circular references
  createCircularReferenceBad() {
    const obj1 = {};
    const obj2 = {};
    
    obj1.ref = obj2;
    obj2.ref = obj1; // Circular reference
    
    return { obj1, obj2 }; // Both objects cannot be garbage collected
  }

  // ✅ Using WeakMap to break cycles
  createCircularReferenceGood() {
    const obj1 = {};
    const obj2 = {};
    const refs = new WeakMap();
    
    refs.set(obj1, obj2);
    refs.set(obj2, obj1);
    
    return { obj1, obj2, getRefs: (obj) => refs.get(obj) };
  }

  // Cleanup method
  cleanup() {
    // Remove all event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners.clear();

    // Clear all timers
    this.timers.forEach(timerId => clearInterval(timerId));
    this.timers.clear();

    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  handleClick(event) {
    console.log('Button clicked');
  }
}
```

### **Understanding Garbage Collection**

```javascript
// Demonstrating GC behavior and optimization
class GarbageCollectionDemo {
  constructor() {
    this.largeObjects = [];
    this.generation = 0;
  }

  // Force garbage collection (for demonstration in Node.js)
  forceGC() {
    if (global.gc) {
      global.gc();
    }
  }

  // Monitor memory usage
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Demonstrate generational GC behavior
  demonstrateGenerationalGC() {
    const beforeMemory = this.getMemoryUsage();
    
    // Create young generation objects (likely to be collected quickly)
    for (let i = 0; i < 1000; i++) {
      const temp = { id: i, data: new Array(100).fill(i) };
      // These objects become eligible for collection immediately
    }
    
    // Create older generation objects (survive longer)
    for (let i = 0; i < 100; i++) {
      this.largeObjects.push({
        id: i,
        generation: this.generation,
        data: new Array(1000).fill(i),
        created: Date.now()
      });
    }
    
    this.generation++;
    
    const afterMemory = this.getMemoryUsage();
    
    return {
      before: beforeMemory,
      after: afterMemory,
      difference: afterMemory ? afterMemory.used - beforeMemory.used : null
    };
  }

  // Optimize for mark-and-sweep collector
  optimizeForMarkSweep() {
    // Remove circular references
    this.largeObjects.forEach(obj => {
      if (obj.parent) {
        obj.parent = null;
      }
    });
    
    // Clear arrays efficiently
    this.largeObjects.length = 0; // Better than this.largeObjects = []
  }
}
```

---

## Execution Context & Scope Chain

### **Advanced Scope and Closure Patterns**

{% raw %}
```javascript
// Understanding execution context and scope chain
class ExecutionContextDemo {
  constructor() {
    this.globalVar = 'global';
  }

  // Demonstrating scope chain resolution
  demonstrateScopeChain() {
    const outerVar = 'outer';
    
    function outerFunction() {
      const middleVar = 'middle';
      
      function innerFunction() {
        const innerVar = 'inner';
        
        // Scope chain: innerFunction -> outerFunction -> global
        console.log(innerVar);   // Found in current scope
        console.log(middleVar);  // Found in outer function scope
        console.log(outerVar);   // Found in function scope
        console.log(this.globalVar); // Found in global scope (if bound)
        
        // Demonstrate lexical scoping
        return function deepestFunction() {
          // Still has access to all outer scopes
          return { innerVar, middleVar, outerVar };
        };
      }
      
      return innerFunction;
    }
    
    return outerFunction();
  }

  // Advanced closure patterns
  createAdvancedClosure() {
    let privateCounter = 0;
    const privateArray = [];
    
    // Module pattern with closures
    return {
      increment(amount = 1) {
        privateCounter += amount;
        privateArray.push(privateCounter);
        return this; // Method chaining
      },
      
      decrement(amount = 1) {
        privateCounter -= amount;
        privateArray.push(privateCounter);
        return this;
      },
      
      getValue() {
        return privateCounter;
      },
      
      getHistory() {
        return [...privateArray]; // Return copy to prevent mutation
      },
      
      reset() {
        privateCounter = 0;
        privateArray.length = 0;
        return this;
      },
      
      // Lazy evaluation with closures
      createLazyGetter(computeFunc) {
        let cached = null;
        let computed = false;
        
        return () => {
          if (!computed) {
            cached = computeFunc(privateCounter);
            computed = true;
          }
          return cached;
        };
      }
    };
  }

  // Temporal Dead Zone demonstration
  demonstrateTemporalDeadZone() {
    console.log('Before block');
    
    // console.log(letVar); // ReferenceError: Cannot access before initialization
    // console.log(constVar); // ReferenceError: Cannot access before initialization
    console.log(varVar); // undefined (hoisted but not initialized)
    
    {
      // Temporal Dead Zone starts here for let and const
      
      // console.log(letVar); // ReferenceError
      // console.log(constVar); // ReferenceError
      
      let letVar = 'let value';
      const constVar = 'const value';
      var varVar = 'var value';
      
      console.log({ letVar, constVar, varVar });
    }
    
    // console.log(letVar); // ReferenceError: letVar is not defined
    // console.log(constVar); // ReferenceError: constVar is not defined
    console.log(varVar); // 'var value' (function scoped)
  }

  // Understanding 'this' binding in different contexts
  demonstrateThisBinding() {
    const regularFunction = function() {
      return this; // Depends on how function is called
    };
    
    const arrowFunction = () => {
      return this; // Lexically bound to enclosing scope
    };
    
    const obj = {
      method: regularFunction,
      arrowMethod: arrowFunction,
      
      // Method with explicit binding
      boundMethod: regularFunction.bind({ bound: true }),
      
      // Method that returns bound function
      createBoundFunction() {
        return function() {
          return this;
        }.bind(this);
      }
    };
    
    return {
      // Different call contexts
      directCall: regularFunction(), // global object or undefined in strict mode
      methodCall: obj.method(), // obj
      arrowCall: obj.arrowMethod(), // lexical this (ExecutionContextDemo instance)
      boundCall: obj.boundMethod(), // { bound: true }
      
      // Call/apply/bind
      callExample: regularFunction.call({ called: true }),
      applyExample: regularFunction.apply({ applied: true }),
      bindExample: regularFunction.bind({ bound: true })(),
      
      // Constructor context
      constructorExample: new (function Constructor() {
        this.constructed = true;
        return this;
      })()
    };
  }
}

// Advanced closure patterns for real-world scenarios
class AdvancedClosurePatterns {
  // Memoization with closures
  static createMemoizer(func, maxCacheSize = 100) {
    const cache = new Map();
    const accessOrder = [];
    
    return function memoized(...args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        // Move to end (most recently used)
        const index = accessOrder.indexOf(key);
        accessOrder.splice(index, 1);
        accessOrder.push(key);
        return cache.get(key);
      }
      
      const result = func.apply(this, args);
      
      // Implement LRU cache
      if (cache.size >= maxCacheSize) {
        const lru = accessOrder.shift();
        cache.delete(lru);
      }
      
      cache.set(key, result);
      accessOrder.push(key);
      
      return result;
    };
  }

  // Debouncing with closures
  static createDebouncer(func, delay, immediate = false) {
    let timeoutId = null;
    let lastCallTime = 0;
    
    return function debounced(...args) {
      const callNow = immediate && !timeoutId;
      const now = Date.now();
      
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (!immediate) {
          func.apply(this, args);
        }
      }, delay);
      
      if (callNow) {
        func.apply(this, args);
      }
      
      lastCallTime = now;
    };
  }

  // Throttling with closures
  static createThrottler(func, limit) {
    let inThrottle = false;
    let lastFunc = null;
    let lastRan = null;
    
    return function throttled(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // State machine with closures
  static createStateMachine(initialState, transitions) {
    let currentState = initialState;
    const stateHistory = [initialState];
    
    return {
      getCurrentState() {
        return currentState;
      },
      
      getHistory() {
        return [...stateHistory];
      },
      
      transition(action) {
        const possibleTransitions = transitions[currentState];
        
        if (!possibleTransitions || !possibleTransitions[action]) {
          throw new Error(`Invalid transition: ${currentState} -> ${action}`);
        }
        
        const newState = possibleTransitions[action];
        currentState = newState;
        stateHistory.push(newState);
        
        return newState;
      },
      
      canTransition(action) {
        const possibleTransitions = transitions[currentState];
        return !!(possibleTransitions && possibleTransitions[action]);
      },
      
      reset() {
        currentState = initialState;
        stateHistory.length = 1;
        stateHistory[0] = initialState;
      }
    };
  }
}
```
{% endraw %}

---

## Asynchronous JavaScript Mastery

### **Advanced Promise Patterns**

```javascript
// Advanced promise patterns and error handling
class AdvancedPromisePatterns {
  // Promise.all with individual error handling
  static async allSettled(promises) {
    return Promise.allSettled(promises).then(results => {
      const fulfilled = [];
      const rejected = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          fulfilled.push({ index, value: result.value });
        } else {
          rejected.push({ index, reason: result.reason });
        }
      });
      
      return { fulfilled, rejected };
    });
  }

  // Promise with timeout
  static withTimeout(promise, timeoutMs, timeoutMessage = 'Operation timed out') {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      })
    ]);
  }

  // Retry mechanism with exponential backoff
  static async retryWithBackoff(
    operation, 
    maxRetries = 3, 
    baseDelay = 1000, 
    maxDelay = 10000,
    backoffFactor = 2
  ) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw new Error(`Operation failed after ${maxRetries + 1} attempts: ${error.message}`);
        }
        
        const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
        await this.delay(delay);
      }
    }
  }

  // Circuit breaker pattern
  static createCircuitBreaker(operation, threshold = 5, timeout = 60000) {
    let failures = 0;
    let lastFailureTime = null;
    let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    
    return async function circuitBreakerWrapper(...args) {
      const now = Date.now();
      
      // Reset if timeout has passed
      if (state === 'OPEN' && now - lastFailureTime > timeout) {
        state = 'HALF_OPEN';
        failures = 0;
      }
      
      if (state === 'OPEN') {
        throw new Error('Circuit breaker is OPEN');
      }
      
      try {
        const result = await operation(...args);
        
        // Success - reset failure count
        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
        }
        failures = 0;
        
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = now;
        
        if (failures >= threshold) {
          state = 'OPEN';
        }
        
        throw error;
      }
    };
  }

  // Promise queue for rate limiting
  static createPromiseQueue(concurrency = 1) {
    const queue = [];
    let running = 0;
    
    async function process() {
      if (running >= concurrency || queue.length === 0) {
        return;
      }
      
      running++;
      const { operation, resolve, reject } = queue.shift();
      
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        running--;
        process(); // Process next item
      }
    }
    
    return {
      add(operation) {
        return new Promise((resolve, reject) => {
          queue.push({ operation, resolve, reject });
          process();
        });
      },
      
      clear() {
        queue.length = 0;
      },
      
      size() {
        return queue.length;
      },
      
      isRunning() {
        return running > 0;
      }
    };
  }

  // Cancellable promises
  static createCancellablePromise(operation) {
    let cancelled = false;
    let cancelResolve;
    
    const cancelPromise = new Promise(resolve => {
      cancelResolve = resolve;
    });
    
    const mainPromise = new Promise(async (resolve, reject) => {
      try {
        const result = await Promise.race([
          operation(),
          cancelPromise.then(() => {
            throw new Error('Operation cancelled');
          })
        ]);
        
        if (!cancelled) {
          resolve(result);
        }
      } catch (error) {
        if (!cancelled) {
          reject(error);
        }
      }
    });
    
    return {
      promise: mainPromise,
      cancel() {
        cancelled = true;
        cancelResolve();
      },
      isCancelled() {
        return cancelled;
      }
    };
  }

  // Utility methods
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Progressive loading with promises
  static async loadResourcesProgressively(resources, onProgress) {
    const results = [];
    
    for (let i = 0; i < resources.length; i++) {
      try {
        const result = await resources[i]();
        results.push({ success: true, data: result, index: i });
        
        if (onProgress) {
          onProgress({
            completed: i + 1,
            total: resources.length,
            percentage: ((i + 1) / resources.length) * 100,
            result
          });
        }
      } catch (error) {
        results.push({ success: false, error, index: i });
        
        if (onProgress) {
          onProgress({
            completed: i + 1,
            total: resources.length,
            percentage: ((i + 1) / resources.length) * 100,
            error
          });
        }
      }
    }
    
    return results;
  }
}

// Advanced async/await patterns
class AsyncAwaitPatterns {
  // Parallel execution with async/await
  async executeInParallel(operations) {
    const startTime = Date.now();
    
    try {
      // Execute all operations in parallel
      const results = await Promise.all(operations.map(async (op, index) => {
        const opStartTime = Date.now();
        const result = await op();
        const duration = Date.now() - opStartTime;
        
        return { index, result, duration, success: true };
      }));
      
      return {
        success: true,
        results,
        totalDuration: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        totalDuration: Date.now() - startTime
      };
    }
  }

  // Sequential execution with async/await
  async executeSequentially(operations) {
    const results = [];
    const startTime = Date.now();
    
    for (let i = 0; i < operations.length; i++) {
      const opStartTime = Date.now();
      
      try {
        const result = await operations[i]();
        const duration = Date.now() - opStartTime;
        
        results.push({ index: i, result, duration, success: true });
      } catch (error) {
        const duration = Date.now() - opStartTime;
        results.push({ index: i, error: error.message, duration, success: false });
        
        // Stop on first error
        break;
      }
    }
    
    return {
      results,
      totalDuration: Date.now() - startTime,
      completed: results.length,
      total: operations.length
    };
  }

  // Async iteration patterns
  async *asyncGenerator(data) {
    for (const item of data) {
      // Simulate async processing
      await AdvancedPromisePatterns.delay(100);
      yield item * 2;
    }
  }

  async processAsyncIterable(iterable) {
    const results = [];
    
    for await (const item of iterable) {
      results.push(item);
    }
    
    return results;
  }

  // Error handling patterns
  async executeWithGracefulFailure(operations, { 
    continueOnError = true, 
    maxErrors = Infinity,
    errorHandler = null 
  } = {}) {
    const results = [];
    const errors = [];
    let errorCount = 0;
    
    for (let i = 0; i < operations.length; i++) {
      try {
        const result = await operations[i]();
        results.push({ index: i, result, success: true });
      } catch (error) {
        errorCount++;
        const errorInfo = { index: i, error: error.message, success: false };
        
        errors.push(errorInfo);
        results.push(errorInfo);
        
        if (errorHandler) {
          await errorHandler(error, i);
        }
        
        if (!continueOnError || errorCount >= maxErrors) {
          break;
        }
      }
    }
    
    return {
      results,
      errors,
      successCount: results.filter(r => r.success).length,
      errorCount,
      completed: results.length,
      total: operations.length
    };
  }
}
```

---

## Event Loop & Microtasks

### **Understanding the Event Loop**

```javascript
// Event loop demonstration and microtask understanding
class EventLoopDemo {
  constructor() {
    this.executionOrder = [];
    this.timers = [];
  }

  // Demonstrate event loop phases
  demonstrateEventLoop() {
    this.executionOrder = [];
    
    // 1. Synchronous code
    this.log('1: Synchronous start');
    
    // 2. Macrotask (Timer)
    setTimeout(() => {
      this.log('6: setTimeout (macrotask)');
    }, 0);
    
    // 3. Microtask (Promise)
    Promise.resolve().then(() => {
      this.log('4: Promise.then (microtask)');
    });
    
    // 4. Immediate microtask
    queueMicrotask(() => {
      this.log('5: queueMicrotask');
    });
    
    // 5. More synchronous code
    this.log('2: Synchronous middle');
    
    // 6. Nested microtask
    Promise.resolve().then(() => {
      this.log('3: First Promise');
      
      // This microtask runs before macrotasks
      Promise.resolve().then(() => {
        this.log('3.5: Nested Promise (microtask)');
      });
    });
    
    this.log('3: Synchronous end');
    
    // Return promise that resolves after all tasks complete
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.executionOrder);
      }, 10);
    });
  }

  // Demonstrate microtask vs macrotask priority
  demonstratePriority() {
    this.executionOrder = [];
    
    // Schedule multiple macrotasks
    setTimeout(() => this.log('Timeout 1'), 0);
    setTimeout(() => this.log('Timeout 2'), 0);
    
    // Schedule multiple microtasks
    Promise.resolve().then(() => this.log('Promise 1'));
    Promise.resolve().then(() => this.log('Promise 2'));
    
    // Immediate execution
    this.log('Sync code');
    
    // More microtasks
    queueMicrotask(() => this.log('Microtask 1'));
    queueMicrotask(() => this.log('Microtask 2'));
    
    return new Promise(resolve => {
      setTimeout(() => resolve(this.executionOrder), 10);
    });
  }

  // Complex event loop scenario
  demonstrateComplexScenario() {
    this.executionOrder = [];
    
    this.log('=== Start ===');
    
    setTimeout(() => {
      this.log('Timer 1');
      
      Promise.resolve().then(() => {
        this.log('Promise in Timer 1');
      });
      
      setTimeout(() => {
        this.log('Nested Timer in Timer 1');
      }, 0);
    }, 0);
    
    Promise.resolve().then(() => {
      this.log('Promise 1');
      
      setTimeout(() => {
        this.log('Timer in Promise 1');
      }, 0);
      
      return Promise.resolve();
    }).then(() => {
      this.log('Chained Promise 1');
    });
    
    setTimeout(() => {
      this.log('Timer 2');
    }, 0);
    
    Promise.resolve().then(() => {
      this.log('Promise 2');
    });
    
    this.log('=== End Sync ===');
    
    return new Promise(resolve => {
      setTimeout(() => resolve(this.executionOrder), 50);
    });
  }

  // Demonstrate blocking behavior
  demonstrateBlocking() {
    this.executionOrder = [];
    
    this.log('Before blocking operation');
    
    // Simulate CPU-intensive task
    const start = Date.now();
    while (Date.now() - start < 100) {
      // Blocking loop
    }
    
    this.log('After blocking operation');
    
    setTimeout(() => {
      this.log('This timer was delayed by blocking');
    }, 0);
    
    Promise.resolve().then(() => {
      this.log('This microtask runs immediately');
    });
    
    return this.executionOrder;
  }

  // Non-blocking alternatives
  demonstrateNonBlocking() {
    this.executionOrder = [];
    
    this.log('Before non-blocking operation');
    
    // Break up work into chunks
    this.performWorkInChunks(100, 10).then(() => {
      this.log('Non-blocking work completed');
    });
    
    setTimeout(() => {
      this.log('This timer is not blocked');
    }, 50);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(this.executionOrder), 200);
    });
  }

  async performWorkInChunks(totalWork, chunkSize) {
    for (let i = 0; i < totalWork; i += chunkSize) {
      // Do chunk of work
      const end = Math.min(i + chunkSize, totalWork);
      for (let j = i; j < end; j++) {
        // Simulate work
        Math.random();
      }
      
      // Yield control back to event loop
      await new Promise(resolve => setTimeout(resolve, 0));
      
      if (i % 50 === 0) {
        this.log(`Processed ${i}/${totalWork} items`);
      }
    }
  }

  log(message) {
    const timestamp = performance.now().toFixed(2);
    const entry = `${timestamp}ms: ${message}`;
    this.executionOrder.push(entry);
    console.log(entry);
  }
}

// Web Workers for true parallelism
class WebWorkerDemo {
  constructor() {
    this.workers = new Map();
  }

  // Create and manage web workers
  createWorker(script) {
    const blob = new Blob([script], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    const workerId = Math.random().toString(36).substr(2, 9);
    this.workers.set(workerId, worker);
    
    // Cleanup
    worker.addEventListener('error', () => {
      URL.revokeObjectURL(workerUrl);
      this.workers.delete(workerId);
    });
    
    return { worker, workerId };
  }

  // Heavy computation in web worker
  performHeavyComputation(data) {
    const workerScript = `
      self.onmessage = function(e) {
        const { data, operation } = e.data;
        
        let result;
        const startTime = Date.now();
        
        switch(operation) {
          case 'fibonacci':
            result = fibonacci(data);
            break;
          case 'primes':
            result = findPrimes(data);
            break;
          case 'sort':
            result = data.sort((a, b) => a - b);
            break;
          default:
            result = data;
        }
        
        const duration = Date.now() - startTime;
        
        self.postMessage({ result, duration });
      };
      
      function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
      
      function findPrimes(max) {
        const primes = [];
        for (let i = 2; i <= max; i++) {
          let isPrime = true;
          for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
              isPrime = false;
              break;
            }
          }
          if (isPrime) primes.push(i);
        }
        return primes;
      }
    `;
    
    const { worker, workerId } = this.createWorker(workerScript);
    
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data);
        worker.terminate();
        this.workers.delete(workerId);
      };
      
      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
        this.workers.delete(workerId);
      };
      
      worker.postMessage(data);
    });
  }

  // Cleanup all workers
  terminateAllWorkers() {
    this.workers.forEach(worker => worker.terminate());
    this.workers.clear();
  }
}
```

---

## Prototypal Inheritance Deep Dive

### **Advanced Prototype Patterns**

```javascript
// Understanding prototype chain and inheritance
class PrototypeDemo {
  // Demonstrate prototype chain
  static demonstratePrototypeChain() {
    // Create base object
    const animal = {
      type: 'Animal',
      breathe() {
        return `${this.name} is breathing`;
      }
    };
    
    // Create mammal that inherits from animal
    const mammal = Object.create(animal);
    mammal.type = 'Mammal';
    mammal.warmBlooded = true;
    mammal.nurse = function() {
      return `${this.name} is nursing`;
    };
    
    // Create dog that inherits from mammal
    const dog = Object.create(mammal);
    dog.type = 'Dog';
    dog.bark = function() {
      return `${this.name} is barking`;
    };
    
    // Create specific dog instance
    const buddy = Object.create(dog);
    buddy.name = 'Buddy';
    buddy.breed = 'Golden Retriever';
    
    // Demonstrate prototype chain traversal
    console.log('Prototype chain for buddy:');
    let current = buddy;
    let level = 0;
    
    while (current) {
      console.log(`Level ${level}:`, current);
      console.log('Own properties:', Object.getOwnPropertyNames(current));
      current = Object.getPrototypeOf(current);
      level++;
      
      if (level > 10) break; // Prevent infinite loop
    }
    
    return {
      buddy,
      chain: {
        canBreathe: buddy.breathe(),
        canNurse: buddy.nurse(),
        canBark: buddy.bark(),
        properties: {
          name: buddy.name,
          breed: buddy.breed,
          type: buddy.type,
          warmBlooded: buddy.warmBlooded
        }
      }
    };
  }

  // Classical inheritance patterns
  static demonstrateClassicalInheritance() {
    // Constructor function pattern
    function Vehicle(make, model) {
      this.make = make;
      this.model = model;
      this.speed = 0;
    }
    
    Vehicle.prototype.accelerate = function(amount) {
      this.speed += amount;
      return this;
    };
    
    Vehicle.prototype.brake = function(amount) {
      this.speed = Math.max(0, this.speed - amount);
      return this;
    };
    
    Vehicle.prototype.getInfo = function() {
      return `${this.make} ${this.model} going ${this.speed} mph`;
    };
    
    // Inheritance with constructor functions
    function Car(make, model, doors) {
      // Call parent constructor
      Vehicle.call(this, make, model);
      this.doors = doors;
    }
    
    // Set up prototype chain
    Car.prototype = Object.create(Vehicle.prototype);
    Car.prototype.constructor = Car;
    
    // Add car-specific methods
    Car.prototype.honk = function() {
      return `${this.make} ${this.model} is honking!`;
    };
    
    // Override parent method
    Car.prototype.getInfo = function() {
      return `${this.make} ${this.model} (${this.doors} doors) going ${this.speed} mph`;
    };
    
    const myCar = new Car('Toyota', 'Camry', 4);
    
    return {
      myCar,
      demo: {
        initial: myCar.getInfo(),
        afterAccelerate: myCar.accelerate(30).getInfo(),
        afterBrake: myCar.brake(10).getInfo(),
        honk: myCar.honk(),
        instanceof: {
          Car: myCar instanceof Car,
          Vehicle: myCar instanceof Vehicle,
          Object: myCar instanceof Object
        }
      }
    };
  }

  // Modern class syntax with private fields
  static demonstrateModernClasses() {
    class Shape {
      #id = Math.random().toString(36).substr(2, 9);
      
      constructor(color) {
        this.color = color;
      }
      
      get id() {
        return this.#id;
      }
      
      area() {
        throw new Error('area() must be implemented by subclass');
      }
      
      getInfo() {
        return `${this.constructor.name} (${this.color}) - Area: ${this.area()}`;
      }
      
      static isShape(obj) {
        return obj instanceof Shape;
      }
    }
    
    class Circle extends Shape {
      #radius;
      
      constructor(color, radius) {
        super(color);
        this.#radius = radius;
      }
      
      get radius() {
        return this.#radius;
      }
      
      set radius(value) {
        if (value <= 0) {
          throw new Error('Radius must be positive');
        }
        this.#radius = value;
      }
      
      area() {
        return Math.PI * this.#radius ** 2;
      }
      
      circumference() {
        return 2 * Math.PI * this.#radius;
      }
    }
    
    class Rectangle extends Shape {
      #width;
      #height;
      
      constructor(color, width, height) {
        super(color);
        this.#width = width;
        this.#height = height;
      }
      
      get dimensions() {
        return { width: this.#width, height: this.#height };
      }
      
      area() {
        return this.#width * this.#height;
      }
      
      perimeter() {
        return 2 * (this.#width + this.#height);
      }
    }
    
    const circle = new Circle('red', 5);
    const rectangle = new Rectangle('blue', 4, 6);
    
    return {
      circle: {
        info: circle.getInfo(),
        circumference: circle.circumference(),
        id: circle.id,
        isShape: Shape.isShape(circle)
      },
      rectangle: {
        info: rectangle.getInfo(),
        perimeter: rectangle.perimeter(),
        dimensions: rectangle.dimensions,
        isShape: Shape.isShape(rectangle)
      }
    };
  }

  // Mixin patterns
  static demonstrateMixins() {
    // Mixin for event handling
    const EventMixin = {
      addEventListener(event, callback) {
        if (!this._events) this._events = {};
        if (!this._events[event]) this._events[event] = [];
        this._events[event].push(callback);
      },
      
      removeEventListener(event, callback) {
        if (!this._events || !this._events[event]) return;
        const index = this._events[event].indexOf(callback);
        if (index > -1) {
          this._events[event].splice(index, 1);
        }
      },
      
      dispatchEvent(event, data) {
        if (!this._events || !this._events[event]) return;
        this._events[event].forEach(callback => callback(data));
      }
    };
    
    // Mixin for validation
    const ValidationMixin = {
      addValidator(field, validator) {
        if (!this._validators) this._validators = {};
        if (!this._validators[field]) this._validators[field] = [];
        this._validators[field].push(validator);
      },
      
      validate(data) {
        if (!this._validators) return { valid: true, errors: {} };
        
        const errors = {};
        let valid = true;
        
        for (const [field, validators] of Object.entries(this._validators)) {
          const fieldErrors = [];
          
          for (const validator of validators) {
            const result = validator(data[field]);
            if (result !== true) {
              fieldErrors.push(result);
              valid = false;
            }
          }
          
          if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
          }
        }
        
        return { valid, errors };
      }
    };
    
    // Combine mixins
    function createUser(name, email) {
      const user = {
        name,
        email,
        
        setName(newName) {
          const oldName = this.name;
          this.name = newName;
          this.dispatchEvent('nameChanged', { oldName, newName });
        },
        
        setEmail(newEmail) {
          const validation = this.validate({ email: newEmail });
          if (!validation.valid) {
            throw new Error(`Invalid email: ${validation.errors.email.join(', ')}`);
          }
          
          const oldEmail = this.email;
          this.email = newEmail;
          this.dispatchEvent('emailChanged', { oldEmail, newEmail });
        }
      };
      
      // Apply mixins
      Object.assign(user, EventMixin, ValidationMixin);
      
      // Add email validator
      user.addValidator('email', (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || 'Invalid email format';
      });
      
      return user;
    }
    
    const user = createUser('John Doe', 'john@example.com');
    
    // Set up event listeners
    const events = [];
    user.addEventListener('nameChanged', (data) => {
      events.push(`Name changed from ${data.oldName} to ${data.newName}`);
    });
    
    user.addEventListener('emailChanged', (data) => {
      events.push(`Email changed from ${data.oldEmail} to ${data.newEmail}`);
    });
    
    // Test the user object
    user.setName('Jane Doe');
    user.setEmail('jane@example.com');
    
    return {
      user: {
        name: user.name,
        email: user.email
      },
      events,
      validation: user.validate({ email: 'invalid-email' })
    };
  }
}
```

## Interview Questions & Answers / Câu hỏi phỏng vấn và câu trả lời

### Q1: Explain JavaScript's memory management and garbage collection / Giải thích quản lý bộ nhớ và thu gom rác của JavaScript

**English Answer:**
JavaScript uses automatic memory management through garbage collection:

1. **Memory Allocation**: Variables and objects are automatically allocated memory when created
2. **Reference Tracking**: The engine tracks references to objects
3. **Mark-and-Sweep**: Modern engines use mark-and-sweep algorithm to identify unreachable objects
4. **Generational GC**: Objects are categorized by age (young/old generation) for efficient collection
5. **Memory Leaks**: Common causes include forgotten event listeners, closures holding large objects, and circular references

**Practical Example:**
```javascript
// Memory leak example
function createLeak() {
  const largeArray = new Array(1000000).fill('data');
  const element = document.getElementById('button');
  
  // This creates a closure that holds largeArray in memory
  element.addEventListener('click', function() {
    console.log('Button clicked', largeArray.length);
  });
  // Solution: Remove event listener when no longer needed
}
```

**Câu trả lời (Tiếng Việt):**
JavaScript sử dụng quản lý bộ nhớ tự động thông qua thu gom rác:

1. **Cấp phát bộ nhớ**: Biến và đối tượng tự động được cấp phát bộ nhớ khi tạo
2. **Theo dõi tham chiếu**: Engine theo dõi các tham chiếu đến đối tượng
3. **Mark-and-Sweep**: Các engine hiện đại sử dụng thuật toán mark-and-sweep để xác định các đối tượng không thể truy cập
4. **Generational GC**: Các đối tượng được phân loại theo tuổi để thu gom hiệu quả
5. **Rò rỉ bộ nhớ**: Nguyên nhân phổ biến bao gồm quên event listener, closure giữ đối tượng lớn, và tham chiếu vòng tròn

### Q2: How do closures work and what are their practical applications? / Closure hoạt động như thế nào và ứng dụng thực tế là gì?

**English Answer:**
Closures are functions that have access to variables in their outer (enclosing) scope even after the outer function has returned:

1. **Lexical Scoping**: JavaScript uses lexical scoping - inner functions have access to outer variables
2. **Persistence**: Variables in the closure persist even after the outer function completes
3. **Data Privacy**: Closures can create private variables and methods
4. **Function Factories**: Create specialized functions with preset configurations

**Practical Applications:**
- Module pattern for encapsulation
- Debouncing and throttling
- Memoization
- Event handlers with state
- Currying and partial application

**Câu trả lời (Tiếng Việt):**
Closure là các hàm có quyền truy cập vào các biến trong phạm vi bên ngoài (enclosing scope) ngay cả sau khi hàm bên ngoài đã trả về:

1. **Lexical Scoping**: JavaScript sử dụng lexical scoping - hàm bên trong có quyền truy cập vào biến bên ngoài
2. **Tồn tại lâu dài**: Các biến trong closure tồn tại ngay cả sau khi hàm bên ngoài hoàn thành
3. **Bảo mật dữ liệu**: Closure có thể tạo các biến và phương thức private
4. **Function Factories**: Tạo các hàm chuyên biệt với cấu hình đặt trước

### Q3: What is the prototype chain and how does inheritance work in JavaScript? / Prototype chain là gì và inheritance hoạt động như thế nào trong JavaScript?

**English Answer:**
The prototype chain is JavaScript's mechanism for inheritance:

1. **Prototype Property**: Every function has a prototype property
2. **__proto__ Link**: Every object has a __proto__ link to its constructor's prototype
3. **Chain Traversal**: When accessing a property, JavaScript walks up the prototype chain
4. **Inheritance**: Objects inherit properties and methods from their prototype chain

**Key Concepts:**
```javascript
// Constructor function inheritance
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};
```

**Câu trả lời (Tiếng Việt):**
Prototype chain là cơ chế inheritance của JavaScript:

1. **Thuộc tính Prototype**: Mỗi hàm có thuộc tính prototype
2. **Liên kết __proto__**: Mỗi đối tượng có liên kết __proto__ đến prototype của constructor
3. **Duyệt chuỗi**: Khi truy cập thuộc tính, JavaScript đi lên prototype chain
4. **Inheritance**: Các đối tượng kế thừa thuộc tính và phương thức từ prototype chain

### Q4: Explain event bubbling and capturing in JavaScript / Giải thích event bubbling và capturing trong JavaScript

**English Answer:**
Event propagation has three phases:

1. **Capturing Phase**: Event travels from document root down to target element
2. **Target Phase**: Event reaches the target element
3. **Bubbling Phase**: Event bubbles up from target back to document root

**Control Mechanisms:**
- `addEventListener(event, handler, useCapture)` - useCapture controls capture vs bubble
- `event.stopPropagation()` - Stops further propagation
- `event.stopImmediatePropagation()` - Stops all remaining handlers
- `event.preventDefault()` - Prevents default browser behavior

**Câu trả lời (Tiếng Việt):**
Sự lan truyền sự kiện có ba giai đoạn:

1. **Giai đoạn Capturing**: Sự kiện đi từ gốc document xuống element đích
2. **Giai đoạn Target**: Sự kiện đến element đích
3. **Giai đoạn Bubbling**: Sự kiện nổi lên từ đích trở lại gốc document

**Cơ chế kiểm soát:**
- `addEventListener(event, handler, useCapture)` - useCapture kiểm soát capture vs bubble
- `event.stopPropagation()` - Dừng lan truyền tiếp
- `event.stopImmediatePropagation()` - Dừng tất cả handler còn lại
- `event.preventDefault()` - Ngăn hành vi mặc định của trình duyệt

### Q5: What are the differences between var, let, and const? / Sự khác biệt giữa var, let, và const là gì?

**English Answer:**
Key differences in scoping, hoisting, and mutability:

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |
| Temporal Dead Zone | No | Yes | Yes |

**Practical Examples:**
```javascript
// Scope differences
function scopeExample() {
  if (true) {
    var a = 1;    // Function-scoped
    let b = 2;    // Block-scoped
    const c = 3;  // Block-scoped
  }
  
  console.log(a); // 1 (accessible)
  console.log(b); // ReferenceError
  console.log(c); // ReferenceError
}

// Hoisting behavior
console.log(x); // undefined (var hoisted)
console.log(y); // ReferenceError (TDZ)
var x = 1;
let y = 2;
```

**Câu trả lời (Tiếng Việt):**
Sự khác biệt chính về phạm vi, hoisting và khả năng thay đổi:

- **var**: Function-scoped, có hoisting thành undefined, cho phép khai báo lại
- **let**: Block-scoped, có Temporal Dead Zone, không cho phép khai báo lại
- **const**: Block-scoped, có Temporal Dead Zone, không cho phép gán lại

## Performance Optimization Tips / Mẹo tối ưu hiệu suất

### English Tips:
1. **Use const and let**: Better performance and clearer intent than var
2. **Avoid global variables**: Reduces scope chain lookup time
3. **Use object pooling**: Reduce garbage collection pressure
4. **Implement proper cleanup**: Remove event listeners and clear timers
5. **Use WeakMap/WeakSet**: For automatic garbage collection of associated data
6. **Optimize closures**: Avoid capturing unnecessary variables in closure scope

### Mẹo (Tiếng Việt):
1. **Sử dụng const và let**: Hiệu suất tốt hơn và ý định rõ ràng hơn var
2. **Tránh biến global**: Giảm thời gian tìm kiếm scope chain
3. **Sử dụng object pooling**: Giảm áp lực thu gom rác
4. **Triển khai cleanup đúng cách**: Xóa event listener và clear timer
5. **Sử dụng WeakMap/WeakSet**: Để tự động thu gom rác dữ liệu liên quan
6. **Tối ưu closure**: Tránh capture các biến không cần thiết trong closure scope

This comprehensive guide covers the fundamental JavaScript concepts that are crucial for frontend interviews, providing both theoretical understanding and practical implementation examples that demonstrate mastery of the language.
