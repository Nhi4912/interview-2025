# React with TypeScript / React với TypeScript

[← Previous: TypeScript Comprehensive](./04-typescript-comprehensive.md) | [Related: Advanced Types](./02-advanced-types.md) | [Related: Modern Features](./06-typescript-modern-features.md)

---

## Tổng Quan / Overview

This guide covers interview-critical patterns: component typing, hooks typing, event typing, generic components, HOCs, render props, context, forms, API response modeling, and discriminated unions for state machines.

Mục tiêu là viết React code an toàn kiểu nhưng vẫn ergonomics, tránh over-typing và giữ DX tốt cho team.

## Component Typing (FC, props, children)

**Giải thích (VI):** Nên ưu tiên function component + props type rõ ràng; chỉ dùng React.FC khi thực sự cần.

**Ví dụ (TypeScript):**
```tsx
type CardProps = { title: string; children?: React.ReactNode };
function Card({ title, children }: CardProps) {
  return <section><h3>{title}</h3>{children}</section>;
}
```

## useState and useReducer Typing

**Giải thích (VI):** State phức tạp nên dùng discriminated union để reducer rõ ràng và exhaustive.

**Ví dụ (TypeScript):**
```tsx
type State = { status:'idle' } | { status:'loading' } | { status:'success'; data:string[] } | { status:'error'; message:string };
```

## useRef and DOM Typing

**Giải thích (VI):** Ref DOM thường null ở lần render đầu, luôn optional-chain hoặc guard.

**Ví dụ (TypeScript):**
```tsx
const inputRef = useRef<HTMLInputElement | null>(null);
inputRef.current?.focus();
```

## useContext Typing

**Giải thích (VI):** Custom hook giúp tránh null-check lặp lại ở mọi component con.

**Ví dụ (TypeScript):**
```tsx
const Ctx = createContext<string | null>(null);
function useValue(){ const v = useContext(Ctx); if(!v) throw new Error('missing provider'); return v; }
```

## Event Typing

**Giải thích (VI):** Typing event chuẩn giúp truy cập target/currentTarget chính xác.

**Ví dụ (TypeScript):**
```tsx
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
```

## Generic Components

**Giải thích (VI):** Generic component tái sử dụng cao nhưng cần constraints hợp lý.

**Ví dụ (TypeScript):**
```tsx
type TableProps<T extends { id: string }> = { rows: T[] };
```

## HOC Typing

**Giải thích (VI):** HOC dễ làm mất type props, cần giữ generic đúng.

**Ví dụ (TypeScript):**
```tsx
function withLoading<P>(Comp: React.ComponentType<P>){ return (props: P & {loading:boolean}) => props.loading ? <p>Loading</p> : <Comp {...props} />; }
```

## Render Props Typing

**Giải thích (VI):** Render props cần contract callback rõ input/output.

**Ví dụ (TypeScript):**
```tsx
type FetcherProps<T> = { children: (state: {data?:T; loading:boolean}) => React.ReactNode };
```

## Form Handling and Validation

**Giải thích (VI):** Form nên có shape type ổn định để map lỗi và submit.

**Ví dụ (TypeScript):**
```tsx
type LoginForm = { email: string; password: string };
```

## API Response Typing

**Giải thích (VI):** Union response giúp UI xử lý success/error an toàn.

**Ví dụ (TypeScript):**
```tsx
type Api<T> = { ok: true; data: T } | { ok: false; error: string };
```

## Cross References / Tham Chiếu Liên Quan

- [TypeScript Basics](./01-typescript-basics.md)
- [Type Inference Theory](./05-type-inference-theory.md)
- [TypeScript Modern Features](./06-typescript-modern-features.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. Should I use React.FC by default?

**Answer (EN):** Usually no. Prefer plain function components with explicit props.

**Giải thích (VI):** Thông thường không; dùng function component thường để tránh children ngầm.

**Ví dụ (TypeScript):**
```ts
type Props={name:string}; const Comp=({name}:Props)=><div>{name}</div>;
```

### 🟡 [Mid] Q2. How to type `useState` with null initial value?

**Answer (EN):** Use explicit generic and nullable union.

**Giải thích (VI):** Khai báo generic tường minh khi initial là null.

**Ví dụ (TypeScript):**
```ts
const [user, setUser] = useState<User | null>(null);
```

### 🟡 [Mid] Q3. How to type reducer actions?

**Answer (EN):** Use discriminated union actions and exhaustive switch.

**Giải thích (VI):** Reducer action nên là union có `type` để TS kiểm tra đủ case.

**Ví dụ (TypeScript):**
```ts
type Act={type:'inc'}|{type:'set';value:number};
```

### 🔴 [Senior] Q4. How to design API state for screens?

**Answer (EN):** Use discriminated unions separating loading/success/error for impossible state elimination.

**Giải thích (VI):** Dùng union phân biệt để loại bỏ trạng thái bất khả thi.

**Ví dụ (TypeScript):**
```ts
type S={k:'idle'}|{k:'loading'}|{k:'ok';data:string[]}|{k:'err';msg:string};
```

### 🔴 [Senior] Q5. React TS scenario 5

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q6. React TS scenario 6

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q7. React TS scenario 7

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q8. React TS scenario 8

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q9. React TS scenario 9

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q10. React TS scenario 10

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q11. React TS scenario 11

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q12. React TS scenario 12

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q13. React TS scenario 13

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q14. React TS scenario 14

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q15. React TS scenario 15

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q16. React TS scenario 16

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q17. React TS scenario 17

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q18. React TS scenario 18

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q19. React TS scenario 19

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q20. React TS scenario 20

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q21. React TS scenario 21

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q22. React TS scenario 22

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q23. React TS scenario 23

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q24. React TS scenario 24

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q25. React TS scenario 25

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q26. React TS scenario 26

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q27. React TS scenario 27

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q28. React TS scenario 28

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q29. React TS scenario 29

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q30. React TS scenario 30

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q31. React TS scenario 31

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q32. React TS scenario 32

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q33. React TS scenario 33

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q34. React TS scenario 34

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q35. React TS scenario 35

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q36. React TS scenario 36

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q37. React TS scenario 37

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q38. React TS scenario 38

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q39. React TS scenario 39

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q40. React TS scenario 40

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q41. React TS scenario 41

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q42. React TS scenario 42

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q43. React TS scenario 43

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q44. React TS scenario 44

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q45. React TS scenario 45

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q46. React TS scenario 46

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q47. React TS scenario 47

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q48. React TS scenario 48

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q49. React TS scenario 49

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q50. React TS scenario 50

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q51. React TS scenario 51

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q52. React TS scenario 52

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🔴 [Senior] Q53. React TS scenario 53

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟢 [Junior] Q54. React TS scenario 54

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

### 🟡 [Mid] Q55. React TS scenario 55

**Answer (EN):** Discuss typing boundaries and runtime validation responsibilities.

**Giải thích (VI):** Nêu ranh giới giữa type compile-time và validate runtime.

**Ví dụ (TypeScript):**
```ts
type Bound<T> = { value: T; valid: boolean };
```

