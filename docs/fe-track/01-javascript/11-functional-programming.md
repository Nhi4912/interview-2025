# Functional Programming in JavaScript / Lập Trình Hàm trong JavaScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./04-closures.md) | [ES6+ Features](./08-es6-features.md)
> **See also**: [Advanced Patterns](./14-advanced-patterns.md) | [React Fundamentals](../03-react/01-react-fundamentals.md)
> **L5 Competencies**: Code Architecture • React Mental Model • Data Pipeline Design

---

## Real-World Scenario / Tình Huống Thực Tế

> Team React tại một fintech startup gặp bug nghiêm trọng — Redux reducer mutate state trực tiếp
> thay vì tạo bản sao mới. Kết quả: `React.memo` không re-render vì reference equality giữ nguyên,
> dashboard hiển thị **số dư cũ** cho 2,000 user trong 3 giờ.
>
> Post-mortem: developer viết `state.balance += amount` thay vì
> `{ ...state, balance: state.balance + amount }`. Đây là lỗi **impure function** — vi phạm
> nguyên tắc cốt lõi nhất của FP: **không bao giờ mutate input**.
>
> React, Redux, RxJS — toàn bộ ecosystem frontend hiện đại xây trên nền FP. Hiểu FP = hiểu
> _tại sao_ React hoạt động như vậy.

---

## What & Why / Cái Gì & Tại Sao

**Functional Programming** là paradigm xử lý computation như evaluation of mathematical functions —
**không side effects, không shared state, data flows in → data flows out**.

Giống **máy xay sinh tố**: bỏ trái cây vào (input) → nhận sinh tố ra (output). Máy xay **không
thay đổi trái cây gốc** trên bàn (no mutation), cùng nguyên liệu + cùng cài đặt → **luôn ra
cùng sinh tố** (deterministic), máy xay **không gửi email** khi chạy (no side effects).

**Ba trụ cột**: Pure functions + Immutability + Composition. Nắm 3 cái này = nắm 90% FP interview.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Functional Programming]
        │
        ├── Pure Functions
        │       ├── Same input → same output (deterministic)
        │       ├── No side effects (no I/O, no mutation, no global state)
        │       └── Referential transparency (thay function call bằng kết quả)
        │
        ├── Immutability
        │       ├── Copy, don't corrupt (tạo mới, không sửa gốc)
        │       ├── map/filter/reduce (core operations)
        │       └── Structural sharing (Immer, performance)
        │
        └── Composition
                ├── Higher-Order Functions (HOFs) — nhận/trả function
                ├── compose (phải → trái) vs pipe (trái → phải)
                └── Currying — f(a,b,c) → f(a)(b)(c)
```

---

## Overview / Tổng Quan

| Concept        | Giải quyết vấn đề         | Ví dụ thực tế                     |
| -------------- | ------------------------- | --------------------------------- |
| Pure Functions | Predictable code, dễ test | Redux reducers, React components  |
| Immutability   | O(1) change detection     | React.memo, state updates         |
| Composition    | Tái sử dụng logic         | Middleware chains, data pipelines |

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Pure Functions & Side Effects / Hàm Thuần & Tác Dụng Phụ

> 🧠 **Memory Hook**: "**Công thức nấu ăn**" — 2 trứng + 1 muỗng đường → luôn ra cùng món bánh. Nếu kết quả phụ thuộc "tâm trạng đầu bếp" (global state) hay "thời tiết" (external dependency) — đó không phải công thức đáng tin.

**Tại sao tồn tại?**

Khi codebase lớn, bug khó tìm nhất là bug do **shared mutable state** — function A thay đổi
biến mà function B đang dùng.

→ **Tại sao?** Vì con người không thể track mental model 50+ functions cùng modify 1 object.

→ **Tại sao?** Vì **temporal coupling** (thứ tự gọi hàm ảnh hưởng kết quả) là nguồn gốc của
non-determinism — code không test được, không debug được, không parallelize được.

Pure function loại bỏ temporal coupling: cùng input → cùng output, bất kể gọi lúc nào.

#### Layer 1: Analogy / Liên Tưởng

Hàm thuần giống **công thức nấu ăn**: 2 trứng + 1 muỗng đường → luôn ra cùng món bánh.
Hàm không thuần giống đầu bếp cảm tính — hôm nay 2 trứng ra brownie, mai 2 trứng ra pancake
vì tùy tâm trạng.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
PURE vs IMPURE:

  Pure Function                    Impure Function
  ┌──────────┐                    ┌──────────┐
  │ input ──►│── output           │ input ──►│── output
  │          │                    │    ▲     │     │
  │ KHÔNG    │                    │    │     │     ▼
  │ side     │                    │ global   │  Database
  │ effects  │                    │ state    │  Console
  └──────────┘                    └──────────┘  Network

  Referential Transparency:        Temporal Coupling:
  add(2,3) thay thế bằng          getUser() trả kết quả khác
  5 BẤT CỨ ĐÂU trong code        tùy thuộc KHI NÀO gọi
```

