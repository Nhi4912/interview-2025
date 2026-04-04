# ES6+ Modern Features / Tính Năng Hiện Đại ES6+

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [this keyword](./05-this-keyword.md) | [Table of Contents](../../00-table-of-contents.md)

[← Previous: Event Loop & Async](./06-event-loop-async.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Advanced Concepts →](./08-advanced-concepts.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn join một team mới — codebase full `var`, callback hell 5 tầng lồng nhau, string concatenation bằng `+`. Code chạy được nhưng đọc mất 2x thời gian. Bug từ `var` hoisting xuất hiện chỗ không ngờ. Code review chậm vì không ai nhớ pattern nào đang dùng.

ES6 (2015) là bước ngoặt: từ "ngôn ngữ đồ chơi" thành language production nghiêm túc. Hiểu ES6 = hiểu 80% codebase React/Node hiện đại.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Nâng cấp công cụ:**
Trước ES6 = dùng búa cũ để đóng đinh: được, nhưng tốn sức. ES6 = súng bắn đinh: cùng kết quả, nhanh hơn, ít lỗi hơn.

| ES5 (cũ)               | ES6+ (mới)         | Vì sao tốt hơn                    |
| ---------------------- | ------------------ | --------------------------------- |
| `var x`                | `let`/`const`      | Block scope, no hoisting surprise |
| `function(a,b){}`      | `(a,b) => {}`      | Shorter + lexical `this`          |
| `'Hi ' + name`         | `` `Hi ${name}` `` | Readable, multi-line              |
| `{x: x, y: y}`         | `{x, y}`           | Shorthand properties              |
| `fn.then(fn).then(fn)` | `async/await`      | Reads like synchronous            |
| `arguments` object     | `...rest`          | Explicit, flexible                |

---

## Concept Map / Bản Đồ Khái Niệm

```
      [ES5 JavaScript: var, callbacks, prototype]
                        │
                        ▼
              [ES6+ FEATURES] ← bạn đang ở đây
                        │
    ┌───────────────────┼───────────────────┐
    ▼                   ▼                   ▼
[Variables]         [Functions]          [Data]
let/const            Arrow fn            Destructuring
Block scope          Default params      Spread/Rest
TDZ                  Classes             Template literals
                     Generators          Optional chaining
                        │                Map/Set/Symbol
                        ▼
              [Modules: import/export]
              [Async: Promise, async/await]
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. `let`, `const` vs `var` — The Definitive Guide

> 🧠 **Memory Hook:** "**VAR** = **V**ery **A**mbiguous **R**ange (function scope). **LET** = **L**ocked to **E**nclosing braces, **T**emporary dead zone. **CONST** = Can't **Re**assign (but can mutate object contents)."

**Tại sao tồn tại? / Why does this exist?**
`var` function scope created the famous "closure in loop" bug and hoisting surprises. ES6 introduced block scope to match programmer expectations.
→ Tại sao block scope? → Variables should only exist where they're used
→ Tại sao Temporal Dead Zone? → Prevent using `let`/`const` before declaration (unlike `var` which is `undefined`)

#### Layer 1: The 3 Key Differences

```javascript
// 1. SCOPE
function test() {
  if (true) {
    var x = 1; // function-scoped — visible outside if block
    let y = 2; // block-scoped — not visible outside
    const z = 3; // block-scoped — not visible outside
  }
  console.log(x); // 1 ✅
  console.log(y); // ❌ ReferenceError
}

// 2. HOISTING
console.log(a); // undefined (hoisted, initialized to undefined)
var a = 1;

console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 2; // Temporal Dead Zone: declared but not initialized

// 3. RE-ASSIGNMENT
const arr = [1, 2, 3];
arr.push(4); // ✅ OK — mutating object contents is allowed
arr = [5, 6]; // ❌ TypeError: Assignment to constant variable
// const = immutable BINDING, not immutable VALUE
```

#### Layer 2: The Loop Bug (Classic Interview)

```javascript
// Classic var loop bug
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 — all callbacks share the SAME `i` (function-scoped)

// Fix 1: let (block scope — each iteration has its own i)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅

// Fix 2: IIFE (ES5 pattern — creates new scope per iteration)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
```

#### Layer 3: `const` Object Mutation Gotcha

```javascript
const config = { debug: false, port: 3000 };
config.debug = true; // ✅ Mutation OK — binding unchanged
config = {}; // ❌ TypeError — reassignment not allowed

// Use Object.freeze() for truly immutable objects
const IMMUTABLE = Object.freeze({ x: 1, y: 2 });
IMMUTABLE.x = 99; // silently fails (or throws in strict mode)
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                          | Đúng là                                    |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------ |
| `const` = immutable            | `const` chỉ immutable binding, không immutable value | Dùng `Object.freeze()` cho truly immutable |
| `for (var i)` trong setTimeout | var function-scoped → all callbacks share same `i`   | `let` hoặc `const` trong loops             |
| Đọc `let` trước declaration    | TDZ: ReferenceError (không phải `undefined`)         | Declare before use                         |

**🎯 Interview Pattern:**

- Khi thấy: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))`
- → Output: `3, 3, 3` + giải thích var function scope + fix với `let`

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — `var` hoisting, block scope
- ➡️ Để hiểu: Closures trong loops, React's useState (const pattern)

---

### 2. Destructuring, Spread & Rest

> 🧠 **Memory Hook:** "**Destructuring** = unpack from box. **Spread** = scatter contents. **Rest** = collect remainders. Same `...` syntax, opposite directions."

**Tại sao tồn tại? / Why does this exist?**
Extracting values from arrays/objects verbosely (`obj.name`, `arr[0]`) is tedious and error-prone. Destructuring = declare what shape you expect, get values automatically.

#### Layer 1: Destructuring Syntax

```javascript
// Object destructuring
const { name, age, country = "VN" } = user; // with default
const { name: fullName } = user; // rename

