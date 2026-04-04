# Event Loop & Asynchronous JavaScript / Event Loop & JavaScript Bất Đồng Bộ

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./04-closures.md), [this keyword](./05-this-keyword.md)
> **See also**: [ES6+ Features](./08-es6-features.md) | [Concurrency Models](./15-concurrency-models.md)
> **L5 Competencies**: System Design, Performance Optimization, Debugging, Architecture

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee product page performance audit (2024):**

```javascript
// ❌ SLOW: sequential await — 750ms total
const product = await fetchProduct(id); // 300ms
const seller = await fetchSeller(product.sellerId); // 250ms (independent!)
const related = await fetchRelated(id); // 200ms (independent!)

// ✅ FAST: Promise.all cho parallel — 550ms total (27% faster)
const [seller, related] = await Promise.all([
  fetchSeller(product.sellerId), // 250ms ─┐
  fetchRelated(id), // 200ms ─┤ max(250,200) = 250ms
]);
```

3-line change, **200ms saved per page load**. Millions of pageviews → massive impact.

Thêm bug khác: dùng `setTimeout(fn, 0)` để "đợi DOM update xong" — trên production CPU chậm, toast notification hiện sai thứ tự vì `setTimeout` là macrotask, chạy SAU microtask queue và rendering.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Quán phở single chef:**

Một đầu bếp (JS thread) phục vụ khách:

- Nhận order → nấu ngay (synchronous: tính toán, DOM)
- Đặt nồi nước sôi (async: fetch, setTimeout) → trong khi chờ, nhận order tiếp
- Nước sôi xong → phục vụ theo **ưu tiên**: khách VIP (microtasks) trước, khách thường (macrotasks) sau

**Event Loop = người quản lý hàng đợi ưu tiên.**

**Tại sao JS single-threaded?** → DOM manipulation cần atomic — 2 threads cùng sửa DOM = race condition. Event Loop đủ mạnh cho 99% web use cases, đơn giản hơn mutex/lock.

**Evolution: Callbacks → Promises → async/await:**

- Callbacks: "gọi function này khi done" → nesting hell, no error chain
- Promises: "object đại diện cho future value" → chainable, `.catch()` centralized
- async/await: syntactic sugar → reads like sync, behaves async

---

## Concept Map / Bản Đồ Khái Niệm

```
JS Runtime:
┌──────────────────────────────────────────────────────────┐
│  Call Stack            Web APIs (Browser/Node)            │
│  ┌──────────┐          ┌──────────────────────────┐      │
│  │ fn3()    │          │ setTimeout → timer       │      │
│  │ fn2()    │─offload─►│ fetch → network          │      │
│  │ fn1()    │          │ addEventListener → event │      │
│  └────┬─────┘          └──────────┬───────────────┘      │
│       │ (stack empty)             │ (callback ready)     │
│       ▼                           ▼                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Microtask Queue (PRIORITY — drain COMPLETELY)    │    │
│  │ Promise.then | queueMicrotask | MutationObserver │    │
│  └──────────────────────────────────────────────────┘    │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Macrotask Queue (1 per loop iteration)           │    │
│  │ setTimeout | setInterval | I/O | UI events       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  CYCLE: Stack empty → ALL microtasks → Render → 1 macro  │
└──────────────────────────────────────────────────────────┘
```

---

## Overview / Tổng Quan

JavaScript single-threaded nhưng non-blocking nhờ Event Loop. Async operations offload cho browser/Node APIs, kết quả vào queues — event loop poll queue khi call stack empty.

5 concepts chính:

1. **Call Stack & Event Loop Cycle** — execution model cốt lõi
2. **Microtasks vs Macrotasks** — priority system quyết định thứ tự
3. **Callbacks → Promises → async/await** — evolution & patterns
4. **Promise Combinators** — all/allSettled/race/any cho concurrent operations
5. **Browser Rendering & requestAnimationFrame** — visual performance

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Call Stack & Event Loop Cycle

