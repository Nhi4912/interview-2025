# Frontend Theory 06: Web Performance Optimization


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Tối ưu hiệu suất web theo Core Web Vitals và runtime metrics. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Core Web Vitals baseline and thresholds

### 🟢 [Junior] Q1: How would you explain core web vitals baseline and thresholds in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Core Web Vitals baseline and thresholds**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q2: How would you explain core web vitals baseline and thresholds in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Core Web Vitals baseline and thresholds**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q3: How would you explain core web vitals baseline and thresholds in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Core Web Vitals baseline and thresholds**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 2: Largest Contentful Paint improvement tactics

### 🟢 [Junior] Q4: How would you explain largest contentful paint improvement tactics in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Largest Contentful Paint improvement tactics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q5: How would you explain largest contentful paint improvement tactics in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Largest Contentful Paint improvement tactics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q6: How would you explain largest contentful paint improvement tactics in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Largest Contentful Paint improvement tactics**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 3: Interaction to Next Paint root causes

### 🟢 [Junior] Q7: How would you explain interaction to next paint root causes in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Interaction to Next Paint root causes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q8: How would you explain interaction to next paint root causes in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Interaction to Next Paint root causes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q9: How would you explain interaction to next paint root causes in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Interaction to Next Paint root causes**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 4: Cumulative Layout Shift mitigation

### 🟢 [Junior] Q10: How would you explain cumulative layout shift mitigation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Cumulative Layout Shift mitigation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q11: How would you explain cumulative layout shift mitigation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Cumulative Layout Shift mitigation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q12: How would you explain cumulative layout shift mitigation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Cumulative Layout Shift mitigation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 5: RAIL model for product trade-offs

### 🟢 [Junior] Q13: How would you explain rail model for product trade-offs in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **RAIL model for product trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q14: How would you explain rail model for product trade-offs in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **RAIL model for product trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q15: How would you explain rail model for product trade-offs in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **RAIL model for product trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 6: Network waterfall analysis

### 🟢 [Junior] Q16: How would you explain network waterfall analysis in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Network waterfall analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q17: How would you explain network waterfall analysis in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Network waterfall analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q18: How would you explain network waterfall analysis in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Network waterfall analysis**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 7: Resource hints preload prefetch preconnect

### 🟢 [Junior] Q19: How would you explain resource hints preload prefetch preconnect in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Resource hints preload prefetch preconnect**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q20: How would you explain resource hints preload prefetch preconnect in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Resource hints preload prefetch preconnect**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q21: How would you explain resource hints preload prefetch preconnect in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Resource hints preload prefetch preconnect**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 8: Code splitting and route chunking

### 🟢 [Junior] Q22: How would you explain code splitting and route chunking in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Code splitting and route chunking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q23: How would you explain code splitting and route chunking in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Code splitting and route chunking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q24: How would you explain code splitting and route chunking in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Code splitting and route chunking**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 9: Critical CSS and render-blocking control

### 🟢 [Junior] Q25: How would you explain critical css and render-blocking control in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Critical CSS and render-blocking control**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q26: How would you explain critical css and render-blocking control in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Critical CSS and render-blocking control**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q27: How would you explain critical css and render-blocking control in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Critical CSS and render-blocking control**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 10: Image optimization and responsive delivery

### 🟢 [Junior] Q28: How would you explain image optimization and responsive delivery in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Image optimization and responsive delivery**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q29: How would you explain image optimization and responsive delivery in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Image optimization and responsive delivery**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q30: How would you explain image optimization and responsive delivery in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Image optimization and responsive delivery**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 11: Main-thread long tasks reduction

### 🟢 [Junior] Q31: How would you explain main-thread long tasks reduction in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Main-thread long tasks reduction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q32: How would you explain main-thread long tasks reduction in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Main-thread long tasks reduction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q33: How would you explain main-thread long tasks reduction in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Main-thread long tasks reduction**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

## Topic 12: Performance monitoring in production

### 🟢 [Junior] Q34: How would you explain performance monitoring in production in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Performance monitoring in production**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q35: How would you explain performance monitoring in production in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Performance monitoring in production**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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

**Cross-reference:** [17-frontend-theory-11-rendering-theory.md](./17-frontend-theory-11-rendering-theory.md)

### 🔴 [Senior] Q36: How would you explain performance monitoring in production in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Performance monitoring in production**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

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
