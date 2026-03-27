# TypeScript Type System Basics / Hệ Thống Kiểu TypeScript Cơ Bản

> **Track**: FE | **Difficulty**: 🟢 Junior → 🟡 Mid
> **Prerequisites**: [JavaScript Basics](../01-javascript/00-javascript-basics.md)
> **See also**: [Advanced Types](./02-advanced-types.md), [Generics](./03-generics-deep-dive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Shopee's checkout team migrated 50,000 lines of JavaScript to TypeScript. In the first week alone, `strictNullChecks` caught **47 null-pointer bugs** that had been silently crashing the payment page in production. After enabling `noImplicitAny`, the team's `any` usage dropped from 340 instances to 12.

But the real friction wasn't the tooling — it was the junior developers. They kept using `any` to "fix" type errors, couldn't articulate the difference between `unknown` and `any` in code review, confused `interface` with `type`, and wrote type guards that fooled the compiler but crashed at runtime.

This file covers the three foundational concepts every TypeScript developer must own cold: the **type hierarchy**, **unions and intersections**, and **type narrowing**. These are the building blocks everything else rests on.

Đây là ba khái niệm nền tảng mà mọi developer TypeScript phải thuộc lòng: **hệ thống phân cấp kiểu**, **union và intersection**, và **type narrowing**. Tất cả TypeScript nâng cao đều xây dựng trên ba thứ này.

---

## 🔑 Knowledge Chain / Chuỗi Kiến Thức

```
JavaScript (dynamic types, runtime errors)
        │
        ▼
TypeScript Type System  ◄── THIS FILE
  ├── Type hierarchy (unknown → primitives → never)
  ├── Unions / Intersections / Literal types
  └── Type narrowing & guards
        │
        ▼
Advanced Types (02-advanced-types.md)
  ├── Mapped types, conditional types
  └── Template literal types
        │
        ▼
Generics (03-generics-deep-dive.md)
  └── Generic constraints rely on narrowing
```

**Prereq**: You need to understand JavaScript's `typeof`, `instanceof`, and how `null` behaves at runtime.

**Enables**: Advanced Types, Generics, Utility Types (`Partial`, `Pick`, `Record`), and writing correct React prop types.

---

## Concept 1: Type Hierarchy & Annotations / Hệ Thống Phân Cấp Kiểu

### 🧠 Memory Hook

> **"unknown = safe vault (must unlock first), any = broken lock (no protection), never = black hole (nothing escapes)"**

`unknown` giống két sắt — bạn biết có gì đó bên trong nhưng phải mở khóa (narrow) trước khi dùng. `any` giống ổ khóa hỏng — ai cũng vào được. `never` giống hố đen — không có giá trị nào thoát ra được.

### Why Does This Exist? / Tại Sao Tồn Tại?

**Why 1 — Runtime JS errors are expensive.**
JavaScript lets you call `.toUpperCase()` on `undefined`. You only find out at 2am when Sentry fires. TypeScript moves that discovery from runtime (customer impact) to compile time (developer's terminal). Một lỗi tìm được lúc build cost $0; lỗi tìm được lúc production cost hàng giờ debug và ảnh hưởng user thật.

**Why 2 — The compiler needs a vocabulary.**
For TypeScript to reason about your code, it needs a complete lattice of types from "absolutely anything" (`unknown`) down to "this can never happen" (`never`). Without this hierarchy, the compiler cannot know which operations are safe. The hierarchy is the compiler's grammar — không có nó, không có câu nào đúng ngữ pháp.

**Why 3 — Structural typing enables flexibility without fragility.**
TypeScript uses **structural typing** (duck typing at the type level): compatibility is decided by shape, not by name. This means you can pass any object that has the right properties — you don't need to explicitly `implement` an interface. It's the pragmatic middle ground between Java's rigid nominalism and JavaScript's "anything goes". Bạn không cần khai báo "class này implements interface kia" — chỉ cần có đúng shape là đủ.

### Feynman Layer / Giải Thích Như Cho Trẻ 12 Tuổi

Think of types like labels on boxes. The label says what's inside: "eggs" or "books" or "fragile glassware". The label doesn't change what's actually inside — but it stops you from putting shoes in the food box, and it stops the compiler from letting you call `.bake()` on a number.

`unknown` = a box with a question mark. You know _something_ is inside, but you must open and look before you can use it.
`any` = a box with no label at all. You can put anything in, take anything out, crash and burn.
`never` = a box that is physically impossible to fill. It represents code that cannot be reached.

---

### Visual: Type Hierarchy Tree / Cây Phân Cấp Kiểu

```
                        unknown                      ← top type: every type is a subtype
                           │
          ┌────────────────┼────────────────┐
          │                │                │
         any            object            void        ← void = "no meaningful return"
          │                │
          │    ┌───────────┼───────────────┐
          │    │           │               │
          │  Array      Function        Object
          │
   PRIMITIVES (subtypes of any, NOT subtypes of object):
   ┌────────┬────────┬─────────┬──────┬───────────┬────────┐
   │ string │ number │ boolean │ null │ undefined │ symbol │
   └────────┴────────┴─────────┴──────┴───────────┴────────┘

                        never                        ← bottom type: subtype of everything
                  (unreachable code,
                   exhaustive checks)
```

Key insight: `never` is assignable _to_ every type but nothing is assignable _to_ `never`. That's what makes it perfect for exhaustive checks — if a `case` reaches `never`, TypeScript proves you missed a union branch.

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `let data: any = fetchUser()` | `any` silences all errors; `unknown` forces you to prove the shape | `let data: unknown = fetchUser()` |
| `(el as HTMLInputElement).value` without null check | `as` is compile-time only — if `el` is null at runtime, you crash | `if (el instanceof HTMLInputElement) el.value` |
| `function f(x: any) { return x.foo }` | `any` propagates the infection to the caller | `function f(x: unknown) { if (typeof x === 'object' && x !== null && 'foo' in x) ... }` |
| `const x: any = JSON.parse(raw)` | `JSON.parse` returns `any` by design, but you should re-type it | `const x: unknown = JSON.parse(raw)` + schema validation |
| `type Void = void` as return type on arrow function that might return a value | `void` means "caller should ignore return", not "returns undefined" | Use `undefined` explicitly if you need the return |

---

### 🎯 Interview Pattern

**Trigger**: "What's the difference between `any` and `unknown`?" or "Why should I avoid `any`?"

**Concept to activate**: Type hierarchy — `unknown` is the safe top type, `any` is the escape hatch that disables type checking.

**Opening sentence**: "Both `any` and `unknown` accept any value, but `unknown` is type-safe because you cannot perform operations on it until you've proven what type it is through narrowing — whereas `any` disables the type checker entirely for that variable and everything it touches."

---

### Code: Type Annotations, Inference, and `as const`

```typescript
// --- Explicit annotation vs inference ---
let username: string = "john"; // annotation (redundant here)
let age = 30; // inference: TypeScript sees number

// When to annotate:
// 1. When type can't be inferred from the value
let status: "loading" | "success" | "error";

// 2. Function parameters — always annotate
function greet(name: string, times: number = 1): string {
  return `Hello, ${name}!`.repeat(times);
}

// 3. Public API return types — annotate for documentation + safety
function fetchUser(id: number): Promise<User | null> {
  return fetch(`/users/${id}`).then((r) => r.json());
}

// --- unknown vs any ---
function processInput(raw: unknown): string {
  // raw.toUpperCase()  ← ERROR: Object is of type 'unknown'
  if (typeof raw === "string") {
    return raw.toUpperCase(); // OK: narrowed to string
  }
  if (typeof raw === "number") {
    return raw.toFixed(2); // OK: narrowed to number
  }
  throw new TypeError("Expected string or number");
}

function processAny(raw: any): string {
  return raw.toUpperCase(); // No error — but crashes if raw is number!
}

// --- as const: freeze inference to literal types ---
const ROUTES = {
  home: "/",
  about: "/about",
  checkout: "/checkout",
} as const;
// Without as const: ROUTES.home is string
// With as const:    ROUTES.home is "/"  (literal type)

type Route = (typeof ROUTES)[keyof typeof ROUTES]; // "/" | "/about" | "/checkout"

// --- never: the bottom type ---
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}
```

---

## Concept 2: Unions, Intersections & Literal Types

### 🧠 Memory Hook

> **"Union (|) = menu choice — pick ONE. Intersection (&) = job requirements — need ALL."**

Union: bạn có thể gọi phở **hoặc** bún bò. Intersection: ứng viên phải biết React **và** TypeScript **và** Node.

### Why Does This Exist? / Tại Sao Tồn Tại?

**Why 1 — Real data has variants.**
API responses aren't always `{ data: T }`. They're `{ data: T } | { error: string }`. A form field's value is `string | null`. A DOM event listener might receive `MouseEvent | TouchEvent`. Unions let you model reality instead of lying to the compiler with a single type.

**Why 2 — Composition without inheritance.**
Instead of building deep class hierarchies to combine behaviors, intersections let you compose types orthogonally: `type AdminUser = User & Admin`. No inheritance. No fragile base class. Just shape combination. Đây là cách TypeScript khuyến khích composition over inheritance ở level type.

**Why 3 — Literal types enable state machines.**
`type Status = "idle" | "loading" | "success" | "error"` is not just a string with four possible values — it's a _state machine enforced by the type system_. The compiler will reject `status = "retrying"`. This eliminates an entire class of bugs where UI renders wrong because a string value was misspelled.

### Visual: Union vs Intersection / Biểu Đồ Venn

```
Union (A | B) — values that belong to A OR B:

    ┌─────────────────────────┐
    │  A          B           │
    │ ┌───┐    ┌───┐          │
    │ │   │    │   │          │
    │ │   │    │   │          │
    │ └───┘    └───┘          │
    │ string  number          │
    └─────────────────────────┘
    A | B = string | number
    A value can be string OR number


Intersection (A & B) — values that belong to A AND B:

    ┌───────────────────────────┐
    │  A        A & B    B      │
    │ ┌──────────────────────┐  │
    │ │User  ┌──────┐ Admin  │  │
    │ │      │ both │        │  │
    │ │      └──────┘        │  │
    │ └──────────────────────┘  │
    └───────────────────────────┘
    A & B must satisfy BOTH shapes


Discriminated Union — state machine:

    ┌──────────┐   kind:"loading"   ┌───────────────┐
    │  Idle    │ ─────────────────► │   Loading     │
    │{kind:    │                    │ {kind:        │
    │"idle"}   │                    │ "loading"}    │
    └──────────┘                    └───────┬───────┘
         ▲                                  │
         │           kind:"error"           │ kind:"success"
         │                                  │
    ┌────┴──────┐                   ┌───────▼───────┐
    │  Error    │ ◄──────────────── │   Success     │
    │{kind:     │                   │ {kind:        │
    │"error",   │                   │ "success",    │
    │error:Err} │                   │ data: T}      │
    └───────────┘                   └───────────────┘
```

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `type Status = string` | Literal union catches typos at compile time | `type Status = "idle" \| "loading" \| "success" \| "error"` |
| Using `enum` for string values in FE | Enums generate runtime JS; literal unions are erased entirely | String literal union |
| `type A = { x: number } & { x: string }` | `x` becomes `never` — the intersection is impossible | Never mix conflicting property types in intersection |
| `if (result.success) { ... }` without discriminant field | TypeScript needs a _literal_ discriminant to narrow correctly | Use `kind` or `success` boolean as discriminant |
| `type Maybe<T> = T \| null \| undefined` everywhere | Double nullability (`null \| undefined`) is usually a mistake | Use `strictNullChecks` + `T \| null` only where needed |

---

### 🎯 Interview Pattern

**Trigger**: "How do you model an API response in TypeScript?" or "What's a discriminated union?"

**Concept to activate**: Union types + discriminant field → TypeScript narrows each branch automatically.

**Opening sentence**: "I'd model the API response as a discriminated union — a union type where each branch has a literal `kind` or `success` field that TypeScript can use as a discriminant, so when I check `if (result.success)`, the compiler automatically knows `result.data` exists in the true branch and `result.error` exists in the false branch."

---

### Code: Unions, Intersections, Discriminated Unions

```typescript
// --- Union types ---
type StringOrNumber = string | number;
let id: StringOrNumber = "user-123";
id = 42; // also OK

// --- Literal types for state machines ---
type LoadState = "idle" | "loading" | "success" | "error";

// Enum alternative — avoid in FE (generates runtime code)
// const enum is erased but still has gotchas with isolatedModules
type Direction = "north" | "south" | "east" | "west";

// --- as const to derive literal union from object ---
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number]; // "GET" | "POST" | ...

// --- Discriminated union: API response ---
type ApiSuccess<T> = { success: true; data: T; statusCode: number };
type ApiError = { success: false; error: string; statusCode: number };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

function handleResponse<T>(response: ApiResponse<T>): T {
  if (response.success) {
    // TypeScript knows: response.data exists here
    return response.data;
  }
  // TypeScript knows: response.error exists here
  throw new Error(`API error ${response.statusCode}: ${response.error}`);
}

// --- Intersection types: composing shapes ---
type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt: Date | null };
type Auditable = { createdBy: string; updatedBy: string };

type Entity = Timestamped & SoftDeletable & Auditable;

interface UserRecord extends Entity {
  id: string;
  email: string;
}
// UserRecord must have ALL properties from all intersected types

// --- interface vs type: key differences ---
// interface: supports declaration merging (useful for extending lib types)
interface Window {
  myPlugin: () => void; // augments the global Window interface
}

// type: supports unions, intersections, mapped types
type ID = string | number; // interface cannot express this
type ReadonlyUser = Readonly<UserRecord>; // type alias for utility types
```

---

## Concept 3: Type Narrowing & Guards / Thu Hẹp Kiểu

### 🧠 Memory Hook

> **"Narrowing is a prosecutor presenting evidence — each check eliminates possibilities until only the truth remains."**

Bạn bắt đầu với "bị cáo là `string | number | null`". Sau `typeof x === 'string'`, bạn đã loại trừ `number` và `null`. Compiler chấp nhận vì bằng chứng đã rõ ràng.

### Why Does This Exist? / Tại Sao Tồn Tại?

**Why 1 — `unknown` and unions are useless without narrowing.**
You can receive `string | number | null` from a form input, but you can't call `.toUpperCase()` or `* 2` on `string | number | null`. Narrowing is the mechanism for _proving to the compiler_ which branch you're in. Không có narrowing, union type chỉ là mô tả — không có ích gì cho code thực.

**Why 2 — TypeScript tracks control flow.**
The compiler performs **Control Flow Analysis (CFA)**: it follows every `if`, `else`, `return`, `throw`, and `switch` branch and updates the type at each point. This is not just syntactic — TypeScript builds a full flow graph. The result is that after `if (x !== null) { ... }`, TypeScript knows `x` is non-null _inside that block_ without any additional annotation. Đây là lý do `strictNullChecks` phát huy tác dụng — compiler theo dõi từng nhánh.

**Why 3 — Exhaustiveness checking prevents missing cases.**
Using `never` at the end of a discriminated union switch means the compiler will error if you add a new union member but forget to handle it. This is the type system enforcing completeness on your business logic. Khi thêm variant mới vào union, compiler tự động báo lỗi chỗ bạn chưa handle — không cần test để tìm ra.

### Visual: Narrowing Flow / Luồng Thu Hẹp

```
function process(value: string | number | null) {

  START: value is (string | number | null)
        │
        ├── if (value === null)
        │         │
        │    TRUE branch: value is null
        │    FALSE branch: value is (string | number)  ← narrowed!
        │
        └── FALSE branch continues:
                  │
                  ├── if (typeof value === "string")
                  │         │
                  │    TRUE:  value is string   ← call .toUpperCase() ✅
                  │    FALSE: value is number   ← call * 2 ✅
                  │
                  └── (compiler proved all cases exhausted)
}

Custom type guard narrows across function boundary:

  function isApiError(e: unknown): e is ApiError {
    return typeof e === "object" && e !== null && "error" in e;
  }
              ↑
  The "is" predicate tells the compiler:
  "if this function returns true, narrow the argument to ApiError"
```

---

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `if (x)` to check for null | Truthiness narrowing also eliminates `""`, `0`, `false` — likely not what you want | `if (x !== null && x !== undefined)` |
| Custom guard that lies: `function isUser(x: any): x is User { return true; }` | The compiler trusts your predicate; a lying guard crashes at runtime | Actually check the shape |
| `switch (shape.kind)` without `default: assertNever(shape)` | Without it, adding a new union branch silently falls through | Always add exhaustive default |
| `as Type` instead of narrowing | `as` is a lie to the compiler; narrowing is proof | Use `typeof`, `instanceof`, `in`, or a type guard |
| Using `in` on a nullable value: `"foo" in maybeNull` | `in` throws at runtime on null/undefined | Null-check first: `maybeNull !== null && "foo" in maybeNull` |

---

### 🎯 Interview Pattern

**Trigger**: "How does TypeScript know the type inside an `if` block?" or "What is a type guard?"

**Concept to activate**: Control flow analysis + narrowing mechanisms (`typeof`, `instanceof`, `in`, truthiness, custom `is` predicates).

**Opening sentence**: "TypeScript performs Control Flow Analysis — it tracks the type of a variable through every branch, and narrows it based on runtime checks. So after `if (typeof x === 'string')`, TypeScript knows `x` is `string` inside that block. For complex shapes, you write a custom type guard — a function that returns `value is T` — to extend narrowing across function boundaries."

---

### Code: All Narrowing Patterns

```typescript
// --- 1. typeof narrowing ---
function format(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.trim(); // TypeScript knows: string here
}

// --- 2. truthiness narrowing (careful!) ---
function printIfDefined(name: string | null | undefined): void {
  // Truthiness eliminates null, undefined, "", 0, false
  // Use only when falsy values should all be treated the same
  if (name) {
    console.log(name.toUpperCase());
  }
}

// More precise: check specifically for null/undefined
function printIfPresent(name: string | null | undefined): void {
  if (name != null) {
    // != null catches both null and undefined
    console.log(name.toUpperCase()); // name is string here
  }
}

// --- 3. instanceof narrowing ---
function formatDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return new Date(value).toISOString();
}

// --- 4. in narrowing ---
type Cat = { meow: () => void; purr: () => void };
type Dog = { bark: () => void; fetch: () => void };
type Pet = Cat | Dog;

function interact(pet: Pet): void {
  if ("meow" in pet) {
    pet.meow(); // TypeScript knows: Cat here
  } else {
    pet.bark(); // TypeScript knows: Dog here
  }
}

// --- 5. Discriminated union narrowing ---
type LoadingState = { kind: "loading" };
type SuccessState<T> = { kind: "success"; data: T };
type ErrorState = { kind: "error"; error: Error; retryAfter?: number };
type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
  switch (state.kind) {
    case "loading":
      return "Loading...";
    case "success":
      return `Data: ${JSON.stringify(state.data)}`; // state.data is T here
    case "error":
      return `Error: ${state.error.message}`; // state.error is Error here
    default:
      // Exhaustiveness check: if you add a new union branch,
      // this line will produce a compile error
      return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

// --- 6. Custom type guard (is predicate) ---
interface ApiSuccessShape {
  success: true;
  data: unknown;
}

function isApiSuccess(response: unknown): response is ApiSuccessShape {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    (response as { success: unknown }).success === true
  );
}

function handleUnknownResponse(raw: unknown): void {
  if (isApiSuccess(raw)) {
    console.log(raw.data); // TypeScript knows: ApiSuccessShape here
  }
}

// --- 7. Assertion function (asserts predicate) ---
function assertDefined<T>(value: T | null | undefined, label: string): asserts value is T {
  if (value == null) {
    throw new Error(`Expected ${label} to be defined, got ${value}`);
  }
}

function processUser(userId: string | null): void {
  assertDefined(userId, "userId");
  // TypeScript knows: userId is string here (narrowed by assertion)
  console.log(userId.toUpperCase());
}
```

---

## 💡 Interview Questions / Câu Hỏi Phỏng Vấn

---

### Q1: What is the difference between `any` and `unknown`? / `any` và `unknown` khác nhau như thế nào? 🟢 Junior

**A:**

Both `any` and `unknown` accept values of any type. The critical difference is what you can _do_ with them afterward.

`any` is a **type system escape hatch**: you can call any method, access any property, pass it anywhere — the compiler performs zero checks. The problem is that this escape is **contagious**: a function that returns `any` infects its callers, and the entire chain loses type safety. This is why enabling `noImplicitAny` in a codebase often reveals hundreds of silent type holes.

`unknown` is the **safe top type**: it also accepts any value, but you _cannot_ perform any operations on it until you've proven its type through narrowing. It's the correct type for "I don't know what this is yet." Use `unknown` for: `JSON.parse` results, `catch` block errors (`catch (e: unknown)`), dynamic data from external APIs.

**Giải thích (VI):** `any` tắt hoàn toàn type checker — mọi thao tác đều được phép mà không cần kiểm tra. `unknown` buộc bạn phải chứng minh kiểu trước khi dùng. Khi migration JS sang TS, `unknown` là cách đúng để xử lý dữ liệu chưa biết kiểu; `any` chỉ trì hoãn lỗi sang runtime.

```typescript
// any: compiler trusts you blindly
function dangerousProcess(data: any): string {
  return data.name.toUpperCase(); // No error — but crashes if data has no .name
}

// unknown: compiler makes you prove it
function safeProcess(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as { name: unknown }).name === "string"
  ) {
    return (data as { name: string }).name.toUpperCase(); // Proven safe
  }
  throw new TypeError("Expected object with string name");
}

// catch blocks: always use unknown (TypeScript 4.0+)
try {
  JSON.parse("invalid");
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error(e.message); // e is Error here
  }
}
```

**Migration tip**: Run `grep -r ": any" src/` and replace each `any` with `unknown`. The compile errors you get are _real bugs_ that were previously silently ignored.

💡 **Interview Signal**

- ✅ Strong: Explains that `any` is contagious (infects return types and callers), demonstrates `unknown` + narrowing, mentions `noImplicitAny` and `catch (e: unknown)`.
- ❌ Weak: Says "both accept any value, but `unknown` is safer" without explaining _why_ it's safer or showing narrowing code.

---

### Q2: When should you use `interface` vs `type`? / Khi nào dùng `interface` vs `type`? 🟢 Junior

**A:**

Both `interface` and `type` can describe object shapes, and for most use cases they're interchangeable. The meaningful differences are:

**Use `interface` when:**

- You're describing the shape of a class, object, or component props that may need to be _extended_ by other interfaces (`extends`) — interfaces have cleaner error messages in this pattern.
- You need **declaration merging** — the ability for multiple `interface` declarations with the same name to merge. This is how you augment library types (e.g., extending `Express.Request` to add `user` property).

**Use `type` when:**

- You need to express a **union type** — `type ID = string | number` (interface cannot do this).
- You're creating **utility type compositions** — `type ReadonlyUser = Readonly<User>`.
- You need **mapped types** or **conditional types**.
- You're aliasing primitives, tuples, or function signatures.

**Team convention**: Many codebases standardize on `interface` for data shapes (objects/classes) and `type` for everything else. The TypeScript team itself follows this convention in the standard library.

**Giải thích (VI):** `interface` tốt hơn cho shape của object/class và khi cần declaration merging. `type` cần thiết khi bạn muốn union, mapped types, hay conditional types. Trong dự án thực tế, quy tắc đơn giản nhất: `interface` cho object shapes, `type` cho mọi thứ khác.

```typescript
// interface: extends cleanly, supports declaration merging
interface User {
  id: string;
  email: string;
}

interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

// Declaration merging: augment Express types
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// type: union (interface cannot do this)
type UserRole = "admin" | "moderator" | "viewer";
type ID = string | number;

// type: composition with utility types
type CreateUserDTO = Omit<User, "id"> & { password: string };

// type: function signatures
type EventHandler<T extends Event = Event> = (event: T) => void;
type ClickHandler = EventHandler<MouseEvent>;
```

💡 **Interview Signal**

- ✅ Strong: Knows declaration merging, can explain why you _must_ use `type` for unions, mentions team convention, demonstrates `extends` vs `&`.
- ❌ Weak: "They're basically the same, I always use `interface`." — misses declaration merging and union constraint entirely.

---

### Q3: Explain type narrowing with a real example. / Giải thích type narrowing qua ví dụ thực tế. 🟡 Mid

**A:**

Type narrowing is TypeScript's Control Flow Analysis in action. The compiler tracks the type of a variable through every branch of your code, and updates the inferred type based on runtime checks you perform.

**Real scenario**: A React hook that fetches user data and needs to handle three states — loading, success with data, and error with a message. Without narrowing, you'd have to use `as` casts or `any` everywhere. With discriminated unions and narrowing, the types are automatically proven in each branch.

**Giải thích (VI):** TypeScript theo dõi kiểu của biến qua từng nhánh điều khiển. Sau `if (state.kind === "error")`, compiler biết chắc `state.error` tồn tại — không cần cast. Đây là "control flow analysis" — compiler xây dựng đồ thị luồng và cập nhật kiểu tại mỗi điểm.

```typescript
// Discriminated union for async state
type AsyncData<T> =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: T; fetchedAt: Date }
  | { kind: "error"; error: Error; retryable: boolean };

interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
}

// Component using narrowing — no type assertions needed
function UserCard({ state }: { state: AsyncData<UserProfile> }) {
  // Each branch: TypeScript narrows the state type automatically

  if (state.kind === "idle") {
    return null; // state is { kind: "idle" }
  }

  if (state.kind === "loading") {
    return <LoadingSpinner />; // state is { kind: "loading" }
  }

  if (state.kind === "error") {
    // state is { kind: "error"; error: Error; retryable: boolean }
    return (
      <ErrorBoundary
        message={state.error.message}   // ✅ TypeScript knows .error exists
        showRetry={state.retryable}     // ✅ TypeScript knows .retryable exists
      />
    );
  }

  // state.kind === "success" — TypeScript knows this by exhaustion
  // state is { kind: "success"; data: UserProfile; fetchedAt: Date }
  return (
    <div>
      <img src={state.data.avatarUrl} alt={state.data.name} />  {/* ✅ */}
      <small>Fetched: {state.fetchedAt.toLocaleString()}</small> {/* ✅ */}
    </div>
  );
}

// Custom type guard for API response validation
function isUserProfile(data: unknown): data is UserProfile {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    typeof d.avatarUrl === "string"
  );
}

// Usage: narrowing unknown API response
async function fetchUserProfile(id: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${id}`);
  const raw: unknown = await response.json();

  if (!isUserProfile(raw)) {
    throw new TypeError(`Invalid user profile shape for id: ${id}`);
  }

  return raw; // TypeScript knows: UserProfile here
}
```

**Narrowing mechanisms summary**:

- `typeof x === "string"` — primitives
- `x instanceof Date` — class instances
- `"property" in x` — object shape
- `x !== null` — nullability
- `x.kind === "success"` — discriminant field (most powerful in practice)
- `function isT(x): x is T { ... }` — custom predicate (extends narrowing across function boundaries)

💡 **Interview Signal**

- ✅ Strong: Demonstrates discriminated unions with a real-world scenario (async state), mentions CFA by name, writes a correct custom type guard, and explains the exhaustiveness check pattern.
- ❌ Weak: Only mentions `typeof` and `instanceof`, doesn't show a discriminated union example, can't explain what `value is T` syntax does.

---

### Q4: What does `strictNullChecks` do and why should you enable it? / `strictNullChecks` làm gì và tại sao cần bật? 🟡 Mid

**A:**

Without `strictNullChecks`, `null` and `undefined` are **assignable to every type**. That means `string` secretly includes `null` and `undefined`, and you'll never get a compile error for `const len = user.name.length` — even when `user` could be null.

With `strictNullChecks: true` (included in `"strict": true`):

- `null` and `undefined` are only assignable to `unknown`, `any`, or explicitly typed as `T | null` / `T | undefined`.
- Every variable is non-null by default.
- The compiler forces you to handle the null/undefined case before using a value.

**Real impact**: At Shopee's migration (from the scenario above), 47 bugs were caught in the first week. These weren't hypothetical bugs — they were real null-pointer crashes that had been silently deployed to production. The `strictNullChecks` flag turns those runtime `TypeError: Cannot read properties of null` into compile-time errors with exact line numbers.

**Giải thích (VI):** Không có `strictNullChecks`, `null` và `undefined` "ẩn" trong mọi type — bạn có thể call method trên biến có thể null mà không có cảnh báo. Bật lên thì compiler bắt buộc bạn kiểm tra null trước khi dùng. Đây là lý do nhiều đội migrate sang TS báo cáo tìm được hàng chục bug thực sự trong tuần đầu.

```typescript
// WITHOUT strictNullChecks (dangerous)
// string secretly includes null | undefined
function getLength(s: string): number {
  return s.length; // No error — but crashes if s is null at runtime
}
getLength(null as any); // TypeScript won't warn you