> 🧠 **Memory Hook:** "Call Stack = **chồng đĩa LIFO** — đặt vào trên cùng, lấy ra từ trên cùng. Event Loop = **vòng lặp vô hạn** check queues khi stack empty."

**Tại sao tồn tại? / Why does this exist?**

JS cần track "đang ở đâu trong chương trình" khi gọi hàm lồng nhau. Stack là structure tự nhiên nhất.
→ Stack Overflow = recursion không có base case → exceed memory limit.
→ Blocking code = heavy sync task → UI freeze vì browser không render được.

#### Layer 1: Simple Analogy

Call Stack như **bookmark trong sách** — đọc chương 5, nhảy sang phụ lục A → đặt bookmark. Xong phụ lục → quay lại bookmark. Mỗi bookmark = 1 stack frame.

#### Layer 2: How It Works

```javascript
function c() {
  console.log("C");
}
function b() {
  c();
}
function a() {
  b();
}
a();

// Stack progression:
// [main] → [a()] → [b()] → [c()]    ← c() runs
// [main] → [a()] → [b()]             ← c() popped
// [main] → [a()]                      ← b() popped
// [main]                              ← a() popped
// []                                  ← stack empty → Event Loop checks queues
```

**Event Loop Cycle (chạy mãi):**

```
① Run sync code → call stack empties
② Drain ALL microtasks (Promise.then, queueMicrotask)
   └─ new microtasks added during drain ALSO run now
③ Render opportunity: rAF → Layout → Paint (~16.7ms/frame)
④ Take ONE macrotask (setTimeout, I/O, click events)
⑤ Repeat from ①
```

#### Layer 3: Blocking & Solutions

```javascript
// ❌ UI freeze — 3 seconds no clicks, no scroll
function heavySync() {
  const start = Date.now();
  while (Date.now() - start < 3000) {} // blocks stack
}

// ✅ Fix: chunk with setTimeout (yield to event loop)
function processChunk(items, index = 0) {
  const CHUNK = 100;
  for (let i = index; i < Math.min(index + CHUNK, items.length); i++) {
    processItem(items[i]);
  }
  if (index + CHUNK < items.length) {
    setTimeout(() => processChunk(items, index + CHUNK), 0); // yield
  }
}

// ✅ Fix: Web Worker (separate thread, no DOM access)
const worker = new Worker("heavy.js");
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => updateUI(e.data);
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                | Đúng là                                           |
| ------------------------------ | ---------------------------------------------------------- | ------------------------------------------------- |
| "setTimeout(fn, 0) chạy ngay"  | Vào macrotask queue — chờ microtasks xong                  | Có thể delay hàng chục ms nếu microtask queue dài |
| Blocking code chỉ chậm         | UI FREEZE — không click, scroll được                       | Chunk hoặc Web Worker                             |
| "async/await giúp không block" | Chỉ yield tại `await` point, sync code bên trong vẫn block | Không có real async operation → vẫn block         |

**🎯 Interview Pattern:**

- Khi thấy: output order puzzle với setTimeout + Promise
- → Trace: sync → microtasks → macrotask
- → Mở đầu: "JavaScript single-threaded, Event Loop ưu tiên drain microtask hoàn toàn trước macrotask..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Scope](./03-scope-hoisting.md), [Closures](./04-closures.md)
- ➡️ Để hiểu: Microtask vs Macrotask priority (concept 2)

---

### 2. Microtasks vs Macrotasks — Priority System

> 🧠 **Memory Hook:** "**Micro** chạy **M**ọi thứ khi stack empty — drain **COMPLETELY** trước macro."

**Tại sao tồn tại? / Why does this exist?**

Promise cần `.then()` chạy ngay sau resolve, không bị delay bởi timers.
→ Không có priority → `Promise.resolve().then(fn)` và `setTimeout(fn, 0)` sẽ không deterministic.
→ React 18 dùng microtask queue cho automatic batching.

#### Layer 1: Simple Analogy

Hàng đợi ngân hàng: **vé đỏ** (microtask: VIP) và **vé xanh** (macrotask: thường). Sau mỗi giao dịch → phục vụ HẾT vé đỏ → mới gọi 1 vé xanh. Vé đỏ tạo thêm vé đỏ → vẫn phục vụ trước!

#### Layer 2: The Priority Queue

| Queue     | APIs                                                                                | Priority | Drain                 |
| --------- | ----------------------------------------------------------------------------------- | -------- | --------------------- |
| Microtask | `Promise.then/catch/finally`, `queueMicrotask()`, `async/await`, `MutationObserver` | **Cao**  | Drain ALL trước macro |
| Macrotask | `setTimeout`, `setInterval`, I/O callbacks, UI events                               | Thấp     | 1 task per iteration  |

```javascript
// Classic puzzle — predict output:
console.log("1: sync");
setTimeout(() => console.log("2: timeout"), 0);
Promise.resolve()
  .then(() => console.log("3: micro 1"))
  .then(() => console.log("4: micro 2"));
