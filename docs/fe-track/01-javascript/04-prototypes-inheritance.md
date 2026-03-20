# Prototypes & Inheritance / Nguyên Mẫu & Kế Thừa

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Closures](./03-closures.md) | [Scope & Hoisting](./02-scope-hoisting.md)
> **See also**: [this keyword](./05-this-keyword.md) | [Table of Contents](../../00-table-of-contents.md)

[← Previous: Closures](./03-closures.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: The `this` Keyword →](./05-this-keyword.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build một dashboard hiển thị 10,000 `User` objects. Junior dev mới vào team viết:

```javascript
function createUser(name) {
  return {
    name,
    greet() { return `Hello, ${this.name}`; },
    logout() { /* 20 lines */ },
    formatDate() { /* 15 lines */ }
  };
}
```

Production monitor bật alert: **memory usage tăng 400MB** khi load user list. Lý do: mỗi trong 10,000 objects đang giữ **bản copy riêng** của `greet`, `logout`, `formatDate`. 3 functions × 10,000 objects = 30,000 function objects trong heap.

Senior dev fix bằng một dòng:

```javascript
// Thay vì copy vào mỗi object — dùng chung qua prototype
UserPrototype.greet = function() { return `Hello, ${this.name}`; };
```

Memory giảm xuống còn **~4MB**. Đây là lý do prototype tồn tại: **chia sẻ behavior mà không copy data**.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:** Prototype giống **sổ tay quy trình công ty** treo trên tường văn phòng. Mỗi nhân viên (object) có tên và ID riêng, nhưng không cần mang theo cả cuốn sổ — khi cần quy trình nào, họ tra lên tường. Nếu không có trong tập sổ phòng, họ hỏi lên phòng trên (Object.prototype). Cuối cùng là tầng cao nhất (null) — không ai biết → `undefined`.

```
Khi gọi arr.map():
arr          → không có 'map' → tra lên...
Array.prototype  → CÓ 'map' ✓ → dùng ngay, không cần copy
```

**Tại sao phải học topic này?**
- Giải thích được tại sao `class` ES6 không phải OOP kiểu Java — đây là câu hỏi Senior hay hỏi
- Debug được prototype pollution bugs — lỗi bảo mật phổ biến trong production
- Hiểu được tại sao `this` trong class method có thể bị mất (liên quan prototype + binding)

---

## Concept Map / Bản Đồ Khái Niệm

```
[Closures] → [Prototypes & Inheritance] ★ ← bạn đang ở đây
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  Prototype Chain   new keyword    ES6 Class
  (lookup engine)   (4 steps)      (sugar coat)
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                [this keyword] → chapter tiếp theo
                (this trong method = object gọi)

Prototype Chain trong thực tế:
myArr → Array.prototype → Object.prototype → null
myFn  → Function.prototype → Object.prototype → null
{}    → Object.prototype → null
```

**Bạn đang ở đây trong lộ trình học:**
```
Scope → Closures → [PROTOTYPES] → this keyword → Event Loop
```

---

## Overview / Tổng Quan

Prototypes are JavaScript's built-in sharing mechanism: instead of copying methods into every object, objects *delegate* property lookups up a chain to a shared prototype object. Every object has an internal `[[Prototype]]` slot. ES6 `class` syntax is syntactic sugar — under the hood it's still prototype delegation, not classical OOP copying.

JavaScript không copy method vào mỗi object — nó dùng cơ chế **delegation** (ủy quyền): khi object không có property, JS tự động tra lên prototype chain. ES6 `class` trông giống Java nhưng thực chất khác hoàn toàn — đây là trade-off quan trọng nhất cần nhớ khi phỏng vấn.

---

## Core Concepts / Khái Niệm Cốt Lõi

### 1. Prototype Chain / Chuỗi Prototype

> 🧠 **Memory Hook**: "Prototype chain = elevator lookup — JS goes UP until it finds the property or hits the roof (null)"

**Tại sao tồn tại? / Why does this exist?**
JavaScript ban đầu cần một cách để nhiều objects chia sẻ behavior mà không tốn bộ nhớ.
→ **Why?** Vì copy function vào mỗi object = O(n) memory với n objects.
→ **Why?** Vì RAM đắt và JavaScript chạy trên browser với tài nguyên hạn chế (1995). Giải pháp: object không có property thì *hỏi lên trên*, không phải giữ copy.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Hãy nghĩ như tòa chung cư. Mỗi căn hộ (object) có đồ dùng riêng (own properties). Nhưng wifi, thang máy, bể bơi (prototype methods) là **tài sản chung cư** — không ai cần mua riêng. Khi bạn cần bể bơi, bạn đi xuống tầng hầm (prototype). Không có? Lên tòa nhà chính (Object.prototype). Không có? → null (không tồn tại).

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
const animal = { eats: true, walk() { return 'walking'; } };
const rabbit = { jumps: true, __proto__: animal };
const longEar = { earLength: 10, __proto__: rabbit };

longEar.earLength  // Own property → tìm thấy ngay ✓
longEar.jumps      // Not own → look at rabbit → found ✓
longEar.eats       // Not own → rabbit → not own → animal → found ✓
longEar.fly        // Not own → rabbit → animal → Object.prototype → null → undefined
```

```
Prototype Chain Lookup:
┌─────────────────────────────────┐
│ longEar { earLength: 10 }       │ ← look here first
│   [[Prototype]]                 │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ rabbit { jumps: true }          │ ← then here
│   [[Prototype]]                 │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ animal { eats, walk() }         │ ← then here
│   [[Prototype]]                 │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│ Object.prototype { toString..} │ ← built-in ceiling
│   [[Prototype]] = null          │
└─────────────────────────────────┘
             ▼
            null  ← undefined if not found
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

**Performance:** Chuỗi prototype dài = mỗi lookup phải traverse nhiều bước. Arrays và Objects được engine tối ưu, nhưng chuỗi tự tạo sâu >3 cấp là code smell.

**Mutation gotcha:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
Array.prototype.sum = function() { return this.reduce((a,b) => a+b); };
// Đây là PROTOTYPE POLLUTION — ảnh hưởng TẤT CẢ arrays trong app
arr1.sum(); // 6
arr2.sum(); // 15
// Và ảnh hưởng bất kỳ thư viện third-party nào đang dùng
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Dùng `__proto__` trực tiếp trong production code | `__proto__` là deprecated, không phải spec chính thức | Dùng `Object.getPrototypeOf()` / `Object.create()` |
| Thêm method vào `Array.prototype` / `Object.prototype` | Prototype pollution — ảnh hưởng toàn bộ codebase và third-party | Extend class riêng hoặc dùng utility function |
| Nghĩ prototype chain copy data vào child object | Không có gì được copy — chỉ là traversal lúc runtime | Prototype là *live reference*, thay đổi prototype ảnh hưởng tất cả instances |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "tại sao `arr.map` hoạt động", "explain delegation in JS", "`__proto__` vs `prototype`"
- → Nhớ đến: cơ chế **property lookup traversal** — JS đi lên chain, không copy
- → Mở đầu trả lời: *"JavaScript dùng prototype delegation thay vì class copying. Khi bạn gọi `arr.map`, JS không tìm `map` trực tiếp trên `arr` — nó traverse lên `Array.prototype` để tìm method đó."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [Closures](./03-closures.md) — cả hai đều về cách JS manage scope và memory
- ➡️ Để hiểu tiếp: [this keyword](./05-this-keyword.md) — `this` trong prototype method là object thực sự gọi method, không phải prototype

---

### 2. The `new` Keyword / Từ Khóa `new`

> 🧠 **Memory Hook**: "`new` = **C**reate, **L**ink, **E**xecute, **R**eturn" (CLER — 4 bước tạo object)

**Tại sao tồn tại? / Why does this exist?**
Trước `new`, lập trình viên phải thủ công tạo object, set prototype, gọi constructor — 3 bước dễ quên.
→ **Why?** Vì nếu quên set prototype, object không kế thừa gì — lỗi runtime khó debug.
→ **Why?** Vì JavaScript muốn cho phép coding style giống Java (`new X()`) để developer dễ chuyển đổi (1995 context).

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

`new` giống một **máy đúc bánh khuôn**. Bạn đưa bột (arguments) vào, máy tự động: (1) chuẩn bị khuôn trống, (2) gắn khuôn vào tủ công thức chung (prototype), (3) đổ bột và tạo hình, (4) lấy bánh thành phẩm ra. Bạn không cần biết máy hoạt động thế nào — chỉ cần `new Banh(args)`.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.greet = function() { return `Hi, ${this.name}`; };

const john = new Person('John', 30);
```

**Những gì JavaScript thực sự làm:**

```javascript
// Step C — Create: tạo empty object
const __obj = {};

// Step L — Link: gắn prototype
Object.setPrototypeOf(__obj, Person.prototype);

// Step E — Execute: chạy constructor với this = __obj
Person.call(__obj, 'John', 30);
// → __obj.name = 'John', __obj.age = 30

// Step R — Return: trả về __obj (trừ khi constructor return một Object khác)
// const john = __obj;
```

```
Sau khi new Person('John', 30):
┌──────────────────────────┐
│ john (instance)          │
│   name: 'John'           │ ← own properties từ constructor
│   age: 30                │
│   [[Prototype]] ─────────┼──→ Person.prototype { greet: fn }
└──────────────────────────┘            │
                                        │ [[Prototype]]
                                        ▼
                              Object.prototype { toString... }
```

**Constructor return gotcha:**
```javascript
function Weird() {
  this.x = 1;
  return { y: 2 }; // returning an Object overrides the new object!
}
const w = new Weird();
console.log(w.x); // undefined — lost!
console.log(w.y); // 2 — gets the returned object instead

function Fine() {
  this.x = 1;
  return 42; // primitive return is ignored — this is returned
}
const f = new Fine();
console.log(f.x); // 1 — works as expected
```

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```javascript
// Quên new → this = global (non-strict) or throws (strict)
function Person(name) { this.name = name; }
const oops = Person('John'); // strict mode: TypeError! non-strict: window.name = 'John'
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Nghĩ `new` copy methods từ prototype | Không copy — chỉ tạo link `[[Prototype]]` | Instance *delegates* method lookup lên prototype lúc runtime |
| Return object trong constructor không có ý định | Nếu return một object, instance bị thay thế — mất `this` properties | Chỉ return primitive (hoặc không return) trong constructor |
| Gọi constructor function không có `new` | `this` bị trỏ sai (global hoặc TypeError trong strict mode) | Luôn dùng `new`, hoặc dùng factory function pattern |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "explain what `new` does", "implement your own `new`", "why use `new`?"
- → Nhớ đến: **CLER — 4 bước Create/Link/Execute/Return**
- → Mở đầu trả lời: *"`new` thực hiện 4 bước: tạo empty object, gắn nó vào `Constructor.prototype`, chạy constructor body với `this` trỏ vào object đó, rồi trả về object (trừ khi constructor return một object khác)."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: [this keyword](./05-this-keyword.md) — hiểu `this` binding trước khi hiểu `new`
- ➡️ Để hiểu tiếp: ES6 Class syntax — `class` là wrapper gọn hơn quanh constructor + prototype pattern này

---

### 3. ES6 Classes / Lớp ES6

> 🧠 **Memory Hook**: "Class = syntactic sugar — đường bọc bên ngoài, bên trong vẫn là prototype"

**Tại sao tồn tại? / Why does this exist?**
Constructor function + prototype setup dài và dễ quên bước `Object.create(Parent.prototype)` khi setup inheritance.
→ **Why?** Vì developer từ Java/C# thấy JavaScript OOP khó hiểu và code verbose.
→ **Why?** Vì ES6 (2015) muốn attract enterprise developer và giảm barrier to entry — `class` syntax quen thuộc hơn.

#### Layer 1: Simple Analogy / Liên Tưởng Đơn Giản

Class giống **bản thiết kế nhà**. Bản thiết kế không phải ngôi nhà — đó là khuôn mẫu. Khi bạn gọi `new House()`, bạn đang *xây* một ngôi nhà theo bản thiết kế đó. Nhiều nhà (instances) cùng một bản thiết kế (class/prototype), nhưng mỗi nhà độc lập.

#### Layer 2: How It Works / Cơ Chế Hoạt Động

```javascript
// ES6 class syntax:
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} speaks`; }
  static create(name) { return new Animal(name); }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // MUST call before accessing this
    this.breed = breed;
  }
  speak() { return `${super.speak()} (woof!)`; }
}
```

**Bên dưới class là gì?** Hãy dịch sang prototype thuần:

```javascript
// Equivalent prototype code:
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };
Animal.create = function(name) { return new Animal(name); }; // static

