# JavaScript Fundamentals: Definitions, Interview Questions & Answers

## 1. Variables & Data Types

**Definition:** Variables store data. JavaScript has primitive types (number, string, boolean, null, undefined, symbol, bigint) and reference types (object, array, function).

**Common Questions:**

- What is the difference between `var`, `let`, and `const`?
- What are primitive vs reference types?
- How does type coercion work in JavaScript?

**Answers:**

- `var` is function-scoped and hoisted; `let` and `const` are block-scoped. `const` cannot be reassigned.
- Primitive types are immutable and compared by value; reference types are mutable and compared by reference.
- Type coercion is JavaScript's automatic conversion between types, e.g., `'5' + 1` becomes `'51'`.

---

## 2. Scope & Hoisting

**Definition:** Scope determines variable accessibility. Hoisting moves declarations to the top of scope.

**Common Questions:**

- What is lexical scope?
- How does hoisting work?
- What is the Temporal Dead Zone?

**Answers:**

- Lexical scope means a variable's scope is determined by its position in code.
- Hoisting moves declarations (not initializations) to the top. `var` is hoisted and initialized as `undefined`; `let`/`const` are hoisted but not initialized.
- The Temporal Dead Zone is the period between entering scope and variable declaration with `let`/`const` where the variable cannot be accessed.

---

## 3. Closures

**Definition:** A closure is a function that remembers its lexical scope even when executed outside that scope.

**Common Questions:**

- What is a closure?
- Give a practical use case for closures.

**Answers:**

- A closure is created when a function accesses variables from its outer scope.
- Use cases: data privacy, function factories, event handlers, currying.

---

## 4. Prototype & Inheritance

**Definition:** Every JS object has a prototype. Inheritance is achieved via the prototype chain.

**Common Questions:**

- How does prototypal inheritance work?
- What is the difference between `__proto__` and `prototype`?

**Answers:**

- Objects inherit properties from their prototype. If a property is not found, JS looks up the prototype chain.
- `prototype` is a property of constructor functions; `__proto__` is an internal property of all objects pointing to their prototype.

---

## 5. The `this` Keyword

**Definition:** `this` refers to the object that is executing the current function.

**Common Questions:**

- How is `this` determined?
- How does `this` behave in arrow functions?

**Answers:**

- `this` is determined by how a function is called: global, object, constructor, call/apply/bind.
- Arrow functions do not have their own `this`; they inherit from the enclosing scope.

---

## 6. ES6+ Features

**Definition:** Modern JavaScript (ES6+) introduced let/const, arrow functions, classes, template literals, destructuring, spread/rest, promises, modules, etc.

**Common Questions:**

- What are arrow functions and how do they differ from regular functions?
- What is destructuring?
- How do promises work?

**Answers:**

- Arrow functions are concise, do not have their own `this`, cannot be used as constructors.
- Destructuring allows unpacking values from arrays/objects into variables.
- Promises represent asynchronous operations; they have `then`, `catch`, and `finally` methods.

---

## 7. Event Loop & Asynchronous JS

**Definition:** The event loop handles async operations by managing the call stack, callback queue, and microtask queue.

**Common Questions:**

- What is the event loop?
- What is the difference between microtasks and macrotasks?

**Answers:**

- The event loop checks the call stack and processes tasks from the callback/microtask queue when the stack is empty.
- Microtasks (promises, mutation observers) are processed before macrotasks (setTimeout, setInterval).

# JavaScript Fundamentals Interview Preparation Guide

## Table of Contents

