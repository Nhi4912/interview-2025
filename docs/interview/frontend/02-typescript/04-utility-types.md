# TypeScript Utility Types - Complete Reference

> Built-in utility types giúp transform types một cách elegant. Essential cho TypeScript mastery.

---

## Mục Lục

- [Overview](#-overview)
- [Property Modifiers](#-property-modifiers)
- [Type Selection](#-type-selection)
- [Function Types](#-function-types)
- [String Manipulation](#-string-manipulation)
- [Custom Utilities](#-custom-utilities)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  UTILITY TYPES CATEGORIES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   PROPERTY MODIFIERS          TYPE SELECTION                     │
│   ┌────────────────────┐     ┌────────────────────┐             │
│   │ Partial<T>         │     │ Pick<T, K>         │             │
│   │ Required<T>        │     │ Omit<T, K>         │             │
│   │ Readonly<T>        │     │ Extract<T, U>      │             │
│   │ Mutable<T>         │     │ Exclude<T, U>      │             │
│   └────────────────────┘     │ NonNullable<T>     │             │
│                               └────────────────────┘             │
│                                                                   │
│   OBJECT TYPES                FUNCTION TYPES                     │
│   ┌────────────────────┐     ┌────────────────────┐             │
│   │ Record<K, V>       │     │ ReturnType<T>      │             │
│   │ PropertyKey        │     │ Parameters<T>      │             │
│   └────────────────────┘     │ ConstructorParameters│            │
│                               │ InstanceType<T>    │             │
│   STRING MANIPULATION        │ ThisParameterType  │             │
│   ┌────────────────────┐     └────────────────────┘             │
│   │ Uppercase<T>       │                                         │
│   │ Lowercase<T>       │     PROMISE/ASYNC                      │
│   │ Capitalize<T>      │     ┌────────────────────┐             │
│   │ Uncapitalize<T>    │     │ Awaited<T>         │             │
│   └────────────────────┘     └────────────────────┘             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Property Modifiers

### Partial<T>

Makes all properties optional.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

type PartialUser = Partial<User>;
// {
//     id?: number;
//     name?: string;
//     email?: string;
// }

// Use case: Update functions
function updateUser(id: number, updates: Partial<User>): User {
    const user = getUser(id);
    return { ...user, ...updates };
}

updateUser(1, { name: "John" }); // Only update name
```

### Required<T>

Makes all properties required.

```typescript
interface Config {
    host?: string;
    port?: number;
    ssl?: boolean;
}

type RequiredConfig = Required<Config>;
// {
//     host: string;
//     port: number;
//     ssl: boolean;
// }

// Use case: Ensure all config values present
function initializeServer(config: RequiredConfig): void {
    // config.host is guaranteed to exist
}
```

### Readonly<T>

Makes all properties readonly.

```typescript
interface Point {
    x: number;
    y: number;
}

type ReadonlyPoint = Readonly<Point>;
// {
//     readonly x: number;
//     readonly y: number;
// }

const point: ReadonlyPoint = { x: 10, y: 20 };
// point.x = 5; // Error: Cannot assign to 'x' because it is a read-only property
```

### Mutable<T> (Custom)

Remove readonly from all properties.

```typescript
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};

interface FrozenUser {
    readonly id: number;
    readonly name: string;
}

type MutableUser = Mutable<FrozenUser>;
// {
//     id: number;
//     name: string;
// }
```

---

## 🎯 Type Selection

### Pick<T, K>

Select specific properties.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

type PublicUser = Pick<User, "id" | "name" | "email">;
// {
//     id: number;
//     name: string;
//     email: string;
// }

// Use case: API response types
function getPublicProfile(userId: string): PublicUser {
    const user = getUser(userId);
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
}
```

### Omit<T, K>

Exclude specific properties.

```typescript
type UserWithoutPassword = Omit<User, "password">;
// {
//     id: number;
//     name: string;
//     email: string;
//     createdAt: Date;
// }

// Multiple keys
type CreateUserInput = Omit<User, "id" | "createdAt">;
// {
//     name: string;
//     email: string;
//     password: string;
// }
```

### Extract<T, U>

Extract types assignable to U.

```typescript
type Numbers = Extract<string | number | boolean, number>;
// number

type StringOrNumber = Extract<string | number | boolean | object, string | number>;
// string | number

// Use case: Filter union types
type Events = "click" | "scroll" | "mousemove" | "keydown" | "keyup";
type MouseEvents = Extract<Events, "click" | "scroll" | "mousemove">;
// "click" | "scroll" | "mousemove"
```

### Exclude<T, U>

Exclude types assignable to U.

```typescript
type NotNumbers = Exclude<string | number | boolean, number>;
// string | boolean

type NotNull = Exclude<string | null | undefined, null | undefined>;
// string

// Use case: Remove event types
type KeyboardEvents = Exclude<Events, "click" | "scroll" | "mousemove">;
// "keydown" | "keyup"
```

### NonNullable<T>

Remove null and undefined.

```typescript
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// string

// Use case: Ensure value exists
function processValue<T>(value: T): NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value is required");
    }
    return value as NonNullable<T>;
}
```

---

## 📦 Object Types

### Record<K, V>

Create object type with keys K and values V.

```typescript
// String keys
type UserMap = Record<string, User>;
const users: UserMap = {
    "user1": { id: 1, name: "John", email: "john@example.com", password: "...", createdAt: new Date() },
};

// Union keys
type Status = "pending" | "approved" | "rejected";
type StatusMessages = Record<Status, string>;
const messages: StatusMessages = {
    pending: "Your request is pending",
    approved: "Your request has been approved",
    rejected: "Your request has been rejected"
};

// Use case: Lookup tables
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type EndpointConfig = Record<HttpMethod, { path: string; auth: boolean }>;
```

---

## 🔄 Function Types

### ReturnType<T>

Get function's return type.

```typescript
function createUser(name: string, email: string): User {
    return { id: 1, name, email, password: "", createdAt: new Date() };
}

type CreateUserReturn = ReturnType<typeof createUser>;
// User

// Async functions
async function fetchUser(id: string): Promise<User> {
    // ...
}

type FetchUserReturn = ReturnType<typeof fetchUser>;
// Promise<User>

type FetchUserData = Awaited<ReturnType<typeof fetchUser>>;
// User
```

### Parameters<T>

Get function's parameter types as tuple.

```typescript
function greet(name: string, age: number): string {
    return `Hello ${name}, you are ${age}`;
}

type GreetParams = Parameters<typeof greet>;
// [string, number]

// Use case: Wrapper functions
function withLogging<T extends (...args: any[]) => any>(fn: T) {
    return (...args: Parameters<T>): ReturnType<T> => {
        console.log("Calling with:", args);
        return fn(...args);
    };
}

const loggedGreet = withLogging(greet);
loggedGreet("John", 30); // Fully typed!
```

### ConstructorParameters<T>

Get constructor parameter types.

```typescript
class Person {
    constructor(public name: string, public age: number) {}
}

type PersonParams = ConstructorParameters<typeof Person>;
// [string, number]

// Use case: Factory functions
function createPerson(...args: ConstructorParameters<typeof Person>): Person {
    return new Person(...args);
}
```

### InstanceType<T>

Get instance type from constructor.

```typescript
type PersonInstance = InstanceType<typeof Person>;
// Person

// Use case: Generic factories
function createInstance<T extends new (...args: any[]) => any>(
    ctor: T,
    ...args: ConstructorParameters<T>
): InstanceType<T> {
    return new ctor(...args);
}

const person = createInstance(Person, "John", 30);
// person: Person
```

### ThisParameterType<T> & OmitThisParameter<T>

```typescript
function greet(this: { name: string }, greeting: string): string {
    return `${greeting}, ${this.name}!`;
}

type GreetThis = ThisParameterType<typeof greet>;
// { name: string }

type GreetWithoutThis = OmitThisParameter<typeof greet>;
// (greeting: string) => string
```

---

## 📝 String Manipulation

### Case Transformations

```typescript
type Upper = Uppercase<"hello">;
// "HELLO"

type Lower = Lowercase<"HELLO">;
// "hello"

type Cap = Capitalize<"hello">;
// "Hello"

type Uncap = Uncapitalize<"Hello">;
// "hello"

// Use case: Event handlers
type EventName = "click" | "scroll" | "focus";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onScroll" | "onFocus"

type EventHandlers<T extends string> = {
    [K in T as `on${Capitalize<K>}`]: (event: Event) => void;
};

type Handlers = EventHandlers<EventName>;
// {
//     onClick: (event: Event) => void;
//     onScroll: (event: Event) => void;
//     onFocus: (event: Event) => void;
// }
```

---

## 🛠️ Custom Utilities

### DeepPartial

```typescript
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

interface NestedConfig {
    server: {
        host: string;
        port: number;
        ssl: {
            enabled: boolean;
            cert: string;
        };
    };
}

type PartialConfig = DeepPartial<NestedConfig>;
// All nested properties are optional
```

### DeepReadonly

```typescript
type DeepReadonly<T> = T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;
```

### Nullable

```typescript
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};

interface User {
    name: string;
    age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null; }
```

### RequiredKeys / OptionalKeys

```typescript
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Mixed {
    required: string;
    optional?: number;
}

type Required = RequiredKeys<Mixed>; // "required"
type Optional = OptionalKeys<Mixed>; // "optional"
```

### Flatten

```typescript
type Flatten<T> = T extends Array<infer U> ? U : T;

type Nested = number[];
type Flat = Flatten<Nested>; // number

type NotArray = string;
type Same = Flatten<NotArray>; // string
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Partial và Required làm gì?**

A:
- `Partial<T>`: Makes all properties optional
- `Required<T>`: Makes all properties required

**Q: Pick vs Omit?**

A:
- `Pick<T, K>`: Select specific properties
- `Omit<T, K>`: Exclude specific properties

### 🟡 Mid-level

**Q: Implement Partial từ scratch**

```typescript
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};
```

**Q: Implement Pick từ scratch**

```typescript
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

### 🔴 Senior

**Q: Implement DeepRequired**

```typescript
type DeepRequired<T> = T extends object
    ? { [K in keyof T]-?: DeepRequired<T[K]> }
    : T;
```

**Q: Implement ReadonlyExcept<T, K> (readonly all except K)**

```typescript
type ReadonlyExcept<T, K extends keyof T> =
    Readonly<Omit<T, K>> & Pick<T, K>;

interface User {
    id: number;
    name: string;
    email: string;
}

type UserWithMutableEmail = ReadonlyExcept<User, "email">;
// { readonly id: number; readonly name: string; email: string; }
```

---

## 📚 Active Recall

1. [ ] List 5 property modifier utility types
2. [ ] Implement Omit using Pick and Exclude
3. [ ] Khi nào dùng Record?
4. [ ] Implement ReturnType từ scratch
5. [ ] Create custom DeepPartial type

---

> **Tiếp theo:** [05-advanced-patterns.md](./05-advanced-patterns.md) - Advanced TypeScript Patterns
