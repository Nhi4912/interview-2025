# JavaScript Metaprogramming - Theory / Metaprogramming JavaScript - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**TypeORM entity validation:** Mỗi entity class cần validate 20+ fields. Option A: call `validate(user.email, 'email')` manually in every service → 200 lines of imperative code. Option B: Decorators + Reflect Metadata: `@IsEmail() email: string` — decorator attaches metadata to the property, validator reads it at runtime. When `validate(user)` is called, it uses `Reflect.getMetadata` to find all validation rules and applies them automatically. This is how NestJS, TypeORM, and class-validator work internally.

**Bài học:** Metaprogramming là code that treats code as data — mở ra khả năng tạo frameworks, ORMs, validation libraries. `Reflect.metadata`, `Symbol.iterator`, tagged templates là các tools cốt lõi.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Metaprogramming giống thợ in offset (printing) — bạn không in từng trang một, bạn tạo ra bản in (plate) rồi dùng nó để in hàng ngàn trang giống nhau. Code that writes code multiplies your leverage.

**Scope:** Note: Proxy basics and Symbol covered in [11-es6-features-deep.md](./11-es6-features-deep.md) and [17-advanced-patterns-theory.md](./17-advanced-patterns-theory.md). This file focuses on Reflect API, Reflect.metadata (class-validator pattern), tagged templates, and DSL creation.

## Concept Map / Bản Đồ Khái Niệm

```
[JavaScript Metaprogramming]
        │
        ├── Reflect API
        │       ├── Mirrors Proxy traps as static methods
        │       ├── Reflect.get/set/has/deleteProperty/apply/construct
        │       └── Returns boolean (not throws) — functional style
        │
        ├── Reflect.metadata (metadata API via reflect-metadata package)
        │       ├── Attach metadata to classes/properties at definition
        │       ├── Read metadata at runtime
        │       └── Powers: class-validator, TypeORM, NestJS DI
        │
        ├── Tagged Template Literals
        │       ├── tag`template ${expr}` → tag(strings, ...values)
        │       └── Powers: styled-components, gql`...`, sql`...`
        │
        └── DSL via Method Chaining + Builder
                query.select('*').from('users').where('age > 18').limit(10)
                Each method returns 'this' for chaining → execute at terminal op
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Reflect API — Metaprogramming at the Language Level

**🧠 Memory Hook:** "**Reflect = the manual override buttons for JavaScript's built-in operations. What Proxy traps intercept, Reflect methods do by default.**"

**Why does this exist? / Tại sao tồn tại?**

- Why do we need `Reflect` when we have direct operators? Because operators like `delete`, property access, and `new` throw errors or behave inconsistently. `Reflect` provides a consistent functional API — every operation returns a value instead of throwing, mirroring exactly what Proxy traps receive
- Why is `Reflect` designed to mirror Proxy traps? By design — inside a Proxy trap, you use `Reflect.get(target, key, receiver)` to invoke the default behavior. It's the exact same method signature as the trap parameter signature. This makes Proxy + Reflect natural partners
- Why use `Reflect.has` instead of `in` operator? `in` throws on null/undefined. `Reflect.has(null, 'key')` returns `false`. Functional code prefers values over exceptions

**Visual — Reflect vs Operators:**

```javascript
// Traditional operators vs Reflect equivalents:
obj.prop             // Reflect.get(obj, 'prop')
obj.prop = value     // Reflect.set(obj, 'prop', value) → returns boolean
delete obj.prop      // Reflect.deleteProperty(obj, 'prop') → returns boolean
'prop' in obj        // Reflect.has(obj, 'prop') → returns boolean
new Ctor(...args)    // Reflect.construct(Ctor, args) → new instance
fn.apply(ctx, args)  // Reflect.apply(fn, ctx, args)

// In Proxy trap — using Reflect for default behavior:
const handler = {
  set(target, key, value, receiver) {
    if (typeof value !== 'string') throw new TypeError('Strings only')
    return Reflect.set(target, key, value, receiver)  // ← default set
    // return true  ← BUG: doesn't set the value!
    // Not using Reflect: breaks prototype chain for accessor properties
  }
}

// Reflect.metadata (requires reflect-metadata package):
import 'reflect-metadata'

function validate(rules: object) {
  return (target: any, key: string) => {
    Reflect.defineMetadata('validation', rules, target, key)
  }
}

class User {
  @validate({ required: true, email: true })
  email: string

  @validate({ required: true, minLength: 2 })
  name: string
}