console.log("5: sync");

// Output: 1 → 5 → 3 → 4 → 2
// WHY: Sync runs → stack empty → ALL microtasks → 1 macrotask
```

#### Layer 3: Microtask Starvation

```javascript
// DANGER: Infinite microtask → UI FREEZES
function infinite() {
  Promise.resolve().then(() => infinite()); // never yields
}
infinite(); // macrotasks + rendering NEVER run

// Safe infinite loop with macrotask
function safe() {
  setTimeout(() => safe(), 0); // browser renders between iterations
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                    | Tại sao sai                                       | Đúng là                                               |
| ------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------- |
| "async/await là macrotask"                 | `await` desugars thành `.then()` = microtask      | `await` = microtask, cùng priority với Promise.then   |
| "setTimeout(0) = đảm bảo sau DOM"          | DOM update không xảy ra giữa microtasks           | Dùng `requestAnimationFrame` cho visual updates       |
| "Promise.then chạy async giống setTimeout" | Cả hai async nhưng microtask LUÔN trước macrotask | Trace queue type: Promise → micro, setTimeout → macro |

**🎯 Interview Pattern:**

- Khi thấy: output order puzzle
- → Algorithm: (1) sync, (2) drain ALL microtasks, (3) 1 macrotask, (4) repeat
- → Mở đầu: "Trace Event Loop: sync trước, drain microtask hoàn toàn, rồi macrotask..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Call Stack & Event Loop (concept 1)
- ➡️ Để hiểu: Promise patterns, browser rendering

---

### 3. Callbacks → Promises → async/await

> 🧠 **Memory Hook:** "Promise = **IOU note** — 3 states: pending (đang), fulfilled (xong+value), rejected (lỗi+reason). States IRREVERSIBLE."

**Tại sao evolution? / Why does this exist?**

Callbacks gây: nesting hell, duplicate error handling, inversion of control.
→ Promises: chainable `.then()`, single `.catch()`, pass as values.
→ async/await: reads like sync, same execution model underneath.

#### Layer 1: Simple Analogy

- Callback = "gửi xe valet — hy vọng họ gọi lại khi xong"
- Promise = "nhận ticket gửi xe — bạn hold token đại diện future value"
- async/await = "ngồi chờ nhưng vẫn scroll phone — yield control khi chờ"

#### Layer 2: Evolution in Code

```javascript
// ❌ Callback hell
getUserData(id, function (err, user) {
  if (err) return handleError(err);
  getOrders(user.id, function (err, orders) {
    if (err) return handleError(err);
    renderPage(user, orders);
  });
});

// ✅ Promise chain
fetchUser(id)
  .then((user) => fetchOrders(user.id))
  .then((orders) => renderPage(orders))
  .catch((err) => showError(err)) // catches ANY error in chain
  .finally(() => hideLoading()); // always runs

// ✅ async/await — best readability
async function loadPage(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    return renderPage(user, orders);
  } catch (err) {
    showError(err); // = .catch()
  }
}
```

```
async/await execution model:
async function foo() {
  console.log('A');           // sync — runs immediately
  const x = await bar();     // suspends foo, returns to caller
  console.log('B', x);       // resumes when bar() settles
}
foo();
console.log('C');             // runs BEFORE 'B' — foo suspended
// Output: A, C, B
```

#### Layer 3: Common Pitfalls

```javascript
// ❌ Sequential await for INDEPENDENT operations
const a = await fetchA(); // 200ms
const b = await fetchB(); // 200ms  → total 400ms

// ✅ Parallel with Promise.all
const [a, b] = await Promise.all([fetchA(), fetchB()]); // → 200ms

// ❌ async forEach — doesn't wait
await urls.forEach(async (url) => {
  await fetch(url);
}); // forEach ignores returned Promise

// ✅ Fix: for...of (sequential) or Promise.all(map) (parallel)
for (const url of urls) {
  await fetch(url);
} // sequential
const results = await Promise.all(urls.map((url) => fetch(url))); // parallel
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                      | Đúng là                                 |
| ------------------------------------- | ------------------------------------------------ | --------------------------------------- |
| Sequential await cho independent ops  | Serializes what could be parallel                | `Promise.all([a(), b()])`               |
| `await` trong `forEach`               | forEach doesn't await async callbacks            | `for...of` hoặc `Promise.all(map)`      |
| Quên try/catch trong async            | Unhandled rejection → crash (Node)               | try/catch inside hoặc caller `.catch()` |
| `new Promise(async (resolve) => ...)` | Async executor — exceptions not caught by reject | Promise.resolve().then(async () => ...) |

**🎯 Interview Pattern:**

- Khi thấy: "rewrite callback to async", "why is this slow?"
- → Check: independent awaits? → Promise.all. forEach? → for...of or map.
- → Mở đầu: "These awaits run sequentially but they're independent — Promise.all parallelizes them..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — async callbacks capture scope
- ➡️ Để hiểu: Promise combinators (concept 4), React useEffect async patterns

---

### 4. Promise Combinators

> 🧠 **Memory Hook:** "`all` = ALL or nothing. `allSettled` = ALL report. `race` = FIRST settles. `any` = FIRST succeeds."

**Tại sao tồn tại? / Why does this exist?**

Real-world async thường involve multiple operations with different requirements: all-or-nothing (payment), partial-failure OK (analytics), timeout enforcement, fastest source selection.

#### Layer 1: Simple Analogy

- `all` = "Đội bóng: 1 người chấn thương → cả đội thua" (fail-fast)
- `allSettled` = "Kỳ thi: ai thi xong thì báo kết quả, đợi tất cả"
- `race` = "Đua xe: ai về đích trước thắng (kể cả DNF)"
- `any` = "Tuyển dụng: chỉ cần 1 ứng viên đỗ"

#### Layer 2: Combinators in Practice

```javascript
// all — tất cả phải thành công (fail-fast)
const [user, config] = await Promise.all([fetchUser(id), fetchConfig()]);

// allSettled — báo cáo tất cả, partial failure OK
const results = await Promise.allSettled([sendA(), sendB(), sendC()]);
const failures = results.filter((r) => r.status === "rejected");

// race — timeout pattern
const data = await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject("timeout"), 3000)),
]);

