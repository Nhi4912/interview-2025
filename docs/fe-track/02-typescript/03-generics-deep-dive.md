# Generics Deep Dive / Tìm Hiểu Sâu về Generics

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [TypeScript Basics](./01-typescript-basics.md), [Advanced Types](./02-advanced-types.md)
> **See also**: [TypeScript Comprehensive](./04-typescript-comprehensive.md)

[← Previous: Advanced Types](./02-advanced-types.md) | [Next: TypeScript Comprehensive](./04-typescript-comprehensive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Grab's API layer team maintains 200+ endpoints. Every endpoint returns the same envelope shape:

```ts
{ data: T, error: E, meta: M }
```

Without generics, engineers duplicated this wrapper 200+ times — one per endpoint:

```ts
// Before generics: copy-paste hell
interface RideResponse {
  data: Ride;
  error: ApiError;
  meta: PaginationMeta;
}
interface DriverResponse {
  data: Driver;
  error: ApiError;
  meta: PaginationMeta;
}
interface FareResponse {
  data: Fare;
  error: ApiError;
  meta: PaginationMeta;
}
// ... 197 more
```

When the `error` shape changed, 200 files needed updates. With generics, one type serves all:

```ts
interface ApiResponse<T, E = ApiError, M = PaginationMeta> {
  data: T;
  error: E;
  meta: M;
}

type RideResponse = ApiResponse<Ride>;
type DriverResponse = ApiResponse<Driver>;
type FareResponse = ApiResponse<Fare>;
```

But junior devs kept writing `ApiResponse<any>` — defeating type safety entirely. The team needed constraints, defaults, and inference rules to make the generic API both flexible AND safe. This file covers exactly those three layers.

---

## Concept 1: Generic Functions & Inference

### 🧠 Memory Hook

> "Generics = functions for types. You pass a type in, you get type guarantees out."

Like a shipping box with a label: same box, any contents — but the label tells you exactly what's inside, and the compiler checks it.

### Why Does This Exist? / Tại Sao Tồn Tại?

**Level 1 — DRY principle:** Without generics, you write `identityString`, `identityNumber`, `identityUser`… The logic is identical, only types differ. Generics eliminate that duplication.

**Level 2 — Preserve type connections:** `any` eliminates duplication too, but breaks the relationship between input and output. If you call `identity("hello")` the compiler should know you get back a `string`, not `any`. Generics thread that connection through.

**Level 3 — Inference sites:** TypeScript infers type parameters from specific positions in function signatures called _inference sites_. Understanding when inference works vs. when you must annotate explicitly is what separates mid from senior engineers.

### Visual / Sơ Đồ

```
Without generics:
  identityStr(x: string): string
  identityNum(x: number): number
  identityUser(x: User): User
  ^--- N functions for N types

With generics:
  identity<T>(x: T): T
               ^
               type parameter — filled at call site

Call site inference:
  identity("hello")   → T = string  (inferred from argument)
  identity(42)        → T = number  (inferred from argument)
  identity<User>(obj) → T = User    (explicit — inference blocked)
```

### Generic Function Patterns

```ts
// 1. Identity — simplest form
function identity<T>(value: T): T {
  return value;
}

// 2. Multiple type params — map-like
function transform<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

// Usage: inference works from both args
const lengths = transform(["a", "bb", "ccc"], (s) => s.length);
//    ^--- U = number, inferred from return of fn

// 3. Pipe — chained generics
function pipe<A, B, C>(value: A, first: (a: A) => B, second: (b: B) => C): C {
  return second(first(value));
}

const result = pipe(
  "  hello world  ",
  (s) => s.trim(), // A=string, B=string
  (s) => s.toUpperCase(), // B=string, C=string
);
// result: string — fully inferred, no annotations needed

// 4. Generic interface for API response
interface ApiResponse<T, E = ApiError, M = PaginationMeta> {
  data: T;
  error: E | null;
  meta: M;
}

interface ApiError {
  code: string;
  message: string;
}

interface PaginationMeta {
  page: number;
  total: number;
}

// Default type params kick in automatically
type UserListResponse = ApiResponse<User[]>;
//   UserListResponse = ApiResponse<User[], ApiError, PaginationMeta>

// Override specific defaults
type StreamResponse = ApiResponse<ReadableStream, NetworkError>;
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `function wrap<T>(x: any): T`                   | Breaks type connection — T floats free    | `function wrap<T>(x: T): T`                               |
| `function f<A, B, C, D, E>(...)`                | Too many params = impossible inference    | Refactor: use a config object type param                  |
| `ApiResponse<any>`                              | Defeats the whole point of the generic    | Add constraint `T extends object` and enforce at use site |
| Calling `identity<string>("hello")` always      | Over-annotating — inference already works | Only annotate when inference fails                        |
| `function first<T>(arr: T[]) { return arr[0] }` | Return type is `T                         | undefined`but typed as`T`                                 | Explicitly type return as `T | undefined` |

### 🎯 Interview Pattern

**Trigger words:** "reusable", "type-safe utility", "avoid duplication", "generalize"

**Core concept:** Generic functions parameterize types the same way functions parameterize values. TypeScript infers those type params from argument positions (inference sites).

**Opening sentence:** "The key insight is that generics create a _type-level connection_ between inputs and outputs — something `any` can never do."

### 🔑 Knowledge Chain

**Prerequisites:** Union types, function types, `typeof`, `keyof`

**Enables:** Constraints with `extends`, conditional types, `infer`, utility type implementation, type-safe APIs

---

## Concept 2: Constraints & Conditional Types

### 🧠 Memory Hook

> "A constraint is a job requirement for a type parameter. `T extends { id: string }` means: 'only hire types that have an `id` field.'"

Without constraints, an unconstrained `T` is as useless as `any` — you can't access `.length`, call `.trim()`, or do anything on it because the compiler has no proof those members exist.

### Why Does This Exist? / Tại Sao Tồn Tại?

**Level 1 — Access member safely:** You can't write `function getLength<T>(x: T) { return x.length }` because TypeScript can't prove `T` has `.length`. The constraint `T extends { length: number }` grants that access.

**Level 2 — Conditional types = type-level if/else:** Real APIs often need _different return types_ based on the shape of the input. `infer` lets you _extract_ a sub-type from within a type pattern — like regex groups but for types.

**Level 3 — Distributive behavior:** When a naked type parameter (not wrapped in a tuple/object) appears in a conditional type, TypeScript distributes over union members. This is the mechanism behind `Exclude`, `Extract`, and `NonNullable`.

### Visual / Sơ Đồ

```
Constraint syntax:
  function f<T extends Constraint>(x: T): T

  T         = the type param (flexible)
  extends   = "must satisfy"
  Constraint = the minimum required shape

  Result: T can be anything that IS-A Constraint

Conditional type:
  type Result<T> = T extends U ? X : Y
                   ^^^^^^^^^^^^^^^^
                   like a ternary, but at type level

infer — extraction from pattern:
  type UnwrapPromise<T> =
    T extends Promise<infer Inner>  ← "if T matches this pattern..."
      ? Inner                        ← "...give me the Inner type"
      : T                            ← "otherwise, T as-is"

Distributive behavior:
  type ToArray<T> = T extends any ? T[] : never

  ToArray<string | number>
  = (string extends any ? string[] : never)
  | (number extends any ? number[] : never)
  = string[] | number[]

  // Disable distribution by wrapping:
  type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
  ToArrayNonDist<string | number> = (string | number)[]
```

### Constraints & Conditional Type Patterns

```ts
// 1. Basic constraint — access .id safely
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}

