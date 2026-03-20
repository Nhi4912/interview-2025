# JavaScript Basics / Nền Tảng JavaScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## JavaScript Fundamentals - Chapter 0

[← Previous](../../00-table-of-contents.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./01-variables-data-types.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn mở một trang web — ảnh load, button click được, data fetch từ server, animation chạy mượt. Tất cả đều do **một ngôn ngữ** điều khiển: JavaScript. Nhưng JavaScript ban đầu được tạo trong 10 ngày để validate form. Làm sao nó trở thành ngôn ngữ phổ biến nhất thế giới và chạy được cả ở browser lẫn server?

Hiểu lịch sử và cơ chế JavaScript giúp bạn không chỉ viết code mà còn hiểu **tại sao** JavaScript hoạt động theo những cách kỳ lạ đó (type coercion, hoisting, async model...).

---

## What & Why / Cái Gì & Tại Sao

**Giải thích đơn giản (Feynman):** Tưởng tượng một trang web như tờ báo:
- **HTML** = nội dung tờ báo (tiêu đề, bài viết, ảnh)
- **CSS** = thiết kế tờ báo (màu sắc, font, layout)
- **JavaScript** = người đưa tin tương tác — đọc phản hồi từ độc giả, cập nhật nội dung ngay lập tức mà không cần in lại tờ báo

**Tại sao JavaScript quan trọng?**
- Ngôn ngữ **duy nhất** chạy native trên mọi browser (không cần plugin)
- Vừa chạy được ở **client** (browser) vừa ở **server** (Node.js) — một ngôn ngữ cho toàn stack
- Top 1 ngôn ngữ phổ biến nhất 12 năm liên tiếp (Stack Overflow Survey 2024)

---

## Concept Map / Bản Đồ Khái Niệm

```
Bạn đang ở đây → [JavaScript Basics] ★
                         ↓
              [Variables & Data Types]
                         ↓
              [Scope & Hoisting]
                         ↓
              [Closures]         [Prototypes]
                         ↓
              [this keyword]
                         ↓
              [Event Loop & Async]
                         ↓
              [ES6+ Features]    [Functional Programming]
```

---

## Tổng Quan / Overview

**JavaScript** là ngôn ngữ lập trình single-threaded, interpreted/JIT-compiled, dynamic typing. Chạy trên engine V8 (Chrome/Node.js) hoặc SpiderMonkey (Firefox). File này cung cấp bức tranh toàn cảnh trước khi đi vào từng khái niệm cụ thể.

**Giải thích:** Đây là chapter 0 — tổng quan về lịch sử, engine, và đặc điểm nổi bật của JS. Hãy đọc để có mental model trước khi học Variables, Scope, Closures...

### Related Links / Liên Kết Liên Quan
- [Variables & Data Types](./01-variables-data-types.md)
- [Closures](./03-closures.md)
- [Event Loop & Async](./06-event-loop-async.md)
- [Functional Programming](./12-functional-programming.md)

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. JavaScript Runtime Model / Mô Hình Thực Thi

> 🧠 **Memory Hook**: "JS là đầu bếp một mình — làm xong món này mới làm món kia, nhưng có đơn hàng đặt trước (Event Loop) nên không cần đứng chờ"

**Tại sao tồn tại? / Why does this exist?**
Brendan Eich thiết kế JS để chạy trên browser — nơi DOM cần được access và modify.
→ **Why?** Nếu JS có nhiều thread, hai thread cùng modify DOM đồng thời sẽ gây race condition và corrupt UI.
→ **Why?** Giải pháp đơn giản nhất: single thread cho JS, nhưng delegate I/O (network, timer) sang Web APIs — không blocking, không race condition.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản
JS như bartender một mình: chỉ pha một ly một lúc (single-threaded). Khi khách đặt cocktail phức tạp (async), anh ta đưa cho prep team (Web APIs), tiếp tục phục vụ khách khác. Khi prep team xong, họ để ly trên quầy (callback queue) và anh ta lấy lúc rảnh (Event Loop).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
JavaScript Runtime Architecture:
┌───────────────────────────────────────────────────────┐
│  JS Engine (V8)          │  Web APIs (browser)        │
│  ┌─────────────────┐     │  ┌───────────────────────┐ │
│  │  Call Stack      │     │  │ setTimeout            │ │
│  │  main()         │────►│  │ fetch / XHR           │ │
│  │  greet()        │     │  │ DOM events            │ │
│  └─────────────────┘     │  └──────────┬────────────┘ │
│                          │             │ done          │
│  ┌─────────────────────────────────────▼────────────┐ │
│  │           Callback / Task Queue                   │ │
│  │   [setTimeout cb] [fetch cb] [click handler]     │ │
│  └─────────────────────────────────────────────────┘  │
│              ▲  Event Loop: when stack is empty        │
│              └── picks next task from queue            │
└───────────────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```javascript
// Single-threaded means: blocking code freezes EVERYTHING
console.log('start');
while (Date.now() < Date.now() + 2000) {} // freeze 2 seconds — UI freezes too!
console.log('end'); // nothing renders during the while loop

// Non-blocking: yields control via async
console.log('start');
setTimeout(() => console.log('async'), 0);
console.log('end');
// Output: start → end → async (setTimeout always deferred, even with 0ms)
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "setTimeout(fn, 0) chạy ngay lập tức" | Callback vẫn vào queue, chờ stack rỗng | Ít nhất 1 task cycle sau; output order: sync → setTimeout |
| "JS là multi-threaded vì async" | Async không phải multi-threading | Chỉ có 1 JS thread; Web APIs chạy ngoài engine |
| "Event Loop là một phần của JS engine" | Event Loop là browser/Node feature, không phải V8 | V8 chỉ có Call Stack; Event Loop là runtime layer |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "why single-threaded?", "how does async work?", "why does blocking code freeze UI?"
- → Nhớ đến: **bartender analogy** — single thread + Web APIs delegation + Event Loop scheduling
- → Mở đầu trả lời: *"JS là single-threaded — có một call stack, một tác vụ tại một thời điểm. Async hoạt động bằng cách delegate I/O sang Web APIs (browser), callback được trả về khi stack rỗng thông qua Event Loop."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: Không cần prerequisite — đây là mental model nền tảng
- ➡️ Để hiểu tiếp: [Event Loop & Async](./06-event-loop-async.md) — chi tiết microtask vs macrotask queue, Promise scheduling

---

### 2. Strict Mode / Chế Độ Nghiêm Ngặt

> 🧠 **Memory Hook**: "'use strict' = bật đèn cảnh báo — JS im lặng throw lỗi, giúp bạn tìm bug trước khi user tìm thấy"

**Tại sao tồn tại? / Why does this exist?**
JavaScript ES3 có nhiều "silent failures" — lỗi xảy ra nhưng không throw, code tiếp tục chạy sai.
→ **Why?** Vì web backward compatibility: không thể break sites cũ bằng cách throw lỗi mới.
→ **Why?** ES5 (2009) giải pháp: opt-in strict mode. Các site cũ không thêm `'use strict'` → không bị break. Site mới opt-in → nhận strict behavior tốt hơn.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản
Strict mode như bật chế độ "strict checking" ở airport security — trước đây họ cho qua cả những thứ đáng ngờ (silent failures). Bật strict mode = mọi vi phạm nhỏ đều bị báo ngay (throw error) thay vì âm thầm lọt qua.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
What strict mode catches (turns silent bugs → thrown errors):
┌──────────────────────────────────────────────────────────┐
│ SLOPPY MODE          │  STRICT MODE                     │
├──────────────────────┼──────────────────────────────────┤
│ x = 5 (no let/const) │  ReferenceError: x is not defined│
│ duplicate params fn(a,a) │ SyntaxError                  │
│ delete obj.prop     │  TypeError (non-configurable)     │
│ this in fn() = window│  this = undefined               │
│ with statement      │  SyntaxError                     │
└──────────────────────┴──────────────────────────────────┘

Auto-enabled in:
- ES modules (import/export)
- TypeScript files
- Class bodies
- <script type="module">
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```javascript
'use strict';

// The this-in-function difference:
function showThis() { return this; }
showThis(); // undefined in strict; window in sloppy

// This matters for method extraction:
const obj = { greet() { return this; } };
const greet = obj.greet;
greet(); // undefined in strict → TypeError if you access this.name
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Strict mode không cần vì dùng TypeScript" | TS strict là type-checking; JS strict mode là runtime behavior | Cả hai đều cần — TS strict ≠ `'use strict'` |
| "Strict mode ảnh hưởng toàn file khi đặt trong function" | `'use strict'` trong function chỉ áp dụng cho function đó | Đặt ở đầu file để áp dụng toàn bộ |
| Quên strict mode tự động bật trong class | Class body luôn strict — `this` trong class method không phải window | Nhất quán với class usage |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "what does `'use strict'` do?", "`this` undefined in function?", "accidental global variable"
- → Nhớ đến: strict mode **turns silent failures into thrown errors** — 4 categories: globals, delete, params, this
- → Mở đầu trả lời: *"Strict mode biến 'silent failures' của JavaScript thành thrown errors — cụ thể: gán biến chưa khai báo throw ReferenceError, `this` trong standalone function là undefined thay vì window, và duplicate parameter names là SyntaxError."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [Variables & Data Types](./01-variables-data-types.md) — var/let/const scope
- ➡️ Để hiểu tiếp: [this keyword](./05-this-keyword.md) — strict mode thay đổi `this` binding trong standalone functions

---

### 3. Truthy/Falsy & Short-circuit Operators / Giá Trị Truthy/Falsy & Toán Tử Ngắn Mạch

> 🧠 **Memory Hook**: "Only 8 things are falsy in JS — memorize them: `false 0 -0 0n "" null undefined NaN`. Everything else: truthy."

**Tại sao tồn tại? / Why does this exist?**
JS cần cho phép non-boolean values trong `if` condition để code ngắn hơn.
→ **Why?** Thay vì `if (arr.length > 0)`, bạn có thể viết `if (arr.length)` — ngắn gọn hơn.
→ **Why?** Nhưng điều này tạo ra gotcha: `if (value)` reject cả `0`, `""`, `false` — những giá trị hợp lệ trong nhiều trường hợp.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản
Truthy/falsy như luật "ai được vào club": chỉ 8 người bị từ chối (falsy), tất cả người khác được vào (truthy). Ngạc nhiên là `"0"`, `[]`, `{}` đều được vào — chỉ string/array/object rỗng theo nghĩa khác mới bị chặn.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
8 Falsy values (all others = truthy):
false | 0 | -0 | 0n | "" | null | undefined | NaN

Short-circuit operators:
┌────────────────────────────────────────────────────────┐
│ a && b  → if a is falsy: return a; else return b       │
│ a || b  → if a is truthy: return a; else return b      │
│ a ?? b  → if a is null/undefined: return b; else return a│
└────────────────────────────────────────────────────────┘

Gotcha table:
Value    │ !! (boolean) │ || 'default' │ ?? 'default'
---------|--------------|--------------|-------------
0        │ false        │ 'default'    │ 0  ← !! difference
""       │ false        │ 'default'    │ "" ← !! difference
null     │ false        │ 'default'    │ 'default'
"0"      │ TRUE         │ "0"          │ "0"
[]       │ TRUE         │ []           │ []
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```javascript
// The || vs ?? gotcha in React props / API responses:
function Quantity({ qty }) {
  return <div>{qty || 'N/A'}</div>; // BUG: renders 'N/A' when qty=0!
  return <div>{qty ?? 'N/A'}</div>; // CORRECT: renders 0
}

// Short-circuit for conditional execution:
user.isLoggedIn && sendAnalytics(); // runs only if logged in
const name = user?.profile?.name ?? 'Anonymous'; // safe deep access + fallback
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng `||` cho default value với số/string | `0` và `""` là valid values nhưng `||` treats them as "missing" | Dùng `??` (nullish coalescing) cho defaults |
| `"0"` là falsy | String "0" là NON-EMPTY string → truthy | Chỉ empty string `""` là falsy |
| `[]` và `{}` là falsy | Empty array/object là truthy! | `Boolean([]) === true`, `Boolean({}) === true` |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "falsy values in JS", "`||` vs `??`", "optional chaining"
- → Nhớ đến: 8 falsy values list + `??` vs `||` distinction
- → Mở đầu trả lời: *"JavaScript có đúng 8 falsy values: false, 0, -0, 0n, empty string, null, undefined, NaN. Tất cả còn lại truthy — kể cả `[]` và `{}`. Khi cần default value, dùng `??` thay `||` để không accidentally treat `0` hay `""` là 'missing'."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [Variables & Data Types](./01-variables-data-types.md) — primitive types và coercion
- ➡️ Để hiểu tiếp: [Closures](./03-closures.md) — short-circuit là pattern phổ biến trong closure-based guards

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is JavaScript and why is it single-threaded?

**Answer (EN):** JavaScript is a dynamically typed, interpreted scripting language created to make web pages interactive. It runs on a **single thread** — one call stack, one piece of code running at a time. The reason: browser rendering and JS share the same thread; concurrent DOM access from multiple threads would require complex locking. Async work (fetch, timers) is handled via the **Event Loop**, not additional threads.

**Giải thích (VI):** JavaScript là ngôn ngữ scripting chạy trên trình duyệt (và Node.js). "Single-threaded" nghĩa là chỉ có 1 luồng thực thi — không thể chạy 2 đoạn code đồng thời. Đây là lý do blocking code (vòng lặp nặng) làm đơ giao diện: nó chiếm hoàn toàn thread. Async (fetch, setTimeout) không phải đa luồng — chúng dùng Event Loop để xử lý sau khi callstack rỗng.

**Ví dụ:**
```javascript
// Blocking code freezes the UI — everything runs on one thread
console.log('start');
while (Date.now() < Date.now() + 2000) {}  // freezes for 2s
console.log('end');  // nothing renders during the while loop

// Non-blocking: setTimeout yields to the Event Loop
console.log('start');
setTimeout(() => console.log('async'), 0);
console.log('end');
// Output: start → end → async
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích Web APIs delegation + Event Loop scheduling, biết tại sao DOM access cần single-thread
- ❌ Weak: "JS là single-threaded" — đúng nhưng không giải thích được tại sao, và async hoạt động thế nào

### 🟡 [Mid] Q2. Differentiate ECMAScript and JavaScript.

**Answer (EN):** **ECMAScript (ES)** is the language specification published by ECMA International (TC39 committee). **JavaScript** is the most popular *implementation* of that spec. Other implementations: SpiderMonkey (Firefox), V8 (Chrome/Node), JavaScriptCore (Safari). Think of ECMAScript as the standard (like USB spec) and JavaScript engines as implementations (like USB-C adapters). Features are specified in ES editions: ES5 (2009), ES6/ES2015 (arrow fns, classes, modules), ES2017 (async/await), ES2020 (optional chaining), with annual releases since 2015.

**Giải thích (VI):** ECMAScript là tiêu chuẩn kỹ thuật, JavaScript là cài đặt của tiêu chuẩn đó. Giống như HTML là spec, Chrome/Firefox là cài đặt. TC39 committee (gồm đại diện Google, Mozilla, Apple) vote từng tính năng mới qua 4 stages. Khi thấy "ES6", đó là ECMAScript 2015 edition — JavaScript engine của bạn cài đặt những tính năng đó.

**Ví dụ:**
```javascript
// ES2015 (ES6) feature: arrow function + destructuring
const greet = ({ name }) => `Hello, ${name}!`;

// ES2020 feature: optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Unknown';

// Check if a feature is in the spec: MDN → "Specifications" section
// Shows which ECMAScript edition introduced it
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Phân biệt spec vs implementation, biết TC39 + Stage 0-4 process, explain tại sao Babel vẫn cần
- ❌ Weak: "ECMAScript là tên gọi khác của JavaScript" — không hiểu spec vs implementation

### 🔴 [Senior] Q3. Name major ES milestones interviewers ask about.

**Answer (EN):** The three editions that changed JavaScript the most: **ES5 (2009)** — strict mode, `Array.forEach/map/filter`, `JSON.parse/stringify`, `Object.keys`. **ES6/ES2015** — the biggest jump: `let`/`const`, arrow functions, classes, destructuring, template literals, modules (`import`/`export`), Promises, `Symbol`, `Map`/`Set`, generators. **ES2017** — `async`/`await`. After 2015, TC39 ships annually: ES2018 (rest/spread for objects), ES2019 (`flatMap`), ES2020 (optional chaining `?.`, nullish `??`, `BigInt`), ES2021 (`Promise.any`, `??=`), ES2022 (top-level await, `at()`, private class fields `#`), ES2023 (`findLast`, `toSorted`).

**Giải thích (VI):** 3 mốc quan trọng nhất: ES5 (2009) — foundation của modern JS. ES6/2015 — cách mạng cú pháp: const/let, arrow, class, module, Promise. ES2017 — async/await. Từ 2015 ra hàng năm. Senior dev cần biết tính năng nào vào ES nào để giải thích "tại sao Babel vẫn cần thiết" hoặc "tại sao codebase cũ dùng .then() thay vì await".

**Ví dụ:**
```javascript
// ES5 — still works everywhere
[1,2,3].forEach(function(n) { console.log(n); });

// ES6 — same thing, modern syntax
[1,2,3].forEach(n => console.log(n));

// ES2022 — private class fields (# prefix)
class Counter {
  #count = 0;  // truly private, not accessible outside
  increment() { this.#count++; }
  get value() { return this.#count; }
}
// new Counter().#count  → SyntaxError (unlike _count convention)
```

**Interview Tip:** When asked "what's your favorite ES feature?", pick something specific like `?.` or private fields and explain *why* it reduces bugs — not just "it's cleaner".

### 🟢 [Junior] Q4. When should you enable strict mode?

**Answer (EN):** Always. Strict mode turns silent JavaScript mistakes into thrown errors, making bugs detectable at development time instead of silently corrupting production data. Enable it with `'use strict';` at the top of a file/function, or automatically by using ES modules (`type="module"`) or TypeScript — both are strict by default. Key things strict mode catches: accidental global variable creation, duplicate parameter names, deleting undeletable properties, `with` statement.

**Giải thích (VI):** Luôn bật strict mode. Nó biến các "lỗi im lặng" của JS thành lỗi rõ ràng (thrown errors) để bạn phát hiện sớm. Ví dụ: quên `let`/`const` → tạo biến global ngẫu nhiên. Trong strict mode, điều này throw `ReferenceError` ngay lập tức. ES modules và TypeScript đã bật strict mode tự động — đây là lý do nữa để dùng chúng.

**Ví dụ:**
```javascript
// Without strict mode — silent bug
function calculateTotal() {
  total = 0;  // typo: forgot 'let' — creates global window.total
  items.forEach(item => total += item.price);
  return total;
}

// With strict mode — caught immediately
'use strict';
function calculateTotal() {
  total = 0;  // ReferenceError: total is not defined ← caught!
}

// Modern: ES modules are always strict
// <script type="module"> or import/export syntax → strict by default
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Biết strict mode auto-bật trong ES modules/TypeScript, list được ít nhất 4 behaviors thay đổi
- ❌ Weak: "Strict mode ngăn một số lỗi" — quá chung, không nêu được cụ thể

### 🟡 [Mid] Q5. What changes in strict mode for accidental globals?

**Answer (EN):** In non-strict mode, assigning to an undeclared variable silently creates a property on the global object (`window` in browsers, `global` in Node). This is catastrophic in larger codebases — two functions accidentally sharing a global variable through a typo. In strict mode, this throws `ReferenceError: x is not defined` immediately. Additionally, strict mode catches: assigning to read-only properties (throws `TypeError`), duplicate parameter names (syntax error), `this` in standalone functions is `undefined` instead of `window` (prevents accidental global method calls), and `delete` on a non-configurable property throws instead of silently failing.

**Giải thích (VI):** Không có strict mode, `x = 5` (quên khai báo) tạo `window.x = 5` — một global ẩn. Nếu 2 hàm vô tình dùng cùng tên biến này, chúng có thể ghi đè data của nhau mà không có lỗi. Strict mode chặn điều này. Điểm quan trọng khác: `this` trong function call thường (`fn()`) là `undefined` thay vì `window` — điều này ngăn vô tình gọi method trên global object.

**Ví dụ:**
```javascript
'use strict';

// 1. Accidental global → ReferenceError
function buggy() {
  cunt = 0;  // typo for 'count' → ReferenceError in strict mode
}

// 2. Duplicate params → SyntaxError
function add(a, a) { return a + a; }  // SyntaxError in strict mode

// 3. `this` in standalone functions → undefined, not window
function showThis() { console.log(this); }
showThis();  // undefined (strict) vs window (sloppy)

// 4. Writing to read-only property → TypeError
const obj = Object.freeze({ x: 1 });
obj.x = 2;  // TypeError in strict, silently ignored in sloppy
```

**Interview Tip:** The `this === undefined` change in strict mode explains why arrow functions (which inherit `this` from scope) were adopted so quickly — they sidestep `this` confusion entirely.

### 🔴 [Senior] Q6. Explain primitive vs reference assignment.

**Answer (EN):** **Primitives** (number, string, boolean, null, undefined, Symbol, BigInt) are stored **by value** — assigning copies the data. **Objects** (objects, arrays, functions) are stored **by reference** — assigning copies a pointer to the same heap location. Consequence: mutating a copied object affects the original. This is why React requires immutable state updates (`setState` with new object) and why function arguments that are objects can be modified inside the function.

**Giải thích (VI):** Primitive được copy khi gán — `b = a` tạo bản sao độc lập. Object được truyền tham chiếu — `b = a` khiến cả hai trỏ vào cùng vùng nhớ. Mutation từ `b` sẽ ảnh hưởng đến `a`. Đây là nguồn gốc của nhiều bug React: `state.items.push(x)` không trigger re-render vì tham chiếu array không thay đổi, dù nội dung đã thay đổi.

**Ví dụ:**
```javascript
// Primitives — copy by value
let a = 5;
let b = a;
b = 10;
console.log(a);  // 5 — unchanged

// Objects — copy by reference
const user = { name: 'Alice' };
const admin = user;    // same reference!
admin.name = 'Bob';
console.log(user.name);  // 'Bob' — mutated through admin

// Fix: create new object to break the reference
const admin2 = { ...user };  // shallow copy
admin2.name = 'Charlie';
console.log(user.name);  // still 'Bob' — original unchanged

// React state mutation bug
const [items, setItems] = useState([1, 2, 3]);
items.push(4);         // BAD: same reference, no re-render
setItems([...items]);  // GOOD: new array reference triggers re-render
```

**Interview Tip:** Draw the memory model: stack (primitives/pointers) vs heap (objects). "In React, the shallow equality check `prevState === nextState` only returns false if the reference changes — that's why we return new objects instead of mutating."

### 🟢 [Junior] Q7. Why does object mutation surprise beginners?

**Answer (EN):** Beginners expect assignment to create a copy (like primitives do). But objects use **reference semantics**: `const b = a` just makes `b` point to the same object in memory. So `b.name = 'Bob'` also changes `a.name` — because they're the same object. `const` only prevents *reassignment* of the variable; it does NOT make the object immutable. The most dangerous form: passing an object to a function, modifying it inside, and discovering the caller's original data changed.

**Giải thích (VI):** Beginner nghĩ `const b = a` tạo bản sao riêng. Thực ra, `b` chỉ là cái tên khác trỏ vào cùng object. `const` chỉ khóa biến (không thể gán lại `b = something`), nhưng không khóa nội dung object. Đây là nguồn gốc phổ biến của bug "tôi không thay đổi gì mà dữ liệu lại thay đổi".

**Ví dụ:**
```javascript
// Mutation through function parameter
function addRole(user, role) {
  user.roles.push(role);  // mutates the caller's object!
  return user;
}

const alice = { name: 'Alice', roles: ['viewer'] };
addRole(alice, 'editor');
console.log(alice.roles);  // ['viewer', 'editor'] — original mutated!

// Fix: return new object instead
function addRoleSafe(user, role) {
  return { ...user, roles: [...user.roles, role] };
}

// `const` does NOT mean immutable
const config = { debug: false };
config.debug = true;  // totally fine — const only prevents config = ...
```

**Interview Tip:** Mention `Object.freeze()` for shallow immutability and libraries like Immer for deep immutable updates in React. This shows you've dealt with this in practice.

### 🟡 [Mid] Q8. What is implicit type coercion?

**Answer (EN):** Implicit coercion is JavaScript silently converting one type to another during an operation — without the developer writing an explicit conversion. It happens in 3 contexts: **string context** (`+` with a string operand → concatenation), **number context** (arithmetic operators `-`, `*`, `/`, `%` convert operands to numbers), **boolean context** (`if`, `&&`, `||`, `!` use truthiness). The rules are non-obvious: `[] + []` is `""`, `[] + {}` is `"[object Object]"`, `{} + []` is `0` or `"[object Object]"` depending on context. The danger: wrong results with no error thrown.

**Giải thích (VI):** Coercion ẩn là JS tự động đổi kiểu khi bạn không yêu cầu. Ví dụ: `"5" - 1 = 4` (string convert sang number) nhưng `"5" + 1 = "51"` (number convert sang string). Nguy hiểm vì không có lỗi, chỉ có kết quả sai. Nguyên tắc: chỉ dùng `+` với hai số hoặc hai chuỗi; nếu không chắc kiểu dữ liệu, convert tường minh trước.

**Ví dụ:**
```javascript
// String context: + prefers string concatenation
'5' + 1      // '51'   ← string + number = string
'5' + true   // '5true'

// Number context: -, *, / coerce to number
'5' - 1      // 4     ← string converted to number
'5' * '2'    // 10
true + 1     // 2     ← true → 1
false + 1    // 1     ← false → 0
null + 1     // 1     ← null → 0
undefined + 1 // NaN  ← undefined → NaN

// Boolean context (truthiness)
if ('0') console.log('truthy');  // logs! '0' is truthy (non-empty string)
if (0) console.log('truthy');    // does NOT log (0 is falsy)

// Real bug: summing form input values
const price = document.getElementById('price').value;  // string "10"
const tax = 0.1;
console.log(price + tax);  // "100.1" ← string concat, not addition!
// Fix: Number(price) + tax  or  +price + tax
```

**Interview Tip:** "I avoid relying on coercion. I use `===` instead of `==`, convert form inputs explicitly with `Number()`, and use TypeScript to catch type mismatches at compile time."

### 🔴 [Senior] Q9. Why does '5' + 1 differ from '5' - 1?

**Answer (EN):** The `+` operator is **overloaded** — it serves both string concatenation and numeric addition. When either operand is a string, `+` switches to string mode: it coerces the other operand to a string and concatenates. So `'5' + 1` becomes `'5' + '1'` = `'51'`. The `-` operator has **no string meaning** — it only means subtraction. So when JavaScript sees `-`, it coerces both operands to numbers: `'5' - 1` = `5 - 1` = `4`. This asymmetry is the most common source of JS coercion confusion. The spec rule: `+` calls `ToPrimitive` preferring `number`, then if either result is a string, concatenation wins.

**Giải thích (VI):** `+` có hai nghĩa: cộng số VÀ nối chuỗi. Khi có string, JS ưu tiên nối chuỗi. Các toán tử khác (`-`, `*`, `/`) chỉ có nghĩa số học nên JS tự ép kiểu về số. Đây là lý do `'5' + 1 = '51'` nhưng `'5' - 1 = 4`. Trong thực tế: luôn convert form input sang số trước khi tính toán.

**Ví dụ:**
```javascript
'5' + 1          // '51'  ← + with string → concatenation
'5' - 1          // 4     ← - has no string meaning → numeric
'5' * 2          // 10    ← * → numeric
'5' / '2'        // 2.5   ← / → numeric, both strings become numbers

// Chain of + operators
1 + 2 + '3'      // '33'  ← 1+2=3, then 3+'3'='33'
'1' + 2 + 3      // '123' ← '1'+2='12', then '12'+3='123'
// Order matters! Left to right evaluation

// Explicit conversion to avoid the trap
const input = '5';
const result = Number(input) + 1;  // 6
const result2 = +input + 1;        // 6 (unary + converts to number)
const result3 = parseInt(input) + 1; // 6

// Real-world pitfall: reduce on array of strings
['1', '2', '3'].reduce((a, b) => a + b)     // '123' ← string concat!
['1', '2', '3'].reduce((a, b) => +a + +b)   // 6    ← correct
```

**Interview Tip:** Explain ToPrimitive: when `+` has a non-primitive, JS calls `.valueOf()` then `.toString()`. If the result is a string, concatenation wins. Shows you know the spec, not just the behavior.

### 🟢 [Junior] Q10. List all falsy values in JavaScript.

**Answer (EN):** There are exactly **8 falsy values** in JavaScript: `false`, `0`, `-0`, `0n` (BigInt zero), `""` (empty string), `null`, `undefined`, `NaN`. Everything else is truthy — including `"0"` (non-empty string), `[]` (empty array), `{}` (empty object), and `function(){}`. The most common interview trick is `"0"` and `[]` — both are truthy despite looking "empty". Pitfall in form validation: `if (input)` incorrectly rejects the string `"0"` and the number `0` as invalid inputs.

**Giải thích (VI):** 8 giá trị falsy duy nhất: false, 0, -0, 0n, "", null, undefined, NaN. Tất cả còn lại là truthy — kể cả `"0"`, `[]`, `{}`. Lỗi phổ biến: `if (quantity)` reject quantity=0 vì 0 là falsy, nhưng 0 có thể là valid input (cart với 0 items). Luôn kiểm tra tường minh với `=== null` hoặc `=== undefined` thay vì bare truthiness khi đang validate user input.

**Ví dụ:**
```javascript
// The 8 falsy values
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];
falsyValues.every(v => !v);  // true — all falsy