// any — fastest source wins (ES2021)
const asset = await Promise.any([cdnA.get(url), cdnB.get(url)]);
```

| Method       | Resolves       | Rejects                 | Use case                            |
| ------------ | -------------- | ----------------------- | ----------------------------------- |
| `all`        | ALL fulfilled  | ANY rejects (fail-fast) | Payment flow — all or nothing       |
| `allSettled` | ALL settled    | Never rejects           | Analytics batch, partial failure OK |
| `race`       | FIRST settles  | FIRST rejects           | Timeout enforcement                 |
| `any`        | FIRST fulfills | ALL reject              | Fastest CDN, fallback sources       |

#### Layer 3: Advanced Patterns

```javascript
// Controlled concurrency — batch of N
async function batchProcess(urls, batchSize = 3) {
  const results = [];
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((url) => fetch(url)));
    results.push(...batchResults);
  }
  return results;
}

// Promise.withResolvers (ES2024) — external resolve/reject
const { promise, resolve, reject } = Promise.withResolvers();
// Can pass resolve/reject to other code
eventEmitter.on("done", resolve);
eventEmitter.on("error", reject);
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                  | Đúng là                                  |
| ------------------------------ | -------------------------------------------- | ---------------------------------------- |
| `Promise.all` khi 1 failure OK | `all` fail-fast → toàn bộ reject             | `Promise.allSettled` cho partial failure |
| Không return trong `.then()`   | Next `.then()` gets undefined                | Always return to chain properly          |
| `Promise.race` = first success | `race` = first SETTLED (including rejection) | Dùng `Promise.any` cho first success     |

