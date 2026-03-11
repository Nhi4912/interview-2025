# Performance Optimization / Tối Ưu Hiệu Năng
## React - Chapter 9

[← Previous](./08-react-patterns-advanced.md) | [Back to Table of Contents](../00-table-of-contents.md) | [Next →](./10-modern-react-features.md)

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [Performance Mental Model](#performance-mental-model)
2. [React.memo Correct Usage](#reactmemo-correct-usage)
3. [useMemo and useCallback Strategy](#usememo-and-usecallback-strategy)
4. [Avoiding Unnecessary Re-renders](#avoiding-unnecessary-re-renders)
5. [Code Splitting with lazy and Suspense](#code-splitting-with-lazy-and-suspense)
6. [List Virtualization](#list-virtualization)
7. [Bundle Analysis Workflow](#bundle-analysis-workflow)
8. [Profiler API and DevTools](#profiler-api-and-devtools)
9. [why-did-you-render](#why-did-you-render)
10. [Concurrent Rendering Benefits](#concurrent-rendering-benefits)
11. [Server Components for Performance](#server-components-for-performance)
12. [Image and Asset Optimization](#image-and-asset-optimization)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## Performance Mental Model

### Giải thích / Explanation

**English:** Measure first, optimize bottlenecks, and validate user-perceived wins.

**Tiếng Việt:** Đo đạc trước, tối ưu nút nghẽn, và xác minh cải thiện người dùng cảm nhận được.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 2: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 3: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 4: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 5: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 6: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 7: Interview framing, trade-off analysis, and implementation detail for performance mental model.
- Point 8: Interview framing, trade-off analysis, and implementation detail for performance mental model.

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

## React.memo Correct Usage

### Giải thích / Explanation

**English:** Memo works only when props are stable and render cost is meaningful.

**Tiếng Việt:** Memo chỉ hiệu quả khi props ổn định và chi phí render đủ lớn.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 2: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 3: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 4: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 5: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 6: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 7: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.
- Point 8: Interview framing, trade-off analysis, and implementation detail for react.memo correct usage.

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

## useMemo and useCallback Strategy

### Giải thích / Explanation

**English:** Prefer simple code first; memoize only after evidence.

**Tiếng Việt:** Ưu tiên code đơn giản trước; chỉ memo khi có bằng chứng.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 2: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 3: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 4: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 5: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 6: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 7: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.
- Point 8: Interview framing, trade-off analysis, and implementation detail for usememo and usecallback strategy.

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

## Avoiding Unnecessary Re-renders

### Giải thích / Explanation

**English:** Stabilize identities and split contexts to reduce update fan-out.

**Tiếng Việt:** Ổn định identity và tách context để giảm phạm vi cập nhật.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 2: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 3: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 4: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 5: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 6: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 7: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.
- Point 8: Interview framing, trade-off analysis, and implementation detail for avoiding unnecessary re-renders.

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

## Code Splitting with lazy and Suspense

### Giải thích / Explanation

**English:** Split by route and heavy components to lower initial load.

**Tiếng Việt:** Tách code theo route và component nặng để giảm tải ban đầu.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 2: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 3: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 4: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 5: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 6: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 7: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.
- Point 8: Interview framing, trade-off analysis, and implementation detail for code splitting with lazy and suspense.

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

## List Virtualization

### Giải thích / Explanation

**English:** Render only visible rows for large lists to reduce DOM and paint cost.

**Tiếng Việt:** Chỉ render phần tử đang nhìn thấy để giảm chi phí DOM và paint.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 2: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 3: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 4: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 5: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 6: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 7: Interview framing, trade-off analysis, and implementation detail for list virtualization.
- Point 8: Interview framing, trade-off analysis, and implementation detail for list virtualization.

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

## Bundle Analysis Workflow

### Giải thích / Explanation

**English:** Analyze chunks, identify duplicates, and enforce budgets.

**Tiếng Việt:** Phân tích chunk, tìm dependency trùng, và áp ngân sách bundle.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 2: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 3: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 4: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 5: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 6: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 7: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.
- Point 8: Interview framing, trade-off analysis, and implementation detail for bundle analysis workflow.

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

## Profiler API and DevTools

### Giải thích / Explanation

**English:** Use flamegraph and commit duration to locate expensive subtrees.

**Tiếng Việt:** Dùng flamegraph và commit duration để tìm subtree tốn chi phí.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 2: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 3: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 4: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 5: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 6: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 7: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.
- Point 8: Interview framing, trade-off analysis, and implementation detail for profiler api and devtools.

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

## why-did-you-render

### Giải thích / Explanation

**English:** WDYR helps detect avoidable rerenders during development.

**Tiếng Việt:** WDYR giúp phát hiện rerender có thể tránh trong môi trường dev.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 2: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 3: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 4: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 5: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 6: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 7: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.
- Point 8: Interview framing, trade-off analysis, and implementation detail for why-did-you-render.

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

## Concurrent Rendering Benefits

### Giải thích / Explanation

**English:** Concurrency improves responsiveness under heavy updates.

**Tiếng Việt:** Concurrent rendering cải thiện độ phản hồi khi update nặng.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 2: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 3: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 4: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 5: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 6: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 7: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.
- Point 8: Interview framing, trade-off analysis, and implementation detail for concurrent rendering benefits.

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

## Server Components for Performance

### Giải thích / Explanation

**English:** Move non-interactive rendering to server and shrink client JS.

**Tiếng Việt:** Đưa phần render không tương tác lên server để giảm JS phía client.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 2: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 3: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 4: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 5: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 6: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 7: Interview framing, trade-off analysis, and implementation detail for server components for performance.
- Point 8: Interview framing, trade-off analysis, and implementation detail for server components for performance.

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

## Image and Asset Optimization

### Giải thích / Explanation

**English:** Right formats, responsive sizes, and preloading strategies matter.

**Tiếng Việt:** Định dạng đúng, kích thước responsive và chiến lược preload rất quan trọng.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 2: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 3: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 4: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 5: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 6: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 7: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.
- Point 8: Interview framing, trade-off analysis, and implementation detail for image and asset optimization.

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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: Explain React.memo in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q2: Explain useMemo in React interviews — 🟡 [Mid]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q3: Explain useCallback in React interviews — 🔴 [Senior]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q4: Explain code splitting in React interviews — 🟢 [Junior]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q5: Explain Suspense in React interviews — 🟡 [Mid]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q6: Explain virtualization in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q7: Explain bundle analysis in React interviews — 🟢 [Junior]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q8: Explain profiler interpretation in React interviews — 🟡 [Mid]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q9: Explain avoiding rerenders in React interviews — 🔴 [Senior]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q10: Explain server components performance in React interviews — 🟢 [Junior]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q11: Explain React.memo in React interviews — 🟡 [Mid]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q12: Explain useMemo in React interviews — 🔴 [Senior]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q13: Explain useCallback in React interviews — 🟢 [Junior]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q14: Explain code splitting in React interviews — 🟡 [Mid]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q15: Explain Suspense in React interviews — 🔴 [Senior]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q16: Explain virtualization in React interviews — 🟢 [Junior]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q17: Explain bundle analysis in React interviews — 🟡 [Mid]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q18: Explain profiler interpretation in React interviews — 🔴 [Senior]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q19: Explain avoiding rerenders in React interviews — 🟢 [Junior]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q20: Explain server components performance in React interviews — 🟡 [Mid]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q21: Explain React.memo in React interviews — 🔴 [Senior]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q22: Explain useMemo in React interviews — 🟢 [Junior]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q23: Explain useCallback in React interviews — 🟡 [Mid]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q24: Explain code splitting in React interviews — 🔴 [Senior]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q25: Explain Suspense in React interviews — 🟢 [Junior]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q26: Explain virtualization in React interviews — 🟡 [Mid]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q27: Explain bundle analysis in React interviews — 🔴 [Senior]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q28: Explain profiler interpretation in React interviews — 🟢 [Junior]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q29: Explain avoiding rerenders in React interviews — 🟡 [Mid]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q30: Explain server components performance in React interviews — 🔴 [Senior]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q31: Explain React.memo in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q32: Explain useMemo in React interviews — 🟡 [Mid]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q33: Explain useCallback in React interviews — 🔴 [Senior]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q34: Explain code splitting in React interviews — 🟢 [Junior]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q35: Explain Suspense in React interviews — 🟡 [Mid]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q36: Explain virtualization in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q37: Explain bundle analysis in React interviews — 🟢 [Junior]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q38: Explain profiler interpretation in React interviews — 🟡 [Mid]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q39: Explain avoiding rerenders in React interviews — 🔴 [Senior]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q40: Explain server components performance in React interviews — 🟢 [Junior]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q41: Explain React.memo in React interviews — 🟡 [Mid]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q42: Explain useMemo in React interviews — 🔴 [Senior]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q43: Explain useCallback in React interviews — 🟢 [Junior]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q44: Explain code splitting in React interviews — 🟡 [Mid]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q45: Explain Suspense in React interviews — 🔴 [Senior]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q46: Explain virtualization in React interviews — 🟢 [Junior]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q47: Explain bundle analysis in React interviews — 🟡 [Mid]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q48: Explain profiler interpretation in React interviews — 🔴 [Senior]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q49: Explain avoiding rerenders in React interviews — 🟢 [Junior]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q50: Explain server components performance in React interviews — 🟡 [Mid]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q51: Explain React.memo in React interviews — 🔴 [Senior]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q52: Explain useMemo in React interviews — 🟢 [Junior]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q53: Explain useCallback in React interviews — 🟡 [Mid]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q54: Explain code splitting in React interviews — 🔴 [Senior]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q55: Explain Suspense in React interviews — 🟢 [Junior]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q56: Explain virtualization in React interviews — 🟡 [Mid]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q57: Explain bundle analysis in React interviews — 🔴 [Senior]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q58: Explain profiler interpretation in React interviews — 🟢 [Junior]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q59: Explain avoiding rerenders in React interviews — 🟡 [Mid]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q60: Explain server components performance in React interviews — 🔴 [Senior]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q61: Explain React.memo in React interviews — 🟢 [Junior]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q62: Explain useMemo in React interviews — 🟡 [Mid]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q63: Explain useCallback in React interviews — 🔴 [Senior]
**English:** A strong answer defines useCallback, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useCallback, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q64: Explain code splitting in React interviews — 🟢 [Junior]
**English:** A strong answer defines code splitting, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa code splitting, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q65: Explain Suspense in React interviews — 🟡 [Mid]
**English:** A strong answer defines Suspense, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa Suspense, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q66: Explain virtualization in React interviews — 🔴 [Senior]
**English:** A strong answer defines virtualization, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa virtualization, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q67: Explain bundle analysis in React interviews — 🟢 [Junior]
**English:** A strong answer defines bundle analysis, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa bundle analysis, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q68: Explain profiler interpretation in React interviews — 🟡 [Mid]
**English:** A strong answer defines profiler interpretation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa profiler interpretation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q69: Explain avoiding rerenders in React interviews — 🔴 [Senior]
**English:** A strong answer defines avoiding rerenders, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa avoiding rerenders, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q70: Explain server components performance in React interviews — 🟢 [Junior]
**English:** A strong answer defines server components performance, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa server components performance, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q71: Explain React.memo in React interviews — 🟡 [Mid]
**English:** A strong answer defines React.memo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa React.memo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q72: Explain useMemo in React interviews — 🔴 [Senior]
**English:** A strong answer defines useMemo, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useMemo, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
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
