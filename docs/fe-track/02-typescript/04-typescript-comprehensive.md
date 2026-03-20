# TypeScript Comprehensive Guide / Hướng Dẫn TypeScript Toàn Diện

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[← Previous: Generics Deep Dive](./03-generics-deep-dive.md) | [Next: React + TS](./05-react-typescript.md) | [Related: Inference Theory](./05-type-inference-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Momo payment SDK integration:** Team adds `requestId?: string` to Axios config for distributed tracing. Without TypeScript: each team member adds it differently or forgets. With module augmentation (`declare module 'axios'`) + declaration merging: `requestId` becomes part of the type system — autocomplete, compile-time checks, no breaking the Axios package. The tracing field is enforced across the entire codebase at zero runtime cost.

**Bài học:** TypeScript's advanced type features (mapped types, conditional types, module augmentation, template literals) aren't just syntax — they're tools for encoding business rules, API contracts, and architectural constraints into the type system. Companies like Shopee use these to enforce correctness across 100+ engineer codebases.

## What & Why / Cái Gì & Tại Sao

**Structural typing** vs nominal typing: Java/C# reject `class A {}; class B {}; B b = new A()` even if they have identical fields. TypeScript accepts it if the shapes match — this aligns with JavaScript's duck typing. The cost: you need **excess property checking** to catch typos in object literals (TypeScript's exception to structural typing for literals).

**Mapped/conditional/template literal types** are TypeScript's compile-time programming. They let you derive types from other types systematically — instead of defining 50 `onXxx` handler names manually, `` type Handler = `on${Capitalize<EventName>}` `` generates them all. This is why TypeScript can type React's event system and ORMs without manual repetition.

## Concept Map / Bản Đồ Khái Niệm

```
[TypeScript Type System — Comprehensive]
        │
        ├── Structural Typing — "if it quacks like a duck"
        │       └── Exception: Excess Property Checking on object literals
        │
        ├── Type-Level Programming
        │       ├── Mapped Types: { [K in keyof T]: ... }  → transform all properties
        │       ├── Conditional Types: T extends U ? A : B  → type-level if/else
        │       └── Template Literal: `on${Capitalize<K>}`  → string type generation
        │
        ├── Declaration Merging + Module Augmentation
        │       ├── interface merging: add fields to existing interface across files
        │       └── declare module 'x': add types to third-party packages
        │
        └── Project Scale
                ├── Project References: split monorepo into incremental TS builds
                └── Namespace: legacy global typing (prefer ES modules)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Structural Typing + Excess Property Checking

**🧠 Memory Hook:** "**TypeScript checks shape, not name. But object literals get extra scrutiny — excess property checking catches typos. The fix: assign to a variable first or use a type assertion.**"

**Why does this exist? / Tại sao tồn tại?**

- Why structural over nominal? JavaScript has no classes in the nominal sense — everything is duck typing. Structural typing aligns with how JS actually works
- Why does excess property checking only apply to object literals? Passing an object literal to a typed variable with extra fields is almost always a typo. But a variable might legitimately have extra fields from a broader source, so structural compatibility applies there
- Why does this matter for API design? Any object with the required fields is assignable — enables "programming to interfaces" naturally

**Visual — Structural vs Excess Property Checking:**

```typescript
interface User { id: string; name: string }

// Structural typing — variable reference: works (shape compatible)
const richUser = { id: 'u1', name: 'Nhi', role: 'admin' }
const u: User = richUser  // ✅ richUser has more fields but satisfies User shape

// Excess property checking — direct literal: fails
const u2: User = { id: 'u1', name: 'Nhi', role: 'admin' }
// ❌ Error: Object literal may only specify known properties
// TypeScript: "you typed 'role' — was that intentional?"

// Bypass: intermediate variable OR type assertion
const u3: User = richUser                // ✅ variable bypass
const u4 = { id: 'u1', role: 'admin' } as User  // ← assertion (loses safety)
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Confused why variable passes but inline literal fails | Excess property checking only applies to object literal expressions |
| `as any` to bypass every type error | Use `as SpecificType` or intermediate variable |
| Thinking TypeScript is nominal ("class A is not B") | TypeScript is structural — same shape = assignable regardless of name |

**🎯 Interview Pattern:**
- **Trigger**: "TypeScript says object literal has unknown property" / "structural vs nominal"
- **Opening**: "TypeScript uses structural typing — if the shape matches, types are compatible regardless of name. The exception is object literals: excess property checking catches typos at literal-creation time. If you need to bypass: assign to an intermediate variable (structural check still applies) or use a type assertion..."

**🔑 Knowledge Chain:**
- **Prereq**: TypeScript basics, interfaces vs types
- **Enables**: API contract design, understanding `extends` behavior with structural types

---

### 2. Mapped Types + Conditional Types + Template Literals

**🧠 Memory Hook:** "**Mapped type = `for K in keyof T` over properties. Conditional type = `T extends U ? A : B` type-level if/else. Template literal = string interpolation at type level.**"

**Why does this exist? / Tại sao tồn tại?**

- Why mapped types? When you have a type and need a transformed version (all optional, all readonly), manually duplicating creates drift. Mapped types derive the transformation programmatically
- Why conditional types? Type relationships can be conditional: "if T is an array, its element type; otherwise T itself". This is type-level branching — essential for `Awaited<T>`, `ReturnType<T>`
- Why template literal types? React, Express, many libraries use string patterns (`onXxx`). Template literal types let TypeScript validate these patterns at compile time

**Visual — All Three Together:**

```typescript
// 1. Mapped Type
type Optional<T> = { [K in keyof T]?: T[K] }
type Flags<T> = { [K in keyof T]: boolean }

// 2. Conditional Type with infer
type ElementType<T> = T extends (infer U)[] ? U : never
type A = ElementType<string[]>   // string
type B = ElementType<number>     // never

// Built-in uses conditional types:
type NonNullable<T> = T extends null | undefined ? never : T
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T  // recursive!

// 3. Template Literal
type Event = 'click' | 'focus' | 'blur'
type Handler = `on${Capitalize<Event>}`  // 'onClick' | 'onFocus' | 'onBlur'

// All three combined — derive typed event handlers:
type ComponentEvents = { click: MouseEvent; focus: FocusEvent }
type EventHandlers = {
  [K in keyof ComponentEvents as `on${Capitalize<string & K>}`]:
    (e: ComponentEvents[K]) => void
}
// Result: { onClick: (e: MouseEvent) => void; onFocus: (e: FocusEvent) => void }
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| Manually writing all handler names | Template literal: `` `on${Capitalize<EventName>}` `` |
| `T extends any[]` to get element type | `T extends (infer U)[]` — use `infer` to capture |
| `Partial<T>` for API responses with optional fields | Only use `Partial` for update payloads; for responses, type optional fields explicitly |
| Forgetting conditional types are distributive | `string \| number extends string` → distributes over each member |

**🎯 Interview Pattern:**
- **Trigger**: "utility types" / "derive event handlers" / "make all fields optional"
- **Opening**: "Mapped types transform all properties of a type systematically. Conditional types add type-level branching with `extends ? :`. Template literal types extend this to string patterns. Together they power TypeScript's built-in utility types and let you encode complex API contracts..."

**🔑 Knowledge Chain:**
- **Prereq**: Generics, `keyof`, `typeof`, `infer`
- **Enables**: Custom utility types, typed event systems, API client typing

---

### 3. Declaration Merging + Module Augmentation

**🧠 Memory Hook:** "**Declaration merging = interfaces are open: multiple `interface Foo` declarations merge. Module augmentation = `declare module 'lib'` + an import: adds types to a package you don't own.**"

**Why does this exist? / Tại sao tồn tại?**

- Why can interfaces merge but not types? `interface` is designed for extension (open type). `type` is an alias for a closed shape. This allows libraries to ship base interfaces that consumers extend
- Why module augmentation? npm packages have fixed type definitions. Adding `requestId` to Axios config requires augmentation: open the module's types without touching the package source
- The critical gotcha: the `.d.ts` file must have at least one `import` or `export` to be a **module** — otherwise `declare module 'x'` is treated as an ambient declaration that overwrites the package types entirely

**Visual — Declaration Merging + Module Augmentation:**

```typescript
// === Declaration Merging ===
interface User { id: string }
interface User { name: string }  // merges — User now has id + name ✅

// === Module Augmentation ===
// src/types/axios-ext.d.ts:
import 'axios'  // ← REQUIRED: makes this a module (not ambient) augmentation

declare module 'axios' {
  interface AxiosRequestConfig {
    requestId?: string
  }
}

// Now works everywhere:
axios.get('/api/data', { requestId: generateId() })  // ✅ TypeScript knows this

// === Express Request augmentation ===
// src/types/express-ext.d.ts:
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser  // req.user is now typed in all middleware
    }
  }
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `declare module 'axios'` without any import/export | Add `import 'axios'` to make it a module augmentation (not ambient override) |
| Merging `type` aliases: `type Foo = ...; type Foo = ...` | Use `interface` for mergeable types; `type` aliases cannot merge |
| Augmented types not recognized by TypeScript | Include augmentation `.d.ts` in `tsconfig.json` `include` or `typeRoots` |

