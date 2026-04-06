# Closures / Hàm Bao Đóng

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./03-scope-hoisting.md)
> **See also**: [Prototypes](./06-prototypes-inheritance.md) | [Event Loop & Async](./07-event-loop-async.md)
> **L5 Competencies**: Closure memory model, GC lifecycle, stale closure debugging, production-safe patterns

---

## Real-World Scenario / Tình Huống Thực Tế

**Lazada infinite scroll memory leak (production):**

```javascript
// BUG: mỗi scroll event tạo closure mới capture productList đang grow
function attachScrollListener(productList) {
  window.addEventListener("scroll", function handleScroll() {
    if (isNearBottom()) loadMore(productList);
    // closure giữ reference tới productList → GC không collect được
  });
}
// Gọi 500 lần → 500 closures, mỗi cái giữ growing array
// GC không collect → tab crash sau 30 phút
```

Fix: cleanup với `removeEventListener`. **1 dòng cleanup tiết kiệm 500MB RAM.**

**Bài học:** Closure không phải "advanced technique" — nó là **DEFAULT BEHAVIOR** của JS. Mọi function đều là closure. Hiểu closure = hiểu tại sao React hooks hoạt động, stale closure xảy ra, và memory leak khó debug.

---

## What & Why / Cái Gì & Tại Sao

**Analogy:** Hãy tưởng tượng **chiếc ba lô có khóa bí mật**:

- Bạn nhét đồ vào ba lô (biến) → đóng khóa → đưa cho người khác (return function)
- Người đó dùng được ba lô nhưng **không lấy đồ ra trực tiếp** (private state)
- Chỉ tương tác qua "cửa sổ" bạn thiết kế (returned methods)
- Đồ vẫn tồn tại miễn là ai đó còn giữ ba lô (GC won't collect)

**Định nghĩa:** Closure = function + **lexical environment** nơi function được tạo. Function "đóng gói" **tham chiếu** đến biến của scope bên ngoài — không phải bản sao, mà là reference thực sự.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Lexical Scope] → CLOSURE ← [Function Creation]
                     │
          ┌──────────┼──────────┐──────────┐
          ▼          ▼          ▼          ▼
    [Private     [Persistent  [Stale    [Memory
     State]       Memory]     Closure]   Leak]
     Module      debounce/    in React   in event
     Pattern     memoize                 listeners
