# Variables & Data Types / Biến & Kiểu Dữ Liệu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Basics](./01-javascript-basics.md)
> **See also**: [Scope & Hoisting](./03-scope-hoisting.md) | [Closures](./04-closures.md) | [Table of Contents](../../00-table-of-contents.md)
> **L5 Competencies**: Type System Mastery, Runtime Validation Architecture, V8 Memory Model

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn đang làm payment API. Hệ thống nhận `amount` từ request body, kiểm tra `typeof amount === 'number'` — passed. Nhưng transaction vẫn sai vì `amount = NaN` (user gửi string `"abc"` và backend convert bằng `Number("abc")`). `typeof NaN === 'number'` trả về `true` — đó là "lời nói dối" đầu tiên của `typeof`.

Bài học thứ hai: team member viết `const config = { timeout: 5000 }` rồi tưởng config bất biến. Thực tế `config.timeout = 999` vẫn hoạt động — `const` chỉ khóa **binding**, không khóa **nội dung**.

```javascript
// Bug 1: typeof NaN === 'number' → true
const amount = Number("abc"); // NaN
if (typeof amount === "number") {
  processPayment(amount); // BUG: processed with NaN!
}

// Bug 2: const ≠ immutable
const config = { timeout: 5000 };
config.timeout = 999; // No error! const only locks the binding
```

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Siêu thị và kệ hàng:**

Biến giống **kệ hàng trong siêu thị**: mỗi kệ có nhãn dán (tên biến) và chứa một món đồ (giá trị). JavaScript là siêu thị "thoải mái" — cùng một kệ hôm nay để táo (number), ngày mai để sách (string). Đây gọi là **dynamic typing**.

- `var` = kệ đặt ở hành lang chính — ai đi ngang cũng lấy được (function scope, dễ leak)
- `let` = kệ đặt trong phòng khóa — chỉ người trong phòng đó mới truy cập (block scope)
- `const` = kệ được bắt vít — bạn không thể **đổi kệ** nhưng vẫn có thể **sắp xếp lại đồ trên kệ** (binding locked, content mutable)

**Tại sao cần hiểu hệ thống kiểu?** Vì JavaScript có 8 kiểu dữ liệu nhưng `typeof` chỉ phân biệt được 7 chuỗi kết quả — và một số kết quả bị "sai" (`typeof null === 'object'`). Biết rõ từng kiểu, cách so sánh, cách V8 lưu trữ chúng → tránh bug, viết code nhanh hơn, trả lời phỏng vấn chính xác.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Variables & Data Types] ★ ← bạn đang ở đây
        │
        ├── Declaration: var (function scope) / let (block) / const (block + no reassign)
        │       └── Hoisting: var→undefined | let/const→TDZ | function→fully hoisted
        │
        ├── 7 Primitive Types (copy by VALUE, stored on Stack):
        │       number | string | boolean | null | undefined | symbol | bigint
        │
        ├── Reference Types (copy by ADDRESS, stored on Heap):
        │       object | array | function
        │
        ├── typeof Operator (8 return strings):
        │       "undefined" | "boolean" | "number" | "bigint" | "string"
        │       "symbol" | "object" | "function"
        │       ⚠️ typeof null === "object" (bug lịch sử)
        │       ⚠️ typeof NaN === "number" (NaN IS a number type)
        │
        ├── Type Checking Tools:
        │       Array.isArray() | instanceof | Number.isNaN()
        │       Object.prototype.toString.call()
        │
        └── V8 Memory:
                SMI (integer inline) | HeapNumber (float on heap)
                Element kinds: PACKED_SMI → PACKED_DOUBLE → HOLEY
