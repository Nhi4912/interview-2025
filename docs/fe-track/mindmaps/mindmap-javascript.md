# JavaScript Mind Map - Sơ Đồ Tổng Hợp


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả kiến thức JavaScript Core để review nhanh trước phỏng vấn

---

## JavaScript Complete Mind Map

```
                                    ┌─────────────────────────────────────────────────────────────────┐
                                    │                      JAVASCRIPT CORE                              │
                                    └─────────────────────────────────────────────────────────────────┘
                                                                │
                    ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
                    │                                           │                                           │
            ┌───────▼───────┐                           ┌───────▼───────┐                           ┌───────▼───────┐
            │  EXECUTION    │                           │   OBJECTS &   │                           │    ASYNC      │
            │   MODEL       │                           │   FUNCTIONS   │                           │               │
            └───────┬───────┘                           └───────┬───────┘                           └───────┬───────┘
                    │                                           │                                           │
        ┌───────────┼───────────┐                   ┌───────────┼───────────┐                   ┌───────────┼───────────┐
        │           │           │                   │           │           │                   │           │           │
   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐         ┌────▼────┐ ┌────▼────┐ ┌────▼────┐         ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
   │Execution│ │  Scope  │ │Hoisting │         │  this   │ │Prototype│ │Closures │         │ Event   │ │Promises │ │async/   │
   │ Context │ │  Chain  │ │         │         │ binding │ │  Chain  │ │         │         │  Loop   │ │         │ │ await   │
   └────┬────┘ └────┬────┘ └────┬────┘         └────┬────┘ └────┬────┘ └────┬────┘         └────┬────┘ └────┬────┘ └────┬────┘
        │           │           │                   │           │           │                   │           │           │
        │           │           │                   │           │           │                   │           │           │
   ┌────┴────┐ ┌────┴────┐ ┌────┴────┐         ┌────┴────┐ ┌────┴────┐ ┌────┴────┐         ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
   │•Global  │ │•Lexical │ │•var:    │         │•Default │ │•__proto__│ │•Data    │         │•Call    │ │•States: │ │•Syntax  │
   │•Function│ │•Dynamic │ │undefined│         │•Implicit│ │•prototype│ │ Privacy │         │ Stack   │ │pending/ │ │ sugar   │
   │•Eval    │ │•Block   │ │•let/    │         │•Explicit│ │•Object.  │ │•State   │         │•Task    │ │fulfilled│ │•Error   │
   │         │ │         │ │const:TDZ│         │•new     │ │create()  │ │ Persist │         │ Queue   │ │/rejected│ │ handling│
   │Creation/│ │Inner →  │ │•Function│         │•Arrow   │ │•ES6 class│ │•Factory │         │•Micro-  │ │•.then() │ │•Top-    │
   │Execution│ │Outer → │ │hoisted  │         │inherits │ │ syntax   │ │ Pattern │         │ tasks   │ │•.catch()│ │ level   │
   │ Phase   │ │Global   │ │ fully   │         │         │ │          │ │         │         │•Macro-  │ │•.finally│ │ await   │
   └─────────┘ └─────────┘ └─────────┘         └─────────┘ └─────────┘ └─────────┘         │ tasks   │ │•Promise.│ └─────────┘
                                                                                           └─────────┘ │ all/race│
                                                                                                       └─────────┘
```

---