// Runtime validation:
function validateObject(obj: any) {
  const keys = Object.keys(obj)
  for (const key of keys) {
    const rules = Reflect.getMetadata('validation', obj, key)
    if (rules) applyRules(obj[key], rules)
  }
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `return true` inside Proxy `set` trap without setting value | Use `Reflect.set(target, key, value, receiver)` to actually set AND return true |
| Forgetting `receiver` in `Reflect.get/set` in Proxy | `receiver` is needed for proper prototype chain `get`/`set` — omitting breaks accessors |
| Using `Reflect.metadata` without `reflect-metadata` polyfill | TC39 spec doesn't include metadata — need `import 'reflect-metadata'` first |
| Calling `Reflect.apply(fn, null, args)` on arrow functions with `this` | Arrow functions don't have own `this` — `receiver` is ignored but no error |

**🎯 Interview Pattern:**
- **Trigger**: "Proxy + Reflect" / "how NestJS DI works" / "Reflect.metadata"
- **Concept**: Reflect mirrors Proxy trap API; Reflect.metadata for runtime type information
- **Opening**: "Reflect provides functional versions of JavaScript's built-in operations — the same operations that Proxy can intercept. Inside a Proxy trap, I always use `Reflect.get/set` with the receiver to invoke default behavior correctly. For framework features like class-validator, `Reflect.defineMetadata` attaches rules at decoration time and `Reflect.getMetadata` reads them at runtime..."

**🔑 Knowledge Chain:**
- **Prereq**: Proxy traps (see 11-es6-features-deep.md), decorators (17-advanced-patterns-theory.md)
- **Enables**: NestJS DI, TypeORM entity validation, class-validator, Angular DI container

---

### 2. Tagged Template Literals — DSL at the Language Level

**🧠 Memory Hook:** "**`tag\`template ${expr}\`` calls `tag(strings, ...values)`. The tag function receives strings as array and expressions as args. It decides what to return.**"

**Why does this exist? / Tại sao tồn tại?**

- Why are template literals not enough? Regular `` `Hello ${name}` `` is just string interpolation. You can't process the expressions — they're already evaluated to strings
- Why do tagged templates receive strings and expressions separately? Because the tag function needs to process each expression (escape SQL injection, apply CSS minification, wrap GraphQL types) before combining with the string parts
- Why is this considered "metaprogramming"? Because you're using JavaScript's own syntax to build a mini-language. `sql\`SELECT * FROM users WHERE id = ${userId}\`` looks like SQL but is JavaScript — the tag function handles the escaping and parameterization

**Visual — Tagged Template Mechanics:**

```javascript
// Tag function signature: (strings: TemplateStringsArray, ...values: any[]) => any
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1]
    return result + (val !== undefined ? `<mark>${val}</mark>` : '') + str
  })
}

const name = 'World'
const result = highlight`Hello ${name}! Today is ${new Date()}.`
// → 'Hello <mark>World</mark>! Today is <mark>Fri Mar...</mark>.'

// Real-world: SQL safe parameterization
function sql(strings, ...values) {
  const params = []
  const query = strings.reduce((sql, str, i) => {
    if (i > 0) {
      params.push(values[i - 1])  // escape: use $1, $2 placeholders
      return sql + `$${i}`        // NOT string interpolation — parameterized
    }
    return sql + str
  })
  return { query, params }  // { query: "SELECT... WHERE id = $1", params: [42] }
}

const userId = 42
const { query, params } = sql`SELECT * FROM users WHERE id = ${userId}`
// Prevents SQL injection: userId is a parameter, not inline string

// Real-world: styled-components (simplified)
const css = (strings, ...values) => strings.reduce((a, s, i) =>
  a + (values[i - 1] ?? '') + s)
const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  color: ${props => props.primary ? 'white' : 'blue'};
`
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Using template literals for SQL instead of tagged templates | `` `SELECT ... WHERE id = ${userId}` `` — SQL injection risk; use tagged `sql\`\`` |
| Forgetting `strings` array has one more element than `values` | `strings.length === values.length + 1` — always |
| Returning non-string from tagged template | Tag can return anything: DOM element, styled component, Query object |
| Using `eval()` for "template-like" dynamic code generation | Tagged templates are safe (no code execution) vs `eval` (executes arbitrary code) |

**🎯 Interview Pattern:**
- **Trigger**: "SQL injection prevention" / "styled-components internals" / "template literal tag"
- **Concept**: Tag function receives strings + expressions separately — can process before combining
- **Opening**: "Tagged template literals pass the string parts and expression parts separately to a tag function. `sql\`WHERE id = ${userId}\`` — the sql function can put `userId` in parameterized position instead of inline. That's how SQL injection is prevented. styled-components uses the same mechanism — the tag function processes prop functions embedded in the template..."

**🔑 Knowledge Chain:**
- **Prereq**: Template literals, higher-order functions
- **Enables**: styled-components, graphql-tag (`gql\`\``), secure SQL queries, i18n libraries

---

### 3. DSL via Method Chaining (Fluent Interface)

**🧠 Memory Hook:** "**Each method returns `this`. Terminal method executes. Builder accumulates config; executor runs it.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is method chaining a metaprogramming technique? Because it creates an internal DSL — code that reads like a specialized language (`query.select('*').from('users').where('age > 18').limit(10)`) but is standard JavaScript
- Why return `this` in each method? So the next method can be called on the same object. Each method mutates the internal state and returns the builder for chaining
- Why is the builder/executor separation important? The execution (`execute()`, `build()`, `.all()`) should happen last — this allows validation, query optimization, logging, or lazy evaluation before the actual work runs

**Visual — Method Chaining Pattern:**

```javascript
class QueryBuilder {
  #table = null
  #conditions = []
  #limit = null
  #fields = ['*']

  select(...fields) {
    this.#fields = fields
    return this  // ← key: return this for chaining
  }

  from(table) {
    this.#table = table
    return this
  }

  where(condition) {
    this.#conditions.push(condition)
    return this
  }

  limit(n) {
    this.#limit = n
    return this
  }

  build() {  // ← terminal operation: no return this
    const where = this.#conditions.length
      ? `WHERE ${this.#conditions.join(' AND ')}`
      : ''
    const limit = this.#limit ? `LIMIT ${this.#limit}` : ''
    return `SELECT ${this.#fields.join(', ')} FROM ${this.#table} ${where} ${limit}`.trim()
  }
}