**🎯 Interview Pattern:**
- **Trigger**: "extend third-party types" / "add field to Express Request" / "augment Axios"
- **Opening**: "For adding properties to third-party types, I use module augmentation. I create a `.d.ts` file with an import of the target package (to scope it as module augmentation, not an ambient re-declaration), then use `declare module 'axios'` to merge new fields into the existing interface. Zero runtime cost..."

**🔑 Knowledge Chain:**
- **Prereq**: Declaration files, TypeScript module resolution
- **Enables**: Express request user typing, Axios config extension, monorepo type sharing

---

## Reference Theory / Tài Liệu Tham Khảo

## Structural Typing

**English:** TypeScript compares shapes (properties/methods), not nominal type names.

**Giải thích (VI):** TS kiểm tra tương thích theo cấu trúc object.

**Ví dụ (TypeScript):**
```ts
interface Point2D { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const ok: Point2D = p; // compatible by shape
```

## Excess Property Checking

**English:** Object literals receive stricter checks to catch misspelled fields.

**Giải thích (VI):** Khi truyền object literal, TS kiểm tra thuộc tính dư để bắt lỗi chính tả.

**Ví dụ (TypeScript):**
```ts
interface User { id: string; name: string }
const u: User = { id: 'u1', name: 'Ann', role: 'admin' }; // error on literal
```

