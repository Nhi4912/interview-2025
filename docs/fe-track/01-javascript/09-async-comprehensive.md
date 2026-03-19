# Asynchronous JavaScript — Comprehensive / JavaScript Bất Đồng Bộ — Toàn Diện

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures-comprehensive.md) | [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
> **See also**: [Event Loop](./06-event-loop-async.md) | [ES6 Features](./11-es6-features-deep.md) | [React Hooks](../03-react/03-hooks-deep-dive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee product page performance audit (2023):**

```javascript
// SLOW: sequential await — 750ms total
const product = await fetchProduct(id);          // 300ms
const seller  = await fetchSeller(product.sellerId); // 250ms (independent!)
const related = await fetchRelated(id);          // 200ms (independent!)

// FAST: Promise.all for parallel — 550ms total (27% faster)
const [seller, related] = await Promise.all([
  fetchSeller(product.sellerId),  // 250ms
  fetchRelated(id),               // 200ms
]);                               // total: max(250, 200) = 250ms, not 450ms
```

Senior engineer noticed during performance review: `seller` and `related` don't depend on each other — zero reason to serialize them. **3-line change, 200ms saved per page load.** At Shopee's scale (millions of pageviews), this matters.

**Bài học:** `async/await` trông giống sequential code NHƯNG bạn vẫn phải thiết kế concurrency. Không biết khi nào dùng `Promise.all` → để performance trên bàn mà không hay biết.

---

## What & Why / Cái Gì & Tại Sao

> 🧠 **Memory Hook**: **JS is single-threaded but non-blocking. Async = "start the task, come back when done" — not "wait and do nothing".**

**Tại sao JS cần async?**
→ JS chạy trên 1 thread — nếu network request block thread, UI freeze hoàn toàn.
→ Browser cần xử lý click events, animations trong khi chờ API — không thể block.
→ Node.js handle 10,000 concurrent connections trên 1 thread nhờ async I/O — không cần 10,000 threads.

**Evolution: Callbacks → Promises → async/await:**
- Callbacks: "gọi function này khi done" — nesting hell, no error chain
- Promises: "đây là đối tượng đại diện cho future value" — chainable, better error handling
- async/await: syntactic sugar trên Promises — reads like sync code, behaves async

**Why this matters for 2026 interviews:**
- Async là 50% của FE development — every API call, timer, event
- Microtask vs macrotask ordering xuất hiện ở Mid/Senior interviews
- `Promise.all` vs `allSettled` vs `race` — design decisions tested at Senior
- Error handling in async code is a common source of production bugs

---

## Concept Map / Bản Đồ Khái Niệm

```
              ASYNC JAVASCRIPT
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 [Callbacks]    [Promises]    [async/await]
  (legacy)      (ES2015)      (ES2017 sugar)
      │              │              │
      └──────────────┼──────────────┘
                     │
               EVENT LOOP
              ┌──────┴──────┐
              ▼             ▼
        [Microtask]    [Macrotask]
        Promise.then   setTimeout
        queueMicrotask setInterval
                       I/O callbacks
```

**Bạn đang ở đây trong lộ trình học:**
```
Closures → Event Loop → [ASYNC: Callbacks/Promises/await] → React useEffect
```

---

## Overview / Tổng Quan

JavaScript is **single-threaded** but handles async operations via the **event loop** — offloading I/O to the browser/Node APIs, then processing callbacks when the call stack is empty.

**Tiếng Việt:** JS chạy trên 1 thread. Async operations (network, timers, file I/O) được delegate cho browser/Node APIs. Khi xong, callbacks được đẩy vào queue — event loop poll queue khi call stack empty. Promises mang lại chainable API và better error handling. async/await là syntactic sugar giúp async code trông như sync.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Callbacks & Callback Hell

> 🧠 **Memory Hook**: **Callback hell = pyramid of doom. Each async step nests one level deeper. Fix: Promises or async/await flatten the pyramid.**

**Tại sao callback hell tồn tại?**
→ Callbacks là cách đơn giản nhất để handle async — "gọi function này khi xong".
→ Nhưng khi cần sequence: A xong → B → C → D, bạn phải nest callbacks.
→ Error handling phải duplicate ở mỗi level — không có centralized catch.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Đặt pizza qua điện thoại: "Khi pizza xong (callback), giao cho tôi. Khi giao xong (callback), tôi sẽ trả tiền. Khi trả xong (callback), cảm ơn nhé." Mỗi bước cần biết bước tiếp — không bước nào biết toàn bộ flow.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// Callback hell — Node.js legacy pattern
getUserData(userId, function(err, user) {
  if (err) return handleError(err);
  getOrders(user.id, function(err, orders) {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, function(err, details) {
      if (err) return handleError(err);
      renderPage(user, orders, details); // finally!
    });
  });
});
// Problems: 3 separate error handlers, hard to read, hard to test
```

```
Callback nesting depth:
Level 0: getUserData(userId, ▶ callback {
Level 1:   getOrders(user.id, ▶ callback {
Level 2:     getOrderDetails(id, ▶ callback {
Level 3:       renderPage(...)
            })
          })
        })  ← "pyramid of doom"
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Zalgo problem**: sometimes callback called sync, sometimes async → inconsistent behavior
- **Lost errors**: forgetting `if (err)` check = silent failure
- **Inversion of control**: you hand your code to a 3rd-party function — hope they call it correctly

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Không check `err` trong every callback | 1 missed check = silent failure, bugs in production | Error-first convention: always check `if (err) return cb(err)` first |
| Gọi callback nhiều lần | "Call once" contract thường implicit, không enforced | Add called flag: `let called = false; if (!called) { called = true; cb() }` |
| Mixing sync and async callbacks | Causes Zalgo — inconsistent call timing | Always async: wrap sync result in `process.nextTick(cb)` or `Promise.resolve()` |

**🎯 Interview Pattern:**
- Khi thấy: "what's wrong with this callback code?", "how to handle multiple async operations?"
- → Identify: nesting depth, error handling, control flow
- → Answer opens with: *"This is callback hell — the nested structure makes error handling difficult and the flow hard to follow. The modern fix is Promises or async/await which flatten the nesting and centralize error handling."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — callbacks capture scope
- ➡️ Để hiểu: Promises below — direct motivation: "callbacks suck, here's better"

---

### 2. Promises

> 🧠 **Memory Hook**: **Promise = IOU note. 3 states: pending (đang làm), fulfilled (xong, có value), rejected (lỗi, có reason). States are irreversible.**

**Tại sao Promises ra đời?**
→ Callbacks gây inversion of control — bạn hand code cho 3rd party.
→ Không có cách natural để sequence async operations mà không nest.
→ Error propagation phải manual ở every level.
→ Promise giải quyết: chainable `.then()`, single `.catch()` catches all, can be passed around like values.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Promise như ticket khi gửi xe: bạn nhận ticket (pending), xe sẵn sàng thì ticket fulfilled (có xe), mất xe thì rejected (có lý do). Bạn có thể chờ ticket được fulfilled để làm việc tiếp — ticket là đại diện cho future value.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// Promise states and transitions
const promise = new Promise((resolve, reject) => {
  // pending here
  fetchData()
    .then(data => resolve(data))    // → fulfilled
    .catch(err => reject(err));     // → rejected
});

// Chaining — each .then returns a new Promise
fetchUser(id)
  .then(user => fetchOrders(user.id))  // returns Promise
  .then(orders => orders.filter(o => o.status === 'active'))
  .then(active => renderOrders(active))
  .catch(err => showError(err))      // catches ANY error in the chain
  .finally(() => hideLoading());     // runs always
```

```
Promise state machine:
┌─────────────────────────────────────────┐
│          PENDING                        │
│             │                           │
│     ┌───────┴───────┐                  │
│     ▼               ▼                  │
│ FULFILLED        REJECTED              │
│  .then()          .catch()             │
│                                         │
│ States are IRREVERSIBLE once settled   │
└─────────────────────────────────────────┘
```

**Promise combinators:**
```javascript
// All must succeed — fails fast on first rejection
const [user, config] = await Promise.all([fetchUser(id), fetchConfig()]);

// Wait for all regardless of outcome — useful for cleanup
const results = await Promise.allSettled([req1(), req2(), req3()]);
results.forEach(r => r.status === 'fulfilled' ? use(r.value) : log(r.reason));

// First to settle wins — useful for timeout pattern
const data = await Promise.race([
  fetchFromPrimary(),
  new Promise((_, reject) => setTimeout(() => reject('timeout'), 3000))
]);

// First to FULFILL (ignores rejections unless ALL reject) — useful for fastest source
const data = await Promise.any([fetchFromCDN1(), fetchFromCDN2(), fetchFromCDN3()]);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Unhandled rejection**: Promise rejected with no `.catch()` → Node.js `unhandledRejection` event → process crash in newer versions
- **Promise.all fail-fast**: 1 rejection → entire Promise.all rejects immediately (others still run but results ignored)
- **Thenable objects**: any object with `.then()` method is treated as Promise — can cause issues with duck typing

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Không return trong `.then()` | Unchained — next `.then()` gets `undefined` | Always `return` inside `.then()` to chain properly |
| `new Promise(async (resolve, reject) => ...)` | Async executor — exceptions inside aren't caught by reject | Use `async` outside: `const p = Promise.resolve().then(async () => ...)` |
| `Promise.all` when 1 failure should not stop others | `all` fail-fast rejects everything | Use `Promise.allSettled` when partial failures are acceptable |

**🎯 Interview Pattern:**
- Khi thấy: "fetch multiple resources", "handle error for all", "timeout pattern"
- → Choose combinator: `all` (all must succeed), `allSettled` (partial failure OK), `race` (timeout), `any` (fastest winner)
- → Answer opens with: *"This depends on whether ALL operations must succeed or if partial failures are acceptable. Promise.all for 'all or nothing', Promise.allSettled for 'try all, report each result'."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: Callbacks — what problem Promises solve
- ➡️ Để hiểu: async/await — syntactic sugar built on top of Promises

---

### 3. async/await

> 🧠 **Memory Hook**: **async/await is Promises in disguise. Every `async function` returns a Promise. Every `await` is `.then()` in disguise. Error: `try/catch` = `.catch()`.**

**Tại sao async/await ra đời?**
→ Promise chains vẫn verbose với `.then().then().then()`.
→ Error handling với nested try/catch in promise chains is tricky.
→ async/await: makes async code read like synchronous — easier mental model, but same execution model underneath.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Async/await như đọc recipe theo từng bước: "Đun nước (await), cho trà vào (await), đợi 3 phút (await), uống." Từng bước phải chờ xong mới làm bước tiếp — nhưng trong lúc đó, bếp khác vẫn nấu được (event loop continues).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// Syntactic transformation: async/await ↔ Promises
async function loadPage(userId) {
  try {
    const user = await fetchUser(userId);       // = fetchUser(userId).then(...)
    const [orders, prefs] = await Promise.all([
      fetchOrders(user.id),                     // parallel!
      fetchPreferences(user.id),
    ]);
    return renderPage(user, orders, prefs);
  } catch (err) {
    return showError(err);                      // = .catch(err => ...)
  }
}

// Equivalent Promise chain (less readable):
function loadPage(userId) {
  return fetchUser(userId)
    .then(user => Promise.all([
      fetchOrders(user.id),
      fetchPreferences(user.id),
    ]).then(([orders, prefs]) => renderPage(user, orders, prefs)))
    .catch(err => showError(err));
}
```

```
async/await execution model:
async function foo() {
  console.log('A');              // sync — runs immediately
  const x = await bar();        // suspends foo, returns to caller
  console.log('B', x);          // resumes when bar() promise settles
}
foo();
console.log('C');               // runs BEFORE 'B' — foo is suspended at await
// Output: A, C, B
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Sequential await anti-pattern**: `await a; await b;` when a and b are independent = unnecessary serialization
- **Top-level await**: available in ES modules; in older environments, wrap in IIFE `(async () => { ... })()`
- **Error handling gotcha**: forgetting `try/catch` → unhandled rejection. Consider wrapping utility:

```javascript
// Utility to avoid try/catch everywhere (Go-style)
const [err, data] = await to(fetchData());
if (err) return handleError(err);
```

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Sequential await for independent operations | Serializes what could be parallel — wastes time | Use `Promise.all([await1, await2])` for independent operations |
| `await` inside forEach | forEach doesn't wait for async callbacks | Use `for...of` or `Promise.all(arr.map(async item => ...))` |
| Not catching errors from `async` function callers | `async function` returns Promise — caller needs `.catch()` | Either try/catch inside OR caller handles: `loadPage().catch(log)` |

**🎯 Interview Pattern:**
- Khi thấy: "rewrite this Promise chain", "why is this slow?", "why doesn't forEach wait?"
- → Check: are awaits independent? Use Promise.all. forEach + async? Switch to for...of or Promise.all(map)
- → Answer opens with: *"The issue is these awaits are running sequentially when they don't need to. Since [A] and [B] don't depend on each other, they should run in parallel with Promise.all."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: Promises — async/await is syntactic sugar on top
- ➡️ Để hiểu: [React Hooks](../03-react/03-hooks-deep-dive.md) — useEffect with async; [Event Loop](./06-event-loop-async.md) — microtask ordering

---

### 4. Microtasks vs Macrotasks / Vi Tác Vụ vs Macro Tác Vụ

> 🧠 **Memory Hook**: **Microtask queue drains COMPLETELY before next macrotask. Promise.then = microtask. setTimeout = macrotask.**

**Tại sao 2 queue khác nhau?**
→ Để Promises có priority cao hơn timers — state updates happen before next paint.
→ React's synthetic events dùng microtask queue để batch state updates.
→ Nếu không có microtask priority, Promise.then có thể bị delay by timers.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Như người chạy việc vặt: hoàn thành việc hiện tại (call stack), rồi kiểm tra "nhắc nhở ngay" (microtask queue) — xử lý HẾT trước khi xem "việc hẹn giờ" (macrotask queue).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
console.log('1');                         // sync

setTimeout(() => console.log('2'), 0);   // macrotask queue

Promise.resolve().then(() => console.log('3')); // microtask queue

console.log('4');                         // sync

// Output: 1, 4, 3, 2
// Why: sync → sync → microtask queue drains → macrotask
```

```
Event loop tick:
┌──────────────────────────────────────────────────────┐
│ 1. Execute current call stack (sync code)            │
│ 2. Drain microtask queue (ALL items, including new   │
│    microtasks added during drain)                    │
│    └── Promise.then, queueMicrotask, MutationObserver│
│ 3. Render (if needed)                                │
│ 4. Pick ONE macrotask from macrotask queue           │
│    └── setTimeout, setInterval, I/O callbacks        │
│ 5. Repeat                                            │
└──────────────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Microtask starvation**: if microtask queue never empties (microtask adds microtask), macrotasks never run — UI freezes
- `queueMicrotask()`: explicitly add to microtask queue (better than `Promise.resolve().then()`)
- `process.nextTick` (Node.js): even higher priority than Promise microtasks — runs before Promise callbacks

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "setTimeout(fn, 0) runs immediately after current code" | Macrotask — waits for ALL microtasks first | Promise.then callbacks run before setTimeout(fn, 0) |
| "Promise callbacks are synchronous" | Promise.then always async — even if resolved immediately | `Promise.resolve().then(fn)` — fn runs after current sync code finishes |

**🎯 Interview Pattern:**
- Khi thấy: "what order does this log?", "why does this run before that?"
- → Categorize each: sync / microtask (Promise.then) / macrotask (setTimeout)
- → Answer opens with: *"The execution order here is: sync code first, then all microtasks (Promise.then) drain completely, then macrotasks (setTimeout). So the output is..."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Event Loop](./06-event-loop-async.md) — the mechanism
- ➡️ Để hiểu: React batching — React 18 uses microtasks for automatic batching

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: What is a Promise? What are its states? / Promise là gì? Các trạng thái? 🟢 Junior

