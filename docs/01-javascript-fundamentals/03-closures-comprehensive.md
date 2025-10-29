# Closures - Comprehensive Deep Dive
## JavaScript Fundamentals - Advanced Concepts

[← Back to Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [Next: Prototypes →](./04-prototypes-inheritance.md)

---

## 📋 Table of Contents

1. [Closure Fundamentals](#closure-fundamentals)
2. [How Closures Work](#how-closures-work)
3. [Lexical Environment](#lexical-environment)
4. [Practical Applications](#practical-applications)
5. [Common Patterns](#common-patterns)
6. [Memory Management](#memory-management)
7. [Performance Considerations](#performance-considerations)
8. [Advanced Techniques](#advanced-techniques)
9. [Common Pitfalls](#common-pitfalls)
10. [Interview Questions](#interview-questions)
11. [Practice Problems](#practice-problems)

---

## 🎯 Learning Objectives

By the end of this chapter, you will master:
- What closures are and how they work internally
- Lexical environment and scope chain mechanics
- Practical applications of closures
- Common closure patterns and anti-patterns
- Memory implications and optimization techniques
- Advanced closure techniques for real-world problems

---

## Closure Fundamentals

### What is a Closure?

**English Definition:** A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**Định nghĩa (Tiếng Việt):** Closure là một hàm có quyền truy cập vào các biến trong phạm vi từ vựng bên ngoài (enclosing), ngay cả sau khi hàm bên ngoài đã return.


### Closure Mind Map

```
Closures in JavaScript
│
├── Core Concept
│   ├── Function + Lexical Environment
│   ├── Access to outer scope
│   └── Persists after outer function returns
│
├── Components
│   ├── Inner function
│   ├── Outer function variables
│   └── Scope chain reference
│
├── Use Cases
│   ├── Data privacy/encapsulation
│   ├── Factory functions
│   ├── Event handlers
│   ├── Callbacks
│   ├── Partial application
│   └── Memoization
│
├── Benefits
│   ├── Data hiding
│   ├── State preservation
│   ├── Function factories
│   └── Modular code
│
└── Considerations
    ├── Memory usage
    ├── Performance impact
    └── Potential memory leaks
```

### Simple Closure Example

```javascript
// Basic closure demonstration
function outerFunction() {
  const outerVariable = "I'm from outer scope";
  
  function innerFunction() {
    console.log(outerVariable); // Accesses outer variable
  }
  
  return innerFunction;
}

const closure = outerFunction();
closure(); // "I'm from outer scope"

/*
Key observations:
1. innerFunction is defined inside outerFunction
2. innerFunction accesses outerVariable
3. outerFunction returns innerFunction
4. Even after outerFunction finishes, innerFunction still has access to outerVariable
5. This is a CLOSURE!
*/
```

### Why Closures Exist

```javascript
// Without closures (hypothetical):
function outer() {
  const data = "important data";
  
  function inner() {
    console.log(data);
  }
  
  return inner;
}

const fn = outer();
// If closures didn't exist, 'data' would be destroyed here
// fn(); // Would fail - 'data' no longer exists

// With closures (actual JavaScript):
function outerWithClosure() {
  const data = "important data";
  
  function inner() {
    console.log(data);
  }
  
  return inner;
}

const fnWithClosure = outerWithClosure();
fnWithClosure(); // "important data" - Works! Closure preserves 'data'
```

---

## How Closures Work

### Execution Context and Lexical Environment

**Definition:** Every function execution creates an execution context with a lexical environment that stores variables and has a reference to its outer environment.

```javascript
// Step-by-step closure creation

// Step 1: Global execution context created
const globalVar = "global";

// Step 2: createCounter execution context created
function createCounter() {
  // Step 3: Lexical environment created with 'count'
  let count = 0;
  
  // Step 4: increment function created with reference to outer lexical environment
  function increment() {
    count++; // Accesses outer 'count' via closure
    return count;
  }
  
  // Step 5: Return increment (with its lexical environment reference)
  return increment;
}

// Step 6: createCounter execution context destroyed
// BUT: increment's reference to lexical environment keeps 'count' alive
const counter = createCounter();

// Step 7: Calling counter accesses preserved 'count'
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

/*
Memory Structure:

Global Execution Context
  ├── globalVar: "global"
  └── counter: <function>
       └── [[Scope]]: Reference to createCounter's Lexical Environment
            └── count: 3 (preserved by closure)
*/
```

### Closure Internals Visualization

```javascript
function makeAdder(x) {
  // Lexical Environment 1: { x: ? }
  
  return function(y) {
    // Lexical Environment 2: { y: ? }
    // [[Scope]]: Reference to Lexical Environment 1
    
    return x + y; // Accesses x via closure
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2));  // 7  (5 + 2)
console.log(add10(2)); // 12 (10 + 2)

/*
Memory Structure:

add5 function
  └── [[Scope]]: { x: 5 }

add10 function
  └── [[Scope]]: { x: 10 }

Each closure has its own independent lexical environment!
*/
```

### Multiple Closures Sharing Same Scope

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();

console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

/*
All three methods share the same closure over 'count':

counter object
  ├── increment: <function>
  │    └── [[Scope]]: { count: 1 }
  ├── decrement: <function>
  │    └── [[Scope]]: { count: 1 } (same reference)
  └── getCount: <function>
       └── [[Scope]]: { count: 1 } (same reference)
*/
```

---

## Lexical Environment

### Understanding Lexical Environment

**Definition:** A lexical environment is a structure that holds identifier-variable mapping and has a reference to the outer lexical environment.

```javascript
// Lexical Environment Structure:
/*
LexicalEnvironment = {
  EnvironmentRecord: {
    // Variables and functions declared in this scope
    variable1: value1,
    variable2: value2,
    ...
  },
  outer: <reference to parent lexical environment>
}
*/

// Example with nested functions
const global = "global";

function level1() {
  const var1 = "level1";
  
  function level2() {
    const var2 = "level2";
    
    function level3() {
      const var3 = "level3";
      
      // Can access all levels via lexical environment chain
      console.log(var3);   // Own environment
      console.log(var2);   // Parent environment
      console.log(var1);   // Grandparent environment
      console.log(global); // Global environment
    }
    
    return level3;
  }
  
  return level2;
}

const fn2 = level1();
const fn3 = fn2();
fn3();

/*
Lexical Environment Chain:

level3 Lexical Environment
  ├── EnvironmentRecord: { var3: "level3" }
  └── outer: ↓

level2 Lexical Environment
  ├── EnvironmentRecord: { var2: "level2" }
  └── outer: ↓

level1 Lexical Environment
  ├── EnvironmentRecord: { var1: "level1" }
  └── outer: ↓

Global Lexical Environment
  ├── EnvironmentRecord: { global: "global" }
  └── outer: null
*/
```

### Variable Resolution Through Lexical Environment

```javascript
function outer() {
  const x = 10;
  const y = 20;
  
  function middle() {
    const y = 30; // Shadows outer 'y'
    const z = 40;
    
    function inner() {
      const z = 50; // Shadows middle 'z'
      
      console.log(x); // 10 - from outer
      console.log(y); // 30 - from middle (shadows outer's y)
      console.log(z); // 50 - from inner (shadows middle's z)
    }
    
    return inner;
  }
  
  return middle;
}

const middleFn = outer();
const innerFn = middleFn();
innerFn();

/*
Variable Resolution Process:

Looking for 'x':
1. Check inner's environment: Not found
2. Check middle's environment: Not found
3. Check outer's environment: Found! x = 10

Looking for 'y':
1. Check inner's environment: Not found
2. Check middle's environment: Found! y = 30 (stops here)

Looking for 'z':
1. Check inner's environment: Found! z = 50 (stops here)
*/
```

---

## Practical Applications

### 1. Data Privacy and Encapsulation

```javascript
// ========================================
// PRIVATE VARIABLES
// ========================================

function createPerson(name, age) {
  // Private variables (not accessible from outside)
  let _name = name;
  let _age = age;
  let _secrets = [];
  
  // Public interface (methods that form closures)
  return {
    getName() {
      return _name;
    },
    
    setName(newName) {
      if (typeof newName === 'string' && newName.length > 0) {
        _name = newName;
        return true;
      }
      return false;
    },
    
    getAge() {
      return _age;
    },
    
    haveBirthday() {
      _age++;
      return _age;
    },
    
    addSecret(secret) {
      _secrets.push(secret);
    },
    
    revealSecrets(password) {
      if (password === 'please') {
        return [..._secrets]; // Return copy, not reference
      }
      return 'Access denied';
    }
  };
}

const person = createPerson('John', 30);

console.log(person.getName()); // "John"
console.log(person.getAge());  // 30

person.haveBirthday();
console.log(person.getAge());  // 31

person.addSecret('Loves pizza');
person.addSecret('Afraid of spiders');

console.log(person.revealSecrets('wrong')); // "Access denied"
console.log(person.revealSecrets('please')); // ["Loves pizza", "Afraid of spiders"]

// Cannot access private variables directly
console.log(person._name);    // undefined
console.log(person._age);     // undefined
console.log(person._secrets); // undefined
```

### 2. Function Factories

```javascript
// ========================================
// CREATING SPECIALIZED FUNCTIONS
// ========================================

// Tax calculator factory
function createTaxCalculator(taxRate) {
  return function(amount) {
    return amount * (1 + taxRate);
  };
}

const calculateWithVAT = createTaxCalculator(0.20); // 20% VAT
const calculateWithSalesTax = createTaxCalculator(0.08); // 8% sales tax

console.log(calculateWithVAT(100));      // 120
console.log(calculateWithSalesTax(100)); // 108

// Greeting factory
function createGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter('Hello');
const sayHola = createGreeter('Hola');
const sayBonjour = createGreeter('Bonjour');

console.log(sayHello('John'));    // "Hello, John!"
console.log(sayHola('Maria'));    // "Hola, Maria!"
console.log(sayBonjour('Pierre')); // "Bonjour, Pierre!"

// Multiplier factory
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20
```

### 3. Event Handlers with Closures

```javascript
// ========================================
// EVENT HANDLERS
// ========================================

function setupButtons() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach((button, index) => {
    // Each handler closes over its own 'index'
    button.addEventListener('click', function() {
      console.log(`Button ${index} clicked`);
      this.textContent = `Clicked ${index}`;
    });
  });
}

// Better pattern: Closure with state
function createButton(id) {
  let clickCount = 0;
  
  return {
    handleClick() {
      clickCount++;
      console.log(`Button ${id} clicked ${clickCount} times`);
      return clickCount;
    },
    
    reset() {
      clickCount = 0;
    },
    
    getCount() {
      return clickCount;
    }
  };
}

const button1 = createButton('btn-1');
const button2 = createButton('btn-2');

// Simulate clicks
button1.handleClick(); // "Button btn-1 clicked 1 times"
button1.handleClick(); // "Button btn-1 clicked 2 times"
button2.handleClick(); // "Button btn-2 clicked 1 times"

console.log(button1.getCount()); // 2
console.log(button2.getCount()); // 1
```

### 4. Memoization (Caching)

```javascript
// ========================================
// MEMOIZATION WITH CLOSURES
// ========================================

function memoize(fn) {
  const cache = {}; // Closed over by returned function
  
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

// Expensive fibonacci calculation
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(10)); // Computing result: 55
console.log(memoizedFib(10)); // Returning cached result: 55
console.log(memoizedFib(10)); // Returning cached result: 55

// Advanced memoization with expiration
function memoizeWithExpiration(fn, ttl = 5000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log('Returning cached result');
      return cached.value;
    }
    
    console.log('Computing result');
    const result = fn(...args);
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    });
    
    return result;
  };
}

function expensiveOperation(x) {
  return x * 2;
}

const memoized = memoizeWithExpiration(expensiveOperation, 3000);

console.log(memoized(5)); // Computing result: 10
console.log(memoized(5)); // Returning cached result: 10
// Wait 3 seconds...
setTimeout(() => {
  console.log(memoized(5)); // Computing result: 10 (cache expired)
}, 3500);
```

### 5. Partial Application and Currying

```javascript
// ========================================
// PARTIAL APPLICATION
// ========================================

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, 'Hello');
const sayHelloJohn = partial(greet, 'Hello', 'John');

console.log(sayHello('Alice', '!'));      // "Hello, Alice!"
console.log(sayHelloJohn('!'));           // "Hello, John!"

// ========================================
// CURRYING
// ========================================

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3));       // 6
console.log(curriedAdd(1, 2)(3));       // 6
console.log(curriedAdd(1)(2, 3));       // 6
console.log(curriedAdd(1, 2, 3));       // 6

// Practical currying example
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);
const multiplyBy2 = curriedMultiply(2);
const multiplyBy2And3 = multiplyBy2(3);

console.log(multiplyBy2And3(4));  // 24 (2 * 3 * 4)
```

### 6. Module Pattern

```javascript
// ========================================
// MODULE PATTERN
// ========================================

const Calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function log(operation, value) {
    console.log(`${operation}: ${value}, result: ${result}`);
  }
  
  function validate(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Invalid number');
    }
  }
  
  // Public API
  return {
    add(value) {
      validate(value);
      result += value;
      log('add', value);
      return this;
    },
    
    subtract(value) {
      validate(value);
      result -= value;
      log('subtract', value);
      return this;
    },
    
    multiply(value) {
      validate(value);
      result *= value;
      log('multiply', value);
      return this;
    },
    
    divide(value) {
      validate(value);
      if (value === 0) {
        throw new Error('Division by zero');
      }
      result /= value;
      log('divide', value);
      return this;
    },
    
    getResult() {
      return result;
    },
    
    reset() {
      result = 0;
      log('reset', 0);
      return this;
    }
  };
})();

