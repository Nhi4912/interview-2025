# JavaScript Engine - V8 Internals

> Hiểu JS engine giúp viết code performant hơn. V8 là engine phổ biến nhất (Chrome, Node.js, Deno).

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    V8 ENGINE PIPELINE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   JavaScript Source Code                                         │
│          │                                                        │
│          ▼                                                        │
│   ┌─────────────────┐                                            │
│   │     PARSER      │  → AST (Abstract Syntax Tree)              │
│   └────────┬────────┘                                            │
│            │                                                      │
│            ▼                                                      │
│   ┌─────────────────┐                                            │
│   │    IGNITION     │  → Bytecode (Interpreter)                  │
│   │   (Interpreter) │     Fast startup, slower execution         │
│   └────────┬────────┘                                            │
│            │                                                      │
│            │ Hot code detected                                    │
│            ▼                                                      │
│   ┌─────────────────┐                                            │
│   │   TURBOFAN      │  → Machine Code (JIT Compiler)             │
│   │ (JIT Compiler)  │     Slower compile, faster execution       │
│   └────────┬────────┘                                            │
│            │                                                      │
│            │ Deoptimization (type changes)                       │
│            ▼                                                      │
│   Back to Ignition bytecode                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Parsing

### Tokenization & AST

```javascript
// Source code
function add(a, b) {
    return a + b;
}

// Tokens
[
    { type: 'Keyword', value: 'function' },
    { type: 'Identifier', value: 'add' },
    { type: 'Punctuator', value: '(' },
    { type: 'Identifier', value: 'a' },
    { type: 'Punctuator', value: ',' },
    { type: 'Identifier', value: 'b' },
    { type: 'Punctuator', value: ')' },
    // ...
]

// AST (simplified)
{
    type: 'FunctionDeclaration',
    id: { type: 'Identifier', name: 'add' },
    params: [
        { type: 'Identifier', name: 'a' },
        { type: 'Identifier', name: 'b' }
    ],
    body: {
        type: 'BlockStatement',
        body: [{
            type: 'ReturnStatement',
            argument: {
                type: 'BinaryExpression',
                operator: '+',
                left: { type: 'Identifier', name: 'a' },
                right: { type: 'Identifier', name: 'b' }
            }
        }]
    }
}
```

### Lazy Parsing

```javascript
// V8 uses lazy parsing - doesn't fully parse unused code

function heavyFunction() {
    // This entire body is "pre-parsed" (quick scan)
    // Only fully parsed when called
    // ...1000 lines of code...
}

// heavyFunction() // Would trigger full parse here

// Benefits:
// • Faster startup
// • Less memory for unused code

// Drawback:
// • First call is slower

// Tip: Avoid huge functions that are called once
// Break into smaller functions
```

---

## 🔥 JIT Compilation

### Interpreter vs Compiler

```
┌─────────────────────────────────────────────────────────────────┐
│              INTERPRETER vs COMPILER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   INTERPRETER (Ignition)                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Bytecode execution                                     │   │
│   │ • Fast startup                                           │   │
│   │ • Slower execution                                       │   │
│   │ • Lower memory                                           │   │
│   │                                                           │   │
│   │ Good for: Code run once, startup                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   JIT COMPILER (TurboFan)                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ • Machine code generation                                │   │
│   │ • Slow compilation                                       │   │
│   │ • Fast execution (10-100x faster)                        │   │
│   │ • Higher memory                                          │   │
│   │                                                           │   │
│   │ Good for: Hot loops, frequently called functions         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Hot Code Detection

```javascript
// V8 monitors function execution

function calculateSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// First few calls: Ignition (interpreter)
calculateSum([1, 2, 3]);
calculateSum([4, 5, 6]);

// After many calls (hot): TurboFan compiles to machine code
for (let i = 0; i < 10000; i++) {
    calculateSum([1, 2, 3]);
}

// Now calculateSum runs as optimized machine code
```

---

## 🎭 Hidden Classes (Maps)

### How V8 Optimizes Object Access

```javascript
// V8 creates "hidden classes" (internally called Maps)
// for object shape optimization

// Objects with same shape share hidden class
const obj1 = { x: 1, y: 2 };
const obj2 = { x: 3, y: 4 };
// obj1 and obj2 share same hidden class

