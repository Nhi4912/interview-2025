# Modern JavaScript Features (ES2020-2024) - Theory / Tính Năng JavaScript Hiện Đại - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**Tiki product page data handling:** API returns a product object where some fields may be `null`, `undefined`, `0`, or `""` depending on the catalog. Before ES2020: `const price = product.price || 99000` silently replaced `0` (free product) with `99000`. After ES2020: `const price = product.price ?? 99000` correctly keeps `0` as-is. Optional chaining: `product?.variants?.[0]?.price ?? 0` safely navigates nested nullable objects without try/catch. `Promise.allSettled` loads price + stock + reviews in parallel — even if stock API fails, price and reviews still display.

**Bài học:** ES2020-2024 features aren't syntax sugar — they fix real bugs (`||` vs `??`) and enable patterns that were previously verbose or error-prone. Knowing why each feature was introduced (what problem it solves) is the key to answering "when would you use X?" in interviews.

## What & Why / Cái Gì & Tại Sao

**The naming trick:** ES years track when TC39 finalized the spec:

- **ES2020 (ES11):** `??`, `?.`, `BigInt`, `Promise.allSettled`, dynamic `import()`, `globalThis`
- **ES2021 (ES12):** `replaceAll`, `Promise.any`, logical assignment (`&&=`, `||=`, `??=`), numeric separators
- **ES2022 (ES13):** Top-level `await`, class fields (`#private`), `Array.at()`, `Object.hasOwn`, `Error.cause`
- **ES2023 (ES14):** `Array.findLast`, `toSorted`/`toReversed`/`toSpliced`/`with` (immutable array), hashbang
- **ES2024 (ES15):** `Promise.withResolvers`, `Object.groupBy`, `ArrayBuffer.resize`, RegExp `/v` flag

## Concept Map / Bản Đồ Khái Niệm

```
[Modern JS: Interview-Critical Features]
        │
        ├── Null Safety (ES2020)
        │       ├── ??  — nullish coalescing: default only for null/undefined (not 0/''/false)
        │       └── ?.  — optional chaining: short-circuit on null/undefined in chain
        │
        ├── Promise Combinators
        │       ├── Promise.all     — all must succeed; first rejection rejects all
        │       ├── Promise.allSettled — wait for all, get all results (even failures)  ← ES2020
        │       ├── Promise.any     — first success wins; fails only if ALL fail  ← ES2021
        │       └── Promise.withResolvers — expose resolve/reject outside Promise body  ← ES2024
        │
        ├── Immutable Array Methods (ES2023)
        │       ├── toSorted()  — returns new sorted array (vs sort() mutates)
        │       ├── toReversed() — returns new reversed array (vs reverse() mutates)
        │       ├── toSpliced() — returns new array with spliced result (vs splice() mutates)
        │       └── with(index, value) — returns new array with one item replaced
        │
        └── Class Features (ES2022)
                ├── Private fields: #name (truly private, not just convention)
                ├── Static fields: static count = 0
                └── Top-level await (modules only)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. `??` and `?.` — Null Safety Operators

**🧠 Memory Hook:** "**`??` = null/undefined only (NOT 0, '', false). `?.` = stop the chain and return undefined if null/undefined at any step.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is `||` insufficient for default values? Because `||` checks for any falsy value — `0`, `''`, `false` are all falsy. `0 || 99` returns `99`, silently masking a valid zero. `??` only triggers on `null` or `undefined` — the actual "missing value" signals
- Why is `?.` safer than manual null checks? Because `user && user.profile && user.profile.address && user.profile.address.city` is error-prone boilerplate. `user?.profile?.address?.city` does the same thing, returns `undefined` at the first null link
- Why was this introduced in ES2020? TypeScript had non-null assertion (`!`) for 5 years, and codebases were littered with verbose null guards. These operators were the TC39 response to the most common JS runtime error: "Cannot read property X of null/undefined"

**Visual — `??` vs `||` Bug:**

```javascript
// Real-world bug: user has 0 items in cart
const cart = { count: 0 };

// ❌ Bug with ||
const count = cart.count || 10; // → 10! (0 is falsy, fell through to default)

// ✅ Fix with ??
const count = cart.count ?? 10; // → 0 (only null/undefined trigger default)

// Optional chaining — safe deep access:
const city = user?.address?.city; // undefined if any step is null/undefined
const first = arr?.[0]; // undefined if arr is null/undefined
const result = obj?.method?.(); // undefined if method doesn't exist

// Combining:
const displayName = user?.profile?.name ?? "Anonymous";
// ← if user or profile or name is null/undefined, use 'Anonymous'
// ← but '' (empty string) stays as '' (not replaced by 'Anonymous')

// Logical assignment (ES2021):
user.name ??= "Anonymous"; // assign only if user.name is null/undefined
count ||= 0; // assign only if count is falsy
flag &&= validate(flag); // assign only if flag is truthy
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `value \|\| defaultVal` when `0` or `''` are valid values | `||` triggers on any falsy value — `0`, `''`, `false` also get replaced by the default | `value ?? defaultVal` — only replaces `null`/`undefined` |
| `obj && obj.prop && obj.prop.child` | Verbose manual null-guarding — error-prone and hard to read | `obj?.prop?.child` — cleaner, same semantics |
| `?.` on non-nullable known values: `user?.id` when user is always defined | Overuse obscures bugs — silent `undefined` instead of a helpful TypeError | Only use `?.` at genuinely nullable points |
| `user?.name ?? ''` when you want error on missing user | Silent `undefined` propagation hides the real bug — missing user should throw | `user.name ?? ''` — let null user throw, don't silently swallow the bug |