**A:** A Promise is an object representing the eventual completion or failure of an async operation. It has 3 states: **pending** (not yet settled), **fulfilled** (completed with value), **rejected** (failed with reason). Once settled, state is irreversible.

```javascript
const p = new Promise((resolve, reject) => {
  fetchData()
    .then(data => resolve(data))   // fulfilled
    .catch(err => reject(err));    // rejected
});

p.then(data => use(data))
 .catch(err => handle(err))
 .finally(() => cleanup());
```

**Tiếng Việt:** Promise là IOU (I Owe You) — đối tượng đại diện cho kết quả trong tương lai. 3 trạng thái: pending (đang xử lý), fulfilled (thành công + value), rejected (thất bại + reason). Không thể quay lại trạng thái trước — một khi settled là settled mãi. `.finally()` chạy dù fulfilled hay rejected — dùng cho cleanup.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Nêu đủ 3 states + irreversibility, giải thích `.then/.catch/.finally`, biết Promise vs callback improvement
- ❌ Weak: "Promise giúp tránh callback hell" — đúng nhưng không định nghĩa được Promise

---

### Q: What is the difference between Promise.all, Promise.allSettled, Promise.race, Promise.any? 🟡 Mid

**A:**

| Method | Resolves when | Rejects when | Use case |
|--------|--------------|--------------|----------|
| `Promise.all` | ALL fulfilled | ANY rejects (fail-fast) | All operations must succeed |
| `Promise.allSettled` | ALL settled (either) | Never rejects | Report all results, partial failure OK |
| `Promise.race` | FIRST settles (any) | First settles with rejection | Timeout pattern |
| `Promise.any` | FIRST fulfills | ALL reject | Fastest source wins |

