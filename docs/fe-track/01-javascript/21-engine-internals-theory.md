# JavaScript Engine Internals - Theory / Nội Bộ Engine JavaScript - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**React component with poor hidden class usage:** A developer renders a list of 50,000 product cards. Each `Product` object is built in a different function depending on the data source — some have `{ id, name, price }`, others `{ id, price, name }` (different property addition order). V8 creates a separate hidden class for each shape. Property access devolves from O(1) monomorphic to megamorphic dictionary lookup. Frame render time jumps from 8ms to 40ms. Fix: normalize object construction to always add properties in the same order, and initialize all properties in one place. Render time drops back to 8ms.

**Bài học:** JavaScript engines like V8 make assumptions about your objects' shape at runtime. Writing "engine-friendly" code — consistent object shapes, monomorphic call sites, avoiding `delete` — isn't premature optimization. It directly impacts whether V8's JIT can generate fast machine code or falls back to slow dictionary lookups.

## What & Why / Cái Gì & Tại Sao

**Why engines need JIT:** JavaScript is dynamically typed — no type annotations, properties added at runtime, types can change. A naïve interpreter executes each bytecode instruction one by one. For hot paths (code executed 10,000+ times), this is wasteful. JIT (Just-In-Time) compilers observe the types and shapes used at runtime, then compile that specific hot path to native machine code — with assumptions baked in. If those assumptions are violated, the engine **deoptimizes** back to interpreted mode.

**V8 specifically:** Ignition (bytecode interpreter) handles all code initially — fast startup, low memory. TurboFan (optimizing compiler) handles hot functions — collects type feedback from Ignition, generates highly optimized machine code. The key insight: V8 assumes types stay stable. Write code that confirms this assumption.

## Concept Map / Bản Đồ Khái Niệm

```
[V8 Compilation Pipeline]
        │
        Source JS → Parser → AST → Ignition (bytecode interpreter)
                                           │
                                    Type feedback collected
                                           │
                                    Hot function? → TurboFan (JIT)
                                           │                │
                                    Execute fast    Assumptions violated?
                                                           │
                                                    Deoptimize → Ignition

[Hidden Classes / Shapes]
        Object created → V8 assigns Shape 0
        Add prop 'id'  → transition to Shape 1
        Add prop 'name'→ transition to Shape 2
        Two objects built the same way → share Shape 2 → fast!
        Different property order → separate shape graph → slow!

[Inline Cache States]
        Uninitialized → first call
        Monomorphic   → always same shape (fastest: 1-2 cycles)
        Polymorphic   → 2-4 shapes (ok: 5-10 cycles)
        Megamorphic   → 5+ shapes (slow: 50-100 cycles, no cache)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. V8 Compilation Pipeline: Ignition → TurboFan

**🧠 Memory Hook:** "**Ignition = interpreter, runs everything. TurboFan = optimizing compiler, runs hot paths. Type feedback from Ignition tells TurboFan what to assume. Wrong assumption = deoptimize back to Ignition.**"

**Why does this exist? / Tại sao tồn tại?**

- Why not compile everything upfront (like C++)? Because JS startup time would be too slow — full compilation of a 500KB bundle before any code runs would freeze the browser for seconds. Interpreting bytecode starts immediately
- Why not just interpret forever? Because tight loops (animation, array processing, crypto) run the same bytecode millions of times — interpreting each instruction every time is 10-100x slower than native machine code
- Why does deoptimization exist? TurboFan bets on type stability — it compiles `add(a, b)` assuming `a` and `b` are always integers and emits a single `ADD` CPU instruction. If you then call `add('hello', 'world')`, the bet is wrong — the engine must abandon the optimized code and fall back to the generic interpreter

**Visual — Compilation Tiers:**

```
Source → [Parser] → AST → [Ignition] → Bytecode
                                │
                    Execute (all code, cold path)
                    Collect type feedback
                                │
                    Function called N times? (N ≈ 1000+)
                                │
                    [TurboFan] receives feedback:
                    "add(a,b) — a always Int32, b always Int32"
                                │
                    Emit optimized native code:
                    mov eax, [a]; add eax, [b]; ret
                                │
                    Execute FAST (1-2 CPU cycles per op)
                                │
                    Called with wrong type?
                    → DEOPT: mark as "don't optimize", back to Ignition
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Function called with both integers and strings interchangeably | Keep function call sites monomorphic — same argument types every call |
| `try/catch` inside tight loops | `try/catch` prevents TurboFan optimization of the enclosed code — extract hot code outside try blocks |
| Using `arguments` object in inner loops | `arguments` is a legacy object that deoptimizes — use rest parameters `...args` |
| `eval()` or `with` in performance-critical code | Both prevent static analysis — V8 can't optimize scopes containing these |

