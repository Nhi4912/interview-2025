# Advanced JavaScript Concepts / Khái Niệm JavaScript Nâng Cao

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures-comprehensive.md) | [ES6 Features](./07-es6-features.md) | [Functional Programming](./12-functional-programming.md)
> **See also**: [Metaprogramming Theory](./18-metaprogramming-theory.md) | [Memory Management](./15-memory-management-advanced.md)

[← Previous: ES6+ Features](./07-es6-features.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →: Async Comprehensive](./09-async-comprehensive.md)

---

## Real-World Scenario / Tình Huống Thực Tế 🏭

> **Bối cảnh**: Team bạn tại Shopee đang build search autocomplete. Mỗi keystroke gọi API →
> 50 requests/giây khi user gõ nhanh → API rate limit, UI lag, server cost tăng 10x.
>
> Senior dev fix bằng **debounce** (chờ user ngừng gõ 300ms rồi mới gọi). Nhưng scroll event
> của infinite list cần approach khác — **throttle** (gọi tối đa 1 lần/100ms) để UI responsive.
>
> Sau đó, dashboard memory leak: mỗi khi mount/unmount component, metadata object tích lũy
> trong Map — GC không thu hồi vì Map giữ strong reference. Fix: đổi sang **WeakMap** —
> khi component unmount, GC tự dọn metadata.
>
> Vue 3's reactivity system thì dùng **Proxy** để intercept property access — thay thế
> `Object.defineProperty` của Vue 2, giải quyết hàng loạt limitation (dynamic property addition,
> array mutation tracking).
>
> **Đây là những concept phân biệt mid và senior**: không dùng hàng ngày, nhưng khi cần thì
> không có không được.

---

## What & Why / Cái Gì & Tại Sao 🤔

**Advanced JS concepts** là bộ công cụ chuyên biệt cho performance, memory management, và
metaprogramming — những vấn đề mà basic JS không giải quyết được.

**Tương tự đời thường**: Junior developer có búa và tuốc-nơ-vít (loops, if/else, arrays).
Senior developer còn có cờ-lê lực, thước kẹp kỹ thuật số — **không dùng hàng ngày**, nhưng
khi ốc bị siết quá chặt (memory leak) hay cần đo chính xác (intercept operations),
không có công cụ đúng thì không giải quyết được.

| Concept | Giải quyết vấn đề | Ví dụ thực tế |
|---------|-------------------|---------------|
| **Debounce/Throttle** | Rate limiting function calls | Search autocomplete, scroll handlers |
| **WeakMap/WeakSet** | Memory-safe metadata storage | Component metadata, private data, DOM cache |
| **Proxy/Reflect** | Intercept & customize object operations | Vue 3 reactivity, Immer.js, validation |

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Debounce & Throttle / Chống Rung & Điều Tiết

> 🧠 **Memory Hook**: **"Debounce = elevator door"** (chờ mọi người vào xong mới đóng) vs **"Throttle = traffic light"** (cho qua 1 xe mỗi chu kỳ, bất kể bao nhiêu xe đang chờ)

**Tại sao tồn tại? / Why does this exist?**

Browser events (scroll, resize, input) fire hàng chục lần mỗi giây. Nếu mỗi event trigger
expensive operation (API call, DOM calculation, re-render) → performance collapse.

→ **Why?** Vì browser event model được thiết kế để fire liên tục (granular tracking), nhưng
application logic thường chỉ cần kết quả cuối cùng hoặc sample định kỳ.

→ **Why?** Vì đây là mismatch cơ bản giữa **event frequency** (hardware/browser level) và
**processing budget** (application/network level). Debounce/throttle là bridge giữa 2 tần suất này.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

- **Debounce**: Cửa thang máy — cứ có người mới bước vào, cửa reset timer đợi thêm. Chỉ đóng khi
  không ai vào thêm trong 3 giây. → Chờ user ngừng hành động mới xử lý.
- **Throttle**: Đèn giao thông — cứ 30 giây cho 1 batch xe qua, bất kể bao nhiêu xe đang chờ.
  → Xử lý đều đặn, không bị overwhelm.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
DEBOUNCE — waits for silence:

