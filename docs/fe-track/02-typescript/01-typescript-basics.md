# TypeScript Basics / Cơ Bản TypeScript

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## TypeScript - Chapter 1 / TypeScript - Chương 1
[Back to Table of Contents](../../00-table-of-contents.md) | [Next: Advanced Types →](./02-advanced-types.md) | [Related: Generics](./03-generics-deep-dive.md)

---
## Tổng Quan / Overview

TypeScript provides static typing on top of JavaScript. This chapter focuses on foundational concepts used in junior-to-mid frontend interviews: annotations, interfaces vs types, unions/intersections, literal types, enums, assertions, narrowing, and tsconfig setup.

Trong chương này bạn cần hiểu cách TypeScript mô hình hóa dữ liệu, cách compiler thu hẹp kiểu qua control-flow, và cách cấu hình strict mode để bắt lỗi sớm.

## Learning Path / Lộ Trình Học

1. Type annotations
2. Interfaces vs type aliases
3. Union/intersection/literal types
4. Enum and assertions
5. Type guards and narrowing
6. Strict compiler options
7. tsconfig essentials and declaration files

## Type Annotations

**Giải thích (VI):** Chú thích kiểu giúp compiler kiểm tra dữ liệu ngay khi viết code.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
let username: string = 'neo';
let score: number = 100;
let active: boolean = true;
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Interfaces vs Type Aliases

**Giải thích (VI):** interface phù hợp cho object contract và declaration merging; type mạnh khi cần union/intersection.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
interface User { id: string; name: string }
type UserId = User['id'];
type Admin = User & { role: 'admin' };
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Union and Intersection

**Giải thích (VI):** Union biểu diễn OR, intersection biểu diễn AND.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
type ApiResult = { ok: true; data: string } | { ok: false; error: string };
type WithMeta = { id: string } & { createdAt: Date };
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Literal Types

**Giải thích (VI):** Literal types khóa giá trị vào tập nhỏ, hữu ích cho state machine.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
type Size = 'sm' | 'md' | 'lg';
const defaultSize: Size = 'md';
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Enums

**Giải thích (VI):** Ưu tiên union literals trong FE, enum phù hợp khi cần namespace runtime.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
enum Status { Idle = 'idle', Loading = 'loading', Done = 'done' }
const s: Status = Status.Idle;
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Type Assertions

**Giải thích (VI):** Assertion nói với compiler "tôi biết rõ hơn"; tránh lạm dụng.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
const el = document.getElementById('app') as HTMLDivElement | null;
if (el) el.textContent = 'ready';
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Type Guards

**Giải thích (VI):** Guard thu hẹp kiểu an toàn bằng typeof/in/instanceof/custom predicate.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Control-flow Narrowing

**Giải thích (VI):** if/switch/early return giúp TS thu hẹp kiểu theo nhánh logic.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
function print(v: string | number) {
  if (typeof v === 'string') return v.toUpperCase();
  return v.toFixed(2);
}
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Strict Mode Options

**Giải thích (VI):** strict bật nhóm kiểm tra mạnh: null safety, function variance, initialization.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## tsconfig Essentials

**Giải thích (VI):** Cần rõ module target, baseUrl/paths, include/exclude cho dự án lớn.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Declaration Files (.d.ts)

**Giải thích (VI):** Declaration file mô tả shape của thư viện JS không có type.

**Key points (EN):** Practical interview-level summary with trade-offs and common mistakes.

**Ví dụ (TypeScript):**
```ts
declare module 'legacy-lib' {
  export function format(v: string): string;
}
```

**Interview note:** Explain *why* this choice improves safety and maintainability, not just syntax.

## Common Mistakes and Fixes / Lỗi Thường Gặp và Cách Sửa

### Mistake 1: Overusing `any`

**Giải thích (VI):** `any` phá vỡ type safety toàn chuỗi gọi hàm. Chỉ dùng khi biên giới với hệ thống chưa typed và nên thay bằng `unknown` + guard.

**Ví dụ (TypeScript):**
```ts
function parsePayload(raw: unknown): { id: string } {
  if (typeof raw === 'object' && raw !== null && 'id' in raw) {
    return { id: String((raw as { id: unknown }).id) };
  }
  throw new Error('invalid payload');
}
```

### Mistake 2: Ignoring strict flags in CI

**Giải thích (VI):** Nhiều team bật strict cục bộ nhưng CI không enforce, dẫn tới regression. Cần chạy `tsc --noEmit` trong pipeline.

**Ví dụ (TypeScript):**
```ts
// package.json scripts
// "typecheck": "tsc --noEmit"
```

