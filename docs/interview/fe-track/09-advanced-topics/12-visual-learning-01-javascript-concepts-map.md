# JavaScript Concepts Mind Map
## Visual Learning - Chapter 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Ecosystem Map →](./02-react-ecosystem-map.md)

---

## Overview

Visual representations of JavaScript concepts to help you understand relationships and hierarchies. Perfect for quick review before interviews.

---

## Complete JavaScript Ecosystem

```
JavaScript
│
├── Core Language
│   ├── Syntax & Grammar
│   │   ├── Variables (var, let, const)
│   │   ├── Data Types
│   │   ├── Operators
│   │   ├── Control Flow
│   │   └── Functions
│   │
│   ├── Data Types
│   │   ├── Primitives
│   │   │   ├── string
│   │   │   ├── number
│   │   │   ├── boolean
│   │   │   ├── null
│   │   │   ├── undefined
│   │   │   ├── symbol
│   │   │   └── bigint
│   │   │
│   │   └── Reference Types
│   │       ├── Object
│   │       ├── Array
│   │       ├── Function
│   │       ├── Date
│   │       ├── RegExp
│   │       ├── Map
│   │       ├── Set
│   │       ├── WeakMap
│   │       └── WeakSet
│   │
│   ├── Functions
│   │   ├── Function Declaration
│   │   ├── Function Expression
│   │   ├── Arrow Functions
│   │   ├── IIFE
│   │   ├── Higher-Order Functions
│   │   ├── Closures
│   │   ├── Recursion
│   │   └── Generator Functions
│   │
│   ├── Scope & Context
│   │   ├── Global Scope
│   │   ├── Function Scope
│   │   ├── Block Scope
│   │   ├── Lexical Scope
│   │   ├── Execution Context
│   │   ├── this Keyword
│   │   └── call/apply/bind
│   │
│   └── Prototypes & OOP
│       ├── Prototype Chain
│       ├── Constructor Functions
│       ├── ES6 Classes
│       ├── Inheritance
│       ├── Encapsulation
│       └── Polymorphism
│
├── Asynchronous JavaScript
│   ├── Event Loop
│   │   ├── Call Stack
│   │   ├── Web APIs
│   │   ├── Callback Queue (Macrotasks)
│   │   ├── Microtask Queue
│   │   └── Render Queue
│   │
│   ├── Patterns
│   │   ├── Callbacks
│   │   ├── Promises
│   │   ├── Async/Await
│   │   ├── Generators
│   │   └── Observables
│   │
│   └── APIs
│       ├── setTimeout/setInterval
│       ├── fetch
│       ├── XMLHttpRequest
│       ├── WebSockets
│       └── Server-Sent Events
│
├── Modern JavaScript (ES6+)
│   ├── ES6 (2015)
│   │   ├── let & const
│   │   ├── Arrow Functions
│   │   ├── Template Literals
│   │   ├── Destructuring
│   │   ├── Spread/Rest
│   │   ├── Classes
│   │   ├── Modules
│   │   ├── Promises
│   │   ├── Symbols
│   │   └── Iterators/Generators
│   │
│   ├── ES7-ES13 (2016-2022)
│   │   ├── Async/Await
│   │   ├── Object.entries/values
│   │   ├── String padding
│   │   ├── Optional Chaining (?.)
│   │   ├── Nullish Coalescing (??)
│   │   ├── BigInt
│   │   ├── Promise.allSettled
│   │   ├── Logical Assignment
│   │   └── Top-level await
│   │
│   └── ES2023-2024
│       ├── Array.findLast
│       ├── Array.toSorted
│       ├── Array.toReversed
│       ├── Array.with
│       └── Hashbang Grammar
│
├── Design Patterns
│   ├── Creational
│   │   ├── Singleton
│   │   ├── Factory
│   │   ├── Builder
│   │   └── Prototype
│   │
│   ├── Structural
│   │   ├── Module
│   │   ├── Decorator
│   │   ├── Facade
│   │   └── Proxy
│   │
│   └── Behavioral
│       ├── Observer
│       ├── Strategy
│       ├── Command
│       └── Iterator
│
└── Browser APIs
    ├── DOM Manipulation
    ├── Events
    ├── Storage (localStorage, sessionStorage)
    ├── Fetch API
    ├── Web Workers
    ├── Service Workers
    ├── WebSockets
    ├── Geolocation
    ├── Canvas
    └── WebGL
```