// Surprises: these are TRUTHY
Boolean("0")          // true  ← non-empty string
Boolean([])           // true  ← empty array (object reference)
Boolean({})           // true  ← empty object
Boolean(-1)           // true  ← any non-zero number

// Form validation bug
function validateQuantity(qty) {
  if (!qty) return 'Required';  // BUG: rejects 0!
  return 'Valid';
}
validateQuantity(0);    // 'Required' — wrong!
validateQuantity(null); // 'Required' — correct

// Fix: explicit null/undefined check
function validateQuantitySafe(qty) {
  if (qty == null) return 'Required';  // only null/undefined
  if (typeof qty !== 'number') return 'Must be a number';
  return 'Valid';
}
validateQuantitySafe(0);  // 'Valid' ← correct
```

**Interview Tip:** After listing the 8, add: "The most common interview gotcha is `"0"` and `[]` being truthy. In production I've seen bugs where `if (errorCount)` silently passes when `errorCount` is `0`."

### 🟡 [Mid] Q11. How do truthy/falsy checks affect form validation?

**Answer (EN):** The 8 falsy values in JS are: `false`, `0`, `''`, `null`, `undefined`, `NaN`, `-0`, `0n`. Everything else is truthy. Form validation bug: `if (input.value)` silently rejects "0" as invalid and fails for the string "false" — both of which might be legitimate user inputs.

**Giải thích (VI):** 8 giá trị falsy: false, 0, '', null, undefined, NaN, -0, 0n. Lỗi form phổ biến: `if (username)` sẽ reject user nhập "0" vì 0 là falsy, nhưng đó có thể là valid input. Dùng kiểm tra tường minh thay vì bare truthiness.

**Ví dụ:**
```javascript
const username = '0';
if (!username) console.log('invalid'); // logs "invalid" — but "0" is valid!