**🎯 Interview Pattern:**
- **Trigger**: "how do JS engines work" / "V8 optimization" / "why is my code slow"
- **Concept**: Multi-tier: interpret cold → compile hot → deopt on type change
- **Opening**: "V8 uses a two-tier system. Ignition interprets all JavaScript as bytecode — fast startup. TurboFan kicks in for hot functions, compiling them to native machine code using type feedback collected by Ignition. The key insight is TurboFan makes type assumptions — it compiles a fast path assuming integer arithmetic. If those assumptions are violated, V8 deoptimizes back to Ignition..."

**🔑 Knowledge Chain:**
- **Prereq**: Bytecode concepts, CPU instruction basics
- **Enables**: Understanding why type consistency matters, why `eval` is slow, why `try/catch` in loops is bad

---

### 2. Hidden Classes (Shapes) — Object Property Optimization

**🧠 Memory Hook:** "**Hidden class = V8's internal blueprint for an object's property layout. Same shape = same hidden class = O(1) array-style access. Different property order = different hidden class = slow dictionary lookup.**"

**Why does this exist? / Tại sao tồn tại?**

- Why can't V8 just use a hash map for all property access? It can, and it's the fallback. But hash map lookup is O(1) amortized with high constant — hash the key, probe the table, follow pointer. For objects accessed millions of times in tight loops, this is too slow
- Why do "shapes" work for optimization? If V8 knows all objects of a certain type have `id` at offset 0 and `name` at offset 8, it can compile `obj.name` as "read 8 bytes from the object's base address" — a single memory read, no hashing
- Why does property insertion order matter? Hidden class transitions are deterministic: `{} → add id → Shape1 → add name → Shape2`. If another object adds `name` first then `id`, it creates a different transition chain: `{} → add name → Shape3 → add id → Shape4`. These objects can't share hidden classes even though they end up with the same properties

**Visual — Hidden Class Transitions:**

```javascript
// Bad: different property order → different hidden classes
function createProductA() {
  return { id: 1, name: 'A', price: 10 }  // Shape: id→name→price
}
function createProductB() {
  return { id: 2, price: 20, name: 'B' }  // Shape: id→price→name ← DIFFERENT!
}
// Array of mixed shapes → polymorphic / megamorphic → slow

// Good: consistent construction → shared hidden class
function createProduct(id, name, price) {
  return { id, name, price }  // Always: id→name→price → Shape shared ✅
}

// Also bad: adding properties conditionally
function createUser(hasAdmin) {
  const u = { id: 1, name: 'Nhi' }
  if (hasAdmin) u.role = 'admin'  // ← some objects have 'role', others don't
  // → two different hidden classes → polymorphic lookups
  return u
}

// Fix: always initialize all properties, use null for optional:
function createUser(hasAdmin) {
  return { id: 1, name: 'Nhi', role: hasAdmin ? 'admin' : null }  // ✅ same shape always
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `delete obj.property` | Set to `null`/`undefined` — `delete` changes the hidden class and can push to slow mode |
| Adding properties outside constructor: `obj.newProp = x` | Define all properties in constructor/creation function |
| Different creation order in different code paths | Single factory function with fixed property order |
| `Object.assign({}, base, overrides)` with varying `overrides` keys | Ensure all possible properties are in the base, use `null` for absent values |

**🎯 Interview Pattern:**
- **Trigger**: "object performance" / "hidden class" / "V8 optimization tips"
- **Concept**: Consistent shape = shared hidden class = O(1) direct offset access
- **Opening**: "V8 creates hidden classes to track the structure of objects. If two objects have the same properties added in the same order, they share a hidden class, and property access is a direct memory offset — extremely fast. If property addition order varies, or properties are deleted, V8 creates separate hidden class transitions and can't use the fast path..."

**🔑 Knowledge Chain:**
- **Prereq**: Objects, prototypes, memory layout basics
- **Enables**: Understanding Inline Caching, TypeScript `interface` performance benefit, `class` fields optimization

---

### 3. Inline Caching — Monomorphic → Megamorphic

**🧠 Memory Hook:** "**IC = cache the answer to 'how do I access property X on this type of object?' Monomorphic = one answer cached (fastest). Megamorphic = 5+ answers, cache useless (slowest).**"

**Why does this exist? / Tại sao tồn tại?**

- Why cache property lookups? Because `obj.x` in a loop executes millions of times. Each lookup needs to: check the hidden class, find the property offset, read the value. If the hidden class is always the same, V8 can hard-code the offset — no lookup at all
- Why does megamorphic state hurt? When 5+ different hidden classes are seen at the same call site, the cache can't hold them all. V8 falls back to a global "megamorphic stub" — basically a hash table lookup, much slower
- Why do the states matter for developers? You can control monomorphic/polymorphic state by controlling object consistency. A function that processes mixed-shape objects will always hit megamorphic state

**Visual — IC States:**

```javascript
// Monomorphic — fast (1-2 cycles)
function getPrice(product) { return product.price }
const a = { id: 1, name: 'A', price: 10 }
const b = { id: 2, name: 'B', price: 20 }
getPrice(a); getPrice(b)  // ← both same shape → IC stays monomorphic ✅

