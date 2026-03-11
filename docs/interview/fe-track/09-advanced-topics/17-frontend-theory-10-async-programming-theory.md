# Frontend Theory 10: Async Programming Theory

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Lý thuyết bất đồng bộ: event loop, promises và orchestration. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Synchronous versus asynchronous execution

### 🟢 [Junior] Q1: How would you explain synchronous versus asynchronous execution in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Synchronous versus asynchronous execution**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q2: How would you explain synchronous versus asynchronous execution in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Synchronous versus asynchronous execution**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q3: How would you explain synchronous versus asynchronous execution in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Synchronous versus asynchronous execution**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 2: Blocking and non-blocking operations

### 🟢 [Junior] Q4: How would you explain blocking and non-blocking operations in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Blocking and non-blocking operations**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q5: How would you explain blocking and non-blocking operations in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Blocking and non-blocking operations**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q6: How would you explain blocking and non-blocking operations in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Blocking and non-blocking operations**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 3: Concurrency versus parallelism in JS runtime

### 🟢 [Junior] Q7: How would you explain concurrency versus parallelism in js runtime in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Concurrency versus parallelism in JS runtime**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q8: How would you explain concurrency versus parallelism in js runtime in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Concurrency versus parallelism in JS runtime**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q9: How would you explain concurrency versus parallelism in js runtime in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Concurrency versus parallelism in JS runtime**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 4: Event loop phases and fairness

### 🟢 [Junior] Q10: How would you explain event loop phases and fairness in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Event loop phases and fairness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q11: How would you explain event loop phases and fairness in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Event loop phases and fairness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q12: How would you explain event loop phases and fairness in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Event loop phases and fairness**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 5: Macrotask and microtask ordering

### 🟢 [Junior] Q13: How would you explain macrotask and microtask ordering in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Macrotask and microtask ordering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q14: How would you explain macrotask and microtask ordering in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Macrotask and microtask ordering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q15: How would you explain macrotask and microtask ordering in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Macrotask and microtask ordering**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 6: Callback continuation-passing style

### 🟢 [Junior] Q16: How would you explain callback continuation-passing style in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Callback continuation-passing style**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q17: How would you explain callback continuation-passing style in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Callback continuation-passing style**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q18: How would you explain callback continuation-passing style in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Callback continuation-passing style**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 7: Promise states and resolution procedure

### 🟢 [Junior] Q19: How would you explain promise states and resolution procedure in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Promise states and resolution procedure**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q20: How would you explain promise states and resolution procedure in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Promise states and resolution procedure**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q21: How would you explain promise states and resolution procedure in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Promise states and resolution procedure**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 8: Async await semantics and traps

### 🟢 [Junior] Q22: How would you explain async await semantics and traps in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Async await semantics and traps**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q23: How would you explain async await semantics and traps in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Async await semantics and traps**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q24: How would you explain async await semantics and traps in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Async await semantics and traps**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 9: Error propagation across async boundaries

### 🟢 [Junior] Q25: How would you explain error propagation across async boundaries in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Error propagation across async boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q26: How would you explain error propagation across async boundaries in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Error propagation across async boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q27: How would you explain error propagation across async boundaries in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Error propagation across async boundaries**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 10: Cancellation with AbortController

### 🟢 [Junior] Q28: How would you explain cancellation with abortcontroller in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Cancellation with AbortController**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q29: How would you explain cancellation with abortcontroller in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Cancellation with AbortController**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q30: How would you explain cancellation with abortcontroller in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Cancellation with AbortController**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 11: Retry and backoff strategies

### 🟢 [Junior] Q31: How would you explain retry and backoff strategies in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Retry and backoff strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q32: How would you explain retry and backoff strategies in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Retry and backoff strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q33: How would you explain retry and backoff strategies in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Retry and backoff strategies**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 12: Web workers and off-main-thread compute

### 🟢 [Junior] Q34: How would you explain web workers and off-main-thread compute in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Web workers and off-main-thread compute**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🟡 [Mid] Q35: How would you explain web workers and off-main-thread compute in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Web workers and off-main-thread compute**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

### 🔴 [Senior] Q36: How would you explain web workers and off-main-thread compute in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Web workers and off-main-thread compute**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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
