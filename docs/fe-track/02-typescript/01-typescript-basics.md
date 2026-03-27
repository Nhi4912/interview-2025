# TypeScript Basics / Cơ Bản TypeScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Basics](../01-javascript/00-javascript-basics.md)
> **See also**: [Advanced Types](./02-advanced-types.md) | [Table of Contents](../../00-table-of-contents.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Advanced Types →](./02-advanced-types.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Bug tại một startup fintech (2024):** Hàm `calculateTotal(price, quantity)` hoạt động tốt 6 tháng. Sau đó một backend engineer gọi `calculateTotal("15.99", 3)` vì API trả về số dạng string. Kết quả: `"15.9915.9915.99"` thay vì `47.97`. Bug vào production, customer thấy giá sai, mất trust.

```typescript
// ❌ JavaScript — bug không được phát hiện
function calculateTotal(price, quantity) {
  return price * quantity; // "15.99" * 3 = 47.97... nhưng "15.99" + "15.99" = ???
}
// Tùy thuộc vào operator — dễ gây lỗi logic ngầm

// ✅ TypeScript — caught at compile time
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
calculateTotal("15.99", 3); // ❌ Error: Argument of type 'string' is not assignable to 'number'
// Bug phát hiện TRƯỚC khi deploy — không bao giờ tới production
```

**Kết luận:** 94% dự án lớn dùng TypeScript không phải vì "trend" — mà vì cost của bugs tỷ lệ thuận với khi nào phát hiện ra (Requirements: $1 → Design: $10 → Code: $100 → Production: $1000).

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Hệ thống biển báo giao thông:**

JavaScript = đường không biển báo — xe đi được mọi hướng, nhanh xây nhưng tai nạn liên tục.
TypeScript = thêm biển báo + cảnh sát giao thông (compiler) — phát hiện vi phạm TRƯỚC khi xuất phát.

```
JavaScript:  "100" + 1 = "1001"   ← không ai cảnh báo
TypeScript:  type string + number → Error ← compiler ngăn trước
```

**TypeScript KHÔNG phải ngôn ngữ mới:**

- TS = JS + type annotations + compiler
- Browser vẫn chạy JavaScript (TS compile → JS)
- Type annotations bị xóa hoàn toàn lúc runtime
- TS chỉ tồn tại tại **development time** → zero runtime cost

**Tại sao JS cần TS:**

| Vấn đề JavaScript                                    | TypeScript giải quyết                       |
| ---------------------------------------------------- | ------------------------------------------- |
| `undefined is not a function` — chỉ biết lúc runtime | Caught at compile time — biết lúc viết code |
| Không biết object có property nào                    | IntelliSense + type checking                |
| Refactor sợ vỡ code                                  | Compiler tìm hết chỗ cần sửa                |
| Code review không hiệu quả                           | Types = self-documenting, luôn up-to-date   |

---

## Concept Map / Bản Đồ Khái Niệm

```
   [JavaScript] ─── TypeScript is a SUPERSET ───►
                                                  │
                   [TYPESCRIPT BASICS] ← bạn đang ở đây
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
 [Type System]       [Type Modeling]      [Type Safety]
 primitives          interface vs type    type guards
 functions           union/intersection   narrowing
 objects             literal types        strict mode
       │                   │
       └───────────────────┘
                   │
                   ▼
       [Advanced Types] → (Chapter 2)
       Generics | Mapped | Conditional | Template Literal
                   │
                   ▼
       [TypeScript + React] → Props | Hooks | API responses
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. Type Annotations & Type Inference

> 🧠 **Memory Hook:** "TypeScript: **Annotate** when you must, **let it infer** when you can. Inference is not magic — it's the compiler being smart so you don't have to be verbose."

**Tại sao tồn tại? / Why does this exist?**
JavaScript is dynamically typed — variable type determined at runtime. TypeScript adds static typing — type determined at compile time.
→ Tại sao cần static typing? → Catch errors early, enable IDE tooling, self-documenting code
→ Tại sao không just add types to JS? → Anders Hejlsberg (TypeScript creator) designed TS as a **superset** — all valid JS is valid TS, migration path exists

#### Layer 1: Simple Analogy

Type annotation như **nhãn trên hộp**: khi bạn đánh nhãn hộp "Đĩa" thì khi ai đó cố nhét "Nồi" vào — bạn biết ngay là sai. Không nhãn → chỉ biết nội dung khi mở (runtime).

#### Layer 2: Annotations vs Inference

```typescript
// Explicit annotation — bạn khai báo type
let name: string = "Alice"; // annotation
let age: number = 25; // annotation
let active: boolean = true; // annotation

// Type inference — compiler tự suy ra (preferred when obvious)
let city = "Hanoi"; // inferred: string
let score = 100; // inferred: number
let items = [1, 2, 3]; // inferred: number[]

// Function: annotate params + return type
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Object type
function createUser(id: number, email: string): { id: number; email: string } {
  return { id, email };
}

// Array and tuple
const tags: string[] = ["react", "typescript"];
const point: [number, number] = [10, 20]; // tuple: fixed length, fixed types
```

```
When to annotate vs infer:
✅ Annotate: function parameters, public API return types, complex objects
✅ Infer: local variables with obvious initial values
❌ Redundant: const x: string = 'hello' — inference already knows it's string
```

#### Layer 3: `unknown` vs `any` vs `never`

```typescript
// any — escapes type system (AVOID — defeats the purpose of TS)
let data: any = fetch("/api");
data.foo.bar.baz; // No error — but will fail at runtime

// unknown — safe alternative: MUST check before use
let rawData: unknown = fetch("/api");
rawData.foo; // ❌ Error — must narrow first
if (typeof rawData === "object" && rawData !== null) {
  // rawData narrowed to object here
}

// never — type that never has a value (exhaustiveness checking)
type Shape = "circle" | "square";
function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI;
    case "square":
      return 1;
    default:
      const _exhaustive: never = shape; // Error if new Shape added but not handled
      throw new Error(`Unknown: ${shape}`);
  }
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                     | Đúng là                                                  |
| --------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Dùng `any` khi không biết type                | Defeats type safety — lỗi chỉ xuất hiện runtime | Dùng `unknown` + type guard để narrow                    |
| Annotate tất cả — `const x: string = 'hello'` | Verbose, redundant — inference đã đủ            | Annotate ở boundaries (params, return), infer internally |
| `as any` để qua TypeScript error              | Suppress error mà không fix root cause          | Fix type đúng hoặc dùng type guard                       |