// Megamorphic — slow (50-100 cycles)
function getValue(obj) { return obj.value }
getValue({ value: 1 })
getValue({ x: 1, value: 2 })
getValue({ a: 1, b: 2, value: 3 })
getValue({ name: 'x', value: 4 })
getValue({ type: 'y', value: 5 })
// ← 5 different shapes → megamorphic ❌ → no cache, full lookup every call
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Single utility function handling multiple unrelated object types | Separate specialized functions per type — keep each call site monomorphic |
| Array of mixed object shapes passed to same processing function | Normalize objects to same shape before processing |
| TypeScript `any` — disables type checking and shape consistency hints | Use specific types/interfaces — encourages consistent shape |
| "These shapes are conceptually compatible, performance doesn't matter" | IC state is the most impactful micro-optimization for hot loops |

**🎯 Interview Pattern:**
- **Trigger**: "why is this loop slow" / "inline caching" / "polymorphic call site"
- **Concept**: IC caches property offset per shape; monomorphic=fast, megamorphic=slow
- **Opening**: "Inline caching optimizes property lookups by caching the result — if `product.price` is always accessed on the same-shaped object, V8 caches the property offset and turns the lookup into a direct memory read. The IC has 3 states: monomorphic (one shape, fastest), polymorphic (2-4 shapes, acceptable), megamorphic (5+ shapes, falls back to full hash lookup). You can avoid megamorphic state by ensuring functions receive consistent-shaped objects..."

**🔑 Knowledge Chain:**
- **Prereq**: Hidden Classes, V8 compilation pipeline
- **Enables**: Understanding why TypeScript interfaces improve performance, profiling `%NeverOptimizeFunction`, reading V8 deopt logs

---

## Reference Theory / Tài Liệu Tham Khảo

## Engine Architecture / Kiến Trúc Engine

### Major JavaScript Engines / Các Engine JavaScript Chính

**English:** Different browsers and environments use different JavaScript engines, each with unique optimization strategies.

**Tiếng Việt:** Các trình duyệt và môi trường khác nhau sử dụng các engine JavaScript khác nhau, mỗi cái có chiến lược tối ưu hóa riêng.

#### Engine Comparison / So Sánh Engine

**1. V8 (Google Chrome, Node.js)**
- **Developer**: Google
- **Language**: C++
- **JIT Compiler**: TurboFan
- **Interpreter**: Ignition
- **Features**: 
  - Hidden classes for object optimization
  - Inline caching
  - Generational garbage collection
  - Concurrent marking
  - Parallel compilation

**2. SpiderMonkey (Firefox)**
- **Developer**: Mozilla
- **Language**: C++
- **JIT Compilers**: Baseline, IonMonkey
- **Interpreter**: Bytecode interpreter
- **Features**:
  - Type inference
  - Baseline JIT for quick compilation
  - IonMonkey for aggressive optimization
  - Incremental GC

**3. JavaScriptCore (Safari)**
- **Developer**: Apple
- **Language**: C++
- **JIT Compilers**: LLInt, Baseline, DFG, FTL
- **Features**:
  - Four-tier compilation
  - Low-Level Interpreter (LLInt)
  - Data Flow Graph (DFG) JIT
  - Faster Than Light (FTL) JIT
  - Concurrent JIT compilation

**4. Chakra (Legacy Edge)**
- **Developer**: Microsoft
- **Language**: C++
- **Features**:
  - Background JIT compilation
  - Concurrent garbage collection
  - Now deprecated in favor of V8

---

## Parsing and Compilation / Phân Tích và Biên Dịch

### Source Code to Execution / Từ Source Code đến Thực Thi

**English:** JavaScript engines transform source code through multiple stages before execution.

**Tiếng Việt:** Các engine JavaScript chuyển đổi source code qua nhiều giai đoạn trước khi thực thi.

