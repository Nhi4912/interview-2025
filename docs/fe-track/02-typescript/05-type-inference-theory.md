# Type Inference Theory / Lý Thuyết Suy Luận Kiểu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[← Related: TypeScript Basics](./01-typescript-basics.md) | [Related: Comprehensive Guide](./04-typescript-comprehensive.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**React config object type loss:** Developer writes `const config = { env: 'production', maxRetries: 3 }`. TypeScript infers `env: string` — but the code needs `env: 'development' | 'staging' | 'production'`. Switch on `config.env` doesn't narrow to literals — just `string`. Fix: `as const` freezes to literal `'production'`. Or use `satisfies`: validates against `Config` shape while keeping literal `'production'` for downstream use.

**Bài học:** Type inference is invisible when it works and mystifying when it doesn't. Understanding widening (why `let x = 'a'` gives `string`), narrowing (how TypeScript tracks types through conditions), and `satisfies` vs `as const` turns confusing TypeScript errors into predictable behavior.

## What & Why / Cái Gì & Tại Sao

**Why inference exists:** Requiring type annotations everywhere is Java-style verbose. TypeScript infers types from initializers, contextual usage, return types, and control flow — maximum type safety with minimum annotations.

**The widening rule:** `let` declarations widen literals to base type because let variables can change. `const` preserves the literal because the value can't change. Object properties widen even in `const` objects because properties can be reassigned. This is intentional — but causes surprises.

## Concept Map / Bản Đồ Khái Niệm

```
[Type Inference Concepts]
        │
        ├── Widening vs Narrowing
        │       ├── let x = 'dark' → string (widened — can change)
        │       ├── const x = 'dark' → 'dark' (literal — can't change)
        │       └── Guards narrow: typeof/instanceof/in/discriminant → TypeScript tracks per branch
        │
        ├── as const + satisfies
        │       ├── as const: freeze to readonly literal types (no shape validation)
        │       └── satisfies: validate shape WITHOUT widening (keeps precise literals)
        │
        ├── Contextual Typing
        │       └── [1,2,3].map(n => n.toFixed()) — n inferred as number from array context
        │
        └── Variance
                ├── Covariant: return types (more specific = assignable)
                └── Contravariant: parameters (wider input = assignable for callbacks)
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Widening vs Narrowing

**🧠 Memory Hook:** "**`let` widens (can change → base type). `const` keeps literal (can't change). Guards narrow: TypeScript tracks which union member you're in after each condition.**"

**Why does this exist? / Tại sao tồn tại?**

- Why does `let` widen? A `let` variable can be reassigned — `let mode = 'dark'` could later be `mode = 'light'`. TypeScript infers `string` to accommodate all possible reassignments
- Why does `const` preserve literal? `const mode = 'dark'` can never be reassigned — the value is always `'dark'`. TypeScript safely infers the narrower literal type
- Why does control flow narrowing matter? Without it, `if (typeof x === 'string') x.toUpperCase()` would be unsafe. With CFA, TypeScript knows `x` is `string` inside the branch — no assertion needed

**Visual — Widening and Narrowing:**

```typescript
// Widening with let
let mode = 'dark'   // type: string (widened)

// Literal preserved with const
const theme = 'dark'  // type: 'dark'

// Object properties WIDEN by default
const obj = { mode: 'dark' }  // type: { mode: string } ← widened!
obj.mode = 'light'  // allowed — mode is string

// Fix: as const
const obj2 = { mode: 'dark' } as const  // { readonly mode: 'dark' }

