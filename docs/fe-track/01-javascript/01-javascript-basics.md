# JavaScript Basics / Nền Tảng JavaScript

> **Track**: FE · **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: Không cần — đây là điểm bắt đầu
> **See also**: [Variables & Types](./02-variables-types.md) · [Scope & Hoisting](./03-scope-hoisting.md)
> **L5 Competencies**: Language Internals · Runtime Understanding · Spec-Level Debugging

---

## Real-World Scenario / Tình Huống Thực Tế

**Production bug:** Form tính giá hiển thị `"100.1"` thay vì `10.1`. Senior debug 2 phút — phát hiện `document.getElementById('price').value` trả về string `"10"`, và `"10" + 0.1` nối chuỗi thành `"100.1"` thay vì cộng số. Junior đã fix bằng `parseFloat()` nhưng không hiểu tại sao `+` hoạt động khác `-`.

**Bài học:** Hiểu JavaScript runtime model, type coercion, và execution context không phải "lý thuyết thừa" — đây là công cụ debug chính xác. Engineer biết spec fix bug trong phút; engineer chỉ biết syntax phải trial-and-error trong giờ.

---

## What & Why / Cái Gì & Tại Sao

**Giải thích đơn giản:** Tưởng tượng JavaScript như **đầu bếp một mình trong nhà hàng**:

- Chỉ nấu **một món một lúc** (single-threaded)
- Khi món cần nướng 20 phút (async), anh ta **đưa cho lò nướng** (Web APIs) rồi nấu món khác
- Lò xong → để lên quầy (callback queue) → đầu bếp lấy khi rảnh (Event Loop)

**Tại sao quan trọng?**

- Ngôn ngữ **duy nhất** chạy native trên mọi browser
- Vừa client (browser) vừa server (Node.js) — một ngôn ngữ toàn stack
- Mọi behavior "kỳ lạ" (coercion, hoisting, `this`) đều có lý do trong spec

---

## Concept Map / Bản Đồ Khái Niệm

```
                    ┌─────────────────────────┐
                    │   JavaScript Runtime     │
                    │   (Single-threaded)      │
                    └──────────┬──────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Execution   │  │ Type System  │  │  Event Loop  │
    │  Context     │  │ & Coercion   │  │  & Async     │
    └──────┬───────┘  └──────┬───────┘  └──────────────┘
           │                 │
    ┌──────┴───────┐  ┌──────┴───────┐
    │ Creation     │  │ 8 Primitives │
    │ Phase →      │  │ + Objects    │
    │ Execution    │  │              │
    │ Phase        │  │ Coercion:    │
    │              │  │ ToPrimitive  │
    │ Hoisting =   │  │ ToNumber     │
    │ Creation     │  │ ToBoolean    │
    │ Phase        │  │              │
    └──────────────┘  │ Equality:    │
                      │ == / === /   │
                      │ Object.is   │
                      └──────────────┘
```

---

## Overview / Tổng Quan

**JavaScript** là ngôn ngữ lập trình single-threaded, dynamic typing, JIT-compiled. Chạy trên V8 (Chrome/Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari). File này cover 6 khái niệm nền tảng mà mọi JS developer cần nắm vững: runtime model, execution context, type system, coercion, equality, và strict mode.

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. JavaScript Runtime Model / Mô Hình Thực Thi

> 🧠 **Memory Hook**: "Đầu bếp một mình + lò nướng riêng = single-threaded + Web APIs"

**Tại sao tồn tại?**

- **Why single-threaded?** Brendan Eich thiết kế JS để chạy trên browser — nơi DOM cần được access/modify. Nếu nhiều thread cùng modify DOM → race condition, corrupt UI.
- **Why async nếu single-threaded?** Nếu chờ network request 3 giây → UI đóng băng 3 giây. Giải pháp: delegate I/O sang Web APIs (browser) hoặc libuv (Node.js), JS thread tiếp tục chạy.

#### Layer 1: Analogy / Liên Tưởng

Bartender một mình trong quán bar:

- Chỉ pha **một ly một lúc** (single-threaded)
- Cocktail phức tạp cần ngâm 5 phút → đưa cho prep team (Web APIs)
- Prep team xong → để ly lên quầy (callback queue)
- Bartender rảnh → lấy ly từ quầy (Event Loop)
- **Quan trọng:** Bartender KHÔNG BAO GIỜ pha hai ly cùng lúc

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
JavaScript Runtime Architecture:
┌────────────────────────────────────────────────────────┐
│  JS Engine (V8)            │  Web APIs (Browser)        │
│  ┌───────────────────┐     │  ┌──────────────────────┐  │
│  │   Call Stack       │     │  │ setTimeout           │  │
│  │   ┌─────────────┐ │     │  │ fetch / XHR          │  │
│  │   │ greet()     │─┼─────┼─►│ DOM events           │  │
│  │   │ main()      │ │     │  │ geolocation          │  │
│  │   └─────────────┘ │     │  └──────────┬───────────┘  │
│  └───────────────────┘     │             │ done          │
│                            │             ▼               │
│  ┌─────────────────────────┴───────────────────────┐    │
│  │     Microtask Queue (Promises, queueMicrotask)  │    │
│  ├─────────────────────────────────────────────────┤    │
│  │     Macrotask Queue (setTimeout, setInterval)   │    │
│  └─────────────────────────────────────────────────┘    │
│         ▲                                               │
│         └── Event Loop: khi stack rỗng →                │
│             1. Chạy HẾT microtask queue                 │
│             2. Lấy 1 macrotask → chạy → lặp lại        │
└────────────────────────────────────────────────────────┘
```

```javascript
console.log("1"); // → Call Stack → log ngay
setTimeout(() => console.log("2"), 0); // → Web API → Macrotask Queue
Promise.resolve().then(() => console.log("3")); // → Microtask Queue
console.log("4"); // → Call Stack → log ngay

// Output: 1 → 4 → 3 → 2
// Sync trước → Microtask (Promise) → Macrotask (setTimeout)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// Blocking code đóng băng TOÀN BỘ UI
while (Date.now() < Date.now() + 2000) {} // freeze 2s — không click, scroll được

// setTimeout(fn, 0) KHÔNG chạy ngay — vẫn phải chờ stack rỗng
setTimeout(() => console.log("async"), 0);
console.log("sync"); // sync trước, async sau

