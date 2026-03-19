# Closures — Comprehensive Deep Dive / Closure — Toàn Diện

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
> **See also**: [Prototypes](./10-prototypes-inheritance-deep.md) | [Async](./09-async-comprehensive.md) | [React Hooks](../03-react/03-hooks-deep-dive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Lazada infinite scroll memory leak (production 2023):**

Một engineer build infinite scroll component — mỗi scroll event attach một listener mới:

```javascript
// BUG: every scroll creates new closure capturing growing productList
function attachScrollListener(productList) {
  window.addEventListener('scroll', function handleScroll() {
    if (isNearBottom()) loadMore(productList); // closure holds productList reference
  });
}
// Called 500 times → 500 closures, each holding growing array reference
// GC cannot collect → tab crashes after 30 minutes
```

Fix: cleanup với `useEffect` return function. **1 dòng cleanup code tiết kiệm 500MB RAM.**

**Bài học cốt lõi:** Closure không phải "advanced technique" — nó là DEFAULT BEHAVIOR của JS. Mọi function đều là closure. Hiểu closure = hiểu tại sao React hooks hoạt động, tại sao stale closure xảy ra, và tại sao memory leak khó debug.

---

## What & Why / Cái Gì & Tại Sao

> 🧠 **Memory Hook**: **Closure = function + snapshot của môi trường nơi nó được sinh ra.**
> Như student mang theo backpack từ classroom — ra ngoài rồi vẫn dùng được đồ trong đó.

**Tại sao JS cần closure?**
→ Vì functions cần dùng data mà không muốn expose ra global scope.
→ Vì global variables gây bug khi nhiều functions cùng modify — closure tạo "private state" cho từng function.
→ Vì đây là cách duy nhất để function "nhớ" context của nó sau khi outer function đã return.

**Why you must know this for 2026 interviews:**
- React hooks (`useState`, `useEffect`, `useCallback`) đều dựa trên closure internals
- Stale closure là bug #1 khó debug của React developers (tất cả công ty đều hỏi)
- Module pattern, debounce, throttle, memoization — tất cả dùng closure
- Memory leak từ closure xuất hiện trong Senior system design interviews

---

## Concept Map / Bản Đồ Khái Niệm

```
[Lexical Scope] → CLOSURE ← [Function Creation]
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    [Private    [Persistent  [Stale
     State]      Memory]     Closure
     Module      debounce/   in React]
     Pattern     memoize
```

**Bạn đang ở đây trong lộ trình học:**
```
Scope & Hoisting → [CLOSURE] → Prototypes → Async/Event Loop → React Hooks
```

---

## Overview / Tổng Quan

A closure is a function that retains access to its **lexical environment** — the variables in scope at the time it was created — even after the outer function has returned.

**Tiếng Việt:** Closure là function giữ reference đến lexical environment (môi trường scope) nơi nó được tạo ra, kể cả sau khi outer function đã kết thúc. Không phải cú pháp đặc biệt — mọi function trong JS đều là closure. Điều quan trọng là biết khi nào closure **giữ reference quá lâu** và gây memory leak.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. The [[Environment]] Slot / Slot [[Environment]]

> 🧠 **Memory Hook**: Mỗi function object có 1 internal slot `[[Environment]]` — một pointer đến scope chain nơi nó được tạo. Đây là cơ chế thực sự của closure.

**Tại sao [[Environment]] tồn tại?**
→ JS engine cần biết function tìm variable ở đâu khi gọi.
→ Nếu không có [[Environment]], function chỉ có thể dùng global scope — không có private state.
→ [[Environment]] là cách JS implement lexical scoping: scope được xác định tại thời điểm viết code, không phải khi gọi.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn đang làm việc trong văn phòng (outer function). Trước khi ra về, bạn đặt một máy trả lời tự động (inner function) trong phòng. Cái máy này có thể truy cập tất cả giấy tờ trong phòng (closure variables) — kể cả sau khi bạn đã về nhà.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
function outer() {
  const config = { apiUrl: 'https://api.grab.com' }; // stays in memory

  return function inner() {       // inner.[[Environment]] → outer's scope
    return config.apiUrl;         // looks up scope chain, finds config
  };
}

const getUrl = outer();  // outer() finishes, but config is NOT garbage collected
                         // because getUrl.[[Environment]] still references it
console.log(getUrl());   // 'https://api.grab.com'
```

```
Memory model:
┌──────────────────────────────────────────┐
│  getUrl (function object)                │
│  [[Environment]] ──────────────────────► │ outer's scope record
│                                          │ { config: {apiUrl: '...'} }
└──────────────────────────────────────────┘
         ▲ GC cannot collect config
         │ because getUrl still points to it
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **All functions are closures** — even `function foo() {}` at top level closes over the global scope
- **Shared environment**: multiple inner functions from same outer scope share the same environment record → they see each other's mutations

```javascript
function makeCounter() {
  let n = 0;
  return {
    inc: () => ++n,  // both share same environment record
    get: () => n,    // if inc() runs, get() sees the change
  };
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Closure copies variable values" | Closure giữ REFERENCE đến variable, không copy value | Closure có thể thấy variable thay đổi sau khi được tạo |
| "Outer function phải là parent function" | Closure capture toàn bộ scope chain, không chỉ direct parent | Closure capture tất cả scopes lồng nhau đến global |
| "Closure xảy ra khi dùng `return`" | Closure được tạo ngay khi function được định nghĩa | Mọi function object đã là closure từ khi tạo |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "how does function remember variables?", "why can inner function access outer variables?"
- → Nhớ đến: [[Environment]] internal slot + scope chain lookup
- → Mở đầu trả lời: *"Every function in JavaScript has an internal [[Environment]] slot that holds a reference to the scope in which it was created. This is how closures work — it's not magic syntax, it's the default behavior of all functions."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — lexical scope phải hiểu trước
- ➡️ Để hiểu: [React Hooks](../03-react/03-hooks-deep-dive.md) — useState/useEffect internals dùng closure

---

### 2. Memory Lifecycle & GC / Vòng Đời Bộ Nhớ

> 🧠 **Memory Hook**: **"GC releases memory when there are zero references."** Closure creates a reference. Event listener that's never removed = closure that's never released.

**Tại sao closure gây memory leak?**
→ Closure giữ reference → GC không collect → memory tăng.
→ Nếu closure được attach vào long-lived object (DOM, global), nó sống mãi.
→ Đây là nguồn gốc của class "unexplained memory growth" bugs ở production.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

GC như người dọn nhà: chỉ vứt đồ khi không ai cần nữa. Closure là "người" đang giữ reference đến đồ. Nếu bạn đặt closure vào event listener mà không bao giờ remove, người dọn nhà không bao giờ vứt được đồ đó.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// Pattern A: safe — closure is short-lived
function processOrder(orderId) {
  const orderData = fetchOrder(orderId); // large object
  return orderData.total;               // closure used once, then GC'd
}

// Pattern B: LEAK — closure attached to permanent object
function setupShopeeCart() {
  const cartItems = [];  // grows unbounded

  document.getElementById('addBtn').addEventListener('click', function() {
    cartItems.push(getSelectedItem()); // closure captures cartItems FOREVER
    // cartItems held in memory until page unload or listener removed
  });
}

// Pattern B fixed:
function setupShopeeCart() {
  const cartItems = [];

  function handleAdd() {
    cartItems.push(getSelectedItem());
  }

  document.getElementById('addBtn').addEventListener('click', handleAdd);

  return () => {  // cleanup function
    document.getElementById('addBtn').removeEventListener('click', handleAdd);
  };
}
```

```
Memory lifecycle:
closure created → scope record in heap
     │
     ├─ if attached to short-lived var → GC when var goes out of scope ✅
     └─ if attached to DOM/global → lives until explicitly removed ⚠️
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- `removeEventListener` phải dùng **cùng function reference** — anonymous function không remove được
- In React: `useEffect` cleanup runs before next effect + on unmount — always return cleanup function
- `WeakRef` / `WeakMap` as alternative when you want GC to collect: cache that doesn't prevent GC

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng anonymous arrow function trong addEventListener | Không thể removeEventListener vì không có reference | Lưu function reference vào biến trước khi add |
| Không cleanup useEffect trong React | Closure giữ stale reference, memory tăng theo component mount | Luôn return cleanup function từ useEffect |
| Nghĩ `null`-ing variable là đủ để GC | GC collect khi KHÔNG CÒN reference nào — set null chỉ release 1 reference | Đảm bảo tất cả closures pointing to object đều bị released |

**🎯 Interview Pattern:**
- Khi thấy: "memory leak in React", "how to prevent closure memory issues", "GC and closures"
- → Think: reference chain — ai đang hold reference đến gì?
- → Answer opens with: *"Closures prevent garbage collection by holding references. The fix is always about breaking the reference chain — removeEventListener, useEffect cleanup, or WeakMap for optional caching."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Memory Management](./15-memory-management-advanced.md)
- ➡️ Để hiểu: [React Performance](../06-browser-performance/02-react-performance.md) — memoization patterns

---

### 3. Practical Patterns / Patterns Thực Chiến

> 🧠 **Memory Hook**: **4 patterns dùng closure nhất: Module (private state), Memoize (cache), Debounce/Throttle (timing control), Currying (partial application).**

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

- **Module**: két sắt — private state bên trong, chỉ expose API
- **Memoize**: notepad — ghi lại kết quả đã tính để không tính lại
- **Debounce**: nhân viên biếng — đợi bạn ngừng gõ phím 300ms mới thực sự làm việc
- **Throttle**: bảo vệ cổng — cho qua tối đa 1 lần/giây dù bạn gọi bao nhiêu lần

#### Layer 2: How It Works / Cơ Chế Hoạt Động

**Module Pattern:**
```javascript
// Private state via closure — classic pattern before ES modules
const ShopeeCart = (() => {
  let items = [];        // private — cannot access from outside
  let discount = 0;      // private

  return {
    add(item) { items.push(item); },
    remove(id) { items = items.filter(i => i.id !== id); },
    getTotal() { return items.reduce((s, i) => s + i.price, 0) * (1 - discount); },
    applyDiscount(pct) { discount = pct / 100; },
  };
})();

ShopeeCart.add({ id: 1, price: 100 });
ShopeeCart.applyDiscount(10);
console.log(ShopeeCart.getTotal()); // 90
// ShopeeCart.items → undefined (private!)
```

**Memoize:**
```javascript
function memoize(fn) {
  const cache = new Map(); // closure: cache lives as long as memoized fn does
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n) => n * n);
expensiveCalc(100); // computed
expensiveCalc(100); // from cache — O(1)
```

**Debounce (Grab search box):**
```javascript
function debounce(fn, ms) {
  let timerId; // closure: timerId persists across calls
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), ms);
  };
}

