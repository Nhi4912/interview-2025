# Advanced TypeScript Types / Kiểu TypeScript Nâng Cao

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## TypeScript - Chapter 2 / TypeScript - Chương 2

[← Previous: TypeScript Basics](./01-typescript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Generics Deep Dive →](./03-generics-deep-dive.md)

---


## Visual: TypeScript Type System Map / Sơ Đồ Hệ Thống Kiểu

```
TypeScript Types Relationships:

  ┌──────────────────────────────────────────────────────────┐
  │                    unknown                               │
  │  (top type — must narrow before use)                    │
  │  ┌────────────────────────────────────────────────────┐  │
  │  │                   any                             │  │
  │  │  (opt out of type checking — avoid!)             │  │
  │  └────────────────────────────────────────────────────┘  │
  │                                                          │
  │  string | number | boolean | null | undefined | ...      │
  │                                                          │
  │  ┌──────────────────────────────────────────────────┐   │
  │  │                  never                           │   │
  │  │  (bottom type — unreachable code, empty union)  │   │
  │  └──────────────────────────────────────────────────┘   │
  └──────────────────────────────────────────────────────────┘

TYPE MANIPULATION CHEATSHEET:

Utility Type      | Input                    | Output
──────────────────|──────────────────────────|─────────────────────────
Partial<T>        | {a: string, b: number}   | {a?: string, b?: number}
Required<T>       | {a?: string, b?: number} | {a: string, b: number}
Readonly<T>       | {a: string}              | {readonly a: string}
Pick<T, K>        | {a, b, c}, 'a'|'b'       | {a, b}
Omit<T, K>        | {a, b, c}, 'c'           | {a, b}
Record<K, V>      | 'x'|'y', number          | {x: number, y: number}
Exclude<T, U>     | 'a'|'b'|'c', 'a'         | 'b'|'c'
Extract<T, U>     | 'a'|'b'|'c', 'a'|'b'     | 'a'|'b'
NonNullable<T>    | string|null|undefined    | string
ReturnType<F>     | () => number             | number
Parameters<F>     | (x: string) => void      | [string]

MAPPED TYPE PATTERN:
  {[K in keyof T]: Transform<T[K]>}
   └── iterate   └── transform each property type

CONDITIONAL TYPE PATTERN:
  T extends U ? X : Y
  "if T is assignable to U, use X, else use Y"
```

## Overview / Tổng Quan

**English:** Advanced TypeScript types enable powerful type manipulation and inference. Mastering these concepts is crucial for senior frontend interviews at Big Tech companies.

**Tiếng Việt:** Các kiểu TypeScript nâng cao cho phép thao tác và suy luận kiểu mạnh mẽ. Thành thạo các khái niệm này rất quan trọng cho phỏng vấn frontend cấp cao tại các công ty Big Tech.

---

## Table of Contents / Mục Lục