// Correct approach:
if (username.trim().length === 0) console.log('invalid'); // silent pass for "0"
```

**Interview Tip:** Use explicit checks like `input.value.trim().length === 0` instead of bare truthiness.

### 🔴 [Senior] Q12. Compare == and ===.

**Answer (EN):** `===` checks value AND type with no coercion. `==` performs type coercion via the Abstract Equality Comparison algorithm — it has 12+ rules defining type conversion order, and most developers cannot reliably predict edge-case results.

**Giải thích (VI):** `===` kiểm tra cả type và value. `==` thực hiện type coercion theo 12 quy tắc phức tạp. Ví dụ `null == undefined` là `true` nhưng `null === undefined` là `false`. Dùng `===` làm default, chỉ dùng `==` khi có lý do rõ ràng.

**Ví dụ:**
```javascript
null == undefined   // true (special rule)
0 == false          // true (false coerced to 0)
'' == false         // true
0 === false         // false — no coercion
```

**Interview Tip:** Always use `===`. The only common exception: `value == null` checks both null AND undefined in one expression.

### 🟢 [Junior] Q13. When is using == acceptable?

**Answer (EN):** The only widely-accepted use of `==` is the null check: `value == null` returns true for both `null` and `undefined`, which is exactly what you want when checking "no value" without writing the longer `=== null || === undefined`.

**Giải thích (VI):** Trường hợp duy nhất chấp nhận `==`: `value == null` — trả về true cho cả null và undefined. Đây là pattern phổ biến để check "không có giá trị" gọn hơn `value === null || value === undefined`. Ngoài trường hợp này, luôn dùng `===`.

**Ví dụ:**
```javascript
function process(data) {
  if (data == null) return; // handles both null and undefined
  // ...
}
```

**Interview Tip:** Outside of this one null-check pattern, always use `===`. ESLint rule `eqeqeq` enforces this automatically.

### 🟡 [Mid] Q14. What is the difference between || and ??.

**Answer (EN):** `||` returns the right side when the left is ANY falsy value (0, '', false, null, undefined). `??` (nullish coalescing) ONLY triggers for null/undefined — not for 0 or empty string. Using `||` for defaults where 0 is valid is a common bug.

**Giải thích (VI):** `||` fallback khi left side là bất kỳ falsy value nào. `??` chỉ fallback khi left là null hoặc undefined. Bug phổ biến: `config.timeout || 5000` sẽ trả về 5000 khi timeout = 0 (valid value!). Dùng `config.timeout ?? 5000` thay thế.

**Ví dụ:**
```javascript
const t1 = 0 || 5000   // 5000 — BUG if 0 is a valid timeout!
const t2 = 0 ?? 5000   // 0 — correct, 0 is not null/undefined
```

**Interview Tip:** Prefer `??` for default values where 0 or empty string are valid inputs.

### 🔴 [Senior] Q15. How does optional chaining prevent runtime crashes?

**Answer (EN):** `?.` short-circuits to `undefined` when the left side is `null` or `undefined`, instead of throwing "Cannot read property of null/undefined". It prevents the most common runtime crash in frontend code. Works with property access, method calls (`obj?.method()`), and array indexing (`arr?.[0]`).

**Giải thích (VI):** `?.` trả về `undefined` ngay lập tức khi gặp null/undefined thay vì throw TypeError. Ngăn lỗi phổ biến nhất frontend: "Cannot read properties of undefined". Hoạt động với method calls `obj?.method()`, array access `arr?.[0]`, và deep nesting.

**Ví dụ:**
```javascript
const user = null;
user.name           // TypeError: Cannot read properties of null
user?.name          // undefined — safe
user?.address?.city // undefined — chained safe
```

**Interview Tip:** Combine with `??` for safe defaults: `user?.name ?? 'Guest'`.

### 🟢 [Junior] Q16. Explain short-circuiting with &&.

**Answer (EN):** `&&` evaluates left-to-right and returns the FIRST falsy value found, or the last value if all are truthy. It does not return true/false — it returns the actual value. This is used in React for conditional rendering: `isLoaded && <Component />`.

**Giải thích (VI):** `&&` trả về falsy value đầu tiên gặp phải, hoặc giá trị cuối nếu tất cả truthy. Trong React: `isLoaded && <Spinner />` — nếu isLoaded là false, không render Spinner. Lỗi phổ biến: `count && <List />` khi count = 0 sẽ render số "0" ra UI vì 0 là falsy nhưng không phải false.

**Ví dụ:**
```javascript
0 && 'hello'    // 0 (not false!)
true && 'hello' // 'hello'
// React bug:
const el = count && <List /> // renders "0" to DOM when count=0
```

**Interview Tip:** For React conditional rendering, use `count > 0 && <List />` or `!!count && <List />` to avoid rendering the number 0.

### 🟡 [Mid] Q17. What are pre/post increment pitfalls?

**Answer (EN):** `i++` returns the value BEFORE incrementing (post-increment). `++i` returns the value AFTER incrementing (pre-increment). In `for` loops both are equivalent. The pitfall is using `i++` as an expression value — the returned value is the old one, which surprises developers expecting the incremented result.

**Giải thích (VI):** `i++` trả về giá trị trước khi tăng. `++i` trả về giá trị sau khi tăng. Trong vòng lặp `for (let i = 0; i < n; i++)` không có sự khác biệt. Bug: `let x = 5; let y = x++; // y=5, x=6` — nhiều developer expect y=6.

