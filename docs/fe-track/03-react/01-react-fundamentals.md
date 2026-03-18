# React Fundamentals / Nền Tảng React
## React - Chapter 1

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [JavaScript Basics](../01-javascript/00-javascript-basics.md) | [Closures](../01-javascript/03-closures.md) | [Event Loop](../01-javascript/06-event-loop-async.md)
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [React Patterns](./08-react-patterns-advanced.md) | [Shared Theory](../../shared/01-cs-fundamentals/data-structures-theory.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./02-react-19-features.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn build một trang to-do list bằng JavaScript thuần. Mỗi lần user thêm/xóa task, bạn phải:
1. Cập nhật data trong JS
2. **Tự tay** tìm DOM element cần thay đổi
3. **Tự tay** cập nhật innerHTML/textContent
4. Đảm bảo UI và data không bị lệch nhau

Với 50 tính năng, code trở thành mớ hỗn độn: data ở chỗ này, DOM manipulation ở chỗ khác, bug khi state không sync với UI.

**React giải quyết điều này bằng một triết lý đơn giản:**
> `UI = f(state)` — UI là hàm của state. Thay đổi state, React tự tính toán và cập nhật DOM.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Excel Spreadsheet:**
Trong Excel, bạn gõ số vào ô A1. Ô B1 có công thức `=A1 * 2`. Ngay lập tức, B1 tự cập nhật — bạn không cần "nói" cho B1 biết A1 đã thay đổi.

React hoạt động theo nguyên lý tương tự:
- **State** = ô A1 (source of truth)
- **Component** = công thức trong B1 (tự động re-render khi state thay đổi)
- **Virtual DOM** = Excel tính toán xem ô nào thực sự cần cập nhật, không vẽ lại toàn bộ bảng

**3 ý tưởng cốt lõi của React:**

| Ý tưởng | Nghĩa là | Tại sao quan trọng |
|---------|----------|-------------------|
| **Declarative** | Mô tả UI trông như thế nào, không nói cách làm | Code dễ đọc, ít bug hơn imperative |
| **Component-based** | UI = cây các component nhỏ, reusable | Tái sử dụng, test độc lập từng phần |
| **Unidirectional data flow** | Data chỉ chạy từ parent → child | Dễ debug, predictable |

**Tại sao React thống trị?**
- Component model + Virtual DOM = DX tốt + performance ổn
- Ecosystem khổng lồ (Next.js, React Native, Remix)
- Facebook-backed → tương lai rõ ràng với React Server Components

---

## Concept Map / Bản Đồ Khái Niệm

```
    [JavaScript + DOM]
    (Events, closures, async)
            │
            ▼
    [REACT FUNDAMENTALS]  ← bạn đang ở đây
            │
   ┌────────┼────────┐
   ▼        ▼        ▼
[JSX]  [Components] [Virtual DOM]
Transpile  Function   Reconciliation
→ React.   Class      Fiber arch
  createElement  Props/State  Diffing
            │
            ▼
       [Hooks]
   useState | useEffect
   useRef | useContext
   useMemo | useCallback
            │
            ▼
   [Data Flow]
   Props drilling → Context → Redux/Zustand
            │
            ▼
   [Next.js / React Native]
   Server Components | Mobile
```

---

## Tổng Quan / Overview

**English:** React is a declarative UI library where `UI = f(state)`. This chapter explains the internals — JSX compilation, Virtual DOM, Fiber reconciliation — so you can reason about why React behaves the way it does, not just how to use it.

**Tiếng Việt:** React là thư viện UI theo hướng khai báo: `UI = f(state)`. Chương này giải thích cơ chế bên trong — JSX compile như thế nào, Virtual DOM hoạt động ra sao, Fiber reconciliation là gì — để bạn hiểu tại sao React behave như vậy, không chỉ biết cách dùng.

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
- JSX compiles to `React.createElement(type, props, ...children)` calls; since React 17, the new JSX transform uses `jsx()` / `jsxs()` from `react/jsx-runtime`, eliminating the need to import React in scope. Từ React 17, không cần `import React` nữa nhờ jsx-runtime tự động.
- JSX expressions must return a single root element. Fragments (`<>...</>`) avoid adding unnecessary DOM wrappers. Fragment là cách tránh thêm `<div>` thừa vào DOM.
- Curly braces `{}` in JSX create an expression slot — you can embed any JS expression but **not** statements (`if`, `for`). Use ternaries or `&&` for conditional rendering. Chỉ dùng expression trong `{}`, không dùng statement.
- Boolean, `null`, and `undefined` are valid JSX children that render nothing. This enables patterns like `{isLoggedIn && <Dashboard />}`. Tuy nhiên, cẩn thận với `{count && <List />}` khi `count === 0` vì `0` sẽ render ra màn hình.
- JSX attribute names follow camelCase (`className`, `htmlFor`, `onClick`) because they map to DOM element properties, not HTML attributes. Đây là lý do dùng `className` thay vì `class`.
- Spread props `{...props}` is a common pattern but can accidentally pass unwanted attributes to DOM elements, causing React warnings. Destructure and forward explicitly in reusable components. Luôn destructure rõ ràng thay vì spread toàn bộ.
- Custom components must start with an uppercase letter; lowercase tags are treated as HTML intrinsic elements. This distinction drives how React resolves the component type during compilation. Component phải viết hoa chữ đầu, nếu không React sẽ hiểu nhầm thành thẻ HTML.
- The compilation step is where TypeScript type-checks props via generics (`FC<Props>` or typed function params). Type errors surface at compile time, not runtime. TypeScript kiểm tra prop types lúc biên dịch, giúp bắt lỗi sớm.

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
- `React.createElement(type, props, ...children)` returns a plain JavaScript object `{ type, props, key, ref }` — it is NOT a DOM node, just a lightweight description. Tiếng Việt: Element chỉ là plain object mô tả UI, không phải DOM thật, nên tạo rất nhanh.
- The `type` field can be a string (`'div'`), a function component, a class component, or a special symbol like `React.Fragment`. React uses this to determine what to render during reconciliation. Tiếng Việt: React dùng `type` để quyết định render gì — nếu là string thì tạo DOM node, nếu là function thì gọi hàm.
- React elements are **immutable** by design — once created, you cannot change their children or props. To update UI you create a new element and let React diff the trees. Tiếng Việt: Tính bất biến của element là chủ ý thiết kế, giúp React so sánh nhanh và đảm bảo predictable rendering.
- The `key` and `ref` fields are stripped from `props` before being passed to the component; they are reserved by React itself. Accessing `props.key` in a component always returns `undefined`. Tiếng Việt: `key` và `ref` không có trong `props` — đây là gotcha phổ biến khi muốn truyền key như một prop thông thường.
- Before React 17, every file using JSX had to `import React from 'react'` because Babel transformed JSX to `React.createElement` which needed `React` in scope. The new JSX transform calls `jsx()` from `react/jsx-runtime` automatically. Tiếng Việt: Đây là lý do tại sao trước React 17 hay gặp lỗi "React is not defined" khi quên import.
- A React element tree is just a nested JavaScript object graph. This makes server-side rendering straightforward — serialize the object tree to HTML without a real DOM environment. Tiếng Việt: Vì element chỉ là JS object, React có thể render trên server (Node.js) mà không cần DOM thật.
- `React.cloneElement(element, extraProps)` creates a shallow copy of an element with merged props — commonly used in component libraries that inject props into children. Tiếng Việt: `cloneElement` hữu ích để inject prop vào children từ parent, nhưng cần cẩn thận vì nó làm tight coupling.
- Comparing two element references with `===` always returns `false` unless they are literally the same object, because `createElement` always creates a new object. Use `key` for identity, not reference equality. Tiếng Việt: Đừng dùng `===` để so sánh element — React dùng `type` và `key` để xác định identity, không phải reference.

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
- The Virtual DOM is an in-memory JavaScript representation of the real DOM tree. React diffs the previous and next virtual trees to compute the minimal set of real DOM mutations needed. Tiếng Việt: Virtual DOM là cây JS object, không phải DOM thật — React so sánh hai cây để tìm thay đổi tối thiểu.
- React's diffing algorithm (reconciliation) runs in O(n) time by applying two heuristics: (1) elements of different type produce entirely different trees, (2) elements with stable keys maintain identity across renders. Tiếng Việt: Thuật toán diffing O(n) nhờ hai giả định: khác `type` = re-create, `key` giống = giữ nguyên.
- When React encounters two elements of the **same type**, it keeps the DOM node and only updates changed attributes. When the type changes (e.g., `<div>` → `<span>`), it destroys the entire subtree and remounts it. Tiếng Việt: Thay đổi `type` sẽ unmount toàn bộ subtree — đây là gotcha khi dùng conditional rendering thay đổi tag.
- The Virtual DOM is a **trade-off**, not always faster than direct DOM manipulation. For simple apps, direct manipulation (like Svelte's compiled output) can beat React. React's value is in predictable, declarative updates for complex UIs. Tiếng Việt: Virtual DOM không phải lúc nào cũng nhanh nhất — Svelte không dùng VDOM và thường nhanh hơn cho app nhỏ.
- React batches multiple `setState` calls within a single event handler into one reconciliation pass to avoid redundant re-renders. In React 18, this batching extends to async callbacks and Promises via automatic batching. Tiếng Việt: React 18 tự động batch cả trong async — trước đó chỉ batch trong event handler đồng bộ.
- During reconciliation, React processes the **work-in-progress** fiber tree without touching the screen. Only in the commit phase does React flush changes to the real DOM, ensuring the user never sees partially updated UI. Tiếng Việt: Người dùng không bao giờ thấy UI cập nhật một nửa vì React chỉ flush DOM trong commit phase.
- Unnecessary reconciliation is a common performance issue. `React.memo`, `useMemo`, and `useCallback` prevent child re-renders by stabilizing references, reducing the number of fiber nodes React needs to compare. Tiếng Việt: Dùng `memo`, `useMemo`, `useCallback` để giảm số fiber node cần so sánh trong mỗi reconciliation pass.
- React 18's concurrent rendering allows reconciliation to be **interrupted and restarted**. If new state arrives during a low-priority render, React can throw away partial work and restart with the latest state. Tiếng Việt: Concurrent React có thể bỏ kết quả render dở và làm lại — đây là lý do side-effects trong render phải thuần túy.

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
- A Fiber is a JavaScript object that represents a unit of work for a single component instance. It stores the component type, its props, state, effect list, and pointers to parent, child, and sibling fibers. Tiếng Việt: Fiber là object JS đại diện cho một đơn vị công việc — mỗi component có một fiber tương ứng trong cây.
- Before Fiber (React ≤ 15), reconciliation was synchronous and recursive — once started it could not be interrupted, causing long tasks to block the main thread and drop frames. Fiber replaced this with an iterative, interruptible model. Tiếng Việt: Trước Fiber, reconciliation là đệ quy đồng bộ — không dừng được giữa chừng, gây janky UI khi cây lớn.
- Fiber uses a **double-buffering** strategy: the current tree (currently on screen) and the work-in-progress tree (being built). When work completes, React atomically swaps the two trees. Tiếng Việt: Double buffering đảm bảo người dùng luôn thấy consistent UI — không bao giờ thấy cây nửa vời.
- Each fiber has a `lanes` bitmask indicating its update priority. React 18 defines lane priorities from `SyncLane` (user input) down to `OffscreenLane` (deferred pre-rendering). Higher priority lanes preempt lower priority work. Tiếng Việt: Lanes là cơ chế priority — user input được xử lý ngay, data fetching có thể trì hoãn.
- `startTransition` marks state updates as non-urgent, placing them on a low-priority lane. The UI stays responsive to typing or clicking while the expensive re-render happens in the background. Tiếng Việt: `startTransition` cho phép React trì hoãn render nặng để giữ input vẫn mượt mà.
- The Fiber architecture enables **Suspense** and **concurrent features** by allowing React to pause rendering when a component suspends (throws a Promise), then resume later when the data resolves. Tiếng Việt: Suspense hoạt động nhờ Fiber — khi component throw Promise, React pause work-in-progress và render fallback.
- `useTransition` returns `[isPending, startTransition]`. The `isPending` boolean reflects whether any transition-priority work is still in progress, useful for showing a loading spinner without blocking the current UI. Tiếng Việt: `isPending` từ `useTransition` dùng để hiện spinner mà không block UI hiện tại.
- Understanding Fiber matters for debugging performance: React DevTools Profiler shows each fiber as a flamechart bar. A long bar means that fiber's render function is expensive and may be a candidate for `memo` or computation offloading. Tiếng Việt: React DevTools Profiler hiển thị từng fiber — bar dài = render chậm, cần tối ưu bằng `memo` hoặc memoization.

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
- The **render phase** is pure computation: React calls your component functions, runs hooks, and builds the work-in-progress fiber tree. No DOM mutations happen here. It can be interrupted, restarted, or run multiple times. Tiếng Việt: Render phase chỉ tính toán, không đụng DOM — có thể bị hủy và chạy lại, nên không được có side effects.
- The **commit phase** is synchronous and cannot be interrupted. React applies DOM mutations (`insertBefore`, `removeChild`, `setAttribute`), then runs `useLayoutEffect` callbacks, then paints, then runs `useEffect` callbacks. Tiếng Việt: Commit phase không thể dừng — React cập nhật DOM, chạy layout effects, paint, rồi chạy effects.
- `useLayoutEffect` fires synchronously **after** DOM mutations but **before** the browser paints. Use it when you need to measure DOM dimensions or synchronously adjust layout to avoid a visual flash. Tiếng Việt: `useLayoutEffect` chạy trước khi browser vẽ — dùng khi cần đọc/ghi DOM mà không muốn người dùng thấy flash.
- `useEffect` fires **after** the browser paints. It's intentionally deferred so it doesn't block the visual update. This is why data fetching in `useEffect` shows the component "empty first, then populated." Tiếng Việt: `useEffect` chạy sau khi paint — đây là lý do fetch data trong effect hay thấy loading state ban đầu.
- Because the render phase can be restarted in concurrent mode, side effects in render functions (like directly mutating variables outside the component) can execute more than once. StrictMode deliberately double-invokes render to surface this bug. Tiếng Việt: Concurrent mode có thể render nhiều lần — side effect trong render sẽ chạy nhiều lần, StrictMode dùng điều này để phát hiện bug.
- The commit phase has three sub-phases: **beforeMutation** (snapshot), **mutation** (DOM changes), and **layout** (reads back DOM for layout effects). Understanding this ordering explains why `getSnapshotBeforeUpdate` runs before DOM changes in class components. Tiếng Việt: Commit có 3 giai đoạn con — snapshot → mutation DOM → layout effects; hiểu điều này giúp debug timing issues.
- `flushSync` forces React to commit all pending state updates synchronously before returning. Use it when you need to read the DOM immediately after a state update, but it disables concurrent features for that update. Tiếng Việt: `flushSync` ép React commit ngay lập tức — hữu ích nhưng tắt concurrent rendering, dùng cẩn thận.
- In the commit phase, React also schedules passive effects cleanup: the cleanup function from the previous `useEffect` runs before the new effect fires, ensuring subscriptions are properly torn down. Tiếng Việt: Cleanup của `useEffect` chạy trước effect mới — đảm bảo subscription cũ bị hủy trước khi đăng ký mới.

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
- Function components are plain JavaScript functions that accept props and return JSX. They have no `this`, no lifecycle methods — state and side effects are handled by hooks. Tiếng Việt: Function component là hàm JS thuần — không có `this`, dùng hooks thay cho lifecycle methods của class.
- Class components store state on `this.state` and access props via `this.props`. A critical gotcha: `this.setState` is asynchronous and merges (shallow) the update with existing state, unlike `useState`'s setter which fully replaces the state slice. Tiếng Việt: `this.setState` merge shallow với state hiện tại — khác với `useState` setter thay thế hoàn toàn giá trị.
- Function components **capture** props and state at render time via closures. Class components always read the **latest** `this.props` and `this.state`. This difference causes the classic "stale closure" bug in function components and a different bug ("reading future props") in class components. Tiếng Việt: Function component capture props/state tại thời điểm render — đây là nguồn gốc của stale closure bugs.
- Only class components can implement `componentDidCatch` and `getDerivedStateFromError`, making them still necessary for **error boundaries**. There is no hook equivalent for error boundary behavior as of React 18. Tiếng Việt: Error boundaries vẫn phải dùng class component — hooks chưa có API tương đương cho `componentDidCatch`.
- `React.PureComponent` performs a **shallow comparison** of props and state before re-rendering, equivalent to `React.memo` for class components. Deep object mutations bypass both, causing missed updates. Tiếng Việt: `PureComponent` so sánh shallow — mutate object trực tiếp thay vì tạo object mới sẽ khiến component không re-render.
- The hooks model improves **code colocation**: all logic for a feature (state + effect + cleanup) lives together in a custom hook rather than being split across `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Tiếng Việt: Hooks cho phép gom logic liên quan vào một custom hook — class buộc bạn tách logic ra 3 lifecycle methods khác nhau.
- When migrating class to function components, `getDerivedStateFromProps` is often the hardest to replace. The equivalent pattern in hooks is computing derived state inline during render or using `useMemo`. Tiếng Việt: `getDerivedStateFromProps` khó migrate nhất — trong hooks thường thay bằng tính toán derived state inline trong render.
- React team officially recommends function components for all new code. Class components will not be removed (too much existing code), but Concurrent Mode features like `useTransition` and `useDeferredValue` are hooks-only. Tiếng Việt: React team khuyến nghị dùng function component — các tính năng Concurrent Mode mới chỉ có bản hook.

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
- `componentDidMount` maps to `useEffect(() => { ... }, [])` — runs once after the first commit. Note that in StrictMode, React mounts, unmounts, then mounts again to verify cleanup, so this effect fires twice in development. Tiếng Việt: `useEffect` với `[]` tương đương `componentDidMount` — nhưng StrictMode chạy 2 lần trong dev để kiểm tra cleanup.
- `componentDidUpdate` maps to `useEffect(() => { ... }, [dep1, dep2])`. Unlike `componentDidUpdate`, you cannot access `prevProps` directly — you must store previous values in a `useRef` if you need comparison. Tiếng Việt: Để so sánh với giá trị trước đó, dùng `useRef` để lưu previous value — `useEffect` không có `prevProps`.
- `componentWillUnmount` maps to the **cleanup function** returned from `useEffect`. This function also runs before the effect re-fires on dependency changes, not just on unmount. Tiếng Việt: Cleanup function chạy cả khi dependency thay đổi, không chỉ khi unmount — đây là khác biệt quan trọng so với `componentWillUnmount`.
- `getDerivedStateFromProps` is replaced by **computing derived state during render**: `const sorted = useMemo(() => sort(list), [list])`. Using `useEffect` to sync state from props is an anti-pattern that causes extra re-renders. Tiếng Việt: Đừng dùng `useEffect` để sync state từ props — tính toán derived state inline hoặc dùng `useMemo`.
- `shouldComponentUpdate` is replaced by `React.memo(Component, areEqualFn)`. The `areEqualFn` receives previous and next props and returns `true` to skip re-rendering. Returning `false` always renders (opposite of `shouldComponentUpdate`). Tiếng Việt: `React.memo` trả về `true` để SKIP render — ngược với `shouldComponentUpdate` trả `true` để render.
- `getSnapshotBeforeUpdate` has no direct hook equivalent. It's used to capture scroll position before a DOM update. In hooks, `useLayoutEffect` with `useRef` can approximate this pattern by reading the DOM synchronously before paint. Tiếng Việt: `getSnapshotBeforeUpdate` không có hook tương đương trực tiếp — dùng `useLayoutEffect` + `useRef` để đọc DOM trước khi paint.
- `componentDidCatch` + `getDerivedStateFromError` remain class-only. The recommended pattern is a single class-based `ErrorBoundary` component wrapping the app, combined with a `useErrorBoundary` custom hook for programmatic throwing. Tiếng Việt: Vẫn cần class component cho error boundary — thường có một class `ErrorBoundary` duy nhất bao toàn app.
- There is no hook for `componentWillReceiveProps` or the deprecated `UNSAFE_componentWillMount`. These were removed from the recommended API because they run during the render phase and encourage side effects that break concurrent rendering. Tiếng Việt: `componentWillReceiveProps` bị deprecated vì chạy trong render phase — dễ gây side effects không an toàn với Concurrent Mode.

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
- `key` is React's hint for identity: a component with the same key at the same position in the tree is treated as the **same instance** across renders, preserving its state and DOM node. Tiếng Việt: `key` giống nhau = React giữ nguyên instance, state, và DOM node — thay đổi key sẽ unmount và remount.
- Using the **array index as key** is problematic when the list can reorder or items can be added/removed in the middle. React matches by key, so a reordered item retains the old component's state while showing new data. Tiếng Việt: Dùng index làm key khi list có thể thay đổi thứ tự sẽ gây state mismatch — input hoặc animation state sẽ ở sai item.
- Without keys, React uses position-based matching. Inserting an item at the beginning of a list forces React to update every element in the list, because each element is now at a different position. Tiếng Việt: Không có key, React dùng position để match — thêm vào đầu list khiến tất cả elements phải update.
- Keys only need to be **unique among siblings** — not globally unique across the entire app. UUIDs are valid but unnecessary; a stable entity ID (database primary key or slug) is the right choice. Tiếng Việt: Key chỉ cần unique giữa các siblings, không cần unique toàn app — dùng ID từ database là đủ.
- Changing a key deliberately is a valid technique to **force remount** of a component, resetting all its state. This is cleaner than imperatively resetting state inside the component via useEffect. Tiếng Việt: Thay đổi key để force remount là kỹ thuật hợp lệ khi muốn reset hoàn toàn state của component.
- Keys are also used in non-list contexts, e.g., on a single component: `<ProfileCard key={userId} />`. When `userId` changes, the whole component unmounts and remounts, giving you a clean slate without writing reset logic. Tiếng Việt: `key` trên component đơn lẻ (không phải list) rất hữu ích để reset state khi prop quan trọng thay đổi.
- The reconciler first checks if types match at the same position. If `<input>` changes to `<textarea>`, the DOM node is fully replaced regardless of key. The key check happens **after** the type check. Tiếng Việt: React kiểm tra `type` trước `key` — đổi type sẽ remount bất kể key có giống hay không.
- In concurrent mode, React may render lists multiple times before committing. If keys are not stable (e.g., `key={Math.random()}`), every render creates new fiber nodes, destroying component state and causing severe performance issues. Tiếng Việt: `key={Math.random()}` là anti-pattern nghiêm trọng — tạo fiber mới mỗi render, phá hủy state và gây re-mount liên tục.

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
- In React 18 StrictMode, every component **mounts, unmounts, then mounts again** before the user sees the screen. This simulates future fast-refresh / offscreen component behavior and exposes effects that fail to clean up. Tiếng Việt: StrictMode mount → unmount → mount lại để giả lập fast-refresh — effects không cleanup đúng sẽ bị lộ.
- StrictMode **double-invokes** render functions, state initializers, and `useMemo`/`useCallback`/`useReducer` bodies to detect side effects inside what should be pure functions. This only happens in development — production is unaffected. Tiếng Việt: Double invoke chỉ xảy ra trong development — giúp phát hiện side effects trong render/memo functions.
- `useEffect` in StrictMode fires the setup, then the cleanup, then the setup again. If your effect opens a WebSocket or starts an animation and the cleanup does not close/cancel it, you will end up with two connections or two animations in development. Tiếng Việt: Nếu effect mở kết nối mà cleanup không đóng, StrictMode sẽ lộ ra 2 kết nối trong dev — đây là bug thật sự.
- StrictMode warns about using deprecated APIs like `findDOMNode`, `ReactDOM.render` (replaced by `createRoot`), string refs, and legacy context. These warnings help plan migrations. Tiếng Việt: StrictMode cảnh báo về deprecated API như `findDOMNode`, `ReactDOM.render` cũ — giúp lên kế hoạch migration.
- `<React.StrictMode>` can wrap just a portion of your app tree, allowing you to enable it incrementally in large codebases. Start with leaf components, then work up to higher-level features. Tiếng Việt: Có thể bọc `StrictMode` quanh một phần app thay vì toàn bộ — hữu ích khi migrate dần dần trong codebase lớn.
- A common StrictMode issue: fetch-on-mount with no cleanup causes two HTTP requests in development. The fix is either an AbortController or a boolean `cancelled` flag, which is also the correct production pattern for race conditions. Tiếng Việt: StrictMode khiến useEffect fetch 2 lần — giải pháp là AbortController, đây cũng là cách đúng để tránh race condition.
- The double mount behavior was introduced in React 18. In React 17, StrictMode only double-invoked render functions and state initializers, but did not double-fire effects. This is a breaking behavior change teams should be aware of during upgrades. Tiếng Việt: React 18 mới thêm double-mount cho effects — React 17 chỉ double-invoke render functions, không phải effects.
- StrictMode has zero runtime cost in production builds. Babel/webpack strip the StrictMode wrapper and its associated double-invoke behavior entirely from production bundles. Tiếng Việt: StrictMode không ảnh hưởng performance production — được loại bỏ hoàn toàn khi build prod.

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
- `ReactDOM.createPortal(children, domNode)` renders `children` into `domNode` which can be any DOM node outside the parent component's DOM hierarchy. This solves z-index and overflow problems for modals, tooltips, and dropdowns. Tiếng Việt: Portal giải quyết vấn đề z-index và overflow khi muốn render modal/tooltip ra ngoài cây DOM cha.
- Even though the portal's DOM node is outside the parent, it is still **inside the React component tree**. Context, state, and refs work as expected — a portal child can consume context from ancestors in the React tree. Tiếng Việt: Portal vẫn trong React tree, nên Context và state từ parent vẫn accessible — chỉ DOM position thay đổi.
- **Events bubble through the React component tree, not the DOM tree.** A click inside a portal will bubble up through its React parent components, even if those components are DOM ancestors of a completely different DOM node. Tiếng Việt: Events bubble theo React tree, không theo DOM tree — click trong portal sẽ bubble lên React ancestors của portal.
- This event bubbling behavior is intentional but can be surprising. A modal rendered in a portal, wrapped by a `<div onClick={handleOutsideClick}>`, will have inside-clicks bubble up to `handleOutsideClick`. Tiếng Việt: Gotcha: click bên trong modal portal sẽ trigger `onClick` của ancestor — cần `event.stopPropagation()` hoặc kiểm tra target.
- Common portal use cases: **modals** (need to escape overflow:hidden containers), **tooltips** (need to appear above all z-index layers), **toast notifications** (fixed position at document root). Tiếng Việt: Dùng portal cho modal, tooltip, toast — các component cần thoát khỏi overflow hoặc z-index của container.
- Portal cleanup is handled automatically when the component unmounts. The portal's DOM subtree is removed. No manual cleanup is needed, unlike event listeners added with `addEventListener`. Tiếng Việt: React tự dọn DOM của portal khi component unmount — không cần cleanup thủ công như `addEventListener`.
- When creating the target DOM node for a portal (e.g., `document.createElement('div')`), do it outside the render function (in a `useRef` or module-level constant) to avoid creating a new node on every render. Tiếng Việt: Tạo DOM target cho portal ngoài render function — dùng `useRef` hoặc module-level constant để tránh tạo mới mỗi render.
- In SSR contexts, `ReactDOM.createPortal` requires the target DOM node to exist. Server-rendered HTML does not support portals directly — they are hydrated on the client. Use a `typeof document !== 'undefined'` guard. Tiếng Việt: Portal không hoạt động trong SSR — cần guard `typeof document !== 'undefined'` và hydrate phía client.

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
- React enforces **unidirectional data flow**: data flows down via props, events flow up via callback props. This makes the data flow explicit and debuggable — you can always trace where a value comes from by following the prop chain. Tiếng Việt: Dữ liệu chảy xuống qua props, sự kiện chảy lên qua callback — luồng rõ ràng, dễ trace khi debug.
- **Lifting state up** is the canonical React pattern for sharing state between sibling components: move the state to the nearest common ancestor and pass it down as props. This avoids the need for a global store in small to medium apps. Tiếng Việt: "Lift state up" = chuyển state lên ancestor chung — pattern cơ bản để share state giữa components mà không cần global store.
- **Prop drilling** occurs when props are passed through many intermediate components that do not use them, just to reach a deeply nested child. It hurts maintainability but is not inherently wrong — for 2-3 levels it is acceptable; beyond that, Context or composition should be considered. Tiếng Việt: Prop drilling 2-3 cấp là acceptable — khi sâu hơn thì xem xét Context hoặc component composition.
- `useState` setter accepts either a value or an **updater function** `(prevState) => newState`. Always use the updater form when new state depends on old state to avoid stale closure bugs, especially inside async callbacks or event handlers. Tiếng Việt: Luôn dùng updater function `(prev) => ...` khi state mới phụ thuộc state cũ — tránh stale closure trong async.
- Props are **read-only** inside the receiving component. Mutating `props` directly is undefined behavior — React does not prevent it but it will cause bugs because the mutation bypasses React's rendering system. Tiếng Việt: Không được mutate `props` trực tiếp — dùng local state hoặc callback để thay đổi giá trị.
- `children` is a special prop that receives whatever is placed between the component's opening and closing tags. It can be any valid React node: string, element, array, or a function (render props pattern). Tiếng Việt: `children` là prop đặc biệt nhận nội dung giữa opening/closing tag — có thể là element, string, hoặc function (render props).
- **Derived state** should be computed from existing state/props during render rather than stored in separate `useState`. Storing derived state requires manual synchronization via `useEffect` and creates sources of inconsistency. Tiếng Việt: Đừng store derived state trong `useState` — tính toán inline trong render hoặc dùng `useMemo` để tránh inconsistency.
- State updates in React 18 are automatically batched even inside `setTimeout`, Promises, and native event handlers. Before React 18, only event handlers were batched. Use `flushSync` to opt out of batching when you need immediate DOM reads. Tiếng Việt: React 18 batch tất cả updates kể cả trong async — trước React 18 chỉ batch trong synthetic event handlers.

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
- A **controlled input** has its value driven by React state (`value={state}` + `onChange={setState}`). React owns the source of truth. A key benefit: you can validate, transform, or mask input on every keystroke. Tiếng Việt: Controlled input: React là source of truth — validate/transform input real-time trên mỗi keystroke.
- An **uncontrolled input** stores its value in the DOM. You access the value via a `ref` using `ref.current.value`. This is simpler for read-once scenarios like a form submission, but harder to do real-time validation. Tiếng Việt: Uncontrolled input: DOM là source of truth — đọc giá trị qua ref khi submit, phù hợp form đơn giản.
- Mixing controlled and uncontrolled on the same input causes a React warning and unpredictable behavior. Switching from uncontrolled to controlled (changing `value` from `undefined` to a string) also triggers a warning. Tiếng Việt: Đừng mix controlled/uncontrolled trên cùng một input — đổi `value` từ `undefined` sang string sẽ báo lỗi.
- **`defaultValue`** sets the initial DOM value for an uncontrolled input without making it controlled. After mount, changes to `defaultValue` have no effect — the DOM retains whatever the user typed. Tiếng Việt: `defaultValue` chỉ set giá trị ban đầu — sau đó React không theo dõi input nữa.
- For complex forms with many fields, **React Hook Form** (uncontrolled) significantly outperforms controlled state because it does not trigger re-renders on every keystroke — it subscribes to the DOM directly. Tiếng Việt: React Hook Form dùng uncontrolled inputs nên không re-render mỗi keystroke — nhanh hơn nhiều cho form phức tạp.
- File inputs (`<input type="file">`) are **always uncontrolled** — you cannot set `value` programmatically for security reasons. To clear a file input, reset the form element directly via a ref. Tiếng Việt: `<input type="file">` luôn là uncontrolled — không thể set `value` vì lý do bảo mật, phải clear qua ref.
- The `onChange` event in React fires on every character change (equivalent to native `input` event), not just on blur like the native HTML `change` event. This is an intentional difference that makes React forms more predictable. Tiếng Việt: React `onChange` fires mỗi ký tự, không phải chỉ khi blur như HTML thuần — dễ nhầm khi so sánh với native DOM.
- For textarea, `<textarea value={val} onChange={...}>` is controlled. In HTML, textarea content goes between tags, but in React the `value` prop is used — treating textarea like an input element is consistent with the controlled pattern. Tiếng Việt: React `<textarea>` dùng `value` prop thay vì content giữa tags — nhất quán với pattern controlled input.

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

### Q1: What does JSX compile to, and why does React 17+ no longer need `import React`? 🟢 Junior

**A:** JSX compiles to `React.createElement(type, props, ...children)` calls. In React 17+, Babel/TypeScript use the new JSX transform which imports `jsx()` from `react/jsx-runtime` automatically, so you no longer need to import React in every file that uses JSX.

Tiếng Việt: JSX là syntactic sugar biên dịch thành function calls. Từ React 17, transform mới tự import helper từ `react/jsx-runtime` nên không cần `import React` nữa — đây là lý do dự án mới không thấy import React ở đầu file.

### Q2: What is the Virtual DOM and why is it not always faster than direct DOM manipulation? 🟡 Mid

**A:** The Virtual DOM is an in-memory JavaScript object tree that React uses to represent the UI. After a state change, React builds a new virtual tree and diffs it against the previous one (reconciliation), then applies only the minimal real DOM mutations. However, this diffing overhead means Virtual DOM is not always faster than direct DOM manipulation — frameworks like Svelte compile templates to direct DOM updates and often outperform React on simple scenarios. React's real value is in developer ergonomics and predictable declarative rendering for complex, dynamic UIs.

Tiếng Việt: Virtual DOM không phải lúc nào cũng nhanh hơn DOM trực tiếp — Svelte không dùng VDOM và thường nhanh hơn. Giá trị của VDOM là giúp lập trình viên viết code declarative mà không cần quản lý DOM thủ công.

---

### Q3: Explain React's reconciliation algorithm — what are its two key heuristics? 🔴 Senior

**A:** React's reconciliation uses two heuristics to achieve O(n) complexity: (1) **Elements of different types produce entirely different trees** — React destroys the old subtree and builds a new one rather than trying to transform it. (2) **Keys provide stable identity** — elements with the same key at the same level are treated as the same instance across renders, enabling efficient reordering without remounting.

Tiếng Việt: Hai heuristic của reconciliation: (1) khác `type` = destroy và rebuild toàn bộ subtree; (2) `key` giống nhau = giữ nguyên instance. Nhờ đó thuật toán chạy O(n) thay vì O(n³) lý thuyết.

### Q4: What problem does the Fiber architecture solve that the original stack reconciler had? 🟡 Mid

**A:** The original stack reconciler processed the component tree recursively and synchronously — once started, it could not be paused or interrupted. This meant a large re-render could block the main thread for tens of milliseconds, causing dropped frames. Fiber solves this by representing each component as a fiber node in a linked list. Work can be paused between fiber nodes, allowing React to yield to higher-priority tasks like user input and resume later.

Tiếng Việt: Stack reconciler cũ là đệ quy đồng bộ — không thể dừng giữa chừng, gây block main thread. Fiber thay bằng linked list có thể dừng/tiếp tục, cho phép React yield cho user input và tiếp tục render sau.

---

### Q5: What is the difference between `useEffect` and `useLayoutEffect`? When would you use each? 🟡 Mid

**A:** Both run after React commits to the DOM. `useLayoutEffect` fires **synchronously before the browser paints** — use it when you need to read or mutate the DOM to prevent a visual flash (e.g., measuring an element's height to position a tooltip). `useEffect` fires **after the browser paints** — use it for data fetching, subscriptions, and effects that do not affect the visual layout. `useLayoutEffect` does not run on the server and emits a warning in SSR contexts.

Tiếng Việt: `useLayoutEffect` chạy trước khi browser vẽ — dùng khi cần đo/điều chỉnh DOM để tránh flash. `useEffect` chạy sau khi vẽ — dùng cho fetch, subscription. `useLayoutEffect` không chạy trên server.

---

### Q6: Why is using array index as a `key` dangerous in React lists? 🟢 Junior

**A:** When list items can be reordered, inserted, or deleted, using the index as key causes React to match items by position rather than identity. After inserting an item at index 0, every item shifts index, so React incorrectly keeps the old state of index 0 (old first item) and passes it new props (new first item's data). This causes bugs like form inputs showing wrong values or animations playing on the wrong items.

Tiếng Việt: Dùng index làm key khi list thay đổi thứ tự sẽ khiến React giữ state cũ cho item ở sai vị trí — input hoặc animation sẽ hiển thị ở item sai. Luôn dùng ID ổn định từ data (ví dụ database ID).

---

### Q7: How does React StrictMode help prevent production bugs? 🟡 Mid

**A:** StrictMode in React 18 double-mounts every component (mount → unmount → remount) and double-invokes render functions and state initializers to surface two categories of bugs: (1) Effects that do not properly clean up, revealed when the second mount finds a previous connection/subscription still open; (2) Side effects inside pure functions (render, memo, reducer), revealed when they produce different results on the second invocation. StrictMode has zero production cost.

Tiếng Việt: StrictMode mount/unmount/remount và invoke render 2 lần để lộ: (1) effects không cleanup đúng; (2) side effects trong pure functions. Không ảnh hưởng production build.

---

### Q8: What are React Portals and what problem do they solve with events? 🟡 Mid

**A:** `ReactDOM.createPortal(children, domNode)` renders children into a DOM node outside the component's DOM hierarchy, solving stacking context and `overflow: hidden` problems for modals and tooltips. The key nuance: events still bubble through the **React component tree**, not the DOM tree. So a click inside a portal will bubble up through its React ancestors, even though those ancestors are DOM siblings or parents of a completely different node.

Tiếng Việt: Portal render ra ngoài DOM tree nhưng events bubble theo React tree — click trong portal sẽ bubble lên React ancestors. Đây là gotcha quan trọng: `onClick` ở React parent sẽ nhận event từ portal con.

---

### Q9: What is the difference between controlled and uncontrolled form inputs? When is each appropriate? 🟢 Junior

**A:** A **controlled input** has its value driven by React state (`value` + `onChange`). React is the source of truth, enabling real-time validation and formatting. An **uncontrolled input** stores its value in the DOM, accessed via `ref.current.value`. Uncontrolled inputs are simpler for read-once scenarios and avoid re-renders on every keystroke — React Hook Form uses this pattern for performance. File inputs (`<input type="file">`) are always uncontrolled for security reasons.

Tiếng Việt: Controlled: React quản lý, re-render mỗi keystroke, dễ validate. Uncontrolled: DOM quản lý, đọc qua ref, ít re-render. React Hook Form dùng uncontrolled — đây là lý do nó nhanh hơn Formik cho form phức tạp.

---

### Q10: How does `React.memo` differ from `useMemo`, and when should you use each? 🟡 Mid

**A:** `React.memo` is a higher-order component that wraps a component and skips re-rendering if props have not shallowly changed. `useMemo` is a hook that memoizes the result of a computation inside a component's render. Use `React.memo` when a child component is expensive to render and its parent renders frequently with unchanged child props. Use `useMemo` when a specific calculation inside a component (like sorting a large array) is expensive and its inputs rarely change. Both have memory overhead and add code complexity — only apply them where profiling confirms a bottleneck.

Tiếng Việt: `React.memo` bọc component để skip re-render khi props không đổi. `useMemo` memoize giá trị tính toán bên trong render. Cả hai đều có overhead — chỉ dùng khi profiler xác nhận đây là bottleneck.

### Q11: What is "prop drilling" and what are the trade-offs of using Context to solve it? 🔴 Senior

**A:** Prop drilling is passing props through intermediate components that do not use them, just to reach a deeply nested child. Context solves this by making a value available to any consumer in the subtree without explicit prop passing. However, every consumer re-renders when the context value object changes reference — even if the consumer only reads one field. For high-frequency updates, use `useMemo` to stabilize the context value, split contexts by update frequency, or reach for an external store like Zustand.

Tiếng Việt: Context giải quyết prop drilling nhưng gây re-render tất cả consumers khi value thay đổi reference. Với data thay đổi nhanh, nên split context theo tần suất update hoặc dùng external store.

### Q12: What happens when you call `setState` inside a `useEffect` with no dependency that depends on that state? 🔴 Senior

**A:** If `useEffect` has no dependency array (`useEffect(() => setState(...))`) it runs after every render, and calling `setState` triggers a new render, creating an infinite loop. If it has `[]` but the setState call sets to the same value, React bails out (no re-render). If the effect has a dependency `[value]` and only calls setState when a condition changes, it is correct but the pattern often indicates derived state should be computed inline instead.

Tiếng Việt: `useEffect` không có dependency + setState = vòng lặp vô tận. Phần lớn trường hợp này là anti-pattern — derived state nên tính toán inline trong render, không lưu vào state riêng.

---

### Q12b: How does automatic batching in React 18 differ from React 17? 🟡 Mid

**A:** In React 17, batching only applied to state updates inside React synthetic event handlers. Updates inside `setTimeout`, Promises, or native DOM event listeners triggered separate re-renders. In React 18, all state updates are automatically batched regardless of where they originate, reducing unnecessary re-renders. To opt out of batching (e.g., to read an updated DOM value immediately), use `flushSync`.

Tiếng Việt: React 17 chỉ batch trong synthetic event handlers. React 18 batch tất cả updates kể cả trong `setTimeout` và Promises. Dùng `flushSync` khi cần đọc DOM ngay sau update.

### Q14: How would you implement a feature flag that renders different components without causing state resets? 🔴 Senior

**A:** Use the same component `type` with conditional props rather than switching component types. If you render `{flag ? <ComponentA /> : <ComponentB />}`, React destroys ComponentA and mounts ComponentB when the flag flips because the types differ. To preserve state across feature flags for the same conceptual component, render a single component that accepts a prop for the variant, or use a stable wrapper that keeps the component mounted with CSS visibility toggling.

Tiếng Việt: Đổi component type sẽ unmount hoàn toàn — để giữ state khi toggle feature flag, dùng cùng component với variant prop, hoặc dùng CSS `display:none` thay vì conditional rendering.

### Q15: Why do function components "capture" props and state at render time, and how does this cause stale closure bugs? 🔴 Senior

**A:** Each render creates a new function closure that captures the specific props/state values from that render. An async callback or `useEffect` closure created during render will "remember" those values — even if state has since changed. This contrasts with class components which always read `this.state`/`this.props` at call time. The fix is using a `useRef` to hold the latest value, or using the functional updater form of `setState` to avoid capturing stale state.

Tiếng Việt: Mỗi render tạo closure mới capture props/state tại thời điểm đó — async callback sau này vẫn dùng giá trị cũ (stale closure). Fix bằng `useRef` để giữ latest value, hoặc dùng functional updater `setState(prev => ...)`.

### Q16: What does `key={someId}` do on a component that is NOT in a list? 🟡 Mid

**A:** Using `key` on a standalone component is a technique to **force a full remount** when the key changes. For example, `<UserProfile key={userId} userId={userId} />` will completely unmount and remount the `UserProfile` component whenever `userId` changes, resetting all local state. This is often cleaner than writing reset logic in `useEffect` and is a documented React pattern called "keyed components."

Tiếng Việt: `key` trên component đơn lẻ buộc remount khi key đổi — hữu ích để reset hoàn toàn state khi data context thay đổi (ví dụ chuyển sang profile user khác). Sạch hơn việc reset state thủ công trong useEffect.

### Q17: What is the `children` prop and what are the differences between passing children as a prop vs. as JSX content? 🟢 Junior

**A:** `children` is a special built-in prop that receives whatever is placed between a component's opening and closing tags. It can be any valid React node: string, element, array, or a function (render props pattern). You can also pass it explicitly as `<Component children={<Foo />} />`, which is equivalent. The advantage of JSX slot syntax is readability for nested content; explicit `children` prop is useful when passing a function (render prop) or when programmatically constructing the value.

Tiếng Việt: `children` nhận nội dung giữa opening/closing tag — có thể là string, element, hoặc function. Dùng cú pháp JSX slot cho nội dung lồng nhau dễ đọc; dùng prop tường minh khi truyền function (render props pattern).

### Q18: Why should you avoid creating React components inside render functions (or inside other components)? 🟡 Mid

**A:** Defining a component function inside another component's render means a **new function reference** is created on every render. React sees this as a different component type on each render (because object identity changed), so it unmounts the old instance and mounts a new one, destroying all local state. The fix is to always define component functions at the module's top level, outside any render function.

Tiếng Việt: Định nghĩa component bên trong render tạo function reference mới mỗi lần — React unmount và remount vì thấy type khác nhau. Luôn định nghĩa component ở module top-level, ngoài mọi render function.

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

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích JSX transpile thành gì và tại sao `React.createElement` cần không?
- [ ] Tôi có thể vẽ Virtual DOM reconciliation flow từ state change → re-render → diff → commit không?
- [ ] Tôi có thể giải thích tại sao `key` prop quan trọng trong list rendering không?
- [ ] Tôi có thể giải thích sự khác biệt giữa function component và class component không?
- [ ] Tôi có thể giải thích Fiber architecture và tại sao nó enable concurrent features không?

💬 **Feynman Prompt:** Giải thích Virtual DOM cho một junior developer đang hỏi "tại sao không update DOM trực tiếp cho nhanh?" React làm gì để render nhanh hơn?

---

## Connections / Liên Kết

- ⬅️ **Built on:** [JavaScript Closures](../01-javascript/03-closures.md) | [Event Loop](../01-javascript/06-event-loop-async.md) — React hooks dùng closures; async rendering dùng event loop
- ➡️ **Enables:** [Hooks Deep Dive](./03-hooks-deep-dive.md) | [React Patterns](./08-react-patterns-advanced.md) | [Next.js](../04-nextjs/00-nextjs-fundamentals.md)
- 🔗 **Mental model:** `UI = f(state)` — master concept này, mọi React behavior đều giải thích được