// Usage
Calculator
  .add(10)
  .multiply(2)
  .subtract(5)
  .divide(3);

console.log(Calculator.getResult()); // 5

// Cannot access private members
console.log(Calculator.result); // undefined
// Calculator.log(); // undefined
```


---

## Common Patterns

### Pattern 1: Counter Pattern

```javascript
// ========================================
// SIMPLE COUNTER
// ========================================

function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment(step = 1) {
      count += step;
      return count;
    },
    decrement(step = 1) {
      count -= step;
      return count;
    },
    reset() {
      count = initialValue;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment());    // 11
console.log(counter.increment(5));   // 16
console.log(counter.decrement(3));   // 13
console.log(counter.reset());        // 10

// ========================================
// COUNTER WITH LIMITS
// ========================================

function createBoundedCounter(min, max, initial) {
  let count = initial;
  
  return {
    increment() {
      if (count < max) {
        count++;
      }
      return count;
    },
    decrement() {
      if (count > min) {
        count--;
      }
      return count;
    },
    getValue() {
      return count;
    },
    isAtMax() {
      return count === max;
    },
    isAtMin() {
      return count === min;
    }
  };
}

const bounded = createBoundedCounter(0, 10, 5);
console.log(bounded.increment()); // 6
console.log(bounded.increment()); // 7
// ... increment to 10
console.log(bounded.isAtMax());   // true
console.log(bounded.increment()); // 10 (can't go higher)
```

### Pattern 2: Once Function

```javascript
// ========================================
// EXECUTE FUNCTION ONLY ONCE
// ========================================