```

---

## Overview / Tổng Quan

JavaScript có **7 kiểu primitive** (number, string, boolean, null, undefined, symbol, bigint) và **kiểu reference** (object, array, function). Khai báo biến bằng `var`/`let`/`const` ảnh hưởng đến scope, hoisting, và TDZ. Hệ thống kiểu là dynamic — cùng biến có thể chứa số rồi string. `typeof` là công cụ kiểm tra kiểu nhưng có nhiều "lời nói dối" cần nhớ. V8 engine lưu số nguyên nhỏ (SMI) khác với số thập phân (HeapNumber) — hiểu điều này giúp tối ưu performance trong hot loops.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. var / let / const & TDZ

> 🧠 **Memory Hook**: "**var LEAKS, let LOCKS, const LOCKS + NO REASSIGN**"

**Tại sao tồn tại?**

`var` là cách khai báo duy nhất từ 1995 — function-scoped. → **Why?** Function scope gây ra vô số bug: biến leak khỏi `if`/`for` block, hoisting trả về `undefined` thay vì lỗi. → **Why?** ES6 (2015) thêm `let`/`const` với block scope và TDZ (Temporal Dead Zone) — truy cập trước khai báo ném `ReferenceError` thay vì trả `undefined` im lặng.

#### Layer 1: Analogy

`var` giống WiFi không mật khẩu — ai trong nhà cũng kết nối được (function scope). `let`/`const` giống WiFi có mật khẩu riêng cho từng phòng (block scope).

#### Layer 2: How It Works

```
Scope & Hoisting comparison:
┌────────────────────────────────────────────────────────┐
│ function example() {                                    │
│   console.log(a); // undefined   ← var hoisted + init  │
│   console.log(b); // ReferenceError ← TDZ!             │
│                                                         │
│   if (true) {                                           │
│     var a = 1;   ← scoped to FUNCTION (leaks out)      │
│     let b = 2;   ← scoped to this BLOCK {} only        │
│     const c = 3; ← scoped to BLOCK + no reassign       │
│   }                                                     │
│                                                         │
│   console.log(a); // 1 ✓ (leaked out of if block)      │
│   console.log(b); // ReferenceError (block-scoped)      │
│ }                                                       │
│                                                         │
│ Hoisting behavior:                                      │
│   var    → hoisted + initialized as undefined           │
│   let    → hoisted but TDZ until declaration line       │
│   const  → hoisted but TDZ + must initialize immediately│
│   function → fully hoisted (callable before declaration)│
└────────────────────────────────────────────────────────┘
```

```javascript
// Classic var loop bug — mỗi iteration share cùng 1 biến i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}
// Fix: let tạo binding mới mỗi iteration
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0, 1, 2
}
```

#### Layer 3: Edge Cases

- `typeof` trong TDZ vẫn ném `ReferenceError` — khác với undeclared variable (trả về `"undefined"`)
- `const PI;` → `SyntaxError` — const PHẢI khởi tạo ngay lúc khai báo
- `const arr = []; arr.push(1);` → OK — `const` chỉ khóa binding, không khóa content

**❌ Common Mistakes:**

| Sai lầm                    | Tại sao sai                                            | Đúng là                                                                   |
| -------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| "const = immutable"        | `const` chỉ khóa binding, object bên trong vẫn mutable | `const obj = {}; obj.x = 1;` → OK. Cần `Object.freeze()` cho immutability |
| Dùng `var` trong code mới  | Function scope + hoist → bug khó trace                 | Mặc định `const`, chỉ `let` khi cần reassign                              |
| "let/const không bị hoist" | Chúng bị hoist nhưng vào TDZ                           | TDZ = tồn tại nhưng access → ReferenceError                               |

**🎯 Interview Pattern:**

- **Trigger**: "var vs let vs const", "hoisting", "TDZ"
- **Concept**: scope type + hoisting behavior + TDZ
- **Opening**: _"Ba từ khóa khác nhau về scope và hoisting: `var` là function-scoped và hoisted với `undefined`; `let`/`const` là block-scoped và trong TDZ cho đến declaration — TDZ giúp bắt bug đọc biến trước khởi tạo."_

**🔑 Knowledge Chain:**

- 📚 Prereq: Không cần — đây là điểm bắt đầu
- ➡️ Enables: [Scope & Hoisting](./03-scope-hoisting.md), [Closures](./04-closures.md) — var loop closure bug

---

### 2. 7 Primitive Types & Reference Types (Stack vs Heap)

> 🧠 **Memory Hook**: "**Primitives live on the Stack, Objects live on the Heap. Copy primitive = photocopy. Copy object = share address.**"

**Tại sao tồn tại?**

JS cần phân biệt "dữ liệu nhỏ, copy rẻ" (number, string, boolean...) với "dữ liệu lớn, copy đắt" (object, array). → **Why?** Copy number O(1) rẻ; copy object 1000 properties O(n) đắt. → **Why?** Giải pháp: primitive copy by value (mỗi biến có bản sao riêng); object copy by reference (chỉ copy địa chỉ bộ nhớ — cùng trỏ tới 1 object trên heap).

#### Layer 1: Analogy

Primitive như **tờ tiền mặt** — photocopy thì mỗi người giữ tờ riêng, sửa tờ A không ảnh hưởng tờ B. Object như **tài khoản ngân hàng** — bạn chỉ truyền **số tài khoản** (reference), ai có số tài khoản đều thao tác được trên cùng 1 số dư.

#### Layer 2: How It Works

```
7 Primitive Types (immutable, copy by VALUE):
  number | string | boolean | null | undefined | symbol | bigint

Reference Types (mutable, copy by ADDRESS):
  object | array | function | Date | RegExp | Map | Set | ...

Memory Model:
┌──────────────────┐   ┌──────────────────────────┐
│     STACK         │   │          HEAP            │
│                   │   │                          │
│  x = 5           │   │  { name: 'Alice' }  ◄──┐│
│  y = 5 (copy)    │   │                        ││
│  a = ref ────────┼───┼───────────────────────►┘│
│  b = a  ─────────┼───┼───────────────────────► │ ← same object!
└──────────────────┘   └──────────────────────────┘

let x = 5; let y = x;       // y is independent copy
y = 10; console.log(x);     // 5 — unchanged

