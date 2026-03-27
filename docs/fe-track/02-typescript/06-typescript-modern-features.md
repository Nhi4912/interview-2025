# Modern TypeScript Features (4.0-5.3) - Theory / Tính Năng TypeScript Hiện Đại - Lý Thuyết

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Real-World Scenario / Tình Huống Thực Tế

**React component library at a tech company:** Library ships `<Button variant="primary" size="large">`. Without modern TypeScript: `variant: string` — any misspelling passes silently at compile time. With template literal types + const type parameters: `variant: 'primary' | 'secondary' | 'danger'` is generated from the design token object via `keyof typeof VARIANTS`. With TS 5.0 decorators: `@memoize`, `@validate` work without Babel. With `using` declarations: database connections in API routes automatically close on scope exit, even on error.

**Bài học:** Modern TypeScript features (TS 4.x–5.x) solve specific real problems: template literals for type-safe string patterns, const type parameters for preserving literal inference in generic functions, decorators for clean metaprogramming, `using` for deterministic resource cleanup.

## What & Why / Cái Gì & Tại Sao

**TypeScript release cadence:** Major version every ~year. Interviewers at Senior level ask about newer features. Key additions to know: TypeScript 4.x (template literal types, key remapping, variadic tuples), TypeScript 5.x (`const` type parameters, decorators Stage 3, `satisfies`, `using`).

**The biggest practical impact features (2024):** `satisfies` (validates + preserves literals), `const` type parameters (generic functions that preserve literals without `as const`), decorators (finally standardized after years of experimental), `using` declarations (explicit resource management).

## Concept Map / Bản Đồ Khái Niệm

