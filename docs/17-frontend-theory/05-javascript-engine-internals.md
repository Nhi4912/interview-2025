# JavaScript Engine Internals - Deep Dive
# Bên Trong JavaScript Engine - Tìm Hiểu Sâu

## Table of Contents / Mục Lục

### Part 1: JavaScript Engine Architecture
1. V8 Engine Overview
2. Execution Context
3. Call Stack
4. Memory Heap
5. Garbage Collection

### Part 2: Compilation and Optimization
6. JIT Compilation
7. Hidden Classes
8. Inline Caching
9. Optimization Techniques
10. Deoptimization

### Part 3: Event Loop and Async
11. Event Loop Mechanism
12. Task Queue vs Microtask Queue
13. Promises and Microtasks
14. Async/Await Internals

### Part 4: Memory Management
15. Memory Allocation
16. Reference Counting
17. Mark and Sweep
18. Memory Leaks Prevention

---

## Part 1: JavaScript Engine Architecture

### 1. V8 Engine Overview
### 1. Tổng Quan V8 Engine

**English:**

V8 is Google's open-source JavaScript engine used in Chrome and Node.js.

**V8 Architecture:**

```
Source Code
    ↓
Parser → AST (Abstract Syntax Tree)
    ↓
Ignition (Interpreter) → Bytecode
    ↓
TurboFan (Optimizing Compiler) → Machine Code
    ↓
Execution
```

**Components:**

```javascript
// 1. Parser
// Converts source code to AST
const code = `
  function add(a, b) {
    return a + b;
  }
`;

// AST representation:
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

// 2. Ignition (Interpreter)
// Converts AST to bytecode
// Fast startup, slower execution

// 3. TurboFan (Optimizing Compiler)
// Converts hot code to optimized machine code
// Slower startup, faster execution
```


**V8 Pipeline Theory:**

The V8 engine uses a multi-tier compilation strategy:

**Tier 1: Ignition (Interpreter)**
- Fast startup
- Generates bytecode from AST
- Executes bytecode directly
- Collects profiling information

**Tier 2: TurboFan (Optimizing Compiler)**
- Slower startup
- Generates optimized machine code
- Uses profiling data from Ignition
- Applies aggressive optimizations

**Why Two Tiers?**

The two-tier approach balances:
1. **Startup time**: Interpreter starts fast
2. **Peak performance**: Compiler optimizes hot code
3. **Memory usage**: Don't compile everything
4. **Adaptability**: Can deoptimize if assumptions break

**Vietnamese:**

V8 là JavaScript engine mã nguồn mở của Google dùng trong Chrome và Node.js.

**Kiến Trúc V8:**

V8 sử dụng chiến lược compilation nhiều tầng:

**Tầng 1: Ignition (Interpreter)**
- Khởi động nhanh
- Tạo bytecode từ AST
- Thực thi bytecode trực tiếp
- Thu thập profiling information

**Tầng 2: TurboFan (Optimizing Compiler)**
- Khởi động chậm hơn
- Tạo optimized machine code
- Dùng profiling data từ Ignition
- Áp dụng optimizations mạnh mẽ

---

### 2. Execution Context
### 2. Execution Context

**English:**

Execution Context is the environment in which JavaScript code is evaluated and executed.

**Types of Execution Contexts:**

1. **Global Execution Context**
   - Created when script first runs
   - Only one per program
   - Creates global object (window in browser, global in Node.js)
   - Sets `this` to global object

2. **Function Execution Context**
   - Created when function is invoked
   - One per function call
   - Has access to arguments object
   - Creates local scope

3. **Eval Execution Context**
   - Created by eval() function
   - Rarely used, avoid in production

**Execution Context Phases:**

**Phase 1: Creation Phase**

During creation, the engine:
1. Creates Variable Object (VO)
2. Creates Scope Chain
3. Determines `this` value

**Variable Object Creation:**
- Function arguments
- Function declarations (hoisted)
- Variable declarations (hoisted, undefined)

