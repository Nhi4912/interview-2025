# TypeScript Basics / Cơ Bản TypeScript
## TypeScript - Chapter 1 / TypeScript - Chương 1

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Advanced Types →](./02-advanced-types.md)

---

## Overview / Tổng Quan

**English:** TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, and advanced features that help catch errors early and improve code quality. Understanding TypeScript is essential for modern frontend development and technical interviews.

**Tiếng Việt:** TypeScript là một siêu tập hợp có kiểu tĩnh của JavaScript được biên dịch thành JavaScript thuần túy. Nó thêm chú thích kiểu tùy chọn, giao diện và các tính năng nâng cao giúp phát hiện lỗi sớm và cải thiện chất lượng code. Hiểu TypeScript là cần thiết cho phát triển frontend hiện đại và phỏng vấn kỹ thuật.

---

## Table of Contents
1. [Why TypeScript?](#why-typescript)
2. [Basic Types](#basic-types)
3. [Type Annotations](#type-annotations)
4. [Interfaces](#interfaces)
5. [Type Aliases](#type-aliases)
6. [Union and Intersection Types](#union-and-intersection-types)
7. [Type Assertions](#type-assertions)
8. [Functions](#functions)
9. [Arrays and Tuples](#arrays-and-tuples)
10. [Enums](#enums)
11. [Interview Questions](#interview-questions)

---

## Why TypeScript?

### Benefits

```typescript
// ❌ JavaScript - Runtime error
function greet(person) {
  return `Hello, ${person.name}!`;
}

greet({ age: 30 }); // Runtime error: Cannot read property 'name' of undefined

// ✅ TypeScript - Compile-time error
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return `Hello, ${person.name}!`;
}

// greet({ age: 30 }); // ❌ Compile error: Property 'name' is missing
greet({ name: 'John', age: 30 }); // ✅ Works!
```

### Key Advantages

1. **Early Error Detection**: Catch bugs at compile time
2. **Better IDE Support**: Autocomplete, refactoring, navigation
3. **Self-Documenting Code**: Types serve as documentation
4. **Safer Refactoring**: Confidence when changing code
5. **Enhanced Collaboration**: Clear contracts between code

---

## Basic Types

### Primitive Types

```typescript
// String
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// Number
let age: number = 30;
let price: number = 19.99;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// Boolean
let isActive: boolean = true;
let isCompleted: boolean = false;

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;

// Symbol
let sym: symbol = Symbol('unique');

// BigInt
let bigNumber: bigint = 100n;
```

### Special Types

```typescript
// Any - Opt out of type checking (avoid when possible)
let anything: any = 'hello';
anything = 42;
anything = true; // No error

// Unknown - Type-safe version of any
let userInput: unknown;
userInput = 'hello';
userInput = 42;

// Type guard required before use
if (typeof userInput === 'string') {
  console.log(userInput.toUpperCase()); // ✅ Safe
}

// Never - Represents values that never occur
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// Void - Absence of return value
function logMessage(message: string): void {
  console.log(message);
  // No return statement
}
```

---

## Type Annotations

### Variable Annotations

```typescript
// Explicit type annotation
let username: string = 'John';
let age: number = 30;

// Type inference (TypeScript infers the type)
let inferredString = 'Hello'; // Type: string
let inferredNumber = 42; // Type: number

// Multiple variables
let x: number, y: number, z: number;
x = 1;
y = 2;
z = 3;
```

### Object Type Annotations

```typescript
// Object type
let person: {
  name: string;
  age: number;
  email?: string; // Optional property
} = {
  name: 'John',
  age: 30
};

// Nested objects
let company: {
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
} = {
  name: 'Tech Corp',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    country: 'USA'
  }
};
```

---

## Interfaces

### Basic Interface

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Read-only property
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date()
};

// user.createdAt = new Date(); // ❌ Error: Cannot assign to 'createdAt'
user.age = 30; // ✅ OK
```

### Interface Extension

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

const employee: Employee = {
  name: 'John',
  age: 30,
  employeeId: 'E001',
  department: 'Engineering'
};

// Multiple inheritance
interface Manager extends Employee, Person {
  teamSize: number;
}
```

### Function Interfaces

```typescript
// Function type interface
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// Interface with methods
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

const calculator: Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};
```

### Index Signatures

```typescript
// String index signature
interface StringDictionary {
  [key: string]: string;
}

const colors: StringDictionary = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745'
};

// Number index signature
interface NumberArray {
  [index: number]: number;
}

const fibonacci: NumberArray = [0, 1, 1, 2, 3, 5, 8];

// Mixed index signatures
interface MixedDictionary {
  [key: string]: string | number;
  length: number; // Specific property
}
```

---

## Type Aliases

### Basic Type Alias

```typescript
// Simple alias
type ID = string | number;
type Status = 'pending' | 'approved' | 'rejected';

let userId: ID = '123';
userId = 456; // Also valid

let orderStatus: Status = 'pending';
// orderStatus = 'invalid'; // ❌ Error

// Object type alias
type Point = {
  x: number;
  y: number;
};

const point: Point = { x: 10, y: 20 };

// Function type alias
type GreetFunction = (name: string) => string;

const greet: GreetFunction = (name) => `Hello, ${name}!`;
```

### Interface vs Type Alias

```typescript
// Interface
interface UserInterface {
  name: string;
  age: number;
}

// Type Alias
type UserType = {
  name: string;
  age: number;
};

// Key differences:

// 1. Interfaces can be extended
interface ExtendedUser extends UserInterface {
  email: string;
}

// 2. Type aliases can use unions
type StringOrNumber = string | number;

// 3. Interfaces can be merged (declaration merging)
interface Window {
  title: string;
}

interface Window {
  version: string;
}

// Window now has both title and version

// 4. Type aliases can use mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

---

## Union and Intersection Types

### Union Types

```typescript
// Union type - value can be one of several types
type StringOrNumber = string | number;

let value: StringOrNumber;
value = 'hello'; // ✅
value = 42; // ✅
// value = true; // ❌ Error

// Function with union parameter
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Union of literal types
type Direction = 'north' | 'south' | 'east' | 'west';

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move('north'); // ✅
// move('up'); // ❌ Error
```

### Intersection Types

```typescript
// Intersection type - combines multiple types
interface Nameable {
  name: string;
}

interface Ageable {
  age: number;
}

type Person = Nameable & Ageable;

const person: Person = {
  name: 'John',
  age: 30
};

// Combining type aliases
type Admin = {
  role: 'admin';
  permissions: string[];
};

type User = {
  id: string;
  email: string;
};

type AdminUser = Admin & User;

const adminUser: AdminUser = {
  id: '1',
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};
```

---

## Type Assertions

### Basic Type Assertions

```typescript
// Angle-bracket syntax
let someValue: unknown = 'this is a string';
let strLength: number = (<string>someValue).length;

// As syntax (preferred in JSX)
let someValue2: unknown = 'this is a string';
let strLength2: number = (someValue2 as string).length;

// DOM elements
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'John';

// Non-null assertion
function processValue(value: string | null) {
  // Tell TypeScript this will never be null
  console.log(value!.toUpperCase());
}
```

### Const Assertions

```typescript
// Without const assertion
let colors1 = ['red', 'green', 'blue'];
// Type: string[]

// With const assertion
let colors2 = ['red', 'green', 'blue'] as const;
// Type: readonly ["red", "green", "blue"]

// Object with const assertion
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;

// config.apiUrl = 'new url'; // ❌ Error: readonly
```

---

## Functions

### Function Type Annotations

```typescript
// Named function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}

// Default parameters
function createUser(name: string, age: number = 18): User {
  return { name, age };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```

### Function Overloads

```typescript
// Overload signatures
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;

// Implementation signature
function combine(a: string | number, b: string | number): string | number {
  if (typeof a === 'string' && typeof b === 'string') {
    return a + b;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }
  throw new Error('Invalid arguments');
}

const result1 = combine('Hello', 'World'); // Type: string
const result2 = combine(10, 20); // Type: number
```

### Generic Functions

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>('hello'); // Type: string
const num = identity<number>(42); // Type: number
const auto = identity('auto'); // Type inferred as string

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: 'John', age: 30 };
const name = getProperty(person, 'name'); // Type: string
const age = getProperty(person, 'age'); // Type: number
// const invalid = getProperty(person, 'email'); // ❌ Error
```

---

## Arrays and Tuples

### Arrays

```typescript
// Array type annotation
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ['a', 'b', 'c'];

// Array of objects
interface User {
  id: number;
  name: string;
}

let users: User[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

// Readonly arrays
let readonlyNumbers: readonly number[] = [1, 2, 3];
// readonlyNumbers.push(4); // ❌ Error

// Multi-dimensional arrays
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

### Tuples

```typescript
// Tuple - fixed-length array with specific types
let tuple: [string, number] = ['John', 30];

// Accessing tuple elements
let name: string = tuple[0];
let age: number = tuple[1];

// Tuple with optional elements
let optionalTuple: [string, number?] = ['John'];

// Tuple with rest elements
let restTuple: [string, ...number[]] = ['John', 1, 2, 3, 4];

// Named tuples (TypeScript 4.0+)
type Point = [x: number, y: number];
type Range = [start: number, end: number];

const point: Point = [10, 20];
const range: Range = [0, 100];

// Readonly tuples
let readonlyTuple: readonly [string, number] = ['John', 30];
// readonlyTuple[0] = 'Jane'; // ❌ Error
```

---

## Enums

### Numeric Enums

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let dir: Direction = Direction.Up;
console.log(dir); // 0

// Custom starting value
enum Status {
  Pending = 1,
  Approved,  // 2
  Rejected   // 3
}

// Custom values
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500
}
```

### String Enums

```typescript
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

let color: Color = Color.Red;
console.log(color); // 'RED'

// Heterogeneous enums (not recommended)
enum Mixed {
  No = 0,
  Yes = 'YES'
}
```

### Const Enums

```typescript
// Const enum - inlined at compile time
const enum LogLevel {
  Debug,
  Info,
  Warning,
  Error
}

let level: LogLevel = LogLevel.Info;

// Compiled JavaScript:
// let level = 1; // Inlined!
```

---

## Interview Questions

### Q1: What's the difference between `interface` and `type`?

**Answer:**
- **Interface**: Can be extended, supports declaration merging, better for object shapes
- **Type**: Can use unions/intersections, can't be merged, more flexible

```typescript
// Interface - can extend
interface User extends Person {
  email: string;
}

// Type - can use unions
type ID = string | number;
```

### Q2: What is `unknown` vs `any`?

**Answer:**
- **any**: Opts out of type checking, unsafe
- **unknown**: Type-safe, requires type checking before use

```typescript
let a: any = 'hello';
a.toUpperCase(); // ✅ No error (but might fail at runtime)

let b: unknown = 'hello';
// b.toUpperCase(); // ❌ Error
if (typeof b === 'string') {
  b.toUpperCase(); // ✅ Safe
}
```

### Q3: What are generics and why use them?

**Answer:**
Generics allow creating reusable components that work with multiple types while maintaining type safety.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Works with any type, maintains type safety
const str = identity('hello'); // Type: string
const num = identity(42); // Type: number
```

---

## Summary

- TypeScript adds static typing to JavaScript
- Use interfaces for object shapes, types for unions/aliases
- Leverage type inference when possible
- Use `unknown` instead of `any` for type safety
- Generics enable reusable, type-safe code
- Enums provide named constants

---

[Back to Table of Contents](../00-table-of-contents.md) | [Next: Advanced Types →](./02-advanced-types.md)
