# JavaScript Advanced Patterns - Theory / Patterns JavaScript Nâng Cao - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**NestJS API server:** 50 API endpoints đều cần: authentication check, rate limiting, logging, error handling. Option A: add these 4 concerns manually in every handler → 200 lines of duplicate code, easily forgotten. Option B: Decorators: `@Auth @RateLimit @Log @HandleErrors`. One decorator applied once — cross-cutting concerns separated from business logic. TypeScript decorators are used everywhere in Angular, NestJS, and MobX exactly for this pattern.

**Bài học:** Advanced patterns solve _structural_ problems — not "how to write logic" but "how to organize code at scale". Decorators, Mixins, and Proxy are the JavaScript equivalent of AOP (Aspect-Oriented Programming) and flexible composition patterns.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Decorators = đầu bếp quấn thức ăn vào lá chuối (wrapping) — thêm flavor mà không thay đổi nội dung bên trong. Mixins = LEGO bricks — ghép capabilities từ nhiều nguồn thay vì inherit từ một parent. Proxy = người bảo vệ đứng trước đối tượng — intercept mọi thao tác.

**Scope:** Note: Proxy and Symbol are also covered in depth in [11-es6-features-deep.md](./11-es6-features-deep.md). This file focuses on Decorators, Mixins, and advanced Object composition patterns.

## Concept Map / Bản Đồ Khái Niệm

