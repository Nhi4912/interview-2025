# Prototypes & Inheritance / Nguyên Mẫu & Kế Thừa

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./04-closures.md), [this keyword](./05-this-keyword.md)
> **See also**: [ES6+ Features](./08-es6-features.md) | [Advanced Patterns](./14-advanced-patterns.md)
> **L5 Competencies**: System Design, Performance Optimization, Security Awareness, Code Review Leadership

---

## Real-World Scenario / Tình Huống Thực Tế

**Production bug tại startup dashboard:** Team build dashboard hiển thị 10,000 `User` objects. Junior dev viết:

```javascript
function createUser(name) {
  return {
    name,
    greet() {
      return `Hello, ${this.name}`;
    },
    logout() {
      /* 20 lines */
    },
    formatDate() {
      /* 15 lines */
    },
  };
}
```

Production monitor alert: **memory tăng 400MB**. Lý do: 3 functions × 10,000 objects = **30,000 function objects** trong heap. Senior fix bằng prototype:

```javascript
User.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
```

Memory giảm xuống **~4MB**. Đây là lý do prototype tồn tại: **chia sẻ behavior mà không copy data**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy (Feynman):** Prototype giống **sổ tay quy trình công ty** treo trên tường văn phòng. Mỗi nhân viên (object) có tên và ID riêng, nhưng không mang theo cả cuốn sổ — khi cần quy trình, tra lên tường. Không có trong phòng → hỏi lên tầng trên (Object.prototype). Cuối cùng → null → undefined.

```
Khi gọi arr.map():
arr               → không có 'map' → tra lên...
Array.prototype   → CÓ 'map' ✓ → dùng ngay, không copy
```

**Tại sao cần học?** Mọi thứ trong JS dựa trên prototype chain: `class`, `extends`, `instanceof`, method sharing. Senior interviews luôn hỏi `new` keyword internals, `Object.create` vs `class`, prototype pollution.

---

## Concept Map / Bản Đồ Khái Niệm

```
[Closures] → [this keyword] → [Prototypes & Inheritance] ★ ← bạn đang ở đây
                                        │
                    ┌───────────────────┼──────────────────┐
                    ▼                   ▼                  ▼
             Prototype Chain       new keyword         ES6 Class
             (lookup engine)       (4 steps CLER)     (syntax sugar)
                    │                   │                  │
                    └───────────────────┼──────────────────┘
                                        ▼
                              [Advanced Patterns]
                              (Mixins, Composition)

Built-in chains:
  myArr → Array.prototype → Object.prototype → null
  myFn  → Function.prototype → Object.prototype → null
  {}    → Object.prototype → null
```

---

## Overview / Tổng Quan

JavaScript dùng **prototype-based inheritance** — objects kế thừa từ objects khác qua `[[Prototype]]` chain, không phải từ class blueprint. Khi truy cập property, JS walk up chain cho đến khi tìm thấy hoặc đến `null`.

ES6 `class` syntax là syntactic sugar — compile to cùng prototype mechanism. `extends` thực chất dùng `Object.create()` để link prototype. Hiểu prototype = hiểu JS từ gốc rễ.

4 concepts chính:

1. **Prototype Chain** — lookup engine, memory sharing
2. **`new` Keyword** — 4 bước CLER tạo instance
3. **ES6 Classes** — sugar over prototype, key differences
4. **Prototype Pollution & Composition** — security & design patterns

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Prototype Chain / Chuỗi Prototype

> 🧠 **Memory Hook:** "Prototype chain = **thang máy đi LÊN** — JS leo lên cho đến khi tìm property hoặc chạm trần (null)."

**Tại sao tồn tại? / Why does this exist?**

JavaScript cần cách chia sẻ behavior mà không copy — 1000 arrays share 1 `map` function trên `Array.prototype`.
→ Tại sao không copy? → Copy = O(n) memory, n objects × m methods = lãng phí.
→ Tại sao chain? → Polymorphism: override method ở child mà parent vẫn giữ default.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Tòa chung cư: mỗi căn hộ (object) có đồ dùng riêng (own properties). Wifi, thang máy, bể bơi (prototype methods) là **tài sản chung cư** — không ai cần mua riêng. Không có ở tầng bạn → xuống lobby → không có → lên tòa chính → cuối cùng null.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
const animal = {
  eats: true,
  walk() {
    return "walking";
  },
};
const rabbit = { jumps: true, __proto__: animal };
const longEar = { earLength: 10, __proto__: rabbit };

