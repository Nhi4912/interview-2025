# Event Loop & Asynchronous JavaScript / Event Loop & JavaScript Bất Đồng Bộ

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures-comprehensive.md) | [this keyword](./05-this-keyword.md)
> **See also**: [Async Deep Dive](./09-async-comprehensive.md) | [Table of Contents](../../00-table-of-contents.md)

[← Previous](./05-this-keyword.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./07-es6-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Bug tại Shopee (2024):** Một engineer thêm logic xử lý sau khi user submit form — nhưng dùng `setTimeout(fn, 0)` để "đợi DOM update xong". Trên máy dev thì OK, nhưng trên production với CPU chậm, animation bị giật và toast notification hiện sai thứ tự.

```javascript
// ❌ Dùng setTimeout(0) để "delay" — không đáng tin cậy
function handleSubmit() {
  updateDOM();
  setTimeout(() => {
    showSuccessToast(); // "chắc DOM xong rồi" — SAI assumption
  }, 0);
}
```

**Tại sao sai?** `setTimeout(0)` là **macrotask** — nó chờ sau toàn bộ microtask queue. Nếu `updateDOM()` trigger Promise chain, Promise callbacks chạy trước timeout, nhưng trình tự không deterministic với browser rendering.

**Fix:** Dùng `queueMicrotask()` hoặc `requestAnimationFrame()` — mỗi cái phù hợp với một trường hợp khác nhau. Hiểu Event Loop = biết chọn đúng.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Quán phở single chef:**

Một đầu bếp (JS thread) phục vụ khách:

- Nhận order → nấu ngay (synchronous: tính toán, DOM read/write)
- Đặt nồi nước sôi (async: fetch, setTimeout) → trong khi chờ, nhận order tiếp
- Khi nước sôi xong → phục vụ theo **thứ tự ưu tiên**: khách VIP (microtasks) trước, khách thường (macrotasks) sau

**Event Loop = người quản lý hàng đợi ưu tiên.**

**Tại sao JS single-threaded?**
→ DOM manipulation cần atomic — hai threads cùng sửa DOM tạo race condition không thể resolve
→ Tại sao không Web Workers? → Web Workers không có DOM access — giải quyết heavy computation nhưng không giải quyết UI update
→ Event Loop model đủ mạnh cho 99% web use cases — và đơn giản hơn mutex/lock pattern

---

## Concept Map / Bản Đồ Khái Niệm

```
JavaScript Runtime:
┌─────────────────────────────────────────────────────────┐
│  Call Stack            Web APIs (Browser)                │
│  ┌──────────┐          ┌────────────────────────────┐    │
│  │ fn3()    │          │ setTimeout → timer         │    │
│  │ fn2()    │─push──►  │ fetch → network            │    │
│  │ fn1()    │          │ addEventListener → event   │    │
│  └────┬─────┘          └──────────────┬─────────────┘    │
│       │ (stack empty)                 │ (callback ready) │
│       ▼                               ▼                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Microtask Queue (PRIORITY — drains COMPLETELY)     │  │
│  │ [Promise.then] [queueMicrotask] [MutationObserver] │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Macrotask Queue (1 per loop iteration)             │  │
│  │ [setTimeout] [setInterval] [I/O] [UI events]       │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  EVENT LOOP CYCLE:                                       │
│  Stack empty? → Drain ALL microtasks → Run 1 macrotask  │
│              → Browser render (if frame due)            │
│              → Repeat                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Call Stack & Synchronous Execution

> 🧠 **Memory Hook:** "Call Stack = LIFO (Last In, First Out) — như chồng đĩa: đặt vào trên cùng, lấy ra từ trên cùng."

**Tại sao tồn tại? / Why does this exist?**
JavaScript cần track "đang ở đâu trong chương trình" khi gọi hàm lồng nhau. Stack là data structure tự nhiên nhất cho vấn đề này.
→ Tại sao không heap? → Heap cho objects (random access), stack cho execution order (sequential)
→ Tại sao Stack Overflow xảy ra? → Đệ quy không có base case → stack grow vô hạn → exceed memory limit

#### Layer 1: Simple Analogy

Call Stack như **bookmark trong sách** — khi bạn đọc chương 5 rồi nhảy sang phụ lục A, bạn đặt bookmark ở trang 5. Xong phụ lục, quay lại bookmark. Nếu phụ lục A lại nhảy sang phụ lục B, C... bạn cần nhiều bookmark — mỗi cái là một stack frame.

#### Layer 2: How the Call Stack Works

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
// [main]
// [main] → [a()]
// [main] → [a()] → [b()]
// [main] → [a()] → [b()] → [c()]
// [main] → [a()] → [b()]  ← c() returns, popped
// [main] → [a()]           ← b() returns, popped
// [main]                   ← a() returns, popped
// []                       ← main returns, stack empty → Event Loop checks queues
```

#### Layer 3: Stack Overflow & Blocking

```javascript
// Stack Overflow — infinite recursion
function infinite() {
  return infinite();
}
infinite(); // RangeError: Maximum call stack size exceeded

// Blocking the stack — UI freezes
function heavySync() {
  const start = Date.now();
  while (Date.now() - start < 3000) {} // 3 seconds — browser FREEZES
}
heavySync(); // No clicks, no scroll, nothing responds for 3 seconds
// Fix: break into chunks with setTimeout(fn, 0) or use Web Worker
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                          | Đúng là                                                                |
| -------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| "setTimeout(fn, 0) chạy ngay lập tức"        | Nó vào macrotask queue — chạy SAU khi stack empty và microtasks xong | setTimeout(fn, 0) có thể delay hàng chục ms nếu microtask queue dài    |
| Nghĩ blocking code chỉ ảnh hưởng performance | Blocking code FREEZES UI — không click, không scroll được            | Break heavy work thành chunks, dùng Web Worker cho CPU-intensive tasks |

**🎯 Interview Pattern:**

- Khi thấy: output order puzzle với setTimeout + Promise
- → Nhớ đến: Stack empty → microtasks → macrotask
- → Mở đầu: "JavaScript single-threaded. Khi stack empty, Event Loop ưu tiên microtask queue hoàn toàn trước khi lấy macrotask tiếp theo..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Execution context (scope, hoisting)
- ➡️ Để hiểu: Microtask vs Macrotask priority (section 2 dưới)

---

### 2. Microtasks vs Macrotasks — The Priority System

> 🧠 **Memory Hook:** "**Micro** = **M**ội thứ chạy **M**ới có stack empty. Không có ngoại lệ."

**Tại sao tồn tại? / Why does this exist?**
Promise được thiết kế để thay thế callback hell — và cần đảm bảo `.then()` callbacks chạy ngay sau Promise resolve, không bị delay bởi timer callbacks khác.
→ Tại sao microtasks có priority cao hơn? → Nếu không, `Promise.resolve().then(fn)` và `setTimeout(fn, 0)` sẽ không deterministic — không thể đảm bảo order

#### Layer 1: Simple Analogy

Hàng đợi ngân hàng có hai loại vé: **vé đỏ** (microtask: khách VIP) và **vé xanh** (macrotask: khách thường). Quy tắc: Sau mỗi giao dịch xong, **phục vụ HẾT** vé đỏ trước khi gọi vé xanh tiếp theo. Nếu phục vụ vé đỏ lại tạo ra vé đỏ mới — vẫn phải phục vụ hết trước vé xanh!

#### Layer 2: The Priority Queue in Detail

| Queue     | APIs                                                                                | Priority | Drain policy                        |
| --------- | ----------------------------------------------------------------------------------- | -------- | ----------------------------------- |
| Microtask | `Promise.then/catch/finally`, `queueMicrotask()`, `async/await`, `MutationObserver` | **Cao**  | Drain **ALL** before next macrotask |
| Macrotask | `setTimeout`, `setInterval`, `setImmediate` (Node), I/O callbacks, UI events        | Thấp     | **1 task** per event loop iteration |

```javascript
// Classic interview puzzle — predict the output:
console.log("1: sync start");

setTimeout(() => console.log("2: timeout"), 0);

Promise.resolve()
  .then(() => console.log("3: microtask 1"))
  .then(() => console.log("4: microtask 2"));

console.log("5: sync end");

// Output:
// 1: sync start    ← sync, runs immediately
// 5: sync end      ← sync, runs immediately
// 3: microtask 1   ← microtask queue drained after stack empty
// 4: microtask 2   ← chained .then() = new microtask
// 2: timeout       ← macrotask, runs LAST

// WHY: Sync runs → stack empty → ALL microtasks drain → 1 macrotask
```

#### Layer 3: Microtask Starvation

```javascript
// DANGER: Infinite microtask loop starves macrotasks (and rendering!)
function infiniteMicrotasks() {
  Promise.resolve().then(() => {
    infiniteMicrotasks(); // Creates new microtask BEFORE any macrotask
  });
}
infiniteMicrotasks(); // UI FREEZES — browser never gets to render

// vs safe infinite loop with macrotask
function safeLoop() {
  setTimeout(() => safeLoop(), 0); // macrotask — browser can render between iterations
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                              | Tại sao sai                                                         | Đúng là                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| "Promise.then chạy async, setTimeout chạy sau"       | Cả hai async nhưng microtask LUÔN trước macrotask                   | Trace queue type: Promise → microtask; setTimeout → macrotask |
| "async/await là macrotask vì nó async"               | `await` desugars thành `.then()` — là microtask                     | `await` = microtask, cùng priority với Promise.then           |
| Dùng `setTimeout(fn, 0)` để "đảm bảo sau DOM update" | DOM update không xảy ra giữa microtasks — cần requestAnimationFrame | Dùng rAF cho visual updates, không dùng setTimeout            |

**🎯 Interview Pattern:**

- Khi thấy: câu đố output order với mix của sync, Promise, setTimeout
- → Algorithm: (1) chạy hết sync, (2) drain microtasks, (3) 1 macrotask, (4) repeat
- → Mở đầu: "Tôi sẽ trace qua Event Loop: sync code chạy trước, sau đó microtask queue drain hoàn toàn, rồi mới lấy macrotask đầu tiên..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Call Stack (section 1), Promises (xem [09-async-comprehensive.md](./09-async-comprehensive.md))
- ➡️ Để hiểu: Browser rendering pipeline & requestAnimationFrame (section 3)

---

### 3. Browser Rendering Pipeline & requestAnimationFrame

> 🧠 **Memory Hook:** "rAF = 'Run right **A**fter **F**rame' — chạy ngay trước khi browser vẽ frame tiếp theo. 60fps = 16.7ms mỗi frame."

**Tại sao tồn tại? / Why does this exist?**
`setTimeout(fn, 16)` cho animation không đồng bộ với display refresh rate — animation giật. `requestAnimationFrame` được browser gọi đúng trước khi vẽ frame — guaranteed smooth.
→ Tại sao 60fps? → Human eye perceives flicker above 60fps as smooth (16.7ms/frame)
→ Tại sao rAF tốt hơn setInterval? → rAF tự pause khi tab hidden, không waste CPU

#### Layer 1: Simple Analogy

Bạn muốn cập nhật bảng điểm số bóng đá real-time. Cách dở: cứ mỗi 16ms bạn update — dù TV chưa ready. Cách đúng: TV nói "tôi sắp vẽ frame mới — bạn có gì cần update không?" — đó là `requestAnimationFrame`.

#### Layer 2: Rendering Pipeline Position

```
Event Loop iteration:
  [Stack executes] → [ALL microtasks] → [1 macrotask] → [render opportunity]
                                                          ↑
                               requestAnimationFrame callbacks run HERE
                               (only if browser decides to render this iteration)
                               Then: Layout → Paint → Composite → Display
```

```javascript
// Animation the right way
let position = 0;
function animate() {
  position += 2;
  element.style.left = position + "px";

  if (position < 300) {
    requestAnimationFrame(animate); // Request next frame
  }
}
requestAnimationFrame(animate); // Start

// vs setTimeout — jittery
function animateWrong() {
  position += 2;
  element.style.left = position + "px";
  if (position < 300) setTimeout(animateWrong, 16); // ~60fps but not synced
}
```

#### Layer 3: Long Tasks & Layout Thrashing

```javascript
// ❌ Layout Thrashing — forced synchronous layout (kills performance)
elements.forEach((el) => {
  const width = el.offsetWidth; // READ — forces layout calculation
  el.style.width = width * 2 + "px"; // WRITE — invalidates layout
  // Next READ in loop forces layout AGAIN — N forced layouts!
});

// ✅ Batch reads then writes
const widths = elements.map((el) => el.offsetWidth); // All READs
elements.forEach((el, i) => (el.style.width = widths[i] * 2 + "px")); // All WRITEs
// 1 layout calculation instead of N
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                                | Đúng là                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Dùng `setInterval(fn, 16)` cho animation | Không synced với display, CPU waste khi tab hidden                         | `requestAnimationFrame` — tự pause khi hidden, synced với display                      |
| Đọc và ghi DOM xen kẽ trong loop         | Mỗi read sau write = forced layout recalculation                           | Batch tất cả reads trước, rồi tất cả writes sau                                        |
| Nghĩ rAF là macrotask                    | rAF là render task — chạy trong rendering step, không phải macrotask queue | rAF callback chạy SAU microtasks nhưng TRƯỚC hoặc TRONG render, không trong task queue |

**🎯 Interview Pattern:**

- Khi thấy: "Tại sao animation giật?" hoặc "Optimize DOM manipulation?"
- → Nhớ đến: rAF cho animation sync, batch reads/writes để tránh layout thrashing
- → Mở đầu: "Browser render ở 60fps, mỗi frame 16.7ms. setTimeout không sync với render cycle — requestAnimationFrame thì có..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Microtask queue (section 2)
- ➡️ Để hiểu: Core Web Vitals, LCP/FID optimization ([06-browser-performance](../06-browser-performance/01-core-web-vitals.md))

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: Predict the output — classic Event Loop puzzle 🟢 Junior

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

**A:** Output: `A → D → C → B`

**Trace:**

1. `console.log('A')` — sync, runs immediately: **A**
2. `setTimeout` callback → macrotask queue: `[B]`
3. `Promise.resolve().then(C)` → microtask queue: `[C]`
4. `console.log('D')` — sync: **D**
5. Stack empty → drain microtasks: **C**
6. Microtask queue empty → take 1 macrotask: **B**

Thứ tự: **A D C B**

**💡 Interview Signal:**

- ✅ Strong: Trace từng bước, phân biệt đúng queue type, giải thích tại sao microtask trước macrotask
- ❌ Weak: Đoán `A D B C` (nhầm Promise là macrotask) hoặc `A B C D` (không hiểu async)

---

### Q2: Predict harder output — chained microtasks 🟡 Mid

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

**A:** Output: `1 → 7 → 4 → 6 → 2 → 3 → 5`

**Trace:**

1. Sync: **1**, setTimeout(2,3)→macro[A], Promise chain enqueued, **7**
2. Microtasks: `.then(4)` → print **4**, setTimeout(5)→macro[B], second `.then(6)` queued
3. Microtasks continue: `.then(6)` → print **6**
4. Macrotask A: **2**, then `Promise.resolve().then(3)` queued as microtask
5. Microtasks: **3**
6. Macrotask B: **5**

**💡 Interview Signal:**

- ✅ Strong: Biết mỗi macrotask có thể tạo microtask mới (drain ngay sau macrotask đó), trace đúng macro[A] tạo microtask "3"
- ❌ Weak: Nhầm "3" và "5" (không biết microtask trong macrotask drain ngay sau macrotask đó xong)

---

### Q3: Tại sao UI freeze khi chạy heavy computation? Cách fix? 🟡 Mid

**A:** Long-running synchronous code blocks the call stack — browser can't render (render happens between event loop iterations), can't handle user input (event callbacks queue up but never execute while stack occupied).

Code sync chạy lâu block call stack — browser không thể render (render xảy ra giữa các iteration của event loop), không thể xử lý input.

**Fix strategies:**

```javascript
// Strategy 1: Chunk with setTimeout (yield to event loop)
function processChunk(items, index = 0) {
  const chunkSize = 100;
  for (let i = index; i < Math.min(index + chunkSize, items.length); i++) {
    processItem(items[i]);
  }
  if (index + chunkSize < items.length) {
    setTimeout(() => processChunk(items, index + chunkSize), 0); // yield
  }
}

// Strategy 2: Web Worker (separate thread for CPU-intensive work)
const worker = new Worker("heavy-computation.js");
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => updateUI(e.data); // UI thread not blocked

// Strategy 3: scheduler.postTask (modern — respects priority)
scheduler.postTask(() => processHeavy(), { priority: "background" });
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích rendering xảy ra khi nào, biết 3 strategies với trade-offs (setTimeout simple nhưng overhead, Worker tốt hơn nhưng no DOM access)
- ❌ Weak: "Dùng async/await" — async/await chỉ yield tại `await` point, không giúp ích nếu không có actual async operation

---

### Q4: `setTimeout(fn, 0)` vs `queueMicrotask(fn)` vs `requestAnimationFrame(fn)` — khi nào dùng cái nào? 🔴 Senior

**A:**

| API                         | Queue type  | Runs when                                       | Use for                                      |
| --------------------------- | ----------- | ----------------------------------------------- | -------------------------------------------- |
| `queueMicrotask(fn)`        | Microtask   | Before next macrotask, before render            | Deferring work but still "this tick"         |
| `setTimeout(fn, 0)`         | Macrotask   | After all microtasks, after render opportunity  | Yielding to event loop (chunking heavy work) |
| `requestAnimationFrame(fn)` | Render task | Before browser paints next frame                | Animation, visual DOM updates                |
| `scheduler.postTask(fn)`    | Variable    | Configurable (user-visible / background / etc.) | Modern scheduling with priority              |

```javascript
// queueMicrotask — use when you need to defer but stay in "same turn"
function batchUpdates(updates) {
  pendingUpdates.push(...updates);
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(() => {
      flushUpdates(pendingUpdates);
      scheduled = false;
    });
  }
}

// rAF — visual work
function highlight(el) {
  el.classList.add("active");
  requestAnimationFrame(() => {
    // Browser has committed to rendering — safe to measure & update visual
    el.style.height = el.scrollHeight + "px";
  });
}
```

**💡 Interview Signal:**

- ✅ Strong: Phân biệt được cả 4 APIs với use case cụ thể, biết `scheduler.postTask` là modern solution, hiểu rAF không phải macrotask
- ❌ Weak: "setTimeout(0) và queueMicrotask giống nhau" — fundamental misunderstanding of queue types

---

### Q5: Design: debounce với proper async handling cho search input 🔴 Senior (Create)

**A:** Search input cần debounce + handle race condition (old request returns after new one):

```javascript
function createDebouncedSearch(searchFn, delay = 300) {
  let timeoutId;
  let currentRequestId = 0; // Track request version

  return async function debouncedSearch(query) {
    // Clear previous debounce timer
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        const requestId = ++currentRequestId; // Increment version

        try {
          const result = await searchFn(query);

          // Only resolve if this is still the latest request
          if (requestId === currentRequestId) {
            resolve(result);
          }
          // Else: stale response, silently ignore
        } catch (err) {
          if (requestId === currentRequestId) {
            reject(err);
          }
        }
      }, delay);
    });
  };
}

// Usage
const search = createDebouncedSearch(async (q) => {
  const res = await fetch(`/api/search?q=${q}`);
  return res.json();
}, 300);

// React integration
const [results, setResults] = useState([]);
const debouncedSearch = useMemo(() => createDebouncedSearch(searchAPI, 300), []);

useEffect(() => {
  debouncedSearch(query).then(setResults).catch(console.error);
}, [query]);
```

**Key insight:** The race condition fix uses a monotonically increasing ID — if response comes back out-of-order, stale responses are simply ignored. This is the same pattern AbortController solves at the fetch level.

**💡 Interview Signal:**

- ✅ Strong: Implement race condition fix (request ID or AbortController), handle Promise reject for stale requests, mention React integration pattern
- ❌ Weak: Implement debounce only — miss the race condition (older responses overwriting newer results)

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                               | Level | One-liner                                                                                             |
| --- | ----------------------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
| 1   | Classic Event Loop: A→D→C→B         | 🟢    | Sync → microtasks → macrotasks; `Promise.then` = microtask, `setTimeout` = macrotask                  |
| 2   | Chained microtasks: 1→7→4→6→2→3→5   | 🟡    | Microtasks spawned inside a macrotask drain immediately after that macrotask completes                |
| 3   | UI freeze fix                       | 🟡    | Long sync blocks render; fix: chunked `setTimeout` / Web Worker / `scheduler.postTask`                |
| 4   | setTimeout vs queueMicrotask vs rAF | 🔴    | queueMicrotask = same tick; setTimeout = yield to loop; rAF = before paint; postTask = priority-aware |
| 5   | Debounce + race condition           | 🔴    | Monotonic request ID — ignore stale responses; same pattern as `AbortController` at the network level |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Giải thích Event Loop và tại sao microtasks chạy trước macrotasks?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "JavaScript single-threaded — một Call Stack thực thi đồng bộ. Async operations được offload cho Web APIs (browser/Node), kết quả được đưa vào queues."
2. "Event Loop cycle: khi stack empty → drain ALL microtasks (Promise.then, queueMicrotask) → lấy 1 macrotask (setTimeout, I/O) → render opportunity → repeat."
3. "Microtasks có priority cao hơn vì Promises cần đảm bảo `.then()` chạy ngay sau resolve — nếu setTimeout có thể chen vào, async code sẽ không deterministic."
4. "Ví dụ: `Promise.resolve().then(A)` + `setTimeout(B, 0)` → A luôn trước B, vì A là microtask, B là macrotask."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                   |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Vẽ **Event Loop diagram** từ trí nhớ: Call Stack, Web APIs, Microtask Queue, Macrotask Queue, và **thứ tự xử lý**.                                        |
| 2   | 🎨 Visual      | Trace output của đoạn code này TRƯỚC KHI chạy: `setTimeout(() => console.log('X'), 0); Promise.resolve().then(() => console.log('Y')); console.log('Z');` |
| 3   | 🛠️ Application | Team muốn split 1 array 100,000 phần tử thành chunks để xử lý **không block UI**. Bạn dùng gì: `setTimeout`, `queueMicrotask`, hay Web Worker? Tại sao?   |
| 4   | 🐛 Debug       | Animation dùng `setInterval(update, 16)` bị **giật** trên máy chậm. Nguyên nhân? Fix?                                                                     |
| 5   | 🎓 Teach       | Giải thích tại sao `setTimeout(fn, 0)` không chạy "ngay lập tức" cho người mới — dùng ví dụ **hàng đợi** thực tế.                                         |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Sau mỗi macrotask: chạy hết **toàn bộ microtask queue** trước khi lấy macrotask tiếp theo. Microtask: Promise.then, queueMicrotask. Macrotask: setTimeout, setInterval, I/O. |
| 2   | Output: `Z` (sync) → `Y` (microtask: Promise.then) → `X` (macrotask: setTimeout). Microtask luôn trước macrotask kế tiếp.                                                    |
| 3   | `setTimeout` (chunks) cho CPU work không block main thread. Web Worker cho heavy computation thực sự parallel. Không dùng `queueMicrotask` vì nó vẫn block rendering.        |
| 4   | `setInterval` không chờ callback xong — có thể **queue chồng nhau** khi callback chậm hơn 16ms. Fix: dùng `requestAnimationFrame` để đồng bộ với browser repaint.            |
| 5   | setTimeout(fn, 0) như 'xếp hàng quán café' — bạn không chen được người đang ở quầy (call stack). Bạn phải chờ hàng (queue) dù '0 giây'.                                      |

> 🎯 **Feynman Prompt:** Giải thích tại sao microtask "chen hàng" trước macrotask bằng ví dụ quán phở — không dùng thuật ngữ kỹ thuật.
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Async Comprehensive](./09-async-comprehensive.md) — async/await and Promise patterns deep dive
- [ES6 Features](./07-es6-features.md) — Promises and iterators introduced in ES6
- [Advanced Concepts](./08-advanced-concepts.md) — Web APIs, debounce, throttle interact with event loop
- [Concurrency Models Theory](./19-concurrency-models-theory.md) — theoretical model behind the event loop

### Khác track (Cross-track)
- [CS Fundamentals: Concurrency & Parallelism](../../shared/01-cs-fundamentals/07-concurrency-and-parallelism.md) — concurrency theory underpinning the event loop
- [CS Fundamentals: OS Theory](../../shared/01-cs-fundamentals/os-theory.md) — OS-level event models and I/O
- [React Performance Optimization](../03-react/09-performance-optimization.md) — avoiding event loop blocks in React rendering