// Array destructuring
const [first, , third] = [1, 2, 3]; // skip with comma
const [head, ...tail] = [1, 2, 3, 4]; // rest in array

// Function parameters (most common in React)
function UserCard({ name, avatar, onClick }) {
  /* ... */
}

// Nested — don't over-nest (becomes hard to read)
const {
  profile: {
    address: { city },
  },
} = user;
```

#### Layer 2: Spread and Rest

```javascript
// SPREAD — expand
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1,2,3,4,5]
const merged = { ...defaults, ...overrides }; // merge objects (right wins)

// Shallow copy
const copy = [...arr1]; // new array, same elements
const objCopy = { ...obj }; // shallow — nested refs shared

// REST — collect
function sum(first, ...rest) {
  // rest = array of remaining args
  return first + rest.reduce((a, b) => a + b, 0);
}

// Shallow vs Deep copy
const shallow = { ...obj }; // nested objects still shared
const deep = structuredClone(obj); // ES2022: full deep copy
```

#### Layer 3: Common Patterns in React

```javascript
// Pass-through props (HOC pattern)
function withLogging({ onAction, ...restProps }) {
  return (
    <Component
      {...restProps}
      onAction={(...args) => {
        log(args);
        onAction(...args);
      }}
    />
  );
}

// Immutable state update
const newState = { ...state, count: state.count + 1 }; // ✅ new reference
state.count++; // ❌ mutates — no re-render
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                       | Đúng là                            |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------- |
| Spread = deep clone                | Spread chỉ copy one level — nested objects shared | `structuredClone()` hoặc libraries |
| `{...a, ...b}` last key wins       | Nếu `a` và `b` có cùng key, `b` wins              | Explicit về override thứ tự        |
| Spread Array vào non-array context | `fn({...arr})` → object với numeric keys          | `fn([...arr])` để giữ array        |

**🎯 Interview Pattern:**

- Khi thấy: "Shallow copy vs deep copy?"
- → Mở đầu: "Spread/Object.assign là shallow — nested objects vẫn share references. `structuredClone()` là deep copy native (ES2022)..."

---

### 3. Arrow Functions — Beyond Syntax Sugar

> 🧠 **Memory Hook:** "Arrow function = no `this`, no `arguments`, no `new`. 3 NOs. Use for callbacks. Don't use for methods."

