# React Coding Challenges / Thử Thách Code React Trong Phỏng Vấn

> **Track**: FE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [React Fundamentals](../03-react/01-react-fundamentals.md) | [Hooks](../03-react/03-hooks-deep-dive.md) | [Patterns](../03-react/08-react-patterns-advanced.md)

[Back to Table of Contents](../../00-table-of-contents.md) | [JavaScript Challenges](./11-interview-practice-01-javascript-challenges.md) | [Tools Practical](./13-tools-ecosystem-08-tools-practical-applications.md)

## Overview / Tổng Quan

React coding challenges in interviews test your ability to build custom hooks, manage complex state, and handle real-world UI patterns. Interviewers evaluate not just whether your code works, but how you reason about component lifecycle, side-effect cleanup, performance trade-offs, and edge cases.

Bài tập React trong phỏng vấn tập trung vào khả năng xây dựng custom hooks, quản lý state phức tạp, và xử lý các UI pattern thực tế. Interviewer đánh giá không chỉ code chạy được mà còn cách bạn suy luận về lifecycle, cleanup side-effect, trade-off hiệu năng, và edge cases.

**Key topics / Chủ đề chính:**
- Custom hooks: useDebounce, usePrevious, useLocalStorage
- UI patterns: virtual list, infinite scroll
- State management: form validation, undo/redo
- Cross-cutting concerns: cleanup, error boundaries, testing

---

## Challenge 1: useDebounce 🟡 Mid

### Overview / Tổng Quan
useDebounce delays updating a value until a specified time has passed since the last change. This is essential for search inputs, API calls, and any scenario where rapid state changes would cause excessive work.

useDebounce trì hoãn cập nhật giá trị cho đến khi hết khoảng thời gian chờ kể từ lần thay đổi cuối cùng. Rất quan trọng cho search input, API calls, và bất kỳ tình huống nào mà thay đổi state liên tục gây ra quá nhiều xử lý.

### Explanation / Giải thích
- **Cleanup is mandatory**: The `useEffect` return function must call `clearTimeout` to cancel the previous timer. Without this, multiple timers stack up and the debounced value fires multiple times. Cleanup bắt buộc: nếu không `clearTimeout` trong cleanup function, nhiều timer chồng chéo sẽ khiến giá trị debounce bị fire nhiều lần.
- **Dependency array must include both `value` and `delay`**: If `delay` changes (e.g., user adjusts settings), the effect must re-run with the new delay. Omitting `delay` causes stale behavior. Dependency array phải có cả `value` và `delay` -- nếu `delay` thay đổi mà không có trong deps, effect dùng delay cũ.
- **Stale closure trap with callbacks**: If you debounce a callback instead of a value, the closure captures the callback at creation time. Use `useRef` to hold the latest callback. Khi debounce callback thay vì value, closure giữ callback cũ. Dùng `useRef` để luôn giữ callback mới nhất.
- **Strict Mode double-invocation**: React 18 Strict Mode runs effects twice in development. Your cleanup must be idempotent -- calling `clearTimeout` with an already-fired timer ID is safe, but side-effects in the timeout callback may execute unexpectedly. Strict Mode chạy effect 2 lần trong dev, cleanup phải idempotent.
- **Leading vs trailing edge**: The basic implementation only does trailing debounce (fires after delay). For autocomplete, you may want leading edge (fire immediately, then suppress). This requires an additional `isLeading` ref. Bản cơ bản chỉ trailing debounce. Autocomplete có thể cần leading edge -- fire ngay lần đầu rồi chặn.
- **Generic type parameter `<T>`**: The hook accepts any type via generics. For object values, React's `Object.is` comparison in `useState` means a new object reference always triggers an update, even if contents are identical. Generic type `<T>` chấp nhận mọi kiểu. Với object, reference mới luôn trigger update dù nội dung giống.