function Dog(name, breed) {
  Animal.call(this, name); // super()
  this.breed = breed;
}
Dog.prototype = Object.create(Animal.prototype); // extends
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function() {
  return Animal.prototype.speak.call(this) + ' (woof!)'; // super.speak()
};
```

```
Class hierarchy prototype chain:
┌──────────────┐
│ fido (Dog)   │ name:'Rex', breed:'Lab'
│ [[Proto]]────┼──→ Dog.prototype { speak }
└──────────────┘          │ [[Proto]]
                          ▼
                  Animal.prototype { speak }
                          │ [[Proto]]
                          ▼
                  Object.prototype
                          │
                         null
```

**Class vs Constructor — key differences:**

| Feature | `class` | Constructor fn |
|---------|---------|----------------|
| Hoisting | ❌ Not hoisted (TDZ) | ✅ Hoisted |
| Strict mode | ✅ Always strict | Depends on file |
| Methods enumerable | ❌ Non-enumerable | ✅ Enumerable |
| Call without `new` | ❌ TypeError | ✅ Works (badly) |
| Private fields | ✅ `#field` syntax | ❌ Convention only |

#### Layer 3: Edge Cases & Trade-offs / Trường Hợp Biên

```javascript
// Private fields (ES2022) — true encapsulation:
class BankAccount {
  #balance = 0; // truly private — not accessible outside

  deposit(amount) { this.#balance += amount; }
  get balance() { return this.#balance; }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.balance);   // 100
console.log(acc.#balance);  // SyntaxError — cannot access private field

// Mixins — JS không có multiple inheritance, workaround:
const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify(this); }
};
const Timestamped = (Base) => class extends Base {
  constructor(...args) { super(...args); this.createdAt = new Date(); }
};
class User extends Serializable(Timestamped(Object)) {}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Nghĩ ES6 class là classical OOP như Java | JS dùng prototype delegation, không phải copy | Class là sugar — `instanceof` checks prototype chain, không phải "type" |
| Quên `super()` trong child constructor | `this` chưa được khởi tạo → ReferenceError | Luôn gọi `super(...)` trước khi dùng `this` trong child constructor |
| Dùng class method như callback không bind | Arrow function trong class field hay `bind` trong constructor | `class C { method = () => {} }` (class field arrow) giữ `this` binding |

**🎯 Interview Pattern:**
- Khi thấy câu hỏi về: "class vs prototype", "what does `extends` do internally?", "is JS OOP?"
- → Nhớ đến: **class = sugar over prototype** — syntactically familiar, mechanically different from Java
- → Mở đầu trả lời: *"ES6 class là syntactic sugar — nó tạo ra constructor function và thiết lập prototype chain tự động. `extends` thực chất dùng `Object.create()` để link prototype, không phải copy methods như Java."*

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**
- 📚 Cần biết trước: Constructor functions + `new` keyword (mục 2 bên trên)
- ➡️ Để hiểu tiếp: [Advanced Patterns](./08-advanced-concepts.md) — Mixins, composition over inheritance

---

## Q&A Section / Câu Hỏi Phỏng Vấn

### Q: What is `[[Prototype]]` and how does property lookup work? / `[[Prototype]]` là gì và JS tìm property như thế nào? 🟢 Junior

**A:** Every JS object has an internal `[[Prototype]]` slot pointing to another object (or null). When you access a property, JS first checks the object's own properties. If not found, it traverses the `[[Prototype]]` chain upward until it finds the property or reaches null (→ `undefined`).

Mỗi object JS có slot `[[Prototype]]` trỏ đến object cha. Khi truy cập property, JS tìm trên object trước — không có thì leo lên `[[Prototype]]`, cứ thế đến khi tìm thấy hoặc gặp `null`. Đây là lý do `arr.map` hoạt động dù bạn không định nghĩa `map` trên `arr`.

```javascript
const arr = [1, 2, 3];
// arr.map không nằm trên arr — nằm trên Array.prototype
console.log(arr.hasOwnProperty('map')); // false
console.log(Array.prototype.hasOwnProperty('map')); // true
console.log(arr.__proto__ === Array.prototype); // true
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích được traversal direction (up, not copy), dùng `hasOwnProperty` để distinguish own vs inherited, mention `null` as chain terminus
- ❌ Weak: "Prototype là một kiểu inheritance" — quá chung, không giải thích được cơ chế lookup

