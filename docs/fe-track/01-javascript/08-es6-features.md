# ES6+ Features / Tính Năng ES6+

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./03-scope-hoisting.md) (let/const), [this Keyword](./05-this-keyword.md) (arrow functions)
> **See also**: [Closures](./04-closures.md) | [Prototypes](./06-prototypes-inheritance.md) | [Modern JavaScript ES2020+](./12-modern-javascript.md)
> **L5 Competencies**: Language Mastery, Data Structure Selection, Metaprogramming

[← Previous: Event Loop & Async](./07-event-loop-async.md) | [Next: Execution Context →](./09-execution-context.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn maintain codebase 3 năm tuổi. Code cũ: `var self = this`, `Array.prototype.slice.call(arguments)`, `data && data.attributes && data.attributes.pricing && data.attributes.pricing.amount`. Code mới: destructuring props, spread merge config, `Map` cho lookup table, `Proxy` cho form validation reactive. Hai style tồn tại song song — bạn cần hiểu cả hai để refactor an toàn, và biết **khi nào** dùng feature nào (không phải feature mới = tốt hơn mọi lúc).

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Nâng cấp hộp đồ nghề thợ mộc:**

ES5 = bộ đồ nghề cơ bản: búa, kìm, cưa tay. Làm được mọi thứ nhưng tốn sức.

ES6 = bộ đồ nghề chuyên dụng:

- **Destructuring** = thước đo kết hợp (đo + đánh dấu cùng lúc thay vì 2 bước)
- **Spread/Rest** = keo dán + tách ghép tấm gỗ (gộp nhiều mảnh thành 1, hoặc tách 1 thành nhiều)
- **Symbol** = serial number khắc laser không thể giả mạo
- **Map/Set** = hộp phân loại chuyên dụng (Map = tủ hồ sơ theo bất kỳ key, Set = khay lọc duplicate)
- **Proxy** = bảo vệ đứng trước cửa kiểm tra mọi người ra vào

---

## Concept Map / Bản Đồ Khái Niệm

```
                    [ES6+ Features]
                         │
    ┌────────────────────┼────────────────────┐
    ▼                    ▼                    ▼
[Data Extraction]   [Data Structures]   [Metaprogramming]
 Destructuring       Map / Set           Proxy
 Spread / Rest       WeakMap / WeakSet   Reflect
 Template Literals   Symbol              Symbol.iterator
                                         Symbol.toPrimitive
    │                    │                    │
    └────────────────────┼────────────────────┘
                         ▼
              [React: props, state, hooks]
              [Vue 3: reactive() = Proxy]
              [Node: Map for caching]
```

---

## Overview / Tổng Quan

File này cover 6 nhóm tính năng ES6+ **chưa được cover sâu ở file khác**:

1. **Destructuring** — extract data từ object/array bằng pattern matching
2. **Spread & Rest** — gộp/tách data, shallow copy, function arguments
3. **Template Literals** — string interpolation + tagged templates
4. **Symbol** — unique key không thể clash, well-known symbols
5. **Collections** — Map/Set/WeakMap/WeakSet thay thế plain object
6. **Proxy & Reflect** — intercept mọi operation trên object

> **Không cover ở đây** (đã cover ở file khác): let/const/TDZ → [03-scope-hoisting](./03-scope-hoisting.md), arrow functions → [05-this-keyword](./05-this-keyword.md), optional chaining/nullish coalescing → [12-modern-javascript](./12-modern-javascript.md)

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Destructuring — Pattern Matching Cho Data

> 🧠 **Memory Hook:** "Vế trái là **khuôn bánh** — bạn mô tả hình dạng data mong muốn. Vế phải là **bột nhão** — JS tự đổ data vào khuôn."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao extract data từ object lại dài dòng? → Vì `const name = user.name; const age = user.age;` lặp lại tên object mỗi dòng
- Tại sao pattern matching tốt hơn imperative? → Vì bạn mô tả **hình dạng** data mong muốn (declarative) thay vì **từng bước** lấy (imperative)
- Tại sao quan trọng với React? → Vì function component = destructuring props: `function Card({ title, onClick })` — tự document API

#### Layer 1: Analogy — Khuôn Bánh

Hình dung bạn có hộp quà (object) chứa nhiều món. Thay vì mở ra, lục tìm từng món:

```
Cách cũ: mở hộp → tìm name → ghi ra → tìm age → ghi ra → tìm city → ghi ra
Cách mới: đưa danh sách muốn lấy → JS tự extract đúng món
```

#### Layer 2: How It Works — Syntax Patterns

```
Object Destructuring Cheatsheet:
┌────────────────────────────────────────────────────────┐
│ const { a }           = obj    // extract property a   │
│ const { a: x }        = obj    // extract a, rename→x  │
│ const { a = 10 }      = obj    // default if undefined │
│ const { a: x = 10 }   = obj    // rename + default     │
│ const { a, ...rest }  = obj    // a + collect rest      │
└────────────────────────────────────────────────────────┘

Array Destructuring Cheatsheet:
┌────────────────────────────────────────────────────────┐
│ const [first, , third] = arr   // skip index 1         │
│ const [head, ...tail]  = arr   // head + rest as array │
│ const [a = 0, b = 0]  = arr   // defaults              │
│ const [a, b] = [b, a]         // swap without temp!    │
└────────────────────────────────────────────────────────┘
```

```javascript
// Object destructuring — phổ biến nhất trong React
const user = { name: "Buu", age: 25, city: "HCMC" };
const { name, age, country = "VN" } = user;
// name = 'Buu', age = 25, country = 'VN' (default)

// Rename — khi tên property trùng biến có sẵn
const { name: fullName } = user; // fullName = 'Buu'

// Nested — CẢNH BÁO: crash nếu intermediate undefined
const {
  address: { city },
} = user; // ❌ TypeError nếu user.address undefined
const { address: { city } = {} } = user; // ✅ default cho intermediate

// Parameter destructuring — self-documenting function API
function UserCard({ name, avatar, onClick }) {
  // caller thấy ngay function cần gì
}

// Array destructuring — useState pattern
const [count, setCount] = useState(0);
// React trả về [value, setter] → destructure bằng array pattern
```

#### Layer 3: Edge Cases

```javascript
// GOTCHA 1: Destructuring declaration vs assignment
let a, b;
// { a, b } = obj;       // ❌ SyntaxError — JS nghĩ đây là block
({ a, b } = obj); // ✅ wrap trong () để force expression

// GOTCHA 2: null/undefined crashes
const { x } = null; // ❌ TypeError: Cannot destructure null
const { x } = undefined; // ❌ TypeError
// Luôn guard: const { x } = data ?? {};

// GOTCHA 3: Nested default gotcha
const { a: { b } = {} } = {}; // b = undefined (not crash)
const {
  a: { b },
} = {}; // ❌ TypeError: a is undefined
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                              | Đúng là                                                  |
| ------------------------------------ | ---------------------------------------- | -------------------------------------------------------- |
| Destructure nested 3+ tầng           | Dài, dễ crash, khó đọc                   | Dùng `?.` optional chaining: `user?.address?.city ?? ''` |
| Quên default cho intermediate object | `{ a: { b } } = {}` → TypeError          | `{ a: { b } = {} } = {}` — default `{}` cho mỗi tầng     |
| Destructure `null`/`undefined`       | Throws TypeError                         | Guard: `const { x } = data ?? {}`                        |
| Confuse rename với default           | `{ a: b }` là rename, không phải default | `{ a: b = 10 }` = rename `a` thành `b`, default `10`     |

**🎯 Interview Pattern:**

- Khi thấy: "Clean up this data extraction" / "React props"
- → Mở đầu: "Destructuring là pattern matching — vế trái mô tả shape, JS tự extract. Có 4 power features: default values, rename, rest collection, và parameter destructuring cho self-documenting APIs..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Object property access, `undefined` behavior
- ➡️ Để hiểu: React props pattern, useState array destructuring, API response parsing

---

### 2. Spread & Rest — Gộp và Tách Data

> 🧠 **Memory Hook:** "Cùng syntax `...` nhưng ngược hướng: **Spread** = rải ra (expand), **Rest** = gom lại (collect). Spread = đổ hộp bi ra sàn. Rest = gom bi còn lại vào hộp."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần spread? → Vì clone object/array, merge config, pass array vào function mà không cần `apply()`
- Tại sao cần rest? → Vì `arguments` object là array-like (không có `.map()`, `.filter()`), rest cho real array
- Tại sao quan trọng với React? → Vì immutable state updates: `{ ...state, count: state.count + 1 }`

#### Layer 1: Analogy — Hộp Bi

```
SPREAD (rải ra):
  Hộp [🔴🟢🔵] → ...hộp → 🔴 🟢 🔵 (tách riêng từng viên)

REST (gom lại):
  🔴 🟢 🔵 🟡 🟣 → lấy 🔴, ...rest → rest = [🟢🔵🟡🟣]
```

#### Layer 2: How It Works

```javascript
// === SPREAD — expand/copy ===

// Array spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Object spread — SHALLOW copy (only 1 level deep)
const defaults = { theme: "light", lang: "vi" };
const userPref = { lang: "en" };
const config = { ...defaults, ...userPref };
// { theme: 'light', lang: 'en' } — right wins khi trùng key

// React immutable state update
const newState = { ...state, count: state.count + 1 }; // ✅ new reference
// state.count++;  // ❌ mutates original — React không detect change

// === REST — collect remaining ===

// Function parameters
function sum(first, ...rest) {
  // rest là real Array (có .map, .filter, .reduce)
  return first + rest.reduce((a, b) => a + b, 0);
}

// Object rest — extract known props, collect the rest
function Button({ variant, size, ...htmlProps }) {
  return <button className={variant} {...htmlProps} />;
  // htmlProps chứa onClick, disabled, etc. — pass-through pattern
}
```

```
Spread Order Matters (Object):
┌─────────────────────────────────────────────────┐
│ { ...a, ...b }                                  │
│                                                 │
│ a = { x: 1, y: 2 }                             │
│ b = { y: 3, z: 4 }                             │
│                                                 │
│ Result: { x: 1, y: 3, z: 4 }                   │
│         ↑ from a  ↑ b wins  ↑ from b            │
│                                                 │
│ Rule: LAST spread wins for duplicate keys       │
└─────────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases — Shallow Copy Trap

```javascript
// CRITICAL: Spread = SHALLOW copy
const original = {
  name: "Buu",
  address: { city: "HCMC" }, // nested object
};
const copy = { ...original };
copy.address.city = "Hanoi";
console.log(original.address.city); // 'Hanoi' ← BỊ THAY ĐỔI!

// Fix: structuredClone (ES2022) cho deep copy
const deepCopy = structuredClone(original);
deepCopy.address.city = "Hanoi";
console.log(original.address.city); // 'HCMC' ← safe
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                   | Đúng là                               |
| ------------------------------------- | ------------------------------------------------------------- | ------------------------------------- |
| Nghĩ spread = deep clone              | Spread chỉ copy 1 level — nested objects vẫn share reference  | `structuredClone()` cho deep copy     |
| Spread array vào object context       | `{...arr}` → `{0: 'a', 1: 'b'}` numeric keys                  | `[...arr]` để giữ array type          |
| `Object.assign(target, src)` = spread | `assign` mutate target, trigger setter. Spread tạo object mới | Spread = pure, assign = mutate target |

**🎯 Interview Pattern:**

- Khi thấy: "Shallow copy vs deep copy?"
- → Mở đầu: "Spread là shallow — chỉ copy 1 level. Nested objects vẫn share reference. `structuredClone()` là native deep copy từ ES2022..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Reference types, object property access
- ➡️ Để hiểu: React immutable state updates, Redux reducer patterns, props pass-through

---

### 3. Template Literals & Tagged Templates

> 🧠 **Memory Hook:** "Backtick `` ` `` = string siêu năng lực: interpolation `${}`, multi-line, và **tagged** = function xử lý từng mảnh string."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần template literals? → Vì string concatenation `'Hello ' + name + '!'` khó đọc, lỗi thiếu space
- Tại sao tagged templates? → Vì cần xử lý string pieces riêng biệt: sanitize HTML, CSS-in-JS, SQL query builder

#### Layer 1: Analogy

Template literal = mad libs game: bạn viết câu template với chỗ trống `${}`, JS tự điền giá trị vào.

Tagged template = **editor** đọc mad libs trước khi in: kiểm tra từng chỗ trống, có thể sửa hoặc reject.

#### Layer 2: How It Works

```javascript
// Basic interpolation
const name = "Buu";
const greeting = `Hello ${name}, bạn ${age > 18 ? "đủ tuổi" : "chưa đủ tuổi"}`;

// Multi-line
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${body}</p>
  </div>
`;

// === TAGGED TEMPLATES — function xử lý từng mảnh ===
function highlight(strings, ...values) {
  // strings = mảng text giữa các ${}, values = mảng giá trị ${}
  return strings.reduce(
    (result, str, i) => result + str + (values[i] ? `<mark>${values[i]}</mark>` : ""),
    "",
  );
}
const result = highlight`Hello ${name}, age ${age}`;
// "Hello <mark>Buu</mark>, age <mark>25</mark>"

// Real-world: SQL injection prevention
function sql(strings, ...values) {
  return {
    text: strings.join("$"), // parameterized query
    values: values, // separate values → safe
  };
}
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
// { text: "SELECT * FROM users WHERE id = $", values: [42] }

// Real-world: styled-components dùng tagged templates
const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "gray")};
  color: white;