### Example / Ví dụ
```tsx
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

### Production Tips
- **Test with `jest.useFakeTimers()`**: Advance time with `jest.advanceTimersByTime(delay)` and assert the debounced value. Dùng fake timers để test chính xác timing behavior.
- **Combine with `useTransition`**: For search UIs, wrap the state update triggered by the debounced value in `startTransition` so React can interrupt the render if new input arrives. Kết hợp `useTransition` cho search UI để React có thể interrupt render.
- **Consider `AbortController` for fetch**: When debouncing API calls, cancel in-flight requests in the cleanup function using `AbortController`. Khi debounce API call, dùng `AbortController` để cancel request cũ trong cleanup.
- **Measure real impact**: Use React DevTools Profiler to verify debounce actually reduces renders. Sometimes the bottleneck is elsewhere. Dùng Profiler để xác nhận debounce thật sự giảm render -- đôi khi bottleneck ở chỗ khác.

---

## Challenge 2: usePrevious 🟡 Mid

### Overview / Tổng Quan
usePrevious stores the previous value of a prop or state variable. It demonstrates understanding of the React render cycle and when refs vs state are appropriate.

usePrevious lưu giá trị trước đó của prop hoặc state. Challenge này kiểm tra hiểu biết về render cycle và khi nào dùng ref thay vì state.

### Explanation / Giải thích
- **Why `useRef` instead of `useState`**: Updating a ref does not trigger a re-render. If you used `useState` to store the previous value, you would cause an infinite render loop (set state -> re-render -> set state). Dùng `useRef` vì cập nhật ref không trigger re-render. Nếu dùng `useState`, sẽ tạo vòng lặp render vô hạn.
- **The ref updates after render via `useEffect`**: During the current render, `ref.current` still holds the old value because `useEffect` runs after the DOM paint. This is exactly the behavior we want. Ref được cập nhật trong `useEffect` sau khi render, nên trong render hiện tại, `ref.current` vẫn giữ giá trị cũ.
- **Initial value is `undefined`**: On the first render, there is no previous value. The return type must be `T | undefined`. Handle this in consuming components with nullish coalescing. Giá trị ban đầu là `undefined` -- component sử dụng cần xử lý trường hợp này.
- **Comparison for animations**: usePrevious is commonly used to detect direction of change (e.g., `prev < current` means increasing). This drives CSS transition directions. Thường dùng để detect hướng thay đổi cho animation CSS.
- **Does not work with unmount/remount**: If a component unmounts and remounts, the ref resets. Consider lifting the previous value to a parent or context if persistence across mount cycles is needed. Khi component unmount rồi remount, ref reset. Cần lift lên parent nếu muốn giữ giá trị qua mount cycles.

### Example / Ví dụ
```tsx
import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

### Production Tips
- **Use for transition direction**: Compare `previous` and `current` to determine slide-left vs slide-right animations. Dùng để xác định hướng animation dựa trên so sánh giá trị cũ/mới.
- **Pair with `useMemo` for derived state**: Instead of storing derived calculations in state, compute them from `current` and `previous` inline. Kết hợp `useMemo` để tính derived state từ current/previous thay vì lưu riêng.
- **Consider `useRef` callback pattern**: In some cases, a ref callback assigned during render (before effects) gives you more precise timing control. Trong một số trường hợp, ref callback gán trong render cho timing chính xác hơn.

---

## Challenge 3: useLocalStorage 🟡 Mid

### Overview / Tổng Quan
useLocalStorage synchronizes React state with browser localStorage. It tests your understanding of lazy initialization, serialization, SSR safety, and cross-tab synchronization.

useLocalStorage đồng bộ React state với localStorage. Kiểm tra hiểu biết về lazy initialization, serialization, SSR safety, và đồng bộ giữa các tab.

### Explanation / Giải thích
- **Lazy initializer in `useState`**: The function form `useState(() => ...)` ensures `localStorage.getItem` is called only once, not on every render. Without it, you read from disk on every state update. Dùng function form `useState(() => ...)` để chỉ đọc localStorage 1 lần, không phải mỗi render.
- **`try/catch` around `JSON.parse`**: localStorage stores strings. If another script or the user manually edits the value, `JSON.parse` can throw. Always fall back to the initial value. `JSON.parse` có thể throw nếu data bị corrupt -- luôn fallback về initial value.
- **SSR compatibility**: `localStorage` does not exist on the server. Wrap the access in a check: `typeof window !== 'undefined'`. Next.js and Remix apps will crash without this guard. `localStorage` không tồn tại trên server -- cần guard `typeof window !== 'undefined'` cho SSR.
- **Cross-tab sync with `storage` event**: When another tab modifies the same key, the current tab receives a `storage` event. Listen for it in a separate `useEffect` to keep tabs in sync. Khi tab khác thay đổi cùng key, tab hiện tại nhận `storage` event. Lắng nghe event này để đồng bộ.
- **Key changes should reset state**: If the `key` prop changes, you must re-read from localStorage. Include `key` in the `useEffect` dependency array and consider resetting state. Nếu `key` thay đổi, cần đọc lại localStorage -- đặt `key` trong dependency array.
- **Quota limits**: localStorage has a ~5MB limit per origin. For large data, consider IndexedDB. `JSON.stringify` of circular objects throws. localStorage giới hạn ~5MB -- với data lớn nên dùng IndexedDB.

