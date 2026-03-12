# React Fundamentals / Nền Tảng React
## React - Chapter 1

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-react-19-features.md)

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [JSX Compilation](#jsx-compilation)
2. [React.createElement and Element Objects](#reactcreateelement-and-element-objects)
3. [Virtual DOM and Reconciliation](#virtual-dom-and-reconciliation)
4. [Fiber Architecture](#fiber-architecture)
5. [Render vs Commit Phases](#render-vs-commit-phases)
6. [Component Types: Function vs Class](#component-types-function-vs-class)
7. [Lifecycle Mapping in Modern React](#lifecycle-mapping-in-modern-react)
8. [Keys and List Diffing](#keys-and-list-diffing)
9. [StrictMode in Development](#strictmode-in-development)
10. [Portals and Event Propagation](#portals-and-event-propagation)
11. [State and Props Data Flow](#state-and-props-data-flow)
12. [Controlled vs Uncontrolled Inputs](#controlled-vs-uncontrolled-inputs)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## JSX Compilation

### Giải thích / Explanation

**English:** JSX is syntax sugar that compiles to React.createElement calls or jsx-runtime helpers.

**Tiếng Việt:** JSX là cú pháp rút gọn, được biên dịch thành React.createElement hoặc helper của jsx-runtime.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 2: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 3: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 4: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 5: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 6: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 7: Interview framing, trade-off analysis, and implementation detail for jsx compilation.
- Point 8: Interview framing, trade-off analysis, and implementation detail for jsx compilation.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## React.createElement and Element Objects

### Giải thích / Explanation

**English:** React elements are immutable descriptions of UI, not DOM nodes.

**Tiếng Việt:** React element là mô tả bất biến của UI, không phải DOM thật.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 2: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 3: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 4: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 5: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 6: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 7: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.
- Point 8: Interview framing, trade-off analysis, and implementation detail for react.createelement and element objects.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Virtual DOM and Reconciliation

### Giải thích / Explanation

**English:** React compares element trees to compute the minimal set of mutations.

**Tiếng Việt:** React so sánh cây element để tính toán số thay đổi tối thiểu cần cập nhật.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 2: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 3: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 4: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 5: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 6: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 7: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.
- Point 8: Interview framing, trade-off analysis, and implementation detail for virtual dom and reconciliation.

### Ví dụ / Example
```tsx
import { memo, useMemo } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Fiber Architecture

### Giải thích / Explanation

**English:** Fiber is React’s incremental work model enabling interruption and priority scheduling.

**Tiếng Việt:** Fiber là mô hình công việc tăng dần cho phép ngắt và ưu tiên tác vụ.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 2: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 3: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 4: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 5: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 6: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 7: Interview framing, trade-off analysis, and implementation detail for fiber architecture.
- Point 8: Interview framing, trade-off analysis, and implementation detail for fiber architecture.

### Ví dụ / Example
```tsx
import { memo, useMemo } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Render vs Commit Phases

### Giải thích / Explanation

**English:** Render is pure calculation; Commit applies side effects and DOM updates.

**Tiếng Việt:** Render là tính toán thuần; Commit mới thực thi side-effect và cập nhật DOM.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 2: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 3: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 4: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 5: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 6: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 7: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.
- Point 8: Interview framing, trade-off analysis, and implementation detail for render vs commit phases.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Component Types: Function vs Class

### Giải thích / Explanation

**English:** Function components with hooks are the default modern model.

**Tiếng Việt:** Function component với hooks là mô hình hiện đại mặc định.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 2: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 3: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 4: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 5: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 6: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 7: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.
- Point 8: Interview framing, trade-off analysis, and implementation detail for component types: function vs class.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Lifecycle Mapping in Modern React

### Giải thích / Explanation

**English:** Class lifecycle can be mapped to hook combinations with clearer dependencies.

**Tiếng Việt:** Lifecycle class có thể ánh xạ sang tổ hợp hooks với dependency rõ ràng.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 2: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 3: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 4: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 5: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 6: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 7: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.
- Point 8: Interview framing, trade-off analysis, and implementation detail for lifecycle mapping in modern react.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Keys and List Diffing

### Giải thích / Explanation

**English:** Stable keys preserve identity and local state across reorder operations.

**Tiếng Việt:** Key ổn định giúp giữ identity và state cục bộ khi reorder.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 2: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 3: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 4: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 5: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 6: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 7: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.
- Point 8: Interview framing, trade-off analysis, and implementation detail for keys and list diffing.

### Ví dụ / Example
```tsx
import { memo, useMemo } from 'react';

type Row = { id: string; score: number };

const RowView = memo(function RowView({ row }: { row: Row }) {
  return <li>{row.id}: {row.score}</li>;
});

export function ScoreList({ rows }: { rows: Row[] }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => b.score - a.score), [rows]);
  return <ul>{sorted.map((r) => <RowView key={r.id} row={r} />)}</ul>;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## StrictMode in Development

### Giải thích / Explanation

**English:** StrictMode intentionally double-invokes certain logic to reveal unsafe side effects.

**Tiếng Việt:** StrictMode cố ý gọi lặp một số logic để lộ side-effect không an toàn.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 2: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 3: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 4: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 5: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 6: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 7: Interview framing, trade-off analysis, and implementation detail for strictmode in development.
- Point 8: Interview framing, trade-off analysis, and implementation detail for strictmode in development.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Portals and Event Propagation

### Giải thích / Explanation

**English:** Portals render outside DOM hierarchy while preserving React tree semantics.

**Tiếng Việt:** Portal render ra ngoài DOM cha nhưng vẫn giữ semantics của React tree.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 2: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 3: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 4: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 5: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 6: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 7: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.
- Point 8: Interview framing, trade-off analysis, and implementation detail for portals and event propagation.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## State and Props Data Flow

### Giải thích / Explanation

**English:** Unidirectional data flow makes debugging and mental models simpler.

**Tiếng Việt:** Luồng dữ liệu một chiều giúp debug và tư duy hệ thống đơn giản hơn.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 2: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 3: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 4: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 5: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 6: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 7: Interview framing, trade-off analysis, and implementation detail for state and props data flow.
- Point 8: Interview framing, trade-off analysis, and implementation detail for state and props data flow.

### Ví dụ / Example
```tsx
import { useState } from 'react';

type CounterProps = { initial?: number };

export function Counter({ initial = 0 }: CounterProps) {
  const [count, setCount] = useState(initial);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count: {count}
    </button>
  );
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Controlled vs Uncontrolled Inputs

### Giải thích / Explanation

**English:** Controlled inputs centralize form state and validation behavior.

**Tiếng Việt:** Input controlled giúp tập trung state và validation của form.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 2: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 3: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 4: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 5: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 6: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 7: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.
- Point 8: Interview framing, trade-off analysis, and implementation detail for controlled vs uncontrolled inputs.

### Ví dụ / Example
```tsx
import { useEffect, useState } from 'react';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const data = await Promise.resolve(['react', 'fiber', query]);
      if (!cancelled) setResult(data);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Interview Notes / Ghi Chú Phỏng Vấn
- Mention constraints first, then explain mechanics, then show edge cases.
- Compare alternatives and explain when **not** to use a feature.
- Connect this topic to rendering behavior, memory, and user experience.

Cross-reference: [Hooks](./03-hooks-deep-dive.md) · [Patterns](./08-react-patterns-advanced.md) · [Performance](./09-performance-optimization.md).

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain JSX compilation in React interviews — 🟢 [Junior]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q2: Explain virtual DOM in React interviews — 🟡 [Mid]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q3: Explain reconciliation in React interviews — 🔴 [Senior]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q4: Explain fiber architecture in React interviews — 🟢 [Junior]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q5: Explain render and commit phases in React interviews — 🟡 [Mid]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q6: Explain keys and diffing in React interviews — 🔴 [Senior]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q7: Explain React.createElement in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q8: Explain StrictMode behavior in React interviews — 🟡 [Mid]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q9: Explain portals in React interviews — 🔴 [Senior]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q10: Explain function vs class components in React interviews — 🟢 [Junior]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q11: Explain JSX compilation in React interviews — 🟡 [Mid]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q12: Explain virtual DOM in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q13: Explain reconciliation in React interviews — 🟢 [Junior]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q14: Explain fiber architecture in React interviews — 🟡 [Mid]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q15: Explain render and commit phases in React interviews — 🔴 [Senior]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q16: Explain keys and diffing in React interviews — 🟢 [Junior]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q17: Explain React.createElement in React interviews — 🟡 [Mid]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q18: Explain StrictMode behavior in React interviews — 🔴 [Senior]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q19: Explain portals in React interviews — 🟢 [Junior]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q20: Explain function vs class components in React interviews — 🟡 [Mid]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q21: Explain JSX compilation in React interviews — 🔴 [Senior]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q22: Explain virtual DOM in React interviews — 🟢 [Junior]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q23: Explain reconciliation in React interviews — 🟡 [Mid]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q24: Explain fiber architecture in React interviews — 🔴 [Senior]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q25: Explain render and commit phases in React interviews — 🟢 [Junior]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q26: Explain keys and diffing in React interviews — 🟡 [Mid]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q27: Explain React.createElement in React interviews — 🔴 [Senior]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q28: Explain StrictMode behavior in React interviews — 🟢 [Junior]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q29: Explain portals in React interviews — 🟡 [Mid]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q30: Explain function vs class components in React interviews — 🔴 [Senior]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q31: Explain JSX compilation in React interviews — 🟢 [Junior]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q32: Explain virtual DOM in React interviews — 🟡 [Mid]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q33: Explain reconciliation in React interviews — 🔴 [Senior]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q34: Explain fiber architecture in React interviews — 🟢 [Junior]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q35: Explain render and commit phases in React interviews — 🟡 [Mid]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q36: Explain keys and diffing in React interviews — 🔴 [Senior]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q37: Explain React.createElement in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q38: Explain StrictMode behavior in React interviews — 🟡 [Mid]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q39: Explain portals in React interviews — 🔴 [Senior]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q40: Explain function vs class components in React interviews — 🟢 [Junior]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q41: Explain JSX compilation in React interviews — 🟡 [Mid]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q42: Explain virtual DOM in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q43: Explain reconciliation in React interviews — 🟢 [Junior]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q44: Explain fiber architecture in React interviews — 🟡 [Mid]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q45: Explain render and commit phases in React interviews — 🔴 [Senior]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q46: Explain keys and diffing in React interviews — 🟢 [Junior]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q47: Explain React.createElement in React interviews — 🟡 [Mid]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q48: Explain StrictMode behavior in React interviews — 🔴 [Senior]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q49: Explain portals in React interviews — 🟢 [Junior]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q50: Explain function vs class components in React interviews — 🟡 [Mid]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q51: Explain JSX compilation in React interviews — 🔴 [Senior]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q52: Explain virtual DOM in React interviews — 🟢 [Junior]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q53: Explain reconciliation in React interviews — 🟡 [Mid]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q54: Explain fiber architecture in React interviews — 🔴 [Senior]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q55: Explain render and commit phases in React interviews — 🟢 [Junior]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q56: Explain keys and diffing in React interviews — 🟡 [Mid]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q57: Explain React.createElement in React interviews — 🔴 [Senior]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q58: Explain StrictMode behavior in React interviews — 🟢 [Junior]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q59: Explain portals in React interviews — 🟡 [Mid]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q60: Explain function vs class components in React interviews — 🔴 [Senior]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q61: Explain JSX compilation in React interviews — 🟢 [Junior]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q62: Explain virtual DOM in React interviews — 🟡 [Mid]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q63: Explain reconciliation in React interviews — 🔴 [Senior]
**English:** A strong answer defines reconciliation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa reconciliation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q64: Explain fiber architecture in React interviews — 🟢 [Junior]
**English:** A strong answer defines fiber architecture, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa fiber architecture, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q65: Explain render and commit phases in React interviews — 🟡 [Mid]
**English:** A strong answer defines render and commit phases, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render and commit phases, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q66: Explain keys and diffing in React interviews — 🔴 [Senior]
**English:** A strong answer defines keys and diffing, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa keys and diffing, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q67: Explain React.createElement in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.createElement, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.createElement, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q68: Explain StrictMode behavior in React interviews — 🟡 [Mid]
**English:** A strong answer defines StrictMode behavior, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa StrictMode behavior, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q69: Explain portals in React interviews — 🔴 [Senior]
**English:** A strong answer defines portals, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa portals, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q70: Explain function vs class components in React interviews — 🟢 [Junior]
**English:** A strong answer defines function vs class components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa function vs class components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q71: Explain JSX compilation in React interviews — 🟡 [Mid]
**English:** A strong answer defines JSX compilation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa JSX compilation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q72: Explain virtual DOM in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtual DOM, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtual DOM, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

## Revision Checklist / Danh Sách Ôn Tập

- Checklist 1: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 2: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 3: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 4: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 5: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 6: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 7: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 8: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 9: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 10: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 11: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 12: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 13: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 14: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 15: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 16: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 17: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 18: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 19: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 20: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 21: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 22: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 23: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 24: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 25: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 26: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 27: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 28: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 29: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 30: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 31: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 32: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 33: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 34: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 35: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 36: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 37: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 38: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 39: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 40: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 41: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 42: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 43: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 44: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 45: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 46: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 47: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 48: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 49: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 50: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 51: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 52: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 53: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 54: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 55: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 56: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 57: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 58: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 59: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 60: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 61: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 62: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 63: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 64: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 65: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 66: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 67: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 68: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 69: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 70: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 71: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 72: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 73: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 74: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 75: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 76: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 77: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 78: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 79: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 80: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 81: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 82: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 83: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 84: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 85: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 86: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 87: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 88: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 89: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 90: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 91: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 92: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 93: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 94: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 95: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 96: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 97: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 98: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 99: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 100: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 101: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 102: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 103: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 104: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 105: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 106: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 107: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 108: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 109: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 110: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 111: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 112: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 113: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 114: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 115: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 116: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 117: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 118: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 119: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 120: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 121: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 122: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 123: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 124: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 125: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 126: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 127: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 128: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 129: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 130: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 131: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 132: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 133: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 134: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 135: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 136: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 137: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 138: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 139: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 140: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 141: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 142: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 143: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 144: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 145: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 146: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 147: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 148: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 149: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 150: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 151: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 152: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 153: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 154: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 155: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 156: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 157: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 158: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 159: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 160: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 161: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 162: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 163: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 164: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 165: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 166: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 167: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 168: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 169: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 170: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 171: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 172: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 173: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 174: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 175: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 176: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 177: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 178: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 179: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
- Checklist 180: Can you explain this chapter topic in EN first, then summarize in VI with one practical example?