**Ví dụ:**
```javascript
let i = 5;
let a = i++  // a=5, i=6 (post: return THEN increment)
let j = 5;
let b = ++j  // b=6, j=6 (pre: increment THEN return)
```

**Interview Tip:** Avoid using `i++` as an expression value. In `for` loops, both `i++` and `++i` behave identically.

### 🔴 [Senior] Q18. How do bitwise operators differ from logical operators?

**Answer (EN):** Logical operators (`&&`, `||`, `!`) work on boolean truthy/falsy and short-circuit — they stop evaluating as soon as the result is known. Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) work on the 32-bit integer representation of numbers, bit by bit, with NO short-circuiting. Used for permission flags, pixel manipulation, and hash functions.

**Giải thích (VI):** Bitwise hoạt động trên biểu diễn 32-bit integer của số — bit-by-bit, không short-circuit. Dùng trong: permission flags (`READ=1, WRITE=2, EXEC=4`), pixel manipulation trong Canvas, hash functions. Trong JS thuần thường ít dùng, nhưng xuất hiện trong performance-critical code.

**Ví dụ:**
```javascript
const READ = 1, WRITE = 2, EXEC = 4;
const perm = READ | WRITE   // 3 (binary: 011)
!!(perm & READ)              // true — has read permission
!!(perm & EXEC)              // false — no exec permission
```

