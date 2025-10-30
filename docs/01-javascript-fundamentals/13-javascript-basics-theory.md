# JavaScript Basics - Complete Theory
## Understanding JavaScript from First Principles

**English:** JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification, enabling interactive web pages and forming an essential part of web applications.

**Tiếng Việt:** JavaScript là ngôn ngữ lập trình cấp cao, thông dịch tuân theo đặc tả ECMAScript, cho phép tạo trang web tương tác và là phần thiết yếu của ứng dụng web.

## Table of Contents
1. [What is JavaScript](#what-is-javascript)
2. [Variables and Data Types](#variables-and-data-types)
3. [Operators](#operators)
4. [Control Flow](#control-flow)
5. [Functions](#functions)
6. [Objects and Arrays](#objects-and-arrays)
7. [Type Coercion](#type-coercion)
8. [Equality and Comparison](#equality-and-comparison)
9. [Truthy and Falsy](#truthy-and-falsy)
10. [Basic Patterns](#basic-patterns)

## What is JavaScript

### History

**Timeline:**
```
1995: Created by Brendan Eich at Netscape (10 days)
1996: Submitted to ECMA for standardization
1997: ECMAScript 1 released
1999: ECMAScript 3 (widely adopted)
2009: ECMAScript 5 (strict mode, JSON)
2015: ECMAScript 6/ES2015 (major update)
2016+: Yearly releases (ES2016, ES2017, etc.)
```

### JavaScript vs ECMAScript

**ECMAScript:** Specification/standard
**JavaScript:** Implementation of ECMAScript

**Other Implementations:**
- JScript (Microsoft)
- ActionScript (Adobe)

### JavaScript Engines

**V8:** Chrome, Node.js, Edge
**SpiderMonkey:** Firefox
**JavaScriptCore:** Safari
**Chakra:** Old Edge (deprecated)

### Execution Environment

**Browser:**
```javascript
// Global object: window
console.log(window);

// DOM access
document.getElementById('app');

// Browser APIs
fetch('/api/data');
localStorage.setItem('key', 'value');
```

**Node.js:**
```javascript
// Global object: global
console.log(global);

// File system access
const fs = require('fs');
fs.readFileSync('file.txt');

// No DOM
// No window
```

## Variables and Data Types

### Variable Declaration

**var (old, avoid):**
```javascript
var name = 'John';
var age = 30;

// Function-scoped
// Hoisted
// Can redeclare
// Can reassign
```

**let (modern):**
```javascript
let name = 'John';
let age = 30;

// Block-scoped
// Hoisted but not initialized (TDZ)
// Cannot redeclare
// Can reassign
```

**const (modern, preferred):**
```javascript
const name = 'John';
const age = 30;

// Block-scoped
// Hoisted but not initialized (TDZ)
// Cannot redeclare
// Cannot reassign
// Must initialize

const person = { name: 'John' };
person.name = 'Jane'; // OK (object is mutable)
person = {}; // Error (cannot reassign)
```

### Primitive Data Types

**Number:**
```javascript
const integer = 42;
const float = 3.14;
const negative = -10;
const scientific = 1e6; // 1000000
const binary = 0b1010; // 10
const octal = 0o12; // 10
const hex = 0xFF; // 255

// Special values
const infinity = Infinity;
const negInfinity = -Infinity;
const notANumber = NaN;

// Check
typeof 42; // "number"
Number.isInteger(42); // true
Number.isNaN(NaN); // true
Number.isFinite(42); // true
```

**String:**
```javascript
const single = 'Hello';
const double = "World";
const template = `Hello ${name}`;

// Escape sequences
const newline = 'Line 1\nLine 2';
const tab = 'Col1\tCol2';
const quote = 'It\'s a string';

// Properties and methods
'hello'.length; // 5
'hello'.toUpperCase(); // 'HELLO'
'hello'.charAt(0); // 'h'
'hello'.substring(1, 4); // 'ell'
'hello'.indexOf('l'); // 2
'hello'.split(''); // ['h','e','l','l','o']

typeof 'hello'; // "string"
```

**Boolean:**
```javascript
const isTrue = true;
const isFalse = false;

// Boolean conversion
Boolean(1); // true
Boolean(0); // false
Boolean('hello'); // true
Boolean(''); // false

typeof true; // "boolean"
```

**Undefined:**
```javascript
let x;
console.log(x); // undefined

function noReturn() {}
console.log(noReturn()); // undefined

const obj = {};
console.log(obj.missing); // undefined

typeof undefined; // "undefined"
```

**Null:**
```javascript
const empty = null;

// Represents intentional absence of value
// Different from undefined (uninitialized)

typeof null; // "object" (historical bug)
```

**Symbol (ES6):**
```javascript
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

sym2 === sym3; // false (always unique)

// Use case: unique object keys
const obj = {
  [Symbol('id')]: 123
};

typeof Symbol(); // "symbol"
```

**BigInt (ES2020):**
```javascript
const big = 9007199254740991n;
const alsoB big = BigInt(9007199254740991);

// For integers larger than Number.MAX_SAFE_INTEGER
const huge = 123456789012345678901234567890n;

typeof 123n; // "bigint"
```

### Reference Types

**Object:**
```javascript
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    return `Hello, ${this.name}`;
  }
};

typeof {}; // "object"
```

**Array:**
```javascript
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, 'two', true, null, { key: 'value' }];

typeof []; // "object"
Array.isArray([]); // true
```

**Function:**
```javascript
function add(a, b) {
  return a + b;
}

const multiply = function(a, b) {
  return a * b;
};

const divide = (a, b) => a / b;

typeof function() {}; // "function"
```

## Operators

### Arithmetic Operators

```javascript
// Addition
5 + 3; // 8
'Hello' + ' ' + 'World'; // 'Hello World'

// Subtraction
10 - 3; // 7

// Multiplication
4 * 5; // 20

// Division
20 / 4; // 5
5 / 2; // 2.5

// Modulo (remainder)
10 % 3; // 1
-10 % 3; // -1

// Exponentiation
2 ** 3; // 8
Math.pow(2, 3); // 8

// Increment
let x = 5;
x++; // x = 6 (post-increment)
++x; // x = 7 (pre-increment)

// Decrement
x--; // x = 6 (post-decrement)
--x; // x = 5 (pre-decrement)
```

### Assignment Operators

```javascript
let x = 10;

x += 5; // x = x + 5 = 15
x -= 3; // x = x - 3 = 12
x *= 2; // x = x * 2 = 24
x /= 4; // x = x / 4 = 6
x %= 4; // x = x % 4 = 2
x **= 3; // x = x ** 3 = 8
```

### Comparison Operators

```javascript
// Equal (loose)
5 == '5'; // true (type coercion)
0 == false; // true

// Equal (strict)
5 === '5'; // false (no type coercion)
5 === 5; // true

// Not equal (loose)
5 != '5'; // false
5 != 6; // true

// Not equal (strict)
5 !== '5'; // true
5 !== 5; // false

// Greater than
10 > 5; // true
5 > 10; // false

// Less than
5 < 10; // true
10 < 5; // false

// Greater than or equal
10 >= 10; // true
10 >= 5; // true

// Less than or equal
5 <= 10; // true
5 <= 5; // true
```

### Logical Operators

```javascript
// AND
true && true; // true
true && false; // false
false && true; // false

// OR
true || false; // true
false || true; // true
false || false; // false

// NOT
!true; // false
!false; // true

// Short-circuit evaluation
const result = value || 'default'; // Use default if value is falsy
const check = condition && doSomething(); // Only call if condition is true
```

### Bitwise Operators

```javascript
// AND
5 & 3; // 1 (0101 & 0011 = 0001)

// OR
5 | 3; // 7 (0101 | 0011 = 0111)

// XOR
5 ^ 3; // 6 (0101 ^ 0011 = 0110)

// NOT
~5; // -6 (inverts bits)

// Left shift
5 << 1; // 10 (0101 << 1 = 1010)

// Right shift
5 >> 1; // 2 (0101 >> 1 = 0010)

// Unsigned right shift
-5 >>> 1; // 2147483645
```

### Ternary Operator

```javascript
const age = 20;
const status = age >= 18 ? 'adult' : 'minor';

// Nested ternary (avoid if complex)
const grade = score >= 90 ? 'A' :
              score >= 80 ? 'B' :
              score >= 70 ? 'C' : 'F';
```

### Nullish Coalescing (??)

```javascript
const value = null ?? 'default'; // 'default'
const value2 = undefined ?? 'default'; // 'default'
const value3 = 0 ?? 'default'; // 0 (not null/undefined)
const value4 = '' ?? 'default'; // '' (not null/undefined)

// vs OR operator
const a = 0 || 'default'; // 'default' (0 is falsy)
const b = 0 ?? 'default'; // 0 (0 is not null/undefined)
```

### Optional Chaining (?.)

```javascript
const user = {
  name: 'John',
  address: {
    city: 'New York'
  }
};

// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining
const city = user?.address?.city; // 'New York'
const missing = user?.contact?.phone; // undefined (no error)

// With arrays
const firstItem = array?.[0];

// With functions
const result = obj.method?.();
```

## Control Flow

### If Statement

```javascript
const age = 20;

if (age >= 18) {
  console.log('Adult');
}

if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

if (age < 13) {
  console.log('Child');
} else if (age < 18) {
  console.log('Teenager');
} else {
  console.log('Adult');
}
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

// Without break (fall-through)
switch (value) {
  case 1:
  case 2:
  case 3:
    console.log('1, 2, or 3');
    break;
  case 4:
    console.log('4');
    // Falls through to case 5
  case 5:
    console.log('4 or 5');
    break;
}
```

### For Loop

```javascript
// Traditional for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// Multiple variables
for (let i = 0, j = 10; i < 5; i++, j--) {
  console.log(i, j);
}

// Infinite loop (avoid)
for (;;) {
  // Runs forever
  break; // Need break to exit
}
```

### While Loop

```javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// Infinite loop
while (true) {
  // Runs forever
  break; // Need break to exit
}
```

### Do-While Loop

```javascript
let i = 0;
do {
  console.log(i);
  i++;
} while (i < 5);

// Executes at least once
let x = 10;
do {
  console.log(x); // Prints 10
} while (x < 5); // Condition false, but already executed once
```

### For...of Loop

```javascript
const array = [1, 2, 3, 4, 5];

for (const value of array) {
  console.log(value); // 1, 2, 3, 4, 5
}

// With strings
for (const char of 'hello') {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

// With index
for (const [index, value] of array.entries()) {
  console.log(index, value);
}
```

### For...in Loop

```javascript
const obj = { a: 1, b: 2, c: 3 };

for (const key in obj) {
  console.log(key, obj[key]); // 'a' 1, 'b' 2, 'c' 3
}

// With arrays (not recommended)
const array = [1, 2, 3];
for (const index in array) {
  console.log(index, array[index]); // '0' 1, '1' 2, '2' 3
}
```

### Break and Continue

```javascript
// Break: exit loop
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i); // 0, 1, 2, 3, 4
}

// Continue: skip iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i); // 0, 1, 3, 4
}

// Labeled break
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer;
    console.log(i, j);
  }
}
```

## Functions

### Function Declaration

```javascript
function add(a, b) {
  return a + b;
}

// Hoisted (can call before declaration)
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}
```

### Function Expression

```javascript
const add = function(a, b) {
  return a + b;
};

// Not hoisted
console.log(add(2, 3)); // Error: add is not defined

const add = function(a, b) {
  return a + b;
};
```

### Arrow Function

```javascript
const add = (a, b) => a + b;

// With block
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const greet = () => 'Hello';

// Returning object (wrap in parentheses)
const createPerson = (name, age) => ({ name, age });
```

### Parameters

**Default Parameters:**
```javascript
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}

greet(); // 'Hello, Guest'
greet('John'); // 'Hello, John'
```

**Rest Parameters:**
```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4, 5); // 15
```

**Destructuring Parameters:**
```javascript
function greet({ name, age }) {
  return `${name} is ${age} years old`;
}

greet({ name: 'John', age: 30 });

// With defaults
function greet({ name = 'Guest', age = 0 } = {}) {
  return `${name} is ${age} years old`;
}
```

### Return Statement

```javascript
function add(a, b) {
  return a + b;
  console.log('Never executed'); // Unreachable
}

// Implicit return (undefined)
function noReturn() {
  // No return statement
}
console.log(noReturn()); // undefined

// Early return
function validate(value) {
  if (!value) return false;
  if (value < 0) return false;
  return true;
}
```

## Objects and Arrays

### Object Basics

**Creation:**
```javascript
// Object literal
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    return `Hello, ${this.name}`;
  }
};

// Constructor
const person2 = new Object();
person2.name = 'Jane';
person2.age = 25;

// Object.create
const person3 = Object.create(null);
person3.name = 'Bob';
```

**Accessing Properties:**
```javascript
const person = { name: 'John', age: 30 };

// Dot notation
console.log(person.name); // 'John'

// Bracket notation
console.log(person['age']); // 30

// Dynamic property
const prop = 'name';
console.log(person[prop]); // 'John'
```

**Adding/Modifying Properties:**
```javascript
const person = { name: 'John' };

person.age = 30; // Add
person.name = 'Jane'; // Modify

// Computed property names
const key = 'email';
person[key] = 'john@example.com';
```

**Deleting Properties:**
```javascript
const person = { name: 'John', age: 30 };

delete person.age;
console.log(person); // { name: 'John' }
```

### Array Basics

**Creation:**
```javascript
// Array literal
const numbers = [1, 2, 3, 4, 5];

// Constructor
const numbers2 = new Array(1, 2, 3);

// Array.of
const numbers3 = Array.of(1, 2, 3);

// Array.from
const numbers4 = Array.from('hello'); // ['h','e','l','l','o']
```

**Accessing Elements:**
```javascript
const numbers = [1, 2, 3, 4, 5];

console.log(numbers[0]); // 1
console.log(numbers[numbers.length - 1]); // 5
console.log(numbers[10]); // undefined
```

**Modifying Arrays:**
```javascript
const numbers = [1, 2, 3];

// Add to end
numbers.push(4); // [1, 2, 3, 4]

// Remove from end
numbers.pop(); // [1, 2, 3]

// Add to beginning
numbers.unshift(0); // [0, 1, 2, 3]

// Remove from beginning
numbers.shift(); // [1, 2, 3]

// Splice (remove/add)
numbers.splice(1, 1); // Remove at index 1: [1, 3]
numbers.splice(1, 0, 2); // Add at index 1: [1, 2, 3]
```

## Type Coercion

### Implicit Coercion

**String Coercion:**
```javascript
'5' + 3; // '53' (number to string)
'5' + true; // '5true'
'5' + null; // '5null'
'5' + undefined; // '5undefined'
```

**Number Coercion:**
```javascript
'5' - 3; // 2 (string to number)
'5' * 2; // 10
'5' / 2; // 2.5
'5' % 2; // 1

true + 1; // 2 (true = 1)
false + 1; // 1 (false = 0)
null + 1; // 1 (null = 0)
undefined + 1; // NaN
```

**Boolean Coercion:**
```javascript
if ('hello') {} // true (non-empty string)
if (0) {} // false
if ([]) {} // true (empty array is truthy)
if ({}) {} // true (empty object is truthy)
```

### Explicit Coercion

**To String:**
```javascript
String(123); // '123'
String(true); // 'true'
String(null); // 'null'
String(undefined); // 'undefined'

(123).toString(); // '123'
true.toString(); // 'true'
```

**To Number:**
```javascript
Number('123'); // 123
Number('12.34'); // 12.34
Number('hello'); // NaN
Number(true); // 1
Number(false); // 0
Number(null); // 0
Number(undefined); // NaN

parseInt('123'); // 123
parseInt('12.34'); // 12
parseInt('12px'); // 12
parseFloat('12.34'); // 12.34

+'123'; // 123 (unary plus)
```

**To Boolean:**
```javascript
Boolean(1); // true
Boolean(0); // false
Boolean('hello'); // true
Boolean(''); // false
Boolean(null); // false
Boolean(undefined); // false

!!value; // Double negation
```

## Equality and Comparison

### Loose Equality (==)

```javascript
5 == '5'; // true (type coercion)
0 == false; // true
'' == false; // true
null == undefined; // true
[] == false; // true
[] == ''; // true

// Avoid using ==
```

### Strict Equality (===)

```javascript
5 === '5'; // false (no type coercion)
5 === 5; // true
0 === false; // false
null === undefined; // false

// Always use ===
```

### Object Comparison

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

obj1 === obj2; // false (different references)
obj1 === obj3; // true (same reference)

// Deep equality (need custom function or library)
JSON.stringify(obj1) === JSON.stringify(obj2); // true (simple cases)
```

## Truthy and Falsy

### Falsy Values

```javascript
// Only 8 falsy values in JavaScript:
false
0
-0
0n (BigInt zero)
'' (empty string)
null
undefined
NaN

// All falsy
if (false) {} // false
if (0) {} // false
if ('') {} // false
if (null) {} // false
if (undefined) {} // false
if (NaN) {} // false
```

### Truthy Values

```javascript
// Everything else is truthy:
true
1, -1, 3.14 (any non-zero number)
'hello', '0', 'false' (any non-empty string)
[], [1, 2, 3] (any array)
{}, { a: 1 } (any object)
function() {} (any function)

// All truthy
if (true) {} // true
if (1) {} // true
if ('hello') {} // true
if ([]) {} // true (empty array is truthy!)
if ({}) {} // true (empty object is truthy!)
```

## Basic Patterns

### Guard Clauses

```javascript
// Bad: nested if
function process(value) {
  if (value) {
    if (value > 0) {
      if (value < 100) {
        return value * 2;
      }
    }
  }
  return 0;
}

// Good: early return
function process(value) {
  if (!value) return 0;
  if (value <= 0) return 0;
  if (value >= 100) return 0;
  return value * 2;
}
```

### Default Values

```javascript
// Old way
function greet(name) {
  name = name || 'Guest';
  return `Hello, ${name}`;
}

// Modern way
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}

// Nullish coalescing
function greet(name) {
  name = name ?? 'Guest';
  return `Hello, ${name}`;
}
```

### Swapping Variables

```javascript
// Old way
let a = 1, b = 2;
let temp = a;
a = b;
b = temp;

// Modern way
let a = 1, b = 2;
[a, b] = [b, a];
```

## Interview Questions

**Q: What's the difference between var, let, and const?**

A: var is function-scoped, hoisted, can redeclare. let is block-scoped, hoisted but not initialized (TDZ), cannot redeclare. const is like let but cannot reassign (though objects/arrays are mutable). Use const by default, let when reassignment needed, avoid var.

**Q: Explain type coercion in JavaScript.**

A: Type coercion is automatic conversion between types. Implicit coercion happens in operations ('5' + 3 = '53'). Explicit coercion uses functions (Number('5') = 5). Use strict equality (===) to avoid unexpected coercion. Understanding coercion prevents bugs.

**Q: What are falsy values in JavaScript?**

A: Eight falsy values: false, 0, -0, 0n, '' (empty string), null, undefined, NaN. Everything else is truthy, including empty arrays [] and empty objects {}. Important for conditional logic and default values.

**Q: What's the difference between == and ===?**

A: == performs type coercion before comparison (5 == '5' is true). === checks type and value without coercion (5 === '5' is false). Always use === to avoid unexpected behavior. Only exception: checking null/undefined together.

**Q: Explain the difference between function declaration and function expression.**

A: Function declarations are hoisted (can call before definition), have name. Function expressions are not hoisted, can be anonymous. Arrow functions are expressions with concise syntax and lexical this. Choose based on hoisting needs and this binding requirements.

---

[← Back to Functional Programming](./12-functional-programming.md) | [Next: Type System Theory →](./14-type-system-theory.md)