// T must have .id — but can have more fields
const user = getById([{ id: "u1", name: "Alice" }], "u1");
//    user: { id: string; name: string } | undefined  ← T preserved, not narrowed to constraint

// 2. Unwrap Promise with infer
type Awaited_<T> =
  T extends Promise<infer U>
    ? Awaited_<U> // recursive for Promise<Promise<T>>
    : T;

type A = Awaited_<Promise<string>>; // string
type B = Awaited_<Promise<Promise<number>>>; // number
type C = Awaited_<string>; // string (not a promise, returns T)

// 3. Extract function return type
type ReturnType_<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = ReturnType_<() => string>; // string
type R2 = ReturnType_<(x: number) => boolean>; // boolean
type R3 = ReturnType_<string>; // never (not a function)

// 4. Flatten array — one level
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type F1 = Flatten<string[]>; // string
type F2 = Flatten<number[][]>; // number[]  (only one level)
type F3 = Flatten<string>; // string (not an array)

// 5. Distributive Exclude (how the built-in works)
type Exclude_<T, U> = T extends U ? never : T;

type E1 = Exclude_<"a" | "b" | "c", "a">;
// = ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ...
// = never | "b" | "c"
// = "b" | "c"

// 6. Path keys for nested object access
type PathKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? PathKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
    : `${Prefix}${K}`;
}[keyof T & string];

interface Config {
  db: { host: string; port: number };
  app: { name: string };
}

type ConfigPaths = PathKeys<Config>;
// "db" | "db.host" | "db.port" | "app" | "app.name"
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `T extends string` when `T extends string \| number` works | Over-constraining loses generality                                                              | Use the _widest_ constraint that still grants the members you need                            |
| Forgetting distributive behavior                           | `ToArray<string \| number>` gives `(string \| number)[]` when you wanted `string[] \| number[]` | Use naked type param for distribution; wrap in `[T]` to prevent it                            |
| `infer` in non-`extends` position                          | Syntax error — `infer` only works inside conditional type patterns                              | Move extraction logic into conditional type                                                   |
| Chaining `infer` without base case                         | Recursive type causes compile error or slow compilation                                         | Always add a base case that does not recurse                                                  |
| `T extends object` blocks primitives unexpectedly          | `"hello" extends object` is false — strings won't match                                         | Use `T extends Record<string, unknown>` or `T extends NonNullable<unknown>` for broader match |

### 🎯 Interview Pattern

**Trigger words:** "type-safe extraction", "conditional return type", "infer keyword", "distributive"

**Core concept:** `extends` in conditional types is pattern matching. `infer` names the captured sub-type. Naked type params distribute over unions automatically.

