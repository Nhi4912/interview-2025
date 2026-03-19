# Prototypes & Inheritance — Deep Dive / Prototype & Kế Thừa — Chuyên Sâu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures-comprehensive.md) | [Scope & Hoisting](./02-scope-hoisting-comprehensive.md)
> **See also**: [ES6 Features](./11-es6-features-deep.md) | [Advanced Patterns](./17-advanced-patterns-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VNG frontend interview (2023 — ứng viên chia sẻ):**

Interviewer hỏi: *"What happens under the hood when you call `[1,2,3].map(fn)`?"*

Ứng viên: "JavaScript calls the `map` method on the array."

Interviewer: "But where is `map` defined? Is it copied into every array?"

Ứng viên: "...um, it's built-in?" — không biết `map` sống trên `Array.prototype`, shared across ALL arrays via prototype chain.

**Kết quả:** Fail round 1. Câu hỏi tiếp: "How does `class` work under the hood?" — ứng viên nói "như Java" — fail luôn.

**Bài học:** Mọi thứ trong JS dựa trên prototype chain. `class`, `extends`, `instanceof`, method sharing — tất cả là prototype. Biết prototype = hiểu JS từ gốc rễ.

---

## What & Why / Cái Gì & Tại Sao

> 🧠 **Memory Hook**: **Prototype chain = cây gia phả. Tìm property: con → cha → ông → Object.prototype → null. `class` là "giấy khai sinh đẹp hơn" — cùng cơ chế.**

**Tại sao JS dùng prototype (thay vì classical inheritance)?**
→ Brendan Eich thiết kế JS năm 1995 dựa trên Self language — prototype-based, không phải class-based.
→ Prototype cho phép object kế thừa từ object khác trực tiếp — không cần class làm blueprint.
→ ES6 `class` syntax là convenience layer — compile to the same prototype mechanism.

**Why this matters for 2026 interviews:**
- `Array.prototype`, `Object.prototype` — mọi method bạn dùng hàng ngày sống ở đây
- `instanceof` check, `hasOwnProperty`, `Object.create` — tất cả liên quan prototype
- Framework internals (React Component class, Vue options API) đều dựa trên prototype chain
- Senior interviews thường hỏi `new` keyword internals, `Object.create` vs `class`

---

## Concept Map / Bản Đồ Khái Niệm

```
Every object has [[Prototype]] → points to another object
                                           │
                    ┌──────────────────────┤
                    ▼                      ▼
             [Object.prototype]     [Array.prototype]
             .toString()             .map()
             .hasOwnProperty()       .filter()
             .valueOf()              .reduce()
                    │
                    ▼
                  null ← end of chain

class Syntax                    Prototype Reality
──────────────────────────────────────────────
class Animal {}           →    function Animal() {}
class Dog extends Animal  →    Dog.prototype = Object.create(Animal.prototype)
new Dog()                 →    Object.create(Dog.prototype) + Animal.call(this)
```

**Bạn đang ở đây trong lộ trình học:**
```
Closures → [PROTOTYPES & INHERITANCE] → Advanced Patterns → React Class Components
```

---

## Overview / Tổng Quan

JavaScript uses **prototype-based inheritance** — objects inherit directly from other objects via the `[[Prototype]]` chain, not from classes. ES6 `class` syntax is syntactic sugar that compiles to the same prototype mechanism.

**Tiếng Việt:** JS dùng prototype-based inheritance — object kế thừa từ object khác thông qua [[Prototype]] chain, không phải từ class blueprint. Khi truy cập property/method trên object, JS walk up the prototype chain cho đến khi tìm thấy hoặc đến `null`. `class` syntax là sugar — dễ đọc hơn nhưng hoạt động y hệt dưới hood.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Prototype Chain / Chuỗi Prototype

> 🧠 **Memory Hook**: **Every object has `[[Prototype]]`. Property lookup walks UP the chain. `Object.prototype` is the top. `null` is the end. `__proto__` is the getter/setter. `Object.getPrototypeOf(obj)` is the correct API.**

**Tại sao prototype chain tồn tại?**
→ Để SHARE methods across instances without copying — 1000 arrays, all sharing 1 `map` function on `Array.prototype`.
→ Memory efficiency: methods live on prototype, not on each instance.
→ Polymorphism: different objects can have same method name with different behavior via their prototype.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy tưởng tượng cây gia phả: khi bạn hỏi "ông nội của bạn làm gì?" — trước tiên hỏi bạn, không có → hỏi cha, không có → hỏi ông, có → trả lời. Prototype chain giống vậy: tìm property ở object hiện tại, không có → leo lên prototype, không có → leo tiếp, đến `null` thì trả về `undefined`.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
const animal = {
  speak() { return `${this.name} makes a sound.`; }
};

const dog = Object.create(animal); // dog.[[Prototype]] = animal
dog.name = 'Rex';

console.log(dog.speak()); // 'Rex makes a sound.'
// dog.speak → not found on dog → found on animal → calls with dog as `this`

// Verify the chain:
Object.getPrototypeOf(dog) === animal;    // true
dog.hasOwnProperty('speak');              // false — speak is on animal
dog.hasOwnProperty('name');               // true — name is on dog itself
```

```
Prototype chain diagram:
dog object:
┌─────────────────────────────────────┐
│ name: 'Rex'    (own property)       │
│ [[Prototype]] ──────────────────────┼──► animal object:
└─────────────────────────────────────┘    ┌────────────────────────────┐
                                           │ speak: function()          │
                                           │ [[Prototype]] ─────────────┼──► Object.prototype
                                           └────────────────────────────┘    ┌─────────────┐
                                                                              │ toString()  │
                                                                              │ valueOf()   │
                                                                              │ [[Prototype]]──► null
                                                                              └─────────────┘
```

**`__proto__` vs `prototype` — the confusing pair:**
```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { return 'Woof!'; };

const rex = new Dog('Rex');

rex.__proto__ === Dog.prototype;              // true (instance → constructor's .prototype)
Dog.prototype.constructor === Dog;           // true (circular reference)
Object.getPrototypeOf(rex) === Dog.prototype; // true (proper API, same result)

// Summary:
// .prototype → property on FUNCTION objects (blueprint for instances)
// [[Prototype]] / __proto__ → property on ALL objects (the actual chain link)
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Property shadowing**: setting `dog.speak = fn` creates own property, shadows prototype's `speak`
- **Prototype mutation**: modifying `Array.prototype` affects ALL arrays — dangerous in shared code
- **Performance**: deep prototype chains cause slower property lookups — V8 optimizes common patterns
- **`Object.create(null)`**: creates object with NO prototype — pure dictionary, no `toString`, `hasOwnProperty`

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Dùng `__proto__` để set prototype" | `__proto__` is deprecated, not guaranteed in all engines | Dùng `Object.create()` hoặc `Object.setPrototypeOf()` |
| "Method trên prototype là copy trong mỗi instance" | Methods shared via chain — NOT copied | 1000 arrays share 1 `Array.prototype.map` function |
| Thêm methods vào `Array.prototype` | Pollutes global — conflicts với library code | Extend array via subclass: `class MyArray extends Array` |

**🎯 Interview Pattern:**
- Khi thấy: "how does `[].map()` work?", "what is `__proto__`?", "explain prototype chain"
- → Walk up the chain: object → prototype → Object.prototype → null
- → Answer opens with: *"Every object in JS has an internal [[Prototype]] link. When you access a property, JS first looks at the object itself, then walks up the prototype chain until it finds it or reaches null."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](./03-closures-comprehensive.md) — `this` in methods uses same lexical/dynamic binding principles
- ➡️ Để hiểu: `new` keyword internals and `class` below — they set up the prototype chain

