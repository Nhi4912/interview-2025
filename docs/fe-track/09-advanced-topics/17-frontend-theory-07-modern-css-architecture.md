# Frontend Theory 07: Modern CSS Architecture


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Kiến trúc CSS hiện đại: cascade, layout và maintainability. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Cascade, specificity, and inheritance model

### 🟢 [Junior] Q1: How would you explain cascade, specificity, and inheritance model in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Cascade, specificity, and inheritance model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q2: How would you explain cascade, specificity, and inheritance model in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Cascade, specificity, and inheritance model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q3: How would you explain cascade, specificity, and inheritance model in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Cascade, specificity, and inheritance model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 2: Box model and sizing strategies

### 🟢 [Junior] Q4: How would you explain box model and sizing strategies in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Box model and sizing strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q5: How would you explain box model and sizing strategies in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Box model and sizing strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q6: How would you explain box model and sizing strategies in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Box model and sizing strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 3: Flexbox mental model and constraints

### 🟢 [Junior] Q7: How would you explain flexbox mental model and constraints in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Flexbox mental model and constraints**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q8: How would you explain flexbox mental model and constraints in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Flexbox mental model and constraints**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q9: How would you explain flexbox mental model and constraints in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Flexbox mental model and constraints**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 4: Grid tracks and placement algorithm

### 🟢 [Junior] Q10: How would you explain grid tracks and placement algorithm in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Grid tracks and placement algorithm**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q11: How would you explain grid tracks and placement algorithm in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Grid tracks and placement algorithm**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q12: How would you explain grid tracks and placement algorithm in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Grid tracks and placement algorithm**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 5: Container queries for component-scale design

### 🟢 [Junior] Q13: How would you explain container queries for component-scale design in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Container queries for component-scale design**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q14: How would you explain container queries for component-scale design in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Container queries for component-scale design**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q15: How would you explain container queries for component-scale design in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Container queries for component-scale design**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 6: Cascade layers and style governance

### 🟢 [Junior] Q16: How would you explain cascade layers and style governance in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Cascade layers and style governance**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q17: How would you explain cascade layers and style governance in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Cascade layers and style governance**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q18: How would you explain cascade layers and style governance in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Cascade layers and style governance**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 7: CSS custom properties and design tokens

### 🟢 [Junior] Q19: How would you explain css custom properties and design tokens in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **CSS custom properties and design tokens**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q20: How would you explain css custom properties and design tokens in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **CSS custom properties and design tokens**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q21: How would you explain css custom properties and design tokens in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **CSS custom properties and design tokens**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 8: Nesting, :is, :where, and selector ergonomics

### 🟢 [Junior] Q22: How would you explain nesting, :is, :where, and selector ergonomics in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Nesting, :is, :where, and selector ergonomics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q23: How would you explain nesting, :is, :where, and selector ergonomics in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Nesting, :is, :where, and selector ergonomics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q24: How would you explain nesting, :is, :where, and selector ergonomics in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Nesting, :is, :where, and selector ergonomics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 9: Architecture patterns (BEM, ITCSS, CUBE)

### 🟢 [Junior] Q25: How would you explain architecture patterns (bem, itcss, cube) in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Architecture patterns (BEM, ITCSS, CUBE)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q26: How would you explain architecture patterns (bem, itcss, cube) in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Architecture patterns (BEM, ITCSS, CUBE)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q27: How would you explain architecture patterns (bem, itcss, cube) in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Architecture patterns (BEM, ITCSS, CUBE)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 10: CSS Modules and local scoping

### 🟢 [Junior] Q28: How would you explain css modules and local scoping in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **CSS Modules and local scoping**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q29: How would you explain css modules and local scoping in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **CSS Modules and local scoping**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q30: How would you explain css modules and local scoping in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **CSS Modules and local scoping**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 11: Theming and dark mode strategy

### 🟢 [Junior] Q31: How would you explain theming and dark mode strategy in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Theming and dark mode strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q32: How would you explain theming and dark mode strategy in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Theming and dark mode strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q33: How would you explain theming and dark mode strategy in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Theming and dark mode strategy**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 12: Critical CSS extraction and loading

### 🟢 [Junior] Q34: How would you explain critical css extraction and loading in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Critical CSS extraction and loading**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q35: How would you explain critical css extraction and loading in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Critical CSS extraction and loading**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q36: How would you explain critical css extraction and loading in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Critical CSS extraction and loading**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```css
.component {
  container-type: inline-size;
  --space-2: 0.5rem;
  padding: var(--space-2);
}
@container (min-width: 32rem) {
  .component { display: grid; grid-template-columns: 1fr 2fr; }
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)
