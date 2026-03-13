# Performance Engineering / Kỹ Thuật Hiệu Năng Frontend


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

## Tổng Quan / Overview

- Bao phủ từ Core Web Vitals đến profiling CPU/memory/network trong production.
- Tập trung kỹ thuật ưu tiên tài nguyên, tối ưu JavaScript, rendering, và monitoring thực tế.
- Mỗi câu trả lời cần gắn metric trước/sau để thể hiện tư duy performance engineering.

### Cross-references / Tài liệu liên quan
- [Browser Rendering Theory](./17-frontend-theory-02-browser-rendering-theory.md)
- [Web Performance Optimization](./17-frontend-theory-06-web-performance-optimization.md)
- [Memory Management Deep Dive](./17-frontend-theory-15-memory-management-deep-dive.md)
- [HTTP Networking Theory](./17-frontend-theory-12-http-networking-theory.md)

## Key Concepts / Khái Niệm Trọng Tâm

### 1. Core Web Vitals strategy

**Tổng Quan:** `Core Web Vitals strategy` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget1 = (value: number, budget: number) => value <= budget;
```

### 2. Performance budgets

**Tổng Quan:** `Performance budgets` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget2 = (value: number, budget: number) => value <= budget;
```

### 3. Critical rendering path

**Tổng Quan:** `Critical rendering path` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget3 = (value: number, budget: number) => value <= budget;
```

### 4. Resource prioritization

**Tổng Quan:** `Resource prioritization` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget4 = (value: number, budget: number) => value <= budget;
```

### 5. Code splitting governance

**Tổng Quan:** `Code splitting governance` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget5 = (value: number, budget: number) => value <= budget;
```

### 6. Tree shaking pitfalls

**Tổng Quan:** `Tree shaking pitfalls` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget6 = (value: number, budget: number) => value <= budget;
```

### 7. Memoization boundaries

**Tổng Quan:** `Memoization boundaries` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget7 = (value: number, budget: number) => value <= budget;
```

### 8. Web Worker offloading

**Tổng Quan:** `Web Worker offloading` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget8 = (value: number, budget: number) => value <= budget;
```

### 9. Memory leak detection

**Tổng Quan:** `Memory leak detection` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget9 = (value: number, budget: number) => value <= budget;
```

### 10. Request batching

**Tổng Quan:** `Request batching` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget10 = (value: number, budget: number) => value <= budget;
```

### 11. Adaptive loading

**Tổng Quan:** `Adaptive loading` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget11 = (value: number, budget: number) => value <= budget;
```

### 12. Virtual scrolling

**Tổng Quan:** `Virtual scrolling` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget12 = (value: number, budget: number) => value <= budget;
```

### 13. RAF scheduling

**Tổng Quan:** `RAF scheduling` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget13 = (value: number, budget: number) => value <= budget;
```

### 14. Layout thrashing prevention

**Tổng Quan:** `Layout thrashing prevention` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget14 = (value: number, budget: number) => value <= budget;
```

### 15. Bundle regression control