// WITH strictNullChecks (safe)
function getLength(s: string): number {
  return s.length; // OK — string is guaranteed non-null
}
// getLength(null);  ← ERROR: Argument of type 'null' is not assignable to parameter of type 'string'

// How to handle nullable values:

// Option 1: Optional chaining
const user: { name: string } | null = getUser();
const upper = user?.name.toUpperCase(); // string | undefined — safe

// Option 2: Nullish coalescing
const displayName = user?.name ?? "Anonymous"; // string — always defined

// Option 3: Explicit guard
function displayUser(user: User | null): string {
  if (user === null) {
    return "Guest";
  }
  return user.name; // TypeScript knows user is User here
}

// Option 4: Non-null assertion (use sparingly — you're taking responsibility)
const form = document.getElementById("loginForm")!; // You assert it's not null
// Only use this when you KNOW the element exists and TypeScript can't verify it

// tsconfig.json
// {
//   "compilerOptions": {
//     "strict": true,  // enables strictNullChecks + 7 other checks
//     // OR enable individually:
//     "strictNullChecks": true
//   }
// }
```

**`strict` flag enables**: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`, `useUnknownInCatchVariables`.

**Migration strategy**: Enable `strict` in a new `tsconfig.strict.json` and run `tsc --project tsconfig.strict.json --noEmit`. Fix errors file by file. Don't try to fix everything at once.

