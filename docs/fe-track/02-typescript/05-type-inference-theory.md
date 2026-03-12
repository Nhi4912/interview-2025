# Type Inference Theory / Lý Thuyết Suy Luận Kiểu

[← Related: TypeScript Basics](./01-typescript-basics.md) | [Related: Comprehensive Guide](./04-typescript-comprehensive.md)

---

## Tổng Quan / Overview

Type inference is the compiler process that deduces types from values, context, and control flow. Interviewers often ask *why* inference chooses a type, not only what type is produced.

Phần này tập trung vào algorithm, contextual typing, best common type, control-flow analysis, widening/narrowing, const assertions, `satisfies`, và variance.

## Inference Algorithm

**English:** Constraint collection → candidate synthesis → contextual adjustment → finalization.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const n = 1;
const arr = [1, 2, 3];
```

## Contextual Typing

**English:** Expression type derives from where it appears (callbacks, JSX props, assignment targets).

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const xs = [1,2,3];
xs.map(x => x.toFixed(2));
```

## Best Common Type

**English:** For arrays/unions, TS finds supertype compatible with all elements.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const mixed = [1, 'a']; // (string | number)[]
```

## Control Flow Analysis

**English:** Branches narrow unions based on runtime guards and reachability.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
function fn(v: string | number){ if(typeof v==='string') return v.length; return v.toFixed(2); }
```

## Widening vs Narrowing

**English:** `let` widens literal; `const` preserves literal. Guards narrow unions.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
let mode = 'dark'; // string
const lock = 'dark'; // 'dark'
```

## Const Assertions

**English:** `as const` freezes literals and readonly tuple/object semantics.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const cfg = { env: 'prod', retries: 3 } as const;
```

## satisfies Operator

**English:** Validate against target type without changing inferred literal precision.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
const routes = { home: '/', about: '/about' } satisfies Record<string, `/${string}`>;
```

## Variance Basics

**English:** Function parameters are contravariant in strict function types; return types covariant.

**Giải thích (VI):** Trả lời theo cơ chế compiler và ví dụ phản-biện để thể hiện hiểu sâu.

**Ví dụ (TypeScript):**
```ts
type F1 = (x: string | number) => string;
type F2 = (x: string) => string;
```

## Cross References / Tham Chiếu Liên Quan

- [Generics Deep Dive](./03-generics-deep-dive.md)
- [TypeScript Comprehensive](./04-typescript-comprehensive.md)
- [React with TypeScript](./05-react-typescript.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is contextual typing?

**Answer (EN):** Type comes from usage location, e.g., callback parameter in array methods.

**Giải thích (VI):** Kiểu được suy ra từ ngữ cảnh sử dụng như callback.

**Ví dụ (TypeScript):**
```ts
[1,2,3].map(n => n.toFixed(1));
```

### 🟡 [Mid] Q2. Explain widening and narrowing with examples.

**Answer (EN):** Widening generalizes literals; narrowing specializes union through guards.

**Giải thích (VI):** Widening mở rộng literal, narrowing thu hẹp union bằng điều kiện.

**Ví dụ (TypeScript):**
```ts
let a='x'; const b='x';
```

### 🟡 [Mid] Q3. What does `satisfies` solve?

**Answer (EN):** It checks compatibility while preserving precise inferred literals for downstream use.

**Giải thích (VI):** Nó kiểm tra tương thích mà vẫn giữ literal inference chi tiết.

**Ví dụ (TypeScript):**
```ts
const t={mode:'dark'} satisfies {mode:string};
```

### 🔴 [Senior] Q4. Why variance matters for callbacks?

**Answer (EN):** Incorrect variance assumptions can make callback APIs unsound and unsafe.

**Giải thích (VI):** Hiểu variance giúp thiết kế API callback an toàn.

**Ví dụ (TypeScript):**
```ts
type Handler<T> = (value: T) => void;
```

### 🔴 [Senior] Q5. Inference scenario 5

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q6. Inference scenario 6

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q7. Inference scenario 7

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q8. Inference scenario 8

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q9. Inference scenario 9

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q10. Inference scenario 10

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q11. Inference scenario 11

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q12. Inference scenario 12

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q13. Inference scenario 13

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q14. Inference scenario 14

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q15. Inference scenario 15

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q16. Inference scenario 16

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q17. Inference scenario 17

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q18. Inference scenario 18

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q19. Inference scenario 19

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q20. Inference scenario 20

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q21. Inference scenario 21

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q22. Inference scenario 22

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q23. Inference scenario 23

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q24. Inference scenario 24

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q25. Inference scenario 25

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q26. Inference scenario 26

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q27. Inference scenario 27

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q28. Inference scenario 28

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q29. Inference scenario 29

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q30. Inference scenario 30

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q31. Inference scenario 31

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q32. Inference scenario 32

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q33. Inference scenario 33

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q34. Inference scenario 34

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q35. Inference scenario 35

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q36. Inference scenario 36

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q37. Inference scenario 37

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q38. Inference scenario 38

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q39. Inference scenario 39

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q40. Inference scenario 40

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q41. Inference scenario 41

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q42. Inference scenario 42

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q43. Inference scenario 43

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q44. Inference scenario 44

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q45. Inference scenario 45

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q46. Inference scenario 46

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q47. Inference scenario 47

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q48. Inference scenario 48

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q49. Inference scenario 49

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q50. Inference scenario 50

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q51. Inference scenario 51

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q52. Inference scenario 52

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q53. Inference scenario 53

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟢 [Junior] Q54. Inference scenario 54

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🟡 [Mid] Q55. Inference scenario 55

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

### 🔴 [Senior] Q56. Inference scenario 56

**Answer (EN):** Describe inference boundary and when explicit annotation is better.

**Giải thích (VI):** Nêu ranh giới suy luận và lúc cần chú thích tường minh.

**Ví dụ (TypeScript):**
```ts
type Infer<T> = T extends Promise<infer U> ? U : T;
```

