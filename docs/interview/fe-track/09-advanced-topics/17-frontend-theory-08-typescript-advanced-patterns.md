# TypeScript Advanced Patterns - Complete Guide
# TypeScript Patterns Nâng Cao - Hướng Dẫn Đầy Đủ

## Table of Contents / Mục Lục

### Part 1: Type System Fundamentals
1. Type Inference Deep Dive
2. Type Narrowing Techniques
3. Discriminated Unions
4. Conditional Types

### Part 2: Advanced Types
5. Mapped Types
6. Template Literal Types
7. Utility Types Mastery
8. Generic Constraints

### Part 3: Patterns and Best Practices
9. Builder Pattern with Types
10. Factory Pattern with Types
11. Dependency Injection
12. Type-Safe Event Emitters

### Part 4: React with TypeScript
13. Component Typing Patterns
14. Hooks with TypeScript
15. Context API Typing
16. Form Handling with Types

---

## Part 1: Type System Fundamentals

### 1. Type Inference Deep Dive
### 1. Type Inference Tìm Hiểu Sâu

**English:**

TypeScript's type inference reduces the need for explicit type annotations.

**Basic Inference:**

```typescript
// Variable inference
let x = 3; // number
let y = 'hello'; // string
let z = true; // boolean

// Array inference
let numbers = [1, 2, 3]; // number[]
let mixed = [1, 'two', true]; // (number | string | boolean)[]

// Object inference
let person = {
  name: 'John',
  age: 30
}; // { name: string; age: number }

// Function return type inference
function add(a: number, b: number) {
  return a + b; // Inferred as number
}

// Arrow function inference
const multiply = (a: number, b: number) => a * b; // (a: number, b: number) => number
```

**Contextual Typing:**

```typescript
// Event handler inference
button.addEventListener('click', (event) => {
  // event is inferred as MouseEvent
  console.log(event.clientX, event.clientY);
});

// Array method inference
const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2); // n is inferred as number
numbers.filter(n => n > 2); // n is inferred as number
numbers.reduce((acc, n) => acc + n, 0); // acc and n inferred

// Promise inference
async function fetchUser() {
  const response = await fetch('/api/user');
  const data = await response.json(); // any (needs type assertion)
  return data;
}

// Better: Explicit return type
async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');
  const data = await response.json();
  return data as User;
}
```

**Best Common Type:**

```typescript
// TypeScript finds best common type
let mixed = [1, 'two', true]; // (number | string | boolean)[]

// With objects
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2', price: 10 }
]; // { id: number; name: string; price?: number }[]

// Explicit type for better control
interface Item {
  id: number;
  name: string;
  price?: number;
}

let items: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2', price: 10 }
];
```

**Vietnamese:**

Type inference của TypeScript giảm nhu cầu type annotations tường minh.

**Inference Cơ Bản:**

TypeScript tự động suy luận types từ:
- Giá trị khởi tạo
- Return statements
- Context (event handlers, callbacks)

**Best Practices:**

- Để TypeScript infer khi có thể
- Explicit types cho public APIs
- Explicit types cho complex types

---

### 2. Type Narrowing Techniques
### 2. Kỹ Thuật Type Narrowing

**English:**

Type narrowing refines types within conditional blocks.

**typeof Guards:**

```typescript
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // value is string here
    return value.toUpperCase();
  } else {
    // value is number here
    return value.toFixed(2);
  }
}

// Multiple typeof checks
function format(value: string | number | boolean) {
  if (typeof value === 'string') {
    return value.trim();
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else {
    return value ? 'Yes' : 'No';
  }
}
```

**instanceof Guards:**

```typescript
class Dog {
  bark() {
    console.log('Woof!');
  }
}

class Cat {
  meow() {
    console.log('Meow!');
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // animal is Dog
  } else {
    animal.meow(); // animal is Cat
  }
}
```

**in Operator:**

```typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly(); // animal is Bird
  } else {
    animal.swim(); // animal is Fish
  }
}
```

**Discriminated Unions:**