**Interview Tip:** `~~n` (double bitwise NOT) acts as a fast Math.floor for positive numbers but hurts readability. Prefer `Math.floor` explicitly.

### 🟢 [Junior] Q19. When would you choose switch over if/else?

**Answer (EN):** Use `switch` when comparing ONE variable against MULTIPLE discrete values (string/number constants). Use `if/else` for ranges, complex conditions, or different variables per branch. Always include `break` — omitting it causes fallthrough to the next case, which is a common bug.

**Giải thích (VI):** Dùng `switch` khi: so sánh một biến với nhiều giá trị cụ thể (enum-like). Dùng `if/else` khi: điều kiện phức tạp, range check, hoặc mỗi branch dùng biến khác. Lỗi phổ biến: quên `break` → fallthrough sang case tiếp theo.

**Ví dụ:**
```javascript
switch (status) {
  case 'active': enable(); break;
  case 'banned': block();  break;
  default:       handleUnknown();
}
```

**Interview Tip:** Modern alternative to switch: object lookup `const actions = {active: enable, banned: block}; actions[status]?.();`.

### 🟡 [Mid] Q20. How does break affect loops?

**Answer (EN):** `break` exits the INNERMOST loop immediately. `continue` skips the rest of the current iteration and moves to the next. In nested loops, `break` only exits the inner loop — not all loops. Use a labeled statement (`outer:`) to break out of multiple levels at once.

**Giải thích (VI):** `break` thoát khỏi vòng lặp trong cùng ngay lập tức. `continue` bỏ qua phần còn lại của iteration hiện tại. Lỗi phổ biến: expect `break` thoát khỏi vòng lặp ngoài khi đang ở vòng lặp trong.

**Ví dụ:**
```javascript
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break outer  // exits both loops
  }
}
```

**Interview Tip:** If you find yourself using labeled breaks often, consider refactoring into a function that uses `return` instead.

### 🔴 [Senior] Q21. Difference between for...of and for...in?

