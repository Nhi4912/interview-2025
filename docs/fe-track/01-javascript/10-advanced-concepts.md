# Advanced JavaScript Concepts / Khái Niệm JavaScript Nâng Cao

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Closures](./04-closures.md) | [ES6+ Features](./08-es6-features.md)
> **See also**: [Memory Management](./13-memory-management.md) | [Advanced Patterns](./14-advanced-patterns.md)
> **L5 Competencies**: Performance Optimization • Metaprogramming • Memory Management

---

## Real-World Scenario / Tình Huống Thực Tế

> Team bạn tại Shopee build search autocomplete. Mỗi keystroke gọi API → 50 requests/giây
> khi user gõ nhanh → API rate limit, UI lag, chi phí server tăng 10x.
>
> Senior dev fix bằng **debounce** (chờ user ngừng gõ 300ms rồi mới gọi). Nhưng scroll event
> của infinite list cần approach khác — **throttle** (gọi tối đa 1 lần/100ms) để UI responsive.
>
> Sau đó, dashboard memory leak: mỗi khi mount/unmount component, metadata object tích lũy
> trong Map — GC không thu hồi vì Map giữ strong reference. Fix: đổi sang **WeakMap**.
>
> Đây là những concept phân biệt mid và senior: không dùng hàng ngày, nhưng khi cần thì
> không thể thiếu.

---

## What & Why / Cái Gì & Tại Sao

**Advanced JS concepts** là bộ công cụ chuyên biệt cho performance, memory management, và
metaprogramming — giống như **hộp công cụ sửa điện** của thợ chuyên nghiệp. Junior có búa và
tuốc-nơ-vít (loops, if/else). Senior có thêm bút thử điện, đồng hồ đo, kìm tuốt dây —
không dùng hàng ngày, nhưng khi ốc bị siết quá chặt (memory leak) hay cần đo chính xác
(intercept operations), không có thì không giải quyết được.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Advanced JS Concepts]
        │
        ├── Rate Limiting
        │       ├── Debounce — chờ im lặng rồi mới chạy (search input)
        │       └── Throttle — chạy đều đặn mỗi N ms (scroll handler)
        │
        ├── Memory-Safe Collections
        │       ├── WeakMap — auto GC khi key object mất reference
        │       └── WeakSet — mark objects đã xử lý, auto cleanup
        │
        └── Metaprogramming
                ├── Proxy — intercept MỌI object operation (13 traps)
                └── Reflect — default behavior cho mỗi trap
```

---

## Overview / Tổng Quan

| Concept           | Giải quyết vấn đề                       | Ví dụ thực tế                        |
| ----------------- | --------------------------------------- | ------------------------------------ |
| Debounce/Throttle | Rate limiting function calls            | Search autocomplete, scroll handlers |
| WeakMap/WeakSet   | Memory-safe metadata storage            | Component metadata, DOM cache        |
| Proxy/Reflect     | Intercept & customize object operations | Vue 3 reactivity, Immer.js           |

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Debounce & Throttle / Chống Rung & Điều Tiết

> 🧠 **Memory Hook**: "**Debounce = cửa thang máy**" (chờ mọi người vào xong mới đóng) vs "**Throttle = đèn giao thông**" (cho qua 1 xe mỗi chu kỳ)

**Tại sao tồn tại?**

Browser events (scroll, resize, input) fire hàng chục lần mỗi giây. Nếu mỗi event trigger
expensive operation (API call, DOM calculation) → performance collapse.

→ **Tại sao?** Vì browser event model fire liên tục (granular tracking), nhưng application logic
thường chỉ cần kết quả cuối cùng hoặc sample định kỳ.

→ **Tại sao?** Vì đây là mismatch cơ bản giữa **event frequency** (hardware level) và
**processing budget** (application/network level). Debounce/throttle là cầu nối giữa 2 tần suất.

#### Layer 1: Analogy / Liên Tưởng

- **Debounce**: Cửa thang máy — cứ có người mới bước vào, cửa reset timer đợi thêm. Chỉ đóng
  khi không ai vào thêm trong 3 giây. → **Chờ user ngừng hành động mới xử lý.**
- **Throttle**: Đèn giao thông — cứ 30 giây cho 1 batch xe qua, bất kể bao nhiêu xe đang chờ.
  → **Xử lý đều đặn, không bị overwhelm.**

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
DEBOUNCE — chờ im lặng:

Events:   ──x──x──x──x──────────x──x──────────────
                              ↑ 300ms        ↑ 300ms
                              im lặng        im lặng
Fires:    ─────────────────────●───────────────●────
                               ↑               ↑
                          1 lần gọi       1 lần gọi

THROTTLE — gọi đều đặn:

Events:   ──x──x──x──x──x──x──x──x──x──x──────────
           │    100ms   │    100ms   │
Fires:    ──●───────────●────────────●──────────────
            ↑           ↑            ↑
         lần đầu    sau 100ms    sau 100ms
```

