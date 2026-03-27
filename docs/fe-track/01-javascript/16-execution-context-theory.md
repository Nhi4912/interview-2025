# JavaScript Execution Context - Advanced Theory / Ngữ Cảnh Thực Thi JavaScript - Lý Thuyết Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**React class component bug:** `this.handleClick` passed as prop to child button. Click → `TypeError: Cannot read properties of undefined (reading 'setState')`. Root cause: `this` binding is determined at _call site_, not _definition site_. When child calls `onClick()` without an object, `this` is `undefined` (strict mode) or `window` (sloppy). Fix: `this.handleClick = this.handleClick.bind(this)` in constructor, or use arrow function property.

**Bài học:** `this` là tính năng JavaScript được hỏi nhiều nhất trong phỏng vấn Senior vì nó liên quan trực tiếp đến bugs phổ biến nhất trong React class components và event handlers. Biết 5 binding rules và priority order là yêu cầu tối thiểu.

## What & Why / Cái Gì & Tại Sao

**Scope và this — hai khái niệm bị nhầm lẫn:** Scope được quyết định bởi _where code is written_ (lexical). `this` được quyết định bởi _how function is called_ (dynamic). Arrow functions break this pattern by capturing `this` lexically — they solve the "lost this" problem.

**Scope của doc này:** Deep dive vào `this` binding rules và Execution Context lifecycle. Scope/hoisting basics → xem [02-scope-hoisting-comprehensive.md](./02-scope-hoisting-comprehensive.md). Creation Phase → xem [13-javascript-basics-theory.md](./13-javascript-basics-theory.md).

## Concept Map / Bản Đồ Khái Niệm

```
[Execution Context]
        │
        ├── Components: LexicalEnvironment + VariableEnvironment + ThisBinding
        │
        ├── Call Stack (LIFO)
        │       Global Context → Function Context → ... → stack overflow
        │
        ├── This Binding — 5 Rules (priority: new > explicit > implicit > default)
        │       1. Default: fn() → undefined (strict) or globalThis (sloppy)
        │       2. Implicit: obj.fn() → obj
        │       3. Explicit: fn.call(ctx) / fn.apply(ctx) / fn.bind(ctx) → ctx
        │       4. New: new Fn() → newly created object
        │       5. Arrow: no own 'this' → captures enclosing context lexically
        │
        └── Scope vs Context
                Scope (lexical, write-time): which variables can be accessed
                Context (dynamic, runtime): what 'this' refers to in this call
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. The 5 `this` Binding Rules

**🧠 Memory Hook:** "**DIEN-A: Default, Implicit, Explicit, New, Arrow — in REVERSE order of priority**"

**Why does this exist? / Tại sao tồn tại?**

- Why is `this` dynamic (determined at call time) instead of lexical? Because `this` models the _receiver_ of a method call — `obj.method()` should let `method` refer to `obj`. The same function `fn` should work when called as `a.fn()` (this=a) and `b.fn()` (this=b) without modification
- Why did arrow functions change this? Because inner callbacks lost `this` binding — `function onSuccess() { this.setState(...) }` inside `fetch().then()` would lose `this`. Arrow functions capture `this` lexically from their enclosing context, solving this problem
- Why does the `new` binding have highest priority? Because `new` explicitly creates a new object to be the receiver — overriding any implicit or explicit binding makes no sense when constructing

**Visual — 5 Rules with Priority:**

```javascript
// 1. Default (lowest priority): no explicit receiver
function greet() { console.log(this) }
greet()           // undefined (strict mode) | globalThis (sloppy)

// 2. Implicit: object before the dot is `this`
const obj = { name: 'Buu', greet() { console.log(this.name) } }
obj.greet()       // 'Buu'

// PITFALL: lost this — detaching method from object
const fn = obj.greet
fn()              // undefined — no object before the dot!

// 3. Explicit: call/apply/bind
function greet() { console.log(this.name) }
greet.call({ name: 'An' })      // 'An'
greet.apply({ name: 'Binh' })   // 'Binh'
const bound = greet.bind({ name: 'Cuong' })
bound()                         // 'Cuong' (permanently bound)

// 4. New (highest non-arrow priority): creates new object
function Person(name) { this.name = name }
const p = new Person('Dung')   // p.name === 'Dung'