```javascript
// ✅ PURE — same input, same output, no side effects
const add = (a, b) => a + b;
const discount = (price, pct) => price * (1 - pct / 100);
const toUpper = (str) => str.toUpperCase(); // String bất biến

// ❌ IMPURE — phụ thuộc external state
let taxRate = 0.1;
const calcTax = (price) => price * taxRate; // đọc biến ngoài
// calcTax(100) → 10 bây giờ, nhưng nếu taxRate đổi → kết quả khác

// ✅ Fix: inject dependency
const calcTaxPure = (price, rate) => price * rate;
// calcTaxPure(100, 0.1) → LUÔN là 10

// ✅ Redux reducer — ví dụ kinh điển
const balanceReducer = (state = { balance: 0 }, action) => {
  switch (action.type) {
    case "DEPOSIT":
      return { ...state, balance: state.balance + action.amount }; // object MỚI
    case "WITHDRAW":
      return { ...state, balance: state.balance - action.amount };
    default:
      return state; // same reference = no re-render
  }
};

// ❌ WRONG — mutates input → React.memo KHÔNG re-render
const brokenReducer = (state, action) => {
  state.balance += action.amount; // MUTATION!
  return state; // same reference → React nghĩ không thay đổi
};
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Date, Math.random()** inherently impure — inject chúng như parameters để testable
- **100% purity không thực tế** — mọi chương trình cần I/O. Goal: đẩy side effects ra biên (boundaries)
- **Performance**: Tạo object mới mỗi lần có GC cost — nhưng V8 generational GC xử lý short-lived objects hiệu quả

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                                             | Tại sao sai                                 | Đúng là                                       |
| --------------------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| "`Array.sort()` là pure vì return sorted array"     | `sort()` mutates in-place!                  | Dùng `[...arr].sort()` hoặc `arr.toSorted()`  |
| "Pure function = không gọi function khác bên trong" | Pure function CÓ THỂ gọi pure function khác | Pure = no side effects + deterministic output |
| "`toUpperCase()` mutates string"                    | Strings bất biến trong JS                   | `toUpperCase()` IS pure                       |

**🎯 Interview Pattern:**

- **Trigger**: "pure function", "side effects", "referential transparency"
- **Concept**: Công thức nấu ăn — same input, same output
- **Opening**: "A pure function is deterministic and side-effect free — same inputs, same output, no external state changes. This is React's rendering foundation: pure components enable `React.memo` to skip re-renders via shallow comparison."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — pure functions thường dùng closures cho dependency injection
- ➡️ Để hiểu: [React State Management](../03-react/05-state-management.md) — Redux built entirely on pure reducers

---

### 2. Immutability & Array Methods / Tính Bất Biến & Phương Thức Mảng

> 🧠 **Memory Hook**: "**Copy, don't corrupt**" — mọi thay đổi tạo bản mới, bản gốc bất khả xâm phạm. Giống **chỉnh sửa ảnh**: crop ảnh → app tạo bản sao, ảnh gốc nguyên vẹn.

**Tại sao tồn tại?**

Trong UI framework: mutate object → framework không biết có thay đổi (reference giữ nguyên).
React dùng `===` để so sánh → cần object mới để trigger re-render.

→ **Tại sao?** Vì deep comparison (`JSON.stringify`) quá chậm cho 60fps — O(n) mỗi frame vs O(1)
reference check.

→ **Tại sao?** Trade-off cốt lõi: **memory (object mới) vs speed (O(1) comparison)**. Immutability
dùng thêm memory để đổi lấy predictability + tốc độ change detection.

#### Layer 1: Analogy / Liên Tưởng

Chỉnh sửa ảnh trên điện thoại: crop ảnh → app tạo **bản sao mới** — ảnh gốc vẫn nguyên.
Bạn luôn undo được vì bản gốc không bao giờ bị thay đổi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
MUTATING vs IMMUTABLE:

  Mutating (tránh trong FP)          Immutable (FP-safe)
  ─────────────────────────          ────────────────────
  push(x)                    →    [...arr, x]
  pop()                      →    arr.slice(0, -1)
  splice(i, 1)               →    arr.filter((_, idx) => idx !== i)
  sort()                     →    [...arr].sort()  hoặc  arr.toSorted()
  reverse()                  →    arr.toReversed()
  arr[i] = x                 →    arr.with(i, x)

  Object:
  obj.key = val              →    { ...obj, key: val }
  delete obj.key             →    const { key, ...rest } = obj

  Nested update (lý do Immer tồn tại):
  state.user.address.city = 'HCM'
  → { ...state, user: { ...state.user, address: { ...state.user.address, city: 'HCM' } } }
```

