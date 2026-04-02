# JavaScript Interview Practice 01 / Thử Thách JavaScript 01

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)
> **L5 Competencies**: Technical Mastery (20pts), Problem-Solving (15pts)

[Back to Table of Contents](../../00-table-of-contents.md) | [Web APIs](./00-web-apis-fundamentals.md) | [Practice 01B](./11-interview-practice-01-javascript-coding-challenges.md)

---

## Real-World Scenario / Tình Huống Thực Tế

> Bạn đang phỏng vấn ở một công ty top-tier. Interviewer đưa bảng trắng và nói: "Implement `debounce` from scratch in 10 minutes." Bạn cần viết code chạy được, giải thích từng bước, và trả lời follow-up về edge cases, memory leaks, và production alternatives.
>
> _Tại Google, Meta, Grab — 8 bài dưới đây chiếm ~60% coding challenges cho Frontend rounds._

---

## Concept Map / Bản Đồ Khái Niệm

```
                    ┌─────────────────────┐
                    │  JS Coding Challenge │
                    └──────────┬──────────┘
           ┌───────────┬──────┴──────┬───────────┐
           ▼           ▼             ▼           ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
     │ Timing   │ │ Data     │ │ Async    │ │ FP       │
     │ Control  │ │ Structure│ │ Patterns │ │ Patterns │
     └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
          │            │            │            │
     debounce     deep clone   Promise.all    curry
     throttle     flatten      EventEmitter   memoize
```

---

## Block A — Theory Foundation / Nền Tảng Lý Thuyết

### Overview / Tổng Quan

- Mỗi bài gồm: statement, hướng tiếp cận step-by-step, code TypeScript, phân tích complexity, và discussion points.
- Mục tiêu: biết cách **nói thành tiếng** trong interview, không chỉ viết code chạy được.
- Thứ tự: Timing → Data → Async → Functional — đi từ dễ hiểu đến trừu tượng.

---

### Challenge 1: debounce

🧠 **Memory Hook:** _"Debounce = elevator door — cứ mỗi lần có người bước vào, cửa reset timer chờ thêm."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** User gõ search input liên tục → mỗi keystroke trigger API call → server quá tải.
- **Level 2 — Why deeper:** Network requests có cost (latency, bandwidth, rate limits). Debounce gom nhiều event thành 1 call duy nhất sau khi user ngừng input.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Debounce giống **nút reset trên microwave**: mỗi lần bạn bấm thêm thời gian, nó reset countdown. Chỉ khi bạn ngừng bấm, microwave mới bắt đầu chạy.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Nhận hàm gốc `fn` và `wait` time** — mỗi lần wrapper được gọi, clear timer cũ, set timer mới.
2. **`clearTimeout` là key** — nó hủy lần gọi trước, chỉ lần cuối mới thực sự execute.
3. **`setTimeout` return ID** — dùng `ReturnType<typeof setTimeout>` cho compatibility Node/Browser.
4. **Closure giữ `timer`** — biến `timer` sống trong closure, shared giữa các lần gọi.

#### Example / Ví dụ