```
[Advanced JavaScript Patterns]
        │
        ├── Decorators (cross-cutting concerns)
        │       ├── Class decorator: modify class constructor/prototype
        │       ├── Method decorator: wrap function with behavior
        │       ├── Property decorator: modify property descriptor
        │       └── Execution order: @C @B @A fn → A wraps → B wraps → C wraps
        │
        ├── Mixins (composition over inheritance)
        │       ├── Problem: deep class hierarchies → fragile, diamond problem
        │       ├── Mixin factory: function returning class extending Base
        │       └── Use: const Mixed = LogMixin(SerializeMixin(Base))
        │
        ├── Advanced Object Patterns
        │       ├── Object.defineProperty → writable, enumerable, configurable, get/set
        │       ├── Object.freeze/seal → immutability levels
        │       ├── Property descriptors → deep control over property behavior
        │       └── Object.assign / spread → shallow merge patterns
        │
        └── Well-known Symbols
                Symbol.iterator → makes object iterable (for...of, spread)
                Symbol.toPrimitive → control coercion (hint: number/string/default)
                Symbol.hasInstance → control instanceof behavior
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Decorators — Cross-Cutting Concerns as Functions

**🧠 Memory Hook:** "**A decorator is a function that takes a function and returns a function. The outer function adds behavior; the inner function does the real work.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do cross-cutting concerns (logging, auth, timing) need a special pattern? Because duplicating them in every function violates DRY and scatters the concern across the codebase. When the auth logic changes, you update 50 functions
- Why is the decorator pattern preferred over inheritance for this? Because inheritance couples the concern to the class hierarchy. A decorator is composable and reusable across unrelated classes — `@Memoize` can wrap any function, not just subclasses of `MemoizableBase`
- Why does execution order matter for stacked decorators? Because decorators are applied bottom-to-top: `@Log @Validate fn` means `log(validate(fn))`. The outermost decorator runs first when the function is called

**Visual — Decorator Mechanics:**

```javascript
// Manual decorator (how it works without syntax sugar):
function memoize(fn) {
  const cache = new Map()
  return function(...args) {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// Usage:
const expensive = memoize(function computeFibonacci(n) {
  if (n <= 1) return n
  return computeFibonacci(n - 1) + computeFibonacci(n - 2)
})

// TypeScript decorator syntax (TC39 Stage 3):
class UserService {
  @log           // executes 3rd (outermost)
  @validate      // executes 2nd
  @memoize       // executes 1st (innermost — wraps fn first)
  async getUser(id: string): Promise<User> {
    return await db.find(id)
  }
}
// Stacking order: memoize wraps fn → validate wraps memoized → log wraps validated
// Call order: log's code → validate's code → memoize's code → original fn

// NestJS real-world example:
@Controller('/users')
@UseGuards(AuthGuard)
class UserController {
  @Get('/:id')
  @RateLimit({ max: 100, window: '1m' })
  async getUser(@Param('id') id: string) { ... }
}
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `@memoize` on async functions without cache key design | Async return is a Promise — concurrent same-key calls may each trigger execution instead of sharing | Serialize args to cache key; return the same in-flight Promise for concurrent same-key calls |
| Decorators mutating the original class/method | Mutating the descriptor changes behavior for all consumers and breaks composability | Return a new wrapped version — preserve original via `Reflect.apply` |
| Forgetting `this` context in decorator implementation | `this` is lost when the wrapped function is detached from its original call site | Use `fn.apply(this, args)` or arrow wrapper to preserve receiver |
| TypeScript decorators = TC39 decorators | TypeScript had a legacy `experimentalDecorators` syntax before TC39 Stage 3 — incompatible APIs | They are different APIs — TC39 Stage 3 uses `accessor` keyword and a different descriptor shape |

**🎯 Interview Pattern:**

- **Trigger**: "cross-cutting concerns" / "how NestJS/Angular decorators work" / "memoization"
- **Concept**: Higher-order function that wraps behavior; stacked decorators execute bottom-up
- **Opening**: "A decorator is a higher-order function — it takes a function (or class method) and returns a new function that adds behavior. The classic example is memoization: the decorator wraps the original with a cache lookup. In TypeScript frameworks like NestJS, stacked decorators like `@Auth @RateLimit @Log` each wrap the handler from bottom to top..."

**🔑 Knowledge Chain:**

- **Prereq**: Higher-order functions, closures, `apply`/`this` binding
- **Enables**: NestJS/Angular decorator usage, implementing memoization/retry/timing utilities, AOP patterns

---

### 2. Mixins — Composition Over Inheritance

**🧠 Memory Hook:** "**Inheritance = 'IS-A' (one parent only). Mixin = 'CAN-DO' (compose multiple capabilities). JavaScript class mixins = functions that return classes.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is deep inheritance problematic? Because it creates tight coupling — subclasses depend on all ancestors. Changing `Animal` can break `Dog → CanineAnimal → Animal`. The "fragile base class" problem
- Why can't you just use multiple inheritance? JavaScript classes only support single inheritance. Even if they didn't, the diamond problem (two parents both inherit from same grandparent — which version of the method do you use?) creates ambiguity
- Why do functional mixins solve this? A mixin is a factory function that adds capabilities to any class. `const WithLogging = (Base) => class extends Base { log() {...} }`. You compose: `class MyClass extends WithLogging(WithRetry(BaseClass))` — clean, explicit, no ambiguity

**Visual — Mixin Pattern:**

```javascript
// Problem: Can't inherit from both EventEmitter AND Serializable
// class Widget extends EventEmitter, Serializable { }  // ← INVALID

// Mixin solution:
const Serializable = (Base) =>
  class extends Base {
    serialize() {
      return JSON.stringify(this);
    }
    static deserialize(data) {
      return Object.assign(new this(), JSON.parse(data));
    }
  };

const Loggable = (Base) =>
  class extends Base {
    log(msg) {
      console.log(`[${this.constructor.name}] ${msg}`);
    }
  };

const EventEmittable = (Base) =>
  class extends Base {
    on(event, handler) {
      /* ... */
    }
    emit(event, data) {
      /* ... */
    }
  };

// Compose capabilities:
class Widget extends Serializable(Loggable(EventEmittable(HTMLElement))) {
  constructor(props) {
    super(props);
    this.log("Widget created");
  }
}

// Alternative: functional mixin (Object.assign approach)
const TimestampMixin = {
  createdAt: null,
  init() {
    this.createdAt = Date.now();
  },
};

Object.assign(Widget.prototype, TimestampMixin);
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Method name collision between mixins (silent overwrite) | Later mixin silently overwrites earlier mixin's method — no runtime error; hidden bug | Check for conflicts before applying; document which mixin owns which methods |
| Using `Object.assign` for class-based mixins (copies, not inherits) | `Object.assign` copies methods as own properties — no prototype chain, no proper `instanceof` | Use functional mixins: `(Base) => class extends Base` for proper prototype chain |
| Deep class hierarchies trying to avoid mixins | Tight coupling, fragile base class problem — changing root breaks everything downstream | Prefer composition (mixins) over deep hierarchies; 3+ levels is a code smell |
| Mixing concerns (one mixin does logging + auth + caching) | Violates Single Responsibility — hard to test, impossible to apply concerns selectively | One mixin, one concern — same SRP as modules and classes |

**🎯 Interview Pattern:**

- **Trigger**: "multiple inheritance" / "composition vs inheritance" / "share behavior across unrelated classes"
- **Concept**: Functional mixin factory pattern; composition vs inheritance
- **Opening**: "JavaScript doesn't have multiple inheritance, but mixins solve the same problem through composition. A mixin is a function that takes a base class and returns a new class extending it with additional capabilities. You compose them: `class Foo extends A(B(C(Base)))`. Each adds one concern — no diamond problem, explicit composition..."

**🔑 Knowledge Chain:**

- **Prereq**: JavaScript classes, prototype chain, higher-order functions
- **Enables**: React Higher-Order Components (same principle), Vue 2 mixins, TypeScript interfaces + mixin composition

---

### 3. Property Descriptors — Deep Object Control

**🧠 Memory Hook:** "**Every object property has a descriptor: 4 flags — writable, enumerable, configurable, and value (or get/set for accessors).**"

**Why does this exist? / Tại sao tồn tại?**

- Why do plain property assignments not give you enough control? `obj.x = 5` creates a writable, enumerable, configurable property. But what if you want a constant that can't be changed even by accident? Or a computed property that recalculates on access?
- Why does `Object.freeze` not affect nested objects? Because `freeze` marks all own properties as `writable: false, configurable: false` — but property values that are objects are still references to mutable objects. You need deep freeze for full immutability.
- Why does `enumerable: false` matter? Non-enumerable properties are hidden from `for...in`, `Object.keys()`, and `JSON.stringify`. This is how many built-in methods work — `toString`, `hasOwnProperty` are non-enumerable on Object.prototype, which is why they don't show up in `for...in` loops.

**Visual — Property Descriptors:**

```javascript
// All properties have these flags:
Object.defineProperty(obj, "version", {
  value: "1.0.0",
  writable: false, // can't change the value
  enumerable: false, // hidden from for...in, Object.keys, JSON.stringify
  configurable: false, // can't delete or redefine the property
});

// Accessor descriptor (get/set):
Object.defineProperty(obj, "fullName", {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(name) {
    [this.firstName, this.lastName] = name.split(" ");
  },
  enumerable: true,
  configurable: true,
});

// Immutability levels:
const obj = { a: 1, nested: { b: 2 } };
Object.freeze(obj);
obj.a = 999; // silently fails (strict: throws TypeError)
obj.nested.b = 999; // WORKS — freeze is shallow!

// Check descriptor:
Object.getOwnPropertyDescriptor(obj, "a");
// { value: 1, writable: false, enumerable: true, configurable: false }

// Object.seal: no new props, no delete — but existing props still writable
// Object.freeze: no new props, no delete, no mutation of existing props (shallow)
```

**Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `Object.freeze` thinking it deeply freezes nested objects | `freeze` only locks own properties — nested objects remain fully mutable | Freeze is shallow — need recursive deep freeze for nested immutability |
| Forgetting `enumerable: true` when using `defineProperty` | Default `enumerable` for `defineProperty` is `false` — property won't appear in `Object.keys` or `JSON.stringify` | Explicitly set `enumerable: true` if the property should be visible in iteration/serialization |
| `configurable: false` with `writable: true` — can you later make it non-writable? | Counter-intuitive: `configurable: false` blocks most changes, but `writable` can still be tightened | Yes: `writable` can go `true → false` even with `configurable: false`, but not `false → true` |
| Using `delete obj.prop` on a `configurable: false` property | Silently fails in sloppy mode — the bug is invisible without strict mode | Silently fails in sloppy mode, throws `TypeError` in strict mode — always use strict mode |

**🎯 Interview Pattern:**

- **Trigger**: "immutable object" / "getter/setter" / "hide a property from JSON" / "Object.freeze"
- **Concept**: 4-flag property descriptor; freeze is shallow; accessor properties
- **Opening**: "Every object property has a 4-flag descriptor: `writable`, `enumerable`, `configurable`, and either `value` for data properties or `get`/`set` for accessor properties. `Object.freeze` sets `writable: false, configurable: false` on all own properties — but it's shallow. Nested objects are still mutable. For true immutability you need a recursive deep freeze..."

**🔑 Knowledge Chain:**

- **Prereq**: Objects, prototype chain, property access
- **Enables**: Vue 3 reactivity (`Object.defineProperty` for Vue 2 reactivity, Proxy for Vue 3), immutable state patterns, private-by-convention APIs

---

## Reference Theory / Tài Liệu Tham Khảo

## Decorators / Decorators

### Decorator Pattern Theory / Lý Thuyết Pattern Decorator

**English:** Decorators are a design pattern that allows behavior to be added to objects dynamically without affecting other objects.

**Tiếng Việt:** Decorators là một design pattern cho phép thêm hành vi vào objects động mà không ảnh hưởng đến objects khác.

```typescript
// Decorator implementation
// Triển khai decorator

/**
 * Decorator Types:
 * 1. Class Decorators
 * 2. Method Decorators
 * 3. Property Decorators
 * 4. Parameter Decorators
 */

// Class Decorator
// Decorator lớp
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class SealedClass {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Method Decorator
// Decorator phương thức
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property Decorator
// Decorator thuộc tính
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false,
  });
}