```javascript
// Shopee parallel data load — all must succeed
const [user, inventory] = await Promise.all([getUser(id), getInventory()]);

// Grab analytics batch — report what succeeded
const results = await Promise.allSettled([sendEvent('A'), sendEvent('B'), sendEvent('C')]);
const failures = results.filter(r => r.status === 'rejected');

// Timeout pattern with Promise.race
const data = await Promise.race([
  fetchData(),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
]);

// Fastest CDN — Promise.any
const asset = await Promise.any([cdnA.get(url), cdnB.get(url), cdnC.get(url)]);
```

**Tiếng Việt:** Chọn đúng combinator là kỹ năng Senior:
- `all`: "tất cả hoặc không gì cả" — order/payment flow
- `allSettled`: "báo cáo tất cả" — analytics, batch operations
- `race`: "ai nhanh nhất hoặc timeout" — SLA enforcement
- `any`: "tìm source hoạt động đầu tiên" — fallback CDN, redundant APIs

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Biết fail-fast behavior của `all`, concrete use cases cho từng combinator, biết `any` vs `race` distinction
- ❌ Weak: Chỉ biết `Promise.all` — miss `allSettled` và `any` (ES2021)

---

### Q: Why does this async forEach not work as expected? Fix it 🟡 Mid

```javascript
const urls = ['url1', 'url2', 'url3'];
const results = [];
await urls.forEach(async (url) => {
  const data = await fetch(url);
  results.push(data);
});
console.log(results); // prints [] — why?
```

