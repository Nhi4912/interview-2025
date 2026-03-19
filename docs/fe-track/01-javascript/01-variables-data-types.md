# Variables & Data Types / Biến & Kiểu Dữ Liệu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Basics](./00-javascript-basics.md)
> **See also**: [Scope & Hoisting](./02-scope-hoisting.md) | [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 1

[← Previous](./00-javascript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-scope-hoisting.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang code một giỏ hàng. Bạn cần lưu: tên sản phẩm (text), giá (số), có đang giảm giá không (true/false), danh sách items (array), thông tin user (object). JavaScript có nhiều kiểu dữ liệu khác nhau — chọn sai kiểu dẫn đến bug khó debug:

```javascript
// Bug kinh điển: so sánh kiểu sai
const price = "100";          // string từ API
if (price > 50) { ... }       // "100" > 50 → true (coercion ngầm!)
if (price === 100) { ... }    // false! string vs number
```

Hiểu **kiểu dữ liệu** và **cách khai báo biến** là bước đầu tiên để tránh những bug như trên.

---

## What & Why / Cái Gì & Tại Sao

**Biến là gì?** Như một **chiếc hộp có nhãn** — nhãn là tên biến, thứ bên trong là giá trị. JavaScript là **dynamically typed** — cùng một chiếc hộp có thể chứa số hôm nay, string ngày mai.

**Tại sao có 3 từ khai báo (var/let/const)?**
- `var` — cũ, nhiều bug, **tránh dùng**
- `let` — giá trị có thể thay đổi
- `const` — giá trị không thể reassign (nhưng object/array bên trong vẫn mutable)

**Tại sao JavaScript có kiểu `undefined` VÀ `null`?**
- `undefined` = biến tồn tại nhưng chưa có giá trị (JS tự gán)
- `null` = bạn **cố ý** nói "không có gì ở đây" (lập trình viên gán)

---

## Concept Map / Bản Đồ Khái Niệm

```
[Variables & Data Types] ★ ← bạn đang ở đây
        ↓
  Primitive types:                Reference types:
  number, string, boolean    →    object, array, function
  null, undefined, Symbol         (lưu bằng reference, không phải value)
  BigInt
        ↓
  var / let / const (cách khai báo)
        ↓
  [Scope & Hoisting] ← hiểu var vs let/const cần biết scope
```

---

## Tổng Quan / Overview

JavaScript có **7 kiểu dữ liệu primitive** (number, string, boolean, null, undefined, Symbol, BigInt) và **kiểu reference** (object, array, function). Cách khai báo biến ảnh hưởng trực tiếp đến scope và hoisting — là nguồn gốc của nhiều bug phổ biến.

**Điểm quan trọng cho phỏng vấn:** `typeof null === 'object'` là bug lịch sử của JS, `NaN !== NaN`, và sự khác biệt giữa `==` (loose equality, có coercion) và `===` (strict equality, không coercion).

### Related Links / Liên Kết Liên Quan
- [JavaScript Basics](./00-javascript-basics.md)
- [Scope & Hoisting](./02-scope-hoisting.md)
- [Closures](./03-closures.md)
- [Event Loop & Async](./06-event-loop-async.md)

---

## Core Concepts

### 1. var, let, const Comparison

#### Overview / Tổng Quan
Use let/const in modern JavaScript. var is function-scoped and hoisted with undefined initialization.

#### Explanation / Giải thích
var dễ gây bug do scope theo function và cho phép redeclare. let/const có block scope, dễ reasoning hơn khi đọc code và debug.

#### Example / Ví dụ
```javascript
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }
  console.log(a); // 1
  // console.log(b); // ReferenceError
}

demo();
```

### 2. Hoisting and Initialization

#### Overview / Tổng Quan
Declarations are hoisted, but initialization behavior differs by keyword.

#### Explanation / Giải thích
function declaration được hoist đầy đủ, var hoist với giá trị undefined, còn let/const nằm trong TDZ cho đến khi dòng khai báo chạy.

#### Example / Ví dụ
```javascript
console.log(foo); // undefined
var foo = 'var';

// console.log(bar); // ReferenceError
let bar = 'let';
```

### 3. Temporal Dead Zone (TDZ)

#### Overview / Tổng Quan
TDZ is the time between block start and let/const initialization where access throws ReferenceError.

#### Explanation / Giải thích
TDZ giúp phát hiện dùng biến trước khi sẵn sàng, giảm class bug đọc giá trị chưa khởi tạo.

#### Example / Ví dụ
```javascript
{
  // console.log(score); // ReferenceError
  let score = 100;
  console.log(score);
}
```

### 4. String and Number Deep Dive

#### Overview / Tổng Quan
Numbers are IEEE-754 doubles; strings are immutable UTF-16 sequences.

#### Explanation / Giải thích
Với Number, cần lưu ý sai số dấu chấm động. Với String, mỗi thao tác biến đổi tạo chuỗi mới.

#### Example / Ví dụ
```javascript
console.log(0.1 + 0.2); // 0.30000000000000004

const text = 'hello';
const upper = text.toUpperCase();
console.log(text, upper);
```

### 5. BigInt and Numeric Safety

#### Overview / Tổng Quan
BigInt handles integers beyond Number.MAX_SAFE_INTEGER.

#### Explanation / Giải thích
Khi xử lý ID lớn, blockchain, hoặc số nguyên 64-bit, BigInt tránh mất chính xác. Không trộn trực tiếp BigInt với Number.

#### Example / Ví dụ
```javascript
const maxSafe = Number.MAX_SAFE_INTEGER;
const bigger = 9007199254740993n;

console.log(maxSafe + 1 === maxSafe + 2); // true (unsafe)
console.log(bigger + 2n);
```

### 6. Boolean, null, undefined

#### Overview / Tổng Quan
undefined means not assigned; null is intentional empty value.

#### Explanation / Giải thích
Interviewer hay hỏi vì sao `typeof null` là "object" (legacy bug). Bạn chỉ cần nêu đó là historical quirk.

#### Example / Ví dụ
```javascript
let x;
const y = null;

console.log(typeof x); // undefined
console.log(typeof y); // object (quirk)
```

### 7. Symbol for Unique Keys

#### Overview / Tổng Quan
Symbol creates unique identifiers useful for hidden object keys and protocol customization.

#### Explanation / Giải thích
Symbol giúp tránh đụng key trong object lớn hoặc thư viện. Nó cũng dùng cho các well-known symbols như Symbol.iterator.

#### Example / Ví dụ
```javascript
const ID = Symbol('id');
const user = { name: 'An', [ID]: 101 };

console.log(user[ID]);
console.log(Object.keys(user)); // ['name']
```

### 8. Reference Types and Identity

#### Overview / Tổng Quan
Objects, arrays, and functions compare by reference identity, not deep value.

#### Explanation / Giải thích
Hai object cùng shape vẫn khác nhau nếu không cùng tham chiếu. Đây là lý do cần deep comparison trong vài trường hợp.

#### Example / Ví dụ
```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b); // false
console.log(a === c); // true
```

### 9. typeof and instanceof

#### Overview / Tổng Quan
typeof is good for primitives; instanceof checks prototype chain for objects.

#### Explanation / Giải thích
`instanceof` có thể sai khác giữa realm (iframe). Với array, ưu tiên Array.isArray để ổn định hơn.

#### Example / Ví dụ
```javascript
const arr = [1, 2, 3];
console.log(typeof arr); // object
console.log(arr instanceof Array); // true
console.log(Array.isArray(arr)); // true
```

### 10. Explicit Type Conversion

#### Overview / Tổng Quan
Prefer Number(), String(), Boolean() for readability and predictable behavior.

#### Explanation / Giải thích
Ép kiểu tường minh giúp giảm bug trong dữ liệu API hoặc form input, đặc biệt khi giá trị rỗng hoặc null.

#### Example / Ví dụ
```javascript
const raw = '123';
const asNumber = Number(raw);
const asString = String(asNumber);
const asBool = Boolean(asString);

console.log(asNumber, asString, asBool);
```

### 11. WeakRef Basics

#### Overview / Tổng Quan
WeakRef holds a weak reference that does not prevent garbage collection.

#### Explanation / Giải thích
WeakRef là chủ đề nâng cao; nên dùng rất hạn chế. Nó phù hợp cache tối ưu bộ nhớ, nhưng hành vi thu gom rác là không deterministic.

#### Example / Ví dụ
```javascript
let obj = { payload: 'large object' };
const ref = new WeakRef(obj);

console.log(ref.deref()?.payload);
obj = null; // eligible for GC at some point
```

### 12. Practical Validation for Unknown Data

#### Overview / Tổng Quan
Runtime validation prevents unsafe assumptions from dynamic input.

#### Explanation / Giải thích
TypeScript không bảo vệ dữ liệu runtime từ network. Bạn vẫn cần guard/check trước khi dùng.

#### Example / Ví dụ
```javascript
function parseAge(value) {
  const age = Number(value);
  if (!Number.isFinite(age) || age < 0) {
    throw new Error('Invalid age');
  }
  return age;
}

console.log(parseAge('20'));
```

### 13. Interview Answer Pattern for Data Types

#### Overview / Tổng Quan
Define, distinguish, and demonstrate with one edge case.

#### Explanation / Giải thích
Mẫu trả lời tốt: nêu sự khác nhau, đưa ví dụ code, rồi nêu 1 edge case (NaN, null, TDZ, object identity).

#### Example / Ví dụ
```javascript
function compareTypes(a, b) {
  return {
    strictEqual: a === b,
    looseEqual: a == b,
    typeA: typeof a,
    typeB: typeof b
  };
}

console.log(compareTypes('1', 1));
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. When should var still appear in legacy codebases?

**Answer (EN):** The rule is: you should almost never write new `var` today, but you will encounter it in pre-ES6 code. The key contrast is scope: `var` is **function-scoped** while `let`/`const` are **block-scoped**. Edge case — `var` inside a `for` loop leaks out of the loop body, which caused the classic closure-in-loop bug where every iteration captured the same final value.

**Giải thích (VI):** `var` chỉ xuất hiện trong code cũ viết trước ES6 (2015). Điểm khác biệt chính: `var` có phạm vi theo **function**, còn `let`/`const` theo **block** (dấu `{}`). Khi gặp `var` trong code legacy, bạn nên hiểu nó nhưng không nên tạo mới. Edge case kinh điển: biến `var i` trong vòng `for` vẫn còn tồn tại sau khi vòng lặp kết thúc.

**Ví dụ:**
```javascript
// var leaks out of the for-loop block
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // prints 3, 3, 3 — not 0, 1, 2
}

// fix: use let (block-scoped, each iteration gets its own binding)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // prints 0, 1, 2
}
```

**Interview Tip:** Explain the function-scope vs block-scope distinction first, then name the closure-in-loop gotcha — interviewers love to see you know the real-world consequence, not just the definition.

### 🟡 [Mid] Q2. How do let and const improve maintainability?

**Answer (EN):** The rule is: default to `const`, fall back to `let` only when reassignment is truly needed, never use `var`. Contrast: `const` signals "this binding never changes", making intent obvious to reviewers — whereas `let` says "this value will change." Edge case — a `const` array still allows `push`/`pop`; the immutability is on the **binding**, not the value.

**Giải thích (VI):** Nguyên tắc: mặc định dùng `const`, chỉ dùng `let` khi cần gán lại giá trị. `const` giúp người đọc code hiểu ngay biến này sẽ không bị gán lại — thu hẹp phạm vi cần theo dõi khi debug. Edge case: `const arr = []` vẫn cho phép `arr.push(1)` vì `const` chỉ khóa **tham chiếu**, không khóa nội dung bên trong.

**Ví dụ:**
```javascript
const MAX_RETRIES = 3; // clearly a constant — never reassigned