// Microtask có thể starve macrotask
function flood() {
  Promise.resolve().then(flood);
}
flood(); // setTimeout callbacks sẽ KHÔNG BAO GIỜ chạy
```

**❌ Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                        | Đúng là                                                        |
| ---------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| "setTimeout(fn, 0) chạy ngay"      | Callback vẫn vào macrotask queue, chờ stack rỗng + microtasks xong | Ít nhất 1 cycle sau; sync code luôn chạy trước                 |
| "JS là multi-threaded vì có async" | Async ≠ multi-threading; chỉ có 1 JS thread                        | Web APIs chạy ngoài engine, nhưng JS code chạy single-threaded |
| "Event Loop là một phần của V8"    | V8 chỉ có Call Stack + Heap                                        | Event Loop là của browser/Node.js runtime                      |

**🎯 Interview Pattern:**

- **Trigger**: "why single-threaded?", "how does async work?", "setTimeout 0"
- **Concept**: Single thread + Web APIs delegation + Event Loop scheduling
- **Opening**: _"JavaScript là single-threaded — có một call stack. Async hoạt động bằng cách delegate I/O sang Web APIs, callback trả về qua Event Loop khi stack rỗng. Microtask (Promise) luôn chạy trước macrotask (setTimeout)."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Không — đây là mental model nền tảng
- ➡️ Để hiểu tiếp: [Event Loop & Async](./07-event-loop-async.md) — microtask vs macrotask chi tiết, Promise scheduling

---

### 2. Execution Context / Ngữ Cảnh Thực Thi

> 🧠 **Memory Hook**: "Creation Phase = scan & reserve; Execution Phase = chạy từng dòng. Hoisting CHÍNH LÀ Creation Phase."

**Tại sao tồn tại?**

- **Why cần Creation Phase?** Vì `function` và `var` có thể dùng trước dòng khai báo — engine phải scan và chuẩn bị bindings trước khi chạy code.
- **Why `let`/`const` khác `var`?** Theo thiết kế: `var` được initialized thành `undefined` trong Creation Phase, nhưng `let`/`const` chỉ được "bind" nhưng chưa initialized → access trước dòng khai báo = ReferenceError (TDZ).
- **Why quan trọng?** Khi thấy `undefined` vs `ReferenceError` cho cùng pattern, sự khác biệt chính xác là behavior của Creation Phase.

#### Layer 1: Analogy / Liên Tưởng

Execution Context như **chuẩn bị bàn tiệc**:

- **Creation Phase** = đặt tên thẻ cho từng ghế (var → thẻ "chưa ai ngồi", function → thẻ "đã xác nhận", let/const → thẻ "đã đặt nhưng chưa đến")
- **Execution Phase** = khách đến từng người → ngồi vào ghế → tiệc bắt đầu
- Nếu bạn gọi tên khách "đã xác nhận" (function) → OK
- Nếu bạn gọi tên khách "chưa ai ngồi" (var) → "undefined" (có thẻ nhưng trống)
- Nếu bạn gọi tên khách "đã đặt nhưng chưa đến" (let/const) → "Chưa đến!" (ReferenceError)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
function example() {
  console.log(a);    // undefined   (var initialized trong Creation)
  console.log(b);    // ReferenceError (let trong TDZ)
  console.log(fn);   // ƒ fn() {}   (function hoisted hoàn toàn)

  var a = 1;
  let b = 2;
  function fn() { return 42; }
}

CREATION PHASE (trước khi dòng 1 chạy):
┌──────────┬───────────┬─────────────┬───────────────────┐
│ Binding  │ Mutable?  │ Initialized?│ Value             │
├──────────┼───────────┼─────────────┼───────────────────┤
│ a (var)  │ ✅        │ ✅          │ undefined         │
│ b (let)  │ ✅        │ ❌ (TDZ)    │ ???               │
│ fn       │ ✅        │ ✅          │ [Function fn]     │
└──────────┴───────────┴─────────────┴───────────────────┘

EXECUTION PHASE (chạy từng dòng):
  Line 5: a = 1   → a.value = 1
  Line 6: b = 2   → b.initialized = true, b.value = 2
```

```javascript
// 3 loại Execution Context:
// 1. Global EC — tạo khi script bắt đầu
// 2. Function EC — tạo mỗi khi gọi function
// 3. Eval EC — hiếm gặp, tránh dùng

// Call Stack = LIFO stack các Execution Context
function a() {
  b();
}
function b() {
  c();
}
function c() {
  console.trace();
}
a();
// Call Stack: [Global] → [a()] → [b()] → [c()]
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// Hoisting + Shadowing trap
var name = "global";
function demo() {
  console.log(name); // undefined (KHÔNG phải 'global'!)
  var name = "local"; // var name hoisted → shadow global name
  console.log(name); // 'local'
}
demo();

// Function expression KHÔNG hoisted giá trị
greet(); // TypeError: greet is not a function
var greet = function () {
  console.log("hi");
};
// var greet hoisted → undefined, gọi undefined() → TypeError

// let trong TDZ
console.log(typeof x); // ReferenceError (TDZ)
let x = 1;
// Nhưng:
console.log(typeof y); // "undefined" (y chưa khai báo — không phải TDZ)
```

**❌ Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                                                | Đúng là                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| "Hoisting di chuyển code lên đầu"                  | Code KHÔNG di chuyển — Creation Phase xử lý declarations trước execution                   | Hoisting = Creation Phase tạo bindings trước khi chạy code |
| "`let` không được hoisted"                         | `let` ĐƯỢC tạo binding trong Creation Phase — chỉ là chưa initialized (TDZ)                | `let` IS hoisted — but not initialized (TDZ)               |
| "Function expression được hoisted như declaration" | `const fn = () => {}` — `const` binding trong TDZ; chỉ `function fn(){}` hoisted hoàn toàn | Chỉ function declaration hoisted với value                 |
| "`var` leak ra block scope là bug"                 | Đây là designed behavior — `var` luôn function-scoped                                      | Dùng `let`/`const` cho block scope                         |

**🎯 Interview Pattern:**

- **Trigger**: "hoisting", "TDZ", "undefined vs ReferenceError"
- **Concept**: Creation Phase tạo bindings; loại declaration (var/let/fn) quyết định initial state
- **Opening**: _"Hoisting thực chất là Creation Phase của Execution Context. Tất cả bindings được tạo trước khi code chạy: `var` initialized thành `undefined`, function declaration nhận full function, `let`/`const` được bind nhưng chưa initialized — access trong khoảng đó là TDZ ReferenceError."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Không — đây là concept nền tảng
- ➡️ Để hiểu tiếp: [Scope & Hoisting](./03-scope-hoisting.md) — scope chain, closure captures environment record; [this keyword](./05-this-keyword.md) — `this` binding trong Creation Phase

---

### 3. Type System & Coercion / Hệ Thống Kiểu & Ép Kiểu