1. [Utility Types / Kiểu Tiện Ích](#utility-types--kiểu-tiện-ích)
2. [Mapped Types / Kiểu Ánh Xạ](#mapped-types--kiểu-ánh-xạ)
3. [Conditional Types / Kiểu Điều Kiện](#conditional-types--kiểu-điều-kiện)
4. [Template Literal Types / Kiểu Template Literal](#template-literal-types--kiểu-template-literal)
5. [Discriminated Unions / Union Phân Biệt](#discriminated-unions--union-phân-biệt)
6. [Type Guards / Bảo Vệ Kiểu](#type-guards--bảo-vệ-kiểu)
7. [Index Signatures / Chữ Ký Index](#index-signatures--chữ-ký-index)
8. [Recursive Types / Kiểu Đệ Quy](#recursive-types--kiểu-đệ-quy)
9. [Interview Questions / Câu Hỏi Phỏng Vấn](#interview-questions--câu-hỏi-phỏng-vấn)

---

## Utility Types / Kiểu Tiện Ích

### Partial<T>

**English:** Makes all properties of T optional.

**Tiếng Việt:** Làm cho tất cả thuộc tính của T trở thành tùy chọn.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// All properties optional / Tất cả thuộc tính tùy chọn
type PartialUser = Partial<User>;
// Equivalent to / Tương đương với:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
// }

// Use case: Update function / Trường hợp sử dụng: Hàm cập nhật
function updateUser(id: number, updates: Partial<User>): User {
  const user = getUserById(id);
  return { ...user, ...updates };
}

updateUser(1, { name: 'John' }); // ✅ Valid / Hợp lệ
updateUser(1, { email: 'john@example.com' }); // ✅ Valid / Hợp lệ
```

### Required<T>

**English:** Makes all properties of T required.

**Tiếng Việt:** Làm cho tất cả thuộc tính của T trở thành bắt buộc.

```typescript
interface Config {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

// All properties required / Tất cả thuộc tính bắt buộc
type RequiredConfig = Required<Config>;
// {
//   apiUrl: string;
//   timeout: number;
//   retries: number;
// }

function initializeApp(config: RequiredConfig) {
  // All properties guaranteed to exist / Tất cả thuộc tính đảm bảo tồn tại
  console.log(config.apiUrl.toUpperCase());
  console.log(config.timeout * 2);
}
```

### Readonly<T>

**English:** Makes all properties of T readonly.

**Tiếng Việt:** Làm cho tất cả thuộc tính của T chỉ đọc.

```typescript
interface Point {
  x: number;
  y: number;
}

const point: Readonly<Point> = { x: 10, y: 20 };
// point.x = 30; // ❌ Error: Cannot assign to 'x' / Lỗi: Không thể gán cho 'x'

// Use case: Immutable state / Trường hợp sử dụng: Trạng thái bất biến
function movePoint(point: Readonly<Point>, dx: number, dy: number): Point {
  return { x: point.x + dx, y: point.y + dy };
}
```

### Pick<T, K>

**English:** Creates a type by picking specific properties from T.

**Tiếng Việt:** Tạo kiểu bằng cách chọn các thuộc tính cụ thể từ T.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Pick only public fields / Chỉ chọn các trường công khai
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// {
//   id: number;
//   name: string;
//   email: string;
// }

function displayUser(user: PublicUser) {
  console.log(user.name, user.email);
  // console.log(user.password); // ❌ Error: Property doesn't exist
}
```

### Omit<T, K>

**English:** Creates a type by omitting specific properties from T.

**Tiếng Việt:** Tạo kiểu bằng cách bỏ qua các thuộc tính cụ thể từ T.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit sensitive fields / Bỏ qua các trường nhạy cảm
type SafeUser = Omit<User, 'password'>;
// {
//   id: number;
//   name: string;
//   email: string;
// }

// Use case: API response / Trường hợp sử dụng: Phản hồi API
function getUserProfile(id: number): SafeUser {
  const user = getUserById(id);
  const { password, ...safeUser } = user;
  return safeUser;
}
```

### Record<K, T>

**English:** Creates an object type with keys K and values T.

**Tiếng Việt:** Tạo kiểu object với khóa K và giá trị T.

```typescript
// Map of user roles / Bản đồ vai trò người dùng
type Role = 'admin' | 'user' | 'guest';

type Permissions = Record<Role, string[]>;
// {
//   admin: string[];
//   user: string[];
//   guest: string[];
// }

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Dictionary pattern / Mẫu từ điển
type Dictionary<T> = Record<string, T>;

const userCache: Dictionary<User> = {
  '1': { id: 1, name: 'John', email: 'john@example.com' },
  '2': { id: 2, name: 'Jane', email: 'jane@example.com' }
};
```

### Exclude<T, U> & Extract<T, U>

```typescript
type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';

// Exclude: Remove types from union / Loại bỏ kiểu khỏi union
type ActiveStatus = Exclude<Status, 'cancelled'>;
// 'pending' | 'approved' | 'rejected'

// Extract: Keep only specified types / Chỉ giữ các kiểu được chỉ định
type FinalStatus = Extract<Status, 'approved' | 'rejected'>;
// 'approved' | 'rejected'

// Practical example / Ví dụ thực tế
type Primitive = string | number | boolean | null | undefined;
type NonNullablePrimitive = Exclude<Primitive, null | undefined>;
// string | number | boolean
```

### ReturnType<T> & Parameters<T>

```typescript
// ReturnType: Extract return type of function / Trích xuất kiểu trả về của hàm
function getUser(id: number) {
  return {
    id,
    name: 'John',
    email: 'john@example.com'
  };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; email: string; }

// Parameters: Extract parameter types / Trích xuất kiểu tham số
function createUser(name: string, age: number, email: string) {
  return { name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, email: string]

// Use case: Wrapper function / Trường hợp sử dụng: Hàm wrapper
function loggedCreateUser(...args: CreateUserParams): ReturnType<typeof createUser> {
  console.log('Creating user with:', args);
  return createUser(...args);
}
```

---

## Mapped Types / Kiểu Ánh Xạ

### Basic Mapped Types / Kiểu Ánh Xạ Cơ Bản

**English:** Transform properties of an existing type.

**Tiếng Việt:** Biến đổi các thuộc tính của kiểu hiện có.

```typescript
// Make all properties optional / Làm tất cả thuộc tính tùy chọn
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly / Làm tất cả thuộc tính chỉ đọc
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Make all properties nullable / Làm tất cả thuộc tính nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface User {
  id: number;
  name: string;
  email: string;
}

type NullableUser = Nullable<User>;
// {
//   id: number | null;
//   name: string | null;
//   email: string | null;
// }
```

### Advanced Mapped Types / Kiểu Ánh Xạ Nâng Cao

```typescript
// Add prefix to all keys / Thêm tiền tố cho tất cả khóa
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

interface User {
  id: number;
  name: string;
}

type PrefixedUser = Prefixed<User, 'user_'>;
// {
//   user_id: number;
//   user_name: string;
// }

// Getters for all properties / Getter cho tất cả thuộc tính
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// {
//   getId: () => number;
//   getName: () => string;
// }

// Filter properties by type / Lọc thuộc tính theo kiểu
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Mixed {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

type StringProps = FilterByType<Mixed, string>;
// { name: string; }

type NumberProps = FilterByType<Mixed, number>;
// { id: number; age: number; }
```

---

## Conditional Types / Kiểu Điều Kiện

### Basic Conditional Types / Kiểu Điều Kiện Cơ Bản

**English:** Types that depend on a condition.

**Tiếng Việt:** Các kiểu phụ thuộc vào một điều kiện.

```typescript
// Syntax: T extends U ? X : Y
// If T is assignable to U, type is X, otherwise Y
// Nếu T có thể gán cho U, kiểu là X, ngược lại là Y

type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example: API response / Ví dụ thực tế: Phản hồi API
type ApiResponse<T> = T extends { error: any }
  ? { success: false; error: string }
  : { success: true; data: T };

type SuccessResponse = ApiResponse<{ id: number; name: string }>;
// { success: true; data: { id: number; name: string } }

type ErrorResponse = ApiResponse<{ error: string }>;
// { success: false; error: string }
```

### Distributive Conditional Types / Kiểu Điều Kiện Phân Phối

```typescript
// Conditional types distribute over unions / Kiểu điều kiện phân phối qua union
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// string[] | number[] (not (string | number)[])

// Non-distributive version / Phiên bản không phân phối
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Combined = ToArrayNonDist<string | number>;
// (string | number)[]

// Practical: Extract function types / Thực tế: Trích xuất kiểu hàm
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface Example {
  name: string;
  age: number;
  greet: () => void;
  calculate: (x: number) => number;
}

type FunctionKeys = FunctionPropertyNames<Example>;
// 'greet' | 'calculate'
```

### Infer Keyword / Từ Khóa Infer

```typescript
// Extract return type / Trích xuất kiểu trả về
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'John' };
}

type User = MyReturnType<typeof getUser>;
// { id: number; name: string; }

// Extract array element type / Trích xuất kiểu phần tử mảng
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Numbers = ArrayElement<number[]>; // number
type Strings = ArrayElement<string[]>; // string

// Extract Promise value type / Trích xuất kiểu giá trị Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

type AsyncUser = Awaited<Promise<User>>; // User
type SyncUser = Awaited<User>; // User

// Complex example: Deep property access / Ví dụ phức tạp: Truy cập thuộc tính sâu
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

interface NestedUser {
  profile: {
    personal: {
      name: string;
      age: number;
    };
    settings: {
      theme: string;
    };
  };
}

type PartialNested = DeepPartial<NestedUser>;
// All nested properties optional / Tất cả thuộc tính lồng nhau tùy chọn
```

---

## Template Literal Types / Kiểu Template Literal

### Basic Template Literals / Template Literal Cơ Bản

```typescript
// String literal types with templates / Kiểu chuỗi literal với template
type Greeting = `Hello ${string}`;

const greeting1: Greeting = 'Hello World'; // ✅
const greeting2: Greeting = 'Hello TypeScript'; // ✅
// const greeting3: Greeting = 'Hi World'; // ❌ Error

// Combine with unions / Kết hợp với union
type Color = 'red' | 'green' | 'blue';
type Shade = 'light' | 'dark';

type ColorVariant = `${Shade}-${Color}`;
// 'light-red' | 'light-green' | 'light-blue' | 
// 'dark-red' | 'dark-green' | 'dark-blue'

// CSS properties / Thuộc tính CSS
type CSSProperty = `${'margin' | 'padding'}-${'top' | 'right' | 'bottom' | 'left'}`;
// 'margin-top' | 'margin-right' | 'margin-bottom' | 'margin-left' |
// 'padding-top' | 'padding-right' | 'padding-bottom' | 'padding-left'
```

### Advanced Template Literals / Template Literal Nâng Cao

```typescript
// Event handler types / Kiểu xử lý sự kiện
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// API endpoint types / Kiểu endpoint API
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Resource = 'users' | 'posts' | 'comments';

type ApiEndpoint = `/${Resource}` | `/${Resource}/${number}`;
// '/users' | '/users/1' | '/posts' | '/posts/1' | ...

// Type-safe route builder / Trình xây dựng route an toàn kiểu
type Route = '/home' | '/about' | '/users/:id' | '/posts/:postId/comments/:commentId';

type ExtractParams<T extends string> = 
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type UserRouteParams = ExtractParams<'/users/:id'>;
// { id: string }

type CommentRouteParams = ExtractParams<'/posts/:postId/comments/:commentId'>;
// { postId: string; commentId: string }
```

---

## Discriminated Unions / Union Phân Biệt

### Basic Discriminated Unions / Union Phân Biệt Cơ Bản

**English:** Unions with a common discriminant property for type narrowing.

**Tiếng Việt:** Union với thuộc tính phân biệt chung để thu hẹp kiểu.

```typescript
// Shape example / Ví dụ hình dạng
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
  }
}
```

### API Response Pattern / Mẫu Phản Hồi API

```typescript
interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

interface ErrorResponse {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
}

interface LoadingResponse {
  status: 'loading';
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | LoadingResponse;

function handleResponse<T>(response: ApiResponse<T>) {
  switch (response.status) {
    case 'success':
      console.log('Data:', response.data);
      break;
    case 'error':
      console.error('Error:', response.error.message);
      break;
    case 'loading':
      console.log('Loading...');
      break;
  }
}
```

### Redux Action Pattern / Mẫu Redux Action

```typescript
interface IncrementAction {
  type: 'INCREMENT';
  payload: number;
}

interface DecrementAction {
  type: 'DECREMENT';
  payload: number;
}

interface ResetAction {
  type: 'RESET';
}

type CounterAction = IncrementAction | DecrementAction | ResetAction;

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;
    case 'DECREMENT':
      return state - action.payload;
    case 'RESET':
      return 0;
  }
}
```

---

## Type Guards / Bảo Vệ Kiểu

### Built-in Type Guards / Bảo Vệ Kiểu Tích Hợp

```typescript
// typeof guard
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // value is string
  } else {
    return value.toFixed(2); // value is number
  }
}

// instanceof guard
class Dog {
  bark() { console.log('Woof!'); }
}

class Cat {
  meow() { console.log('Meow!'); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in operator guard
interface Car {
  drive: () => void;
}

interface Boat {
  sail: () => void;
}

function move(vehicle: Car | Boat) {
  if ('drive' in vehicle) {
    vehicle.drive();
  } else {
    vehicle.sail();
  }
}
```

### Custom Type Guards / Bảo Vệ Kiểu Tùy Chỉnh

```typescript
// User-defined type guard / Bảo vệ kiểu do người dùng định nghĩa
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows data is User
  }
}

// Array type guard / Bảo vệ kiểu mảng
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

// Nullable type guard / Bảo vệ kiểu nullable
function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values = [1, null, 2, undefined, 3];
const definedValues = values.filter(isDefined);
// Type: number[]
```

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### 🔴 [Senior] Question 1: Implement DeepReadonly<T>

**English Answer:**
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface User {
  profile: {
    name: string;
    settings: {
      theme: string;
    };
  };
}

type ReadonlyUser = DeepReadonly<User>;
// All nested properties are readonly / Tất cả thuộc tính lồng nhau chỉ đọc
```

### 🟢 [Junior] Question 2: Difference between `type` and `interface`?

**English Answer:**
- **Interface**: Can be extended, supports declaration merging
- **Type**: Can use unions/intersections, more flexible
- **Use interface** for object shapes, **type** for unions/complex types

**Tiếng Việt:**
- **Interface**: Có thể mở rộng, hỗ trợ gộp khai báo
- **Type**: Có thể dùng union/intersection, linh hoạt hơn
- **Dùng interface** cho hình dạng object, **type** cho union/kiểu phức tạp

### 🟡 [Mid] Question 3: What are discriminated unions?

**English Answer:**
Discriminated unions use a common property (discriminant) to narrow types in switch/if statements. Essential for type-safe state management and API responses.

**Tiếng Việt:**
Discriminated union sử dụng thuộc tính chung (discriminant) để thu hẹp kiểu trong câu lệnh switch/if. Cần thiết cho quản lý trạng thái an toàn kiểu và phản hồi API.

---

## Key Takeaways / Điểm Chính

**English:**
1. Utility types simplify common type transformations
2. Mapped types transform existing types systematically
3. Conditional types enable type-level logic
4. Template literals create type-safe string patterns
5. Discriminated unions enable exhaustive type checking
6. Type guards narrow types at runtime

**Tiếng Việt:**
1. Kiểu tiện ích đơn giản hóa biến đổi kiểu phổ biến
2. Kiểu ánh xạ biến đổi kiểu hiện có một cách có hệ thống
3. Kiểu điều kiện cho phép logic cấp kiểu
4. Template literal tạo mẫu chuỗi an toàn kiểu
5. Discriminated union cho phép kiểm tra kiểu đầy đủ
6. Bảo vệ kiểu thu hẹp kiểu tại runtime

---

[← Previous: TypeScript Basics](./01-typescript-basics.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next: Generics Deep Dive →](./03-generics-deep-dive.md)