### Example / Ví dụ
```tsx
import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    const raw = localStorage.getItem(key);
    if (!raw) return initial;
    try { return JSON.parse(raw) as T; } catch { return initial; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Production Tips
- **Add `storage` event listener for cross-tab sync**: `window.addEventListener('storage', handler)` fires only in other tabs, not the one that made the change. Thêm listener `storage` event để đồng bộ giữa các tab -- event chỉ fire ở tab khác.
- **Use `useSyncExternalStore` for React 18+**: This hook is designed for exactly this pattern -- synchronizing with an external store while being concurrent-mode safe. Dùng `useSyncExternalStore` cho React 18+ để an toàn với concurrent mode.
- **Debounce writes for frequently changing values**: If the value changes on every keystroke, debounce the `localStorage.setItem` call to avoid disk I/O on every render. Debounce việc ghi vào localStorage nếu value thay đổi liên tục.
- **Test with `Storage` mock**: In tests, mock `localStorage` with a simple `Map`-based implementation to avoid flaky tests from shared state. Trong test, mock localStorage bằng Map để tránh shared state giữa các test.

---

## Challenge 4: Virtual List 🔴 Senior

### Overview / Tổng Quan
Virtual list (windowing) renders only the visible rows of a large list, keeping DOM node count constant regardless of data size. This is a senior-level challenge that tests layout math, scroll handling, and performance optimization.

Virtual list (windowing) chỉ render các row đang hiển thị, giữ số DOM node cố định bất kể kích thước data. Đây là bài senior kiểm tra tính toán layout, xử lý scroll, và tối ưu hiệu năng.

### Explanation / Giải thích
- **Core math**: `startIndex = Math.floor(scrollTop / rowHeight)`, `visibleCount = Math.ceil(containerHeight / rowHeight)`. Add an overscan buffer (2-4 extra rows above and below) to prevent white flashes during fast scrolling. Công thức cốt lõi: tính startIndex từ scrollTop và số row hiển thị từ chiều cao container. Thêm overscan buffer để tránh nhấp nháy trắng khi scroll nhanh.
- **Absolute positioning for visible items**: Each visible item uses `position: absolute; top: index * rowHeight`. The outer container has `position: relative` and total height `items.length * rowHeight` to maintain correct scrollbar size. Mỗi item dùng `position: absolute` với `top` tính từ index. Container ngoài có height bằng tổng chiều cao để scrollbar đúng.
- **`key` must be stable**: Using array index as key causes React to reuse DOM nodes incorrectly when items shift. Use a stable identifier from the data (ID, unique string). `key` phải ổn định -- dùng ID từ data, không dùng array index vì item dịch chuyển khi scroll.
- **Variable row heights**: For rows with different heights, maintain a cumulative height array or use a binary search to find the start index. This significantly increases complexity. Với row height khác nhau, cần mảng chiều cao tích lũy hoặc binary search để tìm startIndex -- độ phức tạp tăng đáng kể.
- **Scroll event throttling**: `onScroll` fires at 60+ fps. Use `requestAnimationFrame` or throttle to avoid excessive state updates. In React 18, `setState` within scroll handlers is automatically batched. `onScroll` fire 60+ lần/giây. Dùng `requestAnimationFrame` hoặc throttle. React 18 tự động batch setState trong scroll handler.
- **Interview framing**: Explain the O(1) DOM node complexity vs O(n) naive rendering. Mention trade-offs: accessibility (screen readers cannot scan hidden items), find-in-page limitations, and keyboard navigation complexity. Trong phỏng vấn, giải thích O(1) DOM nodes vs O(n). Nêu trade-off: accessibility, find-in-page bị giới hạn, keyboard navigation phức tạp.

### Example / Ví dụ
```tsx
import { useMemo, useState } from 'react';