const search = debounce(fetchResults, 300);
// User types: 'G' 'r' 'a' 'b' → only 1 API call after they stop
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

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Memoize unbounded cache**: grows forever — add LRU eviction for long-running apps
- **Debounce leading edge**: sometimes need immediate first call + suppress subsequent (search suggestions vs form submit)
- **Module pattern vs ES modules**: module pattern runs immediately (IIFE), ES modules are static — use ES modules for tree-shaking

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Tạo debounce function bên trong render/loop | Mỗi render tạo closure mới → timerId reset → debounce không hoạt động | Tạo debounced function 1 lần bên ngoài, hoặc dùng useCallback |
| Memoize với mutable args | JSON.stringify({a:1}) === JSON.stringify({a:1}) nhưng nếu object có circular ref → error | Dùng WeakMap với object args, hoặc stable key strategy |
| IIFE module pattern với large data | Data live forever (tied to module lifecycle) | Prefer class hoặc ES module nếu cần tree-shaking |

**🎯 Interview Pattern:**
- Khi thấy: "implement debounce", "create private state", "optimize expensive function"
- → Think: which closure pattern fits? Module/Memoize/Debounce/Throttle/Once
- → Answer opens with: *"This is a classic use case for closures — specifically the [pattern] pattern where we use a closure to maintain [state] across calls."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — block scope for let in loops
- ➡️ Để hiểu: [React Hooks](../03-react/03-hooks-deep-dive.md) — useCallback/useMemo internals