#### Compilation Pipeline / Pipeline Biên Dịch

**Stage 1: Lexical Analysis (Tokenization)**

**Purpose**: Break source code into tokens

**Process**:
- Scanner reads source code character by character
- Identifies keywords, identifiers, operators, literals
- Creates token stream
- Removes whitespace and comments
- Detects syntax errors early

**Token Types**:
- Keywords: `if`, `function`, `const`
- Identifiers: variable names
- Operators: `+`, `-`, `===`
- Literals: `42`, `"string"`, `true`
- Punctuation: `{`, `}`, `;`

**Stage 2: Syntax Analysis (Parsing)**

**Purpose**: Build Abstract Syntax Tree (AST)

**Process**:
- Parser consumes token stream
- Applies grammar rules
- Builds hierarchical tree structure
- Validates syntax correctness
- Reports syntax errors

**AST Structure**:
- Represents program structure
- Nodes for statements, expressions
- Preserves semantic meaning
- Used for optimization and code generation

**Stage 3: Semantic Analysis**

**Purpose**: Validate program semantics

**Checks**:
- Variable declarations
- Scope resolution
- Type consistency (in TypeScript)
- Reference validation
- Temporal Dead Zone violations

**Stage 4: Bytecode Generation**

**Purpose**: Create intermediate representation

**Characteristics**:
- Platform-independent
- Lower-level than source
- Higher-level than machine code
- Easier to optimize
- Faster to generate than machine code

**Stage 5: Execution**

**Two Approaches**:
1. **Interpretation**: Execute bytecode directly
2. **Compilation**: Convert to machine code first

Modern engines use both (JIT compilation).

---

## Just-In-Time Compilation / Biên Dịch Just-In-Time

### JIT Compilation Theory / Lý Thuyết Biên Dịch JIT

**English:** JIT compilation combines interpretation and compilation, compiling code during execution for optimal performance.

**Tiếng Việt:** Biên dịch JIT kết hợp interpretation và compilation, biên dịch code trong quá trình thực thi để có hiệu suất tối ưu.

#### Why JIT? / Tại Sao JIT?

**Problems with Pure Interpretation**:
- Slow execution
- Repeated interpretation overhead
- No optimization opportunities
- Poor performance for hot code

**Problems with Ahead-of-Time (AOT) Compilation**:
- Long startup time
- Cannot optimize for runtime behavior
- Larger binary size
- Less flexible

**JIT Advantages**:
- Fast startup (interpret first)
- Optimize hot code paths
- Profile-guided optimization
- Adaptive optimization
- Balance between speed and efficiency

#### Multi-Tier Compilation / Biên Dịch Đa Tầng

**Tier 1: Interpreter (Ignition in V8)**

**Characteristics**:
- Executes bytecode directly
- Fast startup
- No compilation overhead
- Collects profiling data
- Identifies hot functions

**When Used**:
- First execution
- Cold code paths
- Short-lived functions
- Startup phase

**Tier 2: Baseline Compiler**

**Characteristics**:
- Quick compilation
- Basic optimizations
- Still collects profiling data
- Better than interpretation
- Fallback from optimized code

**When Used**:
- Warm code (executed multiple times)
- Functions showing promise
- After deoptimization

**Tier 3: Optimizing Compiler (TurboFan in V8)**

**Characteristics**:
- Aggressive optimizations
- Uses profiling data
- Speculative optimization
- Generates highly optimized machine code
- Can deoptimize if assumptions wrong

**When Used**:
- Hot code paths
- Functions executed many times
- Performance-critical code
- After sufficient profiling

#### Optimization Triggers / Kích Hoạt Tối Ưu Hóa

**Factors Determining Optimization**:

1. **Execution Count**: Function called many times
2. **Loop Iterations**: Hot loops
3. **Time Spent**: Significant execution time
4. **Code Size**: Not too large to optimize
5. **Complexity**: Not too complex to analyze

**Heuristics**:
- Function called > 100 times
- Loop iterated > 1000 times
- Execution time > threshold
- Code size < limit

---

## Optimization Techniques / Kỹ Thuật Tối Ưu Hóa

### Compiler Optimizations / Tối Ưu Hóa Compiler

**English:** JavaScript engines employ numerous optimization techniques to improve performance.

**Tiếng Việt:** Các engine JavaScript sử dụng nhiều kỹ thuật tối ưu hóa để cải thiện hiệu suất.

#### 1. Inlining / Nội Tuyến Hóa

**Concept**: Replace function call with function body

**Benefits**:
- Eliminates call overhead
- Enables further optimizations
- Reduces stack operations
- Better instruction cache usage