**Phase 2: Execution Phase**

During execution:
1. Assign values to variables
2. Execute code line by line
3. Function calls create new contexts

**Execution Context Stack (Call Stack):**

```
Global Execution Context (bottom)
    ↓
Function A Context
    ↓
Function B Context
    ↓
Function C Context (top)
```

**Stack Operations:**

1. **Push**: When function called, push new context
2. **Pop**: When function returns, pop context
3. **LIFO**: Last In, First Out

**Theory: Why Stack?**

The stack structure ensures:
- Proper function return
- Correct scope resolution
- Memory management (contexts destroyed when popped)
- Call trace for debugging

**Lexical Environment:**

Modern JavaScript uses Lexical Environment instead of Variable Object:

```
LexicalEnvironment = {
  EnvironmentRecord: {
    // Identifier bindings
  },
  outer: <reference to parent lexical environment>
}
```

**Environment Record Types:**

1. **Declarative Environment Record**
   - Function scope
   - Block scope (let, const)
   - Catch clause

2. **Object Environment Record**
   - Global scope
   - With statement (deprecated)

**Theory: Lexical Scoping**

Lexical scoping means:
- Scope determined by code structure
- Inner functions access outer variables
- Scope chain follows nesting structure
- Closures capture lexical environment

**This Binding:**

`this` value determined by:
1. **Global context**: global object
2. **Function context**: depends on how called
3. **Arrow functions**: lexical this (from enclosing scope)
4. **Method**: object that owns method
5. **Constructor**: newly created object
6. **Explicit binding**: call, apply, bind

**Theory: This Binding Rules**

Priority order (highest to lowest):
1. new binding
2. Explicit binding (call, apply, bind)
3. Implicit binding (method call)
4. Default binding (global or undefined in strict mode)

**Vietnamese:**

Execution Context là môi trường mà JavaScript code được evaluate và execute.

**Loại Execution Contexts:**

1. **Global**: Tạo khi script chạy lần đầu
2. **Function**: Tạo khi function được gọi
3. **Eval**: Tạo bởi eval() (tránh dùng)

**Phases:**

**Phase 1: Creation**
- Tạo Variable Object
- Tạo Scope Chain
- Xác định `this`

**Phase 2: Execution**
- Gán values cho variables
- Thực thi code
- Function calls tạo contexts mới

**Call Stack:**

Stack structure đảm bảo:
- Function return đúng
- Scope resolution đúng
- Memory management
- Call trace cho debugging

---

### 3. Call Stack
### 3. Call Stack

**English:**

The Call Stack is a data structure that tracks function execution in JavaScript.

**Call Stack Theory:**

The call stack is a LIFO (Last In, First Out) data structure that stores information about the active subroutines of a program.

**Stack Frame:**

Each function call creates a stack frame containing:
1. **Function arguments**: Parameters passed
2. **Local variables**: Variables declared in function
3. **Return address**: Where to return after execution
4. **Saved registers**: CPU register values

**Stack Operations:**

**Push (Function Call):**
```
function a() {
  b(); // Push b's frame
}

function b() {
  c(); // Push c's frame
}

function c() {
  // Do something
}

a(); // Push a's frame

Stack:
[Global]
[a]
[b]
[c] ← Top
```

**Pop (Function Return):**
```
When c() returns:
[Global]
[a]
[b] ← Top

When b() returns:
[Global]
[a] ← Top

When a() returns:
[Global] ← Top
```

**Stack Overflow:**

Stack overflow occurs when:
1. Too many function calls
2. Infinite recursion
3. Very deep recursion

**Example:**
```javascript
function recursiveFunction() {
  recursiveFunction(); // Infinite recursion
}

recursiveFunction(); // Stack overflow!
```

**Stack Size Limits:**

Different engines have different limits:
- Chrome/V8: ~10,000-15,000 frames
- Firefox: ~50,000 frames
- Safari: ~50,000 frames