```javascript
// ✅ Implement map, filter, reduce từ đầu — classic interview
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this)); // 3 args: element, index, array
  }
  return result; // mảng MỚI, gốc nguyên vẹn
};

Array.prototype.myFilter = function (predicate) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let i = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

// reduce là mạnh nhất — có thể implement cả map và filter:
const mapViaReduce = (arr, fn) => arr.reduce((acc, item, i) => [...acc, fn(item, i)], []);

const filterViaReduce = (arr, pred) =>
  arr.reduce((acc, item, i) => (pred(item, i) ? [...acc, item] : acc), []);
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Shallow copy gotcha**: `{ ...obj }` chỉ copy 1 level — nested objects vẫn share references
- **`Object.freeze()`** cũng shallow — `freeze({ a: { b: 1 } })` vẫn cho phép `obj.a.b = 2`
- **ES2023 immutable arrays**: `toSorted()`, `toReversed()`, `toSpliced()`, `with()` — native immutable versions
- **Performance**: Spread large arrays trong tight loops là O(n) per op. Dùng **structural sharing** (Immer)

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                               | Tại sao sai                                                                     | Đúng là                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| "Spread deep-copy objects"            | Spread là **shallow** — nested objects share references                         | Dùng `structuredClone()` hoặc Immer                            |
| "`const` = immutable"                 | `const` ngăn reassign, KHÔNG ngăn mutation: `const arr = []; arr.push(1)` works | `const` = constant binding, not constant value                 |
| "`Object.freeze()` = fully immutable" | Freeze cũng shallow                                                             | Dùng deep freeze utility hoặc Immer                            |
| "Immutable code luôn chậm hơn"        | V8 optimize short-lived objects tốt; immutability cho O(1) change detection     | Trade-off: allocation cost nhỏ vs optimization opportunity lớn |

**🎯 Interview Pattern:**

- **Trigger**: "immutability", "spread", "implement map/filter/reduce"
- **Concept**: Copy, don't corrupt
- **Opening**: "Immutability means never modifying existing data — create new copies with changes. This is fundamental to React: it enables O(1) change detection via reference equality, critical for 60fps rendering."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [ES6 Spread/Rest](./08-es6-features.md) — syntax cho immutable operations
- ➡️ Để hiểu: [React Performance](../03-react/09-performance-optimization.md) — React.memo relies on immutable updates

---

### 3. Higher-Order Functions, Compose & Pipe / Hàm Bậc Cao, Compose & Pipe

> 🧠 **Memory Hook**: "**Functions = LEGO bricks**" — snap small pure functions together to build complex behavior. Giống **dây chuyền nhà máy**: mỗi trạm làm 1 việc (rửa → cắt → nướng → đóng gói).

**Tại sao tồn tại?**

Khi code lớn, cần cách **tái sử dụng logic** mà không copy-paste. HOFs cho phép truyền
behavior (function) như data.

→ **Tại sao?** Vì function là first-class citizen trong JS — assign, pass, return như bất kỳ value.

→ **Tại sao?** Vì composition (ghép hàm nhỏ → hàm lớn) là cách duy nhất scale code mà **không
tăng complexity** — mỗi hàm nhỏ dễ test, dễ đọc, dễ thay thế.

#### Layer 1: Analogy / Liên Tưởng

Dây chuyền sản xuất nhà máy: mỗi trạm (function) làm 1 việc đơn giản (rửa → cắt → nướng → đóng gói).
Thêm/bớt/thay trạm mà không ảnh hưởng trạm khác. `compose` = nối trạm thành dây chuyền hoàn chỉnh.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Higher-Order Function (HOF):
Function nhận function HOẶC trả function (hoặc cả hai)

  Nhận function:                Trả function:
  ──────────────               ─────────────────
  [1,2,3].map(fn)              const add = (a) => (b) => a + b
  arr.filter(fn)               const withAuth = (fetchFn) => (url) =>
  arr.sort(fn)                   fetchFn(url, { headers: auth })
  setTimeout(fn, ms)

  Compose vs Pipe — hướng khác nhau:
  ──────────────────────────────────────
  compose(f, g, h)(x)  =  f(g(h(x)))     ← phải → trái (toán học)
  pipe(f, g, h)(x)     =  h(g(f(x)))     ← trái → phải (đọc tự nhiên)

  pipe(trim, toLower, slugify)("  Hello World  ")
       │         │         │
       ▼         ▼         ▼
  "Hello World" → "hello world" → "hello-world"
```