// 5. Arrow: lexical this (captures from definition context)
class Timer {
  start() {
    setInterval(() => {
      console.log(this)  // ← 'this' from start()'s context = Timer instance
    }, 1000)
  }
}

Priority: new > explicit (.bind wins over .call) > implicit > default
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `const fn = obj.method; fn()` expecting `this === obj` | Detaching a method drops the implicit binding — called without an object context, `this` is `undefined`/global | Use `const fn = obj.method.bind(obj)` to preserve binding |
| Using `function` in `forEach`/`map` callback and expecting outer `this` | Regular function creates its own `this` binding at call time — loses outer context | Use arrow function: `array.forEach(item => this.process(item))` |
| `fn.bind(ctx)` in render method creates new function every render | New function reference each render breaks `React.memo` and `shouldComponentUpdate` equality checks | Bind in constructor or use arrow function property |
| Arrow function as object method: `const obj = { fn: () => { this... } }` | Arrow captures `this` from the scope where it's defined — module scope (globalThis/undefined), not from `obj` | Use regular `function` for methods that need `this` to refer to the object |

**🎯 Interview Pattern:**

- **Trigger**: "what is `this`" / "why is `this` undefined" / "React class component binding"
- **Concept**: 5 binding rules, lost-this pitfall, arrow function solution
- **Opening**: "There are 5 `this` binding rules in priority order: new > explicit (.bind/.call/.apply) > implicit (object method) > default (global/undefined). The most common bug is 'lost this' — detaching a method from its object drops the implicit binding. Arrow functions solve this by capturing `this` lexically..."

**🔑 Knowledge Chain:**

- **Prereq**: Functions as first-class values, objects, `new` keyword
- **Enables**: React class components, event handlers, method chaining patterns, understanding `bind` overhead

---

### 2. Scope vs Context — The Most Confused Distinction

**🧠 Memory Hook:** "**Scope = WHERE you wrote the code (lexical). Context = HOW you called the function (runtime). Arrow functions make `this` lexical too.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is scope lexical while `this` is dynamic? They model different things. Scope models variable resolution (static analysis can determine this). `this` models method dispatch (depends on runtime call pattern)
- Why does this distinction matter for closures? A closure captures scope (variables from enclosing lexical environment) but NOT context (`this` from the enclosing call). Arrow functions are the exception — they capture both scope AND `this`
- Why is this confusion so common? In many OOP languages, scope and context are unified — `this` is always the enclosing class. JavaScript's separation is unusual and catches developers from other languages by surprise

**Visual — Scope vs Context Interaction:**

```javascript
const value = "global";

const obj = {
  value: "obj",
  getValueByScope() {
    // Closure: captures 'value' variable from lexical scope
    const inner = function () {
      return value;
    }; // ← 'global' (scope lookup)
    return inner();
  },
  getValueByContext() {
    // this: depends on how getValueByContext is called
    return this.value; // ← 'obj' if called as obj.getValueByContext()
  },
};

// Scope is fixed (lexical):
const detached = obj.getValueByScope;
detached(); // still returns 'global' — scope doesn't change

// Context changes:
detached2 = obj.getValueByContext;
detached2(); // 'global' — this context changed!
obj.getValueByContext(); // 'obj' — this context = obj

// Arrow functions unify scope and this:
const obj2 = {
  value: "obj2",
  outer() {
    const inner = () => this.value; // ← 'obj2' (captures both scope AND this)
    return inner();
  },
};
obj2.outer(); // 'obj2'
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Closure captures `this`" | `this` is not a variable in scope — closures capture scope variables, not `this` | Use arrow function to capture `this` lexically (arrows close over `this` as a value) |
| Arrow function as a class method to capture `this` | Arrow property methods exist on each instance, not on the prototype — can't be overridden | Works for React event handlers; be aware it's not on the prototype |
| `const { method } = obj; method()` expecting obj's `this` | Destructuring detaches from object — implicit binding is lost at call time | Call as `obj.method()` or bind: `const method = obj.method.bind(obj)` |
| "Scope and context are the same thing" | Scope = variable resolution (lexical, write-time); context = `this` (dynamic, call-time) — completely different mechanisms | Scope is lexical. Context is `this`. Arrow functions unify both by capturing `this` lexically. |

**🎯 Interview Pattern:**

- **Trigger**: "closure and this" / "scope vs context" / "why does this arrow function work here"
- **Concept**: Scope is lexical (write-time), context is dynamic (call-time), arrows unify both
- **Opening**: "Scope and context are often confused. Scope is determined by where code is written — a closure captures the variables of its enclosing lexical environment. Context is `this` — determined by how the function is called at runtime. Arrow functions are unique: they don't have their own `this`, so they capture `this` lexically from the surrounding code, the same way closures capture variables..."

**🔑 Knowledge Chain:**

- **Prereq**: Closures, `this` binding rules
- **Enables**: React hooks design rationale (hooks use closures, not `this`), event handler patterns

---

### 3. Execution Context Lifecycle

**🧠 Memory Hook:** "**Global context is created once. Each function call creates a new context. Context = {LexEnv + VarEnv + ThisBinding}. Pushed to stack on call, popped on return.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does JavaScript need an "execution context" object? Because function calls are reentrant — recursive functions need separate environments for each active call. The context object is JavaScript's solution to tracking which variables and `this` belong to which invocation
- Why is `this` part of the execution context (not scope)? Because `this` varies per call even for the same function — each execution context gets its own `this` binding determined at creation time
- Why does understanding this matter for async debugging? `async/await` suspends the execution context but preserves it (its local variables remain valid). Understanding the context stack helps debug why variables are still accessible after `await`

**Visual — Context Lifecycle:**

```
JavaScript starts:
  [Global EC created: {LexEnv, VarEnv, ThisBinding = globalThis}]
  [Global EC pushed to Call Stack]