```javascript
// ✅ Debounce — production-grade với cancel + leading
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

// ✅ Throttle — với trailing call guarantee
function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastThis = this;
    }
  };
}

// Dùng cho search autocomplete
const search = debounce(async (query) => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  renderResults(await res.json());
}, 300);

input.addEventListener("input", (e) => search(e.target.value));

// Dùng cho scroll tracking
const trackScroll = throttle(() => {
  analytics.track("scroll", { position: window.scrollY });
}, 100);

window.addEventListener("scroll", trackScroll);
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Leading vs trailing**: Leading debounce fire ngay lần đầu (tốt cho button click), trailing fire sau im lặng (tốt cho search)
- **Cancel on unmount**: Luôn gọi `debounced.cancel()` trong React cleanup để tránh setState trên unmounted component
- **`requestAnimationFrame` throttle**: Cho visual updates, rAF tốt hơn setTimeout — sync với browser paint cycle

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                             | Tại sao sai                                                    | Đúng là                                              |
| ----------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| Tạo debounced function trong render | Mỗi render tạo function MỚI với timer riêng → debounce vô hiệu | Tạo 1 lần ngoài render, hoặc dùng `useRef`/`useMemo` |
| Không cancel khi component unmount  | Callback fire sau component gone → setState lỗi                | Cancel trong `useEffect` cleanup                     |
| Dùng debounce cho scroll animation  | User thấy đứng hình rồi nhảy cóc — UX tệ                       | Dùng throttle hoặc `requestAnimationFrame`           |
| Nghĩ debounce = throttle            | Debounce chờ im lặng (last call wins), throttle chạy đều đặn   | Chọn dựa trên cần KẾT QUẢ CUỐI hay SAMPLE ĐỀU ĐẶN    |

**🎯 Interview Pattern:**

- **Trigger**: "debounce", "throttle", "rate limiting", "search input"
- **Concept**: Elevator door vs Traffic light
- **Opening**: "Debounce delays execution until a quiet period passes — ideal for search inputs. Throttle guarantees execution at regular intervals — ideal for scroll handlers. The key difference: debounce resets its timer on every call, throttle maintains a fixed cadence."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — debounce/throttle hoạt động nhờ closure over `timeoutId`
- ➡️ Để hiểu: Performance optimization — nơi patterns này prevent unnecessary operations

---

### 2. WeakMap & WeakSet / Bộ Sưu Tập Tham Chiếu Yếu

> 🧠 **Memory Hook**: "**Weak = quên được**" — WeakMap giữ reference mà GC được phép quên. Khi không ai nhớ key nữa, WeakMap cũng buông.

**Tại sao tồn tại?**

`Map` giữ **strong reference** đến key — key object không bao giờ bị GC dù không còn ai dùng.
Dùng Map cache DOM elements, quên delete khi element bị remove → **memory leak**.

→ **Tại sao?** Vì GC chỉ thu hồi objects không còn reachable reference. Map's key IS a reference
→ object sống mãi.

→ **Tại sao?** Trade-off cơ bản: **Map = bạn quản lý lifecycle thủ công** vs
**WeakMap = GC quản lý tự động**. WeakMap chọn safety (no leaks) đổi lấy non-iterability.

#### Layer 1: Analogy / Liên Tưởng

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
  → Map vẫn giữ key → obj             → WeakMap entry eligible for GC
  → obj KHÔNG BAO GIỜ bị GC           → obj được thu hồi, entry biến mất
  → MEMORY LEAK ⚠️                     → SẠCH ✅

  Ràng buộc key:
  Map:     bất kỳ value nào (string, number, object)
  WeakMap: CHỈ objects (không primitives)

  Iterability:
  Map:     .keys(), .values(), .entries(), .forEach(), .size
  WeakMap: KHÔNG CÓ (GC có thể xóa entry bất cứ lúc nào)
```