- [Core Concepts](#core-concepts)
- [Common Interview Questions](#common-interview-questions)
- [Advanced Questions](#advanced-questions)
- [Practice Problems](#practice-problems)
- [Solutions](#solutions)

## Core Concepts

### JavaScript Fundamentals

#### 1. Variables and Data Types

**Definition**: JavaScript has dynamic typing with primitive and reference types.

**Primitive Types**:

- `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`

**Reference Types**:

- `object`, `array`, `function`

#### 2. Scope and Hoisting

**Definition**: Scope determines variable accessibility, hoisting moves declarations to the top.

**Types of Scope**:

- Global scope
- Function scope
- Block scope (ES6)

#### 3. Closures

**Definition**: Function that has access to variables in its outer scope.

#### 4. Prototypes and Inheritance

**Definition**: JavaScript uses prototypal inheritance for object-oriented programming.

## Common Interview Questions

### Q1: Explain the difference between `var`, `let`, and `const`

**Answer**:

- **`var`**: Function-scoped, hoisted, can be redeclared
- **`let`**: Block-scoped, not hoisted, cannot be redeclared
- **`const`**: Block-scoped, not hoisted, cannot be reassigned

**Example**:

```javascript
// var - function scoped
function example() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable
  }
  console.log(x); // 2
}

// let - block scoped
function example() {
  let x = 1;
  if (true) {
    let x = 2; // Different variable
  }
  console.log(x); // 1
}

// const - cannot be reassigned
const PI = 3.14;
PI = 3.15; // Error: Assignment to constant variable
```

### Q2: What is the difference between `==` and `===`?

**Answer**:

- **`==`**: Loose equality (type coercion)
- **`===`**: Strict equality (no type coercion)

**Examples**:

```javascript
console.log(5 == "5"); // true (type coercion)
console.log(5 === "5"); // false (no coercion)

console.log(null == undefined); // true
console.log(null === undefined); // false

console.log(0 == false); // true
console.log(0 === false); // false
```

### Q3: Explain closures with an example

**Answer**:
A closure is a function that has access to variables in its outer scope.

```javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

**Practical Example**:

{% raw %}
```javascript
function createGreeter(greeting) {
  return function (name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = createGreeter("Hello");
const sayGoodbye = createGreeter("Goodbye");

console.log(sayHello("John")); // "Hello, John!"
console.log(sayGoodbye("John")); // "Goodbye, John!"
```
{% endraw %}

### Q4: What is the event loop in JavaScript?

**Answer**:
The event loop is JavaScript's mechanism for handling asynchronous operations.

**How it works**:

1. Synchronous code executes in the call stack
2. Asynchronous operations are moved to Web APIs
3. When complete, callbacks go to the callback queue
4. Event loop checks if call stack is empty
5. If empty, moves callback from queue to stack

**Example**:

```javascript
console.log("1"); // Synchronous

setTimeout(() => {
  console.log("2"); // Asynchronous
}, 0);

console.log("3"); // Synchronous

// Output: 1, 3, 2
```

### Q5: Explain promises and async/await

**Answer**:
Promises represent eventual completion of asynchronous operations.

**Promise Example**:

```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { id: 1, name: "John" };
      resolve(data);
    }, 1000);
  });
};

fetchData()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

**Async/Await Example**:

```javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## Advanced Questions

### Q6: Implement a debounce function

**Answer**:

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

// Only executes after 300ms of no calls
debouncedSearch("hello");
debouncedSearch("hello world");
```

### Q7: Implement a throttle function

**Answer**:

```javascript
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log("Scroll event");
}, 100);
```

### Q8: Deep clone an object

**Answer**:

```javascript
// Method 1: JSON (limited)
function deepCloneJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Method 2: Recursive
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (typeof obj === "object") {
    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// Usage
const original = {
  name: "John",
  age: 30,
  hobbies: ["reading", "gaming"],
  address: {
    city: "New York",
    country: "USA",
  },
};

const cloned = deepClone(original);
```

### Q9: Implement a memoization function

**Answer**:

```javascript
function memoize(func) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveFunction = memoize((n) => {
  console.log("Computing...");
  return n * 2;
});

console.log(expensiveFunction(5)); // Computing... 10
console.log(expensiveFunction(5)); // 10 (from cache)
```

### Q10: Create a custom event emitter

**Answer**:

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Usage
const emitter = new EventEmitter();

emitter.on("userLogin", (user) => {
  console.log(`User logged in: ${user.name}`);
});

emitter.emit("userLogin", { name: "John", id: 1 });
```

## Practice Problems

### Problem 1: Implement Array Methods

Implement your own versions of `map`, `filter`, `reduce`, and `forEach`.

**Solution**:

```javascript
// forEach
Array.prototype.myForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};

// map
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result;
};