Events:   ──x──x──x──x──────────x──x──────────────
                              ↑ 300ms        ↑ 300ms
                              silence        silence
Fires:    ─────────────────────●───────────────●────
                               ↑               ↑
                          fires once      fires once

THROTTLE — fires at intervals:

Events:   ──x──x──x──x──x──x──x──x──x──x──────────
           │    100ms   │    100ms   │
Fires:    ──●───────────●────────────●──────────────
            ↑           ↑            ↑
         first       after 100ms  after 100ms
```

```javascript
// ✅ Debounce — production-grade with cancel + immediate
function debounce(fn, delay, { leading = false } = {}) {
  let timeoutId;

  function debounced(...args) {
    const callNow = leading && !timeoutId;
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!leading) fn.apply(this, args);
    }, delay);

    if (callNow) fn.apply(this, args);
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}

// ✅ Throttle — with trailing call guarantee
function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastThis = null;

  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
          lastThis = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastThis = this;
    }
  };
}

// Usage: search autocomplete
const search = debounce(async (query) => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(await res.json());
}, 300);

input.addEventListener('input', (e) => search(e.target.value));

// Usage: scroll position tracking
const trackScroll = throttle(() => {
  analytics.track('scroll', { position: window.scrollY });
}, 100);

window.addEventListener('scroll', trackScroll);
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **`this` binding**: Must use `.apply(this, args)` — arrow functions in debounced callback lose component `this`
- **Cancel on unmount**: Always call `debounced.cancel()` in cleanup (React `useEffect` return) to prevent memory leaks and state updates on unmounted components
- **Leading vs trailing**: Leading debounce fires immediately on first call (good for button clicks), trailing fires after silence (good for search input)
- **`requestAnimationFrame` throttle**: For visual updates, `rAF` is better than `setTimeout` throttle — syncs with browser paint cycle

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Debounce and throttle are interchangeable" | Debounce waits for silence (last call wins); throttle guarantees regular execution | Choose based on whether you need the FINAL value or REGULAR sampling |
| Creating new debounced function inside render | Each render creates a NEW function with its own timer — debounce is broken | Create debounced fn ONCE outside render, or use `useRef`/`useMemo` |
| Not canceling on component unmount | Debounced callback fires after component is gone → "setState on unmounted" | Cancel in `useEffect` cleanup: `return () => debounced.cancel()` |
| Using debounce for scroll-based animations | User sees nothing during the delay, then a jarring jump | Use throttle or `requestAnimationFrame` for visual feedback |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "debounce", "throttle", "rate limiting", "search input optimization"
- → Nhớ đến: Elevator door (debounce) vs Traffic light (throttle)
- → Mở đầu trả lời: "Debounce delays execution until a quiet period passes — ideal for search inputs where only the final value matters. Throttle guarantees execution at regular intervals — ideal for scroll handlers where you need consistent visual feedback. The key difference is that debounce resets its timer on every call, while throttle maintains a fixed cadence."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — debounce/throttle work via closure over `timeoutId`
- ➡️ Để hiểu: [React Performance](../06-browser-performance/02-react-performance.md) — where these patterns prevent unnecessary re-renders

---

### 2. WeakMap & WeakSet / Bộ Sưu Tập Tham Chiếu Yếu

> 🧠 **Memory Hook**: **"Weak = forgettable"** — WeakMap holds references that the garbage collector is allowed to forget. When nobody else remembers the key, WeakMap lets go too.

**Tại sao tồn tại? / Why does this exist?**

`Map` giữ **strong reference** đến key — nghĩa là key object không bao giờ bị garbage collected
dù không còn ai dùng nó. Nếu bạn dùng Map để cache DOM elements hay component metadata,
và quên delete khi element bị remove → **memory leak**.

→ **Why?** Vì JS garbage collector chỉ thu hồi objects không còn reachable reference nào. Map's
key IS a reference → object sống mãi trong memory.

