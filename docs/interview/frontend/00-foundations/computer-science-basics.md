# Computer Science Basics

> Nền tảng CS cơ bản cần thiết để hiểu sâu JavaScript và frontend development.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CS BASICS FOR FRONTEND                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                  NUMBER SYSTEMS                        │     │
│   │         Binary ←→ Decimal ←→ Hexadecimal              │     │
│   └───────────────────────────────────────────────────────┘     │
│                           ↓                                      │
│   ┌───────────────────────────────────────────────────────┐     │
│   │                  MEMORY MODEL                          │     │
│   │              Stack │ Heap │ Code │ Data               │     │
│   └───────────────────────────────────────────────────────┘     │
│                           ↓                                      │
│   ┌───────────────────────────────────────────────────────┐     │
│   │              PROCESSES & THREADS                       │     │
│   │         Main Thread │ Event Loop │ Web Workers        │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 What - Number Systems

### Binary (Base 2)

```
BINARY REPRESENTATION:
───────────────────────

Decimal 13 in Binary:
13 = 8 + 4 + 1 = 2³ + 2² + 2⁰

Position:  7   6   5   4   3   2   1   0
Value:    128  64  32  16   8   4   2   1
Binary:    0   0   0   0   1   1   0   1  = 13

JAVASCRIPT:
──────────────
// Decimal to Binary
(13).toString(2)      // "1101"

// Binary to Decimal
parseInt('1101', 2)   // 13

// Binary literal (ES6)
const binary = 0b1101 // 13
```

### Hexadecimal (Base 16)

```
HEX DIGITS:
0 1 2 3 4 5 6 7 8 9 A  B  C  D  E  F
0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15

COMMON IN FRONTEND:
───────────────────
• Colors: #FF5733 (RGB)
• Unicode: \u0041 (A)
• Memory addresses

JAVASCRIPT:
──────────────
// Decimal to Hex
(255).toString(16)    // "ff"

// Hex to Decimal
parseInt('ff', 16)    // 255

// Hex literal
const hex = 0xff      // 255
```

### Bitwise Operations

```javascript
// AND (&) - Both bits must be 1
5 & 3  // 0101 & 0011 = 0001 = 1

// OR (|) - Either bit is 1
5 | 3  // 0101 | 0011 = 0111 = 7

// XOR (^) - Different bits
5 ^ 3  // 0101 ^ 0011 = 0110 = 6

// NOT (~) - Flip all bits
~5     // ~00000101 = 11111010 = -6 (two's complement)

// Left shift (<<) - Multiply by 2^n
5 << 1 // 0101 << 1 = 1010 = 10

// Right shift (>>) - Divide by 2^n
5 >> 1 // 0101 >> 1 = 0010 = 2

// USE CASES IN FRONTEND:
// Flags/permissions
const READ = 1;    // 001
const WRITE = 2;   // 010
const EXECUTE = 4; // 100

const permissions = READ | WRITE; // 011 = 3
const canRead = permissions & READ; // truthy if has READ
```

---

## 🧠 What - Memory Model

### Stack vs Heap

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LAYOUT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HIGH ADDRESSES                                                │
│   ┌─────────────────────────────────────────────────────┐       │
│   │                    STACK                             │       │
│   │  • Function call frames                             │       │
│   │  • Local variables (primitives)                     │       │
│   │  • Fixed size, fast access                          │       │
│   │  • LIFO (Last In, First Out)                        │       │
│   │                      ↓ grows down                   │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │                                                       │       │
│   │               (free space)                           │       │
│   │                                                       │       │
│   ├─────────────────────────────────────────────────────┤       │
│   │                      ↑ grows up                     │       │
│   │                    HEAP                              │       │
│   │  • Objects, arrays                                  │       │
│   │  • Dynamic allocation                               │       │
│   │  • Garbage collected                                │       │
│   │  • Variable size, slower access                     │       │
│   └─────────────────────────────────────────────────────┘       │
│   LOW ADDRESSES                                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### JavaScript Memory

```javascript
// PRIMITIVES - stored in Stack (by value)
let a = 10;      // Stack: a → 10
let b = a;       // Stack: b → 10 (copy of value)
b = 20;          // a still 10, b is 20

// OBJECTS - reference in Stack, data in Heap
let obj1 = { x: 1 };  // Stack: obj1 → [ref] → Heap: {x: 1}
let obj2 = obj1;      // Stack: obj2 → [same ref] → same Heap object
obj2.x = 2;           // obj1.x is also 2 (same object)

// MEMORY DIAGRAM:
/*
STACK:              HEAP:
┌───────┐           ┌────────────┐
│ a: 10 │           │            │
│ b: 20 │           │ { x: 2 }   │ ←─┐
│ obj1: ●──────────→│            │   │
│ obj2: ●────────────────────────────┘
└───────┘           └────────────┘
*/
```

### Garbage Collection

```
JAVASCRIPT GC (Mark and Sweep):
───────────────────────────────

1. MARK PHASE:
   • Start from "roots" (global objects, stack variables)
   • Mark all reachable objects

2. SWEEP PHASE:
   • Free memory of unmarked objects

┌─────────────────────────────────────────┐
│  ROOTS           HEAP                    │
│    │                                     │
│    ▼                                     │
│   [A] ──→ [B] ──→ [C]    [D] (unreachable)
│    │              ↑                      │
│    └──────────────┘                      │
│                                          │
│  A, B, C: marked (kept)                  │
│  D: unmarked (garbage collected)         │
└─────────────────────────────────────────┘

COMMON MEMORY LEAKS:
• Forgotten event listeners
• Closures holding references
• Detached DOM nodes
• Global variables
```