// filter
Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// reduce
Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0];
  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};

// Usage
const numbers = [1, 2, 3, 4, 5];

numbers.myForEach((num) => console.log(num));
const doubled = numbers.myMap((num) => num * 2);
const evens = numbers.myFilter((num) => num % 2 === 0);
const sum = numbers.myReduce((acc, num) => acc + num, 0);
```

### Problem 2: Implement a Promise.all

**Solution**:

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          completed++;

          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Usage
const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

promiseAll(promises).then((results) => {
  console.log(results); // [1, 2, 3]
});
```

### Problem 3: Implement a sleep function

**Solution**:

```javascript
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Usage with async/await
async function example() {
  console.log("Start");
  await sleep(2000);
  console.log("After 2 seconds");
}

// Usage with then
sleep(1000).then(() => {
  console.log("After 1 second");
});
```

### Problem 4: Create a singleton pattern

**Solution**:

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }

  getInstance() {
    return this;
  }
}

// Alternative with module pattern
const singleton = (function () {
  let instance;

  function createInstance() {
    return {
      data: "singleton data",
      getData: function () {
        return this.data;
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Usage
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

### Problem 5: Implement a queue with two stacks

**Solution**:

```javascript
class QueueWithStacks {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  enqueue(item) {
    this.stack1.push(item);
  }

  dequeue() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }

    if (this.stack2.length === 0) {
      throw new Error("Queue is empty");
    }

    return this.stack2.pop();
  }

  peek() {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }

    if (this.stack2.length === 0) {
      throw new Error("Queue is empty");
    }

    return this.stack2[this.stack2.length - 1];
  }

  isEmpty() {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}

// Usage
const queue = new QueueWithStacks();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

console.log(queue.dequeue()); // 1
console.log(queue.peek()); // 2
```

### Problem 6: Implement a LRU Cache

**Solution**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Usage
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1
cache.put(3, 3);
console.log(cache.get(2)); // -1 (not found)
```

### Problem 7: Implement a binary search tree

**Solution**:

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) return this;

      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  find(value) {
    if (!this.root) return false;

    let current = this.root;
    let found = false;

    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }

    return found;
  }

  // In-order traversal
  inOrder() {
    const result = [];

    function traverse(node) {
      if (node.left) traverse(node.left);
      result.push(node.value);
      if (node.right) traverse(node.right);
    }

    if (this.root) traverse(this.root);
    return result;
  }
}

// Usage
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(6);
bst.insert(15);
bst.insert(3);
bst.insert(8);

console.log(bst.find(8)); // true
console.log(bst.inOrder()); // [3, 6, 8, 10, 15]
```

### Problem 8: Implement a graph with BFS and DFS

**Solution**:

```javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  removeEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
      (v) => v !== vertex2
    );
    this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
      (v) => v !== vertex1
    );
  }

  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }

  // Breadth First Search
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (queue.length) {
      const currentVertex = queue.shift();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }

    return result;
  }

  // Depth First Search (Recursive)
  dfsRecursive(start) {
    const result = [];
    const visited = {};

    const dfs = (vertex) => {
      if (!vertex) return null;
      visited[vertex] = true;
      result.push(vertex);

      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          return dfs(neighbor);
        }
      });
    };

    dfs(start);
    return result;
  }

  // Depth First Search (Iterative)
  dfsIterative(start) {
    const stack = [start];
    const result = [];
    const visited = {};
    visited[start] = true;

    while (stack.length) {
      const currentVertex = stack.pop();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          stack.push(neighbor);
        }
      });
    }

    return result;
  }
}

// Usage
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");

graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "E");
graph.addEdge("D", "E");
graph.addEdge("D", "F");
graph.addEdge("E", "F");

console.log(graph.bfs("A")); // ["A", "B", "C", "D", "E", "F"]
console.log(graph.dfsRecursive("A")); // ["A", "B", "D", "E", "C", "F"]
console.log(graph.dfsIterative("A")); // ["A", "C", "E", "F", "D", "B"]
```

## Advanced JavaScript Concepts

### Q11: Explain the difference between call, apply, and bind

**Answer**:
All three methods are used to set the `this` context for functions.

```javascript
const person = {
  name: 'John',
  greet: function(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
};

const anotherPerson = { name: 'Jane' };

// call - immediate invocation with individual arguments
console.log(person.greet.call(anotherPerson, 'Hello', '!')); // "Hello, Jane!"

// apply - immediate invocation with array of arguments
console.log(person.greet.apply(anotherPerson, ['Hi', '.'])); // "Hi, Jane."

// bind - returns a new function with bound context
const boundGreet = person.greet.bind(anotherPerson);
console.log(boundGreet('Hey', '?')); // "Hey, Jane?"

// Practical example: Borrowing array methods
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

const array = Array.prototype.slice.call(arrayLike);
console.log(array); // ['a', 'b', 'c']
```

### Q12: What is hoisting and how does it work with different declarations?

**Answer**:
Hoisting is JavaScript's behavior of moving declarations to the top of their scope.

```javascript
// Variable hoisting
console.log(x); // undefined (not ReferenceError)
var x = 5;

// Equivalent to:
// var x;
// console.log(x);
// x = 5;

// Function hoisting
console.log(foo()); // "Hello!" - function declarations are fully hoisted

function foo() {
  return "Hello!";
}

// Function expressions are not hoisted
console.log(bar); // undefined
console.log(bar()); // TypeError: bar is not a function
var bar = function() {
  return "World!";
};

// let and const hoisting (Temporal Dead Zone)
console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 20;

// Class hoisting
console.log(MyClass); // ReferenceError: Cannot access 'MyClass' before initialization
class MyClass {}
```

### Q13: Explain the difference between arrow functions and regular functions

**Answer**:
Arrow functions have several key differences from regular functions:

```javascript
// 1. 'this' binding
const obj = {
  name: 'John',
  
  // Regular function - 'this' is dynamic
  regularMethod: function() {
    console.log(this.name); // 'John'
    
    setTimeout(function() {
      console.log(this.name); // undefined (global context)
    }, 100);
  },
  
  // Arrow function - 'this' is lexical
  arrowMethod: function() {
    console.log(this.name); // 'John'
    
    setTimeout(() => {
      console.log(this.name); // 'John' (inherited from parent)
    }, 100);
  }
};

// 2. Arguments object
function regularFunc() {
  console.log(arguments); // [1, 2, 3]
}

const arrowFunc = () => {
  console.log(arguments); // ReferenceError: arguments is not defined
};

regularFunc(1, 2, 3);

// Arrow functions use rest parameters instead
const arrowWithRest = (...args) => {
  console.log(args); // [1, 2, 3]
};

// 3. Constructor function
function RegularConstructor(name) {
  this.name = name;
}

const ArrowConstructor = (name) => {
  this.name = name;
};

const instance1 = new RegularConstructor('John'); // Works
const instance2 = new ArrowConstructor('Jane'); // TypeError: ArrowConstructor is not a constructor

// 4. Method definitions
const calculator = {
  value: 0,
  
  // Regular method
  add: function(num) {
    this.value += num;
    return this;
  },
  
  // Arrow method (problematic)
  multiply: (num) => {
    this.value *= num; // 'this' refers to global object, not calculator
    return this;
  }
};
```

### Q14: What are generators and iterators?

**Answer**:
Generators are functions that can pause and resume execution, producing iterators.

```javascript
// Basic generator
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
  return 4; // value returned but not iterated
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 4, done: true }

// Infinite generator
function* infiniteCounter() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const counter = infiniteCounter();
console.log(counter.next().value); // 0
console.log(counter.next().value); // 1
console.log(counter.next().value); // 2

// Generator with parameters
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}

// Custom iterator
const iterableObject = {
  data: [1, 2, 3, 4, 5],
  
  [Symbol.iterator]: function() {
    let index = 0;
    const data = this.data;
    
    return {
      next: function() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for (const value of iterableObject) {
  console.log(value); // 1, 2, 3, 4, 5
}

// Async generators
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

(async () => {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2 (with 1 second delays)
  }
})();
```

### Q15: Explain JavaScript's type coercion

**Answer**:
Type coercion is JavaScript's automatic conversion between different data types.

```javascript
// String coercion
console.log(5 + "3"); // "53" (number to string)
console.log("5" + 3); // "53" (number to string)
console.log(String(123)); // "123" (explicit)
console.log(123 + ""); // "123" (implicit)

// Number coercion
console.log("5" - 3); // 2 (string to number)
console.log("5" * 2); // 10 (string to number)
console.log(+"123"); // 123 (unary plus)
console.log(Number("123")); // 123 (explicit)

// Boolean coercion
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean(false)); // false

console.log(Boolean(1)); // true
console.log(Boolean("hello")); // true
console.log(Boolean([])); // true
console.log(Boolean({})); // true

// Truthy/Falsy in conditions
if ("0") { // truthy
  console.log("This runs");
}

if (0) { // falsy
  console.log("This doesn't run");
}

// Complex coercion examples
console.log([] + []); // "" (empty string)
console.log([] + {}); // "[object Object]"
console.log({} + []); // "[object Object]"
console.log(true + false); // 1
console.log("5" - - "3"); // 8 (5 - (-3))

// == vs === comparisons
console.log(0 == false); // true (coercion)
console.log(0 === false); // false (no coercion)
console.log("5" == 5); // true (coercion)
console.log("5" === 5); // false (no coercion)

// Object to primitive conversion
const obj = {
  valueOf: () => 10,
  toString: () => "20"
};

console.log(obj + 5); // 15 (valueOf used)
console.log(String(obj)); // "20" (toString used)
```

### Q16: What are Symbols and when would you use them?

**Answer**:
Symbols are primitive data types that guarantee unique identifiers.

```javascript
// Creating symbols
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description");

console.log(sym2 === sym3); // false (each symbol is unique)
console.log(typeof sym1); // "symbol"

// Symbols as object properties
const obj = {};
const keySymbol = Symbol("key");

obj[keySymbol] = "value";
obj.normalKey = "normal value";

console.log(obj[keySymbol]); // "value"
console.log(Object.keys(obj)); // ["normalKey"] (symbols not enumerable)
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(key)]

// Well-known symbols
class MyArray extends Array {
  // Custom iterator
  *[Symbol.iterator]() {
    for (let i = this.length - 1; i >= 0; i--) {
      yield this[i];
    }
  }
  
  // Custom species
  static get [Symbol.species]() {
    return Array;
  }
}

const arr = new MyArray(1, 2, 3);
for (const item of arr) {
  console.log(item); // 3, 2, 1 (reversed iteration)
}

// Symbol.for() - global symbol registry
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");
console.log(globalSym1 === globalSym2); // true

// Private-like properties using symbols
const _privateMethod = Symbol("privateMethod");

class MyClass {
  constructor(name) {
    this.name = name;
  }
  
  [_privateMethod]() {
    return "This is private-like";
  }
  
  callPrivate() {
    return this[_privateMethod]();
  }
}

const instance = new MyClass("test");
console.log(instance.callPrivate()); // "This is private-like"
console.log(instance[_privateMethod]); // undefined (not accessible without symbol reference)
```

### Q17: Explain Proxy and Reflect in JavaScript

**Answer**:
Proxy allows you to intercept and customize operations on objects. Reflect provides methods for intercepted operations.

```javascript
// Basic proxy
const target = {
  name: "John",
  age: 30
};

const handler = {
  get(target, property, receiver) {
    console.log(`Getting property: ${property}`);
    return Reflect.get(target, property, receiver);
  },
  
  set(target, property, value, receiver) {
    console.log(`Setting ${property} to ${value}`);
    if (property === 'age' && value < 0) {
      throw new Error('Age cannot be negative');
    }
    return Reflect.set(target, property, value, receiver);
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // "Getting property: name" -> "John"
proxy.age = 25; // "Setting age to 25"
// proxy.age = -5; // Error: Age cannot be negative

// Validation proxy
function createValidatedObject(validationRules) {
  return new Proxy({}, {
    set(target, property, value) {
      const rule = validationRules[property];
      if (rule && !rule(value)) {
        throw new Error(`Invalid value for ${property}`);
      }
      target[property] = value;
      return true;
    }
  });
}

const person = createValidatedObject({
  name: value => typeof value === 'string' && value.length > 0,
  age: value => typeof value === 'number' && value >= 0
});

person.name = "Alice"; // Works
person.age = 25; // Works
// person.age = -5; // Error: Invalid value for age

// Array-like object with proxy
function createArrayLike() {
  return new Proxy({}, {
    get(target, property) {
      if (property === 'length') {
        return Object.keys(target).length;
      }
      if (property === 'push') {
        return function(value) {
          const length = this.length;
          this[length] = value;
          return length + 1;
        };
      }
      return target[property];
    },
    
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  });
}

const arrayLike = createArrayLike();
arrayLike.push("first");
arrayLike.push("second");
console.log(arrayLike.length); // 2
console.log(arrayLike[0]); // "first"

// Method interception
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

const loggedCalculator = new Proxy(calculator, {
  get(target, property) {
    if (typeof target[property] === 'function') {
      return function(...args) {
        console.log(`Calling ${property} with arguments: ${args}`);
        const result = target[property].apply(this, args);
        console.log(`Result: ${result}`);
        return result;
      };
    }
    return target[property];
  }
});

loggedCalculator.add(5, 3); // Logs: "Calling add with arguments: 5,3" then "Result: 8"

// Reflect examples
const obj = { x: 1, y: 2 };

// Equivalent operations
console.log(obj.x); // Direct access
console.log(Reflect.get(obj, 'x')); // Using Reflect

obj.z = 3; // Direct assignment
Reflect.set(obj, 'w', 4); // Using Reflect

console.log('x' in obj); // Direct check
console.log(Reflect.has(obj, 'x')); // Using Reflect

// Reflect.apply
function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

console.log(greet.apply(null, ["Hello", "World"])); // Traditional
console.log(Reflect.apply(greet, null, ["Hello", "World"])); // Using Reflect
```

### Q18: What are WeakMap and WeakSet?

**Answer**:
WeakMap and WeakSet are collections that hold weak references to their contents.

```javascript
// WeakMap - keys must be objects, automatically garbage collected
const wm = new WeakMap();
let keyObj = { id: 1 };
let valueObj = { data: "some data" };

wm.set(keyObj, valueObj);
console.log(wm.get(keyObj)); // { data: "some data" }

// When keyObj is no longer referenced, it can be garbage collected
keyObj = null; // The entry in WeakMap may be automatically removed

// WeakMap use case: Private data
const privateData = new WeakMap();

class User {
  constructor(name, email) {
    this.name = name;
    // Store private data
    privateData.set(this, { email, loginCount: 0 });
  }
  
  getEmail() {
    return privateData.get(this).email;
  }
  
  incrementLogin() {
    const data = privateData.get(this);
    data.loginCount++;
  }
  
  getLoginCount() {
    return privateData.get(this).loginCount;
  }
}

const user = new User("John", "john@email.com");
console.log(user.getEmail()); // "john@email.com"
user.incrementLogin();
console.log(user.getLoginCount()); // 1

// WeakSet - similar concept but for sets
const ws = new WeakSet();
const obj1 = { name: "Object 1" };
const obj2 = { name: "Object 2" };

ws.add(obj1);
ws.add(obj2);

console.log(ws.has(obj1)); // true
ws.delete(obj1);
console.log(ws.has(obj1)); // false

// WeakSet use case: Tracking objects
const disabledElements = new WeakSet();

class FormElement {
  constructor(type) {
    this.type = type;
  }
  
  disable() {
    disabledElements.add(this);
  }
  
  enable() {
    disabledElements.delete(this);
  }
  
  isDisabled() {
    return disabledElements.has(this);
  }
}

const input = new FormElement("text");
console.log(input.isDisabled()); // false
input.disable();
console.log(input.isDisabled()); // true

// Comparison with Map and Set
const map = new Map();
const set = new Set();

// Map/Set keep strong references - won't be garbage collected
let strongKey = { id: 1 };
map.set(strongKey, "value");
set.add(strongKey);

// Even if we remove our reference, Map/Set still hold references
strongKey = null; // Object still exists in map and set

// WeakMap/WeakSet don't prevent garbage collection
let weakKey = { id: 2 };
const weakMap = new WeakMap();
const weakSet = new WeakSet();

weakMap.set(weakKey, "value");
weakSet.add(weakKey);

weakKey = null; // Object can be garbage collected from weakMap and weakSet
```

### Q19: Explain async/await error handling and Promise patterns

**Answer**:
Async/await provides cleaner syntax for Promise-based asynchronous code.

```javascript
// Basic async/await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw if needed
  }
}

// Multiple async operations - sequential vs parallel
async function sequentialOperations() {
  const result1 = await operation1(); // Wait for first
  const result2 = await operation2(); // Then wait for second
  return [result1, result2];
}

async function parallelOperations() {
  const [result1, result2] = await Promise.all([
    operation1(), // Start both
    operation2()  // simultaneously
  ]);
  return [result1, result2];
}

// Promise.allSettled - wait for all, regardless of success/failure
async function allSettledExample() {
  const promises = [
    fetch('/api/data1'),
    fetch('/api/data2'),
    fetch('/api/data3')
  ];
  
  const results = await Promise.allSettled(promises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Promise ${index} succeeded:`, result.value);
    } else {
      console.log(`Promise ${index} failed:`, result.reason);
    }
  });
}

