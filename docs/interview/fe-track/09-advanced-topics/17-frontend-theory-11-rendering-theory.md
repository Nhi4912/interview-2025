# Frontend Theory 11: Rendering Theory

**Tổng Quan:** Tài liệu song ngữ (EN heading + VI explanation) cho phần lý thuyết Frontend nâng cao, dùng trực tiếp để luyện interview.
**Giải thích:** Lý thuyết rendering từ browser pipeline đến React rendering model. Mỗi câu hỏi đi từ nền tảng đến quyết định kiến trúc và chiến lược tối ưu.
**Ví dụ:** Có snippet ngắn để nối giữa lý thuyết và cách triển khai thực tế trong dự án.

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Interview Usage Guide
- `🟢 [Junior]`: định nghĩa đúng và nắm cơ chế cơ bản.
- `🟡 [Mid]`: phân tích trade-off và tác động implementation.
- `🔴 [Senior]`: đưa ra quyết định kỹ thuật có điều kiện và plan giảm rủi ro.

## Topic 1: Critical rendering path in browsers

### 🟢 [Junior] Q1: How would you explain critical rendering path in browsers in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Critical rendering path in browsers**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q2: How would you explain critical rendering path in browsers in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Critical rendering path in browsers**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q3: How would you explain critical rendering path in browsers in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Critical rendering path in browsers**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 2: DOM and CSSOM to render tree flow

### 🟢 [Junior] Q4: How would you explain dom and cssom to render tree flow in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **DOM and CSSOM to render tree flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q5: How would you explain dom and cssom to render tree flow in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **DOM and CSSOM to render tree flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q6: How would you explain dom and cssom to render tree flow in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **DOM and CSSOM to render tree flow**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 3: Layout, paint, and composite separation

### 🟢 [Junior] Q7: How would you explain layout, paint, and composite separation in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Layout, paint, and composite separation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q8: How would you explain layout, paint, and composite separation in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Layout, paint, and composite separation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q9: How would you explain layout, paint, and composite separation in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Layout, paint, and composite separation**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 4: Reconciliation and virtual DOM diffing

### 🟢 [Junior] Q10: How would you explain reconciliation and virtual dom diffing in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Reconciliation and virtual DOM diffing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q11: How would you explain reconciliation and virtual dom diffing in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Reconciliation and virtual DOM diffing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q12: How would you explain reconciliation and virtual dom diffing in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Reconciliation and virtual DOM diffing**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 5: React Fiber scheduling model

### 🟢 [Junior] Q13: How would you explain react fiber scheduling model in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **React Fiber scheduling model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q14: How would you explain react fiber scheduling model in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **React Fiber scheduling model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q15: How would you explain react fiber scheduling model in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **React Fiber scheduling model**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 6: Render phase versus commit phase

### 🟢 [Junior] Q16: How would you explain render phase versus commit phase in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Render phase versus commit phase**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q17: How would you explain render phase versus commit phase in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Render phase versus commit phase**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q18: How would you explain render phase versus commit phase in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Render phase versus commit phase**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 7: Concurrent rendering and interruptions

### 🟢 [Junior] Q19: How would you explain concurrent rendering and interruptions in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Concurrent rendering and interruptions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q20: How would you explain concurrent rendering and interruptions in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Concurrent rendering and interruptions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q21: How would you explain concurrent rendering and interruptions in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Concurrent rendering and interruptions**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 8: Hydration and partial hydration ideas

### 🟢 [Junior] Q22: How would you explain hydration and partial hydration ideas in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Hydration and partial hydration ideas**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q23: How would you explain hydration and partial hydration ideas in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Hydration and partial hydration ideas**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q24: How would you explain hydration and partial hydration ideas in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Hydration and partial hydration ideas**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 9: SSR, SSG, and ISR trade-offs

### 🟢 [Junior] Q25: How would you explain ssr, ssg, and isr trade-offs in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **SSR, SSG, and ISR trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q26: How would you explain ssr, ssg, and isr trade-offs in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **SSR, SSG, and ISR trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q27: How would you explain ssr, ssg, and isr trade-offs in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **SSR, SSG, and ISR trade-offs**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 10: Streaming SSR and progressive reveal

### 🟢 [Junior] Q28: How would you explain streaming ssr and progressive reveal in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Streaming SSR and progressive reveal**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q29: How would you explain streaming ssr and progressive reveal in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Streaming SSR and progressive reveal**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q30: How would you explain streaming ssr and progressive reveal in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Streaming SSR and progressive reveal**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 11: Memoization and referential stability

### 🟢 [Junior] Q31: How would you explain memoization and referential stability in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Memoization and referential stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q32: How would you explain memoization and referential stability in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Memoization and referential stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q33: How would you explain memoization and referential stability in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Memoization and referential stability**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)

## Topic 12: Profiling rendering bottlenecks

### 🟢 [Junior] Q34: How would you explain profiling rendering bottlenecks in a real interview?

**Tổng Quan (Overview):** Explain core concept and baseline interview expectation.

**Giải thích (Explanation):** Với **Profiling rendering bottlenecks**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-02-browser-rendering-theory.md](./17-frontend-theory-02-browser-rendering-theory.md)

### 🟡 [Mid] Q35: How would you explain profiling rendering bottlenecks in a real interview?

**Tổng Quan (Overview):** Connect concept to trade-off and implementation detail.

**Giải thích (Explanation):** Với **Profiling rendering bottlenecks**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-06-web-performance-optimization.md](./17-frontend-theory-06-web-performance-optimization.md)

### 🔴 [Senior] Q36: How would you explain profiling rendering bottlenecks in a real interview?

**Tổng Quan (Overview):** Reason about architecture, failure mode, and optimization impact.

**Giải thích (Explanation):** Với **Profiling rendering bottlenecks**, câu trả lời nên gồm: (1) định nghĩa ngắn gọn bằng English keyword, (2) giải thích cơ chế bằng tiếng Việt theo runtime/browser/framework, (3) kết luận bằng tiêu chí đo lường để quyết định có áp dụng hay không. Điều này giúp interviewer thấy bạn không chỉ thuộc lý thuyết mà còn biết vận dụng trong bối cảnh dự án thật.

**Key points to say:**
- Explain concept boundary, not just buzzwords.
- Nêu một failure mode phổ biến và cách phát hiện sớm.
- Chốt bằng một trade-off có điều kiện if/then.

**Ví dụ (Example):**
```tsx
const ProductList = React.memo(function ProductList({ items }: { items: Product[] }) {
  return <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
});

const visibleItems = useMemo(() => selectVisible(items, filter), [items, filter]);
```

**Cross-reference:** [17-frontend-theory-09-state-management-theory.md](./17-frontend-theory-09-state-management-theory.md)
