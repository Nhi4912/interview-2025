# Frontend Theory 05: JavaScript Engine Internals

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Bên trong JavaScript engine: parser, JIT, GC và event loop. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Engine architecture and execution pipeline

### 🟢 [Junior] Q1: How would you explain engine architecture and execution pipeline in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Engine architecture and execution pipeline**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q2: How would you explain engine architecture and execution pipeline in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Engine architecture and execution pipeline**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q3: How would you explain engine architecture and execution pipeline in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Engine architecture and execution pipeline**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 2: Parser, AST, and bytecode generation

### 🟢 [Junior] Q4: How would you explain parser, ast, and bytecode generation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Parser, AST, and bytecode generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q5: How would you explain parser, ast, and bytecode generation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Parser, AST, and bytecode generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q6: How would you explain parser, ast, and bytecode generation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Parser, AST, and bytecode generation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 3: Interpreter versus optimizing compiler

### 🟢 [Junior] Q7: How would you explain interpreter versus optimizing compiler in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Interpreter versus optimizing compiler**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q8: How would you explain interpreter versus optimizing compiler in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Interpreter versus optimizing compiler**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q9: How would you explain interpreter versus optimizing compiler in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Interpreter versus optimizing compiler**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 4: Inline caching and hidden classes

### 🟢 [Junior] Q10: How would you explain inline caching and hidden classes in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Inline caching and hidden classes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q11: How would you explain inline caching and hidden classes in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Inline caching and hidden classes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q12: How would you explain inline caching and hidden classes in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Inline caching and hidden classes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 5: Shape transitions and object stability

### 🟢 [Junior] Q13: How would you explain shape transitions and object stability in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Shape transitions and object stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q14: How would you explain shape transitions and object stability in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Shape transitions and object stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q15: How would you explain shape transitions and object stability in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Shape transitions and object stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 6: Speculation and bailout mechanics

### 🟢 [Junior] Q16: How would you explain speculation and bailout mechanics in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Speculation and bailout mechanics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q17: How would you explain speculation and bailout mechanics in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Speculation and bailout mechanics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q18: How would you explain speculation and bailout mechanics in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Speculation and bailout mechanics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 7: Deoptimization causes and costs

### 🟢 [Junior] Q19: How would you explain deoptimization causes and costs in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Deoptimization causes and costs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q20: How would you explain deoptimization causes and costs in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Deoptimization causes and costs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q21: How would you explain deoptimization causes and costs in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Deoptimization causes and costs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 8: Call stack and execution contexts

### 🟢 [Junior] Q22: How would you explain call stack and execution contexts in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Call stack and execution contexts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q23: How would you explain call stack and execution contexts in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Call stack and execution contexts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q24: How would you explain call stack and execution contexts in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Call stack and execution contexts**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 9: Task queue and microtask queue internals

### 🟢 [Junior] Q25: How would you explain task queue and microtask queue internals in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Task queue and microtask queue internals**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
const controller = new AbortController();
const task = fetch('/api/data', { signal: controller.signal })
  .then((r) => r.json())
  .finally(() => console.log('done'));

queueMicrotask(() => console.log('microtask after current turn'));
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q26: How would you explain task queue and microtask queue internals in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Task queue and microtask queue internals**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
const controller = new AbortController();
const task = fetch('/api/data', { signal: controller.signal })
  .then((r) => r.json())
  .finally(() => console.log('done'));

queueMicrotask(() => console.log('microtask after current turn'));
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q27: How would you explain task queue and microtask queue internals in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Task queue and microtask queue internals**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
const controller = new AbortController();
const task = fetch('/api/data', { signal: controller.signal })
  .then((r) => r.json())
  .finally(() => console.log('done'));

queueMicrotask(() => console.log('microtask after current turn'));
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 10: Heap segmentation (young and old gen)

### 🟢 [Junior] Q28: How would you explain heap segmentation (young and old gen) in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Heap segmentation (young and old gen)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q29: How would you explain heap segmentation (young and old gen) in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Heap segmentation (young and old gen)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q30: How would you explain heap segmentation (young and old gen) in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Heap segmentation (young and old gen)**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 11: Minor and major garbage collection

### 🟢 [Junior] Q31: How would you explain minor and major garbage collection in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Minor and major garbage collection**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q32: How would you explain minor and major garbage collection in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Minor and major garbage collection**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q33: How would you explain minor and major garbage collection in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Minor and major garbage collection**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

## Topic 12: Profiling with flame charts and snapshots

### 🟢 [Junior] Q34: How would you explain profiling with flame charts and snapshots in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Profiling with flame charts and snapshots**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-01-javascript-language-theory.md](./17-frontend-theory-01-javascript-language-theory.md)

### 🟡 [Mid] Q35: How would you explain profiling with flame charts and snapshots in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Profiling with flame charts and snapshots**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-10-async-programming-theory.md](./17-frontend-theory-10-async-programming-theory.md)

### 🔴 [Senior] Q36: How would you explain profiling with flame charts and snapshots in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Profiling with flame charts and snapshots**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```javascript
function explain(topic, value) {
  const normalized = typeof value === 'string' ? value.trim() : value;
  return { topic, normalized, timestamp: Date.now() };
}
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)