---

### 2. The `new` Keyword — What Actually Happens / Từ Khóa `new` — Thực Sự Xảy Ra Gì

> 🧠 **Memory Hook**: **`new Foo()` does 4 things: (1) create empty object, (2) set [[Prototype]] to `Foo.prototype`, (3) call `Foo` with `this` = new object, (4) return the object.**

**Tại sao `new` keyword cần thiết?**
→ Trước `class`, `new` là cách duy nhất để tạo objects với shared prototype.
→ `new` làm constructor function behave như class: setup prototype link + initialize properties.
→ Hiểu `new` = hiểu class syntax dưới hood.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

`new` như nhà máy: bản thiết kế (constructor function) + nguyên liệu (`this`) → sản phẩm (instance). Bản thiết kế không tạo ra 1 copy của chính nó — chỉ cung cấp blueprint, chia sẻ methods qua prototype.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
function User(name, role) {
  this.name = name;    // step 3: runs with this = new object
  this.role = role;
}
User.prototype.greet = function() {
  return `Hi, I'm ${this.name} (${this.role})`;
};

const admin = new User('Nguyen', 'admin');

// What new User('Nguyen', 'admin') does internally:
function simulateNew(Constructor, ...args) {
  // Step 1: Create empty object
  const obj = {};

  // Step 2: Set [[Prototype]] to Constructor.prototype
  Object.setPrototypeOf(obj, Constructor.prototype);

  // Step 3: Call constructor with obj as this
  const result = Constructor.apply(obj, args);

  // Step 4: Return obj (unless constructor explicitly returns an object)
  return result instanceof Object ? result : obj;
}