**Tại sao tồn tại? / Why does this exist?**
Arrow functions solve the `this` context loss problem in callbacks — and provide shorter syntax. See [this keyword](./05-this-keyword.md) for full explanation.

```javascript
// Syntax variations
const fn1 = (x) => x * 2; // single param, implicit return
const fn2 = (x, y) => x + y; // multiple params
const fn3 = () => ({ name: "obj" }); // return object literal (wrap in parens)
const fn4 = (x) => {
  // block body
  const y = x * 2;
  return y;
};

// When to use
// ✅ Callbacks, array methods
const doubled = [1, 2, 3].map((n) => n * 2);
const even = [1, 2, 3, 4].filter((n) => n % 2 === 0);

// ✅ useEffect callbacks (lexical this)
useEffect(() => {
  fetchData();
}, []);

// ❌ Object methods (no own this)
const counter = {
  count: 0,
  increment: () => {
    this.count++;
  }, // this = global, NOT counter
};

// ✅ Object methods should be regular functions
const counter = {
  count: 0,
  increment() {
    this.count++;
  }, // method shorthand — has own this
};
```

**🎯 Interview Pattern:**

- Khi thấy: "Arrow function vs regular function — khi nào dùng cái nào?"
- → Mở đầu: "Arrow function có 3 'không': không có `this` riêng, không có `arguments`, không dùng với `new`. Dùng cho callbacks, array methods. Không dùng cho object methods hoặc constructors..."

---

### 4. Optional Chaining & Nullish Coalescing

> 🧠 **Memory Hook:** "`?.` = safe navigate (returns undefined if null). `??` = fallback only for null/undefined (not 0 or ''). Know the difference: `||` falls back for ALL falsy values."

```javascript
// Optional chaining — avoid "Cannot read property of undefined"
const city = user?.profile?.address?.city; // undefined if any step is null/undefined
const firstItem = arr?.[0]; // for arrays
const result = obj?.method?.(); // for methods

// Nullish coalescing — default only for null/undefined
const count = input ?? 0; // 0 if input is null/undefined, NOT if it's 0
const name = input ?? ""; // empty string if null/undefined

// ❌ || falls back for ALL falsy: 0, '', false, null, undefined
const count = input || 0; // BUG: if input is 0, still returns 0? No — it returns 0!
// Wait: 0 || 0 = 0 (both falsy, picks right)
// Real bug: if input is 0 (valid value), || gives wrong impression:
const value = userInput || defaultValue; // if userInput = 0 → uses default! Bug!

// Use case comparison
const price = product?.price ?? 0; // 0 if product missing OR price is null
const price = product?.price || 0; // 0 if price is null/undefined/0/'' — too broad
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                              | Đúng là                      |
| -------------------------------- | ---------------------------------------- | ---------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `a                               |                                          | b`khi`a`có thể là`0`hoặc`''` | Falsy check quá rộng — `0` và `''` là valid values | `a ?? b` — chỉ fallback cho `null`/`undefined` |
| `a?.b.c` — chain ngắn không đúng | Nếu `a?.b` là undefined, `.c` vẫn throws | `a?.b?.c` — chain đầy đủ     |

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: Predict output — `var` vs `let` trong loop 🟢 Junior

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0);
}
```

**A:** First loop: `3, 3, 3`. Second loop: `0, 1, 2`.

`var i` is function-scoped — all 3 callbacks share the same `i`. When they execute, `i` is already 3. `let j` is block-scoped — each loop iteration creates a new `j` binding that closures capture independently.

`var i` function-scoped — 3 callbacks share một `i`. Khi chạy, `i = 3`. `let j` block-scoped — mỗi iteration tạo binding `j` riêng, closure capture đúng value.

**💡 Interview Signal:**

- ✅ Strong: Giải thích function scope vs block scope, explain closure mechanism, biết fix với IIFE (ES5 pattern) hoặc `let`
- ❌ Weak: Chỉ nói output mà không giải thích tại sao

---

### Q2: `const` có nghĩa là immutable không? 🟢 Junior

**A:** No. `const` creates an immutable **binding** (the variable reference cannot be reassigned), but the **value** can still be mutated if it's an object or array.