---

## Data Types Deep Dive

```
JavaScript Data Types
│
├── Primitive Types (Immutable, Compared by Value)
│   │
│   ├── string
│   │   ├── Creation: "text", 'text', `template`
│   │   ├── Methods: charAt, slice, split, replace
│   │   ├── Immutable: str[0] = 'x' has no effect
│   │   └── Use Cases: Text, IDs, JSON keys
│   │
│   ├── number
│   │   ├── Range: ±(2^53 - 1)
│   │   ├── Special: Infinity, -Infinity, NaN
│   │   ├── Methods: toFixed, toPrecision, parseInt
│   │   └── Use Cases: Calculations, counters, IDs
│   │
│   ├── boolean
│   │   ├── Values: true, false
│   │   ├── Falsy: false, 0, "", null, undefined, NaN
│   │   ├── Truthy: Everything else
│   │   └── Use Cases: Conditions, flags, toggles
│   │
│   ├── null
│   │   ├── Meaning: Intentional absence
│   │   ├── typeof: "object" (bug!)
│   │   └── Use Cases: Reset values, API responses
│   │
│   ├── undefined
│   │   ├── Meaning: Not assigned
│   │   ├── typeof: "undefined"
│   │   └── Use Cases: Default values, missing props
│   │
│   ├── symbol
│   │   ├── Creation: Symbol(), Symbol.for()
│   │   ├── Unique: Each symbol is unique
│   │   └── Use Cases: Object keys, constants
│   │
│   └── bigint
│       ├── Creation: 123n, BigInt(123)
│       ├── Range: Arbitrary precision
│       └── Use Cases: Large integers, crypto
│
└── Reference Types (Mutable, Compared by Reference)
    │
    ├── Object
    │   ├── Creation: {}, new Object(), Object.create()
    │   ├── Properties: key-value pairs
    │   ├── Methods: Object.keys, values, entries
    │   └── Use Cases: Data structures, configs
    │
    ├── Array
    │   ├── Creation: [], new Array(), Array.of()
    │   ├── Methods: map, filter, reduce, forEach
    │   ├── Indexed: 0-based
    │   └── Use Cases: Lists, collections
    │
    ├── Function
    │   ├── Types: Declaration, Expression, Arrow
    │   ├── Properties: name, length, prototype
    │   ├── Methods: call, apply, bind
    │   └── Use Cases: Logic, callbacks, HOF
    │
    ├── Date
    │   ├── Creation: new Date()
    │   ├── Methods: getTime, toISOString
    │   └── Use Cases: Timestamps, scheduling
    │
    ├── RegExp
    │   ├── Creation: /pattern/, new RegExp()
    │   ├── Methods: test, exec, match
    │   └── Use Cases: Validation, parsing
    │
    ├── Map
    │   ├── Key-value pairs (any type as key)
    │   ├── Methods: set, get, has, delete
    │   └── Use Cases: Caching, lookups
    │
    ├── Set
    │   ├── Unique values
    │   ├── Methods: add, has, delete
    │   └── Use Cases: Deduplication, membership
    │
    ├── WeakMap
    │   ├── Weak references (garbage collected)
    │   ├── Keys: Objects only
    │   └── Use Cases: Private data, caching
    │
    └── WeakSet
        ├── Weak references
        ├── Values: Objects only
        └── Use Cases: Tracking objects
```

---

## Scope & Execution Context

```
Scope Chain & Execution Context
│
├── Global Execution Context
│   ├── Global Object (window/global)
│   ├── this → Global Object
│   └── Variables in global scope
│
├── Function Execution Context
│   ├── Created when function is called
│   ├── Activation Object
│   │   ├── arguments object
│   │   ├── Local variables
│   │   └── Inner functions
│   ├── Scope Chain
│   │   └── Links to outer scopes
│   └── this binding
│       ├── Default: global/undefined
│       ├── Implicit: object.method()
│       ├── Explicit: call/apply/bind
│       └── new: new instance
│
└── Lexical Environment
    ├── Environment Record
    │   ├── Declarative (let, const, function)
    │   └── Object (with statement)
    ├── Outer Reference
    │   └── Parent lexical environment
    └── this Binding
        └── Determined at creation time

Execution Flow:
1. Creation Phase
   ├── Create Scope Chain
   ├── Create Variable Object
   │   ├── Create arguments object
   │   ├── Scan for function declarations (hoisted)
   │   └── Scan for variable declarations (hoisted as undefined)
   └── Determine 'this' value
│
2. Execution Phase
   ├── Assign values to variables
   ├── Execute code line by line
   └── Reference variables via scope chain
```