```
[Modern TypeScript Features — Interview-Critical]
        │
        ├── TypeScript 4.x
        │       ├── Variadic tuple types: [...T, ...U] — compose tuples
        │       ├── Template literal types: `on${Capitalize<K>}` — string patterns
        │       └── Key remapping: [K in keyof T as `get${Capitalize<K>}`]
        │
        ├── TypeScript 5.x
        │       ├── Decorators (Stage 3): @decorator on class/method/field (standard)
        │       ├── const type parameters: <const T> — preserves literals in generics
        │       ├── satisfies: validates shape + keeps literal inference
        │       └── using declarations: explicit resource management (Symbol.dispose)
        │
        └── Best Practices
                ├── unknown > any (force type narrowing)
                ├── Branded types: string & { brand: unique symbol }
                └── satisfies for config objects
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Template Literal Types + Key Remapping (TS 4.x)

**🧠 Memory Hook:** "**Template literal type = string interpolation at type level. Key remapping = `as` in mapped type to rename keys. Together: derive typed APIs from data structures.**"

**Why does this exist? / Tại sao tồn tại?**

- Why template literal types? Libraries like React, Express, CSS-in-JS use string patterns. Without template literal types, these patterns are untyped strings — TypeScript can't validate them. With template literal types, `'onClick'` is constrained to `` `on${Capitalize<EventName>}` `` — typos become compile errors
- Why key remapping? Mapped types previously could only transform property values. Key remapping (TS 4.1) adds `as NewKeyExpression` to transform property keys — rename all properties with a prefix, filter properties by condition, or derive getter/setter pairs from a source type

**Visual — Template Literals + Key Remapping:**

```typescript
// Template literal type — string pattern types
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`; // 'onClick' | 'onFocus' | 'onBlur'

// Key remapping — derive getter/setter from model
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserModel = { name: string; age: number };
type UserGetters = Getters<UserModel>;
// Result: { getName: () => string; getAge: () => number }

// Filter keys with key remapping (conditional key → never removes it)
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type Product = { id: number; name: string; sku: string; price: number };
type StringFields = OnlyStrings<Product>; // { name: string; sku: string }

// Combined: derive typed event handler record
type EventMap = { click: MouseEvent; focus: FocusEvent; keydown: KeyboardEvent };
type Handlers = {
  [K in keyof EventMap as `on${Capitalize<string & K>}`]: (e: EventMap[K]) => void;
};
// { onClick: (e: MouseEvent) => void; onFocus: ... }
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Manually writing all handler names: `onClick`, `onFocus`... | Hard-coded names go stale when source types change — no compile-time connection to source type | Use template literal: `` `on${Capitalize<EventName>}` `` to auto-derive handler names from event types |
| Key remapping without `string &`: `` `get${Capitalize<K>}` `` causes errors | `keyof T` includes `number` and `symbol` keys — template literals only accept `string` | Use `string & K` to ensure K is treated as string: `` `get${Capitalize<string & K>}` `` |
| Using template literal type for runtime string matching | Template literal types are compile-time only — they generate no runtime code | For runtime string matching use regex or string methods; template literal types are type-level only |

**🎯 Interview Pattern:**

- **Trigger**: "type-safe event handlers" / "derive getter types" / "filter properties by type"
- **Opening**: "Template literal types let you create string types from patterns — `` `on${Capitalize<K>}` `` generates all handler names from event names. Key remapping adds `as` to mapped types to rename or filter keys. Together, you can derive complex typed APIs from source types without manually maintaining the derived types..."

**🔑 Knowledge Chain:**

- **Prereq**: Mapped types, conditional types, `keyof`, `Capitalize`
- **Enables**: Type-safe CSS-in-JS, event system typing, builder pattern APIs

---

### 2. TypeScript 5.0 — Decorators + `const` Type Parameters

**🧠 Memory Hook:** "**TS 5.0 decorators = Stage 3 standard (finally). `const` type parameters = generic function that preserves literal types like `as const` at call site — without the caller needing to add `as const`.**"

**Why does this exist? / Tại sao tồn tại?**

- Why new decorators in TS 5.0? TypeScript had `experimentalDecorators` since TS 1.5 based on an older TC39 proposal. TS 5.0 implements the finalized Stage 3 decorator proposal — different semantics, incompatible with the experimental version. The new decorators work without Babel transforms
- Why `const` type parameters? When you pass `[1, 2, 3]` to `function id<T>(x: T)`, TypeScript infers `T = number[]` (widened). Adding `as const` at call site is verbose and easy to forget. `function id<const T>(x: T)` tells TypeScript to infer the most literal type automatically — callers don't need `as const`

**Visual — Decorators + `const` Type Parameters:**

```typescript
// === TS 5.0 Decorators (Stage 3) ===
// Class decorator
function sealed(target: new (...args: any[]) => any) {
  Object.seal(target);
  Object.seal(target.prototype);
}