const admin2 = simulateNew(User, 'Nguyen', 'admin');
console.log(admin2.greet()); // 'Hi, I'm Nguyen (admin)'
```

```
Memory layout after new User():
admin object:
┌─────────────────────────────────┐
│ name: 'Nguyen' (own)            │
│ role: 'admin'  (own)            │
│ [[Prototype]] ──────────────────┼──► User.prototype:
└─────────────────────────────────┘    ┌──────────────────────────────┐
                                       │ greet: function() { ... }    │
                                       │ constructor: User (circular) │
                                       │ [[Prototype]] ───────────────┼──► Object.prototype
                                       └──────────────────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Return value**: if constructor `return`s a primitive → ignored, obj returned. If returns an object → that object returned (not the new obj)
- **Forgetting `new`**: `User('name', 'role')` without `new` — `this` is `undefined` (strict mode) or global. Use `class` to prevent: class constructors throw if called without `new`

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "Constructor phải return object" | new handles return automatically | Không cần return trong constructor (trừ khi muốn override) |
| Gọi constructor function mà không có `new` | `this` sẽ bị bind sai (global hoặc undefined) | Dùng `class` để enforce new, hoặc check: `if (!(this instanceof User)) return new User(name)` |

**🎯 Interview Pattern:**
- Khi thấy: "what does `new` do?", "implement your own `new`", "what happens without `new`?"
- → 4 steps: create object → set prototype → call constructor → return
- → Answer opens with: *"The `new` keyword does 4 things: creates an empty object, sets its [[Prototype]] to the constructor's .prototype, calls the constructor with `this` pointing to the new object, then returns the object."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: Prototype chain above
- ➡️ Để hiểu: `class` syntax below — class is syntactic sugar that does these 4 steps automatically

---

### 3. ES6 `class` — Syntactic Sugar / Cú Pháp `class` — Đường Bao Phủ

> 🧠 **Memory Hook**: **`class` = pretty syntax for prototype setup. Same engine, different paint. `extends` = set prototype chain. `super()` = call parent constructor.**

**Tại sao `class` syntax ra đời?**
→ Constructor functions + prototype assignment là verbose và error-prone.
→ `class` syntax familiar với developers từ Java/C# — lower barrier.
→ Enforces `new` usage (throws if called without `new`).
→ Cleaner syntax for `extends` and `super` — prototype chain setup handled automatically.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

`class` như form điền thông tin (khai sinh): thay vì viết tay mọi thứ (prototype assignment thủ công), bạn điền vào chỗ trống (class syntax) — kết quả giấy tờ như nhau, chỉ quy trình đẹp hơn.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// Modern class syntax
class Animal {
  #sound; // private field (ES2022)