class Person {
  @readonly
  id: number = 123;
}

// Advanced Decorator Factory
// Factory decorator nâng cao
function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Cache hit");
      return cache.get(key);
    }

    console.log("Cache miss");
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class Fibonacci {
  @memoize
  calculate(n: number): number {
    if (n <= 1) return n;
    return this.calculate(n - 1) + this.calculate(n - 2);
  }
}

// Decorator Composition
// Kết hợp decorators
function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (args.some((arg) => typeof arg !== "number")) {
      throw new TypeError("All arguments must be numbers");
    }
    return originalMethod.apply(this, args);
  };

  return descriptor;
}

function timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };

  return descriptor;
}

class MathOperations {
  @timing
  @validate
  @memoize
  complexCalculation(a: number, b: number): number {
    // Expensive calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += a * b;
    }
    return result;
  }
}

// Parameterized Decorators
// Decorators có tham số
function retry(maxAttempts: number, delay: number = 1000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`Attempt ${attempt} failed, retrying...`);

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

class ApiClient {
  @retry(3, 2000)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    return response.json();
  }
}

// Decorator Metadata
// Metadata decorator
const metadataKey = Symbol("metadata");

function metadata(key: string, value: any) {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      // Method decorator
      const existingMetadata = Reflect.getMetadata(metadataKey, target, propertyKey) || {};
      Reflect.defineMetadata(
        metadataKey,
        { ...existingMetadata, [key]: value },
        target,
        propertyKey,
      );
    } else {
      // Class decorator
      const existingMetadata = Reflect.getMetadata(metadataKey, target) || {};
      Reflect.defineMetadata(metadataKey, { ...existingMetadata, [key]: value }, target);
    }
  };
}