// Method decorator with context
function log(target: Function, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${methodName}`);
    return target.call(this, ...args);
  };
}

@sealed
class ApiClient {
  @log
  fetchUser(id: string) {
    return fetch(`/users/${id}`);
  }
}

// === const type parameters (TS 5.0) ===
// Without const — widens to string[]
function tags<T extends string[]>(values: T): T {
  return values;
}
const t1 = tags(["a", "b", "c"]); // type: string[] (widened)

// With const — preserves literals
function tagsConst<const T extends string[]>(values: T): T {
  return values;
}
const t2 = tagsConst(["a", "b", "c"]); // type: readonly ['a', 'b', 'c'] ✅
// Caller doesn't need to add 'as const'!
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using old `experimentalDecorators` with TS 5.0+ | The two decorator implementations have incompatible semantics — mixing them causes runtime errors or type failures | Disable `experimentalDecorators`, use TS 5.0 standard decorators only |
| `<T>` when you want literal type inference | Without `const`, TypeScript widens `['a', 'b']` to `string[]` — literal types are lost | Use `<const T>` — tells TypeScript to infer the most specific (narrowest) literal type at the call site |
| Applying `const` type parameter to a generic function where `T` is mutable | Implies readonly/literal semantics that the caller may not intend — misleading API contract | Only use `<const T>` when the function genuinely treats the value as readonly/literal-typed |

**🎯 Interview Pattern:**

- **Trigger**: "TypeScript decorators" / "preserve literal in generic" / "const type parameter"
- **Opening**: "TypeScript 5.0 shipped two major features. Standard decorators — the finalized Stage 3 proposal — replacing the 10-year-old experimental decorators. And `const` type parameters: adding `const` before a generic parameter tells TypeScript to infer the narrowest literal type, so callers don't need to add `as const` themselves..."

**🔑 Knowledge Chain:**

- **Prereq**: Generics, literal types, decorators (Stage 3 proposal)
- **Enables**: Type-safe class decorators, library APIs that preserve caller literals

---

### 3. `using` Declarations + Branded Types (TS 5.2)

**🧠 Memory Hook:** "**`using x = resource` → `x[Symbol.dispose]()` is called when block exits (even on error). Branded types = `string & { readonly _brand: unique symbol }` — prevents mixing ID types.**"

**Why does this exist? / Tại sao tồn tại?**

- Why `using` declarations? Cleanup code (`db.close()`, `conn.release()`, `lock.unlock()`) is easy to forget, especially in error paths. `try/finally` is verbose. `using` ensures `Symbol.dispose` is called at block exit — like C# `using`, Python `with`, or Java try-with-resources
- Why branded types? TypeScript uses structural typing — `UserId = string` and `PostId = string` are interchangeable. Accidentally passing a `PostId` to a function expecting `UserId` compiles fine. Branded types add a phantom property that structurally distinguishes them: `UserId = string & { _brand: 'UserId' }` is a different type from `PostId = string & { _brand: 'PostId' }` at the type level, while both are just strings at runtime

**Visual — `using` + Branded Types:**

```typescript
// === using declarations ===
class DatabaseConnection {
  constructor(private url: string) {
    /* connect */
  }
  query(sql: string) {
    /* ... */
  }
  [Symbol.dispose]() {
    console.log("Connection closed"); // called automatically
  }
}

async function handleRequest() {
  using db = new DatabaseConnection(process.env.DB_URL);
  // db.query works here
  const users = await db.query("SELECT * FROM users");
  return users;
  // ← db[Symbol.dispose]() called here, even if query throws ✅
}

// await using for async dispose:
class AsyncResource {
  async [Symbol.asyncDispose]() {
    await cleanup();
  }
}
async function work() {
  await using res = new AsyncResource();
  // res[Symbol.asyncDispose]() called on exit
}

// === Branded types ===
type UserId = string & { readonly _brand: unique symbol };
type PostId = string & { readonly _brand: unique symbol };

// Brand constructor (type assertion for creation)
function createUserId(id: string): UserId {
  return id as UserId;
}

function getUser(id: UserId): User {
  /* ... */
}
function getPost(id: PostId): Post {
  /* ... */
}

const userId = createUserId("user-123");
const postId = "post-456" as PostId;

getUser(userId); // ✅
getUser(postId); // ❌ Argument of type 'PostId' is not assignable to parameter of type 'UserId'
getUser("raw"); // ❌ 'string' is not assignable to 'UserId'
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Using `await using` for synchronous resources | `await using` calls `Symbol.asyncDispose` — a mismatch for sync resources that only implement `Symbol.dispose` | Use `using` for sync (`Symbol.dispose`); `await using` only for async (`Symbol.asyncDispose`) |
| `type UserId = string` — no structural difference from other ID types | TypeScript's structural typing makes `UserId` and `PostId` identical — they're interchangeable, no safety | Brand with `unique symbol`: `string & { readonly _brand: unique symbol }` creates a distinct structural type |
| Direct `as UserId` type assertions scattered throughout the codebase | Assertions bypass validation — every call site is a potential source of invalid branded values | Create a constructor `createUserId(id: string): UserId` — single place to add validation logic |

**🎯 Interview Pattern:**

- **Trigger**: "resource management" / "database connection cleanup" / "type-safe IDs" / "branded types"
- **Opening**: "For resource management, `using` declarations implement the TC39 Explicit Resource Management proposal. Any object with `[Symbol.dispose]()` will have it called automatically when the block exits — including on error. For type-safe IDs, branded types use a phantom `unique symbol` property to structurally distinguish IDs that are all `string` at runtime but shouldn't be interchangeable..."

**🔑 Knowledge Chain:**

- **Prereq**: TypeScript structural typing, Symbols, generics
- **Enables**: Safe resource management patterns, type-safe API boundaries, domain-driven design with TypeScript

---

## Reference Theory / Tài Liệu Tham Khảo

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
  arr2: [...U],
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result = concat([1, 2], ["a", "b"]);
// Type: [number, number, string, string]
```

**Curry Functions:**

```typescript
type Curry<P extends unknown[], R> = P extends [infer First, ...infer Rest]
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
type Greeting = `hello ${World}`; // "hello world"
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
  [K in keyof T as NewKeyType]: T[K];
};
```

**Examples:**

**Getters:**

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
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
  [K in keyof T as Exclude<K, "kind">]: T[K];
};

type Circle = { kind: "circle"; radius: number };
type CircleWithoutKind = RemoveKindField<Circle>;
// { radius: number }
```