// Narrowing through conditions
function process(value: string | number | null) {
  if (value === null) return                    // value: null here
  if (typeof value === 'string') {
    return value.toUpperCase()                  // value: string here
  }
  return value.toFixed(2)                       // value: number here
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `let status = 'idle'` expecting literal type in union | `const status = 'idle'` or `let status: Status = 'idle'` |
| `const obj = { env: 'prod' }` expecting `env` as literal | `as const` or explicit annotation with literal type |
| Stored guard result: `const isStr = typeof x === 'string'; if (isStr) x.length` | Inline the guard — TypeScript doesn't track stored boolean guards |

**🎯 Interview Pattern:**
- **Trigger**: "TypeScript infers string instead of literal" / "type lost after assignment"
- **Opening**: "TypeScript widens `let` variable literals to the base type because they can be reassigned. `const` preserves literals. Object properties also widen — even in `const` objects — because properties are mutable. Use `as const` to freeze to readonly literal types..."

**🔑 Knowledge Chain:**
- **Prereq**: `let` vs `const`, TypeScript basic types
- **Enables**: Understanding `as const`, `satisfies`, discriminant narrowing

---

### 2. `as const` vs `satisfies` — Literal Preservation vs Shape Validation

**🧠 Memory Hook:** "**`as const` = freeze to readonly literals (no shape check). `satisfies` = validate shape AND keep literals. Use both for config objects: `{ ... } as const satisfies Config`.**"

**Why does this exist? / Tại sao tồn tại?**

- Why `as const`? Forces TypeScript to keep all literal types and make properties readonly — useful for route tables, config, event maps
- Why `satisfies`? `as const` doesn't catch typos (`hom` vs `home`). A type annotation like `const x: Config = {...}` validates but widens values to `string`. `satisfies` validates the shape without widening — you get both the check and the literal precision
- Why is the distinction important? `satisfies` was added specifically because teams needed config objects that: (1) are validated against a type, (2) still have precise literal types for downstream inference

**Visual — Three Approaches:**

```typescript
type AppConfig = { env: 'development' | 'staging' | 'production'; debug: boolean }

// 1. Type annotation — validates but widens
const cfg1: AppConfig = { env: 'production', debug: false }
cfg1.env  // type: 'development' | 'staging' | 'production' (narrowed by annotation, but wider than literal)

// 2. as const — preserves literals, no shape validation
const cfg2 = { env: 'production', debug: false } as const
cfg2.env  // type: 'production' ✅
// { eenv: 'production' } as const → no error! ← typo not caught

// 3. satisfies — validates AND preserves literal ✅ best of both
const cfg3 = { env: 'production', debug: false } satisfies AppConfig
cfg3.env  // type: 'production' (literal) ✅
// { eenv: 'production' } satisfies AppConfig → ERROR! ← typo caught ✅

// Combined for maximum safety:
const ROUTES = ['/', '/about', '/contact'] as const satisfies readonly string[]
ROUTES[0]  // type: '/' ← literal preserved
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `const config: Config = {...}` for downstream literal use | `satisfies Config` — keeps literals |
| `as const` expecting shape validation | Combine: `{...} as const satisfies ExpectedType` |
| Using `as const` on object that will be mutated | `as const` makes everything readonly — use only for truly immutable configs |

**🎯 Interview Pattern:**
- **Trigger**: "config object loses literal type" / "`satisfies` vs type annotation" / "TypeScript 4.9"
- **Opening**: "`satisfies` solves a specific problem: type annotations validate shape but widen values. `as const` keeps literals but doesn't validate shape. `satisfies` does both — validates the object matches the expected type, and the variable keeps its precise inferred literal types for downstream use..."

**🔑 Knowledge Chain:**
- **Prereq**: Literal types, widening, `as const`
- **Enables**: Type-safe config, route tables, event maps, exhaustive enums

---

### 3. Control Flow Analysis + Custom Type Guards

**🧠 Memory Hook:** "**CFA = TypeScript tracks your type through every if/switch/return. Custom type guard: `(x: unknown): x is User` — return `true` means TypeScript trusts x is User in the if branch. `never` for exhaustiveness.**"

**Why does this exist? / Tại sao tồn tại?**

- Why is CFA powerful? After `if (x !== null)`, TypeScript removes `null` from x's type in that branch — no assertion needed. This covers: null checks, typeof, instanceof, `in` operator, discriminant checks, truthiness
- Why user-defined type guards? Complex validation logic (checking multiple fields, calling validation libraries) can't be expressed as inline guards. A type predicate function encapsulates this: call it once, TypeScript narrows based on the boolean result
- Why `never` for exhaustiveness? In a switch on a discriminated union, after handling all cases, the type of the remaining `default` variable is `never`. If you add a new union member without handling it, `never` assignment fails — TypeScript forces you to update the switch

**Visual — CFA + Type Guards:**

```typescript
// Automatic narrowing
function handle(x: string | number | null) {
  if (x === null) return                       // x: null
  if (typeof x === 'string') x.toUpperCase()  // x: string
  else x.toFixed(2)                            // x: number
}

// Custom type guard with type predicate
function isApiUser(x: unknown): x is { id: string; name: string } {
  return typeof x === 'object' && x !== null
    && typeof (x as any).id === 'string'
    && typeof (x as any).name === 'string'
}

const response: unknown = await fetch('/api/me').then(r => r.json())
if (isApiUser(response)) {
  console.log(response.name)  // ✅ type: { id: string; name: string }
}

// Exhaustive switch with never
type Action = { type: 'INC' } | { type: 'DEC' } | { type: 'RESET' }
function reduce(state: number, action: Action): number {
  switch (action.type) {
    case 'INC':   return state + 1
    case 'DEC':   return state - 1
    case 'RESET': return 0
    default:
      const _exhaustive: never = action  // Error if new Action member added without handling!
      return state
  }
}
```

**Common Mistakes:**

| ❌ Wrong | ✅ Correct |
|---|---|
| `function isUser(x: any): boolean` | `function isUser(x: unknown): x is User` — use `unknown`, add predicate |
| `const isStr = typeof x === 'string'; if (isStr) x.length` | Inline: `if (typeof x === 'string') x.length` — stored booleans don't narrow |
| No `default: never` in discriminated union switch | Add exhaustiveness check — future-proof against new union members |

**🎯 Interview Pattern:**
- **Trigger**: "custom type guard" / "exhaustive switch" / "TypeScript narrowing"
- **Opening**: "TypeScript's CFA tracks types through every condition automatically. For complex validation logic that can't be inlined, use a type predicate: `(x: unknown): x is User`. TypeScript narrows the type inside the if block. For discriminated union switches, assign the default case to `never` — if you add a new union member, TypeScript forces you to handle it..."

**🔑 Knowledge Chain:**
- **Prereq**: Union types, discriminated unions
- **Enables**: Type-safe API response validation, exhaustive reducers, runtime+compile-time consistency

---

## Reference Theory / Tài Liệu Tham Khảo

## Inference Algorithm

**English:** Constraint collection → candidate synthesis → contextual adjustment → finalization.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const n = 1;
const arr = [1, 2, 3];
```

## Contextual Typing

**English:** Expression type derives from where it appears (callbacks, JSX props, assignment targets).

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const xs = [1,2,3];
xs.map(x => x.toFixed(2));
```

## Best Common Type

**English:** For arrays/unions, TS finds supertype compatible with all elements.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const mixed = [1, 'a']; // (string | number)[]
```

## Control Flow Analysis

**English:** Branches narrow unions based on runtime guards and reachability.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
function fn(v: string | number){ if(typeof v==='string') return v.length; return v.toFixed(2); }
```

## Widening vs Narrowing

**English:** `let` widens literal; `const` preserves literal. Guards narrow unions.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
let mode = 'dark'; // string
const lock = 'dark'; // 'dark'
```

## Const Assertions

**English:** `as const` freezes literals and readonly tuple/object semantics.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const cfg = { env: 'prod', retries: 3 } as const;
```

## satisfies Operator

**English:** Validate against target type without changing inferred literal precision.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const routes = { home: '/', about: '/about' } satisfies Record<string, `/${string}`>;
```

## Variance Basics

**English:** Function parameters are contravariant in strict function types; return types covariant.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
type F1 = (x: string | number) => string;
type F2 = (x: string) => string;
```

## Cross References / Tham Chiếu Liên Quan

- [Generics Deep Dive](./03-generics-deep-dive.md)
- [TypeScript Comprehensive](./04-typescript-comprehensive.md)
- [React with TypeScript](./05-react-typescript.md)

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1: Why does `let x = 'dark'` give type `string` but `const x = 'dark'` gives type `'dark'`? / Tại sao `let` và `const` cho types khác nhau?

**A:** TypeScript's **widening** rule: `let` variables can be reassigned, so TypeScript infers the widest type that fits — `string`. `const` variables cannot be reassigned — the value will always be `'dark'`, so TypeScript safely infers the literal type `'dark'`.

```typescript
let mode = 'dark'    // type: string (widened — could become 'light', 'auto', etc.)
const theme = 'dark' // type: 'dark' (literal — will always be 'dark')

// This causes the classic bug:
const config = { env: 'production' }
config.env  // type: string ← NOT 'production'!
// Object properties widen even in const (properties can be reassigned)

// Fix: as const
const config2 = { env: 'production' } as const
config2.env  // type: 'production' ✅
```

**Tiếng Việt:** `let` widen → TypeScript infer type rộng nhất vì biến có thể thay đổi. `const` giữ literal vì không thể reassign. Object properties cũng widen ngay cả trong `const` object — dùng `as const` để freeze.

💡 **Interview Signal:**
- ✅ Strong: Explains the reasoning (can/cannot change); extends to object property widening; mentions `as const` fix
- ❌ Weak: "TypeScript is just smarter with const" — correct outcome but wrong reasoning

---

### 🟡 [Mid] Q2: What does `satisfies` do? How is it different from a type annotation? / `satisfies` khác type annotation như thế nào?

**A:** `satisfies` validates an expression against a type **without widening the inferred type**. A type annotation (`const x: T = {...}`) validates and **widens** values to the declared type. `satisfies` validates and **keeps** the inferred literal types.

```typescript
type Config = { env: 'development' | 'staging' | 'production' }

// Type annotation — validates, but env becomes the union type (widened)
const c1: Config = { env: 'production' }
c1.env  // type: 'development' | 'staging' | 'production'

// satisfies — validates AND keeps the literal
const c2 = { env: 'production' } satisfies Config
c2.env  // type: 'production' ← literal preserved ✅

// satisfies catches typos:
const c3 = { eenv: 'production' } satisfies Config  // ❌ Error: 'eenv' not in Config
// as const wouldn't catch this!
```

**When to use each:**
- `satisfies`: config objects, route tables, event maps — where you need shape validation AND downstream literal access
- Type annotation: function parameters, return types — where widening is fine or desired
- `as const`: truly immutable data without shape constraint

**Tiếng Việt:** `satisfies` validate shape như type annotation nhưng không widen giá trị. Type annotation validate + widen (env trở thành union). `satisfies` validate + giữ literal (`'production'`). Dùng khi cần vừa validate shape vừa giữ precise types cho downstream.

💡 **Interview Signal:**
- ✅ Strong: Shows the widening difference with a concrete example; explains when to choose each; mentions typo detection advantage
- ❌ Weak: "`satisfies` is like a type annotation but different" — vague; doesn't show the inference difference

---

### 🔴 [Senior] Q3: Write a custom type guard function to safely narrow `unknown` API response to a `User` type. / Viết custom type guard để narrow `unknown` sang `User`.

**A:**

```typescript
type User = { id: string; name: string; email: string }

// Type predicate: return type `x is User` tells TypeScript
// "if this returns true, x is a User in the caller's scope"
function isUser(x: unknown): x is User {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as any).id === 'string' &&
    typeof (x as any).name === 'string' &&
    typeof (x as any).email === 'string'
  )
}

