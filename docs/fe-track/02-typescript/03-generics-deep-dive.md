# Generics Deep Dive / Tìm Hiểu Sâu về Generics

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[← Previous: Advanced Types](./02-advanced-types.md) | [Next: TypeScript Comprehensive](./04-typescript-comprehensive.md)

---

## Tổng Quan / Overview

Generics let you write reusable, type-safe abstractions without sacrificing inference quality. This chapter covers generic functions/interfaces/classes, constraints, conditional generics, `infer`, mapped/template literal interactions, recursive types, and utility types.

Bạn nên giải thích được cả mặt thiết kế API lẫn hiệu năng compile-time khi type-level logic quá phức tạp.

## Generic Functions

**Giải thích (VI):** Hàm generic tách phần logic chung khỏi kiểu dữ liệu cụ thể.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
function identity<T>(v: T): T { return v; }
```

## Generic Interfaces

**Giải thích (VI):** Interface generic định nghĩa contract tái sử dụng theo type parameter.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
interface ApiResponse<T> { data: T; ok: boolean }
```

## Generic Classes

**Giải thích (VI):** Class generic áp dụng khi object lưu trữ/biến đổi nhiều kiểu khác nhau.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
class Box<T> { constructor(public value: T) {} }
```

## Constraints with extends

**Giải thích (VI):** Ràng buộc đảm bảo type có thuộc tính/hành vi tối thiểu.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
function getId<T extends { id: string }>(v: T){ return v.id; }
```

## Conditional Types + Generics

**Giải thích (VI):** Conditional types kết hợp generic để branch theo dạng kiểu.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;
```

## infer Keyword

**Giải thích (VI):** infer trích xuất phần kiểu con trong conditional type.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type FnReturn<T> = T extends (...a: any[]) => infer R ? R : never;
```

## Mapped Types + Generics

**Giải thích (VI):** Mapped + generic giúp transform hàng loạt key/value của type.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

## Template Literal Types + Generics

**Giải thích (VI):** Tạo DSL string type-safe từ generic key sets.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type Getter<T extends string> = `get${Capitalize<T>}`;
```

## Recursive Generic Types

**Giải thích (VI):** Mô tả dữ liệu lồng nhau như tree/json configs.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
```

## Utility Types in Practice

**Giải thích (VI):** Partial/Required/Pick/Omit/Record chuẩn hóa thao tác type hàng ngày.

**English note:** Explain both inferability and constraint intent when presenting this in interview.

**Ví dụ (TypeScript):**
```ts
type PublicUser = Omit<{id:string;email:string;password:string}, 'password'>;
```

## Utility Types Quick Catalog / Danh Mục Utility Types

- `Partial<T>`: make properties optional
- `Required<T>`: make properties required
- `Readonly<T>`: immutable properties
- `Pick<T, K>`: select subset keys
- `Omit<T, K>`: remove keys
- `Record<K, T>`: dictionary type
- `Extract<T, U>` / `Exclude<T, U>`: union filtering
- `ReturnType<T>` / `Parameters<T>`: function reflection

## Cross References / Tham Chiếu Liên Quan

- [TypeScript Basics](./01-typescript-basics.md)
- [Advanced Types](./02-advanced-types.md)
- [Type Inference Theory](./05-type-inference-theory.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What problem do generics solve?

**Answer (EN):** They avoid duplication while preserving type safety across multiple data types.

**Giải thích (VI):** Generics giúp tái sử dụng code mà vẫn giữ type safety.

**Ví dụ (TypeScript):**
```ts
function wrap<T>(v:T){ return {v}; }
```

### 🟡 [Mid] Q2. When to add generic constraints?

**Answer (EN):** Add constraints when logic relies on specific members like `id` or `length`.

**Giải thích (VI):** Dùng constraints khi implementation cần thuộc tính cụ thể.

**Ví dụ (TypeScript):**
```ts
function size<T extends {length:number}>(v:T){ return v.length; }
```

### 🟡 [Mid] Q3. How does `infer` differ from explicit indexing?

**Answer (EN):** `infer` extracts unknown inner parts in pattern-matching style conditionals.

**Giải thích (VI):** infer trích xuất kiểu con khi chưa biết trước cấu trúc cụ thể.

**Ví dụ (TypeScript):**
```ts
type Arr<T> = T extends (infer U)[] ? U : T;
```

### 🔴 [Senior] Q4. How to keep generic APIs ergonomic?

**Answer (EN):** Prefer inference-first signatures and minimal explicit type arguments.

**Giải thích (VI):** Thiết kế API ưu tiên suy luận để giảm verbose cho người dùng.

**Ví dụ (TypeScript):**
```ts
function first<T>(arr: readonly T[]){ return arr[0]; }
```

### 🔴 [Senior] Q5. Generic design scenario 5

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q6. Generic design scenario 6

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q7. Generic design scenario 7

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q8. Generic design scenario 8

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q9. Generic design scenario 9

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q10. Generic design scenario 10

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q11. Generic design scenario 11

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q12. Generic design scenario 12

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q13. Generic design scenario 13

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q14. Generic design scenario 14

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q15. Generic design scenario 15

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q16. Generic design scenario 16

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q17. Generic design scenario 17

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q18. Generic design scenario 18

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q19. Generic design scenario 19

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q20. Generic design scenario 20

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q21. Generic design scenario 21

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q22. Generic design scenario 22

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q23. Generic design scenario 23

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q24. Generic design scenario 24

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q25. Generic design scenario 25

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q26. Generic design scenario 26

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q27. Generic design scenario 27

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q28. Generic design scenario 28

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q29. Generic design scenario 29

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q30. Generic design scenario 30

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q31. Generic design scenario 31

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q32. Generic design scenario 32

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q33. Generic design scenario 33

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q34. Generic design scenario 34

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q35. Generic design scenario 35

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q36. Generic design scenario 36

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q37. Generic design scenario 37

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q38. Generic design scenario 38

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q39. Generic design scenario 39

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q40. Generic design scenario 40

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q41. Generic design scenario 41

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q42. Generic design scenario 42

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q43. Generic design scenario 43

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q44. Generic design scenario 44

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q45. Generic design scenario 45

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q46. Generic design scenario 46

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q47. Generic design scenario 47

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q48. Generic design scenario 48

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q49. Generic design scenario 49

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q50. Generic design scenario 50

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q51. Generic design scenario 51

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q52. Generic design scenario 52

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q53. Generic design scenario 53

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q54. Generic design scenario 54

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟡 [Mid] Q55. Generic design scenario 55

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🔴 [Senior] Q56. Generic design scenario 56

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

### 🟢 [Junior] Q57. Generic design scenario 57

**Answer (EN):** Discuss constraints, defaults, and inferred call-site experience.

**Giải thích (VI):** Nêu constraints, default type parameters và trải nghiệm call-site.

**Ví dụ (TypeScript):**
```ts
type Api<T = unknown> = { data: T; error?: string };
```