**Conditions**:
- Small functions
- Called frequently
- Not recursive
- Predictable behavior

**Example**:
```
// Before inlining
function add(a, b) { return a + b; }
let result = add(x, y);

// After inlining
let result = x + y;
```

#### 2. Dead Code Elimination / Loại Bỏ Code Chết

**Concept**: Remove code that never executes or affects output

**Types**:
- Unreachable code
- Unused variables
- Redundant computations
- Constant folding results

**Benefits**:
- Smaller code size
- Faster execution
- Better cache usage

#### 3. Loop Optimizations / Tối Ưu Hóa Vòng Lặp

**Loop Invariant Code Motion**:
- Move calculations outside loop
- Compute once instead of repeatedly
- Reduces loop overhead

**Loop Unrolling**:
- Duplicate loop body
- Reduce iteration overhead
- Better instruction pipelining
- Trade code size for speed

**Loop Fusion**:
- Combine multiple loops
- Reduce iteration overhead
- Better cache locality

#### 4. Escape Analysis / Phân Tích Thoát

**Concept**: Determine if object escapes function scope

**Benefits**:
- Stack allocation instead of heap
- Eliminates garbage collection overhead
- Scalar replacement
- Better performance

**Conditions**:
- Object doesn't escape function
- No references stored elsewhere
- Lifetime limited to function

#### 5. Type Specialization / Chuyên Môn Hóa Kiểu

**Concept**: Generate specialized code for specific types

**Benefits**:
- Eliminates type checks
- Direct operations
- Better performance
- Enables further optimizations

**Example**:
```
// Generic code
function add(a, b) { return a + b; }

// Specialized for numbers
function add_numbers(a, b) {
  // Direct number addition
  return a + b;
}
```

#### 6. Bounds Check Elimination / Loại Bỏ Kiểm Tra Giới Hạn

**Concept**: Remove array bounds checks when provably safe

**Benefits**:
- Faster array access
- Reduced overhead
- Better performance in loops

**Conditions**:
- Index provably in bounds
- Array length known
- No modifications during access

---

## Hidden Classes / Lớp Ẩn

### Shape-Based Optimization / Tối Ưu Hóa Dựa Trên Hình Dạng

**English:** Hidden classes (or shapes/maps) optimize object property access by tracking object structure.

**Tiếng Việt:** Lớp ẩn (hoặc shapes/maps) tối ưu hóa truy cập thuộc tính object bằng cách theo dõi cấu trúc object.

#### How Hidden Classes Work / Cách Lớp Ẩn Hoạt Động

**Concept**:
- Objects with same structure share hidden class
- Hidden class stores property layout
- Fast property access via offset
- Transitions between hidden classes

**Creation Process**:

1. **Initial Hidden Class**: Empty object
2. **Transition**: Add property → new hidden class
3. **Sharing**: Objects with same properties share class
4. **Optimization**: Fast property access

**Example**:
```
// Point1 and Point2 share hidden class
let point1 = { x: 1, y: 2 };
let point2 = { x: 3, y: 4 };

// Point3 has different hidden class (different order)
let point3 = { y: 5, x: 6 };
```

#### Property Access Optimization / Tối Ưu Hóa Truy Cập Thuộc Tính

**Without Hidden Classes**:
- Hash table lookup
- String comparison
- Slow access
- O(n) complexity

**With Hidden Classes**:
- Direct memory offset
- No lookup needed
- Fast access
- O(1) complexity

**Memory Layout**:
```
Hidden Class stores:
- Property names
- Property offsets
- Property attributes
- Transition information
```

#### Best Practices / Thực Hành Tốt Nhất

**1. Initialize All Properties in Constructor**
```
// Good: Same hidden class
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Bad: Different hidden classes
class Point {
  constructor(x, y) {
    this.x = x;
    if (y !== undefined) this.y = y; // Conditional property
  }
}
```

**2. Add Properties in Same Order**
```
// Good: Same hidden class
let p1 = { x: 1, y: 2 };
let p2 = { x: 3, y: 4 };

// Bad: Different hidden classes
let p3 = { y: 5, x: 6 };
```

**3. Avoid Deleting Properties**
```
// Bad: Breaks hidden class
delete obj.property;

// Good: Set to undefined
obj.property = undefined;
```

**4. Avoid Adding Properties After Creation**
```
// Bad: Changes hidden class
let obj = { x: 1 };
obj.y = 2; // Transition to new hidden class

// Good: Initialize all properties
let obj = { x: 1, y: 2 };
```

---

## Inline Caching / Bộ Nhớ Đệm Nội Tuyến