let attempts = 0;      // clearly a counter — will be incremented
while (attempts < MAX_RETRIES) {
  attempts++;
}

// const binding, mutable contents
const config = { timeout: 5000 };
config.timeout = 10000; // OK — mutating property, not reassigning binding
// config = {};          // TypeError: Assignment to constant variable
```

**Interview Tip:** Go beyond "const is immutable" — clarify that `const` prevents re-binding but not mutation. Interviewers at senior levels probe this distinction immediately.

### 🔴 [Senior] Q3. Explain hoisting in one minute.

**Answer (EN):** Hoisting means the JavaScript engine moves **declarations** (not initializations) to the top of their scope during the compilation phase. Key contrast: `function` declarations are hoisted fully (name + body), `var` declarations are hoisted with `undefined`, and `let`/`const` are hoisted but stay in the Temporal Dead Zone until the line is reached. Edge case — a function expression assigned to `var` is NOT hoisted as a callable function, only as `undefined`.

**Giải thích (VI):** Hoisting nghĩa là JS engine đưa **khai báo** lên đầu scope trước khi chạy code. Phân biệt: `function` declaration được hoist đầy đủ (có thể gọi trước dòng khai báo), `var` hoist nhưng giá trị là `undefined`, `let`/`const` hoist nhưng nằm trong TDZ — truy cập sẽ ném `ReferenceError`. Edge case: `var fn = function() {}` chỉ hoist tên biến `fn` là `undefined`, không hoist function body.

**Ví dụ:**
```javascript
// function declaration: fully hoisted
greet(); // works: "Hello"
function greet() { console.log('Hello'); }

// var: hoisted as undefined
console.log(x); // undefined — no error
var x = 10;

// var function expression: NOT callable before assignment
console.log(sayHi); // undefined
sayHi();             // TypeError: sayHi is not a function
var sayHi = function() { console.log('Hi'); };
```

**Interview Tip:** The trap interviewers set is the `var` function expression case — walk through what `var sayHi` holds at the point of the call (`undefined`) to show you understand compilation vs execution phases.

### 🟢 [Junior] Q4. Why does TDZ exist?

**Answer (EN):** TDZ (Temporal Dead Zone) exists to catch the class of bugs where code accidentally reads a variable before it is initialized. The rule: any access to a `let` or `const` variable between the start of its block and its declaration line throws a `ReferenceError`. Contrast with `var`: `var` silently returns `undefined` when read too early, hiding bugs. TDZ makes the same mistake loud and obvious. Edge case — even `typeof` throws inside TDZ for `let`/`const`, unlike for undeclared variables where `typeof` returns `"undefined"` safely.

**Giải thích (VI):** TDZ được tạo ra để **bắt bug sớm** — khi bạn vô tình đọc biến trước khi nó được khởi tạo. Với `var`, truy cập sớm trả về `undefined` im lặng, rất khó debug. Với `let`/`const`, JS ném ngay `ReferenceError` để bạn biết có vấn đề. Edge case đặc biệt: `typeof` thường an toàn với biến chưa khai báo, nhưng trong TDZ của `let`/`const`, `typeof` cũng ném `ReferenceError`.

**Ví dụ:**
```javascript
// var silently returns undefined — hides bugs
console.log(a); // undefined
var a = 5;

// let throws ReferenceError — catches bugs early
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 5;

// typeof edge case inside TDZ
{
  console.log(typeof c); // ReferenceError (NOT "undefined" — TDZ is active)
  let c = 10;
}
```

**Interview Tip:** The `typeof` in TDZ edge case is a favourite trick question — most candidates assume `typeof` is always safe, but it fails inside TDZ.

### 🟡 [Mid] Q5. Difference between declaration and initialization?

**Answer (EN):** Declaration tells the engine a name exists in scope; initialization assigns a value to that name for the first time. The rule: these are two separate operations and can happen on different lines. Contrast: `var x;` is a declaration (x exists, value is `undefined`); `x = 5;` is initialization. For `const`, declaration and initialization **must** happen on the same line — separating them is a `SyntaxError`. Edge case — `let x;` is valid (declares then leaves `x` as `undefined`), but `const y;` is a `SyntaxError` because const demands immediate initialization.

**Giải thích (VI):** **Khai báo** (declaration) là báo cho engine biết tên biến tồn tại trong scope. **Khởi tạo** (initialization) là gán giá trị đầu tiên. Hai bước này có thể tách nhau — ngoại trừ `const` buộc phải làm cùng một lúc. Điểm thực tế: đây là lý do `const y;` là lỗi cú pháp — bạn không thể khai báo `const` rồi mới gán sau.

**Ví dụ:**
```javascript
// Declaration without initialization — valid for let/var
let score;          // declared, value is undefined
score = 100;        // initialized later

var name;           // declared
name = 'Alice';     // initialized

// const MUST declare and initialize together
const PI = 3.14;    // OK

// const PI2;        // SyntaxError: Missing initializer in const declaration
// PI2 = 3.14;

console.log(score, name, PI); // 100, 'Alice', 3.14
```

**Interview Tip:** Tie this to hoisting — hoisting moves the declaration, not the initialization. That's why `var` reads as `undefined` before its line: declared but not yet initialized.

### 🔴 [Senior] Q6. How do const objects remain mutable?

**Answer (EN):** The rule: `const` prevents **re-binding** — you cannot point the variable at a different object. But `const` does not affect the object's own mutability. Contrast: `const obj = {}` locks the variable `obj` to that memory address; properties of the object live at that address and are freely changeable. To make the object itself immutable, use `Object.freeze()`. Edge case — `Object.freeze()` is **shallow**: nested objects inside a frozen object are still mutable unless you recursively freeze them.

**Giải thích (VI):** `const` chỉ khóa **tham chiếu** — biến không thể trỏ sang object khác. Nhưng object được trỏ tới vẫn thoải mái thay đổi properties. Để thực sự bất biến, dùng `Object.freeze()`. Edge case quan trọng: `Object.freeze()` chỉ đóng băng **một lớp** — nếu object có nested object bên trong, lớp đó vẫn mutable.

**Ví dụ:**
```javascript
const user = { name: 'Alice', address: { city: 'HCM' } };

user.name = 'Bob';          // OK — mutating property
user.address.city = 'HN';  // OK — mutating nested object
// user = {};               // TypeError: Assignment to constant variable

// Shallow freeze
Object.freeze(user);
user.name = 'Charlie';       // silently fails (or throws in strict mode)
console.log(user.name);      // still 'Bob'

user.address.city = 'DN';    // still works! nested object not frozen
console.log(user.address.city); // 'DN'
```

**Interview Tip:** When asked about immutability in React state, this is the core answer: `const` alone is not enough — you need to return new references (spread, structuredClone) to signal changes to React's reconciler.

### 🟢 [Junior] Q7. Can const prevent deep mutation?

**Answer (EN):** No. `const` only prevents reassignment of the binding — it has no effect on deep properties. To prevent shallow mutation you need `Object.freeze()`; to prevent deep mutation you need a recursive deep-freeze or an immutability library. Contrast: `const` is a compile-time binding constraint; deep immutability requires runtime enforcement on every nested property. Edge case — even with `Object.freeze()` applied to the top level, arrays inside the object can still be mutated with `push`.

**Giải thích (VI):** `const` không ngăn mutation. Nó chỉ ngăn bạn gán lại biến đó sang object mới. Để ngăn thay đổi property, dùng `Object.freeze()` — nhưng chỉ đóng băng một lớp ngoài cùng. Để bảo vệ toàn bộ cây object lồng nhau, cần đệ quy freeze hoặc dùng thư viện như Immer. Edge case: `Object.freeze(obj)` nhưng `obj.items` là array — vẫn có thể `obj.items.push(1)`.

**Ví dụ:**
```javascript
const cart = Object.freeze({
  id: 1,
  items: ['apple', 'banana'],
});

// cart.id = 99;    // fails silently (strict mode: TypeError)
cart.items.push('cherry'); // succeeds! array inside is NOT frozen
console.log(cart.items);   // ['apple', 'banana', 'cherry']

// Deep freeze helper
function deepFreeze(obj) {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && obj[k] !== null) deepFreeze(obj[k]);
  });
  return Object.freeze(obj);
}
```

**Interview Tip:** When asked about immutability patterns in production, mention Immer or structuredClone + reassignment as practical alternatives to manual deep-freeze.

### 🟡 [Mid] Q8. What are JavaScript primitive types?

**Answer (EN):** JavaScript has 7 primitive types: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`. The key rule: primitives are **immutable** and compared **by value**. Contrast with reference types (objects, arrays, functions): those are compared by memory address, not content. Edge case — `null` has `typeof null === 'object'`, which is a historical bug in the language; `null` is a primitive despite this misleading type tag.