```typescript
// Tagged union pattern
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape is Circle
      return Math.PI * shape.radius ** 2;
    case 'square':
      // shape is Square
      return shape.sideLength ** 2;
    case 'rectangle':
      // shape is Rectangle
      return shape.width * shape.height;
  }
}

// Exhaustiveness checking
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}

function getArea2(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      return assertNever(shape); // Compile error if not exhaustive
  }
}
```

**Custom Type Guards:**

```typescript
// User-defined type guard
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Type predicate
function isAdmin(user: User | Admin): user is Admin {
  return 'role' in user && user.role === 'admin';
}

function handleUser(user: User | Admin) {
  if (isAdmin(user)) {
    // user is Admin
    console.log(user.permissions);
  } else {
    // user is User
    console.log(user.name);
  }
}

// Generic type guard
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function process<T>(value: T | T[]) {
  if (isArray(value)) {
    // value is T[]
    value.forEach(item => console.log(item));
  } else {
    // value is T
    console.log(value);
  }
}
```

**Truthiness Narrowing:**

```typescript
function printLength(str: string | null | undefined) {
  // Narrow out null and undefined
  if (str) {
    console.log(str.length); // str is string
  } else {
    console.log('No string');
  }
}

// Be careful with falsy values
function printValue(value: string | number) {
  if (value) {
    console.log(value); // Excludes 0 and ''!
  }
}

// Better: Explicit checks
function printValue2(value: string | number) {
  if (value !== null && value !== undefined) {
    console.log(value); // Includes 0 and ''
  }
}
```

**Vietnamese:**

Type narrowing tinh chỉnh types trong các khối điều kiện.

**Kỹ Thuật Narrowing:**

1. **typeof**: Kiểm tra primitive types
2. **instanceof**: Kiểm tra class instances
3. **in**: Kiểm tra property existence
4. **Discriminated Unions**: Tagged unions với switch
5. **Custom Type Guards**: User-defined predicates

**Best Practices:**

- Dùng discriminated unions cho complex types
- Tạo custom type guards cho reusable logic
- Exhaustiveness checking với assertNever

---

### 3. Discriminated Unions
### 3. Discriminated Unions

**English:**

Discriminated unions (tagged unions) are powerful for modeling state.

**Basic Pattern:**

```typescript
// State machine with discriminated union
type LoadingState = {
  status: 'loading';
};

type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  error: Error;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// Usage
function renderUser(state: AsyncState<User>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserProfile user={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

**Complex Example:**

```typescript
// API Response types
type ApiResponse<T> =
  | { status: 'idle' }
  | { status: 'loading'; progress?: number }
  | { status: 'success'; data: T; timestamp: number }
  | { status: 'error'; error: string; retryCount: number };

// Type-safe state management
class DataFetcher<T> {
  private state: ApiResponse<T> = { status: 'idle' };
  
  async fetch(url: string) {
    this.state = { status: 'loading' };
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      this.state = {
        status: 'success',
        data,
        timestamp: Date.now()
      };
    } catch (error) {
      this.state = {
        status: 'error',
        error: error.message,
        retryCount: 0
      };
    }
  }
  
  getState(): ApiResponse<T> {
    return this.state;
  }
  
  getData(): T | null {
    if (this.state.status === 'success') {
      return this.state.data; // Type-safe access
    }
    return null;
  }
}
```

**Form Validation:**

```typescript
type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; errors: string[] };

function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  }
  
  if (!email.includes('@')) {
    errors.push('Email must contain @');
  }
  
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true, value: email };
}

// Usage
const result = validateEmail('test@example.com');

if (result.valid) {
  console.log('Valid email:', result.value);
} else {
  console.log('Errors:', result.errors);
}
```

**Vietnamese:**

Discriminated unions (tagged unions) mạnh mẽ cho modeling state.

**Pattern:**

```typescript
type State =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

**Lợi Ích:**

1. **Type Safety**: Compiler kiểm tra tất cả cases
2. **Exhaustiveness**: Đảm bảo xử lý tất cả states
3. **Self-Documenting**: Code tự giải thích
4. **Refactoring**: Dễ dàng thêm/xóa states

**Use Cases:**

- State machines
- API responses
- Form validation
- Event handling