---

### Q: What is the difference between `prototype` and `__proto__`? / Sự khác biệt giữa `prototype` và `__proto__`? 🟢 Junior

**A:** `prototype` is a property on **constructor functions** — it's the object that will become `[[Prototype]]` of instances created by that constructor. `__proto__` is a property on **all objects** (instances) that *references* their actual `[[Prototype]]`.

`prototype` là property của **constructor function** (hoặc class) — là object mà các instances sẽ delegate lên. `__proto__` là property của mọi **object instance** — trỏ đến `[[Prototype]]` của nó. Khi gọi `new Foo()`, instance's `__proto__` được set thành `Foo.prototype`.

```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { return 'Woof!'; };

const rex = new Dog('Rex');

// .prototype: chỉ có trên constructor function
console.log(Dog.prototype);          // { bark: fn, constructor: Dog }
console.log(rex.prototype);          // undefined (instances không có .prototype)

// __proto__: trỏ đến [[Prototype]] của instance
console.log(rex.__proto__);          // Dog.prototype
console.log(rex.__proto__ === Dog.prototype); // true
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Phân biệt rõ "property of function" vs "property of instance", biết cách check đúng với `Object.getPrototypeOf()` thay vì `__proto__`
- ❌ Weak: Nhầm lẫn 2 khái niệm hoặc chỉ nói "chúng giống nhau" — đây là lỗi phổ biến

---

### Q: What are the 4 steps the `new` keyword performs? / Từ khóa `new` thực hiện 4 bước gì? 🟢 Junior

**A:** `new Constructor(args)` does: (1) Create a new empty object, (2) Link `[[Prototype]]` to `Constructor.prototype`, (3) Execute constructor body with `this` = new object, (4) Return the object (unless constructor returns another object explicitly).

`new` làm 4 bước: Tạo object rỗng, gắn `[[Prototype]]` vào `Constructor.prototype`, chạy constructor với `this` trỏ vào object mới, trả về object đó. Nếu constructor return một object khác → object đó được dùng thay thế (ít gặp nhưng là gotcha quan trọng).

```javascript
// Manual implementation of new:
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype); // Steps 1 + 2
  const result = Constructor.apply(obj, args);       // Step 3
  return result instanceof Object ? result : obj;    // Step 4
}

