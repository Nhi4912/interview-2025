# Functional Programming in JavaScript / Lập Trình Hàm trong JavaScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures-comprehensive.md) | [ES6 Features](./07-es6-features.md)
> **See also**: [Advanced Patterns](./17-advanced-patterns-theory.md) | [React Fundamentals](../03-react/01-react-fundamentals.md)

[← Previous: ES6 Features Deep](./11-es6-features-deep.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →: JS Basics Theory](./13-javascript-basics-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: Team React của bạn tại một fintech startup gặp bug nghiêm trọng — Redux reducer
> mutate state trực tiếp thay vì tạo bản sao mới. Kết quả: `React.memo` không re-render vì
> reference equality vẫn giữ nguyên, dashboard hiển thị số dư cũ cho 2,000 user trong 3 giờ.
>
> Post-mortem xác định: developer viết `state.balance += amount` thay vì
> `{ ...state, balance: state.balance + amount }`. Đây là lỗi **impure function** — vi phạm
> nguyên tắc cốt lõi nhất của FP: **không bao giờ mutate input**.
>
> **Tại sao FP quan trọng cho interview?** React, Redux, RxJS — toàn bộ ecosystem frontend
> hiện đại đều xây trên nền FP. Hiểu FP = hiểu *tại sao* React hoạt động như vậy.

---

## What & Why / Cái Gì & Tại Sao 🤔

**Functional Programming** là paradigm lập trình xử lý computation như evaluation of mathematical
functions — **không side effects, không shared state, data flows in → data flows out**.

**Tương tự đời thường**: Hãy nghĩ về một **máy xay sinh tố**:
- Bỏ trái cây vào (input) → nhận sinh tố ra (output)
- Máy xay **không thay đổi trái cây gốc** trên bàn (no mutation)
- Cùng trái cây + cùng cài đặt → **luôn ra cùng sinh tố** (deterministic)
- Máy xay **không gửi email** hay **thay đổi nhiệt độ phòng** khi chạy (no side effects)

**Ba trụ cột**: Pure functions + Immutability + Composition. Nắm 3 cái này = nắm 90% FP interview.

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Pure Functions & Side Effects / Hàm Thuần & Tác Dụng Phụ

> 🧠 **Memory Hook**: **"SEAMLESS"** — **S**ame input → **E**xact same output, **A**lways, with **M**ost **L**imited **E**ffects (zero **S**ide effect**S**)

**Tại sao tồn tại? / Why does this exist?**

Khi codebase lớn lên, bug khó tìm nhất là bug do **shared mutable state** — function A thay đổi
biến mà function B đang dùng, và bug chỉ xảy ra khi A chạy trước B.

→ **Why?** Vì con người không thể track mental model của 50+ functions cùng modify 1 object.

→ **Why?** Vì **temporal coupling** (thứ tự gọi hàm ảnh hưởng kết quả) là nguồn gốc của
non-determinism — khiến code không test được, không debug được, không parallelize được.

**Pure function giải quyết bằng cách loại bỏ hoàn toàn temporal coupling**: cùng input → cùng output, bất kể gọi lúc nào, bao nhiêu lần.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hàm thuần giống **công thức nấu ăn**: 2 trứng + 1 muỗng đường → luôn ra cùng món bánh.
Nếu kết quả phụ thuộc vào "tâm trạng đầu bếp" (global state) hay "thời tiết hôm nay"
(external dependency) — đó không phải công thức đáng tin.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
PURE vs IMPURE — Mental Model:

  Pure Function                    Impure Function
  ┌──────────┐                    ┌──────────┐
  │ input ──►│── output           │ input ──►│── output
  │          │                    │    ▲     │     │
  │ NO side  │                    │    │     │     ▼
  │ effects  │                    │ global   │  Database
  └──────────┘                    │ state    │  Console
                                  └──────────┘  Network

  Referential Transparency:        Temporal Coupling:
  add(2,3) can be replaced         getUser() returns different
  with 5 ANYWHERE in code          results depending on WHEN called
```

```javascript
// ✅ PURE — same input, same output, no side effects
const add = (a, b) => a + b;
const discount = (price, pct) => price * (1 - pct / 100);
const toUpper = (str) => str.toUpperCase(); // String is immutable

// ❌ IMPURE — depends on external state
let taxRate = 0.1;
const calcTax = (price) => price * taxRate; // reads external variable
// calcTax(100) → 10 now, but if taxRate changes → different result

// ❌ IMPURE — side effects
const logAndAdd = (a, b) => {
  console.log(a, b);  // side effect: I/O
  return a + b;
};

// ✅ Making impure → pure: inject dependencies
const calcTaxPure = (price, rate) => price * rate;
// Now calcTaxPure(100, 0.1) → ALWAYS 10
```

**Redux reducer — the canonical FP example:**

```javascript
// ✅ Pure reducer — React/Redux depends on this
const balanceReducer = (state = { balance: 0 }, action) => {
  switch (action.type) {
    case 'DEPOSIT':
      return { ...state, balance: state.balance + action.amount }; // new object!
    case 'WITHDRAW':
      return { ...state, balance: state.balance - action.amount };
    default:
      return state; // same reference = no re-render
  }
};

// ❌ WRONG — mutates input, breaks React.memo / shallow comparison
const brokenReducer = (state, action) => {
  state.balance += action.amount; // MUTATION!
  return state; // same reference → React thinks nothing changed
};
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Date, Math.random()** are inherently impure — inject them as parameters for testability
- **Performance**: Creating new objects every time has GC cost — but V8's generational GC handles short-lived objects efficiently
- **100% purity is impractical** — all useful programs have I/O. Goal: push side effects to the edges (boundaries) of your program

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "`Array.sort()` is pure because it returns a sorted array" | `sort()` mutates the original array in-place | Use `[...arr].sort()` or `Array.from(arr).sort()` |
| "Pure function = no function calls inside" | Pure functions CAN call other pure functions | Pure = no side effects + deterministic output |
| "`toUpperCase()` mutates the string" | Strings are immutable in JS — always returns new string | `toUpperCase()` IS pure |
| "If it returns `void`, it must be impure" | `void` doesn't exist in FP mental model — but `() => undefined` with no side effects is still pure | Focus on side effects, not return type |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "pure function", "side effects", "referential transparency"
- → Nhớ đến: SEAMLESS — Same input, Exact same output, no side effects
- → Mở đầu trả lời: "A pure function is deterministic and side-effect free — given the same inputs, it always returns the same output without modifying any external state. This is the foundation of React's rendering model, where pure components enable predictable UI updates."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — pure functions often use closures for dependency injection
- ➡️ Để hiểu: [React State Management](../03-react/05-state-management.md) — Redux is built entirely on pure reducer functions

---

### 2. Immutability & Array Methods / Tính Bất Biến & Phương Thức Mảng

> 🧠 **Memory Hook**: **"Copy, don't corrupt"** — Mọi thay đổi tạo bản mới, bản gốc bất khả xâm phạm

**Tại sao tồn tại? / Why does this exist?**

Trong UI framework: nếu bạn mutate object, framework không biết có gì thay đổi (vì reference giống nhau). React dùng `===` để so sánh → cần object mới để trigger re-render.

→ **Why?** Vì deep comparison (`JSON.stringify` hoặc recursive check) quá chậm cho 60fps rendering — `O(n)` mỗi frame vs `O(1)` reference check.

→ **Why?** Vì đây là trade-off cốt lõi: **memory (tạo object mới) vs speed (O(1) comparison)**. Immutability chọn dùng thêm memory để đổi lấy predictability + speed of change detection.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy nghĩ immutability như **chỉnh sửa ảnh trên điện thoại**: khi bạn crop ảnh, app tạo **bản sao mới** — ảnh gốc vẫn nguyên trong thư viện. Bạn luôn có thể undo vì bản gốc không bao giờ bị thay đổi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
MUTATING vs IMMUTABLE Array Operations:

  Mutating (avoid in FP)          Immutable (FP-safe)
  ─────────────────────           ────────────────────
  push(x)                    →    [...arr, x]
  pop()                      →    arr.slice(0, -1)
  splice(i, 1)               →    arr.filter((_, idx) => idx !== i)
  sort()                     →    [...arr].sort()
  reverse()                  →    [...arr].reverse()
  arr[i] = x                 →    arr.map((v, idx) => idx === i ? x : v)

  Object mutation:                Object immutable:
  obj.key = val              →    { ...obj, key: val }
  delete obj.key             →    const { key, ...rest } = obj

  Nested update:
  state.user.address.city = 'HCM'
  →  { ...state, user: { ...state.user, address: { ...state.user.address, city: 'HCM' } } }
  (This is why Immer exists!)
```

**Implement map, filter, reduce from scratch** — classic interview question:

```javascript
// ✅ Array.prototype.map — transform each element
Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }
  return result; // NEW array, original untouched
};