**Theory: Why Stack Limits?**

Stack limits prevent:
- Memory exhaustion
- Program crashes
- Infinite loops from hanging browser

**Tail Call Optimization (TCO):**

TCO is an optimization where the engine reuses the current stack frame for tail calls.

**Tail Call:**
A function call is in tail position if it's the last operation before return.

```javascript
// Tail call
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // Tail call
}

// Not tail call
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Not tail call (multiplication after)
}
```

**TCO Benefits:**

1. **Constant stack space**: O(1) instead of O(n)
2. **No stack overflow**: Can recurse infinitely
3. **Better performance**: No frame allocation

**TCO Support:**

- ES6 spec requires TCO
- Most engines don't implement it
- Safari/WebKit has it
- Chrome/V8 removed it

**Theory: Why No TCO?**

Reasons engines don't implement TCO:
1. **Debugging**: Loses stack traces
2. **Complexity**: Hard to implement correctly
3. **Performance**: Not always faster
4. **Compatibility**: Breaking changes

**Call Stack and Async:**

Async operations don't block the call stack:

```
Synchronous:
[Global]
[fetchData] ← Blocks until complete
[processData]

Asynchronous:
[Global]
[fetchData] ← Returns immediately
// Later, when data arrives:
[callback]
```

**Theory: Event Loop Integration**

The call stack works with the event loop:
1. Execute synchronous code (call stack)
2. When stack empty, check task queue
3. Push task to stack
4. Repeat

**Stack Traces:**

Stack traces show the call stack at error time:

```
Error: Something went wrong
    at c (file.js:10)
    at b (file.js:6)
    at a (file.js:2)
    at <anonymous> (file.js:14)
```

**Reading Stack Traces:**

- Bottom: Where execution started
- Top: Where error occurred
- Each line: Function call in stack

**Vietnamese:**

Call Stack là cấu trúc dữ liệu theo dõi function execution trong JavaScript.

**Lý Thuyết Call Stack:**

Call stack là cấu trúc LIFO (Last In, First Out) lưu thông tin về active subroutines của program.

**Stack Frame:**

Mỗi function call tạo stack frame chứa:
1. Function arguments
2. Local variables
3. Return address
4. Saved registers

**Stack Overflow:**

Xảy ra khi:
1. Quá nhiều function calls
2. Infinite recursion
3. Recursion rất sâu

**Stack Size Limits:**

Các engines có limits khác nhau:
- Chrome/V8: ~10,000-15,000 frames
- Firefox: ~50,000 frames
- Safari: ~50,000 frames

**Tail Call Optimization:**

TCO là optimization engine reuse current stack frame cho tail calls.

**TCO Benefits:**
1. Constant stack space
2. Không stack overflow
3. Performance tốt hơn

**TCO Support:**

- ES6 spec yêu cầu TCO
- Hầu hết engines không implement
- Safari/WebKit có
- Chrome/V8 đã remove

---

### 4. Memory Heap
### 4. Memory Heap

**English:**

The Memory Heap is where JavaScript allocates memory for objects, functions, and closures.

**Heap vs Stack:**

**Stack:**
- Stores primitive values
- Stores references to objects
- Fixed size per frame
- Fast allocation/deallocation
- Automatic memory management
- LIFO structure

**Heap:**
- Stores objects, arrays, functions
- Dynamic size
- Slower allocation/deallocation
- Requires garbage collection
- Unstructured memory

**Theory: Why Two Memory Areas?**

Separation provides:
1. **Performance**: Stack operations are fast
2. **Flexibility**: Heap can grow dynamically
3. **Lifetime**: Stack for short-lived, heap for long-lived
4. **Sharing**: Heap objects can be shared via references

**Memory Allocation:**

**Primitive Values (Stack):**
```javascript
let x = 5;        // Stored on stack
let y = true;     // Stored on stack
let z = "hello";  // Reference on stack, data on heap (in V8)
```

