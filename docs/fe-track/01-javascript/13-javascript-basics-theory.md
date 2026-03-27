# JavaScript Basics Theory / Lý Thuyết JavaScript Cơ Bản

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 13 / Kiến Thức JavaScript Nền Tảng - Chương 13

[← Back to Functional Programming](./12-functional-programming.md) | [Next: JavaScript Type System Theory →](./14-javascript-type-system-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Debug challenge:** Senior engineer nhận ticket: "Tại sao `price == false` là `true` khi `price = 0`?" — Junior fix bằng cách thêm `|| price === 0` nhưng vẫn không hiểu tại sao. Engineer giải thích bằng Abstract Equality Algorithm: `false` → ToNumber → `0`, `0 == 0` → `true`. Sau đó fix đúng: `price != null` (only null/undefined are treated as equal by `!=`). Ticket đóng trong 5 phút.

**Bài học:** Biết spec-level behavior (ToPrimitive, ToNumber, Abstract Equality steps) không phải "overthinking" — đây là công cụ debug xác định. Khi gặp coercion bug trong production, engineer biết spec sẽ fix trong phút, engineer chỉ biết syntax sẽ trial-and-error trong giờ.

## What & Why / Cái Gì & Tại Sao

**Analogy:** ECMAScript spec giống legal contract — mọi behavior của JavaScript đều được định nghĩa ở đó. Khi JavaScript làm điều "bất ngờ", nó chỉ đang tuân thủ spec chính xác. Biết spec = đọc được contract = không bị bất ngờ.

**Scope của doc này:** Spec-level explanations của Execution Context (Creation/Execution phases), Abstract Operations (ToPrimitive/ToNumber/ToString/ToBoolean), và Equality Algorithms. Syntax basics → xem [00-javascript-basics.md](./00-javascript-basics.md). Scope/Hoisting → xem [02-scope-hoisting-comprehensive.md](./02-scope-hoisting-comprehensive.md).

## Concept Map / Bản Đồ Khái Niệm

```
[ECMAScript Spec-Level Concepts]
        │
        ├── Execution Context
        │       ├── Creation Phase: allocate bindings (var=undefined, let/const=TDZ, fn=hoisted)
        │       ├── Execution Phase: run statements line by line
        │       └── Call Stack: LIFO stack of execution contexts
        │
        ├── Lexical/Variable Environments
        │       ├── Environment Record: binding → { mutable, initialized, value }
        │       ├── Outer reference: forms the Scope Chain
        │       └── TDZ: let/const are bound but uninitialized until declaration line
        │
        ├── Type System Internals
        │       ├── 8 language types: undefined, null, boolean, number, bigint, string, symbol, object
        │       └── typeof null = "object" (historical bug)
        │
        └── Abstract Operations (how coercion works)
                ├── ToPrimitive(input, hint) → valueOf or toString
                ├── ToNumber: undefined→NaN, null→0, false→0, true→1, ""→0, "42"→42, []→0, {}→NaN
                ├── ToString: undefined→"undefined", null→"null", []→"", {}→"[object Object]"
                ├── ToBoolean: false for (false, 0, -0, 0n, "", null, undefined, NaN) — all else true
                └── Abstract Equality (==): apply ToNumber/ToString rules before comparing
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Execution Context — The Two-Phase Model

**🧠 Memory Hook:** "**Creation Phase = scan and reserve; Execution Phase = run line by line**. Hoisting IS the Creation Phase."

**Why does this exist? / Tại sao tồn tại?**

- Why does JavaScript need a "Creation Phase"? Because functions and `var` declarations are available before their line — the engine must scan and prepare bindings before execution starts
- Why do `let`/`const` behave differently from `var` in the Creation Phase? By spec design: `var` is initialized to `undefined` during Creation, but `let`/`const` are bound but marked uninitialized — accessing them before their line = ReferenceError (TDZ)
- Why does this matter for debugging? When you see `undefined` vs `ReferenceError` for the same pattern, the difference is exactly which phase behavior you triggered

**Visual — Creation Phase binding states:**

```
function example() {
  console.log(a)    // undefined (var initialized in Creation)
  console.log(b)    // ReferenceError (let in TDZ during Creation)
  console.log(fn)   // ƒ fn() { } (function hoisted fully in Creation)

  var a = 1
  let b = 2
  function fn() { return 42 }
}

CREATION PHASE (before line 1 runs):
  a   → binding { mutable: true, initialized: true, value: undefined }
  b   → binding { mutable: true, initialized: false, value: ??? }  ← TDZ
  fn  → binding { mutable: true, initialized: true, value: [Function fn] }

EXECUTION PHASE (line by line):
  Line 2: a = 1  → a.value = 1
  Line 3: b = 2  → b.initialized = true, b.value = 2
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Hoisting moves code to the top" | Code position is unchanged — the Creation Phase processes declarations before line-by-line execution | Hoisting = Creation Phase processes declarations before execution — code doesn't move |
| "`let` is not hoisted" | `let` bindings ARE created during Creation Phase — they're just not initialized (Temporal Dead Zone) | `let` IS bound during Creation (hoisted) — just not initialized (TDZ) |
| "`var` in a block leaks to function scope" | This is the intended behavior by spec, not a bug — `var` has always been function-scoped | `var` has function scope, not block scope — this IS the behavior, not a bug |
| "Function expressions are hoisted like declarations" | `const fn = () => {}` — the `const` binding is in TDZ; only `function fn(){}` gets fully hoisted with its value | `const fn = () => {}` — the `const` binding is TDZ; only `function fn()` gets fully hoisted |

**🎯 Interview Pattern:**

- **Trigger**: "hoisting" / "TDZ" / "why undefined vs ReferenceError"
- **Concept**: Creation Phase sets up bindings; which kind (var/let/fn) determines initial state
- **Opening**: "Hoisting is really the Creation Phase of Execution Context. All bindings are set up before code runs. `var` gets initialized to `undefined`, function declarations get the full function, but `let`/`const` are bound yet uninitialized — accessing them in that window is the TDZ ReferenceError..."

**🔑 Knowledge Chain:**

- **Prereq**: Variables and scoping basics
- **Enables**: Debugging hoisting bugs, understanding closures (closure captures the environment record), explaining `this` binding (determined during Creation Phase)

---

### 2. Abstract Operations — How Coercion Actually Works

**🧠 Memory Hook:** "**ToPrimitive → hint? → valueOf or toString. '+' prefers strings. '-' forces numbers.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does JavaScript allow `"5" - true`? Because the engine applies ToNumber to both operands for arithmetic — it's spec'd behavior, not an accident
- Why does `+` behave differently from `-`? Because `+` is ambiguous (concatenation or addition) — the spec says if either operand is a string, do string concatenation; `-` has no string meaning, so it always applies ToNumber
- Why does `[] == false` evaluate to `true`? Because the Abstract Equality Algorithm converts both sides: `false` → `0`, `[]` → ToPrimitive → `""` → `0`, then `0 === 0` → `true`

**Visual — Abstract Operations chain:**

```
ToPrimitive(obj, hint):
  1. Check Symbol.toPrimitive method → call with hint
  2. If hint is "number": try valueOf() → if not primitive, try toString()
  3. If hint is "string": try toString() → if not primitive, try valueOf()
  4. Default hint: "number" (except Date which uses "string")

ToNumber conversion table:
  undefined  → NaN
  null       → 0
  false      → 0, true → 1
  ""         → 0, "42" → 42, "abc" → NaN
  []         → ToPrimitive("") → "" → 0
  {}         → ToPrimitive("[object Object]") → NaN
  [1]        → ToPrimitive("1") → 1

"5" - true:
  ToNumber("5") → 5
  ToNumber(true) → 1
  5 - 1 = 4  ✓

"5" + true:
  "5" is string → string concatenation hint
  ToString(true) → "true"
  "5" + "true" = "5true"  ← different operator!
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "`+` always does math" | `+` is overloaded — if either operand is a string or coerces to string, it concatenates instead | `+` does concatenation if either side is a string or object coercing to string |
| "ToBoolean follows ToNumber" | They are independent operations — `""` is falsy (ToBoolean) but `ToNumber("") = 0`, not NaN | ToBoolean is independent — `""` is falsy but `ToNumber("") = 0`, not NaN |
| "`[]` is falsy" | `[]` is an object — all objects are truthy in ToBoolean; `[] == false` uses a different coercion path | `[]` is TRUTHY (ToBoolean of object = true) — but `[] == false` is true via different coercion path |
| "null == 0 is true" | `null` has a special-case rule in the spec: it only equals `undefined` via `==` — nothing else | `null == undefined` is true (spec special case) but `null == 0` is false |

**🎯 Interview Pattern:**

- **Trigger**: "explain this coercion result" / "== vs ===" / "why is this bug happening"
- **Concept**: ToPrimitive → hint → valueOf/toString; operator determines hint
- **Opening**: "This is the ToPrimitive/ToNumber chain. When JavaScript coerces `[]`, it calls ToPrimitive with 'number' hint, which calls `[].valueOf()` (returns `[]`, not primitive), then `[].toString()` which returns `''`, then ToNumber('') which is `0`. So `[] == 0` is `true`..."

**🔑 Knowledge Chain:**

- **Prereq**: Primitive vs reference types, string/number operators
- **Enables**: Debugging `==` bugs, understanding why `Boolean({}) === true` but `{} == false` coerces strangely, TypeScript type narrowing

---

### 3. Abstract Equality Algorithm — `==` Step by Step

**🧠 Memory Hook:** "**null/undefined are only equal to each other. `==` converts to numbers. `===` never converts.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does `==` do type coercion at all? Language design decision from 1995 — "helpful" for comparing `"42" == 42` in early web forms. In hindsight, considered a mistake (most style guides ban `==`)
- Why is `null == undefined` special? Spec explicitly defines it as `true` as a special case — `null` and `undefined` only equal each other and nothing else via `==`
- Why does `Object.is` exist separately? `===` has two edge cases: `NaN !== NaN` and `+0 === -0`. `Object.is` fixes both — used internally by React's state comparison

**Definition — `==` Abstract Equality Algorithm steps:**

```
x == y:
1. Same type? → use === semantics (numbers: NaN≠NaN, -0=+0)
2. null == undefined? → true (special case)
3. undefined == null? → true (special case)
4. Number == String? → ToNumber(String), recurse
5. Boolean == anything? → ToNumber(Boolean), recurse
6. Object == Number/String/Symbol? → ToPrimitive(Object), recurse

=== Strict Equality (never coerces):
  Different types → false (always)
  NaN === NaN → false (always)

Object.is (SameValue):
  NaN, NaN → true ← fixes ===
  +0, -0 → false ← fixes ===
  Everything else same as ===
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Use `==` with explicit conversion" | Still confusing and bug-prone — implicit coercion behavior is hard to predict | Just use `===` everywhere; add explicit cast if needed |
| "NaN == NaN is true" | `NaN !== NaN` by spec — NaN is the only value not equal to itself | Use `Number.isNaN()` or `Object.is(x, NaN)` to check for NaN |
| "`null == 0` is true" | `null` has a spec special case: only equals `undefined` in `==`; all other comparisons return false | `null` only `== undefined` in the spec — `null == 0` is `false` |
| "React uses `===` for state comparison" | React uses `Object.is` which differs from `===` on `NaN` (equal) and `+0`/`-0` (not equal) | React (and Zustand/Jotai) use `Object.is` — that's why setting state to `NaN` twice still triggers re-render on first, not second |

**🎯 Interview Pattern:**

- **Trigger**: "explain `==` vs `===`" / "when is NaN equal to NaN" / "React state comparison"
- **Concept**: Abstract Equality Algorithm steps; Object.is for NaN and -0
- **Opening**: "The Abstract Equality Algorithm has specific steps: first check same type (use ===), then handle null/undefined special case, then convert booleans to numbers, then convert strings to numbers, then ToPrimitive for objects. That's why `null == undefined` is true but `null == 0` is false..."

**🔑 Knowledge Chain:**

- **Prereq**: Primitive types, ToNumber abstract operation
- **Enables**: React `Object.is` state comparison, `Number.isNaN` vs global `isNaN`, TypeScript strict null checks design

---

## Reference Theory / Lý Thuyết Tham Khảo

## 1. Specification Types vs Language Types / Kiểu Đặc Tả vs Kiểu Ngôn Ngữ

### 🟢 [Junior] Language Types in JavaScript / Kiểu Ngôn Ngữ Trong JavaScript

**English:** JavaScript language values are what developers can directly create and manipulate.

**Tiếng Việt:** Kiểu ngôn ngữ JavaScript là các giá trị mà lập trình viên có thể tạo và thao tác trực tiếp.

- Undefined
- Null
- Boolean
- Number
- BigInt
- String
- Symbol
- Object

```javascript
const v1 = undefined;
const v2 = null;
const v3 = true;
const v4 = 42;
const v5 = 42n;
const v6 = "hello";
const v7 = Symbol("id");
const v8 = { key: "value" };
```

### 🟡 [Mid] Specification Types / Kiểu Đặc Tả ECMAScript

**English:** Specification Types are internal model types used by the ECMAScript spec. They are not direct runtime values in user code.

**Tiếng Việt:** Kiểu đặc tả là mô hình nội bộ được dùng trong tài liệu ECMAScript. Chúng không phải giá trị runtime trực tiếp trong code người dùng.

- **Reference**
- **List**
- **Completion Record**
- **Property Descriptor**
- **Lexical Environment**
- **Environment Record**
- **Data Block**
- **Job Record**

**English:** Example: assignment uses internal `Reference` records (`base`, `referencedName`, `strict`).

**Tiếng Việt:** Ví dụ: phép gán dùng `Reference` nội bộ (`base`, `referencedName`, `strict`).

### 🔴 [Senior] Why Interviewers Ask This / Vì Sao Nhà Tuyển Dụng Hỏi Phần Này

**English:** This distinction helps explain behavior that appears “magical,” especially hoisting, TDZ, `this` binding, and coercion.

**Tiếng Việt:** Phân biệt này giúp giải thích các hành vi tưởng như “ma thuật”, đặc biệt là hoisting, TDZ, ràng buộc `this`, và coercion.

---

## 2. Execution Context Theory / Lý Thuyết Execution Context

### 🟢 [Junior] What Is an Execution Context? / Execution Context Là Gì?

**English:** An execution context is the environment in which JavaScript code is evaluated and executed.

**Tiếng Việt:** Execution context là môi trường nơi code JavaScript được đánh giá và thực thi.

Three main types / Ba loại chính:

- Global Execution Context
- Function Execution Context
- Eval Execution Context (rare / hiếm gặp)

### 🟡 [Mid] Creation Phase and Execution Phase / Pha Tạo và Pha Thực Thi

**English:** Every context runs in 2 conceptual phases.

**Tiếng Việt:** Mỗi context chạy qua 2 pha khái niệm.

1. **Creation phase**: allocate bindings, setup scope, determine `this`.
2. **Execution phase**: run statements line by line.

```javascript
console.log(a); // undefined (var binding exists in creation phase)
var a = 10;

foo(); // works (function declaration hoisted)
function foo() {
  console.log("foo");
}
```

### 🔴 [Senior] Context Stack vs Call Stack / Context Stack và Call Stack

**English:** The call stack stores execution contexts in LIFO order. Recursive overgrowth causes stack overflow.

**Tiếng Việt:** Call stack lưu execution context theo thứ tự LIFO. Đệ quy quá sâu gây stack overflow.

```javascript
function recurse(n) {
  if (n === 0) return 0;
  return recurse(n - 1) + 1;
}

console.log(recurse(5)); // 5
```

---

## 3. Variable Environment and Lexical Environment / Môi Trường Biến và Môi Trường Từ Vựng

### 🟢 [Junior] Variable Environment / Môi Trường Biến

**English:** Historically associated with `var` and function declarations.

**Tiếng Việt:** Về lịch sử, thường gắn với `var` và function declaration.

### 🟢 [Junior] Lexical Environment / Môi Trường Từ Vựng

**English:** Associated with block-scoped declarations (`let`, `const`, class declarations).

**Tiếng Việt:** Gắn với khai báo phạm vi khối (`let`, `const`, class declaration).

### 🟡 [Mid] Environment Record / Bản Ghi Môi Trường

**English:** Environment record maps identifiers to bindings (`mutable`, `initialized`, `value`).

**Tiếng Việt:** Environment record ánh xạ định danh tới binding (`mutable`, `initialized`, `value`).

Pseudo model / Mô hình giả lập:

```text
Binding {
  name: string,
  mutable: boolean,
  initialized: boolean,
  value: any
}
```

### 🔴 [Senior] Temporal Dead Zone / Vùng Chết Tạm Thời

**English:** `let`/`const` bindings exist during creation but remain uninitialized until declaration execution.

**Tiếng Việt:** Binding `let`/`const` tồn tại từ pha tạo nhưng chưa khởi tạo cho đến khi chạy tới dòng khai báo.

```javascript
{
  // console.log(x); // ReferenceError
  let x = 1;
  console.log(x); // 1
}
```

---

## 4. Scope Chain Theory / Lý Thuyết Scope Chain

### 🟢 [Junior] Lexical Scope / Phạm Vi Từ Vựng

**English:** Scope is decided by where code is written, not where function is called.

**Tiếng Việt:** Scope được quyết định bởi vị trí code được viết, không phải nơi hàm được gọi.

```javascript
const a = "global";
function outer() {
  const b = "outer";
  function inner() {
    const c = "inner";
    console.log(a, b, c);
  }
  inner();
}
outer();
```

### 🟡 [Mid] Identifier Resolution / Cơ Chế Tra Cứu Định Danh

**English:** Resolution searches current environment first, then outer environments recursively until global or failure.

**Tiếng Việt:** Quá trình tra cứu tìm môi trường hiện tại trước, sau đó lên môi trường cha cho đến global hoặc thất bại.

Search order / Thứ tự tìm:

1. Local bindings
2. Enclosing function bindings
3. Global bindings
4. `ReferenceError`

### 🔴 [Senior] Closures Preserve Environment / Closure Giữ Lại Môi Trường

**English:** A closure captures references to outer bindings, not copies of values at declaration time.

**Tiếng Việt:** Closure bắt giữ tham chiếu đến binding bên ngoài, không phải bản sao giá trị tại thời điểm khai báo.

```javascript
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const c = createCounter();
console.log(c()); // 1
console.log(c()); // 2
```

---

## 5. Hoisting Mechanism / Cơ Chế Hoisting

### 🟢 [Junior] What Is Hoisting? / Hoisting Là Gì?

**English:** Hoisting is a teaching term describing how declarations are handled before execution.

**Tiếng Việt:** Hoisting là thuật ngữ mô tả việc khai báo được xử lý trước khi chạy code.

### 🟢 [Junior] `var` Hoisting / Hoisting của `var`

```javascript
console.log(v); // undefined
var v = 10;
```

**English:** `var` is created and initialized to `undefined` in creation phase.

**Tiếng Việt:** `var` được tạo và khởi tạo thành `undefined` trong pha tạo.

### 🟡 [Mid] Function Declaration Hoisting / Hoisting của Function Declaration

```javascript
sayHi(); // works
function sayHi() {
  console.log("hi");
}
```

### 🟡 [Mid] Function Expression and Arrow / Function Expression và Arrow

```javascript
// hello(); // TypeError or ReferenceError depending declaration
var hello = function () {
  console.log("hello");
};

// greet(); // ReferenceError (TDZ)
const greet = () => {
  console.log("greet");
};
```

### 🔴 [Senior] Hoisting + Shadowing / Hoisting kết hợp Shadowing

```javascript
var name = "global";
function demo() {
  console.log(name); // undefined
  var name = "local";
  console.log(name); // local
}
demo();
```

---

## 6. Type System Internals / Nội Bộ Hệ Thống Kiểu

### 🟢 [Junior] Primitive vs Object / Primitive và Object

**English:** Primitives are immutable values; objects are mutable collections with identity and prototype linkage.

**Tiếng Việt:** Primitive là giá trị bất biến; object là tập thuộc tính có thể thay đổi, có danh tính và liên kết prototype.

```javascript
const s = "abc";
// s[0] = "x"; // no effect

const obj = { a: 1 };
obj.a = 2; // mutable
```

### 🟡 [Mid] Wrapper Objects / Đối Tượng Bao

**English:** JavaScript temporarily boxes primitives when calling methods (`"abc".toUpperCase()`).

**Tiếng Việt:** JavaScript tạm “đóng gói” primitive thành wrapper khi gọi method (`"abc".toUpperCase()`).

### 🟡 [Mid] Internal Slots / Internal Slots

**English:** Objects in spec have internal slots like `[[Prototype]]`, `[[Extensible]]`, function `[[Call]]`, etc.

**Tiếng Việt:** Trong đặc tả, object có internal slot như `[[Prototype]]`, `[[Extensible]]`, function `[[Call]]`, ...

### 🔴 [Senior] Why `typeof null` is `"object"` / Vì Sao `typeof null` là `"object"`

**English:** Historical design bug for backward compatibility. `null` is still a primitive semantic type.

**Tiếng Việt:** Đây là lỗi lịch sử được giữ lại vì tương thích ngược. Về ngữ nghĩa, `null` vẫn là primitive.

---

## 7. Coercion Rules and Abstract Operations / Quy Tắc Coercion và Thao Tác Trừu Tượng

### 🟢 [Junior] ToBoolean / Chuyển sang Boolean

Falsy values / Giá trị falsy:

- `false`
- `0`
- `-0`
- `0n`
- `""`
- `null`
- `undefined`
- `NaN`

```javascript
Boolean(0); // false
Boolean([]); // true
Boolean({}); // true
```

### 🟡 [Mid] ToNumber / Chuyển sang Number

```javascript
Number(undefined); // NaN
Number(null); // 0
Number(true); // 1
Number(false); // 0
Number("  42  "); // 42
Number(""); // 0
Number("0x10"); // 16
```

### 🟡 [Mid] ToString / Chuyển sang String

```javascript
String(undefined); // "undefined"
String(null); // "null"
String(true); // "true"
String(123); // "123"
```

### 🔴 [Senior] ToPrimitive / Chuyển sang Primitive

**English:** For object-to-primitive conversion, JS checks `Symbol.toPrimitive`, then `valueOf`/`toString` by hint.

**Tiếng Việt:** Khi chuyển object sang primitive, JS kiểm tra `Symbol.toPrimitive`, sau đó `valueOf`/`toString` tùy hint.

```javascript
const item = {
  valueOf() {
    return 100;
  },
  toString() {
    return "item";
  },
};

console.log(item + 1); // 101 (number hint path)
console.log(String(item)); // "item" (string hint path)
```

### 🔴 [Senior] Coercion in Operators / Coercion Trong Toán Tử

```javascript
// "5" + 1 => "51"
// "5" - 1 => 4
// "5" * "2" => 10
// "5" / "2" => 2.5
// [] + {} => "[object Object]" (environment-dependent formatting)
// {} + [] => 0 or "[object Object]" depending parse context
```

---

## 8. Equality Algorithms / Thuật Toán So Sánh Bằng

### 🟢 [Junior] Strict Equality (`===`) / So Sánh Nghiêm Ngặt

**English:** No coercion. Types must match first.

**Tiếng Việt:** Không coercion. Kiểu phải khớp trước.

```javascript
5 === "5"; // false
5 === 5; // true
NaN === NaN; // false
```

### 🟡 [Mid] Abstract Equality (`==`) / So Sánh Trừu Tượng

**English:** Coercion-based algorithm with specific ECMAScript rules.

**Tiếng Việt:** Thuật toán dựa trên coercion với quy tắc cụ thể trong ECMAScript.

```javascript
0 == false; // true
"" == 0; // true
null == undefined; // true
[] == ""; // true
```

### 🔴 [Senior] `Object.is` vs `===` / `Object.is` so với `===`

```javascript
Object.is(NaN, NaN); // true
NaN === NaN; // false

Object.is(+0, -0); // false
+0 === -0; // true
```

---

## 9. Interview Traps and Best Practices / Bẫy Phỏng Vấn và Thực Hành Tốt

### 🟡 [Mid] Practice 1 / Thực Hành 1

- **English:** Avoid `var` in modern code / Tránh `var` trong code hiện đại
- **Tiếng Việt:** Use `const` by default, `let` when reassignment needed / Dùng `const` mặc định, `let` khi cần gán lại

### 🟡 [Mid] Practice 2 / Thực Hành 2

- **English:** Prefer `===` over `==` / Ưu tiên `===` thay vì `==`
- **Tiếng Việt:** Only use `x == null` when intentionally matching null+undefined / Chỉ dùng `x == null` khi cố ý gom null+undefined

### 🟡 [Mid] Practice 3 / Thực Hành 3

- **English:** Do not rely on implicit coercion in critical logic / Không dựa vào coercion ngầm ở logic quan trọng
- **Tiếng Việt:** Convert explicitly with Number/String/Boolean / Chuyển đổi rõ ràng bằng Number/String/Boolean

### 🟡 [Mid] Practice 4 / Thực Hành 4

- **English:** Understand TDZ before using `let`/`const` everywhere / Hiểu TDZ trước khi dùng `let`/`const` toàn bộ
- **Tiếng Việt:** Prevents runtime ReferenceError surprises / Tránh lỗi ReferenceError bất ngờ

### 🟡 [Mid] Practice 5 / Thực Hành 5

- **English:** Be careful with object mutation / Cẩn thận với thay đổi object
- **Tiếng Việt:** Use immutable patterns in state management / Ưu tiên pattern bất biến khi quản lý state

### 🔴 [Senior] Architecture-Level Advice / Lời Khuyên Cấp Kiến Trúc

- Keep domain logic free from coercion ambiguity.
- Isolate parsing/validation at boundaries (API, form, storage).
- Model `null` vs `undefined` intentionally in contracts.
- Write tests for conversion edge cases.

- Giữ logic domain không mơ hồ bởi coercion.
- Cô lập parse/validation ở ranh giới (API, form, storage).
- Mô hình hóa `null` và `undefined` có chủ đích trong contract.
- Viết test cho các trường hợp chuyển đổi biên.

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Explain hoisting precisely — what is actually happening under the hood? 🟡 Mid

**A:** Hoisting is the Creation Phase of the Execution Context. Before any code runs, the engine scans the scope and creates bindings for all declarations: `var` → bound + initialized to `undefined`; function declarations → bound + initialized to the full function object; `let`/`const` → bound but _uninitialized_ (TDZ). Code doesn't "move" — it's the Creation Phase that runs before the Execution Phase.

Hoisting là Creation Phase của Execution Context. Engine scan scope trước khi chạy code, tạo bindings: `var` được khởi tạo `undefined`, function declaration được khởi tạo với function object, `let`/`const` được bind nhưng chưa khởi tạo (TDZ). Code không di chuyển lên trên — đó là Creation Phase chạy trước Execution Phase.

**💡 Interview Signal:**

- ✅ Strong: Uses "Creation Phase" terminology, distinguishes var/fn/let behavior, explains TDZ as "bound but uninitialized"
- ❌ Weak: "Variables move to the top of the file" — code never moves; this mental model leads to bugs

---

### Q: Why is `[] == false` true but `Boolean([]) === true`? / Vì sao `[] == false` là true nhưng `Boolean([]) === true`? 🟡 Mid

**A:** Because `==` and `Boolean()` use different algorithms. `Boolean([])` calls ToBoolean — all objects are truthy, so `true`. `[] == false` uses Abstract Equality Algorithm: first convert `false` via ToNumber → `0`; then convert `[]` via ToPrimitive → `""` → ToNumber → `0`; finally `0 == 0` → `true`. Two different specs paths for the same value.

`Boolean([])` dùng ToBoolean — tất cả objects đều truthy → `true`. `[] == false` dùng Abstract Equality: `false` → ToNumber → `0`; `[]` → ToPrimitive → `""` → `0`; so sánh `0 == 0` → `true`. Hai algorithm khác nhau cho cùng một value.

**💡 Interview Signal:**

- ✅ Strong: Names both algorithms (ToBoolean vs Abstract Equality), traces the conversion steps for `[]`, shows why results differ
- ❌ Weak: "Arrays are truthy" — correct but doesn't explain the `[] == false` result

---

### Q: What's the difference between `==`, `===`, and `Object.is`? 🟡 Mid

**A:** `==` (Abstract Equality) applies type coercion before comparison. `===` (Strict Equality) compares type and value without coercion — different types always return `false`. `Object.is` is same as `===` except: `Object.is(NaN, NaN)` → `true` (fixing `NaN !== NaN`), and `Object.is(+0, -0)` → `false` (fixing `+0 === -0`). React uses `Object.is` for state comparison — that's why setting state to `NaN` twice triggers one re-render, not two.

`==` có coercion. `===` không coercion. `Object.is` giống `===` ngoại trừ: `NaN` bằng chính nó, `+0` không bằng `-0`. React dùng `Object.is` cho state comparison — hiểu điều này giúp debug tại sao `useState(NaN)` chỉ trigger re-render lần đầu.

**💡 Interview Signal:**

- ✅ Strong: Names the two `===` edge cases, explains React's use of `Object.is`, shows practical implication
- ❌ Weak: "`===` is always safer" — misses the NaN case where `Object.is` is the right tool

---

### Q: What is TDZ and why is it useful — not just what it is? 🟢 Junior

**A:** TDZ (Temporal Dead Zone) = the period between a `let`/`const` binding being created (Creation Phase) and its declaration line being executed. Accessing a variable in its TDZ throws `ReferenceError`. It's useful because it catches a class of bugs: with `var`, accessing before declaration silently returns `undefined` — a bug that's hard to track. TDZ turns that into an immediate, obvious error.

TDZ là khoảng thời gian giữa lúc binding được tạo ra (Creation Phase) và lúc declaration được thực thi. Access trong TDZ → `ReferenceError`. Lý do hữu ích: `var` trả về `undefined` silently khi access trước declaration — bug âm thầm khó trace. TDZ biến nó thành error ngay lập tức.

**💡 Interview Signal:**

- ✅ Strong: Explains WHY TDZ is useful (catches silent `var` undefined bug), frames it as intentional design choice
- ❌ Weak: "TDZ means you can't use let before declaration" — only describes behavior, not the design reasoning

---

### Q: You have a production bug: `if (count)` skips processing when count is 0. Fix it and explain the spec-level reason. 🔴 Senior

**A:** `if (count)` applies ToBoolean — `0` is in the falsy set (`false, 0, -0, 0n, "", null, undefined, NaN`). Fix: `if (count != null)` — checks only for null/undefined (Abstract Equality's special case), treating `0` as valid. Or explicitly: `if (count !== undefined && count !== null)`. Spec-level diagnosis: the bug is ToBoolean treating `0` as falsy, when the intent is "was a count provided?" (null/undefined check), not "is the count nonzero?" (truthiness check).

`if (count)` dùng ToBoolean — `0` là falsy. Fix: `if (count != null)` — chỉ check null/undefined. Spec diagnosis: bug là nhầm ToBoolean với null check. Khi giải thích cho team, framing bằng spec terms giúp PR review nhanh hơn.

**💡 Interview Signal:**

- ✅ Strong: Names `ToBoolean`, lists the falsy set, gives correct fix (`!= null`), explains null/undefined special case in `==`
- ❌ Weak: "Use strict equality" — `count !== undefined` alone doesn't handle `null`; shows incomplete understanding of null vs undefined semantics

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                          | Level | One-liner                                                                                       |
| --- | ------------------------------ | ----- | ----------------------------------------------------------------------------------------------- |
| 1   | Hoisting = Creation Phase      | 🟡    | var→undefined, fn→full object, let/const→TDZ (bound but uninitialized)                          |
| 2   | `[] == false` vs `Boolean([])` | 🟡    | Different algorithms: ToBoolean(object)=true; `==` uses Abstract Equality (converts to numbers) |
| 3   | `==` vs `===` vs `Object.is`   | 🟡    | `==` coerces; `===` no coerce; `Object.is` fixes NaN and +0/-0 edge cases                       |
| 4   | TDZ purpose                    | 🟢    | Turns silent `var undefined` bug into explicit ReferenceError — intentional safety              |
| 5   | `if (count)` bug               | 🔴    | ToBoolean treats 0 as falsy; fix with `count != null` (null/undefined special case)             |

---

## ⚡ Cold Call Simulation

**Q: "Walk me through exactly what happens when JavaScript runs `[] == false`."**

**30-second answer:**

"The `==` operator uses the Abstract Equality Algorithm, not ToBoolean. Step one: `false` is a Boolean, so apply ToNumber — `false` becomes `0`. Now we have `[] == 0`. Step two: `[]` is an Object and `0` is a Number, so apply ToPrimitive to `[]` — it calls `[].valueOf()` which returns `[]` (not primitive), then calls `[].toString()` which returns the empty string `''`. Now we have `'' == 0`. Step three: `''` is a String and `0` is a Number, so apply ToNumber to `''` — empty string becomes `0`. Now we have `0 == 0`. Same type, same value — `true`. Meanwhile, `Boolean([])` uses ToBoolean, which says all objects are truthy. Same value, two different spec algorithms, opposite results."

---

## Quick Reference / Tóm Tắt Nhanh

### Coercion Conversion Table

| Value       | ToNumber | ToString            | ToBoolean |
| ----------- | -------: | ------------------- | --------- |
| `undefined` |    `NaN` | `"undefined"`       | `false`   |
| `null`      |      `0` | `"null"`            | `false`   |
| `true`      |      `1` | `"true"`            | `true`    |
| `false`     |      `0` | `"false"`           | `false`   |
| `""`        |      `0` | `""`                | `false`   |
| `"42"`      |     `42` | `"42"`              | `true`    |
| `[]`        |      `0` | `""`                | `true`    |
| `{}`        |    `NaN` | `"[object Object]"` | `true`    |

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Name the 3 binding states for `var`, `function`, and `let/const` after the Creation Phase
- **Visual**: Trace `[] == false` step-by-step through the Abstract Equality Algorithm — which spec operations are called?
- **Application**: Your code has `if (user.age)` but `age = 0` is a valid value. Fix it and explain which abstract operation was causing the bug.
- **Debug**: `NaN === NaN` returns `false` — your code uses this to check for invalid number. What should you use instead and why?
- **Teach**: Explain to a junior why `typeof null === "object"` — and why it hasn't been fixed despite being a 30-year-old bug.

> 🎯 **Feynman Prompt:** Giải thích cho người không biết lập trình: tại sao JavaScript lại "tự động" chuyển đổi kiểu dữ liệu — tại sao `[] == false` lại là `true` và hoisting khiến code hoạt động khác với thứ tự bạn viết như thế nào?

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [JavaScript Basics](./00-javascript-basics.md) — syntax-level basics before spec-level theory
- ⬅️ **Built on**: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — scope chain and TDZ in practice
- ⬅️ **Built on**: [Variables & Data Types](./01-variables-data-types.md) — var/let/const practical usage
- 🔗 **Applied in**: [TypeScript Type System](../02-typescript/01-type-system-basics.md) — TypeScript's strict null checks design is motivated by null/undefined semantics here
- 🔗 **Applied in**: [React Performance](../03-react/09-performance-optimization.md) — React's `Object.is` state comparison is the Abstract Equality/Object.is distinction in practice

### Glossary / Thuật Ngữ

- **Execution Context**: Môi trường thực thi hiện tại của code (Creation + Execution phases)
- **TDZ (Temporal Dead Zone)**: Vùng binding let/const tồn tại nhưng chưa initialized
- **ToPrimitive**: Thuật toán chuyển object → primitive (valueOf → toString, or Symbol.toPrimitive)
- **ToNumber**: Thuật toán chuẩn hóa sang số (`undefined`→NaN, `null`→0, `[]`→0, `{}`→NaN)
- **ToBoolean**: Thuật toán boolean — only 8 falsy values; all objects are truthy
- **Abstract Equality**: Thuật toán `==` — converts types before comparing
- **Strict Equality**: Thuật toán `===` — no coercion; different types = false
- **Object.is**: SameValue algorithm — fixes NaN and +0/-0 edge cases in `===`
- **Scope Chain**: Chuỗi tra cứu binding từ current environment đến outer environments

[← Back to Functional Programming](./12-functional-programming.md) | [Next: JavaScript Type System Theory →](./14-javascript-type-system-theory.md)