Call foo():
  [foo EC created: {LexEnv, VarEnv, ThisBinding = ?}]
  [foo EC pushed to Call Stack]
  Call Stack: [Global EC] [foo EC] ← foo runs

  foo calls bar():
    [bar EC created: {LexEnv, VarEnv, ThisBinding = ?}]
    [bar EC pushed to Call Stack]
    Call Stack: [Global EC] [foo EC] [bar EC] ← bar runs

  bar returns:
    [bar EC popped]
    Call Stack: [Global EC] [foo EC] ← foo continues

foo returns:
  [foo EC popped]
  Call Stack: [Global EC] ← global continues

Stack overflow:
  Recursive function never reaches base case
  → Call Stack fills up → RangeError: Maximum call stack size exceeded
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Local variables are destroyed immediately when function returns" | The EC is popped, but closures that hold references to its Lexical Environment keep it alive | EC is popped; closures that captured the environment can keep it alive |
| "Stack overflow only happens with infinite recursion" | V8's stack limit is ~10,000 frames — deep but finite recursion can also overflow | Large but finite recursion can also overflow — ~10,000 frames in V8 |
| "`async` functions use a different stack" | `async` functions use the same call stack — `await` suspends execution and resumes at the same frame | `async` functions are still on the call stack; `await` pauses and resumes the same context |
| "Eval context is the same as function context" | `eval` in sloppy mode can inject variables into the enclosing scope — dangerous and prevents optimization | Eval EC can leak variables into enclosing scope in sloppy mode — use strict mode or avoid eval |

**🎯 Interview Pattern:**

- **Trigger**: "execution context" / "call stack" / "what happens when function is called"
- **Concept**: EC lifecycle — creation, push to stack, execution, pop on return
- **Opening**: "Every function call creates a new execution context with three components: Lexical Environment (block-scoped bindings), Variable Environment (var-scoped bindings, functionally the same in modern JS), and This Binding. It's pushed onto the call stack, code runs, then it's popped on return. Closures keep the Lexical Environment alive even after the context is popped..."

**🔑 Knowledge Chain:**

- **Prereq**: Variable environments (let/const/var), `this` binding rules
- **Enables**: Debugging stack traces, understanding async/await suspension, closure memory model, TDZ explanation

---

## Reference Theory / Tài Liệu Tham Khảo

## Execution Context Fundamentals / Cơ Bản Ngữ Cảnh Thực Thi

### What is Execution Context? / Ngữ Cảnh Thực Thi Là Gì?

**English:** An execution context is an abstract concept that holds information about the environment within which the current code is being executed.

**Tiếng Việt:** Ngữ cảnh thực thi là một khái niệm trừu tượng chứa thông tin về môi trường mà code hiện tại đang được thực thi.

