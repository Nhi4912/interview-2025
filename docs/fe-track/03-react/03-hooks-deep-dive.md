# Hooks Deep Dive / Hooks Chuyên Sâu

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [React Fundamentals](./01-react-fundamentals.md) | [Closures](../01-javascript/03-closures-comprehensive.md)
> **See also**: [Hooks Comprehensive](./07-hooks-comprehensive.md) | [Performance](./09-performance-optimization.md)

[← Previous](./02-react-19-features.md) | [Back to Table of Contents](../../00-table-of-contents.md) | [Next →](./04-advanced-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Bug tại một team fintech 2023:** Component `Dashboard` fetch nhiều API, debounce search, và track scroll position. Với class components: `componentDidMount` chứa 3 unrelated setup calls, `componentWillUnmount` có cleanup code khó match với setup. Một engineer quên cleanup WebSocket listener → memory leak production, sau 30 phút browser tab ăn 500MB RAM.

```jsx
// Class: unrelated logic bunched in same lifecycle
componentDidMount() {
  fetchUserData();      // ← 3 unrelated setups
  initWebSocket();      // ← impossible to separate
  trackScrollPosition();
}
componentWillUnmount() {
  // Which cleanup matches which setup? Easy to miss one
  ws.close(); // ← forgot removeEventListener('scroll', ...)
}
```

**Hooks giải quyết:** mỗi `useEffect` = một logical concern, cleanup ngay trong cùng effect.

---

## What & Why / Cái Gì & Tại Sao

**Analogy — Plugin System:**
Component giống điện thoại. Hooks là plugins: `useState` = plugin bộ nhớ, `useEffect` = plugin scheduler, `useRef` = plugin hardware access. Bạn cắm nhiều plugins, bundle thành custom plugin (custom hook).

**Tại sao Hooks thay thế Class Components:**

| Class | Hooks | Vì sao Hooks tốt hơn |
|-------|-------|---------------------|
| Logic rải trong 3 lifecycle | `useEffect` — logic cùng concern ở cùng chỗ | Easier to read, test, maintain |
| Khó reuse stateful logic | Custom Hooks — tái sử dụng qua extract | No HOC pyramid of doom |
| `this.state`, `.bind(this)` | `useState` — no `this` | Simpler mental model |
| Lifecycle timing ambiguity | Effect timing explicit | Predictable behavior |

**Rules of Hooks — TẠI SAO, không chỉ là gì:**
React lưu hook state trong linked list theo thứ tự gọi trong mỗi fiber. Nếu hooks gọi trong `if`/`loop`, thứ tự thay đổi → index dịch chuyển → hook A đọc state của hook B → corrupted state.

---

## Concept Map / Bản Đồ Khái Niệm

```
   [React Fundamentals: UI = f(state)]
                  │
                  ▼
        [HOOKS DEEP DIVE] ← bạn đang ở đây
                  │
    ┌─────────────┼──────────────┐
    ▼             ▼              ▼
[State]       [Effects]      [Refs/Perf]
useState      useEffect       useRef
useReducer    useLayoutEffect  useMemo
              cleanup fn       useCallback
                  │
                  ▼
           [Custom Hooks]
           useFetch | useDebounce
           useLocalStorage | useIntersection
                  │
                  ▼
           [Context + useReducer]
           → State Management pattern
```

---

## Core Concepts / Khái Niệm Cốt Lõi

---

### 1. useState & useReducer — State Management

> 🧠 **Memory Hook:** "useState = post-it note on the door. Thay giá trị = tear off, put new one. Re-render triggered. useReducer = state machine: (state, action) → newState."

**Tại sao tồn tại? / Why does this exist?**
Components cần "remember" things between renders — without global variables (causes bugs at scale).
→ Tại sao không dùng regular variable? → Variables reset on every function call (every render)
→ Tại sao `setState` triggers re-render? → React subscribes to state changes; `useState` returns setter that schedules reconciliation

#### Layer 1: useState Mechanics

```jsx
// State persists between renders; setter triggers reconciliation
const [count, setCount] = useState(0);

// Functional updater — safe in batched/async contexts
setCount(prev => prev + 1); // ✅ always works
setCount(count + 1);        // ❌ stale in some contexts

// Multiple setState calls in same event = BATCHED (React 18)
function handleClick() {
  setA(1); // } These three setters trigger
  setB(2); // } only ONE re-render
  setC(3); // } (automatic batching in React 18)
}
```

```
useState internal model:
fiber.memoizedState = [
  { value: count, queue: [...updates] },  // hook 0: useState(0)
  { value: name, queue: [...updates] },   // hook 1: useState('')
  // ... one slot per useState call, IN ORDER
]
```

#### Layer 2: useReducer — When State Gets Complex

```jsx
// Classic: loading state with 3 related fields
// ❌ useState — fields can desynced
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

// ✅ useReducer — atomic transitions
const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null });

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':  return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS': return { status: 'success', data: action.data, error: null };
    case 'FETCH_ERROR':  return { status: 'error', data: null, error: action.error };
    default: return state;
  }
}

// Dispatch events, not state
dispatch({ type: 'FETCH_START' });
```

#### Layer 3: State Initialization Patterns

```jsx
// Lazy initialization — avoid expensive computation every render
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('key'))); // ✅ runs once
const [data, setData] = useState(JSON.parse(localStorage.getItem('key')));       // ❌ parses every render

// Reset state by key (from React Fundamentals)
<UserProfile key={userId} /> // changes key = full remount = state reset
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| `setCount(count + 1)` trong async / batched | Captures stale `count` at render time | `setCount(c => c + 1)` — functional updater |
| Mutate state directly: `state.items.push(x)` | React uses reference comparison — no re-render | `setState([...state.items, x])` — new reference |
| Nhiều `useState` cho related fields | Fields có thể desynced nếu update riêng lẻ | `useReducer` hoặc group vào một object |

**🎯 Interview Pattern:**
- Khi thấy: "Tại sao `setCount(count + 1)` gọi 2 lần chỉ tăng 1?"
- → Mở đầu: "Trong React 18, multiple setters batch thành một render. Cả 2 lần gọi đọc cùng `count` từ closure — kết quả: +1 thay vì +2. Fix: functional updater..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: [Closures](../01-javascript/03-closures-comprehensive.md) — state captured in render closure
- ➡️ Để hiểu: useReducer + Context pattern (Redux alternative)

---

### 2. useEffect — Side Effect Scheduling

> 🧠 **Memory Hook:** "useEffect = 'run this AFTER render, and here's how to UNDO it'. Not a lifecycle replacement — it's SYNCHRONIZATION with external systems."

**Tại sao tồn tại? / Why does this exist?**
Side effects (fetch, subscriptions, DOM manipulation) cannot run during render (render must be pure for Concurrent Mode).
→ Tại sao không run immediately after setState? → Must let React finish rendering first, then effects run
→ Tại sao return a cleanup function? → Symmetric setup/teardown prevents memory leaks between re-renders

#### Layer 1: Mental Model — Synchronization, Not Lifecycle

```
useEffect is NOT lifecycle:
  componentDidMount  ≈ useEffect(() => ..., [])  ← but not the same!
  componentDidUpdate ≈ useEffect(() => ..., [dep])
  componentWillUnmount ≈ cleanup function

useEffect IS synchronization:
  "Keep this external system in sync with these React values"
  When values change → cleanup old subscription → setup new subscription
```

#### Layer 2: The 3 Forms + Timing

```jsx
// Form 1: Run after every render (rare — usually a bug signal)
useEffect(() => { document.title = count; }); // no array

// Form 2: Mount only — [](runs once, cleanup on unmount)
useEffect(() => {
  const ws = new WebSocket('ws://...');
  return () => ws.close(); // cleanup on unmount
}, []);

// Form 3: Sync with deps — runs when deps change
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/user/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser);
  return () => controller.abort(); // cleanup: cancel fetch on dep change
}, [userId]);

