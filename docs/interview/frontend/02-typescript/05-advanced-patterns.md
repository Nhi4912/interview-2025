# Advanced TypeScript Patterns

> Patterns nâng cao cho type-safe applications. Essential cho senior TypeScript developers.

---

## Mục Lục

- [Discriminated Unions](#-discriminated-unions)
- [Type Guards](#-type-guards)
- [Branded Types](#-branded-types)
- [Builder Pattern](#-builder-pattern)
- [Functional Patterns](#-functional-patterns)
- [Câu Hỏi Phỏng Vấn](#-câu-hỏi-phỏng-vấn)

---

## 🏷️ Discriminated Unions

```typescript
// Basic discriminated union
type Result<T> =
    | { status: "success"; data: T }
    | { status: "error"; error: Error }
    | { status: "loading" };

function handleResult<T>(result: Result<T>): void {
    switch (result.status) {
        case "success":
            console.log(result.data); // TypeScript knows data exists
            break;
        case "error":
            console.error(result.error); // TypeScript knows error exists
            break;
        case "loading":
            console.log("Loading...");
            break;
    }
}

// Shape example
type Circle = { kind: "circle"; radius: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };
type Triangle = { kind: "triangle"; base: number; height: number };

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

// Exhaustive check
function assertNever(x: never): never {
    throw new Error(`Unexpected value: ${x}`);
}

function getAreaExhaustive(shape: Shape): number {
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

### API Response Pattern

```typescript
type ApiResponse<T> =
    | { type: "success"; data: T; timestamp: Date }
    | { type: "error"; code: number; message: string }
    | { type: "loading" }
    | { type: "idle" };

function useApiData<T>(fetcher: () => Promise<T>) {
    const [state, setState] = useState<ApiResponse<T>>({ type: "idle" });

    const fetchData = async () => {
        setState({ type: "loading" });
        try {
            const data = await fetcher();
            setState({ type: "success", data, timestamp: new Date() });
        } catch (error) {
            setState({
                type: "error",
                code: 500,
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    return { state, fetchData };
}
```

---

## 🛡️ Type Guards

### typeof Guards

```typescript
function processValue(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}
```

### instanceof Guards

```typescript
class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat): void {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}
```

### in Operator

```typescript
interface Fish {
    swim: () => void;
}

interface Bird {
    fly: () => void;
}

function move(animal: Fish | Bird): void {
    if ("swim" in animal) {
        animal.swim();
    } else {
        animal.fly();
    }
}
```

### Custom Type Guards

```typescript
// Type predicate
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function processUnknown(value: unknown): void {
    if (isString(value)) {
        console.log(value.toUpperCase()); // TypeScript knows it's string
    }
}

// Object type guard
interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value &&
        "email" in value
    );
}

// Array type guard
function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}
```

### Assertion Functions

```typescript
function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Not a string");
    }
}

function processValue(value: unknown): void {
    assertIsString(value);
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
}

// Assert non-null
function assertDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value is null or undefined");
    }
}
```

---

## 🏅 Branded Types

Prevent mixing structurally identical types.

```typescript
// Problem: These are interchangeable
type UserId = string;
type ProductId = string;

function getUser(id: UserId): User { /* ... */ }
function getProduct(id: ProductId): Product { /* ... */ }

const userId: UserId = "user-123";
getProduct(userId); // No error, but wrong!

// Solution: Branded types
type Brand<K, T> = K & { __brand: T };

type BrandedUserId = Brand<string, "UserId">;
type BrandedProductId = Brand<string, "ProductId">;

function createUserId(id: string): BrandedUserId {
    return id as BrandedUserId;
}

function createProductId(id: string): BrandedProductId {
    return id as BrandedProductId;
}

function getUserBranded(id: BrandedUserId): User { /* ... */ }
function getProductBranded(id: BrandedProductId): Product { /* ... */ }

const brandedUserId = createUserId("user-123");
const brandedProductId = createProductId("prod-456");

getUserBranded(brandedUserId); // OK
// getUserBranded(brandedProductId); // Error!

// Practical example: Currency
type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;

function usd(amount: number): USD {
    return amount as USD;
}

function eur(amount: number): EUR {
    return amount as EUR;
}

function addUSD(a: USD, b: USD): USD {
    return (a + b) as USD;
}

const price1 = usd(10);
const price2 = usd(20);
const price3 = eur(15);

addUSD(price1, price2); // OK
// addUSD(price1, price3); // Error: EUR is not assignable to USD
```

---

## 🏗️ Builder Pattern

```typescript
interface RequestConfig {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

class RequestBuilder {
    private config: Partial<RequestConfig> = {};

    url(url: string): this {
        this.config.url = url;
        return this;
    }

    method(method: RequestConfig["method"]): this {
        this.config.method = method;
        return this;
    }

    header(key: string, value: string): this {
        this.config.headers = {
            ...this.config.headers,
            [key]: value
        };
        return this;
    }

    body(body: unknown): this {
        this.config.body = body;
        return this;
    }

    timeout(ms: number): this {
        this.config.timeout = ms;
        return this;
    }

    build(): RequestConfig {
        if (!this.config.url || !this.config.method) {
            throw new Error("URL and method are required");
        }
        return this.config as RequestConfig;
    }
}

// Usage
const request = new RequestBuilder()
    .url("/api/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .body({ name: "John" })
    .timeout(5000)
    .build();
```

### Type-Safe Builder with Required Steps

```typescript
interface RequiredFields {
    url: string;
    method: string;
}

interface OptionalFields {
    headers: Record<string, string>;
    body: unknown;
}

type BuilderState = {
    [K in keyof RequiredFields]?: RequiredFields[K];
} & Partial<OptionalFields>;

class TypedBuilder<T extends BuilderState = {}> {
    constructor(private state: T = {} as T) {}

    url<U extends string>(url: U): TypedBuilder<T & { url: U }> {
        return new TypedBuilder({ ...this.state, url });
    }

    method<M extends string>(method: M): TypedBuilder<T & { method: M }> {
        return new TypedBuilder({ ...this.state, method });
    }

    header(key: string, value: string): TypedBuilder<T> {
        const headers = { ...this.state.headers, [key]: value };
        return new TypedBuilder({ ...this.state, headers });
    }

    build(
        this: TypedBuilder<T & RequiredFields>
    ): T & RequiredFields {
        return this.state as T & RequiredFields;
    }
}

// Must have url and method before build
const config = new TypedBuilder()
    .url("/api")
    .method("GET")
    .header("Auth", "token")
    .build(); // Works!

// const invalid = new TypedBuilder()
//     .url("/api")
//     .build(); // Error: 'build' does not exist (missing method)
```

---

## 🔧 Functional Patterns

### Pipe Function

```typescript
type Fn<A, B> = (a: A) => B;

function pipe<A, B>(fn1: Fn<A, B>): Fn<A, B>;
function pipe<A, B, C>(fn1: Fn<A, B>, fn2: Fn<B, C>): Fn<A, C>;
function pipe<A, B, C, D>(fn1: Fn<A, B>, fn2: Fn<B, C>, fn3: Fn<C, D>): Fn<A, D>;
function pipe(...fns: Fn<any, any>[]): Fn<any, any> {
    return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

const addOne = (x: number) => x + 1;
const double = (x: number) => x * 2;
const toString = (x: number) => x.toString();

const process = pipe(addOne, double, toString);
process(5); // "12" - (5 + 1) * 2 = 12, then toString
```

### Result Type (Either)

```typescript
type Ok<T> = { ok: true; value: T };
type Err<E> = { ok: false; error: E };
type Result<T, E> = Ok<T> | Err<E>;

function ok<T>(value: T): Ok<T> {
    return { ok: true, value };
}

function err<E>(error: E): Err<E> {
    return { ok: false, error };
}

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    if (result.ok) {
        return ok(fn(result.value));
    }
    return result;
}

function flatMap<T, U, E>(
    result: Result<T, E>,
    fn: (value: T) => Result<U, E>
): Result<U, E> {
    if (result.ok) {
        return fn(result.value);
    }
    return result;
}

// Usage
function parseJSON(json: string): Result<unknown, Error> {
    try {
        return ok(JSON.parse(json));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Parse error"));
    }
}

function validateUser(data: unknown): Result<User, string> {
    if (!isUser(data)) {
        return err("Invalid user data");
    }
    return ok(data);
}

const result = flatMap(
    parseJSON('{"id": 1, "name": "John", "email": "john@example.com"}'),
    (data) => validateUser(data)
);
```

### Option Type (Maybe)

```typescript
type Some<T> = { type: "some"; value: T };
type None = { type: "none" };
type Option<T> = Some<T> | None;

function some<T>(value: T): Some<T> {
    return { type: "some", value };
}

const none: None = { type: "none" };

function fromNullable<T>(value: T | null | undefined): Option<T> {
    return value != null ? some(value) : none;
}

function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
    if (option.type === "some") {
        return some(fn(option.value));
    }
    return none;
}

function getOrElse<T>(option: Option<T>, defaultValue: T): T {
    return option.type === "some" ? option.value : defaultValue;
}

// Usage
function findUser(id: string): Option<User> {
    const user = users.find(u => u.id === id);
    return fromNullable(user);
}

const userName = getOrElse(
    mapOption(findUser("123"), u => u.name),
    "Unknown"
);
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: Discriminated union là gì?**

A: Union type với common property (discriminant) giúp TypeScript narrow type trong switch/if.

### 🟡 Mid-level

**Q: Viết custom type guard**

```typescript
function isError(value: unknown): value is Error {
    return value instanceof Error;
}
```

**Q: Branded types dùng để làm gì?**

A: Prevent mixing structurally identical types (e.g., UserId vs ProductId) at compile time.

### 🔴 Senior

**Q: Implement type-safe Result type với map và flatMap**

A: See Result Type section above.

**Q: Design type-safe event emitter**

```typescript
type EventMap = {
    login: { userId: string };
    logout: void;
};

class TypedEmitter<T extends Record<string, any>> {
    private listeners = new Map<keyof T, Set<Function>>();

    on<K extends keyof T>(
        event: K,
        listener: T[K] extends void ? () => void : (payload: T[K]) => void
    ): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        return () => this.listeners.get(event)!.delete(listener);
    }

    emit<K extends keyof T>(
        event: K,
        ...args: T[K] extends void ? [] : [T[K]]
    ): void {
        this.listeners.get(event)?.forEach(fn => fn(...args));
    }
}
```

---

## 📚 Active Recall

1. [ ] Implement exhaustive check cho discriminated union
2. [ ] Create branded type cho Email
3. [ ] Write type guard cho array của objects
4. [ ] Implement Result type với error handling
5. [ ] Design builder pattern với required fields

---

> **Tiếp theo:** [06-typescript-with-react.md](./06-typescript-with-react.md) - TypeScript with React