**A:** `forEach` doesn't return a Promise and doesn't await async callbacks. The `await urls.forEach(...)` awaits the `undefined` return value of forEach — not the async callbacks. By the time `console.log(results)` runs, the fetches haven't completed.

**Three fixes:**

```javascript
// Fix 1: for...of (sequential)
for (const url of urls) {
  const data = await fetch(url);
  results.push(data);
}

// Fix 2: Promise.all + map (parallel — best for independent operations)
const results = await Promise.all(urls.map(async url => {
  const data = await fetch(url);
  return data;
}));

// Fix 3: for...of with Promise.all for controlled concurrency
const BATCH_SIZE = 3;
for (let i = 0; i < urls.length; i += BATCH_SIZE) {
  const batch = urls.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(url => fetch(url)));
}
```

**Tiếng Việt:** `forEach` không aware về Promises — nó invoke mỗi callback rồi ignore returned Promise. Dùng `for...of` khi cần sequential. Dùng `Promise.all(array.map(async ...))` khi muốn parallel. Dùng batching khi cần control concurrency (tránh làm quá tải server).

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích tại sao forEach không work, biết cả 3 fixes + khi nào dùng sequential vs parallel vs batching
- ❌ Weak: "Dùng for...of" — đúng cho sequential nhưng bỏ qua parallel option và performance implications

