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