  constructor(name) {
    this.name = name;
    this.#sound = 'generic sound';
  }

  speak() { // added to Animal.prototype
    return `${this.name}: ${this.#sound}`;
  }

  static create(name) { // added to Animal (not prototype)
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);         // MUST call before using `this`
    this.#sound = 'Woof'; // private field — cannot access from outside
  }

  fetch(item) {          // added to Dog.prototype
    return `${this.name} fetches ${item}!`;
  }
}

// What 'extends' compiles to (conceptually):
// Dog.prototype = Object.create(Animal.prototype)
// Dog.prototype.constructor = Dog
// Object.setPrototypeOf(Dog, Animal) // for static method inheritance
```

```
class hierarchy in memory:
Dog class object:
┌──────────────────────────────────────────────────┐
│ [[Prototype]] ─────────────────────────────────► Animal (for static methods)
└──────────────────────────────────────────────────┘

Dog.prototype object:
┌──────────────────────────────────────────────────┐
│ fetch: function() { ... }                        │
│ constructor: Dog                                 │
│ [[Prototype]] ──────────────────────────────────► Animal.prototype
└──────────────────────────────────────────────────┘

Animal.prototype object:
┌──────────────────────────────────────────────────┐
│ speak: function() { ... }                        │
│ constructor: Animal                              │
│ [[Prototype]] ──────────────────────────────────► Object.prototype
└──────────────────────────────────────────────────┘
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

- **Class declarations are NOT hoisted** (unlike function declarations) — `class` enters TDZ
- **Methods are non-enumerable**: `Object.keys(Dog.prototype)` → empty (unlike prototype methods added manually)
- **`super` in static methods**: refers to parent class; `super` in instance methods: refers to parent prototype

**❌ Sai lầm thường gặp / Common Mistakes:**
| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| "`class` creates true class-based inheritance" | `class` is syntactic sugar over prototype chain | JS vẫn là prototype-based; `class` chỉ là syntax |
| Không gọi `super()` trước dùng `this` | Derived class constructor: `this` uninitialized until super() | `super()` phải là dòng đầu tiên trong derived constructor |
| Class methods được copy vào mỗi instance | Methods live on the prototype, shared | Only instance properties (`this.x`) are per-instance |

**🎯 Interview Pattern:**
- Khi thấy: "how does `class` work?", "difference between class and prototype?", "what does `extends` do?"
- → Reveal the prototype mechanism behind the syntax
- → Answer opens with: *"ES6 `class` is syntactic sugar over JavaScript's prototype system. `class Dog extends Animal` sets up Dog.prototype's [[Prototype]] to point to Animal.prototype — the same thing you'd do manually with Object.create(Animal.prototype)."*

**🔑 Knowledge Chain:**
- 📚 Cần biết: `new` keyword internals above
- ➡️ Để hiểu: [React Class Components](../03-react/01-react-fundamentals.md) — Component.prototype chain, lifecycle methods

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: What is the prototype chain? How does property lookup work? / Prototype chain là gì? 🟢 Junior

**A:** Every JavaScript object has an internal `[[Prototype]]` link pointing to another object. When you access a property, JS first looks at the object itself. If not found, it walks up the `[[Prototype]]` chain until it finds the property or reaches `null`.

```javascript
const arr = [1, 2, 3];
// arr.map → not on arr itself
// → found on Array.prototype.map (shared by ALL arrays)
// → Array.prototype.[[Prototype]] = Object.prototype
// → Object.prototype.[[Prototype]] = null (end)

arr.hasOwnProperty('map'); // false — map is on Array.prototype
```

**Tiếng Việt:** Mỗi object có [[Prototype]] trỏ đến object khác. Property lookup: tìm trên object → không có → tìm trên prototype → không có → leo lên tiếp → đến `null` thì trả `undefined`. Đây là lý do `[].map()` hoạt động: `map` sống trên `Array.prototype`, shared bởi TẤT CẢ array — không copy vào từng array.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích chain lookup, nêu Array.prototype example, phân biệt own property vs inherited property
- ❌ Weak: "Prototype là như class inheritance" — nhầm lẫn conceptual model