**Giải thích (VI):** JavaScript có 7 kiểu primitive: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`. Đặc điểm quan trọng: primitive **bất biến** và so sánh **theo giá trị**. Khác với object/array/function — những thứ này so sánh theo **địa chỉ bộ nhớ**. Edge case cần nhớ: `typeof null` trả về `"object"` — đây là lỗi lịch sử từ JS đời đầu, không phải null là object.

**Ví dụ:**
```javascript
// Primitives: compared by value
console.log('hello' === 'hello');  // true
console.log(42 === 42);            // true

// Reference types: compared by identity
console.log({} === {});            // false — different objects in memory
console.log([] === []);            // false

// The null bug
console.log(typeof null);          // "object" — misleading! null is a primitive
console.log(null === null);        // true (primitives compared by value)

// All 7 primitives
const types = [42, 'text', true, null, undefined, Symbol('s'), 9007199254740993n];
types.forEach(v => console.log(typeof v));
```

**Interview Tip:** List all 7 without hesitation — many candidates forget `symbol` or `bigint`. Also proactively mention the `typeof null` quirk to show depth.

### 🔴 [Senior] Q9. How is symbol different from string keys?

**Answer (EN):** The rule: every `Symbol()` call produces a **globally unique** value — two symbols with the same description are never equal. String keys, by contrast, are interned: two strings with the same characters are always the same key. Contrast: string keys appear in `for...in`, `Object.keys()`, and JSON serialization; symbol keys are **hidden** from all of those, making them ideal for internal/library metadata that must not collide with user-defined keys. Edge case — `Symbol.for('key')` creates or retrieves a symbol from a **global registry**, breaking the uniqueness guarantee of plain `Symbol()`.

**Giải thích (VI):** `Symbol()` tạo ra một giá trị **duy nhất toàn cục** mỗi lần gọi — không thể bị trùng dù cùng mô tả. String key thì ngược lại: hai string giống nhau là một key. Điểm mạnh của Symbol: không xuất hiện trong `Object.keys()`, `for...in`, hay `JSON.stringify()` — rất tốt để đính metadata nội bộ mà không làm ô nhiễm interface public. Edge case: `Symbol.for()` dùng global registry — hai lần gọi `Symbol.for('id')` trả về cùng symbol.

**Ví dụ:**
```javascript
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2);     // false — always unique

const obj = { name: 'Alice', [s1]: 'internal-id-001' };
console.log(Object.keys(obj));          // ['name'] — symbol hidden
console.log(JSON.stringify(obj));        // {"name":"Alice"} — symbol dropped

// Symbol.for uses shared registry
const s3 = Symbol.for('shared');
const s4 = Symbol.for('shared');
console.log(s3 === s4);     // true — same registry entry
```

**Interview Tip:** Use the library metadata scenario to justify why symbols exist — "they let library authors add properties to user objects without risking key collision or accidental exposure." That answer shows system-design thinking.

### 🟢 [Junior] Q10. Why is bigint not interchangeable with number?

**Answer (EN):** The rule: `BigInt` and `Number` are distinct types — you cannot mix them in arithmetic expressions without explicit conversion. `Number` uses IEEE-754 double precision (64-bit), which can only represent integers exactly up to 2^53 - 1 (`Number.MAX_SAFE_INTEGER`). `BigInt` can represent arbitrarily large integers with exact precision. Contrast: `number` supports floating-point and Math functions; `bigint` is integers only with no decimal support. Edge case — `1n + 1` throws `TypeError`; you must explicitly convert: `1n + BigInt(1)`.

**Giải thích (VI):** `BigInt` và `Number` là hai kiểu khác nhau — không thể tính toán trực tiếp cùng nhau. `Number` có giới hạn chính xác ở 2^53-1; vượt qua đó kết quả sẽ sai. `BigInt` xử lý số nguyên tùy ý lớn chính xác hoàn toàn. Dùng BigInt khi làm việc với ID từ database 64-bit hoặc số học blockchain. Edge case: `1n + 1` ném `TypeError` — JS không tự ép kiểu giữa BigInt và Number.

**Ví dụ:**
```javascript
const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
console.log(maxSafe + 1 === maxSafe + 2);  // true — precision lost!

const bigId = 9007199254740993n;           // BigInt: exact
console.log(bigId + 1n);                   // 9007199254740994n

// Cannot mix types
try {
  console.log(bigId + 1);   // TypeError: Cannot mix BigInt and other types
} catch (e) {
  console.log(e.message);
}

// Explicit conversion
console.log(bigId + BigInt(1));  // 9007199254740994n
```

**Interview Tip:** Mention the real use case — database row IDs or Snowflake IDs exceed MAX_SAFE_INTEGER, which is why backend APIs sometimes return them as strings to avoid precision loss in JS clients.

### 🟡 [Mid] Q11. How do you safely check for integer input?

**Answer (EN):** Use `Number.isInteger()` to verify a value is a finite integer with no decimal part. Contrast with `Number.isFinite()`: `isFinite` accepts `3.14` (a valid finite number but not an integer); `isInteger` only accepts values where `Math.floor(x) === x`. Never use the global `isNaN()` or `isFinite()` — they coerce strings first, giving wrong answers. Edge case — `Number.isInteger(1.0)` returns `true` because `1.0 === 1` in floating-point; and `Number.isInteger(NaN)` returns `false`.

**Giải thích (VI):** Dùng `Number.isInteger()` để kiểm tra số nguyên — không có phần thập phân và hữu hạn. Phân biệt với `Number.isFinite()`: `isFinite` chấp nhận `3.14`, còn `isInteger` thì không. Tuyệt đối không dùng global `isNaN()`/`isFinite()` — chúng ép kiểu string trước nên cho kết quả sai. Edge case: `Number.isInteger(5.0)` là `true` vì JS lưu `5.0` và `5` như nhau.

**Ví dụ:**
```javascript
// Wrong: global isFinite coerces strings
console.log(isFinite('42'));           // true — coerces "42" to 42 first!

// Correct: Number.isInteger
console.log(Number.isInteger(42));     // true
console.log(Number.isInteger(42.5));   // false
console.log(Number.isInteger('42'));   // false — no coercion
console.log(Number.isInteger(NaN));    // false
console.log(Number.isInteger(5.0));    // true — 5.0 === 5 in JS

// Safe validation for API input
function requireInteger(value) {
  const n = Number(value);
  if (!Number.isInteger(n)) throw new TypeError(`Expected integer, got: ${value}`);
  return n;
}
```

**Interview Tip:** Always use `Number.isInteger` and `Number.isFinite` (the static methods on `Number`), not the global `isNaN`/`isFinite`. Explain why — coercion behaviour — and you'll stand out.

### 🔴 [Senior] Q12. What does typeof return for null?

**Answer (EN):** `typeof null` returns `"object"` — which is a well-known bug from JavaScript's original 1995 implementation. The rule: `null` is a **primitive**, not an object, despite what `typeof` reports. The historical reason: JS values were stored as a type tag + value in 32-bit words; the type tag for objects was `000`, and `null` was represented as all zeros (`0x00000000`), so the engine read it as an object. Contrast: `typeof undefined` correctly returns `"undefined"`. Edge case — the only safe way to check for `null` specifically is strict equality: `value === null`.

**Giải thích (VI):** `typeof null === "object"` là lỗi lịch sử từ năm 1995 — thời điểm JS dùng 32-bit tag để phân biệt kiểu. `null` có bit pattern toàn 0, trùng với tag của object. Đây là bug không thể sửa vì sẽ phá vỡ web hiện tại. `null` thực chất là primitive. Cách kiểm tra `null` đúng duy nhất: `value === null`.

**Ví dụ:**
```javascript
console.log(typeof null);        // "object" — the historic bug
console.log(typeof undefined);   // "undefined" — correct
console.log(typeof {});          // "object" — correct
console.log(typeof []);          // "object" — arrays are objects

// Safe null check
const value = null;
console.log(value === null);     // true — only reliable way
console.log(value == null);      // true — also catches undefined (loose equality)

// Why typeof null matters in guards
function process(input) {
  if (typeof input === 'object' && input !== null) {
    // Safe: input is a real object, not null
    console.log(Object.keys(input));
  }
}
```

**Interview Tip:** Knowing the historical reason (32-bit type tags) signals genuine language understanding, not just memorization. Also show the guard pattern `typeof x === 'object' && x !== null` as the idiomatic fix.

### 🟢 [Junior] Q13. When should you use Object.is over ===?

**Answer (EN):** Use `Object.is()` in two specific situations where `===` gives unexpected results: checking `NaN` and distinguishing `+0` from `-0`. The rule: `===` says `NaN !== NaN` (always false) and `+0 === -0` (always true); `Object.is` flips both. Contrast: for all other values, `Object.is(a, b)` and `a === b` produce identical results. Edge case — React's `useMemo` and `useCallback` internally use `Object.is` for comparing hook dependencies, which is why mutating state without creating a new reference won't trigger re-renders.

**Giải thích (VI):** Dùng `Object.is()` khi cần kiểm tra chính xác `NaN` hoặc phân biệt `+0` và `-0`. `===` không thể làm được cả hai: `NaN === NaN` là `false`, và `+0 === -0` là `true`. `Object.is` xử lý đúng cả hai trường hợp này. Với mọi giá trị khác, `Object.is` và `===` tương đương. Thực tế: React dùng `Object.is` cho shallow comparison trong hooks.

**Ví dụ:**
```javascript
// NaN comparison
console.log(NaN === NaN);          // false — counterintuitive
console.log(Object.is(NaN, NaN)); // true — correct

// +0 vs -0
console.log(+0 === -0);            // true — they look equal
console.log(Object.is(+0, -0));   // false — they are distinct