const query = new QueryBuilder()
  .select('name', 'email')
  .from('users')
  .where('age > 18')
  .where('active = true')
  .limit(10)
  .build()
// → 'SELECT name, email FROM users WHERE age > 18 AND active = true LIMIT 10'
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Terminal method returns `this` | Terminal method (`.build()`, `.execute()`) returns the result, not `this` |
| Mutating original object on each chain call | For immutable API: return `new QueryBuilder({...state, newProp: value})` |
| No validation in terminal method | Validate completeness (e.g., `this.#table === null → throw Error`) at execute time |
| Deeply nested chain with 20+ calls | Break into named intermediate variables for readability |

**🎯 Interview Pattern:**
- **Trigger**: "fluent API" / "query builder" / "jQuery-like chaining" / "builder pattern"
- **Concept**: Each method returns `this`; terminal method executes; builder accumulates config
- **Opening**: "Method chaining creates a fluent interface — every method returns `this` except the terminal method which executes the accumulated config. This is how query builders, test frameworks (Jest's `expect(x).toBe(y)`), and stream APIs work. The key design decision is separating the builder from the executor..."

**🔑 Knowledge Chain:**
- **Prereq**: `this` binding, object methods
- **Enables**: Custom query builders, test assertion libraries, animation timelines, pipeline APIs

---

## Reference Theory / Tài Liệu Tham Khảo



## Metaprogramming Fundamentals / Cơ Bản Metaprogramming

### What is Metaprogramming? / Metaprogramming Là Gì?

**English:** Metaprogramming is writing code that manipulates code - programs that write or modify other programs (or themselves) at runtime.

**Tiếng Việt:** Metaprogramming là viết code thao tác code - chương trình viết hoặc sửa đổi chương trình khác (hoặc chính nó) lúc runtime.