```ts
export function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

**Complexity:** Time O(1) per call, Space O(1) — chỉ giữ 1 timer ID.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **Leading vs trailing:** Code trên là trailing (execute sau wait). Leading debounce execute ngay lần đầu, rồi chặn.
- **Cancel:** Production debounce cần `.cancel()` method để cleanup khi component unmount (tránh memory leak trong React).
- **`this` binding:** Nếu dùng trong class, cần bind hoặc dùng arrow function — `fn.apply(this, args)`.
- **Return value:** setTimeout callback không return — nếu cần return value, dùng Promise wrapper.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement debounce":**
>
> 1. Clarify: trailing hay leading? Cần cancel?
> 2. Viết closure + clearTimeout + setTimeout pattern
> 3. Nêu edge cases: cancel, this binding, return value
> 4. Mention production: `lodash.debounce` với `maxWait` option

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                                | ✅ Correct                           | Reason / Lý do                          |
| --------------------------------------- | ------------------------------------ | --------------------------------------- |
| Quên `clearTimeout` → hàm gọi nhiều lần | Clear timer trước khi set mới        | Không clear = không debounce, chỉ delay |
| Dùng `var` thay `let` cho timer         | Dùng `let` hoặc closure              | `var` hoisting gây bug trong loop       |
| Không handle `this` context             | `fn.apply(this, args)` hoặc arrow fn | Method call mất context                 |
| Quên cleanup khi unmount                | Thêm `.cancel()` method              | Memory leak trong SPA                   |

#### 🔑 Knowledge Chain

**Requires:** Closures, setTimeout/clearTimeout, `this` binding → **Enables:** throttle, rate limiting, search autocomplete

---

### Challenge 2: throttle

🧠 **Memory Hook:** _"Throttle = traffic light — dù bao nhiêu xe đến, cứ mỗi 3 phút mới cho 1 nhóm qua."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** Scroll/resize events fire 60+ times/sec → handler nặng làm UI jank.
- **Level 2 — Why deeper:** Khác debounce (chờ user ngừng), throttle đảm bảo **execute đều đặn** — user nhận feedback liên tục thay vì chờ cuối cùng.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Throttle giống **API rate limiter**: dù client gửi 1000 req/s, server chỉ xử lý 10 req/s. Phần còn lại bị drop hoặc queue.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Track `last` execution time** — `Date.now()` so sánh với lần chạy trước.
2. **Tính `remaining` time** — nếu `remaining <= 0`, execute ngay và update `last`.
3. **Set timeout cho trailing call** — nếu chưa hết wait, schedule 1 call cuối.
4. **Clear timeout khi leading fires** — tránh double execution.

#### Example / Ví dụ

```ts
export function throttle<T extends (...args: unknown[]) => void>(fn: T, wait = 200) {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
      return;
    }
    if (!timeout) {
      timeout = setTimeout(() => {
        last = Date.now();
        timeout = null;
        fn(...args);
      }, remaining);
    }
  };
}
```

**Complexity:** Time O(1) per call, Space O(1).

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **Leading + Trailing:** Code trên có cả hai. Lodash cho option `{ leading: false }` hoặc `{ trailing: false }`.
- **`requestAnimationFrame` thay thế:** Cho animation/scroll, `rAF` tốt hơn vì sync với paint cycle (~16ms).
- **Stale closure:** Nếu `args` thay đổi giữa các call, trailing call dùng args mới nhất — cần cập nhật `args` trong closure.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement throttle":**
>
> 1. So sánh ngay với debounce: throttle = execute đều đặn, debounce = chờ ngừng
> 2. Viết Date.now() + remaining pattern
> 3. Giải thích tại sao cần trailing call (không miss event cuối)
> 4. Mention `rAF` cho animation use case

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                              | ✅ Correct                    | Reason / Lý do                                  |
| ------------------------------------- | ----------------------------- | ----------------------------------------------- |
| Chỉ có leading, bỏ trailing           | Thêm setTimeout cho trailing  | Miss event cuối cùng khi user ngừng             |
| Dùng `setInterval`                    | Dùng `Date.now()` + remaining | setInterval không cancel được, accumulate drift |
| Không clear timeout khi leading fires | Clear trước khi execute       | Double execution: leading + pending trailing    |

#### 🔑 Knowledge Chain

**Requires:** debounce concept, Date.now(), closures → **Enables:** infinite scroll, resize observer, game loop

---

### Challenge 3: deep clone

🧠 **Memory Hook:** _"Deep clone = photocopy machine — bản copy hoàn toàn độc lập, sửa bản gốc không ảnh hưởng."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** JS objects pass by reference — `const b = a` chỉ copy pointer, modify `b` sẽ modify `a`.
- **Level 2 — Why deeper:** Immutability pattern (Redux, React state) yêu cầu new reference. `JSON.parse(JSON.stringify())` không handle circular refs, Date, RegExp, undefined, functions.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Shallow copy = photocopy trang bìa (nội dung vẫn trỏ về sách gốc). Deep clone = photocopy toàn bộ sách từng trang.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Base case:** Primitives và null → return trực tiếp.
2. **Circular reference detection:** Dùng `WeakMap` lưu objects đã thấy → nếu gặp lại, return cached clone.
3. **Array vs Object:** Check `Array.isArray()` → tạo `[]` hoặc `{}`.
4. **Recursive copy:** Iterate keys với `Object.keys()`, deep clone từng value.

#### Example / Ví dụ

```ts
export function deepClone<T>(input: T, seen = new WeakMap<object, unknown>()): T {
  if (input === null || typeof input !== "object") return input;
  if (seen.has(input as object)) return seen.get(input as object) as T;
  const output: unknown = Array.isArray(input) ? [] : {};
  seen.set(input as object, output);
  for (const key of Object.keys(input as Record<string, unknown>)) {
    (output as Record<string, unknown>)[key] = deepClone(
      (input as Record<string, unknown>)[key],
      seen,
    );
  }
  return output as T;
}
```

**Complexity:** Time O(n) where n = total properties, Space O(n) for clone + O(d) recursion stack (d = depth).

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **`structuredClone()`:** Browser API (2022+) handle Date, RegExp, Map, Set, ArrayBuffer — nhưng không clone functions.
- **Prototype chain:** `Object.keys` chỉ lấy own enumerable. Nếu cần prototype, dùng `Object.create(Object.getPrototypeOf(input))`.
- **Symbol keys:** `Object.keys` bỏ qua Symbol. Dùng `Reflect.ownKeys()` để lấy cả Symbol.
- **Special types:** Date → `new Date(input.getTime())`, RegExp → `new RegExp(input)`, Map/Set → iterate + clone entries.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement deep clone":**
>
> 1. Hỏi: cần handle circular refs không? Special types (Date, Map)?
> 2. Viết recursive + WeakMap pattern
> 3. So sánh: `JSON.parse(JSON.stringify)` vs `structuredClone` vs custom
> 4. Nêu limitation của mỗi approach

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                          | ✅ Correct                       | Reason / Lý do                                     |
| --------------------------------- | -------------------------------- | -------------------------------------------------- |
| `JSON.parse(JSON.stringify(obj))` | Recursive + WeakMap              | JSON: mất undefined, function, circular → crash    |
| Quên WeakMap cho circular refs    | Track với `seen = new WeakMap()` | Infinite recursion → stack overflow                |
| Dùng `Map` thay `WeakMap`         | Dùng `WeakMap`                   | Map giữ strong ref → memory leak, GC không thu hồi |
| Bỏ qua Array check                | `Array.isArray(input) ? [] : {}` | Array clone thành object mất index order           |

#### 🔑 Knowledge Chain

**Requires:** Reference vs Value, recursion, WeakMap → **Enables:** Immutable state, Redux, undo/redo system

---

### Challenge 4: Promise.all

🧠 **Memory Hook:** _"Promise.all = team relay — tất cả phải finish, 1 người fail thì cả team fail."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** Cần fetch 5 APIs cùng lúc, chờ tất cả xong rồi render.
- **Level 2 — Why deeper:** Sequential await mất n \* latency. Parallel với Promise.all chỉ mất max(latency). Fail-fast behavior tránh chờ promises còn lại khi đã biết lỗi.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Promise.all giống **đặt 5 món ăn cùng lúc**: chờ tất cả ra mới ăn. Nếu 1 món bị cancel, hủy cả bàn.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Return new Promise** — wrapper resolves/rejects dựa trên tất cả inner promises.
2. **Counter pattern:** Track `completed` count. Khi `completed === total`, resolve với results array.
3. **Index preservation:** `out[index] = value` — giữ thứ tự output khớp input (không phải completion order).
4. **Fail-fast:** Bất kỳ promise reject → reject ngay outer promise. Các promise khác vẫn chạy nhưng result bị ignore.

#### Example / Ví dụ

```ts
export function customPromiseAll<T>(promises: Array<Promise<T> | T>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) return resolve([]);
    const out: T[] = new Array(promises.length);
    let completed = 0;
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          out[index] = value;
          completed += 1;
          if (completed === promises.length) resolve(out);
        })
        .catch(reject);
    });
  });
}
```

**Complexity:** Time O(max(promise durations)), Space O(n) for results array.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **Empty array:** Phải resolve `[]` ngay — không phải pending forever.
- **Non-promise values:** `Promise.resolve(p)` wrap non-promise thành resolved promise.
- **Multiple rejections:** `.catch(reject)` gọi reject nhiều lần — nhưng Promise chỉ settle 1 lần, lần gọi sau bị ignore.
- **`Promise.allSettled`:** Không fail-fast — trả `{ status, value/reason }` cho mỗi promise.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement Promise.all":**
>
> 1. Nêu behavior: resolve khi tất cả done, reject khi bất kỳ fail
> 2. Viết counter + index preservation pattern
> 3. Handle edge: empty array, non-promise values
> 4. Compare: `Promise.all` vs `allSettled` vs `race` vs `any`

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                                    | ✅ Correct                      | Reason / Lý do                                            |
| ------------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| Dùng `for...of` + `await` (sequential)      | `forEach` + counter (parallel)  | Sequential mất n\*latency thay vì max(latency)            |
| Push result vào array theo completion order | `out[index] = value`            | Mất thứ tự: promise nhanh nhất không nhất thiết ở index 0 |
| Quên handle empty array                     | `if (length === 0) resolve([])` | Promise pending forever, gây hang                         |
| Quên `Promise.resolve()` wrap non-promise   | Luôn wrap: `Promise.resolve(p)` | Non-promise value không có `.then()`                      |

#### 🔑 Knowledge Chain

**Requires:** Promise API, microtask queue, closures → **Enables:** Parallel fetching, batch operations, `Promise.allSettled`/`race`/`any`

---

### Challenge 5: EventEmitter

🧠 **Memory Hook:** _"EventEmitter = radio station — subscribe (on) để nghe, broadcast (emit) cho tất cả, unsubscribe (off) khi chán."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** Components cần communicate mà không coupled trực tiếp (pub/sub pattern).
- **Level 2 — Why deeper:** Observer pattern là backbone của DOM events, Node.js streams, React state management (Redux), WebSocket message routing.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

EventEmitter giống **group chat**: `on` = join channel, `emit` = gửi message cho tất cả members, `off` = leave channel.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Map<string, Set<Handler>>** — mỗi event name map tới Set các handlers.
2. **`on` return unsubscribe function** — pattern phổ biến (React useEffect cleanup, RxJS unsubscribe).
3. **Set (not Array)** — O(1) add/delete, tự deduplicate (cùng handler reference chỉ register 1 lần).
4. **`emit` iterate Set** — forEach gọi mỗi handler với payload.

#### Example / Ví dụ

```ts
type Handler<T = unknown> = (payload: T) => void;