---

### 4. Stale Closures in React / Stale Closure trong React

> 🧠 **Memory Hook**: **"Stale closure = function was created when state had value X, but state has since changed to Y. Function still sees X."**

**Tại sao stale closure xảy ra trong React?**
→ Mỗi render, React tạo một function instance mới với snapshot của state tại thời điểm đó.
→ Nếu bạn capture function đó vào setTimeout/interval/event listener, nó "đóng băng" với old state value.
→ Đây là bug phổ biến nhất React developers gặp ở production.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng bạn viết tờ nhắc (function) với thông tin hiện tại (state). Sau đó bạn gửi tờ nhắc vào tương lai (setTimeout). Khi tờ nhắc đến, nó vẫn có thông tin cũ — không biết rằng thông tin đã thay đổi.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// BUG: stale closure
function ChatComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(message); // STALE: always logs '' (initial value)
      // closure captured 'message' at render time = ''
    }, 1000);
    return () => clearInterval(interval);
  }, []); // [] means effect runs once → closure from first render only

  return <input onChange={e => setMessage(e.target.value)} />;
}

// FIX 1: Add message to deps (recreate interval when message changes)
useEffect(() => {
  const interval = setInterval(() => {
    console.log(message); // fresh closure each time message changes
  }, 1000);
  return () => clearInterval(interval);
}, [message]); // effect re-runs with fresh closure