function once(fn) {
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const initialize = once(() => {
  console.log('Initializing...');
  return { initialized: true };
});

console.log(initialize()); // "Initializing..." { initialized: true }
console.log(initialize()); // { initialized: true } (no log)
console.log(initialize()); // { initialized: true } (no log)

// ========================================
// PRACTICAL EXAMPLE: API CALL
// ========================================

function createApiClient() {
  let token = null;
  
  const authenticate = once(async () => {
    console.log('Authenticating...');
    // Simulate API call
    token = 'auth-token-12345';
    return token;
  });
  
  return {
    async getToken() {
      return await authenticate();
    },
    
    async makeRequest(endpoint) {
      const authToken = await authenticate();
      console.log(`Making request to ${endpoint} with token ${authToken}`);
      return { data: 'response' };
    }
  };
}

const api = createApiClient();
// First call authenticates
api.makeRequest('/users'); // "Authenticating..." then makes request
// Subsequent calls reuse token
api.makeRequest('/posts'); // Only makes request (no auth)
```

### Pattern 3: Debounce and Throttle

```javascript
// ========================================
// DEBOUNCE
// ========================================

function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Usage: Search input
const search = debounce((query) => {
  console.log(`Searching for: ${query}`);
  // Make API call
}, 300);

// Simulating rapid typing
search('j');
search('ja');
search('jav');
search('java');
search('javasc');
search('javascri');
search('javascript');
// Only logs once after 300ms: "Searching for: javascript"

// ========================================
// THROTTLE
// ========================================

function throttle(fn, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage: Scroll event
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

// window.addEventListener('scroll', handleScroll);
// Logs at most once per second, no matter how fast you scroll

// ========================================
// ADVANCED DEBOUNCE WITH IMMEDIATE
// ========================================

function debounceAdvanced(fn, delay, immediate = false) {
  let timeoutId;
  
  return function(...args) {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn(...args);
      }
    }, delay);
    
    if (callNow) {
      fn(...args);
    }
  };
}