// ✅ Array.prototype.filter — keep elements that pass test
Array.prototype.myFilter = function(predicate) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (predicate(this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// ✅ Array.prototype.reduce — fold array into single value
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    accumulator = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};

// Reduce is the most powerful — map and filter can be built from reduce:
const mapViaReduce = (arr, fn) =>
  arr.reduce((acc, item, i) => [...acc, fn(item, i)], []);

const filterViaReduce = (arr, pred) =>
  arr.reduce((acc, item, i) => pred(item, i) ? [...acc, item] : acc, []);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Shallow copy gotcha**: `{ ...obj }` and `[...arr]` only copy 1 level deep — nested objects still share references
- **Performance**: Spreading large arrays in tight loops is `O(n)` per operation. For heavy state, use **structural sharing** (Immer, Immutable.js)
- **`Object.freeze()`** is shallow — `Object.freeze({ a: { b: 1 } })` still allows `obj.a.b = 2`
- **ES2024 change array by copy**: `toSorted()`, `toReversed()`, `toSpliced()`, `with()` — immutable versions built into the language

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Spread operator deep-copies objects" | Spread is **shallow** — nested objects still share references | Use `structuredClone()` or Immer for deep updates |
| "`const` makes values immutable" | `const` prevents reassignment, NOT mutation: `const arr = []; arr.push(1)` works | `const` = constant binding, not constant value |
| "`Object.freeze()` makes everything immutable" | Freeze is **shallow** — nested objects are still mutable | Use `structuredClone()` + freeze, or deep freeze utility |
| "Immutable code is always slower" | V8 optimizes short-lived objects well; immutability enables `O(1)` change detection | Trade-off: slight allocation cost vs massive optimization opportunity |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "immutability", "spread operator", "implement map/filter/reduce"
- → Nhớ đến: "Copy, don't corrupt" — tạo mới, không sửa gốc
- → Mở đầu trả lời: "Immutability means never modifying existing data — instead, we create new copies with changes applied. This is fundamental to React's reconciliation because it enables O(1) change detection via reference equality, which is critical for 60fps rendering performance."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [ES6 Spread/Rest](./07-es6-features.md) — syntax cho immutable operations
- ➡️ Để hiểu: [React Performance](../06-browser-performance/02-react-performance.md) — React.memo relies on immutable state updates

---

### 3. Higher-Order Functions, Compose & Pipe / Hàm Bậc Cao, Compose & Pipe

> 🧠 **Memory Hook**: **"Functions are LEGO bricks"** — snap small pure functions together to build complex behavior

**Tại sao tồn tại? / Why does this exist?**

Khi code lớn, bạn cần cách **tái sử dụng logic** mà không copy-paste. HOFs cho phép truyền
behavior (function) như data — thay vì viết 10 hàm sort khác nhau, viết 1 hàm sort + truyền comparator.

→ **Why?** Vì function là first-class citizen trong JS — có thể assign, pass, return như bất kỳ value nào.

→ **Why?** Vì composition (ghép hàm nhỏ thành hàm lớn) là cách duy nhất để scale code mà **không tăng complexity** — mỗi hàm nhỏ dễ test, dễ đọc, dễ thay thế.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

HOF giống **dây chuyền sản xuất trong nhà máy**: mỗi trạm (function) làm một việc đơn giản
(rửa → cắt → nướng → đóng gói). Bạn có thể thêm/bớt/thay trạm mà không ảnh hưởng trạm khác.
`compose` = nối các trạm lại thành dây chuyền hoàn chỉnh.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Higher-Order Function (HOF):
A function that takes a function OR returns a function (or both)

  Takes function:              Returns function:
  ──────────────               ─────────────────
  [1,2,3].map(fn)              const add = (a) => (b) => a + b
  arr.filter(fn)               const withLogging = (fn) => (...args) => {
  arr.sort(fn)                   console.log('calling', fn.name)
  setTimeout(fn, ms)             return fn(...args)
                                }

  Compose vs Pipe — direction matters:
  ──────────────────────────────────────
  compose(f, g, h)(x)  =  f(g(h(x)))     ← right to left (math order)
  pipe(f, g, h)(x)     =  h(g(f(x)))     ← left to right (reading order)

  Data flow visualization:

  pipe(trim, toLower, slugify)("  Hello World  ")
       │         │         │
       ▼         ▼         ▼
  "Hello World" → "hello world" → "hello-world"
```

```javascript
// ✅ Compose — right to left (mathematical notation f∘g)
const compose = (...fns) =>
  (x) => fns.reduceRight((acc, fn) => fn(acc), x);

// ✅ Pipe — left to right (reading order, more intuitive)
const pipe = (...fns) =>
  (x) => fns.reduce((acc, fn) => fn(acc), x);

// Real-world: data processing pipeline
const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const slugify = (s) => s.replace(/\s+/g, '-');

const toSlug = pipe(trim, toLower, slugify);
toSlug('  Hello World  '); // → "hello-world"

// ✅ Currying — transform f(a, b, c) into f(a)(b)(c)
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);     // 6
add(1, 2)(3);     // 6 — partial application
add(1)(2, 3);     // 6