---

### Q: Design an async retry mechanism with exponential backoff for production use 🔴 Senior

**A:** For Grab driver location API with transient failures:

```javascript
async function retryWithBackoff(fn, {
  maxAttempts = 3,
  baseDelay = 1000,
  maxDelay = 30000,
  shouldRetry = (err) => err.status >= 500 || err.code === 'NETWORK_ERROR',
} = {}) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Don't retry client errors (4xx) or non-retryable errors
      if (!shouldRetry(err) || attempt === maxAttempts) throw err;

      // Exponential backoff with jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
        maxDelay
      );

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage: Grab driver location service
const location = await retryWithBackoff(
  () => fetchDriverLocation(driverId),
  { maxAttempts: 3, baseDelay: 500, shouldRetry: (e) => e.status !== 404 }
);
```

**Why this design:**
1. **Exponential backoff**: 500ms → 1000ms → 2000ms — gives server time to recover
2. **Jitter**: `+ Math.random() * 1000` — prevents thundering herd (many clients retrying simultaneously)
3. **Configurable `shouldRetry`**: don't retry 404 (resource gone) or 401 (auth failed) — only transient errors
4. **Max delay cap**: `Math.min(..., maxDelay)` — prevents infinite backoff

**Tiếng Việt:** Retry với exponential backoff + jitter là production standard. Không retry blindly (sẽ làm server tệ hơn) — chỉ retry transient errors (5xx, network). Jitter quan trọng: nếu 1000 clients đều retry cùng lúc sau 2 giây, server bị spike. Jitter spread out the retries.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Biết jitter và lý do (thundering herd), `shouldRetry` predicate, configurable options, max delay cap
- ❌ Weak: `for (let i = 0; i < 3; i++) { try { return await fn() } catch {} }` — no backoff, no jitter, retries all errors

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| What is a Promise? States? | 🟢 | 3 states: pending/fulfilled/rejected; irreversible once settled |
| Promise.all vs allSettled vs race vs any | 🟡 | all=fail-fast, allSettled=report-all, race=fastest-settles, any=fastest-fulfills |
| async forEach bug | 🟡 | forEach ignores returned Promises; use for...of or Promise.all(map) |
| Microtask vs macrotask order | 🟡 | sync → microtask queue drains → macrotask; Promise.then before setTimeout |
| Async retry with backoff | 🔴 | Exponential backoff + jitter prevents thundering herd; shouldRetry predicate for error type discrimination |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"This code fetches 3 resources with sequential `await` — what's the problem and how do you fix it?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "The issue is unnecessary serialization — if the 3 fetches don't depend on each other's results, running them sequentially wastes time equal to the sum of all delays."
2. "With sequential await, total time = A + B + C. With Promise.all, total time = max(A, B, C)."
3. "Looking at the code: [A] uses [B]'s result, so those must be sequential. But [C] is independent — it can run in parallel with [A+B]."
4. "The fix: `const [ab_result, c_result] = await Promise.all([sequentialAB(), fetchC()])` — this keeps the necessary dependency while parallelizing what's independent."

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close this doc before attempting.**