→ **Why?** Vì đây là trade-off cơ bản: **Map = you manage lifecycle manually** vs
**WeakMap = GC manages lifecycle automatically**. WeakMap chọn safety (no leaks) đổi lấy
non-iterability (can't list keys/values).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Map giống **bảng tên trong văn phòng** — dù nhân viên đã nghỉ việc, tên vẫn treo đó (memory leak).
WeakMap giống **thẻ từ ra vào** — khi nhân viên nghỉ, thẻ tự vô hiệu hóa, hệ thống tự xóa record.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Map vs WeakMap — GC behavior:

  Map (strong reference):              WeakMap (weak reference):
  ┌─────────────────┐                  ┌─────────────────┐
  │ Map             │                  │ WeakMap         │
  │ ┌─────┬───────┐ │                  │ ┌ ─ ─ ┬───────┐ │
  │ │ key ─────→obj│ │                  │ │ key ┄┄┄→obj│ │
  │ └─────┴───────┘ │                  │ └ ─ ─ ┴───────┘ │
  └─────────────────┘                  └─────────────────┘

  obj = null;                          obj = null;
  → Map still holds key → obj          → WeakMap entry eligible for GC
  → obj NEVER garbage collected        → obj collected, entry disappears
  → MEMORY LEAK ⚠️                     → CLEAN ✅

  Key constraints:
  Map:     any value (string, number, object)
  WeakMap: objects ONLY (no primitives)

  Iterability:
  Map:     .keys(), .values(), .entries(), .forEach(), .size
  WeakMap: NONE (can't iterate — GC may remove entries at any time)
```

```javascript
// ❌ Memory leak with Map — DOM element cache
const elementCache = new Map();

function addToCache(element) {
  elementCache.set(element, computeExpensiveData(element));
}

// Element removed from DOM, but Map still references it
document.body.removeChild(element);
// elementCache still holds reference → element NOT garbage collected!
// Must manually: elementCache.delete(element);

// ✅ WeakMap — automatic cleanup
const elementCache = new WeakMap();

function addToCache(element) {
  elementCache.set(element, computeExpensiveData(element));
}

document.body.removeChild(element);
element = null;
// WeakMap entry is eligible for GC — no manual cleanup needed!

// ✅ Practical: private data (pre-#private-fields pattern)
const privateData = new WeakMap();

class User {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn }); // truly private!
  }

  getSSNLastFour() {
    return privateData.get(this).ssn.slice(-4);
  }
}

const user = new User('Alice', '123-45-6789');
console.log(user.name);            // 'Alice'
console.log(user.ssn);             // undefined (not on object)
console.log(user.getSSNLastFour()); // '6789'

// ✅ Practical: track visited nodes (no cleanup needed)
function deepClone(obj, visited = new WeakSet()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (visited.has(obj)) return obj; // circular reference guard

  visited.add(obj);
  const clone = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], visited);
  }
  return clone;
}
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **No `.size` property**: You can't know how many entries exist — GC may have removed some
- **Key must be object**: `weakMap.set('string', val)` throws TypeError
- **Non-deterministic cleanup**: GC runs when it wants — entry may persist briefly after key becomes unreachable
- **WeakRef + FinalizationRegistry** (ES2021): For cases where you need notification when an object is collected

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "WeakMap is slower than Map" | Performance is comparable for get/set — difference is GC behavior, not speed | Choose based on lifecycle needs, not performance |
| "WeakMap prevents all memory leaks" | Only prevents leaks from the MAP's reference — other strong refs keep object alive | WeakMap helps when it's the ONLY remaining reference |
| "Use WeakMap for everything" | Can't iterate, can't get size — useless when you need to list/count entries | Use Map when you need iteration; WeakMap when you need auto-cleanup |
| Using string/number as WeakMap key | WeakMap keys MUST be objects — primitives throw TypeError | Use Map for primitive keys, WeakMap for object keys |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "WeakMap", "memory leak", "when to use Map vs WeakMap", "private data"
- → Nhớ đến: "Weak = forgettable" — GC is allowed to forget
- → Mở đầu trả lời: "WeakMap holds weak references to its keys — when no other reference to the key object exists, the entry becomes eligible for garbage collection automatically. This prevents memory leaks in caching scenarios where you'd otherwise need manual cleanup. The trade-off is that WeakMap is not iterable and has no `.size` property, because entries can disappear at any time."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Memory Management](./15-memory-management-advanced.md) — how JS garbage collection works (mark-and-sweep, reachability)
- ➡️ Để hiểu: React/framework internals — Fiber tree uses WeakMap-like patterns for component metadata