// ✅ Practical currying: reusable specialized functions
const multiply = curry((a, b) => a * b);
const double = multiply(2);    // partially applied
const triple = multiply(3);
[1, 2, 3].map(double);        // [2, 4, 6]
[1, 2, 3].map(triple);        // [3, 6, 9]

// ✅ Real-world compose: React middleware-style
const withAuth = (fetchFn) => (url, opts = {}) =>
  fetchFn(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${getToken()}` } });

const withRetry = (fetchFn, maxRetries = 3) => async (url, opts) => {
  for (let i = 0; i <= maxRetries; i++) {
    try { return await fetchFn(url, opts); }
    catch (e) { if (i === maxRetries) throw e; }
  }
};

const apiFetch = pipe(withAuth, (fn) => withRetry(fn, 2))(fetch);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Debugging**: Deep composition makes stack traces hard to read — use named functions instead of anonymous arrows
- **TypeScript**: Typing compose/pipe generically is notoriously difficult — most libraries cap at ~10 functions
- **Over-composition**: `compose(f)` is just `f` — don't compose single functions for "purity"
- **Currying vs partial application**: Currying transforms arity one at a time; partial application fixes some args at once. `bind` does partial application, not currying

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "compose and pipe are the same" | compose = right-to-left, pipe = left-to-right — args reversed | `compose(f,g)(x) = f(g(x))` vs `pipe(f,g)(x) = g(f(x))` |
| "Currying = partial application" | Currying: `f(a,b,c)` → `f(a)(b)(c)`. Partial: fix some args, e.g., `f.bind(null, 1)` | Currying is a specific technique; partial application is the general concept |
| "HOFs are only `map`/`filter`/`reduce`" | Any function taking or returning a function is HOF — `setTimeout`, `addEventListener`, decorators, middleware | HOF is the pattern, array methods are just common examples |
| "Point-free style is always better" | `compose(map(toLower), filter(isActive))` can be less readable than explicit version | Use point-free when it aids clarity, explicit when it doesn't |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "compose", "pipe", "currying", "higher-order functions", "implement X"
- → Nhớ đến: Functions are LEGO bricks — snap together small pure functions
- → Mở đầu trả lời: "Higher-order functions accept or return functions, enabling composition — building complex behavior from simple, testable pieces. Compose chains functions right-to-left (math notation), while pipe chains left-to-right (reading order). Both are implemented with reduce over the function array."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — currying and partial application rely on closures to capture arguments
- ➡️ Để hiểu: [React Advanced Patterns](../03-react/04-advanced-patterns.md) — HOCs, render props, and custom hooks are all HOF patterns

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: Explain pure functions and why they matter for React/Redux. / Giải thích hàm thuần và tại sao chúng quan trọng cho React/Redux. 🟡 Mid

**A:** A pure function has two properties: (1) given the same inputs, it always returns the same output (deterministic), and (2) it produces no side effects — no mutations, no I/O, no external state changes.

For React: pure components render the same JSX for the same props, enabling `React.memo` to skip re-renders via shallow comparison. For Redux: reducers MUST be pure — `(state, action) => newState` — because Redux uses reference equality (`===`) to detect changes. If you mutate the existing state object instead of returning a new one, the reference stays the same and React won't re-render, even though the data changed.

```javascript
// ❌ Impure reducer — React dashboard shows stale balance
const broken = (state, action) => {
  state.balance += action.amount; // mutates!
  return state; // same reference → no re-render
};

// ✅ Pure reducer — triggers proper re-render
const correct = (state, action) => ({
  ...state,
  balance: state.balance + action.amount // new object!
});
```

Giải thích tiếng Việt: Hàm thuần là hàm mà cùng input luôn cho cùng output, không có side effect. Trong React, điều này cho phép `React.memo` bỏ qua re-render thông qua so sánh nông. Trong Redux, reducer PHẢI thuần — nếu mutate state gốc, reference giữ nguyên → React không biết có thay đổi → UI hiển thị dữ liệu cũ.

**💡 Interview Signal:**
- ✅ Strong: Connects purity to React's rendering model (reference equality, `===` check), gives mutation bug example
- ❌ Weak: Only defines "same input same output" without connecting to real framework behavior

---

### Q2: Implement `map`, `filter`, and `reduce` from scratch. / Implement `map`, `filter`, và `reduce` từ đầu. 🟡 Mid

**A:** These three are the workhorses of functional programming in JavaScript. Each takes a callback and returns a new value without mutating the original array.

```javascript
// map: transform each element
Array.prototype.myMap = function(cb) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(cb(this[i], i, this));
  }
  return result;
};

