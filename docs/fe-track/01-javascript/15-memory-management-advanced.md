# JavaScript Memory Management - Advanced Theory / Quản Lý Bộ Nhớ JavaScript - Lý Thuyết Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Momo e-wallet memory leak:** Single-page app memory usage tăng dần từ 80MB → 600MB sau 2 giờ sử dụng. Chrome DevTools Memory tab → Heap Snapshot comparison → tìm thấy 50,000+ `EventListener` objects không được cleanup. Root cause: `document.addEventListener('visibilitychange', handler)` được gọi mỗi lần user navigate — cùng một event listener được register nhiều lần. Fix: `removeEventListener` trong cleanup, hoặc AbortController signal. Result: memory ổn định ở 90MB.

**Bài học:** Memory leaks trong JavaScript không crash app ngay lập tức — chúng tích lũy dần (death by a thousand cuts). Biết 5 leak patterns phổ biến + cách dùng Chrome DevTools Memory tab là kỹ năng debug cần thiết ở level Senior.

## What & Why / Cái Gì & Tại Sao

**Analogy:** JavaScript memory management giống hotel: Stack là reception desk (fast, nhỏ, LIFO — mỗi function call là một check-in/check-out). Heap là các phòng (lớn, dynamic, managed). Garbage Collector là housekeeping: đi qua từng phòng, check xem có guest nào vẫn có key không (reachable). Phòng không có guest nào hold key → được clean và reallocated.

**Why GC exists:** Manual memory management (C/C++) là error-prone — double free, use-after-free bugs. JS designed for web developers who shouldn't need to `malloc`/`free`. Trade-off: GC pauses (STW events) vs developer convenience.

## Concept Map / Bản Đồ Khái Niệm

```
[JavaScript Memory Management]
        │
        ├── Memory Allocation
        │       ├── Stack: function frames, primitives, references (LIFO, ~1MB, fast)
        │       └── Heap: objects, arrays, closures (dynamic, GC-managed)
        │
        ├── Garbage Collection (V8: Orinoco GC)
        │       ├── Mark-and-Sweep: trace from roots → mark reachable → sweep rest
        │       ├── Generational: New Space (young, fast, Scavenge) + Old Space (survived 2 GCs, Major GC)
        │       ├── Incremental: spread Major GC over frames (avoid long STW pauses)
        │       └── Concurrent: GC runs on helper threads while JS runs
        │
        ├── Memory Leaks (5 common patterns)
        │       ├── Forgotten setInterval/setTimeout
        │       ├── Event listeners never removed
        │       ├── Closures capturing large objects
        │       ├── Detached DOM nodes (removed from DOM but held in JS reference)
        │       └── Unbounded caches (Map/array growing without eviction)
        │
        └── WeakMap/WeakSet — leak-safe caching
                Keys held weakly → GC can collect even if key still in WeakMap
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Stack vs Heap + Mark-and-Sweep GC

**🧠 Memory Hook:** "**Stack = fast LIFO hotel check-in/out. Heap = permanent rooms managed by GC. GC asks: does anyone still hold a key to this room?**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need two memory regions (Stack and Heap)? Because function-local data has perfectly predictable lifetime (created at call, destroyed at return) — this fits stack perfectly. Objects live longer, are shared, and have unpredictable lifetimes — they need dynamic allocation on the heap
- Why does JavaScript need garbage collection at all? Because objects' lifetimes are determined at runtime — you can't statically know when to free `const user = {}` in every possible execution path. GC observes reachability: if no code can reach an object, it's safe to free
- Why is mark-and-sweep the dominant algorithm? Because it correctly handles cycles (`a.ref = b; b.ref = a` — both unreachable despite pointing to each other). Reference counting (an alternative) fails on cycles.

**Visual — GC Roots and Reachability:**

```
GC Roots (always reachable):
  - Global object (window/globalThis)
  - Currently executing function's local variables
  - Variables in all active closures

Mark Phase:
  Root → A → B → C  ← all marked reachable
              ↘ D   ← marked reachable
  E → F             ← F has no reference from roots

Sweep Phase:
  E and F: NOT marked → deallocated ← memory freed
  A, B, C, D: marked → survive GC

Circular references (handled by mark-and-sweep):
  let x = {}; let y = {}; x.ref = y; y.ref = x;
  x = null; y = null;
  // Both x and y are unreachable from roots → swept
  // Reference counting would fail here (refcount = 1 for each)
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| "Setting variable to null frees memory immediately" | Marks the object unreachable from that reference — GC runs at its own schedule |
| "Circular references always cause memory leaks in JS" | Mark-and-sweep handles cycles — only old IE using ref counting had this problem |
| "More GC = good, memory is always being freed" | Frequent GC = frequent pauses (STW) — excessive allocation is the real problem |
| "V8 GC runs on the main thread" | Modern V8 (Orinoco): concurrent + incremental — most GC work runs off main thread |