// For everything else, Object.is behaves like ===
console.log(Object.is(1, 1));     // true
console.log(Object.is('a', 'a')); // true
console.log(Object.is({}, {}));   // false (reference comparison)
```

**Interview Tip:** React's dependency comparison is an excellent real-world anchor — it shows you understand why the distinction matters beyond trivia. Add: "This is why `Number.isNaN` is preferred over `isNaN` — it uses the same semantics as `Object.is`."

### 🟡 [Mid] Q14. How to distinguish array from object reliably?

**Answer (EN):** Use `Array.isArray()` — it is the only reliable cross-realm method. The rule: `typeof []` returns `"object"` (useless for this check), and `arr instanceof Array` fails across iframes because each realm has its own `Array` constructor. Contrast: `Array.isArray` checks the internal `[[IsArray]]` slot, which works regardless of which realm created the array. Edge case — a `NodeList` or `arguments` object is not a real array and will return `false` from `Array.isArray`, even though it is array-like.

**Giải thích (VI):** Dùng `Array.isArray()` để kiểm tra array — đây là cách duy nhất hoạt động đúng mọi lúc. `typeof []` trả về `"object"` không phân biệt được. `instanceof Array` thất bại khi array đến từ iframe khác. `Array.isArray` kiểm tra slot nội bộ `[[IsArray]]` — không phụ thuộc realm. Edge case: `arguments` và `NodeList` là array-like nhưng `Array.isArray` trả về `false` với chúng.

**Ví dụ:**
```javascript
const arr = [1, 2, 3];
const obj = { 0: 1, 1: 2, length: 2 };  // array-like object

console.log(typeof arr);         // "object" — can't distinguish
console.log(Array.isArray(arr)); // true
console.log(Array.isArray(obj)); // false

// arguments is array-like but not an array
function test() {
  console.log(Array.isArray(arguments)); // false
  const real = Array.from(arguments);    // convert to real array
  console.log(Array.isArray(real));      // true
}
test(1, 2, 3);
```

**Interview Tip:** Pair this with the cross-realm iframe issue for extra depth. Also mention `Array.from()` as the standard way to convert array-likes when needed.

### 🔴 [Senior] Q15. What are wrapper objects like new String()?

**Answer (EN):** Wrapper objects are object-typed versions of primitives created by calling `new String()`, `new Number()`, or `new Boolean()`. The rule: never use them in application code — they cause type-check bugs. Contrast: the string primitive `"hello"` is compared by value; `new String("hello")` is an object compared by reference. JavaScript internally uses temporary wrapper objects for one purpose only: to let primitives have methods (e.g., `"hello".toUpperCase()` auto-boxes the string momentarily). Edge case — `new String("hello") === new String("hello")` is `false` because two different object references are created.

**Giải thích (VI):** Wrapper object là phiên bản object của primitive, tạo bằng `new String()`, `new Number()`, `new Boolean()`. Không nên dùng chúng trong code thực. JS dùng wrapper tạm thời bên trong để cho phép primitive gọi method (auto-boxing). Edge case nguy hiểm: `new String("a") === new String("a")` là `false` — hai object khác nhau, không so sánh được bình thường.

**Ví dụ:**
```javascript
const prim = 'hello';              // string primitive
const wrap = new String('hello');  // String wrapper object

console.log(typeof prim); // "string"
console.log(typeof wrap); // "object" — not a string!

console.log(prim === 'hello');  // true
console.log(wrap === 'hello');  // false — object vs primitive
console.log(wrap == 'hello');   // true — loose equality unwraps it

// Auto-boxing: JS creates a temporary wrapper behind the scenes
console.log('hello'.toUpperCase()); // "HELLO" — primitive borrows method from String.prototype
// The temporary wrapper is discarded immediately after the call
```

**Interview Tip:** Explain auto-boxing as the mechanism that makes `"hello".toUpperCase()` work — JS creates a temporary wrapper, calls the method, then discards it. This shows you understand the primitive/object boundary deeply.

### 🟢 [Junior] Q16. Why avoid using new Boolean(false)?

**Answer (EN):** The rule: `new Boolean(false)` creates an **object**, and all objects are truthy in JavaScript — so a `Boolean` wrapper containing `false` evaluates as truthy in conditions. This is directly opposite to its intent. Contrast: the boolean primitive `false` is falsy; `new Boolean(false)` (an object) is truthy. There is no valid use case for wrapper Boolean in production code. Edge case — even `new Boolean(false)` inside an `if` will execute the block, which is a silent logic bug.

**Giải thích (VI):** `new Boolean(false)` tạo ra một **object** — mà object trong JS luôn luôn truthy. Vì vậy `new Boolean(false)` trong câu lệnh `if` sẽ cho kết quả `true`, hoàn toàn ngược lại với ý định. Đây là bug logic thầm lặng rất khó phát hiện. Không có lý do gì để dùng `new Boolean()` trong code thực.

**Ví dụ:**
```javascript
const primFalse = false;
const wrapFalse = new Boolean(false);

if (primFalse) {
  console.log('primitive false: never runs');
}

if (wrapFalse) {
  console.log('wrapper Boolean(false): RUNS — it is an object, always truthy!');
}

console.log(typeof primFalse);  // "boolean"
console.log(typeof wrapFalse);  // "object"
console.log(Boolean(wrapFalse)); // true — confirmed truthy object
```

**Interview Tip:** This is a direct gotcha question. The one-sentence answer: "All objects are truthy in JS, so `new Boolean(false)` is truthy — the opposite of what you'd expect." Then offer the correct alternative: just use `false` or `Boolean(value)` (no `new`).

### 🟡 [Mid] Q17. How does instanceof work internally?

**Answer (EN):** `instanceof` walks the **prototype chain** of the left-hand value, looking for `Constructor.prototype` anywhere in the chain. The rule: `a instanceof B` returns `true` if `B.prototype` appears anywhere in `a`'s prototype chain. Contrast: `typeof` checks the low-level type tag; `instanceof` checks prototype lineage — so it works for custom classes but fails for primitives and cross-realm values. Edge case — you can override `instanceof` behavior by defining `Symbol.hasInstance` on a class.

**Giải thích (VI):** `instanceof` duyệt **prototype chain** của giá trị bên trái, tìm xem `Constructor.prototype` có xuất hiện ở đó không. Nó hoạt động cho class tự định nghĩa nhưng trả `false` cho primitive (vì primitive không có prototype chain), và thất bại cross-realm. Edge case: bạn có thể override hành vi `instanceof` bằng `Symbol.hasInstance`.

**Ví dụ:**
```javascript
class Animal {}
class Dog extends Animal {}

const rex = new Dog();
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true — Animal.prototype is in the chain
console.log(rex instanceof Object); // true — all objects ultimately inherit Object.prototype

// Primitives fail instanceof
console.log(42 instanceof Number);  // false — 42 is a primitive, has no chain

// Custom Symbol.hasInstance
class EvenNumber {
  static [Symbol.hasInstance](n) {
    return typeof n === 'number' && n % 2 === 0;
  }
}
console.log(4 instanceof EvenNumber);  // true
console.log(3 instanceof EvenNumber);  // false
```

**Interview Tip:** Walk through the prototype chain step by step in your answer — it shows you understand the mechanism, not just the result. The `Symbol.hasInstance` example demonstrates senior-level knowledge.

### 🔴 [Senior] Q18. When can instanceof fail across iframes?

**Answer (EN):** Each browsing context (window or iframe) has its own separate set of built-in constructors. The rule: an array created in `iframe.contentWindow` has a different `Array.prototype` than the parent window's `Array`. So `iframeArray instanceof Array` returns `false` in the parent — because `iframeArray`'s prototype chain leads to the iframe's `Array.prototype`, not the parent's. Contrast: `Array.isArray()` checks the internal `[[IsArray]]` slot which transcends realm boundaries — it returns `true` regardless of origin. Edge case — same issue affects `instanceof Promise`, `instanceof Map`, and any built-in class in cross-realm code.

**Giải thích (VI):** Mỗi iframe có bộ constructor riêng — `Array` trong iframe khác với `Array` trong parent window. Vì vậy `iframeArr instanceof Array` là `false` trong parent. `Array.isArray()` không bị vấn đề này vì nó kiểm tra slot nội bộ `[[IsArray]]`, không phụ thuộc realm. Đây là lý do kỹ thuật chính để dùng `Array.isArray` thay vì `instanceof Array`.

**Ví dụ:**
```javascript
// In a page with an embedded iframe:
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

const iframeArray = new iframe.contentWindow.Array(1, 2, 3);

// Cross-realm instanceof fails
console.log(iframeArray instanceof Array);     // false! Different Array constructor
console.log(Array.isArray(iframeArray));        // true — [[IsArray]] slot is correct

// Same issue with other built-ins
const iframeObj = new iframe.contentWindow.Object();
console.log(iframeObj instanceof Object);       // false in some edge cases

// Safe cross-realm type check
console.log(Object.prototype.toString.call(iframeArray)); // "[object Array]"
```

**Interview Tip:** This question filters candidates who have worked on embedded widgets, micro-frontends, or browser extensions. Name one of those contexts to show practical relevance, then give `Array.isArray` and `Object.prototype.toString.call` as the two reliable alternatives.

### 🟢 [Junior] Q19. What is structural cloning vs shallow copying?

**Answer (EN):** Shallow copying creates a new top-level object but shares references to all nested values. Structural cloning (deep cloning) recursively creates new copies of every level, so no references are shared. The rule: use shallow copy (spread `{...obj}`) for flat objects; use `structuredClone()` or a deep clone strategy for nested objects. Contrast: after a shallow copy, mutating a nested property affects both the original and the copy; after a structural clone, they are fully independent. Edge case — `structuredClone` cannot clone functions or class instances with custom prototypes; it throws a `DataCloneError`.

**Giải thích (VI):** Shallow copy tạo object mới ở tầng ngoài, nhưng các property lồng nhau vẫn trỏ chung tham chiếu cũ. Structural clone (deep clone) sao chép toàn bộ cây — không còn tham chiếu chung. Sau shallow copy, sửa nested property sẽ ảnh hưởng cả bản gốc lẫn bản copy. Edge case: `structuredClone()` không hỗ trợ function hay class instance có prototype tùy chỉnh.

**Ví dụ:**
```javascript
const original = { name: 'Alice', address: { city: 'HCM' } };

// Shallow copy
const shallow = { ...original };
shallow.address.city = 'HN';       // mutates original too!
console.log(original.address.city); // 'HN' — shared reference