```

---

## Overview / Tổng Quan

Closure là function giữ reference đến lexical environment nơi nó được tạo, kể cả sau khi outer function đã return. Không phải cú pháp đặc biệt — **mọi function trong JS đều là closure**. Điều quan trọng là biết khi nào closure giữ reference quá lâu và gây memory leak.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. [[Environment]] Slot — Cơ Chế Thực Sự

> 🧠 **Memory Hook**: **Mỗi function object có 1 "túi bí mật" `[[Environment]]` — pointer đến scope chain nơi nó được sinh ra. Đây là closure.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao cần [[Environment]]? → JS engine cần biết function tìm variable ở đâu khi gọi. Nếu không, function chỉ dùng được global scope → không có private state.

**Level 2:** Tại sao giữ reference chứ không copy? → Vì closure cần thấy VALUE MỚI NHẤT của variable, không phải snapshot. Nếu copy → memoize, debounce, counter sẽ không hoạt động vì mỗi lần gọi thấy giá trị cũ.

#### Layer 1: Analogy / Liên Tưởng

Bạn làm việc trong văn phòng (outer function). Trước khi ra về, bạn đặt **máy trả lời tự động** (inner function) trong phòng. Cái máy truy cập được tất cả giấy tờ (closure variables) — kể cả sau khi bạn đã về nhà (outer function returned).

#### Layer 2: How It Works / Cơ Chế

```javascript
function makeCounter() {
  let count = 0; // biến trong outer function

  return function increment() {
    count += 1; // inner function tham chiếu count
    return count;
  };
  // makeCounter() kết thúc, nhưng count KHÔNG bị xóa
  // vì increment.[[Environment]] giữ reference đến count
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2 ← count "nhớ" giá trị cũ!
console.log(counter()); // 3
```

```
Memory model:
┌──────────────────────────────────────────┐
│  counter (function object)               │
│  [[Environment]] ──────────────────────► │ outer's scope record
│                                          │ { count: 0 → 1 → 2 → 3 }
└──────────────────────────────────────────┘
         ▲ GC cannot collect count
         │ vì counter still points to it
```

**Shared environment — multiple closures:**

```javascript
function makeCounter() {
  let n = 0;
  return {
    inc: () => ++n, // cả inc và get share CÙNG environment
    get: () => n, // nếu inc() chạy, get() thấy change
  };
}
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **All functions are closures** — `function foo() {}` ở top level closes over global scope
- Closure giữ **reference**, không copy — nếu biến thay đổi, closure thấy giá trị mới:

```javascript
let x = 10;
const getX = () => x;
x = 99;
console.log(getX()); // 99 — không phải 10!
```

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                             | Tại sao sai                                | Đúng                                              |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| "Closure copies giá trị"        | Closure giữ REFERENCE, thấy value thay đổi | `getX()` trả về latest value, không phải snapshot |
| "Closure xảy ra khi return"     | Closure tạo ngay khi function định nghĩa   | Mọi function object đã là closure từ khi tạo      |
| "Outer function phải là parent" | Closure capture toàn bộ scope chain        | Capture tất cả scopes lồng nhau đến global        |

#### 🎯 Interview Pattern

- **Trigger:** "how does function remember variables?", "what is closure?"
- **Concept:** [[Environment]] internal slot + scope chain lookup
- **Opening:** _"Mọi function trong JS đều là closure. Khi tạo, function nhận [[Environment]] reference pointing to scope nơi nó được viết. Đây là cơ chế mặc định, không phải syntax đặc biệt."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** [Scope & Hoisting](./03-scope-hoisting.md) — lexical scope
- ➡️ **Để hiểu:** React Hooks — useState/useEffect internals dùng closure

---

### 2. Memory Lifecycle & GC / Vòng Đời Bộ Nhớ

> 🧠 **Memory Hook**: **GC xóa memory khi zero references. Closure tạo reference. Event listener không remove = closure sống mãi.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao closure gây memory leak? → Closure giữ reference → GC không collect → memory tăng.

**Level 2:** Tại sao khó detect? → Vì closure attach vào long-lived objects (DOM, global, setInterval) sống mãi. DevTools không hiển thị rõ closure đang giữ gì. Phải dùng Memory Profiler → Heap Snapshot → Retainers tree.

#### Layer 1: Analogy / Liên Tưởng

GC như **người dọn nhà** — chỉ vứt đồ khi không ai cần. Closure là "người đang giữ" reference. Nếu đặt closure vào event listener mà không remove, người dọn nhà KHÔNG BAO GIỜ vứt được đồ đó.

#### Layer 2: How It Works / Cơ Chế

```javascript
// Pattern A: SAFE — closure short-lived
function processOrder(id) {
  const data = fetchOrder(id); // large object
  return data.total; // closure dùng xong → GC'd
}

// Pattern B: LEAK — closure attach permanent object
function setupCart() {
  const cartItems = []; // grows unbounded

  document.getElementById("addBtn").addEventListener("click", () => {
    cartItems.push(getItem()); // closure captures cartItems FOREVER
    // cartItems giữ trong memory cho đến page unload
  });
}

// Pattern B FIXED — cleanup function
function setupCart() {
  const cartItems = [];
  function handleAdd() {
    cartItems.push(getItem());
  }

  document.getElementById("addBtn").addEventListener("click", handleAdd);

  return () => {
    // cleanup: break reference chain
    document.getElementById("addBtn").removeEventListener("click", handleAdd);
  };
}
```

```
Memory lifecycle:
closure created → scope record in heap
     │
     ├─ attached to short-lived var → GC khi var out of scope ✅
     └─ attached to DOM/global → lives until explicitly removed ⚠️
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- `removeEventListener` phải dùng **cùng function reference** — anonymous function KHÔNG remove được
- React `useEffect`: cleanup chạy before next effect + on unmount → LUÔN return cleanup
- `WeakRef`/`WeakMap`: alternative khi muốn GC collect (cache pattern)
- Null-ing variable chỉ release 1 reference — phải release TẤT CẢ references

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                                       | Tại sao sai                               | Đúng                            |
| ----------------------------------------- | ----------------------------------------- | ------------------------------- |
| Anonymous function trong addEventListener | Không thể removeEventListener             | Lưu function reference vào biến |
| Không cleanup useEffect                   | Closure giữ stale reference + memory tăng | Luôn return cleanup function    |
| Set `null` là đủ cho GC                   | GC collect khi ZERO reference             | Đảm bảo tất cả closures release |

#### 🎯 Interview Pattern

- **Trigger:** "memory leak in React", "GC and closures"
- **Concept:** Reference chain — ai hold reference đến gì?
- **Opening:** _"Closure prevent GC bằng cách giữ reference. Fix luôn là break reference chain — removeEventListener, useEffect cleanup, hoặc WeakMap cho optional caching."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** [[Environment]] slot ở trên
- ➡️ **Để hiểu:** [Memory Management](./13-memory-management.md)

---

### 3. Practical Patterns / Patterns Thực Chiến

> 🧠 **Memory Hook**: **4 patterns closure: Module (két sắt), Memoize (notepad), Debounce (nhân viên biếng), Currying (đặt sẵn tham số).**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao cần patterns này? → Vì functions cần "nhớ" state giữa các lần gọi mà không dùng global variable.

**Level 2:** Tại sao closure là cách tốt nhất? → Global variable: ai cũng sửa được → bugs. Class: verbose cho simple use cases. Closure: lightweight, tạo private state tự nhiên, composable.

#### Layer 1: Analogy / Liên Tưởng

| Pattern  | Analogy                                    | Closure holds |
| -------- | ------------------------------------------ | ------------- |
| Module   | Két sắt — private state, expose API        | private vars  |
| Memoize  | Notepad — ghi lại kết quả đã tính          | cache Map     |
| Debounce | Nhân viên biếng — đợi bạn ngừng gõ mới làm | timerId       |
| Currying | Form điền sẵn — fix 1 số tham số           | partial args  |

#### Layer 2: How It Works / Cơ Chế

**Module Pattern (pre-ES modules):**

```javascript
const ShopeeCart = (() => {
  let items = []; // private
  let discount = 0; // private

  return {
    add(item) {
      items.push(item);
    },
    getTotal() {
      return items.reduce((s, i) => s + i.price, 0) * (1 - discount);
    },
    applyDiscount(pct) {
      discount = pct / 100;
    },
  };
})();

ShopeeCart.add({ id: 1, price: 100 });
ShopeeCart.applyDiscount(10);
ShopeeCart.getTotal(); // 90
// ShopeeCart.items → undefined (private!)
```

**Debounce (Grab search box):**

```javascript
function debounce(fn, ms) {
  let timerId; // closure: persist across calls
  return function (...args) {
    clearTimeout(timerId); // cancel previous
    timerId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const search = debounce(fetchResults, 300);
// User types: 'G' 'r' 'a' 'b' → chỉ 1 API call sau khi ngừng gõ
```

**Memoize:**

```javascript
function memoize(fn) {
  const cache = new Map(); // closure: cache persist
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

**Partial Application:**

```javascript
function createFormatter(currency, locale) {
  return (amount) => new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}
const formatVND = createFormatter("VND", "vi-VN");
formatVND(50000); // "50.000 ₫"
```

```
Pattern comparison:
┌─────────────┬────────────────┬──────────────────────────────┐
│ Pattern     │ Closure holds  │ Use case                     │
├─────────────┼────────────────┼──────────────────────────────┤
│ Module      │ private state  │ Encapsulation, private vars  │
│ Memoize     │ cache Map      │ Expensive pure functions     │
│ Debounce    │ timerId        │ Search input, resize handler │
│ Throttle    │ lastRun time   │ Scroll handler, API rate     │
│ Once        │ called flag    │ Init functions, event once   │
└─────────────┴────────────────┴──────────────────────────────┘
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Memoize unbounded cache**: grows forever — add LRU eviction cho long-running apps
- **Debounce trong React render**: mỗi render tạo closure mới → timerId reset → debounce broken. Fix: `useMemo(() => debounce(fn, 300), [])` hoặc `useCallback`
- **Module pattern vs ES modules**: IIFE chạy immediately, ES modules static → dùng ES modules cho tree-shaking

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                            | Tại sao sai                             | Đúng                              |
| ------------------------------ | --------------------------------------- | --------------------------------- |
| Tạo debounce trong render/loop | Mỗi lần tạo closure mới → timerId reset | Tạo 1 lần bên ngoài hoặc useMemo  |
| Memoize với mutable args       | Object reference khác nhau mỗi lần      | Dùng stable key strategy          |
| IIFE module với large data     | Data live forever (IIFE lifecycle)      | Prefer class/ES module nếu cần GC |

#### 🎯 Interview Pattern

- **Trigger:** "implement debounce", "create private state", "optimize expensive function"
- **Concept:** Module/Memoize/Debounce/Throttle/Once → chọn đúng pattern
- **Opening:** _"Đây là use case kinh điển của closure — dùng [pattern] pattern để maintain [state] giữa các lần gọi."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** [[Environment]] + GC ở trên
- ➡️ **Để hiểu:** React Hooks — useCallback/useMemo internals

---

### 4. Stale Closures in React / Stale Closure trong React

> 🧠 **Memory Hook**: **Stale closure = function được tạo khi state = X, nhưng state đã đổi thành Y. Function vẫn thấy X.**

#### Why exists / Tại sao tồn tại (2+ levels)

**Level 1:** Tại sao stale closure xảy ra? → Mỗi render tạo function instance MỚI với snapshot state tại thời điểm đó. Nếu capture vào setTimeout/interval → "đóng băng" với old state.

**Level 2:** Tại sao React design thế? → Vì React dùng immutable state model — mỗi render = pure function of props + state. Closures capture giá trị tại thời điểm render → predictable behavior. Trade-off: stale closure khi dùng async operations.

#### Layer 1: Analogy / Liên Tưởng

Bạn viết **tờ nhắc** (function) với thông tin hiện tại (state). Gửi vào tương lai (setTimeout). Khi tờ nhắc đến, nó vẫn có thông tin CŨ — không biết thông tin đã thay đổi. Đây là stale closure.

#### Layer 2: How It Works / Cơ Chế

```javascript
// BUG: stale closure
function ChatComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(message); // STALE: luôn log '' (initial value)
      // closure captured 'message' at render 1 = ''
    }, 1000);
    return () => clearInterval(interval);
  }, []); // [] → effect chạy 1 lần → closure từ render 1 only

  return <input onChange={(e) => setMessage(e.target.value)} />;
}

