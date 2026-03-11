# JavaScript Basics Theory / Lý Thuyết JavaScript Cơ Bản
## JavaScript Fundamentals - Chapter 13 / Kiến Thức JavaScript Nền Tảng - Chương 13

[← Back to Functional Programming](./12-functional-programming.md) | [Next: JavaScript Type System Theory →](./14-javascript-type-system-theory.md)

---

## Overview / Tổng Quan

**English:** This chapter explains JavaScript basics from the ECMAScript specification perspective: execution context, variable environment, scope chain, hoisting, type internals, and coercion abstract operations.

**Tiếng Việt:** Chương này giải thích nền tảng JavaScript theo góc nhìn đặc tả ECMAScript: execution context, variable environment, scope chain, hoisting, nội bộ kiểu dữ liệu, và các thao tác chuyển đổi kiểu trừu tượng.

**English:** Goal: build interview-ready mental models, not only syntax memorization.

**Tiếng Việt:** Mục tiêu: xây dựng mô hình tư duy sẵn sàng cho phỏng vấn, không chỉ ghi nhớ cú pháp.

---

## Table of Contents / Mục Lục
1. [Specification Types vs Language Types / Kiểu Đặc Tả vs Kiểu Ngôn Ngữ](#1-specification-types-vs-language-types--kiểu-đặc-tả-vs-kiểu-ngôn-ngữ)
2. [Execution Context Theory / Lý Thuyết Execution Context](#2-execution-context-theory--lý-thuyết-execution-context)
3. [Variable Environment and Lexical Environment / Môi Trường Biến và Môi Trường Từ Vựng](#3-variable-environment-and-lexical-environment--môi-trường-biến-và-môi-trường-từ-vựng)
4. [Scope Chain Theory / Lý Thuyết Scope Chain](#4-scope-chain-theory--lý-thuyết-scope-chain)
5. [Hoisting Mechanism / Cơ Chế Hoisting](#5-hoisting-mechanism--cơ-chế-hoisting)
6. [Type System Internals / Nội Bộ Hệ Thống Kiểu](#6-type-system-internals--nội-bộ-hệ-thống-kiểu)
7. [Coercion Rules and Abstract Operations / Quy Tắc Coercion và Thao Tác Trừu Tượng](#7-coercion-rules-and-abstract-operations--quy-tắc-coercion-và-thao-tác-trừu-tượng)
8. [Equality Algorithms / Thuật Toán So Sánh Bằng](#8-equality-algorithms--thuật-toán-so-sánh-bằng)
9. [Interview Traps and Best Practices / Bẫy Phỏng Vấn và Thực Hành Tốt](#9-interview-traps-and-best-practices--bẫy-phỏng-vấn-và-thực-hành-tốt)
10. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)
11. [Appendix: Quick Reference / Phụ Lục: Tóm Tắt Nhanh](#appendix-quick-reference--phụ-lục-tóm-tắt-nhanh)

---

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
const v6 = 'hello';
const v7 = Symbol('id');
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
  console.log('foo');
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
  console.log('hi');
}
```

### 🟡 [Mid] Function Expression and Arrow / Function Expression và Arrow

```javascript
// hello(); // TypeError or ReferenceError depending declaration
var hello = function () {
  console.log('hello');
};

// greet(); // ReferenceError (TDZ)
const greet = () => {
  console.log('greet');
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
  valueOf() { return 100; },
  toString() { return "item"; }
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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: What is execution context? / Execution context là gì?

**English Answer:**
Execution context is the runtime environment for executing code, including scope bindings and `this`.

**Trả Lời Tiếng Việt:**
Execution context là môi trường runtime để thực thi code, gồm binding phạm vi và `this`.

### 🟢 [Junior] Q2: Difference between `var`, `let`, `const`? / Khác biệt giữa `var`, `let`, `const`?

**English Answer:**
`var` is function-scoped and initialized as undefined; `let/const` are block-scoped and subject to TDZ.

**Trả Lời Tiếng Việt:**
`var` có phạm vi hàm và khởi tạo undefined; `let/const` có phạm vi khối và chịu TDZ.

### 🟢 [Junior] Q3: What is scope chain? / Scope chain là gì?

**English Answer:**
A lookup chain from current lexical environment to outer environments until global scope.

**Trả Lời Tiếng Việt:**
Là chuỗi tra cứu từ môi trường từ vựng hiện tại ra môi trường cha đến global.

### 🟢 [Junior] Q4: Why does `typeof null` return `"object"`? / Vì sao `typeof null` trả về `"object"`?

**English Answer:**
Historical bug retained for web compatibility.

**Trả Lời Tiếng Việt:**
Lỗi lịch sử được giữ lại để tương thích ngược trên web.

### 🟡 [Mid] Q5: Explain hoisting precisely. / Giải thích hoisting chính xác.

**English Answer:**
Declarations are processed during creation phase; `var` gets `undefined`, function declarations get function objects, `let/const` remain uninitialized until execution reaches declaration.

**Trả Lời Tiếng Việt:**
Khai báo được xử lý ở pha tạo; `var` nhận `undefined`, function declaration nhận function object, `let/const` chưa khởi tạo cho đến khi chạy đến dòng khai báo.

### 🟡 [Mid] Q6: Why is `[] == false` true? / Vì sao `[] == false` là true?

**English Answer:**
`false` becomes 0, `[]` becomes "" then 0; finally 0 == 0.

**Trả Lời Tiếng Việt:**
`false` thành 0, `[]` thành "" rồi thành 0; cuối cùng so sánh 0 == 0.

### 🟡 [Mid] Q7: Compare `==`, `===`, `Object.is`. / So sánh `==`, `===`, `Object.is`.

**English Answer:**
`==` uses coercion, `===` compares type+value without coercion, `Object.is` differs for NaN and signed zero.

**Trả Lời Tiếng Việt:**
`==` có coercion, `===` so sánh kiểu+giá trị không coercion, `Object.is` khác ở NaN và signed zero.

### 🟡 [Mid] Q8: What is TDZ and why useful? / TDZ là gì và vì sao hữu ích?

**English Answer:**
TDZ catches early access bugs before initialization, making code safer and clearer.

**Trả Lời Tiếng Việt:**
TDZ bắt lỗi truy cập sớm trước khởi tạo, giúp code an toàn và rõ ràng hơn.

### 🟡 [Mid] Q9: Explain ToPrimitive algorithm. / Giải thích thuật toán ToPrimitive.

**English Answer:**
Check `Symbol.toPrimitive`; otherwise use `valueOf/toString` order based on preferred hint.

**Trả Lời Tiếng Việt:**
Kiểm tra `Symbol.toPrimitive`; nếu không có thì dùng thứ tự `valueOf/toString` theo hint.

### 🟡 [Mid] Q10: Why prefer explicit conversion? / Vì sao nên chuyển đổi kiểu tường minh?

**English Answer:**
It prevents hidden bugs and makes intent reviewable in PRs and interviews.

**Trả Lời Tiếng Việt:**
Giúp tránh lỗi ẩn và thể hiện rõ ý đồ khi review PR hoặc phỏng vấn.

### 🔴 [Senior] Q11: How do closures affect memory? / Closure ảnh hưởng bộ nhớ thế nào?

**English Answer:**
Closures can retain outer environments; unnecessary captured references may increase memory retention.

**Trả Lời Tiếng Việt:**
Closure giữ lại môi trường bên ngoài; tham chiếu bắt giữ không cần thiết có thể giữ bộ nhớ lâu hơn.

### 🔴 [Senior] Q12: How to design APIs around null/undefined? / Thiết kế API quanh null/undefined ra sao?

**English Answer:**
Use clear contracts: missing field as undefined, explicit empty value as null, and validate at boundaries.

**Trả Lời Tiếng Việt:**
Dùng contract rõ ràng: thiếu trường dùng undefined, giá trị rỗng có chủ đích dùng null, và validate ở ranh giới hệ thống.

### 🔴 [Senior] Q13: Why does static analysis help with coercion? / Vì sao static analysis giúp xử lý coercion?

**English Answer:**
It flags suspicious implicit conversions and enforces stricter typing assumptions earlier.

**Trả Lời Tiếng Việt:**
Nó cảnh báo chuyển đổi ngầm đáng ngờ và cưỡng bức giả định kiểu chặt chẽ sớm hơn.

### 🔴 [Senior] Q14: Explain one production bug from coercion. / Nêu một lỗi production do coercion.

**English Answer:**
Example: `if (price)` rejected valid `0` prices; fix with `price != null` and numeric validation.

**Trả Lời Tiếng Việt:**
Ví dụ: `if (price)` loại nhầm giá `0`; sửa bằng `price != null` và validate số.

### 🔴 [Senior] Q15: How does this theory improve debugging speed? / Lý thuyết này giúp debug nhanh hơn thế nào?

**English Answer:**
You can reason from spec-level phases (creation/execution) and conversion operations to locate root causes deterministically.

**Trả Lời Tiếng Việt:**
Bạn có thể suy luận theo pha đặc tả (tạo/thực thi) và thao tác chuyển đổi để tìm nguyên nhân gốc một cách xác định.

---

## Appendix: Quick Reference / Phụ Lục: Tóm Tắt Nhanh

### A. Conversion Table / Bảng Chuyển Đổi

| Value | ToNumber | ToString | ToBoolean |
|---|---:|---|---|
| `undefined` | `NaN` | `"undefined"` | `false` |
| `null` | `0` | `"null"` | `false` |
| `true` | `1` | `"true"` | `true` |
| `false` | `0` | `"false"` | `false` |
| `""` | `0` | `""` | `false` |
| `"42"` | `42` | `"42"` | `true` |
| `[]` | `0` | `""` | `true` |
| `{}` | `NaN` | `"[object Object]"` | `true` |

### B. Mini Drills / Bài Tập Nhanh

#### 🟢 [Junior] Drill 1

**English Prompt:** Predict output for coercion case #1.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #1; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 2

**English Prompt:** Predict output for coercion case #2.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #2; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 3

**English Prompt:** Predict output for coercion case #3.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #3; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 4

**English Prompt:** Predict output for coercion case #4.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #4; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 5

**English Prompt:** Predict output for coercion case #5.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #5; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 6

**English Prompt:** Predict output for coercion case #6.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #6; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 7

**English Prompt:** Predict output for coercion case #7.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #7; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 8

**English Prompt:** Predict output for coercion case #8.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #8; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 9

**English Prompt:** Predict output for coercion case #9.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #9; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 10

**English Prompt:** Predict output for coercion case #10.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #10; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 11

**English Prompt:** Predict output for coercion case #11.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #11; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 12

**English Prompt:** Predict output for coercion case #12.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #12; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 13

**English Prompt:** Predict output for coercion case #13.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #13; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 14

**English Prompt:** Predict output for coercion case #14.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #14; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 15

**English Prompt:** Predict output for coercion case #15.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #15; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 16

**English Prompt:** Predict output for coercion case #16.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #16; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 17

**English Prompt:** Predict output for coercion case #17.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #17; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 18

**English Prompt:** Predict output for coercion case #18.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #18; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 19

**English Prompt:** Predict output for coercion case #19.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #19; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 20

**English Prompt:** Predict output for coercion case #20.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #20; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 21

**English Prompt:** Predict output for coercion case #21.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #21; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 22

**English Prompt:** Predict output for coercion case #22.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #22; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 23

**English Prompt:** Predict output for coercion case #23.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #23; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 24

**English Prompt:** Predict output for coercion case #24.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #24; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 25

**English Prompt:** Predict output for coercion case #25.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #25; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 26

**English Prompt:** Predict output for coercion case #26.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #26; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 27

**English Prompt:** Predict output for coercion case #27.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #27; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 28

**English Prompt:** Predict output for coercion case #28.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #28; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 29

**English Prompt:** Predict output for coercion case #29.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #29; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 30

**English Prompt:** Predict output for coercion case #30.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #30; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 31

**English Prompt:** Predict output for coercion case #31.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #31; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 32

**English Prompt:** Predict output for coercion case #32.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #32; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 33

**English Prompt:** Predict output for coercion case #33.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #33; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 34

**English Prompt:** Predict output for coercion case #34.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #34; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 35

**English Prompt:** Predict output for coercion case #35.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #35; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 36

**English Prompt:** Predict output for coercion case #36.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #36; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

#### 🟢 [Junior] Drill 37

**English Prompt:** Predict output for coercion case #37.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #37; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log("5" - true);
```

#### 🟢 [Junior] Drill 38

**English Prompt:** Predict output for coercion case #38.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #38; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log([] == 0);
```

#### 🟢 [Junior] Drill 39

**English Prompt:** Predict output for coercion case #39.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #39; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(null == undefined);
```

#### 🟢 [Junior] Drill 40

**English Prompt:** Predict output for coercion case #40.

**Gợi Ý Tiếng Việt:** Dự đoán kết quả coercion tình huống #40; sau đó giải thích bằng ToPrimitive/ToNumber/ToString/ToBoolean.

```javascript
console.log(Boolean({}));
```

### C. Glossary / Thuật Ngữ

- **Execution Context**: Môi trường thực thi hiện tại của code.
- **Lexical Environment**: Môi trường từ vựng chứa binding và liên kết outer.
- **Environment Record**: Bản ghi binding định danh.
- **Hoisting**: Cách xử lý khai báo trước khi chạy code.
- **TDZ**: Vùng trước khi binding let/const được khởi tạo.
- **Reference Type (spec)**: Bản ghi nội bộ đại diện truy cập biến/thuộc tính.
- **ToPrimitive**: Thuật toán chuyển object sang primitive.
- **ToNumber**: Thuật toán chuẩn hóa sang số.
- **ToString**: Thuật toán chuẩn hóa sang chuỗi.
- **ToBoolean**: Thuật toán chuẩn hóa sang boolean.
- **Abstract Equality**: Thuật toán `==` có coercion.
- **Strict Equality**: Thuật toán `===` không coercion.
- **SameValue**: Ngữ nghĩa `Object.is`.
- **Scope Chain**: Chuỗi tra cứu binding theo lexical scope.
- **Closure**: Hàm giữ tham chiếu tới môi trường bao ngoài.
- **Shadowing**: Biến cục bộ che biến bên ngoài cùng tên.
- **Global Object**: Đối tượng toàn cục của runtime.
- **Primitive**: Giá trị bất biến không có danh tính object.
- **Object Identity**: So sánh object theo tham chiếu.
- **Wrapper Object**: Đối tượng bao primitive tạm thời.
- **Internal Slot**: Thuộc tính nội bộ chỉ đặc tả dùng.
- **Call Stack**: Ngăn xếp context khi gọi hàm.
- **Creation Phase**: Pha thiết lập binding/context.
- **Execution Phase**: Pha thực thi từng câu lệnh.
- **Nullish**: Chỉ gồm null và undefined.
- **Falsy**: Giá trị chuyển thành false trong ToBoolean.
- **Truthy**: Giá trị chuyển thành true trong ToBoolean.
- **Spec Algorithm**: Thuật toán chính thức trong ECMAScript.
- **Deterministic Debugging**: Debug dựa trên mô hình đặc tả rõ ràng.
- **Boundary Validation**: Kiểm tra dữ liệu tại biên hệ thống.

---

## Summary / Tóm Tắt

**English:** JavaScript basics become interview strength when explained from execution contexts, environments, scope resolution, and abstract conversion algorithms.

**Tiếng Việt:** Nền tảng JavaScript trở thành lợi thế phỏng vấn khi bạn giải thích được bằng execution context, environment, scope resolution, và các thuật toán chuyển đổi trừu tượng.

---

[← Back to Functional Programming](./12-functional-programming.md) | [Next: JavaScript Type System Theory →](./14-javascript-type-system-theory.md)