export function VirtualList({ items, rowHeight = 36, height = 360 }: { items: string[]; rowHeight?: number; height?: number }) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight) + 4;
  const visible = useMemo(() => items.slice(start, start + visibleCount), [items, start, visibleCount]);

  return (
    <div style={{ height, overflow: 'auto' }} onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}>
      <div style={{ height: items.length * rowHeight, position: 'relative' }}>
        {visible.map((item, i) => {
          const index = start + i;
          return <div key={item} style={{ position: 'absolute', top: index * rowHeight, height: rowHeight }}>{item}</div>;
        })}
      </div>
    </div>
  );
}
```

### Production Tips
- **Use `react-window` or `@tanstack/virtual` in production**: Hand-rolling is great for interviews but production needs accessibility, variable heights, and horizontal scrolling support. Trong production dùng thư viện chuyên dụng cho accessibility và feature đầy đủ.
- **Memoize row components**: Wrap each row in `React.memo` to prevent re-renders when only `scrollTop` changes but the row data is the same. Wrap mỗi row trong `React.memo` để tránh re-render khi chỉ scrollTop thay đổi.
- **Test with 100k+ items**: Verify that FPS stays above 55 with large datasets. Use Chrome DevTools Performance panel to profile. Test với 100k+ items, kiểm tra FPS > 55 bằng Performance panel.
- **Handle resize**: Add a `ResizeObserver` on the container to recalculate `visibleCount` when the viewport changes. Dùng `ResizeObserver` để tính lại khi container thay đổi kích thước.

---

## Challenge 5: Infinite Scroll 🟡 Mid

### Overview / Tổng Quan
Infinite scroll loads more data when the user scrolls near the bottom of a list. It tests your knowledge of `IntersectionObserver`, cleanup, race conditions, and loading state management.

Infinite scroll tải thêm data khi user scroll gần cuối danh sách. Kiểm tra kiến thức về `IntersectionObserver`, cleanup, race conditions, và quản lý loading state.

### Explanation / Giải thích
- **`IntersectionObserver` vs scroll event**: `IntersectionObserver` is more performant because the browser handles the intersection check natively, off the main thread. Scroll events require manual threshold calculation and throttling. `IntersectionObserver` hiệu năng hơn vì browser xử lý native, không block main thread. Scroll event cần tính threshold thủ công.
- **Sentinel element pattern**: Place an invisible div at the bottom of the list. When it enters the viewport, trigger `loadMore`. This is cleaner than calculating scroll position. Đặt div ẩn ở cuối danh sách. Khi nó vào viewport, trigger `loadMore`. Sạch hơn tính scroll position.
- **Cleanup on unmount**: `observer.disconnect()` in the cleanup function prevents memory leaks and callbacks on unmounted components. `observer.disconnect()` trong cleanup ngăn memory leak và callback trên component đã unmount.
- **`rootMargin` for prefetching**: Setting `rootMargin: '150px'` starts loading before the user reaches the bottom, creating a smoother experience. Đặt `rootMargin: '150px'` để tải trước khi user tới cuối, tạo trải nghiệm mượt hơn.
- **Guard against duplicate fetches**: Track `isLoading` state and skip `loadMore` if a fetch is already in flight. Without this guard, fast scrolling can trigger multiple concurrent requests for the same page. Theo dõi `isLoading` để tránh gọi `loadMore` nhiều lần khi scroll nhanh.
- **Stable `loadMore` reference**: If `loadMore` is recreated on every render (inline arrow function), the `useEffect` re-runs and reconnects the observer. Wrap `loadMore` in `useCallback` or use a ref. Nếu `loadMore` tạo mới mỗi render, effect chạy lại và reconnect observer. Dùng `useCallback` hoặc ref.

### Example / Ví dụ
```tsx
import { useEffect, useRef } from 'react';