**🎯 Interview Pattern:**
- **Trigger**: "how does garbage collection work" / "memory management" / "prevent memory leaks"
- **Concept**: Reachability-based GC, mark-and-sweep handles cycles, roots → mark → sweep
- **Opening**: "JavaScript uses mark-and-sweep GC. Starting from GC roots — globals, active stack frames, closures — it traverses all reachable objects and marks them. Everything unmarked gets swept. This correctly handles cycles, which is why setting `x = null; y = null` on mutually-referencing objects frees both..."

**🔑 Knowledge Chain:**
- **Prereq**: JavaScript objects and references (heap vs stack model)
- **Enables**: Understanding why WeakMap is necessary, diagnosing memory leaks, V8 performance optimization

---

### 2. Memory Leak Patterns — The 5 Killers

**🧠 Memory Hook:** "**TEC-DU: Timers, Event listeners, Closures, Detached DOM, Unbounded caches**"

**Why does this exist? / Tại sao tồn tại?**

- Why do event listeners cause leaks? Because `addEventListener` creates a reference from the DOM element to the handler — and often the handler closes over other objects. If the element lives on (or the handler is never removed), all closed-over objects stay alive
- Why are setInterval leaks common? Because `setInterval` holds a reference to the callback via the timer system — if you navigate away without clearing it, the callback (and everything it closes over) stays alive for the session
- Why does detached DOM cause leaks? You remove a node from the DOM, but you still hold a JavaScript reference to it. The node is logically "gone" but the GC can't collect it — worse, it keeps the entire DOM subtree alive

**Visual — Leak Detection in Chrome DevTools:**

```
Chrome DevTools → Memory tab → Heap Snapshot:

Snapshot 1 (baseline): 50 MB
[Navigate app for 10 minutes]
Snapshot 2: 180 MB

Comparison view: Retained Size Δ:
  EventListener: +50,000 objects, +120 MB ← LEAK FOUND

Fix: Track all addEventListener calls, pair with removeEventListener
     Or: Use AbortController signal:

const controller = new AbortController()
element.addEventListener('click', handler, { signal: controller.signal })
// Later: controller.abort() removes all listeners at once

setInterval leak:
  const id = setInterval(fn, 1000)
  // componentDidMount equivalent
  return () => clearInterval(id)  // ← always cleanup in useEffect return
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Adding event listeners in loop/component re-render without cleanup | Use `useEffect` return cleanup or `AbortController` |
| `const cache = new Map(); cache.set(obj, data)` growing unbounded | WeakMap for object-keyed caches (auto GC) or LRU eviction for size-bounded Map |
| Closure capturing `this` in React class component timer | `clearInterval` in `componentWillUnmount` or use hooks with cleanup |
| Holding reference to `detachedNode` for reuse | Truly detach by setting variable to `null` or rebuilding from fresh DOM |

**🎯 Interview Pattern:**
- **Trigger**: "memory leak" / "app gets slow over time" / "heap snapshot"
- **Concept**: TEC-DU pattern — 5 common leak sources; Chrome DevTools heap snapshot comparison
- **Opening**: "Memory leaks in JavaScript come from 5 main patterns I call TEC-DU: Timers not cleared, Event listeners not removed, Closures over large data, Detached DOM nodes still referenced, Unbounded caches. I'd start with Chrome DevTools Memory tab, take heap snapshot comparison before/after a suspect flow, and filter by Retained Size to find the leak..."

**🔑 Knowledge Chain:**
- **Prereq**: GC reachability (previous concept), closures, event system
- **Enables**: Production memory debugging, React `useEffect` cleanup discipline, WeakMap use cases

---

### 3. Generational GC + V8's Orinoco

**🧠 Memory Hook:** "**Most objects die young. New Space is fast and small. Old Space is large and collected less often. Write barriers track cross-generation references.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does V8 split memory into "new space" and "old space"? Because of the **generational hypothesis**: most objects die very young — a temporary `{}` in a loop, a React render result. Running full GC on every allocation would be too slow. New Space (young generation) is small and collected often. Old Space collects rarely.
- Why does "surviving 2 GCs" promote an object to Old Space? Because if an object survived 2 collections, it's probably long-lived — a module, a cache, a component instance. Old Space GC (Major GC) runs much less frequently.
- Why do write barriers matter? When an Old Space object references a New Space object, GC needs to know — otherwise it can't correctly collect New Space without scanning all of Old Space. Write barriers intercept assignments and update "remembered sets" of cross-generation pointers.

**Visual — V8 Heap Structure:**

```
V8 Heap (simplified):
┌────────────────────────────────────────────────────────┐
│  New Space (~32MB)                                       │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  From-space       │  │  To-space         │             │
│  │  (current alloc) │→GC│ (copy survivors) │             │
│  └──────────────────┘  └──────────────────┘             │
│  GC = Minor (Scavenge): fast, ~1ms, runs often          │
│  Survived 2 GCs → promoted to Old Space               │
├────────────────────────────────────────────────────────┤
│  Old Space (~1.5GB+)                                     │
│  Long-lived objects (modules, closures, class instances)│
│  GC = Major (Mark-Sweep-Compact): slow, 50-100ms       │
│  V8 uses Incremental + Concurrent to spread this cost  │
└────────────────────────────────────────────────────────┘
│  Large Object Space (LOB): objects > 512KB, never moved │
│  Code Space: compiled JIT code                          │
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| "GC pauses are always short" | Major GC (Old Space) can be 50-100ms without incremental — V8's concurrent GC reduces this |
| Allocating large objects frequently in hot paths | Large objects go to LOB and are never moved — fragmentation and less efficient GC |
| "`delete obj.prop` frees memory" | `delete` removes the property but doesn't trigger GC — the object is still reachable |
| Worrying about GC without profiling | 90% of memory issues are leaks (objects not freed), not GC algorithm choice — profile first |

