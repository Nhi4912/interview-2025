# JavaScript Execution Context - Advanced Theory / Ngữ Cảnh Thực Thi JavaScript - Lý Thuyết Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [Execution Context Fundamentals](#execution-context-fundamentals)
2. [Call Stack](#call-stack)
3. [Lexical Environment](#lexical-environment)
4. [Variable Environment](#variable-environment)
5. [This Binding](#this-binding)
6. [Scope Chain](#scope-chain)
7. [Interview Questions](#interview-questions)

---

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
  type: 'global' | 'function' | 'eval' | 'module';
  
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
  type: 'declarative' | 'object' | 'global' | 'module';
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
        type: 'global',
        bindings: new Map()
      },
      outer: null
    };
    
    return {
      variableEnvironment: globalEnv,
      lexicalEnvironment: globalEnv,
      thisBinding: globalThis,
      type: 'global',
      realm: {
        globalObject: globalThis,
        globalEnv,
        intrinsics: new Map()
      }
    };
  }
  
  // Create function execution context
  // Tạo ngữ cảnh thực thi hàm
  createFunctionContext(
    func: Function,
    thisArg: any,
    args: any[]
  ): ExecutionContext {
    // Create new lexical environment
    const localEnv: LexicalEnvironment = {
      environmentRecord: {
        type: 'declarative',
        bindings: new Map()
      },
      outer: this.getFunctionOuterEnvironment(func)
    };
    
    // Bind parameters
    this.bindParameters(localEnv, func, args);
    
    // Determine this binding
    const thisBinding = this.determineThisBinding(func, thisArg);
    
    return {
      variableEnvironment: localEnv,
      lexicalEnvironment: localEnv,
      thisBinding,
      type: 'function',
      functionObject: func,
      realm: this.getCurrentContext().realm
    };
  }
  
  private getFunctionOuterEnvironment(func: Function): LexicalEnvironment {
    // In real implementation, this would access [[Environment]] internal slot
    // For now, return current lexical environment
    return this.getCurrentContext().lexicalEnvironment;
  }
  
  private bindParameters(
    env: LexicalEnvironment,
    func: Function,
    args: any[]
  ): void {
    // Bind function parameters
    const paramNames = this.getParameterNames(func);
    
    for (let i = 0; i < paramNames.length; i++) {
      env.environmentRecord.bindings.set(paramNames[i], {
        value: args[i],
        mutable: true,
        deletable: false,
        initialized: true
      });
    }
    
    // Bind 'arguments' object
    env.environmentRecord.bindings.set('arguments', {
      value: args,
      mutable: true,
      deletable: false,
      initialized: true
    });
  }
  
  private getParameterNames(func: Function): string[] {
    // Extract parameter names from function
    const funcStr = func.toString();
    const match = funcStr.match(/\(([^)]*)\)/);
    if (!match) return [];
    
    return match[1]
      .split(',')
      .map(param => param.trim())
      .filter(param => param.length > 0);
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
    return !func.hasOwnProperty('prototype');
  }
  
  private isStrictMode(func: Function): boolean {
    // Check if function is in strict mode
    return func.toString().includes('use strict');
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
        initialized: true
      });
    } else {
      throw new ReferenceError(`${name} is not defined`);
    }
  }
  
  // Declare variable
  // Khai báo biến
  declareVariable(
    name: string,
    value: any,
    kind: 'var' | 'let' | 'const'
  ): void {
    const context = this.getCurrentContext();
    const env = kind === 'var' 
      ? context.variableEnvironment 
      : context.lexicalEnvironment;
    
    // Check if already declared
    if (env.environmentRecord.bindings.has(name)) {
      if (kind === 'let' || kind === 'const') {
        throw new SyntaxError(`Identifier '${name}' has already been declared`);
      }
      // var allows redeclaration
      return;
    }
    
    env.environmentRecord.bindings.set(name, {
      value,
      mutable: kind !== 'const',
      deletable: false,
      initialized: kind === 'var' // var is initialized with undefined
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
      throw new RangeError('Maximum call stack size exceeded');
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
    return this.stack.map(frame => {
      const location = frame.location 
        ? ` (${frame.location.file}:${frame.location.line}:${frame.location.column})`
        : '';
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
        functionName: 'first',
        context,
        arguments: []
      });
      
      second();
      
      callStack.pop();
    }
    
    function second() {
      const context = contextManager.createFunctionContext(second, undefined, []);
      callStack.push({
        functionName: 'second',
        context,
        arguments: []
      });
      
      third();
      
      callStack.pop();
    }
    
    function third() {
      const context = contextManager.createFunctionContext(third, undefined, []);
      callStack.push({
        functionName: 'third',
        context,
        arguments: []
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
    const global = 'global';
    
    function outer() {
      // Outer function scope
      const outerVar = 'outer';
      
      function inner() {
        // Inner function scope
        const innerVar = 'inner';
        
        // Can access all three scopes
        console.log(global);    // 'global'
        console.log(outerVar);  // 'outer'
        console.log(innerVar);  // 'inner'
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
        }
      };
    }
    
    const counter = createCounter();
    console.log(counter.increment()); // 1
    console.log(counter.increment()); // 2
    console.log(counter.getCount());  // 2
  }
  
  // Example 3: Block scope
  // Ví dụ 3: Phạm vi khối
  static blockScope() {
    // var: function-scoped
    if (true) {
      var functionScoped = 'visible outside';
    }
    console.log(functionScoped); // 'visible outside'
    
    // let/const: block-scoped
    if (true) {
      let blockScoped = 'not visible outside';
      const alsoBlockScoped = 'not visible outside';
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
      name: 'Object',
      greet() {
        console.log(this.name); // 'Object'
      }
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
    
    const obj1 = { name: 'Object 1' };
    const obj2 = { name: 'Object 2' };
    
    greet.call(obj1);  // 'Object 1'
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
    
    const person = new Person('John');
    console.log(person.name); // 'John'
  }
  
  // Rule 5: Arrow function (lexical this)
  // Quy tắc 5: Arrow function (this từ vựng)
  static arrowFunction() {
    const obj = {
      name: 'Object',
      regularMethod() {
        console.log(this.name); // 'Object'
        
        const arrow = () => {
          console.log(this.name); // 'Object' (lexical this)
        };
        
        arrow();
      }
    };
    
    obj.regularMethod();
  }
  
  // Priority: new > explicit > implicit > default
  // Ưu tiên: new > rõ ràng > ngầm định > mặc định
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: Explain execution context and call stack

**English Answer:**

**Execution Context** contains:
1. Variable Environment (var declarations)
2. Lexical Environment (let/const declarations)
3. This binding

**Types:**
- Global execution context
- Function execution context
- Eval execution context

**Call Stack:**
- LIFO structure
- Manages execution contexts
- Stack overflow when limit exceeded

**Execution Flow:**
1. Create global context
2. Push onto call stack
3. When function called, create function context
4. Push function context onto stack
5. When function returns, pop context
6. Continue with previous context

**Tiếng Việt:**

Execution context chứa Variable Environment, Lexical Environment và This binding. Call stack quản lý các contexts theo LIFO.

### 🟡 [Mid] Q2: What is the difference between scope and context?

**English Answer:**

**Scope:**
- Refers to variable visibility
- Determined by code structure (lexical)
- Created at write-time
- Types: global, function, block

**Context:**
- Refers to 'this' value
- Determined by how function is called
- Created at runtime
- Can be changed with call/apply/bind

**Example:**
```javascript
const obj = {
  value: 42,
  getValue() {
    // Scope: can access 'value' via this
    // Context: this = obj
    return this.value;
  }
};

const getValue = obj.getValue;
// Scope: still same
// Context: this = globalThis or undefined
getValue(); // undefined or error
```

**Tiếng Việt:**

Scope liên quan đến khả năng hiển thị biến (lexical), context liên quan đến giá trị 'this' (runtime).

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Execution context has three components
2. Call stack manages contexts (LIFO)
3. Lexical environment determines scope
4. This binding depends on call site
5. Closures capture lexical environment
6. Block scope with let/const
7. Temporal Dead Zone for let/const

---

[← Previous: Memory Management](./15-memory-management-advanced.md) | [Next: Advanced Patterns →](./17-advanced-patterns-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
