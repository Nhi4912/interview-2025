# Memory Management Theory
## Understanding Computer Memory Systems

**English:** Memory management is the process of controlling and coordinating computer memory, assigning portions called blocks to various running programs to optimize overall system performance.

**Tiếng Việt:** Quản lý bộ nhớ là quá trình kiểm soát và điều phối bộ nhớ máy tính, phân bổ các phần được gọi là khối cho các chương trình đang chạy để tối ưu hóa hiệu suất tổng thể của hệ thống.

## Table of Contents
1. [Memory Hierarchy](#memory-hierarchy)
2. [Memory Allocation](#memory-allocation)
3. [Garbage Collection](#garbage-collection)
4. [Virtual Memory](#virtual-memory)
5. [Cache Memory](#cache-memory)
6. [Memory in JavaScript](#memory-in-javascript)
7. [Memory Leaks](#memory-leaks)
8. [Memory Optimization](#memory-optimization)

## Memory Hierarchy

### The Memory Pyramid

```
        CPU Registers (fastest, smallest)
              |
        L1 Cache (~32 KB)
              |
        L2 Cache (~256 KB)
              |
        L3 Cache (~8 MB)
              |
        RAM (~8-32 GB)
              |
        SSD/HDD (~256 GB - 2 TB)
              |
        Network Storage (slowest, largest)
```

### Access Times

**Typical Latencies:**
```
CPU Register:     0.3 ns
L1 Cache:         0.9 ns
L2 Cache:         2.8 ns
L3 Cache:         12.9 ns
RAM:              120 ns
SSD:              50-150 μs
HDD:              1-10 ms
Network:          150 ms (cross-continent)
```

**Analogy:**
```
If CPU register access = 1 second:
- L1 Cache = 3 seconds
- L2 Cache = 9 seconds
- L3 Cache = 43 seconds
- RAM = 6.5 minutes
- SSD = 2 days
- HDD = 1-12 months
- Network = 5 years
```

### Memory Characteristics

**Registers:**
- Fastest memory
- Inside CPU
- Very limited (typically 16-32 registers)
- Directly accessed by CPU instructions

**Cache Memory:**
- SRAM (Static RAM)
- Multiple levels (L1, L2, L3)
- Stores frequently accessed data
- Managed by hardware

**Main Memory (RAM):**
- DRAM (Dynamic RAM)
- Volatile (loses data when power off)
- Directly addressable by CPU
- Larger but slower than cache

**Secondary Storage:**
- Non-volatile
- Much larger capacity
- Much slower access
- HDD, SSD, etc.

## Memory Allocation

### Stack vs Heap

**Stack Memory:**

**Characteristics:**
- LIFO (Last In, First Out)
- Automatic allocation/deallocation
- Fixed size per thread
- Fast access
- Stores local variables, function calls

**Example:**
```javascript
function calculate() {
    let x = 10;        // Allocated on stack
    let y = 20;        // Allocated on stack
    let sum = x + y;   // Allocated on stack
    return sum;
}  // All variables automatically deallocated
```

**Stack Frame:**
```
High Address
+------------------+
| Return Address   |
+------------------+
| Previous Frame   |
+------------------+
| Local Variables  |
+------------------+
| Parameters       |
+------------------+
Low Address
```

**Heap Memory:**

**Characteristics:**
- Dynamic allocation
- Manual or automatic deallocation
- Larger size
- Slower access
- Stores objects, dynamic data

**Example:**
```javascript
function createUser() {
    // Object allocated on heap
    let user = {
        name: "John",
        age: 30,
        address: {
            city: "New York"
        }
    };
    return user;
}  // user reference on stack, object on heap
```

### Memory Allocation Strategies

**First Fit:**
```
Memory: [Free 100KB] [Used] [Free 50KB] [Used] [Free 200KB]
Request: 80KB

Result: Allocate in first free block (100KB)
```

**Best Fit:**
```
Memory: [Free 100KB] [Used] [Free 50KB] [Used] [Free 200KB]
Request: 80KB

Result: Allocate in 100KB block (smallest that fits)
```

**Worst Fit:**
```
Memory: [Free 100KB] [Used] [Free 50KB] [Used] [Free 200KB]
Request: 80KB

Result: Allocate in 200KB block (largest available)
```

**Next Fit:**
```
Memory: [Free 100KB] [Used] [Free 50KB] [Used] [Free 200KB]
Last allocation: at 100KB block

Request: 80KB
Result: Start search from last allocation point
```

### Fragmentation

**External Fragmentation:**
```
Initial:
[Free 100KB] [Free 100KB] [Free 100KB]

After allocations:
[Used 50KB] [Free 50KB] [Used 50KB] [Free 50KB] [Used 50KB] [Free 50KB]

Problem: Total free = 150KB, but largest contiguous = 50KB
Cannot allocate 100KB even though space exists
```

**Internal Fragmentation:**
```
Request: 50KB
Allocation unit: 64KB

Result: [Used 50KB | Wasted 14KB]

Problem: 14KB wasted inside allocated block
```

**Solutions:**

**Compaction:**
```
Before:
[Used] [Free] [Used] [Free] [Used] [Free]

After:
[Used] [Used] [Used] [Free Free Free]
```

**Paging:**
```
Divide memory into fixed-size pages
No external fragmentation
Only internal fragmentation in last page
```

## Garbage Collection

### Reference Counting

**Concept:** Track number of references to each object

**Example:**
```javascript
let obj1 = { data: "A" };  // ref count = 1
let obj2 = obj1;           // ref count = 2
obj1 = null;               // ref count = 1
obj2 = null;               // ref count = 0 → collect
```

**Problem: Circular References:**
```javascript
let obj1 = {};
let obj2 = {};
obj1.ref = obj2;  // obj2 ref count = 1
obj2.ref = obj1;  // obj1 ref count = 1

obj1 = null;      // obj1 ref count still = 1 (from obj2)
obj2 = null;      // obj2 ref count still = 1 (from obj1)
// Memory leak! Objects not collected
```

### Mark and Sweep

**Algorithm:**

**Mark Phase:**
```
1. Start from root objects (global variables, stack)
2. Mark all reachable objects
3. Recursively mark objects referenced by marked objects
```

**Sweep Phase:**
```
1. Scan all objects in heap
2. Collect unmarked objects
3. Reset marks for next cycle
```

**Example:**
```javascript
// Root objects
let root1 = { data: "A" };
let root2 = { data: "B" };

// Reachable from root
root1.child = { data: "C" };
root1.child.child = { data: "D" };

// Unreachable (will be collected)
let orphan = { data: "E" };
orphan = null;

// Mark phase: A, B, C, D marked
// Sweep phase: E collected
```

**Visual:**
```
Before GC:
Root → [A] → [C] → [D]
Root → [B]
       [E] (orphan)

After Mark:
Root → [A✓] → [C✓] → [D✓]
Root → [B✓]
       [E]

After Sweep:
Root → [A] → [C] → [D]
Root → [B]
(E collected)
```

### Generational Garbage Collection

**Theory:** Most objects die young

**Generations:**
```
Young Generation (Eden + Survivor spaces)
    ↓ (survived multiple collections)
Old Generation (Tenured)
    ↓ (rarely collected)
Permanent Generation (Metadata)
```

**Example:**
```javascript
// Young generation (frequent GC)
function processRequest() {
    let temp = { data: "temporary" };  // Dies quickly
    return temp.data;
}

// Old generation (infrequent GC)
const config = {  // Lives long
    apiUrl: "https://api.example.com",
    timeout: 5000
};
```

**Collection Strategy:**
```
Minor GC (Young Generation):
- Runs frequently
- Fast (small space)
- Collects short-lived objects

Major GC (Old Generation):
- Runs infrequently
- Slower (large space)
- Collects long-lived objects
```

### Tri-Color Marking

**Colors:**
- **White:** Not visited (will be collected)
- **Gray:** Visited but children not scanned
- **Black:** Visited and children scanned

**Algorithm:**
```
1. Initially: all objects white, roots gray
2. While gray objects exist:
   - Pick gray object
   - Mark it black
   - Mark its children gray
3. Collect all white objects
```

**Example:**
```
Initial:
Root(Gray) → A(White) → C(White)
          → B(White)

Step 1: Process Root
Root(Black) → A(Gray) → C(White)
           → B(Gray)

Step 2: Process A
Root(Black) → A(Black) → C(Gray)
           → B(Gray)

Step 3: Process B and C
Root(Black) → A(Black) → C(Black)
           → B(Black)

All reachable objects are black
```

### Incremental and Concurrent GC

**Stop-the-World GC:**
```
Application Running
    ↓
[PAUSE] GC Running
    ↓
Application Running
```

**Incremental GC:**
```
Application Running
    ↓
[PAUSE] GC Phase 1
    ↓
Application Running
    ↓
[PAUSE] GC Phase 2
    ↓
Application Running
```

**Concurrent GC:**
```
Application Running ←→ GC Running (parallel)
```

**Trade-offs:**
- **Stop-the-World:** Simple, but causes pauses
- **Incremental:** Shorter pauses, more complex
- **Concurrent:** No pauses, most complex, overhead

## Virtual Memory

### Paging

**Concept:** Divide memory into fixed-size pages

**Page Table:**
```
Virtual Address → Physical Address

Virtual Page | Physical Frame
-------------|---------------
    0        |      5
    1        |      2
    2        |      7
    3        |      1
```

**Address Translation:**
```
Virtual Address: [Page Number | Offset]
                      ↓
                 Page Table
                      ↓
Physical Address: [Frame Number | Offset]
```

**Example:**
```
Virtual Address: 0x1234
Page Size: 4KB (0x1000)

Page Number: 0x1234 / 0x1000 = 0x1
Offset: 0x1234 % 0x1000 = 0x234

Page Table: Page 1 → Frame 5

Physical Address: (5 × 0x1000) + 0x234 = 0x5234
```

### Page Replacement Algorithms

**FIFO (First In, First Out):**
```
Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frames: 3

Time: 1  2  3  4  1  2  5  1  2  3  4  5
      1  1  1  4  4  4  4  4  4  3  3  3
         2  2  2  2  2  5  5  5  5  4  4
            3  3  3  3  3  3  3  3  3  5
      F  F  F  F  -  -  F  -  -  F  F  F

Page Faults: 9
```

**LRU (Least Recently Used):**
```
Reference String: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
Frames: 3

Time: 1  2  3  4  1  2  5  1  2  3  4  5
      1  1  1  4  4  4  5  5  5  5  4  4
         2  2  2  1  1  1  1  1  3  3  3
            3  3  3  2  2  2  2  2  2  5
      F  F  F  F  -  -  F  -  -  F  F  F

Page Faults: 8
```

**Optimal (Theoretical):**
```
Replace page that won't be used for longest time
Impossible to implement (requires future knowledge)
Used as benchmark
```

### Translation Lookaside Buffer (TLB)

**Purpose:** Cache for page table entries

**Without TLB:**
```
Memory Access:
1. Access page table in memory (1 memory access)
2. Access actual data in memory (1 memory access)
Total: 2 memory accesses
```

**With TLB:**
```
TLB Hit:
1. Check TLB (fast)
2. Access actual data in memory (1 memory access)
Total: 1 memory access

TLB Miss:
1. Check TLB (fast)
2. Access page table in memory (1 memory access)
3. Update TLB
4. Access actual data in memory (1 memory access)
Total: 2 memory accesses
```

**Effective Access Time:**
```
EAT = (TLB Hit Rate × TLB Hit Time) + 
      (TLB Miss Rate × TLB Miss Time)

Example:
TLB Hit Rate: 98%
TLB Access Time: 1 ns
Memory Access Time: 100 ns

EAT = (0.98 × 1) + (0.02 × 201)
    = 0.98 + 4.02
    = 5 ns

Without TLB: 200 ns
Speedup: 40x
```

## Cache Memory

### Cache Organization

**Direct Mapped Cache:**
```
Memory Address: [Tag | Index | Offset]

Cache Line = Memory Address % Number of Cache Lines

Example:
Memory: 0x1234
Cache Lines: 8
Cache Line: 0x1234 % 8 = 4
```

**Fully Associative Cache:**
```
Any memory block can go in any cache line
Requires searching all cache lines
Most flexible, most expensive
```

**Set Associative Cache:**
```
Compromise between direct mapped and fully associative
N-way set associative: N blocks per set

Example: 2-way set associative
Set = Memory Address % Number of Sets
Block can go in any of 2 lines in the set
```

### Cache Replacement Policies

**LRU (Least Recently Used):**
```
Cache: [A, B, C, D]
Access: E

Replace least recently used (assume A)
Cache: [E, B, C, D]
```

**LFU (Least Frequently Used):**
```
Cache: [A(5), B(3), C(8), D(2)]
Access: E

Replace least frequently used (D)
Cache: [A(5), B(3), C(8), E(1)]
```

**Random:**
```
Cache: [A, B, C, D]
Access: E

Replace random block
Simple, no overhead
```

### Cache Coherence

**Problem:**
```
CPU1 Cache: X = 10
CPU2 Cache: X = 10
Memory: X = 10

CPU1 writes: X = 20
CPU1 Cache: X = 20
CPU2 Cache: X = 10 (stale!)
Memory: X = 10 (stale!)
```

**MESI Protocol:**

**States:**
- **Modified:** Cache has only copy, modified
- **Exclusive:** Cache has only copy, not modified
- **Shared:** Multiple caches have copy
- **Invalid:** Cache line is invalid

**Example:**
```
Initial: X = 10 in memory

CPU1 reads X:
CPU1: Exclusive (X = 10)

CPU2 reads X:
CPU1: Shared (X = 10)
CPU2: Shared (X = 10)

CPU1 writes X = 20:
CPU1: Modified (X = 20)
CPU2: Invalid

CPU2 reads X:
CPU1: Shared (X = 20), writes back to memory
CPU2: Shared (X = 20)
```

### Cache Performance

**Hit Rate and Miss Rate:**
```
Hit Rate = Hits / (Hits + Misses)
Miss Rate = 1 - Hit Rate

Example:
1000 accesses
950 hits
50 misses

Hit Rate = 950 / 1000 = 95%
Miss Rate = 5%
```

**Average Memory Access Time:**
```
AMAT = Hit Time + (Miss Rate × Miss Penalty)

Example:
Hit Time: 1 cycle
Miss Penalty: 100 cycles
Miss Rate: 5%

AMAT = 1 + (0.05 × 100) = 6 cycles
```

**Cache Optimization Techniques:**

**Spatial Locality:**
```javascript
// Bad: Poor spatial locality
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        sum += matrix[j][i];  // Column-major access
    }
}

// Good: Good spatial locality
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        sum += matrix[i][j];  // Row-major access
    }
}
```

**Temporal Locality:**
```javascript
// Bad: Poor temporal locality
function process() {
    let data = loadData();
    // ... lots of other code ...
    useData(data);  // data might be evicted from cache
}

// Good: Good temporal locality
function process() {
    let data = loadData();
    useData(data);  // use immediately while in cache
}
```

## Memory in JavaScript

### Memory Lifecycle

**1. Allocation:**
```javascript
// Automatic allocation
let number = 123;           // Number
let string = "hello";       // String
let object = { a: 1 };      // Object
let array = [1, 2, 3];      // Array
```

**2. Usage:**
```javascript
// Read and write
console.log(object.a);      // Read
object.a = 2;               // Write
array.push(4);              // Modify
```

**3. Deallocation:**
```javascript
// Automatic garbage collection
object = null;              // Object eligible for GC
// GC runs automatically when needed
```

### V8 Memory Structure

**Heap Structure:**
```
New Space (Young Generation):
├── From Space (Survivor)
└── To Space (Survivor)

Old Space (Old Generation):
├── Old Pointer Space (objects with pointers)
└── Old Data Space (objects with data only)

Large Object Space:
└── Objects > 1MB

Code Space:
└── JIT compiled code

Map Space:
└── Hidden classes and meta information
```

**Generational Collection:**
```javascript
// Young generation (frequent GC)
function createTemp() {
    let temp = { data: new Array(1000) };
    return temp.data;
}  // temp object collected quickly

// Old generation (infrequent GC)
const cache = new Map();  // Lives long
cache.set('key', 'value');
```

### Memory Allocation Patterns

**Stack Allocation:**
```javascript
function calculate(x, y) {
    let sum = x + y;        // Primitive on stack
    let product = x * y;    // Primitive on stack
    return sum + product;
}  // Automatically deallocated
```

**Heap Allocation:**
```javascript
function createUser(name) {
    return {                // Object on heap
        name: name,
        created: new Date(),
        friends: []
    };
}

let user = createUser("John");  // Reference on stack
// Object remains on heap until GC
```

**Closure Memory:**
```javascript
function createCounter() {
    let count = 0;          // Captured in closure
    return {
        increment() {
            count++;        // Accesses closure variable
        },
        getCount() {
            return count;
        }
    };
}

let counter = createCounter();
// count variable kept in memory as long as counter exists
```

## Memory Leaks

### Common Causes

**1. Global Variables:**
```javascript
// Bad: Unintentional global
function createUser() {
    user = { name: "John" };  // Missing 'let/const'
}  // user is global, never collected

// Good: Proper scoping
function createUser() {
    let user = { name: "John" };
    return user;
}
```

**2. Forgotten Timers:**
```javascript
// Bad: Timer never cleared
function startPolling() {
    setInterval(() => {
        fetchData();
    }, 1000);
}  // Runs forever, holds references

// Good: Clear timer
function startPolling() {
    const timerId = setInterval(() => {
        fetchData();
    }, 1000);
    
    return () => clearInterval(timerId);
}
```

**3. Event Listeners:**
```javascript
// Bad: Listener not removed
function attachListener() {
    const element = document.getElementById('button');
    element.addEventListener('click', handleClick);
}  // Listener keeps element in memory

// Good: Remove listener
function attachListener() {
    const element = document.getElementById('button');
    const handler = () => handleClick();
    element.addEventListener('click', handler);
    
    return () => element.removeEventListener('click', handler);
}
```

**4. Closures:**
```javascript
// Bad: Unnecessary closure retention
function createHandlers() {
    const largeData = new Array(1000000);
    
    return {
        handler1() {
            console.log('Handler 1');
            // Doesn't use largeData but keeps it in memory
        }
    };
}

// Good: Avoid unnecessary retention
function createHandlers() {
    return {
        handler1() {
            console.log('Handler 1');
        }
    };
}
```

**5. Detached DOM Nodes:**
```javascript
// Bad: Detached node kept in memory
let detachedNode;
function removeElement() {
    const element = document.getElementById('myElement');
    detachedNode = element;  // Keeps reference
    element.remove();
}  // Node removed from DOM but still in memory

// Good: Don't keep references
function removeElement() {
    const element = document.getElementById('myElement');
    element.remove();
}  // Node can be garbage collected
```

### Detecting Memory Leaks

**Chrome DevTools:**
```javascript
// Take heap snapshots
// 1. Open DevTools → Memory tab
// 2. Take snapshot before action
// 3. Perform action
// 4. Take snapshot after action
// 5. Compare snapshots

// Example: Finding leaks
function leakyFunction() {
    const cache = [];
    setInterval(() => {
        cache.push(new Array(1000));
    }, 100);
}

// Heap snapshot will show growing array
```

**Performance Monitor:**
```javascript
// Monitor memory usage over time
if (performance.memory) {
    console.log('Used:', performance.memory.usedJSHeapSize);
    console.log('Total:', performance.memory.totalJSHeapSize);
    console.log('Limit:', performance.memory.jsHeapSizeLimit);
}
```

## Memory Optimization

### Best Practices

**1. Object Pooling:**
```javascript
// Bad: Create new objects repeatedly
function animate() {
    requestAnimationFrame(() => {
        const point = { x: 0, y: 0 };  // New object each frame
        updatePosition(point);
        animate();
    });
}

// Good: Reuse objects
const pointPool = { x: 0, y: 0 };
function animate() {
    requestAnimationFrame(() => {
        updatePosition(pointPool);  // Reuse same object
        animate();
    });
}
```

**2. Avoid Memory Churn:**
```javascript
// Bad: Creates many temporary objects
function processData(items) {
    return items
        .map(item => ({ ...item, processed: true }))
        .filter(item => item.active)
        .map(item => item.value);
}

// Good: Single pass, fewer allocations
function processData(items) {
    const result = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].active) {
            result.push(items[i].value);
        }
    }
    return result;
}
```

**3. Use Appropriate Data Structures:**
```javascript
// Bad: Array for frequent lookups
const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];
const user = users.find(u => u.id === 2);  // O(n)

// Good: Map for frequent lookups
const users = new Map([
    [1, { id: 1, name: 'John' }],
    [2, { id: 2, name: 'Jane' }]
]);
const user = users.get(2);  // O(1)
```

**4. Lazy Loading:**
```javascript
// Bad: Load everything upfront
class DataManager {
    constructor() {
        this.data = loadAllData();  // Large allocation
    }
}

// Good: Load on demand
class DataManager {
    constructor() {
        this.data = null;
    }
    
    getData() {
        if (!this.data) {
            this.data = loadAllData();
        }
        return this.data;
    }
}
```

**5. WeakMap and WeakSet:**
```javascript
// Bad: Strong references prevent GC
const cache = new Map();
function cacheData(element, data) {
    cache.set(element, data);
}  // Elements never collected

// Good: Weak references allow GC
const cache = new WeakMap();
function cacheData(element, data) {
    cache.set(element, data);
}  // Elements can be collected when no other references
```

### Memory Profiling

**Measuring Memory Usage:**
```javascript
// Before operation
const before = performance.memory.usedJSHeapSize;

// Perform operation
performOperation();

// After operation
const after = performance.memory.usedJSHeapSize;
const delta = after - before;

console.log(`Memory used: ${delta / 1024 / 1024} MB`);
```

**Allocation Timeline:**
```javascript
// Record allocations
console.profile('Memory Profile');

// Code to profile
for (let i = 0; i < 1000; i++) {
    createObjects();
}

console.profileEnd('Memory Profile');
// View in DevTools Performance tab
```

## Interview Questions

**Q: Explain the difference between stack and heap memory.**

A: Stack stores local variables and function calls with automatic allocation/deallocation (LIFO). It's fast but limited in size. Heap stores dynamically allocated objects with manual or garbage-collected deallocation. It's larger but slower, and requires memory management.

**Q: How does garbage collection work in JavaScript?**

A: JavaScript uses mark-and-sweep GC. It starts from root objects (globals, stack), marks all reachable objects recursively, then sweeps (collects) unmarked objects. Modern engines use generational GC with young and old generations for efficiency.

**Q: What causes memory leaks in JavaScript?**

A: Common causes: unintentional globals, forgotten timers/intervals, event listeners not removed, closures holding unnecessary references, and detached DOM nodes kept in memory.

**Q: Explain virtual memory and paging.**

A: Virtual memory gives each process its own address space, larger than physical RAM. Paging divides memory into fixed-size pages, mapping virtual addresses to physical frames via page tables. This enables memory isolation, efficient use of RAM, and swapping to disk.

**Q: What is cache coherence and why is it important?**

A: Cache coherence ensures multiple CPU caches have consistent views of memory. Without it, one CPU might read stale data after another CPU modifies it. Protocols like MESI maintain coherence by tracking cache line states and invalidating stale copies.

---

[← Back to Database Theory](./08-database-theory.md) | [Next: Compiler Theory →](./10-compiler-theory.md)
