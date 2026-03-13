# TypeScript Comprehensive Guide / Hướng Dẫn TypeScript Toàn Diện


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

[← Previous: Generics Deep Dive](./03-generics-deep-dive.md) | [Next: React + TS](./05-react-typescript.md) | [Related: Inference Theory](./05-type-inference-theory.md)

---

## Tổng Quan / Overview

This chapter is a complete reference for interview prep: structural typing, excess property checking, index signatures, mapped/conditional/template literal types, declaration merging, module augmentation, namespace vs modules, and project references.

Mục tiêu là hiểu sâu cơ chế hệ kiểu của TypeScript và trả lời được câu hỏi thiết kế trong phỏng vấn middle/senior.

## Structural Typing

**English:** TypeScript compares shapes (properties/methods), not nominal type names.

**Giải thích (VI):** TS kiểm tra tương thích theo cấu trúc object.

**Ví dụ (TypeScript):**
```ts
interface Point2D { x: number; y: number }
const p = { x: 1, y: 2, z: 3 };
const ok: Point2D = p; // compatible by shape
```

## Excess Property Checking

**English:** Object literals receive stricter checks to catch misspelled fields.

**Giải thích (VI):** Khi truyền object literal, TS kiểm tra thuộc tính dư để bắt lỗi chính tả.

**Ví dụ (TypeScript):**
```ts
interface User { id: string; name: string }
const u: User = { id: 'u1', name: 'Ann', role: 'admin' }; // error on literal
```

## Index Signatures

**English:** Model dynamic keys with explicit value constraints and optional readonly.

**Giải thích (VI):** Dùng index signature cho map động nhưng vẫn ràng buộc value type.

**Ví dụ (TypeScript):**
```ts
type Scores = { [subject: string]: number };
const scores: Scores = { math: 9, cs: 10 };
```

## Mapped Types

**English:** Transform property modifiers and value types systematically.

**Giải thích (VI):** Mapped type cho phép biến đổi toàn bộ thuộc tính theo quy tắc.

**Ví dụ (TypeScript):**
```ts
type Flags<T> = { [K in keyof T]: boolean };
type UserFlags = Flags<{ id: string; active: boolean }>;
```

## Conditional Types

**English:** Encode type-level branching with `extends ? :`.

**Giải thích (VI):** Conditional type mô hình hóa if/else ở tầng kiểu.

**Ví dụ (TypeScript):**
```ts
type ElementType<T> = T extends (infer U)[] ? U : T;
type A = ElementType<string[]>; // string
```

## Template Literal Types

**English:** Generate string unions and infer segments from text patterns.

**Giải thích (VI):** Template literal type tạo union chuỗi và tách thông tin từ pattern.

**Ví dụ (TypeScript):**
```ts
type Event = 'click' | 'focus';
type HandlerName = `on${Capitalize<Event>}`; // onClick | onFocus
```

## Declaration Merging

**English:** Interfaces and namespaces can merge declarations in same scope.

**Giải thích (VI):** Declaration merging giúp mở rộng định nghĩa theo nhiều file.

**Ví dụ (TypeScript):**
```ts
interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 10, height: 20 };
```

## Module Augmentation

**English:** Augment third-party module types safely without forking package.

**Giải thích (VI):** Module augmentation thêm type cho thư viện ngoài một cách an toàn.

**Ví dụ (TypeScript):**
```ts
declare module 'axios' {
  interface AxiosRequestConfig { requestId?: string }
}
```

## Namespace vs Modules

**English:** Prefer ES modules; namespaces mostly for legacy/global typing.

**Giải thích (VI):** Ưu tiên module ES; namespace chủ yếu cho legacy.

**Ví dụ (TypeScript):**
```ts
// module preferred
export function add(a: number, b: number){ return a+b }
```

## Project References

**English:** Split monorepo into incremental TS projects for faster builds.

**Giải thích (VI):** Project references tăng tốc build cho codebase lớn.

**Ví dụ (TypeScript):**
```ts
// tsconfig.json
{
  "files": [],
  "references": [{ "path": "../shared" }]
}
```

## Cross References / Tham Chiếu Liên Quan