// FIX 1: deps array — fresh closure khi message changes
useEffect(() => {
  const interval = setInterval(() => {
    console.log(message); // fresh closure mỗi lần message đổi
  }, 1000);
  return () => clearInterval(interval);
}, [message]);

// FIX 2: useRef — escape closure entirely
const messageRef = useRef("");
messageRef.current = message; // update ref mỗi render

useEffect(() => {
  const interval = setInterval(() => {
    console.log(messageRef.current); // luôn current — ref không phải closure variable
  }, 1000);
  return () => clearInterval(interval);
}, []); // safe với empty deps

// FIX 3: functional update (cho setState)
setCount((prev) => prev + 1); // ✅ dùng latest value, không cần closure
```

```
Stale closure timeline:
Render 1: message=''   → closure A created with message=''
  → setInterval chạy closure A mỗi 1s
Render 2: message='hi' → closure B created with message='hi'
  → NHƯNG interval vẫn chạy closure A (captures '')

Fix: recreate interval (FIX 1) hoặc escape closure via ref (FIX 2)
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- `useRef` solution: không trigger re-render, luôn current, nhưng không reactive
- `useCallback` với deps: stable reference, nhưng deps phải complete
- `useReducer`: dispatch là stable reference → không có stale closure
- Third-party event emitters: LUÔN dùng ref pattern — không control subscription lifecycle