**Transform Keys:**

```typescript
type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

type TransformKeys<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K];
};
```

### Recursive Conditional Types (4.1) / Kiểu Điều Kiện Đệ Quy

**English:** Conditional types can now reference themselves.

**Tiếng Việt:** Kiểu điều kiện giờ có thể tham chiếu chính nó.

**Deep Partial:**

```typescript
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

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
type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;
```

**Flatten Array:**

```typescript
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type Nested = number[][][];
type Flat = Flatten<Nested>; // number
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
  return obj[key]; // Type: T[keyof T]
}
```

**After:**

```typescript
function get<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Type: T[K]
}
```

---

## TypeScript 5.0 Features / Tính Năng TypeScript 5.0

### Decorators (5.0) / Decorators

**English:** ECMAScript decorators support (Stage 3).

**Tiếng Việt:** Hỗ trợ decorators ECMAScript (Stage 3).

**Class Decorators:**

```typescript
function sealed<T extends { new (...args: any[]): {} }>(
  constructor: T,
  context: ClassDecoratorContext,
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
function log<T extends (...args: any[]) => any>(target: T, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: Parameters<T>) {
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
function bound<T extends (...args: any[]) => any>(target: T, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  context.addInitializer(function () {
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

const arr = identity([1, 2, 3]); // Type: number[]
```

**After:**

```typescript
function identity<const T>(value: T) {
  return value;
}

const arr = identity([1, 2, 3]); // Type: readonly [1, 2, 3]
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
  Error = 500,
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
  return { name, age }; // Type: { name: string; age: number; }
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
function logMetadata(target: any, context: ClassMethodDecoratorContext) {
  context.metadata[context.name] = {
    logged: true,
    timestamp: Date.now(),
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
      return value.toUpperCase(); // Type: string
    case typeof value === "number":
      return value.toFixed(2); // Type: number
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

type EventHandler<K extends keyof EventMap> = `on${Capitalize<K>}`;
```

**3. Use Satisfies Operator:**

```typescript
const config = {
  url: "https://api.example.com",
  timeout: 5000,
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
  return value.toUpperCase(); // Unsafe
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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: Use key remapping to derive a type where all methods of an object return their value asynchronously. / Dùng key remapping để derive type với async methods.

**A:** This combines mapped types + key remapping + conditional types:

```typescript
type Async<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K] extends (
    ...args: infer A
  ) => infer R
    ? (...args: A) => Promise<R>
    : never;
};

// Source type
type UserService = {
  getUser: (id: string) => User;
  deleteUser: (id: string) => void;
  userName: string; // not a function — filtered out
};