// Usage — TypeScript narrows based on the predicate:
async function fetchUser(id: string): Promise<User | null> {
  const response: unknown = await fetch(`/api/users/${id}`).then(r => r.json())

  if (isUser(response)) {
    return response  // ← type: User here (TypeScript trusts the predicate)
  }
  return null
}

// With Zod (modern alternative):
import { z } from 'zod'
const UserSchema = z.object({ id: z.string(), name: z.string(), email: z.string() })
type User = z.infer<typeof UserSchema>

function parseUser(x: unknown): User {
  return UserSchema.parse(x)  // throws ZodError if invalid; returns User if valid
}
```

**Why `unknown` instead of `any`?** `unknown` forces type checking — you can't access properties directly. `any` bypasses TypeScript entirely. Starting from `unknown` and narrowing to `User` is the safe pattern.

**Tiếng Việt:** Custom type guard dùng return type `x is User` — TypeScript tin tưởng khi function return `true`, x là `User`. Phải check từng field manually. Modern alternative: Zod schema với `z.infer<typeof Schema>` — vừa validate runtime vừa generate TypeScript type.

💡 **Interview Signal:**
- ✅ Strong: Uses `unknown` (not `any`); explains the `x is User` predicate syntax; mentions Zod as modern alternative
- ❌ Weak: `function isUser(x: any): boolean` — loses the narrowing effect; or `as User` assertion — bypasses runtime check

---

### 🔴 [Senior] Q4: Explain function parameter variance in TypeScript. Why is `(x: Animal) => void` assignable to `(x: Dog) => void` but not vice versa? / Variance trong TypeScript function types?

**A:** **Variance** describes how type compatibility flows through generic/compound types.

**Function parameter types are contravariant** (in strict mode): a function expecting a wider type (`Animal`) is assignable where a function expecting a narrower type (`Dog`) is expected — because the implementation handles more:

```typescript
type Animal = { name: string }
type Dog = Animal & { breed: string }