#### ❌ Common Mistakes / Sai Lầm Phổ Biến

| Sai                                           | Tại sao sai                                | Đúng                                                     |
| --------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `useEffect(() => {}, [])` đọc state bên trong | Empty deps → stale closure từ first render | Add state to deps hoặc useRef                            |
| `useCallback` với empty deps                  | Callback capture initial state             | useCallback deps include tất cả state/props callback đọc |
| useRef khi cần reactive                       | ref.current change không trigger re-render | Dùng useState + deps array                               |

#### 🎯 Interview Pattern

- **Trigger:** "setInterval shows old value", "event handler uses wrong state"
- **Concept:** Khi nào closure created vs khi nào state changed
- **Opening:** _"Đây là stale closure. Function được tạo ở render N với state = X, nhưng state đã đổi thành Y. Function vẫn thấy X vì closure capture reference tại creation time."_

#### 🔑 Knowledge Chain

- 📚 **Cần biết:** [[Environment]] + practical patterns ở trên
- ➡️ **Để hiểu:** React Hooks deep dive — useEffect/useCallback rules

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### 🟢 Q1: Closure là gì?

**A:** Closure là function giữ access đến variables từ outer lexical scope, kể cả sau khi outer function đã return. Mọi function trong JS đều là closure — khi tạo, nó nhận `[[Environment]]` reference pointing to scope nơi nó được viết.