**Opening sentence:** "The `infer` keyword is TypeScript's pattern matching for types — you describe the shape you expect, and `infer` names the part you want to extract."

### 🔑 Knowledge Chain

**Prerequisites:** Generic functions, `extends` keyword, union types

**Enables:** Recursive types, mapped types with key filtering, utility type implementation (`ReturnType`, `Parameters`, `Awaited`)

---

## Concept 3: Advanced Patterns — Mapped + Template Literal + Recursive

### 🧠 Memory Hook

> "Mapped types = a `for` loop over the keys of a type. Template literal types = string interpolation at type level. Recursive types = the type calls itself."

Together they make TypeScript Turing-complete at the type level — useful, but dangerous if you forget depth limits (~1000 recursion levels).

### Why Does This Exist? / Tại Sao Tồn Tại?

**Level 1 — Utility types need these:** `Partial<T>`, `Required<T>`, `Readonly<T>` are all mapped types. You can't implement them without this feature.

**Level 2 — Template literals model string APIs:** A form library needs `"onChange_firstName" | "onChange_lastName"` derived from a `User` type's keys. Template literal types generate this automatically.

**Level 3 — Recursive types model recursive data:** JSON, file trees, React component trees — all recursive. Without recursive types, you'd hardcode a finite depth that always runs out.

### Visual / Sơ Đồ

```
Mapped type anatomy:
  type Mapped<T> = {
    [K in keyof T]       ← iterate over keys of T
      as NewK            ← optional key remapping
      ?: T[K]            ← optional modifier (? = optional, + or -)
  }

Template literal:
  type EventName<T extends string> = `on${Capitalize<T>}`;
  EventName<"click">  = "onClick"
  EventName<"submit"> = "onSubmit"

  Combined with mapped:
  type Handlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void
  }

Recursive type — depth matters:
  DeepPartial<{a: {b: {c: string}}}>
  → { a?: { b?: { c?: string } } }
  Each level calls DeepPartial again until it hits a primitive
```

### Advanced Pattern Code

```ts
// 1. DeepPartial — recursive mapped type
type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

interface AppState {
  user: { name: string; age: number };
  settings: { theme: string; notifications: boolean };
}

type PartialState = DeepPartial<AppState>;
// {
//   user?: { name?: string; age?: number };
//   settings?: { theme?: string; notifications?: boolean };
// }

// 2. Event handlers from interface — template literal + mapped
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (newValue: T[K], oldValue: T[K]) => void;
};

interface FormFields {
  name: string;
  email: string;
  age: number;
}

type FormHandlers = EventHandlers<FormFields>;
// {
//   onNameChange: (newValue: string, oldValue: string) => void;
//   onEmailChange: (newValue: string, oldValue: string) => void;
//   onAgeChange: (newValue: number, oldValue: number) => void;
// }

// 3. Paths for nested access — recursive template literal
type Paths<T, K extends keyof T = keyof T> = K extends string | number
  ? T[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${Paths<T[K]>}`
    : `${K}`
  : never;

interface User {
  id: string;
  address: {
    city: string;
    zip: string;
  };
}

type UserPaths = Paths<User>;
// "id" | "address" | "address.city" | "address.zip"

// Usage: type-safe deep get
function getPath<T, P extends Paths<T>>(obj: T, path: P): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

// 4. Builder pattern with chained generics
type QueryBuilder<
  TTable,
  TSelected extends keyof TTable = keyof TTable,
  TWhere extends Partial<TTable> = object,
> = {
  select<K extends keyof TTable>(...keys: K[]): QueryBuilder<TTable, K, TWhere>;
  where(condition: Partial<TTable>): QueryBuilder<TTable, TSelected, Partial<TTable>>;
  build(): Pick<TTable, TSelected>[];
};

// Factory function returns the builder
function createQuery<T>(_table: string): QueryBuilder<T> {
  const selected: (keyof T)[] = [];
  const conditions: Partial<T> = {};

  const builder: QueryBuilder<T> = {
    select(...keys) {
      selected.push(...keys);
      return builder as QueryBuilder<T, (typeof keys)[number]>;
    },
    where(condition) {
      Object.assign(conditions, condition);
      return builder;
    },
    build() {
      // runtime: fetch + filter + project
      return [] as Pick<T, keyof T>[];
    },
  };
  return builder;
}

// 5. Readonly-preserving + optional-stripping mapped type
// Remove optionality while keeping readonly
type Required_<T> = {
  [K in keyof T]-?: T[K]; // -? strips the optional modifier
};

// Add optional while keeping readonly
type Partial_<T> = {
  [K in keyof T]?: T[K]; // ? adds optional modifier
};

