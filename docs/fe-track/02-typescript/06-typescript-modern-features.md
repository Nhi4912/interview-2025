# Modern TypeScript Features (4.0-5.3) - Theory / Tính Năng TypeScript Hiện Đại - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Table of Contents / Mục Lục

1. [TypeScript 4.x Features](#typescript-4x-features)
2. [TypeScript 5.0 Features](#typescript-50-features)
3. [TypeScript 5.1-5.2 Features](#typescript-51-52-features)
4. [TypeScript 5.3+ Features](#typescript-53-features)
5. [Performance Improvements](#performance-improvements)
6. [Best Practices](#best-practices)
7. [Interview Questions](#interview-questions)

---

## TypeScript 4.x Features / Tính Năng TypeScript 4.x

### Variadic Tuple Types (4.0) / Kiểu Tuple Biến Đổi

**English:** Spread elements in tuple types at any position.

**Tiếng Việt:** Phần tử spread trong kiểu tuple ở bất kỳ vị trí nào.

**Before:**
```typescript
// Limited to end only
type Tuple = [string, ...number[]];
```

**After:**
```typescript
// Anywhere in tuple
type Leading = [...string[], number];
type Middle = [string, ...boolean[], number];
type Multiple = [...string[], ...number[]];
```

**Use Cases:**

**Function Composition:**
```typescript
function concat<T extends unknown[], U extends unknown[]>(
  arr1: [...T],
  arr2: [...U]
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result = concat([1, 2], ['a', 'b']);
// Type: [number, number, string, string]
```

**Curry Functions:**
```typescript
type Curry<P extends unknown[], R> = 
  P extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<Rest, R>
    : R;

type CurriedAdd = Curry<[number, number, number], number>;
// (arg: number) => (arg: number) => (arg: number) => number
```

### Template Literal Types (4.1) / Kiểu Template Literal

**English:** Create types from template literal strings.

**Tiếng Việt:** Tạo types từ chuỗi template literal.

**Basic Usage:**
```typescript
type World = "world";
type Greeting = `hello ${World}`;  // "hello world"
```

**With Unions:**
```typescript
type Color = "red" | "blue" | "green";
type Quantity = "one" | "two";
type ColoredQuantity = `${Quantity} ${Color}`;
// "one red" | "one blue" | "one green" | 
// "two red" | "two blue" | "two green"
```

**Practical Examples:**

**Event Names:**
```typescript
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"
```

**CSS Properties:**
```typescript
type CSSProperty = "color" | "background" | "border";
type CSSVar = `--${CSSProperty}`;
// "--color" | "--background" | "--border"
```

**API Endpoints:**
```typescript
type Resource = "user" | "post" | "comment";
type Method = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/${Lowercase<Resource>}/${Method}`;
```

### Key Remapping (4.1) / Ánh Xạ Lại Key

**English:** Transform keys in mapped types using as clause.

**Tiếng Việt:** Chuyển đổi keys trong mapped types sử dụng mệnh đề as.

**Syntax:**
```typescript
type MappedType<T> = {
  [K in keyof T as NewKeyType]: T[K]
};
```

**Examples:**

**Getters:**
```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

type Person = { name: string; age: number };
type PersonGetters = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

**Filter Keys:**
```typescript
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, "kind">]: T[K]
};

type Circle = { kind: "circle"; radius: number };
type CircleWithoutKind = RemoveKindField<Circle>;
// { radius: number }
```

**Transform Keys:**
```typescript
type SnakeToCamel<S extends string> = 
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamel<U>>}`
    : S;

type TransformKeys<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K]
};
```

### Recursive Conditional Types (4.1) / Kiểu Điều Kiện Đệ Quy

**English:** Conditional types can now reference themselves.

**Tiếng Việt:** Kiểu điều kiện giờ có thể tham chiếu chính nó.

**Deep Partial:**
```typescript
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type Nested = {
  a: {
    b: {
      c: number;
    };
  };
};

type PartialNested = DeepPartial<Nested>;
// {
//   a?: {
//     b?: {
//       c?: number;
//     };
//   };
// }
```

**Deep Readonly:**
```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

**Flatten Array:**
```typescript
type Flatten<T> = T extends Array<infer U>
  ? Flatten<U>
  : T;

type Nested = number[][][];
type Flat = Flatten<Nested>;  // number
```

### Abstract Construct Signatures (4.2) / Chữ Ký Khởi Tạo Trừu Tượng

**English:** Type abstract class constructors properly.

**Tiếng Việt:** Gõ constructors lớp trừu tượng đúng cách.

**Syntax:**
```typescript
abstract class Shape {
  abstract getArea(): number;
}

type ShapeConstructor = abstract new () => Shape;

function createShape(ctor: ShapeConstructor) {
  // Can't instantiate abstract class
  // return new ctor();  // Error
}
```

### Indexed Access Improvements (4.3) / Cải Tiến Truy Cập Indexed

**English:** Better type narrowing for indexed access.

**Tiếng Việt:** Thu hẹp kiểu tốt hơn cho truy cập indexed.

**Before:**
```typescript
function get<T>(obj: T, key: keyof T) {
  return obj[key];  // Type: T[keyof T]
}
```

**After:**
```typescript
function get<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];  // Type: T[K]
}
```

---

## TypeScript 5.0 Features / Tính Năng TypeScript 5.0

### Decorators (5.0) / Decorators

**English:** ECMAScript decorators support (Stage 3).

**Tiếng Việt:** Hỗ trợ decorators ECMAScript (Stage 3).

**Class Decorators:**
```typescript
function sealed<T extends { new(...args: any[]): {} }>(
  constructor: T,
  context: ClassDecoratorContext
) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      Object.seal(this);
    }
  };
}

@sealed
class MyClass {
  name = "test";
}
```

**Method Decorators:**
```typescript
function log<T extends (...args: any[]) => any>(
  target: T,
  context: ClassMethodDecoratorContext
) {
  return function(this: any, ...args: Parameters<T>) {
    console.log(`Calling ${String(context.name)}`);
    return target.apply(this, args);
  };
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
```

**Accessor Decorators:**
```typescript
function bound<T extends (...args: any[]) => any>(
  target: T,
  context: ClassMethodDecoratorContext
) {
  const methodName = context.name;
  context.addInitializer(function() {
    (this as any)[methodName] = (this as any)[methodName].bind(this);
  });
}
```

### const Type Parameters (5.0) / Tham Số Kiểu const

**English:** Infer most specific type for generic parameters.

**Tiếng Việt:** Suy luận kiểu cụ thể nhất cho tham số generic.

**Before:**
```typescript
function identity<T>(value: T) {
  return value;
}

const arr = identity([1, 2, 3]);  // Type: number[]
```

**After:**
```typescript
function identity<const T>(value: T) {
  return value;
}

const arr = identity([1, 2, 3]);  // Type: readonly [1, 2, 3]
```

**Use Cases:**

**Tuple Inference:**
```typescript
function tuple<const T extends readonly unknown[]>(...args: T) {
  return args;
}

const t = tuple(1, "hello", true);
// Type: readonly [1, "hello", true]
```

**Object Literals:**
```typescript
function config<const T>(obj: T) {
  return obj;
}

const cfg = config({ mode: "production", port: 3000 });
// Type: { readonly mode: "production"; readonly port: 3000; }
```

### Multiple Config Files (5.0) / Nhiều File Config

**English:** Extend from multiple tsconfig files.

**Tiếng Việt:** Mở rộng từ nhiều file tsconfig.

**Syntax:**
```json
{
  "extends": ["./base.json", "./strict.json"],
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

**Benefits:**
- Compose configurations
- Share settings
- Environment-specific configs
- Better organization

### Enum Improvements (5.0) / Cải Tiến Enum

**English:** Better type checking for enums.

**Tiếng Việt:** Kiểm tra kiểu tốt hơn cho enums.

**Union Enums:**
```typescript
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500
}

// Now properly typed
function handleStatus(status: Status) {
  switch (status) {
    case Status.Success:
      return "OK";
    case Status.NotFound:
      return "Not Found";
    case Status.Error:
      return "Error";
  }
}
```

---

## TypeScript 5.1-5.2 Features / Tính Năng TypeScript 5.1-5.2

### Easier Implicit Returns (5.1) / Return Ngầm Dễ Hơn

**English:** Better inference for functions with implicit returns.

**Tiếng Việt:** Suy luận tốt hơn cho hàm với return ngầm.

**Before:**
```typescript
function createPerson(name: string, age: number) {
  return { name, age };  // Type: { name: string; age: number; }
}
```

**After:**
```typescript
// Better inference with control flow
function createPerson(name: string, age: number) {
  if (age < 0) {
    return { name, age: 0 };
  }
  return { name, age };
}
// Type properly unified
```

### JSX Improvements (5.1) / Cải Tiến JSX

**English:** Better type checking for JSX elements.

**Tiếng Việt:** Kiểm tra kiểu tốt hơn cho phần tử JSX.

**Namespace Support:**
```typescript
declare namespace JSX {
  interface IntrinsicElements {
    "my-element": { prop: string };
  }
}

// Now works
<my-element prop="value" />
```

### using Declarations (5.2) / Khai Báo using

**English:** Explicit resource management (Stage 3 proposal).

**Tiếng Việt:** Quản lý tài nguyên rõ ràng (đề xuất Stage 3).

**Syntax:**
```typescript
{
  using file = await openFile("data.txt");
  // Use file
} // Automatically disposed
```

**Symbol.dispose:**
```typescript
class Resource {
  [Symbol.dispose]() {
    // Cleanup logic
    console.log("Disposing resource");
  }
}

{
  using resource = new Resource();
  // Use resource
} // Automatically calls [Symbol.dispose]
```

### Decorator Metadata (5.2) / Metadata Decorator

**English:** Attach metadata to decorated elements.

**Tiếng Việt:** Đính kèm metadata vào phần tử decorated.

**Syntax:**
```typescript
function logMetadata(
  target: any,
  context: ClassMethodDecoratorContext
) {
  context.metadata[context.name] = {
    logged: true,
    timestamp: Date.now()
  };
}

class MyClass {
  @logMetadata
  method() {}
}
```

---

## TypeScript 5.3+ Features / Tính Năng TypeScript 5.3+

### Import Attributes (5.3) / Thuộc Tính Import

**English:** Specify import assertions for non-JS modules.

**Tiếng Việt:** Chỉ định import assertions cho modules không phải JS.

**Syntax:**
```typescript
import data from "./data.json" with { type: "json" };
import styles from "./styles.css" with { type: "css" };
```

**Benefits:**
- Type-safe imports
- Module type specification
- Better tooling support

### Resolution Mode (5.3) / Chế Độ Resolution

**English:** Control module resolution per import.

**Tiếng Việt:** Kiểm soát module resolution mỗi import.

**Syntax:**
```typescript
/// <reference types="node" resolution-mode="require" />
/// <reference types="node" resolution-mode="import" />

import type { RequestHandler } from "express" with { "resolution-mode": "require" };
```

### Switch (true) Narrowing (5.3) / Thu Hẹp Switch (true)

**English:** Better type narrowing in switch(true) statements.

**Tiếng Việt:** Thu hẹp kiểu tốt hơn trong câu lệnh switch(true).

**Example:**
```typescript
function process(value: string | number) {
  switch (true) {
    case typeof value === "string":
      return value.toUpperCase();  // Type: string
    case typeof value === "number":
      return value.toFixed(2);     // Type: number
  }
}
```

### Isolated Declarations (5.5 Planned) / Khai Báo Cô Lập

**English:** Generate .d.ts files without full type checking.

**Tiếng Việt:** Tạo files .d.ts mà không cần kiểm tra kiểu đầy đủ.

**Benefits:**
- Faster builds
- Parallel compilation
- Better performance
- Incremental builds

---

## Performance Improvements / Cải Tiến Hiệu Suất

### TypeScript 5.0 Performance / Hiệu Suất TypeScript 5.0

**Improvements:**

**1. Faster Type Checking:**
- 10-20% faster on average
- Better caching
- Optimized algorithms
- Reduced memory usage

**2. Faster Builds:**
- Incremental builds improved
- Better module resolution
- Parallel processing
- Smarter invalidation

**3. Smaller Package:**
- 26.4 MB → 20.4 MB
- Faster installation
- Less disk space
- Quicker downloads

### TypeScript 5.1+ Performance / Hiệu Suất TypeScript 5.1+

**Optimizations:**

**1. Faster Union Reduction:**
- Better algorithm
- Reduced complexity
- Faster type operations

**2. Improved Inference:**
- Smarter caching
- Reduced work
- Better heuristics

**3. Module Resolution:**
- Faster lookups
- Better caching
- Optimized paths

---

## Best Practices / Thực Hành Tốt Nhất

### Modern TypeScript Patterns / Patterns TypeScript Hiện Đại

**1. Use const Type Parameters:**
```typescript
// Prefer
function tuple<const T extends readonly unknown[]>(...args: T) {
  return args;
}

// Over
function tuple<T extends readonly unknown[]>(...args: T): T {
  return args;
}
```

**2. Leverage Template Literals:**
```typescript
// Type-safe event handlers
type EventMap = {
  click: MouseEvent;
  focus: FocusEvent;
};

type EventHandler<K extends keyof EventMap> = 
  `on${Capitalize<K>}`;
```

**3. Use Satisfies Operator:**
```typescript
const config = {
  url: "https://api.example.com",
  timeout: 5000
} satisfies Config;

// Keeps literal types while checking structure
```

**4. Prefer Unknown Over Any:**
```typescript
// Prefer
function process(value: unknown) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
}

// Over
function process(value: any) {
  return value.toUpperCase();  // Unsafe
}
```

**5. Use Branded Types:**
```typescript
type UserId = string & { readonly brand: unique symbol };
type PostId = string & { readonly brand: unique symbol };

function getUser(id: UserId) {}
function getPost(id: PostId) {}

// Type-safe IDs
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### 🟡 [Mid] Q1: Explain template literal types

**English Answer:**

**Template Literal Types** create types from template strings.

**Syntax:**
```typescript
type Greeting = `hello ${string}`;
```

**With Unions:**
```typescript
type Color = "red" | "blue";
type Size = "small" | "large";
type Variant = `${Size}-${Color}`;
// "small-red" | "small-blue" | "large-red" | "large-blue"
```

**Use Cases:**
- Event names: `on${EventName}`
- CSS variables: `--${Property}`
- API endpoints: `/${Resource}/${Method}`
- Type-safe strings

**Intrinsic Helpers:**
- `Uppercase<T>`
- `Lowercase<T>`
- `Capitalize<T>`
- `Uncapitalize<T>`

**Tiếng Việt:**

Template literal types tạo types từ template strings. Use cases: event names, CSS variables, API endpoints. Intrinsic helpers: Uppercase, Lowercase, Capitalize, Uncapitalize.

### 🔴 [Senior] Q2: What are const type parameters?

**English Answer:**

**const Type Parameters** infer most specific type.

**Without const:**
```typescript
function identity<T>(value: T) {
  return value;
}

const arr = identity([1, 2, 3]);  // number[]
```

**With const:**
```typescript
function identity<const T>(value: T) {
  return value;
}

const arr = identity([1, 2, 3]);  // readonly [1, 2, 3]
```

**Benefits:**
- Literal types preserved
- Readonly inference
- Better type safety
- More precise types

**Use Cases:**
- Tuple functions
- Configuration objects
- Const assertions
- Type-safe builders

**Tiếng Việt:**

const type parameters suy luận kiểu cụ thể nhất. Benefits: preserve literal types, readonly inference, better type safety. Use cases: tuples, config objects, const assertions.

### 🟢 [Junior] Q3: Explain using declarations

**English Answer:**

**using Declarations** provide explicit resource management.

**Syntax:**
```typescript
{
  using resource = acquireResource();
  // Use resource
} // Automatically disposed
```

**Symbol.dispose:**
```typescript
class Resource {
  [Symbol.dispose]() {
    // Cleanup
  }
}
```

**Benefits:**
- Automatic cleanup
- Exception-safe
- Deterministic disposal
- Better resource management

**Use Cases:**
- File handles
- Database connections
- Locks
- Temporary resources

**Comparison:**
- Similar to C# using
- Like Python with statement
- Java try-with-resources

**Tiếng Việt:**

using declarations cung cấp quản lý tài nguyên rõ ràng. Automatic cleanup, exception-safe, deterministic disposal. Use cases: file handles, database connections, locks.

---

## Summary / Tóm Tắt

**Key Modern Features:**

**TypeScript 4.x:**
- Variadic tuples
- Template literals
- Key remapping
- Recursive conditionals

**TypeScript 5.0:**
- Decorators (Stage 3)
- const type parameters
- Multiple config files
- Enum improvements

**TypeScript 5.1-5.2:**
- Better inference
- JSX improvements
- using declarations
- Decorator metadata

**TypeScript 5.3+:**
- Import attributes
- Resolution mode
- Switch narrowing
- Isolated declarations

**Best Practices:**
- Use const type parameters
- Leverage template literals
- Prefer unknown over any
- Use branded types
- Stay updated with releases

---

[← Previous: Modern JavaScript](../01-javascript/22-modern-javascript-features.md) | [Next: Modern React →](../03-react/10-modern-react-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