**🎯 Interview Pattern:**
- **Trigger**: "V8 internals" / "GC performance" / "why does my app have long pauses" / "minor vs major GC"
- **Concept**: Generational hypothesis → New Space Scavenge (fast, frequent) + Old Space Major GC (slow, rare)
- **Opening**: "V8 uses generational GC based on the observation that most objects die young. New Space is ~32MB and collected with fast Scavenge — roughly 1ms. Objects surviving 2 collections promote to Old Space where Major GC runs less often but takes longer. V8's Orinoco GC runs most of this concurrently with the main thread to avoid long pauses..."

**🔑 Knowledge Chain:**
- **Prereq**: Mark-and-sweep GC basics (previous concept)
- **Enables**: Understanding `--max-old-space-size` Node.js flag, diagnosing GC-related jank in DevTools, server-side memory budgeting

---

## Reference Theory / Tài Liệu Tham Khảo



## Memory Model / Mô Hình Bộ Nhớ

### Stack vs Heap / Stack vs Heap

**English:** JavaScript uses both stack and heap memory for different types of data.

**Tiếng Việt:** JavaScript sử dụng cả bộ nhớ stack và heap cho các loại dữ liệu khác nhau.

```typescript
// Memory allocation model
// Mô hình phân bổ bộ nhớ

/**
 * Stack Memory:
 * - Stores primitive values
 * - Stores references to objects
 * - Function call frames
 * - Fast allocation/deallocation
 * - Limited size (typically 1MB)
 * - LIFO (Last In First Out)
 * 
 * Heap Memory:
 * - Stores objects and arrays
 * - Dynamic allocation
 * - Larger size
 * - Managed by garbage collector
 * - Slower access than stack
 */

interface MemoryAllocation {
  stack: StackMemory;
  heap: HeapMemory;
}

interface StackMemory {
  frames: CallFrame[];
  size: number;
  maxSize: number;
}

interface CallFrame {
  functionName: string;
  localVariables: Map<string, StackValue>;
  returnAddress: number;
}

interface StackValue {
  type: 'primitive' | 'reference';
  value: any;
  size: number;
}

interface HeapMemory {
  objects: Map<number, HeapObject>;
  freeList: FreeBlock[];
  totalSize: number;
  usedSize: number;
}

interface HeapObject {
  address: number;
  type: string;
  size: number;
  data: any;
  marked: boolean; // For GC
  generation: number; // For generational GC
}

interface FreeBlock {
  address: number;
  size: number;
}

class MemoryManager {
  private stack: StackMemory;
  private heap: HeapMemory;
  private nextAddress: number = 0;
  
  constructor() {
    this.stack = {
      frames: [],
      size: 0,
      maxSize: 1024 * 1024 // 1MB
    };
    
    this.heap = {
      objects: new Map(),
      freeList: [],
      totalSize: 100 * 1024 * 1024, // 100MB
      usedSize: 0
    };
  }
  
  // Allocate primitive on stack
  // Phân bổ nguyên thủy trên stack
  allocatePrimitive(value: any): StackValue {
    const size = this.calculatePrimitiveSize(value);
    
    if (this.stack.size + size > this.stack.maxSize) {
      throw new Error('Stack overflow');
    }
    
    this.stack.size += size;
    
    return {
      type: 'primitive',
      value,
      size
    };
  }
  
  // Allocate object on heap
  // Phân bổ object trên heap
  allocateObject(type: string, data: any): number {
    const size = this.calculateObjectSize(data);
    
    // Find free block
    const blockIndex = this.heap.freeList.findIndex(block => block.size >= size);
    
    let address: number;
    if (blockIndex !== -1) {
      // Reuse free block
      const block = this.heap.freeList[blockIndex];
      address = block.address;
      
      // Update or remove free block
      if (block.size > size) {
        block.address += size;
        block.size -= size;
      } else {
        this.heap.freeList.splice(blockIndex, 1);
      }
    } else {
      // Allocate new block
      address = this.nextAddress;
      this.nextAddress += size;
    }
    
    // Create heap object
    const heapObject: HeapObject = {
      address,
      type,
      size,
      data,
      marked: false,
      generation: 0
    };
    
    this.heap.objects.set(address, heapObject);
    this.heap.usedSize += size;
    
    return address;
  }
  
  // Deallocate object
  // Giải phóng object
  deallocate(address: number): void {
    const object = this.heap.objects.get(address);
    if (!object) return;
    
    // Add to free list
    this.heap.freeList.push({
      address: object.address,
      size: object.size
    });
    
    // Remove from objects
    this.heap.objects.delete(address);
    this.heap.usedSize -= object.size;
    
    // Coalesce adjacent free blocks
    this.coalesceFreeBlocks();
  }
  
  private coalesceFreeBlocks(): void {
    // Sort by address
    this.heap.freeList.sort((a, b) => a.address - b.address);
    
    // Merge adjacent blocks
    for (let i = 0; i < this.heap.freeList.length - 1; i++) {
      const current = this.heap.freeList[i];
      const next = this.heap.freeList[i + 1];
      
      if (current.address + current.size === next.address) {
        current.size += next.size;
        this.heap.freeList.splice(i + 1, 1);
        i--;
      }
    }
  }
  
  private calculatePrimitiveSize(value: any): number {
    switch (typeof value) {
      case 'boolean': return 1;
      case 'number': return 8;
      case 'bigint': return 8;
      case 'string': return value.length * 2; // UTF-16
      case 'symbol': return 8;
      case 'undefined': return 0;
      default: return 8; // reference
    }
  }
  
  private calculateObjectSize(data: any): number {
    // Simplified calculation
    let size = 16; // Object header
    
    if (Array.isArray(data)) {
      size += data.length * 8; // Array elements
    } else if (typeof data === 'object') {
      size += Object.keys(data).length * 16; // Properties
    }
    
    return size;
  }
  
  // Get memory statistics
  // Lấy thống kê bộ nhớ
  getStats(): MemoryStats {
    return {
      stack: {
        used: this.stack.size,
        max: this.stack.maxSize,
        frames: this.stack.frames.length
      },
      heap: {
        used: this.heap.usedSize,
        total: this.heap.totalSize,
        objects: this.heap.objects.size,
        freeBlocks: this.heap.freeList.length
      }
    };
  }
}

interface MemoryStats {
  stack: {
    used: number;
    max: number;
    frames: number;
  };
  heap: {
    used: number;
    total: number;
    objects: number;
    freeBlocks: number;
  };
}
```