**Tổng Quan:** `Bundle regression control` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget15 = (value: number, budget: number) => value <= budget;
```

### 16. RUM and alerting

**Tổng Quan:** `RUM and alerting` là năng lực bắt buộc khi thảo luận kỹ thuật hiệu năng frontend.

**Giải thích (VI):** Trình bày bối cảnh, trade-off và failure mode. Với interview, hãy nêu rõ bạn đo lường thành công bằng metric nào.

**Ví dụ (JS/TS):**
```ts
export const withinBudget16 = (value: number, budget: number) => value <= budget;
```

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Q01: How would you explain core web vitals strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Core Web Vitals strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget1 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q01: How would you explain core web vitals strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Core Web Vitals strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget21 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q01: How would you explain core web vitals strategy in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Core Web Vitals strategy`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget41 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q02: How would you explain performance budgets in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance budgets`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget2 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q02: How would you explain performance budgets in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance budgets`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget22 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q02: How would you explain performance budgets in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Performance budgets`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget42 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q03: How would you explain critical rendering path in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Critical rendering path`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget3 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q03: How would you explain critical rendering path in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Critical rendering path`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget23 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q03: How would you explain critical rendering path in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Critical rendering path`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget43 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q04: How would you explain resource prioritization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Resource prioritization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget4 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q04: How would you explain resource prioritization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Resource prioritization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget24 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q04: How would you explain resource prioritization in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Resource prioritization`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget44 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q05: How would you explain code splitting governance in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Code splitting governance`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget5 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q05: How would you explain code splitting governance in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Code splitting governance`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget25 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q05: How would you explain code splitting governance in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Code splitting governance`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget45 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q06: How would you explain tree shaking pitfalls in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Tree shaking pitfalls`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget6 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q06: How would you explain tree shaking pitfalls in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Tree shaking pitfalls`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget26 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q06: How would you explain tree shaking pitfalls in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Tree shaking pitfalls`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget46 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q07: How would you explain memoization boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memoization boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget7 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q07: How would you explain memoization boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memoization boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget27 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q07: How would you explain memoization boundaries in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memoization boundaries`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget47 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q08: How would you explain web worker offloading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Web Worker offloading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget8 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q08: How would you explain web worker offloading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Web Worker offloading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget28 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q08: How would you explain web worker offloading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Web Worker offloading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget48 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q09: How would you explain memory leak detection in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memory leak detection`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget9 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q09: How would you explain memory leak detection in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memory leak detection`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget29 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q09: How would you explain memory leak detection in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Memory leak detection`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget49 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q10: How would you explain request batching in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Request batching`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget10 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q10: How would you explain request batching in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Request batching`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget30 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q10: How would you explain request batching in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Request batching`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget50 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q11: How would you explain adaptive loading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Adaptive loading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget11 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q11: How would you explain adaptive loading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Adaptive loading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget31 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q11: How would you explain adaptive loading in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Adaptive loading`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget51 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q12: How would you explain virtual scrolling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Virtual scrolling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget12 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q12: How would you explain virtual scrolling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Virtual scrolling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget32 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q12: How would you explain virtual scrolling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Virtual scrolling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget52 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q13: How would you explain raf scheduling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RAF scheduling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget13 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q13: How would you explain raf scheduling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RAF scheduling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget33 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q13: How would you explain raf scheduling in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RAF scheduling`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget53 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q14: How would you explain layout thrashing prevention in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Layout thrashing prevention`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget14 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q14: How would you explain layout thrashing prevention in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Layout thrashing prevention`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget34 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q14: How would you explain layout thrashing prevention in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Layout thrashing prevention`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget54 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q15: How would you explain bundle regression control in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Bundle regression control`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget15 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q15: How would you explain bundle regression control in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Bundle regression control`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget35 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q15: How would you explain bundle regression control in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `Bundle regression control`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget55 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟢 [Junior] Q16: How would you explain rum and alerting in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RUM and alerting`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Junior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget16 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🟡 [Mid] Q16: How would you explain rum and alerting in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RUM and alerting`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Mid, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget36 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

### 🔴 [Senior] Q16: How would you explain rum and alerting in a frontend interview?

**Tổng Quan:** Trả lời ngắn, đúng vấn đề, rồi mở rộng bằng một tình huống thật từng gặp.

**Giải thích (VI):** Với `RUM and alerting`, bạn nên mô tả định nghĩa trước, sau đó nói cách triển khai trong dự án, cuối cùng nêu rủi ro và cách giảm rủi ro. Ở level Senior, ưu tiên trade-off thay vì học thuộc lòng.

**Ví dụ (JS/TS):**
```ts
export const withinBudget56 = (value: number, budget: number) => value <= budget;
```

**Follow-up (VI):** Bạn sẽ test, monitor, và rollback như thế nào nếu thay đổi này gây lỗi production?

## Rapid Review Checklist / Checklist Ôn Tập Nhanh

- Bạn có thể giải thích 16 concept ở cả 3 mức Junior/Mid/Senior?
- Bạn có ví dụ thực tế về bug/perf/security issue và bài học rút ra?
- Bạn có thể liên kết chủ đề hiện tại với testing, observability, và delivery?
- Bạn đã chuẩn bị câu trả lời song ngữ EN heading + VI explanation chưa?
- Bạn có thể vẽ luồng dữ liệu hoặc kiến trúc trong 2-3 phút trên whiteboard?

## Tóm Tắt / Summary

Tài liệu `Performance Engineering` đã được chuyển sang bilingual Q&A format với difficulty tags (`🟢 [Junior]`, `🟡 [Mid]`, `🔴 [Senior]`), chứa marker `Tổng Quan`, `Giải thích`, `Ví dụ`, có cross-reference bằng relative path và code mẫu JS/TS để luyện phỏng vấn.