**Answer (EN):** `for...of` iterates over VALUES of any iterable (array, string, Map, Set, generator). `for...in` iterates over ENUMERABLE PROPERTY KEYS of an object — and its entire prototype chain, which is dangerous. Never use `for...in` on arrays.

**Giải thích (VI):** `for...of` = giá trị của iterable (array, string, Map, Set). `for...in` = tên property của object (bao gồm inherited properties!). Không dùng `for...in` với array: (1) key là string "0","1","2" không phải number, (2) nếu ai extend Array.prototype, bạn sẽ iterate những property đó.

**Ví dụ:**
```javascript
const arr = [10, 20];
for (const v of arr) console.log(v)  // 10, 20 — values
for (const k in arr) console.log(k)  // "0", "1" — string keys
```

**Interview Tip:** Use `for...of` for arrays. Use `Object.keys()`, `Object.entries()`, or `Object.values()` for objects instead of `for...in`.

### 🟢 [Junior] Q22. How do you safely parse JSON from APIs?

**Answer (EN):** Wrap `JSON.parse()` in try/catch — it throws a SyntaxError for invalid JSON. Additionally validate the SHAPE of the result before using it, since valid JSON does not guarantee the expected data structure.

**Giải thích (VI):** `JSON.parse()` throw SyntaxError khi JSON không hợp lệ → wrap trong try/catch. Nhưng JSON hợp lệ không đảm bảo shape đúng — cần validate thêm hoặc dùng runtime schema validation (Zod, Joi).

**Ví dụ:**
```javascript
function safeJsonParse(str) {
  try {
    const data = JSON.parse(str)
    if (!data?.user?.id) throw new Error('unexpected shape')
    return data
  } catch (e) {
    console.error('JSON parse failed:', e)
    return null
  }
}
```

**Interview Tip:** In production, use Zod for schema validation: `UserSchema.parse(JSON.parse(response))` — it validates and gives you TypeScript types.

### 🟡 [Mid] Q23. Why should you avoid swallowing errors silently?

**Answer (EN):** An empty catch block `catch(e) {}` hides bugs — the code fails silently with no indication of what went wrong. Silent failures are the hardest to debug in production because there is nothing to trace. Always log with context, re-throw, or return an explicit error value.

**Giải thích (VI):** `catch (e) {}` ẩn bug — code fail nhưng không có thông báo, không có log. Sau 3 tháng, không ai biết tại sao feature không hoạt động. Luôn: log lỗi với context, hoặc re-throw, hoặc return error value rõ ràng.

**Ví dụ:**
```javascript
// BAD:
try { data = JSON.parse(str) } catch(e) {}
// GOOD:
try { data = JSON.parse(str) }
catch(e) { console.error('Parse failed for input:', str, e); data = null }
```

**Interview Tip:** ESLint rule `no-empty` catches empty catch blocks. Set it to `warn` at minimum in your project config.

### 🔴 [Senior] Q24. What does finally guarantee?

**Answer (EN):** `finally` ALWAYS runs — regardless of whether try succeeded, catch ran, or even if there is a `return` inside try or catch. It guarantees cleanup: closing connections, releasing locks, hiding loading spinners. Subtle pitfall: a `return` inside `finally` overrides any `return` in try or catch.

**Giải thích (VI):** `finally` luôn chạy — kể cả khi try return, catch return, hay throw lỗi tiếp. Dùng để đảm bảo cleanup: đóng DB connection, ẩn loading spinner, release mutex. Lỗi tinh tế: return trong finally OVERRIDE return trong try.

**Ví dụ:**
```javascript
async function fetchUser() {
  setLoading(true)
  try {
    return await api.get('/user')
  } catch(e) {
    showError(e)
  } finally {
    setLoading(false)  // ALWAYS runs — no need to duplicate in catch
  }
}
```

**Interview Tip:** `finally` is the ideal place for `setLoading(false)` — eliminates the need to duplicate it in both the try and catch branches.

### 🟢 [Junior] Q25. How do you rethrow errors with context?

**Answer (EN):** Catch the error, add context (what operation failed, what input caused it), then throw a new Error wrapping the original. This creates a useful error chain for debugging — you see both where the error was re-thrown and the original root cause.

**Giải thích (VI):** Catch → thêm context (operation nào fail, input là gì) → throw Error mới bọc error cũ. Tạo "error chain" để debug dễ hơn. Đừng chỉ `throw e` mà không thêm gì — mất context về ngữ cảnh gọi hàm.

**Ví dụ:**
```javascript
async function getUser(id) {
  try {
    return await db.query('SELECT * FROM users WHERE id=?', [id])
  } catch(e) {
    throw new Error(`getUser(${id}) failed: ${e.message}`, { cause: e })
  }
}
```

**Interview Tip:** ES2022 `Error cause` option: `new Error('message', {cause: originalError})` preserves the full original stack trace for debugging.

### 🟡 [Mid] Q26. What is idempotent control flow in UI handlers?

**Answer (EN):** An idempotent operation produces the same result regardless of how many times it runs. In UI handlers: clicking "Submit" 3 times should not create 3 orders. Achieve this by disabling the button immediately after first click, or using an `isSubmitting` flag that guards against duplicate execution.

**Giải thích (VI):** Idempotent = chạy nhiều lần cho cùng kết quả. Vấn đề hay gặp: user click Submit nhanh 2 lần → 2 orders được tạo. Fix: disable button ngay sau click đầu tiên, hoặc dùng flag `isSubmitting`, hoặc debounce handler.

**Ví dụ:**
```javascript
let isSubmitting = false;
btn.addEventListener('click', async () => {
  if (isSubmitting) return
  isSubmitting = true
  try { await submitOrder() }
  finally { isSubmitting = false }
})
```

**Interview Tip:** On the backend, pair with idempotency keys (unique request ID) to deduplicate requests even if the frontend sends duplicates due to retries.

### 🔴 [Senior] Q27. Why are guard clauses useful?

**Answer (EN):** Guard clauses (early returns for edge cases) reduce nesting and make the "happy path" obvious. Instead of wrapping everything in deep `if (valid) { ... }` blocks, return or throw early for invalid inputs. Code reads top-to-bottom without increasing indentation.

**Giải thích (VI):** Guard clause = early return cho edge case. Giảm nesting, làm "happy path" rõ ràng. Quy tắc: fail fast, return early. Code ít indent hơn → dễ đọc và test hơn. Còn gọi là "anti-pattern of pyramid of doom".

**Ví dụ:**
```javascript
// WITHOUT guards (pyramid of doom):
function process(user, data) {
  if (user) { if (data) { if (data.valid) { /* actual logic */ } } }
}
// WITH guards:
function process(user, data) {
  if (!user) return null
  if (!data?.valid) throw new Error('invalid data')
  // happy path
}
```

**Interview Tip:** ESLint's `no-else-return` rule enforces guard clause style — if there is a `return` in the `if`, the `else` is unnecessary.

### 🟢 [Junior] Q28. How do you validate unknown input types?

**Answer (EN):** Use `typeof` for primitives, `Array.isArray()` for arrays (since `typeof [] === 'object'`), and `instanceof` for class instances. For complex shapes from external sources (APIs, user input), use runtime schema validation (Zod, Yup). Never assume the type of external input.

**Giải thích (VI):** `typeof` cho primitives (string, number, boolean, undefined, function). `Array.isArray()` vì `typeof []` là 'object'. `instanceof` cho class instances. Không bao giờ assume type của external input — API có thể thay đổi hoặc trả về unexpected format.

**Ví dụ:**
```javascript
function normalize(val) {
  if (typeof val === 'string') return val.trim()
  if (typeof val === 'number') return val.toString()
  if (Array.isArray(val)) return val.join(', ')
  return String(val)
}
```

**Interview Tip:** TypeScript handles compile-time type checking, but runtime validation (Zod) is still necessary for API responses — TypeScript types don't exist at runtime.

### 🟡 [Mid] Q29. What is NaN and how to check it correctly?

**Answer (EN):** `NaN` (Not a Number) is the result of invalid numeric operations: `0/0`, `parseInt('abc')`, `Math.sqrt(-1)`. Its unique property: `NaN !== NaN` — it is the only value in JS that is not equal to itself. Never use `=== NaN` to check for it; always use `Number.isNaN()`.