---

## Garbage Collection / Thu Gom Rác

### Mark-and-Sweep Algorithm / Thuật Toán Đánh Dấu và Quét

**English:** Modern JavaScript engines use mark-and-sweep garbage collection with generational optimization.

**Tiếng Việt:** Các engine JavaScript hiện đại sử dụng thu gom rác đánh dấu và quét với tối ưu hóa theo thế hệ.

```typescript
// Garbage collector implementation
// Triển khai bộ thu gom rác

class GarbageCollector {
  private memoryManager: MemoryManager;
  private roots: Set<number>; // GC roots (global objects, stack references)
  
  constructor(memoryManager: MemoryManager) {
    this.memoryManager = memoryManager;
    this.roots = new Set();
  }
  
  // Mark-and-Sweep GC
  // Thu gom rác đánh dấu và quét
  collect(): GCStats {
    const startTime = performance.now();
    const initialMemory = this.memoryManager.getStats().heap.used;
    
    // Phase 1: Mark
    this.markPhase();
    
    // Phase 2: Sweep
    const collected = this.sweepPhase();
    
    const endTime = performance.now();
    const finalMemory = this.memoryManager.getStats().heap.used;
    
    return {
      duration: endTime - startTime,
      collected,
      before: initialMemory,
      after: finalMemory
    };
  }
  
  private markPhase(): void {
    // Mark all reachable objects
    const worklist: number[] = Array.from(this.roots);
    const marked = new Set<number>();
    
    while (worklist.length > 0) {
      const address = worklist.pop()!;
      
      if (marked.has(address)) continue;
      marked.add(address);
      
      // Mark object
      const object = this.memoryManager['heap'].objects.get(address);
      if (object) {
        object.marked = true;
        
        // Add references to worklist
        const references = this.getReferences(object);
        worklist.push(...references);
      }
    }
  }
  
  private sweepPhase(): number {
    let collected = 0;
    const objects = this.memoryManager['heap'].objects;
    
    // Sweep unmarked objects
    for (const [address, object] of objects.entries()) {
      if (!object.marked) {
        this.memoryManager.deallocate(address);
        collected += object.size;
      } else {
        // Reset mark for next GC
        object.marked = false;
      }
    }
    
    return collected;
  }
  
  private getReferences(object: HeapObject): number[] {
    const references: number[] = [];
    
    // Extract references from object data
    if (typeof object.data === 'object' && object.data !== null) {
      for (const value of Object.values(object.data)) {
        if (typeof value === 'number' && this.isValidAddress(value)) {
          references.push(value);
        }
      }
    }
    
    return references;
  }
  
  private isValidAddress(address: number): boolean {
    return this.memoryManager['heap'].objects.has(address);
  }
  
  // Add GC root
  // Thêm GC root
  addRoot(address: number): void {
    this.roots.add(address);
  }
  
  // Remove GC root
  // Xóa GC root
  removeRoot(address: number): void {
    this.roots.delete(address);
  }
}

// Generational Garbage Collector
// Bộ thu gom rác theo thế hệ
class GenerationalGC extends GarbageCollector {
  private youngGeneration: Set<number>;
  private oldGeneration: Set<number>;
  private promotionThreshold: number = 2;
  
  constructor(memoryManager: MemoryManager) {
    super(memoryManager);
    this.youngGeneration = new Set();
    this.oldGeneration = new Set();
  }
  
  // Minor GC (young generation only)
  // GC nhỏ (chỉ thế hệ trẻ)
  minorCollect(): GCStats {
    const startTime = performance.now();
    
    // Mark young generation
    this.markYoungGeneration();
    
    // Sweep and promote
    const collected = this.sweepYoungGeneration();
    
    const endTime = performance.now();
    
    return {
      duration: endTime - startTime,
      collected,
      before: 0,
      after: 0
    };
  }
  
  // Major GC (all generations)
  // GC lớn (tất cả thế hệ)
  majorCollect(): GCStats {
    return this.collect();
  }
  
  private markYoungGeneration(): void {
    // Mark objects in young generation
    for (const address of this.youngGeneration) {
      const object = this.memoryManager['heap'].objects.get(address);
      if (object) {
        object.marked = true;
      }
    }
  }
  
  private sweepYoungGeneration(): number {
    let collected = 0;
    
    for (const address of this.youngGeneration) {
      const object = this.memoryManager['heap'].objects.get(address);
      
      if (!object) {
        this.youngGeneration.delete(address);
        continue;
      }
      
      if (!object.marked) {
        // Collect
        this.memoryManager.deallocate(address);
        this.youngGeneration.delete(address);
        collected += object.size;
      } else {
        // Promote to old generation if survived enough collections
        object.generation++;
        if (object.generation >= this.promotionThreshold) {
          this.youngGeneration.delete(address);
          this.oldGeneration.add(address);
        }
        object.marked = false;
      }
    }
    
    return collected;
  }
  
  // Allocate in young generation
  // Phân bổ trong thế hệ trẻ
  allocateYoung(type: string, data: any): number {
    const address = this.memoryManager.allocateObject(type, data);
    this.youngGeneration.add(address);
    return address;
  }
}

interface GCStats {
  duration: number;
  collected: number;
  before: number;
  after: number;
}
```