// filter: keep elements passing the predicate
Array.prototype.myFilter = function(pred) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (pred(this[i], i, this)) result.push(this[i]);
  }
  return result;
};

// reduce: fold into a single value
Array.prototype.myReduce = function(cb, init) {
  let acc = init;
  let i = 0;
  if (acc === undefined) {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[0];
    i = 1;
  }
  for (; i < this.length; i++) {
    acc = cb(acc, this[i], i, this);
  }
  return acc;
};
```

**Key interview point**: `reduce` is the most powerful — you can implement both `map` and `filter` using `reduce`:

```javascript
const map = (arr, fn) => arr.reduce((acc, x, i) => [...acc, fn(x, i)], []);
const filter = (arr, p) => arr.reduce((acc, x, i) => p(x, i) ? [...acc, x] : acc, []);
```

Giải thích tiếng Việt: `map` biến đổi từng phần tử, `filter` giữ lại phần tử thỏa điều kiện, `reduce` gộp mảng thành 1 giá trị. Cả 3 đều tạo giá trị mới, không mutate mảng gốc. `reduce` mạnh nhất — có thể dùng nó implement cả `map` và `filter`. Khi implement từ đầu, nhớ truyền đủ 3 tham số cho callback (`element`, `index`, `array`) và handle edge case `reduce` không có initial value.

**💡 Interview Signal:**
- ✅ Strong: Handles edge case (empty array with no initial value), passes all 3 callback arguments, shows reduce implementing map/filter
- ❌ Weak: Forgets `index` and `array` parameters, doesn't handle empty array edge case in reduce

---

### Q3: Implement a `memoize` function. / Implement hàm `memoize`. 🟡 Mid

**A:** Memoize caches function results by arguments, returning the cached value for repeated calls with the same inputs. This is the technique behind `React.useMemo` and `reselect`.

```javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const expensiveCalc = memoize((n) => {
  console.log('computing...');
  return n * n;
});

