# TypeScript - Type Safety cho JavaScript

> TypeScript là "default mode" cho serious frontend development. Module này cover từ basics đến advanced patterns.

---

## Tổng Quan

TypeScript là **superset** của JavaScript, thêm static typing. Trong Big Tech interviews, TypeScript proficiency là **expected**, không phải nice-to-have.

---

## Cấu Trúc Module

| File | Chủ Đề | Độ Quan Trọng |
|------|--------|---------------|
| [01-type-system-basics.md](./01-type-system-basics.md) | Basic Types, Type Inference | ⭐⭐⭐⭐⭐ |
| [02-interfaces-vs-types.md](./02-interfaces-vs-types.md) | Interface vs Type | ⭐⭐⭐⭐⭐ |
| [03-generics.md](./03-generics.md) | Generics Patterns | ⭐⭐⭐⭐⭐ |
| [04-utility-types.md](./04-utility-types.md) | Partial, Pick, Omit, etc. | ⭐⭐⭐⭐ |
| [05-advanced-patterns.md](./05-advanced-patterns.md) | Discriminated Unions, Type Guards | ⭐⭐⭐⭐ |
| [06-typescript-with-react.md](./06-typescript-with-react.md) | TS + React Patterns | ⭐⭐⭐⭐⭐ |
| [mindmap-typescript.md](./mindmap-typescript.md) | Sơ Đồ Tổng Hợp | Review |

---

## Quick Reference

### Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Objects
let user: { name: string; age: number } = { name: "John", age: 30 };

// Union Types
let id: string | number = "abc";

// Literal Types
let direction: "left" | "right" | "up" | "down" = "left";

// any vs unknown
let anyValue: any = "anything";     // No type checking
let unknownValue: unknown = "anything"; // Must narrow before use
```

### Interface vs Type

```typescript
// Interface - for objects, can extend
interface User {
    name: string;
    age: number;
}

interface Admin extends User {
    role: string;
}

// Type - more flexible
type ID = string | number;
type Point = { x: number; y: number };
type Response<T> = { data: T; error: string | null };

// Declaration Merging (only interface)
interface User {
    email: string; // Merged with above
}
```

### Generics

```typescript
// Generic Function
function identity<T>(arg: T): T {
    return arg;
}

// Generic Interface
interface Container<T> {
    value: T;
    getValue: () => T;
}

// Generic Constraints
function getLength<T extends { length: number }>(arg: T): number {
    return arg.length;
}
```

### Utility Types

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

// Partial - all optional
type PartialUser = Partial<User>;

// Required - all required
type RequiredUser = Required<User>;

// Pick - select properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude properties
type UserWithoutEmail = Omit<User, 'email'>;

// Record - key-value mapping
type UserRoles = Record<string, User>;

// Readonly
type ImmutableUser = Readonly<User>;
```

### TypeScript + React

```typescript
// Component Props
interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled, children }) => {
    return <button onClick={onClick} disabled={disabled}>{label}{children}</button>;
};

// Event Types
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
};

// useState with Types
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// useRef with Types
const inputRef = useRef<HTMLInputElement>(null);
```

---

## Top Interview Questions

| Question | Difficulty |
|----------|------------|
| interface vs type? | 🟢 |
| Explain generics | 🟡 |
| What are utility types? | 🟡 |
| Type narrowing techniques | 🟡 |
| Discriminated unions | 🔴 |
| Conditional types | 🔴 |

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [Total TypeScript](https://www.totaltypescript.com/)

---

> **Thời gian ước tính:** 1 tuần (2h/ngày)