---

## Event Loop Visualization

```
JavaScript Runtime Environment
│
┌─────────────────────────────────────────────────────────┐
│                     Call Stack                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  function3()                                      │  │
│  │  function2()                                      │  │
│  │  function1()                                      │  │
│  │  main()                                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    Web APIs                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  setTimeout()                                     │  │
│  │  fetch()                                          │  │
│  │  DOM Events                                       │  │
│  │  XMLHttpRequest                                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Callback Queue (Macrotasks)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [setTimeout callback] → [DOM event] → [...]     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Microtask Queue                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  [Promise.then] → [queueMicrotask] → [...]       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
                   Event Loop
                   (Coordinator)

Execution Order:
1. Execute all synchronous code (Call Stack)
2. Execute ALL Microtasks
3. Execute ONE Macrotask
4. Execute ALL Microtasks (again)
5. Render (if needed)
6. Repeat from step 3

Example:
console.log('1');                    // Sync → Output: 1
setTimeout(() => console.log('2'), 0); // Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
console.log('4');                    // Sync → Output: 4

Output Order: 1, 4, 3, 2
```

---

## Prototype Chain

```
Prototype Chain
│
Object Instance
    │
    │ __proto__
    ↓
Constructor.prototype
    │
    │ __proto__
    ↓
Object.prototype
    │
    │ __proto__
    ↓
null

Example:
const arr = [1, 2, 3];

arr
  │ __proto__
  ↓
Array.prototype
  │ (map, filter, reduce, etc.)
  │ __proto__
  ↓
Object.prototype
  │ (toString, hasOwnProperty, etc.)
  │ __proto__
  ↓
null

Lookup Process:
1. Check arr for property
2. If not found, check Array.prototype
3. If not found, check Object.prototype
4. If not found, return undefined
```

---

## Closure Visualization

```
Closure Mechanism
│
Outer Function Scope
┌─────────────────────────────────────┐
│  function outer() {                 │
│    const outerVar = 'outer';        │
│    ┌───────────────────────────┐   │
│    │  function inner() {       │   │
│    │    console.log(outerVar); │   │
│    │  }                        │   │
│    │  return inner;            │   │
│    └───────────────────────────┘   │
│  }                                  │
└─────────────────────────────────────┘
         │
         │ Returns inner function
         ↓
┌─────────────────────────────────────┐
│  const fn = outer();                │
│                                     │
│  fn(); // Can still access outerVar│
└─────────────────────────────────────┘

Memory:
┌─────────────────────────────────────┐
│  Closure Scope                      │
│  ┌───────────────────────────────┐ │
│  │  outerVar: 'outer'            │ │
│  │  (kept in memory)             │ │
│  └───────────────────────────────┘ │
│         ↑                           │
│         │ Referenced by inner()    │
│  ┌───────────────────────────────┐ │
│  │  inner function               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Promise States & Flow

```
Promise Lifecycle
│
┌─────────────────────────────────────┐
│         new Promise()               │
│              │                       │
│              ↓                       │
│         [PENDING]                   │
│              │                       │
│      ┌───────┴───────┐              │
│      ↓               ↓              │
│  [FULFILLED]    [REJECTED]          │
│      │               │              │
│      ↓               ↓              │
│   .then()         .catch()          │
│      │               │              │
│      └───────┬───────┘              │
│              ↓                       │
│          .finally()                 │
└─────────────────────────────────────┘

Promise Chaining:
Promise
  .then(result1 => {
    return processResult1(result1);
  })
  .then(result2 => {
    return processResult2(result2);
  })
  .then(result3 => {
    console.log('Final:', result3);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Cleanup');
  });