```javascript
// ✅ Compose — phải → trái (ký hiệu toán học f∘g)
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// ✅ Pipe — trái → phải (đọc tự nhiên, intuitive hơn)
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

// Real-world: data processing pipeline
const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const slugify = (s) => s.replace(/\s+/g, "-");

const toSlug = pipe(trim, toLower, slugify);
toSlug("  Hello World  "); // → "hello-world"

// ✅ Currying — f(a, b, c) → f(a)(b)(c)
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const multiply = curry((a, b) => a * b);
const double = multiply(2); // partially applied
const triple = multiply(3);
[1, 2, 3].map(double); // [2, 4, 6]

// ✅ Real-world: middleware composition
const withAuth =
  (fetchFn) =>
  (url, opts = {}) =>
    fetchFn(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${getToken()}` } });

const withRetry =
  (fetchFn, maxRetries = 3) =>
  async (url, opts) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fetchFn(url, opts);
      } catch (e) {
        if (i === maxRetries) throw e;
      }
    }
  };

const apiFetch = pipe(withAuth, (fn) => withRetry(fn, 2))(fetch);
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Debugging**: Deep composition khiến stack traces khó đọc — dùng named functions thay vì anonymous arrows
- **TypeScript**: Typing compose/pipe generically rất khó — hầu hết libs cap ở ~10 functions
- **Currying vs partial application**: Curry transform arity từng cái; partial fix một số args cùng lúc. `bind` là partial, không phải currying

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                          | Tại sao sai                                              | Đúng là                                                         |
| -------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| "compose = pipe"                 | compose = phải→trái, pipe = trái→phải                    | `compose(f,g)(x) = f(g(x))` vs `pipe(f,g)(x) = g(f(x))`         |
| "Currying = partial application" | Curry: `f(a,b,c)` → `f(a)(b)(c)`. Partial: fix some args | Curry cụ thể; partial là concept chung                          |
| "HOFs chỉ là map/filter/reduce"  | Bất kỳ function nhận/trả function đều là HOF             | setTimeout, addEventListener, decorators, middleware đều là HOF |

**🎯 Interview Pattern:**

- **Trigger**: "compose", "pipe", "currying", "higher-order functions"
- **Concept**: Functions = LEGO bricks
- **Opening**: "Higher-order functions accept or return functions, enabling composition — building complex behavior from simple, testable pieces. Compose chains right-to-left (math notation), pipe chains left-to-right (reading order). Both implemented with reduce."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — currying/partial application dựa trên closure capture args
- ➡️ Để hiểu: [React Patterns](../03-react/04-advanced-patterns.md) — HOCs, custom hooks are HOF patterns

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: Pure functions và tại sao chúng quan trọng cho React/Redux? 🟢 Junior

**A:** Pure function: (1) same inputs → same output, (2) no side effects.

Cho React: pure components render cùng JSX cho cùng props → `React.memo` skip re-renders. Cho Redux: reducers PHẢI pure — `(state, action) => newState` — vì Redux dùng `===` detect changes. Mutate state gốc → reference giữ nguyên → React không re-render dù data đã đổi.