function Cat(name) { this.name = name; }
Cat.prototype.meow = function() { return `${this.name} says meow`; };

const c1 = new Cat('Kitty');
const c2 = myNew(Cat, 'Kitty');
console.log(c1.meow()); // "Kitty says meow"
console.log(c2.meow()); // "Kitty says meow" — identical
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Có thể implement `myNew` from scratch, biết constructor return-object override gotcha
- ❌ Weak: Chỉ nói "new tạo instance" — thiếu hiểu biết về prototype linking (step 2 quan trọng nhất)

---

### Q: What are key differences between ES6 `class` and constructor functions? / Sự khác biệt chính giữa `class` ES6 và constructor function? 🟡 Mid

**A:** Both create the same prototype chain. Key behavioral differences: (1) Classes are not hoisted (TDZ), (2) Classes always run in strict mode, (3) Class methods are non-enumerable (won't appear in `for...in`), (4) Classes must be called with `new` (TypeError otherwise), (5) Classes support `#privateFields` natively.

Cả hai đều tạo cùng prototype chain — đây là điểm quan trọng nhất. Sự khác biệt: class không hoisted (TDZ), luôn strict mode, methods non-enumerable, phải dùng `new`, hỗ trợ private fields với `#`. Khi phỏng vấn, nhấn mạnh rằng đây là **cùng cơ chế, khác syntax** — không phải 2 hệ thống inheritance khác nhau.

```javascript
// Hoisting difference:
const c = new MyClass(); // ReferenceError: Cannot access 'MyClass' before init
class MyClass {}

const f = new MyFn(); // Works! — function hoisted
function MyFn() {}

// Enumerability:
class A { method() {} }
function B() {}
B.prototype.method = function() {};

console.log(Object.keys(A.prototype)); // [] — non-enumerable
console.log(Object.keys(B.prototype)); // ['method'] — enumerable

// Both produce same prototype chain:
class C {}
function D() {}
console.log(typeof C); // 'function' — class IS a function under the hood
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: "Cùng cơ chế, khác behavior" — liệt kê được ít nhất 3/5 differences, biết `typeof class` là `'function'`
- ❌ Weak: "Class mới hơn và tốt hơn" — không giải thích được trade-off hoặc không biết cả 2 tạo cùng prototype chain

---

### Q: What is prototype pollution and why is it dangerous? / Prototype pollution là gì và tại sao nguy hiểm? 🟡 Mid

**A:** Prototype pollution occurs when attacker-controlled input is used to modify `Object.prototype` (or other built-in prototypes), causing all objects to inherit the injected properties. This can lead to property injection attacks, privilege escalation, or DoS.

Prototype pollution xảy ra khi input được dùng để modify `Object.prototype`. Vì mọi object đều delegate lên `Object.prototype`, property bị inject sẽ appear trên mọi object trong app. Nguy hiểm đặc biệt với deep merge patterns kiểu `_.merge(obj, untrustedInput)`.

```javascript
// Vulnerable deep merge:
function deepMerge(target, source) {
  for (let key of Object.keys(source)) {
    if (typeof source[key] === 'object') {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]); // recurse
    } else {
      target[key] = source[key];
    }
  }
}