`;
```

#### Layer 3: Edge Cases

```javascript
// Tagged template nhận raw strings (escape sequences giữ nguyên)
function raw(strings) {
  return strings.raw[0]; // raw = không process escape
}
raw`\n`; // "\\n" (2 chars), không phải newline

// String.raw built-in
String.raw`\n`; // "\\n" — hữu ích cho regex patterns
const regex = new RegExp(String.raw`\d+\.\d+`); // không cần double escape
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                                  | Đúng là                                       |
| ------------------------------------ | ------------------------------------------------------------ | --------------------------------------------- |
| Dùng template literal cho mọi string | Overhead cho static strings không có interpolation           | `'hello'` đơn giản cho static strings         |
| Quên tagged template nhận array      | `tag\`a${1}b\``→`strings=['a','b'], values=[1]`              | strings luôn dài hơn values 1 phần tử         |
| SQL injection qua template literal   | `` `SELECT * FROM users WHERE id = ${input}` `` — KHÔNG safe | Dùng tagged template hoặc parameterized query |

**🔑 Knowledge Chain:**

- 📚 Cần biết: String basics, function parameters
- ➡️ Để hiểu: styled-components, GraphQL tagged queries, i18n template systems

---

### 4. Symbol — Unique Key Không Thể Giả Mạo

