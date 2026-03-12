# JavaScript Advanced Patterns - Theory / Patterns JavaScript Nâng Cao - Lý Thuyết

## Table of Contents / Mục Lục

1. [Decorators](#decorators)
2. [Mixins](#mixins)
3. [Proxies and Reflection](#proxies-and-reflection)
4. [Symbols and Well-Known Symbols](#symbols-and-well-known-symbols)
5. [Advanced Object Patterns](#advanced-object-patterns)
6. [Interview Questions](#interview-questions)

---

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
  
  descriptor.value = function(...args: any[]) {
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
    configurable: false
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
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }
    
    console.log('Cache miss');
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
  
  descriptor.value = function(...args: any[]) {
    if (args.some(arg => typeof arg !== 'number')) {
      throw new TypeError('All arguments must be numbers');
    }
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

function timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
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
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`Attempt ${attempt} failed, retrying...`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay));
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
      throw new Error('Request failed');
    }
    return response.json();
  }
}

// Decorator Metadata
// Metadata decorator
const metadataKey = Symbol('metadata');

function metadata(key: string, value: any) {
  return function(target: any, propertyKey?: string) {
    if (propertyKey) {
      // Method decorator
      const existingMetadata = Reflect.getMetadata(metadataKey, target, propertyKey) || {};
      Reflect.defineMetadata(
        metadataKey,
        { ...existingMetadata, [key]: value },
        target,
        propertyKey
      );
    } else {
      // Class decorator
      const existingMetadata = Reflect.getMetadata(metadataKey, target) || {};
      Reflect.defineMetadata(
        metadataKey,
        { ...existingMetadata, [key]: value },
        target
      );
    }
  };
}

@metadata('version', '1.0.0')
@metadata('author', 'John Doe')
class AnnotatedClass {
  @metadata('description', 'Adds two numbers')
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

const user = new ActiveUser('John');
user.activate();
console.log(user.getTimestamp());
console.log(user.isActive);

// Functional Mixins
// Mixins hàm
const canEat = {
  eat(food: string) {
    console.log(`Eating ${food}`);
  }
};

const canWalk = {
  walk() {
    console.log('Walking');
  }
};

const canSwim = {
  swim() {
    console.log('Swimming');
  }
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

const product = new ValidatableProduct('Laptop', 999);
product.addValidator('price', (price) => price > 0);
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
      this.events.get(event)?.forEach(handler => handler(...args));
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
const button = new EventButton('Submit');

button.on('click', () => console.log('Click handler 1'));
button.on('click', () => console.log('Click handler 2'));
button.emit('click');

// Multiple Inheritance Simulation
// Mô phỏng đa kế thừa
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
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
  name: 'John',
  age: 30
};

const handler: ProxyHandler<typeof target> = {
  get(target, property, receiver) {
    console.log(`Getting ${String(property)}`);
    return Reflect.get(target, property, receiver);
  },
  
  set(target, property, value, receiver) {
    console.log(`Setting ${String(property)} to ${value}`);
    return Reflect.set(target, property, value, receiver);
  }
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
        case 'email':
          if (!value.includes('@')) {
            throw new Error('Invalid email');
          }
          break;
        case 'age':
          if (typeof value !== 'number' || value < 0) {
            throw new Error('Invalid age');
          }
          break;
      }
      
      return Reflect.set(target, property, value);
    }
  });
}

const user2 = createValidatedUser({
  name: 'John',
  email: 'john@example.com',
  age: 30
});

// user2.email = 'invalid'; // Throws error
user2.age = 31; // OK

// Observable Pattern with Proxy
// Pattern Observable với Proxy
function observable<T extends object>(target: T, callback: (property: string, value: any) => void): T {
  return new Proxy(target, {
    set(target, property, value) {
      const result = Reflect.set(target, property, value);
      callback(String(property), value);
      return result;
    }
  });
}

const state = observable(
  { count: 0, name: 'Counter' },
  (property, value) => {
    console.log(`${property} changed to ${value}`);
  }
);

state.count = 1; // Logs: count changed to 1
state.name = 'New Counter'; // Logs: name changed to New Counter

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
    }
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
      if (String(property).startsWith('_')) {
        throw new Error(`Cannot access private property ${String(property)}`);
      }
      return Reflect.get(target, property);
    },
    
    set(target, property, value) {
      if (String(property).startsWith('_')) {
        throw new Error(`Cannot set private property ${String(property)}`);
      }
      return Reflect.set(target, property, value);
    },
    
    has(target, property) {
      if (String(property).startsWith('_')) {
        return false;
      }
      return Reflect.has(target, property);
    },
    
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(
        key => !String(key).startsWith('_')
      );
    }
  });
}

const obj2 = createPrivateProps({
  publicProp: 'public',
  _privateProp: 'private'
});

console.log(obj2.publicProp); // 'public'
// console.log(obj2._privateProp); // Throws error
console.log('_privateProp' in obj2); // false
console.log(Object.keys(obj2)); // ['publicProp']

// Function Proxy
// Proxy hàm
function createMemoizedFunction<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, any>();
  
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        console.log('Cache hit');
        return cache.get(key);
      }
      
      console.log('Cache miss');
      const result = Reflect.apply(target, thisArg, args);
      cache.set(key, result);
      return result;
    }
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
    }
  });
  
  return { proxy, revoke };
}

const { proxy: revocableProxy, revoke } = createRevocableObject({ name: 'John' });
console.log(revocableProxy.name); // Works
revoke();
// console.log(revocableProxy.name); // Throws TypeError