// FIX 2: useRef for always-current value (no stale closure)
const messageRef = useRef('');
messageRef.current = message; // update ref on every render

useEffect(() => {
  const interval = setInterval(() => {
    console.log(messageRef.current); // always current — ref is not a closure variable
  }, 1000);
  return () => clearInterval(interval);
}, []); // safe with empty deps
```

```
Stale closure timeline:
Render 1: message=''   → closure A created with message=''
  → setInterval runs closure A every 1s
Render 2: message='hi' → closure B created with message='hi'
  → BUT interval still runs closure A (captures '')

Fix: either recreate interval (FIX 1) or escape closure via ref (FIX 2)
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- `useRef` solution: no re-render triggered, always current, but no reactive behavior
- `useCallback` with deps: stable function reference, but deps must be complete
- `useReducer` for complex state: dispatch is stable reference, no stale closure issues
- Third-party event emitters: always use ref pattern — you can't control their subscription lifecycle

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `useEffect(() => {}, [])` với function inside that reads state | Empty deps → stale closure từ first render | Add state to deps hoặc dùng useRef |
| Dùng useRef khi cần reactive behavior | Thay đổi ref.current không trigger re-render | Dùng useState + deps array |
| `useCallback` với empty deps | Callback capture initial state values, never updates | useCallback deps phải include tất cả state/props mà callback đọc |