### Mistake 3: Unsafe assertions in DOM code

**Giải thích (VI):** Assert trực tiếp `as HTMLInputElement` có thể crash runtime nếu selector sai. Luôn kiểm tra null.

**Ví dụ (TypeScript):**
```ts
const node = document.querySelector('#email');
if (node instanceof HTMLInputElement) {
  node.value = 'hello@example.com';
}
```

## Cross References / Tham Chiếu Liên Quan

- [Advanced Types](./02-advanced-types.md)
- [Generics Deep Dive](./03-generics-deep-dive.md)
- [TypeScript Comprehensive](./04-typescript-comprehensive.md)
- [Type Inference Theory](./05-type-inference-theory.md)

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q1. What is a type annotation?

**Answer (EN):** A type annotation explicitly declares the expected type for a variable, parameter, or return value.

**Giải thích (VI):** Type annotation giúp code rõ ràng, IDE gợi ý tốt hơn, và bắt lỗi sớm.

**Ví dụ (TypeScript):**
```ts
function add(a: number, b: number): number { return a + b; }
```

### 🟢 [Junior] Q2. When should I use interface?

**Answer (EN):** Use interface for object contracts and extension in OOP-like domain models.

**Giải thích (VI):** Dùng interface khi mô tả shape object và cần extends/merge.

**Ví dụ (TypeScript):**
```ts
interface Product { id: string; price: number }
```

### 🟢 [Junior] Q3. When should I use type alias?

**Answer (EN):** Use type for unions, mapped types, conditional types, and composition-heavy models.

**Giải thích (VI):** type mạnh khi ghép kiểu, tạo union/intersection.

**Ví dụ (TypeScript):**
```ts
type Result = { ok: true } | { ok: false; error: string };
```

### 🟢 [Junior] Q4. What is a union type?

**Answer (EN):** A union allows one value to be one of multiple listed types.

**Giải thích (VI):** Union thể hiện lựa chọn OR giữa nhiều kiểu.

**Ví dụ (TypeScript):**
```ts
let id: string | number = 'A01'; id = 101;
```

### 🟢 [Junior] Q5. What is an intersection type?

**Answer (EN):** An intersection combines requirements from multiple types into one.

**Giải thích (VI):** Intersection là AND: phải thỏa tất cả thuộc tính.

**Ví dụ (TypeScript):**
```ts
type A = { a: string }; type B = { b: number }; type AB = A & B;
```

### 🟡 [Mid] Q6. Why are literal types useful in UI state?

**Answer (EN):** Literal unions prevent invalid state transitions by constraining allowed values.

**Giải thích (VI):** Literal type giúp state machine chặt chẽ và tránh typo.

**Ví dụ (TypeScript):**
```ts
type View = 'list' | 'detail' | 'edit';
```

### 🟡 [Mid] Q7. Enum vs string literal union?

**Answer (EN):** String literal unions are lighter and often preferred in frontend; enums provide runtime object.

**Giải thích (VI):** FE thường ưu tiên union literals vì tree-shaking và đơn giản.

**Ví dụ (TypeScript):**
```ts
type Role = 'user' | 'admin';
```

### 🟢 [Junior] Q8. What does `as` do?

**Answer (EN):** `as` performs compile-time assertion only and does not transform runtime values.

**Giải thích (VI):** `as` chỉ ảnh hưởng compile-time, không convert dữ liệu thật.

**Ví dụ (TypeScript):**
```ts
const n = '42' as unknown as number; // unsafe
```

### 🟡 [Mid] Q9. How to write a custom type guard?

**Answer (EN):** Return a predicate signature (`value is T`) and check runtime shape safely.

**Giải thích (VI):** Custom guard kết hợp kiểm tra runtime + predicate type.

**Ví dụ (TypeScript):**
```ts
function isError(e: unknown): e is Error { return e instanceof Error; }
```

### 🟡 [Mid] Q10. How does narrowing work with control flow?

**Answer (EN):** TypeScript narrows by branch conditions, returns, throws, and exhaustive checks.

**Giải thích (VI):** Compiler theo dõi luồng điều khiển để thu hẹp kiểu.

**Ví dụ (TypeScript):**
```ts
function f(v: string | null){ if(!v) return; return v.toUpperCase(); }
```

### 🟡 [Mid] Q11. What does `strictNullChecks` protect?

**Answer (EN):** It prevents using `null`/`undefined` where non-null values are required.

**Giải thích (VI):** Bảo vệ khỏi lỗi null pointer bằng kiểm tra tường minh.

**Ví dụ (TypeScript):**
```ts
let x: string | undefined; // must check before use
```