💡 **Interview Signal**

- ✅ Strong: Can explain why `null` is dangerous without the flag (it's assignable to everything), demonstrates optional chaining vs non-null assertion vs explicit guard, mentions migration strategy.
- ❌ Weak: "It prevents null errors" without explaining the mechanism, or doesn't know that `strict: true` is a bundle of multiple flags.

---

### Q5: Design a type-safe API response handler using discriminated unions. / Thiết kế handler API response type-safe dùng discriminated unions. 🔴 Senior

**A:**

A production-grade API handler needs to: represent success and failure as distinct types, handle exhaustive error categories, survive runtime validation of unknown JSON, and surface correct types to callers so they can't forget to handle errors.

The pattern has four parts: (1) the discriminated union type, (2) a runtime validator (type guard), (3) the handler function with exhaustive narrowing, and (4) integration with error boundaries.

**Giải thích (VI):** Thiết kế này kết hợp bốn kỹ thuật: discriminated union để model tất cả trạng thái, custom type guard để validate runtime data từ API, exhaustive switch với `assertNever` để đảm bảo không bỏ sót case, và assertion function để enforce invariants. Đây là pattern TypeScript-native — không cần thư viện ngoài.

```typescript
// ─── 1. Type definitions ─────────────────────────────────────────────────────

type NetworkError = {
  kind: "network";
  message: string;
  retryable: boolean;
};

type ValidationError = {
  kind: "validation";
  fields: Record<string, string[]>; // field name → error messages
};

type AuthError = {
  kind: "auth";
  reason: "expired" | "invalid" | "insufficient_permissions";
};

type ServerError = {
  kind: "server";
  statusCode: number;
  message: string;
};

type ApiError = NetworkError | ValidationError | AuthError | ServerError;

type ApiResult<T> =
  | { ok: true; data: T; statusCode: number }
  | { ok: false; error: ApiError; statusCode: number };

// ─── 2. Runtime validator ─────────────────────────────────────────────────────

function isApiResult<T>(raw: unknown, validateData: (d: unknown) => d is T): raw is ApiResult<T> {
  if (typeof raw !== "object" || raw === null) return false;
  const r = raw as Record<string, unknown>;

  if (typeof r.statusCode !== "number") return false;

  if (r.ok === true) {
    return validateData(r.data);
  }

  if (r.ok === false && typeof r.error === "object" && r.error !== null) {
    const e = r.error as Record<string, unknown>;
    return (
      e.kind === "network" || e.kind === "validation" || e.kind === "auth" || e.kind === "server"
    );
  }

  return false;
}

// ─── 3. Exhaustive handler ────────────────────────────────────────────────────

interface HandleOptions<T> {
  onSuccess: (data: T, statusCode: number) => void;
  onNetworkError: (error: NetworkError) => void;
  onValidationError: (error: ValidationError) => void;
  onAuthError: (error: AuthError) => void;
  onServerError: (error: ServerError) => void;
}

function handleApiResult<T>(result: ApiResult<T>, options: HandleOptions<T>): void {
  if (result.ok) {
    options.onSuccess(result.data, result.statusCode);
    return;
  }

  // TypeScript narrows: result.error is ApiError here
  const error = result.error;

  switch (error.kind) {
    case "network":
      options.onNetworkError(error); // error is NetworkError
      break;
    case "validation":
      options.onValidationError(error); // error is ValidationError
      break;
    case "auth":
      options.onAuthError(error); // error is AuthError
      break;
    case "server":
      options.onServerError(error); // error is ServerError
      break;
    default:
      // If you add a new ApiError variant and forget to handle it here,
      // this line produces a compile error: "Type 'X' is not assignable to type 'never'"
      assertNever(error);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled API error kind: ${JSON.stringify(value)}`);
}

