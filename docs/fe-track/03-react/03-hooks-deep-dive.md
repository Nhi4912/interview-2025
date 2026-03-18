# Hooks Deep Dive / Hooks Chuyên Sâu
## React - Chapter 3

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [React Fundamentals](./01-react-fundamentals.md) | [Hooks Comprehensive](./07-hooks-comprehensive.md) | [Performance](./09-performance-optimization.md)

[← Previous](./02-react-19-features.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-advanced-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Bạn có một component `UserProfile` fetch data từ API, track form state, và debounce search. Với class component: 3 lifecycle methods, `this` binding issues, logic khó tái sử dụng giữa các components.

Hooks giải quyết điều này bằng cách cho phép bạn "hook into" React features từ function components và tách logic thành custom hooks tái sử dụng.

**Câu hỏi phỏng vấn phổ biến nhất về hooks:** "Tại sao không được gọi hooks trong điều kiện hoặc loop?" — đây chính là câu hỏi kiểm tra bạn có hiểu hooks hoạt động như thế nào hay không.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng — Plugin hệ thống:**
React component giống như một cái điện thoại. Hooks là các plugin: `useState` là plugin bộ nhớ, `useEffect` là plugin side-effect scheduler, `useRef` là plugin trỏ trực tiếp vào hardware. Bạn có thể cắm nhiều plugin vào cùng một component, và thậm chí bundle chúng thành custom plugin (custom hooks).

**Tại sao hooks thay thế class components:**

| Class Components | Hooks | Tại sao Hooks tốt hơn |
|-----------------|-------|----------------------|
| `componentDidMount` + `componentDidUpdate` | `useEffect` | Gom cùng logic ở cùng chỗ |
| Khó chia sẻ stateful logic | Custom Hooks | Logic tái sử dụng dễ dàng |
| `this.state` + `this.setState` | `useState` | Đơn giản, predictable |
| `this` binding phức tạp | Arrow functions | Không cần `bind` |

**Rules of Hooks — và tại sao:**
React dùng một linked list (array thứ tự) để track state của hooks. Nếu bạn gọi hooks trong `if`/`loop`, thứ tự thay đổi theo render → React không biết hook nào tương ứng state nào → crash.

---

## Concept Map / Bản Đồ Khái Niệm

```
   [React Fundamentals]
   (JSX, Components, Props)
           │
           ▼
   [HOOKS DEEP DIVE]  ← bạn đang ở đây
           │
   ┌───────┼───────┐
   ▼       ▼       ▼
[State] [Effect] [Ref/Context]
useState  useEffect  useRef
useReducer useLayoutEffect useContext
           useInsertionEffect useMemo
                              useCallback
   │
   ▼
[Custom Hooks]
Extract stateful logic → reuse across components
useFetch | useDebounce | useLocalStorage
   │
   ▼
[React 18+ Hooks]
useTransition | useDeferredValue | useSyncExternalStore
```

---

## Tổng Quan / Overview

**English:** This chapter is rewritten in bilingual EN/VI format for interview preparation. It focuses on conceptual clarity, practical examples, and common interview traps.

**Tiếng Việt:** Chương này được viết lại theo định dạng song ngữ EN/VI để ôn luyện phỏng vấn. Nội dung tập trung vào hiểu bản chất, ví dụ thực tế và các bẫy thường gặp.

Xem thêm / Related: [01 React Fundamentals](./01-react-fundamentals.md), [03 Hooks Deep Dive](./03-hooks-deep-dive.md), [09 Performance](./09-performance-optimization.md).

## Table of Contents / Mục Lục
1. [useState Batching and Functional Updates](#usestate-batching-and-functional-updates)
2. [useEffect Dependencies and Cleanup](#useeffect-dependencies-and-cleanup)
3. [Stale Closures and Effect Events](#stale-closures-and-effect-events)
4. [useRef for DOM and Mutable Values](#useref-for-dom-and-mutable-values)
5. [useMemo and useCallback](#usememo-and-usecallback)
6. [useReducer for Complex State](#usereducer-for-complex-state)
7. [useContext and Rerender Boundaries](#usecontext-and-rerender-boundaries)
8. [useLayoutEffect Timing](#uselayouteffect-timing)
9. [useImperativeHandle](#useimperativehandle)
10. [Custom Hooks Design](#custom-hooks-design)
11. [Rules of Hooks Internals](#rules-of-hooks-internals)
12. [Debugging Hook Pitfalls](#debugging-hook-pitfalls)
13. [Câu Hỏi Phỏng Vấn / Interview Q&A](#câu-hỏi-phỏng-vấn--interview-qa)

---

## useState Batching and Functional Updates

### Giải thích / Explanation

**English:** Batched updates and updater functions prevent race conditions.

**Tiếng Việt:** Batch update và hàm updater giúp tránh race condition.

### Key Points / Ý Chính
- **Automatic batching (React 18+):** React batches all state updates inside event handlers, promises, timeouts, and native event handlers into a single re-render. Trước React 18, chỉ event handler của React mới được batch — giờ mọi context đều batch tự động.
- **Functional updater form `setCount(c => c + 1)`:** Always use when the next state depends on the previous state. Dùng dạng hàm khi state mới phụ thuộc state cũ, tránh bị stale closure.
- **Multiple `setState` calls in one handler produce one render:** Calling `setA()` then `setB()` in the same synchronous block triggers only one re-render. React enqueue cả hai rồi flush một lần duy nhất.
- **`flushSync` escapes batching:** Wrap a setState in `flushSync(() => setState(x))` to force immediate DOM update — useful for accessibility focus management. Chỉ dùng khi cần DOM cập nhật ngay (focus, scroll measurement).
- **Initializer function `useState(() => expensiveCalc())`:** The lazy initializer runs only on mount, not on every render. Dùng khi giá trị khởi tạo tốn chi phí tính toán (parse JSON, compute from props).
- **Object/array state requires immutable updates:** `setState({...prev, key: newVal})` — mutating the existing object won't trigger re-render because React uses `Object.is` comparison. Luôn tạo object mới, không mutate trực tiếp.
- **State updates are asynchronous within the render cycle:** Reading state immediately after `setState` returns the old value. Giá trị state chỉ thay đổi ở lần render tiếp theo, không phải ngay sau lệnh set.
- **Avoid derived state — compute during render instead:** If a value can be calculated from existing state/props, don't store it in `useState`. Tránh tạo state thừa — tính toán trực tiếp trong render để giảm bug đồng bộ.

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

## useEffect Dependencies and Cleanup

### Giải thích / Explanation

**English:** Effects synchronize with external systems and must clean up deterministically.

**Tiếng Việt:** Effect dùng để đồng bộ với hệ thống ngoài và cần cleanup rõ ràng.

### Key Points / Ý Chính
- **Effect runs after every render by default:** Without a dependency array, the effect fires after every commit. An empty array `[]` fires only on mount and cleans up on unmount. Tiếng Việt: Không có deps array thì effect chạy sau mỗi lần render; mảng rỗng chỉ chạy khi mount.
- **Cleanup function prevents memory leaks and stale updates:** The returned function runs before the next effect execution and on unmount — cancel fetch requests, clear timers, unsubscribe event listeners. Tiếng Việt: Hàm cleanup chạy trước effect lần sau và khi unmount — dùng để hủy fetch, clearTimeout, removeEventListener.
- **React Strict Mode double-invokes effects in development:** Mount → cleanup → mount cycle reveals effects that assume single execution. Every effect must be safe to run twice. Tiếng Việt: Strict Mode chạy effect hai lần trong dev để phát hiện side effect không thuần — mọi effect phải idempotent.
- **`exhaustive-deps` lint rule catches missing dependencies:** Omitting a dep that is used inside an effect causes stale closure bugs. Always include every reactive value used inside, or restructure to avoid it. Tiếng Việt: Quy tắc lint `exhaustive-deps` bắt thiếu dependency — luôn khai báo mọi giá trị reactive dùng bên trong.
- **Object/function identity instability triggers infinite loops:** If a dependency is an object or function created inline (e.g., `{ id }` or `() => fetch()`), it is a new reference every render, re-firing the effect on every render. Tiếng Việt: Object hoặc function tạo inline mỗi render có reference mới, gây effect vòng lặp vô tận — dùng useMemo/useCallback hoặc primitive deps.
- **Race condition in async effects:** Two rapid fetches can resolve out of order; use a `cancelled` flag or `AbortController` to ignore stale responses. Tiếng Việt: Hai fetch nhanh có thể resolve ngược thứ tự — dùng cờ `cancelled` hoặc AbortController để bỏ qua response cũ.
- **`useEffect` is not for data fetching in production-scale apps:** React docs recommend using a framework (Next.js, Remix) or a data-fetching library (React Query, SWR) instead of raw `useEffect` for fetch logic to avoid waterfalls and race conditions. Tiếng Việt: Trong ứng dụng thực tế nên dùng React Query/SWR thay vì fetch trực tiếp trong useEffect để tránh waterfall và race condition.
- **Effects do not run on the server (SSR):** `useEffect` is client-only; avoid putting critical initialization logic solely in effects if server rendering is required. Tiếng Việt: useEffect không chạy trên server — logic khởi tạo quan trọng không nên chỉ đặt trong effect nếu dùng SSR.

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

## Stale Closures and Effect Events

### Giải thích / Explanation

**English:** Closure snapshots can become stale; patterns must preserve latest values safely.

**Tiếng Việt:** Closure có thể bị stale; cần pattern để luôn lấy giá trị mới nhất an toàn.

### Key Points / Ý Chính
- **Stale closure definition:** A closure "closes over" the values of variables at the time it was created. If a `useEffect` callback captures `count` from render N, it still sees `count` from render N even when the effect runs later after render N+3. Tiếng Việt: Closure "đóng băng" giá trị tại thời điểm tạo — effect chạy sau vẫn thấy giá trị cũ của render trước.
- **Root cause: missing dependency array entries:** The most common cause is omitting a state or prop from the deps array to "avoid re-running" the effect, which silently locks in the old value. Tiếng Việt: Nguyên nhân phổ biến là cố tình bỏ dep để effect không chạy lại, nhưng vô tình khóa giá trị cũ.
- **`useRef` as escape hatch for latest-value reads:** Store the latest callback or value in a ref (`latestCallback.current = cb`) and read `latestCallback.current` inside an effect that has an empty deps array — the ref is mutable and does not trigger re-render. Tiếng Việt: Lưu giá trị mới nhất vào ref, đọc trong effect deps rỗng — ref mutable, không gây rerender.
- **React's `useEffectEvent` (experimental) solves this pattern officially:** The `useEffectEvent` hook extracts non-reactive logic out of an effect while keeping the effect's dependency list accurate — the extracted function always sees fresh values. Tiếng Việt: `useEffectEvent` (thực nghiệm) tách logic non-reactive ra khỏi effect, giúp deps list luôn đúng và hàm luôn thấy giá trị mới.
- **Event listeners are a classic stale-closure trap:** An `addEventListener` callback registered once on mount closes over the initial state. Updating state does not update the listener; fix by re-registering with the new value (add dep) or using a ref. Tiếng Việt: Listener đăng ký một lần khi mount đóng băng state ban đầu — cần dùng deps hoặc ref để lấy giá trị mới.
- **`setInterval` stale closure pattern:** `setInterval(() => setCount(count + 1), 1000)` increments from the initial `count` forever. Fix: `setCount(c => c + 1)` — the functional updater receives the latest state from React's queue, bypassing the closure. Tiếng Việt: setInterval đóng băng count ban đầu — dùng dạng hàm `setCount(c => c + 1)` để nhận giá trị mới nhất từ queue của React.
- **Stale closures in async callbacks:** An `async` function defined inside an effect captures render-time values. If the component re-renders before the async operation completes, the callback still uses old values. Use a ref or abort/cancel pattern. Tiếng Việt: Hàm async trong effect dùng giá trị tại thời điểm tạo — nếu component re-render trước khi xong, kết quả có thể dùng dữ liệu cũ.
- **Linting `exhaustive-deps` is your safety net:** The ESLint rule from `eslint-plugin-react-hooks` statically analyzes closure captures and warns when deps are missing or unnecessary — never suppress it without understanding the root cause. Tiếng Việt: Rule `exhaustive-deps` phân tích tĩnh và cảnh báo deps thiếu — không nên tắt cảnh báo mà không hiểu nguyên nhân.

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

## useRef for DOM and Mutable Values

### Giải thích / Explanation

**English:** Refs store mutable values across renders without triggering rerender.

**Tiếng Việt:** Ref lưu giá trị mutable qua nhiều render mà không gây rerender.

### Key Points / Ý Chính
- **`useRef` returns a plain object `{ current: initialValue }` that is stable across renders:** Unlike state, mutating `.current` does not schedule a re-render — it is just a mutable box React keeps alive for the component's lifetime. Tiếng Việt: useRef trả về object `{ current }` ổn định qua các render — thay đổi `.current` không gây rerender.
- **DOM ref pattern — attach to `ref` prop:** `const inputRef = useRef<HTMLInputElement>(null)` then `<input ref={inputRef} />`. Access the DOM node via `inputRef.current` inside effects or event handlers (not during render). Tiếng Việt: Gán ref vào prop `ref` của JSX element — truy cập DOM node qua `.current` trong effect hoặc event handler, không truy cập trong render.
- **Refs are initialized before effects, after render commit:** `ref.current` is populated by the time `useLayoutEffect` and `useEffect` run — safe to read the DOM node there. Tiếng Việt: `.current` được gán sau commit (trước effects) — an toàn đọc trong useLayoutEffect và useEffect.
- **Storing previous value across renders:** `const prevCount = useRef(count); useEffect(() => { prevCount.current = count; })` — the effect runs after render, so `prevCount.current` holds last render's value during the current render. Tiếng Việt: Dùng ref để lưu giá trị render trước — effect cập nhật ref sau render nên trong render hiện tại `.current` vẫn là giá trị cũ.
- **Storing interval/timeout IDs:** `const timerRef = useRef<ReturnType<typeof setInterval>>(null)` — lets cleanup functions cancel timers without the timer ID needing to be in state (which would cause unnecessary re-renders). Tiếng Việt: Lưu ID của timer vào ref thay vì state để cleanup mà không gây rerender thừa.
- **`useRef` vs `useState` decision:** Use state when the UI must reflect the value; use ref when you need to track something imperatively (timer ID, previous value, focus state) without triggering re-renders. Tiếng Việt: Dùng state khi UI cần phản ánh giá trị; dùng ref cho theo dõi imperative không cần render lại.
- **Callback ref pattern for dynamic elements:** Pass a function as `ref` to run code when the element is mounted/unmounted — useful when the element may not exist at the time `useEffect` runs. Tiếng Việt: Truyền hàm vào prop `ref` để chạy code khi element mount/unmount — dùng khi element có thể chưa tồn tại lúc useEffect chạy.
- **Forwarding refs with `forwardRef` / React 19 `ref` prop:** Library component authors use `forwardRef` (React <19) or the native `ref` prop (React 19+) to let parent components attach refs to inner DOM nodes — required for focus management and animation libraries. Tiếng Việt: `forwardRef` (React <19) hoặc prop `ref` (React 19+) cho phép cha gắn ref vào DOM node bên trong component con — cần thiết cho focus management.

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

## useMemo and useCallback

### Giải thích / Explanation

**English:** Memoization is a performance hint, not correctness logic.

**Tiếng Việt:** Memoization là gợi ý tối ưu hiệu năng, không phải logic đúng/sai.

### Key Points / Ý Chính
- **`useMemo` memoizes a computed value; `useCallback` memoizes a function reference:** `useMemo(() => compute(a, b), [a, b])` returns the cached result; `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`. Tiếng Việt: useMemo cache giá trị tính toán; useCallback cache tham chiếu hàm — useCallback thực ra là useMemo trả về hàm.
- **Referential equality is the core motivation:** React uses `Object.is` to compare deps. Without memoization, a new array `[]` or object `{}` created each render is always a new reference, breaking `React.memo` bailouts and causing child re-renders. Tiếng Việt: React dùng `Object.is` so sánh deps — không memo thì mỗi render tạo reference mới, phá vỡ React.memo bailout và gây rerender con.
- **`useCallback` stabilizes functions passed to memoized children or used in deps arrays:** If a child is wrapped in `React.memo` and receives a callback prop, `useCallback` prevents the child re-rendering when the parent renders but the callback logic has not changed. Tiếng Việt: useCallback ổn định hàm truyền cho child dùng React.memo — con không rerender nếu hàm không thực sự thay đổi.
- **Premature memoization has real costs:** `useMemo` and `useCallback` add memory overhead (storing the cached value and the deps array) plus the comparison cost on every render. Only apply when profiling confirms a bottleneck. Tiếng Việt: memo có chi phí bộ nhớ và so sánh deps mỗi render — chỉ áp dụng khi profiling xác nhận bottleneck, không memo "phòng ngừa".
- **`useMemo` does not guarantee cache persistence:** React may discard the cached value (e.g., during off-screen rendering or future concurrent optimizations). Use it as a performance hint, not as a correctness mechanism. Tiếng Việt: React có thể xóa cache của useMemo bất kỳ lúc nào — không dùng useMemo để đảm bảo tính đúng của logic, chỉ dùng cho tối ưu hiệu năng.
- **Common correct use case — expensive pure computation:** Sorting/filtering a large list, building a lookup map from an array, or running a complex geometric calculation. Wrap with `useMemo` so it only recomputes when the input data changes. Tiếng Việt: Dùng useMemo cho tính toán tốn kém và thuần túy — sort/filter danh sách lớn, tạo lookup map — chỉ tính lại khi data đầu vào thay đổi.
- **`useCallback` for stable event handlers in lists:** In a list of 1000 rows, each row's `onDelete` should be `useCallback`-stabilized so that `React.memo` rows do not all re-render when the parent state changes for unrelated reasons. Tiếng Việt: Trong list lớn, ổn định onDelete bằng useCallback để React.memo row không rerender khi state cha thay đổi vì lý do khác.
- **React Compiler (React 19+) automates memoization:** The experimental React Compiler analyzes components at build time and inserts memoization automatically — reducing the need for manual `useMemo`/`useCallback` in many cases. Tiếng Việt: React Compiler (React 19+) tự động chèn memo tại build time — giảm nhu cầu viết useMemo/useCallback thủ công.

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

## useReducer for Complex State

### Giải thích / Explanation

**English:** Reducers centralize transitions and make updates explicit.

**Tiếng Việt:** Reducer gom logic chuyển state, giúp cập nhật tường minh.

### Key Points / Ý Chính
- **`useReducer(reducer, initialState)` API:** Returns `[state, dispatch]`. The `reducer` function receives the current state and an action, returns the next state. React calls it synchronously and re-renders if the new state differs. Tiếng Việt: useReducer trả về `[state, dispatch]` — reducer nhận state hiện tại và action, trả về state mới; React rerender nếu state thay đổi.
- **Choose `useReducer` over `useState` when:** Multiple state fields change together in response to one event (e.g., `loading`, `data`, `error` for a fetch); or when the next state depends on complex logic over the previous state. Tiếng Việt: Dùng useReducer khi nhiều field state thay đổi cùng nhau theo một event, hoặc logic chuyển state phức tạp — tránh nhiều useState lẻ rời rạc.
- **`dispatch` is stable across renders:** Unlike inline setter functions, `dispatch` has a stable identity — safe to pass to child components without `useCallback`. Tiếng Việt: `dispatch` có identity ổn định qua các render — truyền cho component con mà không cần useCallback.
- **Reducer must be a pure function — no side effects:** The reducer should only compute and return the next state. Side effects (API calls, localStorage writes) belong in event handlers or effects, not inside the reducer. Tiếng Việt: Reducer phải là hàm thuần túy — không gọi API, không đọc/ghi localStorage bên trong; side effect thuộc về event handler hoặc useEffect.
- **Combining `useReducer` with `useContext` replaces Redux for many use cases:** `useReducer` provides the state machine; `useContext` distributes state and dispatch to the tree. This pattern covers ~80% of Redux use cases without external dependencies. Tiếng Việt: Kết hợp useReducer + useContext thay thế Redux cho nhiều trường hợp — useReducer là state machine, useContext phân phối state và dispatch cho cây component.
- **Lazy initialization via third argument:** `useReducer(reducer, heavyInit, initFn)` — `initFn(heavyInit)` runs only on mount, same as the lazy initializer in `useState(() => ...)`. Tiếng Việt: Tham số thứ ba của useReducer là hàm khởi tạo lười — chỉ chạy một lần khi mount, tương tự lazy init của useState.
- **Reducers are easily unit-tested in isolation:** Since a reducer is a pure function `(state, action) => state`, it can be tested with simple `expect(reducer(initState, action)).toEqual(expectedState)` without mounting any component. Tiếng Việt: Reducer là hàm thuần túy nên test độc lập rất dễ — không cần mount component, chỉ gọi hàm với input/output.
- **Action type naming convention — verb + noun:** `{ type: 'ITEMS_LOADED', payload: items }` or `{ type: 'items/loaded' }` (Redux-style). Consistent naming makes state transitions readable during debugging with Redux DevTools or React DevTools. Tiếng Việt: Đặt tên action theo động từ + danh từ — `ITEMS_LOADED`, `items/loaded` — giúp dễ đọc khi debug state transitions.

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

## useContext and Rerender Boundaries

### Giải thích / Explanation

**English:** Context is powerful but can cascade rerenders if values are unstable.

**Tiếng Việt:** Context mạnh nhưng dễ gây rerender dây chuyền nếu value không ổn định.

### Key Points / Ý Chính
- **`useContext(MyContext)` subscribes a component to the nearest provider:** Every component calling `useContext` re-renders whenever the context value changes — regardless of whether the consumed slice of value actually changed. Tiếng Việt: Mọi component dùng useContext sẽ rerender khi value context thay đổi — dù chỉ một phần nhỏ của value thay đổi.
- **Unstable object reference in provider value causes cascading rerenders:** `<MyCtx.Provider value={{ user, setUser }}>` creates a new object on every parent render, triggering all consumers to re-render. Fix: memoize the value with `useMemo`. Tiếng Việt: Truyền object literal vào `value` tạo reference mới mỗi render — bọc value bằng useMemo để tránh rerender không cần thiết ở consumer.
- **Split contexts by update frequency:** A single context mixing `theme` (rarely changes) and `notifications` (changes frequently) forces theme consumers to re-render on every notification update. Split into separate contexts. Tiếng Việt: Tách context theo tần suất thay đổi — không gộp dữ liệu ít đổi (theme) với dữ liệu đổi thường xuyên (notifications) vào cùng một context.
- **`React.memo` does NOT protect against context changes:** `memo` only bails out when props are shallowly equal. If a memoized component consumes a context, it still re-renders when that context value changes. Tiếng Việt: React.memo không chặn rerender do context thay đổi — chỉ chặn rerender do props; context vẫn bypass memo.
- **Context is not a substitute for caching server data:** Context stores client-side UI state efficiently. For server data with caching, invalidation, and background refresh needs, use React Query or SWR instead. Tiếng Việt: Context không phù hợp để cache dữ liệu server — dùng React Query/SWR cho data fetching có cache, invalidation, background refresh.
- **`useContextSelector` pattern (external library) for fine-grained subscriptions:** The `use-context-selector` library (or Zustand's `useStore`) lets components subscribe to specific fields in a context, re-rendering only when those fields change. Tiếng Việt: `use-context-selector` cho phép subscribe chỉ một phần của context — component chỉ rerender khi field đó thay đổi, tránh rerender thừa.
- **Default context value is used when there is no Provider ancestor:** If the component tree has no matching `Provider`, `useContext` returns the value passed to `createContext(defaultValue)`. Useful for testing components in isolation. Tiếng Việt: Khi không có Provider cha, useContext trả về giá trị default của createContext — tiện khi test component độc lập không cần wrap Provider.
- **Context vs prop drilling trade-off:** Prop drilling is explicit and traceable; context is implicit and can obscure data flow. Use context for truly cross-cutting concerns (auth, theme, locale) and prefer props for co-located component trees. Tiếng Việt: Prop drilling rõ ràng, dễ trace; context ẩn và khó theo dõi data flow — chỉ dùng context cho concern xuyên suốt app (auth, theme, locale).

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

## useLayoutEffect Timing

### Giải thích / Explanation

**English:** Layout effects run before paint and should be used sparingly.

**Tiếng Việt:** Layout effect chạy trước paint và chỉ nên dùng khi thật sự cần.

### Key Points / Ý Chính
- **Timing difference — `useLayoutEffect` runs synchronously after DOM mutations, before paint:** The browser has updated the DOM but has not yet painted to screen. `useEffect` runs asynchronously after paint. Tiếng Việt: useLayoutEffect chạy đồng bộ sau khi DOM cập nhật nhưng trước khi browser vẽ lên màn hình; useEffect chạy bất đồng bộ sau khi paint.
- **Use `useLayoutEffect` to read DOM layout and synchronously apply corrections:** Measuring an element's `getBoundingClientRect()` and immediately adjusting position or size avoids the one-frame visual flicker that would occur with `useEffect`. Tiếng Việt: Dùng useLayoutEffect để đọc kích thước DOM rồi điều chỉnh ngay — tránh flicker một frame so với dùng useEffect.
- **Canonical use cases:** Tooltip positioning, animated transitions that need initial measurements, synchronizing scroll position, and implementing portals that depend on DOM dimensions. Tiếng Việt: Dùng điển hình: định vị tooltip, đo kích thước trước animation, đồng bộ scroll position, portal phụ thuộc kích thước DOM.
- **`useLayoutEffect` blocks paint — keep it fast:** Any expensive computation inside a layout effect will delay the visual update and cause jank. If the work is not layout-critical, move it to `useEffect`. Tiếng Việt: useLayoutEffect chặn paint — chỉ làm việc cần thiết bên trong, nếu không cần đọc/ghi layout thì dùng useEffect để không block UI.
- **Server-side rendering warning:** `useLayoutEffect` does nothing on the server and triggers a React warning about SSR mismatch. Use the `useIsomorphicLayoutEffect` pattern (alias to `useEffect` on server, `useLayoutEffect` on client). Tiếng Việt: useLayoutEffect không chạy trên server và sinh cảnh báo SSR — dùng pattern `useIsomorphicLayoutEffect` để alias đúng hook theo môi trường.
- **`useLayoutEffect` cleanup also runs synchronously:** The cleanup function returned by `useLayoutEffect` runs synchronously before the next layout effect — ensuring DOM measurements are always consistent. Tiếng Việt: Cleanup của useLayoutEffect cũng chạy đồng bộ — DOM luôn nhất quán giữa các lần effect chạy.
- **Prefer CSS for layout adjustments when possible:** Many scenarios that seem to require `useLayoutEffect` (centering, responsive sizing) can be solved with CSS `transform`, `position: sticky`, or `resize observer` patterns — avoiding JavaScript layout reads entirely. Tiếng Việt: Nhiều trường hợp tưởng cần useLayoutEffect (căn giữa, responsive) có thể giải quyết bằng CSS — tránh đọc layout bằng JS khi CSS đã đủ.

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

## useImperativeHandle

### Giải thích / Explanation

**English:** Imperative handles expose controlled imperative APIs from child to parent.

**Tiếng Việt:** useImperativeHandle giúp expose API imperative có kiểm soát từ con lên cha.

### Key Points / Ý Chính
- **Purpose — expose a controlled imperative API from child to parent:** Instead of leaking the entire DOM node to the parent (which exposes too much), `useImperativeHandle` lets a component author define exactly which methods the parent can call. Tiếng Việt: useImperativeHandle cho phép component con định nghĩa chính xác API imperative nào expose cho cha — không leak toàn bộ DOM node.
- **Requires `forwardRef` (React <19) or the `ref` prop (React 19+):** The hook's first argument must be the forwarded ref. In React 19, components accept `ref` as a regular prop, removing the need for `forwardRef`. Tiếng Việt: Cần forwardRef (React <19) hoặc prop ref (React 19+) — React 19 bỏ forwardRef, ref trở thành prop thông thường.
- **Common use cases:** Custom `focus()` on a composite input, `play()`/`pause()` on a custom media component, `reset()` on a multi-step form, `scrollToItem(index)` on a virtualized list. Tiếng Việt: Dùng điển hình: `focus()` trên input tùy chỉnh, `play()`/`pause()` trên media component, `reset()` trên form nhiều bước.
- **The handle object is re-created when deps change:** The second argument (factory function) and third argument (deps array) follow the same memoization semantics as `useMemo` — the handle object is stable while deps are unchanged. Tiếng Việt: Handle object được tạo lại khi deps thay đổi — hoạt động giống useMemo, ổn định khi deps không đổi.
- **Prefer declarative state over imperative handles as default:** Using `useImperativeHandle` is a signal that an imperative pattern is necessary. For most interactions, lifting state or using event callbacks is cleaner. Only use this hook when declarative solutions are awkward (focus management, third-party integration). Tiếng Việt: Ưu tiên state declarative hơn imperative handle — chỉ dùng khi thực sự cần (focus management, tích hợp thư viện bên ngoài).
- **TypeScript typing — define an interface for the handle:** `const ref = useRef<VideoHandle>(null)` where `VideoHandle = { play: () => void; pause: () => void }`. This contracts the API between parent and child and catches misuse at compile time. Tiếng Việt: Khai báo interface cho handle trong TypeScript — `useRef<VideoHandle>(null)` — contract rõ ràng giữa cha và con, lỗi bị bắt lúc compile.
- **Do not read from the handle during render:** The ref's `.current` is `null` before mount and during the initial render. Only call handle methods inside event handlers or effects, never inline in JSX. Tiếng Việt: Không đọc handle trong render — `.current` là null trước mount; chỉ gọi method trong event handler hoặc effect.

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

## Custom Hooks Design

### Giải thích / Explanation

**English:** Custom hooks encapsulate reusable stateful logic with composable contracts.

**Tiếng Việt:** Custom hook đóng gói logic có state để tái sử dụng theo contract composition.

### Key Points / Ý Chính
- **Naming convention `use*` is mandatory for the lint rule:** The `eslint-plugin-react-hooks` rules-of-hooks checker only applies to functions whose names start with `use`. A custom hook named `fetchData` would not be checked for rules violations. Tiếng Việt: Đặt tên bắt đầu bằng `use` là bắt buộc để lint rule kiểm tra — hàm tên `fetchData` không bị kiểm tra rules of hooks.
- **Each call to a custom hook has independent state:** Calling `useCounter()` in two components gives each component its own `count` — state is not shared between callers, only the logic is shared. Tiếng Việt: Mỗi lần gọi custom hook tạo state độc lập — state không chia sẻ giữa các caller, chỉ logic được tái sử dụng.
- **Design principle — return what callers need, nothing more:** A `useLocalStorage` hook should return `[value, setValue]` (mirroring `useState`). Leaking internal implementation details forces callers to adapt to internals. Tiếng Việt: Trả về chỉ những gì caller cần — API tối giản, không leak implementation detail; tuân theo nguyên tắc least-surprise.
- **Custom hooks compose other hooks freely:** `useDebouncedSearch` might compose `useState`, `useEffect`, `useRef`, and `useCallback` — composability is the primary design advantage over HOCs and render props. Tiếng Việt: Custom hook tự do compose các hook khác — đây là ưu điểm chính so với HOC và render props, giúp tái sử dụng logic mà không thay đổi cây component.
- **Extract effects into hooks to improve testability and readability:** A component with five `useEffect` calls is hard to reason about. Extracting each concern into a named hook (`useSubscription`, `useAnalytics`) gives each effect a clear purpose and makes the component body readable. Tiếng Việt: Tách useEffect vào custom hook theo concern — `useSubscription`, `useAnalytics` — component body dễ đọc hơn, mỗi hook có mục đích rõ ràng.
- **Avoid over-abstracting too early:** A hook shared across only two call sites may not need abstraction. Extract when the pattern is proven stable across three or more independent usages. Tiếng Việt: Tránh tạo abstraction quá sớm — chỉ tách custom hook khi pattern đã xuất hiện ổn định ở ba nơi trở lên, không tái sử dụng một lần cũng hook.
- **Returning stable references matters:** If a custom hook returns functions or objects, memoize them (`useCallback`, `useMemo`) so callers relying on referential equality (e.g., `useEffect` deps, `React.memo` children) are not broken. Tiếng Việt: Hàm và object trả về từ custom hook nên được memo — caller có thể đưa vào deps array của effect hoặc truyền cho component memo, reference không ổn định gây bug.
- **Document the hook's contract:** Specify what arguments it accepts, what it returns, what side effects it has, and when cleanup occurs. Good hooks have a clear invariant that consumers can rely on without reading the implementation. Tiếng Việt: Document rõ contract của hook — input, output, side effect, khi cleanup — consumer không cần đọc implementation để dùng đúng.

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

## Rules of Hooks Internals

### Giải thích / Explanation

**English:** React relies on call order indexing; rules guarantee stable mapping.

**Tiếng Việt:** React dựa vào thứ tự gọi hook; rules đảm bảo ánh xạ ổn định.

### Key Points / Ý Chính
- **React identifies hooks by call order, not by name:** Internally React stores hook state in a linked list per fiber node. The Nth call to a hook in a component maps to the Nth slot in that list. This is why the order must never change between renders. Tiếng Việt: React nhận dạng hook theo thứ tự gọi — lưu trong linked list của fiber node. Thứ tự thay đổi giữa các render sẽ ánh xạ sai slot, gây bug.
- **Rule 1 — only call hooks at the top level:** Never put hooks inside `if`, `for`, `while`, or nested functions. Conditional logic must go inside the hook, not around it. Tiếng Việt: Luôn gọi hook ở top level — không đặt trong if/for/while; đặt điều kiện bên trong hook nếu cần.
- **Rule 2 — only call hooks from React function components or custom hooks:** Never call hooks from regular JavaScript functions, class component lifecycle methods, or outside a component tree. Tiếng Việt: Chỉ gọi hook từ function component hoặc custom hook — không gọi từ hàm JS thông thường, class component, hay ngoài component tree.
- **`eslint-plugin-react-hooks` enforces both rules statically:** The plugin traces the control flow of every component and reports violations before runtime. Integrate it into CI pipelines to catch rules violations early. Tiếng Việt: eslint-plugin-react-hooks phân tích tĩnh control flow và báo lỗi vi phạm trước runtime — tích hợp vào CI để bắt sớm.
- **Fiber reconciler maintains a "work-in-progress" hook list:** During reconciliation React walks the fiber's `memoizedState` linked list in parallel with the component's hook calls. A mismatch in count causes the "rendered more/fewer hooks than previous render" error. Tiếng Việt: Fiber lưu `memoizedState` là linked list — nếu số lần gọi hook thay đổi, React đọc sai slot và ném lỗi "rendered more/fewer hooks than previous render".
- **Hooks in conditionals break the linked list mapping:** Adding or removing a hook call inside an `if` block shifts all subsequent hook slots, corrupting their state. For example, slot 3 (which used to be `useRef`) now points to the data that belonged to `useState`. Tiếng Việt: Thêm/bỏ hook trong block if dịch chuyển tất cả slot phía sau — slot 3 trỏ vào data của hook khác, gây lỗi khó debug.
- **React DevTools visualizes the hook list per component:** In the Components panel, each component shows its hooks in order with their current values — useful for verifying that hook state maps to the intended call site. Tiếng Việt: React DevTools hiển thị danh sách hook theo thứ tự trong panel Components — dùng để xác minh hook state ánh xạ đúng call site.
- **Why not use a dictionary keyed by hook name?** Multiple calls to the same hook (e.g., `useState` called five times) need separate state slots. A name-keyed approach would merge them. Order-based indexing is the simplest mechanism that supports multiple calls of the same hook. Tiếng Việt: Dùng index thay vì tên vì cùng một hook có thể gọi nhiều lần — key theo tên sẽ gộp chung, index đảm bảo mỗi lần gọi có slot riêng.

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

## Debugging Hook Pitfalls

### Giải thích / Explanation

**English:** Trace dependencies, identities, and async cleanup to avoid hidden bugs.

**Tiếng Việt:** Theo dõi dependencies, identity và cleanup async để tránh bug ẩn.

### Key Points / Ý Chính
- **Infinite re-render loop — `useEffect` updates state it also depends on:** If `useEffect` sets state unconditionally and that state is in its deps array, every render triggers the effect which sets state which triggers a render. Fix: add a condition inside the effect, or restructure deps. Tiếng Việt: useEffect vô điều kiện set state mà state đó lại là dep — gây vòng lặp vô tận; thêm điều kiện bên trong effect hoặc cấu trúc lại deps.
- **"Cannot update a component while rendering a different component" error:** Calling `setState` of component A inside the render function of component B. Fix: move the setState call into a `useEffect` or an event handler. Tiếng Việt: Gọi setState của component A trong khi render component B — chuyển setState vào useEffect hoặc event handler để sửa.
- **`useEffect` not firing — object/function in deps array with new identity each render:** `useEffect(() => ..., [options])` where `options = { page: 1 }` is created every render will run after every render. Use primitive deps or memoize the object. Tiếng Việt: Effect chạy mỗi render vì object/function deps có reference mới mỗi lần — dùng primitive deps hoặc useMemo/useCallback để ổn định reference.
- **State setter called after unmount — "Can't perform a React state update on an unmounted component":** Usually caused by an async effect (fetch, setTimeout) completing after the component unmounts. Use a cleanup flag or AbortController to prevent the setState call. Tiếng Việt: setState gọi sau khi component unmount — dùng cờ `mounted` hoặc AbortController trong cleanup để hủy bỏ async callback.
- **`useMemo` returning a new reference despite same inputs — deps comparison with `Object.is`:** If a dep is `NaN`, `Object.is(NaN, NaN)` is `true` (memoizes correctly). But if a dep is an array `[]`, each render produces a new reference even if contents are equal — the memo recalculates every time. Tiếng Việt: Object.is dùng so sánh reference, không deep equal — mảng `[]` mới mỗi render sẽ làm useMemo tính lại dù nội dung giống.
- **Debugging stale closures — add `console.log` inside the effect to read closed-over values:** The logged value reveals which render's snapshot the effect captured. If it always logs the initial value, the dep array is missing that variable. Tiếng Việt: Debug stale closure bằng console.log bên trong effect — nếu luôn log giá trị ban đầu, dep array đang thiếu biến đó.
- **React DevTools "Highlight updates when components render" reveals unexpected re-renders:** Enable the setting in DevTools to see which components flash on each interaction — useful for diagnosing context consumer cascades and unstable reference issues. Tiếng Việt: Bật "Highlight updates" trong React DevTools để thấy component nào rerender khi tương tác — hữu ích để tìm cascade rerender từ context hoặc reference không ổn định.
- **`why-did-you-render` library instruments components to log avoidable renders:** It wraps `React.memo` and class components, logging when they re-render with props/state that are shallowly equal — pointing directly to referential identity bugs. Tiếng Việt: Thư viện `why-did-you-render` log khi component rerender với props/state shallowly equal — chỉ thẳng vào bug reference identity không cần debug thủ công.

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

### Q1: What is automatic batching in React 18 and how does it differ from React 17? 🟢 Junior

**A:** In React 18, all state updates inside event handlers, `setTimeout`, `Promise` callbacks, and native DOM event listeners are automatically batched into a single re-render. In React 17, only synthetic React event handlers were batched; updates inside `setTimeout` or `Promise.then` triggered one re-render per `setState` call.

Tiếng Việt: React 18 tự động batch mọi setState ở mọi ngữ cảnh thành một lần re-render. React 17 chỉ batch trong synthetic event handler — setTimeout hay Promise.then mỗi setState gây một lần render riêng. Muốn thoát khỏi batching, dùng `flushSync`.

### Q2: When should you use the functional updater form `setState(prev => ...)` instead of `setState(value)`? 🟢 Junior

**A:** Use the functional form whenever the next state depends on the previous state. If multiple `setState` calls are batched, `setState(count + 1)` called twice still only increments once because both calls close over the same stale `count`. `setState(c => c + 1)` called twice correctly increments twice because each call receives the queued result from the previous call.

Tiếng Việt: Dùng dạng hàm khi state mới phụ thuộc state cũ — đặc biệt trong async, batched updates, hay gọi nhiều lần liên tiếp. Dạng giá trị `setState(count + 1)` đóng băng `count` tại render hiện tại và dễ bị stale.

### Q3: Explain the cleanup function in `useEffect`. What goes wrong without it? 🟡 Mid

**A:** The cleanup function (returned from the effect) runs synchronously before the next effect execution and when the component unmounts. Without it: event listeners accumulate on every render, timers keep firing after unmount, and async callbacks call `setState` on unmounted components. The mental model is: setup when you enter a state, teardown when you leave.

Tiếng Việt: Cleanup chạy trước khi effect chạy lại và khi unmount. Thiếu cleanup: listener chồng chất mỗi render, timer tiếp tục sau unmount, async callback setState trên component đã unmount gây memory leak và warning.

### Q4: What are the three forms of the `useEffect` dependency array? 🟢 Junior

**A:** (1) Omitted — runs after every render. (2) Empty `[]` — runs once on mount, cleans up on unmount. (3) `[a, b]` — runs after any render where `a` or `b` changed via `Object.is` comparison. The dependency array is a description of what the effect synchronizes with, not a performance optimization knob.

Tiếng Việt: Ba dạng: không có — chạy mỗi render; `[]` — chỉ chạy khi mount; `[a, b]` — chạy khi a hoặc b thay đổi. Deps array mô tả effect đồng bộ với cái gì, không phải knob để kiểm soát số lần chạy bằng cách bỏ sót biến.

### Q5: What is a stale closure in React hooks and how do you fix it? 🟡 Mid

**A:** A stale closure captures variables from a render snapshot that is no longer current. Classic example: `setInterval(() => console.log(count), 1000)` inside a `useEffect` with empty deps always logs the initial `count` value. Fixes: (1) add `count` to deps, (2) use functional updater `setCount(c => c + 1)` to avoid reading `count` inside the interval, or (3) store the latest value in a ref and read `ref.current`.

Tiếng Việt: Closure đóng băng giá trị tại thời điểm tạo. setInterval trong useEffect deps `[]` luôn đọc count ban đầu. Sửa: thêm count vào deps, dùng functional updater, hoặc lưu vào ref và đọc `.current`.

### Q6: What are the two main use cases for `useRef`? How is it different from `useState`? 🟡 Mid

**A:** (1) DOM access: attach to a JSX `ref` prop to imperatively call `.focus()`, measure dimensions, or integrate with third-party DOM libraries. (2) Mutable instance variable: persist a value across renders without triggering a re-render — timer IDs, previous prop snapshots, or the "latest value" escape hatch. Unlike `useState`, mutating `.current` never schedules a re-render.

Tiếng Việt: Hai dùng chính: truy cập DOM node trực tiếp, và lưu giá trị mutable qua renders không cần rerender. Khác useState: `.current` mutable không trigger render — dùng khi UI không cần phản ánh giá trị đó.

### Q7: What is the difference between `useMemo` and `useCallback`? When should you use each? 🟡 Mid

**A:** `useMemo(() => compute(a, b), [a, b])` returns a memoized computed value. `useCallback(fn, deps)` returns a memoized function reference — it is equivalent to `useMemo(() => fn, deps)`. Use `useMemo` for expensive pure computations (sort, filter, build lookup map). Use `useCallback` to stabilize function references passed to `React.memo` children or used in dependency arrays of other hooks.

Tiếng Việt: useMemo cache giá trị tính toán; useCallback cache tham chiếu hàm. Dùng useMemo cho tính toán tốn kém; useCallback để ổn định hàm truyền cho child dùng React.memo hoặc đặt trong deps array của hook khác.

### Q8: When should you choose `useReducer` over `useState`? 🟡 Mid

**A:** Prefer `useReducer` when: (1) multiple state fields change together in response to a single event (e.g., `{ loading, data, error }` for a fetch), (2) the next state depends on complex logic over the previous state, or (3) you want state transitions to be explicit and easily unit-tested as a pure function. `useState` is preferable for isolated, independent simple values.

Tiếng Việt: Dùng useReducer khi nhiều field thay đổi cùng nhau theo một event, logic transition phức tạp, hoặc muốn test state machine dễ dàng. useState phù hợp cho giá trị đơn giản, độc lập.

### Q9: Why does `useContext` cause all consumers to re-render even when only part of the context value changed? How do you fix it? 🔴 Senior

**A:** `useContext` subscribes to the entire context value and re-renders whenever it changes via `Object.is`. If the provider passes an object literal `{ user, theme }`, every render of the provider creates a new reference, triggering all consumers. Fixes: (1) split into separate contexts by update frequency, (2) memoize the value with `useMemo`, (3) use an external library like `use-context-selector` for field-level subscriptions.

Tiếng Việt: useContext subscribe toàn bộ value — object literal mới mỗi render = tất cả consumer rerender. Sửa: tách context theo tần suất thay đổi, bọc value bằng useMemo, hoặc dùng `use-context-selector` để subscribe theo field.

### Q10: Explain the two rules of hooks and why they exist at the implementation level. 🟡 Mid

**A:** Rule 1: only call hooks at the top level (not inside conditionals, loops, or nested functions). Rule 2: only call hooks from React function components or custom hooks. Both rules exist because React stores hook state in a linked list indexed by call order per fiber node. Changing the number or order of calls between renders corrupts the index-to-slot mapping, causing state from one hook to be read by a different hook.

Tiếng Việt: React lưu hook state trong linked list theo thứ tự gọi của fiber. Nếu thứ tự thay đổi giữa renders, slot ánh xạ sai hook — state hook A bị đọc bởi hook B. Hai rules đảm bảo linked list luôn nhất quán giữa các lần render.

### Q11: What is `useLayoutEffect` and when should you use it over `useEffect`? 🔴 Senior

**A:** `useLayoutEffect` fires synchronously after all DOM mutations but before the browser paints. `useEffect` fires asynchronously after paint. Use `useLayoutEffect` when you need to read DOM layout (e.g., `getBoundingClientRect`) and synchronously apply a correction to prevent a visible flicker. For everything else use `useEffect` — layout effects block paint and cause jank if they contain heavy work.

Tiếng Việt: useLayoutEffect chạy đồng bộ sau DOM mutations, trước paint. Dùng khi cần đọc kích thước DOM rồi điều chỉnh ngay để tránh flicker. Mọi trường hợp khác dùng useEffect — layout effect chặn paint.

### Q12: How does `useImperativeHandle` work and when is it appropriate? 🔴 Senior

**A:** Used with `forwardRef` (React <19) or the `ref` prop (React 19+), `useImperativeHandle` lets a child component expose a controlled imperative API (e.g., `{ focus, reset }`) to its parent via a ref, instead of leaking the entire DOM node. Appropriate for: custom input focus management, media component `play()`/`pause()`, multi-step form `reset()`. The default should still be declarative state.

Tiếng Việt: useImperativeHandle cho phép component con định nghĩa chính xác API imperative nào expose cho cha qua ref — không leak toàn bộ DOM. Dùng cho focus management, media control, form reset. Mặc định vẫn nên dùng state declarative.

### Q13: How do you design a good custom hook? What makes a custom hook reusable? 🔴 Senior

**A:** A good custom hook: (1) starts with `use`, (2) has a minimal interface — returns only what callers need, hides internals, (3) each invocation has independent state, (4) returns stable references (memoized functions/objects) so callers can safely use them in deps arrays, (5) handles cleanup internally. Extract into a custom hook when the pattern appears in three or more independent call sites and the abstraction is stable.

Tiếng Việt: Custom hook tốt: tên bắt đầu `use`, API tối giản, mỗi call có state độc lập, trả về reference ổn định (useMemo/useCallback), tự cleanup. Chỉ extract khi pattern ổn định xuất hiện ở ít nhất 3 nơi khác nhau.

### Q14: Why can't you call hooks inside a `for` loop or conditional? What error does React throw? 🟢 Junior

**A:** React throws "Rendered more hooks than during the previous render" (or fewer hooks). If a condition changes between renders, the number of hook calls changes, shifting the linked list index. The hook at position N now reads state stored for what was previously a different hook — producing corrupted state and unpredictable behavior.

Tiếng Việt: React ném lỗi "Rendered more/fewer hooks than during the previous render". Điều kiện thay đổi giữa renders làm thay đổi số hook calls, dịch chuyển linked list index — hook tại vị trí N đọc state của hook khác, gây hỏng state.

### Q15: How does React Strict Mode interact with `useEffect`? Why does it matter? 🟡 Mid

**A:** In development, Strict Mode mounts the component, unmounts it, and remounts it — causing each `useEffect` to run twice (setup → cleanup → setup). This reveals effects that are not safe to run more than once (e.g., incrementing a global counter, subscribing without unsubscribing). Production behavior is single execution. If double-execution breaks your effect, your cleanup is likely incomplete.

Tiếng Việt: Strict Mode trong dev gây mount → cleanup → mount — mỗi useEffect chạy hai lần. Mục đích: phát hiện effect không idempotent hoặc cleanup không đầy đủ. Production chạy một lần. Effect bị vỡ khi chạy hai lần là dấu hiệu cleanup thiếu.

### Q16: What is the `useIsomorphicLayoutEffect` pattern and why is it needed? 🔴 Senior

**A:** `useLayoutEffect` logs a warning during SSR because it doesn't run on the server. The isomorphic pattern conditionally assigns the hook: `const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect`. Libraries that support SSR (e.g., framer-motion, react-spring) use this pattern to avoid the warning while keeping layout-critical timing on the client.

Tiếng Việt: useLayoutEffect không chạy trên server và sinh cảnh báo SSR. Pattern isomorphic: dùng useLayoutEffect trên client, useEffect trên server. Thư viện animation/layout dùng pattern này để hỗ trợ SSR mà không mất timing chính xác.

---

## Revision Checklist / Danh Sách Ôn Tập

- [ ] Can you explain automatic batching in React 18 and when `flushSync` is needed?
- [ ] Can you explain the functional updater form and a scenario where `setState(value)` would give a wrong result?
- [ ] Can you explain `useEffect` cleanup with a concrete example of a memory leak it prevents?
- [ ] Can you list the three forms of the deps array and explain when each is appropriate?
- [ ] Can you explain what a stale closure is and demonstrate three ways to fix one in a `setInterval` example?
- [ ] Can you explain the two use cases for `useRef` and why mutating `.current` does not trigger a re-render?
- [ ] Can you explain the difference between `useMemo` and `useCallback` and identify a scenario where each is justified?
- [ ] Can you explain `useReducer` and articulate three criteria for choosing it over `useState`?
- [ ] Can you explain why `useContext` causes all consumers to re-render and describe two strategies to prevent unnecessary re-renders?
- [ ] Can you explain the two rules of hooks and the linked-list mechanism that makes them necessary?
- [ ] Can you explain the timing difference between `useLayoutEffect` and `useEffect` and identify when each is appropriate?
- [ ] Can you explain `useImperativeHandle` with a real-world example (custom input focus, media component)?
- [ ] Can you design a custom hook, explain what makes it reusable, and identify when NOT to extract one?
- [ ] Can you explain what error React throws when hooks are called conditionally and why it occurs?
- [ ] Can you explain how Strict Mode's double-invocation of effects helps surface bugs?

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích tại sao "Rules of Hooks" tồn tại — hooks hoạt động như thế nào bên trong không?
- [ ] Tôi có thể giải thích sự khác biệt giữa `useEffect` và `useLayoutEffect` không?
- [ ] Tôi có thể giải thích khi nào dùng `useCallback` vs `useMemo` và tại sao over-optimization có hại không?
- [ ] Tôi có thể tạo một custom hook `useFetch` với loading/error state không?
- [ ] Tôi có thể giải thích `useReducer` vs `useState` và khi nào chọn cái nào không?

💬 **Feynman Prompt:** Giải thích tại sao hook không được gọi trong `if` statement. Vẽ sơ đồ cho thấy điều gì xảy ra với React's internal state array nếu bạn vi phạm rule này.

---

## Connections / Liên Kết

- ⬅️ **Built on:** [React Fundamentals](./01-react-fundamentals.md) — cần hiểu components, state, và `UI = f(state)`
- ➡️ **Enables:** [Advanced Patterns](./04-advanced-patterns.md) | [State Management](./05-state-management.md) | Custom hook libraries
- 🔗 **In practice:** Every modern React component uses hooks — this is the core of React development

[← Previous](./02-react-19-features.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-advanced-patterns.md)
