# TypeScript Generics - Deep Dive

> Generics cho phép viết reusable, type-safe code. Must-know cho professional TypeScript development.

---

## Mục Lục

- [Overview](#-overview)
- [Basic Generics](#-basic-generics)
- [Generic Constraints](#-generic-constraints)
- [Generic Utilities](#-generic-utilities)
- [Advanced Patterns](#-advanced-patterns)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHY GENERICS?                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   WITHOUT GENERICS:                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ function identity(arg: any): any {                       │   │
│   │     return arg;                                          │   │
│   │ }                                                        │   │
│   │ // Loses type information!                               │   │
│   │ const result = identity("hello"); // result: any        │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│   WITH GENERICS:                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ function identity<T>(arg: T): T {                        │   │
│   │     return arg;                                          │   │
│   │ }                                                        │   │
│   │ // Type preserved!                                       │   │
│   │ const result = identity("hello"); // result: string     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔷 Basic Generics

### Generic Functions

```typescript
// Basic generic function
function identity<T>(arg: T): T {
    return arg;
}

// Usage
const str = identity("hello");      // string
const num = identity(42);           // number
const obj = identity({ x: 1 });     // { x: number }

// Explicit type argument
const explicit = identity<string>("hello");

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const p = pair("hello", 42); // [string, number]
```

### Generic Interfaces

```typescript
// Generic interface
interface Box<T> {
    value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

// Generic interface with methods
interface Repository<T> {
    find(id: string): T | null;
    findAll(): T[];
    save(item: T): void;
    delete(id: string): void;
}

// Implementation
class UserRepository implements Repository<User> {
    private users: User[] = [];

    find(id: string): User | null {
        return this.users.find(u => u.id === id) || null;
    }

    findAll(): User[] {
        return [...this.users];
    }

    save(user: User): void {
        this.users.push(user);
    }

    delete(id: string): void {
        this.users = this.users.filter(u => u.id !== id);
    }
}
```

### Generic Classes

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop(); // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
```

### Generic Type Aliases

```typescript
// Generic type alias
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };

// Usage
function fetchUser(id: string): Result<User> {
    // ...
    return { success: true, data: { id, name: "John" } };
}

// Generic array type
type List<T> = T[];

// Generic function type
type Mapper<T, U> = (item: T) => U;

const toUpperCase: Mapper<string, string> = (s) => s.toUpperCase();
```

---

## 🔒 Generic Constraints

### extends Keyword

```typescript
// Constrain T to have length property
function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;
}

getLength("hello");     // OK - string has length
getLength([1, 2, 3]);   // OK - array has length
getLength({ length: 5 }); // OK - object with length
// getLength(123);      // Error - number doesn't have length

// Constrain to specific type
interface Printable {
    print(): void;
}

function printAll<T extends Printable>(items: T[]): void {
    items.forEach(item => item.print());
}
```

### keyof Constraint

```typescript
// K must be a key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { name: "John", age: 30 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age");   // number
// getProperty(user, "email"); // Error - "email" not in user

// Practical example: pick function
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        result[key] = obj[key];
    });
    return result;
}

const picked = pick(user, ["name"]); // { name: string }
```

### Multiple Constraints

```typescript
// Multiple constraints with intersection
interface Named {
    name: string;
}

interface Aged {
    age: number;
}

function greet<T extends Named & Aged>(entity: T): string {
    return `Hello, ${entity.name}! You are ${entity.age} years old.`;
}

greet({ name: "John", age: 30, email: "john@example.com" }); // OK
```

---

## 🛠️ Generic Utilities

### Built-in Utility Types

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Partial<T> - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Required<T> - All properties required
interface Config {
    host?: string;
    port?: number;
}
type RequiredConfig = Required<Config>;
// { host: string; port: number; }

// Readonly<T> - All properties readonly
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }

// Pick<T, K> - Select specific properties
type PublicUser = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// Omit<T, K> - Exclude specific properties
type UserWithoutPassword = Omit<User, "password">;
// { id: number; name: string; email: string; }

// Record<K, V> - Object with keys K and values V
type UserRoles = Record<string, User>;
// { [key: string]: User }

type Status = "pending" | "approved" | "rejected";
type StatusMessages = Record<Status, string>;
// { pending: string; approved: string; rejected: string; }

// Extract<T, U> - Extract types assignable to U
type Numbers = Extract<string | number | boolean, number>;
// number

// Exclude<T, U> - Exclude types assignable to U
type NotNumbers = Exclude<string | number | boolean, number>;
// string | boolean

// NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// string

// ReturnType<T> - Get function return type
function getUser(): User {
    return { id: 1, name: "John", email: "john@example.com", password: "..." };
}
type UserReturn = ReturnType<typeof getUser>;
// User

// Parameters<T> - Get function parameter types
type GetUserParams = Parameters<typeof getUser>;
// []

function createUser(name: string, age: number): User {
    // ...
}
type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
```

