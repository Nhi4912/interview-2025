# TypeScript Type System Basics - Hệ Thống Kiểu TypeScript Cơ Bản

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> TypeScript thêm static typing vào JavaScript. Hiểu type system là foundation cho type-safe code.

---

## 🎯 Overview

TypeScript provides static typing on top of JavaScript. This chapter focuses on foundational concepts used in junior-to-mid frontend interviews: annotations, type hierarchy, unions/intersections, literal types, narrowing, and compiler configuration.

Trong chương này bạn cần hiểu cách TypeScript mô hình hóa dữ liệu, cách compiler thu hẹp kiểu qua control-flow, và cách cấu hình strict mode để bắt lỗi sớm.

**Difficulty:** 🟢 Junior → 🔴 Senior

```
┌─────────────────────────────────────────────────────────────────┐
│                  TYPESCRIPT TYPE HIERARCHY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                         unknown                                   │
│                            │                                      │
│            ┌───────────────┼───────────────┐                     │
│            │               │               │                     │
│            ▼               ▼               ▼                     │
│        ┌───────┐    ┌─────────────┐   ┌────────┐                │
│        │ any   │    │   object    │   │ void   │                │
│        └───────┘    └──────┬──────┘   └────────┘                │
│                            │                                      │
│            ┌───────────────┼───────────────┐                     │
│            │               │               │                     │
│        ┌───────┐      ┌────────┐     ┌─────────┐                │
│        │ Array │      │Function│     │ Object  │                │
│        └───────┘      └────────┘     └─────────┘                │
│                                                                   │
│   PRIMITIVES:                                                    │
│   ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────┐ ┌────────┐        │
│   │ string │ │ number │ │ boolean │ │ null │ │undefined│        │
│   └────────┘ └────────┘ └─────────┘ └──────┘ └────────┘        │
│                                                                   │
│                         never                                     │
│                    (bottom type)                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| Type checking | Runtime | Compile-time |
| Type annotations | No | Yes |
| IDE support | Limited | Excellent |
| Refactoring | Risky | Safe |
| Documentation | Comments | Types |

---

## 📖 What - Định Nghĩa

### Primitive Types

TypeScript cung cấp type annotations cho tất cả JavaScript primitive types, cộng thêm các special types riêng.

```typescript
// String
let name: string = "John";
let greeting: string = `Hello, ${name}`;

// Number (integer & float)
let age: number = 30;
let price: number = 19.99;
let hex: number = 0xff;
let binary: number = 0b1010;

// Boolean
let isActive: boolean = true;

// Null & Undefined
let nullValue: null = null;
let undefinedValue: undefined = undefined;

// Symbol
let sym: symbol = Symbol("unique");

// BigInt
let bigNumber: bigint = 9007199254740991n;
```

### Special Types

```typescript
// any - escape hatch (avoid!)
let anything: any = "string";
anything = 42;
anything = { foo: "bar" };

// unknown - type-safe any
let userInput: unknown = getValue();
// Must narrow before using
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase());
}

// void - no return value
function logMessage(msg: string): void {
    console.log(msg);
}

// never - never returns
function throwError(msg: string): never {
    throw new Error(msg);
}

function infiniteLoop(): never {
    while (true) {}
}
```

### Literal Types

```typescript
// String literals
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north";
// dir = "up"; // Error!

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 3;

// Boolean literal
type True = true;

// const assertions
const config = {
    endpoint: "https://api.example.com",
    timeout: 3000
} as const;
// typeof config.endpoint = "https://api.example.com" (not string)
```

### Object Types

```typescript
// Inline object type
let user: { name: string; age: number } = {
    name: "John",
    age: 30
};

