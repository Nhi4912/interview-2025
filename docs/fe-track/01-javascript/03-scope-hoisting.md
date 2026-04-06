# Scope & Hoisting / Phạm Vi & Kéo Lên

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Variables & Types](./02-variables-types.md)
> **See also**: [Closures](./04-closures.md) | [Execution Context](./09-execution-context.md)
> **L5 Competencies**: Variable lifecycle mastery, scope-based architecture, TDZ debugging

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki cart animation bug (production):**

```javascript
// BUG: tất cả animation hiện cùng 1 item cuối
for (var i = 0; i < cartItems.length; i++) {
  setTimeout(() => showItemAnimation(i), i * 100);
}
// Kết quả: tất cả callback log cartItems.length — sai hoàn toàn
```

Senior engineer đã approve PR này — 3000 users thấy animation bị lỗi. Root cause: `var i` là **function-scoped** → tất cả closures **share chung 1 biến `i`** → loop kết thúc trước khi setTimeout fires → `i = cartItems.length` cho tất cả.

Fix: đổi 1 từ — `var` → `let`. Block-scoped `let` tạo **binding mới cho mỗi iteration**.

**Bài học:** Không hiểu scope → shipping bugs mà code review không catch được.

---

## What & Why / Cái Gì & Tại Sao

**Analogy:** Hãy tưởng tượng **tòa nhà văn phòng**:

- **Global scope** = bảng thông báo ở lobby → ai cũng thấy, ai cũng sửa được → dễ xung đột
- **Function scope** = phòng làm việc riêng → chỉ người trong phòng thấy
- **Block scope** = ngăn kéo trong phòng → chỉ khi mở ngăn kéo mới thấy

**Tại sao JS cần scope?**
→ Nếu không có scope, mọi biến đều global → 2 files dùng cùng tên `i` sẽ đè nhau.
→ Library code không nên nhìn thấy user's code và ngược lại.

**Hoisting là gì?** JS engine làm **2 pass**: compile phase (đọc hết khai báo) → execute phase (chạy code). Giống thầy giáo đọc danh sách học sinh trước khi bắt đầu giờ học — biết tên nhưng chưa biết đặc điểm.

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
        └─────────────┴─────────────┘
                      │
                 SCOPE CHAIN
              (inner → outer → global)
                      │
              ┌───────┴───────┐
              ▼               ▼
         CLOSURES         HOISTING
       (capture scope)   (compile phase)
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
  var       function   let/const
  undefined  full body   TDZ
```

---

## Overview / Tổng Quan

**Scope** quyết định biến nào truy cập được từ đâu. **Hoisting** là hành vi JS engine "kéo" declarations lên đầu scope trong compile phase. Hiểu đúng 2 khái niệm này giải thích được 80% bugs mà junior developers gặp phải với `var`, function declarations, và TDZ errors.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Ba Loại Scope / The Three Scope Types

> 🧠 **Memory Hook**: **`var` = tờ giấy phòng khách (function scope). `let/const` = tờ giấy ngăn kéo (block scope). `var` chỉ biết 2 loại scope (global + function). `let/const` biết cả 3.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao cần scope? → Vì nếu mọi biến đều global, 2 files dùng cùng tên `i` sẽ conflict. Scope = hệ thống phòng riêng tư.

**Level 2:** Tại sao có 3 loại? → Global: chia sẻ giữa files (hạn chế). Function: mỗi function là sandbox riêng — đây là scope gốc của JS. Block: `let` ES6 thêm vào để `i` trong for-loop không leak ra ngoài → giải quyết class of bugs mà `var` gây ra.

#### Layer 1: Analogy / Liên Tưởng

| Scope    | Analogy                | Đặc điểm                          |
| -------- | ---------------------- | --------------------------------- |
| Global   | Bảng tin lobby tòa nhà | Ai cũng thấy, dễ đè nhau          |
| Function | Phòng làm việc riêng   | Ngoài phòng không nhìn vào được   |
| Block    | Ngăn kéo trong phòng   | `{}` mở ra → thấy, đóng lại → mất |

#### Layer 2: How It Works / Cơ Chế

```javascript
var globalVar = "lobby"; // accessible everywhere