// TIMING:
// 1. React renders → 2. Browser paints → 3. useEffect runs (async)
// vs useLayoutEffect: runs between 1 and 2 (sync, before paint)
```

#### Layer 3: Common Anti-Patterns

```jsx
// ❌ Anti-pattern 1: Deriving state in useEffect
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName); // extra render!
}, [firstName, lastName]);

// ✅ Derive inline — no effect needed
const fullName = firstName + ' ' + lastName;

// ❌ Anti-pattern 2: Fetching without cleanup (race condition)
useEffect(() => {
  fetch(`/api/${id}`).then(r => r.json()).then(setData); // no cleanup!
}, [id]);
// If id changes before fetch completes, old response overwrites new

// ✅ Cleanup with AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/${id}`, { signal: controller.signal })
    .then(r => r.json()).then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();
}, [id]);
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| Bỏ cleanup khi fetch | Race condition: old response overwrites newer | `AbortController` trong cleanup |
| Derived state trong useEffect | Tạo thêm render cycle không cần thiết | Tính toán inline trong render |
| Object/function trong deps: `[{ page }]` | New reference mỗi render → effect runs every render | Dùng primitives: `[page]` |
| Empty deps `[]` nhưng dùng state bên trong | Stale closure — effect không re-sync | Thêm dependencies, hoặc dùng functional updater |

