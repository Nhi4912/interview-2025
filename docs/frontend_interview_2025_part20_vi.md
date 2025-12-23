# 📚 Tài Liệu Phỏng Vấn Frontend 2025 - Phần 20

> **Chủ đề**: 🔷 TypeScript Advanced - TypeScript Nâng Cao

---

## 📋 Mục Lục

1. [Generics Deep Dive](#1-generics-deep-dive)
2. [Type Manipulation](#2-type-manipulation)
3. [Utility Types Deep Dive](#3-utility-types-deep-dive)
4. [Conditional Types](#4-conditional-types)
5. [Mapped Types](#5-mapped-types)
6. [Template Literal Types](#6-template-literal-types)
7. [React + TypeScript Patterns](#7-react--typescript-patterns)
8. [TypeScript Interview Questions](#8-typescript-interview-questions)

---

## 1. Generics Deep Dive

### 1.1 Basic Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>("hello"); // Explicit
const num = identity(42); // Inferred

// Generic interface
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: Response<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success",
};
```

### 1.2 Generic Constraints

```typescript
// Constraint with extends
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello"); // ✅ string has length
getLength([1, 2, 3]); // ✅ array has length
getLength(123); // ❌ number doesn't have length

// Constraint with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
getProperty(user, "name"); // ✅
getProperty(user, "email"); // ❌ 'email' doesn't exist
```

### 1.3 Multiple Type Parameters

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge({ name: "John" }, { age: 30 });
// Type: { name: string } & { age: number }

// Generic class
class KeyValuePair<K, V> {
  constructor(public key: K, public value: V) {}

  swap(): KeyValuePair<V, K> {
    return new KeyValuePair(this.value, this.key);
  }
}
```

### 1.4 Default Type Parameters

```typescript
interface PaginatedResponse<T, M = {}> {
  data: T[];
  page: number;
  totalPages: number;
  meta?: M;
}

// Using default
const response: PaginatedResponse<User> = {
  data: [],
  page: 1,
  totalPages: 10,
};

// With custom meta
const responseWithMeta: PaginatedResponse<User, { total: number }> = {
  data: [],
  page: 1,
  totalPages: 10,
  meta: { total: 100 },
};
```

---

## 2. Type Manipulation

### 2.1 Type Inference with infer

```typescript
// Extract return type
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(name: string): string {
  return `Hello, ${name}`;
}

type GreetReturn = ReturnTypeOf<typeof greet>; // string

// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type NumArr = ArrayElement<number[]>; // number

// Extract promise resolved type
type Awaited<T> = T extends Promise<infer R> ? R : T;

type Result = Awaited<Promise<string>>; // string
```

### 2.2 Type Guards

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase(); // TypeScript knows it's string
  }
  return value * 2; // TypeScript knows it's number
}

// instanceof guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// in operator guard
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

### 2.3 Discriminated Unions

```typescript
// Use literal types to discriminate
type Success = {
  status: "success";
  data: User;
};

type Error = {
  status: "error";
  message: string;
};

type Loading = {
  status: "loading";
};

type State = Success | Error | Loading;

function handleState(state: State) {
  switch (state.status) {
    case "success":
      console.log(state.data); // TypeScript knows data exists
      break;
    case "error":
      console.log(state.message); // TypeScript knows message exists
      break;
    case "loading":
      console.log("Loading...");
      break;
  }
}
```

---

## 3. Utility Types Deep Dive

### 3.1 Built-in Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// Partial - All optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required - All required
type RequiredUser = Required<User>;
// { id: number; name: string; email: string; age: number }

// Readonly - All readonly
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }

// Pick - Select properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit - Exclude properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string; age?: number }

// Record - Key-value mapping
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: 'admin' | 'user' | 'guest' }

// Extract - Extract from union
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // 'a'

// Exclude - Exclude from union
type T2 = Exclude<"a" | "b" | "c", "a">; // 'b' | 'c'

// NonNullable - Remove null/undefined
type T3 = NonNullable<string | null | undefined>; // string

// ReturnType - Get function return type
type T4 = ReturnType<() => string>; // string

// Parameters - Get function parameters
type T5 = Parameters<(a: string, b: number) => void>; // [string, number]
```

### 3.2 Custom Utility Types

```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserOptionalEmail = PartialBy<User, "email">;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Mutable (remove readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Nullable
type Nullable<T> = T | null;

// Values of object
type ValueOf<T> = T[keyof T];
```

---

## 4. Conditional Types

### 4.1 Basic Conditional Types

```typescript
// Syntax: T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Conditional with never
type NonString<T> = T extends string ? never : T;

type C = NonString<string | number | boolean>; // number | boolean
```

### 4.2 Distributive Conditional Types

```typescript
// Distributive over union
type ToArray<T> = T extends any ? T[] : never;

type D = ToArray<string | number>; // string[] | number[]

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type E = ToArrayNonDist<string | number>; // (string | number)[]
```

### 4.3 Advanced Patterns

```typescript
// Extract function arguments
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;

type F = FirstArg<(a: string, b: number) => void>; // string

// Flatten arrays
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type G = Flatten<number[][][]>; // number

// Get async function return type
type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

async function fetchUser(): Promise<User> {
  /* ... */
}
type H = AsyncReturnType<typeof fetchUser>; // User
```

---

## 5. Mapped Types

### 5.1 Basic Mapped Types

```typescript
// Map over keys
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }

// Add prefix to keys
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

type PrefixedPerson = Prefixed<Person, "user">;
// { userName: string; userAge: number }
```

### 5.2 Filter Keys

```typescript
// Keep only string properties
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
}

type StringsOnly = OnlyStrings<Mixed>;
// { name: string; email: string }

// Filter by key name
type FilterByKey<T, Pattern extends string> = {
  [K in keyof T as K extends `${Pattern}${string}` ? K : never]: T[K];
};
```

---

## 6. Template Literal Types

### 6.1 Basic Template Literals

```typescript
type EventName = `on${Capitalize<"click" | "focus" | "blur">}`;
// "onClick" | "onFocus" | "onBlur"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/api/${string}`;

type Endpoint = `${HttpMethod} ${ApiRoute}`;
// "GET /api/${string}" | "POST /api/${string}" | ...
```

### 6.2 String Manipulation Types

```typescript
// Built-in string utilities
type Upper = Uppercase<"hello">; // "HELLO"
type Lower = Lowercase<"HELLO">; // "hello"
type Cap = Capitalize<"hello">; // "Hello"
type Uncap = Uncapitalize<"Hello">; // "hello"

// Parse string to extract parts
type ExtractRoute<T> = T extends `${infer Method} /api/${infer Path}`
  ? { method: Method; path: Path }
  : never;

type Parsed = ExtractRoute<"GET /api/users">;
// { method: "GET"; path: "users" }
```

### 6.3 Practical Example: Type-safe Event Emitter

```typescript
type EventMap = {
  click: { x: number; y: number };
  focus: { target: HTMLElement };
  change: { value: string };
};

type EventCallback<T> = (data: T) => void;

class TypedEmitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Function[]>();

  on<K extends keyof Events>(event: K, callback: EventCallback<Events[K]>) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.push(callback);
    this.listeners.set(event, callbacks);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }
}