### IC Theory / Lý Thuyết IC

**English:** Inline caching optimizes property access by caching lookup results at call sites.

**Tiếng Việt:** Bộ nhớ đệm nội tuyến tối ưu hóa truy cập thuộc tính bằng cách cache kết quả lookup tại các call sites.

#### How Inline Caching Works / Cách IC Hoạt Động

**Concept**:
- Cache property access results
- Store at call site
- Check cache before lookup
- Update cache on miss

**States of IC**:

**1. Uninitialized**:
- First execution
- No cache yet
- Full lookup required

**2. Monomorphic**:
- One hidden class seen
- Fast path for that class
- Direct offset access
- Optimal performance

**3. Polymorphic**:
- Few hidden classes seen (2-4)
- Check against each
- Still relatively fast
- Small overhead

**4. Megamorphic**:
- Many hidden classes seen (>4)
- Cache ineffective
- Falls back to lookup
- Poor performance

#### Performance Implications / Ảnh Hưởng Hiệu Suất

**Monomorphic (Best)**:
- Single type check
- Direct access
- ~1-2 CPU cycles
- Optimal

**Polymorphic (Good)**:
- Multiple type checks
- Still cached
- ~5-10 CPU cycles
- Acceptable

**Megamorphic (Poor)**:
- Full lookup
- No caching benefit
- ~50-100 CPU cycles
- Avoid if possible

#### Optimization Strategies / Chiến Lược Tối Ưu Hóa

**1. Keep Functions Monomorphic**
```
// Good: Always receives same type
function processPoint(point) {
  return point.x + point.y;
}

let p1 = { x: 1, y: 2 };
let p2 = { x: 3, y: 4 };
processPoint(p1);
processPoint(p2); // Same hidden class
```

**2. Avoid Mixed Types**
```
// Bad: Polymorphic
function process(obj) {
  return obj.value;
}

process({ value: 1 });
process({ value: 2, extra: 3 }); // Different hidden class
```

**3. Use Type-Specific Functions**
```
// Good: Separate functions for different types
function processNumber(n) { return n * 2; }
function processString(s) { return s.toUpperCase(); }

// Bad: Single polymorphic function
function process(x) {
  if (typeof x === 'number') return x * 2;
  if (typeof x === 'string') return x.toUpperCase();
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: What is JIT compilation? Why does JavaScript use it instead of interpreting everything or compiling ahead of time? / Tại sao JS dùng JIT thay vì AOT hay pure interpretation?

**A:** JIT (Just-In-Time) compilation is a hybrid: start by interpreting (fast startup, no warm-up), then compile hot paths to native machine code at runtime (fast execution for critical code).

**Why not pure interpretation?** Every bytecode instruction is re-decoded and dispatched each time. Tight loops (1M iterations) mean 1M dispatches. Machine code executes the same loop in 10-100x fewer cycles.

**Why not AOT (Ahead-of-Time)?** JS is dynamically typed — types aren't known until runtime. An AOT compiler can't generate type-specific fast paths without type annotations (that's what TypeScript does). Also, AOT would block page load while compiling.

**V8's multi-tier approach:**
- **Ignition** (interpreter): runs all code immediately, no warm-up, low memory, collects type feedback
- **TurboFan** (JIT): kicks in for "hot" functions (called ~1000+ times), uses Ignition's feedback to generate type-specialized native code
- **Deoptimization**: if TurboFan's type assumptions are violated (you call an int-specialized function with a string), V8 abandons the compiled code and falls back to Ignition

**Tiếng Việt:** JIT = bắt đầu interpret (startup nhanh) → compile hot paths sau (execution nhanh). V8: Ignition interpret tất cả + collect type feedback → TurboFan compile hot functions với type assumptions → deoptimize nếu assumptions sai. Không dùng AOT vì JS dynamically typed — không biết types trước khi chạy.

💡 **Interview Signal:**
- ✅ Strong: Explains the startup vs throughput trade-off; names Ignition + TurboFan and their roles; explains deoptimization trigger
- ❌ Weak: "JIT compiles JavaScript to machine code" — true but misses why (the trade-off), when (hot paths only), and what happens when it fails (deopt)

---

### 🔴 [Senior] Q2: Explain hidden classes. Why does property insertion order affect performance? / Tại sao thứ tự thêm property ảnh hưởng performance?

**A:** V8 creates an internal "hidden class" (also called shape or map) for each distinct object layout. Objects with the same properties added in the same order share a hidden class. Property access on a monomorphic hidden class is a direct memory offset: `obj.price` becomes "read 8 bytes from address X" — one CPU instruction.

If properties are added in different orders across objects, V8 creates separate hidden class chains. Accessing properties on objects with different shapes becomes polymorphic or megamorphic (hash table lookup) — 10-100x slower.

**Why property order matters:**
```javascript
// Different orders → different hidden classes
const p1 = {}; p1.id = 1; p1.price = 10   // Shape: {} → id → price
const p2 = {}; p2.price = 20; p2.id = 2   // Shape: {} → price → id  ← DIFFERENT
// A function processing [p1, p2] hits polymorphic IC ← slower