export function useInfiniteScroll(loadMore: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '150px' });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return ref;
}
```

### Production Tips
- **Combine with virtual list for large datasets**: Infinite scroll loads data incrementally, virtual list renders only visible items. Together they handle unbounded lists efficiently. Kết hợp virtual list cho dataset lớn -- infinite scroll tải dần, virtual list chỉ render item hiển thị.
- **Add error retry with exponential backoff**: Network failures should not break the scroll. Show a "Retry" button on error and implement exponential backoff for automatic retries. Thêm retry với exponential backoff khi mạng lỗi. Hiện nút "Retry" cho user.
- **Track `hasMore` flag**: Stop observing when the server indicates there are no more pages. Otherwise the observer fires `loadMore` infinitely. Theo dõi `hasMore` -- ngừng observe khi server báo hết data.
- **Test the observer**: In tests, mock `IntersectionObserver` and manually trigger the callback to simulate scroll. Trong test, mock `IntersectionObserver` và trigger callback thủ công.

---

## Challenge 6: Form Validation 🟡 Mid

### Overview / Tổng Quan
Building a form validation hook tests your ability to manage derived state, handle user experience timing (when to show errors), and structure reusable form logic.

Xây dựng form validation hook kiểm tra khả năng quản lý derived state, xử lý timing hiển thị lỗi, và cấu trúc logic form tái sử dụng.

### Explanation / Giải thích
- **Derived state via `useMemo`**: Errors are computed from values, not stored independently. This eliminates the bug class where errors and values get out of sync. Errors được tính từ values qua `useMemo`, không lưu riêng. Loại bỏ bug đồng bộ giữa errors và values.
- **Validation timing -- blur vs change vs submit**: Showing errors on every keystroke is aggressive. Common UX pattern: validate on blur (first touch), then on change (after first error shown). Hiển thị lỗi mỗi keystroke quá aggressive. UX phổ biến: validate on blur lần đầu, sau đó on change.
- **Touched/dirty tracking**: Track which fields the user has interacted with (`touched` map) and only show errors for touched fields. This prevents showing errors on a pristine form. Theo dõi field nào user đã tương tác (`touched`) và chỉ hiện lỗi cho field đã touched.
- **Schema-based validation**: For production forms, pass a validation schema (Zod, Yup) rather than hardcoding rules. The hook becomes `useForm<T>(schema, initialValues)`. Cho production, truyền validation schema (Zod, Yup) thay vì hardcode rules. Hook thành `useForm<T>(schema, initialValues)`.
- **Async validation**: Email uniqueness checks require async validation. Handle with debounced API calls and a separate `asyncErrors` state that merges with sync errors. Kiểm tra email unique cần async validation. Xử lý bằng debounced API call và `asyncErrors` state riêng.
- **Controlled vs uncontrolled**: This example uses controlled inputs (React state drives the input value). For performance-sensitive forms with many fields, consider uncontrolled inputs with `useRef` and validate only on submit. Ví dụ này dùng controlled input. Với form nhiều field, uncontrolled + validate on submit hiệu năng tốt hơn.

### Example / Ví dụ
```tsx
import { useMemo, useState } from 'react';

type Values = { email: string; password: string };