**🎯 Interview Pattern:**
- Khi thấy: "setInterval shows old value", "event handler uses wrong state", "why is my callback stale"
- → Diagnose: khi nào closure được created vs khi nào state changed
- → Answer opens with: *"This is a stale closure. The function was created during render N with state value X, but state has since changed to Y. The function still sees the old value because closures capture references to the environment at creation time."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures Core](#1-the-environment-slot--slot-environment) — must understand closure mechanics first
- ➡️ Để hiểu: [React Hooks](../03-react/03-hooks-deep-dive.md) — useEffect/useCallback rules

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: What is a closure in JavaScript? / Closure là gì? 🟢 Junior

**A:** A closure is a function that retains access to variables from its outer lexical scope, even after the outer function has returned. Every JavaScript function is a closure — when created, it gets an internal `[[Environment]]` reference pointing to the scope where it was defined.

```javascript
function makeAdder(x) {
  return function(y) { return x + y; }; // captures x from outer scope
}
const add5 = makeAdder(5);
console.log(add5(3)); // 8 — x=5 is remembered even after makeAdder returned
```

**Tiếng Việt:** Closure là function giữ reference đến lexical environment nơi nó được tạo. Không phải cú pháp đặc biệt — mọi function trong JS đều là closure. Key point: closure captures variable REFERENCES (không phải values), nên nếu variable thay đổi, closure thấy giá trị mới nhất.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Nói "every function is a closure", giải thích [[Environment]] slot, phân biệt capture reference vs value, đưa example thực tế (counter, module pattern)
- ❌ Weak: "Closure là function bên trong function" — đúng nhưng không đủ, bỏ qua cơ chế thực sự

---

### Q: Classic closure bug with `var` in a loop — explain and fix / Bug var trong vòng lặp? 🟢 Junior

**A:** The classic bug:
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3 — not 0, 1, 2
}
```
Why: `var` is function-scoped — all 3 closures share the **same `i` variable**. By the time setTimeout fires, the loop has finished and `i = 3`.

**Three fixes:**
```javascript
// Fix 1: let (block-scoped — new binding per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 ✅
}

// Fix 2: IIFE (create new scope per iteration — pre-ES6)
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}

// Fix 3: bind
for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 100);
}
```

**Tiếng Việt:** `var` là function-scoped → tất cả closures trong loop share cùng 1 biến `i`. Khi setTimeout callback chạy, loop đã xong và `i = 3`. Fix chuẩn nhất: dùng `let` — mỗi iteration tạo 1 block scope mới, 1 binding mới cho `i`.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích shared vs separate binding, biết cả 3 cách fix, biết tại sao `let` fix được
- ❌ Weak: Chỉ nói "dùng let thay var" mà không giải thích tại sao

---

### Q: How does debounce work? Implement it / Debounce hoạt động thế nào? Implement? 🟡 Mid

**A:** Debounce delays execution until `ms` milliseconds have passed since the last call. Uses closure to persist `timerId` across calls:

```javascript
function debounce(fn, ms) {
  let timerId; // closure: persists across invocations
  return function debounced(...args) {
    clearTimeout(timerId);           // cancel previous pending call
    timerId = setTimeout(() => {
      fn.apply(this, args);          // execute with correct `this` and args
      timerId = null;
    }, ms);
  };
}

// Usage: search input at Grab — only call API after 300ms of no typing
const search = debounce(fetchSearchResults, 300);
input.addEventListener('input', search);
```

Key: `timerId` is in the closure — each call to the debounced function shares the same `timerId`, so `clearTimeout` cancels the previous pending call.

**Tiếng Việt:** Debounce dùng closure để "nhớ" `timerId` giữa các lần gọi. Mỗi lần gọi: clear timer cũ, tạo timer mới. Chỉ khi không gọi thêm trong `ms` miliseconds, callback mới thực sự chạy. **Throttle** khác ở chỗ: cho qua tối đa 1 lần mỗi `ms` (dùng `lastRun` timestamp thay `timerId`).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Implement được, giải thích closure role (timerId persistence), phân biệt debounce vs throttle, biết leading/trailing edge variants
- ❌ Weak: Chỉ biết khái niệm mà không implement được, hoặc không giải thích tại sao cần closure

---

### Q: What is a stale closure in React? How to debug and fix? / Stale closure trong React là gì? 🟡 Mid

**A:** A stale closure happens when a callback function captures a state/prop value from an earlier render, and continues using that old value even after state has updated.

```javascript
// Bug: message always '' in interval
const [message, setMessage] = useState('');
useEffect(() => {
  setInterval(() => sendHeartbeat(message), 1000); // stale! always ''
}, []);