```javascript
// ❌ Memory leak với Map — DOM element cache
const cache = new Map();
function addToCache(element) {
  cache.set(element, computeExpensiveData(element));
}
document.body.removeChild(element);
// cache vẫn giữ reference → element KHÔNG bị GC!

// ✅ WeakMap — automatic cleanup
const cache = new WeakMap();
function addToCache(element) {
  cache.set(element, computeExpensiveData(element));
}
document.body.removeChild(element);
element = null;
// WeakMap entry eligible for GC — không cần manual cleanup!

// ✅ Practical: private data (trước khi có #private fields)
const privateData = new WeakMap();
class User {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn }); // thực sự private!
  }
  getSSNLastFour() {
    return privateData.get(this).ssn.slice(-4);
  }
}

// ✅ Practical: track visited nodes (circular reference guard)
function deepClone(obj, visited = new WeakSet()) {
  if (obj === null || typeof obj !== "object") return obj;
  if (visited.has(obj)) return obj; // tránh vòng lặp vô hạn
  visited.add(obj);
  const clone = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], visited);
  }
  return clone;
}
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Không có `.size`**: Không thể biết bao nhiêu entries — GC có thể đã xóa một số
- **Key phải là object**: `weakMap.set('string', val)` throws TypeError
- **Non-deterministic cleanup**: GC chạy khi nó muốn — entry có thể tồn tại ngắn sau khi key unreachable
- **WeakRef + FinalizationRegistry** (ES2021): Khi cần notification khi object bị GC

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                            | Tại sao sai                                                        | Đúng là                                                |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| "WeakMap chậm hơn Map"             | Performance tương đương cho get/set — khác ở GC behavior           | Chọn dựa trên lifecycle needs, không phải speed        |
| "WeakMap ngăn mọi memory leak"     | Chỉ ngăn leak từ MAP's reference — strong refs khác vẫn giữ object | WeakMap giúp khi nó là reference DUY NHẤT còn lại      |
| Dùng string/number làm WeakMap key | WeakMap keys PHẢI là objects — primitives throw TypeError          | Dùng Map cho primitive keys                            |
| "Dùng WeakMap cho mọi thứ"         | Không iterate được, không biết size                                | Dùng Map khi cần liệt kê; WeakMap khi cần auto-cleanup |

**🎯 Interview Pattern:**

- **Trigger**: "WeakMap", "memory leak", "Map vs WeakMap", "private data"
- **Concept**: "Weak = quên được" — GC được phép quên
- **Opening**: "WeakMap holds weak references to its keys — when no other reference to the key exists, the entry becomes eligible for GC automatically. This prevents memory leaks in caching scenarios. The trade-off: WeakMap is not iterable and has no `.size`."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Memory Management](./13-memory-management.md) — GC mark-and-sweep, reachability
- ➡️ Để hiểu: React/framework internals — Fiber tree uses WeakMap-like patterns

---

### 3. Proxy & Reflect / Proxy & Phản Chiếu

> 🧠 **Memory Hook**: "**Proxy = vệ sĩ vô hình**" — đứng giữa code và object, intercept mọi operation, có thể sửa/validate/log mà caller không biết

**Tại sao tồn tại?**

`Object.defineProperty()` (Vue 2) chỉ intercept get/set trên **existing properties**. Thêm
property mới → không reactive. Delete → không detect. Array index → hack workaround.

→ **Tại sao?** Vì `defineProperty` hoạt động ở **property level** — phải khai báo từng property.
Proxy hoạt động ở **object level** — intercept MỌI operation bao gồm property chưa tồn tại.

→ **Tại sao?** Vì đây là metaprogramming cốt lõi: khả năng **thay đổi hành vi mặc định** của
language operations. Proxy là API duy nhất cho phép điều này hoàn chỉnh.

#### Layer 1: Analogy / Liên Tưởng

Proxy giống **vệ sĩ vô hình** trước cửa nhà. Mọi người đến thăm (access property) phải qua
vệ sĩ trước. Vệ sĩ có thể: kiểm tra giấy tờ (validation), ghi sổ (logging), từ chối (throw
error), dẫn đến phòng khác (redirect). Khách không biết vệ sĩ tồn tại.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```
Proxy intercepts "traps" — 13 operations:

  Code                     Trap triggered
  ─────────────────        ──────────────
  proxy.name               get(target, prop, receiver)
  proxy.name = 'A'         set(target, prop, value, receiver)
  delete proxy.name        deleteProperty(target, prop)
  'name' in proxy          has(target, prop)
  Object.keys(proxy)       ownKeys(target)
  new proxy()              construct(target, args, newTarget)
  proxy()                  apply(target, thisArg, args)
  ...và 6 traps khác

  Reflect mirror mỗi Proxy trap — cung cấp "default behavior":
  get trap default   →  Reflect.get(target, prop, receiver)
  set trap default   →  Reflect.set(target, prop, value, receiver)
  Dùng Reflect trong traps để forward operation sau custom logic.