**🎯 Interview Pattern:**
- Khi thấy: "Giải thích useEffect deps array"
- → Mở đầu: "useEffect deps array mô tả những gì effect cần synchronize với — không phải optimization knob. Thiếu dep = stale closure; thừa dep = effect chạy nhiều hơn cần..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: Stale closures, Event Loop (microtask/macrotask timing)
- ➡️ Để hiểu: useLayoutEffect (sync version), data fetching patterns, React Query

---

### 3. useMemo & useCallback — Reference Stability

> 🧠 **Memory Hook:** "useMemo = memoize the **result**. useCallback = memoize the **function**. `useCallback(fn, deps)` ≡ `useMemo(() => fn, deps)`. Only use when YOU CAN PROVE it's needed."

**Tại sao tồn tại? / Why does this exist?**
JavaScript creates new object/function references on every function call. React.memo's shallow comparison breaks when parent passes new references each render.
→ Tại sao không just memo everything? → Memoization has cost (memory + comparison overhead) — and makes code harder to read
→ When does it help? → Only when the child/hook receiving the reference can skip work because reference is stable

#### Layer 1: Simple Analogy

useMemo và useCallback như **caching ID card**. Thay vì in lại thẻ mới mỗi ngày (new function reference), bạn cấp thẻ 1 lần và chỉ cấp lại khi thông tin thay đổi. Child component dùng thẻ làm tìm kiếm nhanh — nếu thẻ không đổi, không cần tìm lại.

#### Layer 2: When Each is Justified

```jsx
// useMemo — expensive computation
const sortedItems = useMemo(
  () => [...items].sort((a, b) => b.score - a.score), // O(n log n) — worth caching
  [items] // only re-sort when items array changes reference
);

// useCallback — stabilize function for React.memo child or as hook dep
const handleDelete = useCallback(
  (id) => setItems(prev => prev.filter(item => item.id !== id)),
  [] // stable: doesn't close over anything that changes
);

// React.memo — skip re-render if props unchanged
const Item = React.memo(function Item({ item, onDelete }) {
  return <li onClick={() => onDelete(item.id)}>{item.name}</li>;
});
// Only useful if onDelete is stable (useCallback) AND item doesn't change
```

```
Decision checklist for memoization:
1. Profile first — is this actually slow? (React DevTools Profiler)
2. Is the child wrapped in React.memo?
3. Will the reference be stable across renders without memo?
4. Is the computation expensive (> 1ms)?
If all yes → add memo. Otherwise: SKIP IT.
```

#### Layer 3: Common Pitfall — Over-memoization

```jsx
// ❌ Pointless useMemo — cheap computation
const doubled = useMemo(() => count * 2, [count]); // multiplication is instant
// ✅ Just compute inline
const doubled = count * 2;

// ❌ useCallback that creates dep chain
const handleClick = useCallback(() => {
  doSomethingWith(data); // closes over data
}, [data]); // data changes → new handleClick → React.memo child re-renders anyway!
// No benefit — the chain still updates

// ✅ Only memoize if the chain is broken somewhere
```

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm | Tại sao sai | Đúng là |
|---------|------------|---------|
| useMemo cho mọi computation | Memory + comparison overhead > cost of recompute for cheap ops | Profile first, memoize only expensive ops |
| useCallback cho mọi function | Useless without React.memo on receiver or as hook dep | Only when function passes to React.memo'd child or used in dep array |
| Nghĩ memoization = free optimization | It has cost (memory, deps comparison) + complexity | Measure before adding |

**🎯 Interview Pattern:**
- Khi thấy: "useMemo vs useCallback?"
- → Mở đầu: "useMemo caches computed value, useCallback caches function reference — equivalent to `useMemo(() => fn, deps)`. Cả hai chỉ hữu ích khi receiver có thể skip work dựa trên reference stability..."

**🔑 Knowledge Chain:**
- 📚 Cần biết: React.memo, referential equality, reconciliation
- ➡️ Để hiểu: Performance optimization, React DevTools Profiler workflow

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q1: Automatic batching React 18 vs React 17 🟢 Junior