export class EventEmitter {
  private events = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler): () => void {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: Handler): void {
    this.events.get(event)?.delete(handler);
  }

  emit(event: string, payload?: unknown): void {
    this.events.get(event)?.forEach((h) => h(payload));
  }
}
```

**Complexity:** `on`/`off` O(1), `emit` O(k) where k = number of handlers.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **`once` method:** Handler tự remove sau 1 lần emit — wrap handler trong function gọi `off` rồi execute.
- **Memory leak:** Quên `off()` → handler reference giữ component alive → leak. Cần cleanup pattern.
- **Error in handler:** 1 handler throw → forEach dừng, handlers sau không chạy. Fix: wrap mỗi handler trong try/catch.
- **Wildcard events:** Advanced: `on("*", handler)` listen mọi event — cần special handling trong emit.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement EventEmitter":**
>
> 1. Chọn Map + Set (giải thích tại sao Set > Array)
> 2. Return unsubscribe function từ `on`
> 3. Mention: once, error handling, memory leak
> 4. Connect: DOM addEventListener, Node EventEmitter, Redux subscribe

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                        | ✅ Correct                                         | Reason / Lý do                                                   |
| ------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| Dùng Array cho handlers         | Dùng Set                                           | Array: O(n) remove, duplicate risk                               |
| Không return unsubscribe        | `return () => this.off(event, handler)`            | Caller không thể cleanup → memory leak                           |
| `off` với anonymous function    | Giữ reference: `const h = () => ...`; `on('x', h)` | Anonymous fn tạo new reference mỗi lần → `.delete()` không match |
| Emit modify Set while iterating | Clone Set trước: `[...set].forEach(h => h())`      | Delete trong forEach có thể skip handlers                        |

#### 🔑 Knowledge Chain

**Requires:** Map, Set, closures, Observer pattern → **Enables:** State management, middleware, plugin systems, message bus

---

### Challenge 6: curry

🧠 **Memory Hook:** _"Curry = conveyor belt assembly — mỗi station nhận 1 part, khi đủ parts thì output product."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** Tạo specialized functions từ generic ones: `const addTax = add(0.1)` — partial application.
- **Level 2 — Why deeper:** Functional composition: `compose(filter(isActive), map(getName))` — mỗi function nhận 1 arg, chain dễ dàng.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Curry giống **đơn đặt hàng**: bước 1 chọn size, bước 2 chọn màu, bước 3 chọn material → chỉ khi đủ 3 bước mới produce.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Return chain of single-arg functions** — mỗi function nhận 1 arg, return function tiếp theo.
2. **Khi đủ args, execute original** — `fn(a, b, c)` trở thành `curry(fn)(a)(b)(c)`.
3. **Simple version:** Fixed arity (3 args). Generic version dùng `fn.length` để detect arity.

#### Example / Ví dụ

```ts
export function curry<A, B, C>(fn: (a: A, b: B, c: C) => unknown) {
  return (a: A) => (b: B) => (c: C) => fn(a, b, c);
}