```

```javascript
// ✅ Validation proxy — type-safe object
function createValidated(schema) {
  return new Proxy(
    {},
    {
      set(target, prop, value) {
        if (!(prop in schema)) {
          throw new Error(`Unknown property: ${prop}`);
        }
        if (typeof value !== schema[prop]) {
          throw new TypeError(`${prop} must be ${schema[prop]}, got ${typeof value}`);
        }
        return Reflect.set(target, prop, value);
      },
    },
  );
}

const user = createValidated({ name: "string", age: "number" });
user.name = "Alice"; // ✅
user.age = "thirty"; // ❌ TypeError: age must be number

// ✅ Reactive system (simplified Vue 3)
function reactive(obj) {
  const subscribers = new Map(); // prop → Set of effects

  return new Proxy(obj, {
    get(target, prop, receiver) {
      // TRACK: ghi nhớ effect nào đang đọc property này
      if (activeEffect) {
        if (!subscribers.has(prop)) subscribers.set(prop, new Set());
        subscribers.get(prop).add(activeEffect);
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      // TRIGGER: thông báo tất cả effects phụ thuộc
      if (subscribers.has(prop)) {
        subscribers.get(prop).forEach((effect) => effect());
      }
      return result;
    },
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
    },
  });
}

const arr = createNegativeArray([1, 2, 3, 4, 5]);
arr[-1]; // 5
arr[-2]; // 4
```

#### Layer 3: Edge Cases / Trường Hợp Biên

- **Performance**: Proxy có overhead mỗi operation (~2-5x chậm hơn). Không dùng trong hot loops
- **`this` trong methods**: Method trên proxied object nhận `this` = Proxy, không phải target. Dùng `receiver` qua `Reflect.get`
- **Không polyfill được**: Proxy là language-level feature
- **Revocable proxy**: `Proxy.revocable()` tạo proxy có thể tắt vĩnh viễn

**❌ Common Mistakes / Sai Lầm Thường Gặp:**

| Sai lầm                            | Tại sao sai                                                                          | Đúng là                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| "Proxy = defineProperty"           | defineProperty chỉ intercept get/set known properties; Proxy intercept MỌI operation | Proxy mạnh hơn: 13 traps vs 2                     |
| Quên dùng `Reflect` trong traps    | `return target[prop]` phá prototype chain và receiver binding                        | Luôn dùng `Reflect.get/set`                       |
| Dùng Proxy trong hot loops         | Mỗi get/set đi qua function call — 2-5x overhead                                     | Cache values bên ngoài Proxy                      |
| "Proxy thay TypeScript validation" | Proxy = runtime; TS = compile-time — khác mục đích                                   | TS cho static check, Proxy cho runtime invariants |

**🎯 Interview Pattern:**

- **Trigger**: "Proxy", "Reflect", "Vue 3 reactivity", "metaprogramming"
- **Concept**: "Vệ sĩ vô hình" — intercept all object operations
- **Opening**: "Proxy creates a wrapper that intercepts fundamental operations — get, set, delete, `in`, and 10 more traps. This is Vue 3's reactivity foundation, replacing `Object.defineProperty` because Proxy detects dynamic property additions and deletions. Reflect provides the default behavior for each trap."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Prototypes](./06-prototypes-inheritance.md) — Proxy receiver liên quan đến prototype chain `this` binding
- ➡️ Để hiểu: Vue 3 reactivity, Immer.js copy-on-write, MobX observable

---

## Interview Q&A / Hỏi Đáp Phỏng Vấn

### Q1: Debounce vs throttle — khi nào dùng cái nào? 🟢 Junior

**A:**

- **Debounce**: Chờ user ngừng hành động rồi mới chạy. Dùng cho search input (chỉ cần kết quả cuối),
  form validation (chờ user gõ xong), resize handler (chỉ cần kích thước cuối).
- **Throttle**: Chạy đều đặn mỗi N ms. Dùng cho scroll event (cần visual feedback liên tục),
  analytics tracking (sample đều đặn), infinite scroll trigger.

**Rule**: Cần **kết quả cuối cùng** → debounce. Cần **sample đều đặn** → throttle. Cần **visual smoothness** → `requestAnimationFrame`.

💡 **Interview Signal:** ✅ Strong: Phân biệt use case rõ, đề cập rAF cho visual | ❌ Weak: "Giống nhau, chỉ khác timing"

---

### Q2: WeakMap vs Map — khi nào dùng WeakMap? 🟢 Junior

**A:** Dùng WeakMap khi: (1) keys là objects mà lifecycle bạn không control, (2) không cần iterate entries, (3) auto-cleanup quan trọng hơn khả năng liệt kê.

```javascript
// ❌ Map: memory leak khi element bị remove
const cache = new Map();
cache.set(element, data); // element bị remove nhưng cache giữ reference