// ─── 4. Fetch wrapper ─────────────────────────────────────────────────────────

async function apiFetch<T>(
  url: string,
  validateData: (d: unknown) => d is T,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url);
    const raw: unknown = await response.json();

    if (!isApiResult(raw, validateData)) {
      return {
        ok: false,
        statusCode: response.status,
        error: {
          kind: "server",
          statusCode: response.status,
          message: "Response did not match expected shape",
        },
      };
    }

    return raw;
  } catch (e: unknown) {
    return {
      ok: false,
      statusCode: 0,
      error: {
        kind: "network",
        message: e instanceof Error ? e.message : "Unknown network error",
        retryable: true,
      },
    };
  }
}

// ─── 5. Usage ─────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

function isUserProfile(d: unknown): d is UserProfile {
  if (typeof d !== "object" || d === null) return false;
  const u = d as Record<string, unknown>;
  return typeof u.id === "string" && typeof u.name === "string" && typeof u.email === "string";
}

async function loadUser(id: string): Promise<void> {
  const result = await apiFetch<UserProfile>(`/api/users/${id}`, isUserProfile);

  handleApiResult(result, {
    onSuccess: (user) => {
      console.log(`Welcome, ${user.name}!`); // user is UserProfile ✅
    },
    onNetworkError: (err) => {
      if (err.retryable) scheduleRetry(); // err.retryable is boolean ✅
    },
    onValidationError: (err) => {
      showFieldErrors(err.fields); // err.fields is Record<string,string[]> ✅
    },
    onAuthError: (err) => {
      if (err.reason === "expired") refreshToken();
    },
    onServerError: (err) => {
      if (err.statusCode >= 500) reportToSentry(err.message);
    },
  });
}