**🎯 Interview Pattern:**

- Khi thấy: "fetch multiple resources", "timeout pattern"
- → Choose combinator based on requirements
- → Mở đầu: "Depends on whether ALL must succeed or partial failure is OK..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Promise basics (concept 3)
- ➡️ Để hiểu: Error handling patterns, retry with backoff

---

### 5. Browser Rendering & requestAnimationFrame

> 🧠 **Memory Hook:** "rAF = Run right **A**fter **F**rame due — chạy ngay trước khi browser vẽ. 60fps = 16.7ms/frame."

**Tại sao tồn tại? / Why does this exist?**

`setTimeout(fn, 16)` cho animation không đồng bộ với display refresh → giật. rAF được browser gọi đúng trước paint → smooth.
→ rAF tự pause khi tab hidden → không waste CPU.

#### Layer 1: Simple Analogy

TV real-time: cách dở = update mỗi 16ms bất kể TV ready. Cách đúng = TV nói "sắp vẽ frame mới, cần update gì?" → đó là rAF.

#### Layer 2: rAF in Event Loop

```
Event Loop iteration:
  [Stack] → [ALL microtasks] → [Render: rAF → Layout → Paint] → [1 macrotask]
                                  ↑
                    rAF callbacks run HERE (before paint)
```

```javascript
// ✅ Smooth animation with rAF
let pos = 0;
function animate() {
  pos += 2;
  element.style.left = pos + "px";
  if (pos < 300) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ❌ Layout thrashing — forced synchronous layout
elements.forEach((el) => {
  const width = el.offsetWidth; // READ → forces layout
  el.style.width = width * 2 + "px"; // WRITE → invalidates layout
  // Next READ forces layout AGAIN — N forced layouts!
});

// ✅ Batch reads then writes
const widths = elements.map((el) => el.offsetWidth); // all READs
elements.forEach((el, i) => (el.style.width = widths[i] * 2 + "px")); // all WRITEs
```

#### Layer 3: Scheduling APIs

| API                         | Queue     | Runs when                   | Use for                    |
| --------------------------- | --------- | --------------------------- | -------------------------- |
| `queueMicrotask(fn)`        | Microtask | Before macro, before render | Defer but stay "same tick" |
| `requestAnimationFrame(fn)` | Render    | Before paint                | Animation, visual DOM      |
| `setTimeout(fn, 0)`         | Macrotask | After micro + render        | Yield to event loop        |
| `scheduler.postTask(fn)`    | Variable  | Priority-based              | Modern scheduling          |

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                  | Đúng là                                         |
| ----------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| `setInterval(fn, 16)` cho animation | Không sync display, waste CPU khi tab hidden | `requestAnimationFrame`                         |
| DOM read/write xen kẽ               | Forced layout mỗi read sau write             | Batch reads trước, writes sau                   |
| Nghĩ rAF là macrotask               | rAF là render step — riêng biệt              | rAF chạy trong rendering, không phải task queue |

**🎯 Interview Pattern:**

- Khi thấy: "animation giật", "optimize DOM"
- → rAF cho animation, batch reads/writes cho DOM
- → Mở đầu: "Browser render ở 60fps, 16.7ms/frame. rAF sync với render cycle..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Microtask queue (concept 2)
- ➡️ Để hiểu: Core Web Vitals, LCP/FID optimization

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: Predict output — classic Event Loop puzzle 🟢

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**A:** `A → D → C → B`. Sync (A, D) → microtask (C: Promise.then) → macrotask (B: setTimeout).