> 🧠 **Memory Hook:** "Symbol = **số CMND** — 2 người cùng tên Buu nhưng CMND khác nhau. `Symbol('id') !== Symbol('id')` luôn đúng."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao string key không đủ? → Vì 2 thư viện dùng cùng key `'id'` trên 1 object → clash. Symbol đảm bảo unique
- Tại sao Symbol không enumerable? → Vì metadata keys không nên xuất hiện trong `for...in` hay `Object.keys()`
- Tại sao cần Well-known Symbols? → Vì JS engine cần hook points: `Symbol.iterator` cho `for...of`, `Symbol.toPrimitive` cho type coercion

#### Layer 1: Analogy — Số CMND

Hai người tên "Nguyễn Văn A" — cùng tên nhưng CMND khác nhau, luôn phân biệt được. Symbol giống vậy: `Symbol('id')` và `Symbol('id')` — cùng description nhưng **luôn khác nhau**.

Exception: `Symbol.for('key')` = **registry quốc gia** — cùng key luôn trả về cùng Symbol (shared across modules).

#### Layer 2: How It Works

```javascript
// Basic Symbol — LUÔN unique
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false — khác nhau dù cùng description

// Dùng làm object key — không clash với string keys
const SECRET_KEY = Symbol("secret");
const obj = {
  name: "Buu",
  [SECRET_KEY]: "42", // computed property syntax
};

console.log(obj.name); // 'Buu'
console.log(obj[SECRET_KEY]); // '42'
console.log(Object.keys(obj)); // ['name'] — Symbol key KHÔNG xuất hiện!

// Symbol.for() — global registry (shared giữa modules, iframes)
const s1 = Symbol.for("app.id");
const s2 = Symbol.for("app.id");
console.log(s1 === s2); // true — cùng registry key → cùng Symbol

// === WELL-KNOWN SYMBOLS — hook vào JS engine ===

// Symbol.iterator — cho phép for...of
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last ? { value: current++, done: false } : { done: true };
      },
    };
  },
};
console.log([...range]); // [1, 2, 3, 4, 5]
for (const n of range) console.log(n); // 1 2 3 4 5

// Symbol.toPrimitive — control type coercion
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.amount;
    if (hint === "string") return `${this.amount} ${this.currency}`;
    return this.amount; // default
  }
}
const price = new Money(100, "USD");
console.log(+price); // 100 (hint='number')
console.log(`${price}`); // "100 USD" (hint='string')
```

```
Well-known Symbols Cheatsheet:
┌─────────────────────────┬───────────────────────────────────┐
│ Symbol                  │ Controls                          │
├─────────────────────────┼───────────────────────────────────┤
│ Symbol.iterator         │ for...of, spread, destructuring   │
│ Symbol.toPrimitive      │ Type coercion (+, `${}`, ==)      │
│ Symbol.hasInstance       │ instanceof checks                 │
│ Symbol.toStringTag      │ Object.prototype.toString result  │
│ Symbol.species          │ Constructor for derived objects    │
└─────────────────────────┴───────────────────────────────────┘
```

#### Layer 3: Edge Cases

