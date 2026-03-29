# Execution Context / Ngữ Cảnh Thực Thi

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./03-scope-hoisting.md) | [this Keyword](./05-this-keyword.md) | [Closures](./04-closures.md)
> **See also**: [JavaScript Basics](./01-javascript-basics.md) | [Event Loop](./07-event-loop-async.md)
> **L5 Competencies**: Runtime Model Understanding, Debugging Mastery, Performance Analysis

[← Previous: ES6+ Features](./08-es6-features.md) | [Next: Advanced Concepts →](./10-advanced-concepts.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn debug một recursive function bị crash với `RangeError: Maximum call stack size exceeded`. Stack trace dài 15,000 dòng nhưng bạn không hiểu tại sao. Hoặc: `this` trong callback trả về `undefined` dù method gọi ở object. Hoặc: biến `x` log ra `undefined` thay vì `10` dù đã khai báo. Tất cả 3 bug này có chung root cause: **bạn không hiểu Execution Context hoạt động thế nào**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Phòng làm việc trong tòa nhà:**

Mỗi khi bạn bước vào một phòng (gọi function), tòa nhà (JS engine) tạo cho bạn một **bàn làm việc** mới (Execution Context) gồm:

- **Tủ hồ sơ** = Lexical Environment (chứa biến let/const)
- **Ngăn kéo** = Variable Environment (chứa biến var)
- **Bảng tên** = ThisBinding (bạn đang làm việc cho ai)

Khi xong việc (return), bàn làm việc bị dọn đi. Nếu ai đó (closure) vẫn cần hồ sơ của bạn → tủ hồ sơ được giữ lại.

---

## Concept Map / Bản Đồ Khái Niệm

```
                    [Execution Context (EC)]
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   [LexicalEnv]     [VariableEnv]     [ThisBinding]
   let, const, fn    var declarations   this value
          │                │
          ▼                ▼
   [EnvironmentRecord + outer reference]
          │
          ▼ (outer → outer → ...)
   [Scope Chain] → until null (global)

                    [Call Stack]
                    ┌──────────┐
                    │ bar() EC │ ← top (executing)
                    │ foo() EC │
                    │ Global EC│ ← bottom (always present)
                    └──────────┘
```

---

## Overview / Tổng Quan

File này giải thích **cơ chế bên trong** JS engine khi chạy code:

1. **Execution Context** — "bàn làm việc" cho mỗi function call: chứa gì, tạo khi nào, hủy khi nào
2. **EC Lifecycle** — 2 phases: Creation (hoisting xảy ra ở đây) → Execution (chạy code)
3. **Call Stack** — quản lý EC theo LIFO, stack overflow, async suspension
4. **Scope Chain** — cơ chế lookup biến từ inner → outer → global
5. **Scope vs Context** — 2 khái niệm bị nhầm lẫn nhất: scope (lexical) vs this (dynamic)

> **Đã cover ở file khác:** `this` binding 5 rules → [05-this-keyword](./05-this-keyword.md), var/let/const hoisting → [03-scope-hoisting](./03-scope-hoisting.md)

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Execution Context — Bàn Làm Việc Của Function

> 🧠 **Memory Hook:** "Mỗi function call = 1 bàn làm việc mới. Bàn có 3 thứ: **L**exical (tủ let/const), **V**ariable (ngăn var), **T**his (bảng tên). LVT."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần EC? → Vì function calls là reentrant — recursive function gọi chính nó nhiều lần, mỗi lần cần environment riêng cho biến cục bộ
- Tại sao có 2 environment (Lexical + Variable)? → Vì `var` scope khác `let`/`const` scope. `var` hoisted toàn function, `let`/`const` chỉ trong block. 2 env tracks 2 behaviors
- Tại sao `this` nằm trong EC? → Vì cùng function nhưng gọi khác nhau → `this` khác nhau. EC phải lưu `this` riêng cho mỗi lời gọi

#### Layer 1: Analogy — Bàn Làm Việc

```
Function call = Bước vào phòng mới

Trước khi làm việc (Creation Phase):
  → Sắp tủ hồ sơ: ghi tên biến (let/const → chưa điền giá trị = TDZ)
  → Sắp ngăn kéo: ghi tên var (điền = undefined)
  → Treo bảng tên: xác định this (dựa vào cách gọi)

Bắt đầu làm việc (Execution Phase):
  → Chạy code từng dòng
  → Điền giá trị vào hồ sơ khi gặp assignment
  → Gặp function call mới → tạo bàn mới, chồng lên

Xong việc (Return):
  → Dọn bàn (pop EC)
  → Nếu closure giữ reference → tủ hồ sơ KHÔNG bị dọn
```

#### Layer 2: How It Works — EC Structure

```
Execution Context structure:
┌──────────────────────────────────────────────────────┐
│ Execution Context                                    │
│                                                      │
│  ┌─ LexicalEnvironment ──────────────────────────┐   │
│  │  EnvironmentRecord:                           │   │
│  │    x → <uninitialized>  (let x = 10)         │   │
│  │    y → <uninitialized>  (const y = 20)        │   │
│  │    fn → function object (function fn(){})     │   │
│  │                                               │   │
│  │  outer → reference to parent LexicalEnv       │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌─ VariableEnvironment ─────────────────────────┐   │
│  │  EnvironmentRecord:                           │   │
│  │    a → undefined         (var a = 30)         │   │
│  │                                               │   │
│  │  outer → reference to parent LexicalEnv       │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ThisBinding: determined by call pattern             │
└──────────────────────────────────────────────────────┘
```

```javascript
// Trace qua EC để hiểu hoisting
function demo() {
  console.log(a); // undefined (var hoisted, init = undefined)
  console.log(b); // ❌ ReferenceError (let trong TDZ)
  console.log(fn); // ✅ [Function: fn] (function declaration hoisted đầy đủ)

  var a = 1;
  let b = 2;
  function fn() {
    return 3;
  }
}

// Tương đương với Creation Phase làm:
// VariableEnv: { a: undefined }
// LexicalEnv:  { b: <TDZ>, fn: [Function] }
// Rồi Execution Phase gán: a = 1, b = 2
```

#### Layer 3: Edge Cases

```javascript
// 3 types of Execution Context:
// 1. Global EC — tạo 1 lần khi script chạy, this = globalThis
// 2. Function EC — tạo mỗi lần function call
// 3. Eval EC — tạo khi eval() chạy (avoid!)

// Module EC — in ESM, top-level this = undefined (not globalThis)
// <script type="module">
console.log(this); // undefined (module scope)
// </script>

// async function EC — EC bị suspend khi await, resume sau
async function getData() {
  const a = 1; // EC created, a = 1
  await fetch(url); // EC SUSPENDED — nhưng a vẫn giữ nguyên
  console.log(a); // EC RESUMED — a vẫn = 1 (closure giữ)
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                           | Tại sao sai                                                | Đúng là                                                      |
| --------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| "Biến bị hủy khi function return" | EC bị pop, nhưng closure giữ LexEnv alive                  | EC popped, LexEnv sống nếu closure reference                 |
| "Hoisting = move code lên đầu"    | Code không di chuyển — Creation Phase ghi tên biến vào env | Hoisting = env record setup trong Creation Phase             |
| "var và let hoisting giống nhau"  | var = init `undefined`. let = `<uninitialized>` (TDZ)      | let hoisted nhưng KHÔNG init → access trước = ReferenceError |

**🎯 Interview Pattern:**

- Khi thấy: "Execution context" / "Hoisting internally"
- → Mở đầu: "Mỗi function call tạo EC mới với 3 thành phần: LexicalEnv (let/const), VariableEnv (var), ThisBinding. Creation Phase set up bindings — đây là nơi hoisting xảy ra — rồi Execution Phase chạy code..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: var/let/const behavior, function declarations
- ➡️ Để hiểu: TDZ mechanism, hoisting internals, closure memory model

---

### 2. EC Lifecycle — Creation Phase & Execution Phase

> 🧠 **Memory Hook:** "**2 phases:** Creation = **điểm danh** (ghi tên, chưa kiểm tra bài). Execution = **làm bài** (gán giá trị, chạy code)."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần 2 phases? → Vì JS cần biết tất cả bindings **trước** khi chạy code — function declarations phải available ở bất kỳ đâu trong scope (hoisting)
- Tại sao TDZ chỉ ở Creation Phase? → Vì let/const được ghi nhận (hoisted) nhưng chưa initialized — access trước assignment = ReferenceError, đảm bảo predictable behavior
- Tại sao function declarations hoisted đầy đủ nhưng var chỉ = undefined? → Design decision: functions cần callable trước definition (mutual recursion). var = backward compat behavior

#### Layer 1: Analogy — Giáo Viên Điểm Danh

Phase 1 (Creation = Điểm danh):

- Ghi tên học sinh vào sổ (register bindings)
- Học sinh var: ghi "có mặt, chờ bài" (undefined)
- Học sinh let/const: ghi "tên trong sổ, chưa đến" (TDZ)
- Học sinh function: ghi đầy đủ thông tin (hoisted complete)

Phase 2 (Execution = Kiểm tra):

- Chạy code từng dòng
- Gặp `let x = 10` → điền giá trị cho x (thoát TDZ)
- Gặp `var a = 5` → thay undefined bằng 5

#### Layer 2: How It Works — Step-by-Step Trace

```javascript
// Trace CHÍNH XÁC qua 2 phases:
function example(param) {
  console.log(a); // Step 4: undefined
  console.log(b); // Step 5: ❌ ReferenceError
  console.log(fn); // Step 6: [Function: fn]
  console.log(param); // Step 7: 'hello'

  var a = 1; // Step 8: a = 1
  let b = 2; // Step 9: b thoát TDZ, b = 2
  function fn() {} // (đã hoisted ở Creation Phase)
}

example("hello");
```

```
CREATION PHASE (trước khi chạy bất kỳ code nào):
┌──────────────────────────────────────────────────────┐
│ Step 1: Bind parameters                              │
│   param → 'hello'                                    │
│                                                      │
│ Step 2: Scan var declarations                        │
│   a → undefined                                      │
│                                                      │
│ Step 3: Scan function declarations (full hoist)      │
│   fn → [Function: fn]                                │
│                                                      │
│ Step 3b: Scan let/const (TDZ)                        │
│   b → <uninitialized>                                │
│                                                      │
│ ThisBinding: undefined (strict mode, bare call)      │
└──────────────────────────────────────────────────────┘

EXECUTION PHASE (chạy từng dòng):
  Step 4: console.log(a) → undefined (đã hoisted)
  Step 5: console.log(b) → ReferenceError (TDZ!)
  Step 6: (unreachable nếu Step 5 throw)
```

#### Layer 3: Edge Cases — Hoisting Priority

```javascript
// Function declaration vs var — function WINS
var x = 1;
function x() {
  return 2;
}
console.log(typeof x); // 'number' — WHY?

// Creation Phase: function x hoisted → x = [Function]
//                 var x hoisted → nhưng x đã tồn tại → skip
// Execution Phase: x = 1 (reassign) → typeof x = 'number'

// Function declaration vs let — ERROR
let y = 1;
function y() {} // ❌ SyntaxError: Identifier 'y' already declared

// Block-scoped function declarations (strict mode)
("use strict");
if (true) {
  function blockFn() {} // block-scoped! Không hoisted ra ngoài
}
// blockFn(); // ❌ ReferenceError in strict mode
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                     | Đúng là                                                   |
| ------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| "TDZ là vùng trước `let` declaration" | TDZ bắt đầu từ đầu scope, kết thúc tại declaration              | TDZ = từ đầu scope đến dòng `let x = ...`                 |
| "function expression được hoisted"    | Chỉ `var fn = ...` hoisted (undefined), body function thì không | `var fn = function(){}` → fn = undefined ở Creation Phase |
| "Creation Phase chạy code"            | Creation Phase chỉ scan declarations, không execute             | Không có code nào chạy ở Creation Phase                   |

**🔑 Knowledge Chain:**

- 📚 Cần biết: var/let/const declarations
- ➡️ Để hiểu: TDZ internals, hoisting quiz answers, function vs variable priority

---

### 3. Call Stack — LIFO Quản Lý EC

> 🧠 **Memory Hook:** "Call Stack = **chồng đĩa**: đặt đĩa lên trên (push), lấy đĩa trên cùng (pop). Hết chỗ = **stack overflow**. ~10,000 đĩa trong V8."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần stack? → Vì function calls lồng nhau: foo() gọi bar() gọi baz() → cần biết quay về đâu khi baz() xong
- Tại sao LIFO? → Vì function gọi cuối phải return trước — baz() phải xong trước khi bar() tiếp tục
- Tại sao có giới hạn? → Vì stack dùng memory, infinite recursion = infinite memory = crash. V8 giới hạn ~10,000 frames

#### Layer 1: Analogy — Chồng Đĩa

```
Gọi foo():  Stack: [Global] [foo]
foo gọi bar(): Stack: [Global] [foo] [bar]
bar gọi baz(): Stack: [Global] [foo] [bar] [baz] ← TOP
baz return:    Stack: [Global] [foo] [bar]
bar return:    Stack: [Global] [foo]
foo return:    Stack: [Global]

Stack overflow:
  fn() → fn() → fn() → ... → 💥 RangeError (10,000+ frames)
```

#### Layer 2: How It Works

```javascript
// Đọc stack trace từ DƯỚI lên TRÊN (bottom = first call)
function third() {
  throw new Error("debug");
}
function second() {
  third();
}
function first() {
  second();
}
first();

// Error stack trace:
// Error: debug
//     at third (file.js:2)     ← TOP of stack (where error happened)
//     at second (file.js:4)
//     at first (file.js:5)
//     at <anonymous> (file.js:6)  ← BOTTOM (global)
```

```
Stack Trace Reading Guide:
┌──────────────────────────────────────────────┐
│ Error: debug                                 │
│     at third (file.js:2)    ← ERROR HERE     │
│     at second (file.js:4)   ← called third   │
│     at first (file.js:5)    ← called second  │
│     at <anonymous>          ← entry point    │
│                                              │
│ Read: TOP = where error. BOTTOM = entry.     │
│ Each line = "was called by the line below"   │
└──────────────────────────────────────────────┘
```

```javascript
// Stack overflow — và cách fix
// ❌ Infinite recursion
function factorial(n) {
  return n * factorial(n - 1); // no base case!
}
factorial(5); // RangeError: Maximum call stack size exceeded

// ✅ Fix 1: Base case
function factorial(n) {
  if (n <= 1) return 1; // base case stops recursion
  return n * factorial(n - 1);
}

// ✅ Fix 2: Tail call optimization (strict mode only, Safari)
function factorial(n, acc = 1) {
  'use strict';
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // tail position
}

// ✅ Fix 3: Trampoline (works everywhere)
function trampoline(fn) {
  let result = fn();
  while (typeof result === 'function') {
    result = result(); // each call returns next thunk, not recursive
  }
  return result;
}
```

#### Layer 3: Edge Cases — Async & Stack

```javascript
// setTimeout callback KHÔNG ở trên Call Stack khi timer hết
function foo() {
  setTimeout(() => {
    // Stack ở đây: [Global] [callback] (KHÔNG có foo!)
    // foo() đã return trước khi callback chạy
    console.log("callback");
  }, 0);
  console.log("foo");
}
foo();
// Output: 'foo' → 'callback'
// foo() return → pop khỏi stack → callback mới được push

// async/await — SUSPEND nhưng giữ context
async function fetchData() {
  console.log("start"); // Stack: [Global] [fetchData]
  const data = await fetch(); // fetchData SUSPENDED, popped from stack
  console.log("done"); // fetchData RESUMED, pushed back
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                              | Đúng là                                          |
| ------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------ |
| "Stack overflow chỉ từ infinite recursion" | Deep nhưng finite recursion (10,000+) cũng overflow      | V8 ~10,000 frames. Rất deep recursion cũng crash |
| "setTimeout callback chạy trên stack cũ"   | Callback vào task queue, chỉ chạy khi stack TRỐNG        | Callback luôn bắt đầu với stack mới              |
| "async function không dùng call stack"     | async function vẫn trên call stack, await suspend/resume | await suspend EC, resume khi promise resolve     |

**🎯 Interview Pattern:**

- Khi thấy: "Call stack" / "Stack overflow" / "Stack trace"
- → Mở đầu: "Call stack là LIFO structure quản lý execution contexts. Mỗi function call push EC mới, return pop. Giới hạn ~10,000 frames trong V8. Stack trace đọc từ trên xuống: top = error location, bottom = entry point..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Function calls, recursion basics
- ➡️ Để hiểu: Error debugging (stack traces), Event Loop (stack phải trống), async/await suspension

---

### 4. Scope Chain — Cơ Chế Lookup Biến

> 🧠 **Memory Hook:** "Scope chain = **hỏi lên cấp trên**: tìm biến ở phòng mình → không có → hỏi phòng bên ngoài → ... → hỏi CEO (global). Không tìm thấy = ReferenceError."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao biến ở function cha accessible? → Vì mỗi LexEnv có `outer` reference trỏ về parent LexEnv. Lookup đi theo chain outer → outer → null
- Tại sao scope chain xác định lúc viết code (lexical)? → Vì `outer` reference set dựa trên **nơi function được DEFINE**, không phải nơi function được CALL
- Tại sao closure hoạt động? → Vì inner function giữ reference tới LexEnv qua `[[Environment]]` internal slot → giữ chain alive

#### Layer 1: Analogy — Hỏi Lên Cấp Trên

```
Bạn (inner function) cần "biến x":
  1. Kiểm tra bàn mình (local scope) → Không có
  2. Hỏi quản lý (outer function scope) → Không có
  3. Hỏi giám đốc (outer outer scope) → Không có
  4. Hỏi CEO (global scope) → Không có
  5. → "Không ai biết" = ReferenceError

Tìm thấy ở bước nào → DỪNG (không hỏi tiếp)
= Variable Shadowing (cùng tên, scope gần hơn wins)
```

#### Layer 2: How It Works

```javascript
const global = "CEO";

function outer() {
  const outerVar = "Manager";

  function inner() {
    const innerVar = "Staff";

    // Scope chain: inner → outer → global
    console.log(innerVar); // 'Staff' (local)
    console.log(outerVar); // 'Manager' (1 level up)
    console.log(global); // 'CEO' (2 levels up)
  }

  inner();
}
```

```
Scope Chain Visualization:
┌─────────────────────────────────────────────────────┐
│ inner LexEnv                                        │
│   innerVar: 'Staff'                                 │
│   outer → ─────────────────────┐                    │
│                                ▼                    │
│ outer LexEnv                                        │
│   outerVar: 'Manager'                               │
│   outer → ─────────────────────┐                    │
│                                ▼                    │
│ Global LexEnv                                       │
│   global: 'CEO'                                     │
│   outer → null (end of chain)                       │
└─────────────────────────────────────────────────────┘

Lookup "outerVar" from inner:
  inner.env → not found
  outer.env → FOUND! Return 'Manager'
  (stop here — don't check global)
```

```javascript
// Variable Shadowing — scope gần hơn wins
const x = "global";

function outer() {
  const x = "outer"; // shadows global x

  function inner() {
    const x = "inner"; // shadows outer x
    console.log(x); // 'inner'
  }

  inner();
  console.log(x); // 'outer' (inner's x không ảnh hưởng)
}

outer();
console.log(x); // 'global' (outer/inner's x không ảnh hưởng)

// Closure giữ scope chain alive
function createCounter() {
  let count = 0; // count nằm trong outer LexEnv

  return function increment() {
    // increment.[[Environment]] → createCounter's LexEnv
    // → count accessible dù createCounter đã return
    return ++count;
  };
}

const counter = createCounter(); // createCounter EC popped
counter(); // 1 — count vẫn alive vì closure giữ LexEnv
counter(); // 2
```

#### Layer 3: Edge Cases

```javascript
// Lexical scope = DEFINE time, NOT call time
function createGreeter() {
  const greeting = "Hello"; // captured at DEFINE time
  return function greet(name) {
    return `${greeting} ${name}`;
  };
}

const greet = createGreeter();
// Dù gọi greet() ở đâu, greeting luôn = 'Hello'
// Vì scope chain fixed tại nơi greet được DEFINE (bên trong createGreeter)

// Dynamic scope KHÔNG tồn tại trong JS (trừ this)
const x = "global";
function foo() {
  console.log(x); // 'global' — KHÔNG phải 'caller' dù bar gọi foo
}
function bar() {
  const x = "caller";
  foo(); // scope chain của foo → global, KHÔNG qua bar
}
bar(); // 'global'
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                   | Đúng là                                             |
| --------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| "Scope chain dựa trên nơi gọi function" | Scope chain lexical — dựa trên nơi DEFINE                     | Nơi viết code quyết định scope chain                |
| "Closure copy giá trị biến"             | Closure giữ REFERENCE tới LexEnv, không copy value            | Reference → value thay đổi → closure thấy value mới |
| "Shadowing thay đổi biến cha"           | Tạo biến MỚI trong scope gần hơn, biến cha không bị ảnh hưởng | Tạo mới, không sửa                                  |

**🔑 Knowledge Chain:**

- 📚 Cần biết: Lexical scope, closures
- ➡️ Để hiểu: Module scope, closure memory patterns, variable shadowing bugs

---

### 5. Scope vs Context — Hai Khái Niệm Bị Nhầm Nhất

> 🧠 **Memory Hook:** "**Scope** = bạn THẤY gì (lexical, write-time). **Context** = bạn LÀM VIỆC CHO AI (this, call-time). Arrow function = unify cả hai."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao 2 concepts riêng biệt? → Scope model variable resolution (static). `this` model method dispatch (dynamic). Khác mechanism
- Tại sao gây confusing? → Nhiều ngôn ngữ OOP unify scope + this. JS tách riêng → developers từ Java/C# bị bất ngờ
- Tại sao arrow functions quan trọng? → Arrow function = **ngoại lệ duy nhất** — `this` cũng lexical như scope

#### Layer 2: How It Works — Side by Side

```javascript
const value = "global";

const obj = {
  value: "obj",

  // Closure captures SCOPE (value variable)
  getScopeValue() {
    const inner = function () {
      return value;
    };
    return inner(); // 'global' — looks up SCOPE chain
  },

  // this depends on CONTEXT (how called)
  getContextValue() {
    return this.value; // depends on caller
  },
};

// Scope NEVER changes:
obj.getScopeValue(); // 'global'
const detached = obj.getScopeValue;
detached(); // 'global' (scope same!)

// Context CHANGES:
obj.getContextValue(); // 'obj' (implicit binding)
const detached2 = obj.getContextValue;
detached2(); // undefined (default binding!)
```

```
COMPARISON TABLE:
┌──────────────┬──────────────────────┬──────────────────────┐
│              │ Scope                │ Context (this)       │
├──────────────┼──────────────────────┼──────────────────────┤
│ Determined   │ Write-time (lexical) │ Call-time (dynamic)  │
│ Controls     │ Variable access      │ this value           │
│ Changes?     │ NEVER                │ Every call           │
│ Closure      │ ✅ captured          │ ❌ NOT captured       │
│ Arrow fn     │ Same as regular      │ ALSO lexical (!)     │
│ Debug tip    │ "Where was it       │ "How was it          │
│              │  written?"           │  called?"            │
└──────────────┴──────────────────────┴──────────────────────┘
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                    | Đúng là                                                                 |
| ------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Closure captures this"        | `this` không phải variable trong scope — closure không capture | Arrow function capture `this` lexically (special case)                  |
| "Scope và context là cùng thứ" | Scope = variable access (lexical). Context = this (dynamic)    | 2 mechanism hoàn toàn khác nhau                                         |
| Arrow method trên object       | Arrow capture `this` từ nơi DEFINE, không từ object            | `const obj = { fn: () => this }` → this = module/global, KHÔNG phải obj |

**🎯 Interview Pattern:**

- Khi thấy: "Scope vs context" / "Closure and this"
- → Mở đầu: "Scope determined at write-time — closure captures variables. Context (this) determined at call-time — changes per invocation. Arrow functions are the exception: they capture this lexically, like scope variables. Đó là lý do React class components dùng arrow properties cho event handlers..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Closures, `this` 5 rules
- ➡️ Để hiểu: React hooks design (hooks = closures, no `this`), event handler patterns

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: Execution Context gồm những gì? Tạo khi nào? 🟢 Junior

**A:**

EC có 3 thành phần: **LexicalEnvironment** (chứa let/const/function bindings), **VariableEnvironment** (chứa var bindings), **ThisBinding** (giá trị `this`).

EC được tạo mỗi khi function được gọi. Có 2 phases: **Creation Phase** (scan declarations, set up bindings — đây là nơi hoisting xảy ra) và **Execution Phase** (chạy code từng dòng, gán giá trị).

**💡 Interview Signal:**

- ✅ Strong: 3 thành phần, 2 phases, link hoisting vào Creation Phase
- ❌ Weak: "EC is where code runs" — quá vague

---

### Q2: Tại sao scope chain lexical (dựa trên nơi viết code)? 🟢 Junior

**A:**

Vì mỗi LexicalEnvironment có `outer` reference trỏ về parent — reference này set dựa trên nơi function được **DEFINE** (viết trong source code), không phải nơi function được CALL. Nên variable lookup luôn cố định — bạn nhìn code là biết function access được biến nào.

Lợi ích: predictable, static analysis tool hiểu được, compiler optimize được.

**💡 Interview Signal:**

- ✅ Strong: Giải thích outer reference mechanism, nêu lợi ích predictability
- ❌ Weak: "Scope is where variables live" — không giải thích tại sao lexical

---

### Q3: Trace output — Creation Phase vs Execution Phase 🟡 Mid

```javascript
console.log(a); // ?
console.log(b); // ?
console.log(fn()); // ?

var a = 10;
let b = 20;
function fn() {
  return 30;
}
```

**A:**

```
Line 1: a = undefined (var hoisted, init undefined ở Creation Phase)
Line 2: ReferenceError (let hoisted nhưng TDZ — chưa init)
Line 3: (unreachable — line 2 throws)
        Nếu comment line 2: fn() = 30 (function declaration hoisted đầy đủ)
```

**Creation Phase setup:**

- `a` → `undefined` (VariableEnv, var hoisting)
- `b` → `<uninitialized>` (LexicalEnv, TDZ)
- `fn` → `[Function: fn]` (LexicalEnv, full hoist)

**💡 Interview Signal:**

- ✅ Strong: Trace chính xác, giải thích var vs let hoisting khác nhau, biết function hoisted đầy đủ
- ❌ Weak: "a is hoisted, b is not" — SAI, let cũng hoisted nhưng TDZ

---

### Q4: Đọc stack trace — debug recursive function 🟡 Mid

**A:**

Stack trace đọc **từ trên xuống**: dòng đầu = nơi error xảy ra, mỗi dòng tiếp theo = "được gọi bởi dòng dưới". Dòng cuối = entry point.

```
Error: Something went wrong
    at processItem (app.js:42)     ← error happened here
    at Array.forEach (<anonymous>) ← called by forEach
    at processAll (app.js:38)      ← called by processAll
    at main (app.js:10)            ← called by main
```

**Debug tips:**

1. Đọc dòng 1 → hiểu error gì, ở đâu
2. Đọc dòng 2-3 → hiểu call flow
3. Tìm "first line of YOUR code" (bỏ qua framework/library frames)
4. Recursive function: stack trace lặp lại pattern → tìm base case thiếu

**💡 Interview Signal:**

- ✅ Strong: Đọc đúng hướng (top=error), biết bỏ qua library frames, debug tip cho recursion
- ❌ Weak: "Just look at the error message" — bỏ qua stack trace

---

### Q5: Tại sao closure giữ biến alive sau khi function return? 🟡 Mid

**A:**

Vì inner function có internal slot `[[Environment]]` trỏ tới LexicalEnvironment của outer function. Dù outer function EC bị pop khỏi Call Stack, LexEnv vẫn alive vì inner function giữ reference.

GC rule: object không bị thu gom nếu còn reachable. Inner function reachable → LexEnv reachable → biến trong LexEnv reachable.

```javascript
function outer() {
  let count = 0; // nằm trong outer's LexEnv
  return () => ++count; // arrow.[[Environment]] → outer's LexEnv
}

const inc = outer(); // outer's EC popped, nhưng LexEnv alive (inc giữ)
inc(); // 1 — count accessible
inc(); // 2 — same count (reference, không copy)
```

**💡 Interview Signal:**

- ✅ Strong: `[[Environment]]` slot, GC reachability, LexEnv vs EC distinction
- ❌ Weak: "Closure remembers variables" — đúng nhưng không giải thích mechanism

---

### Q6: Design: Giải thích hoisting cho junior. Không dùng từ "hoisting". 🔴 Senior

> **Follow-up chain:** → "TDZ hoạt động thế nào internally?" → "Tại sao function hoisted đầy đủ nhưng var chỉ undefined?"

**A:**

"Trước khi JavaScript chạy code, nó **đọc qua** toàn bộ file một lần (Creation Phase). Trong lần đọc này, nó ghi chú tất cả tên biến và function. Giống giáo viên điểm danh trước khi bắt đầu giờ học.

Cách ghi chú khác nhau:

- `function fn() {}` → ghi đầy đủ (callable ngay)
- `var x = 10` → ghi tên, đánh dấu 'chờ' (= `undefined`)
- `let y = 20` → ghi tên, đánh dấu 'CẤM chạm' (TDZ — chạm trước khi gán = lỗi)

Sau đó mới chạy code từng dòng. Khi gặp `var x = 10`, JS thay 'chờ' thành 10. Khi gặp `let y = 20`, JS bỏ dấu 'CẤM' và gán 20."

**Internally:** TDZ = binding exists in EnvironmentRecord nhưng `initialized: false`. Access khi `initialized: false` → ReferenceError. Assignment `let y = 20` → set `initialized: true, value: 20`.

**Function hoisted đầy đủ vì:** Mutual recursion cần 2 functions gọi nhau — cả 2 phải available trước khi bất kỳ code nào chạy. Design decision từ ES1.

**💡 Interview Signal:**

- ✅ Strong: Giải thích bằng analogy, phân biệt 3 loại, giải thích TDZ internal mechanism
- ❌ Weak: "Code gets moved to the top" — mental model sai

---

### Q7: Recursive function bị stack overflow. 3 giải pháp? Trade-offs? 🔴 Senior

> **Follow-up chain:** → "Tail call optimization có hỗ trợ ở browser nào?" → "Trampoline pattern hoạt động thế nào?"

**A:**

**3 giải pháp:**

1. **Iterative conversion** — chuyển recursion thành loop
   - Pro: Luôn works, no overhead
   - Con: Code có thể phức tạp hơn (tree traversal cần explicit stack)

2. **Tail Call Optimization (TCO)** — recursive call ở tail position
   - Pro: O(1) stack space
   - Con: Chỉ Safari support. V8/SpiderMonkey không implement
   - Yêu cầu strict mode

3. **Trampoline** — function return thunk thay vì recursive call
   - Pro: Works everywhere, O(1) stack
   - Con: Overhead tạo function mỗi iteration

```javascript
// Trampoline pattern
function trampoline(fn) {
  let result = fn();
  while (typeof result === "function") {
    result = result(); // unwind stack — each call is O(1)
  }
  return result;
}

// Usage
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorial(n - 1, n * acc); // return THUNK, not recurse
}

trampoline(() => factorial(100000)); // works! No stack overflow
```

**💡 Interview Signal:**

- ✅ Strong: 3 approaches với trade-offs, biết TCO chỉ Safari, implement trampoline
- ❌ Weak: "Just use iteration" — 1 solution only, no discussion of TCO/trampoline

---

### Q8: Debug: async function — tại sao biến vẫn accessible sau await? 🔴 Senior

> **Follow-up chain:** → "await có pop EC khỏi stack không?" → "Closure hay EC giữ biến alive?"

**A:**

```javascript
async function fetchUser() {
  const userId = 42; // local variable
  const data = await fetch(); // SUSPEND here
  console.log(userId); // 42 — still accessible! Why?
}
```

Khi `await`, JS engine **suspend** EC của `fetchUser` — pop khỏi Call Stack nhưng **giữ nguyên** LexicalEnvironment (giống closure). Khi Promise resolve, EC được **resume** — push lại lên stack với cùng LexEnv.

Internally, async function được transform thành state machine (generator-like). Local variables lưu trong state object, survive qua mỗi `await` point.

**So sánh:**

- **Closure**: inner function giữ reference tới outer's LexEnv → biến alive
- **Async**: engine giữ reference tới suspended function's LexEnv → biến alive
- Cơ chế giống nhau: reachable LexEnv không bị GC

**💡 Interview Signal:**

- ✅ Strong: Suspend/resume model, LexEnv preserved, state machine transformation
- ❌ Weak: "async is like a closure" — vague, no mechanism explanation

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                   | Level | One-liner                                                             |
| --- | ----------------------- | ----- | --------------------------------------------------------------------- |
| 1   | EC components           | 🟢    | LexEnv + VarEnv + ThisBinding. Created per function call              |
| 2   | Lexical scope chain     | 🟢    | outer reference set at DEFINE time, not call time                     |
| 3   | Creation vs Execution   | 🟡    | Creation: scan declarations (hoisting). Execution: run code           |
| 4   | Read stack trace        | 🟡    | Top = error. Bottom = entry. Skip library frames                      |
| 5   | Closure mechanism       | 🟡    | [[Environment]] → LexEnv → reachable → not GC'd                       |
| 6   | Explain hoisting        | 🔴    | Creation Phase reads all names first. var=undefined, let=TDZ, fn=full |
| 7   | Stack overflow fixes    | 🔴    | Iterate / TCO (Safari only) / Trampoline (works everywhere)           |
| 8   | Async variable survival | 🔴    | Suspend = save LexEnv. Resume = restore. Same mechanism as closure    |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Giải thích Execution Context lifecycle khi JavaScript engine chạy một function call."**

**30 giây đầu — mở đầu lý tưởng:**

1. "Khi function được gọi, JS engine tạo Execution Context mới với 3 thành phần: LexicalEnvironment cho let/const, VariableEnvironment cho var, và ThisBinding."
2. "Creation Phase diễn ra trước — engine scan tất cả declarations: var được init undefined, let/const vào TDZ, function declarations hoisted đầy đủ."
3. "EC được push lên Call Stack, rồi Execution Phase chạy code từng dòng — gán giá trị, gọi function con."
4. "Khi return, EC bị pop. Nhưng nếu inner function giữ reference qua closure, LexicalEnvironment vẫn alive trong memory."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                             |
| --- | -------------- | ----------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Kể tên **3 thành phần** của Execution Context.                                      |
| 2   | 🎨 Visual      | Vẽ Call Stack khi `a()` gọi `b()` gọi `c()`, `c()` return, `b()` return.            |
| 3   | 🛠️ Application | Trace output: `console.log(x); var x = 1; let y = 2; console.log(y);`               |
| 4   | 🐛 Debug       | Stack trace: `at foo (line 5) at bar (line 10) at <anonymous>`. Đọc theo hướng nào? |
| 5   | 🎓 Teach       | Giải thích scope chain cho junior — dùng analogy "hỏi lên cấp trên" trong công ty.  |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                           |
| --- | ----------------------------------------------------------------------------------- |
| 1   | LexicalEnvironment, VariableEnvironment, ThisBinding                                |
| 2   | Push a, push b, push c, pop c, pop b, pop a. LIFO                                   |
| 3   | x = undefined (var hoisted), y = 2 (let initialized at line)                        |
| 4   | Top → down. Line 5 = error. Line 10 gọi foo. `<anonymous>` = entry point            |
| 5   | Tìm biến local → không có → hỏi phòng ngoài (outer) → ... → global → ReferenceError |

> 🎯 **Feynman Prompt:** Giải thích tại sao `let x` gây ReferenceError nhưng `var x` cho `undefined` — dùng analogy "điểm danh giáo viên" không dùng thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)

- [Scope & Hoisting](./03-scope-hoisting.md) — var/let/const scope rules, TDZ
- [Closures](./04-closures.md) — [[Environment]] slot, LexEnv survival
- [this Keyword](./05-this-keyword.md) — 5 binding rules (DINE priority)
- [Event Loop](./07-event-loop-async.md) — Call Stack + Task Queue interaction
- [Engine Internals](./17-engine-internals.md) — V8 EC implementation

### Khác track (Cross-track)

- [React Hooks](../03-react/03-hooks-deep-dive.md) — Hooks use closures (scope), not this (context)
- [TypeScript](../02-typescript/01-typescript-basics.md) — TS strict mode affects this binding