```javascript
const arr = [1, 2, 3];
arr.push(4); // ✅ OK — mutating the object
arr = [5, 6]; // ❌ TypeError — reassigning the binding

// Truly immutable: Object.freeze()
const FROZEN = Object.freeze({ x: 1 });
FROZEN.x = 2; // silently fails (throws in strict mode)
```

`const` tạo immutable binding (không thể reassign), không phải immutable value. Object/array vẫn có thể bị mutate. Dùng `Object.freeze()` để thực sự immutable.

**💡 Interview Signal:**

- ✅ Strong: Phân biệt rõ "binding immutable vs value immutable", biết `Object.freeze()` và limitation của nó (chỉ shallow), mention `deepFreeze` pattern
- ❌ Weak: "const không thể thay đổi" — oversimplification

---

### Q3: Spread operator vs Object.assign — khác nhau gì? 🟡 Mid

**A:** Both create shallow copies, but differ in:

1. `Object.assign(target, source)` mutates `target` and returns it. Spread creates a new object
2. Spread can be used in any expression context; `Object.assign` is a function call
3. `Object.assign` triggers setter methods on target; spread doesn't
4. Spread is syntactically cleaner: `{ ...a, ...b }` vs `Object.assign({}, a, b)`

Cả hai shallow copy, nhưng: spread tạo object mới (không mutate), Object.assign mutate target. Spread syntax clean hơn. Object.assign trigger setters — spread không.

**💡 Interview Signal:**

- ✅ Strong: Biết setter difference (quan trọng với class instances), biết cả hai shallow, đề cập `structuredClone` cho deep copy
- ❌ Weak: "Cả hai giống nhau" — không biết setter difference

---

### Q4: `??` vs `||` — khi nào dùng cái nào? 🟡 Mid

**A:** `||` falls back when left side is **any falsy value** (0, '', false, null, undefined, NaN). `??` falls back only when left side is **null or undefined**. Use `??` when 0 or empty string are valid values you don't want to override.

`||` fallback khi bất kỳ falsy: `0`, `''`, `false`, `null`, `undefined`. `??` chỉ fallback khi `null` hoặc `undefined`. Dùng `??` khi `0` hay `''` là valid values.

```javascript
// Bug with ||
const itemCount = userCount || 5; // if userCount = 0 → uses 5 (WRONG!)

// Fix with ??
const itemCount = userCount ?? 5; // only if userCount is null/undefined → use 5
```

**💡 Interview Signal:**

- ✅ Strong: Ví dụ cụ thể với `0` là valid value (count, price, index), biết `&&` chain: `a && a.b && a.b.c` vs `a?.b?.c`
- ❌ Weak: "?? cho null/undefined, || cho falsy" — đúng nhưng cần ví dụ để show hiểu real use case

---

### Q5: Design: convert callback-based API thành Promise-based 🔴 Senior (Create)

**A:** The `promisify` pattern:

```javascript
// Generic promisify function
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}

// Example: Node.js-style callback to Promise
const readFileAsync = promisify(fs.readFile);
const content = await readFileAsync("./data.json", "utf8");

// Multiple results (Node sometimes passes multiple args to callback)
function promisifyMulti(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, ...results) => {
        if (error) reject(error);
        else resolve(results.length === 1 ? results[0] : results);
      });
    });
  };
}

// EventEmitter-based async with cleanup
function waitForEvent(emitter, event) {
  return new Promise((resolve, reject) => {
    function onEvent(data) {
      cleanup();
      resolve(data);
    }
    function onError(err) {
      cleanup();
      reject(err);
    }
    function cleanup() {
      emitter.off(event, onEvent);
      emitter.off("error", onError);
    }
    emitter.once(event, onEvent);
    emitter.once("error", onError);
  });
}
```

**💡 Interview Signal:**