```typescript
// Metaprogramming concepts
// Khái niệm metaprogramming

/**
 * Metaprogramming Techniques:
 * 1. Reflection - Inspect code structure
 * 2. Introspection - Examine object properties
 * 3. Intercession - Modify behavior
 * 4. Code Generation - Create code dynamically
 * 5. DSL - Domain Specific Languages
 */

// Introspection - Examining objects
// Nội quan - Kiểm tra objects
class Introspection {
  static examineObject(obj: any): ObjectInfo {
    return {
      type: typeof obj,
      constructor: obj.constructor.name,
      prototype: Object.getPrototypeOf(obj),
      properties: Object.getOwnPropertyNames(obj),
      methods: Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
        .filter(name => typeof obj[name] === 'function'),
      descriptors: Object.getOwnPropertyDescriptors(obj),
      isExtensible: Object.isExtensible(obj),
      isSealed: Object.isSealed(obj),
      isFrozen: Object.isFrozen(obj)
    };
  }
  
  static getMethodSignature(obj: any, methodName: string): MethodSignature {
    const method = obj[methodName];
    if (typeof method !== 'function') {
      throw new Error(`${methodName} is not a method`);
    }
    
    const funcStr = method.toString();
    const params = funcStr.match(/\(([^)]*)\)/)?.[1]
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0) || [];
    
    return {
      name: methodName,
      parameters: params,
      body: funcStr,
      isAsync: funcStr.startsWith('async'),
      isGenerator: funcStr.includes('function*')
    };
  }
  
  static getPropertyDescriptor(obj: any, prop: string): PropertyDescriptor | undefined {
    return Object.getOwnPropertyDescriptor(obj, prop);
  }
  
  static getPrototypeChain(obj: any): any[] {
    const chain: any[] = [];
    let current = obj;
    
    while (current !== null) {
      chain.push(current);
      current = Object.getPrototypeOf(current);
    }
    
    return chain;
  }
}

interface ObjectInfo {
  type: string;
  constructor: string;
  prototype: any;
  properties: string[];
  methods: string[];
  descriptors: PropertyDescriptorMap;
  isExtensible: boolean;
  isSealed: boolean;
  isFrozen: boolean;
}

interface MethodSignature {
  name: string;
  parameters: string[];
  body: string;
  isAsync: boolean;
  isGenerator: boolean;
}

// Intercession - Modifying behavior
// Can thiệp - Sửa đổi hành vi
class Intercession {
  // Modify method behavior
  // Sửa đổi hành vi method
  static wrapMethod(obj: any, methodName: string, wrapper: Function) {
    const original = obj[methodName];
    
    obj[methodName] = function(...args: any[]) {
      return wrapper.call(this, original, args);
    };
  }
  
  // Add method dynamically
  // Thêm method động
  static addMethod(obj: any, methodName: string, method: Function) {
    Object.defineProperty(obj, methodName, {
      value: method,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  
  // Remove method
  // Xóa method
  static removeMethod(obj: any, methodName: string) {
    delete obj[methodName];
  }
  
  // Modify property
  // Sửa đổi property
  static makeReadonly(obj: any, prop: string) {
    Object.defineProperty(obj, prop, {
      writable: false,
      configurable: false
    });
  }
  
  // Add getter/setter
  // Thêm getter/setter
  static addComputedProperty(
    obj: any,
    prop: string,
    getter: () => any,
    setter?: (value: any) => void
  ) {
    Object.defineProperty(obj, prop, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
}

// Example usage
class Person {
  constructor(public firstName: string, public lastName: string) {}
  
  greet() {
    return `Hello, I'm ${this.firstName}`;
  }
}

const person = new Person('John', 'Doe');

// Introspection
const info = Introspection.examineObject(person);
console.log(info);

// Intercession
Intercession.wrapMethod(person, 'greet', function(original, args) {
  console.log('Before greet');
  const result = original.apply(this, args);
  console.log('After greet');
  return result;
});

Intercession.addComputedProperty(
  person,
  'fullName',
  function() { return `${this.firstName} ${this.lastName}`; },
  function(value) {
    const [first, last] = value.split(' ');
    this.firstName = first;
    this.lastName = last;
  }
);

console.log(person.fullName); // 'John Doe'
person.fullName = 'Jane Smith';
console.log(person.firstName); // 'Jane'
```

---

## Reflection / Reflection

### Reflect API Deep Dive / Tìm Hiểu Sâu Reflect API

**English:** The Reflect API provides methods for interceptable JavaScript operations.

**Tiếng Việt:** Reflect API cung cấp các phương thức cho các thao tác JavaScript có thể chặn.

```typescript
// Advanced Reflection
// Reflection nâng cao

class ReflectionUtilities {
  // Deep clone using reflection
  // Clone sâu sử dụng reflection
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as any;
    }
    
    const clone = Object.create(Object.getPrototypeOf(obj));
    
    for (const key of Reflect.ownKeys(obj)) {
      const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
      if (descriptor) {
        if (descriptor.value !== undefined) {
          descriptor.value = this.deepClone(descriptor.value);
        }
        Reflect.defineProperty(clone, key, descriptor);
      }
    }
    
    return clone;
  }
  
  // Merge objects deeply
  // Merge objects sâu
  static deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    for (const source of sources) {
      for (const key of Reflect.ownKeys(source) as (keyof T)[]) {
        const targetValue = target[key];
        const sourceValue = source[key];
        
        if (this.isObject(targetValue) && this.isObject(sourceValue)) {
          target[key] = this.deepMerge(
            Object.create(Object.getPrototypeOf(targetValue)),
            targetValue,
            sourceValue
          );
        } else {
          Reflect.set(target, key, sourceValue);
        }
      }
    }
    
    return target;
  }
  
  private static isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }
  
  // Get all properties (including inherited)
  // Lấy tất cả properties (bao gồm kế thừa)
  static getAllProperties(obj: any): string[] {
    const props = new Set<string>();
    let current = obj;
    
    while (current !== null) {
      for (const prop of Object.getOwnPropertyNames(current)) {
        props.add(prop);
      }
      current = Object.getPrototypeOf(current);
    }
    
    return Array.from(props);
  }
  
  // Get all methods
  // Lấy tất cả methods
  static getAllMethods(obj: any): string[] {
    return this.getAllProperties(obj).filter(
      prop => typeof obj[prop] === 'function'
    );
  }
  
  // Check if object has method
  // Kiểm tra object có method không
  static hasMethod(obj: any, methodName: string): boolean {
    return typeof obj[methodName] === 'function';
  }
  
  // Invoke method by name
  // Gọi method theo tên
  static invokeMethod(obj: any, methodName: string, ...args: any[]): any {
    if (!this.hasMethod(obj, methodName)) {
      throw new Error(`Method ${methodName} not found`);
    }
    
    return Reflect.apply(obj[methodName], obj, args);
  }
  
  // Create instance dynamically
  // Tạo instance động
  static createInstance<T>(constructor: new (...args: any[]) => T, ...args: any[]): T {
    return Reflect.construct(constructor, args);
  }
  
  // Check if constructor
  // Kiểm tra có phải constructor không
  static isConstructor(func: any): boolean {
    try {
      Reflect.construct(String, [], func);
      return true;
    } catch {
      return false;
    }
  }
}