---

### 3. Proxy & Reflect / Proxy & Phản Chiếu

> 🧠 **Memory Hook**: **"Proxy = invisible bodyguard"** — stands between code and object, intercepts every operation, can modify/validate/log without the caller knowing

**Tại sao tồn tại? / Why does this exist?**

`Object.defineProperty()` (Vue 2) chỉ intercept được property get/set trên **existing properties**.
Thêm property mới → không reactive. Delete property → không detect. Array index assignment → hack workaround.

→ **Why?** Vì `defineProperty` hoạt động ở **property level** — phải khai báo từng property trước.
Proxy hoạt động ở **object level** — intercept MỌI operation bao gồm property chưa tồn tại.

→ **Why?** Vì đây là metaprogramming cốt lõi: khả năng **thay đổi hành vi mặc định** của language
operations (get, set, delete, `in`, function call). Proxy là API duy nhất cho phép điều này
một cách hoàn chỉnh.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Proxy giống **vệ sĩ vô hình** trước cửa nhà. Mọi người đến thăm (access property) phải qua vệ sĩ
trước. Vệ sĩ có thể: kiểm tra giấy tờ (validation), ghi sổ (logging), từ chối (throw error),
hoặc dẫn đến phòng khác (redirect). Khách không biết vệ sĩ tồn tại — tương tác giống hệt
như giao tiếp trực tiếp với chủ nhà.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Proxy intercepts "traps" — 13 operations total:

  Code                     Trap triggered
  ─────────────────        ──────────────
  proxy.name               get(target, prop, receiver)
  proxy.name = 'A'         set(target, prop, value, receiver)
  delete proxy.name        deleteProperty(target, prop)
  'name' in proxy          has(target, prop)
  Object.keys(proxy)       ownKeys(target)
  new proxy()              construct(target, args, newTarget)
  proxy()                  apply(target, thisArg, args)
  ...and 6 more

  Reflect mirrors every Proxy trap — provides the "default behavior":
  get trap default   →  Reflect.get(target, prop, receiver)
  set trap default   →  Reflect.set(target, prop, value, receiver)
  Use Reflect inside traps to forward the operation after your custom logic.
```

```javascript
// ✅ Validation proxy — type-safe object
function createValidated(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      if (!(prop in schema)) {
        throw new Error(`Unknown property: ${prop}`);
      }
      if (typeof value !== schema[prop]) {
        throw new TypeError(`${prop} must be ${schema[prop]}, got ${typeof value}`);
      }
      return Reflect.set(target, prop, value);
    }
  });
}

const user = createValidated({ name: 'string', age: 'number' });
user.name = 'Alice';    // ✅
user.age = 30;          // ✅
user.age = 'thirty';    // ❌ TypeError: age must be number
user.email = 'a@b.com'; // ❌ Error: Unknown property: email

