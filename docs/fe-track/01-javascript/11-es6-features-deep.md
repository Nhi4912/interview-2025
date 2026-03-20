# ES6+ Features — Deep Dive / ES6+ Tính Năng Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [ES6 Features](./07-es6-features.md)
> **See also**: [Scope & Hoisting](./02-scope-hoisting-comprehensive.md) | [Advanced Concepts](./08-advanced-concepts.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki.vn product catalog:** API trả về deeply nested object — `data.attributes.pricing.vnd.amount`. Trước kia: `const amount = data && data.attributes && data.attributes.pricing && ...` — 5 dòng, dễ crash. Sau khi dùng optional chaining + destructuring: `const { attributes: { pricing: { vnd: { amount = 0 } = {} } = {} } = {} } = data`. Nhưng đúng là destructuring sâu như vậy cũng gây confusion. Giải pháp tốt hơn: `const amount = data?.attributes?.pricing?.vnd?.amount ?? 0`.

**Bài học:** ES6+ features không phải để "viết ít dòng hơn" — chúng giải quyết những vấn đề cụ thể. Biết khi nào dùng Proxy cho validation, khi nào dùng WeakMap cho private data, khi nào dùng Symbol cho unique keys — đó là sự khác biệt giữa Junior và Senior JavaScript.

## What & Why / Cái Gì & Tại Sao

**Analogy:** ES6+ features như bộ công cụ chuyên dụng của thợ mộc: destructuring = thước đo kết hợp (đo + đánh dấu cùng lúc), Symbol = serial number độc nhất không thể giả mạo, Proxy = guard đứng trước đối tượng kiểm tra mọi thao tác, WeakMap = tủ khóa với key tự xóa khi chủ nhân biến mất.

**Scope của doc này:** Không cover arrow functions/classes/modules (xem [07-es6-features.md](./07-es6-features.md)). Focus vào: Destructuring nâng cao, Symbols, Collections (Map/Set/WeakMap/WeakSet), Proxy/Reflect, và modern operators (??, ?., ??=).

## Concept Map / Bản Đồ Khái Niệm

```
[ES6+ Advanced Features]
        │
        ├── Destructuring ──────── Extract data from arrays/objects cleanly
        │       ├── Default values         { age = 18 }
        │       ├── Rename on extract      { name: firstName }
        │       ├── Rest in destructuring  { a, ...rest }
        │       └── Parameter destructuring function({ name, age })
        │
        ├── Symbols ────────────── Unique, non-enumerable property keys
        │       ├── Symbol() ≠ Symbol()    guaranteed unique
        │       ├── Well-known symbols     Symbol.iterator, Symbol.toPrimitive
        │       └── Symbol.for('key')      global registry (shared across modules)
        │
        ├── Collections ────────── Purpose-built data structures
        │       ├── Map    → any-type keys, ordered, iterable, .size
        │       ├── Set    → unique values, fast has(), iterable
        │       ├── WeakMap → weak refs to objects (GC-able), no iteration
        │       └── WeakSet → weak refs to objects, membership test only
        │
        ├── Proxy/Reflect ──────── Intercept object operations
        │       ├── get/set traps          validation, logging, virtual props
        │       ├── Reflect.*              default behavior mirror for traps
        │       └── Use cases: reactive systems (Vue 3), mock frameworks
        │
        └── Modern Operators
                ├── ??   (nullish coalescing)  → only null/undefined triggers
                ├── ?.   (optional chaining)   → short-circuit on null/undefined
                └── ??=  (nullish assignment)  → assign only if null/undefined
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Destructuring — Pattern Matching for Data

**🧠 Memory Hook:** "**Destructuring is a pattern, not just syntax** — the left side is a template that the right side must match"

**Why does this exist? / Tại sao tồn tại?**

- Why was extracting data from objects tedious before ES6? Because `const name = user.name; const age = user.age; const city = user.address.city;` — three lines of repetitive property access for three values
- Why is destructuring more than just shorthand? Because it's declarative pattern matching — you describe the shape of data you expect, not the imperative steps to extract it
- Why does this matter for function parameters? Parameter destructuring lets callers see exactly what a function needs — `function render({ title, body, tags = [] })` is self-documenting

**Definition:** Destructuring is a JavaScript expression that unpacks values from arrays or properties from objects into distinct variables. It uses pattern matching: the left-hand side describes the shape; the right-hand side must match that shape.

**Visual — Destructuring Patterns:**

```javascript
// Object destructuring patterns:
const { a }           = obj    // extract a
const { a: x }        = obj    // extract a, rename to x
const { a = 10 }      = obj    // extract a, default 10 if undefined
const { a: x = 10 }   = obj    // extract a → x, default 10
const { a, ...rest }  = obj    // extract a, rest = remaining props

// Array destructuring:
const [first, , third] = arr   // skip index 1
const [head, ...tail]  = arr   // head + rest as array
const [a = 0, b = 0]  = arr   // defaults for missing indices

// Nested (use sparingly — readability cost):
const { address: { city } } = user  // city from user.address.city

// Parameter destructuring (self-documenting API):
function fetchUser({ id, fields = ['name', 'email'] }) { ... }
fetchUser({ id: 42 })  // caller sees what's needed
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `const { address: { city } } = user` crashes if `user.address` is undefined | `const { address: { city } = {} } = user` — provide default for intermediate |
| Deeply nested destructuring (3+ levels) | Use optional chaining instead: `user?.address?.city ?? ''` |
| Forgetting that rename and default can combine | `const { name: firstName = 'Anonymous' } = user` is valid |
| `const [a, b] = obj` (destructuring object as array) | Array destructuring on objects only works if object is iterable (`Symbol.iterator`) |

**🎯 Interview Pattern:**
- **Trigger**: "clean up this data extraction" / "function parameters" / "API response parsing"
- **Concept**: Destructuring as pattern matching — default values, renaming, rest
- **Opening**: "Destructuring isn't just syntax sugar — it's pattern matching. The left side is the template: I can rename, provide defaults, and collect rest properties. For function parameters, it makes the API self-documenting..."

**🔑 Knowledge Chain:**
- **Prereq**: Object/array property access, `undefined` as default missing-value
- **Enables**: Clean React props extraction (`function Button({ label, onClick, disabled = false })`), clean API response parsing, rest/spread patterns

---

### 2. Symbols & Collections (Map / Set / WeakMap / WeakSet)

**🧠 Memory Hook:** "**Symbol = guaranteed unique key. Map = object where keys can be anything. WeakMap = Map that doesn't prevent garbage collection.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need Symbol when we have strings? Because string keys can clash between libraries — `obj['id']` might conflict if two systems both add `id`. `Symbol('id')` is unique even if two different Symbols have the same description
- Why do we need Map when we have plain objects? Because object keys are always strings/symbols — Map allows any value as key (DOM nodes, functions, objects), maintains insertion order, and has `.size` built in
- Why do we need WeakMap/WeakSet? Because sometimes you want to associate metadata with an object without preventing garbage collection — if the object is no longer referenced elsewhere, WeakMap lets it be GC'd automatically

**Definition:**
- **Symbol**: A unique, immutable primitive value. No two Symbols are equal — `Symbol('x') !== Symbol('x')`. Used as non-enumerable, collision-free property keys.
- **Map**: Key-value store where keys can be any type. Ordered by insertion. Better performance than plain objects for frequent add/delete.
- **Set**: Collection of unique values. `has()` is O(1). Ideal for deduplication and membership testing.
- **WeakMap/WeakSet**: Like Map/Set but keys (WeakMap) or values (WeakSet) must be objects and are held weakly — they don't prevent GC of those objects.

**Visual — When to use which:**

```
Data Structure     Key type      Iterable?  Prevents GC?  Best use case
─────────────────────────────────────────────────────────────────────────
Object {}          string/Symbol  Yes        Yes           Simple records, JSON-compatible
Map                Any            Yes        Yes           Dynamic keys, non-string keys
Set                —              Yes        Yes           Unique value collections, fast dedup
WeakMap            Object only    NO         NO            Private data per object, caches
WeakSet            Object only    NO         NO            "Has this object been processed?"

Symbol                                                     Collision-free property keys
Symbol.for('key')  ← global registry — same key → same Symbol across modules
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Using `{}` with numeric keys | Use `Map` — object coerces numeric keys to strings (`obj[1]` → `obj['1']`) |
| `Array.from(new Set(arr))` is all you know about Set | Set is O(1) for `has()` — use it for fast membership tests, not just dedup |
| Using WeakMap when you need to iterate | WeakMap has no `.keys()`, `.values()`, `.forEach()` — use Map if you need iteration |
| Creating Symbol without using it as a key | Symbol as string description is useless — its value is being a unique key `obj[mySymbol] = value` |
| `Symbol.for('id') === Symbol.for('id')` is false | `Symbol.for()` returns the SAME symbol from global registry — it IS true ✓ |

**🎯 Interview Pattern:**
- **Trigger**: "deduplication" / "private properties" / "cache that doesn't cause memory leaks" / "non-string keys"
- **Concept**: Map/Set for data structures; WeakMap for metadata without GC interference
- **Opening**: "I'd use a Set here for O(1) deduplication. If I need to attach metadata to DOM nodes without preventing GC when those nodes are removed — that's exactly what WeakMap is designed for..."

**🔑 Knowledge Chain:**
- **Prereq**: Object property access, Garbage Collection basics
- **Enables**: Private class fields (WeakMap pattern pre-#fields), Vue/MobX reactivity (WeakMap for reactive metadata), memoization without memory leaks

---

### 3. Proxy & Reflect — Metaprogramming Layer

**🧠 Memory Hook:** "**Proxy = security guard in front of an object. Reflect = the same guard's rulebook for default behavior.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need to intercept object operations? Because sometimes you want to add cross-cutting behavior (validation, logging, reactivity) without modifying every property setter individually
- Why wasn't `Object.defineProperty` enough? Because it's per-property and doesn't cover operations like `in`, `delete`, function calls, or prototype access — Proxy covers all 13 operation types
- Why does Reflect exist alongside Proxy? Because inside a trap, you need a way to invoke the default behavior. `Reflect.get(target, key, receiver)` is exactly what would have happened without the Proxy — it's the "pass through" mechanism

**Definition:** `Proxy` wraps an object and intercepts fundamental operations (get, set, delete, has, apply...) via "traps". `Reflect` provides static methods mirroring those same operations — used inside traps to invoke default behavior.

**Visual — Proxy Architecture:**

```javascript
const target = { price: 100 }

const handler = {
  get(target, key, receiver) {
    console.log(`Reading: ${key}`)
    return Reflect.get(target, key, receiver)  // ← default behavior
  },
  set(target, key, value, receiver) {
    if (key === 'price' && value < 0) throw new Error('Price cannot be negative')
    return Reflect.set(target, key, value, receiver)  // ← default behavior
  }
}

const product = new Proxy(target, handler)
product.price        // logs "Reading: price", returns 100
product.price = -10  // throws Error
product.price = 200  // OK — sets via Reflect.set

// Vue 3 reactivity is built entirely on Proxy:
// reactive(obj) = new Proxy(obj, { get: track, set: trigger })
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Calling `target[key]` inside a `get` trap instead of `Reflect.get(target, key, receiver)` | `Reflect.get` preserves the correct `receiver` for prototype chain lookups |
| Forgetting that Proxy intercepts prototype chain operations too | `'key' in proxied` calls `has` trap — if no `has` trap, falls through to target |
| Using Proxy for simple validation on one property | `Object.defineProperty` with a setter is simpler for one property; Proxy is for cross-cutting |
| Thinking Proxy can wrap primitive values | Proxy only works with objects and functions — primitives are values, not references |

**🎯 Interview Pattern:**
- **Trigger**: "validation on every property" / "Vue reactivity system" / "mock/spy on objects" / "computed properties"
- **Concept**: Proxy traps + Reflect for default behavior
- **Opening**: "Proxy lets you intercept any operation on an object — get, set, delete, even function calls. Vue 3's reactivity is a Proxy with a `get` trap that tracks dependencies and a `set` trap that triggers re-renders. Inside traps, I use Reflect to invoke the default behavior and preserve the prototype chain correctly..."

**🔑 Knowledge Chain:**
- **Prereq**: Object property descriptors, Prototype chain
- **Enables**: Vue 3 reactivity (`reactive()`), test doubles (object mocking), validation DSLs, virtual/lazy-loading objects

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What's the difference between `??` (nullish coalescing) and `||` (logical OR)? 🟢 Junior

**A:** `||` triggers on any falsy value: `false`, `0`, `''`, `null`, `undefined`, `NaN`. `??` triggers only on `null` or `undefined`. This matters when `0` or `''` are valid values:

```javascript
const port = config.port || 3000  // BUG: port=0 → uses 3000 (0 is falsy)
const port = config.port ?? 3000  // CORRECT: port=0 → uses 0
```

`??` được thiết kế cho "not set" (null/undefined), không phải "falsy". Khi `0` hoặc `''` là giá trị hợp lệ, phải dùng `??`. `||` chỉ dùng khi muốn fallback cho bất kỳ falsy value nào.

**💡 Interview Signal:**
- ✅ Strong: Names the exact falsy values that differ (`0`, `''`, `false`, `NaN`), gives concrete `port = 0` bug example
- ❌ Weak: "?? is safer than ||" — vague, doesn't explain when || is appropriate

---

### Q: When would you use `Map` instead of a plain object `{}`? 🟢 Junior

**A:** Use `Map` when: (1) keys are not strings (DOM nodes, objects, functions as keys); (2) you need ordered iteration by insertion order; (3) you frequently add/delete entries (Map is optimized for dynamic size); (4) you need `.size` without `Object.keys().length`. Use plain objects for static records and JSON serialization (Map doesn't serialize to JSON).

Dùng Map khi keys không phải string, cần ordered iteration, hoặc frequent add/delete. Plain object khi cần JSON serialization hoặc key luôn là string. Nguyên tắc: API response → object; dynamic lookup table → Map.

**💡 Interview Signal:**
- ✅ Strong: Non-string keys, ordered iteration, `.size`, serialization limitation
- ❌ Weak: "Map is better than objects" — oversimplification ignoring trade-offs

---

### Q: What is a `WeakMap` and what problem does it solve? 🟡 Mid

**A:** WeakMap holds object keys *weakly* — if the key object has no other references, it can be garbage collected even while still in the WeakMap. This solves the memory leak problem of caching per-object data:

```javascript
// PROBLEM with Map: prevents GC
const cache = new Map()
cache.set(domNode, computedData)  // domNode removed from DOM, but Map keeps it alive

// SOLUTION with WeakMap: allows GC
const cache = new WeakMap()
cache.set(domNode, computedData)  // domNode removed from DOM → GC'd → entry auto-removed
```

WeakMap không iterable (không có `.keys()`, `.forEach()`) vì GC timing là non-deterministic — bạn không thể biết khi nào entry bị xóa.

**💡 Interview Signal:**
- ✅ Strong: Explains GC prevention by Map vs GC-safe WeakMap, mentions non-iterability and why, gives DOM node example
- ❌ Weak: "WeakMap is like Map but weaker" — circular definition, no GC explanation

---

### Q: How does `Symbol.iterator` work and how would you implement it? 🟡 Mid

**A:** `Symbol.iterator` is a well-known Symbol that marks a method as the default iterator for an object. The `for...of` loop, spread operator, and destructuring all call `[Symbol.iterator]()` which must return an iterator object with a `next()` method.

```javascript
const range = {
  from: 1, to: 5,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}
console.log([...range])  // [1, 2, 3, 4, 5]
for (const n of range) console.log(n)  // 1 2 3 4 5
```

`Symbol.iterator` là "well-known symbol" — JS engine tìm nó để biết "object này có iterable không". Tự implement để làm custom data structure work với `for...of`, spread, destructuring.

**💡 Interview Signal:**
- ✅ Strong: Explains the protocol (iterator object + `next()` returning `{value, done}`), knows which operators call it
- ❌ Weak: "Symbol.iterator makes things iterable" — needs to explain the protocol with `next()` and `{value, done}`

---

### Q: Explain how Vue 3's reactivity system uses Proxy. What are the limitations? 🔴 Senior

**A:** Vue 3's `reactive()` wraps objects in a Proxy with two key traps:
- **`get` trap**: calls `track(target, key)` — registers the currently-running effect (component render/computed) as a subscriber to this property
- **`set` trap**: calls `trigger(target, key)` after setting the new value — notifies all subscribers to re-run

```javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)              // subscribe current effect
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)           // notify subscribers
      return result
    }
  })
}
```

**Limitations:** (1) Proxy cannot intercept direct array index mutation via `arr[0] = x` in some edge cases; (2) non-reactive primitives — `let count = reactive(0)` doesn't work (Proxy needs an object), hence `ref()` wraps primitives in `{ value }` object; (3) destructuring breaks reactivity — `const { count } = reactive(state)` copies the primitive value, losing the Proxy

Vue 3 reactive là Proxy với `get` trap = track (đăng ký subscriber) và `set` trap = trigger (notify). Giới hạn: primitives không wrap được → phải dùng `ref()`. Destructuring phá vỡ reactivity vì copy primitive value ra khỏi Proxy.

**💡 Interview Signal:**
- ✅ Strong: Explains track/trigger pattern in get/set traps, uses Reflect correctly, names 2+ limitations (primitives → ref, destructuring breaks reactivity)
- ❌ Weak: "Vue uses Proxy to detect changes" — correct but shows no depth on the subscribe/notify mechanism or limitations

---

### Q: Design a type-safe validation layer using Proxy for a form object. What are the trade-offs vs Zod/Yup? 🔴 Senior

**A:** Proxy-based validation intercepts property writes at runtime:

```javascript
function createValidated(schema) {
  const state = {}
  const errors = {}
  return new Proxy(state, {
    set(target, key, value) {
      const rule = schema[key]
      if (rule && !rule.validate(value)) {
        errors[key] = rule.message
        return true  // don't throw — store error
      }
      delete errors[key]
      return Reflect.set(target, key, value)
    },
    get(target, key) {
      if (key === '_errors') return errors
      return Reflect.get(target, key)
    }
  })
}

const form = createValidated({
  email: { validate: v => /\S+@\S+/.test(v), message: 'Invalid email' }
})
form.email = 'notvalid'
form._errors  // { email: 'Invalid email' }
```

**Trade-offs vs Zod/Yup:**
- Proxy: runtime interception, no schema serialization, harder to compose rules, no TypeScript inference from schema
- Zod: `.parse()` returns typed result, schema is composable, generates TypeScript types, but validates at point-in-time not continuously
- Use Proxy for reactive form validation (continuous); use Zod at API boundaries (parse once, trust everywhere)

Proxy validation tốt cho reactive forms (validate real-time mỗi keystroke). Zod tốt hơn ở API boundary (parse một lần, TypeScript type từ schema). Kết hợp: Zod để parse API response + Proxy để live validation trong form state.

**💡 Interview Signal:**
- ✅ Strong: Implements Proxy with `_errors` side channel, compares Proxy vs Zod trade-offs, knows when to use each
- ❌ Weak: "Just use Zod" — misses the question about Proxy design; or "Proxy is better" — misses Zod's type inference advantage

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Level | One-liner |
|---|-------|-------|-----------|
| 1 | `??` vs `\|\|` | 🟢 | `??` only falsy on null/undefined — `0` and `''` pass through |
| 2 | Map vs plain object | 🟢 | Non-string keys, ordered, `.size`, dynamic add/delete → Map |
| 3 | WeakMap purpose | 🟡 | Weak refs → GC-able keys; non-iterable because GC timing is non-deterministic |
| 4 | `Symbol.iterator` | 🟡 | Iterator protocol: `next()` returns `{value, done}` — enables `for...of`/spread |
| 5 | Vue 3 Proxy reactivity | 🔴 | get=track, set=trigger; limits: primitives need `ref()`, destructuring breaks reactivity |
| 6 | Proxy validation vs Zod | 🔴 | Proxy for continuous reactive; Zod for typed parse at boundaries — use both |

---

## ⚡ Cold Call Simulation

**Q: "Why can't you do `const { count } = reactive({ count: 0 })` in Vue 3 and then expect `count` to be reactive?"**

**30-second answer:**

"Because `reactive()` returns a Proxy, not a raw object. When you destructure `count` from the Proxy, you're reading the current value — which is a primitive number `0` — and assigning it to a local variable. That local variable has no connection to the Proxy. The Proxy's `get` trap is only triggered when you access the property *through the Proxy object itself*. After destructuring, you've escaped the Proxy — you have a plain `0` that will never update. That's why Vue provides `ref()` for primitives: `ref(0)` wraps the value in `{ value: 0 }`, and since objects are passed by reference, the Proxy wrapping that object stays connected. You access it as `count.value` — awkward, but necessary because JavaScript primitives are values, not references."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: What's the difference between `??` and `||`? Name two cases where they give different results.
- **Visual**: Draw the Map vs Set vs WeakMap decision tree — when does each win?
- **Application**: You're building a form with 10 fields that need real-time validation. Should you use Proxy or Zod? Why?
- **Debug**: A Vue 3 component shows `count` never updates even though you call `count++`. What's the most likely cause?
- **Teach**: Explain to a junior dev why `Symbol('id') !== Symbol('id')` — and when that uniqueness property is actually useful in production code.

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [ES6 Features](./07-es6-features.md) — arrow functions, classes, modules (not covered here)
- ⬅️ **Built on**: [Advanced Concepts](./08-advanced-concepts.md) — Iterators and generators
- 🔗 **Applied in**: [React Patterns](../03-react/08-react-patterns-advanced.md) — WeakMap for component metadata, Symbol for context keys
- 🔗 **Applied in**: [TypeScript](../02-typescript/02-advanced-types.md) — Symbol as unique type brands