const emitter = new TypedEmitter<EventMap>();
emitter.on("click", ({ x, y }) => console.log(x, y)); // ✅ Type-safe
emitter.emit("click", { x: 10, y: 20 }); // ✅ Type-safe
```

---

## 7. React + TypeScript Patterns

### 7.1 Component Props

```typescript
// Basic props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

// Props with variants
interface ButtonPropsVariant extends ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

// Extending HTML element props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// Component with generic props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}
```

### 7.2 Hooks with TypeScript

```typescript
// useState
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState(0); // Inferred as number

// useRef
const inputRef = useRef<HTMLInputElement>(null);
const valueRef = useRef<number>(0); // Mutable ref

// useReducer
type State = { count: number };
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "set"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "set":
      return { count: action.payload };
  }
}

// useContext
interface ThemeContextType {
  theme: "light" | "dark";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

### 7.3 Custom Hooks

```typescript
// Generic fetch hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage
const { data, loading } = useFetch<User>("/api/user");

// Generic form hook
function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange =
    (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  return { values, handleChange, setValues };
}
```

### 7.4 Higher-Order Components

```typescript
// HOC type
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function WithLoadingComponent(props: P & { loading: boolean }) {
    const { loading, ...rest } = props;
    if (loading) return <Spinner />;
    return <Component {...(rest as P)} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);
```

---

## 8. TypeScript Interview Questions

### 8.1 Common Questions

<details>
<summary><strong>Q: Difference between interface and type?</strong></summary>

**Interface:**

- Can be extended/merged
- Better for objects/classes
- Declaration merging

**Type:**

- Can represent unions, tuples
- More flexible
- Cannot be merged

```typescript
// Declaration merging (interface only)
interface User {
  name: string;
}
interface User {
  age: number;
}
// Merged: { name: string; age: number; }

// Union (type only)
type Status = "active" | "inactive";
```

</details>

<details>
<summary><strong>Q: What is 'never' type?</strong></summary>

**Never** represents values that never occur:

- Functions that always throw
- Infinite loops
- Exhaustive checks

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

// Exhaustive check
type Shape = "circle" | "square";

function getArea(shape: Shape) {
  switch (shape) {
    case "circle":
      return 1;
    case "square":
      return 2;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

</details>

<details>
<summary><strong>Q: What is 'unknown' vs 'any'?</strong></summary>

**any:** Disables type checking
**unknown:** Type-safe any (must check before use)

```typescript
let a: any = 5;
a.foo(); // ✅ No error (dangerous!)

let b: unknown = 5;
b.foo(); // ❌ Error
if (typeof b === "object" && b !== null) {
  // Now safe to use
}
```

</details>

<details>
<summary><strong>Q: Explain 'as const'</strong></summary>

**as const** makes values deeply readonly and literal:

```typescript
const arr = [1, 2, 3]; // number[]
const arrConst = [1, 2, 3] as const; // readonly [1, 2, 3]

const obj = { name: "John" }; // { name: string }
const objConst = { name: "John" } as const; // { readonly name: "John" }
```

</details>

<details>
<summary><strong>Q: What are declaration files (.d.ts)?</strong></summary>

Declaration files provide type information for JavaScript libraries:

```typescript
// types.d.ts
declare module "my-library" {
  export function doSomething(x: string): number;
}
```

</details>

### 8.2 Coding Challenges

```typescript
// Challenge 1: Implement Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Challenge 2: Implement Readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Challenge 3: Implement ReturnType
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : never;

// Challenge 4: Implement Omit
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// Challenge 5: Deep Partial
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
```

---

## 📊 TypeScript Cheat Sheet

```
Basics:
  string, number, boolean, null, undefined
  any, unknown, never, void

Arrays:
  number[], Array<number>, [string, number] (tuple)

Objects:
  interface vs type
  optional: prop?: type
  readonly: readonly prop: type

Functions:
  (a: string, b?: number) => boolean

Generics:
  function<T>(arg: T): T
  T extends Constraint
  <T = DefaultType>

Utility Types:
  Partial, Required, Readonly
  Pick, Omit, Record
  Extract, Exclude
  ReturnType, Parameters

Guards:
  typeof, instanceof
  in, custom (is)

Advanced:
  infer, keyof, typeof
  Mapped types
  Conditional types
  Template literals
```

---

> **Chúc bạn phỏng vấn thành công! 🎉**
>
> _Tài liệu được tạo: 24/12/2025_