longEar.earLength; // Own property → tìm thấy ngay ✓
longEar.jumps; // Not own → rabbit → found ✓
longEar.eats; // Not own → rabbit → animal → found ✓
longEar.fly; // Not found → ... → null → undefined
```

```
Prototype Chain:
┌─────────────────────────────┐
│ longEar { earLength: 10 }   │ ← look here first
│   [[Prototype]]             │
└────────────┬────────────────┘
             ▼
┌─────────────────────────────┐
│ rabbit { jumps: true }      │ ← then here
│   [[Prototype]]             │
└────────────┬────────────────┘
             ▼
┌─────────────────────────────┐
│ animal { eats, walk() }     │ ← then here
│   [[Prototype]]             │
└────────────┬────────────────┘
             ▼
┌─────────────────────────────┐
│ Object.prototype            │ ← built-in ceiling
│   toString(), valueOf()...  │
│   [[Prototype]] = null      │
└─────────────────────────────┘
             ▼
            null → undefined
```

**`__proto__` vs `.prototype` — cặp đôi gây nhầm:**

```javascript
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function () {
  return "Woof!";
};

const rex = new Dog("Rex");

// .prototype: chỉ có trên FUNCTION (blueprint cho instances)
Dog.prototype; // { bark: fn, constructor: Dog }
rex.prototype; // undefined (instance không có .prototype)

// __proto__: trỏ đến [[Prototype]] — có trên MỌI object
rex.__proto__ === Dog.prototype; // true
Object.getPrototypeOf(rex) === Dog.prototype; // true (proper API)
```

#### Layer 3: Edge Cases / Trường Hợp Đặc Biệt

```javascript
// Property shadowing — own property che prototype
const obj = Object.create({ x: 10 });
obj.x = 20; // creates OWN property, shadows prototype's x
obj.x; // 20 (own)
delete obj.x;
obj.x; // 10 (prototype's x resurfaces)

// Object.create(null) — pure dictionary, NO prototype
const map = Object.create(null);
map.toString; // undefined — no Object.prototype methods
// Useful for: config maps, caches, avoiding prototype pollution
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                              | Đúng là                                                |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| Dùng `__proto__` trong production  | Deprecated, không guaranteed                             | `Object.getPrototypeOf()` / `Object.create()`          |
| Thêm method vào `Array.prototype`  | Prototype pollution — ảnh hưởng ALL arrays + third-party | Extend class riêng hoặc utility function               |
| Nghĩ prototype copy data vào child | Không copy — chỉ traversal runtime                       | Prototype là live reference, thay đổi ảnh hưởng tất cả |

**🎯 Interview Pattern:**

- Khi thấy: "tại sao `arr.map` hoạt động?", "`__proto__` vs `prototype`?"
- → Nhớ đến: property lookup traversal — JS đi LÊN chain, không copy
- → Mở đầu: "JavaScript dùng prototype delegation. Khi gọi `arr.map`, JS tìm trên arr → không có → traverse lên Array.prototype → tìm thấy."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [Closures](./04-closures.md) — cả hai về scope và memory management
- ➡️ Để hiểu: `new` keyword + `class` — setup prototype chain tự động

---

### 2. The `new` Keyword / Từ Khóa `new`

> 🧠 **Memory Hook:** "`new` = **CLER** — Create, Link, Execute, Return — 4 bước tạo object."

**Tại sao tồn tại? / Why does this exist?**

Trước `new`, phải thủ công: tạo object, set prototype, gọi constructor — 3 bước dễ quên.
→ `new` gộp 4 bước vào 1 keyword, giống syntax Java (`new X()`) để developer chuyển đổi dễ.
→ Quên bước nào = bug runtime khó debug.

#### Layer 1: Simple Analogy

`new` giống **máy đúc bánh khuôn**: đưa bột (arguments) vào, máy tự (1) chuẩn bị khuôn trống, (2) gắn vào tủ công thức chung, (3) đổ bột tạo hình, (4) lấy bánh ra. Bạn chỉ cần `new Banh(args)`.

#### Layer 2: How CLER Works / Cơ Chế 4 Bước

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function () {
  return `Hi, ${this.name}`;
};

const john = new Person("John", 30);
```

Bên trong JS thực sự làm:

```javascript
// Step C — Create: empty object
const __obj = {};

