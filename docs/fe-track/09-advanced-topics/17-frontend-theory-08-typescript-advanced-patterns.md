# Frontend Theory 08: TypeScript Advanced Patterns

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Mẫu TypeScript nâng cao cho codebase frontend lớn. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Type inference boundaries and contextual typing

### 🟢 [Junior] Q1: How would you explain type inference boundaries and contextual typing in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Type inference boundaries and contextual typing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q2: How would you explain type inference boundaries and contextual typing in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Type inference boundaries and contextual typing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q3: How would you explain type inference boundaries and contextual typing in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Type inference boundaries and contextual typing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 2: Narrowing with control flow analysis

### 🟢 [Junior] Q4: How would you explain narrowing with control flow analysis in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Narrowing with control flow analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q5: How would you explain narrowing with control flow analysis in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Narrowing with control flow analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q6: How would you explain narrowing with control flow analysis in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Narrowing with control flow analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 3: Discriminated unions in UI state

### 🟢 [Junior] Q7: How would you explain discriminated unions in ui state in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Discriminated unions in UI state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q8: How would you explain discriminated unions in ui state in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Discriminated unions in UI state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q9: How would you explain discriminated unions in ui state in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Discriminated unions in UI state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 4: Conditional types and infer keyword

### 🟢 [Junior] Q10: How would you explain conditional types and infer keyword in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Conditional types and infer keyword**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q11: How would you explain conditional types and infer keyword in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Conditional types and infer keyword**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q12: How would you explain conditional types and infer keyword in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Conditional types and infer keyword**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 5: Mapped types for API contracts

### 🟢 [Junior] Q13: How would you explain mapped types for api contracts in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Mapped types for API contracts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q14: How would you explain mapped types for api contracts in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Mapped types for API contracts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q15: How would you explain mapped types for api contracts in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Mapped types for API contracts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 6: Template literal types for naming safety

### 🟢 [Junior] Q16: How would you explain template literal types for naming safety in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Template literal types for naming safety**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q17: How would you explain template literal types for naming safety in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Template literal types for naming safety**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q18: How would you explain template literal types for naming safety in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Template literal types for naming safety**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 7: Utility types in refactor-safe code

### 🟢 [Junior] Q19: How would you explain utility types in refactor-safe code in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Utility types in refactor-safe code**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q20: How would you explain utility types in refactor-safe code in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Utility types in refactor-safe code**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q21: How would you explain utility types in refactor-safe code in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Utility types in refactor-safe code**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 8: Generic constraints and default parameters

### 🟢 [Junior] Q22: How would you explain generic constraints and default parameters in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Generic constraints and default parameters**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q23: How would you explain generic constraints and default parameters in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Generic constraints and default parameters**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q24: How would you explain generic constraints and default parameters in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Generic constraints and default parameters**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 9: Variance and function type compatibility

### 🟢 [Junior] Q25: How would you explain variance and function type compatibility in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Variance and function type compatibility**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q26: How would you explain variance and function type compatibility in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Variance and function type compatibility**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q27: How would you explain variance and function type compatibility in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Variance and function type compatibility**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 10: Branded types for domain correctness

### 🟢 [Junior] Q28: How would you explain branded types for domain correctness in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Branded types for domain correctness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q29: How would you explain branded types for domain correctness in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Branded types for domain correctness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q30: How would you explain branded types for domain correctness in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Branded types for domain correctness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 11: Runtime validation and static type bridge

### 🟢 [Junior] Q31: How would you explain runtime validation and static type bridge in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Runtime validation and static type bridge**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q32: How would you explain runtime validation and static type bridge in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Runtime validation and static type bridge**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q33: How would you explain runtime validation and static type bridge in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Runtime validation and static type bridge**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

## Topic 12: React props typing and polymorphic components

### 🟢 [Junior] Q34: How would you explain react props typing and polymorphic components in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **React props typing and polymorphic components**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

### 🟡 [Mid] Q35: How would you explain react props typing and polymorphic components in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **React props typing and polymorphic components**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q36: How would you explain react props typing and polymorphic components in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **React props typing and polymorphic components**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```ts
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };

function mapResult<T, E, U>(input: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return input.ok ? { ok: true, data: fn(input.data) } : input;
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)