**🎯 Interview Pattern:**

- **Trigger**: "null check" / "default values" / "optional properties" / "cannot read property of null"
- **Concept**: `??` = null/undefined only; `?.` = safe chain traversal
- **Opening**: "The key distinction is that `||` checks for any falsy value — which includes `0`, empty string, and `false`. For default values where those are valid, `??` is correct because it only triggers on `null` or `undefined`. Combined with optional chaining `?.`, you get safe deep access without verbose null guards..."

**🔑 Knowledge Chain:**

- **Prereq**: Truthy/falsy values (see `13-javascript-basics-theory.md`)
- **Enables**: Clean data access patterns, safer API response handling, React prop defaults

---

### 2. Promise Combinators — `all` vs `allSettled` vs `any`

**🧠 Memory Hook:** "**`all` = all must succeed (fail-fast). `allSettled` = wait for all, collect all outcomes. `any` = first success wins (fail-slow).**"

**Why does this exist? / Tại sao tồn tại?**

- Why isn't `Promise.all` enough? Because `Promise.all` rejects immediately when any promise rejects. For a dashboard loading 5 widgets, one API failure cancels all 5. `allSettled` waits for all, letting you display partial results
- Why `Promise.any` over `Promise.race`? `Promise.race` resolves/rejects on the first settled promise — including rejections. `Promise.any` only cares about the first **fulfillment**. Use `Promise.any` to query multiple servers and return whichever responds first, ignoring individual failures
- Why `Promise.withResolvers`? When you need to create a promise but resolve/reject it from outside the constructor (event-driven patterns), the old way was `let resolve, reject; const p = new Promise((res, rej) => { resolve = res; reject = rej })`. `withResolvers` packages this cleanly

**Visual — Combinator Behavior:**

```javascript
const p1 = fetch("/api/price"); // 200ms → succeeds
const p2 = fetch("/api/stock"); // 300ms → fails (500 error)
const p3 = fetch("/api/reviews"); // 400ms → succeeds

// Promise.all — fail-fast
await Promise.all([p1, p2, p3]);
// ❌ Rejects at 300ms when p2 fails — p3 result discarded

// Promise.allSettled — collect all
const results = await Promise.allSettled([p1, p2, p3]);
// ✅ Resolves at 400ms with:
// [{ status: 'fulfilled', value: priceData },
//  { status: 'rejected', reason: Error('500') },
//  { status: 'fulfilled', value: reviewsData }]
results.forEach((r) => {
  if (r.status === "fulfilled") renderWidget(r.value);
  else showError();
});

// Promise.any — first success wins
const fastest = await Promise.any([
  fetch("https://cdn1.example.com/data"),
  fetch("https://cdn2.example.com/data"),
  fetch("https://cdn3.example.com/data"),
]);
// ✅ Returns first successful response, ignores failed CDNs

// Promise.withResolvers (ES2024)
const { promise, resolve, reject } = Promise.withResolvers();
eventEmitter.on("data", resolve);
eventEmitter.on("error", reject);
const result = await promise; // clean — no variable hoisting needed
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `Promise.all` for dashboard with partial data tolerance | `Promise.all` rejects immediately on the first failure — entire dashboard fails for one bad request | `Promise.allSettled` — shows available data even if some requests fail |
| `Promise.race` for "first successful CDN" (picks first to settle, including failures) | `Promise.race` picks the first to SETTLE — including rejections; a failed CDN wins the race | `Promise.any` — ignores rejections, returns first fulfillment |
| Checking `allSettled` results without checking `status` field | `allSettled` returns `{status, value/reason}` objects — accessing `.value` without checking status throws | Always check `r.status === 'fulfilled'` before accessing `r.value` |
| Using `Promise.any` when ALL failures should be an error | `Promise.any` throws `AggregateError` only when ALL promises reject — that's by design | Use `Promise.all` when any single failure should reject the whole group |

**🎯 Interview Pattern:**

- **Trigger**: "parallel API calls" / "dashboard loading" / "fallback servers" / "partial failure handling"
- **Concept**: 4 combinators for 4 different parallel failure modes
- **Opening**: "The choice of combinator depends on the failure mode. If all results are required and one failure means the whole operation fails, use `Promise.all`. If partial results are acceptable — like loading dashboard widgets independently — use `Promise.allSettled` to collect all outcomes. If you want the fastest responder from multiple sources and individual failures are OK, use `Promise.any`..."

**🔑 Knowledge Chain:**

- **Prereq**: Promises, async/await (see `09-async-comprehensive.md`)
- **Enables**: Resilient parallel data fetching, CDN failover, progressive loading patterns

---

### 3. Immutable Array Methods (ES2023) — `toSorted`, `toReversed`, `with`

**🧠 Memory Hook:** "**`sort()` mutates. `toSorted()` returns new. Same for reverse/splice. The `to-` prefix = non-mutating version. ES2023 finally fixed the array mutability footgun.**"

**Why does this exist? / Tại sao tồn tại?**

- Why are the original methods problematic? `Array.prototype.sort()` and `reverse()` mutate the original array in-place. In React (where mutation causes stale state), in functional patterns, and in shared state, this causes subtle bugs: `const sorted = items.sort(...)` also mutates `items`
- Why did it take until 2023? The spec committee avoided "doubling" every array method for years. The resolution was to add a specific set: `toSorted`, `toReversed`, `toSpliced`, `with` — covering the 4 most-mutated operations
- Why is `with(index, value)` the most underrated one? `arr[index] = value` is mutation. `arr.with(index, newValue)` returns a new array with only that index replaced — perfect for React state updates

**Visual — Mutating vs Immutable:**

```javascript
// React state bug with mutable sort:
const [items, setItems] = useState([3, 1, 2]);