// Attacker input:
const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
deepMerge({}, malicious);

// Now ALL objects have isAdmin: true
const user = {};
console.log(user.isAdmin); // true — pollution!

// Fix: check for __proto__ and prototype keys:
function safeMerge(target, source) {
  for (let key of Object.keys(source)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue; // skip!
    // ... rest of merge
  }
}

// Or use Object.create(null) for data containers (no prototype at all):
const safeMap = Object.create(null); // no __proto__ at all
```

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Giải thích được attack vector (deep merge + JSON input), biết `Object.create(null)` as defense, biết check `hasOwnProperty` vs inherited
- ❌ Weak: "Prototype pollution là modify prototype của object" — không đề cập security impact hay cách prevent

---

### Q: Design a pattern to achieve composition over inheritance in JavaScript. When would you choose it over `extends`? / Thiết kế pattern composition over inheritance trong JS. Khi nào chọn thay vì `extends`? 🔴 Senior

**A:** Use mixins or factory functions to compose behavior from multiple sources instead of creating deep inheritance chains. Choose composition when: (a) you need to share behavior across unrelated classes (can't `extends` two parents), (b) your inheritance chain is >2 levels deep and becoming rigid, (c) you want to avoid the Gorilla-Banana problem (getting the whole jungle when you want one method).

Dùng mixin pattern hoặc factory functions thay vì `extends` sâu. Chọn composition khi: cần share behavior từ nhiều nguồn (JS không có multiple inheritance), chain >2 cấp trở nên brittle, hoặc muốn tránh over-inheriting. Trade-off: composition code verbose hơn, nhưng linh hoạt và testable hơn.

```javascript
// Problem: Deep inheritance chain
class Animal extends LivingThing extends PhysicalEntity { ... }
// Dog needs to fly and swim — but those are on Bird and Fish chains!