```javascript
function makeAdder(x) {
  return function (y) {
    return x + y;
  }; // captures x
}
const add5 = makeAdder(5);
console.log(add5(3)); // 8 — x=5 remembered
```

Key: closure capture **reference** (không phải value) — nếu variable thay đổi, closure thấy value mới.

💡 **Interview Signal:**

- ✅ Strong: "Every function is a closure", phân biệt reference vs value, ví dụ thực tế
- ❌ Weak: "Closure là function trong function" — đúng nhưng không đủ

---

### 🟢 Q2: Tại sao biến không bị GC sau khi outer function return?

**A:** GC dùng **reachability** — object còn reference thì không bị xóa. Khi inner function return, `[[Environment]]` giữ reference đến outer scope. Miễn là closure tồn tại → environment sống → biến sống.

```
makeCounter() exits → normally: count bị GC
BUT: increment giữ [[Environment]] → count NOT GC'd
UNTIL: counter = null → zero refs → count CAN be GC'd
```

Trade-off: closure giữ large objects (DOM, array) có thể gây **memory leak** nếu không cleanup.

💡 **Interview Signal:**

- ✅ Strong: Giải thích reachability, biết khi nào GC collect, nêu memory leak risk
- ❌ Weak: "Biến sống vì closure" — circular, không giải thích mechanism

---

### 🟡 Q3: Implement debounce — giải thích role của closure

**A:**

```javascript
function debounce(fn, ms) {
  let timerId; // closure: persist across calls
  return function debounced(...args) {
    clearTimeout(timerId); // cancel previous pending
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, ms);
  };
}
```

Closure role: `timerId` sống giữa các lần gọi debounced function. Mỗi call: clear timer cũ, set timer mới. Chỉ khi không gọi thêm trong `ms` → callback chạy.

**Debounce vs Throttle:** Debounce đợi ngừng gọi. Throttle cho qua max 1 lần/ms (dùng lastRun timestamp).

💡 **Interview Signal:**

- ✅ Strong: Implement được, giải thích closure role, phân biệt debounce vs throttle
- ❌ Weak: Biết concept nhưng không implement được

---

### 🟡 Q4: Stale closure trong React — debug và fix?

**A:** Stale closure xảy ra khi callback capture state value từ earlier render, tiếp tục dùng giá trị cũ.

```javascript
const [message, setMessage] = useState("");
useEffect(() => {
  setInterval(() => sendHeartbeat(message), 1000); // stale! always ''
}, []);

// Fix 1: deps array
useEffect(() => {
  const id = setInterval(() => sendHeartbeat(message), 1000);
  return () => clearInterval(id);
}, [message]);

// Fix 2: useRef
const msgRef = useRef(message);
useEffect(() => {
  msgRef.current = message;
});
useEffect(() => {
  setInterval(() => sendHeartbeat(msgRef.current), 1000);
}, []);
```

Debug: thêm `console.log` trong callback → nếu thấy giá trị cũ → stale closure.

💡 **Interview Signal:**

- ✅ Strong: Biết cả 2 fix strategies, biết khi nào dùng cái nào
- ❌ Weak: "Thêm dependency vào useEffect" mà không giải thích tại sao

---

### 🟡 Q5: var-in-loop bug — giải thích mechanism

