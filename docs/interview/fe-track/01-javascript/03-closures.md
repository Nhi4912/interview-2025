# Closures
## JavaScript Fundamentals - Chapter 3

[← Previous: Scope & Hoisting](./02-scope-hoisting.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Prototypes & Inheritance →](./04-prototypes-inheritance.md)

---

## Overview

Closures are one of the most powerful and frequently misunderstood concepts in JavaScript. A closure gives you access to an outer function's scope from an inner function, even after the outer function has returned.

---

## Table of Contents
1. [What is a Closure?](#what-is-a-closure)
2. [How Closures Work](#how-closures-work)
3. [Practical Use Cases](#practical-use-cases)
4. [Common Patterns](#common-patterns)
5. [Closure Pitfalls](#closure-pitfalls)
6. [Memory Considerations](#memory-considerations)
7. [Interview Questions](#interview-questions)
8. [Practice Problems](#practice-problems)

---

## What is a Closure?

**Definition / Định nghĩa:** A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**Định nghĩa:** Closure là một hàm có quyền truy cập vào các biến trong phạm vi từ vựng bên ngoài (enclosing), ngay cả sau khi hàm bên ngoài đã kết thúc.

### Simple Example

```javascript
function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(`Outer: ${outerVariable}`);
    console.log(`Inner: ${innerVariable}`);
  };
}

const newFunction = outerFunction('outside');
newFunction('inside');
// Output:
// Outer: outside
// Inner: inside
```

**Key Points:**
- `innerFunction` has access to `outerVariable`
- `outerVariable` persists even after `outerFunction` returns
- This is a closure!

---

## How Closures Work

### Lexical Scoping

```javascript
const globalVar = 'global';

function outer() {
  const outerVar = 'outer';
  
  function middle() {
    const middleVar = 'middle';
    
    function inner() {
      const innerVar = 'inner';
      
      // Inner function has access to all outer scopes
      console.log(innerVar);   // 'inner'
      console.log(middleVar);  // 'middle'
      console.log(outerVar);   // 'outer'
      console.log(globalVar);  // 'global'
    }
    
    return inner;
  }
  
  return middle;
}

const middleFn = outer();
const innerFn = middleFn();
innerFn(); // All variables accessible!
```

### Scope Chain Visualization

```
Scope Chain for inner():
inner() scope → middle() scope → outer() scope → global scope
```

---

## Practical Use Cases

### 1. Data Privacy / Encapsulation

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
      throw new Error('Amount must be positive');
    },
    
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      throw new Error('Invalid withdrawal amount');
    },
    
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
account.deposit(500); // 1500
account.withdraw(200); // 1300
console.log(account.balance); // undefined (private!)
```

### 2. Function Factories

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5)); // 10
console.log(triple(5)); // 15
console.log(quadruple(5)); // 20
```

### 3. Event Handlers

```javascript
function setupButtons() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // Closure captures 'index' for each button
      console.log(`Button ${index} clicked`);
    });
  });
}
```

### 4. Memoization / Caching

```javascript
function memoize(fn) {
  const cache = {}; // Closure variable
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Returning cached result');
      return cache[key];
    }
    
    console.log('Computing result');
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

// Expensive function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.log(memoizedFib(10)); // Computing result: 55
console.log(memoizedFib(10)); // Returning cached result: 55
```

### 5. Partial Application & Currying

```javascript
// Partial application
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

const sayHello = partial(greet, 'Hello');
console.log(sayHello('John')); // "Hello, John!"
console.log(sayHello('Jane')); // "Hello, Jane!"

// Currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

---

## Common Patterns

### Module Pattern

```javascript
const Calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }
  
  // Public API
  return {
    add(x) {
      result += x;
      log('Add', x);
      return this;
    },
    
    subtract(x) {
      result -= x;
      log('Subtract', x);
      return this;
    },
    
    multiply(x) {
      result *= x;
      log('Multiply', x);
      return this;
    },
    
    divide(x) {
      if (x !== 0) {
        result /= x;
        log('Divide', x);
      }
      return this;
    },
    
    getResult() {
      return result;
    },
    
    clear() {
      result = 0;
      return this;
    }
  };
})();

// Usage with method chaining
Calculator
  .add(10)
  .multiply(2)
  .subtract(5)
  .divide(3);

console.log(Calculator.getResult()); // 5
```

### Counter Pattern

```javascript
function createCounter(initialValue = 0, step = 1) {
  let count = initialValue;
  
  return {
    increment() {
      count += step;
      return count;
    },
    
    decrement() {
      count -= step;
      return count;
    },
    
    reset() {
      count = initialValue;
      return count;
    },
    
    getValue() {
      return count;
    },
    
    setStep(newStep) {
      step = newStep;
    }
  };
}

const counter = createCounter(0, 5);
console.log(counter.increment()); // 5
console.log(counter.increment()); // 10
console.log(counter.decrement()); // 5
counter.setStep(10);
console.log(counter.increment()); // 15
```

### Debounce Function

```javascript
function debounce(func, delay) {
  let timeoutId; // Closure variable
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
  // API call here
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### Throttle Function

```javascript
function throttle(func, limit) {
  let inThrottle; // Closure variable
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll event');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

---

## Closure Pitfalls

### Problem 1: Loop with var

```javascript
// ❌ Problem: All functions share same 'i'
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Prints: 3, 3, 3
  }, 100);
}

// ✅ Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Prints: 0, 1, 2
  }, 100);
}