```javascript
// ❌ Mutate → React dashboard hiển thị số dư cũ
const broken = (state, action) => {
  state.balance += action.amount; // mutates!
  return state; // same reference → no re-render
};

// ✅ Pure → trigger re-render đúng
const correct = (state, action) => ({
  ...state,
  balance: state.balance + action.amount, // new object!
});
```

💡 **Interview Signal:** ✅ Strong: Kết nối purity với React rendering (reference equality) | ❌ Weak: Chỉ define "same input same output"

---

### Q2: Implement `map`, `filter`, `reduce` từ đầu. 🟢 Junior

**A:**

```javascript
Array.prototype.myMap = function (cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(cb(this[i], i, this));
  return result;
};

Array.prototype.myFilter = function (pred) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (pred(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

Array.prototype.myReduce = function (cb, init) {
  let acc = init,
    i = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};

// reduce mạnh nhất — implement cả map và filter:
const map = (arr, fn) => arr.reduce((acc, x, i) => [...acc, fn(x, i)], []);
const filter = (arr, p) => arr.reduce((acc, x, i) => (p(x, i) ? [...acc, x] : acc), []);
```

💡 **Interview Signal:** ✅ Strong: Handle empty array edge case trong reduce, truyền đủ 3 args, show reduce implement map/filter | ❌ Weak: Quên index/array params

---

### Q3: Implement `memoize` function. 🟡 Mid

**A:**

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// LRU variant (giới hạn cache size):
function memoizeLRU(fn, maxSize = 100) {
  const cache = new Map(); // Map giữ insertion order
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key); // xóa
      cache.set(key, value); // insert lại cuối (most recent)
      return value;
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    if (cache.size > maxSize) {
      cache.delete(cache.keys().next().value); // evict LRU
    }
    return result;
  };
}
```

**Caveats**: `JSON.stringify` không handle circular refs, functions, `undefined`. Production dùng custom serializer hoặc WeakMap cho object args.

💡 **Interview Signal:** ✅ Strong: LRU variant, JSON.stringify limitations, kết nối React.useMemo | ❌ Weak: Basic version không cache limit

---

### Q4: Implement `compose` và `pipe`. Khi nào dùng? 🟡 Mid

**A:**

```javascript
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

// Async pipe (handle Promises):
const asyncPipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => Promise.resolve(acc).then(fn), x);

// Verification:
const double = (x) => x * 2;
const inc = (x) => x + 1;
const square = (x) => x * x;

compose(square, inc, double)(3); // square(inc(double(3))) = 49
pipe(double, inc, square)(3); // same: 49
```

**Khi nào dùng**: `pipe` preferred vì đọc trái→phải tự nhiên (RxJS, fp-ts dùng pipe). `compose` cho math notation (Ramda default).

💡 **Interview Signal:** ✅ Strong: Implement cả hai, giải thích reduce vs reduceRight, async variant | ❌ Weak: Chỉ implement một

---

### Q5: `flatMap` vs `map` + `flat` — khi nào dùng? 🟡 Mid

**A:**

```javascript
const sentences = ["hello world", "foo bar"];

// map + flat (2 passes):
sentences.map((s) => s.split(" ")).flat(); // ['hello', 'world', 'foo', 'bar']

// flatMap (1 pass — hiệu quả hơn):
sentences.flatMap((s) => s.split(" ")); // same result

// flatMap trick: filter + map trong 1 pass
const nums = [1, 2, 3, 4, 5];
nums.flatMap((n) => (n % 2 === 0 ? [n * 2] : [])); // [4, 8]
```

**Performance**: flatMap = 1 pass, map+flat = 2 passes + intermediate array. flatMap ~40% faster trên 10K elements.

**Monadic connection**: `Promise.then` thực chất là flatMap — unwrap inner Promise.

💡 **Interview Signal:** ✅ Strong: Monadic connection, filter+map trick, performance numbers | ❌ Weak: Chỉ "flatten after mapping"

---

### Q6: Design data transformation pipeline cho e-commerce product listing. 🔴 Senior

**A:**

```javascript
// Yêu cầu: Raw API data → display-ready products
// Filter inactive, transform prices, sort by relevance, paginate