// Fix: consistent construction
function make(id, price) { return { id, price } }  // always same order ✅
```

**`delete` is especially harmful:** It invalidates the hidden class entirely and pushes the object to "slow mode" (dictionary), where all property accesses become hash lookups.

**Best practices:** Initialize all properties in the constructor/factory, in the same order, always. Use `null` for absent optional properties instead of omitting them.

**Tiếng Việt:** Hidden class = blueprint nội bộ của V8 cho layout của object. Same layout = same hidden class = property access O(1) direct offset. Khác thứ tự = khác hidden class = slow dictionary lookup. `delete` đặc biệt tệ — push object sang "slow mode". Fix: luôn khởi tạo tất cả properties cùng thứ tự trong constructor.

💡 **Interview Signal:**
- ✅ Strong: Explains hidden class sharing condition (same order); explains what "direct offset" means; mentions `delete` pushing to slow mode; gives factory function solution
- ❌ Weak: "Use hidden classes for fast property access" — backwards (developer doesn't use them; V8 creates them based on developer's code patterns)

---

### 🔴 [Senior] Q3: What is inline caching? When does a function become megamorphic and what's the performance impact? / IC là gì? Megamorphic ảnh hưởng performance thế nào?

**A:** Inline Caching (IC) is V8's mechanism to cache the result of a property lookup per call site. When `getPrice(product)` accesses `product.price`, V8 caches: "at this call site, objects have hidden class X, and `price` is at offset 16."

**IC states:**
| State | Condition | Speed | Cached? |
|---|---|---|---|
| Uninitialized | First call | Slow (full lookup) | No |
| Monomorphic | 1 hidden class seen | Fast (1-2 cycles) | Yes |
| Polymorphic | 2-4 classes seen | OK (5-10 cycles) | Inline list |
| Megamorphic | 5+ classes seen | Slow (50-100 cycles) | No — global stub |

**Why megamorphic is bad:** V8 gives up caching entirely for that call site — every call does a full property lookup through the prototype chain.

```javascript
// Megamorphic call site — worst case
function render(item) { return item.name }  // ← this IC site will go megamorphic
render({ name: 'A' })                         // shape 1
render({ id: 1, name: 'B' })                  // shape 2
render({ id: 1, type: 'x', name: 'C' })       // shape 3
render({ id: 1, type: 'x', tag: 'y', name: 'D' })  // shape 4
render({ id: 1, type: 'x', tag: 'y', src: 'z', name: 'E' })  // shape 5 → megamorphic!