- [TypeScript Basics](./01-typescript-basics.md)
- [Advanced Types](./02-advanced-types.md)
- [React + TypeScript](./05-react-typescript.md)
- [Modern Features](./06-typescript-modern-features.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is structural typing?

**Answer (EN):** Types are compatible when required members match.

**Giải thích (VI):** TypeScript dùng cấu trúc thay vì định danh tên kiểu.

**Ví dụ (TypeScript):**
```ts
type A={x:number}; type B={x:number;y:number}; const a:A={x:1,y:2} as any;
```

### 🟡 [Mid] Q2. Why does excess property checking exist?

**Answer (EN):** To catch accidental extra fields in object literals early.

**Giải thích (VI):** Nó giúp phát hiện typo hoặc field sai ngay lúc compile.

**Ví dụ (TypeScript):**
```ts
interface C{a:number}; const c:C={a:1,b:2}; // error
```

### 🟡 [Mid] Q3. How do mapped types differ from utility types?

**Answer (EN):** Utility types are predefined mapped/conditional patterns shipped by TS.

**Giải thích (VI):** Utility type là các mẫu dựng sẵn dựa trên mapped/conditional.

**Ví dụ (TypeScript):**
```ts
type Read<T>={readonly [K in keyof T]:T[K]};
```

### 🔴 [Senior] Q4. When to use project references?

**Answer (EN):** Use for large multi-package repos needing fast incremental builds and strict boundaries.

**Giải thích (VI):** Áp dụng cho monorepo lớn để tăng tốc build và tách boundary.

**Ví dụ (TypeScript):**
```ts
// composite + references in tsconfig
```

### 🔴 [Senior] Q5. How to augment third-party modules safely?

**Answer (EN):** Use declaration merging in local `.d.ts` and keep runtime behavior unchanged.

**Giải thích (VI):** Tăng cường type qua .d.ts, không sửa runtime package.

**Ví dụ (TypeScript):**
```ts
declare module 'x' { interface Options { trace?: boolean } }
```

### 🟢 [Junior] Q6. Comprehensive scenario 6

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q7. Comprehensive scenario 7

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q8. Comprehensive scenario 8

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q9. Comprehensive scenario 9

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q10. Comprehensive scenario 10

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q11. Comprehensive scenario 11

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q12. Comprehensive scenario 12

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q13. Comprehensive scenario 13

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q14. Comprehensive scenario 14

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q15. Comprehensive scenario 15

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q16. Comprehensive scenario 16

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q17. Comprehensive scenario 17

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q18. Comprehensive scenario 18

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q19. Comprehensive scenario 19

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q20. Comprehensive scenario 20

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q21. Comprehensive scenario 21

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q22. Comprehensive scenario 22

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q23. Comprehensive scenario 23

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q24. Comprehensive scenario 24

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q25. Comprehensive scenario 25

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q26. Comprehensive scenario 26

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q27. Comprehensive scenario 27

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q28. Comprehensive scenario 28

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q29. Comprehensive scenario 29

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q30. Comprehensive scenario 30

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q31. Comprehensive scenario 31

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q32. Comprehensive scenario 32

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q33. Comprehensive scenario 33

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q34. Comprehensive scenario 34

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q35. Comprehensive scenario 35

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q36. Comprehensive scenario 36

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q37. Comprehensive scenario 37

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q38. Comprehensive scenario 38

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q39. Comprehensive scenario 39

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q40. Comprehensive scenario 40

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q41. Comprehensive scenario 41

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q42. Comprehensive scenario 42

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q43. Comprehensive scenario 43

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q44. Comprehensive scenario 44

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q45. Comprehensive scenario 45

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q46. Comprehensive scenario 46

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q47. Comprehensive scenario 47

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q48. Comprehensive scenario 48

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q49. Comprehensive scenario 49

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q50. Comprehensive scenario 50

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q51. Comprehensive scenario 51

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q52. Comprehensive scenario 52

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q53. Comprehensive scenario 53

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q54. Comprehensive scenario 54

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q55. Comprehensive scenario 55

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🔴 [Senior] Q56. Comprehensive scenario 56

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟢 [Junior] Q57. Comprehensive scenario 57

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

### 🟡 [Mid] Q58. Comprehensive scenario 58

**Answer (EN):** Explain mechanics, edge cases, and trade-offs.

**Giải thích (VI):** Trả lời theo cơ chế, ngoại lệ và đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Scenario<T> = T extends string ? 'text' : 'other';
```