```typescript
// Execution context structure
// Cấu trúc ngữ cảnh thực thi

/**
 * Execution Context Components:
 *
 * 1. Variable Environment
 *    - Environment Record
 *    - Outer Environment Reference
 *
 * 2. Lexical Environment
 *    - Environment Record
 *    - Outer Environment Reference
 *
 * 3. This Binding
 *    - Value of 'this'
 */

interface ExecutionContext {
  // Variable Environment (for var declarations)
  variableEnvironment: LexicalEnvironment;

  // Lexical Environment (for let/const declarations)
  lexicalEnvironment: LexicalEnvironment;

  // This binding
  thisBinding: any;

  // Type of context
  type: "global" | "function" | "eval" | "module";

  // For function contexts
  functionObject?: Function;

  // Realm (global object and intrinsics)
  realm: Realm;
}

interface LexicalEnvironment {
  // Environment Record (stores bindings)
  environmentRecord: EnvironmentRecord;

  // Reference to outer environment
  outer: LexicalEnvironment | null;
}

interface EnvironmentRecord {
  type: "declarative" | "object" | "global" | "module";
  bindings: Map<string, Binding>;
}

interface Binding {
  value: any;
  mutable: boolean;
  deletable: boolean;
  initialized: boolean;
}

interface Realm {
  globalObject: any;
  globalEnv: LexicalEnvironment;
  intrinsics: Map<string, any>;
}

class ExecutionContextManager {
  private contextStack: ExecutionContext[] = [];
  private globalContext: ExecutionContext;

  constructor() {
    // Create global execution context
    this.globalContext = this.createGlobalContext();
    this.contextStack.push(this.globalContext);
  }

  private createGlobalContext(): ExecutionContext {
    const globalEnv: LexicalEnvironment = {
      environmentRecord: {
        type: "global",
        bindings: new Map(),
      },
      outer: null,
    };

    return {
      variableEnvironment: globalEnv,
      lexicalEnvironment: globalEnv,
      thisBinding: globalThis,
      type: "global",
      realm: {
        globalObject: globalThis,
        globalEnv,
        intrinsics: new Map(),
      },
    };
  }

  // Create function execution context
  // Tạo ngữ cảnh thực thi hàm
  createFunctionContext(func: Function, thisArg: any, args: any[]): ExecutionContext {
    // Create new lexical environment
    const localEnv: LexicalEnvironment = {
      environmentRecord: {
        type: "declarative",
        bindings: new Map(),
      },
      outer: this.getFunctionOuterEnvironment(func),
    };

    // Bind parameters
    this.bindParameters(localEnv, func, args);

    // Determine this binding
    const thisBinding = this.determineThisBinding(func, thisArg);

    return {
      variableEnvironment: localEnv,
      lexicalEnvironment: localEnv,
      thisBinding,
      type: "function",
      functionObject: func,
      realm: this.getCurrentContext().realm,
    };
  }

  private getFunctionOuterEnvironment(func: Function): LexicalEnvironment {
    // In real implementation, this would access [[Environment]] internal slot
    // For now, return current lexical environment
    return this.getCurrentContext().lexicalEnvironment;
  }

  private bindParameters(env: LexicalEnvironment, func: Function, args: any[]): void {
    // Bind function parameters
    const paramNames = this.getParameterNames(func);

    for (let i = 0; i < paramNames.length; i++) {
      env.environmentRecord.bindings.set(paramNames[i], {
        value: args[i],
        mutable: true,
        deletable: false,
        initialized: true,
      });
    }

    // Bind 'arguments' object
    env.environmentRecord.bindings.set("arguments", {
      value: args,
      mutable: true,
      deletable: false,
      initialized: true,
    });
  }

  private getParameterNames(func: Function): string[] {
    // Extract parameter names from function
    const funcStr = func.toString();
    const match = funcStr.match(/\(([^)]*)\)/);
    if (!match) return [];

    return match[1]
      .split(",")
      .map((param) => param.trim())
      .filter((param) => param.length > 0);
  }

  private determineThisBinding(func: Function, thisArg: any): any {
    // Arrow functions use lexical this
    if (this.isArrowFunction(func)) {
      return this.getCurrentContext().thisBinding;
    }

    // Strict mode
    if (this.isStrictMode(func)) {
      return thisArg;
    }

    // Non-strict mode: convert to object
    if (thisArg === null || thisArg === undefined) {
      return globalThis;
    }

    return Object(thisArg);
  }

  private isArrowFunction(func: Function): boolean {
    // Check if function is arrow function
    return !func.hasOwnProperty("prototype");
  }

  private isStrictMode(func: Function): boolean {
    // Check if function is in strict mode
    return func.toString().includes("use strict");
  }

  // Push context onto stack
  // Đẩy context lên stack
  pushContext(context: ExecutionContext): void {
    this.contextStack.push(context);
  }

  // Pop context from stack
  // Lấy context ra khỏi stack
  popContext(): ExecutionContext | undefined {
    if (this.contextStack.length > 1) {
      return this.contextStack.pop();
    }
    return undefined;
  }

  // Get current context
  // Lấy context hiện tại
  getCurrentContext(): ExecutionContext {
    return this.contextStack[this.contextStack.length - 1];
  }

  // Get variable value
  // Lấy giá trị biến
  getVariable(name: string): any {
    let env: LexicalEnvironment | null = this.getCurrentContext().lexicalEnvironment;

    while (env !== null) {
      const binding = env.environmentRecord.bindings.get(name);
      if (binding) {
        if (!binding.initialized) {
          throw new ReferenceError(`Cannot access '${name}' before initialization`);
        }
        return binding.value;
      }
      env = env.outer;
    }

    throw new ReferenceError(`${name} is not defined`);
  }

  // Set variable value
  // Đặt giá trị biến
  setVariable(name: string, value: any): void {
    let env: LexicalEnvironment | null = this.getCurrentContext().lexicalEnvironment;

    while (env !== null) {
      const binding = env.environmentRecord.bindings.get(name);
      if (binding) {
        if (!binding.mutable) {
          throw new TypeError(`Assignment to constant variable: ${name}`);
        }
        binding.value = value;
        return;
      }
      env = env.outer;
    }

    // Create global variable in non-strict mode
    if (!this.isStrictMode(this.getCurrentContext().functionObject!)) {
      this.globalContext.lexicalEnvironment.environmentRecord.bindings.set(name, {
        value,
        mutable: true,
        deletable: true,
        initialized: true,
      });
    } else {
      throw new ReferenceError(`${name} is not defined`);
    }
  }

  // Declare variable
  // Khai báo biến
  declareVariable(name: string, value: any, kind: "var" | "let" | "const"): void {
    const context = this.getCurrentContext();
    const env = kind === "var" ? context.variableEnvironment : context.lexicalEnvironment;

    // Check if already declared
    if (env.environmentRecord.bindings.has(name)) {
      if (kind === "let" || kind === "const") {
        throw new SyntaxError(`Identifier '${name}' has already been declared`);
      }
      // var allows redeclaration
      return;
    }

    env.environmentRecord.bindings.set(name, {
      value,
      mutable: kind !== "const",
      deletable: false,
      initialized: kind === "var", // var is initialized with undefined
    });
  }
}
```