**🎯 Interview Pattern:**

- Khi thấy: "Khác biệt `any` và `unknown`?"
- → Mở đầu: "`any` opt out khỏi type system — dùng unknown thay thế. `unknown` buộc bạn check type trước khi sử dụng, `any` không check gì..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: JavaScript dynamic typing
- ➡️ Để hiểu: Type Guards & Narrowing (section 3 dưới)

---

### 2. interface vs type — Khi Nào Dùng Cái Nào?

> 🧠 **Memory Hook:** "**interface** = contract (có thể extend, declare merge). **type** = alias (flexible: union, intersection, computed). **Default: interface cho object shapes, type cho union/computed**."

**Tại sao tồn tại? / Why does this exist?**
TypeScript cần 2 cách mô hình hóa type để cover các use cases khác nhau:

- `interface`: tối ưu cho OOP patterns — extends, implements, declaration merging
- `type`: tối ưu cho functional patterns — union types, mapped types, conditional types

#### Layer 1: Simple Analogy

`interface` như **hợp đồng lao động** — có thể ký thêm phụ lục (declaration merge), có thể thừa kế (extends). `type` như **công thức toán học** — linh hoạt kết hợp (union/intersection), nhưng không thể "ký thêm phụ lục".

#### Layer 2: Key Differences with Examples

```typescript
// interface — for object contracts
interface User {
  id: number;
  name: string;
  email?: string; // optional property
}

interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

// Declaration merging — only interface can do this
interface Window {
  myCustomProp: string; // Extend built-in browser types
}

// type — for flexible aliases
type UserId = User["id"]; // Indexed access type
type UserOrAdmin = User | Admin; // Union — interface can't do this directly
type WithTimestamp<T> = T & { createdAt: Date }; // Intersection + generic
type Status = "idle" | "loading" | "success" | "error"; // Literal union

// type for computed/complex patterns
type ReadOnly<T> = { readonly [K in keyof T]: T[K] }; // Mapped type — only type
type Nullable<T> = T | null;
```