// ✅ WeakMap: auto-cleanup
const cache = new WeakMap();
cache.set(element, data); // element bị remove → cache entry tự GC
```

💡 **Interview Signal:** ✅ Strong: DOM cache example, giải thích GC behavior | ❌ Weak: Chỉ nói "ngăn memory leak" không giải thích cách nào

---

### Q3: Implement debounce với cancel và leading/trailing. 🟡 Mid

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

**Key points**: `leading: true` fire ngay lần đầu (tốt cho button), `trailing: true` fire sau im lặng (tốt cho search). `cancel()` cần trong React useEffect cleanup. `flush()` ép thực thi ngay — hữu ích trước navigation.

💡 **Interview Signal:** ✅ Strong: cancel/flush, leading vs trailing, React cleanup | ❌ Weak: Basic version không cancel

---

### Q4: So sánh debounce, throttle, và requestAnimationFrame cho scroll. 🟡 Mid

**A:**

| Approach | Pattern                   | Best For                          |
| -------- | ------------------------- | --------------------------------- |
| Debounce | Sau khi ngừng scroll      | Lưu vị trí bookmark               |
| Throttle | Mỗi N ms                  | Analytics tracking, lazy load     |
| rAF      | 1 lần/frame (~16ms@60fps) | Visual updates (parallax, sticky) |

```javascript
// ❌ Debounce cho visual → UI đóng băng rồi nhảy
const onScroll = debounce(() => {
  header.style.transform = `translateY(${window.scrollY}px)`;
}, 100); // User thấy: ... ... NHẢY