// Fix 1: deps array — fresh closure per state change
useEffect(() => {
  const id = setInterval(() => sendHeartbeat(message), 1000);
  return () => clearInterval(id); // cleanup is critical
}, [message]);

// Fix 2: useRef — escape closure entirely
const msgRef = useRef(message);
useEffect(() => { msgRef.current = message; });
useEffect(() => {
  setInterval(() => sendHeartbeat(msgRef.current), 1000);
}, []);
```

**Tiếng Việt:** Stale closure xảy ra vì React re-render tạo function instances mới, nhưng nếu function đó bị capture vào interval/listener/setTimeout với empty deps, nó "đông cứng" với state cũ. Cách debug: thêm `console.log` trong callback, nếu thấy giá trị cũ thì đó là stale closure. Hai fix: (1) add state to deps, (2) useRef để escape closure.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích render cycle tạo new function instances, biết cả 2 fix strategies, biết khi nào dùng cái nào (useRef khi không cần reactive, deps khi cần reactive)
- ❌ Weak: "Thêm dependency vào useEffect" mà không giải thích tại sao nó fix

---

### Q: Design a production-safe event listener system using closures — prevent memory leaks at scale 🔴 Senior

**A:** For a large FE app (Shopee product listing with 1000s of components), a centralized listener registry using closures:

```javascript
// Production pattern: centralized cleanup registry
function createEventManager() {
  const registry = new Map(); // componentId → [cleanup functions]

  return {
    add(componentId, element, event, handler, options) {
      element.addEventListener(event, handler, options);

      if (!registry.has(componentId)) registry.set(componentId, []);
      registry.get(componentId).push(() => {
        element.removeEventListener(event, handler, options);
      });
    },

    cleanup(componentId) {
      const cleanups = registry.get(componentId) ?? [];
      cleanups.forEach(fn => fn());
      registry.delete(componentId);
    },

    cleanupAll() {
      registry.forEach((_, id) => this.cleanup(id));
    }
  };
}

// Usage in React-like framework:
const eventManager = createEventManager();

function ProductCard({ id }) {
  onMount(() => {
    eventManager.add(id, window, 'scroll', handleScroll);
    eventManager.add(id, document, 'click', handleOutsideClick);
  });

  onUnmount(() => eventManager.cleanup(id)); // removes ALL listeners for this component
}
```

**Why this design:**
1. Closures capture `element + event + handler` triplet — each cleanup function knows exactly what to remove
2. Registry prevents double-registration and provides bulk cleanup
3. `Map` (vs object) handles componentId as any type; `WeakMap` if components are objects (auto-GC when component destroyed)

**Tiếng Việt:** Thiết kế trên tách biệt concerns: component chỉ cần gọi `add/cleanup`, không cần quản lý references. Registry pattern dùng closure để "nhớ" đủ thông tin để cleanup. Ở scale lớn (Shopee với 1000 product cards), pattern này ngăn memory leak hệ thống — không chỉ ngăn 1 component bị leak.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Thiết kế registry pattern, nhắc đến WeakMap for auto-GC, xét edge cases (duplicate registration, component unmount order), biết trade-off Map vs WeakMap
- ❌ Weak: Chỉ nói "dùng removeEventListener" — đúng nhưng không address scale, không có systematic cleanup

---

### Q: Closure-based private state vs ES2022 class private fields (`#`) — when to use each? 🔴 Senior

**A:** Both achieve encapsulation but have fundamentally different trade-offs:

```javascript
// Closure-based private state
function createUser(name) {
  let _name = name;         // truly private — no reflection possible
  let _loginCount = 0;

  return {
    login() { _loginCount++; console.log(`${_name} logged in`); },
    getName() { return _name; },
    // _name, _loginCount not accessible from outside AT ALL
  };
}

// ES2022 class private fields
class User {
  #name;           // accessible via Object.getOwnPropertyNames? No.
  #loginCount = 0; // but: reflected in DevTools, accessible within class hierarchy

  constructor(name) { this.#name = name; }
  login() { this.#loginCount++; }
}
```