**💡 Interview Signal:**

- ✅ Strong: Trace từng bước, phân biệt queue type
- ❌ Weak: Đoán `A D B C` (nhầm Promise là macro)

---

### Q2: Promise 3 states là gì? Có thể quay lại không? 🟢

**A:** Pending (đang xử lý), Fulfilled (thành công + value), Rejected (thất bại + reason). States **irreversible** — một khi settled là mãi mãi. `.then()` chain return new Promise mỗi bước. `.catch()` catch bất kỳ error nào trong chain. `.finally()` luôn chạy.

**💡 Interview Signal:**

- ✅ Strong: 3 states + irreversibility + chain mechanics
- ❌ Weak: "Promise tránh callback hell" — đúng nhưng không define được Promise

---

### Q3: Chained microtasks — predict output 🟡

```javascript
console.log("1");
setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);
Promise.resolve()
  .then(() => {
    console.log("4");
    setTimeout(() => console.log("5"), 0);
  })
  .then(() => console.log("6"));
console.log("7");
```

**A:** `1 → 7 → 4 → 6 → 2 → 3 → 5`

Trace: Sync (1, 7) → microtasks (4 → queue setTimeout(5) → 6) → macrotask A (2 → queue microtask 3) → microtask (3) → macrotask B (5).

Key: mỗi macrotask hoàn thành → drain microtask queue ngay sau.

**💡 Interview Signal:**

- ✅ Strong: Biết macrotask tạo microtask → drain ngay sau
- ❌ Weak: Nhầm 3 và 5 position

---

### Q4: Promise.all vs allSettled vs race vs any — khi nào dùng? 🟡

**A:** all = ALL must succeed (fail-fast). allSettled = report all results regardless. race = first SETTLED (including rejection) → timeout pattern. any = first FULFILLED (ignores rejections unless ALL reject).

Chọn: payment flow → all. Analytics → allSettled. Timeout → race. Fastest CDN → any.

**💡 Interview Signal:**

- ✅ Strong: Use case + fail-fast behavior + any vs race distinction
- ❌ Weak: Chỉ biết Promise.all

---

### Q5: Tại sao `await` trong `forEach` không work? Fix? 🟡

```javascript
await urls.forEach(async (url) => {
  await fetch(url);
});
console.log(results); // [] — empty!
```

**A:** `forEach` doesn't return Promise, doesn't await async callbacks. `await undefined` = no-op.

Fix: `for...of` (sequential), `Promise.all(urls.map(fn))` (parallel), batched `Promise.all` (controlled concurrency).

**💡 Interview Signal:**

- ✅ Strong: forEach mechanics, 3 fixes + sequential vs parallel trade-off
- ❌ Weak: Chỉ dùng for...of — miss parallel option

---

### Q6: Design async retry with exponential backoff 🔴

**A:**