// Optional properties
let config: { host: string; port?: number } = {
    host: "localhost"
    // port is optional
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = {
    x: 10,
    y: 20
};
// point.x = 5; // Error!

// Index signatures
let dictionary: { [key: string]: number } = {
    apple: 5,
    banana: 3
};
```

### Arrays & Tuples

```typescript
// Array syntax
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Readonly array
let readonly: readonly number[] = [1, 2, 3];
// readonly.push(4); // Error!

// Tuple
let tuple: [string, number] = ["hello", 42];
let namedTuple: [name: string, age: number] = ["John", 30];

// Tuple with optional elements
let optionalTuple: [string, number?] = ["hello"];

// Rest elements
let restTuple: [string, ...number[]] = ["hello", 1, 2, 3];
```

### Functions

```typescript
// Function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// Optional parameters
function greet(name: string, greeting?: string): string {
    return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function createUser(name: string, role: string = "user") {
    return { name, role };
}

// Rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0);
}

// Overloads
function reverse(value: string): string;
function reverse(value: number[]): number[];
function reverse(value: string | number[]) {
    if (typeof value === "string") {
        return value.split("").reverse().join("");
    }
    return [...value].reverse();
}
```

---

## 🤔 Why - Tại Sao Quan Trọng

1. **Catch bugs at compile time** - Phát hiện lỗi type trước khi chạy, giảm runtime errors
2. **Better IDE support** - IntelliSense, auto-completion, go-to-definition hoạt động tốt hơn
3. **Self-documenting code** - Types serve as documentation cho function signatures và data shapes
4. **Safe refactoring** - Compiler báo lỗi khi rename/restructure ảnh hưởng đến type contracts
5. **Team collaboration** - Interface contracts rõ ràng giữa các team members

---

## 🔧 How - Cách Hoạt Động

### Type Annotations vs Type Inference

```typescript
// Explicit annotation
let username: string = "john";

// Type inference (preferred when obvious)
let age = 30; // TypeScript infers: number

// When to annotate explicitly:
// 1. When type can't be inferred
let data: string | number;

// 2. When you want narrower type
const status: "loading" | "success" | "error" = "loading";

// 3. Function return types (for documentation)
function getUser(id: number): User | null {
    // ...
}
```

### Type Inference

TypeScript automatically infers types when possible.

```typescript
// Variable inference
let name = "John";        // string
let age = 30;             // number
let isActive = true;      // boolean
let items = [1, 2, 3];    // number[]

// Return type inference
function add(a: number, b: number) {
    return a + b;         // inferred: number
}

// Contextual typing
const handler: (e: MouseEvent) => void = (event) => {
    // event is inferred as MouseEvent
    console.log(event.clientX);
};

// Best common type
let mixed = [1, "two", 3]; // (string | number)[]

// Const assertions for literal types
const colors = ["red", "green", "blue"] as const;
// readonly ["red", "green", "blue"]
```

### Union & Intersection Types

```typescript
// Union: Either type A OR type B
type StringOrNumber = string | number;

let value: StringOrNumber = "hello";
value = 42; // OK

// Common use: nullable types
type MaybeString = string | null | undefined;

// Discriminated unions
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

function handleResult(result: Result<User>) {
    if (result.success) {
        console.log(result.data); // TypeScript knows data exists
    } else {
        console.log(result.error); // TypeScript knows error exists
    }
}

// Intersection: Both type A AND type B
type Name = { firstName: string; lastName: string };
type Age = { age: number };

type Person = Name & Age;

const person: Person = {
    firstName: "John",
    lastName: "Doe",
    age: 30
};
```

### Type Narrowing

```typescript
// typeof narrowing
function padLeft(value: string | number, padding: string | number) {
    if (typeof padding === "number") {
        return " ".repeat(padding) + value;
    }
    return padding + value;
}

// Truthiness narrowing
function printName(name: string | null | undefined) {
    if (name) {
        console.log(name.toUpperCase());
    }
}

// in narrowing
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim();
    } else {
        animal.fly();
    }
}

// instanceof narrowing
function logDate(date: Date | string) {
    if (date instanceof Date) {
        console.log(date.toISOString());
    } else {
        console.log(new Date(date).toISOString());
    }
}

// Discriminated unions
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

// Type predicates (custom type guards)
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function process(value: unknown) {
    if (isString(value)) {
        console.log(value.toUpperCase()); // TypeScript knows it's string
    }
}

// Assertion functions
function assertIsNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") {
        throw new Error("Not a number!");
    }
}