// Promise.race - first to resolve/reject wins
async function raceExample() {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  );
  
  const dataPromise = fetch('/api/data');
  
  try {
    const result = await Promise.race([dataPromise, timeout]);
    return result;
  } catch (error) {
    if (error.message === 'Timeout') {
      console.log('Request timed out');
    }
    throw error;
  }
}

// Advanced error handling patterns
class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new APIError(`HTTP ${response.status}`, response.status);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Async iteration
async function* asyncGenerator() {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

async function consumeAsyncGenerator() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2, 3, 4 (with delays)
  }
}

// Pipeline pattern with async/await
const pipeline = (...functions) => input => 
  functions.reduce(async (result, fn) => fn(await result), input);

const processData = pipeline(
  async data => ({ ...data, step1: true }),
  async data => ({ ...data, step2: await someAsyncOperation(data) }),
  async data => ({ ...data, step3: true })
);

// Async forEach implementation
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// Usage
await asyncForEach([1, 2, 3], async (num) => {
  const result = await processNumber(num);
  console.log(result);
});

// Concurrent with limit
async function mapWithConcurrencyLimit(array, asyncFn, limit = 3) {
  const results = [];
  
  for (let i = 0; i < array.length; i += limit) {
    const batch = array.slice(i, i + limit);
    const batchPromises = batch.map(asyncFn);
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  return results;
}
```

### Q20: What are JavaScript modules and how do they work?

**Answer**:
JavaScript modules provide a way to organize and reuse code across files.

```javascript
// ES6 Modules (Modern)

// math.js - Named exports
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Default export
export default function subtract(a, b) {
  return a - b;
}

// utils.js - Different export styles
const API_URL = 'https://api.example.com';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Export all at once
export {
  API_URL,
  formatDate,
  debounce as delay // Renamed export
};

// main.js - Importing
import subtract, { PI, add, multiply } from './math.js';
import { API_URL, formatDate, delay } from './utils.js';

// Import all named exports
import * as MathUtils from './math.js';

// Dynamic imports
async function loadModule() {
  const { default: subtract, add } = await import('./math.js');
  return { subtract, add };
}

// CommonJS (Node.js)

// math-commonjs.js
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Export object
module.exports = {
  PI,
  add,
  multiply
};

// Or individual exports
exports.PI = PI;
exports.add = add;
exports.multiply = multiply;

// main-commonjs.js
const math = require('./math-commonjs');
const { PI, add } = require('./math-commonjs');

// Module patterns before ES6

// Revealing Module Pattern
const MyModule = (function() {
  // Private variables and functions
  let privateVar = 0;
  
  function privateFunction() {
    return privateVar * 2;
  }
  
  // Public API
  return {
    publicVar: 'I am public',
    
    increment: function() {
      privateVar++;
    },
    
    getDouble: function() {
      return privateFunction();
    },
    
    reset: function() {
      privateVar = 0;
    }
  };
})();

// Namespace pattern
const App = {
  Utils: {
    formatCurrency: function(amount) {
      return `$${amount.toFixed(2)}`;
    },
    
    validateEmail: function(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  },
  
  Models: {
    User: function(name, email) {
      this.name = name;
      this.email = email;
    }
  },
  
  Controllers: {
    UserController: {
      create: function(userData) {
        // Create user logic
      },
      
      update: function(id, userData) {
        // Update user logic
      }
    }
  }
};

// Module loading patterns
const ModuleLoader = {
  modules: {},
  
  define: function(name, dependencies, factory) {
    this.modules[name] = {
      dependencies,
      factory,
      instance: null
    };
  },
  
  require: function(name) {
    const module = this.modules[name];
    
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    
    if (module.instance) {
      return module.instance;
    }
    
    // Resolve dependencies
    const deps = module.dependencies.map(dep => this.require(dep));
    
    // Create instance
    module.instance = module.factory.apply(null, deps);
    
    return module.instance;
  }
};

// Usage
ModuleLoader.define('logger', [], function() {
  return {
    log: function(message) {
      console.log(`[LOG] ${message}`);
    }
  };
});

ModuleLoader.define('api', ['logger'], function(logger) {
  return {
    get: function(url) {
      logger.log(`GET ${url}`);
      return fetch(url);
    }
  };
});

const api = ModuleLoader.require('api');

// Tree shaking considerations
// Only import what you need for better bundle optimization

// ❌ Bad - imports entire library
import _ from 'lodash';
const result = _.debounce(myFunction, 300);

// ✅ Good - imports only what's needed
import { debounce } from 'lodash';
const result = debounce(myFunction, 300);

// Even better - specific imports
import debounce from 'lodash/debounce';
const result = debounce(myFunction, 300);
```

---

_This comprehensive guide covers essential JavaScript concepts, advanced patterns, and practical implementation problems. Practice these concepts thoroughly for frontend interviews at Big Tech companies._