// ❌ Bug: sort() mutates items in-place → React doesn't detect change → no re-render
const sorted = items.sort();
setItems(sorted); // same reference — React bails out

// ✅ toSorted() returns new array → React detects new reference → re-renders
setItems(items.toSorted());

// Full comparison:
const arr = [3, 1, 4, 1, 5];
arr.sort(); // mutates arr: [1, 1, 3, 4, 5]
arr.toSorted(); // returns new: [1, 1, 3, 4, 5], arr unchanged ✅

arr.reverse(); // mutates
arr.toReversed(); // returns new ✅

arr.splice(1, 2, 99); // mutates
arr.toSpliced(1, 2, 99); // returns new ✅

// with() — immutable index replacement:
const updated = arr.with(2, 99); // [3, 1, 99, 1, 5] — arr unchanged
// React: setItems(items.with(editIndex, newValue))  ← clean state update
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `[...arr].sort(fn)` (copy before sort) | Verbose — spread then sort is idiomatic but `toSorted` communicates immutability more clearly | `arr.toSorted(fn)` — same result, cleaner intent |
| `arr[index] = newValue; setItems(arr)` in React | Mutates the state array reference — React doesn't detect the change and skips re-render | `setItems(arr.with(index, newValue))` — immutable update, returns new reference |
| Confusing `at(-1)` with `with()` | Different operations: `at` reads, `with` replaces — easy to confuse negative-index semantics | `at(-1)` reads the last element; `with(-1, v)` returns new array with last element replaced |
| Using `toSpliced` expecting same API as `splice` | `splice` returns the removed elements; `toSpliced` returns the new modified array | `splice` returns removed elements; `toSpliced` returns the new array (not removed elements) |

**🎯 Interview Pattern:**

- **Trigger**: "immutable array update" / "React state with arrays" / "avoid mutation"
- **Concept**: `to-` prefix = returns new array without mutating original
- **Opening**: "ES2023 added non-mutating versions of the historically problematic array methods. `toSorted`, `toReversed`, `toSpliced`, and `with` all return a new array instead of modifying the original. This is particularly important in React — `items.sort()` mutates the state array reference, which React doesn't detect as a change. `items.toSorted()` returns a new reference, triggering re-render correctly..."

**🔑 Knowledge Chain:**

- **Prereq**: Array mutation vs copy, React state immutability
- **Enables**: Clean React state array updates, functional programming patterns, immutable data pipelines

---

## Reference Theory / Tài Liệu Tham Khảo

## ES2020 Features / Tính Năng ES2020

### BigInt / BigInt

**English:** BigInt provides arbitrary-precision integers, overcoming the Number.MAX_SAFE_INTEGER limitation.

**Tiếng Việt:** BigInt cung cấp số nguyên có độ chính xác tùy ý, vượt qua giới hạn Number.MAX_SAFE_INTEGER.

**Problem Solved:**

- Number.MAX_SAFE_INTEGER = 2^53 - 1
- Precision loss beyond this limit
- Cryptography needs
- Large integer calculations

**Syntax:**

```javascript
const bigInt1 = 123456789012345678901234567890n;
const bigInt2 = BigInt("123456789012345678901234567890");
```

**Operations:**

```javascript
const a = 10n;
const b = 20n;

a + b; // 30n
a * b; // 200n
a - b; // -10n
a / b; // 0n (integer division)
a % b; // 10n
a ** b; // 100000000000000000000n
```

**Limitations:**

- Cannot mix with Number
- No Math object methods
- JSON.stringify doesn't support
- Bitwise operations different

**Use Cases:**

- Cryptography
- Timestamps (microseconds)
- Large IDs
- Financial calculations
- Scientific computing

### Nullish Coalescing (??) / Hợp Nhất Nullish

**English:** Returns right operand when left is null or undefined, unlike || which checks for falsy values.

**Tiếng Việt:** Trả về toán hạng phải khi trái là null hoặc undefined, khác với || kiểm tra giá trị falsy.

**Problem with ||:**

```javascript
const count = 0;
const value = count || 10; // 10 (wrong!)
// 0 is falsy but valid
```

**Solution with ??:**

```javascript
const count = 0;
const value = count ?? 10; // 0 (correct!)
// Only null/undefined trigger default
```

**Comparison:**

```javascript
false || true; // true
false ?? true; // false

0 || 42; // 42
0 ?? 42; // 0

"" || "default"; // 'default'
"" ?? "default"; // ''

null ?? "default"; // 'default'
undefined ?? "default"; // 'default'
```

**Use Cases:**

- Default values
- Configuration objects
- Optional parameters
- API responses

### Optional Chaining (?.) / Chuỗi Tùy Chọn

**English:** Safely access nested properties without explicit null checks.

**Tiếng Việt:** Truy cập an toàn thuộc tính lồng nhau mà không cần kiểm tra null rõ ràng.

**Before:**

```javascript
const street = user && user.address && user.address.street;
```

**After:**