- [ ] **Retrieval**: Viết ra 4 Promise combinators và khi nào dùng từng cái — không nhìn lại.
- [ ] **Visual**: Vẽ event loop diagram với microtask queue và macrotask queue. Thêm Promise.then và setTimeout vào đúng queue.
- [ ] **Application**: Có 5 URLs cần fetch. Bạn muốn (a) parallel tất cả, (b) sequential, (c) batches of 2. Viết code cho từng case.
- [ ] **Debug**: `await arr.forEach(async fn)` — print empty array. Tại sao? Viết 2 cách fix từ trí nhớ.
- [ ] **Teach**: Giải thích tại sao `Promise.all` nhanh hơn sequential `await` cho người không biết async programming, dùng analogy nhà hàng.

💬 **Feynman Prompt:** Giải thích microtask vs macrotask cho người không biết lập trình, dùng analogy "người chạy việc vặt có 2 loại inbox: khẩn cấp và thường". Không dùng "microtask", "macrotask", "event loop".

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Closures](./03-closures-comprehensive.md) — async callbacks capture scope via closures
- ⬅️ **Built on:** [Event Loop](./06-event-loop-async.md) — async execution model underpins all of this
- ➡️ **Enables:** [React Hooks](../03-react/03-hooks-deep-dive.md) — useEffect async patterns, data fetching
- 🔗 **Applied in:** Every API call, form submission, data loading — 50% of FE code is async