**A:** React 18: all `setState` calls in any context (event handlers, `setTimeout`, Promise callbacks, native events) are batched into one re-render. React 17: only synthetic React event handlers were batched; `setTimeout` / `Promise.then` triggered one re-render per `setState`. Use `flushSync` to opt out of batching.

React 18: mọi setState trong mọi context batch thành một render. React 17: chỉ batch trong synthetic event handler. `flushSync` để thoát khỏi batching khi cần đọc DOM ngay.

**💡 Interview Signal:**
- ✅ Strong: Ví dụ cụ thể (Promise.then với 2 setters → 1 render thay vì 2), biết `flushSync`, giải thích tại sao batching tốt cho performance
- ❌ Weak: "React 18 batch nhiều hơn" — không đủ specific

---

### Q2: Functional updater `setState(prev => ...)` — khi nào cần? 🟢 Junior

**A:** Use functional updater when the next state depends on the previous state. Multiple batched `setState(count + 1)` calls all close over the same stale `count` — only increment once. `setState(c => c + 1)` receives the queued result from each prior call — increments correctly.

Dùng functional updater khi state mới phụ thuộc state cũ. `setState(count + 1)` gọi 2 lần trong batch → cả 2 đọc cùng stale `count` → chỉ tăng 1. `setState(c => c + 1)` mỗi call nhận kết quả của call trước → tăng đúng.

**💡 Interview Signal:**
- ✅ Strong: Giải thích stale closure trong batch context, cũng mention async callbacks (setTimeout, useEffect)
- ❌ Weak: "Dùng khi cần đọc state cũ" — không sai nhưng miss the batching context

---

### Q3: `useEffect` cleanup — tại sao cần, gì xảy ra nếu thiếu? 🟡 Mid

**A:** Cleanup runs synchronously before the next effect execution and on unmount. Without cleanup: event listeners accumulate per render (memory leak), timers keep firing after unmount, async callbacks call `setState` on unmounted components. Mental model: "setup when you enter, teardown when you leave."

Cleanup chạy trước effect lần tiếp theo và khi unmount. Thiếu cleanup: listener chồng chất mỗi render, timer tiếp tục sau unmount, async setState trên unmounted component → memory leak + React warning.

**💡 Interview Signal:**
- ✅ Strong: Concrete examples (WebSocket.close, clearTimeout, AbortController), Strict Mode double-invocation reveals missing cleanup, mental model setup/teardown
- ❌ Weak: "Cleanup để tránh memory leak" — đúng nhưng không giải thích cụ thể

---

### Q4: 3 forms của dependency array — khi nào dùng mỗi dạng? 🟢 Junior

**A:** (1) Omit array — runs after every render (rare; usually bugs). (2) `[]` — runs once on mount, cleanup on unmount. (3) `[a, b]` — runs after render where `a` or `b` changed (via `Object.is`). The deps array describes **what the effect synchronizes with**, not a performance knob. Lying about deps = stale closures.

Ba dạng: không có array — chạy mỗi render; `[]` — chỉ mount; `[a, b]` — chạy khi a hoặc b thay đổi. Deps array mô tả effect đồng bộ với cái gì — không phải để kiểm soát "bao nhiêu lần chạy".