```javascript
// Symbol không auto-convert sang string
const sym = Symbol("test");
console.log("Symbol: " + sym); // ❌ TypeError!
console.log(`Symbol: ${sym}`); // ❌ TypeError!
console.log(`Symbol: ${sym.toString()}`); // ✅ "Symbol: Symbol(test)"
console.log(`Symbol: ${sym.description}`); // ✅ "Symbol: test"

// JSON.stringify bỏ qua Symbol keys
const obj = { name: "Buu", [Symbol("id")]: 42 };
JSON.stringify(obj); // '{"name":"Buu"}' — Symbol key biến mất!

// Lấy Symbol keys: Object.getOwnPropertySymbols()
Object.getOwnPropertySymbols(obj); // [Symbol(id)]
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                               | Đúng là                                                                     |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Symbol('x') === Symbol('x')` → true | Mỗi `Symbol()` tạo unique value, description chỉ để debug | Luôn false. Dùng `Symbol.for()` nếu cần shared                              |
| Concat Symbol với string             | Symbol không auto-coerce → TypeError                      | Dùng `.toString()` hoặc `.description`                                      |
| Nghĩ Symbol = private                | `Object.getOwnPropertySymbols()` vẫn access được          | Symbol = non-enumerable, không phải private. Dùng `#field` cho true private |

**🎯 Interview Pattern:**

- Khi thấy: "Unique keys" / "Collision-free properties" / "Iterator protocol"
- → Mở đầu: "Symbol tạo unique key guaranteed — ngay cả cùng description cũng khác nhau. Dùng cho 2 mục đích chính: collision-free metadata keys, và well-known symbols hook vào JS engine như `Symbol.iterator` cho `for...of`..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Object property access, type coercion
- ➡️ Để hiểu: Iterator/Generator protocol, custom `for...of`, React Context internal keys

---

### 5. Collections — Map / Set / WeakMap / WeakSet

> 🧠 **Memory Hook:** "**Map** = tủ hồ sơ cho **bất kỳ key** (không chỉ string). **Set** = bộ lọc duplicate tự động. **Weak** prefix = 'mượn' key — khi chủ nhân biến mất, entry tự xóa."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao Map khi đã có Object? → Object keys luôn bị coerce sang string: `obj[1]` = `obj['1']`. Map giữ nguyên key type, có `.size`, ordered
- Tại sao Set? → Dedup array: `[...new Set(arr)]` O(n). `Array.includes` = O(n) mỗi lần check, `Set.has` = O(1)
- Tại sao WeakMap? → Map giữ strong reference → key object không bao giờ bị GC. WeakMap giữ weak reference → key bị GC khi không ai reference nữa → prevent memory leak

#### Layer 1: Analogy — Các Loại Tủ

```
Map    = Tủ hồ sơ cao cấp: key là BẤT KỲ (ảnh, fingerprint, thẻ ID), ordered, biết size
Object = Tủ hồ sơ thường: key chỉ là tên (string), không biết có bao nhiêu file

Set    = Máy lọc duplicate: bỏ bi vào, trùng thì bỏ qua, biết "có bi đỏ không?" ngay lập tức
Array  = Rổ bi: chứa trùng, tìm bi phải lục từng viên

WeakMap = Tủ khóa mượn: khi chủ nhân chìa khóa biến mất → ổ khóa tự xóa
Map     = Tủ khóa vĩnh viễn: dù chủ nhân biến mất, ổ khóa vẫn giữ → memory leak
```

#### Layer 2: How It Works

```
Data Structure Selection Guide:
┌──────────────┬─────────────┬───────────┬────────────┬──────────────────┐
│ Structure    │ Key type    │ Iterable? │ GC-safe?   │ Best use case    │
├──────────────┼─────────────┼───────────┼────────────┼──────────────────┤
│ Object {}    │ string/Sym  │ ✅        │ N/A        │ JSON, records    │
│ Map          │ ANY         │ ✅        │ ❌ (strong) │ Lookup table     │
│ Set          │ — (values)  │ ✅        │ ❌ (strong) │ Dedup, O(1) has  │
│ WeakMap      │ Object only │ ❌        │ ✅ (weak)   │ Private metadata │
│ WeakSet      │ Object only │ ❌        │ ✅ (weak)   │ "Processed?" tag │
└──────────────┴─────────────┴───────────┴────────────┴──────────────────┘
```

```javascript
// === MAP — any key type, ordered, .size ===
const userRoles = new Map();
const adminBtn = document.querySelector("#admin");
userRoles.set(adminBtn, "admin"); // DOM node as key!
userRoles.set(42, "answer"); // number as key
userRoles.set({ id: 1 }, "user"); // ⚠️ object literal = new ref mỗi lần
userRoles.size; // 3

// Map từ array of pairs
const map = new Map([
  ["a", 1],
  ["b", 2],
]);
for (const [key, value] of map) {
  /* ordered iteration */
}

// === SET — unique values, O(1) has() ===
const tags = new Set(["react", "vue", "react"]); // Set(2) {'react', 'vue'}
tags.has("react"); // true — O(1)
tags.add("angular");
tags.delete("vue");

// Dedup array — one-liner
const unique = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]

// === WEAKMAP — GC-safe metadata per object ===
const cache = new WeakMap();

function processNode(domNode) {
  if (cache.has(domNode)) return cache.get(domNode);
  const result = expensiveCompute(domNode);
  cache.set(domNode, result);
  return result;
}
// Khi domNode bị remove khỏi DOM và không ai reference → GC cả entry

// WeakMap cho private data (pre-#field pattern)
const _private = new WeakMap();
class Person {
  constructor(name) {
    _private.set(this, { name }); // private data per instance
  }
  getName() {
    return _private.get(this).name;
  }
}
```

#### Layer 3: Edge Cases

