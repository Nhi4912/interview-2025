# ES6+ Features - Deep Dive
## Modern JavaScript Features

**English:** ES6 (ECMAScript 2015) and later versions introduced significant improvements to JavaScript, making it more powerful, expressive, and easier to work with.

**Tiếng Việt:** ES6 (ECMAScript 2015) và các phiên bản sau đã giới thiệu những cải tiến đáng kể cho JavaScript, làm cho nó mạnh mẽ hơn, biểu cảm hơn và dễ làm việc hơn.

## Let and Const

### Block Scoping

**Theory:** let and const create block-scoped variables, unlike var which is function-scoped.

**let:**
- Block-scoped
- Can be reassigned
- Not hoisted (TDZ)
- No redeclaration

**const:**
- Block-scoped
- Cannot be reassigned
- Not hoisted (TDZ)
- Must be initialized
- Object properties mutable

**Examples:**
```javascript
// Block scope
{
  let x = 1;
  const y = 2;
  var z = 3;
}
// x and y not accessible
// z is accessible

// Temporal Dead Zone
console.log(a); // ReferenceError
let a = 1;

// const with objects
const obj = { name: 'John' };
obj.name = 'Jane'; // OK
obj = {}; // Error
```

## Arrow Functions

### Syntax and Behavior

**Features:**
- Concise syntax
- Lexical this binding
- No arguments object
- Cannot be constructor
- No prototype property

**Syntax Variations:**
```javascript
// No parameters
const greet = () => 'Hello';

// One parameter (parentheses optional)
const double = x => x * 2;

// Multiple parameters
const add = (a, b) => a + b;

// Block body
const complex = (x, y) => {
  const result = x + y;
  return result * 2;
};

// Object literal (wrap in parentheses)
const makeObj = (name) => ({ name });
```

**Lexical this:**
```javascript
// Traditional function
function Timer() {
  this.seconds = 0;
  setInterval(function() {
    this.seconds++; // 'this' is window/undefined
  }, 1000);
}

// Arrow function
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++; // 'this' is Timer instance
  }, 1000);
}
```

## Template Literals

### String Interpolation

**Features:**
- Multi-line strings
- Expression interpolation
- Tagged templates
- Raw strings

**Basic Usage:**
```javascript
const name = 'John';
const age = 30;

// Interpolation
const message = `Hello, ${name}!`;

// Multi-line
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Expressions
const result = `Sum: ${1 + 2 + 3}`;
const conditional = `Status: ${age >= 18 ? 'Adult' : 'Minor'}`;
```

**Tagged Templates:**
```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const name = 'John';
const age = 30;
const output = highlight`Name: ${name}, Age: ${age}`;
// "Name: <mark>John</mark>, Age: <mark>30</mark>"
```

## Destructuring

### Array Destructuring

**Basic:**
```javascript
const arr = [1, 2, 3, 4, 5];

// Basic
const [first, second] = arr;

// Skip elements
const [a, , c] = arr;

// Rest operator
const [head, ...tail] = arr;

// Default values
const [x = 0, y = 0] = [1];

// Swapping
let a = 1, b = 2;
[a, b] = [b, a];
```

**Nested:**
```javascript
const nested = [1, [2, 3], 4];
const [a, [b, c], d] = nested;
```

### Object Destructuring

**Basic:**
```javascript
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

// Basic
const { name, age } = user;

// Rename
const { name: userName, age: userAge } = user;

// Default values
const { name, country = 'USA' } = user;

// Rest operator
const { name, ...rest } = user;
```

**Nested:**
```javascript
const user = {
  name: 'John',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

const { address: { city, country } } = user;
```

**Function Parameters:**
```javascript
function greet({ name, age = 0 }) {
  return `Hello ${name}, age ${age}`;
}

greet({ name: 'John', age: 30 });
```

## Spread and Rest Operators

### Spread Operator

**Arrays:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];

// Copy array
const copy = [...arr1];

// Add elements
const extended = [0, ...arr1, 4];

// Function arguments
Math.max(...arr1);
```

**Objects:**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combine objects
const combined = { ...obj1, ...obj2 };

// Copy object
const copy = { ...obj1 };

// Override properties
const updated = { ...obj1, b: 3 };
```

### Rest Operator

**Function Parameters:**
```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4, 5);

// With other parameters
function greet(greeting, ...names) {
  return `${greeting} ${names.join(', ')}`;
}
```

## Default Parameters

**Syntax:**
```javascript
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

greet(); // "Hello, Guest!"
greet('John'); // "Hello, John!"
greet('John', 'Hi'); // "Hi, John!"
```

**Expressions:**
```javascript
function createUser(name, id = generateId()) {
  return { name, id };
}

// Default from other parameter
function greet(name, greeting = `Hello ${name}`) {
  return greeting;
}
```

## Enhanced Object Literals

**Shorthand Properties:**
```javascript
const name = 'John';
const age = 30;

// Old way
const user = {
  name: name,
  age: age
};

// ES6 way
const user = { name, age };
```

**Shorthand Methods:**
```javascript
const obj = {
  // Old way
  greet: function() {
    return 'Hello';
  },
  
  // ES6 way
  greet() {
    return 'Hello';
  }
};
```

**Computed Property Names:**
```javascript
const key = 'name';
const obj = {
  [key]: 'John',
  [`${key}Upper`]: 'JOHN',
  [key + 'Length']: 4
};
```

## Classes

### Class Syntax

**Basic:**
```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  static species() {
    return 'Homo sapiens';
  }
}

const person = new Person('John', 30);
```