**Objects (Heap):**
```javascript
let obj = { a: 1 }; // Object on heap, reference on stack
let arr = [1, 2];   // Array on heap, reference on stack
let fn = () => {};  // Function on heap, reference on stack
```

**Memory Layout:**

```
Stack:
┌─────────────┐
│ x: 5        │
│ y: true     │
│ z: ref→heap │
│ obj: ref→heap│
└─────────────┘

Heap:
┌─────────────────┐
│ "hello"         │
│ { a: 1 }        │
│ [1, 2]          │
│ function() {}   │
└─────────────────┘
```

**Object Representation in Heap:**

V8 represents objects using:
1. **Hidden Classes**: Shape of object
2. **Properties**: Named properties
3. **Elements**: Indexed properties (arrays)
4. **Prototype**: Link to prototype object

**Hidden Classes (Maps):**

V8 uses hidden classes to optimize property access:

```javascript
function Point(x, y) {
  this.x = x; // Hidden class C0 → C1
  this.y = y; // Hidden class C1 → C2
}

let p1 = new Point(1, 2); // Uses C2
let p2 = new Point(3, 4); // Uses C2 (same shape)
```

**Theory: Why Hidden Classes?**

Hidden classes enable:
1. **Fast property access**: Like C++ structs
2. **Inline caching**: Cache property locations
3. **Optimization**: JIT can generate better code
4. **Memory efficiency**: Share structure between objects

**Property Storage:**

V8 stores properties in two ways:

**In-object properties:**
- Stored directly in object
- Fast access
- Limited number (depends on object size)

**Out-of-object properties:**
- Stored in separate properties array
- Slower access
- Unlimited number

**Array Storage:**

V8 optimizes arrays based on element types:

**Fast Elements:**
- Packed SMI (Small Integer): [1, 2, 3]
- Packed Doubles: [1.1, 2.2, 3.3]
- Packed: [1, "a", {}]

**Slow Elements:**
- Holey (with holes): [1, , 3]
- Dictionary mode: Very sparse arrays

**Theory: Array Optimization**

V8 optimizes arrays by:
1. **Type specialization**: Homogeneous arrays are faster
2. **Packed vs Holey**: Packed arrays avoid hole checks
3. **Contiguous storage**: Better cache locality

**Memory Fragmentation:**

Fragmentation occurs when:
1. Objects allocated and freed
2. Leaves gaps in memory
3. Can't allocate large objects

**Types of Fragmentation:**

**External Fragmentation:**
- Free memory scattered
- Total free space sufficient
- But no contiguous block large enough

**Internal Fragmentation:**
- Allocated more than needed
- Wasted space within allocation

**Heap Generations:**

V8 uses generational garbage collection:

**Young Generation (New Space):**
- Newly allocated objects
- Small size (~1-8 MB)
- Fast collection (Scavenge)
- Most objects die young

**Old Generation (Old Space):**
- Long-lived objects
- Large size (~hundreds of MB)
- Slower collection (Mark-Sweep-Compact)
- Promoted from young generation

**Theory: Generational Hypothesis**

Most objects die young:
- 80-90% of objects become garbage quickly
- Focusing on young generation is efficient
- Old generation collected less frequently

**Memory Limits:**

V8 has memory limits:
- 32-bit: ~512 MB heap
- 64-bit: ~1.4 GB heap (default)
- Can increase with --max-old-space-size flag

**Theory: Why Limits?**

Limits prevent:
1. **Memory exhaustion**: Don't use all system memory
2. **GC pauses**: Larger heaps = longer pauses
3. **Performance**: Keep GC times reasonable

**Vietnamese:**

Memory Heap là nơi JavaScript cấp phát memory cho objects, functions, và closures.

**Heap vs Stack:**

**Stack:**
- Lưu primitive values
- Lưu references đến objects
- Fixed size per frame
- Fast allocation/deallocation
- Automatic management
- LIFO structure