> 🧠 **Memory Hook**: "8 primitive types + Object. Coercion chain: ToPrimitive → valueOf/toString → ToNumber/ToString. `+` thích string, `-*/` ép number."

**Tại sao tồn tại?**

- **Why dynamic typing?** JS thiết kế cho web forms năm 1995 — cần linh hoạt: `"42"` từ input field tự convert sang số khi tính toán.
- **Why implicit coercion nguy hiểm?** Vì không có lỗi khi kết quả sai. `"10" + 5 = "105"` (nối chuỗi) thay vì `15` — code chạy bình thường, chỉ kết quả sai.
- **Why `+` khác `-`?** `+` bị overload — vừa cộng số vừa nối chuỗi. Khi có string, `+` ưu tiên nối chuỗi. `-*/` chỉ có nghĩa số học → luôn ép ToNumber.

#### Layer 1: Analogy / Liên Tưởng

Type coercion như **Google Translate tự động**: JS thấy hai kiểu khác nhau cần "nói chuyện" → tự dịch. Nhưng giống Google Translate, đôi khi dịch sai mà không báo lỗi. Bạn nói "tôi yêu bạn" (tính cộng `"10" + 5`) nhưng Google dịch thành "I glue you" (nối thành `"105"`).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
8 Language Types trong JavaScript:
┌────────────────────────────────────────────────┐
│ PRIMITIVES (7):                                │
│  undefined · null · boolean · number · bigint  │
│  string · symbol                               │
│                                                │
│ REFERENCE (1):                                 │
│  object (bao gồm Array, Function, Date, ...)   │
└────────────────────────────────────────────────┘

Primitive vs Reference — cách lưu trong memory:
┌──────────────┐          ┌──────────────┐
│ STACK         │          │ HEAP          │
│ a = 5      ──┤          │               │
│ b = 5      ──┤          │  ┌──────────┐ │
│ obj1 = ───────┼─────────►  │ {name:   │ │
│ obj2 = ───────┼─────────►  │  "Alice"}│ │
│               │          │  └──────────┘ │
└──────────────┘          └──────────────┘
  a, b: bản sao độc lập     obj1, obj2: cùng tham chiếu!
  b = 10 → a vẫn là 5       obj2.name = "Bob" → obj1.name cũng "Bob"

Abstract Operations — coercion chain:
ToPrimitive(obj, hint):
  1. Có Symbol.toPrimitive? → gọi với hint
  2. hint = "number": valueOf() → toString()
  3. hint = "string": toString() → valueOf()
  4. Default hint: "number" (Date dùng "string")

ToNumber conversion:
  undefined → NaN        null → 0
  false → 0              true → 1
  "" → 0                 "42" → 42        "abc" → NaN
  [] → ToPrimitive → "" → 0
  {} → ToPrimitive → "[object Object]" → NaN

Operator behavior:
  "5" + 1  = "51"     ← + thấy string → nối chuỗi
  "5" - 1  = 4        ← - chỉ có nghĩa số → ToNumber
  "5" * 2  = 10       ← * chỉ có nghĩa số → ToNumber
```

```javascript
// Primitive: copy by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — unchanged, bản sao độc lập

// Object: copy by reference
const user = { name: "Alice" };
const admin = user; // cùng tham chiếu!
admin.name = "Bob";
console.log(user.name); // 'Bob' — cả hai trỏ cùng object

// Fix: tạo bản sao mới
const copy = { ...user }; // shallow copy → break reference

// Chain coercion surprise
1 + 2 + "3"; // '33'  ← (1+2=3) → (3+'3'='33')
"1" + 2 + 3; // '123' ← ('1'+2='12') → ('12'+3='123')
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// The most confusing coercion results:
[] + []         // ""   ← [].toString() = "", "" + "" = ""
[] + {}         // "[object Object]" ← "" + {}.toString()
{} + []         // 0    ← {} parsed as empty block, +[] → 0
[] == false     // true ← false→0, []→""→0, 0==0

// typeof quirks
typeof null         // "object" — lỗi lịch sử 30 năm
typeof undefined    // "undefined"
typeof function(){} // "function" — special case, vẫn là object
typeof NaN          // "number" — NaN IS a number type

// React state mutation bug
const [items, setItems] = useState([1, 2, 3]);
items.push(4);        // BAD: mutate cùng reference → no re-render
setItems([...items]); // GOOD: new reference → triggers re-render
```

**❌ Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                | Đúng là                                                  |
| ------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------- |
| "`+` luôn cộng số"             | `+` overloaded — có string → nối chuỗi                     | Dùng `Number()` explicit trước khi cộng                  |
| "`[]` là falsy"                | `[]` là object → truthy! `Boolean([]) === true`            | `[] == false` true vì KHÁC algorithm (Abstract Equality) |
| "`typeof null` trả về 'null'"  | Trả về `"object"` — bug lịch sử                            | Dùng `value === null` để check null                      |
| "`const` làm object immutable" | `const` chỉ ngăn reassign biến, KHÔNG ngăn mutate nội dung | Dùng `Object.freeze()` cho shallow immutability          |

**🎯 Interview Pattern:**

- **Trigger**: "type coercion", "why '5'+1 differs from '5'-1", "primitive vs reference"
- **Concept**: `+` overloaded (string > number), `-*/` force number; ToPrimitive chain
- **Opening**: _"JavaScript có 7 primitive types + Object. `+` bị overload nên khi có string sẽ nối chuỗi. Các toán tử khác chỉ có nghĩa số học nên ép ToNumber. Đây là lý do `'5'+1='51'` nhưng `'5'-1=4`."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Không — đây là nền tảng
- ➡️ Để hiểu tiếp: [Variables & Types](./02-variables-types.md) — var/let/const, deep vs shallow copy; [Prototypes](./06-prototypes-inheritance.md) — prototype chain ảnh hưởng valueOf/toString

---

### 4. Truthy/Falsy & Short-circuit / Giá Trị Truthy/Falsy & Toán Tử Ngắn Mạch

> 🧠 **Memory Hook**: "Chỉ 8 falsy: `false 0 -0 0n '' null undefined NaN`. Mọi thứ khác truthy — kể cả `'0'`, `[]`, `{}`."

**Tại sao tồn tại?**

- **Why cho non-boolean vào `if`?** Để code ngắn hơn: `if (arr.length)` thay vì `if (arr.length > 0)`.
- **Why nguy hiểm?** `if (count)` reject `0` — một giá trị hợp lệ. `if (name)` reject `""` — có thể là valid empty input. Implicit truthiness check ≠ null check.
- **Why `??` ra đời?** `||` coi `0` và `""` là "missing" → sai cho default values. `??` chỉ trigger khi `null`/`undefined` → đúng semantic.

#### Layer 1: Analogy / Liên Tưởng

Falsy/truthy như **danh sách đen vào club**: chỉ 8 người bị từ chối (falsy list). TẤT CẢ người khác được vào — kể cả `"0"` (string không rỗng), `[]` (empty array), `{}` (empty object). Bouncer KHÔNG kiểm tra nội dung — chỉ kiểm tra tên có trong danh sách đen hay không.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
8 Falsy Values (tất cả còn lại = truthy):
┌─────────────────────────────────────────────────────┐
│ false | 0 | -0 | 0n | "" | null | undefined | NaN  │
└─────────────────────────────────────────────────────┘

Surprising truthies:
  "0"       → truthy (string không rỗng)
  "false"   → truthy (string không rỗng)
  []        → truthy (object reference)
  {}        → truthy (object reference)
  -1        → truthy (bất kỳ số ≠ 0)

Short-circuit operators:
┌──────────────────────────────────────────────────────────┐
│ a && b  → a falsy? return a : return b                   │
│ a || b  → a truthy? return a : return b                  │
│ a ?? b  → a là null/undefined? return b : return a       │
└──────────────────────────────────────────────────────────┘

|| vs ?? — the critical difference:
Value    │ || 'default'  │ ?? 'default'  │ Nhận xét
─────────┼───────────────┼───────────────┼──────────────────
0        │ 'default'     │ 0             │ ?? giữ 0 (valid!)
""       │ 'default'     │ ""            │ ?? giữ "" (valid!)
false    │ 'default'     │ false         │ ?? giữ false
null     │ 'default'     │ 'default'     │ Cả hai fallback
undefined│ 'default'     │ 'default'     │ Cả hai fallback
```