const processProducts = pipe(
  // 1. Filter: chỉ active products
  (products) => products.filter((p) => p.status === "active"),

  // 2. Transform: format prices, compute discount
  (products) =>
    products.map((p) => ({
      ...p,
      displayPrice: formatCurrency(p.price),
      discount: p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0,
      inStock: p.inventory > 0,
    })),

  // 3. Sort: in-stock first, then by relevance score
  (products) =>
    products.toSorted((a, b) => {
      if (a.inStock !== b.inStock) return b.inStock - a.inStock;
      return b.relevanceScore - a.relevanceScore;
    }),

  // 4. Paginate
  (products) => ({
    items: products.slice(0, PAGE_SIZE),
    total: products.length,
    hasMore: products.length > PAGE_SIZE,
  }),
);

// Mỗi step pure, testable individually
// Pipeline dễ extend: thêm step mới không ảnh hưởng steps khác
```

**Design principles**: (1) Mỗi step pure và testable riêng, (2) `toSorted` immutable, (3) Pipeline dễ extend — thêm/bớt step không ảnh hưởng nhau, (4) Error handling ở boundaries (trước và sau pipeline).

**Follow-up Chain:**

1. "Performance với 100K products?" → Virtualize render, lazy compute. Pipeline itself O(n) cho filter/map/sort.
2. "Error handling trong pipeline?" → Either monad pattern hoặc try/catch wrapper quanh whole pipe.
3. "Memoization?" → Memoize toàn pipeline bằng product list hash.

💡 **Interview Signal:** ✅ Strong: pipe cho readability, mỗi step pure/testable, toSorted immutable | ❌ Weak: Imperative for-loop, mutation

---

### Q7: So sánh FP approach vs OOP approach cho form validation. Khi nào chọn cái nào? 🔴 Senior

**A:**

```javascript
// FP approach: compose validators
const required = (field) => (value) => (value?.trim() ? null : `${field} is required`);

const minLength = (field, min) => (value) =>
  value?.length >= min ? null : `${field} must be at least ${min} chars`;

