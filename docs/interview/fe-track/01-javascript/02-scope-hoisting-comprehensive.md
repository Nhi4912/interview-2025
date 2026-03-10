# Scope & Hoisting - Comprehensive Guide
## JavaScript Fundamentals - Deep Dive

[← Back to Variables & Data Types](./01-variables-data-types.md) | [Next: Closures →](./03-closures.md)

---

## 📋 Table of Contents

1. [Scope Fundamentals](#scope-fundamentals)
2. [Lexical Scope Deep Dive](#lexical-scope-deep-dive)
3. [Hoisting Mechanism](#hoisting-mechanism)
4. [Temporal Dead Zone](#temporal-dead-zone)
5. [Scope Chain](#scope-chain)
6. [Block Scope vs Function Scope](#block-scope-vs-function-scope)
7. [Advanced Patterns](#advanced-patterns)
8. [Memory & Performance](#memory-performance)
9. [Interview Questions](#interview-questions)
10. [Practice Problems](#practice-problems)

---

## 🎯 Learning Objectives

By the end of this chapter, you will understand:
- How JavaScript's scope mechanism works at a deep level
- The difference between lexical and dynamic scope
- Hoisting behavior for variables, functions, and classes
- Temporal Dead Zone (TDZ) and its implications
- Scope chain resolution and performance considerations
- Best practices for scope management

---

## Scope Fundamentals

### What is Scope?

**English Definition:** Scope determines the accessibility (visibility) of variables, functions, and objects in different parts of your code during runtime.

**Định nghĩa (Tiếng Việt):** Scope xác định khả năng truy cập (tầm nhìn) của biến, hàm và đối tượng trong các phần khác nhau của code trong quá trình chạy.


### Scope Hierarchy Mind Map

```
JavaScript Scope System
│
├── Global Scope
│   ├── Window object (browser)
│   ├── Global object (Node.js)
│   └── Accessible everywhere
│
├── Module Scope (ES6)
│   ├── File-level scope
│   ├── Import/Export boundaries
│   └── Not polluting global
│
├── Function Scope
│   ├── Created by functions
│   ├── var declarations
│   └── Function parameters
│
└── Block Scope (ES6)
    ├── Created by { }
    ├── let declarations
    ├── const declarations
    └── Loop iterations
```

### Types of Scope

```javascript
// 1. GLOBAL SCOPE
var globalVar = "I'm global";
let globalLet = "Also global";
const globalConst = "Global too";

function accessGlobal() {
  console.log(globalVar); // Accessible
  console.log(globalLet); // Accessible
  console.log(globalConst); // Accessible
}

// 2. FUNCTION SCOPE
function functionScope() {
  var functionVar = "Function scoped";
  let functionLet = "Also function scoped";
  
  if (true) {
    var stillFunctionScoped = "var ignores blocks";
    let blockScoped = "let respects blocks";
  }
  
  console.log(stillFunctionScoped); // ✓ Accessible
  // console.log(blockScoped); // ✗ ReferenceError
}

// 3. BLOCK SCOPE
{
  let blockLet = "Block scoped";
  const blockConst = "Block scoped too";
  var notBlockScoped = "var escapes blocks";
}

// console.log(blockLet); // ✗ ReferenceError
// console.log(blockConst); // ✗ ReferenceError
console.log(notBlockScoped); // ✓ Accessible

// 4. MODULE SCOPE (ES6 Modules)
// file: module.js
const modulePrivate = "Private to module";
export const modulePublic = "Exported from module";

// file: main.js
// import { modulePublic } from './module.js';
// console.log(modulePublic); // ✓ Accessible
// console.log(modulePrivate); // ✗ Not accessible
```

---

## Lexical Scope Deep Dive

### What is Lexical Scope?

**Definition:** Lexical scope (also called static scope) means that the scope of a variable is determined by its position in the source code. The scope is set at author-time (when you write the code), not at runtime.

**Định nghĩa:** Lexical scope (còn gọi là static scope) có nghĩa là phạm vi của biến được xác định bởi vị trí của nó trong mã nguồn. Phạm vi được thiết lập tại thời điểm viết code, không phải lúc chạy.

### Lexical Scope Visualization

```javascript
// Outer function creates lexical environment
function outer() {
  const outerVar = "I'm from outer";
  
  // Middle function has access to outer's scope
  function middle() {
    const middleVar = "I'm from middle";
    
    // Inner function has access to both outer and middle scopes
    function inner() {
      const innerVar = "I'm from inner";
      
      // Can access all three scopes
      console.log(innerVar);   // ✓ Own scope
      console.log(middleVar);  // ✓ Parent scope
      console.log(outerVar);   // ✓ Grandparent scope
    }
    
    inner();
    // console.log(innerVar); // ✗ Cannot access child scope
  }
  
  middle();
}

outer();
```

### Lexical Environment Structure

```
Lexical Environment = {
  Environment Record: {
    // Variables and functions declared in this scope
  },
  Outer Reference: <reference to parent lexical environment>
}
```

### Detailed Example with Visualization

```javascript
let global = "global";

function level1() {
  let var1 = "level1";
  
  function level2() {
    let var2 = "level2";
    
    function level3() {
      let var3 = "level3";
      
      // Scope chain lookup visualization:
      console.log(var3);   // Found in level3 scope ✓
      console.log(var2);   // Not in level3, check level2 ✓
      console.log(var1);   // Not in level2, check level1 ✓
      console.log(global); // Not in level1, check global ✓
      // console.log(nonExistent); // Not found anywhere ✗ ReferenceError
    }
    
    level3();
  }
  
  level2();
}

level1();

/*
Scope Chain Visualization:

level3 Scope
  ↓ (outer reference)
level2 Scope
  ↓ (outer reference)
level1 Scope
  ↓ (outer reference)
Global Scope
  ↓
null
*/
```

### Lexical Scope vs Dynamic Scope

```javascript
// JavaScript uses LEXICAL scope
const value = "global";

function showValue() {
  console.log(value); // Looks up lexically (where defined)
}

function outer() {
  const value = "outer";
  showValue(); // Prints "global", not "outer"
}

outer();

/*
If JavaScript used DYNAMIC scope (it doesn't):
- showValue() would look at the call stack
- It would find value = "outer" in the calling function
- It would print "outer"

But with LEXICAL scope:
- showValue() looks at where it was DEFINED
- It finds value = "global" in the global scope
- It prints "global"
*/
```

---

## Hoisting Mechanism

### What is Hoisting?

**Definition:** Hoisting is JavaScript's default behavior of moving declarations to the top of their scope before code execution. Only declarations are hoisted, not initializations.

**Định nghĩa:** Hoisting là hành vi mặc định của JavaScript di chuyển các khai báo lên đầu phạm vi của chúng trước khi thực thi code. Chỉ có khai báo được hoisted, không phải khởi tạo.

### Hoisting Visualization

```javascript
// What you write:
console.log(x); // undefined
var x = 5;
console.log(x); // 5

// How JavaScript interprets it:
var x; // Declaration hoisted
console.log(x); // undefined (declared but not initialized)
x = 5; // Initialization stays in place
console.log(x); // 5
```

### Variable Hoisting: var vs let vs const

```javascript
// ========================================
// VAR HOISTING
// ========================================

console.log(varVariable); // undefined (hoisted, initialized to undefined)
var varVariable = "I'm var";
console.log(varVariable); // "I'm var"

// Interpreted as:
var varVariable; // Hoisted to top, initialized to undefined
console.log(varVariable);
varVariable = "I'm var";
console.log(varVariable);

// ========================================
// LET HOISTING
// ========================================

// console.log(letVariable); // ReferenceError: Cannot access before initialization
let letVariable = "I'm let";
console.log(letVariable); // "I'm let"

/*
let IS hoisted, but enters "Temporal Dead Zone" (TDZ)
- Declaration is hoisted
- But NOT initialized
- Accessing it before declaration = ReferenceError
*/

// ========================================
// CONST HOISTING
// ========================================

// console.log(constVariable); // ReferenceError: Cannot access before initialization
const constVariable = "I'm const";
console.log(constVariable); // "I'm const"

// Same as let: hoisted but in TDZ
```

### Function Hoisting

```javascript
// ========================================
// FUNCTION DECLARATION HOISTING
// ========================================

// Can call before declaration
greet(); // "Hello!" - Works!

function greet() {
  console.log("Hello!");
}

// Entire function is hoisted:
/*
function greet() {
  console.log("Hello!");
}
greet();
*/

// ========================================
// FUNCTION EXPRESSION HOISTING
// ========================================

// Cannot call before declaration
// sayHi(); // TypeError: sayHi is not a function

var sayHi = function() {
  console.log("Hi!");
};

sayHi(); // "Hi!" - Works after declaration

// Interpreted as:
/*
var sayHi; // Variable hoisted, initialized to undefined
sayHi(); // Trying to call undefined() = TypeError
sayHi = function() {
  console.log("Hi!");
};
*/

// ========================================
// ARROW FUNCTION HOISTING
// ========================================

// Arrow functions behave like function expressions
// greetArrow(); // ReferenceError or TypeError

const greetArrow = () => {
  console.log("Hello from arrow!");
};

greetArrow(); // Works after declaration
```

### Class Hoisting

```javascript
// ========================================
// CLASS HOISTING
// ========================================

// Classes are hoisted but NOT initialized (like let/const)
// const instance = new MyClass(); // ReferenceError

class MyClass {
  constructor(name) {
    this.name = name;
  }
}

const instance = new MyClass("Test"); // Works after declaration

// ========================================
// CLASS EXPRESSION HOISTING
// ========================================

// Same as function expressions
// const obj = new MyClassExpr(); // TypeError

const MyClassExpr = class {
  constructor(name) {
    this.name = name;
  }
};

const obj = new MyClassExpr("Test");
```

### Hoisting in Different Scopes

```javascript
// ========================================
// GLOBAL SCOPE HOISTING
// ========================================

console.log(globalVar); // undefined
var globalVar = "global";

// ========================================
// FUNCTION SCOPE HOISTING
// ========================================

function testHoisting() {
  console.log(funcVar); // undefined (hoisted to function top)
  var funcVar = "function scoped";
  
  if (true) {
    console.log(funcVar); // "function scoped"
    var funcVar2 = "also function scoped"; // Hoisted to function top
  }
  
  console.log(funcVar2); // "also function scoped" (accessible)
}

// ========================================
// BLOCK SCOPE HOISTING
// ========================================

{
  // console.log(blockVar); // ReferenceError (TDZ)
  let blockVar = "block scoped";
  console.log(blockVar); // "block scoped"
}

// console.log(blockVar); // ReferenceError (not accessible outside block)
```

---

## Temporal Dead Zone (TDZ)

### What is TDZ?

**Definition:** The Temporal Dead Zone is the period between entering scope and the variable declaration being executed. During this time, the variable exists but cannot be accessed.

**Định nghĩa:** Temporal Dead Zone là khoảng thời gian giữa việc vào phạm vi và khai báo biến được thực thi. Trong thời gian này, biến tồn tại nhưng không thể truy cập.

### TDZ Visualization

```javascript
// TDZ starts at beginning of scope
{
  // TDZ for 'x' starts here
  // console.log(x); // ReferenceError: x is in TDZ
  // console.log(y); // ReferenceError: y is in TDZ
  
  let x = 10; // TDZ for 'x' ends here
  console.log(x); // 10 - OK
  
  // console.log(y); // ReferenceError: y still in TDZ
  
  const y = 20; // TDZ for 'y' ends here
  console.log(y); // 20 - OK
}

/*
Timeline:
┌─────────────────────────────────────┐
│ Scope Entry                         │
├─────────────────────────────────────┤
│ TDZ for x and y                     │
│ (variables exist but inaccessible)  │
├─────────────────────────────────────┤
│ let x = 10; ← TDZ ends for x        │
├─────────────────────────────────────┤
│ x is accessible                     │
│ y still in TDZ                      │
├─────────────────────────────────────┤
│ const y = 20; ← TDZ ends for y      │
├─────────────────────────────────────┤
│ Both x and y accessible             │
└─────────────────────────────────────┘
*/
```

### TDZ Examples

```javascript
// Example 1: Basic TDZ
function tdz1() {
  // TDZ starts
  console.log(typeof value); // ReferenceError (not "undefined"!)
  let value = 42;
  // TDZ ends
}

// Example 2: TDZ with var (no TDZ)
function tdz2() {
  console.log(typeof value); // "undefined" (no TDZ for var)
  var value = 42;
}

// Example 3: TDZ in parameters
function tdz3(a = b, b = 2) {
  // b is in TDZ when a is initialized
  return [a, b];
}
// tdz3(); // ReferenceError: Cannot access 'b' before initialization
tdz3(1, 2); // [1, 2] - OK

// Example 4: TDZ with default parameters
function tdz4(a = a) {
  // a is in TDZ when trying to use it for default
  return a;
}
// tdz4(); // ReferenceError

// Example 5: TDZ doesn't apply to function declarations
function tdz5() {
  console.log(myFunc()); // "Works!" - function declarations not in TDZ
  
  function myFunc() {
    return "Works!";
  }
}
```


### Why TDZ Exists

```javascript
// TDZ prevents using variables before initialization
// This catches potential bugs:

// Bad pattern (prevented by TDZ):
{
  // If this worked, it would use uninitialized value
  // console.log(config); // ReferenceError - Good!
  
  let config = loadConfig();
}

// Without TDZ (like var), you might get:
{
  console.log(oldConfig); // undefined - Might cause bugs!
  var oldConfig = loadConfig();
}
```

---

## Scope Chain

### How Scope Chain Works

**Definition:** The scope chain is the mechanism JavaScript uses to resolve variable names. It searches from the current scope outward to parent scopes until it finds the variable or reaches global scope.

**Định nghĩa:** Scope chain là cơ chế JavaScript sử dụng để phân giải tên biến. Nó tìm kiếm từ phạm vi hiện tại ra ngoài đến các phạm vi cha cho đến khi tìm thấy biến hoặc đến phạm vi toàn cục.

### Scope Chain Visualization

```javascript
const global = "global";

function outer() {
  const outerVar = "outer";
  
  function middle() {
    const middleVar = "middle";
    
    function inner() {
      const innerVar = "inner";
      
      // Scope chain lookup:
      console.log(innerVar);   // Step 1: Found in inner scope ✓
      console.log(middleVar);  // Step 2: Not in inner, check middle ✓
      console.log(outerVar);   // Step 3: Not in middle, check outer ✓
      console.log(global);     // Step 4: Not in outer, check global ✓
    }
    
    return inner;
  }
  
  return middle;
}

const middleFn = outer();
const innerFn = middleFn();
innerFn();

/*
Scope Chain Structure:

inner() execution context
  ↓ [[Scope]]
middle() lexical environment
  ↓ [[Scope]]
outer() lexical environment
  ↓ [[Scope]]
Global lexical environment
  ↓
null
*/
```

### Scope Chain Performance

```javascript
// ========================================
// PERFORMANCE CONSIDERATION
// ========================================

// Slower: Deep scope chain lookup
function level1() {
  const a = 1;
  function level2() {
    const b = 2;
    function level3() {
      const c = 3;
      function level4() {
        const d = 4;
        function level5() {
          // Must traverse 5 levels to find 'a'
          console.log(a); // Slower
        }
        return level5;
      }
      return level4;
    }
    return level3;
  }
  return level2;
}

// Faster: Shallow scope chain
function optimized() {
  const a = 1;
  const b = 2;
  const c = 3;
  const d = 4;
  
  function inner() {
    // Only 2 levels to traverse
    console.log(a); // Faster
  }
  
  return inner;
}

// Best practice: Cache frequently accessed outer variables
function withCaching() {
  const expensiveValue = computeExpensive();
  
  return function inner() {
    // Cache outer variable in local scope
    const cached = expensiveValue;
    
    // Use cached value multiple times
    console.log(cached);
    console.log(cached);
    console.log(cached);
  };
}
```

### Scope Chain and Closures

```javascript
function createCounter() {
  let count = 0; // Captured in closure
  
  return {
    increment() {
      // Scope chain: increment → createCounter → global
      count++; // Finds 'count' in createCounter scope
      return count;
    },
    decrement() {
      // Scope chain: decrement → createCounter → global
      count--; // Same 'count' variable
      return count;
    },
    getCount() {
      // Scope chain: getCount → createCounter → global
      return count; // Same 'count' variable
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1

/*
All three methods share the same scope chain:
- They all close over the same 'count' variable
- Changes in one method affect the others
- 'count' persists as long as any method exists
*/
```

---

## Block Scope vs Function Scope

### Comprehensive Comparison

```javascript
// ========================================
// FUNCTION SCOPE (var)
// ========================================

function functionScopeExample() {
  var x = 1;
  
  if (true) {
    var x = 2; // Same variable!
    console.log(x); // 2
  }
  
  console.log(x); // 2 (modified by if block)
  
  for (var i = 0; i < 3; i++) {
    // var i is function-scoped
  }
  
  console.log(i); // 3 (accessible outside loop)
}

// ========================================
// BLOCK SCOPE (let/const)
// ========================================

function blockScopeExample() {
  let x = 1;
  
  if (true) {
    let x = 2; // Different variable!
    console.log(x); // 2
  }
  
  console.log(x); // 1 (unchanged)
  
  for (let i = 0; i < 3; i++) {
    // let i is block-scoped to loop
  }
  
  // console.log(i); // ReferenceError (not accessible)
}

// ========================================
// PRACTICAL IMPLICATIONS
// ========================================

// Problem with var in loops:
var callbacks = [];
for (var i = 0; i < 3; i++) {
  callbacks.push(function() {
    console.log(i); // All closures reference same 'i'
  });
}
callbacks[0](); // 3 (not 0!)
callbacks[1](); // 3 (not 1!)
callbacks[2](); // 3 (not 2!)

// Solution with let:
var callbacks2 = [];
for (let i = 0; i < 3; i++) {
  callbacks2.push(function() {
    console.log(i); // Each closure gets its own 'i'
  });
}
callbacks2[0](); // 0 ✓
callbacks2[1](); // 1 ✓
callbacks2[2](); // 2 ✓

// Why? Each iteration creates a new block scope:
/*
Iteration 0: { let i = 0; callback captures this i }
Iteration 1: { let i = 1; callback captures this i }
Iteration 2: { let i = 2; callback captures this i }
*/
```

### Block Scope in Different Contexts

```javascript
// ========================================
// IF BLOCKS
// ========================================

if (true) {
  let blockScoped = "only in if";
  var functionScoped = "escapes if";
}
// console.log(blockScoped); // ReferenceError
console.log(functionScoped); // "escapes if"

// ========================================
// FOR LOOPS
// ========================================

for (let i = 0; i < 3; i++) {
  let loopScoped = i;
  // loopScoped only exists in this iteration
}
// console.log(loopScoped); // ReferenceError

// ========================================
// WHILE LOOPS
// ========================================

let i = 0;
while (i < 3) {
  let whileScoped = i;
  i++;
}
// console.log(whileScoped); // ReferenceError

// ========================================
// SWITCH BLOCKS
// ========================================

switch (true) {
  case true:
    let caseScoped = "only in switch";
    break;
}
// console.log(caseScoped); // ReferenceError

// ========================================
// TRY-CATCH BLOCKS
// ========================================

try {
  let tryScoped = "only in try";
  throw new Error();
} catch (e) {
  let catchScoped = "only in catch";
  // console.log(tryScoped); // ReferenceError
}
// console.log(catchScoped); // ReferenceError

// ========================================
// STANDALONE BLOCKS
// ========================================

{
  let blockScoped = "in standalone block";
  const alsoBlockScoped = "also in block";
}
// console.log(blockScoped); // ReferenceError
```

---

## Advanced Patterns

### Pattern 1: IIFE (Immediately Invoked Function Expression)

```javascript
// ========================================
// CLASSIC IIFE PATTERN
// ========================================

(function() {
  var privateVar = "I'm private";
  
  console.log(privateVar); // Accessible inside
})();

// console.log(privateVar); // ReferenceError (not accessible outside)

// ========================================
// IIFE WITH PARAMETERS
// ========================================

(function(global, undefined) {
  // 'global' is window/global object
  // 'undefined' is truly undefined (can't be overridden)
  
  global.myLibrary = {
    version: "1.0.0"
  };
})(window);

// ========================================
// MODERN ALTERNATIVE: BLOCK SCOPE
// ========================================

{
  let privateVar = "I'm private";
  const alsoPrivate = "Me too";
  
  console.log(privateVar); // Accessible inside
}

// console.log(privateVar); // ReferenceError (not accessible outside)

// Block scope is simpler and more readable than IIFE
```

### Pattern 2: Module Pattern

```javascript
// ========================================
// REVEALING MODULE PATTERN
// ========================================

const calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private functions
  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }
  
  // Public API
  return {
    add(value) {
      result += value;
      log('add', value);
      return this;
    },
    subtract(value) {
      result -= value;
      log('subtract', value);
      return this;
    },
    getResult() {
      return result;
    },
    reset() {
      result = 0;
      return this;
    }
  };
})();

calculator.add(5).add(3).subtract(2);
console.log(calculator.getResult()); // 6
// console.log(calculator.result); // undefined (private)

// ========================================
// ES6 MODULE PATTERN
// ========================================

// file: calculator.js
let result = 0;

function log(operation, value) {
  console.log(`${operation}: ${value}`);
}

export function add(value) {
  result += value;
  log('add', value);
}

export function subtract(value) {
  result -= value;
  log('subtract', value);
}

export function getResult() {
  return result;
}

// file: main.js
// import { add, subtract, getResult } from './calculator.js';
```

### Pattern 3: Namespace Pattern

```javascript
// ========================================
// NAMESPACE PATTERN
// ========================================

// Global namespace
const MyApp = MyApp || {};

// Sub-namespaces
MyApp.utils = {
  formatDate(date) {
    return date.toISOString();
  },
  
  parseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }
};

MyApp.models = {
  User: class {
    constructor(name) {
      this.name = name;
    }
  }
};

MyApp.controllers = {
  UserController: {
    create(name) {
      return new MyApp.models.User(name);
    }
  }
};

// Usage
const user = MyApp.controllers.UserController.create("John");
const formatted = MyApp.utils.formatDate(new Date());
```

### Pattern 4: Singleton Pattern with Scope

```javascript
// ========================================
// SINGLETON PATTERN
// ========================================

const Singleton = (function() {
  let instance;
  
  function createInstance() {
    const object = {
      name: "I'm the singleton",
      getValue() {
        return this.name;
      }
    };
    return object;
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true (same instance)
```

### Pattern 5: Private Variables with WeakMap

```javascript
// ========================================
// PRIVATE VARIABLES USING WEAKMAP
// ========================================

const Person = (function() {
  const privateData = new WeakMap();
  
  class Person {
    constructor(name, age) {
      privateData.set(this, { name, age });
    }
    
    getName() {
      return privateData.get(this).name;
    }
    
    getAge() {
      return privateData.get(this).age;
    }
    
    setAge(age) {
      const data = privateData.get(this);
      data.age = age;
    }
  }
  
  return Person;
})();

const person = new Person("John", 30);
console.log(person.getName()); // "John"
console.log(person.getAge()); // 30
// console.log(person.name); // undefined (truly private)

// ========================================
// MODERN ALTERNATIVE: PRIVATE FIELDS (ES2022)
// ========================================

class ModernPerson {
  #name; // Private field
  #age;  // Private field
  
  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }
  
  getName() {
    return this.#name;
  }
  
  getAge() {
    return this.#age;
  }
  
  setAge(age) {
    this.#age = age;
  }
}

const modernPerson = new ModernPerson("Jane", 25);
console.log(modernPerson.getName()); // "Jane"
// console.log(modernPerson.#name); // SyntaxError (truly private)
```


---

## Memory & Performance

### Memory Implications of Scope

```javascript
// ========================================
// MEMORY LEAKS WITH CLOSURES
// ========================================

// Bad: Unnecessary closure retention
function createHeavyObject() {
  const heavyData = new Array(1000000).fill('data'); // Large array
  
  return {
    // This closure keeps heavyData in memory even if not used
    getData() {
      return heavyData;
    },
    // This method doesn't need heavyData but it's still retained
    doSomething() {
      console.log("Doing something");
    }
  };
}

// Good: Only capture what you need
function createOptimizedObject() {
  const heavyData = new Array(1000000).fill('data');
  const summary = heavyData.length; // Extract only what's needed
  
  return {
    getSummary() {
      return summary; // Only captures 'summary', not 'heavyData'
    },
    doSomething() {
      console.log("Doing something");
    }
  };
  // heavyData can be garbage collected after function returns
}

// ========================================
// CLOSURE MEMORY VISUALIZATION
// ========================================

function outer() {
  const large = new Array(1000000); // 1MB
  const small = 42;
  
  return function inner() {
    console.log(small); // Only uses 'small'
  };
}

const fn = outer();
// Problem: 'large' is still in memory because inner() closes over outer's scope
// Even though inner() doesn't use 'large'

// Solution: Use block scope to limit closure scope
function outerOptimized() {
  const large = new Array(1000000);
  // Process large array...
  
  {
    const small = 42;
    return function inner() {
      console.log(small); // Only closes over block scope
    };
  }
  // 'large' can be garbage collected
}
```

### Performance Optimization Techniques

```javascript
// ========================================
// TECHNIQUE 1: MINIMIZE SCOPE CHAIN DEPTH
// ========================================

// Slow: Deep scope chain
function slow() {
  const a = 1;
  return function() {
    return function() {
      return function() {
        return function() {
          return a; // Must traverse 5 scopes
        };
      };
    };
  };
}

// Fast: Shallow scope chain
function fast() {
  const a = 1;
  return function() {
    return a; // Only traverse 2 scopes
  };
}

// ========================================
// TECHNIQUE 2: CACHE OUTER VARIABLES
// ========================================

function withoutCaching() {
  const config = { timeout: 1000, retries: 3 };
  
  return function process() {
    // Accesses config.timeout multiple times
    // Each access traverses scope chain
    if (Date.now() < config.timeout) {
      for (let i = 0; i < config.retries; i++) {
        console.log(config.timeout);
      }
    }
  };
}

function withCaching() {
  const config = { timeout: 1000, retries: 3 };
  
  return function process() {
    // Cache frequently accessed values
    const timeout = config.timeout;
    const retries = config.retries;
    
    if (Date.now() < timeout) {
      for (let i = 0; i < retries; i++) {
        console.log(timeout);
      }
    }
  };
}

// ========================================
// TECHNIQUE 3: AVOID UNNECESSARY CLOSURES
// ========================================

// Bad: Creates new closure on every call
function createHandlers() {
  return {
    onClick: function() {
      this.handleClick();
    }.bind(this),
    onHover: function() {
      this.handleHover();
    }.bind(this)
  };
}

// Good: Reuse methods
function createHandlersOptimized() {
  const self = this;
  
  function onClick() {
    self.handleClick();
  }
  
  function onHover() {
    self.handleHover();
  }
  
  return { onClick, onHover };
}

// ========================================
// TECHNIQUE 4: USE CONST FOR IMMUTABLE BINDINGS
// ========================================

// Slower: Engine can't optimize as much
function withLet() {
  let x = 10;
  return function() {
    return x; // Engine must check if x was reassigned
  };
}

// Faster: Engine knows x never changes
function withConst() {
  const x = 10;
  return function() {
    return x; // Engine can optimize better
  };
}
```

### Garbage Collection and Scope

```javascript
// ========================================
// UNDERSTANDING GARBAGE COLLECTION
// ========================================

function demonstrateGC() {
  // Scenario 1: No closure - can be GC'd
  {
    const temp = new Array(1000000);
    console.log(temp.length);
  } // temp is eligible for GC here
  
  // Scenario 2: Closure keeps reference - can't be GC'd
  const closure = (function() {
    const persistent = new Array(1000000);
    return function() {
      return persistent.length;
    };
  })();
  // persistent stays in memory as long as closure exists
  
  // Scenario 3: Breaking closure reference
  let breakable = (function() {
    const data = new Array(1000000);
    return function() {
      return data.length;
    };
  })();
  
  breakable = null; // Now data can be GC'd
}

// ========================================
// MEMORY LEAK PATTERNS TO AVOID
// ========================================

// Pattern 1: Accidental global variables
function leakyFunction() {
  // Forgot 'var', 'let', or 'const'
  leakyVar = "I'm global!"; // Creates global variable
}

// Pattern 2: Forgotten timers
function leakyTimer() {
  const data = new Array(1000000);
  
  setInterval(function() {
    console.log(data.length); // Keeps data in memory forever
  }, 1000);
  
  // Should clear timer when done:
  // const timer = setInterval(...);
  // clearInterval(timer);
}

// Pattern 3: Forgotten event listeners
function leakyListener() {
  const data = new Array(1000000);
  
  document.addEventListener('click', function() {
    console.log(data.length); // Keeps data in memory
  });
  
  // Should remove listener when done:
  // const handler = function() { ... };
  // document.addEventListener('click', handler);
  // document.removeEventListener('click', handler);
}

// Pattern 4: Circular references (less common in modern JS)
function circularReference() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2;
  obj2.ref = obj1;
  
  // Modern JS engines handle this, but be aware
}
```

---

## Interview Questions

### Question 1: Explain Hoisting

**Question:** What is hoisting in JavaScript? How does it differ for var, let, const, and functions?

**Answer:**

Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

**var hoisting:**
- Declaration hoisted and initialized to `undefined`
- Can access before declaration (returns `undefined`)

**let/const hoisting:**
- Declaration hoisted but NOT initialized
- Temporal Dead Zone (TDZ) from scope start to declaration
- Accessing before declaration throws `ReferenceError`

**Function declaration hoisting:**
- Entire function hoisted (declaration + definition)
- Can call before declaration

**Function expression hoisting:**
- Treated like variable (var/let/const rules apply)
- Cannot call before declaration

```javascript
// var example
console.log(x); // undefined
var x = 5;

// let example
// console.log(y); // ReferenceError
let y = 5;

// function declaration
greet(); // "Hello!" - works
function greet() { console.log("Hello!"); }

// function expression
// sayHi(); // TypeError
var sayHi = function() { console.log("Hi!"); };
```

### Question 2: What is the Temporal Dead Zone?

**Question:** Explain the Temporal Dead Zone (TDZ) and why it exists.

**Answer:**

The TDZ is the period between entering a scope and the variable declaration being executed. During this time, the variable exists but cannot be accessed.

**Why it exists:**
1. **Catch errors early:** Prevents using variables before initialization
2. **Const semantics:** Ensures const variables are initialized before use
3. **Better debugging:** Clear error messages instead of silent `undefined`

```javascript
{
  // TDZ starts
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 10; // TDZ ends
  console.log(x); // 10
}
```

### Question 3: Scope Chain Lookup

**Question:** How does JavaScript resolve variable names using the scope chain?

**Answer:**

JavaScript uses lexical scoping with a scope chain:

1. **Check current scope:** Look for variable in current execution context
2. **Check parent scope:** If not found, check outer lexical environment
3. **Continue upward:** Repeat until variable found or global scope reached
4. **Not found:** If not in global scope, throw `ReferenceError`

```javascript
const global = "global";

function outer() {
  const outerVar = "outer";
  
  function inner() {
    const innerVar = "inner";
    
    console.log(innerVar);  // Found in step 1 (inner scope)
    console.log(outerVar);  // Found in step 2 (outer scope)
    console.log(global);    // Found in step 3 (global scope)
    // console.log(notExist); // Step 4: ReferenceError
  }
  
  inner();
}

outer();
```

### Question 4: var vs let vs const

**Question:** What are the differences between var, let, and const?

**Answer:**

| Feature | var | let | const |
|---------|-----|-----|-------|
| **Scope** | Function | Block | Block |
| **Hoisting** | Yes (initialized to undefined) | Yes (TDZ) | Yes (TDZ) |
| **Redeclaration** | Allowed | Not allowed | Not allowed |
| **Reassignment** | Allowed | Allowed | Not allowed |
| **TDZ** | No | Yes | Yes |
| **Global property** | Yes (in browser) | No | No |

```javascript
// Scope
function scopeTest() {
  if (true) {
    var varScoped = "function scoped";
    let letScoped = "block scoped";
    const constScoped = "block scoped";
  }
  console.log(varScoped); // ✓ Accessible
  // console.log(letScoped); // ✗ ReferenceError
  // console.log(constScoped); // ✗ ReferenceError
}

// Reassignment
var v = 1; v = 2; // ✓ OK
let l = 1; l = 2; // ✓ OK
const c = 1; // c = 2; // ✗ TypeError

// Redeclaration
var v = 1; var v = 2; // ✓ OK
let l = 1; // let l = 2; // ✗ SyntaxError
const c = 1; // const c = 2; // ✗ SyntaxError
```

### Question 5: Closures and Scope

**Question:** How do closures interact with scope? Explain with an example.

**Answer:**

A closure is a function that retains access to its outer scope even after the outer function has returned. This happens because of lexical scoping.

```javascript
function createCounter() {
  let count = 0; // Private variable in outer scope
  
  return {
    increment() {
      count++; // Accesses outer scope
      return count;
    },
    decrement() {
      count--; // Same outer scope
      return count;
    },
    getCount() {
      return count; // Same outer scope
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2

// 'count' is not accessible directly
// console.log(counter.count); // undefined

// But all methods share the same 'count' through closure
```

**Key points:**
- Inner functions close over outer scope
- Variables persist as long as closure exists
- Multiple closures can share same outer scope
- Enables data privacy and encapsulation

### Question 6: Common Hoisting Pitfall

**Question:** What's wrong with this code and how would you fix it?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Prints: 3, 3, 3 (expected: 0, 1, 2)
```

**Answer:**

**Problem:** `var` is function-scoped, so all callbacks share the same `i` variable. By the time callbacks execute, the loop has finished and `i` is 3.

**Solution 1: Use let (block scope)**
```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Each iteration has its own 'i'
  }, 1000);
}
// Prints: 0, 1, 2 ✓
```

**Solution 2: IIFE to capture value**
```javascript
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);
    }, 1000);
  })(i);
}
// Prints: 0, 1, 2 ✓
```

**Solution 3: Pass parameter to setTimeout**
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function(j) {
    console.log(j);
  }, 1000, i);
}
// Prints: 0, 1, 2 ✓
```

---

## Practice Problems

### Problem 1: Predict the Output

```javascript
var a = 1;

function outer() {
  console.log(a); // ?
  var a = 2;
  console.log(a); // ?
  
  function inner() {
    console.log(a); // ?
    var a = 3;
    console.log(a); // ?
  }
  
  inner();
  console.log(a); // ?
}

outer();
console.log(a); // ?
```

**Answer:**
```javascript
// Output:
undefined  // outer's 'a' is hoisted but not initialized
2          // outer's 'a' after assignment
undefined  // inner's 'a' is hoisted but not initialized
3          // inner's 'a' after assignment
2          // outer's 'a' (unchanged by inner)
1          // global 'a' (unchanged by outer)
```

### Problem 2: Fix the Memory Leak

```javascript
function createProcessor() {
  const largeData = new Array(1000000).fill('data');
  
  return {
    process() {
      // Process data
      return largeData.length;
    },
    getInfo() {
      return "Processor v1.0";
    }
  };
}

// Problem: largeData stays in memory even when only using getInfo()
```

**Solution:**
```javascript
function createProcessor() {
  const largeData = new Array(1000000).fill('data');
  const dataLength = largeData.length; // Extract what we need
  
  return {
    process() {
      return dataLength; // Use extracted value
    },
    getInfo() {
      return "Processor v1.0";
    }
  };
  // largeData can be garbage collected
}
```

### Problem 3: Implement Private Variables

```javascript
// Create a BankAccount class with private balance
// Requirements:
// - balance should not be directly accessible
// - provide deposit(amount) method
// - provide withdraw(amount) method
// - provide getBalance() method
// - prevent negative balance
```

**Solution 1: Using Closure**
```javascript
function createBankAccount(initialBalance = 0) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return true;
      }
      return false;
    },
    
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return true;
      }
      return false;
    },
    
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
account.withdraw(30);
console.log(account.getBalance()); // 120
// console.log(account.balance); // undefined (private)
```

**Solution 2: Using Private Fields (ES2022)**
```javascript
class BankAccount {
  #balance; // Private field
  
  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return true;
    }
    return false;
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
// console.log(account.#balance); // SyntaxError (truly private)
```

### Problem 4: Debug the Scope Issue

```javascript
const config = {
  timeout: 1000
};

function createTimer() {
  setTimeout(function() {
    console.log(this.timeout); // undefined - why?
  }, config.timeout);
}

createTimer();
```

**Problem:** `this` in the callback refers to the global object (or undefined in strict mode), not `config`.

**Solutions:**
```javascript
// Solution 1: Arrow function (lexical this)
function createTimer() {
  setTimeout(() => {
    console.log(config.timeout); // 1000 ✓
  }, config.timeout);
}

// Solution 2: Bind
function createTimer() {
  setTimeout(function() {
    console.log(this.timeout);
  }.bind(config), config.timeout);
}

// Solution 3: Capture in variable
function createTimer() {
  const self = config;
  setTimeout(function() {
    console.log(self.timeout);
  }, config.timeout);
}
```

### Problem 5: Optimize Scope Chain

```javascript
// Optimize this function for better performance
function processData(items) {
  const config = {
    multiplier: 2,
    offset: 10,
    formatter: (x) => x.toFixed(2)
  };
  
  return items.map(item => {
    return config.formatter(item * config.multiplier + config.offset);
  });
}
```

**Optimized Solution:**
```javascript
function processData(items) {
  const config = {
    multiplier: 2,
    offset: 10,
    formatter: (x) => x.toFixed(2)
  };
  
  // Cache frequently accessed values
  const multiplier = config.multiplier;
  const offset = config.offset;
  const formatter = config.formatter;
  
  return items.map(item => {
    return formatter(item * multiplier + offset);
  });
}

// Even better: Extract values before loop
function processDataOptimal(items) {
  const multiplier = 2;
  const offset = 10;
  
  return items.map(item => {
    return (item * multiplier + offset).toFixed(2);
  });
}
```

---

## Summary

### Key Takeaways

1. **Scope determines variable accessibility**
   - Global, module, function, and block scopes
   - Lexical (static) scoping based on code structure

2. **Hoisting moves declarations to top**
   - var: hoisted and initialized to undefined
   - let/const: hoisted but in TDZ
   - Functions: fully hoisted (declarations only)

3. **Temporal Dead Zone prevents premature access**
   - Exists for let/const from scope entry to declaration
   - Helps catch bugs early

4. **Scope chain enables nested scope access**
   - Inner scopes can access outer scopes
   - Lookup goes from inner to outer
   - Performance consideration for deep chains

5. **Block scope vs function scope**
   - let/const: block-scoped
   - var: function-scoped
   - Use let/const for better scoping

6. **Memory and performance considerations**
   - Closures retain outer scope
   - Can cause memory leaks if not careful
   - Optimize by caching and minimizing scope depth

### Best Practices

✅ **DO:**
- Use `const` by default
- Use `let` when reassignment needed
- Avoid `var` in modern code
- Keep scope chains shallow
- Cache frequently accessed outer variables
- Clean up event listeners and timers
- Use block scope for temporary variables

❌ **DON'T:**
- Use variables before declaration
- Create unnecessary closures
- Forget to clean up references
- Use `var` in loops with async callbacks
- Create deep scope chains
- Pollute global scope

---

[← Back to Variables & Data Types](./01-variables-data-types.md) | [Next: Closures →](./03-closures.md)