```javascript
async function retryWithBackoff(
  fn,
  {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = (err) => err.status >= 500,
  } = {},
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!shouldRetry(err) || attempt === maxAttempts) throw err;
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000, // jitter
        maxDelay,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

Key: exponential backoff (500→1000→2000ms), **jitter** (`+ random`) prevents thundering herd, `shouldRetry` predicate (don't retry 4xx), max delay cap.

**💡 Interview Signal:**

- ✅ Strong: Jitter + thundering herd, shouldRetry predicate, configurable
- ❌ Weak: Simple retry loop without backoff or jitter

**🔗 Follow-up chain:**

1. "Thundering herd là gì?" → N clients retry cùng lúc → server spike. Jitter spread retries over time.
2. "AbortController integration?" → Pass AbortSignal → cancel pending request on retry/unmount.
3. "Circuit breaker pattern?" → After N failures, stop retrying → fallback → gradually test recovery.

---

### Q7: setTimeout vs queueMicrotask vs rAF — khi nào dùng? 🔴

**A:**

| API                     | Queue     | Use for                                          |
| ----------------------- | --------- | ------------------------------------------------ |
| `queueMicrotask`        | Microtask | Defer nhưng "same tick" — batch state updates    |
| `setTimeout(fn, 0)`     | Macrotask | Yield to event loop — chunking heavy work        |
| `requestAnimationFrame` | Render    | Animation, visual DOM updates — sync với display |
| `scheduler.postTask`    | Variable  | Modern priority scheduling                       |

queueMicrotask = trước render. setTimeout = sau render. rAF = trong render step.

**💡 Interview Signal:**

- ✅ Strong: 4 APIs + use cases + render timing
- ❌ Weak: "setTimeout và queueMicrotask giống nhau"

**🔗 Follow-up chain:**

1. "queueMicrotask có thể starve rendering không?" → YES — infinite microtask loop blocks render/macrotask.
2. "requestIdleCallback khác rAF thế nào?" → rIC chạy khi browser idle, low priority. rAF chạy mỗi frame.
3. "scheduler.postTask support?" → Chrome 94+. Fallback: setTimeout cho background, rAF cho user-visible.

---

### Q8: Design debounced search với race condition handling 🔴

**A:**

```javascript
function createDebouncedSearch(searchFn, delay = 300) {
  let timeoutId;
  let currentRequestId = 0;

  return async function (query) {
    clearTimeout(timeoutId);
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        const requestId = ++currentRequestId;
        try {
          const result = await searchFn(query);
          if (requestId === currentRequestId) resolve(result);
          // else: stale response, ignore
        } catch (err) {
          if (requestId === currentRequestId) reject(err);
        }
      }, delay);
    });
  };
}
```

Key: monotonically increasing request ID — stale responses ignored. Same pattern as AbortController at fetch level.

**💡 Interview Signal:**

- ✅ Strong: Race condition fix (request ID / AbortController), Promise reject for stale
- ❌ Weak: Debounce only — miss race condition

**🔗 Follow-up chain:**

1. "AbortController approach?" → `controller.abort()` in clearTimeout → cancel in-flight request.
2. "React integration?" → `useMemo(() => createDebouncedSearch(fn), [])` + `useEffect` with cleanup.
3. "Memory leak?" → Nếu component unmount while timeout pending → clearTimeout in useEffect cleanup.

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Axon — JSON Parsing Blocked the Main Thread, Froze Camera Feed UI

**Situation:** Axon's evidence review tool allowed officers to export large case files as JSON (sometimes 50MB+). A "load case" button parsed the JSON synchronously, blocking the event loop for 3-5 seconds during which the live camera feed preview froze and UI input was completely unresponsive.

**What went wrong:**
```javascript
// Blocking the event loop:
loadCaseBtn.addEventListener('click', async () => {
  const raw = await fetch('/api/case/123/export').then(r => r.text());
  const caseData = JSON.parse(raw); // ← 50MB JSON parse: 3-5 seconds on main thread
  // Event loop blocked during parse: camera feed drops frames, UI freezes
  renderCaseData(caseData);
});
```

**Decision made:** Offloaded JSON parsing to a Web Worker:
```javascript
// main.js
const worker = new Worker('/workers/json-parser.js');
worker.postMessage({ raw }); // transfer raw string off main thread
worker.onmessage = ({ data }) => renderCaseData(data.caseData);