const a = { name: 'Alice' };
const b = a;                 // b points to SAME object
b.name = 'Bob';
console.log(a.name);         // 'Bob' — shared reference!
```

#### Layer 3: Edge Cases

- `typeof null === 'object'` — bug lịch sử từ 1995, null IS a primitive
- `{} === {}` → `false` — hai object khác nhau trên heap, khác địa chỉ
- String primitive immutable: `str[0] = 'X'` im lặng thất bại
- `typeof function(){} === 'function'` — exception đặc biệt, function là object nhưng có typeof riêng

**❌ Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                 | Đúng là                                                 |
| ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| `typeof null === 'object'` → null là object | null là primitive — bug 30 năm tuổi                         | Check null bằng `value === null`                        |
| `{} === {}` → true                          | Object so sánh bằng reference (địa chỉ), không phải content | Hai object tạo riêng luôn `false`                       |
| Tưởng string mutable                        | String primitive bất biến                                   | `"hello"[0] = 'H'` im lặng thất bại — dùng `.replace()` |

**🎯 Interview Pattern:**

- **Trigger**: "primitive vs reference", "pass by value/reference", "why `{} === {}` is false"
- **Concept**: stack (value copy) vs heap (address sharing)
- **Opening**: _"JS có 7 primitive types copy by value trên stack, và reference types copy by address trên heap. `{} === {}` false vì `===` so sánh địa chỉ bộ nhớ, không so sánh nội dung."_

**🔑 Knowledge Chain:**

- 📚 Prereq: var/let/const (concept 1)
- ➡️ Enables: [Prototypes & Inheritance](./06-prototypes-inheritance.md) — object delegation; React state immutability pattern

---

### 3. Type Coercion & Falsy Values

> 🧠 **Memory Hook**: "**`+` tham lam string — ai là string thì tất cả thành string. `-` tham lam number — ép tất cả thành số.**"

**Tại sao tồn tại?**

JavaScript thiết kế trong 10 ngày cho web developer không chuyên — coercion tự động giúp `"5" * 2 = 10` mà không cần ép kiểu thủ công. → **Why?** Nhưng `"5" + 2 = "52"` vì `+` ưu tiên string concatenation. → **Why?** Hai quy tắc ngầm khác nhau cho cùng toán tử → nguồn gốc vô số bug.

#### Layer 1: Analogy

Coercion giống **phục vụ bàn cố đoán order**. Bạn nói "5 cộng 2", nếu bàn bên cạnh ai đó đang nói chuyện (string context), phục vụ hiểu "nối chuỗi" → `"52"`. Nếu đang ở context tính toán, phục vụ hiểu "cộng số" → `7`. `===` là order bằng giấy viết rõ ràng — không đoán.

#### Layer 2: How It Works

```
Operator Coercion Rules:
┌─────────────────────────────────────────────────┐
│  "+" operator:                                   │
│    If EITHER operand is string → concat          │
│    Otherwise → numeric addition                  │
│                                                  │
│  "-", "*", "/", "%" operators:                   │
│    ALWAYS convert to number first                │
│                                                  │
│  8 Falsy values (coerce to false):               │
│    false | 0 | -0 | 0n | "" | null | undefined  │
│    | NaN                                         │
│  Everything else → truthy (including "0", [], {})│
│                                                  │
│  == (loose equality) → coerces then compares     │
│  === (strict) → NO coercion                      │
│  Object.is → like === but NaN===NaN, +0≠-0      │
└─────────────────────────────────────────────────┘
```

```javascript
"5" + 1     // "51" — string wins with +
"5" - 1     // 4    — minus forces number
true + true // 2    — boolean → 1 + 1
[] + []     // ""   — [].toString() + [].toString()
null == undefined  // true  — special case
null == 0          // false — null only == null/undefined
NaN === NaN        // false — NaN never equals anything
```

#### Layer 3: Edge Cases

- `"0"` là truthy (string có nội dung), nhưng `0` là falsy
- `[] == false` → `true` (cả hai coerce về 0)
- `||` vs `??`: `||` trả default cho mọi falsy (kể cả `0`, `""`); `??` chỉ cho `null`/`undefined`

**❌ Common Mistakes:**

| Sai lầm                            | Tại sao sai                                        | Đúng là                                                       |
| ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Dùng `==` thay `===`               | `==` coerce → `"1" == 1` true, dễ bug              | Luôn `===`, chỉ `== null` khi cần check cả null lẫn undefined |
| `if (value)` để check "có giá trị" | `""`, `0`, `NaN` đều falsy — reject giá trị hợp lệ | Dùng `value !== null && value !== undefined` hoặc `??`        |
| `\|\|` để set default value        | `score \|\| 100` khi score=0 → trả 100 (sai)       | Dùng `??`: `score ?? 100` — chỉ replace null/undefined        |

**🎯 Interview Pattern:**

- **Trigger**: "== vs ===", "falsy values", "type coercion gotchas"
- **Concept**: `+` ưu tiên string; `-`/`*`/`/` ép số; `===` không coerce
- **Opening**: _"JS có implicit coercion qua toán tử và explicit qua `Number()`/`String()`. Dùng `===` luôn, trừ `== null` để check null+undefined cùng lúc. `??` thay `||` cho default values vì `||` sai với 0 và empty string."_

**🔑 Knowledge Chain:**

- 📚 Prereq: Primitive types (concept 2)
- ➡️ Enables: [TypeScript](../02-typescript/) — ngăn coercion bug ở compile time

---

### 4. typeof Operator — Những "Lời Nói Dối"

> 🧠 **Memory Hook**: "**typeof trả spec type tag, không phải trực giác. null → 'object' (bug). NaN → 'number' (đúng spec). function → 'function' (exception).**"

**Tại sao tồn tại?**

`typeof` kiểm tra type tag ở mức spec — nhưng có 3 kết quả "gây sốc":

→ **Why typeof null === 'object'?** Năm 1995, JS dùng 32-bit words: 3 bit thấp nhất là type tag. Object tag = `000`. null = null pointer = `0x00000000` → 3 bit thấp cũng là `000` → trùng Object tag. Bug 30 năm không thể sửa vì phá vỡ web.

→ **Why typeof NaN === 'number'?** NaN là giá trị IEEE 754 đặc biệt trong Number space — kết quả của phép tính số thất bại, không phải kiểu khác.

→ **Why typeof function === 'function'?** Function là object nhưng có slot `[[Call]]` — spec thêm exception cho callable objects.

#### Layer 1: Analogy

`typeof` giống hệ thống ID ở sân bay: nó cho biết **loại giấy tờ** ("passport" vs "driver's license"), không cho biết nội dung có hợp lệ không. `typeof null === 'object'` giống passport hết hạn — loại giấy tờ đúng nhưng không usable.

#### Layer 2: How It Works

```
typeof return values (8 possible strings):
┌──────────────────────────────────────────────────────┐
│ typeof undefined    → "undefined"                     │
│ typeof true         → "boolean"                       │
│ typeof 42           → "number"                        │
│ typeof "hello"      → "string"                        │
│ typeof Symbol()     → "symbol"                        │
│ typeof 42n          → "bigint"                        │
│ typeof {}           → "object"                        │
│ typeof []           → "object"    ← array IS object   │
│ typeof null         → "object"    ← BUG: null ≠ object│
│ typeof NaN          → "number"    ← NaN IS number type│
│ typeof function(){} → "function"  ← exception: callable│
└──────────────────────────────────────────────────────┘