// Structural clone
const original2 = { name: 'Bob', address: { city: 'HCM' } };
const deep = structuredClone(original2);
deep.address.city = 'DN';
console.log(original2.address.city); // 'HCM' — fully independent

// structuredClone limitation
const withFn = { greet: () => 'hello' };
// structuredClone(withFn); // DataCloneError: function cannot be cloned
```

**Interview Tip:** In React context — explain that Redux/useState require new object references at every level that changed; shallow copy is sufficient if only top-level properties change, but nested updates need deep cloning or immer-style immutable updates.

### 🟡 [Mid] Q20. How does spread syntax copy objects?

**Answer (EN):** Object spread `{...obj}` performs a **shallow** copy — it iterates over the object's own enumerable string-keyed properties and copies them into the new object. The rule: spread is equivalent to `Object.assign({}, obj)` but more readable. Contrast: spread copies only **own** properties, not inherited prototype properties; `Object.create`-based inheritance is lost after spread. Edge case — spreading an object with a getter copies the **evaluated value**, not the getter itself; the resulting property becomes a plain data descriptor.

**Giải thích (VI):** `{...obj}` sao chép tất cả **own enumerable string properties** vào object mới — nông (shallow), không đệ quy. Tương đương `Object.assign({}, obj)`. Điểm quan trọng: properties kế thừa qua prototype bị mất sau khi spread. Edge case: nếu object có getter, spread sẽ lưu **giá trị đã tính** của getter, không phải getter function.

**Ví dụ:**
```javascript
const base = { role: 'admin' };
const user = Object.create(base);
user.name = 'Alice';

const copy = { ...user };
console.log(copy.name);   // 'Alice' — own property copied
console.log(copy.role);   // undefined — inherited property NOT copied

// Getter behaviour
const src = {
  get value() { return Math.random(); }
};
const copied = { ...src };
console.log(typeof Object.getOwnPropertyDescriptor(copied, 'value').get); // undefined
// The getter has become a plain data value

// Common pattern: override specific properties
const updated = { ...user, name: 'Bob', createdAt: Date.now() };
```

**Interview Tip:** The getter-becomes-value edge case is uncommon but shows depth. More practically, explain the immutable state update pattern (`{ ...state, field: newValue }`) that is ubiquitous in Redux reducers.

### 🔴 [Senior] Q21. How do you deep clone in modern JavaScript?

**Answer (EN):** The modern default is `structuredClone()` (available in all modern runtimes since 2022). It handles circular references, `Map`, `Set`, `Date`, `ArrayBuffer`, and typed arrays — far more than `JSON.parse(JSON.stringify())`. Contrast: `JSON.stringify` round-trip is simpler but drops `undefined`, functions, Symbols, `Date` values become strings, and it throws on circular references. Edge case — `structuredClone` cannot clone functions, DOM nodes, or class instances with custom prototypes; use it only for plain data objects.

**Giải thích (VI):** `structuredClone()` là cách deep clone chuẩn trong JS hiện đại. Nó xử lý circular reference, `Date`, `Map`, `Set`, `ArrayBuffer`. `JSON.parse(JSON.stringify())` đơn giản hơn nhưng mất `undefined`, function, Symbol, và Date bị convert thành string. Edge case: `structuredClone` không clone được function hay DOM node — dùng cho plain data object.

**Ví dụ:**
```javascript
// structuredClone: handles complex types
const original = {
  date: new Date(),
  map: new Map([['key', 'val']]),
  nested: { count: 0 },
};

const clone = structuredClone(original);
clone.nested.count = 99;
clone.date.setFullYear(2000);

console.log(original.nested.count); // 0 — independent
console.log(original.date.getFullYear()); // current year — independent

// JSON round-trip: simple but limited
const data = { name: 'Alice', score: undefined, createdAt: new Date() };
const jsonClone = JSON.parse(JSON.stringify(data));
console.log(jsonClone.score);     // undefined key disappears
console.log(typeof jsonClone.createdAt); // "string" — Date became ISO string
```

**Interview Tip:** Know the decision tree: `structuredClone` for plain data with complex types; `JSON` round-trip only for simple serializable data; Immer or Lodash `cloneDeep` when you need class instance support or browser compatibility back to IE.

### 🟢 [Junior] Q22. What are trade-offs of JSON stringify cloning?

**Answer (EN):** `JSON.parse(JSON.stringify(obj))` is a quick deep-clone that works well for flat, serializable data. Pros: simple, no dependencies, fast for small objects. Cons: silently drops `undefined` values and Symbol keys, converts `Date` to ISO strings (losing the `Date` type), converts `NaN`/`Infinity` to `null`, and throws `TypeError` on circular references. Contrast: `structuredClone` handles all these edge cases correctly. Edge case — an object with `undefined` values in an array gets them replaced with `null`, not dropped — different behavior from object properties.

**Giải thích (VI):** `JSON.parse(JSON.stringify(obj))` là deep clone nhanh cho data phẳng, serializable. Nhưng nó có nhiều giới hạn: bỏ `undefined`, Symbol, function; biến `Date` thành string; biến `NaN`/`Infinity` thành `null`; crash khi gặp circular reference. `structuredClone` xử lý đúng hơn. Edge case: trong array, `undefined` bị thay bằng `null` chứ không bị xóa.

**Ví dụ:**
```javascript
const obj = {
  name: 'test',
  fn: () => {},           // function: dropped silently
  date: new Date(),       // Date: becomes string
  undef: undefined,       // undefined property: key dropped
  arr: [1, undefined, 3], // undefined in array: becomes null
  inf: Infinity,          // becomes null
  nan: NaN,               // becomes null
};

const clone = JSON.parse(JSON.stringify(obj));
console.log(clone.fn);    // undefined — function lost
console.log(typeof clone.date); // "string" — not a Date
console.log('undef' in clone);  // false — key dropped
console.log(clone.arr);  // [1, null, 3] — undefined → null in arrays
console.log(clone.inf);  // null
```

**Interview Tip:** Enumerate the losses systematically: functions → dropped; Dates → strings; undefined props → dropped; undefined in arrays → null; circular refs → error. This table-like answer impresses interviewers who look for completeness.

### 🟡 [Mid] Q23. How do Symbol.for and Symbol differ?

**Answer (EN):** The rule: `Symbol()` always creates a brand-new, unique symbol — no two calls produce the same value. `Symbol.for(key)` checks a **global symbol registry** first; if a symbol with that key exists, it returns it; otherwise it creates and registers a new one. Contrast: `Symbol('id') !== Symbol('id')` always; `Symbol.for('id') === Symbol.for('id')` always. Edge case — the global registry is shared across realms (iframes, workers), unlike plain `Symbol()` which is local to the current realm. This makes `Symbol.for` useful for cross-realm protocols.

**Giải thích (VI):** `Symbol()` tạo symbol duy nhất mỗi lần — không thể trùng. `Symbol.for(key)` dùng **global registry**: nếu key đã tồn tại thì trả về cùng symbol, chưa thì tạo mới và đăng ký. Khác biệt thực tế: `Symbol.for` phù hợp khi cần chia sẻ symbol giữa các modules khác nhau hoặc giữa iframe và parent window. Edge case: global registry được chia sẻ cross-realm — đây là điểm khác biệt lớn nhất với `Symbol()`.

**Ví dụ:**
```javascript
// Symbol() — always unique
const s1 = Symbol('user');
const s2 = Symbol('user');
console.log(s1 === s2);          // false — always distinct

// Symbol.for — global registry
const s3 = Symbol.for('app.userId');
const s4 = Symbol.for('app.userId');
console.log(s3 === s4);          // true — same registry entry

// Retrieve key from a Symbol.for symbol
console.log(Symbol.keyFor(s3));  // 'app.userId'
console.log(Symbol.keyFor(s1));  // undefined — not in registry
```

**Interview Tip:** Use case for `Symbol.for`: defining a protocol key like `Symbol.for('nodejs.rejection')` that third-party libraries and core modules both reference — they need the same symbol without importing each other.

### 🔴 [Senior] Q24. What is a well-known symbol?

**Answer (EN):** Well-known symbols are built-in Symbol values on `Symbol` (e.g., `Symbol.iterator`, `Symbol.toPrimitive`, `Symbol.hasInstance`) that JavaScript uses internally to define language behavior. The rule: by implementing a well-known symbol on your object, you hook into core JS mechanics. Contrast: regular symbols are user-defined for avoiding key collisions; well-known symbols customize how language operators and built-ins interact with your object. Edge case — `Symbol.toPrimitive` overrides how your object converts to a primitive in `+`, `-`, or comparison operations; without it, JS falls back to `valueOf()` then `toString()`.

**Giải thích (VI):** Well-known symbols là các Symbol built-in của JS dùng để mở rộng hành vi ngôn ngữ. Bằng cách cài đặt chúng trên object của bạn, bạn "hook" vào cơ chế JS. Ví dụ: `Symbol.iterator` làm object của bạn iterable với `for...of`. `Symbol.toPrimitive` kiểm soát convert sang primitive. Đây là cách thư viện lớn (như lodash, iterables) tích hợp sâu với JS syntax mà không cần hàm đặc biệt.

**Ví dụ:**
```javascript
// Symbol.iterator — make any object iterable with for...of
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return { next() {
      return current <= end ? { value: current++, done: false } : { done: true };
    }};
  }
}
console.log([...new Range(1, 5)]); // [1, 2, 3, 4, 5]