const immediateSearch = debounceAdvanced((query) => {
  console.log(`Immediate search: ${query}`);
}, 300, true);

// First call executes immediately, then debounces
immediateSearch('test'); // Logs immediately
immediateSearch('test2'); // Debounced
```

### Pattern 4: Iterator Pattern

```javascript
// ========================================
// CUSTOM ITERATOR WITH CLOSURE
// ========================================

function createIterator(array) {
  let index = 0;
  
  return {
    next() {
      if (index < array.length) {
        return {
          value: array[index++],
          done: false
        };
      }
      return {
        value: undefined,
        done: true
      };
    },
    
    hasNext() {
      return index < array.length;
    },
    
    reset() {
      index = 0;
    },
    
    current() {
      return array[index];
    }
  };
}

const iterator = createIterator([1, 2, 3, 4, 5]);

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.hasNext()); // true
console.log(iterator.next()); // { value: 3, done: false }

iterator.reset();
console.log(iterator.next()); // { value: 1, done: false }

// ========================================
// RANGE ITERATOR
// ========================================

function createRange(start, end, step = 1) {
  let current = start;
  
  return {
    next() {
      if (current <= end) {
        const value = current;
        current += step;
        return { value, done: false };
      }
      return { value: undefined, done: true };
    },
    
    [Symbol.iterator]() {
      return this;
    }
  };
}

const range = createRange(1, 10, 2);
for (const num of range) {
  console.log(num); // 1, 3, 5, 7, 9
}
```

### Pattern 5: State Machine

```javascript
// ========================================
// SIMPLE STATE MACHINE
// ========================================

