# TypeScript Type System Basics

> TypeScript thêm static typing vào JavaScript. Hiểu type system là foundation cho type-safe code.

---

## Mục Lục

- [Overview](#-overview)
- [Primitive Types](#-primitive-types)
- [Object Types](#-object-types)
- [Type Annotations](#-type-annotations)
- [Type Inference](#-type-inference)
- [Union & Intersection](#-union--intersection)
- [Type Narrowing](#-type-narrowing)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

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

## 🔷 Primitive Types

### Basic Types

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

---

## 📦 Object Types

### Object Type Syntax

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

### Arrays

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

## ✍️ Type Annotations

### Variable Annotations

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

### Function Annotations

```typescript
// Parameter and return types
function add(a: number, b: number): number {
    return a + b;
}

// Arrow functions
const multiply = (a: number, b: number): number => a * b;

// Callback functions
function fetchData(callback: (data: string) => void): void {
    // ...
    callback("data");
}

// Generic functions
function identity<T>(value: T): T {
    return value;
}
```

---

## 🔍 Type Inference

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

---

## 🔀 Union & Intersection

### Union Types

```typescript
// Either type
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
```

### Intersection Types

```typescript
// Combine types
type Name = { firstName: string; lastName: string };
type Age = { age: number };

type Person = Name & Age;

const person: Person = {
    firstName: "John",
    lastName: "Doe",
    age: 30
};

// Extending interfaces
interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    id: number;
    name: string;
}

type TimestampedUser = User & Timestamped;
```

---

## 🎯 Type Narrowing

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

// Equality narrowing
function compare(a: string | number, b: string | number) {
    if (a === b) {
        // Both are same type now
        return true;
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

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: `any` vs `unknown` khác nhau như thế nào?**

A:
- `any`: Bypass type checking, có thể gán và gọi bất kỳ thứ gì
- `unknown`: Type-safe, phải narrow type trước khi sử dụng
- Prefer `unknown` over `any` để giữ type safety

**Q: Type annotation vs inference?**

A:
- Inference: TypeScript tự suy luận type, code ngắn gọn
- Annotation: Developer chỉ định type, rõ ràng hơn
- Best practice: Để TypeScript infer khi có thể, annotate khi cần clarity

### 🟡 Mid-level

**Q: Giải thích type narrowing**

A: Type narrowing là quá trình thu hẹp type từ broader type xuống specific type thông qua:
- `typeof` checks
- Truthiness checks
- `instanceof` checks
- `in` operator
- Discriminated unions
- Custom type guards

**Q: Union vs Intersection types?**

A:
- Union (`|`): Either type A OR type B
- Intersection (`&`): Both type A AND type B
- Union: dùng cho values có thể là nhiều types
- Intersection: dùng để merge types

### 🔴 Senior

**Q: Implement exhaustive check cho discriminated union**

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

---

## 📚 Active Recall

1. [ ] List 5 primitive types trong TypeScript
2. [ ] Khi nào dùng `unknown` vs `any`?
3. [ ] Giải thích discriminated unions
4. [ ] Implement custom type guard
5. [ ] So sánh `readonly` vs `const`

---

> **Tiếp theo:** [02-interfaces-vs-types.md](./02-interfaces-vs-types.md) - Interfaces vs Types