### 🟡 [Mid] Q12. Why enable `noImplicitAny`?

**Answer (EN):** It blocks accidental `any` and forces explicit modeling of unknown values.

**Giải thích (VI):** Tránh kiểu any ngầm làm mất an toàn kiểu.

**Ví dụ (TypeScript):**
```ts
function parse(v) { return v; } // error with noImplicitAny
```

### 🔴 [Senior] Q13. What is declaration file strategy for legacy JS?

**Answer (EN):** Create `.d.ts` wrappers for high-traffic APIs first, then expand coverage incrementally.

**Giải thích (VI):** Bọc type cho API quan trọng trước để giảm rủi ro migration.

**Ví dụ (TypeScript):**
```ts
declare module 'legacy' { export function init(): void }
```

### 🔴 [Senior] Q14. How do you enforce safe indexing?

**Answer (EN):** Enable `noUncheckedIndexedAccess` and model maps with explicit undefined handling.

**Giải thích (VI):** Bật cờ này để tránh assume key luôn tồn tại.

**Ví dụ (TypeScript):**
```ts
const map: Record<string, number> = {}; const v = map['x']; // number | undefined
```

### 🟢 [Junior] Q15. What is `unknown`?

**Answer (EN):** `unknown` is a safe top type that requires narrowing before use.

**Giải thích (VI):** unknown an toàn hơn any vì bắt buộc kiểm tra trước khi dùng.

**Ví dụ (TypeScript):**
```ts
function handle(v: unknown){ if(typeof v === 'string') v.toUpperCase(); }
```

### 🟡 [Mid] Q16. How to configure path aliases?

**Answer (EN):** Use `baseUrl` and `paths` in tsconfig and align with bundler config.

**Giải thích (VI):** Alias giúp import sạch hơn nhưng phải đồng bộ bundler/test.

**Ví dụ (TypeScript):**
```ts
// tsconfig paths: "@/*": ["src/*"]
```

### 🔴 [Senior] Q17. How to explain structural typing in interview?

**Answer (EN):** Compatibility depends on shape, not nominal declarations.

**Giải thích (VI):** TS so khớp theo cấu trúc thuộc tính thay vì tên kiểu.

**Ví dụ (TypeScript):**
```ts
type P = { x: number }; const p: P = { x: 1, y: 2 } as any;
```

### 🟢 [Junior] Q18. What is tuple?

**Answer (EN):** Tuple is a fixed-length array with known element types by position.

**Giải thích (VI):** Tuple phù hợp cho dữ liệu có thứ tự và ý nghĩa theo index.

**Ví dụ (TypeScript):**
```ts
const pair: [string, number] = ['age', 30];
```

### 🟡 [Mid] Q19. How to type function overloads?

**Answer (EN):** Declare overload signatures followed by one implementation signature.

**Giải thích (VI):** Overload hữu ích khi API có nhiều cách gọi rõ ràng.

**Ví dụ (TypeScript):**
```ts
function len(v: string): number; function len(v: any[]): number; function len(v: string|any[]){return v.length;}
```

### 🔴 [Senior] Q20. How do strict options affect refactoring?

**Answer (EN):** They increase upfront friction but dramatically reduce regression risk in large codebases.

**Giải thích (VI):** Strict mode làm migration khó hơn ban đầu nhưng ổn định dài hạn.

**Ví dụ (TypeScript):**
```ts
// enable strict suite in stages with CI gates
```

### 🔴 [Senior] Q21. Practice scenario 21: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q22. Practice scenario 22: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q23. Practice scenario 23: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q24. Practice scenario 24: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q25. Practice scenario 25: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q26. Practice scenario 26: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q27. Practice scenario 27: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q28. Practice scenario 28: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q29. Practice scenario 29: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q30. Practice scenario 30: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q31. Practice scenario 31: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q32. Practice scenario 32: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q33. Practice scenario 33: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q34. Practice scenario 34: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q35. Practice scenario 35: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q36. Practice scenario 36: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q37. Practice scenario 37: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q38. Practice scenario 38: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q39. Practice scenario 39: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q40. Practice scenario 40: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q41. Practice scenario 41: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🔴 [Senior] Q42. Practice scenario 42: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q43. Practice scenario 43: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

### 🟡 [Mid] Q44. Practice scenario 44: explain a typing decision

**Answer (EN):** State constraints, model types explicitly, and justify trade-offs.

**Giải thích (VI):** Trình bày ràng buộc nghiệp vụ, chọn type phù hợp và nêu đánh đổi.

**Ví dụ (TypeScript):**
```ts
type Decision = { reason: string; risk: 'low' | 'high' };
```