function createStateMachine(initialState, transitions) {
  let currentState = initialState;
  const listeners = [];
  
  return {
    getState() {
      return currentState;
    },
    
    transition(action) {
      const nextState = transitions[currentState]?.[action];
      
      if (nextState) {
        const previousState = currentState;
        currentState = nextState;
        
        // Notify listeners
        listeners.forEach(listener => {
          listener(previousState, currentState, action);
        });
        
        return true;
      }
      
      return false;
    },
    
    can(action) {
      return !!transitions[currentState]?.[action];
    },
    
    subscribe(listener) {
      listeners.push(listener);
      
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };
}

// Traffic light example
const trafficLight = createStateMachine('red', {
  red: { next: 'green' },
  green: { next: 'yellow' },
  yellow: { next: 'red' }
});

// Subscribe to state changes
const unsubscribe = trafficLight.subscribe((prev, next, action) => {
  console.log(`${prev} -> ${next} (${action})`);
});

console.log(trafficLight.getState()); // "red"
trafficLight.transition('next'); // "red -> green (next)"
trafficLight.transition('next'); // "green -> yellow (next)"
trafficLight.transition('next'); // "yellow -> red (next)"

unsubscribe(); // Stop listening
```

### Pattern 6: Lazy Evaluation

```javascript
// ========================================
// LAZY EVALUATION WITH CLOSURES
// ========================================

function lazy(fn) {
  let cached = false;
  let result;
  
  return function() {
    if (!cached) {
      result = fn();
      cached = true;
    }
    return result;
  };
}

const expensiveOperation = lazy(() => {
  console.log('Computing expensive result...');
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

console.log('Before first call');
console.log(expensiveOperation()); // "Computing expensive result..." then result
console.log('Before second call');
console.log(expensiveOperation()); // Just returns cached result

// ========================================
// LAZY SEQUENCE
// ========================================

function createLazySequence(generator) {
  const cache = [];
  let index = 0;
  
  return {
    get(n) {
      while (cache.length <= n) {
        cache.push(generator(cache.length));
      }
      return cache[n];
    },
    
    take(n) {
      const result = [];
      for (let i = 0; i < n; i++) {
        result.push(this.get(i));
      }
      return result;
    }
  };
}

// Fibonacci sequence
const fibonacci = createLazySequence((n) => {
  if (n <= 1) return n;
  return fibonacci.get(n - 1) + fibonacci.get(n - 2);
});

console.log(fibonacci.get(10)); // 55
console.log(fibonacci.take(10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

---

## Memory Management

### Understanding Memory with Closures

```javascript
// ========================================
// MEMORY RETENTION
// ========================================

function createClosure() {
  const largeArray = new Array(1000000).fill('data');
  const smallValue = 42;
  
  return function() {
    // This closure keeps BOTH largeArray and smallValue in memory
    // Even though it only uses smallValue
    return smallValue;
  };
}

const closure = createClosure();
// largeArray is still in memory!

// ========================================
// MEMORY OPTIMIZATION
// ========================================

function createOptimizedClosure() {
  const largeArray = new Array(1000000).fill('data');
  const smallValue = 42;
  
  // Process largeArray if needed
  // const processed = largeArray.length;
  
  // Return closure that only captures what it needs
  return function() {
    return smallValue;
  };
  // largeArray can be garbage collected after this point
}

// ========================================
// EXPLICIT CLEANUP
// ========================================

function createCleanableClosure() {
  let data = new Array(1000000).fill('data');
  
  return {
    getData() {
      return data ? data.length : null;
    },
    
    cleanup() {
      data = null; // Allow garbage collection
    }
  };
}

const cleanable = createCleanableClosure();
console.log(cleanable.getData()); // 1000000
cleanable.cleanup();
console.log(cleanable.getData()); // null
// data can now be garbage collected
```

### Memory Leak Patterns

```javascript
// ========================================
// LEAK 1: FORGOTTEN TIMERS
// ========================================

function leakyTimer() {
  const data = new Array(1000000).fill('data');
  
  setInterval(() => {
    console.log(data.length);
  }, 1000);
  
  // Timer keeps running and retaining 'data' forever!
}

// Fixed version
function fixedTimer() {
  const data = new Array(1000000).fill('data');
  
  const timerId = setInterval(() => {
    console.log(data.length);
  }, 1000);
  
  // Return cleanup function
  return () => {
    clearInterval(timerId);
  };
}

const cleanup = fixedTimer();
// Later: cleanup(); // Stops timer and allows GC

// ========================================
// LEAK 2: EVENT LISTENERS
// ========================================

function leakyListener() {
  const data = new Array(1000000).fill('data');
  
  document.addEventListener('click', function() {
    console.log(data.length);
  });
  
  // Listener keeps 'data' in memory forever!
}

// Fixed version
function fixedListener() {
  const data = new Array(1000000).fill('data');
  
  const handler = function() {
    console.log(data.length);
  };
  
  document.addEventListener('click', handler);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('click', handler);
  };
}

const removeListener = fixedListener();
// Later: removeListener(); // Removes listener and allows GC

// ========================================
// LEAK 3: CIRCULAR REFERENCES (rare in modern JS)
// ========================================

function createCircular() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2;
  obj2.ref = obj1;
  
  return function() {
    return obj1;
  };
}

// Modern JS engines handle this, but be aware
```

### WeakMap for Memory-Efficient Closures

```javascript
// ========================================
// USING WEAKMAP FOR PRIVATE DATA
// ========================================

const privateData = new WeakMap();

function createObject(data) {
  const obj = {
    getData() {
      return privateData.get(this);
    },
    
    setData(newData) {
      privateData.set(this, newData);
    }
  };
  
  privateData.set(obj, data);
  return obj;
}

let obj = createObject({ secret: 'value' });
console.log(obj.getData()); // { secret: 'value' }

obj = null; // When obj is GC'd, its entry in WeakMap is also GC'd

// ========================================
// COMPARISON: CLOSURE VS WEAKMAP
// ========================================

// Closure approach (keeps data in memory)
function withClosure() {
  const instances = [];
  
  return {
    create(data) {
      const instance = {
        getData() {
          return data;
        }
      };
      instances.push(instance);
      return instance;
    }
  };
}

// WeakMap approach (allows GC)
function withWeakMap() {
  const privateData = new WeakMap();
  
  return {
    create(data) {
      const instance = {
        getData() {
          return privateData.get(this);
        }
      };
      privateData.set(instance, data);
      return instance;
    }
  };
}
```

---

## Performance Considerations

### Closure Creation Cost

```javascript
// ========================================
// EXPENSIVE: CREATING CLOSURES IN LOOPS
// ========================================

// Bad: Creates new closure on every iteration
function createHandlersBad(items) {
  const handlers = [];
  
  for (let i = 0; i < items.length; i++) {
    handlers.push(function() {
      console.log(items[i]); // New closure each time
    });
  }
  
  return handlers;
}

// Good: Reuse closure
function createHandlersGood(items) {
  function createHandler(item) {
    return function() {
      console.log(item);
    };
  }
  
  return items.map(createHandler);
}

// Better: Avoid closure if possible
function createHandlersBetter(items) {
  return items.map(item => () => console.log(item));
}

// ========================================
// BENCHMARK EXAMPLE
// ========================================

function benchmarkClosures() {
  const iterations = 1000000;
  
  // Test 1: Creating closures
  console.time('Creating closures');
  for (let i = 0; i < iterations; i++) {
    (function(x) {
      return function() {
        return x;
      };
    })(i);
  }
  console.timeEnd('Creating closures');
  
  // Test 2: Regular functions
  console.time('Regular functions');
  for (let i = 0; i < iterations; i++) {
    (function(x) {
      return x;
    })(i);
  }
  console.timeEnd('Regular functions');
}

// benchmarkClosures();
```

### Optimizing Scope Chain Access

```javascript
// ========================================
// SLOW: DEEP SCOPE CHAIN
// ========================================

function slow() {
  const config = {
    api: {
      endpoint: {
        url: 'https://api.example.com',
        timeout: 5000
      }
    }
  };
  
  return function process() {
    // Accesses config multiple times through scope chain
    for (let i = 0; i < 1000; i++) {
      fetch(config.api.endpoint.url, {
        timeout: config.api.endpoint.timeout
      });
    }
  };
}

// ========================================
// FAST: CACHE FREQUENTLY ACCESSED VALUES
// ========================================

function fast() {
  const config = {
    api: {
      endpoint: {
        url: 'https://api.example.com',
        timeout: 5000
      }
    }
  };
  
  return function process() {
    // Cache values in local scope
    const url = config.api.endpoint.url;
    const timeout = config.api.endpoint.timeout;
    
    for (let i = 0; i < 1000; i++) {
      fetch(url, { timeout });
    }
  };
}
```


---

## Advanced Techniques

### Technique 1: Closure Composition

```javascript
// ========================================
// COMPOSING CLOSURES
// ========================================

function compose(...fns) {
  return function(x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

const composed = compose(subtract2, multiply3, add5);
console.log(composed(10)); // ((10 + 5) * 3) - 2 = 43

// ========================================
// PIPE (LEFT TO RIGHT)
// ========================================

function pipe(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}

const piped = pipe(add5, multiply3, subtract2);
console.log(piped(10)); // ((10 + 5) * 3) - 2 = 43
```

### Technique 2: Recursive Closures

```javascript
// ========================================
// RECURSIVE CLOSURE
// ========================================

function createRecursiveCounter(max) {
  let count = 0;
  
  return function increment() {
    if (count < max) {
      count++;
      console.log(count);
      setTimeout(increment, 1000); // Recursive call
    } else {
      console.log('Done!');
    }
  };
}

const counter = createRecursiveCounter(5);
// counter(); // Counts from 1 to 5, one per second

// ========================================
// RECURSIVE MEMOIZATION
// ========================================

function createMemoizedRecursive() {
  const cache = {};
  
  return function fibonacci(n) {
    if (n in cache) {
      return cache[n];
    }
    
    if (n <= 1) {
      return n;
    }
    
    cache[n] = fibonacci(n - 1) + fibonacci(n - 2);
    return cache[n];
  };
}

const fib = createMemoizedRecursive();
console.log(fib(40)); // Fast! (with memoization)
```

### Technique 3: Closure with Proxy

```javascript
// ========================================
// CLOSURE + PROXY FOR VALIDATION
// ========================================

function createValidatedObject(initialData, validators) {
  let data = { ...initialData };
  
  return new Proxy({}, {
    get(target, prop) {
      if (prop === 'getData') {
        return () => ({ ...data });
      }
      return data[prop];
    },
    
    set(target, prop, value) {
      const validator = validators[prop];
      
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for ${prop}: ${value}`);
      }
      
      data[prop] = value;
      return true;
    }
  });
}