function myRoom() {
  var roomVar = "my room"; // only inside myRoom()

  if (true) {
    var stillRoom = "var ignores blocks"; // ← vẫn function-scoped!
    let blockOnly = "block-scoped"; // ← chỉ sống trong {} này
    console.log(blockOnly); // ✅
  }
  console.log(stillRoom); // ✅ var xuyên thấu block
  console.log(blockOnly); // ❌ ReferenceError — let đã chết
}
```

```
Scope boundaries — var vs let/const:
┌─────────────────────────────────────────────┐
│ function myRoom() {         function scope  │
│   var x;  ◄─────── x sống ở đây            │
│   if (true) {   block scope                 │
│     var y;   ◄── y vẫn sống ở function!     │
│     let z;   ◄── z CHỈ sống trong block này │
│   }                                         │
│   console.log(y); // ✅ var xuyên blocks    │
│   console.log(z); // ❌ ReferenceError      │
│ }                                           │
└─────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- `var` trong `for` loop inside function → scoped to **function**, không phải loop body
- `let` trong `for` loop → **new binding per iteration** — key cho closure-in-loop
- `const` là block-scoped nhưng **reference** là const, không phải **content** — `const arr = []; arr.push(1)` vẫn OK

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                               | Tại sao sai                                | Đúng                                               |
| --------------------------------- | ------------------------------------------ | -------------------------------------------------- |
| "`var` trong `if` scope đến `if`" | var là function-scoped, bỏ qua mọi block   | var leak ra khỏi mọi block trừ function            |
| "`const` = immutable"             | const chỉ khóa binding, không khóa content | `const obj = {}; obj.x = 1` hợp lệ                 |
| "`let/const` không hoisted"       | Chúng CÓ hoisted, nhưng nằm trong TDZ      | `typeof letVar` trước declaration → ReferenceError |

#### 🎯 Interview Pattern

- **Trigger:** "what scope does this variable have?", "why does this print X?"
- **Concept:** Xác định keyword (`var`/`let`/`const`) → xác định scope boundary
- **Opening:** _"var là function-scoped nên bỏ qua block boundaries. let/const là block-scoped, tạo binding mới cho mỗi block."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** [Variables & Types](./02-variables-types.md) — var/let/const declarations
- ➡️ **Để hiểu:** [Closures](./04-closures.md) — closure capture scope chain

---

### 2. Scope Chain & Lexical Scope / Chuỗi Scope

> 🧠 **Memory Hook**: **Scope chain = tìm sách: phòng mình → nhà → thư viện. Luôn đi LÊN, không bao giờ đi XUỐNG. Xác định lúc VIẾT code, không phải lúc GỌI.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao cần scope chain? → Inner function cần truy cập outer variables. Nếu không có lookup chain, mọi function phải truyền hết parameters.

**Level 2:** Tại sao lexical (static) chứ không dynamic? → Nếu scope được xác định lúc runtime (dynamic), behavior thay đổi tùy ai gọi → rất khó predict. Lexical scope: behavior xác định lúc viết code → dễ reason about. Design decision của Brendan Eich 1995, vẫn đúng 2026.

#### Layer 1: Analogy / Liên Tưởng

Bạn cần tìm cuốn sách:

1. Tìm trên bàn mình (inner scope) → có → dùng
2. Không có → tìm trong phòng (outer scope)
3. Vẫn không → tìm thư viện công cộng (global)
4. Không có ở đâu → `ReferenceError`

Scope chain **chỉ đi lên**, outer scope **không bao giờ** nhìn vào inner scope.

#### Layer 2: How It Works / Cơ Chế

```javascript
const ENV = "production"; // global scope

function getConfig() {
  const baseUrl = "https://api.com"; // getConfig scope

  function buildUrl(path) {
    // buildUrl scope: không có baseUrl, không có ENV
    // → lookup UP: baseUrl found in getConfig scope ✅
    // → lookup UP: ENV found in global scope ✅
    return `${baseUrl}/${path}?env=${ENV}`;
  }

  return buildUrl("/drivers");
}
```

```
Scope chain lookup cho 'baseUrl' inside buildUrl:

┌─── GLOBAL SCOPE ────────────────────────────────────┐
│ const ENV = 'production'                             │
│                                                      │
│  ┌─── getConfig() SCOPE ─────────────────────────┐  │
│  │ const baseUrl = 'https://api.com'              │  │
│  │                                                │  │
│  │  ┌─── buildUrl() SCOPE ────────────────────┐  │  │
│  │  │ const path = '/drivers'                 │  │  │
│  │  │                                         │  │  │
│  │  │ baseUrl → not here → look UP ▲ → FOUND  │  │  │
│  │  │ ENV → not here → UP ▲ → UP ▲ → FOUND    │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘

KEY RULES:
→ Lookup: inner → outer → global → ReferenceError
→ One-way: outer CANNOT see inner
→ Fixed at WRITE time (lexical), not CALL time
→ Shadowing: cùng tên ở inner scope sẽ hide outer variable
```