// workers/json-parser.js
self.onmessage = ({ data }) => {
  const caseData = JSON.parse(data.raw); // runs in separate thread
  self.postMessage({ caseData });
};
```

**Trade-off accepted:** Web Worker adds `postMessage` serialization overhead (~10ms for 50MB). The team also evaluated streaming JSON parsers (`@streamparser/json`) which parse incrementally without blocking — ultimately used streaming for the largest files, Web Worker for medium-sized ones.

**Lesson:** `JSON.parse` on large payloads is a synchronous CPU operation that fully blocks the event loop. Any operation that takes >16ms belongs in a Worker or must be broken into microtasks via `setTimeout(fn, 0)` chunks. The event loop's single-threaded nature is not a limitation to work around — it's a constraint to design for.

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                     | Level | One-liner                                                                    |
| --- | ------------------------- | ----- | ---------------------------------------------------------------------------- |
| 1   | Classic output puzzle     | 🟢    | Sync → microtasks → macrotasks (A D C B)                                     |
| 2   | Promise 3 states          | 🟢    | pending/fulfilled/rejected, irreversible                                     |
| 3   | Chained microtasks        | 🟡    | Macrotask creates microtask → drain immediately after                        |
| 4   | Promise combinators       | 🟡    | all=fail-fast, allSettled=report-all, race=first-settles, any=first-fulfills |
| 5   | async forEach bug         | 🟡    | forEach ignores async; use for...of or Promise.all(map)                      |
| 6   | Retry with backoff        | 🔴    | Exponential + jitter + shouldRetry predicate                                 |
| 7   | Scheduling APIs           | 🔴    | queueMicrotask < render(rAF) < setTimeout; each has specific use             |
| 8   | Debounce + race condition | 🔴    | Monotonic request ID ignores stale responses                                 |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer: **"Giải thích Event Loop và tại sao microtasks chạy trước macrotasks?"**

**30 giây đầu:**

1. "JS single-threaded — 1 Call Stack. Async offload cho browser APIs, kết quả vào queues."
2. "Event Loop: stack empty → drain ALL microtasks → render opportunity → 1 macrotask → repeat."
3. "Microtasks priority cao hơn vì Promises cần `.then()` chạy ngay sau resolve — không deterministic nếu setTimeout chen."
4. "Ví dụ: `Promise.resolve().then(A)` + `setTimeout(B, 0)` → A luôn trước B."

---

## 🔄 Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                               |
| --- | -------------- | ------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Vẽ Event Loop diagram từ trí nhớ: Call Stack, Web APIs, 2 Queues, thứ tự.             |
| 2   | 🎨 Visual      | Trace: `setTimeout(()=>log('X'), 0); Promise.resolve().then(()=>log('Y')); log('Z');` |
| 3   | 🛠️ Application | 100,000 items cần xử lý không block UI. setTimeout, queueMicrotask, hay Worker?       |
| 4   | 🐛 Debug       | Animation dùng `setInterval(fn, 16)` giật. Nguyên nhân? Fix?                          |
| 5   | 🎓 Teach       | Giải thích "setTimeout(fn, 0) không chạy ngay" cho người mới — dùng analogy hàng đợi. |

### Key Points

| #   | Key Point                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Sau mỗi macrotask: drain ALL microtasks trước macrotask tiếp. Micro: Promise.then. Macro: setTimeout.      |
| 2   | Z (sync) → Y (micro) → X (macro).                                                                          |
| 3   | setTimeout chunks cho CPU. Worker cho heavy computation parallel. Không queueMicrotask vì block rendering. |
| 4   | setInterval không sync display, queue chồng khi callback > 16ms. Fix: rAF.                                 |
| 5   | setTimeout(0) = "xếp hàng café" — không chen được người đang ở quầy (stack). Chờ queue dù "0 giây".        |

> 🎯 **Feynman Prompt:** Giải thích microtask vs macrotask bằng "quán phở với khách VIP" — không thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track

- [Closures](./04-closures.md) — async callbacks capture scope via closures
- [ES6+ Features](./08-es6-features.md) — Promises, iterators, generators
- [Concurrency Models](./15-concurrency-models.md) — Web Workers, SharedArrayBuffer

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Concurrency](../../be-track/01-golang/03-concurrency.md) — Go uses goroutines + channels (M:N threading) vs JS single-threaded event loop; fundamentally different concurrency models with different failure modes
- 🔗 **FE — React**: [React Hooks](../03-react/03-hooks-deep-dive.md) — `useEffect` async patterns, cleanup functions, avoiding stale closures in async callbacks
- 🔗 **FE — Performance**: [React Performance](../03-react/09-performance-optimization.md) — blocking the event loop with heavy computation causes dropped frames; offload to Web Workers
- 🔗 **Shared theory**: [Concurrency & Parallelism](../../shared/01-cs-fundamentals/07-concurrency-and-parallelism.md) — theoretical foundation: cooperative vs preemptive scheduling, why JS chose single-threaded model