@metadata("version", "1.0.0")
@metadata("author", "John Doe")
class AnnotatedClass {
  @metadata("description", "Adds two numbers")
  add(a: number, b: number): number {
    return a + b;
  }
}
```

---

## Mixins / Mixins

### Mixin Pattern Theory / Lý Thuyết Pattern Mixin

**English:** Mixins are a way to add functionality to classes through composition rather than inheritance.

**Tiếng Việt:** Mixins là cách thêm chức năng vào classes thông qua composition thay vì inheritance.

```typescript
// Mixin implementation
// Triển khai mixin

// Basic Mixin
// Mixin cơ bản
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();

    getTimestamp() {
      return this.timestamp;
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate() {
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
    }
  };
}

// Apply mixins
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const TimestampedUser = Timestamped(User);
const ActiveUser = Activatable(TimestampedUser);

const user = new ActiveUser("John");
user.activate();
console.log(user.getTimestamp());
console.log(user.isActive);

// Functional Mixins
// Mixins hàm
const canEat = {
  eat(food: string) {
    console.log(`Eating ${food}`);
  },
};

const canWalk = {
  walk() {
    console.log("Walking");
  },
};

const canSwim = {
  swim() {
    console.log("Swimming");
  },
};

// Compose mixins
function mixin(target: any, ...sources: any[]) {
  Object.assign(target, ...sources);
}

class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class Duck extends Animal {
  constructor(name: string) {
    super(name);
    mixin(this, canEat, canWalk, canSwim);
  }
}

// Advanced Mixin with State
// Mixin nâng cao với state
function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }

    static deserialize<T>(this: Constructor<T>, json: string): T {
      const obj = JSON.parse(json);
      return Object.assign(new this(), obj);
    }
  };
}

function Validatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private validators: Map<string, (value: any) => boolean> = new Map();

    addValidator(field: string, validator: (value: any) => boolean) {
      this.validators.set(field, validator);
    }

    validate(): boolean {
      for (const [field, validator] of this.validators) {
        const value = (this as any)[field];
        if (!validator(value)) {
          console.log(`Validation failed for ${field}`);
          return false;
        }
      }
      return true;
    }
  };
}

class Product {
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

const ValidatableProduct = Validatable(Serializable(Product));

const product = new ValidatableProduct("Laptop", 999);
product.addValidator("price", (price) => price > 0);
console.log(product.validate()); // true
console.log(product.serialize()); // JSON string

// Mixin Factory
// Factory mixin
interface EventEmitter {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, ...args: any[]): void;
}

function EventEmitterMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements EventEmitter {
    private events: Map<string, Set<Function>> = new Map();

    on(event: string, handler: Function): void {
      if (!this.events.has(event)) {
        this.events.set(event, new Set());
      }
      this.events.get(event)!.add(handler);
    }

    off(event: string, handler: Function): void {
      this.events.get(event)?.delete(handler);
    }

    emit(event: string, ...args: any[]): void {
      this.events.get(event)?.forEach((handler) => handler(...args));
    }
  };
}

class Button {
  label: string;

  constructor(label: string) {
    this.label = label;
  }

  click() {
    console.log(`Button ${this.label} clicked`);
  }
}

const EventButton = EventEmitterMixin(Button);
const button = new EventButton("Submit");

button.on("click", () => console.log("Click handler 1"));
button.on("click", () => console.log("Click handler 2"));
button.emit("click");

// Multiple Inheritance Simulation
// Mô phỏng đa kế thừa
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      );
    });
  });
}

class Disposable {
  isDisposed: boolean = false;

  dispose() {
    this.isDisposed = true;
  }
}

class Activatable2 {
  isActive: boolean = false;

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}

class SmartObject implements Disposable, Activatable2 {
  // Disposable
  isDisposed: boolean = false;
  dispose!: () => void;

  // Activatable
  isActive: boolean = false;
  activate!: () => void;
  deactivate!: () => void;

  constructor() {
    // Initialize
  }

  interact() {
    this.activate();
  }
}

applyMixins(SmartObject, [Disposable, Activatable2]);

const obj = new SmartObject();
obj.activate();
console.log(obj.isActive); // true
obj.dispose();
console.log(obj.isDisposed); // true
```

---

## Proxies and Reflection / Proxies và Reflection

### Proxy Pattern Theory / Lý Thuyết Pattern Proxy

**English:** Proxies allow you to intercept and customize operations performed on objects.

**Tiếng Việt:** Proxies cho phép bạn chặn và tùy chỉnh các thao tác được thực hiện trên objects.

```typescript
// Proxy implementation
// Triển khai proxy

// Basic Proxy
// Proxy cơ bản
const target = {
  name: "John",
  age: 30,
};