// Make everything readonly (no mutation)
type Immutable<T> = {
  readonly [K in keyof T]: T[K] extends object ? Immutable<T[K]> : T[K];
};
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Recursive type without base case                   | TypeScript reports "Type alias circularly references itself"                    | Always add `T extends primitive ? T : { ... }` base case                                              |
| Forgetting `+?`/`-?` modifiers in mapped types     | Mapped type silently preserves or drops optional/readonly — surprising behavior | Always think: should this transformation preserve, add, or remove modifiers?                          |
| Template literal over `keyof T` without `& string` | `keyof T` includes `number` and `symbol` — template literals need string keys   | Use `K extends string & keyof T` or `string & K`                                                      |
| Deep recursion on large types                      | TypeScript hits depth limit (~1000) and gives unhelpful error                   | Add a `Depth` counter type param, or use `interface` self-reference (interfaces are lazily evaluated) |
| Mapped type on union                               | `{[K in "a" \| "b"]: ...}` maps over union members, not object keys             | If you want to map object keys use `keyof T`, not a union literal                                     |

### 🎯 Interview Pattern

**Trigger words:** "transform all properties", "derive event handlers", "type-level computation", "deep readonly"

**Core concept:** Mapped types iterate over a type's keys. Template literals compose string types. Recursion enables depth-unlimited transformations — with compile-time depth limits.

**Opening sentence:** "Mapped types are the type-level equivalent of `Array.map` — they transform every property in a type according to a rule, and you can compose them with template literals and recursion for sophisticated transformations."

### 🔑 Knowledge Chain

**Prerequisites:** Conditional types, `infer`, `keyof`, index access types (`T[K]`), template literal types

**Enables:** Custom utility types, type-safe form libraries, type-safe ORM query builders, deep-frozen state types

---

## Q&A Section / Phần Hỏi Đáp

---

### Q1: What problem do generics solve vs `any`? / Generics giải quyết vấn đề gì mà `any` không làm được? 🟢 Junior

**A:**

`any` tells TypeScript "stop checking this." Generics tell TypeScript "be flexible, but _remember_ what type this is and enforce it throughout."

**English answer:**

The core problem is the DRY-vs-safety tension. Without generics, you either:

1. Duplicate code for each type (safe but verbose), or
2. Use `any` (DRY but completely type-unsafe)

Generics give you both: one implementation, full type safety. The type parameter `T` acts as a _placeholder_ that gets filled in at the call site, and TypeScript tracks that substitution through the entire function signature.

```ts
// any version — compiles but loses type information
function firstAny(arr: any[]): any {
  return arr[0];
}
const x = firstAny([1, 2, 3]); // x: any — useless, no autocomplete, no checks

// generic version — safe AND reusable
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const y = first([1, 2, 3]); // y: number | undefined — fully typed!
const z = first(["a", "b"]); // z: string | undefined — correctly inferred
```

**Giải thích bằng tiếng Việt:**

`any` là "lối thoát" khỏi hệ thống kiểu — TypeScript sẽ không kiểm tra gì nữa. Đây là lý do `ApiResponse<any>` tệ hơn không có generic: nó tạo cảm giác an toàn nhưng thực ra không kiểm tra gì.

Generics giống như biến trong hàm, nhưng cho kiểu: `T` là "placeholder" được TypeScript điền vào dựa trên cách bạn gọi hàm. TypeScript nhớ giá trị đó và bắt buộc nó nhất quán xuyên suốt signature.

Ba lợi ích thực tế:

1. **Type connections:** `first<T>(arr: T[]): T` nói rằng "nếu bạn cho vào `string[]`, bạn nhận ra `string`" — compiler kiểm tra điều này
2. **Inference:** TypeScript tự suy ra `T` từ argument, bạn không cần annotate
3. **Refactor safety:** Đổi kiểu ở một chỗ, compiler báo lỗi tất cả chỗ không nhất quán

**💡 Interview Signal:**

✅ Strong answer: Giải thích _connection_ giữa input và output type, đề cập đến inference, cho ví dụ cụ thể với `any` vs generic

❌ Weak answer: "Generics cho phép tái sử dụng code" — đúng nhưng không đủ, không giải thích tại sao không dùng `any`

---

### Q2: Explain the `infer` keyword with a practical example / Giải thích từ khóa `infer` với ví dụ thực tế 🟡 Mid

**A:**

`infer` is TypeScript's type-level pattern matching. It lets you _extract_ a sub-type from within a type structure, naming it for use in the true-branch of a conditional type.

**English answer:**

Think of `infer` as regex capture groups for types. With regex you write `/(hello) world/` and `$1` captures "hello". With `infer` you write `T extends Promise<infer U>` and `U` captures whatever `T` wraps.

`infer` can only appear on the right side of `extends` in a conditional type. It creates a _new type variable_ that's only in scope in the true branch.

```ts
// 1. Implement ReturnType from scratch
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = MyReturnType<() => string>; // string
type R2 = MyReturnType<(x: number) => boolean>; // boolean
type R3 = MyReturnType<typeof JSON.parse>; // any (JSON.parse returns any)
type R4 = MyReturnType<string>; // never (not a function)

// 2. Implement Parameters from scratch
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

type P1 = MyParameters<(x: string, y: number) => void>; // [x: string, y: number]
type P2 = MyParameters<() => void>; // []

// 3. Nested infer — unwrap Promise deeply
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

type D1 = DeepAwaited<Promise<Promise<string>>>; // string
type D2 = DeepAwaited<Promise<number>>; // number
type D3 = DeepAwaited<boolean>; // boolean

// 4. Infer from tuple position
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : never;

type H = Head<[string, number, boolean]>; // string
type T = Tail<[string, number, boolean]>; // [number, boolean]

// 5. Real-world: extract event payload type from handler
type EventPayload<T> = T extends (event: infer E) => void ? E : never;

type ClickPayload = EventPayload<(event: MouseEvent) => void>; // MouseEvent
type CustomPayload = EventPayload<(event: CustomEvent<{ userId: string }>) => void>;
// CustomEvent<{userId: string}>
```