const user = createValidatedObject(
  { name: 'John', age: 30 },
  {
    age: (value) => typeof value === 'number' && value >= 0 && value <= 150,
    name: (value) => typeof value === 'string' && value.length > 0
  }
);

console.log(user.name); // "John"
user.age = 31; // OK
// user.age = -5; // Error: Invalid value for age: -5
// user.age = 'thirty'; // Error: Invalid value for age: thirty
```

### Technique 4: Async Closures

```javascript
// ========================================
// ASYNC CLOSURE PATTERNS
// ========================================

function createAsyncQueue() {
  const queue = [];
  let processing = false;
  
  async function processQueue() {
    if (processing || queue.length === 0) {
      return;
    }
    
    processing = true;
    
    while (queue.length > 0) {
      const task = queue.shift();
      try {
        await task();
      } catch (error) {
        console.error('Task failed:', error);
      }
    }
    
    processing = false;
  }
  
  return {
    add(task) {
      queue.push(task);
      processQueue();
    },
    
    size() {
      return queue.length;
    },
    
    isProcessing() {
      return processing;
    }
  };
}

const queue = createAsyncQueue();

queue.add(async () => {
  console.log('Task 1 start');
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Task 1 done');
});

queue.add(async () => {
  console.log('Task 2 start');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Task 2 done');
});

// ========================================
// RATE LIMITER WITH CLOSURES
// ========================================