```javascript
// Object key coercion — tại sao Map tốt hơn
const obj = {};
obj[1] = "number";
obj["1"] = "string";
console.log(obj[1]); // 'string' ← key bị coerce sang string!

const map = new Map();
map.set(1, "number");
map.set("1", "string");
console.log(map.get(1)); // 'number' ← key type preserved!
console.log(map.get("1")); // 'string'

// WeakMap KHÔNG iterable — by design
const wm = new WeakMap();
// wm.keys()    → TypeError: wm.keys is not a function
// wm.forEach() → TypeError
// Lý do: GC timing non-deterministic — không biết khi nào entry bị xóa

// Set equality = same-value-zero (giống === nhưng NaN === NaN)
const set = new Set();
set.add(NaN);
set.add(NaN);
set.size; // 1 — NaN chỉ add 1 lần
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                     | Tại sao sai                                                          | Đúng là                                                    |
| ------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| Dùng Object cho dynamic lookup table        | Key bị coerce sang string, no `.size`, no ordered guarantee          | Dùng Map cho dynamic key-value                             |
| `Array.from(new Set(arr))` — chỉ biết dedup | Set.has() = O(1), Array.includes() = O(n) — đây mới là lợi ích chính | Dùng Set khi cần fast membership test                      |
| Dùng WeakMap rồi iterate                    | WeakMap không có `.keys()`, `.values()`, `.forEach()`                | Dùng Map nếu cần iterate; WeakMap chỉ cho GC-safe metadata |
| Dùng object literal làm Map key             | `map.set({id: 1}, 'x')` → mỗi lần tạo object mới = key mới           | Store reference: `const key = {id: 1}; map.set(key, 'x')`  |

**🎯 Interview Pattern:**

- Khi thấy: "Dedup" / "Cache without memory leak" / "Non-string keys"
- → Mở đầu: "Map cho any-type keys và ordered iteration. Set cho O(1) dedup và membership test. WeakMap khi cần associate data với object mà không prevent GC — ví dụ cache DOM node computation..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Object property access, Garbage Collection basics
- ➡️ Để hiểu: Vue/MobX reactivity (WeakMap cho metadata), memoization without memory leak, React context optimization

---

### 6. Proxy & Reflect — Bảo Vệ Đứng Trước Object

> 🧠 **Memory Hook:** "**Proxy** = bảo vệ tòa nhà kiểm tra mọi người ra/vào. **Reflect** = cuốn sổ quy tắc mặc định của bảo vệ. Proxy chặn + customize, Reflect = 'cho qua bình thường'."

**Tại sao tồn tại? (Why does this exist?)**

- Tại sao cần intercept object operations? → Vì validation, logging, reactivity cần cross-cutting behavior mà không sửa từng property
- Tại sao `Object.defineProperty` không đủ? → Vì nó chỉ per-property, không cover `in`, `delete`, function calls, prototype access. Proxy cover **13 loại operation**
- Tại sao Reflect? → Vì bên trong trap, cần cách gọi default behavior. `Reflect.get(target, key, receiver)` = "làm như bình thường nếu không có Proxy"

#### Layer 1: Analogy — Bảo Vệ Tòa Nhà

```
Không có Proxy:   Khách → Tòa nhà (vào tự do)
Có Proxy:         Khách → [Bảo vệ] → Tòa nhà
                           │
                    Kiểm tra CMND (get trap)
                    Kiểm tra hàng hóa (set trap)
                    Kiểm tra "có phòng X không?" (has trap)
                    Ghi sổ ra/vào (logging)
                    Từ chối nếu vi phạm (validation)
                           │
                    [Sổ quy tắc = Reflect]
                    "Nếu hợp lệ → cho qua bình thường"
```

#### Layer 2: How It Works

```javascript
// Basic Proxy — validation + logging
const product = { price: 100, name: "Phone" };

const handler = {
  get(target, key, receiver) {
    console.log(`📖 Reading: ${String(key)}`);
    return Reflect.get(target, key, receiver); // default behavior
  },
  set(target, key, value, receiver) {
    if (key === "price" && (typeof value !== "number" || value < 0)) {
      throw new Error(`Invalid price: ${value}`);
    }
    console.log(`✏️ Setting ${String(key)} = ${value}`);
    return Reflect.set(target, key, value, receiver);
  },
  has(target, key) {
    console.log(`🔍 Checking: "${String(key)}" in object`);
    return Reflect.has(target, key);
  },
};

const proxy = new Proxy(product, handler);
proxy.price; // 📖 Reading: price → 100
proxy.price = 200; // ✏️ Setting price = 200
proxy.price = -10; // ❌ Error: Invalid price: -10
"name" in proxy; // 🔍 Checking: "name" in object → true
```

```
13 Proxy Traps:
┌──────────────────┬──────────────────────────────────┐
│ Trap             │ Intercepts                       │
├──────────────────┼──────────────────────────────────┤
│ get              │ property read                    │
│ set              │ property write                   │
│ has              │ `in` operator                    │
│ deleteProperty   │ `delete` operator                │
│ apply            │ function call (Proxy on function)│
│ construct        │ `new` operator                   │
│ ownKeys          │ Object.keys, for...in            │
│ getPrototypeOf   │ prototype chain lookup           │
│ ... (6 more)     │ defineProperty, isExtensible...  │
└──────────────────┴──────────────────────────────────┘
```

```javascript
// === VUE 3 REACTIVITY — thực tế dùng Proxy ===
// Simplified version of Vue 3's reactive()
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // đăng ký subscriber (component render function)
      const result = Reflect.get(target, key, receiver);
      // Deep reactive: nếu result là object → wrap thêm Proxy
      return typeof result === "object" && result !== null ? reactive(result) : result;
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // notify tất cả subscriber re-render
      return result;
    },
  });
}

// === WHY Reflect.get INSTEAD OF target[key]? ===
// target[key] bypasses receiver → breaks prototype chain
const parent = new Proxy(
  { x: 1 },
  {
    get(target, key, receiver) {
      // receiver = object gọi .get, có thể là child
      return Reflect.get(target, key, receiver); // ✅ correct receiver
      // return target[key]; // ❌ ignores receiver — breaks inheritance
    },
  },
);
const child = Object.create(parent);
child.x; // Reflect.get passes child as receiver → correct behavior
```

#### Layer 3: Edge Cases & Limitations

```javascript
// Proxy KHÔNG wrap primitives
// new Proxy(42, handler); // ❌ TypeError: Cannot create proxy with non-object

// Proxy revocable — tắt proxy khi không cần
const { proxy, revoke } = Proxy.revocable(target, handler);
proxy.name; // works
revoke();
proxy.name; // ❌ TypeError: Cannot perform 'get' on a proxy that has been revoked