**Giải thích bằng tiếng Việt:**

`infer` là "bắt nhóm" ở cấp độ kiểu — giống regex capture group nhưng cho TypeScript.

Cú pháp: `T extends SomePattern<infer X> ? UseX : Fallback`

- TypeScript thử khớp `T` với pattern `SomePattern<infer X>`
- Nếu khớp, `X` là phần bị bắt — có thể dùng trong nhánh true
- Nếu không khớp, trả về nhánh false

Ứng dụng thực tế trong dự án:

- Lấy kiểu response của một async function để tự động type state trong Redux
- Extract payload từ event handler để tránh import kiểu thừa
- Unwrap nested generics trong thư viện (React Query, Axios) để lấy kiểu data thực sự

**💡 Interview Signal:**

✅ Strong answer: Dùng ví dụ cụ thể, giải thích "chỉ dùng trong nhánh true", biết dùng multiple `infer` trong một pattern, mention edge cases (fails to infer → `never`)

❌ Weak answer: "infer dùng để lấy kiểu bên trong" — quá vague, không cho thấy hiểu cú pháp hay use case thực tế

---

### Q3: What are distributive conditional types and when do they matter? / Conditional types phân phối là gì và khi nào quan trọng? 🟡 Mid

**A:**

When a _naked_ type parameter appears in a conditional type, TypeScript automatically distributes the condition over each union member. This is the mechanism that makes `Exclude`, `Extract`, and `NonNullable` work.

**English answer:**

"Naked" means the type parameter appears directly — not wrapped in a tuple, array, or object. Distributive behavior: if `T = A | B | C`, then `T extends X ? Y : Z` becomes `(A extends X ? Y : Z) | (B extends X ? Y : Z) | (C extends X ? Y : Z)`.

```ts
// Distributive — T is naked
type IsString<T> = T extends string ? "yes" : "no";

type R1 = IsString<string>; // "yes"
type R2 = IsString<number>; // "no"
type R3 = IsString<string | number>; // "yes" | "no"  ← distributed!

// HOW Exclude works (built-in implementation):
type Exclude_<T, U> = T extends U ? never : T;

type E = Exclude_<"a" | "b" | "c", "a" | "b">;
// Step 1: distribute over "a" | "b" | "c"
// = ("a" extends "a"|"b" ? never : "a")
// | ("b" extends "a"|"b" ? never : "b")
// | ("c" extends "a"|"b" ? never : "c")
// = never | never | "c"
// = "c"

// HOW Extract works:
type Extract_<T, U> = T extends U ? T : never;
type Ex = Extract_<"a" | "b" | "c" | 1 | 2, string>;
// = "a" | "b" | "c"  (numbers distribute to never, strings distribute to themselves)

// DISABLE distribution by wrapping in tuple
type IsStringNonDist<T> = [T] extends [string] ? "yes" : "no";

type R4 = IsStringNonDist<string | number>; // "no" — treated as a single union, not distributed
// [string | number] extends [string] → false → "no"

// Practical use: filter properties by value type
type FilterByValueType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface Mixed {
  id: string;
  count: number;
  name: string;
  active: boolean;
}

type StringProps = FilterByValueType<Mixed, string>;
// { id: string; name: string }

type NumericProps = FilterByValueType<Mixed, number | boolean>;
// { count: number; active: boolean }
```

**Giải thích bằng tiếng Việt:**

"Distributive" nghĩa là TypeScript _chia nhỏ_ union type và áp dụng conditional type cho _từng thành viên_, rồi _gộp_ kết quả lại.

Chìa khóa: chỉ xảy ra khi type param là _naked_ (đứng một mình, không bọc trong `[]`, `{}`, hoặc generic khác).

Tại sao điều này quan trọng trong phỏng vấn:

- Đây là cách mà các built-in utility types (`Exclude`, `Extract`, `NonNullable`) hoạt động
- Nếu bạn implement một custom utility type và quên tính chất distributive, kết quả sẽ sai với union inputs
- Khi bạn _không_ muốn distribute (ví dụ: check xem toàn bộ union có extends một type không), dùng tuple trick `[T] extends [U]`

**💡 Interview Signal:**

✅ Strong answer: Giải thích "naked vs wrapped", biết implement `Exclude`/`Extract` từ scratch, biết dùng tuple để disable distribution khi cần

❌ Weak answer: "Conditional types hoạt động với union" — không giải thích được cơ chế hay khi nào disable

---

### Q4: Implement a type-safe event emitter using generics / Implement event emitter type-safe bằng generics 🔴 Senior

**A:**