**💡 Interview Signal:**
- ✅ Strong: "Lying about deps = stale closures", explain `Object.is` comparison (why object deps don't work), ESLint `exhaustive-deps` rule
- ❌ Weak: Mô tả 3 dạng đúng nhưng không giải thích mental model

---

### Q5: Stale closure trong hooks — nguyên nhân và 3 cách fix 🟡 Mid

**A:** Each render's closure captures props/state at that moment. `setInterval(() => console.log(count), 1000)` in `useEffect(() => ..., [])` always logs initial `count` (the one at mount). Three fixes: (1) add `count` to deps (new interval on each change — often not desired), (2) use functional updater `setCount(c => c + 1)` (avoid reading count), (3) store latest in ref `countRef.current = count` and read `countRef.current`.

Mỗi render closure capture giá trị tại thời điểm đó. setInterval trong `[]` deps luôn đọc count ban đầu. Ba fix: thêm deps (new interval mỗi lần — thường không muốn), functional updater (không đọc count), hoặc ref `.current`.

**💡 Interview Signal:**
- ✅ Strong: Biết trade-offs của mỗi fix, mention `useRef` là "escape hatch" cho latest value, liên kết đến stale callback pattern
- ❌ Weak: "Thêm count vào deps" — đúng nhưng chỉ là 1 trong 3 solutions, với trade-offs

---

### Q6: `useRef` — 2 use cases, khác `useState` như thế nào? 🟡 Mid

**A:** (1) DOM access: attach `ref` prop to DOM element → imperatively call `.focus()`, measure size, integrate with non-React libraries. (2) Mutable instance variable: persist a value across renders **without** triggering re-render — timer IDs, previous value snapshots, "latest value" escape hatch. Unlike `useState`, mutating `.current` never schedules reconciliation.

Hai dùng chính: DOM node access, và mutable value không trigger render. Khác useState: `.current` mutation không schedule re-render — dùng khi UI không cần phản ánh giá trị đó.

**💡 Interview Signal:**
- ✅ Strong: Cả 2 use cases với ví dụ cụ thể, giải thích tại sao `.current` mutation không trigger render (React không subscribe to ref changes), biết pitfall (ref.current = latest value, nhưng reading stale ref từ effect cũ)
- ❌ Weak: "useRef để access DOM" — chỉ biết một use case

---

### Q7: `useMemo` vs `useCallback` — khi nào dùng? 🟡 Mid

**A:** `useMemo(() => compute(deps), [deps])` returns a memoized computed value. `useCallback(fn, deps)` returns a memoized function reference (≡ `useMemo(() => fn, deps)`). Use `useMemo` for expensive pure computations (sort, filter, build lookup map). Use `useCallback` to stabilize function references passed to `React.memo` children or used as deps in other hooks. Both have overhead — only apply where profiling confirms a bottleneck.

useMemo cache giá trị; useCallback cache function reference. Dùng useMemo cho computation tốn kém; useCallback để ổn định function cho React.memo child hoặc deps array. Cả hai có overhead — chỉ dùng khi profiler xác nhận bottleneck.

**💡 Interview Signal:**
- ✅ Strong: Giải thích `useCallback = useMemo(() => fn, deps)`, biết rằng memoization chỉ help khi receiver CAN skip work, mention Profile-first approach
- ❌ Weak: "useMemo cache value, useCallback cache function" — correct but not enough to show judgment

---

### Q8: `useReducer` vs `useState` — khi nào chọn cái nào? 🟡 Mid

**A:** Prefer `useReducer` when: (1) multiple fields change together in response to one action (loading/data/error), (2) next state depends on complex logic over previous state, (3) you want transitions explicit and unit-testable as pure functions. `useState` for isolated simple values.

useReducer khi: nhiều field thay đổi cùng nhau, logic transition phức tạp, hoặc muốn test state machine dễ dàng. useState cho giá trị đơn giản, độc lập.

**💡 Interview Signal:**
- ✅ Strong: Biết `dispatch` giúp avoid stale closures (no need to read current state), mention it pairs well with Context for lightweight Redux alternative
- ❌ Weak: "useReducer là Redux nhỏ" — oversimplification

---

### Q9: `useContext` gây re-render như thế nào? Fix? 🔴 Senior

**A:** `useContext` subscribes to the entire context value and re-renders whenever it changes via `Object.is`. If provider passes an object literal `{ user, theme }`, every parent render creates a new reference → all consumers re-render. Fixes: (1) split into separate contexts by update frequency, (2) memoize value with `useMemo`, (3) `use-context-selector` for field-level subscriptions.

useContext subscribe toàn bộ value — object literal mới mỗi render = tất cả consumer rerender. Sửa: tách context theo tần suất, useMemo cho value, hoặc `use-context-selector`.

**💡 Interview Signal:**
- ✅ Strong: Giải thích Object.is reference comparison, biết cả 3 strategies với trade-offs, mention that Context is NOT for frequently-updating state (prefer Zustand/Redux for that)
- ❌ Weak: "Dùng useMemo" — biết một fix nhưng không hiểu root cause

---

### Q10: Rules of Hooks — implementation level 🟡 Mid

**A:** React stores hook state in a linked list indexed by call order on each fiber node. Breaking Rule 1 (conditionals/loops) changes the number of hooks between renders → shifts index mapping → hook N reads state stored for a different hook → corrupted state. React throws: "Rendered more hooks than during the previous render."

React lưu hook state trong linked list theo thứ tự gọi của fiber. Vi phạm thứ tự → index dịch → hook N đọc state của hook khác → state hỏng.

**💡 Interview Signal:**
- ✅ Strong: Giải thích linked list model, vẽ được what happens khi vi phạm (slot 0 = useState, slot 1 = useEffect, etc.), biết tại sao name-keyed approach không work (multiple useState calls)
- ❌ Weak: "Vì hooks phải gọi theo thứ tự" — restates the rule, doesn't explain why

---

### Q11: `useLayoutEffect` vs `useEffect` 🔴 Senior

**A:** `useLayoutEffect` fires **synchronously** after DOM mutations but before the browser paints — blocking paint. `useEffect` fires **asynchronously** after paint. Use `useLayoutEffect` when you need to read DOM layout (e.g., `getBoundingClientRect`) and synchronously correct it to prevent visual flicker. Everything else: `useEffect`.

useLayoutEffect: đồng bộ, sau DOM mutations, trước paint — block paint. useEffect: async, sau paint. Dùng useLayoutEffect khi đọc/sửa DOM để tránh flicker. Mọi thứ khác: useEffect.

**💡 Interview Signal:**
- ✅ Strong: Ví dụ cụ thể (tooltip positioning — measure element height then position), biết `useIsomorphicLayoutEffect` pattern cho SSR, biết layout effect có thể cause jank
- ❌ Weak: "useLayoutEffect chạy trước paint" — đúng nhưng không giải thích khi nào cần

---

### Q12: Design custom hook `useFetch` với cancel + loading state 🔴 Senior (Create)

**A:**

```typescript
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, dispatch] = useReducer(
    (s: FetchState<T>, action: any) => {
      switch (action.type) {
        case 'LOADING':  return { data: null, loading: true, error: null };
        case 'SUCCESS':  return { data: action.data, loading: false, error: null };
        case 'ERROR':    return { data: null, loading: false, error: action.error };
        default: return s;
      }
    },
    { data: null, loading: false, error: null }
  );

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'LOADING' });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => dispatch({ type: 'SUCCESS', data }))
      .catch(err => {
        if (err.name !== 'AbortError') dispatch({ type: 'ERROR', error: err });
      });

    return () => controller.abort(); // cancel on url change or unmount
  }, [url]);

  return state;
}

// Usage
function UserCard({ userId }: { userId: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);
  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  return <div>{data?.name}</div>;
}
```

**Key design decisions:** `useReducer` for atomic state transitions (no loading=true while error is set), `AbortController` for race condition prevention, stable URL dependency.

**💡 Interview Signal:**
- ✅ Strong: useReducer for atomic state, AbortController cancel, handle AbortError separately, TypeScript generic, stable `url` dep
- ❌ Weak: Multiple useState (loading/data/error) that can desynced; no cancel

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn

> 🎯 Interviewer hỏi cold: **"Tại sao không được gọi hooks trong điều kiện? Giải thích cơ chế bên trong."**

**30 giây đầu — mở đầu lý tưởng:**
1. "React lưu hook state trong một **linked list** trên mỗi fiber — indexed theo thứ tự gọi, không phải theo tên."
2. "Khi render lần 1: `useState` ở slot 0, `useEffect` ở slot 1. Nếu điều kiện thay đổi và `useState` bị skip ở render lần 2, `useEffect` giờ ở slot 0 và đọc state của `useState` trước đó."
3. "Kết quả: state corruption — hook A đọc state được lưu cho hook B. React throw: 'Rendered more/fewer hooks than during the previous render'."
4. "Đây là lý do Rule 1 tồn tại — không phải convention tùy ý, mà là yêu cầu từ implementation."

---

## Self-Check / Tự Kiểm Tra ⚡

> **Đóng tài liệu lại trước khi làm — không nhìn lại!**

- [ ] **Retrieval**: Vẽ linked list model của hooks từ trí nhớ. Tại sao conditionals phá vỡ nó?
- [ ] **Visual**: Trace `setCount(count + 1)` gọi 2 lần trong batch vs `setCount(c => c + 1)` gọi 2 lần — kết quả khác nhau như thế nào?
- [ ] **Application**: Component fetch user data theo `userId`. Viết `useEffect` đúng cách: loading state, error handling, cancel khi `userId` thay đổi.
- [ ] **Debug**: `useEffect` trong component này chạy mỗi render dù `[]` deps:
  ```jsx
  const options = { page: 1 };
  useEffect(() => fetchData(options), [options]); // why?
  ```
- [ ] **Teach**: Giải thích stale closure trong `setInterval` + `useEffect` cho teammate — dùng "bức ảnh chụp lại" analogy.

💬 **Feynman Prompt:** Giải thích tại sao `useCallback` không phải lúc nào cũng làm app nhanh hơn — cho ví dụ khi nó là waste.

🔁 **Spaced Repetition:** Ôn lại file này sau **3 ngày** → **7 ngày** → **14 ngày**.
