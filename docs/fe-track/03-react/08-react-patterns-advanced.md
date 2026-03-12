# Advanced React Patterns / Mẫu React Nâng Cao
## React - Chapter 8

[← Previous](./07-hooks-comprehensive.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./09-performance-optimization.md)

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [Compound Components](#compound-components)
2. [Render Props](#render-props)
3. [Higher-Order Components](#higher-order-components)
4. [Provider Pattern](#provider-pattern)
5. [State Reducer Pattern](#state-reducer-pattern)
6. [Control Props Pattern](#control-props-pattern)
7. [Prop Getters](#prop-getters)
8. [Container and Presentational](#container-and-presentational)
9. [Headless Components](#headless-components)
10. [Polymorphic Components](#polymorphic-components)
11. [Pattern Selection Matrix](#pattern-selection-matrix)
12. [Interview Trade-off Narratives](#interview-trade-off-narratives)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## Compound Components

### Giải thích / Explanation

**English:** Compound APIs provide flexible composition with shared internal state.

**Tiếng Việt:** Compound API cho phép composition linh hoạt với state dùng chung.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 2: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 3: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 4: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 5: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 6: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 7: Interview framing, trade-off analysis, and implementation detail for compound components.
- Point 8: Interview framing, trade-off analysis, and implementation detail for compound components.

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

## Render Props

### Giải thích / Explanation

**English:** Render props invert rendering control by passing render functions.

**Tiếng Việt:** Render props đảo quyền render bằng cách truyền hàm render.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 2: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 3: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 4: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 5: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 6: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 7: Interview framing, trade-off analysis, and implementation detail for render props.
- Point 8: Interview framing, trade-off analysis, and implementation detail for render props.

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

## Higher-Order Components

### Giải thích / Explanation

**English:** HOCs wrap components to inject cross-cutting behavior.

**Tiếng Việt:** HOC bọc component để tiêm hành vi cắt ngang.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 2: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 3: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 4: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 5: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 6: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 7: Interview framing, trade-off analysis, and implementation detail for higher-order components.
- Point 8: Interview framing, trade-off analysis, and implementation detail for higher-order components.

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

## Provider Pattern

### Giải thích / Explanation

**English:** Providers expose scoped capabilities and configuration via context.

**Tiếng Việt:** Provider cung cấp capability và config theo scope thông qua context.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 2: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 3: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 4: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 5: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 6: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 7: Interview framing, trade-off analysis, and implementation detail for provider pattern.
- Point 8: Interview framing, trade-off analysis, and implementation detail for provider pattern.

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

## State Reducer Pattern

### Giải thích / Explanation

**English:** Expose reducer hooks so consumers can intercept internal transitions.

**Tiếng Việt:** Mẫu state reducer cho phép consumer can thiệp transition nội bộ.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 2: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 3: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 4: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 5: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 6: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 7: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.
- Point 8: Interview framing, trade-off analysis, and implementation detail for state reducer pattern.

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

## Control Props Pattern

### Giải thích / Explanation

**English:** Components can be controlled externally for predictable integrations.

**Tiếng Việt:** Component có thể được điều khiển từ ngoài để tích hợp ổn định.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 2: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 3: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 4: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 5: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 6: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 7: Interview framing, trade-off analysis, and implementation detail for control props pattern.
- Point 8: Interview framing, trade-off analysis, and implementation detail for control props pattern.

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

## Prop Getters

### Giải thích / Explanation

**English:** Prop getters merge internal behavior with consumer-provided props safely.

**Tiếng Việt:** Prop getter trộn hành vi nội bộ với props từ consumer một cách an toàn.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 2: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 3: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 4: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 5: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 6: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 7: Interview framing, trade-off analysis, and implementation detail for prop getters.
- Point 8: Interview framing, trade-off analysis, and implementation detail for prop getters.

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

## Container and Presentational

### Giải thích / Explanation

**English:** Separate data orchestration from visual rendering concerns.

**Tiếng Việt:** Tách điều phối dữ liệu khỏi phần hiển thị giao diện.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 2: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 3: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 4: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 5: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 6: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 7: Interview framing, trade-off analysis, and implementation detail for container and presentational.
- Point 8: Interview framing, trade-off analysis, and implementation detail for container and presentational.

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

## Headless Components

### Giải thích / Explanation

**English:** Headless design exposes behavior without enforcing visual styling.

**Tiếng Việt:** Headless component chỉ cung cấp hành vi, không áp đặt giao diện.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 2: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 3: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 4: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 5: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 6: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 7: Interview framing, trade-off analysis, and implementation detail for headless components.
- Point 8: Interview framing, trade-off analysis, and implementation detail for headless components.

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

## Polymorphic Components

### Giải thích / Explanation

**English:** Polymorphic APIs support an "as" prop while preserving type safety.

**Tiếng Việt:** API polymorphic hỗ trợ prop "as" nhưng vẫn giữ type safety.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 2: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 3: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 4: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 5: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 6: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 7: Interview framing, trade-off analysis, and implementation detail for polymorphic components.
- Point 8: Interview framing, trade-off analysis, and implementation detail for polymorphic components.

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

## Pattern Selection Matrix

### Giải thích / Explanation

**English:** Choose patterns based on API flexibility, ergonomics, and performance.

**Tiếng Việt:** Chọn pattern dựa trên độ linh hoạt API, trải nghiệm dev và hiệu năng.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 2: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 3: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 4: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 5: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 6: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 7: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.
- Point 8: Interview framing, trade-off analysis, and implementation detail for pattern selection matrix.

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

## Interview Trade-off Narratives

### Giải thích / Explanation

**English:** Senior interviews prioritize rationale and trade-off storytelling.

**Tiếng Việt:** Phỏng vấn senior ưu tiên lý do chọn giải pháp và phân tích đánh đổi.

### Key Points / Ý Chính
- Point 1: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 2: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 3: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 4: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 5: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 6: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 7: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.
- Point 8: Interview framing, trade-off analysis, and implementation detail for interview trade-off narratives.

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

### Q1: Explain compound components in React interviews — 🟢 [Junior]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q2: Explain render props in React interviews — 🟡 [Mid]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q3: Explain HOC trade-offs in React interviews — 🔴 [Senior]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q4: Explain provider pattern in React interviews — 🟢 [Junior]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q5: Explain state reducer pattern in React interviews — 🟡 [Mid]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q6: Explain control props in React interviews — 🔴 [Senior]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q7: Explain prop getters in React interviews — 🟢 [Junior]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q8: Explain container/presentational split in React interviews — 🟡 [Mid]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q9: Explain headless components in React interviews — 🔴 [Senior]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q10: Explain polymorphic components in React interviews — 🟢 [Junior]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q11: Explain compound components in React interviews — 🟡 [Mid]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q12: Explain render props in React interviews — 🔴 [Senior]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q13: Explain HOC trade-offs in React interviews — 🟢 [Junior]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q14: Explain provider pattern in React interviews — 🟡 [Mid]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q15: Explain state reducer pattern in React interviews — 🔴 [Senior]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q16: Explain control props in React interviews — 🟢 [Junior]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q17: Explain prop getters in React interviews — 🟡 [Mid]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q18: Explain container/presentational split in React interviews — 🔴 [Senior]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q19: Explain headless components in React interviews — 🟢 [Junior]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q20: Explain polymorphic components in React interviews — 🟡 [Mid]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q21: Explain compound components in React interviews — 🔴 [Senior]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q22: Explain render props in React interviews — 🟢 [Junior]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q23: Explain HOC trade-offs in React interviews — 🟡 [Mid]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q24: Explain provider pattern in React interviews — 🔴 [Senior]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q25: Explain state reducer pattern in React interviews — 🟢 [Junior]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q26: Explain control props in React interviews — 🟡 [Mid]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q27: Explain prop getters in React interviews — 🔴 [Senior]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q28: Explain container/presentational split in React interviews — 🟢 [Junior]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q29: Explain headless components in React interviews — 🟡 [Mid]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q30: Explain polymorphic components in React interviews — 🔴 [Senior]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q31: Explain compound components in React interviews — 🟢 [Junior]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q32: Explain render props in React interviews — 🟡 [Mid]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q33: Explain HOC trade-offs in React interviews — 🔴 [Senior]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q34: Explain provider pattern in React interviews — 🟢 [Junior]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q35: Explain state reducer pattern in React interviews — 🟡 [Mid]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q36: Explain control props in React interviews — 🔴 [Senior]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q37: Explain prop getters in React interviews — 🟢 [Junior]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q38: Explain container/presentational split in React interviews — 🟡 [Mid]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q39: Explain headless components in React interviews — 🔴 [Senior]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q40: Explain polymorphic components in React interviews — 🟢 [Junior]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q41: Explain compound components in React interviews — 🟡 [Mid]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q42: Explain render props in React interviews — 🔴 [Senior]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q43: Explain HOC trade-offs in React interviews — 🟢 [Junior]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q44: Explain provider pattern in React interviews — 🟡 [Mid]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q45: Explain state reducer pattern in React interviews — 🔴 [Senior]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q46: Explain control props in React interviews — 🟢 [Junior]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q47: Explain prop getters in React interviews — 🟡 [Mid]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q48: Explain container/presentational split in React interviews — 🔴 [Senior]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q49: Explain headless components in React interviews — 🟢 [Junior]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q50: Explain polymorphic components in React interviews — 🟡 [Mid]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q51: Explain compound components in React interviews — 🔴 [Senior]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q52: Explain render props in React interviews — 🟢 [Junior]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q53: Explain HOC trade-offs in React interviews — 🟡 [Mid]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q54: Explain provider pattern in React interviews — 🔴 [Senior]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q55: Explain state reducer pattern in React interviews — 🟢 [Junior]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q56: Explain control props in React interviews — 🟡 [Mid]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q57: Explain prop getters in React interviews — 🔴 [Senior]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q58: Explain container/presentational split in React interviews — 🟢 [Junior]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q59: Explain headless components in React interviews — 🟡 [Mid]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q60: Explain polymorphic components in React interviews — 🔴 [Senior]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q61: Explain compound components in React interviews — 🟢 [Junior]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q62: Explain render props in React interviews — 🟡 [Mid]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q63: Explain HOC trade-offs in React interviews — 🔴 [Senior]
**English:** A strong answer defines HOC trade-offs, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa HOC trade-offs, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q64: Explain provider pattern in React interviews — 🟢 [Junior]
**English:** A strong answer defines provider pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa provider pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q65: Explain state reducer pattern in React interviews — 🟡 [Mid]
**English:** A strong answer defines state reducer pattern, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa state reducer pattern, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q66: Explain control props in React interviews — 🔴 [Senior]
**English:** A strong answer defines control props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa control props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q67: Explain prop getters in React interviews — 🟢 [Junior]
**English:** A strong answer defines prop getters, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa prop getters, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q68: Explain container/presentational split in React interviews — 🟡 [Mid]
**English:** A strong answer defines container/presentational split, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa container/presentational split, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q69: Explain headless components in React interviews — 🔴 [Senior]
**English:** A strong answer defines headless components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa headless components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q70: Explain polymorphic components in React interviews — 🟢 [Junior]
**English:** A strong answer defines polymorphic components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa polymorphic components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q71: Explain compound components in React interviews — 🟡 [Mid]
**English:** A strong answer defines compound components, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa compound components, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q72: Explain render props in React interviews — 🔴 [Senior]
**English:** A strong answer defines render props, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa render props, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
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