A type-safe event emitter uses a generic event map interface to constrain both `on()` and `emit()` — the key `K` in `on(event: K, handler: (payload: EventMap[K]) => void)` links the event name to its payload type automatically.

**English answer:**

The design challenge: when you call `emitter.on("userLogin", handler)`, the compiler should know `handler` receives a `UserLoginEvent`, not `any`. This requires linking the string key `"userLogin"` to its payload type — done via a generic constraint `K extends keyof EventMap`.

```ts
// Step 1: Define the event map interface
interface AppEvents {
  userLogin: { userId: string; timestamp: number };
  userLogout: { userId: string };
  pageView: { path: string; referrer: string | null };
  error: { message: string; code: number };
}

// Step 2: Generic EventEmitter class
class TypedEventEmitter<EventMap extends Record<string, unknown>> {
  private handlers: {
    [K in keyof EventMap]?: Array<(payload: EventMap[K]) => void>;
  } = {};

  on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): () => void {
    // returns unsubscribe function
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler);

    // Return cleanup function
    return () => this.off(event, handler);
  }

  off<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
    const list = this.handlers[event];
    if (list) {
      this.handlers[event] = list.filter((h) => h !== handler) as typeof list;
    }
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    this.handlers[event]?.forEach((handler) => handler(payload));
  }

  once<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
    const wrapper = (payload: EventMap[K]) => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Step 3: Usage — fully type-safe, no any
const emitter = new TypedEventEmitter<AppEvents>();

// ✅ TypeScript knows the payload type from the event name
emitter.on("userLogin", ({ userId, timestamp }) => {
  // userId: string, timestamp: number — fully typed
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// ✅ emit enforces correct payload shape
emitter.emit("userLogin", { userId: "u123", timestamp: Date.now() });

// ❌ This would be a compile error:
// emitter.emit("userLogin", { userId: 123 }); // number is not string
// emitter.on("unknown", () => {});             // "unknown" is not keyof AppEvents

// Step 4: Typed wildcard listener (advanced)
type AnyEventPayload<EventMap> = EventMap[keyof EventMap];

class ExtendedEmitter<
  EventMap extends Record<string, unknown>,
> extends TypedEventEmitter<EventMap> {
  onAny(handler: (event: keyof EventMap, payload: AnyEventPayload<EventMap>) => void): void {
    (Object.keys(this) as Array<keyof EventMap>).forEach((event) => {
      this.on(event, (payload) => handler(event, payload as AnyEventPayload<EventMap>));
    });
  }
}
```

**Giải thích bằng tiếng Việt:**

Đây là bài toán "link string key đến type" — pattern xuất hiện nhiều trong thực tế (event systems, Redux action creators, API route handlers).

Thiết kế cốt lõi:

- `EventMap` = một interface/record mapping event name → payload type
- `K extends keyof EventMap` trong mỗi method = TypeScript biết cả hai: tên event hợp lệ VÀ kiểu payload tương ứng
- Compiler kiểm tra cả `on()` lẫn `emit()` đều dùng cùng payload type cho cùng event name

Tại sao cần `handlers: { [K in keyof EventMap]?: Array<...> }` thay vì `Record<string, Function[]>`:

- Mapped type trên `EventMap` đảm bảo mỗi key trong internal storage có đúng kiểu handler
- Ngăn việc accidentally mix handlers giữa các events

Kỹ thuật quan trọng: return unsubscribe function từ `on()` — pattern này (thay vì `removeEventListener`-style) làm code cleaner và tự nhiên hơn với React `useEffect`.

**💡 Interview Signal:**

✅ Strong answer: Giải thích tại sao `K extends keyof EventMap` là chìa khóa, biết implement `once()`, discuss tradeoff giữa class-based vs functional event emitter, mention memory leak risk nếu không unsubscribe

❌ Weak answer: Viết được code nhưng không giải thích được design decision — tại sao generic trên class thay vì trên method, tại sao mapped type cho handlers

---

### Q5: Design a type-safe ORM query builder / Thiết kế ORM query builder type-safe 🔴 Senior

**A:**

A type-safe query builder chains generic methods where each call _narrows_ or _extends_ the type parameters. The key insight is that `select()` changes the output type, `where()` constrains the filter type, and `build()` returns a result typed to exactly what was selected.

**English answer:**

This is the hardest generic pattern: types that _evolve_ as methods are chained. Each method call on the builder returns a _new_ builder type with updated type parameters. TypeScript must track the accumulated state through each `.select()`, `.where()`, and `.orderBy()` call.