type AsyncUserService = Async<UserService>;
// Result:
// {
//   getUser: (id: string) => Promise<User>
//   deleteUser: (id: string) => Promise<void>
//   // userName is filtered out (not a function)
// }
```

**Explanation:**

- `as T[K] extends (...) ? K : never` — key remapping with conditional: keeps only function keys
- `(...args: A) => Promise<R>` — wraps return type in Promise using `infer` to capture args and return type

**Tiếng Việt:** Key remapping với conditional `as ... ? K : never` filter chỉ giữ lại method keys. Conditional type extract arg/return types bằng `infer`. Wrap return trong `Promise<R>`. Kết quả là typed async version của service.

💡 **Interview Signal:**

- ✅ Strong: Uses both key remapping for filtering AND conditional + infer for return type transformation; explains each part
- ❌ Weak: `type Async<T> = { [K in keyof T]: Promise<T[K]> }` — doesn't filter non-functions, doesn't extract function signature

---

### 🟡 [Mid] Q2: What problem does `const` type parameter solve? Show the difference with and without it. / `const` type parameter giải quyết vấn đề gì?

**A:** `const` type parameter (TS 5.0) makes a generic function infer the most specific (literal) type from the argument — without the caller needing `as const`.

**Without `const` — values widen:**

```typescript
function createRoutes<T extends readonly string[]>(routes: T): T {
  return routes;
}

const r1 = createRoutes(["/", "/about", "/contact"]);
// T inferred as: string[] (widened — not useful)
r1[0]; // type: string
```

**With `const` — literals preserved:**

```typescript
function createRoutes<const T extends readonly string[]>(routes: T): T {
  return routes;
}

const r2 = createRoutes(["/", "/about", "/contact"]);
// T inferred as: readonly ['/', '/about', '/contact'] ← literal tuple
r2[0]; // type: '/' ✅

// Useful for route validation:
type Route = (typeof r2)[number]; // type: '/' | '/about' | '/contact'
function navigate(route: Route) {
  window.location.href = route;
}
navigate("/about"); // ✅
navigate("/missing"); // ❌ TypeScript error ← prevents invalid navigation
```

**Why not just tell callers `as const`?** `const` type parameter is caller-ergonomic — library authors add it once; users don't need to remember `as const` on every call.

**Tiếng Việt:** `const` type parameter = generic function tự infer literal type không cần caller thêm `as const`. Useful cho library authors — user gọi tự nhiên, vẫn nhận được precise literal types. Use case: route tables, event lists, config values.

💡 **Interview Signal:**

- ✅ Strong: Shows the before/after; explains the library author vs caller ergonomics angle; derives union type from the result
- ❌ Weak: "`const` type parameter makes generics readonly" — partially true but misses the literal inference story

---

### 🔴 [Senior] Q3: Why are branded types necessary in TypeScript? Implement `UserId` and `PostId` that can't be confused. / Tại sao cần branded types? Implement UserId và PostId.

**A:** TypeScript is structurally typed — `type UserId = string` and `type PostId = string` are identical types. You can pass a `PostId` where a `UserId` is expected with no TypeScript error. Branded types add a phantom structural marker that differentiates them:

```typescript
// Branded type pattern using unique symbol
declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

// Constructor functions (single place to validate + brand)
function createUserId(raw: string): UserId {
  if (!raw.startsWith("user_")) throw new Error("Invalid UserId format");
  return raw as UserId; // ← type assertion inside constructor only
}

function createPostId(raw: string): PostId {
  if (!raw.startsWith("post_")) throw new Error("Invalid PostId format");
  return raw as PostId;
}

// Functions with branded parameters
function getUser(id: UserId): User {
  /* ... */
}
function getPost(id: PostId): Post {
  /* ... */
}

const uid = createUserId("user_123");
const pid = createPostId("post_456");