```
Quick decision guide:
Object shape with possible extension? → interface
Union types? → type
Intersection/mapped/conditional? → type
Extending built-in types (Window, HTMLElement)? → interface (declaration merge)
React component props? → either works, interface slightly preferred
```

#### Layer 3: When They Behave Differently

```typescript
// Interface: extends vs type intersection — subtle difference
interface A { x: number }
interface B extends A { x: string } // ❌ Error: incompatible types

type A = { x: number };
type B = A & { x: string }; // OK — creates 'never' for x (number & string = never)

// Interface: can be implemented by classes
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}
class Config implements Serializable { ... }

// Type: cannot be implemented directly
type Config = { serialize(): string }; // Can use, but classes implement interfaces
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                             | Tại sao sai                                                   | Đúng là                                                  |
| --------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- | ------------------ | ---- |
| Dùng `type` cho everything                          | Miss declaration merging (cần để extend browser types)        | `interface` cho object shapes, `type` cho aliases/unions |
| Dùng `interface` cho union: `interface Status = 'a' | 'b'`                                                          | Syntax error — interface không thể là union              | `type Status = 'a' | 'b'` |
| Nghĩ interface và type hoàn toàn giống nhau         | Declaration merging, `implements`, extends behavior khác nhau | Biết specific differences cho interview                  |

**🎯 Interview Pattern:**

- Khi thấy: "interface vs type, bạn dùng cái nào?"
- → Mở đầu: "Tôi theo convention: `interface` cho object shapes (có thể extend, declare merge), `type` cho union và computed types. Quyết định chính: object contract hay type alias?"

**🔑 Knowledge Chain:**

- 📚 Cần biết: Type Annotations (section 1)
- ➡️ Để hiểu: Generics ([03-generics-deep-dive.md](./03-generics-deep-dive.md)) — interface and type both used with generics

---

### 3. Type Guards & Narrowing

> 🧠 **Memory Hook:** "**Narrowing** = TypeScript thu hẹp type dựa trên logic bạn viết. `typeof` → primitives, `instanceof` → classes, `in` → objects, `is` → custom."

**Tại sao tồn tại? / Why does this exist?**
Union types (`string | number`) là powerful nhưng cần biết **actual type** trước khi dùng specific methods. Narrowing = compiler tracks which type is active in each code branch.
→ Tại sao compiler không tự biết? → Runtime values not known at compile time — you must provide the check
→ Tại sao cần custom type guards (`is` keyword)? → `typeof` chỉ phân biệt primitives, không phân biệt được custom object shapes

#### Layer 1: Simple Analogy

Type narrowing như **phân loại bưu kiện**: bạn nhận hộp (union type), cần kiểm tra nhãn (type guard) trước khi xử lý đúng cách — nhãn "dễ vỡ" → đặt nhẹ, nhãn "thực phẩm" → bỏ tủ lạnh. Trước khi kiểm tra nhãn, bạn không biết phải làm gì.

#### Layer 2: All Narrowing Techniques

```typescript
type StringOrNumber = string | number;

function process(value: StringOrNumber) {
  // typeof — primitives
  if (typeof value === "string") {
    return value.toUpperCase(); // narrowed to string
  }
  return value.toFixed(2); // narrowed to number
}

// instanceof — class instances
function handleError(err: Error | string) {
  if (err instanceof TypeError) {
    console.log("Type error:", err.message);
  } else if (typeof err === "string") {
    console.log("String error:", err);
  }
}

// 'in' operator — object shape check
type Dog = { bark(): void };
type Cat = { meow(): void };

function makeSound(animal: Dog | Cat) {
  if ("bark" in animal) {
    animal.bark(); // narrowed to Dog
  } else {
    animal.meow(); // narrowed to Cat
  }
}

// Custom type predicate — 'is' keyword
interface ApiSuccess {
  ok: true;
  data: unknown;
}
interface ApiError {
  ok: false;
  error: string;
}
type ApiResult = ApiSuccess | ApiError;

function isSuccess(result: ApiResult): result is ApiSuccess {
  return result.ok === true;
}