function double(value: unknown) {
    assertIsNumber(value);
    return value * 2; // TypeScript knows it's number
}
```

### Type Assertions

```typescript
const el = document.getElementById('app') as HTMLDivElement | null;
if (el) el.textContent = 'ready';
```

**Giải thích (VI):** Assertion nói với compiler "tôi biết rõ hơn"; tránh lạm dụng vì chỉ ảnh hưởng compile-time, không convert dữ liệu thật.

### Enums

```typescript
enum Status { Idle = 'idle', Loading = 'loading', Done = 'done' }
const s: Status = Status.Idle;
```

**Giải thích (VI):** Ưu tiên union literals trong FE, enum phù hợp khi cần namespace runtime.

### Strict Mode & tsconfig Essentials

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

**Giải thích (VI):** strict bật nhóm kiểm tra mạnh: null safety, function variance, initialization. Cần rõ module target, baseUrl/paths, include/exclude cho dự án lớn.

### Declaration Files (.d.ts)

```typescript
declare module 'legacy-lib' {
  export function format(v: string): string;
}
```

**Giải thích (VI):** Declaration file mô tả shape của thư viện JS không có type.

---

## 🕐 When - Khi Nào Sử Dụng

| Scenario | Approach |
|----------|----------|
| Khi type rõ ràng từ value | Để TypeScript infer (không cần annotation) |
| Function parameters | Luôn annotate explicitly |
| Function return types | Annotate cho public APIs, infer cho internal |
| Cần restrict value set | Dùng literal types hoặc enums |
| Dữ liệu có thể null | Dùng union với `null`, bật `strictNullChecks` |
| Dữ liệu dynamic/unknown | Dùng `unknown` + type guard, tránh `any` |
| Legacy JS integration | Tạo `.d.ts` declaration files cho high-traffic APIs trước |

---

## Common Mistakes and Fixes / Lỗi Thường Gặp và Cách Sửa

### Mistake 1: Overusing `any`

**Giải thích (VI):** `any` phá vỡ type safety toàn chuỗi gọi hàm. Chỉ dùng khi biên giới với hệ thống chưa typed và nên thay bằng `unknown` + guard.

```typescript
function parsePayload(raw: unknown): { id: string } {
  if (typeof raw === 'object' && raw !== null && 'id' in raw) {
    return { id: String((raw as { id: unknown }).id) };
  }
  throw new Error('invalid payload');
}
```

### Mistake 2: Ignoring strict flags in CI

**Giải thích (VI):** Nhiều team bật strict cục bộ nhưng CI không enforce, dẫn tới regression. Cần chạy `tsc --noEmit` trong pipeline.

### Mistake 3: Unsafe assertions in DOM code

**Giải thích (VI):** Assert trực tiếp `as HTMLInputElement` có thể crash runtime nếu selector sai. Luôn kiểm tra null.

```typescript
const node = document.querySelector('#email');
if (node instanceof HTMLInputElement) {
  node.value = 'hello@example.com';
}
```

---

## 💡 Interview Questions

### 🟢 Junior

**Q1: `any` vs `unknown` khác nhau như thế nào?**

A:
- `any`: Bypass type checking, có thể gán và gọi bất kỳ thứ gì
- `unknown`: Type-safe, phải narrow type trước khi sử dụng
- Prefer `unknown` over `any` để giữ type safety

**Q2: Type annotation vs inference?**

A:
- Inference: TypeScript tự suy luận type, code ngắn gọn
- Annotation: Developer chỉ định type, rõ ràng hơn
- Best practice: Để TypeScript infer khi có thể, annotate khi cần clarity

**Q3: What is a type annotation?**

**Answer (EN):** A type annotation explicitly declares the expected type for a variable, parameter, or return value.

**Giải thích (VI):** Type annotation giúp code rõ ràng, IDE gợi ý tốt hơn, và bắt lỗi sớm.

```typescript
function add(a: number, b: number): number { return a + b; }
```

**Q4: What is `unknown`?**

**Answer (EN):** `unknown` is a safe top type that requires narrowing before use.

**Giải thích (VI):** unknown an toàn hơn any vì bắt buộc kiểm tra trước khi dùng.

```typescript
function handle(v: unknown){ if(typeof v === 'string') v.toUpperCase(); }
```

**Q5: What is a union type?**

**Answer (EN):** A union allows one value to be one of multiple listed types.

**Giải thích (VI):** Union thể hiện lựa chọn OR giữa nhiều kiểu.

**Q6: What does `as` do?**

**Answer (EN):** `as` performs compile-time assertion only and does not transform runtime values.

**Giải thích (VI):** `as` chỉ ảnh hưởng compile-time, không convert dữ liệu thật.

**Q7: What is tuple?**

**Answer (EN):** Tuple is a fixed-length array with known element types by position.

**Giải thích (VI):** Tuple phù hợp cho dữ liệu có thứ tự và ý nghĩa theo index.

### 🟡 Mid-level

**Q8: Giải thích type narrowing**

A: Type narrowing là quá trình thu hẹp type từ broader type xuống specific type thông qua:
- `typeof` checks
- Truthiness checks
- `instanceof` checks
- `in` operator
- Discriminated unions
- Custom type guards

**Q9: Union vs Intersection types?**

A:
- Union (`|`): Either type A OR type B
- Intersection (`&`): Both type A AND type B
- Union: dùng cho values có thể là nhiều types
- Intersection: dùng để merge types

**Q10: Why are literal types useful in UI state?**

**Answer (EN):** Literal unions prevent invalid state transitions by constraining allowed values.

**Giải thích (VI):** Literal type giúp state machine chặt chẽ và tránh typo.

**Q11: Enum vs string literal union?**

**Answer (EN):** String literal unions are lighter and often preferred in frontend; enums provide runtime object.

**Giải thích (VI):** FE thường ưu tiên union literals vì tree-shaking và đơn giản.

**Q12: How to write a custom type guard?**

**Answer (EN):** Return a predicate signature (`value is T`) and check runtime shape safely.

**Giải thích (VI):** Custom guard kết hợp kiểm tra runtime + predicate type.

```typescript
function isError(e: unknown): e is Error { return e instanceof Error; }
```

**Q13: How does narrowing work with control flow?**

**Answer (EN):** TypeScript narrows by branch conditions, returns, throws, and exhaustive checks.

**Giải thích (VI):** Compiler theo dõi luồng điều khiển để thu hẹp kiểu.

**Q14: What does `strictNullChecks` protect?**

**Answer (EN):** It prevents using `null`/`undefined` where non-null values are required.

**Giải thích (VI):** Bảo vệ khỏi lỗi null pointer bằng kiểm tra tường minh.

**Q15: Why enable `noImplicitAny`?**

**Answer (EN):** It blocks accidental `any` and forces explicit modeling of unknown values.

**Giải thích (VI):** Tránh kiểu any ngầm làm mất an toàn kiểu.

**Q16: How to type function overloads?**

**Answer (EN):** Declare overload signatures followed by one implementation signature.

**Giải thích (VI):** Overload hữu ích khi API có nhiều cách gọi rõ ràng.

**Q17: How to configure path aliases?**

**Answer (EN):** Use `baseUrl` and `paths` in tsconfig and align with bundler config.

**Giải thích (VI):** Alias giúp import sạch hơn nhưng phải đồng bộ bundler/test.

### 🔴 Senior

**Q18: Implement exhaustive check cho discriminated union**

```typescript
type Shape = Circle | Rectangle | Triangle;

