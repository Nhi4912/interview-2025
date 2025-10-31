# JavaScript Basics
## JavaScript - Chapter 0

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Variables & Data Types →](./01-variables-data-types.md)

---

## Overview

JavaScript is the programming language of the web. This chapter covers fundamental JavaScript concepts essential for every frontend developer.

---

## Table of Contents

1. [What is JavaScript?](#what-is-javascript)
2. [Variables and Data Types](#variables-and-data-types)
3. [Operators](#operators)
4. [Control Flow](#control-flow)
5. [Functions](#functions)
6. [Arrays](#arrays)
7. [Objects](#objects)
8. [String Methods](#string-methods)
9. [Number Methods](#number-methods)
10. [Interview Questions](#interview-questions)

---

## What is JavaScript?

### JavaScript Characteristics

**Definition:** JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.

**Key Features:**
- **Dynamic typing**: Variables can hold any type
- **Prototype-based**: Object-oriented via prototypes
- **First-class functions**: Functions are objects
- **Event-driven**: Responds to user actions
- **Single-threaded**: One execution thread
- **Non-blocking**: Asynchronous operations

### JavaScript Execution

```javascript
// JavaScript runs in:
// 1. Browser (client-side)
console.log('Running in browser');

// 2. Node.js (server-side)
console.log('Running in Node.js');

// 3. Other environments (React Native, Electron, etc.)
```

---

## Variables and Data Types

### Variable Declaration

```javascript
// var (old way, function-scoped)
var name = 'John';

// let (block-scoped, can reassign)
let age = 30;
age = 31; // OK

// const (block-scoped, cannot reassign)
const PI = 3.14159;
// PI = 3.14; // Error!

// const with objects (can modify properties)
const person = { name: 'John' };
person.name = 'Jane'; // OK
person.age = 30; // OK
// person = {}; // Error!
```

### Primitive Data Types

```javascript
// 1. String
const name = 'John';
const greeting = "Hello";
const template = `Hello ${name}`; // Template literal

// 2. Number
const integer = 42;
const float = 3.14;
const negative = -10;
const infinity = Infinity;
const notANumber = NaN;

// 3. Boolean
const isTrue = true;
const isFalse = false;

// 4. Undefined
let x; // undefined
const y = undefined;

// 5. Null
const empty = null;

// 6. Symbol (ES6)
const sym = Symbol('description');

// 7. BigInt (ES2020)
const bigNumber = 1234567890123456789012345678901234567890n;
```

### Type Checking

```javascript
// typeof operator
typeof 'hello'; // 'string'
typeof 42; // 'number'
typeof true; // 'boolean'
typeof undefined; // 'undefined'
typeof null; // 'object' (historical bug)
typeof Symbol(); // 'symbol'
typeof 123n; // 'bigint'
typeof {}; // 'object'
typeof []; // 'object'
typeof function(){}; // 'function'

// Check for null
const value = null;
value === null; // true

// Check for array
Array.isArray([]); // true
Array.isArray({}); // false
```

---

## Operators

### Arithmetic Operators

```javascript
// Basic arithmetic
10 + 5; // 15 (addition)
10 - 5; // 5 (subtraction)
10 * 5; // 50 (multiplication)
10 / 5; // 2 (division)
10 % 3; // 1 (modulus/remainder)
10 ** 2; // 100 (exponentiation)

// Increment/Decrement
let x = 5;
x++; // 6 (post-increment)
++x; // 7 (pre-increment)
x--; // 6 (post-decrement)
--x; // 5 (pre-decrement)
```

### Comparison Operators

```javascript
// Equality
5 == '5'; // true (loose equality, type coercion)
5 === '5'; // false (strict equality, no coercion)
5 != '5'; // false
5 !== '5'; // true

// Relational
5 > 3; // true
5 < 3; // false
5 >= 5; // true
5 <= 3; // false
```

### Logical Operators

```javascript
// AND (&&)
true && true; // true
true && false; // false

// OR (||)
true || false; // true
false || false; // false

// NOT (!)
!true; // false
!false; // true

// Nullish coalescing (??)
null ?? 'default'; // 'default'
undefined ?? 'default'; // 'default'
0 ?? 'default'; // 0
'' ?? 'default'; // ''

// Optional chaining (?.)
const user = { name: 'John' };
user?.address?.street; // undefined (no error)
```

### Assignment Operators

```javascript
let x = 10;

x += 5; // x = x + 5 (15)
x -= 3; // x = x - 3 (12)
x *= 2; // x = x * 2 (24)
x /= 4; // x = x / 4 (6)
x %= 4; // x = x % 4 (2)
x **= 3; // x = x ** 3 (8)
```

---

## Control Flow

### If-Else Statements

```javascript
const age = 18;

if (age >= 18) {
  console.log('Adult');
} else if (age >= 13) {
  console.log('Teenager');
} else {
  console.log('Child');
}

// Ternary operator
const status = age >= 18 ? 'Adult' : 'Minor';
```

### Switch Statement

```javascript
const day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('Start of week');
    break;
  case 'Friday':
    console.log('End of week');
    break;
  case 'Saturday':
  case 'Sunday':
    console.log('Weekend');
    break;
  default:
    console.log('Midweek');
}
```

### Loops

```javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// While loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// Do-while loop
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// For...of (arrays)
const arr = [1, 2, 3];
for (const num of arr) {
  console.log(num);
}

// For...in (objects)
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key, obj[key]);
}

// Break and continue
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // Skip 3
  if (i === 7) break; // Stop at 7
  console.log(i);
}
```

---

## Functions

### Function Declaration

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Arrow function
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Arrow function (concise)
const greet = name => `Hello, ${name}!`;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const sayHello = () => 'Hello!';
```

### Default Parameters

```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

greet(); // 'Hello, Guest!'
greet('John'); // 'Hello, John!'
```

### Rest Parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3); // 6
sum(1, 2, 3, 4, 5); // 15
```

### Return Values

```javascript
// Explicit return
function add(a, b) {
  return a + b;
}

// Implicit return (arrow function)
const add = (a, b) => a + b;

// No return (returns undefined)
function logMessage(msg) {
  console.log(msg);
}
```

---

## Arrays

### Creating Arrays

```javascript
// Array literal
const arr = [1, 2, 3, 4, 5];

// Array constructor
const arr2 = new Array(1, 2, 3);

// Array.of
const arr3 = Array.of(1, 2, 3);

// Array.from
const arr4 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
```

### Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// Add/Remove
numbers.push(6); // Add to end: [1, 2, 3, 4, 5, 6]
numbers.pop(); // Remove from end: [1, 2, 3, 4, 5]
numbers.unshift(0); // Add to start: [0, 1, 2, 3, 4, 5]
numbers.shift(); // Remove from start: [1, 2, 3, 4, 5]

// Slice (doesn't modify original)
numbers.slice(1, 3); // [2, 3]

// Splice (modifies original)
numbers.splice(2, 1); // Remove 1 item at index 2
numbers.splice(2, 0, 10); // Insert 10 at index 2

// Concat
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2); // [1, 2, 3, 4]

// Join
const arr = ['Hello', 'World'];
arr.join(' '); // 'Hello World'

// Reverse
[1, 2, 3].reverse(); // [3, 2, 1]

// Sort
[3, 1, 2].sort(); // [1, 2, 3]
[3, 1, 2].sort((a, b) => b - a); // [3, 2, 1] (descending)
```

### Array Iteration

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach
numbers.forEach(num => console.log(num));

// map (transform)
const doubled = numbers.map(num => num * 2); // [2, 4, 6, 8, 10]

// filter
const evens = numbers.filter(num => num % 2 === 0); // [2, 4]

// find
const found = numbers.find(num => num > 3); // 4

// findIndex
const index = numbers.findIndex(num => num > 3); // 3

// some (at least one)
const hasEven = numbers.some(num => num % 2 === 0); // true

// every (all)
const allPositive = numbers.every(num => num > 0); // true

// reduce
const sum = numbers.reduce((total, num) => total + num, 0); // 15
```

---

## Objects

### Creating Objects

```javascript
// Object literal
const person = {
  name: 'John',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// Object constructor
const person2 = new Object();
person2.name = 'Jane';

// Object.create
const person3 = Object.create(person);
```

### Accessing Properties

```javascript
const person = { name: 'John', age: 30 };

// Dot notation
person.name; // 'John'

// Bracket notation
person['age']; // 30

// Dynamic property
const prop = 'name';
person[prop]; // 'John'
```

### Object Methods

```javascript
const person = { name: 'John', age: 30, city: 'NYC' };

// Keys
Object.keys(person); // ['name', 'age', 'city']

// Values
Object.values(person); // ['John', 30, 'NYC']

// Entries
Object.entries(person); // [['name', 'John'], ['age', 30], ['city', 'NYC']]

// Assign (merge objects)
const obj1 = { a: 1 };
const obj2 = { b: 2 };
Object.assign(obj1, obj2); // { a: 1, b: 2 }

// Spread operator (ES6)
const merged = { ...obj1, ...obj2 };

// Freeze (immutable)
Object.freeze(person);
person.age = 31; // No effect

// Seal (can modify, can't add/delete)
Object.seal(person);
```

### Destructuring

```javascript
// Object destructuring
const person = { name: 'John', age: 30 };
const { name, age } = person;

// With default values
const { name, age, city = 'Unknown' } = person;

// Rename variables
const { name: personName } = person;

// Array destructuring
const arr = [1, 2, 3];
const [first, second] = arr;

// Skip elements
const [first, , third] = arr;

// Rest operator
const [first, ...rest] = arr; // first = 1, rest = [2, 3]
```

---

## String Methods

```javascript
const str = 'Hello World';

// Length
str.length; // 11

// Case
str.toLowerCase(); // 'hello world'
str.toUpperCase(); // 'HELLO WORLD'

// Trim
'  hello  '.trim(); // 'hello'

// Includes
str.includes('World'); // true

// StartsWith/EndsWith
str.startsWith('Hello'); // true
str.endsWith('World'); // true

// IndexOf
str.indexOf('World'); // 6
str.lastIndexOf('o'); // 7

// Slice
str.slice(0, 5); // 'Hello'
str.slice(-5); // 'World'

// Substring
str.substring(0, 5); // 'Hello'

// Replace
str.replace('World', 'JavaScript'); // 'Hello JavaScript'
str.replaceAll('l', 'L'); // 'HeLLo WorLd'

// Split
str.split(' '); // ['Hello', 'World']

// Repeat
'ha'.repeat(3); // 'hahaha'

// PadStart/PadEnd
'5'.padStart(3, '0'); // '005'
'5'.padEnd(3, '0'); // '500'

// Template literals
const name = 'John';
const age = 30;
`My name is ${name} and I'm ${age} years old`;
```

---

## Number Methods

```javascript
// parseInt
parseInt('42'); // 42
parseInt('42.5'); // 42
parseInt('42px'); // 42

// parseFloat
parseFloat('42.5'); // 42.5

// Number
Number('42'); // 42
Number('42.5'); // 42.5
Number('42px'); // NaN

// toFixed (decimal places)
(3.14159).toFixed(2); // '3.14'

// toPrecision (significant digits)
(123.456).toPrecision(4); // '123.5'

// isNaN
isNaN(NaN); // true
isNaN('hello'); // true
Number.isNaN(NaN); // true (better)
Number.isNaN('hello'); // false

// isFinite
isFinite(42); // true
isFinite(Infinity); // false

// Math methods
Math.round(4.5); // 5
Math.ceil(4.1); // 5
Math.floor(4.9); // 4
Math.abs(-5); // 5
Math.max(1, 2, 3); // 3
Math.min(1, 2, 3); // 1
Math.random(); // Random between 0 and 1
Math.pow(2, 3); // 8
Math.sqrt(16); // 4
```

---

## Interview Questions

### Q1: What's the difference between `let`, `const`, and `var`?

**Answer:**
- **var**: Function-scoped, hoisted, can redeclare
- **let**: Block-scoped, not hoisted (TDZ), can't redeclare
- **const**: Block-scoped, not hoisted (TDZ), can't reassign

```javascript
var x = 1; // Function-scoped
let y = 2; // Block-scoped
const z = 3; // Block-scoped, immutable binding
```

### Q2: What's the difference between `==` and `===`?

**Answer:**
- **==**: Loose equality, performs type coercion
- **===**: Strict equality, no type coercion

```javascript
5 == '5'; // true (coercion)
5 === '5'; // false (different types)
```

### Q3: What are falsy values in JavaScript?

**Answer:**
Six falsy values:
1. `false`
2. `0`
3. `''` (empty string)
4. `null`
5. `undefined`
6. `NaN`

All other values are truthy.

### Q4: What's the difference between `null` and `undefined`?

**Answer:**
- **undefined**: Variable declared but not assigned
- **null**: Intentional absence of value

```javascript
let x; // undefined
let y = null; // null
```

### Q5: How do you check if a variable is an array?

**Answer:**
```javascript
Array.isArray([]); // true
Array.isArray({}); // false

// Don't use typeof (returns 'object')
typeof []; // 'object'
```

---

## Key Takeaways

1. JavaScript is dynamically typed
2. Use `const` by default, `let` when needed, avoid `var`
3. Use `===` for equality checks
4. Arrays and objects are reference types
5. Functions are first-class citizens
6. Template literals for string interpolation
7. Destructuring simplifies code
8. Array methods are powerful tools
9. Understand falsy values
10. Master type checking

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Variables & Data Types →](./01-variables-data-types.md)