getUser(uid); // ✅
getPost(pid); // ✅
getUser(pid); // ❌ Type 'PostId' is not assignable to parameter of type 'UserId'
getUser("raw"); // ❌ string is not branded — TypeScript error ✅

// At runtime: uid, pid are just strings — zero overhead
console.log(typeof uid); // 'string'
```

**Why `unique symbol`?** Each `declare const __brand: unique symbol` creates a completely unique phantom property name — no two branded types will accidentally have the same brand.

**Tiếng Việt:** TypeScript structural: `UserId = string` và `PostId = string` là cùng type — có thể nhầm. Branded type thêm phantom property để phân biệt structurally. `unique symbol` đảm bảo mỗi brand là unique. Constructor function đóng gói validation + assertion. Runtime: chỉ là string — zero overhead.

💡 **Interview Signal:**

- ✅ Strong: Explains why structural typing creates the problem; uses `unique symbol` (not just `'UserId'` string literal for brand); wraps creation in constructor with validation
- ❌ Weak: `type UserId = { id: string }` — creates a wrapper object (runtime overhead) instead of nominal brand

---

### 🔴 [Senior] Q4: A Next.js API route opens a database connection. How do you use `using` to guarantee cleanup? / Dùng `using` để cleanup database connection trong Next.js API route.

**A:** Implement `Symbol.dispose` (or `Symbol.asyncDispose` for async cleanup) on the connection class:

```typescript
// connection.ts
class DatabaseConnection {
  private client: PgClient;

  constructor() {
    this.client = new PgClient(process.env.DATABASE_URL);
    await this.client.connect(); // ← needs await using
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const result = await this.client.query(sql, params);
    return result.rows;
  }

  async [Symbol.asyncDispose]() {
    await this.client.end();
    console.log("DB connection closed");
  }
}