```javascript
// React conditional rendering gotcha
const count = 0;
{
  count && <List />;
} // Renders "0" trên UI! (0 là falsy nhưng KHÔNG phải false)
{
  count > 0 && <List />;
} // Correct — explicit boolean
{
  !!count && <List />;
} // Cũng đúng — coerce to boolean

// Default value patterns
const timeout = config.timeout || 5000; // BUG: timeout=0 → 5000
const timeout = config.timeout ?? 5000; // CORRECT: timeout=0 → 0

// Safe deep access + fallback
const city = user?.address?.city ?? "Unknown";
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// Form validation trap
function validate(qty) {
  if (!qty) return "Required"; // BUG: rejects qty=0!
  return "Valid";
}
validate(0); // 'Required' — sai!
validate(null); // 'Required' — đúng

// Fix: explicit null check
function validateSafe(qty) {
  if (qty == null) return "Required"; // chỉ null/undefined
  return "Valid";
}
validateSafe(0); // 'Valid' — đúng!

// ?? cannot mix with || or && without parentheses
// a ?? b || c    → SyntaxError!
// (a ?? b) || c  → OK
```

**❌ Common Mistakes:**

| Sai lầm                              | Tại sao sai                      | Đúng là                                        |
| ------------------------------------ | -------------------------------- | ---------------------------------------------- |
| Dùng `\|\|` cho default value với số | `0` và `""` bị coi là "missing"  | Dùng `??` cho defaults khi 0 và "" là valid    |
| `"0"` là falsy                       | String `"0"` KHÔNG rỗng → truthy | Chỉ `""` (empty string) là falsy               |
| `[]` và `{}` là falsy                | Object reference luôn truthy     | `Boolean([]) === true`, `Boolean({}) === true` |
| `count && <Component />` safe        | `count=0` render số "0" ra DOM   | Dùng `count > 0 && <Component />`              |

**🎯 Interview Pattern:**

- **Trigger**: "falsy values", "`||` vs `??`", "conditional rendering"
- **Concept**: 8 falsy values + `??` chỉ null/undefined
- **Opening**: _"JavaScript có đúng 8 falsy values. Khi cần default value, dùng `??` thay `||` để không accidentally reject `0` hay `''`. Trong React conditional rendering, dùng explicit boolean thay vì bare value."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Primitives & type coercion (concept 3)
- ➡️ Để hiểu tiếp: [ES6+ Features](./08-es6-features.md) — optional chaining `?.`, destructuring defaults

---

### 5. Equality Algorithms / Thuật Toán So Sánh Bằng

> 🧠 **Memory Hook**: "`==` coerce (12 rules phức tạp), `===` no coerce (kiểu khác → false), `Object.is` fix NaN và ±0. React dùng `Object.is`."

**Tại sao tồn tại?**

- **Why `==` coerce?** Thiết kế năm 1995 — "tiện" cho web forms: `"42" == 42` → `true`. Nhìn lại, hầu hết style guides cấm `==`.
- **Why `null == undefined` đặc biệt?** Spec quy định: `null` và `undefined` CHỈ bằng nhau trong `==`, không bằng bất kỳ giá trị nào khác. Đây là lý do `value == null` check cả null VÀ undefined.
- **Why `Object.is`?** `===` có 2 edge cases: `NaN !== NaN` (sai logic) và `+0 === -0` (khác bit nhưng coi bằng). `Object.is` fix cả hai — React dùng nó cho state comparison.

#### Layer 1: Analogy / Liên Tưởng

3 mức kiểm tra giấy tờ:

- **`==`** (sơ sài): "Bạn TÊN gì?" — tự dịch tên tiếng Việt sang tiếng Anh rồi so (coercion)
- **`===`** (nghiêm ngặt): "Cho xem CMND" — kiểu + giá trị phải khớp chính xác
- **`Object.is`** (forensic): "Quét vân tay" — phân biệt được cả `NaN` (cùng người) và `+0`/`-0` (hai người sinh đôi)

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Abstract Equality Algorithm (==):
┌──────────────────────────────────────────────────────┐
│ x == y:                                              │
│ 1. Cùng type? → dùng === logic                       │
│ 2. null == undefined? → TRUE (special case)          │
│ 3. Number == String? → ToNumber(String), so lại      │
│ 4. Boolean == anything? → ToNumber(Boolean), so lại  │
│ 5. Object == Primitive? → ToPrimitive(Object), so lại│
└──────────────────────────────────────────────────────┘

Strict Equality (===):
  Khác type → FALSE ngay lập tức
  NaN === NaN → FALSE (luôn luôn!)
  +0 === -0 → TRUE

Object.is (SameValue):
  Object.is(NaN, NaN) → TRUE  ← fix so với ===
  Object.is(+0, -0)   → FALSE ← fix so với ===
  Còn lại giống ===

