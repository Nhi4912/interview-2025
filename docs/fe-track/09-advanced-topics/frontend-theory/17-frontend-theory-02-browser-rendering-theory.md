# Frontend Theory 02: Browser Rendering Theory

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Lý thuyết rendering của trình duyệt và hiệu suất hiển thị. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Critical rendering path stages

### 🟢 [Junior] Q1: How would you explain critical rendering path stages in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Critical rendering path stages**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q2: How would you explain critical rendering path stages in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Critical rendering path stages**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q3: How would you explain critical rendering path stages in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Critical rendering path stages**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 2: HTML parsing and DOM construction

### 🟢 [Junior] Q4: How would you explain html parsing and dom construction in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **HTML parsing and DOM construction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q5: How would you explain html parsing and dom construction in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **HTML parsing and DOM construction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q6: How would you explain html parsing and dom construction in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **HTML parsing and DOM construction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 3: CSS parsing and CSSOM generation

### 🟢 [Junior] Q7: How would you explain css parsing and cssom generation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **CSS parsing and CSSOM generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q8: How would you explain css parsing and cssom generation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **CSS parsing and CSSOM generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q9: How would you explain css parsing and cssom generation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **CSS parsing and CSSOM generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 4: Render tree construction rules

### 🟢 [Junior] Q10: How would you explain render tree construction rules in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Render tree construction rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q11: How would you explain render tree construction rules in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Render tree construction rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q12: How would you explain render tree construction rules in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Render tree construction rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 5: Layout calculation and box geometry

### 🟢 [Junior] Q13: How would you explain layout calculation and box geometry in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Layout calculation and box geometry**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q14: How would you explain layout calculation and box geometry in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Layout calculation and box geometry**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q15: How would you explain layout calculation and box geometry in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Layout calculation and box geometry**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 6: Paint phases and draw commands

### 🟢 [Junior] Q16: How would you explain paint phases and draw commands in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Paint phases and draw commands**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q17: How would you explain paint phases and draw commands in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Paint phases and draw commands**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q18: How would you explain paint phases and draw commands in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Paint phases and draw commands**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 7: Compositing and layer promotion

### 🟢 [Junior] Q19: How would you explain compositing and layer promotion in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Compositing and layer promotion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q20: How would you explain compositing and layer promotion in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Compositing and layer promotion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q21: How would you explain compositing and layer promotion in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Compositing and layer promotion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 8: Reflow triggers and invalidation

### 🟢 [Junior] Q22: How would you explain reflow triggers and invalidation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Reflow triggers and invalidation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q23: How would you explain reflow triggers and invalidation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Reflow triggers and invalidation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q24: How would you explain reflow triggers and invalidation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Reflow triggers and invalidation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 9: Repaint boundaries and damage tracking

### 🟢 [Junior] Q25: How would you explain repaint boundaries and damage tracking in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Repaint boundaries and damage tracking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q26: How would you explain repaint boundaries and damage tracking in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Repaint boundaries and damage tracking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q27: How would you explain repaint boundaries and damage tracking in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Repaint boundaries and damage tracking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 10: Animation frame scheduling

### 🟢 [Junior] Q28: How would you explain animation frame scheduling in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Animation frame scheduling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q29: How would you explain animation frame scheduling in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Animation frame scheduling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q30: How would you explain animation frame scheduling in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Animation frame scheduling**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 11: Containment and isolation strategies

### 🟢 [Junior] Q31: How would you explain containment and isolation strategies in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Containment and isolation strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q32: How would you explain containment and isolation strategies in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Containment and isolation strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q33: How would you explain containment and isolation strategies in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Containment and isolation strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)

## Topic 12: RAIL model in rendering

### 🟢 [Junior] Q34: How would you explain rail model in rendering in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **RAIL model in rendering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🟡 [Mid] Q35: How would you explain rail model in rendering in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **RAIL model in rendering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q36: How would you explain rail model in rendering in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **RAIL model in rendering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```html
<link rel="preload" href="/critical.css" as="style" />
<style>
  .hero { content-visibility: auto; contain-intrinsic-size: 800px 400px; }
</style>
```

**Cross-reference:** [17-frontend-theory-07-modern-css-architecture.md](./17-frontend-theory-07-modern-css-architecture.md)
