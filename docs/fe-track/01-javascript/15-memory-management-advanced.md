# JavaScript Memory Management - Advanced Theory / Quản Lý Bộ Nhớ JavaScript - Lý Thuyết Nâng Cao

## Table of Contents / Mục Lục

1. [Memory Model](#memory-model)
2. [Garbage Collection](#garbage-collection)
3. [Memory Leaks](#memory-leaks)
4. [Optimization Techniques](#optimization-techniques)
5. [WeakMap and WeakSet](#weakmap-and-weakset)
6. [Interview Questions](#interview-questions)

---

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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🔴 [Senior] Q1: Explain how garbage collection works in JavaScript

**English Answer:**

JavaScript uses automatic garbage collection with mark-and-sweep algorithm:

**Mark Phase:**
1. Start from GC roots (global objects, stack)
2. Traverse all reachable objects
3. Mark each reachable object

**Sweep Phase:**
1. Scan all objects in heap
2. Deallocate unmarked objects
3. Coalesce free memory blocks

**Optimizations:**
- **Generational GC**: Young and old generations
- **Incremental GC**: Spread work over time
- **Concurrent GC**: Run in parallel with application

**Tiếng Việt:**

JavaScript sử dụng thu gom rác tự động với thuật toán đánh dấu và quét, có tối ưu hóa theo thế hệ và concurrent.

### 🔴 [Senior] Q2: What causes memory leaks in JavaScript?

**English Answer:**

Common causes:
1. **Forgotten timers**: `setInterval` not cleared
2. **Event listeners**: Not removed when done
3. **Closures**: Capturing large objects unnecessarily
4. **Detached DOM**: Keeping references to removed nodes
5. **Global variables**: Accidental globals
6. **Unbounded caches**: Growing without limit

**Prevention:**
- Clear timers and listeners
- Use WeakMap/WeakSet for caches
- Avoid global variables
- Use strict mode
- Profile memory regularly

**Tiếng Việt:**

Nguyên nhân phổ biến: timers quên xóa, event listeners, closures, DOM nodes tách rời, biến toàn cục, cache không giới hạn.

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Stack for primitives and references, heap for objects
2. Mark-and-sweep garbage collection
3. Generational GC for optimization
4. Common memory leak patterns
5. WeakMap/WeakSet for weak references
6. Memory profiling tools

---

[← Previous: Type System Theory](./14-javascript-type-system-theory.md) | [Next: Execution Context →](./16-execution-context-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