const email = (field) => (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : `${field} must be a valid email`;

const validate = (validators) => (data) =>
  Object.entries(validators).reduce((errors, [field, rules]) => {
    const fieldErrors = rules.map((rule) => rule(data[field])).filter(Boolean);
    return fieldErrors.length ? { ...errors, [field]: fieldErrors } : errors;
  }, {});

// Usage:
const validateUser = validate({
  name: [required("Name"), minLength("Name", 2)],
  email: [required("Email"), email("Email")],
});

validateUser({ name: "", email: "bad" });
// { name: ['Name is required'], email: ['Email must be a valid email'] }
```

**FP vs OOP trade-off:**
| Aspect | FP Validators | OOP Validators |
|--------|--------------|----------------|
| Composability | Compose bất kỳ validators | Inherit/implement interface |
| Testability | Mỗi validator test riêng biệt | Test class + method cùng lúc |
| Extensibility | Thêm function mới | Thêm class mới |
| State | Stateless, dễ reason about | Stateful, flexible hơn |
| Best for | Validation rules, data transforms | Complex business logic với state |

**Follow-up Chain:**

1. "Async validators?" → Return Promise thay vì string. `validate` dùng `Promise.all` cho parallel.
2. "Conditional validation?" → Higher-order validator: `when(condition, validator)`.
3. "React integration?" → `useForm` hook wrapping `validate` function.

💡 **Interview Signal:** ✅ Strong: Implement composable validators, so sánh tradeoffs cụ thể | ❌ Weak: Chỉ nói "FP tốt hơn" không phân tích

---

## Interview Q&A Summary / Tổng Kết Q&A

| #   | Topic                        | Difficulty | Key Concept                           |
| --- | ---------------------------- | ---------- | ------------------------------------- |
| Q1  | Pure functions + React/Redux | 🟢         | Deterministic, reference equality     |
| Q2  | Implement map/filter/reduce  | 🟢         | New array, 3 args, reduce = universal |
| Q3  | Implement memoize            | 🟡         | Map cache, LRU eviction               |
| Q4  | Compose vs pipe              | 🟡         | reduceRight vs reduce, async          |
| Q5  | flatMap vs map+flat          | 🟡         | Single pass, monadic connection       |
| Q6  | Data pipeline design         | 🔴         | pipe, pure steps, toSorted            |
| Q7  | FP vs OOP validation         | 🔴         | Composable validators, tradeoffs      |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Explain functional programming principles and how they apply to React."**

**30 giây đầu:**

1. "FP centers on three principles: pure functions, immutability, and composition — React is built directly on all three."
2. "Pure functions map to React components: same props → same JSX, enabling React.memo to skip re-renders."
3. "Immutability is why we never mutate state — setState creates new objects so React detects changes with O(1) `===` comparison."
4. "Composition is the component model itself — small focused components combined into complex UIs, like composing pure functions in a pipe."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu. Trả lời từng câu, mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Viết 3 nguyên tắc FP từ trí nhớ — giải thích mỗi cái 1 câu.                                            |
| 2   | 🎨 Visual      | Vẽ diagram `compose(f,g,h)(x)` vs `pipe(f,g,h)(x)` — chỉ hướng data flow.                              |
| 3   | 🛠️ Application | Redux reducer nhận `{ items: [1,2,3] }` + action `ADD_ITEM(4)`. Viết đúng (immutable) và sai (mutate). |
| 4   | 🐛 Debug       | `[3,1,2].sort()` trả về `[1,2,3]` — mảng gốc bây giờ là gì? Fix thế nào?                               |
| 5   | 🎓 Teach       | Giải thích `reduce` cho người chỉ biết vòng `for`.                                                     |

> 🎯 **Feynman Prompt:** Giải thích tại sao React yêu cầu immutable state updates, dùng ví dụ "ảnh và bản sao ảnh". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Review lại sau 3 ngày → 7 ngày → 14 ngày.

---

## 🔗 Connections / Liên Kết

### Cùng track

- [Closures](./04-closures.md) — closures là nền tảng cho HOFs
- [ES6+ Features](./08-es6-features.md) — arrow functions, spread, destructuring cho FP style
- [Advanced Concepts](./10-advanced-concepts.md) — memoization, debounce dùng FP patterns

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Teko — Impure Reducer Caused Non-Deterministic Order Processing

**Situation:** Teko's warehouse management system used Redux for order state. An order sorting reducer mutated the input array using `.sort()` and returned the same reference. The bug was intermittent: sorted order varied based on which browser tab processed first — a race condition visible only in multi-tab scenarios.

**What went wrong:**
```javascript
// Impure reducer — mutates input:
function ordersReducer(state = [], action) {
  switch (action.type) {
    case SORT_ORDERS:
      return state.sort((a, b) => a.priority - b.priority); // ❌ mutates state array
      // sort() returns 'this' — same reference, but sorted
      // Redux devtools replay breaks: replaying action on different state gives different result
      // Multi-tab: two tabs calling sort() simultaneously get different sort outcomes
  }
}
```

**Fix — pure reducer:**
```javascript
case SORT_ORDERS:
  return [...state].sort((a, b) => a.priority - b.priority); // ✅ new array
  // or ES2023:
  return state.toSorted((a, b) => a.priority - b.priority); // ✅ non-mutating
```

**Decision made:** Added Redux `redux-immutable-state-invariant` middleware in development — it deep-freezes state and throws if any reducer mutates it. Zero tolerance for impure reducers enforced by tooling, not code review.

**Trade-off accepted:** `redux-immutable-state-invariant` has significant performance overhead (deep-freeze on every dispatch) — disabled in production. Development-only safety net is acceptable; production uses bundle-split builds without the middleware.

**Lesson:** Pure functions in Redux reducers are not a style preference — they are the correctness invariant that makes time-travel debugging, replay, and multi-tab state sync possible. An impure reducer is a time bomb: it works in happy paths and fails in the exact scenarios where correctness matters most.

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Advanced Patterns](../../be-track/01-golang/08-advanced-patterns.md) — Go's functional approach: higher-order functions, immutability via value semantics, function types as first-class; `map`/`filter` via slice iteration
- 🔗 **FE — React**: [React Hooks](../03-react/03-hooks-deep-dive.md) — hooks are designed around FP: pure functions, no side effects in render, `useReducer` = pure reducer pattern
- 🔗 **FE — State**: [React State Management](../03-react/05-state-management.md) — Redux reducers must be pure functions; Zustand/Jotai use FP-style atoms
- 🔗 **Shared theory**: [Software Engineering Patterns](../../shared/05-software-engineering/01-solid-and-design-patterns.md) — FP patterns (pure functions, immutability, composition) vs OOP patterns; when to choose each