Trace: [] == false
  Step 1: false → ToNumber → 0        → [] == 0
  Step 2: [] → ToPrimitive → "" → 0   → 0 == 0
  Step 3: same type, same value        → TRUE
```

```javascript
// == surprises
null == undefined   // true  (special case)
null == 0           // false (null KHÔNG bằng 0 trong ==!)
0 == false          // true  (false → 0, 0 == 0)
'' == false         // true  (false → 0, '' → 0, 0 == 0)
[] == false         // true  (trace ở trên)

// === predictable
0 === false         // false — khác type
'' === false        // false — khác type
null === undefined  // false — khác type

// Object.is edge cases
NaN === NaN         // false (spec quirk)
Object.is(NaN, NaN) // true  (correct!)
+0 === -0           // true  (spec quirk)
Object.is(+0, -0)   // false (correct!)

// React dùng Object.is cho state comparison
const [val, setVal] = useState(NaN);
setVal(NaN); // NO re-render — Object.is(NaN, NaN) = true
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// The only acceptable == use case
if (value == null) {
  /* handles both null AND undefined */
}
// Equivalent to: value === null || value === undefined

// NaN detection
NaN === NaN; // false — cannot use === for NaN
Number.isNaN(NaN); // true  — correct way
isNaN("hello"); // true  — WRONG! converts string first
Number.isNaN("hello"); // false — correct, no coercion

// Symbol.toPrimitive affects == behavior
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 42;
    if (hint === "string") return "forty-two";
    return true; // default
  },
};
obj == 42; // true (hint "number" → 42)
```

**❌ Common Mistakes:**

| Sai lầm                               | Tại sao sai                                              | Đúng là                                                                   |
| ------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| "Luôn dùng `===`, không bao giờ `==`" | `value == null` là pattern hợp lệ duy nhất               | `== null` check cả null+undefined, tiện hơn `=== null \|\| === undefined` |
| "NaN == NaN là true"                  | NaN KHÔNG bằng chính nó trong cả `==` và `===`           | Dùng `Number.isNaN()` hoặc `Object.is(x, NaN)`                            |
| "React dùng `===` cho state"          | React dùng `Object.is` — khác `===` ở NaN và ±0          | `Object.is(NaN, NaN) = true` → no re-render khi set NaN lần 2             |
| "`null == 0` là true"                 | `null` chỉ `== undefined`, không bằng bất kỳ thứ gì khác | `null == 0` là FALSE (spec special case)                                  |

**🎯 Interview Pattern:**

- **Trigger**: "`==` vs `===`", "NaN equality", "React state comparison"
- **Concept**: 3 algorithms khác nhau; `Object.is` fix 2 edge cases của `===`
- **Opening**: _"`==` coerce theo 12+ rules của Abstract Equality Algorithm. `===` không coerce — khác type = false ngay. `Object.is` giống `===` nhưng fix 2 edge cases: `NaN` bằng chính nó, `+0` không bằng `-0`. React dùng `Object.is` cho state comparison."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Type coercion (concept 3), ToNumber/ToPrimitive
- ➡️ Để hiểu tiếp: [React Fundamentals](../03-react/01-react-fundamentals.md) — React dùng `Object.is` cho state comparison, ảnh hưởng re-render behavior

---

### 6. Strict Mode / Chế Độ Nghiêm Ngặt

> 🧠 **Memory Hook**: "`'use strict'` = bật đèn cảnh báo — biến silent failures thành thrown errors. ES modules + class tự động bật."

**Tại sao tồn tại?**

- **Why cần strict mode?** JS ES3 có nhiều "silent failures" — lỗi xảy ra nhưng không throw, code chạy sai âm thầm.
- **Why opt-in thay vì bắt buộc?** Backward compatibility — không thể break hàng triệu website cũ bằng cách throw lỗi mới.
- **Why vẫn quan trọng năm 2024+?** ES modules và TypeScript auto-enable strict mode. Hiểu strict mode = hiểu tại sao `this` là `undefined` trong function call, tại sao gán biến chưa khai báo throw error.

#### Layer 1: Analogy / Liên Tưởng

Strict mode như **bật chế độ kiểm tra nghiêm ngặt ở sân bay**: trước đây cho qua những thứ đáng ngờ (silent failures). Bật strict = mọi vi phạm nhỏ đều bị báo ngay (throw error) thay vì âm thầm lọt qua.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Strict Mode biến silent failures → thrown errors:
┌────────────────────────┬──────────────────────────────────┐
│ SLOPPY MODE            │ STRICT MODE                      │
├────────────────────────┼──────────────────────────────────┤
│ x = 5 (quên let/const) │ ReferenceError: x is not defined│
│ function(a, a) {}      │ SyntaxError (duplicate params)   │
│ delete non-configurable│ TypeError                        │
│ this trong fn() = window│ this = undefined                │
│ with statement         │ SyntaxError                      │
│ Assign to read-only    │ TypeError                        │
└────────────────────────┴──────────────────────────────────┘

Auto-enabled trong:
  ✅ ES modules (import/export)
  ✅ <script type="module">
  ✅ TypeScript files
  ✅ Class bodies
  ❌ Regular <script> tags (phải thêm 'use strict')
```

```javascript
"use strict";

// 1. Accidental global → ReferenceError
function buggy() {
  total = 0; // ReferenceError! (sloppy: window.total = 0)
}

// 2. this trong standalone function → undefined
function showThis() {
  return this;
}
showThis(); // undefined (sloppy: window)

// 3. Assign to read-only → TypeError
const obj = Object.freeze({ x: 1 });
obj.x = 2; // TypeError (sloppy: silently ignored)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

```javascript
// Method extraction + strict mode
const obj = {
  name: "Alice",
  greet() {
    return this.name;
  },
};
const greet = obj.greet;
greet(); // strict: TypeError (this.name — this is undefined)
// sloppy: window.name (global property)

// Strict mode scope
function outer() {
  "use strict";
  function inner() {
    // cũng strict — inherited
    x = 1; // ReferenceError
  }
}