// Performance: Proxy có overhead — không dùng trong tight loops
// Benchmark: Proxy access ~50-100x slower than direct access
// Acceptable cho: form validation, reactivity, API clients
// Avoid cho: hot path, game loop, high-frequency data processing
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                    | Tại sao sai                                  | Đúng là                                             |
| ---------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| `target[key]` thay vì `Reflect.get(target, key, receiver)` | Bỏ qua receiver → break prototype chain      | Luôn dùng `Reflect.*` trong trap                    |
| Proxy cho 1 property validation                            | Overhead không cần thiết cho single property | `Object.defineProperty` đơn giản hơn cho 1 property |
| Proxy trong hot loop                                       | ~50-100x slower than direct access           | Chỉ dùng cho non-hot-path: forms, API, reactivity   |
| Quên Proxy intercept prototype ops                         | `'key' in proxied` gọi `has` trap            | Implement hoặc aware of tất cả traps cần thiết      |

**🎯 Interview Pattern:**

- Khi thấy: "Vue reactivity" / "Object validation" / "Metaprogramming"
- → Mở đầu: "Proxy intercept 13 loại operation trên object — get, set, delete, has, v.v. Vue 3 dùng Proxy với get trap = track dependencies, set trap = trigger re-renders. Trong trap, dùng Reflect để invoke default behavior và preserve prototype chain..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Object property descriptors, Prototype chain
- ➡️ Để hiểu: Vue 3 reactivity, test mocking/spying, validation DSL, MobX observable

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: Spread operator tạo shallow hay deep copy? 🟢 Junior

**A:**

Shallow copy — chỉ copy **1 level**. Nested objects vẫn share reference.

```javascript
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.a = 99; // original.a vẫn 1 ✅ (primitive = copy value)
copy.nested.b = 99; // original.nested.b = 99 ❌ (object = copy reference)
```

**Deep copy options:**

- `structuredClone(obj)` — native ES2022, handle circular refs
- `JSON.parse(JSON.stringify(obj))` — không handle Date, undefined, functions, circular
- `lodash.cloneDeep(obj)` — library, handle mọi edge case

**💡 Interview Signal:**

- ✅ Strong: Giải thích tại sao nested bị share (reference vs value), biết `structuredClone`, biết limitations của JSON method
- ❌ Weak: "Spread copy object" — không nói shallow/deep distinction

---

### Q2: Map vs Object — khi nào dùng Map? 🟢 Junior

**A:**

Dùng **Map** khi: (1) keys không phải string — DOM nodes, objects, numbers; (2) cần ordered iteration; (3) frequent add/delete (Map optimized); (4) cần `.size` thay vì `Object.keys().length`.

Dùng **Object** khi: (1) keys luôn là string; (2) cần JSON serialization (Map không serialize); (3) static records.

```javascript
// Object: key bị coerce sang string
const obj = {};
obj[1] = "one";
obj["1"] = "string one";
Object.keys(obj); // ['1'] — chỉ 1 key! (1 và '1' trùng)

// Map: key type preserved
const map = new Map();
map.set(1, "one");
map.set("1", "string one");
map.size; // 2 — 2 keys riêng biệt
```

**💡 Interview Signal:**

- ✅ Strong: Non-string keys, key coercion problem, `.size`, JSON limitation
- ❌ Weak: "Map tốt hơn Object" — oversimplification

---

### Q3: WeakMap giải quyết vấn đề gì? 🟡 Mid

**A:**

WeakMap giải quyết **memory leak** khi associate data với object.

Map giữ **strong reference** → key object không bao giờ bị GC dù không ai dùng nữa. WeakMap giữ **weak reference** → khi key object không có reference khác → GC tự xóa entry.

```javascript
// Memory leak với Map
const cache = new Map();
function processNode(node) {
  cache.set(node, compute(node)); // node bị remove khỏi DOM nhưng Map vẫn giữ!
}

// No leak với WeakMap
const cache = new WeakMap();
function processNode(node) {
  cache.set(node, compute(node)); // node bị remove → GC cả entry
}
```

**Trade-off:** WeakMap KHÔNG iterable — không có `.keys()`, `.forEach()`, `.size`. Vì GC timing non-deterministic → không thể biết khi nào entry bị xóa.

**💡 Interview Signal:**

- ✅ Strong: GC prevention problem, DOM node example, explains non-iterability reason
- ❌ Weak: "WeakMap = Map nhưng yếu hơn" — circular, no GC explanation

---

### Q4: Implement `Symbol.iterator` cho custom range object 🟡 Mid

**A:**

`Symbol.iterator` là well-known symbol — JS engine gọi nó cho `for...of`, spread, destructuring. Phải return iterator object với method `next()` trả về `{ value, done }`.

```javascript
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { done: true };
      },
    };
  }
}

const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]
for (const n of range) {
} // 1, 2, 3, 4, 5
const [a, b, c] = range; // a=1, b=2, c=3 (destructuring)
```

**Protocol:** `[Symbol.iterator]()` → returns `{ next() }` → returns `{ value, done }`.

**💡 Interview Signal:**

- ✅ Strong: Implement đúng protocol, biết spread/for...of/destructuring đều gọi `[Symbol.iterator]()`, biết `{ done: true }` khi hết
- ❌ Weak: "Symbol.iterator làm object iterable" — đúng nhưng không implement được protocol

---

### Q5: Tagged template literal hoạt động ra sao? Cho use case thực tế. 🟡 Mid

**A:**

Tagged template = function nhận **strings array** và **values array** riêng biệt. Function quyết định cách combine chúng.

```javascript
function tag(strings, ...values) {
  // strings = ['Hello ', ', age ']
  // values = ['Buu', 25]
  // strings.length = values.length + 1 (luôn đúng)
}
tag`Hello ${name}, age ${age}`;
```

**Use cases thực tế:**

1. **SQL injection prevention** — separate query + values → parameterized query
2. **styled-components** — `styled.div\`color: ${color}\`` → CSS generation
3. **i18n** — `t\`Hello ${name}\`` → translate template keeping placeholders
4. **HTML sanitization** — escape values but keep template structure safe