```javascript
const street = user?.address?.street;
```

**Variants:**

**Property Access:**

```javascript
obj?.prop;
obj?.[expr];
```

**Function Call:**

```javascript
func?.();
obj.method?.();
```

**Array Access:**

```javascript
arr?.[index];
```

**Combination:**

```javascript
const value = obj?.prop?.method?.()?.[0]?.nested;
```

**Short-Circuiting:**

```javascript
const result = obj?.prop?.method?.();
// If any step is null/undefined, returns undefined
// Rest of chain not evaluated
```

### Promise.allSettled() / Promise.allSettled()

**English:** Waits for all promises to settle (fulfilled or rejected), unlike Promise.all which fails fast.

**Tiếng Việt:** Đợi tất cả promises hoàn thành (fulfilled hoặc rejected), khác với Promise.all thất bại nhanh.

**Comparison:**

**Promise.all:**

- Fails on first rejection
- Returns array of values
- All-or-nothing

**Promise.allSettled:**

- Waits for all to complete
- Returns array of results
- Never rejects

**Result Format:**

```javascript
const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3),
]);

// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

**Use Cases:**

- Independent operations
- Batch processing
- Logging all results
- Partial success scenarios

### Dynamic Import / Import Động

**English:** Load modules dynamically at runtime, enabling code splitting and lazy loading.

**Tiếng Việt:** Tải modules động lúc runtime, cho phép code splitting và lazy loading.

**Syntax:**

```javascript
const module = await import("./module.js");
```

**Benefits:**

- Code splitting
- Lazy loading
- Conditional loading
- Reduced initial bundle
- Better performance

**Use Cases:**

**Conditional Loading:**

```javascript
if (condition) {
  const module = await import("./heavy-module.js");
  module.doSomething();
}
```

**Route-Based:**

```javascript
const route = getRoute();
const page = await import(`./pages/${route}.js`);
```

**On-Demand:**

```javascript
button.addEventListener("click", async () => {
  const { feature } = await import("./feature.js");
  feature();
});
```

### globalThis / globalThis

**English:** Unified way to access global object across environments.

**Tiếng Việt:** Cách thống nhất để truy cập object toàn cục qua các môi trường.

**Problem:**

- Browser: `window`
- Node.js: `global`
- Web Workers: `self`
- Inconsistent access

**Solution:**

```javascript
// Works everywhere
globalThis.setTimeout;
globalThis.console;
globalThis.fetch;
```

---

## ES2021 Features / Tính Năng ES2021

### String.prototype.replaceAll() / String.prototype.replaceAll()

**English:** Replace all occurrences of a substring, not just the first.

**Tiếng Việt:** Thay thế tất cả lần xuất hiện của substring, không chỉ lần đầu.

**Before:**

```javascript
// Using regex with g flag
const result = str.replace(/old/g, "new");

// Or split/join
const result = str.split("old").join("new");
```

**After:**

```javascript
const result = str.replaceAll("old", "new");
```

**With Regex:**

```javascript
// Must use g flag
const result = str.replaceAll(/old/g, "new");
// Without g flag: TypeError
```

### Promise.any() / Promise.any()

**English:** Returns first fulfilled promise, ignoring rejections unless all reject.

**Tiếng Việt:** Trả về promise fulfilled đầu tiên, bỏ qua rejections trừ khi tất cả reject.

**Behavior:**

- First fulfillment wins
- Ignores rejections
- Rejects only if all reject
- AggregateError if all fail

**Example:**

```javascript
const promises = [Promise.reject("error1"), Promise.resolve("success"), Promise.reject("error2")];

const result = await Promise.any(promises);
// 'success'
```

**All Rejected:**

```javascript
const promises = [Promise.reject("error1"), Promise.reject("error2")];

try {
  await Promise.any(promises);
} catch (error) {
  console.log(error); // AggregateError
  console.log(error.errors); // ['error1', 'error2']
}
```

**Use Cases:**

- Fastest response
- Fallback servers
- Race conditions
- Redundant requests

### Logical Assignment Operators / Toán Tử Gán Logic

**English:** Combine logical operators with assignment.

**Tiếng Việt:** Kết hợp toán tử logic với gán.

**Operators:**

**&&= (AND assignment):**

```javascript
// Before
if (obj.prop) {
  obj.prop = value;
}

// After
obj.prop &&= value;
```

**||= (OR assignment):**

```javascript
// Before
if (!obj.prop) {
  obj.prop = value;
}

// After
obj.prop ||= value;
```

**??= (Nullish assignment):**

```javascript
// Before
if (obj.prop == null) {
  obj.prop = value;
}

// After
obj.prop ??= value;
```

**Differences:**

```javascript
let x = 0;
x ||= 10; // 10 (0 is falsy)
x ??= 10; // 0 (0 is not nullish)