## 1. Execution Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXECUTION CONTEXT                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   ┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐   │
│   │ Variable Environment│   │ Lexical Environment │   │    this Binding     │   │
│   ├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤   │
│   │ • Variables         │   │ • Scope Chain       │   │ • Determined at     │   │
│   │ • Function decls    │   │ • Outer Reference   │   │   call time         │   │
│   │ • Arguments         │   │ • Block scope       │   │ • 4 binding rules   │   │
│   └─────────────────────┘   └─────────────────────┘   └─────────────────────┘   │
│                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                           TWO PHASES                                      │   │
│   ├──────────────────────────────────┬──────────────────────────────────────┤   │
│   │        CREATION PHASE            │          EXECUTION PHASE              │   │
│   ├──────────────────────────────────┼──────────────────────────────────────┤   │
│   │ 1. Create Variable Object        │ 1. Execute code line by line         │   │
│   │ 2. Setup Scope Chain             │ 2. Assign values to variables        │   │
│   │ 3. Determine 'this'              │ 3. Execute function calls            │   │
│   │ 4. Hoist declarations            │                                      │   │
│   └──────────────────────────────────┴──────────────────────────────────────┘   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Call Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CALL STACK                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   function first() {                     ┌─────────────────┐         │
│       second();                          │    third() EC   │ ← TOP   │
│   }                                      ├─────────────────┤         │
│                                          │   second() EC   │         │
│   function second() {                    ├─────────────────┤         │
│       third();                           │    first() EC   │         │
│   }                                      ├─────────────────┤         │
│                                          │   Global EC     │ ← BOTTOM │
│   function third() {                     └─────────────────┘         │
│       console.log("done");                                           │
│   }                                      Stack grows UP ↑            │
│                                          Pops from TOP               │
│   first();                                                           │
│                                                                       │
│   • LIFO (Last In, First Out)                                        │
│   • Maximum size (Stack Overflow possible)                           │
│   • Single-threaded execution                                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Scope & Closures

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    SCOPE                                          │
├───────────────────────────┬───────────────────────────┬───────────────────────────┤
│       GLOBAL SCOPE        │      FUNCTION SCOPE       │       BLOCK SCOPE         │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ • Window/Global object    │ • Created per function    │ • Created with {}         │
│ • Top-level declarations  │ • var is function-scoped  │ • let/const only          │
│ • Accessible everywhere   │ • Parameters included     │ • if, for, while blocks   │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  CLOSURE                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   function outer() {               ┌──────────────────────────────────────────┐ │
│       let count = 0;               │           CLOSURE MEMORY MODEL           │ │
│                                    ├──────────────────────────────────────────┤ │
│       return function inner() {    │  inner function ──▶ [[Environment]]     │ │
│           return ++count;          │                           │              │ │
│       };                           │                           ▼              │ │
│   }                                │               outer's Lexical Env       │ │
│                                    │                     { count: 0 }        │ │
│   const counter = outer();         │                                          │ │
│   counter(); // 1                  │  • Function + Lexical Environment       │ │
│   counter(); // 2                  │  • "Closes over" outer variables        │ │
│                                    │  • State persists across calls          │ │
│                                    └──────────────────────────────────────────┘ │
│                                                                                   │
│   USE CASES:                                                                      │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│   │ Data Privacy│ │   Factory   │ │ Memoization │ │  Debounce/  │               │
│   │             │ │  Functions  │ │             │ │  Throttle   │               │
│   └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. this Binding

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              'this' BINDING RULES                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   ┌─────────────────┐      PRIORITY (highest to lowest)      ┌─────────────────┐│
│   │                 │                                         │                 ││
│   │   1. new        │ ──▶ new Foo() ──▶ this = new object    │  Highest        ││
│   │                 │                                         │                 ││
│   ├─────────────────┤                                         ├─────────────────┤│
│   │                 │                                         │                 ││
│   │   2. Explicit   │ ──▶ call/apply/bind ──▶ this = arg     │                 ││
│   │                 │                                         │                 ││
│   ├─────────────────┤                                         ├─────────────────┤│
│   │                 │                                         │                 ││
│   │   3. Implicit   │ ──▶ obj.method() ──▶ this = obj        │                 ││
│   │                 │                                         │                 ││
│   ├─────────────────┤                                         ├─────────────────┤│
│   │                 │                                         │                 ││
│   │   4. Default    │ ──▶ foo() ──▶ this = window/undefined  │  Lowest         ││
│   │                 │                                         │                 ││
│   └─────────────────┘                                         └─────────────────┘│
│                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                        ARROW FUNCTIONS                                    │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │  • No own 'this' binding                                                  │   │
│   │  • Inherits 'this' from enclosing scope (lexical this)                   │   │
│   │  • Cannot be changed with call/apply/bind                                 │   │
│   │  • Cannot be used as constructor (no new)                                 │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Event Loop

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 EVENT LOOP                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   ┌─────────────┐                                        ┌─────────────────────┐│
│   │  Call Stack │◀──────────────────────────────────────│  Callback Queue     ││
│   │             │           EVENT LOOP                   │  (Macrotask Queue)  ││
│   │  [current]  │     ┌─────────────────┐               │                     ││
│   │  [context]  │     │ 1. Check Stack  │               │  • setTimeout       ││
│   │             │     │ 2. Microtasks   │               │  • setInterval      ││
│   └─────────────┘     │ 3. 1 Macrotask  │               │  • I/O              ││
│         ▲             │ 4. Repeat       │               │  • UI rendering     ││
│         │             └─────────────────┘               └─────────────────────┘│
│         │                     │                                    ▲            │
│         │                     │                                    │            │
│         │                     ▼                                    │            │
│         │             ┌─────────────────────┐                     │            │
│         │             │  Microtask Queue    │◀────────────────────┘            │
│         │             │                     │                                   │
│         └─────────────│  • Promise.then     │                                   │
│                       │  • queueMicrotask   │                                   │
│                       │  • MutationObserver │                                   │
│                       └─────────────────────┘                                   │
│                                                                                   │
│   EXECUTION ORDER:                                                               │
│   1. Execute all synchronous code (Call Stack)                                   │
│   2. Execute ALL microtasks                                                      │
│   3. Execute ONE macrotask                                                       │
│   4. Execute ALL microtasks (again)                                              │
│   5. Render (if needed)                                                          │
│   6. Repeat from step 3                                                          │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Prototype Chain

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PROTOTYPE CHAIN                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   function Person(name) {                                                        │
│       this.name = name;                                                          │
│   }                                                                              │
│   Person.prototype.greet = function() {                                          │
│       return "Hello, " + this.name;                                              │
│   };                                                                             │
│   const john = new Person("John");                                               │
│                                                                                   │
│   ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐   │
│   │      john       │         │ Person.prototype │         │ Object.prototype│   │
│   ├─────────────────┤         ├─────────────────┤         ├─────────────────┤   │
│   │ name: "John"    │──proto──▶│ greet: fn       │──proto──▶│ toString: fn    │   │
│   │ __proto__: ─────│         │ constructor: ───│         │ hasOwnProperty  │   │
│   └─────────────────┘         │ __proto__: ─────│         │ __proto__: null │   │
│                               └─────────────────┘         └─────────────────┘   │
│                                                                                   │
│   LOOKUP ORDER:                                                                  │
│   john.name      ──▶ Found on john itself                                        │
│   john.greet()   ──▶ Found on Person.prototype                                   │
│   john.toString()──▶ Found on Object.prototype                                   │
│   john.foo       ──▶ Not found ──▶ undefined                                     │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Async Patterns

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ASYNC PATTERNS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│   CALLBACKS ──────▶ PROMISES ──────▶ ASYNC/AWAIT                                 │
│                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                            PROMISES                                       │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                           │   │
│   │   const promise = new Promise((resolve, reject) => {                     │   │
│   │       // async operation                                                  │   │
│   │       resolve(value);  // or reject(error)                               │   │
│   │   });                                                                     │   │
│   │                                                                           │   │
│   │   STATES:                                                                 │   │
│   │   ┌─────────┐        ┌───────────┐        ┌──────────┐                  │   │
│   │   │ Pending │───────▶│ Fulfilled │   OR   │ Rejected │                  │   │
│   │   └─────────┘        └───────────┘        └──────────┘                  │   │
│   │                             │                    │                       │   │
│   │                             ▼                    ▼                       │   │
│   │                        .then()              .catch()                     │   │
│   │                                                                           │   │
│   │   COMBINATORS:                                                            │   │
│   │   • Promise.all([])      ──▶ Wait for ALL, fail if ANY fails             │   │
│   │   • Promise.race([])     ──▶ First to settle (fulfill OR reject)         │   │
│   │   • Promise.allSettled([])──▶ Wait for ALL, never fails                   │   │
│   │   • Promise.any([])      ──▶ First to FULFILL                             │   │
│   │                                                                           │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                           ASYNC/AWAIT                                     │   │
│   ├─────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                           │   │
│   │   async function fetchData() {                                            │   │
│   │       try {                                                               │   │
│   │           const response = await fetch(url);                              │   │
│   │           const data = await response.json();                             │   │
│   │           return data;                                                    │   │
│   │       } catch (error) {                                                   │   │
│   │           console.error(error);                                           │   │
│   │       }                                                                   │   │
│   │   }                                                                       │   │
│   │                                                                           │   │
│   │   • async function always returns Promise                                 │   │
│   │   • await pauses execution until Promise resolves                         │   │
│   │   • try/catch for error handling                                          │   │
│   │                                                                           │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Quick Reference Table