// Safe patterns:
value === null                                  // check null
value !== null && typeof value === 'object'     // check real object
typeof value === 'number' && !Number.isNaN(value) && isFinite(value)  // valid number
```

#### Layer 3: Edge Cases

- `typeof undeclaredVar` → `"undefined"` (không lỗi) — nhưng `typeof letVarInTDZ` → ReferenceError
- `typeof` không phân biệt được Date, RegExp, Array, Map — tất cả trả `'object'`

**❌ Common Mistakes:**

| Sai lầm                                   | Tại sao sai                      | Đúng là                                       |
| ----------------------------------------- | -------------------------------- | --------------------------------------------- |
| `typeof val === 'object'` để check object | null pass qua check này          | Thêm `val !== null &&` trước                  |
| `typeof val === 'number'` để validate số  | NaN và Infinity pass qua         | Thêm `&& !Number.isNaN(val) && isFinite(val)` |
| `typeof [] === 'array'`                   | typeof không trả "array" bao giờ | Dùng `Array.isArray()`                        |

**🎯 Interview Pattern:**

- **Trigger**: "typeof null", "type checking in production"
- **Concept**: typeof type tags + null bug + NaN trap
- **Opening**: _"typeof kiểm tra spec-level type tag. Bug nổi tiếng: `typeof null === 'object'` từ 1995 do 32-bit tag bits trùng. Cho reliable type checks, tôi dùng `Array.isArray`, `Number.isNaN`, và `Object.prototype.toString.call` tùy mục đích."_

**🔑 Knowledge Chain:**

- 📚 Prereq: 7 primitive types (concept 2)
- ➡️ Enables: TypeScript type guards, runtime validation (Zod), debugging null reference errors

---

### 5. Type Checking Tools — Beyond typeof

> 🧠 **Memory Hook**: "**typeof → type family. instanceof → prototype chain. Array.isArray → internal slot. Number.isNaN → no coercion. Mỗi tool cho 1 việc.**"

**Tại sao tồn tại?**

`typeof` chỉ phân biệt 8 type families — không phân biệt được null vs object, array vs object, Date vs RegExp. → **Why?** Cần các tool chuyên biệt hơn. → **Why?** Mỗi tool có cơ chế và giới hạn riêng:

- `instanceof` duyệt prototype chain → thất bại cross-iframe
- `Array.isArray` đọc internal `[[IsArray]]` slot → hoạt động cross-realm
- `Number.isNaN` không coerce → khác global `isNaN`

#### Layer 1: Analogy

`typeof` giống hỏi "bạn là người hay động vật?" — phân loại thô. `instanceof` giống hỏi "bạn có trong gia phả nhà này không?" — kiểm tra dòng dõi. `Array.isArray` giống đọc **chứng minh thư gốc** — không phụ thuộc gia phả.

#### Layer 2: How It Works

```
Type Checking Decision Tree:
┌─────────────────────────────────────────────────────┐
│ What do you need to check?                           │
│                                                      │
│ ├─ Specific primitive? → typeof                      │
│ │    typeof x === 'string'                           │
│ │                                                    │
│ ├─ Is it an array? → Array.isArray(x)                │
│ │    ⚠️ NEVER instanceof Array (fails cross-iframe)  │
│ │                                                    │
│ ├─ Class instance? → x instanceof ClassName          │
│ │    ⚠️ Fails across iframes/workers                 │
│ │                                                    │
│ ├─ Built-in type tag? → Object.prototype.toString    │
│ │    '[object Array]', '[object Date]', '[object Null]'│
│ │                                                    │
│ └─ Valid number (not NaN/Infinity)?                   │
│      typeof x === 'number' && Number.isFinite(x)     │
│      ⚠️ Number.isNaN ≠ global isNaN (no coercion)   │
└─────────────────────────────────────────────────────┘
```

```javascript
// isNaN vs Number.isNaN — coercion trap
isNaN("hello"); // true — coerces "hello" → NaN first!
Number.isNaN("hello"); // false — no coercion, only true for actual NaN
Number.isNaN(NaN); // true

// instanceof fails cross-iframe
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
const iframeArr = new iframe.contentWindow.Array(1, 2, 3);
iframeArr instanceof Array; // false! Different Array constructor
Array.isArray(iframeArr); // true — [[IsArray]] slot