**Lexical vs Dynamic — trắc nghiệm:**

```javascript
const x = "global";

function foo() {
  console.log(x); // → ?
}

function bar() {
  const x = "bar";
  foo(); // Lexical scope: foo tìm x ở NƠI NÓ ĐƯỢC VIẾT → global → "global"
  // Dynamic scope (giả sử): foo tìm x ở NƠI NÓ ĐƯỢC GỌI → bar → "bar"
}

bar(); // → "global" (JS dùng lexical scope)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- `with` (deprecated): tạo dynamic scope trong JS — bị cấm trong strict mode
- `eval("var x = 1")`: inject variable vào surrounding scope — lý do nên cấm eval
- Arrow functions: KHÔNG có `this` riêng, nhưng CÓ scope chain riêng (giống regular function cho variable lookup)

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                                      | Tại sao sai                                        | Đúng                                                                     |
| ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| "Scope function phụ thuộc nơi gọi"       | JS dùng lexical scope — xác định nơi VIẾT          | Function A viết trong file X → scope chain từ file X, bất kể gọi ở đâu   |
| "Inner và outer scope truy cập lẫn nhau" | One-way: inner → outer. Outer KHÔNG thể nhìn inner | Scope chain chỉ đi lên                                                   |
| "`this` tuân theo lexical scope"         | `this` là dynamic (set by call site)               | Arrow function's `this` là lexical; regular function's `this` là dynamic |

#### 🎯 Interview Pattern

- **Trigger:** "what does this log?", "can function A see variable from function B?"
- **Concept:** Vẽ scope chain → tìm từ inner ra outer
- **Opening:** _"JavaScript dùng lexical scope — scope chain xác định lúc viết code, không phải lúc gọi. Tôi cần xem function được viết ở đâu."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** Ba loại scope ở trên
- ➡️ **Để hiểu:** [Closures](./04-closures.md) — closure = function + scope chain

---

### 3. Hoisting Chi Tiết / Hoisting in Detail

> 🧠 **Memory Hook**:
>
> ```
> var       → hoisted + undefined     (dùng được nhưng giá trị sai)
> function  → hoisted + FULL body     (gọi được ngay)
> let/const → hoisted + TDZ           (không dùng được cho đến dòng khai báo)
> class     → hoisted + TDZ           (giống let)
> ```

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao JS hoist? → Vì engine làm 2 pass: compile phase (collect declarations) → execute phase (run code). Declarations được "nhìn thấy" trước khi code chạy.

**Level 2:** Tại sao function declaration hoisted fully? → Để cho phép **mutual recursion** — function A gọi B, B gọi A — mà không cần order function definitions. `var` hoist là "accident" của design — useful nếu biết, dangerous nếu không.

#### Layer 1: Analogy / Liên Tưởng

Trước buổi học, giáo viên **đọc danh sách học sinh** (compile phase):

- `var` students: biết tên, ghi "có mặt" (undefined)
- `function` students: biết tên VÀ đặc điểm (full body)
- `let/const` students: biết tên nhưng **chưa check in** → nếu gọi lên sẽ báo lỗi (TDZ)

Khi lớp bắt đầu (execute phase), giáo viên đã biết ai sẽ có mặt.

#### Layer 2: How It Works / Cơ Chế

```javascript
// Code bạn viết:
console.log(a); // undefined — var hoisted
var a = 5;
console.log(a); // 5

greet(); // ✅ works — function fully hoisted
function greet() {
  console.log("hello");
}

console.log(b); // ❌ ReferenceError — TDZ
let b = 10;
```

```javascript
// JS engine thấy (conceptually):
var a; // declaration hoisted, value undefined
function greet() {
  console.log("hello");
} // fully hoisted

console.log(a); // undefined
a = 5; // assignment stays in place
console.log(a); // 5
greet(); // works
console.log(b); // ❌ ReferenceError (b hoisted but in TDZ)
let b = 10; // TDZ ends here
```

```
Hoisting comparison table:
┌──────────────────┬────────────┬─────────────────────────────────────┐
│ Declaration      │ Hoisted?   │ Usable before declaration?          │
├──────────────────┼────────────┼─────────────────────────────────────┤
│ var x            │ ✅ yes     │ ✅ yes (value = undefined)          │
│ function f() {}  │ ✅ yes     │ ✅ yes (full body, callable)        │
│ let x            │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ const x          │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ class C {}       │ ✅ yes     │ ❌ no (TDZ → ReferenceError)       │
│ var f = () => {} │ ✅ var     │ ⚠️ f = undefined → TypeError       │
└──────────────────┴────────────┴─────────────────────────────────────┘
```

**TDZ (Temporal Dead Zone) — visualization:**

```
  let x / const x:
  ┌─── TOP OF BLOCK ─────────────────────────────────┐
  │                                                   │
  │   ◄═══════ TEMPORAL DEAD ZONE (TDZ) ═══════►     │
  │                                                   │
  │   console.log(x)   →  ReferenceError ✗            │
  │   typeof x         →  ReferenceError ✗ (!)        │
  │                                                   │
  │   let x = 5;  ◄── TDZ ends at declaration line    │
  │                                                   │
  │   ◄═══════ SAFE TO USE ════════════════════►      │
  │                                                   │
  │   console.log(x)   →  5 ✓                         │
  └─── END OF BLOCK ──────────────────────────────────┘