---

### Q: What does `new` actually do? Implement it manually / `new` thực sự làm gì? Tự implement? 🟢 Junior

**A:** `new Constructor(args)` does 4 steps:

```javascript
// 1. Create empty object
// 2. Set its [[Prototype]] to Constructor.prototype
// 3. Call Constructor with this = that object
// 4. Return the object (unless constructor returns a different object)

function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // steps 1 + 2
  const result = Constructor.apply(obj, args);       // step 3
  return result instanceof Object ? result : obj;    // step 4
}

function User(name) { this.name = name; }
const u = myNew(User, 'Nguyen');
console.log(u.name);           // 'Nguyen'
console.log(u instanceof User); // true
```

**Tiếng Việt:** `new` làm 4 bước: tạo empty object → set [[Prototype]] = Constructor.prototype → gọi Constructor với this = object → trả về object. Bước 4 có edge case: nếu constructor return một object khác, `new` trả về cái đó thay vì obj mới.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Implement được `myNew`, giải thích tại sao prototype link được set trước khi constructor runs, biết edge case của return value
- ❌ Weak: Mô tả bằng lời mà không implement được

---

### Q: What is the difference between `class` and function + prototype? When to use each? 🟡 Mid

**A:** They produce identical prototype chains — `class` is syntactic sugar:

```javascript
// Prototype-based (manual):
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name + ' speaks'; };

// Class syntax (sugar):
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' speaks'; }
}

// Result in memory: IDENTICAL prototype chain

// Key behavioral differences:
// class — cannot call without new (TypeError thrown)
// class — constructor body is always in strict mode
// class — methods are non-enumerable (Object.keys won't list them)
// class — supports private fields: #field
// class — hoisting: NOT hoisted (TDZ like let)
```

**Khi nào dùng class:** New code, when you need inheritance hierarchy, TypeScript projects, React class components (legacy).

**Khi nào dùng prototype manually:** Library code that must avoid transpilation, performance-critical paths (class compiled to prototype anyway in modern engines), or when you need to manipulate the prototype chain dynamically.

**Tiếng Việt:** `class` và prototype manual tạo ra kết quả memory giống hệt nhau. Khác biệt về syntax và một số behavior: `class` enforce `new`, strict mode tự động, methods non-enumerable, supports private `#fields`. Trong thực tế 2026: luôn dùng `class` syntax trong codebase mới — rõ ràng hơn, ít lỗi hơn, TypeScript support tốt hơn.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Nêu được non-enumerable methods, TDZ hoisting, strict mode enforcement, biết chúng compiles to same thing
- ❌ Weak: "class hiện đại hơn" — không giải thích behavioral differences

---

### Q: Design a mixin system for JavaScript — multiple inheritance without prototype chain pollution 🔴 Senior

**A:** JS `class` doesn't support multiple inheritance (single prototype chain). Solution: **mixins** via function composition:

```javascript
// Mixin approach: compose behaviors without inheritance
const Serializable = (superclass) => class extends superclass {
  serialize() {
    return JSON.stringify(this);
  }
  static deserialize(data) {
    return Object.assign(new this(), JSON.parse(data));
  }
};

const Auditable = (superclass) => class extends superclass {
  #auditLog = [];

  logAction(action) {
    this.#auditLog.push({ action, timestamp: Date.now() });
  }

  getAuditLog() { return [...this.#auditLog]; }
};

const Validatable = (superclass) => class extends superclass {
  validate() {
    return Object.entries(this.constructor.rules || {})
      .every(([field, rule]) => rule(this[field]));
  }
};

// Base class
class Entity {
  constructor(id) { this.id = id; }
}

// Compose mixins — order matters for MRO
class Order extends Serializable(Auditable(Validatable(Entity))) {
  static rules = {
    id: (v) => v > 0,
    total: (v) => v >= 0,
  };

  constructor(id, total) {
    super(id);
    this.total = total;
  }
}

const order = new Order(1, 150);
order.logAction('created');
console.log(order.validate());        // true
console.log(order.getAuditLog());     // [{action: 'created', ...}]
console.log(order.serialize());       // '{"id":1,"total":150}'
```