**Heap:**
- Lưu objects, arrays, functions
- Dynamic size
- Slower allocation/deallocation
- Cần garbage collection
- Unstructured memory

**Lý Thuyết: Tại Sao Hai Memory Areas?**

Separation cung cấp:
1. **Performance**: Stack operations nhanh
2. **Flexibility**: Heap có thể grow dynamically
3. **Lifetime**: Stack cho short-lived, heap cho long-lived
4. **Sharing**: Heap objects có thể share qua references

**Hidden Classes:**

V8 dùng hidden classes để optimize property access:
- Fast property access
- Inline caching
- Optimization
- Memory efficiency

**Array Optimization:**

V8 optimize arrays dựa trên element types:
- Packed SMI: Nhanh nhất
- Packed Doubles: Nhanh
- Packed: Trung bình
- Holey: Chậm
- Dictionary: Chậm nhất

**Heap Generations:**

**Young Generation:**
- Objects mới
- Small size
- Fast collection
- Most objects die young

**Old Generation:**
- Long-lived objects
- Large size
- Slower collection
- Promoted từ young generation

---

### 5. Garbage Collection
### 5. Garbage Collection

**English:**

Garbage Collection (GC) is the automatic memory management process that reclaims memory occupied by objects that are no longer in use.

**GC Theory:**

The fundamental problem: Determine which objects are no longer needed and reclaim their memory.

**Reachability:**

An object is reachable if:
1. It's a root (global, stack, registers)
2. It's referenced by a reachable object

**Roots:**
- Global variables
- Local variables (stack)
- Active function closures
- DOM elements (in browser)

**GC Algorithms:**

**1. Reference Counting:**

**Theory:**
- Track number of references to each object
- When count reaches 0, reclaim memory

**Advantages:**
- Simple to implement
- Immediate reclamation
- No pause times

**Disadvantages:**
- Can't handle circular references
- Overhead of maintaining counts
- Not used in modern engines

**Circular Reference Problem:**
```javascript
let obj1 = {};
let obj2 = {};
obj1.ref = obj2; // obj1 → obj2
obj2.ref = obj1; // obj2 → obj1
// Both have ref count > 0, but unreachable!
```

**2. Mark and Sweep:**

**Theory:**
- Mark phase: Mark all reachable objects
- Sweep phase: Reclaim unmarked objects

**Algorithm:**
```
1. Start from roots
2. Mark root objects
3. Recursively mark referenced objects
4. Sweep: Reclaim unmarked objects
```

**Advantages:**
- Handles circular references
- Used in modern engines
- Accurate

**Disadvantages:**
- Stop-the-world pauses
- Fragmentation
- Slower than reference counting

**3. Mark-Sweep-Compact:**

**Theory:**
- Mark: Mark reachable objects
- Sweep: Identify garbage
- Compact: Move objects to eliminate fragmentation

**Compaction Benefits:**
- Eliminates fragmentation
- Improves cache locality
- Faster allocation

**Compaction Costs:**
- Slower GC
- Must update all references
- More complex

**V8 Garbage Collection:**

V8 uses multiple GC strategies:

**Scavenge (Young Generation):**
- Fast, frequent collections
- Copies live objects to new space
- Uses Cheney's algorithm
- Typical pause: 1-10ms

**Scavenge Algorithm:**
```
1. Divide new space into two semi-spaces: From and To
2. Allocate in From space
3. When From full:
   a. Copy live objects to To space
   b. Swap From and To
   c. Reclaim old From space
```

**Theory: Why Scavenge?**

Scavenge is efficient because:
- Most objects die young (only copy survivors)
- Fast copying (linear scan)
- No fragmentation (compacting by nature)

**Mark-Sweep-Compact (Old Generation):**
- Slower, infrequent collections
- Three phases: mark, sweep, compact
- Typical pause: 100-1000ms

**Incremental Marking:**

**Theory:**
- Break marking into small increments
- Interleave with JavaScript execution
- Reduce pause times