function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
        default:
            return assertNever(shape); // Error if case missing
    }
}
```

**Q19: What is declaration file strategy for legacy JS?**

**Answer (EN):** Create `.d.ts` wrappers for high-traffic APIs first, then expand coverage incrementally.

**Giải thích (VI):** Bọc type cho API quan trọng trước để giảm rủi ro migration.

**Q20: How do you enforce safe indexing?**

**Answer (EN):** Enable `noUncheckedIndexedAccess` and model maps with explicit undefined handling.

**Giải thích (VI):** Bật cờ này để tránh assume key luôn tồn tại.

```typescript
const map: Record<string, number> = {}; const v = map['x']; // number | undefined
```

**Q21: How to explain structural typing in interview?**

**Answer (EN):** Compatibility depends on shape, not nominal declarations.

**Giải thích (VI):** TS so khớp theo cấu trúc thuộc tính thay vì tên kiểu.

**Q22: How do strict options affect refactoring?**

**Answer (EN):** They increase upfront friction but dramatically reduce regression risk in large codebases.

**Giải thích (VI):** Strict mode làm migration khó hơn ban đầu nhưng ổn định dài hạn.

---

## 📋 Active Recall Questions

1. [ ] List 5 primitive types trong TypeScript
2. [ ] Khi nào dùng `unknown` vs `any`?
3. [ ] Giải thích discriminated unions
4. [ ] Implement custom type guard
5. [ ] So sánh `readonly` vs `const`
6. [ ] What does `strictNullChecks` protect against?
7. [ ] When to annotate vs let TypeScript infer?

---

## 🔗 Cross-References

- [02-interfaces-vs-types.md](./02-advanced-types.md) - Interface vs Type deep dive
- [03-generics.md](./03-generics-deep-dive.md) - Generics patterns
- [05-type-inference-theory.md](./05-type-inference-theory.md) - Type inference algorithm
- [04-typescript-comprehensive.md](./04-typescript-comprehensive.md) - Structural typing, module augmentation