// Object.prototype.toString — reliable built-in tag
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(new Date()); // "[object Date]"
```

#### Layer 3: Edge Cases

- `Symbol.hasInstance` cho phép override `instanceof`: `class Even { static [Symbol.hasInstance](n) { return n % 2 === 0; } }` → `4 instanceof Even` === true
- `NodeList` và `arguments` là array-like nhưng `Array.isArray` → false

**❌ Common Mistakes:**

| Sai lầm                            | Tại sao sai                                | Đúng là                                         |
| ---------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `isNaN("hello")` để check NaN      | Global isNaN coerce trước → false positive | `Number.isNaN(value)` — chỉ true cho actual NaN |
| `arr instanceof Array` cross-frame | Mỗi frame có Array constructor riêng       | `Array.isArray(arr)` — đọc internal slot        |
| `value.constructor === Object`     | Constructor có thể bị reassign hoặc absent | `Object.prototype.toString.call(value)`         |

**🎯 Interview Pattern:**

- **Trigger**: "how to check if array", "Number.isNaN vs isNaN", "type checking production"
- **Concept**: mỗi tool có cơ chế khác → đúng tool cho đúng việc
- **Opening**: _"Tôi dùng tool khác cho mỗi mục đích: typeof cho primitives, Array.isArray cho arrays (cross-realm safe), instanceof cho class instances cùng realm, Number.isNaN thay global isNaN để tránh coercion trap."_

**🔑 Knowledge Chain:**

- 📚 Prereq: typeof (concept 4), prototype chain
- ➡️ Enables: TypeScript type guards, Zod/Yup runtime validation, defensive programming

---

### 6. V8 Memory Representation — SMI & HeapNumber

> 🧠 **Memory Hook**: "**SMI = Small Integer INLINE (free). HeapNumber = Float on HEAP (allocation cost). Mixing types in array = backing store reallocation (slow).**"

**Tại sao tồn tại?**

V8 cần tối ưu phép tính số nguyên — cực kỳ phổ biến trong loops. → **Why?** Allocate heap object cho mỗi `i++` quá chậm. → **Why?** V8 lưu integers ≤ 2^30-1 inline trong pointer (SMI — zero allocation). Float phải lên heap (HeapNumber). Mixing float vào integer array trigger element kind transition → backing store reallocated → chậm.

#### Layer 1: Analogy

SMI giống **tiền mặt trong túi** — lấy ra dùng ngay, không tốn phí. HeapNumber giống **tiền trong tài khoản ngân hàng** — mỗi lần dùng phải rút (heap allocation). Array element kinds giống **loại container chuyên dụng**: container chuyên hàng đông lạnh (SMI) → bạn bỏ vào hàng thường (float) → phải đổi sang container tổng hợp (PACKED_DOUBLE) → chậm hơn.

#### Layer 2: How It Works

```
V8 Tagged Pointer (64-bit):
  bit 0 = 0 → SMI: value in upper bits, NO heap allocation
  bit 0 = 1 → Pointer: points to heap object

SMI:        let x = 42     → [0x2A << 1 | 0] ← lives on stack, free
HeapNumber: let x = 42.5   → [pointer → HeapNumber{42.5}] ← heap allocation

Array Element Kinds (transitions are ONE-WAY → SLOW):
  PACKED_SMI_ELEMENTS    [1, 2, 3]           ← fastest
        ↓ add float
  PACKED_DOUBLE_ELEMENTS [1, 2, 3.14]        ← backing store reallocated
        ↓ add non-number
  PACKED_ELEMENTS        [1, 2, 'hello', 4]  ← boxing overhead
        ↓ create holes
  HOLEY_ELEMENTS         [1, , , 4]          ← slowest, prototype chain checks

  ⚠️ Transitions cannot go BACKWARD!
  Once degraded, array STAYS at that element kind.
```

#### Layer 3: Edge Cases

- `42` và `42.0` có internal representation khác nhau — `42` là SMI, `42.0` khi engine không optimize thành SMI thì là HeapNumber
- `arr.length = 0` không reset element kind — `arr = []` tạo array mới sạch
- Premature optimization warning: chỉ matter trong hot loops (>10k iterations) — profile first

**❌ Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                           | Đúng là                                      |
| ------------------------------------------ | ----------------------------------------------------- | -------------------------------------------- |
| Trộn integer và float trong array hot loop | PACKED_SMI → PACKED_DOUBLE, backing store reallocated | Giữ array types homogeneous                  |
| `arr.length = 0` để clear large array      | Giữ backing store cũ với element kind transitions     | `arr = []` tạo array sạch                    |
| Micro-optimize mọi thứ                     | Element kind chỉ matter trong hot loops               | Profile first — 90% perf gains từ thuật toán |

**🎯 Interview Pattern:**

- **Trigger**: "JavaScript performance", "V8 internals", "why is this loop slow"
- **Concept**: SMI/HeapNumber + element kind transitions
- **Opening**: _"V8 lưu integers ≤ 2^30 inline trong pointer (SMI, zero allocation), floats lên heap (HeapNumber). Arrays có element kinds — mixing types force backing store reallocation. Trong hot loops, giữ array homogeneous là optimization có ý nghĩa."_

**🔑 Knowledge Chain:**

- 📚 Prereq: Heap/stack memory model (concept 2)
- ➡️ Enables: [Engine Internals](./17-engine-internals.md), V8 hidden classes, performance profiling

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### 🟢 Q1. var vs let vs const — khi nào dùng gì?

**Answer (EN):** Default to `const` — it signals the binding never changes. Use `let` only when reassignment is needed (counters, accumulators). Never use `var` in new code. The key contrast: `var` is function-scoped and hoisted with `undefined`; `let`/`const` are block-scoped with TDZ. Edge case: `const arr = []` still allows `push` — const locks binding, not content.

**Giải thích (VI):** Mặc định `const` — cho người đọc biết biến này không bị gán lại. `let` khi cần reassign (counter, accumulator). Không dùng `var` trong code mới. Phân biệt: `var` function-scoped + hoist thành `undefined`; `let`/`const` block-scoped + TDZ. Edge case: `const obj = {}; obj.x = 1;` hợp lệ — const chỉ khóa binding.

```javascript
const MAX = 3; // never reassigned — const
let count = 0; // will increment — let
while (count < MAX) {
  count++;
}

const items = [];
items.push("new"); // OK — mutating content, not rebinding
// items = [];          // TypeError — rebinding const
```

**💡 Interview Signal:**

- ✅ Phân biệt binding lock vs content immutability, nêu var loop bug, connect tới React immutable state
- ❌ "const không thay đổi được" — sẽ bị probe ngay về mutation

---

### 🟢 Q2. Kể tên 7 primitive types và giải thích typeof null

**Answer (EN):** 7 primitives: number, string, boolean, null, undefined, symbol, bigint. `typeof null === 'object'` is a 30-year-old bug from 1995 — JS stored values as 32-bit words, null pointer (all zeros) collided with Object type tag (`000`). Can't fix because billions of `typeof x === 'object' && x !== null` patterns would break.

**Giải thích (VI):** 7 kiểu primitive: number, string, boolean, null, undefined, symbol, bigint. `typeof null === 'object'` là bug lịch sử: null pointer `0x00000000` trùng Object tag `000` trong hệ thống 32-bit. Check null đúng: `value === null`. Check object đúng: `value !== null && typeof value === 'object'`.

```javascript
// All 7 primitives
[42, "text", true, null, undefined, Symbol("s"), 9007199254740993n].forEach((v) =>
  console.log(typeof v),
);
// "number", "string", "boolean", "object"(bug!), "undefined", "symbol", "bigint"

