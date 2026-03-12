# Interfaces vs Types - When to Use What

> Interface và Type Alias là hai cách define types. Hiểu sự khác biệt giúp chọn đúng tool.

---

## Mục Lục

- [Overview](#-overview)
- [Interface Basics](#-interface-basics)
- [Type Alias Basics](#-type-alias-basics)
- [Key Differences](#-key-differences)
- [When to Use](#-when-to-use)
- [Best Practices](#-best-practices)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              INTERFACE vs TYPE ALIAS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌───────────────────────┐     ┌───────────────────────┐        │
│   │      INTERFACE        │     │      TYPE ALIAS       │        │
│   ├───────────────────────┤     ├───────────────────────┤        │
│   │ • Object shapes       │     │ • Any type            │        │
│   │ • Declaration merging │     │ • Unions & tuples     │        │
│   │ • extends keyword     │     │ • Computed properties │        │
│   │ • implements in class │     │ • Mapped types        │        │
│   └───────────────────────┘     └───────────────────────┘        │
│                                                                   │
│   COMMON GROUND:                                                 │
│   • Object types                                                 │
│   • Function types                                               │
│   • Generics                                                     │
│   • Readonly/optional properties                                 │
│   • Index signatures                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📘 Interface Basics

### Defining Interfaces

```typescript
// Basic interface
interface User {
    id: number;
    name: string;
    email: string;
}

// Optional properties
interface Config {
    host: string;
    port?: number;
    ssl?: boolean;
}

// Readonly properties
interface Point {
    readonly x: number;
    readonly y: number;
}

// Index signatures
interface Dictionary {
    [key: string]: string;
}

// Function types
interface SearchFunc {
    (source: string, subString: string): boolean;
}

// Callable with properties
interface Counter {
    (): number;
    count: number;
    reset(): void;
}
```

### Extending Interfaces

```typescript
// Single inheritance
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

// Multiple inheritance
interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface Identified {
    id: string;
}

interface Entity extends Timestamped, Identified {
    name: string;
}

// Extending classes
class Control {
    private state: boolean = false;
}

interface ClickableControl extends Control {
    click(): void;
}
```

### Declaration Merging

```typescript
// Same interface declared multiple times = merged
interface User {
    id: number;
    name: string;
}

interface User {
    email: string;
}

// Result: User has id, name, AND email
const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};

// Useful for extending third-party libraries
declare global {
    interface Window {
        myCustomProperty: string;
    }
}

window.myCustomProperty = "value"; // Now valid!
```

### Implementing Interfaces

```typescript
interface Printable {
    print(): void;
}

interface Loggable {
    log(message: string): void;
}

class Document implements Printable, Loggable {
    print() {
        console.log("Printing...");
    }

    log(message: string) {
        console.log(`[LOG]: ${message}`);
    }
}
```

---

## 📗 Type Alias Basics

### Defining Type Aliases

```typescript
// Object types
type User = {
    id: number;
    name: string;
    email: string;
};

// Primitives
type ID = string | number;

// Unions
type Status = "pending" | "approved" | "rejected";

// Tuples
type Point = [number, number];
type NamedPoint = [x: number, y: number];

// Function types
type SearchFunc = (source: string, subString: string) => boolean;

// Template literal types
type EventName = `on${Capitalize<string>}`;
type ClickEvent = `on${"click" | "mousedown" | "mouseup"}`;
```

### Intersection Types

```typescript
type Name = {
    firstName: string;
    lastName: string;
};

type Age = {
    age: number;
};

type Person = Name & Age;

// More complex intersection
type Admin = Person & {
    permissions: string[];
};
```

### Mapped Types

```typescript
// Make all properties optional
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
    [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// Pick specific properties
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Example usage
type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};

type PublicUser = Pick<User, "id" | "name" | "email">;
type PartialUser = Partial<User>;
```

### Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extract and Exclude
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type Numbers = Extract<string | number | boolean, number>; // number
type NotNumbers = Exclude<string | number | boolean, number>; // string | boolean

// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = () => string;
type FnReturn = ReturnType<Fn>; // string
```

---

## ⚖️ Key Differences

### 1. Declaration Merging

```typescript
// Interface: CAN merge
interface User {
    name: string;
}

interface User {
    age: number;
}
// User = { name: string; age: number }

// Type: CANNOT merge
type Person = {
    name: string;
};

// Error: Duplicate identifier 'Person'
// type Person = {
//     age: number;
// };
```

### 2. Extends vs Intersection

```typescript
// Interface: extends keyword
interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

// Type: intersection
type Animal = {
    name: string;
};

type Dog = Animal & {
    breed: string;
};

// Both work, but interface shows clearer hierarchy
```

### 3. Union Types

```typescript
// Only Type can do unions
type Status = "loading" | "success" | "error";
type StringOrNumber = string | number;

// Interface cannot define union
// interface Status = "loading" | "success"; // Error!
```

### 4. Tuple Types

```typescript
// Type alias for tuples
type Point = [number, number];
type RGB = [red: number, green: number, blue: number];

// Interface can describe tuple-like structure, but more verbose
interface Point {
    0: number;
    1: number;
    length: 2;
}
```

### 5. Computed Properties

```typescript
// Type: can use computed properties
type PropName = "name" | "age";
type DynamicProps = {
    [K in PropName]: string;
};

// Interface: cannot
// interface DynamicProps {
//     [K in PropName]: string; // Error!
// }
```

### 6. Primitive Types

```typescript
// Type can alias primitives
type ID = string;
type Age = number;
type Name = string;

// Interface cannot
// interface ID = string; // Error!
```

---

## 🎯 When to Use

### Use Interface When:

```typescript
// 1. Defining object shapes for libraries/APIs
interface User {
    id: number;
    name: string;
}

// 2. You need declaration merging
interface Window {
    myCustomProp: string;
}

// 3. Defining class contracts
interface Repository<T> {
    find(id: string): T | null;
    save(item: T): void;
    delete(id: string): void;
}

class UserRepository implements Repository<User> {
    // ...
}

// 4. Extending/inheriting types
interface Admin extends User {
    permissions: string[];
}
```

### Use Type When:

```typescript
// 1. Union types
type Status = "pending" | "approved" | "rejected";
type Result<T> = Success<T> | Error;

// 2. Tuple types
type Coordinates = [number, number];
type Response = [data: User, error: null] | [data: null, error: Error];

// 3. Mapped types and utilities
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Keys = keyof User;

// 4. Computed types
type EventHandlers = {
    [K in `on${Capitalize<string>}`]: (event: Event) => void;
};

// 5. Aliasing primitives
type UserId = string;
type Timestamp = number;

// 6. Complex type operations
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
```

---

## ✅ Best Practices

### Consistency

```typescript
// Pick one and stick with it for object types
// Team decision: use interface for objects, type for everything else

// Objects
interface User {
    id: number;
    name: string;
}

// Unions, primitives, utilities
type Status = "active" | "inactive";
type UserId = string;
type PartialUser = Partial<User>;
```

### Naming Conventions

```typescript
// Don't prefix interfaces with 'I'
// ❌ Bad
interface IUser { }

// ✅ Good
interface User { }

// Type aliases can describe what they are
type UserId = string;
type UserMap = Map<string, User>;
type UserOrNull = User | null;
```

### Documentation

```typescript
/**
 * Represents a user in the system.
 * @property id - Unique identifier
 * @property name - Display name
 * @property email - Contact email
 */
interface User {
    id: number;
    name: string;
    email: string;
}
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Interface và Type khác nhau như thế nào?**

A:
- Interface: Object shapes, declaration merging, extends keyword
- Type: Any type (union, tuple, primitive), mapped types, computed properties
- Chọn interface cho objects, type cho unions/utilities

### 🟡 Mid-level

**Q: Declaration merging là gì? Khi nào hữu ích?**

A: Khi declare interface cùng tên nhiều lần, TypeScript merge thành một. Useful cho:
- Extending third-party type definitions
- Augmenting global objects (Window, NodeJS.Process)
- Plugin systems

```typescript
// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
```

### 🔴 Senior

**Q: Khi nào interface performs better than type?**

A: Interface has slight performance advantage:
- Cached by name in compiler
- Faster for simple extends
- Better error messages

Type aliases are:
- Re-evaluated more often
- More flexible but slightly slower for complex operations

In practice, difference is negligible. Choose based on semantics.

---

## 📚 Active Recall

1. [ ] List 3 things only Type can do
2. [ ] List 3 things only Interface can do
3. [ ] Explain declaration merging
4. [ ] When to use extends vs intersection?
5. [ ] Write mapped type từ scratch

---

> **Tiếp theo:** [03-generics.md](./03-generics.md) - Generics Deep Dive
