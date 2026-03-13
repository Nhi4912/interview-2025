# Frontend Theory 09: State Management Theory


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Lý thuyết quản lý state: local, global, server và derived state. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: State taxonomy and ownership

### 🟢 [Junior] Q1: How would you explain state taxonomy and ownership in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **State taxonomy and ownership**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q2: How would you explain state taxonomy and ownership in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **State taxonomy and ownership**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q3: How would you explain state taxonomy and ownership in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **State taxonomy and ownership**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 2: Local state versus global state decisions

### 🟢 [Junior] Q4: How would you explain local state versus global state decisions in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Local state versus global state decisions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q5: How would you explain local state versus global state decisions in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Local state versus global state decisions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q6: How would you explain local state versus global state decisions in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Local state versus global state decisions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 3: Props, context, and composition boundaries

### 🟢 [Junior] Q7: How would you explain props, context, and composition boundaries in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Props, context, and composition boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q8: How would you explain props, context, and composition boundaries in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Props, context, and composition boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q9: How would you explain props, context, and composition boundaries in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Props, context, and composition boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 4: Flux unidirectional data flow

### 🟢 [Junior] Q10: How would you explain flux unidirectional data flow in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Flux unidirectional data flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q11: How would you explain flux unidirectional data flow in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Flux unidirectional data flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q12: How would you explain flux unidirectional data flow in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Flux unidirectional data flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 5: Redux principles and reducer purity

### 🟢 [Junior] Q13: How would you explain redux principles and reducer purity in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Redux principles and reducer purity**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q14: How would you explain redux principles and reducer purity in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Redux principles and reducer purity**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q15: How would you explain redux principles and reducer purity in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Redux principles and reducer purity**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 6: Normalized state and entity modeling

### 🟢 [Junior] Q16: How would you explain normalized state and entity modeling in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Normalized state and entity modeling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q17: How would you explain normalized state and entity modeling in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Normalized state and entity modeling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q18: How would you explain normalized state and entity modeling in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Normalized state and entity modeling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 7: Derived state and selector memoization

### 🟢 [Junior] Q19: How would you explain derived state and selector memoization in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Derived state and selector memoization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q20: How would you explain derived state and selector memoization in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Derived state and selector memoization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q21: How would you explain derived state and selector memoization in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Derived state and selector memoization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 8: Server state versus client state

### 🟢 [Junior] Q22: How would you explain server state versus client state in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Server state versus client state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q23: How would you explain server state versus client state in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Server state versus client state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q24: How would you explain server state versus client state in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Server state versus client state**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 9: Optimistic updates and rollback strategy

### 🟢 [Junior] Q25: How would you explain optimistic updates and rollback strategy in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Optimistic updates and rollback strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q26: How would you explain optimistic updates and rollback strategy in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Optimistic updates and rollback strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q27: How would you explain optimistic updates and rollback strategy in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Optimistic updates and rollback strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 10: State machines for complex UI flows

### 🟢 [Junior] Q28: How would you explain state machines for complex ui flows in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **State machines for complex UI flows**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q29: How would you explain state machines for complex ui flows in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **State machines for complex UI flows**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q30: How would you explain state machines for complex ui flows in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **State machines for complex UI flows**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 11: Persistence and hydration concerns

### 🟢 [Junior] Q31: How would you explain persistence and hydration concerns in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Persistence and hydration concerns**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q32: How would you explain persistence and hydration concerns in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Persistence and hydration concerns**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q33: How would you explain persistence and hydration concerns in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Persistence and hydration concerns**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

## Topic 12: Debuggability and time-travel concepts

### 🟢 [Junior] Q34: How would you explain debuggability and time-travel concepts in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Debuggability and time-travel concepts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-08-typescript-advanced-patterns.md](./17-frontend-theory-08-typescript-advanced-patterns.md)

### 🟡 [Mid] Q35: How would you explain debuggability and time-travel concepts in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Debuggability and time-travel concepts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q36: How would you explain debuggability and time-travel concepts in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Debuggability and time-travel concepts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)