**Giải thích (VI):** NaN là kết quả của phép toán số học không hợp lệ. Đặc biệt: `NaN !== NaN` — duy nhất trong JS. Không dùng `x === NaN` (luôn false). Dùng `Number.isNaN(x)` để kiểm tra chính xác, tránh `isNaN()` vì nó coerce input trước.

**Ví dụ:**
```javascript
const x = parseInt('abc')  // NaN
x === NaN              // false — NaN never equals itself!
Number.isNaN(x)        // true — correct way
isNaN('hello')         // true — coerces string to NaN first
Number.isNaN('hello')  // false — no coercion, 'hello' is not NaN
```

**Interview Tip:** Prefer `Number.isNaN()` over the global `isNaN()` to avoid unexpected coercion of non-number values.

### 🔴 [Senior] Q30. Difference between Number.isNaN and isNaN?

**Answer (EN):** Global `isNaN(val)` first coerces `val` to a Number, THEN checks if it is NaN — so `isNaN('hello')` is `true` because `Number('hello')` is NaN. `Number.isNaN(val)` does NOT coerce — it only returns true if the value literally IS the NaN primitive.

**Giải thích (VI):** `isNaN()` coerce sang number trước, rồi kiểm tra. `Number.isNaN()` không coerce — chỉ trả true nếu value THỰC SỰ là NaN. `isNaN('abc')` = true vì `Number('abc')` = NaN. `Number.isNaN('abc')` = false vì 'abc' không phải NaN — nó là một string.

**Ví dụ:**
```javascript
isNaN('hello')          // true (coerces to NaN first — misleading!)
Number.isNaN('hello')   // false (no coercion — 'hello' is a string)
Number.isNaN(NaN)       // true
Number.isNaN(undefined) // false
```

**Interview Tip:** Always use `Number.isNaN()`. The global `isNaN` is a legacy function whose coercion behavior causes false positives on any non-numeric input.

### 🟢 [Junior] Q31. What is Object.is and when to use it?

**Answer (EN):** `Object.is(a, b)` is like `===` but handles two edge cases correctly: `Object.is(NaN, NaN)` is `true` (unlike `===` which gives false), and `Object.is(-0, +0)` is `false` (unlike `===` which gives true). React uses it internally for change detection.

**Giải thích (VI):** `Object.is()` như `===` nhưng xử lý 2 edge case: NaN===NaN (false với ===, true với Object.is), và -0===+0 (true với ===, false với Object.is). React dùng `Object.is` trong useState change detection để tránh unnecessary re-renders.

**Ví dụ:**
```javascript
NaN === NaN           // false — surprising!
Object.is(NaN, NaN)   // true
+0 === -0             // true
Object.is(+0, -0)     // false
```

**Interview Tip:** You rarely need `Object.is` in application code. Knowing it demonstrates understanding of JS numeric edge cases — a detail that signals senior-level depth.

### 🟡 [Mid] Q32. Why is floating-point arithmetic imprecise?

**Answer (EN):** JavaScript uses IEEE 754 double-precision floating-point — numbers are stored in binary, and most decimal fractions (like 0.1) have infinite binary representations that get rounded. When two rounded values are added, the rounding errors accumulate, causing `0.1 + 0.2 !== 0.3`.

**Giải thích (VI):** JS dùng IEEE 754 binary64 — lưu số dưới dạng nhị phân. 0.1 trong binary là 0.000110011001100... (vô hạn) bị làm tròn. Khi cộng 0.1 + 0.2, hai lỗi làm tròn cộng lại thành sai số nhỏ. Đây không phải bug của JS — Python, Java, C đều có cùng hành vi.

**Ví dụ:**
```javascript
0.1 + 0.2              // 0.30000000000000004
0.1 + 0.2 === 0.3      // false
(0.1 + 0.2).toFixed(1) // '0.3' — string, not number
```

**Interview Tip:** For money and finance: store integer cents (not decimal dollars) or use `decimal.js` / `big.js` for arbitrary precision arithmetic.

### 🔴 [Senior] Q33. How do you compare decimals safely?

**Answer (EN):** Three approaches: (1) use `toFixed()` for display-level string comparison, (2) epsilon comparison: `Math.abs(a - b) < Number.EPSILON`, (3) for financial code, multiply to integers (store cents, not dollars) and do all arithmetic as integers — never float.

**Giải thích (VI):** (1) `toFixed(2)` cho display. (2) So sánh chênh lệch nhỏ hơn epsilon: `Math.abs(a-b) < Number.EPSILON`. (3) Tốt nhất cho tài chính: lưu cents (integer), chỉ convert sang dollars khi display. Tránh float arithmetic hoàn toàn trong code xử lý tiền.

**Ví dụ:**
```javascript
// Epsilon comparison:
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON  // true
// Integer approach for money:
const price = 1099  // cents ($10.99)
const tax   = 88    // cents ($0.88)
const total = price + tax  // 1187 cents → display as $11.87
```

**Interview Tip:** Never store money as float in a database. Use INTEGER (cents/pence) or DECIMAL column type — float columns lose precision over aggregations.

### 🟢 [Junior] Q34. What is temporal coupling in imperative code?

**Answer (EN):** Temporal coupling means function B only works correctly if function A was called first. The ORDER dependency is implicit — nothing in the function signature warns callers. This makes code fragile: future developers call B without knowing A must run first, causing silent bugs.

**Giải thích (VI):** Temporal coupling = B chỉ hoạt động đúng nếu A đã được gọi trước. Order phụ thuộc ngầm, không rõ ràng trong function signature. Fix: truyền kết quả của A vào B như parameter, hoặc dùng một hàm orchestrator gọi cả A và B theo đúng thứ tự.

**Ví dụ:**
```javascript
// BAD: temporal coupling — initialize() must be called first
let user;
function initialize() { user = loadFromStorage() }
function fetch() { return db.get(user.id) }  // crashes if init skipped

// GOOD: explicit dependency
function fetchUser(userId) { return db.get(userId) }
```

**Interview Tip:** If you see `init()` or `setup()` called at the top of a function, ask "what happens if this is skipped?" — that reveals temporal coupling.

### 🟡 [Mid] Q35. How can defaults hide real bugs?

**Answer (EN):** Default values in function parameters can mask the case where the caller forgot to pass a required argument. If `undefined` should not be a valid input, silently defaulting is worse than throwing — it hides the caller's bug and produces wrong behavior downstream.

**Giải thích (VI):** Default values che giấu lỗi khi caller quên pass argument. Ví dụ: `function getUser(id = 1)` — nếu caller pass undefined vì bug, hàm silently fetch user #1 thay vì throw lỗi. Defaults chỉ nên dùng khi undefined là intentional optional case.

**Ví dụ:**
```javascript
// BAD: default silently hides caller bug
function deleteUser(id = 0) { db.delete(id) }  // deletes user 0 if id forgotten!

// GOOD: explicit validation for required params
function deleteUser(id) {
  if (id == null) throw new Error('id is required')
  db.delete(id)
}
```

**Interview Tip:** Required params should throw on missing value. Optional params with sensible defaults are fine — the key distinction is whether `undefined` is an intentional or erroneous input.

### 🔴 [Senior] Q36. Why is explicit conversion better in APIs?

**Answer (EN):** When a function receives data from an external source (user input, API response), convert types explicitly at the boundary. This documents intent, catches errors early with clear messages, and ensures the interior business logic always works with guaranteed types — no defensive checks needed deep inside.

**Giải thích (VI):** Explicit conversion tại boundary (input validation layer) đảm bảo: (1) code bên trong luôn nhận đúng type, (2) lỗi type được phát hiện sớm với message rõ ràng, (3) không cần type check ở nhiều chỗ khác nhau trong code. "Trust but verify" tại system boundary.

**Ví dụ:**
```javascript
function processOrder(body) {
  const quantity = Number(body.quantity)
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new BadRequestError('quantity must be a positive integer')
  // from here: quantity is guaranteed safe — no further checks needed
  return createOrder(quantity)
}
```

**Interview Tip:** Use schema libraries (Zod, Joi) for boundary validation — they generate both runtime validation and TypeScript types from a single schema definition.

### 🟢 [Junior] Q37. How do you explain event-driven behavior in basics round?

