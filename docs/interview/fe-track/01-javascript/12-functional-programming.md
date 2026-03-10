# Functional Programming in JavaScript
## Principles and Patterns

**English:** Functional programming is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing state and mutable data.

**Tiếng Việt:** Lập trình hàm là mô hình lập trình coi tính toán như việc đánh giá các hàm toán học và tránh thay đổi trạng thái và dữ liệu có thể thay đổi.

## Core Concepts

### Pure Functions
**Definition:** Functions that always return same output for same input and have no side effects.

**Characteristics:**
- Deterministic
- No side effects
- Referential transparency
- Testable
- Cacheable

**Examples:**
```javascript
// Pure
const add = (a, b) => a + b;
const multiply = (x, y) => x * y;

// Impure
let count = 0;
const increment = () => count++; // Modifies external state

const random = () => Math.random(); // Non-deterministic
```

### Immutability
**Principle:** Data cannot be changed after creation.

**Benefits:**
- Predictable code
- Easier debugging
- Thread-safe
- Time-travel debugging

**Techniques:**
```javascript
// Arrays
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // Don't mutate
const filtered = arr.filter(x => x > 1);
const mapped = arr.map(x => x * 2);

// Objects
const obj = { name: 'John' };
const updated = { ...obj, age: 30 };
const modified = Object.assign({}, obj, { age: 30 });

// Deep freeze
const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null) {
      deepFreeze(val);
    }
  });
  return obj;
};
```

### First-Class Functions
**Concept:** Functions are values that can be assigned, passed, and returned.

```javascript
// Assign to variable
const greet = function(name) {
  return `Hello, ${name}`;
};

// Pass as argument
const execute = (fn, value) => fn(value);
execute(greet, 'John');

// Return from function
const createMultiplier = (factor) => {
  return (number) => number * factor;
};
const double = createMultiplier(2);
```

### Higher-Order Functions
**Definition:** Functions that take functions as arguments or return functions.

**Common HOFs:**
```javascript
// map
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);

// filter
const evens = numbers.filter(x => x % 2 === 0);

// reduce
const sum = numbers.reduce((acc, x) => acc + x, 0);

// Custom HOF
const withLogging = (fn) => {
  return (...args) => {
    console.log(`Calling with ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };
};

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
```

## Function Composition

### Compose and Pipe

**Compose (right to left):**
```javascript
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const add1 = x => x + 1;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

const calculate = compose(subtract3, multiply2, add1);
calculate(5); // ((5 + 1) * 2) - 3 = 9
```

**Pipe (left to right):**
```javascript
const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

const calculate = pipe(add1, multiply2, subtract3);
calculate(5); // ((5 + 1) * 2) - 3 = 9
```

**Practical Example:**
```javascript
const users = [
  { name: 'John', age: 30, active: true },
  { name: 'Jane', age: 25, active: false },
  { name: 'Bob', age: 35, active: true }
];

const getActiveUsers = users => users.filter(u => u.active);
const getNames = users => users.map(u => u.name);
const sortAlphabetically = names => names.sort();

const getActiveUserNames = pipe(
  getActiveUsers,
  getNames,
  sortAlphabetically
);

getActiveUserNames(users); // ['Bob', 'John']
```

## Currying

### Concept
**Definition:** Transform function with multiple arguments into sequence of functions with single argument.

**Manual Currying:**
```javascript
// Regular function
const add = (a, b, c) => a + b + c;

// Curried version
const curriedAdd = a => b => c => a + b + c;

curriedAdd(1)(2)(3); // 6

// Partial application
const add1 = curriedAdd(1);
const add1and2 = add1(2);
add1and2(3); // 6
```

**Generic Curry:**
```javascript
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
```

**Practical Use:**
```javascript
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));

const double = x => x * 2;
const isEven = x => x % 2 === 0;

const doubleAll = map(double);
const filterEvens = filter(isEven);

const numbers = [1, 2, 3, 4, 5];
doubleAll(numbers); // [2, 4, 6, 8, 10]
filterEvens(numbers); // [2, 4]
```

## Partial Application

**Concept:** Fix some arguments of function, producing function with fewer arguments.

```javascript
const partial = (fn, ...fixedArgs) => {
  return (...remainingArgs) => {
    return fn(...fixedArgs, ...remainingArgs);
  };
};

const greet = (greeting, name) => `${greeting}, ${name}!`;

const sayHello = partial(greet, 'Hello');
sayHello('John'); // "Hello, John!"

const sayHi = partial(greet, 'Hi');
sayHi('Jane'); // "Hi, Jane!"
```

## Recursion

### Basics
**Definition:** Function that calls itself.

**Structure:**
- Base case (termination)
- Recursive case (self-call)

**Examples:**
```javascript
// Factorial
const factorial = n => {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Recursive case
};

// Fibonacci
const fibonacci = n => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// Sum array
const sum = arr => {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
};
```

### Tail Call Optimization
**Concept:** Recursive call is last operation in function.

```javascript
// Not tail recursive
const factorial = n => {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Multiplication after call
};

// Tail recursive
const factorialTail = (n, acc = 1) => {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // Call is last operation
};
```

## Functors and Monads

### Functor
**Definition:** Object with map method that preserves structure.

```javascript
// Array is a functor
[1, 2, 3].map(x => x * 2); // [2, 4, 6]

// Custom functor
class Box {
  constructor(value) {
    this.value = value;
  }
  
  map(fn) {
    return new Box(fn(this.value));
  }
  