**A:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// → 3, 3, 3
```

`var i` function-scoped → 1 binding shared bởi 3 closures. Loop xong i = 3 → all print 3.

3 fixes: (1) `let i` — new binding per iteration, (2) IIFE wrap, (3) `forEach`. Key insight: `let` tạo **new binding per iteration** — spec behavior, không phải copy.

💡 **Interview Signal:**

- ✅ Strong: "Shared binding vs new binding per iteration"
- ❌ Weak: "Dùng let" mà không giải thích tại sao

---

### 🔴 Q6: Design production-safe event listener system — prevent memory leaks at scale

**A:** Cho Shopee với 1000+ product cards:

```javascript
function createEventManager() {
  const registry = new Map(); // componentId → [cleanup functions]

  return {
    add(componentId, element, event, handler, options) {
      element.addEventListener(event, handler, options);
      if (!registry.has(componentId)) registry.set(componentId, []);
      registry.get(componentId).push(() => element.removeEventListener(event, handler, options));
    },

    cleanup(componentId) {
      const cleanups = registry.get(componentId) ?? [];
      cleanups.forEach((fn) => fn());
      registry.delete(componentId);
    },

    cleanupAll() {
      registry.forEach((_, id) => this.cleanup(id));
    },
  };
}
```

Design: (1) Closure capture `element + event + handler` triplet → mỗi cleanup biết exactly what to remove, (2) Registry prevent double-registration + bulk cleanup, (3) WeakMap thay Map nếu components là objects → auto-GC.

💡 **Interview Signal:**

- ✅ Strong: Registry pattern, WeakMap for auto-GC, edge cases (duplicate, unmount order)
- ❌ Weak: "Dùng removeEventListener" — đúng nhưng không address scale

**Follow-up Chain:**

1. "WeakMap vs Map — khi nào dùng cái nào cho registry?"
2. "Nếu component unmount order không predictable, design handle thế nào?"
3. "Passive listeners ảnh hưởng cleanup pattern thế nào?"

---

### 🔴 Q7: Closure private state vs class `#` private fields — khi nào dùng?

**A:**
| Aspect | Closure | Class `#field` |
|--------|---------|----------------|
| Memory | Per-instance function copies | Shared prototype methods |
| Many instances | More overhead | More efficient |
| Inheritance | Not supported | Fully supported |
| `this` binding | No issues (no `this`) | Need careful binding |

**Dùng closure:** Functional style, factory functions, 1-3 singletons (ShopeeCart module).
**Dùng class `#`:** OOP với inheritance, 10000+ instances (performance matters), `instanceof` checks.

```javascript
// Closure — tốt cho functional/singleton
const createValidator = (rules) => (value) => rules.every((r) => r(value));

// Class — tốt cho nhiều instances
class FormField {
  #value = "";
  #validators = [];
  setValue(v) {
    this.#value = v;
  }
  isValid() {
    return this.#validators.every((r) => r(this.#value));
  }
}
```

💡 **Interview Signal:**

- ✅ Strong: Performance difference (per-instance vs prototype), xét inheritance + instance count
- ❌ Weak: "Closure cũ, class mới" — oversimplification

**Follow-up Chain:**

1. "Với 50000 product cards, memory profile khác nhau thế nào?"
2. "TypeScript có thay đổi decision này không?"
3. "WeakRef có thể combine với closure pattern thế nào?"

---

### 🔴 Q8: Design memoize function cho production — handle edge cases

**A:**

```javascript
function memoize(fn, options = {}) {
  const { maxSize = 100, keyFn = JSON.stringify } = options;
  const cache = new Map();

  function memoized(...args) {
    const key = keyFn(args);
    if (cache.has(key)) {
      // Move to end (most recent)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    // LRU eviction
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return result;
  }

  memoized.clear = () => cache.clear();
  memoized.size = () => cache.size;
  return memoized;
}
```

Edge cases: (1) LRU eviction → bounded memory, (2) custom keyFn → handle non-serializable args, (3) `this` preservation via `fn.apply(this, args)`, (4) `clear()` API cho manual invalidation.

💡 **Interview Signal:**

- ✅ Strong: LRU strategy, custom key, this binding, clear API
- ❌ Weak: Basic memoize without eviction → unbounded memory

**Follow-up Chain:**

1. "JSON.stringify cost cho large objects — alternative key strategies?"
2. "Async memoize — cách handle Promise caching?"
3. "Multi-arg functions với WeakMap — possible?"

---

## Interview Q&A Summary / Tổng Kết