### Custom Utility Types

```typescript
// Deep Partial
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

interface Address {
    street: string;
    city: string;
}

interface Person {
    name: string;
    address: Address;
}

type DeepPartialPerson = DeepPartial<Person>;
// { name?: string; address?: { street?: string; city?: string } }

// Nullable
type Nullable<T> = T | null;

// Awaited (get type inside Promise)
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

async function fetchData(): Promise<string> {
    return "data";
}
type DataType = Awaited<ReturnType<typeof fetchData>>;
// string
```

---

## 🚀 Advanced Patterns

### Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[]

// Prevent distribution with tuple
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDistributive<string | number>;
// (string | number)[]
```

### infer Keyword

```typescript
// Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Fn = (x: number) => string;
type FnReturn = GetReturnType<Fn>; // string

// Extract first argument
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type Fn2 = (name: string, age: number) => void;
type FirstParam = FirstArg<Fn2>; // string

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

type StringArray = string[];
type Elem = ElementType<StringArray>; // string

// Extract Promise value
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type Unwrapped = UnwrapPromise<PromiseString>; // string
```

### Mapped Types

```typescript
// Make all properties optional
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

// Make all properties required
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};

// Make all properties readonly
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

// Remove readonly
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

// Rename keys
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
    name: string;
    age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// Filter keys
type OnlyStrings<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
    name: string;
    age: number;
    email: string;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; email: string; }
```

### Template Literal Types

```typescript
// Basic template literals
type EventName = `on${Capitalize<string>}`;
// `on${string}` - matches "onClick", "onSubmit", etc.

type Method = "get" | "post" | "put" | "delete";
type Endpoint = `/${string}`;
type Route = `${Uppercase<Method>} ${Endpoint}`;
// "GET /...", "POST /...", etc.

// Event handlers
type EventHandlers<T extends string> = {
    [K in T as `on${Capitalize<K>}`]: (event: Event) => void;
};

type ButtonEvents = EventHandlers<"click" | "hover" | "focus">;
// { onClick: (event: Event) => void; onHover: ...; onFocus: ...; }

// CSS properties
type CSSProperty = "margin" | "padding";
type Direction = "top" | "right" | "bottom" | "left";
type CSSDirectional = `${CSSProperty}-${Direction}`;
// "margin-top" | "margin-right" | ... | "padding-left"
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Generic là gì? Tại sao cần?**

A: Generics cho phép viết code type-safe mà flexible. Thay vì dùng `any` mất type info, generics preserve type qua function/class.

### 🟡 Mid-level

**Q: `extends` trong generic làm gì?**

A: Constrain generic type phải satisfy điều kiện:
- `T extends string` - T phải là string
- `T extends { length: number }` - T phải có length property
- `K extends keyof T` - K phải là key của T

**Q: Giải thích `infer` keyword**

A: `infer` dùng trong conditional types để extract type:
```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```
Extract return type R từ function type T.

### 🔴 Senior

**Q: Implement DeepReadonly utility type**

```typescript
type DeepReadonly<T> = T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
```

**Q: Làm sao create type-safe event emitter?**

```typescript
type EventMap = {
    login: { userId: string };
    logout: void;
    error: Error;
};

class TypedEventEmitter<T extends Record<string, any>> {
    on<K extends keyof T>(
        event: K,
        listener: (payload: T[K]) => void
    ): void {
        // ...
    }

    emit<K extends keyof T>(event: K, payload: T[K]): void {
        // ...
    }
}

const emitter = new TypedEventEmitter<EventMap>();
emitter.on("login", ({ userId }) => console.log(userId));
emitter.emit("login", { userId: "123" });
```

---

## 📚 Active Recall

1. [ ] Viết generic Stack class
2. [ ] Implement Pick utility type từ scratch
3. [ ] Giải thích distributive conditional types
4. [ ] Tạo type-safe React component với generics
5. [ ] Implement Awaited utility type

---

> **Tiếp theo:** [04-utility-types.md](./04-utility-types.md) - Built-in Utility Types Deep Dive