// Step L — Link: gắn prototype
Object.setPrototypeOf(__obj, Person.prototype);

// Step E — Execute: chạy constructor với this = __obj
Person.call(__obj, "John", 30);
// → __obj.name = 'John', __obj.age = 30

// Step R — Return: trả __obj (trừ khi constructor return Object khác)
// const john = __obj;
```

```
Sau new Person('John', 30):
┌──────────────────────────────┐
│ john (instance)              │
│   name: 'John'  (own)       │ ← set trong constructor
│   age: 30       (own)       │
│   [[Prototype]] ─────────────┼──→ Person.prototype { greet: fn }
└──────────────────────────────┘            │ [[Prototype]]
                                            ▼
                                  Object.prototype { toString... }
                                            │
                                           null
```

**Implement `new` from scratch:**

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // C + L
  const result = Constructor.apply(obj, args); // E
  return result instanceof Object ? result : obj; // R
}
```

#### Layer 3: Edge Cases / Gotchas

```javascript
// Gotcha 1: Constructor return Object → override new object
function Weird() {
  this.x = 1;
  return { y: 2 }; // Object return → overrides!
}
new Weird(); // { y: 2 } — x is LOST

// Gotcha 2: Return primitive → ignored
function Fine() {
  this.x = 1;
  return 42; // primitive → ignored
}
new Fine(); // { x: 1 } — works normally

// Gotcha 3: Forget new → this = global/undefined
function Person(name) {
  this.name = name;
}
Person("John"); // strict: TypeError! sloppy: window.name = 'John'
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                             | Đúng là                                              |
| ------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| Nghĩ `new` copy methods từ prototype | Chỉ tạo link `[[Prototype]]`                            | Instance delegates lên prototype runtime             |
| Return object trong constructor vô ý | Object return override instance — mất `this` properties | Không return object trong constructor (trừ khi cố ý) |
| Gọi constructor không có `new`       | `this` trỏ sai (global/undefined)                       | Luôn dùng `new` hoặc `class` (enforce new)           |

**🎯 Interview Pattern:**

- Khi thấy: "explain `new`", "implement your own `new`"
- → Nhớ: **CLER** — Create, Link, Execute, Return
- → Mở đầu: "`new` thực hiện 4 bước: tạo empty object, set [[Prototype]], chạy constructor với this = object đó, trả về object."

**🔑 Knowledge Chain:**

- 📚 Cần biết: [this keyword](./05-this-keyword.md) — `this` binding trong constructor
- ➡️ Để hiểu: ES6 Class — sugar wrapper quanh CLER + prototype

---

### 3. ES6 Classes / Lớp ES6

> 🧠 **Memory Hook:** "Class = **đường bọc** bên ngoài, bên trong vẫn là prototype. `extends` = auto-setup chain. `super()` = gọi parent constructor."

**Tại sao tồn tại? / Why does this exist?**

Constructor function + prototype setup verbose và error-prone. Developer Java/C# thấy khó hiểu.
→ `class` syntax familiar, enforces `new`, auto strict mode, supports private `#fields`.
→ NHƯNG bên dưới VẪN là prototype chain — không phải classical OOP.

#### Layer 1: Simple Analogy

Class giống **bản thiết kế nhà**. Bản thiết kế ≠ ngôi nhà. `new House()` = xây nhà theo bản thiết kế. Nhiều nhà (instances) cùng bản thiết kế (class/prototype), mỗi nhà độc lập.

#### Layer 2: How It Works / Cơ Chế

```javascript
// ES6 class syntax
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} speaks`;
  }
  static create(name) {
    return new Animal(name);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // MUST call before accessing this
    this.breed = breed;
  }
  speak() {
    return `${super.speak()} (woof!)`;
  }
}
```

Dịch sang prototype thuần:

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} speaks`;
};
Animal.create = function (name) {
  return new Animal(name);
};

function Dog(name, breed) {
  Animal.call(this, name); // super()
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype); // extends
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
  return Animal.prototype.speak.call(this) + " (woof!)"; // super.speak()
};
```

```
Inheritance chain in memory:
┌───────────────────────┐
│ fido (Dog instance)   │  name:'Rex', breed:'Lab'
│ [[Prototype]] ────────┼──→ Dog.prototype { speak, fetch }
└───────────────────────┘          │ [[Prototype]]  ← extends wires this
                                   ▼
                          Animal.prototype { speak }
                                   │ [[Prototype]]
                                   ▼
                          Object.prototype { toString... }
                                   │
                                  null