// ✅ rAF cho visual → smooth 60fps
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      header.style.transform = `translateY(${window.scrollY}px)`;
      ticking = false;
    });
    ticking = true;
  }
});
```

**Decision rule**: Output là VISUAL → rAF. Output là DATA → throttle. Chỉ cần KẾT QUẢ CUỐI → debounce.

💡 **Interview Signal:** ✅ Strong: Giải thích khi nào mỗi cái SAI, rAF pattern với `ticking` flag | ❌ Weak: Chỉ giải thích mỗi cái mà không so sánh

---

### Q5: Giải thích Proxy hoạt động thế nào. Vue 3 dùng nó cho reactivity ra sao? 🟡 Mid

**A:** Proxy wrap object, intercept operations qua "traps" (13 traps). Vue 3 dùng `get` trap để **track** (ghi nhớ effect nào đọc property nào) và `set` trap để **trigger** (chạy lại effects khi giá trị thay đổi).

| Feature         | Object.defineProperty (Vue 2) | Proxy (Vue 3)                     |
| --------------- | ----------------------------- | --------------------------------- |
| New property    | ❌ Cần `Vue.set()`            | ✅ Tự động                        |
| Delete property | ❌ Cần `Vue.delete()`         | ✅ `deleteProperty` trap          |
| Array index     | ❌ Hack với splice            | ✅ `set` trap bắt được            |
| Performance     | Define tất cả props trước     | Lazy — chỉ intercept khi accessed |

💡 **Interview Signal:** ✅ Strong: Track/trigger pattern, Vue 2 vs 3 với limitations cụ thể | ❌ Weak: Chỉ giải thích API mà không kết nối framework

---

### Q6: Implement deep reactive Proxy xử lý nested objects. 🔴 Senior

**A:** Challenge: `reactive({ user: { name: 'Alice' } })` — access `state.user.name` trigger get cho `user`, nhưng inner object chưa được wrap. Cần **lazy wrapping**.

```javascript
const reactiveMap = new WeakMap(); // tránh re-wrap cùng object

function deepReactive(obj) {
  if (reactiveMap.has(obj)) return reactiveMap.get(obj);

  const proxy = new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      // Lazy wrap nested objects — chỉ khi accessed
      if (value !== null && typeof value === "object") {
        return deepReactive(value);
      }
      track(target, prop);
      return value;
    },
    set(target, prop, value, receiver) {
      const oldValue = target[prop];
      const result = Reflect.set(target, prop, value, receiver);
      if (oldValue !== value) trigger(target, prop);
      return result;
    },
  });

  reactiveMap.set(obj, proxy);
  return proxy;
}