// Safe null and object checks
const isNull = value === null;
const isRealObject = value !== null && typeof value === "object";
```

**💡 Interview Signal:**

- ✅ Kể đủ 7 (đặc biệt symbol + bigint), giải thích 32-bit tag origin, nêu safe check pattern
- ❌ Quên symbol/bigint, hoặc "typeof null là object vì null là object"

---

### 🟡 Q3. const object vẫn mutable — giải thích và cách fix?

**Answer (EN):** `const` prevents re-binding — you can't point the variable at a different object. But the object at that address is freely mutable. `Object.freeze()` makes it shallow-immutable. For deep immutability: recursive freeze or Immer. In React: `setState` needs new references — `const` alone doesn't help.

**Giải thích (VI):** `const` chỉ khóa tham chiếu — biến không thể trỏ sang object khác. Object được trỏ tới vẫn thoải mái sửa properties. `Object.freeze()` đóng băng 1 lớp ngoài (shallow). Muốn deep freeze: recursive hoặc dùng Immer. Trong React: cần tạo object mới mỗi lần update state.

```javascript
const user = { name: "Alice", address: { city: "HCM" } };
user.name = "Bob"; // OK — mutating property
// user = {};                   // TypeError — rebinding const

Object.freeze(user);
user.name = "Charlie"; // silently fails (strict: TypeError)
user.address.city = "DN"; // STILL WORKS — freeze is shallow!

// Deep immutability with Immer
import { produce } from "immer";
const updated = produce(user, (draft) => {
  draft.address.city = "HN";
});
```

**💡 Interview Signal:**

- ✅ Phân biệt binding lock vs content, biết freeze is shallow, connect tới React state pattern
- ❌ "const không thay đổi được" hoặc không biết shallow freeze limitation

---

### 🟡 Q4. isNaN() vs Number.isNaN() — khác nhau thế nào?

**Answer (EN):** Global `isNaN(value)` coerces the argument to number first via ToNumber, then checks. So `isNaN("hello") === true` because `ToNumber("hello") === NaN`. `Number.isNaN(value)` does NO coercion — returns true only if value is already type Number AND is NaN. Always use `Number.isNaN` in production.

**Giải thích (VI):** `isNaN()` ép kiểu trước rồi mới check — `isNaN("hello")` trả `true` vì `Number("hello")` là NaN. `Number.isNaN()` không coerce — chỉ `true` cho actual NaN value. Tương tự: `isFinite` vs `Number.isFinite`. Trong production luôn dùng phiên bản trên `Number`.

```javascript
isNaN("hello"); // true — coerces "hello" → NaN → true (false positive!)
Number.isNaN("hello"); // false — no coercion
Number.isNaN(NaN); // true — only true for actual NaN

// Same distinction for isFinite
isFinite("42"); // true — coerces string to number
Number.isFinite("42"); // false — string is not a number
```

**💡 Interview Signal:**

- ✅ Giải thích ToNumber coercion trong global isNaN, recommend Number.isNaN
- ❌ "Number.isNaN mới và tốt hơn" — đúng nhưng không giải thích cơ chế coercion

---

### 🟡 Q5. Array.isArray vs instanceof Array — khi nào instanceof thất bại?

**Answer (EN):** Each browsing context (iframe, worker) has its own `Array` constructor. `iframe_array instanceof Array` returns `false` in parent because prototype chains point to different `Array.prototype` objects. `Array.isArray()` reads the internal `[[IsArray]]` slot — works across all realms. For general type introspection: `Object.prototype.toString.call(value)`.

**Giải thích (VI):** Mỗi iframe có bộ constructor riêng — `Array` trong iframe khác `Array` trong parent. `instanceof` kiểm tra prototype chain → thất bại cross-frame. `Array.isArray` đọc internal `[[IsArray]]` slot → reliable mọi nơi. Cũng áp dụng cho `instanceof Promise`, `instanceof Map` cross-realm.

```javascript
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
const arr = new iframe.contentWindow.Array(1, 2, 3);

arr instanceof Array; // false! Different Array.prototype
Array.isArray(arr); // true — [[IsArray]] slot

// General reliable type check
Object.prototype.toString.call(arr); // "[object Array]"
```

**💡 Interview Signal:**

- ✅ Nêu cross-realm failure mode, giải thích [[IsArray]] slot, mention toString.call
- ❌ "Dùng Array.isArray" mà không giải thích tại sao instanceof không đủ

---

### 🔴 Q6. structuredClone vs JSON deep clone — trade-offs?

**Answer (EN):** `structuredClone()` handles circular references, Date, Map, Set, ArrayBuffer, typed arrays — far more than JSON round-trip. JSON drops `undefined`, functions, Symbols; converts Date to string; converts NaN/Infinity to null; throws on circular references. `structuredClone` cannot clone functions, DOM nodes, or class instances with custom prototypes.

**Giải thích (VI):** `structuredClone()` xử lý circular ref, Date, Map, Set, ArrayBuffer. `JSON.parse(JSON.stringify())` đơn giản hơn nhưng: bỏ undefined/function/Symbol, Date→string, NaN/Infinity→null, crash khi circular. `structuredClone` không clone được function hay DOM node. Immer dùng Proxy cho structural sharing — tối ưu hơn cho state updates.

```javascript
// JSON losses:
const data = { fn: () => {}, date: new Date(), undef: undefined, nan: NaN };
const jsonClone = JSON.parse(JSON.stringify(data));
// fn: dropped, date: string, undef: key dropped, nan: null