let y = false;
y &&= true; // false (short-circuits)
y ||= true; // true
```

### Numeric Separators / Dấu Phân Cách Số

**English:** Use underscores to improve readability of large numbers.

**Tiếng Việt:** Sử dụng gạch dưới để cải thiện khả năng đọc của số lớn.

**Syntax:**

```javascript
const billion = 1_000_000_000;
const bytes = 0b1111_1111;
const hex = 0xff_ff_ff_ff;
const bigInt = 1_000_000_000_000n;
```

**Rules:**

- Cannot start/end with underscore
- Cannot have consecutive underscores
- Cannot use after leading 0
- Purely cosmetic (ignored by engine)

---

## ES2022 Features / Tính Năng ES2022

### Top-Level Await / Await Cấp Cao Nhất

**English:** Use await at module top level without async function wrapper.

**Tiếng Việt:** Sử dụng await ở cấp cao nhất module mà không cần wrapper async function.

**Before:**

```javascript
// Had to wrap in async IIFE
(async () => {
  const data = await fetchData();
  export default data;
})();
```

**After:**

```javascript
// Direct top-level await
const data = await fetchData();
export default data;
```

**Use Cases:**

**Dynamic Imports:**

```javascript
const module = await import("./module.js");
```

**Resource Initialization:**

```javascript
const connection = await database.connect();
```

**Conditional Exports:**

```javascript
const config = await loadConfig();
export default config.production ? prodModule : devModule;
```

**Implications:**

- Module execution becomes async
- Blocks dependent modules
- Affects module graph
- Use judiciously

### Class Fields / Trường Lớp

**English:** Declare class fields directly without constructor.

**Tiếng Việt:** Khai báo trường lớp trực tiếp mà không cần constructor.

**Public Fields:**

```javascript
class Counter {
  count = 0; // Public field

  increment() {
    this.count++;
  }
}
```

**Private Fields:**

```javascript
class Counter {
  #count = 0; // Private field

  increment() {
    this.#count++;
  }

  getCount() {
    return this.#count;
  }
}

const counter = new Counter();
counter.#count; // SyntaxError
```

**Static Fields:**

```javascript
class Config {
  static version = "1.0.0";
  static #apiKey = "secret";

  static getApiKey() {
    return this.#apiKey;
  }
}
```

**Private Methods:**

```javascript
class Calculator {
  #validate(x) {
    return typeof x === "number";
  }

  add(a, b) {
    if (this.#validate(a) && this.#validate(b)) {
      return a + b;
    }
  }
}
```

### at() Method / Phương Thức at()

**English:** Access array/string elements with negative indices.

**Tiếng Việt:** Truy cập phần tử array/string với chỉ số âm.

**Before:**

```javascript
const arr = [1, 2, 3, 4, 5];
const last = arr[arr.length - 1]; // 5
```

**After:**

```javascript
const arr = [1, 2, 3, 4, 5];
const last = arr.at(-1); // 5
const secondLast = arr.at(-2); // 4
```

**Works On:**

- Arrays
- Strings
- TypedArrays

**Examples:**

```javascript
const str = "hello";
str.at(0); // 'h'
str.at(-1); // 'o'
str.at(-2); // 'l'

const arr = [10, 20, 30];
arr.at(1); // 20
arr.at(-1); // 30
```

### Object.hasOwn() / Object.hasOwn()

**English:** Safer alternative to hasOwnProperty.

**Tiếng Việt:** Thay thế an toàn hơn cho hasOwnProperty.

**Problem with hasOwnProperty:**

```javascript
const obj = Object.create(null);
obj.hasOwnProperty("prop"); // TypeError

const obj2 = { hasOwnProperty: "not a function" };
obj2.hasOwnProperty("prop"); // TypeError
```

**Solution:**

```javascript
Object.hasOwn(obj, "prop"); // Works safely
```

**Benefits:**

- Works with null prototype
- Cannot be shadowed
- More readable
- Recommended approach

### Error.cause / Error.cause

**English:** Chain errors with cause property.

**Tiếng Việt:** Chuỗi errors với thuộc tính cause.

**Syntax:**

```javascript
try {
  await fetchData();
} catch (error) {
  throw new Error("Failed to load data", { cause: error });
}
```

**Benefits:**

- Error context
- Stack trace preservation
- Better debugging
- Error chaining

**Example:**

```javascript
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to load user ${id}`, { cause: error });
  }
}

try {
  await loadUser(123);
} catch (error) {
  console.log(error.message); // 'Failed to load user 123'
  console.log(error.cause); // Original fetch error
}
```

---

## ES2023 Features / Tính Năng ES2023

### Array.prototype.findLast() / Array.prototype.findLast()

**English:** Find element from end of array.

**Tiếng Việt:** Tìm phần tử từ cuối array.

**Methods:**

- `findLast()`: Find from end
- `findLastIndex()`: Find index from end

**Examples:**

```javascript
const arr = [1, 2, 3, 4, 5];

arr.findLast((x) => x > 3); // 5
arr.findLastIndex((x) => x > 3); // 4

// Compare with find
arr.find((x) => x > 3); // 4
arr.findIndex((x) => x > 3); // 3
```

**Use Cases:**

- Recent items
- Reverse search
- Last occurrence
- Performance optimization

### Array.prototype.toSorted() / Array.prototype.toSorted()

**English:** Immutable array methods that return new arrays.

**Tiếng Việt:** Phương thức array bất biến trả về arrays mới.

**New Methods:**

- `toSorted()`: Immutable sort
- `toReversed()`: Immutable reverse
- `toSpliced()`: Immutable splice
- `with()`: Immutable element change

**Examples:**

```javascript
const arr = [3, 1, 2];

// Mutable (modifies original)
arr.sort(); // [1, 2, 3]
arr.reverse(); // [3, 2, 1]

// Immutable (returns new array)
const sorted = arr.toSorted(); // [1, 2, 3]
const reversed = arr.toReversed(); // [3, 2, 1]
// arr unchanged: [3, 1, 2]

// with() - change element
const arr2 = [1, 2, 3];
const arr3 = arr2.with(1, 99); // [1, 99, 3]
// arr2 unchanged: [1, 2, 3]

// toSpliced() - immutable splice
const arr4 = [1, 2, 3, 4, 5];
const arr5 = arr4.toSpliced(1, 2, 99); // [1, 99, 4, 5]
// arr4 unchanged: [1, 2, 3, 4, 5]
```

