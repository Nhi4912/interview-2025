# Advanced TypeScript Types / Kiểu TypeScript Nâng Cao

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [TypeScript Basics](./01-typescript-basics.md)
> **See also**: [Generics Deep Dive](./03-generics-deep-dive.md)

[← Previous: TypeScript Basics](./01-typescript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Generics Deep Dive →](./03-generics-deep-dive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

VNG's ZaloPay frontend team maintained 15 form types — each needing "create", "update", and "readonly" variants. Without advanced types, they had 45 separate interfaces (15 × 3), and whenever the base `PaymentForm` changed, an engineer had to update 3 files by hand. Bugs crept in when one variant drifted out of sync.

After a refactor sprint, the team reduced to 15 base types plus 3 generic transformers:

```typescript
type CreateForm<T> = Omit<T, "id" | "createdAt">;
type UpdateForm<T> = Partial<CreateForm<T>> & Pick<T, "id">;
type ReadonlyForm<T> = Readonly<T>;
```

A senior engineer then added conditional types to auto-generate API response types from endpoint definitions — one source of truth for 60+ endpoints, zero drift between request/response shapes.

**Key insight / Điểm mấu chốt:** Advanced types are not academic exercises. They are the difference between a type system that _describes_ your code and one that _enforces_ correctness at every layer.

---

## 🔑 Knowledge Chain / Chuỗi Kiến Thức

```
Prerequisite                  This File                      Enables
─────────────────             ────────────────────           ──────────────────────
TypeScript Basics        ──►  Utility Types                ──►  Generics Deep Dive
  (interfaces,               Mapped Types                       (generic constraints)
   union types,              Conditional Types + infer
   type aliases)             Discriminated Unions           ──►  React Patterns
                             Template Literal Types              (typed props, hooks)
                             Type Guards
                                                            ──►  API Layer Typing
                                                                 (request/response schemas)
```

---

## Table of Contents / Mục Lục

1. [Concept 1: Utility Types & Mapped Types](#concept-1-utility-types--mapped-types)
2. [Concept 2: Conditional Types & `infer`](#concept-2-conditional-types--infer)
3. [Concept 3: Discriminated Unions & Template Literal Types](#concept-3-discriminated-unions--template-literal-types)
4. [Type Guards](#type-guards--bảo-vệ-kiểu)
5. [Interview Q&A](#interview-qa--câu-hỏi-phỏng-vấn)
6. [Cold Call Simulation](#cold-call-simulation)
7. [Retrieval Self-Check](#retrieval-self-check)

---

## Concept 1: Utility Types & Mapped Types

### 🧠 Memory Hook

> **"PROPERS — the 7 utility types you need every day"**
> **P**artial · **R**equired · **O**mit · **P**ick · **E**xclude/Extract · **R**ecord · **R**eadonly

And the formula behind them all: `{ [K in keyof T]?: T[K] }` — iterate, transform, done.

---

### Why Does This Exist? / Tại Sao Nó Tồn Tại?

**Level 1 — The immediate pain:**
You have a `User` interface. You need a version for create (no `id`), a version for update (all optional), a version for display (no `password`). Without utility types you copy-paste the interface three times. When `User` gains a `phoneNumber` field, you update one place and forget the other two. Production bug.

**Level 2 — The deeper principle:**
Duplicating types is the same mistake as duplicating code — it violates DRY at the _schema_ level. Utility types are the type system's answer to functions: instead of writing logic twice, you write a _transformation_ once and apply it everywhere.

**Tiếng Việt:**
Utility types giải quyết vấn đề "type drift" — khi các phiên bản copy của một interface bắt đầu diverge. Chúng là DRY cho type system: thay vì viết lại interface, bạn _biến đổi_ nó.

---

### Visual: Utility Type Cheatsheet / Bảng Tra Cứu

```
INPUT TYPE: { id: number; name: string; email: string; password?: string }
              ─────────────────────────────────────────────────────────────

Utility Type         | What it does                    | Result
─────────────────────┼─────────────────────────────────┼──────────────────────────────
Partial<T>           | All props → optional            | { id?: number; name?: string … }
Required<T>          | All props → required            | { id: number; name: string … }
Readonly<T>          | All props → readonly            | { readonly id: number … }
Pick<T, 'id'|'name'> | Keep only listed props          | { id: number; name: string }
Omit<T, 'password'>  | Remove listed props             | { id: number; name: string … }
Record<K, V>         | Build object from key union     | { admin: V; user: V; guest: V }
Exclude<A|B|C, B>    | Remove from union               | A | C
Extract<A|B|C, A|B>  | Keep intersection of union      | A | B
NonNullable<T|null>  | Remove null/undefined           | T
ReturnType<F>        | Get function return type        | (whatever F returns)
Parameters<F>        | Get function param tuple        | [param1Type, param2Type, …]

MAPPED TYPE ANATOMY:
  { [K in keyof T]?: T[K] }
    │    │              │
    │    │              └── value type: same as original (or transformed)
    │    └─── source: iterate over every key of T
    └──── modifier: ? = optional | readonly = immutable | - removes them
```

---

### What & Why / Cái Gì & Tại Sao (Feynman Layer)

Imagine a photo editing app. You have one original photo (your base type `T`). Filters don't create new photos from scratch — they _transform_ the original:

- Grayscale filter = `Readonly<T>` — same image, no modifications allowed
- Crop filter = `Pick<T, Keys>` — same image, only show selected area
- Blur-out filter = `Omit<T, Keys>` — same image, sensitive parts hidden
- Fade-to-transparent = `Partial<T>` — same image, nothing required to be solid

Mapped types are the engine under every utility type. `Partial<T>` is literally:

```typescript
type Partial<T> = {
  [K in keyof T]?: T[K]; // "for each key K in T, make it optional"
};
```

**Tiếng Việt:** Hãy nghĩ về utility types như bộ lọc ảnh — cùng một ảnh gốc (base type), áp dụng các filter khác nhau để có kết quả khác nhau. Mapped types là engine phía sau: `[K in keyof T]` nghĩa là "với mỗi key K trong T, thực hiện phép biến đổi".

---

### Core Implementation / Triển Khai Cốt Lõi

```typescript
// ── Partial: make every property optional ──────────────────────────────
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// ── Required: strip optionality with - modifier ────────────────────────
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // "-?" removes the optional modifier
};

// ── Readonly: add readonly modifier ───────────────────────────────────
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// ── Pick: keep only listed keys ────────────────────────────────────────
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// ── Omit: exclude listed keys ─────────────────────────────────────────
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// ── Record: build object from key union ───────────────────────────────
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};
```

```typescript
// ── ZaloPay form pattern from the opening scenario ─────────────────────
interface PaymentForm {
  id: string;
  amount: number;
  recipient: string;
  note: string;
  createdAt: Date;
}

type CreatePaymentForm = Omit<PaymentForm, "id" | "createdAt">;
// { amount: number; recipient: string; note: string }

type UpdatePaymentForm = Partial<CreatePaymentForm> & Pick<PaymentForm, "id">;
// { id: string; amount?: number; recipient?: string; note?: string }

type ReadonlyPaymentForm = Readonly<PaymentForm>;
// { readonly id: string; readonly amount: number; … }
```

```typescript
// ── Advanced mapped types: key remapping with `as` ─────────────────────
// Add getter methods for every property
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  id: number;
  name: string;
}

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string }

// Filter properties by value type
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Mixed {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

type StringProps = FilterByType<Mixed, string>; // { name: string }
type NumberProps = FilterByType<Mixed, number>; // { id: number; age: number }

// Remove readonly and optionality from mapped type
type Mutable<T> = {
  -readonly [K in keyof T]-?: T[K];
};
```

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `Partial<NestedObject>` for deep partial types | `Partial` only makes top-level props optional — nested objects remain fully required | Use `DeepPartial<T>` (recursive): `T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T` |
| `Pick<User, 'id'\|'name'\|...\|>` listing many props to keep | Listing 10 of 12 props to keep is tedious and fragile — better to state what you omit | Use `Omit<User, 'password' \| 'salt'>` when you want to remove few props from a large type |
| `Record<string, User>` for exhaustive key mapping | Accepts ANY string key — no compile-time guarantee all required keys are covered | Use `Record<'admin' \| 'user' \| 'guest', User>` for exhaustive, type-safe key union |
| `Omit<T, K>` where `K` is not in `T` | TypeScript silently does nothing — no error, design issue goes unnoticed | Audit your types; the key not existing is a sign of a design problem |
| `Readonly<{ a: { b: string } }>` expecting deep readonly | Mapped types are SHALLOW — `Readonly` does not make nested object `b` readonly | Write `DeepReadonly<T>` with explicit recursion for deep immutability |

---

### 🎯 Interview Pattern

**Trigger phrase:** "How do you avoid duplicating interface definitions?"
**Concept to reach:** Mapped types + utility types as DRY for schemas
**Opening sentence:** "I'd reach for utility types — Partial, Omit, Pick — which are all built on the mapped type pattern `{ [K in keyof T]: Transform }`, letting me derive variants from one source of truth."

---

## Concept 2: Conditional Types & `infer`

### 🧠 Memory Hook

> **"T extends U ? X : Y — same as ternary, but for types"**
> And `infer R` is how you _capture_ the thing you're checking for — "if T is a Promise, extract the value type _as R_."

---

### Why Does This Exist? / Tại Sao Nó Tồn Tại?

**Level 1 — Immediate pain:**
You have a utility that wraps any value in a Promise. Now you need a type that _unwraps_ it. Without conditional types, you'd have to manually write overloads for every possible input type — no way to say "if T is `Promise<X>`, return `X`".

**Level 2 — The deeper principle:**
Real type relationships are conditional. "The return type of this HOC depends on whether its argument is async" requires branching at the type level. Conditional types make the type system Turing-complete — they are the `if/else` that turns a passive annotation system into an active reasoning engine.

**Tiếng Việt:**
Conditional types là `if/else` ở cấp độ type. Chúng cần thiết khi kết quả type phụ thuộc vào đặc điểm của input — ví dụ: "nếu T là Promise, unwrap nó; nếu T là mảng, lấy element type". `infer` cho phép bạn _capture_ phần bạn đang kiểm tra thay vì chỉ kiểm tra nó.

---

### Visual: How Conditional Types Distribute / Cách Phân Phối

```
BASIC FORM:
  T extends U ? X : Y
  └── "Is T assignable to U?"
         Yes → X
         No  → Y

DISTRIBUTIVE (naked type parameter in union):
  type ToArray<T> = T extends any ? T[] : never;
  ToArray<string | number>
  → (string extends any ? string[] : never) | (number extends any ? number[] : never)
  → string[] | number[]          ← distributed over union members

NON-DISTRIBUTIVE (wrap in tuple to prevent distribution):
  type ToArrayND<T> = [T] extends [any] ? T[] : never;
  ToArrayND<string | number>
  → [(string | number)] extends [any] ? (string | number)[] : never
  → (string | number)[]          ← treated as a whole

INFER PATTERN:
  T extends Promise<infer U> ? U : T
              │         │
              │         └── capture: "call this part U"
              └── pattern: match the shape

  Awaited<Promise<string>>  → string
  Awaited<string>           → string  (falls through to : T)
```

---

### What & Why / Cái Gì & Tại Sao (Feynman Layer)

Think of a postal sorting machine. Packages roll down a conveyor. The machine checks shape: "Is this a box? Send it left. Is this an envelope? Send it right." Conditional types are that machine — at the _type_ level. And `infer` is the machine's ability to read the _label_ on the package while sorting it, not just the shape.

**Tiếng Việt:** Hãy nghĩ về conditional types như máy phân loại bưu kiện. Kiện hàng chạy qua dây chuyền, máy kiểm tra hình dạng rồi gửi sang trái hoặc phải. `infer` là khả năng đọc nhãn trên kiện hàng trong khi phân loại — bạn không chỉ kiểm tra mà còn _trích xuất_ thông tin.

---

### Core Implementation / Triển Khai Cốt Lõi

```typescript
// ── Basic conditional type ─────────────────────────────────────────────
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
type C = IsString<"hello">; // true  (string literal extends string)

// ── Unwrap utilities using infer ───────────────────────────────────────
// Extract the resolved type of a Promise
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type Resolved = Unwrap<Promise<{ id: number; name: string }>>;
// { id: number; name: string }

type NotAPromise = Unwrap<string>;
// string  (falls through to the else branch)

// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Nums = ArrayElement<number[]>; // number
type Strs = ArrayElement<string[]>; // string

// Implement ReturnType from scratch
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "John" };
}

type User = MyReturnType<typeof getUser>;
// { id: number; name: string }

// Implement Parameters from scratch
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = MyParameters<typeof createUser>;
// [name: string, age: number, email: string]
```

```typescript
// ── Distributive vs non-distributive behavior ──────────────────────────
type ToArray<T> = T extends any ? T[] : never;

type Distributed = ToArray<string | number>;
// string[] | number[]       ← distributed, each member wrapped separately

type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// (string | number)[]       ← treated as a union, wrapped once

// ── Practical: extract function keys from an object type ───────────────
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface Service {
  name: string;
  version: number;
  connect: () => void;
  disconnect: () => Promise<void>;
  query: (sql: string) => Promise<any[]>;
}

type ServiceMethods = FunctionKeys<Service>;
// 'connect' | 'disconnect' | 'query'
```

```typescript
// ── Recursive conditional types ────────────────────────────────────────
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

interface NestedConfig {
  server: {
    host: string;
    port: number;
    tls: {
      enabled: boolean;
      certPath: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

type PartialConfig = DeepPartial<NestedConfig>;
// All nested properties optional — server?.host?, server?.tls?.enabled?, etc.

// infer with constraint (TypeScript 4.7+)
type FirstStringElement<T> = T extends [infer First extends string, ...any[]] ? First : never;

type Result = FirstStringElement<["hello", 1, true]>; // 'hello'
type NoResult = FirstStringElement<[1, "hello"]>; // never
```

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Expecting `ToArray<string\|number>` to produce `(string\|number)[]` | Conditional types distribute over union members — each member is tested independently | Wrap in tuple `[T] extends [U]` to treat the union as a single unit |
| Using `infer` outside an `extends` condition | `infer` is only valid inside conditional type patterns — it's a syntax error elsewhere | Use `type Unwrap<T> = T extends Promise<infer U> ? U : T` — `infer` inside `extends` only |
| Using conditional types on non-generic type aliases and expecting lazy evaluation | Non-generic type aliases are evaluated eagerly at definition time, not deferred | Make the type alias generic so evaluation is deferred to each use site |
| Nesting multiple `infer` clauses without testing each step | Deep nesting makes debugging impossible — a wrong inner `infer` silently returns `never` | Test each `infer` extraction in isolation before composing them |
| `T extends never` behaving unexpectedly in distributive contexts | `never extends never` is `true`, but a naked `T extends never` distributes over nothing → `never` | Wrap in tuple `[T] extends [never]` for non-distributive check |

---

### 🎯 Interview Pattern

**Trigger phrase:** "How do you extract the inner type of a generic wrapper like Promise or Array?"
**Concept to reach:** Conditional types with `infer`
**Opening sentence:** "I'd use a conditional type with `infer`: `type Unwrap<T> = T extends Promise<infer U> ? U : T` — the `infer` keyword captures the inner type while the `extends` checks the shape, so I get the resolved value type without knowing it in advance."

---

## Concept 3: Discriminated Unions & Template Literal Types

### 🧠 Memory Hook

> **"One shared `kind` field = the compiler's switch key"**
> The discriminant is the single field all union members share — and its value uniquely identifies which variant you're in.

For template literals: **"String algebra — combine union types like multiplication tables"**
`'light' | 'dark'` × `'red' | 'blue'` = `'light-red' | 'light-blue' | 'dark-red' | 'dark-blue'`

---

### Why Does This Exist? / Tại Sao Nó Tồn Tại?

**Level 1 — Immediate pain:**
UI state is inherently variant-based. A fetch call is either loading, errored, or successful. If you model this as one flat object with optional fields (`{ data?: T; error?: Error; isLoading?: boolean }`), you can have _illegal states_ — `data` and `error` both set at the same time. Nothing in the type system prevents it.

**Level 2 — The deeper principle:**
Discriminated unions make _illegal states unrepresentable_. The compiler enforces that you can only be in _one_ state at a time, and `switch (state.kind)` exhaustiveness checking means you _cannot forget to handle a case_ without getting a compile error.

Template literal types extend this to strings — instead of `type EventName = string` (accepts anything), you get `type EventName = 'onClick' | 'onFocus' | 'onBlur'` generated automatically from a union.

**Tiếng Việt:**
Discriminated unions làm cho "trạng thái bất hợp lệ không thể biểu diễn được". Với `data?: T; error?: Error`, bạn có thể vô tình set cả hai. Với discriminated union, compiler đảm bảo chỉ một trạng thái tồn tại tại một thời điểm.

---

### Visual: State Machine as Discriminated Union / Máy Trạng Thái

```
ILLEGAL STATE MODEL (flat optional fields):
  interface FetchState {
    data?: User;
    error?: Error;
    isLoading?: boolean;
  }
  Possible combinations: 2³ = 8 states, but only 3 are valid → DANGEROUS

DISCRIMINATED UNION MODEL (exhaustive, exclusive):
  type FetchState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: User }
    | { status: 'error'; error: Error }

  Only 4 possible states. Compiler enforces which fields exist in each.

  ┌─────────┐   fetch()    ┌─────────┐  resolve  ┌─────────┐
  │  idle   │ ──────────► │ loading │ ─────────► │ success │
  └─────────┘             └─────────┘            └─────────┘
                                │ reject
                                ▼
                          ┌─────────┐
                          │  error  │
                          └─────────┘

  switch (state.status) {
    case 'idle':    // only {} available
    case 'loading': // only {} available
    case 'success': // state.data: User guaranteed
    case 'error':   // state.error: Error guaranteed
  }

EXHAUSTIVENESS CHECK (the never trick):
  function assertNever(x: never): never {
    throw new Error('Unhandled case: ' + x);
  }
  // Add to default: case of switch → compiler errors if a case is missing
```

---

### What & Why / Cái Gì & Tại Sao (Feynman Layer)

A traffic light is always in exactly one state: red, yellow, or green. It is _never_ in two states at once, and there is _no valid "in between" state_. Discriminated unions model your data the same way — the `kind` or `status` field is the color, and each color has its own set of rules (red = stop, green = go, no "red AND green").

Template literal types are multiplication tables for strings. `'GET' | 'POST'` combined with `'/users' | '/posts'` generates all 4 possible endpoint strings automatically — no manual listing, no forgetting an entry.

**Tiếng Việt:** Đèn giao thông luôn ở đúng một trạng thái: đỏ, vàng, hoặc xanh. Discriminated union mô hình hóa data tương tự — trường `kind` là màu đèn, và mỗi màu có quy tắc riêng. Template literal types là bảng cửu chương cho strings — nhân hai union lại để tạo ra tất cả tổ hợp có thể.

---

### Core Implementation / Triển Khai Cốt Lõi

```typescript
// ── API response as discriminated union ────────────────────────────────
interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  error: {
    code: string;
    message: string;
  };
}

interface LoadingResponse {
  status: "loading";
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | LoadingResponse;

function handleResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case "success":
      return `Got data: ${JSON.stringify(response.data)}`;
    case "error":
      return `Error ${response.error.code}: ${response.error.message}`;
    case "loading":
      return "Loading…";
    default:
      // Exhaustiveness check: if we forget a case, `response` is `never` here
      const _exhaustive: never = response;
      throw new Error("Unhandled status: " + _exhaustive);
  }
}
```

```typescript
// ── Form state machine ─────────────────────────────────────────────────
type FormState<T> =
  | { phase: "idle" }
  | { phase: "validating" }
  | { phase: "submitting"; values: T }
  | { phase: "success"; result: { id: string } }
  | { phase: "error"; errors: Partial<Record<keyof T, string>> };

interface LoginValues {
  email: string;
  password: string;
}

type LoginFormState = FormState<LoginValues>;

function renderForm(state: LoginFormState) {
  switch (state.phase) {
    case "idle":
    case "validating":
      return "Show form";
    case "submitting":
      return `Submitting: ${state.values.email}`;
    case "success":
      return `Success! ID: ${state.result.id}`;
    case "error":
      return `Errors: ${JSON.stringify(state.errors)}`;
  }
}
```

```typescript
// ── Template literal types ─────────────────────────────────────────────
// String combination via union cross-product
type Color = "red" | "green" | "blue";
type Shade = "light" | "dark";

type ColorVariant = `${Shade}-${Color}`;
// 'light-red' | 'light-green' | 'light-blue' |
// 'dark-red'  | 'dark-green'  | 'dark-blue'

// Auto-generate event handler names
type EventName = "click" | "focus" | "blur" | "change";
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur' | 'onChange'

// Type-safe event system using mapped + template literal types
type EventHandlers<Events extends string> = {
  [E in Events as `on${Capitalize<E>}`]?: (event: Event) => void;
};

type ButtonHandlers = EventHandlers<"click" | "focus" | "blur">;
// { onClick?: (event: Event) => void; onFocus?: …; onBlur?: … }

// Extract URL parameters at the type level
type ExtractParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
  : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type UserParams = ExtractParams<"/users/:id">;
// { id: string }

type CommentParams = ExtractParams<"/posts/:postId/comments/:commentId">;
// { postId: string; commentId: string }
```

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `kind: string` as discriminant field | TypeScript cannot narrow on a wide `string` type — it needs a specific literal to identify the variant | Use a literal type: `kind: 'circle' \| 'rectangle'` |
| Missing `default: never` in exhaustive switch | Adding a new union member silently falls through with no compile error | Always add `default: const _: never = x; throw new Error(...)` for exhaustiveness |
| Two variants sharing the same discriminant value: `{ kind: 'user'; isAdmin: boolean }` and `{ kind: 'user'; role: string }` | TypeScript cannot distinguish between the variants — narrowing is ambiguous | Each variant MUST have a UNIQUE literal discriminant value |
| Template literal key remapping without `string & K`: `` `get${K}` `` | `keyof T` includes `number` and `symbol` — template literals require string keys | Use `` `get${string & K}` `` to ensure K is treated as string |
| Using `Exclude` (union subtraction) when you need `Omit` (object key removal) | They operate on different things — `Exclude` works on union members, `Omit` on object keys | `Exclude<'a'\|'b'\|'c', 'a'>` → `'b'\|'c'`; `Omit<{a,b,c}, 'a'>` → `{b,c}` |

---

### 🎯 Interview Pattern

**Trigger phrase:** "How do you model state that can be in one of several exclusive modes?"
**Concept to reach:** Discriminated unions with exhaustiveness checking
**Opening sentence:** "I'd model it as a discriminated union — each variant shares a `status` or `kind` field with a unique literal value, which lets TypeScript narrow the type in a switch statement and, with a `never` check in the default case, guarantees we handle every variant at compile time."

---

## Type Guards / Bảo Vệ Kiểu

Type guards are the runtime complement to discriminated unions — they narrow types based on actual values.

```typescript
// ── Built-in type guards ───────────────────────────────────────────────
function processValue(value: string | number | null) {
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  } else if (typeof value === "number") {
    return value.toFixed(2); // narrowed to number
  }
  return ""; // narrowed to null
}

// ── instanceof guard ──────────────────────────────────────────────────
class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
  }
}

function handleError(err: Error | ApiError) {
  if (err instanceof ApiError) {
    console.error(`API ${err.code}: ${err.message}`); // err is ApiError
  } else {
    console.error(err.message); // err is Error
  }
}

// ── in operator guard ─────────────────────────────────────────────────
interface Car {
  drive: () => void;
  fuelType: "petrol" | "electric";
}
interface Boat {
  sail: () => void;
  hullType: string;
}

function move(vehicle: Car | Boat) {
  if ("drive" in vehicle) {
    vehicle.drive(); // narrowed to Car
  } else {
    vehicle.sail(); // narrowed to Boat
  }
}

// ── Custom type guard (predicate) ─────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof (obj as any).id === "number" &&
    "name" in obj &&
    typeof (obj as any).name === "string" &&
    "email" in obj &&
    typeof (obj as any).email === "string"
  );
}

function processApiPayload(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows data is User
  }
}

// ── Generic defined guard ─────────────────────────────────────────────
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const maybeValues: (number | null | undefined)[] = [1, null, 2, undefined, 3];
const definedValues = maybeValues.filter(isDefined);
// Type: number[]
```

---

## Index Signatures & Recursive Types

```typescript
// ── Index signatures ──────────────────────────────────────────────────
interface StringMap {
  [key: string]: string;
}

// With known keys + index signature
interface FlexibleConfig {
  required: string; // known key — must match index signature value type
  [key: string]: string; // all other keys must also be string values
}

// Dictionary pattern — prefer Record<string, T> for simpler cases
type Dictionary<T> = { [key: string]: T };

const cache: Dictionary<User> = {};
cache["user-1"] = { id: 1, name: "John", email: "j@example.com" };

// ── Recursive types ───────────────────────────────────────────────────
// JSON-compatible value type
type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

const data: JSONValue = {
  name: "John",
  scores: [1, 2, 3],
  meta: { active: true, tags: ["a", "b"] },
};

// Tree data structure
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

const tree: TreeNode<string> = {
  value: "root",
  children: [
    { value: "child1", children: [] },
    { value: "child2", children: [{ value: "grandchild", children: [] }] },
  ],
};
```

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

---

### Q1: When would you use `Pick` vs `Omit`? / Khi nào dùng `Pick` vs `Omit`? 🟢 Junior

**A:**

**The mental model — subtractive vs additive selection:**

`Pick<T, Keys>` is additive: "I want _exactly these_ keys." Use it when you need a small, specific subset from a large type.

`Omit<T, Keys>` is subtractive: "I want _everything except these_ keys." Use it when you want most of a type and only need to remove a few fields.

**Rule of thumb:** Count what you're selecting vs. excluding. If you're listing fewer keys, use the matching operation. Listing 10 keys to keep when you could list 2 keys to remove is noisy and error-prone.

```typescript
interface FullUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// BAD: Pick with many keys to exclude 2 sensitive fields
type BadPublicUser = Pick<
  FullUser,
  "id" | "name" | "email" | "createdAt" | "updatedAt" | "deletedAt"
>;

// GOOD: Omit the 2 sensitive fields — intent is clear
type PublicUser = Omit<FullUser, "passwordHash" | "salt">;

// GOOD: Pick when you want a small targeted subset
type UserPreview = Pick<FullUser, "id" | "name">;
```

**Practical patterns from real codebases:**

```typescript
// API layer: Omit server-assigned fields for create requests
type CreateUserDTO = Omit<FullUser, "id" | "createdAt" | "updatedAt" | "deletedAt">;

// Component props: Pick only display-relevant fields
type UserCardProps = Pick<FullUser, "id" | "name" | "email">;

// Form data: Omit computed/auto-populated fields
type UserFormData = Omit<
  FullUser,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | "passwordHash" | "salt"
>;
```

**One subtlety:** `Omit` is implemented as `Pick<T, Exclude<keyof T, K>>`. This means `Omit` with non-existent keys silently does nothing — TypeScript won't error. `Pick` with a non-existent key _does_ error, making it safer for strict correctness.

**Tiếng Việt:**
`Pick` là chọn thêm vào ("tôi muốn đúng những key này"). `Omit` là loại trừ ("tôi muốn tất cả trừ những key này"). Quy tắc thực tế: nếu bạn liệt kê ít key hơn, dùng operation tương ứng. `Omit` cho phép bỏ field nhạy cảm (passwordHash, salt) mà không phải liệt kê lại tất cả field còn lại.

💡 **Interview Signal:**

- ✅ Strong: Explains the additive vs. subtractive mental model, gives the "count keys" rule of thumb, mentions the implementation difference
- ❌ Weak: "Pick selects, Omit removes" — stops at the definition without practical guidance on _when_ to choose each

---

### Q2: Implement `Partial<T>` from scratch using mapped types. / Tự triển khai `Partial<T>` từ đầu bằng mapped types. 🟡 Mid

**A:**

**Start with what `Partial` does:** every property of `T` becomes optional. Optional means adding `?` to each key.

**Mapped type anatomy — three parts:**

```
{ [K in keyof T]?: T[K] }
  │    │         │    │
  │    │         │    └── value type: preserve original type T[K]
  │    │         └── modifier: ? makes property optional
  │    └── source: "for each key K in T"
  └── standard object type syntax
```

**Full implementation with explanation:**

```typescript
// Step 1: Iterate all keys
type Step1<T> = {
  [K in keyof T]: T[K]; // same as T — just demonstrating iteration
};

// Step 2: Add optional modifier
type MyPartial<T> = {
  [K in keyof T]?: T[K]; // ? on the key side makes it optional
};

// Step 3: Verify it works
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = MyPartial<User>;
// { id?: number; name?: string; email?: string }

// Usage
function updateUser(id: number, updates: MyPartial<User>): User {
  const existing = findUser(id); // imagine this exists
  return { ...existing, ...updates };
}

updateUser(1, { name: "Jane" }); // ✅
updateUser(1, { email: "j@example.com" }); // ✅
updateUser(1, {}); // ✅ nothing required
```

**Now implement the modifier variants:**

```typescript
// Required: remove optional with -? modifier
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // -? strips the ? even from originally optional props
};

// Readonly: add readonly modifier
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Mutable (remove readonly): -readonly modifier
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
```

**Important nuance — `Partial` is SHALLOW:**

```typescript
interface Nested {
  user: {
    name: string; // NOT made optional by Partial<Nested>
    address: {
      city: string; // NOT made optional by Partial<Nested>
    };
  };
}

type ShallowPartial = Partial<Nested>;
// { user?: { name: string; address: { city: string } } }
// Only top-level `user` is optional — inner fields are still required

// For deep optionality, write recursive:
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
```

**Tiếng Việt:**
`Partial<T>` được xây dựng bằng mapped type: `{ [K in keyof T]?: T[K] }`. Ba phần: `[K in keyof T]` = lặp qua tất cả key của T, `?` = modifier làm optional, `T[K]` = giữ nguyên value type. Lưu ý quan trọng: `Partial` chỉ shallow — các nested object không bị ảnh hưởng.

💡 **Interview Signal:**

- ✅ Strong: Explains the three parts of mapped type syntax, implements all modifier variants (-?, -readonly), raises the shallow vs. deep distinction unprompted
- ❌ Weak: Only writes `{ [K in keyof T]?: T[K] }` and stops — misses the "why" and the nuances

---

### Q3: What are discriminated unions and when should you use them? / Discriminated union là gì và khi nào nên dùng? 🟡 Mid

**A:**

**The problem they solve:** optional fields create illegal states.

```typescript
// PROBLEMATIC: flat interface with optional fields
interface FetchState {
  data?: User;
  error?: Error;
  isLoading?: boolean;
}

// This is legally valid TypeScript — but makes no sense at runtime:
const broken: FetchState = {
  data: { id: 1, name: "John", email: "j@example.com" },
  error: new Error("Network failure"),
  isLoading: true,
};
// data AND error AND loading — simultaneously? Illegal state, but TypeScript allows it.
```

**The solution:** discriminated union with a shared literal discriminant field.

```typescript
// CORRECT: discriminated union
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

// Now illegal state is UNREPRESENTABLE:
// const broken: FetchState<User> = { status: 'success', error: new Error() };
// ❌ Type error: 'error' does not exist on { status: 'success'; data: T }
```

**Three conditions for a discriminated union:**

1. Multiple variants share a common property (the discriminant)
2. The discriminant has a **unique literal type** per variant (`'idle'`, `'loading'`, `'success'`, `'error'`)
3. TypeScript can narrow the type when the discriminant is checked

**Exhaustiveness checking — the `never` trick:**

```typescript
function assertNever(x: never): never {
  throw new Error("Unhandled case: " + JSON.stringify(x));
}

function renderFetchState<T>(state: FetchState<T>, render: (data: T) => string): string {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading…";
    case "success":
      return render(state.data); // state.data guaranteed
    case "error":
      return `Error: ${state.error.message}`;
    default:
      return assertNever(state); // compile error if case added later
  }
}
```

**Real state management example — Redux actions:**

```typescript
interface FetchUsersStart {
  type: "FETCH_USERS/START";
}
interface FetchUsersSuccess {
  type: "FETCH_USERS/SUCCESS";
  users: User[];
}
interface FetchUsersFailure {
  type: "FETCH_USERS/FAILURE";
  error: string;
}

type UsersAction = FetchUsersStart | FetchUsersSuccess | FetchUsersFailure;

function usersReducer(state: UsersState, action: UsersAction): UsersState {
  switch (action.type) {
    case "FETCH_USERS/START":
      return { ...state, loading: true, error: null };
    case "FETCH_USERS/SUCCESS":
      return { loading: false, error: null, users: action.users };
    case "FETCH_USERS/FAILURE":
      return { ...state, loading: false, error: action.error };
  }
}
// No default needed — TypeScript knows all cases are covered
```

**When to use discriminated unions:**

- Fetch/async state (idle/loading/success/error)
- Form lifecycle (idle/validating/submitting/success/error)
- Redux/Zustand actions
- Event types with different payloads
- Result types (success/failure with typed payloads)

**Tiếng Việt:**
Discriminated union có một trường phân biệt (`status`, `type`, `kind`) với giá trị literal duy nhất cho mỗi variant. Compiler dùng trường này để thu hẹp type trong switch/if. Lợi ích chính: "illegal states unrepresentable" — bạn không thể vô tình có `data` và `error` cùng lúc. Thêm `assertNever` vào default case để đảm bảo exhaustive checking.

💡 **Interview Signal:**

- ✅ Strong: Shows the "illegal state" problem first, explains the three conditions, demonstrates exhaustiveness checking with `assertNever`, ties to real state management
- ❌ Weak: "It's a union where all members share a common field" — correct definition but no motivation or practical application

---

### Q4: Implement `DeepReadonly<T>` that handles objects, arrays, and functions. / Tự triển khai `DeepReadonly<T>` xử lý object, array và function. 🔴 Senior

**A:**

**The problem with the naive approach:**

```typescript
// Naive: doesn't handle arrays or functions
type NaiveDeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? NaiveDeepReadonly<T[K]> : T[K];
};

// Problem: arrays *are* objects, so array elements would become readonly too
// Problem: functions are objects — wrapping them in mapped type breaks their call signature
// Problem: class instances become unusable ReadOnly objects
```

**Correct implementation — handle each case explicitly:**

```typescript
type DeepReadonly<T> =
  // Functions: leave unchanged — don't recurse into them
  T extends (...args: any[]) => any
    ? T
    : // Arrays: readonly array of deeply readonly elements
      T extends Array<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : // Plain objects: recursively apply to all properties
        T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : // Primitives (string, number, boolean, null, undefined): unchanged
          T;
```

**Test it exhaustively:**

```typescript
interface AppState {
  users: {
    list: User[];
    selectedId: string | null;
  };
  settings: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  actions: {
    fetchUsers: () => Promise<void>;
    updateSettings: (s: Partial<AppState["settings"]>) => void;
  };
}

type FrozenState = DeepReadonly<AppState>;

declare const state: FrozenState;

// ✅ Reading works at all depths
state.users.list[0].name;
state.settings.notifications.email;

// ❌ Mutations blocked at all depths
// state.users.selectedId = 'new-id';        // Error: readonly
// state.users.list.push({ ... });            // Error: ReadonlyArray has no push
// state.users.list[0].name = 'hacked';      // Error: readonly

// ✅ Functions preserved — still callable
state.actions.fetchUsers();
state.actions.updateSettings({ theme: "dark" });

// ❌ But function refs can't be replaced
// state.actions.fetchUsers = async () => {};  // Error: readonly
```

**Why the order of conditionals matters:**

The `extends` chain is evaluated top-to-bottom on first match:

1. Check functions first — functions extend both `object` AND `(...args) => any`, so without the function check first, they'd be processed as objects and their call signatures would be lost
2. Check arrays next — arrays extend `object`, so without the array check before the object check, `User[]` becomes `{ readonly 0: DeepReadonly<User>; … }` instead of `ReadonlyArray<DeepReadonly<User>>`
3. Check objects — only plain objects reach this branch
4. Fall through to primitives

**Tiếng Việt:**
`DeepReadonly<T>` cần kiểm tra theo thứ tự: functions trước (để không mất call signature), rồi arrays (để không biến array thành object), rồi objects (áp dụng recursive), cuối cùng là primitives. Thứ tự trong conditional type chain rất quan trọng vì functions và arrays đều `extends object`.

💡 **Interview Signal:**

- ✅ Strong: Immediately identifies the naive implementation's failure modes (arrays as objects, functions as objects), implements ordered conditional checks with correct reasoning for the order, tests all three cases
- ❌ Weak: Only writes `T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T` — fails on arrays and functions

---

### Q5: Design a type-safe form validation system using advanced types. / Thiết kế hệ thống validation form type-safe bằng advanced types. 🔴 Senior

**A:**

**Requirements:** given any form shape, generate typed error objects, validation rules, and submission handlers — all derived from the base type, no duplication.

**Step 1: Model the form state as a discriminated union**

```typescript
type FormState<T> =
  | { phase: "idle" }
  | { phase: "dirty"; values: T; touched: Partial<Record<keyof T, boolean>> }
  | { phase: "validating"; values: T }
  | { phase: "invalid"; values: T; errors: FormErrors<T> }
  | { phase: "submitting"; values: T }
  | { phase: "success"; result: { id: string } }
  | { phase: "error"; values: T; serverError: string };
```

**Step 2: Derive the error type from the form shape**

```typescript
// FormErrors: every field can have a validation error string or be undefined
type FormErrors<T> = {
  [K in keyof T]?: T[K] extends object
    ? FormErrors<T[K]> // nested form groups
    : string; // leaf fields get a string error message
};

// Example
interface LoginForm {
  email: string;
  password: string;
}

type LoginErrors = FormErrors<LoginForm>;
// { email?: string; password?: string }
```

**Step 3: Derive validation rules from the form shape**

```typescript
// Each field validator takes the field value and full form values, returns error or null
type FieldValidator<TValue, TForm> = (value: TValue, allValues: TForm) => string | null;

// ValidationSchema: a validator for every field (optional — not all fields need validation)
type ValidationSchema<T> = {
  [K in keyof T]?: T[K] extends object ? ValidationSchema<T[K]> : FieldValidator<T[K], T>;
};

// Example schema
const loginSchema: ValidationSchema<LoginForm> = {
  email: (value) => {
    if (!value) return "Email is required";
    if (!value.includes("@")) return "Invalid email format";
    return null;
  },
  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return null;
  },
};
```

**Step 4: Template literal types for field change events**

```typescript
// Generate typed event names for every field: onEmailChange, onPasswordChange, etc.
type FieldChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type LoginChangeHandlers = FieldChangeHandlers<LoginForm>;
// {
//   onEmailChange: (value: string) => void;
//   onPasswordChange: (value: string) => void;
// }
```

**Step 5: Compose into a full form hook return type**

```typescript
type UseFormReturn<T> = {
  state: FormState<T>;
  values: T;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handlers: FieldChangeHandlers<T>;
  submit: () => Promise<void>;
  reset: () => void;
};

// Full validation runner — type-safe, exhaustive over schema keys
function validateForm<T extends object>(values: T, schema: ValidationSchema<T>): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const key in schema) {
    const validator = schema[key] as FieldValidator<T[typeof key], T> | undefined;
    if (validator) {
      const result = validator(values[key], values);
      if (result !== null) {
        (errors as any)[key] = result;
      }
    }
  }
  return errors;
}

// Usage — fully typed
function useLoginForm(): UseFormReturn<LoginForm> {
  // implementation using React state, with types fully inferred from LoginForm
  throw new Error("implementation left as exercise");
}

const form = useLoginForm();
form.handlers.onEmailChange("user@example.com"); // ✅ typed
form.handlers.onPasswordChange("secret123"); // ✅ typed
// form.handlers.onMissingChange('x');              // ❌ compile error — field doesn't exist
```

**The advanced types used and why each one:**

- `Discriminated union` (`FormState<T>`) — makes illegal states unrepresentable (can't be both submitting and idle)
- `Mapped types` (`FormErrors<T>`, `ValidationSchema<T>`) — derive schemas from base type, no duplication
- `Recursive conditional types` — handle nested form groups
- `Template literal + mapped` (`FieldChangeHandlers<T>`) — auto-generate typed event handler names
- `Conditional types` in `FormErrors` — leaf fields get `string`, nested groups get recursive errors

**Tiếng Việt:**
Hệ thống validation type-safe kết hợp: discriminated union cho form state (illegal states unrepresentable), mapped types để derive FormErrors và ValidationSchema từ base form type (DRY), recursive conditional types cho nested form groups, và template literal + mapped type để auto-generate handler names. Kết quả: đổi `LoginForm` là tất cả types tự update — zero manual synchronization.

💡 **Interview Signal:**

- ✅ Strong: Designs bottom-up (state → errors → validators → handlers → composition), justifies each type choice, shows the "zero duplication" end state, handles the nested case
- ❌ Weak: Writes validation logic without using advanced types for the _schema_ — just uses plain interfaces, missing the whole point

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                              | Difficulty | Core Concept      | Key Signal                                            |
| --- | ---------------------------------------------------- | ---------- | ----------------- | ----------------------------------------------------- |
| 1   | Khi nào dùng `Pick` vs `Omit`?                       | 🟢 Junior  | Utility types     | Biết use case của từng utility type                   |
| 2   | Tự implement `Partial<T>` bằng mapped types          | 🟡 Mid     | Mapped types      | Dùng `?` modifier trong mapped type                   |
| 3   | Discriminated union là gì, khi nào nên dùng?         | 🟡 Mid     | Pattern design    | Exhaustive checking với `never` + `assertNever`       |
| 4   | Tự implement `DeepReadonly<T>` xử lý object/array/fn | 🔴 Senior  | Recursive types   | Conditional + recursive mapped types                  |
| 5   | Thiết kế type-safe form validation system            | 🔴 Senior  | Type architecture | Full system từ types đến validators, zero duplication |

---

## Cold Call Simulation

**Prompt:** "What are mapped types and how do they relate to utility types like `Partial`?"

**30-second answer:**

> Mapped types are a TypeScript feature that lets you iterate over all keys of an existing type and apply a transformation to each property. The syntax is `{ [K in keyof T]: Transform<T[K]> }` — you loop over keys, optionally add modifiers like `?` for optional or `readonly`, and set the new value type. Utility types like `Partial`, `Required`, `Readonly`, `Pick`, and `Omit` are all built _on top of_ mapped types — `Partial<T>` is literally `{ [K in keyof T]?: T[K] }`, just shipped with TypeScript so you don't write it yourself. So mapped types are the primitive; utility types are the named, reusable instances of common transformations.

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                     |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết cú pháp mapped type cơ bản. Liệt kê 3 modifier và ý nghĩa của từng cái (`?`, `-?`, `readonly`, `-readonly`). `infer` dùng ở đâu?       |
| 2   | 🎨 Visual      | Vẽ sơ đồ 4 states của fetch operation dưới dạng discriminated union — mỗi state có fields gì? Vẽ transitions giữa chúng.                    |
| 3   | 🛠️ Application | Viết `DeepPartial<T>` từ đầu: xử lý primitive vs object, và cách phân biệt array khỏi plain object.                                         |
| 4   | 🐛 Debug       | `type Flatten<T> = T extends Array<infer U> ? U : T` với `T = string \| number[]` cho kết quả gì? Có phải expected behavior không? Tại sao? |
| 5   | 🎓 Teach       | Giải thích `infer` cho junior developer bằng analogy đời thường — không dùng thuật ngữ TypeScript.                                          |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `{ [K in keyof T]: ... }`. Modifiers: `?` (optional), `-?` (required), `readonly` (readonly), `-readonly` (mutable). `infer` dùng trong `extends` clause để capture type. |
| 2   | `idle: {}` → `loading: {}` → `success: { data: T }` / `error: { error: Error }`. Discriminant field: `status: 'idle' \| 'loading' \| 'success' \| 'error'`.               |
| 3   | `type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T` — primitives trả về as-is, objects recurse.                                         |
| 4   | `T = string \| number[]` → distributive: `string \| (number[] extends Array<infer U> ? U : never)` = `string \| number`. Đúng behavior, nhưng có thể gây surprise.        |
| 5   | `infer` như "hãy đoán xem cái gì nằm trong hộp". Nếu pattern khớp → TypeScript điền tên biến bạn đặt. Như tháo rời máy: "Cái gì nằm trong array này?"                     |

> 🎯 **Feynman Prompt:** Giải thích mapped types cho người biết JavaScript — "Nếu bạn có thể dùng `Object.keys()` để lặp qua object lúc runtime, mapped types là phiên bản compile-time: lặp qua các keys của type."

---

## 🔁 Spaced Repetition Reminder

- **Day 1:** Read through all three concepts and the Q&A section
- **Day 3:** Attempt Q2 (implement Partial) and Q4 (DeepReadonly) from scratch — no looking
- **Day 7:** Cold call simulation — say the 30-second answer out loud
- **Day 14:** Complete the full Retrieval Self-Check with this document closed
- **Day 30:** Take Q5 (form validation system) and extend it to handle async validators

**The three concepts to own before any senior TypeScript interview:**

1. Mapped types (`[K in keyof T]`) + modifier system (`?`, `-?`, `readonly`, `-readonly`, `as`)
2. Conditional types with `infer` — distributive behavior and when to suppress it
3. Discriminated unions — illegal state elimination + exhaustiveness checking with `never`

---

[← Previous: TypeScript Basics](./01-typescript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Generics Deep Dive →](./03-generics-deep-dive.md)

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [TypeScript Basics](./01-typescript-basics.md) — foundational type system knowledge required here
- [Generics Deep Dive](./03-generics-deep-dive.md) — generics power all conditional and mapped types
- [React TypeScript](./05-react-typescript.md) — discriminated unions and utility types applied in React
- [TypeScript Comprehensive](./04-typescript-comprehensive.md) — full reference with more type patterns

### Khác track (Cross-track)
- [JS ES6 Features](../01-javascript/07-es6-features.md) — ES6 destructuring patterns mirror TypeScript type patterns
- [React Advanced Patterns](../03-react/04-advanced-patterns.md) — advanced types enable type-safe React patterns
- [CS Fundamentals: Computation Theory](../../shared/01-cs-fundamentals/08-computation-theory.md) — formal type theory behind conditional types

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **Utility types** like `Partial`, `Required`, `Pick`, `Omit`, and `Record` are built on mapped types — understanding mapped types lets you build your own / Các utility type như `Partial`, `Pick`, `Omit` được xây trên mapped types — hiểu mapped types giúp tự tạo utility riêng.
- **Conditional types** (`T extends U ? X : Y`) allow type-level branching; `infer` extracts type information from within a type expression / Conditional types cho phép rẽ nhánh ở cấp kiểu; `infer` trích xuất kiểu từ bên trong biểu thức.
- **Discriminated unions** use a shared literal field (discriminant) to let TypeScript narrow types safely in switch/if blocks / Discriminated unions dùng một field literal chung để TypeScript thu hẹp kiểu an toàn trong switch/if.
- **Template literal types** compose string types at the type level (e.g., `` `on${Capitalize<EventName>}` ``) enabling precise event handler typing / Template literal types ghép kiểu string ở cấp type, tạo ra typing chính xác cho event handlers.
- **Type guards** (`typeof`, `instanceof`, custom `is` predicates) move TypeScript from `unknown | any` territory to concrete types at runtime / Type guards đưa TypeScript từ `unknown | any` về kiểu cụ thể tại runtime.
- **Index signatures** (`[key: string]: V`) model dynamic key objects but sacrifice per-key precision; prefer `Record<K, V>` when keys are known / Index signatures mô hình hóa object có key động nhưng mất độ chính xác từng key.
- **Recursive types** define self-referencing structures (trees, nested JSON) — pair with `infer` for deep unwrapping / Recursive types định nghĩa cấu trúc tự tham chiếu; kết hợp `infer` để unwrap sâu.

### Interview Tips / Mẹo Phỏng Vấn

- When asked to "type a function that returns the same type as its input", demonstrate `infer` in a conditional type — this is the #1 senior TypeScript pattern / Khi được yêu cầu "typing hàm trả về cùng kiểu với input", dùng `infer` trong conditional type — đây là pattern senior TypeScript hay gặp nhất.
- Explain discriminated unions with a concrete example (`type Shape = Circle | Square` with `kind` field) — interviewers want to see you understand exhaustive checking / Giải thích discriminated unions bằng ví dụ cụ thể với field `kind` — người phỏng vấn muốn thấy bạn hiểu exhaustive checking.
- Know the difference between `Omit<T, K>` and `Exclude<T, K>`: `Omit` removes object keys; `Exclude` removes union members / Phân biệt `Omit` (xóa key của object) và `Exclude` (xóa member của union).
- For template literal type questions, remember they work both for **creating** new string types and for **parsing/narrowing** existing ones / Template literal types dùng được cả để tạo kiểu string mới lẫn để parse/narrow kiểu đã có.
- Always mention **type narrowing is automatic** after a type guard — TypeScript's control flow analysis does the work / Luôn nhắc rằng TypeScript tự động thu hẹp kiểu sau type guard nhờ control flow analysis.