Promise Combinators:
┌─────────────────────────────────────┐
│  Promise.all([p1, p2, p3])          │
│  → Waits for all, fails fast        │
│                                     │
│  Promise.allSettled([p1, p2, p3])   │
│  → Waits for all, never fails       │
│                                     │
│  Promise.race([p1, p2, p3])         │
│  → First to settle wins             │
│                                     │
│  Promise.any([p1, p2, p3])          │
│  → First to fulfill wins            │
└─────────────────────────────────────┘
```

---

## Array Methods Flowchart

```
Array Methods Decision Tree
│
Start with Array
│
├─ Need to transform each element?
│  └─ .map(fn) → New array with transformed elements
│
├─ Need to filter elements?
│  └─ .filter(fn) → New array with elements that pass test
│
├─ Need to reduce to single value?
│  └─ .reduce(fn, initial) → Single accumulated value
│
├─ Need to find one element?
│  ├─ .find(fn) → First element that passes test
│  └─ .findIndex(fn) → Index of first element that passes test
│
├─ Need to check conditions?
│  ├─ .some(fn) → true if at least one passes
│  └─ .every(fn) → true if all pass
│
├─ Need to iterate without return?
│  └─ .forEach(fn) → Executes function for each element
│
├─ Need to sort?
│  └─ .sort(compareFn) → Sorts array in place
│
├─ Need to add/remove elements?
│  ├─ .push(item) → Add to end
│  ├─ .pop() → Remove from end
│  ├─ .unshift(item) → Add to beginning
│  ├─ .shift() → Remove from beginning
│  └─ .splice(index, count, items) → Add/remove at index
│
└─ Need to combine/extract?
   ├─ .concat(arr2) → Merge arrays
   ├─ .slice(start, end) → Extract portion
   ├─ .join(separator) → Convert to string
   └─ .flat(depth) → Flatten nested arrays

Chaining Example:
array
  .filter(x => x > 0)      // Keep positive numbers
  .map(x => x * 2)         // Double each
  .reduce((sum, x) => sum + x, 0); // Sum all
```

---

## Function Types Comparison

```
Function Types
│
├── Function Declaration
│   ├── Syntax: function name() {}
│   ├── Hoisting: ✅ Fully hoisted
│   ├── this: Dynamic (call-site)
│   ├── arguments: ✅ Available
│   ├── constructor: ✅ Can use 'new'
│   └── Use: Named functions, methods
│
├── Function Expression
│   ├── Syntax: const name = function() {}
│   ├── Hoisting: ❌ Variable hoisted, not function
│   ├── this: Dynamic (call-site)
│   ├── arguments: ✅ Available
│   ├── constructor: ✅ Can use 'new'
│   └── Use: Callbacks, conditional functions
│
├── Arrow Function
│   ├── Syntax: const name = () => {}
│   ├── Hoisting: ❌ Variable hoisted, not function
│   ├── this: Lexical (inherited)
│   ├── arguments: ❌ Not available
│   ├── constructor: ❌ Cannot use 'new'
│   └── Use: Callbacks, short functions, methods
│
├── Method Shorthand
│   ├── Syntax: { method() {} }
│   ├── Hoisting: N/A (object property)
│   ├── this: Dynamic (object)
│   ├── arguments: ✅ Available
│   ├── constructor: ❌ Cannot use 'new'
│   └── Use: Object methods
│
└── Generator Function
    ├── Syntax: function* name() {}
    ├── Hoisting: ✅ Fully hoisted
    ├── this: Dynamic (call-site)
    ├── arguments: ✅ Available
    ├── constructor: ❌ Cannot use 'new'
    └── Use: Iterators, lazy evaluation
```

---

## Memory Management

```
Memory Lifecycle
│
1. Allocation
   ├── Primitive: Stack
   │   └── Direct value storage
   └── Reference: Heap
       └── Pointer in stack, data in heap
│
2. Usage
   ├── Read/Write operations
   └── Function calls
│
3. Garbage Collection
   ├── Mark-and-Sweep Algorithm
   │   ├── Mark: Find reachable objects
   │   └── Sweep: Remove unreachable objects
   │
   └── Reference Counting
       └── Count references to each object

Memory Leaks:
├── Global variables
│   └── Unintentional globals
├── Forgotten timers
│   └── setInterval not cleared
├── Closures
│   └── Unnecessary references
├── DOM references
│   └── Detached nodes
└── Event listeners
    └── Not removed

Prevention:
├── Use let/const (block scope)
├── Clear timers/intervals
├── Remove event listeners
├── Use WeakMap/WeakSet
└── Avoid circular references
```

---

## Summary

These visual representations help you:
- Understand relationships between concepts
- See the big picture
- Quick review before interviews
- Identify knowledge gaps
- Connect related topics

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: React Ecosystem Map →](./02-react-ecosystem-map.md)