// structuredClone handles complex types:
const obj = { date: new Date(), map: new Map([["k", "v"]]), nested: { x: 1 } };
const clone = structuredClone(obj);
clone.nested.x = 99;
obj.nested.x; // 1 — fully independent

// structuredClone limitation:
// structuredClone({ fn: () => {} }); // DataCloneError
```

**💡 Interview Signal:**

- ✅ Liệt kê systematic losses của JSON (fn/Date/undefined/NaN/circular), biết structuredClone limitations
- ❌ "JSON clone là đủ" hoặc không biết structuredClone tồn tại

**🔗 Follow-up Chain:**

1. "structuredClone dùng algorithm gì internally?" → HTML structured clone algorithm, same as postMessage/IndexedDB
2. "Khi nào nên dùng Immer thay structuredClone?" → Nested state updates — Immer dùng Proxy cho structural sharing (CoW), chỉ copy changed path
3. "Structural sharing hoạt động thế nào?" → Copy from changed node to root; siblings stay shared; O(depth) vs O(total nodes)

---

### 🔴 Q7. NaN và Infinity phá business logic thế nào?

**Answer (EN):** NaN propagates silently: `NaN + 5 = NaN`, `NaN > 0 = false`. Infinity from `1/0` passes `> threshold` checks incorrectly. Both are valid `typeof 'number'`. Guard: `Number.isFinite(value)` rejects both NaN and Infinity in one check. For currency: work in integer cents to avoid floating-point issues.

**Giải thích (VI):** NaN lan tỏa: mọi phép tính với NaN trả NaN — nhưng không throw, im lặng cho tới khi hiện `NaN VND` trên UI. `Infinity` từ `1/0` pass so sánh `> 1000` → logic sai. Cả hai đều `typeof 'number'` → typeof không bắt được. Dùng `Number.isFinite()` reject cả NaN lẫn Infinity. Currency: tính bằng cents (integer).

```javascript
// NaN propagation — silent until UI
const price = Number("abc"); // NaN
const tax = price * 0.1; // NaN
const total = price + tax; // NaN
console.log(`Total: ${total} VND`); // "Total: NaN VND" — bug on UI

// Infinity from division
const avg = 100 / 0; // Infinity
console.log(avg > 1000); // true — logically wrong!

// Guard: Number.isFinite rejects both
function safeDivide(a, b) {
  const result = a / b;
  if (!Number.isFinite(result)) throw new Error(`Invalid: ${a}/${b}`);
  return result;
}
```

**💡 Interview Signal:**

- ✅ Trace NaN propagation path, biết Number.isFinite guard, mention integer cents for currency
- ❌ "Check NaN bằng === NaN" (NaN !== NaN luôn true)

**🔗 Follow-up Chain:**

1. "Tại sao NaN !== NaN?" → IEEE 754 spec: NaN represents invalid result, comparing invalids is always false
2. "React state chứa NaN thì sao?" → `Object.is(NaN, NaN)` là true → React thấy "same" → không re-render → UI stuck
3. "Production monitoring cho numeric bugs?" → Sentry breadcrumbs, custom guard at API boundary, Zod schema validation

---

### 🔴 Q8. Design safe API boundary validation cho unknown data

**Answer (EN):** Never trust external data types. Validate at the boundary with a schema library (Zod). Define expected schema → parse once → downstream has typed guarantees. Manual conversion (`Number(val)`) converts but doesn't validate range/shape. `Number(undefined)` = NaN, `Number(null)` = 0 — both silently wrong. Normalize nullish values with `??` not `||`.

**Giải thích (VI):** Không bao giờ tin kiểu dữ liệu từ API — validate tại biên. Zod: define schema → parse 1 lần → code phía sau có type guarantee. Manual conversion không validate range hay structure. `||` sai với 0 và `""` — dùng `??`. Normalize: chọn 1 convention (`null` cho optional) và tuân theo toàn project.

```javascript
// Unsafe: silent coercion
function processOrder(order) {
  const total = order.price * order.qty; // "10" * 2 = 20 (lucky)
  const discount = Number(order.discount); // undefined → NaN
  return total - discount; // 20 - NaN = NaN — bug!
}

// Safe: Zod at boundary
import { z } from "zod";
const OrderSchema = z.object({
  price: z.number().positive(),
  qty: z.number().int().positive(),
  discount: z.number().min(0).default(0),
});
function processOrderSafe(raw) {
  const order = OrderSchema.parse(raw); // throws with clear message if invalid
  return order.price * order.qty - order.discount;
}

// Normalize nullish: ?? not ||
const score = apiResponse.score ?? 0; // 0 stays 0
const label = apiResponse.label ?? "N/A"; // "" stays ""
```

**💡 Interview Signal:**

- ✅ Nêu boundary validation pattern, Zod schema, ?? vs || distinction
- ❌ "Dùng Number() để convert" — convert nhưng không validate

**🔗 Follow-up Chain:**

1. "Zod vs io-ts vs class-validator?" → Zod: zero deps, TypeScript-first, z.infer for types; io-ts: fp-ts ecosystem; class-validator: decorator-based
2. "Validation ở client vs server?" → Validate ở CẢ HAI — client cho UX, server cho security. Never trust client-only validation
3. "Performance impact của schema validation?" → Negligible ở boundary (1x per request). Hot path inside business logic: pre-validated, no re-validation needed

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Shopee — Shallow Copy Mutation Broke Cart State

**Situation:** Shopee's cart feature used a shared `cartItems` array in a global state object. A "remove item" function did `cart.items.splice(index, 1)` directly on the state object. Components displayed stale counts because React/Redux never detected the change — the array reference hadn't changed, only its contents.

**What went wrong:**
```javascript
// Redux reducer — mutation bug:
case REMOVE_ITEM:
  state.cart.items.splice(action.index, 1); // ❌ mutates in-place
  return state; // same reference → React.memo sees no change → no re-render