function createRateLimiter(maxCalls, timeWindow) {
  const calls = [];
  
  return async function(fn) {
    const now = Date.now();
    
    // Remove old calls outside time window
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }
    
    if (calls.length >= maxCalls) {
      const oldestCall = calls[0];
      const waitTime = timeWindow - (now - oldestCall);
      
      console.log(`Rate limit reached. Waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return this(fn); // Retry
    }
    
    calls.push(now);
    return fn();
  };
}

const rateLimited = createRateLimiter(3, 1000); // 3 calls per second

// Usage
async function makeApiCall() {
  await rateLimited(() => {
    console.log('API call made at', Date.now());
    return fetch('https://api.example.com/data');
  });
}
```

### Technique 5: Closure-based Middleware

```javascript
// ========================================
// MIDDLEWARE PATTERN WITH CLOSURES
// ========================================

function createMiddlewareChain() {
  const middlewares = [];
  
  return {
    use(middleware) {
      middlewares.push(middleware);
      return this;
    },
    
    execute(context) {
      let index = 0;
      
      function next() {
        if (index >= middlewares.length) {
          return Promise.resolve();
        }
        
        const middleware = middlewares[index++];
        return Promise.resolve(middleware(context, next));
      }
      
      return next();
    }
  };
}

// Usage
const app = createMiddlewareChain();

app.use(async (ctx, next) => {
  console.log('Middleware 1: Before');
  await next();
  console.log('Middleware 1: After');
});

app.use(async (ctx, next) => {
  console.log('Middleware 2: Before');
  ctx.data = 'modified';
  await next();
  console.log('Middleware 2: After');
});

app.use(async (ctx, next) => {
  console.log('Middleware 3: Handler');
  console.log('Context:', ctx);
});

// Execute
app.execute({ data: 'initial' });
/*
Output:
Middleware 1: Before
Middleware 2: Before
Middleware 3: Handler
Context: { data: 'modified' }
Middleware 2: After
Middleware 1: After
*/
```

---

## Common Pitfalls

### Pitfall 1: Loop Variable Closure

```javascript
// ========================================
// PROBLEM: VAR IN LOOP
// ========================================

// Wrong
var callbacks = [];
for (var i = 0; i < 3; i++) {
  callbacks.push(function() {
    console.log(i);
  });
}

callbacks[0](); // 3 (not 0!)
callbacks[1](); // 3 (not 1!)
callbacks[2](); // 3 (not 2!)

// ========================================
// SOLUTION 1: USE LET
// ========================================

var callbacks2 = [];
for (let i = 0; i < 3; i++) {
  callbacks2.push(function() {
    console.log(i);
  });
}

callbacks2[0](); // 0 ✓
callbacks2[1](); // 1 ✓
callbacks2[2](); // 2 ✓

// ========================================
// SOLUTION 2: IIFE
// ========================================

var callbacks3 = [];
for (var i = 0; i < 3; i++) {
  (function(j) {
    callbacks3.push(function() {
      console.log(j);
    });
  })(i);
}

callbacks3[0](); // 0 ✓
callbacks3[1](); // 1 ✓
callbacks3[2](); // 2 ✓
```

### Pitfall 2: Accidental Global Variables

```javascript
// ========================================
// PROBLEM: MISSING VAR/LET/CONST
// ========================================

function createClosure() {
  // Forgot 'let' - creates global variable!
  count = 0;
  
  return function() {
    return ++count;
  };
}

const counter1 = createClosure();
const counter2 = createClosure();

console.log(counter1()); // 1
console.log(counter2()); // 2 (shares same global 'count'!)

// ========================================
// SOLUTION: ALWAYS USE VAR/LET/CONST
// ========================================

function createClosureFixed() {
  let count = 0; // Properly scoped
  
  return function() {
    return ++count;
  };
}

const counter3 = createClosureFixed();
const counter4 = createClosureFixed();

console.log(counter3()); // 1
console.log(counter4()); // 1 (separate 'count')
```

### Pitfall 3: Memory Leaks

```javascript
// ========================================
// PROBLEM: RETAINING LARGE OBJECTS
// ========================================

function createLeakyHandler() {
  const largeData = new Array(1000000).fill('data');
  
  // This closure keeps largeData in memory
  document.addEventListener('click', function() {
    console.log('Clicked');
    // Doesn't even use largeData!
  });
}

// ========================================
// SOLUTION: LIMIT CLOSURE SCOPE
// ========================================

function createFixedHandler() {
  const largeData = new Array(1000000).fill('data');
  const summary = largeData.length; // Extract what you need
  
  // Closure only captures 'summary'
  document.addEventListener('click', function() {
    console.log('Clicked', summary);
  });
  
  // largeData can be garbage collected
}
```

### Pitfall 4: This Binding in Closures

```javascript
// ========================================
// PROBLEM: LOSING 'THIS' CONTEXT
// ========================================

const obj = {
  name: 'MyObject',
  
  method() {
    setTimeout(function() {
      console.log(this.name); // undefined (this is window/global)
    }, 1000);
  }
};

// obj.method();

// ========================================
// SOLUTION 1: ARROW FUNCTION
// ========================================

const obj2 = {
  name: 'MyObject',
  
  method() {
    setTimeout(() => {
      console.log(this.name); // "MyObject" (lexical this)
    }, 1000);
  }
};

// ========================================
// SOLUTION 2: BIND
// ========================================

const obj3 = {
  name: 'MyObject',
  
  method() {
    setTimeout(function() {
      console.log(this.name);
    }.bind(this), 1000);
  }
};

// ========================================
// SOLUTION 3: SAVE THIS
// ========================================

const obj4 = {
  name: 'MyObject',
  
  method() {
    const self = this;
    setTimeout(function() {
      console.log(self.name);
    }, 1000);
  }
};
```

---

## Interview Questions

### Q1: What is a closure?

**Answer:**

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**Key points:**
- Closures are created when a function is defined inside another function
- The inner function maintains a reference to the outer function's variables
- This allows the inner function to access those variables even after the outer function has finished executing

**Example:**
```javascript
function outer() {
  const message = "Hello";
  
  function inner() {
    console.log(message); // Accesses outer variable
  }
  
  return inner;
}

const closure = outer();
closure(); // "Hello" - still has access to 'message'
```

### Q2: Explain the practical uses of closures

**Answer:**

**1. Data Privacy/Encapsulation:**
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private
  
  return {
    deposit(amount) { balance += amount; },
    getBalance() { return balance; }
  };
}
```

**2. Function Factories:**
```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
```

**3. Event Handlers:**
```javascript
function setupButton(id) {
  let clickCount = 0;
  
  button.addEventListener('click', function() {
    clickCount++;
    console.log(`Button ${id} clicked ${clickCount} times`);
  });
}
```

**4. Memoization:**
```javascript
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}
```

### Q3: What's the difference between closure and scope?

**Answer:**

**Scope:**
- Determines where variables are accessible
- Set at author-time (when you write code)
- Types: global, function, block

**Closure:**
- A function that retains access to its outer scope
- Created at runtime when function is defined
- Allows function to access outer variables even after outer function returns

**Example:**
```javascript
function outer() {
  const x = 10; // x is in outer's scope
  
  function inner() {
    console.log(x); // inner closes over x
  }
  
  return inner;
}

const fn = outer();
// outer's scope is gone, but closure keeps x alive
fn(); // 10
```

### Q4: Explain the loop closure problem

**Question:** Why does this code print "3, 3, 3" instead of "0, 1, 2"?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

**Answer:**

**Problem:**
- `var` is function-scoped, not block-scoped
- All three callbacks close over the same `i` variable
- By the time callbacks execute, the loop has finished and `i` is 3

**Solutions:**

**1. Use `let` (block-scoped):**
```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Each iteration has its own 'i'
  }, 1000);
}
```

**2. Use IIFE:**
```javascript
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, 1000);
  })(i);
}
```

**3. Pass parameter to setTimeout:**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function(j) {
    console.log(j);
  }, 1000, i);
}
```

### Q5: How do closures affect memory?

**Answer:**

**Memory Retention:**
- Closures keep outer variables in memory
- Variables persist as long as closure exists
- Can lead to memory leaks if not careful

**Example:**
```javascript
function createClosure() {
  const largeArray = new Array(1000000);
  
  return function() {
    return largeArray.length;
  };
}

const fn = createClosure();
// largeArray stays in memory as long as fn exists
```

**Best Practices:**
1. Only capture variables you need
2. Clean up event listeners and timers
3. Set closures to null when done
4. Use WeakMap for object associations

```javascript
// Good: Only capture what you need
function optimized() {
  const largeArray = new Array(1000000);
  const length = largeArray.length; // Extract value
  
  return function() {
    return length; // Only captures 'length'
  };
  // largeArray can be garbage collected
}
```