---

## Memory Leaks / Rò Rỉ Bộ Nhớ

### Common Patterns / Patterns Phổ Biến

**English:** Memory leaks occur when objects are unintentionally kept in memory.

**Tiếng Việt:** Rò rỉ bộ nhớ xảy ra khi objects vô tình được giữ trong bộ nhớ.

```typescript
// Memory leak detection and prevention
// Phát hiện và ngăn chặn rò rỉ bộ nhớ

class MemoryLeakDetector {
  private snapshots: MemorySnapshot[] = [];
  
  // Take memory snapshot
  // Chụp snapshot bộ nhớ
  takeSnapshot(): MemorySnapshot {
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapSize: 0,
      objects: new Map(),
      retainedSize: new Map()
    };
    
    // Collect object information
    // This would use actual heap profiling in real implementation
    
    this.snapshots.push(snapshot);
    return snapshot;
  }
  
  // Compare snapshots to find leaks
  // So sánh snapshots để tìm rò rỉ
  findLeaks(snapshot1: MemorySnapshot, snapshot2: MemorySnapshot): LeakReport {
    const leaks: LeakInfo[] = [];
    
    // Find objects that grew significantly
    for (const [type, count2] of snapshot2.objects) {
      const count1 = snapshot1.objects.get(type) || 0;
      const growth = count2 - count1;
      
      if (growth > 100) { // Threshold
        leaks.push({
          type,
          count: growth,
          retainedSize: snapshot2.retainedSize.get(type) || 0
        });
      }
    }
    
    return {
      leaks,
      totalGrowth: snapshot2.heapSize - snapshot1.heapSize
    };
  }
  
  // Common leak patterns
  // Patterns rò rỉ phổ biến
  
  // 1. Forgotten timers
  // 1. Timers bị quên
  static leakPattern1_ForgottenTimer() {
    // ❌ Bad: Timer never cleared
    setInterval(() => {
      console.log('Running...');
    }, 1000);
    
    // ✅ Good: Clear timer when done
    const timerId = setInterval(() => {
      console.log('Running...');
    }, 1000);
    
    // Later...
    clearInterval(timerId);
  }
  
  // 2. Event listeners not removed
  // 2. Event listeners không được xóa
  static leakPattern2_EventListeners() {
    const element = document.getElementById('button');
    
    // ❌ Bad: Listener never removed
    element?.addEventListener('click', function handler() {
      console.log('Clicked');
    });
    
    // ✅ Good: Remove listener
    const handler = () => console.log('Clicked');
    element?.addEventListener('click', handler);
    
    // Later...
    element?.removeEventListener('click', handler);
  }
  
  // 3. Closures holding references
  // 3. Closures giữ references
  static leakPattern3_Closures() {
    // ❌ Bad: Closure holds large object
    function createClosure() {
      const largeObject = new Array(1000000).fill('data');
      
      return function() {
        // Even if we don't use largeObject,
        // it's kept in memory
        console.log('Hello');
      };
    }
    
    // ✅ Good: Don't capture unnecessary variables
    function createClosure2() {
      const largeObject = new Array(1000000).fill('data');
      const needed = largeObject[0];
      
      return function() {
        console.log(needed);
      };
    }
  }
  
  // 4. Detached DOM nodes
  // 4. DOM nodes bị tách rời
  static leakPattern4_DetachedDOM() {
    // ❌ Bad: Keeping reference to removed DOM
    const elements: HTMLElement[] = [];
    
    function addElement() {
      const div = document.createElement('div');
      document.body.appendChild(div);
      elements.push(div); // Reference kept
    }
    
    function removeElement() {
      const div = elements.pop();
      div?.remove(); // Removed from DOM but still in array
    }
    
    // ✅ Good: Clear references
    function removeElement2() {
      const div = elements.pop();
      div?.remove();
      // div is now eligible for GC
    }
  }
  
  // 5. Global variables
  // 5. Biến toàn cục
  static leakPattern5_Globals() {
    // ❌ Bad: Accidental global
    function createLeak() {
      leak = 'This is a global!'; // Missing 'var/let/const'
    }
    
    // ✅ Good: Use strict mode and proper declarations
    function noLeak() {
      'use strict';
      const notGlobal = 'This is local';
    }
  }
  
  // 6. Cache without limits
  // 6. Cache không giới hạn
  static leakPattern6_UnboundedCache() {
    // ❌ Bad: Cache grows indefinitely
    const cache = new Map();
    
    function getData(key: string) {
      if (!cache.has(key)) {
        cache.set(key, expensiveOperation(key));
      }
      return cache.get(key);
    }
    
    // ✅ Good: Use LRU cache with size limit
    class LRUCache<K, V> {
      private cache = new Map<K, V>();
      private maxSize: number;
      
      constructor(maxSize: number) {
        this.maxSize = maxSize;
      }
      
      get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
          // Move to end (most recently used)
          this.cache.delete(key);
          this.cache.set(key, value);
        }
        return value;
      }
      
      set(key: K, value: V): void {
        if (this.cache.has(key)) {
          this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
          // Remove least recently used
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
      }
    }
    
    function expensiveOperation(key: string): any {
      return { data: key };
    }
  }
}

interface MemorySnapshot {
  timestamp: number;
  heapSize: number;
  objects: Map<string, number>;
  retainedSize: Map<string, number>;
}

interface LeakReport {
  leaks: LeakInfo[];
  totalGrowth: number;
}

interface LeakInfo {
  type: string;
  count: number;
  retainedSize: number;
}
```