---

## Call Stack / Ngăn Xếp Gọi

### Call Stack Implementation / Triển Khai Call Stack

**English:** The call stack manages execution contexts using LIFO (Last In, First Out) principle.

**Tiếng Việt:** Call stack quản lý các ngữ cảnh thực thi sử dụng nguyên tắc LIFO (Vào Sau Ra Trước).

```typescript
// Call stack implementation
// Triển khai call stack

class CallStack {
  private stack: StackFrame[] = [];
  private maxSize: number = 10000; // Stack size limit

  // Push frame onto stack
  // Đẩy frame lên stack
  push(frame: StackFrame): void {
    if (this.stack.length >= this.maxSize) {
      throw new RangeError("Maximum call stack size exceeded");
    }

    this.stack.push(frame);
  }

  // Pop frame from stack
  // Lấy frame ra khỏi stack
  pop(): StackFrame | undefined {
    return this.stack.pop();
  }

  // Peek at top frame
  // Xem frame trên cùng
  peek(): StackFrame | undefined {
    return this.stack[this.stack.length - 1];
  }

  // Get stack trace
  // Lấy stack trace
  getStackTrace(): string[] {
    return this.stack.map((frame) => {
      const location = frame.location
        ? ` (${frame.location.file}:${frame.location.line}:${frame.location.column})`
        : "";
      return `at ${frame.functionName}${location}`;
    });
  }

  // Get call stack size
  // Lấy kích thước call stack
  size(): number {
    return this.stack.length;
  }

  // Check if stack is empty
  // Kiểm tra stack có rỗng không
  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

interface StackFrame {
  functionName: string;
  context: ExecutionContext;
  location?: SourceLocation;
  arguments: any[];
}

interface SourceLocation {
  file: string;
  line: number;
  column: number;
}

// Example: Function call sequence
// Ví dụ: Chuỗi gọi hàm

class CallStackExample {
  static demonstrate() {
    const callStack = new CallStack();
    const contextManager = new ExecutionContextManager();

    // Simulate function calls
    // Mô phỏng gọi hàm

    function first() {
      const context = contextManager.createFunctionContext(first, undefined, []);
      callStack.push({
        functionName: "first",
        context,
        arguments: [],
      });

      second();

      callStack.pop();
    }

    function second() {
      const context = contextManager.createFunctionContext(second, undefined, []);
      callStack.push({
        functionName: "second",
        context,
        arguments: [],
      });

      third();

      callStack.pop();
    }

    function third() {
      const context = contextManager.createFunctionContext(third, undefined, []);
      callStack.push({
        functionName: "third",
        context,
        arguments: [],
      });

      // Stack trace at this point:
      // at third
      // at second
      // at first
      // at global

      console.log(callStack.getStackTrace());

      callStack.pop();
    }

    first();
  }
}
```