| #   | Question              | Level | Key Point                                               |
| --- | --------------------- | ----- | ------------------------------------------------------- |
| Q1  | Closure là gì?        | 🟢    | function + [[Environment]], capture reference not value |
| Q2  | Tại sao biến sống?    | 🟢    | GC reachability: closure giữ ref → environment sống     |
| Q3  | Implement debounce    | 🟡    | Closure persist timerId across calls                    |
| Q4  | Stale closure React   | 🟡    | Empty deps freezes closure, fix: deps/useRef            |
| Q5  | var-in-loop bug       | 🟡    | var shared binding vs let new binding                   |
| Q6  | Event listener system | 🔴    | Registry + closure-per-listener + WeakMap               |
| Q7  | Closure vs class #    | 🔴    | Per-instance vs prototype, instance count decides       |
| Q8  | Production memoize    | 🔴    | LRU eviction, custom key, this binding                  |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi: **"Giải thích stale closure trong React useEffect và cách fix."**

**30 giây đầu:**

1. "Stale closure là khi callback capture state value lúc render, tiếp tục dùng giá trị cũ dù state đã update — vì closure capture references tại creation time."
2. "Trong useEffect với empty deps `[]`, effect chạy 1 lần → closure đóng băng initial state."
3. "Ví dụ: `setInterval(() => sendMessage(text), 1000)` với `[]` deps — `text` luôn là empty string."
4. "2 fixes: thêm `text` vào deps (fresh closure mỗi lần), hoặc useRef để escape closure khi không cần reactive."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                |
| --- | -------------- | -------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết định nghĩa closure từ trí nhớ — bao gồm `[[Environment]]` + reference vs value    |
| 2   | 🎨 Visual      | Vẽ memory diagram: outer function returns, inner function vẫn reference outer variable |
| 3   | 🛠️ Application | 1000 product cards có scroll listener — pattern nào tránh memory leak?                 |
| 4   | 🐛 Debug       | `for (var i=0; i<3; i++) setTimeout(()=>console.log(i), 0)` → output? tại sao?         |
| 5   | 🎓 Teach       | Giải thích stale closure cho người chưa biết React, dùng analogy "tờ nhắc từ quá khứ"  |

> 🎯 **Feynman Prompt:** Giải thích tại sao closure gây memory leak — không dùng từ "closure", "GC", hay "reference".
> 🔁 **Spaced Repetition:** Ôn lại sau **3 ngày → 7 ngày → 14 ngày**.

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Grab — Event Listener Closure Memory Leak on Ride Map

**Situation:** Grab's ride-tracking map component leaked ~2MB per ride session. Memory profiler showed thousands of `RideMarker` objects retained in memory long after rides ended, preventing garbage collection.

**Root cause — closure holding stale reference:**
```javascript
class RideMap {
  constructor(rideData) {
    this.markers = [];
    this.rideData = rideData; // ← large object: GPS history, metadata, etc.

    // Bug: closure captures 'this' (entire RideMap) via arrow function
    this.mapInstance.on('zoom', () => {
      this.updateMarkers(); // ← 'this' still referenced
    });
    // mapInstance event listener prevents 'this' (and rideData) from being GC'd
    // even after the component is "destroyed"
  }

  destroy() {
    this.markers = null;
    // ❌ Forgot to remove event listener — closure still holds 'this'
  }
}
```

**Fix — explicit cleanup:**
```javascript
constructor(rideData) {
  this.handleZoom = () => this.updateMarkers(); // ← named for removal
  this.mapInstance.on('zoom', this.handleZoom);
}

destroy() {
  this.mapInstance.off('zoom', this.handleZoom); // ✅ break the closure reference
  this.handleZoom = null;
  this.rideData = null;
}
```

**Decision made:** Created a `Disposable` base class with a `cleanup: Function[]` registry. Every component's `destroy()` method calls `cleanup.forEach(fn => fn())`. Closures registered at construction time are automatically cleaned up.

**Trade-off accepted:** Slightly more boilerplate per component (`this.cleanup.push(() => ...)`) but eliminates the class of "forgot to remove listener" bugs. WeakRef considered but rejected — WeakRef doesn't prevent the event emitter from keeping the reference alive.