type DogHandler = (x: Dog) => void

// Can a function accepting Animal substitute for DogHandler?
const handleAnimal: (x: Animal) => void = (a) => console.log(a.name)

// ✅ Yes — handleAnimal handles any Animal, including Dogs
// A DogHandler caller will pass a Dog, which IS an Animal → safe
const ok: DogHandler = handleAnimal  // ✅

// Can a function accepting Dog substitute for AnimalHandler?
const handleDog: (x: Dog) => void = (d) => console.log(d.breed)
type AnimalHandler = (x: Animal) => void

// ❌ No — AnimalHandler caller might pass a Cat (Animal but not Dog)
// handleDog would try to access .breed on a Cat → runtime error
const bad: AnimalHandler = handleDog  // ❌ TypeScript error
```

**Return types are covariant**: more specific return type is assignable to wider return type.

```typescript
const getAnimal: () => Dog = () => ({ name: 'Rex', breed: 'Lab' })
const getter: () => Animal = getAnimal  // ✅ Dog is assignable to Animal
```

**Why it matters for React:** `onClick?: (e: React.MouseEvent) => void` — you can pass `(e: Event) => void` (wider parameter, contravariant) but not `(e: React.MouseEvent<HTMLButtonElement>) => void` (narrower parameter, not contravariant).

**Tiếng Việt:** Function parameters là **contravariant**: function nhận type rộng hơn (Animal) có thể assign cho type nhận hẹp hơn (Dog). Ngược lại không an toàn. Return types là **covariant**: return type hẹp hơn (Dog) có thể assign cho nơi cần type rộng hơn (Animal). Hiểu điều này giúp thiết kế callback APIs đúng.

💡 **Interview Signal:**
- ✅ Strong: Correctly names contravariant (parameters) and covariant (returns); explains the safety rationale with a concrete example; connects to React event handlers
- ❌ Weak: "TypeScript is strict about function types" — doesn't explain the direction of assignability or the safety reason

---

## Q&A Summary / Tóm Tắt Q&A

| # | Topic | Key Insight |
|---|-------|-------------|
| Q1 | let vs const widening | `let` widens (can change); `const` keeps literal; object properties widen even in `const` |
| Q2 | `satisfies` vs annotation | Annotation widens; `satisfies` validates + keeps literals |
| Q3 | Custom type guard | `(x: unknown): x is T` — type predicate narrows based on runtime check |
| Q4 | Variance | Parameters: contravariant (wider is ok). Returns: covariant (narrower is ok) |

---

## ⚡ Cold Call Simulation

**Q: "TypeScript inferred `string` for my config's `env` property but I need `'production'` literal for a switch statement. What went wrong and how do you fix it?"**

**30-second answer:**
"Object properties widen by default even when assigned to a `const`. TypeScript infers `env: string` because object properties can be reassigned — even `const obj` allows `obj.env = 'development'`. There are two fixes. First, `as const` freezes the entire object to readonly literal types — `env` becomes `'production'` (the literal). Second, and better for config objects, use `satisfies`: `const config = { env: 'production' } satisfies AppConfig` — this validates that `env` matches `AppConfig.env` union AND keeps the literal `'production'` as the inferred type. `satisfies` catches typos that `as const` would miss."

---

## Retrieval Self-Check / Tự Kiểm Tra

**Close this document. Answer from memory:**

**Retrieval:**
1. `let x = 'a'` → what type? `const x = 'a'` → what type? Why different?
2. `const obj = { env: 'prod' }` → what is `obj.env`'s type? How do you make it `'prod'` literal?
3. What does `satisfies` do that a type annotation doesn't?
4. Function `(x: Animal) => void` vs `(x: Dog) => void` — which is assignable to the other? Why?
5. Write the return type signature for a custom type guard that checks if `x` is a `Product`.

**Visual:**
- Draw the widening hierarchy: `'dark'` → `string` → `string | number` → `unknown`
- Draw contravariant parameters: which direction is safe for function parameter assignability?

**Application:**
- You have `const EVENTS = { click: 'btn:click', hover: 'btn:hover' }`. How do you ensure `EVENTS.click` is `'btn:click'` (literal) AND validate it matches `Record<string, string>`?

**Debug:**
- TypeScript says `Property 'breed' does not exist on type 'Animal'` inside `handleDog`. What happened with variance?

**Teach:**
- Explain widening to a junior: "TypeScript is like a librarian. `const` means you're permanently checking out one specific book — the librarian writes down the exact title. `let` means you might swap books — the librarian just writes `'a book'` in the ledger."

---

🔁 **Spaced Repetition:** Review in 3 days → 7 days → 14 days. Focus: widening rules (let/const/object), `satisfies` vs annotation difference, contravariant parameters.

---

## Connections / Liên Kết

- **Prereqs**: [01-type-system-basics.md](./01-type-system-basics.md), [03-generics-deep-dive.md](./03-generics-deep-dive.md)
- **See also**: [04-typescript-comprehensive.md](./04-typescript-comprehensive.md) (mapped/conditional types), [06-typescript-modern-features.md](./06-typescript-modern-features.md)
- **React**: Variance matters for event handler types — [05-react-typescript.md](./05-react-typescript.md)

---

[← Related: TypeScript Basics](./01-typescript-basics.md) | [Next: TypeScript Modern Features →](./06-typescript-modern-features.md) | [Back to Table of Contents](../../00-table-of-contents.md)