## Index Signatures

**English:** Model dynamic keys with explicit value constraints and optional readonly.

**Giải thích (VI):** Dùng index signature cho map động nhưng vẫn ràng buộc value type.

**Ví dụ (TypeScript):**
```ts
type Scores = { [subject: string]: number };
const scores: Scores = { math: 9, cs: 10 };
```

## Mapped Types

**English:** Transform property modifiers and value types systematically.

**Giải thích (VI):** Mapped type cho phép biến đổi toàn bộ thuộc tính theo quy tắc.

**Ví dụ (TypeScript):**
```ts
type Flags<T> = { [K in keyof T]: boolean };
type UserFlags = Flags<{ id: string; active: boolean }>;
```

## Conditional Types

**English:** Encode type-level branching with `extends ? :`.

**Giải thích (VI):** Conditional type mô hình hóa if/else ở tầng kiểu.

**Ví dụ (TypeScript):**
```ts
type ElementType<T> = T extends (infer U)[] ? U : T;
type A = ElementType<string[]>; // string
```

## Template Literal Types

**English:** Generate string unions and infer segments from text patterns.

**Giải thích (VI):** Template literal type tạo union chuỗi và tách thông tin từ pattern.

**Ví dụ (TypeScript):**
```ts
type Event = 'click' | 'focus';
type HandlerName = `on${Capitalize<Event>}`; // onClick | onFocus
```

## Declaration Merging

**English:** Interfaces and namespaces can merge declarations in same scope.

**Giải thích (VI):** Declaration merging giúp mở rộng định nghĩa theo nhiều file.

**Ví dụ (TypeScript):**
```ts
interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 10, height: 20 };
```

## Module Augmentation

**English:** Augment third-party module types safely without forking package.

**Giải thích (VI):** Module augmentation thêm type cho thư viện ngoài một cách an toàn.

**Ví dụ (TypeScript):**
```ts
declare module 'axios' {
  interface AxiosRequestConfig { requestId?: string }
}
```

## Namespace vs Modules

**English:** Prefer ES modules; namespaces mostly for legacy/global typing.

**Giải thích (VI):** Ưu tiên module ES; namespace chủ yếu cho legacy.

**Ví dụ (TypeScript):**
```ts
// module preferred
export function add(a: number, b: number){ return a+b }
```

## Project References

**English:** Split monorepo into incremental TS projects for faster builds.

**Giải thích (VI):** Project references tăng tốc build cho codebase lớn.

**Ví dụ (TypeScript):**
```ts
// tsconfig.json
{
  "files": [],
  "references": [{ "path": "../shared" }]
}
```

## Cross References / Tham Chiếu Liên Quan

