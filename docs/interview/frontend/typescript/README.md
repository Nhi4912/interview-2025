# TypeScript for Frontend Interviews

## Table of Contents
- [TypeScript Fundamentals](#typescript-fundamentals)
- [Advanced Types](#advanced-types)
- [React with TypeScript](#react-with-typescript)
- [Interview Questions](#interview-questions)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## TypeScript Fundamentals

### Why TypeScript?
TypeScript is a superset of JavaScript that adds static type definitions. It's essential for modern frontend development and frequently tested in interviews.

**Key Benefits:**
- **Static Type Checking**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Compiler helps identify breaking changes
- **Better Team Collaboration**: Clear interfaces and contracts

### Basic Types

```typescript
// Primitive types
let name: string = "John";
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let undefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Tuples
let person: [string, number] = ["John", 25];

// Enums
enum Color {
  Red,
  Green,
  Blue
}
let c: Color = Color.Green;

// Any (use sparingly)
let anything: any = 42;
anything = "hello";
anything = true;

// Unknown (safer than any)
let userInput: unknown;
if (typeof userInput === "string") {
  console.log(userInput.toUpperCase());
}

// Never (functions that never return)
function throwError(message: string): never {
  throw new Error(message);
}

// Void (no return value)
function logMessage(message: string): void {
  console.log(message);
}
```

### Objects and Interfaces

```typescript
// Object types
let user: { name: string; age: number } = {
  name: "John",
  age: 25
};

// Interface definition
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number; // Optional property
}

// Using interfaces
const createUser = (userData: User): User => {
  return {
    id: Math.random(),
    ...userData
  };
};

// Extending interfaces
interface AdminUser extends User {
  permissions: string[];
  isAdmin: boolean;
}

// Index signatures
interface StringDictionary {
  [key: string]: string;
}

const dictionary: StringDictionary = {
  hello: "world",
  foo: "bar"
};
```

### Functions

{% raw %}
```typescript
// Function types
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// Function overloads
function process(input: string): string;
function process(input: number): number;
function process(input: string | number): string | number {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input * 2;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// Default parameters
function createUser(name: string, age: number = 18): User {
  return { id: Math.random(), name, email: `${name}@example.com`, age };
}
```
{% endraw %}

## Advanced Types

### Union and Intersection Types

```typescript
// Union types
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

function processId(id: StringOrNumber): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// Intersection types
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type PersonEmployee = Person & Employee;

const emp: PersonEmployee = {
  name: "John",
  age: 30,
  employeeId: 123,
  department: "Engineering"
};
```

### Generics

```typescript
// Generic functions
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);

// Generic interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};

// Generic classes
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// Generic constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Utility Types

```typescript
// Built-in utility types
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Required - makes all properties required
type RequiredUser = Required<User>;

// Readonly - makes all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick - selects specific properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - excludes specific properties
type UserWithoutId = Omit<User, "id">;

// Record - creates an object type with specific key and value types
type UserRoles = Record<string, string[]>;

// ReturnType - extracts return type of function
function getUser(): User {
  return { id: 1, name: "John", email: "john@example.com", age: 25 };
}

type GetUserReturnType = ReturnType<typeof getUser>; // User

// Parameters - extracts parameter types
function updateUser(id: number, updates: Partial<User>): void {}

type UpdateUserParams = Parameters<typeof updateUser>; // [number, Partial<User>]
```

## React with TypeScript

### Component Types

```typescript
import React, { useState, useEffect, ReactNode } from 'react';

// Props interface
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Function component
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Using the generic component
interface User {
  id: number;
  name: string;
}

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <List
      items={users}
      keyExtractor={user => user.id}
      renderItem={user => <span>{user.name}</span>}
    />
  );
};
```

### Hooks with TypeScript

```typescript
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// useState with explicit types
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);

// useEffect with cleanup
useEffect(() => {
  const timer = setTimeout(() => {
    setCount(prev => prev + 1);
  }, 1000);

  return () => clearTimeout(timer);
}, []);

// useCallback with proper typing
const handleClick = useCallback((id: number) => {
  console.log('Clicked:', id);
}, []);

// useMemo with type inference
const expensiveValue = useMemo(() => {
  return items.filter(item => item.active).length;
}, [items]);

// useRef with DOM elements
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};

// Custom hook with TypeScript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Using the custom hook
interface ApiUser {
  id: number;
  name: string;
  email: string;
}