// ✅ Solution 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(function() {
      console.log(index); // Prints: 0, 1, 2
    }, 100);
  })(i);
}

// ✅ Solution 3: Pass parameter to setTimeout
for (var i = 0; i < 3; i++) {
  setTimeout(function(index) {
    console.log(index); // Prints: 0, 1, 2
  }, 100, i);
}
```

### Problem 2: Accidental Global Variables

```javascript
function createCounter() {
  count = 0; // ❌ Missing 'let/const' creates global variable!
  
  return {
    increment() {
      return ++count;
    }
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1.increment()); // 1
console.log(counter2.increment()); // 2 (shares same global count!)

// ✅ Solution: Always use let/const
function createCounter() {
  let count = 0; // ✅ Proper closure variable
  
  return {
    increment() {
      return ++count;
    }
  };
}
```

### Problem 3: Memory Leaks

```javascript
// ❌ Potential memory leak
function attachHandler() {
  const largeData = new Array(1000000).fill('data');
  
  document.getElementById('button').addEventListener('click', function() {
    console.log('Button clicked');
    // largeData is kept in memory even if not used!
  });
}

// ✅ Solution: Only close over what you need
function attachHandler() {
  const largeData = new Array(1000000).fill('data');
  const summary = largeData.length; // Extract only what's needed
  
  document.getElementById('button').addEventListener('click', function() {
    console.log(`Button clicked, data size: ${summary}`);
    // largeData can be garbage collected
  });
}
```

---

## Memory Considerations

### Understanding Closure Memory

```javascript
function heavyFunction() {
  const largeArray = new Array(1000000).fill('data'); // ~8MB
  
  return function() {
    // largeArray is kept in memory as long as this function exists
    return largeArray.length;
  };
}

const fn = heavyFunction();
// largeArray is still in memory!

// To free memory:
fn = null; // Now largeArray can be garbage collected
```

### Best Practices

```javascript
// ✅ Good: Minimal closure scope
function createHandler(id) {
  return function() {
    console.log(`Handler for ${id}`);
  };
}

// ❌ Bad: Unnecessary large closure
function createHandler(id) {
  const largeData = fetchLargeData(); // Kept in memory
  const processedData = process(largeData); // Kept in memory
  
  return function() {
    console.log(`Handler for ${id}`); // Only needs id!
  };
}

// ✅ Better: Extract only what's needed
function createHandler(id) {
  const largeData = fetchLargeData();
  const summary = extractSummary(largeData); // Small data
  
  return function() {
    console.log(`Handler for ${id}: ${summary}`);
  };
}
```

---

## Interview Questions

### Q1: What is a closure and how does it work?

**Answer:**
A closure is a function that has access to variables in its outer lexical scope, even after the outer function has returned. It works because JavaScript maintains a reference to the outer scope's variables as long as the inner function exists.

```javascript
function outer() {
  const message = "Hello";
  
  return function inner() {
    console.log(message); // Accesses outer variable
  };
}

const fn = outer();
fn(); // "Hello" - closure in action!
```

### Q2: Explain the loop closure problem

**Answer:** See "Problem 1: Loop with var" in Closure Pitfalls section.

### Q3: What are practical uses of closures?

**Answer:**
1. Data privacy / encapsulation
2. Function factories
3. Memoization / caching
4. Event handlers
5. Partial application / currying
6. Module pattern
7. Debounce / throttle functions

### Q4: Can closures cause memory leaks?

**Answer:**
Yes, if not careful. Closures keep references to outer scope variables, preventing garbage collection. Always close over only what you need and set references to null when done.

---

## Practice Problems

### Problem 1: Create a Private Counter

```javascript
function createPrivateCounter() {
  let count = 0;
  
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    }
  };
}

// Test
const counter = createPrivateCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
console.log(counter.count); // undefined (private!)
```

### Problem 2: Implement once() Function

```javascript
function once(fn) {
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

// Test
const initialize = once(() => {
  console.log('Initialized!');
  return 'Done';
});

console.log(initialize()); // "Initialized!" then "Done"
console.log(initialize()); // "Done" (no log)
console.log(initialize()); // "Done" (no log)
```

### Problem 3: Create a Function Queue

```javascript
function createQueue() {
  const queue = [];
  
  return {
    enqueue(item) {
      queue.push(item);
      return queue.length;
    },
    
    dequeue() {
      return queue.shift();
    },
    
    peek() {
      return queue[0];
    },
    
    size() {
      return queue.length;
    },
    
    isEmpty() {
      return queue.length === 0;
    }
  };
}

// Test
const q = createQueue();
q.enqueue('first');
q.enqueue('second');
console.log(q.peek()); // "first"
console.log(q.dequeue()); // "first"
console.log(q.size()); // 1
```

---

## Summary

- Closures allow functions to access outer scope variables
- Created automatically when functions are defined
- Powerful for data privacy, factories, and functional programming
- Be aware of memory implications
- Common in modern JavaScript patterns (React hooks, etc.)

---

[← Previous: Scope & Hoisting](./02-scope-hoisting.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next: Prototypes & Inheritance →](./04-prototypes-inheritance.md)