expensiveCalc(5); // logs "computing...", returns 25
expensiveCalc(5); // returns 25 (cached, no log)
```

**Follow-up: handle cache size limit (LRU):**

```javascript
function memoizeLRU(fn, maxSize = 100) {
  const cache = new Map(); // Map preserves insertion order

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);    // remove
      cache.set(key, value); // re-insert at end (most recent)
      return value;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    if (cache.size > maxSize) {
      const oldest = cache.keys().next().value;
      cache.delete(oldest); // evict least recently used
    }

    return result;
  };
}
```

**Caveats**: `JSON.stringify` doesn't handle circular references, functions, or `undefined` values. For production, use a WeakMap for object arguments or a custom serializer.

Giải thích tiếng Việt: `memoize` cache kết quả hàm theo tham số — lần gọi tiếp theo với cùng args sẽ trả kết quả ngay từ cache thay vì tính lại. Đây là kỹ thuật đằng sau `useMemo` và `reselect`. Dùng `Map` để lưu cache, `JSON.stringify(args)` làm key. Phiên bản nâng cao thêm LRU eviction để giới hạn bộ nhớ — `Map` giữ thứ tự insertion, nên xóa key đầu tiên = xóa entry cũ nhất.

**💡 Interview Signal:**
- ✅ Strong: Shows LRU variant, mentions `JSON.stringify` limitations, connects to React.useMemo
- ❌ Weak: Only shows basic version without discussing cache invalidation or memory concerns

---

### Q4: Implement `compose` and `pipe`. Explain when to use each. / Implement `compose` và `pipe`. Giải thích khi nào dùng. 🔴 Senior

**A:**

```javascript
// compose: right-to-left execution (mathematical notation f∘g)
const compose = (...fns) =>
  (x) => fns.reduceRight((acc, fn) => fn(acc), x);