**Why mixins over deep inheritance:**
1. Avoids "fragile base class" — parent class changes break all children
2. Behaviors can be composed independently — `Auditable` doesn't need `Serializable`
3. Easier to test each mixin in isolation
4. No diamond inheritance problem (JS has linear prototype chain)

**Tiếng Việt:** Mixins là pattern thực tế tốt hơn deep inheritance cho business logic. Grab dùng pattern tương tự cho service classes: `AuthenticatedService(RateLimitedService(BaseService))`. Key insight: mixin là hàm nhận superclass → trả về class mới — cho phép compose behaviors linh hoạt mà không pollute prototype chain.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Implement mixin pattern, giải thích tại sao tốt hơn deep inheritance, biết MRO implications và private `#fields` trong mixins
- ❌ Weak: "Dùng interface" — JS không có interface; hoặc deepening inheritance hierarchy thay vì composition

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| What is prototype chain? | 🟢 | Walk up [[Prototype]] chain; methods on Array.prototype shared by all arrays |
| What does `new` do? Implement it | 🟢 | 4 steps: create obj → set prototype → call constructor → return |
| `class` vs prototype manually? | 🟡 | Same prototype chain; class adds: no-new enforcement, strict mode, non-enumerable methods, TDZ hoisting |
| Mixin system design | 🔴 | Functional mixin pattern: `(superclass) => class extends superclass`; compose without deep hierarchy |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"How does `[1,2,3].map(fn)` actually find the `map` method?"**

**30 giây đầu — mở đầu lý tưởng:**
1. "JavaScript uses prototype-based lookup — when you access a property, it first checks the object itself, then walks up the prototype chain."
2. "The array `[1,2,3]` doesn't have `map` as its own property. Its [[Prototype]] points to `Array.prototype`, which does have `map` defined on it."
3. "All arrays share a single `Array.prototype` object — `map` is not copied into each array, it's looked up via the prototype chain."
4. "This is the same mechanism behind `class extends` — `extends` sets up the [[Prototype]] links so method lookups walk from child prototype to parent prototype."

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close this doc before attempting.**

- [ ] **Retrieval**: Viết ra 4 bước của `new` keyword từ trí nhớ — không nhìn lại.
- [ ] **Visual**: Vẽ prototype chain cho `new Dog()` extends `Animal` — từ Dog instance lên đến `null`. Bao gồm tên các objects và links.
- [ ] **Application**: `class Dog extends Animal {}` — `new Dog()` → kết quả gọi `dog.speak()` tìm `speak` ở đâu? Trace từng bước.
- [ ] **Debug**: `const d = Dog()` (không có `new`) — lỗi gì xảy ra? Tại sao `class` khác function constructor ở đây?
- [ ] **Teach**: Giải thích tại sao `[].map()` hoạt động cho người không biết JS, dùng analogy "thư viện dùng chung" không dùng từ "prototype".

💬 **Feynman Prompt:** Giải thích prototype chain cho người không biết lập trình, dùng analogy "cây gia phả" — không dùng từ "prototype", "[[Prototype]]", "inheritance".

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Closures](./03-closures-comprehensive.md) — `this` in prototype methods uses dynamic binding (not lexical)
- ➡️ **Enables:** [Advanced Patterns](./17-advanced-patterns-theory.md) — decorator, mixin, factory patterns
- ➡️ **Enables:** [React Fundamentals](../03-react/01-react-fundamentals.md) — `class Component extends React.Component` — prototype chain in action
- 🔗 **Applied in:** Every array method call, `instanceof`, `Object.create`, React class components, Angular decorators