// Symbol.toPrimitive — control type conversion
const money = {
  amount: 100,
  currency: 'USD',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount; // 'default'
  }
};
console.log(+money);      // 100
console.log(`${money}`);  // "100 USD"
console.log(money + 50);  // 150
```

**Interview Tip:** `Symbol.iterator` is the most important — it powers `for...of`, spread, destructuring, and `Array.from`. Show how making an object iterable unlocks all these syntaxes simultaneously.

### 🟢 [Junior] Q25. How does WeakRef differ from WeakMap?

**Answer (EN):** Both hold **weak references** to objects, allowing GC to collect the target when no strong references remain. The key contrast: `WeakMap` is a key→value store where the key is weakly held (you can associate metadata with an object without preventing its collection); `WeakRef` holds a direct weak reference to a single object, and you dereference it explicitly with `.deref()` to get the value or `undefined` if already collected. Edge case — `WeakRef.deref()` can return `undefined` at any time after GC runs, so you must always null-check the result.

**Giải thích (VI):** Cả hai đều giữ tham chiếu yếu (weak) — không ngăn GC thu gom object. Khác biệt chính: `WeakMap` là cấu trúc key→value (gắn metadata vào object mà không giữ object sống); `WeakRef` giữ tham chiếu trực tiếp tới một object, dùng `.deref()` để lấy giá trị (hoặc `undefined` nếu đã bị thu gom). Edge case: `.deref()` có thể trả `undefined` bất kỳ lúc nào sau GC — luôn phải kiểm tra kết quả.

**Ví dụ:**
```javascript
// WeakMap: attach metadata to objects without preventing GC
const cache = new WeakMap();
function getMetrics(domNode) {
  if (!cache.has(domNode)) {
    cache.set(domNode, { computedAt: Date.now() });
  }
  return cache.get(domNode);
}

// WeakRef: hold a soft reference to a single object
let bigData = { values: new Array(1_000_000).fill(0) };
const ref = new WeakRef(bigData);
bigData = null; // remove strong reference — GC can now collect it

// Later...
const data = ref.deref();
if (data) {
  console.log(data.values.length); // may print 1000000 or never run
} else {
  console.log('object was garbage collected');
}
```

**Interview Tip:** Real use case for `WeakMap`: storing private data per DOM node in a library without creating memory leaks when nodes are removed. This is how some libraries implement per-element state without a `data-*` attribute.

### 🟡 [Mid] Q26. When should WeakRef be avoided?

**Answer (EN):** The rule: avoid `WeakRef` in most application code — it introduces non-deterministic behavior since you can never predict when GC runs. Contrast: regular references guarantee the object is alive; `WeakRef` silently becomes `undefined` after collection, requiring defensive `.deref()` checks everywhere. Appropriate uses are narrow: large caches where stale eviction is acceptable, or debugging/instrumentation tools that must not extend object lifetimes. Edge case — a `WeakRef` deref can return different results in the same function invocation if GC happens between two calls to `.deref()`.

**Giải thích (VI):** Tránh dùng `WeakRef` trong code application thông thường — nó đưa vào hành vi không xác định (non-deterministic) vì GC có thể chạy bất kỳ lúc nào. Phù hợp cho: cache có thể bị evict (stale cache is ok) hoặc công cụ debug không muốn kéo dài vòng đời object. Edge case nguy hiểm: hai lần `.deref()` trong cùng một function có thể trả kết quả khác nhau nếu GC chạy giữa hai lần đó.

**Ví dụ:**
```javascript
// BAD: unpredictable — avoid in regular application logic
const ref = new WeakRef(someObject);
function process() {
  const obj = ref.deref();
  if (!obj) return; // check here
  doSomethingWith(obj);
  // Don't assume obj is still alive for a subsequent deref
}

// GOOD use case: optional image cache
const imageCache = new Map();
function cacheImage(key, image) {
  imageCache.set(key, new WeakRef(image));
}
function getImage(key) {
  return imageCache.get(key)?.deref() ?? null; // null means "evicted, reload"
}
```

**Interview Tip:** "I'd use `WeakRef` only for optional caches where losing the cached value is acceptable and triggers a reload. For anything where the value must be present, I use strong references or explicit lifecycle management."

### 🔴 [Senior] Q27. How do you convert unknown API values safely?

**Answer (EN):** The rule: never trust external data types — always validate and convert at the boundary. The safest approach is a validation library like Zod: define the expected schema, parse once, and downstream code has typed guarantees. Contrast manual conversion (`Number(val)`, `String(val)`): it converts but doesn't validate range, required fields, or structural shape. Edge case — `Number(undefined)` returns `NaN` and `Number(null)` returns `0`, both silently wrong when you expected a valid price or count.

**Giải thích (VI):** Không bao giờ tin tưởng kiểu dữ liệu từ API bên ngoài — validate và convert tại biên. Dùng Zod để định nghĩa schema, parse một lần, code phía sau có type guarantee. Conversion thủ công (`Number(val)`) convert nhưng không validate range hay structure. Edge case nguy hiểm: `Number(undefined) = NaN`, `Number(null) = 0` — cả hai đều sai lặng lẽ nếu bạn đang xử lý tiền.

**Ví dụ:**
```javascript
// Unsafe: silent type coercion
function processOrder(order) {
  const total = order.price * order.qty; // "10" * 2 = 20 (ok by luck)
  const discount = Number(order.discount); // undefined → NaN
  return total - discount; // 20 - NaN = NaN — silently wrong!
}

// Safe: validate at the boundary with Zod
import { z } from 'zod';
const OrderSchema = z.object({
  price: z.number().positive(),
  qty: z.number().int().positive(),
  discount: z.number().min(0).default(0),
});
function processOrderSafe(raw) {
  const order = OrderSchema.parse(raw); // throws if invalid, with clear message
  return order.price * order.qty - order.discount;
}
```

**Interview Tip:** "I parse at the network boundary once with Zod or io-ts and let TypeScript narrow the types from there. The cost is one validation; the benefit is type-safety throughout the call chain."

### 🟢 [Junior] Q28. Why should form values be parsed explicitly?

**Answer (EN):** The rule: all HTML form inputs return **strings** — even `<input type="number">`. If you use a form value directly in arithmetic without parsing, you get string concatenation instead of addition. Contrast: `"10" + 5 = "105"` (string concat); `Number("10") + 5 = 15` (numeric addition). Edge case — `parseInt` stops at the first non-numeric character: `parseInt("10px") = 10`, which can mask invalid input; use `Number("10px") = NaN` instead to detect bad values.

**Giải thích (VI):** Tất cả giá trị từ input HTML là **string** — dù `type="number"`. Dùng trực tiếp trong tính toán sẽ gây nối chuỗi thay vì cộng số. Phân biệt: `Number()` convert toàn bộ string; `parseInt()` dừng ở ký tự không phải số — nên `parseInt("10px") = 10` thay vì NaN. Dùng `Number()` để bắt input không hợp lệ.

**Ví dụ:**
```javascript
// Bug: form value used directly
const qty = document.getElementById('qty').value;  // "3"
const price = 10;
console.log(qty * price);      // 30 — OK (implicit coercion for *)
console.log(qty + price);      // "310" — WRONG (+ prefers string)

// Safe: explicit parse
const qtyNum = Number(qty);
if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
  showError('Invalid quantity');
  return;
}
console.log(qtyNum + price);   // 13 — correct

// parseInt trap: accepts "10px" silently
console.log(parseInt('10px'));   // 10 — masks invalid input
console.log(Number('10px'));     // NaN — correctly rejects
```

**Interview Tip:** "In React controlled inputs I always coerce on change: `onChange={e => setQty(Number(e.target.value))}`. In form submission handlers I validate the coerced value before dispatching."

### 🟡 [Mid] Q29. How do NaN and Infinity break business logic?

**Answer (EN):** The rule: `NaN` and `Infinity` are valid `number` type values in JS but represent mathematically invalid states — any arithmetic operation touching them silently propagates the error downstream. Contrast: `NaN` comes from failed conversions (`Number("abc")`) and invalid math (`0/0`); `Infinity` comes from dividing by zero (`1/0`) or overflow. Edge case — `NaN !== NaN` is always `true`, so `if (value === NaN)` never catches it; use `Number.isNaN(value)` instead.

**Giải thích (VI):** `NaN` và `Infinity` là giá trị `number` hợp lệ trong JS nhưng biểu thị trạng thái sai — mọi phép tính với chúng tiếp tục lan truyền lỗi mà không throw. `NaN` lan tỏa: `NaN + 5 = NaN`, `NaN > 0 = false`. Lỗi kinh điển: hiển thị `NaN VND` lên UI vì quên validate input trước khi tính. Edge case: `NaN === NaN` là `false` — không thể dùng `===` để kiểm tra NaN.

**Ví dụ:**
```javascript
// NaN propagation — silent until UI
const rawPrice = 'free'; // invalid input
const price = Number(rawPrice);     // NaN
const tax = price * 0.1;            // NaN
const total = price + tax;          // NaN
console.log(`Total: ${total} VND`); // "Total: NaN VND"

// Infinity from division by zero
const avg = 100 / 0;  // Infinity
console.log(avg > 1000); // true — comparison works but logically wrong

// Guard: Number.isFinite validates both NaN and Infinity
function safeDivide(a, b) {
  const result = a / b;
  if (!Number.isFinite(result)) throw new Error(`Invalid division: ${a}/${b}`);
  return result;
}
```

**Interview Tip:** "I guard all numeric boundaries with `Number.isFinite()` — it rejects both `NaN` and `Infinity` in one check. For currency calculations I work in integer cents to avoid both floating-point and Infinity edge cases."

### 🔴 [Senior] Q30. How do you normalize nullable data?

**Answer (EN):** The rule: consolidate all "no value" representations (`null`, `undefined`, `""`, `0`, `false`) into one canonical form as early as possible — ideally at the API boundary. Contrast: using `||` normalizes all falsy values to the default, which incorrectly treats `0` and `""` as "missing"; using `??` only normalizes `null`/`undefined`, preserving `0` and `""`. Edge case — when normalizing optional fields from different API sources, use `?? null` to produce a consistent `null` rather than leaving `undefined` in some fields and `null` in others.

**Giải thích (VI):** Chuẩn hóa "không có giá trị" về một dạng duy nhất càng sớm càng tốt — tại biên API. Dùng `||` normalize tất cả falsy (sai với `0`, `""` hợp lệ); dùng `??` chỉ normalize `null`/`undefined`. Trong thực tế: chọn một convention cho toàn project (thường là `null` cho optional fields) và tuân theo nhất quán. Edge case: `undefined ?? null` trả về `null` — cách chuẩn hóa undefined sang null.

**Ví dụ:**
```javascript
// Problem: mixed null/undefined from different APIs
const profileA = { name: 'Alice', bio: undefined };
const profileB = { name: 'Bob', bio: null };