**💡 Interview Signal:**

- ✅ Strong: Explain strings/values split, biết strings.length = values.length + 1, cho 2+ real use cases
- ❌ Weak: "Template literal có backtick và ${}" — confuse template literal với tagged template

---

### Q6: Giải thích Vue 3 reactivity dùng Proxy. Limitations là gì? 🔴 Senior

> **Follow-up chain:** → "Tại sao Vue 2 dùng defineProperty, Vue 3 chuyển sang Proxy?" → "Destructuring phá reactivity — tại sao? Fix thế nào?"

**A:**

Vue 3 `reactive()` = Proxy với 2 traps chính:

- **get trap** → `track(target, key)`: đăng ký component render function là subscriber của property này
- **set trap** → `trigger(target, key)`: notify tất cả subscribers re-render

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // subscribe current effect
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // notify subscribers
      return result;
    },
  });
}
```

**Limitations:**

1. **Primitives không wrap được** → `reactive(0)` fail (Proxy needs object) → Vue tạo `ref()` wrap primitive trong `{ value }` object
2. **Destructuring phá reactivity** → `const { count } = reactive({count: 0})` copy primitive `0` ra khỏi Proxy → mất connection. Fix: `toRef()` hoặc `toRefs()`
3. **Array index edge cases** → `arr[0] = x` cần đặc biệt handle trong set trap

**Vue 2 vs Vue 3:**

- Vue 2: `Object.defineProperty` — per-property, không detect thêm/xóa property, không detect array index change
- Vue 3: `Proxy` — intercept ALL operations, detect thêm/xóa property, nhưng không support IE11

**💡 Interview Signal:**

- ✅ Strong: track/trigger pattern, Reflect usage, 2+ limitations, Vue 2 vs 3 comparison
- ❌ Weak: "Vue uses Proxy for reactivity" — no depth on mechanism or trade-offs

---

### Q7: Design type-safe validation layer bằng Proxy. So sánh với Zod. 🔴 Senior

> **Follow-up chain:** → "Performance trade-off của Proxy validation?" → "Kết hợp Proxy + Zod trong production thế nào?"

**A:**

```javascript
function createValidated(schema) {
  const state = {};
  const errors = {};
  return new Proxy(state, {
    set(target, key, value) {
      const rule = schema[key];
      if (rule && !rule.validate(value)) {
        errors[key] = rule.message;
        return true; // don't throw — store error for UI
      }
      delete errors[key];
      return Reflect.set(target, key, value);
    },
    get(target, key) {
      if (key === "_errors") return { ...errors }; // snapshot
      if (key === "_isValid") return Object.keys(errors).length === 0;
      return Reflect.get(target, key);
    },
  });
}

const form = createValidated({
  email: { validate: (v) => /\S+@\S+\.\S+/.test(v), message: "Invalid email" },
  age: { validate: (v) => typeof v === "number" && v >= 18, message: "Must be 18+" },
});

form.email = "invalid";
form._errors; // { email: 'Invalid email' }
form._isValid; // false
```

**Proxy vs Zod:**

| Aspect         | Proxy Validation                | Zod                                 |
| -------------- | ------------------------------- | ----------------------------------- |
| When validates | **Continuous** — mỗi assignment | **Point-in-time** — `.parse()` call |
| TypeScript     | No type inference từ schema     | `.parse()` returns typed result     |
| Composability  | Harder to compose rules         | `.merge()`, `.extend()`, `.pick()`  |
| Use case       | Reactive form UI                | API boundary validation             |

**Production pattern:** Zod ở API boundary (parse once, trust everywhere) + Proxy cho reactive form validation (validate mỗi keystroke, show errors real-time).

**💡 Interview Signal:**

- ✅ Strong: Working Proxy implementation, `_errors` side channel, Proxy vs Zod trade-off table, combined usage pattern
- ❌ Weak: "Just use Zod" — misses Proxy design question; hoặc "Proxy is better" — misses type inference

---

### Q8: Design immutable config system cho large-scale app 🔴 Senior

> **Follow-up chain:** → "Làm sao detect violation sớm ở dev nhưng không overhead ở production?" → "Object.freeze recursive có performance issue gì?"

**A:**

```javascript
function createConfig(initial) {
  // Deep freeze in development only
  const frozen = process.env.NODE_ENV === "development" ? deepFreeze(initial) : initial;

  // Proxy for mutation detection + helpful error messages
  return new Proxy(frozen, {
    set(target, key, value) {
      throw new Error(
        `Config is immutable. Cannot set "${String(key)}" to ${JSON.stringify(value)}. ` +
          `Use createConfig({ ...config, ${String(key)}: newValue }) instead.`,
      );
    },
    deleteProperty(target, key) {
      throw new Error(`Config is immutable. Cannot delete "${String(key)}".`);
    },
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      // Deep Proxy: nested objects also immutable
      if (typeof value === "object" && value !== null) {
        return new Proxy(value, this); // reuse same handler
      }
      return value;
    },
  });
}

function deepFreeze(obj) {
  Object.freeze(obj);
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return obj;
}

// Usage
const config = createConfig({
  api: { baseUrl: "https://api.example.com", timeout: 5000 },
  features: { darkMode: true },
});
config.api.timeout = 10000; // ❌ Error with helpful message
```

**Design decisions:**

1. `deepFreeze` chỉ ở dev — production skip cho performance (freeze recursive = O(n) traversal)
2. Proxy cho **error messages rõ ràng** — không chỉ silent fail
3. Deep Proxy cho nested immutability — `config.api.timeout = x` cũng bị chặn
4. Functional update: `createConfig({ ...config, api: { ...config.api, timeout: 10000 } })`

**💡 Interview Signal:**

- ✅ Strong: Dev/prod split, deepFreeze + Proxy combined, helpful error messages, functional update pattern
- ❌ Weak: "Just use Object.freeze()" — misses recursive, error UX, performance

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Sendo — Destructuring Default Value Masked a Critical API Change

**Situation:** Sendo's product team updated the backend API to rename `product.stock_qty` to `product.available_qty`. The frontend used destructuring with a default value — which silently swallowed the breaking change for two weeks before a monitoring alert fired on unusually high out-of-stock checkouts.

**What went wrong:**
```javascript
// Old API: { stock_qty: 5 }
// New API: { available_qty: 5 } ← renamed field