const sum3 = (a: number, b: number, c: number) => a + b + c;
const curried = curry(sum3);
const value = curried(1)(2)(3);
```

**Complexity:** Time O(n) for n args (n function calls), Space O(n) closures.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **Generic curry (variadic):** Dùng `fn.length` check arity → accumulate args → execute khi đủ.
- **`fn.length` pitfall:** Default params, rest params không count trong `.length`.
- **Placeholder support:** Lodash `_.curry` cho `_` placeholder: `f(_, 2)(1)` = `f(1, 2)`.
- **Performance:** Mỗi level tạo new closure → deep curry chains có overhead.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement curry":**
>
> 1. Start simple: fixed 3-arg version (30 seconds)
> 2. Upgrade: generic version dùng `fn.length` + accumulated args
> 3. Discuss: placeholder, performance, TypeScript typing challenge
> 4. Connect: partial application, compose, pipe

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                     | ✅ Correct                             | Reason / Lý do                        |
| ---------------------------- | -------------------------------------- | ------------------------------------- |
| Hard-code arity              | Dùng `fn.length` cho generic           | Chỉ work với functions có đúng N args |
| Quên rest params không count | Check manually hoặc accept arity param | `(...args) => {}` có `.length` = 0    |
| Mutate args array            | Spread: `[...collected, ...newArgs]`   | Shared array giữa các calls gây bug   |

#### 🔑 Knowledge Chain

**Requires:** Closures, higher-order functions, `.length` → **Enables:** Functional composition, partial application, point-free style

---

### Challenge 7: flatten

🧠 **Memory Hook:** _"Flatten = ép hoa — mảng lồng nhau được ép phẳng theo depth, như ép hoa nhiều lớp thành 1 mặt phẳng."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** API trả nested data structure → UI cần flat list để render.
- **Level 2 — Why deeper:** Tree → list conversion là pattern phổ biến: file system, DOM tree, org chart. `Array.prototype.flat()` là built-in nhưng interview muốn thấy bạn implement recursion.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Flatten giống **mở hộp lồng nhau**: depth=1 mở 1 lớp, depth=Infinity mở tất cả lớp đến khi còn items phẳng.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Base case:** `depth === 0` → return shallow copy (`.slice()`).
2. **Iterate items:** Nếu item là Array và depth > 0 → recursive flatten với `depth - 1`.
3. **Spread vào output:** `out.push(...flatten(item, depth - 1))` — merge recursive result.
4. **Non-array items:** Push trực tiếp.

#### Example / Ví dụ

```ts
export function flatten(arr: unknown[], depth = 1): unknown[] {
  if (depth === 0) return arr.slice();
  const out: unknown[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item, depth - 1));
    else out.push(item);
  }
  return out;
}
```

**Complexity:** Time O(n) where n = total elements across all levels, Space O(n) for output + O(d) recursion stack.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **`depth = Infinity`:** Flatten hoàn toàn — nhưng recursive stack có thể overflow với array rất sâu.
- **Iterative version:** Dùng stack/queue thay recursion — tránh stack overflow.
- **Sparse arrays:** `[1, , 3]` — `for...of` skip holes, `Array.prototype.flat()` cũng skip.
- **`Array.prototype.flat(depth)`:** Built-in từ ES2019, nhưng interview muốn manual implementation.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement flatten":**
>
> 1. Clarify: depth parameter? Default depth?
> 2. Viết recursive solution với depth decrement
> 3. Discuss: iterative alternative (stack-based) cho deep arrays
> 4. Compare: `Array.prototype.flat()`, lodash `_.flattenDeep()`

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                        | ✅ Correct                    | Reason / Lý do                         |
| ------------------------------- | ----------------------------- | -------------------------------------- |
| Quên `depth` parameter          | Luôn nhận depth, default 1    | Flatten vô hạn khi chỉ cần 1 level     |
| Mutate input array              | `arr.slice()` cho base case   | Caller không expect input bị modify    |
| Quên base case `depth === 0`    | Check depth trước khi recurse | Infinite recursion                     |
| `concat` thay `push(...spread)` | Dùng `push(...result)`        | `concat` tạo new array mỗi lần → O(n²) |

#### 🔑 Knowledge Chain

**Requires:** Recursion, Array.isArray, spread operator → **Enables:** Tree traversal, nested data normalization, file path processing

---

### Challenge 8: memoize

🧠 **Memory Hook:** _"Memoize = notebook ghi chép — tra bài cũ nhanh hơn giải lại từ đầu. Cache = notebook."_

#### Why does this exist? / Tại sao cần?

- **Level 1 — Why:** Fibonacci naive O(2^n) → memoized O(n). Expensive computation chỉ cần chạy 1 lần per input.
- **Level 2 — Why deeper:** React `useMemo`/`useCallback` là memoize. API response caching, selector recomputation (Reselect) — tất cả dùng memoization.

#### Layer 1 — Simple Analogy / Tương Tự Đơn Giản

Memoize giống **bảng cửu chương**: thay vì tính `7 × 8` mỗi lần, tra bảng → instant answer.

#### Layer 2 — How It Works / Cách Hoạt Động

1. **Map<key, result>** — serialize args thành key, check cache trước khi compute.
2. **`JSON.stringify(args)` làm key** — đơn giản nhưng có pitfalls (object key order, functions, undefined).
3. **Cache hit → return cached** — O(1) lookup thay vì O(expensive) computation.
4. **Cache miss → compute, store, return** — first call vẫn expensive, subsequent calls O(1).

#### Example / Ví dụ

```ts
export function memoize<T extends (...args: number[]) => number>(fn: T): T {
  const cache = new Map<string, number>();
  return ((...args: number[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}
```

**Complexity:** Time O(1) cache hit, O(f(n)) cache miss. Space O(k) where k = unique arg combinations cached.

#### Layer 3 — Edge Cases & Gotchas / Trường Hợp Biên

- **Memory unbounded:** Không có eviction → cache grows forever → OOM. Production: LRU cache (max size).
- **Object args:** `JSON.stringify({b:1,a:2})` ≠ `JSON.stringify({a:2,b:1})` — same object, different key.
- **`WeakMap` for object args:** Key là object reference, GC-friendly — nhưng chỉ work với 1 object arg.
- **`this` context:** Nếu memoize method, cần `fn.apply(this, args)`.
- **React useMemo:** Shallow compare deps, không cache multiple results — chỉ giữ last result.

#### 🎯 Interview Pattern

> **Khi được hỏi "implement memoize":**
>
> 1. Start: Map + JSON.stringify key
> 2. Discuss key strategy: JSON.stringify pitfalls, WeakMap alternative
> 3. Nêu: LRU eviction, TTL, memory concerns
> 4. Connect: React useMemo/useCallback, Reselect, Redis caching

#### Common Mistakes / Sai Lầm Thường Gặp

| ❌ Wrong                         | ✅ Correct                                | Reason / Lý do                                  |
| -------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| Không limit cache size           | LRU/LFU eviction policy                   | Memory leak — cache grows forever               |
| `JSON.stringify` cho object args | Sort keys hoặc dùng WeakMap               | Key order khác → cache miss dù same data        |
| Cache async function result      | Cache Promise, không cache resolved value | Race condition: 2 calls cùng lúc tạo 2 requests |
| Memoize impure function          | Chỉ memoize pure functions                | Impure: different results for same input        |

#### 🔑 Knowledge Chain

**Requires:** Map/WeakMap, JSON.stringify, closures, pure functions → **Enables:** React useMemo, Reselect, dynamic programming, API caching

---

## Block B — Interview Q&A / Câu Hỏi Phỏng Vấn

### 🟢 Junior Level

#### Q1: What's the difference between debounce and throttle? / Sự khác biệt giữa debounce và throttle? 🟢

**A:** Debounce waits until the user stops triggering events, then executes once. Throttle executes at regular intervals regardless of how frequently the event fires.

_Debounce chờ user ngừng trigger rồi mới execute 1 lần. Throttle execute đều đặn theo interval bất kể event fire bao nhiêu lần. Ví dụ: search input dùng debounce (chờ ngừng gõ), scroll position tracking dùng throttle (cập nhật đều đặn)._

✅ **Signal mạnh:** Nêu được use case cụ thể cho mỗi loại + giải thích timing diagram
❌ **Signal yếu:** Chỉ nói "debounce delays, throttle limits" mà không có ví dụ

---

#### Q2: Why use WeakMap instead of Map for circular reference detection in deep clone? / Tại sao dùng WeakMap thay Map? 🟢

**A:** WeakMap holds weak references to object keys — when the original object is no longer referenced elsewhere, the GC can collect both the key and value. Map holds strong references, preventing garbage collection and causing memory leaks.

_WeakMap giữ weak reference — khi object gốc không còn reference nào khác, GC thu hồi cả key và value. Map giữ strong reference → object không bao giờ được GC → memory leak khi clone objects lớn._

✅ **Signal mạnh:** Giải thích GC behavior cụ thể, nêu khi nào Map vẫn OK (small, short-lived)
❌ **Signal yếu:** Chỉ nói "WeakMap tốt hơn" mà không giải thích garbage collection

---

#### Q3: What happens if you pass an empty array to Promise.all? / Promise.all([]) trả về gì? 🟢

**A:** `Promise.all([])` resolves immediately with an empty array `[]`. This is important to handle explicitly in custom implementations — without the check, the promise would remain pending forever since the completion counter would never reach the array length.

_`Promise.all([])` resolve ngay với `[]`. Trong implementation, nếu không check `length === 0` trước, promise sẽ pending mãi vì counter không bao giờ đạt 0. Đây là edge case hay bị miss._

✅ **Signal mạnh:** Giải thích tại sao pending forever nếu không handle + biết behavior chuẩn
❌ **Signal yếu:** Đoán "returns undefined" hoặc "throws error"

---

#### Q4: Why does EventEmitter.on return a function? / Tại sao on() return function? 🟢

**A:** It returns an unsubscribe function for easy cleanup. This pattern appears everywhere: React `useEffect` cleanup, RxJS `subscription.unsubscribe()`, DOM `removeEventListener`. The caller doesn't need to keep a reference to the handler separately.

_Return unsubscribe function để cleanup dễ dàng. Pattern này phổ biến: React useEffect return cleanup, RxJS unsubscribe. Caller không cần giữ reference riêng của handler — đặc biệt quan trọng khi handler là anonymous function._

✅ **Signal mạnh:** Connect với React useEffect cleanup pattern + giải thích anonymous handler problem
❌ **Signal yếu:** Chỉ nói "for cleanup" mà không nêu pattern ở đâu

---

### 🟡 Mid Level

#### Q5: How would you implement a leading debounce? / Implement leading debounce? 🟡

**A:** Leading debounce executes immediately on the first call, then blocks subsequent calls until the wait period expires after the last call. Key change: check if timer is null (first call or timer expired) → execute immediately → set timer.

```ts
function debounceLeading<T extends (...args: unknown[]) => void>(fn: T, wait = 200) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (!timer) fn(...args); // Execute immediately on first call
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, wait);
  };
}
```

_Leading debounce execute ngay lần đầu, rồi chặn cho đến khi hết wait sau lần gọi cuối. Khi timer = null (lần đầu hoặc đã hết wait), execute ngay. Set timer để track "cooling period"._

✅ **Signal mạnh:** Viết code chạy được + giải thích khi nào dùng leading vs trailing
❌ **Signal yếu:** Mô tả concept nhưng không viết được code

---

#### Q6: What are the limitations of JSON.stringify as a memoization key? / Hạn chế của JSON.stringify làm cache key? 🟡

**A:** Four key limitations: (1) Object key order matters — `{a:1,b:2}` ≠ `{b:2,a:1}` despite being semantically equal. (2) Functions, undefined, Symbol are dropped. (3) Circular references throw. (4) Performance cost for large objects — serialization itself is O(n).

_4 hạn chế chính: (1) Thứ tự key khác → key khác dù data giống. (2) function, undefined, Symbol bị loại bỏ. (3) Circular reference → throw TypeError. (4) O(n) serialization cost cho objects lớn. Alternative: dùng WeakMap cho single object arg, hoặc custom hash function._

✅ **Signal mạnh:** Nêu 3+ limitations cụ thể + đề xuất alternative (WeakMap, custom hash)
❌ **Signal yếu:** Chỉ nói "it's slow" hoặc "doesn't work with objects"

---

#### Q7: How would you implement Promise.allSettled? / Implement Promise.allSettled? 🟡

**A:** Unlike Promise.all, allSettled never rejects — it waits for ALL promises to settle (resolve or reject), returning an array of `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }` objects.

```ts
function allSettled<T>(promises: Promise<T>[]): Promise<PromiseSettledResult<T>[]> {
  return new Promise((resolve) => {
    if (promises.length === 0) return resolve([]);
    const results: PromiseSettledResult<T>[] = new Array(promises.length);
    let settled = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((value) => {
          results[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          settled++;
          if (settled === promises.length) resolve(results);
        });
    });
  });
}
```

_allSettled không bao giờ reject — chờ tất cả settle rồi trả array kết quả. Dùng `.finally()` thay vì track riêng resolve/reject. Mỗi result gồm status + value/reason._

✅ **Signal mạnh:** Viết code đúng + dùng `.finally()` pattern + biết PromiseSettledResult type
❌ **Signal yếu:** Confuse với Promise.all behavior, quên handle rejection

---

#### Q8: How would you add a `once` method to EventEmitter? / Thêm method `once`? 🟡

**A:** Wrap the handler in a function that calls `off` before executing the original handler. Return unsubscribe function as usual.

```ts
once(event: string, handler: Handler): () => void {
  const wrapper: Handler = (payload) => {
    this.off(event, wrapper); // Remove before execute to prevent re-entry
    handler(payload);
  };
  return this.on(event, wrapper);
}
```

_Wrap handler trong function tự gọi `off` trước khi execute handler gốc. Phải off `wrapper` (không phải `handler`) vì wrapper là reference thực sự trong Set. Off trước execute tránh re-entry nếu handler trigger same event._

✅ **Signal mạnh:** Off wrapper (not handler) + off before execute (prevent re-entry) + giải thích tại sao
❌ **Signal yếu:** Off handler thay vì wrapper → bug: wrapper vẫn trong Set

---

### 🔴 Senior Level

#### Q9: Design a production-grade debounce with cancel, flush, and maxWait. What trade-offs exist? / Thiết kế debounce production-grade? 🔴

**A:** Production debounce needs three additions beyond basic: (1) `.cancel()` — clear timer, prevent pending execution (critical for component unmount). (2) `.flush()` — execute pending call immediately (useful for form submit). (3) `maxWait` — guarantee execution within maxWait time even if events keep coming (prevents infinite deferral).

Trade-offs: maxWait adds complexity — need separate timer for max wait tracking. Cancel/flush require returning an object instead of a plain function, changing the API surface. TypeScript typing becomes complex with generic return types.

_Debounce production cần: cancel (cleanup unmount), flush (submit form ngay), maxWait (đảm bảo execute trong thời gian tối đa). Lodash `debounce` implement tất cả. Trade-off: API surface phức tạp hơn, TypeScript typing khó, overhead tracking 2 timers (wait + maxWait)._

✅ **Signal mạnh:** Nêu cả 3 features + giải thích maxWait prevents infinite deferral + TypeScript typing challenge
❌ **Signal yếu:** Chỉ nêu cancel mà thiếu flush/maxWait

**Follow-up:** How does lodash implement maxWait internally? → Uses `Date.now()` comparison between first invocation and current time, with separate timer for maxWait deadline.

---

#### Q10: Compare structuredClone, JSON deep clone, and custom recursive clone. When would you choose each? / So sánh 3 approaches deep clone? 🔴

**A:**

| Approach                       | Handles Circular | Date/Map/Set  |  Functions  |      Performance       | Browser Support |
| ------------------------------ | :--------------: | :-----------: | :---------: | :--------------------: | :-------------: |
| `JSON.parse(JSON.stringify())` |    ❌ Throws     | ❌ Loses type |  ❌ Drops   | Fast for small objects |    Universal    |
| `structuredClone()`            |        ✅        |      ✅       |  ❌ Throws  |    Fastest (native)    |      2022+      |
| Custom recursive               | ✅ With WeakMap  | ✅ If handled | ✅ Optional |        Slowest         |    Universal    |

Choose JSON for simple data transfer (API responses, localStorage). Choose structuredClone for complex objects without functions (Worker messaging). Choose custom when you need function cloning or specific prototype handling.

_JSON: nhanh, đơn giản, nhưng mất type info. structuredClone: native, handle hầu hết types, nhưng không clone functions. Custom: flexible nhất nhưng chậm nhất và dễ bug nhất. Trong production, structuredClone là default choice từ 2022+._

✅ **Signal mạnh:** Table so sánh cụ thể + decision framework "when to choose each"
❌ **Signal yếu:** Chỉ biết JSON approach, không biết structuredClone

**Follow-up:** What about `structuredClone` performance with very large objects? → It uses the same internal algorithm as `postMessage` (HTML structured clone), which is optimized in V8 but still O(n). For very large objects, consider immutable data structures (Immer) instead of cloning.

---

#### Q11: How would you implement a generic curry that handles any arity and supports placeholders? / Implement generic curry với placeholder? 🔴

**A:** Generic curry accumulates arguments across calls, executing when accumulated args reach `fn.length`. Placeholder support (`_`) allows filling arguments out of order.

```ts
const _ = Symbol("placeholder");