// pipe: left-to-right execution (reading order)
const pipe = (...fns) =>
  (x) => fns.reduce((acc, fn) => fn(acc), x);

// Verification:
const double = x => x * 2;
const inc = x => x + 1;
const square = x => x * x;

compose(square, inc, double)(3); // square(inc(double(3))) = square(inc(6)) = square(7) = 49
pipe(double, inc, square)(3);    // square(inc(double(3))) = same: 49
```

**Async pipe (handles Promises in the chain):**

```javascript
const asyncPipe = (...fns) =>
  (x) => fns.reduce((acc, fn) => Promise.resolve(acc).then(fn), x);

// Usage: data processing pipeline
const fetchUser = async (id) => { /* ... */ };
const extractEmail = (user) => user.email;
const normalize = (email) => email.toLowerCase().trim();
const validate = (email) => {
  if (!email.includes('@')) throw new Error('Invalid email');
  return email;
};

const getUserEmail = asyncPipe(fetchUser, extractEmail, normalize, validate);
await getUserEmail(123); // → "user@example.com"
```

**When to use which:**
- **`pipe`** — most teams prefer this because it reads left-to-right, matching natural reading order. Used in RxJS (`pipe` operator), fp-ts, and most FP utilities.
- **`compose`** — matches mathematical notation (`f∘g`). Used when you want to read the transformation "outside-in" like nested function calls. Ramda uses `compose` as default.
- **Rule of thumb**: if your team reads code left-to-right (most do), use `pipe`.

Giải thích tiếng Việt: `compose` chạy phải→trái (theo ký hiệu toán học f∘g), `pipe` chạy trái→phải (theo thứ tự đọc tự nhiên). Cả hai implement bằng `reduce` / `reduceRight` trên mảng functions. Phần lớn team dùng `pipe` vì đọc tự nhiên hơn. Phiên bản async wrap mỗi bước trong `Promise.resolve().then()` để handle cả sync lẫn async functions.

**💡 Interview Signal:**
- ✅ Strong: Implements both, explains `reduce` vs `reduceRight`, shows async variant, gives team preference reasoning
- ❌ Weak: Only implements one, can't explain the direction difference, forgets async consideration

---

### Q5: Compare `flatMap` vs `map` + `flat`. When would you choose each, and what are the performance implications? / So sánh `flatMap` vs `map` + `flat`. Khi nào chọn cái nào? 🔴 Senior

**A:** Both flatten one level after mapping, but they differ in performance and semantics.

```javascript
const sentences = ['hello world', 'foo bar'];

// map + flat (two passes)
sentences.map(s => s.split(' ')).flat();
// → ['hello', 'world', 'foo', 'bar']

// flatMap (single pass — more efficient)
sentences.flatMap(s => s.split(' '));
// → ['hello', 'world', 'foo', 'bar']

