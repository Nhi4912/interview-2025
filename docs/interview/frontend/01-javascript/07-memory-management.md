# Memory Management - Garbage Collection Deep Dive

> Hiểu memory management giúp viết code performant và tránh memory leaks. Crucial cho senior-level interviews.

---

## Mục Lục

- [Overview](#-overview)
- [Memory Lifecycle](#-memory-lifecycle)
- [Garbage Collection](#-garbage-collection)
- [Memory Leaks](#-memory-leaks)
- [Performance Optimization](#-performance-optimization)
- [Debugging Memory Issues](#-debugging-memory-issues)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

JavaScript tự động quản lý memory thông qua **Garbage Collection (GC)**. Tuy nhiên, developers vẫn cần hiểu để:
- Tránh memory leaks
- Optimize performance
- Debug memory issues

```
┌─────────────────────────────────────────────────────────────────┐
│                   MEMORY STRUCTURE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                        HEAP                              │   │
│   │   (Dynamic memory allocation - Objects, Arrays, etc.)    │   │
│   │                                                          │   │
│   │   ┌──────┐  ┌──────┐  ┌──────────┐  ┌──────┐           │   │
│   │   │Object│  │Array │  │ Function │  │String│  ...      │   │
│   │   └──────┘  └──────┘  └──────────┘  └──────┘           │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                        STACK                             │   │
│   │   (Static memory - Primitives, References)               │   │
│   │                                                          │   │
│   │   ┌────────────┐                                        │   │
│   │   │ let x = 5  │                                        │   │
│   │   ├────────────┤                                        │   │
│   │   │ let obj=ref│───────────────► [Object on Heap]       │   │
│   │   ├────────────┤                                        │   │
│   │   │ let y = 10 │                                        │   │
│   │   └────────────┘                                        │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Memory Lifecycle

### 3 Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│    │  ALLOCATE    │───►│     USE      │───►│   RELEASE    │     │
│    │              │    │              │    │              │     │
│    │ let x = {}   │    │ x.name = 'A' │    │ x = null     │     │
│    │ let arr = [] │    │ arr.push(1)  │    │ (GC cleans)  │     │
│    └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                   │
│    ◄── Automatic ──►   ◄── Manual ──►     ◄── Automatic ──►     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Allocation

```javascript
// Primitive allocation (Stack)
let number = 42;
let string = 'hello';
let boolean = true;

// Object allocation (Heap)
let object = { name: 'John' };
let array = [1, 2, 3];
let func = function() {};

// Hidden allocations
let str1 = 'Hello';
let str2 = str1 + ' World'; // New string allocated

let arr = [1, 2];
arr.push(3); // May reallocate for larger array
```

### Stack vs Heap

| Stack | Heap |
|-------|------|
| Primitives (number, string, boolean, etc.) | Objects, Arrays, Functions |
| Fixed size, fast access | Dynamic size, slower access |
| LIFO (Last In, First Out) | No order |
| Auto-managed by scope | Managed by GC |

```javascript
function example() {
    // Stack
    let num = 42;           // Primitive on stack
    let str = 'hello';      // Reference on stack

    // Heap
    let obj = { x: 1 };     // Object on heap, reference on stack
    let arr = [1, 2, 3];    // Array on heap, reference on stack

    // When function returns:
    // - Stack is cleared (num, str, references)
    // - Heap objects marked for GC if no references remain
}
```

---

## 🗑️ Garbage Collection

### Reachability

Concept chính: **Reachable objects** = objects có thể access từ root (global, current execution context).

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACHABILITY                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ROOT (Global, Stack)                                           │
│   ┌─────────┐                                                    │
│   │ window  │                                                    │
│   │ global  │                                                    │
│   │ current │                                                    │
│   │ scope   │                                                    │
│   └────┬────┘                                                    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐                   │
│   │ obj1 ✓  │────►│ obj2 ✓  │────►│ obj3 ✓  │  REACHABLE        │
│   └─────────┘     └─────────┘     └─────────┘                   │
│                                                                   │
│   ┌─────────┐     ┌─────────┐                                    │
│   │ obj4 ✗  │◄───►│ obj5 ✗  │  UNREACHABLE (will be GC'd)       │
│   └─────────┘     └─────────┘                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Mark and Sweep Algorithm

V8 và các modern JS engines sử dụng Mark and Sweep:

```
┌─────────────────────────────────────────────────────────────────┐
│                MARK AND SWEEP                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PHASE 1: MARK                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Start from roots, mark all reachable objects           │   │
│   │                                                          │   │
│   │  ROOT ──► [A ✓] ──► [B ✓] ──► [C ✓]                     │   │
│   │                          └──► [D ✓]                      │   │
│   │                                                          │   │
│   │           [E ✗]     [F ✗]     (unreachable)             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   PHASE 2: SWEEP                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  Collect all unmarked objects, free memory               │   │
│   │                                                          │   │
│   │  [A ✓] [B ✓] [C ✓] [D ✓]     [E 🗑] [F 🗑]              │   │
│   │                                                          │   │
│   │  Keep ─────────────────────  Free ──────                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### V8 Generational GC

```
┌─────────────────────────────────────────────────────────────────┐
│                V8 GENERATIONAL GC                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                    YOUNG GENERATION                        │ │
│   │   (New objects - frequently collected)                     │ │
│   │                                                            │ │
│   │   ┌─────────────────┐   ┌─────────────────┐               │ │
│   │   │   "From" Space  │   │   "To" Space    │               │ │
│   │   │   [new objects] │   │   [survivors]   │               │ │
│   │   └────────┬────────┘   └─────────────────┘               │ │
│   │            │                                               │ │
│   │            ▼ (Scavenge - Copy living objects)              │ │
│   │   Objects surviving multiple GC cycles                     │ │
│   └───────────────────────┬───────────────────────────────────┘ │
│                           │                                      │
│                           ▼ (Promotion)                          │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │                    OLD GENERATION                          │ │
│   │   (Long-lived objects - less frequently collected)         │ │
│   │                                                            │ │
│   │   [obj1] [obj2] [obj3] [obj4] [obj5] ...                  │ │
│   │                                                            │ │
│   │   Mark-Sweep-Compact (less frequent, more expensive)       │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Memory Leaks

### Common Causes

#### 1. Global Variables

```javascript
// ❌ Accidental global
function createData() {
    data = { large: new Array(1000000) }; // Missing 'let/const'!
}

// ❌ Intentional but forgotten globals
window.cache = {};
window.cache.data = fetchLargeData();
// Never cleaned up...

// ✅ Use local scope or cleanup
function createData() {
    const data = { large: new Array(1000000) };
    return data;
}
```

#### 2. Forgotten Timers & Callbacks

```javascript
// ❌ Timer keeps reference
function startComponent() {
    const data = { /* large data */ };

    setInterval(() => {
        console.log(data); // data never GC'd!
    }, 1000);
}

// ✅ Clear timer on cleanup
function startComponent() {
    const data = { /* large data */ };

    const timerId = setInterval(() => {
        console.log(data);
    }, 1000);

    return () => clearInterval(timerId); // Cleanup function
}
```

#### 3. Closures

```javascript
// ❌ Closure holds large data
function createHandler() {
    const largeData = new Array(1000000).fill('x');

    return function handler() {
        // Only uses first element, but entire array is retained!
        console.log(largeData[0]);
    };
}

const handler = createHandler(); // largeData stuck in memory

// ✅ Only capture what you need
function createHandler() {
    const largeData = new Array(1000000).fill('x');
    const firstElement = largeData[0]; // Extract needed value

    return function handler() {
        console.log(firstElement);
    };
}
```

#### 4. Detached DOM Nodes

```javascript
// ❌ DOM reference prevents GC
let detachedDiv;

function removeElement() {
    const div = document.getElementById('myDiv');
    detachedDiv = div; // Reference kept!
    div.remove(); // Removed from DOM but still in memory
}

// ✅ Clear references
function removeElement() {
    const div = document.getElementById('myDiv');
    div.remove();
    // Don't keep references to removed elements
}
```

#### 5. Event Listeners

```javascript
// ❌ Event listener not removed
class Component {
    constructor() {
        this.data = new Array(1000000);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        console.log(this.data.length);
    }
}

// Component destroyed but event listener keeps it alive!

// ✅ Remove listeners on cleanup
class Component {
    constructor() {
        this.data = new Array(1000000);
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize() {
        console.log(this.data.length);
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
    }
}
```

### Memory Leak Detection Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│               MEMORY LEAK INDICATORS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Memory Usage Over Time                                         │
│                                                                   │
│   │                                     ╭──── Memory Leak!       │
│   │                                 ╭───╯                        │
│   │                             ╭───╯                            │
│   │                         ╭───╯                                │
│   │     Normal GC       ╭───╯                                    │
│   │   ╭─╮ ╭─╮ ╭─╮   ╭───╯                                       │
│   │ ──╯ ╰─╯ ╰─╯ ╰───╯                                           │
│   │                                                               │
│   └──────────────────────────────────────────────► Time          │
│                                                                   │
│   Normal: Memory goes up and down with GC                        │
│   Leak: Memory keeps increasing, doesn't return to baseline      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Optimization

### 1. Object Pooling

```javascript
// ❌ Creating new objects frequently
function animate() {
    const point = { x: 0, y: 0 }; // New object every frame
    // ... use point
    requestAnimationFrame(animate);
}

// ✅ Reuse objects
const point = { x: 0, y: 0 };

function animate() {
    point.x = calculateX();
    point.y = calculateY();
    // ... use point
    requestAnimationFrame(animate);
}
```

### 2. WeakMap & WeakSet

```javascript
// ❌ Map keeps objects alive
const cache = new Map();

function cacheData(obj) {
    cache.set(obj, computeExpensiveData(obj));
    // obj can never be GC'd while in cache!
}

// ✅ WeakMap allows GC
const cache = new WeakMap();

function cacheData(obj) {
    cache.set(obj, computeExpensiveData(obj));
    // When obj is no longer referenced elsewhere, it can be GC'd
}
```

### 3. Avoid Creating Functions in Loops

```javascript
// ❌ New function every iteration
items.forEach(item => {
    element.addEventListener('click', function() { // New function!
        handleClick(item);
    });
});

// ✅ Use shared handler
function handleClick(event) {
    const item = event.target.dataset.item;
    // Handle click
}

items.forEach(item => {
    element.dataset.item = item;
    element.addEventListener('click', handleClick);
});
```

### 4. String Optimization

```javascript
// ❌ String concatenation in loops
let result = '';
for (let i = 0; i < 10000; i++) {
    result += 'item' + i + ','; // Creates new string each time
}

// ✅ Use array and join
const parts = [];
for (let i = 0; i < 10000; i++) {
    parts.push('item' + i);
}
const result = parts.join(',');
```

---

## 🔍 Debugging Memory Issues

### Chrome DevTools

```
┌─────────────────────────────────────────────────────────────────┐
│               CHROME DEVTOOLS MEMORY TAB                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1. HEAP SNAPSHOT                                               │
│      - Take snapshot at different points                         │
│      - Compare snapshots to find leaks                           │
│      - Look for: Detached DOM nodes, growing objects             │
│                                                                   │
│   2. ALLOCATION TIMELINE                                         │
│      - Record allocations over time                              │
│      - Identify memory allocation patterns                       │
│      - Find objects not being collected                          │
│                                                                   │
│   3. ALLOCATION SAMPLING                                         │
│      - Low-overhead profiling                                    │
│      - Find code creating most garbage                           │
│                                                                   │
│   WORKFLOW:                                                       │
│   ┌────────────┐   ┌────────────┐   ┌────────────┐              │
│   │ Take       │──►│ Perform    │──►│ Take       │──►Compare    │
│   │ Snapshot 1 │   │ Actions    │   │ Snapshot 2 │              │
│   └────────────┘   └────────────┘   └────────────┘              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Code Example: Finding Leaks

```javascript
// Test for memory leaks
async function testForLeaks() {
    const initialMemory = performance.memory?.usedJSHeapSize;

    // Perform action multiple times
    for (let i = 0; i < 100; i++) {
        createAndDestroyComponent();
        await new Promise(r => setTimeout(r, 10));
    }

    // Force GC (only in Node.js with --expose-gc)
    if (global.gc) global.gc();

    await new Promise(r => setTimeout(r, 100));

    const finalMemory = performance.memory?.usedJSHeapSize;

    console.log('Memory difference:', finalMemory - initialMemory);
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: JavaScript quản lý memory như thế nào?**

A: JavaScript sử dụng automatic garbage collection. Khi objects không còn reachable từ root (global scope, current execution context), GC sẽ tự động free memory.

**Q: Stack vs Heap?**

A:
- Stack: Chứa primitives và references, fixed size, auto-managed by scope
- Heap: Chứa objects, dynamic size, managed by GC

### 🟡 Mid-level

**Q: Liệt kê 4 nguyên nhân phổ biến gây memory leak**

A:
1. Accidental globals
2. Forgotten timers/callbacks (setInterval không clear)
3. Closures giữ reference đến large objects
4. Detached DOM nodes (reference đến removed elements)
5. Event listeners không remove

**Q: WeakMap khác Map như thế nào về mặt memory?**

A:
- Map: Keys được held strongly, không thể GC khi còn trong Map
- WeakMap: Keys được held weakly, có thể GC nếu không có reference khác
- WeakMap useful cho caching mà không gây memory leak

### 🔴 Senior

**Q: Giải thích V8's generational garbage collection**

A: V8 chia heap thành:
1. **Young Generation**: Objects mới tạo, GC thường xuyên bằng Scavenge algorithm
2. **Old Generation**: Objects survive nhiều GC cycles, GC ít hơn bằng Mark-Sweep-Compact

Rationale: Hầu hết objects "die young" (generational hypothesis), nên GC young generation thường xuyên hiệu quả hơn.

**Q: Làm sao debug memory leak trong production?**

A:
1. Monitor memory usage qua metrics
2. Use heap snapshots ở các thời điểm khác nhau
3. Compare snapshots để tìm growing objects
4. Look for: Detached DOM, growing arrays/maps, event listeners
5. Use WeakMap cho caches
6. Implement proper cleanup trong component lifecycle

---

## 📚 Active Recall

1. [ ] Vẽ diagram Memory Lifecycle
2. [ ] Giải thích Mark and Sweep algorithm
3. [ ] List 5 common memory leak causes
4. [ ] Khi nào dùng WeakMap vs Map?
5. [ ] Làm sao identify memory leak trong Chrome DevTools?

---

> **Tiếp theo:** [08-es6-plus-features.md](./08-es6-plus-features.md) - Modern JavaScript Features