```

**Class vs Constructor — key differences:**

| Feature            | `class`              | Constructor fn     |
| ------------------ | -------------------- | ------------------ |
| Hoisting           | ❌ TDZ (not hoisted) | ✅ Hoisted         |
| Strict mode        | ✅ Always strict     | Depends on file    |
| Methods enumerable | ❌ Non-enumerable    | ✅ Enumerable      |
| Call without `new` | ❌ TypeError         | ✅ Works (badly)   |
| Private fields     | ✅ `#field` syntax   | ❌ Convention only |

#### Layer 3: Private Fields & Mixins

```javascript
// Private fields (ES2022) — true encapsulation
class BankAccount {
  #balance = 0;
  deposit(amount) {
    this.#balance += amount;
  }
  get balance() {
    return this.#balance;
  }
}
const acc = new BankAccount();
acc.deposit(100);
acc.#balance; // SyntaxError — truly private

// Mixins — JS không có multiple inheritance, workaround:
const Serializable = (Base) =>
  class extends Base {
    serialize() {
      return JSON.stringify(this);
    }
  };
const Auditable = (Base) =>
  class extends Base {
    #log = [];
    logAction(action) {
      this.#log.push({ action, timestamp: Date.now() });
    }
  };
class Order extends Serializable(Auditable(Object)) {}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                   | Đúng là                                             |
| ----------------------------------------- | --------------------------------------------- | --------------------------------------------------- |
| Nghĩ class là classical OOP như Java      | JS dùng prototype delegation, không copy      | Class là sugar — `instanceof` check prototype chain |
| Quên `super()` trong child constructor    | `this` chưa initialized → ReferenceError      | `super(...)` TRƯỚC khi dùng `this`                  |
| Dùng class method như callback không bind | Arrow fn trong class field hoặc `.bind(this)` | `method = () => {}` (class field arrow)             |

**🎯 Interview Pattern:**

- Khi thấy: "class vs prototype?", "`extends` làm gì internally?"
- → Nhớ: class = sugar over prototype, cùng chain
- → Mở đầu: "ES6 class là syntactic sugar. `extends` thực chất dùng `Object.create()` để link prototype chain..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: `new` keyword (concept 2 trên)
- ➡️ Để hiểu: [Advanced Patterns](./14-advanced-patterns.md) — Mixins, composition over inheritance

---

### 4. Prototype Pollution & Security / Bảo Mật

> 🧠 **Memory Hook:** "Prototype pollution = **đầu độc nguồn nước** — modify Object.prototype ảnh hưởng MỌI object trong app."

**Tại sao tồn tại? / Why does this exist?**

Vì mọi object delegate lên `Object.prototype`, inject property vào đó = tất cả objects "có" property đó.
→ Attack vector: deep merge patterns (`_.merge(obj, untrustedInput)`) + JSON parse.
→ Hậu quả: privilege escalation, property injection, DoS.

#### Layer 1: Simple Analogy

Prototype pollution giống **đầu độc nguồn nước chung**: thay vì tấn công từng nhà, attacker đầu độc bể nước tòa chung cư → tất cả căn hộ bị ảnh hưởng.

#### Layer 2: Attack & Defense

```javascript
// ❌ Vulnerable deep merge
function deepMerge(target, source) {
  for (let key of Object.keys(source)) {
    if (typeof source[key] === "object") {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// Attacker input:
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
deepMerge({}, malicious);

// Now ALL objects have isAdmin!
const user = {};
user.isAdmin; // true — POLLUTION!

// ✅ Defense 1: Block dangerous keys
function safeMerge(target, source) {
  for (let key of Object.keys(source)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    // ... rest of merge
  }
}

// ✅ Defense 2: Object.create(null) for data containers
const config = Object.create(null); // no prototype chain

// ✅ Defense 3: Object.freeze in dev
if (process.env.NODE_ENV === "development") {
  Object.freeze(Object.prototype); // mutations throw TypeError
}
```

#### Layer 3: Production Debugging

```javascript
// Detect: property exists but wasn't set explicitly
function propertySource(obj, prop) {
  if (Object.hasOwn(obj, prop)) return "own";
  let proto = Object.getPrototypeOf(obj);
  let level = 1;
  while (proto !== null) {
    if (Object.hasOwn(proto, prop)) return `prototype level ${level}`;
    proto = Object.getPrototypeOf(proto);
    level++;
  }
  return "not found";
}

// Debug checklist:
// 1. Object.keys(obj) vs for...in — difference = inherited
// 2. Object.getPrototypeOf chain walk
// 3. Search codebase for .prototype mutations
// 4. npm audit + snyk for library pollution
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                        | Đúng là                                             |
| --------------------------------------- | ---------------------------------- | --------------------------------------------------- |
| `for...in` không check `hasOwnProperty` | Iterates inherited properties too  | `Object.keys()` hoặc `hasOwn` check                 |
| Deep merge user input không sanitize    | Prototype pollution attack vector  | Block `__proto__`, `constructor`, `prototype` keys  |
| Nghĩ prototype pollution chỉ là theory  | Real CVEs: lodash, jQuery, Express | npm audit regular + Object.create(null) for configs |

**🎯 Interview Pattern:**

- Khi thấy: "prototype pollution?", "security trong JS?"
- → Nhớ: deep merge + JSON input → Object.prototype modified
- → Mở đầu: "Prototype pollution xảy ra khi untrusted input modify Object.prototype qua deep merge..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Prototype chain (concept 1 trên)
- ➡️ Để hiểu: Security best practices, input validation patterns

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: `[[Prototype]]` là gì và property lookup hoạt động thế nào? 🟢

**A:** Mỗi object có internal slot `[[Prototype]]` trỏ đến object cha. Khi truy cập property, JS tìm trên object trước → không có → leo lên `[[Prototype]]` → cứ thế đến `null`.

```javascript
const arr = [1, 2, 3];
arr.hasOwnProperty("map"); // false — map KHÔNG nằm trên arr
Array.prototype.hasOwnProperty("map"); // true — map nằm trên Array.prototype
// arr.map() → tìm trên arr → không có → Array.prototype → found ✓
```

**💡 Interview Signal:**

- ✅ Strong: Giải thích traversal, `hasOwnProperty` phân biệt own vs inherited, `null` terminus
- ❌ Weak: "Prototype là kiểu inheritance" — quá chung

---

### Q2: `__proto__` vs `.prototype` — khác gì? 🟢

**A:** `.prototype` = property trên **constructor function** — blueprint cho instances. `__proto__` = property trên **mọi object** — trỏ đến actual `[[Prototype]]`. Khi `new Foo()`, instance's `__proto__` = `Foo.prototype`.

```javascript
const rex = new Dog("Rex");
rex.__proto__ === Dog.prototype; // true
Dog.prototype.constructor === Dog; // true (circular)
```

**💡 Interview Signal:**

- ✅ Strong: Phân biệt "property of function" vs "property of instance", dùng `Object.getPrototypeOf()`
- ❌ Weak: Nhầm lẫn 2 khái niệm

---

### Q3: 4 bước của `new` keyword? 🟡

**A:** CLER: (1) **C**reate empty object, (2) **L**ink `[[Prototype]]` to `Constructor.prototype`, (3) **E**xecute constructor with `this` = new object, (4) **R**eturn object (unless constructor returns Object explicitly).

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // C + L
  const result = Constructor.apply(obj, args); // E
  return result instanceof Object ? result : obj; // R
}
```

Gotcha: `return { y: 2 }` trong constructor → override instance. `return 42` → ignored.

**💡 Interview Signal:**

- ✅ Strong: Implement `myNew`, biết return-object override, biết quên `new` → `this` sai
- ❌ Weak: "new tạo instance" — thiếu prototype linking (step 2)

---

### Q4: Class vs constructor function — key differences? 🟡

**A:** Cùng prototype chain. Khác: class TDZ (not hoisted), always strict, methods non-enumerable, must use `new` (TypeError), supports `#privateFields`.

```javascript
class A {
  method() {}
}
function B() {}
B.prototype.method = function () {};

typeof A; // 'function' — class IS a function
Object.keys(A.prototype); // [] — non-enumerable
Object.keys(B.prototype); // ['method'] — enumerable
```

**💡 Interview Signal:**

- ✅ Strong: "Cùng cơ chế, khác behavior" + ≥3 differences + `typeof class === 'function'`
- ❌ Weak: "Class mới hơn tốt hơn" — không giải thích trade-off

---

### Q5: Prototype pollution là gì, tại sao nguy hiểm? 🟡

**A:** Attacker-controlled input modify `Object.prototype` → tất cả objects inherit injected properties. Attack vector: deep merge + JSON parse (`{"__proto__": {"isAdmin": true}}`).

Defense: block `__proto__/constructor/prototype` keys, `Object.create(null)` for data, `Object.freeze(Object.prototype)` in dev.

**💡 Interview Signal:**

- ✅ Strong: Deep merge attack vector, `Object.create(null)` defense, biết real CVEs (lodash, jQuery)
- ❌ Weak: "Modify prototype" — không đề cập security impact

---

### Q6: Design composition over inheritance — khi nào chọn? 🔴

**A:** Mixins via function composition: `(Base) => class extends Base { ... }`. Compose behavior từ nhiều nguồn thay vì deep inheritance chain.

```javascript
const Flyable = (Base) =>
  class extends Base {
    fly() {
      return `${this.name} is flying`;
    }
  };
const Swimmable = (Base) =>
  class extends Base {
    swim() {
      return `${this.name} is swimming`;
    }
  };
class Duck extends Flyable(Swimmable(Animal)) {}
```

Chọn composition khi: share behavior across unrelated classes, chain >2 cấp, avoid Gorilla-Banana problem. Chọn `extends` khi: stable IS-A relationship, ≤2 levels deep.

**💡 Interview Signal:**

- ✅ Strong: Working mixin code, articulate Gorilla-Banana, decision criteria
- ❌ Weak: "Composition tốt hơn" — không có code hay criteria

**🔗 Follow-up chain:**

1. "Mixin order có quan trọng không?" → YES — MRO (Method Resolution Order) follow class composition order. `A(B(C))` → look A → B → C.
2. "Trade-off của mixin vs utility functions?" → Mixin: instanceOf works, access this/super. Utility: simpler, no prototype chain, easier testing.
3. "Design pattern nào thay thế inheritance hoàn toàn?" → Factory + strategy pattern — inject behavior via function arguments instead of prototype chain.

---

### Q7: Debug inherited property gây bug — approach? 🔴

**A:** Systematic: (1) `Object.keys(obj)` vs `for...in` — difference = inherited. (2) `Object.getPrototypeOf()` chain walk. (3) Search codebase for `.prototype` mutations. (4) `npm audit` for library pollution.

```javascript
function debugChain(obj) {
  let proto = Object.getPrototypeOf(obj);
  let level = 0;
  while (proto !== null) {
    console.log(`Level ${level}:`, Object.getOwnPropertyNames(proto));
    proto = Object.getPrototypeOf(proto);
    level++;
  }
}
// + Object.freeze(Object.prototype) in dev to catch violations early
```

**💡 Interview Signal:**

- ✅ Strong: Systematic isolate → trace → fix, `Object.freeze` trick, security angle
- ❌ Weak: "Dùng hasOwnProperty" — đúng nhưng không systematic

**🔗 Follow-up chain:**

1. "Object.freeze có side effects gì?" → Library code relying on prototype extension will break. Only use in dev/test.
2. "Làm sao prevent pollution ở library level?" → Use `Map` instead of plain objects for key-value storage. Validate input schemas with zod/ajv.
3. "Performance impact của deep prototype chain?" → V8 optimizes common patterns (inline caches). Custom chains >3 levels may miss optimization → profile first.

---

### Q8: Implement Object.create polyfill + giải thích tại sao nó fundamental 🔴

**A:**

```javascript
function objectCreate(proto, propertiesObject) {
  if (typeof proto !== "object" && typeof proto !== "function" && proto !== null) {
    throw new TypeError("Prototype must be object or null");
  }
  function F() {}
  F.prototype = proto;
  const obj = new F();
  if (propertiesObject !== undefined) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj;
}

// Why fundamental: it's the CORE operation behind new, extends, Object.create(null)
// new Foo() = Object.create(Foo.prototype) + Foo.call(obj)
// class extends = Object.create(Parent.prototype) + constructor call
// Object.create(null) = pure dictionary without prototype pollution surface
```

**💡 Interview Signal:**

- ✅ Strong: Working polyfill, explain why it's the building block of new + class + null-prototype
- ❌ Weak: Chỉ dùng `Object.setPrototypeOf` — đúng nhưng không hiểu underlying mechanism

**🔗 Follow-up chain:**

1. "Object.create vs Object.setPrototypeOf?" → `create` tạo object mới. `setPrototypeOf` modify existing object — V8 deoptimizes (hides class change).
2. "Tại sao `Object.create(null)` useful?" → No prototype = no pollution surface, no `toString`/`hasOwnProperty` conflicts for key-value maps.
3. "Performance của Object.create?" → V8 creates hidden class matching prototype. Frequent `setPrototypeOf` kills inline caches.

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                       | Level | One-liner                                                        |
| --- | --------------------------- | ----- | ---------------------------------------------------------------- |
| 1   | `[[Prototype]]` & lookup    | 🟢    | Traversal up chain, not copy. `null` = end                       |
| 2   | `__proto__` vs `.prototype` | 🟢    | Constructor property vs instance link                            |
| 3   | `new` keyword CLER          | 🟡    | Create → Link → Execute → Return                                 |
| 4   | Class vs constructor        | 🟡    | Same chain; class adds TDZ, strict, non-enumerable, private      |
| 5   | Prototype pollution         | 🟡    | Deep merge attack; defense: block keys, null-prototype, freeze   |
| 6   | Composition vs inheritance  | 🔴    | Mixin pattern; choose when >2 levels or cross-type sharing       |
| 7   | Debug inherited property    | 🔴    | Systematic: isolate → chain walk → search mutations → freeze dev |
| 8   | Object.create polyfill      | 🔴    | Building block of new + extends + null-prototype                 |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"How does `[1,2,3].map(fn)` actually find the `map` method?"**

**30 giây đầu:**

1. "JavaScript dùng prototype-based lookup — khi truy cập property, JS tìm trên object trước, rồi walk up prototype chain."
2. "Array `[1,2,3]` không có `map` là own property. `[[Prototype]]` trỏ đến `Array.prototype`, nơi `map` được define."
3. "Tất cả arrays share 1 `Array.prototype` object — `map` không được copy vào mỗi array, mà looked up qua chain."
4. "Cùng cơ chế với `class extends` — `extends` setup `[[Prototype]]` links để method lookup walk từ child lên parent."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Viết **4 bước CLER** của `new` từ trí nhớ. Implement `myNew`.                                          |
| 2   | 🎨 Visual      | Vẽ prototype chain: `new Dog('Rex')` extends `Animal` → lên đến `null`.                                |
| 3   | 🛠️ Application | 10,000 User objects cần 5 shared methods. Class, constructor+prototype, hay factory? Memory trade-off? |
| 4   | 🐛 Debug       | `user.greet()` return undefined dù `User.prototype.greet` defined. 3 nguyên nhân?                      |
| 5   | 🎓 Teach       | Giải thích tại sao `arr.map()` hoạt động — cho người không biết code, dùng analogy chung cư.           |

### Key Points

| #   | Key Point                                                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | CLER: (1) Tạo {}, (2) Set [[Prototype]] = Constructor.prototype, (3) Execute constructor this=obj, (4) Return obj (trừ return Object). |
| 2   | rex → Dog.prototype (fetch) → Animal.prototype (speak) → Object.prototype (toString) → null.                                           |
| 3   | Class/prototype: methods shared trên prototype → 1 copy cho 10,000. Factory: copy per instance → 10,000x memory.                       |
| 4   | (1) Typo, (2) `__proto__` bị thay đổi sau new, (3) Own property shadow prototype method.                                               |
| 5   | `arr.map()` = tra "thư viện chung phường" — array không có map riêng, tìm lên kho chung (Array.prototype).                             |

> 🎯 **Feynman Prompt:** Giải thích prototype chain cho non-programmer bằng analogy "tòa chung cư với tiện ích chung."
> 🔁 **Spaced Repetition:** Ôn lại sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track

- [Closures](./04-closures.md) — cả hai về scope & memory; closure = function scope, prototype = object delegation
- [this keyword](./05-this-keyword.md) — `this` trong prototype method = object gọi method (dynamic binding)
- [ES6+ Features](./08-es6-features.md) — class syntax, private fields, Symbol
- [Advanced Patterns](./14-advanced-patterns.md) — Mixins, decorators, composition patterns

### Khác track

- [React Fundamentals](../03-react/01-react-fundamentals.md) — `class Component extends React.Component` = prototype chain
- [TypeScript](../02-typescript/01-typescript-basics.md) — class typing, interface vs type cho prototype patterns