// Reflect API
// API Reflect
class ReflectionExamples {
  // Reflect.get
  static getExample() {
    const obj = { x: 1, y: 2 };
    console.log(Reflect.get(obj, 'x')); // 1
    
    // With receiver
    const receiver = { x: 10 };
    const objWithGetter = {
      get value() {
        return this.x;
      }
    };
    console.log(Reflect.get(objWithGetter, 'value', receiver)); // 10
  }
  
  // Reflect.set
  static setExample() {
    const obj = { x: 1 };
    Reflect.set(obj, 'y', 2);
    console.log(obj); // { x: 1, y: 2 }
  }
  
  // Reflect.has
  static hasExample() {
    const obj = { x: 1 };
    console.log(Reflect.has(obj, 'x')); // true
    console.log(Reflect.has(obj, 'y')); // false
  }
  
  // Reflect.deleteProperty
  static deleteExample() {
    const obj = { x: 1, y: 2 };
    Reflect.deleteProperty(obj, 'x');
    console.log(obj); // { y: 2 }
  }
  
  // Reflect.construct
  static constructExample() {
    class Person {
      constructor(public name: string) {}
    }
    
    const person = Reflect.construct(Person, ['John']);
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
    Reflect.defineProperty(obj, 'x', {
      value: 1,
      writable: false,
      enumerable: true,
      configurable: false
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
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false - each symbol is unique

// Symbol as property key
// Symbol làm property key
const SECRET_KEY = Symbol('secret');

const obj3 = {
  publicProp: 'public',
  [SECRET_KEY]: 'secret value'
};

console.log(obj3.publicProp); // 'public'
console.log(obj3[SECRET_KEY]); // 'secret value'
console.log(Object.keys(obj3)); // ['publicProp'] - symbol not included

// Well-Known Symbols
// Symbols nổi tiếng

// Symbol.iterator
class Range {
  constructor(private start: number, private end: number) {}
  
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    
    return {
      next(): IteratorResult<number> {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
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
    return 'CustomClass';
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
  constructor(private amount: number, private currency: string) {}
  
  [Symbol.toPrimitive](hint: string) {
    switch (hint) {
      case 'number':
        return this.amount;
      case 'string':
        return `${this.amount} ${this.currency}`;
      default:
        return this.amount;
    }
  }
}

const money = new Money(100, 'USD');
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
const mapped = myArr.map(x => x * 2);
console.log(mapped instanceof MyArrayExtended); // false
console.log(mapped instanceof Array); // true

// Global Symbol Registry
// Registry symbol toàn cục
const globalSym1 = Symbol.for('app.id');
const globalSym2 = Symbol.for('app.id');
console.log(globalSym1 === globalSym2); // true

console.log(Symbol.keyFor(globalSym1)); // 'app.id'
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🔴 [Senior] Q1: Explain decorators and their use cases

**English Answer:**

**Decorators** are functions that modify classes, methods, properties, or parameters.

**Use Cases:**
1. **Logging**: Track method calls
2. **Validation**: Validate inputs
3. **Memoization**: Cache results
4. **Authorization**: Check permissions
5. **Timing**: Measure performance
6. **Retry Logic**: Retry failed operations

**Example:**
```typescript
@log
@validate
@memoize
async fetchData(id: number) {
  // Implementation
}
```

**Execution Order:** Bottom to top (memoize → validate → log)

**Tiếng Việt:**

Decorators là hàm sửa đổi classes, methods, properties hoặc parameters. Dùng cho logging, validation, memoization, authorization, timing, retry logic.

### 🔴 [Senior] Q2: What are mixins and when to use them?

**English Answer:**

**Mixins** add functionality through composition instead of inheritance.

**When to Use:**
- Need multiple inheritance
- Share behavior across unrelated classes
- Avoid deep inheritance hierarchies
- Add optional features

**Advantages:**
- Flexible composition
- Avoid diamond problem
- Reusable code
- No tight coupling

**Disadvantages:**
- Can be complex
- Name conflicts possible
- Harder to trace

**Tiếng Việt:**

Mixins thêm chức năng qua composition thay vì inheritance. Dùng khi cần đa kế thừa, chia sẻ hành vi, tránh hierarchy sâu.

### 🔴 [Senior] Q3: Explain Proxy and its use cases

**English Answer:**

**Proxy** intercepts operations on objects.

**Traps Available:**
- get, set, has, deleteProperty
- apply, construct
- getPrototypeOf, setPrototypeOf
- defineProperty, getOwnPropertyDescriptor
- ownKeys, preventExtensions, isExtensible

**Use Cases:**
1. **Validation**: Validate property values
2. **Logging**: Track property access
3. **Computed Properties**: Calculate on access
4. **Private Properties**: Hide properties
5. **Negative Indices**: Array[-1]
6. **Observable**: React to changes
7. **Memoization**: Cache function results

**Tiếng Việt:**

Proxy chặn các thao tác trên objects. Dùng cho validation, logging, computed properties, private properties, observable, memoization.

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Decorators modify behavior declaratively
2. Mixins enable composition over inheritance
3. Proxies intercept object operations
4. Symbols create unique property keys
5. Well-known symbols customize behavior
6. Reflect API provides meta-programming
7. Patterns enable advanced architectures

---

[← Previous: Execution Context](./16-execution-context-theory.md) | [Next: Metaprogramming →](./18-metaprogramming-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
