# JavaScript Language Theory
## Theoretical Foundations of JavaScript

**English:** JavaScript language theory explores the formal semantics, type systems, and computational models underlying JavaScript, providing deep understanding of language behavior, optimization opportunities, and design patterns.

**Tiếng Việt:** Lý thuyết ngôn ngữ JavaScript khám phá ngữ nghĩa hình thức, hệ thống kiểu và các mô hình tính toán làm nền tảng cho JavaScript, cung cấp hiểu biết sâu sắc về hành vi ngôn ngữ, cơ hội tối ưu hóa và các mẫu thiết kế.

## Table of Contents
1. [Formal Semantics of JavaScript](#formal-semantics-of-javascript)
2. [Type Theory in JavaScript](#type-theory-in-javascript)
3. [Execution Model](#execution-model)
4. [Scope and Closure Theory](#scope-and-closure-theory)
5. [Prototype Chain Theory](#prototype-chain-theory)
6. [Asynchronous Computation Model](#asynchronous-computation-model)
7. [Memory Model](#memory-model)
8. [Optimization Theory](#optimization-theory)
9. [Language Design Principles](#language-design-principles)
10. [Formal Verification of JavaScript](#formal-verification-of-javascript)

## Formal Semantics of JavaScript

### Operational Semantics

**Small-Step Semantics:**
Defines how program state transitions one step at a time.

**State:**
σ = (heap, stack, environment)

**Transition Relation:**
⟨e, σ⟩ → ⟨e', σ'⟩

Expression e in state σ transitions to e' in state σ'.

**Example - Variable Assignment:**
```
⟨x = v, σ⟩ → ⟨v, σ[x ↦ v]⟩
```

**Evaluation Contexts:**
E ::= [] | E + e | v + E | E.f | ...

**Context Rule:**
```
⟨e, σ⟩ → ⟨e', σ'⟩
─────────────────────
⟨E[e], σ⟩ → ⟨E[e'], σ'⟩
```

### Denotational Semantics

**Meaning Function:**
⟦·⟧: Expression → Environment → Value

**Compositional:**
Meaning of compound expression defined in terms of subexpressions.

**Example - Addition:**
⟦e₁ + e₂⟧ρ = ⟦e₁⟧ρ + ⟦e₂⟧ρ

**Function Application:**
⟦f(e)⟧ρ = apply(⟦f⟧ρ, ⟦e⟧ρ)

**Challenges:**
- Side effects
- Exceptions
- Asynchronous operations

**Monadic Semantics:**
Use monads to handle effects.

### Axiomatic Semantics

**Hoare Logic for JavaScript:**
{P} C {Q}

**Assignment:**
{Q[x ← E]} x = E {Q}

**Sequence:**
```
{P} C₁ {R}    {R} C₂ {Q}
──────────────────────────
{P} C₁; C₂ {Q}
```

**Function Call:**
Requires specification of function behavior.

**Challenges:**
- Dynamic typing
- Prototype mutation
- Global state

## Type Theory in JavaScript

### Dynamic Type System

**Runtime Type Checking:**
Types checked during execution, not compilation.

**Type Coercion:**
Implicit conversion between types.

**Coercion Rules:**
- String + Number → String concatenation
- Number + Boolean → Numeric addition
- Comparison operators trigger coercion

**Abstract Operations:**
- ToPrimitive(input, hint)
- ToNumber(argument)
- ToString(argument)
- ToBoolean(argument)

**Type Lattice:**
```
        Any
       /   \
   Object  Primitive
    / \      / | \
  ...  ... Num Str Bool ...
```

### Gradual Typing

**TypeScript Type System:**
Optional static types with gradual guarantees.

**Type Inference:**
Infer types from usage patterns.

**Structural Typing:**
Compatibility based on structure, not names.

**Subtyping:**
```
interface A { x: number }
interface B { x: number, y: string }
```
B <: A (B is subtype of A)

**Soundness:**
TypeScript is not sound - runtime types may differ from static types.

**Any Type:**
Escape hatch from type system.

### Flow Analysis

**Control Flow Analysis:**
Track types through program flow.

**Refinement Types:**
```
function f(x: string | number) {
  if (typeof x === "string") {
    // x: string here
  } else {
    // x: number here
  }
}
```

**Narrowing:**
- typeof guards
- instanceof checks
- Truthiness checks
- Equality checks

**Union and Intersection Types:**
- Union: A | B (either A or B)
- Intersection: A & B (both A and B)

## Execution Model

### Event Loop Theory

**Call Stack:**
LIFO structure for function calls.

**Task Queue:**
FIFO queue for callbacks.

**Microtask Queue:**
Higher priority queue for promises.

**Event Loop Algorithm:**
```
while (true) {
  if (call_stack.empty()) {
    if (!microtask_queue.empty()) {
      task = microtask_queue.dequeue()
      execute(task)
    } else if (!task_queue.empty()) {
      task = task_queue.dequeue()
      execute(task)
    }
  }
}
```

**Execution Phases:**
1. Execute synchronous code
2. Process all microtasks
3. Render (in browser)
4. Process one macrotask
5. Repeat

**Starvation:**
Microtasks can starve macrotasks.

### Concurrency Model

**Run-to-Completion:**
Each task runs to completion before next task.

**No Shared Memory:**
No threads sharing memory (in single-threaded JS).

**Message Passing:**
Communication via events and callbacks.

**Happens-Before Relation:**
- Synchronous code: program order
- Async: callback order
- Promises: then chain order

**Memory Consistency:**
Sequential consistency within single thread.

### Web Workers

**Parallel Execution:**
True parallelism via separate threads.

**Shared Nothing:**
No shared memory between workers.

**Message Passing:**
postMessage/onmessage for communication.

**Structured Clone:**
Deep copy of data for messages.

**Transferable Objects:**
Transfer ownership without copying.

## Scope and Closure Theory

### Lexical Scoping

**Static Scope:**
Scope determined by source code structure.

**Scope Chain:**
Nested environments forming chain.

**Environment:**
Mapping from identifiers to values.

**Lookup Algorithm:**
```
lookup(x, env):
  if x ∈ env:
    return env[x]
  else if env.parent:
    return lookup(x, env.parent)
  else:
    throw ReferenceError
```

**Block Scoping:**
let/const create block-level bindings.

**Temporal Dead Zone:**
Variables not accessible before declaration.

### Closure Theory

**Mathematical Definition:**
Closure is pair (λx.e, ρ) where:
- λx.e: Lambda abstraction
- ρ: Environment capturing free variables

**Free Variables:**
Variables not bound in function body.

**Closure Conversion:**
Transform to make environment explicit.

**Example:**
```
function outer(x) {
  return function inner(y) {
    return x + y;
  }
}
```

Closure captures x from outer's environment.

**Closure Properties:**
- First-class values
- Persistent environment
- Lexical scope

**Applications:**
- Data hiding
- Partial application
- Module pattern
- Callbacks

### Hoisting Theory

**Variable Hoisting:**
Declarations moved to top of scope.

**Two-Phase Processing:**
1. Creation phase: Allocate bindings
2. Execution phase: Assign values

**var Hoisting:**
```
// Source
console.log(x); // undefined
var x = 5;

// Equivalent
var x;
console.log(x);
x = 5;
```

**Function Hoisting:**
Function declarations hoisted with body.

**let/const:**
Hoisted but in TDZ until declaration.

## Prototype Chain Theory

### Prototype Delegation

**Prototype Chain:**
Linked list of objects for property lookup.

**[[Prototype]] Internal Slot:**
Hidden link to prototype object.

**Lookup Algorithm:**
```
getProperty(obj, prop):
  if prop ∈ obj:
    return obj[prop]
  else if obj.[[Prototype]]:
    return getProperty(obj.[[Prototype]], prop)
  else:
    return undefined
```

**Delegation vs. Inheritance:**
JavaScript uses delegation, not classical inheritance.

**Dynamic Dispatch:**
Method resolution at runtime via prototype chain.

### Constructor Functions

**new Operator Semantics:**
```
new F(args):
  obj = Object.create(F.prototype)
  result = F.apply(obj, args)
  return (typeof result === 'object') ? result : obj
```

**Constructor Property:**
F.prototype.constructor === F

**instanceof Operator:**
```
obj instanceof F:
  proto = obj.[[Prototype]]
  while (proto !== null):
    if proto === F.prototype:
      return true
    proto = proto.[[Prototype]]
  return false
```

### Class Syntax

**Syntactic Sugar:**
Classes are functions with prototype.

**Desugaring:**
```
class C extends P {
  constructor(x) { super(x); }
  method() { }
}

// Roughly equivalent to:
function C(x) { P.call(this, x); }
C.prototype = Object.create(P.prototype);
C.prototype.constructor = C;
C.prototype.method = function() { };
```

**Super Keyword:**
Accesses parent prototype methods.

**Static Methods:**
Properties on constructor function itself.

## Asynchronous Computation Model

### Callback Theory

**Continuation-Passing Style:**
Pass continuation (callback) as argument.

**CPS Transform:**
```
// Direct style
function f(x) { return x + 1; }

// CPS
function f_cps(x, k) { k(x + 1); }
```

**Callback Hell:**
Nested callbacks reduce readability.

**Inversion of Control:**
Caller loses control to callee.

### Promise Theory

**Promise States:**
- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

**State Transitions:**
```
Pending → Fulfilled
Pending → Rejected
```

Once settled, state is immutable.

**Promise Laws:**
1. **Left identity:** Promise.resolve(x).then(f) ≡ f(x)
2. **Right identity:** p.then(Promise.resolve) ≡ p
3. **Associativity:** p.then(f).then(g) ≡ p.then(x => f(x).then(g))

**Monad Structure:**
Promises form a monad:
- return: Promise.resolve
- bind: then

**Thenable:**
Object with then method (duck typing).

**Promise Resolution:**
Recursive unwrapping of thenables.

### Async/Await Theory

**Syntactic Sugar:**
async/await is syntactic sugar for promises.

**Desugaring:**
```
async function f() {
  const x = await p;
  return x + 1;
}

// Roughly equivalent to:
function f() {
  return p.then(x => x + 1);
}
```

**State Machine:**
Async functions compiled to state machines.

**Suspension Points:**
await expressions are suspension points.

**Resumption:**
Promise resolution resumes execution.

**Error Handling:**
try/catch works with async/await.

## Memory Model

### Heap Structure

**Object Representation:**
Objects stored as property maps.

**Hidden Classes:**
V8 uses hidden classes for optimization.

**Inline Caching:**
Cache property access based on hidden class.

**Property Storage:**
- In-object properties: Fast access
- Out-of-object properties: Slower, in separate array

**Arrays:**
- Dense arrays: Contiguous storage
- Sparse arrays: Hash table storage
- Holey arrays: Arrays with holes

### Garbage Collection

**Generational Hypothesis:**
Most objects die young.

**Generational GC:**
- Young generation: Frequent, fast collection
- Old generation: Infrequent, thorough collection

**Mark-and-Sweep:**
1. Mark reachable objects
2. Sweep unreachable objects

**Tri-Color Marking:**
- White: Not visited
- Gray: Visited, children not processed
- Black: Visited, children processed

**Incremental GC:**
Interleave marking with execution.

**Concurrent GC:**
Mark in parallel with execution.

**Write Barriers:**
Track old-to-young pointers.

### Memory Leaks

**Common Causes:**
- Forgotten timers
- Closures capturing large objects
- Detached DOM nodes
- Global variables

**Reference Counting:**
Not used in modern JS (circular references).

**Weak References:**
WeakMap/WeakSet allow garbage collection.

## Optimization Theory

### Just-In-Time Compilation

**Interpretation:**
Execute bytecode directly.

**Baseline Compiler:**
Quick compilation to machine code.

**Optimizing Compiler:**
Aggressive optimization for hot code.

**Tiered Compilation:**
1. Interpret
2. Baseline compile
3. Optimize hot functions

**Deoptimization:**
Fall back when assumptions violated.

### Type Specialization

**Monomorphic:**
Single type at call site.

**Polymorphic:**
Few types at call site.

**Megamorphic:**
Many types at call site.

**Inline Caching:**
Cache based on types seen.

**Speculative Optimization:**
Assume types, deoptimize if wrong.

### Inlining

**Function Inlining:**
Replace call with function body.

**Benefits:**
- Eliminate call overhead
- Enable further optimizations
- Improve locality

**Heuristics:**
- Function size
- Call frequency
- Polymorphism

**Deoptimization:**
If inlined function changes, deoptimize.

### Escape Analysis

**Definition:**
Determine if object escapes function.

**Stack Allocation:**
Allocate non-escaping objects on stack.

**Scalar Replacement:**
Replace object with individual variables.

**Benefits:**
- Reduce GC pressure
- Improve cache locality
- Enable further optimizations

## Language Design Principles

### First-Class Functions

**Functions as Values:**
Can be passed, returned, stored.

**Higher-Order Functions:**
Functions taking/returning functions.

**Theoretical Foundation:**
Lambda calculus.

**Benefits:**
- Abstraction
- Composition
- Modularity

### Dynamic Typing

**Flexibility:**
No type annotations required.

**Duck Typing:**
"If it walks like a duck..."

**Trade-offs:**
- Flexibility vs. safety
- Expressiveness vs. performance
- Development speed vs. maintenance

**Gradual Typing:**
Optional static types (TypeScript).

### Prototype-Based OOP

**Delegation:**
Objects delegate to prototypes.

**Flexibility:**
Modify prototypes at runtime.

**Comparison to Classes:**
- More flexible
- Less structured
- Different mental model

**Theoretical Foundation:**
Self language.

### Asynchronous by Default

**Non-Blocking I/O:**
Don't wait for I/O operations.

**Event-Driven:**
React to events.

**Single-Threaded:**
Avoid concurrency issues.

**Trade-offs:**
- Complexity of async code
- Callback hell
- Promises/async-await help

## Formal Verification of JavaScript

### Static Analysis

**Abstract Interpretation:**
Over-approximate program behavior.

**Type Inference:**
Infer types from usage.

**Flow Analysis:**
Track data flow through program.

**Tools:**
- Flow
- TypeScript
- ESLint

### Model Checking

**State Space Exploration:**
Explore all possible executions.

**Challenges:**
- Infinite state space
- Dynamic features
- Asynchronous execution

**Abstraction:**
Reduce state space via abstraction.

### Theorem Proving

**Mechanized Semantics:**
Formal semantics in proof assistant.

**Verified Compiler:**
Prove compiler correctness.

**Examples:**
- JSCert: Coq formalization
- KJS: K framework semantics

### Testing and Verification

**Property-Based Testing:**
Generate test cases from properties.

**Symbolic Execution:**
Execute with symbolic values.

**Concolic Testing:**
Combine concrete and symbolic execution.

**Tools:**
- QuickCheck
- JSVerify
- Jalangi

## Interview Questions

**Q: Explain JavaScript's execution model and event loop.**

A: JavaScript uses a single-threaded event loop with call stack, task queue, and microtask queue. Synchronous code executes on call stack. When stack is empty, event loop processes microtasks (promises) first, then one macrotask (setTimeout, I/O). This provides run-to-completion semantics - each task runs completely before next. Microtasks can starve macrotasks. This model avoids race conditions but requires non-blocking I/O.

**Q: How do closures work in JavaScript from a theoretical perspective?**

A: Closures are pairs (λx.e, ρ) of function and captured environment. When function is created, it captures free variables from enclosing scope. Lookup follows scope chain through nested environments. This implements lexical scoping - scope determined by source structure, not call stack. Closures enable data hiding, partial application, and callbacks. They're first-class values with persistent environments.

**Q: Explain prototype delegation vs. classical inheritance.**

A: JavaScript uses prototype delegation, not classical inheritance. Objects have [[Prototype]] link forming chain. Property lookup traverses chain until found or null. This is delegation - object delegates to prototype. Classical inheritance copies behavior to subclass. Delegation is more flexible (runtime modification) but less structured. instanceof checks prototype chain. Classes are syntactic sugar over prototypes.

**Q: How do promises form a monad?**

A: Promises satisfy monad laws with return = Promise.resolve and bind = then. Laws: (1) Left identity: Promise.resolve(x).then(f) ≡ f(x), (2) Right identity: p.then(Promise.resolve) ≡ p, (3) Associativity: p.then(f).then(g) ≡ p.then(x => f(x).then(g)). This provides composable asynchronous computation. Async/await is syntactic sugar for monadic operations. Promise resolution recursively unwraps thenables.

**Q: Explain JavaScript's memory model and garbage collection.**

A: JavaScript uses generational garbage collection based on generational hypothesis (most objects die young). Young generation has frequent, fast collection (Scavenging). Old generation has infrequent, thorough collection (Mark-and-Sweep). Modern engines use tri-color marking, incremental GC (interleave with execution), and concurrent GC (parallel marking). Write barriers track old-to-young pointers. No reference counting (circular references). WeakMap/WeakSet allow garbage collection of keys.

---

[← Back to Complexity Theory](../16-theoretical-foundations/09-complexity-theory-advanced.md) | [Next: Browser Architecture Theory →](./02-browser-architecture-theory.md)