// Fix:
case REMOVE_ITEM:
  return {
    ...state,
    cart: {
      ...state.cart,
      items: state.cart.items.filter((_, i) => i !== action.index) // ✅ new array
    }
  };
```

**Decision made:** Added an Immer.js integration (`produce()`) to all reducers to make mutation safe-by-default. Also added a Redux middleware that deep-compares old/new state in development to detect accidental mutations.

**Trade-off accepted:** Immer adds ~14KB to bundle and has a small performance overhead. Accepted because the developer experience improvement (write mutation-style code, get immutable output) reduced reducer bugs to near zero.

**Lesson:** Reference equality is the invisible rule of React/Redux. Every developer must internalize that `state.arr.push(x)` and `return state` is silently broken — not just "bad practice."

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                       | Level | One-liner                                                            |
| --- | --------------------------- | ----- | -------------------------------------------------------------------- | --- | ---------------------------------- |
| 1   | var vs let vs const         | 🟢    | const default, let khi reassign, var never — scope + TDZ             |
| 2   | 7 primitives + typeof null  | 🟢    | 7 types, typeof null = 'object' (32-bit tag bug 1995)                |
| 3   | const object mutable        | 🟡    | const locks binding not content; Object.freeze shallow               |
| 4   | isNaN vs Number.isNaN       | 🟡    | Global isNaN coerces; Number.isNaN doesn't — always use Number.isNaN |
| 5   | Array.isArray vs instanceof | 🟡    | instanceof fails cross-iframe; isArray reads [[IsArray]] slot        |
| 6   | structuredClone vs JSON     | 🔴    | JSON drops fn/Date/undefined; structuredClone handles complex types  |
| 7   | NaN/Infinity propagation    | 🔴    | Number.isFinite guards both; NaN propagates silently                 |
| 8   | API boundary validation     | 🔴    | Zod at boundary; ?? not                                              |     | ; validate + convert at trust edge |

---

## ⚡ Cold Call Simulation

**Q: "What is the difference between `null` and `undefined` in JavaScript?"**

**30-second answer:**

"Both represent 'no value' but signal different intent. `undefined` means a variable was declared but never assigned — JavaScript sets it automatically (uninitialized vars, missing function args, non-existent properties). `null` means the developer _explicitly_ chose 'nothing here'. In API design, I use `null` for 'field exists but empty' and `undefined` for 'field not in response'. The gotcha: `typeof null === 'object'` — 1995 bug from 32-bit type tags. Safe check: `value === null` or `value == null` to catch both. For default values: `??` not `||` because `||` treats `0` and `""` as missing."

---

## Self-Check / Tự Kiểm Tra

> **Đóng tài liệu. Trả lời từ trí nhớ.**

- **Retrieval**: Viết ra 7 primitive types. Bạn nhớ symbol và bigint không?
- **Visual**: Vẽ stack/heap: `let x = 5; let obj = {a:1}; let y = x; let ref = obj;` — gì trên stack, gì trên heap, arrow nào share?
- **Application**: `const config = { timeout: 5000 }; config.timeout = 10000;` — lỗi không? Tại sao? Làm sao immutable thực sự?
- **Debug**: Code hiện `NaN VND` trên UI. Trace: input đến từ đâu → bị coerce sai ở bước nào → fix?
- **Teach**: Giải thích cho non-JS engineer: tại sao `"5" + 1 = "51"` nhưng `"5" - 1 = 4`?

> 🎯 **Feynman Prompt:** Giải thích cho designer: tại sao hai object `{}` và `{}` không bằng nhau — dùng liên tưởng "địa chỉ nhà", không dùng từ "reference", "heap", hay "memory address".

🔁 **Spaced Repetition**: Review in 3 days → 7 days → 14 days

---

## Connections / Liên Kết

- ⬅️ **Built on**: [JavaScript Basics](./01-javascript-basics.md) — runtime model, equality algorithms
- ➡️ **Enables**: [Scope & Hoisting](./03-scope-hoisting.md) — var/let/const behavior depends on scope rules
- ➡️ **Enables**: [Closures](./04-closures.md) — closures capture variable bindings
- 🔗 **Applied in**: TypeScript type system, React state immutability, Zod runtime validation
- 🔗 **Applied in**: [Engine Internals](./17-engine-internals.md) — V8 SMI/HeapNumber connects to hidden classes and GC

[← Previous: JavaScript Basics](./01-javascript-basics.md) | [Next: Scope & Hoisting →](./03-scope-hoisting.md) | [Back to Table of Contents](../../00-table-of-contents.md)

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Language Fundamentals](../../be-track/01-golang/01-language-fundamentals.md) — Go's static typing catches type errors at compile time vs JS runtime; Go `var` vs `:=` vs `const` mirrors JS `var`/`let`/`const` semantics
- 🔗 **FE — TypeScript**: [TypeScript Basics](../02-typescript/01-type-system-basics.md) — TypeScript adds static types on top of JS dynamic types; understanding JS types makes TS type errors interpretable
- 🔗 **FE — React**: [React Fundamentals](../03-react/01-react-fundamentals.md) — immutability (no mutation of state) is why shallow copy `{...state}` is required in React state updates
- 🔗 **Shared theory**: [CS Data Structures](../../shared/01-cs-fundamentals/data-structures-theory.md) — primitive vs reference types map to value types (stack) vs pointer types (heap) in CS theory