const handler: ProxyHandler<typeof target> = {
  get(target, property, receiver) {
    console.log(`Getting ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },

  set(target, property, value, receiver) {
    console.log(`Setting ${String(property)} to ${value}`);
    return Reflect.set(target, property, value, receiver);
  },
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // Logs: Getting name, then: John
proxy.age = 31; // Logs: Setting age to 31

// Validation Proxy
// Proxy xác thực
interface User {
  name: string;
  email: string;
  age: number;
}

function createValidatedUser(user: User): User {
  return new Proxy(user, {
    set(target, property, value) {
      switch (property) {
        case "email":
          if (!value.includes("@")) {
            throw new Error("Invalid email");
          }
          break;
        case "age":
          if (typeof value !== "number" || value < 0) {
            throw new Error("Invalid age");
          }
          break;
      }

      return Reflect.set(target, property, value);
    },
  });
}

const user2 = createValidatedUser({
  name: "John",
  email: "john@example.com",
  age: 30,
});

// user2.email = 'invalid'; // Throws error
user2.age = 31; // OK

// Observable Pattern with Proxy
// Pattern Observable với Proxy
function observable<T extends object>(
  target: T,
  callback: (property: string, value: any) => void,
): T {
  return new Proxy(target, {
    set(target, property, value) {
      const result = Reflect.set(target, property, value);
      callback(String(property), value);
      return result;
    },
  });
}

const state = observable({ count: 0, name: "Counter" }, (property, value) => {
  console.log(`${property} changed to ${value}`);
});

state.count = 1; // Logs: count changed to 1
state.name = "New Counter"; // Logs: name changed to New Counter

// Negative Array Indices
// Chỉ số mảng âm
function createNegativeArray<T>(arr: T[]): T[] {
  return new Proxy(arr, {
    get(target, property) {
      const index = Number(property);

      if (Number.isInteger(index) && index < 0) {
        return target[target.length + index];
      }

      return Reflect.get(target, property);
    },
  });
}

const arr = createNegativeArray([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4

// Private Properties with Proxy
// Thuộc tính riêng tư với Proxy
function createPrivateProps<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, property) {
      if (String(property).startsWith("_")) {
        throw new Error(`Cannot access private property ${String(property)}`);
      }
      return Reflect.get(target, property);
    },

    set(target, property, value) {
      if (String(property).startsWith("_")) {
        throw new Error(`Cannot set private property ${String(property)}`);
      }
      return Reflect.set(target, property, value);
    },

    has(target, property) {
      if (String(property).startsWith("_")) {
        return false;
      }
      return Reflect.has(target, property);
    },

    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => !String(key).startsWith("_"));
    },
  });
}

const obj2 = createPrivateProps({
  publicProp: "public",
  _privateProp: "private",
});

console.log(obj2.publicProp); // 'public'
// console.log(obj2._privateProp); // Throws error
console.log("_privateProp" in obj2); // false
console.log(Object.keys(obj2)); // ['publicProp']

// Function Proxy
// Proxy hàm
function createMemoizedFunction<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();

  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        console.log("Cache hit");
        return cache.get(key);
      }

      console.log("Cache miss");
      const result = Reflect.apply(target, thisArg, args);
      cache.set(key, result);
      return result;
    },
  }) as T;
}

const fibonacci = createMemoizedFunction((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // Calculates
console.log(fibonacci(10)); // From cache

// Revocable Proxy
// Proxy có thể thu hồi
function createRevocableObject<T extends object>(target: T) {
  const { proxy, revoke } = Proxy.revocable(target, {
    get(target, property) {
      console.log(`Accessing ${String(property)}`);
      return Reflect.get(target, property);
    },
  });

  return { proxy, revoke };
}

const { proxy: revocableProxy, revoke } = createRevocableObject({ name: "John" });
console.log(revocableProxy.name); // Works
revoke();
// console.log(revocableProxy.name); // Throws TypeError

// Reflect API
// API Reflect
class ReflectionExamples {
  // Reflect.get
  static getExample() {
    const obj = { x: 1, y: 2 };
    console.log(Reflect.get(obj, "x")); // 1

    // With receiver
    const receiver = { x: 10 };
    const objWithGetter = {
      get value() {
        return this.x;
      },
    };
    console.log(Reflect.get(objWithGetter, "value", receiver)); // 10
  }

  // Reflect.set
  static setExample() {
    const obj = { x: 1 };
    Reflect.set(obj, "y", 2);
    console.log(obj); // { x: 1, y: 2 }
  }

  // Reflect.has
  static hasExample() {
    const obj = { x: 1 };
    console.log(Reflect.has(obj, "x")); // true
    console.log(Reflect.has(obj, "y")); // false
  }

  // Reflect.deleteProperty
  static deleteExample() {
    const obj = { x: 1, y: 2 };
    Reflect.deleteProperty(obj, "x");
    console.log(obj); // { y: 2 }
  }

  // Reflect.construct
  static constructExample() {
    class Person {
      constructor(public name: string) {}
    }

    const person = Reflect.construct(Person, ["John"]);
    console.log(person.name); // 'John'
  }

  // Reflect.apply
  static applyExample() {
    function sum(a: number, b: number) {
      return a + b;
    }

    const result = Reflect.apply(sum, null, [1, 2]);
    console.log(result); // 3
  }

  // Reflect.defineProperty
  static definePropertyExample() {
    const obj = {};
    Reflect.defineProperty(obj, "x", {
      value: 1,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    console.log(obj); // { x: 1 }
  }

  // Reflect.getPrototypeOf
  static getPrototypeExample() {
    const obj = {};
    console.log(Reflect.getPrototypeOf(obj) === Object.prototype); // true
  }

  // Reflect.setPrototypeOf
  static setPrototypeExample() {
    const obj = {};
    const proto = { x: 1 };
    Reflect.setPrototypeOf(obj, proto);
    console.log((obj as any).x); // 1
  }
}
```

---

## Symbols and Well-Known Symbols / Symbols và Well-Known Symbols

### Symbol Theory / Lý Thuyết Symbol

**English:** Symbols are unique and immutable primitive values that can be used as object property keys.

**Tiếng Việt:** Symbols là các giá trị nguyên thủy duy nhất và bất biến có thể được sử dụng làm keys của object property.

```typescript
// Symbol usage
// Sử dụng symbol

// Basic Symbols
// Symbols cơ bản
const sym1 = Symbol("description");
const sym2 = Symbol("description");
console.log(sym1 === sym2); // false - each symbol is unique

// Symbol as property key
// Symbol làm property key
const SECRET_KEY = Symbol("secret");

const obj3 = {
  publicProp: "public",
  [SECRET_KEY]: "secret value",
};

console.log(obj3.publicProp); // 'public'
console.log(obj3[SECRET_KEY]); // 'secret value'
console.log(Object.keys(obj3)); // ['publicProp'] - symbol not included

// Well-Known Symbols
// Symbols nổi tiếng

// Symbol.iterator
class Range {
  constructor(
    private start: number,
    private end: number,
  ) {}

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next(): IteratorResult<number> {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const range = new Range(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Symbol.toStringTag
class CustomClass {
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const custom = new CustomClass();
console.log(Object.prototype.toString.call(custom)); // [object CustomClass]

// Symbol.hasInstance
class MyArray {
  static [Symbol.hasInstance](instance: any) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
console.log({} instanceof MyArray); // false

// Symbol.toPrimitive
class Money {
  constructor(
    private amount: number,
    private currency: string,
  ) {}

  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case "number":
        return this.amount;
      case "string":
        return `${this.amount} ${this.currency}`;
      default:
        return this.amount;
    }
  }
}

const money = new Money(100, "USD");
console.log(+money); // 100
console.log(`${money}`); // '100 USD'
console.log(money + 50); // 150

// Symbol.species
class MyArrayExtended extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}

const myArr = new MyArrayExtended(1, 2, 3);
const mapped = myArr.map((x) => x * 2);
console.log(mapped instanceof MyArrayExtended); // false
console.log(mapped instanceof Array); // true

// Global Symbol Registry
// Registry symbol toàn cục
const globalSym1 = Symbol.for("app.id");
const globalSym2 = Symbol.for("app.id");
console.log(globalSym1 === globalSym2); // true

console.log(Symbol.keyFor(globalSym1)); // 'app.id'
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: How does the decorator pattern work in JavaScript — and what's the execution order when decorators are stacked? 🔴 Senior

**A:** A decorator is a higher-order function that takes a target (class, method, property) and returns a modified version. For functions: `function log(fn) { return function(...args) { console.log('calling'); return fn.apply(this, args) } }`. When stacked (`@A @B @C fn`), decorators are applied bottom-to-top at class definition time: `A(B(C(fn)))`. When the function is called, outermost executes first (A's wrapper runs, then B's, then C's, then the actual function). TypeScript uses this pattern extensively — NestJS `@Controller`, Angular `@Component`, MobX `@observable` are all decorators.

Decorator = higher-order function bọc target với thêm behavior. Stack `@A @B @C`: applied bottom-up `A(B(C(fn)))`, called top-down (A → B → C → fn). Execution order: bottom-to-top at definition, top-to-bottom at call.

**💡 Interview Signal:**

- ✅ Strong: Explains HOF mechanism, bottom-up application order, top-down call order with concrete example
- ❌ Weak: "Decorators add metadata to classes" — describes TypeScript emit behavior, not the runtime mechanism

---

### Q: When would you use mixins over class inheritance? 🔴 Senior

**A:** Use mixins when: (1) you need to share behavior across _unrelated_ classes — `Serializable` behavior should apply to both `User` and `Product`, which have no natural common ancestor; (2) you need multiple capabilities that don't fit a single hierarchy — a `Widget` that is both `EventEmittable` and `Serializable` and `Loggable`; (3) you want to avoid deep inheritance hierarchies (>3 levels) which become fragile. Functional mixin pattern: `const Mixin = (Base) => class extends Base { ... }`, composed as `class Foo extends A(B(C(Base)))`. Avoid when capabilities are naturally hierarchical (`Animal → Dog → Poodle`), or when prototype chain debugging becomes difficult with deep mixin stacks.

Dùng mixins khi cần share behavior qua unrelated classes hoặc cần multiple capabilities. Functional mixin pattern: `(Base) => class extends Base { }`. Tránh khi hierarchy là tự nhiên hoặc debug trở nên khó.

**💡 Interview Signal:**

- ✅ Strong: "Unrelated classes" as key trigger, functional mixin pattern syntax, mentions trade-off (debugging difficulty)
- ❌ Weak: "Mixins are better than inheritance" — no nuance on when each is appropriate

---

### Q: What is `Object.freeze` and what does it NOT protect? 🟡 Mid

**A:** `Object.freeze(obj)` makes all own properties of `obj` non-writable and non-configurable, and prevents adding new properties. It returns the frozen object. What it does NOT protect: (1) **Nested objects** — `obj.nested` is still mutable because freeze is shallow; (2) **Prototype chain** — methods on `obj`'s prototype are unchanged; (3) **The frozen variable** — `obj = newObj` can reassign the variable (you need `const` for that). For true deep immutability: recursive deep freeze, or use `immer`/`Immutable.js`.

`Object.freeze` làm tất cả own properties non-writable/non-configurable. Không bảo vệ: nested objects (shallow!), prototype methods, variable reassignment. Deep immutability cần recursive freeze hoặc immer.

**💡 Interview Signal:**

- ✅ Strong: Names all 3 limitations (shallow, prototype, variable), gives deep freeze solution
- ❌ Weak: "Object.freeze makes it immutable" — incomplete without mentioning shallow limitation

---

### Q: What is `Object.defineProperty` used for? Give a real-world use case. 🟡 Mid

**A:** `Object.defineProperty` lets you create properties with precise control over 4 flags: `writable`, `enumerable`, `configurable`, and `value` (or `get`/`set` for accessors). Real-world use case: **Vue 2 reactivity**. Vue 2 used `Object.defineProperty` to intercept property access on reactive objects — the `get` trap collected subscribers (watchers), the `set` trap notified them. Also used for: non-enumerable constants (invisible to `Object.keys`/`JSON.stringify`), computed/accessor properties, read-only public APIs.

`defineProperty` tạo property với kiểm soát 4 flags: writable, enumerable, configurable, value (hoặc get/set). Vue 2 reactivity dùng `get`/`set` accessor để track watchers. Dùng cho: non-enumerable constants, computed properties, read-only APIs.

**💡 Interview Signal:**

- ✅ Strong: Names all 4 flags, gives Vue 2 reactivity use case with get/set mechanism, mentions non-enumerable use case
- ❌ Weak: "You can define properties with more control" — no specific flags or use cases

---

## Q&A Summary / Tóm Tắt Q&A

| #   | Topic                       | Level | One-liner                                                                                      |
| --- | --------------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| 1   | Decorator execution order   | 🔴    | Applied bottom-up at definition; executed top-down at call                                     |
| 2   | Mixins vs inheritance       | 🔴    | Mixins for unrelated classes + multiple capabilities; inheritance for natural IS-A hierarchies |
| 3   | `Object.freeze` limitations | 🟡    | Shallow only; nested objects still mutable; prototype + variable unaffected                    |
| 4   | `Object.defineProperty`     | 🟡    | 4-flag control; Vue 2 reactivity was built on get/set accessors                                |

---

## ⚡ Cold Call Simulation

**Q: "How would you implement a `@memoize` decorator in TypeScript?"**

**30-second answer:**

"A `@memoize` decorator is a higher-order function that wraps the target method. I'd implement it like this: the decorator receives the method descriptor, saves the original function, and replaces the `value` with a wrapper. The wrapper uses a `Map` to cache results keyed by serialized arguments. On each call, it checks the cache first — cache hit returns immediately, miss calls the original and stores the result. For the key, I'd use `JSON.stringify(args)` for simple primitives, or a WeakMap keyed by `this` plus args for methods that depend on object state. TypeScript decorator syntax: `descriptor.value = function(...args) { const key = JSON.stringify(args); if (cache.has(key)) return cache.get(key); const result = original.apply(this, args); cache.set(key, result); return result }`. One consideration: cache invalidation — the cache lives on the function, so stale results persist unless you expose a `clearCache` method."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: Describe the execution order of `@A @B @C fn` when called. When is each decorator applied?
- **Visual**: Draw the mixin composition chain for `class Foo extends A(B(C(Base)))`. Which method wins if both A and B define `log()`?
- **Application**: You have `const obj = { a: 1, nested: { b: 2 } }; Object.freeze(obj)`. Can you change `obj.a`? What about `obj.nested.b`?
- **Debug**: Vue 2 had a known reactivity limitation: adding new properties to a reactive object didn't trigger updates. Explain why, given that Vue 2 used `Object.defineProperty`.
- **Teach**: Explain decorators to a junior using the "wrapper" metaphor — what is being wrapped and what does the wrapper add?

> 🎯 **Feynman Prompt:** Giải thích cho người không biết code: Proxy trong JavaScript giống "nhân viên bảo vệ tòa nhà" — có thể kiểm soát ai vào, ai ra, ai được làm gì; còn decorator giống "huy hiệu chức vụ" gắn thêm quyền hạn mà không sửa người đó.

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [ES6+ Features Deep](./11-es6-features-deep.md) — Proxy and Symbol covered there in detail
- ⬅️ **Built on**: [Advanced Concepts](./08-advanced-concepts.md) — Higher-order functions, composition
- 🔗 **Applied in**: [React Patterns](../03-react/08-react-patterns-advanced.md) — Higher-Order Components are the React analog of decorators
- 🔗 **Applied in**: [TypeScript Advanced](../02-typescript/02-advanced-types.md) — Decorator types and metadata

[← Previous: Execution Context](./16-execution-context-theory.md) | [Next: Metaprogramming →](./18-metaprogramming-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