// Design decisions:
// 1. WeakMap cache → ngăn infinite recursion với circular refs
// 2. Lazy wrapping → chỉ tạo Proxy khi property được ĐỌC
// 3. Old vs new check → tránh trigger không cần thiết
```

**Follow-up Chain:**

1. "Làm sao handle `Array.push` trong reactive proxy?" → Override `.push` method hoặc detect `length` change trong set trap
2. "Performance concern với deep nesting?" → Lazy wrapping giải quyết — chỉ wrap khi đọc, không wrap toàn bộ upfront
3. "Circular reference protection?" → WeakMap cache ngăn tạo nhiều proxy cho cùng object

💡 **Interview Signal:** ✅ Strong: WeakMap memoization, lazy wrapping, circular ref protection | ❌ Weak: Wrap tất cả eagerly, không memoize

---

### Q7: Design một event listener system không bị memory leak ở scale lớn. 🔴 Senior

**A:**

```javascript
class EventBus {
  #listeners = new Map(); // event → Set<WeakRef<callback>>
  #registry = new FinalizationRegistry(({ event, ref }) => {
    const set = this.#listeners.get(event);
    if (set) {
      set.delete(ref);
      if (set.size === 0) this.#listeners.delete(event);
    }
  });

  on(event, callback) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    const ref = new WeakRef(callback);
    this.#listeners.get(event).add(ref);
    this.#registry.register(callback, { event, ref });
    return () => this.off(event, ref); // return unsubscribe function
  }

  emit(event, ...args) {
    const set = this.#listeners.get(event);
    if (!set) return;
    for (const ref of set) {
      const callback = ref.deref();
      if (callback) callback(...args);
      else set.delete(ref); // cleanup dead refs
    }
  }

  off(event, ref) {
    this.#listeners.get(event)?.delete(ref);
  }
}
```

**Key design**: WeakRef cho callbacks + FinalizationRegistry cho auto-cleanup = no memory leaks dù quên unsubscribe.

**Follow-up Chain:**

1. "WeakRef + FinalizationRegistry có reliable không?" → FinalizationRegistry không guarantee timing — luôn cung cấp manual `off()` method
2. "Scale considerations?" → Map → Set → WeakRef là O(1) lookup; emit O(n) với n = listeners cho event đó
3. "Production alternative?" → Phần lớn production code dùng manual cleanup (AbortController pattern) thay vì WeakRef vì reliability

💡 **Interview Signal:** ✅ Strong: WeakRef + FinalizationRegistry, manual cleanup fallback | ❌ Weak: Chỉ dùng Map/Set không xử lý GC

---

### Q8: Production memoize function với LRU cache. 🔴 Senior

**A:**

```javascript
function memoizeLRU(fn, maxSize = 100) {
  const cache = new Map(); // Map giữ insertion order

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key); // xóa
      cache.set(key, value); // insert lại cuối (most recent)
      return value;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    if (cache.size > maxSize) {
      const oldest = cache.keys().next().value;
      cache.delete(oldest); // evict least recently used
    }

    return result;
  };
}
```

**Caveats**: `JSON.stringify` không handle circular refs, functions, `undefined`. Production dùng WeakMap cho object args hoặc custom serializer.

**Follow-up Chain:**

1. "JSON.stringify limitation?" → Không handle circular refs, functions, Symbol, undefined, Map/Set. Production dùng custom hash function
2. "WeakMap cho memoize?" → WeakMap key phải là object — dùng cho single-object-arg memoize, không dùng cho multi-arg
3. "TTL-based cache thay LRU?" → Thêm `timestamp` field, check trong get — `Date.now() - entry.time > ttl`

💡 **Interview Signal:** ✅ Strong: LRU eviction, JSON.stringify limitations, WeakMap alternative | ❌ Weak: Basic memoize không cache limit

---

## Interview Q&A Summary / Tổng Kết Q&A

| #   | Topic                       | Difficulty | Key Concept                               |
| --- | --------------------------- | ---------- | ----------------------------------------- |
| Q1  | Debounce vs throttle        | 🟢         | Elevator door vs traffic light            |
| Q2  | WeakMap vs Map              | 🟢         | GC auto-cleanup, DOM cache                |
| Q3  | Implement debounce          | 🟡         | cancel/flush, leading/trailing            |
| Q4  | Debounce vs throttle vs rAF | 🟡         | Visual=rAF, data=throttle, final=debounce |
| Q5  | Proxy + Vue 3 reactivity    | 🟡         | Track/trigger, Vue 2 vs 3                 |
| Q6  | Deep reactive Proxy         | 🔴         | Lazy wrapping, WeakMap memoization        |
| Q7  | Event system no leak        | 🔴         | WeakRef + FinalizationRegistry            |
| Q8  | Memoize with LRU            | 🔴         | Map insertion order, eviction             |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"What is a Proxy in JavaScript and when would you use one?"**

**30 giây đầu:**

1. "A Proxy wraps an object and intercepts fundamental operations through traps — 13 traps covering get, set, delete, `in` operator, and more."
2. "The most prominent use is Vue 3's reactivity: `get` trap tracks dependencies, `set` trap triggers re-computation when values change."
3. "Compared to Vue 2's `Object.defineProperty`, Proxy detects dynamic property additions, deletions, and array index mutations automatically."
4. "Trade-off: ~2-5x overhead per operation and no polyfill, so best for framework-level reactivity rather than hot-loop processing."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu. Trả lời từng câu, mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                 |
| --- | -------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết implement `debounce` từ trí nhớ (với `cancel`). Giải thích leading vs trailing bằng 1 câu mỗi cái. |
| 2   | 🎨 Visual      | Vẽ timeline diagram debounce vs throttle: user gõ 5 ký tự liên tục, delay 300ms.                        |
| 3   | 🛠️ Application | Component mount/unmount liên tục. `Map` cache metadata → memory leak. Fix bằng gì? Viết code.           |
| 4   | 🐛 Debug       | `new Proxy(obj, { get(t,p) { return t[p] } })` — tại sao không nên `t[p]` mà nên `Reflect.get()`?       |
| 5   | 🎓 Teach       | Giải thích WeakMap cho junior dùng ví dụ "thẻ từ ra vào văn phòng".                                     |

> 🎯 **Feynman Prompt:** Giải thích debounce vs throttle bằng ví dụ cửa thang máy vs đèn giao thông. Không dùng thuật ngữ kỹ thuật.

🔁 **Spaced Repetition:** Review lại sau 3 ngày → 7 ngày → 14 ngày.

---

## 🔗 Connections / Liên Kết

### Cùng track

- [Closures](./04-closures.md) — closures power debounce/throttle/memoize
- [ES6+ Features](./08-es6-features.md) — Proxy/Reflect, WeakMap/WeakSet
- [Memory Management](./13-memory-management.md) — GC deep dive, WeakRef

---

## Study Cases / Tình Huống Thực Tế Sâu (Block C)

### Case: Lazada — Debounce Implementation Without Cleanup Leaked Timers on Unmount

**Situation:** Lazada's search bar used a custom debounce for API calls. Memory profiler showed `setTimeout` handles accumulating even after the search component unmounted — each remount created a new debounced function but the old timers from previous instances were never cancelled.

**What went wrong:**
```javascript
// Custom debounce — no way to cancel:
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// In React component:
const debouncedSearch = useMemo(() => debounce(search, 300), []); // created once
// ← But if search prop changes, old debounced fn has stale closure over old search
// ← On unmount: timer still running, fn call on unmounted component → React warning
```

**Decision made:** Extended debounce to return a `cancel()` function, used in `useEffect` cleanup:
```javascript
function debounce(fn, delay) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer); // ← explicit cancel
  return debounced;
}