// flatMap can also REMOVE items (return empty array to filter)
const nums = [1, 2, 3, 4, 5];
nums.flatMap(n => n % 2 === 0 ? [n * 2] : []);
// → [4, 8] — filter + map in one pass!
```

**Performance analysis:**

```
map + flat:
  Pass 1 (map):  O(n) — creates intermediate array of arrays
  Pass 2 (flat): O(n) — iterates again to flatten
  Total: 2 passes + intermediate array allocation

flatMap:
  Single pass:   O(n) — maps and flattens in one iteration
  Total: 1 pass, no intermediate array

  Benchmark (10K elements):
  map+flat:  ~0.8ms
  flatMap:   ~0.5ms  (≈40% faster)
```

**When to choose:**
- **`flatMap`**: When mapping 1-to-many (split words, expand ranges) or filter+map in one pass. Preferred for hot paths.
- **`map` + `flat`**: When you need `flat(depth > 1)` — `flatMap` only flattens 1 level. Or when the mapping and flattening logic are conceptually separate.
- **Monadic flatMap**: In FP theory, `flatMap` (aka `bind`/`chain`) is the fundamental operation for chaining computations that produce wrapped values (Array, Promise, Optional). This is why `Promise.then` is essentially `flatMap` — it unwraps the inner Promise.

```javascript
// Promise.then IS flatMap:
Promise.resolve(1)
  .then(x => Promise.resolve(x + 1))  // flatMap: unwraps inner Promise
  .then(x => x + 1);                   // map: doesn't wrap
// → Promise(3)
```

Giải thích tiếng Việt: `flatMap` = `map` + `flat(1)` trong một bước duy nhất, hiệu quả hơn vì chỉ duyệt 1 lần thay vì 2. Có thể dùng `flatMap` để filter+map cùng lúc (trả `[]` để loại bỏ, trả `[value]` để giữ). Trong lý thuyết FP, `flatMap` (hay `bind`/`chain`) là phép toán cơ bản để nối các computation tạo ra wrapped values — `Promise.then` thực chất chính là `flatMap`.

**💡 Interview Signal:**
- ✅ Strong: Explains monadic connection (Promise.then = flatMap), shows filter+map trick, gives performance numbers
- ❌ Weak: Only says "it flattens after mapping" without performance analysis or monadic connection

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | Pure functions + React/Redux | 🟡 Mid | Deterministic, no side effects, reference equality |
| Q2 | Implement map/filter/reduce | 🟡 Mid | New array, 3 callback args, reduce = universal |
| Q3 | Implement memoize | 🟡 Mid | Map cache, JSON.stringify key, LRU eviction |
| Q4 | Compose vs pipe | 🔴 Senior | reduceRight vs reduce, async variant |
| Q5 | flatMap vs map+flat | 🔴 Senior | Single pass, filter+map trick, monadic connection |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Explain functional programming principles and how they apply to React."**

**30 giây đầu — mở đầu lý tưởng:**
1. "Functional programming centers on three principles: pure functions, immutability, and composition — and React is built directly on all three."
2. "Pure functions map to React components: same props → same JSX, enabling React.memo to skip re-renders via reference equality checks."
3. "Immutability is why we never mutate state directly — `setState` creates a new state object so React can detect changes with an O(1) `===` comparison instead of expensive deep diffs."
4. "Composition is the component model itself — small, focused components combined into complex UIs, just like composing pure functions in a pipe."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết 3 nguyên tắc cốt lõi của FP từ trí nhớ — giải thích mỗi cái bằng 1 câu.
- [ ] **Visual**: Vẽ diagram `compose(f, g, h)(x)` vs `pipe(f, g, h)(x)` — chỉ rõ hướng data flow.
- [ ] **Application**: Redux reducer nhận `state = { items: [1,2,3] }` và action `ADD_ITEM(4)`. Viết reducer đúng (immutable) và sai (mutate). Giải thích tại sao sai gây bug UI.
- [ ] **Debug**: `[3,1,2].sort()` trả về `[1,2,3]` — nhưng mảng gốc bây giờ là gì? Tại sao? Fix thế nào?
- [ ] **Teach**: Giải thích `reduce` cho người chỉ biết vòng `for` — dùng ví dụ tính tổng mảng.

💬 **Feynman Prompt:** Giải thích tại sao React yêu cầu immutable state updates, dùng ví dụ "ảnh và bản sao ảnh". Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.