function handleResult(result: ApiResult) {
  if (isSuccess(result)) {
    console.log(result.data); // TypeScript knows: result is ApiSuccess
  } else {
    console.log(result.error); // TypeScript knows: result is ApiError
  }
}
```

#### Layer 3: Exhaustiveness Checking with `never`

```typescript
// Discriminated union — most powerful pattern
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      // If you add 'rectangle' to Shape but forget to add case:
      const _check: never = shape; // ❌ Error — triangle not handled
      throw new Error("Unhandled shape");
  }
}
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                                      | Tại sao sai                                                      | Đúng là                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------- |
| Dùng `as` để bypass union: `(value as string).toUpperCase()` | Không thực sự check type — crash nếu là number                   | Dùng `typeof` guard trước                      |
| `typeof null === 'object'` — JS quirk                        | `null` có type `'object'` trong typeof — catch `null` explicitly | `if (val !== null && typeof val === 'object')` |
| Quên `in` guard cho discriminated union                      | TypeScript không thể infer từ `if (animal.bark)` trên union      | Dùng `'bark' in animal` — the `in` operator    |

**🎯 Interview Pattern:**

- Khi thấy: "Làm sao xử lý `string | number | null` type?"
- → Mở đầu: "TypeScript có control-flow narrowing — dùng `typeof`, `instanceof`, `in`, hoặc custom type predicate. Tôi thường design discriminated union với `kind` field để có exhaustiveness checking..."

**🔑 Knowledge Chain:**

- 📚 Cần biết: Union types, interface vs type (section 2)
- ➡️ Để hiểu: Conditional types (`T extends X ? Y : Z`) — advanced narrowing at type level

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: `any` vs `unknown` — khi nào dùng cái nào? 🟢 Junior

**A:** Both accept any value, but `unknown` is type-safe: you cannot use it until you narrow the type. `any` completely opts out of type checking — it's contagious (infects surrounding types).

Cả hai chấp nhận mọi value, nhưng `unknown` an toàn hơn: bạn không thể dùng nó cho đến khi narrow type. `any` opt out hoàn toàn khỏi type checking — nó "lây nhiễm" các type xung quanh.

```typescript
function process(input: unknown) {
  // Must narrow before use
  if (typeof input === "string") {
    return input.toUpperCase(); // OK — narrowed
  }
  // input.toUpperCase() here — ❌ Error
}

function processAny(input: any) {
  return input.toUpperCase(); // ✅ No error — but crashes if input is number
}
```

**Use `unknown`** for: external data (API responses, `JSON.parse`, user input)
**Use `any`** only for: gradual migration from JS, very specific edge cases

**💡 Interview Signal:**

- ✅ Strong: Giải thích "contagious" nature của `any`, biết `unknown` requires narrowing, mention `JSON.parse` returns `any` — should be wrapped as `unknown`
- ❌ Weak: "unknown giống any nhưng strict hơn" — không đủ depth

---

### Q2: interface vs type — khi nào dùng cái nào trong React project? 🟡 Mid

**A:** Convention trong React project: `interface` cho component props và class contracts (extensible), `type` cho union states and computed types.

```typescript
// interface — component props (can be extended by other components)
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

// type — state unions, discriminated unions
type LoadingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string };

// type — utility/computed
type PartialUser = Partial<User>;
type UserWithoutId = Omit<User, "id">;
```

**Key rule:** If you might extend it → `interface`. If it's a union or computed → `type`.

**💡 Interview Signal:**

- ✅ Strong: Giải thích declaration merging (cần để augment thư viện), biết convention, đưa ra ví dụ discriminated union
- ❌ Weak: "Cả hai giống nhau, dùng cái nào cũng được" — bỏ qua declaration merging difference

---

### Q3: Implement type-safe API response handler với discriminated union 🟡 Mid

**A:**

```typescript
// Model API responses as discriminated union
interface ApiSuccess<T> {
  ok: true;
  data: T;
  statusCode: 200 | 201;
}

interface ApiError {
  ok: false;
  error: string;
  statusCode: 400 | 401 | 403 | 404 | 500;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Type-safe handler
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      return { ok: false, error: "Fetch failed", statusCode: res.status as 400 };
    }
    const data: User = await res.json();
    return { ok: true, data, statusCode: 200 };
  } catch (e) {
    return { ok: false, error: String(e), statusCode: 500 };
  }
}

// Caller: TypeScript narrows based on ok field
const result = await fetchUser(1);
if (result.ok) {
  console.log(result.data.name); // ✅ TypeScript knows: result is ApiSuccess<User>
} else {
  console.log(result.error); // ✅ TypeScript knows: result is ApiError
}
```

