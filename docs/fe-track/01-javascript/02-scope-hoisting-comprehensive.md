# Scope & Hoisting — Comprehensive / Scope & Hoisting — Toàn Diện

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Basics](./00-javascript-basics.md)
> **See also**: [Closures](./03-closures-comprehensive.md) | [Execution Context](./16-execution-context-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki cart animation bug (production):**

```javascript
// BUG: all setTimeout callbacks log the SAME value
for (var i = 0; i < cartItems.length; i++) {
  setTimeout(() => showItemAnimation(i), i * 100); // all show cartItems.length!
}
```

Senior engineer reviewed this in PR, approved it — shipped. 3000 users saw broken animations. Root cause: `var i` is function-scoped → all closures share 1 `i` variable → loop finishes before timeouts fire → `i = cartItems.length` for all callbacks.

Fix: change 1 character — `var` → `let`. Block-scoped `i`, new binding per iteration.

**Bài học:** Không hiểu scope → shipping bugs mà code review không catch được vì code trông bình thường.

---

## What & Why / Cái Gì & Tại Sao

> 🧠 **Memory Hook**: **`var` = tờ giấy phòng khách (function scope). `let/const` = tờ giấy ngăn kéo (block scope). Hoisting = JS "đọc qua" code trước khi chạy.**

**Tại sao JS có scope?**
→ Vì nếu không có scope, mọi variable đều global → 2 files dùng cùng tên `i` sẽ conflict.
→ Vì cần isolate variables: library không nên pollute user's code.
→ Hoisting tồn tại vì JS engine thực hiện 2 pass: parse (collect declarations) → execute.

**Why this matters in 2026 interviews:**
- Scope/hoisting là câu hỏi Junior #1 tại mọi Vietnamese tech company
- `var` bugs vẫn xuất hiện trong legacy codebases (Tiki, VNG)
- TDZ (Temporal Dead Zone) là gotcha phổ biến khi migrate var → let/const
- Module scope là nền tảng để hiểu bundlers (Webpack, Vite)

---

## Concept Map / Bản Đồ Khái Niệm

```
                    SCOPE
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   [Global]      [Function]     [Block]
    (var)          (var)        (let/const)
        │             │             │
        └──────────────────────────┘
                      │
                 SCOPE CHAIN
                 (lookup order)
                      │
                  CLOSURES
                 (captures scope)

HOISTING (compile phase):
var → hoisted + initialized to undefined
function declaration → hoisted + fully initialized
let/const → hoisted + NOT initialized (TDZ)
class → hoisted + NOT initialized (TDZ)
```

**Bạn đang ở đây trong lộ trình học:**
```
JS Basics → [SCOPE & HOISTING] → Closures → Execution Context → Async
```

---

## Overview / Tổng Quan

**Scope** defines where variables are accessible. **Hoisting** is the JS engine's behavior of moving declarations to the top of their scope during the compile phase.

**Tiếng Việt:** Scope xác định vùng mà variable có thể truy cập được. Hoisting là hành vi của JS engine khi "kéo" declarations lên đầu scope trong compile phase. Hiểu đúng 2 khái niệm này giải thích được 80% bugs mà junior developers gặp phải với `var`, function declarations, và TDZ errors.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. The Three Scope Types / Ba Loại Scope

> 🧠 **Memory Hook**: **Global → Function → Block. `var` knows only 2 (global + function). `let/const` knows all 3.**

**Tại sao có 3 loại scope?**
→ Global scope: cần 1 nơi chia sẻ variables giữa files (nhưng ít dùng để tránh collision).
→ Function scope: mỗi function cần sandbox riêng — caller không thấy local variables.
→ Block scope: cần `i` trong for-loop không leak ra ngoài — `let` giải quyết vấn đề này ES6 đưa vào.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng tòa nhà văn phòng:
- **Global scope**: bảng thông báo ở lobby — ai cũng thấy, ai cũng sửa được
- **Function scope**: phòng làm việc riêng — chỉ người trong phòng thấy
- **Block scope**: ngăn kéo trong phòng — chỉ người đang dùng ngăn kéo đó thấy

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
var globalVar = 'lobby';       // accessible everywhere

function myRoom() {
  var roomVar = 'my room';     // only inside myRoom()
  let blockVar = 'temporary';  // only in this block

  if (true) {
    var stillRoom = 'var ignores blocks'; // still function-scoped!
    let blockOnly = 'block-scoped';       // dies here
    console.log(blockOnly); // ✅
  }
  console.log(stillRoom); // ✅ var ignores the if-block boundary
  console.log(blockOnly); // ❌ ReferenceError
}

console.log(globalVar); // ✅
console.log(roomVar);   // ❌ ReferenceError
```

```
Scope boundaries for var vs let/const:
┌─────────────────────────────────────────────┐
│ function myRoom() {         function scope  │
│   var x;  ◄─────── x lives here            │
│   if (true) {   block scope                 │
│     var y;   ◄── y still lives in function! │
│     let z;   ◄── z lives ONLY in this block │
│   }                                         │
│   console.log(y); // ✅ var ignores blocks  │
│   console.log(z); // ❌ ReferenceError      │
│ }                                           │
└─────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- `var` in a `for` loop inside a function: scoped to the **function**, not the loop body
- `let`/`const` in a `for` loop: **new binding per iteration** — key for closure-in-loop pattern
- `const` is block-scoped but the VALUE can change for objects/arrays (reference is const, not contents)

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "`var` inside `if` is scoped to `if`" | var is function-scoped, ignores blocks | var leaks out of any block except functions |
| "`const` means immutable" | const means the binding cannot be reassigned | `const arr = []; arr.push(1)` is valid — array itself can mutate |
| "let and const are not hoisted" | They ARE hoisted, but not initialized (TDZ) | `typeof let_var` before declaration → ReferenceError, not undefined |

**🎯 Interview Pattern:**
- Khi thấy: "what scope does this variable have?", "why does this print X not Y?"
- → First: identify which keyword (`var`/`let`/`const`), then identify nearest enclosing function scope (for var) or block scope (for let/const)
- → Answer opens with: *"var is function-scoped, so it ignores block boundaries like if/for. let and const are block-scoped, creating a new binding for each block."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [JavaScript Basics](./00-javascript-basics.md) — variable declarations
- ➡️ Để hiểu: [Closures](./03-closures-comprehensive.md) — closures capture scope chain

---

### 2. Scope Chain & Lexical Scope / Chuỗi Scope & Lexical Scope

> 🧠 **Memory Hook**: **Scope chain = lookup order: inner → outer → global. Always walks UP, never down. Determined at WRITE time, not run time.**

**Tại sao JS dùng lexical scope (thay vì dynamic scope)?**
→ Vì nếu scope được xác định lúc runtime (dynamic scope), behavior của function thay đổi tùy ai gọi nó — rất khó predict.
→ Lexical scope: behavior được xác định tại thời điểm viết code — dễ reason about hơn nhiều.
→ Đây là design decision của Brendan Eich năm 1995, vẫn đúng đến ngày nay.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Bạn cần tìm một cuốn sách. Trước tiên tìm trong phòng mình (inner scope). Không có → tìm trong nhà (outer scope). Không có → tìm trong thư viện công cộng (global). Đây là scope chain — luôn tìm từ trong ra ngoài.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
const ENV = 'production'; // global

function getConfig() {
  const baseUrl = 'https://api.grab.com'; // getConfig scope

  function buildUrl(path) {
    // buildUrl has no 'baseUrl' or 'ENV' — walks up the chain
    return `${baseUrl}/${path}?env=${ENV}`; // ✅ found via scope chain
  }

  return buildUrl('/drivers');
}
```

```
Scope chain lookup for 'baseUrl' inside buildUrl:
buildUrl scope ──► not found
    │
    ▼
getConfig scope ──► FOUND: baseUrl = 'https://api.grab.com'
    │ (would continue if not found)
    ▼
global scope ──► ENV = 'production'
```

**Lexical vs Dynamic scope:**
```javascript
const x = 'global';

function foo() {
  console.log(x); // JS uses LEXICAL scope → always 'global'
}

function bar() {
  const x = 'bar';
  foo(); // if dynamic scope: 'bar'. Lexical scope: 'global'
}

bar(); // → 'global' (lexical: foo's scope chain set at definition time)
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- `with` statement (deprecated): the only way to create dynamic scope in JS — banned in strict mode
- `eval` with string: can add variables to surrounding scope — another reason to ban eval
- Arrow functions: no own `this`, but they DO have their own scope chain (same as regular functions for variable lookup)

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Function's scope is determined when called" | Scope chain set at definition time (lexical) | Where the function is WRITTEN determines its scope, not where it's called |
| "Inner scope can access outer scope AND vice versa" | One-way: inner can access outer; outer CANNOT access inner | Scope chain goes up only, never down |
| "`this` follows lexical scope" | `this` is dynamic (set by call site), not lexical | Arrow function's `this` is lexical; regular function's `this` is dynamic |

**🎯 Interview Pattern:**
- Khi thấy: "what does this log?", "can function A access variable from function B?"
- → Draw the scope chain: where is each variable defined? Walk up from inner to outer.
- → Answer opens with: *"JavaScript uses lexical scope — the scope chain is determined at the time the function is written, not when it's called. So I need to look at where this function is defined in the source code."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: Three scope types above
- ➡️ Để hiểu: [Closures](./03-closures-comprehensive.md) — closure = function + scope chain

---

### 3. Hoisting in Detail / Hoisting Chi Tiết

> 🧠 **Memory Hook**:
> ```
> var       → hoisted + undefined     (usable but wrong value)
> function  → hoisted + FULL body     (ready to call immediately)
> let/const → hoisted + TDZ           (unusable until declaration line)
> class     → hoisted + TDZ           (same as let)
> ```

**Tại sao JS hoist?**
→ Vì JS engine làm 2 pass: compile phase (collect all declarations) → execute phase (run code).
→ `function declarations` được hoist fully để cho phép mutual recursion (A gọi B, B gọi A) mà không cần order function definitions.
→ `var` hoist là "accident" của design — useful nếu biết, dangerous nếu không biết.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng trước khi học sinh vào lớp, giáo viên đọc qua danh sách học sinh (compile phase). Khi lớp bắt đầu (execute phase), giáo viên đã biết tên tất cả học sinh — nhưng chưa biết đặc điểm của họ. Đây là hoisting: declarations known, values not assigned yet.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// What you write:
console.log(a);  // undefined (not ReferenceError!)
var a = 5;
console.log(a);  // 5

greet();         // ✅ works! function declaration fully hoisted
function greet() { console.log('hello'); }

// What JS engine sees (conceptually):
var a;           // declaration hoisted, value undefined
function greet() { console.log('hello'); } // fully hoisted

console.log(a);  // undefined
a = 5;           // assignment stays in place
console.log(a);  // 5
greet();         // works
```

```
Hoisting comparison table:
┌──────────────────┬────────────┬─────────────────────────────────────┐
│ Declaration      │ Hoisted?   │ Usable before declaration?          │
├──────────────────┼────────────┼─────────────────────────────────────┤
│ var x            │ ✅ yes     │ ✅ yes (but value = undefined)      │
│ function f() {}  │ ✅ yes     │ ✅ yes (full function body)         │
│ let x            │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ const x          │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ class C {}       │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ var f = () => {} │ ✅ yes     │ ✅ f hoisted (undefined), not body  │
│ let f = () => {} │ ✅ yes     │ ❌ no (TDZ)                        │
└──────────────────┴────────────┴─────────────────────────────────────┘
```

**TDZ (Temporal Dead Zone):**
```javascript
console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization
let x = 5;
// The TDZ for x starts at top of block, ends at the declaration line
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Function expression vs declaration**: `var fn = function() {}` — `fn` is hoisted (value: undefined), function body is NOT. Calling `fn()` before assignment → `TypeError: fn is not a function`
- **Class hoisting**: classes extend `let` behavior — TDZ applies. Cannot use class before declaration.
- **Hoisting in blocks**: `let`/`const` are hoisted to the TOP OF THEIR BLOCK (not function top) and enter TDZ until declaration

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "`let` is not hoisted" | let IS hoisted to top of block, just in TDZ | The TDZ error from using let before declaration is different from ReferenceError of non-existent var |
| "Function expressions are fully hoisted" | Only the variable declaration is hoisted, not the function body | `var fn = () => {}` → fn is undefined before that line |
| "Hoisting physically moves code" | Hoisting is a mental model; JS engine doesn't move code | Engine processes declarations in compile phase, executions in execute phase |

**🎯 Interview Pattern:**
- Khi thấy: "what does this log?", "why TypeError vs ReferenceError?"
- → Identify declaration type → apply hoisting rules → determine what value is accessible at that point
- → Answer opens with: *"This depends on which type of declaration. var is hoisted and initialized to undefined, so accessing it before assignment gives undefined. let/const are hoisted but in TDZ, so accessing before declaration gives ReferenceError."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: The three scope types
- ➡️ Để hiểu: [Execution Context](./16-execution-context-theory.md) — hoisting is part of creation phase

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: What is the difference between var, let, and const regarding scope? 🟢 Junior

**A:** The key difference is scope type:
- `var`: **function-scoped** — accessible anywhere within the enclosing function (ignores blocks)
- `let`: **block-scoped** — accessible only within `{}` where declared
- `const`: **block-scoped** same as let, plus the binding cannot be reassigned

```javascript
function example() {
  var a = 1;
  let b = 2;

  if (true) {
    var a = 10;  // same variable! overwrites outer a
    let b = 20;  // different variable — new block scope
    console.log(a, b); // 10, 20
  }
  console.log(a, b); // 10, 2 (var a was overwritten; let b wasn't)
}
```

**Tiếng Việt:** `var` là function-scoped — mọi block `if/for/while` đều bị ignore. `let/const` là block-scoped — mỗi `{}` tạo scope riêng. Trong loop: `var i` → 1 variable dùng chung cho tất cả iterations; `let i` → 1 variable mới mỗi iteration (quan trọng cho closures trong loop).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích được loop closure bug với var vs let, nêu const không ngăn mutation (chỉ ngăn reassignment)
- ❌ Weak: "let/const là modern hơn, dùng chúng thay var" — đúng nhưng không giải thích tại sao

---

### Q: What does this code log and why? 🟢 Junior

```javascript
console.log(x);
var x = 5;
console.log(y);
let y = 10;
```

**A:** First `console.log(x)` → `undefined`. Second `console.log(y)` → `ReferenceError`.

Why:
- `var x` is **hoisted** and initialized to `undefined` in compile phase. At runtime, the declaration has been processed but value isn't assigned yet → `undefined`.
- `let y` is **hoisted but enters TDZ** (Temporal Dead Zone). Accessing `y` before its declaration line throws `ReferenceError: Cannot access 'y' before initialization`.

**Tiếng Việt:** var được hoist VÀ khởi tạo với `undefined` → dùng trước khai báo được (nhưng value là undefined). let/const được hoist nhưng ở trong TDZ → dùng trước khai báo throw ReferenceError. TDZ là "vùng chết" từ đầu scope đến dòng khai báo — variable tồn tại nhưng không dùng được.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Phân biệt `undefined` (var) vs `ReferenceError` (let TDZ), giải thích compile phase vs execute phase
- ❌ Weak: "var prints undefined because it's undefined" — không giải thích tại sao

---

### Q: Explain the classic for-loop closure bug and all fixes 🟡 Mid

**A:** The bug:
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3 — NOT 0, 1, 2
```

Why: `var i` is function-scoped → single `i` shared by all 3 closures. Loop completes before timeouts fire → `i = 3` for all.

**Three fixes:**
```javascript
// Fix 1: let — new binding per iteration (best)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 ✅
}