```ts
// Domain types
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date | null;
}

// The query builder — type params track accumulated query state
// TTable = full row type
// TSelected = which fields are selected (subset of TTable keys)
class QueryBuilder<TTable, TSelected extends keyof TTable = keyof TTable> {
  private _table: string;
  private _selected: (keyof TTable)[];
  private _where: Partial<TTable>;
  private _limit: number | null;
  private _orderBy: { key: keyof TTable; dir: "asc" | "desc" } | null;

  constructor(table: string) {
    this._table = table;
    this._selected = [];
    this._where = {};
    this._limit = null;
    this._orderBy = null;
  }

  // select() narrows TSelected to exactly the chosen keys
  select<K extends keyof TTable>(...keys: K[]): QueryBuilder<TTable, K> {
    const next = new QueryBuilder<TTable, K>(this._table);
    next._selected = keys;
    next._where = this._where;
    next._limit = this._limit;
    next._orderBy = this._orderBy;
    return next;
  }

  // where() constrains to valid TTable keys with correct value types
  where(conditions: {
    [K in keyof TTable]?: TTable[K] | { $gt?: TTable[K]; $lt?: TTable[K]; $in?: TTable[K][] };
  }): QueryBuilder<TTable, TSelected> {
    const next = new QueryBuilder<TTable, TSelected>(this._table);
    next._selected = this._selected;
    next._where = { ...this._where, ...conditions } as Partial<TTable>;
    next._limit = this._limit;
    next._orderBy = this._orderBy;
    return next;
  }

  orderBy(key: TSelected, direction: "asc" | "desc" = "asc"): QueryBuilder<TTable, TSelected> {
    const next = new QueryBuilder<TTable, TSelected>(this._table);
    next._selected = this._selected;
    next._where = this._where;
    next._limit = this._limit;
    next._orderBy = { key, dir: direction };
    return next;
  }

  limit(n: number): QueryBuilder<TTable, TSelected> {
    const next = new QueryBuilder<TTable, TSelected>(this._table);
    next._selected = this._selected;
    next._where = this._where;
    next._limit = n;
    next._orderBy = this._orderBy;
    return next;
  }

  // build() returns exactly the selected fields — not the full row
  async build(): Promise<Pick<TTable, TSelected>[]> {
    // In real implementation: construct SQL and execute
    const sql = this.toSQL();
    console.log("Executing:", sql);
    // Simulated result — in real code: await db.query(sql)
    return [] as Pick<TTable, TSelected>[];
  }

  toSQL(): string {
    const cols = this._selected.length > 0 ? this._selected.join(", ") : "*";
    let sql = `SELECT ${cols} FROM ${this._table}`;

    const whereClauses = Object.entries(this._where)
      .map(([k, v]) => `${k} = '${v}'`)
      .join(" AND ");
    if (whereClauses) sql += ` WHERE ${whereClauses}`;

    if (this._orderBy) {
      sql += ` ORDER BY ${String(this._orderBy.key)} ${this._orderBy.dir.toUpperCase()}`;
    }
    if (this._limit !== null) sql += ` LIMIT ${this._limit}`;

    return sql;
  }
}

// Factory with table type inference
function from<T>(table: string): QueryBuilder<T> {
  return new QueryBuilder<T>(table);
}

// Usage — types flow through the chain
async function example() {
  // All fields — TSelected = keyof User
  const allUsers = await from<User>("users").build();
  // allUsers: User[]

  // Only name + email — TSelected = "name" | "email"
  const nameEmail = await from<User>("users")
    .select("name", "email")
    .where({ age: { $gt: 18 } })
    .orderBy("name")
    .limit(10)
    .build();
  // nameEmail: Pick<User, "name" | "email">[]
  // nameEmail[0].name   ← ✅ allowed
  // nameEmail[0].id     ← ❌ compile error — id not selected

  // ❌ These are compile errors:
  // .where({ unknownField: "value" })  ← not in User
  // .orderBy("id")  ← "id" is not in TSelected after .select("name", "email")
}
```

**Giải thích bằng tiếng Việt:**

Đây là pattern "accumulating type state" — mỗi method call trả về builder với type params _được cập nhật_. TypeScript track trạng thái query xuyên suốt chain.

Điểm kỹ thuật quan trọng:

1. **`select()` thay đổi `TSelected`:** Return type là `QueryBuilder<TTable, K>` thay vì `QueryBuilder<TTable, TSelected>` — TypeScript giờ biết chính xác bạn chọn field nào

2. **`build()` dùng `Pick<TTable, TSelected>`:** Nếu bạn chỉ select `name` và `email`, kết quả chỉ có hai field đó — không cần cast, không cần `any`

3. **`orderBy(key: TSelected)`:** Chỉ cho phép sort theo field đã được select — tránh runtime error khi project out một field rồi sort theo nó

Trade-offs cần discuss trong phỏng vấn:

- Mỗi method tạo một builder instance mới → immutable chaining, safe nhưng tốn memory hơn mutable approach
- Type complexity tăng với mỗi feature thêm vào (joins, subqueries) — có thể cần simplify
- Compile time tăng khi chain dài với nhiều type params

**💡 Interview Signal:**

✅ Strong answer: Giải thích tại sao `select()` phải return type mới (không phải `this`), discuss immutable vs mutable builder, mention compiler performance implications, biết khi nào pattern này là _overkill_