// Solution: Behavior mixins via factory functions
const Flyable = (Base) => class extends Base {
  fly() { return `${this.name} is flying`; }
  land() { return `${this.name} landed`; }
};

const Swimmable = (Base) => class extends Base {
  swim() { return `${this.name} is swimming`; }
  dive(depth) { return `${this.name} dives to ${depth}m`; }
};

const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify(this); }
  static deserialize(data) { return Object.assign(new this(), JSON.parse(data)); }
};

// Compose freely:
class Duck extends Flyable(Swimmable(Animal)) {
  constructor(name) { super(name); }
  quack() { return 'Quack!'; }
}

class FlyingFish extends Flyable(Animal) {}

const donald = new Duck('Donald');
donald.fly();     // "Donald is flying"
donald.swim();    // "Donald is swimming"
donald.quack();   // "Quack!"
console.log(donald instanceof Animal); // true

// Alternative: pure functional composition (no classes):
const withFly = (obj) => ({ ...obj, fly: () => `${obj.name} flies` });
const withSwim = (obj) => ({ ...obj, swim: () => `${obj.name} swims` });
const createDuck = (name) => withFly(withSwim({ name }));
const duck = createDuck('Donald');
// Simpler, no prototype chain, easily testable per mixin
```

**When to choose `extends` instead:** Simple, stable hierarchies where IS-A relationship is genuinely correct (e.g., `AdminUser extends User`), and team understands JS prototype model deeply.

Chọn `extends` khi: hierarchy thực sự là IS-A relationship ổn định (không thay đổi), không quá 2 cấp sâu. Chọn composition khi: cần reuse behavior across unrelated types, hoặc anticipate frequent changes in behavior requirements.

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Implement working mixin pattern, articulate Gorilla-Banana problem, give concrete "when to use which" decision criteria, mention testability trade-off
- ❌ Weak: "Composition tốt hơn inheritance" — không giải thích được tại sao hay khi nào, không có code example

---

### Q: How would you detect and fix an inherited property causing a bug in a large codebase? Describe your debugging approach. / Làm sao phát hiện và fix property kế thừa gây bug trong codebase lớn? Mô tả approach debug. 🔴 Senior

**A:** The debugging approach involves distinguishing own properties from inherited ones, tracing the prototype chain, and isolating where the unexpected property originates.

Khi gặp bug liên quan prototype, cần distinguish own vs inherited, trace chain, isolate origin. Classic symptom: property tồn tại trên object nhưng không được explicitly set — đây là signal của inherited property hoặc prototype pollution.

```javascript
// Symptom: unexpected property on objects
function debugPrototypeIssue(obj) {
  console.log('=== Own properties ===');
  console.log(Object.keys(obj)); // only enumerable own

  console.log('=== All own properties (incl. non-enumerable) ===');
  console.log(Object.getOwnPropertyNames(obj));

  console.log('=== Full prototype chain ===');
  let proto = Object.getPrototypeOf(obj);
  let level = 0;
  while (proto !== null) {
    console.log(`Level ${level}:`, Object.getOwnPropertyNames(proto));
    proto = Object.getPrototypeOf(proto);
    level++;
  }
}

