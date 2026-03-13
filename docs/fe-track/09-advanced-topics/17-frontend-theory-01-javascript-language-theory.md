# Frontend Theory 01: JavaScript Language Theory


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Lý thuyết ngôn ngữ JavaScript cho phỏng vấn Frontend. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Operational semantics and evaluation order

### 🟢 [Junior] Q1: How would you explain operational semantics and evaluation order in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Operational semantics and evaluation order**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q2: How would you explain operational semantics and evaluation order in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Operational semantics and evaluation order**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q3: How would you explain operational semantics and evaluation order in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Operational semantics and evaluation order**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 2: Dynamic typing and coercion rules

### 🟢 [Junior] Q4: How would you explain dynamic typing and coercion rules in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Dynamic typing and coercion rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q5: How would you explain dynamic typing and coercion rules in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Dynamic typing and coercion rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q6: How would you explain dynamic typing and coercion rules in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Dynamic typing and coercion rules**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 3: Scope chain and lexical environment

### 🟢 [Junior] Q7: How would you explain scope chain and lexical environment in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Scope chain and lexical environment**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q8: How would you explain scope chain and lexical environment in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Scope chain and lexical environment**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q9: How would you explain scope chain and lexical environment in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Scope chain and lexical environment**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 4: Closures and encapsulation boundaries

### 🟢 [Junior] Q10: How would you explain closures and encapsulation boundaries in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Closures and encapsulation boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q11: How would you explain closures and encapsulation boundaries in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Closures and encapsulation boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q12: How would you explain closures and encapsulation boundaries in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Closures and encapsulation boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 5: Hoisting and temporal dead zone

### 🟢 [Junior] Q13: How would you explain hoisting and temporal dead zone in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Hoisting and temporal dead zone**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q14: How would you explain hoisting and temporal dead zone in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Hoisting and temporal dead zone**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q15: How would you explain hoisting and temporal dead zone in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Hoisting and temporal dead zone**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 6: Prototype chain and delegation

### 🟢 [Junior] Q16: How would you explain prototype chain and delegation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Prototype chain and delegation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q17: How would you explain prototype chain and delegation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Prototype chain and delegation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q18: How would you explain prototype chain and delegation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Prototype chain and delegation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 7: Object model and property descriptors

### 🟢 [Junior] Q19: How would you explain object model and property descriptors in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Object model and property descriptors**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q20: How would you explain object model and property descriptors in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Object model and property descriptors**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q21: How would you explain object model and property descriptors in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Object model and property descriptors**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 8: This binding model in JavaScript

### 🟢 [Junior] Q22: How would you explain this binding model in javascript in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **This binding model in JavaScript**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q23: How would you explain this binding model in javascript in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **This binding model in JavaScript**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q24: How would you explain this binding model in javascript in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **This binding model in JavaScript**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 9: Event loop and run-to-completion

### 🟢 [Junior] Q25: How would you explain event loop and run-to-completion in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Event loop and run-to-completion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q26: How would you explain event loop and run-to-completion in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Event loop and run-to-completion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q27: How would you explain event loop and run-to-completion in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Event loop and run-to-completion**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 10: Promises and microtask semantics

### 🟢 [Junior] Q28: How would you explain promises and microtask semantics in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Promises and microtask semantics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q29: How would you explain promises and microtask semantics in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Promises and microtask semantics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q30: How would you explain promises and microtask semantics in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Promises and microtask semantics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 11: Memory model and references

### 🟢 [Junior] Q31: How would you explain memory model and references in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Memory model and references**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q32: How would you explain memory model and references in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Memory model and references**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q33: How would you explain memory model and references in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Memory model and references**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 12: JIT assumptions and deoptimization

### 🟢 [Junior] Q34: How would you explain jit assumptions and deoptimization in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **JIT assumptions and deoptimization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-05-javascript-engine-internals.md](./17-frontend-theory-05-javascript-engine-internals.md)

### 🟡 [Mid] Q35: How would you explain jit assumptions and deoptimization in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **JIT assumptions and deoptimization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q36: How would you explain jit assumptions and deoptimization in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **JIT assumptions and deoptimization**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)
