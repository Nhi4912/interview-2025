# JavaScript Metaprogramming - Theory / Metaprogramming JavaScript - Lý Thuyết

## Table of Contents / Mục Lục

1. [Metaprogramming Fundamentals](#metaprogramming-fundamentals)
2. [Reflection](#reflection)
3. [Dynamic Code Generation](#dynamic-code-generation)
4. [DSL Creation](#dsl-creation)
5. [Code Transformation](#code-transformation)
6. [Interview Questions](#interview-questions)

---

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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🔴 [Senior] Q1: What is metaprogramming and why use it?

**English Answer:**

**Metaprogramming** is code that manipulates code.

**Techniques:**
1. **Reflection**: Inspect code structure
2. **Introspection**: Examine objects
3. **Intercession**: Modify behavior
4. **Code Generation**: Create code dynamically

**Use Cases:**
- Frameworks and libraries
- ORMs and query builders
- Validation frameworks
- Serialization/deserialization
- Dependency injection
- Aspect-oriented programming

**Benefits:**
- Reduce boilerplate
- Increase flexibility
- Enable DSLs
- Runtime adaptation

**Drawbacks:**
- Complexity
- Performance overhead
- Harder debugging
- Less type safety

**Tiếng Việt:**

Metaprogramming là code thao tác code. Dùng cho frameworks, ORMs, validation, serialization, DI, AOP.

### 🔴 [Senior] Q2: Explain Reflect API and its advantages

**English Answer:**

**Reflect API** provides methods for interceptable operations:

**Methods:**
- `Reflect.get/set` - Property access
- `Reflect.has` - Property existence
- `Reflect.deleteProperty` - Delete property
- `Reflect.construct` - Create instance
- `Reflect.apply` - Call function
- `Reflect.defineProperty` - Define property
- `Reflect.getPrototypeOf/setPrototypeOf` - Prototype access

**Advantages over operators:**
1. **Return values**: Boolean instead of throwing
2. **Consistency**: Uniform API
3. **Functional**: Can be used with apply/call
4. **Proxy integration**: Same traps as Proxy

**Example:**
```typescript
// Old way
try {
  delete obj.prop;
} catch (e) {}

// Reflect way
const success = Reflect.deleteProperty(obj, 'prop');
```

**Tiếng Việt:**

Reflect API cung cấp methods cho các thao tác có thể chặn. Ưu điểm: return values, consistency, functional, proxy integration.

### 🔴 [Senior] Q3: How to create a DSL in JavaScript?

**English Answer:**

**Steps to create DSL:**

1. **Define Domain**: Identify problem domain
2. **Design Syntax**: Create intuitive API
3. **Implement Builder**: Fluent interface
4. **Add Validation**: Check correctness
5. **Generate Output**: Produce result

**Patterns:**
- **Method Chaining**: `query.where().and().orderBy()`
- **Builder Pattern**: Step-by-step construction
- **Template Strings**: Tagged templates
- **Proxy**: Intercept operations

**Example:**
```typescript
// SQL-like DSL
const query = select('name', 'age')
  .from('users')
  .where('age', '>', 18)
  .orderBy('name')
  .limit(10);
```

**Tiếng Việt:**

Tạo DSL: định nghĩa domain, thiết kế syntax, triển khai builder, thêm validation, tạo output. Dùng method chaining, builder pattern, template strings, proxy.

---

## Summary / Tóm Tắt

**Key Concepts:**
1. Metaprogramming manipulates code at runtime
2. Reflection inspects and modifies objects
3. Dynamic code generation creates functions/classes
4. DSLs provide domain-specific syntax
5. Proxy and Reflect enable intercession
6. Metadata adds extra information
7. Use for frameworks, ORMs, validation

---

[← Previous: Advanced Patterns](./17-advanced-patterns-theory.md) | [Next: Concurrency Models →](./19-concurrency-models-theory.md) | [Back to Table of Contents](../../00-table-of-contents.md)