// API route (Next.js App Router)
export async function GET(request: Request) {
  await using db = await DatabaseConnection.create();
  // ← db[Symbol.asyncDispose]() called when this block exits
  //    even if query throws, even if response is sent

  const users = await db.query<User>("SELECT * FROM users");
  return Response.json(users);
  // ← cleanup happens here automatically ✅
}
```

**Before `using` — fragile try/finally:**

```typescript
const db = await DatabaseConnection.create();
try {
  const users = await db.query<User>("SELECT * FROM users");
  return Response.json(users);
} finally {
  await db.close(); // ← easy to forget; must be in EVERY code path
}
```

**Key distinction:** `using` = sync disposal (Symbol.dispose). `await using` = async disposal (Symbol.asyncDispose). For database connections, network resources — use `await using`.

**Tiếng Việt:** `await using db = ...` gọi `db[Symbol.asyncDispose]()` khi block exit — kể cả khi throw. Không cần try/finally. Implement `[Symbol.asyncDispose]()` trong connection class với `await client.end()`. Trước đây phải dùng try/finally — dễ quên hoặc miss cleanup path.

💡 **Interview Signal:**

- ✅ Strong: Correctly uses `await using` (not `using`) for async dispose; explains the disposal guarantee on error paths; compares to the verbose try/finally alternative
- ❌ Weak: "Use try/finally for cleanup" — correct but misses the modern ergonomic solution; or confusing `using` (sync) with `await using` (async)

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                | Difficulty | Core Concept | Key Signal                                            |
| --- | ------------------------------------------------------ | ---------- | ------------ | ----------------------------------------------------- |
| 1   | Key remapping để derive type với async methods         | 🟡 Mid     | Mapped types | `as` clause + conditional key filtering + `infer`     |
| 2   | `const` type parameter giải quyết vấn đề gì?           | 🟡 Mid     | Modern TS    | Literal inference trong generics không cần `as const` |
| 3   | Tại sao cần branded types? Implement `UserId`/`PostId` | 🔴 Senior  | Type safety  | Nominal typing trong structural type system           |
| 4   | Dùng `using` để cleanup database connection            | 🔴 Senior  | Modern TS    | `Symbol.dispose` + guaranteed cleanup kể cả khi throw |

---

## ⚡ Cold Call Simulation

**Q: "Explain what branded types are and when you'd use them instead of just `type UserId = string`."**

**30-second answer:**
"TypeScript uses structural typing, so `type UserId = string` and `type PostId = string` are identical — you can accidentally pass a post ID to a function expecting a user ID with no TypeScript error. Branded types add a phantom property using `unique symbol`: `string & { readonly _brand: unique symbol }`. Now `UserId` and `PostId` are structurally distinct types — TypeScript catches mix-ups at compile time. At runtime, they're still just strings — zero overhead. I use this for domain IDs, currency amounts (can't add USD to VND), measurement units — anywhere structural typing would allow dangerous mixing."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                                             |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | `` `on${Capitalize<EventName>}` `` tạo ra type gì? Làm thế nào để filter chỉ function properties trong mapped type bằng key remapping? `<const T>` trong generic cho caller lợi gì? |
| 2   | 🎨 Visual      | Vẽ branded type structure: `string & { readonly [brand]: 'UserId' }` — điều gì xảy ra tại runtime vs compile time? Vẽ Async utility type map.                                       |
| 3   | 🛠️ Application | Có `const THEME = { primary: '#4A90E2', danger: '#E24A4A' }`. Type function `setColor(key: ThemeKey)` với `ThemeKey` derived từ object keys — fully type-safe.                      |
| 4   | 🐛 Debug       | `function first<T>(arr: T[]): T` trả `string` thay vì `'hello'` cho `first(['hello'])`. Fix thế nào dùng TS 5.0+ features?                                                          |
| 5   | 🎓 Teach       | Giải thích branded types cho Java developer: TypeScript dùng structural typing, branded types là workaround để tạo nominal typing.                                                  |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Template literal biến `"click"\|"hover"` thành `"onClick"\|"onHover"`. Key remapping: `as K extends keyof T ? (T[K] extends Function ? K : never) : never`. `<const T>` = caller giữ literal types. |
| 2   | Branded type tồn tại compile-time only, erased at runtime. `string & { [brand]: 'UserId' }` = structurally `string` + phantom tag. Async map: mỗi method return `Promise<ReturnType>`.              |
| 3   | `type ThemeKey = keyof typeof THEME` → `'primary' \| 'danger'`. Function: `function setColor(key: ThemeKey): void`. Dùng `typeof THEME` để derive từ value.                                         |
| 4   | Thêm `const` type parameter: `function first<const T extends unknown[]>(arr: T): T[0]`. Hoặc dùng `as const` tại call site. TS 5.0 `const` param preserve literal types.                            |
| 5   | Java: `UserId` và `String` là khác nhau dù cùng store string (nominal). TS: mọi string compatible với nhau (structural). Branded types thêm phantom field → make incompatible.                      |

> 🎯 **Feynman Prompt:** Giải thích `using` và `await using` (Resource Management) cho developer chỉ biết `try/finally` — "Tại sao đây là improvement và khi nào nên dùng?"

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: key remapping filter syntax, `const` type parameter use case, branded type with `unique symbol`, `using` vs `await using`.

---

## Connections / Liên Kết

- **Prereqs**: [04-typescript-comprehensive.md](./04-typescript-comprehensive.md) (mapped types, conditional types), [05-type-inference-theory.md](./05-type-inference-theory.md)
- **See also**: [05-react-typescript.md](./05-react-typescript.md) — const type parameters useful for typed React hooks
- **Modern JS**: [../01-javascript/22-modern-javascript-features.md](../01-javascript/22-modern-javascript-features.md) — `using` declarations are also Stage 3 TC39 proposal

---

[← Previous: Modern JavaScript](../01-javascript/22-modern-javascript-features.md) | [Next: Modern React →](../03-react/10-modern-react-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)