declare function scheduleRetry(): void;
declare function showFieldErrors(fields: Record<string, string[]>): void;
declare function refreshToken(): void;
declare function reportToSentry(msg: string): void;
```

**Why this design wins in interviews:**

- Zero `as` casts in business logic — all safety comes from narrowing
- Adding a new `ApiError` variant causes a compile error until handled
- Runtime validation is separated from type logic — easy to swap in Zod/Yup
- The pattern scales: same structure works for WebSocket messages, form state, Redux actions

💡 **Interview Signal**

- ✅ Strong: Designs the full discriminated union with multiple error variants, implements runtime validation separately from the type predicate, uses `assertNever` for exhaustive checking, explains _why_ this beats `try/catch` with `as` casts. Discusses trade-off of bringing in Zod vs hand-written guards.
- ❌ Weak: Creates a simple `{ success: boolean; data?: T; error?: string }` union without discriminants or exhaustive handling, uses `as` to satisfy types, can't articulate why exhaustiveness matters.

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                 | Difficulty | Core Concept          | Key Signal                                                |
| --- | ------------------------------------------------------- | ---------- | --------------------- | --------------------------------------------------------- |
| 1   | Sự khác biệt giữa `any` và `unknown`?                   | 🟢 Junior  | Type safety           | Biết `unknown` yêu cầu narrow trước khi dùng              |
| 2   | Khi nào dùng `interface` vs `type`?                     | 🟢 Junior  | Type system           | Declaration merging vs union/intersection types           |
| 3   | Giải thích type narrowing qua ví dụ thực tế             | 🟡 Mid     | Control flow analysis | Dùng nhiều kỹ thuật narrowing + exhaustiveness            |
| 4   | `strictNullChecks` làm gì và tại sao cần bật?           | 🟡 Mid     | Null safety           | Hiểu null propagation và tác động thực tế                 |
| 5   | Thiết kế type-safe API handler với discriminated unions | 🔴 Senior  | Type design           | Full union + `assertNever` + runtime validation tách biệt |

---

## ⚡ Cold Call Simulation / Mô Phỏng Câu Hỏi Nhanh

**Question**: "In 30 seconds — what is TypeScript's structural type system, and how does narrowing work?"

**30-second answer (4 sentences)**:

"TypeScript uses **structural typing**, which means type compatibility is decided by shape, not by name — if an object has all the required properties, it satisfies the type, regardless of what class or interface it was declared with. On top of that, TypeScript performs **Control Flow Analysis**, tracking the type of every variable through each branch of your code. When you write `if (typeof x === 'string')`, the compiler narrows `x` from `string | number` to just `string` inside that block, allowing string-only methods. For complex shapes, you write a **custom type guard** — a function returning `value is T` — to extend this narrowing across function boundaries, and combine it with **discriminated unions** to model all states of your data so the compiler can verify you handle every case."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                          |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Giải thích sự khác biệt giữa `any` và `unknown`. Liệt kê 5 cơ chế narrowing trong TypeScript (không kể `as`).                    |
| 2   | 🎨 Visual      | Vẽ cây phân cấp type của TypeScript: `unknown` ở trên cùng, `never` ở dưới cùng. Primitives, `null`, `undefined` nằm ở đâu?      |
| 3   | 🛠️ Application | Viết type guard validate `unknown` từ `JSON.parse()` thành `{ id: string; amount: number; currency: "USD" \| "VND" }`.           |
| 4   | 🐛 Debug       | `function isUser(x: unknown): x is User { return x !== null; }` — type guard này nói dối compiler khi nào? Vấn đề thực sự là gì? |
| 5   | 🎓 Teach       | Giải thích `strictNullChecks` cho JavaScript developer chưa dùng TypeScript — tại sao nó quan trọng?                             |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `any` tắt type-checking; `unknown` yêu cầu kiểm tra trước khi dùng. 5 cơ chế narrowing: `typeof`, `instanceof`, `in`, equality check, truthy check.            |
| 2   | Top: `unknown` → `any` → `object/string/number/boolean/...` → literal types → `never` (bottom). `null` và `undefined` là leaves khi bật `strictNullChecks`.    |
| 3   | Kiểm tra `typeof x === 'object'`, `x !== null`, `'id' in x`, rồi type-check từng field. Dùng `x is Type` làm return type của guard.                            |
| 4   | `x !== null` không verify `x` là `User` shape — nó có thể là object bất kỳ. Type guard phải kiểm tra đủ fields: `'id' in x && typeof x.id === 'string' && ...` |
| 5   | JS không phân biệt `null`/`undefined`/value → bugs khó tìm. `strictNullChecks` bắt lỗi "có thể null" tại compile time, buộc xử lý trước khi dùng.              |

> 🎯 **Feynman Prompt:** Giải thích tại sao discriminated union tốt hơn `{ success: boolean; data?: T; error?: string }` cho API response — dùng ví dụ "hộp thư với đèn trạng thái" không dùng từ kỹ thuật.

---

🔁 **Spaced Repetition Schedule**: Review this file on Day 1 → Day 3 → Day 7 → Day 14 → Day 30. For the Q&A section, cover the answers and test recall. For the Retrieval Self-Check, do it without opening the file.

---

## 📎 Cross-References / Liên Kết Chéo

- [Advanced Types](./02-advanced-types.md) — Mapped types, conditional types, template literals (built on concepts here)
- [Generics](./03-generics-deep-dive.md) — Generic constraints use narrowing; `extends` in generics mirrors structural typing
- [TypeScript Comprehensive](./04-typescript-comprehensive.md) — Structural typing deep dive, module augmentation, declaration files
- [Type Inference Theory](./05-type-inference-theory.md) — How TypeScript infers types under the hood