// Bad: || normalizes 0 and "" incorrectly
const score = apiResponse.score || 0; // if score is 0, returns 0 anyway — misleading
const label = apiResponse.label || 'N/A'; // if label is "", returns 'N/A' — wrong

// Good: ?? only replaces null/undefined
const score2 = apiResponse.score ?? 0;    // 0 → 0, null/undefined → 0
const label2 = apiResponse.label ?? 'N/A'; // "" → "", null/undefined → 'N/A'

// Normalizing at API boundary
function normalizeProfile(raw) {
  return {
    name: raw.name ?? '',
    bio: raw.bio ?? null,  // consistent: always null, never undefined
    age: raw.age != null ? Number(raw.age) : null,
  };
}
```

**Interview Tip:** "I use `??` by default over `||` for default values — it avoids accidentally treating `0` and `""` as missing data, which is a common source of bugs in forms and API responses."

### 🟢 [Junior] Q31. What is nullish coalescing in type conversion?

**Answer (EN):** Nullish coalescing (`??`) returns the right-hand value only when the left side is `null` or `undefined` — it is a conversion shorthand for "use this default if no value was provided." The rule: use `??` for providing defaults to optional values, and use it *before* numeric conversion to avoid converting `null`/`undefined` to `NaN`. Contrast: `||` triggers on any falsy value (including `0`, `""`, `false`), making it unsuitable when those are valid values. Edge case — `??=` (logical nullish assignment) assigns only if the current value is null/undefined: `user.bio ??= 'No bio set'`.

**Giải thích (VI):** `??` trả về vế phải chỉ khi vế trái là `null` hoặc `undefined`. Dùng để cung cấp default cho giá trị optional — an toàn hơn `||` vì không reject `0`, `""`, `false`. Trong type conversion: dùng `??` trước khi convert để tránh `Number(undefined) = NaN`. `??=` là shorthand gán khi giá trị hiện tại là nullish.

**Ví dụ:**
```javascript
// Safe default before conversion
const raw = apiResponse.count; // might be null, undefined, or 0
const count = Number(raw ?? 0); // null/undefined → 0 → 0; actual 0 stays 0

// vs unsafe with ||
const countBad = Number(raw || 0); // 0 → 0 too, but "" → 0 also, hiding bugs

// Nullish assignment
const settings = { theme: 'dark' };
settings.language ??= 'en'; // sets 'en' because language is undefined
settings.theme ??= 'light'; // does NOT set 'light' — theme already 'dark'
console.log(settings); // { theme: 'dark', language: 'en' }

// Optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Unknown';
```

**Interview Tip:** Chain `?.` with `??` — `user?.settings?.timeout ?? 5000` — as the idiomatic way to safely access nested optional data with a fallback. It reads left to right and is self-documenting.

### 🟡 [Mid] Q32. How to design stable runtime guards?

**Answer (EN):** A runtime guard validates that a value meets expected type and shape before using it. The rule: guards should be explicit, composable, and positioned at trust boundaries (function entry points, API responses, user inputs). Contrast naive truthiness checks (`if (x)`) with discriminated checks (`typeof x === 'number' && Number.isFinite(x)`): the naive version misses `0`, `NaN`, `""` as valid inputs. Edge case — when writing a guard for an object, always check for `null` first because `typeof null === 'object'`, which would otherwise pass an object-type check.

**Giải thích (VI):** Runtime guard là validation kiểm tra kiểu và hình dạng dữ liệu trước khi dùng. Đặt guard tại biên tin cậy: đầu function, sau API call, xử lý user input. Guard phải rõ ràng và composable. Lỗi phổ biến: dùng `if (x)` thay vì guard cụ thể — reject `0`, `""` hợp lệ. Edge case: kiểm tra object phải luôn kiểm tra `!== null` trước.

**Ví dụ:**
```javascript
// Composable, explicit type guards
function isString(v) { return typeof v === 'string'; }
function isPositiveInt(v) { return Number.isInteger(v) && v > 0; }
function isNonNullObject(v) { return v !== null && typeof v === 'object'; }

// Guard at function entry
function createProduct(name, price, qty) {
  if (!isString(name) || name.trim() === '') throw new TypeError('name must be non-empty string');
  if (!isPositiveInt(qty)) throw new RangeError('qty must be positive integer');
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
    throw new RangeError('price must be non-negative finite number');
  }
  return { name: name.trim(), price, qty };
}

// TypeScript version (preferred in typed projects)
function processUser(user: unknown): User {
  const parsed = UserSchema.parse(user); // Zod validates at boundary
  return parsed;
}
```

**Interview Tip:** "I write guards as predicates that return `boolean` so they can be composed and reused. For public APIs or API boundary parsing, I use Zod — it gives both runtime validation and TypeScript types from one schema."

### 🔴 [Senior] Q33. What mistakes happen with default parameters and undefined?

**Answer (EN):** Default parameters trigger only when an argument is `undefined` — not when it is `null`, `0`, `""`, or `false`. The rule: default parameters are syntactic sugar for `if (arg === undefined) arg = default`. Contrast: `null` does NOT trigger a default — `fn(null)` receives `null`, not the default. Edge case — passing `undefined` explicitly also triggers the default: `fn(undefined)` is identical to calling `fn()` with no argument. This can hide bugs when you meant to pass `null` but accidentally passed `undefined` from a chain.

**Giải thích (VI):** Default parameter chỉ kích hoạt khi argument là `undefined` — không phải `null`, `0`, `""`. `fn(null)` nhận `null` thực sự, không dùng default. `fn(undefined)` và `fn()` là tương đương — cả hai đều dùng default. Lỗi ẩn: function trả về `undefined` thay vì `null` → truyền kết quả đó vào function khác vô tình kích hoạt default parameter.

**Ví dụ:**
```javascript
function createUser(name, role = 'viewer') {
  return { name, role };
}

createUser('Alice');              // { name: 'Alice', role: 'viewer' }
createUser('Bob', undefined);     // { name: 'Bob', role: 'viewer' } — same as above!
createUser('Carol', null);        // { name: 'Carol', role: null } — null passed through
createUser('Dave', '');           // { name: 'Dave', role: '' } — empty string passed through

// Hidden bug: undefined from optional chain triggers default unexpectedly
const savedRole = userConfig?.role; // undefined if userConfig is null
createUser('Eve', savedRole);    // triggers default 'viewer' — might not be intended

// Fix: normalize before passing
const role = userConfig?.role ?? null;  // null instead of undefined
createUser('Eve', role);          // receives null, not default
```

**Interview Tip:** "I never rely on accidental `undefined` to trigger defaults — I always pass a defined value or null. If I want the default, I omit the argument explicitly. This makes intent clear and avoids surprise when values come from optional chains."

### 🟢 [Junior] Q34. How do you explain data types to non-JS engineers?

**Answer (EN):** Use the analogy of labelled storage containers: a `number` is a box of marbles (you can count and do math), a `string` is a box of letters (text operations only), a `boolean` is a light switch (on/off). The key contrast for non-JS engineers: JavaScript is **dynamically typed** — the same box can hold marbles today and letters tomorrow, unlike Java or C# where each box permanently stores one type. Edge case to share: in JS, `"5" + 1 = "51"` because JS silently changes the box type — this surprises engineers from statically typed languages most.

**Giải thích (VI):** Dùng hộp đựng có nhãn: `number` là hộp đựng viên bi (đếm, tính toán), `string` là hộp chữ (thao tác văn bản), `boolean` là công tắc (bật/tắt). Điểm khác biệt với Java/C#: trong JS cùng một biến có thể chứa số hôm nay, string ngày mai. Điều này gây sốc cho dev từ ngôn ngữ tĩnh. Ví dụ minh họa: `"5" + 1 = "51"` — JS tự đổi loại hộp.

**Ví dụ:**
```javascript
// Dynamic typing — the "container" changes type
let box = 42;        // box holds a number
box = "hello";       // now box holds a string — valid in JS
box = true;          // now a boolean — still valid

// Contrast with what Java/C# engineers expect:
// int box = 42;
// box = "hello";  // ← compile error in Java — can't change type

// The JS surprise for static-type devs
console.log("5" + 1);   // "51" — string wins
console.log(5 + "1");   // "51" — string wins
console.log("5" - 1);   // 4   — minus coerces to number
```

**Interview Tip:** When explaining to non-JS engineers, emphasize TypeScript as the solution: "TypeScript adds the static-type safety you're used to while compiling to JavaScript." This shows you understand audience and can bridge technical gaps.

### 🟡 [Mid] Q35. What interview traps exist around type coercion?

**Answer (EN):** The most common traps: (1) `[] + []` → `""` (both arrays convert to empty string, then concatenate); (2) `{} + []` → `0` (interpreted as empty block + unary `+` on `[]`); (3) `true + true` → `2` (booleans coerce to numbers); (4) `"" == false` → `true` (both coerce to 0); (5) `null == undefined` → `true` but `null == 0` → `false`. The rule: coercion follows `ToPrimitive` → if either operand is a string after conversion, use string concatenation; otherwise numeric. Edge case — `+[]` is `0` because unary `+` calls `ToNumber` on `[]`, which first calls `toString()` → `""`, then `Number("")` → `0`.

**Giải thích (VI):** Các bẫy phổ biến nhất khi phỏng vấn: `[] + []` → `""` (mảng convert sang empty string rồi nối chuỗi), `true + true` → `2` (boolean convert sang số), `"" == false` → `true`. Quy tắc ghi nhớ: `+` ưu tiên string khi có ít nhất một operand là string sau ToPrimitive. Với `null`: `null == undefined` → `true` nhưng `null == 0` → `false` — đây là ngoại lệ trong Abstract Equality Comparison.

**Ví dụ:**
```javascript
console.log([] + []);          // ""   — [].toString() + [].toString()
console.log([] + {});          // "[object Object]"
console.log({} + []);          // "[object Object]" (as expression) or 0 (as statement)
console.log(true + true);      // 2    — booleans → numbers
console.log(true + false);     // 1
console.log("" == false);      // true  — both → 0
console.log(null == undefined); // true  — special case
console.log(null == 0);        // false — null only loosely equals null/undefined
console.log(+[]);              // 0    — [].toString() → "" → Number("") → 0
console.log(+{});              // NaN  — {}.toString() → "[object Object]" → NaN
```

**Interview Tip:** When asked "what does `[] + {}` equal?", walk through ToPrimitive step by step. Interviewers don't expect you to memorize all results — they want to see your *reasoning process*, not rote answers.

### 🔴 [Senior] Q36. How do you discuss memory identity clearly?

**Answer (EN):** The rule: in JavaScript, **identity** means "same object in memory" (same reference), while **equality** means "same value or content". For primitives, identity and equality are the same (`5 === 5` is true by value). For objects, `===` compares identity — two separate objects with identical properties are NOT identical. This distinction drives React's reconciliation: `setState` must provide a new object reference for React to detect a change. Contrast: deep equality checks (like Lodash `isEqual`) compare content but are O(n) and expensive. Edge case — `Object.is(NaN, NaN)` is `true` despite `NaN !== NaN`, and `Object.is(+0, -0)` is `false` despite `+0 === -0`; React's `useMemo` uses `Object.is` for these precise semantics.

**Giải thích (VI):** "Identity" = cùng object trong bộ nhớ (cùng tham chiếu). "Equality" = cùng giá trị/nội dung. Với primitive, hai khái niệm giống nhau. Với object, `===` chỉ kiểm tra identity. React dùng identity comparison — đây là lý do `setState` cần tạo object mới để trigger re-render. Deep equality (`lodash.isEqual`) kiểm tra nội dung nhưng tốn O(n) — không phù hợp cho hot path. Edge case: React dùng `Object.is` (không phải `===`) để xử lý đúng `NaN` và `-0`.

**Ví dụ:**
```javascript
// Identity vs equality for objects
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b);  // false — different identity
console.log(a === c);  // true  — same identity
console.log(JSON.stringify(a) === JSON.stringify(b)); // true — equal content