**💡 Interview Signal:**

- ✅ Strong: Dùng discriminated union thay vì `try/catch` everywhere, generic `ApiResponse<T>`, narrowing tại call site
- ❌ Weak: Dùng `any` cho response, không handle error type

---

### Q4: Strict mode — những flags nào quan trọng nhất? 🔴 Senior

**A:** `"strict": true` enables a bundle of 7 flags. Most impactful:

```json
{
  "compilerOptions": {
    "strict": true, // Enables all below
    "noUncheckedIndexedAccess": true, // arr[0] returns T | undefined (not just T)
    "exactOptionalPropertyTypes": true // {x?: string} — undefined not assignable unless x?: string | undefined
  }
}
```

**Most impactful strict sub-flags:**

| Flag                           | What it catches                                                              |
| ------------------------------ | ---------------------------------------------------------------------------- |
| `strictNullChecks`             | Null/undefined not assignable to other types — catches 30% of runtime errors |
| `noImplicitAny`                | Functions without explicit types error instead of being `any`                |
| `strictFunctionTypes`          | Function parameter types checked correctly (contravariance)                  |
| `strictPropertyInitialization` | Class properties must be initialized in constructor                          |

**Production pattern:**

```typescript
// Without noUncheckedIndexedAccess: danger
const arr: string[] = [];
const first = arr[0]; // type: string (LIE — could be undefined!)
first.toUpperCase(); // No TS error but crashes at runtime

// With noUncheckedIndexedAccess: safe
const first = arr[0]; // type: string | undefined
first?.toUpperCase(); // ✅ Must handle undefined
```

**💡 Interview Signal:**

- ✅ Strong: Biết `strictNullChecks` là flag quan trọng nhất, giải thích `noUncheckedIndexedAccess` với ví dụ, biết `tsc --noEmit` trong CI
- ❌ Weak: "Bật `strict: true` là xong" — không biết giá trị của từng flag

---

### Q5: Design type-safe event system cho React app 🔴 Senior (Create/Evaluate)

**A:** Dùng discriminated union + generic để tạo event bus type-safe:

```typescript
// Event definitions — discriminated union
type AppEvent =
  | { type: "USER_LOGIN"; payload: { userId: string; email: string } }
  | { type: "USER_LOGOUT"; payload: { userId: string } }
  | { type: "CART_UPDATE"; payload: { items: CartItem[]; total: number } }
  | { type: "ERROR"; payload: { code: string; message: string } };

// Extract payload type by event type
type EventPayload<T extends AppEvent["type"]> = Extract<AppEvent, { type: T }>["payload"];

// Type-safe event bus
class TypedEventBus {
  private listeners = new Map<string, Set<(payload: unknown) => void>>();

  on<T extends AppEvent["type"]>(type: T, handler: (payload: EventPayload<T>) => void): () => void {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(handler as (p: unknown) => void);
    return () => this.listeners.get(type)?.delete(handler as (p: unknown) => void);
  }

  emit<T extends AppEvent["type"]>(type: T, payload: EventPayload<T>): void {
    this.listeners.get(type)?.forEach((h) => h(payload));
  }
}

// Usage — fully type-safe
const bus = new TypedEventBus();

bus.on("USER_LOGIN", ({ userId, email }) => {
  // TypeScript knows: userId: string, email: string ✅
  console.log(`${email} logged in`);
});

bus.emit("USER_LOGIN", { userId: "1", email: "a@b.com" }); // ✅
bus.emit("USER_LOGIN", { userId: "1", wrong: "field" }); // ❌ Error
```

**💡 Interview Signal:**

- ✅ Strong: Dùng `Extract<>` utility type, generic với constraint, biết trade-off (complexity vs safety), đề cập unsubscribe pattern
- ❌ Weak: Dùng `Map<string, Function>` — no type safety ở payload level

---