- ✅ Strong: Handle error-first callback convention, multiple results, cleanup event listeners (memory leak prevention), TypeScript generic signature
- ❌ Weak: Basic `new Promise` wrapper without error handling or cleanup

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                     | Level | One-liner                                                                                    |
| --- | ------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| 1   | `var` vs `let` in loop    | 🟢    | `var` shares one binding across iterations (all = 3); `let` creates a new binding per iter   |
| 2   | `const` ≠ immutable       | 🟢    | `const` = immutable binding, not value; objects/arrays are still mutable                     |
| 3   | Spread vs `Object.assign` | 🟡    | Both shallow; spread = new object; `assign` = mutates target and triggers setters            |
| 4   | `??` vs `\|\|`            | 🟡    | `\|\|` = any falsy; `??` = null/undefined only; use `??` when 0 or empty string are valid    |
| 5   | Callback → Promise        | 🔴    | `promisify` wraps error-first callback; handle multi-result + cleanup EventEmitter listeners |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` in ra `3, 3, 3` thay vì `0, 1, 2`?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "`var` có function scope — không phải block scope. Tất cả 3 iterations share CÙNG một biến `i`."
2. "3 setTimeout callbacks đều là closures capture reference đến `i` — không phải giá trị của `i` lúc tạo."
3. "Khi callbacks thực thi (sau 100ms), loop đã chạy xong — `i` đã là `3`. Tất cả 3 callbacks đọc `i = 3`."
4. "Fix: đổi `var` sang `let`. Block scope của `let` tạo binding mới cho mỗi iteration — mỗi closure capture `j` riêng."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                 |
| --- | -------------- | ------------------------------------------------------------------------------------------------------- | --- | ---------------------------------------------------------------------------- | --- | --------------------- |
| 1   | 🔍 Retrieval   | Liệt kê **3 khác biệt** giữa `var`, `let`, `const` (scope, hoisting, TDZ).                              |
| 2   | 🎨 Visual      | Vẽ scope chain cho: `var` trong `if` block vs `let` trong `if` block.                                   |
| 3   | 🛠️ Application | `const config = { debug: false }`. Làm sao để tạo new config với `debug: true` mà **không mutate** gốc? |
| 4   | 🐛 Debug       | Viết hàm `promisify` từ đầu mà không nhìn lại — handle **error-first callback** convention.             |
| 5   | 🎓 Teach       | Giải thích `??` vs `                                                                                    |     | `cho junior developer dùng ví dụ`price = userInput ?? 0`vs`price = userInput |     | 0`khi`userInput = 0`. |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------- | --- | ------------------------------- |
| 1   | `var`: function-scoped, hoisted+init `undefined`. `let`/`const`: block-scoped, **TDZ** (ReferenceError nếu access trước khai báo). `const`: thêm no-reassign. |
| 2   | `var` trong if block: thoát ra ngoài if block, accessible trong toàn function. `let` trong if block: **chỉ tồn tại trong** `{}` block.                        |
| 3   | `const newConfig = { ...config, debug: true }` — spread copy tất cả properties, override `debug`. Original `config` không bị thay đổi.                        |
| 4   | `function promisify(fn) { return (...args) => new Promise((res, rej) => fn(...args, (err, val) => err ? rej(err) : res(val))); }`                             |
| 5   | `                                                                                                                                                             |     | `fallback khi **falsy** (0, '', false đều trigger).`??`fallback chỉ khi`null`/`undefined`. Với `userInput = 0`: ` |     | `→ 0 bị thay,`??` → 0 được giữ. |

> 🎯 **Feynman Prompt:** Giải thích tại sao `const arr = [1,2,3]; arr.push(4)` không throw TypeError — mặc dù dùng `const`.
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Scope & Hoisting](./02-scope-hoisting.md) — `let`/`const` block scope vs `var` hoisting
- [Closures](./03-closures.md) — closures and block-scoped `let` in loops
- [This Keyword](./05-this-keyword.md) — arrow functions and lexical `this`
- [Module Systems Theory](./20-module-systems-theory.md) — ES modules (import/export) introduced in ES6

### Khác track (Cross-track)
- [TypeScript Basics](../02-typescript/01-typescript-basics.md) — TypeScript is a superset of ES6+
- [React Fundamentals](../03-react/01-react-fundamentals.md) — React uses destructuring, spread, and arrow functions throughout
- [CS Fundamentals: Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md) — module loading over the network