// React: identity determines re-render
function Counter() {
  const [state, setState] = React.useState({ count: 0 });
  const increment = () => {
    state.count++;          // identity unchanged → React.memo won't see change
    setState(state);        // same reference → no re-render!
    setState({ ...state }); // new identity → triggers re-render ✓
  };
}
```

**Interview Tip:** "In React context, I always frame it as: React uses `Object.is` (reference equality) not deep equality — so returning a new reference is the signal for 'something changed', not the content itself."

### 🟢 [Junior] Q37. Why does mutability matter for React state?

**Answer (EN):** React's `useState` and `useReducer` use **reference equality** (`Object.is`) to decide whether state changed. If you mutate an object directly, the reference stays the same — React sees no change and skips the re-render. The rule: always return a new object/array reference from state updates; never mutate the existing state. Contrast: mutating works for regular JS variables but breaks React's change detection because the reconciler never compares deep content. Edge case — `useMemo` and `React.memo` also use reference equality for their dependency comparisons; mutating an object passed as a prop or dependency bypasses these optimizations silently.

**Giải thích (VI):** React dùng so sánh tham chiếu (`Object.is`) để phát hiện thay đổi state. Nếu bạn mutate object trực tiếp, tham chiếu không đổi → React bỏ qua re-render. Luôn tạo object mới khi update state. Đây cũng ảnh hưởng `useMemo` và `React.memo`: nếu truyền object mutated vào deps, optimization sẽ không hoạt động đúng.

**Ví dụ:**
```javascript
// Mutation bug — no re-render
const [user, setUser] = React.useState({ name: 'Alice', role: 'viewer' });

// BAD: direct mutation — same reference, React sees no change
user.role = 'admin';
setUser(user); // state "updated" but no re-render!

// GOOD: new reference — React detects change, triggers re-render
setUser({ ...user, role: 'admin' });

// Edge case: React.memo optimization bypassed by mutation
const MemoList = React.memo(({ items }) => <ul>{items.map(...)}</ul>);
const items = [1, 2, 3];
items.push(4);          // same reference — React.memo thinks nothing changed
setItems([...items]);   // new reference — memo comparison triggers re-render
```

**Interview Tip:** "The mental model: in React, a state update is only 'real' if it comes with a new reference. I use spread for objects (`{ ...state, key: value }`) and array methods that return new arrays (`map`, `filter`, `concat`) — never `push` or direct assignment on state."

### 🟡 [Mid] Q38. How do you reason about copy-on-write style updates?

**Answer (EN):** Copy-on-write (CoW) is a pattern where you only create a new copy when modification is needed — shared unchanged paths continue to point to the original data. The rule: copy the minimum required path from the changed node to the root; siblings and unchanged subtrees stay shared. Contrast with deep cloning everything: CoW is O(depth of change) while full deep clone is O(total nodes). Edge case — with nested objects, spread only copies one level; nested paths still share memory unless explicitly spread at each level. Immer handles this automatically via Proxy.

**Giải thích (VI):** Copy-on-write chỉ tạo bản sao khi cần thay đổi — phần không thay đổi được chia sẻ. Thay vì clone toàn bộ state, chỉ tạo mới các object trên path từ điểm thay đổi lên gốc. Immer làm điều này tự động — bạn viết mutation code, Immer tạo CoW copy cho bạn. Edge case: spread chỉ copy một lớp — nested objects cần spread riêng hoặc dùng Immer.

**Ví dụ:**
```javascript
// Manual CoW for nested state
const state = {
  user: { name: 'Alice', prefs: { theme: 'dark', lang: 'en' } },
  posts: [1, 2, 3],
};

// Change theme: only copy the path user → prefs
const newState = {
  ...state,                          // copy root (posts stays shared)
  user: {
    ...state.user,                   // copy user (name stays shared)
    prefs: { ...state.user.prefs, theme: 'light' }  // copy prefs, change theme
  },
};
// state.posts === newState.posts     // true — shared unchanged
// state.user !== newState.user       // true — new reference on changed path

// Immer handles CoW automatically
import produce from 'immer';
const newState2 = produce(state, draft => {
  draft.user.prefs.theme = 'light'; // looks like mutation, produces CoW copy
});
```

**Interview Tip:** "Immer is the pragmatic choice for complex nested state. I explain CoW to interviewers as 'structural sharing' — only the changed nodes and their ancestors become new objects; everything else is reused."

### 🔴 [Senior] Q39. What anti-patterns appear with global variables?

**Answer (EN):** Global variables are the source of three classes of bugs: (1) **namespace collision** — two scripts or libraries define the same name; (2) **hidden coupling** — function A secretly depends on function B having run first to set a global; (3) **test pollution** — global state from one test leaks into the next, causing flaky results. The rule: never declare globals in modern JS — use modules (`export`/`import`), closures, or explicit state containers. Contrast: globals seemed necessary in browser scripts before ES modules; today they are an anti-pattern except for rare cases like polyfills. Edge case — accidental globals from forgotten `var`/`let`/`const` in non-strict mode silently become window properties, which is why strict mode exists.

**Giải thích (VI):** Ba loại bug từ global variable: (1) trùng tên giữa các script/library, (2) coupling ẩn (A phụ thuộc B đã chạy trước), (3) test pollution (state từ test trước ảnh hưởng test sau). Giải pháp: ES modules, closure, hoặc state container (Redux, Zustand). Trong non-strict mode, quên `const`/`let` tạo global window property — đây là lý do strict mode và TypeScript tồn tại. Edge case: third-party scripts inject globals như `window.analytics` — namespace collision khi bạn define `const analytics = ...` cùng tên.

**Ví dụ:**
```javascript
// Anti-pattern 1: namespace collision
// script1.js
window.user = { name: 'Alice' };
// script2.js (loaded later, overwrites silently)
var user = { name: 'Bob' }; // in non-strict mode, becomes window.user

// Anti-pattern 2: hidden coupling
let isInitialized = false;
function init() { isInitialized = true; }
function process() {
  if (!isInitialized) throw new Error('Must call init() first'); // hidden dependency
}

// Anti-pattern 3: test pollution
let counter = 0;
function increment() { counter++; }

test('first test', () => { increment(); expect(counter).toBe(1); }); // passes
test('second test', () => { expect(counter).toBe(0); }); // FAILS — counter is 1

// Fix: no global state, pass counter explicitly
function createCounter() {
  let count = 0;
  return { increment: () => ++count, value: () => count };
}
```

**Interview Tip:** "In production code I've seen global-state bugs where two async operations writing to the same global counter corrupted each other. I now always scope state to the smallest possible closure or module, and use dependency injection for shared services."

### 🟢 [Junior] Q40. How to answer variable scope questions confidently?

**Answer (EN):** The rule for scope questions: state the scope type first (global / function / block / module), then explain who can access the variable and who cannot, then give a one-line example. The key contrasts: `var` is function-scoped and hoisted; `let`/`const` are block-scoped and TDZ'd; closures capture the variable binding, not the value snapshot. Structure your answer in 3 parts: (1) definition of the scope rule, (2) code example showing the rule, (3) the gotcha/edge case. Edge case to always mention: closures in loops with `var` capture the final value, not the iteration value — the classic `var i` loop bug.

**Giải thích (VI):** Cấu trúc trả lời câu hỏi về scope: (1) Nêu loại scope (global/function/block/module), (2) Ai có thể truy cập — ai không, (3) Ví dụ ngắn, (4) Gotcha/edge case. Điểm then chốt: `var` là function-scoped và hoisted; `let`/`const` là block-scoped với TDZ; closure capture **binding** không phải giá trị tại thời điểm tạo. Edge case hay gặp nhất: closure với `var` trong vòng lặp — capture biến chứ không phải giá trị.

**Ví dụ:**
```javascript
// Structure for answering scope questions:

// 1. State the rule
// "let and const are block-scoped — only accessible within the {} they're declared in"

// 2. Code example
{
  let blockVar = 'only here';
  console.log(blockVar); // 'only here'
}
// console.log(blockVar); // ReferenceError — out of scope

// 3. The gotcha: closures capture binding, not snapshot value
// BAD: var loop closure
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // prints 3, 3, 3 — var i is shared
}

// GOOD: let loop closure
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // prints 0, 1, 2 — each iteration new j
}
```

**Interview Tip:** "I use the 3-part structure: rule → example → gotcha. For scope: I always mention the `var` loop closure bug unprompted — it shows I know the practical consequence, not just the textbook definition."