// Arrow functions sidestep this confusion entirely
const obj2 = {
  name: "Bob",
  greet: () => this.name, // this = outer scope, NOT obj2
};
```

**❌ Common Mistakes:**

| Sai lầm                                                  | Tại sao sai                                                  | Đúng là                                     |
| -------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------- |
| "Dùng TypeScript nên không cần strict mode"              | TS strict = type checking; JS strict mode = runtime behavior | Cả hai đều cần — TS strict ≠ `'use strict'` |
| "Strict mode ảnh hưởng toàn file khi đặt trong function" | Chỉ áp dụng cho function đó và nested functions              | Đặt ở đầu file để áp dụng toàn bộ           |
| "Class không cần strict mode"                            | Class body LUÔN strict — không cần khai báo                  | Biết behavior khi extract methods           |

**🎯 Interview Pattern:**

- **Trigger**: "`'use strict'`", "`this` undefined in function", "accidental global"
- **Concept**: Biến silent failures → thrown errors; 4 categories: globals, this, params, delete
- **Opening**: _"Strict mode biến silent failures của JavaScript thành thrown errors. Cụ thể: gán biến chưa khai báo → ReferenceError, `this` trong standalone function → undefined thay vì window, duplicate params → SyntaxError. ES modules và class bodies auto-enable strict mode."_

**🔑 Knowledge Chain:**

- 📚 Cần biết trước: Variables & scope basics
- ➡️ Để hiểu tiếp: [this keyword](./05-this-keyword.md) — strict mode thay đổi `this` binding; [ES6+ Features](./08-es6-features.md) — modules auto-strict

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1. JavaScript là gì và tại sao single-threaded?

**EN:** JavaScript is a dynamically typed, JIT-compiled scripting language. It runs on a single thread — one call stack, one piece of code at a time. The reason: browser rendering and JS share the same thread; concurrent DOM access from multiple threads would require complex locking. Async work (fetch, timers) is handled via the Event Loop delegating to Web APIs, not additional threads.

**VI:** JavaScript là ngôn ngữ single-threaded — có 1 call stack, chạy 1 đoạn code tại 1 thời điểm. Lý do: browser rendering và JS share cùng thread; nhiều thread modify DOM đồng thời sẽ gây race condition. Async (fetch, setTimeout) dùng Event Loop delegate sang Web APIs — KHÔNG phải multi-threading.

```javascript
// Blocking code freezes UI
while (Date.now() < Date.now() + 2000) {} // UI đóng băng 2s

// Non-blocking: setTimeout yields to Event Loop
console.log("sync");
setTimeout(() => console.log("async"), 0);
console.log("sync2");
// Output: sync → sync2 → async
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích Web APIs delegation + Event Loop, biết tại sao DOM access cần single-thread
- ❌ Weak: "JS là single-threaded" — đúng nhưng không giải thích được WHY và async hoạt động thế nào

---

### 🟢 Q2. Kể 8 falsy values và phân biệt `||` vs `??`

**EN:** The 8 falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy — including `"0"`, `[]`, `{}`. `||` returns right side for ANY falsy; `??` only for null/undefined. Use `??` when `0` or `""` are valid values.

**VI:** 8 falsy: false, 0, -0, 0n, "", null, undefined, NaN. `"0"`, `[]`, `{}` đều truthy. `||` fallback cho bất kỳ falsy, `??` chỉ cho null/undefined. Dùng `??` khi 0 hay "" là valid.

```javascript
0 || 5000; // 5000 — BUG nếu timeout=0 là valid
0 ?? 5000; // 0    — CORRECT
```

**💡 Interview Signal:**

- ✅ Strong: Kể đủ 8, biết `"0"` và `[]` truthy, phân biệt `||` vs `??` với ví dụ thực tế
- ❌ Weak: "null và undefined là falsy" — đúng nhưng thiếu 6 cái còn lại

---

### 🟡 Q3. Giải thích hoisting chính xác — thực sự xảy ra gì?

**EN:** Hoisting is the Creation Phase of the Execution Context. Before any code runs, the engine scans and creates bindings: `var` → initialized to `undefined`; function declarations → initialized to the full function object; `let`/`const` → bound but NOT initialized (TDZ). Code doesn't "move to the top" — the Creation Phase processes declarations before the Execution Phase runs line by line.

**VI:** Hoisting là Creation Phase của Execution Context. Engine scan tất cả declarations trước khi chạy code: `var` initialized thành `undefined`, function declaration nhận full function, `let`/`const` bind nhưng chưa initialized (TDZ). Code KHÔNG di chuyển — đó là Creation Phase chạy trước Execution Phase.

```javascript
console.log(a); // undefined (var initialized trong Creation)
console.log(b); // ReferenceError (let trong TDZ)
greet(); // "hi" (function declaration hoisted hoàn toàn)

var a = 1;
let b = 2;
function greet() {
  console.log("hi");
}
```

**💡 Interview Signal:**

- ✅ Strong: Dùng terminology "Creation Phase", phân biệt var/fn/let behavior, giải thích TDZ = "bound but uninitialized"
- ❌ Weak: "Biến được di chuyển lên đầu file" — code không di chuyển; mental model sai dẫn đến bugs

---

### 🟡 Q4. Tại sao `'5' + 1` khác `'5' - 1`? Giải thích ở spec level.

**EN:** The `+` operator is overloaded — it serves both string concatenation and numeric addition. When either operand is a string, `+` switches to string mode: coerces the other to a string. So `'5' + 1` → `'5' + '1'` = `'51'`. The `-` operator has NO string meaning — it only does subtraction, so it coerces both operands via ToNumber: `'5' - 1` → `5 - 1` = `4`.

**VI:** `+` bị overload — vừa cộng số vừa nối chuỗi. Khi có string, `+` ưu tiên nối chuỗi. `-` chỉ có nghĩa số học → ép ToNumber. Đó là lý do `"5" + 1 = "51"` nhưng `"5" - 1 = 4`. Spec rule: `+` gọi ToPrimitive, nếu kết quả là string → concatenation.