// ✅ Reactive system (simplified Vue 3 approach)
function reactive(obj) {
  const subscribers = new Map(); // prop → Set of effects

  return new Proxy(obj, {
    get(target, prop, receiver) {
      // Track: record which effect is reading this property
      if (activeEffect) {
        if (!subscribers.has(prop)) subscribers.set(prop, new Set());
        subscribers.get(prop).add(activeEffect);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      // Trigger: notify all effects that depend on this property
      if (subscribers.has(prop)) {
        subscribers.get(prop).forEach(effect => effect());
      }
      return result;
    }
  });
}

// ✅ Negative array indexing (Python-style)
function createNegativeArray(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);
      if (!isNaN(index) && index < 0) {
        return Reflect.get(target, target.length + index, receiver);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

const arr = createNegativeArray([1, 2, 3, 4, 5]);
arr[-1]; // 5
arr[-2]; // 4

// ✅ Immer-style immutable updates (concept)
function produce(base, recipe) {
  const draft = new Proxy(structuredClone(base), {
    set(target, prop, value) {
      target[prop] = value; // mutate the CLONE, not the original
      return true;
    }
  });
  recipe(draft);
  return Object.freeze(draft); // return frozen result
}

const state = { count: 0, items: ['a'] };
const next = produce(state, draft => {
  draft.count = 1;          // looks like mutation
  draft.items.push('b');    // but actually modifies a clone
});
// state.count === 0 (untouched), next.count === 1
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Performance**: Proxy has overhead per operation (~2-5x slower than direct access). Don't use in hot loops
- **`this` in methods**: When a proxied method accesses `this`, it gets the Proxy — not the original target. Use `receiver` parameter via `Reflect.get`
- **Non-extensible/frozen objects**: Some traps must return consistent results with the target's invariants — e.g., can't report a non-configurable property as non-existent
- **No polyfill**: Proxy cannot be polyfilled in old browsers — it's a language-level feature
- **Revocable proxy**: `Proxy.revocable()` creates a proxy that can be permanently disabled

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Proxy and `defineProperty` are equivalent" | `defineProperty` only intercepts get/set on known properties; Proxy intercepts ALL operations on ANY property | Proxy is strictly more powerful — 13 traps vs 2 |
| Forgetting to use `Reflect` in traps | Returning raw `target[prop]` can break prototype chain and receiver binding | Always use `Reflect.get/set` to preserve correct `this` and prototype behavior |
| Using Proxy in hot loops | Each get/set goes through a function call — 2-5x overhead | Cache values outside the Proxy for performance-critical paths |
| "Proxy replaces TypeScript validation" | Proxy is runtime; TypeScript is compile-time — they serve different purposes | Use TS for static checking, Proxy for runtime invariants |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "Proxy", "Reflect", "Vue 3 reactivity", "metaprogramming", "Immer"
- → Nhớ đến: "Invisible bodyguard" — intercepts all object operations
- → Mở đầu trả lời: "Proxy creates a wrapper around an object that intercepts fundamental operations — get, set, delete, `in`, and 10 more traps. This is the foundation of Vue 3's reactivity system, which replaced `Object.defineProperty` because Proxy can detect dynamic property additions and deletions. Reflect provides the default behavior for each trap, ensuring correct prototype chain and `this` binding."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Prototypes](./10-prototypes-inheritance-deep.md) — Proxy receiver relates to prototype chain `this` binding
- ➡️ Để hiểu: Vue 3 reactivity internals, Immer.js copy-on-write, MobX observable pattern

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: Implement debounce with cancel and leading/trailing options. / Implement debounce với cancel và leading/trailing. 🟡 Mid

**A:**

```javascript
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timeoutId = null;
  let lastArgs = null;

  function debounced(...args) {
    lastArgs = args;
    const callNow = leading && !timeoutId;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
      }
    }, delay);

    if (callNow) {
      fn.apply(this, args);
      lastArgs = null;
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      fn.apply(null, lastArgs);
      debounced.cancel();
    }
  };

  return debounced;
}
```

**Key points:**
- `leading: true` fires on FIRST call, then waits. Good for button click prevention.
- `trailing: true` (default) fires AFTER quiet period. Good for search input.
- `cancel()` is critical for React cleanup — prevents setState on unmounted components.
- `flush()` forces immediate execution — useful before navigation/page unload.

Giải thích tiếng Việt: Debounce trì hoãn thực thi đến khi user ngừng hành động. `leading` = gọi ngay lần đầu (tốt cho button), `trailing` = gọi sau khi im lặng (tốt cho search). `cancel()` cần gọi trong React `useEffect` cleanup để tránh memory leak. `flush()` ép thực thi ngay — hữu ích trước khi chuyển trang.

**💡 Interview Signal:**
- ✅ Strong: Includes cancel/flush, explains leading vs trailing use cases, mentions React cleanup
- ❌ Weak: Only implements basic version without cancel, doesn't mention component lifecycle

---

### Q2: When would you use WeakMap instead of Map? Give a real example. / Khi nào dùng WeakMap thay vì Map? Cho ví dụ thực tế. 🟡 Mid

**A:** Use WeakMap when:
1. **Keys are objects** whose lifecycle you don't control
2. **You don't need to iterate** over entries
3. **Auto-cleanup** matters more than being able to list contents

**Real example — caching computed values for DOM elements:**

```javascript
// ❌ Map: leaks memory when elements are removed from DOM
const cache = new Map();
function getRect(element) {
  if (!cache.has(element)) {
    cache.set(element, element.getBoundingClientRect());
  }
  return cache.get(element);
}
// When element is removed from DOM, cache still holds reference → leak

// ✅ WeakMap: auto-cleanup when element is garbage collected
const cache = new WeakMap();
function getRect(element) {
  if (!cache.has(element)) {
    cache.set(element, element.getBoundingClientRect());
  }
  return cache.get(element);
}
// When element is removed and no other refs exist → GC cleans up cache entry
```

**Another real example — truly private instance data:**

```javascript
const _private = new WeakMap();

class ApiClient {
  constructor(apiKey) {
    _private.set(this, { apiKey, requestCount: 0 });
  }

  fetch(url) {
    const data = _private.get(this);
    data.requestCount++;
    return globalThis.fetch(url, {
      headers: { Authorization: `Bearer ${data.apiKey}` }
    });
  }
}

const client = new ApiClient('secret-key');
console.log(Object.keys(client));    // [] — nothing visible
console.log(client.apiKey);          // undefined — truly private
```

Giải thích tiếng Việt: Dùng WeakMap khi key là object, không cần iterate, và muốn tự động dọn dẹp khi object bị GC. Hai use case chính: (1) cache metadata cho DOM elements — khi element bị remove, cache tự dọn; (2) private data pattern — dữ liệu thực sự ẩn, không thể access từ bên ngoài. Không dùng WeakMap khi cần `.size`, `.keys()`, hay key là primitive.

**💡 Interview Signal:**
- ✅ Strong: Gives concrete DOM cache example, explains GC behavior, mentions trade-off (no iteration)
- ❌ Weak: Only says "prevents memory leaks" without showing how or when Map leaks

---

### Q3: Explain how Proxy works. How does Vue 3 use it for reactivity? / Giải thích cách Proxy hoạt động. Vue 3 dùng nó cho reactivity thế nào? 🔴 Senior

**A:** Proxy wraps an object and intercepts fundamental operations via "traps" — 13 in total (get, set, deleteProperty, has, ownKeys, etc.). Each trap receives the original target and can modify behavior before delegating to `Reflect` for default behavior.

**Vue 3 reactivity simplified:**

```javascript
let activeEffect = null;

function effect(fn) {
  activeEffect = fn;
  fn(); // triggers get traps → tracking
  activeEffect = null;
}

function reactive(obj) {
  const deps = new Map(); // property → Set<effect>

  return new Proxy(obj, {
    get(target, prop, receiver) {
      // TRACK: record which effect depends on this property
      if (activeEffect) {
        if (!deps.has(prop)) deps.set(prop, new Set());
        deps.get(prop).add(activeEffect);
      }
      return Reflect.get(target, prop, receiver);
    },

    set(target, prop, value, receiver) {
      const oldValue = target[prop];
      const result = Reflect.set(target, prop, value, receiver);

      // TRIGGER: notify effects when value changes
      if (oldValue !== value && deps.has(prop)) {
        deps.get(prop).forEach(fn => fn());
      }
      return result;
    },

    deleteProperty(target, prop) {
      const result = Reflect.deleteProperty(target, prop);
      if (deps.has(prop)) {
        deps.get(prop).forEach(fn => fn());
      }
      return result;
    }
  });
}

// Usage:
const state = reactive({ count: 0, name: 'Vue' });

effect(() => {
  console.log(`Count is: ${state.count}`); // get trap tracks this effect
});

state.count = 1; // set trap triggers the effect → logs "Count is: 1"
```

**Why Proxy over Object.defineProperty (Vue 2)?**

| Feature | Object.defineProperty | Proxy |
|---------|----------------------|-------|
| New property detection | ❌ Must use `Vue.set()` | ✅ Automatic |
| Property deletion | ❌ Must use `Vue.delete()` | ✅ `deleteProperty` trap |
| Array index assignment | ❌ Hack with splice | ✅ `set` trap catches `arr[0] = x` |
| Map/Set support | ❌ Not possible | ✅ Can intercept method calls |
| Performance | Define all props upfront | Lazy — only intercepts accessed props |

Giải thích tiếng Việt: Proxy wrap một object, intercept mọi operation qua "traps". Vue 3 dùng `get` trap để **track** (ghi nhớ effect nào đang đọc property nào), và `set` trap để **trigger** (chạy lại các effects khi property thay đổi). So với Vue 2 (`Object.defineProperty`), Proxy detect được thêm property mới, xóa property, array index assignment — giải quyết mọi limitation của Vue 2.

**💡 Interview Signal:**
- ✅ Strong: Implements track/trigger pattern, explains Vue 2 vs 3 difference with specific limitations, uses `Reflect`
- ❌ Weak: Only explains Proxy API without connecting to real framework usage

---

### Q4: Implement a deep reactive Proxy that handles nested objects. / Implement deep reactive Proxy xử lý nested objects. 🔴 Senior

**A:** The challenge: `reactive({ user: { name: 'Alice' } })` — accessing `state.user.name`
triggers `get` on the outer Proxy for `user`, but the inner object `{ name: 'Alice' }` is NOT
wrapped yet. We need to lazily wrap nested objects.

```javascript
const reactiveMap = new WeakMap(); // avoid re-wrapping same object

function deepReactive(obj) {
  if (reactiveMap.has(obj)) return reactiveMap.get(obj);

  const proxy = new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);

      // Lazily wrap nested objects — only when accessed
      if (value !== null && typeof value === 'object') {
        return deepReactive(value);
      }

      track(target, prop); // track dependency
      return value;
    },

    set(target, prop, value, receiver) {
      const oldValue = target[prop];
      const result = Reflect.set(target, prop, value, receiver);

      if (oldValue !== value) {
        trigger(target, prop); // notify dependents
      }
      return result;
    },

    deleteProperty(target, prop) {
      const hadKey = prop in target;
      const result = Reflect.deleteProperty(target, prop);

      if (hadKey) {
        trigger(target, prop);
      }
      return result;
    }
  });

  reactiveMap.set(obj, proxy);
  return proxy;
}

// Key design decisions:
// 1. WeakMap cache → prevents infinite recursion on circular refs
// 2. Lazy wrapping → only creates Proxy when property is READ (not upfront)
// 3. Old vs new check → avoids unnecessary triggers
```

**Why this is a senior question**: It tests understanding of:
- Recursive Proxy application with memoization (WeakMap)
- Lazy evaluation (don't wrap until accessed)
- Circular reference protection
- The exact same architecture Vue 3 uses in production

Giải thích tiếng Việt: Deep reactive cần lazy-wrap nested objects — chỉ tạo Proxy khi property được đọc, không phải khi tạo. Dùng `WeakMap` cache để: (1) tránh tạo nhiều Proxy cho cùng object, (2) tránh infinite recursion với circular references. Đây chính xác là cách Vue 3's `reactive()` hoạt động trong production.

**💡 Interview Signal:**
- ✅ Strong: Shows WeakMap memoization, lazy wrapping, circular ref protection, connects to Vue 3 architecture
- ❌ Weak: Wraps all nested objects eagerly upfront, no memoization, ignores circular refs

---

### Q5: Compare debounce, throttle, and requestAnimationFrame for scroll handling. Which would you choose and why? / So sánh debounce, throttle, và rAF cho scroll handling. Chọn cái nào? 🔴 Senior

**A:** This is a tradeoff analysis — each optimizes for a different goal:

| Approach | Execution Pattern | Best For |
|----------|------------------|----------|
| **Debounce** | After user stops scrolling | Final scroll position (e.g., save bookmark) |
| **Throttle** | Every N ms during scroll | Analytics tracking, lazy loading triggers |
| **rAF** | Once per frame (~16ms at 60fps) | Visual updates (parallax, sticky headers) |

```javascript
// ❌ Debounce for visual scroll effects — UI appears frozen
const onScroll = debounce(() => {
  header.style.transform = `translateY(${window.scrollY}px)`;
}, 100);
// User sees: nothing... nothing... JUMP — terrible UX

// ❌ Throttle at 100ms for visual — choppy at 10fps
const onScroll = throttle(() => {
  header.style.transform = `translateY(${window.scrollY}px)`;
}, 100);

// ✅ rAF for visual — synced with browser paint, smooth 60fps
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      header.style.transform = `translateY(${window.scrollY}px)`;
      ticking = false;
    });
    ticking = true;
  }
});

// ✅ Throttle for non-visual — analytics at 200ms is fine
const trackScroll = throttle(() => {
  analytics.track('scroll_depth', {
    depth: Math.round(window.scrollY / document.body.scrollHeight * 100)
  });
}, 200);
```

**Decision framework:**
1. **Need final value only?** → Debounce (search input, resize end)
2. **Need regular sampling?** → Throttle (analytics, intersection checks)
3. **Need visual smoothness?** → requestAnimationFrame (animations, transforms, layout reads)
4. **Combination**: Use rAF + throttle together — rAF for rendering, throttle for side effects within the rAF callback

Giải thích tiếng Việt: Debounce chờ user dừng scroll (tốt cho lưu vị trí). Throttle sample định kỳ (tốt cho analytics). `requestAnimationFrame` sync với browser paint cycle ~60fps (tốt cho visual effects). Rule: nếu output là VISUAL → rAF. Nếu output là DATA → throttle. Nếu chỉ cần KẾT QUẢ CUỐI → debounce.

**💡 Interview Signal:**
- ✅ Strong: Explains when each is wrong (debounce → frozen UI), shows rAF pattern with `ticking` flag, gives decision framework
- ❌ Weak: Only explains what each does without analyzing scroll-specific tradeoffs

---

## Interview Q&A Summary / Tổng Kết Q&A

| # | Topic | Difficulty | Key Concept |
|---|-------|-----------|-------------|
| Q1 | Debounce implementation | 🟡 Mid | cancel/flush, leading/trailing, React cleanup |
| Q2 | WeakMap vs Map | 🟡 Mid | GC auto-cleanup, DOM cache, private data |
| Q3 | Proxy + Vue 3 reactivity | 🔴 Senior | Track/trigger pattern, Reflect, Vue 2 vs 3 |
| Q4 | Deep reactive Proxy | 🔴 Senior | Lazy wrapping, WeakMap memoization, circular refs |
| Q5 | Debounce vs throttle vs rAF | 🔴 Senior | Visual=rAF, data=throttle, final=debounce |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"What is a Proxy in JavaScript and when would you use one?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "A Proxy wraps an object and intercepts fundamental operations through traps — there are 13 traps covering get, set, delete, `in` operator, and more."
2. "The most prominent real-world use is Vue 3's reactivity system: the `get` trap tracks which computed properties depend on each reactive property, and the `set` trap triggers re-computation when values change."
3. "Compared to Vue 2's `Object.defineProperty`, Proxy detects dynamic property additions, deletions, and array index mutations automatically — eliminating the need for `Vue.set()` and `Vue.delete()`."
4. "The tradeoff is roughly 2-5x overhead per operation and no polyfill for older browsers, so it's best for framework-level reactivity rather than hot-loop data processing."

---

## Self-Check / Tự Kiểm Tra ⚡ (Đóng tài liệu lại trước khi làm)

- [ ] **Retrieval**: Viết implement `debounce` từ trí nhớ (với `cancel`). Giải thích leading vs trailing bằng 1 câu mỗi cái.
- [ ] **Visual**: Vẽ timeline diagram cho debounce vs throttle khi user gõ 5 ký tự liên tục, delay 300ms.
- [ ] **Application**: Component React mount/unmount liên tục. Map cache element metadata → memory leak. Fix bằng gì? Viết code.
- [ ] **Debug**: `new Proxy(obj, { get(t,p) { return t[p] } })` — tại sao không nên dùng `t[p]` mà nên dùng `Reflect.get()`? Cho ví dụ bug cụ thể.
- [ ] **Teach**: Giải thích WeakMap cho junior developer bằng ví dụ "thẻ từ ra vào văn phòng".

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa debounce và throttle bằng ví dụ cửa thang máy vs đèn giao thông. Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition reminder:** Review this file again on 2026-03-22, then 2026-03-26, then 2026-04-02.