useEffect(() => {
  const debounced = debounce(search, 300);
  inputRef.current.addEventListener('input', debounced);
  return () => {
    debounced.cancel(); // ✅ cancel pending timer on unmount
    inputRef.current.removeEventListener('input', debounced);
  };
}, [search]);
```

**Trade-off accepted:** Adopted `lodash.debounce` (already in bundle) which includes `.cancel()` and `.flush()` — eliminated custom implementation entirely.

**Lesson:** Any closure that creates timers or holds external references needs an explicit teardown path. In React, this means `useEffect` cleanup. The advanced concepts (closures, WeakRef, timer management) are most valuable when you understand how they compose with component lifecycle.

---

## Cross-Track / Liên Kết Chéo

- 🔗 **BE perspective**: [Go Advanced Patterns](../../be-track/01-golang/08-advanced-patterns.md) — Go implements similar patterns: WeakRef via finalizers, Proxy via interface wrappers, generators via channels + goroutines
- 🔗 **FE — React**: [React Performance](../03-react/09-performance-optimization.md) — debounce/throttle prevent over-rendering; memoization with `useMemo`/`useCallback`
- 🔗 **FE — Patterns**: [React Patterns](../03-react/04-advanced-patterns.md) — Proxy enables transparent reactivity (Vue uses it); memoization is core to React render optimization
- 🔗 **Shared theory**: [Software Engineering Patterns](../../shared/05-software-engineering/01-solid-and-design-patterns.md) — Proxy, Observer, Decorator patterns in JS; Iterator protocol (for...of) = Iterator design pattern