// Fix 2: IIFE — manually create new scope (pre-ES6)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}

// Fix 3: forEach (avoids var loop entirely)
[0, 1, 2].forEach(i => setTimeout(() => console.log(i), 100));
```

**Tiếng Việt:** Key insight: `let` tạo **new binding per iteration** — như thể có 3 biến `i` riêng biệt cho 3 iterations. `var` chỉ có 1 biến, bị chia sẻ bởi tất cả closures.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích "shared binding vs new binding per iteration", biết cả 3 fixes và trade-offs
- ❌ Weak: Chỉ nói "dùng let" — đúng nhưng không demonstrate understanding

---

### Q: What is the Temporal Dead Zone? Give a non-obvious example 🟡 Mid

**A:** TDZ is the period between entering a scope and the variable's declaration line — accessing during TDZ throws `ReferenceError`.

Non-obvious example where TDZ bites:
```javascript
let x = 1;

function example() {
  console.log(x); // ❌ ReferenceError — NOT 1 from outer scope!
  let x = 2;      // inner x is in TDZ from function start to here
}

example();
```

Surprise: even though outer `x = 1` exists, the inner `let x` declaration **shadows** it from the top of the function block — creating TDZ for inner `x`. The outer `x` is invisible during TDZ.

**Tiếng Việt:** TDZ xảy ra ngay từ đầu scope của variable, không phải từ đầu function. Trong ví dụ trên, `let x` trong function tạo TDZ cho `x` từ đầu function đến dòng `let x = 2` — trong thời gian đó, outer `x` bị shadow. Đây là gotcha phổ biến khi refactor `var` → `let` trong legacy code.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Explain shadowing + TDZ interaction, biết TDZ starts at block entry (not function top)
- ❌ Weak: "TDZ là lỗi khi dùng let trước khai báo" — đúng nhưng bỏ qua shadowing behavior

---

### Q: Design a scope strategy for a large-scale FE codebase — minimize global pollution, maximize encapsulation 🔴 Senior

**A:** For a Grab-scale FE app with multiple teams and micro-frontends:

```javascript
// Layer 1: ES modules as scope boundary (modern, preferred)
// Each .js file is its own module scope — nothing leaks by default
export const config = { ... };  // intentionally shared
const _internal = { ... };      // module-private, never exported