**Inheritance:**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    return `${this.name} barks`;
  }
}
```

**Getters and Setters:**
```javascript
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  
  get area() {
    return this._width * this._height;
  }
  
  set width(value) {
    if (value > 0) {
      this._width = value;
    }
  }
}
```

## Modules

### Import/Export

**Named Exports:**
```javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}

// main.js
import { PI, add } from './math.js';
```

**Default Export:**
```javascript
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// main.js
import User from './user.js';
```

**Mixed:**
```javascript
// utils.js
export const helper = () => {};
export default function main() {}

// main.js
import main, { helper } from './utils.js';
```

**Rename:**
```javascript
import { add as sum } from './math.js';
export { add as sum } from './math.js';
```

**Namespace:**
```javascript
import * as Math from './math.js';
Math.add(1, 2);
```

## Promises

### Promise Basics

**Creation:**
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success');
  }, 1000);
});
```

**Chaining:**
```javascript
fetch('/api/user')
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error))
  .finally(() => cleanup());
```

**Promise Methods:**
```javascript
// All must resolve
Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results));

// First to resolve
Promise.race([promise1, promise2])
  .then(result => console.log(result));

// All settled
Promise.allSettled([promise1, promise2])
  .then(results => console.log(results));

// First to fulfill
Promise.any([promise1, promise2])
  .then(result => console.log(result));
```

## Async/Await

**Syntax:**
```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

**Parallel Execution:**
```javascript
// Sequential (slow)
const user = await fetchUser(1);
const posts = await fetchPosts(1);

// Parallel (fast)
const [user, posts] = await Promise.all([
  fetchUser(1),
  fetchPosts(1)
]);
```

## Symbols

**Unique Identifiers:**
```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
sym1 === sym2; // false

// As object key
const obj = {
  [sym1]: 'value'
};

// Well-known symbols
const arr = [1, 2, 3];
arr[Symbol.iterator]; // Iterator function
```

## Iterators and Generators

### Iterators

**Protocol:**
```javascript
const iterable = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        return i < 3
          ? { value: i++, done: false }
          : { done: true };
      }
    };
  }
};

for (const value of iterable) {
  console.log(value); // 0, 1, 2
}
```

### Generators

**Syntax:**
```javascript
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { done: true }
```

**Practical Use:**
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
fib.next().value; // 0
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
```

## Maps and Sets

### Map

**Features:**
- Any type as key
- Maintains insertion order
- Size property
- Iterable

**Usage:**
```javascript
const map = new Map();

// Set values
map.set('name', 'John');
map.set(1, 'one');
map.set({}, 'object');

// Get values
map.get('name'); // 'John'

// Check existence
map.has('name'); // true

// Delete
map.delete('name');

// Size
map.size;

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}
```

### Set

**Features:**
- Unique values
- Any type
- Maintains insertion order
- Iterable

**Usage:**
```javascript
const set = new Set();

// Add values
set.add(1);
set.add(2);
set.add(2); // Ignored (duplicate)

// Check existence
set.has(1); // true

// Delete
set.delete(1);

// Size
set.size;

// Iterate
for (const value of set) {
  console.log(value);
}

// Array to Set (remove duplicates)
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)];
```

### WeakMap and WeakSet

**WeakMap:**
- Keys must be objects
- Weak references (garbage collected)
- No iteration
- Private data pattern

```javascript
const weakMap = new WeakMap();
let obj = {};

weakMap.set(obj, 'value');
weakMap.get(obj); // 'value'

obj = null; // Value can be garbage collected
```

**WeakSet:**
- Values must be objects
- Weak references
- No iteration
- Track object references

```javascript
const weakSet = new WeakSet();
let obj = {};

weakSet.add(obj);
weakSet.has(obj); // true

obj = null; // Can be garbage collected
```

## Proxy and Reflect

### Proxy

**Intercept Operations:**
```javascript
const target = { name: 'John' };

const proxy = new Proxy(target, {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },
  
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    target[prop] = value;
    return true;
  }
});

proxy.name; // Logs: "Getting name"
proxy.age = 30; // Logs: "Setting age to 30"
```

**Validation:**
```javascript
const validator = {
  set(target, prop, value) {
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[prop] = value;
    return true;
  }
};

const person = new Proxy({}, validator);
person.age = 30; // OK
person.age = '30'; // TypeError
```

### Reflect

**Standard Operations:**
```javascript
const obj = { name: 'John' };

// Get property
Reflect.get(obj, 'name');

// Set property
Reflect.set(obj, 'age', 30);

// Has property
Reflect.has(obj, 'name');

// Delete property
Reflect.deleteProperty(obj, 'name');
```

## Interview Questions

**Q: Difference between let, const, and var?**

A: var is function-scoped, hoisted, and can be redeclared. let and const are block-scoped, have TDZ, and cannot be redeclared. const cannot be reassigned but object properties are mutable.

**Q: When to use arrow functions?**

A: Use for callbacks, array methods, and when you need lexical this. Don't use for methods, constructors, or when you need arguments object.

**Q: What is destructuring?**

A: Syntax for extracting values from arrays or properties from objects into distinct variables. Supports default values, renaming, and nesting.

**Q: Difference between Map and Object?**

A: Map allows any type as key, maintains insertion order, has size property, and is iterable. Object keys are strings/symbols, no guaranteed order, no size property.

**Q: What are Promises?**

A: Objects representing eventual completion or failure of async operation. Provide cleaner async code than callbacks, support chaining, and have built-in error handling.

---

[← Back to Prototypes](./10-prototypes-inheritance-deep.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)
