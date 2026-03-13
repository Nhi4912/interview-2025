# Hooks Comprehensive / Tổng Hợp Hooks
## React - Chapter 7

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Hooks Deep Dive](./03-hooks-deep-dive.md) | [React Patterns](./08-react-patterns-advanced.md) | [Performance](./09-performance-optimization.md)

[← Previous](./06-testing.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./08-react-patterns-advanced.md)

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [Hooks Taxonomy](#hooks-taxonomy)
2. [Custom Hook Library Architecture](#custom-hook-library-architecture)
3. [Hook Composition Patterns](#hook-composition-patterns)
4. [Testing Hooks](#testing-hooks)
5. [Hooks vs Class Lifecycle Mapping](#hooks-vs-class-lifecycle-mapping)
6. [useTransition](#usetransition)
7. [useDeferredValue](#usedeferredvalue)
8. [useId and Accessibility](#useid-and-accessibility)
9. [useSyncExternalStore](#usesyncexternalstore)
10. [useInsertionEffect and Styling](#useinsertioneffect-and-styling)
11. [Performance Patterns with Hooks](#performance-patterns-with-hooks)
12. [Migration Strategy and Team Conventions](#migration-strategy-and-team-conventions)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## Hooks Taxonomy

### Giải thích / Explanation

**English:** Group hooks by state, effects, refs, memoization, and concurrency concerns.

**Tiếng Việt:** Phân loại hook theo state, effect, ref, memo và concurrency.

### Key Points / Ý Chính
- **State hooks** (`useState`, `useReducer`): quản lý dữ liệu local. `useReducer` phù hợp khi state transitions phức tạp hoặc phụ thuộc vào previous state — giúp test dễ hơn vì reducer là pure function.
- **Effect hooks** (`useEffect`, `useLayoutEffect`, `useInsertionEffect`): xử lý side effects theo thứ tự ưu tiên khác nhau. `useLayoutEffect` chạy đồng bộ sau DOM mutation nhưng trước paint — dùng cho DOM measurement. `useInsertionEffect` chạy trước cả layout effect, chỉ dành cho CSS-in-JS libraries.
- **Ref hooks** (`useRef`, `useImperativeHandle`): giữ mutable value qua các lần render mà không trigger re-render. Phân biệt rõ: ref cho DOM node vs ref cho instance variable (timer ID, previous value).
- **Memoization hooks** (`useMemo`, `useCallback`): tránh recompute hoặc tạo lại function reference. Trade-off: mỗi memo có cost bộ nhớ riêng — chỉ dùng khi profiler xác nhận bottleneck, không memo mặc định mọi thứ.
- **Concurrency hooks** (`useTransition`, `useDeferredValue`): đánh dấu update thấp ưu tiên để React có thể interrupt. Đây là nhóm hook mới từ React 18 — interviewer thường hỏi để đánh giá mức cập nhật kiến thức.
- **Identity hooks** (`useId`): sinh deterministic ID cho SSR hydration. Không dùng cho list keys — chỉ cho HTML attribute pairing (label/input, aria-describedby).
- **External store hooks** (`useSyncExternalStore`): bridge giữa React và non-React state (Redux store, browser API). Giải quyết tearing bug trong concurrent rendering mà `useEffect` + `useState` subscription pattern không handle được.
- **Rules of Hooks**: chỉ gọi ở top level, chỉ gọi trong React function component hoặc custom hook. Lý do kỹ thuật: React dựa vào call order (linked list) để map hook với state — vi phạm sẽ gây state mismatch giữa các lần render.

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

## Custom Hook Library Architecture

### Giải thích / Explanation

**English:** Design hook APIs with clear inputs, outputs, and cancellation semantics.

**Tiếng Việt:** Thiết kế API hook với input/output rõ ràng và semantics hủy tác vụ.

### Key Points / Ý Chính
- **Naming convention `use*` is mandatory**: React's linter relies on the `use` prefix to enforce Rules of Hooks inside custom hooks. A function named `fetchUser` that calls `useState` will not be checked by the linter. Tiếng Việt: tiền tố `use` không chỉ là convention — ESLint plugin dùng nó để phát hiện vi phạm Rules of Hooks.
- **Return a stable object or tuple**: returning `{ data, error, loading }` as a plain object created inline causes consumer components to re-render even when values haven't changed. Prefer returning a tuple `[data, { error, loading }]` or memoizing the object with `useMemo`. Tiếng Việt: object trả về tạo mới mỗi lần render sẽ phá vỡ memoization ở consumer.
- **Cancellation semantics must be explicit**: async hooks should accept an `AbortController` signal or use a local `cancelled` flag in `useEffect` cleanup. Without this, a component that unmounts mid-flight will still call `setState` and trigger React's "Can't perform state update on unmounted component" warning. Tiếng Việt: mọi hook async cần cleanup để tránh set state trên component đã unmount.
- **Parameterize at the call site, not inside**: a hook that hard-codes a URL cannot be reused. Accept all configurable values as arguments so consumers control behavior. Corollary: memoize config objects passed as arguments with `useMemo` at the call site, otherwise the hook re-runs on every render. Tiếng Việt: thiết kế hook nhận tham số từ bên ngoài thay vì hard-code để dễ tái sử dụng và test.
- **Expose imperative handles sparingly**: if a hook needs to expose a `refresh()` or `cancel()` method, return it as part of the result tuple. Avoid `useImperativeHandle` unless you are building a component library — it breaks the unidirectional data flow that makes hooks predictable. Tiếng Việt: phương thức imperative như `refresh()` nên trả về từ hook thay vì dùng `useImperativeHandle` ngoài trường hợp component library.
- **Dependency arrays are a contract**: document which arguments are stable vs. reactive. For example, `useEventListener` should accept a stable callback (wrapped in `useCallback` by the consumer) — the hook's README or JSDoc should state this invariant explicitly. Tiếng Việt: ghi rõ trong JSDoc của hook những tham số nào cần ổn định (dùng `useCallback`/`useMemo`) để đảm bảo đúng dependency array.
- **Composition over monolithic hooks**: a `useUserProfile` hook that fetches, caches, and formats data is hard to test. Decompose into `useFetch` → `useUserData` → `useFormattedUser`, each testable in isolation. Tiếng Việt: hook nhỏ, đơn trách nhiệm dễ test và tái sử dụng hơn hook làm nhiều việc cùng lúc.
- **Version and deprecate public hooks**: in a shared hook library, treat hooks like APIs. Use semver, add deprecation warnings via `console.error` in development, and provide a migration path when signatures change. Tiếng Việt: hook dùng chung trong monorepo cần versioning và deprecation notice giống như public API.

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

## Hook Composition Patterns

### Giải thích / Explanation

**English:** Compose hooks as layered abstractions while preserving debuggability.

**Tiếng Việt:** Kết hợp hook theo tầng trừu tượng nhưng vẫn dễ debug.

### Key Points / Ý Chính
- **Bottom-up composition**: build primitive hooks first (`useAsync`, `useDebounce`, `useLocalStorage`), then compose them into domain hooks (`useProductSearch = useDebounce + useAsync + useLocalStorage`). This mirrors the single-responsibility principle and makes each layer independently testable. Tiếng Việt: xây hook nguyên thủy trước, sau đó kết hợp thành hook domain — giống như xếp LEGO.
- **Avoid prop-drilling by co-locating state**: when two sibling components share state, lifting it to a parent and threading it as props creates coupling. Instead, extract a custom hook and call it from both components — they share logic but maintain independent state instances. Tiếng Việt: custom hook tái dụng logic, không tái dụng state — mỗi component gọi hook có state riêng.
- **Stale closure is the #1 gotcha**: when a composed hook closes over a callback from an outer scope, that callback captures the value at the time of the closure. Use `useRef` to hold the latest version of a callback and call `ref.current()` inside effects to avoid stale closures. Tiếng Việt: stale closure xảy ra khi callback bên trong effect tham chiếu giá trị cũ — dùng `useRef` để giữ version mới nhất.
- **Flatten dependency chains**: if hook A calls hook B which calls hook C, and C triggers a state update, A and B both re-execute. Profile with React DevTools to detect unexpected render cascades caused by deeply nested hook composition. Tiếng Việt: chuỗi hook lồng sâu có thể gây render cascade — cần profiling để phát hiện sớm.
- **Extract context bridges**: when many components need the same derived value, create a context provider that calls hooks internally and exposes the result via context. Consumers read from context with `useContext` instead of calling expensive hooks multiple times. Tiếng Việt: khi nhiều component dùng cùng logic, bọc trong Context Provider để tránh gọi hook nặng nhiều lần.
- **Use `useReducer` for multi-step state machines**: composed hooks often track multiple related states (loading, error, data, page). Using three separate `useState` calls risks tearing — one update may render before another completes. `useReducer` keeps related state transitions atomic. Tiếng Việt: `useReducer` đảm bảo các state liên quan được cập nhật đồng thời, tránh render trung gian không nhất quán.
- **Guard against concurrent renders in composed hooks**: in React 18 Strict Mode, effects run twice in development. Composed hooks must be idempotent — subscribing to a WebSocket twice must not create duplicate connections. Use cleanup functions and idempotent setup logic. Tiếng Việt: Strict Mode React 18 chạy effect 2 lần khi dev — hook phải idempotent, cleanup phải hoàn toàn dọn dẹp.
- **Document the "contracts" between layers**: each hook in a composition chain should have JSDoc specifying which arguments must be stable references and which can be primitive values. Violating this causes spurious re-runs. Tiếng Việt: ghi rõ contract về tính ổn định của tham số trong JSDoc để người dùng hook biết cách truyền đúng.

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

## Testing Hooks

### Giải thích / Explanation

**English:** Test hooks through behavior and observable contracts, not implementation details.

**Tiếng Việt:** Kiểm thử hook qua hành vi và contract quan sát được, không bám chi tiết cài đặt.

### Key Points / Ý Chính
- **`renderHook` from Testing Library is the standard**: `@testing-library/react` exports `renderHook` which mounts a minimal host component to run the hook. Do NOT create a fake component manually — `renderHook` gives you a `result.current` reference and `rerender` function. Tiếng Việt: dùng `renderHook` thay vì tự tạo component giả — API chuẩn hơn và cung cấp `rerender`, `unmount`.
- **Wrap state-updating calls in `act()`**: any call that triggers a state update inside a hook (including async effects) must be wrapped in `act(() => {...})`. Forgetting `act` causes React to warn and tests to read stale state. Tiếng Việt: mọi thao tác cập nhật state trong test phải bọc trong `act()` để React flush updates trước khi assertion.
- **Test the contract, not the internals**: assert on what the hook returns and what side effects it produces, not on internal `useState` variables or `useRef` values. If a refactor changes internals but keeps the contract the same, tests should still pass. Tiếng Việt: test contract của hook (output, side effects), không test chi tiết cài đặt bên trong.
- **Mock timers for `useDebounce` and `usePolling`**: hooks that use `setTimeout`/`setInterval` need fake timers (`jest.useFakeTimers()`, `vi.useFakeTimers()`). Call `jest.runAllTimers()` to advance time synchronously without actually waiting. Tiếng Việt: dùng fake timers để kiểm soát thời gian trong test hook có debounce/polling — không cần `await sleep()`.
- **Mock fetch/network with `msw` or `vi.fn()`**: for hooks that call APIs, mock at the network boundary (with Mock Service Worker) rather than mocking the `fetch` global directly. MSW intercepts at the service worker level, making mocks transparent to the hook implementation. Tiếng Việt: dùng `msw` để mock API ở tầng network — hook không cần biết đang bị test.
- **Test cleanup and unmount**: verify that subscriptions are removed, timers are cleared, and `AbortController.abort()` is called when the hook unmounts. Call `unmount()` from `renderHook` result and assert no pending state updates or memory leaks. Tiếng Việt: test cả trường hợp unmount để đảm bảo cleanup function hoạt động đúng và không có memory leak.
- **Async hooks need `waitFor`**: for hooks that fetch data asynchronously, use `await waitFor(() => expect(result.current.data).toBeDefined())` instead of asserting immediately. `waitFor` polls until the assertion passes or times out. Tiếng Việt: dùng `waitFor` cho hook async thay vì assert ngay sau trigger — đảm bảo đợi đủ cho state cập nhật.
- **Isolate external dependencies with custom `wrapper`**: hooks that use Context (like theme, auth) need the context provider passed as `wrapper` option in `renderHook`. This avoids polluting global test state. Tiếng Việt: truyền Context Provider qua option `wrapper` của `renderHook` để test hook phụ thuộc context mà không ảnh hưởng test khác.

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

## Hooks vs Class Lifecycle Mapping

### Giải thích / Explanation

**English:** Map mount/update/unmount semantics to modern hook boundaries.

**Tiếng Việt:** Ánh xạ mount/update/unmount sang ranh giới hook hiện đại.

### Key Points / Ý Chính
- **`componentDidMount` → `useEffect(fn, [])` (with a caveat)**: the empty dependency array runs the effect after the first render, approximating `componentDidMount`. But in React 18 Strict Mode (development), the effect runs twice to simulate remounting — `componentDidMount` ran only once. This difference is intentional: it surfaces cleanup bugs. Tiếng Việt: `useEffect(fn, [])` tương đương `componentDidMount` nhưng React 18 Strict Mode chạy 2 lần để kiểm tra cleanup.
- **`componentDidUpdate` → `useEffect(fn, [dep])`**: specifying dependencies restricts the effect to run only when those values change, which is more granular than `componentDidUpdate`'s single execution after every update. Forgetting a dependency is a bug; over-specifying causes unnecessary re-runs. Tiếng Việt: `useEffect` với dependency array linh hoạt hơn `componentDidUpdate` — có thể lọc chính xác khi nào effect chạy.
- **`componentWillUnmount` → cleanup function in `useEffect`**: the function returned from `useEffect` runs before the component unmounts AND before the effect re-runs due to dependency changes. `componentWillUnmount` only ran on final unmount — hooks cleanup runs more frequently. Tiếng Việt: cleanup trong `useEffect` chạy trước mỗi lần effect re-run, không chỉ khi unmount — cẩn thận với side effects tốn kém.
- **`getDerivedStateFromProps` → compute during render**: instead of a lifecycle method, derive state directly during the render function using `useMemo` or inline computation. Avoid syncing props to state via `useEffect` — it causes an extra render. Tiếng Việt: thay `getDerivedStateFromProps`, tính toán giá trị derived trực tiếp trong render với `useMemo` để tránh render thừa.
- **`shouldComponentUpdate` → `React.memo` + stable props**: class components could fine-tune re-render with `shouldComponentUpdate`; functional components use `React.memo` (shallow comparison) combined with stable prop references via `useMemo`/`useCallback`. Tiếng Việt: `React.memo` thay thế `shouldComponentUpdate` nhưng cần đảm bảo props là stable reference, không phải object/array tạo inline.
- **`getSnapshotBeforeUpdate` → `useLayoutEffect` + ref**: to capture a scroll position before a DOM update (e.g., chat auto-scroll), read from a `ref` in a `useLayoutEffect` that runs synchronously after render before the browser paints. There is no direct hook equivalent, but this pattern covers the same use case. Tiếng Việt: không có hook nào tương đương trực tiếp `getSnapshotBeforeUpdate` — dùng `useLayoutEffect` + `ref` để đọc DOM trước khi paint.
- **`componentDidCatch` + `getDerivedStateFromError` have NO hook equivalent**: Error Boundaries must still be class components. Wrap function components in a class-based `<ErrorBoundary>`. Libraries like `react-error-boundary` provide a hook-friendly wrapper. Tiếng Việt: Error Boundary vẫn phải là class component — đây là câu bẫy phổ biến trong phỏng vấn; dùng `react-error-boundary` để bọc function component.
- **The mental model shift**: class lifecycle methods organize code by **when** it runs (mount, update, unmount). Hooks organize code by **what** it does (subscription setup, timer management, etc.). This co-location of related logic is the primary benefit of hooks over class components. Tiếng Việt: hooks nhóm code theo chức năng thay vì theo thời điểm vòng đời — đây là lý do chính tại sao hook dễ bảo trì hơn class component.

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

## useTransition

### Giải thích / Explanation

**English:** Transitions mark non-urgent updates to keep interactions responsive.

**Tiếng Việt:** useTransition đánh dấu update không gấp để giữ UI mượt.

### Key Points / Ý Chính
- **`useTransition` returns `[isPending, startTransition]`**: wrap a state update inside `startTransition(fn)` to mark it as non-urgent. React can interrupt and discard this render if a higher-priority update (e.g., user typing) arrives. `isPending` is `true` while the transition is in progress. Tiếng Việt: update bên trong `startTransition` có thể bị React huỷ và làm lại nếu có update ưu tiên cao hơn đến.
- **Only works with concurrent features enabled**: `useTransition` requires React 18+ with a concurrent-enabled root (`createRoot`). Using it with a legacy `ReactDOM.render` root will behave synchronously with no benefit. Tiếng Việt: `useTransition` chỉ có tác dụng khi dùng `createRoot` (React 18+) — với `ReactDOM.render` cũ, nó là no-op.
- **The wrapped state update must be pure and synchronous**: the callback passed to `startTransition` must synchronously call `setState`. You cannot wrap a `fetch` call or `async` function directly. To show a pending state during a fetch, combine with `useDeferredValue` or manage loading state separately outside the transition. Tiếng Việt: callback trong `startTransition` phải gọi `setState` đồng bộ — không thể trực tiếp bọc async fetch.
- **Common use case: tab switching and navigation**: when clicking a tab renders an expensive component, wrap the active-tab state update in `startTransition`. The current tab stays visible (not blanked out) while React prepares the new tab's content. Tiếng Việt: dùng cho tab switching, pagination, route transition — giữ UI hiện tại hiển thị trong khi render UI mới.
- **`isPending` enables custom loading indicators without Suspense**: set the input's opacity or show a spinner using `isPending` instead of relying solely on Suspense fallbacks. This gives fine-grained control over the pending UI. Tiếng Việt: `isPending` cho phép custom loading UI mà không cần Suspense — ví dụ mờ danh sách cũ khi đang filter.
- **`startTransition` vs `setTimeout` workaround**: before React 18, developers used `setTimeout(() => setState(...), 0)` to defer non-urgent updates. `startTransition` is strictly better: it doesn't introduce artificial delay and React can still interrupt it, while `setTimeout` always causes at least one extra event loop cycle. Tiếng Việt: `startTransition` tốt hơn `setTimeout` vì không có độ trễ cố định và React vẫn có thể interrupt khi cần.
- **Does NOT prevent all re-renders**: transitions still cause a re-render — they just run at lower priority. If the component tree is very deep and heavy, even low-priority renders take time. Combine with `React.memo` and `useMemo` to reduce the work done during the transition render. Tiếng Việt: transition vẫn gây re-render, chỉ là ưu tiên thấp hơn — cần kết hợp `React.memo` để giảm work trong lúc render.
- **Interviewer signal**: being able to explain the difference between `useTransition` and `useDeferredValue` in terms of who controls the deferral (the updater vs. the receiver) demonstrates senior-level React 18 knowledge. Tiếng Việt: phân biệt `useTransition` (người gửi update kiểm soát) vs `useDeferredValue` (người nhận giá trị kiểm soát) là dấu hiệu hiểu concurrent rendering ở mức senior.

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

## useDeferredValue

### Giải thích / Explanation

**English:** Defer expensive derivations from urgent input updates.

**Tiếng Việt:** Trì hoãn tính toán nặng khỏi luồng update nhập liệu gấp.

### Key Points / Ý Chính
- **`useDeferredValue(value)` returns a lagging copy**: React renders the component with the current (urgent) value first, then re-renders with the deferred value when idle. During the deferred re-render, the component receives the stale value, allowing it to show the previous result rather than a loading state. Tiếng Việt: `useDeferredValue` trả về bản sao trễ của value — component render ngay với value cũ, sau đó re-render với value mới khi rảnh.
- **Use it on the receiver, not the updater**: `useDeferredValue` is placed in the component that consumes an expensive value, while `useTransition` is placed where the state update happens. If you don't control the state updater (e.g., a prop from a parent), use `useDeferredValue`. Tiếng Việt: khi không kiểm soát nguồn state (prop từ parent), dùng `useDeferredValue` ở consumer thay vì `useTransition` ở updater.
- **Combine with `memo` to avoid re-rendering expensive children**: wrap the expensive child in `React.memo`. When the deferred value is still the previous value, the memoized child skips re-rendering entirely. Only when the deferred value catches up does the child re-render. Tiếng Việt: kết hợp `useDeferredValue` với `React.memo` để child component không re-render cho đến khi value thực sự thay đổi.
- **Does not add artificial delay like `debounce`**: `useDeferredValue` defers to the next idle period — it could update in the same frame if the main thread is free, or skip multiple frames under heavy load. `debounce` always waits a fixed delay. Tiếng Việt: không giống debounce, `useDeferredValue` không có độ trễ cố định — cập nhật sớm nhất có thể khi main thread rảnh.
- **`isPending` detection via reference equality**: detect whether the deferred value is "stale" by comparing `deferredValue !== value`. Show a visual indicator (e.g., reduced opacity) when they differ. Tiếng Việt: kiểm tra `deferredValue !== value` để biết đang ở trạng thái stale và hiển thị visual indicator phù hợp.
- **Typical use case: search result lists**: the search input state updates urgently so the input field stays responsive. The deferred value drives the (expensive) result list rendering, preventing keystrokes from blocking. Tiếng Việt: search box là use case kinh điển — input cập nhật ngay, danh sách kết quả dùng deferred value để không block typing.
- **Not a replacement for server-side filtering**: `useDeferredValue` helps with client-side rendering cost. If the bottleneck is a slow API, you still need debounce or abort/retry logic. Tiếng Việt: `useDeferredValue` chỉ giải quyết vấn đề render client-side — với API chậm vẫn cần debounce hoặc AbortController.
- **Works with Suspense**: if the deferred render suspends (e.g., data not yet in cache), React shows the previous non-suspended content rather than the Suspense fallback, creating a smoother UX. Tiếng Việt: khi kết hợp với Suspense, React giữ nguyên nội dung cũ thay vì hiện loading fallback trong khi render deferred value.

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

## useId and Accessibility

### Giải thích / Explanation

**English:** Stable IDs are critical for SSR consistency and aria attributes.

**Tiếng Việt:** ID ổn định quan trọng cho SSR nhất quán và thuộc tính aria.

### Key Points / Ý Chính
- **Solves SSR hydration ID mismatch**: before `useId`, developers used `Math.random()` or a module-level counter for unique IDs. These are non-deterministic and cause hydration mismatches (client ID ≠ server ID), leading to React re-rendering the entire subtree. `useId` generates the same ID on both server and client. Tiếng Việt: vấn đề cốt lõi `useId` giải quyết là ID không khớp giữa SSR và hydration — dùng `Math.random()` hay counter module sẽ gây lỗi này.
- **Format: `":r0:"` — intentionally unusual**: the colon-prefixed format is chosen to avoid collision with CSS selectors and HTML id conventions. Do not strip or transform this prefix. Tiếng Việt: format ID có dấu `:` là cố ý để tránh trùng với CSS selector và HTML id thông thường — đừng transform nó.
- **Use for `htmlFor`/`id` pairing in forms**: the primary use case is linking `<label htmlFor={id}>` to `<input id={id}>`. Without a stable, unique id, screen readers cannot associate labels with inputs. Tiếng Việt: use case quan trọng nhất là nối `<label>` với `<input>` qua `htmlFor`/`id` — cần thiết để screen reader đọc đúng.
- **Use for `aria-describedby`, `aria-labelledby`**: when a tooltip or description element needs to reference an input by id, `useId` provides a stable reference that works across SSR. Tiếng Việt: dùng cho `aria-describedby` (tooltip, error message) và `aria-labelledby` — bất kỳ chỗ nào cần ID để nối phần tử ARIA.
- **Do NOT use for list `key` prop**: `useId` is not designed for generating keys for list items. Keys must be tied to the data identity (e.g., `item.id`), not the component instance. Using `useId` as a key would generate a new key on every render. Tiếng Việt: không dùng `useId` cho `key` trong list — key phải đến từ data, không từ component instance.
- **One call per component, create variants with suffix**: call `useId` once per component and suffix it for multiple related IDs (`${id}-label`, `${id}-description`). Calling `useId` multiple times in one component works but creates separate IDs — use suffixes for semantically related elements. Tiếng Việt: gọi `useId` một lần rồi tạo variant bằng cách thêm suffix (`${id}-label`, `${id}-hint`) để giữ liên kết ngữ nghĩa.
- **Available since React 18**: projects on React 17 must use a manual counter with SSR caveats. When upgrading to React 18, replace all manual ID patterns with `useId`. Tiếng Việt: `useId` là React 18+; dự án React 17 cần counter thủ công với cẩn thận về SSR — đây là một lý do để upgrade.
- **Works in both Client and Server Components (React 19/Next.js App Router)**: `useId` is safe to call in Server Components when using React's streaming SSR, since IDs are generated deterministically from the component's position in the tree. Tiếng Việt: trong Next.js App Router với React 19, `useId` an toàn trong Server Component vì ID được tạo deterministically từ vị trí trong component tree.

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

## useSyncExternalStore

### Giải thích / Explanation

**English:** Read external stores with tearing-safe semantics in concurrent rendering.

**Tiếng Việt:** Đọc external store với semantics an toàn tearing trong concurrent rendering.

### Key Points / Ý Chính
- **Solves the "tearing" problem in concurrent rendering**: in React 18's concurrent mode, React may render a component tree in multiple interrupted passes. If a non-React store (like Redux or Zustand) updates mid-render, some components could read the old value and others the new value — this is tearing. `useSyncExternalStore` guarantees a consistent snapshot across the entire render. Tiếng Việt: tearing xảy ra khi state thay đổi giữa chừng một lần render concurrent — `useSyncExternalStore` đảm bảo toàn bộ cây đọc cùng một snapshot.
- **API signature**: `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)`. `subscribe` must call its listener synchronously when the store changes. `getSnapshot` must return a referentially stable value when the store has not changed (otherwise React will loop). `getServerSnapshot` provides the initial server-rendered value. Tiếng Việt: `getSnapshot` phải trả về cùng một reference nếu data không đổi — trả về object mới mỗi lần sẽ gây infinite loop.
- **`getSnapshot` must be pure and synchronous**: React may call `getSnapshot` multiple times. Do not perform side effects or async operations inside it. Memoize the derived value if constructing a new object to maintain referential stability. Tiếng Việt: `getSnapshot` phải pure và đồng bộ — React gọi nó nhiều lần để kiểm tra tính nhất quán.
- **Replaces the `useEffect` + `useState` subscription pattern**: the old pattern (`useEffect` subscribes, `setState` on change) has a window between subscription setup and the first read where the store could change, causing a missed update. `useSyncExternalStore` eliminates this race condition. Tiếng Việt: pattern cũ dùng `useEffect` + `setState` có race condition giữa lúc subscribe và lúc đọc state đầu tiên — `useSyncExternalStore` loại bỏ khoảng gap này.
- **State management libraries use it internally**: Redux Toolkit, Zustand (from v4), and Jotai all use `useSyncExternalStore` internally to subscribe to their stores. Understanding this hook explains how these libraries remain tearing-free in concurrent React. Tiếng Việt: Redux, Zustand đều dùng hook này bên trong — hiểu nó giúp giải thích tại sao các thư viện này thread-safe với concurrent React.
- **Browser APIs as external stores**: `useSyncExternalStore` is also appropriate for browser APIs that hold state outside React: `window.matchMedia`, `navigator.onLine`, `history.state`. Wrap them with a custom hook that subscribes to the appropriate event listener. Tiếng Việt: dùng cho browser APIs như `matchMedia`, `navigator.onLine` — bất kỳ state nào nằm ngoài React cần subscribe qua hook này.
- **`getServerSnapshot` is required for SSR**: if omitted, the hook throws during server rendering. Provide a sensible default that matches the initial client state to avoid hydration mismatches. Tiếng Việt: thiếu `getServerSnapshot` sẽ throw lỗi khi SSR — cung cấp giá trị mặc định khớp với trạng thái client ban đầu.
- **Performance**: every store subscriber triggers a synchronous re-render. Use selectors to minimize subscribed slice: instead of subscribing to the entire store, derive a narrowly scoped value in `getSnapshot`. This pattern mirrors the `useSelector` optimization in Redux. Tiếng Việt: subscribe cả store sẽ re-render mỗi khi bất kỳ phần nào thay đổi — dùng selector trong `getSnapshot` để chỉ đăng ký phần cần thiết.

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

## useInsertionEffect and Styling

### Giải thích / Explanation

**English:** Insertion effects support CSS-in-JS ordering before layout effects.

**Tiếng Việt:** Insertion effect hỗ trợ thứ tự chèn style trước layout effect.

### Key Points / Ý Chính
- **Runs before all layout effects**: the execution order is `useInsertionEffect` → `useLayoutEffect` → `useEffect`. This ordering guarantees that CSS rules are injected into the DOM before any layout measurement occurs, preventing flash-of-unstyled-content in CSS-in-JS libraries. Tiếng Việt: thứ tự chạy: `useInsertionEffect` → `useLayoutEffect` → `useEffect` — CSS được chèn trước khi đo layout, tránh FOUC.
- **Designed exclusively for CSS-in-JS libraries**: this hook was added specifically for libraries like styled-components and Emotion. Application code should never call `useInsertionEffect` directly — use the library's API instead. Tiếng Việt: chỉ dành cho tác giả thư viện CSS-in-JS, không dùng trong code ứng dụng — đây là câu trả lời đúng khi phỏng vấn hỏi "khi nào dùng hook này".
- **Cannot read or write refs inside it**: `useInsertionEffect` runs before React has processed refs. Accessing `ref.current` inside it will return `null` or an outdated DOM node. Tiếng Việt: không thể truy cập `ref.current` bên trong `useInsertionEffect` — refs chưa được gán tại thời điểm này.
- **Cannot call `setState` inside it**: attempting to call `setState` inside `useInsertionEffect` throws an error. The hook is restricted to DOM style injection only. Tiếng Việt: gọi `setState` bên trong `useInsertionEffect` sẽ throw lỗi — hook này chỉ được dùng để chèn `<style>` vào DOM.
- **The problem it solves: style injection ordering**: CSS-in-JS libraries inject `<style>` tags dynamically. If injection happens in `useLayoutEffect`, a layout measurement in another component's `useLayoutEffect` may run before the styles are applied, causing incorrect dimensions. `useInsertionEffect` guarantees styles are present before any layout effect measures the DOM. Tiếng Việt: nếu inject style trong `useLayoutEffect`, measurement ở component khác có thể chạy trước khi style được áp dụng — `useInsertionEffect` đảm bảo style luôn có trước khi measure.
- **SSR considerations**: on the server, `useInsertionEffect` does not run (like all effects). CSS-in-JS libraries handle SSR by collecting styles during rendering (via renderToString or streaming) and injecting them into the HTML `<head>`. Tiếng Việt: effect không chạy trên server — thư viện CSS-in-JS xử lý SSR bằng cách thu thập styles trong quá trình render và inject vào HTML head.
- **Alternative: zero-runtime CSS-in-JS**: libraries like vanilla-extract, Panda CSS, and Tailwind CSS eliminate the need for runtime style injection entirely. They generate static CSS at build time, avoiding `useInsertionEffect` altogether and improving performance. Tiếng Việt: xu hướng hiện đại là zero-runtime CSS-in-JS (vanilla-extract, Panda CSS) hoặc Tailwind — không cần inject style lúc runtime nên không cần `useInsertionEffect`.

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

## Performance Patterns with Hooks

### Giải thích / Explanation

**English:** Stabilize inputs and isolate expensive work to avoid cascading renders.

**Tiếng Việt:** Ổn định input và cô lập tác vụ nặng để tránh render dây chuyền.

### Key Points / Ý Chính
- **Profile before optimizing**: use React DevTools Profiler to identify which components re-render and why. Premature memoization adds cognitive overhead and memory cost without measurable benefit. The rule: measure first, optimize second. Tiếng Việt: không memo mọi thứ theo phản xạ — dùng React DevTools Profiler để xác định bottleneck trước khi tối ưu.
- **`useMemo` for expensive computations only**: the memoization overhead itself (comparing dependencies) is negligible for simple values. Only use `useMemo` when the computation is measurably slow (e.g., sorting 10,000 items, running a regex on a large string). Tiếng Việt: `useMemo` chỉ xứng đáng khi computation thực sự nặng — sort mảng nhỏ hay tính tổng vài số không cần memo.
- **`useCallback` to stabilize function references**: when a callback is passed to a `React.memo`-wrapped child or included in a dependency array, wrapping it with `useCallback` prevents the child from re-rendering every time the parent renders. Without stable references, `React.memo` is ineffective. Tiếng Việt: `useCallback` ổn định reference của function — cần thiết khi truyền callback vào `React.memo` child hoặc dependency array của hook khác.
- **Avoid creating objects/arrays inline in JSX**: `<Child options={{ size: 'lg' }} />` creates a new object on every parent render, breaking `React.memo`. Either define the object outside the component or wrap it with `useMemo`. Tiếng Việt: object literal trong JSX là nguồn phổ biến nhất khiến `React.memo` không có tác dụng — hoist ra ngoài hoặc dùng `useMemo`.
- **State batching reduces redundant renders**: React 18 batches all `setState` calls by default, including those in async callbacks and event handlers outside React (e.g., `setTimeout`). In React 17, only React event handlers were batched. Understanding this prevents over-engineering with `useReducer` for simple multi-setState patterns. Tiếng Việt: React 18 batch tất cả `setState` kể cả trong setTimeout, Promise — ít cần dùng `useReducer` chỉ để tránh re-render trung gian hơn trước.
- **Context value instability is a common perf trap**: `<ThemeContext.Provider value={{ theme, setTheme }}>` creates a new object on every render, causing all consumers to re-render even when values haven't changed. Fix: memoize the context value with `useMemo`. Tiếng Việt: Context Provider với `value={{ ... }}` inline tạo object mới mỗi render — tất cả consumer sẽ re-render dù value không đổi; phải `useMemo`.
- **`useReducer` can replace multiple `useState` for co-located transitions**: when several state pieces change together (loading + data + error), a single `dispatch` is atomic. This avoids the "intermediate invalid state" problem where `loading: false` and `data: null` briefly coexist. Tiếng Việt: `useReducer` đảm bảo state transitions atomic — tránh trạng thái trung gian không hợp lệ khi cập nhật nhiều state liên quan cùng lúc.
- **`useRef` for non-reactive values**: store timer IDs, previous values, and DOM measurements in a `ref` rather than state. Updating a ref does not trigger a re-render, making it suitable for values needed by effects but not by the UI. Tiếng Việt: `useRef` cho giá trị không ảnh hưởng UI (timer ID, previous value, DOM measurement) — thay đổi ref không gây re-render.

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

## Migration Strategy and Team Conventions

### Giải thích / Explanation

**English:** Adopt lint rules and review checklists for consistent hook usage.

**Tiếng Việt:** Áp dụng lint rule và checklist review để dùng hook nhất quán.

### Key Points / Ý Chính
- **Migrate incrementally, not big-bang**: class and function components can coexist in the same tree. Start with leaf components (no children, no complex lifecycle) and work up. Rewriting a large class component before understanding hooks patterns leads to subtle bugs. Tiếng Việt: class component và function component có thể cùng tồn tại — bắt đầu migrate từ leaf component nhỏ, không rewrite toàn bộ cùng lúc.
- **Enable `eslint-plugin-react-hooks` from day one**: the `rules-of-hooks` and `exhaustive-deps` rules catch the majority of hook bugs at author time. Set both to `error` (not `warn`) to enforce compliance. Tiếng Việt: bật `eslint-plugin-react-hooks` với mức `error` ngay từ đầu — `exhaustive-deps` phát hiện hầu hết lỗi stale closure trước khi code vào production.
- **Establish a naming convention for custom hooks**: prefixes like `use` (required), folders like `hooks/` or `src/hooks/`, and suffixes like `useX` for domain hooks vs `useXStore` for context-backed hooks. Document the convention in a team wiki. Tiếng Việt: thống nhất cấu trúc tên hook trong team (ví dụ: `useData` cho fetch, `useStore` cho context) và ghi vào wiki để nhất quán.
- **Colocation principle**: keep custom hooks next to the component that primarily uses them. Only promote to a shared `hooks/` directory when reused by 3+ unrelated components. Premature abstraction creates hooks that carry unnecessary complexity. Tiếng Việt: để hook gần component dùng nó — chỉ chuyển vào shared folder khi đã dùng ở 3+ component không liên quan nhau.
- **Document side effects explicitly**: a hook's README or JSDoc should state: what it subscribes to, what it may throw, what cleanup it performs, and which arguments must be stable references. This prevents misuse by team members unfamiliar with the implementation. Tiếng Việt: JSDoc của mỗi hook phải nêu rõ: side effect nào, cleanup gì, tham số nào phải stable — giúp đồng đội dùng đúng mà không cần đọc source.
- **Deprecation process for shared hooks**: add `@deprecated` JSDoc tag, emit `console.error` warning in development only (guard with `process.env.NODE_ENV !== 'production'`), provide a migration example in the docstring, and remove after an agreed grace period. Tiếng Việt: process deprecate hook dùng chung: thêm JSDoc `@deprecated`, cảnh báo dev-only, ví dụ migration, sau đó xoá sau grace period đã thống nhất.
- **Strict Mode as a team contract**: run development builds with `<React.StrictMode>` always enabled. Any hook that breaks under Strict Mode's double-invocation semantics has a real bug — fix it before it reaches production concurrent rendering. Tiếng Việt: `StrictMode` chạy effect hai lần trong dev để phát hiện cleanup bug — nếu hook bị lỗi trong Strict Mode, đó là bug thật, không phải false positive.
- **Use `@testing-library/react-hooks` patterns in PR reviews**: require tests that cover unmount cleanup, rapid re-renders (changing deps quickly), and concurrent mode scenarios for all new shared hooks. Tiếng Việt: yêu cầu test cho từng hook trong PR: ít nhất phải có test unmount cleanup và trường hợp thay đổi deps nhanh liên tiếp.

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

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What are the Rules of Hooks and why does React require them? / Tại sao React có Rules of Hooks? 🟢 Junior

**A:** There are two rules: (1) only call hooks at the top level — never inside loops, conditions, or nested functions; (2) only call hooks from React function components or custom hooks.

The reason is implementation: React tracks hook state using an ordered linked list (one node per `useState`, `useEffect`, etc. call). The position in that list is the only identifier React has for each hook's state. If you conditionally skip a hook on one render, every subsequent hook shifts down by one position, causing React to read the wrong state for each hook.

Vietnamese explanation: React dùng linked list theo thứ tự gọi để theo dõi state của mỗi hook — vi phạm thứ tự gọi sẽ khiến React đọc nhầm state. ESLint plugin `eslint-plugin-react-hooks` phát hiện vi phạm tự động.

---

### Q: What is a stale closure in a `useEffect` and how do you fix it? / Stale closure trong useEffect là gì? 🟡 Mid

**A:** A stale closure occurs when a `useEffect` callback closes over a variable (e.g., `count`) from the render at the time the effect was created, but the effect runs after subsequent renders where the variable has changed. The effect "sees" the old value because the closure was never updated.

**Fix options:**
1. Add the variable to the dependency array so the effect re-creates when it changes.
2. Use a `ref` to hold the latest value: `const latestCount = useRef(count); useEffect(() => { latestCount.current = count; })` — then read `latestCount.current` inside the effect.
3. Use the functional form of `setState`: `setCount(c => c + 1)` avoids reading `count` from the closure entirely.

Vietnamese explanation: stale closure xảy ra khi effect dùng giá trị cũ từ lần render trước. Thêm vào dependency array hoặc dùng `useRef` để giữ value mới nhất là hai cách fix phổ biến nhất.

---

### Q: What is the difference between `useTransition` and `useDeferredValue`? When do you use each? 🔴 Senior

**A:** Both defer non-urgent rendering, but they operate from different positions:

- **`useTransition`** is used by the *state updater*. You call `startTransition(() => setState(newValue))` where the state update happens. Use this when you control the state and want to mark a specific update as non-urgent (e.g., navigating between tabs, updating a filter).
- **`useDeferredValue`** is used by the *value consumer*. You call `const deferred = useDeferredValue(props.query)` in the component that renders an expensive list. Use this when you receive a value you don't control (e.g., a prop from a parent) and want to delay expensive child rendering.

Trade-off: both require `React.memo` on expensive children to be effective. Without memoization, React still re-renders the child on every render cycle.

Vietnamese explanation: `useTransition` đặt ở nguồn update (chỗ `setState`), `useDeferredValue` đặt ở nơi nhận value (thường là component render nặng). Khi không kiểm soát nguồn state, chỉ có thể dùng `useDeferredValue`.

---

### Q: How does `useSyncExternalStore` prevent tearing, and when should you use it over `useEffect + useState`? 🔴 Senior

**A:** In concurrent rendering, React may pause and resume rendering. If an external store (Redux, Zustand, browser API) updates between these pauses, some components may render with the old value and others with the new value — this inconsistency is called "tearing".

`useSyncExternalStore(subscribe, getSnapshot)` prevents tearing by:
1. Taking a synchronous `getSnapshot` that React calls multiple times to verify consistency.
2. If `getSnapshot` returns a different value between invocations during the same render pass, React synchronously re-renders to resolve the inconsistency.

The `useEffect + useState` pattern has a race condition: between mounting and the effect running, the store may have already changed, causing a missed update. `useSyncExternalStore` eliminates this window.

**When to use**: any non-React state that components need to subscribe to — Redux store, Zustand store, `window.matchMedia`, `navigator.onLine`, browser history.

Vietnamese explanation: `useEffect + useState` có race condition giữa mount và subscribe — `useSyncExternalStore` subscribe ngay từ đầu và đảm bảo consistency. Redux, Zustand đều dùng hook này bên trong từ React 18.

---

### Q: How do you design a custom `useFetch` hook that handles race conditions and cleanup? 🟡 Mid

**A:** A production-grade `useFetch` must handle three problems: (1) unmounting mid-request, (2) rapid input changes causing stale responses, (3) errors.

Key implementation points:
- Use `AbortController` to cancel the in-flight `fetch` in the cleanup function.
- Track a `cancelled` flag as an additional guard for non-`fetch` async work.
- Store `{ data, error, loading }` state, ideally with `useReducer` to prevent intermediate invalid states.
- The hook accepts a URL and an options object — the options object must be memoized at the call site or the effect will re-run on every render.

```tsx
useEffect(() => {
  const controller = new AbortController();
  setStatus({ loading: true, data: null, error: null });
  fetch(url, { signal: controller.signal })
    .then(r => r.json())
    .then(data => setStatus({ loading: false, data, error: null }))
    .catch(err => {
      if (err.name !== 'AbortError')
        setStatus({ loading: false, data: null, error: err });
    });
  return () => controller.abort();
}, [url]);
```

Vietnamese explanation: hai lỗi phổ biến nhất trong useFetch: (1) không cancel request khi unmount, (2) không cancel request cũ khi URL thay đổi nhanh. `AbortController` giải quyết cả hai.

---

### Q: Why is Error Boundary still a class component? What is the hooks equivalent? 🟡 Mid

**A:** Error Boundaries require two class lifecycle methods that have no hook equivalents: `getDerivedStateFromError` (to update state after an error is caught) and `componentDidCatch` (to log the error). React has not added hook alternatives because the semantics of catching render-phase errors require capturing the error during the rendering pass itself, which the current hooks architecture does not support.

The practical solution: use the `react-error-boundary` library, which provides a `<ErrorBoundary>` component and `useErrorBoundary()` hook that integrates with functional code.

Vietnamese explanation: không có hook nào thay thế Error Boundary — đây là câu bẫy phổ biến. Dùng `react-error-boundary` để bọc function component và dùng `useErrorBoundary` để trigger error boundary từ async code.

---

### Q: What is the execution order of `useInsertionEffect`, `useLayoutEffect`, and `useEffect`? Why does it matter? 🔴 Senior

**A:** The order is: **`useInsertionEffect`** → **`useLayoutEffect`** → **`useEffect`** — all run after the DOM has been committed.

- `useInsertionEffect`: runs synchronously before layout effects. Can only inject `<style>` tags — cannot read refs or call setState. Used only by CSS-in-JS library authors.
- `useLayoutEffect`: runs synchronously after DOM mutation, before the browser paints. Safe to read DOM measurements (e.g., scroll position, element dimensions). Mutations here are synchronous and block paint.
- `useEffect`: runs asynchronously after paint. Does not block the browser — suitable for subscriptions, fetching, and non-visual side effects.

Why it matters: if a `useLayoutEffect` measures an element's size but a CSS-in-JS library injects styles in `useLayoutEffect` too (incorrectly), the measurement could be wrong. `useInsertionEffect` guarantees styles are present before any layout measurement.

Vietnamese explanation: thứ tự ảnh hưởng đến tính chính xác của DOM measurement — `useInsertionEffect` đảm bảo style có trước khi measure, `useLayoutEffect` đảm bảo measure xong trước khi browser paint, `useEffect` chạy sau paint không block UI.

---

### Q: How does `useId` solve SSR hydration mismatches? 🟡 Mid

**A:** Before `useId`, developers used module-level counters (`let id = 0; const nextId = () => ++id`) or `Math.random()` to generate unique HTML `id` attributes. These approaches fail during SSR because:
- A module-level counter resets between server requests but is shared across components within a single render — the counter increments differently on server vs client if hydration happens in a different order.
- `Math.random()` is inherently non-deterministic.

`useId` generates IDs based on the component's position in the React component tree (using React's internal fiber tree traversal), which is identical on server and client given the same component structure. This guarantees that `<label htmlFor="r0:label">` on the server matches `<input id="r0:label">` during hydration.

**Important**: never use `useId` for list item `key` props — keys must come from data identity, not component position.

Vietnamese explanation: `useId` tạo ID từ vị trí trong component tree — giống nhau trên server và client nếu component tree giống nhau. Dùng cho `htmlFor`/`id`, `aria-describedby`, `aria-labelledby` — không dùng cho `key` prop của list.

---

### Q: What are the common pitfalls when migrating a class component with `componentDidUpdate` to hooks? 🟡 Mid

**A:** Three major pitfalls:

1. **Re-running on mount**: `useEffect(fn, [dep])` runs after the initial render AND after dep changes. `componentDidUpdate` does NOT run on mount. If your effect should skip the first render, track a `hasMounted` ref: `const mounted = useRef(false); useEffect(() => { if (!mounted.current) { mounted.current = true; return; } fn(); }, [dep])`.

2. **Object dependency identity**: if `dep` is an object or array, `useEffect` compares by reference. Creating the object inline (`useEffect(fn, [{ id }])`) causes the effect to run every render. `componentDidUpdate` compared by calling `prevProps.x !== this.props.x` explicitly.

3. **Forgetting cleanup**: `componentDidUpdate` cleaned up in `componentWillUnmount`. In hooks, cleanup belongs in the return function of the same `useEffect`. Forgetting to mirror the cleanup leads to memory leaks.

Vietnamese explanation: ba bẫy khi migrate: (1) effect chạy cả lần mount (dùng `useRef` guard), (2) object dependency luôn mới mỗi render, (3) quên cleanup — ba điểm này thường bị bỏ sót khi review PR.

---

### Q: How do you test a custom hook that uses `setTimeout` internally? 🟢 Junior

**A:** Use fake timers provided by the test framework (Jest or Vitest) to control time without actually waiting.

```ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('returns debounced value after delay', () => {
  const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
    initialProps: { val: 'a' },
  });
  expect(result.current).toBe('a');

  rerender({ val: 'b' });
  expect(result.current).toBe('a'); // still stale

  act(() => vi.advanceTimersByTime(300));
  expect(result.current).toBe('b'); // now updated
});
```

Key points: wrap timer advancement in `act()` so React flushes state updates before assertions. Use `renderHook` instead of mounting a full component to keep tests focused on hook logic.

Vietnamese explanation: dùng `vi.useFakeTimers()` để control thời gian, `act(() => vi.advanceTimersByTime(300))` để advance timer và flush React state update, sau đó mới assert kết quả.

---

[← Previous](./06-testing.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./08-react-patterns-advanced.md)



## Revision Checklist / Danh Sách Ôn Tập

- [ ] Can you name all 5 hook categories (state, effect, ref, memoization, concurrency) and give one hook from each?
- [ ] Can you explain why Rules of Hooks exist in terms of React's linked-list implementation?
- [ ] Can you describe what happens when you put a hook call inside an `if` statement and why it breaks?
- [ ] Can you explain the difference between `useEffect`, `useLayoutEffect`, and `useInsertionEffect` execution timing?
- [ ] Can you explain what stale closure is in a `useEffect`, give a concrete example, and show two ways to fix it?
- [ ] Can you explain when to use `useReducer` over multiple `useState` calls?
- [ ] Can you describe the `useTransition` API signature, what `isPending` means, and name a real use case?
- [ ] Can you explain the difference between `useTransition` and `useDeferredValue` in terms of who controls the deferral?
- [ ] Can you explain what "tearing" means in concurrent React and how `useSyncExternalStore` prevents it?
- [ ] Can you describe the three arguments to `useSyncExternalStore` and the constraint on `getSnapshot`?
- [ ] Can you explain why `useId` was introduced and why `Math.random()` causes SSR hydration mismatches?
- [ ] Can you list the correct use cases for `useId` (form label pairing, aria attributes) and incorrect uses (list keys)?
- [ ] Can you explain why Error Boundaries must still be class components and what library bridges this for functional code?
- [ ] Can you describe the lifecycle method equivalents for `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`, and `getSnapshotBeforeUpdate` in hooks?
- [ ] Can you explain the "double-invocation" behavior of `useEffect` in React 18 Strict Mode and why it is intentional?
- [ ] Can you describe what `useInsertionEffect` is for and why application code should never call it directly?
- [ ] Can you design a custom `useFetch` hook with cancellation, error handling, and loading state?
- [ ] Can you explain why `<Provider value={{ theme, setTheme }}>` inline is a performance bug and how to fix it?
- [ ] Can you explain when `useCallback` and `useMemo` are NOT worth using?
- [ ] Can you describe the recommended process for migrating a class component to hooks incrementally?






### Q41: Explain hook composition in React interviews — 🟡 [Mid]
**English:** A strong answer defines hook composition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa hook composition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q42: Explain testing hooks in React interviews — 🔴 [Senior]
**English:** A strong answer defines testing hooks, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa testing hooks, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q43: Explain custom hook library design in React interviews — 🟢 [Junior]
**English:** A strong answer defines custom hook library design, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa custom hook library design, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q44: Explain useTransition in React interviews — 🟡 [Mid]
**English:** A strong answer defines useTransition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useTransition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q45: Explain useDeferredValue in React interviews — 🔴 [Senior]
**English:** A strong answer defines useDeferredValue, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useDeferredValue, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q46: Explain lifecycle mapping in React interviews — 🟢 [Junior]
**English:** A strong answer defines lifecycle mapping, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa lifecycle mapping, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q47: Explain useSyncExternalStore in React interviews — 🟡 [Mid]
**English:** A strong answer defines useSyncExternalStore, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useSyncExternalStore, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q48: Explain performance isolation in React interviews — 🔴 [Senior]
**English:** A strong answer defines performance isolation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa performance isolation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q49: Explain dependency management in React interviews — 🟢 [Junior]
**English:** A strong answer defines dependency management, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa dependency management, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q50: Explain team conventions in React interviews — 🟡 [Mid]
**English:** A strong answer defines team conventions, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa team conventions, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q51: Explain hook composition in React interviews — 🔴 [Senior]
**English:** A strong answer defines hook composition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa hook composition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q52: Explain testing hooks in React interviews — 🟢 [Junior]
**English:** A strong answer defines testing hooks, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa testing hooks, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q53: Explain custom hook library design in React interviews — 🟡 [Mid]
**English:** A strong answer defines custom hook library design, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa custom hook library design, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q54: Explain useTransition in React interviews — 🔴 [Senior]
**English:** A strong answer defines useTransition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useTransition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q55: Explain useDeferredValue in React interviews — 🟢 [Junior]
**English:** A strong answer defines useDeferredValue, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useDeferredValue, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q56: Explain lifecycle mapping in React interviews — 🟡 [Mid]
**English:** A strong answer defines lifecycle mapping, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa lifecycle mapping, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q57: Explain useSyncExternalStore in React interviews — 🔴 [Senior]
**English:** A strong answer defines useSyncExternalStore, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useSyncExternalStore, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q58: Explain performance isolation in React interviews — 🟢 [Junior]
**English:** A strong answer defines performance isolation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa performance isolation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q59: Explain dependency management in React interviews — 🟡 [Mid]
**English:** A strong answer defines dependency management, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa dependency management, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q60: Explain team conventions in React interviews — 🔴 [Senior]
**English:** A strong answer defines team conventions, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa team conventions, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q61: Explain hook composition in React interviews — 🟢 [Junior]
**English:** A strong answer defines hook composition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa hook composition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q62: Explain testing hooks in React interviews — 🟡 [Mid]
**English:** A strong answer defines testing hooks, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa testing hooks, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q63: Explain custom hook library design in React interviews — 🔴 [Senior]
**English:** A strong answer defines custom hook library design, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa custom hook library design, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q64: Explain useTransition in React interviews — 🟢 [Junior]
**English:** A strong answer defines useTransition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useTransition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q65: Explain useDeferredValue in React interviews — 🟡 [Mid]
**English:** A strong answer defines useDeferredValue, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useDeferredValue, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q66: Explain lifecycle mapping in React interviews — 🔴 [Senior]
**English:** A strong answer defines lifecycle mapping, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa lifecycle mapping, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q67: Explain useSyncExternalStore in React interviews — 🟢 [Junior]
**English:** A strong answer defines useSyncExternalStore, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa useSyncExternalStore, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q68: Explain performance isolation in React interviews — 🟡 [Mid]
**English:** A strong answer defines performance isolation, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa performance isolation, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q69: Explain dependency management in React interviews — 🔴 [Senior]
**English:** A strong answer defines dependency management, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa dependency management, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q70: Explain team conventions in React interviews — 🟢 [Junior]
**English:** A strong answer defines team conventions, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa team conventions, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q71: Explain hook composition in React interviews — 🟡 [Mid]
**English:** A strong answer defines hook composition, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa hook composition, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
**Ví dụ:** Describe a bug you prevented by understanding render timing, stale closures, or key stability.

### Q72: Explain testing hooks in React interviews — 🔴 [Senior]
**English:** A strong answer defines testing hooks, gives a concrete scenario, and explains trade-offs in production.
**Tiếng Việt (Giải thích):** Câu trả lời tốt cần định nghĩa testing hooks, nêu tình huống cụ thể và phân tích đánh đổi khi chạy production.
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