// Layer 2: Object namespace for legacy code (no bundler)
const GrabApp = GrabApp || {};
GrabApp.drivers = (function() {
  const _state = {};     // private to this IIFE
  return { getState() { return _state; } };
})();

// Layer 3: Variable declaration discipline
const MAX_RETRIES = 3;    // const for values that shouldn't change
let requestCount = 0;     // let only if you need to reassign
// Never: var in new code

// Layer 4: Strict mode to catch implicit globals
'use strict'; // undeclared x = 1 → TypeError

// Layer 5: Micro-frontend sandboxing
(function(window) {
  // Isolated scope — accidental var declarations stay here
  // Each micro-frontend wrapped in its own IIFE
})(window);
```

**Tiếng Việt:** Strategy tốt nhất: (1) ES modules làm scope boundary chính, (2) `const` mặc định + `let` khi cần reassign + không bao giờ `var`, (3) `'use strict'` để catch accidental globals, (4) IIFE namespace cho legacy code không có bundler, (5) IIFE wrapping cho micro-frontends. Với Tree-shaking: ES modules cho phép bundler xóa unused exports — IIFE namespace không tree-shakeable.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Phân layer (ES modules > IIFE > strict mode), xét micro-frontend scale, mention tree-shaking implications
- ❌ Weak: "Dùng let/const và modules" — quá đơn giản cho Senior level, thiếu scale/team considerations

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| var vs let vs const scope | 🟢 | var = function scope, let/const = block scope; const only prevents reassignment |
| Hoisting code output | 🟢 | var → undefined; let/const → ReferenceError (TDZ) |
| for-loop closure bug | 🟡 | var = shared binding; let = new binding per iteration; 3 fixes |
| TDZ non-obvious example | 🟡 | inner let shadows outer var from top of block; TDZ + shadowing interaction |
| Large-scale scope strategy | 🔴 | ES modules > IIFE > strict mode; layers for legacy + modern; tree-shaking awareness |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Why does this `for` loop with `var` print 3, 3, 3 instead of 0, 1, 2?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "This is a classic scope + closure interaction bug — `var` is function-scoped, so all 3 iterations share the exact same `i` variable."
2. "The loop finishes executing synchronously before any of the setTimeout callbacks run, so by the time they fire, `i` has already reached its final value of 3."
3. "Each closure captures a reference to `i`, not a copy of its value — so all 3 closures print 3."
4. "The fix: change `var` to `let` — block-scoped `let` creates a new binding per iteration, so each closure captures its own separate `i`."

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close this doc before attempting.**

- [ ] **Retrieval**: Không nhìn lại — viết ra: `var` scope là gì? `let` scope là gì? Khác nhau điểm gì trong for-loop?
- [ ] **Visual**: Vẽ scope chain cho đoạn code này từ trí nhớ: `const x = 1; function a() { const y = 2; function b() { console.log(x, y); } }` — b() tìm x và y ở đâu?
- [ ] **Application**: Code này print gì: `console.log(typeof undeclaredVar)` vs `console.log(typeof letVar); let letVar = 1`? Tại sao khác nhau?
- [ ] **Debug**: Bạn refactor code từ `var` sang `let` trong 1 function và bắt đầu thấy `ReferenceError`. Nguyên nhân có thể là gì?
- [ ] **Teach**: Giải thích cho người không biết lập trình tại sao `var` trong for-loop gây bug, dùng analogy "nhân viên dùng chung notepad".

💬 **Feynman Prompt:** Giải thích Temporal Dead Zone cho 1 người chưa bao giờ code. Không dùng từ "hoisting", "TDZ", "scope" — chỉ dùng analogy thực tế.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [JavaScript Basics](./00-javascript-basics.md) — variable declarations (var/let/const)
- ➡️ **Enables:** [Closures](./03-closures-comprehensive.md) — closure captures the scope chain defined here
- ➡️ **Enables:** [Execution Context](./16-execution-context-theory.md) — hoisting is part of creation phase
- 🔗 **Applied in:** Every JS file — scope decisions affect performance (closures), correctness (TDZ), and maintainability (var bugs)