```

#### Layer 3: Edge Cases / Trường Hợp Biên

**TDZ shadowing gotcha — dễ gặp khi refactor var → let:**

```javascript
let x = 1;

function example() {
  console.log(x); // ❌ ReferenceError — NOT 1!
  let x = 2; // inner x shadow outer x, TDZ từ đầu function
}
```

Surprise: dù outer `x = 1` tồn tại, inner `let x` **shadow** nó từ đầu function block → TDZ cho inner `x`. Outer `x` bị invisible.

- **Function expression vs declaration:** `var fn = () => {}` → `fn` hoisted (undefined), body KHÔNG → gọi `fn()` trước → `TypeError: fn is not a function`
- **Class hoisting:** classes extend `let` behavior → TDZ applies
- `let/const` hoisted to TOP OF BLOCK (không phải function top)

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                                 | Tại sao sai                                      | Đúng                                               |
| ----------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| "`let` không hoisted"               | let CÓ hoisted, nhưng nằm trong TDZ              | TDZ error ≠ undeclared error — 2 loại khác nhau    |
| "Function expression fully hoisted" | Chỉ variable declaration hoisted, body thì không | `var fn = () => {}` → fn = undefined trước dòng đó |
| "Hoisting di chuyển code lên"       | Hoisting là mental model, engine không move code | Engine xử lý declarations trong compile phase      |

#### 🎯 Interview Pattern

- **Trigger:** "what does this log?", "why TypeError vs ReferenceError?"
- **Concept:** Xác định declaration type → apply hoisting rules → determine value tại thời điểm đó
- **Opening:** _"Phụ thuộc loại declaration. var hoisted + initialized undefined. let/const hoisted nhưng TDZ → ReferenceError. Function declaration fully hoisted."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** Ba loại scope
- ➡️ **Để hiểu:** [Execution Context](./09-execution-context.md) — hoisting là creation phase

---

### 4. Classic For-Loop Bug / Bug Kinh Điển For-Loop

> 🧠 **Memory Hook**: **`var` trong loop = tất cả nhân viên dùng chung 1 tờ notepad. `let` = mỗi người có notepad riêng.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao bug này xảy ra? → `var` là function-scoped → chỉ có 1 biến `i` dùng chung cho tất cả iterations → closures capture reference, không phải value.

**Level 2:** Tại sao `let` fix được? → `let` là block-scoped, và `for` loop spec đặc biệt: mỗi iteration tạo **new binding** cho `let i` → mỗi closure capture `i` riêng biệt. Đây là spec behavior, không phải implementation detail.

#### Layer 1: Analogy / Liên Tưởng

3 nhân viên giao hàng, mỗi người nhận số thứ tự:

- **`var`**: Tất cả nhìn CHUNG 1 bảng số. Khi giao hàng (setTimeout), số đã đổi thành 3 → ai cũng giao đơn số 3.
- **`let`**: Mỗi người **chụp ảnh** số riêng. Khi giao hàng, nhìn ảnh → đúng số.

#### Layer 2: How It Works / Cơ Chế

```javascript
// BUG: var — shared binding
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 — NOT 0, 1, 2

// FIX 1: let — new binding per iteration (best)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2 ✅

// FIX 2: IIFE — manually create scope (pre-ES6)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
// Output: 0, 1, 2 ✅

// FIX 3: forEach — avoid var loop entirely
[0, 1, 2].forEach((i) => setTimeout(() => console.log(i), 100));
// Output: 0, 1, 2 ✅
```

```
var loop — 1 binding shared:
Iteration 0: closure captures → [i] ← same i
Iteration 1: closure captures → [i] ← same i
Iteration 2: closure captures → [i] ← same i
Loop ends: i = 3
All callbacks fire: console.log(3), console.log(3), console.log(3)