// Metadata Reflection
// Reflection metadata
class MetadataReflection {
  private static metadata = new WeakMap<object, Map<string | symbol, any>>();
  
  // Define metadata
  // Định nghĩa metadata
  static defineMetadata(
    target: object,
    key: string | symbol,
    metadataKey: string,
    metadataValue: any
  ): void {
    if (!this.metadata.has(target)) {
      this.metadata.set(target, new Map());
    }
    
    const targetMetadata = this.metadata.get(target)!;
    const propertyKey = `${String(key)}:${metadataKey}`;
    targetMetadata.set(propertyKey, metadataValue);
  }
  
  // Get metadata
  // Lấy metadata
  static getMetadata(
    target: object,
    key: string | symbol,
    metadataKey: string
  ): any {
    const targetMetadata = this.metadata.get(target);
    if (!targetMetadata) return undefined;
    
    const propertyKey = `${String(key)}:${metadataKey}`;
    return targetMetadata.get(propertyKey);
  }
  
  // Has metadata
  // Có metadata không
  static hasMetadata(
    target: object,
    key: string | symbol,
    metadataKey: string
  ): boolean {
    return this.getMetadata(target, key, metadataKey) !== undefined;
  }
  
  // Get all metadata keys
  // Lấy tất cả metadata keys
  static getMetadataKeys(target: object, key: string | symbol): string[] {
    const targetMetadata = this.metadata.get(target);
    if (!targetMetadata) return [];
    
    const prefix = `${String(key)}:`;
    return Array.from(targetMetadata.keys())
      .filter(k => String(k).startsWith(prefix))
      .map(k => String(k).substring(prefix.length));
  }
}

// Example: Validation using metadata
function validate(validationRules: any) {
  return function(target: any, propertyKey: string) {
    MetadataReflection.defineMetadata(
      target,
      propertyKey,
      'validation',
      validationRules
    );
  };
}

class User {
  @validate({ required: true, minLength: 3 })
  username!: string;
  
  @validate({ required: true, pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })
  email!: string;
}

function validateObject(obj: any): boolean {
  const properties = Object.keys(obj);
  
  for (const prop of properties) {
    const rules = MetadataReflection.getMetadata(
      Object.getPrototypeOf(obj),
      prop,
      'validation'
    );
    
    if (rules) {
      const value = obj[prop];
      
      if (rules.required && !value) {
        console.log(`${prop} is required`);
        return false;
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        console.log(`${prop} must be at least ${rules.minLength} characters`);
        return false;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        console.log(`${prop} has invalid format`);
        return false;
      }
    }
  }
  
  return true;
}
```

---

## Dynamic Code Generation / Tạo Code Động

### Runtime Code Creation / Tạo Code Lúc Runtime

**English:** JavaScript can generate and execute code at runtime using various techniques.

**Tiếng Việt:** JavaScript có thể tạo và thực thi code lúc runtime sử dụng nhiều kỹ thuật khác nhau.

```typescript
// Dynamic code generation
// Tạo code động

class CodeGenerator {
  // Generate function from template
  // Tạo hàm từ template
  static generateFunction(name: string, params: string[], body: string): Function {
    const funcStr = `
      return function ${name}(${params.join(', ')}) {
        ${body}
      }
    `;
    
    return new Function(funcStr)();
  }
  
  // Generate class dynamically
  // Tạo class động
  static generateClass(
    className: string,
    properties: PropertyDefinition[],
    methods: MethodDefinition[]
  ): any {
    const classCode = `
      class ${className} {
        constructor(${properties.map(p => p.name).join(', ')}) {
          ${properties.map(p => `this.${p.name} = ${p.name};`).join('\n          ')}
        }
        
        ${methods.map(m => `
          ${m.name}(${m.params.join(', ')}) {
            ${m.body}
          }
        `).join('\n        ')}
      }
      
      return ${className};
    `;
    
    return new Function(classCode)();
  }
  