---

## WeakMap and WeakSet / WeakMap và WeakSet

### Weak References / Tham Chiếu Yếu

**English:** WeakMap and WeakSet hold weak references that don't prevent garbage collection.

**Tiếng Việt:** WeakMap và WeakSet giữ tham chiếu yếu không ngăn thu gom rác.

```typescript
// WeakMap and WeakSet usage
// Sử dụng WeakMap và WeakSet

class WeakReferenceExamples {
  // Use case 1: Private data
  // Trường hợp 1: Dữ liệu riêng tư
  static privateDataExample() {
    const privateData = new WeakMap<object, any>();
    
    class User {
      constructor(name: string) {
        privateData.set(this, { password: 'secret' });
      }
      
      getPassword() {
        return privateData.get(this)?.password;
      }
    }
    
    const user = new User('John');
    console.log(user.getPassword()); // 'secret'
    
    // When user is garbage collected, private data is too
  }
  
  // Use case 2: Caching
  // Trường hợp 2: Caching
  static cachingExample() {
    const cache = new WeakMap<object, any>();
    
    function processObject(obj: object) {
      if (cache.has(obj)) {
        return cache.get(obj);
      }
      
      const result = expensiveComputation(obj);
      cache.set(obj, result);
      return result;
    }
    
    function expensiveComputation(obj: object): any {
      return { processed: true };
    }
    
    // Cache entries are automatically cleaned up
    // when objects are no longer referenced
  }
  
  // Use case 3: DOM node metadata
  // Trường hợp 3: Metadata DOM node
  static domMetadataExample() {
    const metadata = new WeakMap<HTMLElement, any>();
    
    function attachMetadata(element: HTMLElement, data: any) {
      metadata.set(element, data);
    }
    
    function getMetadata(element: HTMLElement) {
      return metadata.get(element);
    }
    
    // When DOM node is removed, metadata is automatically cleaned up
  }
  
  // Use case 4: Tracking object usage
  // Trường hợp 4: Theo dõi sử dụng object
  static trackingExample() {
    const accessed = new WeakSet<object>();
    
    function markAccessed(obj: object) {
      accessed.add(obj);
    }
    
    function wasAccessed(obj: object): boolean {
      return accessed.has(obj);
    }
    
    // Tracking data doesn't prevent GC
  }
}
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Explain how JavaScript garbage collection works — include how it handles circular references. 🟡 Mid

**A:** JavaScript uses mark-and-sweep GC. Starting from GC roots (global objects, active stack frames, active closures), the GC traverses all reachable objects and marks them. Everything not marked is swept (freed). Circular references are handled correctly: if `a.ref = b; b.ref = a` and both `a` and `b` are set to `null`, neither is reachable from roots — both get swept. (Old reference-counting approach would fail here — this is why IE6 had the famous closure memory leak bug.)

JavaScript dùng mark-and-sweep: trace từ roots → mark reachable → sweep unmarked. Circular references được xử lý đúng vì GC check reachability từ roots, không phải reference count. Đây là lý do IE6 có memory leak bug với closures (dùng ref counting cũ không xử lý được cycles).

**💡 Interview Signal:**
- ✅ Strong: Names roots, explains mark/sweep phases, explicitly mentions cycle handling, mentions why ref-counting fails
- ❌ Weak: "JavaScript automatically frees unused objects" — no mechanism, no cycle explanation

---

### Q: Name the 5 most common memory leak patterns and how to fix each. 🟡 Mid

**A:** The TEC-DU patterns:
1. **Timers**: `setInterval`/`setTimeout` holding callback + closure → `clearInterval(id)` in cleanup
2. **Event listeners**: `addEventListener` never `removeEventListener` → use AbortController signal in React effects
3. **Closures**: Handler closing over large data structure unnecessarily → nullify captured refs when done
4. **Detached DOM**: Node removed from DOM but reference held in JS → set variable to `null` when done
5. **Unbounded caches**: `Map` growing forever → LRU eviction policy or `WeakMap` for object keys

Detect: Chrome DevTools → Memory → Heap Snapshot comparison. Filter by "Retained Size Δ" to find growing object types.

TEC-DU: Timers, Event listeners, Closures, Detached DOM, Unbounded caches. Chrome DevTools Memory tab → Heap Snapshot comparison → filter "Retained Size Δ" để tìm leak.

**💡 Interview Signal:**
- ✅ Strong: Names 5 patterns with concrete fixes, mentions heap snapshot comparison workflow
- ❌ Weak: "Use WeakMap" or "Remove event listeners" — partial list without detection strategy

---

### Q: What is the generational hypothesis and how does V8's GC exploit it? 🔴 Senior

**A:** The generational hypothesis: most objects die young — temporary objects created during a function call, React render intermediates, loop temporaries. V8 exploits this by dividing the heap into New Space (~32MB, collected with fast Scavenge GC every few seconds, <1ms) and Old Space (collected with Major Mark-Sweep-Compact, which is slower but runs rarely). Objects surviving 2 New Space collections are promoted to Old Space. This means the common case (allocate temp object → use → discard) is extremely fast. Long-lived objects pay the Old Space Major GC cost infrequently.

Generational hypothesis: hầu hết objects chết trẻ. V8: New Space (~32MB) → Scavenge GC nhanh (<1ms). Objects sống sót 2 lần GC → promote sang Old Space → Major GC chậm nhưng hiếm. Hot path chỉ trigger fast Scavenge.

**💡 Interview Signal:**
- ✅ Strong: States the hypothesis explicitly, names Scavenge vs Major GC, explains promotion threshold, gives performance implication
- ❌ Weak: "V8 has young and old generation" — states the fact without the hypothesis behind it or the performance reasoning

---

### Q: Why should you prefer WeakMap over Map for caching objects? 🟢 Junior

**A:** When you cache data keyed by an object (e.g., `cache.set(domNode, computedValue)`), using `Map` prevents GC from collecting `domNode` even after it's removed from the DOM — Map holds a strong reference. `WeakMap` holds keys weakly: if `domNode` has no other references, GC can collect it along with the cache entry automatically. The practical consequence: WeakMap caches don't need manual eviction — they self-clean when the key object is GC'd. Trade-off: WeakMap is not iterable (no `.keys()`, `.forEach()`) because GC timing is non-deterministic.

`Map` giữ strong reference → DOM node không bị GC dù đã remove. `WeakMap` giữ weak reference → khi không còn reference nào khác đến key, GC tự xóa cả key lẫn cache entry. Không cần manual eviction. Trade-off: không iterable vì GC timing không xác định.

**💡 Interview Signal:**
- ✅ Strong: Explains strong vs weak reference, mentions self-cleaning behavior, mentions non-iterability trade-off
- ❌ Weak: "WeakMap doesn't prevent GC" — correct but misses why that matters for caching and the non-iterable trade-off

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Level | One-liner |
|---|-------|-------|-----------|
| 1 | Mark-and-sweep + cycles | 🟡 | Roots → mark reachable → sweep rest; handles cycles (ref-counting can't) |
| 2 | Memory leak patterns | 🟡 | TEC-DU: Timers, Events, Closures, Detached DOM, Unbounded caches |
| 3 | Generational GC | 🔴 | Most objects die young → New Space Scavenge (fast) + Old Space Major GC (rare) |
| 4 | WeakMap vs Map for caches | 🟢 | WeakMap = self-cleaning (weak keys), not iterable; Map = strong keys, need eviction |

---

## ⚡ Cold Call Simulation

**Q: "Your React single-page app gets slower over 2 hours of use. Memory usage climbs from 50MB to 400MB. How do you diagnose and fix it?"**

**30-second answer:**

"First, I'd open Chrome DevTools → Memory tab and take a heap snapshot as a baseline. Then I'd reproduce the usage pattern for 30 minutes and take a second snapshot. I'd compare the two snapshots and sort by 'Retained Size Δ' to find which object types grew. If I see `EventListener` objects growing, that's a classic event listener leak — I'd search the codebase for `addEventListener` calls without corresponding cleanup. In React, that means `useEffect` hooks missing a return cleanup function. If I see DOM nodes growing in count, I likely have detached DOM — references held in component state after the node is removed. The fix: ensure `useEffect` returns a cleanup that calls `removeEventListener`, cancels timers with `clearTimeout`, and aborts fetches with `AbortController`. I'd also audit any `setInterval` calls to verify they're paired with `clearInterval` in the cleanup."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Explain mark-and-sweep in 3 sentences. Why does it correctly handle circular references?
- **Visual**: Draw V8's heap regions — New Space and Old Space. What triggers promotion from New to Old?
- **Application**: You have `const cache = new Map()` in a module. Users report the app slows after 10 minutes. What's the likely issue and fix?
- **Debug**: Chrome DevTools heap snapshot shows `HTMLElement` count growing by 500 after each navigation. What's the cause and how do you fix it?
- **Teach**: Explain to a junior why `weakMap.set(element, data)` is better than `map.set(element, data)` for DOM-related caches — use the "hotel key" analogy.

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [JavaScript Type System](./14-javascript-type-system-theory.md) — V8 SMI/HeapNumber connects to heap allocation
- ⬅️ **Built on**: [ES6+ Features Deep](./11-es6-features-deep.md) — WeakMap and WeakSet covered there
- 🔗 **Applied in**: [React Performance](../03-react/09-performance-optimization.md) — `useEffect` cleanup prevents event listener leaks
- 🔗 **Applied in**: [Browser Performance](../06-browser-performance/05-rendering-optimization-theory.md) — GC pauses affect rendering frame budget

[← Previous: Type System Theory](./14-javascript-type-system-theory.md) | [Next: Execution Context →](./16-execution-context-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