let loop — new binding per iteration:
Iteration 0: closure captures → [i₀ = 0]
Iteration 1: closure captures → [i₁ = 1]
Iteration 2: closure captures → [i₂ = 2]
Callbacks fire: console.log(0), console.log(1), console.log(2)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- `const` trong `for...of`/`for...in` loop: OK vì mỗi iteration là new binding, không reassign
- `const` trong `for(;;)` loop: ❌ error khi `i++` — const không thể reassign
- Real production: bug này vẫn xuất hiện trong legacy code 2026

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                     | Tại sao sai                                              | Đúng                                        |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------- |
| "setTimeout gây bug"    | setTimeout chỉ delay execution, bug là do scope          | var sharing + closure = bug                 |
| "Closure capture value" | Closure capture REFERENCE tới variable, không phải value | Cùng reference + variable thay đổi = stale  |
| "`let` tạo copy"        | let tạo NEW BINDING, không phải copy                     | Spec behavior: mỗi iteration có own binding |

#### 🎯 Interview Pattern

- **Trigger:** "why does this loop print 3,3,3?", "fix this closure bug"
- **Concept:** var shared binding vs let new binding per iteration
- **Opening:** _"var là function-scoped nên chỉ có 1 biến i chia sẻ bởi tất cả closures. Loop kết thúc trước khi callbacks chạy → i đã thành giá trị cuối."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** Function scope vs block scope, hoisting
- ➡️ **Để hiểu:** [Closures](./04-closures.md) — closure giữ reference tới scope chain

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### 🟢 Q1: var, let, const khác nhau thế nào về scope?

**A:**

- `var`: **function-scoped** — truy cập được anywhere trong enclosing function (bỏ qua blocks)
- `let`: **block-scoped** — chỉ truy cập được trong `{}` nơi khai báo
- `const`: **block-scoped** giống let, thêm: binding không thể reassign

```javascript
function example() {
  var a = 1;
  let b = 2;

  if (true) {
    var a = 10; // CÙNG biến! ghi đè outer a
    let b = 20; // biến KHÁC — block scope mới
    console.log(a, b); // 10, 20
  }
  console.log(a, b); // 10, 2 (var a bị ghi đè; let b không)
}
```

💡 **Interview Signal:**

- ✅ Strong: Giải thích loop closure bug + const không ngăn mutation
- ❌ Weak: "let/const modern hơn, thay var" — đúng nhưng không giải thích tại sao

---

### 🟢 Q2: Code này log gì? Tại sao?

```javascript
console.log(x);
var x = 5;
console.log(y);
let y = 10;
```

**A:** `console.log(x)` → `undefined`. `console.log(y)` → `ReferenceError`.

- `var x` hoisted VÀ initialized `undefined` → dùng trước khai báo = undefined
- `let y` hoisted nhưng **TDZ** → dùng trước khai báo = ReferenceError

💡 **Interview Signal:**

- ✅ Strong: Phân biệt `undefined` (var) vs `ReferenceError` (let TDZ), giải thích compile phase
- ❌ Weak: "var in undefined vì undefined" — circular, không giải thích mechanism

---

### 🟡 Q3: Giải thích for-loop closure bug và tất cả cách fix

**A:** Bug:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// → 3, 3, 3 (not 0, 1, 2)
```

Root cause: `var i` function-scoped → 1 biến i shared bởi 3 closures. Loop xong i = 3 → all print 3.

**3 fixes:** (1) `let i` — new binding per iteration, (2) IIFE wrap, (3) `forEach`.

Key insight: `let` tạo **new binding per iteration** — spec behavior, không phải copy.

💡 **Interview Signal:**

- ✅ Strong: "shared binding vs new binding per iteration", biết 3 fixes + trade-offs
- ❌ Weak: Chỉ nói "dùng let" — không demonstrate understanding

---

### 🟡 Q4: TDZ là gì? Cho ví dụ non-obvious

**A:** TDZ là period từ đầu scope đến dòng khai báo — truy cập trong TDZ → ReferenceError.

Non-obvious example:

```javascript
let x = 1;
function example() {
  console.log(x); // ❌ ReferenceError — NOT 1!
  let x = 2; // inner x shadow outer x từ đầu function
}
```

Dù outer `x = 1` tồn tại, inner `let x` shadow nó từ đầu function block. Outer `x` bị invisible.

💡 **Interview Signal:**

- ✅ Strong: Giải thích shadowing + TDZ interaction
- ❌ Weak: "TDZ là lỗi khi dùng let trước khai báo" — bỏ qua shadowing

---

### 🟡 Q5: `typeof` với undeclared vs TDZ variable — khác gì?

**A:**

```javascript
console.log(typeof undeclaredVar); // "undefined" — safe, không throw
console.log(typeof letVar); // ❌ ReferenceError — TDZ!
let letVar = 1;
```

`typeof` KHÔNG safe cho TDZ variables. Đây là khác biệt giữa **undeclared** (không tồn tại) vs **uninitialized** (tồn tại nhưng trong TDZ).

Engine biết `letVar` tồn tại (hoisted) nhưng chưa initialized → TDZ → error. `undeclaredVar` hoàn toàn không tồn tại → `typeof` trả về `"undefined"` như safety feature.

💡 **Interview Signal:**

- ✅ Strong: Phân biệt undeclared vs uninitialized, biết typeof safety
- ❌ Weak: "typeof luôn safe" — sai với TDZ

---

### 🔴 Q6: Design scope strategy cho large-scale FE codebase

**A:** Cho Grab-scale app với multiple teams và micro-frontends:

```javascript
// Layer 1: ES modules (modern, preferred)
export const config = {}; // intentionally shared
const _internal = {}; // module-private