---

## Lexical Environment / Môi Trường Từ Vựng

### Scope Resolution / Giải Quyết Phạm Vi

**English:** Lexical environment determines variable scope and closure behavior.

**Tiếng Việt:** Môi trường từ vựng xác định phạm vi biến và hành vi closure.

```typescript
// Lexical environment and scope chain
// Môi trường từ vựng và chuỗi phạm vi

class ScopeChainExample {
  // Example 1: Nested scopes
  // Ví dụ 1: Phạm vi lồng nhau
  static nestedScopes() {
    // Global scope
    const global = "global";

    function outer() {
      // Outer function scope
      const outerVar = "outer";

      function inner() {
        // Inner function scope
        const innerVar = "inner";

        // Can access all three scopes
        console.log(global); // 'global'
        console.log(outerVar); // 'outer'
        console.log(innerVar); // 'inner'
      }

      inner();
    }

    outer();
  }

  // Example 2: Closure
  // Ví dụ 2: Closure
  static closureExample() {
    function createCounter() {
      let count = 0; // Captured in closure

      return {
        increment() {
          return ++count;
        },
        decrement() {
          return --count;
        },
        getCount() {
          return count;
        },
      };
    }

    const counter = createCounter();
    console.log(counter.increment()); // 1
    console.log(counter.increment()); // 2
    console.log(counter.getCount()); // 2
  }

  // Example 3: Block scope
  // Ví dụ 3: Phạm vi khối
  static blockScope() {
    // var: function-scoped
    if (true) {
      var functionScoped = "visible outside";
    }
    console.log(functionScoped); // 'visible outside'

    // let/const: block-scoped
    if (true) {
      let blockScoped = "not visible outside";
      const alsoBlockScoped = "not visible outside";
    }
    // console.log(blockScoped); // ReferenceError
  }

  // Example 4: Temporal Dead Zone
  // Ví dụ 4: Vùng Chết Tạm Thời
  static temporalDeadZone() {
    // console.log(x); // ReferenceError: Cannot access 'x' before initialization
    let x = 10;
    console.log(x); // 10

    // var is hoisted and initialized with undefined
    console.log(y); // undefined
    var y = 20;
    console.log(y); // 20
  }
}
```

---

## This Binding / Ràng Buộc This

### This Determination Rules / Quy Tắc Xác Định This

**English:** The value of 'this' depends on how a function is called.

**Tiếng Việt:** Giá trị của 'this' phụ thuộc vào cách hàm được gọi.