```javascript
"5" + 1; // '51'  — string concatenation
"5" - 1; // 4     — numeric subtraction
"5" * "2"; // 10    — numeric
1 + 2 + "3"; // '33' — (1+2)=3, 3+'3'='33' (left-to-right)
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích ToPrimitive chain, biết `+` overloaded, nêu left-to-right evaluation
- ❌ Weak: "JS tự convert" — đúng nhưng không biết RULE nào quyết định convert kiểu gì

---

### 🟡 Q5. `==` vs `===` vs `Object.is` — khi nào dùng cái nào?

**EN:** `==` applies the Abstract Equality Algorithm (12+ coercion rules). `===` checks type AND value with no coercion — different types always return false. `Object.is` is same as `===` except: `Object.is(NaN, NaN)` → true, `Object.is(+0, -0)` → false. React uses `Object.is` for state comparison. In practice: use `===` everywhere, `== null` for null/undefined check, `Number.isNaN()` for NaN check.

**VI:** `==` coerce theo 12+ rules. `===` không coerce — khác type = false. `Object.is` giống `===` nhưng fix: `NaN` bằng chính nó, `+0 ≠ -0`. React dùng `Object.is`. Thực hành: `===` everywhere, `== null` check null/undefined, `Number.isNaN()` check NaN.

```javascript
null == undefined; // true (special case)
null == 0; // false (!!)
Object.is(NaN, NaN); // true (=== returns false)
Object.is(+0, -0); // false (=== returns true)
```

**💡 Interview Signal:**

- ✅ Strong: Nêu 2 edge cases của `===` mà `Object.is` fix, biết React dùng `Object.is`
- ❌ Weak: "`===` luôn đúng" — miss NaN case

---

### 🔴 Q6. Trace `[] == false` step-by-step theo Abstract Equality Algorithm.

**EN:** Step 1: `false` is Boolean → ToNumber(false) = 0. Now `[] == 0`. Step 2: `[]` is Object, `0` is Number → ToPrimitive([]) → calls `[].valueOf()` returns `[]` (not primitive) → calls `[].toString()` returns `""`. Now `"" == 0`. Step 3: `""` is String, `0` is Number → ToNumber("") = 0. Now `0 == 0`. Same type, same value → `true`. Meanwhile, `Boolean([])` uses ToBoolean where all objects are truthy → `true`. Same value, two different spec paths, seeming opposite results.

**VI:** Step 1: `false` → ToNumber → `0`. `[] == 0`. Step 2: `[]` → ToPrimitive → valueOf() trả `[]` (không primitive) → toString() trả `""`. `"" == 0`. Step 3: `""` → ToNumber → `0`. `0 == 0` → TRUE. Nhưng `Boolean([])` dùng ToBoolean — object luôn truthy → `true`. Cùng value, hai algorithm khác nhau.

```javascript
[] == false     // true  (Abstract Equality: coercion chain)
Boolean([])     // true  (ToBoolean: objects are truthy)
![]             // false (ToBoolean → true → negated)
[] == ![]       // true! (RHS: ![] → false → 0; LHS: [] → "" → 0)
```

**💡 Interview Signal:**

- ✅ Strong: Trace từng step với spec operation names (ToPrimitive, ToNumber), giải thích tại sao `Boolean([])` khác `[] == false`
- ❌ Weak: "Arrays are truthy" — đúng nhưng không giải thích được `[] == false`

**🔗 Follow-up Chain:**

1. _"Vậy `null == 0` trả về gì?"_ → `false`. `null` chỉ `== undefined`, không bằng bất kỳ thứ gì khác (spec special case).
2. _"React dùng gì để compare state? Khi nào nó khác `===`?"_ → `Object.is`. Khác ở `NaN` (equal) và `+0/-0` (not equal).
3. _"Làm sao bạn validate input từ form mà không bị coercion trap?"_ → Convert explicit với `Number()`, validate với `Number.isNaN()`, dùng `??` cho defaults.

---

### 🔴 Q7. `if (count)` skip khi count = 0. Fix và giải thích spec-level.

**EN:** `if (count)` applies ToBoolean — `0` is in the falsy set. The intent is "was a count provided?" (null/undefined check), not "is the count nonzero?" (truthiness check). Fix: `if (count != null)` — uses the `== null` special case that only matches null/undefined. Or explicit: `if (count !== undefined && count !== null)`. Spec-level diagnosis: the bug is confusing ToBoolean (truthiness) with a null/undefined check.

**VI:** `if (count)` dùng ToBoolean — `0` là falsy. Ý định là "count có được cung cấp?" nhưng thực tế check "count có nonzero?". Fix: `if (count != null)` — chỉ reject null/undefined. Spec diagnosis: nhầm ToBoolean với null check.

```javascript
// BUG
function process(count) {
  if (!count) return "No count"; // rejects 0!
}
process(0); // 'No count' — sai!

// FIX
function processSafe(count) {
  if (count == null) return "No count"; // chỉ null/undefined
  if (typeof count !== "number") return "Invalid";
  return `Count: ${count}`;
}
processSafe(0); // 'Count: 0' — đúng!
processSafe(null); // 'No count' — đúng!
```

**💡 Interview Signal:**

- ✅ Strong: Nêu ToBoolean, list falsy set, fix đúng `!= null`, giải thích null/undefined special case
- ❌ Weak: "Dùng strict equality" — `count !== undefined` alone không handle null

**🔗 Follow-up Chain:**

1. _"Nếu dùng TypeScript, strict null checks có ngăn bug này không?"_ → Có — `count: number | null | undefined` force handle null case explicitly.
2. _"Trong codebase lớn, làm sao enforce pattern này?"_ → ESLint custom rule, hoặc `@typescript-eslint/strict-boolean-expressions`.
3. _"Ngoài `== null`, còn pattern nào check 'có giá trị' an toàn?"_ → `value !== null && value !== undefined`, hoặc Zod schema validation ở boundary.

---

### 🔴 Q8. Thiết kế strategy validate input từ API response — không bị coercion trap.

**EN:** Strategy: validate at the BOUNDARY (where data enters your system), not inline. Use schema validation (Zod) to parse + validate API responses. This catches: wrong types (`"42"` instead of `42`), missing fields, null vs undefined differences. Never rely on implicit coercion for business logic. Convert explicitly with `Number()`, `String()`, `Boolean()`. Use `??` for defaults, `===` for comparison, `Number.isNaN()` for NaN check.

**VI:** Strategy: validate ở BOUNDARY (nơi data vào hệ thống). Dùng schema validation (Zod) parse + validate API response. Bắt được: sai type, missing fields, null vs undefined. Không dựa vào implicit coercion cho business logic. Convert explicit bằng `Number()`, `String()`. Dùng `??` cho defaults, `===` cho comparison.

```javascript
// BAD: inline coercion everywhere
function processOrder(data) {
  const total = data.price * data.qty; // "10" * "2" = 20... may work
  if (!data.discount) { /* skip */ }   // 0 discount skipped!
}

// GOOD: validate at boundary
import { z } from 'zod';
const OrderSchema = z.object({
  price: z.number().positive(),
  qty: z.number().int().positive(),
  discount: z.number().min(0).default(0),
});