// Check if property is own or inherited:
function propertySource(obj, prop) {
  if (obj.hasOwnProperty(prop)) return 'own';
  let proto = Object.getPrototypeOf(obj);
  let level = 1;
  while (proto !== null) {
    if (proto.hasOwnProperty(prop)) return `prototype level ${level}`;
    proto = Object.getPrototypeOf(proto);
    level++;
  }
  return 'not found';
}

// Fix: sanitize input with Object.create(null) for data maps
const config = Object.create(null); // no prototype chain — pure data
// OR: always use hasOwnProperty when iterating
for (const key in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, key)) { /* safe */ }
}

// Fix prototype pollution: Object.freeze built-ins (dev only):
if (process.env.NODE_ENV === 'development') {
  Object.freeze(Object.prototype);
  // Now mutations throw TypeError → detect pollution early
}
```

**Production debugging checklist:**
1. Reproduce with `console.log(Object.keys(obj))` vs `for...in` — difference = inherited props
2. `Object.getPrototypeOf(obj)` chain walk to find origin
3. Search codebase for mutations to `.prototype` of built-ins
4. Check third-party libraries for prototype pollution (npm audit + snyk)
5. Add `Object.freeze(Object.prototype)` in test environment to catch violations early

**💡 Dấu hiệu trả lời tốt / Interview Signal:**
- ✅ Strong: Systematic approach (isolate → trace → fix), biết `Object.freeze` trick cho dev, mention security angle, biết khi nào dùng `Object.create(null)`
- ❌ Weak: "Dùng `hasOwnProperty`" — đúng nhưng không đủ, không có systematic debugging process

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question | Level | Key Point |
|----------|-------|-----------|
| What is `[[Prototype]]` and property lookup? | 🟢 | Delegation traversal up chain, not copying |
| `prototype` vs `__proto__`? | 🟢 | Constructor property vs instance property |
| 4 steps of `new`? | 🟢 | Create, Link, Execute, Return (CLER) |
| Class vs constructor function differences? | 🟡 | Same chain, different: hoisting, strict, enumerable, new-required |
| What is prototype pollution? | 🟡 | Security: injecting props into Object.prototype via untrusted input |
| Composition over inheritance — design & when? | 🔴 | Mixin pattern, Gorilla-Banana, IS-A vs HAS-A decision |
| Debug inherited property bug? | 🔴 | Systematic: isolate own vs inherited, chain walk, freeze in dev |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer asks cold: **"Explain how prototypal inheritance works in JavaScript and how it differs from classical inheritance."**

**30 giây đầu — mở đầu lý tưởng / Ideal 30-second opening:**
1. "JavaScript uses *prototype delegation*, not class copying — when you access a property, JS traverses a chain of linked objects upward until it finds it or hits null."
2. "Under the hood, every object has a `[[Prototype]]` slot; ES6 `class` syntax sets this up automatically but doesn't change the mechanism."
3. "In classical OOP like Java, classes *copy* method definitions into each instance; in JS, instances *delegate* to a shared prototype object — that's why 10,000 arrays share one `Array.prototype.map` reference in memory."
4. "The trade-off: JS prototype chains are more memory-efficient and flexible, but less strict — there's no enforced interface contract, and mutation of shared prototypes can cause bugs across the entire codebase."

*Sau đó mở rộng theo hướng interviewer dẫn dắt: memory model, security (prototype pollution), class sugar vs ES5 pattern, composition vs inheritance.*

---

## Self-Check / Tự Kiểm Tra ⚡
> **Đóng tài liệu lại trước khi làm — Close the doc before attempting.**

- [ ] **Retrieval**: Viết ra từ trí nhớ: 4 bước `new` thực hiện (không nhìn lại). So sánh với CLER pattern.
- [ ] **Visual**: Vẽ prototype chain của `new Dog('Rex')` trên giấy: instance → Dog.prototype → Animal.prototype → Object.prototype → null. So sánh với ASCII diagram trên.
- [ ] **Application**: Bạn có 10,000 User objects cần 5 shared methods. Dùng class, constructor+prototype, hay factory function? Giải thích memory trade-off.
- [ ] **Debug**: Code trả về `undefined` khi gọi `user.greet()` dù `User.prototype.greet` đã được định nghĩa. 3 nguyên nhân khả năng nhất?
- [ ] **Teach**: Giải thích "tại sao `arr.map` hoạt động dù bạn không define nó" cho người không biết code — dùng liên tưởng cụ thể.

💬 **Feynman Prompt:** Giải thích prototype chain cho người không biết lập trình bằng liên tưởng "tòa chung cư với tiện ích chung". Không dùng từ "object", "prototype", "inherit".

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày → 7 ngày → 14 ngày** để chuyển vào long-term memory.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Closures](./03-closures.md) — cả hai dùng lexical environment; closure là encapsulation via function scope, prototype là encapsulation via chain
- ➡️ **Enables:** [this keyword](./05-this-keyword.md) — `this` trong prototype method = object *thực sự* gọi method (dynamic binding)
- 🔗 **Applied in:** React class components (deprecated but still in legacy codebases), Node.js EventEmitter, Express middleware chain