// Layer 2: IIFE namespace (legacy, no bundler)
const GrabApp = GrabApp || {};
GrabApp.drivers = (function () {
  const _state = {};
  return {
    getState() {
      return _state;
    },
  };
})();

// Layer 3: Declaration discipline
const MAX_RETRIES = 3; // const default
let requestCount = 0; // let chỉ khi reassign
// Never: var in new code

// Layer 4: Strict mode
("use strict"); // undeclared assignment → TypeError

// Layer 5: Micro-frontend sandboxing
(function (window) {
  // IIFE per micro-frontend → accidental globals stay here
})(window);
```

Strategy: ES modules > IIFE > strict mode. Tree-shaking: ES modules cho phép bundler xóa unused exports — IIFE namespace không tree-shakeable.

💡 **Interview Signal:**

- ✅ Strong: Phân layer strategy, xét scale/team, mention tree-shaking
- ❌ Weak: "Dùng let/const và modules" — quá đơn giản cho Senior

**Follow-up Chain:**

1. "Module scope resolve thế nào khi 2 micro-frontends share dependency?"
2. "Bạn handle global state sharing giữa micro-frontends thế nào?"
3. "Nếu legacy code dùng script tags (không module), migration path là gì?"

---

### 🔴 Q7: Function hoisting priority — giải thích output

```javascript
console.log(typeof foo); // ?
var foo = "string";
function foo() {
  return 1;
}
console.log(typeof foo); // ?
```

**A:**

- First `typeof foo`: `"function"` — function declarations hoisted WITH body, override var hoisting
- Second `typeof foo`: `"string"` — assignment `foo = "string"` overwrites at runtime

**Hoisting order:**

1. Function declaration `foo` hoisted fully → foo = function
2. `var foo` hoisted → nhưng KHÔNG override (function wins in compile phase)
3. Runtime: `foo = "string"` assignment → ghi đè function

```
Compile phase:
  var foo;           // hoisted
  function foo() {}  // hoisted + overrides var

Execute phase:
  console.log(typeof foo);  // "function" (from compile)
  foo = "string";           // reassign at runtime
  // function declaration already processed — no effect here
  console.log(typeof foo);  // "string"
```

💡 **Interview Signal:**

- ✅ Strong: Biết function declaration wins over var in compile, runtime assignment overwrites
- ❌ Weak: "function hoisted, var not" — sai, cả hai đều hoisted

**Follow-up Chain:**

1. "Nếu có 2 function declarations cùng tên, cái nào thắng?"
2. "Tại sao class declaration không override var?"
3. "Trong strict mode, duplicate function declaration behavior khác thế nào?"

---

### 🔴 Q8: Debug scope bug trong production — trace và fix

**Scenario:** Team refactor legacy module từ `var` sang `let/const`. After deploy, random `ReferenceError` trên production. Không phải mọi user đều gặp — chỉ khi specific feature flag bật.

```javascript
// Before refactor (worked):
function processOrder(order) {
  if (featureFlags.newPricing) {
    var discount = calculateDiscount(order);
  }
  // ... 50 lines later
  return order.total - (discount || 0);
}