## 📋 Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Câu hỏi                                                 | Difficulty | Core Concept      | Key Signal                                       |
| --- | ------------------------------------------------------- | ---------- | ----------------- | ------------------------------------------------ |
| 1   | `any` vs `unknown` — khi nào dùng cái nào?              | 🟢 Junior  | Type safety       | Hiểu rủi ro `any` và cách dùng `unknown` an toàn |
| 2   | `interface` vs `type` trong React project?              | 🟡 Mid     | Type system       | Biết khi nào declaration merging quan trọng      |
| 3   | Implement type-safe API handler với discriminated union | 🟡 Mid     | Type design       | Union + exhaustive handling + narrowing pattern  |
| 4   | Strict mode — những flags quan trọng nhất?              | 🔴 Senior  | Compiler config   | Giải thích tác động thực tế từng flag            |
| 5   | Thiết kế type-safe event system cho React app           | 🔴 Senior  | Type architecture | Generic event map với `keyof` constraints        |

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao bạn dùng TypeScript? Và `any` có gì không tốt?"**

**30 giây đầu — mở đầu lý tưởng:**

1. "TypeScript bắt lỗi tại compile time thay vì runtime — chi phí phát hiện bug giảm từ $1000 xuống $1 (production vs development)."
2. "`any` opt out hoàn toàn khỏi type system — nó 'lây nhiễm' code xung quanh, vô hiệu hóa IntelliSense, và che giấu bugs đến runtime."
3. "Thay thế `any` bằng `unknown` — bắt buộc narrow type trước khi dùng, safe nhưng vẫn flexible."
4. "Trong project của tôi, `any` chỉ xuất hiện ở migration boundary và external library types — còn lại dùng `strict: true` để enforce."

---

## 🔄 Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại. Trả lời từng câu, sau đó mở lại kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                              |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Viết 3 khác biệt chính giữa `interface` và `type` từ trí nhớ (declaration merging, union types, primitive aliases).                                  |
| 2   | 🎨 Visual      | Vẽ decision tree: "Khi nào dùng `interface`, khi nào dùng `type`?" — bao gồm nhánh declaration merging, union/intersection, và mapped types.         |
| 3   | 🛠️ Application | Bạn nhận `unknown` từ `JSON.parse()`. Viết type guard kiểm tra đây là `{ id: string; price: number }` trước khi dùng — không dùng `any`.             |
| 4   | 🐛 Debug       | `function first<T>(arr: T[]): T { return arr[0]; }` với `first([]).toUpperCase()` — lỗi gì xảy ra tại runtime? TypeScript có báo không? Fix thế nào? |
| 5   | 🎓 Teach       | Giải thích tại sao `unknown` tốt hơn `any` cho người mới học TS — dùng ví dụ hộp bưu kiện chưa biết nội dung.                                        |

### Key Points (tự kiểm tra)

| #   | Key Point                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `interface` hỗ trợ declaration merging; `type` hỗ trợ union, intersection, primitive aliases, và computed types. Cả hai đều mô tả object shape.   |
| 2   | Dùng `interface` cho public API/library (merging); dùng `type` cho union/intersection, primitives, hoặc khi cần computed/conditional types.       |
| 3   | `function isProduct(x: unknown): x is { id: string; price: number } { return typeof x === 'object' && x !== null && 'id' in x && 'price' in x; }` |
| 4   | `first([])` trả `undefined` tại runtime nhưng TypeScript nghĩ return type là `T`. Fix: `function first<T>(arr: T[]): T \| undefined`.             |
| 5   | `any` = tắt type checking hoàn toàn. `unknown` = "chưa biết loại gì, phải kiểm tra trước". Như hộp bưu kiện: mở ra xem trước khi dùng.            |

> 🎯 **Feynman Prompt:** Giải thích discriminated union cho người chỉ biết JavaScript — tại sao `if (result.ok)` lại tự động thu hẹp type?
> 🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.

---

## 🔗 Connections / Liên Kết

### Cùng track (Same track)
- [Advanced Types](./02-advanced-types.md) — mapped types, conditional types, and utility types
- [Generics Deep Dive](./03-generics-deep-dive.md) — generics build on the type system covered here
- [React TypeScript](./05-react-typescript.md) — applying TypeScript basics in React components
- [TypeScript Comprehensive](./04-typescript-comprehensive.md) — full reference covering all TS features

### Khác track (Cross-track)
- [JS ES6 Features](../01-javascript/07-es6-features.md) — JavaScript features TypeScript is built on
- [JS Type System Theory](../01-javascript/14-javascript-type-system-theory.md) — JS dynamic types TS adds safety to
- [CS Fundamentals: Computation Theory](../../shared/01-cs-fundamentals/08-computation-theory.md) — type theory and static analysis foundations