  // Generate getter/setter
  // Tạo getter/setter
  static generateAccessors(obj: any, prop: string, storage: string = `_${prop}`) {
    Object.defineProperty(obj, prop, {
      get() {
        console.log(`Getting ${prop}`);
        return this[storage];
      },
      set(value) {
        console.log(`Setting ${prop} to ${value}`);
        this[storage] = value;
      },
      enumerable: true,
      configurable: true
    });
  }
  
  // Generate method wrapper
  // Tạo wrapper method
  static generateMethodWrapper(
    obj: any,
    methodName: string,
    before?: Function,
    after?: Function
  ) {
    const original = obj[methodName];
    
    obj[methodName] = function(...args: any[]) {
      if (before) before.call(this, args);
      const result = original.apply(this, args);
      if (after) after.call(this, result);
      return result;
    };
  }
  
  // Template-based code generation
  // Tạo code dựa trên template
  static generateFromTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });
  }
  
  // Generate CRUD operations
  // Tạo thao tác CRUD
  static generateCRUD(entityName: string): any {
    const storage = new Map<string, any>();
    
    return {
      create(id: string, data: any) {
        if (storage.has(id)) {
          throw new Error(`${entityName} with id ${id} already exists`);
        }
        storage.set(id, data);
        return data;
      },
      
      read(id: string) {
        if (!storage.has(id)) {
          throw new Error(`${entityName} with id ${id} not found`);
        }
        return storage.get(id);
      },
      
      update(id: string, data: any) {
        if (!storage.has(id)) {
          throw new Error(`${entityName} with id ${id} not found`);
        }
        const existing = storage.get(id);
        const updated = { ...existing, ...data };
        storage.set(id, updated);
        return updated;
      },
      
      delete(id: string) {
        if (!storage.has(id)) {
          throw new Error(`${entityName} with id ${id} not found`);
        }
        storage.delete(id);
      },
      
      list() {
        return Array.from(storage.values());
      }
    };
  }
}

interface PropertyDefinition {
  name: string;
  type?: string;
  defaultValue?: any;
}

interface MethodDefinition {
  name: string;
  params: string[];
  body: string;
}

// Example usage
const add = CodeGenerator.generateFunction('add', ['a', 'b'], 'return a + b;');
console.log(add(2, 3)); // 5

const Person2 = CodeGenerator.generateClass(
  'Person',
  [
    { name: 'name', type: 'string' },
    { name: 'age', type: 'number' }
  ],
  [
    {
      name: 'greet',
      params: [],
      body: 'return `Hello, I am ${this.name}`;'
    }
  ]
);

const person2 = new Person2('John', 30);
console.log(person2.greet());

// Generate CRUD for User entity
const UserCRUD = CodeGenerator.generateCRUD('User');
UserCRUD.create('1', { name: 'John', email: 'john@example.com' });
console.log(UserCRUD.read('1'));
```

---

## DSL Creation / Tạo DSL

### Domain-Specific Languages / Ngôn Ngữ Đặc Thù Miền

**English:** DSLs are specialized mini-languages designed for specific problem domains.

**Tiếng Việt:** DSLs là các ngôn ngữ mini chuyên biệt được thiết kế cho các miền vấn đề cụ thể.

```typescript
// DSL for query building
// DSL để xây dựng query

class QueryBuilder<T> {
  private conditions: Condition[] = [];
  private sortField?: keyof T;
  private sortOrder: 'asc' | 'desc' = 'asc';
  private limitValue?: number;
  private offsetValue?: number;
  
  where(field: keyof T, operator: Operator, value: any): this {
    this.conditions.push({ field: field as string, operator, value });
    return this;
  }
  
  and(field: keyof T, operator: Operator, value: any): this {
    return this.where(field, operator, value);
  }
  
  or(field: keyof T, operator: Operator, value: any): this {
    this.conditions.push({ field: field as string, operator, value, combinator: 'OR' });
    return this;
  }
  
  orderBy(field: keyof T, order: 'asc' | 'desc' = 'asc'): this {
    this.sortField = field;
    this.sortOrder = order;
    return this;
  }
  
  limit(value: number): this {
    this.limitValue = value;
    return this;
  }
  
  offset(value: number): this {
    this.offsetValue = value;
    return this;
  }
  
  build(): Query {
    return {
      conditions: this.conditions,
      sort: this.sortField ? {
        field: this.sortField as string,
        order: this.sortOrder
      } : undefined,
      limit: this.limitValue,
      offset: this.offsetValue
    };
  }
  