❌ Weak answer: Viết builder nhưng dùng `any` hoặc cast ở mọi chỗ — defeats the purpose

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                | Difficulty | Core Concept      | Key Signal                                    |
|---------|------------|---------|
| 1   | Generics giải quyết vấn đề gì mà `any` không làm được? | 🟢 Junior  | Type safety       | Type flows through, không bị xóa như `any`    |
| 2   | Giải thích từ khóa `infer` với ví dụ thực tế           | 🟡 Mid     | Conditional types | Extract type từ trong complex type            |
| 3   | Distributive conditional types là gì?                  | 🟡 Mid     | Type distribution | Giải thích union distribution behavior        |
| 4   | Implement type-safe event emitter bằng generics        | 🔴 Senior  | Generic design    | Event map + `keyof` + callback type inference |
| 5   | Thiết kế type-safe ORM query builder                   | 🔴 Senior  | Type architecture | Fluent API với compile-time guarantees        |

---

## ⚡ Cold Call Simulation (30 seconds)

**Question:** "Explain how TypeScript generic constraints work and when inference fails."

**Answer:**

"Generic constraints use `extends` to define a minimum required shape for a type parameter — for example, `T extends { id: string }` means TypeScript will accept any type that has at least an `id` string field, while still preserving T's full type. Inference works by TypeScript analyzing _argument positions_ in the function call — it matches the call-site argument's type to the parameter type and solves for T. Inference fails when the type parameter only appears in the return position with no argument to match against, when TypeScript encounters ambiguous multiple constraints, or when you use conditional types that depend on as-yet-unresolved type variables. In those cases, you must provide an explicit type argument like `fn<string>(arg)` rather than letting TypeScript guess."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                               |
|---------|------------|---------|
| 1   | 🔍 Retrieval   | Sự khác biệt giữa `T extends string` và `[T] extends [string]` trong conditional types là gì? "Naked type parameter" nghĩa là gì và tại sao quan trọng?               |
| 2   | 🎨 Visual      | Vẽ từng bước đánh giá của `Exclude<"a" \| "b" \| "c", "a">` — distributive evaluation diễn ra như thế nào step by step?                                               |
| 3   | 🛠️ Application | Viết `DeepReadonly<T>` dùng mapped types và recursion. Viết `UnionToIntersection<U>` biến `A \| B \| C` thành `A & B & C`.                                            |
| 4   | 🐛 Debug       | `type ToArray<T> = T extends any ? T[] : never` cho `string \| number[]` vs `type ToArray<T> = [T] extends [any] ? T[] : never` — kết quả khác nhau thế nào? Tại sao? |
| 5   | 🎓 Teach       | Giải thích `infer` cho junior developer trong 2 câu dùng analogy, không dùng code hay thuật ngữ TypeScript.                                                           |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                |
|---------|------------|---------|
| 1   | `T extends string` distributes qua union (mỗi member được check riêng). `[T] extends [string]` wrap trong tuple → không distribute, check toàn bộ union.                 |
| 2   | `Exclude<"a"\|"b"\|"c", "a">` → step 1: `"a" extends "a" ? never : "a"` = `never`; step 2: `"b" extends "a" ? never : "b"` = `"b"`; step 3: `"c"` = `"c"` → `"b" \| "c"` |
| 3   | `DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T`. `UnionToIntersection` dùng contravariant position trong conditional type.    |
| 4   | Naked `T` → distributive → `string[] \| number[][]`. Wrapped `[T]` → non-distributive → `(string \| number[])[]`. Distributive behavior là key.                          |
| 5   | `infer` như "điền vào chỗ trống". Bạn hỏi TypeScript: "Nếu type này có dạng X, thì phần tôi đánh dấu là gì?" TypeScript điền câu trả lời vào tên biến.                   |

> 🎯 **Feynman Prompt:** Giải thích generic constraints (`T extends SomeType`) cho người mới biết TypeScript — "Tại sao không để T là bất cứ gì?" Dùng ví dụ hàm `getLength(x)` nhận string, array, hay object có `.length`.

---

## 🔁 Spaced Repetition Reminder

- **Day 1:** Read this file fully. Run the code examples mentally.
- **Day 3:** Do the Retrieval self-check without looking. Grade yourself.
- **Day 7:** Implement `EventEmitter<EventMap>` and `QueryBuilder<T, TSelected>` from scratch, no reference.
- **Day 14:** Explain distributive conditional types + `infer` to someone else. Teach-back is the deepest encoding.
- **Day 30:** Attempt Q4 and Q5 on a blank editor in 20 minutes each. Time pressure reveals what's truly internalized.

---

[← Previous: Advanced Types](./02-advanced-types.md) | [Next: TypeScript Comprehensive](./04-typescript-comprehensive.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Advanced Types](./02-advanced-types.md) — conditional types are built on generic constraints
- [TypeScript Basics](./01-typescript-basics.md) — type system foundation needed before generics
- [React TypeScript](./05-react-typescript.md) — generic React components and typed custom hooks
- [TypeScript Comprehensive](./04-typescript-comprehensive.md) — all generic patterns in one reference

### Khác track (Cross-track)
- [JS ES6 Features](../01-javascript/07-es6-features.md) — ES6 class syntax and iterators underlie generic patterns
- [React Hooks Deep Dive](../03-react/03-hooks-deep-dive.md) — custom hooks use generics for type-safe APIs
- [CS Fundamentals: Computation Theory](../../shared/01-cs-fundamentals/08-computation-theory.md) — parametric polymorphism theory behind generics