- [TypeScript Basics](./01-typescript-basics.md)
- [Advanced Types](./02-advanced-types.md)
- [React + TypeScript](./05-react-typescript.md)
- [Modern Features](./06-typescript-modern-features.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟡 [Mid] Q1: Why does TypeScript reject `{ id: 'u1', role: 'admin' }` when assigned to `User`, but accepts the same object via a variable? / Tại sao object literal bị reject nhưng variable lại pass?

**A:** This is **excess property checking** — TypeScript's exception to structural typing. Structural typing says: "if a value has all required fields, it's compatible." That rule still applies for variables.

But **object literals** receive extra scrutiny: TypeScript assumes that if you're writing a literal `{ id: 'u1', role: 'admin' }` and assigning it to `User` which has no `role` field, you likely made a typo (`role` vs `name`). So TypeScript flags it — "Object literal may only specify known properties."

**Fix options:**
1. Assign to an intermediate variable first (structural check only — extra field is accepted)
2. Use type assertion `as User` (unsafe — skips the check)
3. Define `role` in the interface

This is why passing API response objects to typed parameters works fine (they come from variables), but inline test fixtures often trigger this error.

**Tiếng Việt:** Excess property checking chỉ áp dụng cho object literal trực tiếp. TypeScript giả định literal có field dư là typo. Variable reference dùng structural typing — có đủ required fields là pass. Fix: gán qua biến trung gian hoặc type assertion.

💡 **Interview Signal:**
- ✅ Strong: Explains WHY literals are special (typo detection intent); correctly says structural typing still validates required fields; gives the variable-bypass workaround
- ❌ Weak: "TypeScript is strict about object types" — doesn't explain the structural vs excess-property distinction

---

### 🟡 [Mid] Q2: Implement a `DeepReadonly<T>` type that makes all nested properties readonly. / Implement `DeepReadonly<T>` cho nested objects.

**A:** This requires combining mapped types + conditional types recursively:

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

// Usage:
type Config = { server: { host: string; port: number }; debug: boolean }
type ReadonlyConfig = DeepReadonly<Config>
// Result: { readonly server: { readonly host: string; readonly port: number }; readonly debug: boolean }

// Explanation:
// [K in keyof T] — mapped type: iterate all properties
// readonly — add readonly modifier to each
// T[K] extends object ? DeepReadonly<T[K]> : T[K] — conditional: recurse into objects, leaf types stay
```

**Caveat:** This treats arrays as objects — `DeepReadonly<string[]>` becomes `DeepReadonly<{[n: number]: string}>`. For arrays, add: `T extends (infer U)[] ? ReadonlyArray<DeepReadonly<U>> : ...`

**Why interviewers ask this:** It tests whether you understand: (1) mapped type syntax, (2) conditional type with `extends`, (3) recursion in the type system, (4) edge cases.

**Tiếng Việt:** `DeepReadonly<T>` dùng mapped type (`[K in keyof T]`) + conditional type (`T[K] extends object ? recurse : leaf`). Áp `readonly` ở mỗi level. Caveat: arrays là objects trong TypeScript — cần xử lý riêng nếu cần deeply readonly arrays.

💡 **Interview Signal:**
- ✅ Strong: Correctly combines mapped + conditional + recursion; mentions the array edge case; explains each part
- ❌ Weak: `type DeepReadonly<T> = Readonly<T>` — only one level deep, misses the recursive requirement

---

### 🔴 [Senior] Q3: How do you add a `user` property to Express's `Request` type without modifying the `@types/express` package? / Thêm `user` vào Express Request type mà không sửa package?

**A:** Use **module augmentation** via declaration merging:

```typescript
// src/types/express.d.ts
// IMPORTANT: must have an import/export to be treated as a module (not ambient):
export {}  // ← makes this a module file

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser  // merged into Express.Request
    }
  }
}

// Type definition:
interface AuthenticatedUser {
  id: string
  email: string
  roles: string[]
}