  execute(data: T[]): T[] {
    let result = data.filter(item => this.matchesConditions(item));
    
    if (this.sortField) {
      result.sort((a, b) => {
        const aVal = a[this.sortField!];
        const bVal = b[this.sortField!];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return this.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    if (this.offsetValue !== undefined) {
      result = result.slice(this.offsetValue);
    }
    
    if (this.limitValue !== undefined) {
      result = result.slice(0, this.limitValue);
    }
    
    return result;
  }
  
  private matchesConditions(item: T): boolean {
    let result = true;
    let combinator: 'AND' | 'OR' = 'AND';
    
    for (const condition of this.conditions) {
      const matches = this.matchesCondition(item, condition);
      
      if (combinator === 'AND') {
        result = result && matches;
      } else {
        result = result || matches;
      }
      
      combinator = condition.combinator || 'AND';
    }
    
    return result;
  }
  
  private matchesCondition(item: T, condition: Condition): boolean {
    const value = (item as any)[condition.field];
    
    switch (condition.operator) {
      case '=': return value === condition.value;
      case '!=': return value !== condition.value;
      case '>': return value > condition.value;
      case '>=': return value >= condition.value;
      case '<': return value < condition.value;
      case '<=': return value <= condition.value;
      case 'in': return condition.value.includes(value);
      case 'like': return String(value).includes(condition.value);
      default: return false;
    }
  }
}

type Operator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'in' | 'like';

interface Condition {
  field: string;
  operator: Operator;
  value: any;
  combinator?: 'AND' | 'OR';
}

interface Query {
  conditions: Condition[];
  sort?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

// Example usage
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'John', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane', age: 25, email: 'jane@example.com' },
  { id: 3, name: 'Bob', age: 35, email: 'bob@example.com' }
];

const query = new QueryBuilder<User>()
  .where('age', '>=', 25)
  .and('age', '<=', 35)
  .orderBy('name', 'asc')
  .limit(10);

const results = query.execute(users);
console.log(results);

// DSL for HTML generation
// DSL để tạo HTML
class HTMLBuilder {
  private elements: HTMLElement[] = [];
  
  tag(name: string, content?: string): HTMLElement {
    const element: HTMLElement = {
      tag: name,
      attributes: {},
      children: [],
      content
    };
    this.elements.push(element);
    return element;
  }
  
  attr(element: HTMLElement, name: string, value: string): this {
    element.attributes[name] = value;
    return this;
  }
  
  child(parent: HTMLElement, child: HTMLElement): this {
    parent.children.push(child);
    return this;
  }
  
  build(): string {
    return this.elements.map(el => this.renderElement(el)).join('\n');
  }
  
  private renderElement(element: HTMLElement): string {
    const attrs = Object.entries(element.attributes)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    const opening = `<${element.tag}${attrs ? ' ' + attrs : ''}>`;
    const content = element.content || '';
    const children = element.children.map(child => this.renderElement(child)).join('');
    const closing = `</${element.tag}>`;
    
    return `${opening}${content}${children}${closing}`;
  }
}

interface HTMLElement {
  tag: string;
  attributes: Record<string, string>;
  children: HTMLElement[];
  content?: string;
}

// Fluent API example
const html = new HTMLBuilder();
const div = html.tag('div');
html.attr(div, 'class', 'container');

const h1 = html.tag('h1', 'Hello World');
html.child(div, h1);

const p = html.tag('p', 'This is a paragraph');
html.child(div, p);

console.log(html.build());
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: Why should you use `Reflect.set(target, key, value, receiver)` inside a Proxy `set` trap instead of just `return true`? 🔴 Senior

**A:** `return true` inside a `set` trap signals "operation succeeded" to the caller without actually setting the value on the target. This silently discards the write. `Reflect.set(target, key, value, receiver)` does the actual assignment using JavaScript's standard property assignment semantics — including invoking any `set` accessor on the prototype chain via the `receiver` parameter. Omitting `receiver` breaks accessor properties inherited from prototypes. The trap should always return `Reflect.set(...)` to properly propagate the write while intercepting it.

`return true` trong Proxy `set` trap báo hiệu thành công nhưng không thực sự set value — data lost silently. `Reflect.set(target, key, value, receiver)` thực hiện assignment đúng, kể cả accessor properties qua prototype chain (cần `receiver`).

**💡 Interview Signal:**
- ✅ Strong: Explains silent data loss bug, explains `receiver` parameter's role in prototype accessor calls
- ❌ Weak: "Use Reflect.set to be correct" — no explanation of WHY it's needed

---

### Q: How do tagged template literals work? Give a security use case. 🟡 Mid

**A:** Tagged templates call the tag function with two arguments: `strings` (array of literal string parts) and `...values` (evaluated expressions). The tag function decides what to do with them. For SQL injection prevention: instead of `` `WHERE id = ${userId}` `` (interpolates userId directly into the string), use `` sql`WHERE id = ${userId}` ``. The `sql` tag function puts `userId` into a parameterized slot (`$1`) and returns `{ query, params }` — the database driver handles escaping. This is how `pg-promise`, `slonik`, and ORMs prevent injection.

Tagged templates: tag function receives `(strings, ...values)` — strings array and evaluated expressions separately. SQL security: `sql\`WHERE id = ${userId}\`` → puts userId in parameterized slot, not inline string. Prevents SQL injection.

**💡 Interview Signal:**
- ✅ Strong: Explains `strings` array + `...values` signature, gives SQL injection prevention as concrete security use case
- ❌ Weak: "Tagged templates are used in styled-components" — correct but no mechanism explanation

---

### Q: How does `Reflect.metadata` enable the class-validator pattern? 🔴 Senior

**A:** `Reflect.defineMetadata(key, value, target, propertyKey)` stores metadata on a class property at decoration time. When `@IsEmail()` is applied to `user.email`, it calls `Reflect.defineMetadata('validation:rules', { email: true }, UserClass.prototype, 'email')`. At runtime, `validate(user)` calls `Reflect.getMetadata('validation:rules', user, key)` for each property to retrieve and apply the rules. This requires the `reflect-metadata` polyfill (TC39 metadata proposal not yet finalized). NestJS uses this pattern for everything: `@Injectable()`, `@Controller('/path')`, `@Body()` — all store metadata that the framework reads at bootstrap.

`Reflect.defineMetadata` attaches rules to properties at decoration time. At runtime, validator calls `Reflect.getMetadata` to retrieve rules per property. Requires `reflect-metadata` polyfill. NestJS/class-validator pattern.

**💡 Interview Signal:**
- ✅ Strong: Explains decoration-time vs runtime split, mentions reflect-metadata requirement, NestJS usage
- ❌ Weak: "Decorators add metadata" — no mechanism on how metadata is stored or retrieved

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Level | One-liner |
|---|-------|-------|-----------|
| 1 | Reflect.set in Proxy trap | 🔴 | `return true` discards write; `Reflect.set(..., receiver)` sets correctly via prototype chain |
| 2 | Tagged template security | 🟡 | `sql\`WHERE id = ${x}\`` puts `x` in parameter slot — prevents SQL injection |
| 3 | Reflect.metadata pattern | 🔴 | `defineMetadata` at decoration, `getMetadata` at runtime — powers NestJS/class-validator |

---

## ⚡ Cold Call Simulation

**Q: "How would you implement SQL injection prevention using tagged template literals?"**

**30-second answer:**

"Tagged templates receive the string parts and expression parts separately. I'd write a `sql` tag function that takes `strings` (the literal SQL parts) and `...values` (the user-supplied values). Instead of concatenating them directly — which would put raw user input into the query string — the function builds the SQL template with numbered placeholders like `$1`, `$2` where each expression was, and returns the query string plus a `params` array with the actual values. The database driver then executes the parameterized query, handling escaping properly. So `sql\`SELECT * FROM users WHERE id = ${userId}\`` returns `{ query: 'SELECT * FROM users WHERE id = $1', params: [userId] }`. The key insight is that the tag function has access to the expression values before they're interpolated, which is exactly where the injection would happen if you used regular template strings."

---

## Self-Check / Tự Kiểm Tra

> **Close this doc. Then answer from memory.**

- **Retrieval**: What does `Reflect.set(target, key, value, receiver)` do that `return true` inside a Proxy trap doesn't?
- **Visual**: Sketch the tagged template call `sql\`WHERE id = ${userId} AND active = ${isActive}\`` — what arguments does the `sql` function receive?
- **Application**: You want to add `@Required` and `@MinLength(5)` decorators that work with a `validate(obj)` function. How do you implement the metadata storage?
- **Debug**: Your Proxy `set` trap uses `Reflect.set(target, key, value)` (no receiver). A property inherited from the prototype has a setter. What breaks and why?
- **Teach**: Explain tagged template literals to a junior using the "form with labeled fields" analogy.

🔁 **Spaced repetition**: Review in 3 days → 7 days → 14 days

## Connections / Liên Kết

- ⬅️ **Built on**: [ES6+ Features Deep](./11-es6-features-deep.md) — Proxy and Symbol.toPrimitive
- ⬅️ **Built on**: [Advanced Patterns](./17-advanced-patterns-theory.md) — Decorators
- 🔗 **Applied in**: [TypeScript Advanced](../02-typescript/02-advanced-types.md) — TypeScript emits decorator metadata via reflect-metadata
- 🔗 **Applied in**: [React Patterns](../03-react/08-react-patterns-advanced.md) — styled-components tagged templates

[← Previous: Advanced Patterns](./17-advanced-patterns-theory.md) | [Next: Concurrency Models →](./19-concurrency-models-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