**Lesson:** Closures extend the lifetime of everything they capture. Event listeners that capture `this` keep the entire object graph alive. The "destroy" pattern must explicitly break all closure-held references.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Scope & Hoisting](./03-scope-hoisting.md) — lexical scope là nền tảng
- ➡️ **Enables:** React Hooks — useState/useEffect internals dùng closure
- ➡️ **Enables:** [Event Loop & Async](./07-event-loop-async.md) — Promise chains dùng closure maintain context
- 🔗 **Applied in:** Module pattern, debounce/throttle, memoization, React hooks

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Language Fundamentals](../../be-track/01-golang/01-language-fundamentals.md) — Go closures work identically (same capture-by-reference semantics); same goroutine-closure pitfall as JS loop closures — captures loop variable, not value
- 🔗 **FE — React**: [React Hooks](../03-react/03-hooks-deep-dive.md) — `useState`/`useEffect` internals rely on closures; every hook captures its render's scope — stale closure = the #1 React bug pattern
- 🔗 **FE — Patterns**: [React Patterns](../03-react/04-advanced-patterns.md) — Module pattern, factory functions, partial application = closure-based patterns used in component design
- 🔗 **Shared theory**: [Software Engineering Patterns](../../shared/05-software-engineering/01-solid-and-design-patterns.md) — closure implements Decorator, Memoize, and Module patterns without classes

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **Every function in JavaScript is a closure — when created, it receives an `[[Environment]]` reference pointing to the scope where it was written / Mọi function trong JS đều là closure — khi tạo, nó nhận `[[Environment]]` trỏ đến scope nơi nó được viết.**
- **Closure captures a REFERENCE to variables, not a copy — if the variable changes, the closure sees the new value / Closure capture REFERENCE đến biến, không phải copy — nếu biến thay đổi, closure thấy giá trị mới.**
- **GC won't collect a variable as long as any closure holds a reference to it — attach a closure to a DOM event listener without cleanup = memory leak / GC không thu hồi biến khi còn closure giữ reference — gắn closure vào DOM listener mà không cleanup = memory leak.**
- **`removeEventListener` requires the exact same function reference — anonymous functions cannot be removed / `removeEventListener` cần cùng function reference — anonymous function không remove được.**
- **4 classic closure patterns: Module (private state), Memoize (cache map), Debounce (timerId), Partial Application (pre-filled args) / 4 pattern closure kinh điển: Module (trạng thái riêng tư), Memoize (cache), Debounce (timerId), Partial Application (tham số cố định).**
- **Stale closure in React: a function created at render N captures state = X; state later changes to Y but the function still sees X / Stale closure trong React: function tạo ở render N capture state = X; state đổi thành Y nhưng function vẫn thấy X.**
- **Fix stale closure: add state to `useEffect` deps (fresh closure) OR use `useRef` to escape the closure (always current, not reactive) / Fix stale closure: thêm state vào deps array (closure mới) HOẶC dùng `useRef` để thoát khỏi closure (luôn mới nhất, không reactive).**
- **Closure vs class `#private`: closure creates per-instance function copies (higher memory); class shares prototype methods (more efficient for many instances) / Closure vs class `#private`: closure tạo function riêng mỗi instance (tốn bộ nhớ hơn); class share prototype methods (hiệu quả hơn với nhiều instances).**

### Interview Tips / Mẹo Phỏng Vấn

- **When asked "what is a closure?", open with "every function is a closure" — it shows spec-level understanding before giving the textbook definition / Khi hỏi "closure là gì?", mở đầu bằng "mọi function đều là closure" — thể hiện hiểu spec trước khi định nghĩa.**
- **For debounce implementation: explain that `timerId` persisting between calls IS the closure at work — don't just write the code, narrate it / Khi implement debounce: giải thích `timerId` tồn tại giữa các lần gọi CHÍNH LÀ closure — đừng chỉ viết code, hãy giải thích.**
- **For memory leak questions: trace the reference chain — "event listener holds → handler function → closure captures → large object" — this is what a senior dev does in DevTools / Với câu hỏi memory leak: trace reference chain — đây là cách senior debug trong DevTools.**
- **Distinguish debounce (fires after silence ends) from throttle (fires at max once per interval) — interviewers often ask for both / Phân biệt debounce (chạy sau khi ngừng gọi) với throttle (chạy tối đa 1 lần/interval) — interviewer thường hỏi cả hai.**
- **For stale closure: frame your answer as "closure captured state at creation time, state mutated later" — then offer both fix strategies and explain the trade-off / Với stale closure: "closure capture state lúc tạo, state thay đổi sau đó" — sau đó đưa ra cả 2 cách fix và trade-off.**