function processOrder(raw: unknown) {
  const data = OrderSchema.parse(raw); // throws if invalid
  // data.price is GUARANTEED number
  // data.discount is GUARANTEED number (0 is valid!)
  const total = data.price * data.qty * (1 - data.discount);
}
```

**💡 Interview Signal:**

- ✅ Strong: Boundary validation pattern, Zod schema, explicit conversion, nêu được coercion trap cụ thể
- ❌ Weak: "Dùng TypeScript" — TS chỉ compile-time, API response vẫn unknown at runtime

**🔗 Follow-up Chain:**

1. _"Zod schema validation có overhead performance không?"_ → Có nhưng nhỏ (ms level). Trade-off: runtime safety > microsecond performance ở boundary.
2. _"Nếu không dùng Zod, làm sao validate manually?"_ → Type guards: `typeof`, `instanceof`, explicit null checks, `Number.isFinite()`.
3. _"Architecture-level: ở đâu nên đặt validation layer?"_ → API boundary (controller/handler), form submission, localStorage read. Isolation principle: domain logic nhận typed data, KHÔNG raw input.

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Zalo — Type Coercion Caused Silent Message ID Collision

**Situation:** A chat feature stored message IDs from the API (returned as strings: `"1234567890123"`) in a Map. A comparison function used `==` instead of `===` to look up messages. JavaScript's Abstract Equality Comparison coerced the string `"0"` to `0`, matching numeric key `0` — causing first unread message markers to silently attach to the wrong message on clients using 32-bit number parsing.

**What went wrong:**
```javascript
// API returned: { id: "1234567890123", ... }
const messageMap = new Map();
messageMap.set(msg.id, msg); // set with string key "1234567890123"

// Bug: lookup used ==
function findMessage(id) {
  for (const [key, val] of messageMap) {
    if (key == id) return val; // ← "1234567890123" == 1234567890123 → true (coercion)
  }
}
// On 32-bit overflow: large IDs coerced to wrong number → wrong message returned
```

**Decision made:** Enforce `===` via ESLint `eqeqeq: "error"` rule across entire codebase. All IDs treated as strings end-to-end — never coerced to number. Added type annotations in JSDoc to document ID type contract.

**Trade-off accepted:** Stricter typing means more explicit `String(id)` or `Number(id)` conversions at API boundaries, but eliminates entire class of coercion bugs silently corrupting data.

**Lesson:** JS type coercion is not a feature to use in production — it's a footgun to audit out. `===` everywhere and string IDs from APIs are non-negotiable at scale.

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                         | Level | One-liner                                                  |
| --- | ----------------------------- | ----- | ---------------------------------------------------------- |
| 1   | JS single-threaded            | 🟢    | 1 call stack + Web APIs delegation + Event Loop scheduling |
| 2   | Falsy values + `\|\|` vs `??` | 🟢    | 8 falsy, `??` chỉ null/undefined, `\|\|` tất cả falsy      |
| 3   | Hoisting = Creation Phase     | 🟡    | var→undefined, fn→full object, let/const→TDZ               |
| 4   | `+` vs `-` coercion           | 🟡    | `+` overloaded (string wins), `-*/` force ToNumber         |
| 5   | `==`/`===`/`Object.is`        | 🟡    | `==` coerce, `===` no coerce, `Object.is` fix NaN/±0       |
| 6   | `[] == false` trace           | 🔴    | ToPrimitive → ToNumber chain: []→""→0, false→0, true       |
| 7   | `if (count)` bug              | 🔴    | ToBoolean vs null check — fix: `count != null`             |
| 8   | Boundary validation           | 🔴    | Zod schema ở boundary, explicit conversion, never implicit |

---

## ⚡ Cold Call Simulation

**Q: "Walk me through exactly what happens when JavaScript runs `[] == false`."**

**30-second answer:**

"Operator `==` dùng Abstract Equality Algorithm. Step 1: `false` là Boolean → ToNumber(false) = `0`. Bây giờ `[] == 0`. Step 2: `[]` là Object, `0` là Number → ToPrimitive(`[]`) → gọi `valueOf()` trả `[]` (không primitive) → gọi `toString()` trả `""`. Bây giờ `"" == 0`. Step 3: `""` là String, `0` là Number → ToNumber(`""`) = `0`. So sánh `0 == 0` → `true`. Nhưng `Boolean([])` dùng ToBoolean — tất cả objects truthy → `true`. Cùng value, hai spec algorithms khác nhau, kết quả có vẻ ngược nhau."

---

## Self-Check / Tự Kiểm Tra

> **Đóng tài liệu này. Trả lời từ memory.**

- **Retrieval**: Kể 8 falsy values. Phân biệt Creation Phase behavior cho var, function declaration, và let/const.
- **Visual**: Vẽ JS Runtime Architecture diagram (Call Stack, Web APIs, Microtask Queue, Macrotask Queue, Event Loop).
- **Application**: Code của bạn có `if (user.age)` nhưng `age = 0` là valid. Fix và giải thích abstract operation nào gây bug.
- **Debug**: `NaN === NaN` trả `false` — code dùng pattern này check invalid number. Dùng gì thay thế và tại sao?
- **Teach**: Giải thích cho người mới: tại sao `[] == false` là `true` nhưng `Boolean([])` cũng là `true`?

> 🎯 **Feynman Prompt:** Giải thích cho người không biết lập trình: JavaScript chỉ có 1 nhân viên (single-threaded) nhưng vẫn xử lý được nhiều việc cùng lúc (async) bằng cách nào? Và tại sao `"5" + 1 = "51"` nhưng `"5" - 1 = 4`?

🔁 **Spaced Repetition**: Review in 3 days → 7 days → 14 days

---

## Connections / Liên Kết

- ➡️ **Next**: [Variables & Types](./02-variables-types.md) — var/let/const, deep vs shallow copy
- 🔗 **Applied in**: [Scope & Hoisting](./03-scope-hoisting.md) — scope chain, TDZ chi tiết
- 🔗 **Applied in**: [this keyword](./05-this-keyword.md) — strict mode thay đổi `this` binding
- 🔗 **Applied in**: [Event Loop & Async](./07-event-loop-async.md) — microtask vs macrotask chi tiết
- 🔗 **Applied in**: [React Fundamentals](../03-react/01-react-fundamentals.md) — `Object.is` state comparison
- 🔗 **Applied in**: [TypeScript](../02-typescript/01-type-system-basics.md) — strict null checks motivated by null/undefined semantics

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Language Fundamentals](../../be-track/01-golang/01-language-fundamentals.md) — Go has similar single-threaded execution per goroutine; type coercion doesn't exist (strict static types); same value vs reference semantics concept
- 🔗 **FE — TypeScript**: [TypeScript Basics](../02-typescript/01-type-system-basics.md) — TypeScript eliminates type coercion surprises at build time; `strict` mode enforces JS best practices
- 🔗 **FE — React**: [React Fundamentals](../03-react/01-react-fundamentals.md) — `Object.is` (not `===`) is used for state change detection; understanding JS equality prevents infinite re-render bugs
- 🔗 **Shared theory**: [OS Theory](../../shared/01-cs-fundamentals/os-theory.md) — JS single-threaded model maps to single OS thread per tab; event loop is the runtime scheduler above the OS scheduler