**Answer (EN):** In JavaScript, events are messages dispatched by the browser (click, keydown, fetch response). Handlers are callback functions registered to respond when those events fire. The Event Loop processes one event at a time from the queue whenever the call stack is empty — this is why JS stays non-blocking despite being single-threaded.

**Giải thích (VI):** Events = thông điệp từ browser (click chuột, phím bấm, response từ server). Handler = callback function đăng ký để xử lý event. Event Loop kiểm tra queue liên tục — khi call stack rỗng, lấy event tiếp theo ra xử lý. Đây là lý do JS "không bị block" dù single-threaded.

**Ví dụ:**
```javascript
document.querySelector('#btn').addEventListener('click', (e) => {
  console.log('clicked:', e.target.id)  // e is the Event object
})
// Click doesn't block — handler runs when event fires via Event Loop
```

**Interview Tip:** When explaining to an interviewer: "JS is single-threaded but non-blocking because event handlers are scheduled asynchronously through the Event Loop."

### 🟡 [Mid] Q38. What baseline debugging process do you follow?

**Answer (EN):** Six steps: (1) Reproduce consistently. (2) Isolate — binary search the codebase to narrow the failing component. (3) Instrument — add console.log or a debugger breakpoint at the narrowed location. (4) Form a hypothesis. (5) Verify with a targeted test. (6) Fix and add a regression test. Never guess randomly.

**Giải thích (VI):** Quy trình debug chuẩn: (1) Reproduce ổn định. (2) Isolate bằng binary search — vấn đề ở đâu? (3) Instrument: console.log hoặc breakpoint. (4) Hypothesis: tại sao? (5) Verify. (6) Fix + regression test. Không đoán mò, không "random change until fixed".

**Ví dụ:**
```javascript
// Instrumentation to narrow down where null comes from:
console.log('[getUser] input:', userId, typeof userId)
const user = await db.query(userId)
console.log('[getUser] result:', user)
```

**Interview Tip:** Chrome DevTools: Sources tab → set breakpoint → step through code. More efficient than console.log for tracing complex async flows.

### 🔴 [Senior] Q39. How do you answer basics questions under pressure?

**Answer (EN):** Structure every answer in three steps: (1) State the rule in one sentence. (2) Give a 2-3 line code example. (3) Name one common mistake. This takes 30-45 seconds and demonstrates systematic thinking. Then invite follow-up: "I can go deeper into X if that's useful."

**Giải thích (VI):** Cấu trúc cho mọi câu trả lời: (1) Quy tắc chính — 1 câu. (2) Code example — 2-3 dòng. (3) Lỗi phổ biến — 1 câu. Sau đó mời follow-up: "Tôi có thể đi sâu hơn vào X nếu cần." Interviewer đánh giá clarity và structure cao hơn là kiến thức nhiều nhưng lộn xộn.

**Ví dụ:**
```javascript
// Template khi bị hỏi bất ngờ:
// 1. Rule: "const is block-scoped and cannot be reassigned"
// 2. Example: const x = 1; x = 2; // TypeError
// 3. Pitfall: "const object properties CAN be mutated"
// 4. "Want me to dig into const vs Object.freeze()?"
```

**Interview Tip:** It is OK to say "Give me a moment to think." Interviewers respect candidates who think before speaking over those who blurt out wrong answers confidently.

### 🟢 [Junior] Q40. What common JavaScript beginner mistakes appear in interviews?

**Answer (EN):** Top 5 mistakes: (1) `var` in closures/loops — all callbacks share the same reference. (2) Forgetting `await` — getting a Promise object instead of the resolved value. (3) Mutating array/object arguments directly — causes unexpected side effects. (4) Using `==` instead of `===`. (5) `typeof null === 'object'` — the historic JS bug that trips up null checks.

**Giải thích (VI):** 5 lỗi phổ biến nhất: (1) `var` trong loop closure → tất cả callback dùng chung i. (2) Quên `await` → nhận Promise thay vì data. (3) Mutate array parameter trực tiếp → side effect ngoài ý muốn. (4) `==` thay vì `===`. (5) `typeof null === 'object'` — bug lịch sử từ ngày đầu của JS.

**Ví dụ:**
```javascript
// Mistake 1: var in loop (use let instead)
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0) // 3,3,3

// Mistake 2: forgot await
const data = fetch('/api/user')        // Promise object, not data!
const data = await fetch('/api/user')  // correct
```

**Interview Tip:** These 5 mistakes appear in nearly every junior interview. Being able to spot and explain each one signals real experience beyond tutorial code.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: List được đủ 5 mistakes với ví dụ code, giải thích được tại sao mỗi cái là bug (not just "it's wrong")
- ❌ Weak: "Dùng var thay vì let/const" — chỉ liệt kê mà không giải thích consequence

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| What is JS and why single-threaded? | 🟢 | One thread + Web APIs delegation + Event Loop |
| ECMAScript vs JavaScript? | 🟡 | Spec vs implementation; TC39 Stage 0-4 |
| Major ES milestones? | 🔴 | ES5 (strict/JSON), ES6 (let/class/module), ES2017 (await), ES2020 (?.) |
| When to enable strict mode? | 🟢 | Always; auto in ES modules/TypeScript/classes |
| Strict mode accidental globals? | 🟡 | `x = 5` → ReferenceError; `this` in fn → undefined |
| How does V8 optimize? | 🔴 | JIT: hidden classes, inline caching, code gen |
| Truthy vs falsy values? | 🟢 | 8 falsy values; `[]` and `{}` are truthy |
| `||` vs `??` operator? | 🟡 | `||` rejects all falsy; `??` only null/undefined |
| How does Event Loop work? | 🟡 | Stack → Web APIs → Queue → Stack (when empty) |
| Top 5 beginner mistakes? | 🟢 | var loop, forgot await, mutation, ==, typeof null |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Why is JavaScript single-threaded, and how does it handle async operations?"**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**
1. "JavaScript is single-threaded by design — it shares a thread with browser rendering, so having multiple JS threads would require mutex locks on the DOM, making it far more complex."
2. "Async is handled by offloading I/O work to Web APIs (the browser's C++ layer) — `fetch`, `setTimeout`, event listeners all run outside the JS engine."
3. "When those operations complete, their callbacks land in the task queue; the Event Loop picks them up and pushes them onto the call stack only when it's empty."
4. "The gotcha: even `setTimeout(fn, 0)` is deferred — it will never run before the current synchronous code finishes, which surprises developers who expect '0ms' to mean 'immediately'."

*Sau đó mở rộng: microtask vs macrotask queue, Promise vs setTimeout ordering, Web Workers for true parallelism.*

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết ra từ trí nhớ đúng 8 falsy values trong JavaScript. Không được nhìn lại — sau đó kiểm tra bạn có nhớ `-0` và `0n` không?
- [ ] **Visual**: Vẽ sơ đồ JavaScript Runtime Architecture từ trí nhớ: Call Stack, Web APIs, Callback Queue, Event Loop — và mũi tên nối chúng.
- [ ] **Application**: `const qty = 0; const display = qty || 'N/A';` — `display` là gì? Tại sao? Sửa code để `0` hiển thị đúng.
- [ ] **Debug**: Code `const user = fetch('/api/user'); console.log(user.name);` in ra `undefined`. Nguyên nhân? Fix?
- [ ] **Teach**: Giải thích "tại sao `setTimeout(fn, 0)` không chạy ngay" cho người không biết lập trình — dùng liên tưởng bartender.

💬 **Feynman Prompt:** Giải thích Event Loop cho bạn không biết code, dùng liên tưởng nhà bếp nhà hàng. Không dùng từ "thread", "stack", "queue", hay "callback".

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** Không có prerequisite — đây là điểm khởi đầu của JS track
- ➡️ **Enables:** [Variables & Data Types](./01-variables-data-types.md) — kiểu dữ liệu và var/let/const; [Event Loop & Async](./06-event-loop-async.md) — chi tiết về Event Loop
- 🔗 **Applied in:** Mọi JS code — understanding the runtime model giải thích tại sao async patterns tồn tại

[← Previous](../../00-table-of-contents.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./01-variables-data-types.md)