const UserComponent: React.FC = () => {
  const { data: user, loading, error, refetch } = useApi<ApiUser>('/api/user/1');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

### Context with TypeScript

```typescript
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// State interface
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

// Actions
type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
};

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });

  return (
    <AppContext.Provider value={% raw %}{{ state, dispatch }}{% endraw %}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

## Interview Questions

### 1. What is TypeScript and why would you use it?

**Answer:**
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. Key benefits include:

- **Static Type Checking**: Catches errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting Code**: Types serve as documentation for APIs and functions
- **Easier Refactoring**: Compiler helps identify breaking changes across codebase
- **Better Team Collaboration**: Clear interfaces and contracts between team members

### 2. Explain the difference between `interface` and `type` in TypeScript.

**Answer:**
```typescript
// Interface - can be extended and merged
interface User {
  name: string;
  age: number;
}

interface User {
  email: string; // Declaration merging
}

interface AdminUser extends User {
  permissions: string[];
}

// Type - more flexible, supports unions, intersections
type Status = 'loading' | 'success' | 'error';
type User = {
  name: string;
  age: number;
};

type AdminUser = User & {
  permissions: string[];
};
```

**Key Differences:**
- **Interfaces** can be extended and merged, better for object shapes
- **Types** are more flexible, support unions, intersections, and primitives
- **Interfaces** are preferred for public APIs that might be extended
- **Types** are preferred for complex type compositions

### 3. What are generics and why are they useful?

**Answer:**
Generics allow you to write reusable code that works with multiple types while maintaining type safety.

```typescript
// Without generics - not reusable
function identityString(arg: string): string {
  return arg;
}

function identityNumber(arg: number): number {
  return arg;
}

// With generics - reusable and type-safe
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello"); // string
const numberResult = identity<number>(42); // number

// Generic constraints
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a length property
  return arg;
}
```

### 4. How do you handle asynchronous operations in TypeScript?

**Answer:**
```typescript
// Promise types
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Error handling with custom error types
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchUserWithErrorHandling(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new ApiError(
        `Failed to fetch user`,
        response.status,
        'FETCH_ERROR'
      );
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('API Error:', error.message, error.status);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

### 5. What are utility types and how do you use them?

**Answer:**
Utility types are built-in TypeScript types that help transform existing types.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - makes all properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Pick - selects specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

// Omit - excludes specific properties
type CreateUserRequest = Omit<User, 'id'>;
// { name: string; email: string; age: number; }

// Record - creates object with specific key/value types
type UserRoles = Record<string, string[]>;
// { [key: string]: string[] }

// ReturnType - extracts function return type
function getUser(): User {
  return { id: 1, name: 'John', email: 'john@example.com', age: 25 };
}

type GetUserReturn = ReturnType<typeof getUser>; // User
```

## Best Practices

### 1. Type Definitions

```typescript
// ✅ Good - Use interfaces for object shapes
interface User {
  readonly id: number;
  name: string;
  email: string;
  age?: number;
}

// ✅ Good - Use types for unions and computed types
type Status = 'loading' | 'success' | 'error';
type UserKeys = keyof User;

// ❌ Avoid - Don't use any
function process(data: any): any {
  return data;
}

// ✅ Good - Use unknown for unknown data
function process(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return String(data);
}
```

### 2. Function Types

```typescript
// ✅ Good - Explicit return types for public APIs
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - Use readonly for arrays that shouldn't be modified
function processItems(items: readonly Item[]): Item[] {
  return items.filter(item => item.active);
}

// ✅ Good - Use function overloads for multiple signatures
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;
function format(value: string | number | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
```

### 3. Error Handling

```typescript
// ✅ Good - Custom error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Good - Result type pattern
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
```

## Common Patterns

### 1. Builder Pattern

```typescript
class UserBuilder {
  private user: Partial<User> = {};

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  build(): User {
    if (!this.user.name || !this.user.email) {
      throw new Error('Name and email are required');
    }
    
    return {
      id: Math.random(),
      name: this.user.name,
      email: this.user.email,
      age: this.user.age || 18
    };
  }
}

// Usage
const user = new UserBuilder()
  .setName('John')
  .setEmail('john@example.com')
  .setAge(25)
  .build();
```

### 2. Factory Pattern

```typescript
interface Shape {
  area(): number;
  perimeter(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

type ShapeType = 'circle' | 'rectangle';

interface ShapeConfig {
  type: 'circle';
  radius: number;
} | {
  type: 'rectangle';
  width: number;
  height: number;
};

class ShapeFactory {
  static createShape(config: ShapeConfig): Shape {
    switch (config.type) {
      case 'circle':
        return new Circle(config.radius);
      case 'rectangle':
        return new Rectangle(config.width, config.height);
      default:
        throw new Error('Unknown shape type');
    }
  }
}
```

### 3. Repository Pattern

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  constructor(private apiClient: ApiClient) {}

  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const response = await this.apiClient.get('/users');
    return response.data;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const response = await this.apiClient.post('/users', userData);
    return response.data;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`);
  }
}
```

This comprehensive TypeScript guide covers all the essential concepts and patterns you'll need for frontend interviews. The key is to understand not just the syntax, but when and why to use different TypeScript features to write more maintainable and type-safe code.