export function useLoginForm() {
  const [values, setValues] = useState<Values>({ email: '', password: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => ({
    email: /.+@.+\..+/.test(values.email) ? '' : 'Invalid email',
    password: values.password.length >= 8 ? '' : 'Min 8 chars',
  }), [values]);

  const visibleErrors = useMemo(() => ({
    email: touched.email ? errors.email : '',
    password: touched.password ? errors.password : '',
  }), [errors, touched]);

  const valid = !errors.email && !errors.password;

  const handleBlur = (field: keyof Values) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return { values, setValues, errors: visibleErrors, valid, handleBlur };
}
```

### Production Tips
- **Use `react-hook-form` for complex forms**: It uses uncontrolled inputs internally, reducing re-renders from O(fields) to O(1) per keystroke. Dùng `react-hook-form` cho form phức tạp -- dùng uncontrolled input, giảm re-render từ O(fields) xuống O(1).
- **Validate on submit as final gate**: Even with inline validation, always re-validate all fields on submit to catch edge cases. Luôn validate lại tất cả field khi submit, dù đã có inline validation.
- **Accessibility**: Associate error messages with inputs via `aria-describedby`. Announce errors to screen readers with `aria-live="polite"`. Liên kết error message với input qua `aria-describedby`. Dùng `aria-live="polite"` cho screen reader.
- **Test form flows end-to-end**: Use Testing Library's `userEvent.type()` and `userEvent.tab()` to simulate real user interaction patterns. Dùng `userEvent.type()` và `userEvent.tab()` để simulate tương tác thật.

---

## Challenge 7: Undo/Redo 🔴 Senior

### Overview / Tổng Quan
Implementing undo/redo tests your understanding of immutable state management, the command pattern, and performance implications of state history. This is a common senior-level challenge.

Implement undo/redo kiểm tra hiểu biết về immutable state, command pattern, và hiệu năng khi lưu state history. Đây là bài phỏng vấn phổ biến cho senior.

### Explanation / Giải thích
- **Three-stack architecture**: Past (array of previous states), present (current state), and future (array of undone states). Each `set` pushes present to past and clears future. Kiến trúc 3 stack: past (các state trước), present (state hiện tại), future (các state đã undo). Mỗi `set` đẩy present vào past và xóa future.
- **Undo pops from past, pushes present to future**: `undo` takes the last item from `past`, makes it `present`, and pushes the old `present` onto `future`. Guard against empty `past` array. `undo` lấy item cuối từ `past`, đặt làm `present`, đẩy `present` cũ vào `future`. Kiểm tra `past` không rỗng.
- **Redo pops from future, pushes present to past**: Mirror of undo. Clearing future on new `set` is critical -- otherwise redo could restore a state that conflicts with the new change. `redo` là phép nghịch đảo của undo. Xóa future khi `set` mới rất quan trọng để tránh xung đột state.
- **Memory concerns with large state**: Storing full snapshots of complex objects can consume significant memory. Alternatives: store diffs/patches (like Immer's patches), or limit history length with a max size. Lưu full snapshot tốn bộ nhớ. Giải pháp: lưu diff/patch (như Immer patches), hoặc giới hạn history length.
- **Batching multiple state updates**: Related changes (e.g., moving + resizing an element) should be a single undo step. Provide a `batch` or `transaction` API that groups changes. Các thay đổi liên quan nên gộp thành 1 undo step. Cung cấp API `batch` hoặc `transaction` để gom nhóm.
- **Concurrency with `useState` updater form**: The example uses the updater form `setPast(p => ...)` to avoid stale closure issues. This is critical when `undo`/`redo` may be called rapidly. Dùng updater form `setPast(p => ...)` để tránh stale closure khi undo/redo được gọi liên tục.

### Example / Ví dụ
```tsx
import { useCallback, useState } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((next: T) => {
    setPast((p) => [...p, present]);
    setPresent(next);
    setFuture([]);
  }, [present]);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const copy = [...p];
      const prev = copy.pop()!;
      setFuture((f) => [present, ...f]);
      setPresent(prev);
      return copy;
    });
  }, [present]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const [next, ...rest] = f;
      setPast((p) => [...p, present]);
      setPresent(next);
      return rest;
    });
  }, [present]);

  return { present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
```

### Production Tips
- **Add keyboard shortcuts**: Listen for `Ctrl+Z` (undo) and `Ctrl+Shift+Z` / `Ctrl+Y` (redo). Remember to call `e.preventDefault()` to avoid browser default undo in text inputs. Thêm keyboard shortcut `Ctrl+Z` / `Ctrl+Shift+Z`. Nhớ `e.preventDefault()` để tránh browser undo mặc định.
- **Cap history length**: For memory-sensitive applications, limit `past` to the last N entries (e.g., 100). Drop the oldest entry when the limit is exceeded. Giới hạn `past` tối đa N entries (ví dụ 100) để tiết kiệm bộ nhớ.
- **Use `useReducer` for complex state**: When undo/redo combines with other actions, `useReducer` provides a cleaner dispatch model than multiple `useState` calls. Dùng `useReducer` khi undo/redo kết hợp nhiều action khác -- dispatch model sạch hơn nhiều `useState`.
- **Persist history to sessionStorage**: For resilience against accidental page refreshes, serialize the undo stack to `sessionStorage`. Serialize undo stack vào `sessionStorage` để bảo vệ khi user refresh trang.

---

## Interview Q&A / Cau Hoi Phong Van

### Q1: What is the difference between debounce and throttle in React? 🟢 Junior

**A:** Debounce waits until the user stops performing an action for a specified delay before executing. Throttle executes at most once per interval regardless of how many times the action fires. In React hooks, debounce uses `setTimeout` with cleanup (`clearTimeout`), while throttle uses a ref to track the last execution timestamp.

**Vietnamese:** Debounce chờ user ngừng thao tác trong khoảng delay rồi mới thực thi. Throttle thực thi tối đa 1 lần mỗi interval. Trong React hooks, debounce dùng `setTimeout` + cleanup, throttle dùng ref để theo dõi timestamp lần chạy cuối.

### Q2: Why does usePrevious use `useRef` instead of `useState`? 🟢 Junior

**A:** `useRef` updates do not trigger re-renders. If `useState` were used, updating the previous value would cause a new render, which would update the previous value again, creating an infinite loop. `useRef` stores the value silently and is read synchronously during render.

**Vietnamese:** `useRef` cập nhật không trigger re-render. Nếu dùng `useState`, cập nhật previous value sẽ gây render mới, rồi lại cập nhật previous value, tạo vòng lặp vô hạn. `useRef` lưu giá trị im lặng và đọc đồng bộ trong render.

### Q3: How do you handle SSR with useLocalStorage? 🟡 Mid

**A:** Guard `localStorage` access with `typeof window !== 'undefined'`. During server-side rendering, return the initial/fallback value. Hydration mismatch can occur if the server-rendered HTML differs from the client-side localStorage value -- use `useEffect` to sync after mount to avoid this.

**Vietnamese:** Bọc truy cập `localStorage` với `typeof window !== 'undefined'`. Khi SSR, trả về giá trị initial. Hydration mismatch xảy ra nếu HTML server khác giá trị localStorage client -- dùng `useEffect` để sync sau mount để tránh lỗi này.

### Q4: How do you handle variable row heights in a virtual list? 🔴 Senior

**A:** Maintain a cumulative height array where `heights[i]` is the sum of all row heights from 0 to i. Use binary search (instead of division) to find the start index from scrollTop. For unknown heights, use a `ResizeObserver` on each rendered row to measure actual height and update the cumulative array. Libraries like `react-window` offer a `VariableSizeList` component for this.

**Vietnamese:** Dùng mảng chiều cao tích lũy `heights[i]` = tổng chiều cao từ row 0 đến i. Dùng binary search (thay vì phép chia) để tìm startIndex từ scrollTop. Với chiều cao chưa biết, dùng `ResizeObserver` trên mỗi row để đo chiều cao thực và cập nhật mảng. Thư viện `react-window` có `VariableSizeList` cho trường hợp này.

### Q5: How do you prevent duplicate fetches in infinite scroll? 🟡 Mid

**A:** Track loading state with a `isLoading` ref or state variable. In the `IntersectionObserver` callback, check `if (isLoading) return` before calling `loadMore`. Also ensure `loadMore` is wrapped in `useCallback` with correct dependencies so the observer does not disconnect and reconnect on every render.

**Vietnamese:** Theo dõi trạng thái loading bằng ref hoặc state `isLoading`. Trong callback `IntersectionObserver`, kiểm tra `if (isLoading) return` trước khi gọi `loadMore`. Đảm bảo `loadMore` được wrap trong `useCallback` với đúng dependencies để observer không disconnect/reconnect mỗi render.

### Q6: When should you use controlled vs uncontrolled inputs for form validation? 🟡 Mid

**A:** Controlled inputs (state-driven) give you real-time access to values for inline validation and conditional rendering. Uncontrolled inputs (ref-driven) are better for performance with many fields since they avoid re-rendering the entire form on every keystroke. Use controlled for small forms with complex validation UX, uncontrolled for large forms where validation only happens on submit.

**Vietnamese:** Controlled input (state-driven) cho truy cập realtime để validate inline. Uncontrolled input (ref-driven) tốt hơn cho hiệu năng với nhiều field vì không re-render toàn form mỗi keystroke. Dùng controlled cho form nhỏ với UX validation phức tạp, uncontrolled cho form lớn chỉ validate khi submit.

### Q7: How do you implement undo batching for related operations? 🔴 Senior

**A:** Provide a `transaction` or `batch` API that temporarily buffers `set` calls without pushing intermediate states to the `past` array. One approach: accept a callback `batch((set) => { set(a); set(b); })` where only the final state is recorded. Alternatively, use Immer patches to record granular changes and group them by a transaction ID.

**Vietnamese:** Cung cấp API `transaction` hoặc `batch` tạm buffer các `set` call mà không đẩy state trung gian vào `past`. Một cách: nhận callback `batch((set) => { set(a); set(b); })` chỉ ghi nhận state cuối cùng. Hoặc dùng Immer patches để ghi thay đổi chi tiết và gom nhóm theo transaction ID.

### Q8: How does React 18 Strict Mode affect custom hooks with timers? 🟡 Mid

**A:** Strict Mode intentionally double-invokes effects in development to surface cleanup bugs. For timer-based hooks, this means `setTimeout` runs, gets cleaned up via `clearTimeout`, then runs again. If your cleanup is correct, the behavior is identical to production. If cleanup is missing, you see double execution -- which is the point: Strict Mode reveals the bug early.

**Vietnamese:** Strict Mode cố tình chạy effect 2 lần trong development để phát hiện bug cleanup. Với timer hooks, `setTimeout` chạy, bị cleanup qua `clearTimeout`, rồi chạy lại. Nếu cleanup đúng, behavior giống production. Nếu thiếu cleanup, bạn thấy chạy 2 lần -- đó là mục đích: Strict Mode phát hiện bug sớm.

### Q9: What are the accessibility trade-offs of virtual lists? 🔴 Senior

**A:** Virtual lists render only visible items, which means: (1) screen readers cannot enumerate all items -- use `aria-setsize` and `aria-posinset` to communicate the total count; (2) browser find-in-page (Ctrl+F) only searches rendered DOM, missing off-screen items; (3) keyboard navigation (Tab, arrow keys) must be manually implemented since non-rendered items have no DOM nodes to focus. Consider rendering a complete semantic list off-screen for accessibility or providing a search/filter alternative.

**Vietnamese:** Virtual list chỉ render item hiển thị, nghĩa là: (1) screen reader không liệt kê được tất cả item -- dùng `aria-setsize` và `aria-posinset`; (2) Ctrl+F chỉ tìm trong DOM đã render; (3) keyboard navigation phải tự implement vì item chưa render không có DOM node. Cân nhắc render danh sách semantic đầy đủ ẩn cho accessibility hoặc cung cấp search/filter thay thế.

### Q10: How would you test a useDebounce hook? 🟢 Junior

**A:** Use `@testing-library/react`'s `renderHook` with `jest.useFakeTimers()`. Set an initial value, rerender with a new value, assert the debounced value has not changed yet, then call `jest.advanceTimersByTime(delay)` and assert the debounced value matches the new value. Also test that rapid value changes only result in one final update after the delay.

**Vietnamese:** Dùng `renderHook` từ Testing Library với `jest.useFakeTimers()`. Set giá trị ban đầu, rerender với giá trị mới, assert debounced value chưa thay đổi, rồi `jest.advanceTimersByTime(delay)` và assert debounced value đã cập nhật. Test thêm rằng thay đổi giá trị liên tục chỉ tạo 1 lần update cuối cùng sau delay.

### Q11: How do you optimize useUndoRedo for large state objects? 🔴 Senior

**A:** Instead of storing full state snapshots in the `past` array, store diffs (patches). Use Immer's `produceWithPatches` to generate forward and inverse patches. Undo applies inverse patches; redo applies forward patches. This reduces memory from O(n * stateSize) to O(n * patchSize). Additionally, cap the history length and consider using `structuredClone` only for the initial snapshot.

**Vietnamese:** Thay vì lưu full snapshot trong `past`, lưu diffs (patches). Dùng `produceWithPatches` của Immer để tạo forward và inverse patches. Undo apply inverse patches, redo apply forward patches. Giảm bộ nhớ từ O(n * stateSize) xuống O(n * patchSize). Thêm giới hạn history length và chỉ dùng `structuredClone` cho snapshot ban đầu.

### Q12: How do you synchronize useLocalStorage across browser tabs? 🟡 Mid

**A:** Listen for the `storage` event on `window`. This event fires in all tabs except the one that made the change. In the handler, check if `event.key` matches your storage key, then parse `event.newValue` and update React state. Remember to remove the listener in the cleanup function. Note: the `storage` event does not fire for `sessionStorage`.

**Vietnamese:** Lắng nghe `storage` event trên `window`. Event này fire ở tất cả tab trừ tab đã thay đổi. Trong handler, kiểm tra `event.key` khớp storage key, parse `event.newValue` và update React state. Nhớ remove listener trong cleanup. Lưu ý: `storage` event không fire cho `sessionStorage`.