function curry(fn: Function) {
  return function curried(...args: unknown[]) {
    // Count non-placeholder args
    const complete =
      args.filter((a) => a !== _).length >= fn.length &&
      args.slice(0, fn.length).every((a) => a !== _);
    if (complete) return fn(...args.slice(0, fn.length));
    return (...next: unknown[]) => {
      // Fill placeholders with next args
      const merged = args.map((a) => (a === _ && next.length ? next.shift() : a));
      return curried(...merged, ...next);
    };
  };
}
```

_Generic curry dùng `fn.length` để biết khi nào đủ args. Placeholder (`_`) cho phép fill args không theo thứ tự: `f(_, 2)(1)` = `f(1, 2)`. Pitfall: fn.length không count default params và rest params._

✅ **Signal mạnh:** Viết code + giải thích fn.length pitfalls + placeholder merge strategy
❌ **Signal yếu:** Chỉ implement fixed-arity curry

**Follow-up:** Why is TypeScript typing for generic curry extremely difficult? → Return type depends on number of args provided, which TypeScript can't track through arbitrary function chains without complex conditional types and tuple manipulation.

---

#### Q12: Design a memoization system with LRU eviction, TTL, and async support. / Thiết kế memoize system cho production? 🔴

**A:** Three components: (1) **LRU cache**: Doubly-linked list + Map for O(1) get/put with capacity limit. (2) **TTL**: Store `{ value, expiry: Date.now() + ttl }`, check expiry on get, lazy cleanup. (3) **Async**: Cache the Promise itself (not the resolved value) to prevent thundering herd — multiple concurrent calls get the same pending Promise.

Key insight for async: if you cache the resolved value, two concurrent calls both miss cache and create two requests. If you cache the Promise, the second call gets the same pending Promise.

_3 components: LRU (linked list + Map, O(1) eviction), TTL (expiry timestamp, lazy cleanup), Async (cache Promise để tránh thundering herd). Thundering herd: nhiều requests cùng lúc tạo nhiều duplicate API calls — cache Promise thay value giải quyết._

✅ **Signal mạnh:** Giải thích thundering herd + cache Promise pattern + LRU implementation choice
❌ **Signal yếu:** Chỉ nêu LRU mà thiếu async consideration

**Follow-up:** How does React Query handle this internally? → Uses a query cache with GC timer, stale-while-revalidate pattern, and deduplication via query key. Stale data served immediately while fresh data fetches in background.

---

## Block C — Study Cases & Practice / Tình Huống Thực Tế Sâu

### Case 1: Shopee Search Autocomplete (debounce + memoize)

**Context:** Shopee search bar nhận 500M+ queries/ngày. Team Frontend cần: (1) Reduce API calls khi user gõ. (2) Cache recent queries.

**Solution:** Debounce 300ms + memoize (LRU-50) trên search API call. Leading debounce cho first keystroke (instant feedback), trailing cho subsequent.

**Result:** API calls giảm 70%. Cache hit rate 40% (user thường search lại terms gần đây). P95 search latency giảm từ 200ms xuống 50ms (cached).

**Lesson:** Debounce + memoize là combo phổ biến. Không dùng riêng lẻ — debounce giảm frequency, memoize tránh duplicate work.

---

### Case 2: Grab Real-time Map (throttle)

**Context:** Grab driver app update position liên tục. GPS fire ~1 event/second, nhưng map re-render chỉ cần 4 FPS.

**Solution:** Throttle 250ms trên position update handler. Dùng `requestAnimationFrame` thay `setTimeout` để sync với browser paint cycle.

**Result:** CPU usage giảm 60%. Battery drain giảm rõ rệt trên mobile. Map smooth hơn vì sync với paint cycle.

**Lesson:** Throttle cho continuous events (scroll, resize, GPS). rAF tốt hơn setTimeout cho visual updates.

---

### Case 3: Tiki Product Comparison (deep clone + EventEmitter)

**Context:** Tiki comparison feature: user chọn 3-5 products, mỗi product có nested specs object. Thay đổi 1 product không được affect others.

**Solution:** Deep clone product data khi add vào comparison. EventEmitter notify UI khi comparison list changes.

**Result:** Eliminated mutation bugs. Event-driven update pattern giúp multiple UI components (comparison table, summary bar, share link) stay in sync.

**Lesson:** Deep clone + EventEmitter là foundation cho state isolation + cross-component communication.

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer hỏi bất ngờ:** "Explain the difference between debounce and throttle in exactly 30 seconds."

**4-sentence answer:**

1. **Define:** Debounce delays execution until events stop for N milliseconds; throttle guarantees execution at most once per N milliseconds.
2. **Mechanism:** Debounce resets timer on each event; throttle tracks time since last execution.
3. **Example:** Search autocomplete uses debounce (wait for user to stop typing); scroll tracking uses throttle (update position regularly).
4. **Trade-off:** Debounce may never fire if events never stop; throttle may miss the final event without trailing call.

_Debounce chờ user ngừng N ms rồi mới gọi; throttle đảm bảo gọi tối đa 1 lần mỗi N ms. Debounce reset timer mỗi event; throttle track thời gian từ lần gọi trước. Search dùng debounce, scroll dùng throttle. Debounce có thể không bao giờ fire nếu events liên tục; throttle có thể miss event cuối nếu không có trailing call._

---

## Self-Check / Tự Kiểm Tra

> **Đóng file này trước khi làm. Viết câu trả lời từ memory.**

1. [ ] Vẽ timing diagram cho debounce vs throttle với 5 events liên tục trong 1 giây (wait=300ms).
2. [ ] Implement `deepClone` xử lý được circular reference — không nhìn code.
3. [ ] Giải thích tại sao `Promise.all([])` phải resolve `[]` ngay, không phải pending.
4. [ ] Viết EventEmitter.once — tại sao phải off `wrapper` chứ không phải `handler`?
5. [ ] Nêu 3 limitations của `JSON.stringify` làm memoize key và alternative cho mỗi cái.

### 🎯 Feynman Prompt

> Giải thích cho developer junior (1 năm kinh nghiệm) tại sao memoize async function phải cache Promise chứ không phải resolved value. Dùng ví dụ cụ thể với 2 concurrent API calls.

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

| Round | When / Khi nào | Focus / Trọng tâm                                                                |
| ----- | -------------- | -------------------------------------------------------------------------------- |
| 1     | Day 1          | Viết debounce + throttle từ memory, giải thích khác biệt                         |
| 2     | Day 3          | Implement deep clone + Promise.all, nêu edge cases                               |
| 3     | Day 7          | EventEmitter + curry + flatten, nêu production considerations                    |
| 4     | Day 14         | Memoize with LRU + all Cold Call answers từ memory                               |
| 5     | Day 30         | Full mock interview: pick random 3 challenges, implement + explain trong 30 phút |

---

## 🔗 Connections / Liên Kết

- **Requires / Cần trước:** [JavaScript Fundamentals](../../03-react/01-react-fundamentals.md) (closures, this, prototypes), [Async Patterns](../frontend-theory/10-async-patterns-theory.md)
- **Enables / Mở khóa:** [React Performance](../../06-browser-performance/02-react-performance.md) (useMemo, useCallback), [System Design](../interview-practice/11-interview-practice-03-system-design-questions.md)
- **Cross-track:** [BE: Caching Patterns](../../../be-track/03-database-advanced/04-caching-patterns.md) (memoize ↔ server cache), [Shared: Design Patterns](../../../shared/05-software-engineering/01-solid-and-design-patterns.md) (Observer ↔ EventEmitter)