// Frontend destructuring with default:
const { stock_qty = 0 } = product; // ← product now has no 'stock_qty'
// stock_qty = 0 (the default) — silently, no error thrown
// UI showed "Out of Stock" for all products, even those with 50 units available
```

**Decision made:** Team adopted runtime schema validation at API boundaries using Zod:
```javascript
const ProductSchema = z.object({
  available_qty: z.number(), // ← throws if field missing/renamed
  // No default — if field is absent, it's an error, not a fallback
});

const product = ProductSchema.parse(apiResponse); // throws on schema mismatch
```

**Trade-off accepted:** Zod validation adds ~2ms overhead per API response. Strict validation means schema changes require coordinated FE+BE deploys. Team accepted this by implementing Zod schema in a shared types package versioned alongside the API contract.

**Lesson:** Destructuring defaults are a runtime convenience — they're not a resilience strategy. A missing field should usually be a loud error during development, not a silent fallback. Use defaults only for genuinely optional fields, not as protection against API contract violations.

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic               | Level | One-liner                                                   |
| --- | ------------------- | ----- | ----------------------------------------------------------- |
| 1   | Spread shallow/deep | 🟢    | Spread = shallow 1 level. Deep: `structuredClone()`         |
| 2   | Map vs Object       | 🟢    | Map: any key, ordered, `.size`. Object: JSON, string keys   |
| 3   | WeakMap purpose     | 🟡    | Weak ref → GC-safe metadata. Non-iterable by design         |
| 4   | Symbol.iterator     | 🟡    | `[Symbol.iterator]()` → `{ next() }` → `{ value, done }`    |
| 5   | Tagged templates    | 🟡    | Function nhận strings[] + values[] riêng → SQL/CSS/i18n     |
| 6   | Vue 3 Proxy         | 🔴    | get=track, set=trigger. Limits: primitives, destructuring   |
| 7   | Proxy vs Zod        | 🔴    | Proxy: continuous reactive. Zod: typed parse at boundary    |
| 8   | Immutable config    | 🔴    | deepFreeze(dev) + Proxy(helpful errors) + functional update |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao Vue 3 chuyển từ Object.defineProperty sang Proxy?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "`Object.defineProperty` chỉ intercept per-property đã khai báo — không detect thêm property mới hoặc xóa property."
2. "Vue 2 phải dùng `Vue.set()` workaround cho property mới, và không detect array index change — phải dùng `.splice()` thay vì `arr[0] = x`."
3. "Proxy intercept ALL operations trên object — get, set, delete, has — cover mọi case mà `defineProperty` thiếu."
4. "Trade-off: Proxy không support IE11 — đó là lý do Vue 3 drop IE11 support."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                        |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | **4 destructuring patterns**: object extract, rename, default, rest. Viết mỗi loại 1 dòng.                                     |
| 2   | 🎨 Visual      | Vẽ **decision tree**: Map vs Set vs WeakMap vs Object — khi nào dùng cái nào?                                                  |
| 3   | 🛠️ Application | Implement `Symbol.iterator` cho class `Fibonacci` — `for (const n of new Fibonacci(10))` in 10 số Fibonacci đầu tiên.          |
| 4   | 🐛 Debug       | `const copy = { ...original }; copy.nested.x = 99;` — tại sao `original.nested.x` cũng bị thay? Fix?                           |
| 5   | 🎓 Teach       | Giải thích cho junior: tại sao `Symbol('id') !== Symbol('id')` luôn đúng — và khi nào tính unique đó hữu ích trong production? |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | `const { a } = obj` extract, `{ a: x }` rename, `{ a = 10 }` default, `{ a, ...rest }` rest. Combine: `{ a: x = 10 }`       |
| 2   | Map: any key + ordered. Set: unique + O(1) has. WeakMap: GC-safe + no iterate. Object: JSON + string keys                   |
| 3   | `[Symbol.iterator]()` return `{ next() { return { value, done } } }`. Fibonacci: track prev/current, yield current, swap    |
| 4   | Spread = shallow copy. Nested object share reference. Fix: `structuredClone(original)`                                      |
| 5   | `Symbol()` tạo unique token mỗi lần. Dùng cho: collision-free object keys giữa libraries, well-known symbols hook JS engine |

> 🎯 **Feynman Prompt:** Giải thích `Proxy` cho người không biết code — dùng ví dụ bảo vệ tòa nhà, không dùng thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)

- [Scope & Hoisting](./03-scope-hoisting.md) — let/const block scope, TDZ
- [this Keyword](./05-this-keyword.md) — Arrow functions, lexical this
- [Closures](./04-closures.md) — Closure + destructuring in loops
- [Modern JavaScript](./12-modern-javascript.md) — ES2020+ features: ?., ??, ??=
- [Advanced Patterns](./14-advanced-patterns.md) — Decorator, Mixins dùng Proxy

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Language Fundamentals](../../be-track/01-golang/01-language-fundamentals.md) — Go has analogous modern features: multiple return ≈ destructuring, variadic `...` ≈ spread, built-in Map/Set; but no dynamic iteration protocols
- 🔗 **FE — TypeScript**: [TypeScript Basics](../02-typescript/01-typescript-basics.md) — TypeScript = ES6+ superset; learn ES6 first then TS adds type layer on top
- 🔗 **FE — React**: [React Fundamentals](../03-react/01-react-fundamentals.md) — destructuring props, spread for state updates, `useState` returned as array destructuring
- 🔗 **FE — State**: [React State Management](../03-react/05-state-management.md) — immutable updates with spread, Map/Set for O(1) lookups in reducers
- 🔗 **Shared theory**: [Software Engineering Patterns](../../shared/05-software-engineering/01-solid-and-design-patterns.md) — ES6 classes enable clean OOP patterns; Symbol + WeakMap enable private state patterns