// ✅ Good - consistent object shapes
function Point(x, y) {
    this.x = x;
    this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
// Same hidden class - fast property access
```

### Hidden Class Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                 HIDDEN CLASS TRANSITIONS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   const obj = {};              // Hidden Class C0 (empty)        │
│          │                                                        │
│   obj.x = 1;                   // Transition to C1               │
│          │                                                        │
│   obj.y = 2;                   // Transition to C2               │
│          │                                                        │
│          ▼                                                        │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐                 │
│   │   C0    │ ──▶  │   C1    │ ──▶  │   C2    │                 │
│   │  empty  │ add x│   x     │ add y│   x,y   │                 │
│   └─────────┘      └─────────┘      └─────────┘                 │
│                                                                   │
│   Problem: Different order = different hidden classes            │
│                                                                   │
│   const a = {}; a.x = 1; a.y = 2;  // C0 → C1 → C2              │
│   const b = {}; b.y = 1; b.x = 2;  // C0 → C3 → C4              │
│                                                                   │
│   a and b have DIFFERENT hidden classes!                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Writing Optimized Code

```javascript
// ❌ Bad - inconsistent shapes
function createUser(hasAge) {
    const user = { name: 'John' };
    if (hasAge) {
        user.age = 30; // Different shape based on condition
    }
    return user;
}

// ✅ Good - consistent shapes
function createUser(hasAge) {
    return {
        name: 'John',
        age: hasAge ? 30 : undefined // Always same shape
    };
}

// ❌ Bad - adding properties after creation
const obj = {};
obj.a = 1;
obj.b = 2;
obj.c = 3;

// ✅ Good - define all properties upfront
const obj = { a: 1, b: 2, c: 3 };

// ❌ Bad - deleting properties
delete obj.b; // Changes hidden class!

// ✅ Good - set to undefined
obj.b = undefined; // Keeps hidden class
```

---

## 💾 Inline Caching

### How Inline Caching Works

```javascript
// V8 caches property access locations

function getX(obj) {
    return obj.x;
}

// First call
getX({ x: 1, y: 2 }); // Lookup: where is 'x'?

// V8 caches: "for objects with hidden class C1, 'x' is at offset 0"

// Subsequent calls with same shape
getX({ x: 5, y: 6 }); // Uses cache - super fast!

// Types of IC states:
// • Monomorphic: One shape only (fastest)
// • Polymorphic: 2-4 shapes (still fast)
// • Megamorphic: Many shapes (slow, cache abandoned)
```

### IC State Examples

```javascript
// Monomorphic (best)
function process(point) {
    return point.x + point.y;
}

// All calls with same shape
process({ x: 1, y: 2 });
process({ x: 3, y: 4 });
process({ x: 5, y: 6 });

// Polymorphic (ok)
function getLength(item) {
    return item.length;
}

// Different but limited shapes
getLength([1, 2, 3]);     // Array
getLength('hello');        // String
getLength({ length: 5 });  // Object
// Cache stores 3 entries

// Megamorphic (slow)
function getValue(obj) {
    return obj.value;
}

// Too many different shapes
getValue({ value: 1, a: 1 });
getValue({ value: 2, b: 2 });
getValue({ value: 3, c: 3 });
getValue({ value: 4, d: 4 });
getValue({ value: 5, e: 5 });
// Cache abandoned - every access is slow lookup
```

---

## 🔄 Deoptimization

### Why Deoptimization Happens

```javascript
// TurboFan makes assumptions based on observed types
// If assumptions break, code is deoptimized back to Ignition

function add(a, b) {
    return a + b;
}

// Many calls with numbers - TurboFan optimizes for numbers
for (let i = 0; i < 10000; i++) {
    add(i, i + 1);
}

// Suddenly a string! Deoptimization triggered
add('hello', 'world');

// Now back to interpreter, may re-optimize later
```

### Common Deoptimization Causes

```javascript
// 1. Type changes
let x = 5;
x = 'string'; // Deopt!

// 2. Hidden class changes
const obj = { x: 1 };
delete obj.x; // Deopt!

// 3. Arguments object
function foo() {
    const args = arguments; // Prevents optimization
}

// 4. try-catch (historically, now better)
function riskyOperation() {
    try {
        // Was hard to optimize
    } catch (e) {}
}

// 5. eval/with
eval('x = 1'); // Completely prevents optimization
with (obj) {}  // Same
```

### Avoiding Deoptimization

```javascript
// 1. Consistent types
function process(value) {
    // Always expect number
    if (typeof value !== 'number') {
        throw new TypeError('Expected number');
    }
    return value * 2;
}

// 2. Initialize all properties
class Point {
    constructor(x, y) {
        this.x = x; // Always set
        this.y = y; // Always set
    }
}

// 3. Use TypeScript for type consistency

// 4. Avoid arguments, use rest parameters
function sum(...nums) { // Better than arguments
    return nums.reduce((a, b) => a + b, 0);
}

// 5. Don't modify function after definition
const fn = function() {};
fn.property = 'bad'; // Avoid
```

---

## 📊 Memory Management

### V8 Heap Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                       V8 HEAP                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    NEW SPACE (Young)                     │   │
│   │  ┌──────────────────┐  ┌──────────────────┐            │   │
│   │  │    From Space    │  │    To Space      │            │   │
│   │  │  (active)        │  │  (inactive)      │            │   │
│   │  └──────────────────┘  └──────────────────┘            │   │
│   │                                                           │   │
│   │  • New objects allocated here                            │   │
│   │  • Small (1-8 MB)                                        │   │
│   │  • Scavenge GC (fast, frequent)                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    OLD SPACE                             │   │
│   │                                                           │   │
│   │  • Objects that survived GC in New Space                 │   │
│   │  • Large (up to GB)                                      │   │
│   │  • Mark-Sweep-Compact GC (slower, less frequent)         │   │
│   │                                                           │   │
│   │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐     │   │
│   │  │ Old Pointer  │  │  Old Data    │  │   Large    │     │   │
│   │  │    Space     │  │    Space     │  │   Object   │     │   │
│   │  └──────────────┘  └──────────────┘  └────────────┘     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    CODE SPACE                            │   │
│   │  • Compiled code (JIT output)                            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Garbage Collection Strategies

```javascript
// Scavenge (New Space) - "Minor GC"
// • Very fast (1-2ms)
// • Copies live objects from From → To space
// • Swaps spaces
// • Objects surviving 2 scavenges promoted to Old Space

// Mark-Sweep-Compact (Old Space) - "Major GC"
// • Slower (50-100ms without incremental)
// • Mark: Find all reachable objects
// • Sweep: Free unmarked objects
// • Compact: Defragment memory

// Incremental Marking
// • Break marking into small chunks
// • Interleave with JS execution
// • Reduce pause time

// Concurrent Marking
// • Mark objects on separate thread
// • JS execution continues
// • Further reduce pause time
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: JIT compilation là gì?**

A: Just-In-Time compilation. V8 compiles JavaScript to machine code at runtime instead of ahead-of-time. Hot code is compiled by TurboFan for faster execution.

**Q: Interpreter vs Compiler trong V8?**

A: Ignition (interpreter): Fast startup, slower execution. TurboFan (JIT compiler): Slower compilation, faster execution. V8 uses both for optimal balance.

### 🟡 Mid-level

**Q: Hidden classes và tại sao quan trọng?**

A: V8 creates hidden classes (Maps) for objects with same shape. Enables fast property access through inline caching. Writing code with consistent object shapes helps V8 optimize.

**Q: Inline caching là gì?**

A: V8 caches property access information. After seeing object shape, caches memory offset for property. Subsequent access to same shape is O(1). Monomorphic (1 shape) is fastest.

### 🔴 Senior

**Q: Giải thích deoptimization**

A: TurboFan optimizes based on type assumptions. When assumption breaks (type change, shape change), code is deoptimized back to Ignition bytecode. Causes: changing types, deleting properties, using arguments, eval.

**Q: V8 GC strategies?**

A: Two spaces: New (young) and Old. Scavenge GC for new space (fast, frequent, copies survivors). Mark-Sweep-Compact for old space (slower, less frequent). Incremental and concurrent marking reduce pause times.

---

## 📚 Active Recall

1. [ ] V8 pipeline stages
2. [ ] Hidden class transition rules
3. [ ] Inline caching states
4. [ ] Deoptimization causes (5)
5. [ ] New vs Old space in heap

---

> **Tiếp theo:** [04-browser-storage.md](./04-browser-storage.md) - Browser Storage