  fold(fn) {
    return fn(this.value);
  }
}

const result = new Box(5)
  .map(x => x * 2)
  .map(x => x + 1)
  .fold(x => x); // 11
```

### Maybe Monad
**Purpose:** Handle null/undefined safely.

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }
  
  static of(value) {
    return new Maybe(value);
  }
  
  isNothing() {
    return this.value === null || this.value === undefined;
  }
  
  map(fn) {
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }
  
  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }
  
  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }
}

// Usage
const user = { name: 'John', address: { city: 'NYC' } };

const getCity = user =>
  Maybe.of(user)
    .map(u => u.address)
    .map(a => a.city)
    .getOrElse('Unknown');

getCity(user); // 'NYC'
getCity({}); // 'Unknown'
```

### Either Monad
**Purpose:** Handle errors functionally.

```javascript
class Either {
  constructor(value) {
    this.value = value;
  }
  
  static left(value) {
    const either = new Either(value);
    either.isLeft = true;
    return either;
  }
  
  static right(value) {
    const either = new Either(value);
    either.isLeft = false;
    return either;
  }
  
  map(fn) {
    return this.isLeft ? this : Either.right(fn(this.value));
  }
  
  fold(leftFn, rightFn) {
    return this.isLeft ? leftFn(this.value) : rightFn(this.value);
  }
}

// Usage
const divide = (a, b) =>
  b === 0
    ? Either.left('Division by zero')
    : Either.right(a / b);

divide(10, 2)
  .map(x => x * 2)
  .fold(
    error => `Error: ${error}`,
    result => `Result: ${result}`
  ); // "Result: 10"

divide(10, 0)
  .map(x => x * 2)
  .fold(
    error => `Error: ${error}`,
    result => `Result: ${result}`
  ); // "Error: Division by zero"
```

## Lazy Evaluation

**Concept:** Delay computation until result is needed.

```javascript
class Lazy {
  constructor(fn) {
    this.fn = fn;
    this.evaluated = false;
  }
  
  map(fn) {
    return new Lazy(() => fn(this.force()));
  }
  
  force() {
    if (!this.evaluated) {
      this.value = this.fn();
      this.evaluated = true;
    }
    return this.value;
  }
}

// Usage
const expensive = new Lazy(() => {
  console.log('Computing...');
  return 42;
});

// Nothing computed yet
const doubled = expensive.map(x => x * 2);
const added = doubled.map(x => x + 1);

// Computed only when forced
added.force(); // Logs "Computing...", returns 85
added.force(); // Returns 85 (cached)
```

## Transducers

**Concept:** Composable algorithmic transformations.

```javascript
const map = fn => reducer => (acc, val) =>
  reducer(acc, fn(val));

const filter = predicate => reducer => (acc, val) =>
  predicate(val) ? reducer(acc, val) : acc;

const transduce = (xform, reducer, initial, collection) =>
  collection.reduce(xform(reducer), initial);

// Usage
const double = x => x * 2;
const isEven = x => x % 2 === 0;
const append = (acc, val) => [...acc, val];

const xform = compose(
  filter(isEven),
  map(double)
);

const numbers = [1, 2, 3, 4, 5];
transduce(xform, append, [], numbers); // [4, 8]
```

## Point-Free Style

**Concept:** Define functions without mentioning arguments.

```javascript
// Not point-free
const double = x => x * 2;
const doubleAll = arr => arr.map(x => double(x));

// Point-free
const doubleAll = map(double);

// More examples
const sum = reduce(add, 0);
const getNames = map(prop('name'));
const getActiveUsers = filter(prop('active'));
```

## Memoization

**Concept:** Cache function results for same inputs.

```javascript
const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Usage
const fibonacci = memoize(n => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(40); // Fast with memoization
```

## Practical Patterns

### Data Pipeline
```javascript
const processUsers = pipe(
  filter(user => user.active),
  map(user => ({ ...user, name: user.name.toUpperCase() })),
  sortBy('age'),
  take(10)
);
```

### Error Handling
```javascript
const safeDiv = (a, b) =>
  b === 0
    ? Either.left('Division by zero')
    : Either.right(a / b);

const calculate = (x, y) =>
  safeDiv(x, y)
    .map(result => result * 2)
    .map(result => result + 1)
    .fold(
      error => ({ error }),
      result => ({ result })
    );
```

### Async Operations
```javascript
const fetchUser = id =>
  fetch(`/api/users/${id}`)
    .then(res => res.json())
    .then(Either.right)
    .catch(Either.left);

const processUser = pipe(
  map(user => user.name),
  map(name => name.toUpperCase())
);
```

## Interview Questions

**Q: What is a pure function?**
A: Function that always returns same output for same input and has no side effects. Benefits: testable, cacheable, predictable, parallelizable.

**Q: Explain function composition.**
A: Combining multiple functions to create new function. Compose applies right-to-left, pipe applies left-to-right. Enables building complex operations from simple functions.

**Q: What is currying?**
A: Transforming function with multiple arguments into sequence of functions with single argument. Enables partial application and function specialization.

**Q: Difference between map, filter, reduce?**
A: map transforms each element, filter selects elements, reduce accumulates to single value. All are pure, return new arrays/values.

**Q: What is immutability?**
A: Data cannot be changed after creation. Benefits: predictable code, easier debugging, time-travel debugging, thread-safe operations.

---

[← Back to ES6 Features](./11-es6-features-deep.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)