```typescript
// This binding rules
// Quy tắc ràng buộc this

class ThisBindingExamples {
  // Rule 1: Default binding
  // Quy tắc 1: Ràng buộc mặc định
  static defaultBinding() {
    function regularFunction() {
      console.log(this); // globalThis (non-strict) or undefined (strict)
    }

    regularFunction();
  }

  // Rule 2: Implicit binding
  // Quy tắc 2: Ràng buộc ngầm định
  static implicitBinding() {
    const obj = {
      name: "Object",
      greet() {
        console.log(this.name); // 'Object'
      },
    };

    obj.greet(); // this = obj

    // Lost implicit binding
    const greet = obj.greet;
    greet(); // this = globalThis or undefined
  }

  // Rule 3: Explicit binding
  // Quy tắc 3: Ràng buộc rõ ràng
  static explicitBinding() {
    function greet() {
      console.log(this.name);
    }

    const obj1 = { name: "Object 1" };
    const obj2 = { name: "Object 2" };

    greet.call(obj1); // 'Object 1'
    greet.apply(obj2); // 'Object 2'

    const boundGreet = greet.bind(obj1);
    boundGreet(); // 'Object 1'
  }

  // Rule 4: New binding
  // Quy tắc 4: Ràng buộc new
  static newBinding() {
    function Person(name: string) {
      this.name = name;
    }

    const person = new Person("John");
    console.log(person.name); // 'John'
  }

  // Rule 5: Arrow function (lexical this)
  // Quy tắc 5: Arrow function (this từ vựng)
  static arrowFunction() {
    const obj = {
      name: "Object",
      regularMethod() {
        console.log(this.name); // 'Object'

        const arrow = () => {
          console.log(this.name); // 'Object' (lexical this)
        };

        arrow();
      },
    };

    obj.regularMethod();
  }

  // Priority: new > explicit > implicit > default
  // Ưu tiên: new > rõ ràng > ngầm định > mặc định
}
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the 5 `this` binding rules? Give the priority order. 🟡 Mid

**A:** In priority order (highest to lowest): (1) **New**: `new Fn()` → `this` = newly created object; (2) **Explicit**: `.call(ctx)`, `.apply(ctx)`, `.bind(ctx)` → `this` = ctx; (3) **Implicit**: `obj.fn()` → `this` = obj; (4) **Default**: `fn()` → `undefined` (strict) or `globalThis` (sloppy); (5) **Arrow** (special — not a rule but a bypass): arrow functions don't have own `this`, capture lexically from enclosing context.

5 rules theo thứ tự priority: New > Explicit (call/apply/bind) > Implicit (object method) > Default (bare call). Arrow function không có `this` riêng — capture từ enclosing context lexically.

**💡 Interview Signal:**

- ✅ Strong: All 5 rules named, correct priority order, explains arrow function as "no own this"
- ❌ Weak: "this depends on how function is called" — true but no specifics on the 5 rules

---

### Q: What is the difference between scope and context (`this`)? 🟢 Junior

**A:** Scope determines which variables a function can access — resolved **lexically** at write-time based on where the function is defined. Context (`this`) determines which object a function operates on — resolved **dynamically** at call-time based on how the function is invoked. Arrow functions blur this line: they capture `this` lexically (like scope), so they're the exception to the dynamic rule.

Scope = visibility of variables, determined at write-time (lexical). Context = `this`, determined at call-time (dynamic). Arrow functions exception: họ capture `this` lexically như scope variables.

**💡 Interview Signal:**

- ✅ Strong: Names lexical (write-time) vs dynamic (call-time), gives arrow function as exception
- ❌ Weak: "Context is this" — no lexical vs dynamic distinction

---

### Q: Explain what happens step-by-step when a function is called. 🟡 Mid

**A:** (1) A new Execution Context is created with 3 components: Lexical Environment (for `let`/`const`/function bindings), Variable Environment (for `var` bindings), and `this` binding (determined by the call pattern). (2) During the Creation Phase, bindings are set up: `var` → `undefined`, function declarations → full function objects, `let`/`const` → TDZ (uninitialized). `this` is also determined here. (3) The EC is pushed onto the Call Stack. (4) Execution Phase runs the function body line by line. (5) On return, EC is popped. Local bindings are GC-eligible _unless_ a closure captures the Lexical Environment.

Khi function được gọi: (1) Tạo EC với LexEnv + VarEnv + ThisBinding; (2) Creation Phase: set up bindings (var→undefined, fn→hoisted, let/const→TDZ), determine `this`; (3) Push to Call Stack; (4) Execute body; (5) Pop on return. Closure giữ LexEnv alive sau khi EC popped.

**💡 Interview Signal:**

- ✅ Strong: Names 3 EC components, Creation/Execution phases, mentions closure keeping LexEnv alive
- ❌ Weak: "Function scope is created and destroyed" — no mention of EC structure or phases

---

### Q: Why does `const fn = obj.method; fn()` lose `this`, and what are 3 ways to fix it? 🟡 Mid

**A:** "Lost this" happens because `fn()` is a bare function call — no object before the dot, so `this` defaults to `undefined` (strict) or `globalThis` (sloppy). The object-method association is a call-time lookup, not a property of the function itself. Three fixes: (1) `fn.bind(obj)` — permanently bind; (2) Arrow function property: `method = () => { ... }` in class — captures `this` lexically at class instantiation; (3) Wrapper: `const fn = (...args) => obj.method(...args)`.

"Lost this": detach method → bare function call → default binding. Fixes: (1) `bind(obj)` ngay khi detach; (2) Arrow function property trong class; (3) Wrapper function.

**💡 Interview Signal:**

- ✅ Strong: Explains the default binding mechanism, gives 3 distinct solutions with trade-offs
- ❌ Weak: "Use arrow functions" — one solution only; doesn't explain the root cause

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                   | Level | One-liner                                                                        |
| --- | ----------------------- | ----- | -------------------------------------------------------------------------------- |
| 1   | 5 `this` binding rules  | 🟡    | new > explicit > implicit > default; arrow = lexical capture                     |
| 2   | Scope vs context        | 🟢    | Scope: lexical (write-time). `this`: dynamic (call-time). Arrow: exception       |
| 3   | Function call lifecycle | 🟡    | Create EC → Creation Phase → Push to stack → Execute → Pop; closure keeps LexEnv |
| 4   | Lost `this` + 3 fixes   | 🟡    | Detach → bare call → default binding. Fix: bind / arrow property / wrapper       |

---

## ⚡ Cold Call Simulation

**Q: "Explain why this React class component has a bug and how to fix it."**

```javascript
class Button extends React.Component {
  handleClick() {
    this.setState({ clicked: true });
  }
  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
```

**30-second answer:**

"The bug is 'lost this'. When JSX sets `onClick={this.handleClick}`, it copies the method reference without the object — equivalent to `const fn = button.handleClick`. When the user clicks, React calls `fn()` — a bare function call with no object before the dot. By the 5 `this` binding rules, that's the default binding: `undefined` in strict mode (which React uses). So `this.setState` throws. Three fixes: in the constructor, `this.handleClick = this.handleClick.bind(this)` — permanently binds; or convert to an arrow function property `handleClick = () => { ... }` — arrow captures `this` lexically at class instantiation; or use `onClick={() => this.handleClick()}` in the render — but this creates a new function every render. The arrow property pattern is the modern React class component convention."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Name the 5 `this` binding rules and their priority order. No looking.
- **Visual**: Draw the Call Stack state when `foo()` calls `bar()` calls `baz()`. What happens when `baz` returns?
- **Application**: You have `const { method } = someObject; method()`. What is `this` inside `method`? How do you fix it to refer to `someObject`?
- **Debug**: An arrow function as an object method doesn't have access to the object via `this`. Explain why.
- **Teach**: Explain "lost this" to a junior using a restaurant analogy — the waiter knows the menu but doesn't know which table they're serving when called out of context.

> 🎯 **Feynman Prompt:** Giải thích cho PM: tại sao cùng một hàm `getName()` nhưng cho kết quả khác nhau tùy vào cách gọi — `this` binding và execution context hoạt động như thế nào theo từng ngữ cảnh?

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [JavaScript Basics Theory](./13-javascript-basics-theory.md) — Execution Context Creation Phase basics
- ⬅️ **Built on**: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — Lexical scope and TDZ
- 🔗 **Applied in**: [This Keyword](./05-this-keyword.md) — practical `this` binding in React and Node.js
- 🔗 **Applied in**: [React Hooks](../03-react/03-hooks-deep-dive.md) — hooks use closures (scope) not `this` (context)

[← Previous: Memory Management](./15-memory-management-advanced.md) | [Next: Advanced Patterns →](./17-advanced-patterns-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