### Q6: Can you modify variables in a closure?

**Answer:**

Yes! Closures have read-write access to outer variables.

```javascript
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      count++; // Modifies outer variable
      return count;
    },
    decrement() {
      count--; // Modifies outer variable
      return count;
    },
    getValue() {
      return count; // Reads outer variable
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getValue());  // 1
```

All methods share and can modify the same `count` variable.

---

## Practice Problems

### Problem 1: Create a Private Counter

```javascript
// Create a counter with private state
// Requirements:
// - increment() increases by 1
// - decrement() decreases by 1
// - getValue() returns current value
// - reset() sets to initial value
// - State should not be directly accessible

// Solution:
function createCounter(initialValue = 0) {
  let count = initialValue;
  const initial = initialValue;
  
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getValue() {
      return count;
    },
    reset() {
      count = initial;
      return count;
    }
  };
}

// Test
const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.reset());     // 10
console.log(counter.getValue());  // 10
```

### Problem 2: Implement a Cache

```javascript
// Create a caching function
// Requirements:
// - Cache function results
// - Support cache expiration
// - Support cache clearing

// Solution:
function createCache(ttl = 5000) {
  const cache = new Map();
  
  return {
    set(key, value) {
      cache.set(key, {
        value,
        timestamp: Date.now()
      });
    },
    
    get(key) {
      const cached = cache.get(key);
      
      if (!cached) {
        return undefined;
      }
      
      if (Date.now() - cached.timestamp > ttl) {
        cache.delete(key);
        return undefined;
      }
      
      return cached.value;
    },
    
    has(key) {
      return this.get(key) !== undefined;
    },
    
    clear() {
      cache.clear();
    },
    
    size() {
      return cache.size;
    }
  };
}

// Test
const cache = createCache(3000);
cache.set('user', { name: 'John' });
console.log(cache.get('user')); // { name: 'John' }
setTimeout(() => {
  console.log(cache.get('user')); // undefined (expired)
}, 3500);
```

### Problem 3: Create a Function Queue

```javascript
// Create a function queue that executes functions in order
// Requirements:
// - add(fn) adds function to queue
// - execute() runs all functions in order
// - clear() empties the queue

// Solution:
function createQueue() {
  const queue = [];
  
  return {
    add(fn) {
      if (typeof fn === 'function') {
        queue.push(fn);
      }
      return this;
    },
    
    execute() {
      const results = [];
      while (queue.length > 0) {
        const fn = queue.shift();
        results.push(fn());
      }
      return results;
    },
    
    clear() {
      queue.length = 0;
      return this;
    },
    
    size() {
      return queue.length;
    }
  };
}

// Test
const queue = createQueue();
queue
  .add(() => console.log('First'))
  .add(() => console.log('Second'))
  .add(() => console.log('Third'));

queue.execute(); // Logs: First, Second, Third
console.log(queue.size()); // 0
```

### Problem 4: Implement Partial Application

```javascript
// Create a partial application function
// Requirements:
// - Takes a function and some arguments
// - Returns a new function that takes remaining arguments
// - Combines all arguments and calls original function

// Solution:
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

// Test
function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, 'Hello');
const sayHelloJohn = partial(greet, 'Hello', 'John');

console.log(sayHello('Alice', '!'));      // "Hello, Alice!"
console.log(sayHelloJohn('!'));           // "Hello, John!"
console.log(sayHello('Bob', '?'));        // "Hello, Bob?"
```

### Problem 5: Create a Rate Limiter

```javascript
// Create a rate limiter
// Requirements:
// - Limit function calls to N per time window
// - Queue excess calls
// - Execute queued calls when possible

// Solution:
function createRateLimiter(maxCalls, timeWindow) {
  const calls = [];
  const queue = [];
  
  function canCall() {
    const now = Date.now();
    
    // Remove old calls
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }
    
    return calls.length < maxCalls;
  }
  
  function processQueue() {
    while (queue.length > 0 && canCall()) {
      const fn = queue.shift();
      execute(fn);
    }
  }
  
  function execute(fn) {
    calls.push(Date.now());
    fn();
    setTimeout(processQueue, timeWindow / maxCalls);
  }
  
  return function(fn) {
    if (canCall()) {
      execute(fn);
    } else {
      queue.push(fn);
    }
  };
}

// Test
const rateLimited = createRateLimiter(3, 1000); // 3 calls per second

for (let i = 0; i < 10; i++) {
  rateLimited(() => {
    console.log(`Call ${i} at ${Date.now()}`);
  });
}
```

---

## Summary

### Key Takeaways

1. **Closures = Function + Lexical Environment**
   - Inner function retains access to outer variables
   - Persists even after outer function returns

2. **Practical Applications**
   - Data privacy and encapsulation
   - Function factories
   - Event handlers
   - Memoization
   - Partial application

3. **Memory Considerations**
   - Closures keep variables in memory
   - Can cause memory leaks if not careful
   - Clean up timers and event listeners

4. **Common Patterns**
   - Module pattern
   - Counter pattern
   - Once function
   - Debounce/throttle
   - Iterator pattern

5. **Pitfalls to Avoid**
   - Loop variable closure (use let)
   - Accidental globals
   - Memory leaks
   - This binding issues

### Best Practices

✅ **DO:**
- Use closures for data privacy
- Clean up event listeners and timers
- Cache frequently accessed outer variables
- Use let/const in loops
- Understand memory implications

❌ **DON'T:**
- Create unnecessary closures
- Forget to clean up references
- Use var in loops with async callbacks
- Retain large objects unnecessarily
- Ignore memory leaks

---

[← Back to Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [Next: Prototypes →](./04-prototypes-inheritance.md)