// After refactor (breaks):
function processOrder(order) {
  if (featureFlags.newPricing) {
    let discount = calculateDiscount(order);
  }
  return order.total - (discount || 0); // ❌ ReferenceError when flag is ON
}
```

**A:** Root cause: `var discount` → function-scoped, accessible everywhere. `let discount` → block-scoped to `if {}`, dies outside.

Fix: move declaration outside block:

```javascript
function processOrder(order) {
  let discount = 0;
  if (featureFlags.newPricing) {
    discount = calculateDiscount(order);
  }
  return order.total - discount;
}
```

**Debug strategy:**

1. Search codebase: `var` → `let/const` trong conditional blocks
2. Check if variable used OUTSIDE the block → break candidate
3. Automated: ESLint `no-use-before-define` + `block-scoped-var`

💡 **Interview Signal:**

- ✅ Strong: Identify var→let scope change, systematic search strategy, ESLint prevention
- ❌ Weak: "Just use var" — reverting, không giải quyết root cause

**Follow-up Chain:**

1. "Bạn viết codemod tự động detect pattern này thế nào?"
2. "Testing strategy nào catch được scope bugs trước deploy?"
3. "Feature flag interaction với scope — design pattern tốt hơn là gì?"

---

## Interview Q&A Summary / Tổng Kết

| #   | Question                   | Level | Key Point                                              |
| --- | -------------------------- | ----- | ------------------------------------------------------ |
| Q1  | var/let/const scope        | 🟢    | var = function, let/const = block, const ngăn reassign |
| Q2  | Hoisting output            | 🟢    | var → undefined, let → ReferenceError (TDZ)            |
| Q3  | For-loop closure bug       | 🟡    | var shared binding, let new binding per iteration      |
| Q4  | TDZ non-obvious            | 🟡    | Inner let shadows outer, TDZ từ đầu block              |
| Q5  | typeof + TDZ               | 🟡    | typeof unsafe cho TDZ, safe cho undeclared             |
| Q6  | Large-scale scope strategy | 🔴    | ES modules > IIFE > strict mode, tree-shaking          |
| Q7  | Function hoisting priority | 🔴    | Function declaration wins var in compile               |
| Q8  | Debug scope bug            | 🔴    | var→let refactor breaks conditional access             |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi bất ngờ: **"Tại sao for loop với var in ra 3, 3, 3 thay vì 0, 1, 2?"**

**30 giây đầu:**

1. "Đây là classic scope + closure bug — `var` là function-scoped, nên cả 3 iterations share chung CÙNG 1 biến `i`."
2. "Loop chạy xong synchronously trước khi bất kỳ setTimeout callback nào fire. Khi chúng chạy, `i` đã là 3."
3. "Mỗi closure capture **reference** tới `i`, không phải copy value — nên cả 3 in ra 3."
4. "Fix: đổi `var` sang `let` — block-scoped `let` tạo binding mới mỗi iteration, mỗi closure có `i` riêng."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                          |
| --- | -------------- | ------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Viết ra: `var` scope là gì? `let` scope là gì? Khác nhau gì trong for-loop?                      |
| 2   | 🎨 Visual      | Vẽ scope chain: `const x = 1; function a() { const y = 2; function b() { console.log(x, y); } }` |
| 3   | 🛠️ Application | `console.log(typeof undeclaredVar)` vs `console.log(typeof letVar); let letVar = 1` — output?    |
| 4   | 🐛 Debug       | Refactor `var` → `let`, bắt đầu thấy ReferenceError. Nguyên nhân?                                |
| 5   | 🎓 Teach       | Giải thích cho người không biết lập trình tại sao `var` trong loop gây bug                       |

> 🎯 **Feynman Prompt:** Giải thích TDZ cho người chưa bao giờ code. Không dùng từ "hoisting", "TDZ", "scope".
> 🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Tiki — `var` in Loop Caused All Analytics Events to Report Same Index

**Situation:** Tiki's product listing page tracked "product card viewed" events using click handlers attached in a `for` loop. All click events reported `productIndex = 5` regardless of which card was clicked — the last index from the loop.

**What went wrong:**
```javascript
// Old code with var:
for (var i = 0; i < products.length; i++) {
  cards[i].addEventListener('click', function() {
    trackEvent('product_click', { index: i }); // ❌ closure captures var i
    // By the time any click fires, the loop has finished → i = products.length = 5
  });
}