// Fix: normalize input shapes, or use separate specialized functions per type
function renderProduct(p) { return p.name }
function renderCategory(c) { return c.name }
```

**Tiếng Việt:** IC cache kết quả lookup "property X ở offset Y cho shape Z" tại mỗi call site. Monomorphic (1 shape) = nhanh nhất. Megamorphic (5+ shapes) = V8 bỏ cache — full lookup mỗi lần. Fix: normalize object shapes hoặc tách separate functions per type để mỗi call site chỉ thấy 1-4 shapes.

💡 **Interview Signal:**
- ✅ Strong: Explains IC as call-site-specific cache; names all 4 states with cycle counts; explains why megamorphic disables the cache; gives practical code fix
- ❌ Weak: "Monomorphic is faster than polymorphic" — true but doesn't explain the mechanism or the 5+ threshold for megamorphic

---

### 🔴 [Senior] Q4: You notice a React component's render function is slow. V8 logs show frequent deoptimizations. What are the common causes and how do you fix them? / Xử lý deoptimization trong React render?

**A:** V8 deoptimizes a function when its compiled assumptions are violated. Common causes in React:

**1. Mixed object shapes in arrays:**
```javascript
// Items array with inconsistent shapes → megamorphic renders
const items = [
  { id: 1, name: 'A', price: 10 },
  { id: 2, price: 20 },              // ← missing name!
  { id: 3, name: 'C', discount: 5 }  // ← extra field
]
// Fix: normalize at API boundary
const normalized = raw.map(item => ({
  id: item.id, name: item.name ?? null, price: item.price, discount: item.discount ?? null
}))
```

**2. `try/catch` inside render loops:**
```javascript
// TurboFan won't optimize functions containing try/catch
items.forEach(item => {
  try { render(item) } catch(e) { }  // ← wrap at loop level blocks optimization
})
// Fix: extract the try/catch outside the hot loop
try { items.forEach(render) } catch(e) { }
```

**3. Changing prop types between renders:**
```javascript
// React: <Component count={isLoaded ? items.length : null} />
// Type changes number → null → deopt
// Fix: <Component count={isLoaded ? items.length : 0} />  (consistent type)
```

**Diagnosis:** Enable V8 deopt logging:
```bash
node --trace-deopt --trace-opt app.js 2>&1 | grep -E "deopt|optimiz"
```

**Tiếng Việt:** Deoptimization xảy ra khi TurboFan's type assumptions bị vi phạm. Nguyên nhân phổ biến trong React: (1) array với mixed-shape objects → megamorphic render, (2) `try/catch` trong hot loops ngăn optimization, (3) prop type thay đổi giữa các render. Fix: normalize shapes ở API boundary, `try/catch` ở outer level, giữ consistent prop types.

💡 **Interview Signal:**
- ✅ Strong: Identifies mixed shapes as primary cause; mentions try/catch optimization barrier; knows `--trace-deopt` flag exists; gives concrete normalization pattern
- ❌ Weak: "Use React.memo to prevent rerenders" — that's a different optimization entirely; misses V8-level deopt diagnosis

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Key Insight |
|---|-------|-------------|
| Q1 | JIT compilation | Interpret cold → TurboFan hot → deopt on type violation; startup vs throughput trade-off |
| Q2 | Hidden classes | Same property order = shared shape = O(1) offset; `delete` → slow mode |
| Q3 | Inline caching | Monomorphic fast, megamorphic = no cache; 5+ shapes = give up IC |
| Q4 | Deoptimization in React | Mixed shapes + try/catch in loops + changing prop types = deopt |

---

## ⚡ Cold Call Simulation

**Q: "Why should you initialize all object properties in the constructor even if some are initially null?"**

**30-second answer:**
"V8 creates a hidden class representing the object's shape — the set of properties and their layout in memory. If you initialize properties in different order or add them conditionally, V8 creates different hidden classes for what should be the same object type. Property access on consistent-shape objects is a direct memory offset lookup — extremely fast. With inconsistent shapes, V8 falls back to a hash table lookup. Initializing all properties upfront in the same order ensures all instances of an object share the same hidden class, giving V8 the most optimization opportunities."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**
1. What are V8's two main compilation components? What does each do?
2. When does TurboFan deoptimize a function? What happens after?
3. What condition must be true for two objects to share a hidden class?
4. What are the 4 IC states? At what threshold does megamorphic occur?
5. Why does `delete obj.property` hurt performance more than `obj.property = null`?

**Visual:**
- Sketch the V8 compilation pipeline: source → Ignition → TurboFan → deopt path
- Draw IC state transitions: Uninitialized → Monomorphic → Polymorphic → Megamorphic. What triggers each transition?

**Application:**
- You have a `processItem(item)` function called with 6 different object shapes. How do you fix the megamorphic IC problem?
- A React component renders 10,000 rows with `{ id, name?, price, discount? }` where some fields are sometimes absent. How do you optimize?

**Debug:**
- V8 deopt log shows `processOrder` is deoptimized with reason "insufficient type feedback". What does this mean? How do you investigate?

**Teach:**
- Explain hidden classes to a junior: "Imagine V8 as a warehouse manager. Consistent-shape objects are stored in labeled shelves — manager knows exactly where item X is. Mixed-shape objects go into 'random pile' — manager must search every time."

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: hidden class conditions (same property order), IC states + thresholds, deopt triggers.

---

## Connections / Liên Kết

- **Prereqs**: [15-memory-management-advanced.md](./15-memory-management-advanced.md) (V8 GC, generational collection), [13-javascript-basics-theory.md](./13-javascript-basics-theory.md) (execution context)
- **See also**: [20-module-systems-theory.md](./20-module-systems-theory.md), [22-modern-javascript-features.md](./22-modern-javascript-features.md)
- **Performance**: Engine internals connect to [06-browser-performance/05-rendering-optimization-theory.md](../06-browser-performance/05-rendering-optimization-theory.md) — JS task duration is determined by whether V8 can JIT-optimize the hot path

---

[← Previous: Module Systems](./20-module-systems-theory.md) | [Next: Modern JavaScript Features →](./22-modern-javascript-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