**Benefits:**

- Functional programming
- Predictable code
- Easier debugging
- Better for React/Redux

### Hashbang Grammar / Cú Pháp Hashbang

**English:** Support for shebang (#!) in JavaScript files.

**Tiếng Việt:** Hỗ trợ shebang (#!) trong files JavaScript.

**Syntax:**

```javascript
#!/usr/bin/env node

console.log("Hello from script");
```

**Use Cases:**

- CLI scripts
- Executable JavaScript
- Node.js scripts
- Cross-platform scripts

---

## ES2024 Features / Tính Năng ES2024

### Promise.withResolvers() / Promise.withResolvers()

**English:** Create promise with external resolve/reject functions.

**Tiếng Việt:** Tạo promise với hàm resolve/reject bên ngoài.

**Before:**

```javascript
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});
```

**After:**

```javascript
const { promise, resolve, reject } = Promise.withResolvers();
```

**Use Cases:**

- Event-based promises
- Deferred execution
- Manual control
- Complex async flows

### Object.groupBy() / Object.groupBy()

**English:** Group array elements by key function.

**Tiếng Việt:** Nhóm phần tử array theo hàm key.

**Syntax:**

```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
];

const byAge = Object.groupBy(people, (person) => person.age);
// {
//   '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   '30': [{ name: 'Bob', age: 30 }]
// }
```

**Map.groupBy():**

```javascript
const byAge = Map.groupBy(people, (person) => person.age);
// Map {
//   25 => [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   30 => [{ name: 'Bob', age: 30 }]
// }
```

**Benefits:**

- Cleaner code
- Built-in functionality
- Better performance
- Type-safe keys (Map)

### Temporal API (Stage 3) / API Temporal

**English:** Modern date/time API replacing Date.

**Tiếng Việt:** API date/time hiện đại thay thế Date.

**Problems with Date:**

- Mutable
- Confusing API
- No timezone support
- Month is 0-indexed
- Limited functionality

**Temporal Solution:**

```javascript
// Current date/time
const now = Temporal.Now.instant();

// Specific date
const date = Temporal.PlainDate.from("2024-01-15");

// Date with time
const dateTime = Temporal.PlainDateTime.from("2024-01-15T10:30:00");

// With timezone
const zonedDateTime = Temporal.ZonedDateTime.from("2024-01-15T10:30:00[America/New_York]");

// Duration
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });

// Arithmetic
const tomorrow = date.add({ days: 1 });
const nextWeek = date.add({ weeks: 1 });
```

**Benefits:**

- Immutable
- Clear API
- Timezone support
- Precise calculations
- Better ergonomics

---

## Stage 3 Proposals / Đề Xuất Stage 3

### Decorators / Decorators

**English:** Metadata and behavior modification for classes.

**Tiếng Việt:** Metadata và sửa đổi hành vi cho classes.

**Status:** Stage 3 (likely ES2025)

**Syntax:**

```javascript
@logged
class MyClass {
  @readonly
  property = "value";

  @memoize
  method() {
    // expensive operation
  }
}
```

### Records and Tuples / Records và Tuples

**English:** Immutable data structures with value semantics.

**Tiếng Việt:** Cấu trúc dữ liệu bất biến với ngữ nghĩa giá trị.

**Status:** Stage 2

**Syntax:**

```javascript
// Record (immutable object)
const record = #{
  name: 'Alice',
  age: 25
};

// Tuple (immutable array)
const tuple = #[1, 2, 3];

// Value equality
#{a: 1} === #{a: 1}  // true
#[1, 2] === #[1, 2]  // true
```

### Pattern Matching / Khớp Mẫu

**English:** Powerful conditional logic based on structure.

**Tiếng Việt:** Logic điều kiện mạnh mẽ dựa trên cấu trúc.

**Status:** Stage 1

**Proposed Syntax:**

```javascript
match (value) {
  when ({ type: 'circle', radius }) -> Math.PI * radius ** 2,
  when ({ type: 'rectangle', width, height }) -> width * height,
  when ({ type: 'triangle', base, height }) -> (base * height) / 2,
  default -> 0
}
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: What is the difference between `??` and `||`? When would a bug occur if you use `||` instead of `??`? / Sự khác nhau giữa `??` và `||`?

**A:** Both provide a fallback value, but they differ on what triggers the fallback:

- `||` returns right operand if left is **any falsy value**: `false`, `0`, `''`, `null`, `undefined`, `NaN`
- `??` returns right operand only if left is **`null` or `undefined`**

**Classic bug:**

```javascript
// User's score is 0 — a valid value
const score = user.score || 100; // ❌ Bug: 0 || 100 → 100 (0 is falsy!)
const score = user.score ?? 100; // ✅ Fix: 0 ?? 100 → 0 (0 is not nullish)

// Product has empty name
const name = product.name || "Unknown"; // '' || 'Unknown' → 'Unknown' (replaces '')
const name = product.name ?? "Unknown"; // '' ?? 'Unknown' → '' (keeps empty string)
```

**Rule:** Use `??` when `0`, `''`, and `false` are legitimate values that shouldn't be replaced by a default. Use `||` for boolean/truthy logic.

**Tiếng Việt:** `||` trigger khi left là bất kỳ falsy value. `??` chỉ trigger khi left là `null` hoặc `undefined`. Bug điển hình: dùng `||` với giá trị `0` hoặc `''` hợp lệ — sẽ bị thay thế nhầm bởi default.

💡 **Interview Signal:**

- ✅ Strong: Gives the exact falsy set; shows the `0`/`''` bug case; explains when each is appropriate
- ❌ Weak: "`??` is like `||` but safer" — vague; doesn't explain the specific difference

---

### 🟡 [Mid] Q2: A dashboard loads price, stock, and reviews from 3 separate APIs. What Promise combinator do you use and why? / Nên dùng Promise combinator nào cho dashboard?

**A:** Use `Promise.allSettled` — not `Promise.all`.

`Promise.all` is fail-fast: if the stock API fails, the whole operation rejects and you show nothing — even though price and reviews loaded successfully.

`Promise.allSettled` waits for all 3 promises and returns an array of `{status, value/reason}` results:

```javascript
const [priceResult, stockResult, reviewsResult] = await Promise.allSettled([
  fetch("/api/price").then((r) => r.json()),
  fetch("/api/stock").then((r) => r.json()),
  fetch("/api/reviews").then((r) => r.json()),
]);

// Show whatever succeeded, gracefully handle failures:
if (priceResult.status === "fulfilled") renderPrice(priceResult.value);
else showPriceUnavailable();

if (stockResult.status === "fulfilled") renderStock(stockResult.value);
else showStockUnavailable();

if (reviewsResult.status === "fulfilled") renderReviews(reviewsResult.value);
else showReviewsUnavailable();
```

**Comparison of all 4 combinators:**
| Combinator | Resolves when | Rejects when | Use case |
|---|---|---|---|
| `Promise.all` | All succeed | First rejects | All or nothing (e.g., multi-step form) |
| `Promise.allSettled` | All settle (any outcome) | Never rejects | Dashboard widgets (partial ok) |
| `Promise.race` | First settles (success or fail) | First rejects | Timeout pattern |
| `Promise.any` | First succeeds | All reject | Fallback CDNs, fastest server |

**Tiếng Việt:** Dashboard nên dùng `Promise.allSettled` — không phải `Promise.all`. `Promise.all` fail-fast: một API fail → mất tất cả. `allSettled` đợi tất cả, trả về `{status, value/reason}` cho từng cái — hiển thị partial data. `Promise.any` dùng khi muốn response nhanh nhất từ nhiều servers (first success wins).

💡 **Interview Signal:**

- ✅ Strong: Immediately identifies `allSettled` and why `all` fails here; knows `status` field check; correctly distinguishes `race` vs `any`
- ❌ Weak: "`Promise.all` and handle the error" — misses that `all` throws away successful results when one fails

---

### 🟡 [Mid] Q3: Explain top-level await. What problem does it solve and what are its risks? / Top-level await là gì? Rủi ro là gì?

**A:** Top-level `await` (ES2022) lets you use `await` at module scope without wrapping in an `async function`:

```javascript
// Before ES2022 — IIFE hack:
let config;
(async () => {
  config = await loadConfig();
})();
// ← config is unset until IIFE resolves — async race condition

// ES2022 top-level await:
const config = await loadConfig(); // module pauses until resolved
export { config }; // guaranteed to be initialized
```

**What problem it solves:** Module initialization that depends on async operations (loading config, dynamic imports, database connections, env checks).

**Risks:**

- **Blocks dependent modules:** A module using top-level `await` pauses its own execution — all modules that `import` it must wait. Long-running `await` at startup delays the entire module graph
- **Only in ES Modules:** Not available in CommonJS (which is synchronous by design)
- **Not appropriate for:** Data fetching inside render functions, non-initialization logic, hot paths

```javascript
// Good use of top-level await:
const FEATURES = await fetch("/api/feature-flags").then((r) => r.json());
export { FEATURES }; // downstream modules know FEATURES is ready

// Bad use — blocks your module for data that should be fetched lazily:
const ALL_PRODUCTS = await fetch("/api/products").then((r) => r.json()); // ← delays startup!
// Load this in a component or on-demand, not at module init time
```

**Tiếng Việt:** Top-level await cho phép `await` ở module scope. Giải quyết: async initialization (config, feature flags, dynamic imports). Rủi ro: block toàn bộ module graph nếu `await` lâu — chỉ dùng cho initialization, không dùng cho data fetching thông thường. Chỉ hoạt động trong ES Modules.

💡 **Interview Signal:**

- ✅ Strong: Explains the module-blocking behavior; mentions ESM-only constraint; gives appropriate vs inappropriate use cases
- ❌ Weak: "Now you can await without async" — misses the module-blocking implications and constraints

---

### 🔴 [Senior] Q4: Why do `sort()` and `reverse()` mutate arrays? What ES2023 methods fix this and why does it matter in React? / Tại sao sort()/reverse() mutate? ES2023 methods nào fix?

**A:** `Array.prototype.sort()` and `reverse()` modify the array in-place (returning `this`). This was a historical design choice — early JavaScript prioritized memory efficiency. The same design decision made these methods dangerous in immutable-first patterns.

**ES2023 non-mutating alternatives:**

```javascript
const arr = [3, 1, 4, 1, 5];

arr.sort(); // mutates arr → [1, 1, 3, 4, 5]
arr.toSorted(); // returns new array, arr unchanged ✅

arr.reverse(); // mutates
arr.toReversed(); // returns new ✅

arr.splice(1, 2); // mutates
arr.toSpliced(1, 2); // returns new ✅

// with() — immutable index replacement (most useful in React):
arr.with(2, 99); // returns [3, 1, 99, 1, 5], arr unchanged ✅
```

**Why it matters in React:**

```javascript
const [items, setItems] = useState([3, 1, 2]);

// ❌ Bug: sort() mutates the state array — React sees same reference → no re-render
setItems(items.sort()); // items and sorted point to same mutated array!

// ✅ Fix: toSorted() returns new array → React detects new reference → re-renders
setItems(items.toSorted());

// ✅ Update one item:
setItems(items.with(editIndex, newItem)); // instead of spread+splice
```

**Migration:** Replace `[...arr].sort(fn)` with `arr.toSorted(fn)` — same semantics, cleaner intent signal.

**Tiếng Việt:** `sort()` và `reverse()` mutate in-place — thiết kế lịch sử vì memory efficiency. ES2023 thêm `toSorted`, `toReversed`, `toSpliced`, `with` trả về array mới. Quan trọng trong React: mutation không trigger re-render (same reference). `items.toSorted()` → new array → React detect thay đổi → re-render đúng.

💡 **Interview Signal:**

- ✅ Strong: Explains why mutation is the historical default (memory); demonstrates the React stale-reference bug; shows `with()` for index replacement; mentions `[...arr].sort()` as previous workaround
- ❌ Weak: "Use spread before sort: `[...arr].sort()`" — correct workaround but doesn't mention the ES2023 native solution or explain the root cause

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic               | Key Insight                                                                       |
| --- | ------------------- | --------------------------------------------------------------------------------- | --- | --- | --- | -------------------------------------------------------------- |
| Q1  | `??` vs `           |                                                                                   | `   | `   |     | `= any falsy;`??`= null/undefined only. Bug:`0 \|\| 100 = 100` |
| Q2  | Promise combinators | `allSettled` for partial-ok (dashboard); `any` for first-success (CDN)            |
| Q3  | Top-level await     | Module-scope async init; blocks dependent modules; ESM only                       |
| Q4  | Immutable arrays    | `toSorted/toReversed/with` return new array; critical for React state correctness |

---

## ⚡ Cold Call Simulation

**Q: "Name 3 ES2020+ features you use regularly and why you prefer them over the old approach."**

**30-second answer:**
"Three I use constantly: First, nullish coalescing `??` — I replaced all my `||` default patterns with it because `||` was silently replacing valid `0` and empty string values with defaults. Second, optional chaining `?.` — instead of `user && user.profile && user.profile.city`, I just write `user?.profile?.city`. Third, `Promise.allSettled` — for dashboards and pages that load multiple independent data sources, I switched from `Promise.all` to `allSettled` so one failing API doesn't blank the entire page. Together these three eliminate three entire bug categories."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**

1. `0 ?? 100` → ? `0 || 100` → ? Explain the difference.
2. Which Promise combinator: (a) fail-fast on first rejection, (b) wait for all and collect outcomes, (c) return first fulfillment ignoring rejections?
3. What does `arr.with(2, 99)` return? Does it modify `arr`?
4. What is the risk of top-level `await` in a module imported by 10 other modules?
5. `items.sort()` vs `items.toSorted()` in React state — what bug does sort() cause?

**Visual:**

- Draw the `??` vs `||` decision tree: given `value`, when does each return the default?
- Draw `Promise.allSettled` result shape: what object structure does each item have?

**Application:**

- A search result has `count: 0` (zero results). You want to display "No results" when count is missing but show "0 results" when it's explicitly zero. Write the conditional using modern JS.
- Update index 3 of a React state array to a new value without mutating. Use ES2023 method.

**Debug:**

- `product.price || 'Price unavailable'` shows "Price unavailable" for a product priced at 0. Fix it.

**Teach:**

- Explain `Promise.allSettled` vs `Promise.all` using the dashboard analogy: "Loading a dashboard is like ordering 5 dishes. `all` = if one dish fails, the waiter clears the whole table. `allSettled` = you get whatever dishes are ready, and a note for the ones that failed."

> 🎯 **Feynman Prompt:** Giải thích cho junior: tại sao `user?.address?.city` an toàn hơn `user.address.city` — optional chaining và nullish coalescing `??` giải quyết vấn đề gì, và tại sao `0 ?? 'default'` khác với `0 || 'default'`?

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: `??` vs `||` distinction, 4 Promise combinators behavior comparison, `toSorted`/`with` for React state.

---

## Connections / Liên Kết

- **Prereqs**: [07-es6-features.md](./07-es6-features.md) (ES6 foundations), [09-async-comprehensive.md](./09-async-comprehensive.md) (Promises)
- **See also**: [13-javascript-basics-theory.md](./13-javascript-basics-theory.md) (truthy/falsy), [03-react/03-hooks-deep-dive.md](../03-react/03-hooks-deep-dive.md) (React state immutability)
- **TypeScript**: [02-typescript/06-typescript-modern-features.md](../02-typescript/06-typescript-modern-features.md) — TypeScript adds compile-time safety for these runtime patterns

---

[← Previous: Engine Internals](./21-engine-internals-theory.md) | [Next: TypeScript Modern Features →](../02-typescript/06-typescript-modern-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
