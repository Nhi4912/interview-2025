# TypeScript Mind Map - Quick Reference


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả TypeScript concepts quan trọng.

---

## 🗺️ TypeScript Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TYPESCRIPT ECOSYSTEM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                             ┌──────────────┐                                │
│                             │  TYPESCRIPT  │                                │
│                             └──────┬───────┘                                │
│                                    │                                         │
│      ┌─────────────────────────────┼─────────────────────────────┐          │
│      │                             │                             │          │
│      ▼                             ▼                             ▼          │
│ ┌─────────┐                  ┌──────────┐                 ┌───────────┐     │
│ │  Types  │                  │ Generics │                 │ Utilities │     │
│ └────┬────┘                  └─────┬────┘                 └─────┬─────┘     │
│      │                             │                             │          │
│ ┌────┴────┐              ┌─────────┼─────────┐         ┌────────┼────────┐ │
│ │Primitive│              │         │         │         │        │        │ │
│ │ Object  │              │         │         │         │        │        │ │
│ │ Union   │              ▼         ▼         ▼         ▼        ▼        ▼ │
│ │ Tuple   │         Constraints  Infer  Conditional  Partial  Pick   Record│
│ │ Enum    │                                           Required Omit  keyof │
│ └─────────┘                                                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Type Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TYPE CATEGORIES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   PRIMITIVES              OBJECT TYPES             SPECIAL TYPES            │
│   ┌──────────────┐       ┌──────────────┐        ┌──────────────┐          │
│   │ string       │       │ object       │        │ any          │          │
│   │ number       │       │ array        │        │ unknown      │          │
│   │ boolean      │       │ tuple        │        │ never        │          │
│   │ null         │       │ function     │        │ void         │          │
│   │ undefined    │       │ interface    │        └──────────────┘          │
│   │ symbol       │       │ class        │                                   │
│   │ bigint       │       │ enum         │        LITERAL TYPES             │
│   └──────────────┘       └──────────────┘        ┌──────────────┐          │
│                                                   │ "hello"      │          │
│   UNION & INTERSECTION                            │ 42           │          │
│   ┌──────────────┐                               │ true         │          │
│   │ A | B        │ ── Either A or B              └──────────────┘          │
│   │ A & B        │ ── Both A and B                                         │
│   └──────────────┘                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Utility Types Cheatsheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UTILITY TYPES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   PROPERTY MODIFIERS                                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Partial<T>      │ All properties optional       │ { a?: 1, b?: 2 } │   │
│   │ Required<T>     │ All properties required       │ { a: 1, b: 2 }   │   │
│   │ Readonly<T>     │ All properties readonly       │ { readonly a: 1 }│   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   TYPE SELECTION                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Pick<T, K>      │ Select properties K from T                        │   │
│   │ Omit<T, K>      │ Exclude properties K from T                       │   │
│   │ Extract<T, U>   │ Extract types assignable to U                     │   │
│   │ Exclude<T, U>   │ Exclude types assignable to U                     │   │
│   │ NonNullable<T>  │ Remove null and undefined                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   FUNCTION TYPES                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ReturnType<T>   │ Function return type                              │   │
│   │ Parameters<T>   │ Function parameter types (tuple)                  │   │
│   │ Awaited<T>      │ Unwrap Promise type                               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   OBJECT CONSTRUCTION                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Record<K, V>    │ Object with keys K and values V                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Generics Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GENERICS PATTERNS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   BASIC SYNTAX                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ function identity<T>(arg: T): T { return arg; }                     │   │
│   │ interface Box<T> { value: T; }                                      │   │
│   │ type Result<T> = { data: T };                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   CONSTRAINTS                                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ T extends string            │ T must be string                      │   │
│   │ T extends { length: number }│ T must have length                    │   │
│   │ K extends keyof T           │ K must be key of T                    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   CONDITIONAL TYPES                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ T extends U ? X : Y         │ If T extends U then X else Y         │   │
│   │ T extends (infer R)[] ? R : never │ Extract array element type     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   MAPPED TYPES                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ { [K in keyof T]: T[K] }        │ Map over properties              │   │
│   │ { [K in keyof T]?: T[K] }       │ Make optional                    │   │
│   │ { readonly [K in keyof T]: T[K] } │ Make readonly                  │   │
│   │ { [K in keyof T as `get${K}`]: T[K] } │ Rename keys                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚛️ React + TypeScript

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REACT + TYPESCRIPT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   COMPONENT PROPS                                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ interface Props { name: string; age?: number; }                     │   │
│   │ function Component({ name, age }: Props) { ... }                    │   │
│   │                                                                     │   │
│   │ // With children                                                    │   │
│   │ interface Props { children: React.ReactNode; }                      │   │
│   │                                                                     │   │
│   │ // Extending HTML                                                   │   │
│   │ interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>│   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   HOOKS                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ useState<User | null>(null)                                         │   │
│   │ useRef<HTMLInputElement>(null)                                      │   │
│   │ useReducer(reducer, initialState)  // types inferred from reducer  │   │
│   │ useContext<AuthContextType>(AuthContext)                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   EVENTS                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ onClick: React.MouseEvent<HTMLButtonElement>                        │   │
│   │ onChange: React.ChangeEvent<HTMLInputElement>                       │   │
│   │ onSubmit: React.FormEvent<HTMLFormElement>                          │   │
│   │ onKeyDown: React.KeyboardEvent<HTMLInputElement>                    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏷️ Type Narrowing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TYPE NARROWING                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   BUILT-IN GUARDS                                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ typeof x === "string"       │ Primitive check                       │   │
│   │ x instanceof Date           │ Class instance check                  │   │
│   │ "property" in obj           │ Property existence                    │   │
│   │ Array.isArray(x)            │ Array check                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   CUSTOM TYPE GUARDS                                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ function isString(x: unknown): x is string {                        │   │
│   │     return typeof x === "string";                                   │   │
│   │ }                                                                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   DISCRIMINATED UNIONS                                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ type Result =                                                       │   │
│   │   | { status: "success"; data: T }                                  │   │
│   │   | { status: "error"; error: Error };                              │   │
│   │                                                                     │   │
│   │ if (result.status === "success") {                                  │   │
│   │     result.data // TypeScript knows data exists                     │   │
│   │ }                                                                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TOP INTERVIEW QUESTIONS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Q: any vs unknown?                                                         │
│   A: any: no type checking. unknown: type-safe, must narrow before use.     │
│                                                                              │
│   Q: interface vs type?                                                      │
│   A: interface: objects, declaration merging, extends.                      │
│      type: unions, tuples, mapped types, computed properties.               │
│                                                                              │
│   Q: Generic constraint?                                                     │
│   A: T extends SomeType - limits what T can be.                             │
│                                                                              │
│   Q: Discriminated union?                                                    │
│   A: Union with common property (discriminant) for narrowing.               │
│                                                                              │
│   Q: infer keyword?                                                          │
│   A: Extract type in conditional: T extends Array<infer U> ? U : never     │
│                                                                              │
│   Q: Mapped type?                                                            │
│   A: Transform type properties: { [K in keyof T]: T[K] }                    │
│                                                                              │
│   Q: keyof vs typeof?                                                        │
│   A: keyof: get union of keys. typeof: get type from value.                 │
│                                                                              │
│   Q: Branded type?                                                           │
│   A: Prevent mixing identical structures: type UserId = string & {__brand}  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ TypeScript Best Practices

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BEST PRACTICES                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   DO:                                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ✅ Use strict mode                                                  │   │
│   │ ✅ Prefer unknown over any                                          │   │
│   │ ✅ Use type inference when obvious                                  │   │
│   │ ✅ Create reusable utility types                                    │   │
│   │ ✅ Use discriminated unions for state                               │   │
│   │ ✅ Write type guards for runtime checks                             │   │
│   │ ✅ Use const assertions for literal types                           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   DON'T:                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ ❌ Use any (escape hatch only)                                      │   │
│   │ ❌ Use non-null assertion (!) carelessly                            │   │
│   │ ❌ Ignore TypeScript errors                                         │   │
│   │ ❌ Over-complicate types                                            │   │
│   │ ❌ Prefix interfaces with I                                         │   │
│   │ ❌ Use Function type (use specific signature)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Related Topics

- [01-type-system-basics.md](../02-typescript/01-type-system-basics.md) - Primitives, Objects
- [02-interfaces-vs-types.md](../02-typescript/02-advanced-types.md) - When to use what
- [03-generics.md](../02-typescript/03-generics-deep-dive.md) - Generic patterns
- [04-utility-types.md](../02-typescript/04-typescript-comprehensive.md) - Built-in utilities
- [05-advanced-patterns.md](../02-typescript/04-typescript-comprehensive.md) - Discriminated unions, Type guards
- [06-typescript-with-react.md](../02-typescript/05-react-typescript.md) - React integration

---

> **Quick Review Time:** 10 phút mỗi ngày với mindmap này