**When closure-based:**
- Need truly zero-footprint private (no DevTools visibility)
- Functional programming style (no `this` binding issues)
- Dynamic object creation without class overhead
- Legacy code compatibility (pre-ES2022 environments)

**When class `#` private:**
- Need `instanceof` checks, inheritance chains
- Team is familiar with OOP patterns
- Need TypeScript class decorators
- Better performance for many instances (prototype chain, not per-object function copies)

**Tiếng Việt:** Trade-off chính: closure private state tạo per-object function copies (memory overhead với 10000+ instances), trong khi class private fields dùng prototype chain (shared methods). Với Shopee có 1000 ProductCard instances, class `#` tốt hơn về memory. Với 1-3 singletons (ShopeeCart module), closure OK.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Biết performance difference (per-instance vs prototype), xét inheritance, TypeScript implications, không chỉ nói "cả 2 đều OK"
- ❌ Weak: "Closure cũ hơn, class modern hơn" — đây là oversimplification, mỗi cái có trường hợp tốt hơn

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| What is a closure? | 🟢 | Every function has [[Environment]] slot; captures reference not value |
| var bug in loops | 🟢 | All closures share 1 var binding; let creates separate binding per iteration |
| Implement debounce | 🟡 | Closure persists timerId across calls; clearTimeout + setTimeout pattern |
| Stale closure in React | 🟡 | Empty deps freezes closure at render N; fix: deps array or useRef |
| Production listener registry | 🔴 | Registry + closure-per-listener pattern; WeakMap for auto-GC at scale |
| Closure vs class `#` private | 🔴 | Memory: closure = per-instance functions; `#` = shared prototype. Choose based on instance count and inheritance needs |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Explain the stale closure problem in React useEffect and how you'd fix it."**

**30 giây đầu — mở đầu lý tưởng:**
1. "Stale closure means a callback captured a state value at render time, and continues using that old value even after state updates — because closures capture references at creation time."
2. "In useEffect with empty deps `[]`, the effect runs once and its closure freezes the initial state values."
3. "Concrete example: `setInterval(() => sendMessage(text), 1000)` with `[]` deps — `text` is always empty string no matter what the user types."
4. "Two fixes: add `text` to deps array (fresh closure per state change), or use `useRef` to escape the closure entirely when you don't need reactive behavior."

*Sau đó offer to go deeper on either fix strategy.*

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close this doc before attempting.**

- [ ] **Retrieval**: Viết định nghĩa closure từ trí nhớ — bao gồm [[Environment]] slot và sự khác biệt giữa capture reference vs value. Không nhìn lại.
- [ ] **Visual**: Vẽ memory diagram: outer function returns, inner function still references outer variable. Ai prevent GC? So sánh với ASCII diagram trong Layer 2.
- [ ] **Application**: Bạn có 1000 product cards, mỗi cái có scroll listener. Bạn dùng pattern gì để tránh leak? (Không hint — viết code từ đầu)
- [ ] **Debug**: Code này print gì: `for (var i=0; i<3; i++) setTimeout(()=>console.log(i), 0)` — và tại sao?
- [ ] **Teach**: Giải thích stale closure trong React cho người chưa biết React, dùng analogy "tờ nhắc từ quá khứ".

💬 **Feynman Prompt:** Giải thích tại sao closure gây memory leak bằng cách nào đó mà bố/mẹ bạn hiểu được — không dùng từ "closure", "GC", hay "reference".

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) — lexical scope là nền tảng của closure
- ➡️ **Enables:** [React Hooks](../03-react/03-hooks-deep-dive.md) — useState/useEffect internals dùng closure; stale closure là core hook pattern
- ➡️ **Enables:** [Async Patterns](./09-async-comprehensive.md) — Promise chains và async/await dùng closure để maintain context
- 🔗 **Applied in:** Module pattern (pre-ES modules), debounce/throttle utilities, memoization, React hooks