| Topic | Key Concept | Common Interview Question |
|-------|-------------|--------------------------|
| Execution Context | Creation + Execution phases | Explain hoisting |
| Scope | Lexical, function, block | var vs let vs const |
| Closure | Function + Lexical Environment | Implement debounce |
| this | 4 binding rules | Arrow vs regular function |
| Prototype | __proto__ chain | Inheritance in JS |
| Event Loop | Microtask before Macrotask | Predict console output |
| Promises | States: pending/fulfilled/rejected | Implement Promise.all |
| async/await | Syntactic sugar for Promises | Error handling patterns |

---

## 9. Cheat Sheet - Output Prediction

```javascript
// Classic Questions

// 1. Hoisting
console.log(a);     // undefined
var a = 5;

console.log(b);     // ReferenceError
let b = 5;

// 2. Closure + Loop
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// Output: 3, 3, 3

// 3. Event Loop
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// Output: 1, 4, 3, 2

// 4. this binding
const obj = {
    name: 'obj',
    regular: function() { console.log(this.name); },
    arrow: () => console.log(this.name)
};
obj.regular();  // 'obj'
obj.arrow();    // undefined (inherits from global)

// 5. Prototype
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name; };
const dog = new Animal('Dog');
console.log(dog.speak());  // 'Dog'
console.log(dog.hasOwnProperty('name'));  // true
console.log(dog.hasOwnProperty('speak')); // false
```

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh trước phỏng vấn