// Now in middleware — TypeScript knows req.user:
app.use((req, res, next) => {
  req.user = verifyToken(req.headers.authorization)  // ✅ type-safe
  next()
})
```

**Key requirement:** The `.d.ts` file must be a **module** (has at least one `import` or `export`). Without this, `declare global` in a script-mode file would overwrite or conflict with the original types.

**Include in tsconfig:**
```json
{ "include": ["src/**/*.ts", "src/types/*.d.ts"] }
```

**Tiếng Việt:** Dùng module augmentation: tạo `src/types/express.d.ts` với `export {}` (để là module file), sau đó `declare global { namespace Express { interface Request {...} } }`. TypeScript merge interface này với `@types/express`. Phải include file trong tsconfig. Zero runtime cost.

💡 **Interview Signal:**
- ✅ Strong: Knows the `export {}` / import requirement for module vs ambient; uses `declare global` + `namespace Express`; mentions tsconfig include
- ❌ Weak: "Edit the @types/express node_modules file" — modifies a package that gets wiped on `npm install`; or "use `as any`" — loses type safety

---

### 🔴 [Senior] Q4: What is the difference between `interface` and `type` in TypeScript? When does the choice matter? / Khi nào nên dùng interface vs type?

**A:** Both define object shapes, but have key differences:

| Feature | `interface` | `type` |
|---|---|---|
| Declaration merging | ✅ Yes — multiple `interface Foo` merge | ❌ No — duplicate `type Foo` is an error |
| `extends` | ✅ Can extend other interfaces + types | ✅ Can intersect with `&` |
| Computed properties | ❌ No | ✅ Yes: `type K = { [key in Union]: T }` |
| Primitives / unions | ❌ Objects only | ✅ `type ID = string \| number` |
| Error messages | Better (shows interface name) | Can be verbose (shows expanded type) |

**When the choice matters:**
1. **Library APIs and extensibility:** Use `interface` — consumers can augment with declaration merging
2. **Union/intersection types:** Must use `type` — `interface` can't represent `string | number`
3. **Mapped/conditional types:** Must use `type`
4. **Generic helpers:** Either works, but `type` is more flexible

**Practical rule:** Use `interface` for object shapes that might need extension (props, API response shapes). Use `type` for everything else (unions, computed types, aliases).

**Tiếng Việt:** `interface` hỗ trợ declaration merging — nhiều khai báo cùng tên sẽ merge. `type` không merge được nhưng hỗ trợ union/intersection/mapped types. Dùng `interface` cho object shapes có thể extend. Dùng `type` cho union, aliases, computed types.

💡 **Interview Signal:**
- ✅ Strong: Mentions declaration merging as THE key interface advantage; correctly says `type` is required for unions; gives the practical "library vs internal code" heuristic
- ❌ Weak: "They're mostly the same, I use type for everything" — misses declaration merging which is critical for library design

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Key Insight |
|---|-------|-------------|
| Q1 | Excess property checking | Literals get extra scrutiny; variables use structural typing only |
| Q2 | `DeepReadonly<T>` | Mapped + conditional + recursive = type-level programming |
| Q3 | Module augmentation | `export {}` + `declare global` + tsconfig include = type-safe Express req.user |
| Q4 | interface vs type | Declaration merging = interface's key advantage; unions require type |

---

## ⚡ Cold Call Simulation

**Q: "A junior dev asks: I added `requestId` to my Axios config object but TypeScript complains it doesn't exist. How do I add this field globally without modifying Axios source?"**

**30-second answer:**
"Create a declaration file — `src/types/axios.d.ts`. Add `export {}` at the top to make it a module. Then write `declare module 'axios'` with an interface augmentation: `interface AxiosRequestConfig { requestId?: string }`. TypeScript uses declaration merging — it merges your augmentation with Axios's existing types. Add the file to tsconfig `include`. Now every call to `axios.get('/url', { requestId: ... })` is type-safe. Zero runtime cost — it's purely a compile-time addition."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**
1. Why do TypeScript object literals fail excess property checking when a variable of the same shape passes?
2. Write `Readonly<T>` using a mapped type (without using the built-in).
3. What does `T extends (infer U)[] ? U : never` compute?
4. What is the critical requirement for module augmentation (`declare module 'axios'`) to work without overwriting existing types?
5. Name 2 things `type` can do that `interface` cannot.

**Visual:**
- Draw the excess property checking rule: when does it apply vs when does structural typing apply?
- Draw declaration merging: two `interface User` declarations + what the merged type looks like.

**Application:**
- You need a `RequireAtLeastOne<T>` type — an object where at least one of T's fields must be present. Sketch the approach using mapped + conditional types.

**Debug:**
- Your `declare module 'express'` augmentation doesn't work — TypeScript still shows `req.user` as `undefined`. What are the likely causes?

**Teach:**
- Explain structural typing to a Java developer: "TypeScript doesn't care what you called the type. If your object has `id: string` and `name: string`, it's a valid `User` — even if you created it as a `Visitor`. TypeScript is about shape, not name."

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: excess property checking rule, module augmentation `export {}` requirement, interface vs type for declaration merging.

---

## Connections / Liên Kết

- **Prereqs**: [02-advanced-types.md](./02-advanced-types.md), [03-generics-deep-dive.md](./03-generics-deep-dive.md)
- **See also**: [05-type-inference-theory.md](./05-type-inference-theory.md), [06-typescript-modern-features.md](./06-typescript-modern-features.md)
- **React**: [05-react-typescript.md](./05-react-typescript.md) — module augmentation is used heavily in React component libraries


[← Previous: Generics Deep Dive](./03-generics-deep-dive.md) | [Next: React + TypeScript →](./05-react-typescript.md) | [Back to Table of Contents](../../00-table-of-contents.md)