---

## 🔧 What - Processes & Threads

### Process vs Thread

```
PROCESS:
─────────
• Independent execution unit
• Own memory space
• Isolated from other processes
• Browser tabs are separate processes

THREAD:
───────
• Lightweight execution unit
• Share memory within process
• Can communicate easily
• JavaScript is single-threaded (main thread)

┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   BROWSER PROCESS                                               │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  UI Thread │ Network Thread │ Storage Thread          │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                   │
│   RENDERER PROCESS (per tab)                                    │
│   ┌───────────────────────────────────────────────────────┐     │
│   │  Main Thread (JS) │ Compositor │ Rasterizer │ Workers │     │
│   └───────────────────────────────────────────────────────┘     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### JavaScript Event Loop

```
EVENT LOOP ARCHITECTURE:
────────────────────────

┌──────────────────────────────────────────────────────────┐
│                     CALL STACK                            │
│  ┌─────────────────────────────────────────────────┐     │
│  │ function3()                                      │     │
│  │ function2()                                      │     │
│  │ function1()                                      │     │
│  │ main()                                           │     │
│  └─────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
           │
           │ empty?
           ▼
┌──────────────────────────────────────────────────────────┐
│                   MICROTASK QUEUE                         │
│  Promise callbacks, queueMicrotask(), MutationObserver   │
│  [callback1] [callback2] [callback3] →                   │
└──────────────────────────────────────────────────────────┘
           │
           │ empty?
           ▼
┌──────────────────────────────────────────────────────────┐
│                   MACROTASK QUEUE                         │
│  setTimeout, setInterval, I/O, UI rendering              │
│  [callback1] [callback2] →                               │
└──────────────────────────────────────────────────────────┘

PRIORITY: Call Stack > Microtasks > Render > Macrotasks
```

### Web Workers

```javascript
// MAIN THREAD: main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: complexData });

worker.onmessage = (event) => {
  console.log('Result:', event.data);
};

// WORKER THREAD: worker.js
self.onmessage = (event) => {
  const result = heavyComputation(event.data);
  self.postMessage(result);
};

/*
USE CASES:
• Heavy computations
• Image processing
• Data parsing
• Encryption/compression

LIMITATIONS:
• No DOM access
• No window object
• Communication via postMessage only
*/
```

---

## 🤔 Why - Tại Sao Quan Trọng

### Interview Relevance

```
TECHNICAL DISCUSSIONS:
──────────────────────
Q: "Explain how closures work in memory"
A: [Requires understanding Stack/Heap, references]

Q: "Why does this code cause a memory leak?"
A: [Requires understanding GC, references]

Q: "How would you optimize this heavy computation?"
A: [Requires understanding threads, Web Workers]

CODING PROBLEMS:
────────────────
• Bitwise operations for flags
• Understanding value vs reference
• Async/await and event loop
```

### Frontend Applications

```
NUMBER SYSTEMS:
• Colors (#RRGGBB)
• TypedArrays for binary data
• WebGL/Canvas operations
• Unicode handling

MEMORY:
• Prevent memory leaks
• Understand closures
• Optimize large data structures
• Debug with DevTools Memory panel

THREADS:
• Understand why UI freezes
• Use Web Workers effectively
• Optimize animations (60fps)
• Handle async operations
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior Level

1. **Q: Primitive vs Reference types trong JavaScript?**

   A: Primitives (number, string, boolean, null, undefined, symbol, bigint) được lưu trực tiếp trên Stack theo giá trị. Reference types (objects, arrays, functions) lưu reference trên Stack, data thực tế trên Heap.

2. **Q: Tại sao JavaScript là single-threaded?**

   A: Đơn giản hóa programming model, tránh race conditions. UI updates và JS chạy trên cùng thread để tránh conflicts. Async operations được handle qua Event Loop.

### 🟡 Mid-Level

3. **Q: Giải thích Event Loop và tại sao microtasks chạy trước macrotasks?**

   A: Event Loop kiểm tra Call Stack, nếu empty thì process Microtask Queue hết, sau đó mới lấy 1 task từ Macrotask Queue. Microtasks (Promises) có priority cao hơn vì thường là continuation của async operations.

4. **Q: Khi nào nên dùng Web Workers?**

   A: Khi có heavy computations block Main Thread (>50ms), như image processing, complex algorithms, large data parsing. Không dùng cho DOM manipulation hay simple async operations.

### 🔴 Senior Level

5. **Q: Giải thích một bug memory leak bạn đã debug?**

   A: [Share real experience] Ví dụ: Event listeners không được cleanup trong React useEffect, closures giữ reference đến large objects, detached DOM nodes vẫn có references.

---

## 📚 Active Recall Questions

1. [ ] Giải thích số 42 được lưu trong bộ nhớ như thế nào?
2. [ ] Vẽ diagram Stack và Heap khi chạy đoạn code có object và primitive?
3. [ ] Event Loop xử lý Promise và setTimeout theo thứ tự nào?
4. [ ] Khi nào Garbage Collector chạy và clean up object nào?

---

> **Tiếp theo:** [Data Structures](./data-structures.md) | **Quay lại:** [Foundations](./README.md)