**Tri-color Marking:**

Objects colored:
- **White**: Not visited
- **Gray**: Visited, but references not scanned
- **Black**: Visited, references scanned

**Algorithm:**
```
1. Start: All objects white
2. Mark roots gray
3. While gray objects exist:
   a. Pick gray object
   b. Mark it black
   c. Mark its references gray
4. Sweep: Reclaim white objects
```

**Concurrent Marking:**

**Theory:**
- Run marking in parallel with JavaScript
- Use separate thread for GC
- Reduce main thread pauses

**Challenges:**
- Synchronization
- Write barriers (track mutations)
- Correctness (don't miss objects)

**Parallel Scavenging:**

**Theory:**
- Use multiple threads for scavenging
- Divide work among threads
- Faster collection

**Write Barriers:**

**Theory:**
- Track mutations during concurrent GC
- Ensure correctness
- Prevent missing objects

**Types:**
- **Snapshot-at-the-beginning**: Record initial state
- **Incremental update**: Record mutations

**GC Triggers:**

GC triggered when:
1. **Allocation failure**: Can't allocate new object
2. **Heap limit**: Reached memory limit
3. **Idle time**: Browser idle
4. **Explicit**: Manual GC (not recommended)

**GC Performance:**

**Metrics:**
- **Pause time**: How long GC stops execution
- **Throughput**: Percentage of time in GC
- **Memory usage**: Heap size

**Trade-offs:**
- **Pause time vs Throughput**: Shorter pauses = more GC overhead
- **Memory vs Speed**: More memory = less frequent GC
- **Simplicity vs Performance**: Complex algorithms = better performance

**Memory Leaks:**

Common causes:
1. **Global variables**: Never collected
2. **Forgotten timers**: setInterval not cleared
3. **Closures**: Capturing large objects
4. **Detached DOM**: DOM nodes removed but referenced
5. **Event listeners**: Not removed

**Preventing Memory Leaks:**

```javascript
// 1. Clear timers
const timer = setInterval(() => {}, 1000);
clearInterval(timer);

// 2. Remove event listeners
element.addEventListener('click', handler);
element.removeEventListener('click', handler);

// 3. Nullify references
let largeObject = { /* ... */ };
// When done:
largeObject = null;

// 4. Use WeakMap/WeakSet
const cache = new WeakMap();
cache.set(obj, data); // Won't prevent obj from being collected
```

**Vietnamese:**

Garbage Collection (GC) là quá trình automatic memory management reclaim memory của objects không còn dùng.

**Lý Thuyết GC:**

Vấn đề cơ bản: Xác định objects nào không còn cần và reclaim memory của chúng.

**Reachability:**

Object reachable nếu:
1. Là root (global, stack, registers)
2. Được referenced bởi reachable object

**GC Algorithms:**

**1. Reference Counting:**
- Track số references
- Count = 0 → reclaim
- Không handle circular references

**2. Mark and Sweep:**
- Mark reachable objects
- Sweep unmarked objects
- Handle circular references

**3. Mark-Sweep-Compact:**
- Mark reachable
- Sweep garbage
- Compact để eliminate fragmentation

**V8 GC:**

**Scavenge (Young Generation):**
- Fast, frequent
- Copy live objects
- Typical pause: 1-10ms

**Mark-Sweep-Compact (Old Generation):**
- Slower, infrequent
- Three phases
- Typical pause: 100-1000ms

**Incremental Marking:**
- Break marking thành increments
- Interleave với JavaScript
- Reduce pause times

**Concurrent Marking:**
- Run marking parallel với JavaScript
- Dùng separate thread
- Reduce main thread pauses

**Memory Leaks:**

Nguyên nhân phổ biến:
1. Global variables
2. Forgotten timers
3. Closures
4. Detached DOM
5. Event listeners

**Preventing Leaks:**
- Clear timers
- Remove event listeners
- Nullify references
- Use WeakMap/WeakSet