// Fix with let:
for (let i = 0; i < products.length; i++) {
  cards[i].addEventListener('click', function() {
    trackEvent('product_click', { index: i }); // ✅ each iteration gets its own i binding
  });
}
```

**Decision made:** ESLint rule `no-var` enforced across all frontend code. A migration script replaced all `var` declarations with `let`/`const`. Senior engineers reviewed all `for` loops touching async callbacks or event handlers specifically.

**Trade-off accepted:** The `no-var` rule occasionally required adding block scopes `{}` around code that relied on `var`'s function-scoping for intentional hoisting. These were edge cases reviewed individually.

**Lesson:** The `var` closure-in-loop bug is the most common JavaScript interview question precisely because it trips up developers at all levels in production. `let`/`const` in `for` loops is not a style choice — it's a correctness requirement.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Variables & Types](./02-variables-types.md) — var/let/const declarations
- ➡️ **Enables:** [Closures](./04-closures.md) — closure captures scope chain
- ➡️ **Enables:** [Execution Context](./09-execution-context.md) — hoisting = creation phase
- 🔗 **Applied in:** Mọi JS file — scope decisions ảnh hưởng performance (closures), correctness (TDZ), maintainability (var bugs)

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Language Fundamentals](../../be-track/01-golang/01-language-fundamentals.md) — Go has block scoping like `let`/`const` with no hoisting; Go `:=` creates a new binding in current scope — same concept, no surprises
- 🔗 **FE — TypeScript**: [TypeScript Basics](../02-typescript/01-type-system-basics.md) — `noImplicitAny` + `strict` catches variable declaration bugs at compile time that TDZ only catches at runtime
- 🔗 **FE — React**: [React Hooks](../03-react/03-hooks-deep-dive.md) — stale closures in `useEffect` are a direct consequence of lexical scoping; understanding TDZ prevents hook dependency array bugs
- 🔗 **Shared theory**: [OS Theory](../../shared/01-cs-fundamentals/os-theory.md) — scope chain maps to call stack frames; each function call pushes a new execution frame with its own variable bindings

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **`var` is function-scoped and ignores block boundaries; `let`/`const` are block-scoped and die outside their `{}` / `var` là function-scoped, bỏ qua mọi block; `let`/`const` là block-scoped, chết ngoài `{}`.**
- **JavaScript uses lexical (static) scope — the scope chain is determined at write time, not call time / JavaScript dùng lexical scope — scope chain xác định lúc viết code, không phải lúc gọi.**
- **Scope chain lookup goes inner → outer → global and is one-way — outer scope cannot see into inner scope / Scope chain đi từ trong ra ngoài — outer scope không nhìn vào được inner scope.**
- **Hoisting is a 2-pass process: compile phase creates bindings, execute phase runs code line by line / Hoisting là 2 pass: compile phase tạo binding, execute phase chạy code từng dòng.**
- **`let`/`const` ARE hoisted but enter TDZ — accessing them before their declaration line throws `ReferenceError`, not `undefined` / `let`/`const` CÓ hoisted nhưng vào TDZ — truy cập trước dòng khai báo throw `ReferenceError`, không phải `undefined`.**
- **Classic `var` loop bug: all closures share one `i` binding; loop ends before callbacks fire → all print the final value / Bug `var` trong loop: tất cả closures share 1 binding `i`; loop xong trước khi callbacks chạy → tất cả in giá trị cuối.**
- **`let` in a `for` loop creates a new binding per iteration — each closure captures its own `i` (spec behavior, not a copy) / `let` trong for-loop tạo binding mới mỗi iteration — mỗi closure capture `i` riêng (spec behavior, không phải copy).**
- **Function declarations win over `var` in the compile phase — a `var foo` and `function foo(){}` in the same scope: the function survives / Function declaration thắng `var` trong compile phase — khi cùng tên, function tồn tại.**

### Interview Tips / Mẹo Phỏng Vấn

- **For the loop bug, say "shared binding vs new binding per iteration" — this shows you understand the spec, not just the fix / Với bug loop, nói "shared binding vs new binding per iteration" — thể hiện hiểu spec, không chỉ biết cách fix.**
- **Distinguish `typeof undeclaredVar` (safe — returns `"undefined"`) from `typeof letVar` before its declaration (throws ReferenceError in TDZ) — many candidates miss this / Phân biệt `typeof undeclaredVar` (an toàn) với `typeof letVar` trước khai báo (ReferenceError trong TDZ) — nhiều ứng viên bỏ qua.**
- **For scope chain questions: always start with "lexical scope — determined at write time" to signal the right mental model / Với câu hỏi về scope chain: luôn bắt đầu bằng "lexical scope — xác định lúc viết code" để thể hiện mental model đúng.**
- **When asked about `var` bugs in production, mention the `no-var` ESLint rule and tree-shakeable ES modules as the modern solution / Khi hỏi bug `var` trong production, đề cập ESLint `no-var` và ES modules là giải pháp hiện đại.**
- **TDZ shadowing gotcha: inner `let x` shadows outer `x` from the top of its block — accessing outer `x` inside becomes a ReferenceError / TDZ shadowing: inner `let x` shadow outer `x` từ đầu block — truy cập outer `x` bên trong là ReferenceError.**
